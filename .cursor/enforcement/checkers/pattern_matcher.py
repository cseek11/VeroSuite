"""
File pattern matching for intelligent checker routing.

Python Bible Chapter 12: Performance optimization.
"""

import fnmatch
from pathlib import Path
from typing import List, Set


def match_file_patterns(file_path: str, patterns: List[str]) -> bool:
    """
    Check if a file path matches any of the given patterns.
    
    Supports:
    - Glob patterns (e.g., "**/*.ts", "apps/*/src/**/*.ts")
    - Simple patterns (e.g., "*.py", "**/test/**")
    
    Python Bible Chapter 12: Performance optimization with early exit.
    
    Args:
        file_path: File path to check (relative to project root)
        patterns: List of glob patterns to match against
        
    Returns:
        True if file matches any pattern, False otherwise
    """
    if not patterns:
        return False
    
    # Normalize path separators
    normalized_path = file_path.replace('\\', '/')
    
    for pattern in patterns:
        pattern = pattern.strip()
        if not pattern:
            continue
        
        # Normalize pattern separators
        normalized_pattern = pattern.replace('\\', '/')
        
        # Use fnmatch for glob pattern matching
        if fnmatch.fnmatch(normalized_path, normalized_pattern):
            return True
        
        # Also try matching against path components
        # e.g., "apps/api/src" should match pattern "apps/*/src/**"
        path_parts = normalized_path.split('/')
        pattern_parts = normalized_pattern.split('/')
        
        # Simple wildcard matching for path components
        if _match_path_components(path_parts, pattern_parts):
            return True
    
    return False


def _match_path_components(path_parts: List[str], pattern_parts: List[str]) -> bool:
    """
    Match path components against pattern components.
    
    Supports:
    - * matches any single component
    - ** matches any number of components
    - Exact matches
    
    Args:
        path_parts: List of path components
        pattern_parts: List of pattern components
        
    Returns:
        True if path matches pattern
    """
    if not pattern_parts:
        return not path_parts
    
    if not path_parts:
        # Path exhausted - pattern must be all ** or empty
        return all(p == '**' for p in pattern_parts)
    
    pattern = pattern_parts[0]
    path = path_parts[0]
    
    if pattern == '**':
        # ** matches zero or more components
        # Try matching remaining pattern against current position
        if _match_path_components(path_parts, pattern_parts[1:]):
            return True
        # Try matching ** against next path component
        if _match_path_components(path_parts[1:], pattern_parts):
            return True
        return False
    elif pattern == '*':
        # * matches any single component
        return _match_path_components(path_parts[1:], pattern_parts[1:])
    elif pattern == path:
        # Exact match
        return _match_path_components(path_parts[1:], pattern_parts[1:])
    else:
        # No match
        return False


def get_matching_files(changed_files: List[str], patterns: List[str]) -> Set[str]:
    """
    Get all files from changed_files that match any of the patterns.
    
    Args:
        changed_files: List of file paths
        patterns: List of glob patterns
        
    Returns:
        Set of matching file paths
    """
    matching = set()
    for file_path in changed_files:
        if match_file_patterns(file_path, patterns):
            matching.add(file_path)
    return matching




