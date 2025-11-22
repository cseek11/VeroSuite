/**
 * Health Service Unit Tests
 * Tests for health check functionality
 */

import { Test, TestingModule } from '@nestjs/testing';
import { HealthService } from '../../../src/health/health.service';
import { SupabaseService } from '../../../src/common/services/supabase.service';

describe('HealthService', () => {
  let service: HealthService;
  let supabaseService: SupabaseService;
  let mockSupabaseService: any;
  let mockSupabaseClient: any;

  beforeEach(async () => {
    mockSupabaseClient = {
      from: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      limit: jest.fn(),
    };

    mockSupabaseService = {
      getClient: jest.fn().mockReturnValue(mockSupabaseClient),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HealthService,
        {
          provide: SupabaseService,
          useValue: mockSupabaseService,
        },
      ],
    }).compile();

    service = module.get<HealthService>(HealthService);
    supabaseService = module.get<SupabaseService>(SupabaseService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('checkDatabase', () => {
    it('should return healthy status when database is accessible', async () => {
      // Arrange
      mockSupabaseClient.limit.mockResolvedValue({
        error: null,
        data: [{ id: 'test-id' }],
      });

      // Act
      const result = await service.checkDatabase();

      // Assert
      expect(result.healthy).toBe(true);
      expect(result.message).toBe('Database connection healthy');
      expect(result.responseTime).toBeGreaterThanOrEqual(0);
      expect(mockSupabaseClient.from).toHaveBeenCalledWith('dashboard_regions');
      expect(mockSupabaseClient.select).toHaveBeenCalledWith('id');
      expect(mockSupabaseClient.limit).toHaveBeenCalledWith(1);
    });

    it('should return unhealthy status when database query fails', async () => {
      // Arrange
      const dbError = { message: 'Connection timeout' };
      mockSupabaseClient.limit.mockResolvedValue({
        error: dbError,
        data: null,
      });

      // Act
      const result = await service.checkDatabase();

      // Assert
      expect(result.healthy).toBe(false);
      expect(result.message).toBe(`Database error: ${dbError.message}`);
      expect(result.responseTime).toBeGreaterThanOrEqual(0);
    });

    it('should return unhealthy status when database throws exception', async () => {
      // Arrange
      const error = new Error('Network error');
      mockSupabaseClient.limit.mockRejectedValue(error);

      // Act
      const result = await service.checkDatabase();

      // Assert
      expect(result.healthy).toBe(false);
      expect(result.message).toBe(`Database check failed: ${error.message}`);
      expect(result.responseTime).toBeGreaterThanOrEqual(0);
    });

    it('should measure response time correctly', async () => {
      // Arrange
      mockSupabaseClient.limit.mockImplementation(
        () =>
          new Promise((resolve) => {
            setTimeout(() => {
              resolve({ error: null, data: [{ id: 'test' }] });
            }, 50);
          })
      );

      // Act
      const result = await service.checkDatabase();

      // Assert
      expect(result.responseTime).toBeGreaterThanOrEqual(50);
      expect(result.responseTime).toBeLessThan(200);
    });

    it('should handle null error response', async () => {
      // Arrange
      mockSupabaseClient.limit.mockResolvedValue({
        error: null,
        data: [],
      });

      // Act
      const result = await service.checkDatabase();

      // Assert
      expect(result.healthy).toBe(true);
      expect(result.message).toBe('Database connection healthy');
    });
  });
});

