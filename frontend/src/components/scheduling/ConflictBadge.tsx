import React from 'react';
import { AlertTriangle, Clock, User, MapPin } from 'lucide-react';

interface ConflictBadgeProps {
  type: 'time_overlap' | 'technician_double_booking' | 'location_conflict' | 'capacity_warning' | 'skill_mismatch';
  severity: 'low' | 'medium' | 'high' | 'critical';
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const ConflictBadge: React.FC<ConflictBadgeProps> = ({
  type,
  severity,
  className = '',
  size = 'sm'
}) => {
  const sizeClasses = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5'
  };

  const severityColors = {
    critical: 'bg-red-500 text-white',
    high: 'bg-orange-500 text-white',
    medium: 'bg-yellow-500 text-white',
    low: 'bg-blue-500 text-white'
  };

  const getIcon = () => {
    const iconSize = size === 'sm' ? 10 : size === 'md' ? 14 : 16;
    switch (type) {
      case 'time_overlap':
      case 'technician_double_booking':
        return <Clock size={iconSize} />;
      case 'location_conflict':
        return <MapPin size={iconSize} />;
      case 'capacity_warning':
        return <User size={iconSize} />;
      case 'skill_mismatch':
        return <AlertTriangle size={iconSize} />;
      default:
        return <AlertTriangle size={iconSize} />;
    }
  };

  return (
    <div
      className={`inline-flex items-center justify-center rounded-full ${severityColors[severity]} ${sizeClasses[size]} ${className}`}
      title={`${type.replace('_', ' ')} - ${severity}`}
    >
      {getIcon()}
    </div>
  );
};






