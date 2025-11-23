import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Checkbox from '@/components/ui/Checkbox';
import { Heading, Text } from '@/components/ui';
import {
  Calendar,
  Clock,
  MapPin,
  CheckCircle,
  Loader2,
  Search,
  UserCheck,
  X,
  ArrowRight
} from 'lucide-react';
import { enhancedApi } from '@/lib/enhanced-api';
import { logger } from '@/utils/logger';
import { ConflictResolutionDialog } from '@/components/dashboard/ConflictResolutionDialog';
import { ScheduleCalendar } from './ScheduleCalendar';

interface Job {
  id: string;
  scheduled_date: string;
  scheduled_start_time?: string;
  scheduled_end_time?: string;
  technician_id?: string;
  status: string;
  priority: string;
  customer: {
    id: string;
    name: string;
  };
  location: {
    address: string;
  };
  service: {
    description: string;
    estimated_duration: number;
  };
}

interface Technician {
  id: string;
  first_name: string;
  last_name: string;
  is_active: boolean;
}

interface BulkSchedulerProps {
  selectedDate?: Date;
  onComplete?: () => void;
  onCancel?: () => void;
}

export default function BulkScheduler({ 
  selectedDate = new Date(),
  onComplete,
  onCancel 
}: BulkSchedulerProps) {
  const [selectedJobs, setSelectedJobs] = useState<Set<string>>(new Set());
  const [selectedTechnician, setSelectedTechnician] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showConflictDialog, setShowConflictDialog] = useState(false);
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
  const [pendingAssignments, setPendingAssignments] = useState<Array<{
    jobId: string;
    technicianId: string;
  }>>([]);

  const queryClient = useQueryClient();

  // Fetch jobs for the selected date
  const { data: jobs = [], isLoading: jobsLoading } = useQuery({
    queryKey: ['jobs', 'bulk-scheduler', selectedDate],
    queryFn: async () => {
      const dateStr = selectedDate.toISOString().split('T')[0];
      return enhancedApi.jobs.getByDateRange(dateStr, dateStr);
    },
  });

  // Fetch technicians
  const { data: technicians = [], isLoading: techniciansLoading } = useQuery({
    queryKey: ['technicians', 'active'],
    queryFn: async () => {
      if (enhancedApi.technicians && typeof enhancedApi.technicians.list === 'function') {
        return await enhancedApi.technicians.list();
      }
      return enhancedApi.users.list({ 
        roles: ['technician'], 
        status: 'active' 
      });
    },
  });

  // Filter jobs
  const filteredJobs = useMemo(() => {
    return jobs.filter((job: Job) => {
      const matchesSearch = job.customer?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           job.service?.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           job.location?.address?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === 'all' || 
                           (filterStatus === 'unassigned' && !job.technician_id) ||
                           (filterStatus === 'assigned' && !!job.technician_id) ||
                           job.status === filterStatus;
      return matchesSearch && matchesStatus;
    });
  }, [jobs, searchTerm, filterStatus]);

  // Bulk assignment mutation
  const bulkAssignMutation = useMutation({
    mutationFn: async (assignments: Array<{ jobId: string; technicianId: string }>) => {
      const results = await Promise.allSettled(
        assignments.map(({ jobId, technicianId }) =>
          enhancedApi.jobs.update(jobId, {
            technician_id: technicianId,
            status: 'scheduled'
          })
        )
      );

      const successful = results.filter(r => r.status === 'fulfilled').length;
      const failed = results.filter(r => r.status === 'rejected').length;

      return { successful, failed, total: assignments.length };
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      logger.info('Bulk assignment completed', result, 'BulkScheduler');
      setSelectedJobs(new Set());
      setSelectedTechnician(null);
      onComplete?.();
    },
    onError: (error) => {
      logger.error('Bulk assignment failed', error, 'BulkScheduler');
    }
  });

  // Check conflicts for bulk assignment
  const checkBulkConflicts = async () => {
    if (!selectedTechnician || selectedJobs.size === 0) return;

    const jobsToCheck = filteredJobs.filter((job: Job) => selectedJobs.has(job.id));
    const conflicts: Array<{
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
    }> = [];

    let canProceed = true;

    // Check conflicts for each job
    for (const job of jobsToCheck) {
      if (job.scheduled_date && job.scheduled_start_time && job.scheduled_end_time) {
        try {
          const conflictResult = await enhancedApi.jobs.checkConflicts(
            selectedTechnician,
            job.scheduled_date,
            job.scheduled_start_time,
            job.scheduled_end_time,
            Array.from(selectedJobs) // Exclude all selected jobs
          );

          if (conflictResult.has_conflicts) {
            conflicts.push(...conflictResult.conflicts);
            if (!conflictResult.can_proceed) {
              canProceed = false;
            }
          }
        } catch (error) {
          logger.warn('Failed to check conflicts for job', { jobId: job.id, error }, 'BulkScheduler');
        }
      }
    }

    if (conflicts.length > 0) {
      setConflictData({ conflicts, canProceed });
      setShowConflictDialog(true);
    } else {
      // No conflicts, proceed with assignment
      handleBulkAssign();
    }
  };

  // Handle bulk assignment
  const handleBulkAssign = () => {
    if (!selectedTechnician || selectedJobs.size === 0) return;

    const assignments = Array.from(selectedJobs).map(jobId => ({
      jobId,
      technicianId: selectedTechnician
    }));

    setPendingAssignments(assignments);
    bulkAssignMutation.mutate(assignments);
  };

  // Handle conflict proceed
  const handleConflictProceed = () => {
    setShowConflictDialog(false);
    handleBulkAssign();
    setConflictData(null);
  };

  // Handle conflict cancel
  const handleConflictCancel = () => {
    setShowConflictDialog(false);
    setConflictData(null);
  };

  // Toggle job selection
  const toggleJobSelection = (jobId: string) => {
    const newSelection = new Set(selectedJobs);
    if (newSelection.has(jobId)) {
      newSelection.delete(jobId);
    } else {
      newSelection.add(jobId);
    }
    setSelectedJobs(newSelection);
  };

  // Select all jobs
  const selectAllJobs = () => {
    setSelectedJobs(new Set(filteredJobs.map((job: Job) => job.id)));
  };

  // Clear selection
  const clearSelection = () => {
    setSelectedJobs(new Set());
  };

  const selectedTechnicianData = technicians.find((t: any) => (t.id || t.user_id) === selectedTechnician);

  // Handle bulk selection from ScheduleCalendar
  const handleBulkSelect = (jobIds: string[]) => {
    setSelectedJobs(new Set(jobIds));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Heading level={1} className="font-bold text-gray-900">
            Bulk Job Assignment
          </Heading>
          <Text className="text-gray-600 mt-1">
            Assign multiple jobs to technicians at once
          </Text>
        </div>
        <div className="flex space-x-2">
          {selectedJobs.size > 0 && (
            <Button variant="outline" onClick={clearSelection}>
              Clear ({selectedJobs.size})
            </Button>
          )}
          {onCancel && (
            <Button variant="outline" onClick={onCancel} icon={X}>
              Cancel
            </Button>
          )}
        </div>
      </div>

      {/* Schedule Calendar with bulk selection */}
      <Card className="mb-6">
        <ScheduleCalendar
          selectedDate={selectedDate}
          onDateChange={() => {
            // Date change handled by parent if needed
          }}
          searchQuery={searchTerm}
          filterStatus={filterStatus}
          filterPriority="all"
          filterTechnician={selectedTechnician || undefined}
          enableBulkSelection={true}
          onBulkSelect={handleBulkSelect}
          showAnalytics={false}
          showMap={false}
        />
      </Card>

      {/* Selection Summary */}
      {selectedJobs.size > 0 && (
        <Card className="bg-purple-50 border-purple-200">
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <UserCheck className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <Text className="font-semibold text-purple-900">
                    {selectedJobs.size} job{selectedJobs.size !== 1 ? 's' : ''} selected
                  </Text>
                  <Text className="text-sm text-purple-700">
                    {selectedTechnicianData 
                      ? `Assigning to ${selectedTechnicianData.first_name} ${selectedTechnicianData.last_name}`
                      : 'Select a technician to assign'}
                  </Text>
                </div>
              </div>
              {selectedTechnician && (
                <Button
                  variant="primary"
                  onClick={checkBulkConflicts}
                  disabled={bulkAssignMutation.isPending}
                  icon={ArrowRight}
                >
                  {bulkAssignMutation.isPending ? 'Assigning...' : 'Assign Jobs'}
                </Button>
              )}
            </div>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Jobs List */}
        <div className="lg:col-span-2 space-y-4">
          {/* Filters */}
          <Card>
            <div className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search jobs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="all">All Jobs</option>
                  <option value="unassigned">Unassigned</option>
                  <option value="assigned">Assigned</option>
                  <option value="scheduled">Scheduled</option>
                </select>
                <Button variant="outline" onClick={selectAllJobs} size="sm">
                  Select All
                </Button>
              </div>
            </div>
          </Card>

          {/* Jobs List */}
          <Card>
            <div className="p-4">
              {jobsLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
                  <span className="ml-3 text-gray-600">Loading jobs...</span>
                </div>
              ) : filteredJobs.length === 0 ? (
                <div className="text-center py-12">
                  <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <Text className="text-gray-500 mb-2">No jobs found</Text>
                  <Text className="text-gray-400 text-sm">
                    {searchTerm || filterStatus !== 'all' 
                      ? 'Try adjusting your filters'
                      : `No jobs scheduled for ${selectedDate.toLocaleDateString()}`}
                  </Text>
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredJobs.map((job: Job) => (
                    <div
                      key={job.id}
                      className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                        selectedJobs.has(job.id)
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-gray-200 hover:border-purple-300'
                      }`}
                      onClick={() => toggleJobSelection(job.id)}
                    >
                      <div className="flex items-start space-x-3">
                        <Checkbox
                          checked={selectedJobs.has(job.id)}
                          onChange={() => toggleJobSelection(job.id)}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <Text className="font-semibold">{job.customer?.name || 'Unknown Customer'}</Text>
                              {job.technician_id && (
                                <span className="px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded-full">
                                  Assigned
                                </span>
                              )}
                              {job.priority && (
                                <span className={`px-2 py-0.5 text-xs rounded-full ${
                                  job.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                                  job.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                                  job.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-gray-100 text-gray-800'
                                }`}>
                                  {job.priority}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="space-y-1 text-sm text-gray-600">
                            <div className="flex items-center space-x-4">
                              {job.scheduled_date && (
                                <span className="flex items-center">
                                  <Calendar className="w-3 h-3 mr-1" />
                                  {new Date(job.scheduled_date).toLocaleDateString()}
                                </span>
                              )}
                              {job.scheduled_start_time && job.scheduled_end_time && (
                                <span className="flex items-center">
                                  <Clock className="w-3 h-3 mr-1" />
                                  {job.scheduled_start_time} - {job.scheduled_end_time}
                                </span>
                              )}
                              {job.location?.address && (
                                <span className="flex items-center">
                                  <MapPin className="w-3 h-3 mr-1" />
                                  {job.location.address}
                                </span>
                              )}
                            </div>
                            {job.service?.description && (
                              <Text className="text-sm">{job.service.description}</Text>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Technician Selection */}
        <div className="space-y-4">
          <Card>
            <div className="p-4">
              <Heading level={3} className="font-semibold mb-4">
                Select Technician
              </Heading>
              {techniciansLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-purple-600" />
                </div>
              ) : technicians.length === 0 ? (
                <Text className="text-gray-500 text-center py-8">No technicians available</Text>
              ) : (
                <div className="space-y-2">
                  {technicians.map((technician: any) => (
                    <div
                      key={technician.id || technician.user_id}
                      className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                        selectedTechnician === (technician.id || technician.user_id)
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-gray-200 hover:border-purple-300'
                      }`}
                      onClick={() => setSelectedTechnician(technician.id || technician.user_id)}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full border-2 ${
                          selectedTechnician === (technician.id || technician.user_id)
                            ? 'border-purple-500 bg-purple-500'
                            : 'border-gray-300'
                        }`} />
                        <div className="flex-1">
                          <Text className="font-medium">
                            {technician.first_name} {technician.last_name}
                          </Text>
                          {technician.is_active === false && (
                            <Text className="text-xs text-gray-500">Inactive</Text>
                          )}
                        </div>
                        {selectedTechnician === (technician.id || technician.user_id) && (
                          <CheckCircle className="w-5 h-5 text-purple-600" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>

          {/* Assignment Summary */}
          {selectedJobs.size > 0 && selectedTechnician && (
            <Card className="bg-blue-50 border-blue-200">
              <div className="p-4">
                <Heading level={4} className="font-semibold text-blue-900 mb-3">
                  Assignment Summary
                </Heading>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <Text className="text-blue-700">Jobs Selected:</Text>
                    <Text className="font-semibold text-blue-900">{selectedJobs.size}</Text>
                  </div>
                  <div className="flex justify-between">
                    <Text className="text-blue-700">Technician:</Text>
                    <Text className="font-semibold text-blue-900">
                      {selectedTechnicianData?.first_name} {selectedTechnicianData?.last_name}
                    </Text>
                  </div>
                  <div className="pt-2 border-t border-blue-200">
                    <Button
                      variant="primary"
                      onClick={checkBulkConflicts}
                      disabled={bulkAssignMutation.isPending}
                      className="w-full"
                      icon={ArrowRight}
                    >
                      {bulkAssignMutation.isPending ? 'Assigning...' : `Assign ${selectedJobs.size} Job${selectedJobs.size !== 1 ? 's' : ''}`}
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Conflict Resolution Dialog */}
      {conflictData && (
        <ConflictResolutionDialog
          open={showConflictDialog}
          conflicts={conflictData.conflicts}
          canProceed={conflictData.canProceed}
          onProceed={handleConflictProceed}
          onCancel={handleConflictCancel}
          technicianName={selectedTechnicianData 
            ? `${selectedTechnicianData.first_name} ${selectedTechnicianData.last_name}`
            : undefined}
        />
      )}
    </div>
  );
}

