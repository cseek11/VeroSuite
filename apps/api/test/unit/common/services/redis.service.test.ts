/**
 * Redis Service Unit Tests
 * Tests for Redis client wrapper and cache operations
 */

import { Test, TestingModule } from '@nestjs/testing';
import { RedisService } from '../../../../src/common/services/redis.service';
import { ConfigService } from '@nestjs/config';

// Mock redis client
const mockRedisClient = {
  connect: jest.fn().mockResolvedValue(undefined),
  disconnect: jest.fn().mockResolvedValue(undefined),
  get: jest.fn(),
  set: jest.fn(),
  setEx: jest.fn(),
  del: jest.fn(),
  exists: jest.fn(),
  expire: jest.fn(),
  mGet: jest.fn(),
  mSet: jest.fn(),
  keys: jest.fn(),
  dbSize: jest.fn(),
  info: jest.fn(),
  on: jest.fn(),
};

jest.mock('redis', () => ({
  createClient: jest.fn(() => mockRedisClient),
}));

describe('RedisService', () => {
  let service: RedisService;
  let configService: ConfigService;
  let mockConfigService: any;

  beforeEach(async () => {
    jest.clearAllMocks();
    mockConfigService = {
      get: jest.fn((key: string) => {
        if (key === 'REDIS_URL') return 'redis://localhost:6379';
        return null;
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RedisService,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<RedisService>(RedisService);
    configService = module.get<ConfigService>(ConfigService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('onModuleInit', () => {
    it('should initialize Redis when URL is provided', async () => {
      // Reset mocks before test
      jest.clearAllMocks();
      const { createClient } = require('redis');
      
      // Act
      await service.onModuleInit();

      // Assert
      expect(createClient).toHaveBeenCalled();
      expect(mockRedisClient.connect).toHaveBeenCalled();
      expect(mockRedisClient.on).toHaveBeenCalledWith('error', expect.any(Function));
      expect(mockRedisClient.on).toHaveBeenCalledWith('connect', expect.any(Function));
      expect(mockRedisClient.on).toHaveBeenCalledWith('disconnect', expect.any(Function));
    });

    it('should skip initialization when REDIS_URL is not provided', async () => {
      // Arrange
      const configServiceWithoutRedis = {
        get: jest.fn((key: string) => {
          if (key === 'REDIS_URL') return null;
          return null;
        }),
      };

      const module: TestingModule = await Test.createTestingModule({
        providers: [
          RedisService,
          {
            provide: ConfigService,
            useValue: configServiceWithoutRedis,
          },
        ],
      }).compile();

      const serviceWithoutRedis = module.get<RedisService>(RedisService);

      // Act
      await serviceWithoutRedis.onModuleInit();

      // Assert
      expect(serviceWithoutRedis.isRedisConnected()).toBe(false);
    });

    it('should handle connection timeout', async () => {
      // Arrange
      mockRedisClient.connect.mockImplementationOnce(() => 
        new Promise((resolve) => setTimeout(resolve, 3000))
      );

      // Act
      await service.onModuleInit();

      // Assert - Should handle timeout gracefully
      expect(mockRedisClient.connect).toHaveBeenCalled();
    });

    it('should handle connection errors gracefully', async () => {
      // Arrange
      mockRedisClient.connect.mockRejectedValueOnce(new Error('Connection failed'));

      // Act
      await service.onModuleInit();

      // Assert
      expect(service.isRedisConnected()).toBe(false);
    });
  });

  describe('onModuleDestroy', () => {
    it('should disconnect when connected', async () => {
      // Arrange
      await service.onModuleInit();
      (service as any).isConnected = true;

      // Act
      await service.onModuleDestroy();

      // Assert
      expect(mockRedisClient.disconnect).toHaveBeenCalled();
    });

    it('should not disconnect when not connected', async () => {
      // Arrange
      (service as any).isConnected = false;

      // Act
      await service.onModuleDestroy();

      // Assert
      expect(mockRedisClient.disconnect).not.toHaveBeenCalled();
    });
  });

  describe('getClient', () => {
    it('should return client when connected', () => {
      // Arrange
      (service as any).isConnected = true;
      (service as any).client = mockRedisClient;

      // Act
      const client = service.getClient();

      // Assert
      expect(client).toBe(mockRedisClient);
    });

    it('should return null when not connected', () => {
      // Arrange
      (service as any).isConnected = false;

      // Act
      const client = service.getClient();

      // Assert
      expect(client).toBeNull();
    });
  });

  describe('isRedisConnected', () => {
    it('should return true when connected', () => {
      // Arrange
      (service as any).isConnected = true;

      // Act
      const result = service.isRedisConnected();

      // Assert
      expect(result).toBe(true);
    });

    it('should return false when not connected', () => {
      // Arrange
      (service as any).isConnected = false;

      // Act
      const result = service.isRedisConnected();

      // Assert
      expect(result).toBe(false);
    });
  });

  describe('get', () => {
    it('should return null when not connected', async () => {
      // Arrange
      (service as any).isConnected = false;

      // Act
      const result = await service.get('test-key');

      // Assert
      expect(result).toBeNull();
    });

    it('should get value from Redis when connected', async () => {
      // Arrange
      (service as any).isConnected = true;
      (service as any).client = mockRedisClient;
      mockRedisClient.get.mockResolvedValue(JSON.stringify({ data: 'value' }));

      // Act
      const result = await service.get('test-key');

      // Assert
      expect(mockRedisClient.get).toHaveBeenCalledWith('test-key');
      expect(result).toEqual({ data: 'value' });
    });

    it('should return null when key does not exist', async () => {
      // Arrange
      (service as any).isConnected = true;
      (service as any).client = mockRedisClient;
      mockRedisClient.get.mockResolvedValue(null);

      // Act
      const result = await service.get('non-existent');

      // Assert
      expect(result).toBeNull();
    });

    it('should handle errors and mark as disconnected', async () => {
      // Arrange
      (service as any).isConnected = true;
      (service as any).client = mockRedisClient;
      mockRedisClient.get.mockRejectedValue(new Error('Redis error'));

      // Act
      const result = await service.get('test-key');

      // Assert
      expect(result).toBeNull();
      expect(service.isRedisConnected()).toBe(false);
    });
  });

  describe('set', () => {
    it('should return false when not connected', async () => {
      // Arrange
      (service as any).isConnected = false;

      // Act
      const result = await service.set('test-key', 'value');

      // Assert
      expect(result).toBe(false);
    });

    it('should set value without TTL when connected', async () => {
      // Arrange
      (service as any).isConnected = true;
      (service as any).client = mockRedisClient;
      mockRedisClient.set.mockResolvedValue('OK');

      // Act
      const result = await service.set('test-key', { data: 'value' });

      // Assert
      expect(mockRedisClient.set).toHaveBeenCalledWith('test-key', JSON.stringify({ data: 'value' }));
      expect(result).toBe(true);
    });

    it('should set value with TTL when provided', async () => {
      // Arrange
      (service as any).isConnected = true;
      (service as any).client = mockRedisClient;
      mockRedisClient.setEx.mockResolvedValue('OK');

      // Act
      const result = await service.set('test-key', 'value', 60);

      // Assert
      expect(mockRedisClient.setEx).toHaveBeenCalledWith('test-key', 60, JSON.stringify('value'));
      expect(result).toBe(true);
    });

    it('should handle errors and mark as disconnected', async () => {
      // Arrange
      (service as any).isConnected = true;
      (service as any).client = mockRedisClient;
      mockRedisClient.set.mockRejectedValue(new Error('Redis error'));

      // Act
      const result = await service.set('test-key', 'value');

      // Assert
      expect(result).toBe(false);
      expect(service.isRedisConnected()).toBe(false);
    });
  });

  describe('del', () => {
    it('should return false when not connected', async () => {
      // Arrange
      (service as any).isConnected = false;

      // Act
      const result = await service.del('test-key');

      // Assert
      expect(result).toBe(false);
    });

    it('should delete key when connected', async () => {
      // Arrange
      (service as any).isConnected = true;
      (service as any).client = mockRedisClient;
      mockRedisClient.del.mockResolvedValue(1);

      // Act
      const result = await service.del('test-key');

      // Assert
      expect(mockRedisClient.del).toHaveBeenCalledWith('test-key');
      expect(result).toBe(true);
    });

    it('should handle errors gracefully', async () => {
      // Arrange
      (service as any).isConnected = true;
      (service as any).client = mockRedisClient;
      mockRedisClient.del.mockRejectedValue(new Error('Redis error'));

      // Act
      const result = await service.del('test-key');

      // Assert
      expect(result).toBe(false);
    });
  });

  describe('exists', () => {
    it('should return false when not connected', async () => {
      // Arrange
      (service as any).isConnected = false;

      // Act
      const result = await service.exists('test-key');

      // Assert
      expect(result).toBe(false);
    });

    it('should return true when key exists', async () => {
      // Arrange
      (service as any).isConnected = true;
      (service as any).client = mockRedisClient;
      mockRedisClient.exists.mockResolvedValue(1);

      // Act
      const result = await service.exists('test-key');

      // Assert
      expect(result).toBe(true);
    });

    it('should return false when key does not exist', async () => {
      // Arrange
      (service as any).isConnected = true;
      (service as any).client = mockRedisClient;
      mockRedisClient.exists.mockResolvedValue(0);

      // Act
      const result = await service.exists('test-key');

      // Assert
      expect(result).toBe(false);
    });
  });

  describe('expire', () => {
    it('should return false when not connected', async () => {
      // Arrange
      (service as any).isConnected = false;

      // Act
      const result = await service.expire('test-key', 60);

      // Assert
      expect(result).toBe(false);
    });

    it('should set expiration when connected', async () => {
      // Arrange
      (service as any).isConnected = true;
      (service as any).client = mockRedisClient;
      mockRedisClient.expire.mockResolvedValue(1);

      // Act
      const result = await service.expire('test-key', 60);

      // Assert
      expect(mockRedisClient.expire).toHaveBeenCalledWith('test-key', 60);
      expect(result).toBe(true);
    });
  });

  describe('mget', () => {
    it('should return array of nulls when not connected', async () => {
      // Arrange
      (service as any).isConnected = false;
      const keys = ['key1', 'key2'];

      // Act
      const result = await service.mget(keys);

      // Assert
      expect(result).toEqual([null, null]);
    });

    it('should return array of nulls when keys array is empty', async () => {
      // Arrange
      (service as any).isConnected = true;
      (service as any).client = mockRedisClient;

      // Act
      const result = await service.mget([]);

      // Assert
      expect(result).toEqual([]);
    });

    it('should get multiple values when connected', async () => {
      // Arrange
      (service as any).isConnected = true;
      (service as any).client = mockRedisClient;
      mockRedisClient.mGet.mockResolvedValue([
        JSON.stringify('value1'),
        JSON.stringify('value2'),
      ]);

      // Act
      const result = await service.mget(['key1', 'key2']);

      // Assert
      expect(mockRedisClient.mGet).toHaveBeenCalledWith(['key1', 'key2']);
      expect(result).toEqual(['value1', 'value2']);
    });

    it('should handle null values in mget', async () => {
      // Arrange
      (service as any).isConnected = true;
      (service as any).client = mockRedisClient;
      mockRedisClient.mGet.mockResolvedValue([
        JSON.stringify('value1'),
        null,
      ]);

      // Act
      const result = await service.mget(['key1', 'key2']);

      // Assert
      expect(result).toEqual(['value1', null]);
    });
  });

  describe('mset', () => {
    it('should return false when not connected', async () => {
      // Arrange
      (service as any).isConnected = false;

      // Act
      const result = await service.mset({ key1: 'value1' });

      // Assert
      expect(result).toBe(false);
    });

    it('should return false when keys object is empty', async () => {
      // Arrange
      (service as any).isConnected = true;
      (service as any).client = mockRedisClient;

      // Act
      const result = await service.mset({});

      // Assert
      expect(result).toBe(false);
    });

    it('should set multiple values when connected', async () => {
      // Arrange
      (service as any).isConnected = true;
      (service as any).client = mockRedisClient;
      mockRedisClient.mSet.mockResolvedValue('OK');

      // Act
      const result = await service.mset({
        key1: 'value1',
        key2: 'value2',
      });

      // Assert
      expect(mockRedisClient.mSet).toHaveBeenCalled();
      expect(result).toBe(true);
    });

    it('should set TTL for all keys when provided', async () => {
      // Arrange
      (service as any).isConnected = true;
      (service as any).client = mockRedisClient;
      mockRedisClient.mSet.mockResolvedValue('OK');
      mockRedisClient.expire.mockResolvedValue(1);

      // Act
      const result = await service.mset({ key1: 'value1', key2: 'value2' }, 60);

      // Assert
      expect(mockRedisClient.expire).toHaveBeenCalledTimes(2);
      expect(result).toBe(true);
    });
  });

  describe('keys', () => {
    it('should return empty array when not connected', async () => {
      // Arrange
      (service as any).isConnected = false;

      // Act
      const result = await service.keys('pattern:*');

      // Assert
      expect(result).toEqual([]);
    });

    it('should return matching keys when connected', async () => {
      // Arrange
      (service as any).isConnected = true;
      (service as any).client = mockRedisClient;
      mockRedisClient.keys.mockResolvedValue(['key1', 'key2']);

      // Act
      const result = await service.keys('pattern:*');

      // Assert
      expect(mockRedisClient.keys).toHaveBeenCalledWith('pattern:*');
      expect(result).toEqual(['key1', 'key2']);
    });
  });

  describe('flushPattern', () => {
    it('should return 0 when not connected', async () => {
      // Arrange
      (service as any).isConnected = false;

      // Act
      const result = await service.flushPattern('pattern:*');

      // Assert
      expect(result).toBe(0);
    });

    it('should delete all matching keys', async () => {
      // Arrange
      (service as any).isConnected = true;
      (service as any).client = mockRedisClient;
      mockRedisClient.keys.mockResolvedValue(['key1', 'key2']);
      mockRedisClient.del.mockResolvedValue(2);

      // Act
      const result = await service.flushPattern('pattern:*');

      // Assert
      expect(mockRedisClient.del).toHaveBeenCalledWith(['key1', 'key2']);
      expect(result).toBe(2);
    });

    it('should return 0 when no keys match', async () => {
      // Arrange
      (service as any).isConnected = true;
      (service as any).client = mockRedisClient;
      mockRedisClient.keys.mockResolvedValue([]);

      // Act
      const result = await service.flushPattern('pattern:*');

      // Assert
      expect(result).toBe(0);
      expect(mockRedisClient.del).not.toHaveBeenCalled();
    });
  });

  describe('getStats', () => {
    it('should return connected: false when not connected', async () => {
      // Arrange
      (service as any).isConnected = false;

      // Act
      const result = await service.getStats();

      // Assert
      expect(result).toEqual({ connected: false });
    });

    it('should return stats when connected', async () => {
      // Arrange
      (service as any).isConnected = true;
      (service as any).client = mockRedisClient;
      mockRedisClient.info.mockResolvedValue('used_memory_human:1.5M\n');
      mockRedisClient.dbSize.mockResolvedValue(100);

      // Act
      const result = await service.getStats();

      // Assert
      expect(result.connected).toBe(true);
      expect(result.memoryUsage).toBe('1.5M');
      expect(result.keyCount).toBe(100);
    });

    it('should handle errors gracefully', async () => {
      // Arrange
      (service as any).isConnected = true;
      (service as any).client = mockRedisClient;
      mockRedisClient.info.mockRejectedValue(new Error('Redis error'));

      // Act
      const result = await service.getStats();

      // Assert
      expect(result).toEqual({ connected: false });
    });
  });
});

