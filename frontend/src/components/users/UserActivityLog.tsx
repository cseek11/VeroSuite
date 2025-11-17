import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Activity, FileText, Settings, Shield } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

interface UserActivityLogProps {
  userId: string;
  limit?: number;
}

interface ActivityLog {
  id: string;
  action: string;
  resource_type: string;
  resource_id?: string;
  timestamp: string;
  ip_address?: string;
  user_agent?: string;
}

async function fetchUserActivity(userId: string, limit: number = 50): Promise<ActivityLog[]> {
  const token = localStorage.getItem('verofield_auth')
    ? JSON.parse(localStorage.getItem('verofield_auth')!).token
    : localStorage.getItem('jwt');
  const tenantId = localStorage.getItem('tenantId') || '7193113e-ece2-4f7b-ae8c-176df4367e28';

  const response = await fetch(`${API_BASE_URL}/v1/users/${userId}/activity?limit=${limit}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      'x-tenant-id': tenantId,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch user activity: ${response.statusText}`);
  }

  return response.json();
}

const getActionIcon = (action: string) => {
  const actionLower = action.toLowerCase();
  if (actionLower.includes('create') || actionLower.includes('add')) {
    return <FileText className="h-4 w-4 text-green-600" />;
  }
  if (actionLower.includes('update') || actionLower.includes('edit')) {
    return <Settings className="h-4 w-4 text-blue-600" />;
  }
  if (actionLower.includes('delete') || actionLower.includes('remove')) {
    return <FileText className="h-4 w-4 text-red-600" />;
  }
  if (actionLower.includes('login') || actionLower.includes('auth')) {
    return <Shield className="h-4 w-4 text-purple-600" />;
  }
  return <Activity className="h-4 w-4 text-gray-600" />;
};

const getActionColor = (action: string) => {
  const actionLower = action.toLowerCase();
  if (actionLower.includes('create') || actionLower.includes('add')) {
    return 'bg-green-50 text-green-800 border-green-200';
  }
  if (actionLower.includes('update') || actionLower.includes('edit')) {
    return 'bg-blue-50 text-blue-800 border-blue-200';
  }
  if (actionLower.includes('delete') || actionLower.includes('remove')) {
    return 'bg-red-50 text-red-800 border-red-200';
  }
  if (actionLower.includes('login') || actionLower.includes('auth')) {
    return 'bg-purple-50 text-purple-800 border-purple-200';
  }
  return 'bg-gray-50 text-gray-800 border-gray-200';
};

export default function UserActivityLog({ userId, limit = 50 }: UserActivityLogProps) {
  const { data: activities = [], isLoading, error } = useQuery({
    queryKey: ['user-activity', userId, limit],
    queryFn: () => fetchUserActivity(userId, limit),
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
          Error loading activity logs: {error instanceof Error ? error.message : 'Unknown error'}
        </div>
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <Activity className="h-12 w-12 mx-auto mb-4 text-gray-400" />
        <p>No activity logs found</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
        <span className="text-sm text-gray-500">{activities.length} activities</span>
      </div>
      <div className="space-y-2">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className={`flex items-start space-x-3 p-3 rounded-lg border ${getActionColor(activity.action)}`}
          >
            <div className="flex-shrink-0 mt-0.5">
              {getActionIcon(activity.action)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">
                  {activity.action}
                </p>
                <time className="text-xs text-gray-500 ml-2">
                  {new Date(activity.timestamp).toLocaleString()}
                </time>
              </div>
              <p className="text-xs text-gray-600 mt-1">
                {activity.resource_type}
                {activity.resource_id && (
                  <span className="ml-1 font-mono text-xs">#{activity.resource_id.slice(0, 8)}</span>
                )}
              </p>
              {activity.ip_address && (
                <p className="text-xs text-gray-500 mt-1">
                  IP: {activity.ip_address}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}





