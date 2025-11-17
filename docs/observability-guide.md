# Observability Implementation Guide

**Last Updated:** 2025-11-16

This guide explains how to implement observability requirements in VeroField, including structured logging, trace ID propagation, error handling, and security event logging.

---

## Table of Contents

1. [Structured Logging](#structured-logging)
2. [Trace ID Propagation](#trace-id-propagation)
3. [Error Handling Patterns](#error-handling-patterns)
4. [Security Event Logging](#security-event-logging)
5. [Critical Path Instrumentation](#critical-path-instrumentation)

---

## Structured Logging

### Required Fields

Every log entry MUST include these fields:

- `message` - Human-readable log message
- `context` - Context identifier (service, module, component name)
- `traceId` - Distributed trace identifier (if available)
- `operation` - Operation name (function, endpoint, action)
- `severity` - Log level (info/warn/error/debug)
- `errorCode` or `rootCause` - Error classification (when applicable)
- `timestamp` - ISO 8601 timestamp (automatically added)

### Backend Example

```typescript
import { StructuredLoggerService } from '@common/services/logger.service';

@Injectable()
export class PaymentService {
  constructor(private readonly logger: StructuredLoggerService) {}

  async processPayment(paymentData: PaymentData, requestId?: string) {
    // Log entry
    this.logger.info(
      'Processing payment',
      'PaymentService',
      requestId,
      'processPayment',
      { paymentId: paymentData.id }
    );

    try {
      const result = await this.executePayment(paymentData);
      
      // Log success
      this.logger.info(
        'Payment processed successfully',
        'PaymentService',
        requestId,
        'processPayment',
        { paymentId: paymentData.id, result: 'success' }
      );

      return result;
    } catch (error) {
      // Log error with required fields
      this.logger.error(
        'Payment processing failed',
        error.stack,
        'PaymentService',
        requestId,
        'processPayment',
        'PAYMENT_PROCESSING_FAILED',
        error.message,
        { paymentId: paymentData.id }
      );

      throw error;
    }
  }
}
```

### Frontend Example

```typescript
import { logger } from '@/lib/logger';
import { createTraceContextForApiCall } from '@/lib/trace-propagation';

async function processPayment(paymentData: PaymentData) {
  const traceContext = createTraceContextForApiCall();

  logger.info(
    'Processing payment',
    'PaymentService',
    'processPayment',
    traceContext.traceId,
    traceContext.spanId,
    traceContext.requestId
  );

  try {
    const result = await api.post('/payments', paymentData, {
      headers: {
        'x-trace-id': traceContext.traceId,
        'x-span-id': traceContext.spanId,
        'x-request-id': traceContext.requestId,
      },
    });

    logger.info(
      'Payment processed successfully',
      'PaymentService',
      'processPayment',
      traceContext.traceId,
      traceContext.spanId,
      traceContext.requestId
    );

    return result;
  } catch (error) {
    logger.error(
      'Payment processing failed',
      'PaymentService',
      error,
      'processPayment',
      'PAYMENT_PROCESSING_FAILED',
      error.message,
      traceContext.traceId,
      traceContext.spanId,
      traceContext.requestId
    );

    throw error;
  }
}
```

---

## Trace ID Propagation

### Backend: Extract and Propagate Trace IDs

```typescript
import { 
  createTraceContextForRequest,
  setTraceContextOnRequest,
  addTraceContextToHeaders,
} from '@common/utils/trace-propagation.util';

@Injectable()
export class TraceMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // Extract or create trace context
    const traceContext = createTraceContextForRequest(req);
    
    // Set on request object
    setTraceContextOnRequest(req, traceContext);

    // Set in logger service
    this.logger.setRequestContext(traceContext.requestId, {
      traceId: traceContext.traceId,
      spanId: traceContext.spanId,
      requestId: traceContext.requestId,
      userId: req.user?.id,
      tenantId: req.user?.tenantId,
    });

    next();
  }
}

// Propagate to downstream services
async function callExternalService(url: string, data: any, traceContext: TraceContext) {
  const headers = addTraceContextToHeaders(
    { 'Content-Type': 'application/json' },
    traceContext
  );

  return await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(data),
  });
}
```

### Frontend: Generate and Propagate Trace IDs

```typescript
import { 
  createTraceContextForApiCall,
  addTraceContextToHeaders,
} from '@/lib/trace-propagation';

async function apiCall(url: string, options: RequestInit = {}) {
  // Create trace context for this API call
  const traceContext = createTraceContextForApiCall();

  // Add trace IDs to headers
  const headers = addTraceContextToHeaders(
    options.headers || {},
    traceContext
  );

  return await fetch(url, {
    ...options,
    headers,
  });
}
```

---

## Error Handling Patterns

### Pattern 1: External API Calls with Timeout

```typescript
async function fetchWithTimeout(url: string, timeoutMs: number = 5000) {
  // Guard: Validate input
  if (!url || typeof url !== 'string') {
    throw new Error('Invalid URL');
  }

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
      error,
      'fetchWithTimeout',
      'FETCH_FAILED',
      error.message,
      traceId,
      spanId,
      requestId
    );

    // Fallback: Return cached data or null
    return this.getCachedData(url) || null;
  }
}
```

### Pattern 2: Database Operations with Error Handling

```typescript
async function queryDatabase(sql: string, params: any[], requestId?: string) {
  // Guard: Validate input
  if (!sql || typeof sql !== 'string') {
    throw new ValidationError('Invalid SQL query');
  }

  try {
    // Set query timeout
    const result = await this.db.query(sql, { 
      timeout: 5000,
      params 
    });

    logger.debug(
      'Database query executed',
      'DatabaseService',
      requestId,
      'queryDatabase',
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
        error.message
      );
      throw new DatabaseConnectionError('Database unavailable');
    }

    logger.error(
      'Database query failed',
      'DatabaseService',
      requestId,
      'queryDatabase',
      'DB_QUERY_FAILED',
      error.message,
      { query: sql.substring(0, 100) }
    );

    throw error;
  }
}
```

### Pattern 3: Async Operations with Retry

```typescript
async function executeWithRetry<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  context?: string
): Promise<T> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      if (attempt > 0) {
        const delay = Math.pow(2, attempt - 1) * 1000; // Exponential backoff
        await new Promise(resolve => setTimeout(resolve, delay));

        logger.warn(
          `Retrying operation (attempt ${attempt}/${maxRetries})`,
          context || 'RetryService',
          undefined,
          'executeWithRetry',
          'RETRY_ATTEMPT',
          undefined,
          traceId,
          spanId,
          requestId
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
        traceId,
        spanId,
        requestId
      );

      if (attempt === maxRetries) {
        throw lastError;
      }
    }
  }

  throw lastError || new Error('Operation failed');
}
```

---

## Security Event Logging

### Authentication Failure

```typescript
async function authenticateUser(credentials: Credentials) {
  try {
    const user = await this.userService.validateCredentials(credentials);
    return user;
  } catch (error) {
    // Log authentication failure
    logger.warn(
      'Authentication failed',
      'AuthService',
      undefined,
      'authenticateUser',
      'AUTH_FAILED',
      undefined,
      traceId,
      spanId,
      requestId,
      {
        username: credentials.username, // DO NOT log password
        reason: error.message,
        ipAddress: req.ip,
      }
    );

    throw error;
  }
}
```

### Permission Denial

```typescript
function checkPermission(user: User, resource: string, action: string) {
  if (!hasPermission(user, resource, action)) {
    // Log permission denial
    logger.warn(
      'Permission denied',
      'AuthService',
      undefined,
      'checkPermission',
      'PERMISSION_DENIED',
      undefined,
      traceId,
      spanId,
      requestId,
      {
        userId: user.id,
        resource,
        action,
        requiredPermission: `${resource}:${action}`,
      }
    );

    throw new ForbiddenException();
  }
}
```

---

## Critical Path Instrumentation

### Function Entry/Exit Logging

```typescript
async function processOrder(orderId: string, requestId?: string) {
  const startTime = Date.now();

  // Log entry
  logger.info(
    'Processing order',
    'OrderService',
    requestId,
    'processOrder',
    undefined,
    undefined,
    undefined,
    traceId,
    spanId,
    requestId,
    { orderId }
  );

  try {
    const result = await this.executeOrder(orderId);
    const duration = Date.now() - startTime;

    // Log exit with duration
    logger.info(
      'Order processed successfully',
      'OrderService',
      requestId,
      'processOrder',
      undefined,
      undefined,
      undefined,
      traceId,
      spanId,
      requestId,
      { orderId, duration, result: 'success' }
    );

    return result;
  } catch (error) {
    const duration = Date.now() - startTime;

    // Log error with duration
    logger.error(
      'Order processing failed',
      'OrderService',
      requestId,
      'processOrder',
      'ORDER_PROCESSING_FAILED',
      error.message,
      traceId,
      spanId,
      requestId,
      { orderId, duration }
    );

    throw error;
  }
}
```

### Cache Hit/Miss Logging

```typescript
async function getCachedData(key: string) {
  const cached = await cache.get(key);

  if (cached) {
    logger.debug(
      'Cache hit',
      'CacheService',
      undefined,
      'getCachedData',
      undefined,
      undefined,
      undefined,
      traceId,
      spanId,
      requestId,
      { key, cacheType: 'redis' }
    );
    return cached;
  }

  logger.debug(
    'Cache miss',
    'CacheService',
    undefined,
    'getCachedData',
    undefined,
    undefined,
    undefined,
    traceId,
    spanId,
    requestId,
    { key, cacheType: 'redis' }
  );

  return null;
}
```

---

## Best Practices

1. **Always include context and operation** in log calls
2. **Use error codes** for error logs to enable filtering
3. **Include trace IDs** in all logs for distributed tracing
4. **Log entry and exit** for critical operations
5. **Never log sensitive data** (passwords, tokens, PII)
6. **Use appropriate log levels** (debug, info, warn, error)
7. **Include duration** for performance monitoring
8. **Log validation failures** with details
9. **Log security events** (auth failures, permission denials)
10. **Verify logs in tests** using observability test helpers

---

**Last Updated:** 2025-11-16

