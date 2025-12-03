# VeroField Auto-Enforcer — Historical Auto-PR Date Violations (Second-Pass Analysis)

**Analysis Brain Report**  
**Generated:** 2025-12-03  
**Session ID:** 9bf7d95d-f96c-4d31-95f9-c0ad4d6c1b15

---

## Section 1 — Trace of Current Behavior

### End-to-End Path for `docs/Auto-PR/PHASE2_FINAL_STATUS.md` Violation

**Step 1: File Discovery**
- `check_hardcoded_dates()` calls `get_changed_files(include_untracked=True)` (line 2223)
- File `docs/Auto-PR/PHASE2_FINAL_STATUS.md` appears in `changed_files` list
- This happens regardless of whether the file was actually modified in the current session

**Step 2: Historical Document Detection (FAILS)**
- At line 2309, `DocumentContext(file_path)` is called with `file_path = self.project_root / file_path_str`
- This passes the **full absolute path** (e.g., `C:\Users\ashse\Documents\VeroField\Training\VeroField\docs\Auto-PR\PHASE2_FINAL_STATUS.md`)
- In `DocumentContext._detect_historical_doc()` (date_detector.py:79-87):
  ```python
  file_path_str = str(self.file_path).replace("\\", "/").lower()
  # Results in: "c:/users/ashse/documents/verofield/training/verofield/docs/auto-pr/phase2_final_status.md"
  historical_dirs = ["docs/auto-pr/", ...]
  if any(file_path_str.startswith(dir_path) for dir_path in historical_dirs):
      return True
  ```
- **BUG:** The check uses `startswith()`, but the full path starts with `c:/users/...`, not `docs/auto-pr/`
- **Result:** `is_historical_doc` returns `False` even though the file is in `docs/Auto-PR/`

**Step 3: File Modification Check**
- At line 2340, checks `file_modification_cache.get(file_path_str, False)`
- If file appears in git as "changed" (even if just touched), `file_modified = True`
- **Result:** File proceeds to date checking

**Step 4: Date Detection & Violation Creation**
- Date detector finds hardcoded date `2025-11-30` in the file
- At line 2430, creates violation with `session_scope=session_scope` (which is `violation_scope` parameter)
- **When `--scope current_session`:** `violation_scope="current_session"` → violation marked as `current_session`
- **When `--scope full`:** `violation_scope="historical"` → violation marked as `historical`

**Step 5: Report Generation**
- `ENFORCER_REPORT.json` contains **TWO violations** for the same file:
  - One with `"session_scope": "current_session"` (from current_session scan)
  - One with `"session_scope": "historical"` (from full scan)

**Step 6: Handshake Generation**
- `handshake_generator.py` line 118-119 filters violations:
  ```python
  blocking_current = [v for v in report.violations 
                     if v.severity == "BLOCKING" and v.session_scope == "current_session"]
  ```
- **Result:** Auto-PR violations with `session_scope="current_session"` appear in "Current Session Violations" section

### Where Historical Detection Is Applied (or Not)

1. **In `check_hardcoded_dates()`:**
   - ✅ Line 2316: Checks `doc_context.is_historical_doc` and should skip if `True`
   - ❌ **BUG:** The check fails because `DocumentContext._detect_historical_doc()` uses `startswith()` on full path
   - ❌ File is NOT skipped, proceeds to date checking

2. **In `date_detector.DocumentContext`:**
   - ❌ `_detect_historical_doc()` method (line 79-87) has path matching bug
   - Uses `file_path_str.startswith("docs/auto-pr/")` but `file_path_str` is full absolute path
   - Should check if `"docs/auto-pr/"` is **contained in** the path, not if path starts with it

3. **Session Scope Assignment:**
   - ✅ Line 2220: `session_scope = violation_scope if violation_scope else "current_session"`
   - ✅ Line 2430: Uses `session_scope` when creating violations
   - ✅ This part is working correctly - violations are marked with the correct scope

### What `session_scope` Ultimately Ends Up in `ENFORCER_REPORT.json`

**For `docs/Auto-PR/PHASE2_FINAL_STATUS.md`:**
- **When scanned with `--scope current_session`:**
  - `violation_scope = "current_session"` (from `_run_legacy_checks()` line 3925)
  - Violation created with `session_scope="current_session"` (line 2430)
  - **Result:** `"session_scope": "current_session"` in report

- **When scanned with `--scope full`:**
  - `violation_scope = "historical"` (from `run_all_checks()` line ~3616)
  - Violation created with `session_scope="historical"` (line 2430)
  - **Result:** `"session_scope": "historical"` in report

**Both violations exist in the report because the enforcer may run both scans, or the file appears in both scopes.**

---

## Section 2 — Root Cause of Remaining Misclassification

### Primary Root Cause: Path Matching Bug in `DocumentContext._detect_historical_doc()`

**Location:** `.cursor/enforcement/date_detector.py` lines 79-87

**Problem:**
```python
file_path_str = str(self.file_path).replace("\\", "/").lower()
# On Windows: "c:/users/ashse/documents/verofield/training/verofield/docs/auto-pr/phase2_final_status.md"
historical_dirs = ["docs/auto-pr/", ...]
if any(file_path_str.startswith(dir_path) for dir_path in historical_dirs):
    return True  # This NEVER executes because path doesn't start with "docs/auto-pr/"
```

**Why It Fails:**
- `DocumentContext` receives full absolute path (line 2309 in auto-enforcer.py)
- `startswith("docs/auto-pr/")` checks if path **starts with** that string
- Full Windows path starts with `c:/users/...`, not `docs/auto-pr/`
- **Result:** Historical detection always returns `False` for Auto-PR files

### Secondary Issue: Files May Be Detected as "Modified" Even When Not Actually Changed

**Location:** `is_file_modified_in_session()` (line 1458-1573)

**Potential Problem:**
- If Auto-PR files appear in `get_changed_files()` (e.g., from git status showing them as "modified" due to line ending changes, whitespace, or file system metadata), they will be processed
- Even though the historical check should skip them, the bug above means they're not skipped

### Tertiary Issue: Dual Processing in Different Scopes

**Location:** `run_all_checks()` and `_run_legacy_checks()`

**Observation:**
- The same file may be processed in both `--scope current_session` and `--scope full` modes
- This creates duplicate violations with different `session_scope` values
- The handshake generator correctly filters by `session_scope`, but the presence of `current_session` violations causes blocking

### Summary: Combination of Issues

1. **Path matching bug** prevents historical detection from working
2. **Files not skipped** even though they should be
3. **Violations created** with `session_scope="current_session"` when they should be skipped entirely
4. **Handshake generator** correctly groups by `session_scope`, but receives violations that shouldn't exist

---

## Section 3 — Refined Design Options

### Option 1 — Fix Path Matching Bug (Recommended)

**Changes Required:**

1. **Fix `DocumentContext._detect_historical_doc()` in `date_detector.py`:**
   - Change from `startswith()` to checking if path **contains** the historical directory
   - Or make path relative to project root before checking

2. **Fix `_is_historical_document_file()` in `auto-enforcer.py`:**
   - Same fix: check if path contains historical directory, not if it starts with it

**Implementation:**
```python
# In DocumentContext._detect_historical_doc()
file_path_str = str(self.file_path).replace("\\", "/").lower()
historical_dirs = ["docs/auto-pr/", "docs/archive/", "docs/historical/"]

# FIX: Check if any historical dir is IN the path, not if path starts with it
if any(f"/{dir_path}" in file_path_str or file_path_str.endswith(dir_path.rstrip("/")) 
       for dir_path in historical_dirs):
    return True

# OR: Make path relative to project root first
# (Requires passing project_root to DocumentContext)
```

**Pros:**
- ✅ Fixes the root cause directly
- ✅ Minimal code change
- ✅ Preserves existing behavior for other file types
- ✅ Auto-PR files will be correctly skipped in `check_hardcoded_dates()`

**Cons:**
- ⚠️ Requires careful path matching logic (edge cases with subdirectories)
- ⚠️ May need to handle both absolute and relative paths

**Where Applied:**
- `.cursor/enforcement/date_detector.py` line 79-87
- `.cursor/scripts/auto-enforcer.py` line 2085-2093

**Interaction with `violation_scope`:**
- Once fixed, Auto-PR files will be skipped entirely in `check_hardcoded_dates()`
- No violations will be created for them, regardless of `violation_scope`
- This is the desired behavior: historical docs should never generate violations

---

### Option 2 — Force Historical Scope for Auto-PR Docs (Post-Violation Override)

**Changes Required:**

1. **Add post-processing step** in `check_hardcoded_dates()`:
   - After creating violation, check if file is in `docs/Auto-PR/`
   - If yes, override `session_scope` to `"historical"` and optionally downgrade severity

2. **Or add check in violation creation:**
   - Before creating violation, check file path
   - If in Auto-PR, set `session_scope="historical"` regardless of `violation_scope`

**Implementation:**
```python
# In check_hardcoded_dates(), before creating violation:
file_path_lower = str(file_path).replace("\\", "/").lower()
if "docs/auto-pr/" in file_path_lower or "docs/archive/" in file_path_lower:
    # Force historical scope for Auto-PR docs
    effective_scope = "historical"
    # Optionally downgrade severity
    effective_severity = ViolationSeverity.WARNING
else:
    effective_scope = session_scope
    effective_severity = ViolationSeverity.BLOCKED

self._log_violation(Violation(
    severity=effective_severity,
    session_scope=effective_scope,
    ...
))
```

**Pros:**
- ✅ Works even if historical detection fails
- ✅ Provides visibility into Auto-PR date issues (as historical violations)
- ✅ Doesn't require fixing path matching bug

**Cons:**
- ❌ Still creates violations (just marks them as historical)
- ❌ Doesn't fix the root cause (historical detection still broken)
- ❌ More code complexity (override logic)

**Where Applied:**
- `.cursor/scripts/auto-enforcer.py` lines 2424-2431, 2475-2482, 2502-2509 (all violation creation points)

**Interaction with `violation_scope`:**
- Overrides `violation_scope` for Auto-PR files
- Always sets `session_scope="historical"` for them
- Handshake generator will correctly group them as historical

---

### Option 3 — Hard Skip for Historical Docs (Skip Entire File)

**Changes Required:**

1. **Fix path matching** (same as Option 1)
2. **Add explicit directory check** before DocumentContext:
   - Check file path string directly for `docs/Auto-PR/` pattern
   - Skip file immediately if match found

**Implementation:**
```python
# In check_hardcoded_dates(), before DocumentContext check:
file_path_str_normalized = str(file_path).replace("\\", "/").lower()
if any(historical_dir in file_path_str_normalized 
       for historical_dir in ["docs/auto-pr/", "docs/archive/", "docs/historical/"]):
    logger.debug(f"Skipping historical document directory: {file_path_str}")
    continue
```

**Pros:**
- ✅ Simple and explicit
- ✅ Works regardless of DocumentContext path matching
- ✅ No violations created for Auto-PR files
- ✅ Fast (early exit)

**Cons:**
- ⚠️ Duplicates logic (also in DocumentContext)
- ⚠️ Still need to fix DocumentContext for consistency

**Where Applied:**
- `.cursor/scripts/auto-enforcer.py` line ~2300 (before DocumentContext check)

**Interaction with `violation_scope`:**
- Files are skipped entirely, so no violations created
- No interaction with `violation_scope` needed

---

## Section 4 — Recommended Fix Plan

### Recommended Approach: **Option 1 (Fix Path Matching) + Option 3 (Hard Skip)**

**Rationale:**
- Fixes root cause (path matching bug)
- Adds defensive check for early exit
- Ensures Auto-PR files are never processed
- Minimal complexity, maximum reliability

### Concrete Steps

#### Step 1: Fix `DocumentContext._detect_historical_doc()` Path Matching

**File:** `.cursor/enforcement/date_detector.py`  
**Lines:** 79-87

**Change:**
```python
# BEFORE:
if any(file_path_str.startswith(dir_path) for dir_path in historical_dirs):
    return True

# AFTER:
# Check if any historical directory is contained in the path
# Handle both absolute paths and relative paths
if any(f"/{dir_path.rstrip('/')}/" in file_path_str or 
       file_path_str.endswith(f"/{dir_path.rstrip('/')}") or
       file_path_str.endswith(dir_path.rstrip("/"))
       for dir_path in historical_dirs):
    return True
```

**Alternative (Cleaner):**
```python
# Make path relative to project root if possible, or check containment
# Check if path contains the historical directory pattern
for dir_path in historical_dirs:
    dir_pattern = f"/{dir_path.rstrip('/')}/"
    if dir_pattern in file_path_str:
        return True
```

#### Step 2: Fix `_is_historical_document_file()` Path Matching

**File:** `.cursor/scripts/auto-enforcer.py`  
**Lines:** 2085-2093

**Change:**
```python
# BEFORE:
if any(file_path_str.startswith(dir_path) for dir_path in historical_dirs):
    return True

# AFTER:
# Check if path contains historical directory (not just starts with)
for dir_path in historical_dirs:
    dir_pattern = f"/{dir_path.rstrip('/')}/"
    if dir_pattern in file_path_str:
        return True
```

#### Step 3: Add Defensive Hard Skip Check (Optional but Recommended)

**File:** `.cursor/scripts/auto-enforcer.py`  
**Lines:** ~2300 (before DocumentContext check)

**Add:**
```python
# Defensive check: Skip historical document directories early
# This ensures Auto-PR files are skipped even if DocumentContext check fails
file_path_str_normalized = str(file_path).replace("\\", "/").lower()
historical_dir_patterns = ["/docs/auto-pr/", "/docs/archive/", "/docs/historical/"]
if any(pattern in file_path_str_normalized for pattern in historical_dir_patterns):
    logger.debug(
        f"Skipping historical document directory: {file_path_str}",
        operation="check_hardcoded_dates",
        file_path=file_path_str,
        reason="historical_directory"
    )
    continue
```

### Testing Plan

**Test Case 1: Auto-PR File in Current Session Scan**
```bash
python .cursor/scripts/auto-enforcer.py --scope current_session
```
**Expected:**
- `docs/Auto-PR/*.md` files should NOT appear in "Current Session Violations"
- `ENFORCER_STATUS.md` should show `Status: APPROVED` (if no other violations)
- `ACTIVE_VIOLATIONS.md` should NOT list Auto-PR files in current session section

**Test Case 2: Auto-PR File in Full Scan**
```bash
python .cursor/scripts/auto-enforcer.py --scope full
```
**Expected:**
- `docs/Auto-PR/*.md` files should NOT appear in violations at all (skipped entirely)
- Or, if they do appear, they should be in "Historical Violations" section only
- `ENFORCER_STATUS.md` should NOT be blocked by Auto-PR violations

**Test Case 3: Verify Path Matching**
- Test with Windows paths (backslashes)
- Test with Unix paths (forward slashes)
- Test with absolute paths
- Test with relative paths
- Test with mixed case (`docs/Auto-PR/` vs `docs/auto-pr/`)

### Expected Behavior After Fix

**For `docs/Auto-PR/*.md` files:**
- ✅ Files are detected as historical by `DocumentContext.is_historical_doc`
- ✅ Files are skipped at line 2316 in `check_hardcoded_dates()`
- ✅ No violations are created for these files
- ✅ Files do NOT appear in `ACTIVE_VIOLATIONS.md` "Current Session Violations"
- ✅ Files do NOT block per-task completion

**For other historical files:**
- ✅ Existing behavior preserved (files with dates in names, etc.)
- ✅ No regressions

**For `ENFORCER_STATUS.md`:**
- ✅ Status based only on actual current-session violations
- ✅ Auto-PR violations do not contribute to blocking count

---

## Section 5 — Updated Implementation Checklist for Execution Brain

### Checklist

1. **Fix `DocumentContext._detect_historical_doc()` path matching:**
   - [ ] Open `.cursor/enforcement/date_detector.py`
   - [ ] Locate `_detect_historical_doc()` method (line ~69)
   - [ ] Change `startswith()` check to containment check (see Step 1 above)
   - [ ] Test with Windows absolute path: `C:\Users\...\docs\Auto-PR\file.md`
   - [ ] Test with Unix path: `/home/user/.../docs/Auto-PR/file.md`
   - [ ] Verify `is_historical_doc` returns `True` for Auto-PR files

2. **Fix `_is_historical_document_file()` path matching:**
   - [ ] Open `.cursor/scripts/auto-enforcer.py`
   - [ ] Locate `_is_historical_document_file()` method (line ~2072)
   - [ ] Change `startswith()` check to containment check (see Step 2 above)
   - [ ] Test with various path formats
   - [ ] Verify method returns `True` for Auto-PR files

3. **Add defensive hard skip check (optional but recommended):**
   - [ ] Open `.cursor/scripts/auto-enforcer.py`
   - [ ] Locate `check_hardcoded_dates()` method (line ~2200)
   - [ ] Add hard skip check before DocumentContext check (see Step 3 above)
   - [ ] Add debug logging for skipped files
   - [ ] Verify files are skipped early

4. **Test the fixes:**
   - [ ] Run `python .cursor/scripts/auto-enforcer.py --scope current_session`
   - [ ] Verify `docs/Auto-PR/*.md` files do NOT appear in current session violations
   - [ ] Check `ENFORCER_STATUS.md` - should not be blocked by Auto-PR violations
   - [ ] Check `ACTIVE_VIOLATIONS.md` - Auto-PR files should not be in "Current Session Violations"
   - [ ] Run `python .cursor/scripts/auto-enforcer.py --scope full`
   - [ ] Verify Auto-PR files are either skipped or appear only in "Historical Violations"

5. **Verify no regressions:**
   - [ ] Test with files that have dates in filenames (should still be detected as historical)
   - [ ] Test with log files (should still be skipped)
   - [ ] Test with regular source files (should still be checked normally)

6. **Update documentation (if needed):**
   - [ ] Verify `02-core.mdc` still correctly documents `docs/Auto-PR/` as historical
   - [ ] No changes needed if documentation is already correct

---

## Summary

**Root Cause:** Path matching bug in `DocumentContext._detect_historical_doc()` uses `startswith()` on full absolute paths, causing Auto-PR files to not be detected as historical.

**Fix:** Change path matching from `startswith()` to containment check (`in` operator), ensuring `docs/Auto-PR/` is detected regardless of path format.

**Expected Outcome:** Auto-PR files will be correctly skipped in `check_hardcoded_dates()`, no violations will be created for them, and they will not block per-task completion.

---

**— END ANALYSIS BRAIN. Execution Brain DO NOT ACT until approved.**



