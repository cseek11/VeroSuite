import { Controller, Get, Optional } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { MetricsService } from '../services/metrics.service';
import { CacheService } from '../services/cache.service';

/**
 * Metrics controller for Prometheus scraping
 * Phase 4: Enhanced with cache statistics
 */
@ApiTags('Metrics')
@Controller('metrics')
export class MetricsController {
  constructor(
    private readonly metricsService: MetricsService,
    @Optional() private readonly cacheService?: CacheService
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get Prometheus-formatted metrics' })
  @ApiResponse({ status: 200, description: 'Metrics in Prometheus format' })
  getMetrics() {
    return this.metricsService.getPrometheusMetrics();
  }

  /**
   * Phase 4: Get cache statistics
   */
  @Get('cache')
  @ApiOperation({ summary: 'Get cache statistics' })
  @ApiResponse({ status: 200, description: 'Cache statistics' })
  getCacheStats() {
    if (!this.cacheService) {
      return { error: 'Cache service not available' };
    }
    return this.cacheService.getCacheStats();
  }
}


