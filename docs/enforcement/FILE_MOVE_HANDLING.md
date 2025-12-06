# File Move/Rename Handling in Date Violation Detection

**Date:** 2025-12-05  
**Issue:** Moving/renaming files on Windows updates modification timestamp even if content didn't change

---

## Problem

When files are moved or renamed on Windows:
1. The file modification timestamp (mtime) is updated to the current time
2. Git may show the file as untracked (if moved to a new location)
3. Our date violation checker flags these files as "modified" even though content didn't change
4. Files get flagged for date violations when they shouldn't be

---

## Current Behavior

### For Untracked Files:
- `is_file_modified_in_session()` checks mtime >= session_start
- If mtime is after session start, file is considered "modified"
- But moving files updates mtime, so moved files are incorrectly flagged

### Example:
- Session starts: `2025-12-05 17:38:10`
- User moves files at: `2025-12-05 18:53:36`
- Files have mtime: `2025-12-05 18:53:36` (updated by move operation)
- Files are untracked (new location)
- Result: Files flagged as "modified in current session" even though content didn't change

---

## Solution Options

### Option 1: Check Git Rename Detection (Complex)
- Use `git log --follow --find-renames` to detect if file was moved
- Compare content hash of moved file to original location
- Only flag as modified if content actually changed

**Pros:**
- Most accurate
- Can distinguish between move and actual modification

**Cons:**
- Complex to implement
- Requires git history analysis
- Slower performance

### Option 2: Content Hash Comparison (Current Approach)
- For untracked files, check if content hash matches any file in git history
- If hash matches, file was likely moved (not modified)
- Only flag as modified if content hash is new

**Pros:**
- Relatively simple
- Fast (hash comparison)
- Works for most cases

**Cons:**
- Can't detect if file was moved and then modified
- Requires scanning git history for hash matches

### Option 3: Time-Based Heuristic (Current Implementation)
- For untracked files with mtime very close to session start (< 1 minute), log warning
- Still consider file as modified (conservative approach)
- User can manually verify if it was just a move

**Pros:**
- Simple
- No performance impact
- Logs helpful debugging info

**Cons:**
- Doesn't actually prevent false positives
- Still flags moved files as modified

---

## Recommended Approach

**Hybrid Solution:**
1. For untracked files, check mtime >= session_start (current)
2. If mtime is very close to session start (< 1 minute), log warning (current)
3. **NEW:** Check if file content hash matches any tracked file in git history
4. If hash matches, file was likely moved - don't flag as modified
5. If hash is new, file is truly new/modified - flag as modified

**Implementation:**
```python
if is_untracked:
    # Check if file was moved by comparing content hash to git history
    matching_files = git_utils.find_files_with_hash(current_hash)
    if matching_files:
        # File content matches existing file - likely moved, not modified
        logger.debug(
            f"Untracked file matches existing file hash (likely moved): {file_path}",
            operation="is_file_modified_in_session",
            matching_files=matching_files
        )
        return False  # Don't flag as modified
    
    # File is truly new/modified
    return True
```

---

## Current Status

**Implemented:** Option 3 (Time-based heuristic with logging)
- Logs warning when untracked file mtime is very close to session start
- Still flags as modified (conservative)

**Future Enhancement:** Option 2 (Content hash comparison)
- Check if untracked file hash matches any tracked file
- If match found, file was moved - don't flag as modified

---

## Testing

To test file move handling:

1. **Create a test file:**
   ```bash
   echo "Test content" > test_file.md
   git add test_file.md
   git commit -m "Add test file"
   ```

2. **Move the file:**
   ```bash
   mv test_file.md moved_test_file.md
   ```

3. **Run enforcer:**
   ```bash
   python .cursor/scripts/auto-enforcer.py --scope current_session
   ```

4. **Check logs:**
   - Look for "might be moved" warning in logs
   - Verify if file is flagged as modified

---

## Related Files

- `enforcement/core/file_scanner.py` - `is_file_modified_in_session()` function
- `enforcement/core/git_utils.py` - Git operations
- `enforcement/checks/date_checker.py` - Date violation detection

---

**Status:** Partial implementation (logging only, still flags moved files)










