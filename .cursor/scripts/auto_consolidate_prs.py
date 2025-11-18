#!/usr/bin/env python3
"""
Standalone script to consolidate small Auto-PRs.
Can be run manually or scheduled to clean up excess PRs.
"""

import json
import pathlib
import subprocess
import sys

try:
    from logger_util import get_logger
    logger = get_logger(context="auto_consolidate_prs")
except ImportError:
    import logging
    logger = logging.getLogger("auto_consolidate_prs")

from monitor_changes import get_open_auto_prs, consolidate_small_prs, load_config


def main() -> None:
    """Main entry point for consolidation script."""
    repo_path = pathlib.Path(__file__).resolve().parents[2]
    config = load_config()
    
    logger.info("Starting Auto-PR consolidation", operation="main")
    
    # Get open Auto-PRs
    open_prs = get_open_auto_prs(repo_path)
    
    if not open_prs:
        logger.info("No open Auto-PRs to consolidate", operation="main")
        return
    
    logger.info(
        f"Found {len(open_prs)} open Auto-PRs",
        operation="main",
        pr_count=len(open_prs)
    )
    
    # Consolidate
    closed_count = consolidate_small_prs(open_prs, config, repo_path)
    
    if closed_count > 0:
        logger.info(
            f"Consolidated {closed_count} small PRs",
            operation="main",
            closed_count=closed_count
        )
    else:
        logger.info("No PRs needed consolidation", operation="main")


if __name__ == "__main__":
    main()

