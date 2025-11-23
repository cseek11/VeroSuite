import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Heading, Text } from '@/components/ui';
import {
  Calendar,
  Clock,
  Users,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  AlertCircle,
  Loader2,
  Download,
  Filter
} from 'lucide-react';
import { enhancedApi } from '@/lib/enhanced-api';

interface SchedulingMetrics {
  utilizationRate: number;
  onTimeCompletionRate: number;
  averageJobDuration: number;
  totalJobs: number;
  completedJobs: number;
  scheduledJobs: number;
  technicianCount: number;
  averageJobsPerTechnician: number;
}

interface UtilizationData {
  technicianId: string;
  technicianName: string;
  utilizationRate: number;
  scheduledHours: number;
  availableHours: number;
  jobsCompleted: number;
}

interface SchedulingAnalyticsProps {
  startDate?: Date;
  endDate?: Date;
  onDateRangeChange?: (startDate: Date, endDate: Date) => void;
}

export default function SchedulingAnalytics({
  startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
  endDate = new Date(),
  onDateRangeChange
}: SchedulingAnalyticsProps) {
  const [dateRangeStart, setDateRangeStart] = useState(
    startDate.toISOString().split('T')[0]
  );
  const [dateRangeEnd, setDateRangeEnd] = useState(
    endDate.toISOString().split('T')[0]
  );

  // Fetch scheduling analytics
  const { data: analyticsData, isLoading } = useQuery({
    queryKey: ['scheduling-analytics', dateRangeStart, dateRangeEnd],
    queryFn: async () => {
      // TODO: Replace with actual API endpoint when available
      // For now, calculate from jobs data
      const jobs = await enhancedApi.jobs.getByDateRange(dateRangeStart, dateRangeEnd);
      const technicians = await enhancedApi.technicians.list();

      // Calculate metrics
      const totalJobs = jobs.length;
      const completedJobs = jobs.filter((j: any) => j.status === 'completed').length;
      const scheduledJobs = jobs.filter((j: any) => j.status === 'scheduled' || j.status === 'in_progress').length;
      
      // Calculate on-time completion rate
      const onTimeJobs = jobs.filter((j: any) => {
        if (j.status !== 'completed' || !j.actual_end_time || !j.scheduled_end_time) return false;
        const actualEnd = new Date(j.actual_end_time);
        const scheduledEnd = new Date(`${j.scheduled_date}T${j.scheduled_end_time}`);
        return actualEnd <= scheduledEnd;
      }).length;
      const onTimeCompletionRate = completedJobs > 0 ? (onTimeJobs / completedJobs) * 100 : 0;

      // Calculate average job duration
      const jobsWithDuration = jobs.filter((j: any) => 
        j.actual_start_time && j.actual_end_time
      );
      const totalDuration = jobsWithDuration.reduce((sum: number, j: any) => {
        const start = new Date(j.actual_start_time);
        const end = new Date(j.actual_end_time);
        return sum + (end.getTime() - start.getTime());
      }, 0);
      const averageJobDuration = jobsWithDuration.length > 0 
        ? totalDuration / jobsWithDuration.length / (1000 * 60) // Convert to minutes
        : 0;

      // Calculate utilization rates per technician
      const utilizationData: UtilizationData[] = technicians.map((tech: any) => {
        const techJobs = jobs.filter((j: any) => j.technician_id === (tech.id || tech.user_id));
        const techCompletedJobs = techJobs.filter((j: any) => j.status === 'completed');
        
        // Calculate scheduled hours
        const scheduledHours = techJobs.reduce((sum: number, j: any) => {
          if (!j.scheduled_start_time || !j.scheduled_end_time) return sum;
          const start = new Date(`${j.scheduled_date}T${j.scheduled_start_time}`);
          const end = new Date(`${j.scheduled_date}T${j.scheduled_end_time}`);
          return sum + (end.getTime() - start.getTime()) / (1000 * 60 * 60); // Convert to hours
        }, 0);

        // Assume 8 hours per day available (can be enhanced with availability data)
        const daysInRange = Math.ceil((new Date(dateRangeEnd).getTime() - new Date(dateRangeStart).getTime()) / (1000 * 60 * 60 * 24));
        const availableHours = daysInRange * 8;
        const utilizationRate = availableHours > 0 ? (scheduledHours / availableHours) * 100 : 0;

        return {
          technicianId: tech.id || tech.user_id,
          technicianName: `${tech.first_name} ${tech.last_name}`,
          utilizationRate: Math.min(100, utilizationRate),
          scheduledHours: Math.round(scheduledHours * 10) / 10,
          availableHours: Math.round(availableHours * 10) / 10,
          jobsCompleted: techCompletedJobs.length
        };
      });

      // Calculate overall utilization
      const totalScheduledHours = utilizationData.reduce((sum, u) => sum + u.scheduledHours, 0);
      const totalAvailableHours = utilizationData.reduce((sum, u) => sum + u.availableHours, 0);
      const overallUtilizationRate = totalAvailableHours > 0 
        ? (totalScheduledHours / totalAvailableHours) * 100 
        : 0;

      return {
        metrics: {
          utilizationRate: Math.min(100, overallUtilizationRate),
          onTimeCompletionRate,
          averageJobDuration: Math.round(averageJobDuration),
          totalJobs,
          completedJobs,
          scheduledJobs,
          technicianCount: technicians.length,
          averageJobsPerTechnician: technicians.length > 0 ? totalJobs / technicians.length : 0
        },
        utilizationData: utilizationData.sort((a, b) => b.utilizationRate - a.utilizationRate)
      };
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const metrics = analyticsData?.metrics || {
    utilizationRate: 0,
    onTimeCompletionRate: 0,
    averageJobDuration: 0,
    totalJobs: 0,
    completedJobs: 0,
    scheduledJobs: 0,
    technicianCount: 0,
    averageJobsPerTechnician: 0
  };

  const utilizationData = analyticsData?.utilizationData || [];

  const handleDateRangeChange = () => {
    const start = new Date(dateRangeStart);
    const end = new Date(dateRangeEnd);
    onDateRangeChange?.(start, end);
  };

  const getMetricColor = (value: number, threshold: number = 70) => {
    return value >= threshold ? 'text-green-600' : value >= threshold * 0.7 ? 'text-yellow-600' : 'text-red-600';
  };

  const getMetricIcon = (value: number, threshold: number = 70) => {
    return value >= threshold ? TrendingUp : TrendingDown;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
        <span className="ml-3 text-gray-600">Loading analytics...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Heading level={1} className="font-bold text-gray-900">
            Scheduling Analytics
          </Heading>
          <Text className="text-gray-600 mt-1">
            Performance metrics and utilization insights
          </Text>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" icon={Download}>
            Export Report
          </Button>
        </div>
      </div>

      {/* Date Range Filter */}
      <Card>
        <div className="p-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <Text className="text-sm font-medium">Date Range:</Text>
            </div>
            <Input
              type="date"
              value={dateRangeStart}
              onChange={(e) => setDateRangeStart(e.target.value)}
              className="w-40"
            />
            <Text className="text-gray-500">to</Text>
            <Input
              type="date"
              value={dateRangeEnd}
              onChange={(e) => setDateRangeEnd(e.target.value)}
              className="w-40"
            />
            <Button variant="primary" size="sm" onClick={handleDateRangeChange}>
              Apply
            </Button>
          </div>
        </div>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <div className="p-6">
            <div className="flex items-center justify-between mb-2">
              <Text className="text-sm text-gray-600">Utilization Rate</Text>
              {React.createElement(getMetricIcon(metrics.utilizationRate), {
                className: `w-5 h-5 ${getMetricColor(metrics.utilizationRate)}`
              })}
            </div>
            <Text className={`text-3xl font-bold ${getMetricColor(metrics.utilizationRate)}`}>
              {metrics.utilizationRate.toFixed(1)}%
            </Text>
            <Text className="text-xs text-gray-500 mt-1">
              {utilizationData.length} technicians
            </Text>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <div className="flex items-center justify-between mb-2">
              <Text className="text-sm text-gray-600">On-Time Completion</Text>
              {React.createElement(getMetricIcon(metrics.onTimeCompletionRate), {
                className: `w-5 h-5 ${getMetricColor(metrics.onTimeCompletionRate)}`
              })}
            </div>
            <Text className={`text-3xl font-bold ${getMetricColor(metrics.onTimeCompletionRate)}`}>
              {metrics.onTimeCompletionRate.toFixed(1)}%
            </Text>
            <Text className="text-xs text-gray-500 mt-1">
              {metrics.completedJobs} of {metrics.totalJobs} jobs
            </Text>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <div className="flex items-center justify-between mb-2">
              <Text className="text-sm text-gray-600">Avg Job Duration</Text>
              <Clock className="w-5 h-5 text-gray-400" />
            </div>
            <Text className="text-3xl font-bold text-gray-900">
              {Math.round(metrics.averageJobDuration)} min
            </Text>
            <Text className="text-xs text-gray-500 mt-1">
              Average across all jobs
            </Text>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <div className="flex items-center justify-between mb-2">
              <Text className="text-sm text-gray-600">Total Jobs</Text>
              <Calendar className="w-5 h-5 text-gray-400" />
            </div>
            <Text className="text-3xl font-bold text-gray-900">
              {metrics.totalJobs}
            </Text>
            <Text className="text-xs text-gray-500 mt-1">
              {metrics.scheduledJobs} scheduled, {metrics.completedJobs} completed
            </Text>
          </div>
        </Card>
      </div>

      {/* Utilization Breakdown */}
      <Card>
        <div className="p-6">
          <Heading level={3} className="font-semibold mb-4">
            Technician Utilization
          </Heading>
          {utilizationData.length === 0 ? (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <Text className="text-gray-500">No utilization data available</Text>
            </div>
          ) : (
            <div className="space-y-4">
              {utilizationData.map((tech) => (
                <div key={tech.technicianId} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <Text className="font-medium">{tech.technicianName}</Text>
                      <Text className="text-sm text-gray-600">
                        {tech.scheduledHours.toFixed(1)}h scheduled / {tech.availableHours.toFixed(1)}h available
                        {' • '}
                        {tech.jobsCompleted} jobs completed
                      </Text>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Text className={`font-semibold ${getMetricColor(tech.utilizationRate)}`}>
                        {tech.utilizationRate.toFixed(1)}%
                      </Text>
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            tech.utilizationRate >= 70 ? 'bg-green-500' :
                            tech.utilizationRate >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${Math.min(100, tech.utilizationRate)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>

      {/* Performance Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <div className="p-6">
            <Heading level={4} className="font-semibold mb-4">
              Job Status Breakdown
            </Heading>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <Text className="text-sm">Completed</Text>
                </div>
                <Text className="font-semibold">{metrics.completedJobs}</Text>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  <Text className="text-sm">Scheduled</Text>
                </div>
                <Text className="font-semibold">{metrics.scheduledJobs}</Text>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 text-gray-600" />
                  <Text className="text-sm">Other</Text>
                </div>
                <Text className="font-semibold">
                  {metrics.totalJobs - metrics.completedJobs - metrics.scheduledJobs}
                </Text>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <Heading level={4} className="font-semibold mb-4">
              Workload Distribution
            </Heading>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Text className="text-sm">Total Technicians</Text>
                <Text className="font-semibold">{metrics.technicianCount}</Text>
              </div>
              <div className="flex items-center justify-between">
                <Text className="text-sm">Average Jobs per Technician</Text>
                <Text className="font-semibold">
                  {metrics.averageJobsPerTechnician.toFixed(1)}
                </Text>
              </div>
              <div className="flex items-center justify-between">
                <Text className="text-sm">Total Scheduled Hours</Text>
                <Text className="font-semibold">
                  {utilizationData.reduce((sum, u) => sum + u.scheduledHours, 0).toFixed(1)}h
                </Text>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}





