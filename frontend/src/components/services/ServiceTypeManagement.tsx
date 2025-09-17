import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase-client';
import { PlusIcon, PencilIcon, TrashIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';

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
  required_equipment: any;
  safety_requirements: any;
  compliance_requirements: any;
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
      <div className="bg-white shadow-sm border border-gray-200 rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
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
                                        <Cog6ToothIcon className="h-4 w-4 mr-2" />
                Add Category
              </button>
              <button
                onClick={() => setIsAddingService(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                Add Service Type
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Service Categories */}
      <div className="bg-white shadow-sm border border-gray-200 rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
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
                      <PencilIcon className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Service Types */}
      <div className="bg-white shadow-sm border border-gray-200 rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
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
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => deleteServiceTypeMutation.mutate(serviceType.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <TrashIcon className="h-4 w-4" />
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

// Service Type Form Component
interface ServiceTypeFormProps {
  serviceType?: ServiceType | null;
  categories: ServiceCategory[];
  onSubmit: (data: Omit<ServiceType, 'id' | 'created_at' | 'updated_at'>) => void;
  onCancel: () => void;
}

function ServiceTypeForm({ serviceType, categories, onSubmit, onCancel }: ServiceTypeFormProps) {
  const [formData, setFormData] = useState({
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
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            {serviceType ? 'Edit Service Type' : 'Add New Service Type'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Service Name</label>
              <input
                type="text"
                value={formData.service_name}
                onChange={(e) => setFormData({ ...formData, service_name: e.target.value })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Service Code</label>
              <input
                type="text"
                value={formData.service_code}
                onChange={(e) => setFormData({ ...formData, service_code: e.target.value })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Category</label>
              <select
                value={formData.category_id}
                onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                required
              >
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.category_name}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Base Price ($)</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.base_price}
                  onChange={(e) => setFormData({ ...formData, base_price: parseFloat(e.target.value) || 0 })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Duration (min)</label>
                <input
                  type="number"
                  value={formData.estimated_duration}
                  onChange={(e) => setFormData({ ...formData, estimated_duration: parseInt(e.target.value) || 60 })}
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
            <div className="flex items-center">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Active</span>
              </label>
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
                {serviceType ? 'Update' : 'Create'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// Category Form Component
interface CategoryFormProps {
  category?: ServiceCategory | null;
  onSubmit: (data: Omit<ServiceCategory, 'id' | 'created_at'>) => void;
  onCancel: () => void;
}

function CategoryForm({ category, onSubmit, onCancel }: CategoryFormProps) {
  const [formData, setFormData] = useState({
    category_name: category?.category_name || '',
    category_code: category?.category_code || '',
    description: category?.description || '',
    is_active: category?.is_active ?? true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            {category ? 'Edit Category' : 'Add New Category'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Category Name</label>
              <input
                type="text"
                value={formData.category_name}
                onChange={(e) => setFormData({ ...formData, category_name: e.target.value })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Category Code</label>
              <input
                type="text"
                value={formData.category_code}
                onChange={(e) => setFormData({ ...formData, category_code: e.target.value })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                required
              />
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
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">Active</span>
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
                {category ? 'Update' : 'Create'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
