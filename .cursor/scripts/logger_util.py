#!/usr/bin/env python3
"""
Structured Logging Utility for VeroScore V3
Provides structured logging with trace ID propagation per Cursor rules.

Last Updated: 2025-11-24
"""

import json
import logging
import sys
import uuid
from datetime import datetime, timezone
from typing import Dict, Optional, Any
from pathlib import Path

# Global trace context (thread-local would be better for multi-threaded, but simple for now)
_trace_context: Dict[str, Optional[str]] = {
    "traceId": None,
    "spanId": None,
    "requestId": None
}


def get_or_create_trace_context() -> Dict[str, Optional[str]]:
    """
    Get or create trace context for distributed tracing.
    Returns dict with traceId, spanId, requestId.
    """
    if not _trace_context["traceId"]:
        _trace_context["traceId"] = str(uuid.uuid4())
    if not _trace_context["spanId"]:
        _trace_context["spanId"] = str(uuid.uuid4())
    if not _trace_context["requestId"]:
        _trace_context["requestId"] = str(uuid.uuid4())
    
    return _trace_context.copy()


def set_trace_context(trace_id: Optional[str] = None, span_id: Optional[str] = None, request_id: Optional[str] = None):
    """Set trace context (for propagation from external sources)."""
    if trace_id:
        _trace_context["traceId"] = trace_id
    if span_id:
        _trace_context["spanId"] = span_id
    if request_id:
        _trace_context["requestId"] = request_id


class StructuredLogger:
    """
    Structured logger that follows Cursor rules (R08):
    - JSON-like format
    - Required fields: level, message, timestamp, traceId, context, operation, severity
    - Optional fields: tenantId, userId, errorCode, rootCause, additionalData
    """
    
    def __init__(self, context: str, level: str = "INFO"):
        self.context = context
        self.logger = logging.getLogger(context)
        self.logger.setLevel(getattr(logging, level.upper(), logging.INFO))
        
        # Set up console handler if not already configured
        if not self.logger.handlers:
            handler = logging.StreamHandler(sys.stdout)
            handler.setFormatter(StructuredFormatter())
            self.logger.addHandler(handler)
    
    def _log(
        self,
        level: str,
        message: str,
        operation: Optional[str] = None,
        error_code: Optional[str] = None,
        root_cause: Optional[str] = None,
        tenant_id: Optional[str] = None,
        user_id: Optional[str] = None,
        **additional_data
    ):
        """Internal logging method with structured format."""
        trace_ctx = get_or_create_trace_context()
        
        log_entry: Dict[str, Any] = {
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "level": level,
            "message": message,
            "context": self.context,
            "operation": operation or "unknown",
            "severity": level.lower(),
            "traceId": trace_ctx.get("traceId"),
            "spanId": trace_ctx.get("spanId"),
            "requestId": trace_ctx.get("requestId"),
        }
        
        # Add optional fields if provided
        if error_code:
            log_entry["errorCode"] = error_code
        if root_cause:
            log_entry["rootCause"] = root_cause
        if tenant_id:
            log_entry["tenantId"] = tenant_id
        if user_id:
            log_entry["userId"] = user_id
        
        # Add any additional data
        if additional_data:
            log_entry.update(additional_data)
        
        # Log as JSON string
        log_message = json.dumps(log_entry)
        
        # Use appropriate logging level
        log_method = getattr(self.logger, level.lower(), self.logger.info)
        log_method(log_message)
    
    def info(self, message: str, operation: Optional[str] = None, **kwargs):
        """Log info message."""
        self._log("INFO", message, operation=operation, **kwargs)
    
    def warn(self, message: str, operation: Optional[str] = None, error_code: Optional[str] = None, **kwargs):
        """Log warning message."""
        self._log("WARN", message, operation=operation, error_code=error_code, **kwargs)
    
    def error(
        self,
        message: str,
        operation: Optional[str] = None,
        error_code: Optional[str] = None,
        root_cause: Optional[str] = None,
        **kwargs
    ):
        """Log error message."""
        self._log("ERROR", message, operation=operation, error_code=error_code, root_cause=root_cause, **kwargs)
    
    def debug(self, message: str, operation: Optional[str] = None, **kwargs):
        """Log debug message."""
        self._log("DEBUG", message, operation=operation, **kwargs)


class StructuredFormatter(logging.Formatter):
    """Formatter that outputs structured JSON logs."""
    
    def format(self, record: logging.LogRecord) -> str:
        # If message is already JSON, return as-is
        if isinstance(record.msg, str) and record.msg.strip().startswith("{"):
            return record.msg
        # Otherwise, create structured entry
        return json.dumps({
            "timestamp": datetime.fromtimestamp(record.created, tz=timezone.utc).isoformat(),
            "level": record.levelname,
            "message": record.getMessage(),
            "context": record.name,
            "severity": record.levelname.lower(),
        })


def get_logger(context: str, level: str = "INFO") -> StructuredLogger:
    """
    Get or create a structured logger for the given context.
    
    Args:
        context: Context identifier (service, module, component name)
        level: Log level (DEBUG, INFO, WARNING, ERROR)
    
    Returns:
        StructuredLogger instance
    """
    return StructuredLogger(context, level)

