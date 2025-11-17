/**
 * Centralized error handling for card operations
 * Provides user-visible errors, retry mechanisms, and error tracking
 */

import { useState, useCallback, useRef } from 'react';
import { logger } from '@/utils/logger';
import { CARD_CONSTANTS } from '../utils/cardConstants';

export interface CardOperationError {
  id: string;
  message: string;
  operation: string;
  timestamp: Date;
  retryable: boolean;
  retryCount: number;
}

interface UseErrorHandlingReturn {
  errors: CardOperationError[];
  showError: (message: string, operation: string, retryable?: boolean, operationFn?: () => Promise<void>) => string;
  clearError: (errorId: string) => void;
  clearAllErrors: () => void;
  retryOperation: (errorId: string, operation?: () => Promise<void>) => Promise<void>;
  hasErrors: boolean;
}

export const useErrorHandling = (): UseErrorHandlingReturn => {
  const [errors, setErrors] = useState<CardOperationError[]>([]);
  const retryOperationsRef = useRef<Map<string, () => Promise<void>>>(new Map());

  const showError = useCallback((
    message: string,
    operation: string,
    retryable = false,
    operationFn?: () => Promise<void>
  ): string => {
    const errorId = `error-${Date.now()}-${Math.random()}`;
    const error: CardOperationError = {
      id: errorId,
      message,
      operation,
      timestamp: new Date(),
      retryable,
      retryCount: 0,
    };

    setErrors(prev => [...prev, error]);
    logger.error(`Card operation failed: ${operation}`, new Error(message), 'CardSystem');

    // Store operation function for retry if provided
    if (retryable && operationFn) {
      retryOperationsRef.current.set(errorId, operationFn);
    }

    // Auto-dismiss non-retryable errors after 5 seconds
    if (!retryable) {
      setTimeout(() => {
        setErrors(prev => prev.filter(e => e.id !== errorId));
      }, 5000);
    }

    return errorId;
  }, []);

  const clearError = useCallback((errorId: string) => {
    setErrors(prev => prev.filter(e => e.id !== errorId));
    retryOperationsRef.current.delete(errorId);
  }, []);

  const clearAllErrors = useCallback(() => {
    setErrors([]);
    retryOperationsRef.current.clear();
  }, []);

  const retryOperation = useCallback(async (
    errorId: string,
    operation?: () => Promise<void>
  ): Promise<void> => {
    // If no operation provided, try to get it from stored operations
    const storedOperation = operation || retryOperationsRef.current.get(errorId);
    if (!storedOperation) {
      logger.warn('No operation to retry', { errorId });
      return;
    }
    const error = errors.find(e => e.id === errorId);
    if (!error || !error.retryable) {
      logger.warn('Cannot retry operation', { errorId, error });
      return;
    }

    // Check retry limit
    if (error.retryCount >= CARD_CONSTANTS.PERSISTENCE.RETRY_ATTEMPTS) {
      logger.error('Max retries reached', { errorId, retryCount: error.retryCount });
      setErrors(prev => prev.map(e => 
        e.id === errorId 
          ? { ...e, message: `${e.message} (Max retries reached)`, retryable: false }
          : e
      ));
      return;
    }

    // Store operation for retry
    retryOperationsRef.current.set(errorId, operation);

    // Update retry count
    setErrors(prev => prev.map(e => 
      e.id === errorId 
        ? { ...e, retryCount: e.retryCount + 1 }
        : e
    ));

    // Exponential backoff
    const delay = CARD_CONSTANTS.PERSISTENCE.RETRY_DELAY_BASE_MS * Math.pow(2, error.retryCount);
    
    logger.info('Retrying operation', { errorId, attempt: error.retryCount + 1, delay });

    try {
      await new Promise(resolve => setTimeout(resolve, delay));
      await operation();
      
      // Success - clear error
      clearError(errorId);
      logger.info('Operation retry succeeded', { errorId });
    } catch (retryError) {
      logger.error('Operation retry failed', retryError, 'CardSystem');
      // Error will be updated with new retry count
    }
  }, [errors, clearError]);

  return {
    errors,
    showError,
    clearError,
    clearAllErrors,
    retryOperation,
    hasErrors: errors.length > 0,
  };
};

