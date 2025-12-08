import React, { useState, useEffect } from 'react';
import { Loader2, AlertCircle, Wifi, WifiOff } from 'lucide-react';

interface TemplateLoadingIndicatorProps {
  isLoading: boolean;
  error: string | null;
  templatesCount: number;
  onRetry: () => void;
  onDismiss: () => void;
  canRetry: boolean;
  autoHideDelay?: number; // Delay in milliseconds before auto-hiding success indicator
}

export const TemplateLoadingIndicator: React.FC<TemplateLoadingIndicatorProps> = ({
  isLoading,
  error,
  templatesCount,
  onRetry,
  onDismiss,
  canRetry,
  autoHideDelay = 3000 // Default 3 seconds
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [countdown, setCountdown] = useState(0);

  // Auto-hide success indicator after delay with fade-out animation
  useEffect(() => {
    if (!isLoading && !error && templatesCount > 0) {
      // Start countdown
      setCountdown(Math.ceil(autoHideDelay / 1000));
      
      const countdownInterval = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(countdownInterval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      const timer = setTimeout(() => {
        setIsFadingOut(true);
        // Hide completely after fade animation
        setTimeout(() => {
          setIsVisible(false);
        }, 300); // Match the CSS transition duration
      }, autoHideDelay);

      return () => {
        clearTimeout(timer);
        clearInterval(countdownInterval);
      };
    }
    return undefined;
  }, [isLoading, error, templatesCount, autoHideDelay]);

  // Reset visibility when loading starts or error occurs
  useEffect(() => {
    if (isLoading || error) {
      setIsVisible(true);
      setIsFadingOut(false);
      setCountdown(0);
    }
  }, [isLoading, error]);

  // Don't render if not visible
  if (!isVisible) {
    return null;
  }
  if (isLoading) {
    return (
      <div className={`fixed top-4 right-4 bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-40 max-w-sm transition-all duration-300 ${
        isFadingOut ? 'opacity-0 transform translate-x-full' : 'opacity-100 transform translate-x-0'
      }`}>
        <div className="flex items-center gap-3">
          <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
          <div>
            <p className="text-sm font-medium text-gray-900">Loading Templates</p>
            <p className="text-xs text-gray-500">Fetching KPI templates...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`fixed top-4 right-4 bg-white rounded-lg shadow-lg border border-red-200 p-4 z-40 max-w-sm transition-all duration-300 ${
        isFadingOut ? 'opacity-0 transform translate-x-full' : 'opacity-100 transform translate-x-0'
      }`}>
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">Template Loading Failed</p>
            <p className="text-xs text-gray-600 mb-2">{error}</p>
            <div className="flex gap-2">
              {canRetry && (
                <button
                  onClick={onRetry}
                  className="text-xs px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                >
                  Retry
                </button>
              )}
              <button
                onClick={onDismiss}
                className="text-xs px-2 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (templatesCount > 0) {
    return (
      <div className={`fixed top-4 right-4 bg-white rounded-lg shadow-lg border border-green-200 p-4 z-40 max-w-sm transition-all duration-300 ${
        isFadingOut ? 'opacity-0 transform translate-x-full' : 'opacity-100 transform translate-x-0'
      }`}>
        <div className="flex items-center gap-3">
          <Wifi className="w-5 h-5 text-green-500" />
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">Templates Loaded</p>
            <p className="text-xs text-gray-500">
              {templatesCount} templates available
              {countdown > 0 && (
                <span className="ml-2 text-blue-500 font-medium">
                  • Auto-hide in {countdown}s
                </span>
              )}
            </p>
          </div>
          <button
            onClick={onDismiss}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            title="Dismiss"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`fixed top-4 right-4 bg-white rounded-lg shadow-lg border border-yellow-200 p-4 z-40 max-w-sm transition-all duration-300 ${
      isFadingOut ? 'opacity-0 transform translate-x-full' : 'opacity-100 transform translate-x-0'
    }`}>
      <div className="flex items-center gap-3">
        <WifiOff className="w-5 h-5 text-yellow-500" />
        <div>
          <p className="text-sm font-medium text-gray-900">No Templates</p>
          <p className="text-xs text-gray-500">No templates available</p>
        </div>
      </div>
    </div>
  );
};
