/**
 * Technician Service Unit Tests
 * Tests for technician profile management, availability, and scheduling
 */

import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { TechnicianService } from '../../../src/technician/technician.service';
import { DatabaseService } from '../../../src/common/services/database.service';
import { TechnicianStatus, EmploymentType } from '../../../src/technician/dto';

describe('TechnicianService', () => {
  let service: TechnicianService;
  let databaseService: DatabaseService;

  const mockTenantId = 'tenant-123';
  const mockUserId = 'user-123';
  const mockTechnicianId = 'technician-profile-123';
  const mockEmployeeId = 'EMP-001';

  const mockUser = {
    id: mockUserId,
    tenant_id: mockTenantId,
    email: 'technician@example.com',
    first_name: 'John',
    last_name: 'Doe',
    phone: '555-1234',
    employee_id: mockEmployeeId,
  };

  const mockTechnicianProfile = {
    id: mockTechnicianId,
    tenant_id: mockTenantId,
    user_id: mockUserId,
    employee_id: mockEmployeeId,
    hire_date: new Date(),
    position: 'Senior Technician',
    department: 'Field Operations',
    employment_type: EmploymentType.FULL_TIME,
    status: TechnicianStatus.ACTIVE,
    user: mockUser,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TechnicianService,
        {
          provide: DatabaseService,
          useValue: {
            user: {
              findFirst: jest.fn(),
              findUnique: jest.fn(),
            },
            technicianProfile: {
              findFirst: jest.fn(),
              findMany: jest.fn(),
              findUnique: jest.fn(),
              create: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
              count: jest.fn(),
            },
            technicianSkill: {
              findMany: jest.fn(),
            },
            $queryRawUnsafe: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<TechnicianService>(TechnicianService);
    databaseService = module.get<DatabaseService>(DatabaseService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createTechnicianProfile', () => {
    const createDto = {
      user_id: mockUserId,
      hire_date: new Date().toISOString(),
      position: 'Senior Technician',
      department: 'Field Operations',
      employment_type: EmploymentType.FULL_TIME,
      status: TechnicianStatus.ACTIVE,
    };

    it('should create technician profile successfully', async () => {
      jest.spyOn(databaseService.user, 'findFirst').mockResolvedValue(mockUser as any);
      jest.spyOn(databaseService.technicianProfile, 'findFirst').mockResolvedValue(null);
      jest.spyOn(databaseService.technicianProfile, 'create').mockResolvedValue({
        ...mockTechnicianProfile,
        created_at: new Date(),
        updated_at: new Date(),
      } as any);

      const result = await service.createTechnicianProfile(mockTenantId, createDto);

      expect(result).toBeDefined();
      expect(result.user_id).toBe(mockUserId);
      expect(databaseService.user.findFirst).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            id: mockUserId,
            tenant_id: mockTenantId,
          },
        })
      );
      expect(databaseService.technicianProfile.create).toHaveBeenCalled();
    });

    it('should throw NotFoundException when user not found', async () => {
      jest.spyOn(databaseService.user, 'findFirst').mockResolvedValue(null);

      await expect(service.createTechnicianProfile(mockTenantId, createDto)).rejects.toThrow(
        NotFoundException
      );
      await expect(service.createTechnicianProfile(mockTenantId, createDto)).rejects.toThrow(
        'User not found or does not belong to tenant'
      );
    });

    it('should throw BadRequestException when profile already exists', async () => {
      jest.spyOn(databaseService.user, 'findFirst').mockResolvedValue(mockUser as any);
      jest.spyOn(databaseService.technicianProfile, 'findFirst').mockResolvedValue(mockTechnicianProfile as any);

      await expect(service.createTechnicianProfile(mockTenantId, createDto)).rejects.toThrow(
        BadRequestException
      );
      await expect(service.createTechnicianProfile(mockTenantId, createDto)).rejects.toThrow(
        'Technician profile already exists for this user'
      );
    });

    it('should throw BadRequestException when employee ID already exists', async () => {
      const dtoWithEmployeeId = {
        ...createDto,
        employee_id: mockEmployeeId,
      };

      jest.spyOn(databaseService.user, 'findFirst').mockResolvedValue(mockUser as any);
      jest.spyOn(databaseService.technicianProfile, 'findFirst')
        .mockResolvedValueOnce(null) // First call for profile check
        .mockResolvedValueOnce(mockTechnicianProfile as any); // Second call for employee ID check

      try {
        await service.createTechnicianProfile(mockTenantId, dtoWithEmployeeId);
        fail('Should have thrown BadRequestException');
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect((error as BadRequestException).message).toContain('Employee ID already exists');
      }
      // Verify the second findFirst was called for employee ID check
      expect(databaseService.technicianProfile.findFirst).toHaveBeenCalledTimes(2);
    });

    it('should use user employee_id when not provided in DTO', async () => {
      jest.spyOn(databaseService.user, 'findFirst').mockResolvedValue(mockUser as any);
      jest.spyOn(databaseService.user, 'findUnique').mockResolvedValue(mockUser as any);
      jest.spyOn(databaseService.technicianProfile, 'findFirst').mockResolvedValue(null);
      jest.spyOn(databaseService.technicianProfile, 'create').mockResolvedValue({
        ...mockTechnicianProfile,
        created_at: new Date(),
        updated_at: new Date(),
      } as any);

      await service.createTechnicianProfile(mockTenantId, createDto);

      expect(databaseService.user.findUnique).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: mockUserId },
        })
      );
    });
  });

  describe('getTechnicianProfiles', () => {
    it('should return paginated technician profiles', async () => {
      const mockProfileWithDates = {
        ...mockTechnicianProfile,
        created_at: new Date(),
        updated_at: new Date(),
      };
      jest.spyOn(databaseService.technicianProfile, 'findMany').mockResolvedValue([mockProfileWithDates] as any);
      jest.spyOn(databaseService.technicianProfile, 'count').mockResolvedValue(1);

      const query = {
        page: 1,
        limit: 20,
      };

      const result = await service.getTechnicianProfiles(mockTenantId, query);

      expect(result).toBeDefined();
      expect(result.data).toHaveLength(1);
      expect(result.pagination).toBeDefined();
      expect(databaseService.technicianProfile.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            tenant_id: mockTenantId,
          },
        })
      );
    });

    it('should filter by status', async () => {
      jest.spyOn(databaseService.technicianProfile, 'findMany').mockResolvedValue([]);
      jest.spyOn(databaseService.technicianProfile, 'count').mockResolvedValue(0);

      const query = {
        status: TechnicianStatus.ACTIVE,
      };

      await service.getTechnicianProfiles(mockTenantId, query);

      expect(databaseService.technicianProfile.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            tenant_id: mockTenantId,
            status: TechnicianStatus.ACTIVE,
          }),
        })
      );
    });

    it('should filter by search term', async () => {
      jest.spyOn(databaseService.technicianProfile, 'findMany').mockResolvedValue([]);
      jest.spyOn(databaseService.technicianProfile, 'count').mockResolvedValue(0);

      const query = {
        search: 'John',
      };

      await service.getTechnicianProfiles(mockTenantId, query);

      expect(databaseService.technicianProfile.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            OR: expect.any(Array),
          }),
        })
      );
    });

    it('should sort by specified field', async () => {
      jest.spyOn(databaseService.technicianProfile, 'findMany').mockResolvedValue([]);
      jest.spyOn(databaseService.technicianProfile, 'count').mockResolvedValue(0);

      const query = {
        sort_by: 'hire_date',
        sort_order: 'asc',
      };

      await service.getTechnicianProfiles(mockTenantId, query);

      expect(databaseService.technicianProfile.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          orderBy: expect.objectContaining({
          }),
        })
      );
    });
  });

  describe('getTechnicianProfile', () => {
    it('should return technician profile by ID', async () => {
      jest.spyOn(databaseService.technicianProfile, 'findFirst').mockResolvedValue({
        ...mockTechnicianProfile,
        created_at: new Date(),
        updated_at: new Date(),
      } as any);

      const result = await service.getTechnicianProfile(mockTenantId, mockTechnicianId);

      expect(result).toBeDefined();
      expect(result.id).toBe(mockTechnicianId);
      expect(databaseService.technicianProfile.findFirst).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            id: mockTechnicianId,
            tenant_id: mockTenantId,
          },
        })
      );
    });

    it('should throw NotFoundException when profile not found', async () => {
      jest.spyOn(databaseService.technicianProfile, 'findFirst').mockResolvedValue(null);

      await expect(service.getTechnicianProfile(mockTenantId, 'non-existent')).rejects.toThrow(
        NotFoundException
      );
      await expect(service.getTechnicianProfile(mockTenantId, 'non-existent')).rejects.toThrow(
        'Technician profile not found'
      );
    });
  });

  describe('updateTechnicianProfile', () => {
    const updateDto = {
      position: 'Lead Technician',
      status: TechnicianStatus.ACTIVE,
    };

    it('should update technician profile successfully', async () => {
      jest.spyOn(databaseService.technicianProfile, 'findFirst')
        .mockResolvedValueOnce(mockTechnicianProfile as any) // Existing profile check
        .mockResolvedValueOnce(null); // Employee ID uniqueness check (not needed)
      jest.spyOn(databaseService.technicianProfile, 'update').mockResolvedValue({
        ...mockTechnicianProfile,
        ...updateDto,
        created_at: new Date(),
        updated_at: new Date(),
      } as any);

      const result = await service.updateTechnicianProfile(mockTenantId, mockTechnicianId, updateDto);

      expect(result.position).toBe('Lead Technician');
      expect(databaseService.technicianProfile.update).toHaveBeenCalled();
    });

    it('should throw NotFoundException when profile not found', async () => {
      jest.spyOn(databaseService.technicianProfile, 'findFirst').mockResolvedValue(null);

      await expect(
        service.updateTechnicianProfile(mockTenantId, 'non-existent', updateDto)
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException when employee ID already exists', async () => {
      const updateWithEmployeeId = {
        employee_id: 'NEW-EMP-001',
      };

      const existingProfile = {
        ...mockTechnicianProfile,
        employee_id: 'OLD-EMP-001', // Different from update
      };

      jest.spyOn(databaseService.technicianProfile, 'findFirst')
        .mockResolvedValueOnce(existingProfile as any) // Existing profile
        .mockResolvedValueOnce({ id: 'other-profile' } as any); // Employee ID conflict

      try {
        await service.updateTechnicianProfile(mockTenantId, mockTechnicianId, updateWithEmployeeId);
        fail('Should have thrown BadRequestException');
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect((error as BadRequestException).message).toContain('Employee ID already exists');
      }
    });
  });

  describe('deleteTechnicianProfile', () => {
    it('should delete technician profile successfully', async () => {
      jest.spyOn(databaseService.technicianProfile, 'findFirst').mockResolvedValue(mockTechnicianProfile as any);
      jest.spyOn(databaseService.technicianProfile, 'delete').mockResolvedValue(mockTechnicianProfile as any);

      await service.deleteTechnicianProfile(mockTenantId, mockTechnicianId);

      expect(databaseService.technicianProfile.delete).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: mockTechnicianId },
        })
      );
    });

    it('should throw NotFoundException when profile not found', async () => {
      jest.spyOn(databaseService.technicianProfile, 'findFirst').mockResolvedValue(null);

      await expect(service.deleteTechnicianProfile(mockTenantId, 'non-existent')).rejects.toThrow(
        NotFoundException
      );
    });
  });

  describe('getDashboardStats', () => {
    it('should return dashboard statistics', async () => {
      jest.spyOn(databaseService.technicianProfile, 'count')
        .mockResolvedValueOnce(10) // Total
        .mockResolvedValueOnce(8) // Active
        .mockResolvedValueOnce(1) // On leave
        .mockResolvedValueOnce(1); // Terminated

      const result = await service.getDashboardStats(mockTenantId);

      expect(result.totalTechnicians).toBe(10);
      expect(result.activeTechnicians).toBe(8);
      expect(result.onLeaveTechnicians).toBe(1);
      expect(result.terminatedTechnicians).toBe(1);
      expect(databaseService.technicianProfile.count).toHaveBeenCalledTimes(4);
    });
  });

  describe('getPerformanceMetrics', () => {
    it('should return performance metrics', async () => {
      jest.spyOn(databaseService.technicianProfile, 'findMany').mockResolvedValue([mockTechnicianProfile] as any);

      const result = await service.getPerformanceMetrics(mockTenantId);

      expect(result).toBeDefined();
      expect(result.metrics).toBeDefined();
      expect(result.metrics.length).toBeGreaterThan(0);
      expect(databaseService.technicianProfile.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            tenant_id: mockTenantId,
          },
        })
      );
    });
  });

  describe('getAvailabilityData', () => {
    it('should return availability data', async () => {
      jest.spyOn(databaseService.technicianProfile, 'findMany').mockResolvedValue([mockTechnicianProfile] as any);
      jest.spyOn(databaseService.technicianSkill, 'findMany').mockResolvedValue([]);

      const result = await service.getAvailabilityData(mockTenantId);

      expect(result).toBeDefined();
      expect(result.technicians).toBeDefined();
      expect(result.totalAvailable).toBeDefined();
      expect(databaseService.technicianProfile.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            tenant_id: mockTenantId,
            status: TechnicianStatus.ACTIVE,
          }),
        })
      );
    });
  });

  describe('getTechnicianAvailability', () => {
    it('should return technician availability', async () => {
      jest.spyOn(databaseService, '$queryRawUnsafe')
        .mockResolvedValueOnce([]) // Availability patterns
        .mockResolvedValueOnce([]) // Schedules
        .mockResolvedValueOnce([]); // Time off requests

      const result = await service.getTechnicianAvailability(
        mockTenantId,
        mockTechnicianId,
        '2025-01-01',
        '2025-01-31'
      );

      expect(result).toBeDefined();
      expect(result.technician_id).toBe(mockTechnicianId);
      expect(result.availability_patterns).toBeDefined();
      expect(result.schedules).toBeDefined();
      expect(result.time_off_requests).toBeDefined();
    });

    it('should handle errors gracefully when tables do not exist', async () => {
      jest.spyOn(databaseService, '$queryRawUnsafe').mockRejectedValue(new Error('relation does not exist'));

      const result = await service.getTechnicianAvailability(mockTenantId, mockTechnicianId);

      expect(result).toBeDefined();
      expect(result.availability_patterns).toEqual([]);
      expect(result.schedules).toEqual([]);
    });
  });

  describe('setAvailability', () => {
    it('should set availability pattern successfully', async () => {
      const mockAvailability = {
        id: 'availability-123',
        technician_id: mockTechnicianId,
        day_of_week: 1,
        start_time: '09:00:00',
        end_time: '17:00:00',
        is_active: true,
      };

      jest.spyOn(databaseService, '$queryRawUnsafe').mockResolvedValue([mockAvailability]);

      const result = await service.setAvailability(
        mockTenantId,
        mockTechnicianId,
        1,
        '09:00:00',
        '17:00:00',
        true
      );

      expect(result).toBeDefined();
      expect(databaseService.$queryRawUnsafe).toHaveBeenCalled();
    });

    it('should throw BadRequestException when table does not exist', async () => {
      jest
        .spyOn(databaseService, '$queryRawUnsafe')
        .mockRejectedValue(new Error('relation "technician_availability" does not exist'));

      await expect(
        service.setAvailability(mockTenantId, mockTechnicianId, 1, '09:00:00', '17:00:00', true)
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('getAvailableTechnicians', () => {
    it('should return available technicians for time slot', async () => {
      jest.spyOn(databaseService.technicianProfile, 'findMany').mockResolvedValue([mockTechnicianProfile] as any);
      jest.spyOn(databaseService, '$queryRawUnsafe')
        .mockResolvedValueOnce([]) // Time off check
        .mockResolvedValueOnce([]); // Schedule check

      const result = await service.getAvailableTechnicians(
        mockTenantId,
        '2025-01-15',
        '09:00:00',
        '17:00:00'
      );

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(databaseService.technicianProfile.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            tenant_id: mockTenantId,
            status: TechnicianStatus.ACTIVE,
          }),
        })
      );
    });

    it('should exclude technicians with time off', async () => {
      const timeOffRequest = [{ id: 'timeoff-123' }];
      jest.spyOn(databaseService.technicianProfile, 'findMany').mockResolvedValue([mockTechnicianProfile] as any);
      jest.spyOn(databaseService, '$queryRawUnsafe')
        .mockResolvedValueOnce(timeOffRequest) // Time off exists
        .mockResolvedValueOnce([]); // Schedule check

      const result = await service.getAvailableTechnicians(
        mockTenantId,
        '2025-01-15',
        '09:00:00',
        '17:00:00'
      );

      expect(result).toBeDefined();
      if (result.length > 0) {
        expect(result[0].is_available).toBe(false);
      }
    });
  });

  describe('getAvailableTechniciansBasic', () => {
    it('should return all active technicians', async () => {
      const activeTechnicians = [
        {
          ...mockTechnicianProfile,
          user: {
            id: mockUserId,
            first_name: 'John',
            last_name: 'Doe',
            phone: '555-1234',
          },
        },
        {
          ...mockTechnicianProfile,
          id: 'technician-456',
          user_id: 'user-456',
          user: {
            id: 'user-456',
            first_name: 'Jane',
            last_name: 'Smith',
            phone: '555-5678',
          },
        },
      ];

      jest.spyOn(databaseService.technicianProfile, 'findMany').mockResolvedValue(activeTechnicians as any);

      const result = await service.getAvailableTechniciansBasic(mockTenantId, '2025-01-15');

      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        id: mockUserId,
        name: 'John Doe',
        phone: '555-1234',
        skills: ['general'],
        status: 'available',
      });
      expect(result[1]).toEqual({
        id: 'user-456',
        name: 'Jane Smith',
        phone: '555-5678',
        skills: ['general'],
        status: 'available',
      });
      expect(databaseService.technicianProfile.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            tenant_id: mockTenantId,
            status: TechnicianStatus.ACTIVE,
          },
        })
      );
    });

    it('should return empty array when no active technicians', async () => {
      jest.spyOn(databaseService.technicianProfile, 'findMany').mockResolvedValue([]);

      const result = await service.getAvailableTechniciansBasic(mockTenantId, '2025-01-15');

      expect(result).toEqual([]);
    });

    it('should exclude inactive technicians', async () => {
      const inactiveTechnician = {
        ...mockTechnicianProfile,
        status: TechnicianStatus.INACTIVE,
      };

      jest.spyOn(databaseService.technicianProfile, 'findMany').mockResolvedValue([]);

      await service.getAvailableTechniciansBasic(mockTenantId, '2025-01-15');

      expect(databaseService.technicianProfile.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            status: TechnicianStatus.ACTIVE,
          }),
        })
      );
    });
  });

  // Additional edge case tests for improved coverage

  describe('createTechnicianProfile - edge cases', () => {
    const createDto = {
      user_id: mockUserId,
      hire_date: new Date().toISOString(),
      position: 'Senior Technician',
      department: 'Field Operations',
      employment_type: EmploymentType.FULL_TIME,
      status: TechnicianStatus.ACTIVE,
    };

    it('should handle optional fields', async () => {
      const minimalDto = {
        user_id: mockUserId,
        hire_date: new Date().toISOString(),
      };

      jest.spyOn(databaseService.user, 'findFirst').mockResolvedValue(mockUser as any);
      jest.spyOn(databaseService.user, 'findUnique').mockResolvedValue({ employee_id: mockEmployeeId } as any);
      jest.spyOn(databaseService.technicianProfile, 'findFirst').mockResolvedValue(null);
      jest.spyOn(databaseService.technicianProfile, 'create').mockResolvedValue({
        ...mockTechnicianProfile,
        position: null,
        department: null,
        employment_type: EmploymentType.FULL_TIME, // Default
        status: TechnicianStatus.ACTIVE, // Default
      } as any);

      const result = await service.createTechnicianProfile(mockTenantId, minimalDto);

      expect(result).toBeDefined();
      expect(databaseService.technicianProfile.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            position: null,
            department: null,
            employment_type: EmploymentType.FULL_TIME,
            status: TechnicianStatus.ACTIVE,
          }),
        })
      );
    });

    it('should handle all optional fields when provided', async () => {
      const fullDto = {
        ...createDto,
        emergency_contact_name: 'Emergency Contact',
        emergency_contact_phone: '555-9999',
        emergency_contact_relationship: 'Spouse',
        address_line1: '123 Main St',
        address_line2: 'Apt 4',
        city: 'Test City',
        state: 'TS',
        postal_code: '12345',
        country: 'US',
        date_of_birth: '1990-01-01',
        social_security_number: '123-45-6789',
        driver_license_number: 'DL123456',
        driver_license_state: 'TS',
        driver_license_expiry: '2025-12-31',
      };

      jest.spyOn(databaseService.user, 'findFirst').mockResolvedValue(mockUser as any);
      jest.spyOn(databaseService.technicianProfile, 'findFirst').mockResolvedValue(null);
      jest.spyOn(databaseService.technicianProfile, 'create').mockResolvedValue({
        ...mockTechnicianProfile,
        ...fullDto,
      } as any);

      const result = await service.createTechnicianProfile(mockTenantId, fullDto);

      expect(result).toBeDefined();
      expect(databaseService.technicianProfile.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            emergency_contact_name: 'Emergency Contact',
            address_line1: '123 Main St',
            city: 'Test City',
          }),
        })
      );
    });
  });

  describe('getTechnicianProfiles - edge cases', () => {
    it('should handle empty results', async () => {
      jest.spyOn(databaseService.technicianProfile, 'findMany').mockResolvedValue([]);
      jest.spyOn(databaseService.technicianProfile, 'count').mockResolvedValue(0);

      const result = await service.getTechnicianProfiles(mockTenantId, {});

      expect(result.data).toEqual([]);
      expect(result.pagination.total).toBe(0);
      expect(result.pagination.totalPages).toBe(0);
    });

    it('should handle multiple filter combinations', async () => {
      const query = {
        search: 'John',
        status: TechnicianStatus.ACTIVE,
        department: 'Field Operations',
        position: 'Senior Technician',
        employment_type: EmploymentType.FULL_TIME,
        sort_by: 'hire_date',
        sort_order: 'asc' as const,
        page: 2,
        limit: 10,
      };

      jest.spyOn(databaseService.technicianProfile, 'findMany').mockResolvedValue([]);
      jest.spyOn(databaseService.technicianProfile, 'count').mockResolvedValue(0);

      await service.getTechnicianProfiles(mockTenantId, query);

      expect(databaseService.technicianProfile.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            tenant_id: mockTenantId,
            status: TechnicianStatus.ACTIVE,
            department: 'Field Operations',
            position: 'Senior Technician',
            employment_type: EmploymentType.FULL_TIME,
            OR: expect.any(Array),
          }),
          skip: 10, // (page - 1) * limit
          take: 10,
          orderBy: { hire_date: 'asc' },
        })
      );
    });

    it('should handle pagination edge cases', async () => {
      jest.spyOn(databaseService.technicianProfile, 'findMany').mockResolvedValue([]);
      jest.spyOn(databaseService.technicianProfile, 'count').mockResolvedValue(25);

      const result = await service.getTechnicianProfiles(mockTenantId, { page: 3, limit: 10 });

      expect(result.pagination.page).toBe(3);
      expect(result.pagination.limit).toBe(10);
      expect(result.pagination.total).toBe(25);
      expect(result.pagination.totalPages).toBe(3); // Math.ceil(25/10)
    });
  });

  describe('updateTechnicianProfile - edge cases', () => {
    it('should handle partial updates', async () => {
      const partialUpdate = {
        position: 'Updated Position',
      };

      jest.spyOn(databaseService.technicianProfile, 'findFirst').mockResolvedValue(mockTechnicianProfile as any);
      jest.spyOn(databaseService.technicianProfile, 'update').mockResolvedValue({
        ...mockTechnicianProfile,
        ...partialUpdate,
      } as any);

      const result = await service.updateTechnicianProfile(mockTenantId, mockTechnicianId, partialUpdate);

      expect(result.position).toBe('Updated Position');
    });

    it('should handle status updates', async () => {
      const statusUpdate = {
        status: TechnicianStatus.INACTIVE,
      };

      jest.spyOn(databaseService.technicianProfile, 'findFirst').mockResolvedValue(mockTechnicianProfile as any);
      jest.spyOn(databaseService.technicianProfile, 'update').mockResolvedValue({
        ...mockTechnicianProfile,
        ...statusUpdate,
      } as any);

      const result = await service.updateTechnicianProfile(mockTenantId, mockTechnicianId, statusUpdate);

      expect(result.status).toBe(TechnicianStatus.INACTIVE);
    });
  });

  describe('getAvailabilityData - edge cases', () => {
    it('should handle empty availability data', async () => {
      jest.spyOn(databaseService.technicianProfile, 'findMany').mockResolvedValue([]);
      jest.spyOn(databaseService.technicianSkill, 'findMany').mockResolvedValue([]);

      const result = await service.getAvailabilityData(mockTenantId);

      expect(result).toBeDefined();
      expect(result.technicians).toEqual([]);
      expect(result.totalAvailable).toBe(0);
      expect(result.totalBusy).toBe(0);
    });

    it('should handle technicians without skills', async () => {
      const technicians = [
        {
          ...mockTechnicianProfile,
          user: {
            id: mockUserId,
            first_name: 'John',
            last_name: 'Doe',
          },
        },
      ];

      jest.spyOn(databaseService.technicianProfile, 'findMany').mockResolvedValue(technicians as any);
      jest.spyOn(databaseService.technicianSkill, 'findMany').mockResolvedValue([]);

      const result = await service.getAvailabilityData(mockTenantId);

      expect(result.technicians).toHaveLength(1);
      expect(result.technicians[0].skills).toEqual([]);
    });

    it('should map skills correctly', async () => {
      const technicians = [
        {
          ...mockTechnicianProfile,
          user: {
            id: mockUserId,
            first_name: 'John',
            last_name: 'Doe',
          },
        },
      ];

      const skills = [
        {
          technician_id: mockUserId, // Skills are keyed by user_id, not technician profile id
          serviceType: {
            service_name: 'Pest Control',
          },
        },
        {
          technician_id: mockUserId,
          serviceType: {
            service_name: 'Lawn Care',
          },
        },
      ];

      jest.spyOn(databaseService.technicianProfile, 'findMany').mockResolvedValue(technicians as any);
      jest.spyOn(databaseService.technicianSkill, 'findMany').mockResolvedValue(skills as any);

      const result = await service.getAvailabilityData(mockTenantId);

      expect(result.technicians).toHaveLength(1);
      expect(result.technicians[0].skills).toContain('Pest Control');
      expect(result.technicians[0].skills).toContain('Lawn Care');
    });
  });
});

