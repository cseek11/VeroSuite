import re
from pathlib import Path
from typing import Callable, List

from enforcement.core.git_utils import GitUtils
from enforcement.core.violations import Violation, ViolationSeverity

try:
    from logger_util import get_logger

    logger = get_logger(context="logging_checker")
except ImportError:  # pragma: no cover
    import logging

    logging.basicConfig(level=logging.INFO)

    class _FallbackLogger:
        def __init__(self):
            self._logger = logging.getLogger("logging_checker")

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


class LoggingChecker:
    """Ensures structured logging guidelines are followed."""

    def check_logging(
        self,
        changed_files: List[str],
        project_root: Path,
        git_utils: GitUtils,
        is_file_modified_in_session_func: Callable[[str], bool],
    ) -> List[Violation]:
        violations: List[Violation] = []

        logger.debug(
            "Running logging checker",
            operation="check_logging",
            changed_files=len(changed_files),
            git_root=str(getattr(git_utils, "project_root", project_root)),
        )

        session_modified_files = [
            f
            for f in changed_files
            if is_file_modified_in_session_func(f)
        ]

        console_log_patterns = [
            r'console\.(log|error|warn|debug)',
            r'print\(',
        ]

        for file_path_str in session_modified_files:
            file_path = project_root / file_path_str

            if not file_path.exists() or file_path.suffix not in ['.py', '.ts', '.tsx', '.js', '.jsx']:
                continue

            # Skip tests/specs
            lowercase_path = str(file_path).lower()
            if 'test' in lowercase_path or 'spec' in lowercase_path:
                continue

            try:
                with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                    lines = list(f)

                for pattern in console_log_patterns:
                    for line_num, line in enumerate(lines, 1):
                        if re.search(pattern, line):
                            stripped = line.strip()
                            if stripped.startswith('//') or stripped.startswith('#'):
                                continue

                            violations.append(
                                Violation(
                                    severity=ViolationSeverity.WARNING,
                                    rule_ref="07-observability.mdc",
                                    message=f"Console logging detected (use structured logging): {pattern}",
                                    file_path=str(file_path),
                                    line_number=line_num,
                                    session_scope="current_session",
                                )
                            )
            except (FileNotFoundError, PermissionError, OSError, UnicodeDecodeError) as exc:
                logger.warn(
                    f"Failed to check file for logging: {exc}",
                    operation="check_logging",
                    error_code="LOGGING_CHECK_FAILED",
                    file_path=str(file_path),
                )

        if violations:
            logger.debug(
                "Structured logging violations detected",
                operation="check_logging",
                total=len(violations),
            )

        return violations

