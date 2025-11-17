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

# PRIORITY: CRITICAL - Predictive & Preventative Rules

## Overview

This rule file enforces predictive guardrails, failure mode mapping, data shape drift detection, and regression prevention across all development tasks.

**⚠️ MANDATORY:** All new code must prevent known failure patterns and detect potential issues proactively.

---

## I. Predictive Guardrails Rule

### Rule 1: Past Error Pattern Search

**MANDATORY:** When writing new code or changing existing code, the agent MUST:

1. Search past error patterns in `docs/error-patterns.md`
2. Evaluate whether similar risks exist in the new work
3. Automatically implement guards to prevent repeat failures
4. Add tests specifically preventing known pattern regressions

**Example:**
```typescript
// Pattern: DATABASE_CONNECTION_TIMEOUT (see docs/error-patterns.md)
// Prevention: Always set query timeout and handle connection errors

async queryDatabase(sql: string) {
  // Guard: Set timeout to prevent hanging queries
  const queryTimeout = 5000; // From pattern documentation
  
  try {
    const result = await this.db.query(sql, { timeout: queryTimeout });
    return result;
  } catch (error) {
    // Pattern: Handle connection errors specifically
    if (error.code === 'ETIMEDOUT' || error.code === 'ECONNREFUSED') {
      logger.error('Database connection failed', {
        context: 'DatabaseService',
        operation: 'queryDatabase',
        errorCode: 'DB_CONNECTION_FAILED',
        rootCause: error.message
      });
      throw new DatabaseConnectionError('Database unavailable');
    }
    throw error;
  }
}
```

### Rule 2: Risk Evaluation

**MANDATORY:** For each identified risk from past patterns:

1. **Assess** likelihood of occurrence
2. **Assess** impact if it occurs
3. **Implement** appropriate guardrails
4. **Test** guardrails work correctly

### Rule 3: Guardrail Implementation

**MANDATORY:** Implement guardrails for:

- **Input Validation** - Validate all inputs before processing
- **Timeout Protection** - Set timeouts for all external operations
- **Rate Limiting** - Prevent abuse and overload
- **Resource Limits** - Prevent resource exhaustion
- **Circuit Breakers** - Prevent cascading failures
- **Retry Logic** - Handle transient failures
- **Fallback Strategies** - Provide alternatives on failure

**Example:**
```typescript
class ApiService {
  private circuitBreaker: CircuitBreaker;
  
  constructor() {
    // Guardrail: Circuit breaker to prevent cascading failures
    this.circuitBreaker = new CircuitBreaker({
      failureThreshold: 5,
      resetTimeout: 60000
    });
  }
  
  async callExternalApi(url: string, data: any) {
    // Guardrail: Input validation
    if (!url || typeof url !== 'string') {
      throw new ValidationError('Invalid URL');
    }
    
    // Guardrail: Rate limiting
    await this.rateLimiter.checkLimit('api-calls');
    
    // Guardrail: Circuit breaker
    return this.circuitBreaker.execute(async () => {
      // Guardrail: Timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      try {
        const response = await fetch(url, {
          signal: controller.signal,
          method: 'POST',
          body: JSON.stringify(data)
        });
        clearTimeout(timeoutId);
        return response;
      } catch (error) {
        clearTimeout(timeoutId);
        throw error;
      }
    });
  }
}
```

### Rule 4: Regression Prevention Tests

**MANDATORY:** Add tests specifically preventing known pattern regressions:

```typescript
describe('Regression Prevention: Database Connection Timeout', () => {
  // Pattern: DATABASE_CONNECTION_TIMEOUT (see docs/error-patterns.md)
  // Test ensures the pattern doesn't regress
  
  it('should timeout database queries after 5 seconds', async () => {
    const slowQuery = 'SELECT pg_sleep(10)'; // Query that takes 10 seconds
    
    await expect(service.queryDatabase(slowQuery))
      .rejects.toThrow(DatabaseTimeoutError);
  });
  
  it('should handle connection errors gracefully', async () => {
    // Simulate connection failure
    jest.spyOn(db, 'query').mockRejectedValue({
      code: 'ECONNREFUSED',
      message: 'Connection refused'
    });
    
    await expect(service.queryDatabase('SELECT 1'))
      .rejects.toThrow(DatabaseConnectionError);
  });
});
```

---

## II. Failure Mode Mapping

### Rule 5: Critical Component Failure Mode Mapping

**MANDATORY:** For critical components, the agent MUST map failure modes using:

1. **What Could Go Wrong** - List all possible failure scenarios
2. **How It Should Fail** - Define expected failure behavior
3. **How It Is Logged** - Specify logging requirements
4. **How It Is Recovered** - Define recovery strategies
5. **How Tests Ensure Resilience** - Specify test requirements

**Example Template:**
```typescript
/**
 * Failure Mode Map: PaymentService
 * 
 * Failure Mode 1: Payment Gateway Timeout
 * - What Could Go Wrong: External payment gateway doesn't respond
 * - How It Should Fail: Throw PaymentGatewayTimeoutError after 5s
 * - How It Is Logged: ERROR level with errorCode PAYMENT_GATEWAY_TIMEOUT
 * - How It Is Recovered: Retry with exponential backoff (3 attempts)
 * - How Tests Ensure Resilience: Mock timeout, verify retry logic, verify error handling
 * 
 * Failure Mode 2: Invalid Payment Data
 * - What Could Go Wrong: Payment data validation fails
 * - How It Should Fail: Throw ValidationError immediately
 * - How It Is Logged: WARN level with errorCode INVALID_PAYMENT_DATA
 * - How It Is Recovered: Return error to user, no retry
 * - How Tests Ensure Resilience: Test validation logic, verify error messages
 * 
 * Failure Mode 3: Insufficient Funds
 * - What Could Go Wrong: User account has insufficient funds
 * - How It Should Fail: Throw InsufficientFundsError
 * - How It Is Logged: WARN level with errorCode INSUFFICIENT_FUNDS
 * - How It Is Recovered: Return error to user, suggest adding funds
 * - How Tests Ensure Resilience: Test fund checking logic, verify error handling
 */
```

### Rule 6: Failure Mode Documentation

**MANDATORY:** Document failure modes in:

- Code comments (as shown above)
- `docs/error-patterns.md` (for recurring patterns)
- Component documentation
- Test files (as test descriptions)

### Rule 7: Failure Mode Testing

**MANDATORY:** Tests MUST verify each failure mode:

- Failure occurs as expected
- Logging is correct
- Recovery works (if applicable)
- User experience is appropriate

---

## III. Data Shape Drift Detection

### Rule 8: Schema Change Detection

**MANDATORY:** All changes involving schemas MUST check for drift:

1. **API Payloads** - Request/response shapes
2. **DTOs** - Data transfer objects
3. **Database Models** - Prisma schemas, table structures
4. **Validation Rules** - Zod schemas, validation logic
5. **Contract Between Frontend & Backend** - API contracts
6. **Cross-Service RPC Definitions** - Service-to-service contracts

### Rule 9: Drift Detection Process

**MANDATORY:** When changes affect contracts:

1. **Identify** all affected contracts
2. **Update** types/interfaces
3. **Update** validation schemas
4. **Update** tests
5. **Update** documentation
6. **Update** mock generators
7. **Verify** backward compatibility (if breaking change)

**Example:**
```typescript
// BEFORE: User DTO
interface UserDTO {
  id: string;
  name: string;
  email: string;
}

// AFTER: User DTO (added phone field)
interface UserDTO {
  id: string;
  name: string;
  email: string;
  phone?: string; // New optional field
}

// MANDATORY: Update all related files
// 1. Update Zod schema
const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  phone: z.string().optional() // Updated
});

// 2. Update database model (if applicable)
// 3. Update API documentation
// 4. Update tests
// 5. Update mock generators
// 6. Verify backward compatibility
```

### Rule 10: Contract Verification

**MANDATORY:** Verify contracts are consistent:

- Frontend types match backend DTOs
- API documentation matches implementation
- Validation schemas match types
- Database models match DTOs
- Tests verify contract compliance

### Rule 11: Breaking Change Detection

**MANDATORY:** When making breaking changes:

1. **Document** the breaking change
2. **Version** the API (if applicable)
3. **Provide** migration path
4. **Update** all consumers
5. **Test** backward compatibility handling

---

## IV. Regression Prevention Strategies

### Rule 12: Regression Test Requirements

**MANDATORY:** For every discovered or referenced bug:

1. Create a test that reproduces it
2. Test must fail before the fix
3. Test must pass after the fix
4. Test must prevent regression

**Example:**
```typescript
describe('Regression: Payment Processing Bug #123', () => {
  // Bug: Payment was processed twice when network was slow
  // Fix: Added idempotency key check
  
  it('should not process payment twice with same idempotency key', async () => {
    const idempotencyKey = 'key-123';
    
    // First request
    const result1 = await paymentService.processPayment({
      amount: 100,
      idempotencyKey
    });
    
    // Second request with same key (should return cached result)
    const result2 = await paymentService.processPayment({
      amount: 100,
      idempotencyKey
    });
    
    // Verify same result returned (not processed twice)
    expect(result1.id).toBe(result2.id);
    expect(result1.amount).toBe(result2.amount);
    
    // Verify payment was only processed once
    expect(mockPaymentGateway.process).toHaveBeenCalledTimes(1);
  });
});
```

### Rule 13: Preventative Test Requirements

**MANDATORY:** For any risk identified during Steps 1-2, create preventative tests covering:

- Edge cases
- Boundary inputs
- High-risk operations
- Known past error patterns

**Example:**
```typescript
describe('Preventative Tests: API Rate Limiting', () => {
  // Prevent regression of rate limiting issues
  
  it('should reject requests exceeding rate limit', async () => {
    // Make requests up to limit
    for (let i = 0; i < RATE_LIMIT; i++) {
      await apiService.makeRequest();
    }
    
    // Next request should be rejected
    await expect(apiService.makeRequest())
      .rejects.toThrow(RateLimitError);
  });
  
  it('should reset rate limit after time window', async () => {
    // Exhaust rate limit
    for (let i = 0; i < RATE_LIMIT; i++) {
      await apiService.makeRequest();
    }
    
    // Wait for time window to reset
    await new Promise(resolve => setTimeout(resolve, RATE_LIMIT_WINDOW_MS));
    
    // Should be able to make request again
    await expect(apiService.makeRequest()).resolves.toBeDefined();
  });
});
```

### Rule 14: Pattern-Based Prevention

**MANDATORY:** Apply prevention strategies from `docs/error-patterns.md`:

- Implement guards from patterns
- Add tests from patterns
- Follow prevention strategies
- Reference patterns in code

---

## V. Integration with Enforcement Pipeline

### Step 1: Mandatory Search

**MANDATORY:** During Step 1:

- Search `docs/error-patterns.md` for similar risks
- Evaluate whether similar risks exist
- Identify potential failure modes
- Check for schema drift risks

### Step 2: Pattern Analysis

**MANDATORY:** During Step 2:

- Analyze identified risks
- Plan guardrail implementation
- Plan failure mode mapping
- Plan drift detection

### Step 3: Rule Compliance Check

**MANDATORY:** During Step 3:

- Verify predictive guardrails applied
- Verify failure modes mapped
- Verify schema drift checked
- Verify regression tests planned

### Step 5: Post-Implementation Audit

**MANDATORY:** During Step 5:

- Predictive guardrails applied
- Failure modes mapped and tested
- No schema drift or naming violations
- Regression tests pass
- Preventative tests cover risks

---

## Violations

**HARD STOP violations:**
- Not implementing guardrails for known error patterns
- Not mapping failure modes for critical components
- Not detecting schema drift
- Not creating regression tests for bug fixes

**Must fix before proceeding:**
- Missing preventative tests
- Incomplete failure mode mapping
- Schema changes without contract updates
- Breaking changes without migration path

---

**Last Updated:** 2025-11-16  
**Status:** Active Enforcement  
**Priority:** CRITICAL - Must be followed for every implementation

