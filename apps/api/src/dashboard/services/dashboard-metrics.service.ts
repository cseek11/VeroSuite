import { Injectable } from '@nestjs/common';
import { MetricsService } from '../../common/services/metrics.service';

/**
 * Dashboard-specific metrics service
 * Tracks region operations, layout operations, WebSocket connections, and performance
 */
@Injectable()
export class DashboardMetricsService {
  constructor(private readonly metricsService: MetricsService) {}

  // Region operation metrics
  recordRegionOperation(operation: 'create' | 'update' | 'delete' | 'move' | 'resize', duration: number, status: 'success' | 'failure', regionType?: string) {
    this.metricsService.recordHistogram('dashboard_region_operation_duration_seconds', duration / 1000, {
      operation,
      status,
      ...(regionType && { region_type: regionType })
    });
    
    this.metricsService.incrementCounter('dashboard_region_operations_total', {
      operation,
      status,
      ...(regionType && { region_type: regionType })
    });
  }

  recordRegionLoad(layoutId: string, regionCount: number, duration: number) {
    this.metricsService.recordHistogram('dashboard_region_load_duration_seconds', duration / 1000, {
      layout_id: layoutId
    });
    
    this.metricsService.recordGauge('dashboard_regions_total', regionCount, {
      layout_id: layoutId
    });
  }

  // Layout operation metrics
  recordLayoutOperation(operation: 'create' | 'update' | 'delete' | 'load', duration: number, status: 'success' | 'failure') {
    this.metricsService.recordHistogram('dashboard_layout_operation_duration_seconds', duration / 1000, {
      operation,
      status
    });
    
    this.metricsService.incrementCounter('dashboard_layout_operations_total', {
      operation,
      status
    });
  }

  // Generic dashboard operation metrics (e.g., sagas)
  recordOperation(operation: string, duration: number, status: 'success' | 'failure') {
    this.metricsService.recordHistogram('dashboard_operations_duration_seconds', duration / 1000, {
      operation,
      status
    });

    this.metricsService.incrementCounter('dashboard_operations_total', {
      operation,
      status
    });
  }

  // WebSocket metrics
  recordWebSocketConnection(status: 'connect' | 'disconnect') {
    this.metricsService.incrementCounter('dashboard_websocket_connections_total', {
      status
    });
  }

  recordWebSocketMessage(type: string) {
    this.metricsService.incrementCounter('dashboard_websocket_messages_total', {
      message_type: type
    });
  }

  // Cache metrics
  recordCacheOperation(operation: 'hit' | 'miss' | 'set' | 'invalidate', cacheLayer: 'l1' | 'l2' | 'l3', _key?: string) {
    this.metricsService.incrementCounter('dashboard_cache_operations_total', {
      operation,
      layer: cacheLayer
    });
  }

  // Error metrics
  recordError(errorType: string, endpoint: string, statusCode?: number) {
    this.metricsService.incrementCounter('dashboard_errors_total', {
      error_type: errorType,
      endpoint,
      ...(statusCode && { status_code: statusCode.toString() })
    });
  }

  // Performance metrics
  recordQueryDuration(table: string, operation: string, duration: number) {
    this.metricsService.recordHistogram('dashboard_db_query_duration_seconds', duration / 1000, {
      table,
      operation
    });
  }

  // Active users metric
  recordActiveUsers(layoutId: string, userCount: number) {
    this.metricsService.recordGauge('dashboard_active_users', userCount, {
      layout_id: layoutId
    });
  }

  // Conflict metrics
  recordConflict(_regionId: string, resolution: 'local' | 'server' | 'merge') {
    this.metricsService.incrementCounter('dashboard_conflicts_total', {
      resolution
    });
  }

  // Validation metrics
  recordValidationError(field: string, errorType: string) {
    this.metricsService.incrementCounter('dashboard_validation_errors_total', {
      field,
      error_type: errorType
    });
  }
}


