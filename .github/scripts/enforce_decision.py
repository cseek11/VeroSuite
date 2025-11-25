#!/usr/bin/env python3
"""
CLI script for enforcing PR decision (block/review/approve).

Usage:
    python .github/scripts/enforce_decision.py --pr-number <PR_NUMBER> --decision <DECISION>
"""

import os
import sys
import argparse
import subprocess
from pathlib import Path

# Add scripts directory to path
# .github/scripts/enforce_decision.py -> .github/scripts/ -> .github/ -> repo root -> .cursor/scripts
scripts_dir = Path(__file__).parent.parent.parent / ".cursor" / "scripts"
if str(scripts_dir) not in sys.path:
    sys.path.insert(0, str(scripts_dir))

from logger_util import get_logger, get_or_create_trace_context

logger = get_logger(context="EnforceDecisionCLI")


def post_pr_comment(pr_number: int, comment: str) -> bool:
    """
    Post comment to PR.
    
    Args:
        pr_number: PR number
        comment: Comment text
        
    Returns:
        True if successful
    """
    trace_ctx = get_or_create_trace_context()
    
    try:
        # Use GitHub CLI to post comment
        process = subprocess.Popen(
            ["gh", "pr", "comment", str(pr_number), "--body", comment],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True
        )
        stdout, stderr = process.communicate()
        
        if process.returncode != 0:
            logger.error(
                "Failed to post PR comment",
                operation="post_pr_comment",
                pr_number=pr_number,
                root_cause=stderr,
                **trace_ctx
            )
            return False
        
        logger.info(
            "PR comment posted",
            operation="post_pr_comment",
            pr_number=pr_number,
            **trace_ctx
        )
        return True
        
    except FileNotFoundError:
        logger.error(
            "GitHub CLI not found",
            operation="post_pr_comment",
            pr_number=pr_number,
            root_cause="gh command not available",
            **trace_ctx
        )
        return False
    except Exception as e:
        logger.error(
            "Failed to post PR comment",
            operation="post_pr_comment",
            pr_number=pr_number,
            root_cause=str(e),
            **trace_ctx
        )
        return False


def request_review(pr_number: int) -> bool:
    """
    Request review for PR.
    
    Args:
        pr_number: PR number
        
    Returns:
        True if successful
    """
    trace_ctx = get_or_create_trace_context()
    
    try:
        # Use GitHub CLI to request review
        process = subprocess.run(
            ["gh", "pr", "edit", str(pr_number), "--add-reviewer", "@verofield/engineering"],
            capture_output=True,
            text=True,
            check=False
        )
        
        if process.returncode != 0:
            logger.warn(
                "Failed to request review (may not have permissions)",
                operation="request_review",
                pr_number=pr_number,
                root_cause=process.stderr,
                **trace_ctx
            )
            return False
        
        logger.info(
            "Review requested",
            operation="request_review",
            pr_number=pr_number,
            **trace_ctx
        )
        return True
        
    except Exception as e:
        logger.error(
            "Failed to request review",
            operation="request_review",
            pr_number=pr_number,
            root_cause=str(e),
            **trace_ctx
        )
        return False


def main():
    """Main CLI entry point."""
    parser = argparse.ArgumentParser(description="Enforce PR decision")
    parser.add_argument("--pr-number", type=int, required=True, help="PR number")
    parser.add_argument("--decision", type=str, required=True, choices=["auto_block", "review_required", "auto_approve"], help="Decision")
    parser.add_argument("--reason", type=str, default="", help="Decision reason")
    parser.add_argument("--score", type=float, default=None, help="VeroScore (optional)")
    
    args = parser.parse_args()
    
    trace_ctx = get_or_create_trace_context()
    
    # Generate comment based on decision
    if args.decision == "auto_block":
        comment = f"""🚫 **VeroScore V3: Auto-BLOCK**

This PR has been automatically blocked due to critical violations.

**VeroScore:** {args.score:.2f}/10 (if provided)

**Reason:** {args.reason or "Critical violations detected"}

Please fix the violations and update the PR."""
        
        # Post comment
        post_pr_comment(args.pr_number, comment)
        
        # Set PR status to "changes_requested" (if we have permissions)
        try:
            subprocess.run(
                ["gh", "pr", "review", str(args.pr_number), "--body", "Blocked by VeroScore V3", "--event", "REQUEST_CHANGES"],
                check=False
            )
        except Exception:
            pass  # May not have permissions
        
        logger.info(
            "PR blocked",
            operation="main",
            pr_number=args.pr_number,
            score=args.score,
            **trace_ctx
        )
        
    elif args.decision == "review_required":
        comment = f"""⚠️ **VeroScore V3: Review Required**

This PR requires manual review.

**VeroScore:** {args.score:.2f}/10 (if provided)

**Reason:** {args.reason or "Score meets threshold but requires review"}

A reviewer will be assigned shortly."""
        
        # Post comment
        post_pr_comment(args.pr_number, comment)
        
        # Request review
        request_review(args.pr_number)
        
        logger.info(
            "Review requested",
            operation="main",
            pr_number=args.pr_number,
            score=args.score,
            **trace_ctx
        )
        
    elif args.decision == "auto_approve":
        comment = f"""✅ **VeroScore V3: Auto-APPROVE**

This PR has been automatically approved.

**VeroScore:** {args.score:.2f}/10 (if provided)

**Reason:** {args.reason or "Score meets auto-approve threshold and pipeline is complete"}

Ready to merge!"""
        
        # Post comment
        post_pr_comment(args.pr_number, comment)
        
        # Approve PR (if we have permissions)
        try:
            subprocess.run(
                ["gh", "pr", "review", str(args.pr_number), "--body", "Approved by VeroScore V3", "--event", "APPROVE"],
                check=False
            )
        except Exception:
            pass  # May not have permissions
        
        logger.info(
            "PR approved",
            operation="main",
            pr_number=args.pr_number,
            score=args.score,
            **trace_ctx
        )
    
    sys.exit(0)


if __name__ == "__main__":
    main()

