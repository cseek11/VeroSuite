import json
from datetime import datetime, timezone
from pathlib import Path
from typing import Callable, List, Optional, Tuple

from enforcement.core.git_utils import GitUtils
from enforcement.core.violations import Violation, ViolationSeverity

try:
    from logger_util import get_logger

    logger = get_logger(context="context_checker")
except ImportError:  # pragma: no cover
    import logging

    logging.basicConfig(level=logging.INFO)

    class _FallbackLogger:
        def __init__(self):
            self._logger = logging.getLogger("context_checker")

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


class ContextChecker:
    """Handles context-related compliance checks."""

    def __init__(self, git_utils: GitUtils, predictive_context_available: Optional[bool]):
        self.git_utils = git_utils
        self.predictive_context_available = predictive_context_available

    def check_active_context(
        self,
        project_root: Path,
        memory_bank_dir: Path,
    ) -> List[Violation]:
        violations: List[Violation] = []
        active_context_file = memory_bank_dir / "activeContext.md"

        if not active_context_file.exists():
            violations.append(
                Violation(
                    severity=ViolationSeverity.BLOCKED,
                    rule_ref="01-enforcement.mdc Step 5",
                    message="activeContext.md does not exist",
                    file_path=str(active_context_file),
                    session_scope="current_session",
                )
            )
            return violations

        file_mtime = datetime.fromtimestamp(active_context_file.stat().st_mtime, tz=timezone.utc)
        now = datetime.now(timezone.utc)
        time_diff = (now - file_mtime).total_seconds()

        changed_files = self.git_utils.get_changed_files()
        if changed_files and time_diff > 3600:
            violations.append(
                Violation(
                    severity=ViolationSeverity.WARNING,
                    rule_ref="01-enforcement.mdc Step 5",
                    message=f"activeContext.md not updated recently (last modified: {file_mtime.isoformat()})",
                    file_path=str(active_context_file),
                    session_scope="current_session",
                )
            )

        return violations

    def check_context_management_compliance(
        self,
        context_manager_dir: Path,
        agent_response: Optional[str],
        preloader,
        context_loader,
        response_parser,
        verify_context_id_match_func: Optional[Callable[[], Tuple[bool, Optional[str]]]],
    ) -> List[Violation]:
        violations: List[Violation] = []

        if not self.predictive_context_available:
            logger.debug(
                "Skipping context management compliance - predictive context unavailable",
                operation="check_context_management_compliance",
            )
            return violations

        if not preloader or not context_loader:
            logger.debug(
                "Skipping context management compliance - dependencies missing",
                operation="check_context_management_compliance",
            )
            return violations

        if not agent_response:
            logger.debug(
                "Skipping context management compliance - no agent response",
                operation="check_context_management_compliance",
            )
            return violations

        if response_parser and verify_context_id_match_func:
            try:
                parsed = response_parser.parse(agent_response)
                agent_context_id = parsed.get("context_id")
                context_id_match, latest_context_id = verify_context_id_match_func()
                if agent_context_id and latest_context_id and agent_context_id != latest_context_id:
                    logger.debug(
                        "Skipping context management compliance - stale agent response context-id",
                        operation="check_context_management_compliance",
                        agent_context_id=agent_context_id,
                        latest_context_id=latest_context_id,
                    )
                    return violations
            except Exception as exc:  # pragma: no cover - defensive
                logger.debug(
                    "Could not parse agent response for context-id check",
                    operation="check_context_management_compliance",
                    error=str(exc),
                )

        violations.extend(self._validate_context_state(context_manager_dir))
        return violations

    def _validate_context_state(self, context_manager_dir: Path) -> List[Violation]:
        violations: List[Violation] = []
        context_state_file = context_manager_dir / "context_state.json"

        if not context_state_file.exists():
            return violations

        try:
            with open(context_state_file, 'r', encoding='utf-8') as f:
                data = json.load(f)
        except (json.JSONDecodeError, OSError) as exc:
            violations.append(
                Violation(
                    severity=ViolationSeverity.BLOCKED,
                    rule_ref="01-enforcement.mdc",
                    message=f"Context state file is corrupted: {exc}. Must fix before proceeding.",
                    file_path=str(context_state_file),
                    session_scope="current_session",
                )
            )
            return violations

        if not isinstance(data, dict):
            violations.append(
                Violation(
                    severity=ViolationSeverity.BLOCKED,
                    rule_ref="01-enforcement.mdc",
                    message="Context state file is invalid (not a dictionary). Must fix before proceeding.",
                    file_path=str(context_state_file),
                    session_scope="current_session",
                )
            )
            return violations

        if 'active' not in data or 'preloaded' not in data:
            violations.append(
                Violation(
                    severity=ViolationSeverity.BLOCKED,
                    rule_ref="01-enforcement.mdc",
                    message="Context state file is invalid (missing required keys). Must fix before proceeding.",
                    file_path=str(context_state_file),
                    session_scope="current_session",
                )
            )

        return violations

