#!/usr/bin/env python3
"""
Daemon/service script for continuous automated PR creation monitoring.

This script runs in the background and periodically checks for file changes,
creating PRs when batching thresholds are met. Also runs periodic tasks:
- Cleanup of old Auto-PRs (default: every 1 hour)
- Sync reward_scores.json from GitHub (default: every 24 hours as backup)
"""

import argparse
import signal
import subprocess
import sys
import time
from pathlib import Path

try:
    from logger_util import get_logger
    logger = get_logger(context="auto_pr_daemon")
except ImportError:
    import logging
    logger = logging.getLogger("auto_pr_daemon")

from monitor_changes import main as check_changes, load_config


def signal_handler(sig, frame):
    """Handle shutdown signals gracefully."""
    logger.info("Shutting down auto-PR daemon", operation="signal_handler")
    sys.exit(0)


def main() -> None:
    parser = argparse.ArgumentParser(description="Auto-PR creation daemon")
    parser.add_argument("--interval", type=int, default=300, help="Check interval in seconds (default: 300 = 5 minutes)")
    parser.add_argument("--cleanup-interval", type=int, default=3600, help="Cleanup interval in seconds (default: 3600 = 1 hour)")
    parser.add_argument("--sync-interval", type=int, default=86400, help="Reward scores sync interval in seconds (default: 86400 = 24 hours)")
    parser.add_argument("--daemon", action="store_true", help="Run as daemon (background process)")
    args = parser.parse_args()
    
    # Register signal handlers
    signal.signal(signal.SIGINT, signal_handler)
    signal.signal(signal.SIGTERM, signal_handler)
    
    logger.info(
        f"Starting auto-PR daemon (check interval: {args.interval}s, cleanup interval: {args.cleanup_interval}s, sync interval: {args.sync_interval}s)",
        operation="main"
    )
    
    # Load config to get check interval
    config = load_config()
    time_config = config.get("time_based", {})
    inactivity_hours = time_config.get("inactivity_hours", 4)
    check_interval = min(args.interval, inactivity_hours * 3600 // 4)  # Check at least 4 times per inactivity period
    
    # Track last cleanup and sync times
    last_cleanup_time = 0
    last_sync_time = 0
    
    # Get script paths
    repo_path = Path(__file__).resolve().parents[2]
    sync_script = Path(__file__).resolve().parent / "sync_reward_scores.py"
    
    while True:
        try:
            # Import here to avoid circular imports
            from monitor_changes import main as check_changes
            
            # Run PR creation check
            logger.debug("Running periodic check", operation="main")
            check_changes()
            
            # Check if cleanup should run
            current_time = time.time()
            if current_time - last_cleanup_time >= args.cleanup_interval:
                try:
                    logger.info("Running Auto-PR cleanup", operation="main")
                    from close_old_auto_prs import main as cleanup_auto_prs
                    cleanup_auto_prs()
                    last_cleanup_time = current_time
                except Exception as e:
                    logger.error(
                        "Error running cleanup (non-fatal)",
                        operation="main",
                        error=str(e)
                    )
                    # Don't exit on cleanup errors - it's not critical
            
            # Check if reward scores sync should run (24-hour backup sync)
            if current_time - last_sync_time >= args.sync_interval:
                try:
                    logger.info("Running reward scores sync (24-hour backup)", operation="main")
                    if sync_script.exists():
                        sync_result = subprocess.run(
                            [sys.executable, str(sync_script)],
                            cwd=repo_path,
                            capture_output=True,
                            text=True,
                            timeout=30
                        )
                        if sync_result.returncode == 0:
                            logger.info(
                                "Successfully synced reward_scores.json",
                                operation="main",
                                stdout=sync_result.stdout[:200] if sync_result.stdout else None
                            )
                        else:
                            logger.warn(
                                f"Reward scores sync completed with warnings: {sync_result.stderr[:200] if sync_result.stderr else 'unknown error'}",
                                operation="main",
                                returncode=sync_result.returncode
                            )
                        last_sync_time = current_time
                    else:
                        logger.warn(
                            f"Sync script not found: {sync_script}",
                            operation="main",
                            script_path=str(sync_script)
                        )
                        # Still update time to avoid repeated warnings
                        last_sync_time = current_time
                except subprocess.TimeoutExpired:
                    logger.warn("Reward scores sync timed out (non-fatal)", operation="main")
                    last_sync_time = current_time  # Update time to avoid repeated timeouts
                except Exception as e:
                    logger.error(
                        "Error running reward scores sync (non-fatal)",
                        operation="main",
                        error=str(e)
                    )
                    # Don't exit on sync errors - it's a backup mechanism
                    # Update time to avoid repeated errors
                    last_sync_time = current_time
            
            # Sleep until next check
            time.sleep(check_interval)
        
        except KeyboardInterrupt:
            logger.info("Received interrupt, shutting down", operation="main")
            break
        except Exception as e:
            logger.error(
                "Error in daemon loop",
                operation="main",
                error=e
            )
            time.sleep(check_interval)  # Wait before retrying


if __name__ == "__main__":
    main()

