#!/usr/bin/env python3
"""
Close old open Auto-PRs to prevent accumulation.

This script runs independently of PR creation to avoid interfering
with the working Auto-PR system.
"""

import argparse
import json
import os
import subprocess
import sys
from pathlib import Path
from typing import List, Dict, Optional

try:
    from logger_util import get_logger
    logger = get_logger(context="close_old_auto_prs")
except ImportError:
    import logging
    logger = logging.getLogger("close_old_auto_prs")


def get_gh_path() -> str:
    """Get GitHub CLI path."""
    gh_path = r"C:\Program Files\GitHub CLI\gh.exe"
    if not os.path.exists(gh_path):
        gh_path = "gh"
    return gh_path


def authenticate_gh_cli(gh_path: str) -> bool:
    """Authenticate GitHub CLI if needed."""
    try:
        auth_check = subprocess.run(
            [gh_path, "auth", "status"],
            capture_output=True,
            text=True,
            timeout=10
        )
        if auth_check.returncode == 0:
            logger.debug("GitHub CLI already authenticated", operation="authenticate_gh_cli")
            return True
        
        # Not authenticated, try to authenticate with token
        token = os.environ.get("GH_DISPATCH_PAT") or os.environ.get("GH_TOKEN") or os.environ.get("GITHUB_TOKEN")
        if not token:
            logger.error(
                "GitHub CLI not authenticated and no token found",
                operation="authenticate_gh_cli",
                error="Missing authentication"
            )
            return False
        
        # Authenticate GitHub CLI with token
        try:
            auth_result = subprocess.run(
                [gh_path, "auth", "login", "--with-token"],
                input=token,
                text=True,
                capture_output=True,
                timeout=10,
                check=True
            )
            logger.debug("GitHub CLI authenticated successfully", operation="authenticate_gh_cli")
            return True
        except subprocess.CalledProcessError as e:
            logger.error(
                f"Failed to authenticate GitHub CLI: {e.stderr}",
                operation="authenticate_gh_cli",
                error=e.stderr,
                stdout=e.stdout
            )
            return False
    except Exception as e:
        logger.error(
            f"Error checking GitHub CLI authentication: {e}",
            operation="authenticate_gh_cli",
            error=str(e)
        )
        return False


def get_open_auto_prs(repo_path: Path, gh_path: str) -> List[Dict]:
    """Get list of open PRs with 'Auto-PR:' in the title."""
    try:
        result = subprocess.run(
            [
                gh_path, "pr", "list",
                "--state", "open",
                "--limit", "100",
                "--json", "number,title,headRefName,createdAt"
            ],
            cwd=repo_path,
            capture_output=True,
            text=True,
            timeout=30
        )
        
        if result.returncode != 0:
            logger.error(
                f"Failed to list PRs: {result.stderr}",
                operation="get_open_auto_prs",
                error=result.stderr
            )
            return []
        
        all_prs = json.loads(result.stdout)
        auto_prs = [
            pr for pr in all_prs
            if pr.get("title", "").startswith("Auto-PR:")
        ]
        
        logger.info(
            f"Found {len(auto_prs)} open Auto-PRs",
            operation="get_open_auto_prs",
            count=len(auto_prs)
        )
        
        return auto_prs
    
    except subprocess.TimeoutExpired:
        logger.error("Timeout listing PRs", operation="get_open_auto_prs")
        return []
    except json.JSONDecodeError as e:
        logger.error(
            f"Failed to parse PR list JSON: {e}",
            operation="get_open_auto_prs",
            error=str(e)
        )
        return []
    except Exception as e:
        logger.error(
            f"Error getting open Auto-PRs: {e}",
            operation="get_open_auto_prs",
            error=str(e)
        )
        return []


def close_pr(pr_number: int, gh_path: str, repo_path: Path, comment: Optional[str] = None) -> bool:
    """Close a PR by number."""
    try:
        cmd = [gh_path, "pr", "close", str(pr_number)]
        if comment:
            cmd.extend(["--comment", comment])
        
        result = subprocess.run(
            cmd,
            cwd=repo_path,
            capture_output=True,
            text=True,
            timeout=30
        )
        
        if result.returncode == 0:
            logger.info(
                f"Closed PR #{pr_number}",
                operation="close_pr",
                pr_number=pr_number
            )
            return True
        else:
            logger.warn(
                f"Failed to close PR #{pr_number}: {result.stderr}",
                operation="close_pr",
                pr_number=pr_number,
                error=result.stderr
            )
            return False
    
    except subprocess.TimeoutExpired:
        logger.error(
            f"Timeout closing PR #{pr_number}",
            operation="close_pr",
            pr_number=pr_number
        )
        return False
    except Exception as e:
        logger.error(
            f"Error closing PR #{pr_number}: {e}",
            operation="close_pr",
            pr_number=pr_number,
            error=str(e)
        )
        return False


def main() -> None:
    parser = argparse.ArgumentParser(description="Close old open Auto-PRs")
    parser.add_argument(
        "--max-close",
        type=int,
        default=10,
        help="Maximum number of PRs to close per run (default: 10)"
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="List PRs that would be closed without actually closing them"
    )
    parser.add_argument(
        "--repo-path",
        type=str,
        default=None,
        help="Repository path (default: parent of .cursor directory)"
    )
    args = parser.parse_args()
    
    # Determine repo path
    if args.repo_path:
        repo_path = Path(args.repo_path)
    else:
        # Default: parent of .cursor directory
        script_path = Path(__file__).resolve()
        repo_path = script_path.parents[2]  # .cursor/scripts -> .cursor -> repo root
    
    if not repo_path.exists():
        logger.error(
            f"Repository path does not exist: {repo_path}",
            operation="main",
            repo_path=str(repo_path)
        )
        sys.exit(1)
    
    # Get GitHub CLI path
    gh_path = get_gh_path()
    
    # Authenticate
    if not authenticate_gh_cli(gh_path):
        logger.error("Cannot authenticate GitHub CLI", operation="main")
        sys.exit(1)
    
    # Get open Auto-PRs
    auto_prs = get_open_auto_prs(repo_path, gh_path)
    
    if not auto_prs:
        logger.info("No open Auto-PRs found", operation="main")
        return
    
    # Sort by creation date (oldest first)
    auto_prs.sort(key=lambda pr: pr.get("createdAt", ""))
    
    # Limit number to close
    prs_to_close = auto_prs[:args.max_close]
    
    logger.info(
        f"Found {len(auto_prs)} open Auto-PRs, will {'close' if not args.dry_run else 'list'} {len(prs_to_close)}",
        operation="main",
        total=len(auto_prs),
        to_close=len(prs_to_close)
    )
    
    # Close PRs
    closed_count = 0
    failed_count = 0
    
    for pr in prs_to_close:
        pr_number = pr.get("number")
        pr_title = pr.get("title", "")
        
        if args.dry_run:
            logger.info(
                f"[DRY RUN] Would close PR #{pr_number}: {pr_title}",
                operation="main",
                pr_number=pr_number,
                pr_title=pr_title
            )
            closed_count += 1
        else:
            comment = f"Closed by Auto-PR cleanup script. This PR was automatically created and is being replaced by newer changes."
            if close_pr(pr_number, gh_path, repo_path, comment):
                closed_count += 1
            else:
                failed_count += 1
    
    # Summary
    if args.dry_run:
        logger.info(
            f"[DRY RUN] Would close {closed_count} PRs",
            operation="main",
            count=closed_count
        )
    else:
        logger.info(
            f"Cleanup complete: {closed_count} closed, {failed_count} failed",
            operation="main",
            closed=closed_count,
            failed=failed_count
        )


if __name__ == "__main__":
    main()





