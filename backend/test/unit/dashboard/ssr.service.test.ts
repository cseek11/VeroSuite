/**
 * SSR Service Unit Tests
 * Tests for server-side rendering and caching logic
 */

import { Test, TestingModule } from '@nestjs/testing';
import { SSRService } from '../../../src/dashboard/ssr.service';
import { SupabaseService } from '../../../src/common/services/supabase.service';

describe('SSRService', () => {
  let service: SSRService;
  let supabaseService: SupabaseService;

  const mockTenantId = 'tenant-123';
  const mockLayoutId = 'layout-123';

  const mockRegions = [
    {
      id: 'region-1',
      region_type: 'widget',
      grid_row: 0,
      grid_col: 0,
      row_span: 2,
      col_span: 2,
      is_collapsed: false,
    },
    {
      id: 'region-2',
      region_type: 'chart',
      grid_row: 0,
      grid_col: 2,
      row_span: 1,
      col_span: 2,
      is_collapsed: false,
    },
  ];

  // Create query builders per table - reuse same builder for same table
  const queryBuilders = new Map<string, any>();
  
  const createMockQueryBuilder = (table: string) => {
    if (!queryBuilders.has(table)) {
      const builder: any = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        is: jest.fn().mockReturnThis(),
        order: jest.fn(),
      };
      queryBuilders.set(table, builder);
    }
    return queryBuilders.get(table);
  };

  const mockSupabaseClient = {
    from: jest.fn((table: string) => {
      return getBuilder(table);
    }),
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
    
    // Ensure from() always returns a builder
    mockSupabaseClient.from.mockImplementation((table: string) => getBuilder(table));
    
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SSRService,
        {
          provide: SupabaseService,
          useValue: {
            getClient: jest.fn().mockReturnValue(mockSupabaseClient),
          },
        },
      ],
    }).compile();

    service = module.get<SSRService>(SSRService);
    supabaseService = module.get<SupabaseService>(SupabaseService);

    // Reset mocks but keep query builders (they'll be populated as from() is called)
    // Only clear call history, not implementations
    mockSupabaseClient.from.mockClear();
    // Re-setup the implementation after clearing
    mockSupabaseClient.from.mockImplementation((table: string) => getBuilder(table));
  });

  describe('generateRegionSkeleton', () => {
    it('should generate skeleton HTML for regions', async () => {
      const tempClient = supabaseService.getClient();
      tempClient.from('dashboard_regions');
      const builder = getBuilder('dashboard_regions');
      
      // generateRegionSkeleton chain: .select().eq().eq().is().order() - order() returns promise
      builder.order.mockImplementationOnce(() => Promise.resolve({ data: mockRegions, error: null }));

      const result = await service.generateRegionSkeleton(mockLayoutId, mockTenantId);

      expect(result).toContain('region-grid');
      expect(result).toContain('region-skeleton');
      expect(result).toContain('skeleton-header');
      expect(result).toContain('skeleton-content');
      expect(builder.eq).toHaveBeenCalledWith('layout_id', mockLayoutId);
      expect(builder.eq).toHaveBeenCalledWith('tenant_id', mockTenantId);
    });

    it('should calculate correct grid dimensions', async () => {
      const tempClient = supabaseService.getClient();
      tempClient.from('dashboard_regions');
      const builder = getBuilder('dashboard_regions');
      
      builder.order.mockImplementationOnce(() => Promise.resolve({ data: mockRegions, error: null }));

      const result = await service.generateRegionSkeleton(mockLayoutId, mockTenantId);

      // Max row should be 2 (region-1: 0 + 2 span), max col should be 4 (region-2: 2 + 2 span)
      expect(result).toContain('grid-template-rows: repeat(2');
      expect(result).toContain('grid-template-columns: repeat(4');
    });

    it('should generate empty skeleton when no regions', async () => {
      const tempClient = supabaseService.getClient();
      tempClient.from('dashboard_regions');
      const builder = getBuilder('dashboard_regions');
      
      builder.order.mockImplementationOnce(() => Promise.resolve({ data: [], error: null }));

      const result = await service.generateRegionSkeleton(mockLayoutId, mockTenantId);

      expect(result).toContain('region-grid-empty');
      expect(result).toContain('No regions configured');
    });

    it('should handle errors gracefully', async () => {
      const tempClient = supabaseService.getClient();
      tempClient.from('dashboard_regions');
      const builder = getBuilder('dashboard_regions');
      
      builder.order.mockRejectedValueOnce(new Error('Database error'));

      const result = await service.generateRegionSkeleton(mockLayoutId, mockTenantId);

      expect(result).toContain('region-grid-empty');
    });

    it('should handle null regions', async () => {
      const tempClient = supabaseService.getClient();
      tempClient.from('dashboard_regions');
      const builder = getBuilder('dashboard_regions');
      
      builder.order.mockImplementationOnce(() => Promise.resolve({ data: null, error: null }));

      const result = await service.generateRegionSkeleton(mockLayoutId, mockTenantId);

      expect(result).toContain('region-grid-empty');
    });

    it('should include correct grid positioning for each region', async () => {
      const tempClient = supabaseService.getClient();
      tempClient.from('dashboard_regions');
      const builder = getBuilder('dashboard_regions');
      
      builder.order.mockImplementationOnce(() => Promise.resolve({ data: mockRegions, error: null }));

      const result = await service.generateRegionSkeleton(mockLayoutId, mockTenantId);

      // Check region-1 positioning (row 0, col 0, span 2x2)
      expect(result).toContain('grid-row: 1 / 3'); // grid_row + 1 to grid_row + 1 + row_span
      expect(result).toContain('grid-column: 1 / 3'); // grid_col + 1 to grid_col + 1 + col_span

      // Check region-2 positioning (row 0, col 2, span 1x2)
      expect(result).toContain('grid-row: 1 / 2');
      expect(result).toContain('grid-column: 3 / 5');
    });
  });

  describe('getCachedRegionMetadata', () => {
    it('should return cached metadata for regions', async () => {
      const regionsWithWidget = mockRegions.map((r) => ({
        ...r,
        widget_type: 'test-widget',
      }));

      const tempClient = supabaseService.getClient();
      tempClient.from('dashboard_regions');
      const builder = getBuilder('dashboard_regions');
      
      // getCachedRegionMetadata chain: .select().eq().eq().is().order() - order() returns promise
      builder.order.mockImplementationOnce(() => Promise.resolve({ data: regionsWithWidget, error: null }));

      const result = await service.getCachedRegionMetadata(mockLayoutId, mockTenantId);

      expect(result).toBeDefined();
      expect(result.layoutId).toBe(mockLayoutId);
      expect(result.regionCount).toBe(2);
      expect(result.regions).toHaveLength(2);
      expect(result.regions[0]).toHaveProperty('id');
      expect(result.regions[0]).toHaveProperty('type');
      expect(result.regions[0]).toHaveProperty('widget');
      expect(result.regions[0]).toHaveProperty('position');
      expect(result.regions[0]).toHaveProperty('size');
    });

    it('should return correct position and size data', async () => {
      const tempClient = supabaseService.getClient();
      tempClient.from('dashboard_regions');
      const builder = getBuilder('dashboard_regions');
      
      builder.order.mockImplementationOnce(() => Promise.resolve({ data: mockRegions, error: null }));

      const result = await service.getCachedRegionMetadata(mockLayoutId, mockTenantId);

      expect(result.regions[0].position).toEqual({ row: 0, col: 0 });
      expect(result.regions[0].size).toEqual({ rows: 2, cols: 2 });
      expect(result.regions[1].position).toEqual({ row: 0, col: 2 });
      expect(result.regions[1].size).toEqual({ rows: 1, cols: 2 });
    });

    it('should return null on error', async () => {
      const tempClient = supabaseService.getClient();
      tempClient.from('dashboard_regions');
      const builder = getBuilder('dashboard_regions');
      
      builder.order.mockRejectedValueOnce(new Error('Database error'));

      const result = await service.getCachedRegionMetadata(mockLayoutId, mockTenantId);

      expect(result).toBeNull();
    });

    it('should handle empty regions', async () => {
      const tempClient = supabaseService.getClient();
      tempClient.from('dashboard_regions');
      const builder = getBuilder('dashboard_regions');
      
      builder.order.mockImplementationOnce(() => Promise.resolve({ data: [], error: null }));

      const result = await service.getCachedRegionMetadata(mockLayoutId, mockTenantId);

      expect(result.regionCount).toBe(0);
      expect(result.regions).toEqual([]);
    });

    it('should handle null regions', async () => {
      const tempClient = supabaseService.getClient();
      tempClient.from('dashboard_regions');
      const builder = getBuilder('dashboard_regions');
      
      builder.order.mockImplementationOnce(() => Promise.resolve({ data: null, error: null }));

      const result = await service.getCachedRegionMetadata(mockLayoutId, mockTenantId);

      expect(result.regionCount).toBe(0);
      expect(result.regions).toEqual([]);
    });
  });
});

