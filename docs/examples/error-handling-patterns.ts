/**
 * Error Handling Patterns - Code Examples
 * 
 * This file contains examples of proper error handling patterns
 * to follow when implementing error handling in VeroField.
 * 
 * Last Updated: 2025-11-16
 */

import { logger } from '@/lib/logger';
import { createTraceContextForApiCall } from '@/lib/trace-propagation';

// ============================================================================
// Pattern 1: External API Calls with Timeout
// ============================================================================

/**
 * Example: Proper error handling for external API calls with timeout
 * Pattern: API_TIMEOUT_HANDLING (see docs/error-patterns.md)
 */
async function fetchWithTimeout(
  url: string,
  timeoutMs: number = 5000,
  traceContext?: { traceId: string; spanId: string; requestId: string }
) {
  // Guard: Validate input
  if (!url || typeof url !== 'string') {
    throw new Error('Invalid URL');
  }

  const trace = traceContext || createTraceContextForApiCall();

  try {
    // Timeout: Use AbortController
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    // Log error with required fields
    logger.error(
      'Fetch failed',
      'HttpService',
      error instanceof Error ? error : new Error(String(error)),
      'fetchWithTimeout',
      'FETCH_FAILED',
      error instanceof Error ? error.message : String(error),
      trace.traceId,
      trace.spanId,
      trace.requestId,
      { url, timeoutMs }
    );

    // Fallback: Return cached data or null
    return null;
  }
}

// ============================================================================
// Pattern 2: Database Operations with Error Handling
// ============================================================================

/**
 * Example: Proper error handling for database operations
 */
async function queryDatabase(
  sql: string,
  params: any[],
  requestId?: string
) {
  // Guard: Validate input
  if (!sql || typeof sql !== 'string') {
    throw new Error('Invalid SQL query');
  }

  try {
    // Set query timeout
    const result = await this.db.query(sql, {
      timeout: 5000,
      params,
    });

    logger.debug(
      'Database query executed',
      'DatabaseService',
      requestId,
      'queryDatabase',
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      requestId,
      { query: sql.substring(0, 100) }
    );

    return result;
  } catch (error) {
    // Handle specific error types
    if (error.code === 'ETIMEDOUT' || error.code === 'ECONNREFUSED') {
      logger.error(
        'Database connection failed',
        'DatabaseService',
        requestId,
        'queryDatabase',
        'DB_CONNECTION_FAILED',
        error.message,
        undefined,
        undefined,
        requestId
      );
      throw new Error('Database unavailable');
    }

    logger.error(
      'Database query failed',
      'DatabaseService',
      requestId,
      'queryDatabase',
      'DB_QUERY_FAILED',
      error.message,
      undefined,
      undefined,
      requestId,
      { query: sql.substring(0, 100) }
    );

    throw error;
  }
}

// ============================================================================
// Pattern 3: Async Operations with Retry
// ============================================================================

/**
 * Example: Proper error handling with retry logic
 */
async function executeWithRetry<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  context?: string
): Promise<T> {
  let lastError: Error | null = null;
  const traceContext = createTraceContextForApiCall();

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      if (attempt > 0) {
        const delay = Math.pow(2, attempt - 1) * 1000; // Exponential backoff
        await new Promise((resolve) => setTimeout(resolve, delay));

        logger.warn(
          `Retrying operation (attempt ${attempt}/${maxRetries})`,
          context || 'RetryService',
          undefined,
          'executeWithRetry',
          'RETRY_ATTEMPT',
          undefined,
          traceContext.traceId,
          traceContext.spanId,
          traceContext.requestId
        );
      }

      const result = await operation();
      return result;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      logger.error(
        `Operation failed (attempt ${attempt + 1}/${maxRetries + 1})`,
        context || 'RetryService',
        lastError,
        'executeWithRetry',
        'OPERATION_FAILED',
        lastError.message,
        traceContext.traceId,
        traceContext.spanId,
        traceContext.requestId
      );

      if (attempt === maxRetries) {
        throw lastError;
      }
    }
  }

  throw lastError || new Error('Operation failed');
}

// ============================================================================
// Pattern 4: Before/After Silent Failure Fix
// ============================================================================

/**
 * BEFORE: Silent failure (VIOLATION)
 */
async function processPaymentBad(paymentData: PaymentData) {
  try {
    await this.executePayment(paymentData);
  } catch (error) {
    // Silent failure - VIOLATION
    // Error is swallowed, no logging, no user feedback
  }
}

/**
 * AFTER: Proper error handling (CORRECT)
 */
async function processPaymentGood(
  paymentData: PaymentData,
  requestId?: string
) {
  const traceContext = createTraceContextForApiCall();

  logger.info(
    'Processing payment',
    'PaymentService',
    requestId,
    'processPayment',
    undefined,
    undefined,
    undefined,
    traceContext.traceId,
    traceContext.spanId,
    traceContext.requestId,
    { paymentId: paymentData.id }
  );

  try {
    const result = await this.executePayment(paymentData);

    logger.info(
      'Payment processed successfully',
      'PaymentService',
      requestId,
      'processPayment',
      undefined,
      undefined,
      undefined,
      traceContext.traceId,
      traceContext.spanId,
      traceContext.requestId,
      { paymentId: paymentData.id, result: 'success' }
    );

    return result;
  } catch (error) {
    logger.error(
      'Payment processing failed',
      'PaymentService',
      error instanceof Error ? error : new Error(String(error)),
      'processPayment',
      'PAYMENT_PROCESSING_FAILED',
      error instanceof Error ? error.message : String(error),
      traceContext.traceId,
      traceContext.spanId,
      traceContext.requestId,
      { paymentId: paymentData.id }
    );

    throw error; // Re-throw to handle at higher level
  }
}

// ============================================================================
// Pattern 5: Structured Logging Examples
// ============================================================================

/**
 * Example: Proper structured logging
 */
function logOperation(
  message: string,
  context: string,
  operation: string,
  severity: 'info' | 'warn' | 'error',
  errorCode?: string,
  rootCause?: string,
  traceContext?: { traceId: string; spanId: string; requestId: string }
) {
  const trace = traceContext || createTraceContextForApiCall();

  if (severity === 'error') {
    logger.error(
      message,
      context,
      undefined,
      operation,
      errorCode,
      rootCause,
      trace.traceId,
      trace.spanId,
      trace.requestId
    );
  } else if (severity === 'warn') {
    logger.warn(
      message,
      context,
      undefined,
      operation,
      errorCode,
      trace.traceId,
      trace.spanId,
      trace.requestId
    );
  } else {
    logger.info(
      message,
      context,
      operation,
      trace.traceId,
      trace.spanId,
      trace.requestId
    );
  }
}

// ============================================================================
// Pattern 6: Trace Propagation Examples
// ============================================================================

/**
 * Example: Propagating trace IDs in API calls
 */
async function callExternalService(
  url: string,
  data: any,
  traceContext: { traceId: string; spanId: string; requestId: string }
) {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-trace-id': traceContext.traceId,
      'x-span-id': traceContext.spanId,
      'x-request-id': traceContext.requestId,
    },
    body: JSON.stringify(data),
  });

  return response;
}

