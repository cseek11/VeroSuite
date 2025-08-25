import React, { useRef, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { jobsApi, presignUpload } from '@/lib/api';
import LayoutWrapper from '@/components/LayoutWrapper';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import {
  Typography,
  Button,
  Card,
  Input,
  Alert
} from '@/components/ui/EnhancedUI';
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
    <LayoutWrapper>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Typography variant="h1" className="text-gray-900">
            Today's Jobs
          </Typography>
          <Typography variant="body1" className="text-gray-600 mt-2">
            Manage and track today's scheduled pest control jobs.
          </Typography>
        </div>

        {/* Search and Controls */}
        <Card className="p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
            <div className="flex-1">
              <Input
                placeholder="Technician ID (optional)"
                value={searchTechId || ''}
                onChange={(value) => setSearchTechId(value || undefined)}
                className="w-full"
              />
            </div>
            <Button
              variant="outline"
              onClick={() => qc.invalidateQueries({ queryKey: ['jobs', 'today'] })}
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
            <div className="flex items-center gap-2">
              <Upload className="h-4 w-4 text-gray-500" />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => e.target.files && handleUpload(e.target.files[0])}
                disabled={uploading}
                className="text-sm"
              />
            </div>
          </div>
        </Card>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center py-8">
            <LoadingSpinner text="Loading jobs..." />
          </div>
        )}

        {/* Error State */}
        {isError && (
          <Alert type="danger" className="mb-6">
            <Typography variant="body2">
              {(error as any)?.message || 'Failed to load jobs'}
            </Typography>
          </Alert>
        )}

        {/* Jobs List */}
        {!isLoading && Array.isArray(data) && (
          <div className="space-y-4">
            {data.length === 0 ? (
              <Card className="p-8 text-center">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <Typography variant="h6" className="text-gray-900 mb-2">
                  No Jobs Scheduled
                </Typography>
                <Typography variant="body2" className="text-gray-600">
                  There are no jobs scheduled for today.
                </Typography>
              </Card>
            ) : (
              data.map((job: any) => (
                <Card key={job.id} className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        {getStatusIcon(job.status)}
                        <Typography variant="h6" className="text-gray-900">
                          {job.customer.name}
                        </Typography>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(job.status)}`}>
                          {job.status.replace('_', ' ')}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          <span>{job.location.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span>{job.scheduled_date?.slice(0,10)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <span>{job.time_window?.start}-{job.time_window?.end}</span>
                        </div>
                      </div>
                      
                      <div className="mt-2 text-sm text-gray-500">
                        Priority: {job.priority}
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2">
                      {job.status === 'unassigned' && (
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => assignMutation.mutate({ 
                            job_id: job.id, 
                            technician_id: 'tech1', 
                            scheduled_date: job.scheduled_date?.slice(0,10) || new Date().toISOString().slice(0,10), 
                            time_window_start: '09:00:00', 
                            time_window_end: '11:00:00' 
                          })}
                          disabled={assignMutation.isPending}
                        >
                          {assignMutation.isPending ? 'Assigning...' : 'Assign'}
                        </Button>
                      )}
                      {job.status !== 'completed' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => startMutation.mutate({ 
                            id: job.id, 
                            gps: { lat: 40.44, lng: -79.99 } 
                          })}
                          disabled={startMutation.isPending}
                        >
                          {startMutation.isPending ? 'Starting...' : 'Start'}
                        </Button>
                      )}
                      {job.status === 'in_progress' && (
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => completeMutation.mutate({ 
                            id: job.id, 
                            payload: { 
                              notes: 'Completed', 
                              photos: uploadedUrlRef.current ? [uploadedUrlRef.current] : [], 
                              chemicals_used: [] 
                            } 
                          })}
                          disabled={completeMutation.isPending}
                        >
                          {completeMutation.isPending ? 'Completing...' : 'Complete'}
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        )}
      </div>
    </LayoutWrapper>
  );
}
