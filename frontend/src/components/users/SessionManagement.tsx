import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { LogOut, Monitor, Globe, Clock, Trash2 } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

interface SessionManagementProps {
  userId: string;
}

interface ActiveSession {
  id: string;
  user_id: string;
  token_id: string;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
  last_activity: string;
  expires_at: string;
}

async function fetchActiveSessions(userId: string): Promise<ActiveSession[]> {
  const token = localStorage.getItem('verofield_auth')
    ? JSON.parse(localStorage.getItem('verofield_auth')!).token
    : localStorage.getItem('jwt');
  const tenantId = localStorage.getItem('tenantId') || '7193113e-ece2-4f7b-ae8c-176df4367e28';

  const response = await fetch(`${API_BASE_URL}/v1/users/${userId}/sessions`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      'x-tenant-id': tenantId,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch sessions: ${response.statusText}`);
  }

  return response.json();
}

async function revokeSession(userId: string, sessionId: string): Promise<void> {
  const token = localStorage.getItem('verofield_auth')
    ? JSON.parse(localStorage.getItem('verofield_auth')!).token
    : localStorage.getItem('jwt');
  const tenantId = localStorage.getItem('tenantId') || '7193113e-ece2-4f7b-ae8c-176df4367e28';

  const response = await fetch(`${API_BASE_URL}/v1/users/${userId}/sessions/${sessionId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      'x-tenant-id': tenantId,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to revoke session: ${response.statusText}`);
  }
}

async function revokeAllSessions(userId: string): Promise<void> {
  const token = localStorage.getItem('verofield_auth')
    ? JSON.parse(localStorage.getItem('verofield_auth')!).token
    : localStorage.getItem('jwt');
  const tenantId = localStorage.getItem('tenantId') || '7193113e-ece2-4f7b-ae8c-176df4367e28';

  const response = await fetch(`${API_BASE_URL}/v1/users/${userId}/sessions`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      'x-tenant-id': tenantId,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to revoke all sessions: ${response.statusText}`);
  }
}

export default function SessionManagement({ userId }: SessionManagementProps) {
  const queryClient = useQueryClient();

  const { data: sessions = [], isLoading, error } = useQuery({
    queryKey: ['user-sessions', userId],
    queryFn: () => fetchActiveSessions(userId),
    enabled: !!userId,
  });

  const revokeSessionMutation = useMutation({
    mutationFn: (sessionId: string) => revokeSession(userId, sessionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-sessions', userId] });
    },
  });

  const revokeAllMutation = useMutation({
    mutationFn: () => revokeAllSessions(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-sessions', userId] });
    },
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
          Error loading sessions: {error instanceof Error ? error.message : 'Unknown error'}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Active Sessions</h3>
          <p className="text-sm text-gray-500">{sessions.length} active session(s)</p>
        </div>
        {sessions.length > 0 && (
          <button
            onClick={() => {
              if (confirm('Are you sure you want to revoke all sessions? This will log the user out from all devices.')) {
                revokeAllMutation.mutate();
              }
            }}
            disabled={revokeAllMutation.isPending}
            className="inline-flex items-center px-3 py-2 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Revoke All
          </button>
        )}
      </div>

      {sessions.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <Monitor className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <p>No active sessions</p>
        </div>
      ) : (
        <div className="space-y-3">
          {sessions.map((session) => (
            <div
              key={session.id}
              className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg"
            >
              <div className="flex items-center space-x-4 flex-1">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                    <Monitor className="h-5 w-5 text-green-600" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    {session.ip_address && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Globe className="h-4 w-4 mr-1" />
                        {session.ip_address}
                      </div>
                    )}
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="h-4 w-4 mr-1" />
                      {new Date(session.last_activity).toLocaleString()}
                    </div>
                  </div>
                  {session.user_agent && (
                    <p className="text-xs text-gray-500 mt-1 truncate">{session.user_agent}</p>
                  )}
                  <p className="text-xs text-gray-400 mt-1">
                    Expires: {new Date(session.expires_at).toLocaleString()}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  if (confirm('Are you sure you want to revoke this session?')) {
                    revokeSessionMutation.mutate(session.id);
                  }
                }}
                disabled={revokeSessionMutation.isPending}
                className="ml-4 p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md disabled:opacity-50"
                title="Revoke Session"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}





