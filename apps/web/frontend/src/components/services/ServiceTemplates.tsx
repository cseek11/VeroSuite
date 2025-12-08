import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { supabase } from '@/lib/supabase-client';
import { Plus, Pencil, Trash2, Copy, ArrowUp, ArrowDown, X } from 'lucide-react';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Select from '@/components/ui/Select';
import Checkbox from '@/components/ui/Checkbox';
import Button from '@/components/ui/Button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/Dialog';

interface ServiceTemplate {
  id: string;
  tenant_id: string;
  template_name: string;
  template_code: string;
  segment_id: string;
  description: string;
  is_active: boolean;
  base_price_multiplier: number;
  service_sequence: string[];
  estimated_total_duration: number;
  required_equipment: string[];
  safety_requirements: string[];
  compliance_notes: string;
  created_at: string;
  updated_at: string;
  customer_segments?: {
    segment_name: string;
    segment_code: string;
    pricing_tier: string;
  };
}

interface CustomerSegment {
  id: string;
  tenant_id: string;
  segment_name: string;
  segment_code: string;
  description: string;
  pricing_tier: string;
  is_active: boolean;
}

interface ServiceType {
  id: string;
  type_name: string;
  type_code: string;
  base_price: number;
  estimated_duration: number;
  category_id: string;
}

export default function ServiceTemplates() {
  const queryClient = useQueryClient();
  const [isAddingTemplate, setIsAddingTemplate] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<ServiceTemplate | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<ServiceTemplate | null>(null);

  // Fetch service templates
  const { data: serviceTemplates, isLoading: loadingTemplates } = useQuery({
    queryKey: ['service-templates'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('service_templates')
        .select(`
          *,
          customer_segments (
            segment_name,
            segment_code,
            pricing_tier
          )
        `)
        .eq('tenant_id', '7193113e-ece2-4f7b-ae8c-176df4367e28')
        .order('template_name');
      if (error) throw error;
      return data;
    },
  });

  // Fetch customer segments
  const { data: customerSegments, isLoading: loadingSegments } = useQuery({
    queryKey: ['customer-segments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('customer_segments')
        .select('*')
        .eq('tenant_id', '7193113e-ece2-4f7b-ae8c-176df4367e28')
        .eq('is_active', true)
        .order('segment_name');
      if (error) throw error;
      return data;
    },
  });

  // Fetch service types
  const { data: serviceTypes, isLoading: loadingServiceTypes } = useQuery({
    queryKey: ['service-types'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('service_types')
        .select('*')
        .eq('tenant_id', '7193113e-ece2-4f7b-ae8c-176df4367e28')
        .eq('is_active', true)
        .order('type_name');
      if (error) throw error;
      return data;
    },
  });

  // Create template mutation
  const createTemplateMutation = useMutation({
    mutationFn: async (template: Omit<ServiceTemplate, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('service_templates')
        .insert({
          ...template,
          tenant_id: '7193113e-ece2-4f7b-ae8c-176df4367e28',
        })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['service-templates'] });
      setIsAddingTemplate(false);
    },
  });

  // Update template mutation
  const updateTemplateMutation = useMutation({
    mutationFn: async (template: Partial<ServiceTemplate> & { id: string }) => {
      const { data, error } = await supabase
        .from('service_templates')
        .update(template)
        .eq('id', template.id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['service-templates'] });
      setEditingTemplate(null);
    },
  });

  // Delete template mutation
  const deleteTemplateMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('service_templates')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['service-templates'] });
      setSelectedTemplate(null);
    },
  });

  // Duplicate template mutation
  const duplicateTemplateMutation = useMutation({
    mutationFn: async (template: ServiceTemplate) => {
      const { data, error } = await supabase
        .from('service_templates')
        .insert({
          ...template,
          id: undefined,
          template_name: `${template.template_name} (Copy)`,
          template_code: `${template.template_code}_COPY`,
          tenant_id: '7193113e-ece2-4f7b-ae8c-176df4367e28',
        })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['service-templates'] });
    },
  });

  if (loadingTemplates || loadingSegments || loadingServiceTypes) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  const getSegmentColor = (pricingTier: string) => {
    const colors: Record<string, string> = {
      'basic': 'bg-blue-100 text-blue-800',
      'standard': 'bg-green-100 text-green-800',
      'premium': 'bg-purple-100 text-purple-800',
      'enterprise': 'bg-indigo-100 text-indigo-800',
    };
    return colors[pricingTier.toLowerCase()] || 'bg-slate-100 text-slate-800';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white shadow-sm border border-slate-200 rounded-lg">
        <div className="px-6 py-4 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Service Templates</h2>
              <p className="text-sm text-slate-600">
                Create and manage service templates by customer segment for consistent service delivery
              </p>
            </div>
            <button
              onClick={() => setIsAddingTemplate(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Template
            </button>
          </div>
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {serviceTemplates?.map((template) => (
          <div
            key={template.id}
            className="bg-white shadow-sm border border-slate-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => setSelectedTemplate(template)}
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-slate-900 mb-1">
                    {template.template_name}
                  </h3>
                  <p className="text-sm text-slate-500 mb-2">
                    {template.template_code}
                  </p>
                  <div className="flex items-center space-x-2 mb-3">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getSegmentColor(template.customer_segments?.pricing_tier || 'basic')}`}>
                      {template.customer_segments?.segment_name || 'N/A'}
                    </span>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      template.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {template.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      duplicateTemplateMutation.mutate(template);
                    }}
                    className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                    title="Duplicate Template"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingTemplate(template);
                    }}
                    className="text-purple-600 hover:text-purple-900 p-1 rounded hover:bg-purple-50"
                    title="Edit Template"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteTemplateMutation.mutate(template.id);
                    }}
                    className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                    title="Delete Template"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              <p className="text-sm text-slate-600 mb-4">
                {template.description || 'No description provided'}
              </p>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Services:</span>
                  <span className="text-slate-900 font-medium">
                    {template.service_sequence?.length || 0} services
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Duration:</span>
                  <span className="text-slate-900 font-medium">
                    {template.estimated_total_duration || 0} min
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Price Multiplier:</span>
                  <span className="text-slate-900 font-medium">
                    {template.base_price_multiplier || 1.0}x
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Template Modal */}
      {(isAddingTemplate || editingTemplate) && (
        <TemplateForm
          template={editingTemplate}
          segments={customerSegments || []}
          serviceTypes={serviceTypes || []}
          onSubmit={(data) => {
            if (editingTemplate) {
              updateTemplateMutation.mutate({ ...data, id: editingTemplate.id });
            } else {
              createTemplateMutation.mutate(data);
            }
          }}
          onCancel={() => {
            setIsAddingTemplate(false);
            setEditingTemplate(null);
          }}
        />
      )}

      {/* Template Detail Modal */}
      {selectedTemplate && (
        <TemplateDetail
          template={selectedTemplate}
          serviceTypes={serviceTypes || []}
          onClose={() => setSelectedTemplate(null)}
          onEdit={() => {
            setEditingTemplate(selectedTemplate);
            setSelectedTemplate(null);
          }}
        />
      )}
    </div>
  );
}

// Template Form Schema
const templateSchema = z.object({
  template_name: z.string().min(1, 'Template name is required'),
  template_code: z.string().min(1, 'Template code is required'),
  segment_id: z.string().min(1, 'Customer segment is required'),
  description: z.string().optional(),
  is_active: z.boolean().default(true),
  base_price_multiplier: z.number().min(0.1, 'Price multiplier must be at least 0.1'),
  service_sequence: z.array(z.string()).default([]),
  estimated_total_duration: z.number().min(0).default(0),
  required_equipment: z.array(z.string()).default([]),
  safety_requirements: z.array(z.string()).default([]),
  compliance_notes: z.string().optional(),
});

type TemplateFormData = z.infer<typeof templateSchema>;

// Template Form Component
interface TemplateFormProps {
  template?: ServiceTemplate | null;
  segments: CustomerSegment[];
  serviceTypes: ServiceType[];
  onSubmit: (data: Omit<ServiceTemplate, 'id' | 'created_at' | 'updated_at'>) => void;
  onCancel: () => void;
}

function TemplateForm({ template, segments, serviceTypes, onSubmit, onCancel }: TemplateFormProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [selectedServiceToAdd, setSelectedServiceToAdd] = useState('');

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset,
  } = useForm<TemplateFormData>({
    resolver: zodResolver(templateSchema),
    defaultValues: {
      template_name: template?.template_name || '',
      template_code: template?.template_code || '',
      segment_id: template?.segment_id || '',
      description: template?.description || '',
      is_active: template?.is_active ?? true,
      base_price_multiplier: template?.base_price_multiplier || 1.0,
      service_sequence: template?.service_sequence || [],
      estimated_total_duration: template?.estimated_total_duration || 0,
      required_equipment: template?.required_equipment || [],
      safety_requirements: template?.safety_requirements || [],
      compliance_notes: template?.compliance_notes || '',
    },
  });

  const serviceSequence = watch('service_sequence');

  const handleFormSubmit = (data: TemplateFormData) => {
    onSubmit(data as Omit<ServiceTemplate, 'id' | 'created_at' | 'updated_at'>);
    setIsOpen(false);
  };

  const handleCancel = () => {
    setIsOpen(false);
    reset();
    onCancel();
  };

  const addServiceToSequence = (serviceId: string) => {
    if (serviceId && !serviceSequence.includes(serviceId)) {
      const newSequence = [...serviceSequence, serviceId];
      setValue('service_sequence', newSequence);
      setSelectedServiceToAdd('');
      
      // Calculate total duration
      const service = serviceTypes.find(s => s.id === serviceId);
      if (service) {
        const currentDuration = watch('estimated_total_duration');
        setValue('estimated_total_duration', currentDuration + service.estimated_duration);
      }
    }
  };

  const removeServiceFromSequence = (serviceId: string) => {
    const service = serviceTypes.find(s => s.id === serviceId);
    if (service) {
      const currentDuration = watch('estimated_total_duration');
      setValue('estimated_total_duration', Math.max(0, currentDuration - service.estimated_duration));
    }
    setValue('service_sequence', serviceSequence.filter(id => id !== serviceId));
  };

  const moveServiceInSequence = (fromIndex: number, toIndex: number) => {
    const newSequence = [...serviceSequence];
    const [removed] = newSequence.splice(fromIndex, 1);
    if (removed) {
      newSequence.splice(toIndex, 0, removed);
      setValue('service_sequence', newSequence);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => setIsOpen(open)}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {template ? 'Edit Service Template' : 'Create New Service Template'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Controller
              name="template_name"
              control={control}
              render={({ field }) => (
                <Input
                  label="Template Name *"
                  value={field.value}
                  onChange={(e) => field.onChange(e.target.value)}
                  {...(errors.template_name?.message ? { error: errors.template_name.message } : {})}
                />
              )}
            />
            <Controller
              name="template_code"
              control={control}
              render={({ field }) => (
                <Input
                  label="Template Code *"
                  value={field.value}
                  onChange={(e) => field.onChange(e.target.value)}
                  {...(errors.template_code?.message ? { error: errors.template_code.message } : {})}
                />
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Controller
              name="segment_id"
              control={control}
              render={({ field }) => (
                <Select
                  label="Customer Segment *"
                  value={field.value}
                  onChange={(value) => field.onChange(value)}
                  options={[
                    { value: '', label: 'Select Segment' },
                    ...segments.map((segment) => ({
                      value: segment.id,
                      label: `${segment.segment_name} (${segment.pricing_tier})`,
                    })),
                  ]}
                  {...(errors.segment_id?.message ? { error: errors.segment_id.message } : {})}
                />
              )}
            />
            <Controller
              name="base_price_multiplier"
              control={control}
              render={({ field }) => (
                <Input
                  label="Price Multiplier *"
                  type="number"
                  step="0.1"
                  min="0.1"
                  value={field.value.toString()}
                  onChange={(e) => field.onChange(parseFloat(e.target.value) || 1.0)}
                  {...(errors.base_price_multiplier?.message ? { error: errors.base_price_multiplier.message } : {})}
                />
              )}
            />
          </div>

          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <Textarea
                label="Description"
                value={field.value || ''}
                onChange={(e) => field.onChange(e.target.value)}
                rows={3}
                {...(errors.description?.message ? { error: errors.description.message } : {})}
              />
            )}
          />

          {/* Service Sequence Management */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Service Sequence</label>
            <div className="border border-slate-300 rounded-md p-4">
              <div className="mb-4">
                <Select
                  label="Add Service"
                  value={selectedServiceToAdd}
                  onChange={(value) => {
                    setSelectedServiceToAdd(value);
                    if (value) {
                      addServiceToSequence(value);
                    }
                  }}
                  options={[
                    { value: '', label: 'Select a service to add' },
                    ...serviceTypes
                      .filter(service => !serviceSequence.includes(service.id))
                      .map((service) => ({
                        value: service.id,
                        label: `${service.type_name} ($${service.base_price})`,
                      })),
                  ]}
                />
              </div>

              <div className="space-y-2">
                {serviceSequence.map((serviceId, index) => {
                  const service = serviceTypes.find(s => s.id === serviceId);
                  return service ? (
                    <div key={serviceId} className="flex items-center justify-between p-3 bg-slate-50 rounded-md">
                      <div className="flex items-center space-x-3">
                        <span className="text-sm font-medium text-slate-500">#{index + 1}</span>
                        <div>
                          <div className="text-sm font-medium text-slate-900">{service.type_name}</div>
                          <div className="text-xs text-slate-500">
                            ${service.base_price} • {service.estimated_duration} min
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {index > 0 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => moveServiceInSequence(index, index - 1)}
                            className="p-1"
                          >
                            <ArrowUp className="h-4 w-4" />
                          </Button>
                        )}
                        {index < serviceSequence.length - 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => moveServiceInSequence(index, index + 1)}
                            className="p-1"
                          >
                            <ArrowDown className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeServiceFromSequence(serviceId)}
                          className="p-1 text-red-600 hover:text-red-900"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ) : null;
                })}
                {serviceSequence.length === 0 && (
                  <p className="text-sm text-slate-500 text-center py-4">No services added yet</p>
                )}
              </div>
            </div>
          </div>

          <Controller
            name="is_active"
            control={control}
            render={({ field }) => (
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={field.value}
                  onChange={(checked) => field.onChange(checked)}
                />
                <label className="text-sm font-medium text-slate-700">Active Template</label>
              </div>
            )}
          />

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
            >
              {template ? 'Update Template' : 'Create Template'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// Template Detail Component
interface TemplateDetailProps {
  template: ServiceTemplate;
  serviceTypes: ServiceType[];
  onClose: () => void;
  onEdit: () => void;
}

function TemplateDetail({ template, serviceTypes, onClose, onEdit }: TemplateDetailProps) {
  const segment = template.customer_segments;
  const services = template.service_sequence.map(serviceId => 
    serviceTypes.find(s => s.id === serviceId)
  ).filter(Boolean);

  return (
    <div className="fixed inset-0 bg-slate-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-10 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium text-slate-900">Template Details</h3>
            <div className="flex space-x-3">
              <button
                onClick={onEdit}
                className="inline-flex items-center px-4 py-2 border border-slate-300 text-sm font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50"
              >
                <Pencil className="h-4 w-4 mr-2" />
                Edit
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 border border-slate-300 rounded-md text-sm font-medium text-slate-700 bg-white hover:bg-slate-50"
              >
                Close
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-md font-medium text-gray-900 mb-4">Template Information</h4>
              <dl className="space-y-3">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Template Name</dt>
                  <dd className="mt-1 text-sm text-gray-900">{template.template_name}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Template Code</dt>
                  <dd className="mt-1 text-sm text-gray-900">{template.template_code}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Customer Segment</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {segment?.segment_name} ({segment?.pricing_tier})
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Price Multiplier</dt>
                  <dd className="mt-1 text-sm text-gray-900">{template.base_price_multiplier}x</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Status</dt>
                  <dd className="mt-1">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      template.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {template.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </dd>
                </div>
              </dl>
            </div>

            <div>
              <h4 className="text-md font-medium text-gray-900 mb-4">Service Sequence</h4>
              <div className="space-y-3">
                {services.map((service, index) => (
                  <div key={service?.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                    <div className="flex items-center space-x-3">
                      <span className="text-sm font-medium text-gray-500">#{index + 1}</span>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{service?.type_name}</div>
                        <div className="text-xs text-gray-500">
                          ${service?.base_price} • {service?.estimated_duration} min
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 p-3 bg-blue-50 rounded-md">
                <div className="text-sm text-blue-800">
                  <strong>Total Duration:</strong> {template.estimated_total_duration || 0} minutes<br />
                  <strong>Services:</strong> {services.length} services
                </div>
              </div>
            </div>
          </div>

          {template.description && (
            <div className="mt-6">
              <h4 className="text-md font-medium text-gray-900 mb-2">Description</h4>
              <p className="text-sm text-gray-600">{template.description}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
