import { useState, useEffect, useMemo, Fragment, type DragEvent, type FC } from 'react';
import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Edit, AlertTriangle, Repeat, Eye } from 'lucide-react';
import { enhancedApi } from '@/lib/enhanced-api';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Checkbox from '@/components/ui/Checkbox';
import Label from '@/components/ui/Label';
import { ConflictBadge } from './ConflictBadge';
import { AlertPanel, Alert } from './AlertPanel';
import { RecurrencePatternSelector, RecurrencePattern } from './RecurrencePatternSelector';
import { RecurrencePreview } from './RecurrencePreview';
import { RecurringSeriesManager } from './RecurringSeriesManager';
import { ConflictResolutionDialog } from '@/components/dashboard/ConflictResolutionDialog';
import { logger } from '@/utils/logger';
import CustomerSearchSelector from '@/components/ui/CustomerSearchSelector';
import SchedulingAnalytics from './SchedulingAnalytics';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/Dialog';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/CRMComponents';
import type { Job } from '@/types/enhanced-types';

// Types
// Extended Job type with populated relations
type JobWithRelations = Job & {
  customer?: { id: string; name: string; phone?: string };
  location?: { id: string; name: string; address: string; coordinates?: { lat: number; lng: number } };
  service?: { type: string; description: string; estimated_duration: number; price?: number };
  is_recurring?: boolean;
  recurring_template_id?: string;
};

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  technicianId?: string | undefined;
  technicianName?: string | undefined;
  status: string;
  priority: string;
  customer: string;
  location: string;
  color: string;
  job: JobWithRelations;
  hasConflict?: boolean | undefined;
  conflictType?: 'time_overlap' | 'technician_double_booking' | 'location_conflict' | undefined;
  conflictSeverity?: 'low' | 'medium' | 'high' | 'critical' | undefined;
  availabilityIssue?: string | undefined;
  isRecurring?: boolean | undefined;
}

interface ScheduleCalendarProps {
  selectedDate?: Date;
  onDateChange?: (date: Date) => void;
  onJobSelect?: (job: JobWithRelations) => void;
  onJobEdit?: (job: JobWithRelations) => void;
  onJobCreate?: () => void;
  searchQuery?: string;
  filterStatus?: string;
  filterPriority?: string;
  // New enterprise features
  showAnalytics?: boolean;
  analyticsMode?: 'dashboard' | 'embedded';
  showMap?: boolean;
  mapMode?: 'overlay' | 'tab' | 'side';
  enableBulkSelection?: boolean;
  onBulkSelect?: (jobIds: string[]) => void;
  filterTechnician?: string;
  showTechnicianMetrics?: boolean;
}

export const ScheduleCalendar: FC<ScheduleCalendarProps> = ({
  selectedDate = new Date(),
  onDateChange,
  onJobSelect,
  onJobEdit,
  onJobCreate: _onJobCreate,
  searchQuery = '',
  filterStatus = 'all',
  filterPriority = 'all',
  showAnalytics = false,
  analyticsMode = 'embedded',
  showMap = false,
  mapMode = 'overlay',
  enableBulkSelection = false,
  onBulkSelect,
  filterTechnician,
  showTechnicianMetrics: _showTechnicianMetrics = false
}) => {
  const [currentView, setCurrentView] = useState<'month' | 'week' | 'day' | 'list'>('week');
  const [selectedJobIds, setSelectedJobIds] = useState<Set<string>>(new Set());
  const [selectedJob, setSelectedJob] = useState<JobWithRelations | null>(null);
  const [_isEditing, setIsEditing] = useState(false);
  const [editingJob, setEditingJob] = useState<JobWithRelations | null>(null);
  const [showJobDialog, setShowJobDialog] = useState(false);
  const [draggedJob, setDraggedJob] = useState<JobWithRelations | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [jobConflicts, setJobConflicts] = useState<Map<string, { type: string; severity: string }>>(new Map());
  const [availabilityStatus, setAvailabilityStatus] = useState<Map<string, { is_available: boolean; reason?: string }>>(new Map());
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [_isRecurring, setIsRecurring] = useState(false);
  const [_recurrencePattern, setRecurrencePattern] = useState<RecurrencePattern | null>(null);
  const [showSeriesManager, setShowSeriesManager] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  const [conflictDialogOpen, setConflictDialogOpen] = useState(false);
  const [conflictData, setConflictData] = useState<{
    conflicts: Array<{
      type: 'time_overlap' | 'technician_double_booking' | 'location_conflict';
      severity: 'low' | 'medium' | 'high' | 'critical';
      description: string;
      conflicting_job_ids: string[];
      conflicting_jobs: Array<{
        id: string;
        scheduled_date: string;
        scheduled_start_time: string;
        scheduled_end_time: string;
        customer_name?: string;
        location_address?: string;
      }>;
    }>;
    canProceed: boolean;
  } | null>(null);
  const [pendingJobUpdate, setPendingJobUpdate] = useState<{
    jobId: string;
    updates: Partial<JobWithRelations>;
  } | null>(null);

  const queryClient = useQueryClient();

  // Debug: Log when search props change
  useEffect(() => {
    if (searchQuery || filterStatus !== 'all' || filterPriority !== 'all') {
      logger.debug('ScheduleCalendar filters changed', { searchQuery, filterStatus, filterPriority }, 'ScheduleCalendar');
    }
  }, [searchQuery, filterStatus, filterPriority]);

  // Fetch jobs for the selected date range
  // Use keepPreviousData to prevent flickering when switching views
  const { data: jobs = [], isLoading: jobsLoading, error: jobsError } = useQuery<JobWithRelations[]>({
    queryKey: ['jobs', 'calendar', selectedDate, currentView],
    queryFn: async () => {
      const startDate = getDateRangeStart(selectedDate, currentView);
      const endDate = getDateRangeEnd(selectedDate, currentView);
      
      const startDateStr = startDate.toISOString().split('T')[0];
      const endDateStr = endDate.toISOString().split('T')[0];
      
      if (!startDateStr || !endDateStr) {
        throw new Error('Invalid date range');
      }
      
      const result = await enhancedApi.jobs.getByDateRange(startDateStr, endDateStr);
      return result as JobWithRelations[];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    placeholderData: keepPreviousData, // Keep showing previous data while loading new data (React Query v5)
  });

  // Filter jobs based on search and filters
  const filteredJobs = useMemo(() => {
    if (!jobs || jobs.length === 0) {
      return [];
    }

    const filtered = jobs.filter((job: any) => {
      // Handle different data structures
      const customerName = job.customer?.name || job.account?.name || job.account_name || '';
      const serviceType = job.service?.type || job.service_type || job.service_name || '';
      const locationAddress = job.location?.address || job.location_address || job.address || '';
      const jobStatus = job.status || '';
      const jobPriority = job.priority || '';
      const jobTechnicianId = job.technician_id || '';
      
      // Search matching
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch = searchQuery === '' || 
        customerName.toLowerCase().includes(searchLower) ||
        serviceType.toLowerCase().includes(searchLower) ||
        locationAddress.toLowerCase().includes(searchLower) ||
        job.id?.toLowerCase().includes(searchLower);
      
      // Status matching
      const matchesStatus = filterStatus === 'all' || jobStatus === filterStatus;
      
      // Priority matching
      const matchesPriority = filterPriority === 'all' || jobPriority === filterPriority;
      
      // Technician matching
      const matchesTechnician = !filterTechnician || jobTechnicianId === filterTechnician;
      
      return matchesSearch && matchesStatus && matchesPriority && matchesTechnician;
    });

    // Debug logging
    if (searchQuery || filterStatus !== 'all' || filterPriority !== 'all') {
      logger.debug('Filtering jobs', {
        totalJobs: jobs.length,
        filteredCount: filtered.length,
        searchQuery,
        filterStatus,
        filterPriority
      }, 'ScheduleCalendar');
    }

    return filtered;
  }, [jobs, searchQuery, filterStatus, filterPriority]);

  // Fetch technicians
  const { data: technicians = [], isLoading: techniciansLoading } = useQuery({
    queryKey: ['technicians', 'active'],
    queryFn: async () => {
      // Try technicians API first, then fallback
      if (enhancedApi.technicians && typeof enhancedApi.technicians.list === 'function') {
        return await enhancedApi.technicians.list();
      }
      return enhancedApi.users.list();
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  // Check availability for jobs with technicians
  useEffect(() => {
    const checkAvailability = async () => {
      const availabilityMap = new Map<string, { is_available: boolean; reason?: string }>();

      // Group jobs by date and technician to batch availability checks
      const jobsToCheck = filteredJobs.filter(job => 
        job.technician_id && 
        job.scheduled_date && 
        job.scheduled_start_time && 
        job.scheduled_end_time
      );

      // Check availability for each unique technician/date/time combination
      const uniqueChecks = new Map<string, any[]>();
      for (const job of jobsToCheck) {
        const key = `${job.technician_id}-${job.scheduled_date}-${job.scheduled_start_time}-${job.scheduled_end_time}`;
        if (!uniqueChecks.has(key)) {
          uniqueChecks.set(key, []);
        }
        uniqueChecks.get(key)!.push(job);
      }

      // Perform availability checks
      for (const [_key, jobs] of uniqueChecks.entries()) {
        const job = jobs[0]; // Use first job for the check
        try {
          const available = await enhancedApi.technicians.getAvailable(
            job.scheduled_date,
            job.scheduled_start_time,
            job.scheduled_end_time
          );
          const techAvailability = available.find((t: any) => t.id === job.technician_id);
          
          // Set availability status for all jobs with this key
          for (const j of jobs) {
            if (techAvailability) {
              availabilityMap.set(j.id, {
                is_available: techAvailability.is_available,
                reason: techAvailability.reason
              });
            }
          }
        } catch (error) {
          // Silently fail - don't block calendar rendering
          logger.debug('Availability check failed for job', { jobId: job.id, error }, 'ScheduleCalendar');
        }
      }

      setAvailabilityStatus(availabilityMap);
    };

    // Debounce availability checking
    const timeoutId = setTimeout(() => {
      checkAvailability();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [filteredJobs]);

  // Update job mutation
  const updateJobMutation = useMutation({
    mutationFn: async ({ jobId, updates }: { jobId: string; updates: Partial<JobWithRelations> }) => {
      return enhancedApi.jobs.update(jobId, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      setShowJobDialog(false);
      setEditingJob(null);
      setIsEditing(false);
    },
    onError: (error) => {
      logger.error('Failed to update job', error, 'ScheduleCalendar');
    }
  });

  // Check for conflicts for displayed jobs
  useEffect(() => {
    const checkConflicts = async () => {
      const newAlerts: Alert[] = [];
      const conflictsMap = new Map<string, { type: string; severity: string }>();

      // Check conflicts for each scheduled job with a technician
      for (const job of filteredJobs) {
        if (job.technician_id && job.scheduled_date && job.scheduled_start_time && job.scheduled_end_time) {
          try {
            const conflictResult = await enhancedApi.jobs.checkConflicts(
              job.technician_id,
              job.scheduled_date,
              job.scheduled_start_time,
              job.scheduled_end_time,
              [job.id] // Exclude current job
            );

            if (conflictResult.has_conflicts && conflictResult.conflicts.length > 0) {
              const firstConflict = conflictResult.conflicts[0];
              if (!firstConflict) return;
              const highestSeverity = conflictResult.conflicts.reduce((max, c) => {
                const severityOrder: Record<string, number> = { critical: 0, high: 1, medium: 2, low: 3 };
                return (severityOrder[c.severity] ?? 4) < (severityOrder[max.severity] ?? 4) ? c : max;
              }, firstConflict);

              if (highestSeverity) {
                conflictsMap.set(job.id, {
                  type: highestSeverity.type,
                  severity: highestSeverity.severity
                });

                // Create alert for critical/high conflicts
                if (highestSeverity.severity === 'critical' || highestSeverity.severity === 'high') {
                  newAlerts.push({
                    id: `conflict-${job.id}`,
                    type: 'conflict',
                    severity: highestSeverity.severity as any,
                    message: `Conflict: ${highestSeverity.description}`,
                    jobId: job.id,
                    jobTitle: `${job.customer?.name || 'Unknown'} - ${job.service?.type || 'Unknown'}`,
                    timestamp: new Date(),
                    onClick: () => {
                      setSelectedJob(job);
                      setShowJobDialog(true);
                    }
                  });
                }
              }
            }
          } catch (error) {
            // Silently fail conflict checks - don't block calendar rendering
            logger.debug('Conflict check failed for job', { jobId: job.id, error }, 'ScheduleCalendar');
          }
        }

        // Check for overdue jobs
        if ((job.status === 'assigned' || job.status === 'unassigned') && job.scheduled_date) {
          const scheduledDate = new Date(job.scheduled_date);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          scheduledDate.setHours(0, 0, 0, 0);

          if (scheduledDate < today) {
            newAlerts.push({
              id: `overdue-${job.id}`,
              type: 'overdue',
              severity: 'high',
              message: `Overdue job: ${job.customer?.name || 'Unknown'}`,
              jobId: job.id,
              jobTitle: `${job.customer?.name || 'Unknown'} - ${job.service?.type || 'Unknown'}`,
              timestamp: new Date(),
              onClick: () => {
                setSelectedJob(job);
                setShowJobDialog(true);
              }
            });
          }
        }
      }

      setAlerts(newAlerts);
      setJobConflicts(conflictsMap);
    };

    // Debounce conflict checking
    const timeoutId = setTimeout(() => {
      checkConflicts();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [filteredJobs]);

  // Convert filtered jobs to calendar events
  const calendarEvents = useMemo(() => {
    return filteredJobs.map((job: JobWithRelations): CalendarEvent => {
      const startTime = job.scheduled_start_time ? 
        new Date(`${job.scheduled_date}T${job.scheduled_start_time}`) :
        new Date(`${job.scheduled_date}T09:00:00`);
      
      const endTime = job.scheduled_end_time ? 
        new Date(`${job.scheduled_date}T${job.scheduled_end_time}`) :
        new Date(startTime.getTime() + (job.service?.estimated_duration || 60) * 60000);

      const technician = technicians.find((t: any) => (t.id || t.user_id) === job.technician_id);
      const conflict = jobConflicts.get(job.id);
      const availability = availabilityStatus.get(job.id);
      const hasAvailabilityIssue = availability && !availability.is_available;
      
      return {
        id: job.id,
        title: `${job.customer?.name || 'Unknown'} - ${job.service?.type || 'Unknown'}`,
        start: startTime,
        end: endTime,
        technicianId: job.technician_id || undefined,
        technicianName: technician 
          ? `${technician.first_name || ''} ${technician.last_name || ''}`.trim() || technician.email || 'Unknown'
          : 'Unassigned',
        status: job.status,
        priority: job.priority,
        customer: job.customer?.name || 'Unknown',
        location: job.location?.address || 'Unknown',
        color: getJobColor(job.status, job.priority, !!conflict || hasAvailabilityIssue),
        job,
        hasConflict: !!conflict || undefined,
        conflictType: conflict?.type as any || undefined,
        conflictSeverity: conflict?.severity as any || undefined,
        availabilityIssue: hasAvailabilityIssue ? availability.reason : undefined,
        isRecurring: !!job.is_recurring || !!job.recurring_template_id || undefined
      };
    });
  }, [filteredJobs, technicians, jobConflicts, availabilityStatus]);

  // Get date range based on current view
  const getDateRangeStart = (date: Date, view: string): Date => {
    const d = new Date(date);
    switch (view) {
      case 'month':
        d.setDate(1);
        d.setHours(0, 0, 0, 0);
        return d;
      case 'week':
        const day = d.getDay();
        d.setDate(d.getDate() - day);
        d.setHours(0, 0, 0, 0);
        return d;
      case 'day':
        d.setHours(0, 0, 0, 0);
        return d;
      case 'list':
        // For list view, show a wider range (30 days back)
        d.setDate(d.getDate() - 30);
        d.setHours(0, 0, 0, 0);
        return d;
      default:
        return d;
    }
  };

  const getDateRangeEnd = (date: Date, view: string): Date => {
    const d = new Date(date);
    switch (view) {
      case 'month':
        d.setMonth(d.getMonth() + 1);
        d.setDate(0);
        d.setHours(23, 59, 59, 999);
        return d;
      case 'week':
        d.setDate(d.getDate() - d.getDay() + 6);
        d.setHours(23, 59, 59, 999);
        return d;
      case 'day':
        d.setHours(23, 59, 59, 999);
        return d;
      case 'list':
        // For list view, show a wider range (30 days forward)
        d.setDate(d.getDate() + 30);
        d.setHours(23, 59, 59, 999);
        return d;
      default:
        return d;
    }
  };

  // Get job color based on status and priority
  const getJobColor = (status: string, priority: string, hasConflict?: boolean): string => {
    // Override with conflict color if conflict exists
    if (hasConflict) return '#ef4444'; // Red for conflicts
    
    if (status === 'completed') return '#22c55e';
    if (status === 'cancelled') return '#ef4444';
    if (status === 'in_progress') return '#3b82f6';
    
    switch (priority) {
      case 'urgent': return '#dc2626';
      case 'high': return '#ea580c';
      case 'medium': return '#d97706';
      case 'low': return '#65a30d';
      default: return '#6b7280';
    }
  };

  // Get border color based on conflict severity
  const getConflictBorderColor = (severity?: string): string => {
    switch (severity) {
      case 'critical': return 'border-red-500 border-2';
      case 'high': return 'border-orange-500 border-2';
      case 'medium': return 'border-yellow-500 border-2';
      case 'low': return 'border-blue-500 border';
      default: return '';
    }
  };

  // Handle job drag start
  const handleDragStart = (event: DragEvent, job: JobWithRelations) => {
    setDraggedJob(job);
    event.dataTransfer.effectAllowed = 'move';
  };

  // Handle job drop with conflict checking
  const handleDrop = async (event: DragEvent, targetDate: Date, targetTime: string) => {
    event.preventDefault();
    
    if (!draggedJob) return;

    const dateStr = targetDate.toISOString().split('T')[0];
    if (!dateStr) return;

    const newStartTime = new Date(`${dateStr}T${targetTime}`);
    const newEndTime = new Date(newStartTime.getTime() + (draggedJob.service?.estimated_duration || 60) * 60000);
    const newStartTimeStr = targetTime;
    const newEndTimeStr = newEndTime.toTimeString().split(' ')[0].substring(0, 5);
    const newDateStr: string = dateStr;

    // Check for conflicts if job has a technician assigned
    if (draggedJob.technician_id) {
      try {
        const conflictResult = await enhancedApi.jobs.checkConflicts(
          draggedJob.technician_id,
          newDateStr,
          newStartTimeStr,
          newEndTimeStr,
          [draggedJob.id] // Exclude current job
        );

        if (conflictResult.has_conflicts) {
          // Store pending update and show conflict dialog
          setPendingJobUpdate({
            jobId: draggedJob.id,
            updates: {
              scheduled_date: newDateStr,
              scheduled_start_time: newStartTimeStr,
              scheduled_end_time: newEndTimeStr
            } as Partial<JobWithRelations>
          });
          setConflictData({
            conflicts: conflictResult.conflicts,
            canProceed: conflictResult.can_proceed
          });
          setConflictDialogOpen(true);
          setDraggedJob(null);
          return;
        }
      } catch (error) {
        logger.warn('Failed to check conflicts, proceeding with update', { error }, 'ScheduleCalendar');
        // Continue with update if conflict check fails
      }
    }

    // No conflicts or no technician assigned - proceed with update
    updateJobMutation.mutate({
      jobId: draggedJob.id,
      updates: {
        scheduled_date: newDateStr,
        scheduled_start_time: newStartTimeStr,
        scheduled_end_time: newEndTimeStr
      } as Partial<JobWithRelations>
    });

    setDraggedJob(null);
  };

  // Handle conflict resolution proceed
  const handleConflictProceed = () => {
    if (pendingJobUpdate) {
      updateJobMutation.mutate(pendingJobUpdate);
      setPendingJobUpdate(null);
    }
    setConflictDialogOpen(false);
    setConflictData(null);
  };

  // Handle conflict resolution cancel
  const handleConflictCancel = () => {
    setPendingJobUpdate(null);
    setConflictDialogOpen(false);
    setConflictData(null);
  };

  // Handle job click
  const handleJobClick = (job: Job) => {
    setSelectedJob(job);
    setShowJobDialog(true);
    onJobSelect?.(job);
  };

  // Handle job edit
  const handleJobEdit = (job: Job) => {
    setEditingJob(job);
    setIsEditing(true);
    onJobEdit?.(job);
  };

  // Render time slots for a day
  const renderTimeSlots = (date: Date) => {
    const timeSlots = [];
    for (let hour = 6; hour < 20; hour++) {
      timeSlots.push(
        <div key={hour} className="border-b border-gray-200 p-2 min-h-[60px]">
          <div className="text-xs text-gray-500 mb-1">
            {hour.toString().padStart(2, '0')}:00
          </div>
          <div 
            className="min-h-[50px] p-1"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => handleDrop(e, date, `${hour.toString().padStart(2, '0')}:00`)}
          >
            {calendarEvents
              .filter(event => {
                const eventDate = new Date(event.start);
                return eventDate.toDateString() === date.toDateString() &&
                       eventDate.getHours() === hour;
              })
              .map(event => (
                <div
                  key={event.id}
                  className={`p-2 rounded text-xs cursor-pointer hover:shadow-md transition-shadow relative ${getConflictBorderColor(event.conflictSeverity)}`}
                  style={{ backgroundColor: getJobColor(event.status, event.priority, event.hasConflict || !!event.availabilityIssue) }}
                  draggable
                  onDragStart={(e) => handleDragStart(e, event.job)}
                  onClick={() => handleJobClick(event.job)}
                >
                  {event.hasConflict && event.conflictType && event.conflictSeverity && (
                    <div className="absolute top-0 right-0 -mt-1 -mr-1 z-10">
                      <ConflictBadge
                        type={event.conflictType}
                        severity={event.conflictSeverity}
                        size="sm"
                      />
                    </div>
                  )}
                  {event.availabilityIssue && !event.hasConflict && (
                    <div className="absolute top-0 right-0 -mt-1 -mr-1 z-10" title={event.availabilityIssue}>
                      <div className="w-3 h-3 bg-orange-500 rounded-full border border-white"></div>
                    </div>
                  )}
                  <div className={`font-medium text-white truncate ${(event.hasConflict || event.availabilityIssue) ? 'pr-4' : ''}`}>
                    {event.title}
                  </div>
                  <div className="text-white/80 text-xs">
                    {event.technicianName}
                  </div>
                  {event.availabilityIssue && (
                    <div className="text-white/70 text-xs mt-1 italic truncate" title={event.availabilityIssue}>
                      ⚠️ {event.availabilityIssue}
                    </div>
                  )}
                  {event.isRecurring && (
                    <div className="absolute top-0 left-0 -mt-1 -ml-1 z-10" title="Recurring job">
                      <Repeat className="w-3 h-3 text-blue-300" />
                    </div>
                  )}
                </div>
              ))
            }
          </div>
        </div>
      );
    }
    return timeSlots;
  };

  // Render week view
  const renderWeekView = () => {
    const startDate = getDateRangeStart(selectedDate, 'week');
    const days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      return date;
    });

    return (
      <div className="grid grid-cols-8 gap-1">
        {/* Time column */}
        <div className="bg-gray-50 p-2">
          <div className="text-sm font-medium text-gray-700">Time</div>
        </div>
        
        {/* Day headers */}
        {days.map((day, index) => (
          <div key={index} className="bg-gray-50 p-2 text-center">
            <div className="text-sm font-medium text-gray-700">
              {day.toLocaleDateString('en-US', { weekday: 'short' })}
            </div>
            <div className="text-xs text-gray-500">
              {day.getDate()}
            </div>
          </div>
        ))}

        {/* Time slots */}
        {Array.from({ length: 14 }, (_, hourIndex) => {
          const hour = hourIndex + 6;
          return (
            <Fragment key={hour}>
              <div className="bg-gray-50 p-2 text-xs text-gray-500">
                {hour.toString().padStart(2, '0')}:00
              </div>
              {days.map((day, dayIndex) => (
                <div
                  key={`${dayIndex}-${hour}`}
                  className="border border-gray-200 p-1 min-h-[60px]"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => handleDrop(e, day, `${hour.toString().padStart(2, '0')}:00`)}
                >
                  {calendarEvents
                    .filter(event => {
                      const eventDate = new Date(event.start);
                      return eventDate.toDateString() === day.toDateString() &&
                             eventDate.getHours() === hour;
                    })
                    .map(event => (
                      <div
                        key={event.id}
                        className={`p-1 rounded text-xs cursor-pointer hover:shadow-md transition-shadow mb-1 relative ${getConflictBorderColor(event.conflictSeverity)}`}
                        style={{ backgroundColor: getJobColor(event.status, event.priority, event.hasConflict || !!event.availabilityIssue) }}
                        draggable
                        onDragStart={(e) => handleDragStart(e, event.job)}
                        onClick={() => handleJobClick(event.job)}
                      >
                        {event.hasConflict && event.conflictType && event.conflictSeverity && (
                          <div className="absolute top-0 right-0 -mt-1 -mr-1 z-10">
                            <ConflictBadge
                              type={event.conflictType}
                              severity={event.conflictSeverity}
                              size="sm"
                            />
                          </div>
                        )}
                        {event.availabilityIssue && !event.hasConflict && (
                          <div className="absolute top-0 right-0 -mt-1 -mr-1 z-10" title={event.availabilityIssue}>
                            <div className="w-3 h-3 bg-orange-500 rounded-full border border-white"></div>
                          </div>
                        )}
                        <div className={`font-medium text-white truncate ${(event.hasConflict || event.availabilityIssue) ? 'pr-4' : ''}`}>
                          {event.customer}
                        </div>
                        <div className="text-white/80 text-xs">
                          {event.technicianName}
                        </div>
                        {event.availabilityIssue && (
                          <div className="text-white/70 text-xs mt-0.5 italic truncate" title={event.availabilityIssue}>
                            ⚠️
                          </div>
                        )}
                        {event.isRecurring && (
                          <div className="absolute top-0 left-0 -mt-1 -ml-1 z-10" title="Recurring job">
                            <Repeat className="w-2 h-2 text-blue-300" />
                          </div>
                        )}
                      </div>
                    ))
                  }
                </div>
              ))}
            </Fragment>
          );
        })}
      </div>
    );
  };

  // Handle bulk selection toggle
  const handleBulkToggle = (jobId: string) => {
    if (!enableBulkSelection) return;
    
    const newSelection = new Set(selectedJobIds);
    if (newSelection.has(jobId)) {
      newSelection.delete(jobId);
    } else {
      newSelection.add(jobId);
    }
    setSelectedJobIds(newSelection);
    onBulkSelect?.(Array.from(newSelection));
  };

  // Render list view
  const renderListView = () => {
    const sortedJobs = [...filteredJobs].sort((a: any, b: any) => {
      const dateA = new Date(`${a.scheduled_date}T${a.scheduled_start_time || '00:00:00'}`);
      const dateB = new Date(`${b.scheduled_date}T${b.scheduled_start_time || '00:00:00'}`);
      return dateA.getTime() - dateB.getTime();
    });

    return (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {enableBulkSelection && (
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedJobIds.size === filteredJobs.length && filteredJobs.length > 0}
                    onChange={(e) => {
                      if (e.target.checked) {
                        const allIds = new Set(filteredJobs.map((j: any) => j.id));
                        setSelectedJobIds(allIds);
                        onBulkSelect?.(Array.from(allIds));
                      } else {
                        setSelectedJobIds(new Set());
                        onBulkSelect?.([]);
                      }
                    }}
                    className="rounded border-gray-300"
                  />
                </th>
              )}
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Job
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Technician
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date & Time
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Priority
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedJobs.length === 0 ? (
              <tr>
                <td colSpan={enableBulkSelection ? 8 : 7} className="px-3 py-2 text-center text-sm text-gray-500" style={{ height: 'var(--row-height, 44px)' }}>
                  No jobs found
                </td>
              </tr>
            ) : (
              sortedJobs.map((job: any) => {
                const technician = technicians.find((t: any) => (t.id || t.user_id) === job.technician_id);
                const technicianName = technician 
                  ? `${technician.first_name || ''} ${technician.last_name || ''}`.trim() || technician.email || 'Unknown'
                  : 'Unassigned';
                const isSelected = selectedJobIds.has(job.id);
                
                return (
                  <tr 
                    key={job.id} 
                    className={`hover:bg-gray-50 ${isSelected ? 'bg-blue-50' : ''}`}
                    style={{ height: 'var(--row-height, 44px)' }}
                  >
                    {enableBulkSelection && (
                      <td className="px-3 py-2 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleBulkToggle(job.id)}
                          className="rounded border-gray-300"
                        />
                      </td>
                    )}
                    <td className="px-3 py-2 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {job.service?.type || job.service_type || 'Service'}
                      </div>
                      <div className="text-sm text-gray-500">
                        {job.service?.description || job.description || 'No description'}
                      </div>
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {job.customer?.name || job.account?.name || 'Unknown'}
                      </div>
                      <div className="text-sm text-gray-500">
                        {job.location?.address || job.location_address || ''}
                      </div>
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{technicianName}</div>
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(job.scheduled_date).toLocaleDateString()}
                      </div>
                      <div className="text-sm text-gray-500">
                        {job.scheduled_start_time || '00:00'} - {job.scheduled_end_time || '00:00'}
                      </div>
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        job.status === 'completed' ? 'bg-green-100 text-green-800' :
                        job.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                        job.status === 'scheduled' ? 'bg-yellow-100 text-yellow-800' :
                        job.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {job.status || 'unknown'}
                      </span>
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        job.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                        job.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                        job.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {job.priority || 'medium'}
                      </span>
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedJob(job);
                            setShowJobDialog(true);
                            onJobSelect?.(job);
                          }}
                          className="text-blue-600 hover:text-blue-900"
                          title="View details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => {
                            handleJobEdit(job);
                          }}
                          className="text-gray-600 hover:text-gray-900"
                          title="Edit job"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    );
  };

  // Render month view
  const renderMonthView = () => {
    const startDate = getDateRangeStart(selectedDate, 'month');
    const endDate = getDateRangeEnd(selectedDate, 'month');
    const days = [];
    
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      days.push(new Date(d));
    }

    return (
      <div className="grid grid-cols-7 gap-1">
        {/* Day headers */}
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="bg-gray-50 p-2 text-center text-sm font-medium text-gray-700">
            {day}
          </div>
        ))}
        
        {/* Calendar days */}
        {days.map((day, index) => {
          const dayEvents = calendarEvents.filter(event => {
            const eventDate = new Date(event.start);
            return eventDate.toDateString() === day.toDateString();
          });

          return (
            <div
              key={index}
              className="border border-gray-200 p-2 min-h-[120px] hover:bg-gray-50"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => handleDrop(e, day, '09:00')}
            >
              <div className="text-sm font-medium text-gray-700 mb-1">
                {day.getDate()}
              </div>
              <div className="space-y-1">
                {dayEvents.map(event => (
                  <div
                    key={event.id}
                    className={`p-1 rounded text-xs cursor-pointer hover:shadow-md transition-shadow relative ${getConflictBorderColor(event.conflictSeverity)}`}
                    style={{ backgroundColor: getJobColor(event.status, event.priority, event.hasConflict || !!event.availabilityIssue) }}
                    draggable
                    onDragStart={(e) => handleDragStart(e, event.job)}
                    onClick={() => handleJobClick(event.job)}
                  >
                    {event.hasConflict && event.conflictType && event.conflictSeverity && (
                      <div className="absolute top-0 right-0 -mt-1 -mr-1 z-10">
                        <ConflictBadge
                          type={event.conflictType}
                          severity={event.conflictSeverity}
                          size="sm"
                        />
                      </div>
                    )}
                    {event.availabilityIssue && !event.hasConflict && (
                      <div className="absolute top-0 right-0 -mt-1 -mr-1 z-10" title={event.availabilityIssue}>
                        <div className="w-2 h-2 bg-orange-500 rounded-full border border-white"></div>
                      </div>
                    )}
                    <div className={`font-medium text-white truncate ${(event.hasConflict || event.availabilityIssue) ? 'pr-4' : ''}`}>
                      {event.customer}
                    </div>
                    <div className="text-white/80 text-xs">
                      {event.start.toLocaleTimeString('en-US', { 
                        hour: 'numeric', 
                        minute: '2-digit',
                        hour12: true 
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  if (jobsError) {
    return (
      <ErrorBoundary>
        <div className="bg-white rounded-lg shadow">
          <div className="text-center py-8">
            <AlertTriangle className="mx-auto h-12 w-12 text-red-500" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Error loading jobs</h3>
            <p className="mt-1 text-sm text-gray-500">
              {jobsError instanceof Error ? jobsError.message : 'Unknown error occurred'}
            </p>
          </div>
        </div>
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <div className="bg-white rounded-md shadow-sm relative">
        {/* Calendar Header */}
        <div className="border-b border-gray-200 p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h2 className="text-base font-semibold text-gray-900">
                {selectedDate.toLocaleDateString('en-US', { 
                  month: 'long', 
                  year: 'numeric' 
                })}
              </h2>
              <div className="flex space-x-2">
                <Button
                  variant={currentView === 'month' ? 'primary' : 'secondary'}
                  size="sm"
                  onClick={() => setCurrentView('month')}
                >
                  Month
                </Button>
                <Button
                  variant={currentView === 'week' ? 'primary' : 'secondary'}
                  size="sm"
                  onClick={() => setCurrentView('week')}
                >
                  Week
                </Button>
                <Button
                  variant={currentView === 'day' ? 'primary' : 'secondary'}
                  size="sm"
                  onClick={() => setCurrentView('day')}
                >
                  Day
                </Button>
                <Button
                  variant={currentView === 'list' ? 'primary' : 'secondary'}
                  size="sm"
                  onClick={() => setCurrentView('list')}
                >
                  List
                </Button>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  const newDate = new Date(selectedDate);
                  newDate.setDate(newDate.getDate() - (currentView === 'month' ? 30 : currentView === 'week' ? 7 : 1));
                  onDateChange?.(newDate);
                }}
              >
                ←
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  const newDate = new Date(selectedDate);
                  newDate.setDate(newDate.getDate() + (currentView === 'month' ? 30 : currentView === 'week' ? 7 : 1));
                  onDateChange?.(newDate);
                }}
              >
                →
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowCreateDialog(true);
                }}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Job
              </Button>
            </div>
          </div>
        </div>

        {/* Analytics Dashboard */}
        {showAnalytics && analyticsMode === 'dashboard' && (
          <div className="border-b border-gray-200 p-3">
            <SchedulingAnalytics 
              startDate={getDateRangeStart(selectedDate, currentView)}
              endDate={getDateRangeEnd(selectedDate, currentView)}
              onDateRangeChange={(start, end) => {
                // Update selected date if user changes range in analytics
                if (onDateChange) {
                  onDateChange(start);
                }
              }}
            />
          </div>
        )}

        {/* Calendar Body */}
        <div className={`p-3 ${showMap && mapMode === 'side' ? 'flex gap-3' : ''}`}>
          {showMap && mapMode === 'side' && (
            <div className="w-1/3">
              {/* Map will be rendered here */}
              <div className="bg-gray-100 rounded-lg h-full flex items-center justify-center text-gray-500">
                Map View (Side Mode)
              </div>
            </div>
          )}
          <div className={showMap && mapMode === 'side' ? 'flex-1' : ''}>
            {jobsLoading || techniciansLoading ? (
              <div className="flex items-center justify-center py-12">
                <LoadingSpinner text="Loading calendar..." />
              </div>
            ) : (
              <>
                {showAnalytics && analyticsMode === 'embedded' && (
                  <div className="mb-4">
                    <SchedulingAnalytics 
                      startDate={getDateRangeStart(selectedDate, currentView)}
                      endDate={getDateRangeEnd(selectedDate, currentView)}
                      onDateRangeChange={(start, end) => {
                        // Update selected date if user changes range in analytics
                        if (onDateChange) {
                          onDateChange(start);
                        }
                      }}
                    />
                  </div>
                )}
                {currentView === 'month' && renderMonthView()}
                {currentView === 'week' && renderWeekView()}
                {currentView === 'day' && (
                  <div className="space-y-2">
                    {renderTimeSlots(selectedDate)}
                  </div>
                )}
                {currentView === 'list' && renderListView()}
              </>
            )}
          </div>
        </div>

        {/* Map Overlay */}
        {showMap && mapMode === 'overlay' && (
          <div className="absolute top-0 right-0 w-1/3 h-full bg-white border-l border-gray-200 shadow-lg z-10 p-4">
            <div className="bg-gray-100 rounded-lg h-full flex items-center justify-center text-gray-500">
              Map View (Overlay Mode)
            </div>
          </div>
        )}

        {/* Job Details Dialog */}
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
                {selectedJob.is_recurring && selectedJob.recurring_template_id && (
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Repeat className="w-5 h-5 text-blue-600" />
                        <span className="text-sm font-medium text-blue-900">Recurring Job</span>
                      </div>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => {
                          setSelectedTemplateId(selectedJob.recurring_template_id!);
                          setShowSeriesManager(true);
                          setShowJobDialog(false);
                        }}
                      >
                        Manage Series
                      </Button>
                    </div>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Customer</label>
                    <p className="text-sm text-gray-900">
                      {selectedJob.customer?.name || 'Unknown'}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Status</label>
                    <p className="text-sm text-gray-900 capitalize">{selectedJob.status}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Priority</label>
                    <p className="text-sm text-gray-900 capitalize">{selectedJob.priority}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Service Type</label>
                    <p className="text-sm text-gray-900">
                      {selectedJob.service?.type || 'Unknown'}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Scheduled Date</label>
                    <p className="text-sm text-gray-900">
                      {new Date(selectedJob.scheduled_date).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Time Window</label>
                    <p className="text-sm text-gray-900">
                      {selectedJob.scheduled_start_time} - {selectedJob.scheduled_end_time}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Location</label>
                    <p className="text-sm text-gray-900">
                      {selectedJob.location?.address || 'Unknown'}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Technician</label>
                    <p className="text-sm text-gray-900">
                      {selectedJob.technician_id
                        ? (() => {
                            const tech = technicians.find(
                              (t) => (t.id || t.user_id) === selectedJob.technician_id
                            );
                            const first = tech?.first_name || '';
                            const last = tech?.last_name || '';
                            const fullName = `${first} ${last}`.trim();
                            return fullName || tech?.email || 'Unassigned';
                          })()
                        : 'Unassigned'}
                    </p>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700">Description</label>
                  <p className="text-sm text-gray-900">
                    {selectedJob.service?.description || selectedJob.job_description || 'No description'}
                  </p>
                </div>
              </div>
            )}
            
            <DialogFooter>
              <Button
                variant="secondary"
                onClick={() => setShowJobDialog(false)}
              >
                Close
              </Button>
              <Button
                variant="primary"
                onClick={() => selectedJob && handleJobEdit(selectedJob)}
              >
                <Edit className="h-4 w-4 mr-1" />
                Edit Job
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Job Creation Dialog */}
        <JobCreateDialog
          open={showCreateDialog}
          onClose={() => {
            setShowCreateDialog(false);
            setIsRecurring(false);
            setRecurrencePattern(null);
          }}
          selectedDate={selectedDate}
          onJobCreated={() => {
            queryClient.invalidateQueries({ queryKey: ['jobs'] });
            setShowCreateDialog(false);
            setIsRecurring(false);
            setRecurrencePattern(null);
          }}
        />

        {/* Recurring Series Manager Dialog */}
        {showSeriesManager && selectedTemplateId && (
          <Dialog open={showSeriesManager} onOpenChange={setShowSeriesManager}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <RecurringSeriesManager
                templateId={selectedTemplateId}
                onClose={() => {
                  setShowSeriesManager(false);
                  setSelectedTemplateId(null);
                }}
                onEdit={(templateId) => {
                  // TODO: Open edit dialog
                  logger.debug('Edit template requested', { templateId }, 'ScheduleCalendar');
                }}
              />
            </DialogContent>
          </Dialog>
        )}

        {/* Conflict Resolution Dialog */}
        {conflictData && (
          <ConflictResolutionDialog
            open={conflictDialogOpen}
            conflicts={conflictData.conflicts}
            canProceed={conflictData.canProceed}
            onProceed={handleConflictProceed}
            onCancel={handleConflictCancel}
            technicianName={draggedJob?.technician_id ? technicians.find((t: any) => (t.id || t.user_id) === draggedJob.technician_id)?.first_name + ' ' + technicians.find((t: any) => (t.id || t.user_id) === draggedJob.technician_id)?.last_name : undefined}
          />
        )}

        {/* Alert Panel */}
        <AlertPanel
          alerts={alerts}
          onAlertClick={(alert) => {
            if (alert.jobId) {
              const job = filteredJobs.find(j => j.id === alert.jobId);
              if (job) {
                setSelectedJob(job);
                setShowJobDialog(true);
              }
            }
          }}
          onDismiss={(alertId) => {
            setAlerts(prev => prev.filter(a => a.id !== alertId));
          }}
        />
      </div>
    </ErrorBoundary>
  );
};

// Job Creation Dialog Component
// Validation schema following best practices
const jobCreateSchema = z.object({
  customer_id: z.string().uuid('Please select a valid customer'),
  location_id: z.string().min(1, 'Location is required'),
  service_type: z.string().min(1, 'Service type is required'),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).default('medium'),
  scheduled_date: z.string().min(1, 'Scheduled date is required'),
  scheduled_start_time: z.string().min(1, 'Start time is required'),
  scheduled_end_time: z.string().min(1, 'End time is required'),
  technician_id: z.string().optional().or(z.literal('')),
  description: z.string().max(2000, 'Description must be less than 2000 characters').optional(),
});

type JobCreateFormData = z.infer<typeof jobCreateSchema>;

interface JobCreateDialogProps {
  open: boolean;
  onClose: () => void;
  selectedDate: Date;
  onJobCreated: () => void;
}

const JobCreateDialog: FC<JobCreateDialogProps> = ({
  open,
  onClose,
  selectedDate,
  onJobCreated,
}) => {
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurrencePattern, setRecurrencePattern] = useState<RecurrencePattern | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [customerLocations, setCustomerLocations] = useState<any[]>([]);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const queryClient = useQueryClient();

  // Use react-hook-form with zod validation
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset,
  } = useForm<JobCreateFormData>({
    resolver: zodResolver(jobCreateSchema),
    defaultValues: {
      customer_id: '',
      location_id: '',
      service_type: '',
      priority: 'medium',
      scheduled_date: selectedDate.toISOString().split('T')[0],
      scheduled_start_time: '09:00',
      scheduled_end_time: '10:00',
      technician_id: '',
      description: '',
    },
  });

  const watchedCustomerId = watch('customer_id');
  const watchedScheduledDate = watch('scheduled_date');
  const watchedStartTime = watch('scheduled_start_time');
  const watchedEndTime = watch('scheduled_end_time');

  // Update scheduled_date when selectedDate changes
  useEffect(() => {
    if (open) {
      setValue('scheduled_date', selectedDate.toISOString().split('T')[0]);
    }
  }, [selectedDate, open, setValue]);

  // Reset form when dialog closes
  useEffect(() => {
    if (!open) {
      reset({
        customer_id: '',
        location_id: '',
        service_type: '',
        priority: 'medium',
        scheduled_date: selectedDate.toISOString().split('T')[0],
        scheduled_start_time: '09:00',
        scheduled_end_time: '10:00',
        technician_id: '',
        description: '',
      });
      setIsRecurring(false);
      setRecurrencePattern(null);
      setSelectedCustomer(null);
      setCustomerLocations([]);
      setSubmitError(null);
    }
  }, [open, selectedDate, reset]);

  // Fetch locations when customer is selected
  useEffect(() => {
    if (watchedCustomerId && selectedCustomer) {
      const loadLocations = async () => {
        try {
          const locations = await enhancedApi.locations.getByCustomerId(watchedCustomerId);
          setCustomerLocations(locations || []);
          // Auto-select first location if available
          if (locations && locations.length > 0) {
            const currentLocationId = watch('location_id');
            if (!currentLocationId) {
              setValue('location_id', locations[0].id);
            }
          } else {
            setValue('location_id', '');
          }
        } catch (error) {
          logger.error('Error loading locations', error, 'ScheduleCalendar');
          setCustomerLocations([]);
          setValue('location_id', '');
        }
      };
      loadLocations();
    } else {
      setCustomerLocations([]);
      setValue('location_id', '');
    }
  }, [watchedCustomerId, selectedCustomer, setValue, watch]);

  // Fetch service types
  const { data: serviceTypesData } = useQuery({
    queryKey: ['service-types'],
    queryFn: () => enhancedApi.serviceTypes.getAll(),
    staleTime: 10 * 60 * 1000,
  });

  // Extract service types array from response
  const serviceTypes = serviceTypesData || [];
  
  // Fallback service types if API doesn't return data
  const defaultServiceTypes = [
    'General Pest Control',
    'Termite Treatment',
    'Rodent Control',
    'Bed Bug Treatment',
    'Wildlife Removal',
    'Inspection',
    'Maintenance'
  ];
  
  const availableServiceTypes = serviceTypes.length > 0 
    ? serviceTypes.map((st: any) => st.service_name || st.name)
    : defaultServiceTypes;

  // Fetch technicians
  const { data: technicians = [] } = useQuery({
    queryKey: ['technicians', 'active'],
    queryFn: async () => {
      if (enhancedApi.technicians && typeof enhancedApi.technicians.list === 'function') {
        return await enhancedApi.technicians.list();
      }
      return enhancedApi.users.list({ roles: ['technician'], status: 'active' });
    },
    staleTime: 10 * 60 * 1000,
  });

  // Create job mutation
  const createJobMutation = useMutation({
    mutationFn: async (jobData: JobCreateFormData) => {
      if (isRecurring && recurrencePattern) {
        // Create recurring template
        const customerName = selectedCustomer?.name || 'Job';
        const template = await enhancedApi.jobs.recurring.createTemplate({
          name: `Recurring: ${customerName}`,
          description: jobData.description || '',
          recurrence_type: recurrencePattern.recurrence_type,
          recurrence_interval: recurrencePattern.recurrence_interval,
          recurrence_days_of_week: recurrencePattern.recurrence_days_of_week,
          recurrence_day_of_month: recurrencePattern.recurrence_day_of_month,
          start_time: jobData.scheduled_start_time + ':00',
          end_time: jobData.scheduled_end_time + ':00',
          start_date: recurrencePattern.start_date,
          end_date: recurrencePattern.end_date,
          max_occurrences: recurrencePattern.max_occurrences,
          job_template: {
            customer_id: jobData.customer_id,
            location_id: jobData.location_id,
            service_type_id: jobData.service_type,
            priority: jobData.priority,
            technician_id: jobData.technician_id || null,
            notes: jobData.description || '',
          },
        });

        // Generate jobs for the next 3 months
        const generateUntil = new Date();
        generateUntil.setMonth(generateUntil.getMonth() + 3);
        await enhancedApi.jobs.recurring.generate(template.id, generateUntil.toISOString().split('T')[0]);

        return template;
      } else {
        // Create single job
        return await enhancedApi.jobs.create({
          account_id: jobData.customer_id,
          location_id: jobData.location_id,
          scheduled_date: jobData.scheduled_date,
          scheduled_start_time: jobData.scheduled_start_time,
          scheduled_end_time: jobData.scheduled_end_time,
          priority: jobData.priority,
          technician_id: jobData.technician_id || null,
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      queryClient.invalidateQueries({ queryKey: ['recurringTemplates'] });
      onJobCreated();
    },
    onError: (error: any) => {
      logger.error('Failed to create job', error, 'ScheduleCalendar');
      setSubmitError(error.message || 'Failed to create job. Please try again.');
    },
  });

  const onSubmit = (data: JobCreateFormData) => {
    setSubmitError(null);
    
    // Validate recurring pattern if needed
    if (isRecurring && (!recurrencePattern || (recurrencePattern.recurrence_type === 'weekly' && (!recurrencePattern.recurrence_days_of_week || recurrencePattern.recurrence_days_of_week.length === 0)))) {
      setSubmitError('Please configure the recurrence pattern');
      return;
    }
    
    createJobMutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (!isOpen) {
        onClose();
      }
    }}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Job</DialogTitle>
          <DialogDescription>
            Create a new job or recurring job series
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {submitError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-800">{submitError}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            {/* Customer Selection */}
            <div className="col-span-2">
              <Controller
                name="customer_id"
                control={control}
                render={({ field }) => (
                  <CustomerSearchSelector
                    value={field.value}
                    onChange={(customerId, customer) => {
                      field.onChange(customerId);
                      setSelectedCustomer(customer);
                      setValue('location_id', ''); // Reset location when customer changes
                    }}
                    label="Customer"
                    required
                    showSelectedBox={true}
                    apiSource="direct"
                    error={errors.customer_id?.message}
                    placeholder="Search customers..."
                  />
                )}
              />
            </div>

            {/* Location Selection */}
            <div>
              <Controller
                name="location_id"
                control={control}
                render={({ field }) => (
                  <>
                    <Label htmlFor="location_id">
                      Location {watchedCustomerId ? '*' : ''}
                    </Label>
                    {customerLocations.length > 0 ? (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        disabled={!watchedCustomerId}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select location" />
                        </SelectTrigger>
                        <SelectContent>
                          {customerLocations.map((location) => (
                            <SelectItem key={location.id} value={location.id}>
                              {location.name || location.address || `Location ${location.id.slice(0, 8)}`}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <Input
                        value={field.value}
                        onChange={(e) => field.onChange(e.target.value)}
                        placeholder={watchedCustomerId ? "No locations found - enter location ID" : "Select customer first"}
                        disabled={!watchedCustomerId}
                        error={errors.location_id?.message}
                      />
                    )}
                    {errors.location_id && (
                      <p className="text-sm text-red-600 mt-1">{errors.location_id.message}</p>
                    )}
                  </>
                )}
              />
            </div>

            {/* Service Type */}
            <div>
              <Controller
                name="service_type"
                control={control}
                render={({ field }) => (
                  <>
                    <Label htmlFor="service_type">Service Type</Label>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select service type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Select service type</SelectItem>
                        {availableServiceTypes.map((serviceType: string) => (
                          <SelectItem key={serviceType} value={serviceType}>
                            {serviceType}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.service_type && (
                      <p className="text-sm text-red-600 mt-1">{errors.service_type.message}</p>
                    )}
                  </>
                )}
              />
            </div>

            {/* Priority */}
            <div>
              <Controller
                name="priority"
                control={control}
                render={({ field }) => (
                  <>
                    <Label htmlFor="priority">Priority</Label>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  </>
                )}
              />
            </div>

            {/* Scheduled Date */}
            <div>
              <Controller
                name="scheduled_date"
                control={control}
                render={({ field }) => (
                  <>
                    <Label htmlFor="scheduled_date">Scheduled Date *</Label>
                    <Input
                      type="date"
                      value={field.value}
                      onChange={(e) => field.onChange(e.target.value)}
                      error={errors.scheduled_date?.message}
                    />
                    {errors.scheduled_date && (
                      <p className="text-sm text-red-600 mt-1">{errors.scheduled_date.message}</p>
                    )}
                  </>
                )}
              />
            </div>

            {/* Time Range */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Controller
                  name="scheduled_start_time"
                  control={control}
                  render={({ field }) => (
                    <>
                      <Label htmlFor="scheduled_start_time">Start Time</Label>
                      <Input
                        type="time"
                        value={field.value}
                        onChange={(e) => field.onChange(e.target.value)}
                        error={errors.scheduled_start_time?.message}
                      />
                      {errors.scheduled_start_time && (
                        <p className="text-sm text-red-600 mt-1">{errors.scheduled_start_time.message}</p>
                      )}
                    </>
                  )}
                />
              </div>
              <div>
                <Controller
                  name="scheduled_end_time"
                  control={control}
                  render={({ field }) => (
                    <>
                      <Label htmlFor="scheduled_end_time">End Time</Label>
                      <Input
                        type="time"
                        value={field.value}
                        onChange={(e) => field.onChange(e.target.value)}
                        error={errors.scheduled_end_time?.message}
                      />
                      {errors.scheduled_end_time && (
                        <p className="text-sm text-red-600 mt-1">{errors.scheduled_end_time.message}</p>
                      )}
                    </>
                  )}
                />
              </div>
            </div>

            {/* Technician */}
            <div>
              <Controller
                name="technician_id"
                control={control}
                render={({ field }) => (
                  <>
                    <Label htmlFor="technician_id">Technician</Label>
                    <Select
                      value={field.value || ''}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Unassigned" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Unassigned</SelectItem>
                        {technicians.map((tech: any) => (
                          <SelectItem key={tech.id || tech.user_id} value={tech.id || tech.user_id}>
                            {tech.first_name} {tech.last_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </>
                )}
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <Textarea
                  value={field.value || ''}
                  onChange={(e) => field.onChange(e.target.value)}
                  label="Description"
                  rows={3}
                  placeholder="Job description or notes"
                  error={errors.description?.message}
                />
              )}
            />
          </div>

          {/* Recurring Toggle */}
          <div className="p-4 bg-gray-50 rounded-md">
            <Checkbox
              id="is-recurring"
              checked={isRecurring}
              onChange={setIsRecurring}
              label="Make this a recurring job"
            />
          </div>

          {/* Recurrence Pattern Selector */}
          {isRecurring && (
            <div className="space-y-4">
              <RecurrencePatternSelector
                value={recurrencePattern || undefined}
                onChange={setRecurrencePattern}
                startDate={new Date(watchedScheduledDate)}
              />
              {recurrencePattern && (
                <RecurrencePreview
                  pattern={recurrencePattern}
                  startTime={watchedStartTime}
                  endTime={watchedEndTime}
                />
              )}
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={createJobMutation.isPending}
            >
              {createJobMutation.isPending ? 'Creating...' : isRecurring ? 'Create Recurring Series' : 'Create Job'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ScheduleCalendar;
