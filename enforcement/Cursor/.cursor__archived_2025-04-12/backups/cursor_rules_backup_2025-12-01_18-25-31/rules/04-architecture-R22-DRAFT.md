# R22: Refactor Integrity — Step 5 Procedures (DRAFT)

**Status:** DRAFT - Awaiting Human Review  
**Created:** 2025-12-04  
**Rule:** R22 - Refactor Integrity  
**Priority:** MEDIUM (Tier 3 - WARNING)

---

## R22: Refactor Integrity — Audit Procedures

### Rule-Specific Audit Checklist

For code changes affecting **refactoring operations, code restructuring, or behavior-preserving changes**:

#### Behavior-Diffing Requirements

- [ ] **MANDATORY:** Verify behavior-diffing tests created before refactor (document current behavior)
- [ ] **MANDATORY:** Verify behavior-diffing tests pass after refactor (verify behavior unchanged)
- [ ] **MANDATORY:** Verify behavior tests cover happy paths, error cases, edge cases, and side effects
- [ ] **MANDATORY:** Verify behavior changes documented explicitly (if behavior intentionally changed)
- [ ] **RECOMMENDED:** Verify behavior tests use descriptive names (e.g., "should create work order with customer")

#### Regression Test Requirements

- [ ] **MANDATORY:** Verify regression tests created that match old behavior exactly
- [ ] **MANDATORY:** Verify regression tests verify API contract unchanged (if applicable)
- [ ] **MANDATORY:** Verify regression tests verify error messages unchanged (if applicable)
- [ ] **MANDATORY:** Verify all behaviors preserved (happy paths, error cases, edge cases, side effects)
- [ ] **RECOMMENDED:** Verify regression tests organized in separate test suite (e.g., "Regression Tests")

#### Risk Surface Documentation

- [ ] **MANDATORY:** Verify refactor risk surface documented (files affected, dependencies, breaking changes)
- [ ] **MANDATORY:** Verify files affected listed (all files modified by refactor)
- [ ] **MANDATORY:** Verify dependencies listed (all code depending on refactored code)
- [ ] **MANDATORY:** Verify breaking changes documented (if any breaking changes introduced)
- [ ] **MANDATORY:** Verify migration steps documented (if migration required)
- [ ] **MANDATORY:** Verify rollback plan documented (how to rollback if issues occur)
- [ ] **RECOMMENDED:** Verify risk surface documented in PR description or engineering-decisions.md

#### Refactor Stability Checks

- [ ] **MANDATORY:** Verify code is stable before refactoring (all tests passing, no active bugs)
- [ ] **MANDATORY:** Verify code is not in active development (no concurrent changes)
- [ ] **MANDATORY:** Verify dependencies are stable (no unstable dependencies)
- [ ] **MANDATORY:** Verify no refactoring of code with failing tests
- [ ] **MANDATORY:** Verify no refactoring of code with known bugs
- [ ] **RECOMMENDED:** Verify refactor timing appropriate (not during critical periods)

#### Breaking Change Detection

- [ ] **MANDATORY:** Verify no breaking changes introduced (unless explicitly documented)
- [ ] **MANDATORY:** Verify API contract unchanged (if refactoring API code)
- [ ] **MANDATORY:** Verify error messages unchanged (if refactoring error handling)
- [ ] **MANDATORY:** Verify return types unchanged (if refactoring functions)
- [ ] **MANDATORY:** Verify function signatures unchanged (if refactoring functions)
- [ ] **RECOMMENDED:** Verify contract tests pass (if contract tests exist)

#### Refactoring Documentation

- [ ] **MANDATORY:** Verify refactoring decision documented (why, what, how, risks, benefits)
- [ ] **MANDATORY:** Verify refactoring documented in engineering-decisions.md (if significant)
- [ ] **MANDATORY:** Verify PR description includes refactor summary
- [ ] **RECOMMENDED:** Verify refactoring patterns documented for future reference

**Total:** 30+ checklist items (mix of MANDATORY, RECOMMENDED)

---

## Automated Checks

### OPA Policy Checks

The OPA policy will check for:

1. **R22-W01:** Refactor without behavior-diffing tests
   - Detects refactoring PRs without behavior test files
   - Checks for test files matching refactored code

2. **R22-W02:** Refactor without regression tests
   - Detects refactoring PRs without regression test files
   - Checks for regression test patterns

3. **R22-W03:** Refactor without risk surface documentation
   - Detects refactoring PRs without risk surface documentation
   - Checks PR description for risk surface keywords

4. **R22-W04:** Refactoring unstable code
   - Detects refactoring of code with failing tests
   - Checks for known bugs in refactored code

5. **R22-W05:** Breaking changes in refactor
   - Detects breaking changes (API contract, error messages, function signatures)
   - Checks for breaking change documentation

### Script Checks

The automated script will:

1. **AST Parsing:** Analyze refactored code structure
   - Compare before/after AST structure
   - Detect structural changes

2. **Diff Analysis:** Compare before/after refactoring
   - Identify changed functions, classes, interfaces
   - Detect breaking changes

3. **Safety Checks:** Verify refactoring maintains functionality
   - Check test coverage for refactored code
   - Verify behavior tests exist and pass

4. **Breaking Change Detection:** Detect breaking changes
   - Compare API contracts (function signatures, return types)
   - Compare error messages
   - Compare function behavior

---

## Code Examples

### ✅ CORRECT: Refactor with Behavior-Diffing Tests

```typescript
// BEFORE REFACTOR: Document behavior
describe('WorkOrderService - Current Behavior', () => {
  it('should create work order with customer', async () => {
    const result = await service.createWorkOrder({
      customer_id: 'customer-123',
      status: 'PENDING'
    });
    
    expect(result.customer_id).toBe('customer-123');
    expect(result.status).toBe('PENDING');
    expect(result.id).toBeDefined();
    expect(result.created_at).toBeInstanceOf(Date);
  });
});

// AFTER REFACTOR: Same tests pass (behavior unchanged)
// Refactored code maintains same behavior
```

### ❌ VIOLATION: Refactor without Behavior-Diffing Tests

```typescript
// ❌ VIOLATION: Refactored code without behavior tests
// No tests to verify behavior unchanged
export class WorkOrderService {
  async createWorkOrder(data: CreateWorkOrderDto) {
    // Refactored implementation
    // No behavior tests to verify behavior unchanged
  }
}
```

### ✅ CORRECT: Refactor with Risk Surface Documentation

```markdown
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

### ❌ VIOLATION: Refactor without Risk Surface Documentation

```markdown
# ❌ VIOLATION: Refactor PR without risk surface documentation
# No documentation of files affected, dependencies, or rollback plan
Refactor: Extract WorkOrderService.createWorkOrder logic
```

---

## OPA Policy Mapping

| Warning ID | Description | Detection Method |
|------------|-------------|------------------|
| R22-W01 | Refactor without behavior-diffing tests | Check for test files matching refactored code |
| R22-W02 | Refactor without regression tests | Check for regression test patterns |
| R22-W03 | Refactor without risk surface documentation | Check PR description for risk surface keywords |
| R22-W04 | Refactoring unstable code | Check for failing tests or known bugs |
| R22-W05 | Breaking changes in refactor | Compare API contracts, error messages, function signatures |

---

## Manual Verification (When Needed)

1. **Review Refactoring Scope** - Verify refactoring is behavior-preserving
2. **Check Behavior Tests** - Verify behavior-diffing tests exist and pass
3. **Verify Regression Tests** - Verify regression tests match old behavior
4. **Review Risk Surface** - Verify risk surface documentation is complete
5. **Check Stability** - Verify code is stable before refactoring

---

**Last Updated:** 2025-12-04  
**Status:** DRAFT - Awaiting Review





