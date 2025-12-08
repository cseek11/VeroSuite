import { useState, useEffect, useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  CreateWorkOrderRequest,
  UpdateWorkOrderRequest,
  WorkOrderStatus, 
  WorkOrderPriority 
} from '@/types/work-orders';
import { 
  DollarSign, 
  Save,
  X
} from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import CustomerSearchSelector from '@/components/ui/CustomerSearchSelector';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { logger } from '@/utils/logger';
import { enhancedApi } from '@/lib/enhanced-api';

// Form validation schema
const workOrderSchema = z.object({
  customer_id: z.string().uuid('Please select a valid customer'),
  assigned_to: z.string().uuid().optional().or(z.literal('')),
  status: z.nativeEnum(WorkOrderStatus).optional(),
  priority: z.nativeEnum(WorkOrderPriority).optional(),
  scheduled_date: z.string().optional(),
  description: z.string().min(1, 'Description is required').max(1000, 'Description must be less than 1000 characters'),
  notes: z.string().max(2000, 'Notes must be less than 2000 characters').optional(),
  service_type: z.string().optional(),
  estimated_duration: z.number().min(15, 'Duration must be at least 15 minutes').max(480, 'Duration cannot exceed 8 hours').optional(),
  service_price: z.number().min(0, 'Price cannot be negative').optional().or(z.literal('')),
});

type WorkOrderFormData = z.infer<typeof workOrderSchema>;


interface Technician {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  skills?: string[];
  status: 'available' | 'in_progress' | 'off';
}

type WorkOrderSubmitHandler =
  ((data: CreateWorkOrderRequest) => Promise<void>) |
  ((data: UpdateWorkOrderRequest) => Promise<void>);

interface WorkOrderFormProps {
  initialData?: Partial<CreateWorkOrderRequest> | Partial<UpdateWorkOrderRequest>;
  onSubmit: WorkOrderSubmitHandler;
  onCancel: () => void;
  isLoading?: boolean;
  mode?: 'create' | 'edit';
}

export default function WorkOrderForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
  mode = 'create'
}: WorkOrderFormProps) {
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [loadingTechnicians, setLoadingTechnicians] = useState(true);

  const {
    control,
    handleSubmit,
    formState: { errors, isDirty },
    watch,
    setValue,
    reset,
    trigger
  } = useForm<WorkOrderFormData>({
    resolver: zodResolver(workOrderSchema),
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    defaultValues: {
      customer_id: initialData?.customer_id || '',
      assigned_to: initialData?.assigned_to || '',
      status: initialData?.status || WorkOrderStatus.PENDING,
      priority: initialData?.priority || WorkOrderPriority.MEDIUM,
      scheduled_date: initialData?.scheduled_date || '',
      description: initialData?.description || '',
      notes: initialData?.notes || '',
      service_type: initialData?.service_type || '',
      estimated_duration: initialData?.estimated_duration || 60,
      service_price: initialData?.service_price || '',
    },
  });

  const selectedTechnicianId = watch('assigned_to');

  // Load technicians using enhancedApi
  useEffect(() => {
    const loadTechnicians = async () => {
      try {
        logger.debug('Starting technician load', {}, 'WorkOrderForm');
        setLoadingTechnicians(true);
        
        // Use enhancedApi.technicians.list() for consistent API access
        const techniciansData = await enhancedApi.technicians.list();
        
        logger.debug('Technician API response received', { techniciansCount: techniciansData?.length || 0 }, 'WorkOrderForm');
        
        // Transform technician data to match our interface
        const transformedTechnicians: Technician[] = techniciansData?.map((tech: any) => {
          logger.debug('Processing technician', { techId: tech.id || tech.user_id }, 'WorkOrderForm');
          const id = tech.id || tech.user_id || '';
          const email = tech.email || tech.user?.email || '';
          // Try multiple possible name keys
          const firstName = tech.first_name || tech.firstName || tech.user?.first_name || tech.user?.firstName || '';
          const lastName = tech.last_name || tech.lastName || tech.user?.last_name || tech.user?.lastName || '';
          // Derive fallback name
          const emailLocal = email && email.includes('@') ? email.split('@')[0] : '';
          const idTail = id ? id.slice(0, 8) : 'tech';
          const safeFirst = firstName || (emailLocal ? emailLocal : 'Technician');
          const safeLast = lastName || (!firstName && id ? idTail : '');
          
          return {
            id,
            first_name: safeFirst,
            last_name: safeLast,
            email: email || '',
            phone: tech.phone || tech.user?.phone || '',
            skills: ['general'],
            status: String(tech.status || '').toUpperCase() === 'ACTIVE' ? 'available' : 'off'
          };
        }) || [];
        
        logger.debug('Technicians transformed', { count: transformedTechnicians.length }, 'WorkOrderForm');
        setTechnicians(transformedTechnicians);
        // Auto-select if only one technician is available and none selected
        if (transformedTechnicians.length === 1) {
          const firstTechId = transformedTechnicians[0]?.id;
          if (firstTechId) {
            try {
              setValue('assigned_to', firstTechId);
            } catch {}
          }
        }
      } catch (error: unknown) {
        const err = error as { message?: string; status?: string; stack?: string };
        logger.error('Error loading technicians', { 
          error, 
          errorMessage: err?.message, 
          errorStatus: err?.status,
          errorStack: err?.stack 
        }, 'WorkOrderForm');
        setTechnicians([]);
      } finally {
        setLoadingTechnicians(false);
      }
    };

    loadTechnicians();
  }, [setValue]);

  // Find the selected technician object for display
  const selectedTechnician = useMemo(() => {
    return technicians.find(tech => tech.id === selectedTechnicianId);
  }, [selectedTechnicianId, technicians]);

  // Handle form submission
  const handleFormSubmit = async (data: WorkOrderFormData) => {
    logger.debug('Work order form submitted', { data }, 'WorkOrderForm');
    try {
      // Ensure estimated_duration and service_price are numbers if present
      const submissionData = {
        ...data,
        estimated_duration: data.estimated_duration !== undefined && data.estimated_duration !== null
          ? Number(data.estimated_duration)
          : undefined,
        service_price: data.service_price !== undefined && data.service_price !== null && data.service_price !== ''
          ? Number(data.service_price)
          : undefined,
      };
      await (onSubmit as (payload: CreateWorkOrderRequest | UpdateWorkOrderRequest) => Promise<void>)(submissionData as CreateWorkOrderRequest | UpdateWorkOrderRequest);
      reset(submissionData); // Reset form with submitted data to mark as not dirty
    } catch (error) {
      logger.error('Work order form submission failed', error, 'WorkOrderForm');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6">
      <Card className="p-4 md:p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {mode === 'create' ? 'Create Work Order' : 'Edit Work Order'}
          </h2>
          <Button
            variant="outline"
            onClick={onCancel}
            className="flex items-center gap-2 min-h-[44px]"
          >
            <X className="h-4 w-4" />
            Cancel
          </Button>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 md:space-y-6">
          {/* Customer Selection */}
          <div className="space-y-2">
            <Controller
              name="customer_id"
              control={control}
              render={({ field }) => (
                <CustomerSearchSelector
                  value={field.value}
                  onChange={(customerId) => {
                    field.onChange(customerId);
                  }}
                  label="Customer"
                  required
                  showSelectedBox={true}
                  apiSource="direct"
                  error={errors.customer_id?.message}
                  placeholder="Search customers..."
                />
              )}
            />
          </div>

          {/* Service Type and Priority */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div className="space-y-2">
              <label htmlFor="service_type" className="block text-sm font-medium text-gray-700">Service Type</label>
              <Controller
                name="service_type"
                control={control}
                render={({ field }) => (
                  <select
                    {...field}
                    id="service_type"
                    className="crm-input"
                  >
                    <option value="">Select service type</option>
                    <option value="General Pest Control">General Pest Control</option>
                    <option value="Termite Treatment">Termite Treatment</option>
                    <option value="Rodent Control">Rodent Control</option>
                    <option value="Bed Bug Treatment">Bed Bug Treatment</option>
                    <option value="Wildlife Removal">Wildlife Removal</option>
                    <option value="Inspection">Inspection</option>
                    <option value="Maintenance">Maintenance</option>
                  </select>
                )}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="priority" className="block text-sm font-medium text-gray-700">Priority</label>
              <Controller
                name="priority"
                control={control}
                render={({ field }) => (
                  <select
                    {...field}
                    id="priority"
                    className="crm-input"
                  >
                    <option value={WorkOrderPriority.LOW}>Low</option>
                    <option value={WorkOrderPriority.MEDIUM}>Medium</option>
                    <option value={WorkOrderPriority.HIGH}>High</option>
                    <option value={WorkOrderPriority.URGENT}>Urgent</option>
                  </select>
                )}
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description <span className="text-red-500">*</span>
            </label>
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <textarea
                  {...field}
                  id="description"
                  rows={4}
                  className="crm-textarea"
                  placeholder="Describe the work to be performed..."
                />
              )}
            />
            {errors.description && (
              <ErrorMessage message={errors.description.message ?? ''} type="error" />
            )}
          </div>

          {/* Technician Assignment */}
          <div className="space-y-2">
            <label htmlFor="assigned_to" className="block text-sm font-medium text-gray-700">Assigned Technician</label>
            <Controller
              name="assigned_to"
              control={control}
              render={({ field }) => (
                <select
                  {...field}
                  id="assigned_to"
                  className="crm-input w-full"
                  disabled={loadingTechnicians}
                >
                  <option value="">{loadingTechnicians ? 'Loading technicians...' : 'Select technician'}</option>
                  {technicians.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.first_name} {t.last_name} {t.email ? `- ${t.email}` : ''}
                    </option>
                  ))}
                </select>
              )}
            />
            {selectedTechnician && (
              <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-md">
                <div className="font-medium text-green-900">
                  {selectedTechnician.first_name} {selectedTechnician.last_name}
                </div>
                <div className="text-sm text-green-700">{selectedTechnician.email}</div>
                {selectedTechnician.skills && (
                  <div className="text-sm text-green-600">Skills: {selectedTechnician.skills.join(', ')}</div>
                )}
              </div>
            )}
          </div>

          {/* Scheduling and Duration */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div className="space-y-2">
              <label htmlFor="scheduled_date" className="block text-sm font-medium text-gray-700">Scheduled Date & Time</label>
              <Controller
                name="scheduled_date"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="scheduled_date"
                    type="datetime-local"
                    className="w-full"
                  />
                )}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="estimated_duration" className="block text-sm font-medium text-gray-700">Estimated Duration (minutes)</label>
              <Controller
                name="estimated_duration"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="estimated_duration"
                    type="number"
                    min="15"
                    max="480"
                    step="15"
                    className="w-full"
                    value={field.value || ''}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === '') {
                        field.onChange(undefined);
                      } else {
                        const numValue = parseInt(value, 10);
                        field.onChange(isNaN(numValue) ? undefined : numValue);
                      }
                    }}
                    onBlur={() => {
                      field.onBlur();
                      trigger('estimated_duration');
                    }}
                  />
                )}
              />
              {errors.estimated_duration && (
                <ErrorMessage message={errors.estimated_duration.message ?? ''} type="error" />
              )}
            </div>
          </div>

          {/* Service Price */}
          <div className="space-y-2">
            <label htmlFor="service_price" className="block text-sm font-medium text-gray-700">Service Price</label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Controller
                name="service_price"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="service_price"
                    type="number"
                    min="0"
                    step="0.01"
                    className="pl-10"
                    placeholder="0.00"
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === '') {
                        field.onChange('');
                      } else {
                        const numValue = parseFloat(value);
                        field.onChange(isNaN(numValue) ? '' : numValue);
                      }
                    }}
                  />
                )}
              />
            </div>
            {errors.service_price && (
              <ErrorMessage message={errors.service_price.message ?? ''} type="error" />
            )}
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700">Additional Notes</label>
            <Controller
              name="notes"
              control={control}
              render={({ field }) => (
                <textarea
                  {...field}
                  id="notes"
                  rows={3}
                  className="crm-textarea"
                  placeholder="Any additional information or special instructions..."
                />
              )}
            />
            {errors.notes && (
              <ErrorMessage message={errors.notes.message ?? ''} type="error" />
            )}
          </div>

          {/* Form Actions */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 sm:gap-4 pt-4 sm:pt-6 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isLoading}
              className="min-h-[44px] w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={isLoading || !isDirty}
              className="flex items-center justify-center gap-2 min-h-[44px] w-full sm:w-auto"
            >
              {isLoading ? (
                <LoadingSpinner text="Saving..." />
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  {mode === 'create' ? 'Create Work Order' : 'Update Work Order'}
                </>
              )}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
