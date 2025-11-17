---
# Cursor Rule Metadata
version: 1.0
project: VeroField
scope:
  - all
priority: high
last_updated: 2025-11-16
always_apply: true
---

# PRIORITY: HIGH - Refactor Integrity Rules

## Overview

This rule file ensures refactors don't break behavior by requiring behavior-diffing, regression tests, risk surface documentation, and stability verification.

**⚠️ MANDATORY:** All refactors must maintain behavior, include regression tests, and document risk surface before execution.

---

## I. Behavior-Diffing Requirements

### Rule 1: Behavior-Diffing Before Refactor

**MANDATORY:** Perform behavior-diffing before/after refactor:

**Behavior-Diffing Process:**
1. **Document Current Behavior** - Document all behaviors of code being refactored
2. **Create Behavior Tests** - Create tests that verify current behavior
3. **Perform Refactor** - Refactor code
4. **Verify Behavior Unchanged** - Run behavior tests to verify no behavior change
5. **Document Behavior Changes** - If behavior changes, document explicitly

**Example:**
```typescript
// BEFORE REFACTOR: Document behavior
describe('WorkOrderService - Current Behavior', () => {
  it('should create work order with customer', async () => {
    const result = await service.createWorkOrder({
      customer_id: 'customer-123',
      status: 'PENDING'
    });
    
    // Document expected behavior
    expect(result.customer_id).toBe('customer-123');
    expect(result.status).toBe('PENDING');
    expect(result.id).toBeDefined();
    expect(result.created_at).toBeInstanceOf(Date);
  });

  it('should throw error if customer not found', async () => {
    await expect(
      service.createWorkOrder({ customer_id: 'invalid' })
    ).rejects.toThrow('Customer not found');
  });
});

// AFTER REFACTOR: Verify behavior unchanged
// Same tests should pass with refactored code
```

### Rule 2: Behavior Test Coverage

**MANDATORY:** Create comprehensive behavior tests covering:

- **Happy Paths** - Normal operation scenarios
- **Error Cases** - Error handling behavior
- **Edge Cases** - Boundary conditions
- **Side Effects** - Any side effects (logging, events, etc.)

**Example:**
```typescript
describe('WorkOrderService - Behavior Coverage', () => {
  // Happy path
  it('should create work order successfully', async () => {
    // Test normal creation
  });

  // Error case
  it('should throw error on invalid input', async () => {
    // Test error handling
  });

  // Edge case
  it('should handle empty customer list', async () => {
    // Test boundary condition
  });

  // Side effect
  it('should emit work order created event', async () => {
    // Test event emission
  });
});
```

---

## II. Regression Test Requirements

### Rule 3: Regression Tests Matching Old Behavior

**MANDATORY:** Add regression tests that match old behavior exactly:

```typescript
// Regression test: Verify old behavior preserved
describe('WorkOrderService - Regression Tests', () => {
  it('should maintain old API contract', async () => {
    // Test that API contract hasn't changed
    const result = await service.createWorkOrder({
      customer_id: 'customer-123',
      status: 'PENDING'
    });

    // Verify old contract still works
    expect(result).toHaveProperty('id');
    expect(result).toHaveProperty('customer_id');
    expect(result).toHaveProperty('status');
    expect(result).toHaveProperty('created_at');
  });

  it('should maintain old error messages', async () => {
    // Test that error messages haven't changed
    await expect(
      service.createWorkOrder({ customer_id: 'invalid' })
    ).rejects.toThrow('Customer not found'); // Exact old error message
  });
});
```

### Rule 4: Behavior Preservation Verification

**MANDATORY:** Verify all behaviors preserved:

```typescript
// Before refactor: Document all behaviors
const behaviors = [
  'Creates work order with customer',
  'Throws error if customer not found',
  'Sets default status to PENDING',
  'Generates UUID for id',
  'Sets created_at timestamp',
  'Emits work_order.created event'
];

// After refactor: Verify all behaviors
behaviors.forEach(behavior => {
  it(`should preserve behavior: ${behavior}`, async () => {
    // Test that behavior is preserved
  });
});
```

---

## III. Risk Surface Documentation

### Rule 5: Refactor Risk Surface

**MANDATORY:** Explain refactor risk surface:

**Risk Surface Documentation:**
1. **Files Affected** - List all files modified
2. **Dependencies** - List all dependencies on refactored code
3. **Breaking Changes** - List any breaking changes
4. **Migration Required** - Document migration steps if needed
5. **Rollback Plan** - Document how to rollback if issues occur

**Example:**
```
⚠️ REFACTOR RISK SURFACE

Refactor: Extract WorkOrderService.createWorkOrder logic

Files Affected:
- apps/api/src/work-orders/work-orders.service.ts
- apps/api/src/work-orders/work-orders.controller.ts

Dependencies:
- frontend/src/lib/work-orders-api.ts (API client)
- apps/api/src/work-orders/work-orders.service.spec.ts (Tests)

Breaking Changes:
- None (internal refactor only)

Migration Required:
- No migration needed (internal refactor)

Rollback Plan:
- Revert commit if tests fail
- No database changes required
```

### Rule 6: Refactor Stability Check

**MANDATORY:** Only refactor when code is stable:

**Stability Criteria:**
- All tests passing
- No active bugs in code being refactored
- Code is not in active development
- Dependencies are stable

**MANDATORY:** Do NOT refactor:
- Code with failing tests
- Code with known bugs
- Code currently being modified
- Unstable dependencies

---

## IV. Refactoring Documentation

### Rule 7: Refactoring Decision Documentation

**MANDATORY:** Document refactoring decisions:

**Documentation Required:**
- **Why** - Why refactor is needed
- **What** - What is being refactored
- **How** - How refactor is being done
- **Risks** - Risks identified
- **Benefits** - Benefits expected

**MANDATORY:** Document in `docs/engineering-decisions.md`.

**Reference:** See `.cursor/rules/pattern-learning.md` for decision documentation.

---

## V. Integration with Enforcement Pipeline

### Step 1: Mandatory Search

**MANDATORY:** During Step 1, search for:

- Current behavior of code being refactored
- Existing tests covering behavior
- Dependencies on refactored code
- Similar refactoring patterns

### Step 2: Pattern Analysis

**MANDATORY:** During Step 2, verify:

- Behavior tests created
- Risk surface identified
- Refactor approach planned
- Rollback plan prepared

### Step 3: Rule Compliance Check

**MANDATORY:** During Step 3, verify:

- Behavior-diffing tests created
- Regression tests planned
- Risk surface documented
- Code is stable

### Step 5: Post-Implementation Audit

**MANDATORY:** During Step 5, verify:

- All behavior tests pass
- Regression tests pass
- No behavior changes (unless documented)
- Refactoring documented
- Risk surface addressed

---

## Violations

**HARD STOP violations:**
- Refactoring without behavior-diffing tests
- Refactoring without regression tests
- Refactoring unstable code
- Breaking behavior without documentation

**Must fix before proceeding:**
- Missing behavior tests
- Missing risk surface documentation
- Missing refactoring documentation
- Incomplete regression tests

---

**Last Updated:** 2025-11-16  
**Status:** Active Enforcement  
**Priority:** HIGH - Must be followed for every refactor

