#!/usr/bin/env python3
"""
Complete Auto-PR Session Management System
Handles micro-PR batching, session tracking, and completion triggers.

Last Updated: 2025-12-04
"""

import json
import re
import os
import sys
import argparse
from typing import Dict, List, Optional, Tuple, Any
from datetime import datetime, timedelta
from pathlib import Path
from dataclasses import dataclass, asdict

try:
    import yaml
except ImportError:
    print("ERROR: pyyaml package required. Install with: pip install pyyaml", file=sys.stderr)
    sys.exit(1)

# Import structured logger
try:
    from logger_util import get_logger, get_or_create_trace_context
    logger = get_logger(context="auto_pr_session_manager")
    trace_context = get_or_create_trace_context()
except ImportError:
    import logging
    logger = logging.getLogger("auto_pr_session_manager")
    trace_context = {"traceId": None, "spanId": None, "requestId": None}

# Configuration
CONFIG_FILE = Path(".cursor/config/session_config.yaml")
SESSION_DATA_FILE = Path("docs/metrics/auto_pr_sessions.json")
REWARD_HISTORY_FILE = Path("docs/metrics/reward_scores.json")


@dataclass
class SessionConfig:
    """Configuration for session management."""
    timeout_minutes: int = 30
    idle_warning_minutes: int = 15
    auto_pr_patterns: List[str] = None
    completion_markers: List[str] = None
    min_files_for_manual: int = 5
    enable_timeout_completion: bool = True
    enable_heuristic_completion: bool = True
    
    def __post_init__(self):
        if self.auto_pr_patterns is None:
            self.auto_pr_patterns = [
                r"^auto-pr:",
                r"^wip:",
                r"^\[auto\]",
                r"^checkpoint:",
                r"^cursor-session",
                r"^🤖",  # Robot emoji for auto-commits
            ]
        
        if self.completion_markers is None:
            self.completion_markers = [
                "ready for review",
                "ready to review",
                "complete",
                "final pr",
                "[session-complete]",
                "[ready]",
                "done with session",
                "finished",
                "✅",  # Checkmark emoji
            ]


@dataclass
class Session:
    """Represents a cursor session with multiple PRs."""
    session_id: str
    author: str
    started: str
    last_activity: str
    prs: List[str]
    total_files_changed: int
    test_files_added: int
    docs_updated: bool = False
    status: str = "active"  # active, idle, warning, completed
    completion_trigger: Optional[str] = None
    metadata: Dict = None
    
    def __post_init__(self):
        if self.metadata is None:
            self.metadata = {}


class AutoPRSessionManager:
    """Manages batching of auto-PR micro-commits into scorable units."""
    
    def __init__(self, config_path: Optional[Path] = None):
        """Initialize session manager with configuration."""
        try:
            self.config = self.load_config(config_path or CONFIG_FILE)
            self.sessions = self.load_sessions()
            logger.info(
                "AutoPRSessionManager initialized",
                operation="__init__",
                **trace_context
            )
        except Exception as e:
            logger.error(
                "Failed to initialize AutoPRSessionManager",
                operation="__init__",
                error=str(e),
                error_type=type(e).__name__,
                **trace_context
            )
            raise
    
    def load_config(self, path: Path) -> SessionConfig:
        """Load configuration from YAML file."""
        try:
            if path.exists():
                with open(path, 'r', encoding='utf-8') as f:
                    data = yaml.safe_load(f)
                    if data is None:
                        logger.warn(
                            "Config file is empty, using defaults",
                            operation="load_config",
                            config_path=str(path),
                            **trace_context
                        )
                        config = SessionConfig()
                        self.save_config(config, path)
                        return config
                    return SessionConfig(**data)
            else:
                # Create default config
                logger.info(
                    "Config file not found, creating default",
                    operation="load_config",
                    config_path=str(path),
                    **trace_context
                )
                config = SessionConfig()
                self.save_config(config, path)
                return config
        except yaml.YAMLError as e:
            logger.error(
                "Invalid YAML in config file",
                operation="load_config",
                error=str(e),
                config_path=str(path),
                **trace_context
            )
            raise
        except Exception as e:
            logger.error(
                "Error loading config",
                operation="load_config",
                error=str(e),
                error_type=type(e).__name__,
                config_path=str(path),
                **trace_context
            )
            raise
    
    def save_config(self, config: SessionConfig, path: Path):
        """Save configuration to YAML file."""
        try:
            path.parent.mkdir(parents=True, exist_ok=True)
            with open(path, 'w', encoding='utf-8') as f:
                yaml.dump(asdict(config), f, default_flow_style=False)
            logger.debug(
                "Config saved",
                operation="save_config",
                config_path=str(path),
                **trace_context
            )
        except Exception as e:
            logger.error(
                "Error saving config",
                operation="save_config",
                error=str(e),
                error_type=type(e).__name__,
                config_path=str(path),
                **trace_context
            )
            raise
    
    def load_sessions(self) -> Dict:
        """Load existing session data."""
        try:
            if SESSION_DATA_FILE.exists():
                with open(SESSION_DATA_FILE, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                    logger.debug(
                        "Sessions loaded",
                        operation="load_sessions",
                        active_count=len(data.get("active_sessions", {})),
                        completed_count=len(data.get("completed_sessions", [])),
                        **trace_context
                    )
                    return data
            else:
                logger.info(
                    "Session data file not found, creating new",
                    operation="load_sessions",
                    **trace_context
                )
                return {
                    "version": "1.0",
                    "last_updated": datetime.now().isoformat(),
                    "active_sessions": {},
                    "completed_sessions": []
                }
        except json.JSONDecodeError as e:
            logger.error(
                "Invalid JSON in session data file",
                operation="load_sessions",
                error=str(e),
                file_path=str(SESSION_DATA_FILE),
                **trace_context
            )
            # Try to restore from backup or create new
            logger.warn(
                "Attempting to restore from backup or create new session data",
                operation="load_sessions",
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
                "Error loading sessions",
                operation="load_sessions",
                error=str(e),
                error_type=type(e).__name__,
                **trace_context
            )
            raise
    
    def save_sessions(self):
        """Persist session data."""
        try:
            self.sessions["last_updated"] = datetime.now().isoformat()
            SESSION_DATA_FILE.parent.mkdir(parents=True, exist_ok=True)
            with open(SESSION_DATA_FILE, 'w', encoding='utf-8') as f:
                json.dump(self.sessions, f, indent=2, ensure_ascii=False)
            logger.debug(
                "Sessions saved",
                operation="save_sessions",
                active_count=len(self.sessions.get("active_sessions", {})),
                completed_count=len(self.sessions.get("completed_sessions", [])),
                **trace_context
            )
        except Exception as e:
            logger.error(
                "Error saving sessions",
                operation="save_sessions",
                error=str(e),
                error_type=type(e).__name__,
                **trace_context
            )
            raise
    
    def is_auto_pr(
        self, 
        pr_title: str, 
        pr_body: str, 
        commit_messages: List[str],
        files_changed: int = 0
    ) -> bool:
        """
        Determine if this is an auto-PR micro-commit.
        
        Detection logic:
        1. PR title matches auto-PR pattern
        2. Commit messages match pattern
        3. Cursor session metadata in PR body
        4. Very small PR (< 5 files) with no tests (heuristic)
        """
        try:
            # Check PR title
            for pattern in self.config.auto_pr_patterns:
                try:
                    if re.search(pattern, pr_title, re.IGNORECASE):
                        logger.debug(
                            "Auto-PR detected via title pattern",
                            operation="is_auto_pr",
                            pattern=pattern,
                            **trace_context
                        )
                        return True
                except re.error as e:
                    logger.warn(
                        "Invalid regex pattern",
                        operation="is_auto_pr",
                        pattern=pattern,
                        error=str(e),
                        **trace_context
                    )
                    continue
            
            # Check commit messages
            for msg in commit_messages:
                for pattern in self.config.auto_pr_patterns:
                    try:
                        if re.search(pattern, msg, re.IGNORECASE):
                            logger.debug(
                                "Auto-PR detected via commit message",
                                operation="is_auto_pr",
                                pattern=pattern,
                                **trace_context
                            )
                            return True
                    except re.error:
                        continue
            
            # Check for cursor session metadata
            try:
                if re.search(r'\[cursor-session:\s*[\w-]+\]', pr_body, re.IGNORECASE):
                    logger.debug(
                        "Auto-PR detected via session metadata",
                        operation="is_auto_pr",
                        **trace_context
                    )
                    return True
            except re.error as e:
                logger.warn(
                    "Error checking session metadata pattern",
                    operation="is_auto_pr",
                    error=str(e),
                    **trace_context
                )
            
            # Heuristic: Very small PR with no explicit markers
            # (conservative - only if < 5 files)
            if files_changed < self.config.min_files_for_manual:
                if not any(keyword in pr_body.lower() for keyword in ["test", "fix", "feature", "doc"]):
                    logger.debug(
                        "Auto-PR detected via heuristic (small PR)",
                        operation="is_auto_pr",
                        files_changed=files_changed,
                        **trace_context
                    )
                    return True
            
            return False
        except Exception as e:
            logger.error(
                "Error in is_auto_pr",
                operation="is_auto_pr",
                error=str(e),
                error_type=type(e).__name__,
                **trace_context
            )
            # Fail safe: return False (don't batch if uncertain)
            return False
    
    def extract_session_id(
        self, 
        pr_title: str, 
        pr_body: str,
        author: str,
        timestamp: datetime
    ) -> Optional[str]:
        """
        Extract or generate cursor session ID.
        
        Priority:
        1. Explicit [cursor-session: ID] in PR body
        2. Session-ID: field in PR body
        3. Generated from timestamp + author
        """
        try:
            # Check PR body for explicit session ID
            try:
                session_match = re.search(
                    r'\[cursor-session:\s*([\w-]+)\]', 
                    pr_body, 
                    re.IGNORECASE
                )
                if session_match:
                    session_id = session_match.group(1)
                    logger.debug(
                        "Session ID extracted from PR body",
                        operation="extract_session_id",
                        session_id=session_id,
                        **trace_context
                    )
                    return session_id
            except re.error as e:
                logger.warn(
                    "Error extracting session ID from PR body",
                    operation="extract_session_id",
                    error=str(e),
                    **trace_context
                )
            
            try:
                session_match = re.search(
                    r'Session-ID:\s*([\w-]+)', 
                    pr_body, 
                    re.IGNORECASE
                )
                if session_match:
                    session_id = session_match.group(1)
                    logger.debug(
                        "Session ID extracted from Session-ID field",
                        operation="extract_session_id",
                        session_id=session_id,
                        **trace_context
                    )
                    return session_id
            except re.error as e:
                logger.warn(
                    "Error extracting Session-ID field",
                    operation="extract_session_id",
                    error=str(e),
                    **trace_context
                )
            
            # Look for active session from same author
            active_session = self._find_active_session(author, timestamp)
            if active_session:
                logger.debug(
                    "Found active session for author",
                    operation="extract_session_id",
                    session_id=active_session,
                    author=author,
                    **trace_context
                )
                return active_session
            
            # Generate new session ID
            session_id = f"{author}-{timestamp.strftime('%Y%m%d-%H%M')}"
            logger.info(
                "Generated new session ID",
                operation="extract_session_id",
                session_id=session_id,
                author=author,
                **trace_context
            )
            return session_id
        except Exception as e:
            logger.error(
                "Error extracting session ID",
                operation="extract_session_id",
                error=str(e),
                error_type=type(e).__name__,
                **trace_context
            )
            # Generate fallback session ID
            fallback_id = f"{author or 'unknown'}-{datetime.now().strftime('%Y%m%d-%H%M')}"
            logger.warn(
                "Using fallback session ID",
                operation="extract_session_id",
                fallback_id=fallback_id,
                **trace_context
            )
            return fallback_id
    
    def _find_active_session(self, author: str, timestamp: datetime) -> Optional[str]:
        """Find active session for author within timeout window."""
        try:
            timeout = timedelta(minutes=self.config.timeout_minutes)
            
            for session_id, session_data in self.sessions["active_sessions"].items():
                if session_data.get("author") != author:
                    continue
                
                try:
                    last_activity = datetime.fromisoformat(session_data["last_activity"])
                    if timestamp - last_activity <= timeout:
                        return session_id
                except (ValueError, KeyError) as e:
                    logger.warn(
                        "Invalid last_activity in session data",
                        operation="_find_active_session",
                        session_id=session_id,
                        error=str(e),
                        **trace_context
                    )
                    continue
            
            return None
        except Exception as e:
            logger.error(
                "Error finding active session",
                operation="_find_active_session",
                error=str(e),
                error_type=type(e).__name__,
                **trace_context
            )
            return None
    
    def add_to_session(
        self, 
        pr_number: str,
        pr_data: Dict,
        session_id: Optional[str] = None
    ) -> Tuple[bool, str, Dict]:
        """
        Add a PR to an active session or create new session.
        
        Returns:
            (should_skip_scoring, session_id, session_data)
        """
        try:
            timestamp = datetime.fromisoformat(
                pr_data.get("timestamp", datetime.now().isoformat())
            )
            author = pr_data.get("author", "unknown")
            
            # Extract or generate session ID
            if not session_id:
                session_id = self.extract_session_id(
                    pr_data.get("pr_title", ""),
                    pr_data.get("pr_body", ""),
                    author,
                    timestamp
                )
            
            # Create or update session
            if session_id not in self.sessions["active_sessions"]:
                self.sessions["active_sessions"][session_id] = {
                    "session_id": session_id,
                    "author": author,
                    "started": timestamp.isoformat(),
                    "last_activity": timestamp.isoformat(),
                    "prs": [],
                    "total_files_changed": 0,
                    "test_files_added": 0,
                    "docs_updated": False,
                    "status": "active",
                    "metadata": {}
                }
                logger.info(
                    "Created new session",
                    operation="add_to_session",
                    session_id=session_id,
                    author=author,
                    **trace_context
                )
            
            # Update session
            session = self.sessions["active_sessions"][session_id]
            session["prs"].append(pr_number)
            session["last_activity"] = timestamp.isoformat()
            session["total_files_changed"] += pr_data.get("files_changed", 0)
            
            if pr_data.get("test_files_added", False):
                session["test_files_added"] += 1
            
            if pr_data.get("docs_updated", False):
                session["docs_updated"] = True
            
            # Update status
            session["status"] = self._calculate_session_status(session)
            
            self.save_sessions()
            
            logger.info(
                "PR added to session",
                operation="add_to_session",
                session_id=session_id,
                pr_number=pr_number,
                prs_count=len(session["prs"]),
                **trace_context
            )
            
            return True, session_id, session
        except Exception as e:
            logger.error(
                "Error adding PR to session",
                operation="add_to_session",
                error=str(e),
                error_type=type(e).__name__,
                pr_number=pr_number,
                **trace_context
            )
            raise
    
    def _calculate_session_status(self, session: Dict) -> str:
        """Calculate current status of session."""
        try:
            last_activity = datetime.fromisoformat(session["last_activity"])
            now = datetime.now()
            minutes_idle = (now - last_activity).total_seconds() / 60
            
            if minutes_idle > self.config.timeout_minutes:
                return "idle"
            elif minutes_idle > self.config.idle_warning_minutes:
                return "warning"
            else:
                return "active"
        except (ValueError, KeyError) as e:
            logger.warn(
                "Error calculating session status, defaulting to active",
                operation="_calculate_session_status",
                error=str(e),
                **trace_context
            )
            return "active"
    
    def should_complete_session(
        self,
        session_id: str,
        pr_data: Dict
    ) -> Tuple[bool, Optional[str]]:
        """
        Determine if session should be completed and scored.
        
        Completion triggers:
        1. Explicit marker in PR title/body
        2. Session timeout exceeded
        3. Tests + docs heuristic
        
        Returns:
            (should_complete, trigger_reason)
        """
        try:
            session = self.sessions["active_sessions"].get(session_id)
            if not session:
                return False, None
            
            pr_title = pr_data.get("pr_title", "").lower()
            pr_body = pr_data.get("pr_body", "").lower()
            
            # Check explicit completion markers
            for marker in self.config.completion_markers:
                if marker.lower() in pr_title or marker.lower() in pr_body:
                    logger.info(
                        "Completion marker detected",
                        operation="should_complete_session",
                        session_id=session_id,
                        marker=marker,
                        **trace_context
                    )
                    return True, f"explicit_marker: {marker}"
            
            # Check timeout
            if self.config.enable_timeout_completion:
                try:
                    last_activity = datetime.fromisoformat(session["last_activity"])
                    timestamp = datetime.fromisoformat(
                        pr_data.get("timestamp", datetime.now().isoformat())
                    )
                    
                    if timestamp - last_activity > timedelta(minutes=self.config.timeout_minutes):
                        logger.info(
                            "Session timeout exceeded",
                            operation="should_complete_session",
                            session_id=session_id,
                            timeout_minutes=self.config.timeout_minutes,
                            **trace_context
                        )
                        return True, "timeout"
                except (ValueError, KeyError) as e:
                    logger.warn(
                        "Error checking timeout",
                        operation="should_complete_session",
                        error=str(e),
                        **trace_context
                    )
            
            # Check heuristic (tests + docs)
            if self.config.enable_heuristic_completion:
                if session.get("test_files_added", 0) > 0 and session.get("docs_updated", False):
                    logger.info(
                        "Heuristic completion triggered (tests + docs)",
                        operation="should_complete_session",
                        session_id=session_id,
                        **trace_context
                    )
                    return True, "heuristic_tests_docs"
            
            return False, None
        except Exception as e:
            logger.error(
                "Error checking if session should complete",
                operation="should_complete_session",
                error=str(e),
                error_type=type(e).__name__,
                session_id=session_id,
                **trace_context
            )
            # Fail safe: don't complete if uncertain
            return False, None
    
    def complete_session(
        self, 
        session_id: str,
        trigger: str = "manual"
    ) -> Dict:
        """
        Complete a session and prepare it for scoring.
        
        Returns:
            Aggregated PR data for scoring
        """
        try:
            if session_id not in self.sessions["active_sessions"]:
                error_msg = f"Session {session_id} not found in active sessions"
                logger.error(
                    error_msg,
                    operation="complete_session",
                    session_id=session_id,
                    **trace_context
                )
                raise ValueError(error_msg)
            
            session = self.sessions["active_sessions"].pop(session_id)
            
            # Add completion metadata
            session["completed"] = datetime.now().isoformat()
            session["completion_trigger"] = trigger
            session["status"] = "completed"
            
            # Calculate duration
            try:
                started = datetime.fromisoformat(session["started"])
                completed = datetime.fromisoformat(session["completed"])
                session["duration_minutes"] = int((completed - started).total_seconds() / 60)
            except (ValueError, KeyError) as e:
                logger.warn(
                    "Error calculating duration",
                    operation="complete_session",
                    error=str(e),
                    **trace_context
                )
                session["duration_minutes"] = 0
            
            # Move to completed sessions
            self.sessions["completed_sessions"].append(session)
            self.save_sessions()
            
            logger.info(
                "Session completed",
                operation="complete_session",
                session_id=session_id,
                trigger=trigger,
                prs_count=len(session.get("prs", [])),
                duration_minutes=session.get("duration_minutes", 0),
                **trace_context
            )
            
            return session
        except Exception as e:
            logger.error(
                "Error completing session",
                operation="complete_session",
                error=str(e),
                error_type=type(e).__name__,
                session_id=session_id,
                **trace_context
            )
            raise
    
    def cleanup_orphaned_sessions(self, max_age_hours: int = 24) -> List[str]:
        """
        Find and complete orphaned sessions (stale for > max_age_hours).
        
        Returns:
            List of completed session IDs
        """
        completed = []
        try:
            now = datetime.now()
            max_age = timedelta(hours=max_age_hours)
            
            for session_id, session in list(self.sessions["active_sessions"].items()):
                try:
                    last_activity = datetime.fromisoformat(session["last_activity"])
                    
                    if now - last_activity > max_age:
                        logger.warn(
                            "Orphaned session detected",
                            operation="cleanup_orphaned_sessions",
                            session_id=session_id,
                            idle_hours=(now - last_activity).total_seconds() / 3600,
                            **trace_context
                        )
                        self.complete_session(session_id, trigger="orphaned_cleanup")
                        completed.append(session_id)
                except (ValueError, KeyError) as e:
                    logger.warn(
                        "Invalid session data, removing",
                        operation="cleanup_orphaned_sessions",
                        session_id=session_id,
                        error=str(e),
                        **trace_context
                    )
                    # Remove invalid session
                    self.sessions["active_sessions"].pop(session_id, None)
                    self.save_sessions()
            
            if completed:
                logger.info(
                    "Orphaned sessions cleaned up",
                    operation="cleanup_orphaned_sessions",
                    count=len(completed),
                    **trace_context
                )
            
            return completed
        except Exception as e:
            logger.error(
                "Error cleaning up orphaned sessions",
                operation="cleanup_orphaned_sessions",
                error=str(e),
                error_type=type(e).__name__,
                **trace_context
            )
            return completed
    
    def get_session_status(self, session_id: Optional[str] = None) -> Dict:
        """Get status of session(s)."""
        try:
            if session_id:
                if session_id in self.sessions["active_sessions"]:
                    return self.sessions["active_sessions"][session_id]
                else:
                    # Search completed
                    for session in self.sessions["completed_sessions"]:
                        if session.get("session_id") == session_id:
                            return session
                    return {}
            else:
                # Return all sessions
                return {
                    "active": len(self.sessions["active_sessions"]),
                    "completed": len(self.sessions["completed_sessions"]),
                    "active_sessions": self.sessions["active_sessions"],
                    "recent_completed": self.sessions["completed_sessions"][-10:]
                }
        except Exception as e:
            logger.error(
                "Error getting session status",
                operation="get_session_status",
                error=str(e),
                error_type=type(e).__name__,
                session_id=session_id,
                **trace_context
            )
            return {}
    
    def generate_session_metadata(self, session_id: str) -> str:
        """Generate metadata string to include in PR body."""
        return f"\n\n---\n[cursor-session: {session_id}]\n<!-- Auto-PR Session Tracking -->"


# CLI Interface
def main():
    """CLI interface for session management."""
    parser = argparse.ArgumentParser(
        description="Auto-PR Session Manager",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  # Check if PR should be batched
  python auto_pr_session_manager.py check --pr-number 326 --title "auto-pr: add tests"
  
  # Complete session manually
  python auto_pr_session_manager.py complete --session-id user1-20251119-1430
  
  # Check for orphaned sessions
  python auto_pr_session_manager.py cleanup
  
  # Get session status
  python auto_pr_session_manager.py status
        """
    )
    
    subparsers = parser.add_subparsers(dest='command', help='Commands')
    
    # Check command
    check_parser = subparsers.add_parser('check', help='Check if PR should be batched')
    check_parser.add_argument('--pr-number', required=True, help='PR number')
    check_parser.add_argument('--title', required=True, help='PR title')
    check_parser.add_argument('--body', default='', help='PR body')
    check_parser.add_argument('--author', required=True, help='PR author')
    check_parser.add_argument('--files', type=int, default=0, help='Files changed')
    
    # Complete command
    complete_parser = subparsers.add_parser('complete', help='Complete a session')
    complete_parser.add_argument('--session-id', required=True, help='Session ID')
    
    # Cleanup command
    cleanup_parser = subparsers.add_parser('cleanup', help='Cleanup orphaned sessions')
    cleanup_parser.add_argument('--max-age', type=int, default=24, help='Max age in hours')
    
    # Status command
    status_parser = subparsers.add_parser('status', help='Get session status')
    status_parser.add_argument('--session-id', help='Specific session ID (optional)')
    
    args = parser.parse_args()
    
    if not args.command:
        parser.print_help()
        return
    
    try:
        # Initialize manager
        manager = AutoPRSessionManager()
        
        # Execute command
        if args.command == 'check':
            pr_data = {
                "pr_number": args.pr_number,
                "pr_title": args.title,
                "pr_body": args.body,
                "author": args.author,
                "files_changed": args.files,
                "timestamp": datetime.now().isoformat(),
                "commit_messages": [args.title]  # Simplified
            }
            
            is_auto = manager.is_auto_pr(
                args.title,
                args.body,
                [args.title],
                args.files
            )
            
            result = {
                "is_auto_pr": is_auto,
                "should_skip_scoring": is_auto
            }
            
            if is_auto:
                session_id = manager.extract_session_id(
                    args.title,
                    args.body,
                    args.author,
                    datetime.now()
                )
                result["session_id"] = session_id
                print(json.dumps(result))
            else:
                print(json.dumps(result))
        
        elif args.command == 'complete':
            try:
                session = manager.complete_session(args.session_id, trigger="manual_cli")
                print(json.dumps(session, indent=2, default=str))
            except ValueError as e:
                print(f"ERROR: {e}", file=sys.stderr)
                sys.exit(1)
        
        elif args.command == 'cleanup':
            completed = manager.cleanup_orphaned_sessions(args.max_age)
            result = {
                "completed": completed,
                "count": len(completed)
            }
            print(json.dumps(result))
        
        elif args.command == 'status':
            status = manager.get_session_status(
                args.session_id if hasattr(args, 'session_id') and args.session_id else None
            )
            print(json.dumps(status, indent=2, default=str))
    
    except Exception as e:
        logger.error(
            "CLI error",
            operation="main",
            error=str(e),
            error_type=type(e).__name__,
            command=args.command if args.command else "unknown",
            **trace_context
        )
        print(f"ERROR: {e}", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()

