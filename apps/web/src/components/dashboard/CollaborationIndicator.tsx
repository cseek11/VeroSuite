import React from 'react';
import { Wifi, WifiOff, Users } from 'lucide-react';
import { CollaborationUser } from '@/hooks/useRealtimeCollaboration';

interface CollaborationIndicatorProps {
  isConnected: boolean;
  connectionStatus: 'connecting' | 'connected' | 'disconnected';
  collaborators: Record<string, CollaborationUser>;
  onToggleConnection: () => void;
}

const CollaborationIndicator: React.FC<CollaborationIndicatorProps> = ({
  isConnected,
  connectionStatus,
  collaborators,
  onToggleConnection
}) => {
  const activeCollaborators = Object.values(collaborators).filter(user => user.isActive);

  const getStatusColor = () => {
    switch (connectionStatus) {
      case 'connected': return 'text-green-600';
      case 'connecting': return 'text-yellow-600';
      case 'disconnected': return 'text-gray-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusIcon = () => {
    if (connectionStatus === 'connecting') {
      return <div className="w-4 h-4 border-2 border-yellow-600 border-t-transparent rounded-full animate-spin" />;
    }
    return isConnected ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />;
  };

  return (
    <div className="flex items-center gap-2 px-2 py-1 bg-white/60 backdrop-blur-sm rounded-lg border border-slate-200">
      {/* Connection Status */}
      <button
        onClick={onToggleConnection}
        className={`flex items-center gap-1 transition-colors ${getStatusColor()}`}
        title={`${connectionStatus} - Click to ${isConnected ? 'disconnect' : 'connect'}`}
      >
        {getStatusIcon()}
        <span className="text-xs font-medium">
          {connectionStatus === 'connecting' ? 'Connecting...' : 
           connectionStatus === 'connected' ? 'Live' : 'Offline'}
        </span>
      </button>

      {/* Active Collaborators */}
      {activeCollaborators.length > 0 && (
        <>
          <div className="w-px h-4 bg-gray-300" />
          <div className="flex items-center gap-1">
            <Users className="w-3 h-3 text-gray-500" />
            <span className="text-xs text-gray-600">{activeCollaborators.length}</span>
            
            {/* Collaborator Avatars */}
            <div className="flex -space-x-1">
              {activeCollaborators.slice(0, 3).map((user) => (
                <div
                  key={user.id}
                  className="w-5 h-5 rounded-full border-2 border-white flex items-center justify-center text-xs font-bold text-white"
                  style={{ backgroundColor: user.color }}
                  title={`${user.name} (${user.email})`}
                >
                  {user.name.charAt(0).toUpperCase()}
                </div>
              ))}
              {activeCollaborators.length > 3 && (
                <div className="w-5 h-5 rounded-full border-2 border-white bg-gray-500 flex items-center justify-center text-xs font-bold text-white">
                  +{activeCollaborators.length - 3}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CollaborationIndicator;
