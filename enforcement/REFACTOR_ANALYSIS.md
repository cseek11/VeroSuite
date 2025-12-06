# VeroField Auto-Enforcer — Large-File Refactor Analysis

**Analysis Brain (AB) Report**  
**Target File:** `.cursor/scripts/auto-enforcer.py` (≈5,704 lines)  
**Date:** 2025-12-04  
**Status:** Analysis Complete — Ready for Execution Brain

---

## Executive Summary

### Current State
- **File Size:** 5,704 lines in a single Python file
- **Primary Class:** `VeroFieldEnforcer` (~5,300 lines)
- **Key Responsibilities:** CLI entrypoint, enforcement orchestration, git operations, violation detection, Two-Brain integration, context management, report generation
- **Architecture:** Monolithic with some modular checkers (Phase 4 partial implementation)
- **Dependencies:** Git, filesystem, rule files, context management system, Two-Brain integration modules

### Major Pain Points
1. **God Class:** `VeroFieldEnforcer` contains 5,300+ lines with 100+ methods
2. **Tight Coupling:** Git operations, file I/O, violation logic, and reporting all intertwined
3. **Global State:** Session state, caches, and file hashes scattered throughout
4. **Duplicated Logic:** Historical path checks, scope evaluation, date pattern matching repeated
5. **Hard to Test:** Monolithic structure makes unit testing nearly impossible
6. **Mixed Concerns:** Business logic (violation detection) mixed with infrastructure (git, file I/O)

### Proposed Target Architecture
- **Modular Design:** Separate modules for core models, git operations, file scanning, violations, individual checkers, and orchestration
- **Clear Boundaries:** Each module has single responsibility with well-defined public APIs
- **Testability:** Isolated modules can be unit tested independently
- **Maintainability:** New rule types can be added as new checker modules without touching core

### Overall Refactor Strategy
- **Risk Level:** Medium (production-critical system, but changes are structural, not semantic)
- **Approach:** Incremental, phase-by-phase extraction with behavior preservation
- **Testing:** After each phase, verify CLI output, report generation, and Two-Brain integration remain unchanged
- **Duration:** 5-7 phases, each independently verifiable

---

## Section 1 — High-Level Behavior Mapping

### Phase Map: Runtime Lifecycle

#### Phase 1: Init & Environment Detection
- **Purpose:** Initialize enforcer, detect environment (Windows/Unix), set up paths
- **Key Functions:** `main()`, `VeroFieldEnforcer.__init__()`, `_use_ascii_output()`, `_lazy_import_context_manager()`
- **External Dependencies:** `sys`, `os`, `Path`, context manager modules (lazy-loaded)
- **Outputs:** Initialized `VeroFieldEnforcer` instance with session loaded

#### Phase 2: Git & Repository Introspection
- **Purpose:** Detect changed files, compute file hashes, determine modification status
- **Key Functions:** `get_changed_files()`, `_get_changed_files_impl()`, `get_file_hash()`, `is_file_modified_in_session()`, `get_file_diff()`, `run_git_command()`, `_run_git_command_cached()`
- **External Dependencies:** `subprocess` (git commands), `hashlib` (SHA256), filesystem
- **Outputs:** Lists of changed files (tracked/untracked), file hashes, modification status

#### Phase 3: Session/Context Setup
- **Purpose:** Load/create enforcement session, initialize context management, set up caches
- **Key Functions:** `_init_session()`, `_migrate_session_v1_to_v2()`, `_load_agent_response_from_file()`, context manager initialization
- **External Dependencies:** `json` (session.json), filesystem, context manager modules
- **Outputs:** `EnforcementSession` object, initialized context management components

#### Phase 4: Running Checks (Legacy + Modular)
- **Purpose:** Execute all compliance checks (memory bank, dates, security, error handling, logging, Python Bible, bug logging)
- **Key Functions:** `run_all_checks()`, `_run_legacy_checks()`, `_run_modular_checkers()`, individual `check_*()` methods
- **External Dependencies:** Rule files (`.mdc`), filesystem, git
- **Outputs:** `Violation` objects added to `self.violations` list

#### Phase 5: Scope Re-evaluation
- **Purpose:** Re-evaluate violation scopes (current_session vs historical) based on file paths and git state
- **Key Functions:** `re_evaluate_violation_scope()`, `_is_historical_dir_path()`, `_is_historical_document_file()`
- **External Dependencies:** Git state, filesystem paths
- **Outputs:** Updated `violation.session_scope` values

#### Phase 6: Two-Brain Integration & Reporting
- **Purpose:** Generate ENFORCER_REPORT.json, handshake files (ENFORCER_STATUS.md, ACTIVE_VIOLATIONS.md, ACTIVE_CONTEXT_DUMP.md), status files
- **Key Functions:** `generate_two_brain_report()`, `generate_agent_status()`, `generate_violations_log()`, `generate_enforcement_block_message()`, `_add_context_hints_to_report()`, `_compute_unified_context_bundle()`
- **External Dependencies:** `two_brain_integration.py`, `handshake_generator.py`, filesystem
- **Outputs:** JSON and Markdown files in `.cursor/enforcement/`

#### Phase 7: Exit Status
- **Purpose:** Determine exit code (0 = success, 1 = violations), save session, cleanup
- **Key Functions:** `run()`, `_save_session()`, `_prune_session_data()`
- **External Dependencies:** Filesystem (session.json)
- **Outputs:** Exit code, saved session state

---

## Section 2 — Subsystem Identification & Clustering

### Subsystem Map

#### 1. CLI & Entrypoint Layer
- **Role:** Parse arguments, initialize enforcer, handle console output, exit codes
- **Key Components:** `main()`, `argparse`, `_use_ascii_output()`
- **Inputs:** Command-line arguments (`--user-message`, `--scope`)
- **Outputs:** Exit code, console messages
- **Dependencies:** `VeroFieldEnforcer` class
- **Global State:** None (pure function)

#### 2. Session & State Management
- **Role:** Manage enforcement session lifecycle, file hashes cache, session persistence
- **Key Components:** `EnforcementSession` dataclass, `_init_session()`, `_save_session()`, `_prune_session_data()`, `_migrate_session_v1_to_v2()`, `get_file_hash()`
- **Inputs:** Session JSON file, file paths
- **Outputs:** Session object, saved session.json
- **Dependencies:** Filesystem, JSON serialization
- **Global State:** `self.session`, `self.session.file_hashes`

#### 3. Git & Filesystem Interaction
- **Role:** Execute git commands, detect changed files, compute diffs, check file modification times
- **Key Components:** `run_git_command()`, `_run_git_command_cached()`, `get_changed_files()`, `_get_changed_files_impl()`, `get_file_diff()`, `get_file_last_modified_time()`, `is_file_modified_in_session()`, `is_line_changed_in_session()`, `_has_actual_content_changes()`
- **Inputs:** Git repository state, file paths
- **Outputs:** Lists of changed files, file diffs, modification status
- **Dependencies:** `subprocess` (git), filesystem
- **Global State:** `self._cached_changed_files`, `self._file_diff_cache`, `_run_git_command_cached` (LRU cache)

#### 4. Rule/Check Orchestration
- **Role:** Coordinate execution of all checks, route to modular or legacy checkers, manage scope
- **Key Components:** `run_all_checks()`, `_run_legacy_checks()`, `_run_modular_checkers()`
- **Inputs:** User message, scope ("full" or "current_session")
- **Outputs:** Violations logged to `self.violations`
- **Dependencies:** Individual check methods, modular checker router
- **Global State:** `self.violations`, `self.session.checks_passed`, `self.session.checks_failed`

#### 5. Specific Check Implementations
- **Role:** Implement individual compliance checks
- **Key Components:**
  - **Date Checker:** `check_hardcoded_dates()`, `_is_historical_date_pattern()`, `_is_historical_dir_path()`, `_is_historical_document_file()`, `_is_log_file()`, `_is_documentation_file()`, `_normalize_date_match()`, `_is_date_future_or_past()`
  - **Security Checker:** `check_security_compliance()`
  - **Memory Bank Checker:** `check_memory_bank()`
  - **Active Context Checker:** `check_active_context()`
  - **Error Handling Checker:** `check_error_handling()`
  - **Logging Checker:** `check_logging()`
  - **Python Bible Checker:** `check_python_bible()`
  - **Bug Logging Checker:** `check_bug_logging()`
  - **Context Management Checker:** `check_context_management_compliance()`, `_check_context_state_validity()`, `_verify_context_id_match()`
- **Inputs:** Changed files, file content
- **Outputs:** Violations logged via `_log_violation()`
- **Dependencies:** Git operations, file I/O, violation model
- **Global State:** `self.violations`

#### 6. Violation Model & Scope Logic
- **Role:** Define violation structure, manage scope assignment, re-evaluate scopes
- **Key Components:** `Violation` dataclass, `ViolationSeverity` enum, `_log_violation()`, `re_evaluate_violation_scope()`, `_is_historical_dir_path()`
- **Inputs:** Rule violations, file paths, git state
- **Outputs:** Violation objects with assigned scopes
- **Dependencies:** None (pure data structures + logic)
- **Global State:** `self.violations`

#### 7. Two-Brain & Reporting Integration
- **Role:** Generate ENFORCER_REPORT.json, handshake files, status files, context bundles
- **Key Components:** `generate_two_brain_report()`, `_add_context_hints_to_report()`, `_compute_unified_context_bundle()`, `_detect_task_type_unified()`, `_load_internal_recommendations()`, `_extract_context_hints_unified()`, `_find_relevant_example_files()`, `_get_patterns_to_follow_unified()`, `generate_agent_status()`, `generate_violations_log()`, `generate_agent_reminders()`, `generate_enforcement_block_message()`, `generate_auto_fixes_summary()`
- **Inputs:** Violations, session state, context recommendations
- **Outputs:** JSON and Markdown files
- **Dependencies:** `two_brain_integration.py`, `handshake_generator.py`, filesystem
- **Global State:** None (pure generation functions)

#### 8. Context Management Integration
- **Role:** Update context recommendations, generate dynamic rule files, update dashboard
- **Key Components:** `_update_context_recommendations()`, `_generate_internal_recommendations()`, `_generate_dynamic_rule_file()`, `_generate_session_restart_rule()`, `_update_dashboard()`, `get_context_metrics_for_audit()`
- **Inputs:** Changed files, user message, task detection
- **Outputs:** Recommendations files, dashboard, rule files
- **Dependencies:** Context manager modules (TaskDetector, ContextLoader, WorkflowTracker, ContextPredictor, etc.)
- **Global State:** `self.predictor`, `self.task_detector`, `self.context_loader`, etc.

### Dependency Graph
```
CLI & Entrypoint
  └─> Session & State Management
  └─> Rule/Check Orchestration
        ├─> Git & Filesystem Interaction
        ├─> Specific Check Implementations
        │     └─> Violation Model & Scope Logic
        └─> Two-Brain & Reporting Integration
              └─> Context Management Integration
```

---

## Section 3 — Pain Points & Refactor Targets

### Pain Point 1: God Class (VeroFieldEnforcer)
- **Problem:** 5,300+ lines, 100+ methods, handles everything from git operations to violation detection to report generation
- **Impact:** High — Makes code hard to understand, test, and maintain
- **Priority:** High
- **Subsystem:** Core architecture
- **Refactor Target:** Break into orchestrator + specialized modules

### Pain Point 2: Tight Coupling (Git Operations)
- **Problem:** Git commands scattered throughout (in date checker, file scanner, session manager)
- **Impact:** High — Hard to mock for testing, changes to git logic require touching multiple files
- **Priority:** High
- **Subsystem:** Git & Filesystem Interaction
- **Refactor Target:** Extract to `git_utils.py` with clean interface

### Pain Point 3: Global State Usage
- **Problem:** `self._cached_changed_files`, `self._file_diff_cache`, `self.session.file_hashes` accessed everywhere
- **Impact:** Medium — Makes testing harder, unclear ownership
- **Priority:** Medium
- **Subsystem:** Session & State Management, Git & Filesystem Interaction
- **Refactor Target:** Encapsulate in session state manager, pass as parameters

### Pain Point 4: Duplicated Logic (Historical Path Checks)
- **Problem:** `_is_historical_dir_path()` logic duplicated in date checker, scope re-evaluation, file scanner
- **Impact:** Medium — Inconsistency risk, maintenance burden
- **Priority:** Medium
- **Subsystem:** Violation Model & Scope Logic, Specific Check Implementations
- **Refactor Target:** Extract to shared utility module

### Pain Point 5: Duplicated Logic (Scope Evaluation)
- **Problem:** Scope assignment logic (`current_session` vs `historical`) scattered across violation creation and re-evaluation
- **Impact:** Medium — Risk of inconsistent scope assignment
- **Priority:** Medium
- **Subsystem:** Violation Model & Scope Logic
- **Refactor Target:** Centralize in `violations.py` module

### Pain Point 6: Hard to Test (Monolithic Structure)
- **Problem:** Cannot test date checker without initializing entire enforcer, git operations, session management
- **Impact:** High — No unit tests possible, only integration tests
- **Priority:** High
- **Subsystem:** All subsystems
- **Refactor Target:** Extract checkers to independent modules with dependency injection

### Pain Point 7: Mixed Concerns (Business Logic + Infrastructure)
- **Problem:** Violation detection logic mixed with file I/O, git operations, report generation
- **Impact:** Medium — Hard to reason about, violates single responsibility
- **Priority:** Medium
- **Subsystem:** Specific Check Implementations
- **Refactor Target:** Separate business logic (checkers) from infrastructure (file I/O, git)

### Pain Point 8: Large Methods (Date Checker)
- **Problem:** `check_hardcoded_dates()` is 365 lines with nested conditionals, multiple responsibilities
- **Impact:** Medium — Hard to understand, test, and modify
- **Priority:** Medium
- **Subsystem:** Specific Check Implementations
- **Refactor Target:** Break into smaller methods, extract date detection logic

### Pain Point 9: Context Management Complexity
- **Problem:** `_update_context_recommendations()` is 400+ lines with complex conditional logic
- **Impact:** Medium — Hard to understand and test
- **Priority:** Low (can be refactored later, not core to enforcement)
- **Subsystem:** Context Management Integration
- **Refactor Target:** Extract to separate context manager module (future work)

---

## Section 4 — Target Architecture & Module Decomposition

### Target Module Layout

```
.cursor/
├── enforcement/
│   ├── core/
│   │   ├── __init__.py
│   │   ├── session_state.py          # EnforcementSession, session management
│   │   ├── git_utils.py              # Git operations, changed files, diffs
│   │   ├── file_scanner.py           # File modification detection, hashing
│   │   ├── violations.py             # Violation model, scope logic, re-evaluation
│   │   └── scope_evaluator.py        # Scope assignment (current_session vs historical)
│   │
│   ├── checks/
│   │   ├── __init__.py
│   │   ├── base_checker.py           # Abstract base class (if not already exists)
│   │   ├── date_checker.py           # Date detection and validation
│   │   ├── security_checker.py       # Security file validation
│   │   ├── memory_bank_checker.py    # Memory Bank compliance
│   │   ├── error_handling_checker.py  # Error handling patterns
│   │   ├── logging_checker.py        # Structured logging compliance
│   │   ├── python_bible_checker.py   # Python Bible compliance
│   │   └── context_checker.py        # Context management compliance
│   │
│   ├── reporting/
│   │   ├── __init__.py
│   │   ├── status_generator.py        # AGENT_STATUS.md, ENFORCER_STATUS.md
│   │   ├── violations_logger.py      # VIOLATIONS.md, ACTIVE_VIOLATIONS.md
│   │   ├── block_generator.py         # ENFORCEMENT_BLOCK.md
│   │   ├── two_brain_reporter.py     # ENFORCER_REPORT.json generation
│   │   └── context_bundle_builder.py # Context hints for Two-Brain
│   │
│   └── orchestrator.py                # Main orchestration (replaces VeroFieldEnforcer.run_all_checks)
│
└── scripts/
    └── auto-enforcer.py               # Thin CLI entrypoint (kept as-is, imports from modules)
```

### Module Descriptions

#### `.cursor/enforcement/core/session_state.py`
- **Responsibilities:**
  - `EnforcementSession` dataclass definition
  - Session loading/saving (`load_session()`, `save_session()`)
  - Session migration (`migrate_session()`)
  - Session pruning (`prune_session_data()`)
  - File hash management (`get_file_hash()`, `is_file_modified_in_session()`)
- **Public API:**
  - `EnforcementSession` class
  - `load_session(enforcement_dir: Path) -> EnforcementSession`
  - `save_session(session: EnforcementSession, enforcement_dir: Path) -> None`
  - `get_file_hash(file_path: Path, session: EnforcementSession) -> Optional[str]`
- **Must NOT Know About:**
  - Git operations (delegates to git_utils)
  - Violation detection logic
  - Report generation

#### `.cursor/enforcement/core/git_utils.py`
- **Responsibilities:**
  - Git command execution (with caching)
  - Changed files detection (`get_changed_files()`)
  - File diff computation (`get_file_diff()`)
  - File modification time detection (`get_file_last_modified_time()`)
  - Line change detection (`is_line_changed_in_session()`)
- **Public API:**
  - `GitUtils` class (or module-level functions)
  - `get_changed_files(project_root: Path, include_untracked: bool = False) -> List[str]`
  - `get_file_diff(project_root: Path, file_path: str) -> Optional[str]`
  - `is_line_changed_in_session(project_root: Path, file_path: str, line_number: int, session_start: datetime) -> bool`
- **Must NOT Know About:**
  - Violation model
  - Session structure (only needs session_start for line change detection)
  - Check logic

#### `.cursor/enforcement/core/file_scanner.py`
- **Responsibilities:**
  - File modification detection (using hashes)
  - File content hashing
  - Historical file detection (`is_historical_file()`)
  - File type detection
- **Public API:**
  - `FileScanner` class
  - `is_file_modified(session: EnforcementSession, file_path: Path) -> bool`
  - `is_historical_file(file_path: Path) -> bool`
  - `get_file_hash(file_path: Path) -> Optional[str]`
- **Must NOT Know About:**
  - Git operations (delegates to git_utils)
  - Violation model
  - Check logic

#### `.cursor/enforcement/core/violations.py`
- **Responsibilities:**
  - `Violation` dataclass definition
  - `ViolationSeverity` enum
  - Violation logging (`log_violation()`)
  - Scope assignment (`assign_scope()`, `re_evaluate_scope()`)
- **Public API:**
  - `Violation` class
  - `ViolationSeverity` enum
  - `log_violation(violation: Violation, session: EnforcementSession) -> None`
  - `assign_scope(violation: Violation, file_path: str, git_utils: GitUtils) -> str`
  - `re_evaluate_scope(violation: Violation, file_path: str) -> str`
- **Must NOT Know About:**
  - Check implementations
  - Report generation
  - Context management

#### `.cursor/enforcement/core/scope_evaluator.py`
- **Responsibilities:**
  - Historical directory detection (`is_historical_dir()`)
  - Historical document detection (`is_historical_document()`)
  - Log file detection (`is_log_file()`)
  - Documentation file detection (`is_documentation_file()`)
- **Public API:**
  - `ScopeEvaluator` class (or module-level functions)
  - `is_historical_dir(file_path: str) -> bool`
  - `is_historical_document(file_path: Path) -> bool`
  - `is_log_file(file_path: Path) -> bool`
- **Must NOT Know About:**
  - Violation model (pure utility functions)
  - Git operations
  - Session state

#### `.cursor/enforcement/checks/date_checker.py`
- **Responsibilities:**
  - Hardcoded date detection
  - Historical date pattern matching
  - Date normalization
  - "Last Updated" field validation
- **Public API:**
  - `DateChecker` class
  - `check_hardcoded_dates(file_path: Path, session: EnforcementSession, git_utils: GitUtils, scope_evaluator: ScopeEvaluator) -> List[Violation]`
- **Must NOT Know About:**
  - Report generation
  - Context management
  - Other checkers

#### `.cursor/enforcement/checks/security_checker.py`
- **Responsibilities:**
  - Security file validation
  - Security-sensitive file detection
- **Public API:**
  - `SecurityChecker` class
  - `check_security_compliance(changed_files: List[str], project_root: Path) -> List[Violation]`
- **Must NOT Know About:**
  - Git operations (receives changed_files as parameter)
  - Session state
  - Other checkers

#### `.cursor/enforcement/checks/memory_bank_checker.py`
- **Responsibilities:**
  - Memory Bank file existence validation
  - Memory Bank staleness checks
- **Public API:**
  - `MemoryBankChecker` class
  - `check_memory_bank(memory_bank_dir: Path) -> List[Violation]`
- **Must NOT Know About:**
  - Git operations
  - Session state
  - Other checkers

#### `.cursor/enforcement/checks/error_handling_checker.py`
- **Responsibilities:**
  - Error handling pattern validation
  - Error-prone operation detection
- **Public API:**
  - `ErrorHandlingChecker` class
  - `check_error_handling(changed_files: List[str], project_root: Path, git_utils: GitUtils) -> List[Violation]`
- **Must NOT Know About:**
  - Session state
  - Other checkers

#### `.cursor/enforcement/checks/logging_checker.py`
- **Responsibilities:**
  - Structured logging compliance
  - Console.log detection
- **Public API:**
  - `LoggingChecker` class
  - `check_logging(changed_files: List[str], project_root: Path, git_utils: GitUtils) -> List[Violation]`
- **Must NOT Know About:**
  - Session state
  - Other checkers

#### `.cursor/enforcement/checks/python_bible_checker.py`
- **Responsibilities:**
  - Python Bible compliance checks
  - Anti-pattern detection
- **Public API:**
  - `PythonBibleChecker` class
  - `check_python_bible(changed_files: List[str], project_root: Path, git_utils: GitUtils) -> List[Violation]`
- **Must NOT Know About:**
  - Session state
  - Other checkers

#### `.cursor/enforcement/checks/context_checker.py`
- **Responsibilities:**
  - Context management compliance
  - Context state validation
  - Active context update checks
- **Public API:**
  - `ContextChecker` class
  - `check_context_management_compliance(context_manager_dir: Path, agent_response: Optional[str]) -> List[Violation]`
- **Must NOT Know About:**
  - Git operations
  - Session state (except for agent response)
  - Other checkers

#### `.cursor/enforcement/reporting/status_generator.py`
- **Responsibilities:**
  - AGENT_STATUS.md generation
  - ENFORCER_STATUS.md generation (via handshake_generator)
- **Public API:**
  - `StatusGenerator` class
  - `generate_agent_status(violations: List[Violation], session: EnforcementSession, enforcement_dir: Path) -> None`
- **Must NOT Know About:**
  - Check implementations
  - Git operations
  - Context management

#### `.cursor/enforcement/reporting/violations_logger.py`
- **Responsibilities:**
  - VIOLATIONS.md generation
  - ACTIVE_VIOLATIONS.md generation (via handshake_generator)
- **Public API:**
  - `ViolationsLogger` class
  - `generate_violations_log(violations: List[Violation], enforcement_dir: Path) -> None`
- **Must NOT Know About:**
  - Check implementations
  - Git operations
  - Session state (except violations)

#### `.cursor/enforcement/reporting/block_generator.py`
- **Responsibilities:**
  - ENFORCEMENT_BLOCK.md generation
  - AGENT_REMINDERS.md generation
- **Public API:**
  - `BlockGenerator` class
  - `generate_enforcement_block(violations: List[Violation], session: EnforcementSession, enforcement_dir: Path) -> None`
- **Must NOT Know About:**
  - Check implementations
  - Git operations

#### `.cursor/enforcement/reporting/two_brain_reporter.py`
- **Responsibilities:**
  - ENFORCER_REPORT.json generation
  - Integration with two_brain_integration.py
- **Public API:**
  - `TwoBrainReporter` class
  - `generate_report(violations: List[Violation], session: EnforcementSession, enforcement_dir: Path, context_bundle: Dict) -> EnforcerReport`
- **Must NOT Know About:**
  - Check implementations
  - Git operations
  - Context management (receives context_bundle as parameter)

#### `.cursor/enforcement/reporting/context_bundle_builder.py`
- **Responsibilities:**
  - Context bundle computation for Two-Brain
  - Task type detection
  - Context hints extraction
  - Relevant files finding
  - Patterns extraction
- **Public API:**
  - `ContextBundleBuilder` class
  - `build_context_bundle(violations: List[Violation], changed_files: List[str], project_root: Path) -> Dict`
- **Must NOT Know About:**
  - Check implementations
  - Session state (except violations)
  - Report generation

#### `.cursor/enforcement/orchestrator.py`
- **Responsibilities:**
  - Coordinate all checks
  - Manage execution flow
  - Route to modular or legacy checkers
  - Generate all reports
  - Update context recommendations
- **Public API:**
  - `EnforcementOrchestrator` class
  - `run_all_checks(user_message: Optional[str], scope: str, project_root: Path) -> bool`
- **Must NOT Know About:**
  - CLI argument parsing (receives parameters)
  - Console output (delegates to main())

#### `.cursor/scripts/auto-enforcer.py` (Thin CLI Entrypoint)
- **Responsibilities:**
  - Parse command-line arguments
  - Initialize orchestrator
  - Handle console output
  - Return exit code
- **Public API:**
  - `main()` function
- **Must NOT Know About:**
  - Check implementations (delegates to orchestrator)
  - Violation model (orchestrator handles it)
  - Report generation (orchestrator handles it)

---

## Section 5 — Invariants & Safety Constraints

### Scope Invariants

#### Invariant 1: Date Violations Scope Distinction
- **Why It Matters:** Current session violations are auto-fixable, historical violations require human input. Breaking this breaks the Two-Brain workflow.
- **How It Might Break:** If scope assignment logic is moved incorrectly, violations might be misclassified.
- **Test:** Run enforcer on file with historical date → verify scope is "historical". Run on file with current date violation → verify scope is "current_session".

#### Invariant 2: Historical Directories Remain Non-Blocking
- **Why It Matters:** Files in `docs/auto-pr/`, `docs/archive/`, `docs/historical/` should never block execution.
- **How It Might Break:** If historical directory detection is broken, these files might be flagged as violations.
- **Test:** Create file in `docs/auto-pr/` with hardcoded date → verify no violation or violation scope is "historical".

### Status Invariants

#### Invariant 3: ENFORCER_STATUS.md Driven by Current Session Only
- **Why It Matters:** Status should be APPROVED/REJECTED based on current_session violations only, not historical.
- **How It Might Break:** If status generation logic incorrectly includes historical violations in blocking count.
- **Test:** Have 10 historical violations + 0 current_session violations → verify STATUS: APPROVED.

#### Invariant 4: Blocking Count Accuracy
- **Why It Matters:** Blocking count must match actual BLOCKING violations in current_session scope.
- **How It Might Break:** If violation counting logic is broken during module extraction.
- **Test:** Create 3 current_session BLOCKING violations → verify blocking_count = 3.

### Reporting Invariants

#### Invariant 5: ENFORCER_REPORT.json Structure Compatibility
- **Why It Matters:** Two-Brain integration depends on exact JSON structure (id, severity, file, rule_ref, session_scope, etc.).
- **How It Might Break:** If report generation changes field names or structure.
- **Test:** Generate report → verify JSON schema matches existing structure. Verify Two-Brain integration still works.

#### Invariant 6: Two-Brain Fields Preserved
- **Why It Matters:** `context_bundle` field in ENFORCER_REPORT.json must contain task_type, hints, relevant_files, patterns_to_follow.
- **How It Might Break:** If context bundle builder is broken or fields renamed.
- **Test:** Generate report → verify context_bundle exists and has all required fields.

### Performance Invariants

#### Invariant 7: No Major Runtime Regression
- **Why It Matters:** Enforcer runs frequently (on every file change). Slowdown would impact developer experience.
- **How It Might Break:** If module extraction introduces unnecessary overhead (e.g., repeated imports, cache misses).
- **Test:** Run enforcer on same set of files before/after refactor → verify runtime is within 10% of original.

#### Invariant 8: Git Interactions Remain Bounded
- **Why It Matters:** Git commands are slow. Too many calls would cause timeouts.
- **How It Might Break:** If git operations are duplicated across modules instead of cached.
- **Test:** Run enforcer with 100 changed files → verify git command count is similar to original (check with `strace` or logging).

### CLI Invariants

#### Invariant 9: CLI Entrypoint Unchanged
- **Why It Matters:** External scripts and CI/CD depend on `python .cursor/scripts/auto-enforcer.py --scope current_session`.
- **How It Might Break:** If main() function signature or argument parsing changes.
- **Test:** Run `python .cursor/scripts/auto-enforcer.py --help` → verify output matches original. Run with `--scope current_session` → verify behavior unchanged.

### Output File Invariants

#### Invariant 10: Output Files Generated Correctly
- **Why It Matters:** Agent reads AGENT_STATUS.md, ENFORCEMENT_BLOCK.md, etc. Breaking format breaks agent workflow.
- **How It Might Break:** If report generators are broken or file paths change.
- **Test:** Run enforcer → verify all output files exist in `.cursor/enforcement/` with correct content structure.

---

## Section 6 — Stepwise Refactor Plan (No Behavior Change)

### Phase 1: Extract Core Models & Utilities
- **Scope:**
  - Extract `Violation` dataclass and `ViolationSeverity` enum to `core/violations.py`
  - Extract `EnforcementSession` dataclass to `core/session_state.py`
  - Extract `AutoFix` dataclass to `core/violations.py` (or separate file)
  - Extract historical path detection functions to `core/scope_evaluator.py`
- **Preconditions:**
  - None (pure extraction, no dependencies)
- **Postconditions:**
  - `auto-enforcer.py` imports from new modules
  - All existing functionality works (no behavior change)
  - Tests pass (if any exist)
- **Risk Level:** Low
- **Recommended Tests:**
  - Run: `python .cursor/scripts/auto-enforcer.py --scope current_session --user-message "test"`
  - Verify: ENFORCER_STATUS.md, ACTIVE_VIOLATIONS.md, ENFORCER_REPORT.json generated correctly
  - Verify: Violation objects have same structure
  - Verify: Session loading/saving works

### Phase 2: Extract Git & Filesystem Utilities
- **Scope:**
  - Extract `run_git_command()`, `_run_git_command_cached()` to `core/git_utils.py`
  - Extract `get_changed_files()`, `_get_changed_files_impl()` to `core/git_utils.py`
  - Extract `get_file_diff()` to `core/git_utils.py`
  - Extract `get_file_last_modified_time()` to `core/git_utils.py`
  - Extract `is_line_changed_in_session()` to `core/git_utils.py`
  - Extract `_has_actual_content_changes()` to `core/git_utils.py`
- **Preconditions:**
  - Phase 1 complete
- **Postconditions:**
  - `auto-enforcer.py` uses `GitUtils` class or module functions
  - Git operations work identically (caching preserved)
  - Changed files detection works
- **Risk Level:** Medium (git operations are critical)
- **Recommended Tests:**
  - Run: `python .cursor/scripts/auto-enforcer.py --scope current_session`
  - Verify: Changed files detected correctly
  - Verify: File diffs computed correctly
  - Verify: Line change detection works
  - Verify: Git command caching still works (check performance)

### Phase 3: Extract Session & State Management
- **Scope:**
  - Extract `_init_session()`, `_save_session()`, `_migrate_session_v1_to_v2()`, `_prune_session_data()` to `core/session_state.py`
  - Extract `get_file_hash()` to `core/session_state.py` (or `core/file_scanner.py`)
  - Extract `is_file_modified_in_session()` to `core/file_scanner.py`
  - Move session initialization logic to `core/session_state.py`
- **Preconditions:**
  - Phase 1, 2 complete
- **Postconditions:**
  - Session loading/saving works identically
  - File hash caching works
  - File modification detection works
- **Risk Level:** Medium (session state is critical)
- **Recommended Tests:**
  - Run: `python .cursor/scripts/auto-enforcer.py --scope current_session`
  - Verify: Session loads correctly
  - Verify: Session saves correctly
  - Verify: File hashes cached correctly
  - Verify: File modification detection works

### Phase 4: Extract Individual Check Modules
- **Scope:**
  - Extract `check_hardcoded_dates()` and related methods to `checks/date_checker.py`
  - Extract `check_security_compliance()` to `checks/security_checker.py`
  - Extract `check_memory_bank()` to `checks/memory_bank_checker.py`
  - Extract `check_error_handling()` to `checks/error_handling_checker.py`
  - Extract `check_logging()` to `checks/logging_checker.py`
  - Extract `check_python_bible()` to `checks/python_bible_checker.py`
  - Extract `check_bug_logging()` to `checks/bug_logging_checker.py` (or merge with memory_bank)
  - Extract `check_context_management_compliance()` to `checks/context_checker.py`
- **Preconditions:**
  - Phase 1, 2, 3 complete
- **Postconditions:**
  - Each checker is independent module
  - Checkers return `List[Violation]` instead of logging directly
  - Orchestrator calls checkers and logs violations
- **Risk Level:** High (core business logic)
- **Recommended Tests:**
  - Run: `python .cursor/scripts/auto-enforcer.py --scope current_session`
  - Verify: All checks run correctly
  - Verify: Violations detected correctly
  - Verify: Violation scopes assigned correctly
  - Verify: No duplicate violations
  - Verify: Check execution order preserved

### Phase 5: Extract Reporting Modules
- **Scope:**
  - Extract `generate_agent_status()` to `reporting/status_generator.py`
  - Extract `generate_violations_log()` to `reporting/violations_logger.py`
  - Extract `generate_agent_reminders()` to `reporting/block_generator.py`
  - Extract `generate_enforcement_block_message()` to `reporting/block_generator.py`
  - Extract `generate_auto_fixes_summary()` to `reporting/status_generator.py` (or separate)
  - Extract `generate_two_brain_report()` to `reporting/two_brain_reporter.py`
  - Extract `_add_context_hints_to_report()`, `_compute_unified_context_bundle()`, etc. to `reporting/context_bundle_builder.py`
- **Preconditions:**
  - Phase 1, 2, 3, 4 complete
- **Postconditions:**
  - All report files generated correctly
  - Two-Brain integration works
  - Handshake files generated correctly
- **Risk Level:** Medium (reporting is critical for agent workflow)
- **Recommended Tests:**
  - Run: `python .cursor/scripts/auto-enforcer.py --scope current_session`
  - Verify: All output files generated (AGENT_STATUS.md, VIOLATIONS.md, ENFORCER_REPORT.json, etc.)
  - Verify: File content structure matches original
  - Verify: Two-Brain integration still works (check ENFORCER_REPORT.json structure)
  - Verify: Handshake files generated (ENFORCER_STATUS.md, ACTIVE_VIOLATIONS.md, ACTIVE_CONTEXT_DUMP.md)

### Phase 6: Extract Orchestrator
- **Scope:**
  - Extract `run_all_checks()` logic to `orchestrator.py` as `EnforcementOrchestrator` class
  - Extract `_run_legacy_checks()`, `_run_modular_checkers()` to orchestrator
  - Extract `_pre_flight_check()` to orchestrator
  - Keep `main()` in `auto-enforcer.py` as thin wrapper
- **Preconditions:**
  - Phase 1, 2, 3, 4, 5 complete
- **Postconditions:**
  - `auto-enforcer.py` is thin CLI entrypoint (< 100 lines)
  - Orchestrator coordinates all checks and reporting
  - Behavior identical to original
- **Risk Level:** Medium (orchestration is critical)
- **Recommended Tests:**
  - Run: `python .cursor/scripts/auto-enforcer.py --scope current_session --user-message "test"`
  - Verify: All checks run
  - Verify: All reports generated
  - Verify: Exit code correct
  - Verify: Context recommendations updated (if applicable)
  - Verify: Context management integration works

### Phase 7: Cleanup & Consolidation
- **Scope:**
  - Remove dead code paths
  - Normalize logging (ensure all modules use same logger)
  - Normalize error handling
  - Consolidate configuration access (if needed)
  - Update imports to use new modules
  - Remove duplicate code
- **Preconditions:**
  - Phase 1, 2, 3, 4, 5, 6 complete
- **Postconditions:**
  - No dead code
  - Consistent logging/error handling
  - All imports use new module structure
- **Risk Level:** Low (cleanup only)
- **Recommended Tests:**
  - Run: `python .cursor/scripts/auto-enforcer.py --scope current_session`
  - Verify: No regressions
  - Verify: Code is cleaner and more maintainable
  - Run: `python -m py_compile .cursor/scripts/auto-enforcer.py` (verify no syntax errors)
  - Run: `python -m py_compile .cursor/enforcement/core/*.py` (verify all modules compile)
  - Run: `python -m py_compile .cursor/enforcement/checks/*.py` (verify all modules compile)
  - Run: `python -m py_compile .cursor/enforcement/reporting/*.py` (verify all modules compile)

---

## Section 7 — Final Deliverables Format

### Execution Brain Instructions

**Execution Brain, do not act until approved. When approved, you will implement the refactor in the following phases:**

1. **Phase 1:** Extract core models (Violation, EnforcementSession, scope evaluator) — Low risk, pure extraction
2. **Phase 2:** Extract git utilities — Medium risk, verify caching preserved
3. **Phase 3:** Extract session state management — Medium risk, verify session persistence works
4. **Phase 4:** Extract individual check modules — High risk, verify all checks still work
5. **Phase 5:** Extract reporting modules — Medium risk, verify all output files generated correctly
6. **Phase 6:** Extract orchestrator — Medium risk, verify orchestration works
7. **Phase 7:** Cleanup and consolidation — Low risk, verify no regressions

**After each phase:**
- Run: `python .cursor/scripts/auto-enforcer.py --scope current_session --user-message "test"`
- Verify: ENFORCER_STATUS.md shows correct status
- Verify: ACTIVE_VIOLATIONS.md shows correct violations
- Verify: ENFORCER_REPORT.json structure matches original
- Verify: Two-Brain integration still works
- Verify: No performance regression

**Critical:** Do NOT change any behavior. This is a structural refactor only. All functionality must remain identical.

---

## Appendix: Key Code Locations

### Violation Model
- Lines 183-205: `ViolationSeverity` enum, `Violation` dataclass
- Lines 955-999: `_log_violation()` method
- Lines 2978-3008: `re_evaluate_violation_scope()` method

### Git Operations
- Lines 259-298: `_run_git_command_cached()` function
- Lines 1019-1031: `run_git_command()` method
- Lines 1053-1084: `_get_changed_files_impl()` method
- Lines 1101-1132: `get_changed_files()` method
- Lines 1134-1191: `get_file_diff()` method

### Session Management
- Lines 222-253: `EnforcementSession` dataclass
- Lines 802-887: `_init_session()` method
- Lines 927-953: `_save_session()` method
- Lines 889-925: `_prune_session_data()` method
- Lines 711-762: `get_file_hash()` method

### Date Checker
- Lines 2261-2625: `check_hardcoded_dates()` method (365 lines!)
- Lines 2065-2124: `_is_historical_date_pattern()` method
- Lines 2126-2137: `_is_historical_dir_path()` method
- Lines 2139-2176: `_is_historical_document_file()` method

### Reporting
- Lines 3010-3257: `generate_agent_status()` method
- Lines 3259-3300: `generate_violations_log()` method
- Lines 3387-3573: `generate_enforcement_block_message()` method
- Lines 5094-5145: `generate_two_brain_report()` method
- Lines 5168-5205: `_compute_unified_context_bundle()` method

### Orchestration
- Lines 3660-3895: `run_all_checks()` method (235 lines)
- Lines 3897-3981: `_run_modular_checkers()` method
- Lines 3983-4042: `_run_legacy_checks()` method

---

**End of Analysis Brain Report**




