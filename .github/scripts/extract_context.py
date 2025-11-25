#!/usr/bin/env python3
"""
CLI script for extracting session context from PR.

Usage:
    python .github/scripts/extract_context.py --pr-number <PR_NUMBER>
"""

import os
import sys
import re
import argparse
import json
from pathlib import Path
from typing import Optional

# Add scripts directory to path
# .github/scripts/extract_context.py -> .github/ -> repo root -> .cursor/scripts
scripts_dir = Path(__file__).parent.parent / ".cursor" / "scripts"
if str(scripts_dir) not in sys.path:
    sys.path.insert(0, str(scripts_dir))

from logger_util import get_logger, get_or_create_trace_context

logger = get_logger(context="ExtractContextCLI")


def extract_session_id_from_branch(branch_name: str) -> Optional[str]:
    """
    Extract session ID from branch name.
    
    Branch names follow pattern: auto-pr-{author}-{timestamp}-{session_id}
    
    Args:
        branch_name: Branch name
        
    Returns:
        Session ID or None
    """
    # Pattern: auto-pr-{author}-{timestamp}-{session_id}
    pattern = r'auto-pr-[^-]+-\d{8}-\d{6}-([a-f0-9]{8,12})'
    match = re.search(pattern, branch_name)
    if match:
        return f"session-{match.group(1)}"
    return None


def extract_session_id_from_pr_description(pr_body: str) -> Optional[str]:
    """
    Extract session ID from PR description.
    
    Looks for patterns like:
    - Session ID: session-{id}
    - Session: session-{id}
    - [Session: session-{id}]
    
    Args:
        pr_body: PR description/body
        
    Returns:
        Session ID or None
    """
    if not pr_body:
        return None
    
    # Pattern: session-{hex}
    patterns = [
        r'Session ID:\s*(session-[a-f0-9]{12})',
        r'Session:\s*(session-[a-f0-9]{12})',
        r'\[Session:\s*(session-[a-f0-9]{12})\]',
        r'session-([a-f0-9]{12})',
    ]
    
    for pattern in patterns:
        match = re.search(pattern, pr_body, re.IGNORECASE)
        if match:
            session_id = match.group(1) if match.groups() else match.group(0)
            if not session_id.startswith("session-"):
                session_id = f"session-{session_id}"
            return session_id
    
    return None


def get_pr_info(pr_number: int) -> dict:
    """
    Get PR information using GitHub CLI.
    
    Args:
        pr_number: PR number
        
    Returns:
        Dictionary with PR info
    """
    import subprocess
    
    try:
        result = subprocess.run(
            ["gh", "pr", "view", str(pr_number), "--json", "title,body,headRefName,author"],
            capture_output=True,
            text=True,
            check=True
        )
        
        pr_data = json.loads(result.stdout)
        return {
            "title": pr_data.get("title", ""),
            "body": pr_data.get("body", ""),
            "branch": pr_data.get("headRefName", ""),
            "author": pr_data.get("author", {}).get("login", "unknown")
        }
        
    except subprocess.CalledProcessError as e:
        logger.error(
            "Failed to get PR info",
            operation="get_pr_info",
            pr_number=pr_number,
            root_cause=str(e),
            **get_or_create_trace_context()
        )
        return {}
    except FileNotFoundError:
        logger.error(
            "GitHub CLI not found",
            operation="get_pr_info",
            pr_number=pr_number,
            root_cause="gh command not available",
            **get_or_create_trace_context()
        )
        return {}


def main():
    """Main CLI entry point."""
    parser = argparse.ArgumentParser(description="Extract session context from PR")
    parser.add_argument("--pr-number", type=int, required=True, help="PR number")
    
    args = parser.parse_args()
    
    trace_ctx = get_or_create_trace_context()
    
    # Get PR info
    pr_info = get_pr_info(args.pr_number)
    
    if not pr_info:
        logger.error(
            "Failed to get PR info",
            operation="main",
            pr_number=args.pr_number,
            **trace_ctx
        )
        sys.exit(1)
    
    # Try to extract session ID from branch
    session_id = extract_session_id_from_branch(pr_info.get("branch", ""))
    
    # If not found, try PR description
    if not session_id:
        session_id = extract_session_id_from_pr_description(pr_info.get("body", ""))
    
    # Output results
    result = {
        "session_id": session_id,
        "branch": pr_info.get("branch", ""),
        "author": pr_info.get("author", "unknown"),
        "title": pr_info.get("title", "")
    }
    
    print(json.dumps(result, indent=2))
    
    if session_id:
        logger.info(
            "Session ID extracted",
            operation="main",
            pr_number=args.pr_number,
            session_id=session_id,
            **trace_ctx
        )
    else:
        logger.warn(
            "Session ID not found",
            operation="main",
            pr_number=args.pr_number,
            branch=pr_info.get("branch", ""),
            **trace_ctx
        )
    
    sys.exit(0 if session_id else 1)


if __name__ == "__main__":
    main()

