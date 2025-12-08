import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AlertTriangle } from 'lucide-react';
import { logger } from '@/utils/logger';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

interface UserDeactivationProps {
  userId: string;
  userName: string;
  onDeactivated?: () => void;
  onCancel?: () => void;
}

interface DeactivationResult {
  user: {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    status: string;
  };
  reassigned: {
    jobs: number;
    workOrders: number;
  };
  unassigned: {
    jobs: number;
    workOrders: number;
  };
  message: string;
}

async function deactivateUser(
  userId: string,
  reassignToUserId?: string,
  reason?: string
): Promise<DeactivationResult> {
  const token = localStorage.getItem('verofield_auth')
    ? JSON.parse(localStorage.getItem('verofield_auth')!).token
    : localStorage.getItem('jwt');
  const tenantId = localStorage.getItem('tenantId') || '7193113e-ece2-4f7b-ae8c-176df4367e28';

  let response;
  try {
    response = await fetch(`${API_BASE_URL}/v1/users/${userId}/deactivate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'x-tenant-id': tenantId,
      },
      body: JSON.stringify({
        reassignToUserId,
        reason,
      }),
    });
  } catch (error) {
    logger.error('Failed to deactivate user', {
      error: error instanceof Error ? error.message : String(error),
      userId,
      reassignToUserId
    });
    throw error;
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(error.message || 'Failed to deactivate user');
  }

  return response.json();
}

export default function UserDeactivation({
  userId,
  userName,
  onDeactivated,
  onCancel,
}: UserDeactivationProps) {
  const [reassignToUserId, setReassignToUserId] = useState<string>('');
  const [reason, setReason] = useState<string>('');
  const [confirmText, setConfirmText] = useState<string>('');
  const queryClient = useQueryClient();

  const deactivateMutation = useMutation({
    mutationFn: () => deactivateUser(userId, reassignToUserId || undefined, reason || undefined),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['user', userId] });
      logger.info('User deactivated', { userId, result: data }, 'UserDeactivation');
      onDeactivated?.();
    },
    onError: (error) => {
      logger.error('Error deactivating user', error, 'UserDeactivation');
    },
  });

  const handleDeactivate = () => {
    if (confirmText !== userName) {
      alert(`Please type "${userName}" to confirm deactivation`);
      return;
    }

    if (!confirm('Are you sure you want to deactivate this user? This action cannot be easily undone.')) {
      return;
    }

    deactivateMutation.mutate();
  };

  const isConfirmValid = confirmText === userName;

  return (
    <div className="space-y-6">
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
          <div>
            <h4 className="text-sm font-medium text-yellow-800">Warning</h4>
            <p className="text-sm text-yellow-700 mt-1">
              Deactivating this user will:
            </p>
            <ul className="list-disc list-inside text-sm text-yellow-700 mt-2 space-y-1">
              <li>Set their account status to inactive</li>
              <li>Unassign or reassign their open jobs and work orders</li>
              <li>Prevent them from logging in</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Reassign Work To (Optional)
          </label>
          <input
            type="text"
            value={reassignToUserId}
            onChange={(e) => setReassignToUserId(e.target.value)}
            placeholder="User ID to reassign work to (leave empty to unassign)"
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
          />
          <p className="mt-1 text-xs text-gray-500">
            If provided, all open jobs and work orders will be reassigned to this user
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Reason for Deactivation (Optional)
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Enter reason for deactivation..."
            rows={3}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Type "{userName}" to confirm
          </label>
          <input
            type="text"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder={userName}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
          />
        </div>
      </div>

      {deactivateMutation.isError && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="text-red-800 text-sm">
            {deactivateMutation.error instanceof Error
              ? deactivateMutation.error.message
              : 'Failed to deactivate user'}
          </div>
        </div>
      )}

      <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
        {onCancel && (
          <button
            onClick={onCancel}
            disabled={deactivateMutation.isPending}
            className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50"
          >
            Cancel
          </button>
        )}
        <button
          onClick={handleDeactivate}
          disabled={!isConfirmValid || deactivateMutation.isPending}
          className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {deactivateMutation.isPending ? 'Deactivating...' : 'Deactivate User'}
        </button>
      </div>
    </div>
  );
}





