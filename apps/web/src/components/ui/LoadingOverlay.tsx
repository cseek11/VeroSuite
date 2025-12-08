import React from 'react';
import { LoadingSpinner } from '@/components/LoadingSpinner';

export interface LoadingOverlayProps {
  isLoading: boolean;
  text?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  children?: React.ReactNode;
}

/**
 * LoadingOverlay Component
 * 
 * Displays a loading overlay with spinner and optional text.
 * Can be used to overlay content during loading states.
 * 
 * @example
 * <LoadingOverlay isLoading={isLoading} text="Loading customers...">
 *   <CustomerList />
 * </LoadingOverlay>
 * 
 * Last Updated: 2025-11-19
 */
export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  isLoading,
  text,
  size = 'md',
  className = '',
  children,
}) => {
  if (!isLoading) {
    return <>{children}</>;
  }

  return (
    <div className={`relative ${className}`}>
      {children && (
        <div className="opacity-50 pointer-events-none">
          {children}
        </div>
      )}
      <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm z-10">
        <div className="flex flex-col items-center gap-3">
          <LoadingSpinner size={size} />
          {text && (
            <p className="text-sm text-gray-600 font-medium">{text}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoadingOverlay;

