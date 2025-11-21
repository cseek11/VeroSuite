#!/usr/bin/env python3
"""
Session Health Monitoring
Monitors session health and generates alerts for issues.

Last Updated: 2025-11-19
"""

import json
import sys
from datetime import datetime, timedelta
from pathlib import Path
from typing import Dict, List

# Import structured logger
try:
    from logger_util import get_logger, get_or_create_trace_context
    logger = get_logger(context="monitor_sessions")
    trace_context = get_or_create_trace_context()
except ImportError:
    import logging
    logger = logging.getLogger("monitor_sessions")
    trace_context = {"traceId": None, "spanId": None, "requestId": None}

try:
    from auto_pr_session_manager import AutoPRSessionManager, SESSION_DATA_FILE
except ImportError as e:
    logger.error(
        "Failed to import auto_pr_session_manager",
        operation="import",
        error=str(e),
        **trace_context
    )
    print(f"ERROR: Failed to import auto_pr_session_manager: {e}", file=sys.stderr)
    sys.exit(1)

# Alert thresholds
ALERT_ORPHANED_SESSIONS = 5
ALERT_AVG_DURATION_HOURS = 2
ALERT_STATE_FILE_SIZE_MB = 1


def check_orphaned_sessions(manager: AutoPRSessionManager) -> Tuple[int, List[str]]:
    """Check for orphaned sessions."""
    try:
        active_sessions = manager.sessions.get("active_sessions", {})
        now = datetime.now()
        timeout = timedelta(minutes=manager.config.timeout_minutes)
        orphaned = []
        
        for session_id, session_data in active_sessions.items():
            try:
                last_activity = datetime.fromisoformat(session_data.get("last_activity", ""))
                if now - last_activity > timeout * 2:  # 2x timeout = orphaned
                    orphaned.append(session_id)
            except (ValueError, KeyError):
                # Invalid session data
                orphaned.append(session_id)
        
        count = len(orphaned)
        if count > ALERT_ORPHANED_SESSIONS:
            logger.warn(
                "Orphaned sessions threshold exceeded",
                operation="check_orphaned_sessions",
                count=count,
                threshold=ALERT_ORPHANED_SESSIONS,
                **trace_context
            )
        
        return count, orphaned
    except Exception as e:
        logger.error(
            "Error checking orphaned sessions",
            operation="check_orphaned_sessions",
            error=str(e),
            error_type=type(e).__name__,
            **trace_context
        )
        return 0, []


def check_average_duration(manager: AutoPRSessionManager) -> Tuple[float, bool]:
    """Check average session duration."""
    try:
        completed = manager.sessions.get("completed_sessions", [])
        if not completed:
            return 0.0, False
        
        total_duration = 0
        count = 0
        for session in completed:
            try:
                duration = session.get("duration_minutes", 0)
                if duration > 0:
                    total_duration += duration
                    count += 1
            except Exception:
                continue
        
        if count == 0:
            return 0.0, False
        
        avg_duration_hours = (total_duration / count) / 60
        alert = avg_duration_hours > ALERT_AVG_DURATION_HOURS
        
        if alert:
            logger.warn(
                "Average session duration threshold exceeded",
                operation="check_average_duration",
                avg_duration_hours=avg_duration_hours,
                threshold=ALERT_AVG_DURATION_HOURS,
                **trace_context
            )
        
        return avg_duration_hours, alert
    except Exception as e:
        logger.error(
            "Error checking average duration",
            operation="check_average_duration",
            error=str(e),
            error_type=type(e).__name__,
            **trace_context
        )
        return 0.0, False


def check_state_file_size() -> Tuple[float, bool]:
    """Check state file size."""
    try:
        state_file = Path(".cursor/data/session_state.json")
        if not state_file.exists():
            return 0.0, False
        
        size_mb = state_file.stat().st_size / (1024 * 1024)
        alert = size_mb > ALERT_STATE_FILE_SIZE_MB
        
        if alert:
            logger.warn(
                "State file size threshold exceeded",
                operation="check_state_file_size",
                size_mb=size_mb,
                threshold=ALERT_STATE_FILE_SIZE_MB,
                **trace_context
            )
        
        return size_mb, alert
    except Exception as e:
        logger.error(
            "Error checking state file size",
            operation="check_state_file_size",
            error=str(e),
            error_type=type(e).__name__,
            **trace_context
        )
        return 0.0, False


def generate_health_report() -> Dict:
    """Generate comprehensive health report."""
    try:
        manager = AutoPRSessionManager()
        
        # Run checks
        orphaned_count, orphaned_list = check_orphaned_sessions(manager)
        avg_duration, duration_alert = check_average_duration(manager)
        state_size, size_alert = check_state_file_size()
        
        active_count = len(manager.sessions.get("active_sessions", {}))
        completed_count = len(manager.sessions.get("completed_sessions", []))
        
        alerts = []
        if orphaned_count > ALERT_ORPHANED_SESSIONS:
            alerts.append(f"Orphaned sessions: {orphaned_count} (threshold: {ALERT_ORPHANED_SESSIONS})")
        if duration_alert:
            alerts.append(f"Average duration: {avg_duration:.1f}h (threshold: {ALERT_AVG_DURATION_HOURS}h)")
        if size_alert:
            alerts.append(f"State file size: {state_size:.2f}MB (threshold: {ALERT_STATE_FILE_SIZE_MB}MB)")
        
        report = {
            "timestamp": datetime.now().isoformat(),
            "status": "healthy" if not alerts else "warning",
            "metrics": {
                "active_sessions": active_count,
                "completed_sessions": completed_count,
                "orphaned_sessions": orphaned_count,
                "avg_duration_hours": round(avg_duration, 2),
                "state_file_size_mb": round(state_size, 2)
            },
            "alerts": alerts,
            "orphaned_session_ids": orphaned_list[:10]  # Limit to first 10
        }
        
        logger.info(
            "Health report generated",
            operation="generate_health_report",
            status=report["status"],
            alerts_count=len(alerts),
            **trace_context
        )
        
        return report
    except Exception as e:
        logger.error(
            "Error generating health report",
            operation="generate_health_report",
            error=str(e),
            error_type=type(e).__name__,
            **trace_context
        )
        return {
            "timestamp": datetime.now().isoformat(),
            "status": "error",
            "error": str(e)
        }


def main():
    """CLI entry point."""
    import argparse
    
    parser = argparse.ArgumentParser(description="Monitor session health")
    parser.add_argument(
        '--json',
        action='store_true',
        help='Output as JSON'
    )
    parser.add_argument(
        '--exit-code',
        action='store_true',
        help='Exit with non-zero code if alerts found'
    )
    
    args = parser.parse_args()
    
    report = generate_health_report()
    
    if args.json:
        print(json.dumps(report, indent=2))
    else:
        print(f"Session Health Report - {report['timestamp']}")
        print(f"Status: {report['status'].upper()}")
        print("\nMetrics:")
        for key, value in report.get("metrics", {}).items():
            print(f"  {key}: {value}")
        
        if report.get("alerts"):
            print("\n⚠️  Alerts:")
            for alert in report["alerts"]:
                print(f"  - {alert}")
        else:
            print("\n✅ No alerts")
    
    if args.exit_code and report.get("status") != "healthy":
        return 1
    
    return 0


if __name__ == "__main__":
    sys.exit(main())








