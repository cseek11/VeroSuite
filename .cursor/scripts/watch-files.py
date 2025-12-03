#!/usr/bin/env python3
"""
VeroField File Watcher
Cross-platform file watcher that triggers auto-enforcer on file changes.

Features:
- Monitors key directories for file changes
- Debounces rapid changes (2-second delay)
- Works on Windows, macOS, and Linux
- Background process support
- Graceful shutdown handling

Last Updated: 2025-12-02
"""

import os
import sys
import time
import signal
import subprocess
from pathlib import Path
from typing import Optional
from threading import Timer

# Add project root to path
project_root = Path(__file__).parent.parent.parent
sys.path.insert(0, str(project_root))

try:
    from watchdog.observers import Observer
    from watchdog.events import FileSystemEventHandler, FileSystemEvent
except ImportError:
    print("❌ Missing watchdog package. Install with: pip install watchdog", file=sys.stderr)
    sys.exit(1)

try:
    from logger_util import get_logger, get_or_create_trace_context
    logger = get_logger(context="watch_files")
except ImportError:
    # Fallback logger if logger_util not available
    import logging
    logging.basicConfig(level=logging.INFO)
    logger = logging.getLogger("watch_files")

# Import workflow tracker (optional)
try:
    context_manager_path = project_root / ".cursor" / "context_manager"
    if context_manager_path.exists():
        sys.path.insert(0, str(context_manager_path.parent))
        from context_manager.workflow_tracker import WorkflowTracker
        WORKFLOW_TRACKER_AVAILABLE = True
    else:
        WORKFLOW_TRACKER_AVAILABLE = False
except ImportError:
    WORKFLOW_TRACKER_AVAILABLE = False

# Import rule file manager (optional)
try:
    context_manager_path = project_root / ".cursor" / "context_manager"
    if context_manager_path.exists():
        sys.path.insert(0, str(context_manager_path.parent))
        from context_manager.rule_file_manager import RuleFileManager
        from context_manager.context_categorizer import ContextCategorizer
        RULE_FILE_MANAGER_AVAILABLE = True
    else:
        RULE_FILE_MANAGER_AVAILABLE = False
except ImportError:
    RULE_FILE_MANAGER_AVAILABLE = False


class EnforcementHandler(FileSystemEventHandler):
    """
    File system event handler that triggers enforcement checks.
    
    Features:
    - Debouncing to prevent excessive enforcement runs
    - Filters for relevant file types
    - Logs file change events
    """
    
    def __init__(self, debounce_seconds: float = 2.0):
        """
        Initialize handler.
        
        Args:
            debounce_seconds: Delay before triggering enforcement (default: 2.0)
        """
        super().__init__()
        self.debounce_seconds = debounce_seconds
        self.debounce_timer: Optional[Timer] = None
        self.project_root = Path(__file__).parent.parent.parent
        self.enforcer_script = self.project_root / ".cursor" / "scripts" / "auto-enforcer.py"
        
        # Initialize workflow tracker (if available)
        self.workflow_tracker = None
        if WORKFLOW_TRACKER_AVAILABLE:
            try:
                self.workflow_tracker = WorkflowTracker()
                logger.info(
                    "Workflow tracker initialized",
                    operation="__init__"
                )
            except Exception as e:
                logger.warn(
                    f"Failed to initialize workflow tracker: {e}",
                    operation="__init__",
                    error_code="WORKFLOW_TRACKER_INIT_FAILED",
                    root_cause=str(e)
                )
        
        # Track recent file changes for workflow detection
        self.recent_file_changes: List[tuple] = []  # List of (file_path, timestamp) tuples
        
        logger.info(
            "EnforcementHandler initialized",
            operation="__init__",
            debounce_seconds=debounce_seconds,
            enforcer_script=str(self.enforcer_script),
            workflow_tracking_enabled=self.workflow_tracker is not None
        )
    
    def on_any_event(self, event: FileSystemEvent):
        """
        Handle any file system event.
        
        Args:
            event: File system event
        """
        # Only process file modifications and creations
        if event.event_type not in ['modified', 'created', 'moved']:
            return
        
        # Skip if it's a directory
        if event.is_directory:
            return
        
        # Skip enforcement directory (to avoid recursion)
        if '.cursor/enforcement' in event.src_path:
            return
        
        # Skip context-*.mdc rule files (to avoid recursion)
        if '.cursor/enforcement/rules/context/context-' in event.src_path and event.src_path.endswith('.mdc'):
            return
        
        # Skip common non-source files
        skip_extensions = ['.pyc', '.pyo', '.pyd', '.so', '.dll', '.exe', '.log', '.tmp']
        if any(event.src_path.endswith(ext) for ext in skip_extensions):
            return
        
        # Skip node_modules and other build directories
        skip_dirs = ['node_modules', '.git', '__pycache__', '.next', '.nuxt', 'dist', 'build']
        if any(f'/{dir}/' in event.src_path or f'\\{dir}\\' in event.src_path for dir in skip_dirs):
            return
        
        logger.debug(
            "File change detected",
            operation="on_any_event",
            event_type=event.event_type,
            file_path=event.src_path
        )
        
        # Track file change for workflow detection (if workflow tracker available)
        if self.workflow_tracker:
            try:
                from datetime import datetime, timezone
                # Get relative path from project root
                try:
                    rel_path = str(Path(event.src_path).relative_to(self.project_root))
                except ValueError:
                    # Path not relative to project root, use as-is
                    rel_path = event.src_path
                
                # Store recent file change (will be processed when enforcer runs)
                self.recent_file_changes.append((rel_path, datetime.now(timezone.utc)))
                # Keep only last 20 changes
                if len(self.recent_file_changes) > 20:
                    self.recent_file_changes = self.recent_file_changes[-20:]
            except Exception as e:
                logger.debug(
                    f"Failed to track file change for workflow: {e}",
                    operation="on_any_event",
                    error_code="WORKFLOW_TRACK_FAILED",
                    root_cause=str(e)
                )
        
        # Cancel existing timer if present
        if self.debounce_timer and self.debounce_timer.is_alive():
            self.debounce_timer.cancel()
        
        # Create new debounced timer
        self.debounce_timer = Timer(self.debounce_seconds, self.run_enforcer)
        self.debounce_timer.start()
    
    def run_enforcer(self):
        """Run the auto-enforcer script."""
        try:
            logger.info(
                "Running auto-enforcer",
                operation="run_enforcer",
                enforcer_script=str(self.enforcer_script)
            )
            
            # Run enforcer in subprocess
            # Increased timeout to 180 seconds to handle large codebases and context updates
            result = subprocess.run(
                [sys.executable, str(self.enforcer_script)],
                cwd=self.project_root,
                capture_output=True,
                text=True,
                timeout=180  # Increased from 120 to 180 seconds (3 minutes)
            )
            
            if result.returncode == 0:
                logger.info(
                    "Auto-enforcer completed successfully",
                    operation="run_enforcer"
                )
            else:
                logger.warn(
                    "Auto-enforcer completed with warnings",
                    operation="run_enforcer",
                    return_code=result.returncode,
                    stderr=result.stderr[:500] if result.stderr else None
                )
        except subprocess.TimeoutExpired:
            logger.error(
                "Auto-enforcer timed out",
                operation="run_enforcer",
                error_code="ENFORCER_TIMEOUT"
            )
        except Exception as e:
            logger.error(
                "Failed to run auto-enforcer",
                operation="run_enforcer",
                error_code="ENFORCER_RUN_FAILED",
                root_cause=str(e)
            )


class RuleFileUpdateHandler(FileSystemEventHandler):
    """
    File system event handler that updates rule files when core context source files change.
    
    Features:
    - Monitors core context source files (schema.prisma, ARCHITECTURE.md, etc.)
    - Debounces rapid changes (2-second delay)
    - Triggers RuleFileManager.update_rule_file() on source file changes
    """
    
    def __init__(self, debounce_seconds: float = 2.0):
        """
        Initialize handler.
        
        Args:
            debounce_seconds: Delay before triggering rule file update (default: 2.0)
        """
        super().__init__()
        self.debounce_seconds = debounce_seconds
        self.debounce_timer: Optional[Timer] = None
        self.project_root = Path(__file__).parent.parent.parent
        
        # Initialize rule file manager and categorizer
        self.rule_file_manager = None
        self.categorizer = None
        
        if RULE_FILE_MANAGER_AVAILABLE:
            try:
                self.rule_file_manager = RuleFileManager()
                self.categorizer = ContextCategorizer()
                logger.info(
                    "RuleFileUpdateHandler initialized",
                    operation="__init__",
                    debounce_seconds=debounce_seconds
                )
            except Exception as e:
                logger.warn(
                    f"Failed to initialize rule file manager: {e}",
                    operation="__init__",
                    error_code="RULE_FILE_MANAGER_INIT_FAILED",
                    root_cause=str(e)
                )
        else:
            logger.debug(
                "Rule file manager not available",
                operation="__init__"
            )
    
    def on_modified(self, event: FileSystemEvent):
        """
        Handle file modification events.
        
        Args:
            event: File system event
        """
        # Only process file modifications
        if event.is_directory:
            return
        
        # Check if source file changed (schema.prisma, ARCHITECTURE.md, etc.)
        if self._is_core_context_source(event.src_path):
            logger.debug(
                "Core context source file changed",
                operation="on_modified",
                file_path=event.src_path
            )
            # Debounce and trigger rule file update
            self._debounce_update(event.src_path)
    
    def on_created(self, event: FileSystemEvent):
        """
        Handle file creation events.
        
        Args:
            event: File system event
        """
        # Only process file creations
        if event.is_directory:
            return
        
        # Check if source file created (schema.prisma, ARCHITECTURE.md, etc.)
        if self._is_core_context_source(event.src_path):
            logger.debug(
                "Core context source file created",
                operation="on_created",
                file_path=event.src_path
            )
            # Debounce and trigger rule file update
            self._debounce_update(event.src_path)
    
    def _is_core_context_source(self, file_path: str) -> bool:
        """
        Check if file is a core context source file.
        
        Args:
            file_path: File path to check
            
        Returns:
            True if file is a core context source, False otherwise
        """
        if not self.categorizer:
            return False
        
        try:
            # Get relative path from project root
            try:
                rel_path = str(Path(file_path).relative_to(self.project_root))
            except ValueError:
                # Path not relative to project root, use as-is
                rel_path = file_path
            
            # Check if it's a core file
            return self.categorizer._is_core_file(rel_path)
        except Exception as e:
            logger.debug(
                f"Failed to check if core context source: {e}",
                operation="_is_core_context_source",
                error_code="CHECK_FAILED",
                root_cause=str(e),
                file_path=file_path
            )
            return False
    
    def _debounce_update(self, source_path: str):
        """
        Debounce rule file update to prevent excessive updates.
        
        Args:
            source_path: Path to source file that changed
        """
        if not self.rule_file_manager:
            return
        
        # Cancel existing timer if present
        if self.debounce_timer and self.debounce_timer.is_alive():
            self.debounce_timer.cancel()
        
        # Create new debounced timer
        self.debounce_timer = Timer(
            self.debounce_seconds,
            lambda: self._update_rule_file(source_path)
        )
        self.debounce_timer.start()
    
    def _update_rule_file(self, source_path: str):
        """
        Update rule file for changed source file.
        
        Args:
            source_path: Path to source file that changed
        """
        if not self.rule_file_manager:
            return
        
        try:
            logger.info(
                "Updating rule file for source file change",
                operation="_update_rule_file",
                source_path=source_path
            )
            
            # Update rule file
            success = self.rule_file_manager.update_rule_file(source_path)
            
            if success:
                logger.info(
                    "Rule file updated successfully",
                    operation="_update_rule_file",
                    source_path=source_path
                )
            else:
                logger.debug(
                    "Rule file update not needed or failed",
                    operation="_update_rule_file",
                    source_path=source_path
                )
        except Exception as e:
            logger.error(
                f"Failed to update rule file: {e}",
                operation="_update_rule_file",
                error_code="RULE_FILE_UPDATE_FAILED",
                root_cause=str(e),
                source_path=source_path
            )


class FileWatcher:
    """
    Main file watcher orchestrator.
    
    Features:
    - File system monitoring via watchdog
    - Multiple directory watching
    - Graceful shutdown handling
    """
    
    # Directories to watch
    # Watch project root to monitor all directories
    WATCH_DIRECTORIES = [
        "."  # Project root - watches all directories
    ]
    
    def __init__(self, debounce_seconds: float = 2.0):
        """
        Initialize file watcher.
        
        Args:
            debounce_seconds: Delay before triggering enforcement (default: 2.0)
        """
        self.project_root = Path(__file__).parent.parent.parent
        self.debounce_seconds = debounce_seconds
        self.observer: Optional[Observer] = None
        self.running = False
        
        logger.info(
            "FileWatcher initialized",
            operation="__init__",
            project_root=str(self.project_root),
            debounce_seconds=debounce_seconds
        )
    
    def start(self):
        """Start watching for file changes."""
        if self.running:
            logger.warn(
                "File watcher already running",
                operation="start"
            )
            return
        
        try:
            self.observer = Observer()
            enforcement_handler = EnforcementHandler(debounce_seconds=self.debounce_seconds)
            
            # Watch all specified directories with enforcement handler
            watched_count = 0
            for watch_dir in self.WATCH_DIRECTORIES:
                watch_path = self.project_root / watch_dir
                if watch_path.exists():
                    self.observer.schedule(enforcement_handler, str(watch_path), recursive=True)
                    watched_count += 1
                    logger.info(
                        "Watching directory",
                        operation="start",
                        directory=str(watch_path)
                    )
                else:
                    logger.debug(
                        "Directory not found, skipping",
                        operation="start",
                        directory=str(watch_path)
                    )
            
            # Watch core context source directories with rule file update handler
            if RULE_FILE_MANAGER_AVAILABLE:
                rule_file_handler = RuleFileUpdateHandler(debounce_seconds=self.debounce_seconds)
                
                # Core context source directories to watch
                core_source_dirs = [
                    "libs/common/prisma",  # schema.prisma
                    "docs",                # ARCHITECTURE.md
                    ".",                   # .env.example (root)
                ]
                
                for source_dir in core_source_dirs:
                    source_path = self.project_root / source_dir
                    if source_path.exists():
                        self.observer.schedule(rule_file_handler, str(source_path), recursive=True)
                        watched_count += 1
                        logger.info(
                            "Watching core context source directory",
                            operation="start",
                            directory=str(source_path)
                        )
            
            if watched_count == 0:
                logger.warn(
                    "No directories to watch",
                    operation="start"
                )
                return
            
            self.observer.start()
            self.running = True
            
            logger.info(
                "File watcher started",
                operation="start",
                watched_directories=watched_count
            )
            
            # Run initial enforcement check
            enforcement_handler.run_enforcer()
            
        except Exception as e:
            logger.error(
                "Failed to start file watcher",
                operation="start",
                error_code="WATCHER_START_FAILED",
                root_cause=str(e)
            )
            raise
    
    def stop(self):
        """Stop watching for file changes."""
        if not self.running:
            return
        
        try:
            if self.observer:
                self.observer.stop()
                self.observer.join(timeout=5)
            self.running = False
            
            logger.info(
                "File watcher stopped",
                operation="stop"
            )
        except Exception as e:
            logger.error(
                "Failed to stop file watcher",
                operation="stop",
                error_code="WATCHER_STOP_FAILED",
                root_cause=str(e)
            )
    
    def run(self):
        """Run file watcher (blocking)."""
        # Set up signal handlers for graceful shutdown
        def signal_handler(signum, frame):
            logger.info(
                "Received shutdown signal",
                operation="run",
                signal=signum
            )
            self.stop()
            sys.exit(0)
        
        signal.signal(signal.SIGINT, signal_handler)
        signal.signal(signal.SIGTERM, signal_handler)
        
        try:
            self.start()
            
            # Keep running until interrupted
            while self.running:
                time.sleep(1)
        except KeyboardInterrupt:
            logger.info(
                "Keyboard interrupt received",
                operation="run"
            )
            self.stop()
        except Exception as e:
            logger.error(
                "File watcher error",
                operation="run",
                error_code="WATCHER_ERROR",
                root_cause=str(e)
            )
            self.stop()
            raise


def main():
    """Main entry point for standalone script."""
    watcher = FileWatcher(debounce_seconds=2.0)
    watcher.run()


if __name__ == '__main__':
    main()





