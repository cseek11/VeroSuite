# Date Violation Detection Fix Plan

**Created:** 2025-12-01  
**Status:** In Progress  
**Priority:** CRITICAL

## Problem Statement

The current date violation detection system incorrectly flags historical dates as violations. The system is checking ALL files with git changes, regardless of when those changes occurred. This means:

- Files modified yesterday (but not committed) are being checked
- Historical dates in unmodified files are being flagged as violations
- The logic assumes: "Not today's date = violation" (WRONG)
- The correct logic should be: "File modified today AND date not updated = violation" (CORRECT)

## Root Cause Analysis

### Current Flow (INCORRECT):
1. `get_changed_files()` → Returns ALL files with git changes (staged, unstaged, untracked)
2. `is_file_modified_in_session()` → Checks if file has content changes (using `git diff`)
3. `check_hardcoded_dates()` → Checks dates in all "modified" files
4. **Problem:** Files modified in previous sessions (but not committed) still show up as "modified"

### Issue in `is_file_modified_in_session()`:
```python
# Current logic (WRONG):
def is_file_modified_in_session(self, file_path: str) -> bool:
    # For tracked files, checks if there's a diff
    # BUT doesn't check WHEN the diff was created!
    if tracked:
        return self._has_actual_content_changes(file_path)  # ❌ No timestamp check
```

### Issue in `_has_actual_content_changes()`:
```python
# Current logic (WRONG):
def _has_actual_content_changes(self, file_path: str) -> bool:
    # Just checks if diff exists, not when it was created
    staged_content = self.run_git_command(['diff', '--cached', ...])
    unstaged_content = self.run_git_command(['diff', ...])
    # ❌ No check for when these changes were made
```

## Solution Design

### Correct Logic Flow:
1. **Only check files modified AFTER session start time**
2. **For tracked files:** Use `git log` to check when file was last modified
3. **For untracked files:** Already correct (uses file modification time)
4. **For date checks:** Only flag violations if:
   - File was modified AFTER session start
   - AND date in modified line is not current date

### Implementation Plan

#### Step 1: Add Git Timestamp Checking
Create new method to check when a tracked file was last modified:

```python
def get_file_last_modified_time(self, file_path: str) -> Optional[datetime]:
    """
    Get the timestamp when a tracked file was last modified (from git log).
    
    For tracked files: Uses git log to get last commit time
    For untracked files: Uses file system modification time
    
    Returns:
        datetime if file exists and is trackable, None otherwise
    """
    # Check if file is tracked
    tracked = self.run_git_command(['ls-files', '--error-unmatch', file_path])
    
    if tracked:
        # Get last commit time for this file
        # Format: %ct = commit time (Unix timestamp)
        last_commit_time = self.run_git_command([
            'log', '-1', '--format=%ct', '--', file_path
        ])
        
        if last_commit_time:
            try:
                timestamp = int(last_commit_time.strip())
                return datetime.fromtimestamp(timestamp, tz=timezone.utc)
            except (ValueError, OSError):
                return None
        
        # If no commit history, check if file has unstaged changes
        # Use file modification time as fallback
        full_path = self.project_root / file_path
        if full_path.exists():
            try:
                file_mtime = datetime.fromtimestamp(
                    full_path.stat().st_mtime, 
                    tz=timezone.utc
                )
                return file_mtime
            except (OSError, FileNotFoundError):
                return None
    
    # For untracked files, use file system modification time
    full_path = self.project_root / file_path
    if full_path.exists():
        try:
            file_mtime = datetime.fromtimestamp(
                full_path.stat().st_mtime, 
                tz=timezone.utc
            )
            return file_mtime
        except (OSError, FileNotFoundError):
            return None
    
    return None
```

#### Step 2: Update `is_file_modified_in_session()`
Fix the method to check timestamps:

```python
def is_file_modified_in_session(self, file_path: str) -> bool:
    """
    Check if a file was modified in the current session.
    
    Returns True ONLY if:
    - File has changes (staged or unstaged)
    - AND file was last modified AFTER session start time
    
    This ensures we only check files actually modified in current session,
    not files modified in previous sessions but not committed.
    """
    changed_files = self.get_changed_files()
    if file_path not in changed_files:
        return False
    
    # Get when file was last modified
    last_modified = self.get_file_last_modified_time(file_path)
    if not last_modified:
        # Can't determine modification time - skip (conservative)
        logger.debug(
            f"Could not determine modification time for {file_path}, skipping",
            operation="is_file_modified_in_session",
            file_path=file_path
        )
        return False
    
    # Get session start time
    try:
        session_start = datetime.fromisoformat(
            self.session.start_time.replace('Z', '+00:00')
        )
    except (ValueError, AttributeError) as e:
        logger.warn(
            f"Could not parse session start time, assuming file is new",
            operation="is_file_modified_in_session",
            error_code="SESSION_TIME_PARSE_FAILED",
            root_cause=str(e)
        )
        # If we can't parse session time, assume file is new (conservative)
        return True
    
    # File is modified in session if last modified AFTER session start
    is_modified_in_session = last_modified >= session_start
    
    logger.debug(
        f"File modification check: {file_path}",
        operation="is_file_modified_in_session",
        last_modified=last_modified.isoformat(),
        session_start=session_start.isoformat(),
        is_modified_in_session=is_modified_in_session
    )
    
    return is_modified_in_session
```

#### Step 3: Update `check_hardcoded_dates()` Logic
The current logic already has early exits, but we need to ensure they work correctly:

```python
# Current logic (lines 822-832) is CORRECT:
file_modified = self.is_file_modified_in_session(file_path_str)

# Early exit: if file wasn't modified, skip entirely (all dates are historical)
if not file_modified:
    logger.debug(f"Skipping file (not modified in session): {file_path_str}")
    continue  # ✅ This is correct - just need to fix is_file_modified_in_session()
```

#### Step 4: Handle Edge Cases

**Edge Case 1: Files with staged changes from previous session**
- Solution: Check both staged and unstaged changes separately
- If only staged changes exist and they're old, don't flag

**Edge Case 2: Files modified exactly at session start time**
- Solution: Use `>=` comparison (file modified at or after session start)
- This is correct behavior (if modified at session start, it's in session)

**Edge Case 3: Files with no git history (new files)**
- Solution: Already handled - uses file system modification time
- This is correct behavior

## Testing Plan

### Test Case 1: Historical File (Should NOT Flag)
1. Create file with date `2025-11-30` yesterday
2. Don't modify file today
3. Run enforcement
4. **Expected:** No violations (file not modified in session)

### Test Case 2: Modified File with Old Date (Should Flag)
1. Modify file today (add new line)
2. File has date `2025-11-30` in "Last Updated" field
3. Don't update date to today
4. Run enforcement
5. **Expected:** Violation flagged (file modified but date not updated)

### Test Case 3: Modified File with Current Date (Should NOT Flag)
1. Modify file today
2. Update "Last Updated" to today's date
3. Run enforcement
4. **Expected:** No violations (date correctly updated)

### Test Case 4: Historical Date in Unmodified File (Should NOT Flag)
1. File has historical date `2025-11-30` in changelog entry
2. Don't modify file today
3. Run enforcement
4. **Expected:** No violations (file not modified, date is historical)

### Test Case 5: New File with Current Date (Should NOT Flag)
1. Create new file today
2. Add "Last Updated: 2025-12-01" (today's date)
3. Run enforcement
4. **Expected:** No violations (new file, date is current)

## Implementation Steps

1. ✅ **Analyze current logic** (COMPLETE)
2. ✅ **Add `get_file_last_modified_time()` method** (COMPLETE)
3. ✅ **Update `is_file_modified_in_session()` to use timestamps** (COMPLETE)
4. ⏳ **Test with historical files** (PENDING - requires running enforcement)
5. ⏳ **Test with modified files** (PENDING - requires running enforcement)
6. ✅ **Update violation re-evaluation logic** (COMPLETE - uses updated method automatically)
7. ⏳ **Clear existing historical violations from status** (PENDING - will happen on next enforcement run)

## Files to Modify

1. `.cursor/scripts/auto-enforcer.py`
   - Add `get_file_last_modified_time()` method
   - Update `is_file_modified_in_session()` method
   - Verify `check_hardcoded_dates()` early exits work correctly

## Expected Outcome

After fix:
- ✅ Historical dates in unmodified files: **NO violations**
- ✅ Old dates in files modified today: **Violations flagged**
- ✅ Current dates in files modified today: **NO violations**
- ✅ Historical violations correctly marked as "historical" (not blocking)

## Rollback Plan

If fix causes issues:
1. Revert changes to `auto-enforcer.py`
2. Historical violations will return (but won't block)
3. Can manually clear violations from `VIOLATIONS.md`

## Notes

- This fix only affects date violation detection
- Other violation types (security, error handling, etc.) are unaffected
- The fix is backward compatible (doesn't break existing functionality)
- Performance impact: Minimal (adds one git log call per file)

