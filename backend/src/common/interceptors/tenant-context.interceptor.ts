import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class TenantContextInterceptor implements NestInterceptor {
  constructor() {}

  async intercept(_context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    // Temporarily disable tenant context setting to test
    console.log(`TenantContextInterceptor - Skipping tenant context for testing`);
    
    return next.handle();
  }
}
