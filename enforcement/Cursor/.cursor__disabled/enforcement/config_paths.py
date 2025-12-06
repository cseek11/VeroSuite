#!/usr/bin/env python3
"""
Centralized path configuration for VeroField auto-enforcement system.

This module provides canonical path helpers for the new .ai/* structure,
where heavy assets (rules, memory-bank, patterns, large reports) are stored
outside of Cursor's hot context directory (.cursor/).

Last Updated: 2025-12-04
"""

from pathlib import Path
from typing import Optional


def get_project_root() -> Path:
    """
    Get project root directory.
    
    Uses the same logic as auto-enforcer.py: Path(__file__).parent.parent.parent
    when called from enforcement module, or searches for common root markers.
    """
    # Try to find project root by looking for common markers
    current = Path(__file__).resolve()
    
    # If we're in .cursor__disabled/enforcement/, go up 3 levels
    # If we're in enforcement/ (at root), go up 1 level
    # Check both possibilities
    possible_roots = [
        current.parent.parent.parent,  # .cursor__disabled/enforcement/config_paths.py -> root
        current.parent.parent,  # enforcement/config_paths.py -> root
    ]
    
    for root in possible_roots:
        # Check for common project root markers
        if (root / "package.json").exists() or \
           (root / "pyproject.toml").exists() or \
           (root / ".git").exists() or \
           (root / "README.md").exists():
            return root
    
    # Fallback: assume we're in .cursor__disabled/enforcement/ and go up 3 levels
    return current.parent.parent.parent


def get_ai_root(project_root: Optional[Path] = None) -> Path:
    """
    Get .ai root directory (second-brain data home).
    
    Args:
        project_root: Optional project root. If None, will be detected.
        
    Returns:
        Path to .ai/ directory
    """
    if project_root is None:
        project_root = get_project_root()
    return project_root / ".ai"


def get_rules_root(project_root: Optional[Path] = None) -> Path:
    """
    Get rules directory (.ai/rules).
    
    Args:
        project_root: Optional project root. If None, will be detected.
        
    Returns:
        Path to .ai/rules/ directory
    """
    rules_dir = get_ai_root(project_root) / "rules"
    # Ensure directory exists
    rules_dir.mkdir(parents=True, exist_ok=True)
    return rules_dir


def get_memory_bank_root(project_root: Optional[Path] = None) -> Path:
    """
    Get memory bank directory (.ai/memory_bank).
    
    Args:
        project_root: Optional project root. If None, will be detected.
        
    Returns:
        Path to .ai/memory_bank/ directory
    """
    memory_bank_dir = get_ai_root(project_root) / "memory_bank"
    # Ensure directory exists
    memory_bank_dir.mkdir(parents=True, exist_ok=True)
    return memory_bank_dir


def get_patterns_root(project_root: Optional[Path] = None) -> Path:
    """
    Get patterns directory (.ai/patterns).
    
    Args:
        project_root: Optional project root. If None, will be detected.
        
    Returns:
        Path to .ai/patterns/ directory
    """
    patterns_dir = get_ai_root(project_root) / "patterns"
    # Ensure directory exists
    patterns_dir.mkdir(parents=True, exist_ok=True)
    return patterns_dir


def get_enforcer_log_root(project_root: Optional[Path] = None) -> Path:
    """
    Get enforcer log directory (.ai/logs/enforcer).
    
    This is where full/heavy reports are written.
    
    Args:
        project_root: Optional project root. If None, will be detected.
        
    Returns:
        Path to .ai/logs/enforcer/ directory
    """
    log_dir = get_ai_root(project_root) / "logs" / "enforcer"
    # Ensure directory exists
    log_dir.mkdir(parents=True, exist_ok=True)
    return log_dir


def get_cursor_enforcer_root(project_root: Optional[Path] = None) -> Path:
    """
    Get cursor enforcement directory (.cursor/enforcement).
    
    This is where lightweight summaries are written.
    
    Args:
        project_root: Optional project root. If None, will be detected.
        
    Returns:
        Path to .cursor/enforcement/ directory
    """
    if project_root is None:
        project_root = get_project_root()
    enforcement_dir = project_root / ".cursor" / "enforcement"
    # Ensure directory exists
    enforcement_dir.mkdir(parents=True, exist_ok=True)
    return enforcement_dir


def get_cursor_logs_root(project_root: Optional[Path] = None) -> Path:
    """
    Get cursor logs directory (.cursor/logs).
    
    Args:
        project_root: Optional project root. If None, will be detected.
        
    Returns:
        Path to .cursor/logs/ directory
    """
    if project_root is None:
        project_root = get_project_root()
    logs_dir = project_root / ".cursor" / "logs"
    # Ensure directory exists
    logs_dir.mkdir(parents=True, exist_ok=True)
    return logs_dir













