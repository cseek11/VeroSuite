#!/usr/bin/env python3
"""
FileChange Dataclass for VeroScore V3
Represents a single file change event.

Last Updated: 2025-12-05
"""

from dataclasses import dataclass, asdict
from typing import Optional
from datetime import datetime, timezone


@dataclass(slots=True)  # Python 3.10+ - reduces memory by 4-5× (Chapter 07.5.3)
class FileChange:
    """
    Represents a single file change event.
    
    Attributes:
        path: Relative file path from repository root
        change_type: Type of change ('added', 'modified', 'deleted', 'renamed')
        timestamp: ISO 8601 timestamp of the change
        lines_added: Number of lines added (0 for deletions)
        lines_removed: Number of lines removed (0 for additions)
        old_path: Previous path (for renames only)
        commit_hash: Git commit hash if available
    """
    path: str
    change_type: str  # 'added', 'modified', 'deleted', 'renamed'
    timestamp: str
    lines_added: int = 0
    lines_removed: int = 0
    old_path: Optional[str] = None  # For renames
    commit_hash: Optional[str] = None
    
    def __post_init__(self):
        """Validate change_type."""
        valid_types = {'added', 'modified', 'deleted', 'renamed'}
        if self.change_type not in valid_types:
            raise ValueError(f"Invalid change_type: {self.change_type}. Must be one of {valid_types}")
    
    def to_dict(self) -> dict:
        """Convert to dictionary for JSON serialization."""
        return asdict(self)
    
    @classmethod
    def from_dict(cls, data: dict) -> 'FileChange':
        """Create FileChange from dictionary."""
        return cls(**data)
    
    def __eq__(self, other):
        """Equality based on path and timestamp."""
        if not isinstance(other, FileChange):
            return False
        return self.path == other.path and self.timestamp == other.timestamp
    
    def __hash__(self) -> int:
        """Hash based on path and timestamp for use in sets/dicts."""
        return hash((self.path, self.timestamp))
    
    @property
    def net_lines(self) -> int:
        """Net line change (added - removed)."""
        return self.lines_added - self.lines_removed
    
    @property
    def is_addition(self) -> bool:
        """True if file was added."""
        return self.change_type == 'added' and self.lines_removed == 0
    
    @property
    def is_deletion(self) -> bool:
        """True if file was deleted."""
        return self.change_type == 'deleted' and self.lines_added == 0



