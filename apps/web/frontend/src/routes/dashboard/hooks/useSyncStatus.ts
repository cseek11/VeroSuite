/**
 * Sync status management hook
 * Tracks when operations are syncing to server
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import { SyncStatus } from '../components/SyncStatus';

interface UseSyncStatusReturn {
  status: SyncStatus;
  lastSynced: Date | null;
  errorMessage: string | null;
  startSync: () => void;
  completeSync: () => void;
  setError: (message: string) => void;
  setOffline: () => void;
  setOnline: () => void;
}

export const useSyncStatus = (): UseSyncStatusReturn => {
  const [status, setStatus] = useState<SyncStatus>('idle');
  const [lastSynced, setLastSynced] = useState<Date | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const syncTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => {
      if (status === 'offline') {
        setStatus('idle');
      }
    };

    const handleOffline = () => {
      setStatus('offline');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check initial status
    if (!navigator.onLine) {
      setStatus('offline');
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [status]);

  const startSync = useCallback(() => {
    if (status === 'offline') return;
    
    setStatus('syncing');
    setErrorMessage(null);
    
    // Clear any existing timeout
    if (syncTimeoutRef.current) {
      clearTimeout(syncTimeoutRef.current);
    }
    
    // Auto-timeout after 10 seconds
    syncTimeoutRef.current = setTimeout(() => {
      setStatus('error');
      setErrorMessage('Sync timeout - please check your connection');
    }, 10000);
  }, [status]);

  const completeSync = useCallback(() => {
    if (syncTimeoutRef.current) {
      clearTimeout(syncTimeoutRef.current);
      syncTimeoutRef.current = null;
    }
    
    setStatus('synced');
    setLastSynced(new Date());
    setErrorMessage(null);
    
    // Reset to idle after 2 seconds
    setTimeout(() => {
      setStatus(prev => prev === 'synced' ? 'idle' : prev);
    }, 2000);
  }, []);

  const setError = useCallback((message: string) => {
    if (syncTimeoutRef.current) {
      clearTimeout(syncTimeoutRef.current);
      syncTimeoutRef.current = null;
    }
    
    setStatus('error');
    setErrorMessage(message);
    
    // Auto-recover after 5 seconds
    setTimeout(() => {
      setStatus('idle');
      setErrorMessage(null);
    }, 5000);
  }, []);

  const setOffline = useCallback(() => {
    setStatus('offline');
  }, []);

  const setOnline = useCallback(() => {
    if (status === 'offline') {
      setStatus('idle');
    }
  }, [status]);

  return {
    status,
    lastSynced,
    errorMessage,
    startSync,
    completeSync,
    setError,
    setOffline,
    setOnline,
  };
};








