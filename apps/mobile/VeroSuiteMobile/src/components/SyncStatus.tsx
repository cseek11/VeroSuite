// ============================================================================
// VeroField Mobile App - Sync Status Component
// ============================================================================

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import offlineService from '../services/offlineService';

interface SyncStatusProps {
  style?: any;
}

const SyncStatus: React.FC<SyncStatusProps> = ({ style }) => {
  const [syncStatus, setSyncStatus] = useState({
    pendingUploads: 0,
    pendingJobs: 0,
    lastSync: new Date().toISOString(),
    isOnline: false,
  });
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    loadSyncStatus();
    
    // Update sync status every 30 seconds
    const interval = setInterval(loadSyncStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadSyncStatus = async () => {
    try {
      const status = await offlineService.getSyncStatus();
      setSyncStatus(status);
    } catch (error) {
      console.error('Error loading sync status:', error);
    }
  };

  const handleForceSync = async () => {
    if (!syncStatus.isOnline) {
      return;
    }

    setIsRefreshing(true);
    try {
      await offlineService.forceSyncAll();
      await loadSyncStatus();
    } catch (error) {
      console.error('Error during force sync:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const formatLastSync = (timestamp: string): string => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
    return date.toLocaleDateString();
  };

  const getTotalPending = () => {
    return syncStatus.pendingUploads + syncStatus.pendingJobs;
  };

  const getStatusColor = () => {
    if (!syncStatus.isOnline) return '#EF4444'; // Red - offline
    if (getTotalPending() > 0) return '#F59E0B'; // Amber - pending
    return '#10B981'; // Green - synced
  };

  const getStatusText = () => {
    if (!syncStatus.isOnline) return 'Offline';
    if (getTotalPending() > 0) return `${getTotalPending()} pending`;
    return 'Synced';
  };

  const getStatusIcon = () => {
    if (!syncStatus.isOnline) return '📴';
    if (getTotalPending() > 0) return '⏳';
    return '✅';
  };

  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={handleForceSync}
      disabled={!syncStatus.isOnline || isRefreshing}
    >
      <View style={styles.content}>
        <View style={styles.statusRow}>
          <Text style={styles.statusIcon}>{getStatusIcon()}</Text>
          <View style={styles.statusInfo}>
            <Text style={[styles.statusText, { color: getStatusColor() }]}>
              {getStatusText()}
            </Text>
            <Text style={styles.lastSyncText}>
              Last sync: {formatLastSync(syncStatus.lastSync)}
            </Text>
          </View>
          {isRefreshing && (
            <ActivityIndicator size="small" color={getStatusColor()} />
          )}
        </View>
        
        {getTotalPending() > 0 && (
          <View style={styles.pendingDetails}>
            {syncStatus.pendingUploads > 0 && (
              <Text style={styles.pendingText}>
                📁 {syncStatus.pendingUploads} files to upload
              </Text>
            )}
            {syncStatus.pendingJobs > 0 && (
              <Text style={styles.pendingText}>
                📋 {syncStatus.pendingJobs} jobs to sync
              </Text>
            )}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  content: {
    gap: 8,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusIcon: {
    fontSize: 16,
  },
  statusInfo: {
    flex: 1,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
  },
  lastSyncText: {
    fontSize: 12,
    color: '#6B7280',
  },
  pendingDetails: {
    gap: 4,
  },
  pendingText: {
    fontSize: 12,
    color: '#6B7280',
  },
});

export default SyncStatus;
