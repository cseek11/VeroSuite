#!/usr/bin/env python3
"""
Session Analytics Generator
Creates reports and visualizations for auto-PR sessions.

Last Updated: 2025-11-19
"""

import json
from datetime import datetime, timedelta
from pathlib import Path
from typing import Dict, List, Optional
from collections import defaultdict

# Import structured logger
try:
    from logger_util import get_logger, get_or_create_trace_context
    logger = get_logger(context="session_analytics")
    trace_context = get_or_create_trace_context()
except ImportError:
    import logging
    logger = logging.getLogger("session_analytics")
    trace_context = {"traceId": None, "spanId": None, "requestId": None}

SESSION_DATA_FILE = Path("docs/metrics/auto_pr_sessions.json")
OUTPUT_DIR = Path("docs/metrics/analytics")


def load_session_data() -> Dict:
    """Load session data."""
    try:
        if not SESSION_DATA_FILE.exists():
            logger.warn(
                "Session data file not found",
                operation="load_session_data",
                file_path=str(SESSION_DATA_FILE),
                **trace_context
            )
            return {
                "version": "1.0",
                "last_updated": datetime.now().isoformat(),
                "active_sessions": {},
                "completed_sessions": []
            }
        
        with open(SESSION_DATA_FILE, 'r', encoding='utf-8') as f:
            data = json.load(f)
            logger.debug(
                "Session data loaded",
                operation="load_session_data",
                active_count=len(data.get("active_sessions", {})),
                completed_count=len(data.get("completed_sessions", [])),
                **trace_context
            )
            return data
    except json.JSONDecodeError as e:
        logger.error(
            "Invalid JSON in session data file",
            operation="load_session_data",
            error=str(e),
            file_path=str(SESSION_DATA_FILE),
            **trace_context
        )
        return {
            "version": "1.0",
            "last_updated": datetime.now().isoformat(),
            "active_sessions": {},
            "completed_sessions": []
        }
    except Exception as e:
        logger.error(
            "Error loading session data",
            operation="load_session_data",
            error=str(e),
            error_type=type(e).__name__,
            **trace_context
        )
        raise


def calculate_analytics(data: Dict) -> Dict:
    """Calculate comprehensive analytics."""
    try:
        completed = data.get("completed_sessions", [])
        active = data.get("active_sessions", {})
        
        if not completed:
            logger.info(
                "No completed sessions to analyze",
                operation="calculate_analytics",
                **trace_context
            )
            return {
                "error": "No completed sessions to analyze"
            }
        
        # Author statistics
        authors = defaultdict(lambda: {
            "sessions": 0,
            "total_prs": 0,
            "total_score": 0,
            "total_duration": 0,
            "avg_prs_per_session": 0,
            "avg_score": 0,
            "avg_duration": 0
        })
        
        for session in completed:
            try:
                author = session.get("author", "unknown")
                authors[author]["sessions"] += 1
                authors[author]["total_prs"] += len(session.get("prs", []))
                authors[author]["total_score"] += session.get("final_score", 0)
                authors[author]["total_duration"] += session.get("duration_minutes", 0)
            except Exception as e:
                logger.warn(
                    "Error processing session for analytics",
                    operation="calculate_analytics",
                    error=str(e),
                    session_id=session.get("session_id", "unknown"),
                    **trace_context
                )
                continue
        
        # Calculate averages
        for author, stats in authors.items():
            if stats["sessions"] > 0:
                stats["avg_prs_per_session"] = stats["total_prs"] / stats["sessions"]
                stats["avg_score"] = stats["total_score"] / stats["sessions"]
                stats["avg_duration"] = stats["total_duration"] / stats["sessions"]
        
        # Completion trigger distribution
        triggers = defaultdict(int)
        for session in completed:
            trigger = session.get("completion_trigger", "unknown")
            triggers[trigger] += 1
        
        # Duration distribution
        duration_buckets = {
            "0-30": 0,
            "30-60": 0,
            "60-90": 0,
            "90+": 0
        }
        
        for session in completed:
            try:
                duration = session.get("duration_minutes", 0)
                if duration < 30:
                    duration_buckets["0-30"] += 1
                elif duration < 60:
                    duration_buckets["30-60"] += 1
                elif duration < 90:
                    duration_buckets["60-90"] += 1
                else:
                    duration_buckets["90+"] += 1
            except Exception as e:
                logger.warn(
                    "Error processing duration",
                    operation="calculate_analytics",
                    error=str(e),
                    **trace_context
                )
                continue
        
        # Calculate summary statistics
        try:
            total_duration = sum(s.get("duration_minutes", 0) for s in completed)
            total_prs = sum(len(s.get("prs", [])) for s in completed)
            total_score = sum(s.get("final_score", 0) for s in completed)
            
            analytics = {
                "summary": {
                    "total_completed": len(completed),
                    "total_active": len(active),
                    "avg_session_duration": total_duration / len(completed) if completed else 0,
                    "avg_prs_per_session": total_prs / len(completed) if completed else 0,
                    "avg_score": total_score / len(completed) if completed else 0
                },
                "authors": dict(authors),
                "completion_triggers": dict(triggers),
                "duration_distribution": duration_buckets
            }
            
            logger.info(
                "Analytics calculated",
                operation="calculate_analytics",
                completed_sessions=len(completed),
                active_sessions=len(active),
                **trace_context
            )
            
            return analytics
        except Exception as e:
            logger.error(
                "Error calculating summary statistics",
                operation="calculate_analytics",
                error=str(e),
                error_type=type(e).__name__,
                **trace_context
            )
            raise
    except Exception as e:
        logger.error(
            "Error in calculate_analytics",
            operation="calculate_analytics",
            error=str(e),
            error_type=type(e).__name__,
            **trace_context
        )
        raise


def generate_report() -> str:
    """Generate markdown report."""
    try:
        data = load_session_data()
        analytics = calculate_analytics(data)
        
        if "error" in analytics:
            return f"# Session Analytics\n\n{analytics['error']}"
        
        report = [
            "# Auto-PR Session Analytics",
            f"\n**Generated:** {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}",
            "\n## Summary",
            f"- Total Completed Sessions: {analytics['summary']['total_completed']}",
            f"- Total Active Sessions: {analytics['summary']['total_active']}",
            f"- Average Session Duration: {analytics['summary']['avg_session_duration']:.1f} minutes",
            f"- Average PRs per Session: {analytics['summary']['avg_prs_per_session']:.1f}",
            f"- Average Score: {analytics['summary']['avg_score']:.2f}",
            "\n## Author Performance",
            "\n| Author | Sessions | Total PRs | Avg PRs/Session | Avg Score | Avg Duration |",
            "| ------ | -------- | --------- | --------------- | --------- | ------------ |"
        ]
        
        for author, stats in sorted(analytics["authors"].items()):
            report.append(
                f"| {author} | {stats['sessions']} | {stats['total_prs']} | "
                f"{stats['avg_prs_per_session']:.1f} | {stats['avg_score']:.2f} | "
                f"{stats['avg_duration']:.0f}min |"
            )
        
        report.extend([
            "\n## Completion Triggers",
            "\n| Trigger | Count | Percentage |",
            "| ------- | ----- | ---------- |"
        ])
        
        total_triggers = sum(analytics["completion_triggers"].values())
        for trigger, count in sorted(analytics["completion_triggers"].items()):
            pct = (count / total_triggers * 100) if total_triggers > 0 else 0
            report.append(f"| {trigger} | {count} | {pct:.1f}% |")
        
        report.extend([
            "\n## Duration Distribution",
            "\n| Range | Count |",
            "| ----- | ----- |"
        ])
        
        for range_name, count in analytics["duration_distribution"].items():
            report.append(f"| {range_name} min | {count} |")
        
        logger.info(
            "Report generated",
            operation="generate_report",
            **trace_context
        )
        
        return "\n".join(report)
    except Exception as e:
        logger.error(
            "Error generating report",
            operation="generate_report",
            error=str(e),
            error_type=type(e).__name__,
            **trace_context
        )
        return f"# Session Analytics\n\nError generating report: {e}"


if __name__ == "__main__":
    try:
        OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
        
        report = generate_report()
        
        output_file = OUTPUT_DIR / f"session_analytics_{datetime.now().strftime('%Y%m%d')}.md"
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(report)
        
        print(f"✅ Analytics report generated: {output_file}")
        print("\n" + report)
        
        logger.info(
            "Analytics report saved",
            operation="main",
            output_file=str(output_file),
            **trace_context
        )
    except Exception as e:
        logger.error(
            "Error in main",
            operation="main",
            error=str(e),
            error_type=type(e).__name__,
            **trace_context
        )
        print(f"ERROR: {e}", file=__import__('sys').stderr)
        exit(1)








