# Phase 3 Execution Contract — Extract Session & State Management

**Analysis Brain (AB) Report**  
**Target Phase:** Phase 3 — Extract Session & State Management  
**Date:** 2025-12-03  
**Status:** Ready for Execution Brain

---

## 1. SUMMARY

- Extract `_init_session()`, `_save_session()`, `_migrate_session_v1_to_v2()`, and `_prune_session_data()` to `core/session_state.py` as module-level functions
- Extract `get_file_hash()` to `core/session_state.py` (uses session for hash caching)
- Extract `is_file_modified_in_session()` to `core/file_scanner.py` (file scanning logic, but uses session and git_utils)
- Update `auto-enforcer.py` to use extracted functions instead of direct method calls
- Preserve all session loading/saving behavior, migration logic, pruning limits, and hash caching
- Ensure session state management works identically (no behavior change)

---

## 2. RISKS & INVARIANTS

### Invariants That Apply to Phase 3:

- **Invariant 9: CLI Entrypoint Unchanged** — Session loading/saving must work identically. Session persistence is critical for enforcement continuity.
- **Invariant 10: Output Files Generated Correctly** — Session state affects violation tracking and reporting. Breaking session management breaks agent workflow.
- **Session State Integrity** — Session migration (v1 → v2) must work correctly. File hash caching must be preserved. Session pruning limits must be enforced.

### Behavior That Must Not Change:

- Session loading from `session.json` with error handling and fallback to new session
- Session migration from v1 to v2 (clearing old hash cache, adding version field)
- Session saving with pruning before save
- Session pruning limits (MAX_VIOLATIONS=2000, MAX_FILE_HASHES=10000, MAX_CHECKS=500)
- File hash computation with SHA256 and chunked reading (4096 bytes)
- File hash caching using `session.file_hashes` with mtime in cache key
- File modification detection using hash comparison with previous hash tracking
- Session sequence tracker initialization (if available)
- Backward compatibility handling (auto_fixes, file_hashes, version fields)

---

## 3. EXECUTION_CONTRACT

### 1:
FILE: .cursor/scripts/auto-enforcer.py  
TARGET: _migrate_session_v1_to_v2 method (lines 646-682)  
ACTION: Extract to `.cursor/enforcement/core/session_state.py` as module-level function `migrate_session_v1_to_v2(old_data: Dict) -> Dict`. Remove `self` parameter. Preserve exact logic: copy old_data, clear file_hashes with logging, add version=2, ensure auto_fixes field exists. Import required: `Dict`, `logger`.  
NOTES: Function must preserve exact migration logic. Logging must handle both custom and standard loggers (try/except TypeError pattern).

### 2:
FILE: .cursor/scripts/auto-enforcer.py  
TARGET: _prune_session_data method (lines 771-807)  
ACTION: Extract to `.cursor/enforcement/core/session_state.py` as module-level function `prune_session_data(session: EnforcementSession) -> None`. Remove `self` parameter. Accept `session` as parameter. Preserve exact logic: MAX_VIOLATIONS=2000, MAX_FILE_HASHES=10000, MAX_CHECKS=500, list slicing for violations/checks, dict key deletion for file_hashes. Import required: `EnforcementSession`, `logger`.  
NOTES: Function must modify session in-place (no return value). Pruning limits must match exactly. Dict key deletion logic must be preserved.

### 3:
FILE: .cursor/scripts/auto-enforcer.py  
TARGET: _save_session method (lines 809-835)  
ACTION: Extract to `.cursor/enforcement/core/session_state.py` as module-level function `save_session(session: EnforcementSession, enforcement_dir: Path) -> None`. Remove `self` parameter. Accept `session` and `enforcement_dir` as parameters. Call `prune_session_data(session)` before saving. Preserve exact logic: session_dict construction, JSON serialization with indent=2, error handling. Import required: `EnforcementSession`, `Path`, `json`, `logger`.  
NOTES: Function must call `prune_session_data()` first. Session dict construction must preserve exact field names. Error handling must preserve exact behavior.

### 4:
FILE: .cursor/scripts/auto-enforcer.py  
TARGET: _init_session method (lines 684-769)  
ACTION: Extract to `.cursor/enforcement/core/session_state.py` as module-level function `load_session(enforcement_dir: Path, predictor=None, session_sequence_tracker_ref=None) -> Tuple[EnforcementSession, Optional[Any]]`. Remove `self` parameter. Accept `enforcement_dir` and optional `predictor` and `session_sequence_tracker_ref` (for initializing session sequence tracker). Return tuple of `(session, session_sequence_tracker)`. Preserve exact logic: file existence check, JSON loading, version check and migration, field defaults (auto_fixes, file_hashes, version), EnforcementSession creation, session sequence tracker initialization with error handling, fallback to new session on error. Import required: `Path`, `json`, `EnforcementSession`, `logger`, `_lazy_import_context_manager` (or handle context manager imports).  
NOTES: Function must handle session sequence tracker initialization if predictor is available. Error handling must preserve exact fallback behavior. Session sequence tracker initialization uses lazy imports and has try/except error handling.

### 5:
FILE: .cursor/scripts/auto-enforcer.py  
TARGET: get_file_hash method (lines 593-644)  
ACTION: Extract to `.cursor/enforcement/core/session_state.py` as module-level function `get_file_hash(file_path: Path, session: EnforcementSession, project_root: Optional[Path] = None) -> Optional[str]`. Remove `self` parameter. Accept `file_path`, `session`, and optional `project_root` (for resolving relative paths). Preserve exact logic: path existence check, mtime-based cache key (`f"{file_path_str}:{stat_info.st_mtime}"`), session cache check, SHA256 hashing with chunked reading (4096 bytes), cache storage, error handling. Import required: `Path`, `hashlib`, `EnforcementSession`, `Optional`, `logger`.  
NOTES: Function must use `session.file_hashes` for caching. Cache key format must include mtime for proper invalidation. Chunked reading must use 4096-byte chunks.

### 6:
FILE: .cursor/scripts/auto-enforcer.py  
TARGET: is_file_modified_in_session method (lines 916-1020, approximately)  
ACTION: Extract to `.cursor/enforcement/core/file_scanner.py` as module-level function `is_file_modified_in_session(file_path: str, session: EnforcementSession, project_root: Path, git_utils: GitUtils) -> bool`. Remove `self` parameter. Accept `file_path`, `session`, `project_root`, and `git_utils` as parameters. Preserve exact logic: cached changed files check, file existence check, current hash computation using `get_file_hash()` from `session_state`, previous hash lookup with `f"{file_path}:previous"` key, untracked file detection using git_utils, hash comparison, previous hash storage. Import required: `Path`, `EnforcementSession`, `GitUtils`, `get_file_hash` from `session_state`, `logger`.  
NOTES: Function must use `get_file_hash()` from `session_state` module (not duplicate logic). Git utils dependency must be injected as parameter. Previous hash key format must match exactly.

### 7:
FILE: .cursor/scripts/auto-enforcer.py  
TARGET: VeroFieldEnforcer.__init__ method  
ACTION: Update session initialization. Replace `self._init_session()` call with `self.session, self.session_sequence_tracker = load_session(self.enforcement_dir, predictor=self.predictor if hasattr(self, 'predictor') else None, session_sequence_tracker_ref=self.session_sequence_tracker)`. Ensure `session_sequence_tracker` attribute exists before calling.  
NOTES: Session loading must preserve session sequence tracker initialization. Return value handling must match function signature (tuple).

### 8:
FILE: .cursor/scripts/auto-enforcer.py  
TARGET: VeroFieldEnforcer class methods  
ACTION: Update all calls to `self._save_session()` to `save_session(self.session, self.enforcement_dir)`. Update all calls to `self.get_file_hash(...)` to `get_file_hash(Path(...), self.session, self.project_root)` (adjust path construction as needed). Update all calls to `self.is_file_modified_in_session(...)` to `is_file_modified_in_session(..., self.session, self.project_root, self.git_utils)`.  
NOTES: Search for all usages of these methods throughout `VeroFieldEnforcer` class. Update call sites systematically. Ensure path construction is correct (relative vs absolute).

### 9:
FILE: .cursor/scripts/auto-enforcer.py  
TARGET: VeroFieldEnforcer class  
ACTION: Remove method definitions: `_init_session()`, `_save_session()`, `_migrate_session_v1_to_v2()`, `_prune_session_data()`, `get_file_hash()`, `is_file_modified_in_session()`.  
NOTES: All session management methods must be removed from `VeroFieldEnforcer` class. Only call sites should remain (updated in step 8).

### 10:
FILE: .cursor/enforcement/core/session_state.py  
TARGET: module-level  
ACTION: Update existing file (created in Phase 1). Add module-level functions: `load_session()`, `save_session()`, `migrate_session_v1_to_v2()`, `prune_session_data()`, `get_file_hash()`. Import `EnforcementSession` from same file (already defined in Phase 1). Add proper imports: `Path`, `json`, `hashlib`, `Optional`, `Tuple`, `Any`, `Dict`, `logger`. Add docstrings and type hints.  
NOTES: File already exists from Phase 1 with `EnforcementSession` dataclass. Add functions to same file. Ensure proper module structure.

### 11:
FILE: .cursor/enforcement/core/file_scanner.py  
TARGET: module-level  
ACTION: Create new file with `is_file_modified_in_session()` function. Add proper imports: `Path`, `EnforcementSession`, `GitUtils`, `get_file_hash` from `session_state`, `logger`. Add docstring and type hints.  
NOTES: File is new. Function must import `get_file_hash` from `session_state` to avoid duplication.

### 12:
FILE: .cursor/scripts/auto-enforcer.py  
TARGET: module-level imports  
ACTION: Add imports: `from enforcement.core.session_state import load_session, save_session, get_file_hash`, `from enforcement.core.file_scanner import is_file_modified_in_session`. Place after Phase 1 and Phase 2 imports, before context manager imports.  
NOTES: Import paths must resolve correctly. All exported functions must be importable.

### 13:
FILE: .cursor/enforcement/core/__init__.py  
TARGET: module-level  
ACTION: Add exports: `from .session_state import load_session, save_session, get_file_hash, migrate_session_v1_to_v2, prune_session_data`, `from .file_scanner import is_file_modified_in_session`.  
NOTES: This enables clean imports from `enforcement.core` namespace.

### 14:
FILE: .cursor/scripts/auto-enforcer.py  
TARGET: run() method or similar  
ACTION: Update session saving call. Find where `_save_session()` is called (likely in `run()` method or at end of `run_all_checks()`). Update to use `save_session(self.session, self.enforcement_dir)`.  
NOTES: Session saving must be called at appropriate point in execution flow. Update call site.

---

## 4. TEST_PLAN

After applying the contract, Execution Brain must run:

- `python .cursor/scripts/auto-enforcer.py --scope current_session --user-message "Phase 3 test"`
- `python .cursor/scripts/auto-enforcer.py --scope full --user-message "Phase 3 full scan"`
- Verify: `.cursor/enforcement/session.json` is loaded correctly (check session_id, start_time, last_check fields)
- Verify: `.cursor/enforcement/session.json` is saved correctly after run (check that file is updated)
- Verify: Session migration works (create old v1 session.json, run enforcer, verify migration to v2)
- Verify: File hashes are cached correctly (check that `session.json` contains `file_hashes` field with correct structure)
- Verify: File modification detection works (modify a file, run enforcer, verify detection)
- Verify: Session pruning works (create session with >2000 violations, run enforcer, verify pruning to 2000)
- Verify: No import errors: `python -c "from enforcement.core.session_state import load_session, save_session, get_file_hash; from enforcement.core.file_scanner import is_file_modified_in_session; print('Imports OK')"`
- Verify: Session sequence tracker initialization works (if context manager available, verify tracker is created)
- Verify: Error handling works (corrupt session.json, verify fallback to new session)
- Verify: Backward compatibility (session.json without auto_fixes or file_hashes fields, verify defaults are added)

---

END_EXECUTION_CONTRACT

