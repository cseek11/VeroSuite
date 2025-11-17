/**
 * Sync status indicator component
 * Shows when operations are syncing to server
 */

import React from 'react';
import { CheckCircle2, AlertCircle, Loader2, Cloud, CloudOff } from 'lucide-react';
import { cn } from '@/lib/utils';

export type SyncStatus = 'idle' | 'syncing' | 'synced' | 'error' | 'offline';

interface SyncStatusProps {
  status: SyncStatus;
  lastSynced?: Date;
  errorMessage?: string;
  className?: string;
}

export const SyncStatus: React.FC<SyncStatusProps> = ({
  status,
  lastSynced,
  errorMessage,
  className,
}) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'syncing':
        return {
          icon: Loader2,
          text: 'Syncing...',
          color: 'text-blue-500',
          bgColor: 'bg-blue-50',
          iconClass: 'animate-spin',
        };
      case 'synced':
        return {
          icon: CheckCircle2,
          text: lastSynced 
            ? `Synced ${formatLastSynced(lastSynced)}`
            : 'Synced',
          color: 'text-green-500',
          bgColor: 'bg-green-50',
          iconClass: '',
        };
      case 'error':
        return {
          icon: AlertCircle,
          text: errorMessage || 'Sync failed',
          color: 'text-red-500',
          bgColor: 'bg-red-50',
          iconClass: '',
        };
      case 'offline':
        return {
          icon: CloudOff,
          text: 'Offline',
          color: 'text-gray-500',
          bgColor: 'bg-gray-50',
          iconClass: '',
        };
      default:
        return {
          icon: Cloud,
          text: 'Ready',
          color: 'text-gray-400',
          bgColor: 'bg-gray-50',
          iconClass: '',
        };
    }
  };

  const formatLastSynced = (date: Date): string => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (seconds < 60) return 'just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return date.toLocaleTimeString();
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  return (
    <div
      className={cn(
        'flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-colors',
        config.bgColor,
        config.color,
        className
      )}
      title={errorMessage || config.text}
    >
      <Icon className={cn('w-3.5 h-3.5', config.iconClass)} />
      <span className="hidden sm:inline">{config.text}</span>
    </div>
  );
};








