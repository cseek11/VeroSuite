import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Shield, Search, CheckCircle, XCircle } from 'lucide-react';
import { userApi } from '@/lib/user-api';
import { PREDEFINED_ROLES } from '@/types/role-actions';

interface PermissionsAuditProps {
  userId?: string;
}

interface UserPermissions {
  userId: string;
  userName: string;
  email: string;
  roles: string[];
  permissions: Array<{ resource: string; action: string }>;
  lastPermissionChange?: string;
}

export default function PermissionsAudit({ userId }: PermissionsAuditProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedResource, setSelectedResource] = useState<string>('all');
  const [selectedAction, setSelectedAction] = useState<string>('all');

  const { data: usersResponse, isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      return await userApi.getUsers();
    },
  });

  const users = usersResponse?.users || [];

  // Build permissions map
  const userPermissions: UserPermissions[] = users.map((user: any) => {
    const permissions: Array<{ resource: string; action: string }> = [];
    
    user.roles?.forEach((roleId: string) => {
      const role = PREDEFINED_ROLES.find(r => r.id === roleId);
      if (role) {
        role.permissions.forEach(perm => {
          if (perm.resource === '*' && perm.action === '*') {
            // Admin has all permissions
            permissions.push({ resource: '*', action: '*' });
          } else if (!permissions.find(p => p.resource === perm.resource && p.action === perm.action)) {
            permissions.push({ resource: perm.resource, action: perm.action });
          }
        });
      }
    });

    return {
      userId: user.id,
      userName: `${user.first_name} ${user.last_name}`,
      email: user.email,
      roles: user.roles || [],
      permissions,
    };
  });

  // Get unique resources and actions
  const allResources = new Set<string>();
  const allActions = new Set<string>();
  userPermissions.forEach(up => {
    up.permissions.forEach(p => {
      if (p.resource !== '*') allResources.add(p.resource);
      if (p.action !== '*') allActions.add(p.action);
    });
  });

  // Filter users
  const filteredUsers = userPermissions.filter(up => {
    if (userId && up.userId !== userId) return false;
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      if (!up.userName.toLowerCase().includes(searchLower) &&
          !up.email.toLowerCase().includes(searchLower)) {
        return false;
      }
    }
    if (selectedResource !== 'all') {
      const hasResource = up.permissions.some(p => 
        p.resource === '*' || p.resource === selectedResource
      );
      if (!hasResource) return false;
    }
    if (selectedAction !== 'all') {
      const hasAction = up.permissions.some(p => 
        p.action === '*' || p.action === selectedAction
      );
      if (!hasAction) return false;
    }
    return true;
  });

  const hasPermission = (userPerms: UserPermissions, resource: string, action: string) => {
    return userPerms.permissions.some(p => 
      (p.resource === '*' || p.resource === resource) &&
      (p.action === '*' || p.action === action)
    );
  };

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
          Error loading permissions: {error instanceof Error ? error.message : 'Unknown error'}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Permissions Audit</h3>
          <p className="text-sm text-gray-500 mt-1">
            Review who has access to what resources and actions
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name or email..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Resource</label>
            <select
              value={selectedResource}
              onChange={(e) => setSelectedResource(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="all">All Resources</option>
              {Array.from(allResources).sort().map(resource => (
                <option key={resource} value={resource}>{resource}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Action</label>
            <select
              value={selectedAction}
              onChange={(e) => setSelectedAction(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="all">All Actions</option>
              {Array.from(allActions).sort().map(action => (
                <option key={action} value={action}>{action}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Permissions Matrix */}
      <div className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h4 className="text-sm font-medium text-gray-900">
            Access Matrix ({filteredUsers.length} users)
          </h4>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky left-0 bg-gray-50 z-10">
                  User
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Roles
                </th>
                {Array.from(allResources).sort().map(resource => (
                  <th key={resource} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {resource}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((userPerm) => (
                <tr key={userPerm.userId} className="hover:bg-gray-50">
                  <td className="px-4 py-3 whitespace-nowrap sticky left-0 bg-white z-10">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{userPerm.userName}</div>
                      <div className="text-sm text-gray-500">{userPerm.email}</div>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex flex-wrap gap-1">
                      {userPerm.roles.map(role => (
                        <span
                          key={role}
                          className="inline-flex px-2 py-0.5 text-xs font-semibold rounded-full bg-purple-100 text-purple-800"
                        >
                          {role}
                        </span>
                      ))}
                    </div>
                  </td>
                  {Array.from(allResources).sort().map(resource => {
                    const canView = hasPermission(userPerm, resource, 'view');
                    const canEdit = hasPermission(userPerm, resource, 'update') || hasPermission(userPerm, resource, 'edit');
                    const canDelete = hasPermission(userPerm, resource, 'delete');
                    const hasAll = hasPermission(userPerm, '*', '*');
                    
                    return (
                      <td key={resource} className="px-4 py-3 whitespace-nowrap">
                        {hasAll ? (
                          <span className="text-xs text-green-600 font-medium">All</span>
                        ) : (
                          <div className="flex items-center space-x-2">
                            {canView && <CheckCircle className="h-4 w-4 text-blue-500" title="View" />}
                            {canEdit && <CheckCircle className="h-4 w-4 text-yellow-500" title="Edit" />}
                            {canDelete && <CheckCircle className="h-4 w-4 text-red-500" title="Delete" />}
                            {!canView && !canEdit && !canDelete && (
                              <XCircle className="h-4 w-4 text-gray-300" />
                            )}
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredUsers.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <Shield className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <p>No users match the current filters</p>
        </div>
      )}
    </div>
  );
}





