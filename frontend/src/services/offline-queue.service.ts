/**
 * Offline Queue Service
 * Manages queued dashboard operations when offline and syncs when back online
 */

import { logger } from '@/utils/logger';
import { enhancedApi } from '@/lib/enhanced-api';

export interface QueuedOperation {
  id: string;
  type: 'create' | 'update' | 'delete' | 'reorder';
  resource: 'region' | 'layout' | 'template';
  resourceId?: string;
  data: any;
  timestamp: number;
  retries: number;
  status: 'pending' | 'syncing' | 'failed' | 'completed';
  error?: string;
}

const QUEUE_STORAGE_KEY = 'dashboard_offline_queue';
const MAX_RETRIES = 3;
const SYNC_INTERVAL = 5000; // 5 seconds

class OfflineQueueService {
  private queue: QueuedOperation[] = [];
  private syncInterval: NodeJS.Timeout | null = null;
  private isOnline = navigator.onLine;
  private listeners: Set<(queue: QueuedOperation[]) => void> = new Set();

  constructor() {
    this.loadQueue();
    this.setupOnlineListener();
    this.startSyncInterval();
  }

  /**
   * Load queue from storage
   */
  private loadQueue(): void {
    try {
      const stored = localStorage.getItem(QUEUE_STORAGE_KEY);
      if (stored) {
        this.queue = JSON.parse(stored);
        logger.debug('Loaded offline queue', { count: this.queue.length }, 'offline-queue');
      }
    } catch (error) {
      logger.error('Failed to load offline queue', { error }, 'offline-queue');
      this.queue = [];
    }
  }

  /**
   * Save queue to storage
   */
  private saveQueue(): void {
    try {
      localStorage.setItem(QUEUE_STORAGE_KEY, JSON.stringify(this.queue));
      this.notifyListeners();
    } catch (error) {
      logger.error('Failed to save offline queue', { error }, 'offline-queue');
    }
  }

  /**
   * Setup online/offline listeners
   */
  private setupOnlineListener(): void {
    window.addEventListener('online', () => {
      logger.info('Connection restored, syncing queue', {}, 'offline-queue');
      this.isOnline = true;
      this.syncQueue();
    });

    window.addEventListener('offline', () => {
      logger.info('Connection lost, queueing operations', {}, 'offline-queue');
      this.isOnline = false;
    });
  }

  /**
   * Start sync interval
   */
  private startSyncInterval(): void {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
    }

    this.syncInterval = setInterval(() => {
      if (this.isOnline && this.queue.length > 0) {
        this.syncQueue();
      }
    }, SYNC_INTERVAL);
  }

  /**
   * Add operation to queue
   */
  enqueue(operation: Omit<QueuedOperation, 'id' | 'timestamp' | 'retries' | 'status'>): string {
    const queuedOp: QueuedOperation = {
      ...operation,
      id: `op-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      retries: 0,
      status: 'pending'
    };

    this.queue.push(queuedOp);
    this.saveQueue();

    logger.debug('Operation queued', { operation: queuedOp.id, type: queuedOp.type }, 'offline-queue');

    // Try to sync immediately if online
    if (this.isOnline) {
      this.syncQueue();
    }

    return queuedOp.id;
  }

  /**
   * Sync queue with backend
   */
  async syncQueue(): Promise<void> {
    if (!this.isOnline) {
      return;
    }

    const pendingOps = this.queue.filter(op => op.status === 'pending' || op.status === 'failed');
    if (pendingOps.length === 0) {
      return;
    }

    logger.debug('Syncing queue', { count: pendingOps.length }, 'offline-queue');

    for (const op of pendingOps) {
      if (op.retries >= MAX_RETRIES) {
        op.status = 'failed';
        op.error = 'Max retries exceeded';
        this.saveQueue();
        continue;
      }

      op.status = 'syncing';
      this.saveQueue();

      try {
        await this.executeOperation(op);
        op.status = 'completed';
        logger.debug('Operation synced', { operation: op.id }, 'offline-queue');
      } catch (error) {
        op.retries++;
        op.status = 'failed';
        op.error = error instanceof Error ? error.message : String(error);
        logger.error('Operation sync failed', { error, operation: op.id, retries: op.retries }, 'offline-queue');
      }

      this.saveQueue();
    }

    // Remove completed operations after a delay
    setTimeout(() => {
      this.queue = this.queue.filter(op => op.status !== 'completed');
      this.saveQueue();
    }, 10000); // Keep completed ops for 10 seconds for UI feedback
  }

  /**
   * Execute a queued operation
   */
  private async executeOperation(op: QueuedOperation): Promise<void> {
    switch (op.resource) {
      case 'region':
        await this.executeRegionOperation(op);
        break;
      case 'layout':
        await this.executeLayoutOperation(op);
        break;
      case 'template':
        await this.executeTemplateOperation(op);
        break;
      default:
        throw new Error(`Unknown resource type: ${op.resource}`);
    }
  }

  /**
   * Execute region operation
   */
  private async executeRegionOperation(op: QueuedOperation): Promise<void> {
    const layoutId = op.data.layout_id;
    if (!layoutId) {
      throw new Error('Layout ID required for region operations');
    }

    switch (op.type) {
      case 'create':
        await enhancedApi.dashboardLayouts.createRegion(layoutId, op.data);
        break;
      case 'update':
        if (!op.resourceId) throw new Error('Resource ID required for update');
        await enhancedApi.dashboardLayouts.updateRegion(layoutId, op.resourceId, op.data);
        break;
      case 'delete':
        if (!op.resourceId) throw new Error('Resource ID required for delete');
        await enhancedApi.dashboardLayouts.deleteRegion(layoutId, op.resourceId);
        break;
      case 'reorder':
        await enhancedApi.dashboardLayouts.reorderRegions(layoutId, op.data.regionIds);
        break;
    }
  }

  /**
   * Execute layout operation
   */
  private async executeLayoutOperation(op: QueuedOperation): Promise<void> {
    switch (op.type) {
      case 'update':
        // TODO: Implement layout update when API method is available
        throw new Error('Layout update not yet implemented - no API method available');
      default:
        throw new Error(`Unsupported layout operation: ${op.type}`);
    }
  }

  /**
   * Execute template operation
   */
  private async executeTemplateOperation(op: QueuedOperation): Promise<void> {
    switch (op.type) {
      case 'create':
        await enhancedApi.dashboardLayouts.templates.create(op.data);
        break;
      case 'update':
        if (!op.resourceId) throw new Error('Resource ID required for update');
        await enhancedApi.dashboardLayouts.templates.update(op.resourceId, op.data);
        break;
      case 'delete':
        if (!op.resourceId) throw new Error('Resource ID required for delete');
        await enhancedApi.dashboardLayouts.templates.delete(op.resourceId);
        break;
      default:
        throw new Error(`Unsupported template operation: ${op.type}`);
    }
  }

  /**
   * Get queue status
   */
  getQueueStatus(): {
    total: number;
    pending: number;
    syncing: number;
    failed: number;
    completed: number;
  } {
    return {
      total: this.queue.length,
      pending: this.queue.filter(op => op.status === 'pending').length,
      syncing: this.queue.filter(op => op.status === 'syncing').length,
      failed: this.queue.filter(op => op.status === 'failed').length,
      completed: this.queue.filter(op => op.status === 'completed').length
    };
  }

  /**
   * Get all queued operations
   */
  getQueue(): QueuedOperation[] {
    return [...this.queue];
  }

  /**
   * Clear completed operations
   */
  clearCompleted(): void {
    this.queue = this.queue.filter(op => op.status !== 'completed');
    this.saveQueue();
  }

  /**
   * Retry failed operations
   */
  retryFailed(): void {
    this.queue.forEach(op => {
      if (op.status === 'failed' && op.retries < MAX_RETRIES) {
        op.status = 'pending';
        delete op.error;
      }
    });
    this.saveQueue();
    this.syncQueue();
  }

  /**
   * Remove operation from queue
   */
  removeOperation(id: string): void {
    this.queue = this.queue.filter(op => op.id !== id);
    this.saveQueue();
  }

  /**
   * Subscribe to queue changes
   */
  subscribe(listener: (queue: QueuedOperation[]) => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  /**
   * Notify listeners of queue changes
   */
  private notifyListeners(): void {
    this.listeners.forEach(listener => {
      try {
        listener([...this.queue]);
      } catch (error) {
        logger.error('Error in queue listener', { error }, 'offline-queue');
      }
    });
  }

  /**
   * Check if online
   */
  isOnlineNow(): boolean {
    return this.isOnline;
  }
}

// Singleton instance
export const offlineQueueService = new OfflineQueueService();

