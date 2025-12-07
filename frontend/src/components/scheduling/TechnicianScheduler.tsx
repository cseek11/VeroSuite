import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { User, AlertTriangle, CheckCircle, Star, Clock } from 'lucide-react';
import { enhancedApi } from '@/lib/enhanced-api';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import { logger } from '@/utils/logger';
import { ScheduleCalendar } from './ScheduleCalendar';
import type { Job } from '@/types/enhanced-types';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/Dialog';

// Extended Job type with populated relations
type JobWithRelations = Job & {
  customer?: { id: string; name: string; phone?: string };
  location?: { id: string; name: string; address: string; coordinates?: { lat: number; lng: number } };
  service?: { type: string; description: string; estimated_duration: number; price?: number };
};

interface Technician {
  id: string;
  first_name: string;
  last_name: string;
  phone?: string;
  is_active: boolean;
  skills?: string[];
  performance_metrics?: {
    completion_rate: number;
    customer_rating: number;
    jobs_completed: number;
    utilization_rate: number;
    on_time_rate: number;
  };
}

interface TechnicianSchedulerProps {
  selectedDate: Date;
  onTechnicianSelect?: (technician: Technician) => void;
  onJobAssign?: (job: JobWithRelations, technician: Technician) => void;
  onBulkAssign?: (jobs: JobWithRelations[], technician: Technician) => void;
}

export const TechnicianScheduler: React.FC<TechnicianSchedulerProps> = ({
  selectedDate,
  onTechnicianSelect,
  onJobAssign: _onJobAssign,
  onBulkAssign
}) => {
  const [selectedTechnician, setSelectedTechnician] = useState<string>('');
  const [selectedJobs, setSelectedJobs] = useState<string[]>([]);
  const [showAssignmentDialog, setShowAssignmentDialog] = useState(false);
  const [assignmentReason, setAssignmentReason] = useState('');

  const queryClient = useQueryClient();

  // Fetch technicians with performance metrics
  const { data: technicians = [], isLoading: techniciansLoading } = useQuery({
    queryKey: ['technicians', 'with-metrics'],
    queryFn: async () => {
      const techs = await enhancedApi.users.list();
      
      // TODO: Fetch performance metrics for each technician
      return techs.map((tech: any) => ({
        ...tech,
        performance_metrics: {
          completion_rate: Math.random() * 100,
          customer_rating: 3 + Math.random() * 2,
          jobs_completed: Math.floor(Math.random() * 100),
          utilization_rate: Math.random() * 100,
          on_time_rate: Math.random() * 100
        }
      }));
    },
    staleTime: 10 * 60 * 1000,
  });

  // Fetch unassigned jobs for the selected date
  const { data: jobs = [], isLoading: jobsLoading } = useQuery<JobWithRelations[]>({
    queryKey: ['jobs', 'unassigned', selectedDate],
    queryFn: async () => {
      const dateStr = selectedDate.toISOString().split('T')[0];
      if (!dateStr) return [];
      
      const allJobs = await enhancedApi.jobs.getByDateRange(dateStr, dateStr);
      
      return allJobs.filter(job => !job.technician_id) as JobWithRelations[];
    },
    staleTime: 2 * 60 * 1000,
  });

  // Assign job mutation
  const assignJobMutation = useMutation({
    mutationFn: async ({ jobId, technicianId }: { 
      jobId: string; 
      technicianId: string; 
    }) => {
      const dateStr = selectedDate.toISOString().split('T')[0];
      if (!dateStr) throw new Error('Invalid date');
      
      return enhancedApi.jobs.update(jobId, {
        technician_id: technicianId,
        scheduled_date: dateStr,
        scheduled_start_time: '09:00',
        scheduled_end_time: '17:00'
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      setShowAssignmentDialog(false);
      setSelectedJobs([]);
      setAssignmentReason('');
    },
    onError: (error) => {
      logger.error('Failed to assign job', error, 'TechnicianScheduler');
    }
  });

  // Bulk assign jobs mutation
  const bulkAssignMutation = useMutation({
    mutationFn: async ({ jobIds, technicianId }: { 
      jobIds: string[]; 
      technicianId: string; 
    }) => {
      const dateStr = selectedDate.toISOString().split('T')[0];
      if (!dateStr) throw new Error('Invalid date');
      
      const promises = jobIds.map(jobId => 
        enhancedApi.jobs.update(jobId, {
          technician_id: technicianId,
          scheduled_date: dateStr,
          scheduled_start_time: '09:00',
          scheduled_end_time: '17:00'
        })
      );
      
      return Promise.all(promises);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      setShowAssignmentDialog(false);
      setSelectedJobs([]);
      setAssignmentReason('');
    },
    onError: (error) => {
      logger.error('Failed to bulk assign jobs', error, 'TechnicianScheduler');
    }
  });

  // Skill matching algorithm
  const getSkillMatchScore = (_job: JobWithRelations, _technician: Technician): number => {
    // TODO: Implement skill matching logic
    // For now, return a random score
    return Math.random() * 100;
  };

  // Workload calculation
  const getTechnicianWorkload = (_technicianId: string): number => {
    // TODO: Calculate current workload for technician
    return Math.random() * 100;
  };

  // Get assignment recommendations
  const getAssignmentRecommendations = (job: JobWithRelations) => {
    return technicians
      .map(tech => {
        const score = getSkillMatchScore(job, tech);
        return {
          technician: tech,
          score,
          workload: getTechnicianWorkload(tech.id),
          recommendation: score > 80 ? 'high' : score > 60 ? 'medium' : 'low'
        };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);
  };

  // Handle job selection
  const handleJobSelect = (jobId: string) => {
    setSelectedJobs(prev => 
      prev.includes(jobId) 
        ? prev.filter(id => id !== jobId)
        : [...prev, jobId]
    );
  };

  // Handle bulk assignment
  const handleBulkAssign = () => {
    if (selectedJobs.length === 0 || !selectedTechnician) return;
    
    const technician = technicians.find(t => t.id === selectedTechnician);
    if (!technician) return;
    
    const jobsToAssign = jobs.filter(job => selectedJobs.includes(job.id));
    onBulkAssign?.(jobsToAssign, technician);
    setShowAssignmentDialog(true);
  };

  // Handle assignment confirmation
  const handleAssignmentConfirm = () => {
    if (!selectedTechnician) return;
    
    if (selectedJobs.length === 1) {
      const jobId = selectedJobs[0];
      if (!jobId) return;
      assignJobMutation.mutate({
        jobId,
        technicianId: selectedTechnician
      });
    } else {
      bulkAssignMutation.mutate({
        jobIds: selectedJobs,
        technicianId: selectedTechnician
      });
    }
  };

  // Render technician card
  const renderTechnicianCard = (technician: Technician) => {
    const workload = getTechnicianWorkload(technician.id);
    const isSelected = selectedTechnician === technician.id;
    
    return (
      <div
        key={technician.id}
        className={`p-4 cursor-pointer transition-all rounded-lg border ${
          isSelected ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:shadow-md border-gray-200'
        }`}
        onClick={() => {
          setSelectedTechnician(technician.id);
          onTechnicianSelect?.(technician);
        }}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">
                {technician.first_name} {technician.last_name}
              </h3>
              <p className="text-sm text-gray-500">
                {technician.phone}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-1">
            <Star className="h-4 w-4 text-yellow-500" />
            <span className="text-sm font-medium">
              {technician.performance_metrics?.customer_rating.toFixed(1)}
            </span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <div className="text-gray-500">Completion Rate</div>
            <div className="font-medium">
              {technician.performance_metrics?.completion_rate.toFixed(1)}%
            </div>
          </div>
          <div>
            <div className="text-gray-500">Jobs Completed</div>
            <div className="font-medium">
              {technician.performance_metrics?.jobs_completed}
            </div>
          </div>
          <div>
            <div className="text-gray-500">Utilization</div>
            <div className="font-medium">
              {workload.toFixed(1)}%
            </div>
          </div>
          <div>
            <div className="text-gray-500">On-Time Rate</div>
            <div className="font-medium">
              {technician.performance_metrics?.on_time_rate.toFixed(1)}%
            </div>
          </div>
        </div>
        
        {/* Workload indicator */}
        <div className="mt-3">
          <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
            <span>Workload</span>
            <span>{workload.toFixed(0)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${
                workload > 80 ? 'bg-red-500' :
                workload > 60 ? 'bg-yellow-500' : 'bg-green-500'
              }`}
              style={{ width: `${workload}%` }}
            />
          </div>
        </div>
      </div>
    );
  };

  // Render job card
  const renderJobCard = (job: JobWithRelations) => {
    const isSelected = selectedJobs.includes(job.id);
    const recommendations = getAssignmentRecommendations(job);
    
    return (
      <div
        key={job.id}
        className={`p-4 cursor-pointer transition-all rounded-lg border ${
          isSelected ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:shadow-md border-gray-200'
        }`}
        onClick={() => handleJobSelect(job.id)}
      >
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="font-medium text-gray-900">{job.customer?.name || 'Unknown'}</h3>
            <p className="text-sm text-gray-500">{job.service?.type || 'Unknown'}</p>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              job.priority === 'urgent' ? 'bg-red-100 text-red-800' :
              job.priority === 'high' ? 'bg-orange-100 text-orange-800' :
              job.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
              'bg-green-100 text-green-800'
            }`}>
              {job.priority}
            </span>
            
            {isSelected && (
              <CheckCircle className="h-5 w-5 text-blue-600" />
            )}
          </div>
        </div>
        
        <div className="space-y-2 text-sm">
          <div className="flex items-center text-gray-600">
            <Clock className="h-4 w-4 mr-2" />
            <span>{job.service?.estimated_duration || 0} min</span>
          </div>
          
          <div className="flex items-center text-gray-600">
            <span className="mr-2">📍</span>
            <span className="truncate">{job.location?.address || 'Unknown'}</span>
          </div>
        </div>
        
        {/* Assignment recommendations */}
        <div className="mt-3 pt-3 border-t border-gray-200">
          <div className="text-xs text-gray-500 mb-2">Recommended Technicians:</div>
          <div className="flex space-x-2">
            {recommendations.map((rec) => (
              <div
                key={rec.technician.id}
                className={`px-2 py-1 rounded text-xs ${
                  rec.recommendation === 'high' ? 'bg-green-100 text-green-800' :
                  rec.recommendation === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}
              >
                {rec.technician.first_name} ({rec.score.toFixed(0)}%)
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Handle bulk selection from ScheduleCalendar
  const handleBulkSelect = (jobIds: string[]) => {
    setSelectedJobs(jobIds);
  };

  if (techniciansLoading || jobsLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Technician Assignment</h2>
          <p className="text-sm text-gray-500">
            Assign jobs to technicians for {selectedDate.toLocaleDateString()}
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">
            {selectedJobs.length} job{selectedJobs.length !== 1 ? 's' : ''} selected
          </span>
          
          <Button
            variant="primary"
            size="sm"
            onClick={handleBulkAssign}
            disabled={selectedJobs.length === 0 || !selectedTechnician}
          >
            Assign Selected
          </Button>
        </div>
      </div>

      {/* Schedule Calendar with bulk selection */}
      <Card className="mb-6">
        <ScheduleCalendar
          selectedDate={selectedDate}
          onDateChange={() => {
            // Date change handled by parent
          }}
          searchQuery=""
          filterStatus="unassigned"
          filterPriority="all"
          filterTechnician={selectedTechnician}
          showTechnicianMetrics={true}
          enableBulkSelection={true}
          onBulkSelect={handleBulkSelect}
          showAnalytics={false}
          showMap={false}
        />
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Technicians */}
        <div>
          <h3 className="text-md font-medium text-gray-900 mb-4">Available Technicians</h3>
          <div className="space-y-3">
            {technicians.map(renderTechnicianCard)}
          </div>
        </div>

        {/* Unassigned Jobs */}
        <div>
          <h3 className="text-md font-medium text-gray-900 mb-4">
            Unassigned Jobs ({jobs.length})
          </h3>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {jobs.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No unassigned jobs for this date.
              </div>
            ) : (
              jobs.map((job) => renderJobCard(job))
            )}
          </div>
        </div>
      </div>

      {/* Assignment Dialog */}
      <Dialog open={showAssignmentDialog} onOpenChange={setShowAssignmentDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedJobs.length === 1 ? 'Assign Job' : 'Bulk Assign Jobs'}
            </DialogTitle>
            <DialogDescription>
              {selectedJobs.length === 1 
                ? 'Assign this job to the selected technician'
                : `Assign ${selectedJobs.length} jobs to the selected technician`
              }
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Assignment Reason (Optional)
              </label>
              <Input
                placeholder="Enter reason for assignment..."
                value={assignmentReason}
                onChange={(e) => setAssignmentReason(e.target.value)}
              />
            </div>
            
            {selectedJobs.length > 1 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="flex items-center">
                  <AlertTriangle className="h-5 w-5 text-blue-600 mr-2" />
                  <div className="text-sm text-blue-800">
                    You are about to assign {selectedJobs.length} jobs to{' '}
                    {technicians.find(t => t.id === selectedTechnician)?.first_name}{' '}
                    {technicians.find(t => t.id === selectedTechnician)?.last_name}
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button
              variant="secondary"
              onClick={() => setShowAssignmentDialog(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleAssignmentConfirm}
              disabled={assignJobMutation.isPending || bulkAssignMutation.isPending}
            >
              {assignJobMutation.isPending || bulkAssignMutation.isPending 
                ? 'Assigning...' 
                : 'Confirm Assignment'
              }
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TechnicianScheduler;
