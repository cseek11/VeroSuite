#!/usr/bin/env python3
"""
Cursor Integration for Auto-PR Session Management
Hook for Cursor to add session metadata to commits.

Last Updated: 2025-11-19
"""

import os
import json
from datetime import datetime
from pathlib import Path
from typing import Tuple, Optional

# Import structured logger
try:
    from logger_util import get_logger, get_or_create_trace_context
    logger = get_logger(context="cursor_session_hook")
    trace_context = get_or_create_trace_context()
except ImportError:
    import logging
    logger = logging.getLogger("cursor_session_hook")
    trace_context = {"traceId": None, "spanId": None, "requestId": None}

SESSION_MARKER_FILE = Path(".cursor/.session_id")
SESSION_TIMEOUT_SECONDS = 1800  # 30 minutes


def get_or_create_session_id(author: Optional[str] = None) -> str:
    """
    Get existing session ID or create new one.
    
    Session ID persists until explicitly cleared or timeout.
    
    Args:
        author: Git author name (optional, will use GIT_AUTHOR_NAME env var if not provided)
    
    Returns:
        Session ID string
    """
    try:
        if SESSION_MARKER_FILE.exists():
            try:
                with open(SESSION_MARKER_FILE, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                
                # Check if session is still valid (< 30 minutes old)
                try:
                    last_updated = datetime.fromisoformat(data["last_updated"])
                    now = datetime.now()
                    
                    if (now - last_updated).total_seconds() < SESSION_TIMEOUT_SECONDS:
                        # Check if session uses old "unknown" author and migrate to "cseek_cursor"
                        existing_session_id = data.get("session_id", "")
                        existing_author = data.get("author", "unknown")
                        
                        if existing_author == "unknown" and "unknown-" in existing_session_id:
                            # Migrate old "unknown" session to "cseek_cursor"
                            logger.info(
                                "Migrating session from 'unknown' to 'cseek_cursor'",
                                operation="get_or_create_session_id",
                                old_session_id=existing_session_id,
                                **trace_context
                            )
                            # Create new session ID with cseek_cursor
                            timestamp = datetime.now().strftime("%Y%m%d-%H%M")
                            new_session_id = f"cseek_cursor-{timestamp}"
                            data["session_id"] = new_session_id
                            data["author"] = "cseek_cursor"
                            data["created"] = now.isoformat()
                            data["last_updated"] = now.isoformat()
                        else:
                            # Update timestamp and return existing ID
                            data["last_updated"] = now.isoformat()
                        
                        try:
                            with open(SESSION_MARKER_FILE, 'w', encoding='utf-8') as f:
                                json.dump(data, f, indent=2)
                            logger.debug(
                                "Session ID reused",
                                operation="get_or_create_session_id",
                                session_id=data.get("session_id"),
                                **trace_context
                            )
                            return data["session_id"]
                        except Exception as e:
                            logger.warn(
                                "Failed to update session timestamp, creating new session",
                                operation="get_or_create_session_id",
                                error=str(e),
                                **trace_context
                            )
                    else:
                        logger.info(
                            "Session expired, creating new",
                            operation="get_or_create_session_id",
                            age_seconds=(now - last_updated).total_seconds(),
                            **trace_context
                        )
                except (ValueError, KeyError) as e:
                    logger.warn(
                        "Invalid session data, creating new",
                        operation="get_or_create_session_id",
                        error=str(e),
                        **trace_context
                    )
            except json.JSONDecodeError as e:
                logger.warn(
                    "Corrupted session file, creating new",
                    operation="get_or_create_session_id",
                    error=str(e),
                    **trace_context
                )
            except Exception as e:
                logger.error(
                    "Error reading session file",
                    operation="get_or_create_session_id",
                    error=str(e),
                    error_type=type(e).__name__,
                    **trace_context
                )
        
        # Create new session ID
        if author is None:
            # Check for explicit session identifier, then git author, then user, then default to cseek_cursor
            author = (
                os.environ.get("AUTO_PR_SESSION_AUTHOR") or 
                os.environ.get("GIT_AUTHOR_NAME") or 
                os.environ.get("USER") or 
                "cseek_cursor"
            )
        
        timestamp = datetime.now().strftime("%Y%m%d-%H%M")
        session_id = f"{author}-{timestamp}"
        
        data = {
            "session_id": session_id,
            "author": author,
            "created": datetime.now().isoformat(),
            "last_updated": datetime.now().isoformat()
        }
        
        try:
            SESSION_MARKER_FILE.parent.mkdir(parents=True, exist_ok=True)
            with open(SESSION_MARKER_FILE, 'w', encoding='utf-8') as f:
                json.dump(data, f, indent=2)
            logger.info(
                "New session ID created",
                operation="get_or_create_session_id",
                session_id=session_id,
                author=author,
                **trace_context
            )
            return session_id
        except Exception as e:
            logger.error(
                "Failed to create session file",
                operation="get_or_create_session_id",
                error=str(e),
                error_type=type(e).__name__,
                **trace_context
            )
            # Return session ID even if file write fails (non-critical)
            return session_id
    
    except Exception as e:
        logger.error(
            "Unexpected error in get_or_create_session_id",
            operation="get_or_create_session_id",
            error=str(e),
            error_type=type(e).__name__,
            **trace_context
        )
        # Fallback: generate session ID without persistence
        author = (
            author or 
            os.environ.get("AUTO_PR_SESSION_AUTHOR") or 
            os.environ.get("GIT_AUTHOR_NAME") or 
            os.environ.get("USER") or 
            "cseek_cursor"
        )
        fallback_id = f"{author}-{datetime.now().strftime('%Y%m%d-%H%M')}"
        logger.warn(
            "Using fallback session ID",
            operation="get_or_create_session_id",
            fallback_id=fallback_id,
            **trace_context
        )
        return fallback_id


def clear_session():
    """Clear session marker (call this when manually completing)."""
    try:
        if SESSION_MARKER_FILE.exists():
            SESSION_MARKER_FILE.unlink()
            logger.info(
                "Session cleared",
                operation="clear_session",
                **trace_context
            )
        else:
            logger.debug(
                "No session to clear",
                operation="clear_session",
                **trace_context
            )
    except Exception as e:
        logger.error(
            "Error clearing session",
            operation="clear_session",
            error=str(e),
            error_type=type(e).__name__,
            **trace_context
        )
        # Non-critical error, continue


def format_session_metadata(session_id: str, pr_title: str) -> Tuple[str, str]:
    """
    Format PR title and body with session metadata.
    
    Args:
        session_id: Session ID to include in metadata
        pr_title: Original PR title
    
    Returns:
        Tuple of (updated_title, session_metadata_block)
    """
    try:
        # Add emoji prefix if not present
        if not pr_title.startswith("🤖") and not pr_title.startswith("auto-pr:"):
            pr_title = f"🤖 {pr_title}"
        
        metadata_block = f"""

---
[cursor-session: {session_id}]
<!-- Auto-PR Session Tracking -->
<!-- To complete this session: add [ready] to title or comment /complete-session -->
"""
        
        logger.debug(
            "Session metadata formatted",
            operation="format_session_metadata",
            session_id=session_id,
            **trace_context
        )
        
        return pr_title, metadata_block
    except Exception as e:
        logger.error(
            "Error formatting session metadata",
            operation="format_session_metadata",
            error=str(e),
            error_type=type(e).__name__,
            session_id=session_id,
            **trace_context
        )
        # Return original title and minimal metadata on error
        return pr_title, f"\n<!-- [cursor-session: {session_id}] -->"


if __name__ == "__main__":
    # Test the functions
    import sys
    if len(sys.argv) > 1 and sys.argv[1] == "test":
        print("Testing cursor_session_hook...")
        session_id = get_or_create_session_id("test-user")
        print(f"Session ID: {session_id}")
        title, metadata = format_session_metadata(session_id, "Test PR")
        print(f"Title: {title}")
        print(f"Metadata: {metadata}")
        clear_session()
        print("Test complete")

