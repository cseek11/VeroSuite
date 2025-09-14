import React, { useState, useEffect, useMemo } from 'react';
import { useJobs, useCreateJob, useUpdateJob, useDeleteJob } from '@/hooks/useJobs';
import { useWorkOrders } from '@/hooks/useWorkOrders';
import { useTechnicians } from '@/hooks/useTechnicians';
import { Job, CreateJobRequest, UpdateJobRequest } from '@/types/jobs';
import { WorkOrder } from '@/types/work-orders';
import { 
  Calendar, 
  Clock, 
  User, 
  Plus, 
  Edit, 
  Trash2, 
  MapPin,
  Phone,
  Mail,
  ChevronLeft,
  ChevronRight,
  Filter,
  Search,
  Grid,
  List,
  Eye
} from 'lucide-react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/Dialog';

interface JobSchedulerProps {
  onJobSelect?: (job: Job) => void;
  onJobEdit?: (job: Job) => void;
  onJobCreate?: (workOrder: WorkOrder) => void;
}

type ViewMode = 'month' | 'week' | 'day' | 'list';

export default function JobScheduler({
  onJobSelect,
  onJobEdit,
  onJobCreate
}: JobSchedulerProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>('month');
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [showJobDialog, setShowJobDialog] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedWorkOrder, setSelectedWorkOrder] = useState<WorkOrder | null>(null);
  const [filterTechnician, setFilterTechnician] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');

  const { data: jobs, isLoading: jobsLoading, refetch: refetchJobs } = useJobs();
  const { data: workOrders } = useWorkOrders({ status: 'pending' });
  const { data: technicians } = useTechnicians();
  
  const createJobMutation = useCreateJob();
  const updateJobMutation = useUpdateJob();
  const deleteJobMutation = useDeleteJob();

  // Filter jobs based on search and technician filter
  const filteredJobs = useMemo(() => {
    if (!jobs) return [];
    
    return jobs.filter(job => {
      const matchesSearch = !searchTerm || 
        job.work_order?.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.technician?.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.technician?.last_name?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesTechnician = !filterTechnician || job.technician_id === filterTechnician;
      
      return matchesSearch && matchesTechnician;
    });
  }, [jobs, searchTerm, filterTechnician]);

  // Get jobs for a specific date
  const getJobsForDate = (date: Date) => {
    return filteredJobs.filter(job => {
      const jobDate = new Date(job.scheduled_date);
      return jobDate.toDateString() === date.toDateString();
    });
  };

  // Get days in month for calendar view
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

  // Get week days for week view
  const getWeekDays = (date: Date) => {
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay());
    
    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      days.push(day);
    }
    
    return days;
  };

  // Navigate calendar
  const navigateDate = (direction: number) => {
    const newDate = new Date(currentDate);
    
    switch (viewMode) {
      case 'month':
        newDate.setMonth(newDate.getMonth() + direction);
        break;
      case 'week':
        newDate.setDate(newDate.getDate() + (direction * 7));
        break;
      case 'day':
        newDate.setDate(newDate.getDate() + direction);
        break;
    }
    
    setCurrentDate(newDate);
  };

  // Handle job creation from work order
  const handleCreateJobFromWorkOrder = async (workOrder: WorkOrder) => {
    try {
      const jobData: CreateJobRequest = {
        work_order_id: workOrder.id,
        technician_id: workOrder.assigned_to || '',
        scheduled_date: workOrder.scheduled_date || new Date().toISOString(),
        scheduled_start_time: '09:00',
        scheduled_end_time: '17:00',
        status: 'scheduled',
        notes: `Job created from work order: ${workOrder.description}`
      };

      await createJobMutation.mutateAsync(jobData);
      setShowCreateDialog(false);
      setSelectedWorkOrder(null);
      refetchJobs();
    } catch (error) {
      console.error('Failed to create job:', error);
    }
  };

  // Handle job deletion
  const handleDeleteJob = async (job: Job) => {
    try {
      await deleteJobMutation.mutateAsync(job.id);
      setShowJobDialog(false);
      setSelectedJob(null);
      refetchJobs();
    } catch (error) {
      console.error('Failed to delete job:', error);
    }
  };

  // Format time
  const formatTime = (timeString: string) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  // Format date
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Get job status color
  const getJobStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'canceled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (jobsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner text="Loading jobs..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Job Scheduler</h1>
          <p className="text-gray-600">Manage and schedule technician jobs</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setShowCreateDialog(true)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Create Job
          </Button>
        </div>
      </div>

      {/* Controls */}
      <Card className="p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Date Navigation */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateDate(-1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="text-center min-w-[200px]">
              <h2 className="text-lg font-semibold">
                {viewMode === 'month' && currentDate.toLocaleDateString('en-US', { 
                  month: 'long', 
                  year: 'numeric' 
                })}
                {viewMode === 'week' && `Week of ${getWeekDays(currentDate)[0].toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric' 
                })}`}
                {viewMode === 'day' && currentDate.toLocaleDateString('en-US', { 
                  weekday: 'long',
                  month: 'long', 
                  day: 'numeric',
                  year: 'numeric'
                })}
              </h2>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateDate(1)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
            {(['month', 'week', 'day', 'list'] as ViewMode[]).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  viewMode === mode
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {mode.charAt(0).toUpperCase() + mode.slice(1)}
              </button>
            ))}
          </div>

          {/* Search and Filters */}
          <div className="flex-1 flex items-center gap-2">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search jobs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={filterTechnician}
              onChange={(e) => setFilterTechnician(e.target.value)}
              className="crm-input"
            >
              <option value="">All Technicians</option>
              {technicians?.map((tech) => (
                <option key={tech.id} value={tech.id}>
                  {tech.first_name} {tech.last_name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* Calendar/List View */}
      {viewMode === 'list' ? (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Job
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Technician
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredJobs.map((job) => (
                  <tr key={job.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {job.work_order?.description || 'No description'}
                      </div>
                      <div className="text-sm text-gray-500">
                        Job #{job.id.slice(-8)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {job.technician ? `${job.technician.first_name} ${job.technician.last_name}` : 'Unassigned'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatDate(new Date(job.scheduled_date))}
                      </div>
                      <div className="text-sm text-gray-500">
                        {formatTime(job.scheduled_start_time)} - {formatTime(job.scheduled_end_time)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getJobStatusColor(job.status)}`}>
                        {job.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedJob(job);
                            setShowJobDialog(true);
                          }}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => onJobEdit?.(job)}
                          className="text-gray-600 hover:text-gray-900"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      ) : (
        <Card className="p-6">
          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {/* Day headers */}
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center font-semibold text-gray-600 p-2 text-sm">
                {day}
              </div>
            ))}
            
            {/* Calendar days */}
            {getDaysInMonth(currentDate).map((date, index) => {
              const dayJobs = getJobsForDate(date);
              const isCurrentMonth = date.getMonth() === currentDate.getMonth();
              const isToday = date.toDateString() === new Date().toDateString();
              
              return (
                <div 
                  key={index} 
                  className={`border rounded p-2 min-h-[120px] ${
                    isCurrentMonth ? 'bg-white' : 'bg-gray-50'
                  } ${!isCurrentMonth ? 'text-gray-400' : ''} ${
                    isToday ? 'bg-blue-50 border-blue-200' : ''
                  }`}
                >
                  <div className={`text-sm font-medium mb-1 ${
                    isToday ? 'text-blue-600' : ''
                  }`}>
                    {date.getDate()}
                  </div>
                  <div className="space-y-1">
                    {dayJobs.slice(0, 3).map(job => (
                      <div 
                        key={job.id}
                        className="text-xs p-1 rounded cursor-pointer text-white bg-blue-500 hover:bg-blue-600"
                        onClick={() => {
                          setSelectedJob(job);
                          setShowJobDialog(true);
                        }}
                      >
                        <div className="truncate">
                          {job.work_order?.description || 'No description'}
                        </div>
                        <div className="text-xs opacity-75">
                          {formatTime(job.scheduled_start_time)} - {job.technician?.first_name}
                        </div>
                      </div>
                    ))}
                    {dayJobs.length > 3 && (
                      <div className="text-xs text-gray-500 text-center">
                        +{dayJobs.length - 3} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
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
            <div className="space-y-6">
              {/* Job Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {selectedJob.work_order?.description || 'No description'}
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Status</label>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getJobStatusColor(selectedJob.status)}`}>
                      {selectedJob.status}
                    </span>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Scheduled Date</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {formatDate(new Date(selectedJob.scheduled_date))}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Time</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {formatTime(selectedJob.scheduled_start_time)} - {formatTime(selectedJob.scheduled_end_time)}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  {selectedJob.technician && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Technician</label>
                      <div className="mt-1">
                        <p className="text-sm text-gray-900">
                          {selectedJob.technician.first_name} {selectedJob.technician.last_name}
                        </p>
                        {selectedJob.technician.email && (
                          <p className="text-sm text-gray-500 flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {selectedJob.technician.email}
                          </p>
                        )}
                        {selectedJob.technician.phone && (
                          <p className="text-sm text-gray-500 flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {selectedJob.technician.phone}
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {selectedJob.work_order?.account && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Customer</label>
                      <div className="mt-1">
                        <p className="text-sm text-gray-900">
                          {selectedJob.work_order.account.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {selectedJob.work_order.account.account_type}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {selectedJob.notes && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Notes</label>
                  <div className="mt-1 p-3 bg-gray-50 rounded-md">
                    <p className="text-sm text-gray-900 whitespace-pre-wrap">{selectedJob.notes}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowJobDialog(false)}
            >
              Close
            </Button>
            <Button
              variant="outline"
              onClick={() => selectedJob && onJobEdit?.(selectedJob)}
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Job
            </Button>
            <Button
              variant="danger"
              onClick={() => selectedJob && handleDeleteJob(selectedJob)}
              disabled={deleteJobMutation.isPending}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              {deleteJobMutation.isPending ? 'Deleting...' : 'Delete Job'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Job Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create Job from Work Order</DialogTitle>
            <DialogDescription>
              Select a work order to create a scheduled job
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="max-h-96 overflow-y-auto">
              {workOrders?.data?.map((workOrder) => (
                <div
                  key={workOrder.id}
                  className="p-4 border border-gray-200 rounded-md hover:bg-gray-50 cursor-pointer"
                  onClick={() => setSelectedWorkOrder(workOrder)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">{workOrder.description}</h3>
                      <p className="text-sm text-gray-600">
                        Customer: {workOrder.account?.name || 'Unknown'}
                      </p>
                      <p className="text-sm text-gray-500">
                        Priority: {workOrder.priority} | Status: {workOrder.status}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCreateJobFromWorkOrder(workOrder);
                      }}
                      disabled={createJobMutation.isPending}
                    >
                      {createJobMutation.isPending ? 'Creating...' : 'Create Job'}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowCreateDialog(false)}
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}






