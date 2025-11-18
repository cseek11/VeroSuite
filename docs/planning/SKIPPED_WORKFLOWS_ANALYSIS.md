# Skipped Workflows Analysis

**Date:** 2025-11-18  
**Purpose:** Understand why reward score workflows are being skipped

---

## Current Behavior

### Reward Score Workflow Condition
```yaml
if: github.event_name == 'pull_request' || 
    github.event_name == 'workflow_dispatch' || 
    (github.event_name == 'workflow_run' && github.event.workflow_run.event == 'pull_request')
```

### When Workflow Runs ✅
1. **Direct PR events** - `pull_request` (opened, synchronize, reopened)
2. **Manual dispatch** - `workflow_dispatch`
3. **CI workflow_run triggered by PR** - `workflow_run` where `event == 'pull_request'`

### When Workflow is Skipped ❌
1. **CI workflow_run triggered by push** - `workflow_run` where `event == 'push'`
2. **CI workflow_run triggered by schedule** - `workflow_run` where `event == 'schedule'`
3. **CI workflow_run triggered by workflow_dispatch** - `workflow_run` where `event == 'workflow_dispatch'`

---

## Why This Happens

### Scenario: Push to Main Branch
1. Developer pushes to `main` branch
2. CI workflow triggered by `push` event
3. CI workflow completes successfully
4. Reward score workflow triggered by `workflow_run` event
5. **Condition check:** `github.event.workflow_run.event == 'pull_request'`
6. **Result:** `false` (event is `push`, not `pull_request`)
7. **Workflow:** Skipped ❌

### Scenario: Scheduled CI Run
1. Scheduled CI workflow runs (cron job)
2. CI workflow completes
3. Reward score workflow triggered by `workflow_run` event
4. **Condition check:** `github.event.workflow_run.event == 'pull_request'`
5. **Result:** `false` (event is `schedule`, not `pull_request`)
6. **Workflow:** Skipped ❌

---

## Is This Expected Behavior?

### ✅ Yes - This is CORRECT
- Reward scores should only be computed for PRs
- Push to main doesn't need scoring (already merged)
- Scheduled runs don't need scoring (no PR context)

### Current Logic
- **PR events** → Score needed → Run workflow ✅
- **Non-PR events** → No score needed → Skip workflow ✅

---

## Impact on Dashboard

### Before Fix
- Dashboard workflow runs even when reward score workflow skipped
- Attempts to download artifact from skipped workflow
- No reward.json available → Dashboard can't update ❌

### After Fix
- Dashboard workflow only runs when reward score workflow succeeded
- Skips when reward score workflow was skipped/failed
- No unnecessary runs → Better efficiency ✅

---

## Verification

### Test Cases
1. **PR created** → Reward score runs → Dashboard runs ✅
2. **Push to main** → Reward score skipped → Dashboard skipped ✅
3. **Manual dispatch** → Reward score runs → Dashboard runs ✅

---

## Conclusion

**Skipped workflows are EXPECTED and CORRECT behavior:**
- Reward scores should only be computed for PRs
- Non-PR events (push, schedule) correctly skip the workflow
- Dashboard fix ensures it only runs when reward.json is available

**No changes needed to reward score workflow condition** - it's working as designed.

---

**Status:** ✅ **ANALYSIS COMPLETE** - Skipped workflows are expected behavior

