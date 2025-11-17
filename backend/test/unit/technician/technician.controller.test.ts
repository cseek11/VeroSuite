/**
 * Technician Controller Unit Tests
 * Tests for API endpoints and request validation
 */

import { Test, TestingModule } from '@nestjs/testing';
import { TechnicianController } from '../../../src/technician/technician.controller';
import { TechnicianService } from '../../../src/technician/technician.service';
import { TechnicianStatus, EmploymentType } from '../../../src/technician/dto';

describe('TechnicianController', () => {
  let controller: TechnicianController;
  let technicianService: TechnicianService;

  const mockUser = {
    tenantId: 'tenant-123',
  };

  const mockTechnicianProfile = {
    id: 'technician-123',
    user_id: 'user-123',
    employee_id: 'EMP-001',
    status: TechnicianStatus.ACTIVE,
    position: 'Senior Technician',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TechnicianController],
      providers: [
        {
          provide: TechnicianService,
          useValue: {
            createTechnicianProfile: jest.fn(),
            getTechnicianProfiles: jest.fn(),
            getTechnicianProfile: jest.fn(),
            updateTechnicianProfile: jest.fn(),
            deleteTechnicianProfile: jest.fn(),
            getDashboardStats: jest.fn(),
            getPerformanceMetrics: jest.fn(),
            getAvailabilityData: jest.fn(),
            getTechnicianAvailability: jest.fn(),
            setAvailability: jest.fn(),
            getAvailableTechnicians: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<TechnicianController>(TechnicianController);
    technicianService = module.get<TechnicianService>(TechnicianService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createTechnicianProfile', () => {
    const createDto = {
      user_id: 'user-123',
      hire_date: new Date().toISOString(),
      position: 'Senior Technician',
      employment_type: EmploymentType.FULL_TIME,
    };

    it('should create technician profile successfully', async () => {
      jest.spyOn(technicianService, 'createTechnicianProfile').mockResolvedValue(mockTechnicianProfile as any);

      const result = await controller.createTechnicianProfile({ tenantId: mockUser.tenantId } as any, createDto);

      expect(result).toEqual(mockTechnicianProfile);
      expect(technicianService.createTechnicianProfile).toHaveBeenCalledWith(
        mockUser.tenantId,
        createDto
      );
    });
  });

  describe('getTechnicianProfiles', () => {
    it('should return paginated technician profiles', async () => {
      const mockResponse = {
        data: [mockTechnicianProfile],
        pagination: {
          page: 1,
          limit: 20,
          total: 1,
          totalPages: 1,
        },
      };

      jest.spyOn(technicianService, 'getTechnicianProfiles').mockResolvedValue(mockResponse as any);

      const result = await controller.getTechnicianProfiles(
        { tenantId: mockUser.tenantId } as any,
        {}
      );

      expect(result).toEqual(mockResponse);
      expect(technicianService.getTechnicianProfiles).toHaveBeenCalledWith(mockUser.tenantId, {});
    });
  });

  describe('getTechnicianProfile', () => {
    it('should return technician profile by ID', async () => {
      jest.spyOn(technicianService, 'getTechnicianProfile').mockResolvedValue(mockTechnicianProfile as any);

      const result = await controller.getTechnicianProfile(
        { tenantId: mockUser.tenantId } as any,
        'technician-123'
      );

      expect(result).toEqual(mockTechnicianProfile);
      expect(technicianService.getTechnicianProfile).toHaveBeenCalledWith(
        mockUser.tenantId,
        'technician-123'
      );
    });
  });

  describe('updateTechnicianProfile', () => {
    const updateDto = {
      position: 'Lead Technician',
    };

    it('should update technician profile successfully', async () => {
      jest.spyOn(technicianService, 'updateTechnicianProfile').mockResolvedValue({
        ...mockTechnicianProfile,
        ...updateDto,
      } as any);

      const result = await controller.updateTechnicianProfile(
        { tenantId: mockUser.tenantId } as any,
        'technician-123',
        updateDto
      );

      expect(result.position).toBe('Lead Technician');
      expect(technicianService.updateTechnicianProfile).toHaveBeenCalledWith(
        mockUser.tenantId,
        'technician-123',
        updateDto
      );
    });
  });

  describe('deleteTechnicianProfile', () => {
    it('should delete technician profile successfully', async () => {
      jest.spyOn(technicianService, 'deleteTechnicianProfile').mockResolvedValue(undefined);

      await controller.deleteTechnicianProfile(
        { tenantId: mockUser.tenantId } as any,
        'technician-123'
      );

      expect(technicianService.deleteTechnicianProfile).toHaveBeenCalledWith(
        mockUser.tenantId,
        'technician-123'
      );
    });
  });

  describe('getDashboardStats', () => {
    it('should return dashboard statistics', async () => {
      const mockStats = {
        totalTechnicians: 10,
        activeTechnicians: 8,
        onLeaveTechnicians: 1,
        terminatedTechnicians: 1,
      };

      jest.spyOn(technicianService, 'getDashboardStats').mockResolvedValue(mockStats as any);

      const result = await controller.getDashboardStats({ tenantId: mockUser.tenantId } as any);

      expect(result).toEqual(mockStats);
      expect(technicianService.getDashboardStats).toHaveBeenCalledWith(mockUser.tenantId);
    });
  });

  describe('getPerformanceMetrics', () => {
    it('should return performance metrics', async () => {
      const mockMetrics = {
        metrics: [],
        averageCompletionRate: 0,
      };

      jest.spyOn(technicianService, 'getPerformanceMetrics').mockResolvedValue(mockMetrics as any);

      const result = await controller.getPerformanceMetrics({ tenantId: mockUser.tenantId } as any);

      expect(result).toEqual(mockMetrics);
      expect(technicianService.getPerformanceMetrics).toHaveBeenCalledWith(mockUser.tenantId);
    });
  });

  describe('getAvailabilityData', () => {
    it('should return availability data', async () => {
      const mockAvailability = {
        technicians: [],
        totalAvailable: 0,
      };

      jest.spyOn(technicianService, 'getAvailabilityData').mockResolvedValue(mockAvailability as any);

      const result = await controller.getAvailabilityData({ tenantId: mockUser.tenantId } as any);

      expect(result).toEqual(mockAvailability);
      expect(technicianService.getAvailabilityData).toHaveBeenCalledWith(mockUser.tenantId);
    });
  });

  describe('getTechnicianAvailability', () => {
    it('should return technician availability', async () => {
      const mockAvailability = {
        technician_id: 'technician-123',
        availability_patterns: [],
        schedules: [],
      };

      jest.spyOn(technicianService, 'getTechnicianAvailability').mockResolvedValue(mockAvailability as any);

      const result = await controller.getTechnicianAvailability(
        { tenantId: mockUser.tenantId } as any,
        'technician-123',
        {}
      );

      expect(result).toEqual(mockAvailability);
      expect(technicianService.getTechnicianAvailability).toHaveBeenCalledWith(
        mockUser.tenantId,
        'technician-123',
        undefined,
        undefined
      );
    });
  });

  describe('setAvailability', () => {
    const availabilityDto = {
      day_of_week: 1,
      start_time: '09:00:00',
      end_time: '17:00:00',
      is_active: true,
    };

    it('should set availability successfully', async () => {
      jest.spyOn(technicianService, 'setAvailability').mockResolvedValue({ id: 'availability-123' } as any);

      const result = await controller.setAvailability(
        { tenantId: mockUser.tenantId } as any,
        'technician-123',
        availabilityDto
      );

      expect(result).toBeDefined();
      expect(technicianService.setAvailability).toHaveBeenCalledWith(
        mockUser.tenantId,
        'technician-123',
        availabilityDto.day_of_week,
        availabilityDto.start_time,
        availabilityDto.end_time,
        true
      );
    });
  });

  describe('getAvailableTechnicians', () => {
    it('should return available technicians', async () => {
      const mockAvailable = [{ id: 'technician-123', is_available: true }];

      jest.spyOn(technicianService, 'getAvailableTechnicians').mockResolvedValue(mockAvailable as any);

      const result = await controller.getAvailableTechnicians(
        { tenantId: mockUser.tenantId } as any,
        {
          date: '2025-01-15',
          start_time: '09:00:00',
          end_time: '17:00:00',
        }
      );

      expect(result).toEqual(mockAvailable);
      expect(technicianService.getAvailableTechnicians).toHaveBeenCalledWith(
        mockUser.tenantId,
        '2025-01-15',
        '09:00:00',
        '17:00:00'
      );
    });
  });
});

