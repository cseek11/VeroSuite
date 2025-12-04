import sys
from pathlib import Path
from typing import Any, Dict, List, Optional

from enforcement.core.session_state import EnforcementSession
from enforcement.core.violations import Violation

try:
    from logger_util import get_logger

    logger = get_logger(context="two_brain_reporter")
except ImportError:  # pragma: no cover
    import logging

    logging.basicConfig(level=logging.INFO)

    class _FallbackLogger:
        def __init__(self):
            self._logger = logging.getLogger("two_brain_reporter")

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


class TwoBrainReporter:
    """Generates ENFORCER_REPORT.json via the Two-Brain integration layer."""

    def generate_report(
        self,
        violations: List[Violation],
        session: EnforcementSession,
        enforcement_dir: Path,
        project_root: Path,
        context_bundle: Dict[str, Any],
    ) -> Optional[Any]:
        try:
            enforcement_path = project_root / ".cursor" / "enforcement"
            if str(enforcement_path.parent) not in sys.path:
                sys.path.insert(0, str(enforcement_path.parent))
            from enforcement.two_brain_integration import integrate_with_enforcer

            enforcer_proxy = _EnforcerProxy(violations, session)
            report = integrate_with_enforcer(enforcer_proxy)
            self._add_context_hints_to_report(report, context_bundle or {})
            report.save()

            logger.info(
                "Two-Brain report generated",
                operation="generate_two_brain_report",
                violations_count=len(report.violations),
                status=report.get_status(),
            )

            return report
        except ImportError:
            logger.warn(
                "Two-Brain integration not available, skipping report generation",
                operation="generate_two_brain_report",
                error_code="INTEGRATION_NOT_AVAILABLE",
            )
            return None
        except Exception as exc:
            logger.error(
                f"Failed to generate Two-Brain report: {exc}",
                operation="generate_two_brain_report",
                error_code="REPORT_GENERATION_FAILED",
                root_cause=str(exc),
            )
            return None

    def _add_context_hints_to_report(self, report, context_bundle: Dict[str, Any]) -> None:
        report.set_context_bundle(
            task_type=context_bundle.get("task_type"),
            hints=context_bundle.get("hints", []),
            relevant_files=context_bundle.get("relevant_files", []),
            patterns_to_follow=context_bundle.get("patterns_to_follow", []),
        )


class _EnforcerProxy:
    """Lightweight proxy exposing the attributes required by the integration layer."""

    def __init__(self, violations: List[Violation], session: EnforcementSession):
        self.violations = violations
        self.session = session

