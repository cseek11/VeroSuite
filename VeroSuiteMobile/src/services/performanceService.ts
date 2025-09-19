// ============================================================================
// VeroField Mobile App - Performance Optimization Service
// ============================================================================

import ImageResizer from '@bam.tech/react-native-image-resizer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS, APP_CONFIG } from '../constants';
import { AppError } from '../types';

export interface ImageCompressionOptions {
  maxWidth: number;
  maxHeight: number;
  quality: number;
  format: 'JPEG' | 'PNG' | 'WEBP';
  keepMeta: boolean;
}

export interface CacheItem {
  key: string;
  data: any;
  timestamp: string;
  expiresAt: string;
}

class PerformanceService {
  private memoryCache: Map<string, any> = new Map();
  private readonly DEFAULT_CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  /**
   * Compress image for upload
   */
  async compressImage(
    uri: string,
    options?: Partial<ImageCompressionOptions>
  ): Promise<{ uri: string; size: number }> {
    try {
      const compressionOptions: ImageCompressionOptions = {
        maxWidth: 1920,
        maxHeight: 1080,
        quality: 0.8,
        format: 'JPEG',
        keepMeta: false,
        ...options,
      };

      const result = await ImageResizer.createResizedImage(
        uri,
        compressionOptions.maxWidth,
        compressionOptions.maxHeight,
        compressionOptions.format,
        compressionOptions.quality,
        0, // rotation
        undefined, // outputPath
        compressionOptions.keepMeta
      );

      console.log(`Image compressed: ${uri} -> ${result.uri}`);
      console.log(`Size reduced: ${result.size} bytes`);

      return {
        uri: result.uri,
        size: result.size,
      };
    } catch (error) {
      console.error('Error compressing image:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Compress multiple images in batch
   */
  async compressImageBatch(
    images: Array<{ uri: string; options?: Partial<ImageCompressionOptions> }>,
    onProgress?: (completed: number, total: number) => void
  ): Promise<Array<{ uri: string; size: number }>> {
    const results = [];
    const total = images.length;

    for (let i = 0; i < images.length; i++) {
      try {
        const result = await this.compressImage(images[i].uri, images[i].options);
        results.push(result);
        
        if (onProgress) {
          onProgress(i + 1, total);
        }
      } catch (error) {
        console.error(`Failed to compress image ${i + 1}:`, error);
        // Return original URI if compression fails
        results.push({ uri: images[i].uri, size: 0 });
        
        if (onProgress) {
          onProgress(i + 1, total);
        }
      }
    }

    return results;
  }

  /**
   * Cache data in memory
   */
  cacheInMemory(key: string, data: any, ttl?: number): void {
    try {
      const expiresAt = new Date(Date.now() + (ttl || this.DEFAULT_CACHE_DURATION));
      
      this.memoryCache.set(key, {
        data,
        expiresAt: expiresAt.getTime(),
      });

      // Clean up expired items periodically
      this.cleanupMemoryCache();
    } catch (error) {
      console.error('Error caching data in memory:', error);
    }
  }

  /**
   * Get data from memory cache
   */
  getFromMemoryCache(key: string): any | null {
    try {
      const cached = this.memoryCache.get(key);
      
      if (!cached) return null;
      
      if (Date.now() > cached.expiresAt) {
        this.memoryCache.delete(key);
        return null;
      }

      return cached.data;
    } catch (error) {
      console.error('Error getting data from memory cache:', error);
      return null;
    }
  }

  /**
   * Cache data in persistent storage
   */
  async cachePersistent(key: string, data: any, ttl?: number): Promise<void> {
    try {
      const expiresAt = new Date(Date.now() + (ttl || this.DEFAULT_CACHE_DURATION));
      
      const cacheItem: CacheItem = {
        key,
        data,
        timestamp: new Date().toISOString(),
        expiresAt: expiresAt.toISOString(),
      };

      await AsyncStorage.setItem(
        `${STORAGE_KEYS.APP_SETTINGS}:cache:${key}`,
        JSON.stringify(cacheItem)
      );
    } catch (error) {
      console.error('Error caching data persistently:', error);
    }
  }

  /**
   * Get data from persistent cache
   */
  async getFromPersistentCache(key: string): Promise<any | null> {
    try {
      const data = await AsyncStorage.getItem(`${STORAGE_KEYS.APP_SETTINGS}:cache:${key}`);
      
      if (!data) return null;
      
      const cacheItem: CacheItem = JSON.parse(data);
      
      if (new Date() > new Date(cacheItem.expiresAt)) {
        // Cache expired, remove it
        await AsyncStorage.removeItem(`${STORAGE_KEYS.APP_SETTINGS}:cache:${key}`);
        return null;
      }

      return cacheItem.data;
    } catch (error) {
      console.error('Error getting data from persistent cache:', error);
      return null;
    }
  }

  /**
   * Clear memory cache
   */
  clearMemoryCache(): void {
    this.memoryCache.clear();
    console.log('Memory cache cleared');
  }

  /**
   * Clear persistent cache
   */
  async clearPersistentCache(): Promise<void> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const cacheKeys = keys.filter(key => key.includes(':cache:'));
      
      if (cacheKeys.length > 0) {
        await AsyncStorage.multiRemove(cacheKeys);
        console.log(`Cleared ${cacheKeys.length} persistent cache items`);
      }
    } catch (error) {
      console.error('Error clearing persistent cache:', error);
    }
  }

  /**
   * Get cache statistics
   */
  async getCacheStats(): Promise<{
    memoryItems: number;
    persistentItems: number;
    totalMemorySize: number;
  }> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const cacheKeys = keys.filter(key => key.includes(':cache:'));
      
      // Calculate memory cache size (approximate)
      let totalMemorySize = 0;
      this.memoryCache.forEach((value) => {
        totalMemorySize += JSON.stringify(value).length * 2; // Rough byte estimate
      });

      return {
        memoryItems: this.memoryCache.size,
        persistentItems: cacheKeys.length,
        totalMemorySize,
      };
    } catch (error) {
      console.error('Error getting cache stats:', error);
      return {
        memoryItems: 0,
        persistentItems: 0,
        totalMemorySize: 0,
      };
    }
  }

  /**
   * Optimize app startup performance
   */
  async optimizeStartup(): Promise<void> {
    try {
      // Clean up old cache items
      await this.cleanupPersistentCache();
      
      // Preload critical data
      await this.preloadCriticalData();
      
      console.log('App startup optimization completed');
    } catch (error) {
      console.error('Error optimizing startup:', error);
    }
  }

  /**
   * Clean up expired memory cache items
   */
  private cleanupMemoryCache(): void {
    const now = Date.now();
    const keysToDelete: string[] = [];

    this.memoryCache.forEach((value, key) => {
      if (now > value.expiresAt) {
        keysToDelete.push(key);
      }
    });

    keysToDelete.forEach(key => this.memoryCache.delete(key));
    
    if (keysToDelete.length > 0) {
      console.log(`Cleaned up ${keysToDelete.length} expired memory cache items`);
    }
  }

  /**
   * Clean up expired persistent cache items
   */
  private async cleanupPersistentCache(): Promise<void> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const cacheKeys = keys.filter(key => key.includes(':cache:'));
      const expiredKeys: string[] = [];

      for (const key of cacheKeys) {
        try {
          const data = await AsyncStorage.getItem(key);
          if (data) {
            const cacheItem: CacheItem = JSON.parse(data);
            if (new Date() > new Date(cacheItem.expiresAt)) {
              expiredKeys.push(key);
            }
          }
        } catch (error) {
          // If we can't parse the item, consider it expired
          expiredKeys.push(key);
        }
      }

      if (expiredKeys.length > 0) {
        await AsyncStorage.multiRemove(expiredKeys);
        console.log(`Cleaned up ${expiredKeys.length} expired persistent cache items`);
      }
    } catch (error) {
      console.error('Error cleaning up persistent cache:', error);
    }
  }

  /**
   * Preload critical app data
   */
  private async preloadCriticalData(): Promise<void> {
    try {
      // Preload user settings, job constants, etc.
      // This would cache frequently accessed data
      console.log('Critical data preloaded');
    } catch (error) {
      console.error('Error preloading critical data:', error);
    }
  }

  /**
   * Monitor app performance
   */
  startPerformanceMonitoring(): void {
    // Set up performance monitoring
    console.log('Performance monitoring started');
    
    // Monitor memory usage
    setInterval(() => {
      this.cleanupMemoryCache();
    }, 60000); // Clean up every minute
  }

  /**
   * Handle performance service errors
   */
  private handleError(error: any): AppError {
    if (error instanceof Error) {
      return {
        code: 'PERFORMANCE_ERROR',
        message: error.message,
        details: error,
      };
    }

    return {
      code: 'UNKNOWN_ERROR',
      message: 'An unexpected performance error occurred',
      details: error,
    };
  }
}

// Export singleton instance
export const performanceService = new PerformanceService();
export default performanceService;
