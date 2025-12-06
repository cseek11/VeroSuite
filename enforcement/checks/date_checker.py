import re
from datetime import datetime
from pathlib import Path
from typing import List, Optional

from enforcement.core.violations import Violation, ViolationSeverity
from enforcement.core.session_state import EnforcementSession
from enforcement.core.git_utils import GitUtils, get_git_state_key
from enforcement.core.scope_evaluator import (
    is_historical_dir_path,
    is_historical_document_file,
    is_log_file,
    is_documentation_file,
)
from enforcement.core.historical import is_historical_path
from enforcement.core.file_scanner import is_file_modified_in_session
from enforcement.core.file_classifier import FileChangeType, classify_file_change
from collections import Counter

try:
    from enforcement.date_detector import (
        DocumentContext,
        DateDetector,
        DateMatch,
        DateClassification,
    )
except ImportError:  # pragma: no cover - optional dependency
    DocumentContext = None
    DateDetector = None
    DateMatch = None
    DateClassification = None

try:
    from logger_util import get_logger

    logger = get_logger(context="date_checker")
except ImportError:  # pragma: no cover - fallback logger
    import logging

    logging.basicConfig(level=logging.INFO)

    class _FallbackLogger:
        def __init__(self):
            self._logger = logging.getLogger("date_checker")

        def info(self, msg, *args, **kwargs):
            self._logger.info(msg)

        def debug(self, msg, *args, **kwargs):
            self._logger.debug(msg)

        def warn(self, msg, *args, **kwargs):
            self._logger.warning(msg)

        def warning(self, msg, *args, **kwargs):
            self._logger.warning(msg)

        def error(self, msg, *args, **kwargs):
            self._logger.error(msg)

    logger = _FallbackLogger()


class DateChecker:
    HARDCODED_DATE_PATTERN = re.compile(
        r'\b(20\d{2})[-/](0[1-9]|1[0-2])[-/](0[1-9]|[12]\d|3[01])\b|'
        r'\b(0[1-9]|1[0-2])[/-](0[1-9]|[12]\d|3[01])[/-](20\d{2})\b'
    )

    USE_CONSOLIDATED_PATTERNS = True

    CONSOLIDATED_HISTORICAL_PATTERNS = [
        re.compile(r'(entry|log|note|memo)\s*#?\d*\s*[-–:]', re.IGNORECASE),
        re.compile(r'(completed|resolved|fixed|closed)\s*[:\(]', re.IGNORECASE),
        re.compile(r'\*\*(date|created|updated|generated|report)[:*]', re.IGNORECASE),
        re.compile(r'(`[^`]*\d{4}[^`]*`|\w+\([^)]*\d{4})', re.IGNORECASE),
        re.compile(r'^#{1,6}\s+.*\d{4}', re.IGNORECASE | re.MULTILINE),
    ]

    LEGACY_HISTORICAL_PATTERNS = [
        re.compile(r'entry\s*#\d+\s*[-–]\s*\d{4}-\d{2}-\d{2}', re.IGNORECASE),
        re.compile(r'###\s*entry\s*#\d+\s*[-–]\s*\d{4}-\d{2}-\d{2}', re.IGNORECASE),
        re.compile(r'\*\*completed\*\*\s*\([^)]*\d{4}-\d{2}-\d{2}[^)]*\)', re.IGNORECASE),
        re.compile(r'completed\s*\([^)]*\d{4}-\d{2}-\d{2}[^)]*\)', re.IGNORECASE),
        re.compile(r'###\s+.*?\([^)]*\d{4}-\d{2}-\d{2}[^)]*\)\s*[-–]\s*completed', re.IGNORECASE),
        re.compile(r'added\s+on\s+\d{4}-\d{2}-\d{2}', re.IGNORECASE),
        re.compile(r'created\s+on\s+\d{4}-\d{2}-\d{2}', re.IGNORECASE),
        re.compile(r'fixed\s+on\s+\d{4}-\d{2}-\d{2}', re.IGNORECASE),
        re.compile(r'resolved\s+on\s+\d{4}-\d{2}-\d{2}', re.IGNORECASE),
        re.compile(r'###\s+\d{4}-\d{2}-\d{2}\s+[-–]', re.IGNORECASE),
        re.compile(r'^\s*\*\*\d{4}-\d{2}-\d{2}\s+[-–]', re.IGNORECASE | re.MULTILINE),
        re.compile(r'recent\s+(major\s+)?change.*?\d{4}-\d{2}-\d{2}', re.IGNORECASE),
        re.compile(r'\([^)]*\d{4}-\d{2}-\d{2}[^)]*\)\s*[-–]\s*\*\*completed\*\*', re.IGNORECASE),
        re.compile(r'goal.*?\([^)]*\d{4}-\d{2}-\d{2}[^)]*\)', re.IGNORECASE),
        re.compile(r'version\s*:.*?\([^)]*\d{4}-\d{2}-\d{2}[^)]*\)', re.IGNORECASE),
        re.compile(r'version\s+\d+\.\d+.*?\([^)]*\d{4}-\d{2}-\d{2}[^)]*\)', re.IGNORECASE),
        re.compile(r'(integration|added|change\s+log).*?\([^)]*\d{4}-\d{2}-\d{2}[^)]*\)', re.IGNORECASE),
        re.compile(r'\(e\.g\.|example|format\):.*?\d{4}-\d{2}-\d{2}', re.IGNORECASE),
        re.compile(r'format.*?:.*?\d{4}-\d{2}-\d{2}', re.IGNORECASE),
        re.compile(r'`\d{4}-\d{2}-\d{2}`', re.IGNORECASE),
        re.compile(r'like\s+`\d{4}-\d{2}-\d{2}`', re.IGNORECASE),
        re.compile(r'#\s*["\'].*?\d{4}-\d{2}-\d{2}.*?["\']', re.IGNORECASE),
        re.compile(r'#\s*.*?\([^)]*\d{4}-\d{2}-\d{2}[^)]*\)', re.IGNORECASE),
        re.compile(r'\*\*date:\*\*\s*\d{4}-\d{2}-\d{2}', re.IGNORECASE),
        re.compile(r'^date\s*:.*?\d{4}-\d{2}-\d{2}', re.IGNORECASE | re.MULTILINE),
        re.compile(r'\*\*report\s+generated:\*\*\s*\d{4}-\d{2}-\d{2}', re.IGNORECASE),
        re.compile(r'\*\*generated:\*\*\s*\d{4}-\d{2}-\d{2}', re.IGNORECASE),
        re.compile(r'\*\*created:\*\*\s*\d{4}-\d{2}-\d{2}', re.IGNORECASE),
        re.compile(r'\*\*auditor:\*\*', re.IGNORECASE),
        re.compile(r'\*\*reference:\*\*', re.IGNORECASE),
        re.compile(r'\*\*resolved\*\*\s*\([^)]*\d{4}-\d{2}-\d{2}[^)]*\)', re.IGNORECASE),
        re.compile(r'\*\*status:\*\*.*?\([^)]*\d{4}-\d{2}-\d{2}[^)]*\)', re.IGNORECASE),
        re.compile(r'resolution\s+date\s*:.*?\d{4}-\d{2}-\d{2}', re.IGNORECASE),
        re.compile(r'\(updated\s+\d{4}-\d{2}-\d{2}\)', re.IGNORECASE),
        re.compile(r'updated\s*:\s*\d{4}-\d{2}-\d{2}', re.IGNORECASE),
        re.compile(r'\*\*last\s+updated:\*\*\s*\d{4}-\d{2}-\d{2}', re.IGNORECASE),
        re.compile(r'.*["\'].*?\*\*last\s+updated:\*\*\s*\d{4}-\d{2}-\d{2}.*?["\'].*', re.IGNORECASE | re.DOTALL),
    ]

    HISTORICAL_DATE_PATTERNS = (
        CONSOLIDATED_HISTORICAL_PATTERNS if USE_CONSOLIDATED_PATTERNS else LEGACY_HISTORICAL_PATTERNS
    )

    def __init__(self, current_date: str):
        self.CURRENT_DATE = current_date

    def _normalize_date_match(self, match: tuple) -> str:
        parts = [g for g in match if g is not None]
        if len(parts) < 3:
            return ''
        if len(parts[0]) == 4 and parts[0].startswith('20'):
            return f"{parts[0]}-{parts[1]}-{parts[2]}"
        if len(parts[-1]) == 4 and parts[-1].startswith('20'):
            return f"{parts[-1]}-{parts[0]}-{parts[1]}"
        return '-'.join(parts[:3])

    def _is_date_future_or_past(self, date_str: str) -> Optional[bool]:
        try:
            date_obj = datetime.strptime(date_str, "%Y-%m-%d").date()
            current_date_obj = datetime.strptime(self.CURRENT_DATE, "%Y-%m-%d").date()
            days_diff = (date_obj - current_date_obj).days
            if days_diff > 1:
                return True
            if days_diff < -365:
                return True
            return False
        except (ValueError, AttributeError):
            return None

    def _is_historical_date_pattern(self, line: str, context: str = '') -> bool:
        if not self.HARDCODED_DATE_PATTERN.search(line):
            return False
        for idx, pattern in enumerate(self.HISTORICAL_DATE_PATTERNS, 1):
            if pattern.search(line):
                logger.debug(
                    "Historical date pattern matched",
                    operation="check_hardcoded_dates",
                    pattern_number=idx,
                    pattern=pattern.pattern,
                    line_preview=line[:100]
                )
                return True
        if context:
            for pattern in self.HISTORICAL_DATE_PATTERNS:
                if pattern.search(context):
                    logger.debug(
                        "Historical date pattern matched in context",
                        operation="check_hardcoded_dates",
                        line_preview=line[:100],
                        context_preview=context[:100]
                    )
                    return True
        matches = self.HARDCODED_DATE_PATTERN.findall(line)
        for match in matches:
            date_str = self._normalize_date_match(match if isinstance(match, tuple) else (match,))
            if date_str:
                is_hist = self._is_date_future_or_past(date_str)
                if is_hist is True:
                    logger.debug(
                        f"Date is clearly future/past (likely historical): {date_str}",
                        operation="check_hardcoded_dates",
                        line_preview=line[:100],
                        date=date_str
                    )
                    return True
        return False

    def check_hardcoded_dates(
        self,
        changed_files: List[str],
        project_root: Path,
        session: EnforcementSession,
        git_utils: GitUtils,
        enforcement_dir: Path,
        violation_scope: str = "current_session",
        classification_map: Optional[dict] = None,
        tracked_files: Optional[List[str]] = None,
        untracked_files: Optional[List[str]] = None,
        required_last_updated_paths: Optional[List[str]] = None,
    ) -> List[Violation]:
        violations: List[Violation] = []
        session_scope = violation_scope if violation_scope else "current_session"
        session_start = datetime.fromisoformat(session.start_time.replace('Z', '+00:00'))

        if tracked_files is not None:
            all_tracked = set(tracked_files)
        else:
            git_output = git_utils.run_git_command(['ls-files'])
            if git_output:
                all_tracked = {line.strip() for line in git_output.split('\n') if line.strip()}
            else:
                all_tracked = set()

        if untracked_files is not None:
            untracked_files_list = list(untracked_files)
        else:
            untracked_files_list = [f for f in changed_files if f not in all_tracked]

        tracked_files_list = [f for f in changed_files if f in all_tracked]

        if len(tracked_files_list) > 50:
            logger.warn(
                f"Too many tracked files ({len(tracked_files_list)}) for date check, limiting to 50",
                operation="check_hardcoded_dates",
                total_tracked=len(tracked_files_list),
                untracked_count=len(untracked_files_list),
                limited_to=50
            )
            tracked_files_list = tracked_files_list[:50]

        changed_files = untracked_files_list + tracked_files_list

        original_count = len(changed_files)
        filtered_files: List[str] = []
        skipped_files = 0
        for file_entry in changed_files:
            file_path_str = str(file_entry)
            if is_historical_dir_path(file_path_str):
                skipped_files += 1
                logger.debug(
                    "Skipping historical document in pre-filter",
                    operation="check_hardcoded_dates",
                    file_path=file_path_str
                )
                continue
            if is_historical_path(file_path_str):
                skipped_files += 1
                continue
            filtered_files.append(file_path_str)
        changed_files = filtered_files

        # Apply classification gating if provided
        if classification_map:
            allowed = {"CONTENT_CHANGED", "NEW_FILE"}
            changed_files = [
                f for f in changed_files
                if classification_map.get(f) in allowed and not is_historical_path(f)
            ]

        if skipped_files:
            logger.debug(
                "Pre-filtered historical files from date check",
                operation="check_hardcoded_dates",
                original_count=original_count,
                filtered_count=len(changed_files),
                filtered_out=skipped_files
            )

        # PERFORMANCE OPTIMIZATION: Batch file modification status computation
        # Use git diff --name-status once for all files instead of calling is_file_modified_in_session()
        # for each file individually. This reduces git calls from 500-750 to 1-2 (99% reduction).
        file_modification_cache = {}
        try:
            cache_key = get_git_state_key(project_root)
            batch_status = git_utils.get_batch_file_modification_status(cache_key)
            
            # Build modification cache from batch results
            # CRITICAL FIX: Trust batch status - it already filters whitespace-only changes
            # Only verify session time for files that batch status says are modified
            # Note: Batch status only includes tracked files, so untracked files need special handling
            
            # Get untracked files list for special handling
            cached_changed_files = git_utils.get_cached_changed_files()
            untracked_files_set = set()
            if cached_changed_files:
                untracked_files_set = set(cached_changed_files.get('untracked', []))
            
            for file_path_str in changed_files:
                file_path = project_root / file_path_str
                if file_path.exists() and not file_path.is_dir():
                    # Skip auto-generated enforcement files early (before cache building)
                    if is_auto_generated_enforcement_file(file_path):
                        # Mark as not modified so they are skipped downstream
                        normalized_path = str(file_path_str).replace("\\", "/")
                        file_modification_cache[normalized_path] = False
                        if normalized_path != file_path_str:
                            file_modification_cache[file_path_str] = False
                        continue
                    
                    # Normalize path for consistent cache lookups (Windows/Unix compatibility)
                    normalized_path = str(file_path_str).replace("\\", "/")
                    
                    # Check if file is untracked (batch status only includes tracked files)
                    is_untracked = file_path_str in untracked_files_set or normalized_path in untracked_files_set
                    
                    if is_untracked:
                        # For untracked files, check if they were modified in session
                        # (new files should be checked if they were created in this session)
                        try:
                            file_modification_cache[normalized_path] = is_file_modified_in_session(
                                file_path_str,
                                session,
                                project_root,
                                git_utils
                            )
                        except Exception as e:
                            # If check fails for untracked file, be conservative and check it
                            # (better to check a new file than miss a violation)
                            logger.warn(
                                f"Session time check failed for untracked file {file_path_str}, checking it: {e}",
                                operation="check_hardcoded_dates",
                                file_path=file_path_str,
                                error_code="UNTracked_FILE_CHECK_FAILED",
                                root_cause=str(e)
                            )
                            file_modification_cache[normalized_path] = True
                    else:
                        # For tracked files, check batch status first (fast path)
                        # Batch status uses --ignore-all-space, so it only shows actual content changes
                        is_modified_batch = batch_status.get(normalized_path, False) or batch_status.get(file_path_str, False)
                        
                        if not is_modified_batch:
                            # Batch status says not modified (whitespace-only or move-only)
                            # Trust this result - no need to check session time
                            file_modification_cache[normalized_path] = False
                        else:
                            # Batch status says modified (has actual content changes)
                            # Still need to verify file was modified after session start
                            try:
                                # Verify session time - file must be modified after session started
                                file_modification_cache[normalized_path] = is_file_modified_in_session(
                                    file_path_str,
                                    session,
                                    project_root,
                                    git_utils
                                )
                            except Exception as e:
                                # If session time check fails, trust batch status result
                                # Batch status already filtered whitespace-only changes, so if it says
                                # modified, it's a real content change. We just can't verify session time.
                                logger.warn(
                                    f"Session time check failed for {file_path_str}, trusting batch status: {e}",
                                    operation="check_hardcoded_dates",
                                    file_path=file_path_str,
                                    error_code="SESSION_TIME_CHECK_FAILED",
                                    root_cause=str(e)
                                )
                                # Trust batch status - it says modified, so assume it's valid
                                # This is safer than marking as False (which would miss real violations)
                                file_modification_cache[normalized_path] = True
                    
                    # Also store with original path format for backwards compatibility
                    if normalized_path != file_path_str:
                        file_modification_cache[file_path_str] = file_modification_cache[normalized_path]
            
            logger.debug(
                f"Pre-computed modification status for {len(file_modification_cache)} files using batch method",
                operation="check_hardcoded_dates",
                modified_count=sum(1 for v in file_modification_cache.values() if v),
                batch_file_count=len(batch_status)
            )
        except Exception as e:
            # Fallback to individual checks if batch method fails
            logger.warn(
                f"Batch file modification status failed, falling back to individual checks: {e}",
                operation="check_hardcoded_dates",
                error_code="BATCH_STATUS_FALLBACK",
                root_cause=str(e)
            )
            for file_path_str in changed_files:
                file_path = project_root / file_path_str
                if file_path.exists() and not file_path.is_dir():
                    # Skip auto-generated enforcement files in fallback path as well
                    if is_auto_generated_enforcement_file(file_path):
                        normalized_path = str(file_path_str).replace("\\", "/")
                        file_modification_cache[normalized_path] = False
                        if normalized_path != file_path_str:
                            file_modification_cache[file_path_str] = False
                        continue

                    # Normalize path for consistent cache lookups (Windows/Unix compatibility)
                    normalized_path = str(file_path_str).replace("\\", "/")
                    file_modification_cache[normalized_path] = is_file_modified_in_session(
                        file_path_str,
                        session,
                        project_root,
                        git_utils
                    )
                    # Also store with original path format for backwards compatibility
                    if normalized_path != file_path_str:
                        file_modification_cache[file_path_str] = file_modification_cache[normalized_path]
            
            logger.debug(
                f"Pre-computed modification status for {len(file_modification_cache)} files (fallback method)",
                operation="check_hardcoded_dates",
                modified_count=sum(1 for v in file_modification_cache.values() if v)
            )

        detector = DateDetector(current_date=self.CURRENT_DATE) if DateDetector else None
        doc_context_cache = {}
        excluded_dirs = [
            enforcement_dir,
            project_root / '.cursor' / 'archive',
            project_root / '.cursor' / 'backups'
        ]
        
        # Additional exclusion patterns
        MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB
        exclude_patterns = [
            '/archive/',
            '/archived/',
            '.cursor__archived',  # Match .cursor__archived_2025-04-12 directories
            '/.cursor__disabled/',
            '/backup/',
            '/backups/',
            '/reference/',
            '/references/',
            '/docs/reference/',
        ]

        # Auto-generated enforcement artifacts (often untracked and regenerated every run)
        auto_generated_enforcement_files = {
            'ENFORCEMENT_BLOCK.md',
            'VIOLATIONS.md',
            'ACTIVE_VIOLATIONS.md',
            'AGENT_REMINDERS.md',
            'HISTORICAL_VIOLATIONS_REVIEW.md',
            'ENFORCER_STATUS.md',
        }

        def is_auto_generated_enforcement_file(path_obj: Path) -> bool:
            """Returns True if the file lives under enforcement/ and matches known auto-generated names."""
            return (
                'enforcement' in {p.lower() for p in path_obj.parts}
                and path_obj.name in auto_generated_enforcement_files
            )

        # CRITICAL: Log what files we're processing to diagnose violation persistence
        memory_bank_files_in_changed = [f for f in changed_files if 'memory_bank' in f or 'memory-bank' in f]
        logger.info(
            f"Date checker starting",
            operation="check_hardcoded_dates",
            total_changed_files=len(changed_files),
            memory_bank_files=memory_bank_files_in_changed,
            memory_bank_count=len(memory_bank_files_in_changed),
            session_id=session.id if hasattr(session, 'id') else 'unknown'
        )

        # Filter out known auto-generated enforcement artifacts up front so they never enter caches
        filtered_changed_files: List[str] = []
        auto_generated_skipped = 0
        for file_path_str in changed_files:
            file_path_obj = project_root / file_path_str
            normalized_path_str = str(file_path_str).replace("\\", "/")
            lower_norm = normalized_path_str.lower()

            if is_auto_generated_enforcement_file(file_path_obj):
                auto_generated_skipped += 1
                # Do not process further; these files are regenerated each run and should not trigger date checks
                continue
            # Skip enforcement markdown/log-style docs (historical/auto-generated)
            if lower_norm.startswith("enforcement/") and file_path_obj.suffix.lower() == ".md":
                auto_generated_skipped += 1
                continue
            # Skip .cursor__disabled remnants if present
            if "/.cursor__disabled/" in lower_norm:
                auto_generated_skipped += 1
                continue
            filtered_changed_files.append(file_path_str)

        if auto_generated_skipped:
            logger.info(
                f"Skipped auto-generated enforcement files from changed list",
                operation="check_hardcoded_dates",
                skipped_count=auto_generated_skipped,
                remaining=len(filtered_changed_files)
            )

        # Use filtered list for the rest of the checks
        changed_files = filtered_changed_files

        for file_path_str in changed_files:
            file_path = project_root / file_path_str

            # Log each file being processed (INFO level for diagnostic purposes)
            logger.info(
                f"Processing file for date checks",
                operation="check_hardcoded_dates",
                file_path=file_path_str,
                total_changed_files=len(changed_files)
            )

            if not file_path.exists() or file_path.is_dir():
                continue

            if file_path.suffix in ['.png', '.jpg', '.jpeg', '.gif', '.ico', '.pdf']:
                continue

            if any(file_path.is_relative_to(excluded_dir) for excluded_dir in excluded_dirs):
                continue
            
            # Skip backup files
            normalized_path_str = str(file_path_str).replace("\\", "/")
            if normalized_path_str.endswith('.backup') or '/.backup' in normalized_path_str or file_path.name.endswith('.backup'):
                logger.info(
                    f"Skipping backup file: {file_path_str}",
                    operation="check_hardcoded_dates",
                    file_path=file_path_str,
                    reason="backup_file"
                )
                continue
            
            # Skip archive and reference directories
            if any(pattern in normalized_path_str.lower() for pattern in exclude_patterns):
                logger.info(
                    f"Skipping archived/reference file: {file_path_str}",
                    operation="check_hardcoded_dates",
                    file_path=file_path_str,
                    reason="archived_or_reference"
                )
                continue
            
            # Skip files larger than 10MB
            try:
                size_bytes = file_path.stat().st_size
                if size_bytes >= MAX_FILE_SIZE:
                    logger.info(
                        f"Skipping large file (>10MB): {file_path_str}",
                        operation="check_hardcoded_dates",
                        file_path=file_path_str,
                        size_bytes=size_bytes,
                        max_bytes=MAX_FILE_SIZE,
                        reason="file_too_large"
                    )
                    continue
            except OSError:
                # If stat fails, continue processing (don't skip silently)
                pass

            # Skip auto-generated enforcement files (regenerated every run, always have current dates)
            if is_auto_generated_enforcement_file(file_path):
                logger.info(
                    f"Skipping auto-generated enforcement file: {file_path_str}",
                    operation="check_hardcoded_dates",
                    file_path=file_path_str,
                    reason="auto_generated_enforcement_file"
                )
                continue

            # HARDCODED CHECK: Skip memory_bank files immediately (diagnostic test)
            # This helps isolate whether the issue is in DocumentContext detection or flow logic
            normalized_path_for_check = str(file_path_str).replace("\\", "/").lower()
            if ".ai/memory_bank/" in normalized_path_for_check or ".ai/memory-bank/" in normalized_path_for_check:
                logger.info(
                    f"Skipping memory_bank file (hardcoded check): {file_path_str}",
                    operation="check_hardcoded_dates",
                    file_path=file_path_str,
                    normalized_path=normalized_path_for_check,
                    reason="memory_bank_hardcoded"
                )
                continue

            # FIRST: Check if file was modified in this session (MANDATORY)
            # Normalize path for cache lookup (Windows/Unix compatibility)
            normalized_path = str(file_path_str).replace("\\", "/")
            file_modified = file_modification_cache.get(normalized_path, file_modification_cache.get(file_path_str, False))
            
            if not file_modified:
                logger.info(
                    f"Skipping file (not modified in session): {file_path_str}",
                    operation="check_hardcoded_dates",
                    file_path=file_path_str,
                    reason="file_not_modified_in_session"
                )
                continue
            else:
                logger.info( # Add diagnostic logging
                    f"File WAS modified in session, continuing checks: {file_path_str}",
                    operation="check_hardcoded_dates",
                    file_path=file_path_str,
                    file_modified=file_modified,
                    normalized_path=normalized_path
                )

            # SECOND: Check for log files and historical docs EARLY (before expensive operations)
            # This prevents reading files and finding dates for files that should be skipped
            # IMPORTANT: Use normalized_path as cache key for consistency
            doc_context = None
            if DocumentContext:
                # Use normalized_path as cache key to ensure consistency
                cache_key = normalized_path
                if cache_key not in doc_context_cache:
                    doc_context_cache[cache_key] = DocumentContext(file_path)
                doc_context = doc_context_cache[cache_key]
                
                # ADD DETAILED LOGGING for diagnostic purposes
                logger.info(
                    f"DocumentContext created/retrieved for file",
                    operation="check_hardcoded_dates",
                    file_path=file_path_str,
                    normalized_path=normalized_path,
                    cache_key=cache_key,
                    is_log_file=doc_context.is_log_file,
                    is_historical_doc=doc_context.is_historical_doc,
                    doc_context_type=type(doc_context).__name__
                )

                # Check for log files EARLY - skip entire file, not just "Last Updated" fields
                if doc_context.is_log_file:
                    logger.debug(
                        f"Skipping log file (early check): {file_path_str}",
                        operation="check_hardcoded_dates",
                        file_path=file_path_str,
                        reason="is_log_file"
                    )
                    continue
                
                # Check for historical docs EARLY
                if doc_context.is_historical_doc:
                    logger.debug(
                        f"Skipping historical document file (early check): {file_path_str}",
                        operation="check_hardcoded_dates",
                        file_path=file_path_str,
                        reason="is_historical_doc"
                    )
                    continue
            else:
                # Fallback: use direct function calls if DocumentContext not available
                if is_log_file(file_path):
                    logger.debug(
                        f"Skipping log file (early check): {file_path_str}",
                        operation="check_hardcoded_dates",
                        file_path=file_path_str,
                        reason="is_log_file"
                    )
                    continue
                if is_historical_document_file(file_path):
                    logger.debug(
                        f"Skipping historical document file (early check): {file_path_str}",
                        operation="check_hardcoded_dates",
                        file_path=file_path_str,
                        reason="is_historical_doc"
                    )
                    continue

            # Check for historical directories
            if is_historical_dir_path(file_path):
                file_path_str_normalized = str(file_path).replace("\\", "/").lower()
                logger.debug(
                    f"Skipping historical document directory (early check): {file_path_str}",
                    operation="check_hardcoded_dates",
                    file_path=str(file_path),
                    normalized_path=file_path_str_normalized,
                    reason="historical_document_directory"
                )
                continue

            # THEN: Classify file change type (after log/historical checks)
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
                logger.debug(
                    f"Skipping file (change type: {change_type.value}): {file_path_str}",
                    operation="check_hardcoded_dates",
                    file_path=file_path_str,
                    change_type=change_type.value
                )
                continue

            # Only check CONTENT_CHANGED and NEW_FILE
            if change_type not in [FileChangeType.CONTENT_CHANGED, FileChangeType.NEW_FILE]:
                continue

            normalized_for_missing = str(file_path).replace("\\", "/")
            required_paths = required_last_updated_paths or []
            enforce_missing_last_updated = any(normalized_for_missing.startswith(p) for p in required_paths)
            found_last_updated = False

            # File was already verified as modified in session above
            # Continue with date checking

            # DEFENSIVE CHECK: Final safety check before any file processing
            # This catches files that might slip through to the fallback path
            # Ensures log files are NEVER processed, regardless of code path
            # Use normalized_path as cache key for consistency
            if DocumentContext:
                if not doc_context:
                    cache_key = normalized_path
                    if cache_key not in doc_context_cache:
                        doc_context_cache[cache_key] = DocumentContext(file_path)
                    doc_context = doc_context_cache[cache_key]
                if doc_context.is_log_file:
                    logger.debug(
                        f"Skipping log file (defensive check): {file_path_str}",
                        operation="check_hardcoded_dates",
                        file_path=file_path_str,
                        reason="is_log_file_defensive"
                    )
                    continue
            elif is_log_file(file_path):
                logger.debug(
                    f"Skipping log file (defensive check, no DocumentContext): {file_path_str}",
                    operation="check_hardcoded_dates",
                    file_path=file_path_str,
                    reason="is_log_file_defensive"
                )
                continue

            # NOW proceed with try block - log files are guaranteed to be filtered out
            try:
                if detector and doc_context:
                    with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                        file_content = f.read()

                    date_matches = detector.find_dates(file_content, context_lines=3)

                    for date_match in date_matches:
                        line_num = date_match.line_number
                        
                        # DEFENSIVE CHECK: Validate line_number before using it
                        if line_num is None or line_num == "N/A" or not isinstance(line_num, int):
                            logger.error(
                                f"DateMatch has invalid line_number! Skipping violation creation",
                                operation="check_hardcoded_dates",
                                file_path=file_path_str,
                                date_str=date_match.date_str,
                                line_content=date_match.line_content[:100] if date_match.line_content else "",
                                line_number_value=line_num,
                                line_number_type=type(line_num).__name__,
                                date_match_type=type(date_match).__name__
                            )
                            continue  # Skip this match entirely
                        
                        line = date_match.line_content

                        if file_path.name == 'auto-enforcer.py' and (
                            'HISTORICAL_DATE_PATTERNS' in line or
                            ('re.compile' in line and 'date' in line.lower())
                        ):
                            continue

                        # Only check if line was changed if the file itself was modified
                        # This prevents flagging lines in moved files (where file_modified is False)
                        if not file_modified:
                            # File was not modified (possibly moved) - skip all lines
                            logger.debug(
                                f"Skipping line in file that was not modified (possibly moved): {file_path_str}:{line_num}",
                                operation="check_hardcoded_dates",
                                file_path=file_path_str,
                                line_number=line_num,
                                reason="file_not_modified_or_moved"
                            )
                            continue
                        
                        if classification_map is not None:
                            line_changed = True
                        else:
                            line_changed = git_utils.is_line_changed_in_session(file_path_str, line_num, session_start)
                            if not line_changed:
                                continue

                        classification = detector.classify_date(date_match, doc_context)
                        is_last_updated = re.search(r'last\s+updated\s*:', line, re.IGNORECASE)
                        
                        # Check for report-style metadata dates (should be preserved)
                        # Pattern: **Date:**, **Report Generated:**, **Created:**, etc.
                        is_report_metadata = re.search(r'\*\*(date|created|updated|generated|report|validated)[:*]\s*', line, re.IGNORECASE)
                        
                        # Skip historical dates (including report metadata dates)
                        if classification == DateClassification.HISTORICAL or classification == DateClassification.EXAMPLE:
                            logger.debug(
                                f"Skipping historical/example date: {file_path_str}:{line_num}",
                                operation="check_hardcoded_dates",
                                file_path=file_path_str,
                                line_number=line_num,
                                classification=classification.value,
                                date=date_match.date_str
                            )
                            continue
                        
                        # Skip report-style metadata dates (even if not classified as historical)
                        if is_report_metadata:
                            logger.debug(
                                f"Skipping report metadata date: {file_path_str}:{line_num}",
                                operation="check_hardcoded_dates",
                                file_path=file_path_str,
                                line_number=line_num,
                                date=date_match.date_str
                            )
                            continue

                        if is_last_updated:
                            found_last_updated = True
                            if doc_context.is_log_file:
                                continue

                            if date_match.date_str != self.CURRENT_DATE:
                                violations.append(Violation(
                                    severity=ViolationSeverity.BLOCKED,
                                    rule_ref="02-core.mdc",
                                    message=f"'Last Updated' field modified but date not updated to current: {date_match.date_str} (current: {self.CURRENT_DATE})",
                                    file_path=str(file_path),
                                    line_number=line_num,
                                    session_scope=session_scope
                                ))
                            continue

                        if classification == DateClassification.CURRENT and date_match.date_str != self.CURRENT_DATE:
                            violations.append(Violation(
                                severity=ViolationSeverity.BLOCKED,
                                rule_ref="02-core.mdc",
                                message=f"Hardcoded date found in modified line: {date_match.date_str} (current date: {self.CURRENT_DATE})",
                                file_path=str(file_path),
                                line_number=line_num,
                                session_scope=session_scope
                            ))
                else:
                    # Fallback path: check for log files here too (safety check)
                    if DocumentContext and doc_context and doc_context.is_log_file:
                        logger.debug(
                            f"Skipping log file (fallback path): {file_path_str}",
                            operation="check_hardcoded_dates",
                            file_path=file_path_str,
                            reason="is_log_file"
                        )
                        continue
                    if not DocumentContext and is_log_file(file_path):
                        logger.debug(
                            f"Skipping log file (fallback path, no DocumentContext): {file_path_str}",
                            operation="check_hardcoded_dates",
                            file_path=file_path_str,
                            reason="is_log_file"
                        )
                        continue
                    
                    with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                        in_code_block = False

                        for line_num, line in enumerate(f, 1):
                            if '```' in line:
                                in_code_block = not in_code_block
                            if not self.HARDCODED_DATE_PATTERN.search(line):
                                continue

                            if file_path.name == 'auto-enforcer.py' and (
                                'HISTORICAL_DATE_PATTERNS' in line or
                                ('re.compile' in line and 'date' in line.lower())
                            ):
                                continue

                            if classification_map is not None:
                                line_changed = True
                            else:
                                line_changed = git_utils.is_line_changed_in_session(file_path_str, line_num, session_start)
                                if not line_changed:
                                    continue

                            if self._is_historical_date_pattern(line):
                                continue
                            
                            # Check for report-style metadata dates (should be preserved)
                            # Pattern: **Date:**, **Report Generated:**, **Created:**, etc.
                            is_report_metadata = re.search(r'\*\*(date|created|updated|generated|report|validated)[:*]\s*', line, re.IGNORECASE)
                            if is_report_metadata:
                                logger.debug(
                                    f"Skipping report metadata date: {file_path_str}:{line_num}",
                                    operation="check_hardcoded_dates",
                                    file_path=file_path_str,
                                    line_number=line_num
                                )
                                continue

                            if is_documentation_file(file_path) and in_code_block:
                                continue

                            is_last_updated = re.search(r'last\s+updated\s*:', line, re.IGNORECASE)
                            if is_last_updated:
                                found_last_updated = True
                                if DocumentContext and doc_context and doc_context.is_log_file:
                                    continue
                                if not DocumentContext and is_log_file(file_path):
                                    continue

                                matches = self.HARDCODED_DATE_PATTERN.findall(line)
                                for match in matches:
                                    date_str = self._normalize_date_match(match if isinstance(match, tuple) else (match,))
                                    if date_str != self.CURRENT_DATE:
                                        violations.append(Violation(
                                            severity=ViolationSeverity.BLOCKED,
                                            rule_ref="02-core.mdc",
                                            message=f"'Last Updated' field modified but date not updated to current: {date_str} (current: {self.CURRENT_DATE})",
                                            file_path=str(file_path),
                                            line_number=line_num,
                                            session_scope=session_scope
                                        ))
                                continue

                            matches = self.HARDCODED_DATE_PATTERN.findall(line)
                            for match in matches:
                                date_str = self._normalize_date_match(match if isinstance(match, tuple) else (match,))
                                if date_str != self.CURRENT_DATE:
                                    violations.append(Violation(
                                        severity=ViolationSeverity.BLOCKED,
                                        rule_ref="02-core.mdc",
                                        message=f"Hardcoded date found in modified line: {date_str} (current date: {self.CURRENT_DATE})",
                                        file_path=str(file_path),
                                        line_number=line_num,
                                        session_scope=session_scope
                                    ))
            except (FileNotFoundError, PermissionError, OSError, UnicodeDecodeError) as exc:
                logger.warn(
                    f"Failed to check file for hardcoded dates: {str(exc)}",
                    operation="check_hardcoded_dates",
                    error_code="DATE_CHECK_FAILED",
                    file_path=str(file_path)
                )

            if enforce_missing_last_updated and not found_last_updated:
                violations.append(Violation(
                    severity=ViolationSeverity.WARNING,
                    rule_ref="02-core.mdc",
                    message=f"Missing 'Last Updated' field; add one with current date ({self.CURRENT_DATE})",
                    file_path=str(file_path),
                    line_number=1,
                    session_scope=session_scope
                ))

        # FINAL SAFETY CHECK: Filter out any violations for log files that might have slipped through
        # This prevents returning violations for memory_bank files even if they somehow bypassed earlier checks
        filtered_violations = []
        for violation in violations:
            file_path_str = violation.file_path
            # Normalize path for checking
            normalized_violation_path = str(file_path_str).replace("\\", "/").lower()
            # Skip violations for memory_bank files
            if ".ai/memory_bank/" in normalized_violation_path or ".ai/memory-bank/" in normalized_violation_path:
                logger.info(
                    f"Filtering out violation for log file (final safety check): {file_path_str}",
                    operation="check_hardcoded_dates",
                    file_path=file_path_str,
                    violation_message=violation.message[:100] if violation.message else "",
                    reason="log_file_final_filter"
                )
                continue
            filtered_violations.append(violation)
        
        # DIAGNOSTIC: Temporarily disabled to prevent hanging
        # Re-enable by setting ENABLE_DIAGNOSTICS = True
        ENABLE_DIAGNOSTICS = False
        
        if ENABLE_DIAGNOSTICS:
            # DIAGNOSTIC: Analyze violation patterns to identify stale violations and patterns
            _diagnose_violations(filtered_violations, session, project_root, logger)
            
            # DIAGNOSTIC: Check if violations are legitimate (files actually modified, lines actually changed)
            # Add explicit logging to verify this code path is reached
            import sys
            print(f"[DEBUG] Preparing diagnostic. Total violations: {len(violations)}, Filtered: {len(filtered_violations)}", flush=True)
            if violations:
                print(f"[DEBUG] First violation (pre-filter): {violations[0].file_path}:{violations[0].line_number}", flush=True)
            if filtered_violations:
                print(f"[DEBUG] First violation (post-filter): {filtered_violations[0].file_path}:{filtered_violations[0].line_number}", flush=True)
            else:
                print(f"[DEBUG] WARNING: All violations filtered out! Total was {len(violations)}", flush=True)
            
            logger.info(
                f"Preparing to run violation legitimacy diagnostic",
                operation="check_hardcoded_dates",
                total_violations=len(violations),
                filtered_violations=len(filtered_violations),
                has_filtered_violations=bool(filtered_violations),
                first_violation_pre_filter=violations[0].file_path if violations else None,
                first_violation_post_filter=filtered_violations[0].file_path if filtered_violations else None
            )
            
            try:
                sample_size = min(20, len(filtered_violations))
                logger.info(
                    f"Running violation legitimacy diagnostic on {sample_size} violations",
                    operation="check_hardcoded_dates",
                    total_filtered_violations=len(filtered_violations),
                    total_violations_before_filter=len(violations),
                    sample_size=sample_size
                )
                
                if filtered_violations:
                    print(f"[DEBUG] Calling _diagnose_violation_legitimacy with {sample_size} violations", flush=True)
                    logger.info(
                        f"Calling _diagnose_violation_legitimacy with {sample_size} violations",
                        operation="check_hardcoded_dates",
                        first_violation_file=filtered_violations[0].file_path if filtered_violations else None,
                        first_violation_line=filtered_violations[0].line_number if filtered_violations else None
                    )
                    _diagnose_violation_legitimacy(filtered_violations[:sample_size], session, project_root, git_utils, logger)
                    print(f"[DEBUG] Diagnostic completed successfully", flush=True)
                    logger.info(
                        f"Violation legitimacy diagnostic completed successfully",
                        operation="check_hardcoded_dates",
                        sample_size=sample_size
                    )
                else:
                    print(f"[DEBUG] SKIPPING diagnostic - no violations after filtering (had {len(violations)} before filter)", flush=True)
                    logger.warning(
                        f"No violations to diagnose (all filtered out)",
                        operation="check_hardcoded_dates",
                        total_violations_before_filter=len(violations),
                        filtered_violations_count=len(filtered_violations)
                    )
            except Exception as e:
                import traceback
                error_traceback = traceback.format_exc()
                logger.error(
                    f"Failed to run violation legitimacy diagnostic: {e}",
                    operation="check_hardcoded_dates",
                    error=str(e),
                    error_type=type(e).__name__,
                    traceback=error_traceback,
                    total_violations=len(violations),
                    filtered_violations=len(filtered_violations)
                )
                # Also print to stdout for visibility
                print(f"[ERROR] Diagnostic failed: {e}", flush=True)
                print(f"[ERROR] Traceback: {error_traceback}", flush=True)
        
        logger.info(
            f"Date checker completed",
            operation="check_hardcoded_dates",
            total_violations=len(violations),
            filtered_violations=len(filtered_violations),
            filtered_out=len(violations) - len(filtered_violations)
        )
        
        # Force print to stdout for visibility
        print(f"[DATE_CHECKER] Completed: {len(violations)} total, {len(filtered_violations)} filtered", flush=True)
        if filtered_violations:
            print(f"[DATE_CHECKER] First violation: {filtered_violations[0].file_path}:{filtered_violations[0].line_number}", flush=True)
        
        return filtered_violations


def _diagnose_violations(
    violations: List[Violation],
    session: EnforcementSession,
    project_root: Path,
    logger
) -> None:
    """
    Diagnostic function to analyze violation patterns and identify stale violations.
    
    This helps identify:
    - Stale violations from previous sessions (N/A line numbers)
    - Directory patterns (which directories have most violations)
    - File type patterns (which file types have most violations)
    - Files with multiple violations
    """
    if not violations:
        return
    
    # 1. Check for N/A line numbers (definitely stale)
    na_violations = [
        v for v in violations 
        if v.line_number is None or v.line_number == "N/A" or str(v.line_number).upper() == "N/A"
    ]
    
    # 2. Session scope breakdown
    current_session_violations = [v for v in violations if v.session_scope == "current_session"]
    historical_violations = [v for v in violations if v.session_scope == "historical"]
    unknown_scope_violations = [v for v in violations if v.session_scope == "unknown"]
    
    # 3. Directory patterns
    directory_patterns = Counter()
    for v in violations:
        if v.file_path:
            try:
                path = Path(v.file_path)
                # Get first 2 parts of path for pattern (e.g., ".ai/rules/", "docs/")
                parts = path.parts
                if len(parts) >= 2:
                    pattern = f"{parts[0]}/{parts[1]}/"
                elif len(parts) == 1:
                    pattern = parts[0]
                else:
                    pattern = "unknown"
                directory_patterns[pattern] += 1
            except Exception:
                directory_patterns["error_parsing_path"] += 1
    
    # 4. File type patterns
    file_extensions = Counter()
    for v in violations:
        if v.file_path:
            try:
                ext = Path(v.file_path).suffix or "no_extension"
                file_extensions[ext] += 1
            except Exception:
                file_extensions["error"] += 1
    
    # 5. Files with most violations
    file_violation_counts = Counter()
    for v in violations:
        if v.file_path:
            file_violation_counts[v.file_path] += 1
    
    # 6. Check if files exist and are log files
    sample_violations = violations[:min(20, len(violations))]  # Sample first 20
    sample_analysis = []
    for v in sample_violations:
        if v.file_path:
            try:
                file_path = project_root / v.file_path
                exists = file_path.exists()
                is_log = False
                if exists:
                    is_log = is_log_file(file_path)
                sample_analysis.append({
                    "file": v.file_path,
                    "exists": exists,
                    "is_log_file": is_log,
                    "line_number": v.line_number,
                    "has_message": bool(v.message)
                })
            except Exception:
                pass
    
    # Log diagnostic summary
    logger.info(
        "Violation diagnostic summary",
        operation="check_hardcoded_dates",
        total_violations=len(violations),
        na_line_numbers=len(na_violations),
        na_percentage=f"{len(na_violations)/len(violations)*100:.1f}%" if violations else "0%",
        current_session_count=len(current_session_violations),
        historical_count=len(historical_violations),
        unknown_scope_count=len(unknown_scope_violations),
        top_directories=dict(directory_patterns.most_common(10)),
        top_extensions=dict(file_extensions.most_common(10)),
        top_files=dict(file_violation_counts.most_common(10)),
        sample_analysis=sample_analysis[:5]  # Log first 5 samples
    )
    
    # Log warnings for suspicious patterns
    if na_violations:
        logger.warning(
            f"Found {len(na_violations)} violations with N/A line numbers (likely stale)",
            operation="check_hardcoded_dates",
            na_count=len(na_violations),
            sample_na_violations=[
                {
                    "file": v.file_path,
                    "message": v.message[:80] if v.message else "",
                    "scope": v.session_scope
                }
                for v in na_violations[:5]
            ]
        )
    
    if unknown_scope_violations:
        logger.warning(
            f"Found {len(unknown_scope_violations)} violations with unknown session scope",
            operation="check_hardcoded_dates",
            unknown_scope_count=len(unknown_scope_violations)
        )


def _diagnose_violation_legitimacy(
    violations: List[Violation],
    session: EnforcementSession,
    project_root: Path,
    git_utils: GitUtils,
    logger
) -> None:
    """
    Diagnostic function to verify if violations are legitimate.
    
    Checks:
    - Was the file actually modified in this session?
    - What is the git status of the file?
    - Was the specific line actually changed?
    """
    # Add explicit entry logging
    logger.info(
        f"_diagnose_violation_legitimacy called",
        operation="check_hardcoded_dates",
        violations_count=len(violations) if violations else 0,
        has_violations=bool(violations)
    )
    print(f"[DIAGNOSTIC] _diagnose_violation_legitimacy called with {len(violations) if violations else 0} violations", flush=True)
    
    if not violations:
        logger.info(
            f"No violations to diagnose",
            operation="check_hardcoded_dates",
            violations_count=0
        )
        print(f"[DIAGNOSTIC] No violations to diagnose", flush=True)
        return
    
    import subprocess
    from datetime import datetime
    from enforcement.core.file_scanner import is_file_modified_in_session
    
    session_start = datetime.fromisoformat(session.start_time.replace('Z', '+00:00'))
    
    # Log to both logger and file for debugging
    diagnostic_msg = f"Diagnosing legitimacy of {len(violations)} violations"
    print(f"[DIAGNOSTIC] {diagnostic_msg}", flush=True)
    logger.info(
        diagnostic_msg,
        operation="check_hardcoded_dates",
        sample_size=len(violations)
    )
    
    # Also write to a diagnostic file for visibility
    try:
        diagnostic_file = project_root / ".cursor" / "enforcement" / "violation_diagnostic.log"
        with open(diagnostic_file, 'a', encoding='utf-8') as f:
            f.write(f"\n=== Violation Legitimacy Diagnostic ===\n")
            f.write(f"Sample size: {len(violations)}\n")
            f.write(f"Session: {session.session_id}\n")
    except Exception:
        pass  # Don't fail if we can't write the file
    
    # Track violation type distribution
    from collections import Counter
    violation_type_counts = Counter()
    
    for v in violations:
        if not v.file_path or not v.line_number:
            continue
        
        file_path = project_root / v.file_path
        
        # Check if file was actually modified in this session
        try:
            was_modified = is_file_modified_in_session(
                str(v.file_path),
                session,
                project_root,
                git_utils
            )
        except Exception as e:
            logger.warning(
                f"Failed to check if file was modified",
                operation="check_hardcoded_dates",
                file_path=v.file_path,
                error=str(e)
            )
            was_modified = False
        
        # Check git status
        try:
            git_status_result = subprocess.run(
                ['git', 'status', '--porcelain', str(v.file_path)],
                capture_output=True,
                text=True,
                cwd=project_root,
                timeout=5
            )
            git_status = git_status_result.stdout.strip()
        except Exception as e:
            git_status = f"error: {str(e)}"
        
        # Check if line was actually changed
        try:
            line_changed = git_utils.is_line_changed_in_session(
                str(v.file_path),
                v.line_number,
                session_start,
                classification_map=classification_map if classification_map else None
            )
        except Exception as e:
            logger.warning(
                f"Failed to check if line was changed",
                operation="check_hardcoded_dates",
                file_path=v.file_path,
                line_number=v.line_number,
                error=str(e)
            )
            line_changed = False
        
        # Determine violation type
        violation_type = "UNKNOWN"
        if not was_modified:
            violation_type = "FALSE_POSITIVE_NOT_MODIFIED"
        elif not line_changed:
            violation_type = "FALSE_POSITIVE_LINE_NOT_CHANGED"
        elif was_modified and line_changed:
            violation_type = "LEGITIMATE"
        
        violation_type_counts[violation_type] += 1
        
        # Force output to stdout for debugging
        print(f"[DIAGNOSTIC] {v.file_path}:{v.line_number} - {violation_type} (modified={was_modified}, line_changed={line_changed})", flush=True)
        
        logger.info(
            f"Violation diagnostic",
            operation="check_hardcoded_dates",
            file=v.file_path,
            line_number=v.line_number,
            was_modified=was_modified,
            git_status=git_status,
            line_changed=line_changed,
            violation_type=violation_type,
            message=v.message[:100] if v.message else "",
            file_exists=file_path.exists() if file_path else False
        )
    
    # Log summary statistics
    logger.info(
        "Violation legitimacy summary",
        operation="check_hardcoded_dates",
        total_sampled=len(violations),
        distribution=dict(violation_type_counts),
        percentages={
            k: f"{v/len(violations)*100:.1f}%" 
            for k, v in violation_type_counts.items()
        } if violations else {}
    )

