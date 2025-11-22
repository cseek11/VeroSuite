/**
 * KPIs V2 Controller Unit Tests
 * Tests for V2 API endpoints with enhanced response format
 */

import { Test, TestingModule } from '@nestjs/testing';
import { KPIsV2Controller } from '../../../src/kpis/kpis-v2.controller';
import { KPIsService } from '../../../src/kpis/kpis.service';
import { CreateKPIDto, UpdateKPIDto } from '../../../src/kpis/dto';

describe('KPIsV2Controller', () => {
  let controller: KPIsV2Controller;
  let kpisService: KPIsService;

  const mockUser = {
    userId: 'user-123',
    tenantId: 'tenant-123',
  };

  const mockKPI = {
    id: 'kpi-123',
    name: 'Jobs Completed Today',
    description: 'Number of jobs completed today',
    enabled: true,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [KPIsV2Controller],
      providers: [
        {
          provide: KPIsService,
          useValue: {
            createKPI: jest.fn(),
            getKPIs: jest.fn(),
            getKPI: jest.fn(),
            getUserKPIs: jest.fn(),
            updateKPI: jest.fn(),
            deleteKPI: jest.fn(),
            getKPIData: jest.fn(),
            getKPITrends: jest.fn(),
            getDrillDownData: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<KPIsV2Controller>(KPIsV2Controller);
    kpisService = module.get<KPIsService>(KPIsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createKPI', () => {
    it('should create KPI with V2 response format', async () => {
      const createKPIDto: CreateKPIDto = {
        name: 'Test KPI',
        description: 'Test description',
        enabled: true,
      };

      jest.spyOn(kpisService, 'createKPI').mockResolvedValue(mockKPI as any);

      const result = await controller.createKPI({ user: mockUser } as any, createKPIDto);

      expect(result).toHaveProperty('data');
      expect(result).toHaveProperty('meta');
      expect(result.data).toEqual(mockKPI);
      expect(result.meta.version).toBe('2.0');
      expect(result.meta).toHaveProperty('timestamp');
      expect(kpisService.createKPI).toHaveBeenCalledWith(
        mockUser.tenantId,
        mockUser.userId,
        createKPIDto
      );
    });
  });

  describe('getKPIs', () => {
    it('should return KPIs with V2 response format', async () => {
      jest.spyOn(kpisService, 'getKPIs').mockResolvedValue([mockKPI] as any);

      const result = await controller.getKPIs({ user: mockUser } as any);

      expect(result).toHaveProperty('data');
      expect(result).toHaveProperty('meta');
      expect(result.data).toEqual([mockKPI]);
      expect(result.meta.version).toBe('2.0');
      expect(result.meta.count).toBe(1);
      expect(result.meta).toHaveProperty('timestamp');
      expect(kpisService.getKPIs).toHaveBeenCalledWith(mockUser.tenantId);
    });

    it('should return count of 0 when no KPIs', async () => {
      jest.spyOn(kpisService, 'getKPIs').mockResolvedValue([]);

      const result = await controller.getKPIs({ user: mockUser } as any);

      expect(result.meta.count).toBe(0);
    });
  });

  describe('getUserKPIs', () => {
    it('should return user KPIs with V2 response format', async () => {
      jest.spyOn(kpisService, 'getUserKPIs').mockResolvedValue([mockKPI] as any);

      const result = await controller.getUserKPIs({ user: mockUser } as any);

      expect(result).toHaveProperty('data');
      expect(result).toHaveProperty('meta');
      expect(result.data).toEqual([mockKPI]);
      expect(result.meta.version).toBe('2.0');
      expect(result.meta.count).toBe(1);
      expect(kpisService.getUserKPIs).toHaveBeenCalledWith(mockUser.tenantId, mockUser.userId);
    });
  });

  describe('getKPI', () => {
    it('should return KPI with V2 response format', async () => {
      jest.spyOn(kpisService, 'getKPI').mockResolvedValue(mockKPI as any);

      const result = await controller.getKPI({ user: mockUser } as any, 'kpi-123');

      expect(result).toHaveProperty('data');
      expect(result).toHaveProperty('meta');
      expect(result.data).toEqual(mockKPI);
      expect(result.meta.version).toBe('2.0');
      expect(kpisService.getKPI).toHaveBeenCalledWith(mockUser.tenantId, 'kpi-123');
    });
  });

  describe('updateKPI', () => {
    it('should update KPI with V2 response format', async () => {
      const updateKPIDto: UpdateKPIDto = {
        name: 'Updated KPI',
      };

      const updatedKPI = { ...mockKPI, ...updateKPIDto };
      jest.spyOn(kpisService, 'updateKPI').mockResolvedValue(updatedKPI as any);

      const result = await controller.updateKPI({ user: mockUser } as any, 'kpi-123', updateKPIDto);

      expect(result).toHaveProperty('data');
      expect(result).toHaveProperty('meta');
      expect(result.data).toEqual(updatedKPI);
      expect(result.meta.version).toBe('2.0');
      expect(kpisService.updateKPI).toHaveBeenCalledWith(
        mockUser.tenantId,
        'kpi-123',
        updateKPIDto
      );
    });
  });

  describe('deleteKPI', () => {
    it('should delete KPI with V2 response format', async () => {
      jest.spyOn(kpisService, 'deleteKPI').mockResolvedValue(undefined);

      const result = await controller.deleteKPI({ user: mockUser } as any, 'kpi-123');

      expect(result).toHaveProperty('meta');
      expect(result.meta.version).toBe('2.0');
      expect(result.meta).toHaveProperty('timestamp');
      expect(kpisService.deleteKPI).toHaveBeenCalledWith(mockUser.tenantId, 'kpi-123');
    });
  });

  describe('getKPIData', () => {
    it('should return KPI data with V2 response format', async () => {
      const mockData = [
        {
          id: 'kpi-123',
          metric: 'Jobs Completed Today',
          value: 10,
          timestamp: new Date().toISOString(),
        },
      ];

      jest.spyOn(kpisService, 'getKPIData').mockResolvedValue(mockData as any);

      const result = await controller.getKPIData({ user: mockUser } as any, undefined);

      expect(result).toHaveProperty('data');
      expect(result).toHaveProperty('meta');
      expect(result.data).toEqual(mockData);
      expect(result.meta.version).toBe('2.0');
      expect(result.meta.count).toBe(1);
    });
  });

  describe('getKPITrends', () => {
    it('should return KPI trends with V2 response format', async () => {
      const mockTrends = [
        {
          kpi_id: 'kpi-123',
          metric: 'Jobs Completed Today',
          values: [10, 12, 15],
          timestamps: ['2025-01-01', '2025-01-02', '2025-01-03'],
        },
      ];

      jest.spyOn(kpisService, 'getKPITrends').mockResolvedValue(mockTrends as any);

      const result = await controller.getKPITrends({ user: mockUser } as any, '24h');

      expect(result).toHaveProperty('data');
      expect(result).toHaveProperty('meta');
      expect(result.data).toEqual(mockTrends);
      expect(result.meta.version).toBe('2.0');
      expect(result.meta.period).toBe('24h');
    });
  });

  describe('getDrillDownData', () => {
    it('should return drill-down data with V2 response format', async () => {
      const mockDrillDown = {
        data: [{ id: 'job-1', status: 'completed' }],
        summary: { total: 1 },
      };

      jest.spyOn(kpisService, 'getDrillDownData').mockResolvedValue(mockDrillDown as any);

      const filters = { status: 'completed' };
      const result = await controller.getDrillDownData({ user: mockUser } as any, 'kpi-123', filters);

      expect(result).toHaveProperty('data');
      expect(result).toHaveProperty('meta');
      expect(result.meta.version).toBe('2.0');
      expect(kpisService.getDrillDownData).toHaveBeenCalledWith(
        mockUser.tenantId,
        'kpi-123',
        filters
      );
    });
  });
});

