#!/usr/bin/env python3
"""
Cursor Session Manager CLI
CLI tool for managing sessions from cursor.

Last Updated: 2025-11-21
"""

import argparse
import subprocess
import sys
from pathlib import Path

# Import structured logger
try:
    from logger_util import get_logger, get_or_create_trace_context
    logger = get_logger(context="session_cli")
    trace_context = get_or_create_trace_context()
except ImportError:
    import logging
    logger = logging.getLogger("session_cli")
    trace_context = {"traceId": None, "spanId": None, "requestId": None}

try:
    from cursor_session_hook import get_or_create_session_id, clear_session
except ImportError as e:
    logger.error(
        "Failed to import cursor_session_hook",
        operation="import",
        error=str(e),
        **trace_context
    )
    print(f"ERROR: Failed to import cursor_session_hook: {e}", file=sys.stderr)
    sys.exit(1)


def cmd_start():
    """Start a new session."""
    try:
        clear_session()  # Clear any existing session
        session_id = get_or_create_session_id()
        
        # Add session to auto_pr_sessions.json so it appears in the dashboard
        try:
            script_path = Path(__file__).parent / "auto_pr_session_manager.py"
            from datetime import datetime
            import json
            
            # Load current sessions
            sessions_file = Path("docs/metrics/auto_pr_sessions.json")
            if sessions_file.exists():
                with open(sessions_file, 'r', encoding='utf-8') as f:
                    data = json.load(f)
            else:
                data = {"active_sessions": {}, "completed_sessions": [], "version": "1.0"}
            
            # Add new session if it doesn't exist
            if session_id not in data.get("active_sessions", {}):
                # Extract author from session_id (format: "author-timestamp")
                # e.g., "cseek_cursor-20251119-2226" -> "cseek_cursor"
                author = session_id.split("-", 1)[0] if "-" in session_id else "unknown"
                
                data.setdefault("active_sessions", {})[session_id] = {
                    "session_id": session_id,
                    "author": author,
                    "started": datetime.now().isoformat(),
                    "last_activity": datetime.now().isoformat(),
                    "prs": [],
                    "total_files_changed": 0,
                    "test_files_added": 0,
                    "status": "active"
                }
                data["last_updated"] = datetime.now().isoformat()
                
                # Save updated sessions
                sessions_file.parent.mkdir(parents=True, exist_ok=True)
                with open(sessions_file, 'w', encoding='utf-8') as f:
                    json.dump(data, f, indent=2, ensure_ascii=False)
                
                logger.debug(
                    "Session added to auto_pr_sessions.json",
                    operation="cmd_start",
                    session_id=session_id,
                    **trace_context
                )
        except Exception as e:
            logger.warn(
                "Failed to add session to auto_pr_sessions.json (will be added when PR is created)",
                operation="cmd_start",
                error=str(e),
                session_id=session_id,
                **trace_context
            )
        
        print(f"[OK] Started new session: {session_id}")
        print(f"   All commits will be tracked under this session.")
        print(f"   Use 'session complete' when done.")
        logger.info(
            "New session started",
            operation="cmd_start",
            session_id=session_id,
            **trace_context
        )
    except Exception as e:
        logger.error(
            "Error starting session",
            operation="cmd_start",
            error=str(e),
            error_type=type(e).__name__,
            **trace_context
        )
        print(f"[ERROR] {e}", file=sys.stderr)
        sys.exit(1)


def cmd_status():
    """Show current session status."""
    try:
        session_id = get_or_create_session_id()
        # Use ASCII-safe output for Windows console compatibility
        print(f"[Active session]: {session_id}")
        
        # Ensure session is registered with session manager
        # If session exists in marker file but not in manager, register it
        try:
            from auto_pr_session_manager import AutoPRSessionManager
            from datetime import datetime
            manager = AutoPRSessionManager()
            
            # Check if session exists in manager
            if session_id not in manager.sessions["active_sessions"]:
                # Extract author from session_id (format: "author-timestamp")
                author = session_id.split("-", 1)[0] if "-" in session_id else "unknown"
                
                # Register session with manager
                manager.sessions["active_sessions"][session_id] = {
                    "session_id": session_id,
                    "author": author,
                    "started": datetime.now().isoformat(),
                    "last_activity": datetime.now().isoformat(),
                    "prs": [],
                    "total_files_changed": 0,
                    "test_files_added": 0,
                    "status": "active"
                }
                manager.save_sessions()
                logger.info(
                    "Session registered with session manager",
                    operation="cmd_status",
                    session_id=session_id,
                    **trace_context
                )
        except Exception as e:
            logger.warn(
                "Failed to register session with manager (non-critical)",
                operation="cmd_status",
                error=str(e),
                session_id=session_id,
                **trace_context
            )
        
        # Get session details from manager
        script_path = Path(__file__).parent / "auto_pr_session_manager.py"
        result = subprocess.run(
            [sys.executable, str(script_path), "status", "--session-id", session_id],
            capture_output=True,
            text=True,
            timeout=30
        )
        
        if result.returncode == 0:
            print("\nSession details:")
            print(result.stdout)
            logger.debug(
                "Session status retrieved",
                operation="cmd_status",
                session_id=session_id,
                **trace_context
            )
        else:
            print(f"⚠️  Could not retrieve session details: {result.stderr}", file=sys.stderr)
            logger.warn(
                "Failed to retrieve session details",
                operation="cmd_status",
                session_id=session_id,
                error=result.stderr,
                **trace_context
            )
    except subprocess.TimeoutExpired:
        logger.error(
            "Session status check timed out",
            operation="cmd_status",
            **trace_context
        )
        print("[ERROR] Session status check timed out", file=sys.stderr)
        sys.exit(1)
    except Exception as e:
        logger.error(
            "Error getting session status",
            operation="cmd_status",
            error=str(e),
            error_type=type(e).__name__,
            **trace_context
        )
        print(f"[ERROR] {e}", file=sys.stderr)
        sys.exit(1)


def cmd_complete():
    """Complete current session."""
    try:
        session_id = get_or_create_session_id()
        
        # Trigger completion
        script_path = Path(__file__).parent / "auto_pr_session_manager.py"
        result = subprocess.run(
            [sys.executable, str(script_path), "complete", "--session-id", session_id],
            capture_output=True,
            text=True,
            timeout=60
        )
        
        if result.returncode == 0:
            clear_session()
            print(f"[OK] Session {session_id} completed")
            print(result.stdout)
            logger.info(
                "Session completed",
                operation="cmd_complete",
                session_id=session_id,
                **trace_context
            )
        else:
            error_msg = result.stderr or "Unknown error"
            logger.error(
                "Error completing session",
                operation="cmd_complete",
                session_id=session_id,
                error=error_msg,
                **trace_context
            )
            print(f"❌ Error completing session: {error_msg}", file=sys.stderr)
            sys.exit(1)
    except subprocess.TimeoutExpired:
        logger.error(
            "Session completion timed out",
            operation="cmd_complete",
            **trace_context
        )
        print("❌ Error: Session completion timed out", file=sys.stderr)
        sys.exit(1)
    except Exception as e:
        logger.error(
            "Error completing session",
            operation="cmd_complete",
            error=str(e),
            error_type=type(e).__name__,
            **trace_context
        )
        print(f"[ERROR] {e}", file=sys.stderr)
        sys.exit(1)


def cmd_clear():
    """Clear session without completing (start fresh)."""
    try:
        clear_session()
        print("[OK] Session cleared - next commit will start a new session")
        logger.info(
            "Session cleared",
            operation="cmd_clear",
            **trace_context
        )
    except Exception as e:
        logger.error(
            "Error clearing session",
            operation="cmd_clear",
            error=str(e),
            error_type=type(e).__name__,
            **trace_context
        )
        print(f"[ERROR] {e}", file=sys.stderr)
        sys.exit(1)


def main():
    """Main CLI entry point."""
    parser = argparse.ArgumentParser(
        description="Cursor Session Manager CLI",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  # Start a new session
  python session_cli.py start
  
  # Check session status
  python session_cli.py status
  
  # Complete current session
  python session_cli.py complete
  
  # Clear session (without completing)
  python session_cli.py clear
        """
    )
    
    subparsers = parser.add_subparsers(dest='command', help='Commands')
    
    subparsers.add_parser('start', help='Start new session')
    subparsers.add_parser('status', help='Show session status')
    subparsers.add_parser('complete', help='Complete current session')
    subparsers.add_parser('clear', help='Clear session without completing')
    
    args = parser.parse_args()
    
    if not args.command:
        parser.print_help()
        return
    
    commands = {
        'start': cmd_start,
        'status': cmd_status,
        'complete': cmd_complete,
        'clear': cmd_clear
    }
    
    try:
        commands[args.command]()
    except KeyError:
        logger.error(
            "Unknown command",
            operation="main",
            command=args.command,
            **trace_context
        )
        print(f"[ERROR] Unknown command: {args.command}", file=sys.stderr)
        parser.print_help()
        sys.exit(1)
    except Exception as e:
        logger.error(
            "Unexpected error in CLI",
            operation="main",
            error=str(e),
            error_type=type(e).__name__,
            command=args.command,
            **trace_context
        )
        print(f"[ERROR] Unexpected error: {e}", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()

