import { useState, useCallback, useRef } from 'react';
import { logger } from '@/utils/logger';

interface RetryOptions {
  maxRetries?: number;
  initialDelay?: number;
  maxDelay?: number;
  backoffMultiplier?: number;
  onRetry?: (attempt: number) => void;
  onMaxRetriesReached?: () => void;
}

interface ErrorRecoveryState {
  error: Error | null;
  retryCount: number;
  isRetrying: boolean;
  lastErrorTime: number | null;
}

/**
 * Hook for error recovery with exponential backoff retry logic
 */
export function useErrorRecovery(options: RetryOptions = {}) {
  const {
    maxRetries = 3,
    initialDelay = 1000,
    maxDelay = 30000,
    backoffMultiplier = 2,
    onRetry,
    onMaxRetriesReached
  } = options;

  const [state, setState] = useState<ErrorRecoveryState>({
    error: null,
    retryCount: 0,
    isRetrying: false,
    lastErrorTime: null
  });

  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const retryAttemptRef = useRef(0);

  /**
   * Calculate delay for next retry using exponential backoff
   */
  const calculateDelay = useCallback((attempt: number): number => {
    const delay = initialDelay * Math.pow(backoffMultiplier, attempt);
    return Math.min(delay, maxDelay);
  }, [initialDelay, backoffMultiplier, maxDelay]);

  /**
   * Execute operation with retry logic
   */
  const executeWithRetry = useCallback(async <T>(
    operation: () => Promise<T>,
    context?: string
  ): Promise<T> => {
    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        setState(prev => ({
          ...prev,
          retryCount: attempt,
          isRetrying: attempt > 0,
          error: null
        }));

        if (attempt > 0) {
          const delay = calculateDelay(attempt - 1);
          logger.info(`Retrying operation (attempt ${attempt}/${maxRetries})`, {
            context,
            delay,
            attempt
          }, 'useErrorRecovery');

          await new Promise(resolve => {
            retryTimeoutRef.current = setTimeout(resolve, delay);
          });

          if (onRetry) {
            onRetry(attempt);
          }
        }

        const result = await operation();

        // Success - reset state
        setState({
          error: null,
          retryCount: 0,
          isRetrying: false,
          lastErrorTime: null
        });

        retryAttemptRef.current = 0;
        return result;
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        
        logger.error(`Operation failed (attempt ${attempt + 1}/${maxRetries + 1})`, {
          error: lastError,
          context,
          attempt: attempt + 1
        }, 'useErrorRecovery');

        // If this was the last attempt, set error state
        if (attempt === maxRetries) {
          setState({
            error: lastError,
            retryCount: attempt + 1,
            isRetrying: false,
            lastErrorTime: Date.now()
          });

          if (onMaxRetriesReached) {
            onMaxRetriesReached();
          }

          throw lastError;
        }
      }
    }

    throw lastError || new Error('Operation failed');
  }, [maxRetries, calculateDelay, onRetry, onMaxRetriesReached]);

  /**
   * Manually retry the last failed operation
   */
  const retry = useCallback(async <T>(
    operation: () => Promise<T>
  ): Promise<T> => {
    return executeWithRetry(operation);
  }, [executeWithRetry]);

  /**
   * Clear error state
   */
  const clearError = useCallback(() => {
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
      retryTimeoutRef.current = null;
    }

    setState({
      error: null,
      retryCount: 0,
      isRetrying: false,
      lastErrorTime: null
    });

    retryAttemptRef.current = 0;
  }, []);

  /**
   * Check if error is recoverable (not a permanent error)
   */
  const isRecoverableError = useCallback((error: Error): boolean => {
    // Network errors are usually recoverable
    if (error.message.includes('network') || 
        error.message.includes('fetch') ||
        error.message.includes('timeout')) {
      return true;
    }

    // 5xx server errors are usually recoverable
    if (error.message.includes('500') ||
        error.message.includes('502') ||
        error.message.includes('503') ||
        error.message.includes('504')) {
      return true;
    }

    // 429 (rate limit) is recoverable after delay
    if (error.message.includes('429')) {
      return true;
    }

    // 4xx client errors are usually not recoverable
    if (error.message.includes('400') ||
        error.message.includes('401') ||
        error.message.includes('403') ||
        error.message.includes('404')) {
      return false;
    }

    // Default to recoverable
    return true;
  }, []);

  /**
   * Get time since last error
   */
  const getTimeSinceLastError = useCallback((): number | null => {
    if (!state.lastErrorTime) {
      return null;
    }
    return Date.now() - state.lastErrorTime;
  }, [state.lastErrorTime]);

  return {
    error: state.error,
    retryCount: state.retryCount,
    isRetrying: state.isRetrying,
    executeWithRetry,
    retry,
    clearError,
    isRecoverableError,
    getTimeSinceLastError,
    hasError: state.error !== null,
    canRetry: state.retryCount < maxRetries && !state.isRetrying
  };
}




