import { useEffect, useState } from 'react';
import { logger } from '@/utils/logger';
import { toast } from '@/utils/toast';
import type { Job } from '@/types/jobs';

interface User {
  id: string;
  email?: string;
  name?: string;
}

// TODO: Implement jobs API in enhanced API
// For now, using placeholder functions
const jobsApi = {
  today: async (technicianId?: string): Promise<Job[]> => {
    logger.warn('TODO: Implement jobs API in enhanced API', { technicianId }, 'TechnicianMobile');
    return [];
  }
};

export function TechnicianMobile() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    try {
      const userData = localStorage.getItem('user');
      if (userData) {
        setUser(JSON.parse(userData) as User);
      }
    } catch (error) {
      logger.error('Failed to parse user from localStorage', error, 'TechnicianMobile');
    }
  }, []);

  useEffect(() => {
    if (!user?.id) return;
    const userId = user.id;

    async function fetchJobs() {
      setLoading(true);
      try {
        const jobsData = await jobsApi.today(userId);
        // Filter jobs assigned to this technician
        setJobs((jobsData || []).filter((job) => job.technician_id === userId));
      } catch (err) {
        logger.error('Failed to fetch jobs', err, 'TechnicianMobile');
        toast.error('Failed to load jobs');
      } finally {
        setLoading(false);
      }
    }
    fetchJobs();
  }, [user?.id]);

  // Placeholder handlers for job actions
  function handleStartJob(jobId: string) {
    // TODO: Call backend to start job
    toast.info(`Starting job ${jobId}`);
  }
  function handleCompleteJob(jobId: string) {
    // TODO: Call backend to complete job
    toast.success(`Completing job ${jobId}`);
  }
  function handlePhotoUpload(jobId: string, files: FileList | null) {
    // TODO: Upload photos to backend
    if (files && files.length > 0) {
      toast.success(`Uploading ${files.length} photo(s) for job ${jobId}`);
    } else {
      toast.warning('Please select photos to upload');
    }
  }
  function handleChemicalLog(jobId: string) {
    // TODO: Log chemicals used
    toast.info(`Logging chemicals for job ${jobId}`);
  }

  if (!user) {
    return (
      <div className="p-6 bg-slate-50 min-h-screen">
        <div className="text-center text-slate-600">Loading user data...</div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-4 text-emerald-700">Technician Mobile</h1>
      {loading ? <div>Loading...</div> : (
        <div className="space-y-6">
          {jobs.length === 0 ? <div>No assigned jobs.</div> : jobs.map((job) => (
            <div key={job.id} className="bg-white rounded shadow p-4 border-l-4 border-emerald-400">
              <div className="font-bold text-emerald-700">{job.status}</div>
              <div className="text-sm text-slate-600">{job.scheduled_date} | {job.work_order?.account?.name || 'N/A'}</div>
              <div className="mt-2 flex gap-2">
                <button className="px-2 py-1 bg-blue-500 text-white rounded" onClick={() => handleStartJob(job.id)}>Start</button>
                <button className="px-2 py-1 bg-green-500 text-white rounded" onClick={() => handleCompleteJob(job.id)}>Complete</button>
              </div>
              <div className="mt-2">
                <label className="block text-xs">Upload Photos:
                  <input type="file" multiple onChange={e => handlePhotoUpload(job.id, e.target.files)} />
                </label>
              </div>
              <div className="mt-2">
                <button className="px-2 py-1 bg-yellow-500 text-white rounded" onClick={() => handleChemicalLog(job.id)}>Log Chemicals</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
