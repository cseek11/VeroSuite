import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  CreateWorkOrderRequest, 
  WorkOrderStatus, 
  WorkOrderPriority 
} from '@/types/work-orders';
import { 
  Calendar, 
  User, 
  Clock, 
  DollarSign, 
  FileText, 
  AlertCircle,
  Save,
  X
} from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import { LoadingSpinner } from '@/components/LoadingSpinner';

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

interface Customer {
  id: string;
  name: string;
  account_type: string;
  phone?: string;
  email?: string;
}

interface Technician {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  skills?: string[];
  status: 'available' | 'in_progress' | 'off';
}

interface WorkOrderFormProps {
  initialData?: Partial<CreateWorkOrderRequest> | Partial<UpdateWorkOrderRequest>;
  onSubmit: (data: CreateWorkOrderRequest | UpdateWorkOrderRequest) => Promise<void>;
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
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [loadingCustomers, setLoadingCustomers] = useState(true);
  const [loadingTechnicians, setLoadingTechnicians] = useState(true);
  const [customerSearch, setCustomerSearch] = useState('');
  const [technicianSearch, setTechnicianSearch] = useState('');

  const {
    control,
    handleSubmit,
    formState: { errors, isDirty },
    watch,
    setValue,
    reset
  } = useForm<WorkOrderFormData>({
    resolver: zodResolver(workOrderSchema),
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

  const selectedCustomerId = watch('customer_id');
  const selectedTechnicianId = watch('assigned_to');
  const scheduledDate = watch('scheduled_date');

  // Load customers
  useEffect(() => {
    const loadCustomers = async () => {
      try {
        setLoadingCustomers(true);
        // Get token from possible locations
        const getAuthToken = (): string | null => {
          try {
            const authData = localStorage.getItem('verosuite_auth');
            if (authData) {
              const parsed = JSON.parse(authData);
              // try common shapes
              if (typeof parsed?.token === 'string') return parsed.token;
              if (typeof parsed?.accessToken === 'string') return parsed.accessToken;
              if (typeof parsed?.state?.token === 'string') return parsed.state.token;
              if (typeof parsed?.state?.accessToken === 'string') return parsed.state.accessToken;
            }
          } catch (e) {
            console.error('Error parsing verosuite_auth:', e);
          }
          const direct = localStorage.getItem('jwt');
          return direct || null;
        };

        const token = getAuthToken();

        const response = await fetch('http://localhost:3001/api/v1/crm/accounts', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'x-tenant-id': localStorage.getItem('tenantId') || '7193113e-ece2-4f7b-ae8c-176df4367e28',
            'Content-Type': 'application/json',
          },
        });
        
        if (response.ok) {
          const data = await response.json();
          // Try to load current auth user to backfill names when tech.user is omitted
          let authUser: any = null;
          try {
            const authRaw = localStorage.getItem('verosuite_auth');
            if (authRaw) {
              const parsed = JSON.parse(authRaw);
              authUser = parsed.user || parsed.profile || parsed.state?.user || null;
            }
          } catch {}
          setCustomers(data || []);
        } else if (response.status === 401) {
          console.warn('Unauthorized while loading customers (401).');
          setCustomers([]);
        } else {
          console.error('Failed to load customers');
        }
      } catch (error) {
        console.error('Error loading customers:', error);
      } finally {
        setLoadingCustomers(false);
      }
    };

    loadCustomers();
  }, []);

  // Load technicians
  useEffect(() => {
    const loadTechnicians = async () => {
      try {
        console.log('🔧 Starting technician load...');
        setLoadingTechnicians(true);
        
        // Get token from possible locations
        const getAuthToken = (): string | null => {
          try {
            const authData = localStorage.getItem('verosuite_auth');
            if (authData) {
              const parsed = JSON.parse(authData);
              if (typeof parsed?.token === 'string') return parsed.token;
              if (typeof parsed?.accessToken === 'string') return parsed.accessToken;
              if (typeof parsed?.state?.token === 'string') return parsed.state.token;
              if (typeof parsed?.state?.accessToken === 'string') return parsed.state.accessToken;
            }
          } catch (e) {
            console.error('Error parsing verosuite_auth:', e);
          }
          const direct = localStorage.getItem('jwt');
          return direct || null;
        };
        const token = getAuthToken();

        const tenantId = localStorage.getItem('tenantId') || '7193113e-ece2-4f7b-ae8c-176df4367e28';
        console.log('🔧 Making request to technicians API with:', {
          url: 'http://localhost:3001/api/technicians',
          token: token ? 'present' : 'missing',
          tenantId
        });

        const response = await fetch('http://localhost:3001/api/technicians', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'x-tenant-id': tenantId,
            'Content-Type': 'application/json',
          },
        });
        
        console.log('🔧 Response status:', response.status, response.statusText);
        
        if (response.ok) {
          const data = await response.json();
          console.log('🔧 Technician API response:', data);
          console.log('🔧 Raw technicians array:', data.technicians);
          // Try to load current auth user to backfill names when tech.user is omitted
          let authUser: any = null;
          try {
            const authRaw = localStorage.getItem('verosuite_auth');
            if (authRaw) {
              const parsed = JSON.parse(authRaw);
              authUser = parsed.user || parsed.profile || parsed.state?.user || null;
            }
          } catch {}
          
          // Transform technician data to match our interface
          const transformedTechnicians: Technician[] = data.technicians?.map((tech: any) => {
            console.log('🔧 Processing technician:', tech);
            const id = tech.user_id || tech.id || '';
            const email = tech.email || tech.user?.email || tech.users?.email || '';
            // Try multiple possible name keys
            const firstName = tech.first_name || tech.firstName || tech.given_name || tech.givenName || tech.user?.first_name || tech.user?.firstName || tech.users?.first_name || tech.users?.firstName || '';
            const lastName = tech.last_name || tech.lastName || tech.family_name || tech.familyName || tech.user?.last_name || tech.user?.lastName || tech.users?.last_name || tech.users?.lastName || '';
            // Derive fallback name
            const emailLocal = email && email.includes('@') ? email.split('@')[0] : '';
            const idTail = id ? id.slice(0, 8) : 'tech';
            let safeFirst = firstName;
            let safeLast = lastName;
            let safeEmail = email;
            // If missing, backfill from current auth user when matching
            if ((!safeFirst || !safeLast || !safeEmail) && authUser && (authUser.id === id || authUser.user_id === id)) {
              safeFirst = safeFirst || authUser.first_name || authUser.firstName || '';
              safeLast = safeLast || authUser.last_name || authUser.lastName || '';
              safeEmail = safeEmail || authUser.email || '';
            }
            safeFirst = safeFirst || (emailLocal ? emailLocal : 'Technician');
            safeLast = safeLast || (!firstName && id ? idTail : '');
            return {
              id,
              first_name: safeFirst,
              last_name: safeLast,
              email: safeEmail,
              phone: tech.phone || tech.user?.phone || tech.users?.phone || '',
              skills: ['general'],
              status: String(tech.status || '').toUpperCase() === 'ACTIVE' ? 'available' : 'off'
            };
          }) || [];
          
          console.log('🔧 Transformed technicians:', transformedTechnicians);
          console.log('🔧 Setting technicians state with', transformedTechnicians.length, 'technicians');
          setTechnicians(transformedTechnicians);
          // Auto-select if only one technician is available and none selected
          if (transformedTechnicians.length === 1) {
            try { setValue('assigned_to', transformedTechnicians[0].id); } catch {}
          }
        } else if (response.status === 401) {
          console.warn('Unauthorized while loading technicians (401). Using mock fallback.');
          setTechnicians([]);
        } else {
          console.error('🔧 Failed to load technicians:', response.status, response.statusText);
          const errorText = await response.text();
          console.error('🔧 Error response:', errorText);
          // Fallback to empty array if API fails
          console.log('🔧 API failed, using empty technicians list');
          setTechnicians([]);
        }
      } catch (error) {
        console.error('🔧 Error loading technicians:', error);
        // Fallback to empty array on error
        console.log('🔧 Error occurred, using empty technicians list');
        setTechnicians([]);
      } finally {
        console.log('🔧 Finished loading technicians');
        setLoadingTechnicians(false);
      }
    };

    loadTechnicians();
  }, []);

  // Filter customers based on search
  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(customerSearch.toLowerCase()) ||
    customer.account_type.toLowerCase().includes(customerSearch.toLowerCase())
  );

  // Filter technicians based on search
  const filteredTechnicians = technicians.filter(technician =>
    `${technician.first_name} ${technician.last_name}`.toLowerCase().includes(technicianSearch.toLowerCase()) ||
    technician.email.toLowerCase().includes(technicianSearch.toLowerCase())
  );

  // Debug logging for technicians
  console.log('🔧 Current technicians state:', technicians);
  console.log('🔧 Filtered technicians:', filteredTechnicians);
  console.log('🔧 Technician search term:', technicianSearch);

  const handleFormSubmit = async (data: WorkOrderFormData) => {
    try {
      const submitData = {
        ...data,
        assigned_to: data.assigned_to || undefined,
        scheduled_date: data.scheduled_date || undefined,
        notes: data.notes || undefined,
        service_type: data.service_type || undefined,
        estimated_duration: data.estimated_duration || undefined,
        service_price: data.service_price === '' ? undefined : data.service_price,
      };
      
      await onSubmit(submitData);
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  const selectedCustomer = customers.find(c => c.id === selectedCustomerId);
  const selectedTechnician = technicians.find(t => t.id === selectedTechnicianId);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {mode === 'create' ? 'Create Work Order' : 'Edit Work Order'}
          </h2>
          <Button
            variant="outline"
            onClick={onCancel}
            className="flex items-center gap-2"
          >
            <X className="h-4 w-4" />
            Cancel
          </Button>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          {/* Customer Selection */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Customer <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Controller
                name="customer_id"
                control={control}
                render={({ field }) => (
                  <>
                    <Input
                      placeholder="Search customers..."
                      value={customerSearch}
                      onChange={(e) => setCustomerSearch(e.target.value)}
                      className="w-full"
                    />
                    {field.value && (
                      <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-md">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium text-blue-900">
                              {selectedCustomer?.name || 'Selected Customer'}
                            </div>
                            <div className="text-sm text-blue-700">
                              {selectedCustomer?.account_type}
                            </div>
                          </div>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setValue('customer_id', '');
                              setCustomerSearch('');
                            }}
                          >
                            Change
                          </Button>
                        </div>
                      </div>
                    )}
                    {customerSearch && !field.value && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                        {loadingCustomers ? (
                          <div className="p-4 text-center">
                            <LoadingSpinner text="Loading customers..." />
                          </div>
                        ) : filteredCustomers.length > 0 ? (
                          filteredCustomers.map((customer) => (
                            <button
                              key={customer.id}
                              type="button"
                              className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                              onClick={() => {
                                setValue('customer_id', customer.id);
                                setCustomerSearch('');
                              }}
                            >
                              <div className="font-medium text-gray-900">{customer.name}</div>
                              <div className="text-sm text-gray-600">{customer.account_type}</div>
                              {customer.phone && (
                                <div className="text-sm text-gray-500">{customer.phone}</div>
                              )}
                            </button>
                          ))
                        ) : (
                          <div className="p-4 text-gray-500 text-center">No customers found</div>
                        )}
                      </div>
                    )}
                  </>
                )}
              />
            </div>
            {errors.customer_id && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {errors.customer_id.message}
              </p>
            )}
          </div>

          {/* Service Type and Priority */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Service Type</label>
              <Controller
                name="service_type"
                control={control}
                render={({ field }) => (
                  <select
                    {...field}
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
              <label className="block text-sm font-medium text-gray-700">Priority</label>
              <Controller
                name="priority"
                control={control}
                render={({ field }) => (
                  <select
                    {...field}
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
            <label className="block text-sm font-medium text-gray-700">
              Description <span className="text-red-500">*</span>
            </label>
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <textarea
                  {...field}
                  rows={4}
                  className="crm-textarea"
                  placeholder="Describe the work to be performed..."
                />
              )}
            />
            {errors.description && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Technician Assignment */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Assigned Technician</label>
            <Controller
              name="assigned_to"
              control={control}
              render={({ field }) => (
                <select
                  {...field}
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Scheduled Date & Time</label>
              <Controller
                name="scheduled_date"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="datetime-local"
                    className="w-full"
                  />
                )}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Estimated Duration (minutes)</label>
              <Controller
                name="estimated_duration"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="number"
                    min="15"
                    max="480"
                    step="15"
                    className="w-full"
                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                  />
                )}
              />
              {errors.estimated_duration && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {errors.estimated_duration.message}
                </p>
              )}
            </div>
          </div>

          {/* Service Price */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Service Price</label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Controller
                name="service_price"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
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
              <p className="text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {errors.service_price.message}
              </p>
            )}
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Additional Notes</label>
            <Controller
              name="notes"
              control={control}
              render={({ field }) => (
                <textarea
                  {...field}
                  rows={3}
                  className="crm-textarea"
                  placeholder="Any additional information or special instructions..."
                />
              )}
            />
            {errors.notes && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {errors.notes.message}
              </p>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-200">
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
              disabled={isLoading || !isDirty}
              className="flex items-center gap-2"
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
