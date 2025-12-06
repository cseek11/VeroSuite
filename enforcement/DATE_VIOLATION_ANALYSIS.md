# VeroField Auto-Enforcer — Historical vs Current-Session Date Violations (Analysis)

**Analysis Brain Report**  
**Generated:** 2025-12-04  
**Session ID:** ed0cc1f9-98ea-4de4-b450-f3fe320812c2

---

## Section 1 — Current Date Enforcement Behavior

### How Date-Related Rules Are Enforced

The date enforcement logic in `check_hardcoded_dates()` (lines 2190-2508 in `auto-enforcer.py`) follows this flow:

1. **File Discovery:**
   - Calls `get_changed_files(include_untracked=True)` to get all files to check
   - This includes both tracked files (with git diffs) and untracked files

2. **File Filtering:**
   - Skips binary files, excluded directories (`.cursor/enforcement`, `.cursor/archive`, `.cursor/backups`)
   - Skips log files and historical document files (files with dates in their names)
   - **BUT:** `docs/Auto-PR/*.md` files do NOT match the historical document pattern (which only checks for dates in filenames like `document_2026-12-21.md`)

3. **Modification Check:**
   - For each file, checks `is_file_modified_in_session(file_path_str)` 
   - This uses content hashing to detect if file was actually modified
   - If file was NOT modified, it skips entirely (line 2327-2333)

4. **Line-Level Check:**
   - For files that WERE modified, scans for hardcoded dates
   - For each date found, checks `is_line_changed_in_session(file_path_str, line_num)` (line 2358)
   - If line was NOT changed, skips it (line 2361)
   - If line WAS changed and date doesn't match current date, creates violation with `session_scope="current_session"` (lines 2386, 2398, 2414)

5. **Session Scope Assignment:**
   - **CRITICAL ISSUE:** The date checker **always** sets `session_scope="current_session"` when it finds a violation (lines 2386, 2398, 2414, 2465, 2476, 2492)
   - It does NOT respect the `violation_scope` parameter passed to `run_all_checks()` (line 3616)
   - Even when running a full scan (`scope="full"`), date violations are marked as `current_session`

### How Session Scope Is Assigned

The enforcer has two mechanisms for assigning session scope:

1. **At Check Level (Line 3616):**
   ```python
   violation_scope = "historical" if scope == "full" else "current_session"
   ```
   - This is passed to modular checkers but **NOT used by `check_hardcoded_dates()`**

2. **At Violation Level (in date checker):**
   - `check_hardcoded_dates()` **hardcodes** `session_scope="current_session"` for all violations it finds
   - It does this regardless of whether the file was actually modified in the current session or is just being scanned in a full scan

### How Severity Is Determined

- **All date violations are BLOCKING** (lines 2381, 2392, 2408, etc.)
- There is **no path-based logic** to downgrade documentation files to WARNING
- The rule `02-core.mdc` treats all date violations equally, regardless of file type

### Example from ENFORCER_REPORT.json

From the report, a typical `docs/Auto-PR/*.md` violation looks like:

```json
{
  "id": "VF-DATE-001",
  "severity": "BLOCKING",
  "file": "docs/Auto-PR/PHASE2_FINAL_STATUS.md",
  "rule_ref": "02-core.mdc",
  "description": "Hardcoded date detected: 2025-12-04 (should be 2025-12-04)",
  "session_scope": "historical"
}
```

**Note:** In `ENFORCER_REPORT.json`, these violations ARE marked as `"historical"`, but in `ACTIVE_VIOLATIONS.md` they appear in the "Current Session Violations" section. This suggests a discrepancy between how violations are stored vs. how they're filtered for display.

---

## Section 2 — Root Cause of Over-Blocking

### Why docs/Auto-PR/*.md Files Are Being Treated as BLOCKING

The root cause is a **combination of three issues**:

#### Issue 1: Session Scope Mis-Assignment in Date Checker

**Location:** `check_hardcoded_dates()` method (lines 2190-2508)

**Problem:**
- The date checker **hardcodes** `session_scope="current_session"` for all violations (lines 2386, 2398, 2414, 2465, 2476, 2492)
- It does NOT use the `violation_scope` parameter that `run_all_checks()` provides (line 3616)
- Even when running a full scan, violations are marked as `current_session`

**Evidence:**
- Line 3616: `violation_scope = "historical" if scope == "full" else "current_session"`
- But `check_hardcoded_dates()` never receives or uses this parameter
- It always sets `session_scope="current_session"` when creating violations

#### Issue 2: Historical Document Detection Doesn't Match docs/Auto-PR Pattern

**Location:** `_is_historical_document_file()` method (lines 2072-2105)

**Problem:**
- The method only checks for dates **in filenames** (e.g., `document_2026-12-21.md`)
- It does NOT check for directory patterns like `docs/Auto-PR/`
- Files like `docs/Auto-PR/PHASE2_FINAL_STATUS.md` are NOT recognized as historical documents

**Evidence:**
- Line 2089: Checks for `\d{4}[-_]\d{2}[-_]\d{2}` in filename
- Line 2099: Checks for prefixes like `document_`, `report_`, `entry_`, etc.
- No check for `docs/Auto-PR/` directory pattern

#### Issue 3: Files May Be Incorrectly Detected as "Modified"

**Location:** `is_file_modified_in_session()` method (lines 1458-1560)

**Potential Problem:**
- If `docs/Auto-PR/*.md` files are showing up in `get_changed_files()`, they might be:
  - Untracked files (newly added to git)
  - Files with whitespace-only changes
  - Files that were touched but not actually modified

**Evidence:**
- Line 2207: `get_changed_files(include_untracked=True)` includes untracked files
- Line 2324: `is_file_modified_in_session()` uses content hashing, which should be reliable
- But if files are in `get_changed_files()`, they will be checked

### Why This Is a Rule Design Issue

The date rule (`02-core.mdc`) is **too strict for documentation files**:

1. **No Distinction Between Code and Docs:**
   - The rule treats code files and documentation files identically
   - Documentation files (especially historical/generated docs) should have different rules

2. **No Path-Based Exemptions:**
   - There's no mechanism to exempt specific directories (like `docs/Auto-PR/`) from date enforcement
   - All files are subject to the same strict "must be current date" rule

3. **No Severity Downgrade for Historical Context:**
   - Even if a doc file has a date that matches its last-modified timestamp, it's still BLOCKING
   - There's no logic to say "this date matches when the file was created/modified, so it's acceptable"

---

## Section 3 — Design Options

### Option A — Reclassify docs/Auto-PR as Historical by Default

**Approach:**
- Add `docs/Auto-PR/` to the list of directories that are treated as historical
- Files in this directory are automatically assigned `session_scope="historical"` for date violations
- Keep the date rule strict for code files

**Implementation:**
- Modify `check_hardcoded_dates()` to check if file path starts with `docs/Auto-PR/`
- If yes, set `session_scope="historical"` instead of `"current_session"`
- Optionally, also downgrade severity to WARNING for these files

**Pros:**
- ✅ Simple, targeted fix
- ✅ Preserves strict enforcement for code files
- ✅ Low risk of false negatives (only affects docs/Auto-PR)
- ✅ Minimal code changes

**Cons:**
- ❌ Hardcodes a specific directory path (not generalizable)
- ❌ Doesn't solve the problem for other historical doc directories
- ❌ Still requires files to be detected as "modified" to trigger the check

**Risk of False Negatives:**
- Low — only affects `docs/Auto-PR/` directory
- If someone actually modifies a file in this directory in the current session, it would still be caught (just marked as historical)

**Impact on Developer Friction:**
- ✅ Reduces friction significantly — historical docs no longer block work
- ✅ Maintains enforcement integrity for code files

---

### Option B — Path-Based Severity Downgrade for docs/ Directory

**Approach:**
- Date violations in `docs/` directory are downgraded from BLOCKING → WARNING
- They still appear in reports but don't block task completion
- Code files remain BLOCKING

**Implementation:**
- Modify `check_hardcoded_dates()` to check if file path starts with `docs/`
- If yes, set `severity=ViolationSeverity.WARNING` instead of `BLOCKED`
- Keep `session_scope="current_session"` but severity is lower

**Pros:**
- ✅ More general solution (covers all docs, not just Auto-PR)
- ✅ Still enforces dates (as warnings) but doesn't block
- ✅ Simple implementation

**Cons:**
- ❌ May be too broad — some docs (like README.md) might legitimately need current dates
- ❌ Doesn't address the session_scope mis-assignment issue
- ❌ Warnings might still clutter reports

**Risk of False Negatives:**
- Medium — if a critical doc (like setup instructions) has stale dates, it would only be a warning
- Could miss important date updates in active documentation

**Impact on Developer Friction:**
- ✅ Reduces blocking friction
- ⚠️ May reduce enforcement integrity for active documentation

---

### Option C — Hybrid Rule: Date Age + Session Scope Fix

**Approach:**
1. **Fix session_scope assignment:** Make `check_hardcoded_dates()` respect the `violation_scope` parameter
2. **Add date age check:** Only BLOCK if date is "too stale" (e.g., >7 days old) OR if file was modified in current session
3. **Path-based exemptions:** Add `docs/Auto-PR/` to historical document detection

**Implementation:**
- Pass `violation_scope` parameter to `check_hardcoded_dates()`
- Use it when creating violations: `session_scope=violation_scope if violation_scope else "current_session"`
- Add date age calculation: `(current_date - file_date).days`
- If date is >7 days old AND file wasn't modified in session, mark as historical/WARNING
- Add `docs/Auto-PR/` to `_is_historical_document_file()` check

**Pros:**
- ✅ Fixes the root cause (session_scope mis-assignment)
- ✅ More nuanced rule (considers date age and file modification)
- ✅ Generalizable solution (works for any historical docs)
- ✅ Maintains strict enforcement for recent dates in modified files

**Cons:**
- ❌ More complex implementation
- ❌ Requires date parsing and age calculation
- ❌ Need to define "too stale" threshold (7 days? 30 days?)

**Risk of False Negatives:**
- Low — still catches violations in modified files
- Medium — might miss very recent dates in unmodified files (but those are less critical)

**Impact on Developer Friction:**
- ✅ Significantly reduces friction for historical docs
- ✅ Maintains enforcement integrity for active code/docs

---

## Section 4 — Recommended Plan

### Recommended Solution: **Option C (Hybrid Rule)** with Option A as Fallback

**Why Option C:**
1. **Fixes the root cause:** Addresses the session_scope mis-assignment bug
2. **Generalizable:** Works for any historical documentation, not just `docs/Auto-PR/`
3. **Balanced:** Maintains strict enforcement where needed, relaxes where appropriate
4. **Future-proof:** Handles new historical doc directories automatically

**Why Option A as Fallback:**
- If Option C is too complex, Option A provides a quick, targeted fix
- Can be implemented immediately to unblock work
- Option C can be added later as an enhancement

### Implementation Details

#### Step 1: Fix Session Scope Assignment

**File:** `.cursor/scripts/auto-enforcer.py`

**Location:** `check_hardcoded_dates()` method (line 2190)

**Change:**
1. Add `violation_scope` parameter to method signature:
   ```python
   def check_hardcoded_dates(self, violation_scope: str = "current_session") -> bool:
   ```

2. Update all violation creation calls to use the parameter:
   ```python
   session_scope = violation_scope if violation_scope else "current_session"
   ```

3. Pass `violation_scope` from `run_all_checks()`:
   - Line 3715: Pass `violation_scope=violation_scope` to modular checkers
   - Or call `check_hardcoded_dates(violation_scope=violation_scope)` directly

#### Step 2: Add docs/Auto-PR to Historical Document Detection

**File:** `.cursor/scripts/auto-enforcer.py`

**Location:** `_is_historical_document_file()` method (line 2072)

**Change:**
Add directory-based check:
```python
# Check for historical documentation directories
historical_dirs = ['docs/auto-pr/', 'docs/archive/', 'docs/historical/']
file_path_lower = str(file_path).lower().replace('\\', '/')
if any(file_path_lower.startswith(dir_path) for dir_path in historical_dirs):
    return True
```

#### Step 3: Add Date Age Check (Optional Enhancement)

**File:** `.cursor/scripts/auto-enforcer.py`

**Location:** `check_hardcoded_dates()` method, after date classification (line 2365)

**Change:**
Add logic to check date age:
```python
# If date is >7 days old and file wasn't modified in session, downgrade to WARNING
if classification == DateClassification.CURRENT:
    try:
        from datetime import datetime
        file_date = datetime.strptime(date_match.date_str, '%Y-%m-%d').date()
        current_date_obj = datetime.strptime(self.CURRENT_DATE, '%Y-%m-%d').date()
        days_old = (current_date_obj - file_date).days
        
        if days_old > 7 and not file_modified:
            # Old date in unmodified file - WARNING, not BLOCKING
            severity = ViolationSeverity.WARNING
            session_scope = "historical"
        else:
            severity = ViolationSeverity.BLOCKED
            session_scope = violation_scope if violation_scope else "current_session"
    except ValueError:
        # Date parsing failed - use default behavior
        severity = ViolationSeverity.BLOCKED
        session_scope = violation_scope if violation_scope else "current_session"
```

---

## Section 5 — Implementation Checklist for Execution Brain

### Checklist

1. **Fix session_scope assignment in date checker:**
   - [ ] Add `violation_scope` parameter to `check_hardcoded_dates()` method signature (line ~2190)
   - [ ] Update all `Violation()` calls in `check_hardcoded_dates()` to use `session_scope=violation_scope if violation_scope else "current_session"` (lines 2386, 2398, 2414, 2465, 2476, 2492)
   - [ ] Pass `violation_scope` from `run_all_checks()` to `check_hardcoded_dates()` (or through modular checker router)

2. **Add docs/Auto-PR to historical document detection:**
   - [ ] Modify `_is_historical_document_file()` method (line ~2072) to check for `docs/Auto-PR/` directory pattern
   - [ ] Add similar check in `DocumentContext.is_historical_doc` if that class exists
   - [ ] Test that `docs/Auto-PR/*.md` files are now skipped by date checker

3. **Optional: Add date age check:**
   - [ ] Add date age calculation logic in `check_hardcoded_dates()` (after line 2365)
   - [ ] Downgrade to WARNING if date is >7 days old and file wasn't modified
   - [ ] Test with various date ages

4. **Regression testing:**
   - [ ] Run enforcer with `--scope current_session` on a modified code file with old date
   - [ ] Verify it's still BLOCKING and marked as `current_session`
   - [ ] Run enforcer with `--scope full` 
   - [ ] Verify `docs/Auto-PR/*.md` violations are now marked as `historical`
   - [ ] Verify `docs/Auto-PR/*.md` files no longer appear in "Current Session Violations" section of `ACTIVE_VIOLATIONS.md`
   - [ ] Verify `ENFORCER_STATUS.md` shows `APPROVED` when only historical violations exist

5. **Documentation:**
   - [ ] Update `02-core.mdc` rule file to document that `docs/Auto-PR/` is treated as historical
   - [ ] Add note about date age threshold (if implemented)

---

## Summary

The root cause is that `check_hardcoded_dates()` **hardcodes** `session_scope="current_session"` for all violations, ignoring the `violation_scope` parameter from `run_all_checks()`. Additionally, `docs/Auto-PR/*.md` files are not recognized as historical documents.

**Recommended fix:** Fix session_scope assignment + add `docs/Auto-PR/` to historical document detection. This provides immediate relief while maintaining enforcement integrity for code files.

---

**— END ANALYSIS BRAIN. Execution Brain DO NOT ACT until approved.**






