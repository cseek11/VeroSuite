import React from 'react';
import { AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

export interface ErrorMessageProps {
  message: string;
  type?: 'error' | 'warning' | 'info';
  onDismiss?: () => void;
  actionable?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

/**
 * ErrorMessage Component
 * 
 * Displays user-friendly error, warning, or info messages with consistent styling.
 * Supports dismissible messages and actionable buttons.
 * 
 * @example
 * <ErrorMessage 
 *   message="Failed to save work order" 
 *   type="error"
 *   actionable={{ label: "Retry", onClick: handleRetry }}
 * />
 * 
 * Last Updated: 2025-11-19
 */
export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  type = 'error',
  onDismiss,
  actionable,
  className = '',
}) => {
  const typeStyles = {
    error: {
      container: 'bg-red-50 border-red-200 text-red-800',
      icon: 'text-red-600',
      iconComponent: AlertCircle,
    },
    warning: {
      container: 'bg-yellow-50 border-yellow-200 text-yellow-800',
      icon: 'text-yellow-600',
      iconComponent: AlertTriangle,
    },
    info: {
      container: 'bg-blue-50 border-blue-200 text-blue-800',
      icon: 'text-blue-600',
      iconComponent: Info,
    },
  };

  const styles = typeStyles[type];
  const IconComponent = styles.iconComponent;

  return (
    <div
      className={`flex items-start gap-3 p-4 rounded-lg border ${styles.container} ${className}`}
      role="alert"
      aria-live="polite"
    >
      <IconComponent className={`w-5 h-5 mt-0.5 flex-shrink-0 ${styles.icon}`} aria-hidden="true" />
      
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium">{message}</p>
        
        {actionable && (
          <button
            onClick={actionable.onClick}
            className="mt-2 text-sm font-semibold underline hover:no-underline focus:outline-none focus:ring-2 focus:ring-offset-2 rounded"
            style={{ 
              color: type === 'error' ? '#dc2626' : type === 'warning' ? '#d97706' : '#2563eb' 
            }}
          >
            {actionable.label}
          </button>
        )}
      </div>

      {onDismiss && (
        <button
          onClick={onDismiss}
          className="flex-shrink-0 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 rounded"
          aria-label="Dismiss message"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;

