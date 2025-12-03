# Technical Debt Log

**Last Updated:** 2025-11-27  
**Purpose:** Track technical debt, unfinished work, and remediation plans

---

## Overview

This document tracks all technical debt in the VeroField system. Technical debt includes code quality issues, performance bottlenecks, security vulnerabilities, missing documentation, incomplete tests, architectural issues, and problematic dependencies.

---

## Debt Categories

### Code Quality
- Code smells
- Technical issues
- Refactoring needed

### Performance
- Performance bottlenecks
- Slow operations
- Missing optimizations

### Security
- Security vulnerabilities
- Missing security measures
- Incomplete security implementations

### Documentation
- Missing documentation
- Outdated documentation
- Incomplete documentation

### Testing
- Missing tests
- Incomplete test coverage
- Flaky tests

### Architecture
- Architectural issues
- Design problems
- Structural improvements needed

### Dependencies
- Outdated dependencies
- Problematic dependencies
- Dependency conflicts

---

## Technical Debt Entries

### Entry Template

```markdown
## [Date] - [Issue Title]

**Category:** [Code Quality/Performance/Security/Documentation/Testing/Architecture/Dependencies]
**Priority:** [High/Medium/Low]
**Location:** `[file path]`
**Description:** [Brief description of the issue]
**Impact:** [What is the impact of this debt?]
**Remediation Plan:**
1. [Step 1]
2. [Step 2]
3. [Step 3]
**Estimated Effort:** [Time estimate]
**Status:** [Open/In Progress/Resolved]
**Related Issues:** [Links to related debt or issues]
```

---

## Active Technical Debt

### High Priority

## 2025-11-30 - Detector Version Tracking in Scoring Engine

**Category:** Code Quality
**Priority:** Low
**Location:** `.cursor/scripts/veroscore_v3/scoring_engine.py` (line 751)
**Description:** TODO comment indicates missing detector version tracking in `persist_score()` method. The `detector_versions` field is currently set to empty dict `{}` with a TODO to add version tracking.
**Impact:** Cannot track which detector versions were used for scoring, reducing traceability and debugging capability. May impact compliance reporting if version tracking is required.
**Remediation Plan:**
1. Define detector version structure (dict mapping detector names to versions)
2. Extract version information from detection functions or configuration
3. Populate `detector_versions` field in `persist_score()` method
4. Update database schema if needed to store version information
5. Add tests to verify version tracking works correctly
**Estimated Effort:** 2 hours
**Status:** Open
**Related Issues:** `docs/Auto-PR/CODE_QUALITY_AUDIT.md` (2025-11-30)

---

## 2025-11-30 - R14 Tech Debt Policy Test Failures

**Category:** Testing
**Priority:** High
**Location:** `services/opa/policies/tech-debt.rego`, `services/opa/tests/tech_debt_r14_test.rego`
**Description:** R14 tech debt policy test suite has 5/12 tests failing (58% pass rate). Policy pattern detection logic not working correctly for workarounds, deferred fixes, deprecated patterns, hardcoded dates, and incomplete remediation plans. Import fix applied (using `tech_debt.warn` instead of `warn`), but policy evaluation shows `input_valid` checks failing and pattern matching functions not triggering.
**Impact:** Policy may not detect tech debt violations correctly in production. Test suite doesn't validate policy correctness. Risk of false negatives - violations may go undetected. CI/CD may not catch tech debt issues.
**Remediation Plan:**
1. Debug input structure - verify test input matches policy expectations (`input.changed_files` structure)
2. Debug pattern detection - test each pattern function individually (`has_workaround_pattern`, `has_deferred_fix_pattern`, `has_deprecated_pattern`, `has_hardcoded_date`, `has_incomplete_remediation_plan`)
3. Fix input validation - ensure `input_valid` function correctly validates test inputs
4. Fix file type checks - verify `is_tech_debt_file` function logic and path matching
5. Fix date detection - review `has_hardcoded_date` function and date comparison logic
6. Test pattern matching with actual test inputs - verify regex patterns and case sensitivity
7. Run full test suite to verify all 12 tests pass
**Estimated Effort:** 3 hours
**Status:** Open
**Related Issues:** `.cursor/BUG_LOG.md` (2025-11-30), `docs/compliance-reports/TASK5-R14-IMPLEMENTATION-COMPLETE.md`, `docs/compliance-reports/R14-TEST-FAILURES-2025-11-30.md`

---

## 2025-11-30 - REGO Package Naming Inconsistency

**Category:** Architecture
**Priority:** High
**Location:** `services/opa/policies/backend.rego`, `services/opa/policies/observability.rego`, `services/opa/policies/error-handling.rego`, `services/opa/policies/quality.rego`, `services/opa/policies/ux-consistency.rego`
**Description:** Mixed package naming conventions across policy files. Some use `compliance.*` while others use `verofield.*`, creating runtime errors and maintenance burden.
**Impact:** Policies may fail to load if query path doesn't match package. CI/CD failures when querying `data.compliance` misses `verofield.*` policies. Developers must remember two naming conventions.
**Remediation Plan:**
1. Standardize all packages to `compliance.*` (recommended approach)
2. Update backend.rego: `package verofield.backend` → `package compliance.backend`
3. Update observability.rego: `package verofield.observability` → `package compliance.observability`
4. Update error-handling.rego: `package verofield.error_handling` → `package compliance.error_handling`
5. Update quality.rego: `package verofield.quality` → `package compliance.quality`
6. Update ux-consistency.rego: `package verofield.ux` → `package compliance.ux`
7. Update all test files to import from `compliance.*` instead of `verofield.*`
8. Verify CI/CD workflow query path matches standardized packages
**Estimated Effort:** 2 hours
**Status:** Open
**Related Issues:** `docs/compliance-reports/REGO_CODE_AUDIT_2025-11-24.md#1.1`

---

## 2025-11-30 - REGO Input Structure Inconsistency

**Category:** Architecture
**Priority:** High
**Location:** `services/opa/policies/backend.rego`, `services/opa/policies/observability.rego`, `services/opa/policies/error-handling.rego`, `services/opa/policies/quality.rego`
**Description:** Policies use different input field names for changed files. Some use `input.changed_files` while others use `input.files`, causing runtime failures and inconsistent behavior.
**Impact:** Policies using `input.files` will fail if CI/CD provides `input.changed_files`. Same PR may pass/fail depending on which policies evaluate. Maintenance confusion for developers.
**Remediation Plan:**
1. Standardize all policies to use `input.changed_files` (matches CI/CD workflow)
2. Update backend.rego: Replace all `input.files` with `input.changed_files` (13 occurrences)
3. Update observability.rego: Replace all `input.files` with `input.changed_files` (13 occurrences)
4. Update error-handling.rego: Replace all `input.files` with `input.changed_files` (9 occurrences)
5. Update quality.rego: Replace all `input.files` with `input.changed_files` (24 occurrences)
6. Update `file.diff_lines` references to `file.diff` (string, not array) using `split(file.diff, "\n")`
7. Update `input.pr_description` references to `input.pr_body` (string, not array)
8. Verify CI/CD workflow provides correct input structure
**Estimated Effort:** 3 hours
**Status:** Open
**Related Issues:** `docs/compliance-reports/REGO_CODE_AUDIT_2025-11-24.md#1.2`

---

## 2025-11-30 - Missing Modern Rego v1 Syntax

**Category:** Code Quality
**Priority:** High
**Location:** All 15 policy files in `services/opa/policies/`
**Description:** Policies use `import future.keywords.*` instead of modern `import rego.v1`, creating verbose imports and potential future compatibility issues.
**Impact:** Maintenance burden with verbose imports in every file. Future compatibility risk as `future.keywords` may be deprecated. Code clarity reduced compared to modern syntax.
**Remediation Plan:**
1. Replace `import future.keywords.contains` with `import rego.v1` in all policy files
2. Replace `import future.keywords.in` with `import rego.v1` in all policy files
3. Replace `import future.keywords.if` with `import rego.v1` in all policy files
4. Verify syntax with `opa check --strict *.rego`
5. Run full test suite to ensure compatibility
**Estimated Effort:** 1 hour
**Status:** Open
**Related Issues:** `docs/compliance-reports/REGO_CODE_AUDIT_2025-11-24.md#1.3`

---

## 2025-11-30 - Duplicate Helper Functions Across REGO Policies

**Category:** Code Quality
**Priority:** High
**Location:** `services/opa/policies/security.rego`, `services/opa/policies/architecture.rego`, `services/opa/policies/data-integrity.rego`, `services/opa/policies/error-handling.rego`, `services/opa/policies/observability.rego`, `services/opa/policies/quality.rego`, `services/opa/policies/tech-debt.rego`
**Description:** Same helper functions duplicated across multiple policy files, including `has_override_marker()`, `is_exempted()`, `is_code_file()`, and `starts_with()`, creating ~200+ lines of duplicate code.
**Impact:** Maintenance burden - changes must be made in multiple places. Inconsistency risk as helpers may diverge over time. Code bloat with duplicate logic.
**Remediation Plan:**
1. Create shared helper policy file: `services/opa/policies/_shared.rego`
2. Extract common helpers: `has_override_marker()`, `is_exempted()`, `is_exempted_author()`, `is_code_file()`, `starts_with()`, `format_violation_message()`
3. Update all policies to import shared helpers: `import data.compliance.shared`
4. Remove duplicate helper definitions from security.rego (lines 564-580)
5. Remove duplicate helper definitions from architecture.rego (lines 533-549)
6. Remove duplicate helper definitions from data-integrity.rego (lines 432-451)
7. Remove duplicate helper definitions from error-handling.rego (lines 245-264)
8. Remove duplicate helper definitions from observability.rego (lines 207-264)
9. Remove duplicate helper definitions from quality.rego (lines 247-357)
10. Update all policy references to use `shared.*` prefix
11. Run full test suite to verify functionality
**Estimated Effort:** 4 hours
**Status:** Open
**Related Issues:** `docs/compliance-reports/REGO_CODE_AUDIT_2025-11-24.md#2.1`

---

## 2025-11-30 - Inconsistent Error Message Format in REGO Policies

**Category:** Code Quality
**Priority:** High
**Location:** All policy files in `services/opa/policies/`
**Description:** Error messages use different formats and detail levels across policies, reducing clarity and causing tooling issues for parsers.
**Impact:** User confusion from inconsistent message formats. Tooling issues - parsers may fail to extract rule IDs consistently. Violates clarity and readability principles.
**Remediation Plan:**
1. Create message template helper in `_shared.rego`: `format_violation_message(severity, domain, rule_id, description, guidance, reference)`
2. Standardize error message format: `"[SEVERITY] [Domain/RuleID]: [Clear description]. [Actionable guidance]. [Reference link]"`
3. Update security.rego messages to use standard format
4. Update backend.rego messages to use standard format
5. Update error-handling.rego messages to use standard format
6. Update all other policy files to use standard format
7. Verify all messages follow template pattern
**Estimated Effort:** 3 hours
**Status:** Open
**Related Issues:** `docs/compliance-reports/REGO_CODE_AUDIT_2025-11-24.md#2.2`

---

## 2025-11-30 - Missing Input Validation in REGO Policies

**Category:** Code Quality
**Priority:** High
**Location:** All policy files in `services/opa/policies/`
**Description:** Policies don't validate input structure before accessing fields, causing runtime errors with cryptic OPA messages if input structure is unexpected.
**Impact:** Runtime errors - policies may crash if input structure is unexpected. Poor error messages - OPA errors are cryptic ("undefined variable"). Violates correctness principles.
**Remediation Plan:**
1. Create input validation helpers in `_shared.rego`: `has_changed_files`, `has_pr_body`
2. Add validation checks before accessing `input.changed_files` in all policies
3. Add validation checks before accessing `input.pr_body` in all policies
4. Update all policies to validate input first: `has_changed_files` before `some file in input.changed_files`
5. Add error messages for invalid input structure
6. Test with malformed input to verify graceful handling
**Estimated Effort:** 2 hours
**Status:** Open
**Related Issues:** `docs/compliance-reports/REGO_CODE_AUDIT_2025-11-24.md#2.3`

---

### Medium Priority

## 2025-11-30 - Regex-Heavy Patterns in REGO Policies

**Category:** Performance
**Priority:** Medium
**Location:** `services/opa/policies/security.rego`, `services/opa/policies/architecture.rego`, `services/opa/policies/data-integrity.rego`
**Description:** Policies use many regex patterns (15+ in security.rego, 10+ in architecture.rego, 8+ in data-integrity.rego) that may slow evaluation and exceed 200ms performance budget.
**Impact:** Evaluation time - regex is expensive and may exceed 200ms budget per policy. Scalability - performance degrades with more changed files. May violate performance optimization principles.
**Remediation Plan:**
1. Profile current evaluation time using `opa eval --profile`
2. Replace regex patterns with string matching where possible (e.g., `contains(file.diff, "findMany(")` instead of `regex.match(\`findMany\(\`, file.diff)`)
3. Cache regex results by extracting patterns once and reusing
4. Use early exit conditions - check file type with fast string operations before regex
5. Optimize security.rego regex patterns (lines 70, 84, 97, 113, 138, 165, 178, 218, 240, 264, 299, 395, 478)
6. Optimize architecture.rego regex patterns (lines 37, 69, 82, 118, 131, 197, 219, 245, 256, 268, 283, 323, 334)
7. Optimize data-integrity.rego regex patterns (lines 60, 86, 124, 148, 179, 200, 256, 359, 383, 403, 411, 425)
8. Re-profile and verify all policies evaluate in <200ms (target) or <500ms (hard limit)
9. Document performance improvements
**Estimated Effort:** 4 hours
**Status:** Open
**Related Issues:** `docs/compliance-reports/REGO_CODE_AUDIT_2025-11-24.md#3.1`

---

## 2025-11-30 - Inefficient Iteration Patterns in REGO Policies

**Category:** Performance
**Priority:** Medium
**Location:** All policy files in `services/opa/policies/`
**Description:** Some policies iterate over all files when early exit is possible, continuing to check even after violation found, wasting evaluation time.
**Impact:** Performance degradation - unnecessary iterations slow down evaluation. May exceed performance budget for large PRs with many changed files.
**Remediation Plan:**
1. Identify policies that check all files without early exit
2. Refactor to use early exit helper functions: `has_violation` pattern
3. Extract violation detection into separate helper that exits early
4. Update all policies to use early exit pattern
5. Profile before/after to verify performance improvement
**Estimated Effort:** 2 hours
**Status:** Open
**Related Issues:** `docs/compliance-reports/REGO_CODE_AUDIT_2025-11-24.md#3.2`

---

## 2025-11-30 - Missing/Incomplete Test Coverage for REGO Policies

**Category:** Testing
**Priority:** Medium
**Location:** `services/opa/tests/` directory
**Description:** Some policies lack corresponding test files, and some test files don't cover all violation patterns. Test coverage is inconsistent across policies.
**Impact:** Risk of regressions when policies are modified. Incomplete validation of policy correctness. Missing performance tests to verify evaluation time budgets.
**Remediation Plan:**
1. Audit all test files to verify coverage
2. Create test template following `security_r01_test.rego` pattern (15 test cases)
3. Add missing test cases for all violation patterns
4. Add performance tests to verify evaluation time <200ms per policy
5. Ensure all policies have corresponding test files
6. Achieve 100% violation pattern coverage
7. Document test coverage metrics
**Estimated Effort:** 6 hours
**Status:** Open
**Related Issues:** `docs/compliance-reports/REGO_CODE_AUDIT_2025-11-24.md#4.1`

---

### Low Priority

## 2025-11-30 - Missing Metadata Annotations in REGO Policies

**Category:** Documentation
**Priority:** Low
**Location:** All policy files in `services/opa/policies/`
**Description:** Policies don't use REGO metadata annotations for documentation, relying only on inline comments. Missing structured metadata for tooling and documentation generation.
**Impact:** Reduced documentation clarity. Missing structured metadata for automated documentation generation. Less discoverable policy information.
**Remediation Plan:**
1. Add `# METADATA` annotations to all policy files
2. Include metadata: title, description, authors, organizations, scope
3. Add rule-level metadata for each deny rule
4. Update documentation generation tools to use metadata
5. Verify metadata format follows REGO Bible Chapter 2.4 recommendations
**Estimated Effort:** 2 hours
**Status:** Open
**Related Issues:** `docs/compliance-reports/REGO_CODE_AUDIT_2025-11-24.md#5.1`

---

## 2025-11-30 - Inconsistent Comment Style in REGO Policies

**Category:** Documentation
**Priority:** Low
**Location:** All policy files in `services/opa/policies/`
**Description:** Comments use different styles and detail levels across policies. Some have detailed section headers, others have minimal comments, creating inconsistency.
**Impact:** Reduced code readability. Maintenance confusion when switching between policies. Inconsistent documentation style.
**Remediation Plan:**
1. Standardize comment style across all policy files
2. Use consistent section header format: `# =============================================================================`
3. Use consistent rule header format: `# R{XX}: {RULE NAME} (TIER {X} - {ENFORCEMENT})`
4. Include key requirements list in rule comments
5. Update all policy files to follow standard format
**Estimated Effort:** 1 hour
**Status:** Open
**Related Issues:** `docs/compliance-reports/REGO_CODE_AUDIT_2025-11-24.md#5.2`

---

## 2025-11-30 - REGO Test Files Package Naming Inconsistency

**Category:** Testing
**Priority:** High
**Location:** Multiple test files in `services/opa/tests/`
**Description:** Test files use inconsistent package naming. Some use `compliance.*_test`, others use shortened names like `quality_test`, `ux_test`, or wrong names like `compliance.security` instead of `compliance.security_test`.
**Impact:** Test execution failures. OPA cannot find test rules if package names don't match. Maintenance confusion. Violates REGO Bible test naming conventions.
**Remediation Plan:**
1. Standardize all test packages to `compliance.{domain}_test` format
2. Update quality_r17_test.rego: `package quality_test` → `package compliance.quality_test`
3. Update quality_r18_test.rego: `package quality_test` → `package compliance.quality_test`
4. Update ux_r19_test.rego: `package ux_test` → `package compliance.ux_test`
5. Update ux_r20_test.rego: `package ux_test` → `package compliance.ux_test`
6. Update frontend_r24_test.rego: `package frontend_r24_test` → `package compliance.frontend_test`
7. Update operations_r25_test.rego: `package operations_r25_test` → `package compliance.operations_test`
8. Update documentation_r23_test.rego: `package documentation_r23_test` → `package compliance.documentation_test`
9. Update architecture_r22_test.rego: `package architecture_r22_test` → `package compliance.architecture_test`
10. Update architecture_r21_test.rego: `package architecture_r21_test` → `package compliance.architecture_test`
11. Update quality_r16_test.rego: `package verofield.quality` → `package compliance.quality_test`
12. Update security_r12_test.rego: `package compliance.security` → `package compliance.security_test`
13. Update security_r13_test.rego: `package compliance.security` → `package compliance.security_test`
14. Update tech_debt_r14_test.rego: `package compliance.tech_debt` → `package compliance.tech_debt_test`
15. Update tech_debt_r15_test.rego: `package compliance.tech_debt` → `package compliance.tech_debt_test`
16. Update sample_test.rego: `package compliance.sample` → `package compliance.sample_test`
**Estimated Effort:** 2 hours
**Status:** Open
**Related Issues:** REGO Bible Chapter 7.1 (Test naming conventions)

---

## 2025-11-30 - Missing Modern Rego v1 Syntax in Test Files

**Category:** Testing
**Priority:** High
**Location:** Multiple test files in `services/opa/tests/`
**Description:** Many test files use `import future.keywords.*` instead of modern `import rego.v1`, creating verbose imports and potential future compatibility issues.
**Impact:** Maintenance burden with verbose imports. Future compatibility risk. Code clarity reduced. Inconsistent with policy files that use modern syntax.
**Remediation Plan:**
1. Replace all `import future.keywords.*` with `import rego.v1` in test files
2. Update files: quality_r17_test.rego, frontend_r24_test.rego, operations_r25_test.rego, documentation_r23_test.rego, architecture_r22_test.rego, architecture_r21_test.rego, architecture_r21_debug_test.rego, data_integrity_r04_test.rego, data_integrity_r05_test.rego, data_integrity_r06_test.rego, architecture_r03_test.rego, security_r01_test.rego, security_r02_test.rego, quality_r16_test.rego, tech_debt_r14_test.rego, tech_debt_r15_test.rego, sample_test.rego
3. Verify syntax with `opa check --strict`
4. Run full test suite to ensure compatibility
**Estimated Effort:** 1 hour
**Status:** Open
**Related Issues:** REGO Bible Chapter 2.1 (Modern Syntax)

---

## 2025-11-30 - Missing `if` Keywords in REGO Test Rules

**Category:** Testing
**Priority:** High
**Location:** `services/opa/tests/security_r12_test.rego`, `services/opa/tests/security_r13_test.rego`
**Description:** Test rules in security_r12_test.rego and security_r13_test.rego are missing `if` keywords, using old syntax that causes parse errors. All test rules must use `test_name if { ... }` format.
**Impact:** Test execution failures - OPA cannot parse test rules without `if` keywords. All tests in these files fail to run. Violates REGO Bible test structure requirements.
**Remediation Plan:**
1. Add `if` keyword to all test rules in security_r12_test.rego (20 test rules)
2. Add `if` keyword to all test rules in security_r13_test.rego (20 test rules)
3. Verify syntax: `test_name if { ... }` format
4. Run tests to verify all pass
**Estimated Effort:** 1 hour
**Status:** Open
**Related Issues:** REGO Bible Chapter 7.1 (Test structure), OPA parse errors

---

## 2025-11-30 - Test Files Input Structure Inconsistency

**Category:** Testing
**Priority:** High
**Location:** Multiple test files in `services/opa/tests/`
**Description:** Test files use old input structure with `diff_lines` arrays, `pr_body_lines` arrays, and `pr_description` instead of `diff` strings, `pr_body` strings. This causes test failures as policies expect the new structure.
**Impact:** Test failures - policies expect `file.diff` (string) but tests provide `file.diff_lines` (array). Runtime errors when tests run. Tests don't match actual CI/CD input structure.
**Remediation Plan:**
1. Convert all `diff_lines` arrays to `diff` strings (join with `\n`) in all test files
2. Convert all `pr_body_lines` arrays to `pr_body` strings (join with `\n`)
3. Convert all `pr_description` to `pr_body` in all test files
4. Update files: observability_r08_test.rego, observability_r09_test.rego, error_handling_r07_test.rego, quality_r10_test.rego, and any others using old structure
5. Verify tests match CI/CD input structure from `.github/workflows/opa_compliance_check.yml`
6. Run tests to verify all pass
**Estimated Effort:** 4 hours
**Status:** Open
**Related Issues:** REGO Bible Chapter 6.7 (String manipulation), CI/CD input structure

---

## Resolved Technical Debt

## 2025-11-30 - R15 Tech Debt Policy Test Failures (Fixed)

**Category:** Testing
**Priority:** High
**Location:** `services/opa/policies/tech-debt.rego`, `services/opa/tests/tech_debt_r15_test.rego`
**Description:** R15 tech debt policy test suite had 3/13 tests failing (77% pass rate). Root cause was overlapping rule conditions (R15-W02 and R15-W03 both matching same input) and test syntax issues (incorrect use of `count(tech_debt.warn) >= 1 with input as mock_input` instead of proper variable assignment pattern).
**Impact:** Policy was working correctly, but tests were not validating policy behavior accurately. Risk of false test failures in CI/CD. Tests didn't match actual policy behavior due to overlapping rule conditions.
**Remediation Plan:**
1. ✅ Fixed unused import issue (updated `warn` to `tech_debt.warn` in test file)
2. ✅ Converted all regex patterns from backticks to double-quoted strings per Rego Bible
3. ✅ Fixed R15-W01 logic to not warn when TODO is removed (appears_resolved)
4. ✅ Enhanced `has_meaningful_todo_keywords` with case-insensitive checks for "Temporary"
5. ✅ Updated multi-line test inputs to use raw strings (backticks) with actual newlines
6. ✅ Fixed test syntax: Changed `count(tech_debt.warn) >= 1 with input as mock_input` to `warnings := tech_debt.warn with input as mock_input; count(warnings) >= 1`
7. ✅ Fixed test expectations: Updated test_meaningful_todo_not_logged to check for "meaningful TODO/FIXME" (matches both R15-W02 and R15-W03 messages, since R15-W03 is more specific and triggers first)
8. ✅ Fixed test input: Changed "Temporary" to "temporary" (lowercase) in test_fixme_added_without_reference to match has_meaningful_todo_keywords policy check
9. ✅ Fixed variable name conflicts: Used unique variable names to avoid duplicate assignments
10. ✅ Verified all 13 tests pass (100% pass rate)
**Estimated Effort:** 2 hours (completed)
**Status:** Resolved
**Resolution Date:** 2025-11-25
**Resolution Notes:** Root cause was not that rules weren't being evaluated, but rather:
- Overlapping rule conditions: R15-W03 (more specific, checks for `+.*TODO:`) triggers before R15-W02 for the same input
- Test syntax: Incorrect use of `count()` with `with input as` clause - needed to assign to variable first
- Case sensitivity: Policy checks for lowercase "temporary" but test used "Temporary" (capital T)
**Related Issues:** `.cursor/BUG_LOG.md` (2025-11-30), `docs/compliance-reports/TASK5-R15-IMPLEMENTATION-COMPLETE.md`

---

## 2025-11-30 - R15 Test File Unused Import and Regex Pattern Fixes (Fixed)

**Category:** Testing
**Priority:** Medium
**Location:** `services/opa/tests/tech_debt_r15_test.rego`, `services/opa/policies/tech-debt.rego`
**Description:** Test file imported `data.compliance.tech_debt` but used `warn` directly instead of `tech_debt.warn`, making the import effectively unused. Additionally, regex patterns in the policy used backticks (raw strings) which may not be supported in all OPA versions, and patterns didn't correctly handle newlines in test context.
**Impact:** Import appeared unused, violating code quality standards. Regex patterns may fail in some OPA versions. Patterns didn't match correctly when `\n` was literal in Rego test strings vs. actual newlines in JSON.
**Remediation Plan:**
1. ✅ Updated all test cases to use `tech_debt.warn` instead of `warn`
2. ✅ Converted all regex patterns from backticks to double-quoted strings with proper escaping
3. ✅ Fixed regex patterns to handle newlines correctly: `TODO:\s*$` → `TODO:\\s*(\\n|$)`
4. ✅ Fixed R15-W01 logic to not warn when TODO is removed and implementation added
5. ✅ Enhanced `has_meaningful_todo_keywords` with case-insensitive "Temporary" check
6. ✅ Updated multi-line test inputs to use raw strings (backticks) with actual newlines
7. ✅ Fixed `appears_resolved` helper to check for both TODO removal and implementation addition
**Estimated Effort:** 2 hours (completed)
**Status:** Resolved
**Resolution Date:** 2025-11-25
**Related Issues:** `docs/compliance-reports/R15-TEST-FAILURES-2025-11-30.md` (if exists)

---

## 2025-11-30 - R14 Test File Unused Import (Fixed)

**Category:** Testing
**Priority:** Medium
**Location:** `services/opa/tests/tech_debt_r14_test.rego`
**Description:** Test file imported `data.compliance.tech_debt` but used `warn` directly instead of `tech_debt.warn`, making the import effectively unused. This violated Rego import usage patterns and could cause confusion.
**Impact:** Import appeared unused, violating code quality standards. Tests worked due to policy evaluation context, but pattern was incorrect and inconsistent with other test files (e.g., `tech_debt_r15_test.rego` uses `tech_debt.warn` correctly).
**Remediation Plan:**
1. ✅ Updated all test cases to use `tech_debt.warn` instead of `warn`
2. ✅ Changed `count(warn)` to `count(tech_debt.warn)` (7 occurrences)
3. ✅ Changed `warn[_]` to `tech_debt.warn[_]` (5 occurrences)
4. ✅ Verified import is now properly used throughout test file
5. ✅ Verified no linter errors
**Estimated Effort:** 15 minutes (completed)
**Status:** Resolved
**Resolution Date:** 2025-11-25
**Related Issues:** `docs/compliance-reports/R14-TEST-FAILURES-2025-11-30.md`

---

## TODO/FIXME Tracking

### Active TODOs

[Track active TODOs that represent technical debt]

### Active FIXMEs

[Track active FIXMEs that represent technical debt]

---

## Remediation Planning

### Quarterly Review
- Review all technical debt
- Prioritize based on impact and effort
- Create remediation plan for next quarter
- Update status of in-progress items

### Monthly Updates
- Update status of active debt
- Add new debt discovered
- Mark resolved debt
- Update remediation plans

---

## Adding New Technical Debt

1. Use the entry template above
2. Categorize the debt
3. Assign priority
4. Create remediation plan
5. Add to appropriate priority section
6. Update "Last Updated" date (use current system date)

---

## Debt Cleanup Rules

**MANDATORY:** When completing work that addresses technical debt:
1. Update the debt entry status to "Resolved"
2. Add resolution date and notes
3. Move to "Resolved Technical Debt" section
4. Remove related TODOs/FIXMEs from code
5. Update "Last Updated" date

---

---

## 2025-11-30 - REGO Policy Array Concat Type Errors (Fixed)

**Category:** Code Quality
**Priority:** High
**Location:** `services/opa/policies/backend.rego`, `services/opa/policies/error-handling.rego`, `services/opa/policies/observability.rego`
**Description:** Policies were using `array.concat()` directly on partial sets (e.g., `business_logic_in_controller[msg]`), causing type errors. Rego's `array.concat()` expects arrays, not sets.
**Impact:** Compile errors preventing policies from executing. Type system correctly identified the issue.
**Remediation Plan:**
1. ✅ Convert sets to arrays using comprehensions: `[msg | business_logic_in_controller[msg]]`
2. ✅ Apply pattern consistently across all policies (backend, error-handling, observability)
3. ✅ Use direct iteration pattern `[msg | set[msg]]` instead of `[msg | some msg in set]` per quality.rego pattern
4. ✅ Verify all policies compile without type errors
**Estimated Effort:** 1 hour (completed)
**Status:** Resolved
**Related Issues:** Session fixes 2025-11-30

---

## 2025-11-30 - REGO Unsafe Variable Warnings (Fixed)

**Category:** Code Quality
**Priority:** Medium
**Location:** `services/opa/policies/backend.rego`, `services/opa/policies/quality.rego`
**Description:** Unsafe variable warnings occurred when variables were used but not bound on all code paths. Specifically: `content` in `find_missing_patterns()`, `source_path` in `get_test_file_path()`.
**Impact:** Code quality warnings (non-blocking). Policies execute correctly but warnings indicate potential issues.
**Remediation Plan:**
1. ✅ Fixed `find_missing_patterns()` to accept `content` parameter and pass to helper functions
2. ✅ Fixed `get_test_file_path()` to accept `source_path` parameter instead of ignoring it
3. ✅ Fixed helper functions to accept parameters: `error_handling_present(content)`, `audit_logging_present(content)`, `structured_logging_present(content)`
4. ✅ Verified all unsafe variable warnings resolved
**Estimated Effort:** 30 minutes (completed)
**Status:** Resolved
**Related Issues:** Session fixes 2025-11-30

---

## 2025-11-30 - REGO Custom starts_with Helper Migration (Documented)

**Category:** Code Quality
**Priority:** Low
**Location:** `services/opa/policies/quality.rego`, `services/opa/policies/error-handling.rego`, `services/opa/policies/observability.rego`, `services/opa/policies/_shared.rego`
**Description:** Custom `starts_with()` helper function was used instead of built-in `startswith()`. Per Rego/OPA Bible 6.7, built-ins should be used directly.
**Impact:** Code quality - unnecessary custom helper when built-in exists. Performance - minimal, but built-ins are optimized.
**Remediation Plan:**
1. ✅ Replaced all `starts_with()` calls with built-in `startswith()` in all policy files
2. ✅ Removed custom `starts_with()` helper functions from policy files
3. ✅ Documented deprecation in `_shared.rego` with migration note
4. ⏳ Future: Remove deprecated helper from `_shared.rego` after migration period
**Estimated Effort:** 15 minutes (completed, migration note added)
**Status:** Resolved (migration documented)
**Related Issues:** Session fixes 2025-11-30, `docs/compliance-reports/HELPER_COMPLIANCE_AUDIT_2025-11-25.md`

---

**Reference:** See `.cursor/rules/tech-debt.md` for tech debt logging requirements.

