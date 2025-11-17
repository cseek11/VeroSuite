/**
 * Versioning Service Unit Tests
 * Tests for dashboard layout versioning, rollback, and diff calculation
 */

import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { VersioningService } from '../../../src/dashboard/versioning.service';
import { SupabaseService } from '../../../src/common/services/supabase.service';
import { LayoutVersionStatus } from '../../../src/dashboard/dto/dashboard-region.dto';

describe('VersioningService', () => {
  let service: VersioningService;
  let supabaseService: SupabaseService;

  const mockUser = {
    userId: 'user-123',
    tenantId: 'tenant-123',
  };

  const mockLayoutId = 'layout-123';
  const mockVersionId = 'version-123';

  const mockLayout = {
    id: mockLayoutId,
    tenant_id: mockUser.tenantId,
    user_id: mockUser.userId,
    name: 'Test Layout',
  };

  const mockRegions = [
    {
      id: 'region-1',
      layout_id: mockLayoutId,
      region_type: 'widget',
    },
  ];

  const mockVersion = {
    id: mockVersionId,
    layout_id: mockLayoutId,
    version_number: 1,
    status: LayoutVersionStatus.DRAFT,
    payload: { layout: mockLayout, regions: mockRegions },
    created_by: mockUser.userId,
    tenant_id: mockUser.tenantId,
  };

  // Create query builders per table - reuse same builder for same table
  const queryBuilders = new Map<string, any>();
  
  const createMockQueryBuilder = (table: string) => {
    if (!queryBuilders.has(table)) {
      const builder: any = {
        select: jest.fn(),
        insert: jest.fn(), // insert() returns builder for chaining
        update: jest.fn(),
        upsert: jest.fn(),
        eq: jest.fn(),
        is: jest.fn(), // is() can return promise or builder
        order: jest.fn(),
        limit: jest.fn(),
        single: jest.fn(), // single() returns promise
      };
      // Set up chainable methods to return the builder itself (not this, which might not work in mocks)
      builder.select.mockReturnValue(builder);
      builder.insert.mockReturnValue(builder);
      builder.update.mockReturnValue(builder);
      builder.upsert.mockReturnValue(builder);
      builder.eq.mockReturnValue(builder);
      builder.is.mockReturnValue(builder);
      builder.order.mockReturnValue(builder);
      builder.limit.mockReturnValue(builder);
      // Make the builder thenable so it can be awaited
      builder.then = jest.fn((resolve, reject) => {
        // Default to success, can be overridden per test
        const result = { data: null, error: null };
        return Promise.resolve(result).then(resolve, reject);
      });
      queryBuilders.set(table, builder);
    }
    return queryBuilders.get(table);
  };

  const mockSupabaseClient = {
    from: jest.fn((table: string) => createMockQueryBuilder(table)),
  };
  
  // Helper to get builders for test setup - creates if doesn't exist
  const getBuilder = (table: string) => {
    if (!queryBuilders.has(table)) {
      createMockQueryBuilder(table);
    }
    return queryBuilders.get(table);
  };

  beforeEach(async () => {
    // Clear query builders before each test
    queryBuilders.clear();
    
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VersioningService,
        {
          provide: SupabaseService,
          useValue: {
            getClient: jest.fn().mockReturnValue(mockSupabaseClient),
          },
        },
      ],
    }).compile();

    service = module.get<VersioningService>(VersioningService);
    supabaseService = module.get<SupabaseService>(SupabaseService);

    // Reset mocks but keep query builders (they'll be populated as from() is called)
    jest.clearAllMocks();
    
    // Re-apply mockReturnValue(builder) after clearAllMocks() clears it
    // This ensures insert().select().single() chain works correctly
    queryBuilders.forEach((builder) => {
      builder.select.mockReturnValue(builder);
      builder.insert.mockReturnValue(builder);
      builder.update.mockReturnValue(builder);
      builder.upsert.mockReturnValue(builder);
      builder.eq.mockReturnValue(builder);
      builder.is.mockReturnValue(builder);
      builder.order.mockReturnValue(builder);
      builder.limit.mockReturnValue(builder);
    });
  });

  describe('createVersion', () => {
    it('should create first version successfully', async () => {
      // Pre-create builders so we can set up mocks
      const tempClient = supabaseService.getClient();
      tempClient.from('dashboard_layouts');
      tempClient.from('dashboard_regions');
      tempClient.from('dashboard_layout_versions');
      
      const layoutsBuilder = getBuilder('dashboard_layouts');
      const regionsBuilder = getBuilder('dashboard_regions');
      const versionsBuilder = getBuilder('dashboard_layout_versions');
      
      // Setup mock responses in order of service calls:
      // 1. Layout check: .select().eq().eq().eq().is().single()
      layoutsBuilder.single.mockResolvedValueOnce({ data: mockLayout, error: null });
      // 2. Regions query: .select().eq().eq().eq().is() - is() returns promise
      regionsBuilder.is.mockImplementationOnce(() => Promise.resolve({ data: mockRegions, error: null }));
      // 3. Last version check: .select().eq().order().limit().single()
      versionsBuilder.single.mockResolvedValueOnce({ data: null, error: { code: 'PGRST116' } });
      // 4. Version creation: .insert().select().single()
      // insert() and select() return builder by default (mockReturnThis), single() returns promise
      // Ensure insert() and select() return builder (they should already from mockReturnThis)
      versionsBuilder.single.mockResolvedValueOnce({ data: mockVersion, error: null });

      const result = await service.createVersion(mockLayoutId, mockUser);

      expect(result).toBeDefined();
      expect(result.version_number).toBe(1);
      expect(versionsBuilder.insert).toHaveBeenCalled();
    });

    it('should create subsequent version with incremented number', async () => {
      const lastVersion = { version_number: 2 };
      const newVersion = { ...mockVersion, version_number: 3 };

      const tempClient = supabaseService.getClient();
      tempClient.from('dashboard_layouts');
      tempClient.from('dashboard_regions');
      tempClient.from('dashboard_layout_versions');
      
      const layoutsBuilder = getBuilder('dashboard_layouts');
      const regionsBuilder = getBuilder('dashboard_regions');
      const versionsBuilder = getBuilder('dashboard_layout_versions');

      layoutsBuilder.single.mockResolvedValueOnce({ data: mockLayout, error: null });
      regionsBuilder.is.mockImplementationOnce(() => Promise.resolve({ data: mockRegions, error: null }));
      versionsBuilder.single.mockResolvedValueOnce({ data: lastVersion, error: null }); // Last version exists
      versionsBuilder.single.mockResolvedValueOnce({ data: mockVersion, error: null }); // getVersionByNumber
      versionsBuilder.insert.mockImplementationOnce(() => versionsBuilder);
      versionsBuilder.select.mockImplementationOnce(() => versionsBuilder);
      versionsBuilder.single.mockResolvedValueOnce({ data: newVersion, error: null }); // New version creation

      const result = await service.createVersion(mockLayoutId, mockUser);

      expect(result.version_number).toBe(3);
    });

    it('should throw NotFoundException when layout not found', async () => {
      const tempClient = supabaseService.getClient();
      tempClient.from('dashboard_layouts');
      const layoutsBuilder = getBuilder('dashboard_layouts');
      
      layoutsBuilder.single.mockResolvedValueOnce({ data: null, error: { code: 'PGRST116' } });

      await expect(service.createVersion(mockLayoutId, mockUser)).rejects.toThrow(NotFoundException);
      await expect(service.createVersion(mockLayoutId, mockUser)).rejects.toThrow('Layout not found');
    });

    it('should calculate diff when previous version exists', async () => {
      const lastVersion = { version_number: 1 };
      const previousVersion = { ...mockVersion, payload: { layout: mockLayout, regions: [] } };

      const tempClient = supabaseService.getClient();
      tempClient.from('dashboard_layouts');
      tempClient.from('dashboard_regions');
      tempClient.from('dashboard_layout_versions');
      
      const layoutsBuilder = getBuilder('dashboard_layouts');
      const regionsBuilder = getBuilder('dashboard_regions');
      const versionsBuilder = getBuilder('dashboard_layout_versions');

      layoutsBuilder.single.mockResolvedValueOnce({ data: mockLayout, error: null });
      regionsBuilder.is.mockImplementationOnce(() => Promise.resolve({ data: mockRegions, error: null }));
      versionsBuilder.single.mockResolvedValueOnce({ data: lastVersion, error: null });
      versionsBuilder.single.mockResolvedValueOnce({ data: previousVersion, error: null });
      versionsBuilder.insert.mockImplementationOnce(() => versionsBuilder);
      versionsBuilder.select.mockImplementationOnce(() => versionsBuilder);
      versionsBuilder.single.mockResolvedValueOnce({ data: mockVersion, error: null });

      const result = await service.createVersion(mockLayoutId, mockUser);

      expect(result).toBeDefined();
      expect(versionsBuilder.insert).toHaveBeenCalledWith(
        expect.objectContaining({
          diff: expect.anything(),
        })
      );
    });

    it('should handle Supabase errors gracefully', async () => {
      const tempClient = supabaseService.getClient();
      tempClient.from('dashboard_layouts');
      tempClient.from('dashboard_regions');
      tempClient.from('dashboard_layout_versions');
      
      const layoutsBuilder = getBuilder('dashboard_layouts');
      const regionsBuilder = getBuilder('dashboard_regions');
      const versionsBuilder = getBuilder('dashboard_layout_versions');

      layoutsBuilder.single.mockResolvedValueOnce({ data: mockLayout, error: null });
      regionsBuilder.is.mockImplementationOnce(() => Promise.resolve({ data: mockRegions, error: null }));
      versionsBuilder.single.mockResolvedValueOnce({ data: null, error: { code: 'PGRST116' } });
      versionsBuilder.single.mockResolvedValueOnce({ data: null, error: { message: 'Database error' } });

      await expect(service.createVersion(mockLayoutId, mockUser)).rejects.toThrow(BadRequestException);
    });
  });

  describe('getVersions', () => {
    it('should return all versions for layout', async () => {
      const mockVersions = [mockVersion, { ...mockVersion, version_number: 2 }];

      const tempClient = supabaseService.getClient();
      tempClient.from('dashboard_layouts');
      tempClient.from('dashboard_layout_versions');
      
      const layoutsBuilder = getBuilder('dashboard_layouts');
      const versionsBuilder = getBuilder('dashboard_layout_versions');

      layoutsBuilder.single.mockResolvedValueOnce({ data: mockLayout, error: null }); // Layout check
      // getVersions uses: .select().eq().eq().order() - order() returns promise
      versionsBuilder.order.mockImplementationOnce(() => Promise.resolve({ data: mockVersions, error: null }));

      const result = await service.getVersions(mockLayoutId, mockUser);

      expect(result).toHaveLength(2);
      expect(versionsBuilder.eq).toHaveBeenCalledWith('layout_id', mockLayoutId);
      expect(versionsBuilder.eq).toHaveBeenCalledWith('tenant_id', mockUser.tenantId);
    });

    it('should throw NotFoundException when layout not found', async () => {
      const tempClient = supabaseService.getClient();
      tempClient.from('dashboard_layouts');
      const layoutsBuilder = getBuilder('dashboard_layouts');
      
      layoutsBuilder.single.mockResolvedValueOnce({ data: null, error: { code: 'PGRST116' } });

      await expect(service.getVersions(mockLayoutId, mockUser)).rejects.toThrow(NotFoundException);
    });

    it('should handle Supabase errors', async () => {
      const tempClient = supabaseService.getClient();
      tempClient.from('dashboard_layouts');
      tempClient.from('dashboard_layout_versions');
      
      const layoutsBuilder = getBuilder('dashboard_layouts');
      const versionsBuilder = getBuilder('dashboard_layout_versions');

      layoutsBuilder.single.mockResolvedValueOnce({ data: mockLayout, error: null });
      versionsBuilder.order.mockImplementationOnce(() => Promise.resolve({ data: null, error: { message: 'Database error' } }));

      await expect(service.getVersions(mockLayoutId, mockUser)).rejects.toThrow(BadRequestException);
    });
  });

  describe('getVersion', () => {
    it('should return version by ID', async () => {
      const tempClient = supabaseService.getClient();
      tempClient.from('dashboard_layout_versions');
      const versionsBuilder = getBuilder('dashboard_layout_versions');
      
      versionsBuilder.single.mockResolvedValueOnce({ data: mockVersion, error: null });

      const result = await service.getVersion(mockVersionId, mockUser);

      expect(result).toEqual(mockVersion);
      expect(versionsBuilder.eq).toHaveBeenCalledWith('id', mockVersionId);
      expect(versionsBuilder.eq).toHaveBeenCalledWith('tenant_id', mockUser.tenantId);
    });

    it('should throw NotFoundException when version not found', async () => {
      const tempClient = supabaseService.getClient();
      tempClient.from('dashboard_layout_versions');
      const versionsBuilder = getBuilder('dashboard_layout_versions');
      
      versionsBuilder.single.mockResolvedValueOnce({ data: null, error: { code: 'PGRST116' } });

      await expect(service.getVersion(mockVersionId, mockUser)).rejects.toThrow(NotFoundException);
    });

    it('should handle other Supabase errors', async () => {
      const tempClient = supabaseService.getClient();
      tempClient.from('dashboard_layout_versions');
      const versionsBuilder = getBuilder('dashboard_layout_versions');
      
      versionsBuilder.single.mockResolvedValueOnce({ data: null, error: { message: 'Database error' } });

      await expect(service.getVersion(mockVersionId, mockUser)).rejects.toThrow(BadRequestException);
    });
  });

  describe('getVersionByNumber', () => {
    it('should return version by number', async () => {
      const tempClient = supabaseService.getClient();
      tempClient.from('dashboard_layout_versions');
      const versionsBuilder = getBuilder('dashboard_layout_versions');
      
      versionsBuilder.single.mockResolvedValueOnce({ data: mockVersion, error: null });

      const result = await service.getVersionByNumber(mockLayoutId, 1, mockUser);

      expect(result).toEqual(mockVersion);
      expect(versionsBuilder.eq).toHaveBeenCalledWith('version_number', 1);
    });

    it('should return null when version not found', async () => {
      const tempClient = supabaseService.getClient();
      tempClient.from('dashboard_layout_versions');
      const versionsBuilder = getBuilder('dashboard_layout_versions');
      
      versionsBuilder.single.mockResolvedValueOnce({ data: null, error: { code: 'PGRST116' } });

      const result = await service.getVersionByNumber(mockLayoutId, 999, mockUser);

      expect(result).toBeNull();
    });
  });

  describe('publishVersion', () => {
    it('should publish version successfully', async () => {
      const publishedVersion = { ...mockVersion, status: LayoutVersionStatus.PUBLISHED };

      const tempClient = supabaseService.getClient();
      tempClient.from('dashboard_layouts');
      tempClient.from('dashboard_layout_versions');
      
      const layoutsBuilder = getBuilder('dashboard_layouts');
      const versionsBuilder = getBuilder('dashboard_layout_versions');

      // Pre-create regions builder for restoreFromVersion
      tempClient.from('dashboard_regions');
      const regionsBuilder = getBuilder('dashboard_regions');
      
      // publishVersion calls getVersion() first, which calls .select().eq().eq().single()
      versionsBuilder.single.mockResolvedValueOnce({ data: mockVersion, error: null }); // Get version
      // Then it checks layout: .select().eq().eq().eq().is().single()
      layoutsBuilder.single.mockResolvedValueOnce({ data: mockLayout, error: null }); // Layout check
      // First update call: .update().eq().eq().eq() - no return, just awaited
      versionsBuilder.update.mockImplementationOnce(() => versionsBuilder);
      // Second update call: .update().eq().eq().select().single()
      versionsBuilder.update.mockImplementationOnce(() => versionsBuilder);
      versionsBuilder.single.mockResolvedValueOnce({ data: publishedVersion, error: null }); // Update version
      // restoreFromVersion is called, which does update and upsert on regions
      regionsBuilder.update.mockImplementationOnce(() => regionsBuilder);
      regionsBuilder.is.mockImplementationOnce(() => Promise.resolve({ data: null, error: null }));
      regionsBuilder.upsert.mockResolvedValueOnce({ data: null, error: null });

      const result = await service.publishVersion(mockLayoutId, mockVersionId, mockUser);

      expect(result.status).toBe(LayoutVersionStatus.PUBLISHED);
      expect(versionsBuilder.update).toHaveBeenCalled();
    });

    it('should throw NotFoundException when version not found', async () => {
      const tempClient = supabaseService.getClient();
      tempClient.from('dashboard_layout_versions');
      const versionsBuilder = getBuilder('dashboard_layout_versions');
      
      versionsBuilder.single.mockResolvedValueOnce({ data: null, error: { code: 'PGRST116' } });

      await expect(service.publishVersion(mockLayoutId, mockVersionId, mockUser)).rejects.toThrow(
        NotFoundException
      );
    });

    it('should throw NotFoundException when layout not found', async () => {
      const tempClient = supabaseService.getClient();
      tempClient.from('dashboard_layouts');
      tempClient.from('dashboard_layout_versions');
      
      const layoutsBuilder = getBuilder('dashboard_layouts');
      const versionsBuilder = getBuilder('dashboard_layout_versions');

      versionsBuilder.single.mockResolvedValueOnce({ data: mockVersion, error: null });
      layoutsBuilder.single.mockResolvedValueOnce({ data: null, error: { code: 'PGRST116' } });

      await expect(service.publishVersion(mockLayoutId, mockVersionId, mockUser)).rejects.toThrow(
        NotFoundException
      );
    });
  });

  describe('revertToVersion', () => {
    it('should revert layout to version successfully', async () => {
      const tempClient = supabaseService.getClient();
      tempClient.from('dashboard_layouts');
      tempClient.from('dashboard_regions');
      tempClient.from('dashboard_layout_versions');
      
      const layoutsBuilder = getBuilder('dashboard_layouts');
      const regionsBuilder = getBuilder('dashboard_regions');
      const versionsBuilder = getBuilder('dashboard_layout_versions');

      // revertToVersion calls getVersion() first
      versionsBuilder.single.mockResolvedValueOnce({ data: mockVersion, error: null }); // Get version (from getVersion call)
      // restoreFromVersion is called, which checks layout first: .select().eq().eq().eq().is().single()
      layoutsBuilder.single.mockResolvedValueOnce({ data: mockLayout, error: null }); // Layout check (from restoreFromVersion)
      // restoreFromVersion calls: update().eq().eq().eq().is() - is() returns promise
      regionsBuilder.update.mockImplementationOnce(() => regionsBuilder);
      regionsBuilder.is.mockImplementationOnce(() => Promise.resolve({ data: null, error: null }));
      // restoreFromVersion also calls upsert() which returns a promise
      regionsBuilder.upsert.mockResolvedValueOnce({ data: mockRegions, error: null });
      // createVersion is called at the end, needs full setup
      layoutsBuilder.single.mockResolvedValueOnce({ data: mockLayout, error: null }); // Layout check in createVersion
      regionsBuilder.is.mockImplementationOnce(() => Promise.resolve({ data: mockRegions, error: null })); // Regions in createVersion
      versionsBuilder.single.mockResolvedValueOnce({ data: null, error: { code: 'PGRST116' } }); // No previous version
      versionsBuilder.insert.mockImplementationOnce(() => versionsBuilder);
      versionsBuilder.single.mockResolvedValueOnce({ data: mockVersion, error: null }); // Version creation

      const result = await service.revertToVersion(mockLayoutId, mockVersionId, mockUser);

      expect(result.success).toBe(true);
      expect(layoutsBuilder.update).toHaveBeenCalled();
    });

    it('should throw NotFoundException when version not found', async () => {
      const tempClient = supabaseService.getClient();
      tempClient.from('dashboard_layout_versions');
      const versionsBuilder = getBuilder('dashboard_layout_versions');
      
      versionsBuilder.single.mockResolvedValueOnce({ data: null, error: { code: 'PGRST116' } });

      await expect(service.revertToVersion(mockLayoutId, mockVersionId, mockUser)).rejects.toThrow(
        NotFoundException
      );
    });
  });

  describe('getVersionDiff', () => {
    it('should return diff between two versions', async () => {
      const version1 = { ...mockVersion, id: 'version-1', payload: { layout: mockLayout, regions: [] } };
      const version2 = { ...mockVersion, id: 'version-2', payload: { layout: mockLayout, regions: mockRegions } };

      const tempClient = supabaseService.getClient();
      tempClient.from('dashboard_layout_versions');
      const versionsBuilder = getBuilder('dashboard_layout_versions');
      
      // getVersionDiff calls getVersion() twice
      versionsBuilder.single.mockResolvedValueOnce({ data: version1, error: null }); // First getVersion call
      versionsBuilder.single.mockResolvedValueOnce({ data: version2, error: null }); // Second getVersion call

      const result = await service.getVersionDiff('version-1', 'version-2', mockUser);

      expect(result).toBeDefined();
      expect(result).toHaveProperty('added');
      expect(result).toHaveProperty('removed');
      expect(result).toHaveProperty('modified');
    });

    it('should throw NotFoundException when version not found', async () => {
      const tempClient = supabaseService.getClient();
      tempClient.from('dashboard_layout_versions');
      const versionsBuilder = getBuilder('dashboard_layout_versions');
      
      versionsBuilder.single.mockResolvedValueOnce({ data: null, error: { code: 'PGRST116' } });

      await expect(service.getVersionDiff('version-1', 'version-2', mockUser)).rejects.toThrow(
        NotFoundException
      );
    });
  });
});

