#!/usr/bin/env python3
"""
Aggregate errors from reward system workflows and publish them for dashboard use.
"""

import json
import subprocess
from datetime import datetime
from pathlib import Path
from typing import List

try:
    from logger_util import get_logger

    logger = get_logger(context="aggregate_reward_errors")
except ImportError:  # pragma: no cover
    import logging

    logger = logging.getLogger("aggregate_reward_errors")


TARGET_WORKFLOWS = [
    "swarm_compute_reward_score.yml",
    "update_metrics_dashboard.yml",
]

OUTPUT_FILE = Path("docs/metrics/reward_error_log.json")
MAX_ENTRIES = 25


def list_recent_runs(workflow_file: str) -> List[dict]:
    cmd = [
        "gh",
        "run",
        "list",
        "--workflow",
        workflow_file,
        "--limit",
        "50",
        "--json",
        "databaseId,conclusion,createdAt,updatedAt,displayTitle,htmlUrl",
    ]
    result = subprocess.run(cmd, capture_output=True, text=True, check=False)
    if result.returncode != 0:
        logger.error(
            "Unable to list workflow runs",
            operation="list_recent_runs",
            workflow=workflow_file,
            stderr=result.stderr,
        )
        return []
    runs = json.loads(result.stdout or "[]")
    return [
        {
            "workflow": workflow_file,
            "run_id": run["databaseId"],
            "conclusion": run.get("conclusion"),
            "created_at": run.get("createdAt"),
            "updated_at": run.get("updatedAt"),
            "title": run.get("displayTitle"),
            "url": run.get("htmlUrl"),
        }
        for run in runs
        if run.get("conclusion") not in ("success", None)
    ]


def write_output(entries: List[dict]) -> None:
    OUTPUT_FILE.parent.mkdir(parents=True, exist_ok=True)
    payload = {
        "generated_at": datetime.utcnow().isoformat() + "Z",
        "entries": entries[:MAX_ENTRIES],
    }
    OUTPUT_FILE.write_text(json.dumps(payload, indent=2), encoding="utf-8")
    logger.info(
        "Wrote reward error log",
        operation="write_output",
        entry_count=len(payload["entries"]),
        path=str(OUTPUT_FILE),
    )


def main() -> None:
    combined_entries: List[dict] = []
    for workflow in TARGET_WORKFLOWS:
        combined_entries.extend(list_recent_runs(workflow))
    combined_entries.sort(key=lambda e: e.get("updated_at", ""), reverse=True)
    write_output(combined_entries)


if __name__ == "__main__":
    main()


