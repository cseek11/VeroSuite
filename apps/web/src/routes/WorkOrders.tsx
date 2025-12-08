import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Plus, 
  Calendar, 
  User, 
  Clock, 
  AlertCircle,
  CheckCircle,
  XCircle,
  Edit,
  Trash2,
  Eye,
  X
} from 'lucide-react';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ReusablePopup } from '@/components/ui';
import { logger } from '@/utils/logger';

// Real API using enhanced-api
import { enhancedApi } from '@/lib/enhanced-api';
import { useDialog } from '@/hooks/useDialog';

const workOrdersApi = {
  list: async (filters: any) => {
    return await enhancedApi.workOrders.list(filters);
  },
  create: async (data: any) => {
    return await enhancedApi.workOrders.create(data);
  },
  update: async (id: string, data: any) => {
    return await enhancedApi.workOrders.update(id, data);
  },
  delete: async (id: string) => {
    return await enhancedApi.workOrders.delete(id);
  }
};

// Real customer search API
const customerSearchApi = {
  search: async (query: string): Promise<any[]> => {
    if (!query) return [];
    return await enhancedApi.accounts.search({ query, limit: 10 });
  }
};

// Real technicians API - use enhancedApi.technicians.list() for proper technician data
const techniciansApi = {
  list: async () => {
    return await enhancedApi.technicians.list();
  }
};

export default function WorkOrders() {
  const { showConfirm, DialogComponents: _DialogComponents } = useDialog();
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    assigned_to: '',
    customer_id: '',
    start_date: '',
    end_date: '',
    page: 1,
    limit: 20
  });
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedWorkOrder, setSelectedWorkOrder] = useState<any>(null);
  
  // Customer search state
  const [customerSearchQuery, setCustomerSearchQuery] = useState('');
  const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  
  // Technician selection state
  const [showTechnicianDropdown, setShowTechnicianDropdown] = useState(false);
  const [selectedTechnician, setSelectedTechnician] = useState<any>(null);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['work-orders', filters],
    queryFn: () => workOrdersApi.list(filters),
  });

  // Customer search query
  const { data: customerSearchResults } = useQuery({
    queryKey: ['customer-search', customerSearchQuery],
    queryFn: () => customerSearchApi.search(customerSearchQuery),
    enabled: customerSearchQuery.length > 0 || showCustomerDropdown,
  });

  // Technicians query
  const { data: technicians } = useQuery({
    queryKey: ['technicians'],
    queryFn: () => techniciansApi.list(),
  });

  // Populate selected values when editing
  React.useEffect(() => {
    if (selectedWorkOrder && showEditModal) {
      // Find and set the selected customer
      if (selectedWorkOrder.customer_id && customerSearchResults) {
        const customer = (customerSearchResults as any[]).find((c: any) => c.id === selectedWorkOrder.customer_id);
        if (customer) {
          setSelectedCustomer(customer);
        }
      }
      
      // Find and set the selected technician
      if (selectedWorkOrder.assigned_to && technicians) {
        const technician = (technicians as any[]).find((t: any) => t.id === selectedWorkOrder.assigned_to);
        if (technician) {
          setSelectedTechnician(technician);
        }
      }
    }
  }, [selectedWorkOrder, showEditModal, customerSearchResults, technicians]);

  const createMutation = useMutation({
    mutationFn: workOrdersApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['work-orders'] });
      setShowCreateModal(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => workOrdersApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['work-orders'] });
      setShowEditModal(false);
      setSelectedWorkOrder(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: workOrdersApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['work-orders'] });
    },
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'in-progress':
        return <Clock className="h-4 w-4 text-blue-500" />;
      case 'pending':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'canceled':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'canceled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Close dropdowns when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.customer-search-dropdown') && !target.closest('.technician-dropdown')) {
        setShowCustomerDropdown(false);
        setShowTechnicianDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-3">
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner text="Loading work orders..." />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-3">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">Error loading work orders: {(error as any)?.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-3">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-xl rounded-xl shadow-xl border border-white/20 p-4 mb-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-1">
              Work Orders
            </h1>
            <p className="text-slate-600 text-sm">
              Manage and track work orders for pest control services.
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Create Work Order
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white/80 backdrop-blur-xl rounded-xl shadow-xl border border-white/20 p-4 mb-4">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3">
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="px-3 py-2 border border-slate-200 rounded-lg bg-white/80 backdrop-blur-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-sm"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="canceled">Canceled</option>
          </select>

          <select
            value={filters.priority}
            onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
            className="px-3 py-2 border border-slate-200 rounded-lg bg-white/80 backdrop-blur-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-sm"
          >
            <option value="">All Priorities</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          <input
            type="date"
            value={filters.start_date}
            onChange={(e) => setFilters({ ...filters, start_date: e.target.value })}
            className="px-3 py-2 border border-slate-200 rounded-lg bg-white/80 backdrop-blur-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-sm"
            placeholder="Start Date"
          />

          <input
            type="date"
            value={filters.end_date}
            onChange={(e) => setFilters({ ...filters, end_date: e.target.value })}
            className="px-3 py-2 border border-slate-200 rounded-lg bg-white/80 backdrop-blur-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-sm"
            placeholder="End Date"
          />

          <input
            type="text"
            value={filters.customer_id}
            onChange={(e) => setFilters({ ...filters, customer_id: e.target.value })}
            className="px-3 py-2 border border-slate-200 rounded-lg bg-white/80 backdrop-blur-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-sm"
            placeholder="Customer ID"
          />

          <button
            onClick={() => setFilters({ status: '', priority: '', assigned_to: '', customer_id: '', start_date: '', end_date: '', page: 1, limit: 20 })}
            className="px-3 py-2 border border-slate-200 rounded-lg bg-white/80 backdrop-blur-sm hover:bg-slate-50 transition-all duration-200 text-sm flex items-center justify-center gap-2"
          >
            <XCircle className="h-4 w-4" />
            Clear
          </button>
        </div>
      </div>

      {/* Work Orders List */}
      <div className="bg-white/80 backdrop-blur-xl rounded-xl shadow-xl border border-white/20 p-4">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-3 px-4 font-semibold text-slate-700">Status</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-700">Priority</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-700">Customer</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-700">Description</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-700">Assigned To</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-700">Scheduled</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-700">Created</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data?.data?.map((workOrder: any) => (
                <tr key={workOrder.id} className="border-b border-slate-100 hover:bg-slate-50/50">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(workOrder.status)}
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(workOrder.status)}`}>
                        {workOrder.status}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(workOrder.priority)}`}>
                      {workOrder.priority}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div>
                      <div className="font-medium text-slate-900">{workOrder.account?.name}</div>
                      <div className="text-sm text-slate-500">{workOrder.account?.account_type}</div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="max-w-xs">
                      <div className="font-medium text-slate-900 truncate">{workOrder.description}</div>
                      {workOrder.notes && (
                        <div className="text-sm text-slate-500 truncate">{workOrder.notes}</div>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    {workOrder.assignedTechnician ? (
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-slate-400" />
                        <span className="text-sm">
                          {workOrder.assignedTechnician.first_name} {workOrder.assignedTechnician.last_name}
                        </span>
                      </div>
                    ) : (
                      <span className="text-sm text-slate-400">Unassigned</span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    {workOrder.scheduled_date ? (
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-slate-400" />
                        <span className="text-sm">{formatDate(workOrder.scheduled_date)}</span>
                      </div>
                    ) : (
                      <span className="text-sm text-slate-400">Not scheduled</span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm text-slate-500">{formatDate(workOrder.created_at)}</span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setSelectedWorkOrder(workOrder);
                          setShowEditModal(true);
                        }}
                        className="p-1 hover:bg-slate-100 rounded transition-colors"
                        title="Edit"
                      >
                        <Edit className="h-4 w-4 text-slate-600" />
                      </button>
                      <button
                        onClick={() => {
                          // View details - implement modal or navigation
                        }}
                        className="p-1 hover:bg-slate-100 rounded transition-colors"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4 text-slate-600" />
                      </button>
                      <button
                        onClick={async () => {
                          try {
                            const confirmed = await showConfirm({
                              title: 'Delete Work Order',
                              message: 'Are you sure you want to delete this work order?',
                              type: 'danger',
                              confirmText: 'Delete',
                              cancelText: 'Cancel',
                            });
                            if (confirmed) {
                              deleteMutation.mutate(workOrder.id);
                            }
                          } catch (error) {
                            logger.error('Failed to delete work order', { workOrderId: workOrder.id, error }, 'WorkOrders');
                          }
                        }}
                        className="p-1 hover:bg-red-100 rounded transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {data?.pagination && (
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-200">
            <div className="text-sm text-slate-600">
              Showing {((data.pagination.page - 1) * data.pagination.limit) + 1} to {Math.min(data.pagination.page * data.pagination.limit, data.pagination.total)} of {data.pagination.total} results
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setFilters({ ...filters, page: Math.max(1, filters.page - 1) })}
                disabled={filters.page <= 1}
                className="px-3 py-1 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                Previous
              </button>
              <span className="text-sm text-slate-600">
                Page {filters.page} of {data.pagination.totalPages}
              </span>
              <button
                onClick={() => setFilters({ ...filters, page: Math.min(data.pagination.totalPages, filters.page + 1) })}
                disabled={filters.page >= data.pagination.totalPages}
                className="px-3 py-1 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      <ReusablePopup
        isOpen={showCreateModal || showEditModal}
        onClose={() => {
          setShowCreateModal(false);
          setShowEditModal(false);
          setSelectedWorkOrder(null);
        }}
        title={showCreateModal ? 'Create Work Order' : 'Edit Work Order'}
        subtitle={showCreateModal ? 'Add a new work order to the system' : 'Update work order details'}
        size={{ width: 800, height: 600 }}
      >
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                                 const data = {
                   customer_id: formData.get('customer_id') as string,
                   assigned_to: formData.get('assigned_to') as string || null,
                   status: formData.get('status') as string,
                   priority: formData.get('priority') as string,
                   scheduled_date: formData.get('scheduled_date') as string || null,
                   description: formData.get('description') as string,
                   notes: formData.get('notes') as string || null,
                   // Service details - location_id will be handled by backend based on customer_id
                   service_type: formData.get('service_type') as string || null,
                   recurrence_rule: formData.get('recurrence_rule') as string || null,
                   estimated_duration: formData.get('estimated_duration') ? parseInt(formData.get('estimated_duration') as string) : null,
                   service_price: formData.get('service_price') ? parseFloat(formData.get('service_price') as string) : null,
                 };
                
                if (showCreateModal) {
                  createMutation.mutate(data);
                } else {
                  updateMutation.mutate({ id: selectedWorkOrder.id, data });
                }
              }}>
                
                                 {/* Basic Information */}
                 <div className="mb-6">
                   <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                     <div className="w-5 h-5 bg-indigo-100 rounded-lg flex items-center justify-center">
                       <svg className="w-3 h-3 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                       </svg>
                     </div>
                     Basic Information
                   </h3>
                   
                   <div className="grid grid-cols-1 gap-4">
                     <div className="relative customer-search-dropdown">
                       <label className="block text-sm font-semibold text-gray-700 mb-2">
                         Customer *
                       </label>
                       <div className="relative">
                         <input
                           type="text"
                           value={selectedCustomer ? `${selectedCustomer.name} (${selectedCustomer.account_type})` : customerSearchQuery}
                           onChange={(e) => {
                             setCustomerSearchQuery(e.target.value);
                             setSelectedCustomer(null);
                             setShowCustomerDropdown(true);
                           }}
                           onFocus={() => setShowCustomerDropdown(true)}
                           className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm"
                           placeholder="Search by name, address, phone, or ID..."
                           required
                         />
                         {selectedCustomer && (
                           <button
                             type="button"
                             onClick={() => {
                               setSelectedCustomer(null);
                               setCustomerSearchQuery('');
                             }}
                             className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                           >
                             <X className="h-5 w-5" />
                           </button>
                         )}
                       </div>
                       <input
                         type="hidden"
                         name="customer_id"
                         value={selectedCustomer?.id || selectedWorkOrder?.customer_id || ''}
                       />
                       
                                                {/* Customer Address Display - Right under customer selection */}
                         {selectedCustomer && (
                           <div className="mt-2 bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-lg p-3">
                             <div className="flex items-start gap-2">
                               <div className="flex-shrink-0">
                                 <div className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center">
                                   <svg className="w-3 h-3 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                   </svg>
                                 </div>
                               </div>
                               <div className="flex-1">
                                 <h4 className="font-semibold text-gray-900 text-sm mb-0.5">{selectedCustomer.name}</h4>
                                 <p className="text-gray-700 text-sm mb-0.5 font-medium">{selectedCustomer.address}</p>
                                 <p className="text-xs text-gray-600">
                                   {selectedCustomer.account_type} • {selectedCustomer.phone}
                                 </p>
                               </div>
                             </div>
                           </div>
                         )}
                       
                       {/* Customer Search Dropdown */}
                       {showCustomerDropdown && customerSearchResults && (
                         <div className="absolute z-50 w-full mt-2 bg-white/95 backdrop-blur-sm border border-gray-200 rounded-xl shadow-xl max-h-60 overflow-y-auto">
                           {(customerSearchResults as any[]).length > 0 ? (
                             (customerSearchResults as any[]).map((customer: any) => (
                               <div
                                 key={customer.id}
                                 onClick={() => {
                                   setSelectedCustomer(customer);
                                   setCustomerSearchQuery('');
                                   setShowCustomerDropdown(false);
                                 }}
                                 className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"
                               >
                                 <div className="font-semibold text-gray-900">{customer.name}</div>
                                 <div className="text-sm text-gray-600 font-medium">{customer.address}</div>
                                 <div className="text-xs text-gray-500 mt-1">
                                   {customer.account_type} • {customer.phone} • ID: {customer.id}
                                 </div>
                               </div>
                             ))
                           ) : (
                             <div className="px-4 py-3 text-gray-500">No customers found</div>
                           )}
                         </div>
                       )}
                     </div>
                     
                                          <div className="relative technician-dropdown">
                       <label className="block text-sm font-semibold text-gray-700 mb-2">
                         Assigned To
                       </label>
                       <div className="relative">
                         <input
                           type="text"
                           value={selectedTechnician ? `${selectedTechnician.first_name} ${selectedTechnician.last_name}` : ''}
                           onClick={() => setShowTechnicianDropdown(!showTechnicianDropdown)}
                           readOnly
                           className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent cursor-pointer transition-all duration-200 bg-white/80 backdrop-blur-sm"
                           placeholder="Select technician..."
                         />
                         {selectedTechnician && (
                           <button
                             type="button"
                             onClick={() => {
                               setSelectedTechnician(null);
                             }}
                             className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                           >
                             <X className="h-5 w-5" />
                           </button>
                         )}
                       </div>
                       <input
                         type="hidden"
                         name="assigned_to"
                         value={selectedTechnician?.id || selectedWorkOrder?.assigned_to || ''}
                       />
                       
                       {/* Technician Dropdown */}
                       {showTechnicianDropdown && technicians && (
                         <div className="absolute z-50 w-full mt-2 bg-white/95 backdrop-blur-sm border border-gray-200 rounded-xl shadow-xl max-h-60 overflow-y-auto">
                           {(technicians as any[]).length > 0 ? (
                             (technicians as any[]).map((technician: any) => (
                               <div
                                 key={technician.id}
                                 onClick={() => {
                                   setSelectedTechnician(technician);
                                   setShowTechnicianDropdown(false);
                                 }}
                                 className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"
                               >
                                 <div className="font-semibold text-gray-900">
                                   {technician.first_name} {technician.last_name}
                                 </div>
                                 <div className="text-sm text-gray-600">{technician.email}</div>
                                 <div className="text-xs text-gray-500">{technician.phone}</div>
                               </div>
                             ))
                           ) : (
                             <div className="px-4 py-3 text-gray-500">No technicians available</div>
                           )}
                         </div>
                       )}
                     </div>
                     
                     <div>
                       <label className="block text-sm font-semibold text-gray-700 mb-2">
                         Status
                       </label>
                       <select
                         name="status"
                         defaultValue={selectedWorkOrder?.status || 'pending'}
                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm"
                       >
                         <option value="pending">Pending</option>
                         <option value="in-progress">In Progress</option>
                         <option value="completed">Completed</option>
                         <option value="canceled">Canceled</option>
                       </select>
                     </div>
                     
                     <div>
                       <label className="block text-sm font-semibold text-gray-700 mb-2">
                         Priority
                       </label>
                       <select
                         name="priority"
                         defaultValue={selectedWorkOrder?.priority || 'medium'}
                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm"
                       >
                         <option value="low">Low</option>
                         <option value="medium">Medium</option>
                         <option value="high">High</option>
                         <option value="urgent">Urgent</option>
                       </select>
                     </div>
                     
                     <div>
                       <label className="block text-sm font-semibold text-gray-700 mb-2">
                         Scheduled Date
                       </label>
                       <input
                         type="datetime-local"
                         name="scheduled_date"
                         defaultValue={selectedWorkOrder?.scheduled_date ? selectedWorkOrder.scheduled_date.slice(0, 16) : ''}
                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm"
                       />
                     </div>
                  </div>
                </div>
                
                                 {/* Description and Notes */}
                 <div className="mb-6">
                   <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                     <div className="w-5 h-5 bg-purple-100 rounded-lg flex items-center justify-center">
                       <svg className="w-3 h-3 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                       </svg>
                     </div>
                     Description & Notes
                   </h3>
                   <div className="space-y-4">
                     <div>
                       <label className="block text-sm font-semibold text-gray-700 mb-2">
                         Description *
                       </label>
                       <textarea
                         name="description"
                         defaultValue={selectedWorkOrder?.description || ''}
                         required
                         rows={3}
                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm resize-none"
                         placeholder="Describe the work order in detail..."
                       />
                     </div>
                     
                     <div>
                       <label className="block text-sm font-semibold text-gray-700 mb-2">
                         Notes
                       </label>
                       <textarea
                         name="notes"
                         defaultValue={selectedWorkOrder?.notes || ''}
                         rows={2}
                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm resize-none"
                         placeholder="Additional notes, special instructions, or internal comments..."
                       />
                     </div>
                   </div>
                 </div>
                
                                 {/* Service Details */}
                 <div className="mb-6">
                   <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                     <div className="w-5 h-5 bg-green-100 rounded-lg flex items-center justify-center">
                       <svg className="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                       </svg>
                     </div>
                     Service Details
                   </h3>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div>
                       <label className="block text-sm font-semibold text-gray-700 mb-2">
                         Service Type
                       </label>
                       <input
                         type="text"
                         name="service_type"
                         defaultValue={selectedWorkOrder?.service_type || ''}
                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm"
                         placeholder="e.g., Pest Control, Termite Treatment"
                       />
                     </div>
                     
                     <div>
                       <label className="block text-sm font-semibold text-gray-700 mb-2">
                         Recurrence Rule
                       </label>
                       <input
                         type="text"
                         name="recurrence_rule"
                         defaultValue={selectedWorkOrder?.recurrence_rule || ''}
                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm"
                         placeholder="e.g., Monthly, Quarterly"
                       />
                     </div>
                     
                     <div>
                       <label className="block text-sm font-semibold text-gray-700 mb-2">
                         Estimated Duration (minutes)
                       </label>
                       <input
                         type="number"
                         name="estimated_duration"
                         defaultValue={selectedWorkOrder?.estimated_duration || 60}
                         min="1"
                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm"
                       />
                     </div>
                     
                     <div>
                       <label className="block text-sm font-semibold text-gray-700 mb-2">
                         Service Price ($)
                       </label>
                       <input
                         type="number"
                         name="service_price"
                         defaultValue={selectedWorkOrder?.service_price || ''}
                         min="0"
                         step="0.01"
                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm"
                         placeholder="0.00"
                       />
                     </div>
                   </div>
                 </div>
                
                                 <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                   <button
                     type="button"
                     onClick={() => {
                       setShowCreateModal(false);
                       setShowEditModal(false);
                       setSelectedWorkOrder(null);
                     }}
                     className="px-3 py-1.5 border border-slate-200 rounded-lg bg-white/80 backdrop-blur-sm text-slate-700 hover:bg-white hover:shadow-lg transition-all duration-200 font-medium text-sm"
                   >
                     Cancel
                   </button>
                   <button
                     type="submit"
                     disabled={createMutation.isPending || updateMutation.isPending}
                     className="px-3 py-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm"
                   >
                     {createMutation.isPending || updateMutation.isPending ? (
                       <div className="flex items-center gap-2">
                         <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                         {showCreateModal ? 'Creating...' : 'Updating...'}
                       </div>
                     ) : (
                       showCreateModal ? 'Create Work Order' : 'Update Work Order'
                     )}
                   </button>
                 </div>
              </form>
       </ReusablePopup>
    </div>
  );
}
