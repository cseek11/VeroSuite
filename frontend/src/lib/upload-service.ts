// Upload service for presigned URLs
import { getAuthToken } from './api-utils';
import { logger } from '@/utils/logger';

export interface PresignUploadResponse {
  uploadUrl: string;
  fileUrl: string;
  method: string;
  headers: Record<string, string>;
}

export async function presignUpload(
  filename: string,
  contentType: string
): Promise<PresignUploadResponse> {
  try {
    const token = await getAuthToken();
    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';
    
    const response = await fetch(`${baseUrl}/v1/uploads/presign`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        filename,
        contentType,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
      throw new Error(`Failed to get presigned URL: ${errorData.message || response.statusText}`);
    }

    const data = await response.json();
    return {
      uploadUrl: data.upload_url || data.uploadUrl,
      fileUrl: data.file_url || data.fileUrl || data.upload_url || data.uploadUrl,
      method: data.method || 'PUT',
      headers: data.headers || {},
    };
  } catch (error) {
    logger.error('Error getting presigned upload URL', error, 'upload-service');
    throw error;
  }
}




