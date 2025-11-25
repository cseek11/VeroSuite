#!/usr/bin/env python3
"""
VeroScore V3 - File Watcher
Main entry point for file monitoring and session management.

Phase 2: File Watcher Implementation
Last Updated: 2025-11-24

Usage:
    python .cursor/scripts/file_watcher.py [--config CONFIG_FILE] [--watch-dir DIR]
"""

import os
import sys
import time
import argparse
import signal
from pathlib import Path
from typing import Optional

# Add project root to path
project_root = Path(__file__).parent.parent.parent
sys.path.insert(0, str(project_root))

try:
    from watchdog.observers import Observer
except ImportError:
    print("❌ Missing watchdog package. Install with: pip install watchdog", file=sys.stderr)
    sys.exit(1)

try:
    from supabase import create_client, Client
except ImportError:
    print("❌ Missing supabase-py package. Install with: pip install supabase", file=sys.stderr)
    sys.exit(1)

try:
    import yaml
except ImportError:
    print("❌ Missing pyyaml package. Install with: pip install pyyaml", file=sys.stderr)
    sys.exit(1)

from veroscore_v3.change_handler import VeroFieldChangeHandler
from veroscore_v3.change_buffer import ChangeBuffer
from veroscore_v3.session_manager import SessionManager
from veroscore_v3.threshold_checker import ThresholdChecker
from logger_util import get_logger, get_or_create_trace_context

logger = get_logger(context="file_watcher")


class FileWatcher:
    """
    Main file watcher orchestrator.
    
    Features:
    - File system monitoring via watchdog
    - Session management via Supabase
    - Change buffering and debouncing
    - Threshold checking for PR creation
    """
    
    def __init__(self, config_path: Optional[Path] = None, watch_dir: Optional[str] = None):
        """
        Initialize file watcher.
        
        Args:
            config_path: Path to config file (default: .cursor/config/auto_pr_config.yaml)
            watch_dir: Directory to watch (default: project root)
        """
        self.config_path = config_path or (project_root / ".cursor" / "config" / "auto_pr_config.yaml")
        self.watch_dir = watch_dir or str(project_root)
        self.config = self._load_config()
        self.observer: Optional[Observer] = None
        self.running = False
        
        # Initialize Supabase
        self.supabase = self._init_supabase()
        
        # Initialize components
        self.session_manager = SessionManager(self.supabase)
        self.buffer = ChangeBuffer(debounce_seconds=self.config.get("thresholds", {}).get("debounce_seconds", 2.0))
        self.threshold_checker = ThresholdChecker(self.config, self.session_manager)
        
        # Set flush callback
        self.buffer.flush_callback = self._flush_changes
        
        # Get or create session
        self.session_id = self.session_manager.get_or_create_session()
        
        logger.info(
            "FileWatcher initialized",
            operation="__init__",
            session_id=self.session_id,
            watch_dir=self.watch_dir,
            config_path=str(self.config_path)
        )
    
    def _load_config(self) -> dict:
        """Load configuration from YAML file."""
        try:
            if not self.config_path.exists():
                logger.warn(
                    "Config file not found, using defaults",
                    operation="_load_config",
                    error_code="CONFIG_NOT_FOUND",
                    config_path=str(self.config_path)
                )
                return self._get_default_config()
            
            with open(self.config_path, 'r', encoding='utf-8') as f:
                config = yaml.safe_load(f)
                logger.info(
                    "Config loaded",
                    operation="_load_config",
                    config_path=str(self.config_path)
                )
                return config or {}
                
        except Exception as e:
            logger.error(
                "Failed to load config, using defaults",
                operation="_load_config",
                error_code="CONFIG_LOAD_FAILED",
                root_cause=str(e),
                config_path=str(self.config_path)
            )
            return self._get_default_config()
    
    def _get_default_config(self) -> dict:
        """Get default configuration."""
        return {
            "thresholds": {
                "min_files": 3,
                "min_lines": 50,
                "max_wait_seconds": 300,
                "debounce_seconds": 2.0,
                "batch_size": 10
            },
            "exclusions": {
                "patterns": []
            }
        }
    
    def _init_supabase(self) -> Client:
        """Initialize Supabase client."""
        try:
            supabase_url = os.getenv("SUPABASE_URL")
            supabase_key = os.getenv("SUPABASE_SECRET_KEY")
            
            if not supabase_url or not supabase_key:
                raise ValueError(
                    "Missing SUPABASE_URL or SUPABASE_SECRET_KEY environment variables"
                )
            
            client = create_client(supabase_url, supabase_key)
            
            logger.info(
                "Supabase client initialized",
                operation="_init_supabase",
                url=supabase_url
            )
            
            return client
            
        except Exception as e:
            logger.error(
                "Failed to initialize Supabase client",
                operation="_init_supabase",
                error_code="SUPABASE_INIT_FAILED",
                root_cause=str(e)
            )
            raise
    
    def _flush_changes(self):
        """Flush buffered changes to Supabase."""
        try:
            trace_ctx = get_or_create_trace_context()
            
            changes = self.buffer.get_all()
            if not changes:
                return
            
            # Add changes to session
            self.session_manager.add_changes_batch(self.session_id, changes)
            
            # Check if PR should be created
            should_create, reason = self.threshold_checker.should_create_pr(self.session_id)
            if should_create:
                logger.info(
                    "PR creation threshold met",
                    operation="_flush_changes",
                    session_id=self.session_id,
                    reason=reason,
                    change_count=len(changes),
                    **trace_ctx
                )
                # Phase 3: Trigger PR creation
                try:
                    from veroscore_v3.pr_creator import PRCreator
                    pr_creator = PRCreator(self.supabase, project_root)
                    pr_result = pr_creator.create_pr(self.session_id)
                    if pr_result:
                        logger.info(
                            "PR created successfully from file watcher",
                            operation="_flush_changes",
                            session_id=self.session_id,
                            pr_number=pr_result.get('pr_number'),
                            pr_url=pr_result.get('pr_url'),
                            **trace_ctx
                        )
                    else:
                        logger.warn(
                            "PR creation returned None",
                            operation="_flush_changes",
                            session_id=self.session_id,
                            **trace_ctx
                        )
                except Exception as e:
                    logger.error(
                        "Failed to create PR from file watcher",
                        operation="_flush_changes",
                        error_code="PR_CREATION_FROM_WATCHER_FAILED",
                        root_cause=str(e),
                        session_id=self.session_id,
                        **trace_ctx
                    )
                    # Don't raise - file watcher should continue running
            else:
                logger.debug(
                    "Changes flushed, PR threshold not met",
                    operation="_flush_changes",
                    session_id=self.session_id,
                    change_count=len(changes),
                    **trace_ctx
                )
                
        except Exception as e:
            logger.error(
                "Failed to flush changes",
                operation="_flush_changes",
                error_code="FLUSH_CHANGES_FAILED",
                root_cause=str(e),
                session_id=self.session_id
            )
    
    def start(self):
        """Start file watcher."""
        try:
            trace_ctx = get_or_create_trace_context()
            
            # Create event handler
            handler = VeroFieldChangeHandler(
                session_id=self.session_id,
                config=self.config,
                buffer=self.buffer
            )
            
            # Create observer
            self.observer = Observer()
            self.observer.schedule(handler, self.watch_dir, recursive=True)
            
            # Start observer
            self.observer.start()
            self.running = True
            
            logger.info(
                "File watcher started",
                operation="start",
                session_id=self.session_id,
                watch_dir=self.watch_dir,
                **trace_ctx
            )
            
        except Exception as e:
            logger.error(
                "Failed to start file watcher",
                operation="start",
                error_code="WATCHER_START_FAILED",
                root_cause=str(e),
                session_id=self.session_id
            )
            raise
    
    def stop(self):
        """Stop file watcher."""
        try:
            trace_ctx = get_or_create_trace_context()
            
            if self.observer:
                self.observer.stop()
                self.observer.join(timeout=5)
            
            # Flush any remaining changes
            self._flush_changes()
            
            self.running = False
            
            logger.info(
                "File watcher stopped",
                operation="stop",
                session_id=self.session_id,
                **trace_ctx
            )
            
        except Exception as e:
            logger.error(
                "Failed to stop file watcher",
                operation="stop",
                error_code="WATCHER_STOP_FAILED",
                root_cause=str(e),
                session_id=self.session_id
            )
    
    def run(self):
        """Run file watcher (blocking)."""
        try:
            self.start()
            
            # Set up signal handlers for graceful shutdown
            signal.signal(signal.SIGINT, self._signal_handler)
            signal.signal(signal.SIGTERM, self._signal_handler)
            
            # Keep running until stopped
            while self.running:
                time.sleep(1)
                
        except KeyboardInterrupt:
            logger.info(
                "File watcher interrupted by user",
                operation="run",
                session_id=self.session_id
            )
        except Exception as e:
            logger.error(
                "File watcher error",
                operation="run",
                error_code="WATCHER_RUN_ERROR",
                root_cause=str(e),
                session_id=self.session_id
            )
        finally:
            self.stop()
    
    def _signal_handler(self, signum, frame):
        """Handle shutdown signals."""
        logger.info(
            "Received shutdown signal",
            operation="_signal_handler",
            signal=signum,
            session_id=self.session_id
        )
        self.running = False


def main():
    """Main entry point."""
    parser = argparse.ArgumentParser(
        description="VeroScore V3 File Watcher - Monitor file changes and manage sessions"
    )
    parser.add_argument(
        "--config",
        type=Path,
        help="Path to config file (default: .cursor/config/auto_pr_config.yaml)"
    )
    parser.add_argument(
        "--watch-dir",
        type=str,
        help="Directory to watch (default: project root)"
    )
    
    args = parser.parse_args()
    
    try:
        watcher = FileWatcher(config_path=args.config, watch_dir=args.watch_dir)
        watcher.run()
        return 0
    except Exception as e:
        logger.error(
            "File watcher failed",
            operation="main",
            error_code="WATCHER_MAIN_FAILED",
            root_cause=str(e)
        )
        return 1


if __name__ == '__main__':
    sys.exit(main())

