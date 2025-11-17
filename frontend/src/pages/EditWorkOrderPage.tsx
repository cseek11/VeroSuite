import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useWorkOrder, useUpdateWorkOrder } from '@/hooks/useWorkOrders';
import { UpdateWorkOrderRequest } from '@/types/work-orders';
import WorkOrderForm from '@/components/work-orders/WorkOrderForm';
import { ArrowLeft, Edit } from 'lucide-react';
import { LoadingSpinner } from '@/components/LoadingSpinner';

export default function EditWorkOrderPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const updateWorkOrderMutation = useUpdateWorkOrder();

  // Only call useWorkOrder if id exists and is valid
  // This prevents "Validation failed (uuid is expected)" error
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-3 flex items-center justify-center">
        <LoadingSpinner text="Loading work order..." />
      </div>
    );
  }

  if (error || !workOrder) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-3">
        <div className="bg-white/80 backdrop-blur-xl rounded-xl shadow-xl border border-white/20 p-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">Work Order Not Found</h1>
            <p className="text-slate-600 mb-4">{error?.message || 'The work order could not be loaded.'}</p>
            <button
              onClick={() => navigate('/work-orders')}
              className="px-3 py-1.5 border border-slate-200 rounded-lg bg-white/80 backdrop-blur-sm text-slate-700 hover:bg-white hover:shadow-lg transition-all duration-200 font-medium text-sm flex items-center gap-2 mx-auto"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Work Orders
            </button>
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-3">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-xl rounded-xl shadow-xl border border-white/20 p-4 mb-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(`/work-orders/${id}`)}
              className="px-3 py-1.5 border border-slate-200 rounded-lg bg-white/80 backdrop-blur-sm text-slate-700 hover:bg-white hover:shadow-lg transition-all duration-200 font-medium text-sm flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg">
                <Edit className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Edit Work Order
                </h1>
                <p className="text-slate-600 text-sm mt-1">
                  Work Order #{workOrder.work_order_number || workOrder.id.slice(-8)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <div>
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






