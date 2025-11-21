# Auto-PR Creation Diagnosis

**Last Updated:** 2025-11-21  
**Status:** Investigating

---

## Problem

Auto-PRs are being created in Cursor's graph but not making it to GitHub and the dashboard. Only manually pushed PRs work.

---

## Investigation Findings

### 1. PR Creation Process Works
- Logs show PRs #355, #356, #357 were successfully created when `--force` flag was used
- GitHub CLI commands execute successfully
- Branches are pushed correctly
- PRs are created on GitHub

### 2. Automatic Detection Issue
- **State file is empty**: `.cursor/cache/auto_pr_state.json` shows `tracked_files: {}`
- **Git shows changes**: `git status --porcelain` shows 5 changed files
- **Daemon is running**: Python process (PID 14224) started at 1:25 PM
- **Root cause**: Files are not being detected/tracked by the daemon

### 3. Threshold Requirements
The system requires one of these triggers to create a PR:
- **Time-based**: 4 hours of inactivity OR 8 hours max work time
- **Change threshold**: 5+ files OR 200+ lines changed
- **Manual force**: `--force` flag

### 4. Daemon Behavior
- `auto_pr_daemon.py` runs `monitor_changes.main()` every 5 minutes (default interval)
- `monitor_changes.main()` calls `get_changed_files()` which uses `git status --porcelain`
- Files should be added to `state["tracked_files"]` and saved
- PRs are only created when thresholds are met

---

## Root Cause Analysis

### Hypothesis 1: Files Not Being Detected
- `get_changed_files()` might not be finding files correctly
- Git status might show files but they're not being parsed correctly
- Files might be excluded by path filters

### Hypothesis 2: State Not Being Saved
- Files are detected but not saved to state file
- State file might be getting reset
- File permissions issue preventing writes

### Hypothesis 3: Daemon Not Running Checks
- Daemon process exists but might be stuck
- Daemon might be erroring silently
- Daemon might not be calling `monitor_changes.main()` correctly

### Hypothesis 4: Thresholds Not Met
- Files are tracked but thresholds aren't being met
- Time-based triggers require 4 hours of inactivity
- Change thresholds require 5 files or 200 lines

---

## Next Steps

1. **Check daemon logs**: Look for errors in daemon execution
2. **Test file detection**: Run `monitor_changes.py --check` manually to see if files are detected
3. **Verify state persistence**: Check if state file is being written
4. **Check daemon process**: Verify daemon is actually running checks
5. **Review thresholds**: Consider lowering thresholds for testing

---

## Recommended Fixes

### Fix 1: Add Debug Logging
Add more detailed logging to `monitor_changes.py` to track:
- When files are detected
- When files are added to state
- When state is saved
- When thresholds are checked
- When PR creation is triggered

### Fix 2: Verify Daemon Execution
Check if daemon is actually calling `monitor_changes.main()`:
- Add logging to daemon loop
- Check daemon stdout/stderr
- Verify daemon process is active

### Fix 3: Lower Thresholds for Testing
Temporarily lower thresholds to test:
- Change `min_files` from 5 to 2
- Change `min_lines` from 200 to 50
- Change `inactivity_hours` from 4 to 1

### Fix 4: Add Manual Trigger Option
Add a way to manually trigger PR creation without `--force`:
- Add `--threshold-bypass` flag
- Create a separate script for manual PR creation
- Add a Cursor command to trigger PR creation

---

## Files to Check

1. `.cursor/cache/auto_pr_state.json` - State file (currently empty)
2. `.cursor/scripts/auto_pr_creation.log` - PR creation logs
3. `.cursor/scripts/auto_pr_process.log` - Process monitoring logs
4. Daemon process stdout/stderr - Check for errors

---

## Status

**Current Status**: Investigating why files aren't being tracked  
**Priority**: High  
**Next Action**: Run diagnostic check and review daemon logs


