import React from 'react';

interface LockIndicatorProps {
  isLocked: boolean;
  lockedBy?: string;
  currentUserId: string;
}

export const LockIndicator: React.FC<LockIndicatorProps> = ({
  isLocked,
  lockedBy,
  currentUserId
}) => {
  if (!isLocked) {
    return null;
  }

  const isLockedByMe = lockedBy === currentUserId;

  return (
    <div className={`lock-indicator flex items-center gap-1 px-2 py-1 rounded text-xs ${
      isLockedByMe 
        ? 'bg-blue-100 text-blue-800 border border-blue-300' 
        : 'bg-red-100 text-red-800 border border-red-300'
    }`}>
      <span>🔒</span>
      <span>
        {isLockedByMe ? 'Locked by you' : 'Locked by another user'}
      </span>
    </div>
  );
};





