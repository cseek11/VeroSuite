import React, { useState } from 'react';
import { useRegionPermissions, PermissionSet } from '@/hooks/useRegionPermissions';

interface RegionACLControlsProps {
  regionId: string;
  userId: string;
}

export const RegionACLControls: React.FC<RegionACLControlsProps> = ({
  regionId,
  userId
}) => {
  const {
    acls,
    loading,
    canShare,
    setACL,
    removeACL
  } = useRegionPermissions({ regionId, userId });

  const [showAddForm, setShowAddForm] = useState(false);
  const [principalType, setPrincipalType] = useState<'user' | 'role' | 'team'>('user');
  const [principalId, setPrincipalId] = useState('');
  const [permissions, setPermissions] = useState<PermissionSet>({
    read: true,
    edit: false,
    share: false
  });

  const handleAddACL = async () => {
    if (!principalId) return;

    try {
      await setACL(principalType, principalId, permissions);
      setShowAddForm(false);
      setPrincipalId('');
      setPermissions({ read: true, edit: false, share: false });
    } catch (error) {
      console.error('Failed to add ACL:', error);
    }
  };

  const handleRemoveACL = async (aclId: string) => {
    if (window.confirm('Are you sure you want to remove this permission?')) {
      try {
        await removeACL(aclId);
      } catch (error) {
        console.error('Failed to remove ACL:', error);
      }
    }
  };

  if (loading) {
    return <div className="p-4">Loading permissions...</div>;
  }

  return (
    <div className="region-acl-controls p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Region Permissions</h3>
        {canShare && (
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Add Permission
          </button>
        )}
      </div>

      {showAddForm && canShare && (
        <div className="mb-4 p-4 bg-gray-50 border border-gray-200 rounded">
          <h4 className="text-sm font-semibold mb-3">Add New Permission</h4>
          
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Principal Type
              </label>
              <select
                value={principalType}
                onChange={(e) => setPrincipalType(e.target.value as 'user' | 'role' | 'team')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="user">User</option>
                <option value="role">Role</option>
                <option value="team">Team</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Principal ID
              </label>
              <input
                type="text"
                value={principalId}
                onChange={(e) => setPrincipalId(e.target.value)}
                placeholder="Enter user/role/team ID"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Permissions
              </label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={permissions.read}
                    onChange={(e) => setPermissions({ ...permissions, read: e.target.checked })}
                    className="mr-2"
                  />
                  <span className="text-sm">Read</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={permissions.edit}
                    onChange={(e) => setPermissions({ ...permissions, edit: e.target.checked })}
                    className="mr-2"
                  />
                  <span className="text-sm">Edit</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={permissions.share}
                    onChange={(e) => setPermissions({ ...permissions, share: e.target.checked })}
                    className="mr-2"
                  />
                  <span className="text-sm">Share</span>
                </label>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleAddACL}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Add
              </button>
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setPrincipalId('');
                }}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {acls.length === 0 ? (
          <p className="text-sm text-gray-500">No additional permissions set</p>
        ) : (
          acls.map((acl) => (
            <div
              key={acl.id}
              className="p-3 border border-gray-200 rounded flex items-center justify-between"
            >
              <div>
                <p className="text-sm font-medium">
                  {acl.principal_type}: {acl.principal_id.slice(0, 8)}...
                </p>
                <div className="flex gap-3 mt-1 text-xs text-gray-600">
                  <span className={acl.permission_set.read ? 'text-green-600' : 'text-gray-400'}>
                    Read {acl.permission_set.read ? '✓' : '✗'}
                  </span>
                  <span className={acl.permission_set.edit ? 'text-green-600' : 'text-gray-400'}>
                    Edit {acl.permission_set.edit ? '✓' : '✗'}
                  </span>
                  <span className={acl.permission_set.share ? 'text-green-600' : 'text-gray-400'}>
                    Share {acl.permission_set.share ? '✓' : '✗'}
                  </span>
                </div>
              </div>
              {canShare && (
                <button
                  onClick={() => handleRemoveACL(acl.id)}
                  className="px-2 py-1 text-sm text-red-600 hover:bg-red-50 rounded"
                >
                  Remove
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};





