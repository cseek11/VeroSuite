import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { User, Users, ArrowUp, ArrowDown } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

interface UserHierarchyProps {
  userId: string;
  onUserClick?: (userId: string) => void;
}

interface HierarchyUser {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  position?: string;
  department?: string;
  status?: string;
}

interface UserHierarchyData {
  user: HierarchyUser;
  manager: HierarchyUser | null;
  directReports: HierarchyUser[];
}

async function fetchUserHierarchy(userId: string): Promise<UserHierarchyData> {
  const token = localStorage.getItem('verofield_auth')
    ? JSON.parse(localStorage.getItem('verofield_auth')!).token
    : localStorage.getItem('jwt');
  const tenantId = localStorage.getItem('tenantId') || '7193113e-ece2-4f7b-ae8c-176df4367e28';

  const response = await fetch(`${API_BASE_URL}/v1/users/${userId}/hierarchy`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      'x-tenant-id': tenantId,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch user hierarchy: ${response.statusText}`);
  }

  return response.json();
}

export default function UserHierarchy({ userId, onUserClick }: UserHierarchyProps) {
  const { data: hierarchy, isLoading, error } = useQuery({
    queryKey: ['user-hierarchy', userId],
    queryFn: () => fetchUserHierarchy(userId),
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
          Error loading hierarchy: {error instanceof Error ? error.message : 'Unknown error'}
        </div>
      </div>
    );
  }

  if (!hierarchy) {
    return (
      <div className="text-center py-8 text-gray-500">
        <Users className="h-12 w-12 mx-auto mb-4 text-gray-400" />
        <p>No hierarchy information available</p>
      </div>
    );
  }

  const handleUserClick = (clickedUserId: string) => {
    if (onUserClick && clickedUserId !== userId) {
      onUserClick(clickedUserId);
    }
  };

  return (
    <div className="space-y-6">
      {/* Manager */}
      {hierarchy.manager && (
        <div>
          <div className="flex items-center space-x-2 mb-3">
            <ArrowUp className="h-4 w-4 text-gray-400" />
            <h4 className="text-sm font-medium text-gray-700">Manager</h4>
          </div>
          <div
            className={`p-3 rounded-lg border ${
              onUserClick
                ? 'cursor-pointer hover:bg-gray-50 border-gray-200'
                : 'border-gray-200 bg-gray-50'
            }`}
            onClick={() => handleUserClick(hierarchy.manager!.id)}
          >
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                <User className="h-5 w-5 text-purple-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">
                  {hierarchy.manager.first_name} {hierarchy.manager.last_name}
                </p>
                <p className="text-xs text-gray-500 truncate">{hierarchy.manager.email}</p>
                {hierarchy.manager.position && (
                  <p className="text-xs text-gray-600 mt-1">{hierarchy.manager.position}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Current User */}
      <div>
        <div className="flex items-center space-x-2 mb-3">
          <User className="h-4 w-4 text-purple-600" />
          <h4 className="text-sm font-medium text-gray-700">Current User</h4>
        </div>
        <div className="p-3 rounded-lg border-2 border-purple-200 bg-purple-50">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-purple-200 flex items-center justify-center">
              <User className="h-5 w-5 text-purple-700" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900">
                {hierarchy.user.first_name} {hierarchy.user.last_name}
              </p>
              <p className="text-xs text-gray-500 truncate">{hierarchy.user.email}</p>
              {hierarchy.user.position && (
                <p className="text-xs text-gray-600 mt-1">{hierarchy.user.position}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Direct Reports */}
      {hierarchy.directReports.length > 0 && (
        <div>
          <div className="flex items-center space-x-2 mb-3">
            <ArrowDown className="h-4 w-4 text-gray-400" />
            <h4 className="text-sm font-medium text-gray-700">
              Direct Reports ({hierarchy.directReports.length})
            </h4>
          </div>
          <div className="space-y-2">
            {hierarchy.directReports.map((report) => (
              <div
                key={report.id}
                className={`p-3 rounded-lg border ${
                  onUserClick
                    ? 'cursor-pointer hover:bg-gray-50 border-gray-200'
                    : 'border-gray-200 bg-gray-50'
                }`}
                onClick={() => handleUserClick(report.id)}
              >
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                    <User className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900">
                        {report.first_name} {report.last_name}
                      </p>
                      {report.status && (
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full ${
                            report.status === 'active'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {report.status}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 truncate">{report.email}</p>
                    {report.position && (
                      <p className="text-xs text-gray-600 mt-1">{report.position}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {!hierarchy.manager && hierarchy.directReports.length === 0 && (
        <div className="text-center py-4 text-gray-500 text-sm">
          No hierarchy relationships defined
        </div>
      )}
    </div>
  );
}





