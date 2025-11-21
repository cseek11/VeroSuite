#!/usr/bin/env python3
"""
Analyze REWARD_SCORE metrics for historical tracking and pattern analysis.

Provides analysis functions for:
- Score history and trends
- Category performance analysis
- Anti-pattern detection and tracking
- Trend reports
"""

import argparse
import json
from datetime import datetime, timedelta
from pathlib import Path
from typing import Dict, List, Optional

# Import structured logger
try:
    from logger_util import get_logger
    logger = get_logger(context="analyze_metrics")
except ImportError:
    # Fallback if logger_util not available (should not happen)
    import logging
    logger = logging.getLogger("analyze_metrics")


METRICS_FILE = Path(__file__).resolve().parents[0].parents[0] / "docs" / "metrics" / "reward_scores.json"


def load_metrics() -> Dict:
    """Load metrics from JSON file."""
    if METRICS_FILE.exists():
        try:
            with open(METRICS_FILE, "r", encoding="utf-8") as handle:
                return json.load(handle)
        except (json.JSONDecodeError, FileNotFoundError) as e:
            logger.warn(
                f"Could not load metrics file: {METRICS_FILE}",
                operation="load_metrics",
                error=e,
                metrics_file=str(METRICS_FILE)
            )
            pass
    return {"scores": [], "aggregates": {}}


def analyze_score_history(metrics: Dict, days: int = 30) -> Dict:
    """Analyze score history over specified period."""
    scores = metrics.get("scores", [])
    if not scores:
        return {
            "period_days": days,
            "total_scores": 0,
            "average_score": 0.0,
            "score_trend": "stable",
            "improvement_rate": 0.0
        }
    
    # Filter by date
    cutoff_date = datetime.utcnow() - timedelta(days=days)
    recent_scores = []
    for entry in scores:
        try:
            timestamp = datetime.fromisoformat(entry.get("timestamp", "").replace("Z", "+00:00"))
            if timestamp.replace(tzinfo=None) >= cutoff_date:
                recent_scores.append(entry)
        except (ValueError, TypeError) as e:
            logger.debug(
                f"Could not parse score: {entry.get('score')}",
                operation="print_summary",
                error=e,
                entry_pr=entry.get('pr', 'unknown')
            )
            pass
    
    if not recent_scores:
        return {
            "period_days": days,
            "total_scores": 0,
            "average_score": 0.0,
            "score_trend": "no_data",
            "improvement_rate": 0.0
        }
    
    # Calculate average
    total_score = sum(entry.get("score", 0) for entry in recent_scores)
    average_score = total_score / len(recent_scores)
    
    # Calculate trend (compare first half vs second half)
    midpoint = len(recent_scores) // 2
    first_half = recent_scores[:midpoint] if midpoint > 0 else []
    second_half = recent_scores[midpoint:]
    
    first_avg = sum(e.get("score", 0) for e in first_half) / len(first_half) if first_half else 0
    second_avg = sum(e.get("score", 0) for e in second_half) / len(second_half) if second_half else 0
    
    if second_avg > first_avg + 0.5:
        trend = "improving"
    elif second_avg < first_avg - 0.5:
        trend = "declining"
    else:
        trend = "stable"
    
    improvement_rate = ((second_avg - first_avg) / first_avg * 100) if first_avg > 0 else 0.0
    
    return {
        "period_days": days,
        "total_scores": len(recent_scores),
        "average_score": round(average_score, 2),
        "score_trend": trend,
        "improvement_rate": round(improvement_rate, 2),
        "first_half_avg": round(first_avg, 2),
        "second_half_avg": round(second_avg, 2)
    }


def analyze_category_performance(metrics: Dict) -> Dict:
    """Analyze performance by category."""
    aggregates = metrics.get("aggregates", {})
    category_perf = aggregates.get("category_performance", {})
    
    if not category_perf:
        return {
            "categories": {},
            "top_category": None,
            "needs_improvement": []
        }
    
    # Find top and bottom categories
    category_avgs = {
        cat: data.get("average", 0) 
        for cat, data in category_perf.items()
        if cat != "penalties"
    }
    
    top_category = max(category_avgs.items(), key=lambda x: x[1])[0] if category_avgs else None
    
    # Categories needing improvement (below average)
    overall_avg = sum(category_avgs.values()) / len(category_avgs) if category_avgs else 0
    needs_improvement = [
        cat for cat, avg in category_avgs.items()
        if avg < overall_avg * 0.8  # 20% below average
    ]
    
    return {
        "categories": category_perf,
        "top_category": top_category,
        "needs_improvement": needs_improvement,
        "overall_category_avg": round(overall_avg, 2)
    }


def analyze_anti_patterns(metrics: Dict) -> Dict:
    """Analyze anti-patterns and recurring issues."""
    aggregates = metrics.get("aggregates", {})
    anti_patterns = aggregates.get("anti_patterns", [])
    
    if not anti_patterns:
        return {
            "total_anti_patterns": 0,
            "common_penalties": {},
            "recurring_issues": []
        }
    
    # Analyze common penalties
    penalty_counts = {}
    for entry in anti_patterns:
        penalties = entry.get("penalties", 0)
        if penalties < 0:
            penalty_type = "high_penalty" if penalties <= -3 else "moderate_penalty"
            penalty_counts[penalty_type] = penalty_counts.get(penalty_type, 0) + 1
    
    # Find recurring issues (same breakdown pattern)
    breakdown_patterns = {}
    for entry in anti_patterns:
        breakdown = entry.get("breakdown", {})
        # Create pattern key from breakdown
        pattern_key = tuple(sorted([
            f"{k}:{v}" for k, v in breakdown.items() if v != 0
        ]))
        if pattern_key not in breakdown_patterns:
            breakdown_patterns[pattern_key] = []
        breakdown_patterns[pattern_key].append(entry.get("pr"))
    
    # Find patterns that occur multiple times
    recurring = [
        {"pattern": list(pattern), "count": len(prs), "prs": prs[:5]}  # Limit to 5 PRs
        for pattern, prs in breakdown_patterns.items()
        if len(prs) > 1
    ]
    recurring.sort(key=lambda x: x["count"], reverse=True)
    
    return {
        "total_anti_patterns": len(anti_patterns),
        "common_penalties": penalty_counts,
        "recurring_issues": recurring[:10],  # Top 10 recurring issues
        "recent_anti_patterns": anti_patterns[:10]  # Most recent 10
    }


def generate_trend_report(metrics: Dict, output_path: Optional[Path] = None) -> str:
    """Generate a comprehensive trend report."""
    history = analyze_score_history(metrics, days=30)
    categories = analyze_category_performance(metrics)
    anti_patterns = analyze_anti_patterns(metrics)
    
    report = f"""# REWARD_SCORE Trend Report
Generated: {datetime.utcnow().isoformat()}Z

## Score History (Last 30 Days)
- Total PRs Scored: {history['total_scores']}
- Average Score: {history['average_score']}/10
- Trend: {history['score_trend'].upper()}
- Improvement Rate: {history['improvement_rate']}%
- First Half Average: {history['first_half_avg']}
- Second Half Average: {history['second_half_avg']}

## Category Performance
- Top Performing Category: {categories['top_category'] or 'N/A'}
- Overall Category Average: {categories['overall_category_avg']}
- Categories Needing Improvement: {', '.join(categories['needs_improvement']) if categories['needs_improvement'] else 'None'}

### Category Breakdown:
"""
    
    for category, data in categories['categories'].items():
        report += f"- **{category}**: Avg {data.get('average', 0)}, Total {data.get('total', 0)}, Count {data.get('count', 0)}\n"
    
    report += f"""
## Anti-Pattern Analysis
- Total Anti-Patterns (Score ≤ 0): {anti_patterns['total_anti_patterns']}
- Common Penalties: {anti_patterns['common_penalties']}

### Recurring Issues:
"""
    
    if anti_patterns['recurring_issues']:
        for issue in anti_patterns['recurring_issues']:
            report += f"- Pattern: {issue['pattern']} (Occurred {issue['count']} times, PRs: {', '.join(map(str, issue['prs']))})\n"
    else:
        report += "- No recurring issues detected\n"
    
    report += f"""
## Recommendations
"""
    
    if history['score_trend'] == 'declining':
        report += "- ⚠️ Scores are declining - review recent PRs for common issues\n"
    
    if categories['needs_improvement']:
        report += f"- 📈 Focus on improving: {', '.join(categories['needs_improvement'])}\n"
    
    if anti_patterns['recurring_issues']:
        report += "- 🔍 Address recurring anti-patterns to improve overall scores\n"
    
    if history['score_trend'] == 'improving':
        report += "- ✅ Scores are improving - maintain current practices\n"
    
    if output_path:
        output_path.parent.mkdir(parents=True, exist_ok=True)
        with open(output_path, "w", encoding="utf-8") as handle:
            handle.write(report)
    
    return report


def main() -> None:
    """Main analysis function."""
    parser = argparse.ArgumentParser(description="Analyze REWARD_SCORE metrics")
    parser.add_argument("--history", type=int, default=30, help="Days of history to analyze")
    parser.add_argument("--categories", action="store_true", help="Show category performance")
    parser.add_argument("--anti-patterns", action="store_true", help="Show anti-pattern analysis")
    parser.add_argument("--report", help="Generate full trend report (output path)")
    parser.add_argument("--json", action="store_true", help="Output as JSON")
    
    args = parser.parse_args()
    
    metrics = load_metrics()
    
    if args.json:
        output = {}
        if args.history:
            output["history"] = analyze_score_history(metrics, args.history)
        if args.categories:
            output["categories"] = analyze_category_performance(metrics)
        if args.anti_patterns:
            output["anti_patterns"] = analyze_anti_patterns(metrics)
        print(json.dumps(output, indent=2))
    elif args.report:
        report_path = Path(args.report)
        report = generate_trend_report(metrics, report_path)
        print(report)
    else:
        # Default: show all analyses
        history = analyze_score_history(metrics, args.history)
        categories = analyze_category_performance(metrics)
        anti_patterns = analyze_anti_patterns(metrics)
        
        print("=== Score History ===")
        print(json.dumps(history, indent=2))
        print("\n=== Category Performance ===")
        print(json.dumps(categories, indent=2))
        print("\n=== Anti-Patterns ===")
        print(json.dumps(anti_patterns, indent=2))


if __name__ == "__main__":
    main()

