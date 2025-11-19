# Reward Score Investigation: -6 Penalty Pattern

**Date:** 2025-11-19  
**Issue:** Consistent -6 penalties appearing in batches, when rubric specifies -4 for `failing_ci`

## Findings

### Score Distribution
- **Total PRs analyzed:** 61
- **All PRs have negative scores** (100% negative)
- **-6 scores:** 13 PRs (21.3%)
- **-9 scores:** 27 PRs (44.3%) - most common
- **-3, -5, -7, -8 scores:** Various counts

### Pattern Analysis

**All -6 scores have identical breakdown:**
```
tests:       +1
bug_fix:      0
docs:        +1
performance: +1
security:    -3
penalties:   -6
Total:       -6
```

**Key Observations:**
1. **Security consistently -3:** All PRs have critical security issues detected (Semgrep ERROR severity)
2. **Penalties are -6:** But rubric says `failing_ci` should be -4
3. **Batch pattern:** -6 scores appear in consecutive batches (e.g., PRs #71, #70, #73, #72, #74 all scored -6 within 40 seconds)

### Root Cause Hypothesis

**The -6 penalty suggests one of these scenarios:**

1. **Double Penalty Bug (Most Likely):**
   - Both `failing_ci` (-4) and `missing_tests` (-2) are being applied
   - Expected: Only one should apply (if/elif logic)
   - Possible cause: Coverage parsing bug where both conditions evaluate to true

2. **Coverage Parsing Issue:**
   - When coverage is missing, workflow creates `{}` (empty dict)
   - Coverage parsing might return unexpected values
   - Both `frontend_coverage == 0` and `frontend_coverage < 20` might both be true due to type coercion

3. **Missing Regression Penalty:**
   - Rubric has `regression: -3` but it's not implemented in `calculate_penalties()`
   - If regression penalty was being applied elsewhere: -4 + -2 = -6

### Code Analysis

**Penalty calculation logic:**
```python
def calculate_penalties(coverage: dict, static_analysis: dict, rubric: dict):
    penalties = rubric.get("penalties", {})
    total_penalty = 0
    
    frontend_coverage = coverage.get("frontend", {}).get("percentage", 0)
    backend_coverage = coverage.get("backend", {}).get("percentage", 0)
    
    if frontend_coverage == 0 and backend_coverage == 0:
        penalty = penalties.get("failing_ci", -4)  # Should be -4
        total_penalty += penalty
    elif frontend_coverage < 20 and backend_coverage < 20:
        penalty = penalties.get("missing_tests", -2)  # Should be -2
        total_penalty += penalty
    
    return total_penalty
```

**Rubric values:**
```yaml
penalties:
  failing_ci: -4
  missing_tests: -2
  regression: -3  # Not implemented
```

### Security Issues

**All 61 PRs have security score of -3:**
- Semgrep is detecting critical security issues (ERROR severity)
- This suggests either:
  1. Security baseline is not properly configured
  2. Security rules are too strict
  3. Actual security issues exist in all PRs
  4. Semgrep results are not being filtered correctly

### Recommendations

1. **Fix Penalty Calculation:**
   - Add debug logging to see actual coverage values
   - Verify coverage parsing returns correct types (int, not string)
   - Add unit tests for edge cases (empty dict, None, etc.)

2. **Investigate Security Scoring:**
   - Review `.security-baseline.json` configuration
   - Check if security results are being filtered correctly
   - Verify Semgrep rule severity classifications

3. **Add Regression Penalty:**
   - Implement `regression: -3` penalty if needed
   - Or remove from rubric if not needed

4. **Improve Coverage Detection:**
   - Ensure empty coverage `{}` is handled correctly
   - Add validation for coverage data structure

5. **Add Debugging:**
   - Log actual coverage percentages when calculating penalties
   - Log which penalty condition is triggered
   - Include penalty breakdown in reward.json metadata

### Next Steps

1. Create test case with empty coverage `{}` to reproduce -6 penalty
2. Check actual coverage values for recent -6 score PRs
3. Review Semgrep output to understand security -3 scores
4. Add logging to penalty calculation function
5. Fix identified bugs and verify with test PRs

---

**Status:** Investigation in progress  
**Priority:** High - affects all PR scores




