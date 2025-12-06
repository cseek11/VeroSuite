# Handoff Prompt for Next Agent — R22 Implementation

**Date:** 2025-12-05  
**From:** R21 Implementation Agent  
**To:** Next Agent (R22 Implementation)  
**Project:** VeroField Rules v2.1 Migration — Task 5: Step 5 Procedures  
**Status:** R21 ✅ COMPLETE, Ready for R22

**⚠️ SOURCE OF TRUTH:** Rule numbers come from `.cursor/rules/*.mdc` files and `docs/compliance-reports/rule-compliance-matrix.md`, not the original plan document.

---

## 🎯 YOUR MISSION

Implement **R22: Refactor Integrity** following the established four-step workflow. This is a Tier 3 (WARNING-level) rule that ensures refactors maintain behavior, include regression tests, and document risk surface.

---

## 📊 CURRENT PROJECT STATUS

### Overall Progress
- **Completed:** 21 rules (84%)
- **Remaining:** 4 rules (16%)
- **Tier 3 Progress:** 8/12 rules complete (67%)

### Completed Rules
- **Tier 1 (BLOCK):** R01, R02, R03 ✅✅✅
- **Tier 2 (OVERRIDE):** R04-R13 ✅✅✅✅✅✅✅✅✅✅
- **Tier 3 (WARNING):** R14, R15, R16, R17, R18, R19, R20, R21 ✅✅✅✅✅✅✅✅

### Just Completed (R21)
- **Rule:** R21 - File Organization
- **Time:** 2 hours (as estimated)
- **Complexity:** LOW-MEDIUM
- **Key Pattern:** Pattern matching for deprecated paths, naming conventions, directory structure
- **Test Results:** ✅ 19/19 tests passing (all R21 warnings covered)
- **Critical Fix:** Solved Rego set iteration bug (`some x in set` → `rule[key]`)

---

## 🔧 ERROR LOGS & FIXES FROM R21 SESSION

### Implementation Summary
**Status:** ✅ All components implemented successfully

### Key Implementation Notes

1. **OPA Policy:** Added 14 R21 warnings to `services/opa/policies/architecture.rego`
   - Deprecated path detection (backend/src/, backend/prisma/, root-level src/)
   - Unauthorized top-level directory detection
   - Deprecated import path detection (@verosuite/*)
   - Cross-service relative import detection
   - File naming violations (PascalCase, camelCase)
   - Directory depth violations
   - Component location violations
   - Deep relative import detection

2. **Test Suite:** Created `services/opa/tests/architecture_r21_test.rego` (19 test cases)
   - All R21 warnings tested
   - Happy paths tested
   - Edge cases covered

3. **Rule File:** Updated `.cursor/rules/04-architecture.mdc` with R21 section
   - 8 categories, 40+ checklist items
   - Code examples (correct patterns and violations)
   - Automated checks section

### Critical Bugs Fixed

1. **OPA_REGO_SET_ITERATION_BUG** - Critical bug preventing all R21 warnings
   - **Problem:** Used `some warning in file_organization_warnings` which iterates over VALUES (`true`) instead of KEYS (warning messages)
   - **Fix:** Changed to `file_organization_warnings[msg]` syntax to iterate over keys
   - **Impact:** All 19 tests now passing
   - **Documented:** `.cursor/BUG_LOG.md` and `docs/error-patterns.md#OPA_REGO_SET_ITERATION_BUG`

2. **OPA_REGO_CASE_SENSITIVE_CONTAINS** - Test failure due to case mismatch
   - **Problem:** Warning used "Reusable component" (capital R) but test expected "reusable component" (lowercase)
   - **Fix:** Changed warning message to lowercase "reusable component"
   - **Impact:** Last failing test now passing
   - **Documented:** `.cursor/BUG_LOG.md` and `docs/error-patterns.md#OPA_REGO_CASE_SENSITIVE_CONTAINS`

**Final Test Results:** ✅ 19/19 tests passing

---

## 📋 COMMON PATTERNS (Reference)

### Rego Set Iteration Pattern
```rego
# ✅ CORRECT: Iterate over set keys
warn contains msg if {
    file_organization_warnings[msg]  # Binds msg to each KEY
}

# ❌ WRONG: Iterates over values
warn contains msg if {
    some warning in file_organization_warnings  # Gets 'true', not warning message
    msg := warning
}
```

### Pattern Matching for Deprecated Paths
```rego
# Deprecated path detection
file_organization_warnings[msg] if {
    some file in input.changed_files
    startswith(file.path, "backend/src/")
    
    correct_path := replace(file.path, "backend/src/", "apps/api/src/")
    msg := sprintf("WARNING [Architecture/R21]: File in deprecated path '%s'. Suggested: '%s'", [file.path, correct_path])
}
```

### Regex Pattern for Cross-Service Imports
```rego
# Cross-service relative import (3+ levels of ../)
regex.match(`import\s+.*\s+from\s+['"](\.\./){3,}[^'"]+`, file.diff)
```

---

## 🎯 YOUR MISSION: R22 - Refactor Integrity

**Rule File:** `04-architecture.mdc` (extend existing file)  
**OPA Policy:** `services/opa/policies/architecture.rego` (extend R03/R21)  
**Script:** `.cursor/scripts/check-refactor-integrity.py`  
**Estimated Time:** 2.5 hours  
**Complexity:** MEDIUM

### Rule Overview

R22 ensures that refactors maintain behavior, include regression tests, and document risk surface. This is a WARNING-level rule that catches refactoring issues that don't break functionality but affect code safety and maintainability.

**Key Focus Areas:**
- Behavior-diffing requirements (before/after refactor)
- Regression test coverage (tests that verify behavior unchanged)
- Risk surface documentation (areas affected by refactor)
- Safety checks (test coverage, behavior verification)
- Breaking change detection (detect breaking changes in refactoring)

### Reference Documents

1. **Refactoring Rules:** `docs/refactoring.md` - Contains detailed refactor integrity requirements
2. **Rule File:** `.cursor/rules/04-architecture.mdc` - Architecture rules (R03, R21 already implemented)
3. **Complexity Evaluation:** `docs/compliance-reports/TIER3-COMPLEXITY-EVALUATION.md` - R22 complexity breakdown

### Expected Deliverables

1. **Draft Documents (Step 1):**
   - `.cursor/rules/04-architecture-R22-DRAFT.md` - Draft rule with Step 5 audit procedures
   - `docs/compliance-reports/TASK5-R22-DRAFT-SUMMARY.md` - Draft summary with review questions

2. **Implementation (Step 3):**
   - OPA policy: Extend `services/opa/policies/architecture.rego` with R22 warnings
   - Automated script: Create `check-refactor-integrity.py`
   - Test suite: Create `services/opa/tests/architecture_r22_test.rego`
   - Rule file: Update `.cursor/rules/04-architecture.mdc` with R22 section

3. **Completion Documentation:**
   - `docs/compliance-reports/R22-IMPLEMENTATION-COMPLETE.md`
   - Update handoff document for next rule

---

## 📚 REFERENCE DOCUMENTS

### Completed Rules (Use as Examples)
- **R21:** `docs/compliance-reports/R21-IMPLEMENTATION-COMPLETE.md` (just completed)
- **R20:** `docs/compliance-reports/HANDOFF-TO-NEXT-AGENT-R20.md`
- **R19:** `docs/compliance-reports/TASK5-R19-IMPLEMENTATION-COMPLETE.md`

### Error Patterns (Avoid These)
- **R21 Error Logs:** See "ERROR LOGS & FIXES FROM R21 SESSION" section above
- **Common Rego Syntax:** See "COMMON PATTERNS" section above
- **Set Iteration:** Always use `rule[key]` syntax, not `some x in rule`

### Main Handoff
- **File:** `docs/compliance-reports/AGENT-HANDOFF-PROMPT.md`
- **Contains:** Full workflow, patterns, file locations, examples

---

## 🎓 LESSONS LEARNED (From R21)

### What Worked Well
1. **Debug Test Suite:** Created isolated debug tests to identify root cause
2. **Trace Output:** Used `trace()` and `--explain=notes` to see evaluation flow
3. **Incremental Fixes:** Fixed regex patterns first, then root cause (set iteration)
4. **Documentation:** Comprehensive error documentation in BUG_LOG.md and error-patterns.md

### What to Watch For
1. **Rego Set Iteration:** Always use `rule[key]` syntax for key iteration
2. **Case Sensitivity:** `contains()` is case-sensitive - match test assertions to warning messages
3. **Test Data Structure:** Verify test input matches policy expectations
4. **Debug Strategy:** Create isolated tests for each component (data access, string ops, regex, sets)

---

## ✅ SUCCESS CRITERIA

### Must Have
1. ✅ OPA policy with 5-8 R22 warnings (proper Rego syntax)
2. ✅ Automated script created (AST parsing + diff analysis + safety checks)
3. ✅ Test suite created (10+ test cases, all passing)
4. ✅ Rule file updated with R22 audit procedures
5. ✅ Documentation complete (implementation, summary, handoff)
6. ✅ All tests pass (no syntax/type errors)
7. ✅ Complexity matches estimate (MEDIUM)
8. ✅ Time within estimate (2.5 hours)

### Quality Checks
- **OPA Tests:** All R22 tests pass (watch for set iteration syntax)
- **Script Validation:** No errors, warnings displayed correctly
- **Documentation:** Complete and accurate
- **Code Quality:** Follows established patterns
- **Refactor Detection:** Properly detects refactoring vs. new code

---

## 🚀 NEXT STEPS

1. **Read Reference Documents:**
   - `docs/refactoring.md` - Refactor integrity requirements
   - `.cursor/rules/04-architecture.mdc` - Existing architecture rules
   - `docs/compliance-reports/TIER3-COMPLEXITY-EVALUATION.md` - R22 complexity breakdown

2. **Create Draft (Step 1):**
   - Create `.cursor/rules/04-architecture-R22-DRAFT.md`
   - Create `docs/compliance-reports/TASK5-R22-DRAFT-SUMMARY.md`
   - Present for review

3. **Implement After Approval (Step 3):**
   - Extend `services/opa/policies/architecture.rego` with R22 warnings
   - Create `check-refactor-integrity.py` script
   - Create test suite
   - Update rule file

4. **Complete Documentation:**
   - Create completion summary
   - Update handoff for next rule (R23)

---

**Good luck! R22 is the second-to-last Tier 3 rule. You're almost done! 🎉**

---

**Last Updated:** 2025-12-05  
**Status:** Ready for R22 Implementation

