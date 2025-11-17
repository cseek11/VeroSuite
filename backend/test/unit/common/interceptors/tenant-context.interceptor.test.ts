/**
 * Tenant Context Interceptor Unit Tests
 * Tests for tenant context logging and validation
 */

import { Test, TestingModule } from '@nestjs/testing';
import { TenantContextInterceptor } from '../../../../src/common/interceptors/tenant-context.interceptor';
import { ExecutionContext, CallHandler } from '@nestjs/common';
import { of } from 'rxjs';
import { Request } from 'express';

describe('TenantContextInterceptor', () => {
  let interceptor: TenantContextInterceptor;
  let mockExecutionContext: Partial<ExecutionContext>;
  let mockCallHandler: CallHandler;
  let loggerSpy: jest.SpyInstance;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TenantContextInterceptor],
    }).compile();

    interceptor = module.get<TenantContextInterceptor>(TenantContextInterceptor);

    // Mock logger
    loggerSpy = jest.spyOn((interceptor as any).logger, 'debug').mockImplementation();

    mockCallHandler = {
      handle: jest.fn().mockReturnValue(of({ data: 'test' })),
    } as any;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('intercept', () => {
    it('should log tenant context when tenantId is present', async () => {
      // Arrange
      const tenantId = '123e4567-e89b-12d3-a456-426614174000';
      const mockRequest = {
        tenantId,
      } as Request;

      mockExecutionContext = {
        switchToHttp: jest.fn().mockReturnValue({
          getRequest: jest.fn().mockReturnValue(mockRequest),
        }),
      } as any;

      // Act
      const result = await interceptor.intercept(
        mockExecutionContext as ExecutionContext,
        mockCallHandler
      );

      // Assert
      expect(loggerSpy).toHaveBeenCalledWith(
        `Request processed with tenant context: ${tenantId}`
      );
      expect(mockCallHandler.handle).toHaveBeenCalled();
      expect(result).toBeDefined();
    });

    it('should log public endpoint message when tenantId is not present', async () => {
      // Arrange
      const mockRequest = {} as Request;

      mockExecutionContext = {
        switchToHttp: jest.fn().mockReturnValue({
          getRequest: jest.fn().mockReturnValue(mockRequest),
        }),
      } as any;

      // Act
      const result = await interceptor.intercept(
        mockExecutionContext as ExecutionContext,
        mockCallHandler
      );

      // Assert
      expect(loggerSpy).toHaveBeenCalledWith(
        'Request processed without tenant context (public endpoint)'
      );
      expect(mockCallHandler.handle).toHaveBeenCalled();
      expect(result).toBeDefined();
    });

    it('should call next.handle() and return observable', async () => {
      // Arrange
      const mockRequest = {
        tenantId: '123e4567-e89b-12d3-a456-426614174000',
      } as Request;

      mockExecutionContext = {
        switchToHttp: jest.fn().mockReturnValue({
          getRequest: jest.fn().mockReturnValue(mockRequest),
        }),
      } as any;

      // Act
      const result = await interceptor.intercept(
        mockExecutionContext as ExecutionContext,
        mockCallHandler
      );

      // Assert
      expect(mockCallHandler.handle).toHaveBeenCalledTimes(1);
      expect(result).toBeDefined();
      
      // Verify it's an observable
      const subscription = result.subscribe();
      expect(subscription).toBeDefined();
      subscription.unsubscribe();
    });

    it('should handle undefined tenantId gracefully', async () => {
      // Arrange
      const mockRequest = {
        tenantId: undefined,
      } as any;

      mockExecutionContext = {
        switchToHttp: jest.fn().mockReturnValue({
          getRequest: jest.fn().mockReturnValue(mockRequest),
        }),
      } as any;

      // Act
      const result = await interceptor.intercept(
        mockExecutionContext as ExecutionContext,
        mockCallHandler
      );

      // Assert
      expect(loggerSpy).toHaveBeenCalledWith(
        'Request processed without tenant context (public endpoint)'
      );
      expect(result).toBeDefined();
    });
  });
});

