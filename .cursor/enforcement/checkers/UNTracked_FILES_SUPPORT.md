# Untracked Files Support in Modular Enforcer

**Date:** 2025-12-21  
**Status:** ✅ Fixed

---

## Issue

The modular enforcer was not including untracked files when running checkers, which meant new files wouldn't be checked for violations.

---

## Root Cause

In `run_all_checks()`, the code was only passing tracked files to `_run_modular_checkers()`:

```python
all_changed_files = self._cached_changed_files['tracked']  # ❌ Only tracked files
self._run_modular_checkers(all_changed_files, ...)
```

However, the cache stores both tracked and untracked files separately, and untracked files should always be checked (they're new files that need validation).

---

## Fix

Modified `run_all_checks()` to combine both tracked and untracked files:

```python
tracked_files = self._cached_changed_files['tracked']
untracked_files_list = self._cached_changed_files['untracked']

# Combine tracked and untracked files for enforcement checks
# Untracked files should always be checked for violations (they're new files)
all_changed_files = tracked_files + untracked_files_list
```

---

## Behavior

### Before Fix ❌
- Only tracked files were checked
- New untracked files were ignored
- Violations in new files were missed

### After Fix ✅
- Both tracked and untracked files are checked
- New files are validated immediately
- All violations are caught

---

## Example

**Scenario:** User creates a new file `apps/api/src/new-service.ts` with a hardcoded date.

**Before Fix:**
- File is untracked (not in git)
- Modular enforcer only checks tracked files
- Hardcoded date violation is missed ❌

**After Fix:**
- File is untracked (not in git)
- Modular enforcer includes untracked files
- Hardcoded date violation is detected ✅

---

## Implementation Details

1. **Cache Structure:**
   ```python
   self._cached_changed_files = {
       'tracked': [...],      # Git-tracked files with changes
       'untracked': [...]     # New untracked files
   }
   ```

2. **File Combination:**
   ```python
   all_changed_files = tracked_files + untracked_files_list
   ```

3. **Logging:**
   ```python
   if has_untracked:
       logger.info(f"Including {untracked_count} untracked files...")
   ```

---

## Testing

To verify untracked files are caught:

1. Create a new file with a violation:
   ```bash
   echo "Last Updated: 2025-01-01" > test-new-file.md
   ```

2. Run enforcer:
   ```bash
   python .cursor/scripts/auto-enforcer.py
   ```

3. Verify violation is detected:
   - Check `AGENT_STATUS.md` for violations
   - Check `VIOLATIONS.md` for violation details
   - File should be listed with hardcoded date violation

---

## Related Code

- **File:** `.cursor/scripts/auto-enforcer.py`
- **Method:** `run_all_checks()` (line ~3633)
- **Method:** `_run_modular_checkers()` (line ~3729)

---

## Status

✅ **Fixed** - Untracked files are now included in modular checker execution.

---

**Last Updated:** 2025-12-21



