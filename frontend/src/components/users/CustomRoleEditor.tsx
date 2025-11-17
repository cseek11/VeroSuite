import React, { useState } from 'react';
import { Plus, Save, Trash2, Edit2 } from 'lucide-react';
import { PREDEFINED_ROLES, Role } from '@/types/role-actions';

interface CustomRoleEditorProps {
  onSave?: (role: Role) => void;
  onDelete?: (roleId: string) => void;
}

const RESOURCES = [
  'jobs', 'work_orders', 'customers', 'technicians', 'invoices',
  'reports', 'settings', 'users', 'inventory', 'financial',
];

const ACTIONS = [
  'view', 'create', 'update', 'delete', 'assign', 'approve',
  'export', 'import', 'manage',
];

export default function CustomRoleEditor({ onSave, onDelete }: CustomRoleEditorProps) {
  const [roles, setRoles] = useState<Role[]>(PREDEFINED_ROLES);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [newRole, setNewRole] = useState<Partial<Role>>({
    id: '',
    name: '',
    permissions: [],
    context: 'global',
  });

  const handleCreateRole = () => {
    if (!newRole.name || !newRole.id) {
      alert('Please provide both ID and name for the role');
      return;
    }

    if (roles.find(r => r.id === newRole.id)) {
      alert('A role with this ID already exists');
      return;
    }

    const role: Role = {
      id: newRole.id,
      name: newRole.name,
      permissions: newRole.permissions || [],
      context: newRole.context || 'global',
    };

    setRoles([...roles, role]);
    onSave?.(role);
    setNewRole({ id: '', name: '', permissions: [], context: 'global' });
  };

  const handleTogglePermission = (resource: string, action: string, role: Role) => {
    const updatedPermissions = [...role.permissions];
    const existingIndex = updatedPermissions.findIndex(
      p => p.resource === resource && p.action === action
    );

    if (existingIndex >= 0) {
      updatedPermissions.splice(existingIndex, 1);
    } else {
      updatedPermissions.push({ resource, action });
    }

    const updatedRole = { ...role, permissions: updatedPermissions };
    setRoles(roles.map(r => r.id === role.id ? updatedRole : r));
    setEditingRole(updatedRole);
  };

  const handleDeleteRole = (roleId: string) => {
    if (PREDEFINED_ROLES.find(r => r.id === roleId)) {
      alert('Cannot delete predefined roles');
      return;
    }

    if (confirm('Are you sure you want to delete this role?')) {
      setRoles(roles.filter(r => r.id !== roleId));
      onDelete?.(roleId);
    }
  };

  const hasPermission = (role: Role, resource: string, action: string) => {
    return role.permissions.some(
      p => (p.resource === '*' || p.resource === resource) &&
           (p.action === '*' || p.action === action)
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Role Management</h3>
          <p className="text-sm text-gray-500 mt-1">
            Create and manage custom roles with granular permissions
          </p>
        </div>
      </div>

      {/* Create New Role */}
      <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-6">
        <h4 className="text-sm font-medium text-gray-900 mb-4">Create New Role</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Role ID <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={newRole.id}
              onChange={(e) => setNewRole({ ...newRole, id: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
              placeholder="e.g., custom-manager"
              className="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Role Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={newRole.name}
              onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
              placeholder="e.g., Custom Manager"
              className="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={handleCreateRole}
              className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Role
            </button>
          </div>
        </div>
      </div>

      {/* Roles List */}
      <div className="space-y-4">
        {roles.map((role) => (
          <div key={role.id} className="bg-white shadow-sm border border-gray-200 rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">{role.name}</h4>
                  <p className="text-xs text-gray-500 mt-1">ID: {role.id} • Context: {role.context}</p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setEditingRole(editingRole?.id === role.id ? null : role)}
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md"
                    title="Edit Permissions"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  {!PREDEFINED_ROLES.find(r => r.id === role.id) && (
                    <button
                      onClick={() => handleDeleteRole(role.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md"
                      title="Delete Role"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {editingRole?.id === role.id && (
              <div className="px-6 py-4">
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr>
                        <th className="text-left py-2 px-2 font-medium text-gray-700">Resource</th>
                        {ACTIONS.map(action => (
                          <th key={action} className="text-center py-2 px-2 font-medium text-gray-700 capitalize">
                            {action}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {RESOURCES.map(resource => (
                        <tr key={resource} className="border-t border-gray-200">
                          <td className="py-2 px-2 font-medium text-gray-900 capitalize">
                            {resource.replace('_', ' ')}
                          </td>
                          {ACTIONS.map(action => {
                            const hasPerm = hasPermission(role, resource, action);
                            return (
                              <td key={action} className="py-2 px-2 text-center">
                                <button
                                  onClick={() => handleTogglePermission(resource, action, role)}
                                  className={`w-6 h-6 rounded border-2 flex items-center justify-center ${
                                    hasPerm
                                      ? 'bg-green-100 border-green-500 text-green-700'
                                      : 'bg-gray-100 border-gray-300 text-gray-400 hover:border-gray-400'
                                  }`}
                                >
                                  {hasPerm && <span className="text-xs">✓</span>}
                                </button>
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() => {
                      onSave?.(role);
                      setEditingRole(null);
                    }}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </button>
                </div>
              </div>
            )}

            {editingRole?.id !== role.id && (
              <div className="px-6 py-4">
                <div className="flex flex-wrap gap-2">
                  {role.permissions.length === 0 ? (
                    <span className="text-sm text-gray-500">No permissions assigned</span>
                  ) : (
                    role.permissions.map((perm, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800"
                      >
                        {perm.resource === '*' ? '*' : perm.resource}:
                        {perm.action === '*' ? '*' : perm.action}
                      </span>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}





