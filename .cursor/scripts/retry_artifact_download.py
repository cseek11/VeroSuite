#!/usr/bin/env python3
"""
Retry helper for downloading workflow artifacts via GitHub CLI.

This script is intended to be run from GitHub Actions. It attempts to download
an artifact multiple times before giving up, using exponential backoff between attempts.
"""

import os
import subprocess
import sys
import time
from pathlib import Path

try:
    from logger_util import get_logger

    logger = get_logger(context="retry_artifact_download")
except ImportError:  # pragma: no cover
    import logging

    logger = logging.getLogger("retry_artifact_download")


def artifact_exists(path: Path) -> bool:
    return path.exists()


def download_artifact(run_id: str, artifact_name: str, dest_path: Path) -> bool:
    """Attempt to download the artifact using gh CLI."""
    cmd = [
        "gh",
        "run",
        "download",
        run_id,
        "--name",
        artifact_name,
        "--dir",
        str(dest_path),
    ]
    logger.info(
        "Downloading artifact",
        operation="download_artifact",
        run_id=run_id,
        artifact=artifact_name,
    )
    result = subprocess.run(cmd, capture_output=True, text=True)
    if result.returncode != 0:
        logger.warn(
            "Download attempt failed",
            operation="download_artifact",
            stderr=result.stderr,
            stdout=result.stdout,
        )
        return False
    return True


def main() -> None:
    run_id = os.environ.get("RUN_ID")
    artifact_name = os.environ.get("ARTIFACT_NAME", "reward")
    dest_path = Path(os.environ.get("DEST_PATH", ".")).resolve()
    required_file = os.environ.get("REQUIRED_FILE", "reward.json")
    max_attempts = int(os.environ.get("MAX_ATTEMPTS", "3"))
    base_delay = int(os.environ.get("RETRY_DELAY_SECONDS", "5"))

    if not run_id:
        logger.warn("RUN_ID not provided, skipping artifact retry", operation="main")
        return

    dest_path.mkdir(parents=True, exist_ok=True)
    target_file = dest_path / required_file

    for attempt in range(1, max_attempts + 1):
        if artifact_exists(target_file):
            logger.info(
                "Artifact already present, skipping download",
                operation="main",
                path=str(target_file),
            )
            return

        if download_artifact(run_id, artifact_name, dest_path):
            if artifact_exists(target_file):
                logger.info(
                    "Artifact downloaded successfully",
                    operation="main",
                    attempts=attempt,
                )
                return

        if attempt < max_attempts:
            delay = base_delay * attempt
            logger.warn(
                "Artifact download failed, retrying",
                operation="main",
                attempt=attempt,
                next_delay=delay,
            )
            time.sleep(delay)

    print(
        f"::warning::Unable to download artifact '{artifact_name}' after {max_attempts} attempts"
    )
    logger.error(
        "Failed to download artifact after retries",
        operation="main",
        run_id=run_id,
        artifact=artifact_name,
    )


if __name__ == "__main__":
    main()


