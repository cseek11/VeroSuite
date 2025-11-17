"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const dashboard_service_1 = require("../../src/dashboard/dashboard.service");
const region_repository_1 = require("../../src/dashboard/repositories/region.repository");
const region_validation_service_1 = require("../../src/dashboard/services/region-validation.service");
const event_store_service_1 = require("../../src/dashboard/services/event-store.service");
const dashboard_metrics_service_1 = require("../../src/dashboard/services/dashboard-metrics.service");
const cache_service_1 = require("../../src/common/services/cache.service");
const supabase_service_1 = require("../../src/common/services/supabase.service");
const dashboard_region_dto_1 = require("../../src/dashboard/dto/dashboard-region.dto");
const common_1 = require("@nestjs/common");
describe('Dashboard Regions Integration Tests', () => {
    let service;
    let validationService;
    let eventStore;
    let metricsService;
    let cacheService;
    let supabaseService;
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
    let mockRegions = [];
    let createMockQuery;
    beforeEach(async () => {
        mockRegions = [];
        createMockQuery = (table) => {
            if (table === 'dashboard_layouts') {
                const layoutQuery = {
                    select: jest.fn().mockReturnThis(),
                    eq: jest.fn().mockReturnThis(),
                    is: jest.fn().mockReturnThis(),
                    single: jest.fn().mockResolvedValue({ data: mockLayout, error: null })
                };
                layoutQuery.eq.mockReturnValue(layoutQuery);
                layoutQuery.is.mockReturnValue(layoutQuery);
                return layoutQuery;
            }
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
            from: jest.fn((table) => createMockQuery(table))
        };
        const mockSupabaseService = {
            getClient: jest.fn().mockReturnValue(mockSupabaseClient)
        };
        const mockRepository = {
            findById: jest.fn().mockImplementation(async (id, tenantId) => {
                const region = mockRegions.find(r => r.id === id && r.tenant_id === tenantId && !r.deleted_at);
                return region || null;
            }),
            findByLayoutId: jest.fn().mockImplementation(async (layoutId, tenantId) => {
                return mockRegions.filter(r => r.layout_id === layoutId &&
                    r.tenant_id === tenantId &&
                    !r.deleted_at);
            }),
            findOverlappingRegions: jest.fn().mockImplementation(async (layoutId, tenantId, gridRow, gridCol, rowSpan, colSpan, excludeRegionId) => {
                return mockRegions.filter(r => {
                    if (r.deleted_at || r.layout_id !== layoutId || r.tenant_id !== tenantId)
                        return false;
                    if (excludeRegionId && r.id === excludeRegionId)
                        return false;
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
            create: jest.fn().mockImplementation(async (dto, tenantId, userId) => {
                var _a, _b, _c, _d;
                const newRegion = Object.assign(Object.assign({ id: `region-${Date.now()}-${Math.random()}` }, dto), { tenant_id: tenantId, user_id: userId, version: 1, created_at: new Date().toISOString(), updated_at: new Date().toISOString(), deleted_at: null, grid_row: (_a = dto.grid_row) !== null && _a !== void 0 ? _a : 0, grid_col: (_b = dto.grid_col) !== null && _b !== void 0 ? _b : 0, row_span: (_c = dto.row_span) !== null && _c !== void 0 ? _c : 1, col_span: (_d = dto.col_span) !== null && _d !== void 0 ? _d : 1 });
                mockRegions.push(newRegion);
                return newRegion;
            }),
            update: jest.fn().mockImplementation(async (regionId, updateDto, tenantId, expectedVersion) => {
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
            delete: jest.fn().mockImplementation(async (regionId, tenantId) => {
                const region = mockRegions.find(r => r.id === regionId && r.tenant_id === tenantId && !r.deleted_at);
                if (region) {
                    region.deleted_at = new Date().toISOString();
                }
            }),
            countByLayoutId: jest.fn().mockImplementation(async (layoutId, tenantId) => {
                return mockRegions.filter(r => r.layout_id === layoutId &&
                    r.tenant_id === tenantId &&
                    !r.deleted_at).length;
            }),
            exists: jest.fn().mockImplementation(async (regionId, tenantId) => {
                return mockRegions.some(r => r.id === regionId && r.tenant_id === tenantId && !r.deleted_at);
            })
        };
        const mockValidationService = {
            validateCreate: jest.fn().mockImplementation(async (layoutId, dto, tenantId) => {
                var _a, _b, _c, _d;
                const overlapping = await mockRepository.findOverlappingRegions(layoutId, tenantId, (_a = dto.grid_row) !== null && _a !== void 0 ? _a : 0, (_b = dto.grid_col) !== null && _b !== void 0 ? _b : 0, (_c = dto.row_span) !== null && _c !== void 0 ? _c : 1, (_d = dto.col_span) !== null && _d !== void 0 ? _d : 1);
                if (overlapping.length > 0) {
                    throw new common_1.BadRequestException('Region overlaps with existing region');
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
        const module = await testing_1.Test.createTestingModule({
            providers: [
                dashboard_service_1.DashboardService,
                { provide: region_repository_1.RegionRepository, useValue: mockRepository },
                { provide: region_validation_service_1.RegionValidationService, useValue: mockValidationService },
                { provide: event_store_service_1.EventStoreService, useValue: mockEventStore },
                { provide: dashboard_metrics_service_1.DashboardMetricsService, useValue: mockMetricsService },
                { provide: cache_service_1.CacheService, useValue: mockCacheService },
                { provide: supabase_service_1.SupabaseService, useValue: mockSupabaseService }
            ]
        }).compile();
        service = module.get(dashboard_service_1.DashboardService);
        validationService = module.get(region_validation_service_1.RegionValidationService);
        eventStore = module.get(event_store_service_1.EventStoreService);
        metricsService = module.get(dashboard_metrics_service_1.DashboardMetricsService);
        cacheService = module.get(cache_service_1.CacheService);
        supabaseService = module.get(supabase_service_1.SupabaseService);
    });
    describe('Complete Region Lifecycle', () => {
        it('should create, read, update, and delete a region', async () => {
            const createDto = {
                layout_id: mockLayout.id,
                region_type: dashboard_region_dto_1.RegionType.SCHEDULING,
                grid_row: 0,
                grid_col: 0,
                row_span: 2,
                col_span: 3
            };
            const created = await service.createRegion(createDto, mockUser);
            expect(created.id).toBeDefined();
            expect(created.region_type).toBe(dashboard_region_dto_1.RegionType.SCHEDULING);
            expect(created.version).toBe(1);
            expect(eventStore.appendEvent).toHaveBeenCalledWith(expect.objectContaining({
                event_type: expect.any(String),
                entity_type: 'region',
                entity_id: created.id
            }));
            const retrieved = await service.getRegion(created.id, mockUser);
            expect(retrieved.id).toBe(created.id);
            expect(retrieved.region_type).toBe(dashboard_region_dto_1.RegionType.SCHEDULING);
            const updateDto = {
                grid_row: 1,
                grid_col: 1,
                version: 1
            };
            const updated = await service.updateRegion(created.id, updateDto, mockUser);
            expect(updated.grid_row).toBe(1);
            expect(updated.grid_col).toBe(1);
            expect(updated.version).toBe(2);
            const result = await service.deleteRegion(created.id, mockUser);
            expect(result.success).toBe(true);
            await expect(service.getRegion(created.id, mockUser)).rejects.toThrow(common_1.NotFoundException);
        });
    });
    describe('Validation Integration', () => {
        it('should prevent overlapping regions', async () => {
            const region1 = {
                layout_id: mockLayout.id,
                region_type: dashboard_region_dto_1.RegionType.SCHEDULING,
                grid_row: 0,
                grid_col: 0,
                row_span: 2,
                col_span: 2
            };
            const region2 = {
                layout_id: mockLayout.id,
                region_type: dashboard_region_dto_1.RegionType.ANALYTICS,
                grid_row: 1,
                grid_col: 1,
                row_span: 2,
                col_span: 2
            };
            await service.createRegion(region1, mockUser);
            await expect(service.createRegion(region2, mockUser)).rejects.toThrow(common_1.BadRequestException);
        });
        it('should validate grid bounds', async () => {
            const invalidRegion = {
                layout_id: mockLayout.id,
                region_type: dashboard_region_dto_1.RegionType.SCHEDULING,
                grid_row: -1,
                grid_col: 0,
                row_span: 1,
                col_span: 1
            };
            validationService.validateCreate.mockImplementationOnce(async () => {
                throw new common_1.BadRequestException('Grid row must be at least 0');
            });
            await expect(service.createRegion(invalidRegion, mockUser)).rejects.toThrow(common_1.BadRequestException);
        });
    });
    describe('Optimistic Locking Integration', () => {
        it('should handle version conflicts correctly', async () => {
            const createDto = {
                layout_id: mockLayout.id,
                region_type: dashboard_region_dto_1.RegionType.SCHEDULING,
                grid_row: 0,
                grid_col: 0,
                row_span: 1,
                col_span: 1
            };
            const created = await service.createRegion(createDto, mockUser);
            expect(created.version).toBe(1);
            const update1 = {
                grid_row: 1,
                version: 1
            };
            const updated1 = await service.updateRegion(created.id, update1, mockUser);
            expect(updated1.version).toBe(2);
            const update2 = {
                grid_row: 2,
                version: 1
            };
            await expect(service.updateRegion(created.id, update2, mockUser)).rejects.toThrow(common_1.ConflictException);
        });
        it('should require version for updates', async () => {
            const createDto = {
                layout_id: mockLayout.id,
                region_type: dashboard_region_dto_1.RegionType.SCHEDULING,
                grid_row: 0,
                grid_col: 0,
                row_span: 1,
                col_span: 1
            };
            const created = await service.createRegion(createDto, mockUser);
            const updateWithoutVersion = {
                grid_row: 1
            };
            await expect(service.updateRegion(created.id, updateWithoutVersion, mockUser)).rejects.toThrow(common_1.BadRequestException);
        });
    });
    describe('Tenant Isolation Integration', () => {
        it('should only return regions for the correct tenant', async () => {
            const tenant1User = { userId: 'user-1', tenantId: 'tenant-1' };
            const tenant2User = { userId: 'user-2', tenantId: 'tenant-2' };
            const tenant1Layout = Object.assign(Object.assign({}, mockLayout), { id: 'layout-1', tenant_id: 'tenant-1' });
            const mockLayoutQuery = {
                select: jest.fn().mockReturnThis(),
                eq: jest.fn().mockReturnThis(),
                is: jest.fn().mockReturnThis(),
                single: jest.fn().mockResolvedValue({ data: tenant1Layout, error: null })
            };
            mockLayoutQuery.eq.mockReturnValue(mockLayoutQuery);
            mockLayoutQuery.is.mockReturnValue(mockLayoutQuery);
            const mockClient = supabaseService.getClient();
            mockClient.from.mockImplementation((table) => {
                if (table === 'dashboard_layouts') {
                    return mockLayoutQuery;
                }
                return createMockQuery(table);
            });
            const region1 = {
                layout_id: 'layout-1',
                region_type: dashboard_region_dto_1.RegionType.SCHEDULING,
                grid_row: 0,
                grid_col: 0,
                row_span: 1,
                col_span: 1
            };
            const created = await service.createRegion(region1, tenant1User);
            await expect(service.getRegion(created.id, tenant2User)).rejects.toThrow(common_1.NotFoundException);
        });
    });
    describe('Event Store Integration', () => {
        it('should log all region mutations', async () => {
            const createDto = {
                layout_id: mockLayout.id,
                region_type: dashboard_region_dto_1.RegionType.SCHEDULING,
                grid_row: 0,
                grid_col: 0,
                row_span: 1,
                col_span: 1
            };
            const created = await service.createRegion(createDto, mockUser);
            expect(eventStore.appendEvent).toHaveBeenCalledWith(expect.objectContaining({
                event_type: expect.stringContaining('region_created'),
                entity_id: created.id,
                tenant_id: mockUser.tenantId,
                user_id: mockUser.userId
            }));
            const updateDto = {
                grid_row: 1,
                version: 1
            };
            await service.updateRegion(created.id, updateDto, mockUser);
            expect(eventStore.appendEvent).toHaveBeenCalledWith(expect.objectContaining({
                event_type: expect.stringContaining('region_updated'),
                entity_id: created.id
            }));
            await service.deleteRegion(created.id, mockUser);
            expect(eventStore.appendEvent).toHaveBeenCalledWith(expect.objectContaining({
                event_type: expect.stringContaining('region_deleted'),
                entity_id: created.id
            }));
        });
    });
    describe('Metrics Integration', () => {
        it('should record metrics for all operations', async () => {
            const createDto = {
                layout_id: mockLayout.id,
                region_type: dashboard_region_dto_1.RegionType.SCHEDULING,
                grid_row: 0,
                grid_col: 0,
                row_span: 1,
                col_span: 1
            };
            const created = await service.createRegion(createDto, mockUser);
            expect(metricsService.recordRegionOperation).toHaveBeenCalledWith('create', expect.any(Number), 'success', dashboard_region_dto_1.RegionType.SCHEDULING);
            const updateDto = {
                grid_row: 1,
                version: 1
            };
            await service.updateRegion(created.id, updateDto, mockUser);
            expect(metricsService.recordRegionOperation).toHaveBeenCalledWith('update', expect.any(Number), 'success', dashboard_region_dto_1.RegionType.SCHEDULING);
            await service.deleteRegion(created.id, mockUser);
            expect(metricsService.recordRegionOperation).toHaveBeenCalledWith('delete', expect.any(Number), 'success', dashboard_region_dto_1.RegionType.SCHEDULING);
        });
        it('should record error metrics on failures', async () => {
            const invalidDto = {
                layout_id: mockLayout.id,
                region_type: dashboard_region_dto_1.RegionType.SCHEDULING,
                grid_row: 0,
                grid_col: 0,
                row_span: 1,
                col_span: 1
            };
            await service.createRegion(invalidDto, mockUser);
            const overlappingDto = {
                layout_id: mockLayout.id,
                region_type: dashboard_region_dto_1.RegionType.ANALYTICS,
                grid_row: 0,
                grid_col: 0,
                row_span: 1,
                col_span: 1
            };
            try {
                await service.createRegion(overlappingDto, mockUser);
            }
            catch (error) {
                expect(metricsService.recordError).toHaveBeenCalled();
            }
        });
    });
    describe('Cache Integration', () => {
        it('should invalidate cache on mutations', async () => {
            const createDto = {
                layout_id: mockLayout.id,
                region_type: dashboard_region_dto_1.RegionType.SCHEDULING,
                grid_row: 0,
                grid_col: 0,
                row_span: 1,
                col_span: 1
            };
            const created = await service.createRegion(createDto, mockUser);
            expect(cacheService.invalidateLayout).toHaveBeenCalledWith(mockLayout.id);
            expect(cacheService.invalidateRegion).toHaveBeenCalledWith(created.id);
            const updateDto = {
                grid_row: 1,
                version: 1
            };
            await service.updateRegion(created.id, updateDto, mockUser);
            expect(cacheService.invalidateLayout).toHaveBeenCalled();
            expect(cacheService.invalidateRegion).toHaveBeenCalledWith(created.id);
            await service.deleteRegion(created.id, mockUser);
            expect(cacheService.invalidateLayout).toHaveBeenCalled();
            expect(cacheService.invalidateRegion).toHaveBeenCalledWith(created.id);
        });
    });
});
//# sourceMappingURL=dashboard-regions.integration.test.js.map