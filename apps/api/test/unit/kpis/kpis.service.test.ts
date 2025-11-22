/**
 * KPIs Service Unit Tests
 * Tests for KPI creation, retrieval, data calculation, and trends
 */

import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { KPIsService } from '../../../src/kpis/kpis.service';
import { SupabaseService } from '../../../src/common/services/supabase.service';
import { CacheService } from '../../../src/common/services/cache.service';
import { WebSocketGateway } from '../../../src/websocket/websocket.gateway';
import { CreateKPIDto, UpdateKPIDto } from '../../../src/kpis/dto';

describe('KPIsService', () => {
  let service: KPIsService;
  let supabaseService: SupabaseService;
  let cacheService: CacheService;
  let websocketGateway: WebSocketGateway;
  let mockSupabaseClient: any;

  const mockTenantId = 'tenant-123';
  const mockUserId = 'user-123';
  const mockKpiId = 'kpi-123';

  const mockKPI = {
    id: mockKpiId,
    name: 'Jobs Completed Today',
    description: 'Number of jobs completed today',
    tenant_id: mockTenantId,
    user_id: mockUserId,
    enabled: true,
    formula_expression: 'SUM(value)',
    formula_fields: [],
    threshold_config: { min: 0, max: 100 },
    chart_config: { type: 'number' },
    data_source_config: { table: 'jobs' },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const queryBuilders = new Map<string, any>();

  const createMockQueryBuilder = (table: string) => {
    if (!queryBuilders.has(table)) {
      const builder: any = {
        select: jest.fn().mockReturnThis(),
        insert: jest.fn().mockReturnThis(),
        update: jest.fn().mockReturnThis(),
        delete: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        gte: jest.fn().mockReturnThis(),
        lt: jest.fn().mockReturnThis(),
        order: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        single: jest.fn(),
      };
      queryBuilders.set(table, builder);
    }
    return queryBuilders.get(table);
  };

  const getBuilder = (table: string) => {
    if (!queryBuilders.has(table)) {
      createMockQueryBuilder(table);
    }
    return queryBuilders.get(table);
  };

  beforeEach(async () => {
    queryBuilders.clear();

    mockSupabaseClient = {
      from: jest.fn((table: string) => getBuilder(table)),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        KPIsService,
        {
          provide: SupabaseService,
          useValue: {
            getClient: jest.fn().mockReturnValue(mockSupabaseClient),
          },
        },
        {
          provide: CacheService,
          useValue: {
            getKPIConfigs: jest.fn().mockResolvedValue(null),
            setKPIConfigs: jest.fn().mockResolvedValue(undefined),
            invalidateKPICache: jest.fn().mockResolvedValue(undefined),
            getKPIData: jest.fn().mockResolvedValue(null),
            setKPIData: jest.fn().mockResolvedValue(undefined),
            getKPITrends: jest.fn().mockResolvedValue(null),
            setKPITrends: jest.fn().mockResolvedValue(undefined),
            getBatchKPIData: jest.fn().mockResolvedValue(null),
            setBatchKPIData: jest.fn().mockResolvedValue(undefined),
          },
        },
        {
          provide: WebSocketGateway,
          useValue: {
            broadcastKPIUpdate: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile();

    service = module.get<KPIsService>(KPIsService);
    supabaseService = module.get<SupabaseService>(SupabaseService);
    cacheService = module.get<CacheService>(CacheService);
    websocketGateway = module.get<WebSocketGateway>(WebSocketGateway);

    mockSupabaseClient.from.mockClear();
    mockSupabaseClient.from.mockImplementation((table: string) => getBuilder(table));
  });

  afterEach(() => {
    jest.clearAllMocks();
    queryBuilders.clear();
  });

  describe('createKPI', () => {
    const createKPIDto: CreateKPIDto = {
      name: 'Test KPI',
      description: 'Test description',
      enabled: true,
    };

    it('should create KPI successfully', async () => {
      const userKpisBuilder = getBuilder('user_kpis');
      userKpisBuilder.insert.mockReturnValue({
        select: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: mockKPI, error: null }),
      });

      const result = await service.createKPI(mockTenantId, mockUserId, createKPIDto);

      expect(result).toBeDefined();
      expect(result.id).toBe(mockKpiId);
      expect(cacheService.invalidateKPICache).toHaveBeenCalledWith(mockTenantId);
    });

    it('should handle creation errors', async () => {
      const userKpisBuilder = getBuilder('user_kpis');
      userKpisBuilder.insert.mockReturnValue({
        select: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: null, error: { message: 'Creation failed' } }),
      });

      await expect(
        service.createKPI(mockTenantId, mockUserId, createKPIDto)
      ).rejects.toThrow(BadRequestException);
    });

    it('should use default formula expression when not provided', async () => {
      const userKpisBuilder = getBuilder('user_kpis');
      userKpisBuilder.insert.mockReturnValue({
        select: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: mockKPI, error: null }),
      });

      await service.createKPI(mockTenantId, mockUserId, createKPIDto);

      expect(userKpisBuilder.insert).toHaveBeenCalled();
    });
  });

  describe('getKPIs', () => {
    it('should return KPIs from cache when available', async () => {
      const cachedKPIs = [mockKPI];
      jest.spyOn(cacheService, 'getKPIConfigs').mockResolvedValue(cachedKPIs as any);

      const result = await service.getKPIs(mockTenantId);

      expect(result).toEqual(cachedKPIs);
      expect(mockSupabaseClient.from).not.toHaveBeenCalled();
    });

    it('should fetch KPIs from database when cache miss', async () => {
      const kpiConfigsBuilder = getBuilder('kpi_configs');
      kpiConfigsBuilder.order.mockResolvedValue({ data: [mockKPI], error: null });

      const result = await service.getKPIs(mockTenantId);

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(cacheService.setKPIConfigs).toHaveBeenCalled();
    });

    it('should handle database errors', async () => {
      const kpiConfigsBuilder = getBuilder('kpi_configs');
      kpiConfigsBuilder.order.mockResolvedValue({ data: null, error: { message: 'Query failed' } });

      await expect(service.getKPIs(mockTenantId)).rejects.toThrow(BadRequestException);
    });
  });

  describe('getKPI', () => {
    it('should return KPI by ID', async () => {
      const kpiConfigsBuilder = getBuilder('kpi_configs');
      kpiConfigsBuilder.single.mockResolvedValue({ data: mockKPI, error: null });

      const result = await service.getKPI(mockTenantId, mockKpiId);

      expect(result).toBeDefined();
      expect(result.id).toBe(mockKpiId);
    });

    it('should throw NotFoundException when KPI not found', async () => {
      const kpiConfigsBuilder = getBuilder('kpi_configs');
      kpiConfigsBuilder.single.mockResolvedValue({ data: null, error: { code: 'PGRST116' } });

      await expect(service.getKPI(mockTenantId, 'non-existent')).rejects.toThrow(NotFoundException);
    });

    it('should handle other errors', async () => {
      const kpiConfigsBuilder = getBuilder('kpi_configs');
      kpiConfigsBuilder.single.mockResolvedValue({ data: null, error: { message: 'Query failed' } });

      await expect(service.getKPI(mockTenantId, mockKpiId)).rejects.toThrow(BadRequestException);
    });
  });

  describe('getUserKPIs', () => {
    it('should return user KPIs', async () => {
      const userKpisBuilder = getBuilder('user_kpis');
      userKpisBuilder.select.mockResolvedValue({ data: [mockKPI], error: null });

      const result = await service.getUserKPIs(mockTenantId, mockUserId);

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
    });

    it('should handle errors when fetching user KPIs', async () => {
      const userKpisBuilder = getBuilder('user_kpis');
      userKpisBuilder.select.mockResolvedValue({ data: null, error: { message: 'Query failed' } });

      const result = await service.getUserKPIs(mockTenantId, mockUserId);

      expect(result).toEqual([]);
    });
  });

  describe('updateKPI', () => {
    const updateKPIDto: UpdateKPIDto = {
      name: 'Updated KPI',
    };

    it('should update KPI successfully', async () => {
      const kpiConfigsBuilder = getBuilder('kpi_configs');
      kpiConfigsBuilder.single
        .mockResolvedValueOnce({ data: mockKPI, error: null }) // getKPI call
        .mockResolvedValueOnce({ data: { ...mockKPI, ...updateKPIDto }, error: null }); // update call

      kpiConfigsBuilder.update.mockReturnValue({
        eq: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: { ...mockKPI, ...updateKPIDto }, error: null }),
      });

      const result = await service.updateKPI(mockTenantId, mockKpiId, updateKPIDto);

      expect(result).toBeDefined();
      expect(result.name).toBe('Updated KPI');
    });

    it('should throw NotFoundException when KPI not found', async () => {
      const kpiConfigsBuilder = getBuilder('kpi_configs');
      kpiConfigsBuilder.single.mockResolvedValue({ data: null, error: { code: 'PGRST116' } });

      await expect(
        service.updateKPI(mockTenantId, 'non-existent', updateKPIDto)
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteKPI', () => {
    it('should delete KPI successfully', async () => {
      const kpiConfigsBuilder = getBuilder('kpi_configs');
      kpiConfigsBuilder.single.mockResolvedValue({ data: mockKPI, error: null });
      kpiConfigsBuilder.delete.mockReturnValue({
        eq: jest.fn().mockReturnThis(),
        eq: jest.fn().mockResolvedValue({ data: null, error: null }),
      });

      await service.deleteKPI(mockTenantId, mockKpiId);

      expect(kpiConfigsBuilder.delete).toHaveBeenCalled();
    });

    it('should throw NotFoundException when KPI not found', async () => {
      const kpiConfigsBuilder = getBuilder('kpi_configs');
      kpiConfigsBuilder.single.mockResolvedValue({ data: null, error: { code: 'PGRST116' } });

      await expect(service.deleteKPI(mockTenantId, 'non-existent')).rejects.toThrow(NotFoundException);
    });
  });

  describe('getKPIData', () => {
    it('should return KPI data from cache when available', async () => {
      const cachedData = [
        {
          id: mockKpiId,
          metric: 'Jobs Completed Today',
          value: 10,
          timestamp: new Date().toISOString(),
        },
      ];
      jest.spyOn(cacheService, 'getKPIData').mockResolvedValue(cachedData as any);

      const result = await service.getKPIData(mockTenantId, mockKpiId);

      expect(result).toEqual(cachedData);
    });

    it('should calculate KPI data when cache miss', async () => {
      const kpiConfigsBuilder = getBuilder('kpi_configs');
      kpiConfigsBuilder.select.mockResolvedValue({ data: [mockKPI], error: null });

      const jobsBuilder = getBuilder('jobs');
      jobsBuilder.gte = jest.fn().mockReturnThis();
      jobsBuilder.lt = jest.fn().mockResolvedValue({ data: [{ id: 'job-1', status: 'completed' }], error: null });

      const kpiDataBuilder = getBuilder('kpi_data');
      kpiDataBuilder.insert.mockReturnValue({
        select: jest.fn().mockResolvedValue({ data: null, error: null }),
      });
      kpiDataBuilder.order.mockReturnValue({
        limit: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: null, error: { code: 'PGRST116' } }),
      });

      const result = await service.getKPIData(mockTenantId, mockKpiId);

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
    });

    it('should handle calculation errors gracefully', async () => {
      const kpiConfigsBuilder = getBuilder('kpi_configs');
      kpiConfigsBuilder.select.mockResolvedValue({ data: [mockKPI], error: null });

      const jobsBuilder = getBuilder('jobs');
      jobsBuilder.gte = jest.fn().mockReturnThis();
      jobsBuilder.lt = jest.fn().mockRejectedValue(new Error('Calculation failed'));

      const kpiDataBuilder = getBuilder('kpi_data');
      kpiDataBuilder.order.mockReturnValue({
        limit: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: null, error: { code: 'PGRST116' } }),
      });

      const result = await service.getKPIData(mockTenantId, mockKpiId);

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe('getKPITrends', () => {
    it('should return trends from cache when available', async () => {
      const cachedTrends = [
        {
          kpi_id: mockKpiId,
          metric: 'Jobs Completed Today',
          values: [10, 12, 15],
          timestamps: ['2025-01-01', '2025-01-02', '2025-01-03'],
        },
      ];
      jest.spyOn(cacheService, 'getKPITrends').mockResolvedValue(cachedTrends as any);

      const result = await service.getKPITrends(mockTenantId, '24h');

      expect(result).toEqual(cachedTrends);
    });

    it('should calculate trends for 24h period', async () => {
      const kpiConfigsBuilder = getBuilder('kpi_configs');
      kpiConfigsBuilder.select.mockResolvedValue({ data: [mockKPI], error: null });

      const kpiDataBuilder = getBuilder('kpi_data');
      kpiDataBuilder.select.mockResolvedValue({
        data: [
          { kpi_id: mockKpiId, value: 10, timestamp: new Date().toISOString() },
          { kpi_id: mockKpiId, value: 12, timestamp: new Date().toISOString() },
        ],
        error: null,
      });

      const result = await service.getKPITrends(mockTenantId, '24h');

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
    });

    it('should calculate trends for 7d period', async () => {
      const kpiConfigsBuilder = getBuilder('kpi_configs');
      kpiConfigsBuilder.select.mockResolvedValue({ data: [mockKPI], error: null });

      const kpiDataBuilder = getBuilder('kpi_data');
      kpiDataBuilder.select.mockResolvedValue({ data: [], error: null });

      const result = await service.getKPITrends(mockTenantId, '7d');

      expect(result).toBeDefined();
    });

    it('should calculate trends for 30d period', async () => {
      const kpiConfigsBuilder = getBuilder('kpi_configs');
      kpiConfigsBuilder.select.mockResolvedValue({ data: [mockKPI], error: null });

      const kpiDataBuilder = getBuilder('kpi_data');
      kpiDataBuilder.select.mockResolvedValue({ data: [], error: null });

      const result = await service.getKPITrends(mockTenantId, '30d');

      expect(result).toBeDefined();
    });
  });

  describe('getDrillDownData', () => {
    it('should return drill-down data for Jobs Completed Today', async () => {
      const kpiConfigsBuilder = getBuilder('kpi_configs');
      kpiConfigsBuilder.single.mockResolvedValue({
        data: { ...mockKPI, name: 'Jobs Completed Today' },
        error: null,
      });

      const jobsBuilder = getBuilder('jobs');
      jobsBuilder.gte = jest.fn().mockReturnThis();
      jobsBuilder.lt = jest.fn().mockResolvedValue({ data: [{ id: 'job-1' }], error: null });

      const result = await service.getDrillDownData(mockTenantId, mockKpiId, {});

      expect(result).toBeDefined();
    });

    it('should return drill-down data for Daily Revenue', async () => {
      const kpiConfigsBuilder = getBuilder('kpi_configs');
      kpiConfigsBuilder.single.mockResolvedValue({
        data: { ...mockKPI, name: 'Daily Revenue' },
        error: null,
      });

      const serviceHistoryBuilder = getBuilder('service_history');
      serviceHistoryBuilder.gte = jest.fn().mockReturnThis();
      serviceHistoryBuilder.lt = jest.fn().mockResolvedValue({ data: [{ cost: '100' }], error: null });

      const result = await service.getDrillDownData(mockTenantId, mockKpiId, {});

      expect(result).toBeDefined();
    });

    it('should throw NotFoundException when KPI not found', async () => {
      const kpiConfigsBuilder = getBuilder('kpi_configs');
      kpiConfigsBuilder.single.mockResolvedValue({ data: null, error: { code: 'PGRST116' } });

      await expect(service.getDrillDownData(mockTenantId, 'non-existent', {})).rejects.toThrow(
        NotFoundException
      );
    });
  });

  describe('getBatchKPIData', () => {
    it('should return batch KPI data for multiple KPIs', async () => {
      const kpiIds = ['kpi-1', 'kpi-2'];
      const kpiConfigsBuilder = getBuilder('kpi_configs');
      kpiConfigsBuilder.select.mockResolvedValue({
        data: [
          { ...mockKPI, id: 'kpi-1', name: 'Jobs Completed Today' },
          { ...mockKPI, id: 'kpi-2', name: 'Daily Revenue' },
        ],
        error: null,
      });

      const jobsBuilder = getBuilder('jobs');
      jobsBuilder.gte = jest.fn().mockReturnThis();
      jobsBuilder.lt = jest.fn().mockResolvedValue({ data: [], error: null });

      const serviceHistoryBuilder = getBuilder('service_history');
      serviceHistoryBuilder.gte = jest.fn().mockReturnThis();
      serviceHistoryBuilder.lt = jest.fn().mockResolvedValue({ data: [], error: null });

      const kpiDataBuilder = getBuilder('kpi_data');
      kpiDataBuilder.insert.mockReturnValue({
        select: jest.fn().mockResolvedValue({ data: null, error: null }),
      });
      kpiDataBuilder.order.mockReturnValue({
        limit: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: null, error: { code: 'PGRST116' } }),
      });

      const result = await service.getBatchKPIData(mockTenantId, kpiIds);

      expect(result).toBeDefined();
      expect(typeof result).toBe('object');
    });
  });
});

