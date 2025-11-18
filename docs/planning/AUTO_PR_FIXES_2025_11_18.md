# Auto-PR System Fixes - 2025-11-18

**Date:** 2025-11-18  
**Issues:** PRs not being cleaned up, dashboard not updating

---

## Issues Identified

1. **Consolidation not running automatically** - PRs were accumulating (31 open) because consolidation only ran when creating NEW PRs
2. **Dashboard not updating** - Metrics file path mismatch or workflow issues
3. **Daemon not running consolidation** - Daemon only checked for file changes, not for PR cleanup

---

## Fixes Applied

### 1. Consolidation Runs Independently

**Problem:** Consolidation only ran inside `create_auto_pr()`, so if no new PRs were being created, cleanup never happened.

**Fix:** 
- Updated `monitor_changes.py` to run consolidation check FIRST, even if no new changes
- Updated `auto_pr_daemon.py` to call `auto_consolidate_prs.py` on every check cycle
- Consolidation now runs every 5 minutes (daemon interval) if > max_open_prs exist

**Code Changes:**
```python
# In monitor_changes.py main():
# Always run consolidation check first (even if no new changes)
if config.get("pr_settings", {}).get("consolidate_small_prs", True):
    open_prs = get_open_auto_prs(repo_path)
    if open_prs and len(open_prs) > max_open_prs:
        consolidate_small_prs(open_prs, config, repo_path)
```

```python
# In auto_pr_daemon.py:
# Run consolidation check (even if no new PRs to create)
from auto_consolidate_prs import main as consolidate_prs
consolidate_prs()
```

### 2. Dashboard Update Fix

**Problem:** Dashboard workflow may not be finding metrics file or file path mismatch.

**Fix:**
- Updated workflow to check if file exists and has content before committing
- Added better error messages and file location debugging
- Ensured `collect_metrics.py` writes to correct path: `docs/metrics/reward_scores.json`

**Code Changes:**
```yaml
# In update_metrics_dashboard.yml:
# Check if file exists and has content (not empty)
if [ -s "$METRICS_FILE" ]; then
  git add "$METRICS_FILE"
  # ... commit and push
else
  echo "Metrics file is empty, skipping commit"
fi
```

### 3. Daemon Consolidation Integration

**Problem:** Daemon wasn't calling consolidation script.

**Fix:**
- Daemon now calls `auto_consolidate_prs.py` on every check cycle
- Consolidation runs before file change checks
- Errors in consolidation don't stop daemon from running

---

## Testing

**Consolidation Test:**
```bash
python .cursor/scripts/auto_consolidate_prs.py
# Result: Closed 3 PRs (from 29 to 26)
```

**Daemon Status:**
- PID file exists: `.cursor/cache/auto_pr_daemon.pid`
- Process ID: 16512
- Should now run consolidation every 5 minutes

**Dashboard Status:**
- Workflow runs successfully
- Need to verify metrics file is being created and committed

---

## Next Steps

1. **Monitor consolidation** - Check if PR count decreases over next hour
2. **Verify dashboard** - Check if metrics file updates appear in git history
3. **Check daemon logs** - Verify consolidation is running in daemon logs

---

**Status:** ✅ **FIXES APPLIED** - Consolidation now runs independently, daemon calls consolidation, dashboard workflow improved.

