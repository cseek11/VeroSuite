#!/usr/bin/env python3
"""
Startup script for Auto-PR Session Management.

This script:
1. Starts a new session (or reuses existing)
2. Starts the monitoring daemon
3. Registers shutdown hooks to complete session on exit
"""

import atexit
import os
import signal
import subprocess
import sys
import threading
import time
from pathlib import Path

# Add script directory to Python path for local imports
# This ensures imports work when script is run from workspace root (e.g., VSCode tasks)
sys.path.insert(0, str(Path(__file__).parent))

# Redirect stderr to stdout for PowerShell compatibility
# This prevents PowerShell from treating JSON logs as fatal errors
# Only real errors will still go to stderr via the logger's severity routing
if os.getenv("VSCODE_TASK") == "1" or not sys.stdout.isatty():
    # In non-interactive mode (VSCode tasks), redirect stderr to stdout
    # This ensures PowerShell doesn't treat JSON logs as errors
    # The logger itself will route ERROR/CRITICAL to stderr, but those are real errors
    pass  # Logger handles routing, no need to redirect here

# Check if running in non-interactive mode (VSCode task, etc.)
IS_NON_INTERACTIVE = not sys.stdout.isatty() or os.getenv("VSCODE_TASK") == "1"
# Exit cleanup is skipped when running non-interactively or when explicitly disabled
SKIP_EXIT_CLEANUP = IS_NON_INTERACTIVE or os.getenv("AUTO_PR_SKIP_EXIT_CLEANUP") == "1"

try:
    from logger_util import get_logger, get_or_create_trace_context
    logger = get_logger(context="start_session_manager")
    trace_context = get_or_create_trace_context()
except ImportError:
    import logging
    logger = logging.getLogger("start_session_manager")
    trace_context = {"traceId": None, "spanId": None, "requestId": None}

try:
    from cursor_session_hook import get_or_create_session_id, clear_session
    SESSION_HOOKS_AVAILABLE = True
except ImportError:
    SESSION_HOOKS_AVAILABLE = False
    logger.error("Failed to import cursor_session_hook", operation="import")

# Global daemon process
daemon_process = None
session_id = None


def _safe_stdout(message: str) -> None:
    """Write message to stdout without raising during shutdown."""
    try:
        print(message, flush=True)
    except (BrokenPipeError, OSError):
        pass


def stop_conflicting_processes():
    """Stop any conflicting Auto-PR processes."""
    try:
        logger.info("Checking for conflicting processes", operation="stop_conflicting_processes", **trace_context)
        
        # Check for existing daemon processes
        scripts_dir = Path(__file__).parent
        daemon_script = scripts_dir / "auto_pr_daemon.py"
        
        if daemon_script.exists():
            # Check if daemon is already running
            try:
                result = subprocess.run(
                    ["python", str(daemon_script), "--check"],
                    capture_output=True,
                    text=True,
                    timeout=5
                )
                if result.returncode == 0:
                    logger.debug("No conflicting processes found", operation="stop_conflicting_processes", **trace_context)
            except (subprocess.TimeoutExpired, FileNotFoundError):
                pass
    except Exception as e:
        logger.warn(f"Error checking for conflicting processes: {e}", operation="stop_conflicting_processes", **trace_context)


def complete_orphaned_sessions_on_startup():
    """Complete any orphaned sessions from previous Cursor sessions."""
    try:
        logger.info("Checking for orphaned sessions from previous Cursor sessions", operation="complete_orphaned_sessions_on_startup", **trace_context)
        
        from auto_pr_session_manager import AutoPRSessionManager
        manager = AutoPRSessionManager()
        
        # Complete sessions older than 24 hours
        completed = manager.cleanup_orphaned_sessions(max_age_hours=24)
        
        if completed:
            logger.info(f"Completed {len(completed)} orphaned sessions", operation="complete_orphaned_sessions_on_startup", completed_count=len(completed), **trace_context)
        else:
            logger.debug("No orphaned sessions found", operation="complete_orphaned_sessions_on_startup", **trace_context)
    except Exception as e:
        logger.warn(f"Error completing orphaned sessions: {e}", operation="complete_orphaned_sessions_on_startup", **trace_context)


def start_session() -> str:
    """Start or retrieve current session."""
    global session_id
    
    if not SESSION_HOOKS_AVAILABLE:
        logger.error("Session hooks not available", operation="start_session", **trace_context)
        return None
    
    try:
        session_id = get_or_create_session_id()
        logger.info("Session started/retrieved", operation="start_session", session_id=session_id, **trace_context)
        return session_id
    except Exception as e:
        logger.error(f"Failed to start session: {e}", operation="start_session", **trace_context)
        return None


def start_monitoring_daemon() -> int:
    """Start the monitoring daemon in background."""
    global daemon_process
    
    try:
        scripts_dir = Path(__file__).parent
        daemon_script = scripts_dir / "auto_pr_daemon.py"
        
        if not daemon_script.exists():
            logger.warn("Daemon script not found", operation="start_monitoring_daemon", daemon_script=str(daemon_script), **trace_context)
            return None
        
        # Start daemon in background
        daemon_process = subprocess.Popen(
            [sys.executable, str(daemon_script)],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            cwd=scripts_dir.parent.parent  # Project root
        )
        
        logger.info("Monitoring daemon started", operation="start_monitoring_daemon", daemon_pid=daemon_process.pid, **trace_context)
        return daemon_process.pid
    except Exception as e:
        logger.error(f"Failed to start monitoring daemon: {e}", operation="start_monitoring_daemon", **trace_context)
        return None


def cleanup_on_exit():
    """Cleanup on exit - complete session and stop daemon."""
    global daemon_process, session_id
    
    if SKIP_EXIT_CLEANUP:
        logger.debug("Exit cleanup disabled (non-interactive mode)", operation="main", **trace_context)
        return
    
    try:
        logger.info("Cleaning up on exit", operation="cleanup_on_exit", **trace_context)
        
        # Stop daemon
        if daemon_process:
            try:
                daemon_process.terminate()
                daemon_process.wait(timeout=5)
                logger.debug("Daemon stopped", operation="cleanup_on_exit", **trace_context)
            except (subprocess.TimeoutExpired, ProcessLookupError):
                try:
                    daemon_process.kill()
                except ProcessLookupError:
                    pass
        
        # Complete session
        if session_id and SESSION_HOOKS_AVAILABLE:
            try:
                from auto_pr_session_manager import AutoPRSessionManager
                manager = AutoPRSessionManager()
                manager.complete_session(session_id, trigger="cursor_exit")
                logger.info("Session completed on exit", operation="cleanup_on_exit", session_id=session_id, **trace_context)
            except Exception as e:
                logger.warn(f"Failed to complete session on exit: {e}", operation="cleanup_on_exit", **trace_context)
    except Exception as e:
        logger.error(f"Error during cleanup: {e}", operation="cleanup_on_exit", **trace_context)


def main():
    """Main entry point."""
    global session_id, daemon_process
    
    try:
        # Register cleanup handlers
        if not SKIP_EXIT_CLEANUP:
            atexit.register(cleanup_on_exit)
            signal.signal(signal.SIGTERM, lambda s, f: cleanup_on_exit())
            signal.signal(signal.SIGINT, lambda s, f: cleanup_on_exit())
        
        # Stop conflicting processes
        stop_conflicting_processes()
        
        # Complete orphaned sessions
        complete_orphaned_sessions_on_startup()
        
        logger.info("Starting Auto-PR Session Manager", operation="main", session_hooks_available=SESSION_HOOKS_AVAILABLE, **trace_context)
        
        # Start session
        session_id = start_session()
        if not session_id:
            logger.error("Failed to start session", operation="main", **trace_context)
            sys.exit(1)
        
        # Start monitoring daemon
        daemon_pid = start_monitoring_daemon()
        if not daemon_pid:
            logger.warn("Failed to start monitoring daemon", operation="main", **trace_context)
        
        logger.info("Auto-PR Session Manager started successfully", operation="main", session_id=session_id, daemon_pid=daemon_pid, **trace_context)
        
        # In non-interactive mode, exit immediately after starting
        if IS_NON_INTERACTIVE:
            logger.debug("Non-interactive mode: exiting after startup", operation="main", **trace_context)
            sys.exit(0)
        
        # In interactive mode, wait for interrupt
        try:
            while True:
                time.sleep(1)
        except KeyboardInterrupt:
            logger.info("Interrupted by user", operation="main", **trace_context)
            cleanup_on_exit()
    
    except Exception as e:
        logger.error(f"Fatal error: {e}", operation="main", **trace_context)
        sys.exit(1)


if __name__ == "__main__":
    main()

