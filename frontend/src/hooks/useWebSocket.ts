import { useState, useEffect, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '@/stores/auth';

interface KPIDataUpdate {
  tenantId: string;
  kpiId?: string;
  data: any;
  timestamp: string;
}

interface KPIThresholdAlert {
  tenantId: string;
  kpiId: string;
  metric: string;
  value: number;
  threshold: number;
  status: 'warning' | 'critical';
  timestamp: string;
}

interface ConnectionStats {
  totalClients: number;
  tenantStats: Array<{
    tenant: string;
    clientCount: number;
  }>;
  timestamp: string;
}

interface UseWebSocketOptions {
  namespace?: string;
  autoConnect?: boolean;
  reconnectAttempts?: number;
  reconnectDelay?: number;
}

interface UseWebSocketReturn {
  socket: Socket | null;
  isConnected: boolean;
  connectionStatus: 'connecting' | 'connected' | 'disconnected' | 'error';
  lastError: string | null;
  connectionStats: ConnectionStats | null;
  connect: () => void;
  disconnect: () => void;
  subscribeToKPI: (kpiId?: string, metrics?: string[]) => void;
  unsubscribeFromKPI: (kpiId?: string) => void;
  onKPIUpdate: (callback: (update: KPIDataUpdate) => void) => void;
  onKPIAlert: (callback: (alert: KPIThresholdAlert) => void) => void;
  onConnectionStats: (callback: (stats: ConnectionStats) => void) => void;
  ping: () => void;
}

export function useWebSocket(options: UseWebSocketOptions = {}): UseWebSocketReturn {
  const {
    namespace = '/kpi-updates',
    autoConnect = true,
    reconnectAttempts = 5,
    reconnectDelay = 1000,
  } = options;

  const { token, tenantId } = useAuthStore();
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected' | 'error'>('disconnected');
  const [lastError, setLastError] = useState<string | null>(null);
  const [connectionStats, setConnectionStats] = useState<ConnectionStats | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const connect = useCallback(() => {
    if (socketRef.current?.connected) {
      return;
    }

    if (!token || !tenantId) {
      setLastError('No authentication token or tenant ID available');
      setConnectionStatus('error');
      return;
    }

    setConnectionStatus('connecting');
    setLastError(null);

    // Create socket connection - fix port mismatch
    const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
    const socket = io(`${backendUrl}${namespace}`, {
      auth: {
        token,
      },
      transports: ['websocket', 'polling'],
      timeout: 5000,
      autoConnect: true,
    });

    socketRef.current = socket;

    // Connection event handlers
    socket.on('connect', () => {
      console.log('WebSocket connected');
      setIsConnected(true);
      setConnectionStatus('connected');
      setLastError(null);
      reconnectAttemptsRef.current = 0;
    });

    socket.on('connected', (data) => {
      console.log('WebSocket authenticated:', data);
    });

    socket.on('disconnect', (reason) => {
      console.log('WebSocket disconnected:', reason);
      setIsConnected(false);
      setConnectionStatus('disconnected');
      
      // Attempt reconnection if not manual disconnect
      if (reason !== 'io client disconnect' && reconnectAttemptsRef.current < reconnectAttempts) {
        reconnectAttemptsRef.current++;
        console.log(`Attempting reconnection ${reconnectAttemptsRef.current}/${reconnectAttempts}`);
        
        reconnectTimeoutRef.current = setTimeout(() => {
          connect();
        }, reconnectDelay * reconnectAttemptsRef.current);
      }
    });

    socket.on('connect_error', (error) => {
      console.warn('WebSocket connection error (graceful degradation):', error.message);
      setLastError(`WebSocket unavailable: ${error.message}`);
      setConnectionStatus('disconnected');
      setIsConnected(false);
      // Don't spam reconnection attempts - just log and continue without WebSocket
      console.log('📡 Continuing without WebSocket - real-time features disabled');
    });

    socket.on('error', (error) => {
      console.error('WebSocket error:', error);
      setLastError(error.message || 'Unknown WebSocket error');
    });

    // KPI update handlers
    socket.on('kpi-update', (update: KPIDataUpdate) => {
      console.log('KPI update received:', update);
      // This will be handled by the callback registered via onKPIUpdate
    });

    socket.on('kpi-alert', (alert: KPIThresholdAlert) => {
      console.log('KPI alert received:', alert);
      // This will be handled by the callback registered via onKPIAlert
    });

    socket.on('connection-stats', (stats: ConnectionStats) => {
      console.log('Connection stats received:', stats);
      setConnectionStats(stats);
    });

    socket.on('heartbeat', (data) => {
      console.log('Heartbeat received:', data);
    });

    socket.on('pong', (data) => {
      console.log('Pong received:', data);
    });

  }, [token, tenantId, namespace, reconnectAttempts, reconnectDelay]);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }

    setIsConnected(false);
    setConnectionStatus('disconnected');
    reconnectAttemptsRef.current = reconnectAttempts; // Prevent reconnection
  }, [reconnectAttempts]);

  const subscribeToKPI = useCallback((kpiId?: string, metrics?: string[]) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('subscribe-kpi', { kpiId, metrics });
    }
  }, []);

  const unsubscribeFromKPI = useCallback((kpiId?: string) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('unsubscribe-kpi', { kpiId });
    }
  }, []);

  const onKPIUpdate = useCallback((callback: (update: KPIDataUpdate) => void) => {
    if (socketRef.current) {
      socketRef.current.off('kpi-update');
      socketRef.current.on('kpi-update', callback);
    }
  }, []);

  const onKPIAlert = useCallback((callback: (alert: KPIThresholdAlert) => void) => {
    if (socketRef.current) {
      socketRef.current.off('kpi-alert');
      socketRef.current.on('kpi-alert', callback);
    }
  }, []);

  const onConnectionStats = useCallback((callback: (stats: ConnectionStats) => void) => {
    if (socketRef.current) {
      socketRef.current.off('connection-stats');
      socketRef.current.on('connection-stats', callback);
    }
  }, []);

  const ping = useCallback(() => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('ping');
    }
  }, []);

  // Auto-connect on mount if enabled
  useEffect(() => {
    if (autoConnect && token && tenantId) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [autoConnect, token, tenantId, connect, disconnect]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  return {
    socket: socketRef.current,
    isConnected,
    connectionStatus,
    lastError,
    connectionStats,
    connect,
    disconnect,
    subscribeToKPI,
    unsubscribeFromKPI,
    onKPIUpdate,
    onKPIAlert,
    onConnectionStats,
    ping,
  };
}
