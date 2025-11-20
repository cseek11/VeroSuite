# Reward Score Critical Fixes

**Date:** 2025-11-19  
**Last Updated:** 2025-11-19  
**Status:** Implemented

## Overview

Fixed critical bugs in Reward Score calculation that were causing:
1. Invalid -6 penalty patterns (double-penalty bug)
2. Security scores always -3 (repo-wide issues counted as new findings)
3. Broken feedback loop (all PRs negative, preventing AI learning)

## Fixes Implemented

### 1. Penalty Calculation Bug Fix

**Problem:** Penalties were -6 instead of expected -4, suggesting both `failing_ci` (-4) and `missing_tests` (-2) were being applied.

**Root Cause:** 
- Type coercion issues in coverage percentage extraction
- Missing fallback logic for malformed coverage data
- Potential edge cases where both conditions could evaluate true

**Fix:**
- Added `safe_get_percentage()` helper with proper type coercion
- Made penalty conditions **mutually exclusive** (if/elif ensures only one applies)
- Added fallback: if coverage data is entirely missing, **no penalty** (handles malformed workflows)
- Added debug logging for coverage values
- Improved condition logic: only apply `failing_ci` if coverage exists but is 0%; only apply `missing_tests` if coverage exists but is low

**Code Location:** `.cursor/scripts/compute_reward_score.py` - `calculate_penalties()`

**Impact:**
- Prevents double-penalty bugs
- Handles edge cases gracefully
- Provides better debugging information

### 2. Security Scoring Bug Fix

**Problem:** All PRs scored -3 for security, even when no new security issues were introduced.

**Root Cause:**
- Semgrep scans entire repository, not just changed files
- Security findings from unchanged files were counted as new issues
- No diff-based filtering

**Fix:**
- Added `result_in_changed_files()` function to filter Semgrep results
- Only count security findings in files actually changed by the PR
- Added `skipped_by_diff_filter` counter for transparency
- Normalized file paths for cross-platform compatibility

**Code Location:** `.cursor/scripts/compute_reward_score.py` - `score_security()`

**Impact:**
- Security scores now reflect actual PR changes
- Prevents false negatives from repo-wide issues
- Enables positive security scores when PRs don't introduce new issues

### 3. Stabilized Score (SS) Feature

**Purpose:** Prevent PR spam from skewing metrics in Auto-PR workflows.

**Formula:** `stable_score = score * sqrt(files_changed / 10)`

**Behavior:**
- 1 file: factor = 0.316 (reduced weight for micro-PRs)
- 10 files: factor = 1.0 (no change)
- 25 files: factor = 1.58 (slight boost for substantial PRs)

**Code Location:** `.cursor/scripts/compute_reward_score.py` - `calculate_stabilized_score()`

**Impact:**
- Reduces noise from incremental Auto-PR batches
- Maintains full weight for substantial changes
- Included in breakdown for tracking

### 4. Trend-Based Rewards Feature

**Purpose:** Reward improvement trends instead of just snapshots.

**Logic:**
- Analyzes last 10 PR scores
- Calculates average improvement
- Awards +1 bonus for strong positive trends (7+ improving PRs, avg improvement > 0.5)
- Provides warnings for declining trends (no penalty, just note)

**Code Location:** `.cursor/scripts/compute_reward_score.py` - `calculate_trend_bonus()`

**Impact:**
- Encourages consistent improvement
- Provides early warning for declining quality
- Rewards long-term positive trends

**Note:** Currently implemented but not yet integrated into main scoring flow (requires historical score loading).

## Testing Recommendations

1. **Penalty Fix:**
   - Test with empty coverage `{}`
   - Test with coverage = 0%
   - Test with coverage < 20%
   - Test with coverage >= 20%
   - Verify only one penalty applies

2. **Security Fix:**
   - Test PR that changes files with security issues
   - Test PR that changes files without security issues
   - Test PR that doesn't change files with repo-wide issues
   - Verify security score reflects only PR changes

3. **Stabilized Score:**
   - Test with 1 file changed
   - Test with 10 files changed
   - Test with 25+ files changed
   - Verify factor calculation

## Next Steps

1. **Integrate Trend Bonus:**
   - Load historical scores from `docs/metrics/reward_scores.json`
   - Add trend bonus to total score calculation
   - Update comment template to show trend analysis

2. **Update Comment Template:**
   - Add stabilized score display
   - Add trend analysis section
   - Update breakdown format

3. **Monitor Results:**
   - Track penalty distribution (should see -4, -2, 0, not -6)
   - Track security score distribution (should see positive scores)
   - Verify feedback loop improvement

4. **Documentation:**
   - Update `REWARD_SCORE_GUIDE.md` with new features
   - Document stabilized score formula
   - Document trend bonus logic

## Files Modified

- `.cursor/scripts/compute_reward_score.py`
  - `calculate_penalties()` - Fixed double-penalty bug
  - `score_security()` - Added diff-based filtering
  - `calculate_stabilized_score()` - New function
  - `calculate_trend_bonus()` - New function
  - `compute_score()` - Integrated stabilized score

## Related Documentation

- `docs/metrics/REWARD_SCORE_INVESTIGATION.md` - Original investigation
- `docs/metrics/REWARD_SCORE_GUIDE.md` - User guide (needs update)

---

**Status:** Ready for testing  
**Priority:** Critical - Fixes broken feedback loop


