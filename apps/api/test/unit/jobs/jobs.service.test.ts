/**
 * Jobs Service Unit Tests
 * Tests for job creation, assignment, scheduling, and recurring jobs
 */

import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { JobsService } from '../../../src/jobs/jobs.service';
import { DatabaseService } from '../../../src/common/services/database.service';
import { AuditService } from '../../../src/common/services/audit.service';
import { JobStatus } from '../../../src/jobs/dto';

describe('JobsService', () => {
  let service: JobsService;
  let databaseService: DatabaseService;
  let auditService: AuditService;

  const mockTenantId = 'tenant-123';
  const mockTechnicianId = 'technician-123';
  const mockJobId = 'job-123';
  const mockAccountId = 'account-123';
  const mockWorkOrderId = 'work-order-123';

  const mockJob = {
    id: mockJobId,
    tenant_id: mockTenantId,
    account_id: mockAccountId,
    work_order_id: mockWorkOrderId,
    technician_id: mockTechnicianId,
    status: JobStatus.SCHEDULED,
    scheduled_date: new Date(),
    scheduled_start_time: '09:00',
    scheduled_end_time: '11:00',
    priority: 'high',
    workOrder: {
      id: mockWorkOrderId,
      service_type: 'Pest Control',
      description: 'Monthly service',
      estimated_duration: 120,
      service_price: 150.0,
      special_instructions: 'Use eco-friendly products',
      location: {
        id: 'location-123',
        name: 'Main Office',
        address_line1: '123 Main St',
        city: 'Test City',
        state: 'TS',
        latitude: 40.7128,
        longitude: -74.0060,
      },
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JobsService,
        {
          provide: DatabaseService,
          useValue: {
            job: {
              findMany: jest.fn(),
              findFirst: jest.fn(),
              create: jest.fn(),
              update: jest.fn(),
            },
            $queryRawUnsafe: jest.fn(),
            $executeRawUnsafe: jest.fn(),
          },
        },
        {
          provide: AuditService,
          useValue: {
            log: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile();

    service = module.get<JobsService>(JobsService);
    databaseService = module.get<DatabaseService>(DatabaseService);
    auditService = module.get<AuditService>(AuditService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getTodaysJobs', () => {
    it('should return today\'s jobs for tenant', async () => {
      jest.spyOn(databaseService.job, 'findMany').mockResolvedValue([mockJob] as any);

      const result = await service.getTodaysJobs(mockTenantId);

      expect(result).toHaveLength(1);
      expect(result[0]).toHaveProperty('id');
      expect(result[0]).toHaveProperty('status');
      expect(result[0]).toHaveProperty('customer');
      expect(result[0]).toHaveProperty('location');
      expect(result[0]).toHaveProperty('service');
      expect(databaseService.job.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            tenant_id: mockTenantId,
          }),
        })
      );
    });

    it('should filter by technician when provided', async () => {
      jest.spyOn(databaseService.job, 'findMany').mockResolvedValue([mockJob] as any);

      await service.getTodaysJobs(mockTenantId, mockTechnicianId);

      expect(databaseService.job.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            tenant_id: mockTenantId,
            technician_id: mockTechnicianId,
          }),
        })
      );
    });

    it('should order by priority and scheduled time', async () => {
      jest.spyOn(databaseService.job, 'findMany').mockResolvedValue([]);

      await service.getTodaysJobs(mockTenantId);

      expect(databaseService.job.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          orderBy: [
            { priority: 'desc' },
            { scheduled_start_time: 'asc' },
          ],
        })
      );
    });

    it('should format location address correctly', async () => {
      jest.spyOn(databaseService.job, 'findMany').mockResolvedValue([mockJob] as any);

      const result = await service.getTodaysJobs(mockTenantId);

      expect(result[0].location.address).toBe('123 Main St, Test City, TS');
      expect(result[0].location.coordinates).toEqual({
        lat: 40.7128,
        lng: -74.0060,
      });
    });
  });

  describe('getJobById', () => {
    it('should return job by ID', async () => {
      jest.spyOn(databaseService.job, 'findFirst').mockResolvedValue(mockJob as any);

      const result = await service.getJobById(mockJobId, mockTenantId);

      expect(result).toEqual(mockJob);
      expect(databaseService.job.findFirst).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            id: mockJobId,
            tenant_id: mockTenantId,
          },
        })
      );
    });

    it('should throw NotFoundException when job not found', async () => {
      jest.spyOn(databaseService.job, 'findFirst').mockResolvedValue(null);

      await expect(service.getJobById('non-existent', mockTenantId)).rejects.toThrow(
        NotFoundException
      );
      await expect(service.getJobById('non-existent', mockTenantId)).rejects.toThrow('Job not found');
    });
  });

  describe('createJob', () => {
    const createJobDto = {
      work_order_id: mockWorkOrderId,
      account_id: mockAccountId,
      location_id: 'location-123',
      scheduled_date: new Date().toISOString(),
      scheduled_start_time: '09:00',
      scheduled_end_time: '11:00',
      priority: 'high',
    };

    it('should create job successfully', async () => {
      jest.spyOn(databaseService.job, 'create').mockResolvedValue(mockJob as any);

      const result = await service.createJob(createJobDto, mockTenantId);

      expect(result).toEqual(mockJob);
      expect(databaseService.job.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            tenant_id: mockTenantId,
            work_order_id: mockWorkOrderId,
            status: JobStatus.UNASSIGNED,
          }),
        })
      );
      expect(auditService.log).toHaveBeenCalled();
    });

    it('should create job as SCHEDULED when technician provided', async () => {
      const dtoWithTechnician = {
        ...createJobDto,
        technician_id: mockTechnicianId,
      };

      jest.spyOn(databaseService.job, 'create').mockResolvedValue(mockJob as any);

      await service.createJob(dtoWithTechnician, mockTenantId);

      expect(databaseService.job.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            technician_id: mockTechnicianId,
            status: JobStatus.SCHEDULED,
          }),
        })
      );
    });
  });

  describe('assignJob', () => {
    const assignJobDto = {
      job_id: mockJobId,
      technician_id: mockTechnicianId,
      scheduled_date: new Date().toISOString(),
      time_window_start: '09:00',
      time_window_end: '11:00',
    };

    it('should assign job to technician', async () => {
      jest.spyOn(databaseService.job, 'findFirst').mockResolvedValue({
        ...mockJob,
        status: JobStatus.UNASSIGNED,
      } as any);
      jest.spyOn(databaseService.job, 'update').mockResolvedValue({
        ...mockJob,
        status: JobStatus.SCHEDULED,
      } as any);

      const result = await service.assignJob(assignJobDto, mockTenantId);

      expect(result.status).toBe(JobStatus.SCHEDULED);
      expect(result.technician_id).toBe(mockTechnicianId);
      expect(auditService.log).toHaveBeenCalledWith(
        expect.objectContaining({
          action: 'assigned',
          resourceType: 'job',
        })
      );
    });

    it('should throw NotFoundException when job not found', async () => {
      jest.spyOn(databaseService.job, 'findFirst').mockResolvedValue(null);

      await expect(service.assignJob(assignJobDto, mockTenantId)).rejects.toThrow(
        NotFoundException
      );
    });

    it('should throw BadRequestException when job already assigned', async () => {
      jest.spyOn(databaseService.job, 'findFirst').mockResolvedValue({
        ...mockJob,
        status: JobStatus.SCHEDULED,
      } as any);

      await expect(service.assignJob(assignJobDto, mockTenantId)).rejects.toThrow(
        BadRequestException
      );
      await expect(service.assignJob(assignJobDto, mockTenantId)).rejects.toThrow(
        'Job is already assigned or completed'
      );
    });

    it('should throw BadRequestException when job is completed', async () => {
      jest.spyOn(databaseService.job, 'findFirst').mockResolvedValue({
        ...mockJob,
        status: JobStatus.COMPLETED,
      } as any);

      await expect(service.assignJob(assignJobDto, mockTenantId)).rejects.toThrow(
        BadRequestException
      );
    });
  });

  describe('startJob', () => {
    const gpsLocation = { lat: 40.7128, lng: -74.0060 };

    it('should start job successfully', async () => {
      jest.spyOn(databaseService.job, 'findFirst').mockResolvedValue({
        ...mockJob,
        status: JobStatus.SCHEDULED,
      } as any);
      jest.spyOn(databaseService.job, 'update').mockResolvedValue({
        ...mockJob,
        status: JobStatus.IN_PROGRESS,
        actual_start_time: new Date(),
      } as any);

      const result = await service.startJob(mockJobId, gpsLocation, mockTenantId);

      expect(result.status).toBe(JobStatus.IN_PROGRESS);
      expect(result.actual_start_time).toBeDefined();
      expect(auditService.log).toHaveBeenCalledWith(
        expect.objectContaining({
          action: 'started',
          resourceType: 'job',
        })
      );
    });

    it('should allow starting unassigned job', async () => {
      jest.spyOn(databaseService.job, 'findFirst').mockResolvedValue({
        ...mockJob,
        status: JobStatus.UNASSIGNED,
      } as any);
      jest.spyOn(databaseService.job, 'update').mockResolvedValue({
        ...mockJob,
        status: JobStatus.IN_PROGRESS,
      } as any);

      await service.startJob(mockJobId, gpsLocation, mockTenantId);

      expect(databaseService.job.update).toHaveBeenCalled();
    });

    it('should throw NotFoundException when job not found', async () => {
      jest.spyOn(databaseService.job, 'findFirst').mockResolvedValue(null);

      await expect(service.startJob(mockJobId, gpsLocation, mockTenantId)).rejects.toThrow(
        NotFoundException
      );
    });

    it('should throw BadRequestException when job cannot be started', async () => {
      jest.spyOn(databaseService.job, 'findFirst').mockResolvedValue({
        ...mockJob,
        status: JobStatus.COMPLETED,
      } as any);

      await expect(service.startJob(mockJobId, gpsLocation, mockTenantId)).rejects.toThrow(
        BadRequestException
      );
      await expect(service.startJob(mockJobId, gpsLocation, mockTenantId)).rejects.toThrow(
        'Job must be scheduled or unassigned to start'
      );
    });
  });

  describe('completeJob', () => {
    const completeJobDto = {
      notes: 'Job completed successfully',
      signature_url: 'https://example.com/signature.png',
      photos: ['https://example.com/photo1.jpg'],
      chemicals_used: [{ name: 'Pesticide A', amount: '500ml' }],
    };

    it('should complete job successfully', async () => {
      jest.spyOn(databaseService.job, 'findFirst').mockResolvedValue({
        ...mockJob,
        status: JobStatus.IN_PROGRESS,
      } as any);
      jest.spyOn(databaseService.job, 'update').mockResolvedValue({
        ...mockJob,
        status: JobStatus.COMPLETED,
        actual_end_time: new Date(),
        ...completeJobDto,
      } as any);

      const result = await service.completeJob(mockJobId, completeJobDto, mockTenantId);

      expect(result.status).toBe(JobStatus.COMPLETED);
      expect(result.actual_end_time).toBeDefined();
      expect(auditService.log).toHaveBeenCalledWith(
        expect.objectContaining({
          action: 'completed',
          resourceType: 'job',
        })
      );
    });

    it('should throw NotFoundException when job not found', async () => {
      jest.spyOn(databaseService.job, 'findFirst').mockResolvedValue(null);

      await expect(service.completeJob(mockJobId, completeJobDto, mockTenantId)).rejects.toThrow(
        NotFoundException
      );
    });

    it('should throw BadRequestException when job not in progress', async () => {
      jest.spyOn(databaseService.job, 'findFirst').mockResolvedValue({
        ...mockJob,
        status: JobStatus.SCHEDULED,
      } as any);

      await expect(service.completeJob(mockJobId, completeJobDto, mockTenantId)).rejects.toThrow(
        BadRequestException
      );
      await expect(service.completeJob(mockJobId, completeJobDto, mockTenantId)).rejects.toThrow(
        'Job must be in progress to complete'
      );
    });

    it('should handle optional fields', async () => {
      const minimalDto = {};
      jest.spyOn(databaseService.job, 'findFirst').mockResolvedValue({
        ...mockJob,
        status: JobStatus.IN_PROGRESS,
      } as any);
      jest.spyOn(databaseService.job, 'update').mockResolvedValue({
        ...mockJob,
        status: JobStatus.COMPLETED,
      } as any);

      await service.completeJob(mockJobId, minimalDto, mockTenantId);

      expect(databaseService.job.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            completion_notes: null,
            customer_signature: null,
            photos: [],
            chemicals_used: [],
          }),
        })
      );
    });
  });

  describe('updatePhotos', () => {
    const photos = ['https://example.com/photo1.jpg', 'https://example.com/photo2.jpg'];

    it('should update job photos', async () => {
      jest.spyOn(databaseService.job, 'findFirst').mockResolvedValue(mockJob as any);
      jest.spyOn(databaseService.job, 'update').mockResolvedValue({
        ...mockJob,
        photos,
      } as any);

      const result = await service.updatePhotos(mockJobId, photos, mockTenantId);

      expect(result.photos).toEqual(photos);
      expect(auditService.log).toHaveBeenCalledWith(
        expect.objectContaining({
          action: 'photos_updated',
          resourceType: 'job',
        })
      );
    });

    it('should throw NotFoundException when job not found', async () => {
      jest.spyOn(databaseService.job, 'findFirst').mockResolvedValue(null);

      await expect(service.updatePhotos(mockJobId, photos, mockTenantId)).rejects.toThrow(
        NotFoundException
      );
    });
  });

  describe('checkConflicts', () => {
    const scheduledDate = new Date('2025-01-15');
    const startTime = '09:00';
    const endTime = '11:00';

    it('should detect no conflicts when technician is free', async () => {
      jest.spyOn(databaseService.job, 'findMany').mockResolvedValue([]);

      const result = await service.checkConflicts(
        mockTechnicianId,
        scheduledDate,
        startTime,
        endTime,
        mockTenantId
      );

      expect(result.has_conflicts).toBe(false);
      expect(result.conflicts).toHaveLength(0);
      expect(result.can_proceed).toBe(true);
    });

    it('should detect time overlap conflicts', async () => {
      const conflictingJob = {
        ...mockJob,
        scheduled_start_time: '09:30',
        scheduled_end_time: '10:30',
        status: JobStatus.SCHEDULED,
        workOrder: {
          account: { name: 'Test Customer' },
          location: {
            address_line1: '456 Other St',
            city: 'Test City',
          },
        },
      };

      jest.spyOn(databaseService.job, 'findMany').mockResolvedValue([conflictingJob] as any);

      const result = await service.checkConflicts(
        mockTechnicianId,
        scheduledDate,
        startTime,
        endTime,
        mockTenantId
      );

      expect(result.has_conflicts).toBe(true);
      expect(result.conflicts).toHaveLength(1);
      expect(result.conflicts[0].type).toBe('technician_double_booking');
      expect(result.conflicts[0].severity).toBe('critical');
      expect(result.can_proceed).toBe(false);
    });

    it('should exclude specified job IDs from conflict check', async () => {
      jest.spyOn(databaseService.job, 'findMany').mockResolvedValue([]);

      await service.checkConflicts(
        mockTechnicianId,
        scheduledDate,
        startTime,
        endTime,
        mockTenantId,
        [mockJobId]
      );

      expect(databaseService.job.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            id: { notIn: [mockJobId] },
          }),
        })
      );
    });

    it('should only check scheduled and in-progress jobs', async () => {
      jest.spyOn(databaseService.job, 'findMany').mockResolvedValue([]);

      await service.checkConflicts(
        mockTechnicianId,
        scheduledDate,
        startTime,
        endTime,
        mockTenantId
      );

      expect(databaseService.job.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            status: {
              in: [JobStatus.SCHEDULED, JobStatus.IN_PROGRESS],
            },
          }),
        })
      );
    });

    it('should handle jobs without time windows', async () => {
      const jobWithoutTime = {
        ...mockJob,
        scheduled_start_time: null,
        scheduled_end_time: null,
      };

      jest.spyOn(databaseService.job, 'findMany').mockResolvedValue([jobWithoutTime] as any);

      const result = await service.checkConflicts(
        mockTechnicianId,
        scheduledDate,
        startTime,
        endTime,
        mockTenantId
      );

      expect(result.has_conflicts).toBe(false);
    });
  });

  // ===== RECURRING JOBS MANAGEMENT =====

  describe('createRecurringJobTemplate', () => {
    const createTemplateDto = {
      name: 'Monthly Pest Control',
      description: 'Monthly service for office building',
      recurrence_type: 'monthly',
      recurrence_interval: 1,
      recurrence_day_of_month: 15,
      start_time: '09:00',
      end_time: '11:00',
      estimated_duration: 120,
      start_date: '2025-01-15',
      end_date: '2025-12-31',
      max_occurrences: 12,
      job_template: {
        work_order_id: mockWorkOrderId,
        account_id: mockAccountId,
        location_id: 'location-123',
        priority: 'medium',
      },
      is_active: true,
    };

    it('should create recurring job template successfully', async () => {
      const mockTemplate = {
        id: 'template-123',
        tenant_id: mockTenantId,
        ...createTemplateDto,
        created_at: new Date(),
        updated_at: new Date(),
      };

      jest.spyOn(databaseService, '$queryRawUnsafe').mockResolvedValue([mockTemplate] as any);

      const result = await service.createRecurringJobTemplate(createTemplateDto, mockTenantId);

      expect(result).toBeDefined();
      expect(result.id).toBe('template-123');
      expect(databaseService.$queryRawUnsafe).toHaveBeenCalled();
    });

    it('should throw BadRequestException when tables do not exist', async () => {
      jest.spyOn(databaseService, '$queryRawUnsafe').mockRejectedValue(
        new Error('relation "recurring_job_templates" does not exist')
      );

      await expect(
        service.createRecurringJobTemplate(createTemplateDto, mockTenantId)
      ).rejects.toThrow(BadRequestException);
      await expect(
        service.createRecurringJobTemplate(createTemplateDto, mockTenantId)
      ).rejects.toThrow('Recurring jobs tables not created yet');
    });

    it('should handle optional fields', async () => {
      const minimalDto = {
        name: 'Weekly Service',
        recurrence_type: 'weekly',
        start_time: '09:00',
        start_date: '2025-01-15',
        job_template: { account_id: mockAccountId, location_id: 'location-123' },
      };

      const mockTemplate = {
        id: 'template-456',
        tenant_id: mockTenantId,
        ...minimalDto,
        description: null,
        end_time: null,
        end_date: null,
        max_occurrences: null,
        is_active: true,
      };

      jest.spyOn(databaseService, '$queryRawUnsafe').mockResolvedValue([mockTemplate] as any);

      const result = await service.createRecurringJobTemplate(minimalDto, mockTenantId);

      expect(result).toBeDefined();
      expect(result.description).toBeNull();
    });
  });

  describe('getRecurringJobTemplates', () => {
    const mockTemplates = [
      {
        id: 'template-1',
        tenant_id: mockTenantId,
        name: 'Active Template',
        is_active: true,
        created_at: new Date(),
      },
      {
        id: 'template-2',
        tenant_id: mockTenantId,
        name: 'Inactive Template',
        is_active: false,
        created_at: new Date(),
      },
    ];

    it('should return all templates when activeOnly is false', async () => {
      jest.spyOn(databaseService, '$queryRawUnsafe').mockResolvedValue(mockTemplates as any);

      const result = await service.getRecurringJobTemplates(mockTenantId, false);

      expect(result).toHaveLength(2);
      expect(databaseService.$queryRawUnsafe).toHaveBeenCalledWith(
        expect.stringContaining('SELECT * FROM recurring_job_templates'),
        mockTenantId
      );
    });

    it('should return only active templates when activeOnly is true', async () => {
      jest.spyOn(databaseService, '$queryRawUnsafe').mockResolvedValue([mockTemplates[0]] as any);

      const result = await service.getRecurringJobTemplates(mockTenantId, true);

      expect(result).toHaveLength(1);
      expect(result[0].is_active).toBe(true);
      expect(databaseService.$queryRawUnsafe).toHaveBeenCalledWith(
        expect.stringContaining('AND is_active = true'),
        mockTenantId
      );
    });

    it('should return empty array when tables do not exist', async () => {
      jest.spyOn(databaseService, '$queryRawUnsafe').mockRejectedValue(
        new Error('relation "recurring_job_templates" does not exist')
      );

      const result = await service.getRecurringJobTemplates(mockTenantId);

      expect(result).toEqual([]);
    });

    it('should handle database errors', async () => {
      jest.spyOn(databaseService, '$queryRawUnsafe').mockRejectedValue(
        new Error('Database connection error')
      );

      await expect(service.getRecurringJobTemplates(mockTenantId)).rejects.toThrow(
        'Database connection error'
      );
    });
  });

  describe('updateRecurringJobTemplate', () => {
    const updateDto = {
      name: 'Updated Template Name',
      description: 'Updated description',
      is_active: false,
      end_date: '2025-12-31',
      max_occurrences: 24,
    };

    it('should update template successfully', async () => {
      const updatedTemplate = {
        id: 'template-123',
        tenant_id: mockTenantId,
        ...updateDto,
        updated_at: new Date(),
      };

      jest.spyOn(databaseService, '$queryRawUnsafe').mockResolvedValue([updatedTemplate] as any);

      const result = await service.updateRecurringJobTemplate(
        'template-123',
        updateDto,
        mockTenantId
      );

      expect(result).toBeDefined();
      expect(result.name).toBe('Updated Template Name');
      expect(databaseService.$queryRawUnsafe).toHaveBeenCalled();
    });

    it('should throw BadRequestException when no fields to update', async () => {
      await expect(
        service.updateRecurringJobTemplate('template-123', {}, mockTenantId)
      ).rejects.toThrow(BadRequestException);
      await expect(
        service.updateRecurringJobTemplate('template-123', {}, mockTenantId)
      ).rejects.toThrow('No fields to update');
    });

    it('should throw BadRequestException when tables do not exist', async () => {
      jest.spyOn(databaseService, '$queryRawUnsafe').mockRejectedValue(
        new Error('relation "recurring_job_templates" does not exist')
      );

      await expect(
        service.updateRecurringJobTemplate('template-123', updateDto, mockTenantId)
      ).rejects.toThrow(BadRequestException);
    });

    it('should update only provided fields', async () => {
      const partialUpdate = { name: 'New Name' };
      const updatedTemplate = {
        id: 'template-123',
        tenant_id: mockTenantId,
        name: 'New Name',
        updated_at: new Date(),
      };

      jest.spyOn(databaseService, '$queryRawUnsafe').mockResolvedValue([updatedTemplate] as any);

      const result = await service.updateRecurringJobTemplate(
        'template-123',
        partialUpdate,
        mockTenantId
      );

      expect(result.name).toBe('New Name');
      // Verify the query was called with the correct SQL and params
      expect(databaseService.$queryRawUnsafe).toHaveBeenCalled();
      const callArgs = (databaseService.$queryRawUnsafe as jest.Mock).mock.calls[0];
      expect(callArgs[0]).toContain('name =');
      expect(callArgs[0]).toContain('UPDATE recurring_job_templates');
      expect(callArgs.length).toBeGreaterThan(1); // Should have params
    });
  });

  describe('deleteRecurringJobTemplate', () => {
    it('should delete template without deleting jobs when deleteAllJobs is false', async () => {
      jest.spyOn(databaseService, '$queryRawUnsafe').mockResolvedValue([] as any);

      await service.deleteRecurringJobTemplate('template-123', mockTenantId, false);

      expect(databaseService.$queryRawUnsafe).toHaveBeenCalledWith(
        expect.stringContaining('DELETE FROM recurring_job_templates'),
        mockTenantId,
        'template-123'
      );
      // Should not delete jobs
      expect(databaseService.$queryRawUnsafe).not.toHaveBeenCalledWith(
        expect.stringContaining('DELETE FROM jobs'),
        expect.anything()
      );
    });

    it('should delete template and all associated jobs when deleteAllJobs is true', async () => {
      jest.spyOn(databaseService, '$queryRawUnsafe').mockResolvedValue([] as any);

      await service.deleteRecurringJobTemplate('template-123', mockTenantId, true);

      // Should delete jobs first
      expect(databaseService.$queryRawUnsafe).toHaveBeenCalledWith(
        expect.stringContaining('DELETE FROM jobs'),
        mockTenantId,
        'template-123'
      );
      // Should delete instances
      expect(databaseService.$queryRawUnsafe).toHaveBeenCalledWith(
        expect.stringContaining('DELETE FROM recurring_job_instances'),
        mockTenantId,
        'template-123'
      );
      // Should delete template
      expect(databaseService.$queryRawUnsafe).toHaveBeenCalledWith(
        expect.stringContaining('DELETE FROM recurring_job_templates'),
        mockTenantId,
        'template-123'
      );
    });

    it('should throw BadRequestException when tables do not exist', async () => {
      jest.spyOn(databaseService, '$queryRawUnsafe').mockRejectedValue(
        new Error('relation "recurring_job_templates" does not exist')
      );

      await expect(
        service.deleteRecurringJobTemplate('template-123', mockTenantId)
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('generateRecurringJobs', () => {
    const mockTemplate = {
      id: 'template-123',
      tenant_id: mockTenantId,
      name: 'Monthly Service',
      recurrence_type: 'monthly',
      recurrence_interval: 1,
      recurrence_day_of_month: 15,
      start_time: '09:00',
      end_time: '11:00',
      start_date: '2025-01-15',
      end_date: '2025-12-31',
      max_occurrences: 12,
      is_active: true,
      last_generated_date: null,
      job_template: JSON.stringify({
        work_order_id: mockWorkOrderId,
        account_id: mockAccountId,
        location_id: 'location-123',
        priority: 'medium',
      }),
    };

    it('should generate jobs successfully', async () => {
      const generateUntil = new Date('2025-06-15');

      jest.spyOn(service, 'getRecurringJobTemplates').mockResolvedValue([mockTemplate] as any);
      jest.spyOn(databaseService.job, 'create').mockResolvedValue(mockJob as any);
      jest.spyOn(databaseService, '$queryRawUnsafe')
        .mockResolvedValueOnce([]) // Check existing instances
        .mockResolvedValueOnce([]) // Insert instance
        .mockResolvedValueOnce([]); // Update template
      jest.spyOn(databaseService, '$executeRawUnsafe').mockResolvedValue(1); // Update job

      const result = await service.generateRecurringJobs(
        'template-123',
        generateUntil,
        mockTenantId
      );

      expect(result.generated).toBeGreaterThan(0);
      expect(result.skipped).toBe(0);
      expect(databaseService.job.create).toHaveBeenCalled();
    });

    it('should throw NotFoundException when template not found', async () => {
      jest.spyOn(service, 'getRecurringJobTemplates').mockResolvedValue([]);

      await expect(
        service.generateRecurringJobs('non-existent', new Date('2025-06-15'), mockTenantId)
      ).rejects.toThrow(NotFoundException);
      await expect(
        service.generateRecurringJobs('non-existent', new Date('2025-06-15'), mockTenantId)
      ).rejects.toThrow('Recurring job template not found');
    });

    it('should throw BadRequestException when template is not active', async () => {
      const inactiveTemplate = { ...mockTemplate, is_active: false };
      jest.spyOn(service, 'getRecurringJobTemplates').mockResolvedValue([inactiveTemplate] as any);

      await expect(
        service.generateRecurringJobs('template-123', new Date('2025-06-15'), mockTenantId)
      ).rejects.toThrow(BadRequestException);
      await expect(
        service.generateRecurringJobs('template-123', new Date('2025-06-15'), mockTenantId)
      ).rejects.toThrow('Template is not active');
    });

    it('should skip existing jobs when skipExisting is true', async () => {
      const generateUntil = new Date('2025-06-15');

      jest.spyOn(service, 'getRecurringJobTemplates').mockResolvedValue([mockTemplate] as any);
      jest.spyOn(databaseService, '$queryRawUnsafe').mockResolvedValue([
        { id: 'existing-instance' },
      ] as any); // Existing instance found

      const result = await service.generateRecurringJobs(
        'template-123',
        generateUntil,
        mockTenantId,
        true
      );

      expect(result.skipped).toBeGreaterThan(0);
      expect(databaseService.job.create).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException when tables do not exist', async () => {
      jest.spyOn(service, 'getRecurringJobTemplates').mockResolvedValue([mockTemplate] as any);
      jest.spyOn(databaseService, '$queryRawUnsafe').mockRejectedValue(
        new Error('relation "recurring_job_instances" does not exist')
      );

      await expect(
        service.generateRecurringJobs('template-123', new Date('2025-06-15'), mockTenantId)
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('skipRecurringJobOccurrence', () => {
    const mockInstance = {
      id: 'instance-123',
      tenant_id: mockTenantId,
      job_id: mockJobId,
      recurring_template_id: 'template-123',
      scheduled_date: new Date('2025-01-15'),
      is_exception: false,
    };

    it('should skip job occurrence successfully', async () => {
      jest.spyOn(databaseService, '$queryRawUnsafe')
        .mockResolvedValueOnce([mockInstance] as any) // Find instance
        .mockResolvedValueOnce([]); // Update instance
      jest.spyOn(databaseService.job, 'update').mockResolvedValue({
        ...mockJob,
        status: JobStatus.CANCELLED,
      } as any);

      await service.skipRecurringJobOccurrence(mockJobId, mockTenantId);

      expect(databaseService.$queryRawUnsafe).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE recurring_job_instances'),
        mockTenantId,
        mockJobId
      );
      expect(databaseService.job.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: mockJobId },
          data: { status: JobStatus.CANCELLED },
        })
      );
    });

    it('should throw NotFoundException when instance not found', async () => {
      jest.spyOn(databaseService, '$queryRawUnsafe').mockResolvedValue([]);

      await expect(
        service.skipRecurringJobOccurrence('non-existent', mockTenantId)
      ).rejects.toThrow(NotFoundException);
      await expect(
        service.skipRecurringJobOccurrence('non-existent', mockTenantId)
      ).rejects.toThrow('Recurring job instance not found');
    });

    it('should throw BadRequestException when tables do not exist', async () => {
      jest.spyOn(databaseService, '$queryRawUnsafe').mockRejectedValue(
        new Error('relation "recurring_job_instances" does not exist')
      );

      await expect(
        service.skipRecurringJobOccurrence(mockJobId, mockTenantId)
      ).rejects.toThrow(BadRequestException);
    });
  });
});

