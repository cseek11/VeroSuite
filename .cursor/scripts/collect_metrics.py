#!/usr/bin/env python3
"""
Collect and aggregate REWARD_SCORE metrics from PRs.

Reads reward.json artifacts and aggregates metrics for dashboard visualization.
"""

import argparse
import json
import os
import sys
import subprocess
from datetime import datetime, timedelta
from pathlib import Path
from typing import Dict, List, Optional

# Import structured logger
try:
    from logger_util import get_logger
    logger = get_logger(context="collect_metrics")
except ImportError:
    # Fallback if logger_util not available (should not happen)
    import logging
    logger = logging.getLogger("collect_metrics")


METRICS_FILE = Path(__file__).resolve().parents[0].parents[0] / "docs" / "metrics" / "reward_scores.json"


def load_metrics(metrics_file: Optional[Path] = None) -> Dict:
    """Load existing metrics from JSON file."""
    target_file = Path(metrics_file) if metrics_file else METRICS_FILE
    if target_file.exists():
        try:
            with open(target_file, "r", encoding="utf-8") as handle:
                return json.load(handle)
        except (json.JSONDecodeError, FileNotFoundError) as e:
            logger.warn(
                f"Could not load metrics file: {target_file}",
                operation="load_metrics",
                error=e,
                metrics_file=str(target_file)
            )
            pass
    return {
        "version": "1.0",
        "last_updated": datetime.utcnow().isoformat() + "Z",
        "scores": [],
        "aggregates": {
            "total_prs": 0,
            "average_score": 0.0,
            "score_distribution": {},
            "trends": [],
            "category_performance": {},
            "anti_patterns": []
        }
    }


def save_metrics(metrics: Dict, metrics_file: Optional[Path] = None) -> None:
    """Save metrics to JSON file."""
    target_file = Path(metrics_file) if metrics_file else METRICS_FILE
    target_file.parent.mkdir(parents=True, exist_ok=True)
    metrics["last_updated"] = datetime.utcnow().isoformat() + "Z"
    with open(target_file, "w", encoding="utf-8") as handle:
        json.dump(metrics, handle, indent=2)


def get_reward_artifacts(repo_path: Path, days: int = 30) -> List[Dict]:
    """Get reward artifacts from recent PRs."""
    artifacts = []
    
    try:
        # Get recent PRs using GitHub CLI
        result = subprocess.run(
            ["gh", "pr", "list", "--state", "all", "--limit", "100", "--json", "number,mergedAt,closedAt"],
            cwd=repo_path,
            capture_output=True,
            text=True,
            timeout=30
        )
        
        if result.returncode == 0:
            prs = json.loads(result.stdout)
            for pr in prs:
                pr_num = str(pr.get("number", ""))
                # Try to get reward artifact (would need artifact API, simplified here)
                # In real implementation, would fetch from GitHub Actions artifacts
                artifacts.append({
                    "pr": pr_num,
                    "merged_at": pr.get("mergedAt"),
                    "closed_at": pr.get("closedAt")
                })
    except (subprocess.TimeoutExpired, FileNotFoundError, json.JSONDecodeError) as e:
        logger.warn(
            "Could not get PR artifacts",
            operation="get_pr_artifacts",
            error=e,
            pr_num=pr_num
        )
        pass
    
    return artifacts


def get_pr_info(pr_num: str, repo_path: Path) -> Dict:
    """Get PR information including author and files changed."""
    info = {
        "author": None,
        "files_changed": 0,
        "coverage_delta": None
    }
    
    try:
        # Get PR info using GitHub CLI
        result = subprocess.run(
            ["gh", "pr", "view", pr_num, "--json", "author,changedFiles"],
            cwd=repo_path,
            capture_output=True,
            text=True,
            timeout=10
        )
        
        if result.returncode == 0:
            pr_data = json.loads(result.stdout)
            info["author"] = pr_data.get("author", {}).get("login")
            info["files_changed"] = pr_data.get("changedFiles", 0)
    except (subprocess.TimeoutExpired, FileNotFoundError, json.JSONDecodeError) as e:
        logger.warn(
            "Could not get PR info",
            operation="get_pr_info",
            error=e,
            pr_num=pr_num
        )
        pass
    
    return info


def add_score_entry(metrics: Dict, pr_num: str, score: int, breakdown: Dict, metadata: Dict, repo_path: Optional[Path] = None, file_scores: Optional[Dict] = None) -> None:
    """Add a new score entry to metrics with enhanced data including file-level scores."""
    # Get PR info if repo path provided
    pr_info = {}
    if repo_path:
        pr_info = get_pr_info(pr_num, repo_path)
    
    entry = {
        "pr": pr_num,
        "score": score,
        "breakdown": breakdown,
        "timestamp": metadata.get("computed_at", datetime.utcnow().isoformat() + "Z"),
        "rubric_version": metadata.get("rubric_version", "unknown"),
        "author": pr_info.get("author"),
        "files_changed": pr_info.get("files_changed", 0),
        "coverage_delta": pr_info.get("coverage_delta"),
        "file_scores": file_scores if file_scores else {}  # File-level scoring breakdown
    }
    
    # Add to scores list
    if "scores" not in metrics:
        metrics["scores"] = []
    
    # Check if PR already exists, update if so
    existing_index = None
    for i, existing in enumerate(metrics["scores"]):
        if existing.get("pr") == pr_num:
            existing_index = i
            break
    
    if existing_index is not None:
        metrics["scores"][existing_index] = entry
    else:
        metrics["scores"].append(entry)
    
    # Keep only last 1000 entries
    metrics["scores"] = metrics["scores"][-1000:]
    
    # Sort by timestamp (most recent first) after adding/updating
    metrics["scores"].sort(key=lambda x: x.get("timestamp", ""), reverse=True)


def calculate_aggregates(metrics: Dict) -> Dict:
    """Calculate aggregate metrics including category performance and anti-patterns."""
    scores = metrics.get("scores", [])

    if not scores:
        return {
            "total_prs": 0,
            "average_score": 0.0,
            "score_distribution": {},
            "trends": [],
            "category_performance": {},
            "anti_patterns": []
        }

    # Calculate total and average
    total_prs = len(scores)
    total_score = sum(entry.get("score", 0) for entry in scores)
    average_score = total_score / total_prs if total_prs > 0 else 0.0
    
    # Calculate category performance
    category_totals = {
        "tests": 0,
        "bug_fix": 0,
        "docs": 0,
        "performance": 0,
        "security": 0,
        "penalties": 0
    }
    category_counts = {key: 0 for key in category_totals}
    
    for entry in scores:
        breakdown = entry.get("breakdown", {})
        for category in category_totals:
            if category in breakdown:
                category_totals[category] += breakdown[category]
                if breakdown[category] != 0:
                    category_counts[category] += 1
    
    category_performance = {}
    for category in category_totals:
        avg = category_totals[category] / total_prs if total_prs > 0 else 0.0
        category_performance[category] = {
            "average": round(avg, 2),
            "total": category_totals[category],
            "count": category_counts[category]
        }
    
    # Track anti-patterns (low scores <= 0)
    anti_patterns = []
    for entry in scores:
        if entry.get("score", 0) <= 0:
            anti_patterns.append({
                "pr": entry.get("pr"),
                "score": entry.get("score"),
                "timestamp": entry.get("timestamp"),
                "breakdown": entry.get("breakdown", {}),
                "penalties": entry.get("breakdown", {}).get("penalties", 0)
            })
    
    # Keep only last 50 anti-patterns
    anti_patterns = sorted(anti_patterns, key=lambda x: x.get("timestamp", ""), reverse=True)[:50]
    
    # Calculate score distribution
    distribution = {}
    for entry in scores:
        score = entry.get("score", 0)
        score_range = get_score_range(score)
        distribution[score_range] = distribution.get(score_range, 0) + 1
    
    # Calculate trends (last 30 days)
    now = datetime.utcnow()
    thirty_days_ago = now - timedelta(days=30)
    
    recent_scores = []
    for entry in scores:
        try:
            timestamp = datetime.fromisoformat(entry.get("timestamp", "").replace("Z", "+00:00"))
            if timestamp.replace(tzinfo=None) >= thirty_days_ago:
                recent_scores.append(entry)
        except (ValueError, TypeError) as e:
            logger.debug(
                f"Could not parse timestamp: {entry.get('timestamp')}",
                operation="calculate_aggregates",
                error=e,
                entry_pr=entry.get('pr', 'unknown')
            )
            pass
    
    # Group by week
    trends = []
    if recent_scores:
        # Group by week
        weekly_scores = {}
        for entry in recent_scores:
            try:
                timestamp = datetime.fromisoformat(entry.get("timestamp", "").replace("Z", "+00:00"))
                week_key = timestamp.strftime("%Y-W%W")
                if week_key not in weekly_scores:
                    weekly_scores[week_key] = []
                weekly_scores[week_key].append(entry.get("score", 0))
            except (ValueError, TypeError):
                pass
        
        for week, week_scores in sorted(weekly_scores.items()):
            trends.append({
                "period": week,
                "average": sum(week_scores) / len(week_scores) if week_scores else 0.0,
                "count": len(week_scores)
            })
    
    return {
        "total_prs": total_prs,
        "average_score": round(average_score, 2),
        "score_distribution": distribution,
        "trends": trends,
        "category_performance": category_performance,
        "anti_patterns": anti_patterns
    }


def get_score_range(score: int) -> str:
    """Get score range category."""
    if score >= 6:
        return "high (6+)"
    elif score >= 3:
        return "medium (3-5)"
    elif score >= 0:
        return "low (0-2)"
    else:
        return "negative (<0)"


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--pr", help="PR number (optional, for single PR update)")
    parser.add_argument("--score", type=int, help="Score value (optional)")
    parser.add_argument("--breakdown", help="Path to breakdown JSON (optional)")
    parser.add_argument("--metadata", help="Path to metadata JSON (optional)")
    parser.add_argument("--reward-json", help="Path to reward.json artifact (contains score, breakdown, metadata, file_scores)")
    parser.add_argument("--reward-file", help="Path to reward.json artifact (alias for --reward-json)")
    parser.add_argument("--reward-files", help="Comma-separated list of reward.json files to process in batch")
    parser.add_argument("--output", required=False, help="Path to output metrics file (defaults to docs/metrics/reward_scores.json)")
    parser.add_argument("--aggregate-only", action="store_true", help="Only recalculate aggregates")
    args = parser.parse_args()
    
    # Determine reward file(s) to use (prefer --reward-file over --reward-json for backward compatibility)
    reward_file = args.reward_file or args.reward_json
    reward_files = []
    
    # Handle batch processing
    if args.reward_files:
        reward_files = [f.strip() for f in args.reward_files.split(",") if f.strip()]
    
    # If single reward file provided, add to list
    if reward_file:
        reward_files.append(reward_file)
    
    # Determine output path (use provided --output or default to METRICS_FILE)
    output_path = Path(args.output) if args.output else METRICS_FILE
    
    # Validate: reward_file(s) is required unless --aggregate-only
    if not args.aggregate_only and not reward_files and not (args.pr and args.score is not None):
        logger.error("--reward-file, --reward-files, or --pr with --score is required unless --aggregate-only is specified", operation="main")
        sys.exit(1)
    
    # Load existing metrics from output path if it exists (load once for batch processing)
    metrics = load_metrics(output_path) if output_path.exists() else load_metrics()
    
    # Get repo path for PR info (used for all entries)
    repo_path = Path(__file__).resolve().parents[0].parents[0]
    
    # Process all reward files in batch
    processed_count = 0
    failed_count = 0
    
    for reward_file_path in reward_files:
        if not os.path.exists(reward_file_path):
            logger.warn(f"Reward file not found: {reward_file_path}, skipping", operation="main", file_path=reward_file_path)
            failed_count += 1
            continue
        
        try:
            with open(reward_file_path, "r", encoding="utf-8") as handle:
                reward_data = json.load(handle)
        except json.JSONDecodeError as e:
            logger.error(f"Invalid JSON in reward file: {reward_file_path}", operation="main", error=str(e), file_path=reward_file_path)
            failed_count += 1
            continue
        except Exception as e:
            logger.error(f"Error reading reward file: {reward_file_path}", operation="main", error=str(e), file_path=reward_file_path)
            failed_count += 1
            continue
        
        # Handle both old and new field name formats
        # Old format: pr_number, total_score, timestamp
        # New format: metadata.pr, score, metadata.computed_at
        score = reward_data.get("total_score") or reward_data.get("score", 0)
        breakdown = reward_data.get("breakdown", {})
        metadata = reward_data.get("metadata", {})
        file_scores = reward_data.get("file_scores", {})
        pr_num = reward_data.get("pr_number") or (metadata.get("pr") if isinstance(metadata, dict) else None) or args.pr
        
        # Validate we have the essential fields (score and PR number)
        if not pr_num:
            logger.error(f"PR number not found in reward.json: {reward_file_path} (pr_number, metadata.pr, or --pr argument)", operation="main", file_path=reward_file_path)
            failed_count += 1
            continue
        
        # Check for timestamp (either at root or in metadata)
        timestamp = reward_data.get("timestamp") or metadata.get("computed_at") or reward_data.get("metadata", {}).get("computed_at")
        if not timestamp:
            logger.warn(f"No timestamp found in reward.json: {reward_file_path}, using current time", operation="main", file_path=reward_file_path)
            timestamp = datetime.utcnow().isoformat() + "Z"
            if isinstance(metadata, dict):
                metadata["computed_at"] = timestamp
        
        # Add entry to metrics (in-memory, not saved yet)
        add_score_entry(metrics, pr_num, score, breakdown, metadata, repo_path, file_scores)
        processed_count += 1
        logger.info(f"Processed reward file: {reward_file_path} (PR #{pr_num}, score: {score})", operation="main", pr_num=pr_num, score=score)
    
    # Handle single PR entry via arguments (if not using reward files)
    if not reward_files and (args.pr and args.score is not None):
        # Use individual arguments
        score = args.score
        breakdown = {}
        if args.breakdown:
            with open(args.breakdown, "r", encoding="utf-8") as handle:
                breakdown = json.load(handle)
        metadata = {}
        if args.metadata:
            with open(args.metadata, "r", encoding="utf-8") as handle:
                metadata = json.load(handle)
        file_scores = {}
        pr_num = args.pr
        
        # Add entry to metrics (in-memory, not saved yet)
        add_score_entry(metrics, pr_num, score, breakdown, metadata, repo_path, file_scores)
        processed_count += 1
    
    # Recalculate aggregates
    metrics["aggregates"] = calculate_aggregates(metrics)
    
    # Ensure scores are sorted by timestamp (most recent first) before saving
    if "scores" in metrics and metrics["scores"]:
        metrics["scores"].sort(key=lambda x: x.get("timestamp", ""), reverse=True)
    
    # Save metrics to output path (single save after batch processing)
    save_metrics(metrics, args.output)
    
    logger.info(
        f"Metrics updated: {metrics['aggregates']['total_prs']} PRs, avg score: {metrics['aggregates']['average_score']}, processed: {processed_count}, failed: {failed_count}",
        operation="main",
        total_prs=metrics['aggregates']['total_prs'],
        average_score=metrics['aggregates']['average_score'],
        processed_count=processed_count,
        failed_count=failed_count
    )


if __name__ == "__main__":
    try:
        main()
        sys.exit(0)
    except Exception as e:
        logger.error(f"Unhandled exception in collect_metrics: {e}", operation="main", error=str(e), exc_info=True)
        sys.exit(1)

