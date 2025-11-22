/**
 * Authentication Service Unit Tests
 * Tests for login, token exchange, and user retrieval
 */

import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../../../src/auth/auth.service';
import { DatabaseService } from '../../../src/common/services/database.service';
import { PermissionsService } from '../../../src/common/services/permissions.service';
import { createClient } from '@supabase/supabase-js';

// Import the mocked createClient - it's already mocked by test/setup.ts
// We'll override the auth methods in our tests

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: JwtService;
  let dbService: DatabaseService;
  let permissionsService: PermissionsService;
  let mockSupabaseClient: any;

  const mockUser = {
    id: 'user-123',
    email: 'test@example.com',
    first_name: 'Test',
    last_name: 'User',
    tenant_id: 'tenant-123',
    roles: ['technician'],
    custom_permissions: []
  };

  beforeEach(async () => {
    // Set required environment variables BEFORE creating module
    // (AuthService constructor reads these in constructor)
    process.env.SUPABASE_URL = 'https://test.supabase.co';
    process.env.SUPABASE_SECRET_KEY = 'test-secret-key';

    // Get the mocked createClient from the global mock (created by test/setup.ts)
    // Create a single client instance that will be reused
    const createClientMock = require('@supabase/supabase-js').createClient;
    mockSupabaseClient = {
      auth: {
        signInWithPassword: jest.fn(),
        getUser: jest.fn()
      },
      from: jest.fn()
    };
    
    // Make createClient always return the same instance so the service uses it
    createClientMock.mockReturnValue(mockSupabaseClient);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('mock-jwt-token')
          }
        },
        {
          provide: DatabaseService,
          useValue: {
            user: {
              findUnique: jest.fn()
            }
          }
        },
        {
          provide: PermissionsService,
          useValue: {
            getCombinedPermissions: jest.fn().mockReturnValue(['permission1', 'permission2'])
          }
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              if (key === 'SUPABASE_URL') return 'https://test.supabase.co';
              if (key === 'SUPABASE_SECRET_KEY') return 'test-secret-key';
              return null;
            })
          }
        }
      ]
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
    dbService = module.get<DatabaseService>(DatabaseService);
    permissionsService = module.get<PermissionsService>(PermissionsService);
  });

  afterEach(() => {
    // Clear all mocks
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should authenticate user with valid credentials', async () => {
      const supabaseUser = {
        id: mockUser.id,
        email: mockUser.email,
        user_metadata: {},
        app_metadata: {}
      };

      // Override the global mock's signInWithPassword for this test
      jest.spyOn(mockSupabaseClient.auth, 'signInWithPassword').mockResolvedValue({
        data: { user: supabaseUser },
        error: null
      });

      jest.spyOn(dbService.user, 'findUnique').mockResolvedValue(mockUser as any);

      const result = await service.login('test@example.com', 'password123');

      expect(result).toHaveProperty('access_token');
      expect(result).toHaveProperty('user');
      expect(result.access_token).toBe('mock-jwt-token');
      expect(result.user.id).toBe(mockUser.id);
      expect(result.user.email).toBe(mockUser.email);
      expect(jwtService.sign).toHaveBeenCalled();
    });

    it('should reject authentication with invalid credentials', async () => {
      jest.spyOn(mockSupabaseClient.auth, 'signInWithPassword').mockResolvedValue({
        data: { user: null },
        error: { message: 'Invalid credentials' }
      });

      await expect(service.login('invalid@example.com', 'wrongpassword'))
        .rejects.toThrow(UnauthorizedException);
    });

    it('should reject when user not found in database', async () => {
      const supabaseUser = {
        id: 'user-123',
        email: 'test@example.com',
        user_metadata: {},
        app_metadata: {}
      };

      jest.spyOn(mockSupabaseClient.auth, 'signInWithPassword').mockResolvedValue({
        data: { user: supabaseUser },
        error: null
      });

      jest.spyOn(dbService.user, 'findUnique').mockResolvedValue(null);

      await expect(service.login('test@example.com', 'password123'))
        .rejects.toThrow(UnauthorizedException);
    });

    it('should reject when user has no tenant_id', async () => {
      const supabaseUser = {
        id: 'user-123',
        email: 'test@example.com',
        user_metadata: {},
        app_metadata: {}
      };

      jest.spyOn(mockSupabaseClient.auth, 'signInWithPassword').mockResolvedValue({
        data: { user: supabaseUser },
        error: null
      });

      jest.spyOn(dbService.user, 'findUnique').mockResolvedValue({
        ...mockUser,
        tenant_id: null
      } as any);

      await expect(service.login('test@example.com', 'password123'))
        .rejects.toThrow(UnauthorizedException);
    });

    it('should handle Supabase auth errors', async () => {
      jest.spyOn(mockSupabaseClient.auth, 'signInWithPassword').mockRejectedValue(
        new Error('Network error')
      );

      await expect(service.login('test@example.com', 'password123'))
        .rejects.toThrow(UnauthorizedException);
    });
  });

  describe('exchangeSupabaseToken', () => {
    it('should exchange valid Supabase token for JWT', async () => {
      const supabaseUser = {
        id: mockUser.id,
        email: mockUser.email,
        user_metadata: {},
        app_metadata: {}
      };

      // Reset and setup mock
      jest.spyOn(mockSupabaseClient.auth, 'getUser').mockResolvedValueOnce({
        data: { user: supabaseUser },
        error: null
      });

      jest.spyOn(dbService.user, 'findUnique').mockResolvedValueOnce(mockUser as any);
      jest.spyOn(permissionsService, 'getCombinedPermissions').mockReturnValueOnce(['permission1', 'permission2']);
      jest.spyOn(jwtService, 'sign').mockReturnValueOnce('mock-jwt-token');

      const result = await service.exchangeSupabaseToken('valid-supabase-token');

      expect(result).toHaveProperty('access_token');
      expect(result).toHaveProperty('user');
      expect(result.access_token).toBe('mock-jwt-token');
      expect(jwtService.sign).toHaveBeenCalled();
      expect(mockSupabaseClient.auth.getUser).toHaveBeenCalledWith('valid-supabase-token');
    });

    it('should reject invalid Supabase token', async () => {
      jest.spyOn(mockSupabaseClient.auth, 'getUser').mockResolvedValue({
        data: { user: null },
        error: { message: 'Invalid token' }
      });

      await expect(service.exchangeSupabaseToken('invalid-token'))
        .rejects.toThrow(UnauthorizedException);
    });

    it('should reject when user not found in database', async () => {
      const supabaseUser = {
        id: 'user-123',
        email: 'test@example.com',
        user_metadata: {},
        app_metadata: {}
      };

      jest.spyOn(mockSupabaseClient.auth, 'getUser').mockResolvedValue({
        data: { user: supabaseUser },
        error: null
      });

      jest.spyOn(dbService.user, 'findUnique').mockResolvedValue(null);

      await expect(service.exchangeSupabaseToken('valid-token'))
        .rejects.toThrow(UnauthorizedException);
    });
  });

  describe('getCurrentUser', () => {
    it('should return current user with permissions', async () => {
      jest.spyOn(dbService.user, 'findUnique').mockResolvedValue(mockUser as any);

      const result = await service.getCurrentUser('user-123');

      expect(result).toHaveProperty('user');
      expect(result.user.id).toBe(mockUser.id);
      expect(result.user.email).toBe(mockUser.email);
      expect(result.user.tenant_id).toBe(mockUser.tenant_id);
      expect(result.user.roles).toEqual(mockUser.roles);
      expect(permissionsService.getCombinedPermissions).toHaveBeenCalled();
    });

    it('should reject when user not found', async () => {
      jest.spyOn(dbService.user, 'findUnique').mockResolvedValue(null);

      await expect(service.getCurrentUser('non-existent-user'))
        .rejects.toThrow(UnauthorizedException);
    });

    it('should handle database errors', async () => {
      jest.spyOn(dbService.user, 'findUnique').mockRejectedValue(
        new Error('Database error')
      );

      await expect(service.getCurrentUser('user-123'))
        .rejects.toThrow(UnauthorizedException);
    });

    it('should handle custom_permissions as JSON string', async () => {
      const userWithStringPerms = {
        ...mockUser,
        custom_permissions: '["custom:perm1", "custom:perm2"]'
      };

      jest.spyOn(dbService.user, 'findUnique').mockResolvedValue(userWithStringPerms as any);

      const result = await service.getCurrentUser('user-123');

      expect(result).toHaveProperty('user');
      expect(permissionsService.getCombinedPermissions).toHaveBeenCalled();
    });

    it('should handle invalid JSON in custom_permissions', async () => {
      const userWithInvalidPerms = {
        ...mockUser,
        custom_permissions: 'invalid-json-string'
      };

      jest.spyOn(dbService.user, 'findUnique').mockResolvedValue(userWithInvalidPerms as any);

      const result = await service.getCurrentUser('user-123');

      expect(result).toHaveProperty('user');
      expect(permissionsService.getCombinedPermissions).toHaveBeenCalledWith(
        mockUser.roles,
        []
      );
    });
  });

  describe('constructor', () => {
    it('should throw error when SUPABASE_URL is missing', async () => {
      const originalUrl = process.env.SUPABASE_URL;
      const originalKey = process.env.SUPABASE_SECRET_KEY;
      
      delete process.env.SUPABASE_URL;
      process.env.SUPABASE_SECRET_KEY = 'test-key';

      await expect(
        Test.createTestingModule({
          providers: [
            AuthService,
            {
              provide: JwtService,
              useValue: { sign: jest.fn() }
            },
            {
              provide: DatabaseService,
              useValue: { user: { findUnique: jest.fn() } }
            },
            {
              provide: PermissionsService,
              useValue: { getCombinedPermissions: jest.fn() }
            }
          ]
        }).compile()
      ).rejects.toThrow('Missing required environment variables');

      process.env.SUPABASE_URL = originalUrl;
      process.env.SUPABASE_SECRET_KEY = originalKey;
    });

    it('should throw error when SUPABASE_SECRET_KEY is missing', async () => {
      const originalUrl = process.env.SUPABASE_URL;
      const originalKey = process.env.SUPABASE_SECRET_KEY;
      
      process.env.SUPABASE_URL = 'https://test.supabase.co';
      delete process.env.SUPABASE_SECRET_KEY;

      await expect(
        Test.createTestingModule({
          providers: [
            AuthService,
            {
              provide: JwtService,
              useValue: { sign: jest.fn() }
            },
            {
              provide: DatabaseService,
              useValue: { user: { findUnique: jest.fn() } }
            },
            {
              provide: PermissionsService,
              useValue: { getCombinedPermissions: jest.fn() }
            }
          ]
        }).compile()
      ).rejects.toThrow('Missing required environment variables');

      process.env.SUPABASE_URL = originalUrl;
      process.env.SUPABASE_SECRET_KEY = originalKey;
    });
  });

  describe('login - edge cases', () => {
    it('should handle custom_permissions as invalid JSON string', async () => {
      const supabaseUser = {
        id: mockUser.id,
        email: mockUser.email,
        user_metadata: {},
        app_metadata: {}
      };

      jest.spyOn(mockSupabaseClient.auth, 'signInWithPassword').mockResolvedValue({
        data: { user: supabaseUser },
        error: null
      });

      const userWithInvalidPerms = {
        ...mockUser,
        custom_permissions: 'invalid-json-string'
      };

      jest.spyOn(dbService.user, 'findUnique').mockResolvedValue(userWithInvalidPerms as any);

      const result = await service.login('test@example.com', 'password123');

      expect(result).toHaveProperty('access_token');
      expect(permissionsService.getCombinedPermissions).toHaveBeenCalledWith(
        mockUser.roles,
        []
      );
    });

    it('should handle roles from user metadata when not in database', async () => {
      const supabaseUser = {
        id: mockUser.id,
        email: mockUser.email,
        user_metadata: { roles: ['admin'] },
        app_metadata: {}
      };

      jest.spyOn(mockSupabaseClient.auth, 'signInWithPassword').mockResolvedValue({
        data: { user: supabaseUser },
        error: null
      });

      const userWithoutRoles = {
        ...mockUser,
        roles: []
      };

      jest.spyOn(dbService.user, 'findUnique').mockResolvedValue(userWithoutRoles as any);

      const result = await service.login('test@example.com', 'password123');

      expect(result).toHaveProperty('access_token');
      expect(result.user.roles).toEqual(['admin']);
    });
  });

  describe('exchangeSupabaseToken - edge cases', () => {
    it('should reject when user has no tenant_id', async () => {
      const supabaseUser = {
        id: 'user-123',
        email: 'test@example.com',
        user_metadata: {},
        app_metadata: {}
      };

      jest.spyOn(mockSupabaseClient.auth, 'getUser').mockResolvedValue({
        data: { user: supabaseUser },
        error: null
      });

      jest.spyOn(dbService.user, 'findUnique').mockResolvedValue({
        ...mockUser,
        tenant_id: null
      } as any);

      await expect(service.exchangeSupabaseToken('valid-token'))
        .rejects.toThrow(UnauthorizedException);
    });

    it('should handle roles from user metadata when not in database', async () => {
      const supabaseUser = {
        id: mockUser.id,
        email: mockUser.email,
        user_metadata: { roles: ['admin'] },
        app_metadata: {}
      };

      jest.spyOn(mockSupabaseClient.auth, 'getUser').mockResolvedValue({
        data: { user: supabaseUser },
        error: null
      });

      const userWithoutRoles = {
        ...mockUser,
        roles: []
      };

      jest.spyOn(dbService.user, 'findUnique').mockResolvedValue(userWithoutRoles as any);

      const result = await service.exchangeSupabaseToken('valid-token');

      expect(result).toHaveProperty('access_token');
      expect(result.user.roles).toEqual(['admin']);
    });
  });
});




























