import { Test, TestingModule } from '@nestjs/testing';
import { RegionRepository } from '../region.repository';
import { SupabaseService } from '../../../common/services/supabase.service';
import { CreateDashboardRegionDto, UpdateDashboardRegionDto, RegionType } from '../../dto/dashboard-region.dto';

describe('RegionRepository', () => {
  let repository: RegionRepository;
  let supabaseService: jest.Mocked<SupabaseService>;

  const mockTenantId = 'tenant-123';
  const mockUserId = 'user-123';
  const mockRegionId = 'region-123';
  const mockLayoutId = 'layout-123';

  const mockRegion = {
    id: mockRegionId,
    layout_id: mockLayoutId,
    tenant_id: mockTenantId,
    user_id: mockUserId,
    region_type: RegionType.SCHEDULING,
    grid_row: 0,
    grid_col: 0,
    row_span: 1,
    col_span: 1,
    version: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    deleted_at: null
  };

  beforeEach(async () => {
    const mockSupabaseClient = {
      from: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
      update: jest.fn().mockReturnThis(),
      delete: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      is: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
      single: jest.fn()
    };

    const mockSupabaseService = {
      getClient: jest.fn().mockReturnValue(mockSupabaseClient)
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RegionRepository,
        { provide: SupabaseService, useValue: mockSupabaseService }
      ]
    }).compile();

    repository = module.get<RegionRepository>(RegionRepository);
    supabaseService = module.get(SupabaseService);
  });

  describe('findById', () => {
    it('should find a region by ID', async () => {
      const mockQuery = {
        from: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        is: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: mockRegion, error: null })
      };

      supabaseService.getClient.mockReturnValue(mockQuery as any);

      const result = await repository.findById(mockRegionId, mockTenantId);

      expect(result).toEqual(mockRegion);
      expect(mockQuery.from).toHaveBeenCalledWith('dashboard_regions');
      expect(mockQuery.eq).toHaveBeenCalledWith('id', mockRegionId);
      expect(mockQuery.eq).toHaveBeenCalledWith('tenant_id', mockTenantId);
      expect(mockQuery.is).toHaveBeenCalledWith('deleted_at', null);
    });

    it('should return null when region not found', async () => {
      const mockQuery = {
        from: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        is: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: null,
          error: { code: 'PGRST116', message: 'No rows found' }
        })
      };

      supabaseService.getClient.mockReturnValue(mockQuery as any);

      const result = await repository.findById(mockRegionId, mockTenantId);

      expect(result).toBeNull();
    });

    it('should throw error on database error', async () => {
      const mockQuery = {
        from: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        is: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: null,
          error: { code: 'PGRST500', message: 'Database error' }
        })
      };

      supabaseService.getClient.mockReturnValue(mockQuery as any);

      await expect(repository.findById(mockRegionId, mockTenantId)).rejects.toThrow(
        'Failed to find region: Database error'
      );
    });
  });

  describe('findByLayoutId', () => {
    it('should find all regions for a layout', async () => {
      const mockRegions = [mockRegion, { ...mockRegion, id: 'region-456' }];
      const mockQuery = {
        from: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        is: jest.fn().mockReturnThis(),
        order: jest.fn()
      };
      // Chain order calls: first two return this, last one resolves
      mockQuery.order
        .mockReturnValueOnce(mockQuery) // First order call
        .mockReturnValueOnce(mockQuery) // Second order call
        .mockResolvedValueOnce({ data: mockRegions, error: null }); // Third order call resolves

      supabaseService.getClient.mockReturnValue(mockQuery as any);

      const result = await repository.findByLayoutId(mockLayoutId, mockTenantId);

      expect(result).toEqual(mockRegions);
      expect(mockQuery.eq).toHaveBeenCalledWith('layout_id', mockLayoutId);
      expect(mockQuery.eq).toHaveBeenCalledWith('tenant_id', mockTenantId);
      expect(mockQuery.order).toHaveBeenCalledWith('display_order', { ascending: true });
      expect(mockQuery.order).toHaveBeenCalledWith('grid_row', { ascending: true });
      expect(mockQuery.order).toHaveBeenCalledWith('grid_col', { ascending: true });
    });

    it('should return empty array when no regions found', async () => {
      const mockQuery = {
        from: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        is: jest.fn().mockReturnThis(),
        order: jest.fn()
      };
      // Chain order calls: first two return this, last one resolves
      mockQuery.order
        .mockReturnValueOnce(mockQuery) // First order call
        .mockReturnValueOnce(mockQuery) // Second order call
        .mockResolvedValueOnce({ data: [], error: null }); // Third order call resolves

      supabaseService.getClient.mockReturnValue(mockQuery as any);

      const result = await repository.findByLayoutId(mockLayoutId, mockTenantId);

      expect(result).toEqual([]);
    });

    it('should throw error on database error', async () => {
      const mockQuery = {
        from: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        is: jest.fn().mockReturnThis(),
        order: jest.fn()
      };
      // Chain order calls: first two return this, last one resolves with error
      mockQuery.order
        .mockReturnValueOnce(mockQuery) // First order call
        .mockReturnValueOnce(mockQuery) // Second order call
        .mockResolvedValueOnce({
          data: null,
          error: { message: 'Database error' }
        }); // Third order call resolves with error

      supabaseService.getClient.mockReturnValue(mockQuery as any);

      await expect(repository.findByLayoutId(mockLayoutId, mockTenantId)).rejects.toThrow(
        'Failed to find regions: Database error'
      );
    });
  });

  describe('findOverlappingRegions', () => {
    it('should find overlapping regions', async () => {
      const overlappingRegion = {
        ...mockRegion,
        id: 'region-456',
        grid_row: 0,
        grid_col: 0,
        row_span: 1,
        col_span: 1
      };

      const nonOverlappingRegion = {
        ...mockRegion,
        id: 'region-789',
        grid_row: 10,
        grid_col: 10,
        row_span: 1,
        col_span: 1
      };

      const mockQuery = {
        from: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        is: jest.fn().mockResolvedValue({
          data: [overlappingRegion, nonOverlappingRegion],
          error: null
        })
      };

      supabaseService.getClient.mockReturnValue(mockQuery as any);

      const result = await repository.findOverlappingRegions(
        mockLayoutId,
        mockTenantId,
        0, // gridRow
        0, // gridCol
        1, // rowSpan
        1, // colSpan
        mockRegionId // exclude this region
      );

      expect(result).toEqual([overlappingRegion]);
    });

    it('should exclude specified region from overlap check', async () => {
      const mockQuery = {
        from: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        is: jest.fn().mockResolvedValue({
          data: [mockRegion],
          error: null
        })
      };

      supabaseService.getClient.mockReturnValue(mockQuery as any);

      const result = await repository.findOverlappingRegions(
        mockLayoutId,
        mockTenantId,
        0,
        0,
        1,
        1,
        mockRegionId // exclude this region
      );

      expect(result).toEqual([]);
    });
  });

  describe('create', () => {
    it('should create a new region', async () => {
      const createDto: CreateDashboardRegionDto = {
        layout_id: mockLayoutId,
        region_type: RegionType.SCHEDULING,
        grid_row: 0,
        grid_col: 0,
        row_span: 1,
        col_span: 1
      };

      const mockQuery = {
        from: jest.fn().mockReturnThis(),
        insert: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: mockRegion, error: null })
      };

      supabaseService.getClient.mockReturnValue(mockQuery as any);

      const result = await repository.create(createDto, mockTenantId, mockUserId);

      expect(result).toEqual(mockRegion);
      expect(mockQuery.insert).toHaveBeenCalledWith(
        expect.objectContaining({
          tenant_id: mockTenantId,
          user_id: mockUserId,
          layout_id: mockLayoutId,
          region_type: RegionType.SCHEDULING,
          version: 1
        })
      );
    });

    it('should use default values for optional fields', async () => {
      const createDto: CreateDashboardRegionDto = {
        layout_id: mockLayoutId,
        region_type: RegionType.SCHEDULING
      };

      const mockQuery = {
        from: jest.fn().mockReturnThis(),
        insert: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: mockRegion, error: null })
      };

      supabaseService.getClient.mockReturnValue(mockQuery as any);

      await repository.create(createDto, mockTenantId, mockUserId);

      expect(mockQuery.insert).toHaveBeenCalledWith(
        expect.objectContaining({
          grid_row: 0,
          grid_col: 0,
          row_span: 1,
          col_span: 1,
          min_width: 200,
          min_height: 150,
          is_collapsed: false,
          is_locked: false,
          is_hidden_mobile: false,
          display_order: 0,
          config: {},
          widget_config: {}
        })
      );
    });

    it('should throw error on database error', async () => {
      const createDto: CreateDashboardRegionDto = {
        layout_id: mockLayoutId,
        region_type: RegionType.SCHEDULING
      };

      const mockQuery = {
        from: jest.fn().mockReturnThis(),
        insert: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: null,
          error: { message: 'Database error' }
        })
      };

      supabaseService.getClient.mockReturnValue(mockQuery as any);

      await expect(repository.create(createDto, mockTenantId, mockUserId)).rejects.toThrow(
        'Failed to create region: Database error'
      );
    });
  });

  describe('update', () => {
    it('should update a region successfully', async () => {
      const updateDto: UpdateDashboardRegionDto = {
        grid_row: 1,
        grid_col: 1
      };

      const updatedRegion = { ...mockRegion, ...updateDto, version: 2 };

      const mockQuery = {
        from: jest.fn().mockReturnThis(),
        update: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        is: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: updatedRegion, error: null })
      };

      supabaseService.getClient.mockReturnValue(mockQuery as any);

      const result = await repository.update(mockRegionId, updateDto, mockTenantId, 1);

      expect(result).toEqual(updatedRegion);
      expect((result as any).version).toBe(2);
      expect(mockQuery.eq).toHaveBeenCalledWith('version', 1);
    });

    it('should update without version check when version not provided', async () => {
      const updateDto: UpdateDashboardRegionDto = {
        grid_row: 1
      };

      const updatedRegion = { ...mockRegion, ...updateDto };

      const mockQuery = {
        from: jest.fn().mockReturnThis(),
        update: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        is: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: updatedRegion, error: null })
      };

      supabaseService.getClient.mockReturnValue(mockQuery as any);

      const result = await repository.update(mockRegionId, updateDto, mockTenantId);

      expect(result).toEqual(updatedRegion);
      expect(mockQuery.eq).not.toHaveBeenCalledWith('version', expect.anything());
    });

    it('should throw error on version mismatch', async () => {
      const updateDto: UpdateDashboardRegionDto = {
        grid_row: 1
      };

      const mockQuery = {
        from: jest.fn().mockReturnThis(),
        update: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        is: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: null,
          error: { code: 'PGRST116', message: 'No rows updated' }
        })
      };

      supabaseService.getClient.mockReturnValue(mockQuery as any);

      await expect(repository.update(mockRegionId, updateDto, mockTenantId, 1)).rejects.toThrow(
        'Region not found or version mismatch'
      );
    });
  });

  describe('delete', () => {
    it('should soft delete a region', async () => {
      const mockQuery = {
        from: jest.fn().mockReturnThis(),
        update: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        is: jest.fn().mockResolvedValue({ error: null })
      };

      supabaseService.getClient.mockReturnValue(mockQuery as any);

      await repository.delete(mockRegionId, mockTenantId);

      expect(mockQuery.update).toHaveBeenCalledWith(
        expect.objectContaining({
          deleted_at: expect.any(String)
        })
      );
      expect(mockQuery.eq).toHaveBeenCalledWith('id', mockRegionId);
      expect(mockQuery.eq).toHaveBeenCalledWith('tenant_id', mockTenantId);
    });

    it('should throw error on database error', async () => {
      const mockQuery = {
        from: jest.fn().mockReturnThis(),
        update: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        is: jest.fn().mockResolvedValue({
          error: { message: 'Database error' }
        })
      };

      supabaseService.getClient.mockReturnValue(mockQuery as any);

      await expect(repository.delete(mockRegionId, mockTenantId)).rejects.toThrow(
        'Failed to delete region: Database error'
      );
    });
  });

  describe('updateDisplayOrder', () => {
    it('should update display order for multiple regions', async () => {
      const regionIds = ['region-1', 'region-2', 'region-3'];
      const mockQuery = {
        from: jest.fn().mockReturnThis(),
        update: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        is: jest.fn().mockResolvedValue({ error: null })
      };

      supabaseService.getClient.mockReturnValue(mockQuery as any);

      await repository.updateDisplayOrder(mockLayoutId, regionIds, mockTenantId);

      expect(mockQuery.update).toHaveBeenCalledTimes(3);
      expect(mockQuery.eq).toHaveBeenCalledWith('layout_id', mockLayoutId);
    });

    it('should throw error if any update fails', async () => {
      const regionIds = ['region-1', 'region-2'];
      const mockQuery = {
        from: jest.fn().mockReturnThis(),
        update: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        is: jest.fn()
          .mockResolvedValueOnce({ error: null })
          .mockResolvedValueOnce({ error: { message: 'Database error' } })
      };

      supabaseService.getClient.mockReturnValue(mockQuery as any);

      await expect(
        repository.updateDisplayOrder(mockLayoutId, regionIds, mockTenantId)
      ).rejects.toThrow('Failed to update display order: Database error');
    });
  });

  describe('countByLayoutId', () => {
    it('should return count of regions for a layout', async () => {
      const mockQuery = {
        from: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        is: jest.fn().mockResolvedValue({ count: 5, error: null })
      };

      supabaseService.getClient.mockReturnValue(mockQuery as any);

      const result = await repository.countByLayoutId(mockLayoutId, mockTenantId);

      expect(result).toBe(5);
      expect(mockQuery.select).toHaveBeenCalledWith('*', { count: 'exact', head: true });
    });

    it('should return 0 when no regions found', async () => {
      const mockQuery = {
        from: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        is: jest.fn().mockResolvedValue({ count: null, error: null })
      };

      supabaseService.getClient.mockReturnValue(mockQuery as any);

      const result = await repository.countByLayoutId(mockLayoutId, mockTenantId);

      expect(result).toBe(0);
    });
  });

  describe('exists', () => {
    it('should return true when region exists', async () => {
      const mockQuery = {
        from: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        is: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: mockRegion, error: null })
      };

      supabaseService.getClient.mockReturnValue(mockQuery as any);

      const result = await repository.exists(mockRegionId, mockTenantId);

      expect(result).toBe(true);
    });

    it('should return false when region does not exist', async () => {
      const mockQuery = {
        from: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        is: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: null,
          error: { code: 'PGRST116' }
        })
      };

      supabaseService.getClient.mockReturnValue(mockQuery as any);

      const result = await repository.exists(mockRegionId, mockTenantId);

      expect(result).toBe(false);
    });
  });
});

