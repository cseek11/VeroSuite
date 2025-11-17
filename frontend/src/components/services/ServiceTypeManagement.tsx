import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { supabase } from '@/lib/supabase-client';
import { Plus, Pencil, Trash2, Settings } from 'lucide-react';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Select from '@/components/ui/Select';
import Checkbox from '@/components/ui/Checkbox';
import Button from '@/components/ui/Button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/Dialog';

interface ServiceType {
  id: string;
  tenant_id: string;
  service_name: string;
  service_code: string;
  description: string;
  category_id: string;
  base_price: number;
  estimated_duration: number;
  is_active: boolean;
  required_equipment: Record<string, unknown> | null;
  safety_requirements: Record<string, unknown> | null;
  compliance_requirements: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

interface ServiceCategory {
  id: string;
  tenant_id: string;
  category_name: string;
  category_code: string;
  description: string;
  is_active: boolean;
  created_at: string;
}

export default function ServiceTypeManagement() {
  const queryClient = useQueryClient();
  const [isAddingService, setIsAddingService] = useState(false);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [editingService, setEditingService] = useState<ServiceType | null>(null);
  const [editingCategory, setEditingCategory] = useState<ServiceCategory | null>(null);

  // Fetch service types
  const { data: serviceTypes, isLoading: loadingTypes } = useQuery({
    queryKey: ['service-types'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('service_types')
        .select(`
          *,
          service_categories (
            category_name,
            category_code
          )
        `)
        .eq('tenant_id', '7193113e-ece2-4f7b-ae8c-176df4367e28')
        .order('service_name');
      if (error) throw error;
      return data;
    },
  });

  // Fetch service categories
  const { data: serviceCategories, isLoading: loadingCategories } = useQuery({
    queryKey: ['service-categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('service_categories')
        .select('*')
        .eq('tenant_id', '7193113e-ece2-4f7b-ae8c-176df4367e28')
        .order('category_name');
      if (error) throw error;
      return data;
    },
  });

  // Create service type mutation
  const createServiceTypeMutation = useMutation({
    mutationFn: async (serviceType: Omit<ServiceType, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('service_types')
        .insert({
          ...serviceType,
          tenant_id: '7193113e-ece2-4f7b-ae8c-176df4367e28',
        })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['service-types'] });
      setIsAddingService(false);
    },
  });

  // Update service type mutation
  const updateServiceTypeMutation = useMutation({
    mutationFn: async (serviceType: Partial<ServiceType> & { id: string }) => {
      const { data, error } = await supabase
        .from('service_types')
        .update(serviceType)
        .eq('id', serviceType.id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['service-types'] });
      setEditingService(null);
    },
  });

  // Delete service type mutation
  const deleteServiceTypeMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('service_types')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['service-types'] });
    },
  });

  // Create category mutation
  const createCategoryMutation = useMutation({
    mutationFn: async (category: Omit<ServiceCategory, 'id' | 'created_at'>) => {
      const { data, error } = await supabase
        .from('service_categories')
        .insert({
          ...category,
          tenant_id: '7193113e-ece2-4f7b-ae8c-176df4367e28',
        })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['service-categories'] });
      setIsAddingCategory(false);
    },
  });

  // Update category mutation
  const updateCategoryMutation = useMutation({
    mutationFn: async (category: Partial<ServiceCategory> & { id: string }) => {
      const { data, error } = await supabase
        .from('service_categories')
        .update(category)
        .eq('id', category.id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['service-categories'] });
      setEditingCategory(null);
    },
  });

  if (loadingTypes || loadingCategories) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white shadow-sm border border-slate-200 rounded-lg">
        <div className="px-6 py-4 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Service Type Management</h2>
              <p className="text-sm text-gray-600">
                Manage service types, categories, and pricing for different customer segments
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setIsAddingCategory(true)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                                        <Settings className="h-4 w-4 mr-2" />
                Add Category
              </button>
              <button
                onClick={() => setIsAddingService(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Service Type
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Service Categories */}
      <div className="bg-white shadow-sm border border-slate-200 rounded-lg">
        <div className="px-6 py-4 border-b border-slate-200">
          <h3 className="text-lg font-medium text-gray-900">Service Categories</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Code
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {serviceCategories?.map((category) => (
                <tr key={category.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {category.category_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {category.category_code}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {category.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      category.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {category.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => setEditingCategory(category)}
                      className="text-purple-600 hover:text-purple-900 mr-3"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Service Types */}
      <div className="bg-white shadow-sm border border-slate-200 rounded-lg">
        <div className="px-6 py-4 border-b border-slate-200">
          <h3 className="text-lg font-medium text-gray-900">Service Types</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Service Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Base Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Duration
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {serviceTypes?.map((serviceType) => (
                <tr key={serviceType.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{serviceType.service_name}</div>
                      <div className="text-sm text-gray-500">{serviceType.service_code}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {serviceType.service_categories?.category_name || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${serviceType.base_price?.toFixed(2) || '0.00'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {serviceType.estimated_duration} min
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      serviceType.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {serviceType.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => setEditingService(serviceType)}
                        className="text-purple-600 hover:text-purple-900"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => deleteServiceTypeMutation.mutate(serviceType.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Service Type Modal */}
      {(isAddingService || editingService) && (
        <ServiceTypeForm
          serviceType={editingService}
          categories={serviceCategories || []}
          onSubmit={(data) => {
            if (editingService) {
              updateServiceTypeMutation.mutate({ ...data, id: editingService.id });
            } else {
              createServiceTypeMutation.mutate(data);
            }
          }}
          onCancel={() => {
            setIsAddingService(false);
            setEditingService(null);
          }}
        />
      )}

      {/* Add/Edit Category Modal */}
      {(isAddingCategory || editingCategory) && (
        <CategoryForm
          category={editingCategory}
          onSubmit={(data) => {
            if (editingCategory) {
              updateCategoryMutation.mutate({ ...data, id: editingCategory.id });
            } else {
              createCategoryMutation.mutate(data);
            }
          }}
          onCancel={() => {
            setIsAddingCategory(false);
            setEditingCategory(null);
          }}
        />
      )}
    </div>
  );
}

// Service Type Form Schema
const serviceTypeSchema = z.object({
  service_name: z.string().min(1, 'Service name is required'),
  service_code: z.string().min(1, 'Service code is required'),
  description: z.string().optional(),
  category_id: z.string().min(1, 'Category is required'),
  base_price: z.number().min(0, 'Base price must be 0 or greater'),
  estimated_duration: z.number().min(1, 'Duration must be at least 1 minute'),
  is_active: z.boolean().default(true),
  required_equipment: z.record(z.unknown()).nullable().optional(),
  safety_requirements: z.record(z.unknown()).nullable().optional(),
  compliance_requirements: z.record(z.unknown()).nullable().optional(),
});

type ServiceTypeFormData = z.infer<typeof serviceTypeSchema>;

// Service Type Form Component
interface ServiceTypeFormProps {
  serviceType?: ServiceType | null;
  categories: ServiceCategory[];
  onSubmit: (data: Omit<ServiceType, 'id' | 'created_at' | 'updated_at'>) => void;
  onCancel: () => void;
}

function ServiceTypeForm({ serviceType, categories, onSubmit, onCancel }: ServiceTypeFormProps) {
  const [isOpen, setIsOpen] = useState(true);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ServiceTypeFormData>({
    resolver: zodResolver(serviceTypeSchema),
    defaultValues: {
      service_name: serviceType?.service_name || '',
      service_code: serviceType?.service_code || '',
      description: serviceType?.description || '',
      category_id: serviceType?.category_id || '',
      base_price: serviceType?.base_price || 0,
      estimated_duration: serviceType?.estimated_duration || 60,
      is_active: serviceType?.is_active ?? true,
      required_equipment: serviceType?.required_equipment || null,
      safety_requirements: serviceType?.safety_requirements || null,
      compliance_requirements: serviceType?.compliance_requirements || null,
    },
  });

  const handleFormSubmit = (data: ServiceTypeFormData) => {
    onSubmit(data as Omit<ServiceType, 'id' | 'created_at' | 'updated_at'>);
    setIsOpen(false);
  };

  const handleCancel = () => {
    setIsOpen(false);
    reset();
    onCancel();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {serviceType ? 'Edit Service Type' : 'Add New Service Type'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <Controller
            name="service_name"
            control={control}
            render={({ field }) => (
              <Input
                label="Service Name *"
                value={field.value}
                onChange={(e) => field.onChange(e.target.value)}
                {...(errors.service_name?.message ? { error: errors.service_name.message } : {})}
              />
            )}
          />

          <Controller
            name="service_code"
            control={control}
            render={({ field }) => (
              <Input
                label="Service Code *"
                value={field.value}
                onChange={(e) => field.onChange(e.target.value)}
                {...(errors.service_code?.message ? { error: errors.service_code.message } : {})}
              />
            )}
          />

          <Controller
            name="category_id"
            control={control}
            render={({ field }) => (
              <Select
                label="Category *"
                value={field.value}
                onChange={(value) => field.onChange(value)}
                options={[
                  { value: '', label: 'Select Category' },
                  ...categories.map((category) => ({
                    value: category.id,
                    label: category.category_name,
                  })),
                ]}
                {...(errors.category_id?.message ? { error: errors.category_id.message } : {})}
              />
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <Controller
              name="base_price"
              control={control}
              render={({ field }) => (
                <Input
                  label="Base Price ($) *"
                  type="number"
                  step="0.01"
                  min="0"
                  value={field.value.toString()}
                  onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                  {...(errors.base_price?.message ? { error: errors.base_price.message } : {})}
                />
              )}
            />
            <Controller
              name="estimated_duration"
              control={control}
              render={({ field }) => (
                <Input
                  label="Duration (min) *"
                  type="number"
                  min="1"
                  value={field.value.toString()}
                  onChange={(e) => field.onChange(parseInt(e.target.value) || 60)}
                  {...(errors.estimated_duration?.message ? { error: errors.estimated_duration.message } : {})}
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

          <Controller
            name="is_active"
            control={control}
            render={({ field }) => (
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={field.value}
                  onChange={(checked) => field.onChange(checked)}
                />
                <label className="text-sm font-medium text-slate-700">Active</label>
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
              {serviceType ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// Category Form Schema
const categorySchema = z.object({
  category_name: z.string().min(1, 'Category name is required'),
  category_code: z.string().min(1, 'Category code is required'),
  description: z.string().optional(),
  is_active: z.boolean().default(true),
});

type CategoryFormData = z.infer<typeof categorySchema>;

// Category Form Component
interface CategoryFormProps {
  category?: ServiceCategory | null;
  onSubmit: (data: Omit<ServiceCategory, 'id' | 'created_at'>) => void;
  onCancel: () => void;
}

function CategoryForm({ category, onSubmit, onCancel }: CategoryFormProps) {
  const [isOpen, setIsOpen] = useState(true);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      category_name: category?.category_name || '',
      category_code: category?.category_code || '',
      description: category?.description || '',
      is_active: category?.is_active ?? true,
    },
  });

  const handleFormSubmit = (data: CategoryFormData) => {
    onSubmit({
      ...data,
      tenant_id: category?.tenant_id || '7193113e-ece2-4f7b-ae8c-176df4367e28',
    } as Omit<ServiceCategory, 'id' | 'created_at'>);
    setIsOpen(false);
  };

  const handleCancel = () => {
    setIsOpen(false);
    reset();
    onCancel();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {category ? 'Edit Category' : 'Add New Category'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <Controller
            name="category_name"
            control={control}
            render={({ field }) => (
              <Input
                label="Category Name *"
                value={field.value}
                onChange={(e) => field.onChange(e.target.value)}
                {...(errors.category_name?.message ? { error: errors.category_name.message } : {})}
              />
            )}
          />

          <Controller
            name="category_code"
            control={control}
            render={({ field }) => (
              <Input
                label="Category Code *"
                value={field.value}
                onChange={(e) => field.onChange(e.target.value)}
                {...(errors.category_code?.message ? { error: errors.category_code.message } : {})}
              />
            )}
          />

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

          <Controller
            name="is_active"
            control={control}
            render={({ field }) => (
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={field.value}
                  onChange={(checked) => field.onChange(checked)}
                />
                <label className="text-sm font-medium text-slate-700">Active</label>
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
              {category ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
