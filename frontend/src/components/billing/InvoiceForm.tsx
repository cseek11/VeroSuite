// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import {
  Card,
  Typography,
  Button,
  Alert
} from '@/components/ui/EnhancedUI';
import {
  X,
  Plus,
  Trash2,
  Save,
  FileText,
  Loader2,
  Mail,
  Phone,
  MapPin
} from 'lucide-react';
import { billing } from '@/lib/enhanced-api';
import { Invoice } from '@/types/enhanced-types';
import CustomerSearchSelector from '@/components/ui/CustomerSearchSelector';

interface InvoiceFormProps {
  invoice?: Invoice | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface InvoiceItem {
  service_type_id: string;
  description: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

interface ServiceType {
  id: string;
  service_name: string;
  base_price: number;
  service_code: string;
  description: string;
}

// Helper functions for customer display
const getCustomerTypeColor = (type: string) => {
  const colors = {
    'residential': 'bg-blue-100 text-blue-800',
    'commercial': 'bg-green-100 text-green-800',
    'industrial': 'bg-purple-100 text-purple-800',
  };
  return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
};

const formatAddress = (customer: any) => {
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

export default function InvoiceForm({ invoice, isOpen, onClose, onSuccess }: InvoiceFormProps) {
  const [formData, setFormData] = useState({
    account_id: '',
    invoice_number: '',
    issue_date: new Date().toISOString().split('T')[0],
    due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    notes: '',
    items: [{ service_type_id: '', description: '', quantity: 1, unit_price: 0, total_price: 0 }] as InvoiceItem[]
  });
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string>('');

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
          console.log('✅ Fetched service types from API:', data);
          return data;
        } else {
          console.log('⚠️ API call failed, using fallback service types');
          throw new Error('API call failed');
        }
      } catch (error) {
        console.log('⚠️ Using fallback service types due to error:', error);
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
    mutationFn: async (data: any) => {
      console.log('🔧 Inside mutation function with data:', data);
      if (invoice) {
        console.log('📝 Updating existing invoice:', invoice.id);
        return billing.updateInvoice(invoice.id, data);
      } else {
        console.log('🆕 Creating new invoice');
        return billing.createInvoice(data);
      }
    },
    onSuccess: (result) => {
      console.log('🎉 Mutation onSuccess called with result:', result);
      onSuccess();
    },
    onError: (error: any) => {
      console.log('💥 Mutation onError called with error:', error);
      setSubmitError(error.message || 'Failed to save invoice');
    }
  });

  // Initialize form data when editing
  useEffect(() => {
    if (invoice) {
      setFormData({
        account_id: invoice.account_id || '',
        invoice_number: invoice.invoice_number || '',
        issue_date: new Date(invoice.issue_date || new Date()).toISOString().split('T')[0],
        due_date: new Date(invoice.due_date || new Date()).toISOString().split('T')[0],
        notes: invoice.notes || '',
        items: invoice.InvoiceItem?.map(item => ({
          service_type_id: item.service_type_id || '',
          description: item.description || '',
          quantity: Number(item.quantity) || 1,
          unit_price: Number(item.unit_price) || 0,
          total_price: Number(item.total_price) || 0
        } as InvoiceItem)) || [{ service_type_id: '', description: '', quantity: 1, unit_price: 0, total_price: 0 }]
      });
      // Set customer from invoice if available
      if (invoice.accounts) {
        setSelectedCustomer(invoice.accounts);
      }
    } else {
      // Clear customer when creating new invoice
      setSelectedCustomer(null);
    }
  }, [invoice, isOpen]);

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const updateItem = (index: number, field: keyof InvoiceItem, value: any) => {
    const newItems = [...formData.items];
    newItems[index] = { ...newItems[index], [field]: value };
    
    // Recalculate total price for this item
    if (field === 'quantity' || field === 'unit_price') {
      newItems[index].total_price = newItems[index].quantity * newItems[index].unit_price;
    }
    
    setFormData(prev => ({ ...prev, items: newItems }));
  };

  const addItem = () => {
    const newItem: InvoiceItem = { 
      service_type_id: '', 
      description: '', 
      quantity: 1, 
      unit_price: 0, 
      total_price: 0 
    };
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, newItem]
    }));
  };

  const removeItem = (index: number) => {
    if (formData.items.length > 1) {
      setFormData(prev => ({
        ...prev,
        items: prev.items.filter((_, i) => i !== index)
      }));
    }
  };

  const handleServiceTypeChange = (index: number, serviceTypeId: string) => {
    // Update the service_type_id first
    const newItems = [...formData.items];
    newItems[index] = { ...newItems[index], service_type_id: serviceTypeId };
    
    // Find the service type and update other fields
    const serviceType = serviceTypes.find(st => st.id === serviceTypeId);
    
    if (serviceType) {
      // Only update price, keep description empty for user to fill
      newItems[index].unit_price = serviceType.base_price;
      newItems[index].total_price = newItems[index].quantity * serviceType.base_price;
      // Clear description so user can enter their own
      if (!newItems[index].description) {
        newItems[index].description = '';
      }
    }
    
    // Update the entire items array at once
    setFormData(prev => ({ ...prev, items: newItems }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    console.log('🔍 Starting form validation...');

    if (!formData.account_id) {
      newErrors.account_id = 'Customer is required';
    }
    if (!formData.issue_date) {
      newErrors.issue_date = 'Issue date is required';
    }
    if (!formData.due_date) {
      newErrors.due_date = 'Due date is required';
    }
    if (formData.due_date && formData.issue_date && new Date(formData.due_date) < new Date(formData.issue_date)) {
      newErrors.due_date = 'Due date must be after issue date';
    }

    // Validate items
    formData.items.forEach((item, index) => {
      if (!item.service_type_id) {
        newErrors[`item_${index}_service_type`] = 'Service type is required';
      } else if (!isValidUUID(item.service_type_id)) {
        newErrors[`item_${index}_service_type`] = 'Invalid service type selection';
      }
      if (!item.description) {
        newErrors[`item_${index}_description`] = 'Description is required';
      }
      if (item.quantity <= 0) {
        newErrors[`item_${index}_quantity`] = 'Quantity must be greater than 0';
      }
      if (item.unit_price < 0) {
        newErrors[`item_${index}_unit_price`] = 'Unit price cannot be negative';
      }
    });

    // Validate at least one item exists
    if (formData.items.length === 0) {
      newErrors.items = 'At least one service item is required';
    }

    // Additional UUID validation
    if (formData.account_id && !isValidUUID(formData.account_id)) {
      newErrors.account_id = 'Invalid customer selection';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('🎯 Form submission triggered!');
    setSubmitError('');

    if (!validateForm()) {
      console.log('❌ Form validation failed - check form fields');
      return;
    }
    
    console.log('✅ Form validation passed, proceeding with submission...');

    // Debug: Log the data being sent
    console.log('📤 Submitting invoice data:', formData);
    
    // Ensure all required fields are properly formatted for the API
    const apiData = {
      account_id: formData.account_id,
      issue_date: formData.issue_date,
      due_date: formData.due_date,
      ...(formData.invoice_number && { invoice_number: formData.invoice_number }),
      ...(formData.notes && { notes: formData.notes }),
      items: formData.items.map(item => ({
        service_type_id: item.service_type_id,
        description: item.description,
        quantity: Number(item.quantity),
        unit_price: Number(item.unit_price)
      }))
    };

    console.log('📤 API formatted data:', apiData);
    console.log('📋 Items being sent:', apiData.items);
    console.log('🔍 First item details:', apiData.items[0]);
    console.log('🔍 Service type ID being sent:', apiData.items[0]?.service_type_id);
    console.log('🔍 Available service types:', serviceTypes.map(st => ({ id: st.id, name: st.service_name })));
    
    try {
      console.log('🚀 Attempting to submit invoice with data:', apiData);
      console.log('🔄 Calling submitMutation.mutateAsync...');
      
      // Check authentication using the correct localStorage key
      console.log('🔍 All localStorage keys:', Object.keys(localStorage));
      const verosuitAuth = localStorage.getItem('verosuite_auth');
      console.log('🔐 VeroSuite auth data exists:', !!verosuitAuth);
      
      // Also check other possible auth keys
      const supabaseAuth = localStorage.getItem('supabase.auth.token');
      const jwtToken = localStorage.getItem('jwt');
      console.log('🔍 Other auth keys - supabase.auth.token:', !!supabaseAuth, 'jwt:', !!jwtToken);
      
      if (!verosuitAuth) {
        console.error('❌ No authentication data found in verosuite_auth!');
        setSubmitError('Authentication required. Please log in again.');
        return;
      }
      
      try {
        const authData = JSON.parse(verosuitAuth);
        console.log('🔐 Auth token exists:', !!authData.token);
        console.log('🏢 Tenant ID from auth:', authData.tenantId);
        console.log('👤 User ID from auth:', authData.user?.id);
        
        if (!authData.token) {
          console.error('❌ No token in authentication data!');
          setSubmitError('Authentication token missing. Please log in again.');
          return;
        }
      } catch (error) {
        console.error('❌ Failed to parse authentication data:', error);
        setSubmitError('Invalid authentication data. Please log in again.');
        return;
      }
      
      const result = await submitMutation.mutateAsync(apiData);
      console.log('✅ Invoice submitted successfully:', result);
      
      // Form will close via onSuccess callback
    } catch (error) {
      console.error('❌ Invoice submission failed:', error);
      console.error('📋 Failed submission data:', apiData);
      
      // Check if it's a network error
      if (error.message?.includes('fetch')) {
        console.error('🌐 Network error - check if backend server is running on port 3001');
      }
      
      // Log validation details
      if (error.message?.includes('Bad Request')) {
        console.error('🔍 Validation might have failed. Check:');
        console.error('  - service_type_id must be valid UUID');
        console.error('  - account_id must be valid UUID');
        console.error('  - quantity must be >= 1');
        console.error('  - unit_price must be >= 0');
      }
    }
  };

  const calculateTotals = () => {
    const subtotal = formData.items.reduce((sum, item) => sum + item.total_price, 0);
    const tax = 0; // Tax calculation can be added here
    const total = subtotal + tax;
    return { subtotal, tax, total };
  };

  const { subtotal, tax, total } = calculateTotals();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 max-w-5xl w-full h-[92vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-purple-50 via-blue-50 to-indigo-50 border-b border-white/20">
          <div className="flex items-center justify-between p-6">
            <div className="flex items-center space-x-4 flex-1">
              <div className="p-3 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl shadow-lg">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <Typography variant="h3" className="font-bold text-slate-800 mb-1">
                  {invoice ? 'Edit Invoice' : 'Create New Invoice'}
                </Typography>
                {selectedCustomer && (
                  <div className="flex flex-col space-y-2">
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
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto bg-gradient-to-br from-slate-50/50 to-white">
          <form id="invoice-form" onSubmit={handleSubmit} className="h-full">
            <div className="p-6 space-y-6">
              {submitError && (
                <Alert type="error" title="Error">
                  {submitError}
                </Alert>
              )}

              {/* Basic Information */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/30">
                <div className="bg-gradient-to-r from-slate-50 to-white border-b border-slate-100 p-5 rounded-t-2xl">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-6 bg-gradient-to-b from-purple-500 to-indigo-600 rounded-full"></div>
                    <Typography variant="h4" className="font-semibold text-slate-800">
                      Invoice Information
                    </Typography>
                  </div>
                </div>
                <div className="p-6">
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                    <div>
                      <CustomerSearchSelector
                        label="Customer"
                        value={formData.account_id}
                        onChange={(customerId, customer) => {
                          updateFormData('account_id', customerId);
                          setSelectedCustomer(customer);
                        }}
                        placeholder="Search customers by name, email, or phone..."
                        error={errors.account_id}
                        required={true}
                      />
                    </div>

                    <div>
                      <label className="crm-label">
                        Invoice Number
                      </label>
                      <input
                        type="text"
                        value={formData.invoice_number}
                        onChange={(e) => updateFormData('invoice_number', e.target.value)}
                        placeholder="Auto-generated if left blank"
                        className="crm-input"
                      />
                    </div>

                    <div>
                      <label className="crm-label">
                        Issue Date *
                      </label>
                      <input
                        type="date"
                        value={formData.issue_date}
                        onChange={(e) => updateFormData('issue_date', e.target.value)}
                        className={`crm-input ${errors.issue_date ? 'border-red-500' : ''}`}
                      />
                      {errors.issue_date && (
                        <p className="crm-error">{errors.issue_date}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <div>
                      <label className="crm-label">
                        Due Date *
                      </label>
                      <input
                        type="date"
                        value={formData.due_date}
                        onChange={(e) => updateFormData('due_date', e.target.value)}
                        className={`crm-input ${errors.due_date ? 'border-red-500' : ''}`}
                      />
                      {errors.due_date && (
                        <p className="crm-error">{errors.due_date}</p>
                      )}
                    </div>

                    <div className="md:col-span-2">
                      <label className="crm-label">
                        Notes
                      </label>
                      <textarea
                        value={formData.notes}
                        onChange={(e) => updateFormData('notes', e.target.value)}
                        placeholder="Additional notes or terms..."
                        className="crm-textarea"
                        style={{ minHeight: '44px', resize: 'vertical', width: '100%' }}
                        rows={1}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Line Items */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/30">
                <div className="bg-gradient-to-r from-slate-50 to-white border-b border-slate-100 p-5 rounded-t-2xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-6 bg-gradient-to-b from-purple-500 to-indigo-600 rounded-full"></div>
                      <Typography variant="h4" className="font-semibold text-slate-800">
                        Services
                      </Typography>
                    </div>
                    <button
                      type="button"
                      onClick={addItem}
                      className="flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-4 py-2 rounded-xl hover:from-purple-600 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-200 text-sm font-medium"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Item</span>
                    </button>
                  </div>
                </div>
                <div className="p-6">

                  <div className="space-y-4">
                    {formData.items.map((item, index) => (
                      <div key={`item-${index}-${item.service_type_id}`} className="bg-gradient-to-r from-white to-slate-50/50 border border-slate-200/60 rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-200">
                        {/* Compact Single Row Layout */}
                        <div className="grid grid-cols-1 lg:grid-cols-6 gap-3 items-end">
                          <div className="lg:col-span-2">
                            <label className="crm-label">
                              Service Type *
                            </label>
                            <select
                              value={item.service_type_id || ''}
                              onChange={(e) => handleServiceTypeChange(index, e.target.value)}
                              className={`crm-select ${errors[`item_${index}_service_type`] ? 'border-red-500' : ''}`}
                            >
                              <option value="">Select service type</option>
                              {serviceTypes.map((serviceType) => (
                                <option key={serviceType.id} value={serviceType.id}>
                                  {serviceType.service_name}
                                </option>
                              ))}
                            </select>
                            {errors[`item_${index}_service_type`] && (
                              <p className="crm-error">{errors[`item_${index}_service_type`]}</p>
                            )}
                          </div>

                          <div>
                            <label className="crm-label">
                              Qty
                            </label>
                            <input
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 1)}
                              className={`crm-input ${errors[`item_${index}_quantity`] ? 'border-red-500' : ''}`}
                            />
                            {errors[`item_${index}_quantity`] && (
                              <p className="crm-error">{errors[`item_${index}_quantity`]}</p>
                            )}
                          </div>

                          <div>
                            <label className="crm-label">
                              Price ($)
                            </label>
                            <input
                              type="number"
                              min="0"
                              step="0.01"
                              value={item.unit_price}
                              onChange={(e) => updateItem(index, 'unit_price', parseFloat(e.target.value) || 0)}
                              className={`crm-input ${errors[`item_${index}_unit_price`] ? 'border-red-500' : ''}`}
                            />
                            {errors[`item_${index}_unit_price`] && (
                              <p className="crm-error">{errors[`item_${index}_unit_price`]}</p>
                            )}
                          </div>

                          <div>
                            <label className="crm-label">
                              Total
                            </label>
                            <div className="crm-input bg-slate-50 font-medium cursor-default">
                              ${item.total_price.toFixed(2)}
                            </div>
                          </div>

                          <div className="flex items-center justify-center">
                            {formData.items.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeItem(index)}
                                className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 group"
                                title="Remove item"
                              >
                                <Trash2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Description Row - Full Width */}
                        <div className="mt-3">
                          <label className="crm-label">
                            Description *
                          </label>
                          <textarea
                            value={item.description}
                            onChange={(e) => updateItem(index, 'description', e.target.value)}
                            placeholder="Service description..."
                            className={`crm-textarea ${errors[`item_${index}_description`] ? 'border-red-500' : ''}`}
                            style={{ minHeight: '44px', resize: 'vertical', width: '100%' }}
                            rows={1}
                          />
                          {errors[`item_${index}_description`] && (
                            <p className="crm-error">{errors[`item_${index}_description`]}</p>
                          )}
                        </div>
                      </div>
                    ))}
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
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="border-t border-white/20 bg-gradient-to-r from-slate-50 to-white backdrop-blur-xl p-6 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-slate-600">Invoice Total:</span>
              <div className="px-4 py-2 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl border border-purple-100">
                <span className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">
                  ${total.toFixed(2)}
                </span>
              </div>
            </div>
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 bg-white/80 backdrop-blur-sm border border-slate-200 text-slate-700 rounded-xl hover:bg-white hover:shadow-lg transition-all duration-200 text-sm font-medium flex items-center gap-2"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="invoice-form"
                disabled={submitMutation.isPending}
                className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200 text-sm font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    {invoice ? 'Update Invoice' : 'Create Invoice'}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}