import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CacheService } from '../../common/services/cache.service';
import { DashboardService } from '../dashboard.service';

/**
 * Phase 4: Cache warming service
 * Pre-loads frequently accessed data on startup and periodically
 */
@Injectable()
export class CacheWarmingService implements OnModuleInit {
  private readonly logger = new Logger(CacheWarmingService.name);
  private warmingEnabled: boolean;

  constructor(
    private readonly cacheService: CacheService,
    private readonly dashboardService: DashboardService,
    private readonly configService: ConfigService
  ) {
    this.warmingEnabled = this.configService.get<boolean>('CACHE_WARMING_ENABLED', false);
  }

  /**
   * Warm cache on module initialization
   */
  async onModuleInit() {
    if (!this.warmingEnabled) {
      this.logger.log('Cache warming disabled');
      return;
    }

    this.logger.log('Starting cache warming...');
    
    // Warm cache in background (don't block startup)
    this.warmDefaultLayouts().catch(err => {
      this.logger.error('Cache warming failed', err);
    });
  }

  /**
   * Warm cache for default layouts
   * This pre-loads the most commonly accessed layouts
   */
  async warmDefaultLayouts(): Promise<void> {
    try {
      // Get list of default layout IDs to warm
      // In a real scenario, you might query for frequently accessed layouts
      const defaultLayoutKeys: string[] = [];
      
      // For now, we'll warm based on a pattern
      // In production, you might:
      // 1. Query for layouts accessed in last 24 hours
      // 2. Warm layouts for active tenants
      // 3. Warm layouts based on user role defaults
      
      if (defaultLayoutKeys.length === 0) {
        this.logger.debug('No default layouts to warm');
        return;
      }

      await this.cacheService.warmCache(
        defaultLayoutKeys,
        async (layoutId) => {
          // Extract tenant ID from cache key if needed
          // For now, we'll use a mock user - in production, get from context
          const mockUser = { tenantId: 'default', id: 'system' };
          
          // Fetch layout and regions
          const layout = await this.dashboardService.getLayout(layoutId, mockUser);
          const regions = await this.dashboardService.getLayoutRegions(layoutId, mockUser);
          
          return { layout, regions };
        },
        300 // 5 minute TTL
      );

      this.logger.log(`Cache warmed for ${defaultLayoutKeys.length} default layouts`);
    } catch (error) {
      this.logger.error('Failed to warm default layouts', error);
    }
  }

  /**
   * Warm cache for a specific layout
   * Can be called on-demand when a layout becomes popular
   */
  async warmLayout(layoutId: string, tenantId: string): Promise<void> {
    try {
      const cacheKey = `regions:layout:${layoutId}:tenant:${tenantId}`;
      
      // Check if already cached
      const cached = await this.cacheService.get(cacheKey);
      if (cached) {
        this.logger.debug(`Layout ${layoutId} already cached`);
        return;
      }

      // Warm the cache
      const mockUser = { tenantId, id: 'system' };
      await this.dashboardService.getLayout(layoutId, mockUser);
      const regions = await this.dashboardService.getLayoutRegions(layoutId, mockUser);
      
      await this.cacheService.set(cacheKey, regions, 300);
      this.logger.debug(`Cache warmed for layout ${layoutId}`);
    } catch (error) {
      this.logger.warn(`Failed to warm cache for layout ${layoutId}`, error);
    }
  }

  /**
   * Periodic cache warming for active layouts
   * Should be called by a scheduled job
   */
  async warmActiveLayouts(): Promise<void> {
    // This would query for layouts that have been accessed recently
    // and warm their cache
    // Implementation depends on your analytics/access tracking
    this.logger.debug('Periodic cache warming (not yet implemented)');
  }
}

