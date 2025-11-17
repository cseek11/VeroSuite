import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler
} from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Reflector } from '@nestjs/core';
import { IdempotencyService } from '../services/idempotency.service';
import { IDEMPOTENCY_KEY } from '../decorators/idempotency.decorator';

/**
 * Interceptor to handle idempotency for endpoints marked with @Idempotent()
 * 
 * Checks for Idempotency-Key header and:
 * - Returns cached response if key exists (duplicate request)
 * - Stores response if key is new (first request)
 */
@Injectable()
export class IdempotencyInterceptor implements NestInterceptor {
  constructor(
    private readonly reflector: Reflector,
    private readonly idempotencyService: IdempotencyService
  ) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const isIdempotent = this.reflector.getAllAndOverride<boolean>(IDEMPOTENCY_KEY, [
      context.getHandler(),
      context.getClass()
    ]);

    if (!isIdempotent) {
      return next.handle();
    }

    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    const idempotencyKey = request.headers['idempotency-key'] as string;
    const user = (request as any).user;
    const userId = user?.userId;
    const tenantId = user?.tenantId;

    if (!idempotencyKey) {
      // No idempotency key provided - proceed normally
      return next.handle();
    }

    if (!userId || !tenantId) {
      // User context required for idempotency
      return next.handle();
    }

    // Check if this key has been used before
    const cached = await this.idempotencyService.checkKey(
      idempotencyKey,
      userId,
      tenantId
    );

    if (cached && cached.isDuplicate && cached.cachedResponse) {
      // Return cached response
      response.status(cached.cachedResponse.statusCode || 200);
      return of(cached.cachedResponse);
    }

    // New request - execute and cache response
    return next.handle().pipe(
      tap(async (data) => {
        // Store response for future duplicate requests
        const statusCode = response.statusCode || 200;
        await this.idempotencyService.storeKey(
          idempotencyKey,
          userId,
          tenantId,
          { data, statusCode },
          statusCode
        );
      })
    );
  }
}

