#!/usr/bin/env python3
"""
Reward system health check.

Validates that reward computation and dashboard update workflows have
completed successfully within the allowable freshness window.
"""

import json
import subprocess
import sys
from datetime import datetime, timedelta, timezone
from pathlib import Path
from typing import Optional

try:
    from logger_util import get_logger

    logger = get_logger(context="reward_system_health_check")
except ImportError:  # pragma: no cover
    import logging

    logger = logging.getLogger("reward_system_health_check")


WORKFLOWS = {
    "swarm_compute_reward_score.yml": 60,  # minutes
    "update_metrics_dashboard.yml": 120,
}

METRICS_FILE = Path("docs/metrics/reward_scores.json")
MAX_METRICS_AGE_MINUTES = 120


def latest_run(workflow_file: str) -> Optional[dict]:
    cmd = [
        "gh",
        "run",
        "list",
        "--workflow",
        workflow_file,
        "--limit",
        "1",
        "--json",
        "conclusion,updatedAt,displayTitle",
    ]
    result = subprocess.run(cmd, capture_output=True, text=True, check=False)
    if result.returncode != 0:
        logger.error(
            "Failed to list workflow runs",
            operation="latest_run",
            workflow=workflow_file,
            stderr=result.stderr,
        )
        return None
    runs = json.loads(result.stdout or "[]")
    return runs[0] if runs else None


def is_recent(updated_at: str, freshness_minutes: int) -> bool:
    timestamp = datetime.fromisoformat(updated_at.replace("Z", "+00:00"))
    return timestamp >= datetime.now(timezone.utc) - timedelta(minutes=freshness_minutes)


def validate_metrics_file() -> bool:
    if not METRICS_FILE.exists():
        logger.error(
            "Metrics file missing",
            operation="validate_metrics_file",
            path=str(METRICS_FILE),
        )
        return False
    try:
        data = json.loads(METRICS_FILE.read_text())
    except json.JSONDecodeError as error:
        logger.error(
            "Invalid metrics file format",
            operation="validate_metrics_file",
            error=str(error),
        )
        return False
    last_updated = data.get("last_updated")
    if not last_updated:
        logger.error(
            "Metrics file missing last_updated field",
            operation="validate_metrics_file",
        )
        return False
    if not is_recent(last_updated, MAX_METRICS_AGE_MINUTES):
        logger.warn(
            "Metrics data is stale",
            operation="validate_metrics_file",
            last_updated=last_updated,
        )
        return False
    return True


def main() -> None:
    failures = []
    for workflow_file, freshness in WORKFLOWS.items():
        run = latest_run(workflow_file)
        if not run:
            failures.append(f"No runs found for {workflow_file}")
            continue
        if run.get("conclusion") != "success":
            failures.append(f"Latest {workflow_file} concluded with {run.get('conclusion')}")
        elif not is_recent(run["updatedAt"], freshness):
            failures.append(f"{workflow_file} has not succeeded in the last {freshness} minutes")

    if not validate_metrics_file():
        failures.append("Metrics file validation failed")

    if failures:
        for failure in failures:
            print(f"::error::{failure}")
        logger.error(
            "Reward system health check failed",
            operation="main",
            failures=failures,
        )
        sys.exit(1)

    logger.info("Reward system health check passed", operation="main")
    print("✅ Reward system health check passed")


if __name__ == "__main__":
    main()


