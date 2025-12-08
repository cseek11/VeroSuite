import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { WorkOrder } from '@/types/work-orders';
import WorkOrdersList from '@/components/work-orders/WorkOrdersList';
import { useDeleteWorkOrder } from '@/hooks/useWorkOrders';
import { logger } from '@/utils/logger';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/Dialog';
import Button from '@/components/ui/Button';
import { AlertTriangle } from 'lucide-react';

export default function WorkOrdersPage() {
  const navigate = useNavigate();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [workOrderToDelete, setWorkOrderToDelete] = useState<WorkOrder | null>(null);

  const deleteWorkOrderMutation = useDeleteWorkOrder();

  const handleCreateWorkOrder = () => {
    navigate('/work-orders/new');
  };

  const handleViewWorkOrder = (workOrder: WorkOrder) => {
    navigate(`/work-orders/${workOrder.id}`);
  };

  const handleEditWorkOrder = (workOrder: WorkOrder) => {
    navigate(`/work-orders/${workOrder.id}/edit`);
  };

  const handleDeleteWorkOrder = (workOrder: WorkOrder) => {
    setWorkOrderToDelete(workOrder);
    setShowDeleteDialog(true);
  };

  const confirmDeleteWorkOrder = async () => {
    if (!workOrderToDelete) return;

    try {
      await deleteWorkOrderMutation.mutateAsync(workOrderToDelete.id);
      setShowDeleteDialog(false);
      setWorkOrderToDelete(null);
    } catch (error) {
      logger.error('Failed to delete work order', error, 'WorkOrdersPage');
      // TODO: Show error toast
    }
  };

  return (
    <div className="p-6">
      <WorkOrdersList
        onCreateWorkOrder={handleCreateWorkOrder}
        onViewWorkOrder={handleViewWorkOrder}
        onEditWorkOrder={handleEditWorkOrder}
        onDeleteWorkOrder={handleDeleteWorkOrder}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Delete Work Order
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this work order? This action cannot be undone.
              {workOrderToDelete && (
                <div className="mt-2 p-3 bg-gray-50 rounded-md">
                  <div className="font-medium">{workOrderToDelete.description}</div>
                  <div className="text-sm text-gray-600">
                    Customer: {workOrderToDelete.account?.name || 'Unknown'}
                  </div>
                  <div className="text-sm text-gray-600">
                    Status: {workOrderToDelete.status}
                  </div>
                </div>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
              disabled={deleteWorkOrderMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={confirmDeleteWorkOrder}
              disabled={deleteWorkOrderMutation.isPending}
            >
              {deleteWorkOrderMutation.isPending ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
