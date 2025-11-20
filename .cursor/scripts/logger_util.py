#!/usr/bin/env python3
"""
Structured logging utility for REWARD_SCORE scripts.

Provides structured logging with trace ID support per `.cursor/rules/observability.md`.
"""

import json
import sys
import uuid
from datetime import datetime
from typing import Dict, Optional


class StructuredLogger:
    """Structured logger with trace ID support."""
    
    def __init__(self, context: str = "reward_score", trace_id: Optional[str] = None):
        """
        Initialize structured logger.
        
        Args:
            context: Context identifier (service, module, component)
            trace_id: Optional trace ID (generated if not provided)
        """
        self.context = context
        self.trace_id = trace_id or self._generate_trace_id()
        self.span_id = self._generate_span_id()
        self.request_id = self._generate_request_id()
    
    def _generate_trace_id(self) -> str:
        """Generate a trace ID."""
        return str(uuid.uuid4())
    
    def _generate_span_id(self) -> str:
        """Generate a span ID."""
        return str(uuid.uuid4())[:16]
    
    def _generate_request_id(self) -> str:
        """Generate a request ID."""
        return str(uuid.uuid4())[:16]
    
    def _log(self, severity: str, message: str, operation: str, error: Optional[Exception] = None, **kwargs) -> None:
        """
        Internal logging method.
        
        Args:
            severity: Log level (info, warn, error, debug)
            message: Human-readable log message
            operation: Operation name (function, endpoint, action)
            error: Optional exception object
            **kwargs: Additional context fields
        """
        log_entry: Dict = {
            "message": message,
            "context": self.context,
            "traceId": self.trace_id,
            "spanId": self.span_id,
            "requestId": self.request_id,
            "operation": operation,
            "severity": severity,
            "timestamp": datetime.utcnow().isoformat() + "Z"
        }
        
        if error:
            log_entry["error"] = {
                "type": type(error).__name__,
                "message": str(error),
                "code": getattr(error, "code", None)
            }
        
        # Add any additional context
        log_entry.update(kwargs)

        # Output as JSON to stderr (structured format)
        # Wrap in try/except to prevent crashes if JSON serialization fails
        try:
            json.dump(log_entry, sys.stderr, indent=None, separators=(',', ':'))    
            sys.stderr.write('\n')
            sys.stderr.flush()
        except (TypeError, ValueError, OSError, BrokenPipeError) as e:
            # If JSON serialization fails or stderr is closed, fallback to simple print
            # This prevents the script from crashing due to logging issues
            try:
                print(f"[{severity.upper()}] {self.context}: {message}", file=sys.stderr, flush=True)
            except Exception:
                # If even print fails, silently ignore (prevents cascading failures)
                pass
    
    def info(self, message: str, operation: str, error: Optional[Exception] = None, **kwargs) -> None:
        """Log info message."""
        self._log("info", message, operation, error=error, **kwargs)
    
    def warn(self, message: str, operation: str, error: Optional[Exception] = None, **kwargs) -> None:
        """Log warning message."""
        self._log("warn", message, operation, error=error, **kwargs)
    
    def error(self, message: str, operation: str, error: Optional[Exception] = None, **kwargs) -> None:
        """Log error message."""
        self._log("error", message, operation, error=error, **kwargs)
    
    def debug(self, message: str, operation: str, error: Optional[Exception] = None, **kwargs) -> None:
        """Log debug message."""
        self._log("debug", message, operation, error=error, **kwargs)


# Global logger instance (can be overridden)
_default_logger: Optional[StructuredLogger] = None


def get_logger(context: str = "reward_score", trace_id: Optional[str] = None) -> StructuredLogger:
    """
    Get or create a structured logger instance.
    
    Args:
        context: Context identifier (service, module, component)
        trace_id: Optional trace ID (generated if not provided)
    
    Returns:
        StructuredLogger instance
    """
    global _default_logger
    if _default_logger is None:
        _default_logger = StructuredLogger(context=context, trace_id=trace_id)
    return _default_logger


def get_or_create_trace_context() -> Dict[str, str]:
    """
    Get or create trace context (traceId, spanId, requestId).
    
    Returns:
        Dictionary with traceId, spanId, requestId
    """
    logger = get_logger()
    return {
        "traceId": logger.trace_id,
        "spanId": logger.span_id,
        "requestId": logger.request_id
    }

