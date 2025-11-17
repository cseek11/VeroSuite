import { useState, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Select from '@/components/ui/Select';
import { supabase } from '@/lib/supabase-client';
import { agreementsApi, ServiceAgreement } from '@/lib/agreements-api';
import CustomerSearchSelector from '@/components/ui/CustomerSearchSelector';

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
    control,
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


  const { data: serviceTypes, isLoading: serviceTypesLoading, error: serviceTypesError } = useQuery({
    queryKey: ['service-types'],
      queryFn: async () => {
        const { data, error } = await supabase
          .from('service_types')
          .select('*')
          .eq('tenant_id', '7193113e-ece2-4f7b-ae8c-176df4367e28')
          .eq('is_active', true)
          .order('service_name');
        if (error) {
          throw error;
        }
        return data;
      },
  });

  // Initialize form with existing agreement data
  useEffect(() => {
    if (!agreement || !agreement.start_date) return;
    
    const startDateStr = String(agreement.start_date);
    const startDateFormatted = startDateStr.includes('T') ? startDateStr.split('T')[0]! : startDateStr;
    const resetData: AgreementFormData = {
      account_id: agreement.account_id || '',
      service_type_id: agreement.service_type_id || '',
      title: agreement.title || '',
      start_date: startDateFormatted, // Convert to YYYY-MM-DD format
      status: agreement.status || 'active',
      billing_frequency: agreement.billing_frequency || 'monthly',
      // Optional fields - use empty strings for form compatibility
      agreement_number: agreement.agreement_number || '',
      description: agreement.description || '',
      end_date: agreement.end_date ? String(agreement.end_date).split('T')[0] : '',
      terms: agreement.terms || '',
      pricing: agreement.pricing || 0,
    };
    
    reset(resetData);
  }, [agreement, reset]);

  const createMutation = useMutation({
    mutationFn: (data: AgreementFormData) => {
      // Clean data: remove empty strings and convert to proper types for API
      const cleanData: {
        account_id: string;
        service_type_id: string;
        title: string;
        start_date: string;
        status: 'active' | 'inactive' | 'expired' | 'cancelled';
        billing_frequency: 'monthly' | 'quarterly' | 'annually' | 'one_time';
        agreement_number?: string;
        description?: string;
        end_date?: string;
        terms?: string;
        pricing?: number;
      } = {
        account_id: data.account_id,
        service_type_id: data.service_type_id,
        title: data.title,
        start_date: data.start_date,
        status: data.status,
        billing_frequency: data.billing_frequency,
      };
      
      // Only include optional fields if they have values
      if (data.agreement_number) cleanData.agreement_number = data.agreement_number;
      if (data.description) cleanData.description = data.description;
      if (data.end_date) cleanData.end_date = data.end_date;
      if (data.terms) cleanData.terms = data.terms;
      if (data.pricing && data.pricing > 0) cleanData.pricing = data.pricing;
      
      // Remove agreement_number for new agreements (will be auto-generated)
      const { agreement_number, ...createData } = cleanData;
      return agreementsApi.createAgreement(createData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agreements'] });
      onSuccess();
    },
    onError: () => {
      // Error is displayed in the form
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: AgreementFormData) => {
      // Clean data: remove empty strings and convert to proper types for API
      const cleanData: {
        account_id: string;
        service_type_id: string;
        title: string;
        start_date: string;
        status: 'active' | 'inactive' | 'expired' | 'cancelled';
        billing_frequency: 'monthly' | 'quarterly' | 'annually' | 'one_time';
        agreement_number?: string;
        description?: string;
        end_date?: string;
        terms?: string;
        pricing?: number;
      } = {
        account_id: data.account_id,
        service_type_id: data.service_type_id,
        title: data.title,
        start_date: data.start_date,
        status: data.status,
        billing_frequency: data.billing_frequency,
      };
      
      // Only include optional fields if they have values
      if (data.agreement_number) cleanData.agreement_number = data.agreement_number;
      if (data.description) cleanData.description = data.description;
      if (data.end_date) cleanData.end_date = data.end_date;
      if (data.terms) cleanData.terms = data.terms;
      if (data.pricing && data.pricing > 0) cleanData.pricing = data.pricing;
      
      return agreementsApi.updateAgreement(agreement!.id, cleanData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agreements'] });
      onSuccess();
    },
    onError: () => {
      // Error is displayed in the form
    },
  });

  const onSubmit = async (data: AgreementFormData) => {
    setIsSubmitting(true);
    try {
      if (agreement) {
        await updateMutation.mutateAsync(data);
      } else {
        await createMutation.mutateAsync(data);
      }
    } catch (error) {
      // Error is displayed in the form
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div className="pt-6">
      {/* Header with close button */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-slate-900">
          {agreement ? 'Edit Agreement' : 'Create New Agreement'}
        </h2>
        <button
          type="button"
          onClick={onCancel}
          className="text-slate-400 hover:text-slate-600 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>


      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Customer Selection */}
        <Controller
          name="account_id"
          control={control}
          render={({ field }) => (
            <CustomerSearchSelector
              value={field.value}
              onChange={(customerId) => field.onChange(customerId)}
              label="Customer"
              required
              showSelectedBox={true}
              apiSource="secure"
              error={errors.account_id?.message}
              placeholder="Search customers by name, email, phone, or address..."
            />
          )}
        />

      {/* Service Type Selection */}
      <Controller
        name="service_type_id"
        control={control}
        render={({ field }) => (
          <Select
            label="Service Type *"
            value={field.value || ''}
            onChange={(value) => {
              field.onChange(value);
              setValue('service_type_id', value);
            }}
            {...(errors.service_type_id?.message || serviceTypesError ? { error: errors.service_type_id?.message || 'Failed to load service types' } : {})}
            disabled={serviceTypesLoading}
            options={[
              { value: '', label: serviceTypesLoading ? 'Loading service types...' : 'Select a service type' },
              ...(serviceTypes?.map((serviceType) => ({
                value: serviceType.id,
                label: serviceType.service_name
              })) || [])
            ]}
          />
        )}
      />
      {serviceTypesError && (
        <p className="text-red-500 text-sm mt-1">
          Error loading service types. Please refresh the page.
        </p>
      )}

      {/* Agreement Number and Title */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Input
            label="Agreement Number"
            value={watch('agreement_number') || ''}
            onChange={(e) => setValue('agreement_number', e.target.value)}
            placeholder="Auto-generated (e.g., AG-2025-0001)"
            disabled={true}
            className="bg-slate-50"
            helperText="Agreement number will be automatically generated when saved"
            {...(errors.agreement_number?.message && { error: errors.agreement_number.message })}
          />
        </div>
        <div>
          <Controller
            name="title"
            control={control}
            render={({ field }) => (
              <Input
                label="Agreement Title *"
                value={field.value || ''}
                onChange={(e) => {
                  field.onChange(e.target.value);
                  setValue('title', e.target.value);
                }}
                placeholder="e.g., Monthly Pest Control Service"
                {...(errors.title?.message ? { error: errors.title.message } : {})}
              />
            )}
          />
        </div>
      </div>

      {/* Description */}
      <Controller
        name="description"
        control={control}
        render={({ field }) => (
          <Textarea
            label="Description"
            value={field.value || ''}
            onChange={(e) => {
              field.onChange(e.target.value);
              setValue('description', e.target.value);
            }}
            placeholder="Enter agreement description..."
            rows={3}
            {...(errors.description?.message ? { error: errors.description.message } : {})}
          />
        )}
      />

      {/* Dates */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Controller
          name="start_date"
          control={control}
          render={({ field }) => (
            <Input
              label="Start Date *"
              type="date"
              value={field.value || ''}
              onChange={(e) => {
                field.onChange(e.target.value);
                setValue('start_date', e.target.value);
              }}
              {...(errors.start_date?.message ? { error: errors.start_date.message } : {})}
            />
          )}
        />
        <Controller
          name="end_date"
          control={control}
          render={({ field }) => (
            <Input
              label="End Date"
              type="date"
              value={field.value || ''}
              onChange={(e) => {
                field.onChange(e.target.value);
                setValue('end_date', e.target.value);
              }}
              {...(errors.end_date?.message ? { error: errors.end_date.message } : {})}
            />
          )}
        />
      </div>

      {/* Status and Billing Frequency */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Controller
          name="status"
          control={control}
          render={({ field }) => (
            <Select
              label="Status"
              value={field.value || 'active'}
              onChange={(value) => {
                field.onChange(value as 'active' | 'inactive' | 'expired' | 'cancelled');
                setValue('status', value as 'active' | 'inactive' | 'expired' | 'cancelled');
              }}
              {...(errors.status?.message ? { error: errors.status.message } : {})}
              options={[
                { value: 'active', label: 'Active' },
                { value: 'inactive', label: 'Inactive' },
                { value: 'expired', label: 'Expired' },
                { value: 'cancelled', label: 'Cancelled' }
              ]}
            />
          )}
        />
        <Controller
          name="billing_frequency"
          control={control}
          render={({ field }) => (
            <Select
              label="Billing Frequency"
              value={field.value || 'monthly'}
              onChange={(value) => {
                field.onChange(value as 'monthly' | 'quarterly' | 'annually' | 'one_time');
                setValue('billing_frequency', value as 'monthly' | 'quarterly' | 'annually' | 'one_time');
              }}
              {...(errors.billing_frequency?.message ? { error: errors.billing_frequency.message } : {})}
              options={[
                { value: 'monthly', label: 'Monthly' },
                { value: 'quarterly', label: 'Quarterly' },
                { value: 'annually', label: 'Annually' },
                { value: 'one_time', label: 'One Time' }
              ]}
            />
          )}
        />
      </div>

      {/* Pricing */}
      <Controller
        name="pricing"
        control={control}
        render={({ field }) => (
          <Input
            label="Pricing ($)"
            type="number"
            step="0.01"
            min="0"
            value={field.value?.toString() || ''}
            onChange={(e) => {
              const value = parseFloat(e.target.value) || 0;
              field.onChange(value);
              setValue('pricing', value);
            }}
            placeholder="0.00"
            {...(errors.pricing?.message ? { error: errors.pricing.message } : {})}
          />
        )}
      />

      {/* Terms and Conditions */}
      <Controller
        name="terms"
        control={control}
        render={({ field }) => (
          <Textarea
            label="Terms and Conditions"
            value={field.value || ''}
            onChange={(e) => {
              field.onChange(e.target.value);
              setValue('terms', e.target.value);
            }}
            placeholder="Enter terms and conditions..."
            rows={4}
            {...(errors.terms?.message ? { error: errors.terms.message } : {})}
          />
        )}
      />

      {/* Error Display */}
      {(createMutation.error || updateMutation.error) && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-red-800 mb-1">Error</h3>
          <p className="text-sm text-red-700">
            {createMutation.error?.message || updateMutation.error?.message}
          </p>
        </div>
      )}

      {/* Form Actions */}
      <div className="flex gap-3 justify-end pt-4 border-t border-slate-200">
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
