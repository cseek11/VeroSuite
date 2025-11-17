import { useState, useEffect, useCallback, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '@/stores/auth';
import { enhancedApi } from '@/lib/enhanced-api';
import { logger } from '@/utils/logger';

export interface PresenceInfo {
  user_id: string;
  session_id: string;
  is_editing: boolean;
  last_seen: string;
}

interface UseRegionPresenceOptions {
  regionId: string;
  userId: string;
  sessionId: string;
  enabled?: boolean;
}

interface UseRegionPresenceReturn {
  presence: PresenceInfo[];
  isEditing: boolean;
  lockedBy: string | null;
  isConnected: boolean;
  acquireLock: () => Promise<boolean>;
  releaseLock: () => Promise<void>;
  updatePresence: (isEditing: boolean) => Promise<void>;
}

export function useRegionPresence({
  regionId,
  userId,
  sessionId,
  enabled = true
}: UseRegionPresenceOptions): UseRegionPresenceReturn {
  const [presence, setPresence] = useState<PresenceInfo[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [lockedBy, setLockedBy] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const { token, tenantId } = useAuthStore();

  // Update presence via API
  const updatePresence = useCallback(async (editing: boolean) => {
    if (!enabled || !regionId) return;

    try {
      setIsEditing(editing);
      
      // Update via API
      await enhancedApi.dashboardLayouts.updatePresence(regionId, userId, sessionId, editing);
      
      // Also update via WebSocket if connected
      if (socketRef.current?.connected) {
        socketRef.current.emit('update-presence', {
          regionId,
          isEditing: editing
        });
      }
    } catch (error) {
      logger.error('Failed to update presence', error, 'useRegionPresence');
    }
  }, [enabled, regionId, userId, sessionId]);

  // Acquire lock
  const acquireLock = useCallback(async (): Promise<boolean> => {
    if (!enabled || !regionId) return false;

    try {
      // Try via WebSocket first (faster)
      if (socketRef.current?.connected) {
        return new Promise((resolve) => {
          const timeout = setTimeout(() => {
            resolve(false);
          }, 2000);

          socketRef.current!.once('lock-result', (result: { success: boolean; lockedBy?: string }) => {
            clearTimeout(timeout);
            if (result.success) {
              setIsEditing(true);
              setLockedBy(null);
            } else {
              setLockedBy(result.lockedBy || null);
            }
            resolve(result.success);
          });

          socketRef.current!.emit('acquire-lock', { regionId });
        });
      }

      // Fallback to API
      const result = await enhancedApi.dashboardLayouts.acquireLock(regionId);
      if (result.success) {
        setIsEditing(true);
        setLockedBy(null);
        await updatePresence(true);
      } else {
        setLockedBy(result.lockedBy || null);
      }
      return result.success;
    } catch (error) {
      logger.error('Failed to acquire lock', error, 'useRegionPresence');
      return false;
    }
  }, [enabled, regionId, updatePresence]);

  // Release lock
  const releaseLock = useCallback(async (): Promise<void> => {
    if (!enabled || !regionId) return;

    try {
      // Release via WebSocket if connected
      if (socketRef.current?.connected) {
        socketRef.current.emit('release-lock', { regionId });
      }

      // Also release via API
      await enhancedApi.dashboardLayouts.releaseLock(regionId);
      await updatePresence(false);
      setLockedBy(null);
    } catch (error) {
      logger.error('Failed to release lock', error, 'useRegionPresence');
    }
  }, [enabled, regionId, updatePresence]);

  // Load initial presence from API
  const loadPresence = useCallback(async () => {
    if (!enabled || !regionId) return;

    try {
      const data = await enhancedApi.dashboardLayouts.getPresence(regionId);
      setPresence(data || []);
      
      // Check for locks
      const editor = (data || []).find((p: PresenceInfo) => p.is_editing && p.user_id !== userId);
      if (editor) {
        setLockedBy(editor.user_id);
      } else {
        setLockedBy(null);
      }
    } catch (error) {
      logger.error('Failed to load presence', error, 'useRegionPresence');
    }
  }, [enabled, regionId, userId]);

  // WebSocket connection for real-time updates
  useEffect(() => {
    if (!enabled || !regionId || !token || !tenantId) return;

    const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
    const socket = io(`${backendUrl}/dashboard-presence`, {
      auth: {
        token,
      },
      transports: ['websocket', 'polling'],
      timeout: 5000,
      autoConnect: true,
    });

    socketRef.current = socket;

    // Connection handlers
    socket.on('connect', () => {
      setIsConnected(true);
      logger.debug('Dashboard presence WebSocket connected', { regionId }, 'useRegionPresence');
      
      // Join region room
      socket.emit('join-region', { regionId });
      
      // Load initial presence
      loadPresence();
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
      logger.debug('Dashboard presence WebSocket disconnected', { regionId }, 'useRegionPresence');
    });

    socket.on('connected', (data) => {
      logger.debug('Dashboard presence WebSocket authenticated', data, 'useRegionPresence');
    });

    socket.on('presence-updated', (data: { regionId: string; presence: PresenceInfo[] }) => {
      if (data.regionId === regionId) {
        setPresence(data.presence || []);
        
        // Check for locks
        const editor = (data.presence || []).find((p: PresenceInfo) => p.is_editing && p.user_id !== userId);
        if (editor) {
          setLockedBy(editor.user_id);
        } else {
          setLockedBy(null);
        }
      }
    });

    socket.on('presence-joined', (data: { userId: string; regionId: string }) => {
      if (data.regionId === regionId && data.userId !== userId) {
        // Reload presence when someone joins
        loadPresence();
      }
    });

    socket.on('presence-left', (data: { userId: string; regionId: string }) => {
      if (data.regionId === regionId) {
        // Reload presence when someone leaves
        loadPresence();
      }
    });

    socket.on('lock-acquired', (data: { regionId: string; userId: string; presence: PresenceInfo[] }) => {
      if (data.regionId === regionId) {
        setPresence(data.presence || []);
        if (data.userId !== userId) {
          setLockedBy(data.userId);
        }
      }
    });

    socket.on('lock-released', (data: { regionId: string; userId: string; presence: PresenceInfo[] }) => {
      if (data.regionId === regionId) {
        setPresence(data.presence || []);
        if (data.userId === userId) {
          setIsEditing(false);
        }
        setLockedBy(null);
      }
    });

    socket.on('error', (error) => {
      logger.error('Dashboard presence WebSocket error', error, 'useRegionPresence');
    });

    // Fallback: Update presence periodically if WebSocket is not connected
    intervalRef.current = setInterval(() => {
      if (!socket.connected) {
        updatePresence(isEditing);
      }
    }, 30000); // 30 seconds

    return () => {
      // Leave region room
      if (socket.connected) {
        socket.emit('leave-region', { regionId });
      }
      
      socket.disconnect();
      socketRef.current = null;
      
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      
      // Release lock on unmount
      if (isEditing) {
        releaseLock();
      }
    };
  }, [enabled, regionId, token, tenantId, userId, sessionId, loadPresence, updatePresence, isEditing, releaseLock]);

  return {
    presence,
    isEditing,
    lockedBy,
    isConnected,
    acquireLock,
    releaseLock,
    updatePresence
  };
}


