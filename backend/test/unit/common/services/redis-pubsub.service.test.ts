/**
 * Redis Pub/Sub Service Unit Tests
 * Tests for Redis pub/sub operations for WebSocket scaling
 */

import { Test, TestingModule } from '@nestjs/testing';
import { RedisPubSubService } from '../../../../src/common/services/redis-pubsub.service';
import { ConfigService } from '@nestjs/config';

// Mock ioredis
const mockPublisher = {
  publish: jest.fn().mockResolvedValue(1),
  quit: jest.fn().mockResolvedValue('OK'),
  on: jest.fn(),
};

const mockSubscriber = {
  subscribe: jest.fn().mockResolvedValue(1),
  unsubscribe: jest.fn().mockResolvedValue(1),
  quit: jest.fn().mockResolvedValue('OK'),
  on: jest.fn(),
};

// Mock ioredis - using manual mock from test/mocks/ioredis.mock.ts
// Override the default mock to return different instances for publisher/subscriber
jest.mock('ioredis', () => {
  const MockRedis = jest.fn().mockImplementation(() => {
    // Return different instances for publisher and subscriber
    const callCount = (MockRedis as any).mock.calls.length;
    if (callCount % 2 === 0) {
      return mockPublisher;
    }
    return mockSubscriber;
  });
  return MockRedis;
});

describe('RedisPubSubService', () => {
  let service: RedisPubSubService;
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
        RedisPubSubService,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<RedisPubSubService>(RedisPubSubService);
    configService = module.get<ConfigService>(ConfigService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('onModuleInit and initialization', () => {
    it('should initialize Redis pub/sub when URL is provided', async () => {
      // Act
      await service.onModuleInit();

      // Assert
      expect(mockPublisher.on).toHaveBeenCalledWith('error', expect.any(Function));
      expect(mockPublisher.on).toHaveBeenCalledWith('connect', expect.any(Function));
      expect(mockSubscriber.on).toHaveBeenCalledWith('error', expect.any(Function));
      expect(mockSubscriber.on).toHaveBeenCalledWith('connect', expect.any(Function));
      expect(mockSubscriber.on).toHaveBeenCalledWith('message', expect.any(Function));
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
          RedisPubSubService,
          {
            provide: ConfigService,
            useValue: configServiceWithoutRedis,
          },
        ],
      }).compile();

      const serviceWithoutRedis = module.get<RedisPubSubService>(RedisPubSubService);

      // Act
      await serviceWithoutRedis.onModuleInit();

      // Assert
      expect(serviceWithoutRedis.isReady()).toBe(false);
    });

    it('should handle initialization errors gracefully', async () => {
      // Arrange
      const Redis = require('ioredis');
      Redis.mockImplementationOnce(() => {
        throw new Error('Redis connection failed');
      });

      const module: TestingModule = await Test.createTestingModule({
        providers: [
          RedisPubSubService,
          {
            provide: ConfigService,
            useValue: mockConfigService,
          },
        ],
      }).compile();

      const serviceWithError = module.get<RedisPubSubService>(RedisPubSubService);

      // Act
      await serviceWithError.onModuleInit();

      // Assert
      expect(serviceWithError.isReady()).toBe(false);
    });
  });

  describe('onModuleDestroy', () => {
    it('should disconnect publisher and subscriber', async () => {
      // Arrange
      await service.onModuleInit();
      (service as any).isConnected = true;
      (service as any).publisher = mockPublisher;
      (service as any).subscriber = mockSubscriber;

      // Act
      await service.onModuleDestroy();

      // Assert
      expect(mockPublisher.quit).toHaveBeenCalled();
      expect(mockSubscriber.quit).toHaveBeenCalled();
    });

    it('should clear message handlers', async () => {
      // Arrange
      await service.onModuleInit();
      (service as any).isConnected = true;
      (service as any).publisher = mockPublisher;
      (service as any).subscriber = mockSubscriber;
      (service as any).messageHandlers.set('channel1', new Set([jest.fn()]));

      // Act
      await service.onModuleDestroy();

      // Assert
      expect((service as any).messageHandlers.size).toBe(0);
    });
  });

  describe('publish', () => {
    it('should not publish when not connected', async () => {
      // Arrange
      (service as any).isConnected = false;

      // Act
      await service.publish('test-channel', 'message');

      // Assert
      expect(mockPublisher.publish).not.toHaveBeenCalled();
    });

    it('should publish string message', async () => {
      // Arrange
      (service as any).isConnected = true;
      (service as any).publisher = mockPublisher;

      // Act
      await service.publish('test-channel', 'message');

      // Assert
      expect(mockPublisher.publish).toHaveBeenCalledWith('test-channel', 'message');
    });

    it('should publish object as JSON string', async () => {
      // Arrange
      (service as any).isConnected = true;
      (service as any).publisher = mockPublisher;
      const message = { type: 'event', data: 'test' };

      // Act
      await service.publish('test-channel', message);

      // Assert
      expect(mockPublisher.publish).toHaveBeenCalledWith('test-channel', JSON.stringify(message));
    });

    it('should handle publish errors', async () => {
      // Arrange
      (service as any).isConnected = true;
      (service as any).publisher = mockPublisher;
      mockPublisher.publish.mockRejectedValueOnce(new Error('Publish failed'));

      // Act & Assert
      await expect(service.publish('test-channel', 'message')).rejects.toThrow('Publish failed');
    });
  });

  describe('subscribe', () => {
    it('should not subscribe when not connected', async () => {
      // Arrange
      (service as any).isConnected = false;
      const handler = jest.fn();

      // Act
      await service.subscribe('test-channel', handler);

      // Assert
      expect(mockSubscriber.subscribe).not.toHaveBeenCalled();
    });

    it('should subscribe to channel and add handler', async () => {
      // Arrange
      (service as any).isConnected = true;
      (service as any).subscriber = mockSubscriber;
      const handler = jest.fn();

      // Act
      await service.subscribe('test-channel', handler);

      // Assert
      expect(mockSubscriber.subscribe).toHaveBeenCalledWith('test-channel');
      const handlers = (service as any).messageHandlers.get('test-channel');
      expect(handlers).toBeDefined();
      expect(handlers.has(handler)).toBe(true);
    });

    it('should add multiple handlers to same channel', async () => {
      // Arrange
      (service as any).isConnected = true;
      (service as any).subscriber = mockSubscriber;
      const handler1 = jest.fn();
      const handler2 = jest.fn();

      // Act
      await service.subscribe('test-channel', handler1);
      await service.subscribe('test-channel', handler2);

      // Assert
      expect(mockSubscriber.subscribe).toHaveBeenCalledTimes(1); // Only subscribe once
      const handlers = (service as any).messageHandlers.get('test-channel');
      expect(handlers.size).toBe(2);
    });

    it('should handle subscribe errors', async () => {
      // Arrange
      (service as any).isConnected = true;
      (service as any).subscriber = mockSubscriber;
      mockSubscriber.subscribe.mockRejectedValueOnce(new Error('Subscribe failed'));
      const handler = jest.fn();

      // Act & Assert
      await expect(service.subscribe('test-channel', handler)).rejects.toThrow('Subscribe failed');
    });
  });

  describe('unsubscribe', () => {
    it('should not unsubscribe when not connected', async () => {
      // Arrange
      (service as any).isConnected = false;

      // Act
      await service.unsubscribe('test-channel');

      // Assert
      expect(mockSubscriber.unsubscribe).not.toHaveBeenCalled();
    });

    it('should remove specific handler and keep channel subscribed', async () => {
      // Arrange
      (service as any).isConnected = true;
      (service as any).subscriber = mockSubscriber;
      const handler1 = jest.fn();
      const handler2 = jest.fn();
      await service.subscribe('test-channel', handler1);
      await service.subscribe('test-channel', handler2);

      // Act
      await service.unsubscribe('test-channel', handler1);

      // Assert
      const handlers = (service as any).messageHandlers.get('test-channel');
      expect(handlers.size).toBe(1);
      expect(handlers.has(handler2)).toBe(true);
      expect(mockSubscriber.unsubscribe).not.toHaveBeenCalled(); // Still has handler2
    });

    it('should unsubscribe from channel when no handlers left', async () => {
      // Arrange
      (service as any).isConnected = true;
      (service as any).subscriber = mockSubscriber;
      const handler = jest.fn();
      await service.subscribe('test-channel', handler);

      // Act
      await service.unsubscribe('test-channel', handler);

      // Assert
      expect(mockSubscriber.unsubscribe).toHaveBeenCalledWith('test-channel');
      expect((service as any).messageHandlers.has('test-channel')).toBe(false);
    });

    it('should remove all handlers when handler not specified', async () => {
      // Arrange
      (service as any).isConnected = true;
      (service as any).subscriber = mockSubscriber;
      const handler1 = jest.fn();
      const handler2 = jest.fn();
      await service.subscribe('test-channel', handler1);
      await service.subscribe('test-channel', handler2);

      // Act
      await service.unsubscribe('test-channel');

      // Assert
      expect(mockSubscriber.unsubscribe).toHaveBeenCalledWith('test-channel');
      expect((service as any).messageHandlers.has('test-channel')).toBe(false);
    });

    it('should handle unsubscribe errors', async () => {
      // Arrange
      (service as any).isConnected = true;
      (service as any).subscriber = mockSubscriber;
      mockSubscriber.unsubscribe.mockRejectedValueOnce(new Error('Unsubscribe failed'));

      // Act & Assert
      await expect(service.unsubscribe('test-channel')).rejects.toThrow('Unsubscribe failed');
    });
  });

  describe('handleMessage', () => {
    it('should call all handlers for channel', () => {
      // Arrange
      const handler1 = jest.fn();
      const handler2 = jest.fn();
      (service as any).messageHandlers.set('test-channel', new Set([handler1, handler2]));

      // Act
      (service as any).handleMessage('test-channel', 'test message');

      // Assert
      expect(handler1).toHaveBeenCalledWith('test-channel', 'test message');
      expect(handler2).toHaveBeenCalledWith('test-channel', 'test message');
    });

    it('should not call handlers for non-existent channel', () => {
      // Arrange
      const handler = jest.fn();

      // Act
      (service as any).handleMessage('non-existent', 'message');

      // Assert
      expect(handler).not.toHaveBeenCalled();
    });

    it('should handle handler errors gracefully', () => {
      // Arrange
      const handler1 = jest.fn().mockImplementation(() => {
        throw new Error('Handler error');
      });
      const handler2 = jest.fn();
      (service as any).messageHandlers.set('test-channel', new Set([handler1, handler2]));

      // Act
      (service as any).handleMessage('test-channel', 'message');

      // Assert
      expect(handler1).toHaveBeenCalled();
      expect(handler2).toHaveBeenCalled(); // Should still call handler2
    });
  });

  describe('isReady', () => {
    it('should return true when connected', () => {
      // Arrange
      (service as any).isConnected = true;

      // Act
      const result = service.isReady();

      // Assert
      expect(result).toBe(true);
    });

    it('should return false when not connected', () => {
      // Arrange
      (service as any).isConnected = false;

      // Act
      const result = service.isReady();

      // Assert
      expect(result).toBe(false);
    });
  });
});

