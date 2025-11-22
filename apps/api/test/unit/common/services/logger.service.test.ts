/**
 * Structured Logger Service Unit Tests
 * Tests for structured logging with request context
 */

import { Test, TestingModule } from '@nestjs/testing';
import { StructuredLoggerService } from '../../../../src/common/services/logger.service';
import { ConfigService } from '@nestjs/config';

describe('StructuredLoggerService', () => {
  let service: StructuredLoggerService;
  let configService: ConfigService;
  let mockConfigService: any;
  let consoleLogSpy: jest.SpyInstance;
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(async () => {
    mockConfigService = {
      get: jest.fn((key: string) => {
        if (key === 'NODE_ENV') return 'development';
        return null;
      }),
    };

    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StructuredLoggerService,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<StructuredLoggerService>(StructuredLoggerService);
    configService = module.get<ConfigService>(ConfigService);
  });

  afterEach(() => {
    jest.clearAllMocks();
    consoleLogSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });

  describe('setRequestContext and getRequestContext', () => {
    it('should set and retrieve request context', () => {
      // Arrange
      const requestId = 'request-123';
      const context = {
        tenantId: 'tenant-123',
        userId: 'user-123',
        ipAddress: '192.168.1.1',
      };

      // Act
      service.setRequestContext(requestId, context);
      const retrieved = service.getRequestContext(requestId);

      // Assert
      expect(retrieved).toEqual(context);
    });

    it('should return undefined for non-existent request context', () => {
      // Act
      const retrieved = service.getRequestContext('non-existent');

      // Assert
      expect(retrieved).toBeUndefined();
    });

    it('should overwrite existing request context', () => {
      // Arrange
      const requestId = 'request-123';
      const context1 = { tenantId: 'tenant-1' };
      const context2 = { tenantId: 'tenant-2' };

      // Act
      service.setRequestContext(requestId, context1);
      service.setRequestContext(requestId, context2);
      const retrieved = service.getRequestContext(requestId);

      // Assert
      expect(retrieved).toEqual(context2);
    });
  });

  describe('clearRequestContext', () => {
    it('should clear request context', () => {
      // Arrange
      const requestId = 'request-123';
      const context = { tenantId: 'tenant-123' };
      service.setRequestContext(requestId, context);

      // Act
      service.clearRequestContext(requestId);
      const retrieved = service.getRequestContext(requestId);

      // Assert
      expect(retrieved).toBeUndefined();
    });

    it('should handle clearing non-existent context gracefully', () => {
      // Act & Assert - should not throw
      expect(() => service.clearRequestContext('non-existent')).not.toThrow();
    });
  });

  describe('log', () => {
    it('should log message in development mode', () => {
      // Arrange
      mockConfigService.get.mockReturnValue('development');
      const message = 'Test log message';
      const context = 'TestContext';

      // Act
      service.log(message, context);

      // Assert
      expect(consoleLogSpy).toHaveBeenCalled();
    });

    it('should log with request context in production mode', () => {
      // Arrange
      mockConfigService.get.mockReturnValue('production');
      const requestId = 'request-123';
      const context = { tenantId: 'tenant-123' };
      service.setRequestContext(requestId, context);
      const message = 'Test log message';

      // Act
      service.log(message, 'TestContext', requestId);

      // Assert
      expect(consoleLogSpy).toHaveBeenCalled();
      const logCall = consoleLogSpy.mock.calls[0][0];
      expect(logCall).toContain('tenantId');
    });

    it('should log without request context when requestId not provided', () => {
      // Arrange
      mockConfigService.get.mockReturnValue('production');
      const message = 'Test log message';

      // Act
      service.log(message);

      // Assert
      expect(consoleLogSpy).toHaveBeenCalled();
      const logCall = JSON.parse(consoleLogSpy.mock.calls[0][0]);
      expect(logCall.message).toBe(message);
      expect(logCall.level).toBe('log');
    });
  });

  describe('error', () => {
    it('should log error in development mode', () => {
      // Arrange
      mockConfigService.get.mockReturnValue('development');
      const message = 'Test error message';
      const trace = 'Error trace';
      const context = 'TestContext';

      // Act
      service.error(message, trace, context);

      // Assert
      expect(consoleErrorSpy).toHaveBeenCalled();
    });

    it('should log error with trace in production mode', () => {
      // Arrange
      mockConfigService.get.mockReturnValue('production');
      const requestId = 'request-123';
      const context = { tenantId: 'tenant-123' };
      service.setRequestContext(requestId, context);
      const message = 'Test error message';
      const trace = 'Error trace';

      // Act
      service.error(message, trace, 'TestContext', requestId);

      // Assert
      expect(consoleErrorSpy).toHaveBeenCalled();
      const errorCall = JSON.parse(consoleErrorSpy.mock.calls[0][0]);
      expect(errorCall.message).toBe(message);
      expect(errorCall.trace).toBe(trace);
      expect(errorCall.level).toBe('error');
    });

    it('should log error without trace when not provided', () => {
      // Arrange
      mockConfigService.get.mockReturnValue('production');
      const message = 'Test error message';

      // Act
      service.error(message);

      // Assert
      expect(consoleErrorSpy).toHaveBeenCalled();
      const errorCall = JSON.parse(consoleErrorSpy.mock.calls[0][0]);
      expect(errorCall.message).toBe(message);
      expect(errorCall.trace).toBeUndefined();
    });
  });

  describe('warn', () => {
    it('should log warning message', () => {
      // Arrange
      mockConfigService.get.mockReturnValue('development');
      const message = 'Test warning message';

      // Act
      service.warn(message);

      // Assert
      expect(consoleLogSpy).toHaveBeenCalled();
    });

    it('should include request context in production', () => {
      // Arrange
      mockConfigService.get.mockReturnValue('production');
      const requestId = 'request-123';
      const context = { userId: 'user-123' };
      service.setRequestContext(requestId, context);
      const message = 'Test warning message';

      // Act
      service.warn(message, 'TestContext', requestId);

      // Assert
      expect(consoleLogSpy).toHaveBeenCalled();
      const warnCall = JSON.parse(consoleLogSpy.mock.calls[0][0]);
      expect(warnCall.level).toBe('warn');
      expect(warnCall.message).toBe(message);
    });
  });

  describe('debug', () => {
    it('should log debug message', () => {
      // Arrange
      mockConfigService.get.mockReturnValue('development');
      const message = 'Test debug message';

      // Act
      service.debug(message);

      // Assert
      expect(consoleLogSpy).toHaveBeenCalled();
    });

    it('should include request context in production', () => {
      // Arrange
      mockConfigService.get.mockReturnValue('production');
      const requestId = 'request-123';
      const context = { tenantId: 'tenant-123' };
      service.setRequestContext(requestId, context);
      const message = 'Test debug message';

      // Act
      service.debug(message, 'TestContext', requestId);

      // Assert
      expect(consoleLogSpy).toHaveBeenCalled();
      const debugCall = JSON.parse(consoleLogSpy.mock.calls[0][0]);
      expect(debugCall.level).toBe('debug');
    });
  });

  describe('verbose', () => {
    it('should log verbose message', () => {
      // Arrange
      mockConfigService.get.mockReturnValue('development');
      const message = 'Test verbose message';

      // Act
      service.verbose(message);

      // Assert
      expect(consoleLogSpy).toHaveBeenCalled();
    });

    it('should include request context in production', () => {
      // Arrange
      mockConfigService.get.mockReturnValue('production');
      const requestId = 'request-123';
      const context = { tenantId: 'tenant-123' };
      service.setRequestContext(requestId, context);
      const message = 'Test verbose message';

      // Act
      service.verbose(message, 'TestContext', requestId);

      // Assert
      expect(consoleLogSpy).toHaveBeenCalled();
      const verboseCall = JSON.parse(consoleLogSpy.mock.calls[0][0]);
      expect(verboseCall.level).toBe('verbose');
    });
  });

  describe('production vs development logging', () => {
    it('should output JSON in production mode', () => {
      // Arrange
      mockConfigService.get.mockReturnValue('production');
      const message = 'Test message';

      // Act
      service.log(message);

      // Assert
      expect(consoleLogSpy).toHaveBeenCalled();
      const logCall = consoleLogSpy.mock.calls[0][0];
      expect(() => JSON.parse(logCall)).not.toThrow();
      const parsed = JSON.parse(logCall);
      expect(parsed).toHaveProperty('timestamp');
      expect(parsed).toHaveProperty('level');
      expect(parsed).toHaveProperty('message');
      expect(parsed).toHaveProperty('context');
    });

    it('should use formatted logging in development mode', () => {
      // Arrange
      mockConfigService.get.mockReturnValue('development');
      const message = 'Test message';

      // Act
      service.log(message, 'TestContext');

      // Assert
      expect(consoleLogSpy).toHaveBeenCalled();
    });
  });
});

