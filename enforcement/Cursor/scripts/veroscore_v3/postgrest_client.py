#!/usr/bin/env python3
"""
PostgREST Client Wrapper - Direct schema access without RPC functions.

This provides a secure way to access veroscore schema tables directly
using PostgREST with Accept-Profile header, maintaining RLS enforcement.

Last Updated: 2025-12-05
"""

import os
from typing import Optional, List, Dict, Any

try:
    from postgrest import PostgrestClient
    from postgrest import SyncPostgrestClient
except ImportError:
    PostgrestClient = None
    SyncPostgrestClient = None

from logger_util import get_logger

logger = get_logger(context="PostgRESTClient")


class SecurePostgRESTClient:
    """
    Secure PostgREST client that accesses veroscore schema directly.
    Uses Accept-Profile header to specify schema, maintaining RLS enforcement.
    """
    
    def __init__(self, supabase_url: str, supabase_key: str):
        """
        Initialize PostgREST client with veroscore schema.
        
        Args:
            supabase_url: Supabase project URL
            supabase_key: Supabase service role key
        """
        if not PostgrestClient:
            raise ImportError("postgrest package is required. Install with: pip install postgrest")
        
        self.base_url = f"{supabase_url}/rest/v1"
        self.client = PostgrestClient(
            base_url=self.base_url,
            headers={
                "apikey": supabase_key,
                "Authorization": f"Bearer {supabase_key}",
                "Accept-Profile": "veroscore",  # Specify schema
                "Content-Profile": "veroscore"   # For writes
            }
        )
        
        logger.info(
            "PostgREST client initialized with veroscore schema",
            operation="__init__"
        )
    
    def table(self, table_name: str):
        """
        Get table query builder.
        
        Args:
            table_name: Table name (without schema prefix)
        
        Returns:
            PostgREST query builder
        """
        return self.client.from_(table_name)
    
    def insert(self, table_name: str, data: Dict[str, Any] | List[Dict[str, Any]]):
        """Insert data into table."""
        return self.client.from_(table_name).insert(data)
    
    def select(self, table_name: str, columns: str = "*"):
        """Select from table."""
        return self.client.from_(table_name).select(columns)
    
    def update(self, table_name: str, data: Dict[str, Any]):
        """Update table."""
        return self.client.from_(table_name).update(data)
    
    def delete(self, table_name: str):
        """Delete from table."""
        return self.client.from_(table_name).delete()



