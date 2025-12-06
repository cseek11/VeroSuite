#!/usr/bin/env python3
"""
Analyze file sizes of files scanned by the enforcer.
Shows breakdown of all files and highlights files > 500KB.
"""
import logging
import sys
from pathlib import Path
from collections import defaultdict

from enforcement.core.git_utils import GitUtils, get_git_state_key

logger = logging.getLogger("analyze_scanned_file_sizes")
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


def analyze_file_sizes() -> None:
    """Analyze file sizes of scanned files."""
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

    logger.info("SCANNED FILE SIZE ANALYSIS")
    logger.info("Total files scanned: %s (tracked=%s, untracked=%s)", len(all_files), len(tracked_files), len(untracked_files))

    file_sizes = []
    size_by_extension = defaultdict(lambda: {"count": 0, "total_size": 0, "files": []})
    large_files = []  # Files > 500KB

    for file_path_str in all_files:
        file_path = project_root / file_path_str
        if not file_path.exists() or file_path.is_dir():
            continue
        try:
            size = file_path.stat().st_size
            file_sizes.append((file_path_str, size))

            ext = file_path.suffix.lower() or "(no extension)"
            size_by_extension[ext]["count"] += 1
            size_by_extension[ext]["total_size"] += size
            size_by_extension[ext]["files"].append((file_path_str, size))

            if size > 500 * 1024:  # 500KB
                large_files.append((file_path_str, size))
        except (OSError, PermissionError):
            continue

    file_sizes.sort(key=lambda x: x[1], reverse=True)
    large_files.sort(key=lambda x: x[1], reverse=True)

    total_size = sum(size for _, size in file_sizes)
    avg_size = total_size / len(file_sizes) if file_sizes else 0
    median_size = (
        sorted([size for _, size in file_sizes])[len(file_sizes) // 2] if file_sizes else 0
    )

    logger.info("Total size of all scanned files: %s", format_size(total_size))
    logger.info("Average file size: %s", format_size(avg_size))
    logger.info("Median file size: %s", format_size(median_size))

    logger.info("FILES LARGER THAN 500KB (%s files)", len(large_files))

    if large_files:
        total_large_size = sum(size for _, size in large_files)
        pct_total = (total_large_size / total_size * 100) if total_size else 0
        logger.info("Total size of large files: %s (%.1f%% of total)", format_size(total_large_size), pct_total)
        logger.info("Top 20 largest files:")

        for file_path_str, size in large_files[:20]:
            pct = (size / total_size * 100) if total_size > 0 else 0
            display_path = file_path_str if len(file_path_str) <= 70 else "..." + file_path_str[-67:]
            logger.info("%s | %s | %5.2f%%", display_path, format_size(size), pct)

        if len(large_files) > 20:
            logger.info("... and %s more large files", len(large_files) - 20)
    else:
        logger.info("No files larger than 500KB found")

    logger.info("BREAKDOWN BY FILE EXTENSION (top 20 by total size)")
    logger.info("Extension | Count | Total Size | Avg Size | %% of Total")

    sorted_extensions = sorted(
        size_by_extension.items(),
        key=lambda x: x[1]["total_size"],
        reverse=True,
    )

    for ext, data in sorted_extensions[:20]:
        avg = data["total_size"] / data["count"] if data["count"] > 0 else 0
        pct = (data["total_size"] / total_size * 100) if total_size > 0 else 0
        logger.info(
            "%s | %s | %s | %s | %5.2f%%",
            ext,
            data["count"],
            format_size(data["total_size"]),
            format_size(avg),
            pct,
        )

    logger.info("SIZE DISTRIBUTION")
    size_ranges = [
        (0, 1 * 1024, "0-1 KB"),
        (1 * 1024, 10 * 1024, "1-10 KB"),
        (10 * 1024, 100 * 1024, "10-100 KB"),
        (100 * 1024, 500 * 1024, "100-500 KB"),
        (500 * 1024, 1 * 1024 * 1024, "500 KB-1 MB"),
        (1 * 1024 * 1024, 5 * 1024 * 1024, "1-5 MB"),
        (5 * 1024 * 1024, float("inf"), "> 5 MB"),
    ]

    for min_size, max_size, label in size_ranges:
        matching = [(f, s) for f, s in file_sizes if min_size <= s < max_size]
        count = len(matching)
        total = sum(s for _, s in matching)
        pct_files = (count / len(file_sizes) * 100) if file_sizes else 0
        pct_size = (total / total_size * 100) if total_size > 0 else 0
        logger.info(
            "%s | count=%s total=%s files%%=%5.2f size%%=%5.2f",
            label,
            count,
            format_size(total),
            pct_files,
            pct_size,
        )


if __name__ == "__main__":
    analyze_file_sizes()


