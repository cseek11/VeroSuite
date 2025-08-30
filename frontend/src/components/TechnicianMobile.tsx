import React, { useEffect, useState } from 'react';
import { enhancedApi } from '@/lib/enhanced-api';

// TODO: Implement jobs API in enhanced API
// For now, using placeholder functions
const jobsApi = {
  today: async (technicianId?: string) => {
    console.log('TODO: Implement jobs API in enhanced API');
    return [];
  }
};

export function TechnicianMobile() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    async function fetchJobs() {
      setLoading(true);
      try {
        const jobsData = await jobsApi.today(user.id);
        // Filter jobs assigned to this technician
        setJobs((jobsData || []).filter((job: any) => job.technician_id === user.id));
      } catch (err) {
        // handle error
      }
      setLoading(false);
    }
    fetchJobs();
  }, [user.id]);

  // Placeholder handlers for job actions
  function handleStartJob(jobId: string) {
    // TODO: Call backend to start job
    alert(`Start job ${  jobId}`);
  }
  function handleCompleteJob(jobId: string) {
    // TODO: Call backend to complete job
    alert(`Complete job ${  jobId}`);
  }
  function handlePhotoUpload(jobId: string, files: FileList | null) {
    // TODO: Upload photos to backend
    alert(`Upload photos for job ${  jobId}`);
  }
  function handleChemicalLog(jobId: string) {
    // TODO: Log chemicals used
    alert(`Log chemicals for job ${  jobId}`);
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-4 text-green-700">Technician Mobile</h1>
      {loading ? <div>Loading...</div> : (
        <div className="space-y-6">
          {jobs.length === 0 ? <div>No assigned jobs.</div> : jobs.map((job) => (
            <div key={job.id} className="bg-white rounded shadow p-4 border-l-4 border-green-400">
              <div className="font-bold text-green-700">{job.status}</div>
              <div className="text-sm text-gray-600">{job.scheduled_date} | {job.location?.name}</div>
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
