import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { BarChart3, Users, CheckCircle } from 'lucide-react';
import { logger } from '@/utils/logger';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

interface UserAnalyticsProps {
  period?: 'week' | 'month' | 'quarter' | 'year';
}

interface AnalyticsData {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  usersByRole: Record<string, number>;
  usersByDepartment: Record<string, number>;
  recentActivity: {
    newUsers: number;
    deactivatedUsers: number;
  };
  metrics: {
    averageJobsPerUser: number;
    averageRevenuePerUser: number;
    topPerformers: Array<{
      userId: string;
      name: string;
      jobsCompleted: number;
      revenue: number;
    }>;
  };
}

async function fetchUserAnalytics(period: 'week' | 'month' | 'quarter' | 'year' = 'month'): Promise<AnalyticsData> {
  const token = localStorage.getItem('verofield_auth')
    ? JSON.parse(localStorage.getItem('verofield_auth')!).token
    : localStorage.getItem('jwt');
  const tenantId = localStorage.getItem('tenantId') || '7193113e-ece2-4f7b-ae8c-176df4367e28';

  // For now, we'll calculate from the users list
  // In production, this would be a dedicated analytics endpoint
  let response;
  try {
    response = await fetch(`${API_BASE_URL}/v1/users?period=${period}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'x-tenant-id': tenantId,
      },
    });
  } catch (error) {
    logger.error('Failed to fetch user analytics data', {
      error: error instanceof Error ? error.message : String(error),
      period
    });
    throw error;
  }

  if (!response.ok) {
    throw new Error(`Failed to fetch analytics: ${response.statusText}`);
  }

  const data = await response.json();
  const users = data.users || [];

  // Calculate analytics
  const totalUsers = users.length;
  const activeUsers = users.filter((u: any) => u.status === 'active').length;
  const inactiveUsers = totalUsers - activeUsers;

  // Group by role
  const usersByRole: Record<string, number> = {};
  users.forEach((user: any) => {
    user.roles?.forEach((role: string) => {
      usersByRole[role] = (usersByRole[role] || 0) + 1;
    });
  });

  // Group by department
  const usersByDepartment: Record<string, number> = {};
  users.forEach((user: any) => {
    if (user.department) {
      usersByDepartment[user.department] = (usersByDepartment[user.department] || 0) + 1;
    }
  });

  return {
    totalUsers,
    activeUsers,
    inactiveUsers,
    usersByRole,
    usersByDepartment,
    recentActivity: {
      newUsers: 0, // TODO: Calculate from created_at
      deactivatedUsers: 0, // TODO: Calculate from status changes
    },
    metrics: {
      averageJobsPerUser: 0, // TODO: Calculate from jobs
      averageRevenuePerUser: 0, // TODO: Calculate from revenue
      topPerformers: [], // TODO: Calculate from metrics
    },
  };
}

export default function UserAnalytics({ period = 'month' }: UserAnalyticsProps) {
  const [selectedPeriod, setSelectedPeriod] = useState(period);

  const { data: analytics, isLoading, error } = useQuery<AnalyticsData>({
    queryKey: ['user-analytics', selectedPeriod],
    queryFn: () => fetchUserAnalytics(selectedPeriod),
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
          Error loading analytics: {error instanceof Error ? error.message : 'Unknown error'}
        </div>
      </div>
    );
  }

  if (!analytics) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">User Analytics</h3>
        <select
          value={selectedPeriod}
          onChange={(e) => setSelectedPeriod(e.target.value as 'week' | 'month' | 'quarter' | 'year')}
          className="text-sm border border-gray-300 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="week">Last 7 Days</option>
          <option value="month">Last 30 Days</option>
          <option value="quarter">Last 3 Months</option>
          <option value="year">Last Year</option>
        </select>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.totalUsers}</p>
            </div>
            <Users className="h-8 w-8 text-purple-500" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Active Users</p>
              <p className="text-2xl font-bold text-green-600">{analytics.activeUsers}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Inactive Users</p>
              <p className="text-2xl font-bold text-gray-600">{analytics.inactiveUsers}</p>
            </div>
            <Users className="h-8 w-8 text-gray-500" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Departments</p>
              <p className="text-2xl font-bold text-gray-900">
                {Object.keys(analytics.usersByDepartment).length}
              </p>
            </div>
            <BarChart3 className="h-8 w-8 text-blue-500" />
          </div>
        </div>
      </div>

      {/* Users by Role */}
      <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-6">
        <h4 className="text-sm font-medium text-gray-900 mb-4">Users by Role</h4>
        <div className="space-y-3">
          {Object.entries(analytics.usersByRole).map(([role, count]) => (
            <div key={role} className="flex items-center justify-between">
              <span className="text-sm text-gray-700 capitalize">{role}</span>
              <div className="flex items-center space-x-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-purple-600 h-2 rounded-full"
                    style={{ width: `${(count / analytics.totalUsers) * 100}%` }}
                  />
                </div>
                <span className="text-sm font-medium text-gray-900 w-8 text-right">{count}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Users by Department */}
      {Object.keys(analytics.usersByDepartment).length > 0 && (
        <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-6">
          <h4 className="text-sm font-medium text-gray-900 mb-4">Users by Department</h4>
          <div className="space-y-3">
            {Object.entries(analytics.usersByDepartment).map(([department, count]) => (
              <div key={department} className="flex items-center justify-between">
                <span className="text-sm text-gray-700">{department}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${(count / analytics.totalUsers) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-900 w-8 text-right">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

