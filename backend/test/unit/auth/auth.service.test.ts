result\ontend/**
 * Authentication Service Unit Tests
 * Comprehensive testing for authentication, authorization, and security
 */

import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../../../src/auth/auth.service';
import { PrismaService } from '../../../src/prisma/prisma.service';
import { SecurityTestUtils, MockFactory } from '../../setup/enterprise-setup';

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: JwtService;
  let prismaService: PrismaService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
            verify: jest.fn(),
            decode: jest.fn()
          }
        },
        {
          provide: PrismaService,
          useValue: {
            user: {
              findUnique: jest.fn(),
              create: jest.fn(),
              update: jest.fn(),
              delete: jest.fn()
            },
            tenant: {
              findUnique: jest.fn()
            }
          }
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn()
          }
        }
      ]
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
    prismaService = module.get<PrismaService>(PrismaService);
    configService = module.get<ConfigService>(ConfigService);
  });

  describe('User Authentication', () => {
    it('should authenticate user with valid credentials', async () => {
      const mockUser = MockFactory.createUser();
      const mockTenant = { id: 'tenant-123', name: 'Test Tenant' };
      
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(mockUser);
      jest.spyOn(prismaService.tenant, 'findUnique').mockResolvedValue(mockTenant);
      jest.spyOn(jwtService, 'sign').mockReturnValue('mock-jwt-token');
      jest.spyOn(configService, 'get').mockReturnValue('test-secret');

      const result = await service.validateUser('test@example.com', 'password123');

      expect(result).toEqual({
        user: mockUser,
        tenant: mockTenant,
        access_token: 'mock-jwt-token'
      });
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'test@example.com' }
      });
    });

    it('should reject authentication with invalid credentials', async () => {
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(null);

      const result = await service.validateUser('invalid@example.com', 'wrongpassword');

      expect(result).toBeNull();
    });

    it('should handle authentication errors gracefully', async () => {
      jest.spyOn(prismaService.user, 'findUnique').mockRejectedValue(new Error('Database error'));

      await expect(service.validateUser('test@example.com', 'password123'))
        .rejects.toThrow('Database error');
    });
  });

  describe('JWT Token Management', () => {
    it('should generate valid JWT token', async () => {
      const mockUser = MockFactory.createUser();
      const mockPayload = { sub: mockUser.id, email: mockUser.email, tenant_id: mockUser.tenant_id };
      
      jest.spyOn(jwtService, 'sign').mockReturnValue('mock-jwt-token');
      jest.spyOn(configService, 'get').mockReturnValue('test-secret');

      const token = await service.generateToken(mockUser);

      expect(token).toBe('mock-jwt-token');
      expect(jwtService.sign).toHaveBeenCalledWith(mockPayload, {
        secret: 'test-secret',
        expiresIn: '1h'
      });
    });

    it('should verify valid JWT token', async () => {
      const mockPayload = { sub: 'user-123', email: 'test@example.com', tenant_id: 'tenant-123' };
      
      jest.spyOn(jwtService, 'verify').mockReturnValue(mockPayload);

      const result = await service.verifyToken('valid-jwt-token');

      expect(result).toEqual(mockPayload);
      expect(jwtService.verify).toHaveBeenCalledWith('valid-jwt-token', {
        secret: 'test-secret'
      });
    });

    it('should reject invalid JWT token', async () => {
      jest.spyOn(jwtService, 'verify').mockImplementation(() => {
        throw new Error('Invalid token');
      });

      await expect(service.verifyToken('invalid-jwt-token'))
        .rejects.toThrow('Invalid token');
    });

    it('should handle expired JWT token', async () => {
      jest.spyOn(jwtService, 'verify').mockImplementation(() => {
        throw new Error('Token expired');
      });

      await expect(service.verifyToken('expired-jwt-token'))
        .rejects.toThrow('Token expired');
    });
  });

  describe('Password Security', () => {
    it('should hash password securely', async () => {
      const password = 'testpassword123';
      const hashedPassword = await service.hashPassword(password);

      expect(hashedPassword).toBeDefined();
      expect(hashedPassword).not.toBe(password);
      expect(hashedPassword.length).toBeGreaterThan(50);
    });

    it('should verify password correctly', async () => {
      const password = 'testpassword123';
      const hashedPassword = await service.hashPassword(password);

      const isValid = await service.verifyPassword(password, hashedPassword);
      expect(isValid).toBe(true);
    });

    it('should reject incorrect password', async () => {
      const password = 'testpassword123';
      const wrongPassword = 'wrongpassword';
      const hashedPassword = await service.hashPassword(password);

      const isValid = await service.verifyPassword(wrongPassword, hashedPassword);
      expect(isValid).toBe(false);
    });

    it('should enforce password complexity requirements', async () => {
      const weakPasswords = ['123', 'password', 'abc', 'qwerty'];
      
      for (const password of weakPasswords) {
        await expect(service.validatePasswordStrength(password))
          .rejects.toThrow('Password does not meet complexity requirements');
      }
    });

    it('should accept strong passwords', async () => {
      const strongPasswords = [
        'StrongPass123!',
        'MySecure@Password1',
        'ComplexP@ssw0rd!'
      ];
      
      for (const password of strongPasswords) {
        const isValid = await service.validatePasswordStrength(password);
        expect(isValid).toBe(true);
      }
    });
  });

  describe('Multi-Factor Authentication', () => {
    it('should generate MFA secret', async () => {
      const mockUser = MockFactory.createUser();
      
      const result = await service.generateMFASecret(mockUser.id);

      expect(result).toHaveProperty('secret');
      expect(result).toHaveProperty('qrCode');
      expect(result.secret).toBeDefined();
      expect(result.qrCode).toBeDefined();
    });

    it('should verify MFA token', async () => {
      const mockUser = MockFactory.createUser();
      const token = '123456';
      
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue({
        ...mockUser,
        mfa_secret: 'mock-mfa-secret'
      });

      const result = await service.verifyMFAToken(mockUser.id, token);

      expect(result).toBeDefined();
    });

    it('should reject invalid MFA token', async () => {
      const mockUser = MockFactory.createUser();
      const invalidToken = '000000';
      
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue({
        ...mockUser,
        mfa_secret: 'mock-mfa-secret'
      });

      const result = await service.verifyMFAToken(mockUser.id, invalidToken);

      expect(result).toBe(false);
    });
  });

  describe('Session Management', () => {
    it('should create user session', async () => {
      const mockUser = MockFactory.createUser();
      const sessionData = {
        user_id: mockUser.id,
        ip_address: '192.168.1.1',
        user_agent: 'Mozilla/5.0...'
      };

      const result = await service.createSession(sessionData);

      expect(result).toHaveProperty('session_id');
      expect(result).toHaveProperty('expires_at');
      expect(result.user_id).toBe(mockUser.id);
    });

    it('should validate active session', async () => {
      const sessionId = 'session-123';
      const mockSession = {
        id: sessionId,
        user_id: 'user-123',
        expires_at: new Date(Date.now() + 3600000), // 1 hour from now
        is_active: true
      };

      const result = await service.validateSession(sessionId);

      expect(result).toBeDefined();
      expect(result.is_active).toBe(true);
    });

    it('should invalidate expired session', async () => {
      const sessionId = 'expired-session-123';
      const mockSession = {
        id: sessionId,
        user_id: 'user-123',
        expires_at: new Date(Date.now() - 3600000), // 1 hour ago
        is_active: false
      };

      const result = await service.validateSession(sessionId);

      expect(result).toBeNull();
    });

    it('should revoke user session', async () => {
      const sessionId = 'session-123';
      
      const result = await service.revokeSession(sessionId);

      expect(result).toBe(true);
    });
  });

  describe('Security Tests', () => {
    it('should prevent SQL injection in login', async () => {
      const maliciousPayloads = SecurityTestUtils.generateMaliciousPayloads();
      
      for (const payload of maliciousPayloads.sqlInjection) {
        jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(null);
        
        const result = await service.validateUser(payload, 'password');
        
        expect(result).toBeNull();
        expect(prismaService.user.findUnique).toHaveBeenCalledWith({
          where: { email: payload }
        });
      }
    });

    it('should prevent brute force attacks', async () => {
      const email = 'test@example.com';
      const maxAttempts = 5;
      
      // Simulate multiple failed attempts
      for (let i = 0; i < maxAttempts; i++) {
        jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(null);
        await service.validateUser(email, 'wrongpassword');
      }
      
      // Should be rate limited after max attempts
      await expect(service.validateUser(email, 'password'))
        .rejects.toThrow('Too many failed login attempts');
    });

    it('should validate JWT token integrity', async () => {
      const invalidTokens = SecurityTestUtils.generateInvalidTokens();
      
      for (const [type, token] of Object.entries(invalidTokens)) {
        jest.spyOn(jwtService, 'verify').mockImplementation(() => {
          throw new Error(`Invalid ${type} token`);
        });
        
        await expect(service.verifyToken(token))
          .rejects.toThrow(`Invalid ${type} token`);
      }
    });

    it('should enforce secure password policies', async () => {
      const insecurePasswords = [
        'password',
        '123456',
        'admin',
        'qwerty',
        'letmein'
      ];
      
      for (const password of insecurePasswords) {
        await expect(service.validatePasswordStrength(password))
          .rejects.toThrow('Password does not meet security requirements');
      }
    });

    it('should prevent session fixation attacks', async () => {
      const mockUser = MockFactory.createUser();
      const sessionId = 'fixed-session-id';
      
      // Create session with fixed ID
      const session1 = await service.createSession({
        user_id: mockUser.id,
        ip_address: '192.168.1.1',
        user_agent: 'Mozilla/5.0...'
      });
      
      // Login should generate new session ID
      const session2 = await service.createSession({
        user_id: mockUser.id,
        ip_address: '192.168.1.1',
        user_agent: 'Mozilla/5.0...'
      });
      
      expect(session1.session_id).not.toBe(session2.session_id);
    });
  });

  describe('Tenant Isolation', () => {
    it('should enforce tenant isolation in authentication', async () => {
      const tenant1User = MockFactory.createUser({ tenant_id: 'tenant-1' });
      const tenant2User = MockFactory.createUser({ tenant_id: 'tenant-2' });
      
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(tenant1User);
      
      const result = await service.validateUser('user1@tenant1.com', 'password');
      
      expect(result.user.tenant_id).toBe('tenant-1');
      expect(result.user.tenant_id).not.toBe('tenant-2');
    });

    it('should prevent cross-tenant access', async () => {
      const tenant1User = MockFactory.createUser({ tenant_id: 'tenant-1' });
      
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(tenant1User);
      
      // Attempt to access tenant-2 data with tenant-1 user
      await expect(service.validateTenantAccess(tenant1User.id, 'tenant-2'))
        .rejects.toThrow('Access denied: Invalid tenant');
    });
  });

  describe('Error Handling', () => {
    it('should handle database connection errors', async () => {
      jest.spyOn(prismaService.user, 'findUnique').mockRejectedValue(new Error('Connection timeout'));
      
      await expect(service.validateUser('test@example.com', 'password'))
        .rejects.toThrow('Connection timeout');
    });

    it('should handle JWT service errors', async () => {
      jest.spyOn(jwtService, 'sign').mockImplementation(() => {
        throw new Error('JWT service unavailable');
      });
      
      const mockUser = MockFactory.createUser();
      
      await expect(service.generateToken(mockUser))
        .rejects.toThrow('JWT service unavailable');
    });

    it('should handle configuration errors', async () => {
      jest.spyOn(configService, 'get').mockReturnValue(undefined);
      
      const mockUser = MockFactory.createUser();
      
      await expect(service.generateToken(mockUser))
        .rejects.toThrow('JWT secret not configured');
    });
  });

  describe('Performance Tests', () => {
    it('should authenticate user within performance threshold', async () => {
      const mockUser = MockFactory.createUser();
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(mockUser);
      jest.spyOn(jwtService, 'sign').mockReturnValue('mock-jwt-token');
      
      const startTime = performance.now();
      await service.validateUser('test@example.com', 'password123');
      const endTime = performance.now();
      
      const responseTime = endTime - startTime;
      expect(responseTime).toBeLessThan(100); // 100ms threshold
    });

    it('should handle concurrent authentication requests', async () => {
      const mockUser = MockFactory.createUser();
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(mockUser);
      jest.spyOn(jwtService, 'sign').mockReturnValue('mock-jwt-token');
      
      const concurrentRequests = 10;
      const promises = [];
      
      for (let i = 0; i < concurrentRequests; i++) {
        promises.push(service.validateUser(`user${i}@example.com`, 'password123'));
      }
      
      const results = await Promise.all(promises);
      expect(results).toHaveLength(concurrentRequests);
      expect(results.every(result => result !== null)).toBe(true);
    });
  });
});






