// ============================================================================
// VeroField Mobile App - Location Service
// ============================================================================

import Geolocation from '@react-native-community/geolocation';
import BackgroundTimer from 'react-native-background-timer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS, API_CONFIG } from '../constants';
import { AppError } from '../types';
import authService from './authService';

export interface LocationData {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: string;
  jobId?: string;
}

export interface LocationTrackingOptions {
  enableHighAccuracy: boolean;
  timeout: number;
  maximumAge: number;
  distanceFilter: number;
}

class LocationService {
  private isTracking: boolean = false;
  private trackingTimer: any = null;
  private currentJobId: string | null = null;
  private locationHistory: LocationData[] = [];

  constructor() {
    // Configure geolocation
    Geolocation.setRNConfiguration({
      skipPermissionRequests: false,
      authorizationLevel: 'whenInUse',
      enableBackgroundLocationUpdates: false,
      locationProvider: 'auto',
    });
  }

  /**
   * Get current location
   */
  async getCurrentLocation(): Promise<LocationData> {
    return new Promise((resolve, reject) => {
      Geolocation.getCurrentPosition(
        (position) => {
          const locationData: LocationData = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: new Date().toISOString(),
            jobId: this.currentJobId || undefined,
          };
          resolve(locationData);
        },
        (error) => {
          console.error('Location error:', error);
          reject(this.handleError(error));
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 10000,
        }
      );
    });
  }

  /**
   * Start location tracking for a job
   */
  async startTracking(jobId: string, options?: Partial<LocationTrackingOptions>): Promise<void> {
    try {
      if (this.isTracking) {
        await this.stopTracking();
      }

      this.currentJobId = jobId;
      this.isTracking = true;
      this.locationHistory = [];

      const trackingOptions: LocationTrackingOptions = {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 30000,
        distanceFilter: 10, // meters
        ...options,
      };

      console.log(`Starting location tracking for job: ${jobId}`);

      // Initial location
      const initialLocation = await this.getCurrentLocation();
      await this.recordLocation(initialLocation);

      // Start periodic tracking
      this.trackingTimer = BackgroundTimer.setInterval(async () => {
        try {
          const location = await this.getCurrentLocation();
          await this.recordLocation(location);
        } catch (error) {
          console.error('Error during periodic location tracking:', error);
        }
      }, 60000); // Track every minute

    } catch (error) {
      console.error('Error starting location tracking:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Stop location tracking
   */
  async stopTracking(): Promise<void> {
    try {
      if (this.trackingTimer) {
        BackgroundTimer.clearInterval(this.trackingTimer);
        this.trackingTimer = null;
      }

      if (this.isTracking && this.currentJobId) {
        // Record final location
        try {
          const finalLocation = await this.getCurrentLocation();
          await this.recordLocation(finalLocation);
        } catch (error) {
          console.error('Error recording final location:', error);
        }

        // Upload tracking data
        await this.uploadTrackingData(this.currentJobId, this.locationHistory);
      }

      this.isTracking = false;
      this.currentJobId = null;
      this.locationHistory = [];

      console.log('Location tracking stopped');
    } catch (error) {
      console.error('Error stopping location tracking:', error);
    }
  }

  /**
   * Record location data
   */
  private async recordLocation(location: LocationData): Promise<void> {
    try {
      this.locationHistory.push(location);

      // Keep only last 100 locations to manage memory
      if (this.locationHistory.length > 100) {
        this.locationHistory = this.locationHistory.slice(-100);
      }

      // Store in local storage for persistence
      await AsyncStorage.setItem(
        `${STORAGE_KEYS.OFFLINE_DATA}:location_${this.currentJobId}`,
        JSON.stringify(this.locationHistory)
      );

      console.log(`Location recorded: ${location.latitude}, ${location.longitude}`);
    } catch (error) {
      console.error('Error recording location:', error);
    }
  }

  /**
   * Upload tracking data to server
   */
  private async uploadTrackingData(jobId: string, locations: LocationData[]): Promise<void> {
    try {
      if (locations.length === 0) return;

      const headers = await authService.getAuthHeaders();
      
      const response = await fetch(`${API_CONFIG.BASE_URL}/jobs/${jobId}/tracking`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          locations,
          total_distance: this.calculateTotalDistance(locations),
          duration: this.calculateDuration(locations),
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to upload tracking data: ${response.statusText}`);
      }

      // Clear stored location data after successful upload
      await AsyncStorage.removeItem(`${STORAGE_KEYS.OFFLINE_DATA}:location_${jobId}`);
      
      console.log(`Uploaded ${locations.length} location points for job ${jobId}`);
    } catch (error) {
      console.error('Error uploading tracking data:', error);
      // Don't throw error - tracking data will be retried later
    }
  }

  /**
   * Calculate total distance traveled
   */
  private calculateTotalDistance(locations: LocationData[]): number {
    if (locations.length < 2) return 0;

    let totalDistance = 0;
    for (let i = 1; i < locations.length; i++) {
      const distance = this.calculateDistance(
        locations[i - 1].latitude,
        locations[i - 1].longitude,
        locations[i].latitude,
        locations[i].longitude
      );
      totalDistance += distance;
    }

    return totalDistance;
  }

  /**
   * Calculate duration of tracking
   */
  private calculateDuration(locations: LocationData[]): number {
    if (locations.length < 2) return 0;

    const start = new Date(locations[0].timestamp).getTime();
    const end = new Date(locations[locations.length - 1].timestamp).getTime();
    
    return Math.round((end - start) / 1000); // Duration in seconds
  }

  /**
   * Calculate distance between two coordinates (Haversine formula)
   */
  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in meters
  }

  /**
   * Get stored location history for a job
   */
  async getJobLocationHistory(jobId: string): Promise<LocationData[]> {
    try {
      const data = await AsyncStorage.getItem(`${STORAGE_KEYS.OFFLINE_DATA}:location_${jobId}`);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting location history:', error);
      return [];
    }
  }

  /**
   * Check if location permissions are granted
   */
  async checkLocationPermission(): Promise<boolean> {
    return new Promise((resolve) => {
      Geolocation.getCurrentPosition(
        () => resolve(true),
        () => resolve(false),
        { timeout: 5000 }
      );
    });
  }

  /**
   * Request location permissions
   */
  async requestLocationPermission(): Promise<boolean> {
    try {
      // This will trigger the permission dialog
      await this.getCurrentLocation();
      return true;
    } catch (error) {
      console.error('Location permission denied:', error);
      return false;
    }
  }

  /**
   * Get tracking status
   */
  getTrackingStatus(): {
    isTracking: boolean;
    currentJobId: string | null;
    locationCount: number;
  } {
    return {
      isTracking: this.isTracking,
      currentJobId: this.currentJobId,
      locationCount: this.locationHistory.length,
    };
  }

  /**
   * Handle location service errors
   */
  private handleError(error: any): AppError {
    let message = 'Location service error';
    let code = 'LOCATION_ERROR';

    if (error.code) {
      switch (error.code) {
        case 1:
          message = 'Location permission denied';
          code = 'PERMISSION_DENIED';
          break;
        case 2:
          message = 'Location unavailable';
          code = 'LOCATION_UNAVAILABLE';
          break;
        case 3:
          message = 'Location request timeout';
          code = 'LOCATION_TIMEOUT';
          break;
        default:
          message = error.message || message;
      }
    }

    return {
      code,
      message,
      details: error,
    };
  }
}

// Export singleton instance
export const locationService = new LocationService();
export default locationService;
