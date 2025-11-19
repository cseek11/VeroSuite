#!/usr/bin/env python3
"""
Analyze Reward Score trends from historical data.

This script:
- Loads last 10 Reward Scores from docs/metrics/reward_scores.json
- Calculates trends (overall score, category distribution)
- Identifies weak categories (frequent point loss)
- Generates recommendations for improvement

Usage:
    python analyze_reward_trends.py [--count N] [--output-format json|markdown] [--output-file PATH]
"""

import argparse
import json
import pathlib
import subprocess
import sys
from datetime import datetime
from typing import Dict, List, Optional, Tuple
from collections import defaultdict

# Import structured logger
try:
    from logger_util import get_logger
    logger = get_logger(context="analyze_reward_trends")
except ImportError:
    import logging
    logger = logging.getLogger("analyze_reward_trends")

REWARD_SCORES_PATH = pathlib.Path(__file__).resolve().parents[2] / "docs" / "metrics" / "reward_scores.json"


def sync_reward_scores_file(repo_path: pathlib.Path, file_path: pathlib.Path) -> bool:
    """
    Sync reward_scores.json from GitHub main branch if available.
    
    Returns True if sync was attempted (success or failure), False if skipped.
    """
    try:
        # Check if we're in a git repository
        result = subprocess.run(
            ["git", "rev-parse", "--git-dir"],
            cwd=repo_path,
            capture_output=True,
            text=True,
            timeout=5
        )
        if result.returncode != 0:
            # Not a git repo, skip sync
            return False
        
        # Check current branch
        branch_result = subprocess.run(
            ["git", "rev-parse", "--abbrev-ref", "HEAD"],
            cwd=repo_path,
            capture_output=True,
            text=True,
            timeout=5
        )
        current_branch = branch_result.stdout.strip() if branch_result.returncode == 0 else None
        
        # Fetch latest from origin (non-blocking, quiet)
        try:
            subprocess.run(
                ["git", "fetch", "origin", "main"],
                cwd=repo_path,
                capture_output=True,
                text=True,
                timeout=10,
                check=False  # Don't fail if fetch fails
            )
        except (subprocess.TimeoutExpired, FileNotFoundError):
            # Git not available or timeout, skip sync
            return False
        
        # Check if file exists on origin/main
        check_result = subprocess.run(
            ["git", "cat-file", "-e", "origin/main:docs/metrics/reward_scores.json"],
            cwd=repo_path,
            capture_output=True,
            text=True,
            timeout=5
        )
        
        if check_result.returncode != 0:
            # File doesn't exist on origin/main, skip
            return False
        
        # Check if local file is outdated (compare with origin/main)
        # Get last commit time of file on origin/main
        origin_time_result = subprocess.run(
            ["git", "log", "-1", "--format=%ct", "origin/main", "--", str(file_path.relative_to(repo_path))],
            cwd=repo_path,
            capture_output=True,
            text=True,
            timeout=5
        )
        
        if origin_time_result.returncode == 0 and origin_time_result.stdout.strip():
            origin_timestamp = int(origin_time_result.stdout.strip())
            
            # Get local file modification time
            if file_path.exists():
                local_timestamp = int(file_path.stat().st_mtime)
                
                # If origin is newer (or within 1 second tolerance), sync
                if origin_timestamp > local_timestamp + 1:
                    logger.info(
                        f"Syncing reward_scores.json from origin/main (local: {local_timestamp}, origin: {origin_timestamp})",
                        operation="sync_reward_scores_file"
                    )
                    
                    # Checkout file from origin/main (non-destructive, only updates if different)
                    sync_result = subprocess.run(
                        ["git", "checkout", "origin/main", "--", str(file_path.relative_to(repo_path))],
                        cwd=repo_path,
                        capture_output=True,
                        text=True,
                        timeout=10
                    )
                    
                    if sync_result.returncode == 0:
                        logger.info(
                            "Successfully synced reward_scores.json from origin/main",
                            operation="sync_reward_scores_file"
                        )
                        return True
                    else:
                        logger.warn(
                            f"Failed to sync reward_scores.json: {sync_result.stderr}",
                            operation="sync_reward_scores_file",
                            error=sync_result.stderr
                        )
                        return True  # Attempted but failed
            else:
                # Local file doesn't exist, try to get it from origin
                logger.info(
                    "Local reward_scores.json not found, fetching from origin/main",
                    operation="sync_reward_scores_file"
                )
                sync_result = subprocess.run(
                    ["git", "checkout", "origin/main", "--", str(file_path.relative_to(repo_path))],
                    cwd=repo_path,
                    capture_output=True,
                    text=True,
                    timeout=10
                )
                return sync_result.returncode == 0
        
        return False
    except Exception as e:
        # Non-fatal: log and continue with local file
        logger.debug(
            f"Could not sync reward_scores.json from GitHub: {e}",
            operation="sync_reward_scores_file",
            error=str(e)
        )
        return False


def load_reward_scores() -> Dict:
    """Load reward scores JSON file, syncing from GitHub if needed."""
    # Auto-sync from origin/main before loading (non-blocking)
    repo_path = REWARD_SCORES_PATH.resolve().parents[2]
    sync_reward_scores_file(repo_path, REWARD_SCORES_PATH)
    
    try:
        with open(REWARD_SCORES_PATH, "r", encoding="utf-8") as handle:
            return json.load(handle)
    except FileNotFoundError:
        logger.error(
            f"Reward scores file not found: {REWARD_SCORES_PATH}",
            operation="load_reward_scores"
        )
        return {"scores": []}
    except json.JSONDecodeError as e:
        logger.error(
            f"Invalid JSON in reward scores file: {REWARD_SCORES_PATH}",
            operation="load_reward_scores",
            error=e
        )
        return {"scores": []}


def get_recent_scores(data: Dict, count: int = 10) -> List[Dict]:
    """Get most recent N scores, ordered by timestamp (most recent first)."""
    scores = data.get("scores", [])
    if not scores:
        return []
    
    # Sort by timestamp (most recent first)
    sorted_scores = sorted(
        scores,
        key=lambda x: x.get("timestamp", ""),
        reverse=True
    )
    
    return sorted_scores[:count]


def calculate_trend(scores: List[Dict]) -> Dict:
    """Calculate trend statistics from scores."""
    if not scores:
        return {
            "average_score": 0.0,
            "trend": "insufficient_data",
            "slope": 0.0,
            "category_averages": {},
            "category_trends": {},
            "weak_categories": [],
            "improving_categories": []
        }
    
    # Overall score trend
    score_values = [s.get("score", 0) for s in scores]
    average_score = sum(score_values) / len(score_values) if score_values else 0.0
    
    # Calculate slope (simple linear regression)
    n = len(score_values)
    if n >= 2:
        x_values = list(range(n))
        x_mean = sum(x_values) / n
        y_mean = sum(score_values) / n
        
        numerator = sum((x_values[i] - x_mean) * (score_values[i] - y_mean) for i in range(n))
        denominator = sum((x_values[i] - x_mean) ** 2 for i in range(n))
        
        slope = numerator / denominator if denominator != 0 else 0.0
    else:
        slope = 0.0
    
    # Determine trend direction
    if slope > 0.1:
        trend = "improving"
    elif slope < -0.1:
        trend = "worsening"
    else:
        trend = "stable"
    
    # Category analysis
    categories = ["tests", "bug_fix", "docs", "performance", "security", "penalties"]
    category_values = {cat: [] for cat in categories}
    
    for score in scores:
        breakdown = score.get("breakdown", {})
        for cat in categories:
            if cat in breakdown:
                category_values[cat].append(breakdown[cat])
    
    category_averages = {
        cat: sum(values) / len(values) if values else 0.0
        for cat, values in category_values.items()
    }
    
    # Category trends (comparing first half vs second half)
    category_trends = {}
    weak_categories = []
    improving_categories = []
    
    for cat in categories:
        values = category_values[cat]
        if len(values) >= 4:
            first_half = values[len(values)//2:]
            second_half = values[:len(values)//2]
            first_avg = sum(first_half) / len(first_half) if first_half else 0.0
            second_avg = sum(second_half) / len(second_half) if second_half else 0.0
            
            if second_avg > first_avg + 0.1:
                category_trends[cat] = "improving"
                improving_categories.append(cat)
            elif second_avg < first_avg - 0.1:
                category_trends[cat] = "worsening"
                weak_categories.append(cat)
            else:
                category_trends[cat] = "stable"
        else:
            category_trends[cat] = "insufficient_data"
        
        # Also mark as weak if average is negative or very low
        if category_averages[cat] < 0 or (cat != "penalties" and category_averages[cat] < 0.5):
            if cat not in weak_categories:
                weak_categories.append(cat)
    
    return {
        "average_score": average_score,
        "trend": trend,
        "slope": slope,
        "category_averages": category_averages,
        "category_trends": category_trends,
        "weak_categories": weak_categories,
        "improving_categories": improving_categories,
        "score_count": len(scores)
    }


def generate_recommendations(trend_data: Dict) -> List[str]:
    """Generate actionable recommendations based on trend analysis."""
    recommendations = []
    
    # Overall trend recommendations
    if trend_data["trend"] == "worsening":
        recommendations.append("Overall score trend is worsening. Focus on addressing recurring issues across all categories.")
    elif trend_data["trend"] == "improving":
        recommendations.append("Overall score trend is improving. Continue current practices and address remaining weak areas.")
    
    # Category-specific recommendations
    weak_categories = trend_data["weak_categories"]
    category_trends = trend_data["category_trends"]
    category_averages = trend_data["category_averages"]
    
    if "security" in weak_categories or category_trends.get("security") == "worsening":
        recommendations.append("Security trend is negative → increase security focus. Add security checks, RLS validation, auth guards, and tenant isolation verification.")
    
    if "tests" in weak_categories or category_trends.get("tests") == "worsening":
        recommendations.append("Tests have been weak → require tests first. Add unit tests for new functions, integration tests for API endpoints, and ensure test coverage increases.")
    
    if "docs" in weak_categories or category_trends.get("docs") == "worsening":
        recommendations.append("Documentation is frequently penalized → auto-add docs. Update relevant documentation with current date and ensure engineering decisions are documented.")
    
    if "performance" in weak_categories or category_trends.get("performance") == "worsening":
        recommendations.append("Performance issues detected → add performance tests and optimize queries. Ensure performance improvements are measurable.")
    
    if "penalties" in weak_categories or category_averages.get("penalties", 0) < -1:
        recommendations.append("Penalties are frequent → ensure CI passes, fix linting issues, and add regression tests to prevent regressions.")
    
    if "bug_fix" in weak_categories or category_averages.get("bug_fix", 0) < 0.5:
        recommendations.append("Bug fixes are not well documented → ensure bugs are logged in BUG_LOG.md, error patterns documented, and regression tests added.")
    
    # If no specific issues, provide general guidance
    if not recommendations:
        recommendations.append("No major issues identified. Continue maintaining quality standards across all categories.")
    
    return recommendations


def format_markdown(trend_data: Dict, recommendations: List[str], scores: List[Dict]) -> str:
    """Format analysis as markdown."""
    lines = [
        "# Reward Score Trend Analysis",
        "",
        f"**Analysis Date:** {datetime.utcnow().isoformat()}Z",
        f"**Scores Analyzed:** {trend_data['score_count']}",
        "",
        "## Overall Performance",
        "",
        f"- **Average Score:** {trend_data['average_score']:.2f}/10",
        f"- **Trend:** {trend_data['trend']} (slope: {trend_data['slope']:.3f})",
        "",
        "## Category Breakdown",
        "",
        "| Category | Average | Trend |",
        "|----------|---------|-------|"
    ]
    
    categories = ["tests", "bug_fix", "docs", "performance", "security", "penalties"]
    for cat in categories:
        avg = trend_data["category_averages"].get(cat, 0.0)
        trend = trend_data["category_trends"].get(cat, "unknown")
        lines.append(f"| {cat} | {avg:.2f} | {trend} |")
    
    lines.extend([
        "",
        "## Weak Categories",
        ""
    ])
    
    if trend_data["weak_categories"]:
        for cat in trend_data["weak_categories"]:
            lines.append(f"- {cat} (avg: {trend_data['category_averages'].get(cat, 0.0):.2f}, trend: {trend_data['category_trends'].get(cat, 'unknown')})")
    else:
        lines.append("- None identified")
    
    lines.extend([
        "",
        "## Recommendations",
        ""
    ])
    
    for i, rec in enumerate(recommendations, 1):
        lines.append(f"{i}. {rec}")
    
    lines.extend([
        "",
        "## Recent Scores",
        "",
        "| PR | Score | Timestamp |",
        "|----|-------|-----------|"
    ])
    
    for score in scores[:10]:
        pr = score.get("pr", "unknown")
        score_val = score.get("score", 0)
        timestamp = score.get("timestamp", "unknown")
        lines.append(f"| #{pr} | {score_val}/10 | {timestamp} |")
    
    return "\n".join(lines)


def format_json(trend_data: Dict, recommendations: List[str], scores: List[Dict]) -> str:
    """Format analysis as JSON."""
    output = {
        "analysis_date": datetime.utcnow().isoformat() + "Z",
        "scores_analyzed": trend_data["score_count"],
        "overall": {
            "average_score": trend_data["average_score"],
            "trend": trend_data["trend"],
            "slope": trend_data["slope"]
        },
        "categories": {
            cat: {
                "average": trend_data["category_averages"].get(cat, 0.0),
                "trend": trend_data["category_trends"].get(cat, "unknown")
            }
            for cat in ["tests", "bug_fix", "docs", "performance", "security", "penalties"]
        },
        "weak_categories": trend_data["weak_categories"],
        "improving_categories": trend_data["improving_categories"],
        "recommendations": recommendations,
        "recent_scores": [
            {
                "pr": s.get("pr", "unknown"),
                "score": s.get("score", 0),
                "timestamp": s.get("timestamp", "unknown")
            }
            for s in scores[:10]
        ]
    }
    
    return json.dumps(output, indent=2)


def main() -> None:
    parser = argparse.ArgumentParser(description="Analyze Reward Score trends")
    parser.add_argument(
        "--count",
        type=int,
        default=10,
        help="Number of recent scores to analyze (default: 10)"
    )
    parser.add_argument(
        "--output-format",
        choices=["json", "markdown"],
        default="markdown",
        help="Output format (default: markdown)"
    )
    parser.add_argument(
        "--output-file",
        type=str,
        help="Output file path (default: stdout)"
    )
    
    args = parser.parse_args()
    
    # Load data
    data = load_reward_scores()
    scores = get_recent_scores(data, args.count)
    
    if not scores:
        logger.warn(
            "No scores found for analysis",
            operation="main",
            scores_file=str(REWARD_SCORES_PATH)
        )
        if args.output_format == "json":
            output = json.dumps({"error": "No scores found"}, indent=2)
        else:
            output = "# Reward Score Trend Analysis\n\n**Error:** No scores found in reward_scores.json\n"
        
        if args.output_file:
            with open(args.output_file, "w", encoding="utf-8") as f:
                f.write(output)
        else:
            print(output)
        return
    
    # Calculate trends
    trend_data = calculate_trend(scores)
    recommendations = generate_recommendations(trend_data)
    
    # Format output
    if args.output_format == "json":
        output = format_json(trend_data, recommendations, scores)
    else:
        output = format_markdown(trend_data, recommendations, scores)
    
    # Write output
    if args.output_file:
        with open(args.output_file, "w", encoding="utf-8") as f:
            f.write(output)
        logger.info(
            f"Analysis written to {args.output_file}",
            operation="main",
            output_file=args.output_file,
            format=args.output_format
        )
    else:
        print(output)


if __name__ == "__main__":
    main()



