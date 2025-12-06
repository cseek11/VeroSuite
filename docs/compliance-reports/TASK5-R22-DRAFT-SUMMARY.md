# R22: Refactor Integrity — Draft Summary

**Date:** 2025-12-05  
**Rule:** R22 - Refactor Integrity  
**Tier:** 3 (WARNING-level enforcement)  
**Status:** DRAFT - Awaiting Review  
**Estimated Time:** 2.5 hours

---

## Overview

R22 ensures that refactors maintain behavior, include regression tests, and document risk surface. This is a WARNING-level rule that catches refactoring issues that don't break functionality but affect code safety and maintainability.

**Key Focus Areas:**
- Behavior-diffing requirements (before/after refactor verification)
- Regression test requirements (tests that verify behavior unchanged)
- Risk surface documentation (files affected, dependencies, breaking changes)
- Refactor stability checks (verify code is stable before refactoring)
- Breaking change detection (detect breaking changes in refactoring)

---

## Relationship to Other Rules

**R22 Covers:**
- Refactor integrity (WARNING-level enforcement)
- Behavior-diffing requirements
- Regression test requirements
- Risk surface documentation
- Refactor stability checks

**Related Rules:**
- **R07 (Error Handling):** Refactors must maintain error handling behavior
- **R10 (Testing Coverage):** Refactors must maintain test coverage
- **R06 (Breaking Change Documentation):** Breaking changes in refactors must be documented

**Rationale:** R22 ensures refactors maintain behavior and safety. It complements R07, R10, and R06 by focusing specifically on refactoring operations rather than general code changes.

---

## Draft Structure

### Audit Checklist Categories (6 categories, 30+ items)

1. **Behavior-Diffing Requirements** (5 items: 4 MANDATORY, 1 RECOMMENDED)
   - Behavior-diffing tests created before refactor
   - Behavior-diffing tests pass after refactor
   - Behavior tests cover all scenarios (happy paths, errors, edge cases, side effects)
   - Behavior changes documented explicitly

2. **Regression Test Requirements** (5 items: 4 MANDATORY, 1 RECOMMENDED)
   - Regression tests created that match old behavior exactly
   - Regression tests verify API contract unchanged
   - Regression tests verify error messages unchanged
   - All behaviors preserved

3. **Risk Surface Documentation** (7 items: 6 MANDATORY, 1 RECOMMENDED)
   - Refactor risk surface documented
   - Files affected listed
   - Dependencies listed
   - Breaking changes documented
   - Migration steps documented
   - Rollback plan documented

4. **Refactor Stability Checks** (6 items: 5 MANDATORY, 1 RECOMMENDED)
   - Code is stable before refactoring
   - Code is not in active development
   - Dependencies are stable
   - No refactoring of code with failing tests
   - No refactoring of code with known bugs

5. **Breaking Change Detection** (6 items: 5 MANDATORY, 1 RECOMMENDED)
   - No breaking changes introduced (unless documented)
   - API contract unchanged
   - Error messages unchanged
   - Return types unchanged
   - Function signatures unchanged

6. **Refactoring Documentation** (4 items: 3 MANDATORY, 1 RECOMMENDED)
   - Refactoring decision documented (why, what, how, risks, benefits)
   - Refactoring documented in engineering-decisions.md
   - PR description includes refactor summary

**Total:** 30+ checklist items (mix of MANDATORY, RECOMMENDED)

---

## Key Decisions Required

### Q1: How should we detect refactoring operations?

**Option A:** PR description keywords only (detect "refactor", "restructure", "extract", etc.)
- **Pros:** Simple, fast, catches obvious refactoring PRs
- **Cons:** May miss refactoring PRs without keywords, false positives for feature PRs

**Option B:** Diff analysis (compare before/after code structure)
- **Pros:** Catches refactoring even without keywords, more accurate
- **Cons:** Requires AST parsing, more complex, slower

**Option C:** Pattern matching + diff analysis (hybrid approach)
- **Pros:** Catches refactoring with keywords, also detects structural changes
- **Cons:** More complex, requires both keyword matching and AST parsing

**Recommendation:** **Option C** - Pattern matching for fast detection, diff analysis for validation. This provides comprehensive coverage while maintaining performance.

---

### Q2: How should we verify behavior-diffing tests exist?

**Option A:** File name pattern matching (check for test files matching refactored code)
- **Pros:** Simple, fast, catches obvious test files
- **Cons:** May miss test files with different naming, doesn't verify test quality

**Option B:** AST parsing (analyze test file structure to verify behavior coverage)
- **Pros:** Verifies test quality, checks for behavior coverage
- **Cons:** Complex, requires AST parsing, slower

**Option C:** File name pattern + test content analysis (hybrid approach)
- **Pros:** Catches test files, verifies behavior coverage
- **Cons:** More complex, requires both pattern matching and content analysis

**Recommendation:** **Option C** - File name pattern for fast detection, test content analysis for validation. This ensures tests exist AND verify behavior.

---

### Q3: How should we detect breaking changes in refactors?

**Option A:** API contract comparison (compare function signatures, return types)
- **Pros:** Catches obvious breaking changes, verifies API contract
- **Cons:** May miss subtle breaking changes, doesn't check error messages

**Option B:** Diff analysis (compare before/after code behavior)
- **Pros:** Catches all breaking changes, verifies behavior unchanged
- **Cons:** Complex, requires AST parsing and behavior analysis

**Option C:** API contract + error message comparison (hybrid approach)
- **Pros:** Catches API breaking changes and error message changes
- **Cons:** More complex, requires both contract and message analysis

**Recommendation:** **Option C** - API contract comparison for fast detection, error message comparison for validation. This catches both API and error message breaking changes.

---

### Q4: How should we verify risk surface documentation?

**Option A:** PR description keyword matching (check for "risk surface", "files affected", etc.)
- **Pros:** Simple, fast, catches obvious documentation
- **Cons:** May miss documentation in other locations, doesn't verify completeness

**Option B:** Structured documentation parsing (parse risk surface documentation format)
- **Pros:** Verifies documentation completeness, checks for required sections
- **Cons:** Complex, requires structured format, may be too strict

**Option C:** Keyword matching + completeness check (hybrid approach)
- **Pros:** Catches documentation, verifies required sections present
- **Cons:** More complex, requires both keyword matching and completeness check

**Recommendation:** **Option C** - Keyword matching for fast detection, completeness check for validation. This ensures documentation exists AND is complete.

---

### Q5: How should we verify refactor stability?

**Option A:** Test status check (check if tests are passing)
- **Pros:** Simple, fast, catches obvious stability issues
- **Cons:** May miss other stability issues (bugs, active development)

**Option B:** Comprehensive stability check (tests, bugs, active development, dependencies)
- **Pros:** Verifies all stability criteria, comprehensive coverage
- **Cons:** Complex, requires multiple checks, slower

**Option C:** Test status + bug check (hybrid approach)
- **Pros:** Catches test failures and known bugs, good balance
- **Cons:** May miss active development or dependency issues

**Recommendation:** **Option B** - Comprehensive stability check. Refactoring unstable code is risky, so comprehensive checks are worth the complexity.

---

## Implementation Approach

### OPA Policy (5 warning patterns)

1. **R22-W01:** Refactor without behavior-diffing tests
   - Detection: Check for test files matching refactored code
   - Validation: Verify test files contain behavior tests

2. **R22-W02:** Refactor without regression tests
   - Detection: Check for regression test patterns
   - Validation: Verify regression tests match old behavior

3. **R22-W03:** Refactor without risk surface documentation
   - Detection: Check PR description for risk surface keywords
   - Validation: Verify required sections present (files affected, dependencies, breaking changes)

4. **R22-W04:** Refactoring unstable code
   - Detection: Check for failing tests or known bugs
   - Validation: Verify code is stable before refactoring

5. **R22-W05:** Breaking changes in refactor
   - Detection: Compare API contracts, error messages, function signatures
   - Validation: Verify breaking changes documented

### Automated Script

**Complexity:** MEDIUM (AST parsing + diff analysis + safety checks)

**Components:**
1. **Refactoring Detection:** Pattern matching + diff analysis
2. **Behavior Test Verification:** File name pattern + test content analysis
3. **Breaking Change Detection:** API contract + error message comparison
4. **Risk Surface Verification:** Keyword matching + completeness check
5. **Stability Check:** Test status + bug check + active development check

**Estimated Lines:** 400-500 lines

### Test Suite

**Test Cases:** 10+ test cases
- Happy paths (refactor with all requirements)
- Violations (refactor without behavior tests, without regression tests, without risk surface)
- Edge cases (partial refactoring, multiple refactors, breaking changes)

---

## Estimated Time

**Total:** 2.5 hours
- **Draft creation:** 0.5 hours ✅ (completed)
- **Review and approval:** 0.5 hours (pending)
- **Implementation:** 1.5 hours (pending)
  - OPA policy: 0.5 hours
  - Automated script: 0.75 hours
  - Test suite: 0.25 hours

---

## Complexity Assessment

**Complexity:** MEDIUM ✅

**Rationale:**
- AST parsing required for diff analysis
- Test content analysis required for behavior verification
- API contract comparison required for breaking change detection
- Multiple validation layers (pattern matching + analysis)
- Well-defined rules with clear pass/fail criteria

**Comparison to Other Rules:**
- **Simpler than R20:** No design system parsing, no page classification
- **More complex than R21:** Requires AST parsing and diff analysis
- **Similar to R19:** Both require pattern matching + analysis

---

## Review Questions - ANSWERS APPROVED ✅

1. **Q1:** ✅ **APPROVED - Option C (Hybrid: Pattern Matching + Diff Analysis)**
   - Keywords for fast detection (80% of cases)
   - Diff analysis for validation (20% of cases)
   - Refactoring pattern library for common patterns
   - Refactoring confidence scoring

2. **Q2:** ✅ **APPROVED - Option C (Hybrid: File Name Pattern + Test Content Analysis)**
   - File names for quick detection
   - Content analysis for quality verification
   - Behavior test quality scoring
   - Test improvement suggestions

3. **Q3:** ✅ **APPROVED - Option C (Hybrid: API Contract + Error Message Comparison)**
   - API contract for fast detection (90% of cases)
   - Error messages for subtle breakages (10% but high impact)
   - Semantic versioning impact analysis
   - Breaking change migration guide generator

4. **Q4:** ✅ **APPROVED - Option C (Hybrid: Keyword Matching + Completeness Check)**
   - Keywords for fast detection
   - Completeness check for validation
   - Risk surface template generator (auto-generate from PR changes)
   - Template validation

5. **Q5:** ✅ **APPROVED - Option B (Comprehensive Stability Check)**
   - All four criteria: tests, bugs, active development, dependencies
   - Stability score dashboard
   - Stability pre-check workflow
   - Stability history tracking

---

## Approved Enhancements

### 1. Refactoring Pattern Library
- Extract method, rename, move class, extract interface, change signature
- Pattern detection with risk assessment
- Confidence scoring based on multiple signals

### 2. Behavior Test Quality Scoring
- Score tests based on behavior vs implementation descriptions
- Provide improvement suggestions
- Grade system (GOOD/FAIR/POOR)

### 3. Semantic Versioning Impact Analysis
- Categorize changes (major/minor/patch)
- Generate migration guides automatically
- Version bump recommendations

### 4. Risk Surface Template Generator
- Auto-generate from PR changes
- Pre-fill files affected, dependencies, breaking changes
- Interactive checklist for completion

### 5. Stability Score Dashboard
- 4-point scoring system (tests, bugs, active dev, dependencies)
- Actionable recommendations
- Stability history tracking

### 6. Refactoring Confidence Score
- Overall refactoring safety score (0-100)
- Grade system (A/B/C/D/F)
- Actionable recommendations

---

## Next Steps

1. ✅ **Draft approved** - All 5 questions answered with enhancements
2. **Proceed to Step 3: Implementation**
   - Implement OPA policy (extend `architecture.rego`)
   - Create automated script (`check-refactor-integrity.py`)
   - Create test suite (`architecture_r22_test.rego`)
   - Update rule file (`.cursor/rules/04-architecture.mdc`)

---

**Last Updated:** 2025-12-05  
**Status:** ✅ APPROVED - Ready for Implementation

