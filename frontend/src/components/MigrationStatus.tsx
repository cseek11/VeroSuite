import React, { useState } from 'react';
import { getFeatureFlags, enableEmergencyRollback, clearEmergencyRollback, isEmergencyRollbackActive } from '@/lib/featureFlags';
import { useAuthStore } from '@/stores/auth';
import { Alert, Button, Card, Typography } from '@/components/ui/EnhancedUI';
import { AlertTriangle, CheckCircle, Settings, RefreshCw, Shield } from 'lucide-react';

interface MigrationStatusProps {
  showDetails?: boolean;
}

export default function MigrationStatus({ showDetails = false }: MigrationStatusProps) {
  const [isExpanded, setIsExpanded] = useState(showDetails);
  const user = useAuthStore((s) => s.user);
  const flags = getFeatureFlags();
  const emergencyRollback = isEmergencyRollbackActive();

  const handleEmergencyRollback = () => {
    if (confirm('🚨 Are you sure you want to enable emergency rollback? This will disable all V4 features immediately.')) {
      enableEmergencyRollback();
    }
  };

  const handleClearRollback = () => {
    if (confirm('✅ Are you sure you want to clear emergency rollback? This will re-enable V4 features.')) {
      clearEmergencyRollback();
      window.location.reload();
    }
  };

  const getStatusColor = () => {
    if (emergencyRollback) return 'red';
    if (flags.V4_ROLLOUT_PERCENTAGE === 100) return 'green';
    if (flags.V4_ROLLOUT_PERCENTAGE > 0) return 'yellow';
    return 'gray';
  };

  const getStatusText = () => {
    if (emergencyRollback) return 'Emergency Rollback Active';
    if (flags.V4_ROLLOUT_PERCENTAGE === 100) return 'V4 Migration Complete';
    if (flags.V4_ROLLOUT_PERCENTAGE > 0) return 'V4 Migration In Progress';
    return 'V4 Migration Pending';
  };

  const getStatusIcon = () => {
    if (emergencyRollback) return <AlertTriangle className="h-5 w-5" />;
    if (flags.V4_ROLLOUT_PERCENTAGE === 100) return <CheckCircle className="h-5 w-5" />;
    if (flags.V4_ROLLOUT_PERCENTAGE > 0) return <RefreshCw className="h-5 w-5" />;
    return <Settings className="h-5 w-5" />;
  };

  // Only show in development or if explicitly requested
  if (!import.meta.env.DEV && !showDetails) {
    return null;
  }

  return (
    <Card className="mb-4">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-3">
          <div className={`text-${getStatusColor()}-500`}>
            {getStatusIcon()}
          </div>
          <div>
            <Typography variant="h6" className="text-gray-900">
              {getStatusText()}
            </Typography>
            <Typography variant="body2" className="text-gray-600">
              V4 Layout Migration Status
            </Typography>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? 'Hide' : 'Details'}
          </Button>
          
          {emergencyRollback ? (
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearRollback}
              className="text-green-600 border-green-600 hover:bg-green-50"
            >
              <Shield className="h-4 w-4 mr-1" />
              Clear Rollback
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={handleEmergencyRollback}
              className="text-red-600 border-red-600 hover:bg-red-50"
            >
              <AlertTriangle className="h-4 w-4 mr-1" />
              Emergency Rollback
            </Button>
          )}
        </div>
      </div>

      {isExpanded && (
        <div className="border-t border-gray-200 p-4 space-y-4">
          {/* Feature Flags Status */}
          <div>
            <Typography variant="h6" className="text-gray-900 mb-3">
              Feature Flags
            </Typography>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {Object.entries(flags).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="text-sm font-medium text-gray-700">{key}</span>
                  <span className={`text-sm px-2 py-1 rounded ${
                    typeof value === 'boolean' 
                      ? (value ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800')
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {String(value)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* User Information */}
          <div>
            <Typography variant="h6" className="text-gray-900 mb-3">
              User Information
            </Typography>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">User ID:</span>
                <span className="text-sm font-medium">{user?.id || 'Not logged in'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">V4 Rollout Eligible:</span>
                <span className={`text-sm font-medium ${
                  flags.V4_ROLLOUT_PERCENTAGE >= 100 ? 'text-green-600' : 'text-yellow-600'
                }`}>
                  {flags.V4_ROLLOUT_PERCENTAGE >= 100 ? 'Yes (100%)' : `${flags.V4_ROLLOUT_PERCENTAGE}%`}
                </span>
              </div>
            </div>
          </div>

          {/* Migration Progress */}
          <div>
            <Typography variant="h6" className="text-gray-900 mb-3">
              Migration Progress
            </Typography>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">V4 Layout</span>
                <div className={`w-3 h-3 rounded-full ${
                  flags.V4_LAYOUT ? 'bg-green-500' : 'bg-red-500'
                }`} />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">V4 Dashboard</span>
                <div className={`w-3 h-3 rounded-full ${
                  flags.V4_DASHBOARD ? 'bg-green-500' : 'bg-red-500'
                }`} />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">V4 Scheduler</span>
                <div className={`w-3 h-3 rounded-full ${
                  flags.V4_SCHEDULER ? 'bg-green-500' : 'bg-red-500'
                }`} />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Unified Scheduler</span>
                <div className={`w-3 h-3 rounded-full ${
                  flags.UNIFIED_SCHEDULER ? 'bg-green-500' : 'bg-yellow-500'
                }`} />
              </div>
            </div>
          </div>

          {/* Emergency Controls */}
          {emergencyRollback && (
            <Alert type="danger">
              <Typography variant="body2">
                <strong>Emergency Rollback Active:</strong> All V4 features have been disabled due to detected issues. 
                This is a safety measure to prevent data loss or system instability.
              </Typography>
            </Alert>
          )}
        </div>
      )}
    </Card>
  );
}
