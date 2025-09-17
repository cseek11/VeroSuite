import React, { useState, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Card,
  Button,
  Typography,
  Input,
  Select,
  Textarea,
  Alert,
} from '@/components/ui/EnhancedUI';
import { secureApiClient } from '@/lib/secure-api-client';
import { supabase } from '@/lib/supabase-client';
import { agreementsApi, ServiceAgreement } from '@/lib/agreements-api';
import { CustomerSearch } from './CustomerSearch';

const agreementSchema = z.object({
  account_id: z.string().min(1, 'Customer is required'),
  service_type_id: z.string().min(1, 'Service type is required'),
  agreement_number: z.string().optional(),
  title: z.string().min(1, 'Agreement title is required'),
  description: z.string().optional(),
  start_date: z.string().min(1, 'Start date is required'),
  end_date: z.string().optional(),
  status: z.enum(['active', 'inactive', 'expired', 'cancelled']).default('active'),
  terms: z.string().optional(),
  pricing: z.number().min(0).optional(),
  billing_frequency: z.enum(['monthly', 'quarterly', 'annually', 'one_time']).default('monthly'),
});

type AgreementFormData = z.infer<typeof agreementSchema>;

interface AgreementFormProps {
  agreement?: ServiceAgreement;
  onSuccess: () => void;
  onCancel: () => void;
}

export function AgreementForm({ agreement, onSuccess, onCancel }: AgreementFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<AgreementFormData>({
    resolver: zodResolver(agreementSchema),
    defaultValues: {
      status: 'active',
      billing_frequency: 'monthly',
    },
  });

  // Fetch customers and service types
  const { data: customers, isLoading: customersLoading, error: customersError } = useQuery({
    queryKey: ['customers'],
    queryFn: () => secureApiClient.getAllAccounts(),
  });


  const { data: serviceTypes, isLoading: serviceTypesLoading, error: serviceTypesError } = useQuery({
    queryKey: ['service-types'],
    queryFn: async () => {
      console.log('Loading service types...');
      const { data, error } = await supabase
        .from('service_types')
        .select('*')
        .eq('tenant_id', '7193113e-ece2-4f7b-ae8c-176df4367e28')
        .eq('is_active', true)
        .order('service_name');
      if (error) {
        console.error('Error loading service types:', error);
        throw error;
      }
      console.log('Service types loaded:', data);
      return data;
    },
  });

  // Initialize form with existing agreement data
  useEffect(() => {
    if (agreement) {
      reset({
        account_id: agreement.account_id,
        service_type_id: agreement.service_type_id,
        agreement_number: agreement.agreement_number,
        title: agreement.title,
        description: agreement.description || '',
        start_date: agreement.start_date.split('T')[0], // Convert to YYYY-MM-DD format
        end_date: agreement.end_date ? agreement.end_date.split('T')[0] : '',
        status: agreement.status,
        terms: agreement.terms || '',
        pricing: agreement.pricing || 0,
        billing_frequency: agreement.billing_frequency,
      });
    }
  }, [agreement, reset]);

  const createMutation = useMutation({
    mutationFn: (data: AgreementFormData) => agreementsApi.createAgreement(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agreements'] });
      onSuccess();
    },
    onError: (error) => {
      console.error('Error creating agreement:', error);
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: AgreementFormData) => 
      agreementsApi.updateAgreement(agreement!.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agreements'] });
      onSuccess();
    },
    onError: (error) => {
      console.error('Error updating agreement:', error);
    },
  });

  const onSubmit = async (data: AgreementFormData) => {
    setIsSubmitting(true);
    try {
      if (agreement) {
        await updateMutation.mutateAsync(data);
      } else {
        // Remove agreement_number for new agreements (will be auto-generated)
        const { agreement_number, ...createData } = data;
        await createMutation.mutateAsync(createData);
      }
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div className="pt-6">
      {/* Header with close button */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          {agreement ? 'Edit Agreement' : 'Create New Agreement'}
        </h2>
        <button
          type="button"
          onClick={onCancel}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>


      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Customer Selection */}
        <CustomerSearch
          customers={customers || []}
          selectedCustomerId={watch('account_id')}
          onCustomerSelect={(customerId) => setValue('account_id', customerId)}
          error={errors.account_id?.message}
          placeholder="Search customers by name, email, phone, or address..."
        />

      {/* Service Type Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Service Type *
        </label>
        <Select
          value={watch('service_type_id') || ''}
          onChange={(value) => setValue('service_type_id', value)}
          error={errors.service_type_id?.message || (serviceTypesError ? 'Failed to load service types' : '')}
          disabled={serviceTypesLoading}
        >
          <option value="">
            {serviceTypesLoading ? 'Loading service types...' : 'Select a service type'}
          </option>
          {serviceTypes?.map((serviceType) => (
            <option key={serviceType.id} value={serviceType.id}>
              {serviceType.service_name}
            </option>
          ))}
        </Select>
        {serviceTypesError && (
          <p className="text-red-500 text-sm mt-1">
            Error loading service types. Please refresh the page.
          </p>
        )}
      </div>

      {/* Agreement Number and Title */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Agreement Number
          </label>
          <Input
            value={watch('agreement_number') || ''}
            onChange={(value) => setValue('agreement_number', value)}
            placeholder="Auto-generated (e.g., AG-2025-0001)"
            disabled={true}
            className="bg-gray-50"
            error={errors.agreement_number?.message}
          />
          <p className="text-xs text-gray-500 mt-1">
            Agreement number will be automatically generated when saved
          </p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Agreement Title *
          </label>
          <Input
            value={watch('title') || ''}
            onChange={(value) => setValue('title', value)}
            placeholder="e.g., Monthly Pest Control Service"
            error={errors.title?.message}
          />
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>
        <Textarea
          value={watch('description') || ''}
          onChange={(value) => setValue('description', value)}
          placeholder="Enter agreement description..."
          rows={3}
          error={errors.description?.message}
        />
      </div>

      {/* Dates */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Start Date *
          </label>
          <Input
            type="date"
            value={watch('start_date') || ''}
            onChange={(value) => setValue('start_date', value)}
            error={errors.start_date?.message}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            End Date
          </label>
          <Input
            type="date"
            value={watch('end_date') || ''}
            onChange={(value) => setValue('end_date', value)}
            error={errors.end_date?.message}
          />
        </div>
      </div>

      {/* Status and Billing Frequency */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Status
          </label>
          <Select
            value={watch('status') || 'active'}
            onChange={(value) => setValue('status', value as any)}
            error={errors.status?.message}
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="expired">Expired</option>
            <option value="cancelled">Cancelled</option>
          </Select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Billing Frequency
          </label>
          <Select
            value={watch('billing_frequency') || 'monthly'}
            onChange={(value) => setValue('billing_frequency', value as any)}
            error={errors.billing_frequency?.message}
          >
            <option value="monthly">Monthly</option>
            <option value="quarterly">Quarterly</option>
            <option value="annually">Annually</option>
            <option value="one_time">One Time</option>
          </Select>
        </div>
      </div>

      {/* Pricing */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Pricing ($)
        </label>
        <Input
          type="number"
          step="0.01"
          min="0"
          value={watch('pricing')?.toString() || ''}
          onChange={(value) => setValue('pricing', parseFloat(value) || 0)}
          placeholder="0.00"
          error={errors.pricing?.message}
        />
      </div>


      {/* Terms and Conditions */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Terms and Conditions
        </label>
        <Textarea
          value={watch('terms') || ''}
          onChange={(value) => setValue('terms', value)}
          placeholder="Enter terms and conditions..."
          rows={4}
          error={errors.terms?.message}
        />
      </div>

      {/* Error Display */}
      {(createMutation.error || updateMutation.error) && (
        <Alert type="error" title="Error">
          {createMutation.error?.message || updateMutation.error?.message}
        </Alert>
      )}

      {/* Form Actions */}
      <div className="flex gap-3 justify-end pt-4 border-t border-gray-200">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : agreement ? 'Update Agreement' : 'Create Agreement'}
        </Button>
      </div>
    </form>
    </div>
  );
}
