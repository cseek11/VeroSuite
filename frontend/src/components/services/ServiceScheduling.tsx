import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase-client';
import { CalendarIcon, ClockIcon, UserIcon, MapPinIcon, PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

interface ServiceSchedule {
  id: string;
  tenant_id: string;
  customer_id: string;
  service_type_id: string;
  technician_id: string;
  scheduled_date: string;
  scheduled_time: string;
  estimated_duration: number;
  status: 'scheduled' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  notes: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  location_notes: string;
  created_at: string;
  updated_at: string;
}

interface Customer {
  id: string;
  name: string;
  account_type: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
}

interface ServiceType {
  id: string;
  type_name: string;
  type_code: string;
  base_price: number;
  estimated_duration: number;
}

interface Technician {
  id: string;
  name: string;
  email: string;
  is_active: boolean;
}

export default function ServiceScheduling() {
  const queryClient = useQueryClient();
  const [isAddingSchedule, setIsAddingSchedule] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<ServiceSchedule | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedTechnician, setSelectedTechnician] = useState<string>('all');

  // Fetch service schedules
  const { data: serviceSchedules, isLoading: loadingSchedules } = useQuery({
    queryKey: ['service-schedules', selectedDate, selectedTechnician],
    queryFn: async () => {
      let query = supabase
        .from('service_schedules')
        .select(`
          *,
          customers (
            id,
            name,
            account_type,
            address,
            city,
            state,
            zip_code
          ),
          service_types (
            id,
            type_name,
            type_code,
            base_price,
            estimated_duration
          ),
          technicians (
            id,
            name,
            email
          )
        `)
        .eq('tenant_id', '7193113e-ece2-4f7b-ae8c-176df4367e28');

      // Apply date filter
      if (selectedDate) {
        const startOfDay = new Date(selectedDate);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(selectedDate);
        endOfDay.setHours(23, 59, 59, 999);
        
        query = query.gte('scheduled_date', startOfDay.toISOString())
                    .lte('scheduled_date', endOfDay.toISOString());
      }

      // Apply technician filter
      if (selectedTechnician !== 'all') {
        query = query.eq('technician_id', selectedTechnician);
      }

      query = query.order('scheduled_time');

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  // Fetch customers
  const { data: customers } = useQuery({
    queryKey: ['customers-for-scheduling'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('accounts')
        .select('id, name, account_type, address, city, state, zip_code')
        .eq('tenant_id', '7193113e-ece2-4f7b-ae8c-176df4367e28')
        .eq('status', 'active')
        .order('name');
      if (error) throw error;
      return data;
    },
  });

  // Fetch service types
  const { data: serviceTypes } = useQuery({
    queryKey: ['service-types-for-scheduling'],
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

  // Fetch technicians
  const { data: technicians } = useQuery({
    queryKey: ['technicians-for-scheduling'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('technicians')
        .select('*')
        .eq('tenant_id', '7193113e-ece2-4f7b-ae8c-176df4367e28')
        .eq('is_active', true)
        .order('name');
      if (error) throw error;
      return data;
    },
  });

  // Create schedule mutation
  const createScheduleMutation = useMutation({
    mutationFn: async (schedule: Omit<ServiceSchedule, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('service_schedules')
        .insert({
          ...schedule,
          tenant_id: '7193113e-ece2-4f7b-ae8c-176df4367e28',
        })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['service-schedules'] });
      setIsAddingSchedule(false);
    },
  });

  // Update schedule mutation
  const updateScheduleMutation = useMutation({
    mutationFn: async (schedule: Partial<ServiceSchedule> & { id: string }) => {
      const { data, error } = await supabase
        .from('service_schedules')
        .update(schedule)
        .eq('id', schedule.id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['service-schedules'] });
      setEditingSchedule(null);
    },
  });

  // Delete schedule mutation
  const deleteScheduleMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('service_schedules')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['service-schedules'] });
    },
  });

  if (loadingSchedules) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'scheduled': 'bg-blue-100 text-blue-800',
      'confirmed': 'bg-green-100 text-green-800',
      'in_progress': 'bg-yellow-100 text-yellow-800',
      'completed': 'bg-purple-100 text-purple-800',
      'cancelled': 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      'low': 'bg-gray-100 text-gray-800',
      'medium': 'bg-blue-100 text-blue-800',
      'high': 'bg-orange-100 text-orange-800',
      'urgent': 'bg-red-100 text-red-800',
    };
    return colors[priority] || 'bg-gray-100 text-gray-800';
  };

  const formatTime = (timeString: string) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const getTimeSlots = () => {
    const slots = [];
    for (let hour = 6; hour <= 20; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:00`;
        slots.push(time);
      }
    }
    return slots;
  };

  const timeSlots = getTimeSlots();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white shadow-sm border border-gray-200 rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Service Scheduling</h2>
              <p className="text-sm text-gray-600">
                Schedule and manage service appointments for customers
              </p>
            </div>
            <button
              onClick={() => setIsAddingSchedule(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Schedule Service
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white shadow-sm border border-gray-200 rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Schedule Filters</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Technician</label>
              <select
                value={selectedTechnician}
                onChange={(e) => setSelectedTechnician(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
              >
                <option value="all">All Technicians</option>
                {technicians?.map((technician) => (
                  <option key={technician.id} value={technician.id}>
                    {technician.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Schedule Calendar View */}
      <div className="bg-white shadow-sm border border-gray-200 rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Schedule for {new Date(selectedDate).toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                  Time
                </th>
                {technicians?.map((technician) => (
                  <th key={technician.id} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-48">
                    <div className="flex items-center">
                      <UserIcon className="h-4 w-4 text-gray-400 mr-2" />
                      {technician.name}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {timeSlots.map((timeSlot) => (
                <tr key={timeSlot} className="hover:bg-gray-50">
                  <td className="px-6 py-2 text-sm font-medium text-gray-900 border-r border-gray-200">
                    {formatTime(timeSlot)}
                  </td>
                  {technicians?.map((technician) => {
                    const schedule = serviceSchedules?.find(
                      s => s.technician_id === technician.id && 
                           s.scheduled_time === timeSlot &&
                           s.status !== 'cancelled'
                    );
                    
                    return (
                      <td key={technician.id} className="px-6 py-2 border-r border-gray-200">
                        {schedule ? (
                          <div className="p-2 bg-purple-50 border border-purple-200 rounded-md">
                            <div className="text-sm font-medium text-purple-900">
                              {schedule.customers?.name}
                            </div>
                            <div className="text-xs text-purple-600">
                              {schedule.service_types?.type_name}
                            </div>
                            <div className="flex items-center justify-between mt-1">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(schedule.status)}`}>
                                {schedule.status.replace('_', ' ')}
                              </span>
                              <div className="flex space-x-1">
                                <button
                                  onClick={() => setEditingSchedule(schedule)}
                                  className="text-purple-600 hover:text-purple-900 p-1 rounded hover:bg-purple-100"
                                >
                                  <PencilIcon className="h-3 w-3" />
                                </button>
                                <button
                                  onClick={() => deleteScheduleMutation.mutate(schedule.id)}
                                  className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-100"
                                >
                                  <TrashIcon className="h-3 w-3" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="h-16 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center">
                            <span className="text-xs text-gray-400">Available</span>
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Schedule Modal */}
      {(isAddingSchedule || editingSchedule) && (
        <ScheduleForm
          schedule={editingSchedule}
          customers={customers || []}
          serviceTypes={serviceTypes || []}
          technicians={technicians || []}
          selectedDate={selectedDate}
          onSubmit={(data) => {
            if (editingSchedule) {
              updateScheduleMutation.mutate({ ...data, id: editingSchedule.id });
            } else {
              createScheduleMutation.mutate(data);
            }
          }}
          onCancel={() => {
            setIsAddingSchedule(false);
            setEditingSchedule(null);
          }}
        />
      )}
    </div>
  );
}

// Schedule Form Component
interface ScheduleFormProps {
  schedule?: ServiceSchedule | null;
  customers: Customer[];
  serviceTypes: ServiceType[];
  technicians: Technician[];
  selectedDate: string;
  onSubmit: (data: Omit<ServiceSchedule, 'id' | 'created_at' | 'updated_at'>) => void;
  onCancel: () => void;
}

function ScheduleForm({ schedule, customers, serviceTypes, technicians, selectedDate, onSubmit, onCancel }: ScheduleFormProps) {
  const [formData, setFormData] = useState({
    customer_id: schedule?.customer_id || '',
    service_type_id: schedule?.service_type_id || '',
    technician_id: schedule?.technician_id || '',
    scheduled_date: schedule?.scheduled_date || selectedDate,
    scheduled_time: schedule?.scheduled_time || '09:00:00',
    estimated_duration: schedule?.estimated_duration || 60,
    status: schedule?.status || 'scheduled',
    notes: schedule?.notes || '',
    priority: schedule?.priority || 'medium',
    location_notes: schedule?.location_notes || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const getTimeSlots = () => {
    const slots = [];
    for (let hour = 6; hour <= 20; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:00`;
        slots.push(time);
      }
    }
    return slots;
  };

  const timeSlots = getTimeSlots();

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-10 mx-auto p-5 border w-11/12 max-w-2xl shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            {schedule ? 'Edit Service Schedule' : 'Schedule New Service'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Customer</label>
                <select
                  value={formData.customer_id}
                  onChange={(e) => setFormData({ ...formData, customer_id: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                  required
                >
                  <option value="">Select Customer</option>
                  {customers.map((customer) => (
                    <option key={customer.id} value={customer.id}>
                      {customer.name} ({customer.account_type})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Service Type</label>
                <select
                  value={formData.service_type_id}
                  onChange={(e) => {
                    const serviceType = serviceTypes.find(s => s.id === e.target.value);
                    setFormData({
                      ...formData,
                      service_type_id: e.target.value,
                      estimated_duration: serviceType?.estimated_duration || 60,
                    });
                  }}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                  required
                >
                  <option value="">Select Service</option>
                  {serviceTypes.map((serviceType) => (
                    <option key={serviceType.id} value={serviceType.id}>
                      {serviceType.type_name} (${serviceType.base_price})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Date</label>
                <input
                  type="date"
                  value={formData.scheduled_date}
                  onChange={(e) => setFormData({ ...formData, scheduled_date: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Time</label>
                <select
                  value={formData.scheduled_time}
                  onChange={(e) => setFormData({ ...formData, scheduled_time: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                  required
                >
                  {timeSlots.map((time) => (
                    <option key={time} value={time}>
                      {new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
                        hour: 'numeric',
                        minute: '2-digit',
                        hour12: true,
                      })}
                    </option>
                  ))}
                </select>
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Technician</label>
                <select
                  value={formData.technician_id}
                  onChange={(e) => setFormData({ ...formData, technician_id: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                  required
                >
                  <option value="">Select Technician</option>
                  {technicians.map((technician) => (
                    <option key={technician.id} value={technician.id}>
                      {technician.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Priority</label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                  required
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Notes</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                placeholder="Service notes, special instructions..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Location Notes</label>
              <textarea
                value={formData.location_notes}
                onChange={(e) => setFormData({ ...formData, location_notes: e.target.value })}
                rows={2}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                placeholder="Access instructions, parking info..."
              />
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
                {schedule ? 'Update Schedule' : 'Schedule Service'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
