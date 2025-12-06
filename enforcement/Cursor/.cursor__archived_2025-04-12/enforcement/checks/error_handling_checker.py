import re
from pathlib import Path
from typing import Callable, List

from enforcement.core.git_utils import GitUtils
from enforcement.core.violations import Violation, ViolationSeverity

try:
    from logger_util import get_logger

    logger = get_logger(context="error_handling_checker")
except ImportError:  # pragma: no cover
    import logging

    logging.basicConfig(level=logging.INFO)

    class _FallbackLogger:
        def __init__(self):
            self._logger = logging.getLogger("error_handling_checker")

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


class ErrorHandlingChecker:
    """Ensures error-prone operations include proper handling."""

    def check_error_handling(
        self,
        changed_files: List[str],
        project_root: Path,
        git_utils: GitUtils,
        is_file_modified_in_session_func: Callable[[str], bool],
    ) -> List[Violation]:
        violations: List[Violation] = []

        logger.debug(
            "Running error handling checker",
            operation="check_error_handling",
            changed_files=len(changed_files),
            git_root=str(getattr(git_utils, "project_root", project_root)),
        )

        session_modified_files = [
            f
            for f in changed_files
            if is_file_modified_in_session_func(f)
        ]

        error_prone_patterns = [
            (r'await\s+\w+\(', None),
            (r'subprocess\.(run|call|Popen)', None),
            (r'open\(', None),
        ]

        for file_path_str in session_modified_files:
            file_path = project_root / file_path_str

            if not file_path.exists() or file_path.suffix not in ['.py', '.ts', '.tsx', '.js', '.jsx']:
                continue

            is_python = file_path.suffix == '.py'
            is_typescript_js = file_path.suffix in ['.ts', '.tsx', '.js', '.jsx']

            if is_python:
                error_handling_patterns = [r'try\s*:', r'try\s*\n']
            elif is_typescript_js:
                error_handling_patterns = [r'try\s*\{', r'try\s*\n\s*\{', r'catch\s*\(', r'catch\s*\{']
            else:
                error_handling_patterns = []

            try:
                with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                    lines = list(f)

                for pattern, _ in error_prone_patterns:
                    for line_num, line in enumerate(lines, 1):
                        if re.search(pattern, line):
                            context_start = max(0, line_num - 10)
                            context_end = min(len(lines), line_num + 10)
                            context = '\n'.join(lines[context_start:context_end])

                            has_error_handling = any(
                                re.search(eh_pattern, context, re.MULTILINE)
                                for eh_pattern in error_handling_patterns
                            )

                            if not has_error_handling:
                                violations.append(
                                    Violation(
                                        severity=ViolationSeverity.WARNING,
                                        rule_ref="06-error-resilience.mdc",
                                        message=f"Error-prone operation without error handling: {pattern}",
                                        file_path=str(file_path),
                                        line_number=line_num,
                                        session_scope="current_session",
                                    )
                                )
            except (FileNotFoundError, PermissionError, OSError, UnicodeDecodeError) as exc:
                logger.warn(
                    f"Failed to check file for error handling: {exc}",
                    operation="check_error_handling",
                    error_code="ERROR_HANDLING_CHECK_FAILED",
                    file_path=str(file_path),
                )

        if violations:
            logger.debug(
                "Error handling violations detected",
                operation="check_error_handling",
                total=len(violations),
            )

        return violations

