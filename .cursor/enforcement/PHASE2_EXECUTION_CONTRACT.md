# Phase 2 Execution Contract — Extract Git & Filesystem Utilities

**Analysis Brain (AB) Report**  
**Target Phase:** Phase 2 — Extract Git & Filesystem Utilities  
**Date:** 2025-12-03  
**Status:** Ready for Execution Brain

---

## 1. SUMMARY

- Extract `_run_git_command_cached()` module-level function and `run_git_command()` method to `core/git_utils.py` as `GitUtils` class or module functions
- Extract `get_changed_files()`, `_get_changed_files_impl()`, and `_get_git_state_key()` to `core/git_utils.py`
- Extract `get_file_diff()` to `core/git_utils.py` with caching support
- Extract `get_file_last_modified_time()` to `core/git_utils.py`
- Extract `is_line_changed_in_session()` to `core/git_utils.py` (accepts `session_start` as parameter, not full session)
- Extract `_has_actual_content_changes()` to `core/git_utils.py`
- Update `auto-enforcer.py` to use `GitUtils` class or module functions
- Preserve all caching behavior (LRU cache for git commands, manual memoization for changed files and diffs)
- Ensure all git operations work identically (no behavior change)

---

## 2. RISKS & INVARIANTS

### Invariants That Apply to Phase 2:

- **Invariant 7: No Major Runtime Regression** — Git command caching must be preserved. LRU cache for `_run_git_command_cached()` must work identically. Manual memoization for changed files and diffs must be preserved.
- **Invariant 8: Git Interactions Remain Bounded** — Git command count must not increase. Caching must prevent duplicate git calls. Cache invalidation logic must work correctly.
- **Invariant 9: CLI Entrypoint Unchanged** — All git operations must work identically. Changed files detection must be accurate.

### Behavior That Must Not Change:

- Git command execution with 10-second timeout and error handling
- LRU cache behavior for `_run_git_command_cached()` (maxsize=256)
- Changed files detection logic (staged + unstaged, with `--ignore-cr-at-eol`, `--ignore-all-space`, `--ignore-blank-lines`)
- Changed files caching (manual memoization with git state key invalidation)
- File diff computation (staged + unstaged combined, None for untracked files)
- File diff caching (manual memoization, cleared on git state change)
- File modification time detection (commit time for tracked files, file system time for untracked, whitespace change detection)
- Line change detection (diff parsing for tracked files, file mtime comparison for untracked files)
- Content change detection (whitespace-ignored diff analysis)

---

## 3. EXECUTION_CONTRACT

### 1:
FILE: .cursor/scripts/auto-enforcer.py  
TARGET: _run_git_command_cached module-level function (lines 195-232)  
ACTION: Extract to `.cursor/enforcement/core/git_utils.py` as module-level function `run_git_command_cached(project_root: str, command_tuple: tuple) -> str`. Preserve exact implementation: `@lru_cache(maxsize=256)` decorator, subprocess.run logic, timeout=10, error handling, logger.warn calls. Import required dependencies: `subprocess`, `Path`, `logger`, `lru_cache` from `functools`.  
NOTES: Function must remain module-level (not class method) to preserve LRU cache behavior. Cache key must use hashable tuple. Error handling must preserve exact behavior (return empty string on failure, log warnings).

### 2:
FILE: .cursor/scripts/auto-enforcer.py  
TARGET: run_git_command method (lines 947-959)  
ACTION: Extract to `.cursor/enforcement/core/git_utils.py` as module-level function `run_git_command(project_root: Path, args: List[str]) -> str`. Convert to call `run_git_command_cached()` with tuple conversion. Preserve exact logic: `command_tuple = tuple(args)`, `project_root_str = str(project_root)`.  
NOTES: Function signature changes from `self.run_git_command(args)` to `run_git_command(project_root, args)`. This is acceptable as it's a pure extraction - callers will be updated in step 9.

### 3:
FILE: .cursor/scripts/auto-enforcer.py  
TARGET: _get_git_state_key method (lines 961-979)  
ACTION: Extract to `.cursor/enforcement/core/git_utils.py` as module-level function `get_git_state_key(project_root: Path) -> str`. Remove `self` parameter. Call `run_git_command()` from same module. Preserve exact logic: HEAD rev-parse, cached diff, index hash computation, error handling with timestamp fallback.  
NOTES: Function must use `run_git_command()` from same module. Error handling must preserve exact behavior (return unique timestamp-based key on failure).

### 4:
FILE: .cursor/scripts/auto-enforcer.py  
TARGET: _get_changed_files_impl method (lines 981-1012)  
ACTION: Extract to `.cursor/enforcement/core/git_utils.py` as module-level function `get_changed_files_impl(project_root: Path, include_untracked: bool = False) -> List[str]`. Remove `self` parameter. Call `run_git_command()` from same module. Preserve exact logic: staged diff with `--ignore-cr-at-eol --ignore-all-space --ignore-blank-lines`, unstaged diff with same flags, untracked files with `ls-files --others --exclude-standard`, set union, sorted list return.  
NOTES: Git command flags must match exactly. File list processing (split, strip, filter) must be preserved. Return type must be `List[str]` (sorted).

### 5:
FILE: .cursor/scripts/auto-enforcer.py  
TARGET: get_changed_files method (lines 1029-1060)  
ACTION: Extract to `.cursor/enforcement/core/git_utils.py` as `GitUtils` class with instance methods. Create class with `__init__(self, project_root: Path)` that stores `project_root` and cache state: `self._cached_changed_files: Optional[Dict[str, List[str]]] = None`, `self._changed_files_cache_key: Optional[str] = None`. Method signature: `get_changed_files(self, include_untracked: bool = False) -> List[str]`. Preserve exact caching logic: check cache key, return cached result if available, fallback to `get_changed_files_impl()`. Add method `invalidate_cache(self)` to clear caches. Add method `update_cache(self, cache_key: str)` to populate cache.  
NOTES: Caching must be preserved. Cache key management must work identically. `GitUtils` instance will be created in `VeroFieldEnforcer.__init__` and reused throughout session.

### 6:
FILE: .cursor/scripts/auto-enforcer.py  
TARGET: get_file_diff method (lines 1062-1119)  
ACTION: Extract to `.cursor/enforcement/core/git_utils.py` as method on `GitUtils` class: `get_file_diff(self, file_path: str) -> Optional[str]`. Add instance variable `self._file_diff_cache: Dict[str, Optional[str]] = {}` to `GitUtils.__init__`. Preserve exact logic: cache check, tracked file check with `ls-files --error-unmatch`, staged/unstaged diff combination, None caching for untracked files, error handling with None caching. Add method `clear_diff_cache(self)` to clear cache.  
NOTES: Cache must be instance-level (not module-level) to allow per-session caching. Cache clearing must be callable from `VeroFieldEnforcer` when git state changes.

### 7:
FILE: .cursor/scripts/auto-enforcer.py  
TARGET: get_file_last_modified_time method (lines 1121-1261)  
ACTION: Extract to `.cursor/enforcement/core/git_utils.py` as method on `GitUtils` class: `get_file_last_modified_time(self, file_path: str) -> Optional[datetime]`. Preserve exact logic: file existence check, tracked file detection, commit time parsing, unstaged diff analysis with whitespace detection, file system time comparison with "today" threshold, ctime vs mtime selection for untracked files, all error handling and logging. Import required: `datetime`, `timezone`, `Path`, `logger`.  
NOTES: Complex logic must be preserved exactly. Date comparison logic (today_start threshold) must match. Error handling must preserve exact fallback behavior.

### 8:
FILE: .cursor/scripts/auto-enforcer.py  
TARGET: is_line_changed_in_session method (lines 1263-1319)  
ACTION: Extract to `.cursor/enforcement/core/git_utils.py` as method on `GitUtils` class: `is_line_changed_in_session(self, file_path: str, line_number: int, session_start: datetime) -> bool`. Change parameter from `self.session.start_time` to `session_start: datetime`. Preserve exact logic: diff parsing for tracked files (regex pattern `r'\+(\d+)(?:,(\d+))?'`), line range calculation, untracked file mtime comparison with session_start, error handling with conservative True return. Import required: `re`, `datetime`, `timezone`, `Path`, `logger`.  
NOTES: Session dependency removed - accepts `session_start` as parameter instead of accessing `self.session`. This matches target architecture requirement that git_utils must not know about session structure.

### 9:
FILE: .cursor/scripts/auto-enforcer.py  
TARGET: _has_actual_content_changes method (lines 1321-1391)  
ACTION: Extract to `.cursor/enforcement/core/git_utils.py` as method on `GitUtils` class: `_has_actual_content_changes(self, file_path: str) -> bool`. Preserve exact logic: staged/unstaged diff with `--ignore-all-space`, content line filtering (exclude headers, check for actual content), incremental processing, error handling with conservative True return. Import required: `logger`.  
NOTES: Method name can remain `_has_actual_content_changes` (private) or be renamed to `has_actual_content_changes` (public). Preserve exact diff analysis logic.

### 10:
FILE: .cursor/scripts/auto-enforcer.py  
TARGET: VeroFieldEnforcer.__init__ method  
ACTION: Add `self.git_utils = GitUtils(self.project_root)` after `self.project_root` initialization. Remove instance variables: `self._cached_changed_files`, `self._changed_files_cache_key`, `self._file_diff_cache` (now managed by `GitUtils`).  
NOTES: `GitUtils` instance will manage all git-related caching. This centralizes cache management.

### 11:
FILE: .cursor/scripts/auto-enforcer.py  
TARGET: VeroFieldEnforcer class methods  
ACTION: Update all calls to `self.run_git_command(args)` to `self.git_utils.run_git_command(args)` or `run_git_command(self.project_root, args)` (depending on whether `run_git_command` is class method or module function). Update all calls to `self.get_changed_files(...)` to `self.git_utils.get_changed_files(...)`. Update all calls to `self.get_file_diff(...)` to `self.git_utils.get_file_diff(...)`. Update all calls to `self.get_file_last_modified_time(...)` to `self.git_utils.get_file_last_modified_time(...)`. Update all calls to `self.is_line_changed_in_session(...)` to `self.git_utils.is_line_changed_in_session(..., session_start=datetime.fromisoformat(self.session.start_time.replace('Z', '+00:00')))`. Update all calls to `self._has_actual_content_changes(...)` to `self.git_utils._has_actual_content_changes(...)`. Update `_get_git_state_key()` calls to `get_git_state_key(self.project_root)`. Update `_get_changed_files_impl()` calls to `get_changed_files_impl(self.project_root, ...)`.  
NOTES: Search for all usages of these methods throughout `VeroFieldEnforcer` class. Update call sites systematically. Ensure `session_start` parameter is correctly computed for `is_line_changed_in_session()`.

### 12:
FILE: .cursor/scripts/auto-enforcer.py  
TARGET: run_all_checks method (around lines 3527-3552)  
ACTION: Update cache management logic. Replace `cache_key = self._get_git_state_key()` with `cache_key = get_git_state_key(self.project_root)`. Replace `self._cached_changed_files` checks and updates with `self.git_utils.update_cache(cache_key)` and `self.git_utils.get_changed_files(...)`. Replace `self._file_diff_cache.clear()` with `self.git_utils.clear_diff_cache()`. Replace `_run_git_command_cached.cache_clear()` with `run_git_command_cached.cache_clear()` (if accessible) or add method to `GitUtils` to clear LRU cache. Update cache population: `self.git_utils.update_cache(cache_key)` should call `get_changed_files_impl()` internally.  
NOTES: Cache invalidation logic must be preserved. Git state key computation must work identically. Cache clearing on state change must work.

### 13:
FILE: .cursor/scripts/auto-enforcer.py  
TARGET: module-level imports  
ACTION: Add import: `from enforcement.core.git_utils import GitUtils, run_git_command, get_git_state_key, get_changed_files_impl, run_git_command_cached`. Place after Phase 1 imports, before context manager imports.  
NOTES: Import path must resolve correctly. All exported functions/classes must be importable.

### 14:
FILE: .cursor/scripts/auto-enforcer.py  
TARGET: VeroFieldEnforcer class  
ACTION: Remove method definitions: `run_git_command()`, `_get_git_state_key()`, `_get_changed_files_impl()`, `get_changed_files()`, `get_file_diff()`, `get_file_last_modified_time()`, `is_line_changed_in_session()`, `_has_actual_content_changes()`. Remove module-level function `_run_git_command_cached()` (already extracted).  
NOTES: All git utility methods must be removed from `VeroFieldEnforcer` class. Only call sites should remain (updated in step 11).

### 15:
FILE: .cursor/enforcement/core/git_utils.py  
TARGET: module-level  
ACTION: Create new file with all extracted functions and `GitUtils` class. Structure: module-level functions (`run_git_command_cached`, `run_git_command`, `get_git_state_key`, `get_changed_files_impl`), then `GitUtils` class with methods (`get_changed_files`, `get_file_diff`, `get_file_last_modified_time`, `is_line_changed_in_session`, `_has_actual_content_changes`, `invalidate_cache`, `update_cache`, `clear_diff_cache`). Add proper imports, docstrings, type hints.  
NOTES: File must be well-structured with clear separation between module functions and class methods. All docstrings and comments must be preserved.

### 16:
FILE: .cursor/enforcement/core/__init__.py  
TARGET: module-level  
ACTION: Add exports: `from .git_utils import GitUtils, run_git_command, get_git_state_key, get_changed_files_impl, run_git_command_cached`.  
NOTES: This enables clean imports from `enforcement.core` namespace.

---

## 4. TEST_PLAN

After applying the contract, Execution Brain must run:

- `python .cursor/scripts/auto-enforcer.py --scope current_session --user-message "Phase 2 test"`
- `python .cursor/scripts/auto-enforcer.py --scope full --user-message "Phase 2 full scan"`
- Verify: `.cursor/enforcement/ENFORCER_STATUS.md` is generated and shows correct status
- Verify: `.cursor/enforcement/ACTIVE_VIOLATIONS.md` is generated and shows correct violations
- Verify: Changed files are detected correctly (check that same files are detected as before)
- Verify: File diffs are computed correctly (check that diffs match git diff output)
- Verify: Line change detection works (create test file, modify specific line, verify detection)
- Verify: Git command caching works (run enforcer twice on same state, verify second run is faster)
- Verify: Cache invalidation works (modify git state, verify cache is cleared and recomputed)
- Verify: No import errors: `python -c "from enforcement.core.git_utils import GitUtils; print('Imports OK')"`
- Verify: Performance is within 10% of original (run enforcer on same files before/after, compare runtime)
- Verify: Git command count is similar (check with logging or strace that git commands are not duplicated)

---

END_EXECUTION_CONTRACT

