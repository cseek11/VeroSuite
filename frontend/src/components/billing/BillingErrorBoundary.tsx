import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, ArrowLeft } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Heading, Text } from '@/components/ui';
import { logger } from '@/utils/logger';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onRetry?: () => void;
  onBack?: () => void;
  context?: string;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

/**
 * BillingErrorBoundary
 * 
 * Error boundary specifically for billing components.
 * Provides user-friendly error messages and recovery options.
 * 
 * Pattern: Following SELECT_UNDEFINED_OPTIONS and error-resilience.md patterns
 * Last Updated: 2025-11-16
 */
export class BillingErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Structured logging with context
    logger.error('BillingErrorBoundary caught an error', {
      context: this.props.context || 'BillingErrorBoundary',
      operation: 'componentDidCatch',
      error: {
        message: error.message,
        stack: error.stack,
        name: error.name,
      },
      errorInfo: {
        componentStack: errorInfo.componentStack,
      },
    }, 'BillingErrorBoundary');

    this.setState({
      error,
      errorInfo,
    });
  }

  private handleRetry = () => {
    if (this.props.onRetry) {
      this.props.onRetry();
    }
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  private handleBack = () => {
    if (this.props.onBack) {
      this.props.onBack();
    } else {
      window.history.back();
    }
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Card className="p-6">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <Heading level={3} className="text-gray-900 mb-2">
              Something went wrong
            </Heading>
            <Text variant="body" className="text-gray-600 mb-6">
              {this.state.error?.message || 'An unexpected error occurred while loading billing information.'}
            </Text>
            <div className="flex items-center justify-center space-x-3">
              <Button
                variant="primary"
                size="sm"
                icon={RefreshCw}
                onClick={this.handleRetry}
              >
                Try Again
              </Button>
              <Button
                variant="outline"
                size="sm"
                icon={ArrowLeft}
                onClick={this.handleBack}
              >
                Go Back
              </Button>
            </div>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-6 text-left">
                <summary className="cursor-pointer text-sm text-gray-500 mb-2">
                  Error Details (Development Only)
                </summary>
                <pre className="bg-gray-100 p-4 rounded text-xs overflow-auto">
                  {this.state.error.stack}
                  {this.state.errorInfo?.componentStack && (
                    <>
                      {'\n\nComponent Stack:'}
                      {this.state.errorInfo.componentStack}
                    </>
                  )}
                </pre>
              </details>
            )}
          </div>
        </Card>
      );
    }

    return this.props.children;
  }
}








