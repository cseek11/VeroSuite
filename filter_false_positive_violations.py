#!/usr/bin/env python3
"""
Filter false positive date violations from ENFORCER_REPORT.json.

This script removes violations from files that have no actual content changes
(whitespace-only or move-only changes) based on batch status.
"""
import json
import logging
import sys
from pathlib import Path

from enforcement.core.git_utils import GitUtils, get_git_state_key

logger = logging.getLogger("filter_false_positive_violations")
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
        logger.error("Report not found", extra={"path": str(path)})
        sys.exit(1)
    except json.JSONDecodeError as exc:
        logger.error("Failed to parse report JSON", extra={"path": str(path)}, exc_info=exc)
        sys.exit(1)
    except Exception as exc:  # noqa: BLE001
        logger.error("Unexpected error reading report", extra={"path": str(path)}, exc_info=exc)
        sys.exit(1)


def filter_false_positives() -> None:
    """Filter false positive violations from the report."""
    report_path = Path(".cursor/enforcement/ENFORCER_REPORT.json")
    data = load_report(report_path)

    violations = data.get("violations", [])
    date_violations = [v for v in violations if v.get("id") == "VF-DATE-001"]
    other_violations = [v for v in violations if v.get("id") != "VF-DATE-001"]

    logger.info("Total violations: %s", len(violations))
    logger.info("Date violations: %s", len(date_violations))
    logger.info("Other violations: %s", len(other_violations))

    project_root = Path(".")
    git_utils = GitUtils(project_root)
    cache_key = get_git_state_key(project_root)
    batch_status = git_utils.get_batch_file_modification_status(cache_key)

    cached_changed_files = git_utils.get_cached_changed_files() or {}
    untracked_files_set = set(cached_changed_files.get("untracked", []))

    legitimate_violations = []
    false_positives = []

    for violation in date_violations:
        file_path = violation.get("file", "")
        if not file_path:
            legitimate_violations.append(violation)
            continue

        normalized_path = file_path.replace("\\", "/")
        is_untracked = file_path in untracked_files_set or normalized_path in untracked_files_set

        if is_untracked:
            legitimate_violations.append(violation)
        else:
            is_modified = batch_status.get(normalized_path, False) or batch_status.get(
                file_path, False
            )
            if is_modified:
                legitimate_violations.append(violation)
            else:
                false_positives.append(violation)

    reduction_pct = (
        len(false_positives) / len(date_violations) * 100 if date_violations else 0
    )
    logger.info("Filtered results:")
    logger.info("  Legitimate violations: %s", len(legitimate_violations))
    logger.info("  False positives: %s", len(false_positives))
    logger.info("  Reduction: %s violations (%.1f%%)", len(false_positives), reduction_pct)

    filtered_violations = legitimate_violations + other_violations
    data["violations"] = filtered_violations
    data["summary"]["blocking_count"] = len(
        [v for v in filtered_violations if v.get("severity") == "BLOCKING"]
    )
    data["summary"]["warning_count"] = len(
        [v for v in filtered_violations if v.get("severity") == "WARNING"]
    )

    backup_path = report_path.with_suffix(".json.backup")
    try:
        if not backup_path.exists():
            report_path.rename(backup_path)
            logger.info("Backed up original report to: %s", backup_path)
    except Exception as exc:  # noqa: BLE001
        logger.error("Failed to backup original report", exc_info=exc, extra={"backup": str(backup_path)})
        sys.exit(1)

    try:
        with report_path.open("w", encoding="utf-8") as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        logger.info("Saved filtered report to: %s", report_path)
    except Exception as exc:  # noqa: BLE001
        logger.error("Failed to write filtered report", exc_info=exc, extra={"path": str(report_path)})
        sys.exit(1)

    logger.info("False positive files (top 10):")
    false_positive_files = {}
    for v in false_positives:
        file_path = v.get("file", "")
        false_positive_files[file_path] = false_positive_files.get(file_path, 0) + 1

    for file_path, count in sorted(false_positive_files.items(), key=lambda x: x[1], reverse=True)[
        :10
    ]:
        logger.info("  %s: %s violations", file_path, count)


if __name__ == "__main__":
    filter_false_positives()
