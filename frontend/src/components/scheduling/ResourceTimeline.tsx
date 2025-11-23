import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Clock, MapPin, User, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from 'lucide-react';
import { enhancedApi } from '@/lib/enhanced-api';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { logger } from '@/utils/logger';
import { getOrCreateTraceContext } from '@/lib/trace-propagation';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/Dialog';

// Types
interface Job {
  id: string;
  status: 'unassigned' | 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  scheduled_date: string;
  scheduled_start_time?: string;
  scheduled_end_time?: string;
  technician_id?: string;
  customer: {
    id: string;
    name: string;
    phone?: string;
  };
  location: {
    id: string;
    name: string;
    address: string;
    coordinates: { lat: number; lng: number };
  };
  service: {
    type: string;
    description: string;
    estimated_duration: number;
    price?: number;
  };
}

interface Technician {
  id: string;
  first_name: string;
  last_name: string;
  phone?: string;
  is_active: boolean;
  skills?: string[];
}

interface ResourceTimelineProps {
  selectedDate?: Date;
  onDateChange?: (date: Date) => void;
  onJobSelect?: (job: Job) => void;
  onJobUpdate?: (jobId: string, updates: Partial<Job>) => void;
}

interface TimelineJob extends Job {
  startTime: number; // Minutes from start of day
  endTime: number; // Minutes from start of day
  duration: number; // Minutes
  left: number; // Percentage from left
  width: number; // Percentage width
}

const HOURS_PER_DAY = 24;
const MINUTES_PER_HOUR = 60;
const MINUTES_PER_DAY = HOURS_PER_DAY * MINUTES_PER_HOUR;
const DEFAULT_START_HOUR = 6; // 6 AM
const DEFAULT_END_HOUR = 22; // 10 PM
const VISIBLE_HOURS = DEFAULT_END_HOUR - DEFAULT_START_HOUR;

export const ResourceTimeline: React.FC<ResourceTimelineProps> = ({
  selectedDate = new Date(),
  onDateChange,
  onJobSelect,
  onJobUpdate
}) => {
  const [viewDate, setViewDate] = useState(selectedDate);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [showJobDialog, setShowJobDialog] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1); // 1 = day view, 0.5 = half day, 2 = 2 days
  const [timeRange, setTimeRange] = useState({ start: DEFAULT_START_HOUR, end: DEFAULT_END_HOUR });

  const queryClient = useQueryClient();

  // Calculate date range based on zoom level
  const dateRange = useMemo(() => {
    const start = new Date(viewDate);
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setDate(end.getDate() + Math.ceil(zoomLevel));
    return { start, end };
  }, [viewDate, zoomLevel]);

  // Fetch technicians
  const { data: technicians = [], isLoading: techniciansLoading, error: techniciansError } = useQuery({
    queryKey: ['technicians', 'timeline'],
    queryFn: async () => {
      try {
        if (enhancedApi.technicians && typeof enhancedApi.technicians.list === 'function') {
          return await enhancedApi.technicians.list();
        }
        return await enhancedApi.users.list({
          roles: ['technician'],
          status: 'active'
        });
      } catch (error) {
        const traceContext = getOrCreateTraceContext();
        logger.error('Failed to fetch technicians', 'ResourceTimeline', error as Error, undefined, undefined, undefined, traceContext.traceId, traceContext.spanId, traceContext.requestId);
        throw error;
      }
    },
    staleTime: 10 * 60 * 1000,
  });

  // Fetch jobs for date range
  const { data: jobs = [], isLoading: jobsLoading, error: jobsError } = useQuery({
    queryKey: ['jobs', 'timeline', dateRange.start.toISOString(), dateRange.end.toISOString()],
    queryFn: async () => {
      try {
        const startDateStr = dateRange.start.toISOString().split('T')[0];
        const endDateStr = dateRange.end.toISOString().split('T')[0];
        return await enhancedApi.jobs.getByDateRange(startDateStr, endDateStr);
      } catch (error) {
        const traceContext = getOrCreateTraceContext();
        logger.error('Failed to fetch jobs for timeline', 'ResourceTimeline', error as Error, undefined, undefined, undefined, traceContext.traceId, traceContext.spanId, traceContext.requestId);
        throw error;
      }
    },
    staleTime: 2 * 60 * 1000,
  });

  // Process jobs into timeline format
  const timelineJobs = useMemo(() => {
    const processed: Map<string, TimelineJob[]> = new Map();

    technicians.forEach(tech => {
      processed.set(tech.id, []);
    });

    jobs.forEach(job => {
      if (!job.technician_id || !job.scheduled_start_time || !job.scheduled_end_time) {
        return;
      }

      const jobDate = new Date(job.scheduled_date);
      const [startHour, startMinute] = job.scheduled_start_time.split(':').map(Number);
      const [endHour, endMinute] = job.scheduled_end_time.split(':').map(Number);

      const startTime = startHour * MINUTES_PER_HOUR + startMinute;
      const endTime = endHour * MINUTES_PER_HOUR + endMinute;
      const duration = endTime - startTime;

      // Calculate position and width
      const visibleStart = timeRange.start * MINUTES_PER_HOUR;
      const visibleEnd = timeRange.end * MINUTES_PER_HOUR;
      const visibleDuration = visibleEnd - visibleStart;

      const left = ((startTime - visibleStart) / visibleDuration) * 100;
      const width = (duration / visibleDuration) * 100;

      const timelineJob: TimelineJob = {
        ...job,
        startTime,
        endTime,
        duration,
        left: Math.max(0, Math.min(100, left)),
        width: Math.max(1, Math.min(100, width))
      };

      const techJobs = processed.get(job.technician_id) || [];
      techJobs.push(timelineJob);
      processed.set(job.technician_id, techJobs);
    });

    return processed;
  }, [jobs, technicians, timeRange]);

  // Generate time slots for header
  const timeSlots = useMemo(() => {
    const slots: string[] = [];
    for (let hour = timeRange.start; hour <= timeRange.end; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`);
    }
    return slots;
  }, [timeRange]);

  // Update job mutation
  const updateJobMutation = useMutation({
    mutationFn: async ({ jobId, updates }: { jobId: string; updates: Partial<Job> }) => {
      return enhancedApi.jobs.update(jobId, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      setShowJobDialog(false);
      setSelectedJob(null);
      const traceContext = getOrCreateTraceContext();
      logger.info('Job updated successfully', { jobId: selectedJob?.id }, 'ResourceTimeline', traceContext.traceId, traceContext.spanId, traceContext.requestId);
    },
    onError: (error: unknown) => {
      const traceContext = getOrCreateTraceContext();
      logger.error('Failed to update job', 'ResourceTimeline', error as Error, undefined, undefined, undefined, traceContext.traceId, traceContext.spanId, traceContext.requestId);
    }
  });

  // Navigation handlers
  const handlePreviousDay = () => {
    const newDate = new Date(viewDate);
    newDate.setDate(newDate.getDate() - 1);
    setViewDate(newDate);
    onDateChange?.(newDate);
  };

  const handleNextDay = () => {
    const newDate = new Date(viewDate);
    newDate.setDate(newDate.getDate() + 1);
    setViewDate(newDate);
    onDateChange?.(newDate);
  };

  const handleToday = () => {
    const today = new Date();
    setViewDate(today);
    onDateChange?.(today);
  };

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev * 1.5, 7)); // Max 7 days
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev / 1.5, 0.5)); // Min half day
  };

  // Job click handler
  const handleJobClick = (job: Job) => {
    setSelectedJob(job);
    setShowJobDialog(true);
    onJobSelect?.(job);
  };

  // Get job color based on status and priority
  const getJobColor = (job: Job): string => {
    if (job.status === 'completed') return 'bg-green-500';
    if (job.status === 'in_progress') return 'bg-blue-500';
    if (job.status === 'cancelled') return 'bg-gray-400';
    
    if (job.priority === 'urgent') return 'bg-red-600';
    if (job.priority === 'high') return 'bg-orange-500';
    if (job.priority === 'medium') return 'bg-yellow-500';
    return 'bg-blue-400';
  };

  // Get job border color based on priority
  const getJobBorderColor = (job: Job): string => {
    if (job.priority === 'urgent') return 'border-red-800';
    if (job.priority === 'high') return 'border-orange-700';
    if (job.priority === 'medium') return 'border-yellow-600';
    return 'border-blue-500';
  };

  if (techniciansLoading || jobsLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner />
      </div>
    );
  }

  if (techniciansError || jobsError) {
    return (
      <Card className="p-6">
        <div className="text-center text-red-600">
          <p>Failed to load timeline data</p>
          <p className="text-sm text-gray-500 mt-2">
            {techniciansError instanceof Error ? techniciansError.message : 'Unknown error'}
          </p>
        </div>
      </Card>
    );
  }

  const activeTechnicians = technicians.filter(tech => tech.is_active);

  return (
    <ErrorBoundary>
      <div className="space-y-4">
        {/* Header Controls */}
        <Card className="p-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePreviousDay}
                aria-label="Previous day"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleToday}
                aria-label="Today"
              >
                Today
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleNextDay}
                aria-label="Next day"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <div className="ml-4 font-semibold">
                {viewDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleZoomOut}
                aria-label="Zoom out"
                disabled={zoomLevel <= 0.5}
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
              <span className="text-sm text-gray-600 min-w-[80px] text-center">
                {zoomLevel.toFixed(1)} day{zoomLevel !== 1 ? 's' : ''}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleZoomIn}
                aria-label="Zoom in"
                disabled={zoomLevel >= 7}
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>

        {/* Timeline View */}
        <Card className="p-0 overflow-x-auto">
          <div className="min-w-full">
            {/* Time Header */}
            <div className="sticky top-0 z-10 bg-white border-b">
              <div className="flex">
                <div className="w-48 border-r p-2 font-semibold bg-gray-50">
                  Technician
                </div>
                <div className="flex-1 relative" style={{ minWidth: `${VISIBLE_HOURS * 60}px` }}>
                  <div className="flex">
                    {timeSlots.map((time, index) => (
                      <div
                        key={index}
                        className="flex-1 border-r p-2 text-center text-sm font-medium"
                        style={{ minWidth: `${(VISIBLE_HOURS / timeSlots.length) * 60}px` }}
                      >
                        {time}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Technician Lanes */}
            <div className="divide-y">
              {activeTechnicians.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  No active technicians found
                </div>
              ) : (
                activeTechnicians.map(technician => {
                  const techJobs = timelineJobs.get(technician.id) || [];
                  const technicianName = `${technician.first_name} ${technician.last_name}`;

                  return (
                    <div key={technician.id} className="flex min-h-[80px] hover:bg-gray-50">
                      {/* Technician Name */}
                      <div className="w-48 border-r p-4 bg-gray-50 flex items-center">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-gray-600" />
                          <span className="font-medium">{technicianName}</span>
                        </div>
                        {techJobs.length > 0 && (
                          <span className="ml-auto text-xs text-gray-500">
                            {techJobs.length} job{techJobs.length !== 1 ? 's' : ''}
                          </span>
                        )}
                      </div>

                      {/* Timeline Lane */}
                      <div className="flex-1 relative" style={{ minWidth: `${VISIBLE_HOURS * 60}px` }}>
                        <div className="relative h-full">
                          {/* Time grid lines */}
                          <div className="absolute inset-0 flex">
                            {timeSlots.map((_, index) => (
                              <div
                                key={index}
                                className="flex-1 border-r border-gray-200"
                                style={{ minWidth: `${(VISIBLE_HOURS / timeSlots.length) * 60}px` }}
                              />
                            ))}
                          </div>

                          {/* Jobs */}
                          {techJobs.map(job => {
                            const jobColor = getJobColor(job);
                            const borderColor = getJobBorderColor(job);

                            return (
                              <div
                                key={job.id}
                                onClick={() => handleJobClick(job)}
                                className={`absolute top-2 bottom-2 rounded border-2 ${jobColor} ${borderColor} cursor-pointer hover:opacity-80 transition-opacity shadow-sm`}
                                style={{
                                  left: `${job.left}%`,
                                  width: `${job.width}%`,
                                  minWidth: '60px'
                                }}
                                title={`${job.customer.name} - ${job.service.type} (${job.scheduled_start_time} - ${job.scheduled_end_time})`}
                              >
                                <div className="p-2 h-full flex flex-col justify-between text-white text-xs">
                                  <div className="font-semibold truncate">
                                    {job.customer.name}
                                  </div>
                                  <div className="text-xs opacity-90 truncate">
                                    {job.service.type}
                                  </div>
                                  <div className="flex items-center gap-1 text-xs opacity-75">
                                    <Clock className="h-3 w-3" />
                                    <span>
                                      {job.scheduled_start_time} - {job.scheduled_end_time}
                                    </span>
                                  </div>
                                  {job.location && (
                                    <div className="flex items-center gap-1 text-xs opacity-75 truncate">
                                      <MapPin className="h-3 w-3" />
                                      <span className="truncate">{job.location.name}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          })}

                          {/* Empty state */}
                          {techJobs.length === 0 && (
                            <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm">
                              No jobs scheduled
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </Card>

        {/* Job Detail Dialog */}
        <Dialog open={showJobDialog} onOpenChange={setShowJobDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Job Details</DialogTitle>
              <DialogDescription>
                View and manage job information
              </DialogDescription>
            </DialogHeader>
            {selectedJob && (
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg">{selectedJob.customer.name}</h3>
                  <p className="text-sm text-gray-600">{selectedJob.service.type}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Status</label>
                    <p className="text-sm">{selectedJob.status}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Priority</label>
                    <p className="text-sm">{selectedJob.priority}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Date</label>
                    <p className="text-sm">{selectedJob.scheduled_date}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Time</label>
                    <p className="text-sm">
                      {selectedJob.scheduled_start_time} - {selectedJob.scheduled_end_time}
                    </p>
                  </div>
                  {selectedJob.location && (
                    <div className="col-span-2">
                      <label className="text-sm font-medium text-gray-700">Location</label>
                      <p className="text-sm">{selectedJob.location.address}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowJobDialog(false)}
              >
                Close
              </Button>
              {onJobUpdate && selectedJob && (
                <Button
                  onClick={() => {
                    // Example: Mark as in progress
                    updateJobMutation.mutate({
                      jobId: selectedJob.id,
                      updates: { status: 'in_progress' }
                    });
                  }}
                >
                  Update Status
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </ErrorBoundary>
  );
};

