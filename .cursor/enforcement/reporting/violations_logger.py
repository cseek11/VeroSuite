from datetime import datetime, timezone
from pathlib import Path
from typing import List

from enforcement.core.session_state import EnforcementSession
from enforcement.core.violations import Violation

try:
    from logger_util import get_logger

    logger = get_logger(context="violations_logger")
except ImportError:  # pragma: no cover
    import logging

    logging.basicConfig(level=logging.INFO)

    class _FallbackLogger:
        def __init__(self):
            self._logger = logging.getLogger("violations_logger")

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


class ViolationsLogger:
    """Generates the VIOLATIONS.md report."""

    def generate_violations_log(
        self,
        violations: List[Violation],
        session: EnforcementSession,
        enforcement_dir: Path,
    ) -> None:
        violations_file = enforcement_dir / "VIOLATIONS.md"

        content = f"""# Violations Log

**Last Updated:** {datetime.now(timezone.utc).isoformat()}
**Session ID:** {session.session_id if session else 'unknown'}

## All Violations

"""

        for violation in violations:
            content += f"""### {violation.severity.value} - {violation.rule_ref}

**Message:** {violation.message}
**Timestamp:** {violation.timestamp}
**Session Scope:** {violation.session_scope}
"""
            if violation.file_path:
                content += f"**File:** `{violation.file_path}`"
                if violation.line_number:
                    content += f" (line {violation.line_number})"
                content += "\n"
            content += "\n---\n\n"

        try:
            with open(violations_file, "w", encoding="utf-8") as file:
                file.write(content)
            logger.info(
                "Violations log generated",
                operation="generate_violations_log",
                violations_count=len(violations),
            )
        except (FileNotFoundError, PermissionError, OSError) as exc:
            logger.error(
                "Failed to generate violations log",
                operation="generate_violations_log",
                error_code="VIOLATIONS_LOG_GENERATION_FAILED",
                root_cause=str(exc),
            )

