from pathlib import Path
from typing import List

from enforcement.core.violations import Violation, ViolationSeverity
from enforcement.core.session_state import EnforcementSession, get_file_hash

try:
    from logger_util import get_logger

    logger = get_logger(context="security_checker")
except ImportError:  # pragma: no cover
    import logging

    logging.basicConfig(level=logging.INFO)

    class _FallbackLogger:
        def __init__(self):
            self._logger = logging.getLogger("security_checker")

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


class SecurityChecker:
    """Validates modifications to security-sensitive files."""

    def __init__(self, session: EnforcementSession):
        self.session = session

    def check_security_compliance(
        self,
        changed_files: List[str],
        project_root: Path,
        security_file_patterns: List[str],
    ) -> List[Violation]:
        violations: List[Violation] = []
        security_files_changed: List[str] = []

        for file_path_str in changed_files:
            is_security_file = any(
                pattern.replace("**/", "").replace("/*", "") in file_path_str
                for pattern in security_file_patterns
            )
            if is_security_file:
                security_files_changed.append(file_path_str)

        for file_path_str in security_files_changed:
            try:
                get_file_hash(project_root / file_path_str, self.session, project_root)
            except Exception as exc:  # pragma: no cover - hashing best effort
                logger.debug(
                    "Failed to hash security file (non-blocking)",
                    operation="check_security_compliance",
                    file_path=file_path_str,
                    error=str(exc),
                )
            violations.append(
                Violation(
                    severity=ViolationSeverity.WARNING,
                    rule_ref="03-security.mdc",
                    message=f"Security-sensitive file modified: {file_path_str}",
                    file_path=file_path_str,
                    session_scope="current_session",
                )
            )

        return violations

