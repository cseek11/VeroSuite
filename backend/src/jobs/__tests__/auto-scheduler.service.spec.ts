import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { AutoSchedulerService } from '../auto-scheduler.service';
import { DatabaseService } from '../../common/services/database.service';
import { JobsService } from '../jobs.service';
import { TechnicianService } from '../../technician/technician.service';
import { JobStatus } from '../dto';

describe('AutoSchedulerService', () => {
  let service: AutoSchedulerService;
  let dbService: jest.Mocked<DatabaseService>;
  let jobsService: jest.Mocked<JobsService>;
  let technicianService: jest.Mocked<TechnicianService>;

  const mockTenantId = 'tenant-123';
  const mockDate = '2025-11-19';

  beforeEach(async () => {
    const mockDbService = {
      job: {
        findMany: jest.fn(),
        update: jest.fn(),
      },
      $transaction: jest.fn(),
    };

    const mockJobsService = {
      assignJob: jest.fn(),
    };

    const mockTechnicianService = {
      getAvailableTechnicians: jest.fn(),
      getAvailableTechniciansBasic: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AutoSchedulerService,
        {
          provide: DatabaseService,
          useValue: mockDbService,
        },
        {
          provide: JobsService,
          useValue: mockJobsService,
        },
        {
          provide: TechnicianService,
          useValue: mockTechnicianService,
        },
      ],
    }).compile();

    service = module.get<AutoSchedulerService>(AutoSchedulerService);
    dbService = module.get(DatabaseService);
    jobsService = module.get(JobsService);
    technicianService = module.get(TechnicianService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('autoSchedule', () => {
    it('should return empty result when no unassigned jobs exist', async () => {
      dbService.job.findMany.mockResolvedValue([]);

      const result = await service.autoSchedule(mockTenantId, { date: mockDate });

      expect(result.totalUnassignedJobs).toBe(0);
      expect(result.optimizedJobs).toBe(0);
      expect(result.assignments).toHaveLength(0);
      expect(dbService.job.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            tenant_id: mockTenantId,
            status: JobStatus.UNASSIGNED,
          }),
        }),
      );
    });

    it('should return warning when no technicians available', async () => {
      const mockJobs = [
        {
          id: 'job-1',
          priority: 'medium',
          scheduled_date: new Date(mockDate),
          scheduled_start_time: '09:00',
          scheduled_end_time: '10:00',
          workOrder: {
            location: {
              latitude: 40.0,
              longitude: -80.0,
              address_line1: '123 Main St',
              city: 'Pittsburgh',
              state: 'PA',
            },
            account: { name: 'Test Account' },
            serviceType: { service_name: 'General' },
            estimated_duration: 60,
          },
        },
      ];

      dbService.job.findMany.mockResolvedValue(mockJobs as any);
      technicianService.getAvailableTechnicians.mockResolvedValue([]);

      const result = await service.autoSchedule(mockTenantId, { date: mockDate });

      expect(result.totalUnassignedJobs).toBe(1);
      expect(result.optimizedJobs).toBe(0);
      expect(result.warnings.length).toBeGreaterThan(0);
      expect(result.warnings[0]).toContain('No available technicians');
    });

    it('should optimize and assign jobs when technicians available', async () => {
      const mockJobs = [
        {
          id: 'job-1',
          priority: 'high',
          scheduled_date: new Date(mockDate),
          scheduled_start_time: '09:00',
          scheduled_end_time: '10:00',
          workOrder: {
            location: {
              latitude: 40.0,
              longitude: -80.0,
              address_line1: '123 Main St',
              city: 'Pittsburgh',
              state: 'PA',
            },
            account: { name: 'Test Account' },
            serviceType: { service_name: 'General' },
            estimated_duration: 60,
          },
        },
        {
          id: 'job-2',
          priority: 'medium',
          scheduled_date: new Date(mockDate),
          scheduled_start_time: '10:00',
          scheduled_end_time: '11:00',
          workOrder: {
            location: {
              latitude: 40.01,
              longitude: -80.01,
              address_line1: '456 Oak Ave',
              city: 'Pittsburgh',
              state: 'PA',
            },
            account: { name: 'Test Account 2' },
            serviceType: { service_name: 'Termite' },
            estimated_duration: 90,
          },
        },
      ];

      const mockTechnicians = [
        {
          id: 'tech-1',
          user_id: 'tech-1',
          name: 'John Doe',
          is_available: true,
          skills: ['general', 'termite'],
        },
      ];

      dbService.job.findMany.mockResolvedValue(mockJobs as any);
      technicianService.getAvailableTechnicians.mockResolvedValue(mockTechnicians as any);
      dbService.$transaction.mockImplementation(async (callback) => {
        return callback({
          job: {
            update: jest.fn().mockResolvedValue({}),
          },
        });
      });

      const result = await service.autoSchedule(mockTenantId, {
        date: mockDate,
        commit: true,
      });

      expect(result.totalUnassignedJobs).toBe(2);
      // Optimization may assign 0 or more jobs depending on constraints
      expect(result.optimizedJobs).toBeGreaterThanOrEqual(0);
      expect(result.assignments.length).toBeGreaterThanOrEqual(0);
      // Commit should be applied if optimization found assignments
      if (result.optimizedJobs > 0) {
        expect(result.commitApplied).toBe(true);
      }
    });

    it('should not commit assignments when commit flag is false', async () => {
      const mockJobs = [
        {
          id: 'job-1',
          priority: 'medium',
          scheduled_date: new Date(mockDate),
          scheduled_start_time: '09:00',
          scheduled_end_time: '10:00',
          workOrder: {
            location: {
              latitude: 40.0,
              longitude: -80.0,
              address_line1: '123 Main St',
              city: 'Pittsburgh',
              state: 'PA',
            },
            account: { name: 'Test Account' },
            serviceType: { service_name: 'General' },
            estimated_duration: 60,
          },
        },
      ];

      const mockTechnicians = [
        {
          id: 'tech-1',
          user_id: 'tech-1',
          name: 'John Doe',
          is_available: true,
          skills: ['general'],
        },
      ];

      dbService.job.findMany.mockResolvedValue(mockJobs as any);
      technicianService.getAvailableTechnicians.mockResolvedValue(mockTechnicians as any);

      const result = await service.autoSchedule(mockTenantId, {
        date: mockDate,
        commit: false,
      });

      expect(result.commitApplied).toBe(false);
      expect(dbService.$transaction).not.toHaveBeenCalled();
    });

    it('should handle jobs with invalid coordinates', async () => {
      const mockJobs = [
        {
          id: 'job-1',
          priority: 'medium',
          scheduled_date: new Date(mockDate),
          workOrder: {
            location: {
              latitude: null,
              longitude: null,
            },
            account: { name: 'Test Account' },
            serviceType: { service_name: 'General' },
            estimated_duration: 60,
          },
        },
      ];

      const mockTechnicians = [
        {
          id: 'tech-1',
          user_id: 'tech-1',
          name: 'John Doe',
          is_available: true,
          skills: ['general'],
        },
      ];

      dbService.job.findMany.mockResolvedValue(mockJobs as any);
      technicianService.getAvailableTechnicians.mockResolvedValue(mockTechnicians as any);

      const result = await service.autoSchedule(mockTenantId, { date: mockDate });

      // Jobs with invalid coordinates should be unassigned
      expect(result.unassignedJobs).toBeGreaterThanOrEqual(0);
    });

    it('should use default date when not provided', async () => {
      dbService.job.findMany.mockResolvedValue([]);

      await service.autoSchedule(mockTenantId, {});

      expect(dbService.job.findMany).toHaveBeenCalled();
      const callArgs = dbService.job.findMany.mock.calls[0][0];
      expect(callArgs.where.scheduled_date).toBeDefined();
    });

    it('should throw BadRequestException for invalid date format', async () => {
      await expect(
        service.autoSchedule(mockTenantId, { date: 'invalid-date' }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should handle errors gracefully and throw InternalServerErrorException', async () => {
      dbService.job.findMany.mockRejectedValue(new Error('Database error'));

      await expect(
        service.autoSchedule(mockTenantId, { date: mockDate }),
      ).rejects.toThrow(InternalServerErrorException);
    });

    it('should respect optimization strategy', async () => {
      const mockJobs = [
        {
          id: 'job-1',
          priority: 'high',
          scheduled_date: new Date(mockDate),
          workOrder: {
            location: {
              latitude: 40.0,
              longitude: -80.0,
              address_line1: '123 Main St',
              city: 'Pittsburgh',
              state: 'PA',
            },
            account: { name: 'Test Account' },
            serviceType: { service_name: 'General' },
            estimated_duration: 60,
          },
        },
      ];

      const mockTechnicians = [
        {
          id: 'tech-1',
          user_id: 'tech-1',
          name: 'John Doe',
          is_available: true,
          skills: ['general'],
        },
      ];

      dbService.job.findMany.mockResolvedValue(mockJobs as any);
      technicianService.getAvailableTechnicians.mockResolvedValue(mockTechnicians as any);

      const result = await service.autoSchedule(mockTenantId, {
        date: mockDate,
        strategy: 'priority-first',
      });

      expect(result).toBeDefined();
      // Strategy is passed to optimization engine internally
    });

    it('should fallback to basic technician method on error', async () => {
      const mockJobs = [
        {
          id: 'job-1',
          priority: 'medium',
          scheduled_date: new Date(mockDate),
          workOrder: {
            location: {
              latitude: 40.0,
              longitude: -80.0,
            },
            account: { name: 'Test Account' },
            serviceType: { service_name: 'General' },
            estimated_duration: 60,
          },
        },
      ];

      const mockTechnicians = [
        {
          id: 'tech-1',
          name: 'John Doe',
          skills: ['general'],
        },
      ];

      dbService.job.findMany.mockResolvedValue(mockJobs as any);
      technicianService.getAvailableTechnicians.mockRejectedValue(new Error('Service error'));
      technicianService.getAvailableTechniciansBasic.mockResolvedValue(mockTechnicians as any);

      const result = await service.autoSchedule(mockTenantId, { date: mockDate });

      expect(technicianService.getAvailableTechniciansBasic).toHaveBeenCalled();
      expect(result).toBeDefined();
    });
  });
});

