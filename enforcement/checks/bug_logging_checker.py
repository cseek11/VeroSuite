from pathlib import Path
from typing import List

from enforcement.core.violations import Violation, ViolationSeverity

try:
    from logger_util import get_logger

    logger = get_logger(context="bug_logging_checker")
except ImportError:  # pragma: no cover
    import logging

    logging.basicConfig(level=logging.INFO)

    class _FallbackLogger:
        def __init__(self):
            self._logger = logging.getLogger("bug_logging_checker")

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


class BugLoggingChecker:
    """Ensures BUG_LOG.md exists."""

    def check_bug_logging(self, project_root: Path) -> List[Violation]:
        violations: List[Violation] = []

        bug_log_file = project_root / ".cursor" / "BUG_LOG.md"
        if not bug_log_file.exists():
            violations.append(
                Violation(
                    severity=ViolationSeverity.WARNING,
                    rule_ref="01-enforcement.mdc",
                    message="BUG_LOG.md does not exist",
                    file_path=str(bug_log_file),
                    session_scope="current_session",
                )
            )

        if violations:
            logger.debug(
                "Bug logging issues detected",
                operation="check_bug_logging",
            )

        return violations




