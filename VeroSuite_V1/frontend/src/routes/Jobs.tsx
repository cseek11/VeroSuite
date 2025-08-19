import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { jobsApi, presignUpload } from '@/lib/api';
import { useRef, useState } from 'react';

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

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Today's Jobs</h1>
      <div className="mb-4 flex gap-2 items-center">
        <input className="border rounded p-2" placeholder="Technician ID (optional)" value={searchTechId || ''} onChange={(e) => setSearchTechId(e.target.value || undefined)} />
        <button onClick={() => qc.invalidateQueries({ queryKey: ['jobs', 'today'] })} className="bg-blue-600 text-white px-3 py-2 rounded">Refresh</button>
        <label className="ml-auto text-sm">Photo Upload: <input type="file" accept="image/*" onChange={(e) => e.target.files && handleUpload(e.target.files[0])} disabled={uploading} /></label>
      </div>

      {isLoading && <div>Loading jobs...</div>}
      {isError && <div className="text-red-600">{(error as any)?.message || 'Failed to load jobs'}</div>}
      {!isLoading && Array.isArray(data) && (
        <div className="space-y-3">
          {data.map((job: any) => (
            <div key={job.id} className="bg-white shadow rounded p-4">
              <div className="flex justify-between">
                <div>
                  <div className="font-medium">{job.customer.name} • {job.location.name}</div>
                  <div className="text-sm text-gray-600">{job.scheduled_date?.slice(0,10)} {job.time_window?.start}-{job.time_window?.end}</div>
                  <div className="text-sm text-gray-600">Status: {job.status} • Priority: {job.priority}</div>
                </div>
                <div className="flex gap-2">
                  {job.status === 'unassigned' && (
                    <button onClick={() => assignMutation.mutate({ job_id: job.id, technician_id: 'tech1', scheduled_date: job.scheduled_date?.slice(0,10) || new Date().toISOString().slice(0,10), time_window_start: '09:00:00', time_window_end: '11:00:00' })} className="px-3 py-1 bg-green-600 text-white rounded">Assign</button>
                  )}
                  {job.status !== 'completed' && (
                    <button onClick={() => startMutation.mutate({ id: job.id, gps: { lat: 40.44, lng: -79.99 } })} className="px-3 py-1 bg-orange-600 text-white rounded">Start</button>
                  )}
                  {job.status === 'in_progress' && (
                    <button onClick={() => completeMutation.mutate({ id: job.id, payload: { notes: 'Completed', photos: uploadedUrlRef.current ? [uploadedUrlRef.current] : [], chemicals_used: [] } })} className="px-3 py-1 bg-blue-600 text-white rounded">Complete</button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
