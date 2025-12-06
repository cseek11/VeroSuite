#!/usr/bin/env python3
"""
ThresholdChecker - PR creation threshold logic.

Last Updated: 2025-12-05
"""

from typing import Tuple, Optional, Dict, Any
from datetime import datetime, timezone, timedelta

from .session_manager import SessionManager
from logger_util import get_logger, get_or_create_trace_context

logger = get_logger(context="ThresholdChecker")


class ThresholdChecker:
    """
    Checks if PR creation thresholds are met.
    
    Thresholds:
    - Minimum files changed
    - Minimum lines changed
    - Maximum wait time
    - Batch size
    """
    
    def __init__(
        self,
        config: Dict[str, Any],
        session_manager: SessionManager
    ):
        """
        Initialize threshold checker.
        
        Args:
            config: Configuration dict with thresholds
            session_manager: SessionManager instance
        """
        self.config = config
        self.session_manager = session_manager
        
        # Extract threshold config
        thresholds = config.get("thresholds", {})
        self.min_files = thresholds.get("min_files", 3)
        self.min_lines = thresholds.get("min_lines", 50)
        self.max_wait_seconds = thresholds.get("max_wait_seconds", 300)
        self.batch_size = thresholds.get("batch_size", 10)
        
        logger.info(
            "ThresholdChecker initialized",
            operation="__init__",
            min_files=self.min_files,
            min_lines=self.min_lines,
            max_wait_seconds=self.max_wait_seconds,
            batch_size=self.batch_size
        )
    
    def should_create_pr(self, session_id: str) -> Tuple[bool, str]:
        """
        Check if PR should be created based on thresholds.
        
        Args:
            session_id: Session ID to check
        
        Returns:
            Tuple of (should_create, reason)
        """
        try:
            trace_ctx = get_or_create_trace_context()
            
            # Get session data
            session = self._get_session_data(session_id)
            if not session:
                logger.warn(
                    "Session not found for threshold check",
                    operation="should_create_pr",
                    error_code="SESSION_NOT_FOUND",
                    session_id=session_id,
                    **trace_ctx
                )
                return False, "Session not found"
            
            # Check file count threshold
            total_files = session.get("total_files", 0) or 0
            if total_files >= self.min_files:
                reason = f"File count threshold met: {total_files} >= {self.min_files}"
                logger.info(
                    "PR threshold met: file count",
                    operation="should_create_pr",
                    session_id=session_id,
                    total_files=total_files,
                    threshold=self.min_files,
                    **trace_ctx
                )
                return True, reason
            
            # Check line count threshold
            total_lines = (session.get("total_lines_added", 0) or 0) + (session.get("total_lines_removed", 0) or 0)
            if total_lines >= self.min_lines:
                reason = f"Line count threshold met: {total_lines} >= {self.min_lines}"
                logger.info(
                    "PR threshold met: line count",
                    operation="should_create_pr",
                    session_id=session_id,
                    total_lines=total_lines,
                    threshold=self.min_lines,
                    **trace_ctx
                )
                return True, reason
            
            # Check time-based threshold
            last_activity = session.get("last_activity")
            if last_activity:
                try:
                    last_activity_dt = datetime.fromisoformat(last_activity.replace('Z', '+00:00'))
                    now = datetime.now(timezone.utc)
                    elapsed = (now - last_activity_dt).total_seconds()
                    
                    if elapsed >= self.max_wait_seconds:
                        reason = f"Time threshold met: {elapsed:.0f}s >= {self.max_wait_seconds}s"
                        logger.info(
                            "PR threshold met: time elapsed",
                            operation="should_create_pr",
                            session_id=session_id,
                            elapsed_seconds=elapsed,
                            threshold=self.max_wait_seconds,
                            **trace_ctx
                        )
                        return True, reason
                except (ValueError, TypeError) as e:
                    logger.warn(
                        "Failed to parse last_activity timestamp",
                        operation="should_create_pr",
                        error_code="TIMESTAMP_PARSE_FAILED",
                        root_cause=str(e),
                        session_id=session_id,
                        last_activity=last_activity,
                        **trace_ctx
                    )
            
            # Check pending changes count (from changes_queue)
            pending_count = self._get_pending_changes_count(session_id)
            if pending_count >= self.batch_size:
                reason = f"Batch size threshold met: {pending_count} >= {self.batch_size}"
                logger.info(
                    "PR threshold met: batch size",
                    operation="should_create_pr",
                    session_id=session_id,
                    pending_count=pending_count,
                    threshold=self.batch_size,
                    **trace_ctx
                )
                return True, reason
            
            # Thresholds not met
            logger.debug(
                "PR thresholds not met",
                operation="should_create_pr",
                session_id=session_id,
                total_files=total_files,
                total_lines=total_lines,
                pending_count=pending_count,
                **trace_ctx
            )
            return False, "Thresholds not met"
            
        except Exception as e:
            logger.error(
                "Failed to check PR creation thresholds",
                operation="should_create_pr",
                error_code="THRESHOLD_CHECK_FAILED",
                root_cause=str(e),
                session_id=session_id
            )
            # Fail safe: don't create PR if check fails
            return False, f"Threshold check failed: {str(e)}"
    
    def _get_session_data(self, session_id: str) -> Optional[Dict[str, Any]]:
        """Get session data from Supabase."""
        try:
            # Use .schema() method for direct access
            if hasattr(self.session_manager.supabase, 'schema'):
                result = (
                    self.session_manager.supabase.schema("veroscore")
                    .table("sessions")
                    .select("*")
                    .eq("session_id", session_id)
                    .limit(1)
                    .execute()
                )
            else:
                result = (
                    self.session_manager.supabase.table("veroscore.sessions")
                    .select("*")
                    .eq("session_id", session_id)
                    .limit(1)
                    .execute()
                )
            if result.data and len(result.data) > 0:
                return result.data[0]
            return None
        except Exception as e:
            logger.error(
                "Failed to get session data",
                operation="_get_session_data",
                error_code="SESSION_DATA_GET_FAILED",
                root_cause=str(e),
                session_id=session_id
            )
            return None
    
    def _get_pending_changes_count(self, session_id: str) -> int:
        """Get count of pending changes in queue."""
        try:
            # Try RPC function first (if schema helper indicates RPC needed)
            if hasattr(self.session_manager, 'schema_helper') and self.session_manager.schema_helper._should_use_rpc():
                result = self.session_manager.supabase.rpc(
                    "get_pending_changes_count",
                    {"p_session_id": session_id}
                ).execute()
                if result.data and len(result.data) > 0:
                    return result.data[0] if isinstance(result.data[0], int) else 0
                return 0
            else:
                # Try direct table access with schema
                if hasattr(self.session_manager.supabase, 'schema'):
                    result = (
                        self.session_manager.supabase.schema("veroscore")
                        .table("changes_queue")
                        .select("id", count="exact")
                        .eq("session_id", session_id)
                        .eq("processed", False)
                        .execute()
                    )
                else:
                    result = (
                        self.session_manager.supabase.table("veroscore.changes_queue")
                        .select("id", count="exact")
                        .eq("session_id", session_id)
                        .eq("processed", False)
                        .execute()
                    )
                # Supabase returns count in response
                if hasattr(result, 'count') and result.count is not None:
                    return result.count
                # Fallback: count data items
                if result.data:
                    return len(result.data)
                return 0
        except Exception as e:
            logger.warn(
                "Failed to get pending changes count",
                operation="_get_pending_changes_count",
                error_code="PENDING_CHANGES_COUNT_FAILED",
                root_cause=str(e),
                session_id=session_id
            )
            return 0

