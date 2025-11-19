#!/usr/bin/env python3
"""
Sync reward_scores.json from GitHub main branch to local repository.

This script ensures the local reward_scores.json file is up-to-date with
the version on GitHub's main branch, which is automatically updated by
the update_metrics_dashboard.yml workflow.

Usage:
    python sync_reward_scores.py [--force]
    
Options:
    --force    Force sync even if local file appears up-to-date
"""

import argparse
import pathlib
import subprocess
import sys

# Import structured logger
try:
    from logger_util import get_logger
    logger = get_logger(context="sync_reward_scores")
except ImportError:
    import logging
    logger = logging.getLogger("sync_reward_scores")

REWARD_SCORES_PATH = pathlib.Path(__file__).resolve().parents[2] / "docs" / "metrics" / "reward_scores.json"
REPO_PATH = REWARD_SCORES_PATH.resolve().parents[2]


def sync_reward_scores(force: bool = False) -> bool:
    """
    Sync reward_scores.json from origin/main.
    
    Returns True if sync was successful, False otherwise.
    """
    try:
        # Check if we're in a git repository
        result = subprocess.run(
            ["git", "rev-parse", "--git-dir"],
            cwd=REPO_PATH,
            capture_output=True,
            text=True,
            timeout=5
        )
        if result.returncode != 0:
            logger.error("Not in a git repository", operation="sync_reward_scores")
            return False
        
        # Fetch latest from origin
        logger.info("Fetching latest from origin/main...", operation="sync_reward_scores")
        fetch_result = subprocess.run(
            ["git", "fetch", "origin", "main"],
            cwd=REPO_PATH,
            capture_output=True,
            text=True,
            timeout=15
        )
        
        if fetch_result.returncode != 0:
            logger.error(
                f"Failed to fetch from origin/main: {fetch_result.stderr}",
                operation="sync_reward_scores",
                error=fetch_result.stderr
            )
            return False
        
        # Check if file exists on origin/main
        check_result = subprocess.run(
            ["git", "cat-file", "-e", "origin/main:docs/metrics/reward_scores.json"],
            cwd=REPO_PATH,
            capture_output=True,
            text=True,
            timeout=5
        )
        
        if check_result.returncode != 0:
            logger.error(
                "reward_scores.json does not exist on origin/main",
                operation="sync_reward_scores"
            )
            return False
        
        # Check if sync is needed (unless forced)
        if not force:
            # Get last commit time of file on origin/main
            origin_time_result = subprocess.run(
                ["git", "log", "-1", "--format=%ct", "origin/main", "--", "docs/metrics/reward_scores.json"],
                cwd=REPO_PATH,
                capture_output=True,
                text=True,
                timeout=5
            )
            
            if origin_time_result.returncode == 0 and origin_time_result.stdout.strip():
                origin_timestamp = int(origin_time_result.stdout.strip())
                
                # Get local file modification time
                if REWARD_SCORES_PATH.exists():
                    local_timestamp = int(REWARD_SCORES_PATH.stat().st_mtime)
                    
                    # If local is up-to-date (within 1 second), skip sync
                    if abs(origin_timestamp - local_timestamp) <= 1:
                        logger.info(
                            "Local reward_scores.json is up-to-date",
                            operation="sync_reward_scores",
                            local_timestamp=local_timestamp,
                            origin_timestamp=origin_timestamp
                        )
                        return True
        
        # Perform sync
        logger.info("Syncing reward_scores.json from origin/main...", operation="sync_reward_scores")
        sync_result = subprocess.run(
            ["git", "checkout", "origin/main", "--", "docs/metrics/reward_scores.json"],
            cwd=REPO_PATH,
            capture_output=True,
            text=True,
            timeout=10
        )
        
        if sync_result.returncode == 0:
            logger.info(
                "Successfully synced reward_scores.json from origin/main",
                operation="sync_reward_scores",
                file_path=str(REWARD_SCORES_PATH)
            )
            
            # Show file stats
            if REWARD_SCORES_PATH.exists():
                import json
                with open(REWARD_SCORES_PATH, "r", encoding="utf-8") as f:
                    data = json.load(f)
                scores = data.get("scores", [])
                logger.info(
                    f"File synced: {len(scores)} PR scores, last updated: {data.get('last_updated', 'unknown')}",
                    operation="sync_reward_scores",
                    score_count=len(scores)
                )
            
            return True
        else:
            logger.error(
                f"Failed to sync reward_scores.json: {sync_result.stderr}",
                operation="sync_reward_scores",
                error=sync_result.stderr
            )
            return False
            
    except subprocess.TimeoutExpired:
        logger.error("Sync operation timed out", operation="sync_reward_scores")
        return False
    except FileNotFoundError:
        logger.error("Git not found. Please ensure git is installed and in PATH", operation="sync_reward_scores")
        return False
    except Exception as e:
        logger.error(
            f"Error syncing reward_scores.json: {e}",
            operation="sync_reward_scores",
            error=str(e)
        )
        return False


def main() -> None:
    parser = argparse.ArgumentParser(description="Sync reward_scores.json from GitHub main branch")
    parser.add_argument(
        "--force",
        action="store_true",
        help="Force sync even if local file appears up-to-date"
    )
    
    args = parser.parse_args()
    
    success = sync_reward_scores(force=args.force)
    
    if success:
        print("✓ reward_scores.json synced successfully")
        sys.exit(0)
    else:
        print("✗ Failed to sync reward_scores.json")
        sys.exit(1)


if __name__ == "__main__":
    main()





