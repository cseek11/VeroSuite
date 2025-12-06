import re
from datetime import datetime
from pathlib import Path
from typing import List, Optional

from enforcement.core.violations import Violation, ViolationSeverity
from enforcement.core.session_state import EnforcementSession
from enforcement.core.git_utils import GitUtils
from enforcement.core.scope_evaluator import (
    is_historical_dir_path,
    is_historical_document_file,
    is_log_file,
    is_documentation_file,
)
from enforcement.core.file_scanner import is_file_modified_in_session

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
    ) -> List[Violation]:
        violations: List[Violation] = []
        session_scope = violation_scope if violation_scope else "current_session"
        session_start = datetime.fromisoformat(session.start_time.replace('Z', '+00:00'))

        git_output = git_utils.run_git_command(['ls-files'])
        if git_output:
            all_tracked = {line.strip() for line in git_output.split('\n') if line.strip()}
        else:
            all_tracked = set()

        untracked_files = [f for f in changed_files if f not in all_tracked]
        tracked_files = [f for f in changed_files if f in all_tracked]

        if len(tracked_files) > 50:
            logger.warn(
                f"Too many tracked files ({len(tracked_files)}) for date check, limiting to 50",
                operation="check_hardcoded_dates",
                total_tracked=len(tracked_files),
                untracked_count=len(untracked_files),
                limited_to=50
            )
            tracked_files = tracked_files[:50]

        changed_files = untracked_files + tracked_files

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
            filtered_files.append(file_path_str)
        changed_files = filtered_files

        if skipped_files:
            logger.debug(
                "Pre-filtered historical files from date check",
                operation="check_hardcoded_dates",
                original_count=original_count,
                filtered_count=len(changed_files),
                filtered_out=skipped_files
            )

        file_modification_cache = {}
        for file_path_str in changed_files:
            file_path = project_root / file_path_str
            if file_path.exists() and not file_path.is_dir():
                file_modification_cache[file_path_str] = is_file_modified_in_session(
                    file_path_str,
                    session,
                    project_root,
                    git_utils
                )

        logger.debug(
            f"Pre-computed modification status for {len(file_modification_cache)} files",
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

        for file_path_str in changed_files:
            file_path = project_root / file_path_str

            if not file_path.exists() or file_path.is_dir():
                continue

            if file_path.suffix in ['.png', '.jpg', '.jpeg', '.gif', '.ico', '.pdf']:
                continue

            if any(file_path.is_relative_to(excluded_dir) for excluded_dir in excluded_dirs):
                continue

            if is_historical_dir_path(file_path):
                file_path_str_normalized = str(file_path).replace("\\", "/").lower()
                logger.info(
                    "Skipping historical document directory in date checker",
                    operation="check_hardcoded_dates",
                    file_path=str(file_path),
                    normalized_path=file_path_str_normalized,
                    reason="historical_document_directory"
                )
                continue

            doc_context = None
            if DocumentContext:
                if file_path_str not in doc_context_cache:
                    doc_context_cache[file_path_str] = DocumentContext(file_path)
                doc_context = doc_context_cache[file_path_str]

                if doc_context.is_log_file:
                    continue
                if doc_context.is_historical_doc:
                    logger.debug(
                        f"Skipping historical document file: {file_path_str}",
                        operation="check_hardcoded_dates",
                        file_path=file_path_str,
                        reason="file_name_contains_date"
                    )
                    continue
            else:
                if is_log_file(file_path):
                    continue
                if is_historical_document_file(file_path):
                    logger.debug(
                        f"Skipping historical document file: {file_path_str}",
                        operation="check_hardcoded_dates",
                        file_path=file_path_str,
                        reason="file_name_contains_date"
                    )
                    continue

            file_modified = file_modification_cache.get(file_path_str, False)
            if not file_modified:
                logger.debug(
                    f"Skipping file (not modified in session): {file_path_str}",
                    operation="check_hardcoded_dates",
                    file_path=file_path_str
                )
                continue

            try:
                if detector and doc_context:
                    with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                        file_content = f.read()

                    date_matches = detector.find_dates(file_content, context_lines=3)

                    for date_match in date_matches:
                        line_num = date_match.line_number
                        line = date_match.line_content

                        if file_path.name == 'auto-enforcer.py' and (
                            'HISTORICAL_DATE_PATTERNS' in line or
                            ('re.compile' in line and 'date' in line.lower())
                        ):
                            continue

                        line_changed = git_utils.is_line_changed_in_session(file_path_str, line_num, session_start)
                        if not line_changed:
                            continue

                        classification = detector.classify_date(date_match, doc_context)
                        is_last_updated = re.search(r'last\s+updated\s*:', line, re.IGNORECASE)

                        if is_last_updated:
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
                            else:
                                violations.append(Violation(
                                    severity=ViolationSeverity.BLOCKED,
                                    rule_ref="02-core.mdc",
                                    message=f"'Last Updated' field should be updated to current date ({self.CURRENT_DATE}) since file was modified",
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

                            line_changed = git_utils.is_line_changed_in_session(file_path_str, line_num, session_start)
                            if not line_changed:
                                continue

                            if self._is_historical_date_pattern(line):
                                continue

                            if is_documentation_file(file_path) and in_code_block:
                                continue

                            is_last_updated = re.search(r'last\s+updated\s*:', line, re.IGNORECASE)
                            if is_last_updated:
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

        return violations

