#!/usr/bin/env python3
"""
Daemon/service script for continuous automated PR creation monitoring.

This script runs in the background and periodically checks for file changes,
creating PRs when batching thresholds are met.
"""

import argparse
import signal
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
    parser.add_argument("--daemon", action="store_true", help="Run as daemon (background process)")
    args = parser.parse_args()
    
    # Register signal handlers
    signal.signal(signal.SIGINT, signal_handler)
    signal.signal(signal.SIGTERM, signal_handler)
    
    logger.info(
        f"Starting auto-PR daemon (interval: {args.interval}s)",
        operation="main"
    )
    
    # Load config to get check interval
    config = load_config()
    time_config = config.get("time_based", {})
    inactivity_hours = time_config.get("inactivity_hours", 4)
    check_interval = min(args.interval, inactivity_hours * 3600 // 4)  # Check at least 4 times per inactivity period
    
    while True:
        try:
            # Import here to avoid circular imports
            from monitor_changes import main as check_changes
            
            # Run check
            logger.debug("Running periodic check", operation="main")
            check_changes()
            
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


