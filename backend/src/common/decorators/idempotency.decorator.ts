import { SetMetadata } from '@nestjs/common';

/**
 * Metadata key for idempotency
 */
export const IDEMPOTENCY_KEY = 'idempotency';

/**
 * Decorator to mark endpoints that support idempotency
 * When this decorator is used, the endpoint will check for Idempotency-Key header
 * and return cached response if the key has been used before
 */
export const Idempotent = () => SetMetadata(IDEMPOTENCY_KEY, true);


