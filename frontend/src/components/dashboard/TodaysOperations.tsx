import React from 'react';
import { Job } from '@/types';
import { Card, Typography, Chip, ProgressBar } from '@/components/ui/EnhancedUI';
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
          <Typography variant="body1" className="text-gray-500 mb-2">
            No operations scheduled for today
          </Typography>
          <Typography variant="body2" className="text-gray-400">
            All caught up! Check back later for new assignments.
          </Typography>
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
        return 'success';
      case 'in-progress':
        return 'primary';
      case 'urgent':
        return 'destructive';
      default:
        return 'default';
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
                  <Typography variant="body1" className="font-medium">
                    {job.title}
                  </Typography>
                  {job.description && (
                    <Typography variant="body2" className="text-gray-600 mt-1">
                      {job.description}
                    </Typography>
                  )}
                </div>
              </div>
              <Chip variant={getStatusColor(job.status) as any}>
                {job.status.replace('-', ' ')}
              </Chip>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-gray-400" />
                <Typography variant="body2" className="text-gray-600">
                  {formatTime(job.start)}
                  {job.end && ` - ${formatTime(job.end)}`}
                </Typography>
              </div>

              {job.technician && (
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-gray-400" />
                  <Typography variant="body2" className="text-gray-600">
                    {job.technician}
                  </Typography>
                </div>
              )}

              {job.location && (
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <Typography variant="body2" className="text-gray-600">
                    {job.location}
                  </Typography>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-3">
              <div className="flex-1">
                <ProgressBar
                  value={getProgressValue(job.status)}
                  color={getStatusColor(job.status) as any}
                  showLabel
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t">
        <div className="flex justify-between items-center">
          <Typography variant="body2" className="text-gray-600">
            Total Operations: {jobs.length}
          </Typography>
          <div className="flex space-x-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <Typography variant="body2" className="text-gray-600">
                {jobs.filter(job => job.status === 'completed').length} Completed
              </Typography>
            </div>
            <div className="flex items-center space-x-2">
              <Play className="h-4 w-4 text-blue-500" />
              <Typography variant="body2" className="text-gray-600">
                {jobs.filter(job => job.status === 'in-progress').length} In Progress
              </Typography>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default TodaysOperations;
