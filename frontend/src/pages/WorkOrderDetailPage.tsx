import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import WorkOrderDetail from '@/components/work-orders/WorkOrderDetail';
import { WorkOrder, WorkOrderStatus } from '@/types/work-orders';

export default function WorkOrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  if (!id) {
    return (
      <div className="p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Work Order Not Found</h1>
          <p className="text-gray-600 mb-4">The work order ID is missing or invalid.</p>
          <button
            onClick={() => navigate('/work-orders')}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Back to Work Orders
          </button>
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Work Order Details</h1>
              <p className="text-sm text-gray-600">View and manage work order information</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <WorkOrderDetail
            workOrderId={id}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onStatusChange={handleStatusChange}
            onClose={handleClose}
          />
        </div>
      </div>
    </div>
  );
}






