"""
Unified violation model for all checkers.

Python Bible Chapter 11: Clean Architecture principles.
"""

from dataclasses import dataclass, field
from typing import Optional


@dataclass(slots=True)
class Violation:
    """
    Unified violation structure for all checkers.
    
    All checkers should return violations in this format for consistency.
    """
    severity: str  # "BLOCKING", "WARNING", "TIER_1", "TIER_2", "TIER_3"
    rule_ref: str  # e.g., "SEC-R03-001", "03-security.mdc", "BACKEND-R08-DTO-001"
    message: str  # Human-readable violation message
    file_path: str  # Relative path to project root
    line_number: Optional[int] = None  # Line number where violation occurs
    fix_hint: Optional[str] = None  # Suggestion for fixing the violation
    session_scope: str = "current_session"  # "current_session" or "historical"
    
    def to_dict(self) -> dict:
        """
        Convert violation to dictionary format for JSON serialization.
        
        Returns:
            Dictionary representation of the violation
        """
        return {
            'severity': self.severity,
            'rule_ref': self.rule_ref,
            'message': self.message,
            'file_path': self.file_path,
            'line_number': self.line_number,
            'fix_hint': self.fix_hint,
            'session_scope': self.session_scope,
        }




