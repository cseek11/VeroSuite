/**
 * KPIs Controller Unit Tests
 * Tests for API endpoints and request validation
 */

import { Test, TestingModule } from '@nestjs/testing';
import { KPIsController } from '../../../src/kpis/kpis.controller';
import { KPIsService } from '../../../src/kpis/kpis.service';
import { CreateKPIDto, UpdateKPIDto } from '../../../src/kpis/dto';

describe('KPIsController', () => {
  let controller: KPIsController;
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
      controllers: [KPIsController],
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

    controller = module.get<KPIsController>(KPIsController);
    kpisService = module.get<KPIsService>(KPIsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createKPI', () => {
    it('should create KPI successfully', async () => {
      const createKPIDto: CreateKPIDto = {
        name: 'Test KPI',
        description: 'Test description',
        enabled: true,
      };

      jest.spyOn(kpisService, 'createKPI').mockResolvedValue(mockKPI as any);

      const result = await controller.createKPI({ user: mockUser } as any, createKPIDto);

      expect(result).toEqual(mockKPI);
      expect(kpisService.createKPI).toHaveBeenCalledWith(
        mockUser.tenantId,
        mockUser.userId,
        createKPIDto
      );
    });
  });

  describe('getKPIs', () => {
    it('should return all KPIs for tenant', async () => {
      jest.spyOn(kpisService, 'getKPIs').mockResolvedValue([mockKPI] as any);

      const result = await controller.getKPIs({ user: mockUser } as any);

      expect(result).toEqual([mockKPI]);
      expect(kpisService.getKPIs).toHaveBeenCalledWith(mockUser.tenantId);
    });
  });

  describe('getUserKPIs', () => {
    it('should return user KPIs', async () => {
      jest.spyOn(kpisService, 'getUserKPIs').mockResolvedValue([mockKPI] as any);

      const result = await controller.getUserKPIs({ user: mockUser } as any);

      expect(result).toEqual([mockKPI]);
      expect(kpisService.getUserKPIs).toHaveBeenCalledWith(mockUser.tenantId, mockUser.userId);
    });
  });

  describe('getKPI', () => {
    it('should return KPI by ID', async () => {
      jest.spyOn(kpisService, 'getKPI').mockResolvedValue(mockKPI as any);

      const result = await controller.getKPI({ user: mockUser } as any, 'kpi-123');

      expect(result).toEqual(mockKPI);
      expect(kpisService.getKPI).toHaveBeenCalledWith(mockUser.tenantId, 'kpi-123');
    });
  });

  describe('updateKPI', () => {
    it('should update KPI successfully', async () => {
      const updateKPIDto: UpdateKPIDto = {
        name: 'Updated KPI',
      };

      const updatedKPI = { ...mockKPI, ...updateKPIDto };
      jest.spyOn(kpisService, 'updateKPI').mockResolvedValue(updatedKPI as any);

      const result = await controller.updateKPI({ user: mockUser } as any, 'kpi-123', updateKPIDto);

      expect(result).toEqual(updatedKPI);
      expect(kpisService.updateKPI).toHaveBeenCalledWith(
        mockUser.tenantId,
        'kpi-123',
        updateKPIDto
      );
    });
  });

  describe('deleteKPI', () => {
    it('should delete KPI successfully', async () => {
      jest.spyOn(kpisService, 'deleteKPI').mockResolvedValue(undefined);

      await controller.deleteKPI({ user: mockUser } as any, 'kpi-123');

      expect(kpisService.deleteKPI).toHaveBeenCalledWith(mockUser.tenantId, 'kpi-123');
    });
  });

  describe('getKPIData', () => {
    it('should return KPI data without filter', async () => {
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

      expect(result).toEqual(mockData);
      expect(kpisService.getKPIData).toHaveBeenCalledWith(mockUser.tenantId, undefined);
    });

    it('should return KPI data with filter', async () => {
      const mockData = [
        {
          id: 'kpi-123',
          metric: 'Jobs Completed Today',
          value: 10,
          timestamp: new Date().toISOString(),
        },
      ];

      jest.spyOn(kpisService, 'getKPIData').mockResolvedValue(mockData as any);

      const result = await controller.getKPIData({ user: mockUser } as any, 'kpi-123');

      expect(result).toEqual(mockData);
      expect(kpisService.getKPIData).toHaveBeenCalledWith(mockUser.tenantId, 'kpi-123');
    });
  });

  describe('getKPITrends', () => {
    it('should return KPI trends with default period', async () => {
      const mockTrends = [
        {
          kpi_id: 'kpi-123',
          metric: 'Jobs Completed Today',
          values: [10, 12, 15],
          timestamps: ['2025-01-01', '2025-01-02', '2025-01-03'],
        },
      ];

      jest.spyOn(kpisService, 'getKPITrends').mockResolvedValue(mockTrends as any);

      const result = await controller.getKPITrends({ user: mockUser } as any, undefined);

      expect(result).toEqual(mockTrends);
      expect(kpisService.getKPITrends).toHaveBeenCalledWith(mockUser.tenantId, '24h');
    });

    it('should return KPI trends with custom period', async () => {
      const mockTrends = [
        {
          kpi_id: 'kpi-123',
          metric: 'Jobs Completed Today',
          values: [10, 12, 15],
          timestamps: ['2025-01-01', '2025-01-02', '2025-01-03'],
        },
      ];

      jest.spyOn(kpisService, 'getKPITrends').mockResolvedValue(mockTrends as any);

      const result = await controller.getKPITrends({ user: mockUser } as any, '7d');

      expect(result).toEqual(mockTrends);
      expect(kpisService.getKPITrends).toHaveBeenCalledWith(mockUser.tenantId, '7d');
    });
  });

  describe('getDrillDownData', () => {
    it('should return drill-down data', async () => {
      const mockDrillDown = {
        data: [{ id: 'job-1', status: 'completed' }],
        summary: { total: 1 },
      };

      jest.spyOn(kpisService, 'getDrillDownData').mockResolvedValue(mockDrillDown as any);

      const filters = { status: 'completed' };
      const result = await controller.getDrillDownData({ user: mockUser } as any, 'kpi-123', filters);

      expect(result).toEqual(mockDrillDown);
      expect(kpisService.getDrillDownData).toHaveBeenCalledWith(
        mockUser.tenantId,
        'kpi-123',
        filters
      );
    });
  });
});

