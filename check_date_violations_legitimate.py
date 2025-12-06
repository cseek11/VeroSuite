import json
import logging
import sys
from collections import defaultdict
from pathlib import Path

logger = logging.getLogger("date_violation_legitimate")
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
    data = load_report(report_path)

    violations = data.get("violations", [])
    date_violations = [v for v in violations if v.get("id") == "VF-DATE-001"]

    logger.info("HARDCODED DATE VIOLATION ANALYSIS")
    logger.info("Total Date Violations: %s", len(date_violations))

    try:
        from enforcement.core.git_utils import GitUtils, get_git_state_key

        project_root = Path(".")
        git_utils = GitUtils(project_root)

        cache_key = get_git_state_key(project_root)
        git_utils.update_cache(cache_key)
        changed_files = git_utils.get_cached_changed_files() or {}

        tracked_files = set(changed_files.get("tracked", []))
        untracked_files = set(changed_files.get("untracked", []))
        all_changed = tracked_files | untracked_files

        logger.info("Changed Files (tracked): %s", len(tracked_files))
        logger.info("Changed Files (untracked): %s", len(untracked_files))
        logger.info("Total Changed Files: %s", len(all_changed))

        batch_status = git_utils.get_batch_file_modification_status(cache_key)
        logger.info(
            "Files with content changes (from batch status): %s",
            len([f for f, v in batch_status.items() if v]),
        )

        from_modified_files = []
        from_unmodified_files = []
        not_in_changed_list = []

        for violation in date_violations:
            file_path = violation.get("file", "")
            if not file_path:
                continue

            normalized_path = file_path.replace("\\", "/")

            is_in_changed = file_path in all_changed or normalized_path in all_changed
            is_modified_batch = batch_status.get(normalized_path, False) or batch_status.get(
                file_path, False
            )

            violation_info = {
                "file": file_path,
                "line": violation.get("line_number"),
                "is_in_changed_list": is_in_changed,
                "is_modified_batch": is_modified_batch,
            }

            if is_modified_batch:
                from_modified_files.append(violation_info)
            elif is_in_changed:
                from_unmodified_files.append(violation_info)
            else:
                not_in_changed_list.append(violation_info)

        logger.info(
            "From Files with Content Changes (Batch Status): %s (%.1f%%)",
            len(from_modified_files),
            len(from_modified_files) / len(date_violations) * 100 if date_violations else 0,
        )
        logger.info(
            "In Changed List but No Content Changes: %s (%.1f%%)",
            len(from_unmodified_files),
            len(from_unmodified_files) / len(date_violations) * 100 if date_violations else 0,
        )
        logger.info(
            "Not in Changed List (False Positives): %s (%.1f%%)",
            len(not_in_changed_list),
            len(not_in_changed_list) / len(date_violations) * 100 if date_violations else 0,
        )

        if from_unmodified_files:
            logger.info("FILES IN CHANGED LIST BUT NO CONTENT CHANGES (Top 20)")
            by_file = defaultdict(int)
            for v in from_unmodified_files:
                by_file[v["file"]] += 1
            for file, count in sorted(by_file.items(), key=lambda x: -x[1])[:20]:
                logger.info("%s: %s violations", file, count)

        if not_in_changed_list:
            logger.info("FALSE POSITIVES - NOT IN CHANGED LIST (Top 20)")
            by_file = defaultdict(int)
            for v in not_in_changed_list:
                by_file[v["file"]] += 1
            for file, count in sorted(by_file.items(), key=lambda x: -x[1])[:20]:
                logger.info("%s: %s violations", file, count)

        modified_by_file = defaultdict(int)
        unmodified_by_file = defaultdict(int)
        false_positive_by_file = defaultdict(int)

        for v in from_modified_files:
            modified_by_file[v["file"]] += 1
        for v in from_unmodified_files:
            unmodified_by_file[v["file"]] += 1
        for v in not_in_changed_list:
            false_positive_by_file[v["file"]] += 1

        logger.info("SUMMARY BY FILE")
        logger.info("Files with confirmed modifications: %s", len(modified_by_file))
        logger.info(
            "Files with changes but no content modifications: %s", len(unmodified_by_file)
        )
        logger.info("Files not in changed list (false positives): %s", len(false_positive_by_file))

    except Exception as exc:  # noqa: BLE001
        logger.error("Error analyzing violations", exc_info=exc)
        sys.exit(1)


if __name__ == "__main__":
    main()
