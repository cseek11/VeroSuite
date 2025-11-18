# Workflow Conditions Analysis

**Date:** 2025-11-18  
**Purpose:** Analyze workflow conditions to understand why workflows are being skipped

---

## Reward Score Workflow Conditions

### Current Condition
```yaml
if: github.event_name == 'pull_request' || 
    github.event_name == 'workflow_dispatch' || 
    (github.event_name == 'workflow_run' && github.event.workflow_run.event == 'pull_request')
```

### Triggers
1. **pull_request** events (opened, synchronize, reopened) ✅
2. **workflow_dispatch** (manual trigger) ✅
3. **workflow_run** (when CI workflow completes) ⚠️

### Why Workflows Are Skipped

**Scenario 1: workflow_run triggered by non-PR event**
- **Condition:** `github.event.workflow_run.event == 'pull_request'`
- **Issue:** If CI workflow is triggered by something other than a PR (e.g., push to main), this condition fails
- **Result:** Workflow is skipped
- **Example:** Run 19473115979 - triggered by workflow_run on main branch (not a PR)

**Scenario 2: CI workflow triggered by push to main**
- **Trigger:** Push to main branch
- **Event type:** `push` (not `pull_request`)
- **Result:** Reward score workflow condition fails, workflow skipped

**Scenario 3: CI workflow triggered by schedule**
- **Trigger:** Scheduled cron job
- **Event type:** `schedule` (not `pull_request`)
- **Result:** Reward score workflow condition fails, workflow skipped

---

## Dashboard Update Workflow Conditions

### Current Condition (BEFORE FIX)
```yaml
# No job-level condition - runs for all workflow_run events
```

### Issue
- Dashboard workflow runs even when reward score workflow was skipped
- Attempts to download artifact from skipped workflow
- No reward.json available, dashboard can't update

### Fixed Condition (AFTER FIX)
```yaml
if: github.event_name == 'schedule' || 
    github.event_name == 'workflow_dispatch' || 
    (github.event_name == 'workflow_run' && github.event.workflow_run.conclusion == 'success')
```

### Benefits
- Only runs when reward score workflow completed successfully
- Skips when reward score workflow was skipped/failed/cancelled
- Ensures reward.json artifact is available before attempting download

---

## Workflow Trigger Flow

### Successful Flow (PR Event)
1. PR created → `pull_request` event
2. Reward score workflow triggered → Condition matches ✅
3. Workflow runs → reward.json created
4. Workflow completes → `conclusion: success`
5. Dashboard workflow triggered → Condition matches ✅
6. Dashboard downloads reward.json → Updates metrics ✅

### Skipped Flow (Non-PR Event)
1. Push to main → `push` event
2. CI workflow triggered → Runs successfully
3. Reward score workflow triggered → Condition fails (not PR event) ❌
4. Workflow skipped → No reward.json created
5. Dashboard workflow triggered → **BEFORE FIX:** Runs anyway ❌
6. Dashboard attempts download → No artifact available ❌
7. Dashboard can't update → Metrics stale ❌

### Fixed Flow (Non-PR Event)
1. Push to main → `push` event
2. CI workflow triggered → Runs successfully
3. Reward score workflow triggered → Condition fails (not PR event) ❌
4. Workflow skipped → No reward.json created
5. Dashboard workflow triggered → **AFTER FIX:** Condition fails (conclusion != success) ✅
6. Dashboard skipped → No unnecessary run ✅

---

## Recommendations

### ✅ Implemented
1. **Fix dashboard workflow trigger** - Only download from successful reward score workflows
   - Added condition: `github.event.workflow_run.conclusion == 'success'`
   - Dashboard now skips when reward score workflow was skipped/failed

### ⚠️ Consider
1. **Reward score workflow condition** - May be too restrictive
   - Current: Only runs for PR events via workflow_run
   - Consider: Should it run for all workflow_run events from CI?
   - Trade-off: More runs vs. only PR-related runs

2. **Workflow_run event filtering** - GitHub behavior
   - `types: [completed]` triggers for all conclusions (success, failure, skipped, cancelled)
   - Need job-level condition to filter by conclusion
   - This is the correct approach ✅

---

## Verification

### Test Cases
1. **PR event** → Reward score runs → Dashboard runs ✅
2. **Push to main** → Reward score skipped → Dashboard skipped ✅
3. **Manual dispatch** → Reward score runs → Dashboard runs ✅
4. **Schedule** → Dashboard runs (aggregate-only) ✅

---

**Status:** ✅ **ANALYSIS COMPLETE** - Conditions verified and fixed

