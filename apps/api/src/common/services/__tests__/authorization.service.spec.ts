/**
 * AuthorizationService Unit Tests
 * Tests permission checking logic, role-based access, and resource ownership
 */

import { Test, TestingModule } from '@nestjs/testing';
import { AuthorizationService, DashboardPermission } from '../authorization.service';
import { DatabaseService } from '../database.service';
import { PermissionsService } from '../permissions.service';
import { SupabaseService } from '../supabase.service';

describe('AuthorizationService', () => {
  let service: AuthorizationService;
  let dbService: jest.Mocked<DatabaseService>;
  let supabaseService: jest.Mocked<SupabaseService>;
  let mockSupabaseClient: any;

  const mockUser = {
    id: 'user-123',
    tenant_id: 'tenant-123',
    roles: ['technician'],
    custom_permissions: [],
    status: 'active'
  };

  const mockAdminUser = {
    id: 'admin-123',
    tenant_id: 'tenant-123',
    roles: ['admin'],
    custom_permissions: [],
    status: 'active'
  };

  const mockOwnerUser = {
    id: 'owner-123',
    tenant_id: 'tenant-123',
    roles: ['owner'],
    custom_permissions: [],
    status: 'active'
  };

  beforeEach(async () => {
    // Create chainable mock for Supabase queries
    const createChainableMock = () => {
      const chain = {
        from: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        is: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: null, error: null })
      };
      return chain;
    };

    mockSupabaseClient = createChainableMock();

    const mockDbService = {
      user: {
        findFirst: jest.fn()
      }
    } as any;

    const mockSupabaseService = {
      getClient: jest.fn().mockReturnValue(mockSupabaseClient)
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthorizationService,
        {
          provide: DatabaseService,
          useValue: mockDbService
        },
        {
          provide: SupabaseService,
          useValue: mockSupabaseService
        },
        PermissionsService
      ]
    }).compile();

    service = module.get<AuthorizationService>(AuthorizationService);
    dbService = module.get(DatabaseService);
    supabaseService = module.get(SupabaseService);
  });

  describe('hasPermission', () => {
    it('should return false for non-existent user', async () => {
      dbService.user.findFirst.mockResolvedValue(null);

      const result = await service.hasPermission(
        'non-existent',
        'tenant-123',
        DashboardPermission.LAYOUT_READ
      );

      expect(result).toBe(false);
    });

    it('should return false for user from different tenant', async () => {
      const differentTenantUser = { ...mockUser, tenant_id: 'different-tenant' };
      dbService.user.findFirst.mockResolvedValue(differentTenantUser);

      const result = await service.hasPermission(
        mockUser.id,
        'tenant-123',
        DashboardPermission.LAYOUT_READ
      );

      expect(result).toBe(false);
    });

    it('should return true for admin user (all permissions)', async () => {
      dbService.user.findFirst.mockResolvedValue(mockAdminUser);

      const result = await service.hasPermission(
        mockAdminUser.id,
        mockAdminUser.tenant_id,
        DashboardPermission.LAYOUT_READ
      );

      expect(result).toBe(true);
    });

    it('should return true for resource owner', async () => {
      dbService.user.findFirst.mockResolvedValue(mockUser);
      // Mock Supabase query for layout ownership check
      mockSupabaseClient.single.mockResolvedValueOnce({
        data: { id: 'layout-123' },
        error: null
      });

      const result = await service.hasPermission(
        mockUser.id,
        mockUser.tenant_id,
        DashboardPermission.LAYOUT_READ,
        'layout-123',
        'layout'
      );

      expect(result).toBe(true);
    });

    it('should check role-based permissions', async () => {
      dbService.user.findFirst.mockResolvedValue(mockOwnerUser);
      // Mock Supabase query returning null (not owner)
      mockSupabaseClient.single.mockResolvedValueOnce({
        data: null,
        error: null
      });

      // Owner role has dashboard_layout:read permission
      const result = await service.hasPermission(
        mockOwnerUser.id,
        mockOwnerUser.tenant_id,
        DashboardPermission.LAYOUT_READ,
        'layout-123',
        'layout'
      );

      expect(result).toBe(true);
    });

    it('should check custom permissions', async () => {
      const userWithCustomPerms = {
        ...mockUser,
        custom_permissions: ['dashboard_layout:write']
      };
      dbService.user.findFirst.mockResolvedValue(userWithCustomPerms);
      // Mock Supabase query returning null (not owner)
      mockSupabaseClient.single.mockResolvedValueOnce({
        data: null,
        error: null
      });

      const result = await service.hasPermission(
        userWithCustomPerms.id,
        userWithCustomPerms.tenant_id,
        DashboardPermission.LAYOUT_WRITE,
        'layout-123',
        'layout'
      );

      expect(result).toBe(true);
    });

    it('should return false when user lacks permission', async () => {
      dbService.user.findFirst.mockResolvedValue(mockUser);
      // Mock Supabase query returning null (not owner)
      mockSupabaseClient.single.mockResolvedValueOnce({
        data: null,
        error: null
      });

      // Technician role doesn't have dashboard_layout:write
      const result = await service.hasPermission(
        mockUser.id,
        mockUser.tenant_id,
        DashboardPermission.LAYOUT_WRITE,
        'layout-123',
        'layout'
      );

      expect(result).toBe(false);
    });
  });

  describe('canRead', () => {
    it('should check read permission for layout', async () => {
      dbService.user.findFirst.mockResolvedValue(mockOwnerUser);
      // Mock Supabase query returning null (not owner, but owner role has permission)
      mockSupabaseClient.single.mockResolvedValueOnce({
        data: null,
        error: null
      });

      const result = await service.canRead(
        mockOwnerUser.id,
        mockOwnerUser.tenant_id,
        'layout-123',
        'layout'
      );

      expect(result).toBe(true);
      expect(dbService.user.findFirst).toHaveBeenCalledWith({
        where: {
          id: mockOwnerUser.id,
          tenant_id: mockOwnerUser.tenant_id,
          status: 'active'
        },
        select: expect.any(Object)
      });
    });

    it('should check read permission for region', async () => {
      dbService.user.findFirst.mockResolvedValue(mockOwnerUser);
      // Mock Supabase query returning null (not owner, but owner role has permission)
      mockSupabaseClient.single.mockResolvedValueOnce({
        data: null,
        error: null
      });

      const result = await service.canRead(
        mockOwnerUser.id,
        mockOwnerUser.tenant_id,
        'region-123',
        'region'
      );

      expect(result).toBe(true);
    });
  });

  describe('canWrite', () => {
    it('should check write permission for layout', async () => {
      dbService.user.findFirst.mockResolvedValue(mockOwnerUser);
      // Mock Supabase query returning null (not owner, but owner role has permission)
      mockSupabaseClient.single.mockResolvedValueOnce({
        data: null,
        error: null
      });

      const result = await service.canWrite(
        mockOwnerUser.id,
        mockOwnerUser.tenant_id,
        'layout-123',
        'layout'
      );

      expect(result).toBe(true);
    });

    it('should check write permission for region', async () => {
      dbService.user.findFirst.mockResolvedValue(mockOwnerUser);
      // Mock Supabase query returning null (not owner, but owner role has permission)
      mockSupabaseClient.single.mockResolvedValueOnce({
        data: null,
        error: null
      });

      const result = await service.canWrite(
        mockOwnerUser.id,
        mockOwnerUser.tenant_id,
        'region-123',
        'region'
      );

      expect(result).toBe(true);
    });
  });

  describe('canDelete', () => {
    it('should check delete permission for layout', async () => {
      dbService.user.findFirst.mockResolvedValue(mockOwnerUser);
      // Mock Supabase query returning null (not owner, but owner role has permission)
      mockSupabaseClient.single.mockResolvedValueOnce({
        data: null,
        error: null
      });

      const result = await service.canDelete(
        mockOwnerUser.id,
        mockOwnerUser.tenant_id,
        'layout-123',
        'layout'
      );

      expect(result).toBe(true);
    });

    it('should check delete permission for region', async () => {
      dbService.user.findFirst.mockResolvedValue(mockOwnerUser);
      // Mock Supabase query returning null (not owner, but owner role has permission)
      mockSupabaseClient.single.mockResolvedValueOnce({
        data: null,
        error: null
      });

      const result = await service.canDelete(
        mockOwnerUser.id,
        mockOwnerUser.tenant_id,
        'region-123',
        'region'
      );

      expect(result).toBe(true);
    });
  });

  describe('canShare', () => {
    it('should check share permission for region', async () => {
      dbService.user.findFirst.mockResolvedValue(mockOwnerUser);
      // Mock Supabase query returning null (not owner, but owner role has permission)
      mockSupabaseClient.single.mockResolvedValueOnce({
        data: null,
        error: null
      });

      const result = await service.canShare(
        mockOwnerUser.id,
        mockOwnerUser.tenant_id,
        'region-123'
      );

      expect(result).toBe(true);
    });
  });

  describe('Resource Ownership', () => {
    it('should detect layout ownership', async () => {
      dbService.user.findFirst.mockResolvedValue(mockUser);
      // Mock Supabase query returning layout (user is owner)
      mockSupabaseClient.single.mockResolvedValueOnce({
        data: { id: 'layout-123' },
        error: null
      });

      const result = await service.hasPermission(
        mockUser.id,
        mockUser.tenant_id,
        DashboardPermission.LAYOUT_READ,
        'layout-123',
        'layout'
      );

      expect(result).toBe(true);
    });

    it('should detect region ownership', async () => {
      dbService.user.findFirst.mockResolvedValue(mockUser);
      // Mock Supabase query returning region (user is owner)
      mockSupabaseClient.single.mockResolvedValueOnce({
        data: { id: 'region-123' },
        error: null
      });

      const result = await service.hasPermission(
        mockUser.id,
        mockUser.tenant_id,
        DashboardPermission.REGION_READ,
        'region-123',
        'region'
      );

      expect(result).toBe(true);
    });

    it('should detect version ownership via layout', async () => {
      dbService.user.findFirst.mockResolvedValue(mockUser);
      // Mock Supabase queries for version ownership check
      // First query: get version with layout_id
      mockSupabaseClient.single.mockResolvedValueOnce({
        data: { layout_id: 'layout-123' },
        error: null
      });
      // Second query: check if layout belongs to user
      mockSupabaseClient.single.mockResolvedValueOnce({
        data: { user_id: mockUser.id },
        error: null
      });

      const result = await service.hasPermission(
        mockUser.id,
        mockUser.tenant_id,
        DashboardPermission.VERSION_READ,
        'version-123',
        'version'
      );

      expect(result).toBe(true);
    });

    it('should return false for non-owner', async () => {
      dbService.user.findFirst.mockResolvedValue(mockUser);
      // Mock Supabase query returning null (not owner)
      mockSupabaseClient.single.mockResolvedValueOnce({
        data: null,
        error: null
      });

      const result = await service.hasPermission(
        mockUser.id,
        mockUser.tenant_id,
        DashboardPermission.LAYOUT_WRITE,
        'layout-123',
        'layout'
      );

      expect(result).toBe(false);
    });
  });

  describe('Error Handling', () => {
    it('should handle database errors gracefully', async () => {
      dbService.user.findFirst.mockRejectedValue(new Error('Database error'));

      const result = await service.hasPermission(
        mockUser.id,
        mockUser.tenant_id,
        DashboardPermission.LAYOUT_READ
      );

      expect(result).toBe(false);
    });

    it('should handle resource ownership check errors', async () => {
      dbService.user.findFirst.mockResolvedValue(mockUser);
      // Mock Supabase query returning error (not throwing - Supabase returns { data, error })
      // The query builder chain needs to be properly mocked
      const queryBuilder = {
        from: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        is: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: null,
          error: { message: 'Database error', code: 'PGRST116' }
        })
      };
      mockSupabaseClient.from.mockReturnValue(queryBuilder);

      // Mock PermissionsService to return false (user doesn't have permission)
      jest.spyOn(service['permissionsService'], 'getCombinedPermissions').mockReturnValue([]);
      jest.spyOn(service['permissionsService'], 'hasPermission').mockReturnValue(false);

      const result = await service.hasPermission(
        mockUser.id,
        mockUser.tenant_id,
        DashboardPermission.LAYOUT_READ,
        'layout-123',
        'layout'
      );

      // When ownership check fails, it falls back to permission checking
      // Since user doesn't have the permission, should return false
      expect(result).toBe(false);
    });
  });
});

