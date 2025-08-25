import React, { useEffect, useState } from 'react';
import { UserManagementForm } from './UserManagementForm';
import { jobsApi, crmApi, routingApi } from '../lib/api';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { KPI } from './KPI';
import { CheckCircle, Clock, Zap } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export default function DispatcherDashboard() {
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    async function fetchAuditLogs() {
      try {
        // Only fetch if user is admin
        if (user.roles && user.roles.includes('admin')) {
          const res = await fetch('/api/audit/logs', {
            headers: { Authorization: `Bearer ${localStorage.getItem('jwt')}` },
          });
          const logs = await res.json();
          setAuditLogs(logs || []);
        }
      } catch (err) {
        // handle error
      }
    }
    fetchAuditLogs();
  }, [user.roles]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [routes, setRoutes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [assignJobId, setAssignJobId] = useState<string>('');
  const [assignTechId, setAssignTechId] = useState<string>('');
  const [assignStatus, setAssignStatus] = useState<string>('');

  useEffect(() => {
    // Initialize with empty data - will be populated from API
    setJobs([]);
    setAccounts([]);
    setRoutes([]);
    setLoading(false);
  }, []);

  async function handleAssignJob(e: React.FormEvent) {
    e.preventDefault();
    // TODO: Call backend to assign job
    setAssignStatus('Assigning...');
    setTimeout(() => {
      setAssignStatus('Job assigned!');
    }, 1000);
  }

  // Helper function for chart data
  function getJobsPerDayData(jobs: any[]) {
    // Group jobs by scheduled_date
    const counts: Record<string, number> = {};
    jobs.forEach((job) => {
      const date = job.scheduled_date || 'Unknown';
      counts[date] = (counts[date] || 0) + 1;
    });
    return Object.entries(counts).map(([date, count]) => ({ date, count }));
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-blue-700">Dashboard</h1>
      {loading ? (
        <div className="text-lg">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <KPI
                icon={<CheckCircle className="h-6 w-6" />}
                label="Completed Today"
                value={jobs.filter((j) => j.status === 'completed').length}
                color="#22c55e"
                tooltip="Jobs completed today"
              />
              <KPI
                icon={<Clock className="h-6 w-6" />}
                label="In Progress"
                value={jobs.filter((j) => j.status === 'in_progress').length}
                color="#f59e42"
                tooltip="Jobs currently in progress"
              />
              <KPI
                icon={<Zap className="h-6 w-6" />}
                label="Unassigned"
                value={jobs.filter((j) => j.status === 'unassigned').length}
                color="#eab308"
                tooltip="Jobs not yet assigned"
              />
            </div>

            {/* Jobs Per Day Chart */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h3 className="text-lg font-semibold mb-2">Jobs Per Day</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={getJobsPerDayData(jobs)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <h2 className="text-xl font-semibold mb-2">Jobs</h2>
            <div className="space-y-4">
              {Array.isArray(jobs) &&
                jobs.map((job) => (
                  <div
                    key={job.id}
                    className="bg-white shadow rounded p-4 border-l-4 border-blue-400"
                  >
                    <div className="font-bold text-blue-600">{job.status}</div>
                    <div className="text-sm text-gray-600">
                      {job.scheduled_date} | {job.location?.name}
                    </div>
                    <div className="text-xs text-gray-500">
                      Technician: {job.technician_id || 'Unassigned'}
                    </div>
                    <form className="mt-2 flex gap-2" onSubmit={handleAssignJob}>
                      <select
                        value={assignTechId}
                        onChange={(e) => setAssignTechId(e.target.value)}
                        className="border rounded px-2"
                      >
                        <option value="">Select Technician</option>
                        {routes.map((route: any) => (
                          <option key={route.id} value={route.technician}>
                            {route.technician}
                          </option>
                        ))}
                      </select>
                      <button
                        type="submit"
                        className="px-2 py-1 bg-blue-500 text-white rounded"
                        onClick={() => setAssignJobId(job.id)}
                      >
                        Assign
                      </button>
                    </form>
                  </div>
                ))}
              {assignStatus && <div className="text-green-600 mt-2">{assignStatus}</div>}
            </div>
            {user.roles && user.roles.includes('admin') && (
              <>
                <div className="mt-8">
                  <h2 className="text-xl font-semibold mb-2">User Management</h2>
                  <UserManagementForm />
                </div>
                <div className="mt-8">
                  <h2 className="text-xl font-semibold mb-2">Audit Logs</h2>
                  <div className="space-y-2">
                    {auditLogs.length === 0 ? (
                      <div>No audit logs found.</div>
                    ) : (
                      auditLogs.map((log: any) => (
                        <div key={log.id} className="bg-gray-100 rounded p-2 text-xs">
                          <div>
                            <span className="font-bold">{log.action}</span> on{' '}
                            <span>{log.resource_type}</span> ({log.resource_id})
                          </div>
                          <div>{log.timestamp}</div>
                          <div>{log.user_id ? `User: ${log.user_id}` : ''}</div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
          <div className="rounded shadow overflow-hidden">
            <MapContainer
              center={[40.4406, -79.9959]}
              zoom={12}
              style={{ height: '400px', width: '100%' }}
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              {Array.isArray(jobs) &&
                jobs.map((job) =>
                  job.location?.coordinates?.lat && job.location?.coordinates?.lng ? (
                    <Marker
                      key={job.id}
                      position={[job.location.coordinates.lat, job.location.coordinates.lng]}
                    >
                      <Popup>
                        <div className="font-bold">{job.location.name}</div>
                        <div>{job.status}</div>
                      </Popup>
                    </Marker>
                  ) : null,
                )}
              {/* Basic route visualization: draw polylines for each technician's route */}
              {Array.isArray(routes) &&
                routes.map((route: any, idx: number) => {
                  // For demo, assume route.jobs is an array of job IDs in order
                  const routeJobs = Array.isArray(route.jobs)
                    ? route.jobs.map((jobId: string) => jobs.find((j: any) => j.id === jobId))
                    : [];
                  const positions = routeJobs
                    .filter(
                      (job: any) =>
                        job && job.location?.coordinates?.lat && job.location?.coordinates?.lng,
                    )
                    .map((job: any) => [
                      job.location.coordinates.lat,
                      job.location.coordinates.lng,
                    ]);
                  return positions.length > 1 ? (
                    <Polyline key={route.id || idx} positions={positions} color="purple" />
                  ) : null;
                })}
            </MapContainer>
          </div>
        </div>
      )}
    </div>
  );
}
