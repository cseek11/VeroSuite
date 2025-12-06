# R10: Testing Coverage — Step 5 Procedures (DRAFT)

**Status:** DRAFT - Awaiting Human Review  
**Created:** 2025-12-04  
**Rule:** R10 - Testing Coverage  
**Priority:** HIGH (Tier 2 - OVERRIDE)  
**MAD Tier:** 2 (OVERRIDE REQUIRED - Needs justification)

---

## Purpose

R10 ensures that all code changes have appropriate test coverage based on change type:
- **New features:** Unit tests (mandatory), integration/E2E tests (recommended)
- **Bug fixes:** Regression tests (mandatory) that reproduce the bug
- **Critical workflows:** E2E tests (recommended)
- **Coverage threshold:** ≥ 80% for new code (statements, branches, functions, lines)

**Key Requirements:**
- New features must have unit tests covering happy path, error paths, edge cases
- Bug fixes must have regression tests that reproduce the bug
- Critical workflows should have E2E tests
- New code must meet 80% coverage threshold
- Tests must follow naming/location conventions
- Tests must run and pass

---

## Step 5: Post-Implementation Audit for Testing Coverage

### R10: Testing Coverage — Audit Procedures

**For code changes affecting functionality, bug fixes, or new features:**

#### New Feature Testing

- [ ] **MANDATORY:** Verify unit tests exist for new features
- [ ] **MANDATORY:** Verify unit tests cover happy path
- [ ] **MANDATORY:** Verify unit tests cover error paths
- [ ] **MANDATORY:** Verify unit tests cover edge cases
- [ ] **MANDATORY:** Verify new code meets 80% coverage threshold (statements, branches, functions, lines)
- [ ] **RECOMMENDED:** Verify integration tests exist if DB/API involved
- [ ] **RECOMMENDED:** Verify E2E tests exist for critical workflows

#### Bug Fix Testing

- [ ] **MANDATORY:** Verify regression test exists that reproduces the bug
- [ ] **MANDATORY:** Verify regression test passes after fix
- [ ] **MANDATORY:** Verify regression test fails before fix (if applicable)
- [ ] **MANDATORY:** Verify regression test is at appropriate level (unit/integration/E2E)

#### Test Quality

- [ ] **MANDATORY:** Verify tests follow naming conventions (*.spec.ts, *.test.ts)
- [ ] **MANDATORY:** Verify tests follow location conventions (__tests__/, test/)
- [ ] **MANDATORY:** Verify tests run and pass
- [ ] **MANDATORY:** Verify tests are not skipped (unless documented)
- [ ] **MANDATORY:** Verify test coverage delta is positive (new code adds coverage)

#### Coverage Thresholds

- [ ] **MANDATORY:** Verify statements coverage ≥ 80% for new code
- [ ] **MANDATORY:** Verify branches coverage ≥ 80% for new code
- [ ] **MANDATORY:** Verify functions coverage ≥ 80% for new code
- [ ] **MANDATORY:** Verify lines coverage ≥ 80% for new code
- [ ] **MANDATORY:** Verify coverage delta is calculated (new code coverage vs existing code)

#### Test Execution

- [ ] **MANDATORY:** Verify unit tests run successfully
- [ ] **MANDATORY:** Verify integration tests run successfully (if applicable)
- [ ] **MANDATORY:** Verify E2E tests run successfully (if applicable)
- [ ] **MANDATORY:** Verify all tests pass (no failures)
- [ ] **MANDATORY:** Verify no test warnings (unless documented)

#### Automated Checks

```bash
# Run test coverage checker
python .cursor/scripts/check-test-coverage.py --file <file_path>

# Check all changed files
python .cursor/scripts/check-test-coverage.py --pr <PR_NUMBER>

# Expected: Coverage ≥ 80% for new code, tests exist and pass
```

#### OPA Policy

- **Policy:** `services/opa/policies/quality.rego` (R10 section)
- **Enforcement:** OVERRIDE (Tier 2 MAD) - Requires justification
- **Tests:** `services/opa/tests/quality_r10_test.rego`

#### Manual Verification (When Needed)

1. **Review Test Files** - Verify tests exist for changed code
2. **Verify Coverage** - Check coverage reports for new code
3. **Run Tests** - Execute test suite and verify all pass
4. **Check Test Quality** - Verify tests follow conventions and cover all paths

**Example Missing Unit Tests (VIOLATION):**

```typescript
// ❌ VIOLATION: New feature without unit tests
// apps/api/src/users/users.service.ts
export class UsersService {
  async createUser(userData: CreateUserDto) {
    // New feature - no tests
    return this.prisma.user.create({ data: userData });
  }
}
```

**Example Proper Unit Tests (CORRECT):**

```typescript
// ✅ CORRECT: New feature with comprehensive unit tests
// apps/api/src/users/users.service.spec.ts
describe('UsersService', () => {
  describe('createUser', () => {
    it('should create user successfully (happy path)', async () => {
      // Test happy path
    });
    
    it('should throw error on invalid data (error path)', async () => {
      // Test error path
    });
    
    it('should handle duplicate email (edge case)', async () => {
      // Test edge case
    });
  });
});
```

**Example Missing Regression Test (VIOLATION):**

```typescript
// ❌ VIOLATION: Bug fix without regression test
// Bug: User creation fails when email contains special characters
// Fix: Added email validation
// Missing: Regression test that reproduces the bug
```

**Example Proper Regression Test (CORRECT):**

```typescript
// ✅ CORRECT: Bug fix with regression test
// apps/api/src/users/users.service.spec.ts
describe('UsersService - Bug Fix #123', () => {
  it('should handle email with special characters (regression)', async () => {
    // Reproduces the bug scenario
    const userData = { email: 'user+test@example.com' };
    
    // Should not throw error (bug was fixed)
    await expect(service.createUser(userData)).resolves.toBeDefined();
  });
});
```

**Example Coverage Threshold Violation (VIOLATION):**

```typescript
// ❌ VIOLATION: New code below 80% coverage threshold
// Coverage report:
// statements: 60% (below 80% threshold)
// branches: 55% (below 80% threshold)
// functions: 70% (below 80% threshold)
// lines: 65% (below 80% threshold)
```

**Example Proper Coverage (CORRECT):**

```typescript
// ✅ CORRECT: New code meets 80% coverage threshold
// Coverage report:
// statements: 85% (above 80% threshold)
// branches: 82% (above 80% threshold)
// functions: 88% (above 80% threshold)
// lines: 86% (above 80% threshold)
```

---

**Last Updated:** 2025-12-04  
**Maintained By:** QA Team  
**Review Frequency:** Quarterly or when testing requirements change





