import React, { useState } from 'react';
import { presignUpload } from '@/lib/api';
import { LoadingSpinner } from '@/components/LoadingSpinner';
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-3">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-xl rounded-xl shadow-xl border border-white/20 p-4 mb-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-1">
                File Uploads
              </h1>
              <p className="text-slate-600 text-sm">
                Upload and manage images and documents for your pest control operations.
              </p>
            </div>
          </div>
        </div>

              {/* Upload Section */}
      <div className="bg-white/80 backdrop-blur-xl rounded-xl shadow-xl border border-white/20 p-4 mb-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-1 bg-indigo-100 rounded-md">
            <Upload className="h-4 w-4 text-indigo-600" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">
            Upload Files
          </h3>
        </div>
          
                  <div className="space-y-4">
          <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-indigo-400 transition-colors">
            <Upload className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <p className="text-sm text-slate-600 mb-2">
              Drag and drop files here, or click to select
            </p>
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
              className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer disabled:opacity-50 shadow-lg hover:shadow-xl transition-all duration-200"
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
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-800">
                  {uploadError}
                </p>
              </div>
            )}
          </div>
        </div>

              {/* Files Grid */}
      {files.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-1 bg-emerald-100 rounded-md">
              <Image className="h-4 w-4 text-emerald-600" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">
              Uploaded Files ({files.length})
            </h3>
          </div>
            
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {files.map((url, index) => (
              <div key={url} className="overflow-hidden hover:shadow-lg transition-shadow border border-slate-200 rounded-lg bg-white/80 backdrop-blur-sm">
                  <div className="relative">
                    <img 
                      src={url} 
                      alt={`Uploaded file ${index + 1}`} 
                      className="w-full h-48 object-cover"
                    />
                                      <div className="absolute top-2 right-2 flex gap-1">
                    <button
                      onClick={() => handleCopyUrl(url)}
                      className="bg-white/90 hover:bg-white border border-slate-200 text-slate-700 px-2 py-1 rounded hover:shadow-lg transition-all duration-200"
                    >
                      <Copy className="h-3 w-3" />
                    </button>
                    <button
                      onClick={() => handleRemoveFile(index)}
                      className="bg-white/90 hover:bg-white border border-slate-200 text-red-600 hover:text-red-700 px-2 py-1 rounded hover:shadow-lg transition-all duration-200"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                  </div>
                                  <div className="p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="h-4 w-4 text-slate-400" />
                    <p className="text-xs text-slate-600 truncate">
                      File {index + 1}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => window.open(url, '_blank')}
                      className="flex-1 bg-white/80 backdrop-blur-sm border border-slate-200 text-slate-700 px-2 py-1 rounded hover:bg-white hover:shadow-lg transition-all duration-200 text-xs flex items-center justify-center gap-1"
                    >
                      <Download className="h-3 w-3" />
                      View
                    </button>
                  </div>
                                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {!uploading && files.length === 0 && (
        <div className="bg-white/80 backdrop-blur-xl rounded-xl shadow-xl border border-white/20 p-8 text-center">
          <Image className="h-12 w-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-900 mb-2">
            No Files Uploaded
          </h3>
          <p className="text-sm text-slate-600">
            Upload your first file to get started.
          </p>
        </div>
      )}
    </div>
  );
}
