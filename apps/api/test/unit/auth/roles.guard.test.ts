/**
 * Roles Guard Unit Tests
 * Tests for role validation, multiple roles, and role hierarchy
 */

import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RolesGuard, Roles, ROLES_KEY, PERMISSIONS_KEY } from '../../../src/auth/roles.guard';

describe('RolesGuard', () => {
  let guard: RolesGuard;
  let reflector: Reflector;

  const mockExecutionContext = (user: any, requiredRoles?: string[], requiredPermissions?: string[]): ExecutionContext => {
    const handler = jest.fn();
    const controller = jest.fn();

    if (requiredRoles) {
      Reflect.defineMetadata(ROLES_KEY, requiredRoles, handler);
    }
    if (requiredPermissions) {
      Reflect.defineMetadata(PERMISSIONS_KEY, requiredPermissions, handler);
    }

    return {
      switchToHttp: () => ({
        getRequest: () => ({
          method: 'GET',
          url: '/test',
          user,
        }),
      }),
      getHandler: () => handler,
      getClass: () => controller,
    } as ExecutionContext;
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RolesGuard,
        Reflector,
      ],
    }).compile();

    guard = module.get<RolesGuard>(RolesGuard);
    reflector = module.get<Reflector>(Reflector);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('canActivate', () => {
    it('should allow access when no roles are required', () => {
      const user = {
        userId: 'user-123',
        roles: ['technician'],
        permissions: [],
      };
      const context = mockExecutionContext(user);

      const result = guard.canActivate(context);

      expect(result).toBe(true);
    });

    it('should throw ForbiddenException when user is not authenticated', () => {
      const context = mockExecutionContext(null, ['admin']);

      expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
      expect(() => guard.canActivate(context)).toThrow('User not authenticated');
    });

    it('should allow access when user has required role', () => {
      const user = {
        userId: 'user-123',
        roles: ['admin'],
        permissions: [],
      };
      const context = mockExecutionContext(user, ['admin']);

      const result = guard.canActivate(context);

      expect(result).toBe(true);
    });

    it('should allow access when user has one of multiple required roles', () => {
      const user = {
        userId: 'user-123',
        roles: ['technician'],
        permissions: [],
      };
      const context = mockExecutionContext(user, ['admin', 'technician', 'supervisor']);

      const result = guard.canActivate(context);

      expect(result).toBe(true);
    });

    it('should deny access when user does not have required role', () => {
      const user = {
        userId: 'user-123',
        roles: ['technician'],
        permissions: [],
      };
      const context = mockExecutionContext(user, ['admin']);

      expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
    });

    it('should allow access when user has required permission (even without role)', () => {
      const user = {
        userId: 'user-123',
        roles: ['technician'],
        permissions: ['jobs:delete'],
      };
      const context = mockExecutionContext(user, ['admin'], ['jobs:delete']);

      const result = guard.canActivate(context);

      expect(result).toBe(true);
    });

    it('should allow access when user has wildcard permission', () => {
      const user = {
        userId: 'user-123',
        roles: ['technician'],
        permissions: ['jobs:*'],
      };
      const context = mockExecutionContext(user, ['admin'], ['jobs:delete']);

      const result = guard.canActivate(context);

      expect(result).toBe(true);
    });

    it('should allow access when user has global wildcard permission', () => {
      const user = {
        userId: 'user-123',
        roles: ['technician'],
        permissions: ['*:*'],
      };
      const context = mockExecutionContext(user, ['admin'], ['jobs:delete']);

      const result = guard.canActivate(context);

      expect(result).toBe(true);
    });

    it('should deny access when user has neither role nor permission', () => {
      const user = {
        userId: 'user-123',
        roles: ['technician'],
        permissions: ['jobs:view'],
      };
      const context = mockExecutionContext(user, ['admin'], ['jobs:delete']);

      expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
    });

    it('should allow access when user has one of multiple required permissions', () => {
      const user = {
        userId: 'user-123',
        roles: ['technician'],
        permissions: ['jobs:view'],
      };
      const context = mockExecutionContext(user, ['admin'], ['jobs:delete', 'jobs:view']);

      const result = guard.canActivate(context);

      expect(result).toBe(true);
    });

    it('should handle empty roles array', () => {
      const user = {
        userId: 'user-123',
        roles: [],
        permissions: ['jobs:view'],
      };
      const context = mockExecutionContext(user, ['admin'], ['jobs:view']);

      const result = guard.canActivate(context);

      expect(result).toBe(true);
    });

    it('should handle missing roles field', () => {
      const user = {
        userId: 'user-123',
        permissions: ['jobs:view'],
      };
      const context = mockExecutionContext(user, ['admin'], ['jobs:view']);

      const result = guard.canActivate(context);

      expect(result).toBe(true);
    });

    it('should handle missing permissions field', () => {
      const user = {
        userId: 'user-123',
        roles: ['technician'],
      };
      const context = mockExecutionContext(user, ['admin']);

      expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
    });

    it('should handle empty permissions array', () => {
      const user = {
        userId: 'user-123',
        roles: ['technician'],
        permissions: [],
      };
      const context = mockExecutionContext(user, ['admin']);

      expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
    });
  });

  describe('Roles decorator', () => {
    it('should set metadata correctly', () => {
      class TestController {
        @Roles('admin', 'supervisor')
        testMethod() {}
      }

      const roles = Reflect.getMetadata(ROLES_KEY, TestController.prototype.testMethod);
      expect(roles).toEqual(['admin', 'supervisor']);
    });
  });
});
