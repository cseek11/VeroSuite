#!/usr/bin/env python3
"""Check how many current session date violations are false positives."""
import json
import logging
import sys
from pathlib import Path

from enforcement.core.git_utils import GitUtils, get_git_state_key

logger = logging.getLogger("current_session_false_positives")
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

    date_violations = [v for v in report.get("violations", []) if v.get("id") == "VF-DATE-001"]
    total = len(date_violations)
    logger.info("Total date violations in current session: %s", total)

    project_root = Path(".")
    git_utils = GitUtils(project_root)
    cache_key = get_git_state_key(project_root)
    batch_status = git_utils.get_batch_file_modification_status(cache_key)

    cached_changed_files = git_utils.get_cached_changed_files() or {}
    untracked_files_set = set(cached_changed_files.get("untracked", []))

    false_positives = []
    legitimate = []
    unknown = []

    for violation in date_violations:
        file_path = violation.get("file", "")
        if not file_path:
            unknown.append(violation)
            continue

        normalized_path = file_path.replace("\\", "/")
        is_untracked = file_path in untracked_files_set or normalized_path in untracked_files_set

        if is_untracked:
            legitimate.append((violation, "untracked"))
        else:
            is_modified_batch = batch_status.get(normalized_path, False) or batch_status.get(
                file_path, False
            )
            if is_modified_batch:
                legitimate.append((violation, "has_content_changes"))
            else:
                false_positives.append((violation, "no_content_changes"))

    logger.info("ANALYSIS RESULTS:")
    logger.info(
        "Legitimate violations (content changes or untracked): %s",
        len(legitimate),
    )
    logger.info("False positives (no content changes): %s", len(false_positives))
    logger.info("Unknown (missing file path): %s", len(unknown))
    rate = (len(false_positives) / total * 100) if total else 0
    logger.info("False positive rate: %.1f%%", rate)

    if legitimate:
        untracked_count = sum(1 for _, reason in legitimate if reason == "untracked")
        content_changes_count = sum(
            1 for _, reason in legitimate if reason == "has_content_changes"
        )
        logger.info("Legitimate breakdown: untracked=%s, content_changes=%s", untracked_count, content_changes_count)

    if false_positives:
        logger.info("TOP FALSE POSITIVE FILES (Top 20):")
        false_positive_files = {}
        for violation, _ in false_positives:
            file_path = violation.get("file", "unknown")
            false_positive_files[file_path] = false_positive_files.get(file_path, 0) + 1

        for file_path, count in sorted(
            false_positive_files.items(), key=lambda x: x[1], reverse=True
        )[:20]:
            logger.info("%s: %s violations", file_path, count)
        logger.info("Total unique files with false positives: %s", len(false_positive_files))

        file_types = {}
        for violation, _ in false_positives:
            file_path = violation.get("file", "")
            if file_path:
                ext = Path(file_path).suffix or "(no extension)"
                file_types[ext] = file_types.get(ext, 0) + 1
        logger.info("FALSE POSITIVES BY FILE TYPE:")
        for ext, count in sorted(file_types.items(), key=lambda x: x[1], reverse=True):
            logger.info("  %s: %s violations", ext, count)

    logger.info("SUMMARY: total=%s legitimate=%s false_positives=%s", total, len(legitimate), len(false_positives))


if __name__ == "__main__":
    main()
