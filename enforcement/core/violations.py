from dataclasses import dataclass
from datetime import datetime, timezone
from enum import Enum
from typing import Optional


class ViolationSeverity(Enum):
    """Violation severity levels."""
    BLOCKED = "BLOCKED"  # Hard stop - cannot proceed
    WARNING = "WARNING"  # Warning - should fix but can proceed
    INFO = "INFO"  # Informational - no action required


@dataclass(slots=True)  # Python 3.10+ - reduces memory by 4-5× (Chapter 07.5.3)
class Violation:
    """Represents a rule violation."""
    severity: ViolationSeverity
    rule_ref: str  # e.g., "02-core.mdc", "01-enforcement.mdc Step 0"
    message: str
    file_path: Optional[str] = None
    line_number: Optional[int] = None
    timestamp: str = None
    session_scope: str = "unknown"  # "current_session" or "historical"
    fix_hint: Optional[str] = None  # Suggestion for fixing the violation
    
    def __post_init__(self):
        if self.timestamp is None:
            self.timestamp = datetime.now(timezone.utc).isoformat()


@dataclass(slots=True)  # Python 3.10+ - reduces memory by 4-5× (Chapter 07.5.3)
class AutoFix:
    """Represents an auto-fix action."""
    violation_id: str  # Reference to original violation
    rule_ref: str
    file_path: Optional[str]
    line_number: Optional[int]
    fix_type: str  # e.g., "date_updated", "error_handling_added"
    fix_description: str  # What was fixed
    before_state: str  # State before fix
    after_state: str  # State after fix
    timestamp: str
    session_id: str




