import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, RedisClientType } from 'redis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);
  private client!: RedisClientType;
  private isConnected = false;

  constructor(private readonly configService: ConfigService) {}

  async onModuleInit() {
    // Skip Redis initialization in development if no Redis URL is configured
    const redisUrl = this.configService.get<string>('REDIS_URL');
    if (!redisUrl) {
      this.logger.warn('No REDIS_URL configured - running without Redis cache');
      this.isConnected = false;
      return;
    }

    try {
      
      this.client = createClient({
        url: redisUrl,
        socket: {
          reconnectStrategy: (retries) => {
            if (retries > 3) {
              this.logger.warn('Redis connection failed after 3 retries - disabling Redis');
              return false;
            }
            return Math.min(retries * 100, 1000);
          }
        }
      });

      this.client.on('error', (err) => {
        this.logger.warn('Redis Client Error (continuing without cache):', err.message);
        this.isConnected = false;
      });

      this.client.on('connect', () => {
        this.logger.log('Redis client connected');
        this.isConnected = true;
      });

      this.client.on('disconnect', () => {
        this.logger.warn('Redis client disconnected');
        this.isConnected = false;
      });

      // Try to connect with timeout
      const connectPromise = this.client.connect();
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Redis connection timeout')), 2000)
      );
      
      await Promise.race([connectPromise, timeoutPromise]);
      this.logger.log('Redis service initialized successfully');
    } catch (error) {
      this.logger.warn('Redis unavailable - continuing without cache:', error instanceof Error ? error.message : String(error));
      this.isConnected = false;
    }
  }

  async onModuleDestroy() {
    if (this.client && this.isConnected) {
      await this.client.disconnect();
      this.logger.log('Redis service disconnected');
    }
  }

  getClient(): RedisClientType | null {
    return this.isConnected ? this.client : null;
  }

  isRedisConnected(): boolean {
    return this.isConnected;
  }

  // Cache operations - fail fast to prevent UI blocking
  async get<T>(key: string): Promise<T | null> {
    if (!this.isConnected) {
      return null; // Silent fail - no logging spam
    }

    try {
      const value = await this.client.get(key);
      return value ? JSON.parse(value as string) : null;
    } catch (error) {
      this.isConnected = false; // Mark as disconnected on error
      return null;
    }
  }

  async set(key: string, value: any, ttlSeconds?: number): Promise<boolean> {
    if (!this.isConnected) {
      return false; // Silent fail - no logging spam
    }

    try {
      const serializedValue = JSON.stringify(value);
      if (ttlSeconds) {
        await this.client.setEx(key, ttlSeconds, serializedValue);
      } else {
        await this.client.set(key, serializedValue);
      }
      return true;
    } catch (error) {
      this.isConnected = false; // Mark as disconnected on error
      return false;
    }
  }

  async del(key: string): Promise<boolean> {
    if (!this.isConnected) {
      return false; // Silent fail
    }

    try {
      await this.client.del(key);
      return true;
    } catch (error) {
      this.logger.error('Error deleting cache key:', key, error);
      return false;
    }
  }

  async exists(key: string): Promise<boolean> {
    if (!this.isConnected) {
      return false;
    }

    try {
      const result = await this.client.exists(key);
      return result === 1;
    } catch (error) {
      this.logger.error('Error checking cache key existence:', key, error);
      return false;
    }
  }

  async expire(key: string, ttlSeconds: number): Promise<boolean> {
    if (!this.isConnected) {
      return false;
    }

    try {
      const result = await this.client.expire(key, ttlSeconds);
      return result === 1;
    } catch (error) {
      this.logger.error('Error setting cache expiration:', key, error);
      return false;
    }
  }

  // Batch operations
  async mget<T>(keys: string[]): Promise<(T | null)[]> {
    if (!this.isConnected || keys.length === 0) {
      return keys.map(() => null);
    }

    try {
      const values = await this.client.mGet(keys);
      return values.map(value => value ? JSON.parse(value as string) : null);
    } catch (error) {
      this.logger.error('Error getting multiple cache keys:', error);
      return keys.map(() => null);
    }
  }

  async mset(keyValuePairs: Record<string, any>, ttlSeconds?: number): Promise<boolean> {
    if (!this.isConnected || Object.keys(keyValuePairs).length === 0) {
      return false;
    }

    try {
      const serializedPairs: Record<string, string> = {};
      for (const [key, value] of Object.entries(keyValuePairs)) {
        serializedPairs[key] = JSON.stringify(value);
      }

      await this.client.mSet(serializedPairs);

      if (ttlSeconds) {
        const expirePromises = Object.keys(serializedPairs).map(key => 
          this.client.expire(key, ttlSeconds)
        );
        await Promise.all(expirePromises);
      }

      return true;
    } catch (error) {
      this.logger.error('Error setting multiple cache keys:', error);
      return false;
    }
  }

  // Pattern operations
  async keys(pattern: string): Promise<string[]> {
    if (!this.isConnected) {
      return [];
    }

    try {
      return await this.client.keys(pattern);
    } catch (error) {
      this.logger.error('Error getting cache keys with pattern:', pattern, error);
      return [];
    }
  }

  async flushPattern(pattern: string): Promise<number> {
    if (!this.isConnected) {
      return 0;
    }

    try {
      const keys = await this.keys(pattern);
      if (keys.length === 0) {
        return 0;
      }

      const result = await this.client.del(keys);
      return result;
    } catch (error) {
      this.logger.error('Error flushing cache pattern:', pattern, error);
      return 0;
    }
  }

  // Cache statistics
  async getStats(): Promise<{
    connected: boolean;
    memoryUsage?: string;
    keyCount?: number;
    hitRate?: number;
  }> {
    if (!this.isConnected) {
      return { connected: false };
    }

    try {
      const info = await this.client.info('memory');
      const dbSize = await this.client.dbSize();
      
      // Parse memory usage from info string
      const memoryMatch = info.match(/used_memory_human:(.+)/);
      const memoryUsage = memoryMatch ? memoryMatch[1]?.trim() : 'unknown';

      return {
        connected: true,
        ...(memoryUsage && { memoryUsage }),
        ...(dbSize !== undefined && { keyCount: dbSize }),
        hitRate: 0 // Would need to track hits/misses separately
      };
    } catch (error) {
      this.logger.error('Error getting Redis stats:', error);
      return { connected: false };
    }
  }
}
