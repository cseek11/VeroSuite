#!/usr/bin/env python3
"""Show all files larger than 500KB with full details."""
import logging
import sys
from pathlib import Path

from enforcement.core.git_utils import GitUtils, get_git_state_key

logger = logging.getLogger("show_large_files")
if not logger.handlers:
    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s %(levelname)s %(name)s - %(message)s",
    )


def format_size(size_bytes: float) -> str:
    """Format file size in human-readable format."""
    for unit in ["B", "KB", "MB", "GB"]:
        if size_bytes < 1024.0:
            return f"{size_bytes:.2f} {unit}"
        size_bytes /= 1024.0
    return f"{size_bytes:.2f} TB"


def show_large_files() -> None:
    """Show all files larger than 500KB."""
    project_root = Path(".")
    try:
        git_utils = GitUtils(project_root)
        cache_key = get_git_state_key(project_root)
        git_utils.update_cache(cache_key)
        changed_files = git_utils.get_cached_changed_files() or {}
    except Exception as exc:  # noqa: BLE001
        logger.error("Failed to load git change data", exc_info=exc)
        sys.exit(1)

    tracked_files = changed_files.get("tracked", [])
    untracked_files = changed_files.get("untracked", [])
    all_files = tracked_files + untracked_files

    if not all_files:
        logger.info("No changed files found")
        return

    large_files = []

    for file_path_str in all_files:
        file_path = project_root / file_path_str

        if not file_path.exists() or file_path.is_dir():
            continue

        try:
            size = file_path.stat().st_size
            if size > 500 * 1024:  # 500KB
                large_files.append((file_path_str, size))
        except (OSError, PermissionError):
            continue

    large_files.sort(key=lambda x: x[1], reverse=True)

    logger.info("ALL FILES LARGER THAN 500KB (%s files)", len(large_files))
    logger.info("# | File Path | Size | Type")

    total_size = sum(size for _, size in large_files)

    for i, (file_path_str, size) in enumerate(large_files, 1):
        file_path = Path(file_path_str)
        ext = file_path.suffix.lower() or "(no ext)"

        if ext == ".txt":
            file_type = "Text/Log"
        elif ext == ".json":
            file_type = "JSON"
        elif ext == ".md":
            file_type = "Markdown"
        elif ext == ".backup":
            file_type = "Backup"
        elif ext == ".py":
            file_type = "Python"
        else:
            file_type = ext[1:].upper() if ext != "(no ext)" else "Unknown"

        logger.info("%s | %s | %s | %s", i, file_path_str, format_size(size), file_type)

    logger.info("Total: %s", format_size(total_size))

    logger.info("BREAKDOWN BY FILE TYPE")

    by_type = {}
    for file_path_str, size in large_files:
        file_path = Path(file_path_str)
        ext = file_path.suffix.lower() or "(no ext)"

        if ext == ".txt":
            file_type = "Text/Log Files"
        elif ext == ".json":
            file_type = "JSON Files"
        elif ext == ".md":
            file_type = "Markdown Files"
        elif ext == ".backup":
            file_type = "Backup Files"
        elif ext == ".py":
            file_type = "Python Files"
        else:
            file_type = f"{ext[1:].upper()} Files" if ext != "(no ext)" else "Other Files"

        if file_type not in by_type:
            by_type[file_type] = {"count": 0, "total_size": 0, "files": []}

        by_type[file_type]["count"] += 1
        by_type[file_type]["total_size"] += size
        by_type[file_type]["files"].append((file_path_str, size))

    logger.info("Type | Count | Total Size | Avg Size | %% of Large Files")

    for file_type, data in sorted(by_type.items(), key=lambda x: x[1]["total_size"], reverse=True):
        avg = data["total_size"] / data["count"] if data["count"] > 0 else 0
        pct = (data["total_size"] / total_size * 100) if total_size > 0 else 0
        logger.info(
            "%s | %s | %s | %s | %5.2f%%",
            file_type,
            data["count"],
            format_size(data["total_size"]),
            format_size(avg),
            pct,
        )


if __name__ == "__main__":
    show_large_files()
