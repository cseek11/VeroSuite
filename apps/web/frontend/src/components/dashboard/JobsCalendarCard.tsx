import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Calendar, Search } from 'lucide-react';
import { ScheduleCalendar, type JobWithRelations } from '@/components/scheduling/ScheduleCalendar';
import PageCardManager from '@/components/dashboard/PageCardManager';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui';
import { enhancedApi } from '@/lib/enhanced-api';
import { DropZone, DraggableContent } from '@/routes/dashboard/components';
import { getCardInteractionRegistry } from '@/routes/dashboard/utils/CardInteractionRegistry';
import { CardConfig, DropZoneConfig, DragPayload, ActionResult } from '@/routes/dashboard/types/cardInteractions.types';
import { useAuthStore } from '@/stores/auth';
import { logger } from '@/utils/logger';

interface JobsCalendarCardProps {
  onJobSelect?: (job: JobWithRelations) => void;
  onJobEdit?: (job: JobWithRelations) => void;
  onJobCreate?: () => void;
  onClose?: () => void;
  className?: string;
  cardId?: string;
}

export default function JobsCalendarCard({
  onJobSelect,
  onJobEdit,
  onJobCreate,
  onClose,
  className = '',
  cardId = 'jobs-calendar'
}: JobsCalendarCardProps) {
  const { user } = useAuthStore();
  const [selectedDate, setSelectedDate] = useState(new Date());
  // Note: calendarView is managed by ScheduleCalendar component
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [selectedJob, setSelectedJob] = useState<JobWithRelations | null>(null);
  const [dropZoneConfig, setDropZoneConfig] = useState<DropZoneConfig | null>(null);

  // Register card for interactions
  useEffect(() => {
    const registry = getCardInteractionRegistry();
    
    // Create appointment action handler
    const createAppointmentHandler = async (payload: DragPayload): Promise<ActionResult> => {
      try {
        const customer = payload.data.entity;
        logger.debug('Creating appointment from customer drag', {
          customerId: customer.id,
          customerName: customer.name
        });

        // Store pending appointment data (for future use if needed)
        // setPendingAppointment({
        //   customer: customer,
        //   date: selectedDate.toISOString().split('T')[0]
        // });

        // Trigger job creation with customer pre-filled
        if (onJobCreate) {
          // Dispatch event that can be caught by parent
          const event = new CustomEvent('card-interaction:create-appointment', {
            detail: {
              customer: customer,
              date: selectedDate
            }
          });
          window.dispatchEvent(event);
          
          // Also call the onJobCreate callback if available
          onJobCreate();
        }

        return {
          success: true,
          message: `Opening appointment creation for ${customer.name}`,
          data: { customer, date: selectedDate }
        };
      } catch (error) {
        logger.error('Error creating appointment from customer', error);
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Failed to create appointment'
        };
      }
    };

    const config: DropZoneConfig = {
      cardId: cardId,
      cardType: 'jobs-calendar',
      accepts: {
        dataTypes: ['customer', 'job', 'workorder']
      },
      actions: {
        'create-appointment': {
          id: 'create-appointment',
          label: 'Create Appointment',
          icon: '📅',
          description: 'Schedule a new appointment for this customer',
          handler: createAppointmentHandler,
          requiresConfirmation: false
        },
        'reschedule': {
          id: 'reschedule',
          label: 'Reschedule Job',
          icon: '🔄',
          description: 'Reschedule an existing job to the selected date',
          handler: async (payload: DragPayload): Promise<ActionResult> => {
            try {
              if (payload.sourceDataType !== 'job' || !payload.data?.entity) {
                return {
                  success: false,
                  error: 'Invalid data type. Expected job data.'
                };
              }

              const job = payload.data.entity;
              
              logger.debug('Rescheduling job from drag', {
                jobId: job.id,
                currentDate: job.scheduled_date,
                newDate: selectedDate.toISOString().split('T')[0]
              });

              // Update job with new scheduled date
              try {
                const newDate = selectedDate.toISOString().split('T')[0];
                if (!newDate) {
                  return {
                    success: false,
                    error: 'Invalid date selected'
                  };
                }
                
                const updateData: any = {
                  scheduled_date: newDate
                };
                
                if (job.scheduled_start_time) {
                  updateData.scheduled_start_time = job.scheduled_start_time;
                } else {
                  updateData.scheduled_start_time = '09:00:00';
                }
                
                if (job.scheduled_end_time) {
                  updateData.scheduled_end_time = job.scheduled_end_time;
                }
                
                await enhancedApi.jobs.update(job.id, updateData);

                logger.info('Job rescheduled successfully', {
                  jobId: job.id,
                  newDate: selectedDate.toISOString().split('T')[0]
                });

                return {
                  success: true,
                  message: `Job rescheduled to ${selectedDate.toLocaleDateString()}`,
                  data: { 
                    jobId: job.id, 
                    newDate: selectedDate.toISOString().split('T')[0] 
                  }
                };
              } catch (error) {
                logger.error('Failed to reschedule job', { error, jobId: job.id });
                return {
                  success: false,
                  error: error instanceof Error ? error.message : 'Failed to reschedule job'
                };
              }
            } catch (error) {
              logger.error('Error rescheduling job from drag', error);
              return {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to reschedule job'
              };
            }
          },
          requiresConfirmation: true,
          confirmationMessage: 'Are you sure you want to reschedule this job to the selected date?'
        }
      },
      dropZoneStyle: {
        highlightColor: '#6366f1',
        borderStyle: 'dashed',
        backgroundColor: 'rgba(99, 102, 241, 0.05)'
      }
    };

    const cardConfig: CardConfig = {
      id: cardId,
      type: 'jobs-calendar',
      dropZones: [config]
    };

    setDropZoneConfig(config);
    registry.registerCard(cardConfig);
    logger.debug('Registered Jobs Calendar Card for interactions', { cardId });

    // Listen for appointment creation events
    const handleAppointmentEvent = (_event: CustomEvent) => {
      // const { customer, date } = _event.detail;
      // Store pending appointment data if needed in the future
      // setPendingAppointment({ customer, date });
      if (onJobCreate) {
        onJobCreate();
      }
    };

    window.addEventListener('card-interaction:create-appointment', handleAppointmentEvent as EventListener);

    return () => {
      registry.unregisterCard(cardId);
      window.removeEventListener('card-interaction:create-appointment', handleAppointmentEvent as EventListener);
    };
  }, [cardId, selectedDate, onJobCreate, user]);

  // Note: Jobs are fetched by ScheduleCalendar component to avoid duplicate queries
  // We'll fetch jobs here only for statistics and filtering
  const { data: allJobs = [], error: jobsError } = useQuery({
    queryKey: ['jobs', 'calendar', 'all'],
    queryFn: async () => {
      // Fetch a wider date range for statistics
      const startDate = new Date();
      startDate.setMonth(startDate.getMonth() - 1);
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + 1);
      
      const startDateStr = startDate.toISOString().split('T')[0];
      const endDateStr = endDate.toISOString().split('T')[0];
      
      if (!startDateStr || !endDateStr) {
        throw new Error('Invalid date range');
      }
      
      return enhancedApi.jobs.getByDateRange(startDateStr, endDateStr);
    },
    staleTime: 5 * 60 * 1000, // 5 minutes - longer cache for stats
  });

  // Filter jobs based on search and filters (for statistics only)
  const filteredJobs = allJobs.filter((job: any) => {
    const matchesSearch = searchQuery === '' || 
      job.customer?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.service?.type?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.location?.address?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || job.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || job.priority === filterPriority;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  // Handle job selection
  const handleJobSelect = (job: JobWithRelations) => {
    setSelectedJob(job);
    onJobSelect?.(job);
  };

  // Handle job edit
  const handleJobEdit = (job: JobWithRelations) => {
    setSelectedJob(job);
    onJobEdit?.(job);
  };

  // Handle job create - open a modal or navigate to job creation
  const handleJobCreate = () => {
    if (onJobCreate) {
      onJobCreate();
    } else {
      // Fallback: try to open job creation dialog or navigate
      logger.info('Job creation requested', { selectedDate });
      // You can add a modal here or navigate to job creation page
      // For now, we'll dispatch an event that can be caught by parent
      const event = new CustomEvent('jobs-calendar:create-job', {
        detail: { date: selectedDate }
      });
      window.dispatchEvent(event);
    }
  };

  // Get job statistics
  const getJobStats = () => {
    const total = filteredJobs.length;
    const completed = filteredJobs.filter(job => job.status === 'completed').length;
    const inProgress = filteredJobs.filter(job => job.status === 'in_progress').length;
    const scheduled = filteredJobs.filter((job: any) => job.status === 'scheduled' || job.status === 'assigned').length;
    const unassigned = filteredJobs.filter(job => job.status === 'unassigned').length;

    return { total, completed, inProgress, scheduled, unassigned };
  };

  const stats = getJobStats();

  return (
    <PageCardManager
      cardId={cardId || 'jobs-calendar'}
      cardType="jobs-calendar"
      {...(onClose && { onClose })}
      className={className}
    >
      <div className="h-full w-full flex flex-col p-6">
        {jobsError && (
          <div className="text-center py-8">
            <div className="text-red-500 mb-2">⚠️ Error loading jobs</div>
            <div className="text-sm text-gray-500">
              {jobsError instanceof Error ? jobsError.message : 'Unknown error occurred'}
            </div>
          </div>
        )}
        
        {!jobsError && (
          <>
            {/* Header - Simplified: Remove redundant buttons (calendar has its own) */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Calendar className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Jobs Calendar</h3>
                  <p className="text-sm text-gray-500">
                    {selectedDate.toLocaleDateString('en-US', { 
                      month: 'long', 
                      year: 'numeric' 
                    })}
                  </p>
                </div>
              </div>
            </div>

            {/* Statistics */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
          <div className="text-xs text-gray-500">Total</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
          <div className="text-xs text-gray-500">Completed</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">{stats.inProgress}</div>
          <div className="text-xs text-gray-500">In Progress</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-yellow-600">{stats.scheduled}</div>
          <div className="text-xs text-gray-500">Scheduled</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-600">{stats.unassigned}</div>
          <div className="text-xs text-gray-500">Unassigned</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-4 mb-6">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search jobs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="unassigned">Unassigned</SelectItem>
            <SelectItem value="scheduled">Scheduled</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={filterPriority} onValueChange={setFilterPriority}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priority</SelectItem>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="urgent">Urgent</SelectItem>
          </SelectContent>
        </Select>
        
        {/* View selector removed - ScheduleCalendar has its own view controls */}
      </div>

      {/* Calendar - Wrapped in DropZone */}
      {dropZoneConfig && (
        <DropZone
          cardId={cardId}
          dropZoneConfig={dropZoneConfig}
          onDrop={(payload, result) => {
          if (result.success) {
            logger.info('Action completed from drag-and-drop', {
              actionId: result.data?.actionId,
              customerId: payload.data?.id,
              jobId: payload.data?.id
            });
            // Refresh jobs if rescheduled
            if (result.data?.actionId === 'reschedule') {
              // The query will automatically refetch due to invalidation
            }
          }
        }}
        >
          <div className="bg-white rounded-lg border border-gray-200">
            <ScheduleCalendar
              selectedDate={selectedDate}
              onDateChange={setSelectedDate}
              onJobSelect={handleJobSelect as unknown as (job: any) => void}
              onJobEdit={handleJobEdit as unknown as (job: any) => void}
              onJobCreate={handleJobCreate}
              searchQuery={searchQuery}
              filterStatus={filterStatus}
              filterPriority={filterPriority}
            />
            {/* Debug: Log search state */}
            {searchQuery && (
              <div className="text-xs text-gray-500 mt-2">
                Searching for: "{searchQuery}"
              </div>
            )}
          </div>
        </DropZone>
      )}

      {/* Selected Job Details - Make job draggable */}
      {selectedJob && (
        <DraggableContent
          cardId={cardId}
          dataType="job"
          data={selectedJob}
          className="mt-6"
        >
          <div className="p-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 hover:border-blue-400 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-gray-900">Selected Job (Drag to assign or reschedule)</h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedJob(null)}
              >
                ×
              </Button>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-gray-500">Customer</div>
                <div className="font-medium">{selectedJob.customer?.name ?? 'Unknown'}</div>
              </div>
              <div>
                <div className="text-gray-500">Service</div>
                <div className="font-medium">{selectedJob.service?.type ?? 'Unknown'}</div>
              </div>
            <div>
              <div className="text-gray-500">Status</div>
              <div className="font-medium capitalize">{selectedJob.status}</div>
            </div>
            <div>
              <div className="text-gray-500">Priority</div>
              <div className="font-medium capitalize">{selectedJob.priority}</div>
            </div>
            <div>
              <div className="text-gray-500">Scheduled</div>
              <div className="font-medium">
                {new Date(selectedJob.scheduled_date).toLocaleDateString()}
              </div>
            </div>
            <div>
              <div className="text-gray-500">Time</div>
              <div className="font-medium">
                {selectedJob.scheduled_start_time} - {selectedJob.scheduled_end_time}
              </div>
            </div>
          </div>
          
            <div className="mt-3 flex space-x-2">
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleJobEdit(selectedJob)}
              >
                Edit Job
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setSelectedJob(null)}
              >
                Close
              </Button>
            </div>
          </div>
        </DraggableContent>
      )}
      </>
      )}
      </div>
    </PageCardManager>
  );
}
