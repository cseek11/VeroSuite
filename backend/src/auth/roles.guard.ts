import { Injectable, CanActivate, ExecutionContext, ForbiddenException, SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

export const ROLES_KEY = 'roles';
export const PERMISSIONS_KEY = 'permissions';

/**
 * Decorator to specify which roles are allowed to access an endpoint
 * @param roles Array of role names (e.g., ['admin', 'owner'])
 */
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles || requiredRoles.length === 0) {
      // No roles specified, allow access (permissions will be checked by PermissionsGuard if specified)
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    const userRoles = user.roles || [];
    const userPermissions = user.permissions || [];

    // Debug logging for role checks
    console.log('=== ROLES GUARD ===');
    console.log('Endpoint:', request.method, request.url);
    console.log('Required roles:', requiredRoles);
    console.log('User roles:', userRoles);
    console.log('User permissions:', userPermissions);
    console.log('User permissions type:', Array.isArray(userPermissions) ? 'array' : typeof userPermissions);
    console.log('User permissions length:', Array.isArray(userPermissions) ? userPermissions.length : 'N/A');
    console.log('==================');
    
    // Check if user has at least one of the required roles
    const hasRole = requiredRoles.some(role => userRoles.includes(role));

    // If user has the required role, allow access
    if (hasRole) {
      return true;
    }

    // If user doesn't have the required role, check if they have required permissions
    // This allows users with custom permissions to access endpoints that require specific roles
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(PERMISSIONS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // If permissions are also specified, check if user has any of them
    if (requiredPermissions && requiredPermissions.length > 0) {
      const hasPermission = requiredPermissions.some(permission => {
        // Check direct permissions
        if (userPermissions.includes(permission)) {
          return true;
        }

        // Check wildcard permissions (e.g., 'users:*' matches 'users:view')
        const [resource] = permission.split(':');
        if (userPermissions.includes(`${resource}:*`)) {
          return true;
        }

        // Check global wildcard
        if (userPermissions.includes('*:*')) {
          return true;
        }

        return false;
      });

      if (hasPermission) {
        console.log('ROLES GUARD - Permission check passed, allowing access');
        return true;
      } else {
        console.log('ROLES GUARD - Permission check failed:', {
          requiredPermissions,
          userPermissions,
          hasPermission: false
        });
      }
    }

    // User has neither required role nor required permission
    const errorMessage = `Insufficient permissions. Required roles: ${requiredRoles.join(', ')}${requiredPermissions && requiredPermissions.length > 0 ? ` or permissions: ${requiredPermissions.join(', ')}` : ''}. Your roles: ${userRoles.join(', ') || 'none'}, Your permissions: ${userPermissions.join(', ') || 'none'}`;
    console.error('ROLES GUARD - Access denied:', {
      endpoint: `${request.method} ${request.url}`,
      requiredRoles,
      requiredPermissions,
      userRoles,
      userPermissions,
      userId: user.userId || user.sub
    });
    throw new ForbiddenException(errorMessage);
  }
}

