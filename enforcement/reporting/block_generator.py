from datetime import datetime, timezone
from pathlib import Path
from typing import List

from enforcement.config_paths import get_cursor_enforcer_root
from enforcement.core.session_state import EnforcementSession
from enforcement.core.violations import Violation, ViolationSeverity

try:
    from logger_util import get_logger

    logger = get_logger(context="block_generator")
except ImportError:  # pragma: no cover
    import logging

    logging.basicConfig(level=logging.INFO)

    class _FallbackLogger:
        def __init__(self):
            self._logger = logging.getLogger("block_generator")

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


class BlockGenerator:
    """Generates reminders and enforcement block files."""

    def generate_agent_reminders(
        self,
        violations: List[Violation],
        session: EnforcementSession,
        enforcement_dir: Path,
    ) -> None:
        reminders_file = enforcement_dir / "AGENT_REMINDERS.md"
        blocked_violations = [v for v in violations if v.severity == ViolationSeverity.BLOCKED]
        warning_violations = [v for v in violations if v.severity == ViolationSeverity.WARNING]

        content = f"""# Agent Reminders

**Last Updated:** {datetime.now(timezone.utc).isoformat()}

## Active Reminders

"""

        if blocked_violations:
            content += "### 🔴 CRITICAL - Must Fix Before Proceeding\n\n"
            for violation in blocked_violations:
                content += f"**{violation.rule_ref}**: {violation.message}\n\n"

        if warning_violations:
            content += "### 🟡 Warnings - Should Fix\n\n"
            for violation in warning_violations[:5]:
                content += f"**{violation.rule_ref}**: {violation.message}\n\n"

        if not blocked_violations and not warning_violations:
            content += "✅ No active reminders. All checks passed.\n"

        try:
            with open(reminders_file, "w", encoding="utf-8") as file:
                file.write(content)
            logger.info(
                "Agent reminders generated",
                operation="generate_agent_reminders",
                reminders_count=len(blocked_violations) + len(warning_violations),
            )
        except (FileNotFoundError, PermissionError, OSError) as exc:
            logger.error(
                "Failed to generate agent reminders",
                operation="generate_agent_reminders",
                error_code="REMINDERS_GENERATION_FAILED",
                root_cause=str(exc),
            )

    def generate_enforcement_block_message(
        self,
        violations: List[Violation],
        session: EnforcementSession,
        enforcement_dir: Path,
    ) -> None:
        block_file = enforcement_dir / "ENFORCEMENT_BLOCK.md"

        blocked_violations = [v for v in violations if v.severity == ViolationSeverity.BLOCKED]
        current_session_blocked = [v for v in blocked_violations if v.session_scope == "current_session"]
        historical_blocked = [v for v in blocked_violations if v.session_scope != "current_session"]

        if not blocked_violations:
            if block_file.exists():
                try:
                    block_file.unlink()
                    logger.debug(
                        "Enforcement block file removed (no violations)",
                        operation="generate_enforcement_block_message",
                    )
                except OSError:
                    pass
            return

        content = f"""# 🚨 ENFORCEMENT BLOCK - DO NOT PROCEED 🚨

**Status:** 🔴 BLOCKED  
**Generated:** {datetime.now(timezone.utc).isoformat()}  
**Session ID:** {session.session_id if session else 'unknown'}

---

## ⚠️ CRITICAL: YOU MUST STOP IMMEDIATELY

**The enforcement system has detected violations that BLOCK task execution.**

**YOU MUST:**
1. **STOP all current work immediately**
2. **Read this entire message**
3. **Fix violations before proceeding**
4. **DO NOT continue with any task until violations are resolved**

---

## Blocking Violations Summary

- **Total Blocked Violations:** {len(blocked_violations)}
  - 🔧 **Current Session (Auto-Fixable):** {len(current_session_blocked)}
  - 📋 **Historical (Require Human Input):** {len(historical_blocked)}

---

"""

        if current_session_blocked:
            content += f"""## 🔧 Current Session Violations ({len(current_session_blocked)} - Auto-Fixable)

**These violations were introduced in the current session. You MUST auto-fix these immediately.**

**Instructions:**
1. Review each violation below
2. Auto-fix the violations (update dates, add error handling, etc.)
3. Re-run enforcement to verify fixes: `python .cursor/scripts/auto-enforcer.py`
4. Only proceed after all current session violations are resolved

**Violations to Fix:**

"""
            for idx, violation in enumerate(current_session_blocked, 1):
                content += f"""### Violation #{idx}: {violation.rule_ref}

**Message:** {violation.message}
"""
                if violation.file_path:
                    content += f"**File:** `{violation.file_path}`"
                    if violation.line_number:
                        content += f" (line {violation.line_number})"
                    content += "\n"
                content += "\n"
            content += "\n---\n\n"

        if historical_blocked:
            content += f"""## 📋 Historical Violations ({len(historical_blocked)} - Require Human Input)

**These violations exist in historical code (not from current session). You MUST list these and request human guidance before proceeding.**

**Instructions:**
1. List ALL historical violations clearly in your response
2. Request human input/guidance on how to proceed
3. DO NOT attempt to auto-fix historical violations without explicit permission
4. DO NOT proceed with new tasks until human guidance is provided

**Historical Violations (First 20 shown):**

"""
            for idx, violation in enumerate(historical_blocked[:20], 1):
                content += f"""### Violation #{idx}: {violation.rule_ref}

**Message:** {violation.message}
"""
                if violation.file_path:
                    content += f"**File:** `{violation.file_path}`"
                    if violation.line_number:
                        content += f" (line {violation.line_number})"
                    content += "\n"
                content += "\n"
            if len(historical_blocked) > 20:
                content += f"\n*... and {len(historical_blocked) - 20} more historical violations. See `.cursor/enforcement/VIOLATIONS.md` for complete list.*\n"
            content += "\n**Action Required:** List these blockers and request human input/guidance before proceeding.\n\n---\n\n"

        content += f"""## Next Steps

### If You Have Current Session Violations (🔧):

1. **Auto-fix violations:**
   - Update hardcoded dates to current system date
   - Add missing error handling
   - Update "Last Updated" fields
   - Fix any other violations listed above

2. **Re-run enforcement:**
   ```bash
   python .cursor/scripts/auto-enforcer.py
   ```

3. **Verify fixes:**
   - Check that AGENT_STATUS.md shows COMPLIANT
   - Verify ENFORCEMENT_BLOCK.md is removed (no violations)

4. **Only then proceed** with your task

### If You Have Historical Violations (📋):

1. **List all violations** in your response
2. **Request human guidance** on how to proceed
3. **DO NOT proceed** until human provides guidance
4. **DO NOT auto-fix** historical violations without permission

---

## Full Details

For complete violation details, see:
- **AGENT_STATUS.md** - Full status report
- **VIOLATIONS.md** - Complete violations log
- **AGENT_REMINDERS.md** - Active reminders

---

## This File Will Be Removed When Compliant

**Once all violations are resolved:**
- Re-run enforcement: `python .cursor/scripts/auto-enforcer.py`
- This file will be automatically removed
- You can then proceed with your task

---

**Last Updated:** {datetime.now(timezone.utc).isoformat()}  
**Generated By:** VeroField Auto-Enforcement System
"""

        try:
            with open(block_file, "w", encoding="utf-8") as file:
                file.write(content)
            logger.info(
                "Enforcement block message generated",
                operation="generate_enforcement_block_message",
                blocked_violations=len(blocked_violations),
                current_session=len(current_session_blocked),
                historical=len(historical_blocked),
            )
        except (FileNotFoundError, PermissionError, OSError) as exc:
            logger.error(
                "Failed to generate enforcement block message",
                operation="generate_enforcement_block_message",
                error_code="BLOCK_MESSAGE_GENERATION_FAILED",
                root_cause=str(exc),
            )




