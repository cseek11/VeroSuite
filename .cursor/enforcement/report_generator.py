#!/usr/bin/env python3
"""
ENFORCER_REPORT.json generator.
Brain A → Brain B communication bridge.

Last Updated: 2025-12-02
"""

import json
import uuid
from datetime import datetime, timezone
from pathlib import Path
from typing import List, Dict, Any, Optional
from dataclasses import dataclass, asdict


@dataclass
class Violation:
    """Single violation detected by enforcer."""
    
    id: str
    severity: str  # "BLOCKING" or "WARNING"
    file: str
    rule_ref: str
    description: str
    evidence: List[str] = None
    fix_hint: str = None
    session_scope: str = "current_session"  # "current_session" or "historical"
    
    def __post_init__(self):
        if self.evidence is None:
            self.evidence = []
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary for JSON serialization."""
        return {
            "id": self.id,
            "severity": self.severity,
            "file": self.file,
            "rule_ref": self.rule_ref,
            "description": self.description,
            "evidence": self.evidence,
            "fix_hint": self.fix_hint,
            "session_scope": self.session_scope
        }


@dataclass
class AutoFix:
    """Auto-fix applied by enforcer."""
    
    file: str
    applied: bool
    description: str
    before: str = None
    after: str = None
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary for JSON serialization."""
        return {
            "file": self.file,
            "applied": self.applied,
            "description": self.description,
            "before": self.before,
            "after": self.after
        }


class EnforcerReport:
    """Complete enforcer report for LLM consumption."""
    
    def __init__(self, session_id: str = None):
        self.session_id = session_id or str(uuid.uuid4())
        self.generated_at = datetime.now(timezone.utc).isoformat()
        self.violations: List[Violation] = []
        self.auto_fixes: List[AutoFix] = []
        self.next_actions: List[str] = []
        self.context_updates: Dict[str, List[str]] = {
            "load": [],
            "unload": []
        }
        self.memory_bank_updates: Dict[str, Any] = {
            "files_to_update": [],
            "summary": None
        }
        # Two-Brain Model: Context bundle for LLM guidance
        self.context_bundle: Dict[str, Any] = {
            "task_type": None,
            "hints": [],
            "relevant_files": [],
            "patterns_to_follow": []
        }
    
    def add_violation(self, violation: Violation):
        """Add a violation to the report."""
        self.violations.append(violation)
    
    def add_auto_fix(self, auto_fix: AutoFix):
        """Add an auto-fix to the report."""
        self.auto_fixes.append(auto_fix)
    
    def add_next_action(self, action: str):
        """Add a next action for the LLM."""
        self.next_actions.append(action)
    
    def set_context_bundle(self, task_type: str = None, hints: List[str] = None, 
                          relevant_files: List[str] = None, patterns_to_follow: List[str] = None):
        """
        Set context bundle for LLM guidance.
        
        Two-Brain Model: This provides minimal context hints to the LLM
        without requiring it to load heavy rule files.
        
        Args:
            task_type: Type of task (e.g., "add_rls", "add_logging", "fix_date")
            hints: List of guidance hints for the task
            relevant_files: List of example files to reference
            patterns_to_follow: List of patterns to follow
        """
        if task_type:
            self.context_bundle["task_type"] = task_type
        if hints:
            self.context_bundle["hints"] = hints
        if relevant_files:
            self.context_bundle["relevant_files"] = relevant_files
        if patterns_to_follow:
            self.context_bundle["patterns_to_follow"] = patterns_to_follow
    
    def get_status(self) -> str:
        """Determine overall status."""
        if any(v.severity == "BLOCKING" for v in self.violations):
            return "BLOCKING"
        elif any(v.severity == "WARNING" for v in self.violations):
            return "WARNING"
        else:
            return "OK"
    
    def get_summary(self) -> Dict[str, int]:
        """Generate summary statistics."""
        return {
            "blocking_count": sum(1 for v in self.violations if v.severity == "BLOCKING"),
            "warning_count": sum(1 for v in self.violations if v.severity == "WARNING"),
            "auto_fixes_applied": sum(1 for f in self.auto_fixes if f.applied)
        }
    
    def get_status_for_handshake(self) -> str:
        """
        Get status string for handshake file (APPROVED/REJECTED/WARNINGS_ONLY).
        
        Returns:
            "REJECTED" if blocking violations, "WARNINGS_ONLY" if only warnings, "APPROVED" otherwise
        """
        status = self.get_status()
        if status == "BLOCKING":
            return "REJECTED"
        elif status == "WARNING":
            return "WARNINGS_ONLY"
        else:
            return "APPROVED"
    
    def get_blocking_violations(self) -> List[Violation]:
        """Get all blocking violations."""
        return [v for v in self.violations if v.severity == "BLOCKING"]
    
    def get_warning_violations(self) -> List[Violation]:
        """Get all warning violations."""
        return [v for v in self.violations if v.severity == "WARNING"]
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary for JSON serialization."""
        return {
            "status": self.get_status(),
            "session_id": self.session_id,
            "generated_at": self.generated_at,
            "summary": self.get_summary(),
            "violations": [v.to_dict() for v in self.violations],
            "auto_fixes": [f.to_dict() for f in self.auto_fixes],
            "next_actions": self.next_actions,
            "context_updates": self.context_updates,
            "memory_bank_updates": self.memory_bank_updates,
            "context_bundle": self.context_bundle
        }
    
    def to_json(self) -> str:
        """Convert to JSON string."""
        return json.dumps(self.to_dict(), indent=2)
    
    def save(self, path: Path = None):
        """Save report to file."""
        if path is None:
            path = Path(".cursor/enforcement/ENFORCER_REPORT.json")
        
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(self.to_json())
        print(f"✓ Report saved: {path}")
    
    @classmethod
    def load(cls, path: Path = None) -> Optional['EnforcerReport']:
        """Load report from file."""
        if path is None:
            path = Path(".cursor/enforcement/ENFORCER_REPORT.json")
        
        if not path.exists():
            return None
        
        data = json.loads(path.read_text())
        
        report = cls(session_id=data["session_id"])
        report.generated_at = data["generated_at"]
        
        # Reconstruct violations
        for v_data in data.get("violations", []):
            violation = Violation(
                id=v_data["id"],
                severity=v_data["severity"],
                file=v_data["file"],
                rule_ref=v_data["rule_ref"],
                description=v_data["description"],
                evidence=v_data.get("evidence", []),
                fix_hint=v_data.get("fix_hint")
            )
            report.add_violation(violation)
        
        # Reconstruct auto-fixes
        for f_data in data.get("auto_fixes", []):
            auto_fix = AutoFix(
                file=f_data["file"],
                applied=f_data["applied"],
                description=f_data["description"],
                before=f_data.get("before"),
                after=f_data.get("after")
            )
            report.add_auto_fix(auto_fix)
        
        report.next_actions = data.get("next_actions", [])
        report.context_updates = data.get("context_updates", {"load": [], "unload": []})
        report.memory_bank_updates = data.get("memory_bank_updates", {"files_to_update": [], "summary": None})
        report.context_bundle = data.get("context_bundle", {
            "task_type": None,
            "hints": [],
            "relevant_files": [],
            "patterns_to_follow": []
        })
        
        return report


def example_usage():
    """Example of creating a report."""
    
    # Create report
    report = EnforcerReport(session_id="example-session-123")
    
    # Add violations
    report.add_violation(Violation(
        id="VF-RLS-001",
        severity="BLOCKING",
        file="apps/api/src/customers/customers.service.ts",
        rule_ref="03-security.mdc#R02",
        description="Multi-tenant query missing RLS guard",
        evidence=["Line 42: findMany without tenant_id filter"],
        fix_hint="Add where: { tenant_id: currentUser.tenant_id }"
    ))
    
    report.add_violation(Violation(
        id="VF-LOG-001",
        severity="WARNING",
        file="apps/api/src/auth/auth.service.ts",
        rule_ref="07-observability.mdc#R08",
        description="Missing structured logging",
        fix_hint="Add logger.warn({ event: 'AUTH_FAILED', ... })"
    ))
    
    # Add next actions
    report.add_next_action("Fix VF-RLS-001 (BLOCKING)")
    report.add_next_action("Consider VF-LOG-001 (WARNING)")
    
    # Save
    report.save()
    print("\n✅ Example report created")
    print(report.to_json())


if __name__ == "__main__":
    example_usage()


