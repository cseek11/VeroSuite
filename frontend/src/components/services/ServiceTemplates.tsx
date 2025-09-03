import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase-client';
import { PlusIcon, PencilIcon, TrashIcon, DocumentDuplicateIcon } from '@heroicons/react/24/outline';

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
    return colors[pricingTier.toLowerCase()] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white shadow-sm border border-gray-200 rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Service Templates</h2>
              <p className="text-sm text-gray-600">
                Create and manage service templates by customer segment for consistent service delivery
              </p>
            </div>
            <button
              onClick={() => setIsAddingTemplate(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
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
            className="bg-white shadow-sm border border-gray-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => setSelectedTemplate(template)}
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-gray-900 mb-1">
                    {template.template_name}
                  </h3>
                  <p className="text-sm text-gray-500 mb-2">
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
                    <DocumentDuplicateIcon className="h-4 w-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingTemplate(template);
                    }}
                    className="text-purple-600 hover:text-purple-900 p-1 rounded hover:bg-purple-50"
                    title="Edit Template"
                  >
                    <PencilIcon className="h-4 w-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteTemplateMutation.mutate(template.id);
                    }}
                    className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                    title="Delete Template"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              <p className="text-sm text-gray-600 mb-4">
                {template.description || 'No description provided'}
              </p>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Services:</span>
                  <span className="text-gray-900 font-medium">
                    {template.service_sequence?.length || 0} services
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Duration:</span>
                  <span className="text-gray-900 font-medium">
                    {template.estimated_total_duration || 0} min
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Price Multiplier:</span>
                  <span className="text-gray-900 font-medium">
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

// Template Form Component
interface TemplateFormProps {
  template?: ServiceTemplate | null;
  segments: CustomerSegment[];
  serviceTypes: ServiceType[];
  onSubmit: (data: Omit<ServiceTemplate, 'id' | 'created_at' | 'updated_at'>) => void;
  onCancel: () => void;
}

function TemplateForm({ template, segments, serviceTypes, onSubmit, onCancel }: TemplateFormProps) {
  const [formData, setFormData] = useState({
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
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const addServiceToSequence = (serviceId: string) => {
    if (!formData.service_sequence.includes(serviceId)) {
      setFormData({
        ...formData,
        service_sequence: [...formData.service_sequence, serviceId],
      });
    }
  };

  const removeServiceFromSequence = (serviceId: string) => {
    setFormData({
      ...formData,
      service_sequence: formData.service_sequence.filter(id => id !== serviceId),
    });
  };

  const moveServiceInSequence = (fromIndex: number, toIndex: number) => {
    const newSequence = [...formData.service_sequence];
    const [removed] = newSequence.splice(fromIndex, 1);
    newSequence.splice(toIndex, 0, removed);
    setFormData({
      ...formData,
      service_sequence: newSequence,
    });
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-10 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            {template ? 'Edit Service Template' : 'Create New Service Template'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Template Name</label>
                <input
                  type="text"
                  value={formData.template_name}
                  onChange={(e) => setFormData({ ...formData, template_name: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Template Code</label>
                <input
                  type="text"
                  value={formData.template_code}
                  onChange={(e) => setFormData({ ...formData, template_code: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Customer Segment</label>
                <select
                  value={formData.segment_id}
                  onChange={(e) => setFormData({ ...formData, segment_id: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                  required
                >
                  <option value="">Select Segment</option>
                  {segments.map((segment) => (
                    <option key={segment.id} value={segment.id}>
                      {segment.segment_name} ({segment.pricing_tier})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Price Multiplier</label>
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  value={formData.base_price_multiplier}
                  onChange={(e) => setFormData({ ...formData, base_price_multiplier: parseFloat(e.target.value) || 1.0 })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
              />
            </div>

            {/* Service Sequence Management */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Service Sequence</label>
              <div className="border border-gray-300 rounded-md p-4">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Add Service</label>
                  <select
                    onChange={(e) => {
                      if (e.target.value) {
                        addServiceToSequence(e.target.value);
                        e.target.value = '';
                      }
                    }}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                  >
                    <option value="">Select a service to add</option>
                    {serviceTypes
                      .filter(service => !formData.service_sequence.includes(service.id))
                      .map((service) => (
                        <option key={service.id} value={service.id}>
                          {service.type_name} (${service.base_price})
                        </option>
                      ))}
                  </select>
                </div>

                <div className="space-y-2">
                  {formData.service_sequence.map((serviceId, index) => {
                    const service = serviceTypes.find(s => s.id === serviceId);
                    return service ? (
                      <div key={serviceId} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                        <div className="flex items-center space-x-3">
                          <span className="text-sm font-medium text-gray-500">#{index + 1}</span>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{service.type_name}</div>
                            <div className="text-xs text-gray-500">
                              ${service.base_price} • {service.estimated_duration} min
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {index > 0 && (
                            <button
                              type="button"
                              onClick={() => moveServiceInSequence(index, index - 1)}
                              className="text-gray-400 hover:text-gray-600"
                            >
                              ↑
                            </button>
                          )}
                          {index < formData.service_sequence.length - 1 && (
                            <button
                              type="button"
                              onClick={() => moveServiceInSequence(index, index + 1)}
                              className="text-gray-400 hover:text-gray-600"
                            >
                              ↓
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => removeServiceFromSequence(serviceId)}
                            className="text-red-600 hover:text-red-900"
                          >
                            ×
                          </button>
                        </div>
                      </div>
                    ) : null;
                  })}
                </div>
              </div>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">Active Template</span>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700"
              >
                {template ? 'Update Template' : 'Create Template'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
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
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-10 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium text-gray-900">Template Details</h3>
            <div className="flex space-x-3">
              <button
                onClick={onEdit}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <PencilIcon className="h-4 w-4 mr-2" />
                Edit
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
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
