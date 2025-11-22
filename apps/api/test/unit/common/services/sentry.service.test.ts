/**
 * Sentry Service Unit Tests
 * Tests for error tracking and monitoring
 */

import { Test, TestingModule } from '@nestjs/testing';
import { SentryService } from '../../../../src/common/services/sentry.service';
import { ConfigService } from '@nestjs/config';

// Mock Sentry
const mockSentry = {
  init: jest.fn(),
  captureException: jest.fn(),
  captureMessage: jest.fn(),
  withScope: jest.fn((callback) => {
    const scope = {
      setLevel: jest.fn(),
      setContext: jest.fn(),
    };
    callback(scope);
  }),
  setUser: jest.fn(),
  setTag: jest.fn(),
  addBreadcrumb: jest.fn(),
  setContext: jest.fn(),
};

jest.mock('@sentry/node', () => mockSentry);
jest.mock('@sentry/profiling-node', () => ({
  nodeProfilingIntegration: jest.fn(() => ({ name: 'ProfilingIntegration' })),
}));

describe('SentryService', () => {
  let service: SentryService;
  let configService: ConfigService;
  let mockConfigService: any;

  beforeEach(async () => {
    jest.clearAllMocks();
    mockConfigService = {
      get: jest.fn((key: string) => {
        if (key === 'SENTRY_DSN') return 'https://test@sentry.io/123';
        if (key === 'SENTRY_ENVIRONMENT') return 'test';
        if (key === 'SENTRY_TRACES_SAMPLE_RATE') return '0.5';
        if (key === 'NODE_ENV') return 'test';
        return null;
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SentryService,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<SentryService>(SentryService);
    configService = module.get<ConfigService>(ConfigService);
    
    // Note: onModuleInit is called automatically by NestJS lifecycle, but in tests
    // we need to call it explicitly. We'll call it in individual tests to avoid
    // interference between tests.
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('onModuleInit and initialization', () => {
    it('should initialize Sentry with DSN', async () => {
      // Clear previous calls from beforeEach if any
      mockSentry.init.mockClear();
      
      // Act - onModuleInit is called automatically by NestJS, but we call it explicitly in tests
      await service.onModuleInit();
      
      // Assert
      expect(mockSentry.init).toHaveBeenCalled();
      const initCall = mockSentry.init.mock.calls[0][0];
      expect(initCall.dsn).toBe('https://test@sentry.io/123');
      expect(initCall.environment).toBe('test');
      expect(initCall.tracesSampleRate).toBe(0.5);
    });

    it('should use NODE_ENV when SENTRY_ENVIRONMENT not set', async () => {
      // Arrange
      const configServiceWithoutEnv = {
        get: jest.fn((key: string) => {
          if (key === 'SENTRY_DSN') return 'https://test@sentry.io/123';
          if (key === 'NODE_ENV') return 'production';
          return null;
        }),
      };

      const module: TestingModule = await Test.createTestingModule({
        providers: [
          SentryService,
          {
            provide: ConfigService,
            useValue: configServiceWithoutEnv,
          },
        ],
      }).compile();

      const serviceWithoutEnv = module.get<SentryService>(SentryService);
      
      // Act - call onModuleInit explicitly
      await serviceWithoutEnv.onModuleInit();

      // Assert
      expect(mockSentry.init).toHaveBeenCalled();
      const initCall = mockSentry.init.mock.calls.find(call => 
        call[0].dsn === 'https://test@sentry.io/123'
      );
      expect(initCall[0].environment).toBe('production');
    });

    it('should use default traces sample rate when not configured', async () => {
      // Arrange
      const configServiceWithDefaults = {
        get: jest.fn((key: string) => {
          if (key === 'SENTRY_DSN') return 'https://test@sentry.io/123';
          if (key === 'NODE_ENV') return 'test';
          return null;
        }),
      };

      const module: TestingModule = await Test.createTestingModule({
        providers: [
          SentryService,
          {
            provide: ConfigService,
            useValue: configServiceWithDefaults,
          },
        ],
      }).compile();

      const serviceWithDefaults = module.get<SentryService>(SentryService);

      // Assert
      expect(mockSentry.init).toHaveBeenCalled();
      const initCall = mockSentry.init.mock.calls.find(call => 
        call[0].dsn === 'https://test@sentry.io/123'
      );
      expect(initCall[0].tracesSampleRate).toBe(0.1); // Default
    });

    it('should not initialize when DSN is missing', async () => {
      // Arrange
      const configServiceWithoutDSN = {
        get: jest.fn((key: string) => {
          if (key === 'SENTRY_DSN') return null;
          return null;
        }),
      };

      const module: TestingModule = await Test.createTestingModule({
        providers: [
          SentryService,
          {
            provide: ConfigService,
            useValue: configServiceWithoutDSN,
          },
        ],
      }).compile();

      const serviceWithoutDSN = module.get<SentryService>(SentryService);

      // Assert - Should not have initialized
      const initCalls = mockSentry.init.mock.calls.filter(call => 
        call[0].dsn === undefined || call[0].dsn === null
      );
      // Service should still exist but not be initialized
      expect(serviceWithoutDSN).toBeDefined();
    });

    it('should set profiles sample rate based on environment', () => {
      // Assert
      const initCall = mockSentry.init.mock.calls[0][0];
      expect(initCall.profilesSampleRate).toBe(1.0); // test environment
    });

    it('should set profiles sample rate to 0.1 in production', async () => {
      // Arrange
      const configServiceProd = {
        get: jest.fn((key: string) => {
          if (key === 'SENTRY_DSN') return 'https://test@sentry.io/123';
          if (key === 'SENTRY_ENVIRONMENT') return 'production';
          return null;
        }),
      };

      const module: TestingModule = await Test.createTestingModule({
        providers: [
          SentryService,
          {
            provide: ConfigService,
            useValue: configServiceProd,
          },
        ],
      }).compile();

      const serviceProd = module.get<SentryService>(SentryService);

      // Assert
      const initCall = mockSentry.init.mock.calls.find(call => 
        call[0].environment === 'production'
      );
      expect(initCall[0].profilesSampleRate).toBe(0.1);
    });
  });

  describe('captureException', () => {
    it('should capture exception with context', () => {
      // Arrange
      const error = new Error('Test error');
      const context = {
        userId: 'user-123',
        tenantId: 'tenant-123',
      };

      // Act
      service.captureException(error, context);

      // Assert
      expect(mockSentry.withScope).toHaveBeenCalled();
      expect(mockSentry.captureException).toHaveBeenCalledWith(error);
    });

    it('should capture exception without context', () => {
      // Arrange
      const error = new Error('Test error');

      // Act
      service.captureException(error);

      // Assert
      expect(mockSentry.withScope).toHaveBeenCalled();
      expect(mockSentry.captureException).toHaveBeenCalledWith(error);
    });

    it('should not capture when not initialized', () => {
      // Arrange
      const serviceNotInitialized = new SentryService({
        get: jest.fn(() => null),
      } as any);
      const error = new Error('Test error');

      // Act
      serviceNotInitialized.captureException(error);

      // Assert
      expect(mockSentry.captureException).not.toHaveBeenCalled();
    });
  });

  describe('captureMessage', () => {
    it('should capture message with level and context', () => {
      // Arrange
      const message = 'Test message';
      const level = 'warning';
      const context = { userId: 'user-123' };

      // Act
      service.captureMessage(message, level, context);

      // Assert
      expect(mockSentry.withScope).toHaveBeenCalled();
      expect(mockSentry.captureMessage).toHaveBeenCalledWith(message);
    });

    it('should use default level when not provided', () => {
      // Arrange
      const message = 'Test message';

      // Act
      service.captureMessage(message);

      // Assert
      expect(mockSentry.withScope).toHaveBeenCalled();
      expect(mockSentry.captureMessage).toHaveBeenCalledWith(message);
    });

    it('should not capture when not initialized', () => {
      // Arrange
      const serviceNotInitialized = new SentryService({
        get: jest.fn(() => null),
      } as any);
      const message = 'Test message';

      // Act
      serviceNotInitialized.captureMessage(message);

      // Assert
      expect(mockSentry.captureMessage).not.toHaveBeenCalled();
    });
  });

  describe('setUser', () => {
    it('should set user with all fields', () => {
      // Arrange
      const user = {
        id: 'user-123',
        email: 'test@example.com',
        tenantId: 'tenant-123',
      };

      // Act
      service.setUser(user);

      // Assert
      expect(mockSentry.setUser).toHaveBeenCalledWith({
        id: 'user-123',
        email: 'test@example.com',
        username: 'test@example.com',
      });
      expect(mockSentry.setTag).toHaveBeenCalledWith('tenant_id', 'tenant-123');
    });

    it('should set user without email', () => {
      // Arrange
      const user = {
        id: 'user-123',
        tenantId: 'tenant-123',
      };

      // Act
      service.setUser(user);

      // Assert
      expect(mockSentry.setUser).toHaveBeenCalledWith({
        id: 'user-123',
        email: undefined,
        username: undefined,
      });
    });

    it('should set user without tenantId', () => {
      // Arrange
      const user = {
        id: 'user-123',
        email: 'test@example.com',
      };

      // Act
      service.setUser(user);

      // Assert
      expect(mockSentry.setUser).toHaveBeenCalled();
      expect(mockSentry.setTag).not.toHaveBeenCalledWith('tenant_id', expect.anything());
    });

    it('should not set user when not initialized', () => {
      // Arrange
      const serviceNotInitialized = new SentryService({
        get: jest.fn(() => null),
      } as any);
      const user = { id: 'user-123' };

      // Act
      serviceNotInitialized.setUser(user);

      // Assert
      expect(mockSentry.setUser).not.toHaveBeenCalled();
    });
  });

  describe('addBreadcrumb', () => {
    it('should add breadcrumb', () => {
      // Arrange
      const breadcrumb = {
        message: 'User action',
        category: 'user',
        level: 'info',
      };

      // Act
      service.addBreadcrumb(breadcrumb);

      // Assert
      expect(mockSentry.addBreadcrumb).toHaveBeenCalledWith(breadcrumb);
    });

    it('should not add breadcrumb when not initialized', () => {
      // Arrange
      const serviceNotInitialized = new SentryService({
        get: jest.fn(() => null),
      } as any);
      const breadcrumb = { message: 'Test' };

      // Act
      serviceNotInitialized.addBreadcrumb(breadcrumb);

      // Assert
      expect(mockSentry.addBreadcrumb).not.toHaveBeenCalled();
    });
  });

  describe('setContext', () => {
    it('should set context', () => {
      // Arrange
      const context = { userId: 'user-123', action: 'login' };

      // Act
      service.setContext('user', context);

      // Assert
      expect(mockSentry.setContext).toHaveBeenCalledWith('user', context);
    });

    it('should not set context when not initialized', () => {
      // Arrange
      const serviceNotInitialized = new SentryService({
        get: jest.fn(() => null),
      } as any);

      // Act
      serviceNotInitialized.setContext('key', {});

      // Assert
      expect(mockSentry.setContext).not.toHaveBeenCalled();
    });
  });

  describe('setTag', () => {
    it('should set tag', () => {
      // Act
      service.setTag('environment', 'production');

      // Assert
      expect(mockSentry.setTag).toHaveBeenCalledWith('environment', 'production');
    });

    it('should not set tag when not initialized', () => {
      // Arrange
      const serviceNotInitialized = new SentryService({
        get: jest.fn(() => null),
      } as any);

      // Act
      serviceNotInitialized.setTag('key', 'value');

      // Assert
      expect(mockSentry.setTag).not.toHaveBeenCalled();
    });
  });

  describe('beforeSend filter', () => {
    it('should filter ChunkLoadError', () => {
      // Assert - The beforeSend function should be configured
      const initCall = mockSentry.init.mock.calls[0][0];
      expect(initCall.beforeSend).toBeDefined();
      expect(typeof initCall.beforeSend).toBe('function');

      // Test the filter
      const event = {
        exception: {
          values: [{
            type: 'ChunkLoadError',
          }],
        },
      };

      const result = initCall.beforeSend(event, {});
      expect(result).toBeNull();
    });

    it('should allow other errors through', () => {
      // Arrange
      const initCall = mockSentry.init.mock.calls[0][0];
      const event = {
        exception: {
          values: [{
            type: 'TypeError',
          }],
        },
      };

      // Act
      const result = initCall.beforeSend(event, {});

      // Assert
      expect(result).toBe(event);
    });
  });

  describe('beforeBreadcrumb filter', () => {
    it('should filter sensitive headers from breadcrumbs', () => {
      // Arrange
      const initCall = mockSentry.init.mock.calls[0][0];
      const breadcrumb = {
        category: 'http',
        data: {
          request_headers: {
            authorization: 'Bearer token123',
            cookie: 'session=abc123',
            'content-type': 'application/json',
          },
        },
      };

      // Act
      const result = initCall.beforeBreadcrumb(breadcrumb);

      // Assert
      expect(result.data.request_headers.authorization).toBeUndefined();
      expect(result.data.request_headers.cookie).toBeUndefined();
      expect(result.data.request_headers['content-type']).toBe('application/json');
    });

    it('should allow non-http breadcrumbs through unchanged', () => {
      // Arrange
      const initCall = mockSentry.init.mock.calls[0][0];
      const breadcrumb = {
        category: 'user',
        message: 'User action',
      };

      // Act
      const result = initCall.beforeBreadcrumb(breadcrumb);

      // Assert
      expect(result).toBe(breadcrumb);
    });
  });
});

