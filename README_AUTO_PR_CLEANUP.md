# Auto-PR Cleanup Guide

**Issue:** 50+ Auto-PR pull requests were created because the grouping logic was too aggressive.

## What Happened

When the `monitor_changes.py --check` command ran, it:
1. Found many changed files
2. Grouped them by directory (creating one PR per directory)
3. Created many small PRs (1-10 files each)

## Solution Applied

### 1. Updated Configuration

**File:** `.cursor/config/auto_pr_config.yaml`

**Changes:**
- Increased `min_files` from 5 to 10
- Increased `min_lines` from 200 to 500
- Disabled `group_by_file_type` (was creating too many PRs)
- Increased `max_group_size` from 10 to 50
- Added `min_group_size: 5` to combine small groups

### 2. Improved Grouping Logic

**File:** `.cursor/scripts/monitor_changes.py`

**Changes:**
- Now combines small groups (< 5 files) into larger groups
- Only splits groups when they exceed 50 files
- Better batching to reduce PR count

## Cleanup Options

### Option 1: Close All Auto-PRs (Recommended)

Close all the small PRs without merging:

```powershell
cd .cursor\scripts
.\cleanup_auto_prs.ps1 --CloseAll
```

### Option 2: Merge All Auto-PRs

Merge all PRs (use with caution):

```powershell
cd .cursor\scripts
.\cleanup_auto_prs.ps1 --MergeAll
```

**Warning:** This will merge all Auto-PRs. Review them first!

### Option 3: List PRs First

See what will be affected:

```powershell
cd .cursor\scripts
.\cleanup_auto_prs.ps1 --List
```

### Option 4: Preview Close (Dry Run)

See what would be closed without actually closing:

```powershell
cd .cursor\scripts
.\cleanup_auto_prs.ps1 --CloseAll --DryRun
```

## Recommended Action

1. **Review a few PRs** to see if any contain important changes
2. **Close all Auto-PRs** using `--CloseAll`
3. **Manually create a single PR** with all your changes if needed
4. **The daemon will now create fewer, larger PRs** going forward

## Prevention

The configuration has been updated to prevent this in the future:
- Higher thresholds (10 files, 500 lines)
- Better grouping (combines small groups)
- Larger max group size (50 files)

The daemon is still running and will use the new configuration for future PRs.

