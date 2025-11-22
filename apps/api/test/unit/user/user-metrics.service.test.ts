/**
 * User Metrics Service Unit Tests
 * Tests for metrics collection and analytics calculations
 */

import { Test, TestingModule } from '@nestjs/testing';
import { UserMetricsService } from '../../../src/user/user-metrics.service';
import { DatabaseService } from '../../../src/common/services/database.service';

describe('UserMetricsService', () => {
  let service: UserMetricsService;
  let databaseService: DatabaseService;

  const mockTenantId = 'tenant-123';
  const mockUserId = 'user-123';
  const startDate = new Date('2025-01-01');
  const endDate = new Date('2025-01-31');

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserMetricsService,
        {
          provide: DatabaseService,
          useValue: {
            job: {
              findMany: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<UserMetricsService>(UserMetricsService);
    databaseService = module.get<DatabaseService>(DatabaseService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getUserMetrics', () => {
    it('should calculate metrics for user', async () => {
      const mockJobs = [
        {
          id: 'job-1',
          status: 'completed',
          scheduled_date: new Date('2025-01-15'),
          actual_start_time: new Date('2025-01-15T09:00:00'),
          actual_end_time: new Date('2025-01-15T11:00:00'),
          workOrder: {
            Invoice: [
              { total_amount: 100.0 },
            ],
          },
        },
        {
          id: 'job-2',
          status: 'in_progress',
          scheduled_date: new Date('2025-01-20'),
        },
        {
          id: 'job-3',
          status: 'scheduled',
          scheduled_date: new Date('2025-01-25'),
        },
      ];

      jest.spyOn(databaseService.job, 'findMany').mockResolvedValue(mockJobs as any);

      const result = await service.getUserMetrics(mockTenantId, mockUserId, startDate, endDate);

      expect(result).toBeDefined();
      expect(result.userId).toBe(mockUserId);
      expect(result.jobs.total).toBe(3);
      expect(result.jobs.completed).toBe(1);
      expect(result.jobs.in_progress).toBe(1);
      expect(result.jobs.scheduled).toBe(1);
      expect(result.revenue.total).toBe(100.0);
    });

    it('should calculate average revenue per job', async () => {
      const mockJobs = [
        {
          id: 'job-1',
          status: 'completed',
          scheduled_date: new Date('2025-01-15'),
          workOrder: {
            Invoice: [{ total_amount: 100.0 }],
          },
        },
        {
          id: 'job-2',
          status: 'completed',
          scheduled_date: new Date('2025-01-16'),
          workOrder: {
            Invoice: [{ total_amount: 200.0 }],
          },
        },
      ];

      jest.spyOn(databaseService.job, 'findMany').mockResolvedValue(mockJobs as any);

      const result = await service.getUserMetrics(mockTenantId, mockUserId, startDate, endDate);

      expect(result.revenue.total).toBe(300.0);
      expect(result.revenue.average_per_job).toBe(150.0);
    });

    it('should calculate average completion time', async () => {
      const mockJobs = [
        {
          id: 'job-1',
          status: 'completed',
          scheduled_date: new Date('2025-01-15'),
          actual_start_time: new Date('2025-01-15T09:00:00'),
          actual_end_time: new Date('2025-01-15T11:00:00'), // 2 hours
          workOrder: { Invoice: [] },
        },
        {
          id: 'job-2',
          status: 'completed',
          scheduled_date: new Date('2025-01-16'),
          actual_start_time: new Date('2025-01-16T09:00:00'),
          actual_end_time: new Date('2025-01-16T13:00:00'), // 4 hours
          workOrder: { Invoice: [] },
        },
      ];

      jest.spyOn(databaseService.job, 'findMany').mockResolvedValue(mockJobs as any);

      const result = await service.getUserMetrics(mockTenantId, mockUserId, startDate, endDate);

      expect(result.efficiency.average_completion_time_hours).toBe(3.0);
    });

    it('should handle jobs without completion times', async () => {
      const mockJobs = [
        {
          id: 'job-1',
          status: 'completed',
          scheduled_date: new Date('2025-01-15'),
          workOrder: { Invoice: [] },
        },
      ];

      jest.spyOn(databaseService.job, 'findMany').mockResolvedValue(mockJobs as any);

      const result = await service.getUserMetrics(mockTenantId, mockUserId, startDate, endDate);

      expect(result.efficiency.average_completion_time_hours).toBe(0);
    });

    it('should filter jobs by date range', async () => {
      jest.spyOn(databaseService.job, 'findMany').mockResolvedValue([]);

      await service.getUserMetrics(mockTenantId, mockUserId, startDate, endDate);

      expect(databaseService.job.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            scheduled_date: {
              gte: startDate,
              lte: endDate,
            },
          }),
        })
      );
    });

    it('should filter jobs by tenant and user', async () => {
      jest.spyOn(databaseService.job, 'findMany').mockResolvedValue([]);

      await service.getUserMetrics(mockTenantId, mockUserId, startDate, endDate);

      expect(databaseService.job.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            tenant_id: mockTenantId,
            technician_id: mockUserId,
          }),
        })
      );
    });
  });
});

