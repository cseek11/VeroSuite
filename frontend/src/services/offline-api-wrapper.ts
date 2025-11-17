/**
 * Offline API Wrapper
 * Wraps API calls to queue them when offline and execute when online
 */

import { offlineQueueService } from './offline-queue.service';
import { enhancedApi } from '@/lib/enhanced-api';
import { logger } from '@/utils/logger';
import { isOnline } from '@/utils/pwa';

/**
 * Wrap an API call with offline queue support
 */
export async function withOfflineQueue<T>(
  operation: () => Promise<T>,
  queueConfig: {
    type: 'create' | 'update' | 'delete' | 'reorder';
    resource: 'region' | 'layout' | 'template';
    resourceId?: string;
    data: any;
  }
): Promise<T> {
  const online = isOnline();

  if (online) {
    try {
      // Try to execute immediately
      return await operation();
    } catch (error: any) {
      // If error indicates offline (network error), queue it
      if (
        error?.message?.includes('Failed to fetch') ||
        error?.message?.includes('NetworkError') ||
        error?.message?.includes('offline') ||
        !navigator.onLine
      ) {
        logger.warn('Network error detected, queueing operation', { error }, 'offline-api-wrapper');
        const queueId = offlineQueueService.enqueue(queueConfig);
        throw new Error(`Operation queued (ID: ${queueId}). Will sync when online.`);
      }
      throw error;
    }
  } else {
    // Offline - queue the operation
    logger.debug('Offline, queueing operation', { type: queueConfig.type, resource: queueConfig.resource }, 'offline-api-wrapper');
    const queueId = offlineQueueService.enqueue(queueConfig);
    
    // Return a promise that will resolve when synced
    // For now, we'll throw an error indicating it's queued
    // The UI should handle this gracefully
    throw new Error(`Operation queued (ID: ${queueId}). Will sync when online.`);
  }
}

/**
 * Create region with offline support
 */
export async function createRegionWithOffline(
  layoutId: string,
  regionData: any
): Promise<any> {
  return withOfflineQueue(
    () => enhancedApi.dashboardLayouts.createRegion(layoutId, regionData),
    {
      type: 'create',
      resource: 'region',
      data: { layout_id: layoutId, ...regionData }
    }
  );
}

/**
 * Update region with offline support
 */
export async function updateRegionWithOffline(
  layoutId: string,
  regionId: string,
  updates: any
): Promise<any> {
  return withOfflineQueue(
    () => enhancedApi.dashboardLayouts.updateRegion(layoutId, regionId, updates),
    {
      type: 'update',
      resource: 'region',
      resourceId: regionId,
      data: { layout_id: layoutId, ...updates }
    }
  );
}

/**
 * Delete region with offline support
 */
export async function deleteRegionWithOffline(
  layoutId: string,
  regionId: string
): Promise<void> {
  return withOfflineQueue(
    () => enhancedApi.dashboardLayouts.deleteRegion(layoutId, regionId),
    {
      type: 'delete',
      resource: 'region',
      resourceId: regionId,
      data: { layout_id: layoutId }
    }
  );
}

/**
 * Reorder regions with offline support
 */
export async function reorderRegionsWithOffline(
  layoutId: string,
  regionIds: string[]
): Promise<void> {
  return withOfflineQueue(
    () => enhancedApi.dashboardLayouts.reorderRegions(layoutId, regionIds),
    {
      type: 'reorder',
      resource: 'region',
      data: { layout_id: layoutId, regionIds }
    }
  );
}


