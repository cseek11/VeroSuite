/**
 * Jobs Controller Unit Tests
 * Tests for API endpoints and request validation
 */

import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { JobsController } from '../../../src/jobs/jobs.controller';
import { JobsService } from '../../../src/jobs/jobs.service';

describe('JobsController', () => {
  let controller: JobsController;
  let jobsService: JobsService;

  const mockUser = {
    userId: 'user-123',
    tenantId: 'tenant-123',
  };

  const mockJob = {
    id: 'job-123',
    status: 'scheduled',
    technician_id: 'technician-123',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [JobsController],
      providers: [
        {
          provide: JobsService,
          useValue: {
            getTodaysJobs: jest.fn(),
            getJobById: jest.fn(),
            createJob: jest.fn(),
            assignJob: jest.fn(),
            startJob: jest.fn(),
            completeJob: jest.fn(),
            updatePhotos: jest.fn(),
            checkConflicts: jest.fn(),
            createRecurringJobTemplate: jest.fn(),
            getRecurringJobTemplates: jest.fn(),
            updateRecurringJobTemplate: jest.fn(),
            deleteRecurringJobTemplate: jest.fn(),
            generateRecurringJobs: jest.fn(),
            skipRecurringJobOccurrence: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<JobsController>(JobsController);
    jobsService = module.get<JobsService>(JobsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getToday', () => {
    it('should return today\'s jobs', async () => {
      jest.spyOn(jobsService, 'getTodaysJobs').mockResolvedValue([mockJob] as any);

      const result = await controller.getToday(undefined, { user: mockUser } as any);

      expect(result).toEqual([mockJob]);
      expect(jobsService.getTodaysJobs).toHaveBeenCalledWith(mockUser.tenantId, undefined);
    });

    it('should filter by technician when provided', async () => {
      jest.spyOn(jobsService, 'getTodaysJobs').mockResolvedValue([mockJob] as any);

      await controller.getToday('technician-123', { user: mockUser } as any);

      expect(jobsService.getTodaysJobs).toHaveBeenCalledWith(mockUser.tenantId, 'technician-123');
    });
  });

  describe('getById', () => {
    it('should return job by ID', async () => {
      jest.spyOn(jobsService, 'getJobById').mockResolvedValue(mockJob as any);

      const result = await controller.getById('job-123', { user: mockUser } as any);

      expect(result).toEqual(mockJob);
      expect(jobsService.getJobById).toHaveBeenCalledWith('job-123', mockUser.tenantId);
    });
  });

  describe('create', () => {
    const createJobDto = {
      work_order_id: 'work-order-123',
      account_id: 'account-123',
      scheduled_date: new Date().toISOString(),
      priority: 'high',
    };

    it('should create job successfully', async () => {
      jest.spyOn(jobsService, 'createJob').mockResolvedValue(mockJob as any);

      const result = await controller.create(createJobDto, { user: mockUser } as any);

      expect(result).toEqual(mockJob);
      expect(jobsService.createJob).toHaveBeenCalledWith(createJobDto, mockUser.tenantId);
    });
  });

  describe('assign', () => {
    const assignJobDto = {
      job_id: 'job-123',
      technician_id: 'technician-123',
      scheduled_date: new Date().toISOString(),
      time_window_start: '09:00',
      time_window_end: '11:00',
    };

    it('should assign job to technician', async () => {
      jest.spyOn(jobsService, 'assignJob').mockResolvedValue(mockJob as any);

      const result = await controller.assign(assignJobDto, { user: mockUser } as any);

      expect(result).toEqual(mockJob);
      expect(jobsService.assignJob).toHaveBeenCalledWith(assignJobDto, mockUser.tenantId);
    });
  });

  describe('start', () => {
    const startJobDto = {
      gps_location: { lat: 40.7128, lng: -74.0060 },
    };

    it('should start job', async () => {
      jest.spyOn(jobsService, 'startJob').mockResolvedValue(mockJob as any);

      const result = await controller.start('job-123', startJobDto, { user: mockUser } as any);

      expect(result).toEqual(mockJob);
      expect(jobsService.startJob).toHaveBeenCalledWith(
        'job-123',
        startJobDto.gps_location,
        mockUser.tenantId
      );
    });
  });

  describe('complete', () => {
    const completeJobDto = {
      notes: 'Job completed',
      photos: ['https://example.com/photo.jpg'],
    };

    it('should complete job', async () => {
      jest.spyOn(jobsService, 'completeJob').mockResolvedValue(mockJob as any);

      const result = await controller.complete('job-123', completeJobDto, { user: mockUser } as any);

      expect(result).toEqual(mockJob);
      expect(jobsService.completeJob).toHaveBeenCalledWith(
        'job-123',
        completeJobDto,
        mockUser.tenantId
      );
    });
  });

  describe('updatePhotos', () => {
    const updatePhotosDto = {
      photos: [
        { url: 'https://example.com/photo1.jpg' },
        { url: 'https://example.com/photo2.jpg' },
      ],
    };

    it('should update job photos', async () => {
      jest.spyOn(jobsService, 'updatePhotos').mockResolvedValue(mockJob as any);

      const result = await controller.updatePhotos('job-123', updatePhotosDto, { user: mockUser } as any);

      expect(result).toEqual(mockJob);
      expect(jobsService.updatePhotos).toHaveBeenCalledWith(
        'job-123',
        ['https://example.com/photo1.jpg', 'https://example.com/photo2.jpg'],
        mockUser.tenantId
      );
    });
  });

  describe('checkConflicts', () => {
    const checkConflictsDto = {
      technician_id: 'technician-123',
      scheduled_date: new Date().toISOString(),
      scheduled_start_time: '09:00',
      scheduled_end_time: '11:00',
    };

    it('should check for scheduling conflicts', async () => {
      const mockConflictResult = {
        has_conflicts: false,
        conflicts: [],
        can_proceed: true,
      };

      jest.spyOn(jobsService, 'checkConflicts').mockResolvedValue(mockConflictResult as any);

      const result = await controller.checkConflicts(checkConflictsDto, { user: mockUser } as any);

      expect(result).toEqual(mockConflictResult);
      expect(jobsService.checkConflicts).toHaveBeenCalled();
    });
  });

  describe('recurring job templates', () => {
    const mockTemplate = {
      id: 'template-123',
      name: 'Monthly Service',
      recurrence_type: 'monthly',
    };

    it('should create recurring job template', async () => {
      const createDto = {
        name: 'Monthly Service',
        recurrence_type: 'monthly',
        start_date: new Date().toISOString(),
      };

      jest.spyOn(jobsService, 'createRecurringJobTemplate').mockResolvedValue(mockTemplate as any);

      const result = await controller.createRecurringTemplate(createDto, { user: mockUser } as any);

      expect(result).toEqual(mockTemplate);
      expect(jobsService.createRecurringJobTemplate).toHaveBeenCalledWith(
        createDto,
        mockUser.tenantId
      );
    });

    it('should get recurring job templates', async () => {
      jest.spyOn(jobsService, 'getRecurringJobTemplates').mockResolvedValue([mockTemplate] as any);

      const result = await controller.getRecurringTemplates(false, { user: mockUser } as any);

      expect(result).toEqual([mockTemplate]);
      expect(jobsService.getRecurringJobTemplates).toHaveBeenCalledWith(mockUser.tenantId, false);
    });

    it('should filter active templates only', async () => {
      jest.spyOn(jobsService, 'getRecurringJobTemplates').mockResolvedValue([mockTemplate] as any);

      await controller.getRecurringTemplates(true, { user: mockUser } as any);

      expect(jobsService.getRecurringJobTemplates).toHaveBeenCalledWith(mockUser.tenantId, true);
    });

    it('should get recurring template by ID', async () => {
      jest.spyOn(jobsService, 'getRecurringJobTemplates').mockResolvedValue([mockTemplate] as any);

      const result = await controller.getRecurringTemplate('template-123', { user: mockUser } as any);

      expect(result).toEqual(mockTemplate);
    });

    it('should throw NotFoundException when template not found', async () => {
      jest.spyOn(jobsService, 'getRecurringJobTemplates').mockResolvedValue([]);

      await expect(
        controller.getRecurringTemplate('non-existent', { user: mockUser } as any)
      ).rejects.toThrow(NotFoundException);
    });

    it('should update recurring job template', async () => {
      const updateDto = {
        name: 'Updated Template',
      };

      jest.spyOn(jobsService, 'updateRecurringJobTemplate').mockResolvedValue(mockTemplate as any);

      const result = await controller.updateRecurringTemplate(
        'template-123',
        updateDto,
        { user: mockUser } as any
      );

      expect(result).toEqual(mockTemplate);
      expect(jobsService.updateRecurringJobTemplate).toHaveBeenCalledWith(
        'template-123',
        updateDto,
        mockUser.tenantId
      );
    });

    it('should delete recurring job template', async () => {
      jest.spyOn(jobsService, 'deleteRecurringJobTemplate').mockResolvedValue(undefined);

      await controller.deleteRecurringTemplate('template-123', false, { user: mockUser } as any);

      expect(jobsService.deleteRecurringJobTemplate).toHaveBeenCalledWith(
        'template-123',
        mockUser.tenantId,
        false
      );
    });

    it('should generate recurring jobs', async () => {
      const generateDto = {
        generate_until: new Date().toISOString(),
        skip_existing: true,
      };

      jest.spyOn(jobsService, 'generateRecurringJobs').mockResolvedValue(undefined);

      const result = await controller.generateRecurringJobs(
        'template-123',
        generateDto,
        { user: mockUser } as any
      );

      expect(result).toHaveProperty('generated');
      expect(result).toHaveProperty('skipped');
      expect(jobsService.generateRecurringJobs).toHaveBeenCalled();
    });

    it('should skip recurring job occurrence', async () => {
      jest.spyOn(jobsService, 'skipRecurringJobOccurrence').mockResolvedValue(undefined);

      await controller.skipRecurringOccurrence('job-123', { user: mockUser } as any);

      expect(jobsService.skipRecurringJobOccurrence).toHaveBeenCalledWith(
        'job-123',
        mockUser.tenantId
      );
    });
  });
});

