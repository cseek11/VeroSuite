// ============================================================================
// VeroField Mobile App - Offline Storage Service
// ============================================================================

import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS, APP_CONFIG } from '../constants';
import { Job, OfflineJob, OfflineData, AppError } from '../types';
import jobsService from './jobsService';
import uploadService, { PhotoUploadData, SignatureUploadData } from './uploadService';

class OfflineService {
  private syncTimer: NodeJS.Timeout | null = null;

  /**
   * Initialize offline service and start sync timer
   */
  async initialize(): Promise<void> {
    try {
      await this.cleanupOldData();
      this.startSyncTimer();
      console.log('Offline service initialized');
    } catch (error) {
      console.error('Failed to initialize offline service:', error);
    }
  }

  /**
   * Store job data for offline access
   */
  async storeJobOffline(job: Job): Promise<void> {
    try {
      const offlineData = await this.getOfflineData();
      
      const offlineJob: OfflineJob = {
        job,
        status: 'synced',
        last_modified: new Date().toISOString(),
        sync_attempts: 0,
      };

      // Update or add job
      const existingIndex = offlineData.jobs.findIndex(j => j.job.id === job.id);
      if (existingIndex >= 0) {
        offlineData.jobs[existingIndex] = offlineJob;
      } else {
        offlineData.jobs.push(offlineJob);
      }

      await this.saveOfflineData(offlineData);
    } catch (error) {
      console.error('Error storing job offline:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Get offline jobs
   */
  async getOfflineJobs(): Promise<Job[]> {
    try {
      const offlineData = await this.getOfflineData();
      return offlineData.jobs.map(offlineJob => offlineJob.job);
    } catch (error) {
      console.error('Error getting offline jobs:', error);
      return [];
    }
  }

  /**
   * Store pending upload for later sync
   */
  async storePendingUpload(type: 'photo' | 'signature', data: PhotoUploadData | SignatureUploadData): Promise<void> {
    try {
      const pendingUploads = await this.getPendingUploads();
      
      const uploadItem = {
        id: `${type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        type,
        data,
        timestamp: new Date().toISOString(),
        attempts: 0,
      };

      pendingUploads.push(uploadItem);
      await AsyncStorage.setItem(STORAGE_KEYS.PENDING_UPLOADS, JSON.stringify(pendingUploads));
    } catch (error) {
      console.error('Error storing pending upload:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Get pending uploads
   */
  async getPendingUploads(): Promise<any[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.PENDING_UPLOADS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting pending uploads:', error);
      return [];
    }
  }

  /**
   * Sync pending uploads when online
   */
  async syncPendingUploads(): Promise<void> {
    try {
      const pendingUploads = await this.getPendingUploads();
      if (pendingUploads.length === 0) return;

      console.log(`Syncing ${pendingUploads.length} pending uploads...`);

      const successfulUploads: string[] = [];

      for (const upload of pendingUploads) {
        try {
          if (upload.type === 'photo') {
            await uploadService.uploadPhoto(upload.data);
          } else if (upload.type === 'signature') {
            await uploadService.uploadSignature(upload.data);
          }

          successfulUploads.push(upload.id);
          console.log(`Successfully synced upload: ${upload.id}`);
        } catch (error) {
          upload.attempts = (upload.attempts || 0) + 1;
          console.error(`Failed to sync upload ${upload.id} (attempt ${upload.attempts}):`, error);
          
          // Remove uploads that have failed too many times
          if (upload.attempts >= 3) {
            successfulUploads.push(upload.id);
            console.log(`Removing failed upload after 3 attempts: ${upload.id}`);
          }
        }
      }

      // Remove successfully synced uploads
      if (successfulUploads.length > 0) {
        const remainingUploads = pendingUploads.filter(
          upload => !successfulUploads.includes(upload.id)
        );
        await AsyncStorage.setItem(STORAGE_KEYS.PENDING_UPLOADS, JSON.stringify(remainingUploads));
      }
    } catch (error) {
      console.error('Error syncing pending uploads:', error);
    }
  }

  /**
   * Check if device is online
   */
  async isOnline(): Promise<boolean> {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/health`, {
        method: 'GET',
        timeout: 5000,
      });
      return response.ok;
    } catch (error) {
      return false;
    }
  }

  /**
   * Start automatic sync timer
   */
  private startSyncTimer(): void {
    if (this.syncTimer) {
      clearInterval(this.syncTimer);
    }

    this.syncTimer = setInterval(async () => {
      const isOnline = await this.isOnline();
      if (isOnline) {
        await this.syncPendingUploads();
        await this.syncOfflineJobs();
      }
    }, APP_CONFIG.SYNC_INTERVAL);
  }

  /**
   * Stop sync timer
   */
  stopSyncTimer(): void {
    if (this.syncTimer) {
      clearInterval(this.syncTimer);
      this.syncTimer = null;
    }
  }

  /**
   * Sync offline job data with server
   */
  async syncOfflineJobs(): Promise<void> {
    try {
      const offlineData = await this.getOfflineData();
      const pendingJobs = offlineData.jobs.filter(job => job.status === 'pending');

      for (const offlineJob of pendingJobs) {
        try {
          // Sync job status updates
          if (offlineJob.job.status === 'in_progress' || offlineJob.job.status === 'completed') {
            await jobsService.updateJobStatus(offlineJob.job.id, offlineJob.job.status);
          }

          // Mark as synced
          offlineJob.status = 'synced';
          offlineJob.last_modified = new Date().toISOString();
        } catch (error) {
          offlineJob.sync_attempts += 1;
          console.error(`Failed to sync job ${offlineJob.job.id}:`, error);
        }
      }

      await this.saveOfflineData(offlineData);
    } catch (error) {
      console.error('Error syncing offline jobs:', error);
    }
  }

  /**
   * Get offline data structure
   */
  private async getOfflineData(): Promise<OfflineData> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.OFFLINE_DATA);
      if (data) {
        return JSON.parse(data);
      }
    } catch (error) {
      console.error('Error getting offline data:', error);
    }

    // Return default structure
    return {
      jobs: [],
      photos: [],
      signatures: [],
      last_sync: new Date().toISOString(),
    };
  }

  /**
   * Save offline data
   */
  private async saveOfflineData(data: OfflineData): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.OFFLINE_DATA, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving offline data:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Clean up old offline data
   */
  private async cleanupOldData(): Promise<void> {
    try {
      const offlineData = await this.getOfflineData();
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - 7); // Keep data for 7 days

      // Remove old synced jobs
      offlineData.jobs = offlineData.jobs.filter(job => {
        const lastModified = new Date(job.last_modified);
        return job.status !== 'synced' || lastModified > cutoffDate;
      });

      await this.saveOfflineData(offlineData);
    } catch (error) {
      console.error('Error cleaning up old data:', error);
    }
  }

  /**
   * Get sync status
   */
  async getSyncStatus(): Promise<{
    pendingUploads: number;
    pendingJobs: number;
    lastSync: string;
    isOnline: boolean;
  }> {
    try {
      const [pendingUploads, offlineData, isOnline] = await Promise.all([
        this.getPendingUploads(),
        this.getOfflineData(),
        this.isOnline(),
      ]);

      const pendingJobs = offlineData.jobs.filter(job => job.status === 'pending').length;

      return {
        pendingUploads: pendingUploads.length,
        pendingJobs,
        lastSync: offlineData.last_sync,
        isOnline,
      };
    } catch (error) {
      console.error('Error getting sync status:', error);
      return {
        pendingUploads: 0,
        pendingJobs: 0,
        lastSync: new Date().toISOString(),
        isOnline: false,
      };
    }
  }

  /**
   * Force sync all pending data
   */
  async forceSyncAll(): Promise<void> {
    try {
      const isOnline = await this.isOnline();
      if (!isOnline) {
        throw new Error('Device is offline. Cannot sync data.');
      }

      await Promise.all([
        this.syncPendingUploads(),
        this.syncOfflineJobs(),
      ]);

      // Update last sync time
      const offlineData = await this.getOfflineData();
      offlineData.last_sync = new Date().toISOString();
      await this.saveOfflineData(offlineData);

      console.log('Force sync completed successfully');
    } catch (error) {
      console.error('Error during force sync:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Clear all offline data
   */
  async clearOfflineData(): Promise<void> {
    try {
      await Promise.all([
        AsyncStorage.removeItem(STORAGE_KEYS.OFFLINE_DATA),
        AsyncStorage.removeItem(STORAGE_KEYS.PENDING_UPLOADS),
      ]);
      console.log('Offline data cleared');
    } catch (error) {
      console.error('Error clearing offline data:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Handle offline service errors
   */
  private handleError(error: any): AppError {
    if (error instanceof Error) {
      return {
        code: 'OFFLINE_ERROR',
        message: error.message,
        details: error,
      };
    }

    return {
      code: 'UNKNOWN_ERROR',
      message: 'An unexpected offline error occurred',
      details: error,
    };
  }
}

// Export singleton instance
export const offlineService = new OfflineService();
export default offlineService;
