# Phase 5 Execution Contract — Extract Reporting Modules

**Analysis Brain (AB) Report**  
**Target Phase:** Phase 5 — Extract Reporting Modules  
**Date:** 2025-12-04  
**Status:** Ready for Execution Brain

---

## 1. SUMMARY

- Extract `generate_agent_status()` to `reporting/status_generator.py` as `StatusGenerator` class
- Extract `generate_violations_log()` to `reporting/violations_logger.py` as `ViolationsLogger` class
- Extract `generate_agent_reminders()` and `generate_enforcement_block_message()` to `reporting/block_generator.py` as `BlockGenerator` class
- Extract `generate_auto_fixes_summary()` to `reporting/status_generator.py` (or separate file)
- Extract `generate_two_brain_report()` to `reporting/two_brain_reporter.py` as `TwoBrainReporter` class
- Extract context bundle builder methods (`_add_context_hints_to_report()`, `_compute_unified_context_bundle()`, `_detect_task_type_unified()`, `_load_internal_recommendations()`, `_extract_context_hints_unified()`, `_find_relevant_example_files()`, `_get_patterns_to_follow_unified()`, and related helpers) to `reporting/context_bundle_builder.py` as `ContextBundleBuilder` class
- Update `auto-enforcer.py` to use extracted reporting modules
- Preserve all report file generation, Two-Brain integration, and handshake file generation
- Ensure all output files are generated correctly with identical structure

---

## 2. RISKS & INVARIANTS

### Invariants That Apply to Phase 5:

- **Invariant 5: ENFORCER_REPORT.json Structure Compatibility** — Two-Brain integration depends on exact JSON structure. Breaking this breaks agent workflow.
- **Invariant 6: Two-Brain Fields Preserved** — `context_bundle` field must contain task_type, hints, relevant_files, patterns_to_follow.
- **Invariant 10: Output Files Generated Correctly** — Agent reads AGENT_STATUS.md, ENFORCEMENT_BLOCK.md, etc. Breaking format breaks agent workflow.
- **Invariant 3: ENFORCER_STATUS.md Driven by Current Session Only** — Status generation must correctly separate current_session and historical violations.

### Behavior That Must Not Change:

- All report file generation (AGENT_STATUS.md, VIOLATIONS.md, ENFORCER_REPORT.json, etc.)
- Report file content structure and formatting
- Violation scope re-evaluation before status generation
- Two-Brain report structure (JSON schema, field names, types)
- Context bundle computation (task_type detection, hints extraction, relevant files, patterns)
- Handshake file generation (via handshake_generator integration)
- Block file generation and removal logic
- Auto-fixes summary generation
- Agent reminders generation
- Error handling in report generation (must not fail entire run)

---

## 3. EXECUTION_CONTRACT

### 1:
FILE: .cursor/scripts/auto-enforcer.py  
TARGET: generate_agent_status method (lines 1935-2182, approximately)  
ACTION: Extract to `.cursor/enforcement/reporting/status_generator.py` as `StatusGenerator.generate_agent_status()` method. Change signature to: `generate_agent_status(self, violations: List[Violation], session: EnforcementSession, enforcement_dir: Path, re_evaluate_violation_scope_func, save_session_func) -> None`. Remove `self` dependencies, pass as parameters. Preserve exact logic: scope re-evaluation, violation counting, status determination, content generation, file writing, session saving. Import required: `Path`, `List`, `Violation`, `ViolationSeverity`, `EnforcementSession`, `datetime`, `timezone`, `logger`.  
NOTES: Method must call `re_evaluate_violation_scope_func` for each violation. Must call `save_session_func` after scope updates. Content formatting must match exactly.

### 2:
FILE: .cursor/scripts/auto-enforcer.py  
TARGET: generate_auto_fixes_summary method (lines 2500-2555, approximately)  
ACTION: Extract to `.cursor/enforcement/reporting/status_generator.py` as `StatusGenerator.generate_auto_fixes_summary()` method. Change signature to: `generate_auto_fixes_summary(self, session: EnforcementSession, enforcement_dir: Path) -> None`. Preserve exact logic: auto_fixes check, content generation, file writing. Import required: `Path`, `EnforcementSession`, `datetime`, `timezone`, `logger`.  
NOTES: Simple method - just file generation with session data.

### 3:
FILE: .cursor/scripts/auto-enforcer.py  
TARGET: generate_violations_log method (lines 2184-2225)  
ACTION: Extract to `.cursor/enforcement/reporting/violations_logger.py` as `ViolationsLogger.generate_violations_log()` method. Change signature to: `generate_violations_log(self, violations: List[Violation], session: EnforcementSession, enforcement_dir: Path) -> None`. Preserve exact logic: content generation, violation formatting, file writing, error handling. Import required: `Path`, `List`, `Violation`, `EnforcementSession`, `datetime`, `timezone`, `logger`.  
NOTES: Method generates VIOLATIONS.md file. Content structure must match exactly.

### 4:
FILE: .cursor/scripts/auto-enforcer.py  
TARGET: generate_agent_reminders method (lines 2227-2310, approximately)  
ACTION: Extract to `.cursor/enforcement/reporting/block_generator.py` as `BlockGenerator.generate_agent_reminders()` method. Change signature to: `generate_agent_reminders(self, violations: List[Violation], session: EnforcementSession, enforcement_dir: Path) -> None`. Preserve exact logic: violation filtering, reminder content generation, file writing. Import required: `Path`, `List`, `Violation`, `ViolationSeverity`, `EnforcementSession`, `datetime`, `timezone`, `logger`.  
NOTES: Method generates AGENT_REMINDERS.md file.

### 5:
FILE: .cursor/scripts/auto-enforcer.py  
TARGET: generate_enforcement_block_message method (lines 2312-2500, approximately)  
ACTION: Extract to `.cursor/enforcement/reporting/block_generator.py` as `BlockGenerator.generate_enforcement_block_message()` method. Change signature to: `generate_enforcement_block_message(self, violations: List[Violation], session: EnforcementSession, enforcement_dir: Path) -> None`. Preserve exact logic: violation filtering, block file removal (if no violations), content generation, file writing. Import required: `Path`, `List`, `Violation`, `ViolationSeverity`, `EnforcementSession`, `datetime`, `timezone`, `logger`.  
NOTES: Method generates ENFORCEMENT_BLOCK.md file. Must remove file if no violations. Content structure must match exactly.

### 6:
FILE: .cursor/scripts/auto-enforcer.py  
TARGET: _detect_task_type_from_violations method (lines 4282-4306)  
ACTION: Extract to `.cursor/enforcement/reporting/context_bundle_builder.py` as `ContextBundleBuilder._detect_task_type_from_violations()` method. Change signature to: `_detect_task_type_from_violations(self, violations: List[Violation]) -> Optional[str]`. Preserve exact logic: violation analysis, task type detection patterns. Import required: `List`, `Violation`, `Optional`.  
NOTES: Helper method for task type detection.

### 7:
FILE: .cursor/scripts/auto-enforcer.py  
TARGET: _extract_context_hints method (lines 4308-4627, approximately)  
ACTION: Extract to `.cursor/enforcement/reporting/context_bundle_builder.py` as `ContextBundleBuilder._extract_context_hints()` method. Change signature to: `_extract_context_hints(self, task_type: Optional[str]) -> List[str]`. Preserve exact logic: hints_map dictionary, task type mapping, hint extraction. Import required: `Optional`, `List`.  
NOTES: Large method with comprehensive hints library. All hints must be preserved.

### 8:
FILE: .cursor/scripts/auto-enforcer.py  
TARGET: _get_relevant_example_files method (if exists)  
ACTION: Extract to `.cursor/enforcement/reporting/context_bundle_builder.py` as `ContextBundleBuilder._get_relevant_example_files()` method. Change signature to: `_get_relevant_example_files(self, task_type: Optional[str]) -> List[str]`. Preserve exact logic: example file mapping, task type matching. Import required: `Optional`, `List`.  
NOTES: Method may not exist - check if it's called by `_find_relevant_example_files()`.

### 9:
FILE: .cursor/scripts/auto-enforcer.py  
TARGET: _get_patterns_to_follow method (if exists)  
ACTION: Extract to `.cursor/enforcement/reporting/context_bundle_builder.py` as `ContextBundleBuilder._get_patterns_to_follow()` method. Change signature to: `_get_patterns_to_follow(self, task_type: Optional[str]) -> List[str]`. Preserve exact logic: pattern mapping, task type matching. Import required: `Optional`, `List`.  
NOTES: Method may not exist - check if it's called by `_get_patterns_to_follow_unified()`.

### 10:
FILE: .cursor/scripts/auto-enforcer.py  
TARGET: _detect_task_type_unified method (lines 4130-4167)  
ACTION: Extract to `.cursor/enforcement/reporting/context_bundle_builder.py` as `ContextBundleBuilder._detect_task_type_unified()` method. Change signature to: `_detect_task_type_unified(self, violations: List[Violation], git_utils) -> Optional[str]`. Accept `git_utils` parameter instead of `self.git_utils`. Preserve exact logic: violation-based detection, file change analysis, task type inference. Import required: `List`, `Violation`, `Optional`.  
NOTES: Method calls `_detect_task_type_from_violations()` and uses git_utils for file changes.

### 11:
FILE: .cursor/scripts/auto-enforcer.py  
TARGET: _load_internal_recommendations method (lines 4169-4191)  
ACTION: Extract to `.cursor/enforcement/reporting/context_bundle_builder.py` as `ContextBundleBuilder._load_internal_recommendations()` method. Change signature to: `_load_internal_recommendations(self, project_root: Path) -> Optional[Dict]`. Preserve exact logic: file path construction, JSON loading, error handling. Import required: `Path`, `Optional`, `Dict`, `json`, `logger`.  
NOTES: Method loads recommendations from internal directory.

### 12:
FILE: .cursor/scripts/auto-enforcer.py  
TARGET: _extract_context_hints_unified method (lines 4193-4218)  
ACTION: Extract to `.cursor/enforcement/reporting/context_bundle_builder.py` as `ContextBundleBuilder._extract_context_hints_unified()` method. Change signature to: `_extract_context_hints_unified(self, task_type: Optional[str], recommendations: Optional[Dict]) -> List[str]`. Preserve exact logic: base hints extraction, recommendations enhancement. Import required: `Optional`, `List`, `Dict`.  
NOTES: Method calls `_extract_context_hints()` internally.

### 13:
FILE: .cursor/scripts/auto-enforcer.py  
TARGET: _find_relevant_example_files method (lines 4220-4258)  
ACTION: Extract to `.cursor/enforcement/reporting/context_bundle_builder.py` as `ContextBundleBuilder._find_relevant_example_files()` method. Change signature to: `_find_relevant_example_files(self, task_type: Optional[str], recommendations: Optional[Dict]) -> List[str]`. Preserve exact logic: base example files, recommendations enhancement, deduplication, limiting. Import required: `Optional`, `List`, `Dict`.  
NOTES: Method calls `_get_relevant_example_files()` internally.

### 14:
FILE: .cursor/scripts/auto-enforcer.py  
TARGET: _get_patterns_to_follow_unified method (lines 4260-4280)  
ACTION: Extract to `.cursor/enforcement/reporting/context_bundle_builder.py` as `ContextBundleBuilder._get_patterns_to_follow_unified()` method. Change signature to: `_get_patterns_to_follow_unified(self, task_type: Optional[str], recommendations: Optional[Dict]) -> List[str]`. Preserve exact logic: base patterns, recommendations enhancement. Import required: `Optional`, `List`, `Dict`.  
NOTES: Method calls `_get_patterns_to_follow()` internally.

### 15:
FILE: .cursor/scripts/auto-enforcer.py  
TARGET: _compute_unified_context_bundle method (lines 4091-4128, approximately)  
ACTION: Extract to `.cursor/enforcement/reporting/context_bundle_builder.py` as `ContextBundleBuilder.build_context_bundle()` method. Change signature to: `build_context_bundle(self, violations: List[Violation], changed_files: List[str], project_root: Path, git_utils) -> Dict[str, Any]`. Preserve exact logic: task type detection, recommendations loading, hints extraction, example files finding, patterns extraction, bundle construction. Import required: `List`, `Violation`, `Path`, `Dict`, `Any`, `Optional`.  
NOTES: Main method that orchestrates context bundle computation. Returns dict with task_type, hints, relevant_files, patterns_to_follow.

### 16:
FILE: .cursor/scripts/auto-enforcer.py  
TARGET: _add_context_hints_to_report method (lines 4070-4089)  
ACTION: Extract to `.cursor/enforcement/reporting/two_brain_reporter.py` as `TwoBrainReporter._add_context_hints_to_report()` method. Change signature to: `_add_context_hints_to_report(self, report, context_bundle: Dict[str, Any]) -> None`. Accept `context_bundle` as parameter instead of computing it. Preserve exact logic: report.set_context_bundle() call. Import required: `Dict`, `Any`.  
NOTES: Method sets context bundle on report object.

### 17:
FILE: .cursor/scripts/auto-enforcer.py  
TARGET: generate_two_brain_report method (lines 4017-4068)  
ACTION: Extract to `.cursor/enforcement/reporting/two_brain_reporter.py` as `TwoBrainReporter.generate_report()` method. Change signature to: `generate_report(self, violations: List[Violation], session: EnforcementSession, enforcement_dir: Path, project_root: Path, context_bundle: Dict[str, Any]) -> Optional[EnforcerReport]`. Accept `context_bundle` as parameter instead of computing it. Preserve exact logic: two_brain_integration import, integrate_with_enforcer call, context hints addition, report saving, error handling. Import required: `List`, `Violation`, `EnforcementSession`, `Path`, `Dict`, `Any`, `Optional`, `sys`, `logger`.  
NOTES: Method must handle enforcer object creation or pass data to integration. May need to refactor `integrate_with_enforcer()` call to accept data instead of enforcer object.

### 18:
FILE: .cursor/scripts/auto-enforcer.py  
TARGET: run_all_checks method (around lines 2747-2795)  
ACTION: Update report generation calls. Replace `self.generate_agent_status()` with `StatusGenerator().generate_agent_status(self.violations, self.session, self.enforcement_dir, re_evaluate_violation_scope, save_session)`. Replace `self.generate_violations_log()` with `ViolationsLogger().generate_violations_log(self.violations, self.session, self.enforcement_dir)`. Replace `self.generate_agent_reminders()` with `BlockGenerator().generate_agent_reminders(self.violations, self.session, self.enforcement_dir)`. Replace `self.generate_auto_fixes_summary()` with `StatusGenerator().generate_auto_fixes_summary(self.session, self.enforcement_dir)`. Replace `self.generate_enforcement_block_message()` with `BlockGenerator().generate_enforcement_block_message(self.violations, self.session, self.enforcement_dir)`. Replace `self.generate_two_brain_report()` with context bundle computation and `TwoBrainReporter().generate_report(...)`.  
NOTES: Must compute context bundle before calling `generate_report()`. Must preserve handshake_generator integration.

### 19:
FILE: .cursor/scripts/auto-enforcer.py  
TARGET: VeroFieldEnforcer class  
ACTION: Remove method definitions: `generate_agent_status()`, `generate_violations_log()`, `generate_agent_reminders()`, `generate_enforcement_block_message()`, `generate_auto_fixes_summary()`, `generate_two_brain_report()`, `_add_context_hints_to_report()`, `_compute_unified_context_bundle()`, `_detect_task_type_unified()`, `_load_internal_recommendations()`, `_extract_context_hints_unified()`, `_find_relevant_example_files()`, `_get_patterns_to_follow_unified()`, `_detect_task_type_from_violations()`, `_extract_context_hints()`, `_get_relevant_example_files()` (if exists), `_get_patterns_to_follow()` (if exists).  
NOTES: All reporting methods must be removed. Only call sites should remain (updated in step 18).

### 20:
FILE: .cursor/scripts/auto-enforcer.py  
TARGET: module-level imports  
ACTION: Add imports: `from enforcement.reporting.status_generator import StatusGenerator`, `from enforcement.reporting.violations_logger import ViolationsLogger`, `from enforcement.reporting.block_generator import BlockGenerator`, `from enforcement.reporting.two_brain_reporter import TwoBrainReporter`, `from enforcement.reporting.context_bundle_builder import ContextBundleBuilder`. Place after Phase 1, 2, 3, 4 imports, before context manager imports.  
NOTES: Import paths must resolve correctly. All classes must be importable.

### 21:
FILE: .cursor/enforcement/reporting/status_generator.py  
TARGET: module-level  
ACTION: Create new file with `StatusGenerator` class. Add methods: `generate_agent_status()`, `generate_auto_fixes_summary()`. Add proper imports, docstrings, type hints.  
NOTES: File is new. Class handles status file generation.

### 22:
FILE: .cursor/enforcement/reporting/violations_logger.py  
TARGET: module-level  
ACTION: Create new file with `ViolationsLogger` class. Add method: `generate_violations_log()`. Add proper imports, docstrings, type hints.  
NOTES: File is new. Class handles violations log generation.

### 23:
FILE: .cursor/enforcement/reporting/block_generator.py  
TARGET: module-level  
ACTION: Create new file with `BlockGenerator` class. Add methods: `generate_agent_reminders()`, `generate_enforcement_block_message()`. Add proper imports, docstrings, type hints.  
NOTES: File is new. Class handles block file generation.

### 24:
FILE: .cursor/enforcement/reporting/context_bundle_builder.py  
TARGET: module-level  
ACTION: Create new file with `ContextBundleBuilder` class. Add methods: `build_context_bundle()`, `_detect_task_type_unified()`, `_load_internal_recommendations()`, `_extract_context_hints_unified()`, `_find_relevant_example_files()`, `_get_patterns_to_follow_unified()`, `_detect_task_type_from_violations()`, `_extract_context_hints()`, `_get_relevant_example_files()` (if exists), `_get_patterns_to_follow()` (if exists). Add proper imports, docstrings, type hints.  
NOTES: File is new. Class handles context bundle computation for Two-Brain integration.

### 25:
FILE: .cursor/enforcement/reporting/two_brain_reporter.py  
TARGET: module-level  
ACTION: Create new file with `TwoBrainReporter` class. Add methods: `generate_report()`, `_add_context_hints_to_report()`. Add proper imports, docstrings, type hints. Handle `integrate_with_enforcer()` call - may need to refactor to accept data instead of enforcer object, or create enforcer-like object with required attributes.  
NOTES: File is new. Class handles Two-Brain report generation. Integration with `two_brain_integration.py` must be preserved.

### 26:
FILE: .cursor/enforcement/reporting/__init__.py  
TARGET: module-level  
ACTION: Create new file (if doesn't exist) or update existing. Add exports: `from .status_generator import StatusGenerator`, `from .violations_logger import ViolationsLogger`, `from .block_generator import BlockGenerator`, `from .two_brain_reporter import TwoBrainReporter`, `from .context_bundle_builder import ContextBundleBuilder`.  
NOTES: This enables clean imports from `enforcement.reporting` namespace.

---

## 4. TEST_PLAN

After applying the contract, Execution Brain must run:

- `python .cursor/scripts/auto-enforcer.py --scope current_session --user-message "Phase 5 test"`
- `python .cursor/scripts/auto-enforcer.py --scope full --user-message "Phase 5 full scan"`
- Verify: `.cursor/enforcement/AGENT_STATUS.md` is generated with correct structure
- Verify: `.cursor/enforcement/VIOLATIONS.md` is generated with correct structure
- Verify: `.cursor/enforcement/ENFORCER_REPORT.json` is generated with correct JSON structure
- Verify: `.cursor/enforcement/ENFORCEMENT_BLOCK.md` is generated (if violations exist) or removed (if no violations)
- Verify: `.cursor/enforcement/AGENT_REMINDERS.md` is generated
- Verify: `.cursor/enforcement/AUTO_FIXES.md` is generated
- Verify: `.cursor/enforcement/ENFORCER_STATUS.md` is generated (via handshake_generator)
- Verify: `.cursor/enforcement/ACTIVE_VIOLATIONS.md` is generated (via handshake_generator)
- Verify: `.cursor/enforcement/ACTIVE_CONTEXT_DUMP.md` is generated (via handshake_generator)
- Verify: ENFORCER_REPORT.json has correct structure (violations array, context_bundle with task_type, hints, relevant_files, patterns_to_follow)
- Verify: Violation scope re-evaluation works (check that scopes are updated in AGENT_STATUS.md)
- Verify: Two-Brain integration works (check that report can be loaded and parsed)
- Verify: Context bundle computation works (check that context_bundle contains expected fields)
- Verify: No import errors: `python -c "from enforcement.reporting.status_generator import StatusGenerator; print('Imports OK')"`
- Verify: Report generation error handling (corrupt data, verify graceful failure without breaking run)
- Verify: File content matches original (compare generated files before/after extraction)

---

END_EXECUTION_CONTRACT




