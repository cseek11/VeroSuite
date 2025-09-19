// ============================================================================
// VeroField Mobile App - File Upload Service
// ============================================================================

import { API_CONFIG, APP_CONFIG } from '../constants';
import { AppError } from '../types';
import authService from './authService';

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

export interface UploadResult {
  id: string;
  url: string;
  fileName: string;
  fileSize: number;
  uploadedAt: string;
}

export interface PhotoUploadData {
  jobId: string;
  photoType: 'before' | 'after' | 'service' | 'damage';
  uri: string;
  fileName: string;
  fileSize?: number;
}

export interface SignatureUploadData {
  jobId: string;
  signatureType: 'customer' | 'technician';
  signatureData: string; // Base64 encoded signature
}

class UploadService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_CONFIG.BASE_URL;
  }

  /**
   * Upload photo with progress tracking
   */
  async uploadPhoto(
    photoData: PhotoUploadData,
    onProgress?: (progress: UploadProgress) => void
  ): Promise<UploadResult> {
    try {
      // Validate file size
      if (photoData.fileSize && photoData.fileSize > APP_CONFIG.MAX_PHOTO_SIZE) {
        throw new Error(`File size exceeds maximum limit of ${APP_CONFIG.MAX_PHOTO_SIZE / (1024 * 1024)}MB`);
      }

      const headers = await authService.getAuthHeaders();
      
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('file', {
        uri: photoData.uri,
        type: 'image/jpeg',
        name: photoData.fileName,
      } as any);
      formData.append('jobId', photoData.jobId);
      formData.append('photoType', photoData.photoType);
      formData.append('timestamp', new Date().toISOString());

      // Remove Content-Type header to let fetch set it automatically for FormData
      const uploadHeaders = { ...headers };
      delete uploadHeaders['Content-Type'];

      const response = await fetch(`${this.baseUrl}/uploads/photos`, {
        method: 'POST',
        headers: uploadHeaders,
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Upload failed: ${response.statusText}`);
      }

      const result = await response.json();
      
      return {
        id: result.id,
        url: result.url,
        fileName: photoData.fileName,
        fileSize: photoData.fileSize || 0,
        uploadedAt: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Photo upload error:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Upload signature
   */
  async uploadSignature(signatureData: SignatureUploadData): Promise<UploadResult> {
    try {
      const headers = await authService.getAuthHeaders();
      
      const response = await fetch(`${this.baseUrl}/uploads/signatures`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          jobId: signatureData.jobId,
          signatureType: signatureData.signatureType,
          signatureData: signatureData.signatureData,
          timestamp: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Signature upload failed: ${response.statusText}`);
      }

      const result = await response.json();
      
      return {
        id: result.id,
        url: result.url,
        fileName: `signature_${signatureData.signatureType}_${Date.now()}.png`,
        fileSize: 0, // Signatures are typically small
        uploadedAt: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Signature upload error:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Upload multiple photos with batch processing
   */
  async uploadPhotoBatch(
    photos: PhotoUploadData[],
    onProgress?: (completed: number, total: number) => void
  ): Promise<UploadResult[]> {
    const results: UploadResult[] = [];
    const total = photos.length;

    for (let i = 0; i < photos.length; i++) {
      try {
        const result = await this.uploadPhoto(photos[i]);
        results.push(result);
        
        if (onProgress) {
          onProgress(i + 1, total);
        }
      } catch (error) {
        console.error(`Failed to upload photo ${i + 1}:`, error);
        // Continue with other uploads even if one fails
        if (onProgress) {
          onProgress(i + 1, total);
        }
      }
    }

    return results;
  }

  /**
   * Get upload progress for a file
   */
  async getUploadStatus(uploadId: string): Promise<{
    status: 'pending' | 'uploading' | 'completed' | 'failed';
    progress: number;
    error?: string;
  }> {
    try {
      const headers = await authService.getAuthHeaders();
      
      const response = await fetch(`${this.baseUrl}/uploads/${uploadId}/status`, {
        method: 'GET',
        headers,
      });

      if (!response.ok) {
        throw new Error(`Failed to get upload status: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting upload status:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Delete uploaded file
   */
  async deleteUpload(uploadId: string): Promise<void> {
    try {
      const headers = await authService.getAuthHeaders();
      
      const response = await fetch(`${this.baseUrl}/uploads/${uploadId}`, {
        method: 'DELETE',
        headers,
      });

      if (!response.ok) {
        throw new Error(`Failed to delete upload: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error deleting upload:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Compress image before upload
   */
  private async compressImage(uri: string, quality: number = 0.8): Promise<string> {
    // TODO: Implement image compression
    // This would use a library like react-native-image-resizer
    return uri;
  }

  /**
   * Handle upload errors
   */
  private handleError(error: any): AppError {
    if (error instanceof Error) {
      return {
        code: 'UPLOAD_ERROR',
        message: error.message,
        details: error,
      };
    }

    return {
      code: 'UNKNOWN_ERROR',
      message: 'An unexpected error occurred during upload',
      details: error,
    };
  }
}

// Export singleton instance
export const uploadService = new UploadService();
export default uploadService;
