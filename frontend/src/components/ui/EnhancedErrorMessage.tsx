/**
 * Enhanced Error Message Component
 * 
 * Provides user-friendly error messages with retry functionality,
 * better context, and actionable suggestions.
 * 
 * Features:
 * - User-friendly error message mapping
 * - Automatic error suggestions based on error type
 * - Retry functionality with loading states
 * - Severity levels (error, warning, info)
 * - Dismissible errors
 * - Technical details toggle for debugging
 * - ARIA labels for accessibility
 * - Responsive design
 * 
 * @example
 * ```tsx
 * <EnhancedErrorMessage
 *   error={error}
 *   onRetry={() => refetch()}
 *   context="Failed to load customers"
 * />
 * ```
 * 
 * @example
 * ```tsx
 * <EnhancedErrorMessage
 *   error={error}
 *   severity="warning"
 *   dismissible
 *   onDismiss={() => setError(null)}
 *   suggestions={['Check your connection', 'Try again later']}
 * />
 * ```
 */

import React, { memo } from 'react';
import { AlertCircle, RefreshCw, X, Info, AlertTriangle, HelpCircle } from 'lucide-react';
import Button from './Button';
import Card from './Card';

export interface EnhancedErrorMessageProps {
  /**
   * The error object or error message string
   */
  error: Error | string | unknown;
  /**
   * Callback function to retry the failed operation
   */
  onRetry?: () => void | Promise<void>;
  /**
   * Context description of what operation failed
   */
  context?: string;
  /**
   * Additional suggestions for resolving the error
   */
  suggestions?: string[];
  /**
   * Error severity level
   */
  severity?: 'error' | 'warning' | 'info';
  /**
   * Whether to show retry button
   */
  showRetry?: boolean;
  /**
   * Whether the error can be dismissed
   */
  dismissible?: boolean;
  /**
   * Callback when error is dismissed
   */
  onDismiss?: () => void;
  /**
   * Additional CSS classes
   */
  className?: string;
  /**
   * Whether to show full error details (for debugging)
   */
  showDetails?: boolean;
}

/**
 * Extract error message from various error types
 */
function getErrorMessage(error: Error | string | unknown): string {
  if (typeof error === 'string') {
    return error;
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  if (error && typeof error === 'object' && 'message' in error) {
    return String((error as { message: unknown }).message);
  }
  
  return 'An unexpected error occurred';
}

/**
 * Get user-friendly error message
 */
function getUserFriendlyMessage(error: Error | string | unknown): string {
  const message = getErrorMessage(error);
  
  // Map common error messages to user-friendly versions
  const errorMap: Record<string, string> = {
    'network error': 'Unable to connect to the server. Please check your internet connection.',
    'failed to fetch': 'Unable to connect to the server. Please check your internet connection.',
    'timeout': 'The request took too long. Please try again.',
    'unauthorized': 'You are not authorized to perform this action. Please log in again.',
    'forbidden': 'You do not have permission to access this resource.',
    'not found': 'The requested resource was not found.',
    'internal server error': 'A server error occurred. Please try again later.',
    'bad request': 'Invalid request. Please check your input and try again.',
    'validation error': 'Please check your input and try again.',
    'database error': 'A database error occurred. Please try again later.',
  };
  
  const messageLower = message.toLowerCase();
  for (const [key, value] of Object.entries(errorMap)) {
    if (messageLower.includes(key)) {
      return value;
    }
  }
  
  return message;
}

/**
 * Get error suggestions based on error type
 */
function getErrorSuggestions(error: Error | string | unknown): string[] {
  const message = getErrorMessage(error).toLowerCase();
  const suggestions: string[] = [];
  
  if (message.includes('network') || message.includes('fetch') || message.includes('connection')) {
    suggestions.push('Check your internet connection');
    suggestions.push('Verify the server is running');
    suggestions.push('Try refreshing the page');
  } else if (message.includes('timeout')) {
    suggestions.push('The server may be busy. Please try again in a moment');
    suggestions.push('Check your internet connection speed');
  } else if (message.includes('unauthorized') || message.includes('forbidden')) {
    suggestions.push('Try logging out and logging back in');
    suggestions.push('Contact your administrator if the problem persists');
  } else if (message.includes('not found')) {
    suggestions.push('The resource may have been deleted');
    suggestions.push('Try navigating back to the previous page');
  } else if (message.includes('validation') || message.includes('invalid')) {
    suggestions.push('Check that all required fields are filled');
    suggestions.push('Verify that all input values are correct');
  } else {
    suggestions.push('Try refreshing the page');
    suggestions.push('If the problem persists, contact support');
  }
  
  return suggestions;
}

/**
 * Get error icon based on severity
 */
function getErrorIcon(severity: 'error' | 'warning' | 'info') {
  switch (severity) {
    case 'error':
      return AlertCircle;
    case 'warning':
      return AlertTriangle;
    case 'info':
      return Info;
    default:
      return AlertCircle;
  }
}

/**
 * Get error color classes based on severity
 */
function getErrorColorClasses(severity: 'error' | 'warning' | 'info') {
  switch (severity) {
    case 'error':
      return {
        bg: 'bg-red-50',
        border: 'border-red-200',
        text: 'text-red-800',
        icon: 'text-red-600',
        button: 'bg-red-600 hover:bg-red-700',
      };
    case 'warning':
      return {
        bg: 'bg-yellow-50',
        border: 'border-yellow-200',
        text: 'text-yellow-800',
        icon: 'text-yellow-600',
        button: 'bg-yellow-600 hover:bg-yellow-700',
      };
    case 'info':
      return {
        bg: 'bg-blue-50',
        border: 'border-blue-200',
        text: 'text-blue-800',
        icon: 'text-blue-600',
        button: 'bg-blue-600 hover:bg-blue-700',
      };
    default:
      return {
        bg: 'bg-red-50',
        border: 'border-red-200',
        text: 'text-red-800',
        icon: 'text-red-600',
        button: 'bg-red-600 hover:bg-red-700',
      };
  }
}

/**
 * Enhanced Error Message Component
 * 
 * Displays user-friendly error messages with retry functionality,
 * context, and actionable suggestions.
 */
function EnhancedErrorMessage({
  error,
  onRetry,
  context,
  suggestions,
  severity = 'error',
  showRetry = true,
  dismissible = false,
  onDismiss,
  className = '',
  showDetails = false,
}: EnhancedErrorMessageProps) {
  const userMessage = getUserFriendlyMessage(error);
  const errorMessage = getErrorMessage(error);
  const defaultSuggestions = getErrorSuggestions(error);
  const displaySuggestions = suggestions || defaultSuggestions;
  
  const Icon = getErrorIcon(severity);
  const colors = getErrorColorClasses(severity);
  
  const [isRetrying, setIsRetrying] = React.useState(false);
  
  const handleRetry = async () => {
    if (!onRetry || isRetrying) return;
    
    setIsRetrying(true);
    try {
      await onRetry();
    } catch (retryError) {
      // Error will be handled by parent component
    } finally {
      setIsRetrying(false);
    }
  };
  
  return (
    <Card
      className={`${colors.bg} ${colors.border} border-2 ${className}`}
      role="alert"
      aria-live="assertive"
    >
      <div className="p-4">
        <div className="flex items-start">
          {/* Icon */}
          <div className="flex-shrink-0">
            <Icon className={`w-5 h-5 ${colors.icon}`} aria-hidden="true" />
          </div>
          
          {/* Content */}
          <div className="ml-3 flex-1">
            {/* Context */}
            {context && (
              <h3 className={`text-sm font-medium ${colors.text} mb-1`}>
                {context}
              </h3>
            )}
            
            {/* Error Message */}
            <p className={`text-sm ${colors.text}`}>
              {userMessage}
            </p>
            
            {/* Suggestions */}
            {displaySuggestions.length > 0 && (
              <div className="mt-3">
                <p className={`text-xs font-medium ${colors.text} mb-2`}>
                  Suggestions:
                </p>
                <ul className="list-disc list-inside space-y-1">
                  {displaySuggestions.map((suggestion, index) => (
                    <li key={index} className={`text-xs ${colors.text} opacity-90`}>
                      {suggestion}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {/* Error Details (for debugging) */}
            {showDetails && errorMessage !== userMessage && (
              <details className="mt-3">
                <summary className={`text-xs ${colors.text} cursor-pointer hover:underline`}>
                  Technical Details
                </summary>
                <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto">
                  {errorMessage}
                </pre>
              </details>
            )}
            
            {/* Actions */}
            <div className="mt-4 flex items-center space-x-3">
              {showRetry && onRetry && (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleRetry}
                  disabled={isRetrying}
                  icon={RefreshCw}
                  className={colors.button}
                >
                  {isRetrying ? 'Retrying...' : 'Retry'}
                </Button>
              )}
              
              {dismissible && onDismiss && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onDismiss}
                  icon={X}
                >
                  Dismiss
                </Button>
              )}
            </div>
          </div>
          
          {/* Dismiss Button (top right) */}
          {dismissible && onDismiss && (
            <button
              type="button"
              onClick={onDismiss}
              className={`ml-4 flex-shrink-0 ${colors.text} hover:opacity-75 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 rounded`}
              aria-label="Dismiss error"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </Card>
  );
}

export default memo(EnhancedErrorMessage);
