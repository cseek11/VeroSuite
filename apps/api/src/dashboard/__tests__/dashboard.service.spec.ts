import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException, ConflictException } from '@nestjs/common';
import { DashboardService } from '../dashboard.service';
import { SupabaseService } from '../../common/services/supabase.service';
import { RegionValidationService } from '../services/region-validation.service';
import { CacheService } from '../../common/services/cache.service';
import { RegionRepository } from '../repositories/region.repository';
import { EventStoreService } from '../services/event-store.service';
import { DashboardMetricsService } from '../services/dashboard-metrics.service';
import { CreateDashboardRegionDto, UpdateDashboardRegionDto, RegionType } from '../dto/dashboard-region.dto';

describe('DashboardService', () => {
  let service: DashboardService;
  let supabaseService: jest.Mocked<SupabaseService>;
  let validationService: jest.Mocked<RegionValidationService>;
  let cacheService: jest.Mocked<CacheService>;
  let regionRepository: jest.Mocked<RegionRepository>;
  let eventStore: jest.Mocked<EventStoreService>;
  let metricsService: jest.Mocked<DashboardMetricsService>;

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

  beforeEach(async () => {
    const mockSupabaseService = {
      getClient: jest.fn().mockReturnValue({
        from: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnThis(),
          insert: jest.fn().mockReturnThis(),
          update: jest.fn().mockReturnThis(),
          delete: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          single: jest.fn().mockResolvedValue({ data: mockLayout, error: null }),
          order: jest.fn().mockReturnThis(),
          is: jest.fn().mockReturnThis()
        })
      })
    };

    const mockValidationService = {
      validateCreate: jest.fn().mockResolvedValue(undefined),
      validateUpdate: jest.fn().mockResolvedValue(undefined),
      validateVersion: jest.fn().mockResolvedValue(1)
    };

    const mockCacheService = {
      get: jest.fn().mockResolvedValue(null),
      set: jest.fn().mockResolvedValue(undefined),
      invalidateLayout: jest.fn().mockResolvedValue(undefined),
      invalidateRegion: jest.fn().mockResolvedValue(undefined)
    };

    const mockRegionRepository = {
      findById: jest.fn(),
      findByLayoutId: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findOverlappingRegions: jest.fn(),
      countByLayoutId: jest.fn(),
      exists: jest.fn(),
      updateDisplayOrder: jest.fn()
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
        { provide: SupabaseService, useValue: mockSupabaseService },
        { provide: RegionValidationService, useValue: mockValidationService },
        { provide: CacheService, useValue: mockCacheService },
        { provide: RegionRepository, useValue: mockRegionRepository },
        { provide: EventStoreService, useValue: mockEventStore },
        { provide: DashboardMetricsService, useValue: mockMetricsService }
      ]
    }).compile();

    service = module.get<DashboardService>(DashboardService);
    supabaseService = module.get(SupabaseService);
    validationService = module.get(RegionValidationService);
    cacheService = module.get(CacheService);
    regionRepository = module.get(RegionRepository);
    eventStore = module.get(EventStoreService);
    metricsService = module.get(DashboardMetricsService);
  });

  describe('createRegion', () => {
    it('should create a region successfully', async () => {
      const createDto: CreateDashboardRegionDto = {
        layout_id: 'layout-123',
        region_type: RegionType.SCHEDULING,
        grid_row: 0,
        grid_col: 0,
        row_span: 1,
        col_span: 1
      };

      const mockRegion = {
        id: 'region-123',
        ...createDto,
        tenant_id: mockUser.tenantId,
        user_id: mockUser.userId,
        version: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        deleted_at: null
      };

      // Mock getLayout
      supabaseService.getClient.mockReturnValue({
        from: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          is: jest.fn().mockReturnThis(),
          single: jest.fn().mockResolvedValue({ data: mockLayout, error: null })
        })
      } as any);

      // Mock repository create
      regionRepository.create.mockResolvedValue(mockRegion as any);

      const result = await service.createRegion(createDto, mockUser);

      expect(validationService.validateCreate).toHaveBeenCalledWith(
        'layout-123',
        createDto,
        mockUser.tenantId
      );
      expect(regionRepository.create).toHaveBeenCalledWith(
        createDto,
        mockUser.tenantId,
        mockUser.userId
      );
      expect(result.id).toBe('region-123');
      expect(cacheService.invalidateLayout).toHaveBeenCalledWith('layout-123');
      expect(cacheService.invalidateRegion).toHaveBeenCalledWith('region-123');
      expect(eventStore.appendEvent).toHaveBeenCalled();
      expect(metricsService.recordRegionOperation).toHaveBeenCalledWith(
        'create',
        expect.any(Number),
        'success',
        RegionType.SCHEDULING
      );
    });

    it('should throw error if layout_id is missing', async () => {
      const createDto: CreateDashboardRegionDto = {
        region_type: RegionType.SCHEDULING,
        grid_row: 0,
        grid_col: 0,
        row_span: 1,
        col_span: 1
      } as any;

      await expect(service.createRegion(createDto, mockUser)).rejects.toThrow(BadRequestException);
    });

    it('should throw error if validation fails', async () => {
      const createDto: CreateDashboardRegionDto = {
        layout_id: 'layout-123',
        region_type: RegionType.SCHEDULING,
        grid_row: 0,
        grid_col: 0,
        row_span: 1,
        col_span: 1
      };

      validationService.validateCreate.mockRejectedValue(
        new BadRequestException('Region overlaps with existing region')
      );

      await expect(service.createRegion(createDto, mockUser)).rejects.toThrow(BadRequestException);
    });
  });

  describe('updateRegion', () => {
    it('should update a region successfully', async () => {
      const updateDto: UpdateDashboardRegionDto = {
        grid_row: 1,
        grid_col: 1,
        version: 1
      } as any;

      const existingRegion = {
        id: 'region-123',
        layout_id: 'layout-123',
        grid_row: 0,
        grid_col: 0,
        version: 1,
        region_type: RegionType.SCHEDULING,
        tenant_id: mockUser.tenantId,
        user_id: mockUser.userId
      };

      const updatedRegion = {
        ...existingRegion,
        ...updateDto,
        version: 2
      };

      // Mock getRegion (uses repository)
      regionRepository.findById.mockResolvedValue(existingRegion as any);
      regionRepository.update.mockResolvedValue(updatedRegion as any);

      const result = await service.updateRegion('region-123', updateDto, mockUser);

      expect(regionRepository.findById).toHaveBeenCalledWith('region-123', mockUser.tenantId);
      expect(validationService.validateUpdate).toHaveBeenCalled();
      expect(regionRepository.update).toHaveBeenCalledWith(
        'region-123',
        { grid_row: 1, grid_col: 1 },
        mockUser.tenantId,
        1
      );
      expect(result.grid_row).toBe(1);
      expect((result as any).version).toBe(2);
      expect(cacheService.invalidateLayout).toHaveBeenCalledWith('layout-123');
      expect(eventStore.appendEvent).toHaveBeenCalled();
      expect(metricsService.recordRegionOperation).toHaveBeenCalledWith(
        'update',
        expect.any(Number),
        'success',
        RegionType.SCHEDULING
      );
    });

    it('should throw BadRequestException when version is missing', async () => {
      const updateDto: UpdateDashboardRegionDto = {
        grid_row: 1,
        grid_col: 1
      };

      const existingRegion = {
        id: 'region-123',
        layout_id: 'layout-123',
        version: 1
      };

      regionRepository.findById.mockResolvedValue(existingRegion as any);

      await expect(service.updateRegion('region-123', updateDto, mockUser)).rejects.toThrow(
        BadRequestException
      );
      expect(regionRepository.update).not.toHaveBeenCalled();
    });

    it('should throw ConflictException on version mismatch', async () => {
      const updateDto: UpdateDashboardRegionDto = {
        grid_row: 1,
        grid_col: 1,
        version: 2 // Different from existing
      } as any;

      const existingRegion = {
        id: 'region-123',
        layout_id: 'layout-123',
        version: 1
      };

      regionRepository.findById.mockResolvedValue(existingRegion as any);

      await expect(service.updateRegion('region-123', updateDto, mockUser)).rejects.toThrow(
        ConflictException
      );
      expect(regionRepository.update).not.toHaveBeenCalled();
    });

    it('should throw ConflictException when repository reports version conflict', async () => {
      const updateDto: UpdateDashboardRegionDto = {
        grid_row: 1,
        grid_col: 1,
        version: 1
      } as any;

      const existingRegion = {
        id: 'region-123',
        layout_id: 'layout-123',
        version: 1,
        region_type: RegionType.SCHEDULING
      };

      regionRepository.findById.mockResolvedValue(existingRegion as any);
      regionRepository.update.mockRejectedValue(new Error('Region not found or version mismatch'));

      await expect(service.updateRegion('region-123', updateDto, mockUser)).rejects.toThrow(
        ConflictException
      );
      expect(metricsService.recordConflict).toHaveBeenCalled();
    });
  });

  describe('deleteRegion', () => {
    it('should delete a region successfully', async () => {
      const existingRegion = {
        id: 'region-123',
        layout_id: 'layout-123',
        region_type: RegionType.SCHEDULING,
        tenant_id: mockUser.tenantId,
        user_id: mockUser.userId
      };

      regionRepository.findById.mockResolvedValue(existingRegion as any);
      regionRepository.delete.mockResolvedValue(undefined);

      const result = await service.deleteRegion('region-123', mockUser);

      expect(regionRepository.findById).toHaveBeenCalledWith('region-123', mockUser.tenantId);
      expect(regionRepository.delete).toHaveBeenCalledWith('region-123', mockUser.tenantId);
      expect(result.success).toBe(true);
      expect(cacheService.invalidateLayout).toHaveBeenCalledWith('layout-123');
      expect(eventStore.appendEvent).toHaveBeenCalled();
      expect(metricsService.recordRegionOperation).toHaveBeenCalledWith(
        'delete',
        expect.any(Number),
        'success',
        RegionType.SCHEDULING
      );
    });

    it('should throw NotFoundException when region not found', async () => {
      regionRepository.findById.mockResolvedValue(null);

      await expect(service.deleteRegion('region-123', mockUser)).rejects.toThrow(NotFoundException);
      expect(regionRepository.delete).not.toHaveBeenCalled();
    });
  });

  describe('getRegion', () => {
    it('should get a region successfully', async () => {
      const mockRegion = {
        id: 'region-123',
        layout_id: 'layout-123',
        tenant_id: mockUser.tenantId,
        user_id: mockUser.userId
      };

      regionRepository.findById.mockResolvedValue(mockRegion as any);

      const result = await service.getRegion('region-123', mockUser);

      expect(regionRepository.findById).toHaveBeenCalledWith('region-123', mockUser.tenantId);
      expect(result).toEqual(mockRegion);
    });

    it('should throw NotFoundException when region not found', async () => {
      regionRepository.findById.mockResolvedValue(null);

      await expect(service.getRegion('region-123', mockUser)).rejects.toThrow(NotFoundException);
    });
  });

  describe('getOrCreateDefaultLayout', () => {
    it('should return existing default layout', async () => {
      supabaseService.getClient.mockReturnValue({
        from: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          is: jest.fn().mockReturnThis(),
          single: jest.fn().mockResolvedValue({ data: mockLayout, error: null })
        })
      } as any);

      const result = await service.getOrCreateDefaultLayout(mockUser);

      expect(result).toEqual(mockLayout);
    });

    it('should create default layout when none exists', async () => {
      const newLayout = { ...mockLayout, id: 'layout-new' };
      supabaseService.getClient.mockReturnValue({
        from: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          is: jest.fn().mockReturnThis(),
          single: jest.fn()
            .mockResolvedValueOnce({ data: null, error: { message: 'Not found' } })
            .mockReturnThis(),
          insert: jest.fn().mockReturnThis(),
          select: jest.fn().mockReturnThis(),
          single: jest.fn().mockResolvedValue({ data: newLayout, error: null })
        })
      } as any);

      const result = await service.getOrCreateDefaultLayout(mockUser);

      expect(result).toEqual(newLayout);
    });

    it('should handle errors when creating default layout', async () => {
      supabaseService.getClient.mockReturnValue({
        from: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          is: jest.fn().mockReturnThis(),
          single: jest.fn()
            .mockResolvedValueOnce({ data: null, error: { message: 'Not found' } })
            .mockReturnThis(),
          insert: jest.fn().mockReturnThis(),
          select: jest.fn().mockReturnThis(),
          single: jest.fn().mockResolvedValue({ data: null, error: { message: 'Create failed' } })
        })
      } as any);

      await expect(service.getOrCreateDefaultLayout(mockUser)).rejects.toThrow(BadRequestException);
    });
  });

  describe('createLayout', () => {
    it('should create layout successfully', async () => {
      const createDto: CreateDashboardLayoutDto = {
        name: 'New Layout',
        is_default: false
      };

      const newLayout = {
        id: 'layout-new',
        ...createDto,
        tenant_id: mockUser.tenantId,
        user_id: mockUser.userId
      };

      supabaseService.getClient.mockReturnValue({
        from: jest.fn().mockReturnValue({
          insert: jest.fn().mockReturnThis(),
          select: jest.fn().mockReturnThis(),
          single: jest.fn().mockResolvedValue({ data: newLayout, error: null })
        })
      } as any);

      const result = await service.createLayout(createDto, mockUser);

      expect(result).toEqual(newLayout);
    });

    it('should handle creation errors', async () => {
      const createDto: CreateDashboardLayoutDto = {
        name: 'New Layout',
        is_default: false
      };

      supabaseService.getClient.mockReturnValue({
        from: jest.fn().mockReturnValue({
          insert: jest.fn().mockReturnThis(),
          select: jest.fn().mockReturnThis(),
          single: jest.fn().mockResolvedValue({ data: null, error: { message: 'Creation failed' } })
        })
      } as any);

      await expect(service.createLayout(createDto, mockUser)).rejects.toThrow(BadRequestException);
    });
  });

  describe('getLayout', () => {
    it('should return layout by ID', async () => {
      supabaseService.getClient.mockReturnValue({
        from: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          is: jest.fn().mockReturnThis(),
          single: jest.fn().mockResolvedValue({ data: mockLayout, error: null })
        })
      } as any);

      const result = await service.getLayout('layout-123', mockUser);

      expect(result).toEqual(mockLayout);
    });

    it('should throw NotFoundException when layout not found', async () => {
      supabaseService.getClient.mockReturnValue({
        from: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          is: jest.fn().mockReturnThis(),
          single: jest.fn().mockResolvedValue({ data: null, error: { message: 'Not found' } })
        })
      } as any);

      await expect(service.getLayout('non-existent', mockUser)).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateLayout', () => {
    it('should update layout successfully', async () => {
      const updateDto: UpdateDashboardLayoutDto = {
        name: 'Updated Layout'
      };

      const updatedLayout = {
        ...mockLayout,
        ...updateDto
      };

      supabaseService.getClient.mockReturnValue({
        from: jest.fn().mockReturnValue({
          update: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          select: jest.fn().mockReturnThis(),
          single: jest.fn().mockResolvedValue({ data: updatedLayout, error: null })
        })
      } as any);

      const result = await service.updateLayout('layout-123', updateDto, mockUser);

      expect(result.name).toBe('Updated Layout');
    });

    it('should handle update errors', async () => {
      const updateDto: UpdateDashboardLayoutDto = {
        name: 'Updated Layout'
      };

      supabaseService.getClient.mockReturnValue({
        from: jest.fn().mockReturnValue({
          update: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          select: jest.fn().mockReturnThis(),
          single: jest.fn().mockResolvedValue({ data: null, error: { message: 'Update failed' } })
        })
      } as any);

      await expect(service.updateLayout('layout-123', updateDto, mockUser)).rejects.toThrow(BadRequestException);
    });
  });

  describe('deleteLayout', () => {
    it('should delete layout successfully', async () => {
      const mockQueryBuilder = {
        update: jest.fn().mockReturnThis(),
        eq: jest.fn()
      };
      
      // First two eq() calls return this for chaining, last one returns promise
      mockQueryBuilder.eq
        .mockReturnValueOnce(mockQueryBuilder) // .eq('id', id)
        .mockReturnValueOnce(mockQueryBuilder) // .eq('tenant_id', user.tenantId)
        .mockResolvedValueOnce({ data: null, error: null }); // .eq('user_id', user.userId)

      supabaseService.getClient.mockReturnValue({
        from: jest.fn().mockReturnValue(mockQueryBuilder)
      } as any);

      const result = await service.deleteLayout('layout-123', mockUser);

      expect(result.success).toBe(true);
    });

    it('should handle delete errors', async () => {
      const mockQueryBuilder = {
        update: jest.fn().mockReturnThis(),
        eq: jest.fn()
      };
      
      // First two eq() calls return this for chaining, last one returns promise with error
      mockQueryBuilder.eq
        .mockReturnValueOnce(mockQueryBuilder) // .eq('id', id)
        .mockReturnValueOnce(mockQueryBuilder) // .eq('tenant_id', user.tenantId)
        .mockResolvedValueOnce({ data: null, error: { message: 'Delete failed' } }); // .eq('user_id', user.userId)

      supabaseService.getClient.mockReturnValue({
        from: jest.fn().mockReturnValue(mockQueryBuilder)
      } as any);

      await expect(service.deleteLayout('layout-123', mockUser)).rejects.toThrow(BadRequestException);
    });
  });

  describe('getLayoutRegions', () => {
    it('should return regions for layout', async () => {
      const mockRegions = [
        {
          id: 'region-1',
          layout_id: 'layout-123',
          region_type: RegionType.SCHEDULING,
          grid_row: 0,
          grid_col: 0
        },
        {
          id: 'region-2',
          layout_id: 'layout-123',
          region_type: RegionType.ANALYTICS,
          grid_row: 1,
          grid_col: 0
        }
      ];

      // Mock getLayout first (called by getLayoutRegions)
      supabaseService.getClient.mockReturnValue({
        from: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          is: jest.fn().mockReturnThis(),
          single: jest.fn().mockResolvedValue({ data: mockLayout, error: null })
        })
      } as any);

      // Mock cache service getOrSetStaleWhileRevalidate
      cacheService.getOrSetStaleWhileRevalidate = jest.fn().mockResolvedValue(mockRegions);

      const result = await service.getLayoutRegions('layout-123', mockUser);

      expect(result).toEqual(mockRegions);
      expect(cacheService.getOrSetStaleWhileRevalidate).toHaveBeenCalled();
    });

    it('should return empty array when no regions found', async () => {
      supabaseService.getClient.mockReturnValue({
        from: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          is: jest.fn().mockReturnThis(),
          single: jest.fn().mockResolvedValue({ data: mockLayout, error: null })
        })
      } as any);

      cacheService.getOrSetStaleWhileRevalidate = jest.fn().mockResolvedValue([]);

      const result = await service.getLayoutRegions('layout-123', mockUser);

      expect(result).toEqual([]);
    });
  });

  describe('reorderRegions', () => {
    it('should reorder regions successfully', async () => {
      const reorderDto: ReorderRegionsDto = {
        region_ids: ['region-2', 'region-1', 'region-3']
      };

      // Mock getLayout first (called by reorderRegions)
      supabaseService.getClient.mockReturnValue({
        from: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          is: jest.fn().mockReturnThis(),
          single: jest.fn().mockResolvedValue({ data: mockLayout, error: null })
        })
      } as any);

      regionRepository.updateDisplayOrder.mockResolvedValue(undefined);

      const result = await service.reorderRegions('layout-123', reorderDto, mockUser);

      expect(result.success).toBe(true);
      expect(regionRepository.updateDisplayOrder).toHaveBeenCalledWith(
        'layout-123',
        reorderDto.region_ids,
        mockUser.tenantId
      );
      expect(cacheService.invalidateLayout).toHaveBeenCalledWith('layout-123');
      expect(eventStore.appendEvent).toHaveBeenCalled();
    });

    it('should handle errors during reorder', async () => {
      const reorderDto: ReorderRegionsDto = {
        region_ids: ['region-2', 'region-1']
      };

      supabaseService.getClient.mockReturnValue({
        from: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          is: jest.fn().mockReturnThis(),
          single: jest.fn().mockResolvedValue({ data: mockLayout, error: null })
        })
      } as any);

      regionRepository.updateDisplayOrder.mockRejectedValue(new Error('Reorder failed'));

      await expect(service.reorderRegions('layout-123', reorderDto, mockUser)).rejects.toThrow(BadRequestException);
    });
  });

  describe('getLayoutCards', () => {
    it('should return cards for layout', async () => {
      const mockCards = [
        { id: 'card-1', layout_id: 'layout-123', card_uid: 'card-uid-1' },
        { id: 'card-2', layout_id: 'layout-123', card_uid: 'card-uid-2' }
      ];

      // Mock getLayout first (called by getLayoutCards)
      supabaseService.getClient.mockReturnValue({
        from: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          is: jest.fn().mockReturnThis(),
          order: jest.fn().mockResolvedValue({ data: mockCards, error: null }),
          single: jest.fn().mockResolvedValue({ data: mockLayout, error: null })
        })
      } as any);

      const result = await service.getLayoutCards('layout-123', mockUser);

      expect(result).toEqual(mockCards);
    });

    it('should handle errors when getting cards', async () => {
      supabaseService.getClient.mockReturnValue({
        from: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          is: jest.fn().mockReturnThis(),
          order: jest.fn().mockResolvedValue({ data: null, error: { message: 'Query failed' } }),
          single: jest.fn().mockResolvedValue({ data: mockLayout, error: null })
        })
      } as any);

      await expect(service.getLayoutCards('layout-123', mockUser)).rejects.toThrow(BadRequestException);
    });
  });

  describe('upsertCard', () => {
    it('should create new card when not exists', async () => {
      const cardData: CreateDashboardCardDto = {
        layout_id: 'layout-123',
        card_uid: 'card-uid-1',
        title: 'Test Card',
        content: {}
      };

      const newCard = {
        id: 'card-1',
        ...cardData,
        tenant_id: mockUser.tenantId,
        user_id: mockUser.userId
      };

      const mockQueryBuilder = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        is: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: null, error: { code: 'PGRST116' } }),
        insert: jest.fn().mockReturnThis()
      };
      mockQueryBuilder.insert.mockReturnValue({
        select: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: newCard, error: null })
      });

      supabaseService.getClient.mockReturnValue({
        from: jest.fn().mockReturnValue(mockQueryBuilder)
      } as any);

      const result = await service.upsertCard(cardData, mockUser);

      expect(result).toEqual(newCard);
    });

    it('should update existing card', async () => {
      const cardData: CreateDashboardCardDto = {
        layout_id: 'layout-123',
        card_uid: 'card-uid-1',
        title: 'Updated Card',
        content: {}
      };

      const existingCard = {
        id: 'card-1',
        layout_id: 'layout-123',
        card_uid: 'card-uid-1',
        title: 'Old Card'
      };

      const updatedCard = {
        ...existingCard,
        ...cardData
      };

      const mockQueryBuilder = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        is: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: existingCard, error: null }),
        update: jest.fn().mockReturnThis()
      };
      mockQueryBuilder.update.mockReturnValue({
        eq: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: updatedCard, error: null })
      });

      supabaseService.getClient.mockReturnValue({
        from: jest.fn().mockReturnValue(mockQueryBuilder)
      } as any);

      const result = await service.upsertCard(cardData, mockUser);

      expect(result.title).toBe('Updated Card');
    });
  });

  describe('updateCard', () => {
    it('should update card successfully', async () => {
      const updateDto: UpdateDashboardCardDto = {
        title: 'Updated Title'
      };

      const updatedCard = {
        id: 'card-1',
        title: 'Updated Title',
        layout_id: 'layout-123'
      };

      const mockQueryBuilder = {
        update: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        single: jest.fn()
      };
      mockQueryBuilder.eq
        .mockReturnValueOnce(mockQueryBuilder)
        .mockReturnValueOnce(mockQueryBuilder)
        .mockReturnValueOnce({
          select: jest.fn().mockReturnThis(),
          single: jest.fn().mockResolvedValue({ data: updatedCard, error: null })
        });

      supabaseService.getClient.mockReturnValue({
        from: jest.fn().mockReturnValue(mockQueryBuilder)
      } as any);

      const result = await service.updateCard('card-1', updateDto, mockUser);

      expect(result.title).toBe('Updated Title');
    });
  });

  describe('deleteCard', () => {
    it('should delete card successfully', async () => {
      const mockQueryBuilder = {
        delete: jest.fn().mockReturnThis(),
        eq: jest.fn()
      };
      
      mockQueryBuilder.eq
        .mockReturnValueOnce(mockQueryBuilder)
        .mockReturnValueOnce(mockQueryBuilder)
        .mockResolvedValueOnce({ data: null, error: null });

      supabaseService.getClient.mockReturnValue({
        from: jest.fn().mockReturnValue(mockQueryBuilder)
      } as any);

      const result = await service.deleteCard('card-1', mockUser);

      expect(result.success).toBe(true);
    });
  });

  describe('getRoleBasedDefaults', () => {
    it('should return default regions for technician role', async () => {
      const result = await service.getRoleBasedDefaults('technician');

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
      expect(result[0].region_type).toBe(RegionType.SCHEDULING);
    });

    it('should return default regions for manager role', async () => {
      const result = await service.getRoleBasedDefaults('manager');

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
    });

    it('should return default regions for admin role', async () => {
      const result = await service.getRoleBasedDefaults('admin');

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
    });

    it('should return empty array for unknown role', async () => {
      const result = await service.getRoleBasedDefaults('unknown-role');

      expect(result).toEqual([]);
    });
  });

  describe('checkRegionPermissions', () => {
    it('should return true for region owner', async () => {
      const mockRegion = {
        id: 'region-123',
        user_id: mockUser.userId,
        tenant_id: mockUser.tenantId
      };

      regionRepository.findById.mockResolvedValue(mockRegion as any);

      const result = await service.checkRegionPermissions('region-123', mockUser, 'read');

      expect(result).toBe(true);
    });

    it('should check ACL permissions when user is not owner', async () => {
      const mockRegion = {
        id: 'region-123',
        user_id: 'other-user',
        tenant_id: mockUser.tenantId
      };

      regionRepository.findById.mockResolvedValue(mockRegion as any);

      const mockQueryBuilder = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        or: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ 
          data: { permission_set: { read: true, edit: false, share: false } }, 
          error: null 
        })
      };

      supabaseService.getClient.mockReturnValue({
        from: jest.fn().mockReturnValue(mockQueryBuilder)
      } as any);

      const result = await service.checkRegionPermissions('region-123', mockUser, 'read');

      expect(result).toBe(true);
    });

    it('should return false when no ACL found', async () => {
      const mockRegion = {
        id: 'region-123',
        user_id: 'other-user',
        tenant_id: mockUser.tenantId
      };

      regionRepository.findById.mockResolvedValue(mockRegion as any);

      const mockQueryBuilder = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        or: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: null, error: { code: 'PGRST116' } })
      };

      supabaseService.getClient.mockReturnValue({
        from: jest.fn().mockReturnValue(mockQueryBuilder)
      } as any);

      const result = await service.checkRegionPermissions('region-123', mockUser, 'read');

      expect(result).toBe(false);
    });
  });
});



