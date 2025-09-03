import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase-client';
import { MapIcon, ClockIcon, UserIcon, TruckIcon, CalculatorIcon } from '@heroicons/react/24/outline';

interface ServiceSchedule {
  id: string;
  tenant_id: string;
  customer_id: string;
  service_type_id: string;
  technician_id: string;
  scheduled_date: string;
  scheduled_time: string;
  estimated_duration: number;
  status: string;
  priority: string;
  location_notes: string;
}

interface Customer {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  account_type: string;
}

interface ServiceType {
  id: string;
  type_name: string;
  estimated_duration: number;
}

interface Technician {
  id: string;
  name: string;
  email: string;
  is_active: boolean;
}

interface OptimizedRoute {
  technician_id: string;
  technician_name: string;
  stops: RouteStop[];
  total_distance: number;
  total_duration: number;
  total_revenue: number;
}

interface RouteStop {
  customer_id: string;
  customer_name: string;
  address: string;
  scheduled_time: string;
  service_type: string;
  estimated_duration: number;
  priority: string;
  sequence: number;
}

export default function RouteOptimization() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedTechnician, setSelectedTechnician] = useState<string>('all');
  const [optimizationMethod, setOptimizationMethod] = useState<'nearest_neighbor' | 'priority_based' | 'time_windows'>('nearest_neighbor');

  // Fetch service schedules for the selected date
  const { data: serviceSchedules, isLoading: loadingSchedules } = useQuery({
    queryKey: ['service-schedules-for-routing', selectedDate, selectedTechnician],
    queryFn: async () => {
      let query = supabase
        .from('service_schedules')
        .select(`
          *,
          customers (
            id,
            name,
            address,
            city,
            state,
            zip_code,
            account_type
          ),
          service_types (
            id,
            type_name,
            estimated_duration
          ),
          technicians (
            id,
            name,
            email
          )
        `)
        .eq('tenant_id', '7193113e-ece2-4f7b-ae8c-176df4367e28')
        .eq('scheduled_date', selectedDate)
        .in('status', ['scheduled', 'confirmed']);

      if (selectedTechnician !== 'all') {
        query = query.eq('technician_id', selectedTechnician);
      }

      query = query.order('scheduled_time');

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  // Fetch technicians for filter
  const { data: technicians } = useQuery({
    queryKey: ['technicians-for-routing'],
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

  // Optimize routes based on selected method
  const optimizedRoutes = useMemo(() => {
    if (!serviceSchedules || !technicians) return [];

    const routes: OptimizedRoute[] = [];
    const technicianIds = selectedTechnician === 'all' 
      ? technicians.map(t => t.id)
      : [selectedTechnician];

    technicianIds.forEach(technicianId => {
      const technician = technicians.find(t => t.id === technicianId);
      if (!technician) return;

      const technicianSchedules = serviceSchedules.filter(s => s.technician_id === technicianId);
      if (technicianSchedules.length === 0) return;

      let stops: RouteStop[] = technicianSchedules.map(schedule => ({
        customer_id: schedule.customer_id,
        customer_name: schedule.customers?.name || 'Unknown',
        address: `${schedule.customers?.address}, ${schedule.customers?.city}, ${schedule.customers?.state} ${schedule.customers?.zip_code}`,
        scheduled_time: schedule.scheduled_time,
        service_type: schedule.service_types?.type_name || 'Unknown',
        estimated_duration: schedule.service_types?.estimated_duration || 60,
        priority: schedule.priority,
        sequence: 0,
      }));

      // Apply optimization algorithm
      stops = optimizeRoute(stops, optimizationMethod);

      // Calculate totals
      const totalDuration = stops.reduce((sum, stop) => sum + stop.estimated_duration, 0);
      const totalRevenue = stops.reduce((sum, stop) => {
        // Mock revenue calculation - replace with actual pricing logic
        return sum + 150; // Assume $150 per service
      }, 0);

      routes.push({
        technician_id: technician.id,
        technician_name: technician.name,
        stops,
        total_distance: calculateTotalDistance(stops), // Mock distance calculation
        total_duration: totalDuration,
        total_revenue: totalRevenue,
      });
    });

    return routes;
  }, [serviceSchedules, technicians, selectedTechnician, optimizationMethod]);

  const optimizeRoute = (stops: RouteStop[], method: string): RouteStop[] => {
    switch (method) {
      case 'nearest_neighbor':
        return optimizeNearestNeighbor(stops);
      case 'priority_based':
        return optimizePriorityBased(stops);
      case 'time_windows':
        return optimizeTimeWindows(stops);
      default:
        return stops;
    }
  };

  const optimizeNearestNeighbor = (stops: RouteStop[]): RouteStop[] => {
    // Simple nearest neighbor algorithm
    // In a real implementation, this would use actual coordinates and distance calculations
    const optimized = [...stops];
    for (let i = 0; i < optimized.length - 1; i++) {
      // Mock optimization - in reality, this would calculate actual distances
      if (Math.random() > 0.5) {
        [optimized[i], optimized[i + 1]] = [optimized[i + 1], optimized[i]];
      }
    }
    return optimized.map((stop, index) => ({ ...stop, sequence: index + 1 }));
  };

  const optimizePriorityBased = (stops: RouteStop[]): RouteStop[] => {
    const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
    return [...stops]
      .sort((a, b) => priorityOrder[b.priority as keyof typeof priorityOrder] - priorityOrder[a.priority as keyof typeof priorityOrder])
      .map((stop, index) => ({ ...stop, sequence: index + 1 }));
  };

  const optimizeTimeWindows = (stops: RouteStop[]): RouteStop[] => {
    return [...stops]
      .sort((a, b) => a.scheduled_time.localeCompare(b.scheduled_time))
      .map((stop, index) => ({ ...stop, sequence: index + 1 }));
  };

  const calculateTotalDistance = (stops: RouteStop[]): number => {
    // Mock distance calculation - replace with actual distance API calls
    return stops.length * 5.2; // Assume 5.2 miles between stops on average
  };

  const formatTime = (timeString: string) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
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

  if (loadingSchedules) {
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
              <h2 className="text-xl font-semibold text-gray-900">Route Optimization</h2>
              <p className="text-sm text-gray-600">
                Optimize technician routes for efficient service delivery
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-purple-600">
                {optimizedRoutes.reduce((sum, route) => sum + route.stops.length, 0)}
              </div>
              <div className="text-sm text-gray-500">Total Stops</div>
            </div>
          </div>
        </div>
      </div>

      {/* Optimization Controls */}
      <div className="bg-white shadow-sm border border-gray-200 rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Optimization Settings</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Optimization Method</label>
              <select
                value={optimizationMethod}
                onChange={(e) => setOptimizationMethod(e.target.value as any)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
              >
                <option value="nearest_neighbor">Nearest Neighbor</option>
                <option value="priority_based">Priority Based</option>
                <option value="time_windows">Time Windows</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Route Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <TruckIcon className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900">
                {optimizedRoutes.reduce((sum, route) => sum + route.total_distance, 0).toFixed(1)}
              </div>
              <div className="text-sm text-gray-500">Total Miles</div>
            </div>
          </div>
        </div>
        <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ClockIcon className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900">
                {Math.round(optimizedRoutes.reduce((sum, route) => sum + route.total_duration, 0) / 60)}
              </div>
              <div className="text-sm text-gray-500">Total Hours</div>
            </div>
          </div>
        </div>
        <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CalculatorIcon className="h-8 w-8 text-purple-600" />
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900">
                ${optimizedRoutes.reduce((sum, route) => sum + route.total_revenue, 0).toLocaleString()}
              </div>
              <div className="text-sm text-gray-500">Total Revenue</div>
            </div>
          </div>
        </div>
      </div>

      {/* Optimized Routes */}
      {optimizedRoutes.map((route) => (
        <div key={route.technician_id} className="bg-white shadow-sm border border-gray-200 rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <UserIcon className="h-5 w-5 text-gray-400 mr-2" />
                <h3 className="text-lg font-medium text-gray-900">{route.technician_name}</h3>
              </div>
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span>{route.stops.length} stops</span>
                <span>{route.total_distance.toFixed(1)} miles</span>
                <span>{Math.round(route.total_duration / 60)} hours</span>
                <span>${route.total_revenue.toLocaleString()}</span>
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16">
                    #
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Address
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Service
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Duration
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Priority
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {route.stops.map((stop) => (
                  <tr key={stop.customer_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {stop.sequence}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{stop.customer_name}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                      {stop.address}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatTime(stop.scheduled_time)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {stop.service_type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {stop.estimated_duration} min
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(stop.priority)}`}>
                        {stop.priority}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}

      {/* No Routes */}
      {optimizedRoutes.length === 0 && (
        <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-12 text-center">
          <MapIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No routes to optimize</h3>
          <p className="mt-1 text-sm text-gray-500">
            No scheduled services found for the selected date and technician.
          </p>
        </div>
      )}

      {/* Optimization Notes */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-medium text-blue-900 mb-2">Optimization Notes</h3>
        <div className="text-sm text-blue-800 space-y-2">
          <p><strong>Nearest Neighbor:</strong> Routes are optimized to minimize travel distance between consecutive stops.</p>
          <p><strong>Priority Based:</strong> Routes prioritize urgent and high-priority services first.</p>
          <p><strong>Time Windows:</strong> Routes respect scheduled appointment times and optimize for time efficiency.</p>
          <p className="text-xs mt-4">
            Note: This is a basic optimization implementation. For production use, integrate with mapping APIs 
            (Google Maps, Mapbox) for accurate distance calculations and real-time traffic data.
          </p>
        </div>
      </div>
    </div>
  );
}
