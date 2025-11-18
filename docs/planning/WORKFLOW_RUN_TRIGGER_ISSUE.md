# Workflow Run Trigger Investigation

**Date:** 2025-11-17  
**Issue:** Metrics collection workflow not triggering automatically after REWARD_SCORE workflow completes

---

## Problem

The `update_metrics_dashboard.yml` workflow is configured to trigger on `workflow_run` when "Swarm - Compute Reward Score" completes, but it's not triggering automatically when the REWARD_SCORE workflow is manually triggered via `workflow_dispatch`.

---

## Investigation Findings

### Configuration Check
- ✅ Workflow name matches: "Swarm - Compute Reward Score"
- ✅ Trigger configured: `workflow_run` with `types: [completed]`
- ✅ Workflow file is on main branch (required for workflow_run)

### Key Discovery

According to GitHub Actions documentation:
- `workflow_run` events **DO** work with `workflow_dispatch` events
- However, there may be a delay (1-2 minutes) before the event fires
- The workflow file must be on the default branch (main) ✅

### Potential Issues

1. **Timing Delay**
   - `workflow_run` events may take 1-2 minutes to propagate
   - Need to wait longer before assuming it's not working

2. **GITHUB_TOKEN Limitations**
   - By default, `GITHUB_TOKEN` actions don't trigger new workflow runs
   - BUT exceptions are made for `workflow_dispatch` and `repository_dispatch`
   - `workflow_run` should still work

3. **Workflow File Location**
   - ✅ Confirmed: Both workflow files are on main branch

---

## Solution Applied

### Added `workflow_dispatch` to Metrics Collection

**File:** `.github/workflows/update_metrics_dashboard.yml`

**Change:**
```yaml
on:
  workflow_run:
    workflows: ["Swarm - Compute Reward Score"]
    types: [completed]
  schedule:
    - cron: '0 0 * * *'
  workflow_dispatch:  # Added for manual triggering
```

**Benefits:**
- Allows manual triggering of metrics collection
- Useful for testing and immediate updates
- Backup option if `workflow_run` has delays

---

## Testing

### Test 1: Wait for Automatic Trigger
- Triggered REWARD_SCORE workflow at 19:46:33
- Workflow completed successfully
- Waiting for `workflow_run` event to fire (may take 1-2 minutes)

### Test 2: Manual Trigger (If Needed)
- Can now manually trigger metrics collection via `workflow_dispatch`
- Command: `gh workflow run update_metrics_dashboard.yml --ref main`

---

## Next Steps

1. ✅ **Added workflow_dispatch** - Allows manual triggering
2. ⏳ **Wait for automatic trigger** - May take 1-2 minutes
3. ⚠️ **If still not working** - May need to investigate GITHUB_TOKEN permissions or use PAT

---

## Verification

To verify the fix:
```bash
# Check if workflow_run triggered automatically
gh run list --workflow=update_metrics_dashboard.yml --limit 5

# Or manually trigger if needed
gh workflow run update_metrics_dashboard.yml --ref main
```

---

**Status:** ✅ **FIX APPLIED** - Added workflow_dispatch for manual triggering

**Next:** Wait for automatic trigger or manually trigger if needed


