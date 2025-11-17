import { useState, useCallback, useEffect, useRef } from 'react';
import { DashboardLayout } from './useDashboardLayout';
import { logger } from '@/utils/logger';

export interface CollaborationUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  color: string;
  cursor?: { x: number; y: number };
  lastSeen: number;
  isActive: boolean;
}

export interface CollaborationEvent {
  type: 'layout_update' | 'cursor_move' | 'card_select' | 'user_join' | 'user_leave';
  userId: string;
  timestamp: number;
  data: any;
}

const USER_COLORS = [
  '#3B82F6', '#EF4444', '#10B981', '#F59E0B', 
  '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16'
];

// Simulated WebSocket for demo purposes
class MockWebSocket {
  private listeners: { [key: string]: Array<(data: unknown) => void> } = {};
  private isConnected = false;

  connect() {
    this.isConnected = true;
    setTimeout(() => {
      this.emit('open', {});
    }, 100);
  }

  disconnect() {
    this.isConnected = false;
    this.emit('close', {});
  }

  send(data: string) {
    if (!this.isConnected) return;
    
    // Simulate network delay
    setTimeout(() => {
      // Echo back to simulate other users (for demo)
      this.emit('message', { data });
    }, 50 + Math.random() * 100);
  }

  on(event: string, callback: (data: unknown) => void) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }

  off(event: string, callback: (data: unknown) => void) {
    if (this.listeners[event]) {
      this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
    }
  }

  private emit(event: string, data: unknown) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(callback => callback(data));
    }
  }
}

export function useRealtimeCollaboration(dashboardId: string, currentUser: any) {
  const [isConnected, setIsConnected] = useState(false);
  const [collaborators, setCollaborators] = useState<Record<string, CollaborationUser>>({});
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('disconnected');
  
  const wsRef = useRef<MockWebSocket | null>(null);
  const userColor = useRef(USER_COLORS[Math.floor(Math.random() * USER_COLORS.length)]);

  // Initialize WebSocket connection
  const connect = useCallback(() => {
    if (wsRef.current) return;

    setConnectionStatus('connecting');
    wsRef.current = new MockWebSocket();

    wsRef.current.on('open', () => {
      setIsConnected(true);
      setConnectionStatus('connected');
      
      // Announce user joining
      const joinEvent: CollaborationEvent = {
        type: 'user_join',
        userId: currentUser?.id || 'anonymous',
        timestamp: Date.now(),
        data: {
          name: currentUser?.name || 'Anonymous User',
          email: currentUser?.email || '',
          color: userColor.current
        }
      };
      
      wsRef.current?.send(JSON.stringify(joinEvent));
    });

    wsRef.current.on('close', () => {
      setIsConnected(false);
      setConnectionStatus('disconnected');
      setCollaborators({});
    });

    wsRef.current.on('message', (event: { data: string }) => {
      try {
        const collaborationEvent: CollaborationEvent = JSON.parse(event.data);
        handleCollaborationEvent(collaborationEvent);
      } catch (error: unknown) {
        logger.error('Failed to parse collaboration event', error, 'useRealtimeCollaboration');
      }
    });

    wsRef.current.connect();
  }, [currentUser]);

  // Disconnect from collaboration
  const disconnect = useCallback(() => {
    if (wsRef.current) {
      // Announce user leaving
      try {
        const leaveEvent: CollaborationEvent = {
          type: 'user_leave',
          userId: currentUser?.id || 'anonymous',
          timestamp: Date.now(),
          data: {}
        };
        
        wsRef.current.send(JSON.stringify(leaveEvent));
      } catch (error: unknown) {
        logger.warn('Failed to send leave event', { error }, 'useRealtimeCollaboration');
      }
      
      // Clean up the connection
      wsRef.current.disconnect();
      wsRef.current = null;
    }
    
    // Reset state
    setIsConnected(false);
    setConnectionStatus('disconnected');
    setCollaborators({});
  }, [currentUser]);

  // Handle incoming collaboration events
  const handleCollaborationEvent = useCallback((event: CollaborationEvent) => {
    // Don't process our own events
    if (event.userId === currentUser?.id) return;

    switch (event.type) {
      case 'user_join':
        setCollaborators(prev => ({
          ...prev,
          [event.userId]: {
            id: event.userId,
            name: event.data.name,
            email: event.data.email,
            color: event.data.color,
            lastSeen: event.timestamp,
            isActive: true
          }
        }));
        break;

      case 'user_leave':
        setCollaborators(prev => {
          const updated = { ...prev };
          delete updated[event.userId];
          return updated;
        });
        break;

      case 'cursor_move':
        setCollaborators(prev => ({
          ...prev,
          [event.userId]: {
            ...prev[event.userId],
            cursor: event.data.cursor,
            lastSeen: event.timestamp,
            isActive: true
          }
        }));
        break;

      case 'layout_update':
        // Handle layout updates from other users
        // This would trigger a layout merge/conflict resolution
        if (process.env.NODE_ENV === 'development') {
          logger.debug('Layout update from user', { userId: event.userId, data: event.data }, 'useRealtimeCollaboration');
        }
        break;

      case 'card_select':
        // Handle card selection from other users
        if (process.env.NODE_ENV === 'development') {
          logger.debug('Card selection from user', { userId: event.userId, data: event.data }, 'useRealtimeCollaboration');
        }
        break;
    }
  }, [currentUser]);

  // Broadcast layout change
  const broadcastLayoutUpdate = useCallback((layout: DashboardLayout) => {
    if (!wsRef.current || !isConnected) return;

    const event: CollaborationEvent = {
      type: 'layout_update',
      userId: currentUser?.id || 'anonymous',
      timestamp: Date.now(),
      data: { layout }
    };

    wsRef.current.send(JSON.stringify(event));
  }, [isConnected, currentUser]);

  // Broadcast cursor movement
  const broadcastCursorMove = useCallback((x: number, y: number) => {
    if (!wsRef.current || !isConnected) return;

    const event: CollaborationEvent = {
      type: 'cursor_move',
      userId: currentUser?.id || 'anonymous',
      timestamp: Date.now(),
      data: { cursor: { x, y } }
    };

    wsRef.current.send(JSON.stringify(event));
  }, [isConnected, currentUser]);

  // Broadcast card selection
  const broadcastCardSelection = useCallback((cardIds: string[]) => {
    if (!wsRef.current || !isConnected) return;

    const event: CollaborationEvent = {
      type: 'card_select',
      userId: currentUser?.id || 'anonymous',
      timestamp: Date.now(),
      data: { selectedCards: cardIds }
    };

    wsRef.current.send(JSON.stringify(event));
  }, [isConnected, currentUser]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  // Auto-connect when user is available (but not if manually disconnected)
  useEffect(() => {
    if (currentUser && !isConnected && connectionStatus === 'disconnected' && !wsRef.current) {
      connect();
    }
  }, [currentUser, isConnected, connectionStatus, connect]);

  return {
    isConnected,
    connectionStatus,
    collaborators,
    connect,
    disconnect,
    broadcastLayoutUpdate,
    broadcastCursorMove,
    broadcastCardSelection,
    userColor: userColor.current
  };
}
