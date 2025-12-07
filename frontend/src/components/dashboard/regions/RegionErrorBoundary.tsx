import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, X } from 'lucide-react';
import { logger } from '@/utils/logger';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  children: ReactNode;
  regionId?: string;
  onRecover?: () => void;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  retryCount: number;
  errorLoop: boolean;
}

/**
 * Region-specific error boundary with recovery and retry logic
 */
export class RegionErrorBoundary extends Component<Props, State> {
  private retryTimeout: NodeJS.Timeout | null = null;
  private readonly MAX_RETRIES = 3;
  private readonly RETRY_DELAY = 1000; // 1 second base delay

  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: 0,
      errorLoop: false
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error with context
    logger.error('Region error boundary caught error', {
      error,
      errorInfo,
      regionId: this.props.regionId,
      componentStack: errorInfo.componentStack
    }, 'RegionErrorBoundary');

    this.setState({
      error,
      errorInfo,
      retryCount: this.state.retryCount + 1
    });

    // Check for error loops (same error multiple times)
    if (this.state.retryCount >= this.MAX_RETRIES) {
      this.setState({ errorLoop: true });
    }

    // Report to error tracking service (e.g., Sentry)
    if (typeof window !== 'undefined' && (window as any).Sentry) {
      (window as any).Sentry.captureException(error, {
        contexts: {
          react: {
            componentStack: errorInfo.componentStack
          },
          region: {
            regionId: this.props.regionId
          }
        }
      });
    }
  }

  componentWillUnmount() {
    if (this.retryTimeout) {
      clearTimeout(this.retryTimeout);
    }
  }

  handleRetry = () => {
    if (this.state.errorLoop) {
      // Error loop detected, don't retry automatically
      return;
    }

    if (this.state.retryCount >= this.MAX_RETRIES) {
      this.setState({ errorLoop: true });
      return;
    }

    // Exponential backoff
    const delay = this.RETRY_DELAY * Math.pow(2, this.state.retryCount);

    this.retryTimeout = setTimeout(() => {
      this.setState({
        hasError: false,
        error: null,
        errorInfo: null
      });

      if (this.props.onRecover) {
        this.props.onRecover();
      }
    }, delay);
  };

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: 0,
      errorLoop: false
    });

    if (this.props.onRecover) {
      this.props.onRecover();
    }
  };

  handleDismiss = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative w-full h-full min-h-[200px] flex items-center justify-center bg-red-50 border-2 border-red-200 rounded-lg p-6"
          >
            <div className="text-center max-w-md">
              <AlertTriangle className="w-12 h-12 text-red-600 mx-auto mb-4" />
              
              <h3 className="text-lg font-semibold text-red-900 mb-2">
                {this.state.errorLoop 
                  ? 'Error Loop Detected' 
                  : 'Region Error'}
              </h3>
              
              <p className="text-sm text-red-700 mb-4">
                {this.state.error?.message || 'An unexpected error occurred'}
              </p>

              {this.state.errorLoop && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                  <p className="text-xs text-yellow-800">
                    This error has occurred multiple times. Please refresh the page or contact support.
                  </p>
                </div>
              )}

              <div className="flex gap-2 justify-center">
                {!this.state.errorLoop && (
                  <button
                    onClick={this.handleRetry}
                    disabled={this.state.retryCount >= this.MAX_RETRIES}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Retry ({this.MAX_RETRIES - this.state.retryCount} left)
                  </button>
                )}
                
                <button
                  onClick={this.handleReset}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Reset
                </button>

                <button
                  onClick={this.handleDismiss}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors flex items-center gap-2"
                >
                  <X className="w-4 h-4" />
                  Dismiss
                </button>
              </div>

              {process.env.NODE_ENV === 'development' && this.state.errorInfo && (
                <details className="mt-4 text-left">
                  <summary className="text-xs text-gray-600 cursor-pointer mb-2">
                    Error Details (Dev Only)
                  </summary>
                  <pre className="text-xs bg-gray-100 p-3 rounded overflow-auto max-h-40">
                    {this.state.error?.stack}
                    {'\n\n'}
                    {this.state.errorInfo.componentStack}
                  </pre>
                </details>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      );
    }

    return this.props.children;
  }
}




