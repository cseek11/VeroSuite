#!/usr/bin/env python3
"""
Stop all running session managers and monitoring daemons.

This script ensures no conflicts between old and new systems.
"""

import os
import signal
import subprocess
import sys
from pathlib import Path

try:
    from logger_util import get_logger, get_or_create_trace_context
    logger = get_logger(context="stop_all_session_managers")
    trace_context = get_or_create_trace_context()
except ImportError:
    import logging
    logger = logging.getLogger("stop_all_session_managers")
    trace_context = {"traceId": None, "spanId": None, "requestId": None}


def get_python_processes():
    """Get all Python processes related to session management."""
    processes = []
    
    try:
        if sys.platform == "win32":
            # Windows: Use wmic or tasklist
            try:
                result = subprocess.run(
                    ["wmic", "process", "where", "name='python.exe'", "get", "processid,commandline"],
                    capture_output=True,
                    text=True,
                    timeout=10
                )
                if result.returncode == 0:
                    lines = result.stdout.strip().split('\n')
                    for line in lines[1:]:  # Skip header
                        if line.strip() and any(keyword in line.lower() for keyword in 
                                              ['auto_pr', 'session', 'daemon', 'monitor', 'start_session_manager']):
                            # Extract PID (last number in line)
                            parts = line.strip().split()
                            if parts:
                                try:
                                    pid = int(parts[-1])
                                    processes.append(pid)
                                except ValueError:
                                    pass
            except Exception as e:
                logger.warn(f"Failed to get processes via wmic: {e}", operation="get_python_processes")
        else:
            # Unix/Linux: Use ps
            result = subprocess.run(
                ["ps", "aux"],
                capture_output=True,
                text=True,
                timeout=10
            )
            if result.returncode == 0:
                for line in result.stdout.split('\n'):
                    if any(keyword in line.lower() for keyword in 
                          ['auto_pr', 'session', 'daemon', 'monitor', 'start_session_manager']):
                        parts = line.split()
                        if len(parts) > 1:
                            try:
                                pid = int(parts[1])
                                processes.append(pid)
                            except ValueError:
                                pass
    except Exception as e:
        logger.error(
            "Error getting processes",
            operation="get_python_processes",
            error=str(e),
            **trace_context
        )
    
    return processes


def stop_process(pid):
    """Stop a process by PID."""
    try:
        if sys.platform == "win32":
            # Windows: Use taskkill
            result = subprocess.run(
                ["taskkill", "/F", "/PID", str(pid)],
                capture_output=True,
                text=True,
                timeout=5
            )
            return result.returncode == 0
        else:
            # Unix/Linux: Use kill
            os.kill(pid, signal.SIGTERM)
            return True
    except ProcessLookupError:
        # Process already dead
        return True
    except Exception as e:
        logger.warn(
            f"Failed to stop process {pid}",
            operation="stop_process",
            pid=pid,
            error=str(e),
            **trace_context
        )
        return False


def stop_by_pid_file():
    """Stop process using PID file if it exists."""
    pid_file = Path(__file__).parent / ".session_manager.pid"
    
    if not pid_file.exists():
        return False
    
    try:
        pid = int(pid_file.read_text().strip())
        logger.info(f"Found PID file with PID {pid}", operation="stop_by_pid_file", **trace_context)
        
        if stop_process(pid):
            pid_file.unlink()
            logger.info(f"Stopped process from PID file: {pid}", operation="stop_by_pid_file", **trace_context)
            return True
    except Exception as e:
        logger.warn(
            "Error reading/stopping process from PID file",
            operation="stop_by_pid_file",
            error=str(e),
            **trace_context
        )
        # Clean up invalid PID file
        try:
            pid_file.unlink()
        except:
            pass
    
    return False


def main():
    """Main cleanup function."""
    logger.info("Stopping all session managers and monitoring daemons", operation="main", **trace_context)
    
    stopped_count = 0
    
    # Stop process from PID file
    if stop_by_pid_file():
        stopped_count += 1
    
    # Find and stop all related processes
    processes = get_python_processes()
    
    logger.info(
        f"Found {len(processes)} related processes",
        operation="main",
        process_count=len(processes),
        **trace_context
    )
    
    for pid in processes:
        logger.info(f"Stopping process {pid}", operation="main", pid=pid, **trace_context)
        if stop_process(pid):
            stopped_count += 1
    
    # Clean up PID file
    pid_file = Path(__file__).parent / ".session_manager.pid"
    if pid_file.exists():
        try:
            pid_file.unlink()
            logger.info("Cleaned up PID file", operation="main", **trace_context)
        except Exception as e:
            logger.warn(f"Failed to remove PID file: {e}", operation="main", **trace_context)
    
    logger.info(
        f"Cleanup complete: stopped {stopped_count} processes",
        operation="main",
        stopped_count=stopped_count,
        **trace_context
    )
    
    print(f"Stopped {stopped_count} session manager process(es)")
    return stopped_count


if __name__ == "__main__":
    main()

