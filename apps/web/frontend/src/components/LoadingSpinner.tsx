import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  text?: string;
  className?: string;
  fullScreen?: boolean;
}

/**
 * LoadingSpinner Component
 * 
 * Displays a loading spinner with optional text.
 * Supports multiple sizes and full-screen mode.
 * 
 * @example
 * <LoadingSpinner size="lg" text="Loading..." />
 * <LoadingSpinner fullScreen text="Loading application..." />
 * 
 * Last Updated: 2025-11-19
 */
export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  text,
  className = '',
  fullScreen = false,
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12',
  };

  const containerClasses = fullScreen
    ? 'fixed inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm z-50'
    : `flex items-center justify-center ${className}`;

  return (
    <div className={containerClasses}>
      <div className="flex flex-col items-center gap-3">
        <div role="status" aria-live="polite" aria-label={text || 'Loading'}>
          <Loader2 className={`animate-spin ${sizeClasses[size]} text-purple-600`} aria-hidden="true" />
        </div>
        {text && (
          <span className="text-sm text-gray-600 font-medium">{text}</span>
        )}
      </div>
    </div>
  );
};

export const PageLoader: React.FC<{ text?: string }> = ({ text = 'Loading...' }) => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <LoadingSpinner size="lg" text={text} />
    </div>
  </div>
);
