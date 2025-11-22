import { Injectable, CanActivate, ExecutionContext, ForbiddenException, SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

export const PERMISSIONS_KEY = 'permissions';
export const ROLES_KEY = 'roles';

/**
 * Decorator to specify which permissions are required to access an endpoint
 * @param permissions Array of permission strings in format 'resource:action' (e.g., ['users:manage', 'settings:update'])
 */
export const RequirePermissions = (...permissions: string[]) => SetMetadata(PERMISSIONS_KEY, permissions);

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(PERMISSIONS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredPermissions || requiredPermissions.length === 0) {
      // No permissions specified, allow access
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    const userPermissions = user.permissions || [];
    const userRoles = user.roles || [];

    // Debug logging for permission checks
    console.log('=== PERMISSIONS GUARD ===');
    console.log('Endpoint:', request.method, request.url);
    console.log('Required permissions:', requiredPermissions);
    console.log('User roles:', userRoles);
    console.log('User permissions:', userPermissions);
    console.log('User permissions type:', Array.isArray(userPermissions) ? 'array' : typeof userPermissions);
    console.log('User permissions length:', Array.isArray(userPermissions) ? userPermissions.length : 'N/A');
    console.log('========================');

    // Check if user has admin role (admin has all permissions)
    if (userRoles.includes('admin')) {
      return true;
    }

    // Check if user has required role (if roles are specified on the endpoint)
    // This allows users with required roles to access endpoints even if they don't have the specific permission
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (requiredRoles && requiredRoles.length > 0) {
      const hasRequiredRole = requiredRoles.some(role => userRoles.includes(role));
      if (hasRequiredRole) {
        // User has required role, allow access even without specific permission
        return true;
      }
    }

    // Check if user has all required permissions
    const hasAllPermissions = requiredPermissions.every(permission => {
      // Check direct permissions
      if (userPermissions.includes(permission)) {
        console.log(`PERMISSIONS GUARD - Direct permission match: ${permission}`);
        return true;
      }

      // Check wildcard permissions (e.g., 'users:*' matches 'users:manage')
      const [resource] = permission.split(':');
      if (userPermissions.includes(`${resource}:*`)) {
        console.log(`PERMISSIONS GUARD - Wildcard permission match: ${resource}:* for ${permission}`);
        return true;
      }

      // Check global wildcard
      if (userPermissions.includes('*:*')) {
        console.log(`PERMISSIONS GUARD - Global wildcard permission match for ${permission}`);
        return true;
      }

      console.log(`PERMISSIONS GUARD - No match for permission: ${permission}`);
      return false;
    });
    
    console.log('PERMISSIONS GUARD - Final check result:', {
      hasAllPermissions,
      requiredPermissions,
      userPermissionsCount: userPermissions.length
    });

    if (!hasAllPermissions) {
      const errorMessage = `Insufficient permissions. Required: ${requiredPermissions.join(', ')}. Your permissions: ${userPermissions.join(', ') || 'none'}. If you recently had permissions updated, please log out and log back in to refresh your token.`;
      console.error('PERMISSIONS GUARD - Access denied:', {
        endpoint: `${request.method} ${request.url}`,
        requiredPermissions,
        userPermissions,
        userRoles,
        userId: user.userId || user.sub
      });
      throw new ForbiddenException(errorMessage);
    }

    return true;
  }
}

