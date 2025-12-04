from collections import defaultdict
from datetime import datetime, timezone
from pathlib import Path
from typing import Callable, List

from enforcement.core.session_state import EnforcementSession
from enforcement.core.violations import Violation, ViolationSeverity

try:
    from logger_util import get_logger

    logger = get_logger(context="status_generator")
except ImportError:  # pragma: no cover
    import logging

    logging.basicConfig(level=logging.INFO)

    class _FallbackLogger:
        def __init__(self):
            self._logger = logging.getLogger("status_generator")

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


class StatusGenerator:
    """Generates enforcement status and auto-fix summary files."""

    def generate_agent_status(
        self,
        violations: List[Violation],
        session: EnforcementSession,
        enforcement_dir: Path,
        re_evaluate_violation_scope_func: Callable[[Violation], str],
        save_session_func: Callable[[EnforcementSession, Path], None],
    ) -> None:
        status_file = enforcement_dir / "AGENT_STATUS.md"

        session_violations = getattr(session, "violations", []) if session else []
        for violation in violations:
            new_scope = re_evaluate_violation_scope_func(violation)
            if new_scope != violation.session_scope:
                logger.info(
                    "Updating violation scope",
                    operation="generate_agent_status",
                    file_path=violation.file_path,
                    line_number=violation.line_number,
                    original_scope=violation.session_scope,
                    new_scope=new_scope,
                )
                violation.session_scope = new_scope
                for v_dict in session_violations:
                    if (
                        v_dict.get("file_path") == violation.file_path
                        and v_dict.get("line_number") == violation.line_number
                        and v_dict.get("rule_ref") == violation.rule_ref
                    ):
                        v_dict["session_scope"] = new_scope

        blocked_violations = [v for v in violations if v.severity == ViolationSeverity.BLOCKED]
        warning_violations = [v for v in violations if v.severity == ViolationSeverity.WARNING]
        current_session_blocked = [v for v in blocked_violations if v.session_scope == "current_session"]
        historical_blocked = [v for v in blocked_violations if v.session_scope != "current_session"]

        if blocked_violations:
            status_emoji = "🔴"
            status_text = "BLOCKED"
        elif warning_violations:
            status_emoji = "🟡"
            status_text = "WARNING"
        else:
            status_emoji = "🟢"
            status_text = "COMPLIANT"

        content = f"""# Agent Status

**Status:** {status_emoji} {status_text}
**Last Updated:** {datetime.now(timezone.utc).isoformat()}
**Session ID:** {session.session_id if session else 'unknown'}

## Summary

- **Total Blocked Violations:** {len(blocked_violations)}
  - 🔧 **Current Session (Auto-Fixable):** {len(current_session_blocked)}
  - 📋 **Historical (Require Human Input):** {len(historical_blocked)}
- **Warnings:** {len(warning_violations)}
- **Total Violations:** {len(violations)}

"""

        if blocked_violations:
            content += "## ⚠️ BLOCKING INSTRUCTIONS\n\n"
            content += "**🚨 YOU MUST STOP AND ADDRESS THESE VIOLATIONS BEFORE PROCEEDING WITH ANY TASK. 🚨**\n\n"

            if current_session_blocked:
                content += (
                    f"### 🔧 Current Session Violations ({len(current_session_blocked)} - Auto-Fixable)\n\n"
                )
                content += "**These violations were introduced in the current session. You MUST auto-fix these immediately before proceeding.**\n\n"
                content += "**Instructions:**\n"
                content += "1. Review each violation below\n"
                content += "2. Auto-fix the violations (update dates, add error handling, etc.)\n"
                content += "3. Re-run enforcement to verify fixes\n"
                content += "4. Only proceed after all current session violations are resolved\n\n"
                content += "**Violations to Fix:**\n\n"
                for violation in current_session_blocked:
                    content += f"- **{violation.rule_ref}**: {violation.message}"
                    if violation.file_path:
                        content += f" (`{violation.file_path}`"
                        if violation.line_number:
                            content += f":{violation.line_number}"
                        content += ")"
                    content += "\n"
                content += "\n---\n\n"

            if historical_blocked:
                content += (
                    f"### 📋 Historical Violations ({len(historical_blocked)} - Require Human Input)\n\n"
                )
                content += "**These violations exist in historical code (not from current session). You MUST list these and request human guidance before proceeding.**\n\n"
                content += "**Instructions:**\n"
                content += "1. List ALL historical violations clearly in your response\n"
                content += "2. Request human input/guidance on how to proceed\n"
                content += "3. DO NOT attempt to auto-fix historical violations without explicit permission\n"
                content += "4. DO NOT proceed with new tasks until human guidance is provided\n\n"
                content += "**Historical Violations (First 20 shown, see `.cursor/enforcement/VIOLATIONS.md` for complete list):**\n\n"
                for violation in historical_blocked[:20]:
                    content += f"- **{violation.rule_ref}**: {violation.message}"
                    if violation.file_path:
                        content += f" (`{violation.file_path}`"
                        if violation.line_number:
                            content += f":{violation.line_number}"
                        content += ")"
                    content += "\n"
                if len(historical_blocked) > 20:
                    content += f"\n*... and {len(historical_blocked) - 20} more historical violations. See `.cursor/enforcement/VIOLATIONS.md` for complete list.*\n"
                content += "\n**Action Required:** List these blockers and request human input/guidance before proceeding.\n\n---\n\n"

        content += "## Active Violations\n\n"

        if blocked_violations:
            content += f"### 🔴 BLOCKED - Hard Stops ({len(blocked_violations)} total)\n\n"
            content += "**Legend:** 🔧 = Current Session (Auto-Fixable) | 📋 = Historical (Require Human Input)\n\n"
            for violation in blocked_violations:
                scope_indicator = "🔧" if violation.session_scope == "current_session" else "📋"
                scope_text = "Current Session" if violation.session_scope == "current_session" else "Historical"
                content += f"- {scope_indicator} **{violation.rule_ref}**: {violation.message}"
                if violation.file_path:
                    content += f" (`{violation.file_path}`"
                    if violation.line_number:
                        content += f":{violation.line_number}"
                    content += ")"
                content += f" [Scope: {scope_text}]\n"
            content += "\n"

        if warning_violations:
            current_session_warnings = [v for v in warning_violations if v.session_scope == "current_session"]
            historical_warnings = [v for v in warning_violations if v.session_scope != "current_session"]

            content += "### 🟡 WARNINGS\n\n"
            content += "**Legend:** 🔧 = Current Session | 📋 = Historical\n\n"

            if current_session_warnings:
                content += f"#### 🔧 Current Session ({len(current_session_warnings)} total)\n\n"
                display_count = min(50, len(current_session_warnings))
                for violation in current_session_warnings[:display_count]:
                    content += f"- **{violation.rule_ref}**: {violation.message}"
                    if violation.file_path:
                        content += f" (`{violation.file_path}`"
                        if violation.line_number:
                            content += f":{violation.line_number}"
                        content += ")"
                    content += "\n"
                if len(current_session_warnings) > 50:
                    content += f"\n*... and {len(current_session_warnings) - 50} more current session warnings. See `.cursor/enforcement/VIOLATIONS.md` for complete list.*\n"
                content += "\n"

            if historical_warnings:
                content += f"#### 📋 Historical ({len(historical_warnings)} total)\n\n"
                content += "**Summary by Rule:**\n\n"
                rule_counts = defaultdict(int)
                for violation in historical_warnings:
                    rule_counts[violation.rule_ref] += 1
                sorted_rules = sorted(rule_counts.items(), key=lambda x: x[1], reverse=True)
                for rule_ref, count in sorted_rules[:20]:
                    content += f"- **{rule_ref}**: {count} warning(s)\n"
                if len(sorted_rules) > 20:
                    remaining_count = sum(count for _, count in sorted_rules[20:])
                    content += f"- **Other rules**: {remaining_count} warning(s)\n"
                content += "\n*See `.cursor/enforcement/VIOLATIONS.md` for complete historical violations list.*\n\n"

        if getattr(session, "auto_fixes", None):
            content += "## Auto-Fixes Applied\n\n"
            content += f"**Total Fixes:** {len(session.auto_fixes)}\n\n"
            content += "The following violations were auto-fixed during this session:\n\n"
            for fix in session.auto_fixes:
                content += f"- **{fix['rule_ref']}**: {fix['fix_description']}"
                if fix["file_path"]:
                    content += f" (`{fix['file_path']}`"
                    if fix["line_number"]:
                        content += f":{fix['line_number']}"
                    content += ")"
                content += "\n"
            content += "\n**See `.cursor/enforcement/AUTO_FIXES.md` for detailed fix information.**\n\n---\n\n"

        unique_passed = list(dict.fromkeys(getattr(session, "checks_passed", [])))
        unique_failed = list(dict.fromkeys(getattr(session, "checks_failed", [])))

        def normalize(check: str) -> str:
            return check.split(" (skipped -")[0] if " (skipped -" in check else check

        normalized_passed = {normalize(check): check for check in unique_passed}
        checks_failed_filtered = [
            check for check in unique_failed if normalize(check) not in normalized_passed
        ]

        content += "## Compliance Checks\n\n"
        for check in unique_passed:
            content += f"- [x] {check}\n"
        for check in checks_failed_filtered:
            content += f"- [ ] {check}\n"

        content += f"""
## Session Information

- **Session Start:** {session.start_time if session else 'unknown'}
- **Last Check:** {session.last_check if session else 'unknown'}
- **Total Violations:** {len(violations)}
- **Blocked:** {len(blocked_violations)} total
  - 🔧 Current Session: {len(current_session_blocked)} (auto-fixable)
  - 📋 Historical: {len(historical_blocked)} (require human input)
- **Warnings:** {len(warning_violations)}
"""

        try:
            with open(status_file, "w", encoding="utf-8") as file:
                file.write(content)
            logger.info(
                "Agent status file generated",
                operation="generate_agent_status",
                status=status_text,
                violations_count=len(violations),
            )
            save_session_func(session, enforcement_dir)
        except (FileNotFoundError, PermissionError, OSError) as exc:
            logger.error(
                "Failed to generate agent status file",
                operation="generate_agent_status",
                error_code="STATUS_FILE_GENERATION_FAILED",
                root_cause=str(exc),
            )

    def generate_auto_fixes_summary(
        self,
        session: EnforcementSession,
        enforcement_dir: Path,
    ) -> None:
        fixes_file = enforcement_dir / "AUTO_FIXES.md"
        auto_fixes = getattr(session, "auto_fixes", [])

        if not auto_fixes:
            content = f"""# Auto-Fixes Summary

**Last Updated:** {datetime.now(timezone.utc).isoformat()}
**Session ID:** {session.session_id if session else 'unknown'}

## No Auto-Fixes in This Session

No violations were auto-fixed during this session.
"""
        else:
            content = f"""# Auto-Fixes Summary

**Last Updated:** {datetime.now(timezone.utc).isoformat()}
**Session ID:** {session.session_id if session else 'unknown'}
**Total Fixes:** {len(auto_fixes)}

## Auto-Fixes Applied

"""
            for idx, fix in enumerate(auto_fixes, 1):
                content += f"""### Fix #{idx}

**Rule:** {fix['rule_ref']}
**File:** `{fix['file_path']}` (line {fix['line_number']})
**Fix Type:** {fix['fix_type']}
**Description:** {fix['fix_description']}
**Timestamp:** {fix['timestamp']}

**Before:**
```

{fix['before_state']}

```

**After:**
```

{fix['after_state']}

```

---

"""

        try:
            with open(fixes_file, "w", encoding="utf-8") as file:
                file.write(content)
            logger.info("Generated AUTO_FIXES.md", operation="generate_auto_fixes_summary")
        except (FileNotFoundError, PermissionError, OSError) as exc:
            logger.error(
                "Failed to save auto-fixes summary",
                operation="generate_auto_fixes_summary",
                error_code="AUTO_FIXES_SAVE_FAILED",
                root_cause=str(exc),
            )

