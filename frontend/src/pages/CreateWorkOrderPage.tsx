import { useNavigate } from 'react-router-dom';
import { useCreateWorkOrder } from '@/hooks/useWorkOrders';
import { CreateWorkOrderRequest } from '@/types/work-orders';
import WorkOrderForm from '@/components/work-orders/WorkOrderForm';
import { logger } from '@/utils/logger';
import { ArrowLeft, Plus } from 'lucide-react';

export default function CreateWorkOrderPage() {
  const navigate = useNavigate();
  const createWorkOrderMutation = useCreateWorkOrder();

  const handleSubmit = async (data: CreateWorkOrderRequest) => {
    try {
      await createWorkOrderMutation.mutateAsync(data);
      // Navigate back to work orders list
      navigate('/work-orders');
    } catch (error) {
      logger.error('Failed to create work order', error, 'CreateWorkOrderPage');
      // TODO: Show error toast
    }
  };

  const handleCancel = () => {
    navigate('/work-orders');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-3">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-xl rounded-xl shadow-xl border border-white/20 p-4 mb-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/work-orders')}
              className="px-3 py-1.5 border border-slate-200 rounded-lg bg-white/80 backdrop-blur-sm text-slate-700 hover:bg-white hover:shadow-lg transition-all duration-200 font-medium text-sm flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg">
                <Plus className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Create Work Order
                </h1>
                <p className="text-slate-600 text-sm mt-1">
                  Create a new work order for a customer
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <div>
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
