import React, { useState } from 'react';
import { useUpdateWorkOrder, useBulkUpdateStatus } from '@/hooks/useWorkOrders';
import { WorkOrder, WorkOrderStatus } from '@/types/work-orders';
import { 
  getStatusColor, 
  getStatusLabel
} from '@/types/work-orders';
import { 
  Play, 
  CheckCircle, 
  XCircle, 
  RotateCcw,
  AlertCircle,
  History
} from 'lucide-react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/Dialog';
import { logger } from '@/utils/logger';

interface WorkOrderStatusManagerProps {
  workOrder?: WorkOrder;
  workOrderIds?: string[];
  onStatusChange?: (workOrder: WorkOrder, newStatus: WorkOrderStatus) => void;
  onBulkStatusChange?: (workOrderIds: string[], newStatus: WorkOrderStatus) => void;
  mode?: 'single' | 'bulk';
}

interface StatusTransition {
  from: WorkOrderStatus;
  to: WorkOrderStatus;
  label: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  requiresNotes?: boolean;
  autoComplete?: boolean;
}

const statusTransitions: StatusTransition[] = [
  {
    from: WorkOrderStatus.PENDING,
    to: WorkOrderStatus.IN_PROGRESS,
    label: 'Start Work',
    description: 'Mark work order as in progress',
    icon: <Play className="h-4 w-4" />,
    color: 'blue',
    requiresNotes: false
  },
  {
    from: WorkOrderStatus.PENDING,
    to: WorkOrderStatus.CANCELED,
    label: 'Cancel',
    description: 'Cancel the work order',
    icon: <XCircle className="h-4 w-4" />,
    color: 'red',
    requiresNotes: true
  },
  {
    from: WorkOrderStatus.IN_PROGRESS,
    to: WorkOrderStatus.COMPLETED,
    label: 'Complete',
    description: 'Mark work order as completed',
    icon: <CheckCircle className="h-4 w-4" />,
    color: 'green',
    requiresNotes: false,
    autoComplete: true
  },
  {
    from: WorkOrderStatus.IN_PROGRESS,
    to: WorkOrderStatus.CANCELED,
    label: 'Cancel',
    description: 'Cancel the work order',
    icon: <XCircle className="h-4 w-4" />,
    color: 'red',
    requiresNotes: true
  },
  {
    from: WorkOrderStatus.CANCELED,
    to: WorkOrderStatus.PENDING,
    label: 'Reactivate',
    description: 'Reactivate the canceled work order',
    icon: <RotateCcw className="h-4 w-4" />,
    color: 'yellow',
    requiresNotes: true
  }
];

export default function WorkOrderStatusManager({
  workOrder,
  workOrderIds = [],
  onStatusChange,
  onBulkStatusChange,
  mode = 'single'
}: WorkOrderStatusManagerProps) {
  const [showStatusDialog, setShowStatusDialog] = useState(false);
  const [selectedTransition, setSelectedTransition] = useState<StatusTransition | null>(null);
  const [statusNotes, setStatusNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateWorkOrderMutation = useUpdateWorkOrder();
  const bulkUpdateStatusMutation = useBulkUpdateStatus();

  const getAvailableTransitions = (): StatusTransition[] => {
    if (mode === 'bulk') {
      // For bulk operations, only allow safe transitions
      return statusTransitions.filter(t => 
        t.to === WorkOrderStatus.IN_PROGRESS || 
        t.to === WorkOrderStatus.COMPLETED ||
        t.to === WorkOrderStatus.CANCELED
      );
    }

    if (!workOrder) return [];
    
    return statusTransitions.filter(t => t.from === workOrder.status);
  };

  const handleStatusChange = async (transition: StatusTransition) => {
    if (!transition) return;

    setIsSubmitting(true);
    try {
      if (mode === 'single' && workOrder) {
        // Single work order update
        const updateData: any = {
          status: transition.to
        };

        // Set completion date if completing
        if (transition.to === WorkOrderStatus.COMPLETED) {
          updateData.completion_date = new Date().toISOString();
        }

        // Add notes if provided
        if (statusNotes.trim()) {
          const timestamp = new Date().toLocaleString();
          const statusChangeNote = `[${timestamp}] Status changed to ${getStatusLabel(transition.to)}: ${statusNotes.trim()}`;
          updateData.notes = workOrder.notes 
            ? `${workOrder.notes}\n\n${statusChangeNote}`
            : statusChangeNote;
        }

        await updateWorkOrderMutation.mutateAsync({
          id: workOrder.id,
          data: updateData
        });

        onStatusChange?.(workOrder, transition.to);
      } else if (mode === 'bulk' && workOrderIds.length > 0) {
        // Bulk update
        const notes = statusNotes.trim() 
          ? `Bulk status change to ${getStatusLabel(transition.to)}: ${statusNotes.trim()}`
          : undefined;

        await bulkUpdateStatusMutation.mutateAsync({
          workOrderIds,
          newStatus: transition.to,
          notes
        });

        onBulkStatusChange?.(workOrderIds, transition.to);
      }

      setShowStatusDialog(false);
      setSelectedTransition(null);
      setStatusNotes('');
    } catch (error) {
      logger.error('Failed to update work order status', error, 'WorkOrderStatusManager');
    } finally {
      setIsSubmitting(false);
    }
  };

  const availableTransitions = getAvailableTransitions();

  if (availableTransitions.length === 0) {
    return null;
  }

  return (
    <>
      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <History className="h-5 w-5" />
            Status Management
          </h3>
          {workOrder && (
            <div className="flex items-center gap-2">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${getStatusColor(workOrder.status)}-100 text-${getStatusColor(workOrder.status)}-800`}>
                {getStatusLabel(workOrder.status)}
              </span>
            </div>
          )}
        </div>

        <div className="space-y-2">
          {availableTransitions.map((transition) => (
            <button
              key={`${transition.from}-${transition.to}`}
              onClick={() => {
                setSelectedTransition(transition);
                setShowStatusDialog(true);
              }}
              className={`w-full p-3 text-left rounded-md border border-${transition.color}-200 bg-${transition.color}-50 hover:bg-${transition.color}-100 transition-colors`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full bg-${transition.color}-100`}>
                  {transition.icon}
                </div>
                <div>
                  <div className="font-medium text-gray-900">{transition.label}</div>
                  <div className="text-sm text-gray-600">{transition.description}</div>
                </div>
              </div>
            </button>
          ))}
        </div>

        {mode === 'bulk' && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-blue-600" />
              <span className="text-sm text-blue-800">
                This will update {workOrderIds.length} work order(s)
              </span>
            </div>
          </div>
        )}
      </Card>

      {/* Status Change Dialog */}
      <Dialog open={showStatusDialog} onOpenChange={setShowStatusDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedTransition?.icon}
              {selectedTransition?.label}
            </DialogTitle>
            <DialogDescription>
              {selectedTransition?.description}
              {workOrder && (
                <div className="mt-2">
                  <strong>Work Order:</strong> {workOrder.description}
                </div>
              )}
              {mode === 'bulk' && (
                <div className="mt-2">
                  <strong>Affected:</strong> {workOrderIds.length} work order(s)
                </div>
              )}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {selectedTransition?.requiresNotes && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={statusNotes}
                  onChange={(e) => setStatusNotes(e.target.value)}
                  rows={3}
                  className="crm-textarea"
                  placeholder="Please provide a reason for this status change..."
                  required
                />
              </div>
            )}

            {!selectedTransition?.requiresNotes && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes (Optional)
                </label>
                <textarea
                  value={statusNotes}
                  onChange={(e) => setStatusNotes(e.target.value)}
                  rows={3}
                  className="crm-textarea"
                  placeholder="Add any additional notes..."
                />
              </div>
            )}

            {selectedTransition?.autoComplete && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-green-800">
                    This will automatically set the completion date to now.
                  </span>
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowStatusDialog(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={() => selectedTransition && handleStatusChange(selectedTransition)}
              disabled={isSubmitting || (selectedTransition?.requiresNotes && !statusNotes.trim())}
              className="flex items-center gap-2"
            >
              {isSubmitting ? (
                'Updating...'
              ) : (
                <>
                  {selectedTransition?.icon}
                  {selectedTransition?.label}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}






