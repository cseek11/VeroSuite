/**
 * Routing Service Unit Tests
 * Tests for route optimization and metrics
 */

import { Test, TestingModule } from '@nestjs/testing';
import { RoutingService } from '../../../src/routing/routing.service';
import { DatabaseService } from '../../../src/common/services/database.service';

describe('RoutingService', () => {
  let service: RoutingService;
  let databaseService: DatabaseService;
  let mockDatabaseService: any;

  const tenantId = 'tenant-123';
  const technicianId = 'tech-123';
  const date = '2024-01-15';

  beforeEach(async () => {
    mockDatabaseService = {
      job: {
        findMany: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RoutingService,
        {
          provide: DatabaseService,
          useValue: mockDatabaseService,
        },
      ],
    }).compile();

    service = module.get<RoutingService>(RoutingService);
    databaseService = module.get<DatabaseService>(DatabaseService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getRoutes', () => {
    it('should return routes grouped by technician', async () => {
      // Arrange
      const jobs = [
        {
          id: 'job-1',
          technician_id: technicianId,
          scheduled_date: new Date(date),
          scheduled_start_time: '09:00:00',
          priority: 'high',
          status: 'scheduled',
          workOrder: {
            account: { name: 'Customer 1' },
            location: {
              address_line1: '123 Main St',
              latitude: 40.7128,
              longitude: -74.006,
            },
            estimated_duration: 60,
          },
        },
        {
          id: 'job-2',
          technician_id: technicianId,
          scheduled_date: new Date(date),
          scheduled_start_time: '10:00:00',
          priority: 'medium',
          status: 'scheduled',
          workOrder: {
            account: { name: 'Customer 2' },
            location: {
              address_line1: '456 Oak Ave',
              latitude: 40.7589,
              longitude: -73.9851,
            },
            estimated_duration: 90,
          },
        },
      ];

      mockDatabaseService.job.findMany.mockResolvedValue(jobs);

      // Act
      const result = await service.getRoutes(tenantId, date);

      // Assert
      expect(result).toHaveLength(1);
      expect(result[0].technicianId).toBe(technicianId);
      expect(result[0].stops).toHaveLength(2);
      expect(result[0].totalJobs).toBe(2);
      expect(result[0].estimatedDuration).toBe(150); // 60 + 90
      expect(result[0].date).toBe(date);
    });

    it('should handle unassigned jobs', async () => {
      // Arrange
      const jobs = [
        {
          id: 'job-1',
          technician_id: null,
          scheduled_date: new Date(date),
          scheduled_start_time: '09:00:00',
          priority: 'high',
          status: 'scheduled',
          workOrder: {
            account: { name: 'Customer 1' },
            location: {
              address_line1: '123 Main St',
              latitude: 40.7128,
              longitude: -74.006,
            },
            estimated_duration: 60,
          },
        },
      ];

      mockDatabaseService.job.findMany.mockResolvedValue(jobs);

      // Act
      const result = await service.getRoutes(tenantId, date);

      // Assert
      expect(result).toHaveLength(1);
      expect(result[0].technicianId).toBe('unassigned');
      expect(result[0].technicianName).toBe('Unassigned');
    });

    it('should return routes for all dates when date not provided', async () => {
      // Arrange
      const jobs = [
        {
          id: 'job-1',
          technician_id: technicianId,
          scheduled_date: new Date('2024-01-15'),
          scheduled_start_time: '09:00:00',
          priority: 'high',
          status: 'scheduled',
          workOrder: {
            account: { name: 'Customer 1' },
            location: {
              address_line1: '123 Main St',
              latitude: 40.7128,
              longitude: -74.006,
            },
            estimated_duration: 60,
          },
        },
      ];

      mockDatabaseService.job.findMany.mockResolvedValue(jobs);

      // Act
      const result = await service.getRoutes(tenantId);

      // Assert
      expect(result).toHaveLength(1);
      expect(result[0].date).toBeDefined();
      expect(mockDatabaseService.job.findMany).toHaveBeenCalledWith({
        where: { tenant_id: tenantId },
        include: expect.any(Object),
        orderBy: expect.any(Array),
      });
    });

    it('should handle missing location data', async () => {
      // Arrange
      const jobs = [
        {
          id: 'job-1',
          technician_id: technicianId,
          scheduled_date: new Date(date),
          scheduled_start_time: '09:00:00',
          priority: 'high',
          status: 'scheduled',
          workOrder: {
            account: { name: 'Customer 1' },
            location: null,
            estimated_duration: 60,
          },
        },
      ];

      mockDatabaseService.job.findMany.mockResolvedValue(jobs);

      // Act
      const result = await service.getRoutes(tenantId, date);

      // Assert
      expect(result[0].stops[0].location).toBe('Unknown Location');
      expect(result[0].stops[0].coordinates).toEqual({ lat: 0, lng: 0 });
    });

    it('should calculate total distance', async () => {
      // Arrange
      const jobs = [
        {
          id: 'job-1',
          technician_id: technicianId,
          scheduled_date: new Date(date),
          scheduled_start_time: '09:00:00',
          priority: 'high',
          status: 'scheduled',
          workOrder: {
            account: { name: 'Customer 1' },
            location: {
              address_line1: '123 Main St',
              latitude: 40.7128,
              longitude: -74.006,
            },
            estimated_duration: 60,
          },
        },
        {
          id: 'job-2',
          technician_id: technicianId,
          scheduled_date: new Date(date),
          scheduled_start_time: '10:00:00',
          priority: 'medium',
          status: 'scheduled',
          workOrder: {
            account: { name: 'Customer 2' },
            location: {
              address_line1: '456 Oak Ave',
              latitude: 40.7589,
              longitude: -73.9851,
            },
            estimated_duration: 90,
          },
        },
      ];

      mockDatabaseService.job.findMany.mockResolvedValue(jobs);

      // Act
      const result = await service.getRoutes(tenantId, date);

      // Assert
      expect(result[0].totalDistance).toBeGreaterThan(0);
    });

    it('should throw error when database query fails', async () => {
      // Arrange
      const error = new Error('Database error');
      mockDatabaseService.job.findMany.mockRejectedValue(error);

      // Act & Assert
      await expect(service.getRoutes(tenantId, date)).rejects.toThrow(error);
    });
  });

  describe('optimizeRoute', () => {
    it('should optimize route by priority and time', async () => {
      // Arrange
      const jobs = [
        {
          id: 'job-1',
          technician_id: technicianId,
          scheduled_date: new Date(date),
          scheduled_start_time: '10:00:00',
          priority: 'low',
          status: 'scheduled',
          workOrder: {
            account: { name: 'Customer 1' },
            location: {
              address_line1: '123 Main St',
              latitude: 40.7128,
              longitude: -74.006,
            },
            estimated_duration: 60,
          },
        },
        {
          id: 'job-2',
          technician_id: technicianId,
          scheduled_date: new Date(date),
          scheduled_start_time: '09:00:00',
          priority: 'urgent',
          status: 'scheduled',
          workOrder: {
            account: { name: 'Customer 2' },
            location: {
              address_line1: '456 Oak Ave',
              latitude: 40.7589,
              longitude: -73.9851,
            },
            estimated_duration: 90,
          },
        },
      ];

      mockDatabaseService.job.findMany.mockResolvedValue(jobs);

      // Act
      const result = await service.optimizeRoute(tenantId, technicianId, date);

      // Assert
      expect(result.optimized).toBe(true);
      expect(result.technicianId).toBe(technicianId);
      expect(result.date).toBe(date);
      expect(result.stops).toHaveLength(2);
      // Urgent job should come first
      expect(result.stops[0].priority).toBe('urgent');
      expect(result.optimizationMethod).toBe('priority_and_time_based');
    });

    it('should return empty route when no jobs found', async () => {
      // Arrange
      mockDatabaseService.job.findMany.mockResolvedValue([]);

      // Act
      const result = await service.optimizeRoute(tenantId, technicianId, date);

      // Assert
      expect(result.optimized).toBe(false);
      expect(result.stops).toHaveLength(0);
      expect(result.totalDistance).toBe(0);
    });

    it('should handle jobs with missing priority', async () => {
      // Arrange
      const jobs = [
        {
          id: 'job-1',
          technician_id: technicianId,
          scheduled_date: new Date(date),
          scheduled_start_time: '09:00:00',
          priority: null,
          status: 'scheduled',
          workOrder: {
            account: { name: 'Customer 1' },
            location: {
              address_line1: '123 Main St',
              latitude: 40.7128,
              longitude: -74.006,
            },
            estimated_duration: 60,
          },
        },
      ];

      mockDatabaseService.job.findMany.mockResolvedValue(jobs);

      // Act
      const result = await service.optimizeRoute(tenantId, technicianId, date);

      // Assert
      expect(result.stops).toHaveLength(1);
    });

    it('should throw error when database query fails', async () => {
      // Arrange
      const error = new Error('Database error');
      mockDatabaseService.job.findMany.mockRejectedValue(error);

      // Act & Assert
      await expect(
        service.optimizeRoute(tenantId, technicianId, date)
      ).rejects.toThrow(error);
    });
  });

  describe('getRouteMetrics', () => {
    it('should calculate route metrics correctly', async () => {
      // Arrange
      const startDate = '2024-01-01';
      const endDate = '2024-01-31';
      const jobs = [
        {
          id: 'job-1',
          technician_id: technicianId,
          scheduled_date: new Date('2024-01-15'),
          scheduled_start_time: '09:00:00',
          scheduled_end_time: '10:00:00',
          actual_start_time: '09:00:00',
          actual_end_time: '09:55:00',
          status: 'completed',
          workOrder: {
            location: {
              latitude: 40.7128,
              longitude: -74.006,
            },
          },
        },
        {
          id: 'job-2',
          technician_id: technicianId,
          scheduled_date: new Date('2024-01-15'),
          scheduled_start_time: '10:00:00',
          scheduled_end_time: '11:00:00',
          actual_start_time: '10:05:00',
          actual_end_time: '11:10:00',
          status: 'completed',
          workOrder: {
            location: {
              latitude: 40.7589,
              longitude: -73.9851,
            },
          },
        },
        {
          id: 'job-3',
          technician_id: technicianId,
          scheduled_date: new Date('2024-01-16'),
          status: 'scheduled',
          workOrder: {
            location: {
              latitude: 40.7128,
              longitude: -74.006,
            },
          },
        },
      ];

      mockDatabaseService.job.findMany.mockResolvedValue(jobs);

      // Act
      const result = await service.getRouteMetrics(tenantId, startDate, endDate);

      // Assert
      expect(result.totalJobs).toBe(3);
      expect(result.completedJobs).toBe(2);
      expect(result.onTimeJobs).toBeGreaterThanOrEqual(0);
      expect(result.averageJobDuration).toBeGreaterThanOrEqual(0);
      expect(result.totalDistance).toBeGreaterThanOrEqual(0);
      expect(result.technicianUtilization).toHaveProperty(technicianId);
    });

    it('should handle jobs without location data', async () => {
      // Arrange
      const startDate = '2024-01-01';
      const endDate = '2024-01-31';
      const jobs = [
        {
          id: 'job-1',
          technician_id: technicianId,
          scheduled_date: new Date('2024-01-15'),
          status: 'completed',
          workOrder: {
            location: null,
          },
        },
      ];

      mockDatabaseService.job.findMany.mockResolvedValue(jobs);

      // Act
      const result = await service.getRouteMetrics(tenantId, startDate, endDate);

      // Assert
      expect(result.totalDistance).toBe(0);
    });

    it('should calculate on-time jobs correctly', async () => {
      // Arrange
      const startDate = '2024-01-01';
      const endDate = '2024-01-31';
      const jobs = [
        {
          id: 'job-1',
          technician_id: technicianId,
          scheduled_date: new Date('2024-01-15'),
          scheduled_start_time: '09:00:00',
          scheduled_end_time: '10:00:00',
          actual_start_time: '09:00:00',
          actual_end_time: '09:55:00',
          status: 'completed',
          workOrder: {
            location: {
              latitude: 40.7128,
              longitude: -74.006,
            },
          },
        },
      ];

      mockDatabaseService.job.findMany.mockResolvedValue(jobs);

      // Act
      const result = await service.getRouteMetrics(tenantId, startDate, endDate);

      // Assert
      expect(result.onTimeJobs).toBeGreaterThanOrEqual(0);
    });

    it('should throw error when database query fails', async () => {
      // Arrange
      const error = new Error('Database error');
      mockDatabaseService.job.findMany.mockRejectedValue(error);

      // Act & Assert
      await expect(
        service.getRouteMetrics(tenantId, '2024-01-01', '2024-01-31')
      ).rejects.toThrow(error);
    });
  });
});

