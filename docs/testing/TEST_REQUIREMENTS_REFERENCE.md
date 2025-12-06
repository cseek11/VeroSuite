# Complete Test Requirements Reference

**Last Updated:** 2025-12-05  
**Source:** `.cursor/rules/` directory  
**Purpose:** Comprehensive list of all tests required by VeroField rules and policy

---

## Test Requirements Summary

| Test Type | Priority | When Required | Coverage Target |
|-----------|----------|---------------|-----------------|
| **Unit Tests** | 🔴 **MANDATORY** | New features, bug fixes | Happy paths, error paths, edge cases, boundaries |
| **Integration Tests** | 🟡 **RECOMMENDED** | API/database interactions | Component interactions, API→DB flows, service-to-service |
| **E2E Tests** | 🟡 **RECOMMENDED** | Critical workflows | Complete user journeys, error recovery |
| **Regression Tests** | 🔴 **MANDATORY** | Bug fixes | Reproduce bug, verify fix |
| **Error Path Tests** | 🔴 **MANDATORY** | All new features | All error scenarios |
| **Performance Tests** | 🟡 **CONDITIONAL** | Performance-critical features | Load, stress, response times |
| **Accessibility Tests** | 🟡 **CONDITIONAL** | UI components | WCAG AA compliance |
| **State Machine Tests** | 🔴 **MANDATORY** | Stateful components | Legal/illegal transitions |
| **Tenant Isolation Tests** | 🔴 **MANDATORY** | Multi-tenant features | Tenant data isolation |
| **Behavior-Diff Tests** | 🔴 **MANDATORY** | Refactoring | Verify behavior unchanged |
| **Preventative Tests** | 🔴 **MANDATORY** | Bug fixes | Root cause prevention, pattern prevention |
| **Observability Tests** | 🔴 **MANDATORY** | All new features | Structured logging, trace IDs, observability hooks |
| **Contract/API Tests** | 🟡 **RECOMMENDED** | Services with API contracts, microservices | API contract adherence, breaking changes detection |
| **Property-Based Tests** | 🟡 **CONDITIONAL** | Complex business logic, algorithms | Invariants, random input generation, mathematical properties |
| **Mutation Tests** | 🟡 **CONDITIONAL** | Test suite quality verification | Test effectiveness, dead code detection |
| **Security Tests** | 🔴 **MANDATORY** | Authentication, payment, PII handling | SQL injection, XSS, CSRF, auth bypass, input validation |
| **Snapshot/Visual Regression Tests** | 🟡 **RECOMMENDED** | UI components, visual features | Unintended visual changes, rendering consistency |
| **Chaos/Resilience Tests** | 🟡 **CONDITIONAL** | Distributed systems, critical services | Network failures, timeouts, partial failures, circuit breakers |
| **Data Migration Tests** | 🔴 **MANDATORY** | Database schema changes | Migration idempotency, data integrity, rollback capability |
| **Concurrency/Race Condition Tests** | 🟡 **CONDITIONAL** | Multi-threaded operations, concurrent users | Race conditions, deadlocks, resource contention |
| **Smoke Tests** | 🟡 **RECOMMENDED** | After deployments, health checks | Critical path functionality, system health |
| **Compliance Tests** | 🟡 **CONDITIONAL** | Regulated data (GDPR, HIPAA, PCI-DSS) | Data retention, deletion rights, audit trails, encryption |

---

## 1. Unit Tests (MANDATORY)

### When Required
- ✅ **MANDATORY** for new functions, utilities, or helper methods
- ✅ **MANDATORY** for new React components
- ✅ **MANDATORY** for new API endpoints
- ✅ **MANDATORY** for bug fixes (regression tests)

### What Must Be Tested
1. **Happy Paths** - Normal operation with valid inputs
2. **Error Paths** - All error scenarios and failure modes
3. **Edge Cases** - Boundary conditions, null/undefined, empty inputs
4. **Boundary Conditions** - Min/max values, array limits, string lengths

### Requirements
- Minimum 80% code coverage for new code
- Tests must be deterministic (repeatable, not flaky)
- Tests must be fast (< 1 second per test)
- Tests must be isolated (don't depend on each other)
- Tests must be clear (names describe what they test)

### Location
- Co-located with source: `__tests__/` directories
- Example: `frontend/src/components/billing/__tests__/InvoiceGenerator.test.tsx`

### Naming Convention
- `ComponentName.test.tsx` for React components
- `functionName.test.ts` for utilities/functions

---

## 2. Integration Tests (RECOMMENDED)

### When Required
- 🟡 **RECOMMENDED** for new API endpoints that interact with database
- 🟡 **RECOMMENDED** for new services that integrate multiple modules
- 🟡 **RECOMMENDED** for cross-service communication
- 🟡 **RECOMMENDED** for database operations with transactions

### What Must Be Tested
1. **Component Interactions** - How components work together
2. **API → Database Flows** - Complete request/response cycles
3. **Service-to-Service Communication** - Cross-service integration
4. **Transaction Safety** - Multi-step database operations
5. **Database Transaction Rollback** - Verify transactions roll back correctly on errors
6. **External API Failure Handling** - How system handles external API failures
7. **Cache Invalidation Tests** - Verify cache invalidation works correctly
8. **Message Queue Behavior Tests** - Verify message queue operations (publish, consume, retry)

### Requirements
- Use test databases (never production)
- Tests must be fast (< 5 seconds per test)
- Tests must be isolated (clean up test data)
- Tests must verify end-to-end flows

### Location
- Service-specific test directories
- Example: `apps/api/src/billing/__tests__/integration/`

### Naming Convention
- `feature.integration.test.ts`

---

## 3. End-to-End (E2E) Tests (RECOMMENDED)

### When Required
- 🟡 **RECOMMENDED** for critical user workflows that span multiple components/services
- 🟡 **RECOMMENDED** for high-value business processes (invoice generation, payment processing)
- 🟡 **RECOMMENDED** for multi-step user journeys (customer onboarding, work order completion)
- 🟡 **RECOMMENDED** for cross-layer functionality (frontend → backend → database)

### When NOT Required
- ❌ Simple CRUD operations (unit tests sufficient)
- ❌ Individual component rendering (unit tests sufficient)
- ❌ Internal utilities or helpers
- ❌ Low-risk features
- ❌ Prototypes/MVPs (add later when stable)

### What Must Be Tested
1. **Complete User Journeys** - From start to finish
2. **Error Recovery** - How workflows handle errors
3. **Realistic Data** - Test with production-like data
4. **Multi-Step Processes** - Workflows spanning 3+ components/services
5. **Multi-User/Concurrent Session Tests** - Verify system handles multiple concurrent users
6. **Browser Compatibility Tests** - Verify functionality across different browsers
7. **Mobile Responsiveness Tests** - Verify UI works correctly on mobile devices
8. **Offline Behavior Tests** - Verify system behavior when offline (if PWA)

### Requirements
- Use Playwright for E2E tests
- Keep tests fast (< 30 seconds per test)
- Use test databases and mock external services
- Use `data-testid` for element selection
- Wait for elements before interacting
- Clean up test data after each test

### Location
- `frontend/e2e/` directory (create if needed)
- Example: `frontend/e2e/workflows/invoice-generation.spec.ts`

### Naming Convention
- `workflow-name.spec.ts`

### Example Critical Workflows
- ✅ Invoice generation from work order → invoice creation → payment
- ✅ Customer onboarding → account creation → first work order
- ✅ Payment processing → Stripe integration → invoice update
- ✅ Work order completion → invoice generation → notification

---

## 4. Regression Tests (MANDATORY for Bug Fixes)

### When Required
- 🔴 **MANDATORY** for all bug fixes
- 🔴 **MANDATORY** when fixing production issues

### What Must Be Tested
1. **Bug Reproduction** - Test that reproduces the original bug
2. **Fix Verification** - Test that verifies the bug is fixed
3. **Prevention** - Test that prevents regression

### Requirements
- ✅ **MUST** create regression test that reproduces the bug
- ✅ **MUST** verify test passes after fix
- ✅ **MUST** document error pattern in `docs/error-patterns.md`
- ✅ **MUST** add to test suite permanently

### Location
- Same location as unit tests (co-located with source)
- Example: `frontend/src/components/billing/__tests__/InvoiceGenerator.test.tsx`

---

## 5. Error Path Tests (MANDATORY)

### When Required
- 🔴 **MANDATORY** for all new features
- 🔴 **MANDATORY** for all API endpoints
- 🔴 **MANDATORY** for all database operations

### What Must Be Tested
1. **All Error Scenarios** - Every possible error condition
2. **Error Handling** - How errors are caught and handled
3. **Error Messages** - User-friendly error messages
4. **Error Recovery** - How system recovers from errors
5. **Silent Failures** - Ensure no silent failures occur
6. **Timeout Handling** - How system handles request/operation timeouts
7. **Network Failure Simulation** - Behavior when network requests fail
8. **Partial Response Handling** - How system handles incomplete or partial responses
9. **Retry Logic Verification** - Verify retry mechanisms work correctly

### Requirements
- ✅ **MUST** verify all error paths have tests (see `.cursor/rules/error-resilience.md`)
- ✅ **MUST** test error handling
- ✅ **MUST** verify no silent failures remain
- ✅ **MUST** test error recovery paths

### Reference
- `.cursor/rules/error-resilience.md` - Error handling requirements

---

## 6. Performance Tests (CONDITIONAL)

### When Required
- 🟡 **CONDITIONAL** for performance-critical features
- 🟡 **CONDITIONAL** when performance budgets are defined
- 🟡 **CONDITIONAL** for features with performance requirements

### What Must Be Tested
1. **Response Times** - API response times, page load times
2. **Load Testing** - System behavior under load
3. **Stress Testing** - System behavior at capacity limits
4. **Performance Budgets** - Verify performance budgets are met

### Requirements
- ✅ **MUST** verify performance tests pass (if applicable) (see `.cursor/rules/performance.md`)
- Tests must verify performance budgets
- Tests must measure actual performance metrics

### Reference
- `.cursor/rules/performance.md` - Performance requirements

---

## 7. Accessibility Tests (CONDITIONAL)

### When Required
- 🟡 **CONDITIONAL** for UI components
- 🟡 **CONDITIONAL** for user-facing features

### What Must Be Tested
1. **WCAG AA Compliance** - Accessibility standards compliance
2. **Keyboard Navigation** - All features accessible via keyboard
3. **Screen Reader Support** - Proper ARIA labels and roles
4. **Color Contrast** - Sufficient color contrast ratios

### Requirements
- ✅ **MUST** verify accessibility checks pass (if UI component) (see `.cursor/rules/accessibility.md`)
- Tests must verify WCAG AA compliance
- Tests must verify keyboard navigation
- Tests must verify screen reader support

### Reference
- `.cursor/rules/accessibility.md` - Accessibility requirements

---

## 8. State Machine Tests (MANDATORY for Stateful Components)

### When Required
- 🔴 **MANDATORY** for stateful components
- 🔴 **MANDATORY** for components with state transitions
- 🔴 **MANDATORY** for workflow state machines

### What Must Be Tested
1. **Legal Transitions** - All valid state transitions
2. **Illegal Transitions** - Invalid state transitions are prevented
3. **State Integrity** - State remains consistent
4. **State Persistence** - State persists correctly

### Requirements
- ✅ **MUST** test illegal transition scenarios (see `.cursor/rules/QUICK_REFERENCE.md`)
- ✅ **MUST** audit state machine compliance (if stateful component) (see `.cursor/rules/state-integrity.md`)
- Tests must verify all legal transitions work
- Tests must verify illegal transitions are prevented

### Reference
- `.cursor/rules/state-integrity.md` - State machine requirements

---

## 9. Tenant Isolation Tests (MANDATORY for Multi-Tenant Features)

### When Required
- 🔴 **MANDATORY** for all multi-tenant features
- 🔴 **MANDATORY** for all database operations
- 🔴 **MANDATORY** for all API endpoints

### What Must Be Tested
1. **Data Isolation** - Tenant data is properly isolated
2. **Cross-Tenant Access** - Prevents cross-tenant data access
3. **Tenant Context** - Tenant context is properly validated
4. **RLS Policies** - Row Level Security policies work correctly

### Requirements
- ✅ **MUST** test tenant isolation (see `.cursor/rules/core.md`)
- ✅ **MUST** verify tenant context is validated
- ✅ **MUST** verify RLS policies are enforced
- Tests must verify data isolation between tenants

### Reference
- `.cursor/rules/security.md` - Security and tenant isolation requirements

---

## 10. Behavior-Diff Tests (MANDATORY for Refactoring)

### When Required
- 🔴 **MANDATORY** before refactoring
- 🔴 **MANDATORY** when changing behavior

### What Must Be Tested
1. **Old Behavior** - Capture current behavior
2. **New Behavior** - Verify behavior matches (or intentionally differs)
3. **Behavior Preservation** - Ensure behavior is preserved when refactoring

### Requirements
- ✅ **MUST** create behavior-diff tests before refactoring (see `.cursor/rules/QUICK_REFERENCE.md`)
- ✅ **MUST** add regression tests matching old behavior (see `.cursor/rules/QUICK_REFERENCE.md`)
- ✅ **MUST** ensure all existing tests pass
- ✅ **MUST** maintain test coverage

### Reference
- `.cursor/rules/refactoring.md` - Refactoring requirements

---

## 11. Preventative Tests (MANDATORY)

### When Required
- 🔴 **MANDATORY** for all bug fixes
- 🔴 **MANDATORY** when fixing production issues

### What Must Be Tested
1. **Root Cause Prevention** - Tests that prevent root cause
2. **Pattern Prevention** - Tests that prevent error patterns
3. **Predictive Guardrails** - Tests that catch issues early

### Requirements
- ✅ **MUST** verify tests pass (regression + preventative) (see `.cursor/rules/predictive-prevention.md`)
- ✅ **MUST** verify predictive guardrails applied
- Tests must prevent similar issues from occurring

### Reference
- `.cursor/rules/predictive-prevention.md` - Preventative test requirements

---

## 12. Observability Tests (MANDATORY)

### When Required
- 🔴 **MANDATORY** for all new features
- 🔴 **MANDATORY** for all API endpoints

### What Must Be Tested
1. **Structured Logging** - Logs are structured and parseable
2. **Trace IDs** - Trace IDs are propagated
3. **Observability Hooks** - Observability hooks are present
4. **Error Logging** - Errors are properly logged

### Requirements
- ✅ **MUST** verify logging meets structured logging policy (see `.cursor/rules/observability.md`)
- ✅ **MUST** verify observability hooks present (trace IDs, structured logs)
- ✅ **MUST** verify cross-layer traceability intact
- Tests must verify observability requirements

### Reference
- `.cursor/rules/observability.md` - Observability requirements

---

## 13. Contract/API Tests (RECOMMENDED)

### When Required
- 🟡 **RECOMMENDED** for services with defined API contracts
- 🟡 **RECOMMENDED** for microservices with service-to-service communication
- 🟡 **RECOMMENDED** for external integrations (third-party APIs)
- 🟡 **RECOMMENDED** when API versioning is used

### What Must Be Tested
1. **API Contract Adherence** - Request/response schemas match contract definitions
2. **Breaking Changes Detection** - Identify when API changes break contracts
3. **Backward Compatibility** - Verify old clients still work with new API versions
4. **API Versioning Compliance** - Verify versioning strategy is followed correctly
5. **Schema Validation** - Request and response data match expected schemas

### Requirements
- ✅ **MUST** verify API contracts are validated (see `docs/contracts.md`)
- ✅ **MUST** test contract shape consistency across layers (frontend ↔ backend ↔ database)
- Tests must verify request/response schemas match contract definitions
- Tests must detect breaking changes in API contracts
- Tests must verify backward compatibility when API versions change

### Tools
- **Pact** - Contract testing between services
- **OpenAPI Validation** - Validate against OpenAPI/Swagger specifications
- **JSON Schema Validation** - Validate request/response against JSON schemas

### Location
- Co-located with API endpoints or in contract-specific test directories
- Example: `apps/api/src/work-orders/__tests__/contract/work-orders.contract.test.ts`

### Naming Convention
- `feature.contract.test.ts` or `api-name.contract.test.ts`

### Reference
- `docs/contracts.md` - Contract consistency and schema versioning requirements

---

## 14. Property-Based Tests (CONDITIONAL)

### When Required
- 🟡 **CONDITIONAL** for complex business logic
- 🟡 **CONDITIONAL** for data transformations
- 🟡 **CONDITIONAL** for algorithms with mathematical properties
- 🟡 **CONDITIONAL** for validation logic with many edge cases

### What Must Be Tested
1. **Invariants** - Properties that should always hold true
2. **Random Input Generation** - Test with randomly generated inputs to find edge cases
3. **Mathematical Properties** - Commutativity, associativity, idempotency, etc.
4. **Boundary Conditions** - Automatically discover boundary conditions through random testing

### Requirements
- Tests must generate random inputs within defined constraints
- Tests must verify invariants hold for all generated inputs
- Tests must shrink failing inputs to minimal reproducing cases
- Tests should run multiple iterations (typically 100-1000) to find edge cases

### Tools
- **fast-check** - Property-based testing for JavaScript/TypeScript

### Location
- Co-located with source code being tested
- Example: `frontend/src/lib/validation/__tests__/property/date-validation.property.test.ts`

### Naming Convention
- `feature.property.test.ts` or `functionName.property.test.ts`

### Example
```typescript
import fc from 'fast-check';

describe('Date Validation - Property Tests', () => {
  it('should always parse valid ISO date strings', () => {
    fc.assert(
      fc.property(
        fc.date(),
        (date) => {
          const isoString = date.toISOString();
          const parsed = new Date(isoString);
          return parsed.getTime() === date.getTime();
        }
      )
    );
  });
});
```

---

## 15. Mutation Tests (CONDITIONAL)

### When Required
- 🟡 **CONDITIONAL** to verify test suite quality
- 🟡 **CONDITIONAL** to verify test coverage effectiveness
- 🟡 **CONDITIONAL** to identify weak test areas
- 🟡 **CONDITIONAL** to detect dead code

### What Must Be Tested
1. **Test Effectiveness** - Whether your tests actually catch bugs
2. **Test Suite Quality** - Identify tests that don't catch mutations
3. **Dead Code Detection** - Find code that isn't tested or used
4. **Coverage Gaps** - Identify areas with coverage but weak tests

### Requirements
- Mutation testing should be run periodically (not on every commit)
- Aim for mutation score > 70% (higher is better)
- Fix or remove tests that don't catch mutations
- Remove dead code identified by mutation testing

### Tools
- **Stryker Mutator** - Mutation testing framework for JavaScript/TypeScript

### Location
- Run at project root level (mutates entire codebase)
- Configuration: `stryker.conf.json` or `stryker.conf.js`

### Naming Convention
- Mutation test configuration files: `stryker.conf.json`

### Reference
- Mutation testing helps verify that tests are actually effective, not just present

---

## 16. Security Tests (MANDATORY for Sensitive Features)

### When Required
- 🔴 **MANDATORY** for authentication and authorization features
- 🔴 **MANDATORY** for payment processing
- 🔴 **MANDATORY** for PII (Personally Identifiable Information) handling
- 🔴 **MANDATORY** for features handling sensitive data
- 🔴 **MANDATORY** for API endpoints accepting user input

### What Must Be Tested
1. **SQL Injection Prevention** - Verify SQL injection attacks are prevented
2. **XSS Prevention** - Verify cross-site scripting attacks are prevented
3. **CSRF Protection** - Verify CSRF tokens are validated
4. **Authentication Bypass Attempts** - Verify authentication cannot be bypassed
5. **Authorization Escalation** - Verify users cannot access unauthorized resources
6. **Input Validation/Sanitization** - Verify all user input is validated and sanitized
7. **Rate Limiting** - Verify rate limiting prevents abuse
8. **Tenant Isolation** - Verify tenant data isolation (covered separately in Section 9)

### Requirements
- ✅ **MUST** verify security tests pass (see `docs/security.md`)
- ✅ **MUST** test all security boundaries
- ✅ **MUST** verify input validation on all user inputs
- ✅ **MUST** test authentication and authorization for all protected endpoints
- Tests must verify security headers are set correctly
- Tests must verify sensitive data is encrypted in transit and at rest

### Location
- Security-specific test directories
- Example: `apps/api/src/auth/__tests__/security/auth.security.test.ts`

### Naming Convention
- `feature.security.test.ts` or `security-issue.security.test.ts`

### Reference
- `docs/security.md` - Security standards and tenant isolation
- `.cursor/rules/security.md` - Security requirements (if exists)

---

## 17. Snapshot/Visual Regression Tests (RECOMMENDED for UI)

### When Required
- 🟡 **RECOMMENDED** for UI components
- 🟡 **RECOMMENDED** for complex layouts
- 🟡 **RECOMMENDED** for visual-heavy features
- 🟡 **RECOMMENDED** for design system components

### What Must Be Tested
1. **Unintended Visual Changes** - Detect visual regressions automatically
2. **Component Rendering Consistency** - Verify components render consistently
3. **Cross-Browser Visual Differences** - Verify visual consistency across browsers
4. **Responsive Design** - Verify components look correct at different screen sizes

### Requirements
- Visual tests should be reviewed before committing snapshots
- Update snapshots intentionally when design changes are made
- Use visual diff tools to highlight changes
- Test across multiple browsers and screen sizes

### Tools
- **Percy** - Visual testing and review platform
- **Chromatic** - Visual testing for Storybook components
- **Jest Snapshots** - Basic snapshot testing (less visual, more structural)

### Location
- Co-located with components or in visual test directories
- Example: `frontend/src/components/ui/__tests__/visual/Button.visual.test.tsx`

### Naming Convention
- `ComponentName.visual.test.tsx` or `ComponentName.snapshot.test.tsx`

### Reference
- Visual regression tests catch unintended UI changes that unit tests might miss

---

## 18. Chaos/Resilience Tests (CONDITIONAL)

### When Required
- 🟡 **CONDITIONAL** for distributed systems
- 🟡 **CONDITIONAL** for critical services
- 🟡 **CONDITIONAL** for high-availability features
- 🟡 **CONDITIONAL** for microservices architectures

### What Must Be Tested
1. **Network Failures** - System behavior when network connections fail
2. **Database Connection Drops** - System behavior when database is unavailable
3. **Service Timeouts** - System behavior when services timeout
4. **Partial System Failures** - System behavior when some services fail
5. **Circuit Breaker Behavior** - Verify circuit breakers trip and recover correctly
6. **Retry Mechanisms** - Verify retry logic works correctly under failure conditions

### Requirements
- Chaos tests should run in isolated test environments (never production)
- Tests must verify graceful degradation
- Tests must verify error handling and recovery
- Tests must verify system returns to normal operation after failures

### Tools
- **Chaos Monkey** - Randomly terminate services
- **Custom chaos testing scripts** - Targeted failure injection

### Location
- Separate chaos test directories
- Example: `apps/api/__tests__/chaos/resilience.chaos.test.ts`

### Naming Convention
- `feature.chaos.test.ts` or `resilience.chaos.test.ts`

### Reference
- Chaos testing helps verify system resilience and fault tolerance

---

## 19. Data Migration Tests (MANDATORY for Migrations)

### When Required
- 🔴 **MANDATORY** for database schema changes
- 🔴 **MANDATORY** for data transformations
- 🔴 **MANDATORY** for any migration scripts
- 🔴 **MANDATORY** when modifying database structure

### What Must Be Tested
1. **Migration Up/Down Idempotency** - Verify migrations can be run multiple times safely
2. **Data Integrity After Migration** - Verify data is correct after migration
3. **Rollback Capability** - Verify migrations can be rolled back
4. **Performance of Large Migrations** - Verify migrations complete in acceptable time
5. **Tenant Data Isolation** - Verify migrations maintain tenant isolation (if multi-tenant)

### Requirements
- ✅ **MUST** test migration up and down paths
- ✅ **MUST** verify data integrity after migration
- ✅ **MUST** test rollback capability
- ✅ **MUST** verify migrations are idempotent
- Tests must use test databases (never production)
- Tests must verify migrations don't break existing functionality

### Location
- Migration-specific test directories
- Example: `libs/common/prisma/__tests__/migrations/migration-001.test.ts`

### Naming Convention
- `migration-XXX.test.ts` or `migration-description.test.ts`

### Reference
- `docs/DATABASE.md` - Database schema and migration guidelines

---

## 20. Concurrency/Race Condition Tests (CONDITIONAL)

### When Required
- 🟡 **CONDITIONAL** for multi-threaded operations
- 🟡 **CONDITIONAL** for concurrent user scenarios
- 🟡 **CONDITIONAL** for shared resources
- 🟡 **CONDITIONAL** for optimistic locking implementations

### What Must Be Tested
1. **Race Conditions** - Verify system handles concurrent operations correctly
2. **Deadlocks** - Verify system doesn't deadlock under concurrent load
3. **Resource Contention** - Verify system handles resource contention gracefully
4. **Optimistic Locking** - Verify optimistic locking prevents lost updates
5. **Concurrent Updates** - Verify concurrent updates are handled correctly

### Requirements
- Tests must simulate concurrent operations
- Tests must verify data consistency under concurrent access
- Tests must verify no data corruption occurs
- Tests should use multiple threads/processes to simulate concurrency

### Location
- Co-located with code that handles concurrency
- Example: `apps/api/src/work-orders/__tests__/concurrency/work-order-updates.concurrent.test.ts`

### Naming Convention
- `feature.concurrent.test.ts` or `feature.race-condition.test.ts`

### Reference
- Concurrency tests help identify race conditions and deadlocks that are difficult to reproduce

---

## 21. Smoke Tests (RECOMMENDED)

### When Required
- 🟡 **RECOMMENDED** after deployments
- 🟡 **RECOMMENDED** for quick health checks
- 🟡 **RECOMMENDED** in CI/CD pipelines
- 🟡 **RECOMMENDED** before running full test suites

### What Must Be Tested
1. **Critical Path Functionality** - Verify core features work
2. **System Health Endpoints** - Verify health check endpoints respond
3. **Database Connectivity** - Verify database connections work
4. **External Service Availability** - Verify external services are reachable
5. **Authentication** - Verify authentication endpoints work

### Requirements
- Smoke tests must be very fast (< 10 seconds total)
- Smoke tests should cover critical paths only
- Smoke tests should run before full test suites
- Smoke tests should fail fast if system is broken

### Location
- Root-level test directory or CI/CD specific directory
- Example: `__tests__/smoke/smoke.test.ts` or `apps/api/__tests__/smoke/health.smoke.test.ts`

### Naming Convention
- `smoke.test.ts` or `health.smoke.test.ts`

### Purpose
- Fast verification that system is operational before running expensive test suites

---

## 22. Compliance Tests (CONDITIONAL)

### When Required
- 🟡 **CONDITIONAL** for features handling regulated data (GDPR, HIPAA, PCI-DSS)
- 🟡 **CONDITIONAL** for features with compliance requirements
- 🟡 **CONDITIONAL** for audit trail requirements
- 🟡 **CONDITIONAL** for data retention policies

### What Must Be Tested
1. **Data Retention Policies** - Verify data is retained according to policy
2. **Right to Deletion** - Verify user data can be deleted on request
3. **Audit Trail Requirements** - Verify audit trails are created and maintained
4. **Encryption Requirements** - Verify data is encrypted as required
5. **Access Logging** - Verify access to sensitive data is logged
6. **Data Export** - Verify users can export their data

### Requirements
- Tests must verify compliance with applicable regulations
- Tests must verify data handling meets regulatory requirements
- Tests must verify audit trails are complete and accurate
- Tests must verify encryption is applied correctly

### Location
- Compliance-specific test directories
- Example: `apps/api/src/compliance/__tests__/gdpr.compliance.test.ts`

### Naming Convention
- `regulation.compliance.test.ts` or `compliance-requirement.compliance.test.ts`

### Reference
- Compliance tests help ensure system meets regulatory requirements

---

## Test Quality Requirements (All Test Types)

### Universal Requirements
1. **Deterministic** - Tests must be repeatable and not flaky
2. **Fast** - Unit tests < 1s, integration < 5s, E2E < 30s
3. **Isolated** - Tests don't depend on each other
4. **Clear** - Test names describe what they test
5. **Maintainable** - Tests are easy to update when code changes

### Test Organization
```
frontend/
├── src/
│   └── components/
│       └── billing/
│           └── __tests__/          # Unit tests (co-located)
│               └── InvoiceGenerator.test.tsx
└── e2e/                             # E2E tests (separate directory)
    └── workflows/
        └── invoice-generation.spec.ts
```

---

## Risk-Based Test Organization

Tests can be organized by risk level to help prioritize test execution and maintenance efforts. This helps teams focus on the most critical tests first and allocate resources appropriately.

### Risk Levels

#### Critical (Must Never Fail in Production)
- **Examples:** Payment processing, authentication, data deletion, tenant isolation
- **Test Priority:** Run first, fail fast, block deployments
- **Maintenance:** Highest priority, review frequently
- **Coverage:** Comprehensive testing required

#### High (Serious Impact if Fails)
- **Examples:** Invoice generation, work order completion, customer data updates
- **Test Priority:** Run early in test suite, block deployments
- **Maintenance:** High priority, review regularly
- **Coverage:** Thorough testing required

#### Medium (Moderate Impact)
- **Examples:** Reporting features, search functionality, UI components
- **Test Priority:** Run in standard test suite
- **Maintenance:** Standard priority, review periodically
- **Coverage:** Standard testing required

#### Low (Minor Impact)
- **Examples:** Non-critical UI features, helper utilities, documentation
- **Test Priority:** Run in extended test suite, don't block deployments
- **Maintenance:** Lower priority, review as needed
- **Coverage:** Basic testing sufficient

### Risk Assessment Criteria

When determining risk level, consider:
1. **Business Impact** - How much revenue/customer impact if feature fails?
2. **Data Sensitivity** - Does feature handle sensitive or regulated data?
3. **User Impact** - How many users are affected if feature fails?
4. **Recovery Difficulty** - How hard is it to recover from failure?
5. **Frequency of Use** - How often is feature used?

### Test Execution Strategy

- **Critical & High Risk:** Run on every commit, block merges on failure
- **Medium Risk:** Run on every PR, warn on failure
- **Low Risk:** Run on main branch, don't block merges

### Maintenance Strategy

- **Critical & High Risk:** Review and update tests weekly
- **Medium Risk:** Review and update tests monthly
- **Low Risk:** Review and update tests quarterly

---

## Mandatory Test Checklist

### For New Features
- [ ] ✅ **MUST** include unit tests for new functionality
- [ ] ✅ **MUST** test error paths
- [ ] ✅ **MUST** test happy paths
- [ ] ✅ **MUST** test edge cases
- [ ] ✅ **MUST** test boundary conditions
- [ ] ✅ **MUST** test tenant isolation (if multi-tenant)
- [ ] ✅ **MUST** verify observability requirements
- [ ] ✅ **MUST** include security tests (if handling sensitive data, authentication, or payment processing)
- [ ] ✅ **MUST** include data migration tests (if database schema changes)
- [ ] 🟡 **SHOULD** include integration tests for API/database interactions
- [ ] 🟡 **RECOMMENDED** include E2E tests for critical workflows
- [ ] 🟡 **RECOMMENDED** include contract/API tests (if API endpoints or microservices)
- [ ] 🟡 **RECOMMENDED** include smoke tests (for quick health checks)
- [ ] 🟡 **RECOMMENDED** include snapshot/visual regression tests (if UI component)
- [ ] 🟡 **CONDITIONAL** include performance tests (if performance-critical)
- [ ] 🟡 **CONDITIONAL** include accessibility tests (if UI component)
- [ ] 🟡 **CONDITIONAL** include property-based tests (if complex business logic)
- [ ] 🟡 **CONDITIONAL** include concurrency/race condition tests (if multi-threaded or concurrent users)
- [ ] 🟡 **CONDITIONAL** include chaos/resilience tests (if distributed system or critical service)
- [ ] 🟡 **CONDITIONAL** include compliance tests (if handling regulated data)

### For Bug Fixes
- [ ] ✅ **MUST** create regression test that reproduces the bug
- [ ] ✅ **MUST** verify test passes after fix
- [ ] ✅ **MUST** document error pattern in `docs/error-patterns.md`
- [ ] ✅ **MUST** verify tests pass (regression + preventative)
- [ ] ✅ **MUST** verify predictive guardrails applied

### For Refactoring
- [ ] ✅ **MUST** ensure all existing tests pass
- [ ] ✅ **MUST** add behavior-diff tests before refactoring
- [ ] ✅ **MUST** maintain test coverage
- [ ] ✅ **MUST** add regression tests matching old behavior

---

## Test Execution

### Running Tests
```bash
# Unit tests
npm run test:unit

# Integration tests
npm run test:integration

# E2E tests
npm run test:e2e

# All tests
npm run test:all
```

### CI/CD Integration
- Unit and integration tests run on every PR
- E2E tests run on main branch and before releases
- Test failures block merges

---

## Related Rules

- `.cursor/rules/verification.md` - Detailed testing standards
- `.cursor/rules/enforcement.md` - Mandatory workflow and verification
- `.cursor/rules/error-resilience.md` - Error handling requirements
- `.cursor/rules/predictive-prevention.md` - Regression test requirements
- `.cursor/rules/core.md` - Core testing standards
- `.cursor/rules/state-integrity.md` - State machine requirements
- `docs/security.md` - Security standards and tenant isolation
- `docs/contracts.md` - Contract consistency and schema versioning
- `.cursor/rules/observability.md` - Observability requirements
- `.cursor/rules/performance.md` - Performance requirements
- `.cursor/rules/accessibility.md` - Accessibility requirements
- `docs/DATABASE.md` - Database schema and migration guidelines

---

**Last Updated:** 2025-12-05

