# REWARD_SCORE Dashboard Troubleshooting Guide

**Last Updated:** 2025-11-17

---

## Issue: Dashboard Not Updating After 30 Minutes

### Root Cause Analysis

**Problem:** Dashboard shows no scores after PR creation.

**Investigation Results:**
1. ✅ Workflow ran: `swarm_compute_reward_score.yml` executed for PR #1
2. ⚠️ Score computed: -9 (below blocking threshold of -3)
3. ❌ Comment posting failed: "Resource not accessible by integration (addComment)"
4. ❌ Workflow failed: Exited with code 1 due to low score
5. ⚠️ Metrics collection: Ran but had no data (workflow failed before artifact upload)

### Issues Identified

#### 1. Low Score (-9)
**Why:** PR #1 likely has:
- Missing test files
- No coverage data
- Missing documentation
- Other quality issues

**Solution:** This is expected for initial PRs. The score will improve as code quality improves.

#### 2. Permission Error
**Error:** `GraphQL: Resource not accessible by integration (addComment)`

**Cause:** `GITHUB_TOKEN` may not have write permissions for PR comments.

**Solutions:**
- Check repository settings → Actions → General → Workflow permissions
- Ensure "Read and write permissions" is enabled
- Or use a Personal Access Token (PAT) with `repo` scope

#### 3. Workflow Failure
**Why:** Workflow exits with code 1 when score < -3 (blocking threshold).

**Impact:** Metrics collection workflow runs but has no data to collect.

**Solution:** Workflow should still upload artifact even on failure (needs fix).

---

## Fixes Applied

### 1. Added `workflow_dispatch` Trigger
- Allows manual triggering of REWARD_SCORE computation
- Can specify PR number as input
- Useful for re-running failed computations

### 2. Enhanced Error Handling
- Comment posting failures no longer cause workflow failure
- Warning logged instead of error
- Artifact still uploaded even if comment fails

### 3. Improved PR Number Detection
- Handles `workflow_dispatch` events
- Can find PR from branch name
- Better error messages

---

## How to Fix Dashboard Update Issue

### Immediate Actions

1. **Check Workflow Permissions:**
   ```
   Repository Settings → Actions → General → Workflow permissions
   → Enable "Read and write permissions"
   ```

2. **Manually Trigger Workflow:**
   ```bash
   gh workflow run swarm_compute_reward_score.yml \
     --ref auto-pr-1763403431 \
     --field pr_number=1
   ```

3. **Check Workflow Status:**
   ```bash
   gh run list --workflow=swarm_compute_reward_score.yml --limit 5
   ```

4. **View Workflow Logs:**
   ```bash
   gh run view <run-id> --log
   ```

### Long-Term Solutions

1. **Fix Repository Permissions:**
   - Enable write permissions for GITHUB_TOKEN
   - Or configure PAT with proper scopes

2. **Improve Score:**
   - Add test files
   - Add documentation
   - Fix code quality issues
   - Add coverage

3. **Workflow Improvements:**
   - Upload artifact even on failure
   - Better error messages
   - Retry logic for comment posting

---

## Expected Behavior

### Normal Flow
```
PR Created
    ↓
REWARD_SCORE workflow triggers
    ↓
Score computed
    ↓
Artifact uploaded (reward.json)
    ↓
Comment posted to PR
    ↓
Metrics collection workflow triggers
    ↓
Metrics collected and stored
    ↓
Dashboard updates
```

### Current Flow (With Issues)
```
PR Created
    ↓
REWARD_SCORE workflow triggers
    ↓
Score computed (-9)
    ↓
Comment posting fails (permissions)
    ↓
Workflow fails (score < -3)
    ↓
Artifact may not be uploaded
    ↓
Metrics collection has no data
    ↓
Dashboard shows no scores
```

---

## Verification Steps

1. **Check if workflow ran:**
   ```bash
   gh run list --workflow=swarm_compute_reward_score.yml
   ```

2. **Check if artifact exists:**
   - View workflow run → Artifacts
   - Should see "reward" artifact

3. **Check metrics file:**
   ```bash
   cat docs/metrics/reward_scores.json
   ```

4. **Check PR comments:**
   ```bash
   gh pr view 1 --json comments
   ```

---

## Next Steps

1. ✅ Fix repository permissions
2. ✅ Manually trigger workflow
3. ✅ Verify artifact upload
4. ✅ Check metrics collection
5. ✅ Verify dashboard update

---

**Status:** Issues identified, fixes applied, manual trigger available.








