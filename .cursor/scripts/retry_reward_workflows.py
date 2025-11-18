#!/usr/bin/env python3
"""
Automatically retry failed `Swarm - Compute Reward Score` workflow runs.

This script finds the most recent failed runs and triggers a rerun for each
until the maximum attempt threshold is reached.
"""

import json
import os
import subprocess
import sys
from datetime import datetime, timedelta, timezone
from typing import List

try:
    from logger_util import get_logger

    logger = get_logger(context="retry_reward_workflows")
except ImportError:  # pragma: no cover
    import logging

    logger = logging.getLogger("retry_reward_workflows")


MAX_ATTEMPTS = int(os.environ.get("MAX_RETRY_ATTEMPTS", "3"))
LOOKBACK_MINUTES = int(os.environ.get("LOOKBACK_MINUTES", "180"))


def list_failed_runs() -> List[dict]:
    cmd = [
        "gh",
        "run",
        "list",
        "--workflow",
        "swarm_compute_reward_score.yml",
        "--limit",
        "20",
        "--json",
        "databaseId,conclusion,status,runAttempt,headBranch,displayTitle,updatedAt",
    ]
    result = subprocess.run(cmd, capture_output=True, text=True, check=False)
    if result.returncode != 0:
        logger.error(
            "Unable to list workflow runs",
            operation="list_failed_runs",
            stderr=result.stderr,
        )
        raise RuntimeError("gh run list failed")
    runs = json.loads(result.stdout or "[]")
    cutoff = datetime.now(timezone.utc) - timedelta(minutes=LOOKBACK_MINUTES)
    return [
        run
        for run in runs
        if run.get("conclusion") not in ("success", None)
        and datetime.fromisoformat(run["updatedAt"].replace("Z", "+00:00")) >= cutoff
    ]


def rerun(run_id: int) -> bool:
    cmd = ["gh", "run", "rerun", str(run_id)]
    result = subprocess.run(cmd, capture_output=True, text=True, check=False)
    if result.returncode != 0:
        logger.error(
            "Failed to rerun workflow",
            operation="rerun",
            run_id=run_id,
            stderr=result.stderr,
        )
        return False
    logger.info("Triggered workflow rerun", operation="rerun", run_id=run_id)
    return True


def main() -> None:
    try:
        runs = list_failed_runs()
    except RuntimeError:
        print("::warning::Unable to retrieve workflow runs for retry")
        return

    reran = 0
    for run in runs:
        attempt = run.get("runAttempt") or 1
        run_id = run["databaseId"]
        if attempt >= MAX_ATTEMPTS:
            logger.warn(
                "Skipping run with max attempts reached",
                operation="main",
                run_id=run_id,
                attempt=attempt,
            )
            continue
        if rerun(run_id):
            reran += 1

    logger.info(
        "Retry summary",
        operation="main",
        attempted=len(runs),
        reran=reran,
    )
    if reran == 0:
        print("No failed reward workflows required retries")


if __name__ == "__main__":
    main()


