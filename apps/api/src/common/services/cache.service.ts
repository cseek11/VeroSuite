import { Injectable, Logger, Optional, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

/**
 * Multi-layer cache service (L1: Memory, L2: Redis, L3: DB)
 * Phase 4: Enhanced with metrics tracking and cache warming
 */
@Injectable()
export class CacheService {
  private readonly logger = new Logger(CacheService.name);
  private readonly memoryCache = new Map<string, { value: any; expires: number }>();
  private readonly memoryCacheTTL = 60000; // 1 minute default
  private redisClient: any = null;
  private redisEnabled = false;
  
  // Cache metrics (Phase 4)
  private cacheStats = {
    l1Hits: 0,
    l2Hits: 0,
    misses: 0,
    sets: 0,
    invalidations: 0,
    totalRequests: 0
  };
  
  // Metrics service (optional, injected if available)
  private metricsService: any = null;

  constructor(
    private readonly configService: ConfigService,
    @Optional() @Inject('MetricsService') metricsService?: any
  ) {
    this.metricsService = metricsService;
    this.initializeRedis();
  }

  private async initializeRedis() {
    const redisUrl = this.configService.get<string>('REDIS_URL');
    if (redisUrl) {
      try {
        // Lazy load Redis client
        const Redis = require('ioredis');
        this.redisClient = new Redis(redisUrl, {
          retryStrategy: (times: number) => {
            const delay = Math.min(times * 50, 2000);
            return delay;
          },
          maxRetriesPerRequest: 3
        });

        this.redisClient.on('error', (err: Error) => {
          this.logger.error('Redis connection error', err);
          this.redisEnabled = false;
        });

        this.redisClient.on('connect', () => {
          this.logger.log('Redis connected');
          this.redisEnabled = true;
        });

        this.redisEnabled = true;
      } catch (error) {
        this.logger.warn('Redis not available, using memory cache only', error);
        this.redisEnabled = false;
      }
    }
  }

  /**
   * Get value from cache (checks L1 -> L2 -> L3)
   * Phase 4: Enhanced with metrics tracking
   */
  async get<T>(key: string): Promise<T | null> {
    this.cacheStats.totalRequests++;
    
    // L1: Memory cache
    const memoryEntry = this.memoryCache.get(key);
    if (memoryEntry && memoryEntry.expires > Date.now()) {
      this.cacheStats.l1Hits++;
      this.recordCacheMetric('hit', 'l1', key);
      this.logger.debug(`Cache hit (L1): ${key}`);
      return memoryEntry.value as T;
    }

    // Remove expired entry
    if (memoryEntry) {
      this.memoryCache.delete(key);
    }

    // L2: Redis cache
    if (this.redisEnabled && this.redisClient) {
      try {
        const redisValue = await this.redisClient.get(key);
        if (redisValue) {
          this.cacheStats.l2Hits++;
          this.recordCacheMetric('hit', 'l2', key);
          this.logger.debug(`Cache hit (L2): ${key}`);
          const parsed = JSON.parse(redisValue);
          
          // Promote to L1
          this.setMemoryCache(key, parsed);
          
          return parsed as T;
        }
      } catch (error) {
        this.logger.warn(`Redis get error for key ${key}`, error);
      }
    }

    // L3: DB (handled by caller)
    this.cacheStats.misses++;
    this.recordCacheMetric('miss', 'l3', key);
    this.logger.debug(`Cache miss: ${key}`);
    return null;
  }

  /**
   * Set value in cache (writes to L1 and L2)
   * Phase 4: Enhanced with metrics tracking
   */
  async set(key: string, value: any, ttlSeconds?: number): Promise<void> {
    const ttl = ttlSeconds || this.memoryCacheTTL / 1000;
    this.cacheStats.sets++;

    // L1: Memory cache
    this.setMemoryCache(key, value, ttl * 1000);

    // L2: Redis cache
    if (this.redisEnabled && this.redisClient) {
      try {
        await this.redisClient.setex(key, ttl, JSON.stringify(value));
        this.recordCacheMetric('set', 'l2', key);
      } catch (error) {
        this.logger.warn(`Redis set error for key ${key}`, error);
      }
    }
    
    this.recordCacheMetric('set', 'l1', key);
  }

  /**
   * Delete value from cache (all layers)
   */
  async delete(key: string): Promise<void> {
    // L1: Memory cache
    this.memoryCache.delete(key);

    // L2: Redis cache
    if (this.redisEnabled && this.redisClient) {
      try {
        await this.redisClient.del(key);
      } catch (error) {
        this.logger.warn(`Redis delete error for key ${key}`, error);
      }
    }
  }

  /**
   * Delete multiple keys (pattern matching)
   */
  async deletePattern(pattern: string): Promise<void> {
    // L1: Memory cache
    const keysToDelete: string[] = [];
    for (const key of this.memoryCache.keys()) {
      if (this.matchPattern(key, pattern)) {
        keysToDelete.push(key);
      }
    }
    keysToDelete.forEach(key => this.memoryCache.delete(key));

    // L2: Redis cache
    if (this.redisEnabled && this.redisClient) {
      try {
        const keys = await this.redisClient.keys(pattern);
        if (keys.length > 0) {
          await this.redisClient.del(...keys);
        }
      } catch (error) {
        this.logger.warn(`Redis deletePattern error for pattern ${pattern}`, error);
      }
    }
  }

  /**
   * Clear all cache
   */
  async clear(): Promise<void> {
    // L1: Memory cache
    this.memoryCache.clear();

    // L2: Redis cache
    if (this.redisEnabled && this.redisClient) {
      try {
        await this.redisClient.flushdb();
      } catch (error) {
        this.logger.warn('Redis clear error', error);
      }
    }
  }

  /**
   * Get or set pattern (cache-aside)
   */
  async getOrSet<T>(
    key: string,
    fetcher: () => Promise<T>,
    ttlSeconds?: number
  ): Promise<T> {
    const cached = await this.get<T>(key);
    if (cached !== null) {
      return cached;
    }

    const value = await fetcher();
    await this.set(key, value, ttlSeconds);
    return value;
  }

  /**
   * Invalidate cache for a layout
   * Phase 4: Enhanced with metrics tracking
   */
  async invalidateLayout(layoutId: string): Promise<void> {
    this.cacheStats.invalidations++;
    await this.deletePattern(`layout:${layoutId}:*`);
    await this.deletePattern(`regions:layout:${layoutId}:*`);
    this.recordCacheMetric('invalidate', 'all', `layout:${layoutId}`);
  }

  /**
   * Invalidate cache for a region
   */
  async invalidateRegion(regionId: string): Promise<void> {
    await this.delete(`region:${regionId}`);
    await this.deletePattern(`regions:*:${regionId}*`);
  }

  /**
   * Invalidate cache for a user
   */
  async invalidateUser(userId: string): Promise<void> {
    await this.deletePattern(`user:${userId}:*`);
  }

  /**
   * KPI-specific cache methods (for backward compatibility with existing code)
   */
  async invalidateKPICache(tenantId: string): Promise<void> {
    await this.deletePattern(`kpi:${tenantId}:*`);
  }

  async getKPIConfigs<T>(tenantId: string): Promise<T | null> {
    return this.get<T>(`kpi:${tenantId}:configs`);
  }

  async setKPIConfigs(tenantId: string, configs: any, ttlSeconds: number = 300): Promise<void> {
    await this.set(`kpi:${tenantId}:configs`, configs, ttlSeconds);
  }

  async getBatchKPIData<T>(tenantId: string, kpiIds: string[]): Promise<T | null> {
    const key = `kpi:${tenantId}:batch:${kpiIds.sort().join(',')}`;
    return this.get<T>(key);
  }

  async getKPIData<T>(tenantId: string, kpiId: string): Promise<T | null> {
    return this.get<T>(`kpi:${tenantId}:${kpiId}`);
  }

  async setBatchKPIData(tenantId: string, data: any, ttlSeconds: number = 60): Promise<void> {
    const kpiIds = Object.keys(data);
    const key = `kpi:${tenantId}:batch:${kpiIds.sort().join(',')}`;
    await this.set(key, data, ttlSeconds);
  }

  async setKPIData(tenantId: string, data: any, kpiId: string, ttlSeconds: number = 60): Promise<void> {
    await this.set(`kpi:${tenantId}:${kpiId}`, data, ttlSeconds);
  }

  async getKPITrends<T>(tenantId: string, period: string): Promise<T | null> {
    return this.get<T>(`kpi:${tenantId}:trends:${period}`);
  }

  async setKPITrends(tenantId: string, period: string, trends: any, ttlSeconds: number = 300): Promise<void> {
    await this.set(`kpi:${tenantId}:trends:${period}`, trends, ttlSeconds);
  }

  /**
   * Set memory cache entry
   */
  private setMemoryCache(key: string, value: any, ttlMs?: number): void {
    const ttl = ttlMs || this.memoryCacheTTL;
    this.memoryCache.set(key, {
      value,
      expires: Date.now() + ttl
    });
  }

  /**
   * Match key against pattern (simple glob matching)
   */
  private matchPattern(key: string, pattern: string): boolean {
    const regex = new RegExp(
      '^' + pattern.replace(/\*/g, '.*').replace(/\?/g, '.') + '$'
    );
    return regex.test(key);
  }

  /**
   * Cleanup expired memory cache entries
   */
  private cleanupMemoryCache(): void {
    const now = Date.now();
    for (const [key, entry] of this.memoryCache.entries()) {
      if (entry.expires <= now) {
        this.memoryCache.delete(key);
      }
    }
  }

  /**
   * Start periodic cleanup
   */
  onModuleInit() {
    // Cleanup expired entries every 5 minutes
    setInterval(() => {
      this.cleanupMemoryCache();
    }, 5 * 60 * 1000);
  }

  /**
   * Cleanup on module destroy
   */
  onModuleDestroy() {
    if (this.redisClient) {
      this.redisClient.quit();
    }
    this.memoryCache.clear();
  }

  /**
   * Phase 4: Record cache metric (if metrics service available)
   */
  private recordCacheMetric(operation: 'hit' | 'miss' | 'set' | 'invalidate', layer: 'l1' | 'l2' | 'l3' | 'all', key?: string): void {
    if (this.metricsService && typeof this.metricsService.recordCacheOperation === 'function') {
      this.metricsService.recordCacheOperation(operation, layer, key);
    }
  }

  /**
   * Phase 4: Get cache statistics
   */
  getCacheStats() {
    const totalHits = this.cacheStats.l1Hits + this.cacheStats.l2Hits;
    const hitRate = this.cacheStats.totalRequests > 0 
      ? (totalHits / this.cacheStats.totalRequests) * 100 
      : 0;
    
    return {
      ...this.cacheStats,
      totalHits,
      hitRate: parseFloat(hitRate.toFixed(2)),
      l1HitRate: this.cacheStats.totalRequests > 0 
        ? parseFloat(((this.cacheStats.l1Hits / this.cacheStats.totalRequests) * 100).toFixed(2))
        : 0,
      l2HitRate: this.cacheStats.totalRequests > 0 
        ? parseFloat(((this.cacheStats.l2Hits / this.cacheStats.totalRequests) * 100).toFixed(2))
        : 0,
      missRate: this.cacheStats.totalRequests > 0 
        ? parseFloat(((this.cacheStats.misses / this.cacheStats.totalRequests) * 100).toFixed(2))
        : 0
    };
  }

  /**
   * Phase 4: Reset cache statistics
   */
  resetCacheStats(): void {
    this.cacheStats = {
      l1Hits: 0,
      l2Hits: 0,
      misses: 0,
      sets: 0,
      invalidations: 0,
      totalRequests: 0
    };
  }

  /**
   * Phase 4: Get or set with stale-while-revalidate pattern
   * Returns cached value immediately, then refreshes in background if stale
   * Uses a separate metadata key to track cache age
   */
  async getOrSetStaleWhileRevalidate<T>(
    key: string,
    fetcher: () => Promise<T>,
    ttlSeconds: number,
    staleThresholdSeconds?: number
  ): Promise<T> {
    const staleThreshold = staleThresholdSeconds || ttlSeconds * 0.8; // 80% of TTL
    const metadataKey = `${key}:meta`;
    
    // Try to get from cache
    const cached = await this.get<T>(key);
    const metadata = await this.get<{ cachedAt: number }>(metadataKey);
    
    if (cached && metadata) {
      const age = (Date.now() - metadata.cachedAt) / 1000;
      
      // If fresh, return immediately
      if (age < staleThreshold) {
        return cached;
      }
      
      // If stale but not expired, return stale value and refresh in background
      if (age < ttlSeconds) {
        // Refresh in background (don't await)
        fetcher().then(value => {
          this.set(key, value, ttlSeconds).catch(err => {
            this.logger.warn(`Failed to refresh stale cache for ${key}`, err);
          });
          this.set(metadataKey, { cachedAt: Date.now() }, ttlSeconds).catch(() => {
            // Ignore metadata errors
          });
        }).catch(err => {
          this.logger.warn(`Failed to fetch fresh value for ${key}`, err);
        });
        
        return cached;
      }
    }
    
    // Cache miss or expired - fetch and cache
    const value = await fetcher();
    await this.set(key, value, ttlSeconds);
    await this.set(metadataKey, { cachedAt: Date.now() }, ttlSeconds);
    return value;
  }

  /**
   * Phase 4: Warm cache for a list of keys
   * Useful for pre-loading default layouts on startup
   */
  async warmCache(
    keys: string[],
    fetcher: (key: string) => Promise<any>,
    ttlSeconds: number = 300
  ): Promise<void> {
    const warmPromises = keys.map(async (key) => {
      try {
        const value = await fetcher(key);
        await this.set(key, value, ttlSeconds);
        this.logger.debug(`Cache warmed for key: ${key}`);
      } catch (error) {
        this.logger.warn(`Failed to warm cache for key ${key}`, error);
      }
    });

    await Promise.allSettled(warmPromises);
    this.logger.log(`Cache warming completed for ${keys.length} keys`);
  }
}
