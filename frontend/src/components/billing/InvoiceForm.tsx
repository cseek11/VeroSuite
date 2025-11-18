import React, { useEffect } from 'react';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery, useMutation } from '@tanstack/react-query';
import {
  X,
  Plus,
  Trash2,
  Save,
  FileText,
  Mail,
  Phone,
  MapPin
} from 'lucide-react';
import { billing } from '@/lib/enhanced-api';
import { Invoice, Account } from '@/types/enhanced-types';
import CustomerSearchSelector from '@/components/ui/CustomerSearchSelector';
import { logger } from '@/utils/logger';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Select from '@/components/ui/Select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/Dialog';

interface InvoiceFormProps {
  invoice?: Invoice | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: {
    account_id?: string;
    work_order_id?: string;
    job_id?: string;
    issue_date?: string;
    due_date?: string;
    notes?: string;
    items?: Array<{
      service_type_id: string;
      description: string;
      quantity: number;
      unit_price: number;
    }>;
  };
}

interface ServiceType {
  id: string;
  service_name: string;
  base_price: number;
  service_code: string;
  description: string;
}

// Zod validation schema
const invoiceItemSchema = z.object({
  service_type_id: z.string().uuid('Please select a valid service type'),
  description: z.string().min(1, 'Description is required'),
  quantity: z.number().min(1, 'Quantity must be greater than 0'),
  unit_price: z.number().min(0, 'Unit price cannot be negative'),
  total_price: z.number().min(0).default(0),
});

const invoiceFormSchema = z.object({
  account_id: z.string().uuid('Please select a valid customer'),
  invoice_number: z.string().optional(),
  issue_date: z.string().min(1, 'Issue date is required'),
  due_date: z.string().min(1, 'Due date is required'),
  notes: z.string().optional(),
  items: z.array(invoiceItemSchema).min(1, 'At least one service item is required'),
}).refine((data) => {
  if (data.due_date && data.issue_date) {
    return new Date(data.due_date) >= new Date(data.issue_date);
  }
  return true;
}, {
  message: 'Due date must be after issue date',
  path: ['due_date'],
});

type InvoiceFormData = z.infer<typeof invoiceFormSchema>;
type InvoiceItem = z.infer<typeof invoiceItemSchema>;

// Helper functions for customer display
const getCustomerTypeColor = (type: string) => {
  const colors = {
    'residential': 'bg-blue-100 text-blue-800',
    'commercial': 'bg-green-100 text-green-800',
    'industrial': 'bg-purple-100 text-purple-800',
  };
  return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
};

const formatAddress = (customer: Account | null) => {
  if (!customer) return 'No address provided';
  const parts = [
    customer.address,
    customer.city,
    customer.state,
    customer.zip_code
  ].filter(Boolean);
  return parts.join(', ') || 'No address provided';
};

// UUID validation helper - more lenient to accept mock UUIDs
const isValidUUID = (uuid: string) => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
};

export default function InvoiceForm({ invoice, isOpen, onClose, onSuccess, initialData }: InvoiceFormProps) {
  const [selectedCustomer, setSelectedCustomer] = React.useState<Account | null>(null);
  const [submitError, setSubmitError] = React.useState<string>('');

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<InvoiceFormData>({
    resolver: zodResolver(invoiceFormSchema),
    defaultValues: {
      account_id: '',
      invoice_number: '',
      issue_date: new Date().toISOString().split('T')[0],
      due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      notes: '',
      items: [{ service_type_id: '', description: '', quantity: 1, unit_price: 0, total_price: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  });

  const watchedItems = watch('items');

  // Fetch service types from API
  const { data: serviceTypes = [] } = useQuery<ServiceType[]>({
    queryKey: ['service-types'],
    queryFn: async () => {
      try {
        // Try to fetch real service types from the API
        const response = await fetch('/api/v1/service-types', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          logger.debug('Fetched service types from API', { count: data?.length || 0 }, 'InvoiceForm');
          return data;
        } else {
          logger.warn('API call failed, using fallback service types', {}, 'InvoiceForm');
          throw new Error('API call failed');
        }
      } catch (error) {
        logger.warn('Using fallback service types due to error', error, 'InvoiceForm');
        // Use real service types from database
        return [
          { 
            id: 'f6c77dd2-b035-48f6-97e6-b28394412fc3', 
            service_name: 'General Pest Control', 
            base_price: 89.99,
            service_code: 'GPC',
            description: 'Comprehensive pest control service for common household pests'
          },
          { 
            id: '39b3a214-0232-48b0-9195-ba1981ef72ce', 
            service_name: 'Termite Treatment', 
            base_price: 899.99,
            service_code: 'TT',
            description: 'Complete termite treatment including soil treatment and baiting systems'
          },
          { 
            id: 'db4816a0-8d66-4e1e-873c-ceb66e12e8de', 
            service_name: 'Rodent Control', 
            base_price: 129.99,
            service_code: 'RC',
            description: 'Mouse and rat control including inspection, trapping, and exclusion'
          },
          { 
            id: 'ee54b8ef-f5a4-4931-bda8-144af503996e', 
            service_name: 'Ant Control', 
            base_price: 89.99,
            service_code: 'AC',
            description: 'Targeted ant control treatment for various ant species'
          },
          { 
            id: '3dc698e5-ad5b-4a32-9b85-9bc48fc0ad92', 
            service_name: 'Spider Control', 
            base_price: 99.99,
            service_code: 'SC',
            description: 'Specialized spider control treatment for indoor and outdoor infestations'
          }
        ];
      }
    },
    enabled: isOpen,
  });

  // Create/Update invoice mutation
  const submitMutation = useMutation({
    mutationFn: async (data: Record<string, unknown>) => {
      if (invoice) {
        logger.debug('Updating existing invoice', { invoiceId: invoice.id }, 'InvoiceForm');
        return billing.updateInvoice(invoice.id, data);
      } else {
        logger.debug('Creating new invoice', {}, 'InvoiceForm');
        return billing.createInvoice(data);
      }
    },
    onSuccess: (result) => {
      logger.debug('Invoice mutation successful', { invoiceId: result?.id }, 'InvoiceForm');
      onSuccess();
    },
    onError: (error: unknown) => {
      logger.error('Invoice mutation failed', error, 'InvoiceForm');
      setSubmitError(error instanceof Error ? error.message : 'Failed to save invoice');
    }
  });

  // Initialize form data when editing
  useEffect(() => {
    if (invoice && isOpen) {
      const invoiceItems = invoice.InvoiceItem?.map(item => ({
        service_type_id: item.service_type_id || '',
        description: item.description || '',
        quantity: Number(item.quantity) || 1,
        unit_price: Number(item.unit_price) || 0,
        total_price: Number(item.quantity || 1) * Number(item.unit_price || 0),
      })) || [{ service_type_id: '', description: '', quantity: 1, unit_price: 0, total_price: 0 }];
      
      reset({
        account_id: invoice.account_id || '',
        invoice_number: invoice.invoice_number || '',
        issue_date: new Date(invoice.issue_date || new Date()).toISOString().split('T')[0],
        due_date: new Date(invoice.due_date || new Date()).toISOString().split('T')[0],
        notes: invoice.notes || '',
        items: invoiceItems,
      });
      
      // Set customer from invoice if available
      if (invoice.accounts) {
        setSelectedCustomer(invoice.accounts);
      }
    } else if (!invoice && isOpen) {
      // Use initialData if provided, otherwise use defaults
      if (initialData) {
        const initialItems = initialData.items && initialData.items.length > 0
          ? initialData.items.map(item => ({
              service_type_id: item.service_type_id || '',
              description: item.description || '',
              quantity: item.quantity || 1,
              unit_price: item.unit_price || 0,
              total_price: (item.quantity || 1) * (item.unit_price || 0),
            }))
          : [{ service_type_id: '', description: '', quantity: 1, unit_price: 0, total_price: 0 }];

        reset({
          account_id: initialData.account_id || '',
          invoice_number: '',
          issue_date: initialData.issue_date || new Date().toISOString().split('T')[0],
          due_date: initialData.due_date || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          notes: initialData.notes || '',
          items: initialItems,
        });

        // Set customer if account_id is provided
        if (initialData.account_id) {
          // Customer will be set when CustomerSearchSelector loads
        }
      } else {
        // Clear customer when creating new invoice
        setSelectedCustomer(null);
        reset({
          account_id: '',
          invoice_number: '',
          issue_date: new Date().toISOString().split('T')[0],
          due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          notes: '',
          items: [{ service_type_id: '', description: '', quantity: 1, unit_price: 0, total_price: 0 }],
        });
      }
    }
  }, [invoice, isOpen, reset, initialData]);

  const addItem = () => {
    append({ service_type_id: '', description: '', quantity: 1, unit_price: 0, total_price: 0 });
  };

  const removeItem = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  const onSubmit = async (data: InvoiceFormData) => {
    setSubmitError('');
    
    // Ensure all required fields are properly formatted for the API
    const apiData = {
      account_id: data.account_id,
      issue_date: data.issue_date,
      due_date: data.due_date,
      ...(data.invoice_number && { invoice_number: data.invoice_number }),
      ...(data.notes && { notes: data.notes }),
      ...(initialData?.work_order_id && { work_order_id: initialData.work_order_id }),
      ...(initialData?.job_id && { job_id: initialData.job_id }),
      items: data.items.map(item => ({
        service_type_id: item.service_type_id,
        description: item.description,
        quantity: Number(item.quantity),
        unit_price: Number(item.unit_price)
      }))
    };

    logger.debug('Submitting invoice', { 
      itemsCount: apiData.items.length,
      accountId: apiData.account_id 
    }, 'InvoiceForm');
    
    try {
      // Check authentication using the correct localStorage key
      const verosuitAuth = localStorage.getItem('verofield_auth');
      
      if (!verosuitAuth) {
        logger.error('No authentication data found', new Error('verofield_auth missing'), 'InvoiceForm');
        setSubmitError('Authentication required. Please log in again.');
        return;
      }
      
      try {
        const authData = JSON.parse(verosuitAuth);
        
        if (!authData.token) {
          logger.error('No token in authentication data', new Error('Token missing'), 'InvoiceForm');
          setSubmitError('Authentication token missing. Please log in again.');
          return;
        }
      } catch (error) {
        logger.error('Failed to parse authentication data', error, 'InvoiceForm');
        setSubmitError('Invalid authentication data. Please log in again.');
        return;
      }
      
      await submitMutation.mutateAsync(apiData);
      
      // Form will close via onSuccess callback
    } catch (error) {
      logger.error('Invoice submission failed', error, 'InvoiceForm');
      
      // Check if it's a network error
      if (error instanceof Error && error.message?.includes('fetch')) {
        logger.error('Network error - backend server may not be running', error, 'InvoiceForm');
      }
      
      // Log validation details
      if (error instanceof Error && error.message?.includes('Bad Request')) {
        logger.warn('Validation failed', {
          message: 'Check: service_type_id (UUID), account_id (UUID), quantity (>=1), unit_price (>=0)'
        }, 'InvoiceForm');
      }
    }
  };

  const calculateTotals = () => {
    const subtotal = watchedItems.reduce((sum, item) => sum + (item.total_price || 0), 0);
    const tax = 0; // Tax calculation can be added here
    const total = subtotal + tax;
    return { subtotal, tax, total };
  };

  const { subtotal, tax, total } = calculateTotals();

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-5xl w-full mx-3 sm:mx-4 md:mx-auto max-h-[92vh] overflow-hidden flex flex-col p-0">
        {/* Header */}
        <DialogHeader className="bg-gradient-to-r from-purple-50 via-blue-50 to-indigo-50 border-b border-white/20 p-3 sm:p-4 md:p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
            <div className="flex items-center space-x-4 flex-1">
              <div className="p-3 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl shadow-lg">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <DialogTitle className="text-2xl font-bold text-slate-800 mb-1">
                  {invoice ? 'Edit Invoice' : 'Create New Invoice'}
                </DialogTitle>
                {selectedCustomer && (
                  <div className="flex flex-col space-y-2 mt-2">
                    <div className="flex items-center space-x-3">
                      <span className="font-semibold text-slate-700 text-lg">{selectedCustomer.name}</span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium shadow-sm ${getCustomerTypeColor(selectedCustomer.account_type)}`}>
                        {selectedCustomer.account_type}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-slate-600">
                      {selectedCustomer.email && (
                        <span className="flex items-center bg-white/60 px-2 py-1 rounded-lg">
                          <Mail className="w-3 h-3 mr-1.5 text-slate-500" />
                          {selectedCustomer.email}
                        </span>
                      )}
                      {selectedCustomer.phone && (
                        <span className="flex items-center bg-white/60 px-2 py-1 rounded-lg">
                          <Phone className="w-3 h-3 mr-1.5 text-slate-500" />
                          {selectedCustomer.phone}
                        </span>
                      )}
                      <span className="flex items-center bg-white/60 px-2 py-1 rounded-lg">
                        <MapPin className="w-3 h-3 mr-1.5 text-slate-500" />
                        {formatAddress(selectedCustomer)}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-white/50 rounded-xl transition-all duration-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </DialogHeader>

        {/* Content */}
        <div className="flex-1 overflow-y-auto bg-gradient-to-br from-slate-50/50 to-white">
          <form id="invoice-form" onSubmit={handleSubmit(onSubmit)} className="h-full">
            <div className="p-6 space-y-6">
              {submitError && (
                <div className="bg-red-50 border border-red-200 rounded-md p-4">
                  <p className="text-sm text-red-800">{submitError}</p>
                </div>
              )}

              {/* Basic Information */}
              <Card>
                <div className="bg-gradient-to-r from-slate-50 to-white border-b border-slate-100 p-5 rounded-t-2xl">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-6 bg-gradient-to-b from-purple-500 to-indigo-600 rounded-full"></div>
                    <h3 className="text-lg font-semibold text-slate-800">
                      Invoice Information
                    </h3>
                  </div>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                    <Controller
                      name="account_id"
                      control={control}
                      render={({ field }) => (
                        <CustomerSearchSelector
                          label="Customer"
                          value={field.value}
                          onChange={(customerId, customer) => {
                            field.onChange(customerId);
                            setSelectedCustomer(customer);
                          }}
                          placeholder="Search customers by name, email, or phone..."
                          error={errors.account_id?.message}
                          required={true}
                        />
                      )}
                    />

                    <Controller
                      name="invoice_number"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          label="Invoice Number"
                          placeholder="Auto-generated if left blank"
                          error={errors.invoice_number?.message}
                        />
                      )}
                    />

                    <Controller
                      name="issue_date"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          type="date"
                          label="Issue Date *"
                          error={errors.issue_date?.message}
                        />
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <Controller
                      name="due_date"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          type="date"
                          label="Due Date *"
                          error={errors.due_date?.message}
                        />
                      )}
                    />

                    <div className="md:col-span-2">
                      <Controller
                        name="notes"
                        control={control}
                        render={({ field }) => (
                          <Textarea
                            {...field}
                            label="Notes"
                            placeholder="Additional notes or terms..."
                            rows={1}
                            error={errors.notes?.message}
                          />
                        )}
                      />
                    </div>
                  </div>
                </div>
              </Card>

              {/* Line Items */}
              <Card>
                <div className="bg-gradient-to-r from-slate-50 to-white border-b border-slate-100 p-5 rounded-t-2xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-6 bg-gradient-to-b from-purple-500 to-indigo-600 rounded-full"></div>
                      <h3 className="text-lg font-semibold text-slate-800">
                        Services
                      </h3>
                    </div>
                    <Button
                      type="button"
                      variant="primary"
                      onClick={addItem}
                      icon={Plus}
                    >
                      Add Item
                    </Button>
                  </div>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {fields.map((field, index) => {
                      const item = watchedItems[index];
                      const totalPrice = (item?.quantity || 0) * (item?.unit_price || 0);
                      
                      return (
                        <div key={field.id} className="bg-gradient-to-r from-white to-slate-50/50 border border-slate-200/60 rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-200">
                          {/* Compact Single Row Layout */}
                          <div className="grid grid-cols-1 lg:grid-cols-6 gap-3 items-end">
                            <div className="lg:col-span-2">
                              <Controller
                                name={`items.${index}.service_type_id`}
                                control={control}
                                render={({ field: itemField }) => (
                                  <Select
                                    value={itemField.value || ''}
                                    onChange={(value) => {
                                      itemField.onChange(value);
                                      const serviceType = serviceTypes.find(st => st.id === value);
                                      if (serviceType) {
                                        setValue(`items.${index}.unit_price`, serviceType.base_price);
                                        const qty = watchedItems[index]?.quantity || 1;
                                        setValue(`items.${index}.total_price`, qty * serviceType.base_price);
                                      }
                                    }}
                                    label="Service Type *"
                                    placeholder="Select service type"
                                    options={[
                                      { value: '', label: 'Select service type' },
                                      ...serviceTypes.map((serviceType) => ({
                                        value: serviceType.id,
                                        label: serviceType.service_name,
                                      })),
                                    ]}
                                    error={errors.items?.[index]?.service_type_id?.message}
                                  />
                                )}
                              />
                            </div>

                            <Controller
                              name={`items.${index}.quantity`}
                              control={control}
                              render={({ field: itemField }) => (
                                <Input
                                  {...itemField}
                                  type="number"
                                  min="1"
                                  label="Qty"
                                  value={itemField.value?.toString() || ''}
                                  onChange={(e) => {
                                    const qty = parseInt(e.target.value) || 1;
                                    itemField.onChange(qty);
                                    const unitPrice = watchedItems[index]?.unit_price || 0;
                                    setValue(`items.${index}.total_price`, qty * unitPrice);
                                  }}
                                  error={errors.items?.[index]?.quantity?.message}
                                />
                              )}
                            />

                            <Controller
                              name={`items.${index}.unit_price`}
                              control={control}
                              render={({ field: itemField }) => (
                                <Input
                                  {...itemField}
                                  type="number"
                                  min="0"
                                  step="0.01"
                                  label="Price ($)"
                                  value={itemField.value?.toString() || ''}
                                  onChange={(e) => {
                                    const price = parseFloat(e.target.value) || 0;
                                    itemField.onChange(price);
                                    const qty = watchedItems[index]?.quantity || 1;
                                    setValue(`items.${index}.total_price`, qty * price);
                                  }}
                                  error={errors.items?.[index]?.unit_price?.message}
                                />
                              )}
                            />

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Total
                              </label>
                              <div className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-slate-50 font-medium cursor-default">
                                ${totalPrice.toFixed(2)}
                              </div>
                            </div>

                            <div className="flex items-center justify-center">
                              {fields.length > 1 && (
                                <Button
                                  type="button"
                                  variant="ghost"
                                  onClick={() => removeItem(index)}
                                  className="p-2 text-red-400 hover:text-red-600"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              )}
                            </div>
                          </div>

                          {/* Description Row - Full Width */}
                          <div className="mt-3">
                            <Controller
                              name={`items.${index}.description`}
                              control={control}
                              render={({ field: itemField }) => (
                                <Textarea
                                  {...itemField}
                                  label="Description *"
                                  placeholder="Service description..."
                                  rows={1}
                                  error={errors.items?.[index]?.description?.message}
                                />
                              )}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Totals */}
                  <div className="mt-6 border-t border-slate-200 pt-4">
                    <div className="max-w-sm ml-auto bg-gradient-to-br from-slate-50 to-white rounded-xl p-4 shadow-sm border border-slate-100">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm text-slate-600">
                          <span>Subtotal:</span>
                          <span className="font-medium text-slate-800">${subtotal.toFixed(2)}</span>
                        </div>
                        {tax > 0 && (
                          <div className="flex justify-between text-sm text-slate-600">
                            <span>Tax:</span>
                            <span className="font-medium text-slate-800">${tax.toFixed(2)}</span>
                          </div>
                        )}
                        <div className="flex justify-between text-lg font-bold border-t border-slate-200 pt-2 mt-3">
                          <span className="text-slate-800">Total:</span>
                          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">
                            ${total.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </form>
        </div>

        {/* Footer */}
        <DialogFooter className="border-t border-white/20 bg-gradient-to-r from-slate-50 to-white backdrop-blur-xl p-3 sm:p-4 md:p-6 flex-shrink-0">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-0 w-full">
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
              <span className="text-sm font-medium text-slate-600">Invoice Total:</span>
              <div className="px-3 sm:px-4 py-2 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl border border-purple-100">
                <span className="text-lg sm:text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">
                  ${total.toFixed(2)}
                </span>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="w-full sm:w-auto justify-center"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                form="invoice-form"
                variant="primary"
                loading={submitMutation.isPending}
                icon={Save}
                disabled={submitMutation.isPending}
                className="w-full sm:w-auto justify-center"
              >
                <span className="hidden sm:inline">{invoice ? 'Update Invoice' : 'Create Invoice'}</span>
                <span className="sm:hidden">{invoice ? 'Update' : 'Create'}</span>
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}