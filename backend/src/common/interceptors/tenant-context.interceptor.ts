import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';

@Injectable()
export class TenantContextInterceptor implements NestInterceptor {
  constructor() {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest<Request>();
    
    // Extract tenant ID from JWT token or headers
    let tenantId: string | undefined;
    
    // Try to get tenant ID from JWT token (if available)
    if (request.user && (request.user as any).tenant_id) {
      tenantId = (request.user as any).tenant_id;
    }
    
    // Fallback to header for development/testing
    if (!tenantId) {
      tenantId = request.headers['x-tenant-id'] as string;
    }
    
    // Use fallback tenant ID for development if none found
    if (!tenantId) {
      tenantId = '7193113e-ece2-4f7b-ae8c-176df4367e28'; // Development tenant ID
      console.log(`🔧 TenantContextInterceptor - Using fallback tenant ID for development: ${tenantId}`);
    } else {
      console.log(`🔧 TenantContextInterceptor - Using tenant ID: ${tenantId}`);
    }
    
    // Set tenant context in request for use by services
    (request as any).tenantId = tenantId;
    
    return next.handle();
  }
}
