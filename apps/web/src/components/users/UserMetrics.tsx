import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { TrendingUp, DollarSign, Clock, CheckCircle, Calendar, BarChart3 } from 'lucide-react';
import { logger } from '@/utils/logger';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

interface UserMetricsProps {
  userId: string;
  defaultPeriod?: 'week' | 'month' | 'quarter' | 'year';
}

interface UserMetricsData {
  userId: string;
  period: {
    start: string;
    end: string;
  };
  jobs: {
    total: number;
    completed: number;
    in_progress: number;
    scheduled: number;
    cancelled: number;
  };
  revenue: {
    total: number;
    average_per_job: number;
  };
  efficiency: {
    average_completion_time_hours: number;
    on_time_completion_rate: number;
    jobs_per_day: number;
  };
  performance: {
    customer_rating?: number;
    upsell_rate?: number;
  };
}

async function fetchUserMetrics(
  userId: string,
  startDate: Date,
  endDate: Date
): Promise<UserMetricsData> {
  const token = localStorage.getItem('verofield_auth')
    ? JSON.parse(localStorage.getItem('verofield_auth')!).token
    : localStorage.getItem('jwt');
  const tenantId = localStorage.getItem('tenantId') || '7193113e-ece2-4f7b-ae8c-176df4367e28';

  let response;
  try {
    response = await fetch(
      `${API_BASE_URL}/v1/users/${userId}/metrics?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'x-tenant-id': tenantId,
        },
      }
    );
  } catch (error) {
    logger.error('Failed to fetch user metrics', {
      error: error instanceof Error ? error.message : String(error),
      userId,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString()
    });
    throw error;
  }

  if (!response.ok) {
    throw new Error(`Failed to fetch metrics: ${response.statusText}`);
  }

  return response.json();
}

export default function UserMetrics({ userId, defaultPeriod = 'month' }: UserMetricsProps) {
  const [period, setPeriod] = useState<UserMetricsProps['defaultPeriod']>(defaultPeriod);

  const getDateRange = (periodType: UserMetricsProps['defaultPeriod']) => {
    const end = new Date();
    const start = new Date();

    switch (periodType) {
      case 'week':
        start.setDate(start.getDate() - 7);
        break;
      case 'month':
        start.setMonth(start.getMonth() - 1);
        break;
      case 'quarter':
        start.setMonth(start.getMonth() - 3);
        break;
      case 'year':
        start.setFullYear(start.getFullYear() - 1);
        break;
      default:
        start.setMonth(start.getMonth() - 1);
    }

    return { start, end };
  };

  const { start, end } = getDateRange(period);

  const { data: metrics, isLoading, error } = useQuery<UserMetricsData>({
    queryKey: ['user-metrics', userId, period],
    queryFn: () => fetchUserMetrics(userId, start, end),
    enabled: !!userId,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <div className="text-red-800 text-sm">
          Error loading metrics: {error instanceof Error ? error.message : 'Unknown error'}
        </div>
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="text-center py-8 text-gray-500">
        <BarChart3 className="h-12 w-12 mx-auto mb-4 text-gray-400" />
        <p>No metrics available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Period Selector */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">Performance Metrics</h3>
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value as 'week' | 'month' | 'quarter' | 'year')}
          className="text-sm border border-gray-300 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="week">Last 7 Days</option>
          <option value="month">Last 30 Days</option>
          <option value="quarter">Last 3 Months</option>
          <option value="year">Last Year</option>
        </select>
      </div>

      {/* Job Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Jobs</p>
              <p className="text-2xl font-bold text-gray-900">{metrics.jobs.total}</p>
            </div>
            <BarChart3 className="h-8 w-8 text-purple-500" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Completed</p>
              <p className="text-2xl font-bold text-green-600">{metrics.jobs.completed}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">In Progress</p>
              <p className="text-2xl font-bold text-blue-600">{metrics.jobs.in_progress}</p>
            </div>
            <Clock className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Scheduled</p>
              <p className="text-2xl font-bold text-yellow-600">{metrics.jobs.scheduled}</p>
            </div>
            <Calendar className="h-8 w-8 text-yellow-500" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Cancelled</p>
              <p className="text-2xl font-bold text-red-600">{metrics.jobs.cancelled}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-red-500" />
          </div>
        </div>
      </div>

      {/* Revenue & Efficiency */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h4 className="text-sm font-medium text-gray-700 mb-4 flex items-center">
            <DollarSign className="h-5 w-5 mr-2 text-green-500" />
            Revenue
          </h4>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-500">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">
                ${metrics.revenue.total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Average per Job</p>
              <p className="text-xl font-semibold text-gray-700">
                ${metrics.revenue.average_per_job.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h4 className="text-sm font-medium text-gray-700 mb-4 flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-blue-500" />
            Efficiency
          </h4>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-500">Avg Completion Time</p>
              <p className="text-2xl font-bold text-gray-900">
                {metrics.efficiency.average_completion_time_hours.toFixed(1)} hrs
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">On-Time Rate</p>
              <p className="text-xl font-semibold text-gray-700">
                {metrics.efficiency.on_time_completion_rate.toFixed(1)}%
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Jobs per Day</p>
              <p className="text-xl font-semibold text-gray-700">
                {metrics.efficiency.jobs_per_day.toFixed(1)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}





