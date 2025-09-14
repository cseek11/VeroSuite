import React, { useState } from 'react';
import { useWorkOrder, useUpdateWorkOrder, useDeleteWorkOrder } from '@/hooks/useWorkOrders';
import { WorkOrder, WorkOrderStatus, WorkOrderPriority } from '@/types/work-orders';
import { 
  getStatusColor, 
  getStatusLabel, 
  getPriorityColor, 
  getPriorityLabel,
  getNextStatuses,
  canChangeStatus
} from '@/types/work-orders';
import WorkOrderStatusManager from './WorkOrderStatusManager';
import { 
  Calendar, 
  User, 
  Clock, 
  DollarSign, 
  FileText, 
  MapPin,
  Phone,
  Mail,
  Edit,
  Trash2,
  Printer,
  CheckCircle,
  AlertCircle,
  XCircle,
  Play,
  Pause,
  RotateCcw,
  History,
  MessageSquare,
  Building,
  Home,
  Briefcase
} from 'lucide-react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/Dialog';

interface WorkOrderDetailProps {
  workOrderId: string;
  onEdit?: (workOrder: WorkOrder) => void;
  onDelete?: (workOrder: WorkOrder) => void;
  onStatusChange?: (workOrder: WorkOrder, newStatus: WorkOrderStatus) => void;
  onClose?: () => void;
}

export default function WorkOrderDetail({
  workOrderId,
  onEdit,
  onDelete,
  onStatusChange,
  onClose
}: WorkOrderDetailProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const { data: workOrder, isLoading, error, refetch } = useWorkOrder(workOrderId);
  const updateWorkOrderMutation = useUpdateWorkOrder();
  const deleteWorkOrderMutation = useDeleteWorkOrder();


  const handleDelete = async () => {
    if (!workOrder) return;

    try {
      await deleteWorkOrderMutation.mutateAsync(workOrder.id);
      setShowDeleteDialog(false);
      onDelete?.(workOrder);
    } catch (error) {
      console.error('Failed to delete work order:', error);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusIcon = (status: WorkOrderStatus) => {
    switch (status) {
      case WorkOrderStatus.PENDING:
        return <Clock className="h-5 w-5" />;
      case WorkOrderStatus.IN_PROGRESS:
        return <Play className="h-5 w-5" />;
      case WorkOrderStatus.COMPLETED:
        return <CheckCircle className="h-5 w-5" />;
      case WorkOrderStatus.CANCELED:
        return <XCircle className="h-5 w-5" />;
      default:
        return <AlertCircle className="h-5 w-5" />;
    }
  };

  const getAccountTypeIcon = (accountType: string) => {
    switch (accountType?.toLowerCase()) {
      case 'residential':
        return <Home className="h-4 w-4" />;
      case 'commercial':
        return <Building className="h-4 w-4" />;
      case 'industrial':
        return <Briefcase className="h-4 w-4" />;
      default:
        return <Building className="h-4 w-4" />;
    }
  };

  const formatCurrency = (value: unknown) => {
    const numeric = typeof value === 'number' ? value : parseFloat(String(value));
    if (Number.isNaN(numeric)) return '$0.00';
    return `$${numeric.toFixed(2)}`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner text="Loading work order..." />
      </div>
    );
  }

  if (error || !workOrder) {
    return (
      <Card className="p-6">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Work Order</h3>
          <p className="text-gray-600 mb-4">{error?.message || 'Work order not found'}</p>
          <div className="flex items-center justify-center gap-2">
            <Button onClick={() => refetch()} variant="outline">
              Try Again
            </Button>
            {onClose && (
              <Button onClick={onClose} variant="outline">
                Close
              </Button>
            )}
          </div>
        </div>
      </Card>
    );
  }

  const nextStatuses = getNextStatuses(workOrder.status);
  const canEdit = workOrder.status !== WorkOrderStatus.COMPLETED && workOrder.status !== WorkOrderStatus.CANCELED;

  return (
    <div className="space-y-6 print:space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Work Order #{workOrder.work_order_number || workOrder.id.slice(-8)}
          </h1>
          <p className="text-gray-600">Created {formatDate(workOrder.created_at)}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={handlePrint}
            className="flex items-center gap-2 print:hidden"
          >
            <Printer className="h-4 w-4" />
            Print
          </Button>
          {canEdit && (
            <Button
              variant="outline"
              onClick={() => onEdit?.(workOrder)}
              className="flex items-center gap-2"
            >
              <Edit className="h-4 w-4" />
              Edit
            </Button>
          )}
          {canEdit && (
            <Button
              variant="danger"
              onClick={() => setShowDeleteDialog(true)}
              className="flex items-center gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
          )}
          {onClose && (
            <Button
              variant="outline"
              onClick={onClose}
              className="flex items-center gap-2 print:hidden"
            >
              Close
            </Button>
          )}
        </div>
      </div>

      {/* Status and Priority */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-full bg-${getStatusColor(workOrder.status)}-100`}>
              {getStatusIcon(workOrder.status)}
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Status</h3>
              <p className={`text-${getStatusColor(workOrder.status)}-600 font-medium`}>
                {getStatusLabel(workOrder.status)}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-full bg-${getPriorityColor(workOrder.priority)}-100`}>
              <AlertCircle className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Priority</h3>
              <p className={`text-${getPriorityColor(workOrder.priority)}-600 font-medium`}>
                {getPriorityLabel(workOrder.priority)}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Status Management */}
      <WorkOrderStatusManager
        workOrder={workOrder}
        onStatusChange={onStatusChange}
        mode="single"
      />

      {/* Work Order Information */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Work Order Details
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <p className="mt-1 text-sm text-gray-900">{workOrder.description}</p>
            </div>
            
            {workOrder.service_type && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Service Type</label>
                <p className="mt-1 text-sm text-gray-900">{workOrder.service_type}</p>
              </div>
            )}

            {workOrder.estimated_duration && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Estimated Duration</label>
                <p className="mt-1 text-sm text-gray-900 flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {workOrder.estimated_duration} minutes
                </p>
              </div>
            )}

            {workOrder.service_price !== null && workOrder.service_price !== undefined && workOrder.service_price !== '' && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Service Price</label>
                <p className="mt-1 text-sm text-gray-900 flex items-center gap-1">
                  <DollarSign className="h-4 w-4" />
                  {formatCurrency(workOrder.service_price)}
                </p>
              </div>
            )}
          </div>

          <div className="space-y-4">
            {workOrder.scheduled_date && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Scheduled Date</label>
                <p className="mt-1 text-sm text-gray-900 flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {formatDateTime(workOrder.scheduled_date)}
                </p>
              </div>
            )}

            {workOrder.completion_date && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Completion Date</label>
                <p className="mt-1 text-sm text-gray-900 flex items-center gap-1">
                  <CheckCircle className="h-4 w-4" />
                  {formatDateTime(workOrder.completion_date)}
                </p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700">Created</label>
              <p className="mt-1 text-sm text-gray-900">{formatDateTime(workOrder.created_at)}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Last Updated</label>
              <p className="mt-1 text-sm text-gray-900">{formatDateTime(workOrder.updated_at)}</p>
            </div>
          </div>
        </div>

        {workOrder.notes && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
            <div className="bg-gray-50 rounded-md p-4">
              <p className="text-sm text-gray-900 whitespace-pre-wrap">{workOrder.notes}</p>
            </div>
          </div>
        )}
      </Card>

      {/* Customer Information */}
      {workOrder.account && (
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <User className="h-5 w-5" />
            Customer Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Customer Name</label>
                <p className="mt-1 text-sm text-gray-900 flex items-center gap-2">
                  {getAccountTypeIcon(workOrder.account.account_type)}
                  {workOrder.account.name}
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Account Type</label>
                <p className="mt-1 text-sm text-gray-900">{workOrder.account.account_type}</p>
              </div>
            </div>

            <div className="space-y-4">
              {workOrder.account.phone && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone</label>
                  <p className="mt-1 text-sm text-gray-900 flex items-center gap-1">
                    <Phone className="h-4 w-4" />
                    {workOrder.account.phone}
                  </p>
                </div>
              )}

              {workOrder.account.email && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <p className="mt-1 text-sm text-gray-900 flex items-center gap-1">
                    <Mail className="h-4 w-4" />
                    {workOrder.account.email}
                  </p>
                </div>
              )}
            </div>
          </div>
        </Card>
      )}

      {/* Assigned Technician */}
      {workOrder.assignedTechnician && (
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <User className="h-5 w-5" />
            Assigned Technician
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Technician Name</label>
                <p className="mt-1 text-sm text-gray-900">
                  {workOrder.assignedTechnician.first_name} {workOrder.assignedTechnician.last_name}
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <p className="mt-1 text-sm text-gray-900 flex items-center gap-1">
                  <Mail className="h-4 w-4" />
                  {workOrder.assignedTechnician.email}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {workOrder.assignedTechnician.phone && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone</label>
                  <p className="mt-1 text-sm text-gray-900 flex items-center gap-1">
                    <Phone className="h-4 w-4" />
                    {workOrder.assignedTechnician.phone}
                  </p>
                </div>
              )}
            </div>
          </div>
        </Card>
      )}

      {/* Related Jobs */}
      {workOrder.jobs && workOrder.jobs.length > 0 && (
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <History className="h-5 w-5" />
            Related Jobs
          </h2>
          <div className="space-y-3">
            {workOrder.jobs.map((job) => (
              <div key={job.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                <div>
                  <p className="text-sm font-medium text-gray-900">Job #{job.id.slice(-8)}</p>
                  <p className="text-sm text-gray-600">
                    Scheduled: {formatDateTime(job.scheduled_date)}
                  </p>
                </div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${getStatusColor(job.status as WorkOrderStatus)}-100 text-${getStatusColor(job.status as WorkOrderStatus)}-800`}>
                  {getStatusLabel(job.status as WorkOrderStatus)}
                </span>
              </div>
            ))}
          </div>
        </Card>
      )}


      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              Delete Work Order
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this work order? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          <div className="p-3 bg-gray-50 rounded-md">
            <div className="font-medium">{workOrder.description}</div>
            <div className="text-sm text-gray-600">
              Customer: {workOrder.account?.name || 'Unknown'}
            </div>
            <div className="text-sm text-gray-600">
              Status: {getStatusLabel(workOrder.status)}
            </div>
          </div>

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
              onClick={handleDelete}
              disabled={deleteWorkOrderMutation.isPending}
            >
              {deleteWorkOrderMutation.isPending ? 'Deleting...' : 'Delete Work Order'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
