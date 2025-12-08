import React, { useState } from 'react';
import { useRegionPermissions, PermissionSet } from '@/hooks/useRegionPermissions';

interface ShareRegionDialogProps {
  regionId: string;
  userId: string;
  isOpen: boolean;
  onClose: () => void;
}

export const ShareRegionDialog: React.FC<ShareRegionDialogProps> = ({
  regionId,
  userId,
  isOpen,
  onClose
}) => {
  const { canShare, setACL } = useRegionPermissions({ regionId, userId });
  const [principalType, setPrincipalType] = useState<'user' | 'role' | 'team'>('user');
  const [principalId, setPrincipalId] = useState('');
  const [permissions, setPermissions] = useState<PermissionSet>({
    read: true,
    edit: false,
    share: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleShare = async () => {
    if (!principalId) {
      setError('Please enter a principal ID');
      return;
    }

    if (!canShare) {
      setError('You do not have permission to share this region');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await setACL(principalType, principalId, permissions);
      onClose();
      setPrincipalId('');
      setPermissions({ read: true, edit: false, share: false });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to share region');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Share Region</h2>

          {!canShare && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded">
              <p className="text-sm text-red-800">
                You do not have permission to share this region.
              </p>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Share With
              </label>
              <select
                value={principalType}
                onChange={(e) => setPrincipalType(e.target.value as 'user' | 'role' | 'team')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                disabled={!canShare}
              >
                <option value="user">User</option>
                <option value="role">Role</option>
                <option value="team">Team</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {principalType === 'user' ? 'User' : principalType === 'role' ? 'Role' : 'Team'} ID
              </label>
              <input
                type="text"
                value={principalId}
                onChange={(e) => setPrincipalId(e.target.value)}
                placeholder={`Enter ${principalType} ID`}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                disabled={!canShare}
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
                    disabled={!canShare}
                  />
                  <span className="text-sm">Read - Can view the region</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={permissions.edit}
                    onChange={(e) => setPermissions({ ...permissions, edit: e.target.checked })}
                    className="mr-2"
                    disabled={!canShare}
                  />
                  <span className="text-sm">Edit - Can modify the region</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={permissions.share}
                    onChange={(e) => setPermissions({ ...permissions, share: e.target.checked })}
                    className="mr-2"
                    disabled={!canShare}
                  />
                  <span className="text-sm">Share - Can share with others</span>
                </label>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            <div className="flex justify-end gap-3 pt-4">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded hover:bg-gray-200"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={handleShare}
                disabled={loading || !canShare || !principalId}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Sharing...' : 'Share'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};





