import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Customer } from '@/types/customer';
import { ArrowLeft, Check } from 'lucide-react';
import { useCreateAccount, useUpdateAccount } from '@/hooks/useSecureAccounts';
import { logger } from '@/utils/logger';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Select from '@/components/ui/Select';

interface CustomerFormProps {
  customer?: Customer;
  onSave: () => void;
  onCancel: () => void;
}

// Zod validation schema
const secureCustomerFormSchema = z.object({
  name: z.string().min(1, 'Customer name is required'),
  account_type: z.enum(['residential', 'commercial', 'industrial']),
  status: z.enum(['active', 'inactive']),
  phone: z.string().min(1, 'Phone number is required'),
  email: z.string().email('Email is invalid').min(1, 'Email is required'),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zip_code: z.string().optional(),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof secureCustomerFormSchema>;

export default function SecureCustomerForm({ customer, onSave, onCancel }: CustomerFormProps) {
  const isEditMode = !!customer;

  // Use secure hooks instead of direct Supabase calls
  const createAccountMutation = useCreateAccount();
  const updateAccountMutation = useUpdateAccount();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(secureCustomerFormSchema),
    defaultValues: {
      name: customer?.name || '',
      account_type: customer?.account_type || 'residential',
      status: customer?.status || 'active',
      phone: customer?.phone || '',
      email: customer?.email || '',
      address: customer?.address || '',
      city: customer?.city || '',
      state: customer?.state || '',
      zip_code: customer?.zip_code || '',
      notes: customer?.notes || '',
    },
  });

  // Initialize form data when editing
  useEffect(() => {
    if (customer) {
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
        notes: customer.notes || '',
      });
    }
  }, [customer, reset]);

  const onSubmit = async (data: FormData) => {
    try {
      if (isEditMode && customer?.id) {
        // Update existing customer using secure hook
        await updateAccountMutation.mutateAsync({
          id: customer.id,
          data
        });
        logger.debug('Customer updated successfully', { customerId: customer.id }, 'SecureCustomerForm');
      } else {
        // Create new customer using secure hook
        await createAccountMutation.mutateAsync(data);
        logger.debug('Customer created successfully', {}, 'SecureCustomerForm');
      }
      
      onSave();
    } catch (error) {
      logger.error('Error saving customer', error, 'SecureCustomerForm');
      // Error handling is automatically done by the hooks
    }
  };

  const isLoading = createAccountMutation.isPending || updateAccountMutation.isPending;

  return (
    <Card>
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              onClick={onCancel}
              className="p-2"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                {isEditMode ? 'Edit Customer' : 'Add New Customer'}
              </h1>
              <p className="text-sm text-gray-500">
                {isEditMode ? 'Update customer information' : 'Create a new customer account'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Basic Information</h3>
            
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  label="Customer Name *"
                  placeholder="Enter customer name"
                  error={errors.name?.message}
                  disabled={isLoading}
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
                  label="Account Type"
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
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Contact Information</h3>
            
            <Controller
              name="phone"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  type="tel"
                  label="Phone Number *"
                  placeholder="(555) 123-4567"
                  error={errors.phone?.message}
                  disabled={isLoading}
                />
              )}
            />

            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  type="email"
                  label="Email Address *"
                  placeholder="customer@example.com"
                  error={errors.email?.message}
                  disabled={isLoading}
                />
              )}
            />

            <Controller
              name="address"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  label="Street Address"
                  placeholder="123 Main Street"
                  error={errors.address?.message}
                  disabled={isLoading}
                />
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <Controller
                name="city"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    label="City"
                    placeholder="City"
                    error={errors.city?.message}
                    disabled={isLoading}
                  />
                )}
              />
              <Controller
                name="state"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    label="State"
                    placeholder="State"
                    error={errors.state?.message}
                    disabled={isLoading}
                  />
                )}
              />
            </div>

            <Controller
              name="zip_code"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  label="ZIP Code"
                  placeholder="12345"
                  error={errors.zip_code?.message}
                  disabled={isLoading}
                />
              )}
            />
          </div>
        </div>

        {/* Notes */}
        <div className="mt-6">
          <Controller
            name="notes"
            control={control}
            render={({ field }) => (
              <Textarea
                {...field}
                label="Notes"
                rows={3}
                placeholder="Additional notes about this customer..."
                error={errors.notes?.message}
                disabled={isLoading}
              />
            )}
          />
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-end space-x-3 mt-6 pt-6 border-t border-gray-200">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
          
          <Button
            type="submit"
            variant="primary"
            loading={isLoading}
            icon={Check}
            disabled={isLoading}
          >
            {isEditMode ? 'Update Customer' : 'Create Customer'}
          </Button>
        </div>
      </form>
    </Card>
  );
}




