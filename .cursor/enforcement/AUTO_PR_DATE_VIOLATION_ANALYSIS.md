# VeroField Auto-Enforcer — Historical Auto-PR Date Violations (Second-Pass Analysis)

**Analysis Brain Report**  
**Generated:** 2025-12-03  
**Session ID:** Analysis-Second-Pass

---

## Executive Summary

After a detailed code inspection, the root cause of Auto-PR files appearing as "Current Session Violations" has been identified. The issue is **not** in the date checking logic itself (which correctly identifies Auto-PR files as historical), but rather in a **timing and re-evaluation issue** where violations are created with one scope and then potentially re-evaluated to a different scope, but the original violation may still exist in the report.

**Key Finding:** The defensive skip logic (lines 2308-2323 in `auto-enforcer.py`) and `DocumentContext.is_historical_doc` detection (lines 69-117 in `date_detector.py`) **both correctly identify** `docs/Auto-PR/` files as historical. However, there is a **critical gap** in the flow where:

1. Files may be processed **before** the historical detection check if they're incorrectly detected as "modified"
2. The `re_evaluate_violation_scope()` method (line 2898) can change scopes **after** violations are created, but this happens **after** `check_hardcoded_dates()` has already created violations
3. The `file_modified` check (line 2361) may be returning `True` for Auto-PR files that shouldn't be considered modified

---

## Section 1 — Code Path Analysis

### 1.1 Date Checking Flow

**Location:** `check_hardcoded_dates()` in `auto-enforcer.py` (lines 2204-2545)`

**Current Implementation:**
1. **File Discovery** (line 2227): `get_changed_files(include_untracked=True)` gets all changed files
2. **Pre-compute Modification Status** (lines 2265-2276): Batch-check which files are actually modified
3. **File Filtering Loop** (lines 2294-2370):
   - Skip binary files (lines 2301-2302)
   - Skip excluded directories (lines 2304-2306)
   - **Defensive Historical Check** (lines 2308-2323): Skip `docs/auto-pr/` early
   - **DocumentContext Check** (lines 2325-2356): Skip if `doc_context.is_historical_doc` is True
   - **Modification Check** (line 2361): Skip if `file_modified` is False
4. **Date Detection** (lines 2372-2532): Only processes files that passed all filters

**Key Observation:** The defensive check at lines 2308-2323 should catch Auto-PR files **before** they reach the modification check. However, if a file somehow passes this check (e.g., path normalization issue), it will still be caught by `DocumentContext.is_historical_doc` (line 2337).

### 1.2 Historical Detection Helpers

**Location 1:** `_is_historical_document_file()` in `auto-enforcer.py` (lines 2072-2119)

**Current Implementation:**
- Checks for historical directories: `docs/auto-pr/`, `docs/archive/`, `docs/historical/` (lines 2087-2097)
- Uses substring matching: `if dir_pattern in file_path_str` (line 2096)
- Handles both absolute and relative paths

**Location 2:** `DocumentContext._detect_historical_doc()` in `date_detector.py` (lines 69-117)

**Current Implementation:**
- Same directory checks as above (lines 81-91)
- Also checks for date patterns in filenames
- Checks for historical markers in content

**Key Observation:** Both methods **correctly** identify `docs/Auto-PR/` as historical. The defensive check in `check_hardcoded_dates()` uses the same pattern matching logic.

### 1.3 File Modification Detection

**Location:** `is_file_modified_in_session()` in `auto-enforcer.py` (lines 1458-1573)

**Current Implementation:**
- Uses content hashing (SHA256) to detect actual file changes
- Compares current hash with previous hash stored in session
- Returns `True` if hash changed OR if this is the first check (line 1546)

**Critical Issue:** On the **first check** of a file in a session, `is_file_modified_in_session()` returns `True` if the file is in `changed_files` (line 1546). This means:
- If an Auto-PR file appears in `get_changed_files()` (e.g., due to git status showing it as "modified" even though content hasn't changed)
- And if the defensive historical check somehow fails (edge case)
- The file will be processed and violations will be created

**Root Cause Hypothesis:** Auto-PR files may be appearing in `get_changed_files()` due to:
1. Git status showing them as modified (even if content hasn't changed)
2. Whitespace-only changes
3. Line ending changes (CRLF vs LF)
4. File timestamp updates without content changes

### 1.4 Session Scope Assignment

**Location:** `check_hardcoded_dates()` parameter and usage (lines 2204, 2224, 2423, 2435, 2451, 2502, 2529)

**Current Implementation:**
- Method accepts `violation_scope: str = "current_session"` parameter (line 2204)
- Sets `session_scope = violation_scope if violation_scope else "current_session"` (line 2224)
- Uses `session_scope` when creating violations (lines 2423, 2435, 2451, etc.)

**Key Observation:** The method **correctly** uses the `violation_scope` parameter. When called with `scope="full"`, `violation_scope="historical"` is passed (line 3671), and violations are created with `session_scope="historical"`.

### 1.5 Re-Evaluation of Violation Scope

**Location:** `re_evaluate_violation_scope()` in `auto-enforcer.py` (lines 2898-2970)

**Current Implementation:**
- Called by `generate_agent_status()` (line 2979) **before** `generate_two_brain_report()` (line 3802)
- Re-checks if file is in historical directory (lines 2910-2926)
- Re-checks if file is still in `changed_files` (lines 2928-2939)
- Re-checks if file was actually modified (lines 2941-2952)
- Re-checks if line was actually changed (lines 2954-2967)
- Updates `violation.session_scope` in-place (line 2987)

**Key Observation:** This method **can change** `session_scope` from "current_session" to "historical" after violations are created. However, this happens **after** `check_hardcoded_dates()` has already run, so if a violation was incorrectly created with `session_scope="current_session"`, it will be corrected here.

**Potential Issue:** If `re_evaluate_violation_scope()` is called **multiple times** or if there's a race condition, violations might be created with one scope and then re-evaluated to another, but both versions might exist in the report.

### 1.6 Report Generation

**Location:** `two_brain_integration.py` (lines 40-96) and `handshake_generator.py` (lines 46-232)

**Current Implementation:**
- `integrate_with_enforcer()` converts enforcer violations to report violations (line 64-75)
- `_get_session_scope()` extracts `session_scope` from violation (lines 235-239)
- `HandshakeGenerator.generate_status_file()` filters by `v.session_scope == "current_session"` (line 51)
- `HandshakeGenerator.generate_violations_file()` filters by `v.session_scope == "current_session"` (line 119)

**Key Observation:** The filtering logic **correctly** separates violations by `session_scope`. If a violation has `session_scope="historical"`, it should **not** appear in "Current Session Violations".

---

## Section 2 — Root Cause Analysis

### 2.1 Why Auto-PR Files Are Still Treated as Current-Session

Based on the code inspection, there are **three potential root causes**:

#### Root Cause 1: Files Incorrectly Detected as Modified

**Problem:** Auto-PR files may be appearing in `get_changed_files()` even though their content hasn't actually changed. This can happen due to:
- Git status showing files as "modified" due to line ending changes (CRLF vs LF)
- File timestamp updates without content changes
- Whitespace-only changes
- Git index inconsistencies

**Evidence:**
- `is_file_modified_in_session()` returns `True` on first check if file is in `changed_files` (line 1546)
- If a file is in `changed_files`, it will be processed even if content hasn't actually changed

**Impact:** If an Auto-PR file is incorrectly detected as modified, it will:
1. Pass the defensive historical check (if path normalization works correctly)
2. Pass the `DocumentContext.is_historical_doc` check (if detection works correctly)
3. **BUT** if both checks fail (edge case), the file will be processed and violations created with `session_scope="current_session"` (if running with `scope="current_session"`)

#### Root Cause 2: Path Normalization Edge Case

**Problem:** The defensive check at lines 2308-2323 uses substring matching:
```python
file_path_str_normalized = str(file_path).replace("\\", "/").lower()
historical_dir_patterns = [
    "/docs/auto-pr/", "/docs/archive/", "/docs/historical/",  # Absolute paths
    "docs/auto-pr/", "docs/archive/", "docs/historical/"      # Relative paths
]
if any(pattern in file_path_str_normalized for pattern in historical_dir_patterns):
```

**Potential Issue:** If `file_path` is a `Path` object representing an absolute path like `C:\Users\...\docs\Auto-PR\file.md`, after normalization it becomes `c:/users/.../docs/auto-pr/file.md`. The pattern `/docs/auto-pr/` should match, but if the path doesn't contain a leading slash (e.g., `c:users/...`), it might not match the absolute pattern.

**However:** The relative pattern `docs/auto-pr/` should still match because it's a substring. So this is likely **not** the issue.

#### Root Cause 3: Re-Evaluation Timing Issue

**Problem:** `re_evaluate_violation_scope()` is called **after** violations are created, but **before** the report is generated. If a violation is created with `session_scope="current_session"` and then re-evaluated to `session_scope="historical"`, the change happens in-place (line 2987). However, if the re-evaluation logic has a bug or if there's a race condition, both scopes might exist.

**Evidence:** The user mentioned that `ENFORCER_REPORT.json` shows the same file with **both** "current_session" and "historical" scopes. This suggests:
1. The same violation is being created twice (once in a `current_session` run, once in a `full` run)
2. OR violations aren't being deduplicated
3. OR the re-evaluation is creating duplicate entries somehow

**Most Likely:** The enforcer is being run **multiple times** with different scopes, and violations from different runs are being accumulated in the report.

---

## Section 3 — Analysis Questions Answered

### Q1: Where Is Historical Detection Applied (or Not)?

**Answer:**
1. **`check_hardcoded_dates()` defensive check (lines 2308-2323):** Yes, it calls a path-based check that looks for `docs/auto-pr/` in the normalized path. This happens **early** in the file processing loop, before the modification check.

2. **`DocumentContext.is_historical_doc` usage (line 2337):** Yes, `check_hardcoded_dates()` checks `doc_context.is_historical_doc` and skips the file if True. This happens **after** the defensive check but **before** the modification check.

3. **`session_scope` overwriting:** Yes, `re_evaluate_violation_scope()` (line 2979) can change `session_scope` after violations are created. This happens in `generate_agent_status()` which is called **before** `generate_two_brain_report()`.

### Q2: Why Are Auto-PR Violations Still Treated as Current-Session?

**Answer:**
1. **`session_scope` in `ENFORCER_REPORT.json`:** Based on user's observation, the same file appears with **both** "current_session" and "historical" scopes. This suggests the enforcer is being run multiple times with different scopes, and violations are being accumulated.

2. **`HandshakeGenerator` filtering:** The generator **correctly** filters by `v.session_scope == "current_session"` (lines 51, 119). If violations have `session_scope="historical"`, they should **not** appear in "Current Session Violations".

3. **`ENFORCER_STATUS.md` status determination:** Status is determined by `blocking_current` which filters by `v.session_scope == "current_session"` (line 51). If only historical violations exist, status should be `APPROVED_WITH_BASELINE_ISSUES` or `APPROVED`.

**Conclusion:** The bug is likely in **how violations are being created or accumulated**, not in the filtering logic. If Auto-PR files are appearing as current-session violations, it means they were created with `session_scope="current_session"` **despite** the historical detection checks.

### Q3: What Is the Desired Behavior for Auto-PR Docs?

**Answer (Confirmed Intent):**
- **When running `--scope current_session`:** Auto-PR docs should **NOT** appear as current-session violations. They should be skipped entirely by the defensive check or `DocumentContext.is_historical_doc` check.
- **When running `--scope full`:** Auto-PR date issues should show as historical-only and non-blocking. They should have `session_scope="historical"` and appear in "Historical Violations (Baseline)" section.

**Current Behavior (Based on Code):**
- The defensive check (lines 2308-2323) should skip Auto-PR files **before** they're processed.
- If a file somehow passes this check, `DocumentContext.is_historical_doc` should catch it (line 2337).
- If a file still passes both checks, it will be processed and violations created with the `violation_scope` passed to `check_hardcoded_dates()`.

**Gap:** If an Auto-PR file is incorrectly detected as "modified" (Root Cause 1), and if both historical detection checks fail (edge case), violations will be created. The `re_evaluate_violation_scope()` method should catch this, but if it's called **after** the report is generated, the violation will already be in the report with the wrong scope.

---

## Section 4 — Design Options (Refinement Round)

### Option A: Strengthen Historical Detection (Early Exit)

**Approach:**
- Move the defensive historical check to **before** the file modification check
- Add an additional check in `get_changed_files()` to filter out historical directories
- Ensure `re_evaluate_violation_scope()` is called **before** report generation (already done, but verify)

**Implementation:**
1. Add historical directory filtering in `get_changed_files()` or `_get_changed_files_impl()`
2. Keep defensive check in `check_hardcoded_dates()` as a safety net
3. Add logging to track when Auto-PR files are skipped vs. processed

**Pros:**
- ✅ Prevents Auto-PR files from being processed at the source
- ✅ Low risk of false negatives (only affects historical docs)
- ✅ Minimal code changes
- ✅ Maintains existing defensive checks as safety net

**Cons:**
- ❌ Doesn't address the root cause if files are incorrectly in `changed_files`
- ❌ May hide legitimate issues if someone actually modifies an Auto-PR file

**Risk of False Negatives:**
- Low — only affects `docs/Auto-PR/`, `docs/archive/`, `docs/historical/`
- If someone actually modifies an Auto-PR file in the current session, it would be skipped (but this is desired behavior)

**Impact on Developer Friction:**
- ✅ Significantly reduces friction — historical docs never block work
- ✅ Maintains enforcement integrity for code files

---

### Option B: Fix File Modification Detection (Hash-Based)

**Approach:**
- Improve `is_file_modified_in_session()` to be more conservative on first check
- Don't assume a file is modified just because it's in `changed_files`
- Compare file content hash with git's stored hash (if available)
- Only return `True` if content actually changed

**Implementation:**
1. Modify `is_file_modified_in_session()` to check git diff for actual content changes
2. Use `git diff --numstat` to detect real changes vs. metadata changes
3. Fall back to hash comparison if git diff is unavailable

**Pros:**
- ✅ Fixes root cause — prevents false positives from metadata changes
- ✅ More accurate detection of actual file modifications
- ✅ General solution (works for all files, not just Auto-PR)

**Cons:**
- ❌ More complex implementation
- ❌ Requires git operations (may be slower)
- ❌ May miss some edge cases (e.g., binary files)

**Risk of False Negatives:**
- Low — still catches actual content changes
- Medium — might miss some edge cases (e.g., line ending changes that affect functionality)

**Impact on Developer Friction:**
- ✅ Reduces friction for all files (not just Auto-PR)
- ✅ More accurate enforcement (only flags real changes)

---

### Option C: Hybrid Approach (Option A + Option B)

**Approach:**
1. **Strengthen historical detection** (Option A): Filter historical directories in `get_changed_files()`
2. **Fix file modification detection** (Option B): Improve `is_file_modified_in_session()` to be more accurate
3. **Add violation deduplication**: Ensure violations aren't duplicated when re-evaluated

**Implementation:**
1. Add historical directory filtering in `_get_changed_files_impl()`
2. Improve `is_file_modified_in_session()` to use git diff for first-check accuracy
3. Add deduplication logic in `generate_two_brain_report()` to prevent duplicate violations

**Pros:**
- ✅ Addresses multiple root causes
- ✅ Defense in depth (multiple layers of protection)
- ✅ General solution (works for all files)
- ✅ Prevents duplicate violations

**Cons:**
- ❌ More complex implementation
- ❌ Requires changes to multiple components
- ❌ More testing required

**Risk of False Negatives:**
- Low — multiple layers of protection
- Very low — deduplication prevents duplicate entries

**Impact on Developer Friction:**
- ✅ Significantly reduces friction
- ✅ More accurate enforcement
- ✅ Prevents confusion from duplicate violations

---

### Option D: Skip Historical Files Entirely in Date Checker

**Approach:**
- Add a **pre-filter** in `check_hardcoded_dates()` that removes historical files from `changed_files` **before** processing
- This ensures historical files never reach the modification check or date detection logic

**Implementation:**
```python
# At the start of check_hardcoded_dates(), after getting changed_files:
historical_patterns = ["docs/auto-pr/", "docs/archive/", "docs/historical/"]
changed_files = [
    f for f in changed_files
    if not any(pattern in str(f).replace("\\", "/").lower() for pattern in historical_patterns)
]
```

**Pros:**
- ✅ Simple, targeted fix
- ✅ Prevents historical files from being processed at all
- ✅ Minimal code changes
- ✅ Low risk of side effects

**Cons:**
- ❌ Hardcodes specific directory patterns (not generalizable)
- ❌ Doesn't address root cause (why files are in changed_files)
- ❌ May hide legitimate issues if someone modifies an Auto-PR file

**Risk of False Negatives:**
- Low — only affects historical doc directories
- Medium — if someone actually modifies an Auto-PR file, it would be skipped (but this might be desired)

**Impact on Developer Friction:**
- ✅ Reduces friction immediately
- ✅ Simple to implement and test

---

## Section 5 — Recommended Plan (Concrete)

### Recommended Solution: **Option C (Hybrid Approach)** with Option D as Quick Fix

**Why Option C:**
1. **Addresses root causes:** Fixes both the file modification detection issue and the historical detection issue
2. **Defense in depth:** Multiple layers of protection ensure Auto-PR files are never processed
3. **General solution:** Works for all files, not just Auto-PR
4. **Prevents duplicates:** Deduplication logic prevents confusion from duplicate violations

**Why Option D as Quick Fix:**
- Can be implemented immediately to unblock work
- Option C can be added later as a more robust solution

### Implementation Steps

#### Step 1: Quick Fix — Pre-Filter Historical Files (Option D)

**File:** `.cursor/scripts/auto-enforcer.py`

**Location:** `check_hardcoded_dates()` method, after line 2255 (after `changed_files` is set)

**Change:**
```python
# Pre-filter historical document directories to prevent processing
historical_patterns = ["docs/auto-pr/", "docs/archive/", "docs/historical/"]
changed_files = [
    f for f in changed_files
    if not any(
        pattern in str(f).replace("\\", "/").lower()
        for pattern in historical_patterns
    )
]
logger.debug(
    f"Pre-filtered historical files from date check",
    operation="check_hardcoded_dates",
    original_count=len(changed_files) + len([f for f in changed_files if any(...)]),  # Approximate
    filtered_count=len(changed_files)
)
```

**Testing:**
1. Run enforcer with `--scope current_session` on a repo with Auto-PR files
2. Verify Auto-PR files are not in the violations list
3. Verify `ENFORCER_STATUS.md` shows `APPROVED` (or `APPROVED_WITH_BASELINE_ISSUES` if other historical violations exist)
4. Verify `ACTIVE_VIOLATIONS.md` shows no Auto-PR files in "Current Session Violations"

#### Step 2: Improve File Modification Detection (Option B)

**File:** `.cursor/scripts/auto-enforcer.py`

**Location:** `is_file_modified_in_session()` method (lines 1458-1573)

**Change:**
Modify the first-check logic (lines 1533-1546) to be more conservative:

```python
# Phase 2: Simplified hash-only comparison
# If no previous hash, this is first time checking this file in this session
if previous_hash is None:
    # First time checking - check git diff to see if content actually changed
    # This prevents false positives from metadata-only changes
    git_diff = self.run_git_command(['diff', '--numstat', 'HEAD', '--', file_path])
    if git_diff and git_diff.strip():
        # File has actual content changes (git diff shows additions/deletions)
        # Store current hash as baseline
        self.session.file_hashes[previous_hash_key] = current_hash
        self.session.file_hashes[cache_key] = current_hash
        logger.debug(
            f"First check of file in session, git diff shows changes: {file_path}",
            operation="is_file_modified_in_session",
            file_path=file_path
        )
        return True
    else:
        # No actual content changes (metadata-only change)
        # Store hash but return False (file not actually modified)
        self.session.file_hashes[previous_hash_key] = current_hash
        self.session.file_hashes[cache_key] = current_hash
        logger.debug(
            f"First check of file in session, no git diff changes: {file_path}",
            operation="is_file_modified_in_session",
            file_path=file_path
        )
        return False
```

**Testing:**
1. Create a test file with a hardcoded date
2. Touch the file (update timestamp) without changing content
3. Run enforcer with `--scope current_session`
4. Verify file is **not** detected as modified (no violations)
5. Actually modify the file content
6. Run enforcer again
7. Verify file **is** detected as modified (violations created)

#### Step 3: Add Violation Deduplication (Option C)

**File:** `.cursor/enforcement/two_brain_integration.py`

**Location:** `generate_report_from_enforcer()` method (lines 40-96)

**Change:**
Add deduplication logic before adding violations to report:

```python
# Convert enforcer violations to report violations
if hasattr(enforcer_instance, 'violations'):
    # Deduplicate violations by (file, line_number, rule_ref)
    # This prevents duplicate entries when violations are re-evaluated
    seen_violations = set()
    for v in enforcer_instance.violations:
        # Create unique key for deduplication
        violation_key = (
            self._get_file_path(v),
            getattr(v, 'line_number', None),
            self._get_rule_ref(v)
        )
        
        # Skip if we've already seen this violation
        if violation_key in seen_violations:
            logger.debug(
                f"Skipping duplicate violation: {violation_key}",
                operation="generate_report_from_enforcer",
                file=self._get_file_path(v)
            )
            continue
        
        seen_violations.add(violation_key)
        
        # Map enforcer Violation to report Violation
        report_violation = Violation(
            id=self._generate_violation_id(v),
            severity=self._map_severity(v),
            file=self._get_file_path(v),
            rule_ref=self._get_rule_ref(v),
            description=self._get_description(v),
            evidence=self._get_evidence(v),
            fix_hint=self._get_fix_hint(v),
            session_scope=self._get_session_scope(v)
        )
        report.add_violation(report_violation)
```

**Testing:**
1. Run enforcer multiple times with different scopes
2. Verify `ENFORCER_REPORT.json` doesn't contain duplicate violations
3. Verify each file/line/rule combination appears only once

#### Step 4: Add Logging for Debugging

**File:** `.cursor/scripts/auto-enforcer.py`

**Location:** `check_hardcoded_dates()` method, defensive check (lines 2308-2323)

**Change:**
Add more detailed logging:

```python
# Defensive check: Skip historical document directories early
file_path_str_normalized = str(file_path).replace("\\", "/").lower()
historical_dir_patterns = [
    "/docs/auto-pr/", "/docs/archive/", "/docs/historical/",  # Absolute paths
    "docs/auto-pr/", "docs/archive/", "docs/historical/"      # Relative paths
]
matched_pattern = None
for pattern in historical_dir_patterns:
    if pattern in file_path_str_normalized:
        matched_pattern = pattern
        break

if matched_pattern:
    logger.info(  # Changed from debug to info for visibility
        f"Skipping historical document directory in date checker: {file_path_str}",
        operation="check_hardcoded_dates",
        file_path=file_path_str,
        normalized_path=file_path_str_normalized,
        matched_pattern=matched_pattern,
        reason="historical_document_directory"
    )
    continue
```

**Testing:**
1. Run enforcer with `--scope current_session`
2. Check logs for "Skipping historical document directory" messages
3. Verify Auto-PR files are logged as skipped

---

## Section 6 — Testing Instructions

### Test 1: Verify Auto-PR Files Are Skipped

**Steps:**
1. Run: `python .cursor/scripts/auto-enforcer.py --scope current_session --user-message "Test Auto-PR skip"`
2. Check `ENFORCER_STATUS.md`: Should show `APPROVED` or `APPROVED_WITH_BASELINE_ISSUES` (not `REJECTED`)
3. Check `ACTIVE_VIOLATIONS.md`: Should show no Auto-PR files in "Current Session Violations"
4. Check `ENFORCER_REPORT.json`: Search for `"docs/Auto-PR"` or `"docs/auto-pr"` - should only appear with `"session_scope": "historical"` (if at all)

**Expected Result:** Auto-PR files are completely skipped or marked as historical.

### Test 2: Verify File Modification Detection

**Steps:**
1. Create a test file: `test_date_file.md` with content `Last Updated: 2025-12-01`
2. Run: `python .cursor/scripts/auto-enforcer.py --scope current_session --user-message "Test file modification"`
3. Verify: File is detected and violation created
4. Touch the file (update timestamp) without changing content
5. Run enforcer again
6. Verify: File is **not** detected as modified (no new violations)

**Expected Result:** Only actual content changes trigger violations.

### Test 3: Verify Deduplication

**Steps:**
1. Run: `python .cursor/scripts/auto-enforcer.py --scope full --user-message "Test full scan"`
2. Note violation count in `ENFORCER_REPORT.json`
3. Run again: `python .cursor/scripts/auto-enforcer.py --scope current_session --user-message "Test current session"`
4. Check `ENFORCER_REPORT.json`: Should not contain duplicate violations (same file/line/rule)

**Expected Result:** No duplicate violations in report.

### Test 4: Verify Historical Files in Full Scan

**Steps:**
1. Run: `python .cursor/scripts/auto-enforcer.py --scope full --user-message "Test full scan with Auto-PR"`
2. Check `ENFORCER_REPORT.json`: Auto-PR violations should have `"session_scope": "historical"`
3. Check `ACTIVE_VIOLATIONS.md`: Auto-PR violations should appear in "Historical Violations (Baseline)" section
4. Check `ENFORCER_STATUS.md`: Should show `APPROVED_WITH_BASELINE_ISSUES` (not `REJECTED`)

**Expected Result:** Auto-PR violations are marked as historical and don't block.

---

## Section 7 — Implementation Checklist for Execution Brain

### Checklist

1. **Quick Fix — Pre-Filter Historical Files (Option D):**
   - [ ] Add pre-filter logic in `check_hardcoded_dates()` after line 2255
   - [ ] Filter out files matching `docs/auto-pr/`, `docs/archive/`, `docs/historical/` patterns
   - [ ] Add logging for filtered files
   - [ ] Test with `--scope current_session` to verify Auto-PR files are skipped

2. **Improve File Modification Detection (Option B):**
   - [ ] Modify `is_file_modified_in_session()` first-check logic (lines 1533-1546)
   - [ ] Use `git diff --numstat` to detect actual content changes
   - [ ] Return `False` if git diff shows no changes (metadata-only)
   - [ ] Test with touched files (timestamp change, no content change)

3. **Add Violation Deduplication (Option C):**
   - [ ] Add deduplication logic in `generate_report_from_enforcer()` (two_brain_integration.py)
   - [ ] Use `(file, line_number, rule_ref)` as unique key
   - [ ] Skip duplicate violations before adding to report
   - [ ] Test with multiple enforcer runs to verify no duplicates

4. **Add Enhanced Logging:**
   - [ ] Change defensive check logging from `debug` to `info` level
   - [ ] Add `normalized_path` and `matched_pattern` to log output
   - [ ] Verify logs show Auto-PR files being skipped

5. **Regression Testing:**
   - [ ] Run enforcer with `--scope current_session` on modified code file with old date
   - [ ] Verify it's still BLOCKING and marked as `current_session`
   - [ ] Run enforcer with `--scope full`
   - [ ] Verify `docs/Auto-PR/*.md` violations are marked as `historical`
   - [ ] Verify `docs/Auto-PR/*.md` files don't appear in "Current Session Violations"
   - [ ] Verify `ENFORCER_STATUS.md` shows `APPROVED` when only historical violations exist

6. **Documentation:**
   - [ ] Update `DATE_VIOLATION_ANALYSIS.md` with findings (this file)
   - [ ] Add note about historical directory filtering in code comments
   - [ ] Document deduplication logic in `two_brain_integration.py`



---

New risk detected (post-implementation run): There is evidence that some legitimate non-historical violations are no longer being reported (enforcer returning 0 violations when test violations are known to exist). Execution Brain MUST:

Confirm whether non-historical files with deliberate hardcoded dates still trigger violations.

Treat any false negatives as Critical regressions.


## Summary

**Root Cause:** Auto-PR files are being processed because:
1. They may be incorrectly detected as "modified" (metadata changes, not content changes)
2. The defensive historical check may have edge cases (path normalization)
3. Violations may be duplicated when re-evaluated

**Recommended Fix:** Implement Option C (Hybrid Approach) with Option D as a quick fix:
1. **Pre-filter historical files** in `check_hardcoded_dates()` to prevent processing
2. **Improve file modification detection** to use git diff for first-check accuracy
3. **Add violation deduplication** to prevent duplicate entries

**Expected Outcome:** Auto-PR files are completely skipped or marked as historical, and they never appear in "Current Session Violations".

---

**— END ANALYSIS BRAIN. Execution Brain DO NOT ACT until approved.**
