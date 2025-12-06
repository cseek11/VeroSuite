# R08: Structured Logging — Step 5 Procedures (DRAFT)

**Status:** DRAFT - Awaiting Human Review  
**Created:** 2025-12-04  
**Rule:** R08 - Structured Logging  
**Priority:** HIGH (Tier 2 - OVERRIDE)  
**MAD Tier:** 2 (OVERRIDE REQUIRED - Needs justification)

---

## Purpose

R08 ensures that all logs are structured (JSON-like format) with required fields including traceId, context, operation, severity, and additional contextual fields. This complements R07 (Error Handling) which ensures errors are logged - R08 ensures logs are properly structured.

**Key Requirements:**
- All logs use structured format (JSON-like)
- Required fields: level, message, timestamp, traceId, context, operation, severity
- Optional fields: tenantId, userId, errorCode, rootCause, additionalData
- No console.log in production code
- Use centralized logger utilities

---

## Step 5: Post-Implementation Audit for Structured Logging

### R08: Structured Logging — Audit Procedures

**For code changes affecting logging:**

#### Structured Logging Format

- [ ] **MANDATORY:** Verify all logs use structured logger (not console.log/error)
- [ ] **MANDATORY:** Verify logs are JSON-like format (structured, not free-text)
- [ ] **MANDATORY:** Verify logs include required fields: level, message, timestamp, traceId, context, operation, severity
- [ ] **MANDATORY:** Verify logs include optional fields when applicable: tenantId, userId, errorCode, rootCause, additionalData

#### Required Fields Verification

- [ ] **MANDATORY:** Verify `level` field exists (log, error, warn, debug, verbose)
- [ ] **MANDATORY:** Verify `message` field exists (human-readable message)
- [ ] **MANDATORY:** Verify `timestamp` field exists (ISO 8601 format)
- [ ] **MANDATORY:** Verify `traceId` field exists (distributed trace identifier)
- [ ] **MANDATORY:** Verify `context` field exists (service, module, component name)
- [ ] **MANDATORY:** Verify `operation` field exists (function, endpoint, action)
- [ ] **MANDATORY:** Verify `severity` field exists (info, warn, error, debug, verbose)

#### Optional Fields Verification

- [ ] **MANDATORY:** Verify `tenantId` included when applicable (multi-tenant operations)
- [ ] **MANDATORY:** Verify `userId` included when applicable (user-scoped operations)
- [ ] **MANDATORY:** Verify `errorCode` included for error logs (error classification)
- [ ] **MANDATORY:** Verify `rootCause` included for error logs (root cause description)
- [ ] **MANDATORY:** Verify `additionalData` included when needed (extra context)

#### Console.log Detection

- [ ] **MANDATORY:** Verify no console.log in production code
- [ ] **MANDATORY:** Verify no console.error in production code
- [ ] **MANDATORY:** Verify no console.warn in production code
- [ ] **MANDATORY:** Verify no console.info in production code
- [ ] **MANDATORY:** Verify no console.debug in production code

#### Logger Utility Usage

- [ ] **MANDATORY:** Verify centralized logger utilities are used (StructuredLoggerService, Logger)
- [ ] **MANDATORY:** Verify logger is injected/imported correctly
- [ ] **MANDATORY:** Verify logger methods match required signature (message, context, operation, etc.)

#### Trace ID Propagation

- [ ] **MANDATORY:** Verify traceId is generated for each incoming request
- [ ] **MANDATORY:** Verify traceId propagates through service calls
- [ ] **MANDATORY:** Verify traceId propagates into DB/logging layer
- [ ] **MANDATORY:** Verify traceId propagates into external calls
- [ ] **MANDATORY:** Verify all logs for a request include the same traceId

#### Logging Coverage

- [ ] **MANDATORY:** Verify important operations have at least one meaningful log
- [ ] **MANDATORY:** Verify errors are logged once, near their source
- [ ] **MANDATORY:** Verify critical paths have appropriate logging (entry, exit, errors)

#### Automated Checks

```bash
# Run structured logging checker
python .cursor/scripts/check-structured-logging.py --file <file_path>

# Check all changed files
python .cursor/scripts/check-structured-logging.py --pr <PR_NUMBER>

# Expected: No violations found
```

#### OPA Policy

- **Policy:** `services/opa/policies/observability.rego` (R08 section)
- **Enforcement:** OVERRIDE (Tier 2 MAD) - Requires justification
- **Tests:** `services/opa/tests/observability_r08_test.rego`

#### Manual Verification (When Needed)

1. **Review Logging Calls** - Identify all logging statements in changed code
2. **Verify Structured Format** - Check logs use structured logger with required fields
3. **Check Trace ID** - Verify traceId is present and propagates correctly
4. **Validate Logger Usage** - Verify centralized logger utilities are used

**Example Console.log (VIOLATION):**

```typescript
// ❌ VIOLATION: Console.log instead of structured logging
console.log('Processing payment');
console.error('Payment failed:', error);
```

**Example Structured Logging (CORRECT):**

```typescript
// ✅ CORRECT: Structured logging with required fields
this.logger.info(
  'Processing payment',
  'PaymentService',
  requestId,
  'processPayment',
  { paymentId: paymentData.id }
);

this.logger.error(
  'Payment failed',
  'PaymentService',
  requestId,
  'processPayment',
  {
    errorCode: 'PAYMENT_FAILED',
    rootCause: error.message,
    paymentId: paymentData.id
  }
);
```

**Example Missing Required Fields (VIOLATION):**

```typescript
// ❌ VIOLATION: Missing required fields (traceId, context, operation)
logger.log('Processing payment'); // Missing context, operation, traceId
```

**Example Complete Structured Log (CORRECT):**

```typescript
// ✅ CORRECT: Complete structured log with all required fields
this.logger.info(
  'Processing payment',           // message
  'PaymentService',               // context
  requestId,                      // requestId (for traceId propagation)
  'processPayment',               // operation
  {                               // additionalData
    paymentId: paymentData.id,
    amount: paymentData.amount,
    currency: paymentData.currency
  }
);

// Resulting log entry:
{
  "timestamp": "2025-11-23T10:30:00.000Z",
  "level": "log",
  "message": "Processing payment",
  "context": "PaymentService",
  "operation": "processPayment",
  "severity": "info",
  "traceId": "trace-123",
  "requestId": "req-456",
  "tenantId": "tenant-789",
  "userId": "user-abc",
  "additionalData": {
    "paymentId": "pay-123",
    "amount": 100.00,
    "currency": "USD"
  }
}
```

**Example Trace ID Propagation (CORRECT):**

```typescript
// ✅ CORRECT: Trace ID propagates through service calls
@Injectable()
export class PaymentService {
  constructor(
    private readonly logger: StructuredLoggerService,
    private readonly requestContext: RequestContextService
  ) {}

  async processPayment(paymentData: PaymentData) {
    const traceId = this.requestContext.getTraceId(); // Get traceId from request
    
    this.logger.info(
      'Processing payment',
      'PaymentService',
      this.requestContext.getRequestId(),
      'processPayment',
      { paymentId: paymentData.id }
    );
    
    // TraceId propagates to downstream service
    await this.downstreamService.process(traceId, paymentData);
  }
}
```

**Example Missing Trace ID (VIOLATION):**

```typescript
// ❌ VIOLATION: Log missing traceId
this.logger.info(
  'Processing payment',
  'PaymentService',
  undefined, // Missing requestId (needed for traceId)
  'processPayment'
);
```

---

**Last Updated:** 2025-12-04  
**Maintained By:** Platform Core Team  
**Review Frequency:** Quarterly or when observability requirements change





