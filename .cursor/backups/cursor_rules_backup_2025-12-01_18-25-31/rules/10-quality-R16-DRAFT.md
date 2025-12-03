# R16: Testing Requirements (Additional) — Step 5 Procedures (DRAFT)

**Status:** DRAFT - Awaiting Human Review  
**Created:** 2025-11-23  
**Rule:** R16 - Testing Requirements (Additional)  
**Priority:** MEDIUM (Tier 3 - WARNING)  
**MAD Tier:** 3 (WARNING - Logged but doesn't block)

---

## Purpose

R16 ensures that code changes include **additional testing requirements** beyond basic unit/regression/integration/E2E tests covered by R10. These requirements are context-specific and depend on the type of change (new feature, bug fix, refactor, etc.) and the domain (security, state machines, observability, etc.).

**Key Requirements:**
- Error path tests for all new features (comprehensive error scenario coverage)
- State machine tests for stateful components (legal/illegal transitions)
- Tenant isolation tests for multi-tenant features (data isolation verification)
- Behavior-diff tests for refactoring (behavior preservation verification)
- Preventative tests for bug fixes (root cause prevention)
- Observability tests for all new features (structured logging, trace IDs)
- Security tests for sensitive operations (authentication, payment, PII)
- Data migration tests for schema changes (migration integrity)
- Contract/API tests for microservices (API contract adherence)
- Performance tests for performance-critical features (response time verification)
- Accessibility tests for UI components (WCAG AA compliance)
- Other context-specific tests as needed

**Relationship to R10:**
- R10 covers: Unit tests, regression tests, integration/E2E tests, coverage thresholds
- R16 covers: Additional context-specific tests (error paths, state machines, tenant isolation, observability, security, etc.)

---

## Step 5: Post-Implementation Audit for Additional Testing Requirements

### R16: Testing Requirements (Additional) — Audit Procedures

**For code changes affecting functionality, security, state machines, observability, or multi-tenant features:**

#### Error Path Testing

- [ ] **MANDATORY:** Verify error path tests exist for all new features
- [ ] **MANDATORY:** Verify error path tests cover all error scenarios (validation errors, business rule errors, system errors)
- [ ] **MANDATORY:** Verify error path tests verify error categorization (400, 422, 500)
- [ ] **MANDATORY:** Verify error path tests verify user-friendly error messages (no stack traces, no internal IDs)
- [ ] **MANDATORY:** Verify error path tests verify error logging (structured logging, trace IDs)
- [ ] **RECOMMENDED:** Verify error path tests cover edge cases (null/undefined, empty inputs, boundary conditions)

#### State Machine Testing

- [ ] **MANDATORY:** Verify state machine tests exist for stateful components (if applicable)
- [ ] **MANDATORY:** Verify state machine tests cover legal transitions (all documented transitions)
- [ ] **MANDATORY:** Verify state machine tests cover illegal transitions (explicit rejection)
- [ ] **MANDATORY:** Verify state machine tests verify audit logging on transitions
- [ ] **MANDATORY:** Verify state machine tests verify preconditions (e.g., technician assigned, date set)
- [ ] **RECOMMENDED:** Verify state machine tests cover side effects (events, notifications)

#### Tenant Isolation Testing

- [ ] **MANDATORY:** Verify tenant isolation tests exist for multi-tenant features (if applicable)
- [ ] **MANDATORY:** Verify tenant isolation tests verify cross-tenant data access is prevented
- [ ] **MANDATORY:** Verify tenant isolation tests verify RLS policies are enforced
- [ ] **MANDATORY:** Verify tenant isolation tests verify tenant context is set correctly
- [ ] **MANDATORY:** Verify tenant isolation tests verify tenant_id is extracted from JWT (not client)
- [ ] **RECOMMENDED:** Verify tenant isolation tests cover edge cases (tenant switching, tenant deletion)

#### Behavior-Diff Testing (Refactoring)

- [ ] **MANDATORY:** Verify behavior-diff tests exist for refactoring (if applicable)
- [ ] **MANDATORY:** Verify behavior-diff tests verify behavior unchanged (before/after comparison)
- [ ] **MANDATORY:** Verify behavior-diff tests verify all existing tests pass
- [ ] **MANDATORY:** Verify behavior-diff tests verify test coverage maintained
- [ ] **RECOMMENDED:** Verify behavior-diff tests verify performance characteristics maintained

#### Preventative Testing (Bug Fixes)

- [ ] **MANDATORY:** Verify preventative tests exist for bug fixes (if applicable)
- [ ] **MANDATORY:** Verify preventative tests verify root cause prevention (pattern detection)
- [ ] **MANDATORY:** Verify preventative tests verify similar bugs prevented (heuristic checks)
- [ ] **MANDATORY:** Verify preventative tests verify error pattern documented in `docs/error-patterns.md`
- [ ] **RECOMMENDED:** Verify preventative tests verify predictive guardrails applied

#### Observability Testing

- [ ] **MANDATORY:** Verify observability tests exist for all new features
- [ ] **MANDATORY:** Verify observability tests verify structured logging (required fields: level, message, timestamp, traceId, context, operation)
- [ ] **MANDATORY:** Verify observability tests verify trace ID propagation (through service calls, HTTP headers, database queries)
- [ ] **MANDATORY:** Verify observability tests verify tenant ID in logs (where applicable)
- [ ] **MANDATORY:** Verify observability tests verify no console.log in production code
- [ ] **RECOMMENDED:** Verify observability tests verify metrics collection (latency, error rate, etc.)

#### Security Testing

- [ ] **MANDATORY:** Verify security tests exist for sensitive operations (authentication, payment, PII handling)
- [ ] **MANDATORY:** Verify security tests verify authentication (JWT validation, token expiration, tenant context)
- [ ] **MANDATORY:** Verify security tests verify authorization (permission checks, role-based access)
- [ ] **MANDATORY:** Verify security tests verify input validation (XSS prevention, SQL injection prevention, file upload validation)
- [ ] **MANDATORY:** Verify security tests verify tenant isolation (cross-tenant access prevention)
- [ ] **RECOMMENDED:** Verify security tests verify security event logging (audit logs for auth, PII access, admin actions)

#### Data Migration Testing

- [ ] **MANDATORY:** Verify data migration tests exist for database schema changes (if applicable)
- [ ] **MANDATORY:** Verify data migration tests verify migration idempotency (can run multiple times)
- [ ] **MANDATORY:** Verify data migration tests verify data integrity (no data loss, no corruption)
- [ ] **MANDATORY:** Verify data migration tests verify rollback capability (can rollback safely)
- [ ] **MANDATORY:** Verify data migration tests verify RLS policies maintained (if tenant-scoped tables)
- [ ] **RECOMMENDED:** Verify data migration tests verify performance impact (migration time, downtime)

#### Contract/API Testing

- [ ] **RECOMMENDED:** Verify contract/API tests exist for microservices (if applicable)
- [ ] **RECOMMENDED:** Verify contract/API tests verify API contract adherence (request/response schemas)
- [ ] **RECOMMENDED:** Verify contract/API tests verify breaking changes detection (schema versioning)
- [ ] **RECOMMENDED:** Verify contract/API tests verify backward compatibility (if applicable)
- [ ] **RECOMMENDED:** Verify contract/API tests verify event schemas (if producing/consuming events)

#### Performance Testing

- [ ] **CONDITIONAL:** Verify performance tests exist for performance-critical features (if applicable)
- [ ] **CONDITIONAL:** Verify performance tests verify response time thresholds (p50, p95, p99)
- [ ] **CONDITIONAL:** Verify performance tests verify performance budgets (backend: < 200ms simple GET, < 300ms POST/PUT)
- [ ] **CONDITIONAL:** Verify performance tests verify no N+1 queries (if applicable)
- [ ] **CONDITIONAL:** Verify performance tests verify no redundant API calls (if applicable)
- [ ] **CONDITIONAL:** Verify performance tests verify database indexes (if applicable)

#### Accessibility Testing

- [ ] **CONDITIONAL:** Verify accessibility tests exist for UI components (if applicable)
- [ ] **CONDITIONAL:** Verify accessibility tests verify WCAG AA compliance (keyboard navigation, screen readers, color contrast)
- [ ] **CONDITIONAL:** Verify accessibility tests verify ARIA labels (if applicable)
- [ ] **CONDITIONAL:** Verify accessibility tests verify focus management (if applicable)
- [ ] **CONDITIONAL:** Verify accessibility tests verify responsive design (mobile accessibility)

#### Other Context-Specific Tests

- [ ] **CONDITIONAL:** Verify property-based tests exist for complex business logic (if applicable)
- [ ] **CONDITIONAL:** Verify snapshot/visual regression tests exist for UI components (if applicable)
- [ ] **CONDITIONAL:** Verify chaos/resilience tests exist for distributed systems (if applicable)
- [ ] **CONDITIONAL:** Verify concurrency/race condition tests exist for multi-threaded operations (if applicable)
- [ ] **CONDITIONAL:** Verify compliance tests exist for regulated data (GDPR, HIPAA, PCI-DSS) (if applicable)

#### Test Quality and Organization

- [ ] **MANDATORY:** Verify additional tests follow naming conventions (e.g., `*.spec.ts`, `*.test.ts`)
- [ ] **MANDATORY:** Verify additional tests follow location conventions (e.g., `__tests__/`, `test/`)
- [ ] **MANDATORY:** Verify additional tests are organized by test type (error paths, state machines, tenant isolation, etc.)
- [ ] **MANDATORY:** Verify additional tests are documented (test purpose, when to run, expected results)
- [ ] **RECOMMENDED:** Verify additional tests are grouped logically (by feature, by domain, by test type)

#### Automated Checks

```bash
# Run additional testing requirements checker
python .cursor/scripts/check-additional-testing.py --file <file_path>

# Check all changed files
python .cursor/scripts/check-additional-testing.py --pr <PR_NUMBER>

# Check specific test type
python .cursor/scripts/check-additional-testing.py --test-type error-path

# Expected: Warnings for missing additional tests (does not block)
```

#### OPA Policy

- **Policy:** `services/opa/policies/quality.rego` (R16 section)
- **Enforcement:** WARNING (Tier 3 MAD) - Logged but doesn't block
- **Tests:** `services/opa/tests/quality_r16_test.rego`

#### Manual Verification (When Needed)

1. **Review Code Changes** - Identify what type of change (new feature, bug fix, refactor) and domain (security, state machines, observability, multi-tenant)
2. **Verify Test Coverage** - Check that appropriate additional tests exist based on change type and domain
3. **Check Test Quality** - Verify tests follow conventions, are organized, and are documented
4. **Validate Test Execution** - Run tests and verify they pass

**Example Missing Error Path Tests (❌):**

```typescript
// ❌ VIOLATION: New feature without error path tests
// apps/api/src/users/users.service.ts
export class UsersService {
  async createUser(userData: CreateUserDto) {
    // New feature - only happy path tested
    return this.prisma.user.create({ data: userData });
  }
}

// apps/api/src/users/users.service.spec.ts
describe('UsersService', () => {
  describe('createUser', () => {
    it('should create user successfully', async () => {
      // Only happy path tested - missing error path tests
    });
  });
});
```

**Example Proper Error Path Tests (✅):**

```typescript
// ✅ CORRECT: New feature with comprehensive error path tests
// apps/api/src/users/users.service.spec.ts
describe('UsersService', () => {
  describe('createUser', () => {
    it('should create user successfully (happy path)', async () => {
      // Happy path test
    });
    
    it('should throw BadRequestException on invalid email (validation error)', async () => {
      // Error path: validation error (400)
    });
    
    it('should throw UnprocessableEntityException on duplicate email (business rule error)', async () => {
      // Error path: business rule error (422)
    });
    
    it('should throw InternalServerErrorException on database error (system error)', async () => {
      // Error path: system error (500)
    });
    
    it('should log error with traceId and tenantId', async () => {
      // Observability test: error logging
    });
  });
});
```

**Example Missing State Machine Tests (❌):**

```typescript
// ❌ VIOLATION: Stateful component without state machine tests
// apps/api/src/work-orders/work-orders.service.ts
async transitionStatus(id: string, newStatus: WorkOrderStatus) {
  // State transition logic - no tests for legal/illegal transitions
  return this.prisma.workOrder.update({
    where: { id },
    data: { status: newStatus }
  });
}
```

**Example Proper State Machine Tests (✅):**

```typescript
// ✅ CORRECT: Stateful component with state machine tests
// apps/api/src/work-orders/work-orders.service.spec.ts
describe('WorkOrdersService - State Machine', () => {
  describe('transitionStatus', () => {
    it('should allow transition from DRAFT to SCHEDULED (legal transition)', async () => {
      // Legal transition test
    });
    
    it('should reject transition from DRAFT to COMPLETED (illegal transition)', async () => {
      // Illegal transition test
    });
    
    it('should reject transition from COMPLETED to any state (terminal state)', async () => {
      // Terminal state test
    });
    
    it('should emit audit log on state transition', async () => {
      // Audit logging test
    });
  });
});
```

**Example Missing Tenant Isolation Tests (❌):**

```typescript
// ❌ VIOLATION: Multi-tenant feature without tenant isolation tests
// apps/api/src/customers/customers.service.ts
async getCustomer(id: string) {
  // Multi-tenant query - no tests for tenant isolation
  return this.prisma.customer.findUnique({ where: { id } });
}
```

**Example Proper Tenant Isolation Tests (✅):**

```typescript
// ✅ CORRECT: Multi-tenant feature with tenant isolation tests
// apps/api/src/customers/customers.service.spec.ts
describe('CustomersService - Tenant Isolation', () => {
  describe('getCustomer', () => {
    it('should return customer for correct tenant', async () => {
      // Tenant isolation: correct tenant
    });
    
    it('should not return customer for different tenant', async () => {
      // Tenant isolation: cross-tenant access prevention
    });
    
    it('should verify tenant_id extracted from JWT', async () => {
      // Tenant isolation: JWT extraction
    });
    
    it('should verify RLS policies enforced', async () => {
      // Tenant isolation: RLS enforcement
    });
  });
});
```

**Example Missing Observability Tests (❌):**

```typescript
// ❌ VIOLATION: New feature without observability tests
// apps/api/src/users/users.service.ts
async createUser(userData: CreateUserDto) {
  // New feature - no tests for structured logging or trace IDs
  return this.prisma.user.create({ data: userData });
}
```

**Example Proper Observability Tests (✅):**

```typescript
// ✅ CORRECT: New feature with observability tests
// apps/api/src/users/users.service.spec.ts
describe('UsersService - Observability', () => {
  describe('createUser', () => {
    it('should log with structured format (level, message, timestamp, traceId, context)', async () => {
      // Observability: structured logging
    });
    
    it('should propagate traceId through service calls', async () => {
      // Observability: trace ID propagation
    });
    
    it('should include tenantId in logs', async () => {
      // Observability: tenant ID in logs
    });
    
    it('should not use console.log', async () => {
      // Observability: no console.log
    });
  });
});
```

**Example Missing Security Tests (❌):**

```typescript
// ❌ VIOLATION: Authentication feature without security tests
// apps/api/src/auth/auth.service.ts
async login(email: string, password: string) {
  // Authentication logic - no tests for security
  return this.generateToken(user);
}
```

**Example Proper Security Tests (✅):**

```typescript
// ✅ CORRECT: Authentication feature with security tests
// apps/api/src/auth/auth.service.spec.ts
describe('AuthService - Security', () => {
  describe('login', () => {
    it('should validate JWT token signature', async () => {
      // Security: JWT validation
    });
    
    it('should reject expired tokens', async () => {
      // Security: token expiration
    });
    
    it('should verify tenant context in JWT', async () => {
      // Security: tenant context
    });
    
    it('should log authentication events', async () => {
      // Security: audit logging
    });
  });
});
```

---

**Last Updated:** 2025-11-23  
**Maintained By:** QA Team  
**Review Frequency:** Quarterly or when testing requirements change





