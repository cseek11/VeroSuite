import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreateWorkOrder } from '@/hooks/useWorkOrders';
import { CreateWorkOrderRequest } from '@/types/work-orders';
import WorkOrderForm from '@/components/work-orders/WorkOrderForm';
import { ArrowLeft } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function CreateWorkOrderPage() {
  const navigate = useNavigate();
  const createWorkOrderMutation = useCreateWorkOrder();

  const handleSubmit = async (data: CreateWorkOrderRequest) => {
    try {
      await createWorkOrderMutation.mutateAsync(data);
      // Navigate back to work orders list
      navigate('/work-orders');
    } catch (error) {
      console.error('Failed to create work order:', error);
      // TODO: Show error toast
    }
  };

  const handleCancel = () => {
    navigate('/work-orders');
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
                onClick={() => navigate('/work-orders')}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Work Orders
              </Button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Create Work Order</h1>
                <p className="text-sm text-gray-600">Create a new work order for a customer</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="py-8">
        <WorkOrderForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={createWorkOrderMutation.isPending}
          mode="create"
        />
      </div>
    </div>
  );
}
