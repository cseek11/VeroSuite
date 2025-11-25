#!/usr/bin/env python3
"""
CLI script for updating session state in Supabase.

Usage:
    python .github/scripts/update_session.py --session-id <SESSION_ID> --status <STATUS> [--pr-number <PR_NUMBER>]
"""

import os
import sys
import argparse
from pathlib import Path

# Add scripts directory to path
scripts_dir = Path(__file__).parent.parent.parent / ".cursor" / "scripts"
if str(scripts_dir) not in sys.path:
    sys.path.insert(0, str(scripts_dir))

try:
    from supabase import create_client, Client
except ImportError:
    print("❌ Missing supabase-py package. Install with: pip install supabase", file=sys.stderr)
    sys.exit(1)

from veroscore_v3.session_manager import SessionManager
from logger_util import get_logger, get_or_create_trace_context

logger = get_logger(context="UpdateSessionCLI")


def check_session_completion(session_manager: SessionManager, session_id: str) -> bool:
    """
    Check if session is complete (all PRs merged or closed).
    
    Args:
        session_manager: SessionManager instance
        session_id: Session ID
        
    Returns:
        True if session is complete
    """
    trace_ctx = get_or_create_trace_context()
    
    try:
        session = session_manager._get_session(session_id)
        if not session:
            logger.warn(
                "Session not found",
                operation="check_session_completion",
                session_id=session_id,
                **trace_ctx
            )
            return False
        
        # Check if all PRs are merged or closed
        pr_numbers = session.get("pr_numbers", [])
        if not pr_numbers:
            # No PRs yet, not complete
            return False
        
        # Check PR status using GitHub CLI
        import subprocess
        all_complete = True
        
        for pr_number in pr_numbers:
            try:
                result = subprocess.run(
                    ["gh", "pr", "view", str(pr_number), "--json", "state,merged"],
                    capture_output=True,
                    text=True,
                    check=True
                )
                
                import json
                pr_data = json.loads(result.stdout)
                state = pr_data.get("state", "OPEN")
                merged = pr_data.get("merged", False)
                
                if state != "CLOSED" and not merged:
                    all_complete = False
                    break
                    
            except Exception as e:
                logger.warn(
                    "Failed to check PR status",
                    operation="check_session_completion",
                    pr_number=pr_number,
                    root_cause=str(e),
                    **trace_ctx
                )
                # Assume not complete if we can't check
                all_complete = False
                break
        
        return all_complete
        
    except Exception as e:
        logger.error(
            "Failed to check session completion",
            operation="check_session_completion",
            session_id=session_id,
            root_cause=str(e),
            **trace_ctx
        )
        return False


def main():
    """Main CLI entry point."""
    parser = argparse.ArgumentParser(description="Update session state in Supabase")
    parser.add_argument("--session-id", type=str, required=True, help="Session ID")
    parser.add_argument("--status", type=str, required=True, choices=["active", "processing", "completed", "failed"], help="New status")
    parser.add_argument("--pr-number", type=int, default=None, help="PR number (optional)")
    parser.add_argument("--check-completion", action="store_true", help="Check if session is complete and mark reward-eligible")
    
    args = parser.parse_args()
    
    trace_ctx = get_or_create_trace_context()
    
    # Initialize Supabase client
    supabase_url = os.getenv("SUPABASE_URL")
    supabase_key = os.getenv("SUPABASE_SECRET_KEY")
    
    if not supabase_url or not supabase_key:
        logger.error(
            "Missing Supabase credentials",
            operation="main",
            root_cause="SUPABASE_URL or SUPABASE_SECRET_KEY not set",
            **trace_ctx
        )
        sys.exit(1)
    
    supabase = create_client(supabase_url, supabase_key)
    session_manager = SessionManager(supabase)
    
    # Update session status
    try:
        update_data = {"status": args.status}
        
        if args.pr_number:
            # Add PR number to session's pr_numbers array
            session = session_manager._get_session(args.session_id)
            if session:
                pr_numbers = session.get("pr_numbers", [])
                if args.pr_number not in pr_numbers:
                    pr_numbers.append(args.pr_number)
                    update_data["pr_numbers"] = pr_numbers
        
        session_manager._update_session(args.session_id, update_data)
        
        logger.info(
            "Session updated",
            operation="main",
            session_id=args.session_id,
            status=args.status,
            pr_number=args.pr_number,
            **trace_ctx
        )
        
        # Check completion if requested
        if args.check_completion:
            is_complete = check_session_completion(session_manager, args.session_id)
            
            if is_complete:
                # Mark session as reward-eligible
                session_manager.mark_reward_eligible(args.session_id)
                
                logger.info(
                    "Session marked as reward-eligible",
                    operation="main",
                    session_id=args.session_id,
                    **trace_ctx
                )
                print("Session completed and marked as reward-eligible")
            else:
                logger.debug(
                    "Session not yet complete",
                    operation="main",
                    session_id=args.session_id,
                    **trace_ctx
                )
                print("Session not yet complete")
        
        sys.exit(0)
        
    except Exception as e:
        logger.error(
            "Failed to update session",
            operation="main",
            session_id=args.session_id,
            root_cause=str(e),
            **trace_ctx
        )
        sys.exit(1)


if __name__ == "__main__":
    main()

