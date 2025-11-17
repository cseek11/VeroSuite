import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Key, Plus, Trash2, Copy, Eye, EyeOff, Calendar, Globe } from 'lucide-react';
import { logger } from '@/utils/logger';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

interface ApiKeyManagementProps {
  userId: string;
}

interface ApiKey {
  id: string;
  name: string;
  key_prefix: string;
  scopes: string[];
  created_at: string;
  last_used?: string;
  expires_at?: string;
  is_active: boolean;
}

// Mock API - In production, this would call actual backend endpoints
async function fetchApiKeys(userId: string): Promise<ApiKey[]> {
  // TODO: Implement actual API call when backend endpoint is available
  return [];
}

async function createApiKey(userId: string, name: string, scopes: string[]): Promise<{ key: string; apiKey: ApiKey }> {
  // TODO: Implement actual API call when backend endpoint is available
  throw new Error('API key creation not yet implemented');
}

async function revokeApiKey(userId: string, keyId: string): Promise<void> {
  // TODO: Implement actual API call when backend endpoint is available
  throw new Error('API key revocation not yet implemented');
}

export default function ApiKeyManagement({ userId }: ApiKeyManagementProps) {
  const [showNewKeyForm, setShowNewKeyForm] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [selectedScopes, setSelectedScopes] = useState<string[]>([]);
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set());
  const queryClient = useQueryClient();

  const { data: apiKeys = [], isLoading } = useQuery({
    queryKey: ['api-keys', userId],
    queryFn: () => fetchApiKeys(userId),
    enabled: !!userId,
  });

  const createMutation = useMutation({
    mutationFn: () => createApiKey(userId, newKeyName, selectedScopes),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['api-keys', userId] });
      setShowNewKeyForm(false);
      setNewKeyName('');
      setSelectedScopes([]);
      // Show the full key to user (only time it's visible)
      alert(`API Key created! Save this key now - it won't be shown again:\n\n${data.key}`);
    },
    onError: (error) => {
      logger.error('Error creating API key', error, 'ApiKeyManagement');
    },
  });

  const revokeMutation = useMutation({
    mutationFn: (keyId: string) => revokeApiKey(userId, keyId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['api-keys', userId] });
    },
    onError: (error) => {
      logger.error('Error revoking API key', error, 'ApiKeyManagement');
    },
  });

  const toggleKeyVisibility = (keyId: string) => {
    setVisibleKeys(prev => {
      const next = new Set(prev);
      if (next.has(keyId)) {
        next.delete(keyId);
      } else {
        next.add(keyId);
      }
      return next;
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Could show a toast notification here
  };

  const availableScopes = [
    'read:users',
    'write:users',
    'read:jobs',
    'write:jobs',
    'read:customers',
    'write:customers',
    'read:reports',
    'write:reports',
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-gray-900">API Keys</h3>
          <p className="text-sm text-gray-500 mt-1">
            Manage API keys for programmatic access
          </p>
        </div>
        <button
          onClick={() => setShowNewKeyForm(!showNewKeyForm)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create API Key
        </button>
      </div>

      {/* Create New Key Form */}
      {showNewKeyForm && (
        <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-6">
          <h4 className="text-sm font-medium text-gray-900 mb-4">Create New API Key</h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Key Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
                placeholder="e.g., Production API Key"
                className="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Scopes
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {availableScopes.map(scope => (
                  <label key={scope} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={selectedScopes.includes(scope)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedScopes([...selectedScopes, scope]);
                        } else {
                          setSelectedScopes(selectedScopes.filter(s => s !== scope));
                        }
                      }}
                      className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                    <span className="text-sm text-gray-700">{scope}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowNewKeyForm(false);
                  setNewKeyName('');
                  setSelectedScopes([]);
                }}
                className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => createMutation.mutate()}
                disabled={!newKeyName || createMutation.isPending}
                className="px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50"
              >
                {createMutation.isPending ? 'Creating...' : 'Create Key'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* API Keys List */}
      {apiKeys.length === 0 ? (
        <div className="text-center py-8 text-gray-500 bg-white rounded-lg border border-gray-200">
          <Key className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <p>No API keys created yet</p>
          <p className="text-sm mt-1">Create your first API key to get started</p>
        </div>
      ) : (
        <div className="space-y-3">
          {apiKeys.map((apiKey) => (
            <div
              key={apiKey.id}
              className="bg-white shadow-sm border border-gray-200 rounded-lg p-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <Key className="h-5 w-5 text-purple-500" />
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">{apiKey.name}</h4>
                      <div className="flex items-center space-x-4 mt-1">
                        <span className="text-xs text-gray-500 font-mono">
                          {visibleKeys.has(apiKey.id)
                            ? `${apiKey.key_prefix}...`
                            : `${apiKey.key_prefix}••••••••`}
                        </span>
                        <div className="flex items-center space-x-2 text-xs text-gray-500">
                          <Calendar className="h-3 w-3" />
                          <span>Created {new Date(apiKey.created_at).toLocaleDateString()}</span>
                        </div>
                        {apiKey.last_used && (
                          <div className="flex items-center space-x-2 text-xs text-gray-500">
                            <Globe className="h-3 w-3" />
                            <span>Last used {new Date(apiKey.last_used).toLocaleDateString()}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {apiKey.scopes.map(scope => (
                          <span
                            key={scope}
                            className="inline-flex px-2 py-0.5 text-xs font-semibold rounded-full bg-blue-100 text-blue-800"
                          >
                            {scope}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => toggleKeyVisibility(apiKey.id)}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-md"
                    title={visibleKeys.has(apiKey.id) ? 'Hide Key' : 'Show Key'}
                  >
                    {visibleKeys.has(apiKey.id) ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                  <button
                    onClick={() => copyToClipboard(apiKey.key_prefix)}
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md"
                    title="Copy Key"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm('Are you sure you want to revoke this API key?')) {
                        revokeMutation.mutate(apiKey.id);
                      }
                    }}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md"
                    title="Revoke Key"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="text-sm font-medium text-blue-900 mb-2">API Key Security</h4>
        <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
          <li>API keys provide full access to your account - keep them secure</li>
          <li>Never share API keys in public repositories or client-side code</li>
          <li>Rotate keys regularly for better security</li>
          <li>Revoke keys immediately if they're compromised</li>
        </ul>
      </div>
    </div>
  );
}





