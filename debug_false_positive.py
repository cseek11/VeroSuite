#!/usr/bin/env python3
"""Debug why a specific file is generating false positives."""
import json
import logging
import sys
from pathlib import Path

from enforcement.core.git_utils import GitUtils, get_git_state_key

logger = logging.getLogger("debug_false_positive")
if not logger.handlers:
    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s %(levelname)s %(name)s - %(message)s",
    )


def load_report(path: Path) -> dict:
    try:
        with path.open("r", encoding="utf-8") as f:
            return json.load(f)
    except FileNotFoundError:
        logger.error("Report file not found", extra={"path": str(path)})
        sys.exit(1)
    except json.JSONDecodeError as exc:
        logger.error("Failed to parse report JSON", extra={"path": str(path)}, exc_info=exc)
        sys.exit(1)
    except Exception as exc:  # noqa: BLE001
        logger.error("Unexpected error reading report", extra={"path": str(path)}, exc_info=exc)
        sys.exit(1)


def main() -> None:
    report_path = Path(".cursor/enforcement/ENFORCER_REPORT.json")
    report = load_report(report_path)

    test_file = "enforcement/ENFORCEMENT_BLOCK.md"
    date_violations = [
        v for v in report.get("violations", []) if v.get("id") == "VF-DATE-001" and v.get("file") == test_file
    ]
    logger.info("Violations for %s: %s", test_file, len(date_violations))

    project_root = Path(".")
    git_utils = GitUtils(project_root)
    cache_key = get_git_state_key(project_root)
    batch_status = git_utils.get_batch_file_modification_status(cache_key)

    normalized = test_file.replace("\\", "/")
    logger.info("Original path: %s", test_file)
    logger.info("Normalized path: %s", normalized)
    logger.info("In batch_status (normalized): %s", normalized in batch_status)
    logger.info("In batch_status (original): %s", test_file in batch_status)
    logger.info("Batch status value (normalized): %s", batch_status.get(normalized, "NOT_FOUND"))
    logger.info("Batch status value (original): %s", batch_status.get(test_file, "NOT_FOUND"))

    tracked_files = git_utils.run_git_command(["ls-files", test_file])
    tracked_display = tracked_files.strip() if tracked_files else "NOT_TRACKED"
    logger.info("Git ls-files result: %s", tracked_display)

    diff_status = git_utils.run_git_command(["diff", "--name-status", "HEAD", "--", test_file])
    logger.info("Git diff --name-status: %s", diff_status.strip() if diff_status else "NO_CHANGES")

    diff_status_ignore_space = git_utils.run_git_command(
        [
            "diff",
            "--name-status",
            "--ignore-all-space",
            "--ignore-cr-at-eol",
            "--ignore-blank-lines",
            "HEAD",
            "--",
            test_file,
        ]
    )
    logger.info(
        "Git diff --name-status (ignore-all-space): %s",
        diff_status_ignore_space.strip() if diff_status_ignore_space else "NO_CHANGES",
    )

    if normalized not in batch_status and test_file not in batch_status:
        logger.info("File NOT in batch_status - no content changes; should be skipped")
    else:
        is_modified = batch_status.get(normalized, False) or batch_status.get(test_file, False)
        if is_modified:
            logger.warning("File is in batch_status and marked as modified; unexpected for false positive")
        else:
            logger.info("File in batch_status but marked as NOT modified; should be skipped")


if __name__ == "__main__":
    main()
