import { Injectable } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { SupabaseService } from './supabase.service';
import { PermissionsService } from './permissions.service';

/**
 * Permission constants for dashboard resources
 */
export enum DashboardPermission {
  // Layout permissions
  LAYOUT_READ = 'dashboard_layout:read',
  LAYOUT_WRITE = 'dashboard_layout:write',
  LAYOUT_DELETE = 'dashboard_layout:delete',
  
  // Region permissions
  REGION_READ = 'dashboard_region:read',
  REGION_WRITE = 'dashboard_region:write',
  REGION_DELETE = 'dashboard_region:delete',
  REGION_SHARE = 'dashboard_region:share',
  
  // Version permissions
  VERSION_READ = 'dashboard_version:read',
  VERSION_CREATE = 'dashboard_version:create',
  VERSION_PUBLISH = 'dashboard_version:publish',
  
  // Widget permissions
  WIDGET_REGISTER = 'dashboard_widget:register',
  WIDGET_APPROVE = 'dashboard_widget:approve',
}

/**
 * Authorization service for centralized permission checks
 * 
 * This service provides a single source of truth for permission checking
 * across the dashboard module. It integrates with:
 * - User roles (admin, owner, dispatcher, technician)
 * - Custom permissions
 * - Resource ownership
 * - Tenant isolation
 */
@Injectable()
export class AuthorizationService {
  constructor(
    private readonly db: DatabaseService,
    private readonly supabaseService: SupabaseService,
    private readonly permissionsService: PermissionsService
  ) {}

  /**
   * Check if user has a specific permission
   * 
   * Permission checking order:
   * 1. Check if user is admin (has all permissions)
   * 2. Check resource ownership (owners can always access their resources)
   * 3. Check role-based permissions
   * 4. Check custom permissions
   * 5. Check tenant membership (must be in same tenant)
   */
  async hasPermission(
    userId: string,
    tenantId: string,
    permission: DashboardPermission,
    resourceId?: string,
    resourceType?: 'layout' | 'region' | 'version' | 'widget'
  ): Promise<boolean> {
    // 1. Get user data
    const user = await this.getUserData(userId, tenantId);
    if (!user) {
      return false;
    }

    // 2. Verify tenant membership
    if (user.tenant_id !== tenantId) {
      return false;
    }

    // 3. Check if user is admin (admin has all permissions)
    if (user.roles && user.roles.some(role => role.toLowerCase() === 'admin')) {
      return true;
    }

    // 4. Check resource ownership (owners can always access their resources)
    if (resourceId && resourceType) {
      const isOwner = await this.checkResourceOwnership(
        userId,
        tenantId,
        resourceId,
        resourceType
      );
      if (isOwner) {
        return true;
      }
    }

    // 5. Get user's combined permissions (roles + custom)
    const roles = user.roles || [];
    const customPermissions = Array.isArray(user.custom_permissions)
      ? user.custom_permissions
      : [];
    
    const combinedPermissions = this.permissionsService.getCombinedPermissions(
      roles,
      customPermissions
    );

    // 6. Check if user has the required permission
    const permissionString = permission.toString();
    return this.permissionsService.hasPermission(combinedPermissions, permissionString);
  }

  /**
   * Check if user can read a resource
   */
  async canRead(
    userId: string,
    tenantId: string,
    resourceId: string,
    resourceType: 'layout' | 'region' | 'version'
  ): Promise<boolean> {
    return this.hasPermission(
      userId,
      tenantId,
      resourceType === 'layout' ? DashboardPermission.LAYOUT_READ :
      resourceType === 'region' ? DashboardPermission.REGION_READ :
      DashboardPermission.VERSION_READ,
      resourceId,
      resourceType
    );
  }

  /**
   * Check if user can write (create/update) a resource
   */
  async canWrite(
    userId: string,
    tenantId: string,
    resourceId: string,
    resourceType: 'layout' | 'region' | 'version'
  ): Promise<boolean> {
    return this.hasPermission(
      userId,
      tenantId,
      resourceType === 'layout' ? DashboardPermission.LAYOUT_WRITE :
      resourceType === 'region' ? DashboardPermission.REGION_WRITE :
      DashboardPermission.VERSION_CREATE,
      resourceId,
      resourceType
    );
  }

  /**
   * Check if user can delete a resource
   */
  async canDelete(
    userId: string,
    tenantId: string,
    resourceId: string,
    resourceType: 'layout' | 'region'
  ): Promise<boolean> {
    return this.hasPermission(
      userId,
      tenantId,
      resourceType === 'layout' ? DashboardPermission.LAYOUT_DELETE :
      DashboardPermission.REGION_DELETE,
      resourceId,
      resourceType
    );
  }

  /**
   * Check if user can share a region
   */
  async canShare(
    userId: string,
    tenantId: string,
    regionId: string
  ): Promise<boolean> {
    return this.hasPermission(
      userId,
      tenantId,
      DashboardPermission.REGION_SHARE,
      regionId,
      'region'
    );
  }

  /**
   * Get user data from database
   */
  private async getUserData(userId: string, tenantId: string) {
    try {
      const user = await this.db.user.findFirst({
        where: {
          id: userId,
          tenant_id: tenantId,
          status: 'active'
        },
        select: {
          id: true,
          tenant_id: true,
          roles: true,
          custom_permissions: true,
          status: true
        }
      });

      return user;
    } catch (error) {
      console.error('Error fetching user data for authorization:', error);
      return null;
    }
  }

  /**
   * Check if user owns a resource
   */
  private async checkResourceOwnership(
    userId: string,
    tenantId: string,
    resourceId: string,
    resourceType: 'layout' | 'region' | 'version' | 'widget'
  ): Promise<boolean> {
    try {
      const supabase = this.supabaseService.getClient();
      
      switch (resourceType) {
        case 'layout':
          const { data: layout } = await supabase
            .from('dashboard_layouts')
            .select('id')
            .eq('id', resourceId)
            .eq('tenant_id', tenantId)
            .eq('user_id', userId)
            .is('deleted_at', null)
            .single();
          return !!layout;

        case 'region':
          const { data: region } = await supabase
            .from('dashboard_regions')
            .select('id')
            .eq('id', resourceId)
            .eq('tenant_id', tenantId)
            .eq('user_id', userId)
            .is('deleted_at', null)
            .single();
          return !!region;

        case 'version':
          // Versions are tied to layouts, check layout ownership
          const { data: version } = await supabase
            .from('dashboard_layout_versions')
            .select('layout_id, dashboard_layouts!inner(user_id)')
            .eq('id', resourceId)
            .eq('tenant_id', tenantId)
            .single();
          
          if (!version) return false;
          
          // Check if the layout belongs to the user
          const { data: layoutForVersion } = await supabase
            .from('dashboard_layouts')
            .select('user_id')
            .eq('id', version.layout_id)
            .eq('user_id', userId)
            .single();
          
          return !!layoutForVersion;

        default:
          return false;
      }
    } catch (error) {
      console.error('Error checking resource ownership:', error);
      return false;
    }
  }
}
