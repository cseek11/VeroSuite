import React from 'react';
import { PresenceInfo } from '@/hooks/useRegionPresence';

interface PresenceIndicatorProps {
  presence: PresenceInfo[];
  currentUserId: string;
}

export const PresenceIndicator: React.FC<PresenceIndicatorProps> = ({
  presence,
  currentUserId
}) => {
  const otherUsers = presence.filter(p => p.user_id !== currentUserId);
  const editingUsers = otherUsers.filter(p => p.is_editing);

  if (otherUsers.length === 0) {
    return null;
  }

  return (
    <div className="presence-indicator flex items-center gap-2">
      {editingUsers.length > 0 && (
        <div className="flex items-center gap-1 px-2 py-1 bg-yellow-100 border border-yellow-300 rounded text-xs">
          <span className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></span>
          <span className="text-yellow-800">
            {editingUsers.length} {editingUsers.length === 1 ? 'person' : 'people'} editing
          </span>
        </div>
      )}
      
      {otherUsers.length > 0 && (
        <div className="flex items-center gap-1">
          <div className="flex -space-x-2">
            {otherUsers.slice(0, 3).map((user, index) => (
              <div
                key={user.user_id}
                className="w-6 h-6 bg-blue-500 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-medium"
                title={`User ${user.user_id.slice(0, 8)}`}
              >
                {user.user_id.slice(0, 1).toUpperCase()}
              </div>
            ))}
            {otherUsers.length > 3 && (
              <div className="w-6 h-6 bg-gray-400 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-medium">
                +{otherUsers.length - 3}
              </div>
            )}
          </div>
          <span className="text-xs text-gray-600">
            {otherUsers.length} {otherUsers.length === 1 ? 'viewer' : 'viewers'}
          </span>
        </div>
      )}
    </div>
  );
};





