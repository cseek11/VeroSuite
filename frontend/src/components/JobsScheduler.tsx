import { useState } from 'react';
import { toast } from '@/utils/toast';

interface Job {
  id: string;
  title: string;
  start: string | Date;
  end: string | Date;
  color: string;
  technician?: string;
}

export default function JobsScheduler() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date(2025, 7, 1));

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    const current = new Date(startDate);
    
    while (current <= lastDay || current.getDay() !== 0) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    
    return days;
  };

  const getJobsForDate = (date: Date) => {
    return jobs.filter(job => {
      const jobDate = new Date(job.start);
      return jobDate.toDateString() === date.toDateString();
    });
  };

  // Helper function for date formatting (currently unused, kept for potential future use)
  const _formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };
  void _formatDate; // Suppress unused warning

  const navigateMonth = (direction: number) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + direction, 1));
  };

  const days = getDaysInMonth(currentDate);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Jobs Scheduler</h1>
      
      {/* Calendar header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <button 
            onClick={() => navigateMonth(-1)}
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
          >
            ← Previous
          </button>
          <h2 className="text-lg font-semibold">
            {currentDate.toLocaleDateString('en-US', { 
              month: 'long', 
              year: 'numeric' 
            })}
          </h2>
          <button 
            onClick={() => navigateMonth(1)}
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
          >
            Next →
          </button>
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1">
          {/* Day headers */}
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center font-semibold text-gray-600 p-2 text-sm">
              {day}
            </div>
          ))}
          
          {/* Calendar days */}
          {days.map((date, index) => {
            const dayJobs = getJobsForDate(date);
            const isCurrentMonth = date.getMonth() === currentDate.getMonth();
            
            return (
              <div 
                key={index} 
                className={`border rounded p-2 min-h-[100px] ${
                  isCurrentMonth ? 'bg-white' : 'bg-gray-50'
                } ${!isCurrentMonth ? 'text-gray-400' : ''}`}
              >
                <div className="text-sm font-medium mb-1">
                  {date.getDate()}
                </div>
                <div className="space-y-1">
                  {dayJobs.map(job => (
                    <div 
                      key={job.id}
                      className="text-xs p-1 rounded cursor-pointer text-white"
                      style={{ backgroundColor: job.color }}
                      onClick={() => setSelectedJob(job)}
                    >
                      {job.title}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Job details modal */}
      {selectedJob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-lg font-semibold mb-4">{selectedJob.title}</h2>
            <div className="space-y-2">
              <p><strong>Technician:</strong> {selectedJob.technician}</p>
              <p><strong>Start:</strong> {new Date(selectedJob.start).toLocaleString()}</p>
              <p><strong>End:</strong> {new Date(selectedJob.end).toLocaleString()}</p>
            </div>
            <div className="mt-4 flex gap-2">
              <button 
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                onClick={() => {
                  toast.info('Edit functionality would be implemented here');
                }}
              >
                Edit
              </button>
              <button 
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                onClick={() => {
                  setJobs(jobs.filter(job => job.id !== selectedJob.id));
                  setSelectedJob(null);
                }}
              >
                Delete
              </button>
              <button 
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                onClick={() => setSelectedJob(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
