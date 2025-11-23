import React from 'react';
import { AlertTriangle, Clock, MapPin } from 'lucide-react';
import Button from '@/components/ui/Button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/Dialog';

interface Conflict {
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
}

interface ConflictResolutionDialogProps {
  open: boolean;
  conflicts: Conflict[];
  canProceed: boolean;
  onProceed: () => void;
  onCancel: () => void;
  technicianName?: string;
}

export const ConflictResolutionDialog: React.FC<ConflictResolutionDialogProps> = ({
  open,
  conflicts,
  canProceed: _canProceed,
  onProceed,
  onCancel,
  technicianName
}) => {
  const getSeverityColor = (severity: string): string => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getConflictIcon = (type: string) => {
    switch (type) {
      case 'time_overlap':
      case 'technician_double_booking':
        return <Clock className="h-5 w-5" />;
      case 'location_conflict':
        return <MapPin className="h-5 w-5" />;
      default:
        return <AlertTriangle className="h-5 w-5" />;
    }
  };

  const criticalConflicts = conflicts.filter(c => c.severity === 'critical');
  const hasCriticalConflicts = criticalConflicts.length > 0;

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onCancel()}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            Scheduling Conflict Detected
          </DialogTitle>
          <DialogDescription>
            {hasCriticalConflicts
              ? `Cannot assign job to ${technicianName || 'this technician'}. Critical conflicts detected.`
              : `Warning: Conflicts detected when assigning to ${technicianName || 'this technician'}.`}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {conflicts.map((conflict, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg border ${getSeverityColor(conflict.severity)}`}
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  {getConflictIcon(conflict.type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-semibold capitalize">
                      {conflict.type.replace('_', ' ')}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded capitalize ${getSeverityColor(conflict.severity)}`}>
                      {conflict.severity}
                    </span>
                  </div>
                  <p className="text-sm mb-3">{conflict.description}</p>
                  
                  {conflict.conflicting_jobs.length > 0 && (
                    <div className="mt-3 space-y-2">
                      <p className="text-xs font-medium uppercase tracking-wide opacity-75">
                        Conflicting Jobs:
                      </p>
                      {conflict.conflicting_jobs.map((job, jobIndex) => (
                        <div
                          key={jobIndex}
                          className="bg-white/50 p-2 rounded text-xs"
                        >
                          <div className="font-medium">{job.customer_name || 'Unknown Customer'}</div>
                          <div className="text-gray-600 mt-1">
                            {job.scheduled_start_time} - {job.scheduled_end_time}
                            {job.location_address && ` • ${job.location_address}`}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {hasCriticalConflicts && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800">
              <strong>Cannot proceed:</strong> Critical conflicts prevent this assignment. 
              Please resolve conflicts or choose a different time slot.
            </p>
          </div>
        )}

        <DialogFooter className="mt-6">
          <Button
            variant="secondary"
            onClick={onCancel}
          >
            Cancel
          </Button>
          {!hasCriticalConflicts && (
            <Button
              variant="primary"
              onClick={onProceed}
            >
              Proceed Anyway
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};






