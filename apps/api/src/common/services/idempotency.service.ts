import { Injectable, Logger } from '@nestjs/common';
import { CacheService } from './cache.service';
import { SupabaseService } from './supabase.service';

/**
 * Idempotency key result
 */
export interface IdempotencyResult<T = any> {
  isDuplicate: boolean;
  cachedResponse?: T;
  idempotencyKey: string;
}

/**
 * Idempotency Service
 * 
 * Ensures that retryable operations can be safely retried without side effects.
 * Uses Redis (via CacheService) for fast lookups and database for persistence.
 * 
 * Phase 2.5: Idempotency for critical write operations
 */
@Injectable()
export class IdempotencyService {
  private readonly logger = new Logger(IdempotencyService.name);
  private readonly cachePrefix = 'idempotency:';
  private readonly cacheTTL = 86400; // 24 hours

  constructor(
    private readonly cacheService: CacheService,
    private readonly supabaseService: SupabaseService
  ) {}

  /**
   * Check if an idempotency key has been used before
   * Returns cached response if duplicate, null if new
   */
  async checkKey<T = any>(
    idempotencyKey: string,
    userId: string,
    tenantId: string
  ): Promise<IdempotencyResult<T> | null> {
    if (!idempotencyKey) {
      return null;
    }

    const key = this.getCacheKey(idempotencyKey, userId, tenantId);

    try {
      // Check cache first (fast path)
      const cached = await this.cacheService.get<IdempotencyResult<T>>(key);
      if (cached) {
        this.logger.debug(`Idempotency key found in cache: ${idempotencyKey}`);
        return cached;
      }

      // Check database (persistent storage)
      const dbResult = await this.checkDatabase(idempotencyKey, userId, tenantId);
      if (dbResult) {
        // Cache the result for future lookups
        await this.cacheService.set(key, dbResult, this.cacheTTL);
        return dbResult;
      }

      return null;
    } catch (error) {
      this.logger.error(`Error checking idempotency key: ${idempotencyKey}`, error);
      // Fail open - allow request if idempotency check fails
      return null;
    }
  }

  /**
   * Store idempotency key and response
   */
  async storeKey<T = any>(
    idempotencyKey: string,
    userId: string,
    tenantId: string,
    response: T,
    statusCode: number = 200
  ): Promise<void> {
    if (!idempotencyKey) {
      return;
    }

    const key = this.getCacheKey(idempotencyKey, userId, tenantId);
    const result: IdempotencyResult<T> = {
      isDuplicate: false,
      cachedResponse: response,
      idempotencyKey
    };

    try {
      // Store in cache (fast access)
      await this.cacheService.set(key, result, this.cacheTTL);

      // Store in database (persistent)
      await this.storeInDatabase(idempotencyKey, userId, tenantId, response, statusCode);

      this.logger.debug(`Stored idempotency key: ${idempotencyKey}`);
    } catch (error) {
      this.logger.error(`Error storing idempotency key: ${idempotencyKey}`, error);
      // Fail silently - idempotency is best-effort
    }
  }

  /**
   * Check database for idempotency key
   */
  private async checkDatabase(
    idempotencyKey: string,
    userId: string,
    tenantId: string
  ): Promise<IdempotencyResult | null> {
    try {
      const { data, error } = await this.supabaseService
        .getClient()
        .from('idempotency_keys')
        .select('response_data, status_code, created_at')
        .eq('idempotency_key', idempotencyKey)
        .eq('user_id', userId)
        .eq('tenant_id', tenantId)
        .single();

      if (error || !data) {
        return null;
      }

      // Check if key is still valid (within TTL)
      const createdAt = new Date(data.created_at);
      const age = Date.now() - createdAt.getTime();
      if (age > this.cacheTTL * 1000) {
        // Key expired, remove it
        await this.removeKey(idempotencyKey, userId, tenantId);
        return null;
      }

      return {
        isDuplicate: true,
        cachedResponse: data.response_data,
        idempotencyKey
      };
    } catch (error) {
      this.logger.error(`Error checking database for idempotency key`, error);
      return null;
    }
  }

  /**
   * Store idempotency key in database
   */
  private async storeInDatabase(
    idempotencyKey: string,
    userId: string,
    tenantId: string,
    response: any,
    statusCode: number
  ): Promise<void> {
    try {
      const { error } = await this.supabaseService
        .getClient()
        .from('idempotency_keys')
        .insert({
          idempotency_key: idempotencyKey,
          user_id: userId,
          tenant_id: tenantId,
          response_data: response,
          status_code: statusCode,
          created_at: new Date().toISOString()
        });

      if (error) {
        // Ignore unique constraint violations (key already exists)
        if (error.code !== '23505') {
          throw error;
        }
      }
    } catch (error) {
      this.logger.error(`Error storing idempotency key in database`, error);
      throw error;
    }
  }

  /**
   * Remove idempotency key (cleanup)
   */
  async removeKey(
    idempotencyKey: string,
    userId: string,
    tenantId: string
  ): Promise<void> {
    const key = this.getCacheKey(idempotencyKey, userId, tenantId);

    try {
      // Remove from cache
      await this.cacheService.delete(key);

      // Remove from database
      await this.supabaseService
        .getClient()
        .from('idempotency_keys')
        .delete()
        .eq('idempotency_key', idempotencyKey)
        .eq('user_id', userId)
        .eq('tenant_id', tenantId);
    } catch (error) {
      this.logger.error(`Error removing idempotency key`, error);
    }
  }

  /**
   * Generate cache key
   */
  private getCacheKey(idempotencyKey: string, userId: string, tenantId: string): string {
    return `${this.cachePrefix}${tenantId}:${userId}:${idempotencyKey}`;
  }

  /**
   * Generate idempotency key from request
   */
  static generateKey(
    method: string,
    path: string,
    userId: string,
    body?: any
  ): string {
    // Create a deterministic key from method, path, user, and body
    const bodyHash = body ? JSON.stringify(body) : '';
    const combined = `${method}:${path}:${userId}:${bodyHash}`;
    
    // Simple hash function (for production, consider crypto.createHash)
    let hash = 0;
    for (let i = 0; i < combined.length; i++) {
      const char = combined.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    
    return `idempotency-${Math.abs(hash).toString(36)}`;
  }
}

