# Task 5: R10 (Testing Coverage) — Draft Summary

**Status:** DRAFT - Awaiting Human Review  
**Created:** 2025-12-05  
**Rule:** R10 - Testing Coverage  
**Priority:** HIGH (Tier 2 - OVERRIDE)

---

## What Was Generated

### 1. Step 5 Audit Checklist (26 items)
- **New Feature Testing:** 7 checks
- **Bug Fix Testing:** 4 checks
- **Test Quality:** 5 checks
- **Coverage Thresholds:** 5 checks
- **Test Execution:** 5 checks

### 2. OPA Policy Mapping
- **5 violation patterns + 1 warning:**
  1. Missing unit tests for new features
  2. Missing regression tests for bug fixes
  3. Coverage below 80% threshold for new code
  4. Tests skipped without documentation
  5. Test coverage delta negative (new code reduces coverage)
  6. Warning: Tests exist but coverage incomplete
- **Enforcement level:** OVERRIDE (Tier 2 MAD)
- **Policy file:** `services/opa/policies/quality.rego` (R10 section)

### 3. Automated Check Script
- **Script:** `.cursor/scripts/check-test-coverage.py`
- **Checks:**
  - Detects missing unit tests for new features (file analysis)
  - Verifies regression tests exist for bug fixes (PR analysis)
  - Calculates coverage delta (coverage reports comparison)
  - Verifies coverage thresholds (80% for statements, branches, functions, lines)
  - Verifies tests run and pass (test execution results)
  - Detects skipped tests (test file analysis)

### 4. Manual Verification Procedures
- **4-step procedure:**
  1. Review test files
  2. Verify coverage
  3. Run tests
  4. Check test quality
- **4 verification criteria**

### 5. OPA Policy Implementation
- **Full Rego code provided**
- **5 deny rules + 1 warn rule**
- **Pattern matching** (file analysis, coverage reports)

### 6. Test Cases
- **12 test cases specified:**
  1. Happy path (new feature with unit tests)
  2. Happy path (bug fix with regression test)
  3. Happy path (coverage meets threshold)
  4. Violation (missing unit tests)
  5. Violation (missing regression test)
  6. Violation (coverage below threshold)
  7. Violation (tests skipped)
  8. Violation (coverage delta negative)
  9. Warning (tests exist but incomplete)
  10. Override (with marker)
  11. Edge case (integration tests)
  12. Edge case (E2E tests)

---

## Review Needed

### Question 1: Coverage Threshold Detection
**Context:** How should the script detect coverage threshold violations?

**Options:**
- A) Parse coverage reports (Jest/Vitest coverage output)
- B) Use coverage tool APIs (programmatic access to coverage data)
- C) Combination: Parse reports + verify thresholds programmatically
- D) Heuristic check (verify coverage configuration exists)

**Recommendation:** Option C - Combination approach. Parse coverage reports (JSON/LCOV) for accurate data, verify thresholds programmatically. Handle both Jest (backend) and Vitest (frontend) coverage formats.

**Rationale:** Coverage threshold detection requires:
- Parsing coverage reports (Jest JSON, Vitest JSON, LCOV)
- Comparing coverage values against thresholds (80% for statements, branches, functions, lines)
- Calculating coverage delta (new code coverage vs existing code)
- Handling different test frameworks (Jest, Vitest)

---

### Question 2: Missing Test Detection
**Context:** How should the script detect missing tests for new features?

**Options:**
- A) File pattern matching (check for *.spec.ts or *.test.ts files)
- B) AST parsing (analyze code structure, detect new functions/classes)
- C) Combination: File pattern + AST analysis for accuracy
- D) Git diff analysis (detect new files/functions, check for corresponding test files)

**Recommendation:** Option D - Git diff analysis. Detect new files and functions in PR, check for corresponding test files. This is most accurate for PR-based workflows.

**Rationale:** Missing test detection requires:
- Identifying new code (files, functions, classes)
- Finding corresponding test files (*.spec.ts, *.test.ts)
- Verifying test files exist and cover new code
- Handling different test file naming conventions

---

### Question 3: Regression Test Detection
**Context:** How should the script detect missing regression tests for bug fixes?

**Options:**
- A) PR description analysis (check for bug fix keywords, issue numbers)
- B) Git diff analysis (detect bug fix patterns, check for test changes)
- C) Combination: PR description + git diff analysis
- D) Heuristic check (verify test files modified for bug fixes)

**Recommendation:** Option C - Combination approach. Analyze PR description for bug fix indicators (fixes #123, bug fix, regression), then verify test files include regression tests.

**Rationale:** Regression test detection requires:
- Identifying bug fixes (PR description, issue references)
- Verifying regression tests exist (test files modified)
- Verifying regression tests reproduce the bug (test content analysis)
- Handling different bug fix patterns

---

### Question 4: Coverage Delta Calculation
**Context:** How should the script calculate coverage delta (new code coverage vs existing code)?

**Options:**
- A) Compare overall coverage (before vs after PR)
- B) Calculate per-file coverage delta (new/modified files only)
- C) Combination: Overall coverage + per-file delta
- D) Not R10's responsibility (handled by CI/CD)

**Recommendation:** Option B - Per-file coverage delta. Calculate coverage for new/modified files only, compare against threshold. More accurate than overall coverage.

**Rationale:** Coverage delta calculation requires:
- Identifying new/modified files (git diff)
- Calculating coverage for those files only
- Comparing against 80% threshold
- Handling file-level vs overall coverage

---

### Question 5: Test Execution Verification
**Context:** How should the script verify tests run and pass?

**Options:**
- A) Parse test execution output (Jest/Vitest output)
- B) Use test framework APIs (programmatic test execution)
- C) Combination: Parse output + verify exit code
- D) Not R10's responsibility (handled by CI/CD)

**Recommendation:** Option C - Combination approach. Parse test execution output for pass/fail status, verify exit code. R10 should verify tests exist and can run, but CI/CD handles actual execution.

**Rationale:** Test execution verification requires:
- Parsing test output (Jest/Vitest JSON reporters)
- Verifying test results (pass/fail counts)
- Verifying exit code (0 = success)
- Handling different test frameworks

---

## Estimated Implementation Time

| Task | Estimated Time |
|------|----------------|
| OPA Policy Implementation | 40 minutes |
| Automated Script Implementation | 80 minutes |
| Test Cases Implementation | 30 minutes |
| Documentation Updates | 10 minutes |
| **Total** | **2.5 hours** |

**Note:** Script requires coverage report parsing, git diff analysis, and test output parsing. Leverage existing test infrastructure (Jest, Vitest) for consistency.

---

## Files to Create/Modify

### To Create
1. `services/opa/policies/quality.rego` — OPA policy (R10 section) (NEW or UPDATE)
2. `services/opa/tests/quality_r10_test.rego` — Test cases
3. `.cursor/scripts/check-test-coverage.py` — Automated check script
4. `docs/testing/test-coverage-testing-guide.md` — Test coverage testing guide (NEW)

### To Modify
1. `.cursor/rules/10-quality.mdc` — Add Step 5 section for R10
2. `.cursor/rules/14-verification.mdc` — May need updates (if R10 references it)

---

## Key Characteristics of R10

### Scope
- **New feature testing:** Unit tests mandatory, integration/E2E recommended
- **Bug fix testing:** Regression tests mandatory
- **Coverage thresholds:** 80% for statements, branches, functions, lines
- **Test quality:** Naming conventions, location conventions, test execution
- **Coverage delta:** New code must add coverage (not reduce it)

### Tier 2 (OVERRIDE) vs Tier 1 (BLOCK)
- **Tier 1 (R01-R03):** BLOCK - Cannot proceed without fix
- **Tier 2 (R10):** OVERRIDE - Can proceed with justification
- **Rationale:** Test coverage issues can be fixed incrementally, but should be flagged

### Relationship to Other Rules
- **R10 (Testing Coverage):** Ensures tests exist and coverage meets thresholds
- **R14 (Verification Standards):** Defines test types and when to use them
- **Together:** Comprehensive testing coverage and quality

### Coverage Thresholds
- **Statements:** 80% (code statements executed)
- **Branches:** 80% (conditional branches tested)
- **Functions:** 80% (functions called)
- **Lines:** 80% (code lines executed)

---

## Verification Checklist

Before moving to R11, verify:

- [ ] Step 5 audit checklist is comprehensive (26 items)
- [ ] OPA policy patterns are correct (5 patterns + 1 warning)
- [ ] Automated script specification is clear
- [ ] Manual procedures are actionable (4-step process)
- [ ] Test cases cover all scenarios (12 tests)
- [ ] Review questions are answered
- [ ] Implementation time is reasonable (2.5 hours)
- [ ] Leverages existing test infrastructure (Jest, Vitest)

---

## Next Steps

### Option A: Approve and Implement
1. Review draft procedures
2. Answer review questions
3. Approve for implementation
4. Implement OPA policy
5. Implement automated script
6. Add test cases
7. Update documentation
8. **Move to R11 (Backend Patterns)**

### Option B: Request Changes
1. Provide feedback on draft
2. Request specific changes
3. AI revises draft
4. Re-review
5. Approve or iterate

---

## Recommendation

**Proceed with Option A** - R10 provides comprehensive test coverage enforcement. After R10:
- **New features have unit tests** (happy path, error paths, edge cases)
- **Bug fixes have regression tests** (reproduce the bug)
- **Coverage meets 80% threshold** (statements, branches, functions, lines)
- **Tests follow conventions** (naming, location, execution)

**Answers to Review Questions:**
- Q1: Option C (Parse coverage reports + verify thresholds programmatically)
- Q2: Option D (Git diff analysis - detect new code, check for test files)
- Q3: Option C (PR description + git diff analysis)
- Q4: Option B (Per-file coverage delta - more accurate)
- Q5: Option C (Parse output + verify exit code)

**Rationale:** R10 focuses on test coverage enforcement. Git diff analysis provides accurate detection of new code and missing tests. Coverage report parsing provides accurate coverage data. Test output parsing verifies tests run and pass.

---

## Draft Location

**Full Draft:** `.cursor/rules/10-quality-R10-DRAFT.md`

**Review Instructions:**
1. Read the full draft
2. Answer the 5 review questions
3. Approve or request changes
4. AI will implement approved procedures

---

## Testing Coverage Requirements

Based on existing documentation, testing coverage requires:

### Coverage Thresholds
- **Statements:** 80% (code statements executed)
- **Branches:** 80% (conditional branches tested)
- **Functions:** 80% (functions called)
- **Lines:** 80% (code lines executed)

### Test Types
- **Unit Tests:** Mandatory for new features
- **Integration Tests:** Recommended for DB/API changes
- **E2E Tests:** Recommended for critical workflows
- **Regression Tests:** Mandatory for bug fixes

### Test Frameworks
- **Backend:** Jest (`apps/api/jest.config.js`)
- **Frontend:** Vitest (`frontend/vitest.config.ts`)
- **Coverage Reports:** JSON, LCOV, HTML

---

**Status:** AWAITING YOUR REVIEW  
**Prepared By:** AI Assistant  
**Date:** 2025-12-05  
**Estimated Review Time:** 15-20 minutes

---

## Progress Update (After R10 Draft)

### Task 5 Status

| Rule | Status | Time | Notes |
|------|--------|------|-------|
| ✅ R01-R03 | COMPLETE | 6.58h | Tier 1 (100%) |
| ✅ R04-R09 | COMPLETE | 15.16h | Tier 2 (60%) |
| ⏸️ R10: Testing Coverage | DRAFT | 2.5h | Tier 2 |
| ⏸️ R11-R13 (Tier 2) | PENDING | ~6.5h | Remaining Tier 2 |
| ⏸️ R14-R25 (Tier 3) | PENDING | ~12h | Tier 3 |

**Progress:** 9/25 rules complete (36%), 1/25 in review (4%)  
**Time Spent:** 21.74 hours  
**Time Estimated (if R10 approved):** 24.24 hours  
**Remaining:** 15 rules, ~9.76 hours

**Tier 1:** 100% complete ✅  
**Tier 2:** 60% complete (6/10), 10% in review (1/10)

---

## Testing Coverage Foundation

**R10 (Testing Coverage):** Ensures tests exist and coverage meets thresholds (DRAFT)

Together with R14 (Verification Standards), provides:
- **Test type guidance** (unit, integration, E2E)
- **Coverage enforcement** (80% threshold)
- **Test quality standards** (naming, location, execution)

**After R10:** Complete test coverage enforcement! 🎉





