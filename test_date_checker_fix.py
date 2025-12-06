#!/usr/bin/env python3
"""Test if date checker fix is working correctly."""
import logging
import sys
from pathlib import Path

from enforcement.core.git_utils import GitUtils, get_git_state_key

logger = logging.getLogger("test_date_checker_fix")
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

    test_files = [
        "enforcement/AGENT_REMINDERS.md",
        "enforcement/ENFORCEMENT_BLOCK.md",
        "enforcement/VIOLATIONS.md",
    ]

    logger.info("Testing batch status for files that should be skipped")

    for test_file in test_files:
        normalized = test_file.replace("\\", "/")
        is_modified = batch_status.get(normalized, False) or batch_status.get(test_file, False)
        in_batch = normalized in batch_status or test_file in batch_status

        logger.info("%s", test_file)
        logger.info("  Normalized: %s", normalized)
        logger.info("  In batch_status: %s", in_batch)
        logger.info("  Is modified (batch): %s", is_modified)
        logger.info("  Should be skipped: %s", not is_modified)

        if is_modified:
            logger.warning("  File is marked as modified but should be skipped!")
        else:
            logger.info("  File correctly identified as NOT modified (will be skipped)")

    logger.info("Batch status summary:")
    logger.info("  Total files in batch_status: %s", len(batch_status))
    logger.info("  Files marked as modified: %s", sum(1 for v in batch_status.values() if v))
    logger.info(
        "  Files NOT modified (should be skipped): %s",
        sum(1 for v in batch_status.values() if not v),
    )


if __name__ == "__main__":
    main()
