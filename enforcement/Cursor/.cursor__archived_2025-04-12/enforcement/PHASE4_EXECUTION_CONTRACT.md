# Phase 4 Execution Contract — Extract Individual Check Modules

**Analysis Brain (AB) Report**  
**Target Phase:** Phase 4 — Extract Individual Check Modules  
**Date:** 2025-12-04  
**Status:** Ready for Execution Brain

---

## 1. SUMMARY

- Extract `check_hardcoded_dates()` and related helper methods to `checks/date_checker.py` as `DateChecker` class
- Extract `check_security_compliance()` to `checks/security_checker.py` as `SecurityChecker` class
- Extract `check_memory_bank()` to `checks/memory_bank_checker.py` as `MemoryBankChecker` class
- Extract `check_error_handling()` to `checks/error_handling_checker.py` as `ErrorHandlingChecker` class
- Extract `check_logging()` to `checks/logging_checker.py` as `LoggingChecker` class
- Extract `check_python_bible()` to `checks/python_bible_checker.py` as `PythonBibleChecker` class
- Extract `check_bug_logging()` to `checks/bug_logging_checker.py` as `BugLoggingChecker` class
- Extract `check_context_management_compliance()` to `checks/context_checker.py` as `ContextChecker` class
- Extract `check_active_context()` to `checks/context_checker.py` (or separate file)
- Update checkers to return `List[Violation]` instead of `bool` and calling `_log_violation()` directly
- Update `_run_legacy_checks()` to call extracted checkers and handle violation logging
- Preserve all check logic, violation detection, and scope assignment

---

## 2. RISKS & INVARIANTS

### Invariants That Apply to Phase 4:

- **Invariant 1: Date Violations Scope Distinction** — Date checker must preserve exact scope assignment logic. Current session violations are auto-fixable, historical violations require human input.
- **Invariant 2: Historical Directories Remain Non-Blocking** — Historical directory detection in date checker must work identically.
- **Invariant 4: Blocking Count Accuracy** — Violation severity and scope assignment must be preserved. Breaking this breaks status generation.
- **Invariant 9: CLI Entrypoint Unchanged** — All checks must run correctly. Breaking check logic breaks enforcement.

### Behavior That Must Not Change:

- All check logic (pattern matching, file scanning, validation rules)
- Violation creation (severity, rule_ref, message, file_path, line_number, session_scope)
- Scope assignment logic (current_session vs historical)
- Check execution order (critical checks first, then non-critical)
- Error handling in checks (try/except, logging, fallback behavior)
- File filtering logic (file extensions, path patterns)
- Date detection patterns and normalization
- Historical date pattern matching
- Memory Bank file validation
- Security file detection
- Error handling pattern detection
- Logging pattern detection
- Python Bible compliance checks
- Context management validation

---

## 3. EXECUTION_CONTRACT

### 1:
FILE: .cursor/scripts/auto-enforcer.py  
TARGET: _normalize_date_match method (lines 237-308, approximately), _is_date_future_or_past method (lines 1485-1517, approximately), _is_historical_date_pattern method (lines 1518-1577, approximately)  
ACTION: Extract to `.cursor/enforcement/checks/date_checker.py` as methods on `DateChecker` class. Preserve exact logic: regex pattern matching, date format detection (YYYY-MM-DD vs MM/DD/YYYY), ISO normalization, future/past detection thresholds, historical pattern matching. Import required: `re`, `datetime`, `Optional`.  
NOTES: These helper methods are used by `check_hardcoded_dates()`. They must be preserved exactly as they contain complex date parsing logic.

### 2:
FILE: .cursor/scripts/auto-enforcer.py  
TARGET: check_hardcoded_dates method (lines 1579-1944, approximately)  
ACTION: Extract to `.cursor/enforcement/checks/date_checker.py` as `DateChecker.check_hardcoded_dates()` method. Change return type from `bool` to `List[Violation]`. Remove calls to `self._log_violation()`, `self._report_success()`, `self._report_failure()`. Instead, collect violations in list and return. Change signature to: `check_hardcoded_dates(self, changed_files: List[str], project_root: Path, session: EnforcementSession, git_utils: GitUtils, enforcement_dir: Path, violation_scope: str = "current_session") -> List[Violation]`. Remove `self` dependencies, pass as parameters. **DO NOT include `scope_evaluator` parameter** - import scope evaluator functions directly. Preserve exact logic: file filtering, date pattern matching, historical date exclusion, line change detection, scope assignment. Import required: `Path`, `List`, `Violation`, `ViolationSeverity`, `EnforcementSession`, `GitUtils`, `datetime`, `logger`, `from enforcement.core.scope_evaluator import is_historical_dir_path, is_historical_document_file, is_log_file, is_documentation_file`, `from enforcement.core.file_scanner import is_file_modified_in_session`.  
NOTES: Method is large (365+ lines). All logic must be preserved. Scope assignment must use imported scope evaluator functions directly (e.g., `is_historical_dir_path(file_path_str)` not `scope_evaluator.is_historical_dir_path()`). Git operations must use `git_utils` parameter. `enforcement_dir` is needed for excluded_dirs logic (original code uses `self.enforcement_dir`).

### 3:
FILE: .cursor/scripts/auto-enforcer.py  
TARGET: check_security_compliance method (lines 1946-1985)  
ACTION: Extract to `.cursor/enforcement/checks/security_checker.py` as `SecurityChecker.check_security_compliance()` method. Change return type from `bool` to `List[Violation]`. Remove calls to `self._log_violation()`, `self._report_success()`, `self._report_failure()`. Change signature to: `check_security_compliance(self, changed_files: List[str], project_root: Path, security_files_patterns: List[str]) -> List[Violation]`. Preserve exact logic: security file pattern matching, violation creation with WARNING severity. Import required: `Path`, `List`, `Violation`, `ViolationSeverity`.  
NOTES: Security file patterns must be passed as parameter (not hardcoded in checker).

### 4:
FILE: .cursor/scripts/auto-enforcer.py  
TARGET: check_memory_bank method (lines 1444-1483)  
ACTION: Extract to `.cursor/enforcement/checks/memory_bank_checker.py` as `MemoryBankChecker.check_memory_bank()` method. Change return type from `bool` to `List[Violation]`. Remove calls to `self._log_violation()`, `self._report_success()`, `self._report_failure()`. Change signature to: `check_memory_bank(self, memory_bank_dir: Path, memory_bank_files: List[str]) -> List[Violation]`. Preserve exact logic: file existence check, empty file check, violation creation with BLOCKED/WARNING severity. Import required: `Path`, `List`, `Violation`, `ViolationSeverity`.  
NOTES: Memory bank file list must be passed as parameter.

### 5:
FILE: .cursor/scripts/auto-enforcer.py  
TARGET: check_error_handling method (lines 2033-2121)  
ACTION: Extract to `.cursor/enforcement/checks/error_handling_checker.py` as `ErrorHandlingChecker.check_error_handling()` method. Change return type from `bool` to `List[Violation]`. Remove calls to `self._log_violation()`, `self._report_success()`, `self._report_failure()`. Change signature to: `check_error_handling(self, changed_files: List[str], project_root: Path, git_utils: GitUtils, is_file_modified_in_session_func) -> List[Violation]`. Preserve exact logic: file filtering by modification status, error-prone pattern detection, error handling pattern matching, context analysis (10 lines before/after), language-specific patterns. Import required: `Path`, `List`, `Violation`, `ViolationSeverity`, `GitUtils`, `re`, `logger`.  
NOTES: File modification check must use injected function parameter `is_file_modified_in_session_func` (not `self.is_file_modified_in_session()`). In `_run_legacy_checks()`, pass `is_file_modified_in_session` function from `enforcement.core.file_scanner`.

### 6:
FILE: .cursor/scripts/auto-enforcer.py  
TARGET: check_logging method (lines 2123-2193, approximately)  
ACTION: Extract to `.cursor/enforcement/checks/logging_checker.py` as `LoggingChecker.check_logging()` method. Change return type from `bool` to `List[Violation]`. Remove calls to `self._log_violation()`, `self._report_success()`, `self._report_failure()`. Change signature to: `check_logging(self, changed_files: List[str], project_root: Path, git_utils: GitUtils, is_file_modified_in_session_func) -> List[Violation]`. Preserve exact logic: file filtering, console.log detection, structured logging pattern matching. Import required: `Path`, `List`, `Violation`, `ViolationSeverity`, `GitUtils`, `re`, `logger`.  
NOTES: Similar structure to error_handling_checker. File modification check must use injected function parameter `is_file_modified_in_session_func`. In `_run_legacy_checks()`, pass `is_file_modified_in_session` function from `enforcement.core.file_scanner`.

### 7:
FILE: .cursor/scripts/auto-enforcer.py  
TARGET: check_python_bible method (lines 2194-2268, approximately)  
ACTION: Extract to `.cursor/enforcement/checks/python_bible_checker.py` as `PythonBibleChecker.check_python_bible()` method. Change return type from `bool` to `List[Violation]`. Remove calls to `self._log_violation()`, `self._report_success()`, `self._report_failure()`. Change signature to: `check_python_bible(self, changed_files: List[str], project_root: Path, git_utils: GitUtils, is_file_modified_in_session_func) -> List[Violation]`. Preserve exact logic: Python file filtering, Python Bible pattern detection, anti-pattern matching. Import required: `Path`, `List`, `Violation`, `ViolationSeverity`, `GitUtils`, `re`, `logger`.  
NOTES: Checker must only process Python files (.py extension). File modification check must use injected function parameter `is_file_modified_in_session_func`. In `_run_legacy_checks()`, pass `is_file_modified_in_session` function from `enforcement.core.file_scanner`.

### 8:
FILE: .cursor/scripts/auto-enforcer.py  
TARGET: check_bug_logging method (lines 2269-2295)  
ACTION: Extract to `.cursor/enforcement/checks/bug_logging_checker.py` as `BugLoggingChecker.check_bug_logging()` method. Change return type from `bool` to `List[Violation]`. Remove calls to `self._log_violation()`, `self._report_success()`, `self._report_failure()`. Change signature to: `check_bug_logging(self, project_root: Path) -> List[Violation]`. Preserve exact logic: BUG_LOG.md existence check, violation creation with WARNING severity. Import required: `Path`, `List`, `Violation`, `ViolationSeverity`.  
NOTES: Simple checker - just file existence validation.

### 9:
FILE: .cursor/scripts/auto-enforcer.py  
TARGET: check_active_context method (lines 1987-2032, approximately)  
ACTION: Extract to `.cursor/enforcement/checks/context_checker.py` as `ContextChecker.check_active_context()` method. Change return type from `bool` to `List[Violation]`. Remove calls to `self._log_violation()`, `self._report_success()`, `self._report_failure()`. Change signature to: `check_active_context(self, project_root: Path, memory_bank_dir: Path) -> List[Violation]`. Preserve exact logic: activeContext.md existence check, file modification time comparison, violation creation. Import required: `Path`, `List`, `Violation`, `ViolationSeverity`, `datetime`, `logger`.  
NOTES: Checker validates activeContext.md update requirement.

### 10:
FILE: .cursor/scripts/auto-enforcer.py  
TARGET: check_context_management_compliance method (lines 1086-1442, approximately)  
ACTION: Extract to `.cursor/enforcement/checks/context_checker.py` as `ContextChecker.check_context_management_compliance()` method. Change return type from `bool` to `List[Violation]`. Remove calls to `self._log_violation()`, `self._report_success()`, `self._report_failure()`. Change signature to: `check_context_management_compliance(self, context_manager_dir: Path, agent_response: Optional[str], preloader, context_loader, response_parser, verify_context_id_match_func) -> List[Violation]`. Preserve exact logic: availability checks, agent response validation, context-id matching, context state validation, skip logic (no agent session, stale context-id). Import required: `Path`, `List`, `Violation`, `ViolationSeverity`, `Optional`, `logger`, `PREDICTIVE_CONTEXT_AVAILABLE` (or handle availability check).  
NOTES: Complex checker with many dependencies. Skip logic must be preserved (returns empty list when skipped, not violations).

### 11:
FILE: .cursor/scripts/auto-enforcer.py  
TARGET: _run_legacy_checks method (lines 3297-3356)  
ACTION: Update to call extracted checkers. Import all checker classes. **Instantiate checkers once at the start of the method** (not per check call). Get `changed_files` once using `self.git_utils.get_changed_files(include_untracked=True)`. Call checker methods and collect violations into a list. Log violations using `self._log_violation()`. Report success/failure based on violation count. Preserve exact check execution order: critical checks first, then non-critical. Preserve skip_non_critical logic.  
NOTES: **Instantiation pattern**: Create checker instances once at method start (e.g., `date_checker = DateChecker(current_date=datetime.now().strftime("%Y-%m-%d"))`). **Example pattern**: 
```python
def _run_legacy_checks(self, skip_non_critical: bool = False, violation_scope: str = "current_session"):
    # Instantiate checkers once
    date_checker = DateChecker(current_date=datetime.now().strftime("%Y-%m-%d"))
    security_checker = SecurityChecker()
    memory_bank_checker = MemoryBankChecker()
    # ... etc
    
    # Get changed_files once
    changed_files = self.git_utils.get_changed_files(include_untracked=True)
    all_violations = []
    
    # Critical checks
    all_violations.extend(
        date_checker.check_hardcoded_dates(
            changed_files=changed_files,
            project_root=self.project_root,
            session=self.session,
            git_utils=self.git_utils,
            enforcement_dir=self.enforcement_dir,
            violation_scope=violation_scope
        )
    )
    # ... etc
    
    # Log violations
    for violation in all_violations:
        self._log_violation(violation)
        # Report success/failure based on violation count
```
Violation logging must use existing `_log_violation()` method. Check execution order must be preserved.

### 12:
FILE: .cursor/scripts/auto-enforcer.py  
TARGET: VeroFieldEnforcer class  
ACTION: Remove method definitions: `check_hardcoded_dates()`, `check_security_compliance()`, `check_memory_bank()`, `check_error_handling()`, `check_logging()`, `check_python_bible()`, `check_bug_logging()`, `check_active_context()`, `check_context_management_compliance()`, `_normalize_date_match()`, `_is_date_future_or_past()`, `_is_historical_date_pattern()`.  
NOTES: All check methods must be removed. Only `_run_legacy_checks()` should remain (updated to call extracted checkers).

### 13:
FILE: .cursor/scripts/auto-enforcer.py  
TARGET: module-level imports  
ACTION: Add imports: `from enforcement.checks.date_checker import DateChecker`, `from enforcement.checks.security_checker import SecurityChecker`, `from enforcement.checks.memory_bank_checker import MemoryBankChecker`, `from enforcement.checks.error_handling_checker import ErrorHandlingChecker`, `from enforcement.checks.logging_checker import LoggingChecker`, `from enforcement.checks.python_bible_checker import PythonBibleChecker`, `from enforcement.checks.bug_logging_checker import BugLoggingChecker`, `from enforcement.checks.context_checker import ContextChecker`. **Also add**: `from enforcement.core.file_scanner import is_file_modified_in_session`. Place after Phase 1, 2, 3 imports, before context manager imports.  
NOTES: Import paths must resolve correctly. All checker classes must be importable. `is_file_modified_in_session` function is needed for passing to checkers that require file modification checking.

### 14:
FILE: .cursor/enforcement/checks/date_checker.py  
TARGET: module-level  
ACTION: Create new file with `DateChecker` class. **Add `__init__(self, current_date: str)` method** that stores `current_date` as instance variable (e.g., `self.CURRENT_DATE = current_date`). Add helper methods: `_normalize_date_match()`, `_is_date_future_or_past()`, `_is_historical_date_pattern()`. Add main method: `check_hardcoded_dates()`. **Import scope evaluator functions directly**: `from enforcement.core.scope_evaluator import is_historical_dir_path, is_historical_document_file, is_log_file, is_documentation_file`. **Import file scanner function**: `from enforcement.core.file_scanner import is_file_modified_in_session`. Add proper imports, docstrings, type hints.  
NOTES: File is new. Class structure must be clear. All date detection logic must be preserved. **DO NOT use `scope_evaluator` parameter** - call imported functions directly (e.g., `is_historical_dir_path(file_path_str)`). `CURRENT_DATE` must be instance variable set in `__init__` for testability.

### 15:
FILE: .cursor/enforcement/checks/security_checker.py  
TARGET: module-level  
ACTION: Create new file with `SecurityChecker` class. Add method: `check_security_compliance()`. Add proper imports, docstrings, type hints.  
NOTES: File is new. Simple checker structure.

### 16:
FILE: .cursor/enforcement/checks/memory_bank_checker.py  
TARGET: module-level  
ACTION: Create new file with `MemoryBankChecker` class. Add method: `check_memory_bank()`. Add proper imports, docstrings, type hints.  
NOTES: File is new. Simple checker structure.

### 17:
FILE: .cursor/enforcement/checks/error_handling_checker.py  
TARGET: module-level  
ACTION: Create new file with `ErrorHandlingChecker` class. Add method: `check_error_handling()`. Add proper imports, docstrings, type hints.  
NOTES: File is new. Pattern-based checker.

### 18:
FILE: .cursor/enforcement/checks/logging_checker.py  
TARGET: module-level  
ACTION: Create new file with `LoggingChecker` class. Add method: `check_logging()`. Add proper imports, docstrings, type hints.  
NOTES: File is new. Pattern-based checker.

### 19:
FILE: .cursor/enforcement/checks/python_bible_checker.py  
TARGET: module-level  
ACTION: Create new file with `PythonBibleChecker` class. Add method: `check_python_bible()`. Add proper imports, docstrings, type hints.  
NOTES: File is new. Python-specific checker.

### 20:
FILE: .cursor/enforcement/checks/bug_logging_checker.py  
TARGET: module-level  
ACTION: Create new file with `BugLoggingChecker` class. Add method: `check_bug_logging()`. Add proper imports, docstrings, type hints.  
NOTES: File is new. Simple file existence checker.

### 21:
FILE: .cursor/enforcement/checks/context_checker.py  
TARGET: module-level  
ACTION: Create new file with `ContextChecker` class. Add methods: `check_active_context()`, `check_context_management_compliance()`. Add proper imports, docstrings, type hints.  
NOTES: File is new. Complex checker with context management validation.

### 22:
FILE: .cursor/enforcement/checks/__init__.py  
TARGET: module-level  
ACTION: Update existing file (if exists) or create new. Add exports: `from .date_checker import DateChecker`, `from .security_checker import SecurityChecker`, `from .memory_bank_checker import MemoryBankChecker`, `from .error_handling_checker import ErrorHandlingChecker`, `from .logging_checker import LoggingChecker`, `from .python_bible_checker import PythonBibleChecker`, `from .bug_logging_checker import BugLoggingChecker`, `from .context_checker import ContextChecker`.  
NOTES: This enables clean imports from `enforcement.checks` namespace.

---

## 4. TEST_PLAN

After applying the contract, Execution Brain must run:

- `python .cursor/scripts/auto-enforcer.py --scope current_session --user-message "Phase 4 test"`
- `python .cursor/scripts/auto-enforcer.py --scope full --user-message "Phase 4 full scan"`
- Verify: `.cursor/enforcement/ENFORCER_STATUS.md` is generated and shows correct status
- Verify: `.cursor/enforcement/ACTIVE_VIOLATIONS.md` is generated and shows correct violations
- Verify: All checks run correctly (check execution order preserved)
- Verify: Violations detected correctly (same violations as before extraction)
- Verify: Violation scopes assigned correctly (current_session vs historical)
- Verify: No duplicate violations (each violation appears once)
- Verify: Check execution order preserved (critical checks first, then non-critical)
- Verify: Date checker works (create test file with hardcoded date, verify detection)
- Verify: Security checker works (modify security file, verify detection)
- Verify: Memory bank checker works (remove memory bank file, verify detection)
- Verify: Error handling checker works (add error-prone code without try/catch, verify detection)
- Verify: Logging checker works (add console.log, verify detection)
- Verify: Python Bible checker works (add anti-pattern, verify detection)
- Verify: Bug logging checker works (remove BUG_LOG.md, verify detection)
- Verify: Context checker works (if context manager available)
- Verify: No import errors: `python -c "from enforcement.checks.date_checker import DateChecker; print('Imports OK')"`
- Verify: Checker isolation (each checker can be imported independently)

---

## 5. CLARIFICATIONS & UPDATES

**Updated:** 2025-12-04  
**Based on:** Implementation feedback and status report

### Key Clarifications:

1. **scope_evaluator Parameter Removed**: 
   - **Original contract**: Included `scope_evaluator` parameter
   - **Updated**: Remove `scope_evaluator` parameter from `DateChecker.check_hardcoded_dates()` signature
   - **Reason**: Original code uses module-level functions, not an object
   - **Action**: Import scope evaluator functions directly in `date_checker.py`:
     ```python
     from enforcement.core.scope_evaluator import (
         is_historical_dir_path,
         is_historical_document_file,
         is_log_file,
         is_documentation_file,
     )
     ```
   - **Usage**: Call functions directly (e.g., `is_historical_dir_path(file_path_str)`)

2. **enforcement_dir Parameter Added**:
   - **Original contract**: Not mentioned in signature
   - **Updated**: Add `enforcement_dir: Path` parameter to `DateChecker.check_hardcoded_dates()` signature
   - **Reason**: Original code uses `self.enforcement_dir` for excluded_dirs logic
   - **Action**: Include in signature: `check_hardcoded_dates(..., enforcement_dir: Path, ...)`

3. **Missing Import Added**:
   - **Issue**: `is_file_modified_in_session` used but not imported in `date_checker.py`
   - **Fix**: Add `from enforcement.core.file_scanner import is_file_modified_in_session` to contract item #2 and #14

4. **CURRENT_DATE Handling**:
   - **Original contract**: Not specified
   - **Updated**: Add `__init__(self, current_date: str)` method to `DateChecker` class
   - **Reason**: Better testability and consistency
   - **Action**: Store as instance variable: `self.CURRENT_DATE = current_date`

5. **Checker Instantiation Pattern Clarified**:
   - **Original contract**: Unclear when to instantiate
   - **Updated**: Instantiate checkers **once at the start of `_run_legacy_checks()`**, not per check call
   - **Reason**: Performance and consistency
   - **Action**: See contract item #11 for example pattern

6. **File Modification Function Parameter**:
   - **Updated**: Change parameter name from `is_file_modified_in_session` to `is_file_modified_in_session_func` in error_handling, logging, and python_bible checkers
   - **Reason**: Clearer that it's a function parameter
   - **Action**: Pass `is_file_modified_in_session` function from `enforcement.core.file_scanner` in `_run_legacy_checks()`

### Updated Signatures Summary:

**DateChecker.check_hardcoded_dates()**:
```python
def check_hardcoded_dates(
    self,
    changed_files: List[str],
    project_root: Path,
    session: EnforcementSession,
    git_utils: GitUtils,
    enforcement_dir: Path,  # ADDED
    violation_scope: str = "current_session",
) -> List[Violation]:
```

**DateChecker.__init__()**:
```python
def __init__(self, current_date: str):
    self.CURRENT_DATE = current_date
```

**ErrorHandlingChecker/LoggingChecker/PythonBibleChecker.check_*()**:
```python
def check_*(self, ..., is_file_modified_in_session_func) -> List[Violation]:
    # Use is_file_modified_in_session_func(...) instead of self.is_file_modified_in_session(...)
```

---

END_EXECUTION_CONTRACT

