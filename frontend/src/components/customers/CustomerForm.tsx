import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase-client';
import { secureApiClient } from '@/lib/secure-api-client';
import { Customer } from '@/types/customer';
import { ArrowLeftIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface CustomerFormProps {
  customer?: Customer;
  onSave: () => void;
  onCancel: () => void;
}

interface FormData {
  name: string;
  account_type: 'residential' | 'commercial' | 'industrial';
  status: 'active' | 'inactive';
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  billing_address: {
    address_line1: string;
    city: string;
    state: string;
    zip_code: string;
  };
  payment_method: 'credit_card' | 'bank_transfer' | 'invoice' | 'cash';
  billing_cycle: 'monthly' | 'quarterly' | 'annually';
  property_type: string;
  property_size: string;
  access_instructions: string;
  emergency_contact: string;
  preferred_contact_method: 'phone' | 'email' | 'text';
  ar_balance: number;
  // Profile fields
  business_name: string;
  business_type: string;
  segment_id: string;
  access_codes: string;
  special_instructions: string;
  preferred_language: string;
  timezone: string;
  contract_start_date: string;
  contract_type: 'monthly' | 'quarterly' | 'annually';
  contract_value: number;
  auto_renew: boolean;
  account_status: 'active' | 'inactive' | 'suspended';
  payment_status: 'current' | 'past_due' | 'overdue';
  service_status: 'active' | 'inactive' | 'suspended';
}

export default function CustomerForm({ customer, onSave, onCancel }: CustomerFormProps) {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    account_type: 'residential',
    status: 'active',
    phone: '',
    email: '',
    address: '',
    city: '',
    state: '',
    zip_code: '',
    billing_address: {
      address_line1: '',
      city: '',
      state: '',
      zip_code: '',
    },
    payment_method: 'credit_card',
    billing_cycle: 'monthly',
    property_type: '',
    property_size: '',
    access_instructions: '',
    emergency_contact: '',
    preferred_contact_method: 'phone',
    ar_balance: 0,
    business_name: '',
    business_type: '',
    segment_id: '',
    access_codes: '',
    special_instructions: '',
    preferred_language: 'English',
    timezone: 'America/Chicago',
    contract_start_date: '',
    contract_type: 'monthly',
    contract_value: 0,
    auto_renew: true,
    account_status: 'active',
    payment_status: 'current',
    service_status: 'active',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch segments for dropdown
  const { data: segments } = useQuery({
    queryKey: ['customer-segments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('customer_segments')
        .select('*')
        .eq('tenant_id', '7193113e-ece2-4f7b-ae8c-176df4367e28');
      if (error) throw error;
      return data;
    },
  });

  // Test database connection
  const { data: testAccounts } = useQuery({
    queryKey: ['test-accounts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('accounts')
        .select('count')
        .eq('tenant_id', '7193113e-ece2-4f7b-ae8c-176df4367e28')
        .limit(1);
      if (error) {
        console.error('Test query error:', error);
        return null;
      }
      return data;
    },
  });

  // Test tenant existence
  const { data: testTenant } = useQuery({
    queryKey: ['test-tenant'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tenants')
        .select('id, name')
        .eq('id', '7193113e-ece2-4f7b-ae8c-176df4367e28')
        .single();
      if (error) {
        console.error('Tenant query error:', error);
        return null;
      }
      return data;
    },
  });

  // Test basic Supabase connection
  const { data: testConnection } = useQuery({
    queryKey: ['test-connection'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase.auth.getUser();
        if (error) {
          console.error('Auth test error:', error);
          return { success: false, error: error.message };
        }
        return { success: true, user: data.user };
      } catch (err) {
        console.error('Connection test error:', err);
        return { success: false, error: 'Connection failed' };
      }
    },
  });

  // Initialize form data when editing
  useEffect(() => {
    if (customer) {
      const profile = customer.customer_profiles?.[0];
      setFormData({
        name: customer.name || '',
        account_type: customer.account_type || 'residential',
        status: customer.status || 'active',
        phone: customer.phone || '',
        email: customer.email || '',
        address: customer.address || '',
        city: customer.city || '',
        state: customer.state || '',
        zip_code: customer.zip_code || '',
        billing_address: customer.billing_address || {
          address_line1: customer.address || '',
          city: customer.city || '',
          state: customer.state || '',
          zip_code: customer.zip_code || '',
        },
        payment_method: customer.payment_method || 'credit_card',
        billing_cycle: customer.billing_cycle || 'monthly',
        property_type: customer.property_type || '',
        property_size: customer.property_size || '',
        access_instructions: customer.access_instructions || '',
        emergency_contact: customer.emergency_contact || '',
        preferred_contact_method: customer.preferred_contact_method || 'phone',
        ar_balance: customer.ar_balance || 0,
        business_name: profile?.business_name || '',
        business_type: profile?.business_type || '',
        segment_id: profile?.segment_id || '',
        access_codes: profile?.access_codes || '',
        special_instructions: profile?.special_instructions || '',
        preferred_language: profile?.preferred_language || 'English',
        timezone: profile?.timezone || 'America/Chicago',
        contract_start_date: profile?.contract_start_date ? new Date(profile.contract_start_date).toISOString().split('T')[0] : '',
        contract_type: profile?.contract_type || 'monthly',
        contract_value: profile?.contract_value || 0,
        auto_renew: profile?.auto_renew ?? true,
        account_status: profile?.account_status || 'active',
        payment_status: profile?.payment_status || 'current',
        service_status: profile?.service_status || 'active',
      });
    }
  }, [customer]);

  // Create/Update customer mutation
  const createCustomerMutation = useMutation({
    mutationFn: async (data: FormData) => {
      // Prepare account data for backend API
      const accountData = {
        name: data.name,
        account_type: data.account_type || 'commercial',
        status: data.status || 'active',
        phone: data.phone || null,
        email: data.email || null,
        address: data.address || null,
        city: data.city || null,
        state: data.state || null,
        zip_code: data.zip_code || null,
        billing_address: data.billing_address || null,
        payment_method: data.payment_method || null,
        billing_cycle: data.billing_cycle || null,
        property_type: data.property_type || null,
        property_size: data.property_size || null,
        access_instructions: data.access_instructions || null,
        emergency_contact: data.emergency_contact || null,
        preferred_contact_method: data.preferred_contact_method || null,
        ar_balance: data.ar_balance || 0,
      };

      console.log('Creating account via backend API:', accountData);

      // Use backend API to create account
      const account = await secureApiClient.accounts.create(accountData);
      console.log('Account created successfully:', account);

      // Create customer profile
      if (data.segment_id) {
        const { error: profileError } = await supabase
          .from('customer_profiles')
          .insert({
            tenant_id: '7193113e-ece2-4f7b-ae8c-176df4367e28',
            account_id: account.id,
            segment_id: data.segment_id,
            business_name: data.business_name,
            business_type: data.business_type,
            property_type: data.property_type,
            property_size: data.property_size,
            access_codes: data.access_codes,
            special_instructions: data.special_instructions,
            preferred_language: data.preferred_language,
            timezone: data.timezone,
            contract_start_date: data.contract_start_date,
            contract_type: data.contract_type,
            contract_value: data.contract_value,
            auto_renew: data.auto_renew,
            account_status: data.account_status,
            payment_status: data.payment_status,
            service_status: data.service_status,
          });

        if (profileError) throw profileError;
      }

      return account;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      onSave();
    },
  });

  const updateCustomerMutation = useMutation({
    mutationFn: async (data: FormData) => {
      if (!customer) throw new Error('No customer to update');

      // Update account
      const { error: accountError } = await supabase
        .from('accounts')
        .update({
          name: data.name,
          account_type: data.account_type,
          status: data.status,
          phone: data.phone,
          email: data.email,
          address: data.address,
          city: data.city,
          state: data.state,
          zip_code: data.zip_code,
          billing_address: data.billing_address,
          payment_method: data.payment_method,
          billing_cycle: data.billing_cycle,
          property_type: data.property_type,
          property_size: data.property_size,
          access_instructions: data.access_instructions,
          emergency_contact: data.emergency_contact,
          preferred_contact_method: data.preferred_contact_method,
          ar_balance: data.ar_balance,
        })
        .eq('id', customer.id);

      if (accountError) throw accountError;

      // Update or create profile
      const profile = customer.customer_profiles?.[0];
      if (profile) {
        const { error: profileError } = await supabase
          .from('customer_profiles')
          .update({
            segment_id: data.segment_id,
            business_name: data.business_name,
            business_type: data.business_type,
            property_type: data.property_type,
            property_size: data.property_size,
            access_codes: data.access_codes,
            special_instructions: data.special_instructions,
            preferred_language: data.preferred_language,
            timezone: data.timezone,
            contract_start_date: data.contract_start_date,
            contract_type: data.contract_type,
            contract_value: data.contract_value,
            auto_renew: data.auto_renew,
            account_status: data.account_status,
            payment_status: data.payment_status,
            service_status: data.service_status,
          })
          .eq('id', profile.id);

        if (profileError) throw profileError;
      } else if (data.segment_id) {
        const { error: profileError } = await supabase
          .from('customer_profiles')
          .insert({
            tenant_id: '7193113e-ece2-4f7b-ae8c-176df4367e28',
            account_id: customer.id,
            segment_id: data.segment_id,
            business_name: data.business_name,
            business_type: data.business_type,
            property_type: data.property_type,
            property_size: data.property_size,
            access_codes: data.access_codes,
            special_instructions: data.special_instructions,
            preferred_language: data.preferred_language,
            timezone: data.timezone,
            contract_start_date: data.contract_start_date,
            contract_type: data.contract_type,
            contract_value: data.contract_value,
            auto_renew: data.auto_renew,
            account_status: data.account_status,
            payment_status: data.payment_status,
            service_status: data.service_status,
          });

        if (profileError) throw profileError;
      }

      return customer;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      queryClient.invalidateQueries({ queryKey: ['customer', customer?.id] });
      onSave();
    },
  });

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';
    if (!formData.zip_code.trim()) newErrors.zip_code = 'ZIP code is required';

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      if (customer) {
        await updateCustomerMutation.mutateAsync(formData);
      } else {
        await createCustomerMutation.mutateAsync(formData);
      }
    } catch (error) {
      console.error('Error saving customer:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
      setErrors({ submit: `Error saving customer: ${error.message || 'Unknown error'}` });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleBillingAddressChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      billing_address: {
        ...prev.billing_address,
        [field]: value,
      },
    }));
  };

  const isEditMode = !!customer;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white shadow-sm border border-gray-200 rounded-lg mb-6">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={onCancel}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md"
              >
                <ArrowLeftIcon className="h-5 w-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {isEditMode ? 'Edit Customer' : 'Add New Customer'}
                </h1>
                <p className="text-sm text-gray-600">
                  {isEditMode ? 'Update customer information' : 'Create a new customer account'}
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-white shadow-sm border border-gray-200 rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Basic Information</h3>
            {/* Debug Info */}
            <div className="mt-2 text-xs text-gray-500">
              <div>Test Tenant: {testTenant ? `${testTenant.name} (${testTenant.id})` : 'Not found'}</div>
              <div>Test Accounts: {testAccounts ? 'Query successful' : 'Query failed'}</div>
              <div>Connection: {testConnection?.success ? 'Connected' : testConnection?.error || 'Testing...'}</div>
            </div>
          </div>
          <div className="px-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 ${
                    errors.name ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Account Type *</label>
                <select
                  value={formData.account_type}
                  onChange={(e) => handleInputChange('account_type', e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="residential">Residential</option>
                  <option value="commercial">Commercial</option>
                  <option value="industrial">Industrial</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Segment</label>
                <select
                  value={formData.segment_id}
                  onChange={(e) => handleInputChange('segment_id', e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="">Select a segment</option>
                  {segments?.map((segment) => (
                    <option key={segment.id} value={segment.id}>
                      {segment.segment_name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white shadow-sm border border-gray-200 rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Contact Information</h3>
          </div>
          <div className="px-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Email *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 ${
                    errors.email ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Phone *</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 ${
                    errors.phone ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Preferred Contact Method</label>
                <select
                  value={formData.preferred_contact_method}
                  onChange={(e) => handleInputChange('preferred_contact_method', e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="phone">Phone</option>
                  <option value="email">Email</option>
                  <option value="text">Text</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Emergency Contact</label>
                <input
                  type="text"
                  value={formData.emergency_contact}
                  onChange={(e) => handleInputChange('emergency_contact', e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Address Information */}
        <div className="bg-white shadow-sm border border-gray-200 rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Address Information</h3>
          </div>
          <div className="px-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Address *</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 ${
                    errors.address ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">City *</label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 ${
                    errors.city ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.city && <p className="mt-1 text-sm text-red-600">{errors.city}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">State *</label>
                <input
                  type="text"
                  value={formData.state}
                  onChange={(e) => handleInputChange('state', e.target.value)}
                  className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 ${
                    errors.state ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.state && <p className="mt-1 text-sm text-red-600">{errors.state}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">ZIP Code *</label>
                <input
                  type="text"
                  value={formData.zip_code}
                  onChange={(e) => handleInputChange('zip_code', e.target.value)}
                  className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 ${
                    errors.zip_code ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.zip_code && <p className="mt-1 text-sm text-red-600">{errors.zip_code}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Property Type</label>
                <input
                  type="text"
                  value={formData.property_type}
                  onChange={(e) => handleInputChange('property_type', e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Property Size</label>
                <input
                  type="text"
                  value={formData.property_size}
                  onChange={(e) => handleInputChange('property_size', e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Access Instructions</label>
                <textarea
                  value={formData.access_instructions}
                  onChange={(e) => handleInputChange('access_instructions', e.target.value)}
                  rows={3}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Business & Contract Information */}
        <div className="bg-white shadow-sm border border-gray-200 rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Business & Contract Information</h3>
          </div>
          <div className="px-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Business Name</label>
                <input
                  type="text"
                  value={formData.business_name}
                  onChange={(e) => handleInputChange('business_name', e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Business Type</label>
                <input
                  type="text"
                  value={formData.business_type}
                  onChange={(e) => handleInputChange('business_type', e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Contract Type</label>
                <select
                  value={formData.contract_type}
                  onChange={(e) => handleInputChange('contract_type', e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="annually">Annually</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Contract Value ($)</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.contract_value}
                  onChange={(e) => handleInputChange('contract_value', parseFloat(e.target.value) || 0)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Contract Start Date</label>
                <input
                  type="date"
                  value={formData.contract_start_date}
                  onChange={(e) => handleInputChange('contract_start_date', e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Payment Method</label>
                <select
                  value={formData.payment_method}
                  onChange={(e) => handleInputChange('payment_method', e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="credit_card">Credit Card</option>
                  <option value="bank_transfer">Bank Transfer</option>
                  <option value="invoice">Invoice</option>
                  <option value="cash">Cash</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Billing Cycle</label>
                <select
                  value={formData.billing_cycle}
                  onChange={(e) => handleInputChange('billing_cycle', e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="annually">Annually</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">AR Balance ($)</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.ar_balance}
                  onChange={(e) => handleInputChange('ar_balance', parseFloat(e.target.value) || 0)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.auto_renew}
                  onChange={(e) => handleInputChange('auto_renew', e.target.checked)}
                  className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-900">Auto Renew</label>
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700">Special Instructions</label>
              <textarea
                value={formData.special_instructions}
                onChange={(e) => handleInputChange('special_instructions', e.target.value)}
                rows={3}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <CheckIcon className="h-4 w-4 mr-2" />
            {isSubmitting ? 'Saving...' : (isEditMode ? 'Update Customer' : 'Create Customer')}
          </button>
        </div>

        {errors.submit && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-sm text-red-800">{errors.submit}</p>
          </div>
        )}
      </form>
    </div>
  );
}
