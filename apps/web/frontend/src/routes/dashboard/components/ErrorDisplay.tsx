/**
 * Error display component for card operations
 * Shows user-visible errors with retry options
 */

import React from 'react';
import { X, AlertCircle, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CardOperationError } from '../hooks/useErrorHandling';

interface ErrorDisplayProps {
  errors: CardOperationError[];
  onDismiss: (errorId: string) => void;
  onRetry: (errorId: string) => void;
  className?: string;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  errors,
  onDismiss,
  onRetry,
  className,
}) => {
  if (errors.length === 0) return null;

  return (
    <div className={cn('fixed top-4 right-4 z-50 space-y-2 max-w-md', className)}>
      {errors.map((error) => (
        <div
          key={error.id}
          className="bg-red-50 border border-red-200 rounded-lg shadow-lg p-4 animate-in slide-in-from-right"
        >
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <h4 className="text-sm font-semibold text-red-900">
                  {error.operation.charAt(0).toUpperCase() + error.operation.slice(1)} Failed
                </h4>
                <button
                  onClick={() => onDismiss(error.id)}
                  className="text-red-400 hover:text-red-600 transition-colors flex-shrink-0"
                  aria-label="Dismiss error"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="text-sm text-red-700 mt-1">{error.message}</p>
              {error.retryable && (
                <div className="mt-3 flex items-center gap-2">
                  <button
                    onClick={() => {
                      // Retry operation - parent will get stored operation from error handling
                      onRetry(error.id);
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-700 bg-red-100 hover:bg-red-200 rounded-md transition-colors"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    Retry {error.retryCount > 0 && `(${error.retryCount})`}
                  </button>
                  <span className="text-xs text-red-600">
                    {error.retryCount >= 3 ? 'Max retries reached' : ''}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

