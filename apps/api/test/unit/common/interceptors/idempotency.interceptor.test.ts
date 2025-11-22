/**
 * Idempotency Interceptor Unit Tests
 * Tests for idempotency key handling and response caching
 */

import { Test, TestingModule } from '@nestjs/testing';
import { IdempotencyInterceptor } from '../../../../src/common/interceptors/idempotency.interceptor';
import { IdempotencyService } from '../../../../src/common/services/idempotency.service';
import { Reflector } from '@nestjs/core';
import { ExecutionContext, CallHandler } from '@nestjs/common';
import { of } from 'rxjs';
import { IDEMPOTENCY_KEY } from '../../../../src/common/decorators/idempotency.decorator';

describe('IdempotencyInterceptor', () => {
  let interceptor: IdempotencyInterceptor;
  let idempotencyService: IdempotencyService;
  let reflector: Reflector;
  let mockIdempotencyService: any;
  let mockReflector: any;
  let mockExecutionContext: Partial<ExecutionContext>;
  let mockCallHandler: CallHandler;
  let mockRequest: any;
  let mockResponse: any;

  const userId = 'user-123';
  const tenantId = 'tenant-123';
  const idempotencyKey = 'idempotency-key-123';

  beforeEach(async () => {
    mockIdempotencyService = {
      checkKey: jest.fn(),
      storeKey: jest.fn(),
    };

    mockReflector = {
      getAllAndOverride: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IdempotencyInterceptor,
        {
          provide: IdempotencyService,
          useValue: mockIdempotencyService,
        },
        {
          provide: Reflector,
          useValue: mockReflector,
        },
      ],
    }).compile();

    interceptor = module.get<IdempotencyInterceptor>(IdempotencyInterceptor);
    idempotencyService = module.get<IdempotencyService>(IdempotencyService);
    reflector = module.get<Reflector>(Reflector);

    mockResponse = {
      statusCode: 200,
      status: jest.fn().mockReturnThis(),
    };

    mockRequest = {
      headers: {},
      user: {
        userId,
        tenantId,
      },
    };

    mockExecutionContext = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue(mockRequest),
        getResponse: jest.fn().mockReturnValue(mockResponse),
      }),
      getHandler: jest.fn(),
      getClass: jest.fn(),
    } as any;

    mockCallHandler = {
      handle: jest.fn().mockReturnValue(of({ data: 'test' })),
    } as any;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('intercept - non-idempotent endpoint', () => {
    it('should pass through when endpoint is not marked as idempotent', async () => {
      // Arrange
      mockReflector.getAllAndOverride.mockReturnValue(false);

      // Act
      const result = await interceptor.intercept(
        mockExecutionContext as ExecutionContext,
        mockCallHandler
      );

      // Assert
      expect(mockReflector.getAllAndOverride).toHaveBeenCalledWith(
        IDEMPOTENCY_KEY,
        [mockExecutionContext.getHandler(), mockExecutionContext.getClass()]
      );
      expect(mockIdempotencyService.checkKey).not.toHaveBeenCalled();
      expect(mockCallHandler.handle).toHaveBeenCalled();
      expect(result).toBeDefined();
    });
  });

  describe('intercept - idempotent endpoint without key', () => {
    it('should pass through when no idempotency key is provided', async () => {
      // Arrange
      mockReflector.getAllAndOverride.mockReturnValue(true);
      mockRequest.headers = {};

      // Act
      const result = await interceptor.intercept(
        mockExecutionContext as ExecutionContext,
        mockCallHandler
      );

      // Assert
      expect(mockIdempotencyService.checkKey).not.toHaveBeenCalled();
      expect(mockCallHandler.handle).toHaveBeenCalled();
      expect(result).toBeDefined();
    });
  });

  describe('intercept - idempotent endpoint without user context', () => {
    it('should pass through when userId is missing', async () => {
      // Arrange
      mockReflector.getAllAndOverride.mockReturnValue(true);
      mockRequest.headers = { 'idempotency-key': idempotencyKey };
      mockRequest.user = { tenantId };

      // Act
      const result = await interceptor.intercept(
        mockExecutionContext as ExecutionContext,
        mockCallHandler
      );

      // Assert
      expect(mockIdempotencyService.checkKey).not.toHaveBeenCalled();
      expect(mockCallHandler.handle).toHaveBeenCalled();
      expect(result).toBeDefined();
    });

    it('should pass through when tenantId is missing', async () => {
      // Arrange
      mockReflector.getAllAndOverride.mockReturnValue(true);
      mockRequest.headers = { 'idempotency-key': idempotencyKey };
      mockRequest.user = { userId };

      // Act
      const result = await interceptor.intercept(
        mockExecutionContext as ExecutionContext,
        mockCallHandler
      );

      // Assert
      expect(mockIdempotencyService.checkKey).not.toHaveBeenCalled();
      expect(mockCallHandler.handle).toHaveBeenCalled();
      expect(result).toBeDefined();
    });

    it('should pass through when user is missing', async () => {
      // Arrange
      mockReflector.getAllAndOverride.mockReturnValue(true);
      mockRequest.headers = { 'idempotency-key': idempotencyKey };
      mockRequest.user = undefined;

      // Act
      const result = await interceptor.intercept(
        mockExecutionContext as ExecutionContext,
        mockCallHandler
      );

      // Assert
      expect(mockIdempotencyService.checkKey).not.toHaveBeenCalled();
      expect(mockCallHandler.handle).toHaveBeenCalled();
      expect(result).toBeDefined();
    });
  });

  describe('intercept - duplicate request', () => {
    it('should return cached response when key is duplicate', async () => {
      // Arrange
      const cachedResponse = { data: 'cached-data', statusCode: 201 };
      const cachedResult = {
        isDuplicate: true,
        cachedResponse,
        idempotencyKey,
      };
      mockReflector.getAllAndOverride.mockReturnValue(true);
      mockRequest.headers = { 'idempotency-key': idempotencyKey };
      mockIdempotencyService.checkKey.mockResolvedValue(cachedResult);

      // Act
      const result = await interceptor.intercept(
        mockExecutionContext as ExecutionContext,
        mockCallHandler
      );

      // Assert
      expect(mockIdempotencyService.checkKey).toHaveBeenCalledWith(
        idempotencyKey,
        userId,
        tenantId
      );
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockCallHandler.handle).not.toHaveBeenCalled();
      
      // Verify result is the cached response
      let resultValue: any;
      result.subscribe((value) => {
        resultValue = value;
      });
      expect(resultValue).toEqual(cachedResponse);
    });

    it('should use default status code 200 when cached response has no statusCode', async () => {
      // Arrange
      const cachedResponse = { data: 'cached-data' };
      const cachedResult = {
        isDuplicate: true,
        cachedResponse,
        idempotencyKey,
      };
      mockReflector.getAllAndOverride.mockReturnValue(true);
      mockRequest.headers = { 'idempotency-key': idempotencyKey };
      mockIdempotencyService.checkKey.mockResolvedValue(cachedResult);

      // Act
      await interceptor.intercept(
        mockExecutionContext as ExecutionContext,
        mockCallHandler
      );

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(200);
    });
  });

  describe('intercept - new request', () => {
    it('should execute handler and store response for new key', async () => {
      // Arrange
      const responseData = { data: 'new-data' };
      mockReflector.getAllAndOverride.mockReturnValue(true);
      mockRequest.headers = { 'idempotency-key': idempotencyKey };
      mockIdempotencyService.checkKey.mockResolvedValue(null);
      mockCallHandler.handle = jest.fn().mockReturnValue(of(responseData));

      // Act
      const result = await interceptor.intercept(
        mockExecutionContext as ExecutionContext,
        mockCallHandler
      );

      // Wait for observable to complete
      await new Promise((resolve) => {
        result.subscribe({
          next: (value) => {
            // Assert
            expect(mockIdempotencyService.checkKey).toHaveBeenCalledWith(
              idempotencyKey,
              userId,
              tenantId
            );
            expect(mockCallHandler.handle).toHaveBeenCalled();
            expect(mockIdempotencyService.storeKey).toHaveBeenCalledWith(
              idempotencyKey,
              userId,
              tenantId,
              { data: responseData, statusCode: 200 },
              200
            );
            resolve(undefined);
          },
        });
      });
    });

    it('should store response with correct status code', async () => {
      // Arrange
      const responseData = { data: 'new-data' };
      mockResponse.statusCode = 201;
      mockReflector.getAllAndOverride.mockReturnValue(true);
      mockRequest.headers = { 'idempotency-key': idempotencyKey };
      mockIdempotencyService.checkKey.mockResolvedValue(null);
      mockCallHandler.handle = jest.fn().mockReturnValue(of(responseData));

      // Act
      const result = await interceptor.intercept(
        mockExecutionContext as ExecutionContext,
        mockCallHandler
      );

      // Wait for observable to complete
      await new Promise((resolve) => {
        result.subscribe({
          next: () => {
            // Assert
            expect(mockIdempotencyService.storeKey).toHaveBeenCalledWith(
              idempotencyKey,
              userId,
              tenantId,
              { data: responseData, statusCode: 201 },
              201
            );
            resolve(undefined);
          },
        });
      });
    });

    it('should use default status code 200 when response.statusCode is not set', async () => {
      // Arrange
      const responseData = { data: 'new-data' };
      mockResponse.statusCode = undefined;
      mockReflector.getAllAndOverride.mockReturnValue(true);
      mockRequest.headers = { 'idempotency-key': idempotencyKey };
      mockIdempotencyService.checkKey.mockResolvedValue(null);
      mockCallHandler.handle = jest.fn().mockReturnValue(of(responseData));

      // Act
      const result = await interceptor.intercept(
        mockExecutionContext as ExecutionContext,
        mockCallHandler
      );

      // Wait for observable to complete
      await new Promise((resolve) => {
        result.subscribe({
          next: () => {
            // Assert
            expect(mockIdempotencyService.storeKey).toHaveBeenCalledWith(
              idempotencyKey,
              userId,
              tenantId,
              { data: responseData, statusCode: 200 },
              200
            );
            resolve(undefined);
          },
        });
      });
    });

    it('should handle case-insensitive idempotency-key header', async () => {
      // Arrange
      mockReflector.getAllAndOverride.mockReturnValue(true);
      mockRequest.headers = { 'Idempotency-Key': idempotencyKey };
      mockIdempotencyService.checkKey.mockResolvedValue(null);

      // Act
      await interceptor.intercept(
        mockExecutionContext as ExecutionContext,
        mockCallHandler
      );

      // Assert
      expect(mockIdempotencyService.checkKey).toHaveBeenCalledWith(
        idempotencyKey,
        userId,
        tenantId
      );
    });
  });

  describe('intercept - edge cases', () => {
    it('should handle checkKey returning result without isDuplicate flag', async () => {
      // Arrange
      const cachedResult = {
        cachedResponse: { data: 'cached' },
        idempotencyKey,
        // No isDuplicate flag
      };
      mockReflector.getAllAndOverride.mockReturnValue(true);
      mockRequest.headers = { 'idempotency-key': idempotencyKey };
      mockIdempotencyService.checkKey.mockResolvedValue(cachedResult);

      // Act
      const result = await interceptor.intercept(
        mockExecutionContext as ExecutionContext,
        mockCallHandler
      );

      // Assert - Should proceed normally since isDuplicate is not true
      expect(mockCallHandler.handle).toHaveBeenCalled();
    });

    it('should handle checkKey returning result without cachedResponse', async () => {
      // Arrange
      const cachedResult = {
        isDuplicate: true,
        idempotencyKey,
        // No cachedResponse
      };
      mockReflector.getAllAndOverride.mockReturnValue(true);
      mockRequest.headers = { 'idempotency-key': idempotencyKey };
      mockIdempotencyService.checkKey.mockResolvedValue(cachedResult);

      // Act
      const result = await interceptor.intercept(
        mockExecutionContext as ExecutionContext,
        mockCallHandler
      );

      // Assert - Should proceed normally since cachedResponse is missing
      expect(mockCallHandler.handle).toHaveBeenCalled();
    });
  });
});

