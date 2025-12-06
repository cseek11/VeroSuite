#!/usr/bin/env python3
"""Test batch status to verify fix is working."""
import logging
import sys
from pathlib import Path

from enforcement.core.git_utils import GitUtils, get_git_state_key

logger = logging.getLogger("test_batch_status")
if not logger.handlers:
    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s %(levelname)s %(name)s - %(message)s",
    )


def main() -> None:
    project_root = Path(".")
    try:
        git_utils = GitUtils(project_root)
        cache_key = get_git_state_key(project_root)
        batch_status = git_utils.get_batch_file_modification_status(cache_key)
    except Exception as exc:  # noqa: BLE001
        logger.error("Failed to load batch status", exc_info=exc)
        sys.exit(1)

    test_file = "enforcement/AGENT_REMINDERS.md"
    logger.info("Batch status for %s: %s", test_file, batch_status.get(test_file, "NOT_FOUND"))
    logger.info("Total files in batch status: %s", len(batch_status))
    logger.info("Files marked as modified: %s", sum(1 for v in batch_status.values() if v))

    violation_files = [
        "enforcement/AGENT_REMINDERS.md",
        "enforcement/ENFORCEMENT_BLOCK.md",
        "enforcement/VIOLATIONS.md",
    ]

    logger.info("Files with violations and their batch status:")
    for vfile in violation_files:
        status = batch_status.get(vfile, "NOT_FOUND")
        logger.info("  %s: %s", vfile, status)


if __name__ == "__main__":
    main()
