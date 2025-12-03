# R14 Tech Debt Policy Test Failures Report

**Date:** 2025-11-25  
**Rule:** R14 - Tech Debt Logging  
**Status:** ⚠️ PARTIAL - 7/12 tests passing (58%)  
**Priority:** MEDIUM (Test suite debugging required)

---

## Executive Summary

The R14 tech debt policy test suite (`tech_debt_r14_test.rego`) has **5 out of 12 tests failing**. The import fix was successfully applied (using `tech_debt.warn` instead of `warn`), but the policy pattern detection logic is not working correctly for several warning patterns.

---

## Test Results

### ✅ Passing Tests (7/12)

1. ✅ `test_complete_remediation_plan` - PASS (30.36ms)
2. ✅ `test_debt_entry_format_validation` - PASS (37.84ms)
3. ✅ `test_date_format_validation_current_date` - PASS (40.58ms)
4. ✅ `test_ideas_for_future_features` - PASS (44.37ms)
5. ✅ `test_workaround_logged_as_debt` - PASS (47.40ms)
6. ✅ `test_todos_for_current_pr_with_debt_update` - PASS (46.46ms)
7. ✅ `test_deferred_fix_logged_as_debt` - PASS (49.21ms)

### ❌ Failing Tests (5/12)

1. ❌ `test_hardcoded_date_in_tech_debt` - FAIL (40.43ms)
   - **Issue:** Policy not detecting hardcoded dates in tech-debt.md
   - **Expected:** Warning for date `2024-11-16` (historical date)
   - **Actual:** No warning generated

2. ❌ `test_incomplete_remediation_plan` - FAIL (41.14ms)
   - **Issue:** Policy not detecting incomplete remediation plans
   - **Expected:** Warning for remediation plan with only 1 step
   - **Actual:** No warning generated

3. ❌ `test_missing_debt_entry_for_deprecated_pattern` - FAIL (44.22ms)
   - **Issue:** Policy not detecting deprecated patterns
   - **Expected:** Warning for `@deprecated` comment without tech-debt.md entry
   - **Actual:** No warning generated

4. ❌ `test_missing_debt_entry_for_workaround` - FAIL (46.83ms)
   - **Issue:** Policy not detecting workaround patterns
   - **Expected:** Warning for `TODO: Fix N+1 query (workaround for now)` without tech-debt.md entry
   - **Actual:** No warning generated

5. ❌ `test_missing_debt_entry_for_deferred_fix` - FAIL (46.83ms)
   - **Issue:** Policy not detecting deferred fix patterns
   - **Expected:** Warning for `FIXME: Validation deferred due to time constraint` without tech-debt.md entry
   - **Actual:** No warning generated

---

## Root Cause Analysis

### Import Fix Applied ✅

The test file was successfully updated to use the imported package correctly:
- **Before:** `count(warn) == 0` and `warn[_]`
- **After:** `count(tech_debt.warn) == 0` and `tech_debt.warn[_]`

This fix is working correctly - the import is no longer unused.

### Policy Pattern Detection Issues ❌

From verbose test output, the following issues are identified:

1. **Input Validation Failing:**
   - Policy checks `input_valid` which requires `is_array(input.changed_files)`
   - Tests use `with input as mock_input` which should work, but policy evaluation shows `input_valid` checks failing
   - This suggests the input structure may not match policy expectations

2. **Pattern Matching Not Triggering:**
   - Pattern detection functions (`has_workaround_pattern`, `has_deferred_fix_pattern`, `has_deprecated_pattern`, etc.) are not matching test inputs
   - Functions check for patterns in `file.diff` but may not be correctly accessing the diff content

3. **File Type Checks:**
   - `is_tech_debt_file(file)` checks are failing
   - Policy expects `contains(file.path, "docs/tech-debt.md")` but test inputs may not match this structure

---

## Detailed Failure Analysis

### Test: `test_missing_debt_entry_for_workaround`

**Test Input:**
```rego
mock_input := {"changed_files": [{
    "path": "apps/api/src/users/users.service.ts",
    "diff": "// TODO: Fix N+1 query (workaround for now)",
}]}
```

**Expected Behavior:**
- Policy should detect workaround pattern (`TODO:` + `workaround`)
- Policy should check if tech-debt.md is updated
- Policy should generate warning if tech-debt.md not updated

**Actual Behavior:**
- Policy evaluation shows `input_valid` failing
- Pattern detection functions not being evaluated
- No warning generated

**Debugging Steps Needed:**
1. Verify input structure matches policy expectations
2. Test `has_workaround_pattern` function in isolation
3. Check if `file.diff` is correctly accessed
4. Verify `pr_updates_tech_debt` logic

### Test: `test_hardcoded_date_in_tech_debt`

**Test Input:**
```rego
mock_input := {"changed_files": [{
    "path": "docs/tech-debt.md",
    "diff": "## 2024-11-16 - Old Issue\n**Category:** Performance",
}]}
```

**Expected Behavior:**
- Policy should detect hardcoded date `2024-11-16` (before current date)
- Policy should generate warning about hardcoded historical dates

**Actual Behavior:**
- `has_hardcoded_date` function not triggering
- Date detection logic may not be working correctly
- No warning generated

**Debugging Steps Needed:**
1. Test `has_hardcoded_date` function with various date formats
2. Verify date comparison logic (current date vs. hardcoded date)
3. Check regex pattern for date detection

---

## Next Steps

### Immediate Actions

1. **Debug Input Structure:**
   - Verify test input structure matches policy expectations
   - Check if `input.changed_files` is correctly structured
   - Test `input_valid` function in isolation

2. **Debug Pattern Detection:**
   - Test each pattern detection function individually
   - Verify pattern matching logic (regex, contains, etc.)
   - Check if `file.diff` content is correctly accessed

3. **Debug File Type Checks:**
   - Verify `is_tech_debt_file` function logic
   - Test with various file path formats
   - Check path matching logic

### Recommended Fixes

1. **Fix Input Validation:**
   - Ensure test inputs match policy expectations
   - Add input structure validation in tests
   - Verify `with input as mock_input` syntax

2. **Fix Pattern Detection:**
   - Review pattern matching functions
   - Test regex patterns with actual test inputs
   - Verify case sensitivity and whitespace handling

3. **Fix Date Detection:**
   - Review date detection logic
   - Test with various date formats
   - Verify current date comparison

---

## Related Documentation

- **Bug Log Entry:** `.cursor/BUG_LOG.md` (2025-11-25)
- **Implementation Status:** `docs/compliance-reports/TASK5-R14-IMPLEMENTATION-COMPLETE.md`
- **Policy File:** `services/opa/policies/tech-debt.rego`
- **Test File:** `services/opa/tests/tech_debt_r14_test.rego`

---

## Test Execution Command

```bash
cd services/opa
.\bin\opa.exe test tests/tech_debt_r14_test.rego policies/tech-debt.rego -v
```

**Current Result:** 7/12 passing (58%)

---

**Reported By:** AI Agent  
**Date:** 2025-11-25  
**Status:** Open - Awaiting Policy Debugging


