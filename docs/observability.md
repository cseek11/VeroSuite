---
# Cursor Rule Metadata
version: 1.0
project: VeroField
scope:
  - frontend
  - backend
  - mobile
  - microservices
priority: critical
last_updated: 2025-12-05
always_apply: true
---

# PRIORITY: CRITICAL - Observability & Logging Rules

## Overview

This rule file enforces structured logging, critical path instrumentation, security event logging, cross-layer traceability, and observability-driven testing across all development tasks.

**⚠️ MANDATORY:** All new or modified code paths must comply with these observability requirements.

---

## I. Structured Logging Enforcement

### Rule 1: Required Log Fields

**MANDATORY:** Every log entry MUST include these fields:

- `message` - Human-readable log message
- `context` - Context identifier (service, module, component name)
- `traceId` - Distributed trace identifier (if available)
- `operation` - Operation name (function, endpoint, action)
- `severity` - Log level (info/warn/error/debug)
- `errorCode` or `rootCause` - Error classification (when applicable)
- `timestamp` - ISO 8601 timestamp (automatically added)

**Example:**
```typescript
logger.error('Failed to process payment', {
  context: 'PaymentService',
  traceId: 'abc123',
  operation: 'processPayment',
  severity: 'error',
  errorCode: 'PAYMENT_PROCESSING_FAILED',
  rootCause: 'Invalid card number',
  paymentId: 'pay_123',
  userId: 'user_456'
});
```

### Rule 2: Machine-Parseable Format

**MANDATORY:** All logs MUST be machine-parseable:

- Use JSON format in production
- Structured objects, not string concatenation
- Consistent field names across all services
- No sensitive data (passwords, tokens, PII) in logs

**WRONG:**
```typescript
console.log(`User ${userId} failed to login: ${error.message}`);
```

**RIGHT:**
```typescript
logger.warn('User login failed', {
  context: 'AuthService',
  operation: 'login',
  userId: userId,
  errorCode: 'LOGIN_FAILED',
  reason: error.message
});
```

### Rule 3: Log Level Usage

**MANDATORY:** Use appropriate log levels:

- `debug` - Detailed diagnostic information (development only)
- `info` - General informational messages (normal operations)
- `warn` - Warning messages (recoverable issues)
- `error` - Error messages (failures requiring attention)
- `fatal` - Critical errors (system may be unstable)

**MANDATORY:** Never log errors as `info` or `warn` when they should be `error`.

---

## II. Critical Path Instrumentation

### Rule 4: Function Entry/Exit Logging

**MANDATORY:** Log entry and exit for critical components:

- API endpoints (entry with params, exit with result/error)
- Service methods that perform external I/O
- Complex business logic functions
- State transition operations

**Example:**
```typescript
async processOrder(orderId: string) {
  logger.info('Processing order', {
    context: 'OrderService',
    operation: 'processOrder',
    orderId
  });
  
  try {
    const result = await this.executeOrder(orderId);
    logger.info('Order processed successfully', {
      context: 'OrderService',
      operation: 'processOrder',
      orderId,
      result: 'success'
    });
    return result;
  } catch (error) {
    logger.error('Order processing failed', {
      context: 'OrderService',
      operation: 'processOrder',
      orderId,
      errorCode: 'ORDER_PROCESSING_FAILED',
      rootCause: error.message
    });
    throw error;
  }
}
```

### Rule 5: Cache Hit/Miss Logging

**MANDATORY:** Log cache operations for performance monitoring:

```typescript
const cached = await cache.get(key);
if (cached) {
  logger.debug('Cache hit', {
    context: 'CacheService',
    operation: 'get',
    key,
    cacheType: 'redis'
  });
} else {
  logger.debug('Cache miss', {
    context: 'CacheService',
    operation: 'get',
    key,
    cacheType: 'redis'
  });
}
```

### Rule 6: Retry Attempt Logging

**MANDATORY:** Log all retry attempts with attempt number:

```typescript
for (let attempt = 1; attempt <= maxRetries; attempt++) {
  try {
    return await operation();
  } catch (error) {
    logger.warn('Operation failed, retrying', {
      context: 'RetryService',
      operation: 'executeWithRetry',
      attempt,
      maxRetries,
      errorCode: error.code
    });
  }
}
```

### Rule 7: Validation Failure Logging

**MANDATORY:** Log validation failures with details:

```typescript
const validationResult = schema.safeParse(data);
if (!validationResult.success) {
  logger.warn('Validation failed', {
    context: 'ValidationService',
    operation: 'validate',
    errors: validationResult.error.errors,
    errorCode: 'VALIDATION_FAILED'
  });
  throw new ValidationError(validationResult.error);
}
```

### Rule 8: Slow Operation Logging

**MANDATORY:** Log operations exceeding thresholds:

```typescript
const startTime = Date.now();
const result = await slowOperation();
const duration = Date.now() - startTime;

if (duration > SLOW_OPERATION_THRESHOLD_MS) {
  logger.warn('Slow operation detected', {
    context: 'PerformanceMonitor',
    operation: 'slowOperation',
    duration,
    threshold: SLOW_OPERATION_THRESHOLD_MS
  });
}
```

---

## III. Security Event Logging Policy

### Rule 9: Authentication Failure Logging

**MANDATORY:** Log all authentication failures:

```typescript
try {
  await authenticateUser(credentials);
} catch (error) {
  logger.warn('Authentication failed', {
    context: 'AuthService',
    operation: 'authenticate',
    errorCode: 'AUTH_FAILED',
    username: credentials.username, // DO NOT log password
    reason: error.message,
    ipAddress: req.ip
  });
  throw error;
}
```

### Rule 10: Permission Denial Logging

**MANDATORY:** Log permission denials:

```typescript
if (!hasPermission(user, resource, action)) {
  logger.warn('Permission denied', {
    context: 'AuthService',
    operation: 'checkPermission',
    errorCode: 'PERMISSION_DENIED',
    userId: user.id,
    resource,
    action,
    requiredPermission: `${resource}:${action}`
  });
  throw new ForbiddenException();
}
```

### Rule 11: Suspicious Activity Logging

**MANDATORY:** Log suspicious repetitive operations:

```typescript
const attemptCount = await getAttemptCount(userId, operation);
if (attemptCount > SUSPICIOUS_THRESHOLD) {
  logger.warn('Suspicious activity detected', {
    context: 'SecurityService',
    operation: 'detectSuspiciousActivity',
    errorCode: 'SUSPICIOUS_ACTIVITY',
    userId,
    operation,
    attemptCount,
    threshold: SUSPICIOUS_THRESHOLD
  });
}
```

### Rule 12: Token Validation Logging

**MANDATORY:** Log token validation issues:

```typescript
try {
  const payload = await verifyToken(token);
} catch (error) {
  logger.warn('Token validation failed', {
    context: 'AuthService',
    operation: 'verifyToken',
    errorCode: 'TOKEN_VALIDATION_FAILED',
    reason: error.message,
    tokenType: 'JWT'
  });
  throw error;
}
```

### Rule 13: Security Data Handling

**MANDATORY:** Never log sensitive data:

- ❌ Passwords, tokens, API keys
- ❌ Credit card numbers, SSNs
- ❌ Full request/response bodies (log summaries only)
- ✅ Log metadata, IDs, operation names, error codes

---

## IV. Cross-Layer Traceability

### Rule 14: Trace ID Propagation

**MANDATORY:** All service boundaries MUST propagate:

- `traceId` - Distributed trace identifier
- `spanId` - Span identifier within trace
- `requestId` - Request identifier

**Backend Example:**
```typescript
// Extract from headers or generate
const traceId = req.headers['x-trace-id'] || generateTraceId();
const spanId = generateSpanId();
const requestId = req.headers['x-request-id'] || generateRequestId();

// Set in request context
req.traceId = traceId;
req.spanId = spanId;
req.requestId = requestId;

// Propagate to downstream services
await httpClient.post(url, data, {
  headers: {
    'x-trace-id': traceId,
    'x-span-id': spanId,
    'x-request-id': requestId
  }
});
```

**Frontend Example:**
```typescript
// Generate or extract trace ID
const traceId = getTraceId() || generateTraceId();
const requestId = generateRequestId();

// Include in API calls
await fetch(url, {
  headers: {
    'x-trace-id': traceId,
    'x-request-id': requestId
  }
});
```

### Rule 15: Trace ID in Logs

**MANDATORY:** Include trace IDs in all logs:

```typescript
logger.info('Processing request', {
  context: 'ApiController',
  operation: 'handleRequest',
  traceId: req.traceId,
  spanId: req.spanId,
  requestId: req.requestId
});
```

### Rule 16: Missing Propagation Detection

**MANDATORY:** If trace propagation is missing, the agent MUST:

1. Add missing propagation hooks
2. Add middleware/decorators for automatic propagation
3. Update existing code to include trace IDs
4. Verify propagation in tests

---

## V. Observability-Driven Tests

### Rule 17: Log Verification Tests

**MANDATORY:** Tests MUST verify required logs were emitted:

```typescript
it('should log error when payment fails', async () => {
  const logSpy = jest.spyOn(logger, 'error');
  
  await expect(service.processPayment(invalidPayment))
    .rejects.toThrow();
  
  expect(logSpy).toHaveBeenCalledWith(
    expect.stringContaining('Payment processing failed'),
    expect.objectContaining({
      context: 'PaymentService',
      operation: 'processPayment',
      errorCode: expect.any(String)
    })
  );
});
```

### Rule 18: Log Metadata Assertions

**MANDATORY:** Tests MUST verify log metadata:

```typescript
it('should include trace ID in logs', async () => {
  const traceId = 'trace-123';
  const logSpy = jest.spyOn(logger, 'info');
  
  await service.processRequest(traceId);
  
  expect(logSpy).toHaveBeenCalledWith(
    expect.any(String),
    expect.objectContaining({
      traceId,
      operation: expect.any(String),
      severity: 'info'
    })
  );
});
```

### Rule 19: Observability Regression Tests

**MANDATORY:** Any fix related to logging/visibility MUST include tests asserting:

- Required logs exist
- Logs have proper severity
- Logs contain specific fields
- Trace IDs are propagated

---

## VI. Integration with Enforcement Pipeline

### Step 1: Mandatory Search

**MANDATORY:** During Step 1, search for:

- Existing logging patterns in similar code
- Trace propagation implementations
- Security event logging examples

### Step 2: Pattern Analysis

**MANDATORY:** During Step 2, verify:

- Logging format matches existing patterns
- Trace propagation follows established approach
- Security logging requirements are met

### Step 3: Rule Compliance Check

**MANDATORY:** During Step 3, verify:

- Structured logging requirements met
- Trace ID propagation present
- Security event logging (if applicable)
- Critical path instrumentation present

### Step 5: Post-Implementation Audit

**MANDATORY:** During Step 5, verify:

- All logs meet structured logging policy
- Observability hooks present
- Trace IDs propagated correctly
- Security events logged (if applicable)
- Tests verify observability requirements

---

## Violations

**HARD STOP violations:**
- Missing structured logging in error paths
- Missing trace ID propagation in service boundaries
- Missing security event logging for auth/permission failures
- Logging sensitive data (passwords, tokens, PII)

**Must fix before proceeding:**
- Missing operation names in logs
- Missing error codes in error logs
- Missing critical path instrumentation
- Missing log verification in tests

---

**Last Updated:** 2025-12-05  
**Status:** Active Enforcement  
**Priority:** CRITICAL - Must be followed for every implementation

