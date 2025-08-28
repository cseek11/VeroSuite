import React, { useRef, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { jobsApi, presignUpload } from '@/lib/api';

import { LoadingSpinner } from '@/components/LoadingSpinner';

import {
  Calendar,
  RefreshCw,
  Upload,
  User,
  MapPin,
  Clock,
  CheckCircle,
  AlertCircle,
  Play,
  Square
} from 'lucide-react';

export default function Jobs() {
  const qc = useQueryClient();
  const [searchTechId, setSearchTechId] = useState<string | undefined>(undefined);
  const [uploading, setUploading] = useState(false);
  const uploadedUrlRef = useRef<string | null>(null);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['jobs', 'today', searchTechId],
    queryFn: () => jobsApi.today(searchTechId),
  });

  const assignMutation = useMutation({
    mutationFn: jobsApi.assign,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['jobs', 'today'] }),
  });

  const startMutation = useMutation({
    mutationFn: ({ id, gps }: { id: string; gps: { lat: number; lng: number } }) => jobsApi.start(id, gps),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['jobs', 'today'] }),
  });

  const completeMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: any }) => jobsApi.complete(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['jobs', 'today'] }),
  });

  async function handleUpload(file: File) {
    setUploading(true);
    try {
      const presign = await presignUpload(file.name, file.type);
      await fetch(presign.uploadUrl, { method: presign.method, headers: presign.headers, body: file });
      uploadedUrlRef.current = presign.fileUrl;
      alert('Upload complete');
    } catch (e: any) {
      alert('Upload failed');
    } finally {
      setUploading(false);
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'in_progress':
        return <Play className="h-5 w-5 text-blue-500" />;
      case 'unassigned':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      default:
        return <Square className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'unassigned':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-3">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-xl rounded-xl shadow-xl border border-white/20 p-4 mb-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-1">
              Today's Jobs
            </h1>
            <p className="text-slate-600 text-sm">
              Manage and track today's scheduled pest control jobs.
            </p>
          </div>
        </div>
      </div>

        {/* Controls */}
        <div className="bg-white/80 backdrop-blur-xl rounded-xl shadow-xl border border-white/20 p-4 mb-4">
          <div className="flex flex-col md:flex-row gap-3 items-start md:items-center">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-indigo-600" />
              <input
                type="text"
                value={searchTechId || ''}
                onChange={(e) => setSearchTechId(e.target.value || undefined)}
                placeholder="Filter by Technician ID"
                className="px-3 py-2 border border-slate-200 rounded-lg bg-white/80 backdrop-blur-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-sm"
              />
            </div>
            <button
              onClick={() => qc.invalidateQueries({ queryKey: ['jobs', 'today'] })}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-3 py-2 rounded-lg hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200 text-sm flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </button>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center py-8">
            <LoadingSpinner text="Loading jobs..." />
          </div>
        )}

        {/* Error State */}
        {isError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
            <p className="text-sm text-red-800">
              {(error as any)?.message || 'Failed to load jobs'}
            </p>
          </div>
        )}

        {/* Jobs List */}
        {!isLoading && Array.isArray(data) && (
          <div className="space-y-3">
            {data.length === 0 ? (
              <div className="bg-white/80 backdrop-blur-xl rounded-xl shadow-xl border border-white/20 p-6 text-center">
                <Calendar className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  No Jobs Scheduled
                </h3>
                <p className="text-sm text-slate-600">
                  There are no jobs scheduled for today.
                </p>
              </div>
            ) : (
              data.map((job: any) => (
                <div key={job.id} className="p-4 hover:shadow-lg transition-shadow border border-slate-200 rounded-lg bg-white/80 backdrop-blur-sm">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        {getStatusIcon(job.status)}
                        <h3 className="text-sm font-semibold text-slate-900">
                          {job.customer?.name || 'Unknown Customer'}
                        </h3>
                        <span className={`px-1.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(job.status)}`}>
                          {job.status.replace('_', ' ')}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-slate-600">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-3 w-3" />
                          <span>{job.location?.name || 'Unknown Location'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-3 w-3" />
                          <span>{job.scheduled_date?.slice(0,10)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-3 w-3" />
                          <span>{job.time_window?.start}-{job.time_window?.end}</span>
                        </div>
                      </div>
                      
                      <div className="mt-2 text-xs text-slate-500">
                        Priority: {job.priority || 'Normal'}
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2">
                      {job.status === 'unassigned' && (
                        <button
                          onClick={() => assignMutation.mutate({ 
                            job_id: job.id, 
                            technician_id: 'tech1', 
                            scheduled_date: job.scheduled_date?.slice(0,10) || new Date().toISOString().slice(0,10), 
                            time_window_start: '09:00:00', 
                            time_window_end: '11:00:00' 
                          })}
                          disabled={assignMutation.isPending}
                          className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-3 py-1.5 rounded-lg hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200 text-xs"
                        >
                          {assignMutation.isPending ? 'Assigning...' : 'Assign'}
                        </button>
                      )}
                      {job.status !== 'completed' && (
                        <button
                          onClick={() => startMutation.mutate({ 
                            id: job.id, 
                            gps: { lat: 40.44, lng: -79.99 } 
                          })}
                          disabled={startMutation.isPending}
                          className="bg-white/80 backdrop-blur-sm border border-slate-200 text-slate-700 px-3 py-1.5 rounded-lg hover:bg-white hover:shadow-lg transition-all duration-200 text-xs"
                        >
                          {startMutation.isPending ? 'Starting...' : 'Start'}
                        </button>
                      )}
                      {job.status === 'in_progress' && (
                        <button
                          onClick={() => completeMutation.mutate({ 
                            id: job.id, 
                            payload: { 
                              notes: 'Completed', 
                              photos: uploadedUrlRef.current ? [uploadedUrlRef.current] : [], 
                              chemicals_used: [] 
                            } 
                          })}
                          disabled={completeMutation.isPending}
                          className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-3 py-1.5 rounded-lg hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200 text-xs"
                        >
                          {completeMutation.isPending ? 'Completing...' : 'Complete'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
    </div>
  );
}
