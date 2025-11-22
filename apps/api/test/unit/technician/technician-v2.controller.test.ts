/**
 * Technician V2 Controller Unit Tests
 * Tests for V2 API endpoints with enhanced features and backward compatibility
 */

import { Test, TestingModule } from '@nestjs/testing';
import { Reflector } from '@nestjs/core';
import { TechnicianV2Controller } from '../../../src/technician/technician-v2.controller';
import { TechnicianService } from '../../../src/technician/technician.service';
import { IdempotencyService } from '../../../src/common/services/idempotency.service';
import { TechnicianStatus, EmploymentType } from '../../../src/technician/dto';

describe('TechnicianV2Controller', () => {
  let controller: TechnicianV2Controller;
  let technicianService: TechnicianService;

  const mockUser = {
    tenantId: 'tenant-123',
  };

  const mockTechnicianProfile = {
    id: 'technician-123',
    user_id: 'user-123',
    status: TechnicianStatus.ACTIVE,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TechnicianV2Controller],
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
        {
          provide: Reflector,
          useValue: {
            get: jest.fn(),
          },
        },
        {
          provide: IdempotencyService,
          useValue: {
            checkKey: jest.fn(),
            storeKey: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<TechnicianV2Controller>(TechnicianV2Controller);
    technicianService = module.get<TechnicianService>(TechnicianService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createTechnicianProfile', () => {
    const createDto = {
      user_id: 'user-123',
      hire_date: new Date().toISOString(),
      employment_type: EmploymentType.FULL_TIME,
    };

    it('should create technician profile with V2 response format', async () => {
      jest.spyOn(technicianService, 'createTechnicianProfile').mockResolvedValue(mockTechnicianProfile as any);

      const result = await controller.createTechnicianProfile(
        { tenantId: mockUser.tenantId } as any,
        createDto
      );

      expect(result).toHaveProperty('data');
      expect(result).toHaveProperty('meta');
      expect(result.meta.version).toBe('2.0');
      expect(result.data).toEqual(mockTechnicianProfile);
    });
  });

  describe('getTechnicianProfiles', () => {
    it('should return technician profiles with V2 response format', async () => {
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

      expect(result).toHaveProperty('data');
      expect(result).toHaveProperty('meta');
      expect(result.meta.version).toBe('2.0');
      expect(result.data).toEqual(mockResponse);
    });
  });

  describe('getTechnicianProfile', () => {
    it('should return technician profile with V2 response format', async () => {
      jest.spyOn(technicianService, 'getTechnicianProfile').mockResolvedValue(mockTechnicianProfile as any);

      const result = await controller.getTechnicianProfile(
        { tenantId: mockUser.tenantId } as any,
        'technician-123'
      );

      expect(result).toHaveProperty('data');
      expect(result).toHaveProperty('meta');
      expect(result.meta.version).toBe('2.0');
      expect(result.data).toEqual(mockTechnicianProfile);
    });
  });

  describe('updateTechnicianProfile', () => {
    const updateDto = {
      position: 'Lead Technician',
    };

    it('should update technician profile with V2 response format', async () => {
      jest.spyOn(technicianService, 'updateTechnicianProfile').mockResolvedValue({
        ...mockTechnicianProfile,
        ...updateDto,
      } as any);

      const result = await controller.updateTechnicianProfile(
        { tenantId: mockUser.tenantId } as any,
        'technician-123',
        updateDto
      );

      expect(result).toHaveProperty('data');
      expect(result).toHaveProperty('meta');
      expect(result.meta.version).toBe('2.0');
      expect(result.data.position).toBe('Lead Technician');
    });
  });

  describe('deleteTechnicianProfile', () => {
    it('should delete technician profile with V2 response format', async () => {
      jest.spyOn(technicianService, 'deleteTechnicianProfile').mockResolvedValue(undefined);

      const result = await controller.deleteTechnicianProfile(
        { tenantId: mockUser.tenantId } as any,
        'technician-123'
      );

      expect(result).toHaveProperty('success', true);
      expect(result).toHaveProperty('meta');
      expect(result.meta.version).toBe('2.0');
    });
  });

  describe('getAvailableTechnicians', () => {
    it('should return available technicians with V2 response format', async () => {
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

      expect(result).toHaveProperty('data');
      expect(result).toHaveProperty('meta');
      expect(result.meta.version).toBe('2.0');
      expect(result.meta.count).toBe(1);
      expect(result.data).toEqual(mockAvailable);
    });
  });
});

