from pathlib import Path
from typing import List

from enforcement.core.violations import Violation, ViolationSeverity

try:
    from logger_util import get_logger

    logger = get_logger(context="memory_bank_checker")
except ImportError:  # pragma: no cover
    import logging

    logging.basicConfig(level=logging.INFO)

    class _FallbackLogger:
        def __init__(self):
            self._logger = logging.getLogger("memory_bank_checker")

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


class MemoryBankChecker:
    """Validates Memory Bank file presence and basic health."""

    def check_memory_bank(
        self,
        memory_bank_dir: Path,
        memory_bank_files: List[str],
    ) -> List[Violation]:
        violations: List[Violation] = []

        for filename in memory_bank_files:
            file_path = memory_bank_dir / filename
            if not file_path.exists():
                violations.append(
                    Violation(
                        severity=ViolationSeverity.BLOCKED,
                        rule_ref="01-enforcement.mdc Step 0",
                        message=f"Missing Memory Bank file: {filename}",
                        file_path=str(file_path),
                        session_scope="current_session",
                    )
                )
            elif file_path.stat().st_size == 0:
                violations.append(
                    Violation(
                        severity=ViolationSeverity.WARNING,
                        rule_ref="01-enforcement.mdc Step 0",
                        message=f"Memory Bank file is empty: {filename}",
                        file_path=str(file_path),
                        session_scope="current_session",
                    )
                )

        if violations:
            logger.debug(
                "Memory Bank issues detected",
                operation="check_memory_bank",
                total=len(violations),
            )

        return violations

