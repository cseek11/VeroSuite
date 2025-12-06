
## 1. Current State Overview

**Short narrative**

The auto-enforcer is a single-process, synchronous Python script (`.cursor/scripts/auto-enforcer.py`) that orchestrates modular and legacy checkers over a Git-derived set of “changed files”. The date checker and error-handling checker are wired as **non-critical legacy checks**, driven by Git-based change detection and a session object. Historical/archived paths are filtered via shared utilities, but those filters are not consistently applied across all checker paths, which contributes to noise.

**Key points**

- **How checks are wired and scoped**
  - **Entry point:** `VeroFieldEnforcer.run_all_checks(scope=...)` in `auto-enforcer.py`.
  - **Scope handling:**
    - `scope == "current_session"`:
      - Uses `_get_changed_files_for_session()` → `get_changed_files_impl(project_root, include_untracked=...)` to build `all_changed_files` (tracked ∪ untracked).
      - Always runs **non-critical checks** (no skipping) by setting `skip_non_critical = False`.
      - Builds `classification_map = git_utils.get_changed_file_classifications()`.
    - `scope != "current_session"` (“full” scan):
      - Uses git state key (`get_git_state_key`) + `GitUtils.update_cache()` / `get_cached_changed_files()` to get:
        - `tracked_files`, `untracked_files_list`, `all_changed_files = tracked + untracked`.
      - Computes `changed_files_count = len(tracked_files)` and `has_untracked`.
      - Sets `skip_non_critical = changed_files_count > 100 and not has_untracked`.
  - **Checker dispatch:**
    - If modular checkers are available: `_run_modular_checkers(all_changed_files, user_message, skip_non_critical, violation_scope, classification_map)`.
    - Otherwise: `_run_legacy_checks(skip_non_critical, violation_scope, classification_map)`.

- **Where the date checker is wired**
  - In `_run_legacy_checks` (same file), legacy checker instances are created:
    - `date_checker = DateChecker(current_date=self.CURRENT_DATE)`
    - `error_checker = ErrorHandlingChecker()`, etc.
  - `DateChecker.check_hardcoded_dates(...)` is added to `non_critical_checks`:
    - Called with `changed_files=changed_files_with_untracked`, `project_root`, `session`, `git_utils`, `enforcement_dir`, `violation_scope`, `classification_map`.
  - `CURRENT_DATE` is a class-level constant on the enforcer: `datetime.now().strftime("%Y-%m-%d")`, and is passed into `DateChecker(current_date=self.CURRENT_DATE)`.

- **How `_get_context_metrics_for_audit` and `dashboard.md` are used**
  - `get_context_metrics_for_audit(self) -> Dict` in `auto-enforcer.py`:
    - Produces a dict with `context_usage`, `token_statistics`, `compliance`, and `available/error` flags.
    - Reads `.cursor/context_manager/recommendations.md` to infer:
      - Active/preloaded/unloaded context files (by parsing sections).
    - Optionally uses `context_manager.token_estimator.TokenEstimator` to compute token counts and savings.
    - Reads `.cursor/context_manager/dashboard.md` to infer compliance booleans:
      - If file exists and content does not contain placeholder markers (`[Will be populated`, `[Count]`), sets:
        - `step_0_5_completed = True`, `step_4_5_completed = True`, `recommendations_followed = True`.
  - **Error handling:**
    - Early exits if predictive context is not available or no `preloader`, setting `metrics['available'] = False` and `metrics['error']` accordingly, then `return`.
    - Wraps the entire file-reading & parsing block (recommendations + token stats + dashboard) in a single `try/except Exception`:
      - On any exception, logs `operation="get_context_metrics_for_audit"` with `error_code="CONTEXT_METRICS_FAILED"` and returns the partially filled `metrics` object.
      - The `dashboard.md` read is **inside** this outer `try`, so any unexpected I/O errors are caught and logged (no crash), but they are classified generically.

- **How ErrorHandlingChecker fits into the pipeline**
  - Implementation: `enforcement/checks/error_handling_checker.py`, class `ErrorHandlingChecker`.
  - Signature: `check_error_handling(changed_files: List[str], project_root: Path, git_utils: GitUtils, is_file_modified_in_session_func: Callable[[str], bool]) -> List[Violation]`.
  - In `_run_legacy_checks`, an instance is created and wired as **non-critical**:
    - Called with `changed_files_tracked` (after `_filter_files`), `project_root`, `git_utils`, `is_file_modified_in_session` (from `enforcement/core/file_scanner.py`).
  - Output:
    - Emits `Violation` objects with `severity=ViolationSeverity.WARNING`, `rule_ref="06-error-resilience.mdc"`, and message `Error-prone operation without error handling: {pattern}`.
    - No BLOCKED violations are produced by this checker.
  - These warnings are surfaced in `.cursor/enforcement/ACTIVE_VIOLATIONS.md` (e.g., the entries you see for `auto-enforcer.py` and many archived scripts).

- **Where archived / historical / backup paths are configured**
  - **Directory-level / documentation-level heuristics:** `enforcement/core/scope_evaluator.py`
    - `HISTORICAL_DOCUMENT_DIR_PATTERNS`:
      - `docs/auto-pr/`, `docs/archive/`, `docs/historical/`.
    - `is_historical_dir_path(path_value)`:
      - Normalizes separators and case, returns `True` if any configured historical directory substring is in the path.
    - `is_historical_document_file(file_path: Path)`:
      - Treats files as historical if:
        - Located under a historical directory, or
        - Filename matches date patterns (`YYYY-MM-DD`, `MM-DD-YYYY`, etc.), or
        - Has certain prefixes (`document_`, `report_`, `entry_`, etc.) combined with year-like tokens, or
        - Ends with `_report` or is under `docs/reference/`.
    - `is_log_file(file_path: Path)`:
      - Treats specific log-like filenames and any `memory-bank` paths as log files where historical dates should be preserved.
    - `is_documentation_file(file_path: Path)`:
      - Treats `.md` docs and several doc-like patterns/dirs as documentation.
  - **Pattern-based historical paths:** `enforcement/core/historical.py`
    - `DEFAULT_PATTERNS`:
      - `.cursor__archived_2025-04-12/**`, `docs/archive/**`, `.ai/memory_bank/**`, `.ai/rules/**`, `.ai/patterns/**`.
    - Configurable extension via `.cursor/enforcement/historical_paths.yaml` (if present).
    - `is_historical_path(path_str: str)`:
      - Normalizes slashes and applies `fnmatch` against all patterns.
  - **Usage:**
    - `DateChecker.check_hardcoded_dates`:
      - Uses both `is_historical_dir_path` and `is_historical_path` in a **pre-filter** on `changed_files`.
      - Uses `DocumentContext` (from `enforcement.date_detector`) to treat individual files as `is_log_file` / `is_historical_doc`.
    - `_run_legacy_checks`:
      - `_filter_files` uses `is_historical_dir_path` and `is_historical_path` to shorten `changed_files_tracked` and `changed_files_with_untracked` before passing into legacy checkers.
    - Despite this, current ACTIVE_VIOLATIONS show many warnings for `.cursor__archived_2025-04-12/...`, indicating that:
      - Either some checker paths bypass `_filter_files` (e.g., modular equivalents), or
      - Some archived files are still ending up in `changed_files` lists due to Git status and not being filtered at checker level.

- **Existing parallelism / concurrency**
  - All checker orchestration is **sequential**:
    - `_run_legacy_checks`:
      - Defines `critical_checks` and `non_critical_checks` as lists of `(name, callable)` pairs.
      - Iterates with `for check_name, check_callable in critical_checks: run_check(check_name, check_callable)` and then (optionally) the same for `non_critical_checks`.
      - `run_check` calls each callable synchronously and logs/report success/failure.
    - `_run_modular_checkers`:
      - Retrieves `checkers_to_run` from `checker_router` and iterates with a simple `for idx, checker in enumerate(checkers_to_run, 1)`, invoking each checker sequentially.
  - There is **no use** of `ThreadPoolExecutor`, `multiprocessing`, async tasks, or similar concurrency primitives in the enforcement pipeline.
  - Git commands are cached via `functools.lru_cache` (`run_git_command_cached`) and `GitUtils` instance-level caches, but checkers themselves are run one after the other in a single process.


---

## 2. Date Checker Analysis & Design

### 2.1 Behavioral reconstruction (current implementation)

**Core objects and inputs**

- **File:** `enforcement/checks/date_checker.py`.
- **Main entry:** `DateChecker.check_hardcoded_dates(changed_files, project_root, session, git_utils, enforcement_dir, violation_scope="current_session", classification_map=None)`.
- **CURRENT_DATE:**
  - Passed in from `VeroFieldEnforcer.CURRENT_DATE`, which is `datetime.now().strftime("%Y-%m-%d")` (UTC-agnostic date string).
  - Used as `self.CURRENT_DATE` throughout the checker.
- **Supporting helpers:**
  - `is_file_modified_in_session(file_path, session, project_root, git_utils)` from `enforcement/core/file_scanner.py`.
  - `is_historical_dir_path`, `is_historical_document_file`, `is_log_file`, `is_documentation_file` from `enforcement/core/scope_evaluator.py`.
  - `is_historical_path` from `enforcement/core/historical.py`.
  - `FileChangeType` + `classify_file_change(...)` from `enforcement/core/file_classifier.py`.
  - `DateDetector`, `DateMatch`, `DateClassification`, `DocumentContext` from `enforcement/date_detector.py`.

**File-level flow in `check_hardcoded_dates`**

1. **Tracked vs untracked splitting & cap:**
   - Executes `git_utils.run_git_command(['ls-files'])` to get **all tracked files**.
   - Splits `changed_files` into `untracked_files` (not in ls-files output) and `tracked_files` (in ls-files output).
   - If there are more than 50 tracked files:
     - Logs a warning and truncates `tracked_files` to the first 50.
   - Rebuilds `changed_files = untracked_files + tracked_files`.

2. **Historical and archival filtering:**
   - Iterates over the updated `changed_files`:
     - Skips any path where:
       - `is_historical_dir_path(file_path_str)` is `True`, or
       - `is_historical_path(file_path_str)` is `True`.
   - Records how many files were filtered as `skipped_files`.
   - If `classification_map` is provided, **further filters** `changed_files`:
     - Keeps only files classified as `"CONTENT_CHANGED"` or `"NEW_FILE"` and *not* matching `is_historical_path`.

3. **File modification cache (per run):**
   - For each file in `changed_files`:
     - Computes `file_modification_cache[normalized_path] = is_file_modified_in_session(file_path_str, session, project_root, git_utils)`.
     - Stores both normalized and original path keys for compatibility.
   - Logs how many files are considered “modified” in this precomputed cache.

4. **Detector and document context**
   - Instantiates `detector = DateDetector(current_date=self.CURRENT_DATE)` if the optional dependency is available.
   - Uses a `doc_context_cache` of `DocumentContext(file_path)` objects.
   - Defines `excluded_dirs` for enforcement / archive / backup areas:
     - `enforcement_dir`, `project_root/.cursor/archive`, `project_root/.cursor/backups`.

5. **Per-file processing loop**
   - For each `file_path_str` in `changed_files`:
     - Skips non-existent files, directories, and certain binary/doc types (`.png`, `.jpg`, `.gif`, `.ico`, `.pdf`).
     - Skips any file under `excluded_dirs`.
     - Skips `.ai/memory_bank` paths explicitly.
     - Looks up `file_modified` via `file_modification_cache` (normalized path).
       - If `file_modified` is `False`, logs and **skips the file entirely**.
     - If `DocumentContext` is available:
       - Retrieves `doc_context = DocumentContext(file_path)` from cache.
       - Logs doc context info (is_log_file, is_historical_doc).
       - If `doc_context.is_log_file` or `doc_context.is_historical_doc` is `True`, **skips the file**.
     - Fallback (no DocumentContext): uses `is_log_file(file_path)` and `is_historical_document_file(file_path)` to skip logs/historical docs.
     - Uses `is_historical_dir_path(file_path)` again to skip historical directories.
     - Calls `classify_file_change(...)`:
       - Skips files with change types: `MOVED_OR_RENAMED_ONLY`, `UNTOUCHED`, `DELETED`, `GENERATED`, `THIRD_PARTY`, `HISTORICAL`.
       - Only continues for `CONTENT_CHANGED` and `NEW_FILE`.
     - Performs a **final defensive log-file check** (either via `doc_context.is_log_file` or `is_log_file`).

6. **Line-level date scanning (primary path with DateDetector)**
   - Inside a `try`:
     - If both `detector` and `doc_context` are available:
       - Reads the file content into a single string.
       - Gets `date_matches = detector.find_dates(file_content, context_lines=3)`.
       - For each `date_match`:
         - Verifies `date_match.line_number` is a valid int; otherwise logs an error and skips.
         - Gets `line = date_match.line_content`.
         - Skips self-referential date patterns in `auto-enforcer.py` (to avoid self-flagging).
         - If `file_modified` is `False` (should not occur due to earlier check), it would skip all lines (defensive).
         - If `classification_map is not None`, sets `line_changed = True` (i.e., bypasses line-level diff gating).
         - Otherwise, computes:
           - `line_changed = git_utils.is_line_changed_in_session(file_path_str, line_num, session_start)`.
           - Skips lines where `line_changed` is `False`.
         - Classifies the date: `classification = detector.classify_date(date_match, doc_context)`.
         - Checks for `"Last Updated"` and report-style metadata:
           - `is_last_updated = re.search(r'last\s+updated\s*:', line, re.IGNORECASE)`.
           - `is_report_metadata = re.search(r'\*\*(date|created|updated|generated|report|validated)[:*]\s*', ...)`.
         - If `classification` is `HISTORICAL` or `EXAMPLE`, logs debug and skips.
         - If `is_report_metadata` is `True`, logs debug and skips.
         - **Last Updated branch (critical):**
           - If `is_last_updated`:
             - If `doc_context.is_log_file` is `True`, **continues** (skips logs).
             - Else:
               - If `date_match.date_str != self.CURRENT_DATE`:
                 - Adds a **BLOCKED** violation: `'Last Updated' field modified but date not updated to current: ...`.
               - Else (i.e., `date_match.date_str == self.CURRENT_DATE`):
                 - Adds a **BLOCKED** violation: `'Last Updated' field should be updated to current date (...) since file was modified` — **even though the date already equals CURRENT_DATE**.
             - Continues to next match.
         - **Other “current” date branch:**
           - If `classification == DateClassification.CURRENT` and `date_match.date_str != self.CURRENT_DATE`:
             - Adds a **BLOCKED** violation: `"Hardcoded date found in modified line: {date_str} (current date: {CURRENT_DATE})"`.

7. **Line-level date scanning (fallback path without DateDetector/DocumentContext)**
   - If `detector` or `doc_context` is not available:
     - Uses `is_log_file` again to skip logs.
     - Reads file line-by-line:
       - Maintains `in_code_block` markers on triple backticks to skip example code in docs.
       - If `HARDCODED_DATE_PATTERN` matches:
         - Skips self-referential patterns in `auto-enforcer.py`.
         - Uses `git_utils.is_line_changed_in_session(...)` unless `classification_map` is provided (in which case `line_changed = True`).
         - Skips lines recognized as historical via `_is_historical_date_pattern(line)` and report metadata.
         - For docs (`is_documentation_file`) inside code blocks, skips lines.
         - For `"Last Updated"` lines:
           - Skips if log file.
           - Extracts `date_str` from HARDCODED_DATE_PATTERN.
           - If `date_str != self.CURRENT_DATE`, adds **BLOCKED** violation `'Last Updated' field modified but date not updated to current: {date_str} ...`.
           - Note: there is **no explicit second-branch** here for `date_str == CURRENT_DATE`; in that case, no violation is added.

8. **Other date-related behaviors**
   - `_is_historical_date_pattern`:
     - Uses multiple consolidated or legacy patterns to classify lines as historical.
     - Uses `_is_date_future_or_past(date_str)`:
       - Marks as historical-like if:
         - Difference vs `CURRENT_DATE` > 1 day in the future, or
         - Difference < -365 days in the past.
   - Overall, the date checker tries to:
     - Avoid touching historical docs, logs, memory bank, and example docs.
     - Enforce that “current” dates in modified lines must match `CURRENT_DATE`.
     - Enforce that `"Last Updated"` fields for modified files must be “current” — but the implementation has a logic bug for the matching-current-date case.

### 2.2 Root cause for “Last Updated” false positives

- **Key bug: unconditional BLOCKED when Last Updated == CURRENT_DATE in the detector path**
  - In the main (DateDetector) path, the `"Last Updated"` branch is:

    - If `date_match.date_str != CURRENT_DATE` → BLOCKED violation (“date not updated to current”).
    - Else (i.e., `date_match.date_str == CURRENT_DATE`) → BLOCKED violation (“should be updated to current date since file was modified”).

  - There is no “clean” path where a Last Updated line **with the current date** is considered compliant; any detected `Last Updated` line in a modified file produces a BLOCKED violation.

- **File-modified semantics are conflated with Last Updated semantics**
  - `file_modified` gating already ensures:
    - Only **files** considered modified in the current session are checked.
  - In addition, line-level gating is:
    - Bypassed when `classification_map` is provided (`line_changed = True`), meaning any date match in such files is considered “in scope”.
  - The code then assumes:
    - If the file is modified and the Last Updated line exists, **any** observation of that Last Updated line implies it should have been changed this run.
    - This conflates:
      - “File was modified for some reason” with
      - “Last Updated line was touched and needs a new date”.

- **Fallback path asymmetry**
  - In the fallback path (no DateDetector/DocumentContext), Last Updated lines only produce violations when `date_str != CURRENT_DATE`.
  - So a file using this path with `Last Updated: CURRENT_DATE` would **not** be flagged, but an equivalent file going through the DateDetector path **is** flagged.
  - This asymmetry creates inconsistent behavior depending on dependency availability.

- **Practical symptom**
  - Any document that:
    - Was modified in the session,
    - Contains a `Last Updated` line with today’s date,
    - Is not classified as log/historical/report metadata,
  - Will still emit a BLOCKED violation, making it impossible to reach an APPROVED state for such files even if they are perfectly compliant.

### 2.3 Target semantics (proposed rules)

**High-level goals**

- **Only flag Last Updated when it’s actually stale or missing where required.**
- **Do not flag Last Updated when it already equals CURRENT_DATE.**
- **Respect logs/historical/docs/generation semantics.**

**Proposed rules**

1. **File-level eligibility (unchanged)**
   - A file is eligible for Last Updated checks if:
     - It passes all existing filters:
       - Not under historical/archived patterns (`is_historical_path`, `is_historical_dir_path`).
       - Not classified as historical document or log file by `DocumentContext` or fallback helpers.
       - Has change type `CONTENT_CHANGED` or `NEW_FILE`.
       - Is actually modified in the current session (`is_file_modified_in_session`).
   - **Rationale:** The existing gating is already quite strict; we preserve it.

2. **Last Updated validation (core semantic change)**
   - For each eligible Last Updated match in such a file:

     - **Case A: `date_str == CURRENT_DATE`**
       - **No violation.**
       - We treat this as compliant, regardless of whether other lines also changed.
       - Optional: we may (later) record this as low-level diagnostic info, but it must not be BLOCKED or WARNING.

     - **Case B: `date_str < CURRENT_DATE` (or simply `date_str != CURRENT_DATE`)**
       - **BLOCKED violation** with a clear message, e.g.:
         - “File was modified in this session but 'Last Updated' is stale: {date_str} (expected {CURRENT_DATE}).”
       - This replaces the current generic “should be updated” message.
       - Behavior should be consistent across both DateDetector and fallback paths.

     - **Case C: `date_str` parsed as clearly future/past relative to CURRENT_DATE beyond tolerated thresholds**
       - If classification logic marks it as historical (HISTORICAL/EXAMPLE) or `_is_date_future_or_past` returns `True` and the context indicates a “historical log” or “version history” snippet, keep the current behavior of skipping.
       - That is, Last Updated lines in clear historical logs that are not meant to track “current doc freshness” should be exempt.

3. **Missing Last Updated in files that require it**
   - Introduce a **doc-type-specific rule**, enabled only for certain files (e.g. rule docs, core enforcement docs, main project docs), that:
     - For eligible modified files that:
       - Are clearly documentation (e.g. `is_documentation_file(file_path)` or more constrained subset like `.ai/rules/**` and core enforcement docs).
       - Are not logs/historical.
       - Contain **no** “Last Updated” line at all.
     - Emit:
       - Either a **WARNING** or a low-priority **BLOCKED** (depending on how strict you want to be) that says:
         - “Documentation file modified in current session but missing a 'Last Updated' field; add one with today’s date.”
   - Scope this rule via configuration (e.g., allowlist of directories that must have Last Updated) to avoid over-enforcing on incidental docs.

4. **Behavior for unchanged vs modified files**
   - Files that are not considered modified in the session (`file_modified == False`) should:
     - Skip Last Updated checks entirely (as is currently done).
     - This already prevents enforcement from retroactively requiring date updates for untouched docs across sessions.

5. **Historical/archived docs and logs**
   - Preserve and clarify current behavior:
     - If a file is:
       - Under historical/archived paths (`is_historical_path` or `is_historical_dir_path`), or
       - Classified as historical document (`doc_context.is_historical_doc` or `is_historical_document_file`), or
       - Classified as log-like (`doc_context.is_log_file` or `is_log_file`),
     - Then **Last Updated lines are treated as historical data**:
       - No requirement to match CURRENT_DATE.
       - No requirement to exist.
       - No Last Updated violations should be emitted.

6. **Generated docs (e.g. context dashboard)**
   - For auto-generated dashboards like `.cursor/context_manager/dashboard.md`:
     - Ensure:
       - They either go through the same Last Updated rules and remain compliant (which they do today, as they embed `self.CURRENT_DATE` as the date component).
       - Or, if desired, mark them as “generated” via classification (`FileChangeType.GENERATED`) so they can be excluded from Last Updated enforcement and treated separately.

7. **Pure moves/renames with no content changes**
   - Current behavior already relies on:
     - `classify_file_change` and `is_file_modified_in_session` to differentiate moved-only files.
   - Confirmed desired semantics:
     - Files classified as `MOVED_OR_RENAMED_ONLY` (or where Git shows only rename and no content change) should not be required to update Last Updated, and should not be flagged.
     - Existing classification-based gating already aims to do this; any lingering false positives should be addressed via improved integration between date checker and file classifier (not by changing Last Updated rules themselves).

---

## 3. Context Metrics I/O Design

### 3.1 Current control flow and I/O

**Function:** `VeroFieldEnforcer.get_context_metrics_for_audit(self) -> Dict` in `.cursor/scripts/auto-enforcer.py`.

**Inputs and outputs**

- Returns a `metrics` dict with:
  - `context_usage` (lists of active/preloaded/unloaded files + counts).
  - `token_statistics` (active, preloaded, total, static_baseline, savings_tokens, savings_percentage).
  - `compliance` flags (step_0_5_completed, step_4_5_completed, recommendations_followed).
  - `available` flag and `error` string.

**Execution steps**

1. **Availability checks:**
   - If `PREDICTIVE_CONTEXT_AVAILABLE` is `False`:
     - Sets `metrics['available'] = False`, `metrics['error'] = "... not initialized"` and returns early.
   - If `self.preloader` is `None`:
     - Sets `metrics['available'] = False`, `metrics['error'] = "... not fully initialized"` and returns early.

2. **Main metrics computation (`try/except` block):**
   - Entire remainder of the method is wrapped in `try: ... except Exception as e: ...`:
     - On any exception, logs `operation="get_context_metrics_for_audit"`, `error_code="CONTEXT_METRICS_FAILED"`, `root_cause=str(e)`.
     - Returns `metrics` as-is (with `available=True` but no specific `error` populated).

3. **Recommendations file (`recommendations.md`):**
   - `recommendations_file = self.project_root / ".cursor" / "context_manager" / "recommendations.md"`.
   - If it does **not** exist:
     - Calls `self.git_utils.get_changed_files(include_untracked=False)`; if there are changed files and `self.predictor` is present:
       - Attempts `self._update_context_recommendations()` in a nested `try/except`, swallowing all exceptions.
       - Sleeps briefly (0.1s) to allow file writes; no explicit error logging for this sub-step.
   - If `recommendations_file.exists()`:
     - Opens it (`with open(..., 'r', encoding='utf-8') as f:`) and reads content.
     - Parses out:
       - Active context section.
       - Pre-loaded context section.
       - Context to unload section.
     - Populates corresponding lists and counts in `metrics['context_usage']`.

4. **Token statistics:**
   - Within its own `try/except`:
     - Attempts to import and instantiate `context_manager.token_estimator.TokenEstimator`.
     - Calls `track_context_load` on `active_files` and `preloaded_files`.
     - Derives:
       - `active_tokens`, scaled `preloaded_tokens`, `total_tokens`, `static_baseline`, and `savings_*`.
   - On any exception:
     - Logs a debug message with `operation="get_context_metrics_for_audit"`, `error_code="TOKEN_STATS_FAILED"`, and `root_cause`.

5. **Dashboard file (`dashboard.md`):**
   - `dashboard_file = self.project_root / ".cursor" / "context_manager" / "dashboard.md"`.
   - If `dashboard_file.exists()`:
     - Opens and reads it (`with open(dashboard_file, 'r', encoding='utf-8') as f:`).
     - If content does **not** contain placeholders like `[Will be populated` or `[Count]`:
       - Sets `metrics['compliance']['step_0_5_completed'] = True`.
       - Sets `metrics['compliance']['step_4_5_completed'] = True`.
       - Sets `metrics['compliance']['recommendations_followed'] = True`.

6. **Error handling coverage**
   - Any exception thrown while:
     - Opening/reading `recommendations.md`,
     - Parsing its content,
     - Instantiating or using `TokenEstimator`,
     - Opening/reading `dashboard.md`,
   - Will be caught by the **outer** `except Exception as e`, logged at debug level with `error_code="CONTEXT_METRICS_FAILED"`, and will not crash the enforcer.
   - However:
     - `metrics['available']` remains `True` and `metrics['error']` remains `None` even when the whole operation fails, which can be misleading.
     - `dashboard.md` is not given its own granular error classification; it is lumped into generic `CONTEXT_METRICS_FAILED`.

### 3.2 Risk assessment

- **Missing `recommendations.md`**
  - Already handled gracefully:
    - Attempts to regenerate recommendations if there are changed files and a predictor.
    - If regeneration fails or file still missing:
      - Metrics remain with empty context lists and zeros for token statistics.
      - No crash; only debug logs.
  - Improvement opportunity:
    - Expose a clearer status in `metrics['available']`/`['error']` when recommendations cannot be read (e.g., mark partially available vs fully available).

- **Missing or locked `dashboard.md`**
  - Current behavior:
    - If file does not exist: skip the `open` entirely, leaving `compliance` flags at `False`.
    - If a TOCTOU race or permission error occurs between `exists()` and `open()`:
      - Outer `try` catches the exception.
      - Logs a debug message with `error_code="CONTEXT_METRICS_FAILED"`.
      - Returns `metrics` without setting `available=False` or `error`.
  - Risk:
    - No crash, but audit callers may interpret `available=True` without an `error` message as “all good” even when metrics are incomplete.
    - Diagnostics for dashboard-specific failures are indistinguishable from other recommendation/token issues.

- **Partial/corrupt contents**
  - If `recommendations.md` or `dashboard.md` contain unexpected content:
    - Parsing may raise exceptions (e.g., IndexError when splitting sections).
    - Such issues are caught by the outer `try`, but again only a generic `CONTEXT_METRICS_FAILED` debug log is produced.

- **Dependence on external modules**
  - `TokenEstimator` is optional; its import is already guarded with a nested `try/except` that logs and continues.

### 3.3 Proposed I/O guard pattern and invariants

**Design goals**

- **Never crash** due to missing/locked/corrupt metrics files.
- **Accurately reflect availability** in `metrics['available']` and `metrics['error']`.
- **Provide granular diagnostics** for recommendations- vs dashboard-related failures.
- **Keep behavior consistent across contexts** (e.g., CLI audit tools and potential API consumers).

**Recommended pattern**

1. **Explicit sub-step error flags**
   - Introduce internal flags within `get_context_metrics_for_audit`, e.g.:
     - `recommendations_ok`, `token_stats_ok`, `dashboard_ok`.
   - Initialize them to `True`, and set them to `False` inside their own `except` blocks.

2. **Narrow try/except scopes**
   - Instead of a single large `try` around all logic:
     - Use **three nested try blocks**, each with its own `error_code` and log message:
       - `RECOMMENDATIONS_READ_FAILED` for reading/parsing `.cursor/context_manager/recommendations.md`.
       - `TOKEN_STATS_FAILED` (already in place) for `TokenEstimator` logic.
       - `DASHBOARD_READ_FAILED` for `.cursor/context_manager/dashboard.md`.
   - Keep an outer `try` only if truly needed for unexpected failures around orchestrating these sub-steps.

3. **Granular logging**
   - For each failure:
     - Log at `logger.debug` or `logger.warn` with:
       - `operation="get_context_metrics_for_audit"`.
       - `file_path` (where applicable).
       - `error_code` (e.g., `DASHBOARD_READ_FAILED`).
       - `root_cause=str(e)`.

4. **Accurate `available` / `error` fields**
   - Define invariants:
     - `metrics['available'] = False` when:
       - Predictive context system is not initialized (`PREDICTIVE_CONTEXT_AVAILABLE` is False), or
       - `preloader` is missing, or
       - **Both** recommendations and dashboard reads fail (no reliable context metrics).
     - `metrics['available'] = True` but `metrics['error']` is a non-empty string when:
       - Some parts succeeded (e.g., recommendations read) but others failed (e.g., dashboard).
   - Compose `metrics['error']` as a short code or joined list, such as:
     - `"recommendations_read_failed"`, `"dashboard_read_failed"`, or `"recommendations_read_failed;dashboard_read_failed"`.

5. **Dashboard-specific behavior**
   - For `dashboard.md`:
     - Wrap `open` in a dedicated try/except for `OSError`, `UnicodeDecodeError`, etc.
     - If `exists()` is `True` but `open` fails:
       - Set `dashboard_ok = False`.
       - Log `error_code="DASHBOARD_READ_FAILED"`.
       - Do **not** crash; leave `compliance` flags at `False`.
   - Optionally, treat an unreadable dashboard as a weaker form of unavailability:
     - Keep `available=True` if recommendations and token stats succeeded.
     - But include `"dashboard_read_failed"` in `metrics['error']`.

6. **Stable behavior for missing files**
   - Maintain best-effort semantics:
     - If `recommendations.md` or `dashboard.md` truly do not exist, do not consider that a “hard error” unless they are expected by the current deployment mode.
     - Instead, differentiate:
       - “File not present yet” (common during initial setup) vs “file present but unreadable/corrupt”.
     - This can be encoded in log messages and error codes but does not need to complicate the metrics dict beyond an informative `error` message.

**Invariants after refactor**

- `get_context_metrics_for_audit`:
  - **Never** raises unhandled exceptions due to metrics I/O.
  - Always returns a metrics dict with:
    - Correct `available` boolean.
    - Informative `error` message when any sub-component fails.
    - Best-effort values for context usage and token statistics when possible.
  - Distinguishes:
    - Predictive context system unavailable (hard no).
    - Context system available but metrics partially degraded (soft failure).
    - Fully available metrics (ideal case).


---

## 4. ErrorHandlingChecker Analysis & Design

### 4.1 Current behavior

**Implementation overview**

- **File:** `enforcement/checks/error_handling_checker.py`.
- **Entry point:** `ErrorHandlingChecker.check_error_handling(changed_files, project_root, git_utils, is_file_modified_in_session_func) -> List[Violation]`.

**Pattern and context logic**

- **Input file set:**
  - `_run_legacy_checks` passes `changed_files_tracked`, which is:
    - Derived from `raw_changed_tracked = git_utils.get_changed_files(include_untracked=False)`.
    - Filtered via `_filter_files`, which rejects paths that:
      - Match `is_historical_dir_path(norm)` or `is_historical_path(norm)`.
  - Within the checker:
    - `session_modified_files = [f for f in changed_files if is_file_modified_in_session_func(f)]`.
    - Only these `session_modified_files` are inspected.

- **Error-prone patterns (hard-coded):**
  - `error_prone_patterns = [`
    - `r'await\s+\w+\('`,  (any simple `await foo(` call)
    - `r'subprocess\.(run|call|Popen)'`,
    - `r'open\('`,
    - `]`.
  - No distinction between context-managed vs bare `open`, or between safe vs unsafe `await`/`subprocess` usages.

- **File type gating:**
  - Skips files that:
    - Do not exist, or
    - Have suffix not in `['.py', '.ts', '.tsx', '.js', '.jsx']`.

- **Error-handling pattern detection:**
  - For Python (`.py`):
    - `error_handling_patterns = [r'try\s*:', r'try\s*\n']`.
  - For TypeScript/JS:
    - `error_handling_patterns = [r'try\s*\{', r'try\s*\n\s*\{', r'catch\s*\(', r'catch\s*\{']`.

- **Context window:**
  - Reads file into `lines = list(f)`.
  - For each error-prone pattern:
    - Iterates over every line, looking for the pattern.
    - When a match is found at `line_num`:
      - Builds a context window from `line_num - 10` to `line_num + 10`.
      - `has_error_handling = any(re.search(eh_pattern, context, re.MULTILINE) for eh_pattern in error_handling_patterns)`.
      - If `has_error_handling` is `False`:
        - Emits a single `Violation` for that occurrence.

- **Output**
  - All emitted violations are:
    - `severity=ViolationSeverity.WARNING`.
    - `rule_ref="06-error-resilience.mdc"`.
    - `message=f"Error-prone operation without error handling: {pattern}"`.
    - `session_scope="current_session"`.

- **Error handling in checker itself**
  - Wraps the per-file processing in `try/except` for I/O errors:
    - `except (FileNotFoundError, PermissionError, OSError, UnicodeDecodeError) as exc:`
      - Logs a warning and continues.
  - Does not crash on unreadable files.

### 4.2 Noise sources and limitations

1. **Context managers not recognized**
   - `open(` is treated as error-prone even when safely used inside context managers:
     - `with open(path) as f:` matches `open(`, and the context window might not contain an actual `try` if the code relies on context managers rather than try/except.
   - For many Python codebases, using `with open(...)` is idiomatic and safe without outer try blocks, so these flags are noisy.

2. **Coarse “await” pattern**
   - `await\s+\w+\(` matches any awaited function call:
     - Even wrappers like `await safe_request()` or `await api_client.get()` that internally handle errors.
   - Without an allowlist of safe wrapper functions or a better understanding of error propagation, warnings become extremely broad.

3. **Subprocess usage**
   - Any `subprocess.run/call/Popen` is considered error-prone unless a `try`/`catch` appears in a ±10 line window.
   - Centralized error-handling patterns (e.g., wrapper helpers around subprocess calls) will still produce warnings if they appear outside the local window.

4. **Archive/historical paths not consistently filtered**
   - `_run_legacy_checks` applies `_filter_files` using `is_historical_dir_path` and `is_historical_path`.
   - However:
     - ACTIVE_VIOLATIONS show many warnings for `.cursor__archived_2025-04-12/...` paths, indicating:
       - Either some flows (possibly modular checkers or other invocations) bypass `_filter_files`, or
       - There is no checker-level reinforcement of historical filtering.
   - As a result, archived scripts and historical analysis tooling generate warnings that are not relevant to current development.

5. **No deduplication**
   - For each pattern and each line match:
     - A separate violation is appended.
   - With overlapping contexts or repeated patterns, this can lead to:
     - Multiple nearly identical warnings for the same code region.
   - There is no mechanism to coalesce warnings by `(file_path, line_number, operation)`.

6. **Narrow definition of “error handling”**
   - Only looks for `try`/`catch` keywords in the context window.
   - Does not recognize:
     - Custom wrapper functions that log and rethrow errors.
     - High-level frameworks that handle errors centrally (e.g., React Query error boundaries, NestJS exception filters, etc.).
   - Leads to warnings against code that is logically safe but not wrapped in local try/except.

### 4.3 Proposed improved heuristics

**Design goals**

- **Catch real missing error handling** on risky operations.
- **Avoid low-signal warnings** (archives, safe patterns, central handlers).
- **Keep implementation straightforward** and explainable.

**Proposed refinements**

1. **Path/scope filters (first line of defense)**
   - Apply **historical/archival filtering inside `ErrorHandlingChecker` itself**, so it is robust to how `changed_files` is constructed:
     - Use `is_historical_path` and/or `is_historical_dir_path` on each `file_path_str` before processing.
     - Treat any file under known archive roots (e.g., `.cursor__archived_*/**`, `docs/archive/**`) as:
       - Either completely skipped, or
       - Downgraded to **INFO-only diagnostics** instead of warnings.
   - Optionally, add configuration (e.g., `error_handling_excluded_paths`) to skip:
     - Test-only directories (if that’s desired).
     - Generated code directories.

2. **Distinguish context-managed `open` from bare `open`**
   - Before treating `open(` as error-prone:
     - Inspect the line and immediate preceding lines to detect patterns like:
       - `with open(...` or `async with aiofiles.open(...`.
     - If the operation is **within a context manager** and:
       - The code is not performing additional risky/expensive side effects in the same expression,
       - Then consider it “context-managed safe” and skip warning.
   - This can be implemented via simple heuristics:
     - If the substring `with` appears before `open(` on the same line.
     - Or if within the ±N lines, there is a preceding `with` statement that includes `open(`.

3. **Refined “await” patterns**
   - Separate pattern sets:
     - **Critical await patterns**: e.g., `await fetch(`, `await axios.`, `await client.`, which are more likely to throw network or I/O errors.
     - **Benign await patterns**: known wrappers that handle errors internally.
   - Introduce a configurable allowlist of async wrapper functions:
     - E.g., `safeRequest`, `callWithRetry`, etc.
   - For matches to allowed wrappers:
     - Suppress warnings unless there is strong evidence of silent failure patterns.

4. **Subprocess wrapper awareness**
   - Recognize centralized helpers:
     - For example, if the project uses `run_command_safe(...)` or similar wrappers around `subprocess.run`.
   - Provide a small allowlist of known wrappers in the checker configuration:
     - When an occurrence of `subprocess.run` is inside such a wrapper’s implementation and:
       - That wrapper itself has try/except and logging,
       - Suppress per-call warnings in users of the wrapper and instead focus on the wrapper’s correctness.

5. **Improved error-handling detection**
   - Extend `error_handling_patterns` to include:
     - Logging calls with error markers (`logger.error`, `logger.exception`, `console.error`).
     - Framework-level error handlers (e.g., `catchError(...)` in RxJS, `onError` callbacks in React Query).
   - Within the context window:
     - Accept either:
       - A `try`/`catch` block, or
       - A recognizable error-handling pattern (logging and rethrowing, returning structured errors, etc.).
   - This reduces false positives in codebases that log errors immediately without local try/except.

6. **De-duplication of warnings**
   - Maintain a `seen` set of `(file_path, line_number, pattern)` or a hash of `(file_path, pattern, context_snippet)`.
   - Before appending a violation:
     - Check if this occurrence has already been seen; if so, skip.
   - Optionally, **aggregate** repeated warnings in the same file:
     - e.g., emit one warning per file per pattern with a summary of line numbers, instead of many separate entries.

7. **Severity and classification tuning**
   - Keep ErrorHandlingChecker as a source of **WARNINGS**, not BLOCKING, but:
     - Consider downgrading warnings for:
       - Archived/historical/test files to **INFO** (potentially recorded only in logs, not ACTIVE_VIOLATIONS).
     - Consider elevating specific patterns to BLOCKED only if:
       - They are in core production paths and have absolutely no error handling or logging in any context window.

8. **Configuration and extensibility**
   - Introduce (or extend) a small configuration file (e.g., `.cursor/enforcement/error_handling.yaml`) with:
     - `excluded_paths` (glob patterns).
     - `safe_async_wrappers` (list of function names or regexes).
     - `safe_subprocess_wrappers` (helper functions).
     - `max_warnings_per_file` to cap duplicates.
   - The checker can read and cache this configuration on first run, keeping behavior tunable without code changes.


---

## 5. Performance & Caching Plan

### 5.1 Current behavior and bottlenecks

**Changed files and caching**

- `GitUtils` (`enforcement/core/git_utils.py`):
  - Uses `lru_cache` for `run_git_command_cached(project_root, command_tuple)`.
  - Maintains:
    - `_cached_changed_files` (tracked/untracked lists).
    - `_changed_files_cache_key` based on `get_git_state_key(project_root)` (HEAD + index hash).
    - `_cached_classifications` and `_classification_cache_key` for `get_changed_file_classifications()`.
  - `update_cache(cache_key)` rebuilds:
    - `tracked = get_changed_files_impl(project_root, include_untracked=False)`.
    - `all_changed = get_changed_files_impl(project_root, include_untracked=True)`.
    - `untracked_only = all_changed − tracked_set`.

- `auto-enforcer.py` (`run_all_checks`):
  - For `scope == "current_session"`:
    - Calls `_get_changed_files_for_session()`:
      - Internally calls `get_changed_files_impl` twice (tracked and untracked).
    - Calls `self.git_utils.get_changed_file_classifications()` which runs `git diff --name-status` and may perform additional `git diff` per renamed file.
    - Sets `skip_non_critical = False`.
  - For full scans:
    - Computes `cache_key = get_git_state_key(self.project_root)`.
    - Uses `GitUtils.get_cached_changed_files()` and `update_cache(cache_key)` as needed.
    - Computes `changed_files_count` and decides `skip_non_critical`.

- **DateChecker-specific overhead**
  - `DateChecker.check_hardcoded_dates`:
    - Calls `git_utils.run_git_command(['ls-files'])` every time it runs to get `all_tracked` files.
    - Splits `changed_files` into tracked/untracked based on this full list.
    - Builds `file_modification_cache` by calling `is_file_modified_in_session` for each `changed_file`.
  - `is_file_modified_in_session` (file_scanner.py):
    - Ensures changed-files cache is populated via `git_utils.update_cache` if necessary.
    - For tracked files:
      - Uses `git diff` with various arguments (`--numstat`, `--ignore-all-space`, etc.).
      - Uses `git log` + `git diff` to verify modifications after session start.
    - For untracked files:
      - Uses `get_file_last_modified_time`, `get_changed_files_impl`, and `get_file_hash`.

- **ErrorHandlingChecker overhead**
  - For each file:
    - Calls `is_file_modified_in_session_func` (which may re-use caches but still involves Git commands and file hashing).
    - Reads entire file into memory.
    - Scans line-by-line for multiple regex patterns.

- **Modular vs legacy checkers**
  - Modular checkers reuse `all_changed_files` and `classification_map` but still process them sequentially.
  - Legacy checkers (`_run_legacy_checks`) re-derive `raw_changed_with_untracked` and `raw_changed_tracked` via `git_utils.get_changed_files(...)` even if `run_all_checks` already computed `all_changed_files`.

### 5.2 Design improvements

**1. Shared changed-files and classifications (single source of truth)**

- **Goal:** Compute changed-files and classification info **once per run** and share across all checkers (modular and legacy).
- **Approach:**
  - Promote `all_changed_files`, `changed_files_tracked`, `changed_files_untracked`, and `classification_map` into a small `CheckerContext` object or attributes on the enforcer instance for the duration of `run_all_checks`.
  - Modify `_run_legacy_checks` to accept these as arguments instead of recomputing:
    - E.g., `_run_legacy_checks(self, skip_non_critical, violation_scope, classification_map, all_changed_files, tracked_files, untracked_files)`.
  - Ensure `is_file_modified_in_session` uses the same cached changed-files, avoiding redundant calls to `get_changed_files_impl`.

**2. Avoid redundant `git ls-files` in DateChecker**

- **Goal:** Reuse existing knowledge of tracked vs untracked files.
- **Approach:**
  - Instead of calling `git_utils.run_git_command(['ls-files'])` inside `DateChecker`:
    - Pass in a precomputed set of `tracked_files` and `untracked_files` (from `GitUtils.update_cache` or `run_all_checks`).
  - The date checker can then:
    - Use the passed-in sets or maps to distinguish tracked vs untracked, and apply any 50-file cap to tracked files directly.
- **Benefit:** Saves a full `git ls-files` invocation per enforcement run.

**3. Early path filtering**

- **Goal:** Reduce per-checker I/O and Git work by excluding obviously irrelevant files up front.
- **Approach:**
  - After computing `all_changed_files`, apply a global filter based on:
    - `is_historical_path`, `is_historical_dir_path`.
    - Known generated paths (e.g., build artifacts).
    - Optional config-based `excluded_paths`.
  - Propagate the filtered list into checkers, with the option for each checker to apply more specific restrictions.
- **Benefit:** Fewer files passed into expensive operations (DateDetector, TokenEstimator, per-file regex scans).

**4. Optional safe parallelism for independent checkers**

- **Goal:** Allow large repos to leverage multi-core CPUs for independent checks.
- **Approach:**
  - Introduce an optional configuration flag (e.g., `ENFORCER_MAX_WORKERS` or an argument to `run_all_checks`) that:
    - If set > 1:
      - Uses a `ThreadPoolExecutor` or `ProcessPoolExecutor` for non-mutating checkers.
      - Runs **non-stateful** checkers (like date, error handling, logging, Python Bible) in parallel, while keeping:
        - Security, memory bank, and context management checks sequential (to avoid complex side effects).
  - Ensure that:
    - Violations from parallel tasks are aggregated in a thread-safe list.
    - `git_utils` and other shared resources are thread-safe or duplicated (for processes).
  - Start with **threaded** parallelism (I/O-bound tasks) and limit concurrency to a small number (e.g., 2–4) to avoid overloading Git or the filesystem.

**5. Checker input standardization**

- **Goal:** Provide a uniform, easily cacheable input set to all checkers.
- **Approach:**
  - Define a `CheckerInput` structure containing:
    - `project_root`, `enforcement_dir`.
    - `changed_files_all`, `changed_files_tracked`, `changed_files_untracked`.
    - `classification_map`.
    - `session`, `git_utils`.
    - `skip_non_critical`, `violation_scope`.
  - Pass this object to both modular and legacy checkers rather than a bespoke set of parameters.
- **Benefit:** Simplifies wiring, encourages consistent reuse of data, and makes further optimizations easier.

**6. Date checker optimization for large change sets**

- **Goal:** Keep date checker fast and predictable on large diffs.
- **Approach:**
  - Maintain the 50-tracked-file cap, but:
    - Log a clear, standardized message when the cap is triggered, including:
      - Number of skipped files.
      - Whether those files are docs/logs/historical or code.
  - Optionally:
    - Cap the number of files processed per run for `scope="full"` and prefer `scope="current_session"` in CI scenarios.
  - Delay or avoid any high-cost operations (like `DateDetector` on very large files) if classification or doc_type suggests they are unlikely to contain problematic dates (e.g., certain generated or binary-like text files).

**7. ErrorHandlingChecker efficiency improvements**

- **Goal:** Reduce cost for large file sets and long files.
- **Approach:**
  - Reuse `session_modified_files` from other checkers if available (via `CheckerInput`).
  - Short-circuit early for:
    - Files under excluded/historical paths.
    - Files shorter than a small threshold (if they contain no patterns).
  - Optionally:
    - Limit the number of pattern matches per file to a configurable maximum to avoid pathological cases.

---

## 6. Prioritized Fix Plan

### P0 — Must-fix now

1. **Fix Last Updated logic to stop flagging compliant files**
   - **Components:** `enforcement/checks/date_checker.py`.
   - **Changes:**
     - In the DateDetector path's `"Last Updated"` branch, only emit a BLOCKED violation when `date_match.date_str != CURRENT_DATE`.
     - When `date_match.date_str == CURRENT_DATE`, treat it as compliant (no violation).
     - Align the fallback path’s Last Updated logic with this rule to ensure consistent behavior.
   - **Risk level:** Medium (central logic, but change is conceptually simple).
   - **Validation:** Unit tests for Last Updated scenarios + integration run of auto-enforcer on representative docs.

2. **Ensure Last Updated semantics are consistent across detector and fallback paths**
   - **Components:** `enforcement/checks/date_checker.py`.
   - **Changes:**
     - Harmonize Last Updated behavior between detector-based and fallback paths, including logs/historical handling.
   - **Risk level:** Low–medium.
   - **Validation:** Dedicated tests that simulate both modes (with and without DateDetector/DocumentContext).

### P1 — High-value, non-breaking

3. **Refine `_get_context_metrics_for_audit` error reporting and granularity**
   - **Components:** `.cursor/scripts/auto-enforcer.py` (method `get_context_metrics_for_audit`).
   - **Changes:**
     - Introduce finer-grained try/except blocks and error codes for:
       - `recommendations.md` reading/parsing.
       - `TokenEstimator` statistics.
       - `dashboard.md` reading.
     - Populate `metrics['error']` and possibly adjust `metrics['available']` based on which parts fail.
   - **Risk level:** Low (best-effort metrics, already fully guarded).
   - **Validation:** Unit tests that simulate missing/unreadable files and verify metrics behavior.

4. **Reduce ErrorHandlingChecker noise and exclude archived paths**
   - **Components:** `enforcement/checks/error_handling_checker.py`, possibly shared historical/path utilities.
   - **Changes:**
     - Add internal path filtering for archived/historical/test directories.
     - Distinguish context-managed `open` from bare `open`.
     - Add deduplication for repeated warnings in the same file.
   - **Risk level:** Low–medium (logic changes but only affect warnings).
   - **Validation:** Unit tests on synthetic files + run enforcer to observe warning count reduction.

5. **Improve configuration for error-handling and path exclusions**
   - **Components:** New lightweight config file (e.g., `.cursor/enforcement/error_handling.yaml`) plus config-loading code in `ErrorHandlingChecker`.
   - **Changes:**
     - Allow defining excluded paths, safe wrappers, and thresholds.
   - **Risk level:** Low (opt-in, backward compatible).
   - **Validation:** Unit tests ensuring config is loaded and applied; manual check with adjusted patterns.

### P2 — Structural / performance

6. **Introduce shared CheckerInput / CheckerContext**
   - **Components:** `.cursor/scripts/auto-enforcer.py` (run_all_checks, _run_modular_checkers, _run_legacy_checks), possibly a new module for checker context.
   - **Changes:**
     - Centralize changed-files and classification computation.
     - Pass standardized context object to all checkers.
   - **Risk level:** Medium–high (touches orchestration).
   - **Validation:** Extensive integration tests; run enforcer on typical and large repos.

7. **Implement optional parallel execution for non-critical checkers**
   - **Components:** `.cursor/scripts/auto-enforcer.py` (checker orchestration).
   - **Changes:**
     - Introduce a concurrency option and execute non-critical checkers in parallel when safe.
   - **Risk level:** High (concurrency, potential for subtle bugs).
   - **Validation:** Thorough testing with race-condition focus; start with off-by-default feature flag.

8. **Broader noise cleanup for archived docs and Python Bible warnings**
   - **Components:** ErrorHandlingChecker, PythonBibleChecker, historical/path config.
   - **Changes:**
     - Apply consistent path-exclusion strategy across all “lint-like” checkers that emit large numbers of warnings.
   - **Risk level:** Low–medium.
   - **Validation:** Monitor ACTIVE_VIOLATIONS before/after; confirm real issues remain visible.

---

## EXECUTION_CONTRACT

1. **Normalize Last Updated behavior in DateChecker**
   - **Files:** `enforcement/checks/date_checker.py`.
   - **Change:** Adjust the `"Last Updated"` branch in the DateDetector path so that it **only** emits a violation when `date_match.date_str` does not equal `CURRENT_DATE`, and emits **no violation** when the date already matches; ensure the message clearly distinguishes “stale” from “current”.
   - **Intent:** Eliminate false positives where Last Updated is already up-to-date while preserving enforcement on genuinely stale dates.

2. **Align fallback Last Updated logic with detector-based logic**
   - **Files:** `enforcement/checks/date_checker.py`.
   - **Change:** Review the fallback scanning path (without DateDetector) and ensure that Last Updated lines are treated with the same rules as in the primary path, including log/historical skips and only flagging when the date is stale.
   - **Intent:** Guarantee that behavior is consistent regardless of whether optional date-detection dependencies are available.

3. **Optionally introduce a “missing Last Updated” rule for select documentation files**
   - **Files:** `enforcement/checks/date_checker.py`, possibly a small configuration file to list required-doc paths.
   - **Change:** Add a secondary check that, for certain documentation paths (configurable), emits a warning or low-priority violation when a modified file lacks any Last Updated field.
   - **Intent:** Encourage consistent Last Updated usage on key docs without over-enforcing on every markdown file.

4. **Refine `_get_context_metrics_for_audit` to use granular I/O guards**
   - **Files:** `.cursor/scripts/auto-enforcer.py`.
   - **Change:** Split the monolithic try/except in `get_context_metrics_for_audit` into separate guarded sections for reading/parsing `recommendations.md`, computing token statistics, and reading `dashboard.md`, each with a specific error code and log entry; update `metrics['available']` and `metrics['error']` accordingly.
   - **Intent:** Make metrics failures diagnosable and prevent ambiguous “available but silently degraded” states.

5. **Handle `dashboard.md` read failures explicitly**
   - **Files:** `.cursor/scripts/auto-enforcer.py`.
   - **Change:** Wrap the `dashboard.md` `open()` call in a targeted try/except for I/O and decoding errors, logging a `DASHBOARD_READ_FAILED` code and leaving compliance flags as false without crashing or misreporting availability.
   - **Intent:** Ensure that transient issues reading the dashboard do not compromise enforcer stability and are clearly visible in logs/metrics.

6. **Add internal historical/path filtering to ErrorHandlingChecker**
   - **Files:** `enforcement/checks/error_handling_checker.py`.
   - **Change:** Before processing each file, apply `is_historical_path` and/or `is_historical_dir_path` (and possibly test-path rules) to skip or downgrade severity for files in archived or non-production directories.
   - **Intent:** Prevent warnings from archived backups and historical analysis scripts from polluting ACTIVE_VIOLATIONS.

7. **Teach ErrorHandlingChecker to treat context-managed `open` as safe**
   - **Files:** `enforcement/checks/error_handling_checker.py`.
   - **Change:** Enhance the pattern handling for `open(` so that occurrences inside `with open(...` (and similar safe constructs) are not treated as unguarded “error-prone operations” unless there is strong evidence they require additional try/except.
   - **Intent:** Reduce false positives in idiomatic Python code that uses context managers correctly.

8. **Introduce basic deduplication of error-handling warnings**
   - **Files:** `enforcement/checks/error_handling_checker.py`.
   - **Change:** Track seen warning instances per file (e.g., by pattern and line number or context hash) and avoid adding duplicate violations for the same code region.
   - **Intent:** Lower the raw count of warnings and make ACTIVE_VIOLATIONS more readable.

9. **Optionally extend error-handling detection to accept logged or wrapped errors**
   - **Files:** `enforcement/checks/error_handling_checker.py`.
   - **Change:** Expand `error_handling_patterns` to include explicit logging calls and recognized wrapper-based error handling, so that code which logs and propagates errors within the context window is not flagged as lacking error handling.
   - **Intent:** Better align the checker with real-world error-handling practices beyond simple try/except blocks.

10. **Introduce a small configuration for error-handling rules**
    - **Files:** New config file (e.g., `.cursor/enforcement/error_handling.yaml`) plus minimal loader in `ErrorHandlingChecker`.
    - **Change:** Allow specifying `excluded_paths`, `safe_async_wrappers`, `safe_subprocess_wrappers`, and optionally `max_warnings_per_file`, read once and cached.
    - **Intent:** Make the checker behavior tunable without code changes, especially for project-specific wrappers and directory layouts.

11. **Refactor `run_all_checks` and `_run_legacy_checks` to share changed-files data**
    - **Files:** `.cursor/scripts/auto-enforcer.py` (and possibly a small new context module).
    - **Change:** Compute `all_changed_files`, `tracked_files`, `untracked_files`, and `classification_map` once in `run_all_checks`, encapsulate them in a context object, and pass that into both modular and legacy checker pathways, eliminating redundant `git_utils.get_changed_files(...)` calls inside `_run_legacy_checks`.
    - **Intent:** Reduce Git command duplication, especially for large repos or frequent incremental runs.

12. **Expose tracked/untracked sets to DateChecker**
    - **Files:** `.cursor/scripts/auto-enforcer.py`, `enforcement/checks/date_checker.py`.
    - **Change:** Pass precomputed tracked/untracked file sets or a small helper into `DateChecker.check_hardcoded_dates`, replacing the internal `git_utils.run_git_command(['ls-files'])` call.
    - **Intent:** Avoid redundant `git ls-files` per run and centralize tracked-file knowledge.

13. **Optionally add parallel execution for non-critical checkers**
    - **Files:** `.cursor/scripts/auto-enforcer.py`.
    - **Change:** Introduce a configuration parameter (e.g., environment variable or CLI flag) that, when enabled, runs non-critical checkers (date, error-handling, logging, Python Bible, etc.) in a small thread pool, aggregating violations and logs safely.
    - **Intent:** Improve performance on large change sets while keeping concurrency strictly opt-in and controllable.

14. **Standardize archive/historical exclusion across all “lint-like” checkers**
    - **Files:** Each checker that emits large numbers of warnings (ErrorHandlingChecker, PythonBibleChecker, LoggingChecker, etc.).
    - **Change:** Factor out a shared helper or convention for path-based exclusion, ensuring that historical/archived directories (and any config-specified paths) are consistently skipped or downgraded across all such checkers.
    - **Intent:** Reduce baseline warning volume and keep attention on relevant, current code.

---

## TEST_PLAN

1. **Unit tests for Last Updated behavior in DateChecker (detector path)**
   - **Scenarios:**
     - A non-historical, non-log markdown doc:
       - Contains `Last Updated: <CURRENT_DATE>` and is marked as modified in the session → **no violation**.
       - Contains `Last Updated: <PAST_DATE>` and is marked as modified → **BLOCKED** violation with a “stale Last Updated” message.
       - Contains both historical sections and a Last Updated within a non-historical header → ensure only the Last Updated is enforced and historical entries are preserved.
   - **Implementation hints:**
     - Use test harnesses similar to `enforcement/checks/tests/test_date_checker_classification.py`.
   - **Command:**
     - `pytest enforcement/checks/tests/test_date_checker_classification.py::TestLastUpdatedBehavior -v` (or equivalent new test class).

2. **Unit tests for Last Updated fallback path**
   - **Scenarios:**
     - Simulate DateDetector/DocumentContext being unavailable (e.g., monkeypatch imports to None).
     - Verify:
       - Last Updated with CURRENT_DATE → no violation.
       - Last Updated with stale date → BLOCKED.
       - Log files and historical docs → Last Updated not enforced.
   - **Command:**
     - `pytest enforcement/checks/tests/test_date_checker_fallback.py -v` (new test file).

3. **Unit tests for missing Last Updated enforcement (if implemented)**
   - **Scenarios:**
     - Modified documentation file in configured “must-have-Last-Updated” directory with:
       - No Last Updated → WARNING or BLOCKED, as specified.
       - Proper Last Updated with CURRENT_DATE → no violation.
   - **Command:**
     - `pytest enforcement/checks/tests/test_date_checker_missing_last_updated.py -v`.

4. **Unit tests for `_get_context_metrics_for_audit` resilience**
   - **Scenarios:**
     - `PREDICTIVE_CONTEXT_AVAILABLE=False` → `available=False`, `error` set, metrics zeroed, no exceptions.
     - Missing `recommendations.md` and `dashboard.md` → `available=True` or `False` depending on chosen semantics, but no crash; `error` indicates missing recommendations/dashboard.
     - `recommendations.md` present but malformed → appropriate `error_code` logged; metrics returned with partial data.
     - `dashboard.md` exists but `open` raises `OSError` (simulated via monkeypatch) → no crash; `dashboard`-specific error logged; compliance flags remain `False`.
   - **Command:**
     - `pytest .cursor/scripts/tests/test_context_metrics.py -v` (new test suite).

5. **Unit tests for ErrorHandlingChecker path filtering**
   - **Scenarios:**
     - Files under `.cursor__archived_2025-04-12/...` and `docs/archive/...` appear in `changed_files`:
       - Checker should either skip them entirely or mark them as INFO-only without adding to ACTIVE_VIOLATIONS.
     - Normal active code in `src/...` with the same patterns should still be analyzed.
   - **Command:**
     - `pytest enforcement/checks/tests/test_error_handling_paths.py -v`.

6. **Unit tests for context-managed `open`**
   - **Scenarios:**
     - Python file containing:
       - `with open("file.txt") as f:` inside or outside a try/except → **no warning** once context-manager detection is in place.
       - `f = open("file.txt")` without try/except or context manager → **WARNING**.
   - **Command:**
     - `pytest enforcement/checks/tests/test_error_handling_open.py -v`.

7. **Unit tests for deduplication in ErrorHandlingChecker**
   - **Scenarios:**
     - Single file with multiple matching lines close together:
       - Ensure repeated `open(` or `await foo(` patterns in the same region do not produce unbounded duplicate warnings.
       - Confirm that at most the configured number of warnings per file per pattern is emitted.
   - **Command:**
     - `pytest enforcement/checks/tests/test_error_handling_dedup.py -v`.

8. **Unit tests for safe wrapper and logging-based error handling**
   - **Scenarios:**
     - Code that calls a configured safe async wrapper (e.g., `await safeRequest()`), which logs and rethrows errors:
       - Should not be flagged as lacking error handling.
     - Code that uses `subprocess.run` only inside a wrapper function that itself has try/except and logging:
       - Warnings should either focus on missing handling in the wrapper (if it’s missing) or not flag call sites.
   - **Command:**
     - `pytest enforcement/checks/tests/test_error_handling_wrappers.py -v`.

9. **Integration tests for enforcement pipeline**
   - **Scenarios:**
     - Small synthetic repo subset with:
       - A mix of docs with correct and incorrect Last Updated values.
       - Archived backup scripts with open/subprocess calls.
       - Active code using await, subprocess, and open in various patterns.
     - Run full and current_session scans:
       - Confirm:
         - No BLOCKED violations when Last Updated is correct and no other rules are violated.
         - Archived paths do not flood ACTIVE_VIOLATIONS with warnings.
         - ErrorHandlingChecker warnings are focused and deduplicated.
   - **Commands:**
     - `python .cursor/scripts/auto-enforcer.py --scope current_session --user-message "test date and error handling"`  
     - `python .cursor/scripts/auto-enforcer.py --scope full --user-message "full enforcement test"`.

10. **Performance/sanity tests**
    - **Scenarios:**
      - Repository with a larger number of changed files:
        - Measure runtime of `run_all_checks` before and after changes.
        - Ensure non-critical checks can be skipped or parallelized as designed.
      - Confirm that:
        - Git command counts per run do not increase materially.
        - Memory usage remains reasonable.
    - **Approach:**
      - Add a lightweight benchmarking script (if not already present) to run the enforcer multiple times and log timing.
    - **Commands:**
      - `python .cursor/scripts/auto-enforcer.py --scope current_session --user-message "perf baseline"` (before and after).
      - Optional: `pytest enforcement/tests/test_performance.py -v` (if a timing-aware test is added).

This contract and test plan should give the Execution Brain clear, concrete steps to implement, while ensuring that correctness, resilience, signal-to-noise, and performance all improve together.