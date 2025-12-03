"""
Error Event Bus - Centralized Diagnostics

Provides centralized error handling, diagnostics, and validation hooks.
"""
from __future__ import annotations

import sys
import importlib.util
from pathlib import Path
from dataclasses import dataclass, field
from typing import List, Optional, Dict, Any

# Import structured logger
_project_root = Path(__file__).parent.parent.parent.parent.parent.parent
if str(_project_root) not in sys.path:
    sys.path.insert(0, str(_project_root))

logger_util_path = _project_root / ".cursor" / "scripts" / "logger_util.py"
if logger_util_path.exists():
    spec = importlib.util.spec_from_file_location("logger_util", logger_util_path)
    logger_util = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(logger_util)
    get_logger = logger_util.get_logger
    logger = get_logger("error_bus")
else:
    logger = None


@dataclass
class ErrorEvent:
    """Error event with full diagnostic information."""
    type: str                    # "error", "warning", "info"
    code: str                    # e.g., ERR_DUPLICATE_CHAPTER_NUMBER
    message: str
    line: int
    column: int
    context: str = ""
    severity: str = "error"      # error | warning | info
    suggestion: Optional[str] = None
    meta: Dict[str, Any] = field(default_factory=dict)


class ErrorBus:
    """Central error logging / diagnostic event dispatcher."""

    def __init__(self):
        self.events: List[ErrorEvent] = []

    def emit(self, **kwargs):
        """Emit an error event."""
        evt = ErrorEvent(**kwargs)
        self.events.append(evt)
        # Log to structured logger
        if logger:
            if kwargs.get("severity") == "error":
                logger.error(
                    evt.message,
                    operation="error_bus_emit",
                    error_code=evt.code,
                    root_cause=evt.message,
                    line=evt.line,
                    column=evt.column,
                    context=evt.context,
                    severity=evt.severity,
                    suggestion=evt.suggestion,
                    meta=evt.meta
                )
            elif kwargs.get("severity") == "warning":
                logger.warn(
                    evt.message,
                    operation="error_bus_emit",
                    error_code=evt.code,
                    root_cause=evt.message,
                    line=evt.line,
                    column=evt.column,
                    context=evt.context,
                    severity=evt.severity,
                    suggestion=evt.suggestion,
                    meta=evt.meta
                )
            else:
                logger.info(
                    evt.message,
                    operation="error_bus_emit",
                    error_code=evt.code,
                    line=evt.line,
                    column=evt.column,
                    context=evt.context,
                    severity=evt.severity,
                    suggestion=evt.suggestion,
                    meta=evt.meta
                )

    def error(self, code: str, message: str, line: int, column: int = 1, **kwargs):
        """Convenience method for errors."""
        self.emit(
            type="error",
            code=code,
            message=message,
            line=line,
            column=column,
            severity="error",
            **kwargs
        )

    def warning(self, code: str, message: str, line: int, column: int = 1, **kwargs):
        """Convenience method for warnings."""
        self.emit(
            type="warning",
            code=code,
            message=message,
            line=line,
            column=column,
            severity="warning",
            **kwargs
        )

    def info(self, code: str, message: str, line: int, column: int = 1, **kwargs):
        """Convenience method for info messages."""
        self.emit(
            type="info",
            code=code,
            message=message,
            line=line,
            column=column,
            severity="info",
            **kwargs
        )

    def errors(self) -> List[ErrorEvent]:
        """Get all error-level events."""
        return [e for e in self.events if e.severity == "error"]

    def warnings(self) -> List[ErrorEvent]:
        """Get all warning-level events."""
        return [e for e in self.events if e.severity == "warning"]

    def has_errors(self) -> bool:
        """Check if any errors were emitted."""
        return len(self.errors()) > 0

    def to_dict(self) -> List[Dict[str, Any]]:
        """Convert events to dictionary for JSON serialization."""
        return [e.__dict__ for e in self.events]

    def reset(self):
        """Clear all events (useful for testing)."""
        self.events = []

    def summary(self) -> Dict[str, int]:
        """Get summary of event counts."""
        return {
            "total": len(self.events),
            "errors": len(self.errors()),
            "warnings": len(self.warnings()),
            "info": len([e for e in self.events if e.severity == "info"])
        }

