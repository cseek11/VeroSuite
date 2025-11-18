#!/usr/bin/env python3
"""
Diagnostic script to investigate why dashboard metrics are not updating.

Checks:
- Recent reward score workflow runs and artifacts
- Recent dashboard workflow runs and logs
- Metrics file status
- Workflow conditions and triggers
"""

import json
import subprocess
import sys
from datetime import datetime, UTC
from pathlib import Path
from typing import Dict, List, Optional

try:
    from logger_util import get_logger
    logger = get_logger(context="diagnose_dashboard")
except ImportError:
    import logging
    logger = logging.getLogger("diagnose_dashboard")


def run_gh_command(cmd: List[str], timeout: int = 30) -> tuple[str, int]:
    """Run a GitHub CLI command and return output and return code."""
    try:
        result = subprocess.run(
            cmd,
            capture_output=True,
            text=True,
            timeout=timeout
        )
        return result.stdout.strip(), result.returncode
    except Exception as e:
        logger.error(f"Error running command: {' '.join(cmd)}", operation="run_gh_command", error=str(e))
        return "", 1


def get_recent_reward_score_runs(limit: int = 5) -> List[Dict]:
    """Get recent reward score workflow runs."""
    cmd = [
        "gh", "run", "list",
        "--workflow", "swarm_compute_reward_score.yml",
        "--limit", str(limit),
        "--json", "number,conclusion,event,headBranch,createdAt,status,workflowName"
    ]
    output, code = run_gh_command(cmd)
    if code == 0 and output:
        try:
            return json.loads(output)
        except json.JSONDecodeError:
            logger.warn("Failed to parse reward score runs JSON", operation="get_recent_reward_score_runs")
            return []
    return []


def get_recent_dashboard_runs(limit: int = 5) -> List[Dict]:
    """Get recent dashboard workflow runs."""
    cmd = [
        "gh", "run", "list",
        "--workflow", "update_metrics_dashboard.yml",
        "--limit", str(limit),
        "--json", "number,conclusion,event,createdAt,status,workflowName"
    ]
    output, code = run_gh_command(cmd)
    if code == 0 and output:
        try:
            return json.loads(output)
        except json.JSONDecodeError:
            logger.warn("Failed to parse dashboard runs JSON", operation="get_recent_dashboard_runs")
            return []
    return []


def check_workflow_artifacts(run_id: int) -> Dict:
    """Check if a workflow run has artifacts."""
    cmd = ["gh", "api", f"repos/:owner/:repo/actions/runs/{run_id}/artifacts"]
    output, code = run_gh_command(cmd)
    if code == 0 and output:
        try:
            data = json.loads(output)
            artifacts = data.get("artifacts", [])
            reward_artifact = next((a for a in artifacts if a.get("name") == "reward"), None)
            return {
                "has_artifacts": len(artifacts) > 0,
                "artifact_count": len(artifacts),
                "has_reward_artifact": reward_artifact is not None,
                "reward_artifact": reward_artifact,
                "all_artifacts": [a.get("name") for a in artifacts]
            }
        except json.JSONDecodeError:
            return {"error": "Failed to parse artifacts JSON"}
    return {"error": f"Failed to get artifacts for run {run_id}"}


def get_workflow_logs(run_id: int, pattern: Optional[str] = None) -> List[str]:
    """Get workflow run logs, optionally filtered by pattern."""
    cmd = ["gh", "run", "view", str(run_id), "--log"]
    output, code = run_gh_command(cmd, timeout=60)
    if code == 0 and output:
        lines = output.split("\n")
        if pattern:
            return [line for line in lines if pattern.lower() in line.lower()]
        return lines
    return []


def check_metrics_file() -> Dict:
    """Check the metrics file status."""
    metrics_file = Path("docs/metrics/reward_scores.json")
    result = {
        "exists": metrics_file.exists(),
        "path": str(metrics_file),
        "size": 0,
        "last_modified": None,
        "content": None
    }
    
    if metrics_file.exists():
        result["size"] = metrics_file.stat().st_size
        result["last_modified"] = datetime.fromtimestamp(
            metrics_file.stat().st_mtime, UTC
        ).isoformat()
        
        try:
            with open(metrics_file, "r", encoding="utf-8") as f:
                data = json.load(f)
                result["content"] = {
                    "version": data.get("version"),
                    "last_updated": data.get("last_updated"),
                    "pr_count": len(data.get("prs", [])),
                    "aggregates": data.get("aggregates", {})
                }
        except Exception as e:
            result["error"] = str(e)
    
    return result


def check_open_auto_prs() -> List[Dict]:
    """Get open Auto-PRs."""
    cmd = [
        "gh", "pr", "list",
        "--state", "open",
        "--json", "number,title,headRefName,createdAt,state"
    ]
    output, code = run_gh_command(cmd)
    if code == 0 and output:
        try:
            prs = json.loads(output)
            auto_prs = [pr for pr in prs if pr.get("headRefName", "").startswith("auto-pr-")]
            return auto_prs
        except json.JSONDecodeError:
            return []
    return []


def main() -> None:
    """Run diagnostic checks."""
    print("=" * 80)
    print("DASHBOARD UPDATE DIAGNOSTIC")
    print("=" * 80)
    print()
    
    # 1. Check metrics file
    print("1. METRICS FILE STATUS")
    print("-" * 80)
    metrics = check_metrics_file()
    if metrics["exists"]:
        print(f"   [OK] File exists: {metrics['path']}")
        print(f"   Size: {metrics['size']} bytes")
        print(f"   Last modified: {metrics.get('last_modified', 'Unknown')}")
        if metrics.get("content"):
            content = metrics["content"]
            print(f"   Version: {content.get('version', 'Unknown')}")
            print(f"   Last updated: {content.get('last_updated', 'Unknown')}")
            print(f"   PRs in metrics: {content.get('pr_count', 0)}")
            if content.get("aggregates"):
                print(f"   Aggregates: {len(content['aggregates'])} entries")
        if metrics.get("error"):
            print(f"   [ERROR] Error reading file: {metrics['error']}")
    else:
        print(f"   [ERROR] File not found: {metrics['path']}")
    print()
    
    # 2. Check open Auto-PRs
    print("2. OPEN AUTO-PRS")
    print("-" * 80)
    auto_prs = check_open_auto_prs()
    print(f"   Found {len(auto_prs)} open Auto-PRs")
    if auto_prs:
        for pr in auto_prs[:5]:
            print(f"   - PR #{pr['number']}: {pr['title']} (branch: {pr['headRefName']})")
        if len(auto_prs) > 5:
            print(f"   ... and {len(auto_prs) - 5} more")
    print()
    
    # 3. Check recent reward score workflows
    print("3. RECENT REWARD SCORE WORKFLOWS")
    print("-" * 80)
    reward_runs = get_recent_reward_score_runs(limit=10)
    print(f"   Found {len(reward_runs)} recent runs")
    
    successful_runs = [r for r in reward_runs if r.get("conclusion") == "success"]
    skipped_runs = [r for r in reward_runs if r.get("conclusion") == "skipped"]
    failed_runs = [r for r in reward_runs if r.get("conclusion") == "failure"]
    
    print(f"   [OK] Successful: {len(successful_runs)}")
    print(f"   [SKIP] Skipped: {len(skipped_runs)}")
    print(f"   [ERROR] Failed: {len(failed_runs)}")
    print()
    
    # Check artifacts for successful runs
    if successful_runs:
        print("   Checking artifacts for successful runs:")
        for run in successful_runs[:3]:
            run_id = run.get("number")
            artifacts = check_workflow_artifacts(run_id)
            print(f"   Run #{run_id} ({run.get('headBranch', 'N/A')}):")
            if artifacts.get("has_reward_artifact"):
                reward = artifacts["reward_artifact"]
                print(f"      [OK] Has reward artifact ({reward.get('size_in_bytes', 0)} bytes)")
            else:
                print(f"      [ERROR] No reward artifact")
                print(f"      Available artifacts: {', '.join(artifacts.get('all_artifacts', []))}")
    print()
    
    # 4. Check recent dashboard workflows
    print("4. RECENT DASHBOARD WORKFLOWS")
    print("-" * 80)
    dashboard_runs = get_recent_dashboard_runs(limit=10)
    print(f"   Found {len(dashboard_runs)} recent runs")
    
    successful_dashboard = [r for r in dashboard_runs if r.get("conclusion") == "success"]
    skipped_dashboard = [r for r in dashboard_runs if r.get("conclusion") == "skipped"]
    
    print(f"   [OK] Successful: {len(successful_dashboard)}")
    print(f"   [SKIP] Skipped: {len(skipped_dashboard)}")
    print()
    
    # Check logs for recent dashboard runs
    if dashboard_runs:
        print("   Checking logs for recent dashboard runs:")
        for run in dashboard_runs[:3]:
            run_id = run.get("number")
            conclusion = run.get("conclusion", "unknown")
            event = run.get("event", "unknown")
            print(f"   Run #{run_id} ({conclusion}, {event}):")
            
            # Check for reward.json in logs
            logs = get_workflow_logs(run_id, "reward")
            reward_logs = [l for l in logs if "reward" in l.lower()][:5]
            if reward_logs:
                print(f"      Found {len(reward_logs)} log lines mentioning 'reward':")
                for log in reward_logs[:3]:
                    print(f"      - {log[:100]}...")
            else:
                print(f"      [WARN] No log lines mentioning 'reward'")
            
            # Check for metrics update in logs
            metrics_logs = get_workflow_logs(run_id, "metrics")
            if metrics_logs:
                print(f"      Found {len(metrics_logs)} log lines mentioning 'metrics':")
                for log in metrics_logs[:3]:
                    print(f"      - {log[:100]}...")
    print()
    
    # 5. Check workflow trigger chain
    print("5. WORKFLOW TRIGGER CHAIN ANALYSIS")
    print("-" * 80)
    if successful_runs and dashboard_runs:
        # Find reward runs that should have triggered dashboard
        for reward_run in successful_runs[:3]:
            reward_run_id = reward_run.get("number")
            reward_created = reward_run.get("createdAt", "")
            
            # Find dashboard runs created after this reward run
            triggered_dashboards = [
                d for d in dashboard_runs
                if d.get("createdAt", "") > reward_created
                and d.get("event") == "workflow_run"
            ]
            
            if triggered_dashboards:
                print(f"   Reward run #{reward_run_id} triggered {len(triggered_dashboards)} dashboard run(s)")
            else:
                print(f"   [WARN] Reward run #{reward_run_id} did not trigger dashboard run")
    print()
    
    # 6. Summary and recommendations
    print("6. SUMMARY AND RECOMMENDATIONS")
    print("-" * 80)
    
    issues = []
    if not metrics.get("content") or metrics["content"].get("pr_count", 0) == 0:
        issues.append("Metrics file has no PR data")
    
    if len(skipped_runs) > len(successful_runs):
        issues.append("More reward score workflows skipped than successful")
    
    if successful_runs:
        runs_without_artifacts = [
            r for r in successful_runs
            if not check_workflow_artifacts(r.get("number")).get("has_reward_artifact")
        ]
        if runs_without_artifacts:
            issues.append(f"{len(runs_without_artifacts)} successful runs missing reward artifacts")
    
    if issues:
        print("   [WARN] Issues found:")
        for issue in issues:
            print(f"      - {issue}")
    else:
        print("   [OK] No obvious issues found")
    
    print()
    print("=" * 80)


if __name__ == "__main__":
    main()

