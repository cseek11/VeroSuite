#!/usr/bin/env python3
"""
Structured Logging Utility for VeroScore V3
Provides structured logging with trace ID propagation per Cursor rules.

Last Updated: 2025-12-05
"""

import json
import logging
import sys
import uuid
from datetime import datetime, timezone
from typing import Dict, Optional, Any
from pathlib import Path
import threading

# Thread-local trace context for thread safety (Chapter 17 - Concurrency)
_trace_context_local = threading.local()


def _get_trace_context() -> Dict[str, Optional[str]]:
    """Get thread-local trace context, creating if needed."""
    if not hasattr(_trace_context_local, 'context'):
        _trace_context_local.context = {
            "traceId": None,
            "spanId": None,
            "requestId": None
        }
    return _trace_context_local.context


def get_or_create_trace_context() -> Dict[str, Optional[str]]:
    """
    Get or create trace context for distributed tracing.
    Returns dict with traceId, spanId, requestId.
    Thread-safe using threading.local() (Chapter 17 - Concurrency).
    """
    context = _get_trace_context()
    if not context["traceId"]:
        context["traceId"] = str(uuid.uuid4())
    if not context["spanId"]:
        context["spanId"] = str(uuid.uuid4())
    if not context["requestId"]:
        context["requestId"] = str(uuid.uuid4())
    
    return context.copy()


def set_trace_context(trace_id: Optional[str] = None, span_id: Optional[str] = None, request_id: Optional[str] = None):
    """Set trace context (for propagation from external sources). Thread-safe."""
    context = _get_trace_context()
    if trace_id:
        context["traceId"] = trace_id
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
    
    def progress(
        self,
        message: str,
        operation: Optional[str] = None,
        stage: Optional[str] = None,
        current: Optional[int] = None,
        total: Optional[int] = None,
        **kwargs
    ):
        """
        Log progress message (for print("[PROGRESS]...") patterns).
        
        Args:
            message: Progress message
            operation: Operation name
            stage: Current stage/phase
            current: Current progress count
            total: Total count (for percentage calculation)
            **kwargs: Additional context data
        """
        progress_data = {}
        if stage:
            progress_data["stage"] = stage
        if current is not None and total is not None:
            progress_data["current"] = current
            progress_data["total"] = total
            progress_data["percentage"] = (current / total * 100) if total > 0 else 0
        
        self._log("INFO", message, operation=operation, **{**progress_data, **kwargs})
    
    def error_with_categorization(
        self,
        message: str,
        operation: Optional[str] = None,
        error_code: Optional[str] = None,
        root_cause: Optional[str] = None,
        error_type: Optional[str] = None,
        exc_info: bool = False,
        **kwargs
    ):
        """
        Log error with proper categorization (validation, business rule, or system error).
        
        Args:
            message: Error message
            operation: Operation name
            error_code: Error code (e.g., "VALIDATION_ERROR", "BUSINESS_RULE_ERROR", "SYSTEM_ERROR")
            root_cause: Root cause description
            error_type: Error type category ("validation", "business_rule", "system")
            exc_info: Whether to include exception info (for unexpected errors)
            **kwargs: Additional context data
        """
        # Add error type to additional data
        if error_type:
            kwargs["errorType"] = error_type
        
        # For system errors, include exception info
        if exc_info:
            kwargs["exc_info"] = True
        
        self._log(
            "ERROR",
            message,
            operation=operation,
            error_code=error_code,
            root_cause=root_cause,
            **kwargs
        )


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



