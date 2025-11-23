/**
 * InvoiceGenerator Component
 * 
 * Generates invoices automatically from work orders.
 * Allows users to select work orders and create invoices with pre-populated data.
 * 
 * Features:
 * - Work order selection
 * - Auto-populate invoice data from work order
 * - Integration with InvoiceForm for final editing
 * - Support for multiple work orders
 */

// React import removed (not needed with new JSX transform), { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Heading, Text } from '@/components/ui';
import {
  FileText,
  Search,
  CheckCircle,
  Loader2,
  AlertCircle,
  Plus,
  Calendar,
  User,
} from 'lucide-react';
import { workOrders } from '@/lib/enhanced-api';
import { logger } from '@/utils/logger';
import { toast } from '@/utils/toast';
import type { WorkOrder, Account } from '@/types/enhanced-types';
import CustomerSearchSelector from '@/components/ui/CustomerSearchSelector';
import InvoiceForm from './InvoiceForm';

interface InvoiceGeneratorProps {
  onSuccess?: () => void;
}

export default function InvoiceGenerator({ onSuccess }: InvoiceGeneratorProps) {
  const [selectedCustomer, setSelectedCustomer] = useState<Account | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedWorkOrders, setSelectedWorkOrders] = useState<Set<string>>(new Set());
  const [showInvoiceForm, setShowInvoiceForm] = useState(false);
  const [workOrderToInvoice, setWorkOrderToInvoice] = useState<WorkOrder | null>(null);

  // Fetch work orders for selected customer
  const { data: workOrdersList, isLoading, error, refetch } = useQuery<WorkOrder[]>({
    queryKey: ['work-orders', selectedCustomer?.id],
    queryFn: () => {
      if (!selectedCustomer?.id) {
        return Promise.resolve([]);
      }
      return workOrders.getByCustomerId(selectedCustomer.id);
    },
    enabled: !!selectedCustomer?.id,
    onError: (error: unknown) => {
      logger.error('Failed to fetch work orders', error, 'InvoiceGenerator');
      toast.error('Failed to load work orders. Please try again.');
    },
  });

  // Filter work orders by search term and status
  const filteredWorkOrders = useMemo(() => {
    if (!workOrdersList) return [];

    let filtered = workOrdersList.filter(wo => {
      // Only show completed work orders that don't have invoices yet
      // Note: In a real implementation, you'd check if work order already has an invoice
      return wo.status === 'completed';
    });

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter((wo: WorkOrder) =>
        wo.description?.toLowerCase().includes(searchLower) ||
        wo.id.toLowerCase().includes(searchLower)
      );
    }

    return filtered;
  }, [workOrdersList, searchTerm]);

  const handleSelectWorkOrder = (workOrderId: string) => {
    const newSelection = new Set(selectedWorkOrders);
    if (newSelection.has(workOrderId)) {
      newSelection.delete(workOrderId);
    } else {
      newSelection.add(workOrderId);
    }
    setSelectedWorkOrders(newSelection);
  };

  const handleGenerateInvoice = async (workOrderId: string) => {
    const workOrder = workOrdersList?.find((wo: WorkOrder) => wo.id === workOrderId);
    if (!workOrder) {
      logger.error('Work order not found', { workOrderId }, 'InvoiceGenerator');
      toast.error('Work order not found');
      return;
    }

    if (!selectedCustomer) {
      logger.error('No customer selected', {}, 'InvoiceGenerator');
      toast.error('Please select a customer first');
      return;
    }

    // Set work order for invoice form
    setWorkOrderToInvoice(workOrder);
    setShowInvoiceForm(true);

    logger.debug('Opening invoice form for work order', { workOrderId, customerId: selectedCustomer.id }, 'InvoiceGenerator');
  };

  const handleBulkGenerate = () => {
    if (selectedWorkOrders.size === 0) {
      toast.error('Please select at least one work order');
      return;
    }

    if (selectedWorkOrders.size === 1) {
      const workOrderId = Array.from(selectedWorkOrders)[0];
      handleGenerateInvoice(workOrderId);
      return;
    }

    // For multiple work orders, we'll create separate invoices
    // In a real implementation, you might want to create a combined invoice
    toast.info('Multiple work orders selected. Creating invoices one by one...');
    
    const workOrderIds = Array.from(selectedWorkOrders);
    workOrderIds.forEach((id, index) => {
      setTimeout(() => {
        handleGenerateInvoice(id);
      }, index * 500); // Stagger the invoice creation
    });
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      completed: 'bg-green-100 text-green-800',
      in_progress: 'bg-blue-100 text-blue-800',
      assigned: 'bg-yellow-100 text-yellow-800',
      pending: 'bg-gray-100 text-gray-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const handleInvoiceFormSuccess = () => {
    setShowInvoiceForm(false);
    setWorkOrderToInvoice(null);
    setSelectedWorkOrders(new Set());
    refetch();
    if (onSuccess) {
      onSuccess();
    }
    toast.success('Invoice created successfully');
  };

  if (showInvoiceForm && workOrderToInvoice && selectedCustomer) {
    // Pre-populate invoice data from work order
    const invoiceData = {
      account_id: selectedCustomer.id,
      work_order_id: workOrderToInvoice.id,
      issue_date: new Date().toISOString().split('T')[0],
      due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      notes: `Invoice generated from work order: ${workOrderToInvoice.id}${workOrderToInvoice.description ? `\n${workOrderToInvoice.description}` : ''}`,
      items: [
        {
          service_type_id: '', // Will need to be selected or mapped from work order
          description: workOrderToInvoice.description || 'Service from work order',
          quantity: 1,
          unit_price: 0, // Will need to be calculated or entered
        },
      ],
    };

    return (
      <InvoiceForm
        invoice={null}
        isOpen={true}
        onClose={() => {
          setShowInvoiceForm(false);
          setWorkOrderToInvoice(null);
        }}
        onSuccess={handleInvoiceFormSuccess}
        initialData={invoiceData}
      />
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <Heading level={3} className="font-semibold flex items-center">
                <FileText className="w-6 h-6 mr-2 text-purple-600" />
                Generate Invoice from Work Orders
              </Heading>
              <Text variant="small" className="text-gray-600 mt-2">
                Select work orders and generate invoices automatically
              </Text>
            </div>
          </div>

          {/* Customer Selection */}
          <div className="mb-6">
            <Text variant="body" className="font-medium mb-2">
              Select Customer
            </Text>
            <CustomerSearchSelector
              value={selectedCustomer}
              onChange={(customer) => {
                setSelectedCustomer(customer);
                setSelectedWorkOrders(new Set());
                setSearchTerm('');
              }}
              placeholder="Search for customer..."
            />
          </div>

          {/* Search and Filters */}
          {selectedCustomer && (
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search work orders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          )}

          {/* Work Orders List */}
          {selectedCustomer && (
            <>
              {isLoading && (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
                  <span className="ml-3 text-gray-600">Loading work orders...</span>
                </div>
              )}

              {error && (
                <Card className="bg-red-50 border-red-200">
                  <div className="p-4">
                    <div className="flex items-start">
                      <AlertCircle className="w-5 h-5 text-red-600 mr-2 mt-0.5" />
                      <div>
                        <Text className="text-red-800 font-medium">Failed to load work orders</Text>
                        <Text variant="small" className="text-red-600 mt-1">
                          Please try again or contact support if the problem persists.
                        </Text>
                      </div>
                    </div>
                  </div>
                </Card>
              )}

              {!isLoading && !error && filteredWorkOrders.length === 0 && (
                <Card className="bg-gray-50 border-gray-200">
                  <div className="p-6 text-center">
                    <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <Text className="text-gray-600 font-medium">
                      No completed work orders found
                    </Text>
                    <Text variant="small" className="text-gray-500 mt-2">
                      Only completed work orders can be used to generate invoices.
                    </Text>
                  </div>
                </Card>
              )}

              {!isLoading && !error && filteredWorkOrders.length > 0 && (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <Text variant="body" className="font-medium">
                      {filteredWorkOrders.length} work order{filteredWorkOrders.length !== 1 ? 's' : ''} found
                    </Text>
                    {selectedWorkOrders.size > 0 && (
                      <Button
                        variant="primary"
                        icon={Plus}
                        onClick={handleBulkGenerate}
                      >
                        Generate Invoice{selectedWorkOrders.size > 1 ? 's' : ''} ({selectedWorkOrders.size})
                      </Button>
                    )}
                  </div>

                  <div className="space-y-3">
                    {filteredWorkOrders.map((workOrder: WorkOrder) => {
                      const isSelected = selectedWorkOrders.has(workOrder.id);
                      return (
                        <Card
                          key={workOrder.id}
                          className={`border-2 transition-colors cursor-pointer ${
                            isSelected
                              ? 'border-purple-500 bg-purple-50'
                              : 'border-gray-200 hover:border-purple-300'
                          }`}
                          onClick={() => handleSelectWorkOrder(workOrder.id)}
                        >
                          <div className="p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center space-x-3 mb-2">
                                  <div
                                    className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                                      isSelected
                                        ? 'border-purple-600 bg-purple-600'
                                        : 'border-gray-300'
                                    }`}
                                  >
                                    {isSelected && (
                                      <CheckCircle className="w-4 h-4 text-white" />
                                    )}
                                  </div>
                                  <Heading level={4} className="font-semibold">
                                    Work Order #{workOrder.id.slice(0, 8)}
                                  </Heading>
                                  <span
                                    className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(
                                      workOrder.status
                                    )}`}
                                  >
                                    {workOrder.status}
                                  </span>
                                </div>

                                <Text variant="body" className="text-gray-700 mb-3">
                                  {workOrder.description || 'No description'}
                                </Text>

                                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                                  {workOrder.scheduled_date && (
                                    <div className="flex items-center">
                                      <Calendar className="w-4 h-4 mr-1" />
                                      Scheduled: {formatDate(workOrder.scheduled_date)}
                                    </div>
                                  )}
                                  {workOrder.completion_date && (
                                    <div className="flex items-center">
                                      <CheckCircle className="w-4 h-4 mr-1" />
                                      Completed: {formatDate(workOrder.completion_date)}
                                    </div>
                                  )}
                                </div>
                              </div>

                              <div className="ml-4">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  icon={FileText}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleGenerateInvoice(workOrder.id);
                                  }}
                                >
                                  Generate Invoice
                                </Button>
                              </div>
                            </div>
                          </div>
                        </Card>
                      );
                    })}
                  </div>
                </>
              )}
            </>
          )}

          {!selectedCustomer && (
            <Card className="bg-gray-50 border-gray-200">
              <div className="p-6 text-center">
                <User className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <Text className="text-gray-600 font-medium">
                  Select a customer to view work orders
                </Text>
                <Text variant="small" className="text-gray-500 mt-2">
                  Choose a customer from the dropdown above to see their completed work orders.
                </Text>
              </div>
            </Card>
          )}
        </div>
      </Card>
    </div>
  );
}

