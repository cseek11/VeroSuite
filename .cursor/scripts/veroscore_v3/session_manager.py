#!/usr/bin/env python3
"""
SessionManager - Supabase session management for VeroScore V3.

Last Updated: 2025-11-24
"""

import os
import uuid
from datetime import datetime, timezone
from typing import Optional, List, Dict, Any
from pathlib import Path

try:
    from supabase import create_client, Client
except ImportError:
    Client = None  # Type hint fallback

from .file_change import FileChange
from .supabase_schema_helper import SupabaseSchemaHelper
from logger_util import get_logger, get_or_create_trace_context

logger = get_logger(context="SessionManager")


class SessionManager:
    """
    Manages VeroScore V3 sessions in Supabase.
    
    Features:
    - Create/get active sessions
    - Add changes to queue
    - Update session stats
    - Mark sessions as reward-eligible
    """
    
    def __init__(self, supabase: Optional[Client] = None):
        """
        Initialize session manager.
        
        Args:
            supabase: Optional Supabase client (created if not provided)
        """
        if supabase is None:
            supabase_url = os.getenv("SUPABASE_URL")
            supabase_key = os.getenv("SUPABASE_SECRET_KEY")
            
            if not supabase_url or not supabase_key:
                raise ValueError(
                    "Missing SUPABASE_URL or SUPABASE_SECRET_KEY environment variables"
                )
            
            if Client is None:
                raise ImportError(
                    "supabase-py package required. Install with: pip install supabase"
                )
            
            supabase = create_client(supabase_url, supabase_key)
        
        self.supabase = supabase
        self.schema_helper = SupabaseSchemaHelper(supabase)
        self._current_session_id: Optional[str] = None
        
        logger.info(
            "SessionManager initialized",
            operation="__init__"
        )
    
    def get_or_create_session(
        self,
        author: Optional[str] = None,
        branch_name: Optional[str] = None
    ) -> str:
        """
        Get active session for author or create new one.
        
        Args:
            author: Author name (auto-detected from git if None)
            branch_name: Branch name (auto-detected if None)
        
        Returns:
            Session ID
        """
        try:
            trace_ctx = get_or_create_trace_context()
            
            # Auto-detect author from git if not provided
            if author is None:
                author = self._detect_author()
            
            # Check for active session
            if self._current_session_id:
                # Verify session still exists and is active
                session = self._get_session(self._current_session_id)
                if session and session.get("status") == "active":
                    logger.debug(
                        "Using existing active session",
                        operation="get_or_create_session",
                        session_id=self._current_session_id,
                        author=author,
                        **trace_ctx
                    )
                    return self._current_session_id
            
            # Look for existing active session for this author
            existing = self._find_active_session(author)
            if existing:
                self._current_session_id = existing["session_id"]
                logger.info(
                    "Found existing active session",
                    operation="get_or_create_session",
                    session_id=self._current_session_id,
                    author=author,
                    **trace_ctx
                )
                return self._current_session_id
            
            # Create new session
            session_id = f"session-{uuid.uuid4().hex[:12]}"
            now = datetime.now(timezone.utc).isoformat()
            
            session_data = {
                "session_id": session_id,
                "author": author,
                "branch_name": branch_name,
                "started": now,
                "last_activity": now,
                "status": "active",
                "total_files": 0,
                "total_lines_added": 0,
                "total_lines_removed": 0,
                "prs": [],
                "config": {},
                "metadata": {}
            }
            
            # Insert into Supabase using schema helper
            # Schema helper handles veroscore schema access (RPC or direct)
            inserted = self.schema_helper.insert_session(session_data)
            
            if inserted:
                self._current_session_id = session_id
                logger.info(
                    "Created new session",
                    operation="get_or_create_session",
                    session_id=session_id,
                    author=author,
                    **trace_ctx
                )
                return session_id
            else:
                raise RuntimeError("Failed to create session - no data returned")
                
        except Exception as e:
            logger.error(
                "Failed to get or create session",
                operation="get_or_create_session",
                error_code="SESSION_CREATE_FAILED",
                root_cause=str(e),
                author=author
            )
            raise
    
    def add_changes_batch(self, session_id: str, changes: List[FileChange]):
        """
        Add batch of changes to changes_queue.
        
        Args:
            session_id: Session ID
            changes: List of FileChange instances
        """
        try:
            trace_ctx = get_or_create_trace_context()
            
            if not changes:
                return
            
            # Prepare changes for insertion
            changes_data = []
            total_added = 0
            total_removed = 0
            
            for change in changes:
                changes_data.append({
                    "path": change.path,
                    "change_type": change.change_type,
                    "old_path": change.old_path,
                    "lines_added": change.lines_added,
                    "lines_removed": change.lines_removed,
                    "commit_hash": change.commit_hash,
                    "metadata": {}
                })
                total_added += change.lines_added
                total_removed += change.lines_removed
            
            # Insert changes using schema helper
            inserted_count = self.schema_helper.insert_changes(session_id, changes_data)
            
            # Update session stats
            self._update_session_stats(session_id, len(changes), total_added, total_removed)
            
            logger.info(
                "Added changes batch to queue",
                operation="add_changes_batch",
                session_id=session_id,
                change_count=len(changes),
                total_added=total_added,
                total_removed=total_removed,
                **trace_ctx
            )
            
        except Exception as e:
            logger.error(
                "Failed to add changes batch",
                operation="add_changes_batch",
                error_code="CHANGES_BATCH_FAILED",
                root_cause=str(e),
                session_id=session_id,
                change_count=len(changes)
            )
            raise
    
    def _update_session_stats(
        self,
        session_id: str,
        file_count: int,
        lines_added: int,
        lines_removed: int
    ):
        """Update session statistics."""
        try:
            # Get current session
            session = self._get_session(session_id)
            if not session:
                logger.warn(
                    "Session not found for stats update",
                    operation="_update_session_stats",
                    error_code="SESSION_NOT_FOUND",
                    session_id=session_id
                )
                return
            
            # Update stats using RPC or direct access
            if self.schema_helper._should_use_rpc():
                # Use RPC function
                result = self.supabase.rpc(
                    "update_session_stats",
                    {
                        "p_session_id": session_id,
                        "p_file_count": file_count,
                        "p_lines_added": lines_added,
                        "p_lines_removed": lines_removed
                    }
                ).execute()
            else:
                # Use direct table access with schema
                update_data = {
                    "total_files": (session.get("total_files", 0) or 0) + file_count,
                    "total_lines_added": (session.get("total_lines_added", 0) or 0) + lines_added,
                    "total_lines_removed": (session.get("total_lines_removed", 0) or 0) + lines_removed,
                    "last_activity": datetime.now(timezone.utc).isoformat()
                }
                # Use .schema() method for direct access
                if hasattr(self.supabase, 'schema'):
                    result = self.supabase.schema("veroscore").table("sessions").update(update_data).eq("session_id", session_id).execute()
                else:
                    result = self.supabase.table("veroscore.sessions").update(update_data).eq("session_id", session_id).execute()
            
            logger.debug(
                "Updated session stats",
                operation="_update_session_stats",
                session_id=session_id,
                file_count=file_count,
                lines_added=lines_added,
                lines_removed=lines_removed
            )
            
        except Exception as e:
            logger.error(
                "Failed to update session stats",
                operation="_update_session_stats",
                error_code="SESSION_STATS_UPDATE_FAILED",
                root_cause=str(e),
                session_id=session_id
            )
    
    def _update_session(self, session_id: str, update_data: Dict[str, Any]):
        """
        Update session with arbitrary data.
        
        Args:
            session_id: Session ID to update
            update_data: Dictionary of fields to update
        """
        try:
            trace_ctx = get_or_create_trace_context()
            
            # Add last_activity timestamp if not present
            if "last_activity" not in update_data:
                update_data["last_activity"] = datetime.now(timezone.utc).isoformat()
            
            # Use .schema() method for direct access
            if hasattr(self.supabase, 'schema'):
                result = self.supabase.schema("veroscore").table("sessions").update(update_data).eq("session_id", session_id).execute()
            else:
                result = self.supabase.table("veroscore.sessions").update(update_data).eq("session_id", session_id).execute()
            
            logger.info(
                "Updated session",
                operation="_update_session",
                session_id=session_id,
                update_fields=list(update_data.keys()),
                **trace_ctx
            )
            
        except Exception as e:
            logger.error(
                "Failed to update session",
                operation="_update_session",
                error_code="SESSION_UPDATE_FAILED",
                root_cause=str(e),
                session_id=session_id,
                update_data=update_data
            )
            raise
    
    def _get_session(self, session_id: str) -> Optional[Dict[str, Any]]:
        """Get session by ID."""
        try:
            return self.schema_helper.get_session(session_id)
        except Exception as e:
            logger.error(
                "Failed to get session",
                operation="_get_session",
                error_code="SESSION_GET_FAILED",
                root_cause=str(e),
                session_id=session_id
            )
            return None
    
    def _find_active_session(self, author: str) -> Optional[Dict[str, Any]]:
        """Find active session for author."""
        try:
            # Try direct access first with schema
            if not self.schema_helper._should_use_rpc():
                # Use .schema() method for direct access
                if hasattr(self.supabase, 'schema'):
                    result = (
                        self.supabase.schema("veroscore")
                        .table("sessions")
                        .select("*")
                        .eq("author", author)
                        .eq("status", "active")
                        .order("last_activity", desc=True)
                        .limit(1)
                        .execute()
                    )
                else:
                    result = (
                        self.supabase.table("veroscore.sessions")
                        .select("*")
                        .eq("author", author)
                        .eq("status", "active")
                        .order("last_activity", desc=True)
                        .limit(1)
                        .execute()
                    )
                if result.data and len(result.data) > 0:
                    return result.data[0]
            else:
                # Use RPC function
                result = self.supabase.rpc(
                    "find_active_session",
                    {"p_author": author}
                ).execute()
                if result.data and len(result.data) > 0:
                    return result.data[0]
            return None
        except Exception as e:
            logger.error(
                "Failed to find active session",
                operation="_find_active_session",
                error_code="SESSION_FIND_FAILED",
                root_cause=str(e),
                author=author
            )
            return None
    
    def _detect_author(self) -> str:
        """Detect author from git config."""
        try:
            import subprocess
            result = subprocess.run(
                ['git', 'config', 'user.name'],
                capture_output=True,
                text=True,
                check=True,
                timeout=5
            )
            return result.stdout.strip() or "unknown"
        except Exception:
            return "unknown"
    
    def mark_reward_eligible(self, session_id: str):
        """
        Mark session as eligible for Reward Score computation.
        
        Args:
            session_id: Session ID to mark as eligible
        """
        try:
            trace_ctx = get_or_create_trace_context()
            
            # Update using RPC or direct access with schema
            update_data = {
                "reward_score_eligible": True,
                "last_activity": datetime.now(timezone.utc).isoformat()
            }
            
            if self.schema_helper._should_use_rpc():
                # For RPC, we'd need an update function or use direct access for updates
                # For now, try direct access with schema (may work if schema is exposed)
                if hasattr(self.supabase, 'schema'):
                    result = self.supabase.schema("veroscore").table("sessions").update(update_data).eq("session_id", session_id).execute()
                else:
                    result = self.supabase.table("veroscore.sessions").update(update_data).eq("session_id", session_id).execute()
            else:
                # Use .schema() method for direct access
                if hasattr(self.supabase, 'schema'):
                    result = self.supabase.schema("veroscore").table("sessions").update(update_data).eq("session_id", session_id).execute()
                else:
                    result = self.supabase.table("veroscore.sessions").update(update_data).eq("session_id", session_id).execute()
            
            logger.info(
                "Marked session as reward-eligible",
                operation="mark_reward_eligible",
                session_id=session_id,
                **trace_ctx
            )
            
        except Exception as e:
            logger.error(
                "Failed to mark session as reward-eligible",
                operation="mark_reward_eligible",
                error_code="REWARD_ELIGIBLE_MARK_FAILED",
                root_cause=str(e),
                session_id=session_id
            )
            raise

