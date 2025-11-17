import React from 'react';
import Card from '@/components/ui/Card';
import {
  Badge,
  Avatar,
  Heading,
  Text,
} from '@/components/ui';
import { Users, MapPin, Clock, Phone, Mail, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { enhancedApi } from '@/lib/enhanced-api';

const TechnicianDispatchPanel: React.FC = () => {
  // Fetch technicians data from API
  const { data: technicians = [], isLoading } = useQuery({
    queryKey: ['technicians', 'dispatch'],
    queryFn: () => enhancedApi.users.list({ roles: ['technician'] }),
  });

  const dispatchStats = {
    totalTechnicians: technicians.length,
    available: technicians.filter(t => t.status === 'available').length,
    busy: technicians.filter(t => t.status === 'busy').length,
    offline: technicians.filter(t => t.status === 'offline').length,
    averageResponseTime: '18 min',
    jobsInQueue: 7
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'busy':
        return 'bg-yellow-100 text-yellow-800';
      case 'offline':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'busy':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'offline':
        return <XCircle className="h-4 w-4 text-gray-500" />;
      default:
        return <XCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Dispatch Overview */}
      <Card title="Technician Dispatch Overview">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <Users className="mx-auto h-8 w-8 text-blue-500 mb-2" />
            <Heading level={3} className="font-bold text-blue-600">
              {dispatchStats.totalTechnicians}
            </Heading>
            <Text variant="small" className="text-gray-600">
              Total Technicians
            </Text>
          </div>

          <div className="text-center">
            <CheckCircle className="mx-auto h-8 w-8 text-green-500 mb-2" />
            <Heading level={3} className="font-bold text-green-600">
              {dispatchStats.available}
            </Heading>
            <Text variant="small" className="text-gray-600">
              Available
            </Text>
          </div>

          <div className="text-center">
            <AlertTriangle className="mx-auto h-8 w-8 text-yellow-500 mb-2" />
            <Heading level={3} className="font-bold text-yellow-600">
              {dispatchStats.busy}
            </Heading>
            <Text variant="small" className="text-gray-600">
              On Job
            </Text>
          </div>

          <div className="text-center">
            <Clock className="mx-auto h-8 w-8 text-gray-500 mb-2" />
            <Heading level={3} className="font-bold text-gray-600">
              {dispatchStats.jobsInQueue}
            </Heading>
            <Text variant="small" className="text-gray-600">
              In Queue
            </Text>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t">
          <div className="flex justify-between items-center">
            <Text variant="body" className="font-medium">
              Average Response Time
            </Text>
            <Text variant="body" className="font-bold text-blue-600">
              {dispatchStats.averageResponseTime}
            </Text>
          </div>
        </div>
      </Card>

      {/* Technician List */}
      <Card title="Technician Status">
        <div className="space-y-4">
          {technicians.map((technician) => (
            <div key={technician.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <Avatar
                    src={technician.avatar}
                    alt={technician.name}
                    size="md"
                    fallback={technician.name.split(' ').map(n => n[0]).join('')}
                  />
                  <div>
                    <Text variant="body" className="font-medium">
                      {technician.name}
                    </Text>
                    <div className="flex items-center space-x-2 mt-1">
                      {getStatusIcon(technician.status)}
                      <Badge variant="default" className={getStatusColor(technician.status)}>
                        {technician.status.charAt(0).toUpperCase() + technician.status.slice(1)}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <Text variant="small" className="font-medium">
                    ⭐ {technician.rating}
                  </Text>
                  <Text variant="small" className="text-gray-500">
                    {technician.jobsCompleted} jobs
                  </Text>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <Text variant="small" className="text-gray-600">
                    {technician.location}
                  </Text>
                </div>

                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <Text variant="small" className="text-gray-600">
                    Response: {technician.responseTime}
                  </Text>
                </div>
              </div>

              {technician.currentJob && (
                <div className="mb-3 p-3 bg-blue-50 rounded-lg">
                  <Text variant="small" className="font-medium text-blue-800">
                    Current Job:
                  </Text>
                  <Text variant="small" className="text-blue-700">
                    {technician.currentJob}
                  </Text>
                </div>
              )}

              <div className="flex flex-wrap gap-2 mb-3">
                {technician.specialties.map((specialty, index) => (
                  <Badge key={index} variant="default" className="text-xs">
                    {specialty}
                  </Badge>
                ))}
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <Text variant="small" className="text-gray-600">
                    {technician.phone}
                  </Text>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <Text variant="small" className="text-gray-600">
                    {technician.email}
                  </Text>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default TechnicianDispatchPanel;
