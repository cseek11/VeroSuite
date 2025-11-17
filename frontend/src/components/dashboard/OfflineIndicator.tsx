import React, { useState, useEffect } from 'react';
import { WifiOff, Cloud, CloudOff, AlertCircle, CheckCircle2 } from 'lucide-react';
import { offlineQueueService, QueuedOperation } from '@/services/offline-queue.service';
import { isOnline, onOnlineStatusChange } from '@/utils/pwa';
import { toast } from '@/utils/toast';
import Button from '@/components/ui/Button';

export const OfflineIndicator: React.FC = () => {
  const [online, setOnline] = useState(isOnline());
  const [queue, setQueue] = useState<QueuedOperation[]>([]);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    // Subscribe to online status changes
    const unsubscribeOnline = onOnlineStatusChange((isOnline) => {
      setOnline(isOnline);
      if (isOnline) {
        toast.success('Connection restored. Syncing changes...');
      } else {
        toast.info('You\'re offline. Changes will be synced when connection is restored.');
      }
    });

    // Subscribe to queue changes
    const unsubscribeQueue = offlineQueueService.subscribe((updatedQueue) => {
      setQueue(updatedQueue);
    });

    // Initial queue load
    setQueue(offlineQueueService.getQueue());

    return () => {
      unsubscribeOnline();
      unsubscribeQueue();
    };
  }, []);

  const status = offlineQueueService.getQueueStatus();
  const hasPendingChanges = status.pending > 0 || status.syncing > 0;
  const hasFailedChanges = status.failed > 0;

  if (online && !hasPendingChanges && !hasFailedChanges) {
    return null; // Don't show indicator when online and no pending changes
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4 min-w-[280px] max-w-[400px]">
        {/* Status Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            {online ? (
              hasPendingChanges ? (
                <Cloud className="w-5 h-5 text-blue-600 animate-pulse" />
              ) : (
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              )
            ) : (
              <WifiOff className="w-5 h-5 text-red-600" />
            )}
            <span className="font-semibold text-sm">
              {online 
                ? hasPendingChanges 
                  ? 'Syncing...' 
                  : 'All synced'
                : 'Offline'}
            </span>
          </div>
          {hasPendingChanges && (
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="text-xs text-blue-600 hover:text-blue-700"
            >
              {showDetails ? 'Hide' : 'Details'}
            </button>
          )}
        </div>

        {/* Status Summary */}
        {!online && (
          <p className="text-xs text-gray-600 mb-3">
            Your changes are being saved locally and will sync when you're back online.
          </p>
        )}

        {online && hasPendingChanges && (
          <div className="space-y-2 mb-3">
            {status.syncing > 0 && (
              <div className="flex items-center gap-2 text-xs text-blue-600">
                <Cloud className="w-4 h-4 animate-pulse" />
                <span>{status.syncing} operation{status.syncing !== 1 ? 's' : ''} syncing...</span>
              </div>
            )}
            {status.pending > 0 && (
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <CloudOff className="w-4 h-4" />
                <span>{status.pending} operation{status.pending !== 1 ? 's' : ''} pending</span>
              </div>
            )}
          </div>
        )}

        {hasFailedChanges && (
          <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded">
            <div className="flex items-center gap-2 text-xs text-red-700 mb-2">
              <AlertCircle className="w-4 h-4" />
              <span>{status.failed} operation{status.failed !== 1 ? 's' : ''} failed</span>
            </div>
            <Button
              onClick={() => offlineQueueService.retryFailed()}
              className="w-full text-xs py-1 bg-red-600 hover:bg-red-700"
            >
              Retry Failed
            </Button>
          </div>
        )}

        {/* Queue Details */}
        {showDetails && queue.length > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-200 max-h-48 overflow-y-auto">
            <div className="space-y-1">
              {queue.slice(0, 5).map(op => (
                <div
                  key={op.id}
                  className="flex items-center justify-between text-xs p-2 bg-gray-50 rounded"
                >
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">
                      {op.type} {op.resource}
                    </div>
                    {op.status === 'failed' && op.error && (
                      <div className="text-red-600 text-xs mt-1">{op.error}</div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {op.status === 'syncing' && (
                      <Cloud className="w-3 h-3 text-blue-600 animate-pulse" />
                    )}
                    {op.status === 'failed' && (
                      <AlertCircle className="w-3 h-3 text-red-600" />
                    )}
                    {op.status === 'completed' && (
                      <CheckCircle2 className="w-3 h-3 text-green-600" />
                    )}
                  </div>
                </div>
              ))}
              {queue.length > 5 && (
                <div className="text-xs text-gray-500 text-center pt-1">
                  +{queue.length - 5} more
                </div>
              )}
            </div>
          </div>
        )}

        {/* Actions */}
        {online && hasPendingChanges && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <Button
              onClick={() => offlineQueueService.syncQueue()}
              className="w-full text-xs py-1 bg-blue-600 hover:bg-blue-700"
            >
              Sync Now
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};


