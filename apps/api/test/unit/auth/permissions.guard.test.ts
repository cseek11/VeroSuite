/**
 * Permissions Guard Unit Tests
 * Tests for permission checking logic, role-based access, and custom permissions
 */

import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PermissionsGuard, RequirePermissions, PERMISSIONS_KEY, ROLES_KEY } from '../../../src/auth/permissions.guard';

describe('PermissionsGuard', () => {
  let guard: PermissionsGuard;
  let reflector: Reflector;

  const mockExecutionContext = (user: any, requiredPermissions?: string[], requiredRoles?: string[]): ExecutionContext => {
    const reflector = new Reflector();
    const handler = jest.fn();
    const controller = jest.fn();

    if (requiredPermissions) {
      Reflect.defineMetadata(PERMISSIONS_KEY, requiredPermissions, handler);
    }
    if (requiredRoles) {
      Reflect.defineMetadata(ROLES_KEY, requiredRoles, handler);
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
        PermissionsGuard,
        Reflector,
      ],
    }).compile();

    guard = module.get<PermissionsGuard>(PermissionsGuard);
    reflector = module.get<Reflector>(Reflector);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('canActivate', () => {
    it('should allow access when no permissions are required', () => {
      const user = {
        userId: 'user-123',
        roles: ['technician'],
        permissions: ['jobs:view'],
      };
      const context = mockExecutionContext(user);

      const result = guard.canActivate(context);

      expect(result).toBe(true);
    });

    it('should throw ForbiddenException when user is not authenticated', () => {
      const context = mockExecutionContext(null, ['jobs:view']);

      expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
      expect(() => guard.canActivate(context)).toThrow('User not authenticated');
    });

    it('should allow access when user has admin role', () => {
      const user = {
        userId: 'user-123',
        roles: ['admin'],
        permissions: [],
      };
      const context = mockExecutionContext(user, ['jobs:view']);

      const result = guard.canActivate(context);

      expect(result).toBe(true);
    });

    it('should allow access when user has required permission', () => {
      const user = {
        userId: 'user-123',
        roles: ['technician'],
        permissions: ['jobs:view'],
      };
      const context = mockExecutionContext(user, ['jobs:view']);

      const result = guard.canActivate(context);

      expect(result).toBe(true);
    });

    it('should deny access when user does not have required permission', () => {
      const user = {
        userId: 'user-123',
        roles: ['technician'],
        permissions: ['jobs:view'],
      };
      const context = mockExecutionContext(user, ['jobs:delete']);

      expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
    });

    it('should allow access when user has wildcard permission', () => {
      const user = {
        userId: 'user-123',
        roles: ['technician'],
        permissions: ['jobs:*'],
      };
      const context = mockExecutionContext(user, ['jobs:delete']);

      const result = guard.canActivate(context);

      expect(result).toBe(true);
    });

    it('should allow access when user has global wildcard permission', () => {
      const user = {
        userId: 'user-123',
        roles: ['technician'],
        permissions: ['*:*'],
      };
      const context = mockExecutionContext(user, ['jobs:delete', 'users:manage']);

      const result = guard.canActivate(context);

      expect(result).toBe(true);
    });

    it('should allow access when user has required role (even without permission)', () => {
      const user = {
        userId: 'user-123',
        roles: ['supervisor'],
        permissions: [],
      };
      const context = mockExecutionContext(user, ['jobs:delete'], ['supervisor']);

      const result = guard.canActivate(context);

      expect(result).toBe(true);
    });

    it('should require all permissions when multiple are specified', () => {
      const user = {
        userId: 'user-123',
        roles: ['technician'],
        permissions: ['jobs:view', 'jobs:create'],
      };
      const context = mockExecutionContext(user, ['jobs:view', 'jobs:create', 'jobs:delete']);

      expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
    });

    it('should allow access when user has all required permissions', () => {
      const user = {
        userId: 'user-123',
        roles: ['technician'],
        permissions: ['jobs:view', 'jobs:create', 'jobs:delete'],
      };
      const context = mockExecutionContext(user, ['jobs:view', 'jobs:create', 'jobs:delete']);

      const result = guard.canActivate(context);

      expect(result).toBe(true);
    });

    it('should handle empty permissions array', () => {
      const user = {
        userId: 'user-123',
        roles: ['technician'],
        permissions: [],
      };
      const context = mockExecutionContext(user, ['jobs:view']);

      expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
    });

    it('should handle missing permissions field', () => {
      const user = {
        userId: 'user-123',
        roles: ['technician'],
      };
      const context = mockExecutionContext(user, ['jobs:view']);

      expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
    });

    it('should handle missing roles field', () => {
      const user = {
        userId: 'user-123',
        permissions: ['jobs:view'],
      };
      const context = mockExecutionContext(user, ['jobs:view']);

      const result = guard.canActivate(context);

      expect(result).toBe(true);
    });
  });

  describe('RequirePermissions decorator', () => {
    it('should set metadata correctly', () => {
      class TestController {
        @RequirePermissions('jobs:view', 'jobs:create')
        testMethod() {}
      }

      const permissions = Reflect.getMetadata(PERMISSIONS_KEY, TestController.prototype.testMethod);
      expect(permissions).toEqual(['jobs:view', 'jobs:create']);
    });
  });
});
