import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';

@Injectable()
export class TenantContextInterceptor implements NestInterceptor {
  private readonly logger = new Logger(TenantContextInterceptor.name);

  constructor() {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest<Request>();
    
    // The tenant context is now handled by TenantMiddleware
    // This interceptor provides additional logging and validation
    
    if (request.tenantId) {
      this.logger.debug(`Request processed with tenant context: ${request.tenantId}`);
    } else {
      this.logger.debug('Request processed without tenant context (public endpoint)');
    }
    
    return next.handle();
  }
}
