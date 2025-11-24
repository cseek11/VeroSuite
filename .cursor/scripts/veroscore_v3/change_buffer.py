#!/usr/bin/env python3
"""
ChangeBuffer - Thread-safe buffer with debouncing for file changes.

Last Updated: 2025-11-24
"""

import threading
from typing import Dict, List, Optional, Callable
from datetime import datetime, timezone

from .file_change import FileChange
from logger_util import get_logger

logger = get_logger(context="ChangeBuffer")


class ChangeBuffer:
    """
    Thread-safe buffer for accumulating changes with debouncing.
    
    Features:
    - Thread-safe operations
    - Debouncing (coalesces rapid changes to same file)
    - Flush callback support
    - Automatic timer management
    """
    
    def __init__(self, debounce_seconds: float = 2.0):
        """
        Initialize change buffer.
        
        Args:
            debounce_seconds: Time to wait before processing changes (default: 2.0)
        """
        self.changes: Dict[str, FileChange] = {}
        self.timers: Dict[str, threading.Timer] = {}
        self.lock = threading.Lock()
        self.debounce_seconds = debounce_seconds
        self.flush_callback: Optional[Callable[[], None]] = None
        
        logger.info(
            "ChangeBuffer initialized",
            operation="__init__",
            debounce_seconds=debounce_seconds
        )
    
    def add_change(self, change: FileChange):
        """
        Add change with debouncing - rapid changes to same file are coalesced.
        
        Args:
            change: FileChange instance to add
        """
        try:
            with self.lock:
                # Cancel existing timer for this file
                if change.path in self.timers:
                    timer = self.timers[change.path]
                    timer.cancel()
                    del self.timers[change.path]
                
                # Update change (overwrites previous)
                self.changes[change.path] = change
                
                # Set new timer
                timer = threading.Timer(
                    self.debounce_seconds,
                    self._process_change,
                    args=[change.path]
                )
                self.timers[change.path] = timer
                timer.start()
                
                logger.debug(
                    "Change added to buffer",
                    operation="add_change",
                    file_path=change.path,
                    change_type=change.change_type,
                    buffered_count=len(self.changes)
                )
        except Exception as e:
            logger.error(
                "Failed to add change to buffer",
                operation="add_change",
                error_code="BUFFER_ADD_FAILED",
                root_cause=str(e),
                file_path=change.path
            )
            raise
    
    def _process_change(self, file_path: str):
        """
        Called after debounce period - triggers flush if needed.
        
        Args:
            file_path: Path of file that triggered the timer
        """
        try:
            with self.lock:
                # Remove timer reference
                if file_path in self.timers:
                    del self.timers[file_path]
                
                # Trigger flush callback if set and we have changes
                if self.flush_callback and len(self.changes) > 0:
                    logger.debug(
                        "Debounce period expired, triggering flush",
                        operation="_process_change",
                        file_path=file_path,
                        buffered_count=len(self.changes)
                    )
                    self.flush_callback()
        except Exception as e:
            logger.error(
                "Failed to process change after debounce",
                operation="_process_change",
                error_code="BUFFER_PROCESS_FAILED",
                root_cause=str(e),
                file_path=file_path
            )
    
    def get_all(self) -> List[FileChange]:
        """
        Get all buffered changes and clear buffer.
        
        Returns:
            List of FileChange instances
        """
        try:
            with self.lock:
                # Cancel all pending timers
                for timer in self.timers.values():
                    timer.cancel()
                self.timers.clear()
                
                # Get all changes
                changes = list(self.changes.values())
                self.changes.clear()
                
                logger.debug(
                    "Retrieved all buffered changes",
                    operation="get_all",
                    change_count=len(changes)
                )
                
                return changes
        except Exception as e:
            logger.error(
                "Failed to get all changes from buffer",
                operation="get_all",
                error_code="BUFFER_GET_FAILED",
                root_cause=str(e)
            )
            raise
    
    def count(self) -> int:
        """
        Get count of buffered changes (non-destructive).
        
        Returns:
            Number of buffered changes
        """
        with self.lock:
            return len(self.changes)
    
    def clear(self):
        """Clear all buffered changes and cancel timers."""
        try:
            with self.lock:
                # Cancel all timers
                for timer in self.timers.values():
                    timer.cancel()
                self.timers.clear()
                
                # Clear changes
                count = len(self.changes)
                self.changes.clear()
                
                logger.debug(
                    "Buffer cleared",
                    operation="clear",
                    cleared_count=count
                )
        except Exception as e:
            logger.error(
                "Failed to clear buffer",
                operation="clear",
                error_code="BUFFER_CLEAR_FAILED",
                root_cause=str(e)
            )

