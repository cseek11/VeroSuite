#!/usr/bin/env python3
"""
VeroFieldChangeHandler - File system event handler for watchdog.

Last Updated: 2025-11-24
"""

import os
import subprocess
from pathlib import Path
from typing import Set, Optional

try:
    from watchdog.events import FileSystemEventHandler, FileSystemEvent
    from watchdog.observers import Observer
except ImportError:
    FileSystemEventHandler = object  # Type hint fallback
    FileSystemEvent = object
    Observer = None

from .file_change import FileChange
from .change_buffer import ChangeBuffer
from .git_diff_analyzer import GitDiffAnalyzer
from logger_util import get_logger, get_or_create_trace_context

logger = get_logger(context="VeroFieldChangeHandler")


class VeroFieldChangeHandler(FileSystemEventHandler):
    """
    Handles file system events with intelligent filtering.
    
    Features:
    - Ignores temp files, build artifacts, .gitignore files
    - Gets accurate line counts via git diff
    - Processes changes through ChangeBuffer
    """
    
    # File extensions to ignore
    IGNORE_EXTENSIONS: Set[str] = {
        '.swp', '.tmp', '.log', '.pyc', '.pyo', '.pyd',
        '.so', '.dll', '.dylib', '.class', '.o', '.DS_Store',
    }
    
    # Path components to ignore
    IGNORE_PATHS: Set[str] = {
        '.git', '.idea', '.vscode', '__pycache__', 'node_modules',
        '.venv', 'venv', '.pytest_cache', 'dist', 'build', '.next',
        '.nuxt', '.output', 'coverage', '.nyc_output'
    }
    
    # Temp file patterns
    TEMP_PATTERNS: Set[str] = {'~', '#', '.bak', '.backup'}
    
    def __init__(
        self,
        session_id: str,
        config: dict,
        buffer: ChangeBuffer,
        repo_root: Optional[str] = None
    ):
        """
        Initialize change handler.
        
        Args:
            session_id: Current session ID
            config: Configuration dict
            buffer: ChangeBuffer instance
            repo_root: Repository root path (auto-detected if None)
        """
        super().__init__()
        self.session_id = session_id
        self.config = config
        self.buffer = buffer
        self.git_analyzer = GitDiffAnalyzer()
        
        # Get repository root
        if repo_root is None:
            self.repo_root = self.git_analyzer.get_repo_root()
        else:
            self.repo_root = repo_root
        
        # Get exclusion patterns from config
        exclusions = config.get("exclusions", {}).get("patterns", [])
        self.exclusion_patterns = exclusions
        
        logger.info(
            "VeroFieldChangeHandler initialized",
            operation="__init__",
            session_id=session_id,
            repo_root=self.repo_root
        )
    
    def should_ignore(self, file_path: str) -> bool:
        """
        Check if file should be ignored.
        
        Args:
            file_path: Absolute or relative file path
        
        Returns:
            True if file should be ignored
        """
        try:
            path = Path(file_path)
            
            # Check extension
            if path.suffix in self.IGNORE_EXTENSIONS:
                return True
            
            # Check temp patterns in filename
            if any(pattern in path.name for pattern in self.TEMP_PATTERNS):
                return True
            
            # Check path components
            if any(part in self.IGNORE_PATHS for part in path.parts):
                return True
            
            # Check config exclusion patterns
            for pattern in self.exclusion_patterns:
                # Simple pattern matching (supports * and **)
                if self._matches_pattern(str(path), pattern):
                    return True
            
            # Check .gitignore
            if self.repo_root:
                rel_path = os.path.relpath(file_path, self.repo_root) if os.path.isabs(file_path) else file_path
                if self.git_analyzer.is_git_ignored(rel_path, self.repo_root):
                    return True
            
            return False
            
        except Exception as e:
            logger.warn(
                "Error checking if file should be ignored",
                operation="should_ignore",
                error_code="IGNORE_CHECK_FAILED",
                root_cause=str(e),
                file_path=file_path
            )
            # Fail safe: ignore if check fails
            return True
    
    def _matches_pattern(self, file_path: str, pattern: str) -> bool:
        """Simple pattern matching for exclusion patterns."""
        # Convert glob pattern to simple matching
        if '**' in pattern:
            # Recursive match
            pattern_parts = pattern.split('**')
            return all(part in file_path for part in pattern_parts if part)
        elif '*' in pattern:
            # Single wildcard
            import fnmatch
            return fnmatch.fnmatch(file_path, pattern)
        else:
            # Exact match
            return pattern in file_path
    
    def on_modified(self, event: FileSystemEvent):
        """Handle file modification."""
        if event.is_directory or self.should_ignore(event.src_path):
            return
        
        self._process_change(event.src_path, 'modified')
    
    def on_created(self, event: FileSystemEvent):
        """Handle file creation."""
        if event.is_directory or self.should_ignore(event.src_path):
            return
        
        self._process_change(event.src_path, 'added')
    
    def on_deleted(self, event: FileSystemEvent):
        """Handle file deletion."""
        if event.is_directory or self.should_ignore(event.src_path):
            return
        
        self._process_change(event.src_path, 'deleted')
    
    def on_moved(self, event: FileSystemEvent):
        """Handle file move/rename."""
        if event.is_directory:
            return
        
        # Check if both paths should be ignored
        if self.should_ignore(event.src_path) and self.should_ignore(event.dest_path):
            return
        
        self._process_change(event.dest_path, 'renamed', old_path=event.src_path)
    
    def _process_change(self, file_path: str, change_type: str, old_path: Optional[str] = None):
        """
        Process a file change event.
        
        Args:
            file_path: File path
            change_type: Type of change
            old_path: Previous path (for renames)
        """
        try:
            trace_ctx = get_or_create_trace_context()
            
            # Get relative path from repo root
            if self.repo_root:
                try:
                    rel_path = os.path.relpath(file_path, self.repo_root)
                except ValueError:
                    # Paths on different drives (Windows)
                    rel_path = file_path
            else:
                rel_path = file_path
            
            # Get diff stats (only for modified/added files)
            lines_added = 0
            lines_removed = 0
            if change_type in ('modified', 'added') and self.repo_root:
                lines_added, lines_removed = self.git_analyzer.get_diff_stats(rel_path, self.repo_root)
            
            # Get commit hash if available
            commit_hash = self._get_current_commit_hash()
            
            # Create FileChange
            change = FileChange(
                path=rel_path,
                change_type=change_type,
                timestamp=os.path.getmtime(file_path) if os.path.exists(file_path) else None,
                lines_added=lines_added,
                lines_removed=lines_removed,
                old_path=old_path,
                commit_hash=commit_hash
            )
            
            # Add to buffer (will be debounced)
            self.buffer.add_change(change)
            
            logger.debug(
                "File change processed",
                operation="_process_change",
                file_path=rel_path,
                change_type=change_type,
                lines_added=lines_added,
                lines_removed=lines_removed,
                **trace_ctx
            )
            
        except Exception as e:
            logger.error(
                "Failed to process file change",
                operation="_process_change",
                error_code="CHANGE_PROCESS_FAILED",
                root_cause=str(e),
                file_path=file_path,
                change_type=change_type
            )
    
    def _get_current_commit_hash(self) -> Optional[str]:
        """Get current git commit hash."""
        try:
            if not self.repo_root:
                return None
            
            result = subprocess.run(
                ['git', 'rev-parse', 'HEAD'],
                cwd=self.repo_root,
                capture_output=True,
                text=True,
                check=False,
                timeout=5
            )
            
            if result.returncode == 0:
                return result.stdout.strip()[:12]  # Short hash
            return None
        except Exception:
            return None

