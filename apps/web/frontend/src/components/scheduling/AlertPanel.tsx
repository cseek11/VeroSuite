import { useState } from 'react';
import { AlertTriangle, X, ChevronDown, ChevronUp, Clock, User, MapPin } from 'lucide-react';

export interface Alert {
  id: string;
  type: 'conflict' | 'overdue' | 'capacity' | 'skill_mismatch' | 'route_optimization';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  jobId?: string;
  jobTitle?: string;
  timestamp: Date;
  onClick?: () => void;
}

interface AlertPanelProps {
  alerts: Alert[];
  onAlertClick?: (alert: Alert) => void;
  onDismiss?: (alertId: string) => void;
  className?: string;
}

export const AlertPanel: React.FC<AlertPanelProps> = ({
  alerts,
  onAlertClick,
  onDismiss,
  className = ''
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [dismissedAlerts, setDismissedAlerts] = useState<Set<string>>(new Set());

  const visibleAlerts = alerts.filter(alert => !dismissedAlerts.has(alert.id));

  const criticalCount = visibleAlerts.filter(a => a.severity === 'critical').length;
  const warningCount = visibleAlerts.filter(a => a.severity === 'high' || a.severity === 'medium').length;
  const infoCount = visibleAlerts.filter(a => a.severity === 'low').length;

  const getSeverityColor = (severity: string): string => {
    switch (severity) {
      case 'critical': return 'bg-red-50 border-red-200 text-red-800';
      case 'high': return 'bg-orange-50 border-orange-200 text-orange-800';
      case 'medium': return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'low': return 'bg-blue-50 border-blue-200 text-blue-800';
      default: return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'conflict':
        return <Clock className="h-4 w-4" />;
      case 'overdue':
        return <AlertTriangle className="h-4 w-4" />;
      case 'capacity':
        return <User className="h-4 w-4" />;
      case 'skill_mismatch':
        return <AlertTriangle className="h-4 w-4" />;
      case 'route_optimization':
        return <MapPin className="h-4 w-4" />;
      default:
        return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const handleDismiss = (alertId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setDismissedAlerts(prev => new Set(prev).add(alertId));
    onDismiss?.(alertId);
  };

  if (visibleAlerts.length === 0) {
    return null;
  }

  return (
    <div className={`border-t border-gray-200 bg-white ${className}`}>
      {/* Header */}
      <div
        className="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-orange-500" />
          <span className="font-semibold text-gray-700">
            Alerts ({visibleAlerts.length})
          </span>
          {criticalCount > 0 && (
            <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">
              🔴 {criticalCount} critical
            </span>
          )}
          {warningCount > 0 && (
            <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-700">
              🟡 {warningCount} warnings
            </span>
          )}
          {infoCount > 0 && (
            <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
              ℹ️ {infoCount} info
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {isExpanded ? (
            <ChevronDown className="h-4 w-4 text-gray-500" />
          ) : (
            <ChevronUp className="h-4 w-4 text-gray-500" />
          )}
        </div>
      </div>

      {/* Alerts List */}
      {isExpanded && (
        <div className="max-h-64 overflow-y-auto">
          {visibleAlerts
            .sort((a, b) => {
              const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
              return severityOrder[a.severity] - severityOrder[b.severity];
            })
            .map(alert => (
              <div
                key={alert.id}
                className={`border-b border-gray-100 p-3 cursor-pointer hover:bg-gray-50 transition-colors ${getSeverityColor(alert.severity)}`}
                onClick={() => {
                  onAlertClick?.(alert);
                  alert.onClick?.();
                }}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex-shrink-0">
                    {getTypeIcon(alert.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm">{alert.message}</span>
                      <span className={`text-xs px-1.5 py-0.5 rounded capitalize ${getSeverityColor(alert.severity)}`}>
                        {alert.severity}
                      </span>
                    </div>
                    {alert.jobTitle && (
                      <div className="text-xs text-gray-600 truncate">
                        Job: {alert.jobTitle}
                      </div>
                    )}
                    <div className="text-xs text-gray-500 mt-1">
                      {alert.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                  <button
                    onClick={(e) => handleDismiss(alert.id, e)}
                    className="flex-shrink-0 p-1 hover:bg-gray-200 rounded transition-colors"
                    title="Dismiss alert"
                  >
                    <X className="h-4 w-4 text-gray-500" />
                  </button>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};






