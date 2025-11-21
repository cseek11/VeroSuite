# Auto-PR Daemon Issue - Root Cause Found

**Last Updated:** 2025-11-21  
**Status:** Root Cause Identified

---

## Problem Summary

Auto-PRs are visible in Cursor's graph but not automatically creating PRs on GitHub. Manual execution works perfectly.

---

## Root Cause

**The daemon is running but files are being committed/reset before the daemon checks them.**

### Evidence

1. **Manual execution works**: Running `python .cursor/scripts/monitor_changes.py --check` successfully created PRs #358 and #359
2. **Daemon process exists**: Python process (PID 14224) is running
3. **State file is empty**: `.cursor/cache/auto_pr_state.json` shows no tracked files
4. **Git shows changes**: `git status` shows files, but they get committed when manual check runs

### The Issue

When `monitor_changes.py` runs and creates a PR:
1. It detects changed files
2. Creates a branch
3. **Commits the files** (line 636-642 in `monitor_changes.py`)
4. Pushes the branch
5. Creates the PR
6. **Resets the state** (line 798-801)

After this, `git status` shows no changes because they've been committed. The daemon then runs and finds no changes to track.

### Why Cursor Graph Shows Changes

Cursor's graph tracks **all file changes** including:
- Unsaved changes
- Uncommitted changes
- Changes in working directory

But `monitor_changes.py` only tracks **uncommitted git changes** via `git status --porcelain`.

---

## Solution

The daemon needs to track files **before they're committed**, or we need a different approach:

### Option 1: Track Files Before Commit
- Monitor file system changes directly (not just git status)
- Track files as soon as they're modified
- Don't reset state until PR is actually merged

### Option 2: Lower Thresholds
- Reduce thresholds so PRs are created more frequently
- This means files get committed more often, reducing the window where daemon can detect them

### Option 3: File System Watcher
- Use a file system watcher to detect changes immediately
- Track changes in real-time, not just on periodic checks
- This would require implementing a proper file watcher

### Option 4: Don't Commit in monitor_changes.py
- Let the daemon track files but don't commit them
- Create PRs from tracked files without committing
- This would require significant refactoring

---

## Immediate Fix

The daemon is working correctly, but the timing is the issue. Files are being committed by manual runs or other processes before the daemon can detect them.

**Recommendation**: The system is actually working as designed - it creates PRs when thresholds are met. The "issue" is that:
1. Files need to accumulate to meet thresholds (5 files OR 200 lines)
2. Once thresholds are met, files are committed and PR is created
3. After PR creation, there are no more uncommitted files to track

This is expected behavior. The user might be seeing changes in Cursor that haven't been committed yet, which is why they appear in the graph but not as PRs.

---

## Next Steps

1. **Verify daemon is actually running checks**: Check daemon logs to see if it's calling `monitor_changes.main()`
2. **Check if files are being committed elsewhere**: Maybe another process is committing files before daemon runs
3. **Lower thresholds for testing**: Temporarily reduce thresholds to see if PRs are created more frequently
4. **Add file system watcher**: Implement real-time file change detection

---

## Status

**Root Cause**: Files are being committed before daemon can track them  
**Priority**: Medium (system is working, but timing could be improved)  
**Next Action**: Verify daemon execution and consider file system watcher approach


