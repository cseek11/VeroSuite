import React, { useState } from 'react';
import { presignUpload } from '@/lib/api';

import { LoadingSpinner } from '@/components/LoadingSpinner';
import {
  Typography,
  Button,
  Card,
  Alert
} from '@/components/ui/EnhancedUI';
import {
  Upload,
  Image,
  FileText,
  Trash2,
  Download,
  Copy
} from 'lucide-react';

export default function Uploads() {
  const [files, setFiles] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  async function onSelect(file: File) {
    setUploading(true);
    setUploadError(null);
    try {
      const presign = await presignUpload(file.name, file.type);
      await fetch(presign.uploadUrl, { method: presign.method, headers: presign.headers, body: file });
      setFiles((prev) => [presign.fileUrl, ...prev]);
    } catch (error) {
      setUploadError('Upload failed. Please try again.');
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      onSelect(selectedFile);
    }
  };

  const handleRemoveFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <Typography variant="h1" className="text-gray-900">
          File Uploads
        </Typography>
        <Typography variant="body1" className="text-gray-600 mt-2">
          Upload and manage images and documents for your pest control operations.
        </Typography>
      </div>

      {/* Upload Section */}
      <Card className="p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Upload className="h-5 w-5 text-blue-500" />
          <Typography variant="h6" className="text-gray-900">
            Upload Files
          </Typography>
        </div>
        
        <div className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <Typography variant="body1" className="text-gray-600 mb-2">
              Drag and drop files here, or click to select
            </Typography>
            <input
              type="file"
              accept="image/*"
              disabled={uploading}
              onChange={handleFileSelect}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer disabled:opacity-50"
            >
              {uploading ? 'Uploading...' : 'Select File'}
            </label>
          </div>
          
          {uploading && (
            <div className="flex items-center justify-center py-4">
              <LoadingSpinner text="Uploading file..." />
            </div>
          )}
          
          {uploadError && (
            <Alert type="danger">
              <Typography variant="body2">
                {uploadError}
              </Typography>
            </Alert>
          )}
        </div>
      </Card>

      {/* Files Grid */}
      {files.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Image className="h-5 w-5 text-green-500" />
            <Typography variant="h6" className="text-gray-900">
              Uploaded Files ({files.length})
            </Typography>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {files.map((url, index) => (
              <Card key={url} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative">
                  <img 
                    src={url} 
                    alt={`Uploaded file ${index + 1}`} 
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-2 right-2 flex gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCopyUrl(url)}
                      className="bg-white/90 hover:bg-white"
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRemoveFile(index)}
                      className="bg-white/90 hover:bg-white text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="h-4 w-4 text-gray-400" />
                    <Typography variant="body2" className="text-gray-600 truncate">
                      File {index + 1}
                    </Typography>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(url, '_blank')}
                      className="flex-1"
                    >
                      <Download className="h-3 w-3 mr-1" />
                      View
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {!uploading && files.length === 0 && (
        <Card className="p-8 text-center">
          <Image className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <Typography variant="h6" className="text-gray-900 mb-2">
            No Files Uploaded
          </Typography>
          <Typography variant="body2" className="text-gray-600">
            Upload your first file to get started.
          </Typography>
        </Card>
      )}
    </div>
  );
}
