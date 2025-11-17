/**
 * Deprecation Interceptor Unit Tests
 * Tests for deprecation header injection for v1 API endpoints
 */

import { Test, TestingModule } from '@nestjs/testing';
import { DeprecationInterceptor } from '../../../../src/common/interceptors/deprecation.interceptor';
import { ExecutionContext, CallHandler } from '@nestjs/common';
import { of } from 'rxjs';

describe('DeprecationInterceptor', () => {
  let interceptor: DeprecationInterceptor;
  let mockExecutionContext: Partial<ExecutionContext>;
  let mockCallHandler: CallHandler;
  let mockRequest: any;
  let mockResponse: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DeprecationInterceptor],
    }).compile();

    interceptor = module.get<DeprecationInterceptor>(DeprecationInterceptor);

    mockResponse = {
      setHeader: jest.fn(),
    };

    mockRequest = {
      method: 'GET',
      url: '/api/v1/users',
      route: {
        path: '/api/v1/users',
      },
    };

    mockExecutionContext = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue(mockRequest),
        getResponse: jest.fn().mockReturnValue(mockResponse),
      }),
    } as any;

    mockCallHandler = {
      handle: jest.fn().mockReturnValue(of({ data: 'test' })),
    } as any;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('intercept', () => {
    it('should set Deprecation header to true', async () => {
      // Act
      await interceptor.intercept(
        mockExecutionContext as ExecutionContext,
        mockCallHandler
      );

      // Assert
      expect(mockResponse.setHeader).toHaveBeenCalledWith('Deprecation', 'true');
    });

    it('should set Sunset header with future date', async () => {
      // Act
      await interceptor.intercept(
        mockExecutionContext as ExecutionContext,
        mockCallHandler
      );

      // Assert
      expect(mockResponse.setHeader).toHaveBeenCalledWith(
        'Sunset',
        expect.stringMatching(/^\w+, \d+ \w+ \d{4} \d{2}:\d{2}:\d{2} GMT$/)
      );
    });

    it('should set Link header with successor version path for v1 routes', async () => {
      // Arrange
      mockRequest.url = '/api/v1/users';
      mockRequest.route = { path: '/api/v1/users' };

      // Act
      await interceptor.intercept(
        mockExecutionContext as ExecutionContext,
        mockCallHandler
      );

      // Assert
      expect(mockResponse.setHeader).toHaveBeenCalledWith(
        'Link',
        '</api/v2/users>; rel="successor-version"'
      );
    });

    it('should replace /v1/ with /v2/ in successor path', async () => {
      // Arrange
      mockRequest.url = '/api/v1/dashboard/layouts';
      mockRequest.route = { path: '/api/v1/dashboard/layouts' };

      // Act
      await interceptor.intercept(
        mockExecutionContext as ExecutionContext,
        mockCallHandler
      );

      // Assert
      expect(mockResponse.setHeader).toHaveBeenCalledWith(
        'Link',
        '</api/v2/dashboard/layouts>; rel="successor-version"'
      );
    });

    it('should add /v2/ after /api/ when no version in path', async () => {
      // Arrange
      mockRequest.url = '/api/users';
      mockRequest.route = { path: '/api/users' };

      // Act
      await interceptor.intercept(
        mockExecutionContext as ExecutionContext,
        mockCallHandler
      );

      // Assert
      expect(mockResponse.setHeader).toHaveBeenCalledWith(
        'Link',
        '</api/v2/users>; rel="successor-version"'
      );
    });

    it('should use route.path when available', async () => {
      // Arrange
      mockRequest.route = { path: '/api/v1/test' };
      mockRequest.url = '/api/v1/test?param=value';

      // Act
      await interceptor.intercept(
        mockExecutionContext as ExecutionContext,
        mockCallHandler
      );

      // Assert
      expect(mockResponse.setHeader).toHaveBeenCalledWith(
        'Link',
        '</api/v2/test>; rel="successor-version"'
      );
    });

    it('should use url when route.path is not available', async () => {
      // Arrange
      mockRequest.route = null;
      mockRequest.url = '/api/v1/test?param=value';

      // Act
      await interceptor.intercept(
        mockExecutionContext as ExecutionContext,
        mockCallHandler
      );

      // Assert
      expect(mockResponse.setHeader).toHaveBeenCalledWith(
        'Link',
        '</api/v2/test>; rel="successor-version"'
      );
    });

    it('should handle URL with query parameters', async () => {
      // Arrange
      mockRequest.route = null;
      mockRequest.url = '/api/v1/users?page=1&limit=10';

      // Act
      await interceptor.intercept(
        mockExecutionContext as ExecutionContext,
        mockCallHandler
      );

      // Assert
      expect(mockResponse.setHeader).toHaveBeenCalledWith(
        'Link',
        '</api/v2/users>; rel="successor-version"'
      );
    });

    it('should call next.handle() and return observable', async () => {
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

    it('should set sunset date to 1 year from now', async () => {
      // Arrange
      const now = new Date();
      const expectedYear = now.getFullYear() + 1;

      // Act
      await interceptor.intercept(
        mockExecutionContext as ExecutionContext,
        mockCallHandler
      );

      // Assert
      const sunsetCall = mockResponse.setHeader.mock.calls.find(
        (call: any[]) => call[0] === 'Sunset'
      );
      expect(sunsetCall).toBeDefined();
      
      const sunsetDate = new Date(sunsetCall[1]);
      expect(sunsetDate.getFullYear()).toBe(expectedYear);
    });

    it('should handle complex nested paths', async () => {
      // Arrange
      mockRequest.route = { path: '/api/v1/dashboard/regions/123' };

      // Act
      await interceptor.intercept(
        mockExecutionContext as ExecutionContext,
        mockCallHandler
      );

      // Assert
      expect(mockResponse.setHeader).toHaveBeenCalledWith(
        'Link',
        '</api/v2/dashboard/regions/123>; rel="successor-version"'
      );
    });
  });
});

