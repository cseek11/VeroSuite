from datetime import datetime, timezone
from pathlib import Path
from typing import List

from enforcement.config_paths import (
    get_enforcer_log_root,
    get_cursor_enforcer_root,
    get_project_root,
)
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
        # Summary file in .cursor/enforcement/ (last 50 violations)
        violations_file = enforcement_dir / "VIOLATIONS.md"
        
        # Full log file in .ai/logs/enforcer/
        project_root = get_project_root()
        full_violations_file = get_enforcer_log_root(project_root) / "VIOLATIONS_FULL.md"
        
        # Generate full content
        full_content = f"""# Violations Log (Full)

**Last Updated:** {datetime.now(timezone.utc).isoformat()}
**Session ID:** {session.session_id if session else 'unknown'}
**Total Violations:** {len(violations)}

## All Violations

"""

        for violation in violations:
            full_content += f"""### {violation.severity.value} - {violation.rule_ref}

**Message:** {violation.message}
**Timestamp:** {violation.timestamp}
**Session Scope:** {violation.session_scope}
"""
            if violation.file_path:
                full_content += f"**File:** `{violation.file_path}`"
                if violation.line_number:
                    full_content += f" (line {violation.line_number})"
                full_content += "\n"
            full_content += "\n---\n\n"

        # Generate summary content (last 50 violations)
        summary_content = f"""# Violations Log (Summary)

**Last Updated:** {datetime.now(timezone.utc).isoformat()}
**Session ID:** {session.session_id if session else 'unknown'}
**Total Violations:** {len(violations)}

> **Note:** This is a summary showing the last 50 violations.  
> See `.ai/logs/enforcer/VIOLATIONS_FULL.md` for the complete violations log.

## Recent Violations (Last 50)

"""

        # Show last 50 violations in summary
        recent_violations = violations[-50:] if len(violations) > 50 else violations
        
        if len(violations) > 50:
            summary_content += f"*Showing last 50 of {len(violations)} total violations.*\n\n"

        for violation in recent_violations:
            summary_content += f"""### {violation.severity.value} - {violation.rule_ref}

**Message:** {violation.message}
**Timestamp:** {violation.timestamp}
**Session Scope:** {violation.session_scope}
"""
            if violation.file_path:
                summary_content += f"**File:** `{violation.file_path}`"
                if violation.line_number:
                    summary_content += f" (line {violation.line_number})"
                summary_content += "\n"
            summary_content += "\n---\n\n"

        try:
            # Write full log to .ai/logs/enforcer/
            full_violations_file.parent.mkdir(parents=True, exist_ok=True)
            with open(full_violations_file, "w", encoding="utf-8") as file:
                file.write(full_content)
            
            # Write summary to .cursor/enforcement/
            with open(violations_file, "w", encoding="utf-8") as file:
                file.write(summary_content)
            
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




