import React, { useState, useRef } from 'react';
import { Upload, User, X } from 'lucide-react';
import { logger } from '@/utils/logger';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

interface AvatarUploadProps {
  userId: string;
  currentAvatarUrl?: string;
  onUploadComplete?: (avatarUrl: string) => void;
  size?: 'sm' | 'md' | 'lg';
}

export default function AvatarUpload({
  userId,
  currentAvatarUrl,
  onUploadComplete,
  size = 'md',
}: AvatarUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentAvatarUrl || null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sizeClasses = {
    sm: 'h-16 w-16',
    md: 'h-24 w-24',
    lg: 'h-32 w-32',
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5MB');
      return;
    }

    setError(null);
    setUploading(true);

    try {
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Get presigned URL
      const token = localStorage.getItem('verofield_auth')
        ? JSON.parse(localStorage.getItem('verofield_auth')!).token
        : localStorage.getItem('jwt');
      const tenantId = localStorage.getItem('tenantId') || '7193113e-ece2-4f7b-ae8c-176df4367e28';

      const presignResponse = await fetch(`${API_BASE_URL}/v1/uploads/presign`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'x-tenant-id': tenantId,
        },
        body: JSON.stringify({
          filename: `avatar-${userId}-${Date.now()}.${file.name.split('.').pop()}`,
          content_type: file.type,
          file_size: file.size,
        }),
      });

      if (!presignResponse.ok) {
        throw new Error('Failed to get upload URL');
      }

      const { upload_url, file_key } = await presignResponse.json();

      // Upload file (in production, this would use the presigned URL)
      // For now, we'll simulate the upload
      const avatarUrl = upload_url || `https://mock-bucket.local/${file_key}`;

      // TODO: Update user's avatar_url via API
      // For now, just call the callback
      if (onUploadComplete) {
        onUploadComplete(avatarUrl);
      }

      logger.debug('Avatar upload complete', { avatarUrl }, 'AvatarUpload');
    } catch (err) {
      logger.error('Avatar upload error', err, 'AvatarUpload');
      setError(err instanceof Error ? err.message : 'Upload failed');
      setPreview(currentAvatarUrl || null);
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    // TODO: Call API to remove avatar
    if (onUploadComplete) {
      onUploadComplete('');
    }
  };

  return (
    <div className="flex flex-col items-center space-y-3">
      <div className="relative">
        {preview ? (
          <div className={`${sizeClasses[size]} rounded-full overflow-hidden border-2 border-gray-200 relative`}>
            <img
              src={preview}
              alt="Avatar"
              className="w-full h-full object-cover"
            />
            {uploading && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
              </div>
            )}
          </div>
        ) : (
          <div className={`${sizeClasses[size]} rounded-full bg-gray-200 border-2 border-gray-300 flex items-center justify-center`}>
            <User className={`${size === 'lg' ? 'h-16 w-16' : size === 'md' ? 'h-12 w-12' : 'h-8 w-8'} text-gray-400`} />
          </div>
        )}
      </div>

      <div className="flex space-x-2">
        <label className="cursor-pointer">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            disabled={uploading}
            className="hidden"
          />
          <span className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed">
            <Upload className="h-4 w-4 mr-2" />
            {uploading ? 'Uploading...' : 'Upload'}
          </span>
        </label>
        {preview && (
          <button
            onClick={handleRemove}
            disabled={uploading}
            className="inline-flex items-center px-3 py-2 border border-red-300 shadow-sm text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
          >
            <X className="h-4 w-4 mr-2" />
            Remove
          </button>
        )}
      </div>

      {error && (
        <div className="text-sm text-red-600 text-center max-w-xs">
          {error}
        </div>
      )}

      <p className="text-xs text-gray-500 text-center max-w-xs">
        JPG, PNG or GIF. Max size 5MB
      </p>
    </div>
  );
}





