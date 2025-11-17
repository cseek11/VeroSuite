import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/auth';
import { logger } from '@/utils/logger';

interface RoleProtectedRouteProps {
  children: JSX.Element;
  allowedRoles?: string[];
  requiredPermissions?: string[];
  fallbackPath?: string;
}

/**
 * Component that protects routes based on user roles and permissions
 * 
 * @param children - The component to render if access is granted
 * @param allowedRoles - Array of role names that can access this route (e.g., ['admin', 'owner'])
 * @param requiredPermissions - Array of permission strings in format 'resource:action' (e.g., ['users:manage'])
 * @param fallbackPath - Path to redirect to if access is denied (default: '/dashboard')
 */
export function RoleProtectedRoute({
  children,
  allowedRoles = [],
  requiredPermissions = [],
  fallbackPath = '/dashboard',
}: RoleProtectedRouteProps) {
  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.token);

  // First check authentication
  if (!token || !user) {
    logger.debug('RoleProtectedRoute: No token or user, redirecting to login', {}, 'RoleProtectedRoute');
    return <Navigate to="/login" replace />;
  }

  const userRoles = user.roles || [];
  const userPermissions = user.permissions || [];

  // Check if user has admin role (admin has access to everything)
  if (userRoles.includes('admin')) {
    return children;
  }

  // If no roles or permissions specified, allow all authenticated users
  if (allowedRoles.length === 0 && requiredPermissions.length === 0) {
    return children;
  }

  // Check if user has required role OR permission
  // If both roles and permissions are specified, user needs EITHER one (not both)
  let hasRequiredRole = false;
  let hasRequiredPermission = false;

  // Check roles
  if (allowedRoles.length > 0) {
    hasRequiredRole = allowedRoles.some(role => userRoles.includes(role));
  }

  // Check permissions (with wildcard support)
  if (requiredPermissions.length > 0) {
    hasRequiredPermission = requiredPermissions.some(permission => {
      // Check direct permissions
      if (userPermissions.includes(permission)) {
        return true;
      }

      // Check wildcard permissions (e.g., 'users:*' matches 'users:manage')
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
  }

  // If both roles and permissions are specified, user needs EITHER
  if (allowedRoles.length > 0 && requiredPermissions.length > 0) {
    const hasAccess = hasRequiredRole || hasRequiredPermission;
    if (!hasAccess) {
      logger.warn('RoleProtectedRoute: Insufficient role or permission', {
        requiredRoles: allowedRoles,
        requiredPermissions,
        userRoles,
        userPermissions,
        hasRequiredRole,
        hasRequiredPermission,
        path: window.location.pathname,
      }, 'RoleProtectedRoute');
      return <Navigate to={fallbackPath} replace />;
    }
    return children;
  }

  // If only roles are specified, user must have the role
  if (allowedRoles.length > 0) {
    if (!hasRequiredRole) {
      logger.warn('RoleProtectedRoute: Insufficient role', {
        required: allowedRoles,
        userRoles,
        path: window.location.pathname,
      }, 'RoleProtectedRoute');
      return <Navigate to={fallbackPath} replace />;
    }
  }

  // If only permissions are specified, user must have the permission
  if (requiredPermissions.length > 0) {
    if (!hasRequiredPermission) {
      logger.warn('RoleProtectedRoute: Insufficient permissions', {
        required: requiredPermissions,
        userPermissions,
        path: window.location.pathname,
      }, 'RoleProtectedRoute');
      return <Navigate to={fallbackPath} replace />;
    }
  }

  return children;
}

