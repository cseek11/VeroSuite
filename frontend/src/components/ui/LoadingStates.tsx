/**
 * Loading States Component Library
 * 
 * Provides consistent loading states, skeleton loaders, and progress indicators
 * across the application for better UX during data loading.
 * 
 * @example
 * ```tsx
 * {isLoading ? (
 *   <TableSkeleton rows={5} />
 * ) : (
 *   <Table data={data} />
 * )}
 * ```
 */

import React from 'react';
import { Skeleton } from './CRMComponents';
import Card from './Card';
import { LoadingSpinner } from '@/components/LoadingSpinner';

// ============================================================================
// Skeleton Loaders
// ============================================================================

export interface TableSkeletonProps {
  /**
   * Number of rows to display
   */
  rows?: number;
  /**
   * Number of columns to display
   */
  columns?: number;
  /**
   * Show header row
   */
  showHeader?: boolean;
  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * Table Skeleton Loader
 * 
 * Displays skeleton loading state for tables.
 */
export function TableSkeleton({
  rows = 5,
  columns = 4,
  showHeader = true,
  className = '',
}: TableSkeletonProps) {
  return (
    <div className={`w-full ${className}`}>
      <table className="w-full">
        {showHeader && (
          <thead>
            <tr>
              {Array.from({ length: columns }).map((_, i) => (
                <th key={i} className="px-4 py-3 text-left">
                  <Skeleton className="h-4 w-24" />
                </th>
              ))}
            </tr>
          </thead>
        )}
        <tbody>
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <tr key={rowIndex} className="border-b border-gray-200">
              {Array.from({ length: columns }).map((_, colIndex) => (
                <td key={colIndex} className="px-4 py-3">
                  <Skeleton className="h-4 w-full" />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export interface CardSkeletonProps {
  /**
   * Number of cards to display
   */
  count?: number;
  /**
   * Show image placeholder
   */
  showImage?: boolean;
  /**
   * Show footer
   */
  showFooter?: boolean;
  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * Card Skeleton Loader
 * 
 * Displays skeleton loading state for card components.
 */
export function CardSkeleton({
  count = 3,
  showImage = false,
  showFooter = false,
  className = '',
}: CardSkeletonProps) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i} className="p-4">
          {showImage && <Skeleton className="h-48 w-full mb-4 rounded" />}
          <Skeleton className="h-6 w-3/4 mb-2" />
          <Skeleton className="h-4 w-full mb-1" />
          <Skeleton className="h-4 w-5/6 mb-4" />
          {showFooter && (
            <div className="flex items-center justify-between mt-4 pt-4 border-t">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-8 w-24 rounded" />
            </div>
          )}
        </Card>
      ))}
    </div>
  );
}

export interface ListSkeletonProps {
  /**
   * Number of list items to display
   */
  items?: number;
  /**
   * Show avatar
   */
  showAvatar?: boolean;
  /**
   * Show secondary text
   */
  showSecondary?: boolean;
  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * List Skeleton Loader
 * 
 * Displays skeleton loading state for list components.
 */
export function ListSkeleton({
  items = 5,
  showAvatar = false,
  showSecondary = true,
  className = '',
}: ListSkeletonProps) {
  return (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: items }).map((_, i) => (
        <div key={i} className="flex items-center space-x-3 p-3 border-b border-gray-200">
          {showAvatar && <Skeleton className="h-10 w-10 rounded-full" />}
          <div className="flex-1">
            <Skeleton className="h-4 w-3/4 mb-2" />
            {showSecondary && <Skeleton className="h-3 w-1/2" />}
          </div>
          <Skeleton className="h-8 w-20 rounded" />
        </div>
      ))}
    </div>
  );
}

export interface FormSkeletonProps {
  /**
   * Number of form fields to display
   */
  fields?: number;
  /**
   * Show submit button
   */
  showSubmit?: boolean;
  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * Form Skeleton Loader
 * 
 * Displays skeleton loading state for forms.
 */
export function FormSkeleton({
  fields = 5,
  showSubmit = true,
  className = '',
}: FormSkeletonProps) {
  return (
    <Card className={`p-6 ${className}`}>
      <div className="space-y-4">
        {Array.from({ length: fields }).map((_, i) => (
          <div key={i}>
            <Skeleton className="h-4 w-24 mb-2" />
            <Skeleton className="h-10 w-full rounded" />
          </div>
        ))}
        {showSubmit && (
          <div className="flex justify-end space-x-3 mt-6">
            <Skeleton className="h-10 w-24 rounded" />
            <Skeleton className="h-10 w-24 rounded" />
          </div>
        )}
      </div>
    </Card>
  );
}

// ============================================================================
// Loading Overlays
// ============================================================================

export interface LoadingOverlayProps {
  /**
   * Whether overlay is visible
   */
  isLoading: boolean;
  /**
   * Loading message
   */
  message?: string;
  /**
   * Additional CSS classes
   */
  className?: string;
  /**
   * Show backdrop blur
   */
  blur?: boolean;
}

/**
 * Loading Overlay
 * 
 * Displays a loading overlay on top of content.
 */
export function LoadingOverlay({
  isLoading,
  message = 'Loading...',
  className = '',
  blur = true,
}: LoadingOverlayProps) {
  if (!isLoading) return null;
  
  return (
    <div
      className={`absolute inset-0 flex items-center justify-center ${
        blur ? 'bg-white/80 backdrop-blur-sm' : 'bg-white/90'
      } z-50 ${className}`}
      role="status"
      aria-live="polite"
      aria-label={message}
    >
      <div className="text-center">
        <LoadingSpinner size="lg" />
        {message && <p className="mt-4 text-sm text-gray-600">{message}</p>}
      </div>
    </div>
  );
}

// ============================================================================
// Progress Indicators
// ============================================================================

export interface ProgressIndicatorProps {
  /**
   * Progress percentage (0-100)
   */
  progress: number;
  /**
   * Progress label
   */
  label?: string;
  /**
   * Show percentage
   */
  showPercentage?: boolean;
  /**
   * Additional CSS classes
   */
  className?: string;
  /**
   * Color variant
   */
  variant?: 'default' | 'success' | 'warning' | 'error';
}

/**
 * Progress Indicator
 * 
 * Displays a progress bar for long-running operations.
 */
export function ProgressIndicator({
  progress,
  label,
  showPercentage = true,
  className = '',
  variant = 'default',
}: ProgressIndicatorProps) {
  const clampedProgress = Math.min(100, Math.max(0, progress));
  
  const variantClasses = {
    default: 'bg-purple-600',
    success: 'bg-green-600',
    warning: 'bg-yellow-600',
    error: 'bg-red-600',
  };
  
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">{label}</span>
          {showPercentage && (
            <span className="text-sm text-gray-600">{Math.round(clampedProgress)}%</span>
          )}
        </div>
      )}
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all duration-300 ${variantClasses[variant]}`}
          style={{ width: `${clampedProgress}%` }}
          role="progressbar"
          aria-valuenow={clampedProgress}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={label || 'Progress'}
        />
      </div>
    </div>
  );
}

// ============================================================================
// Inline Loading States
// ============================================================================

export interface InlineLoadingProps {
  /**
   * Loading message
   */
  message?: string;
  /**
   * Size of spinner
   */
  size?: 'sm' | 'md' | 'lg';
  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * Inline Loading State
 * 
 * Displays an inline loading spinner with optional message.
 */
export function InlineLoading({
  message,
  size = 'md',
  className = '',
}: InlineLoadingProps) {
  return (
    <div className={`flex items-center justify-center py-8 ${className}`}>
      <div className="text-center">
        <LoadingSpinner size={size} />
        {message && <p className="mt-3 text-sm text-gray-600">{message}</p>}
      </div>
    </div>
  );
}

// ============================================================================
// Loading State Wrapper
// ============================================================================

export interface LoadingStateWrapperProps {
  /**
   * Whether content is loading
   */
  isLoading: boolean;
  /**
   * Loading skeleton component
   */
  skeleton?: React.ReactNode;
  /**
   * Loading message
   */
  loadingMessage?: string;
  /**
   * Content to display when not loading
   */
  children: React.ReactNode;
  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * Loading State Wrapper
 * 
 * Wraps content and shows loading state when isLoading is true.
 */
export function LoadingStateWrapper({
  isLoading,
  skeleton,
  loadingMessage = 'Loading...',
  children,
  className = '',
}: LoadingStateWrapperProps) {
  if (isLoading) {
    return (
      <div className={className}>
        {skeleton || <InlineLoading message={loadingMessage} />}
      </div>
    );
  }
  
  return <div className={className}>{children}</div>;
}

