/**
 * Metrics Interceptor Unit Tests
 * Tests for automatic HTTP request metrics tracking
 */

import { Test, TestingModule } from '@nestjs/testing';
import { MetricsInterceptor } from '../../../../src/common/interceptors/metrics.interceptor';
import { MetricsService } from '../../../../src/common/services/metrics.service';
import { ExecutionContext, CallHandler } from '@nestjs/common';
import { of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';

describe('MetricsInterceptor', () => {
  let interceptor: MetricsInterceptor;
  let metricsService: MetricsService;
  let mockMetricsService: any;
  let mockExecutionContext: Partial<ExecutionContext>;
  let mockCallHandler: CallHandler;
  let mockRequest: any;
  let mockResponse: any;

  beforeEach(async () => {
    mockMetricsService = {
      recordHistogram: jest.fn(),
      incrementCounter: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MetricsInterceptor,
        {
          provide: MetricsService,
          useValue: mockMetricsService,
        },
      ],
    }).compile();

    interceptor = module.get<MetricsInterceptor>(MetricsInterceptor);
    metricsService = module.get<MetricsService>(MetricsService);

    mockResponse = {
      statusCode: 200,
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

  describe('intercept - success path', () => {
    it('should record request duration histogram on success', (done) => {
      // Act
      const result = interceptor.intercept(
        mockExecutionContext as ExecutionContext,
        mockCallHandler
      );

      // Wait for observable to complete
      result.subscribe({
        complete: () => {
          // Assert
          expect(mockMetricsService.recordHistogram).toHaveBeenCalledWith(
            'http_request_duration_seconds',
            expect.any(Number),
            {
              method: 'GET',
              route: '/api/v1/users',
              status_code: '200',
            }
          );
          done();
        },
      });
    });

    it('should record request count counter on success', (done) => {
      // Act
      const result = interceptor.intercept(
        mockExecutionContext as ExecutionContext,
        mockCallHandler
      );

      // Wait for observable to complete
      result.subscribe({
        complete: () => {

          // Assert
          expect(mockMetricsService.incrementCounter).toHaveBeenCalledWith(
            'http_requests_total',
            {
              method: 'GET',
              route: '/api/v1/users',
              status_code: '200',
            }
          );
          done();
        },
      });
    });

    it('should calculate duration correctly', (done) => {
      // Arrange
      mockCallHandler.handle = jest.fn().mockReturnValue(
        of({ data: 'test' }).pipe(delay(100))
      );

      // Act
      const result = interceptor.intercept(
        mockExecutionContext as ExecutionContext,
        mockCallHandler
      );

      // Wait for observable to complete
      result.subscribe({
        complete: () => {

          // Assert
          const histogramCall = mockMetricsService.recordHistogram.mock.calls.find(
            (call: any[]) => call[0] === 'http_request_duration_seconds'
          );
          expect(histogramCall).toBeDefined();
          const duration = histogramCall[1];
          expect(duration).toBeGreaterThanOrEqual(0.1);
          expect(duration).toBeLessThan(0.2);
          done();
        },
      });
    });

    it('should use route.path when available', (done) => {
      // Arrange
      mockRequest.route = { path: '/api/v1/custom-route' };
      mockRequest.url = '/api/v1/custom-route?param=value';

      // Act
      const result = interceptor.intercept(
        mockExecutionContext as ExecutionContext,
        mockCallHandler
      );

      // Wait for observable to complete
      result.subscribe({
        complete: () => {

          // Assert
          expect(mockMetricsService.recordHistogram).toHaveBeenCalledWith(
            'http_request_duration_seconds',
            expect.any(Number),
            expect.objectContaining({
              route: '/api/v1/custom-route',
            })
          );
          done();
        },
      });
    });

    it('should use url without query params when route.path is not available', (done) => {
      // Arrange
      mockRequest.route = null;
      mockRequest.url = '/api/v1/users?page=1&limit=10';

      // Act
      const result = interceptor.intercept(
        mockExecutionContext as ExecutionContext,
        mockCallHandler
      );

      // Wait for observable to complete
      result.subscribe({
        complete: () => {

          // Assert
          expect(mockMetricsService.recordHistogram).toHaveBeenCalledWith(
            'http_request_duration_seconds',
            expect.any(Number),
            expect.objectContaining({
              route: '/api/v1/users',
            })
          );
          done();
        },
      });
    });

    it('should record metrics with correct status code', (done) => {
      // Arrange
      mockResponse.statusCode = 201;

      // Act
      const result = interceptor.intercept(
        mockExecutionContext as ExecutionContext,
        mockCallHandler
      );

      // Wait for observable to complete
      result.subscribe({
        complete: () => {

          // Assert
          expect(mockMetricsService.incrementCounter).toHaveBeenCalledWith(
            'http_requests_total',
            expect.objectContaining({
              status_code: '201',
            })
          );
          done();
        },
      });
    });
  });

  describe('intercept - error path', () => {
    it('should record error metrics on failure', (done) => {
      // Arrange
      const error = new Error('Test error');
      (error as any).status = 400;
      (error as any).name = 'BadRequestError';
      mockCallHandler.handle = jest.fn().mockReturnValue(throwError(() => error));

      // Act
      const result = interceptor.intercept(
        mockExecutionContext as ExecutionContext,
        mockCallHandler
      );

      // Wait for error to be handled
      result.subscribe({
        error: (err) => {
          expect(err).toBe(error);

          // Assert
          expect(mockMetricsService.recordHistogram).toHaveBeenCalledWith(
            'http_request_duration_seconds',
            expect.any(Number),
            expect.objectContaining({
              status_code: '400',
            })
          );
          expect(mockMetricsService.incrementCounter).toHaveBeenCalledWith(
            'http_errors_total',
            expect.objectContaining({
              status_code: '400',
              error_type: 'BadRequestError',
            })
          );
          done();
        },
      });
    });

    it('should use error.status for status code', (done) => {
      // Arrange
      const error = new Error('Test error');
      (error as any).status = 404;
      mockCallHandler.handle = jest.fn().mockReturnValue(throwError(() => error));

      // Act
      const result = interceptor.intercept(
        mockExecutionContext as ExecutionContext,
        mockCallHandler
      );

      // Wait for error to be handled
      result.subscribe({
        error: () => {

          // Assert
          expect(mockMetricsService.incrementCounter).toHaveBeenCalledWith(
            'http_requests_total',
            expect.objectContaining({
              status_code: '404',
            })
          );
          done();
        },
      });
    });

    it('should default to 500 when error.status is not available', (done) => {
      // Arrange
      const error = new Error('Test error');
      // No status property
      mockCallHandler.handle = jest.fn().mockReturnValue(throwError(() => error));

      // Act
      const result = interceptor.intercept(
        mockExecutionContext as ExecutionContext,
        mockCallHandler
      );

      // Wait for error to be handled
      result.subscribe({
        error: () => {

          // Assert
          expect(mockMetricsService.incrementCounter).toHaveBeenCalledWith(
            'http_requests_total',
            expect.objectContaining({
              status_code: '500',
            })
          );
          done();
        },
      });
    });

    it('should use UnknownError when error.name is not available', (done) => {
      // Arrange
      // Create an error-like object without a name property
      const error = Object.create(null);
      error.message = 'Test error';
      error.status = 500;
      // Explicitly ensure name is undefined
      error.name = undefined;
      mockCallHandler.handle = jest.fn().mockReturnValue(throwError(() => error));

      // Act
      const result = interceptor.intercept(
        mockExecutionContext as ExecutionContext,
        mockCallHandler
      );

      // Wait for error to be handled
      result.subscribe({
        error: () => {
          // Assert
          expect(mockMetricsService.incrementCounter).toHaveBeenCalledWith(
            'http_errors_total',
            expect.objectContaining({
              error_type: 'UnknownError',
            })
          );
          done();
        },
      });
    });

    it('should rethrow error after recording metrics', (done) => {
      // Arrange
      const error = new Error('Test error');
      (error as any).status = 400;
      mockCallHandler.handle = jest.fn().mockReturnValue(throwError(() => error));

      // Act
      const result = interceptor.intercept(
        mockExecutionContext as ExecutionContext,
        mockCallHandler
      );

      // Assert
      result.subscribe({
        error: (err) => {
          expect(err).toBe(error);
          done();
        },
        complete: () => {
          done(new Error('Should have thrown error'));
        },
      });
    });

    it('should record duration even on error', (done) => {
      // Arrange
      const error = new Error('Test error');
      (error as any).status = 500;
      // Use delay to ensure duration is measurable
      mockCallHandler.handle = jest.fn().mockReturnValue(
        throwError(() => error).pipe(delay(10))
      );

      // Act
      const result = interceptor.intercept(
        mockExecutionContext as ExecutionContext,
        mockCallHandler
      );

      // Wait for error to be handled
      result.subscribe({
        error: () => {
          // Assert - duration should be recorded (even if small)
          const histogramCalls = mockMetricsService.recordHistogram.mock.calls.filter(
            (call: any[]) => call[0] === 'http_request_duration_seconds'
          );
          expect(histogramCalls.length).toBeGreaterThan(0);
          const histogramCall = histogramCalls[histogramCalls.length - 1];
          expect(histogramCall).toBeDefined();
          const duration = histogramCall[1];
          // Duration might be very small, just check it's >= 0
          expect(duration).toBeGreaterThanOrEqual(0);
          done();
        },
      });
    });
  });
});

