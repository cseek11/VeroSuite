#!/usr/bin/env python3
"""
IdempotencyManager - Prevents duplicate PR creation and operations.

Phase 3: PR Creator Implementation
Last Updated: 2025-12-04
"""

import os
import hashlib
from typing import Optional, Dict, Any, Tuple
from datetime import datetime, timezone

try:
    from supabase import Client
except ImportError:
    Client = None

from logger_util import get_logger, get_or_create_trace_context

logger = get_logger(context="IdempotencyManager")


class IdempotencyManager:
    """
    Manages idempotency keys to prevent duplicate operations.
    
    Uses Supabase idempotency_keys table to track:
    - PR creation attempts
    - Session operations
    - Other critical operations
    """
    
    def __init__(self, supabase: Client):
        """
        Initialize idempotency manager.
        
        Args:
            supabase: Supabase client instance
        """
        self.supabase = supabase
        self.trace_ctx = get_or_create_trace_context()
        
        logger.info(
            "IdempotencyManager initialized",
            operation="__init__",
            **self.trace_ctx
        )
    
    def _generate_key(self, operation: str, identifier: str) -> str:
        """
        Generate idempotency key from operation and identifier.
        
        Args:
            operation: Operation name (e.g., 'create_pr')
            identifier: Unique identifier (e.g., session_id)
        
        Returns:
            Idempotency key (SHA256 hash)
        """
        raw_key = f"{operation}:{identifier}"
        return hashlib.sha256(raw_key.encode()).hexdigest()
    
    def get_or_create_key(
        self,
        operation: str,
        identifier: str
    ) -> Tuple[Optional[Dict[str, Any]], bool]:
        """
        Get existing idempotency key or create new one.
        
        Args:
            operation: Operation name
            identifier: Unique identifier
        
        Returns:
            Tuple of (existing_result, is_new)
            - existing_result: Result from previous operation if exists, None otherwise
            - is_new: True if key is new, False if already exists
        """
        try:
            key = self._generate_key(operation, identifier)
            
            # Check for existing key using .schema() method
            if hasattr(self.supabase, 'schema'):
                result = (
                    self.supabase.schema("veroscore")
                    .table("idempotency_keys")
                    .select("*")
                    .eq("key", key)
                    .limit(1)
                    .execute()
                )
            else:
                result = (
                    self.supabase.table("veroscore.idempotency_keys")
                    .select("*")
                    .eq("key", key)
                    .limit(1)
                    .execute()
                )
            
            if result.data and len(result.data) > 0:
                existing = result.data[0]
                
                # Check if operation completed
                if existing.get("status") == "completed":
                    logger.info(
                        "Idempotency key found (completed)",
                        operation="get_or_create_key",
                        key=key[:16] + "...",
                        operation_name=operation,
                        **self.trace_ctx
                    )
                    # Return existing result
                    result_data = existing.get("result")
                    if isinstance(result_data, dict):
                        return result_data, False
                    return None, False
                
                # Check if operation in progress
                if existing.get("status") == "processing":
                    logger.warn(
                        "Idempotency key found (in progress)",
                        operation="get_or_create_key",
                        key=key[:16] + "...",
                        operation_name=operation,
                        error_code="OPERATION_IN_PROGRESS",
                        **self.trace_ctx
                    )
                    # Operation already in progress, return None to prevent duplicate
                    return None, False
            
            # Create new key (match actual schema)
            now = datetime.now(timezone.utc)
            expires_at = now.replace(hour=(now.hour + 24) % 24)  # 24 hours from now
            key_data = {
                "key": key,
                "operation_type": operation,  # Schema uses operation_type, not operation
                "status": "processing",  # Schema uses 'processing', not 'in_progress'
                "result": {},  # JSONB, not None
                "expires_at": expires_at.isoformat()
            }
            
            # Insert using .schema() method
            if hasattr(self.supabase, 'schema'):
                insert_result = (
                    self.supabase.schema("veroscore")
                    .table("idempotency_keys")
                    .insert(key_data)
                    .execute()
                )
            else:
                insert_result = (
                    self.supabase.table("veroscore.idempotency_keys")
                    .insert(key_data)
                    .execute()
                )
            
            if insert_result.data and len(insert_result.data) > 0:
                logger.info(
                    "Idempotency key created",
                    operation="get_or_create_key",
                    key=key[:16] + "...",
                    operation_name=operation,
                    **self.trace_ctx
                )
                return None, True
            else:
                # Insert failed, might be race condition - check again
                return self.get_or_create_key(operation, identifier)
                
        except (ValueError, RuntimeError, ConnectionError) as e:
            logger.error(
                "Failed to get or create idempotency key",
                operation="get_or_create_key",
                error_code="IDEMPOTENCY_KEY_FAILED",
                root_cause=str(e),
                operation_name=operation,
                identifier=identifier,
                **self.trace_ctx
            )
            # Fail safe: allow operation to proceed (better than blocking)
            logger.warn(
                "Idempotency check failed, allowing operation to proceed",
                operation="get_or_create_key",
                operation_name=operation
            )
            return None, True
        except Exception as e:
            logger.error(
                "Unexpected error getting or creating idempotency key",
                operation="get_or_create_key",
                error_code="IDEMPOTENCY_KEY_UNEXPECTED",
                root_cause=str(e),
                operation_name=operation,
                identifier=identifier,
                **self.trace_ctx
            )
            # Fail safe: allow operation to proceed (better than blocking)
            logger.warn(
                "Idempotency check failed, allowing operation to proceed",
                operation="get_or_create_key",
                operation_name=operation
            )
            return None, True
    
    def mark_completed(self, operation: str, identifier: str, result: Dict[str, Any]):
        """
        Mark idempotency key as completed with result.
        
        Args:
            operation: Operation name
            identifier: Unique identifier
            result: Operation result
        """
        try:
            key = self._generate_key(operation, identifier)
            now = datetime.now(timezone.utc).isoformat()
            
            update_data = {
                "status": "completed",
                "result": result  # Schema doesn't have updated_at
            }
            
            # Update using .schema() method
            if hasattr(self.supabase, 'schema'):
                self.supabase.schema("veroscore").table("idempotency_keys").update(update_data).eq("key", key).execute()
            else:
                self.supabase.table("veroscore.idempotency_keys").update(update_data).eq("key", key).execute()
            
            logger.info(
                "Idempotency key marked as completed",
                operation="mark_completed",
                key=key[:16] + "...",
                operation_name=operation,
                **self.trace_ctx
            )
            
        except (ValueError, RuntimeError, ConnectionError) as e:
            logger.error(
                "Failed to mark idempotency key as completed",
                operation="mark_completed",
                error_code="IDEMPOTENCY_MARK_COMPLETED_FAILED",
                root_cause=str(e),
                operation_name=operation,
                identifier=identifier,
                **self.trace_ctx
            )
            # Non-critical error, don't raise
        except Exception as e:
            logger.error(
                "Unexpected error marking idempotency key as completed",
                operation="mark_completed",
                error_code="IDEMPOTENCY_MARK_COMPLETED_UNEXPECTED",
                root_cause=str(e),
                operation_name=operation,
                identifier=identifier,
                **self.trace_ctx
            )
            # Non-critical error, don't raise
    
    def mark_failed(self, operation: str, identifier: str, error: Optional[str] = None):
        """
        Mark idempotency key as failed.
        
        Args:
            operation: Operation name
            identifier: Unique identifier
            error: Error message (optional)
        """
        try:
            key = self._generate_key(operation, identifier)
            now = datetime.now(timezone.utc).isoformat()
            
            update_data = {
                "status": "failed",
                "result": {"error": error} if error else {}  # Store error in result JSONB (schema doesn't have error column)
            }
            
            # Update using .schema() method
            if hasattr(self.supabase, 'schema'):
                self.supabase.schema("veroscore").table("idempotency_keys").update(update_data).eq("key", key).execute()
            else:
                self.supabase.table("veroscore.idempotency_keys").update(update_data).eq("key", key).execute()
            
            logger.info(
                "Idempotency key marked as failed",
                operation="mark_failed",
                key=key[:16] + "...",
                operation_name=operation,
                error=error,
                **self.trace_ctx
            )
            
        except (ValueError, RuntimeError, ConnectionError) as e:
            logger.error(
                "Failed to mark idempotency key as failed",
                operation="mark_failed",
                error_code="IDEMPOTENCY_MARK_FAILED_FAILED",
                root_cause=str(e),
                operation_name=operation,
                identifier=identifier,
                **self.trace_ctx
            )
            # Non-critical error, don't raise
        except Exception as e:
            logger.error(
                "Unexpected error marking idempotency key as failed",
                operation="mark_failed",
                error_code="IDEMPOTENCY_MARK_FAILED_UNEXPECTED",
                root_cause=str(e),
                operation_name=operation,
                identifier=identifier,
                **self.trace_ctx
            )
            # Non-critical error, don't raise

