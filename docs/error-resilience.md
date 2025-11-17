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
last_updated: 2025-11-16
always_apply: true
---

# PRIORITY: CRITICAL - Error Resilience Rules

## Overview

This rule file enforces fault identification, mandatory error handling, silent failure elimination, and error pattern detection across all development tasks.

**⚠️ MANDATORY:** All error-prone operations must be identified, handled, and tested.

---

## I. Fault Identification & Risk Mapping

### Rule 1: Error-Prone Operation Identification

**MANDATORY:** During Step 1 (Mandatory Search), the agent MUST identify all error-prone operations:

1. **External I/O Operations**
   - API calls (HTTP requests)
   - Database queries
   - File system operations
   - Network requests

2. **Async/Await Operations**
   - Promise chains
   - Async function calls
   - Event handlers
   - Callbacks

3. **User Input Handling**
   - Form submissions
   - URL parameters
   - Request bodies
   - Query strings

4. **Data Parsing and Transformations**
   - JSON parsing
   - Date parsing
   - Type conversions
   - Schema validation

5. **Cross-Service Interactions**
   - Microservice calls
   - Message queue operations
   - Service discovery
   - Load balancing

6. **Authentication/Authorization Flows**
   - Token validation
   - Permission checks
   - Session management
   - Role verification

7. **Caching Layers**
   - Cache reads/writes
   - Cache invalidation
   - Cache failures

8. **Event Emitters & Message Queues**
   - Event publishing
   - Message consumption
   - Queue operations

9. **Concurrency-Sensitive Code**
   - Race conditions
   - Lock acquisition
   - Transaction handling
   - Parallel operations

### Rule 2: Risk Documentation

**MANDATORY:** For each identified risk, document or infer:

- **Root Cause** - What could cause the failure?
- **Expected vs. Actual Behavior** - What should happen vs. what could go wrong?
- **Boundary Conditions** - Edge cases, limits, thresholds
- **Failure Triggers** - Specific conditions that cause failure
- **Potential Downstream Effects** - How does this failure affect other components?

**Example:**
```typescript
// Risk: Database query failure
// Root Cause: Network issues, database unavailable, query timeout
// Expected: Query returns results
// Actual: Query throws exception or times out
// Boundary: Large result sets, complex joins
// Failure Triggers: Network partition, database overload
// Downstream: API returns 500, user sees error, data inconsistency
```

---

## II. Mandatory Error Handling Block Enforcement

### Rule 3: No Silent Failures

**MANDATORY:** All error paths MUST:

- ❌ Never silently swallow exceptions
- ❌ Never use empty catch blocks
- ❌ Never ignore promise rejections
- ✅ Always log errors with context
- ✅ Always handle errors appropriately
- ✅ Always provide user feedback (when applicable)

**WRONG:**
```typescript
try {
  await riskyOperation();
} catch (error) {
  // Silent failure - VIOLATION
}
```

**RIGHT:**
```typescript
try {
  await riskyOperation();
} catch (error) {
  logger.error('Risky operation failed', {
    context: 'ServiceName',
    operation: 'riskyOperation',
    errorCode: 'OPERATION_FAILED',
    rootCause: error.message
  });
  throw error; // Or handle appropriately
}
```

### Rule 4: Error Handling Requirements

**MANDATORY:** All external calls MUST be wrapped with:

1. **Guards** - Pre-validation before operations
2. **Timeouts** - Prevent hanging operations
3. **Try/Catch** - Catch and handle errors
4. **Fallback Strategies** - Alternative behavior on failure
5. **Predictable Return Contracts** - Consistent return types

**Example:**
```typescript
async fetchWithTimeout(url: string, timeoutMs: number = 5000) {
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
    // Fallback: Return default or retry
    logger.error('Fetch failed', {
      context: 'HttpService',
      operation: 'fetchWithTimeout',
      url,
      errorCode: 'FETCH_FAILED',
      rootCause: error.message
    });
    
    // Fallback strategy
    return this.getCachedData(url) || null;
  }
}
```

### Rule 5: Error Message Requirements

**MANDATORY:** Error messages MUST be:

- Human-readable
- Contextual (include operation, context)
- Diagnostic (include error code, root cause)
- Actionable (suggest next steps when possible)

**Example:**
```typescript
throw new Error(
  `Failed to process payment for order ${orderId}. ` +
  `Reason: ${error.message}. ` +
  `Please retry or contact support if issue persists.`
);
```

### Rule 6: Error Object Metadata

**MANDATORY:** Error objects MUST contain:

- Context (where the error occurred)
- Operation (what operation failed)
- Expected invariants (what should have been true)
- Diagnostic metadata (error code, timestamp, trace ID)

**Example:**
```typescript
class OperationError extends Error {
  constructor(
    message: string,
    public context: string,
    public operation: string,
    public errorCode: string,
    public expectedInvariants: string[],
    public traceId?: string
  ) {
    super(message);
    this.name = 'OperationError';
  }
}
```

---

## III. Silent Failure Elimination

### Rule 7: Empty Catch Block Detection

**MANDATORY:** The agent MUST automatically detect and fix:

- Empty catch blocks
- Catch blocks that only log without handling
- Catch blocks that return undefined/null without context

**Detection Pattern:**
```typescript
// VIOLATION: Empty catch block
try {
  await operation();
} catch (error) {
  // Empty - must fix
}

// FIXED: Proper error handling
try {
  await operation();
} catch (error) {
  logger.error('Operation failed', {
    context: 'ServiceName',
    operation: 'operation',
    errorCode: 'OPERATION_FAILED',
    rootCause: error.message
  });
  throw error; // Or handle appropriately
}
```

### Rule 8: Console Log Instead of Structured Log

**MANDATORY:** Replace console.log/error with structured logging:

**WRONG:**
```typescript
catch (error) {
  console.error('Error:', error);
}
```

**RIGHT:**
```typescript
catch (error) {
  logger.error('Operation failed', {
    context: 'ServiceName',
    operation: 'operation',
    errorCode: 'OPERATION_FAILED',
    rootCause: error.message
  });
}
```

### Rule 9: Missing Await Detection

**MANDATORY:** Detect and fix missing awaits:

**WRONG:**
```typescript
async function process() {
  riskyOperation(); // Missing await - promise rejection unhandled
}
```

**RIGHT:**
```typescript
async function process() {
  try {
    await riskyOperation();
  } catch (error) {
    logger.error('Operation failed', {
      context: 'ServiceName',
      operation: 'riskyOperation',
      errorCode: 'OPERATION_FAILED',
      rootCause: error.message
    });
    throw error;
  }
}
```

### Rule 10: Swallowed Promise Detection

**MANDATORY:** Detect and fix swallowed promises:

**WRONG:**
```typescript
function process() {
  riskyOperation().catch(() => {}); // Swallowed promise
}
```

**RIGHT:**
```typescript
async function process() {
  try {
    await riskyOperation();
  } catch (error) {
    logger.error('Operation failed', {
      context: 'ServiceName',
      operation: 'riskyOperation',
      errorCode: 'OPERATION_FAILED',
      rootCause: error.message
    });
    throw error;
  }
}
```

### Rule 11: Conditionals Obscuring Failures

**MANDATORY:** Detect conditionals that hide real failures:

**WRONG:**
```typescript
const result = await operation();
if (!result) {
  return; // Hides the actual error
}
```

**RIGHT:**
```typescript
try {
  const result = await operation();
  if (!result) {
    logger.warn('Operation returned no result', {
      context: 'ServiceName',
      operation: 'operation',
      errorCode: 'NO_RESULT'
    });
    return null; // Explicit handling
  }
  return result;
} catch (error) {
  logger.error('Operation failed', {
    context: 'ServiceName',
    operation: 'operation',
    errorCode: 'OPERATION_FAILED',
    rootCause: error.message
  });
  throw error;
}
```

### Rule 12: Hidden Asynchronous Failures

**MANDATORY:** Detect hidden async failures:

**WRONG:**
```typescript
setTimeout(() => {
  riskyOperation(); // Failure is hidden
}, 1000);
```

**RIGHT:**
```typescript
setTimeout(async () => {
  try {
    await riskyOperation();
  } catch (error) {
    logger.error('Async operation failed', {
      context: 'ServiceName',
      operation: 'riskyOperation',
      errorCode: 'ASYNC_OPERATION_FAILED',
      rootCause: error.message
    });
    // Handle error appropriately
  }
}, 1000);
```

---

## IV. Error Pattern Detection

### Rule 13: Pattern Matching Against Known Errors

**MANDATORY:** During Step 1, search `docs/error-patterns.md` for:

- Similar past issues
- Known error patterns
- Historical fixes
- Prevention strategies

**MANDATORY:** Apply known patterns proactively to prevent recurring issues.

### Rule 14: Pattern Documentation

**MANDATORY:** When fixing errors, document patterns in `docs/error-patterns.md`:

- Summary of the error
- Root cause
- Triggering conditions
- Relevant code/modules
- How it was fixed
- How to prevent it in the future
- Similar historical issues

---

## V. Integration with Enforcement Pipeline

### Step 1: Mandatory Search

**MANDATORY:** During Step 1:

- Identify all error-prone operations
- Search `docs/error-patterns.md` for similar issues
- Map risks for external I/O, async operations, user input, etc.

### Step 2: Pattern Analysis

**MANDATORY:** During Step 2:

- Analyze identified risks
- Check for known error patterns
- Verify error handling patterns match existing codebase

### Step 3: Rule Compliance Check

**MANDATORY:** During Step 3:

- Verify error handling blocks present
- Check for silent failures
- Verify error messages are human-readable
- Verify error objects contain diagnostic metadata

### Step 5: Post-Implementation Audit

**MANDATORY:** During Step 5:

- All error paths have tests
- No silent failures remain
- Error handling meets requirements
- Pattern files updated (if needed)

---

## Violations

**HARD STOP violations:**
- Empty catch blocks
- Silent failures
- Missing error handling in error-prone operations
- Swallowed promises
- Missing awaits in async operations

**Must fix before proceeding:**
- Console.log instead of structured logging
- Missing error codes in error logs
- Missing error handling tests
- Conditionals obscuring failures

---

**Last Updated:** 2025-11-16  
**Status:** Active Enforcement  
**Priority:** CRITICAL - Must be followed for every implementation

