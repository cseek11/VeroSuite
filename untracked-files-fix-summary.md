# Fix: Untracked Files Causing Excessive Context Loading

**Date:** 2025-12-01  
**Issue:** 979 files triggering context loading (should be ~454)

---

## Problem

The `get_changed_files()` method was including **untracked files** (544 files) along with modified files (454 files), causing:
- 979 total files instead of 454
- Excessive context loading (8 files instead of 2)
- Timeouts on large changes
- File-specific context being loaded unnecessarily

**Root Cause:**
- `get_changed_files()` included untracked files by default
- Context loading used all files (including untracked)
- With 979 files, many matched file-specific patterns (database, api, auth)
- System loaded context for all patterns, not just actual edits

---

## Fix Applied

### 1. ✅ Made `get_changed_files()` Selective

**Change:** Added `include_untracked` parameter (default: `False`)

```python
def get_changed_files(self, include_untracked: bool = False) -> List[str]:
    """
    Get list of changed files from git.
    
    Args:
        include_untracked: If True, include untracked files (default: False)
                          Only include untracked for enforcement checks, not context loading
    """
```

**Behavior:**
- **Context Loading:** `include_untracked=False` (only actual edits)
- **Enforcement Checks:** `include_untracked=True` (catch violations in new files)

### 2. ✅ Updated Context Loading Call

**File:** `.cursor/scripts/auto-enforcer.py` (line ~2284)

**Change:**
```python
# CRITICAL: Don't include untracked files for context loading
# Only use actual edits (staged/unstaged) - untracked files shouldn't trigger context loading
changed_files = self.get_changed_files(include_untracked=False)
```

### 3. ✅ Updated Enforcement Checks

**All enforcement checks now explicitly include untracked files:**
- Date check: `get_changed_files(include_untracked=True)` - to catch dates in new files
- Security check: `get_changed_files(include_untracked=True)` - to catch violations in new files
- Error handling: `get_changed_files(include_untracked=True)` - to catch issues in new files
- All other checks: `get_changed_files(include_untracked=True)` - comprehensive enforcement

---

## Expected Results

### Before Fix:
- **Files for context:** 979 (454 modified + 544 untracked)
- **Active context:** 8 files (too many)
- **Reason:** Many untracked files matched file-specific patterns

### After Fix:
- **Files for context:** ~454 (only modified files)
- **Active context:** 2 files (minimal - python_bible.mdc, 02-core.mdc)
- **Reason:** Only actual edits trigger context loading

---

## Impact

### Context Loading:
- ✅ **Reduced file count:** 979 → ~454 (54% reduction)
- ✅ **Minimal context:** Only loads 2 required files
- ✅ **No untracked file noise:** Untracked files don't trigger context loading

### Enforcement Checks:
- ✅ **Still comprehensive:** Untracked files still checked for violations
- ✅ **Catches new file issues:** Dates, security, errors in new files still detected

---

## Answer to User's Question

**Q: Are the 979 from warnings? Is it auto loading those expecting us to resolve the warnings?**

**A:** No, the 979 files are NOT from warnings. They're from:
1. **454 modified files** (actual edits)
2. **544 untracked files** (new files not yet committed)

The git warnings (LF/CRLF) are just informational - Git telling you it will normalize line endings. They don't affect the file count.

**The system was auto-loading context for ALL 979 files** (including untracked), which caused:
- Excessive context loading (8 files instead of 2)
- File-specific context being loaded unnecessarily
- Timeouts on large changes

**After the fix:**
- Context loading only uses **454 modified files** (actual edits)
- Untracked files are **excluded from context loading**
- But untracked files are **still checked for violations** (enforcement checks)

---

**Status:** ✅ **FIXED** - Context loading now only uses actual edits, not untracked files







