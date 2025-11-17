import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FileText } from 'lucide-react';
import WorkOrderDetail from '@/components/work-orders/WorkOrderDetail';
import { WorkOrder, WorkOrderStatus } from '@/types/work-orders';

export default function WorkOrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  if (!id) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-3">
        <div className="bg-white/80 backdrop-blur-xl rounded-xl shadow-xl border border-white/20 p-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">Work Order Not Found</h1>
            <p className="text-slate-600 mb-4">The work order ID is missing or invalid.</p>
            <button
              onClick={() => navigate('/work-orders')}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-3 py-1.5 rounded-lg hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200 font-medium text-sm"
            >
              Back to Work Orders
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleEdit = (workOrder: WorkOrder) => {
    navigate(`/work-orders/${workOrder.id}/edit`);
  };

  const handleDelete = (workOrder: WorkOrder) => {
    // Navigate back to work orders list after deletion
    navigate('/work-orders');
  };

  const handleStatusChange = (workOrder: WorkOrder, newStatus: WorkOrderStatus) => {
    // Status change is handled by the component, just log for now
    console.log(`Work order ${workOrder.id} status changed to ${newStatus}`);
  };

  const handleClose = () => {
    navigate('/work-orders');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-3">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-xl rounded-xl shadow-xl border border-white/20 p-4 mb-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="p-1.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Work Order Details
            </h1>
            <p className="text-slate-600 text-sm mt-1">
              View and manage work order information
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div>
        <WorkOrderDetail
          workOrderId={id}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onStatusChange={handleStatusChange}
          onClose={handleClose}
        />
      </div>
    </div>
  );
}






