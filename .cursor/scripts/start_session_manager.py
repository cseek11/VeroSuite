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
        sys.stdout.write(message)
        if not message.endswith("\n"):
            sys.stdout.write("\n")
        sys.stdout.flush()
    except Exception:
        pass


def complete_session_on_exit():
    """
    Complete the session when Cursor closes.
    
    IMPORTANT: This function must NOT create threads, subprocesses, or use async
    operations during interpreter shutdown, as Python's thread system is
    already torn down. This causes RuntimeError: can't create new thread.
    
    In VSCode tasks (non-interactive mode) or when explicitly disabled via
    `AUTO_PR_SKIP_EXIT_CLEANUP`, we skip cleanup entirely and let the daemon
    handle session completion.
    """
    global session_id
    
    # Skip cleanup in non-interactive mode (VSCode tasks)
    # The daemon will handle session completion when Cursor closes
    if SKIP_EXIT_CLEANUP:
        _safe_stdout("[INFO] Skipping exit cleanup (handled by daemon)")
        return
    
    # Skip if session hooks not available or no session ID
    if not SESSION_HOOKS_AVAILABLE or not session_id:
        return
    
    # During shutdown, avoid subprocess calls (they can spawn threads)
    # Instead, use direct function calls if available, or skip entirely
    try:
        # Try to use direct function call instead of subprocess
        # This avoids thread creation during shutdown
        if SESSION_HOOKS_AVAILABLE:
            try:
                from cursor_session_hook import clear_session
                # Direct function call - no threads, no subprocess
                clear_session()
                _safe_stdout(f"[INFO] Session {session_id} completed via direct call")
            except ImportError:
                # Fallback: skip if direct call not available
                _safe_stdout("[WARN] Direct session completion not available, skipping")
            except Exception as e:
                # Don't use logger - it may create threads
                _safe_stdout(f"[WARN] Failed to complete session on exit: {e}")
    except Exception as e:
        # Use stdout helper instead of logger to avoid thread creation
        _safe_stdout(f"[WARN] Exit cleanup failed (non-critical): {e}")


def signal_handler(sig, frame):
    """Handle shutdown signals."""
    global daemon_process
    
    logger.info("Received shutdown signal", operation="signal_handler", signal=sig, **trace_context)
    
    # Stop daemon
    if daemon_process:
        try:
            daemon_process.terminate()
            daemon_process.wait(timeout=5)
            logger.info("Daemon stopped", operation="signal_handler", **trace_context)
        except Exception as e:
            logger.warn(
                "Error stopping daemon",
                operation="signal_handler",
                error=str(e),
                **trace_context
            )
    
    # Complete session
    complete_session_on_exit()
    
    sys.exit(0)


def start_session():
    """Start or get existing session."""
    global session_id
    
    if not SESSION_HOOKS_AVAILABLE:
        logger.error("Session hooks not available", operation="start_session", **trace_context)
        return None
    
    try:
        session_id = get_or_create_session_id()
        logger.info(
            "Session started/retrieved",
            operation="start_session",
            session_id=session_id,
            **trace_context
        )
        
        # Ensure session is in auto_pr_sessions.json
        try:
            script_path = Path(__file__).parent / "session_cli.py"
            result = subprocess.run(
                [sys.executable, str(script_path), "start"],
                capture_output=True,
                text=True,
                timeout=10
            )
            if result.returncode == 0:
                logger.info(
                    "Session added to dashboard",
                    operation="start_session",
                    session_id=session_id,
                    **trace_context
                )
        except Exception as e:
            logger.warn(
                "Failed to add session to dashboard (non-critical)",
                operation="start_session",
                error=str(e),
                **trace_context
            )
        
        return session_id
    except Exception as e:
        logger.error(
            "Failed to start session",
            operation="start_session",
            error=str(e),
            error_type=type(e).__name__,
            **trace_context
        )
        return None


def start_monitoring_daemon():
    """Start the monitoring daemon in background."""
    global daemon_process
    
    try:
        daemon_script = Path(__file__).parent / "auto_pr_daemon.py"
        
        # Start daemon as background process
        daemon_process = subprocess.Popen(
            [sys.executable, str(daemon_script), "--interval", "300"],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            creationflags=subprocess.CREATE_NO_WINDOW if sys.platform == "win32" else 0
        )
        
        logger.info(
            "Monitoring daemon started",
            operation="start_monitoring_daemon",
            daemon_pid=daemon_process.pid,
            **trace_context
        )
        
        return daemon_process
    except Exception as e:
        logger.error(
            "Failed to start monitoring daemon",
            operation="start_monitoring_daemon",
            error=str(e),
            error_type=type(e).__name__,
            **trace_context
        )
        return None


def stop_conflicting_processes():
    """
    Stop any existing session managers to avoid conflicts.
    
    This function is designed to NEVER fail - it always returns True to prevent
    the script from exiting with code 1 at startup.
    """
    try:
        cleanup_script = Path(__file__).parent / "stop_all_session_managers.py"
        
        if not cleanup_script.exists():
            return True  # Not an error - script just doesn't exist
        
        try:
            logger.info(
                "Checking for conflicting processes",
                operation="stop_conflicting_processes",
                **trace_context
            )
        except Exception:
            # Even logging can fail - continue anyway
            pass
        
        # Skip cleanup script in VSCode tasks to avoid hanging
        # The cleanup is non-critical and can cause the script to hang on Windows
        if IS_NON_INTERACTIVE:
            return True  # Just return - cleanup is not critical for VSCode tasks
        
        try:
            # Try to run cleanup script with very short timeout
            # If it hangs, we'll just continue anyway
            result = subprocess.run(
                [sys.executable, str(cleanup_script)],
                capture_output=True,
                text=True,
                timeout=2  # Very short timeout - 2 seconds max
            )
            
            if result.returncode == 0 and result.stdout:
                output = result.stdout.strip()
                try:
                    logger.info(
                        "Stopped conflicting processes",
                        operation="stop_conflicting_processes",
                        output=output,
                        **trace_context
                    )
                    print(output, flush=True)
                except:
                    pass
            # Non-zero return code is fine - just means nothing to clean up
                    
        except (subprocess.TimeoutExpired, Exception):
            # Timeout or any exception is completely fine - just continue
            # Don't log - this is expected behavior
            pass
        
        return True  # Always return True - never fail at startup
        
    except Exception as e:
        # Catch ALL exceptions - this function must NEVER cause script to exit
        print(f"DEBUG: Exception in stop_conflicting_processes (non-critical): {e}", flush=True)
        try:
            logger.warn(
                "Failed to stop conflicting processes (non-critical)",
                operation="stop_conflicting_processes",
                error=str(e),
                **trace_context
            )
        except:
            # Even logging the error can fail - that's okay
            pass
        
        # Always return True - DO NOT FAIL TASK AT STARTUP
        return True


def complete_orphaned_sessions_on_startup():
    """
    Complete any orphaned sessions from previous Cursor sessions.
    
    This function is designed to NEVER fail - it always returns True to prevent
    the script from exiting with code 1 at startup.
    """
    try:
        orphaned_script = Path(__file__).parent / "complete_orphaned_sessions.py"
        if not orphaned_script.exists():
            return True  # Not an error - script just doesn't exist
        
        try:
            logger.info(
                "Checking for orphaned sessions from previous Cursor sessions",
                operation="complete_orphaned_sessions_on_startup",
                **trace_context
            )
        except:
            pass  # Logging failure is non-critical
        
        try:
            result = subprocess.run(
                [sys.executable, str(orphaned_script), "--max-inactivity-minutes", "1"],
                capture_output=True,
                text=True,
                timeout=30
            )
            if result.returncode == 0:
                output = result.stdout.strip()
                if output and "Completed" in output:
                    try:
                        logger.info(
                            "Completed orphaned sessions",
                            operation="complete_orphaned_sessions_on_startup",
                            output=output,
                            **trace_context
                        )
                    except:
                        pass
                    try:
                        print(output, flush=True)  # Show user what was completed
                    except:
                        pass
        except subprocess.TimeoutExpired:
            # Timeout is non-critical
            try:
                logger.warn(
                    "Orphaned sessions check timed out (non-critical)",
                    operation="complete_orphaned_sessions_on_startup",
                    **trace_context
                )
            except:
                pass
        except Exception as sub_err:
            # Subprocess errors are non-critical
            try:
                logger.warn(
                    f"Subprocess error in orphaned sessions check (non-critical): {sub_err}",
                    operation="complete_orphaned_sessions_on_startup",
                    **trace_context
                )
            except:
                pass
        
        return True  # Always return True - never fail
        
    except Exception as e:
        # Catch ALL exceptions - this function must NEVER cause script to exit
        try:
            logger.warn(
                "Failed to complete orphaned sessions (non-critical)",
                operation="complete_orphaned_sessions_on_startup",
                error=str(e),
                **trace_context
            )
        except:
            pass  # Even logging can fail
        
        # Always return True - DO NOT FAIL TASK AT STARTUP
        return True


def main():
    """Main startup function."""
    # Stop any conflicting processes first
    stop_conflicting_processes()
    
    # Complete orphaned sessions from previous Cursor sessions
    complete_orphaned_sessions_on_startup()
    
    # Register signal handlers
    signal.signal(signal.SIGINT, signal_handler)
    signal.signal(signal.SIGTERM, signal_handler)
    
    # Register atexit handler (runs on normal exit) only when allowed
    if not SKIP_EXIT_CLEANUP:
        atexit.register(complete_session_on_exit)
    else:
        logger.debug(
            "Exit cleanup disabled (non-interactive mode)",
            operation="main",
            **trace_context
        )
    
    logger.info(
        "Starting Auto-PR Session Manager",
        operation="main",
        session_hooks_available=SESSION_HOOKS_AVAILABLE,
        **trace_context
    )
    
    # Start session
    try:
        session_id = start_session()
        if not session_id:
            # Don't exit with code 1 - log warning and continue
            # This allows the task to start even if session hooks aren't available
            logger.warn(
                "Failed to start session (session hooks may not be available)",
                operation="main",
                session_hooks_available=SESSION_HOOKS_AVAILABLE,
                **trace_context
            )
            # Continue anyway - don't fail the task at startup
            # The session manager can still run without a session ID
    except Exception as e:
        # Log the error but don't exit with code 1 - allow task to continue
        try:
            logger.error(
                "Exception starting session (non-fatal)",
                operation="main",
                error=str(e),
                error_type=type(e).__name__,
                **trace_context
            )
            import traceback
            logger.error(
                "Traceback",
                operation="main",
                traceback=traceback.format_exc(),
                **trace_context
            )
        except:
            # Even error logging can fail - print to stdout as fallback
            print(f"ERROR: Exception in main (non-fatal): {e}", flush=True)
        
        # Continue anyway - don't fail the task at startup
        # Set session_id to None and continue
        session_id = None
    
    # Start monitoring daemon
    daemon = start_monitoring_daemon()
    if not daemon:
        logger.warn("Failed to start daemon, continuing without monitoring", operation="main", **trace_context)
    
    logger.info(
        "Auto-PR Session Manager started successfully",
        operation="main",
        session_id=session_id,
        daemon_pid=daemon.pid if daemon else None,
        **trace_context
    )
    
    # Keep process alive (for daemon mode)
    if "--daemon" in sys.argv:
        try:
            while True:
                time.sleep(60)  # Check every minute
                # Check if daemon is still running
                if daemon and daemon.poll() is not None:
                    logger.warn(
                        "Daemon process died, restarting",
                        operation="main",
                        exit_code=daemon.returncode,
                        **trace_context
                    )
                    daemon = start_monitoring_daemon()
        except KeyboardInterrupt:
            signal_handler(signal.SIGINT, None)
    else:
        # Interactive mode - for VSCode tasks, exit immediately after starting
        # The daemon will continue running in the background
        # Use logger (which writes to stdout) to avoid PowerShell stderr issues
        logger.info("Session Manager started successfully", operation="start_session")
        logger.info(f"Session ID: {session_id}", operation="start_session")
        logger.info(f"Monitoring: {'Active' if daemon else 'Inactive'}", operation="start_session")
        logger.info("Daemon running in background. Session will complete automatically on Cursor close.", operation="start_session")
        
        # For VSCode tasks, exit immediately (daemon runs in background)
        # The task will complete, but the daemon process continues
        sys.exit(0)


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        # Handle Ctrl+C gracefully
        try:
            signal_handler(signal.SIGINT, None)
        except Exception:
            pass
    except Exception as e:
        # Catch any unexpected exceptions to prevent exit code 1
        # Log the error but don't fail the task
        try:
            logger.error(
                "Unexpected error in main (non-fatal)",
                operation="__main__",
                error=e,
                error_type=type(e).__name__,
                **trace_context
            )
        except Exception:
            # If logging fails, use stdout fallback
            print(f"ERROR: Unexpected error in main (non-fatal): {e}", flush=True)                                                                              

        # Exit with code 0 to prevent task failure
        # The daemon may still be running, which is acceptable
    finally:
        # Always exit with code 0 to ensure PowerShell doesn't treat this as a failure
        # The daemon continues running in the background regardless
        sys.exit(0)

