#!/usr/bin/env python3
"""
Monitor file changes and trigger automated PR creation based on smart batching rules.

This script monitors the working directory for file changes and creates PRs
when batching thresholds are met.
"""

import argparse
import json
import os
import pathlib
import re
import subprocess
import sys
import tempfile
import time
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Set
from collections import defaultdict

# Try to import yaml, fallback to basic parsing
try:
    import yaml
    HAS_YAML = True
except ImportError:
    HAS_YAML = False
    logger = None  # Will be set after logger_util import

try:
    from logger_util import get_logger
    logger = get_logger(context="monitor_changes")
except ImportError:
    import logging
    logger = logging.getLogger("monitor_changes")


CONFIG_FILE = pathlib.Path(__file__).resolve().parents[1] / "config" / "auto_pr_config.yaml"
STATE_FILE = pathlib.Path(__file__).resolve().parents[1] / "cache" / "auto_pr_state.json"


def load_config() -> Dict:
    """Load configuration from YAML file."""
    if not CONFIG_FILE.exists():
        if logger:
            logger.warn(
                f"Config file not found: {CONFIG_FILE}, using defaults",
                operation="load_config"
            )
        return get_default_config()
    
    try:
        if HAS_YAML:
            with open(CONFIG_FILE, "r", encoding="utf-8") as handle:
                return yaml.safe_load(handle)
        else:
            # Basic JSON fallback (if config is JSON-compatible)
            with open(CONFIG_FILE, "r", encoding="utf-8") as handle:
                return json.load(handle)
    except Exception as e:
        if logger:
            logger.error(
                f"Error loading config: {CONFIG_FILE}",
                operation="load_config",
                error=e
            )
        return get_default_config()


def get_default_config() -> Dict:
    """Get default configuration."""
    return {
        "time_based": {
            "enabled": True,
            "inactivity_hours": 4,
            "max_work_hours": 8,
            "min_files": 3,  # Minimum files required for time-based PR
            "min_lines": 50,  # Minimum lines required for time-based PR
            "require_test_file": False  # Require test file for time-based PRs
        },
        "change_threshold": {
            "enabled": True,
            "min_files": 5,
            "min_lines": 200,
            "require_test_file": False
        },
        "logical_grouping": {
            "enabled": True,
            "group_by_directory": True,
            "group_by_file_type": True,
            "group_by_semantic": True,  # Group by feature keywords (auth, tenant, billing, etc.)
            "max_group_size": 10
        },
        "pr_settings": {
            "base_branch": "main",
            "auto_title": True,
            "auto_body": True
        },
        "excluded_paths": [
            ".git/", "node_modules/", ".venv/", "__pycache__/", ".cursor/cache/",
            "*.log", "*.tmp"
        ]
    }


def load_state() -> Dict:
    """Load state from JSON file."""
    if not STATE_FILE.exists():
        return {
            "tracked_files": {},
            "last_change_time": None,
            "first_change_time": None,
            "batches": []
        }
    
    try:
        with open(STATE_FILE, "r", encoding="utf-8") as handle:
            return json.load(handle)
    except Exception as e:
        logger.warn(
            f"Error loading state: {STATE_FILE}",
            operation="load_state",
            error=e
        )
        return {
            "tracked_files": {},
            "last_change_time": None,
            "first_change_time": None,
            "batches": []
        }


def save_state(state: Dict) -> None:
    """Save state to JSON file."""
    STATE_FILE.parent.mkdir(parents=True, exist_ok=True)
    try:
        with open(STATE_FILE, "w", encoding="utf-8") as handle:
            json.dump(state, handle, indent=2)
    except Exception as e:
        logger.error(
            f"Error saving state: {STATE_FILE}",
            operation="save_state",
            error=e
        )


def is_excluded(file_path: str, config: Dict) -> bool:
    """Check if file path should be excluded from tracking."""
    excluded = config.get("excluded_paths", [])
    for pattern in excluded:
        if pattern in file_path or file_path.endswith(pattern.replace("*", "")):
            return True
    return False


def get_changed_files(repo_path: pathlib.Path) -> Dict[str, Dict]:
    """Get list of changed files from git."""
    changed_files = {}
    
    try:
        # Get modified and untracked files
        result = subprocess.run(
            ["git", "status", "--porcelain"],
            cwd=repo_path,
            capture_output=True,
            text=True,
            timeout=10
        )
        
        if result.returncode != 0:
            return changed_files
        
        for line in result.stdout.strip().split("\n"):
            if not line.strip():
                continue
            
            status = line[:2].strip()
            file_path = line[3:].strip()
            
            # Validate file path - skip garbage entries (command fragments, invalid paths)
            if not file_path or file_path.startswith("-"):
                continue
            if " " in file_path and not os.path.exists(repo_path / file_path):
                # If it has spaces and doesn't exist, it's likely a command fragment
                continue
            if not os.path.exists(repo_path / file_path) and status != "??":
                # Skip non-existent files unless they're untracked (??)
                continue
            
            if status in ["M", "A", "??"]:  # Modified, Added, Untracked
                # Get file stats
                try:
                    stat_result = subprocess.run(
                        ["git", "diff", "--stat", file_path],
                        cwd=repo_path,
                        capture_output=True,
                        text=True,
                        timeout=5
                    )
                    lines_changed = 0
                    if stat_result.returncode == 0:
                        # Parse diff stat output
                        for stat_line in stat_result.stdout.split("\n"):
                            if "|" in stat_line:
                                parts = stat_line.split("|")
                                if len(parts) > 1:
                                    try:
                                        lines_changed = int(parts[1].strip().split()[0])
                                    except:
                                        pass
                    
                    changed_files[file_path] = {
                        "status": status,
                        "lines_changed": lines_changed,
                        "last_modified": datetime.utcnow().isoformat() + "Z"
                    }
                except Exception as e:
                    logger.debug(
                        f"Error getting stats for {file_path}",
                        operation="get_changed_files",
                        error=e
                    )
                    changed_files[file_path] = {
                        "status": status,
                        "lines_changed": 0,
                        "last_modified": datetime.utcnow().isoformat() + "Z"
                    }
    
    except Exception as e:
        logger.warn(
            "Error getting changed files",
            operation="get_changed_files",
            error=e
        )
    
    return changed_files


def extract_feature_keywords(file_path: str) -> List[str]:
    """
    Extract feature keywords from file path.
    
    Returns list of feature keywords found (auth, tenant, billing, etc.)
    """
    file_lower = file_path.lower()
    feature_keywords = []
    
    # Feature keyword patterns
    feature_patterns = {
        "auth": [r"auth", r"login", r"logout", r"session", r"jwt", r"token"],
        "tenant": [r"tenant", r"multi.*tenant", r"organization", r"org"],
        "billing": [r"billing", r"invoice", r"payment", r"subscription", r"pricing"],
        "customer": [r"customer", r"client", r"account"],
        "job": [r"job", r"work.*order", r"service.*call"],
        "scheduling": [r"schedule", r"calendar", r"appointment", r"booking"],
        "user": [r"user", r"profile", r"settings"],
        "notification": [r"notification", r"alert", r"message", r"email"],
        "report": [r"report", r"analytics", r"dashboard", r"metric"],
        "security": [r"security", r"permission", r"role", r"access"],
    }
    
    for feature, patterns in feature_patterns.items():
        for pattern in patterns:
            if re.search(pattern, file_lower):
                feature_keywords.append(feature)
                break  # Only add feature once
    
    return feature_keywords


def group_files_logically(files: Dict[str, Dict], config: Dict) -> List[List[str]]:
    """
    Group files logically based on configuration.
    
    Supports:
    - Semantic grouping (by feature keywords: auth, tenant, billing, etc.)
    - Cross-directory grouping for same feature
    - Directory-based grouping (fallback)
    - File type grouping
    """
    groups = []
    grouping = config.get("logical_grouping", {})
    
    if not grouping.get("enabled", False):
        # No grouping, return all files as one group
        return [list(files.keys())]
    
    # Semantic grouping (by feature keywords)
    if grouping.get("group_by_semantic", False):
        semantic_groups = defaultdict(list)
        
        for file_path in files.keys():
            feature_keywords = extract_feature_keywords(file_path)
            if feature_keywords:
                # Group by primary feature (first keyword found)
                primary_feature = feature_keywords[0]
                semantic_groups[primary_feature].append(file_path)
            else:
                # Files without clear feature keywords go to "other"
                semantic_groups["other"].append(file_path)
        
        # Split large groups
        max_size = grouping.get("max_group_size", 10)
        for feature, file_list in semantic_groups.items():
            if len(file_list) <= max_size:
                groups.append(file_list)
            else:
                # Split into chunks
                for i in range(0, len(file_list), max_size):
                    groups.append(file_list[i:i + max_size])
        
        if groups:
            return groups
    
    # Group by directory (fallback if semantic grouping didn't produce groups)
    if grouping.get("group_by_directory", False):
        dir_groups = defaultdict(list)
        for file_path in files.keys():
            dir_path = str(pathlib.Path(file_path).parent)
            dir_groups[dir_path].append(file_path)
        
        # Split large groups
        max_size = grouping.get("max_group_size", 10)
        for dir_path, file_list in dir_groups.items():
            if len(file_list) <= max_size:
                groups.append(file_list)
            else:
                # Split into chunks
                for i in range(0, len(file_list), max_size):
                    groups.append(file_list[i:i + max_size])
    
    # Group by file type
    elif grouping.get("group_by_file_type", False):
        type_groups = defaultdict(list)
        for file_path in files.keys():
            file_ext = pathlib.Path(file_path).suffix
            type_groups[file_ext].append(file_path)
        
        max_size = grouping.get("max_group_size", 10)
        for file_ext, file_list in type_groups.items():
            if len(file_list) <= max_size:
                groups.append(file_list)
            else:
                for i in range(0, len(file_list), max_size):
                    groups.append(file_list[i:i + max_size])
    
    else:
        # No grouping, return all files as one group
        groups = [list(files.keys())]
    
    return groups if groups else [list(files.keys())]


def check_time_based_trigger(state: Dict, config: Dict) -> bool:
    """
    Check if time-based trigger should fire.
    
    Now includes minimum file/line requirements to prevent PR spam from inactivity alone.
    """
    time_config = config.get("time_based", {})
    if not time_config.get("enabled", False):
        return False
    
    if not state.get("last_change_time"):
        return False
    
    # Get tracked files to check minimum requirements
    tracked_files = state.get("tracked_files", {})
    if not tracked_files:
        return False
    
    # Check minimum file requirement
    min_files = time_config.get("min_files", 3)
    if len(tracked_files) < min_files:
        logger.debug(
            f"Time-based trigger blocked: only {len(tracked_files)} files (min: {min_files})",
            operation="check_time_based_trigger"
        )
        return False
    
    # Check minimum line requirement
    min_lines = time_config.get("min_lines", 50)
    total_lines = sum(f.get("lines_changed", 0) for f in tracked_files.values())
    if total_lines < min_lines:
        logger.debug(
            f"Time-based trigger blocked: only {total_lines} lines (min: {min_lines})",
            operation="check_time_based_trigger"
        )
        return False
    
    # Check test file requirement (if enabled)
    if time_config.get("require_test_file", False):
        has_test_file = any(
            "test" in f.lower() or "spec" in f.lower()
            for f in tracked_files.keys()
        )
        if not has_test_file:
            logger.debug(
                "Time-based trigger blocked: no test file found (required)",
                operation="check_time_based_trigger"
            )
            return False
    
    last_change = datetime.fromisoformat(state["last_change_time"].replace("Z", "+00:00"))
    now = datetime.utcnow()
    
    # Check inactivity threshold
    inactivity_hours = time_config.get("inactivity_hours", 4)
    if (now - last_change.replace(tzinfo=None)).total_seconds() >= inactivity_hours * 3600:
        logger.info(
            f"Inactivity threshold met: {inactivity_hours} hours ({len(tracked_files)} files, {total_lines} lines)",
            operation="check_time_based_trigger"
        )
        return True
    
    # Check max work hours
    if state.get("first_change_time"):
        first_change = datetime.fromisoformat(state["first_change_time"].replace("Z", "+00:00"))
        max_work_hours = time_config.get("max_work_hours", 8)
        if (now - first_change.replace(tzinfo=None)).total_seconds() >= max_work_hours * 3600:
            logger.info(
                f"Max work hours threshold met: {max_work_hours} hours ({len(tracked_files)} files, {total_lines} lines)",
                operation="check_time_based_trigger"
            )
            return True
    
    return False


def check_change_threshold_trigger(files: Dict[str, Dict], config: Dict) -> bool:
    """Check if change threshold trigger should fire."""
    threshold_config = config.get("change_threshold", {})
    if not threshold_config.get("enabled", False):
        return False
    
    # Check file count
    min_files = threshold_config.get("min_files", 5)
    if len(files) >= min_files:
        logger.info(
            f"File count threshold met: {len(files)} files (min: {min_files})",
            operation="check_change_threshold_trigger"
        )
        return True
    
    # Check line count
    min_lines = threshold_config.get("min_lines", 200)
    total_lines = sum(f.get("lines_changed", 0) for f in files.values())
    if total_lines >= min_lines:
        logger.info(
            f"Line count threshold met: {total_lines} lines (min: {min_lines})",
            operation="check_change_threshold_trigger"
        )
        return True
    
    # Check test file requirement
    if threshold_config.get("require_test_file", False):
        has_test_file = any(
            "test" in f.lower() or "spec" in f.lower()
            for f in files.keys()
        )
        if not has_test_file:
            return False
    
    return False


def generate_pr_title(files: Dict[str, Dict], config: Dict) -> str:
    """Generate PR title from changed files."""
    if not config.get("pr_settings", {}).get("auto_title", True):
        return "Auto-PR: Code Changes"
    
    # Analyze files to generate meaningful title
    file_paths = list(files.keys())
    
    # Try to detect feature/component name
    if file_paths:
        # Get common directory prefix
        common_prefix = os.path.commonprefix([str(pathlib.Path(f).parent) for f in file_paths])
        if common_prefix and common_prefix != ".":
            feature_name = pathlib.Path(common_prefix).name
            return f"Auto-PR: {feature_name} ({len(file_paths)} files)"
    
    # Fallback to file count
    return f"Auto-PR: {len(file_paths)} files changed"


def generate_pr_body(files: Dict[str, Dict], config: Dict) -> str:
    """Generate PR body from changed files."""
    body = "## Automated PR\n\n"
    body += "This PR was automatically created based on smart batching rules.\n\n"
    
    if config.get("pr_settings", {}).get("include_file_list", True):
        body += "### Changed Files\n\n"
        for file_path, file_data in sorted(files.items()):
            status = file_data.get("status", "?")
            lines = file_data.get("lines_changed", 0)
            body += f"- `{file_path}` ({status}, {lines} lines)\n"
        body += "\n"
    
    body += "### Summary\n\n"
    body += f"- **Files changed:** {len(files)}\n"
    total_lines = sum(f.get("lines_changed", 0) for f in files.values())
    body += f"- **Lines changed:** {total_lines}\n"
    
    # Detect file types
    file_types = set(pathlib.Path(f).suffix for f in files.keys())
    if file_types:
        body += f"- **File types:** {', '.join(sorted(file_types))}\n"
    
    body += "\n### Testing\n\n"
    body += "REWARD_SCORE will be computed automatically for this PR.\n"
    
    return body


def create_auto_pr(files: Dict[str, Dict], config: Dict, repo_path: pathlib.Path) -> Optional[str]:
    """Create automated PR using create_pr.py script."""
    logger.info(
        f"Creating auto-PR for {len(files)} files",
        operation="create_auto_pr"
    )
    
    # Generate branch name
    branch_name = f"auto-pr-{int(time.time())}"
    
    # Generate title and body
    title = generate_pr_title(files, config)
    body = generate_pr_body(files, config)
    
    # Get create_pr.py script path
    create_pr_script = pathlib.Path(__file__).resolve().parent / "create_pr.py"
    
    # Get gh path
    gh_path = r"C:\Program Files\GitHub CLI\gh.exe"
    if not os.path.exists(gh_path):
        gh_path = "gh"
    
    # CRITICAL: Authenticate GitHub CLI before any gh command
    # This prevents timeouts when gh waits for interactive login
    # First check if already authenticated (via keyring)
    try:
        auth_check = subprocess.run(
            [gh_path, "auth", "status"],
            capture_output=True,
            text=True,
            timeout=10
        )
        if auth_check.returncode == 0:
            logger.debug(
                "GitHub CLI already authenticated (keyring)",
                operation="create_auto_pr"
            )
        else:
            # Not authenticated, try to authenticate with token
            token = os.environ.get("GH_DISPATCH_PAT") or os.environ.get("GH_TOKEN") or os.environ.get("GITHUB_TOKEN")
            if not token:
                logger.error(
                    "GitHub CLI not authenticated and no token found (GH_DISPATCH_PAT, GH_TOKEN, or GITHUB_TOKEN). Cannot create PR.",
                    operation="create_auto_pr",
                    error="Missing authentication"
                )
                return None
            
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
                logger.debug(
                    "GitHub CLI authenticated successfully with token",
                    operation="create_auto_pr"
                )
            except subprocess.CalledProcessError as e:
                logger.error(
                    f"Failed to authenticate GitHub CLI: {e.stderr}",
                    operation="create_auto_pr",
                    error=e.stderr,
                    stdout=e.stdout
                )
                return None
    except Exception as e:
        logger.error(
            f"Error checking GitHub CLI authentication: {e}",
            operation="create_auto_pr",
            error=str(e)
        )
        return None
    
    # Create PR using GitHub CLI directly (simpler than calling create_pr.py)
    try:
        # First, create and checkout branch
        subprocess.run(
            ["git", "checkout", "-b", branch_name],
            cwd=repo_path,
            check=True,
            timeout=30
        )
        
        # Add all changed files
        file_list = list(files.keys())
        if file_list:
            subprocess.run(
                ["git", "add"] + file_list,
                cwd=repo_path,
                check=True,
                timeout=30
            )
        
        # Commit
        commit_message = f"{title}\n\n{body}"
        subprocess.run(
            ["git", "commit", "-m", commit_message],
            cwd=repo_path,
            check=True,
            timeout=30
        )
        
        # Push branch
        subprocess.run(
            ["git", "push", "origin", branch_name],
            cwd=repo_path,
            check=True,
            timeout=30
        )
        
        # Create PR using --body-file to avoid timeout with large PR bodies
        base_branch = config.get("pr_settings", {}).get("base_branch", "main")
        
        # Write PR body to temp file to avoid streaming issues with large bodies
        with tempfile.NamedTemporaryFile(mode='w', encoding='utf-8', suffix='.md', delete=False) as temp_body:
            temp_body.write(body)
            temp_body_path = temp_body.name
        
        try:
            result = subprocess.run(
                [gh_path, "pr", "create", "--title", title, "--body-file", temp_body_path, "--base", base_branch],
                cwd=repo_path,
                capture_output=True,
                text=True,
                timeout=120  # Increased timeout to 120 seconds
            )
        finally:
            # Clean up temp file
            try:
                os.unlink(temp_body_path)
            except Exception:
                pass
        
        if result.returncode == 0:
            pr_url = result.stdout.strip()
            pr_number = None
            # Extract PR number from URL (format: https://github.com/owner/repo/pull/123)
            if "/pull/" in pr_url:
                pr_number = pr_url.split("/pull/")[-1].split()[0]
            
            logger.info(
                f"Auto-PR created successfully: {pr_url}",
                operation="create_auto_pr",
                pr_url=pr_url,
                pr_number=pr_number
            )
            
            # Manually trigger the reward score workflow since GITHUB_TOKEN PRs don't trigger pull_request events
            if pr_number:
                try:
                    logger.info(
                        f"Triggering reward score workflow for PR #{pr_number}",
                        operation="create_auto_pr",
                        pr_number=pr_number
                    )
                    # Fix: Use -f instead of --field, and --ref main instead of branch_name
                    # The workflow file is on main branch, not on the PR branch
                    workflow_result = subprocess.run(
                        [
                            gh_path,
                            "workflow",
                            "run",
                            "swarm_compute_reward_score.yml",
                            "--ref", "main",  # Workflow file is on main branch
                            "-f", f"pr_number={pr_number}"  # Correct flag for workflow inputs
                        ],
                        cwd=repo_path,
                        capture_output=True,
                        text=True,
                        timeout=120  # Increased timeout
                    )
                    if workflow_result.returncode == 0:
                        logger.info(
                            f"Successfully triggered reward score workflow for PR #{pr_number}",
                            operation="create_auto_pr",
                            pr_number=pr_number
                        )
                    else:
                        logger.warn(
                            f"Failed to trigger workflow: {workflow_result.stderr}",
                            operation="create_auto_pr",
                            pr_number=pr_number,
                            error=workflow_result.stderr
                        )
                except Exception as e:
                    logger.warn(
                        f"Error triggering workflow (non-fatal): {e}",
                        operation="create_auto_pr",
                        pr_number=pr_number,
                        error=str(e)
                    )
            
            return pr_url
        else:
            logger.error(
                f"Failed to create PR: {result.stderr}",
                operation="create_auto_pr"
            )
            return None
    
    except Exception as e:
        logger.error(
            "Error creating auto-PR",
            operation="create_auto_pr",
            error=e
        )
        return None


def main() -> None:
    parser = argparse.ArgumentParser(description="Monitor file changes and create automated PRs")
    parser.add_argument("--check", action="store_true", help="Check once and exit")
    parser.add_argument("--watch", action="store_true", help="Watch for changes continuously")
    parser.add_argument("--force", action="store_true", help="Force PR creation even if thresholds not met")
    parser.add_argument("--interval", type=int, default=300, help="Check interval in seconds (default: 300)")
    args = parser.parse_args()
    
    # Load config and state
    config = load_config()
    state = load_state()
    repo_path = pathlib.Path(__file__).resolve().parents[2]
    
    # Get changed files
    all_changed_files = get_changed_files(repo_path)
    
    # Filter excluded files
    changed_files = {
        f: d for f, d in all_changed_files.items()
        if not is_excluded(f, config)
    }
    
    if not changed_files:
        logger.info("No changed files to track", operation="main")
        return
    
    # Update state
    now = datetime.utcnow().isoformat() + "Z"
    state["last_change_time"] = now
    if not state.get("first_change_time"):
        state["first_change_time"] = now
    
    # Merge with existing tracked files
    state["tracked_files"].update(changed_files)
    
    # Check triggers
    should_create_pr = False
    trigger_reason = ""
    
    if args.force:
        should_create_pr = True
        trigger_reason = "Manual force"
    elif check_time_based_trigger(state, config):
        should_create_pr = True
        trigger_reason = "Time-based trigger"
    elif check_change_threshold_trigger(state["tracked_files"], config):
        should_create_pr = True
        trigger_reason = "Change threshold trigger"
    
    if should_create_pr:
        # Group files logically
        file_groups = group_files_logically(state["tracked_files"], config)
        
        # Create PR for each group
        for group in file_groups:
            group_files = {f: state["tracked_files"][f] for f in group if f in state["tracked_files"]}
            pr_url = create_auto_pr(group_files, config, repo_path)
            
            if pr_url:
                logger.info(
                    f"PR created: {pr_url} (trigger: {trigger_reason})",
                    operation="main",
                    pr_url=pr_url,
                    trigger_reason=trigger_reason
                )
        
        # Reset state
        state["tracked_files"] = {}
        state["first_change_time"] = None
        state["last_change_time"] = None
    
    # Save state
    save_state(state)
    
    if args.watch:
        logger.info(
            f"Watching for changes (interval: {args.interval}s)",
            operation="main"
        )
        # In watch mode, would use file system watchers
        # For now, just exit (can be enhanced later)
        logger.info("Watch mode not fully implemented yet", operation="main")


if __name__ == "__main__":
    main()

