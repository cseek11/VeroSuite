import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { AlertTriangle, CheckCircle, XCircle, Clock, User, MapPin } from 'lucide-react';
import { enhancedApi } from '@/lib/enhanced-api';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { logger } from '@/utils/logger';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/Dialog';
import Select from '@/components/ui/Select';
import type { Job } from '@/types/enhanced-types';

// Types
interface Conflict {
  id: string;
  type: 'time_overlap' | 'technician_double_booking' | 'location_conflict' | 'resource_conflict';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  conflicting_jobs: string[];
  detected_at: string;
  resolved_at?: string;
  resolution_method?: string;
  resolved_by?: string;
}

// Extended Job type with populated relations
type JobWithRelations = Job & {
  customer?: { id: string; name: string; phone?: string };
  location?: { id: string; name: string; address: string; coordinates?: { lat: number; lng: number } };
  service?: { type: string; description: string; estimated_duration: number; price?: number };
};


interface ConflictDetectorProps {
  selectedDate: Date;
  onConflictResolve?: (conflict: Conflict, resolution: string) => void;
  onConflictIgnore?: (conflict: Conflict) => void;
}

export const ConflictDetector: React.FC<ConflictDetectorProps> = ({
  selectedDate,
  onConflictResolve,
  onConflictIgnore
}) => {
  const [conflicts, setConflicts] = useState<Conflict[]>([]);
  const [selectedConflict, setSelectedConflict] = useState<Conflict | null>(null);
  const [showResolutionDialog, setShowResolutionDialog] = useState(false);
  const [resolutionMethod, setResolutionMethod] = useState<string>('');
  const [isScanning, setIsScanning] = useState(false);

  // Fetch jobs for conflict detection
  const { data: jobs = [], isLoading: jobsLoading } = useQuery<JobWithRelations[]>({
    queryKey: ['jobs', 'conflict-detection', selectedDate],
    queryFn: async () => {
      const dateStr: string = selectedDate?.toISOString().split('T')[0] ?? new Date().toISOString().split('T')[0] ?? new Date().toISOString().substring(0, 10);
      const result = await enhancedApi.jobs.getByDateRange(dateStr, dateStr);
      return result as JobWithRelations[];
    },
    staleTime: 1 * 60 * 1000, // 1 minute for real-time conflict detection
  });

  // Fetch technicians
  const { data: technicians = [] } = useQuery({
    queryKey: ['technicians', 'active'],
    queryFn: () => enhancedApi.users.list(),
    staleTime: 10 * 60 * 1000,
  });

  // Resolve conflict mutation
  const resolveConflictMutation = useMutation({
    mutationFn: async ({ conflictId, resolution }: { 
      conflictId: string; 
      resolution: string 
    }) => {
      // TODO: Implement conflict resolution API endpoint
      logger.debug('Resolving conflict', { conflictId, resolution }, 'ConflictDetector');
      return { id: conflictId, resolution };
    },
    onSuccess: (data) => {
      setConflicts(prev => prev.map(conflict => 
        conflict.id === data.id 
          ? { ...conflict, resolved_at: new Date().toISOString(), resolution_method: data.resolution }
          : conflict
      ));
      setShowResolutionDialog(false);
      setSelectedConflict(null);
      onConflictResolve?.(selectedConflict!, data.resolution);
    },
    onError: (error) => {
      logger.error('Failed to resolve conflict', error, 'ConflictDetector');
    }
  });

  // Ignore conflict mutation
  const ignoreConflictMutation = useMutation({
    mutationFn: async (conflictId: string) => {
      // TODO: Implement conflict ignore API endpoint
      logger.debug('Ignoring conflict', { conflictId }, 'ConflictDetector');
      return { id: conflictId };
    },
    onSuccess: (data) => {
      setConflicts(prev => prev.filter(conflict => conflict.id !== data.id));
      onConflictIgnore?.(selectedConflict!);
    },
    onError: (error) => {
      logger.error('Failed to ignore conflict', error, 'ConflictDetector');
    }
  });

  // Detect time overlap conflicts
  const detectTimeOverlapConflicts = (jobs: JobWithRelations[]): Conflict[] => {
    const conflicts: Conflict[] = [];
    
    for (let i = 0; i < jobs.length; i++) {
      for (let j = i + 1; j < jobs.length; j++) {
        const job1 = jobs[i];
        const job2 = jobs[j];
        
        if (!job1 || !job2) continue;
        
        // Check if jobs are on the same date and have overlapping times
        if (job1.scheduled_date === job2.scheduled_date &&
            job1.scheduled_start_time && job1.scheduled_end_time &&
            job2.scheduled_start_time && job2.scheduled_end_time) {
          
          const start1 = new Date(`${job1.scheduled_date}T${job1.scheduled_start_time}`);
          const end1 = new Date(`${job1.scheduled_date}T${job1.scheduled_end_time}`);
          const start2 = new Date(`${job2.scheduled_date}T${job2.scheduled_start_time}`);
          const end2 = new Date(`${job2.scheduled_date}T${job2.scheduled_end_time}`);
          
          // Check for overlap
          if (start1 < end2 && start2 < end1) {
            conflicts.push({
              id: `time-overlap-${job1.id}-${job2.id}`,
              type: 'time_overlap',
              severity: 'high',
              description: `Time overlap between ${job1.customer?.name || 'Unknown'} and ${job2.customer?.name || 'Unknown'}`,
              conflicting_jobs: [job1.id, job2.id],
              detected_at: new Date().toISOString()
            });
          }
        }
      }
    }
    
    return conflicts;
  };

  // Detect technician double booking conflicts
  const detectTechnicianDoubleBookingConflicts = (jobs: JobWithRelations[]): Conflict[] => {
    const conflicts: Conflict[] = [];
    const technicianJobs = new Map<string, Job[]>();
    
    // Group jobs by technician
    jobs.forEach(job => {
      if (job.technician_id) {
        if (!technicianJobs.has(job.technician_id)) {
          technicianJobs.set(job.technician_id, []);
        }
        technicianJobs.get(job.technician_id)!.push(job);
      }
    });
    
    // Check for double bookings
    technicianJobs.forEach((techJobs, technicianId) => {
      for (let i = 0; i < techJobs.length; i++) {
        for (let j = i + 1; j < techJobs.length; j++) {
          const job1 = techJobs[i];
          const job2 = techJobs[j];
          
          if (!job1 || !job2) continue;
          
          if (job1.scheduled_date === job2.scheduled_date &&
              job1.scheduled_start_time && job1.scheduled_end_time &&
              job2.scheduled_start_time && job2.scheduled_end_time) {
            
            const start1 = new Date(`${job1.scheduled_date}T${job1.scheduled_start_time}`);
            const end1 = new Date(`${job1.scheduled_date}T${job1.scheduled_end_time}`);
            const start2 = new Date(`${job2.scheduled_date}T${job2.scheduled_start_time}`);
            const end2 = new Date(`${job2.scheduled_date}T${job2.scheduled_end_time}`);
            
            if (start1 < end2 && start2 < end1) {
              const technician = technicians.find((t: any) => t.id === technicianId);
              conflicts.push({
                id: `double-booking-${job1.id}-${job2.id}`,
                type: 'technician_double_booking',
                severity: 'critical',
                description: `Technician ${technician?.first_name || ''} ${technician?.last_name || ''} double booked`,
                conflicting_jobs: [job1.id, job2.id],
                detected_at: new Date().toISOString()
              });
            }
          }
        }
      }
    });
    
    return conflicts;
  };

  // Detect location conflicts
  const detectLocationConflicts = (jobs: JobWithRelations[]): Conflict[] => {
    const conflicts: Conflict[] = [];
    const locationJobs = new Map<string, JobWithRelations[]>();
    
    // Group jobs by location
    jobs.forEach(job => {
      const locId = job.location?.id || job.location_id;
      if (!locId) return;
      if (!locationJobs.has(locId)) {
        locationJobs.set(locId, []);
      }
      locationJobs.get(locId)!.push(job);
    });
    
    // Check for location conflicts
    locationJobs.forEach((locJobs) => {
      if (locJobs.length > 1) {
        for (let i = 0; i < locJobs.length; i++) {
          for (let j = i + 1; j < locJobs.length; j++) {
            const job1 = locJobs[i];
            const job2 = locJobs[j];
            
            if (!job1 || !job2) continue;
            
            if (job1.scheduled_date === job2.scheduled_date &&
                job1.scheduled_start_time && job1.scheduled_end_time &&
                job2.scheduled_start_time && job2.scheduled_end_time) {
              
              const start1 = new Date(`${job1.scheduled_date}T${job1.scheduled_start_time}`);
              const end1 = new Date(`${job1.scheduled_date}T${job1.scheduled_end_time}`);
              const start2 = new Date(`${job2.scheduled_date}T${job2.scheduled_start_time}`);
              const end2 = new Date(`${job2.scheduled_date}T${job2.scheduled_end_time}`);
              
              if (start1 < end2 && start2 < end1) {
                conflicts.push({
                  id: `location-conflict-${job1.id}-${job2.id}`,
                  type: 'location_conflict',
                  severity: 'medium',
                  description: `Location conflict at ${job1.location?.address || 'Unknown location'}`,
                  conflicting_jobs: [job1.id, job2.id],
                  detected_at: new Date().toISOString()
                });
              }
            }
          }
        }
      }
    });
    
    return conflicts;
  };

  // Run conflict detection
  const runConflictDetection = async () => {
    setIsScanning(true);
    
    try {
      const timeOverlapConflicts = detectTimeOverlapConflicts(jobs);
      const doubleBookingConflicts = detectTechnicianDoubleBookingConflicts(jobs);
      const locationConflicts = detectLocationConflicts(jobs);
      
      const allConflicts = [
        ...timeOverlapConflicts,
        ...doubleBookingConflicts,
        ...locationConflicts
      ];
      
      setConflicts(allConflicts);
    } catch (error) {
      logger.error('Error during conflict detection', error, 'ConflictDetector');
    } finally {
      setIsScanning(false);
    }
  };

  // Auto-run conflict detection when jobs change
  useEffect(() => {
    if (jobs.length > 0) {
      runConflictDetection();
    }
  }, [jobs]);

  // Get conflict severity color
  const getSeverityColor = (severity: string): string => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  // Get conflict type icon
  const getConflictTypeIcon = (type: string) => {
    switch (type) {
      case 'time_overlap': return <Clock className="h-4 w-4" />;
      case 'technician_double_booking': return <User className="h-4 w-4" />;
      case 'location_conflict': return <MapPin className="h-4 w-4" />;
      case 'resource_conflict': return <AlertTriangle className="h-4 w-4" />;
      default: return <AlertTriangle className="h-4 w-4" />;
    }
  };

  // Render conflict card
  const renderConflictCard = (conflict: Conflict) => {
    const conflictingJobs = jobs.filter(job => 
      conflict.conflicting_jobs.includes(job.id)
    );
    
    return (
      <Card
        key={conflict.id}
        className={`p-4 border-l-4 ${
          conflict.severity === 'critical' ? 'border-l-red-500' :
          conflict.severity === 'high' ? 'border-l-orange-500' :
          conflict.severity === 'medium' ? 'border-l-yellow-500' :
          'border-l-blue-500'
        }`}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <div className={`p-2 rounded-full ${getSeverityColor(conflict.severity)}`}>
              {getConflictTypeIcon(conflict.type)}
            </div>
            
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <h3 className="font-medium text-gray-900">{conflict.description}</h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(conflict.severity)}`}>
                  {conflict.severity}
                </span>
              </div>
              
              <div className="text-sm text-gray-600 mb-3">
                Detected: {new Date(conflict.detected_at).toLocaleString()}
              </div>
              
              <div className="space-y-2">
                <div className="text-sm font-medium text-gray-700">Conflicting Jobs:</div>
                {conflictingJobs.map(job => (
                  <div key={job.id} className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                    <div className="font-medium">{job.customer?.name || 'Unknown Customer'}</div>
                    <div className="text-xs text-gray-500">
                      {job.scheduled_start_time} - {job.scheduled_end_time} | {job.service?.type || 'Unknown Service'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setSelectedConflict(conflict);
                setShowResolutionDialog(true);
              }}
            >
              Resolve
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSelectedConflict(conflict);
                ignoreConflictMutation.mutate(conflict.id);
              }}
            >
              <XCircle className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    );
  };

  if (jobsLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Conflict Detection</h2>
          <p className="text-sm text-gray-500">
            Monitoring scheduling conflicts for {selectedDate.toLocaleDateString()}
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="text-sm text-gray-500">
            {conflicts.length} conflict{conflicts.length !== 1 ? 's' : ''} detected
          </div>
          
          <Button
            variant="secondary"
            size="sm"
            onClick={runConflictDetection}
            disabled={isScanning}
          >
            {isScanning ? 'Scanning...' : 'Rescan'}
          </Button>
        </div>
      </div>

      {/* Conflict Summary */}
      {conflicts.length > 0 && (
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <div className="flex items-center">
              <XCircle className="h-5 w-5 text-red-600 mr-2" />
              <div>
                <div className="text-sm font-medium text-red-800">Critical</div>
                <div className="text-lg font-bold text-red-900">
                  {conflicts.filter(c => c.severity === 'critical').length}
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-orange-600 mr-2" />
              <div>
                <div className="text-sm font-medium text-orange-800">High</div>
                <div className="text-lg font-bold text-orange-900">
                  {conflicts.filter(c => c.severity === 'high').length}
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2" />
              <div>
                <div className="text-sm font-medium text-yellow-800">Medium</div>
                <div className="text-lg font-bold text-yellow-900">
                  {conflicts.filter(c => c.severity === 'medium').length}
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
              <div>
                <div className="text-sm font-medium text-green-800">Resolved</div>
                <div className="text-lg font-bold text-green-900">
                  {conflicts.filter(c => c.resolved_at).length}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Conflicts List */}
      <div className="space-y-3">
        {conflicts.length === 0 ? (
          <div className="text-center py-8">
            <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No conflicts detected</h3>
            <p className="mt-1 text-sm text-gray-500">
              All scheduled jobs are conflict-free for this date.
            </p>
          </div>
        ) : (
          conflicts.map(renderConflictCard)
        )}
      </div>

      {/* Resolution Dialog */}
      <Dialog open={showResolutionDialog} onOpenChange={setShowResolutionDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Resolve Conflict</DialogTitle>
            <DialogDescription>
              Choose how to resolve this scheduling conflict
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Resolution Method
              </label>
              <Select
                value={resolutionMethod}
                onChange={setResolutionMethod}
                options={[
                  { value: 'reschedule_job', label: 'Reschedule Job' },
                  { value: 'reassign_technician', label: 'Reassign Technician' },
                  { value: 'split_job', label: 'Split Job' },
                  { value: 'manual_resolution', label: 'Manual Resolution' }
                ]}
                placeholder="Select resolution method"
              />
            </div>
            
            {selectedConflict && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                <div className="text-sm text-gray-700">
                  <strong>Conflict:</strong> {selectedConflict.description}
                </div>
                <div className="text-sm text-gray-700 mt-1">
                  <strong>Type:</strong> {selectedConflict.type.replace('_', ' ')}
                </div>
                <div className="text-sm text-gray-700 mt-1">
                  <strong>Severity:</strong> {selectedConflict.severity}
                </div>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button
              variant="secondary"
              onClick={() => setShowResolutionDialog(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                if (selectedConflict && resolutionMethod) {
                  resolveConflictMutation.mutate({
                    conflictId: selectedConflict.id,
                    resolution: resolutionMethod
                  });
                }
              }}
              disabled={!resolutionMethod || resolveConflictMutation.isPending}
            >
              {resolveConflictMutation.isPending ? 'Resolving...' : 'Resolve Conflict'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ConflictDetector;
