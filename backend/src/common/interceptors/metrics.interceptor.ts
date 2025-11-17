import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { MetricsService } from '../services/metrics.service';
import { throwError } from 'rxjs';

/**
 * Interceptor to automatically track HTTP request metrics
 */
@Injectable()
export class MetricsInterceptor implements NestInterceptor {
  constructor(private readonly metricsService: MetricsService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    const { method, route, url } = request;
    
    const routePath = route?.path || url.split('?')[0];
    const startTime = Date.now();

    return next.handle().pipe(
      tap(() => {
        const duration = Date.now() - startTime;
        const statusCode = response.statusCode;

        // Record request duration
        this.metricsService.recordHistogram('http_request_duration_seconds', duration / 1000, {
          method,
          route: routePath,
          status_code: statusCode.toString()
        });

        // Record request count
        this.metricsService.incrementCounter('http_requests_total', {
          method,
          route: routePath,
          status_code: statusCode.toString()
        });
      }),
      catchError((error) => {
        const duration = Date.now() - startTime;
        const statusCode = error.status || 500;

        // Record error metrics
        this.metricsService.recordHistogram('http_request_duration_seconds', duration / 1000, {
          method,
          route: routePath,
          status_code: statusCode.toString()
        });

        this.metricsService.incrementCounter('http_requests_total', {
          method,
          route: routePath,
          status_code: statusCode.toString()
        });

        this.metricsService.incrementCounter('http_errors_total', {
          method,
          route: routePath,
          status_code: statusCode.toString(),
          error_type: (error && error.name) ? error.name : 'UnknownError'
        });

        return throwError(() => error);
      })
    );
  }
}



