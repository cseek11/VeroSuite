import React, { useState, useMemo } from 'react';
import { useWorkOrders } from '@/hooks/useWorkOrders';
import { WorkOrder, WorkOrderFilters, WorkOrderStatus, WorkOrderPriority } from '@/types/work-orders';
import { 
  getStatusColor, 
  getStatusLabel, 
  getPriorityColor, 
  getPriorityLabel 
} from '@/types/work-orders';
import WorkOrderStatusManager from './WorkOrderStatusManager';
import { 
  Search, 
  Filter, 
  Plus, 
  Calendar,
  ChevronDown,
  ChevronUp,
  Eye,
  Edit,
  Trash2,
  AlertCircle
} from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { logger } from '@/utils/logger';

interface WorkOrdersListProps {
  onCreateWorkOrder?: () => void;
  onViewWorkOrder?: (workOrder: WorkOrder) => void;
  onEditWorkOrder?: (workOrder: WorkOrder) => void;
  onDeleteWorkOrder?: (workOrder: WorkOrder) => void;
  onStatusChange?: (workOrder: WorkOrder, newStatus: WorkOrderStatus) => void;
}

export default function WorkOrdersList({
  onCreateWorkOrder,
  onViewWorkOrder,
  onEditWorkOrder,
  onDeleteWorkOrder,
  onStatusChange,
}: WorkOrdersListProps) {
  const [filters, setFilters] = useState<WorkOrderFilters>({
    page: 1,
    limit: 20,
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedWorkOrders, setSelectedWorkOrders] = useState<string[]>([]);
  const [sortField, setSortField] = useState<keyof WorkOrder>('created_at');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const { data, isLoading, error, refetch } = useWorkOrders(filters);

  // Filter and sort work orders
  const filteredAndSortedWorkOrders = useMemo(() => {
    if (!data?.data) return [];

    let filtered = data.data;

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(workOrder => 
        workOrder.description.toLowerCase().includes(searchLower) ||
        (workOrder.account?.name || (workOrder as any).customer_name || '').toLowerCase().includes(searchLower) ||
        workOrder.work_order_number?.toLowerCase().includes(searchLower) ||
        workOrder.assignedTechnician?.first_name.toLowerCase().includes(searchLower) ||
        workOrder.assignedTechnician?.last_name.toLowerCase().includes(searchLower)
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      
      if (aValue === bValue) return 0;
      if (aValue === undefined || aValue === null) return 1;
      if (bValue === undefined || bValue === null) return -1;
      
      const comparison = aValue < bValue ? -1 : 1;
      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [data?.data, searchTerm, sortField, sortDirection]);

  const handleSort = (field: keyof WorkOrder) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleSelectWorkOrder = (workOrderId: string) => {
    setSelectedWorkOrders(prev => 
      prev.includes(workOrderId) 
        ? prev.filter(id => id !== workOrderId)
        : [...prev, workOrderId]
    );
  };

  const handleSelectAll = () => {
    if (selectedWorkOrders.length === filteredAndSortedWorkOrders.length) {
      setSelectedWorkOrders([]);
    } else {
      setSelectedWorkOrders(filteredAndSortedWorkOrders.map(wo => wo.id));
    }
  };

  const handleFilterChange = (key: keyof WorkOrderFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1, // Reset to first page when filters change
    }));
  };

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner text="Loading work orders..." />
      </div>
    );
  }

  if (error) {
    return (
      <Card className="p-6">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Work Orders</h3>
          <p className="text-gray-600 mb-4">{error.message}</p>
          <Button onClick={() => refetch()} variant="outline">
            Try Again
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Work Orders</h1>
          <p className="text-gray-600">
            {data?.pagination.total || 0} total work orders
          </p>
        </div>
        {onCreateWorkOrder && (
          <Button variant="primary" onClick={onCreateWorkOrder} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Create Work Order
          </Button>
        )}
      </div>

      {/* Search and Filters */}
      <Card className="p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search work orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Filter Toggle */}
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
          >
            <Filter className="h-4 w-4" />
            Filters
            {showFilters ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={filters.status || ''}
                  onChange={(e) => handleFilterChange('status', e.target.value || undefined)}
                  className="crm-input"
                >
                  <option value="">All Statuses</option>
                  <option value={WorkOrderStatus.PENDING}>Pending</option>
                  <option value={WorkOrderStatus.IN_PROGRESS}>In Progress</option>
                  <option value={WorkOrderStatus.COMPLETED}>Completed</option>
                  <option value={WorkOrderStatus.CANCELED}>Canceled</option>
                </select>
              </div>

              {/* Priority Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Priority
                </label>
                <select
                  value={filters.priority || ''}
                  onChange={(e) => handleFilterChange('priority', e.target.value || undefined)}
                  className="crm-input"
                >
                  <option value="">All Priorities</option>
                  <option value={WorkOrderPriority.LOW}>Low</option>
                  <option value={WorkOrderPriority.MEDIUM}>Medium</option>
                  <option value={WorkOrderPriority.HIGH}>High</option>
                  <option value={WorkOrderPriority.URGENT}>Urgent</option>
                </select>
              </div>

              {/* Date Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <Input
                  type="date"
                  value={filters.start_date || ''}
                  onChange={(e) => handleFilterChange('start_date', e.target.value || undefined)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date
                </label>
                <Input
                  type="date"
                  value={filters.end_date || ''}
                  onChange={(e) => handleFilterChange('end_date', e.target.value || undefined)}
                />
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Bulk Actions */}
      {selectedWorkOrders.length > 0 && (
        <div className="space-y-4">
          <Card className="p-4 bg-blue-50 border-blue-200">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-blue-900">
                {selectedWorkOrders.length} work order(s) selected
              </span>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setSelectedWorkOrders([])}
              >
                Clear Selection
              </Button>
            </div>
          </Card>
          
          <WorkOrderStatusManager
            workOrderIds={selectedWorkOrders}
            onBulkStatusChange={(workOrderIds, newStatus) => {
              logger.debug('Bulk status change', { workOrderIds, newStatus }, 'WorkOrdersList');
              setSelectedWorkOrders([]);
            }}
            mode="bulk"
          />
        </div>
      )}

      {/* Work Orders Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedWorkOrders.length === filteredAndSortedWorkOrders.length && filteredAndSortedWorkOrders.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('work_order_number')}
                >
                  Work Order #
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('description')}
                >
                  Description
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('account')}
                >
                  Customer
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('status')}
                >
                  Status
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('priority')}
                >
                  Priority
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('assignedTechnician')}
                >
                  Technician
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('scheduled_date')}
                >
                  Scheduled
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAndSortedWorkOrders.map((workOrder) => (
                <tr 
                  key={workOrder.id} 
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => onViewWorkOrder?.(workOrder)}
                >
                  <td className="px-6 py-4 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={selectedWorkOrders.includes(workOrder.id)}
                      onChange={() => handleSelectWorkOrder(workOrder.id)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {workOrder.work_order_number || `WO-${workOrder.id.slice(-8)}`}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 max-w-xs truncate">
                      {workOrder.description}
                    </div>
                    {workOrder.service_type && (
                      <div className="text-xs text-gray-500">
                        {workOrder.service_type}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {(workOrder as any).customer_name || workOrder.account?.name || 'Unknown Customer'}
                    </div>
                    <div className="text-xs text-gray-500">
                      {workOrder.account?.account_type}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${getStatusColor(workOrder.status)}-100 text-${getStatusColor(workOrder.status)}-800`}>
                      {getStatusLabel(workOrder.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${getPriorityColor(workOrder.priority)}-100 text-${getPriorityColor(workOrder.priority)}-800`}>
                      {getPriorityLabel(workOrder.priority)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {workOrder.assignedTechnician ? (
                      <div className="text-sm text-gray-900">
                        {workOrder.assignedTechnician.first_name} {workOrder.assignedTechnician.last_name}
                      </div>
                    ) : (
                      <span className="text-sm text-gray-500">Unassigned</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {workOrder.scheduled_date ? (
                      <div className="text-sm text-gray-900">
                        {formatDateTime(workOrder.scheduled_date)}
                      </div>
                    ) : (
                      <span className="text-sm text-gray-500">Not scheduled</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onViewWorkOrder?.(workOrder)}
                        className="text-blue-600 hover:text-blue-900"
                        title="View"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onEditWorkOrder?.(workOrder)}
                        className="text-gray-600 hover:text-gray-900"
                        title="Edit"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onDeleteWorkOrder?.(workOrder)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredAndSortedWorkOrders.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Calendar className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No work orders found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || Object.values(filters).some(f => f !== undefined && f !== '')
                ? 'Try adjusting your search or filters'
                : 'Get started by creating your first work order'
              }
            </p>
            {!searchTerm && !Object.values(filters).some(f => f !== undefined && f !== '') && onCreateWorkOrder && (
              <Button variant="primary" onClick={onCreateWorkOrder}>
                Create Work Order
              </Button>
            )}
          </div>
        )}
      </Card>

      {/* Pagination */}
      {data?.pagination && data.pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing {((data.pagination.page - 1) * data.pagination.limit) + 1} to{' '}
            {Math.min(data.pagination.page * data.pagination.limit, data.pagination.total)} of{' '}
            {data.pagination.total} results
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(data.pagination.page - 1)}
              disabled={data.pagination.page === 1}
            >
              Previous
            </Button>
            <span className="text-sm text-gray-700">
              Page {data.pagination.page} of {data.pagination.totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(data.pagination.page + 1)}
              disabled={data.pagination.page === data.pagination.totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
