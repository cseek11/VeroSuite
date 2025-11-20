#!/usr/bin/env python3
"""
Complete orphaned sessions (sessions that should have been completed when Cursor closed).

This script:
1. Finds active sessions older than a threshold (default: 5 minutes of inactivity)
2. Completes them automatically
3. Can be run manually or scheduled
"""

import sys
from pathlib import Path
from datetime import datetime, timedelta

# Add scripts directory to path
scripts_dir = Path(__file__).parent
sys.path.insert(0, str(scripts_dir))

try:
    from logger_util import get_logger, get_or_create_trace_context
    logger = get_logger(context="complete_orphaned_sessions")
    trace_context = get_or_create_trace_context()
except ImportError:
    import logging
    logger = logging.getLogger("complete_orphaned_sessions")
    trace_context = {"traceId": None, "spanId": None, "requestId": None}


def complete_orphaned_sessions(max_inactivity_minutes=5):
    """
    Complete sessions that have been inactive for too long.
    
    Args:
        max_inactivity_minutes: Sessions inactive longer than this will be completed
    """
    sessions_file = Path(__file__).parent.parent.parent / "docs" / "metrics" / "auto_pr_sessions.json"
    
    if not sessions_file.exists():
        logger.warn(
            "Sessions file not found",
            operation="complete_orphaned_sessions",
            file=str(sessions_file),
            **trace_context
        )
        return []
    
    try:
        import json
        with open(sessions_file, 'r', encoding='utf-8') as f:
            data = json.load(f)
    except Exception as e:
        logger.error(
            "Failed to load sessions file",
            operation="complete_orphaned_sessions",
            error=str(e),
            **trace_context
        )
        return []
    
    active_sessions = data.get("active_sessions", {})
    if not active_sessions:
        logger.info(
            "No active sessions to check",
            operation="complete_orphaned_sessions",
            **trace_context
        )
        return []
    
    now = datetime.now()
    completed = []
    threshold = timedelta(minutes=max_inactivity_minutes)
    
    for session_id, session in active_sessions.items():
        try:
            # Parse last_activity timestamp
            last_activity_str = session.get("last_activity")
            if not last_activity_str:
                # Fallback to started time
                last_activity_str = session.get("started")
            
            if last_activity_str:
                if isinstance(last_activity_str, str):
                    last_activity = datetime.fromisoformat(last_activity_str.replace('Z', '+00:00'))
                else:
                    last_activity = datetime.fromisoformat(str(last_activity_str))
                
                # Check if session is orphaned (inactive too long)
                inactivity = now - last_activity.replace(tzinfo=None) if last_activity.tzinfo else now - last_activity
                
                if inactivity > threshold:
                    logger.info(
                        f"Found orphaned session: {session_id} (inactive for {inactivity})",
                        operation="complete_orphaned_sessions",
                        session_id=session_id,
                        inactivity_minutes=inactivity.total_seconds() / 60,
                        **trace_context
                    )
                    
                    # Complete the session using auto_pr_session_manager
                    session_manager = Path(__file__).parent / "auto_pr_session_manager.py"
                    if session_manager.exists():
                        import subprocess
                        result = subprocess.run(
                            [sys.executable, str(session_manager), "complete", "--session-id", session_id],
                            capture_output=True,
                            text=True,
                            timeout=10
                        )
                        
                        if result.returncode == 0:
                            completed.append(session_id)
                            logger.info(
                                f"Completed orphaned session: {session_id}",
                                operation="complete_orphaned_sessions",
                                session_id=session_id,
                                **trace_context
                            )
                        else:
                            logger.warn(
                                f"Failed to complete session: {session_id}",
                                operation="complete_orphaned_sessions",
                                session_id=session_id,
                                error=result.stderr,
                                **trace_context
                            )
        except Exception as e:
            logger.error(
                f"Error processing session {session_id}",
                operation="complete_orphaned_sessions",
                session_id=session_id,
                error=str(e),
                **trace_context
            )
    
    return completed


def main():
    """Main function."""
    import argparse
    
    parser = argparse.ArgumentParser(description="Complete orphaned sessions")
    parser.add_argument(
        "--max-inactivity-minutes",
        type=int,
        default=5,
        help="Sessions inactive longer than this will be completed (default: 5)"
    )
    
    args = parser.parse_args()
    
    logger.info(
        "Starting orphaned session cleanup",
        operation="main",
        max_inactivity_minutes=args.max_inactivity_minutes,
        **trace_context
    )
    
    completed = complete_orphaned_sessions(args.max_inactivity_minutes)
    
    if completed:
        print(f"Completed {len(completed)} orphaned session(s): {', '.join(completed)}")
    else:
        print("No orphaned sessions found")
    
    logger.info(
        f"Cleanup complete: {len(completed)} sessions completed",
        operation="main",
        completed_count=len(completed),
        **trace_context
    )
    
    return 0 if completed else 0


if __name__ == "__main__":
    sys.exit(main())

