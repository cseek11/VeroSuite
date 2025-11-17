import React, { useState } from 'react';
import UserList from '@/components/users/UserList';
import UserDetail from '@/components/users/UserDetail';
import { UserManagementForm } from '@/components/UserManagementForm';
import UserImportExport from '@/components/users/UserImportExport';
import UserAnalytics from '@/components/users/UserAnalytics';
import PermissionsAudit from '@/components/users/PermissionsAudit';
import CustomRoleEditor from '@/components/users/CustomRoleEditor';
import { User } from '@/types/enhanced-types';
import { Users, BarChart3, Shield, Key, Upload } from 'lucide-react';

type ViewMode = 'list' | 'detail' | 'create' | 'edit' | 'analytics' | 'import-export' | 'permissions' | 'roles' | 'api-keys';

export default function UserManagement() {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedTab, setSelectedTab] = useState<'users' | 'analytics' | 'import-export' | 'permissions' | 'roles'>('users');

  const handleViewUser = (user: User) => {
    setSelectedUser(user);
    setViewMode('detail');
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setViewMode('edit');
  };

  const handleCreateUser = () => {
    setSelectedUser(null);
    setViewMode('create');
  };

  const handleBackToList = () => {
    setViewMode('list');
    setSelectedUser(null);
  };

  const handleSaveUser = () => {
    setViewMode('list');
    setSelectedUser(null);
  };

  const renderContent = () => {
    // If we're in a user-specific view (detail, create, edit), show that
    if (viewMode === 'detail' && selectedUser) {
      return (
        <UserDetail
          userId={selectedUser.id}
          onBack={handleBackToList}
          onEdit={handleEditUser}
        />
      );
    }

    if (viewMode === 'create') {
      return (
        <UserManagementForm
          onSave={handleSaveUser}
          onCancel={handleBackToList}
        />
      );
    }

    if (viewMode === 'edit' && selectedUser) {
      return (
        <UserManagementForm
          user={selectedUser}
          onSave={handleSaveUser}
          onCancel={handleBackToList}
        />
      );
    }

    // Otherwise show tabbed interface
    return (
      <div className="space-y-6">
        {/* Tab Navigation */}
        <div className="bg-white shadow-sm border border-gray-200 rounded-lg">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px" aria-label="Tabs">
              <button
                onClick={() => {
                  setSelectedTab('users');
                  setViewMode('list');
                }}
                className={`${
                  selectedTab === 'users'
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm flex items-center space-x-2`}
              >
                <Users className="h-4 w-4" />
                <span>Users</span>
              </button>
              <button
                onClick={() => setSelectedTab('analytics')}
                className={`${
                  selectedTab === 'analytics'
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm flex items-center space-x-2`}
              >
                <BarChart3 className="h-4 w-4" />
                <span>Analytics</span>
              </button>
              <button
                onClick={() => setSelectedTab('import-export')}
                className={`${
                  selectedTab === 'import-export'
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm flex items-center space-x-2`}
              >
                <Upload className="h-4 w-4" />
                <span>Import/Export</span>
              </button>
              <button
                onClick={() => setSelectedTab('permissions')}
                className={`${
                  selectedTab === 'permissions'
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm flex items-center space-x-2`}
              >
                <Shield className="h-4 w-4" />
                <span>Permissions Audit</span>
              </button>
              <button
                onClick={() => setSelectedTab('roles')}
                className={`${
                  selectedTab === 'roles'
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm flex items-center space-x-2`}
              >
                <Key className="h-4 w-4" />
                <span>Roles</span>
              </button>
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div>
          {selectedTab === 'users' && (
            <UserList
              onViewUser={handleViewUser}
              onEditUser={handleEditUser}
              onCreateUser={handleCreateUser}
            />
          )}
          {selectedTab === 'analytics' && <UserAnalytics />}
          {selectedTab === 'import-export' && <UserImportExport />}
          {selectedTab === 'permissions' && <PermissionsAudit />}
          {selectedTab === 'roles' && <CustomRoleEditor />}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {renderContent()}
      </div>
    </div>
  );
}

