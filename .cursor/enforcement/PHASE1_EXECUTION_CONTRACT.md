# Phase 1 Execution Contract — Extract Core Models & Utilities

**Analysis Brain (AB) Report**  
**Target Phase:** Phase 1 — Extract Core Models & Utilities  
**Date:** 2025-12-03  
**Status:** Ready for Execution Brain

---

## 1. SUMMARY

- Extract `Violation` dataclass, `ViolationSeverity` enum, and `AutoFix` dataclass from `auto-enforcer.py` to new `core/violations.py` module
- Extract `EnforcementSession` dataclass from `auto-enforcer.py` to new `core/session_state.py` module
- Extract historical path detection utility functions (`_is_historical_dir_path`, `_is_historical_document_file`, `_is_log_file`, `_is_documentation_file`) and `HISTORICAL_DOCUMENT_DIR_PATTERNS` constant to new `core/scope_evaluator.py` module
- Update `auto-enforcer.py` to import from new modules instead of defining classes locally
- Ensure all existing functionality works identically (pure extraction, no behavior change)

---

## 2. RISKS & INVARIANTS

### Invariants That Apply to Phase 1:

- **Invariant 1: Date Violations Scope Distinction** — Historical directory detection functions must work identically after extraction. Files in `docs/auto-pr/`, `docs/archive/`, `docs/historical/` must still be detected as historical.
- **Invariant 2: Historical Directories Remain Non-Blocking** — `_is_historical_dir_path()` and related functions must preserve exact behavior. Breaking this would cause historical files to be incorrectly flagged.
- **Invariant 5: ENFORCER_REPORT.json Structure Compatibility** — `Violation` dataclass structure must remain identical. Field names, types, and default values must not change.
- **Invariant 9: CLI Entrypoint Unchanged** — Imports must not break CLI execution. All imports must resolve correctly.

### Behavior That Must Not Change:

- `Violation` dataclass field names, types, and `__post_init__` behavior (timestamp auto-generation)
- `EnforcementSession` dataclass structure, `create_new()` class method behavior
- `AutoFix` dataclass structure
- Historical directory pattern matching logic (exact string matching behavior)
- Historical document file detection logic (regex patterns, prefix matching)
- Log file detection logic (exact filename matching, memory-bank directory detection)
- Documentation file detection logic (directory and pattern matching)

---

## 3. EXECUTION_CONTRACT

### 1:
FILE: .cursor/scripts/auto-enforcer.py  
TARGET: ViolationSeverity enum (lines 183-187), Violation dataclass (lines 190-204), AutoFix dataclass (lines 207-219)  
ACTION: Extract to `.cursor/enforcement/core/violations.py`. Create new file with imports (`Enum`, `dataclass`, `datetime`, `timezone`, `Optional`). Move all three definitions exactly as-is. Preserve all docstrings, field types, default values, and `__post_init__` method.  
NOTES: `Violation.__post_init__` must preserve timestamp auto-generation logic. `@dataclass(slots=True)` decorator must be preserved for memory optimization. All field names and types must match exactly.

### 2:
FILE: .cursor/scripts/auto-enforcer.py  
TARGET: EnforcementSession dataclass (lines 222-253)  
ACTION: Extract to `.cursor/enforcement/core/session_state.py`. Create new file with imports (`dataclass`, `uuid`, `datetime`, `timezone`, `List`, `Dict`, `Optional`). Move dataclass definition and `create_new()` class method exactly as-is. Preserve `@dataclass(slots=True)` decorator and all field defaults.  
NOTES: `create_new()` class method must preserve exact initialization logic, including `version=2` default. Field `file_hashes` default must be `None` (not empty dict) to match existing behavior.

### 3:
FILE: .cursor/scripts/auto-enforcer.py  
TARGET: HISTORICAL_DOCUMENT_DIR_PATTERNS class constant (lines 493-497)  
ACTION: Extract to `.cursor/enforcement/core/scope_evaluator.py` as module-level constant. Move tuple definition exactly as-is.  
NOTES: Must be accessible as module-level constant (not class attribute) for use by utility functions.

### 4:
FILE: .cursor/scripts/auto-enforcer.py  
TARGET: _is_historical_dir_path method (lines 2126-2137)  
ACTION: Extract to `.cursor/enforcement/core/scope_evaluator.py` as module-level function `is_historical_dir_path(path_value) -> bool`. Remove `self` parameter. Accept `HISTORICAL_DOCUMENT_DIR_PATTERNS` as module constant. Preserve exact logic: path normalization, separator/case handling, pattern matching.  
NOTES: Function must handle both Path objects and strings. Normalization logic (`str(path_value).replace("\\", "/").lower()`) must be preserved exactly.

### 5:
FILE: .cursor/scripts/auto-enforcer.py  
TARGET: _is_historical_document_file method (lines 2139-2176)  
ACTION: Extract to `.cursor/enforcement/core/scope_evaluator.py` as module-level function `is_historical_document_file(file_path: Path) -> bool`. Remove `self` parameter. Call `is_historical_dir_path()` from same module. Preserve exact logic: directory check, filename date pattern matching (ISO, US, year-only), historical prefix detection.  
NOTES: Must import `re` module. Regex patterns must match exactly. Historical prefix list must be preserved.

### 6:
FILE: .cursor/scripts/auto-enforcer.py  
TARGET: _is_log_file method (lines 2178-2212)  
ACTION: Extract to `.cursor/enforcement/core/scope_evaluator.py` as module-level function `is_log_file(file_path: Path) -> bool`. Remove `self` parameter. Preserve exact logic: log filename list, memory bank filename list, memory-bank directory string check.  
NOTES: Filename lists must match exactly. String check for "memory-bank" in path must be preserved (case-sensitive check).

### 7:
FILE: .cursor/scripts/auto-enforcer.py  
TARGET: _is_documentation_file method (lines 2214-2259)  
ACTION: Extract to `.cursor/enforcement/core/scope_evaluator.py` as module-level function `is_documentation_file(file_path: Path) -> bool`. Remove `self` parameter. Preserve exact logic: documentation directory list, documentation pattern list, case-insensitive matching.  
NOTES: Must import `re` module. Directory and pattern lists must match exactly. Case conversion logic must be preserved.

### 8:
FILE: .cursor/scripts/auto-enforcer.py  
TARGET: module-level imports (lines 19-33)  
ACTION: Add imports for extracted modules: `from enforcement.core.violations import Violation, ViolationSeverity, AutoFix`, `from enforcement.core.session_state import EnforcementSession`, `from enforcement.core.scope_evaluator import is_historical_dir_path, is_historical_document_file, is_log_file, is_documentation_file`.  
NOTES: Place imports after existing standard library imports, before context manager imports. Ensure import paths resolve correctly.

### 9:
FILE: .cursor/scripts/auto-enforcer.py  
TARGET: VeroFieldEnforcer class  
ACTION: Remove class definitions for `ViolationSeverity`, `Violation`, `AutoFix`, `EnforcementSession` (already extracted). Remove `HISTORICAL_DOCUMENT_DIR_PATTERNS` class constant. Update all method calls to `self._is_historical_dir_path()` to use `is_historical_dir_path()` (module function). Update all method calls to `self._is_historical_document_file()` to use `is_historical_document_file()`. Update all method calls to `self._is_log_file()` to use `is_log_file()`. Update all method calls to `self._is_documentation_file()` to use `is_documentation_file()`. Remove the four method definitions.  
NOTES: Search for all usages of these methods in `VeroFieldEnforcer` class. Update call sites to use module-level functions. Ensure `HISTORICAL_DOCUMENT_DIR_PATTERNS` references are updated to use module constant from `scope_evaluator`.

### 10:
FILE: .cursor/enforcement/core/__init__.py  
TARGET: module-level  
ACTION: Create new `__init__.py` file if it doesn't exist. Export public APIs: `from .violations import Violation, ViolationSeverity, AutoFix`, `from .session_state import EnforcementSession`, `from .scope_evaluator import is_historical_dir_path, is_historical_document_file, is_log_file, is_documentation_file`.  
NOTES: This enables clean imports from `enforcement.core` namespace. File may not exist yet.

---

## 4. TEST_PLAN

After applying the contract, Execution Brain must run:

- `python .cursor/scripts/auto-enforcer.py --scope current_session --user-message "Phase 1 test"`
- `python .cursor/scripts/auto-enforcer.py --scope full --user-message "Phase 1 full scan"`
- Verify: `.cursor/enforcement/ENFORCER_STATUS.md` is generated and shows correct status
- Verify: `.cursor/enforcement/ACTIVE_VIOLATIONS.md` is generated and shows correct violations
- Verify: `.cursor/enforcement/ENFORCER_REPORT.json` is generated with correct structure (violation objects have same fields)
- Verify: Session loading/saving works (check `.cursor/enforcement/session.json` is updated)
- Verify: Historical directory detection works (create test file in `docs/auto-pr/` with hardcoded date, verify scope is "historical")
- Verify: No import errors in Python console: `python -c "from enforcement.core.violations import Violation; from enforcement.core.session_state import EnforcementSession; from enforcement.core.scope_evaluator import is_historical_dir_path; print('Imports OK')"`
- Verify: All extracted functions work identically (run enforcer on same files before/after, compare violation counts and scopes)

---

END_EXECUTION_CONTRACT

