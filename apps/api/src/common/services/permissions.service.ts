import { Injectable } from '@nestjs/common';

/**
 * Service to combine role-based permissions with custom permissions
 * Role-based permissions are inherited from the user's roles
 * Custom permissions are explicitly assigned to the user
 */
@Injectable()
export class PermissionsService {
  // Role-to-permissions mapping (from frontend/src/types/role-actions.ts)
  private readonly rolePermissions: Record<string, string[]> = {
    dispatcher: [
      'jobs:assign',
      'jobs:update',
      'technicians:view',
      'technicians:message',
      'customers:view',
      'customers:contact',
      // Dashboard permissions
      'dashboard_layout:read',
      'dashboard_region:read',
      'dashboard_region:write',
    ],
    technician: [
      'jobs:view',
      'jobs:update',
      'jobs:complete',
      'inventory:view',
      'inventory:request',
      'customers:view',
      // Dashboard permissions
      'dashboard_layout:read',
      'dashboard_region:read',
    ],
    owner: [
      'reports:generate',
      'invoices:approve',
      'invoices:view',
      'financial:view',
      'users:manage',
      'settings:update',
      // Dashboard permissions - owners have full access
      'dashboard_layout:read',
      'dashboard_layout:write',
      'dashboard_layout:delete',
      'dashboard_region:read',
      'dashboard_region:write',
      'dashboard_region:delete',
      'dashboard_region:share',
      'dashboard_version:read',
      'dashboard_version:create',
      'dashboard_version:publish',
    ],
    admin: [
      '*:*', // Admin has all permissions
    ],
  };

  /**
   * Get combined permissions from roles and custom permissions
   * @param roles - Array of role IDs (e.g., ['technician', 'dispatcher'])
   * @param customPermissions - Array of custom permission strings (e.g., ['customers:create'])
   * @returns Combined array of unique permissions
   */
  getCombinedPermissions(roles: string[], customPermissions: string[] = []): string[] {
    const combined = new Set<string>();

    // Add role-based permissions
    for (const role of roles) {
      const rolePerms = this.rolePermissions[role.toLowerCase()] || [];
      for (const perm of rolePerms) {
        combined.add(perm);
      }
    }

    // Add custom permissions
    for (const perm of customPermissions) {
      if (perm && perm.trim()) {
        combined.add(perm.trim());
      }
    }

    // If user has admin role, they get all permissions
    if (roles.some(r => r.toLowerCase() === 'admin')) {
      return ['*:*'];
    }

    return Array.from(combined);
  }

  /**
   * Check if a user has a specific permission
   * @param userPermissions - Array of user's permissions
   * @param requiredPermission - Permission to check (e.g., 'jobs:view')
   * @returns true if user has the permission
   */
  hasPermission(userPermissions: string[], requiredPermission: string): boolean {
    // Check direct match
    if (userPermissions.includes(requiredPermission)) {
      return true;
    }

    // Check wildcard permissions
    const [resource] = requiredPermission.split(':');
    
    // Check resource wildcard (e.g., 'jobs:*' matches 'jobs:view')
    if (userPermissions.includes(`${resource}:*`)) {
      return true;
    }

    // Check global wildcard
    if (userPermissions.includes('*:*')) {
      return true;
    }

    return false;
  }
}

