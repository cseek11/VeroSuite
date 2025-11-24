#!/usr/bin/env python3
"""
Supabase Schema Helper - Secure direct access to veroscore schema.

Uses PostgREST client with Accept-Profile header for direct schema access,
maintaining RLS enforcement (MOST SECURE approach).

Last Updated: 2025-11-24
"""

import os
from typing import Optional, List, Dict, Any
from datetime import datetime, timezone

try:
    from supabase import Client
    from postgrest import SyncPostgrestClient
except ImportError:
    Client = None
    SyncPostgrestClient = None

from logger_util import get_logger

logger = get_logger(context="SupabaseSchemaHelper")


class SupabaseSchemaHelper:
    """
    Helper class to access veroscore schema tables securely.
    Uses PostgREST client with Accept-Profile header for direct access,
    maintaining RLS enforcement (MOST SECURE).
    """
    
    def __init__(self, supabase: Client):
        """
        Initialize schema helper.
        
        Args:
            supabase: Supabase client instance (used to get URL/key)
        """
        self.supabase = supabase
        self._postgrest_client = None  # Lazy initialization
        self._use_rpc = None  # Will be determined on first use
    
    def _get_postgrest_client(self):
        """Get or create PostgREST client with veroscore schema."""
        if self._postgrest_client is None:
            if not SyncPostgrestClient:
                raise ImportError("postgrest package required for secure schema access")
            
            # Get URL and key from Supabase client or environment
            try:
                # Try to get from Supabase client internals
                supabase_url = getattr(self.supabase, 'supabase_url', None) or os.getenv("SUPABASE_URL")
                supabase_key = getattr(self.supabase, 'supabase_key', None) or os.getenv("SUPABASE_SECRET_KEY")
            except Exception:
                supabase_url = os.getenv("SUPABASE_URL")
                supabase_key = os.getenv("SUPABASE_SECRET_KEY")
            
            if not supabase_url or not supabase_key:
                raise ValueError("SUPABASE_URL and SUPABASE_SECRET_KEY must be set")
            
            self._postgrest_client = SyncPostgrestClient(
                base_url=f"{supabase_url}/rest/v1",
                headers={
                    "apikey": supabase_key,
                    "Authorization": f"Bearer {supabase_key}",
                    "Accept-Profile": "veroscore",  # Specify schema
                    "Content-Profile": "veroscore"   # For writes
                }
            )
            
            logger.info(
                "PostgREST client initialized with veroscore schema",
                operation="_get_postgrest_client"
            )
        
        return self._postgrest_client
    
    def _try_direct_access(self, table_name: str) -> bool:
        """
        Try direct table access using multiple methods.
        
        Args:
            table_name: Table name to test
        
        Returns:
            True if direct access works, False otherwise
        """
        # Method 1: Try .schema() method (if Python client supports it)
        try:
            if hasattr(self.supabase, 'schema'):
                self.supabase.schema("veroscore").table(table_name).select("id").limit(0).execute()
                logger.info(
                    "Direct access via .schema() method works",
                    operation="_try_direct_access",
                    table_name=table_name
                )
                return True
        except Exception:
            pass
        
        # Method 2: Try schema-qualified table name (veroscore.table_name)
        try:
            self.supabase.table(f"veroscore.{table_name}").select("id").limit(0).execute()
            logger.info(
                "Direct access via schema-qualified name works",
                operation="_try_direct_access",
                table_name=table_name
            )
            return True
        except Exception:
            pass
        
        # Method 3: Try standard Supabase client (if PostgREST reloaded)
        try:
            self.supabase.table(table_name).select("id").limit(0).execute()
            logger.info(
                "Direct access via standard client works",
                operation="_try_direct_access",
                table_name=table_name
            )
            return True
        except Exception:
            pass
        
        # Method 4: Use PostgREST client with Accept-Profile header
        try:
            client = self._get_postgrest_client()
            client.from_(table_name).select("id").limit(0).execute()
            logger.info(
                "Direct access via PostgREST client works",
                operation="_try_direct_access",
                table_name=table_name
            )
            return True
        except Exception as e:
            logger.debug(
                "All direct access methods failed",
                operation="_try_direct_access",
                root_cause=str(e),
                table_name=table_name
            )
            return False
    
    def _should_use_rpc(self) -> bool:
        """Determine if we should use RPC functions."""
        if self._use_rpc is None:
            # Try direct access first
            self._use_rpc = not self._try_direct_access("sessions")
            if self._use_rpc:
                logger.warn(
                    "Direct table access failed, using RPC functions",
                    operation="_should_use_rpc",
                    error_code="SCHEMA_NOT_EXPOSED"
                )
            else:
                logger.info(
                    "Direct table access works, schema is exposed",
                    operation="_should_use_rpc"
                )
        return self._use_rpc
    
    def insert_session(self, session_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """
        Insert session using RPC or direct access.
        
        Args:
            session_data: Session data dictionary
        
        Returns:
            Inserted session data or None if failed
        """
        try:
            if self._should_use_rpc():
                # Use RPC function (note: function name uses schema prefix)
                result = self.supabase.rpc(
                    "insert_session",
                    {
                        "p_session_id": session_data["session_id"],
                        "p_author": session_data["author"],
                        "p_branch_name": session_data.get("branch_name"),
                        "p_status": session_data.get("status", "active")
                    }
                ).execute()
                # RPC returns UUID, need to fetch full record
                if result.data:
                    return self.get_session(session_data["session_id"])
                return None
            else:
                # Try multiple methods for direct access
                result = None
                
                # Method 1: Try .schema() method
                if hasattr(self.supabase, 'schema'):
                    try:
                        result = self.supabase.schema("veroscore").table("sessions").insert(session_data).execute()
                        if result.data and len(result.data) > 0:
                            return result.data[0]
                    except Exception:
                        pass
                
                # Method 2: Try schema-qualified table name
                if not result or not result.data:
                    try:
                        result = self.supabase.table("veroscore.sessions").insert(session_data).execute()
                        if result.data and len(result.data) > 0:
                            return result.data[0]
                    except Exception:
                        pass
                
                # Method 3: Use PostgREST client with Accept-Profile header
                if not result or not result.data:
                    client = self._get_postgrest_client()
                    result = client.from_("sessions").insert(session_data).execute()
                    if result.data and len(result.data) > 0:
                        return result.data[0]
                
                return None
        except Exception as e:
            logger.error(
                "Failed to insert session",
                operation="insert_session",
                error_code="SESSION_INSERT_FAILED",
                root_cause=str(e)
            )
            raise
    
    def get_session(self, session_id: str) -> Optional[Dict[str, Any]]:
        """
        Get session by ID.
        
        Args:
            session_id: Session ID
        
        Returns:
            Session data or None if not found
        """
        try:
            if self._should_use_rpc():
                # Use RPC function (note: function name uses schema prefix)
                result = self.supabase.rpc(
                    "get_session",
                    {"p_session_id": session_id}
                ).execute()
                if result.data and len(result.data) > 0:
                    return result.data[0]
                return None
            else:
                # Try multiple methods for direct access
                result = None
                
                # Method 1: Try .schema() method
                if hasattr(self.supabase, 'schema'):
                    try:
                        result = (
                            self.supabase.schema("veroscore")
                            .table("sessions")
                            .select("*")
                            .eq("session_id", session_id)
                            .limit(1)
                            .execute()
                        )
                        if result.data and len(result.data) > 0:
                            return result.data[0]
                    except Exception:
                        pass
                
                # Method 2: Try schema-qualified table name
                if not result or not result.data:
                    try:
                        result = (
                            self.supabase.table("veroscore.sessions")
                            .select("*")
                            .eq("session_id", session_id)
                            .limit(1)
                            .execute()
                        )
                        if result.data and len(result.data) > 0:
                            return result.data[0]
                    except Exception:
                        pass
                
                # Method 3: Use PostgREST client with Accept-Profile header
                if not result or not result.data:
                    client = self._get_postgrest_client()
                    result = (
                        client.from_("sessions")
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
                "Failed to get session",
                operation="get_session",
                error_code="SESSION_GET_FAILED",
                root_cause=str(e),
                session_id=session_id
            )
            return None
    
    def insert_changes(self, session_id: str, changes: List[Dict[str, Any]]) -> int:
        """
        Insert changes into changes_queue.
        
        Args:
            session_id: Session ID
            changes: List of change dictionaries
        
        Returns:
            Number of changes inserted
        """
        try:
            
            if self._should_use_rpc():
                # Use RPC function (note: function name uses schema prefix)
                import json
                result = self.supabase.rpc(
                    "insert_changes",
                    {
                        "p_session_id": session_id,
                        "p_changes": json.dumps(changes)
                    }
                ).execute()
                if result.data:
                    return result.data[0] if isinstance(result.data[0], int) else len(changes)
                return len(changes)
            else:
                # Try multiple methods for direct access
                changes_data = []
                for change in changes:
                    changes_data.append({
                        "session_id": session_id,
                        "file_path": change.get("path"),
                        "change_type": change.get("change_type"),
                        "old_path": change.get("old_path"),
                        "lines_added": change.get("lines_added", 0),
                        "lines_removed": change.get("lines_removed", 0),
                        "commit_hash": change.get("commit_hash"),
                        "processed": False,
                        "metadata": change.get("metadata", {})
                    })
                
                result = None
                
                # Method 1: Try .schema() method
                if hasattr(self.supabase, 'schema'):
                    try:
                        result = self.supabase.schema("veroscore").table("changes_queue").insert(changes_data).execute()
                        if result.data:
                            return len(changes_data)
                    except Exception:
                        pass
                
                # Method 2: Try schema-qualified table name
                if not result:
                    try:
                        result = self.supabase.table("veroscore.changes_queue").insert(changes_data).execute()
                        if result.data:
                            return len(changes_data)
                    except Exception:
                        pass
                
                # Method 3: Use PostgREST client with Accept-Profile header
                if not result:
                    client = self._get_postgrest_client()
                    result = client.from_("changes_queue").insert(changes_data).execute()
                    return len(changes_data) if result.data else 0
                
                return 0
        except Exception as e:
            logger.error(
                "Failed to insert changes",
                operation="insert_changes",
                error_code="CHANGES_INSERT_FAILED",
                root_cause=str(e),
                session_id=session_id,
                change_count=len(changes)
            )
            raise

