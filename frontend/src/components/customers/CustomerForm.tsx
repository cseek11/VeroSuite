import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase-client';
import { secureApiClient } from '@/lib/secure-api-client';
import { Customer } from '@/types/customer';
import { ArrowLeft, Check } from 'lucide-react';
import { logger } from '@/utils/logger';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Select from '@/components/ui/Select';
import Checkbox from '@/components/ui/Checkbox';

interface CustomerFormProps {
  customer?: Customer;
  onSave: () => void;
  onCancel: () => void;
}

// Zod validation schema
const customerFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  account_type: z.enum(['residential', 'commercial', 'industrial']),
  status: z.enum(['active', 'inactive']),
  phone: z.string().min(1, 'Phone is required'),
  email: z.string().email('Invalid email format').min(1, 'Email is required'),
  address: z.string().min(1, 'Address is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  zip_code: z.string().min(1, 'ZIP code is required'),
  billing_address: z.object({
    address_line1: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    zip_code: z.string().optional(),
  }).optional(),
  payment_method: z.enum(['credit_card', 'bank_transfer', 'invoice', 'cash']),
  billing_cycle: z.enum(['monthly', 'quarterly', 'annually']),
  property_type: z.string().optional(),
  property_size: z.string().optional(),
  access_instructions: z.string().optional(),
  emergency_contact: z.string().optional(),
  preferred_contact_method: z.enum(['phone', 'email', 'text']),
  ar_balance: z.number().min(0).default(0),
  business_name: z.string().optional(),
  business_type: z.string().optional(),
  segment_id: z.string().optional(),
  access_codes: z.string().optional(),
  special_instructions: z.string().optional(),
  preferred_language: z.string().optional(),
  timezone: z.string().optional(),
  contract_start_date: z.string().optional(),
  contract_type: z.enum(['monthly', 'quarterly', 'annually']).optional(),
  contract_value: z.number().min(0).default(0),
  auto_renew: z.boolean().default(true),
  account_status: z.enum(['active', 'inactive', 'suspended']).optional(),
  payment_status: z.enum(['current', 'past_due', 'overdue']).optional(),
  service_status: z.enum(['active', 'inactive', 'suspended']).optional(),
});

type FormData = z.infer<typeof customerFormSchema>;

export default function CustomerForm({ customer, onSave, onCancel }: CustomerFormProps) {
  const queryClient = useQueryClient();
  
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(customerFormSchema),
    defaultValues: {
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
    },
  });

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
        logger.error('Test query error', error, 'CustomerForm');
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
        logger.error('Tenant query error', error, 'CustomerForm');
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
          logger.error('Auth test error', error, 'CustomerForm');
          return { success: false, error: error.message };
        }
        return { success: true, user: data.user };
      } catch (err) {
        logger.error('Connection test error', err, 'CustomerForm');
        return { success: false, error: 'Connection failed' };
      }
    },
  });

  // Initialize form data when editing
  useEffect(() => {
    if (customer) {
      const profile = customer.customer_profiles?.[0];
      reset({
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
  }, [customer, reset]);

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

      logger.debug('Creating account via backend API', { accountData }, 'CustomerForm');

      // Use backend API to create account
      const account = await secureApiClient.accounts.create(accountData);
      logger.debug('Account created successfully', { accountId: account.id }, 'CustomerForm');

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

  const onSubmit = async (data: FormData) => {
    try {
      if (customer) {
        await updateCustomerMutation.mutateAsync(data);
      } else {
        await createCustomerMutation.mutateAsync(data);
      }
    } catch (error) {
      logger.error('Error saving customer', error, 'CustomerForm');
    }
  };

  const isEditMode = !!customer;

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-4 md:px-6">
      {/* Header */}
      <Card className="mb-4 sm:mb-6">
        <div className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={onCancel}
                className="p-2"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
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
      </Card>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Information */}
        <Card>
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
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    label="Name *"
                    error={errors.name?.message}
                  />
                )}
              />

              <Controller
                name="account_type"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    label="Account Type *"
                    options={[
                      { value: 'residential', label: 'Residential' },
                      { value: 'commercial', label: 'Commercial' },
                      { value: 'industrial', label: 'Industrial' },
                    ]}
                    error={errors.account_type?.message}
                  />
                )}
              />

              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    label="Status"
                    options={[
                      { value: 'active', label: 'Active' },
                      { value: 'inactive', label: 'Inactive' },
                    ]}
                    error={errors.status?.message}
                  />
                )}
              />

              <Controller
                name="segment_id"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value || ''}
                    onChange={(value) => field.onChange(value)}
                    label="Segment"
                    placeholder="Select a segment"
                    options={[
                      { value: '', label: 'Select a segment' },
                      ...(segments?.map((segment) => ({
                        value: segment.id,
                        label: segment.segment_name,
                      })) || []),
                    ]}
                    error={errors.segment_id?.message}
                  />
                )}
              />
            </div>
          </div>
        </Card>

        {/* Contact Information */}
        <Card>
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Contact Information</h3>
          </div>
          <div className="px-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="email"
                    label="Email *"
                    error={errors.email?.message}
                  />
                )}
              />

              <Controller
                name="phone"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="tel"
                    label="Phone *"
                    error={errors.phone?.message}
                  />
                )}
              />

              <Controller
                name="preferred_contact_method"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    label="Preferred Contact Method"
                    options={[
                      { value: 'phone', label: 'Phone' },
                      { value: 'email', label: 'Email' },
                      { value: 'text', label: 'Text' },
                    ]}
                    error={errors.preferred_contact_method?.message}
                  />
                )}
              />

              <Controller
                name="emergency_contact"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    label="Emergency Contact"
                    error={errors.emergency_contact?.message}
                  />
                )}
              />
            </div>
          </div>
        </Card>

        {/* Address Information */}
        <Card>
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Address Information</h3>
          </div>
          <div className="px-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Controller
                  name="address"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      label="Address *"
                      error={errors.address?.message}
                    />
                  )}
                />
              </div>

              <Controller
                name="city"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    label="City *"
                    error={errors.city?.message}
                  />
                )}
              />

              <Controller
                name="state"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    label="State *"
                    error={errors.state?.message}
                  />
                )}
              />

              <Controller
                name="zip_code"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    label="ZIP Code *"
                    error={errors.zip_code?.message}
                  />
                )}
              />

              <Controller
                name="property_type"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    label="Property Type"
                    error={errors.property_type?.message}
                  />
                )}
              />

              <Controller
                name="property_size"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    label="Property Size"
                    error={errors.property_size?.message}
                  />
                )}
              />

              <div className="md:col-span-2">
                <Controller
                  name="access_instructions"
                  control={control}
                  render={({ field }) => (
                    <Textarea
                      {...field}
                      label="Access Instructions"
                      rows={3}
                      error={errors.access_instructions?.message}
                    />
                  )}
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Business & Contract Information */}
        <Card>
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Business & Contract Information</h3>
          </div>
          <div className="px-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Controller
                name="business_name"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    label="Business Name"
                    error={errors.business_name?.message}
                  />
                )}
              />

              <Controller
                name="business_type"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    label="Business Type"
                    error={errors.business_type?.message}
                  />
                )}
              />

              <Controller
                name="contract_type"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value || ''}
                    onChange={(value) => field.onChange(value)}
                    label="Contract Type"
                    options={[
                      { value: 'monthly', label: 'Monthly' },
                      { value: 'quarterly', label: 'Quarterly' },
                      { value: 'annually', label: 'Annually' },
                    ]}
                    error={errors.contract_type?.message}
                  />
                )}
              />

              <Controller
                name="contract_value"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="number"
                    step="0.01"
                    label="Contract Value ($)"
                    value={field.value?.toString() || ''}
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                    error={errors.contract_value?.message}
                  />
                )}
              />

              <Controller
                name="contract_start_date"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="date"
                    label="Contract Start Date"
                    error={errors.contract_start_date?.message}
                  />
                )}
              />

              <Controller
                name="payment_method"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    label="Payment Method"
                    options={[
                      { value: 'credit_card', label: 'Credit Card' },
                      { value: 'bank_transfer', label: 'Bank Transfer' },
                      { value: 'invoice', label: 'Invoice' },
                      { value: 'cash', label: 'Cash' },
                    ]}
                    error={errors.payment_method?.message}
                  />
                )}
              />

              <Controller
                name="billing_cycle"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    label="Billing Cycle"
                    options={[
                      { value: 'monthly', label: 'Monthly' },
                      { value: 'quarterly', label: 'Quarterly' },
                      { value: 'annually', label: 'Annually' },
                    ]}
                    error={errors.billing_cycle?.message}
                  />
                )}
              />

              <Controller
                name="ar_balance"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="number"
                    step="0.01"
                    label="AR Balance ($)"
                    value={field.value?.toString() || ''}
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                    error={errors.ar_balance?.message}
                  />
                )}
              />

              <Controller
                name="auto_renew"
                control={control}
                render={({ field }) => (
                  <Checkbox
                    checked={field.value}
                    onChange={field.onChange}
                    label="Auto Renew"
                    error={errors.auto_renew?.message}
                  />
                )}
              />
            </div>

            <div className="mt-4">
              <Controller
                name="special_instructions"
                control={control}
                render={({ field }) => (
                  <Textarea
                    {...field}
                    label="Special Instructions"
                    rows={3}
                    error={errors.special_instructions?.message}
                  />
                )}
              />
            </div>
          </div>
        </Card>

        {/* Form Actions */}
        <div className="flex items-center justify-end space-x-3">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            loading={isSubmitting}
            icon={Check}
          >
            {isSubmitting ? 'Saving...' : (isEditMode ? 'Update Customer' : 'Create Customer')}
          </Button>
        </div>
      </form>
    </div>
  );
}
