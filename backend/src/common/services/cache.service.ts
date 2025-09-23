import { Injectable, Logger } from '@nestjs/common';
import { RedisService } from './redis.service';

export interface CacheOptions {
  ttl?: number; // Time to live in seconds
  prefix?: string;
  fallback?: () => Promise<any>;
}

@Injectable()
export class CacheService {
  private readonly logger = new Logger(CacheService.name);
  private readonly defaultTTL = 300; // 5 minutes default
  private readonly memoryCache = new Map<string, { data: any; expiry: number }>();

  constructor(private readonly redisService: RedisService) {}

  // Generate cache key with prefix
  private getCacheKey(key: string, prefix?: string): string {
    const keyPrefix = prefix || 'default';
    return `${keyPrefix}:${key}`;
  }

  // Get data from cache with fallback
  async get<T>(key: string, options: CacheOptions = {}): Promise<T | null> {
    const cacheKey = this.getCacheKey(key, options.prefix);
    
    try {
      // Try Redis first if available
      if (this.redisService.isRedisConnected()) {
        const cached = await this.redisService.get<T>(cacheKey);
        if (cached !== null) {
          this.logger.debug(`Redis cache hit for key: ${cacheKey}`);
          return cached;
        }
      } else {
        // Use memory cache fallback when Redis is not available
        const memCached = this.memoryCache.get(cacheKey);
        if (memCached && memCached.expiry > Date.now()) {
          this.logger.debug(`Memory cache hit for key: ${cacheKey}`);
          return memCached.data;
        } else if (memCached) {
          // Remove expired entry
          this.memoryCache.delete(cacheKey);
        }
      }

      // Cache miss - try fallback if provided
      if (options.fallback) {
        this.logger.debug(`Cache miss for key: ${cacheKey}, using fallback`);
        const data = await options.fallback();
        
        // Cache the result
        if (data !== null) {
          await this.set(key, data, { ...options, ttl: options.ttl || this.defaultTTL });
        }
        
        return data;
      }

      return null;
    } catch (error) {
      this.logger.error(`Error getting cache key ${cacheKey}:`, error);
      
      // Fallback to database if cache fails
      if (options.fallback) {
        this.logger.warn(`Cache error for key: ${cacheKey}, falling back to database`);
        return await options.fallback();
      }
      
      return null;
    }
  }

  // Set data in cache
  async set(key: string, value: any, options: CacheOptions = {}): Promise<boolean> {
    const cacheKey = this.getCacheKey(key, options.prefix);
    const ttl = options.ttl || this.defaultTTL;
    
    try {
      // Try Redis first if available
      if (this.redisService.isRedisConnected()) {
        const success = await this.redisService.set(cacheKey, value, ttl);
        if (success) {
          this.logger.debug(`Redis cached data for key: ${cacheKey} with TTL: ${ttl}s`);
        }
        return success;
      } else {
        // Use memory cache fallback
        const expiry = Date.now() + (ttl * 1000);
        this.memoryCache.set(cacheKey, { data: value, expiry });
        this.logger.debug(`Memory cached data for key: ${cacheKey} with TTL: ${ttl}s`);
        
        // Clean up expired entries periodically
        this.cleanupExpiredEntries();
        return true;
      }
    } catch (error) {
      this.logger.error(`Error setting cache key ${cacheKey}:`, error);
      return false;
    }
  }

  // Clean up expired memory cache entries
  private cleanupExpiredEntries(): void {
    const now = Date.now();
    for (const [key, entry] of this.memoryCache.entries()) {
      if (entry.expiry <= now) {
        this.memoryCache.delete(key);
      }
    }
  }

  // Delete data from cache
  async delete(key: string, prefix?: string): Promise<boolean> {
    const cacheKey = this.getCacheKey(key, prefix);
    
    try {
      const success = await this.redisService.del(cacheKey);
      if (success) {
        this.logger.debug(`Deleted cache key: ${cacheKey}`);
      }
      return success;
    } catch (error) {
      this.logger.error(`Error deleting cache key ${cacheKey}:`, error);
      return false;
    }
  }

  // Check if key exists in cache
  async exists(key: string, prefix?: string): Promise<boolean> {
    const cacheKey = this.getCacheKey(key, prefix);
    return await this.redisService.exists(cacheKey);
  }

  // Get multiple keys
  async mget<T>(keys: string[], prefix?: string): Promise<(T | null)[]> {
    const cacheKeys = keys.map(key => this.getCacheKey(key, prefix));
    return await this.redisService.mget<T>(cacheKeys);
  }

  // Set multiple keys
  async mset(keyValuePairs: Record<string, any>, options: CacheOptions = {}): Promise<boolean> {
    const prefixedPairs: Record<string, any> = {};
    
    for (const [key, value] of Object.entries(keyValuePairs)) {
      const cacheKey = this.getCacheKey(key, options.prefix);
      prefixedPairs[cacheKey] = value;
    }

    return await this.redisService.mset(prefixedPairs, options.ttl || this.defaultTTL);
  }

  // Invalidate cache by pattern
  async invalidatePattern(pattern: string, prefix?: string): Promise<number> {
    const fullPattern = prefix ? `${prefix}:${pattern}` : pattern;
    const deletedCount = await this.redisService.flushPattern(fullPattern);
    this.logger.debug(`Invalidated ${deletedCount} cache keys matching pattern: ${fullPattern}`);
    return deletedCount;
  }

  // KPI-specific cache methods
  async getKPIData(tenantId: string, kpiId?: string): Promise<any[] | null> {
    const key = kpiId ? `data:${tenantId}:${kpiId}` : `data:${tenantId}:all`;
    return await this.get(key, { 
      prefix: 'kpi',
      ttl: 180, // 3 minutes (shorter for freshness)
      fallback: async () => {
        this.logger.debug(`KPI data cache miss for tenant: ${tenantId}, kpi: ${kpiId || 'all'}`);
        return null;
      }
    });
  }

  async setKPIData(tenantId: string, data: any[], kpiId?: string): Promise<boolean> {
    const key = kpiId ? `data:${tenantId}:${kpiId}` : `data:${tenantId}:all`;
    return await this.set(key, data, { 
      prefix: 'kpi',
      ttl: 180 // 3 minutes
    });
  }

  // Batch KPI operations - NEW: fetch all KPIs at once
  async getBatchKPIData(tenantId: string, kpiIds: string[]): Promise<Record<string, any> | null> {
    if (!this.redisService.isRedisConnected()) return null;
    
    try {
      const keys = kpiIds.map(kpiId => this.getCacheKey(`data:${tenantId}:${kpiId}`, 'kpi'));
      const client = this.redisService.getClient();
      if (!client) return null;
      
      const values = await client.mGet(keys);
      
      const result: Record<string, any> = {};
      values.forEach((value: string | null, index: number) => {
        if (value && kpiIds[index]) {
          result[kpiIds[index]] = JSON.parse(value);
        }
      });
      
      return Object.keys(result).length > 0 ? result : null;
    } catch (error) {
      this.logger.debug('Batch KPI data cache miss');
      return null;
    }
  }

  async setBatchKPIData(tenantId: string, data: Record<string, any>): Promise<boolean> {
    if (!this.redisService.isRedisConnected()) return false;
    
    try {
      const client = this.redisService.getClient();
      if (!client) return false;
      
      const pipeline = client.multi();
      Object.entries(data).forEach(([kpiId, value]) => {
        const key = this.getCacheKey(`data:${tenantId}:${kpiId}`, 'kpi');
        pipeline.setEx(key, 180, JSON.stringify(value));
      });
      await pipeline.exec();
      return true;
    } catch (error) {
      return false;
    }
  }

  async invalidateKPICache(tenantId: string, kpiId?: string): Promise<number> {
    if (kpiId) {
      await this.delete(`kpi-data:${tenantId}:${kpiId}`, 'kpis');
      await this.delete(`kpi-config:${tenantId}:${kpiId}`, 'kpis');
      return 1;
    } else {
      // Invalidate all KPI cache for tenant
      const pattern = `kpi-*:${tenantId}:*`;
      return await this.invalidatePattern(pattern, 'kpis');
    }
  }

  // KPI Config cache methods - structured keys
  async getKPIConfigs(tenantId: string): Promise<any[] | null> {
    const key = `configs:${tenantId}`;
    return await this.get(key, { 
      prefix: 'kpi',
      ttl: 300, // 5 minutes (shorter TTL for freshness)
      fallback: async () => {
        this.logger.debug(`KPI configs cache miss for tenant: ${tenantId}`);
        return null;
      }
    });
  }

  async setKPIConfigs(tenantId: string, configs: any[]): Promise<boolean> {
    const key = `configs:${tenantId}`;
    return await this.set(key, configs, { 
      prefix: 'kpi',
      ttl: 300 // 5 minutes
    });
  }

  // KPI Trends cache methods - structured keys
  async getKPITrends(tenantId: string, period: string): Promise<any[] | null> {
    const key = `trends:${tenantId}:${period}`;
    return await this.get(key, { 
      prefix: 'kpi',
      ttl: 180, // 3 minutes
      fallback: async () => {
        this.logger.debug(`KPI trends cache miss for tenant: ${tenantId}, period: ${period}`);
        return null;
      }
    });
  }

  async setKPITrends(tenantId: string, period: string, trends: any[]): Promise<boolean> {
    const key = `trends:${tenantId}:${period}`;
    return await this.set(key, trends, { 
      prefix: 'kpi',
      ttl: 180 // 3 minutes
    });
  }

  // Cache warming methods
  async warmKPICache(tenantId: string): Promise<void> {
    this.logger.log(`Warming KPI cache for tenant: ${tenantId}`);
    
    try {
      // This would be called with actual data fetching logic
      // For now, we'll just log the warming attempt
      this.logger.debug(`KPI cache warmed for tenant: ${tenantId}`);
    } catch (error) {
      this.logger.error(`Error warming KPI cache for tenant: ${tenantId}`, error);
    }
  }

  // Cache statistics
  async getCacheStats(): Promise<{
    connected: boolean;
    kpiKeys: number;
    memoryUsage?: string;
    totalKeys?: number;
  }> {
    const redisStats = await this.redisService.getStats();
    
    if (!redisStats.connected) {
      return {
        connected: false,
        kpiKeys: 0
      };
    }

    try {
      const kpiKeys = await this.redisService.keys('kpis:*');
      
      return {
        connected: true,
        kpiKeys: kpiKeys.length,
        ...(redisStats.memoryUsage && { memoryUsage: redisStats.memoryUsage }),
        ...(redisStats.keyCount && { totalKeys: redisStats.keyCount })
      };
    } catch (error) {
      this.logger.error('Error getting cache stats:', error);
      return {
        connected: true,
        kpiKeys: 0,
        ...(redisStats.memoryUsage && { memoryUsage: redisStats.memoryUsage }),
        ...(redisStats.keyCount && { totalKeys: redisStats.keyCount })
      };
    }
  }
}
