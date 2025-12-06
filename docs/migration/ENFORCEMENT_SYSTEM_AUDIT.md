# ENFORCEMENT SYSTEM AUDIT — Date False Positives Analysis

**Phase:** 0.5  
**Type:** Analysis & Design  
**Status:** COMPLETE  
**Created:** 2025-12-05  
**Author:** Analysis Brain (AB)

---

## 1. Enforcement Pipeline Overview

### System Architecture

The VeroField enforcement system is a multi-layer architecture:

**Core Components:**
- **Main Script:** `.cursor/scripts/auto-enforcer.py` (2510 lines) — orchestrates all checks
- **Rule Files:** `.ai/rules/*.mdc` — rule definitions (e.g., `02-core.mdc` defines date rules)
- **Enforcement Module:** `enforcement/` directory — modular checkers and utilities
- **CI Integration:** None currently (no `.github/workflows/` found)

**Key Modules:**
- `enforcement/core/git_utils.py` — Git operations (changed files, diffs, timestamps)
- `enforcement/core/file_scanner.py` — File modification detection
- `enforcement/core/scope_evaluator.py` — Historical/doc classification
- `enforcement/checks/date_checker.py` — Date violation detection
- `enforcement/date_detector.py` — Date pattern matching and classification

### Changed Files Detection Flow

**Current Implementation:**
1. `get_changed_files_impl()` in `git_utils.py`:
   - Uses `git diff --cached --name-only` (staged)
   - Uses `git diff --name-only` (unstaged)
   - Optionally includes untracked via `ls-files --others`
   - **Problem:** Returns ALL files with ANY git changes, regardless of WHEN changes occurred

2. `is_file_modified_in_session()` in `file_scanner.py`:
   - Checks file mtime vs session start time
   - Checks if file is in changed_files list
   - Compares content hash to detect actual changes
   - **Problem:** For tracked files, relies on `git diff` which doesn't indicate WHEN diff was created

3. `check_hardcoded_dates()` in `date_checker.py`:
   - Filters files using `is_file_modified_in_session()`
   - Scans file content for date patterns
   - Checks if dates match current date
   - **Problem:** If `is_file_modified_in_session()` returns True for old changes, dates get flagged

### Date/Freshness Logic Location

**Primary Location:** `enforcement/checks/date_checker.py`
- Main entry: `DateChecker.check_hardcoded_dates()`
- Uses `DateDetector` from `enforcement/date_detector.py` for pattern matching
- Uses `is_file_modified_in_session()` to filter files
- Uses `is_line_changed_in_session()` to filter lines

**Supporting Logic:**
- `enforcement/core/git_utils.py::get_file_last_modified_time()` — gets modification timestamp
- `enforcement/core/git_utils.py::is_line_changed_in_session()` — checks if specific line changed
- `enforcement/core/scope_evaluator.py` — classifies historical docs

**Rule Definition:**
- `.ai/rules/02-core.mdc` — defines date rules (must use current date, update "Last Updated")

### Historical/Exempt Classification

**Current Mechanisms:**
1. **Path-based:** `is_historical_dir_path()` checks for:
   - `docs/auto-pr/`
   - `docs/archive/`
   - `docs/historical/`

2. **Filename-based:** `is_historical_document_file()` checks for:
   - Date patterns in filename (e.g., `document_2025-12-05.md`)
   - Historical prefixes (`document_`, `report_`, `entry_`, etc.)

3. **Content-based:** `DocumentContext` class checks:
   - First 15 lines for historical markers
   - Log file detection (BUG_LOG.md, memory-bank files)

**Problem:** No front-matter flag support, no central config file for exemptions.

---

## 2. Date & Freshness Rules Inventory

| Location | What It Enforces | Violation Condition | Target Files | Scope |
|----------|------------------|---------------------|--------------|-------|
| `enforcement/checks/date_checker.py::check_hardcoded_dates()` | "Last Updated" fields must match current date | File modified AND "Last Updated" != current date | All changed files (filtered by `is_file_modified_in_session()`) | Changed files only |
| `enforcement/checks/date_checker.py::check_hardcoded_dates()` | No hardcoded dates in modified lines | Line modified AND date pattern found AND date != current date | All changed files | Changed lines only |
| `enforcement/date_detector.py::DateDetector.classify_date()` | Dates must be classified correctly | Date classified as CURRENT but != current date | All files scanned | File-level |
| `.ai/rules/02-core.mdc` | Rule definition: "ALWAYS use current date for 'Last Updated' fields" | N/A (rule definition) | All documentation files | Repo-wide (rule) |
| `enforcement/core/git_utils.py::is_line_changed_in_session()` | Only check dates in lines actually changed | Line not in git diff | All changed files | Changed lines only |

**Key Observations:**
- **Scope:** Enforcement is supposed to be "changed files only" and "changed lines only"
- **Problem:** `is_file_modified_in_session()` can return True for files modified before session start
- **Problem:** `is_line_changed_in_session()` checks mtime but doesn't verify diff was created in current session

---

## 3. Root Cause Analysis

### (A) Unmodified Files Flagged

**Symptom:** Files that were not modified in the current session are flagged for date violations.

**Root Cause:**
1. `get_changed_files_impl()` uses `git diff --name-only` which returns ALL files with ANY uncommitted changes, regardless of when those changes were made.
2. `is_file_modified_in_session()` for tracked files:
   - Checks if file is in `changed_files` list (✅ correct)
   - Checks file mtime >= session_start (✅ correct for untracked)
   - **BUT:** For tracked files with unstaged changes, uses `git diff --numstat` which doesn't indicate WHEN the diff was created
   - If file was modified yesterday but not committed, it still shows up as "modified"

**Concrete Example:**
```
Session starts: 2025-12-05 10:00:00
File modified: 2025-12-05 15:00:00 (yesterday, not committed)
git diff shows: file has unstaged changes
is_file_modified_in_session() checks:
  - File in changed_files? ✅ Yes
  - File mtime? 2025-12-05 15:00:00 (before session start)
  - But: For tracked files, code path doesn't always check mtime correctly
  - Result: Returns True (incorrectly)
```

**Proposed Fix:**
- Ensure `is_file_modified_in_session()` ALWAYS checks `get_file_last_modified_time()` for tracked files
- Compare modification time to session start time
- Only return True if modification_time >= session_start

### (B) Historical Docs Flagged

**Symptom:** Historical documents (e.g., old reports, RFCs, archived docs) are flagged even though they should be exempt.

**Root Cause:**
1. **Path-based exemption works** — `is_historical_dir_path()` correctly skips `docs/auto-pr/`, `docs/archive/`, etc.
2. **Filename-based exemption works** — `is_historical_document_file()` correctly detects date patterns in filenames
3. **BUT:** Files in other locations with historical content are not exempt:
   - Files in `docs/` (not in `docs/auto-pr/`) with historical dates
   - Files with front-matter like `historical: true` are not recognized
   - Files moved from historical directories lose exemption

**Concrete Example:**
```
File: docs/migration/PHASE_0.5_EXECUTION_CONTRACT.md
Content: "Created: 2025-12-03" (historical date, file created yesterday)
Path: docs/migration/ (not in historical dir patterns)
Result: File flagged if modified, even though date is historical
```

**Proposed Fix:**
1. Add front-matter parsing to detect `historical: true` or `enforcement: { freshness: skip }`
2. Expand historical directory patterns (or make configurable)
3. Add content-based detection: if file contains "Created:" or "Date:" with old date in header, treat as historical

### (C) Moved/Renamed But Unchanged Files Flagged

**Symptom:** Files that are only moved/renamed (content identical) are flagged for date violations.

**Root Cause:**
1. **For tracked files:** Git doesn't distinguish move vs modify in `git diff --name-only`
   - Both show up as "changed"
   - `is_file_modified_in_session()` checks `git diff --numstat` which shows changes even for pure moves
2. **For untracked files (new location):**
   - File appears as untracked
   - `is_file_modified_in_session()` checks mtime >= session_start
   - **Problem:** On Windows, moving files updates mtime even if content unchanged
   - Code has heuristic (`find_files_with_hash()`) but it's not always reliable

**Concrete Example:**
```
Original: docs/old-location/file.md (tracked)
Moved to: docs/new-location/file.md (untracked at new location)
Content: Identical (hash matches)
Windows behavior: mtime updated to move time
is_file_modified_in_session() checks:
  - File untracked? ✅ Yes
  - mtime >= session_start? ✅ Yes (updated by move)
  - Hash matches existing file? ✅ Yes (but check happens late)
  - Result: May still return True (incorrectly)
```

**Proposed Fix:**
1. Use `git diff --name-status` to detect renames (status codes: `R`, `M`, `A`, `D`)
2. For files with status `R` (rename), check if content hash matches
3. If hash matches, classify as `MOVED_OR_RENAMED_ONLY` (exempt from date checks)
4. For untracked files, check hash BEFORE checking mtime

---

## 4. Target Semantics & Invariants

### Change Classification Layer

**Classification System:**

```python
class FileChangeType(Enum):
    UNTOUCHED = "untouched"  # Not in diff
    CONTENT_CHANGED = "content_changed"  # Modified lines/content
    MOVED_OR_RENAMED_ONLY = "moved_or_renamed_only"  # Same content, new path
    NEW_FILE = "new_file"  # New file (not in git)
    DELETED = "deleted"  # File deleted
    GENERATED = "generated"  # Auto-generated (exempt)
    THIRD_PARTY = "third_party"  # Third-party code (exempt)
    HISTORICAL = "historical"  # Historical doc (exempt)
```

**Derivation from Git:**

1. **Use `git diff --name-status` instead of `--name-only`:**
   - `A` = Added (NEW_FILE)
   - `D` = Deleted (DELETED)
   - `M` = Modified (CONTENT_CHANGED)
   - `R` = Renamed (MOVED_OR_RENAMED_ONLY if content hash matches)
   - `C` = Copied (treat as NEW_FILE)

2. **For `R` (rename):**
   - Extract old path and new path from git output
   - Compare content hash of new path to old path (from HEAD)
   - If hash matches → `MOVED_OR_RENAMED_ONLY`
   - If hash differs → `CONTENT_CHANGED`

3. **For untracked files:**
   - Check if content hash matches any tracked file (using `find_files_with_hash()`)
   - If match → `MOVED_OR_RENAMED_ONLY`
   - If no match → `NEW_FILE`

**Eligibility for Date/Freshness Checks:**
- ✅ `CONTENT_CHANGED` — Check dates
- ✅ `NEW_FILE` — Check dates
- ❌ `MOVED_OR_RENAMED_ONLY` — Skip date checks
- ❌ `UNTOUCHED` — Skip (not in diff)
- ❌ `DELETED` — Skip
- ❌ `GENERATED` — Skip
- ❌ `THIRD_PARTY` — Skip
- ❌ `HISTORICAL` — Skip

### Historical / Archival Classification

**Mechanisms (in priority order):**

1. **Path Patterns (existing, expandable):**
   - `docs/auto-pr/**`
   - `docs/archive/**`
   - `docs/historical/**`
   - `docs/migration/**` (if contains historical docs)
   - Configurable via `enforcement/config/historical_paths.json`

2. **Front-Matter Flag:**
   ```markdown
   ---
   historical: true
   ---
   ```
   OR
   ```markdown
   ---
   enforcement:
     freshness: skip
   ---
   ```

3. **Central Config File:**
   - `enforcement/config/exemptions.json`:
   ```json
   {
     "historical_paths": [
       "docs/auto-pr/**",
       "docs/archive/**"
     ],
     "historical_files": [
       "docs/migration/PHASE_0.5_EXECUTION_CONTRACT.md"
     ],
     "historical_patterns": [
       "**/*_BACKUP_*.md",
       "**/*_backup_*.md"
     ]
   }
   ```

4. **Content-Based Detection:**
   - If file header contains "Created:" or "Date:" with date > 30 days old
   - AND file hasn't been modified recently
   - Treat as historical

### Rule-Level Invariants

**Invariant 1: Date/Freshness Rules Scope**
- **MUST:** Date/freshness rules ONLY run on `CONTENT_CHANGED` or `NEW_FILE`
- **MUST NOT:** Run on `MOVED_OR_RENAMED_ONLY`, `UNTOUCHED`, `DELETED`, `GENERATED`, `THIRD_PARTY`, `HISTORICAL`

**Invariant 2: Historical Docs Exemption**
- **MUST:** Historical docs (by path, front-matter, or config) NEVER produce freshness violations
- **MUST NOT:** Check dates in historical docs, even if file is modified (dates are historical records)

**Invariant 3: Pure Move/Rename Exemption**
- **MUST:** Pure move/rename (`MOVED_OR_RENAMED_ONLY`) NEVER require date updates
- **MUST NOT:** Flag moved files for date violations

**Invariant 4: Session-Based Enforcement**
- **MUST:** Only check files modified AFTER session start time
- **MUST NOT:** Check files modified before session start (even if they have uncommitted changes)

**Invariant 5: Line-Level Granularity**
- **MUST:** Only check dates in lines that were actually changed (in git diff)
- **MUST NOT:** Check dates in unchanged lines, even if file was modified

---

## EXECUTION_CONTRACT

### Overview

This contract defines the concrete steps to fix date-related false positives in the enforcement system. The Execution Brain (EB) must implement these changes in the specified order.

### Prerequisites

- Python 3.8+
- Git installed and accessible
- Existing enforcement system codebase
- Test files for validation

---

### STEP 1: Create File Change Classification Module

**File:** `enforcement/core/file_classifier.py` (NEW)

**Purpose:** Centralized file change classification system.

**Implementation:**
1. Create new file `enforcement/core/file_classifier.py`
2. Define `FileChangeType` enum (as specified in Section 4)
3. Implement `classify_file_change()` function:
   ```python
   def classify_file_change(
       file_path: str,
       project_root: Path,
       git_utils: GitUtils,
       session: EnforcementSession
   ) -> FileChangeType:
       """
       Classify file change type using git diff --name-status.
       
       Returns:
           FileChangeType enum value
       """
       # Use git diff --name-status to get status codes
       # Check for R (rename), M (modified), A (added), D (deleted)
       # For R: compare content hash to determine if content changed
       # For untracked: check hash against git history
   ```
4. Import and use in `file_scanner.py` and `date_checker.py`

**Dependencies:** None (foundational)

---

### STEP 2: Update Git Utils to Support Rename Detection

**File:** `enforcement/core/git_utils.py`

**Changes:**
1. Add method `get_file_change_status()`:
   ```python
   def get_file_change_status(self, file_path: str) -> Optional[str]:
       """
       Get git status code for file (A, D, M, R, etc.).
       
       Uses: git diff --name-status HEAD
       Returns: Status code or None
       """
   ```
2. Update `get_changed_files_impl()` to optionally return status codes:
   ```python
   def get_changed_files_impl(
       project_root: Path,
       include_untracked: bool = False,
       with_status: bool = False
   ) -> List[str] | Dict[str, str]:
       """
       If with_status=True, returns Dict[file_path, status_code]
       """
   ```
3. Add method `get_rename_source()` for renamed files:
   ```python
   def get_rename_source(self, file_path: str) -> Optional[str]:
       """
       For renamed files, get original path.
       
       Uses: git diff --name-status --find-renames
       Returns: Original path or None
       """
   ```

**Dependencies:** STEP 1 (file_classifier will use these methods)

---

### STEP 3: Fix `is_file_modified_in_session()` to Always Check Timestamps

**File:** `enforcement/core/file_scanner.py`

**Changes:**
1. Update `is_file_modified_in_session()` to ALWAYS check `get_file_last_modified_time()`:
   ```python
   def is_file_modified_in_session(...) -> bool:
       # FIRST: Check modification time (MANDATORY)
       last_modified = git_utils.get_file_last_modified_time(file_path)
       if not last_modified:
           return False  # Can't determine, skip (conservative)
       
       session_start = datetime.fromisoformat(session.start_time.replace('Z', '+00:00'))
       if last_modified < session_start:
           return False  # Modified before session, skip
       
       # THEN: Check if file has actual content changes
       # (existing logic)
   ```
2. Ensure tracked files use git log commit time (not just mtime)
3. Ensure untracked files use mtime but also check hash for moves

**Dependencies:** STEP 2 (uses `get_file_last_modified_time()`)

---

### STEP 4: Update Date Checker to Use File Classification

**File:** `enforcement/checks/date_checker.py`

**Changes:**
1. Import `FileChangeType` and `classify_file_change()` from `file_classifier.py`
2. Update `check_hardcoded_dates()`:
   ```python
   for file_path_str in changed_files:
       # Classify file change type
       change_type = classify_file_change(
           file_path_str,
           project_root,
           git_utils,
           session
       )
       
       # Skip if not eligible for date checks
       if change_type in [
           FileChangeType.MOVED_OR_RENAMED_ONLY,
           FileChangeType.UNTOUCHED,
           FileChangeType.DELETED,
           FileChangeType.GENERATED,
           FileChangeType.THIRD_PARTY,
           FileChangeType.HISTORICAL
       ]:
           continue  # Skip date checks
       
       # Only check CONTENT_CHANGED and NEW_FILE
       if change_type not in [FileChangeType.CONTENT_CHANGED, FileChangeType.NEW_FILE]:
           continue
   ```
3. Preserve existing historical doc filtering (path-based, filename-based)

**Dependencies:** STEP 1, STEP 3

---

### STEP 5: Add Front-Matter Parsing for Historical Flag

**File:** `enforcement/core/scope_evaluator.py`

**Changes:**
1. Add function `is_historical_by_frontmatter()`:
   ```python
   def is_historical_by_frontmatter(file_path: Path) -> bool:
       """
       Check if file has historical: true in front-matter.
       
       Supports:
       - historical: true
       - enforcement: { freshness: skip }
       """
       # Parse YAML front-matter (first --- block)
       # Check for historical flag
   ```
2. Update `is_historical_document_file()` to call this function
3. Add to `DocumentContext` class in `date_detector.py`

**Dependencies:** None (can be done in parallel)

---

### STEP 6: Create Exemptions Config File

**File:** `enforcement/config/exemptions.json` (NEW)

**Purpose:** Centralized configuration for historical/exempt paths.

**Implementation:**
1. Create `enforcement/config/` directory if missing
2. Create `exemptions.json`:
   ```json
   {
     "historical_paths": [
       "docs/auto-pr/**",
       "docs/archive/**",
       "docs/historical/**"
     ],
     "historical_files": [],
     "historical_patterns": [
       "**/*_BACKUP_*.md",
       "**/*_backup_*.md",
       "**/*_HISTORICAL_*.md"
     ]
   }
   ```
3. Add config loader in `scope_evaluator.py`:
   ```python
   def load_exemptions_config() -> Dict:
       """Load exemptions.json and return config dict."""
   ```
4. Update `is_historical_dir_path()` to use config file patterns

**Dependencies:** None (can be done in parallel)

---

### STEP 7: Update `is_line_changed_in_session()` to Verify Session Timing

**File:** `enforcement/core/git_utils.py`

**Changes:**
1. Ensure `is_line_changed_in_session()` checks file modification time FIRST:
   ```python
   def is_line_changed_in_session(...) -> bool:
       # FIRST: Check if file was modified after session start
       last_modified = self.get_file_last_modified_time(file_path)
       if last_modified and last_modified < session_start:
           return False  # File modified before session
       
       # THEN: Check if line is in diff
       # (existing logic)
   ```
2. This ensures lines in old diffs are not flagged

**Dependencies:** STEP 2 (uses `get_file_last_modified_time()`)

---

### STEP 8: Add Unit Tests for File Classification

**File:** `enforcement/tests/test_file_classifier.py` (NEW)

**Implementation:**
1. Test `classify_file_change()` for each change type:
   - `CONTENT_CHANGED` — file with actual content diff
   - `MOVED_OR_RENAMED_ONLY` — file renamed, hash matches
   - `NEW_FILE` — untracked file, hash doesn't match
   - `DELETED` — file deleted
   - `HISTORICAL` — file in historical directory
2. Mock git commands to simulate different scenarios

**Dependencies:** STEP 1

---

### STEP 9: Add Integration Tests for Date Checker

**File:** `enforcement/tests/test_date_checker_false_positives.py` (NEW)

**Implementation:**
1. Test scenarios from Section 3:
   - Unmodified file (should not flag)
   - Historical doc (should not flag)
   - Moved file (should not flag)
   - Modified file with stale date (should flag)
   - Modified file with current date (should not flag)
2. Use temporary git repo for testing

**Dependencies:** STEP 4

---

### STEP 10: Update Documentation

**Files:**
- `enforcement/README.md` (or create if missing)
- `docs/enforcement/DATE_VIOLATION_FIX_SUMMARY.md` (update)

**Changes:**
1. Document new file classification system
2. Document exemptions config file
3. Document front-matter flags
4. Update troubleshooting guide

**Dependencies:** All previous steps

---

## TEST_PLAN

### Test Environment Setup

**Prerequisites:**
- Python 3.8+
- Git installed
- Temporary test directory with git repo

**Setup Script:**
```bash
# Create test repo
mkdir test_enforcement
cd test_enforcement
git init
git config user.name "Test User"
git config user.email "test@example.com"
```

---

### Test Scenario 1: Unmodified File (Should NOT Flag)

**Objective:** Verify files modified before session start are not flagged.

**Steps:**
1. Create test file: `test_file.md` with content:
   ```markdown
   # Test File
   Last Updated: 2025-12-05
   ```
2. Commit file: `git add test_file.md && git commit -m "Add test file"`
3. Wait 1 minute (or manually set system time back)
4. Start new enforcement session
5. **DO NOT modify test_file.md**
6. Run enforcer: `python .cursor/scripts/auto-enforcer.py --scope current_session`
7. **Expected:** No violations for `test_file.md`

**Command:**
```bash
cd test_enforcement
python .cursor/scripts/auto-enforcer.py --scope current_session --user-message "Test unmodified file"
```

**Success Criteria:**
- ✅ No violations for `test_file.md`
- ✅ `is_file_modified_in_session()` returns `False`
- ✅ Date checker skips file

---

### Test Scenario 2: Historical Doc (Should NOT Flag)

**Objective:** Verify historical documents are exempt from date checks.

**Steps:**
1. Create historical doc: `docs/archive/old_report.md`:
   ```markdown
   # Old Report
   Created: 2025-11-01
   Last Updated: 2025-11-01
   ```
2. Commit file
3. Modify file (add new line)
4. Run enforcer
5. **Expected:** No violations (file is historical)

**Command:**
```bash
python .cursor/scripts/auto-enforcer.py --scope current_session --user-message "Test historical doc"
```

**Success Criteria:**
- ✅ No violations for `docs/archive/old_report.md`
- ✅ `is_historical_dir_path()` returns `True`
- ✅ Date checker skips file

**Variations:**
- Test with front-matter flag: `historical: true`
- Test with filename pattern: `report_2025-11-01.md`
- Test with config file exemption

---

### Test Scenario 3: Moved File (Should NOT Flag)

**Objective:** Verify pure move/rename operations don't trigger date violations.

**Steps:**
1. Create file: `old_location/file.md`:
   ```markdown
   # File
   Last Updated: 2025-12-05
   ```
2. Commit file
3. Move file: `git mv old_location/file.md new_location/file.md`
4. Run enforcer
5. **Expected:** No violations (file was moved, not modified)

**Command:**
```bash
git mv old_location/file.md new_location/file.md
python .cursor/scripts/auto-enforcer.py --scope current_session --user-message "Test moved file"
```

**Success Criteria:**
- ✅ No violations for `new_location/file.md`
- ✅ `classify_file_change()` returns `MOVED_OR_RENAMED_ONLY`
- ✅ Date checker skips file

**Variations:**
- Test with content hash matching
- Test with `git diff --name-status` showing `R` status

---

### Test Scenario 4: Modified File with Stale Date (Should Flag)

**Objective:** Verify files actually modified in session are flagged if date is stale.

**Steps:**
1. Create file: `active_file.md`:
   ```markdown
   # Active File
   Last Updated: 2025-12-05
   ```
2. Commit file
3. Start new enforcement session
4. Modify file (add new line, change content)
5. **DO NOT update "Last Updated" date**
6. Run enforcer
7. **Expected:** Violation flagged for stale date

**Command:**
```bash
# Modify file
echo "New content" >> active_file.md
python .cursor/scripts/auto-enforcer.py --scope current_session --user-message "Test stale date"
```

**Success Criteria:**
- ✅ Violation flagged for `active_file.md`
- ✅ `is_file_modified_in_session()` returns `True`
- ✅ `is_line_changed_in_session()` returns `True` for "Last Updated" line
- ✅ Violation message indicates date should be updated

---

### Test Scenario 5: Modified File with Current Date (Should NOT Flag)

**Objective:** Verify files with current date are not flagged.

**Steps:**
1. Create file: `active_file.md`:
   ```markdown
   # Active File
   Last Updated: 2025-12-05
   ```
2. Commit file
3. Start new enforcement session (on 2025-12-05)
4. Modify file (add new line)
5. Update "Last Updated" to current date (2025-12-05)
6. Run enforcer
7. **Expected:** No violations

**Command:**
```bash
# Update date to current
sed -i 's/Last Updated: .*/Last Updated: 2025-12-05/' active_file.md
python .cursor/scripts/auto-enforcer.py --scope current_session --user-message "Test current date"
```

**Success Criteria:**
- ✅ No violations for `active_file.md`
- ✅ Date matches current system date
- ✅ Date checker passes

---

### Test Scenario 6: Line-Level Granularity (Should Only Flag Changed Lines)

**Objective:** Verify only changed lines are checked, not entire file.

**Steps:**
1. Create file: `test_file.md`:
   ```markdown
   # Test File
   Last Updated: 2025-12-05
   
   ## Section 1
   Created: 2025-11-01
   
   ## Section 2
   Some content here.
   ```
2. Commit file
3. Modify only "Section 2" (change "Some content here" to "Updated content")
4. **DO NOT modify "Created: 2025-11-01" line**
5. Run enforcer
6. **Expected:** No violation for "Created: 2025-11-01" (line not changed)

**Command:**
```bash
# Modify only Section 2
sed -i 's/Some content here/Updated content/' test_file.md
python .cursor/scripts/auto-enforcer.py --scope current_session --user-message "Test line granularity"
```

**Success Criteria:**
- ✅ No violation for "Created: 2025-11-01" line
- ✅ `is_line_changed_in_session()` returns `False` for that line
- ✅ Only modified lines are checked

---

### Test Scenario 7: Front-Matter Historical Flag

**Objective:** Verify front-matter `historical: true` flag works.

**Steps:**
1. Create file: `docs/test_historical.md`:
   ```markdown
   ---
   historical: true
   ---
   # Historical Doc
   Created: 2025-11-01
   ```
2. Commit file
3. Modify file (add new line)
4. Run enforcer
5. **Expected:** No violations (file marked as historical)

**Command:**
```bash
python .cursor/scripts/auto-enforcer.py --scope current_session --user-message "Test front-matter flag"
```

**Success Criteria:**
- ✅ No violations for `docs/test_historical.md`
- ✅ `is_historical_by_frontmatter()` returns `True`
- ✅ Date checker skips file

---

### Test Scenario 8: Config File Exemptions

**Objective:** Verify exemptions config file works.

**Steps:**
1. Create `enforcement/config/exemptions.json`:
   ```json
   {
     "historical_files": ["docs/test_exempt.md"]
   }
   ```
2. Create file: `docs/test_exempt.md`:
   ```markdown
   # Exempt File
   Created: 2025-11-01
   ```
3. Commit both files
4. Modify `docs/test_exempt.md`
5. Run enforcer
6. **Expected:** No violations (file in exemptions config)

**Command:**
```bash
python .cursor/scripts/auto-enforcer.py --scope current_session --user-message "Test config exemptions"
```

**Success Criteria:**
- ✅ No violations for `docs/test_exempt.md`
- ✅ Config file is loaded correctly
- ✅ File is exempted from date checks

---

### Test Execution Commands

**Run All Tests:**
```bash
# Unit tests
pytest enforcement/tests/test_file_classifier.py -v
pytest enforcement/tests/test_date_checker_false_positives.py -v

# Integration test (manual)
cd test_enforcement
# Follow test scenarios above
```

**Run Specific Test:**
```bash
pytest enforcement/tests/test_file_classifier.py::test_classify_moved_file -v
```

---

### Success Criteria Summary

All tests must pass:
- ✅ Unmodified files: No violations
- ✅ Historical docs: No violations (by path, front-matter, or config)
- ✅ Moved files: No violations
- ✅ Modified files with stale dates: Violations flagged
- ✅ Modified files with current dates: No violations
- ✅ Line-level granularity: Only changed lines checked
- ✅ Front-matter flags: Recognized and respected
- ✅ Config exemptions: Loaded and applied

---

**End of EXECUTION_CONTRACT and TEST_PLAN**










