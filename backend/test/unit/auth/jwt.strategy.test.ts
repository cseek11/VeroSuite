/**
 * JWT Strategy Unit Tests
 * Tests for JWT validation, token extraction, and error handling
 */

import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { JwtStrategy, JwtPayload } from '../../../src/auth/jwt.strategy';
import { ConfigService } from '@nestjs/config';

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;

  const mockValidPayload: JwtPayload = {
    sub: 'user-123',
    email: 'test@example.com',
    tenant_id: 'tenant-123',
    roles: ['technician'],
    permissions: ['jobs:view', 'jobs:create'],
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 3600,
  };

  beforeEach(async () => {
    process.env.JWT_SECRET = 'test-jwt-secret';

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              if (key === 'JWT_SECRET') return 'test-jwt-secret';
              return null;
            }),
          },
        },
      ],
    }).compile();

    strategy = module.get<JwtStrategy>(JwtStrategy);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('validate', () => {
    it('should return user context for valid payload', async () => {
      const result = await strategy.validate(mockValidPayload);

      expect(result).toEqual({
        userId: 'user-123',
        email: 'test@example.com',
        tenantId: 'tenant-123',
        roles: ['technician'],
        permissions: ['jobs:view', 'jobs:create'],
      });
    });

    it('should throw UnauthorizedException when sub is missing', async () => {
      const invalidPayload = {
        ...mockValidPayload,
        sub: undefined as any,
      };

      await expect(strategy.validate(invalidPayload)).rejects.toThrow(UnauthorizedException);
      await expect(strategy.validate(invalidPayload)).rejects.toThrow('Invalid token payload');
    });

    it('should throw UnauthorizedException when tenant_id is missing', async () => {
      const invalidPayload = {
        ...mockValidPayload,
        tenant_id: undefined as any,
      };

      await expect(strategy.validate(invalidPayload)).rejects.toThrow(UnauthorizedException);
      await expect(strategy.validate(invalidPayload)).rejects.toThrow('Invalid token payload');
    });

    it('should handle empty roles array', async () => {
      const payloadWithoutRoles = {
        ...mockValidPayload,
        roles: [],
      };

      const result = await strategy.validate(payloadWithoutRoles);

      expect(result.roles).toEqual([]);
    });

    it('should handle missing roles field', async () => {
      const payloadWithoutRoles = {
        ...mockValidPayload,
        roles: undefined as any,
      };

      const result = await strategy.validate(payloadWithoutRoles);

      expect(result.roles).toEqual([]);
    });

    it('should handle empty permissions array', async () => {
      const payloadWithoutPermissions = {
        ...mockValidPayload,
        permissions: [],
      };

      const result = await strategy.validate(payloadWithoutPermissions);

      expect(result.permissions).toEqual([]);
    });

    it('should handle missing permissions field', async () => {
      const payloadWithoutPermissions = {
        ...mockValidPayload,
        permissions: undefined as any,
      };

      const result = await strategy.validate(payloadWithoutPermissions);

      expect(result.permissions).toEqual([]);
    });

    it('should handle multiple roles', async () => {
      const payloadWithMultipleRoles = {
        ...mockValidPayload,
        roles: ['technician', 'supervisor', 'admin'],
      };

      const result = await strategy.validate(payloadWithMultipleRoles);

      expect(result.roles).toEqual(['technician', 'supervisor', 'admin']);
    });

    it('should handle multiple permissions', async () => {
      const payloadWithMultiplePermissions = {
        ...mockValidPayload,
        permissions: ['jobs:view', 'jobs:create', 'jobs:update', 'jobs:delete'],
      };

      const result = await strategy.validate(payloadWithMultiplePermissions);

      expect(result.permissions).toEqual(['jobs:view', 'jobs:create', 'jobs:update', 'jobs:delete']);
    });

    it('should handle missing email field', async () => {
      const payloadWithoutEmail = {
        ...mockValidPayload,
        email: undefined as any,
      };

      const result = await strategy.validate(payloadWithoutEmail);

      expect(result.email).toBeUndefined();
    });
  });
});
