import React, { useMemo, useState } from 'react';
import { Calendar, Clock, User, MapPin, CheckCircle, AlertCircle, Plus } from 'lucide-react';
import { Button, Typography, Badge } from '@/components/ui';
import { useQuery } from '@tanstack/react-query';
import { enhancedApi } from '@/lib/enhanced-api';

interface CustomerServicesProps {
  customerId: string;
}

const CustomerServices: React.FC<CustomerServicesProps> = ({ customerId }) => {
  const [activeTab, setActiveTab] = useState('upcoming');

  const { data: jobs = [], isLoading: _jobsLoading } = useQuery({
    queryKey: ['customer-jobs', customerId],
    queryFn: () => enhancedApi.jobs.getByCustomerId(customerId),
    enabled: !!customerId,
  });

  const { data: workOrders = [], isLoading: _workOrdersLoading } = useQuery({
    queryKey: ['customer-work-orders', customerId],
    queryFn: () => enhancedApi.workOrders.getByCustomerId(customerId),
    enabled: !!customerId,
  });

  const upcomingServices = useMemo(() => {
    const scheduled = (jobs || []).filter((j: any) => ['scheduled', 'unassigned'].includes((j.status || '').toLowerCase()));
    return scheduled.map((j: any) => ({
      id: j.id,
      date: j.scheduled_date,
      time: j.scheduled_start_time,
      service: j.work_orders?.service_type || j.work_orders?.description || 'Service',
      technician: j.technicians ? `${j.technicians.first_name} ${j.technicians.last_name}` : 'Unassigned',
      status: j.status,
    }));
  }, [jobs]);

  const pendingWorkOrders = useMemo(() => {
    return (workOrders || []).filter((w: any) => (w.status || '').toLowerCase() === 'pending');
  }, [workOrders]);

  const serviceHistory = useMemo(() => {
    return (jobs || []).filter((j: any) => (j.status || '').toLowerCase() === 'completed').map((j: any) => ({
      id: j.id,
      date: j.actual_end_time || j.scheduled_date,
      service: j.work_orders?.service_type || 'Service',
      technician: j.technicians ? `${j.technicians.first_name} ${j.technicians.last_name}` : 'Tech',
      status: j.status,
      notes: j.completion_notes,
    }));
  }, [jobs]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'scheduled':
        return <Calendar className="w-4 h-4" />;
      case 'pending':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Typography variant="h3" className="text-lg font-semibold text-gray-900">
          Services & Work Orders
        </Typography>
        <Button size="sm" className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Schedule Service
        </Button>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
        <button
          onClick={() => setActiveTab('upcoming')}
          className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors ${
            activeTab === 'upcoming'
              ? 'bg-white text-purple-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Upcoming ({upcomingServices.length})
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors ${
            activeTab === 'history'
              ? 'bg-white text-purple-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          History ({serviceHistory.length})
        </button>
        <button
          onClick={() => setActiveTab('workorders')}
          className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors ${
            activeTab === 'workorders'
              ? 'bg-white text-purple-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Work Orders ({pendingWorkOrders.length})
        </button>
      </div>

      {/* Content */}
      {activeTab === 'upcoming' && (
        <div className="space-y-3">
          {upcomingServices.map((service) => (
            <div key={service.id} className="bg-white rounded-lg p-4 border border-gray-200/50">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                    <Calendar className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{service.service}</h4>
                    <p className="text-sm text-gray-600">
                      {new Date(service.date).toLocaleDateString()} at {service.time}
                    </p>
                  </div>
                </div>
                <Badge className={getStatusColor(service.status)}>
                  <div className="flex items-center gap-1">
                    {getStatusIcon(service.status)}
                    {service.status.charAt(0).toUpperCase() + service.status.slice(1)}
                  </div>
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">{service.technician}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">Primary Address</span>
                </div>
              </div>
              
              <div className="flex gap-2 mt-3">
                <Button variant="outline" size="sm">
                  Reschedule
                </Button>
                <Button variant="outline" size="sm">
                  View Details
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'history' && (
        <div className="space-y-3">
          {serviceHistory.map((service) => (
            <div key={service.id} className="bg-white rounded-lg p-4 border border-gray-200/50">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{service.service}</h4>
                    <p className="text-sm text-gray-600">
                      {new Date(service.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <Badge className={getStatusColor(service.status)}>
                  <div className="flex items-center gap-1">
                    {getStatusIcon(service.status)}
                    {service.status.charAt(0).toUpperCase() + service.status.slice(1)}
                  </div>
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">{service.technician}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">Primary Address</span>
                </div>
              </div>
              
              {service.notes && (
                <div className="bg-gray-50 rounded-lg p-3 mb-3">
                  <p className="text-sm text-gray-700">{service.notes}</p>
                </div>
              )}
              
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  View Report
                </Button>
                <Button variant="outline" size="sm">
                  Schedule Follow-up
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'workorders' && (
        <div className="space-y-3">
          {pendingWorkOrders.map((w: any) => (
            <div key={w.id} className="bg-white rounded-lg p-4 border border-gray-200/50">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
                    <AlertCircle className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{w.service_type || 'Work Order'}</h4>
                    <p className="text-sm text-gray-600">
                      {w.scheduled_date ? new Date(w.scheduled_date).toLocaleString() : 'Not Scheduled'}
                    </p>
                  </div>
                </div>
                <Badge className={'bg-yellow-100 text-yellow-800'}>
                  <div className="flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    Pending
                  </div>
                </Badge>
              </div>
              {w.description && (
                <div className="bg-gray-50 rounded-lg p-3 mb-3">
                  <p className="text-sm text-gray-700">{w.description}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomerServices;
