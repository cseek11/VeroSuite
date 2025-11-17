#!/usr/bin/env python3
"""
Automate PR creation for testing REWARD_SCORE system.

This script creates a branch, commits changes, and creates a PR using GitHub API.
"""

import argparse
import json
import subprocess
import sys
from pathlib import Path
from typing import Optional

try:
    from logger_util import get_logger
    logger = get_logger(context="create_pr")
except ImportError:
    import logging
    logger = logging.getLogger("create_pr")


def get_gh_path() -> str:
    """Get the path to GitHub CLI executable."""
    gh_path = r"C:\Program Files\GitHub CLI\gh.exe"
    import os
    if os.path.exists(gh_path):
        return gh_path
    # Fallback to just 'gh' if full path doesn't exist (Linux/Mac or in PATH)
    return "gh"


def run_command(cmd: list, cwd: Optional[Path] = None) -> tuple[str, int]:
    """Run a command and return output and return code."""
    try:
        result = subprocess.run(
            cmd,
            cwd=cwd,
            capture_output=True,
            text=True,
            timeout=30
        )
        return result.stdout.strip(), result.returncode
    except subprocess.TimeoutExpired as e:
        logger.error(
            f"Command timed out: {' '.join(cmd)}",
            operation="run_command",
            error=e
        )
        return "", 1
    except Exception as e:
        logger.error(
            f"Command failed: {' '.join(cmd)}",
            operation="run_command",
            error=e
        )
        return "", 1


def get_remote_url() -> Optional[str]:
    """Get the remote repository URL."""
    output, code = run_command(["git", "remote", "get-url", "origin"])
    if code == 0 and output:
        return output
    return None


def create_branch(branch_name: str) -> bool:
    """Create and checkout a new branch."""
    logger.info(f"Creating branch: {branch_name}", operation="create_branch")
    
    # Check if branch exists
    output, code = run_command(["git", "branch", "--list", branch_name])
    if branch_name in output:
        logger.warn(f"Branch {branch_name} already exists", operation="create_branch")
        # Checkout existing branch
        output, code = run_command(["git", "checkout", branch_name])
        return code == 0
    
    # Create new branch
    output, code = run_command(["git", "checkout", "-b", branch_name])
    if code != 0:
        logger.error(
            f"Failed to create branch: {branch_name}",
            operation="create_branch"
        )
        return False
    
    logger.info(f"Branch {branch_name} created successfully", operation="create_branch")
    return True


def commit_changes(message: str, files: Optional[list] = None) -> bool:
    """Commit changes to the current branch."""
    logger.info("Committing changes", operation="commit_changes")
    
    # Add files
    if files:
        for file in files:
            output, code = run_command(["git", "add", file])
            if code != 0:
                logger.warn(f"Failed to add file: {file}", operation="commit_changes")
    else:
        # Add all changes
        output, code = run_command(["git", "add", "."])
        if code != 0:
            logger.warn("Failed to add changes", operation="commit_changes")
    
    # Check if there are changes to commit
    output, code = run_command(["git", "status", "--porcelain"])
    if not output:
        logger.warn("No changes to commit", operation="commit_changes")
        return False
    
    # Commit
    output, code = run_command(["git", "commit", "-m", message])
    if code != 0:
        logger.error("Failed to commit changes", operation="commit_changes")
        return False
    
    logger.info("Changes committed successfully", operation="commit_changes")
    return True


def push_branch(branch_name: str, force: bool = False) -> bool:
    """Push branch to remote."""
    logger.info(f"Pushing branch: {branch_name}", operation="push_branch")
    
    cmd = ["git", "push", "origin", branch_name]
    if force:
        cmd.append("--force")
    
    output, code = run_command(cmd)
    if code != 0:
        logger.error(
            f"Failed to push branch: {branch_name}",
            operation="push_branch"
        )
        return False
    
    logger.info(f"Branch {branch_name} pushed successfully", operation="push_branch")
    return True


def create_pr_via_api(
    title: str,
    body: str,
    head: str,
    base: str = "main",
    repo: Optional[str] = None
) -> Optional[dict]:
    """Create PR using GitHub API (requires GitHub CLI or token)."""
    logger.info(f"Creating PR: {title}", operation="create_pr_via_api")
    
    # Try GitHub CLI first
    gh_path = get_gh_path()
    cmd = [
        gh_path, "pr", "create",
        "--title", title,
        "--body", body,
        "--head", head,
        "--base", base
    ]
    
    if repo:
        cmd.extend(["--repo", repo])
    
    output, code = run_command(cmd)
    if code == 0:
        # Parse PR number from output
        try:
            pr_num = output.split("#")[1].split()[0] if "#" in output else None
            pr_url = output.split("\n")[0] if "\n" in output else output
            logger.info(f"PR created successfully: {pr_url}", operation="create_pr_via_api")
            return {"number": pr_num, "url": pr_url}
        except Exception as e:
            logger.warn(f"Could not parse PR number from output: {output}", operation="create_pr_via_api", error=e)
            return {"url": output}
    
    # Fallback: Provide instructions
    logger.warn(
        "GitHub CLI not available. Please create PR manually or install GitHub CLI.",
        operation="create_pr_via_api"
    )
    print("\n" + "="*60)
    print("GitHub CLI not available. Please create PR manually:")
    print(f"1. Go to: https://github.com/{repo or 'OWNER/REPO'}/compare/{base}...{head}")
    print(f"2. Title: {title}")
    print(f"3. Body: {body}")
    print("="*60 + "\n")
    
    return None


def main() -> None:
    parser = argparse.ArgumentParser(description="Automate PR creation for REWARD_SCORE testing")
    parser.add_argument("--branch", required=True, help="Branch name for PR")
    parser.add_argument("--title", required=True, help="PR title")
    parser.add_argument("--body", help="PR description (default: auto-generated)")
    parser.add_argument("--base", default="main", help="Base branch (default: main)")
    parser.add_argument("--files", nargs="*", help="Specific files to commit (default: all)")
    parser.add_argument("--message", help="Commit message (default: PR title)")
    parser.add_argument("--no-commit", action="store_true", help="Skip committing changes")
    parser.add_argument("--no-push", action="store_true", help="Skip pushing branch")
    parser.add_argument("--no-pr", action="store_true", help="Skip creating PR")
    parser.add_argument("--force", action="store_true", help="Force push branch")
    
    args = parser.parse_args()
    
    # Generate default values
    commit_message = args.message or args.title
    pr_body = args.body or f"""
## Description
{args.title}

## Testing
This PR is created to test the REWARD_SCORE CI automation system.

## Expected Score
- Tests: Check rubric
- Documentation: Check rubric
- Security: Check rubric

## Checklist
- [ ] Code follows project standards
- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] No security issues
"""
    
    # Get repository info
    remote_url = get_remote_url()
    if not remote_url:
        logger.error("Could not determine remote repository URL", operation="main")
        sys.exit(1)
    
    # Extract repo from URL
    repo = None
    if "github.com" in remote_url:
        parts = remote_url.replace(".git", "").split("/")
        if len(parts) >= 2:
            repo = f"{parts[-2]}/{parts[-1]}"
    
    logger.info(f"Repository: {repo or remote_url}", operation="main")
    
    # Step 1: Create branch
    if not create_branch(args.branch):
        logger.error("Failed to create branch", operation="main")
        sys.exit(1)
    
    # Step 2: Commit changes (if not skipped)
    if not args.no_commit:
        if not commit_changes(commit_message, args.files):
            logger.warn("No changes to commit or commit failed", operation="main")
    
    # Step 3: Push branch (if not skipped)
    if not args.no_push:
        if not push_branch(args.branch, force=args.force):
            logger.error("Failed to push branch", operation="main")
            sys.exit(1)
    
    # Step 4: Create PR (if not skipped)
    if not args.no_pr:
        pr_result = create_pr_via_api(
            title=args.title,
            body=pr_body,
            head=args.branch,
            base=args.base,
            repo=repo
        )
        if pr_result:
            print(f"\n✅ PR created successfully!")
            print(f"   URL: {pr_result.get('url', 'N/A')}")
            print(f"   Number: {pr_result.get('number', 'N/A')}")
            print(f"\n📊 REWARD_SCORE will be computed automatically within ~5 minutes.")
        else:
            print(f"\n⚠️  Please create PR manually using the instructions above.")
            print(f"   Branch: {args.branch}")
            print(f"   Base: {args.base}")
    else:
        print(f"\n✅ Branch '{args.branch}' ready for PR creation.")
        print(f"   Create PR manually or run with --no-pr=false")


if __name__ == "__main__":
    main()

