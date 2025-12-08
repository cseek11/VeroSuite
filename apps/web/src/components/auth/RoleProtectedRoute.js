"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoleProtectedRoute = RoleProtectedRoute;
var jsx_runtime_1 = require("react/jsx-runtime");
// React import removed - not needed with React 17+
var react_router_dom_1 = require("react-router-dom");
var auth_1 = require("@/stores/auth");
var logger_1 = require("@/utils/logger");
/**
 * Component that protects routes based on user roles and permissions
 *
 * @param children - The component to render if access is granted
 * @param allowedRoles - Array of role names that can access this route (e.g., ['admin', 'owner'])
 * @param requiredPermissions - Array of permission strings in format 'resource:action' (e.g., ['users:manage'])
 * @param fallbackPath - Path to redirect to if access is denied (default: '/dashboard')
 */
function RoleProtectedRoute(_a) {
    var children = _a.children, _b = _a.allowedRoles, allowedRoles = _b === void 0 ? [] : _b, _c = _a.requiredPermissions, requiredPermissions = _c === void 0 ? [] : _c, _d = _a.fallbackPath, fallbackPath = _d === void 0 ? '/dashboard' : _d;
    var user = (0, auth_1.useAuthStore)(function (s) { return s.user; });
    var token = (0, auth_1.useAuthStore)(function (s) { return s.token; });
    // First check authentication
    if (!token || !user) {
        logger_1.logger.debug('RoleProtectedRoute: No token or user, redirecting to login', {}, 'RoleProtectedRoute');
        return (0, jsx_runtime_1.jsx)(react_router_dom_1.Navigate, { to: "/login", replace: true });
    }
    var userRoles = user.roles || [];
    var userPermissions = user.permissions || [];
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
    var hasRequiredRole = false;
    var hasRequiredPermission = false;
    // Check roles
    if (allowedRoles.length > 0) {
        hasRequiredRole = allowedRoles.some(function (role) { return userRoles.includes(role); });
    }
    // Check permissions (with wildcard support)
    if (requiredPermissions.length > 0) {
        hasRequiredPermission = requiredPermissions.some(function (permission) {
            // Check direct permissions
            if (userPermissions.includes(permission)) {
                return true;
            }
            // Check wildcard permissions (e.g., 'users:*' matches 'users:manage')
            var resource = permission.split(':')[0];
            if (userPermissions.includes("".concat(resource, ":*"))) {
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
        var hasAccess = hasRequiredRole || hasRequiredPermission;
        if (!hasAccess) {
            logger_1.logger.warn('RoleProtectedRoute: Insufficient role or permission', {
                requiredRoles: allowedRoles,
                requiredPermissions: requiredPermissions,
                userRoles: userRoles,
                userPermissions: userPermissions,
                hasRequiredRole: hasRequiredRole,
                hasRequiredPermission: hasRequiredPermission,
                path: window.location.pathname,
            }, 'RoleProtectedRoute');
            return (0, jsx_runtime_1.jsx)(react_router_dom_1.Navigate, { to: fallbackPath, replace: true });
        }
        return children;
    }
    // If only roles are specified, user must have the role
    if (allowedRoles.length > 0) {
        if (!hasRequiredRole) {
            logger_1.logger.warn('RoleProtectedRoute: Insufficient role', {
                required: allowedRoles,
                userRoles: userRoles,
                path: window.location.pathname,
            }, 'RoleProtectedRoute');
            return (0, jsx_runtime_1.jsx)(react_router_dom_1.Navigate, { to: fallbackPath, replace: true });
        }
    }
    // If only permissions are specified, user must have the permission
    if (requiredPermissions.length > 0) {
        if (!hasRequiredPermission) {
            logger_1.logger.warn('RoleProtectedRoute: Insufficient permissions', {
                required: requiredPermissions,
                userPermissions: userPermissions,
                path: window.location.pathname,
            }, 'RoleProtectedRoute');
            return (0, jsx_runtime_1.jsx)(react_router_dom_1.Navigate, { to: fallbackPath, replace: true });
        }
    }
    return children;
}
