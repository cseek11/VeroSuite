# Task 5: R14 (Tech Debt Logging) — Draft Summary

**Status:** DRAFT - Awaiting Human Review  
**Created:** 2025-11-23  
**Rule:** R14 - Tech Debt Logging  
**Priority:** MEDIUM (Tier 3 - WARNING)

---

## What Was Generated

### 1. Step 5 Audit Checklist (28 items)
- **Tech Debt Detection:** 4 checks
- **Tech Debt Entry Format:** 6 checks
- **Remediation Plans:** 7 checks
- **Date Compliance:** 5 checks
- **Debt Status Management:** 4 checks
- **Debt Categories:** 7 checks
- **Meaningful Debt Detection:** 7 checks
- **Non-Debt Items:** 5 checks

### 2. OPA Policy Mapping
- **Warning patterns:**
  1. Missing tech debt entry for workaround/workaround introduced
  2. Missing tech debt entry for deferred fix
  3. Missing tech debt entry for deprecated pattern usage
  4. Missing tech debt entry for skipped tests
  5. Missing tech debt entry for hardcoded values
  6. Missing tech debt entry for code duplication
  7. Hardcoded date in tech-debt.md
  8. Incomplete remediation plan (missing steps or effort estimate)
- **Enforcement level:** WARNING (Tier 3 MAD) - Logged but doesn't block
- **Policy file:** `services/opa/policies/tech-debt.rego` (R14 section) - Create if needed

### 3. Automated Check Script
- **Script:** `.cursor/scripts/check-tech-debt.py`
- **Checks:**
  - Detects workarounds without debt entries (pattern matching, AST parsing)
  - Detects deferred fixes without debt entries (pattern matching, TODO/FIXME analysis)
  - Detects deprecated patterns without debt entries (pattern matching)
  - Detects skipped tests without debt entries (pattern matching, test file analysis)
  - Detects hardcoded values without debt entries (pattern matching, AST parsing)
  - Detects code duplication without debt entries (AST parsing, similarity analysis)
  - Verifies tech-debt.md entries follow template format (markdown parsing)
  - Verifies dates use current system date (date parsing, validation)
  - Verifies remediation plans are complete (markdown parsing, template validation)

### 4. Manual Verification Procedures
- **5-step procedure:**
  1. Review Code Changes - Identify all technical debt introduced or modified
  2. Verify Debt Logging - Check that all meaningful debt is logged in `docs/tech-debt.md`
  3. Check Entry Format - Verify debt entries follow template format
  4. Validate Dates - Verify dates use current system date, not hardcoded dates
  5. Review Remediation Plans - Verify remediation plans are complete and actionable
- **5 verification criteria**

### 5. OPA Policy Implementation
- **Full Rego code provided**
- **8 warn rules** (no deny rules for Tier 3)
- **Pattern matching** (AST parsing, file analysis, markdown parsing)

### 6. Test Cases
- **12 test cases specified:**
  1. Happy path (workaround logged as debt)
  2. Happy path (deferred fix logged as debt)
  3. Happy path (complete remediation plan)
  4. Warning (missing debt entry for workaround)
  5. Warning (missing debt entry for deferred fix)
  6. Warning (hardcoded date in tech-debt.md)
  7. Warning (incomplete remediation plan)
  8. Warning (missing debt entry for deprecated pattern)
  9. Edge case (TODOs for current PR - should NOT be logged)
  10. Edge case (ideas for future features - should NOT be logged)
  11. Edge case (debt entry format validation)
  12. Edge case (date format validation)

---

## Review Needed

### Question 1: Tech Debt Detection
**Context:** How should the script detect technical debt that needs to be logged?

**Options:**
- A) Pattern matching (detect common debt patterns: TODO/FIXME, workarounds, deprecated patterns)
- B) AST parsing (analyze code structure, detect debt indicators)
- C) Combination: Pattern matching + AST parsing for accuracy
- D) Heuristic check (verify code changes introduce debt without logging)

**Recommendation:** Option C - Combination approach. Use pattern matching to detect common debt patterns (TODO/FIXME, workarounds, deprecated patterns). Use AST parsing to verify debt is logged in `docs/tech-debt.md`. This provides comprehensive coverage.

**Rationale:** Tech debt detection requires:
- Detecting workarounds (pattern matching: comments, code patterns)
- Detecting deferred fixes (pattern matching: TODO/FIXME analysis)
- Detecting deprecated patterns (pattern matching: deprecated API usage)
- Verifying debt is logged (markdown parsing: check `docs/tech-debt.md`)

---

### Question 2: Meaningful Debt vs Non-Debt
**Context:** How should the script distinguish between meaningful debt (should be logged) and non-debt items (should NOT be logged)?

**Options:**
- A) Pattern matching (detect specific patterns: workarounds, deferred fixes, deprecated patterns)
- B) Heuristic check (verify debt meets criteria: requires >2 hours to fix OR creates risk if forgotten)
- C) Combination: Pattern matching + heuristic check
- D) Configuration-based (use debt criteria from configuration)

**Recommendation:** Option C - Combination approach. Use pattern matching to detect common debt patterns. Use heuristic check to verify debt meets criteria (requires >2 hours to fix OR creates risk if forgotten). This ensures only meaningful debt is logged.

**Rationale:** Meaningful debt detection requires:
- Detecting workarounds (pattern matching)
- Detecting deferred fixes (pattern matching, TODO/FIXME analysis)
- Verifying debt meets criteria (heuristic check: effort estimate, risk assessment)
- Excluding non-debt items (TODOs for current PR, ideas for future features)

---

### Question 3: Date Validation
**Context:** How should the script verify dates use current system date (not hardcoded dates)?

**Options:**
- A) Pattern matching (detect hardcoded dates: YYYY-MM-DD patterns)
- B) Date parsing (parse dates, compare with current system date)
- C) Combination: Pattern matching + date parsing
- D) Heuristic check (verify dates are recent, not historical)

**Recommendation:** Option C - Combination approach. Use pattern matching to detect hardcoded date patterns. Use date parsing to verify dates match current system date (within reasonable range). This ensures date compliance.

**Rationale:** Date validation requires:
- Detecting hardcoded dates (pattern matching: YYYY-MM-DD patterns)
- Verifying dates match current system date (date parsing, comparison)
- Handling edge cases (recent dates, date ranges)
- Providing clear warnings (date mismatch, hardcoded dates)

---

### Question 4: Remediation Plan Validation
**Context:** How should the script verify remediation plans are complete?

**Options:**
- A) Pattern matching (detect required fields: steps, effort estimate, priority)
- B) Markdown parsing (parse markdown, verify template format)
- C) Combination: Pattern matching + markdown parsing
- D) Heuristic check (verify plan includes actionable steps)

**Recommendation:** Option C - Combination approach. Use markdown parsing to verify template format. Use pattern matching to detect required fields (steps, effort estimate, priority). This ensures remediation plans are complete and actionable.

**Rationale:** Remediation plan validation requires:
- Verifying template format (markdown parsing)
- Detecting required fields (pattern matching: steps, effort estimate, priority)
- Verifying plan is actionable (heuristic check: steps are specific, effort is estimated)
- Handling edge cases (partial plans, missing fields)

---

### Question 5: Debt Entry Format Validation
**Context:** How should the script verify debt entries follow the template format?

**Options:**
- A) Pattern matching (detect required fields: category, priority, location, description)
- B) Markdown parsing (parse markdown, verify structure)
- C) Combination: Pattern matching + markdown parsing
- D) Template validation (compare against template structure)

**Recommendation:** Option C - Combination approach. Use markdown parsing to verify structure. Use pattern matching to detect required fields. Use template validation to compare against template structure. This ensures debt entries follow the template format.

**Rationale:** Debt entry format validation requires:
- Verifying markdown structure (markdown parsing)
- Detecting required fields (pattern matching: category, priority, location, description)
- Comparing against template (template validation)
- Handling edge cases (partial entries, missing fields)

---

## Key Decisions Made

### 1. WARNING-Level Enforcement
- **Decision:** Use WARNING enforcement (doesn't block PRs)
- **Rationale:** Tech debt logging is important but not critical. Warnings provide guidance without blocking development.

### 2. Meaningful Debt Focus
- **Decision:** Focus on meaningful debt (requires >2 hours to fix OR creates risk if forgotten)
- **Rationale:** Not all technical issues are debt. Only meaningful debt should be logged to avoid noise.

### 3. Date Compliance Integration
- **Decision:** Integrate with R02 (Date Handling) for consistent date usage
- **Rationale:** Tech debt entries must use current system date, not hardcoded dates.

### 4. Template Format Enforcement
- **Decision:** Enforce template format for consistency
- **Rationale:** Consistent format makes debt entries easier to read, search, and manage.

### 5. Remediation Plan Completeness
- **Decision:** Require complete remediation plans (steps, effort estimate, priority)
- **Rationale:** Complete plans make debt actionable and easier to prioritize.

---

## Implementation Plan

### Phase 1: OPA Policy (Estimated: 0.5 hours)
1. Create `services/opa/policies/tech-debt.rego` (if needed)
2. Implement 8 warning patterns
3. Test with sample violations

### Phase 2: Automated Script (Estimated: 1 hour)
1. Create `.cursor/scripts/check-tech-debt.py`
2. Implement pattern matching for debt detection
3. Implement markdown parsing for entry validation
4. Implement date validation
5. Test with sample files

### Phase 3: Test Suite (Estimated: 0.5 hours)
1. Create `services/opa/tests/tech_debt_r14_test.rego`
2. Implement 12 test cases
3. Test warning patterns

### Phase 4: Rule File Update (Estimated: 0.25 hours)
1. Update `.cursor/rules/12-tech-debt.mdc` with Step 5 section
2. Add audit checklist
3. Add automated checks section
4. Add manual verification procedures

### Phase 5: Documentation (Estimated: 0.25 hours)
1. Create completion document
2. Update handoff document
3. Create testing guide (if needed)

**Total Estimated Time:** 2.5 hours

---

## Next Steps

1. **Review this draft** - Answer questions, provide feedback
2. **Approve or request changes** - Based on review
3. **Implement approved draft** - Create OPA policy, script, tests
4. **Update rule file** - Add Step 5 section to `.cursor/rules/12-tech-debt.mdc`
5. **Create completion document** - Document implementation

---

## Questions for Human Reviewer

1. **Tech Debt Detection:** Do you agree with Option C (pattern matching + AST parsing) for detecting technical debt?

2. **Meaningful Debt vs Non-Debt:** Do you agree with Option C (pattern matching + heuristic check) for distinguishing between meaningful debt and non-debt items?

3. **Date Validation:** Do you agree with Option C (pattern matching + date parsing) for verifying dates use current system date?

4. **Remediation Plan Validation:** Do you agree with Option C (pattern matching + markdown parsing) for verifying remediation plans are complete?

5. **Debt Entry Format Validation:** Do you agree with Option C (pattern matching + markdown parsing + template validation) for verifying debt entries follow template format?

6. **Coverage:** Are there any additional debt patterns that should be detected?

7. **Edge Cases:** Are there any edge cases or special scenarios that should be handled?

8. **WARNING-Level Enforcement:** Do you agree with WARNING-level enforcement (doesn't block PRs) for tech debt logging?

---

**Last Updated:** 2025-11-23  
**Next Review:** After human feedback  
**Estimated Implementation Time:** 2.5 hours





