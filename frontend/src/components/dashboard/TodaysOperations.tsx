import React from 'react';
import { Job } from '@/types';
import Card from '@/components/ui/Card';
import {
  Badge,
  Text,
} from '@/components/ui';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Calendar, Clock, MapPin, User, CheckCircle, AlertTriangle, Play, Pause } from 'lucide-react';

interface TodaysOperationsProps {
  jobs: Job[];
  isLoading: boolean;
}

const TodaysOperations: React.FC<TodaysOperationsProps> = ({ jobs, isLoading }) => {
  if (isLoading) {
    return (
      <Card title="Today's Operations">
        <div className="flex justify-center items-center py-8">
          <LoadingSpinner size="lg" />
        </div>
      </Card>
    );
  }

  if (!jobs || jobs.length === 0) {
    return (
      <Card title="Today's Operations">
        <div className="text-center py-8">
          <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <Text variant="body" className="text-gray-500 mb-2">
            No operations scheduled for today
          </Text>
          <Text variant="small" className="text-gray-400">
            All caught up! Check back later for new assignments.
          </Text>
        </div>
      </Card>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'in-progress':
        return <Play className="h-4 w-4 text-blue-500" />;
      case 'urgent':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return <Pause className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'urgent':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getProgressValue = (status: string) => {
    switch (status) {
      case 'completed':
        return 100;
      case 'in-progress':
        return 65;
      case 'urgent':
        return 25;
      default:
        return 0;
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Card title="Today's Operations">
      <div className="space-y-4">
        {jobs.map((job) => (
          <div key={job.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                {getStatusIcon(job.status)}
                <div>
                  <Text variant="body" className="font-medium">
                    {job.title}
                  </Text>
                  {job.description && (
                    <Text variant="small" className="text-gray-600 mt-1">
                      {job.description}
                    </Text>
                  )}
                </div>
              </div>
              <Badge variant="default" className={getStatusColor(job.status)}>
                {job.status.replace('-', ' ')}
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-gray-400" />
                <Text variant="small" className="text-gray-600">
                  {formatTime(job.start)}
                  {job.end && ` - ${formatTime(job.end)}`}
                </Text>
              </div>

              {job.technician && (
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-gray-400" />
                  <Text variant="small" className="text-gray-600">
                    {job.technician}
                  </Text>
                </div>
              )}

              {job.location && (
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <Text variant="small" className="text-gray-600">
                    {job.location}
                  </Text>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-3">
              <div className="flex-1">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      job.status === 'completed' ? 'bg-green-500' :
                      job.status === 'in-progress' ? 'bg-blue-500' :
                      job.status === 'urgent' ? 'bg-red-500' : 'bg-gray-500'
                    }`}
                    style={{ width: `${getProgressValue(job.status)}%` }}
                  />
                </div>
                <div className="text-sm text-gray-600 text-center mt-1">
                  {getProgressValue(job.status)}%
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t">
        <div className="flex justify-between items-center">
          <Text variant="small" className="text-gray-600">
            Total Operations: {jobs.length}
          </Text>
          <div className="flex space-x-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <Text variant="small" className="text-gray-600">
                {jobs.filter(job => job.status === 'completed').length} Completed
              </Text>
            </div>
            <div className="flex items-center space-x-2">
              <Play className="h-4 w-4 text-blue-500" />
              <Text variant="small" className="text-gray-600">
                {jobs.filter(job => job.status === 'in-progress').length} In Progress
              </Text>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default TodaysOperations;
