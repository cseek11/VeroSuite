# R07: Error Handling — Step 5 Procedures (DRAFT)

**Status:** DRAFT - Awaiting Human Review  
**Created:** 2025-11-23  
**Rule:** R07 - Error Handling  
**Priority:** HIGH (Tier 2 - OVERRIDE)  
**MAD Tier:** 2 (OVERRIDE REQUIRED - Needs justification)

---

## Purpose

R07 ensures that all error-prone operations have proper error handling, eliminates silent failures, and enforces observable error paths with structured logging.

**Key Requirements:**
- No empty catch blocks
- No swallowed promises
- All errors logged with traceId and context
- All errors categorized (validation, business rule, system)
- User-facing messages are safe and helpful

---

## Step 5: Post-Implementation Audit for Error Handling

### R07: Error Handling — Audit Procedures

**For code changes affecting error-prone operations:**

#### Silent Failure Detection

- [ ] **MANDATORY:** Verify no empty catch blocks (`catch (error) { }` or `catch { }`)
- [ ] **MANDATORY:** Verify no swallowed promises (`.catch(() => {})` or `.catch(() => { /* empty */ })`)
- [ ] **MANDATORY:** Verify no missing awaits (promises not awaited in async functions)
- [ ] **MANDATORY:** Verify no ignored promise results (promises without error handling)

#### Error Handling Coverage

- [ ] **MANDATORY:** Verify all external I/O operations wrapped in try/catch (API calls, database queries, file operations)
- [ ] **MANDATORY:** Verify all async/await operations have error handling
- [ ] **MANDATORY:** Verify all user input handling has validation and error handling
- [ ] **MANDATORY:** Verify all data parsing operations have error handling (JSON parsing, date parsing, type conversions)
- [ ] **MANDATORY:** Verify all cross-service interactions have error handling (microservice calls, message queues)

#### Error Logging

- [ ] **MANDATORY:** Verify all errors are logged with structured logging (not console.log/error)
- [ ] **MANDATORY:** Verify error logs include: context, operation, errorCode, rootCause, traceId
- [ ] **MANDATORY:** Verify error logs include tenantId (where applicable)
- [ ] **MANDATORY:** Verify error logs are structured (JSON format)

#### Error Categorization

- [ ] **MANDATORY:** Verify errors are categorized correctly:
  - Validation errors → 400 (user fixable)
  - Business rule errors → 422 (domain constraints)
  - System errors → 500 (infrastructure or unknown)
- [ ] **MANDATORY:** Verify backend maps errors to appropriate HTTP responses
- [ ] **MANDATORY:** Verify frontend shows appropriate UX messages

#### User-Facing Messages

- [ ] **MANDATORY:** Verify error messages don't leak stack traces
- [ ] **MANDATORY:** Verify error messages don't leak internal IDs or secrets
- [ ] **MANDATORY:** Verify error messages are user-friendly and actionable
- [ ] **MANDATORY:** Verify error messages are concise and helpful

#### Error Propagation

- [ ] **MANDATORY:** Verify errors are either handled appropriately or propagated with context
- [ ] **MANDATORY:** Verify error propagation maintains traceId
- [ ] **MANDATORY:** Verify error propagation includes original error context

#### Error Handling Tests

- [ ] **MANDATORY:** Verify error paths have test coverage
- [ ] **MANDATORY:** Verify tests cover: error logging, error categorization, error propagation
- [ ] **MANDATORY:** Verify tests verify user-facing messages are safe

#### Automated Checks

```bash
# Run error handling checker
python .cursor/scripts/check-error-handling.py --file <file_path>

# Check all changed files
python .cursor/scripts/check-error-handling.py --pr <PR_NUMBER>

# Expected: No violations found
```

#### OPA Policy

- **Policy:** `services/opa/policies/error-handling.rego` (NEW)
- **Enforcement:** OVERRIDE (Tier 2 MAD) - Requires justification
- **Tests:** `services/opa/tests/error_handling_r07_test.rego`

#### Manual Verification (When Needed)

1. **Review Error-Prone Operations** - Identify all risky operations in changed code
2. **Verify Error Handling** - Check all risky operations have try/catch or error handling
3. **Check Error Logging** - Verify errors are logged with structured logging
4. **Validate Error Messages** - Verify user-facing messages are safe and helpful

**Example Empty Catch Block (VIOLATION):**

```typescript
// ❌ VIOLATION: Empty catch block
try {
  await riskyOperation();
} catch (error) {
  // Silent failure - VIOLATION
}
```

**Example Proper Error Handling (CORRECT):**

```typescript
// ✅ CORRECT: Proper error handling
try {
  await riskyOperation();
} catch (error) {
  logger.error('Risky operation failed', {
    context: 'ServiceName',
    operation: 'riskyOperation',
    errorCode: 'OPERATION_FAILED',
    rootCause: error.message,
    traceId: this.requestContext.getTraceId(),
    tenantId: this.requestContext.getTenantId()
  });
  
  // Handle appropriately: throw, return default, or retry
  throw new OperationError(
    'Failed to complete operation. Please try again.',
    'ServiceName',
    'riskyOperation',
    'OPERATION_FAILED',
    ['Operation should complete successfully'],
    this.requestContext.getTraceId()
  );
}
```

**Example Swallowed Promise (VIOLATION):**

```typescript
// ❌ VIOLATION: Swallowed promise
function process() {
  riskyOperation().catch(() => {}); // Silent failure
}
```

**Example Proper Promise Handling (CORRECT):**

```typescript
// ✅ CORRECT: Proper promise handling
async function process() {
  try {
    await riskyOperation();
  } catch (error) {
    logger.error('Operation failed', {
      context: 'ServiceName',
      operation: 'riskyOperation',
      errorCode: 'OPERATION_FAILED',
      rootCause: error.message,
      traceId: this.requestContext.getTraceId()
    });
    throw error;
  }
}
```

**Example Missing Await (VIOLATION):**

```typescript
// ❌ VIOLATION: Missing await
async function process() {
  riskyOperation(); // Promise rejection unhandled
}
```

**Example Proper Await (CORRECT):**

```typescript
// ✅ CORRECT: Proper await with error handling
async function process() {
  try {
    await riskyOperation();
  } catch (error) {
    logger.error('Operation failed', {
      context: 'ServiceName',
      operation: 'riskyOperation',
      errorCode: 'OPERATION_FAILED',
      rootCause: error.message,
      traceId: this.requestContext.getTraceId()
    });
    throw error;
  }
}
```

**Example Error Categorization:**

```typescript
// ✅ CORRECT: Proper error categorization
try {
  await validateInput(input);
  await processBusinessRule(input);
  await saveToDatabase(input);
} catch (error) {
  if (error instanceof ValidationError) {
    // Validation error → 400
    throw new BadRequestException(error.message);
  } else if (error instanceof BusinessRuleError) {
    // Business rule error → 422
    throw new UnprocessableEntityException(error.message);
  } else {
    // System error → 500
    logger.error('System error', {
      context: 'ServiceName',
      operation: 'process',
      errorCode: 'SYSTEM_ERROR',
      rootCause: error.message,
      traceId: this.requestContext.getTraceId()
    });
    throw new InternalServerErrorException('An unexpected error occurred');
  }
}
```

**Example User-Facing Message:**

```typescript
// ✅ CORRECT: User-friendly error message
catch (error) {
  // Log full error details (for debugging)
  logger.error('Failed to save work order', {
    context: 'WorkOrderService',
    operation: 'save',
    errorCode: 'SAVE_FAILED',
    rootCause: error.message,
    workOrderId: workOrder.id,
    traceId: this.requestContext.getTraceId()
  });
  
  // Return user-friendly message (no stack trace, no internal IDs)
  throw new BadRequestException(
    'Unable to save work order. Please check required fields and try again.'
  );
}
```

---

**Last Updated:** 2025-11-23  
**Maintained By:** Platform Core Team  
**Review Frequency:** Quarterly or when error handling requirements change



