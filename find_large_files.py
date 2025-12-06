#!/usr/bin/env python3
"""Find all files larger than 49MB in the project."""
import logging
import os
import sys
from pathlib import Path

logger = logging.getLogger("find_large_files")
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


def find_large_files(min_size_mb: int = 49):
    """Find all files larger than specified size."""
    project_root = Path(".")
    min_size_bytes = min_size_mb * 1024 * 1024

    large_files = []

    logger.info("Scanning project for files larger than %sMB...", min_size_mb)

    try:
        for root, dirs, files in os.walk(project_root):
            dirs[:] = [
                d
                for d in dirs
                if d
                not in [
                    ".git",
                    "node_modules",
                    "__pycache__",
                    ".venv",
                    "venv",
                    "dist",
                    "build",
                ]
            ]

            root_path = Path(root)
            if ".git" in root_path.parts:
                continue

            for file in files:
                file_path = root_path / file

                try:
                    if file_path.is_file():
                        size = file_path.stat().st_size
                        if size >= min_size_bytes:
                            try:
                                rel_path = file_path.relative_to(project_root)
                            except ValueError:
                                rel_path = file_path

                            large_files.append((str(rel_path), size, file_path))
                except (OSError, PermissionError):
                    continue
    except Exception as exc:  # noqa: BLE001
        logger.error("Error while scanning files", exc_info=exc)
        sys.exit(1)

    large_files.sort(key=lambda x: x[1], reverse=True)

    logger.info("Found %s file(s) larger than %sMB", len(large_files), min_size_mb)
    logger.info("# | File Path | Size | Type")

    total_size = 0
    for i, (rel_path, size, full_path) in enumerate(large_files, 1):
        ext = full_path.suffix.lower() or "(no ext)"
        total_size += size

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
        elif ext == ".ssm":
            file_type = "SSM Doc"
        else:
            file_type = ext[1:].upper() if ext != "(no ext)" else "Unknown"

        logger.info("%s | %s | %s | %s", i, rel_path, format_size(size), file_type)

    logger.info("Total size of large files: %s", format_size(total_size))

    return large_files


if __name__ == "__main__":
    large_files = find_large_files(49)

    if large_files:
        logger.info("FILE ANALYSIS")

        for rel_path, size, full_path in large_files:
            logger.info("%s", rel_path)
            logger.info("  Size: %s", format_size(size))
            logger.info("  Type: %s", full_path.suffix)
            logger.info("  Location: %s", full_path.parent)

            path_lower = rel_path.lower()
            name_lower = full_path.name.lower()

            purpose = []

            if "output" in name_lower or "output" in path_lower:
                purpose.append("Appears to be an output/log file")
            if "diagnostic" in name_lower or "test" in name_lower:
                purpose.append("Likely a diagnostic or test output file")
            if "watch" in name_lower:
                purpose.append("Appears to be a file watcher log")
            if "backup" in name_lower or ".backup" in path_lower:
                purpose.append("Backup file - can be excluded from scanning")
            if "reference" in path_lower or "docs/reference" in path_lower:
                purpose.append("Reference documentation - can be excluded")
            if "archive" in path_lower or "archived" in path_lower:
                purpose.append("Archived file - can be excluded")
            if "session" in name_lower:
                purpose.append("Session state file - may contain enforcement data")
            if "enforcer" in name_lower or "enforcement" in path_lower:
                purpose.append("Enforcement system file")
            if ".ssm.md" in path_lower:
                purpose.append("SSM (Structured System Model) documentation file")
            if "bible" in path_lower:
                purpose.append("Reference documentation (Bible) - can be excluded")

            if not purpose:
                purpose.append("Unknown purpose - needs manual review")

            logger.info("  Purpose: %s", "; ".join(purpose))

            try:
                with full_path.open("r", encoding="utf-8", errors="ignore") as f:
                    first_line = f.readline().strip()
                    if first_line:
                        logger.info("  First line: %s...", first_line[:100])
            except Exception as exc:  # noqa: BLE001
                logger.warning("  Cannot read file: %s", exc)
