import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { userApi } from '@/lib/user-api';
import { User } from '@/types/enhanced-types';
import { ArrowLeft, Pencil, Phone, Mail, Shield, Calendar, User as UserIcon, Briefcase } from 'lucide-react';
import UserActivityLog from './UserActivityLog';
import UserHierarchy from './UserHierarchy';
import AvatarUpload from './AvatarUpload';
import UserTags from './UserTags';
import SessionManagement from './SessionManagement';
import UserMetrics from './UserMetrics';
import UserDeactivation from './UserDeactivation';

interface UserDetailProps {
  userId: string;
  onBack: () => void;
  onEdit: (user: User) => void;
}

export default function UserDetail({ userId, onBack, onEdit }: UserDetailProps) {
  const { data: usersResponse, isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      return await userApi.getUsers();
    },
  });

  // Find the specific user from the list
  const user = usersResponse?.users?.find((u: User) => u.id === userId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <div className="text-red-800">
          Error loading user: {error instanceof Error ? error.message : 'User not found'}
        </div>
      </div>
    );
  }

  const getRoleColor = (role: string) => {
    const colors: Record<string, string> = {
      'admin': 'bg-purple-100 text-purple-800',
      'dispatcher': 'bg-blue-100 text-blue-800',
      'technician': 'bg-green-100 text-green-800',
      'owner': 'bg-yellow-100 text-yellow-800',
    };
    return colors[role] || 'bg-gray-100 text-gray-800';
  };

  const getStatusColor = (status: string) => {
    return status === 'active' 
      ? 'bg-green-100 text-green-800' 
      : status === 'inactive'
      ? 'bg-gray-100 text-gray-800'
      : 'bg-red-100 text-red-800';
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-white shadow-sm border border-gray-200 rounded-lg mb-6">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBack}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div className="flex items-center space-x-3">
                {user.avatar_url ? (
                  <img
                    src={user.avatar_url}
                    alt={`${user.first_name} ${user.last_name}`}
                    className="h-12 w-12 rounded-full object-cover border-2 border-purple-200"
                  />
                ) : (
                  <div className="flex-shrink-0 h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
                    <UserIcon className="h-6 w-6 text-purple-600" />
                  </div>
                )}
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {user.first_name} {user.last_name}
                  </h1>
                  <p className="text-sm text-gray-600">
                    User ID: {user.id}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => onEdit(user)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                <Pencil className="h-4 w-4 mr-2" />
                Edit User
              </button>
            </div>
          </div>
        </div>

        {/* Quick Info Bar */}
        <div className="px-6 py-4 bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex items-center space-x-2">
              <Shield className="h-4 w-4 text-gray-400" />
              <div className="flex flex-wrap gap-1">
                {user.roles?.map((role) => (
                  <span
                    key={role}
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(role)}`}
                  >
                    {role}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Shield className="h-4 w-4 text-gray-400" />
              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(user.status)}`}>
                {user.status}
              </span>
            </div>
            {user.employee_id && (
              <div className="flex items-center space-x-2">
                <Briefcase className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-600">
                  {user.employee_id}
                </span>
              </div>
            )}
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-600">
                Since {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <div className="bg-white shadow-sm border border-gray-200 rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Basic Information</h3>
            </div>
            <div className="px-6 py-4">
              <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500">First Name</dt>
                  <dd className="mt-1 text-sm text-gray-900">{user.first_name}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Last Name</dt>
                  <dd className="mt-1 text-sm text-gray-900">{user.last_name}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Employee ID</dt>
                  <dd className="mt-1 text-sm text-gray-900">{user.employee_id || 'N/A'}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Tenant ID</dt>
                  <dd className="mt-1 text-sm text-gray-900 font-mono text-xs">{user.tenant_id}</dd>
                </div>
              </dl>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white shadow-sm border border-gray-200 rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Contact Information</h3>
            </div>
            <div className="px-6 py-4">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-gray-400" />
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Email</dt>
                    <dd className="text-sm text-gray-900">{user.email}</dd>
                  </div>
                </div>
                {user.phone && (
                  <div className="flex items-center space-x-3">
                    <Phone className="h-5 w-5 text-gray-400" />
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Phone</dt>
                      <dd className="text-sm text-gray-900">{user.phone}</dd>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Professional Information */}
          {(user.technician_number || user.pesticide_license_number || user.license_expiration_date) && (
            <div className="bg-white shadow-sm border border-gray-200 rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Professional Information</h3>
              </div>
              <div className="px-6 py-4">
                <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {user.technician_number && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Technician Number</dt>
                      <dd className="mt-1 text-sm text-gray-900">{user.technician_number}</dd>
                    </div>
                  )}
                  {user.pesticide_license_number && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Pesticide License Number</dt>
                      <dd className="mt-1 text-sm text-gray-900">{user.pesticide_license_number}</dd>
                    </div>
                  )}
                  {user.license_expiration_date && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500">License Expiration Date</dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {new Date(user.license_expiration_date).toLocaleDateString()}
                      </dd>
                    </div>
                  )}
                </dl>
              </div>
            </div>
          )}

          {/* Activity Log */}
          <div className="bg-white shadow-sm border border-gray-200 rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Activity Log</h3>
            </div>
            <div className="px-6 py-4">
              <UserActivityLog userId={user.id} limit={20} />
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="bg-white shadow-sm border border-gray-200 rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Performance Metrics</h3>
            </div>
            <div className="px-6 py-4">
              <UserMetrics userId={user.id} />
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Avatar Upload */}
          <div className="bg-white shadow-sm border border-gray-200 rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Profile Picture</h3>
            </div>
            <div className="px-6 py-4">
              <AvatarUpload
                userId={user.id}
                currentAvatarUrl={user.avatar_url || undefined}
                size="md"
              />
            </div>
          </div>

          {/* User Tags */}
          {user.tags && user.tags.length > 0 && (
            <div className="bg-white shadow-sm border border-gray-200 rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Tags</h3>
              </div>
              <div className="px-6 py-4">
                <UserTags tags={user.tags || []} editable={false} />
              </div>
            </div>
          )}

          {/* User Hierarchy */}
          <div className="bg-white shadow-sm border border-gray-200 rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Organization</h3>
            </div>
            <div className="px-6 py-4">
              <UserHierarchy userId={user.id} />
            </div>
          </div>

          {/* Account Status */}
          <div className="bg-white shadow-sm border border-gray-200 rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Account Status</h3>
            </div>
            <div className="px-6 py-4">
              <div className="space-y-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Status</dt>
                  <dd className="mt-1">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(user.status)}`}>
                      {user.status}
                    </span>
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Roles</dt>
                  <dd className="mt-1">
                    <div className="flex flex-wrap gap-1">
                      {user.roles?.map((role) => (
                        <span
                          key={role}
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(role)}`}
                        >
                          {role}
                        </span>
                      ))}
                    </div>
                  </dd>
                </div>
              </div>
            </div>
          </div>

          {/* Account Dates */}
          <div className="bg-white shadow-sm border border-gray-200 rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Account Dates</h3>
            </div>
            <div className="px-6 py-4">
              <dl className="space-y-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Created At</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {user.created_at ? new Date(user.created_at).toLocaleString() : 'N/A'}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Last Updated</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {user.updated_at ? new Date(user.updated_at).toLocaleString() : 'N/A'}
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          {/* Session Management */}
          <div className="bg-white shadow-sm border border-gray-200 rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Session Management</h3>
            </div>
            <div className="px-6 py-4">
              <SessionManagement userId={user.id} />
            </div>
          </div>

          {/* User Deactivation */}
          {user.status === 'active' && (
            <div className="bg-white shadow-sm border border-red-200 rounded-lg">
              <div className="px-6 py-4 border-b border-red-200 bg-red-50">
                <h3 className="text-lg font-medium text-red-900">Danger Zone</h3>
              </div>
              <div className="px-6 py-4">
                <UserDeactivation
                  userId={user.id}
                  userName={`${user.first_name} ${user.last_name}`}
                  onDeactivated={() => {
                    // Refresh user data
                    window.location.reload();
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

