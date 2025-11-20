#!/usr/bin/env python3
"""
Minimal PR Metadata System
Stores session data in .cursor/data/session_state.json instead of PR body.
Keeps PR bodies clean while maintaining full session tracking.

Last Updated: 2025-11-19
"""

import json
from pathlib import Path
from typing import Dict, Optional, List, Tuple
from datetime import datetime

# Import structured logger
try:
    from logger_util import get_logger, get_or_create_trace_context
    logger = get_logger(context="minimal_metadata_system")
    trace_context = get_or_create_trace_context()
except ImportError:
    import logging
    logger = logging.getLogger("minimal_metadata_system")
    trace_context = {"traceId": None, "spanId": None, "requestId": None}

# File paths
SESSION_STATE_FILE = Path(".cursor/data/session_state.json")
SESSION_DATA_FILE = Path("docs/metrics/auto_pr_sessions.json")

# Minimal marker for PR bodies (optional, for user reference only)
MINIMAL_MARKER_TEMPLATE = """
<!-- 🤖 Auto-PR: Session {session_id} -->
"""


class SessionStateManager:
    """
    Manages session state with minimal PR body footprint.
    
    Uses .cursor/data/session_state.json as source of truth.
    PR bodies only get minimal comment markers for user reference.
    """
    
    def __init__(self, state_file: Path = SESSION_STATE_FILE):
        """Initialize state manager."""
        try:
            self.state_file = state_file
            self.state = self.load_state()
            logger.info(
                "SessionStateManager initialized",
                operation="__init__",
                state_file=str(state_file),
                **trace_context
            )
        except Exception as e:
            logger.error(
                "Failed to initialize SessionStateManager",
                operation="__init__",
                error=str(e),
                error_type=type(e).__name__,
                **trace_context
            )
            raise
    
    def load_state(self) -> Dict:
        """Load session state from file."""
        try:
            if self.state_file.exists():
                with open(self.state_file, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                    logger.debug(
                        "State loaded",
                        operation="load_state",
                        prs_tracked=len(data.get("pr_to_session", {})),
                        active_sessions=len(data.get("session_to_prs", {})),
                        **trace_context
                    )
                    return data
            
            logger.info(
                "State file not found, creating new",
                operation="load_state",
                **trace_context
            )
            return {
                "version": "1.0",
                "last_updated": datetime.now().isoformat(),
                "pr_to_session": {},  # pr_number -> session_id
                "session_to_prs": {},  # session_id -> [pr_numbers]
                "session_metadata": {}  # session_id -> metadata
            }
        except json.JSONDecodeError as e:
            logger.error(
                "Invalid JSON in state file",
                operation="load_state",
                error=str(e),
                file_path=str(self.state_file),
                **trace_context
            )
            # Create new state on corruption
            logger.warn(
                "Creating new state file due to corruption",
                operation="load_state",
                **trace_context
            )
            return {
                "version": "1.0",
                "last_updated": datetime.now().isoformat(),
                "pr_to_session": {},
                "session_to_prs": {},
                "session_metadata": {}
            }
        except Exception as e:
            logger.error(
                "Error loading state",
                operation="load_state",
                error=str(e),
                error_type=type(e).__name__,
                **trace_context
            )
            raise
    
    def save_state(self):
        """Persist state to file."""
        try:
            self.state["last_updated"] = datetime.now().isoformat()
            self.state_file.parent.mkdir(parents=True, exist_ok=True)
            with open(self.state_file, 'w', encoding='utf-8') as f:
                json.dump(self.state, f, indent=2, ensure_ascii=False)
            logger.debug(
                "State saved",
                operation="save_state",
                **trace_context
            )
        except Exception as e:
            logger.error(
                "Error saving state",
                operation="save_state",
                error=str(e),
                error_type=type(e).__name__,
                **trace_context
            )
            raise
    
    def register_pr(
        self, 
        pr_number: str, 
        session_id: str,
        metadata: Optional[Dict] = None
    ):
        """
        Register PR with session without modifying PR body.
        
        Args:
            pr_number: PR number (e.g., "326")
            session_id: Session ID
            metadata: Optional metadata (author, timestamp, etc.)
        """
        try:
            # Link PR to session
            self.state["pr_to_session"][pr_number] = session_id
            
            # Add PR to session's PR list
            if session_id not in self.state["session_to_prs"]:
                self.state["session_to_prs"][session_id] = []
            
            if pr_number not in self.state["session_to_prs"][session_id]:
                self.state["session_to_prs"][session_id].append(pr_number)
            
            # Store session metadata if provided
            if metadata and session_id not in self.state["session_metadata"]:
                self.state["session_metadata"][session_id] = metadata
            
            self.save_state()
            
            logger.debug(
                "PR registered",
                operation="register_pr",
                pr_number=pr_number,
                session_id=session_id,
                **trace_context
            )
        except Exception as e:
            logger.error(
                "Error registering PR",
                operation="register_pr",
                error=str(e),
                error_type=type(e).__name__,
                pr_number=pr_number,
                session_id=session_id,
                **trace_context
            )
            raise
    
    def get_session_for_pr(self, pr_number: str) -> Optional[str]:
        """Get session ID for a given PR."""
        try:
            return self.state["pr_to_session"].get(pr_number)
        except Exception as e:
            logger.error(
                "Error getting session for PR",
                operation="get_session_for_pr",
                error=str(e),
                error_type=type(e).__name__,
                pr_number=pr_number,
                **trace_context
            )
            return None
    
    def get_prs_for_session(self, session_id: str) -> List[str]:
        """Get all PRs in a session."""
        try:
            return self.state["session_to_prs"].get(session_id, [])
        except Exception as e:
            logger.error(
                "Error getting PRs for session",
                operation="get_prs_for_session",
                error=str(e),
                error_type=type(e).__name__,
                session_id=session_id,
                **trace_context
            )
            return []
    
    def get_session_metadata(self, session_id: str) -> Optional[Dict]:
        """Get metadata for a session."""
        try:
            return self.state["session_metadata"].get(session_id)
        except Exception as e:
            logger.error(
                "Error getting session metadata",
                operation="get_session_metadata",
                error=str(e),
                error_type=type(e).__name__,
                session_id=session_id,
                **trace_context
            )
            return None
    
    def remove_pr(self, pr_number: str):
        """Remove PR from session tracking."""
        try:
            session_id = self.state["pr_to_session"].pop(pr_number, None)
            
            if session_id and session_id in self.state["session_to_prs"]:
                prs = self.state["session_to_prs"][session_id]
                if pr_number in prs:
                    prs.remove(pr_number)
                
                # Clean up empty sessions
                if not prs:
                    self.state["session_to_prs"].pop(session_id, None)
                    self.state["session_metadata"].pop(session_id, None)
            
            self.save_state()
            
            logger.debug(
                "PR removed",
                operation="remove_pr",
                pr_number=pr_number,
                **trace_context
            )
        except Exception as e:
            logger.error(
                "Error removing PR",
                operation="remove_pr",
                error=str(e),
                error_type=type(e).__name__,
                pr_number=pr_number,
                **trace_context
            )
            raise
    
    def clear_session(self, session_id: str):
        """Clear all data for a session."""
        try:
            # Remove all PRs from session
            prs = self.state["session_to_prs"].pop(session_id, [])
            
            for pr in prs:
                self.state["pr_to_session"].pop(pr, None)
            
            # Remove metadata
            self.state["session_metadata"].pop(session_id, None)
            
            self.save_state()
            
            logger.info(
                "Session cleared",
                operation="clear_session",
                session_id=session_id,
                prs_removed=len(prs),
                **trace_context
            )
        except Exception as e:
            logger.error(
                "Error clearing session",
                operation="clear_session",
                error=str(e),
                error_type=type(e).__name__,
                session_id=session_id,
                **trace_context
            )
            raise
    
    def get_minimal_pr_marker(self, session_id: str) -> str:
        """
        Generate minimal HTML comment for PR body.
        
        This is optional and only for user visibility.
        The actual tracking is in session_state.json.
        """
        try:
            return MINIMAL_MARKER_TEMPLATE.format(session_id=session_id)
        except Exception as e:
            logger.error(
                "Error generating minimal marker",
                operation="get_minimal_pr_marker",
                error=str(e),
                error_type=type(e).__name__,
                session_id=session_id,
                **trace_context
            )
            return f"<!-- 🤖 Auto-PR: Session {session_id} -->"


# GitHub Actions workflow integration
def extract_session_id_from_state(pr_number: str) -> Optional[str]:
    """
    Extract session ID from state file instead of parsing PR body.
    
    Use in GitHub Actions workflow:
    ```bash
    SESSION_ID=$(python -c "
    from minimal_metadata_system import extract_session_id_from_state
    print(extract_session_id_from_state('$PR_NUMBER'))
    ")
    ```
    """
    try:
        state_manager = SessionStateManager()
        session_id = state_manager.get_session_for_pr(pr_number)
        logger.debug(
            "Session ID extracted from state",
            operation="extract_session_id_from_state",
            pr_number=pr_number,
            session_id=session_id,
            **trace_context
        )
        return session_id
    except Exception as e:
        logger.error(
            "Error extracting session ID from state",
            operation="extract_session_id_from_state",
            error=str(e),
            error_type=type(e).__name__,
            pr_number=pr_number,
            **trace_context
        )
        return None


# Modified cursor_session_hook.py functions
def format_session_metadata_minimal(session_id: str, pr_title: str) -> Tuple[str, str]:
    """
    Format PR title and body with minimal session metadata.
    
    Returns:
        (updated_title, minimal_metadata_block)
    """
    try:
        # Add emoji prefix if not present
        if not pr_title.startswith("🤖") and not pr_title.startswith("auto-pr:"):
            pr_title = f"🤖 {pr_title}"
        
        # Minimal HTML comment (won't show in rendered PR)
        metadata_block = f"\n<!-- 🤖 Auto-PR: Session {session_id} -->"
        
        logger.debug(
            "Minimal metadata formatted",
            operation="format_session_metadata_minimal",
            session_id=session_id,
            **trace_context
        )
        
        return pr_title, metadata_block
    except Exception as e:
        logger.error(
            "Error formatting minimal metadata",
            operation="format_session_metadata_minimal",
            error=str(e),
            error_type=type(e).__name__,
            session_id=session_id,
            **trace_context
        )
        # Return original title on error
        return pr_title, f"\n<!-- 🤖 Auto-PR: Session {session_id} -->"


# CLI commands for state management
def cli_state_status():
    """Show state file statistics."""
    try:
        state_manager = SessionStateManager()
        
        print("📊 Session State Status\n")
        print(f"State file: {SESSION_STATE_FILE}")
        print(f"Total PRs tracked: {len(state_manager.state['pr_to_session'])}")
        print(f"Active sessions: {len(state_manager.state['session_to_prs'])}")
        
        if SESSION_STATE_FILE.exists():
            size_kb = SESSION_STATE_FILE.stat().st_size / 1024
            print(f"File size: {size_kb:.2f} KB")
        
        print("\nSession breakdown:")
        for session_id, prs in state_manager.state["session_to_prs"].items():
            print(f"  {session_id}: {len(prs)} PRs")
        
        logger.info(
            "State status displayed",
            operation="cli_state_status",
            **trace_context
        )
    except Exception as e:
        logger.error(
            "Error displaying state status",
            operation="cli_state_status",
            error=str(e),
            error_type=type(e).__name__,
            **trace_context
        )
        print(f"ERROR: {e}", file=__import__('sys').stderr)


def cli_state_export():
    """Export state to human-readable format."""
    try:
        state_manager = SessionStateManager()
        
        output = {
            "summary": {
                "total_prs": len(state_manager.state["pr_to_session"]),
                "active_sessions": len(state_manager.state["session_to_prs"]),
                "last_updated": state_manager.state.get("last_updated")
            },
            "sessions": []
        }
        
        for session_id, prs in state_manager.state["session_to_prs"].items():
            metadata = state_manager.get_session_metadata(session_id)
            output["sessions"].append({
                "session_id": session_id,
                "prs": prs,
                "pr_count": len(prs),
                "author": metadata.get("author") if metadata else None
            })
        
        print(json.dumps(output, indent=2))
        
        logger.info(
            "State exported",
            operation="cli_state_export",
            **trace_context
        )
    except Exception as e:
        logger.error(
            "Error exporting state",
            operation="cli_state_export",
            error=str(e),
            error_type=type(e).__name__,
            **trace_context
        )
        print(f"ERROR: {e}", file=__import__('sys').stderr)


def cli_state_cleanup():
    """Clean up orphaned entries in state."""
    try:
        state_manager = SessionStateManager()
        
        print("🧹 Cleaning up state file...")
        
        # Find PRs without sessions
        orphaned_prs = []
        for pr, session_id in list(state_manager.state["pr_to_session"].items()):
            if session_id not in state_manager.state["session_to_prs"]:
                orphaned_prs.append(pr)
                del state_manager.state["pr_to_session"][pr]
        
        # Find sessions without PRs
        empty_sessions = []
        for session_id, prs in list(state_manager.state["session_to_prs"].items()):
            if not prs:
                empty_sessions.append(session_id)
                del state_manager.state["session_to_prs"][session_id]
                state_manager.state["session_metadata"].pop(session_id, None)
        
        state_manager.save_state()
        
        print(f"✅ Cleanup complete")
        print(f"   Removed {len(orphaned_prs)} orphaned PRs")
        print(f"   Removed {len(empty_sessions)} empty sessions")
        
        logger.info(
            "State cleaned up",
            operation="cli_state_cleanup",
            orphaned_prs=len(orphaned_prs),
            empty_sessions=len(empty_sessions),
            **trace_context
        )
    except Exception as e:
        logger.error(
            "Error cleaning up state",
            operation="cli_state_cleanup",
            error=str(e),
            error_type=type(e).__name__,
            **trace_context
        )
        print(f"ERROR: {e}", file=__import__('sys').stderr)


# Main CLI
if __name__ == "__main__":
    import sys
    
    if len(sys.argv) < 2:
        print("""
Minimal PR Metadata System

Commands:
  status     - Show state file status
  export     - Export state to JSON
  cleanup    - Clean up orphaned entries
  extract    - Extract session ID for PR (usage: extract <pr_number>)
  
Usage:
  python minimal_metadata_system.py <command> [args]
        """)
        sys.exit(0)
    
    command = sys.argv[1]
    
    if command == "status":
        cli_state_status()
    elif command == "export":
        cli_state_export()
    elif command == "cleanup":
        cli_state_cleanup()
    elif command == "extract":
        if len(sys.argv) < 3:
            print("ERROR: PR number required", file=sys.stderr)
            sys.exit(1)
        session_id = extract_session_id_from_state(sys.argv[2])
        if session_id:
            print(session_id)
        else:
            print("", file=sys.stderr)
            sys.exit(1)
    else:
        print(f"❌ Unknown command: {command}", file=sys.stderr)
        sys.exit(1)

