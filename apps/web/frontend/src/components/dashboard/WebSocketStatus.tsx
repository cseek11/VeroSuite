import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, Activity, AlertTriangle, Users, Clock } from 'lucide-react';
import { useWebSocket } from '@/hooks/useWebSocket';

interface WebSocketStatusProps {
  showStats?: boolean;
  className?: string;
}

export const WebSocketStatus: React.FC<WebSocketStatusProps> = ({
  showStats = false,
  className = ''
}) => {
  const {
    isConnected,
    connectionStatus,
    lastError,
    connectionStats,
    ping,
    connect,
    disconnect: _disconnect
  } = useWebSocket({ autoConnect: true });

  const [pingLatency, _setPingLatency] = useState<number | null>(null);
  const [lastPingTime, setLastPingTime] = useState<number | null>(null);

  // Handle ping with latency measurement
  const handlePing = () => {
    if (isConnected) {
      const startTime = Date.now();
      setLastPingTime(startTime);
      ping();
    }
  };

  // Listen for pong to calculate latency
  useEffect(() => {
    // This would be set up through the useWebSocket hook's onPong callback
    // For now, we'll simulate it
    return () => {
      // Cleanup if needed
    };
  }, [lastPingTime]);

  const getStatusColor = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'text-green-600';
      case 'connecting':
        return 'text-yellow-600';
      case 'disconnected':
        return 'text-gray-500';
      case 'error':
        return 'text-red-600';
      default:
        return 'text-gray-500';
    }
  };

  const getStatusIcon = () => {
    switch (connectionStatus) {
      case 'connected':
        return <Wifi className="w-4 h-4" />;
      case 'connecting':
        return <Activity className="w-4 h-4 animate-pulse" />;
      case 'disconnected':
        return <WifiOff className="w-4 h-4" />;
      case 'error':
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <WifiOff className="w-4 h-4" />;
    }
  };

  const getStatusText = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'Connected';
      case 'connecting':
        return 'Connecting...';
      case 'disconnected':
        return 'Disconnected';
      case 'error':
        return 'Error';
      default:
        return 'Unknown';
    }
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Connection Status */}
      <div className={`flex items-center gap-1 ${getStatusColor()}`}>
        {getStatusIcon()}
        <span className="text-xs font-medium">
          {getStatusText()}
        </span>
      </div>

      {/* Ping Latency */}
      {isConnected && pingLatency && (
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <Clock className="w-3 h-3" />
          <span>{pingLatency}ms</span>
        </div>
      )}

      {/* Connection Stats */}
      {showStats && connectionStats && (
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <Users className="w-3 h-3" />
          <span>{connectionStats.totalClients} clients</span>
          {connectionStats.tenantStats && connectionStats.tenantStats.length > 0 && (
            <span className="ml-1">
              ({connectionStats.tenantStats.length} tenants)
            </span>
          )}
        </div>
      )}

      {/* Error Message */}
      {lastError && (
        <div className="flex items-center gap-1 text-xs text-red-600">
          <AlertTriangle className="w-3 h-3" />
          <span title={lastError}>Error</span>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center gap-1">
        {isConnected ? (
          <button
            onClick={handlePing}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
            title="Ping server"
          >
            <Activity className="w-3 h-3 text-gray-500" />
          </button>
        ) : (
          <button
            onClick={connect}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
            title="Reconnect"
          >
            <Wifi className="w-3 h-3 text-gray-500" />
          </button>
        )}
      </div>
    </div>
  );
};
