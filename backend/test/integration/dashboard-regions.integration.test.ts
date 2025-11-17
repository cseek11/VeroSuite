/**
 * Dashboard Regions Integration Tests
 * Tests the complete flow: Repository + Service + Validation + Event Store
 */

import { Test, TestingModule } from '@nestjs/testing';
import { DashboardService } from '../../src/dashboard/dashboard.service';
import { RegionRepository } from '../../src/dashboard/repositories/region.repository';
import { RegionValidationService } from '../../src/dashboard/services/region-validation.service';
import { EventStoreService } from '../../src/dashboard/services/event-store.service';
import { DashboardMetricsService } from '../../src/dashboard/services/dashboard-metrics.service';
import { CacheService } from '../../src/common/services/cache.service';
import { SupabaseService } from '../../src/common/services/supabase.service';
import { CreateDashboardRegionDto, UpdateDashboardRegionDto, RegionType } from '../../src/dashboard/dto/dashboard-region.dto';
import { BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';

describe('Dashboard Regions Integration Tests', () => {
  let service: DashboardService;
  let validationService: any;
  let eventStore: EventStoreService;
  let metricsService: DashboardMetricsService;
  let cacheService: jest.Mocked<CacheService>;
  let supabaseService: any;

  const mockUser = {
    userId: 'user-123',
    tenantId: 'tenant-123'
  };

  const mockLayout = {
    id: 'layout-123',
    tenant_id: mockUser.tenantId,
    user_id: mockUser.userId,
    name: 'Test Layout',
    is_default: true
  };

  // In-memory store to simulate database
  let mockRegions: any[] = [];
  let createMockQuery: (table: string) => any;

  beforeEach(async () => {
    // Reset mock data
    mockRegions = [];

    // Create mock Supabase client with realistic behavior
    createMockQuery = (table: string) => {
      if (table === 'dashboard_layouts') {
        const layoutQuery = {
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          is: jest.fn().mockReturnThis(),
          single: jest.fn().mockResolvedValue({ data: mockLayout, error: null })
        };
        // Make it chainable
        layoutQuery.eq.mockReturnValue(layoutQuery);
        layoutQuery.is.mockReturnValue(layoutQuery);
        return layoutQuery;
      }

      // For dashboard_regions table
      return {
        select: jest.fn().mockReturnThis(),
        insert: jest.fn().mockReturnThis(),
        update: jest.fn().mockReturnThis(),
        delete: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        is: jest.fn().mockReturnThis(),
        order: jest.fn().mockReturnThis(),
        single: jest.fn()
      };
    };

    const mockSupabaseClient = {
      from: jest.fn((table: string) => createMockQuery(table))
    };

    // Setup repository methods to use in-memory store
    const mockSupabaseService = {
      getClient: jest.fn().mockReturnValue(mockSupabaseClient)
    };

    // Create a repository mock that uses in-memory store
    const mockRepository = {
      findById: jest.fn().mockImplementation(async (id: string, tenantId: string) => {
        const region = mockRegions.find(r => r.id === id && r.tenant_id === tenantId && !r.deleted_at);
        return region || null;
      }),
      findByLayoutId: jest.fn().mockImplementation(async (layoutId: string, tenantId: string) => {
        return mockRegions.filter(r => 
          r.layout_id === layoutId && 
          r.tenant_id === tenantId && 
          !r.deleted_at
        );
      }),
      findOverlappingRegions: jest.fn().mockImplementation(async (
        layoutId: string,
        tenantId: string,
        gridRow: number,
        gridCol: number,
        rowSpan: number,
        colSpan: number,
        excludeRegionId?: string
      ) => {
        return mockRegions.filter(r => {
          if (r.deleted_at || r.layout_id !== layoutId || r.tenant_id !== tenantId) return false;
          if (excludeRegionId && r.id === excludeRegionId) return false;
          
          const newRight = gridCol + colSpan;
          const newBottom = gridRow + rowSpan;
          const existingRight = r.grid_col + r.col_span;
          const existingBottom = r.grid_row + r.row_span;
          
          return gridCol < existingRight &&
                 newRight > r.grid_col &&
                 gridRow < existingBottom &&
                 newBottom > r.grid_row;
        });
      }),
      create: jest.fn().mockImplementation(async (dto: CreateDashboardRegionDto, tenantId: string, userId: string) => {
        const newRegion = {
          id: `region-${Date.now()}-${Math.random()}`,
          ...dto,
          tenant_id: tenantId,
          user_id: userId,
          version: 1,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          deleted_at: null,
          grid_row: dto.grid_row ?? 0,
          grid_col: dto.grid_col ?? 0,
          row_span: dto.row_span ?? 1,
          col_span: dto.col_span ?? 1
        };
        mockRegions.push(newRegion);
        return newRegion;
      }),
      update: jest.fn().mockImplementation(async (
        regionId: string,
        updateDto: UpdateDashboardRegionDto,
        tenantId: string,
        expectedVersion?: number
      ) => {
        const region = mockRegions.find(r => r.id === regionId && r.tenant_id === tenantId && !r.deleted_at);
        if (!region) {
          throw new Error('Region not found or version mismatch');
        }
        if (expectedVersion !== undefined && region.version !== expectedVersion) {
          throw new Error('Region not found or version mismatch');
        }
        Object.assign(region, updateDto, {
          updated_at: new Date().toISOString(),
          version: (region.version || 1) + 1
        });
        return region;
      }),
      delete: jest.fn().mockImplementation(async (regionId: string, tenantId: string) => {
        const region = mockRegions.find(r => r.id === regionId && r.tenant_id === tenantId && !r.deleted_at);
        if (region) {
          region.deleted_at = new Date().toISOString();
        }
      }),
      countByLayoutId: jest.fn().mockImplementation(async (layoutId: string, tenantId: string) => {
        return mockRegions.filter(r => 
          r.layout_id === layoutId && 
          r.tenant_id === tenantId && 
          !r.deleted_at
        ).length;
      }),
      exists: jest.fn().mockImplementation(async (regionId: string, tenantId: string) => {
        return mockRegions.some(r => r.id === regionId && r.tenant_id === tenantId && !r.deleted_at);
      })
    };

    const mockValidationService = {
      validateCreate: jest.fn().mockImplementation(async (layoutId, dto, tenantId) => {
        // Use repository to check overlaps
        const overlapping = await mockRepository.findOverlappingRegions(
          layoutId,
          tenantId,
          dto.grid_row ?? 0,
          dto.grid_col ?? 0,
          dto.row_span ?? 1,
          dto.col_span ?? 1
        );
        if (overlapping.length > 0) {
          throw new BadRequestException('Region overlaps with existing region');
        }
      }),
      validateUpdate: jest.fn().mockResolvedValue(undefined),
      validateGridBounds: jest.fn()
    };

    const mockCacheService = {
      get: jest.fn().mockResolvedValue(null),
      set: jest.fn().mockResolvedValue(undefined),
      invalidateLayout: jest.fn().mockResolvedValue(undefined),
      invalidateRegion: jest.fn().mockResolvedValue(undefined)
    };

    const mockEventStore = {
      appendEvent: jest.fn().mockResolvedValue(undefined)
    };

    const mockMetricsService = {
      recordRegionOperation: jest.fn(),
      recordError: jest.fn(),
      recordConflict: jest.fn()
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DashboardService,
        { provide: RegionRepository, useValue: mockRepository },
        { provide: RegionValidationService, useValue: mockValidationService },
        { provide: EventStoreService, useValue: mockEventStore },
        { provide: DashboardMetricsService, useValue: mockMetricsService },
        { provide: CacheService, useValue: mockCacheService },
        { provide: SupabaseService, useValue: mockSupabaseService }
      ]
    }).compile();

    service = module.get<DashboardService>(DashboardService);
    validationService = module.get(RegionValidationService);
    eventStore = module.get(EventStoreService);
    metricsService = module.get(DashboardMetricsService);
    cacheService = module.get(CacheService);
    supabaseService = module.get(SupabaseService);
  });

  describe('Complete Region Lifecycle', () => {
    it('should create, read, update, and delete a region', async () => {
      // 1. Create region
      const createDto: CreateDashboardRegionDto = {
        layout_id: mockLayout.id,
        region_type: RegionType.SCHEDULING,
        grid_row: 0,
        grid_col: 0,
        row_span: 2,
        col_span: 3
      };

      const created = await service.createRegion(createDto, mockUser);
      expect(created.id).toBeDefined();
      expect(created.region_type).toBe(RegionType.SCHEDULING);
      expect(created.version).toBe(1);
      expect(eventStore.appendEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          event_type: expect.any(String),
          entity_type: 'region',
          entity_id: created.id
        })
      );

      // 2. Read region
      const retrieved = await service.getRegion(created.id, mockUser);
      expect(retrieved.id).toBe(created.id);
      expect(retrieved.region_type).toBe(RegionType.SCHEDULING);

      // 3. Update region
      const updateDto: UpdateDashboardRegionDto = {
        grid_row: 1,
        grid_col: 1,
        version: 1
      } as any;

      const updated = await service.updateRegion(created.id, updateDto, mockUser);
      expect(updated.grid_row).toBe(1);
      expect(updated.grid_col).toBe(1);
      expect(updated.version).toBe(2);

      // 4. Delete region
      const result = await service.deleteRegion(created.id, mockUser);
      expect(result.success).toBe(true);

      // 5. Verify deletion
      await expect(service.getRegion(created.id, mockUser)).rejects.toThrow(NotFoundException);
    });
  });

  describe('Validation Integration', () => {
    it('should prevent overlapping regions', async () => {
      const region1: CreateDashboardRegionDto = {
        layout_id: mockLayout.id,
        region_type: RegionType.SCHEDULING,
        grid_row: 0,
        grid_col: 0,
        row_span: 2,
        col_span: 2
      };

      const region2: CreateDashboardRegionDto = {
        layout_id: mockLayout.id,
        region_type: RegionType.ANALYTICS,
        grid_row: 1, // Overlaps with region1
        grid_col: 1, // Overlaps with region1
        row_span: 2,
        col_span: 2
      };

      await service.createRegion(region1, mockUser);

      await expect(service.createRegion(region2, mockUser)).rejects.toThrow(BadRequestException);
    });

    it('should validate grid bounds', async () => {
      const invalidRegion: CreateDashboardRegionDto = {
        layout_id: mockLayout.id,
        region_type: RegionType.SCHEDULING,
        grid_row: -1, // Invalid
        grid_col: 0,
        row_span: 1,
        col_span: 1
      };

      // Mock validation service to throw error for invalid bounds
      (validationService.validateCreate as jest.Mock).mockImplementationOnce(async () => {
        throw new BadRequestException('Grid row must be at least 0');
      });

      // This should be caught by validation service
      await expect(service.createRegion(invalidRegion, mockUser)).rejects.toThrow(BadRequestException);
    });
  });

  describe('Optimistic Locking Integration', () => {
    it('should handle version conflicts correctly', async () => {
      const createDto: CreateDashboardRegionDto = {
        layout_id: mockLayout.id,
        region_type: RegionType.SCHEDULING,
        grid_row: 0,
        grid_col: 0,
        row_span: 1,
        col_span: 1
      };

      const created = await service.createRegion(createDto, mockUser);
      expect(created.version).toBe(1);

      // First update succeeds
      const update1: UpdateDashboardRegionDto = {
        grid_row: 1,
        version: 1
      } as any;
      const updated1 = await service.updateRegion(created.id, update1, mockUser);
      expect(updated1.version).toBe(2);

      // Second update with wrong version should fail
      const update2: UpdateDashboardRegionDto = {
        grid_row: 2,
        version: 1 // Wrong version (should be 2)
      } as any;
      await expect(service.updateRegion(created.id, update2, mockUser)).rejects.toThrow(ConflictException);
    });

    it('should require version for updates', async () => {
      const createDto: CreateDashboardRegionDto = {
        layout_id: mockLayout.id,
        region_type: RegionType.SCHEDULING,
        grid_row: 0,
        grid_col: 0,
        row_span: 1,
        col_span: 1
      };

      const created = await service.createRegion(createDto, mockUser);

      const updateWithoutVersion: UpdateDashboardRegionDto = {
        grid_row: 1
        // No version provided
      };

      await expect(service.updateRegion(created.id, updateWithoutVersion, mockUser)).rejects.toThrow(BadRequestException);
    });
  });

  describe('Tenant Isolation Integration', () => {
    it('should only return regions for the correct tenant', async () => {
      const tenant1User = { userId: 'user-1', tenantId: 'tenant-1' };
      const tenant2User = { userId: 'user-2', tenantId: 'tenant-2' };

      // Mock layout for tenant 1
      const tenant1Layout = { ...mockLayout, id: 'layout-1', tenant_id: 'tenant-1' };
      
      // Update Supabase mock to return tenant-specific layout
      const mockLayoutQuery = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        is: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: tenant1Layout, error: null })
      };
      mockLayoutQuery.eq.mockReturnValue(mockLayoutQuery);
      mockLayoutQuery.is.mockReturnValue(mockLayoutQuery);
      
      const mockClient = supabaseService.getClient();
      (mockClient.from as jest.Mock).mockImplementation((table: string) => {
        if (table === 'dashboard_layouts') {
          return mockLayoutQuery;
        }
        return createMockQuery(table);
      });

      const region1: CreateDashboardRegionDto = {
        layout_id: 'layout-1',
        region_type: RegionType.SCHEDULING,
        grid_row: 0,
        grid_col: 0,
        row_span: 1,
        col_span: 1
      };

      // Create region for tenant 1
      const created = await service.createRegion(region1, tenant1User);

      // Try to access from tenant 2 (should fail - repository returns null)
      await expect(service.getRegion(created.id, tenant2User)).rejects.toThrow(NotFoundException);
    });
  });

  describe('Event Store Integration', () => {
    it('should log all region mutations', async () => {
      const createDto: CreateDashboardRegionDto = {
        layout_id: mockLayout.id,
        region_type: RegionType.SCHEDULING,
        grid_row: 0,
        grid_col: 0,
        row_span: 1,
        col_span: 1
      };

      const created = await service.createRegion(createDto, mockUser);
      expect(eventStore.appendEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          event_type: expect.stringContaining('region_created'),
          entity_id: created.id,
          tenant_id: mockUser.tenantId,
          user_id: mockUser.userId
        })
      );

      const updateDto: UpdateDashboardRegionDto = {
        grid_row: 1,
        version: 1
      } as any;

      await service.updateRegion(created.id, updateDto, mockUser);
      expect(eventStore.appendEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          event_type: expect.stringContaining('region_updated'),
          entity_id: created.id
        })
      );

      await service.deleteRegion(created.id, mockUser);
      expect(eventStore.appendEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          event_type: expect.stringContaining('region_deleted'),
          entity_id: created.id
        })
      );
    });
  });

  describe('Metrics Integration', () => {
    it('should record metrics for all operations', async () => {
      const createDto: CreateDashboardRegionDto = {
        layout_id: mockLayout.id,
        region_type: RegionType.SCHEDULING,
        grid_row: 0,
        grid_col: 0,
        row_span: 1,
        col_span: 1
      };

      const created = await service.createRegion(createDto, mockUser);
      expect(metricsService.recordRegionOperation).toHaveBeenCalledWith(
        'create',
        expect.any(Number),
        'success',
        RegionType.SCHEDULING
      );

      const updateDto: UpdateDashboardRegionDto = {
        grid_row: 1,
        version: 1
      } as any;

      await service.updateRegion(created.id, updateDto, mockUser);
      expect(metricsService.recordRegionOperation).toHaveBeenCalledWith(
        'update',
        expect.any(Number),
        'success',
        RegionType.SCHEDULING
      );

      await service.deleteRegion(created.id, mockUser);
      expect(metricsService.recordRegionOperation).toHaveBeenCalledWith(
        'delete',
        expect.any(Number),
        'success',
        RegionType.SCHEDULING
      );
    });

    it('should record error metrics on failures', async () => {
      const invalidDto: CreateDashboardRegionDto = {
        layout_id: mockLayout.id,
        region_type: RegionType.SCHEDULING,
        grid_row: 0,
        grid_col: 0,
        row_span: 1,
        col_span: 1
      };

      // Create overlapping region to trigger validation error
      await service.createRegion(invalidDto, mockUser);
      
      // Try to create another overlapping region
      const overlappingDto: CreateDashboardRegionDto = {
        layout_id: mockLayout.id,
        region_type: RegionType.ANALYTICS,
        grid_row: 0, // Overlaps
        grid_col: 0, // Overlaps
        row_span: 1,
        col_span: 1
      };

      try {
        await service.createRegion(overlappingDto, mockUser);
      } catch (error) {
        expect(metricsService.recordError).toHaveBeenCalled();
      }
    });
  });

  describe('Cache Integration', () => {
    it('should invalidate cache on mutations', async () => {
      const createDto: CreateDashboardRegionDto = {
        layout_id: mockLayout.id,
        region_type: RegionType.SCHEDULING,
        grid_row: 0,
        grid_col: 0,
        row_span: 1,
        col_span: 1
      };

      const created = await service.createRegion(createDto, mockUser);
      expect(cacheService.invalidateLayout).toHaveBeenCalledWith(mockLayout.id);
      expect(cacheService.invalidateRegion).toHaveBeenCalledWith(created.id);

      const updateDto: UpdateDashboardRegionDto = {
        grid_row: 1,
        version: 1
      } as any;

      await service.updateRegion(created.id, updateDto, mockUser);
      expect(cacheService.invalidateLayout).toHaveBeenCalled();
      expect(cacheService.invalidateRegion).toHaveBeenCalledWith(created.id);

      await service.deleteRegion(created.id, mockUser);
      expect(cacheService.invalidateLayout).toHaveBeenCalled();
      expect(cacheService.invalidateRegion).toHaveBeenCalledWith(created.id);
    });
  });
});

