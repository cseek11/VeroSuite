import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

/**
 * Interceptor to add deprecation headers to v1 API endpoints
 * Adds Deprecation, Sunset, and Link headers to indicate v1 is deprecated
 */
@Injectable()
export class DeprecationInterceptor implements NestInterceptor {
  private readonly sunsetDate: string;
  private readonly baseUrl: string = '/api/v2';

  constructor() {
    // Set sunset date to 1 year from now
    const sunset = new Date();
    sunset.setFullYear(sunset.getFullYear() + 1);
    this.sunsetDate = sunset.toUTCString();
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    
    // Get the route path to construct the successor link
    // Use route.path if available (doesn't include query params), otherwise use url and strip query params
    let routePath = request.route?.path;
    if (!routePath) {
      // Extract path from URL, removing query parameters
      routePath = request.url.split('?')[0];
    }
    
    // Construct successor v2 path (remove /v1/ prefix if present, add /v2/)
    let successorPath = routePath;
    if (routePath.includes('/v1/')) {
      successorPath = routePath.replace('/v1/', '/v2/');
    } else if (routePath.startsWith('/api/') && !routePath.includes('/v2/')) {
      // If no version in path, add /v2/ after /api/
      successorPath = routePath.replace('/api/', '/api/v2/');
    }
    
    // Add deprecation headers
    response.setHeader('Deprecation', 'true');
    response.setHeader('Sunset', this.sunsetDate);
    response.setHeader('Link', `<${successorPath}>; rel="successor-version"`);
    
    return next.handle();
  }
}


