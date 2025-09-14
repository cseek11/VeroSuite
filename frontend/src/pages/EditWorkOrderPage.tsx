import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useWorkOrder, useUpdateWorkOrder } from '@/hooks/useWorkOrders';
import { UpdateWorkOrderRequest } from '@/types/work-orders';
import WorkOrderForm from '@/components/work-orders/WorkOrderForm';
import { ArrowLeft } from 'lucide-react';
import Button from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/LoadingSpinner';

export default function EditWorkOrderPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const updateWorkOrderMutation = useUpdateWorkOrder();

  const { data: workOrder, isLoading, error } = useWorkOrder(id || '');

  const handleSubmit = async (data: UpdateWorkOrderRequest) => {
    if (!id) return;

    try {
      await updateWorkOrderMutation.mutateAsync({ id, data });
      // Navigate to work order detail page
      navigate(`/work-orders/${id}`);
    } catch (error) {
      console.error('Failed to update work order:', error);
      // TODO: Show error toast
    }
  };

  const handleCancel = () => {
    if (id) {
      navigate(`/work-orders/${id}`);
    } else {
      navigate('/work-orders');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner text="Loading work order..." />
      </div>
    );
  }

  if (error || !workOrder) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Work Order Not Found</h1>
            <p className="text-gray-600 mb-4">{error?.message || 'The work order could not be loaded.'}</p>
            <Button
              variant="outline"
              onClick={() => navigate('/work-orders')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Work Orders
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Convert work order to form data
  const initialData: UpdateWorkOrderRequest = {
    customer_id: workOrder.customer_id,
    assigned_to: workOrder.assigned_to,
    status: workOrder.status,
    priority: workOrder.priority,
    scheduled_date: workOrder.scheduled_date,
    completion_date: workOrder.completion_date,
    description: workOrder.description,
    notes: workOrder.notes,
    service_type: workOrder.service_type,
    estimated_duration: workOrder.estimated_duration,
    service_price: workOrder.service_price,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(`/work-orders/${id}`)}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Work Order
              </Button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Edit Work Order</h1>
                <p className="text-sm text-gray-600">
                  Work Order #{workOrder.work_order_number || workOrder.id.slice(-8)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="py-8">
        <WorkOrderForm
          initialData={initialData}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={updateWorkOrderMutation.isPending}
          mode="edit"
        />
      </div>
    </div>
  );
}






