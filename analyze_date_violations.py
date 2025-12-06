import json
import logging
import sys
from collections import defaultdict
from pathlib import Path

logger = logging.getLogger("date_violation_analysis")
if not logger.handlers:
    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s %(levelname)s %(name)s - %(message)s",
    )


def load_report(path: Path) -> dict:
    """Load the enforcer report with error handling."""
    try:
        with path.open("r", encoding="utf-8") as f:
            return json.load(f)
    except FileNotFoundError:
        logger.error("Report file not found", extra={"path": str(path)})
        sys.exit(1)
    except json.JSONDecodeError as exc:
        logger.error("Failed to parse report JSON", extra={"path": str(path)}, exc_info=exc)
        sys.exit(1)
    except Exception as exc:
        logger.error("Unexpected error reading report", extra={"path": str(path)}, exc_info=exc)
        sys.exit(1)


def main() -> None:
    report_path = Path(".cursor/enforcement/ENFORCER_REPORT.json")
    data = load_report(report_path)

    violations = data.get("violations", [])
    date_violations = [v for v in violations if v.get("id") == "VF-DATE-001"]

    logger.info("HARDCODED DATE VIOLATION ANALYSIS")
    logger.info("Total Date Violations: %s", len(date_violations))

    session_id = data.get("session_id", "unknown")
    logger.info("Session ID: %s", session_id)

    try:
        from enforcement.core.session_state import load_session
        from enforcement.core.git_utils import GitUtils, get_git_state_key
        from enforcement.core.file_scanner import is_file_modified_in_session

        project_root = Path(".")
        enforcement_dir = project_root / ".cursor" / "enforcement"

        session = load_session(enforcement_dir)
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

        from_modified_files = []
        from_unmodified_files = []
        check_errors = []

        logger.info("CHECKING FILE MODIFICATION STATUS...")

        for i, violation in enumerate(date_violations):
            file_path = violation.get("file", "")
            if not file_path:
                continue

            is_in_changed = file_path in all_changed

            try:
                is_modified = is_file_modified_in_session(
                    file_path,
                    session,
                    project_root,
                    git_utils,
                )
            except Exception as exc:  # noqa: BLE001
                is_modified = is_in_changed
                check_errors.append((file_path, str(exc)))

            violation_info = {
                "file": file_path,
                "line": violation.get("line_number"),
                "date": violation.get("description", "").split(":")[0]
                if ":" in violation.get("description", "")
                else "",
                "is_in_changed_list": is_in_changed,
                "is_modified": is_modified,
            }

            if is_modified:
                from_modified_files.append(violation_info)
            else:
                from_unmodified_files.append(violation_info)

            if (i + 1) % 100 == 0:
                logger.info("Checked %s/%s violations...", i + 1, len(date_violations))

        logger.info("Checked all %s violations", len(date_violations))

        if check_errors:
            logger.warning("Errors during check: %s", len(check_errors))
            if len(check_errors) <= 5:
                for file, error in check_errors:
                    logger.warning("Check error for %s: %s", file, error)

        logger.info(
            "From Modified Files: %s (%.1f%%)",
            len(from_modified_files),
            len(from_modified_files) / len(date_violations) * 100 if date_violations else 0,
        )
        logger.info(
            "From Unmodified Files (False Positives): %s (%.1f%%)",
            len(from_unmodified_files),
            len(from_unmodified_files) / len(date_violations) * 100 if date_violations else 0,
        )

        if from_unmodified_files:
            logger.info("FALSE POSITIVE VIOLATIONS (Top 20)")
            for i, v in enumerate(from_unmodified_files[:20], 1):
                logger.info("%s. %s:%s - %s", i, v["file"], v["line"], v["date"])
            if len(from_unmodified_files) > 20:
                logger.info("... and %s more", len(from_unmodified_files) - 20)

        modified_by_file = defaultdict(list)
        unmodified_by_file = defaultdict(list)

        for v in from_modified_files:
            modified_by_file[v["file"]].append(v)
        for v in from_unmodified_files:
            unmodified_by_file[v["file"]].append(v)

        logger.info("FALSE POSITIVE FILES (violations but not modified)")
        logger.info("Total files with false positives: %s", len(unmodified_by_file))
        for file, violations in list(unmodified_by_file.items())[:10]:
            logger.info("%s: %s violations", file, len(violations))
        if len(unmodified_by_file) > 10:
            logger.info("... and %s more files", len(unmodified_by_file) - 10)

    except Exception as exc:  # noqa: BLE001
        logger.error("Error analyzing violations", exc_info=exc)
        sys.exit(1)


if __name__ == "__main__":
    main()
