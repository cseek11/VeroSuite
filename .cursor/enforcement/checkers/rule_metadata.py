"""
Rule metadata parser with module-level caching.

Python Bible Chapter 12.7.1: LRU Cache for expensive repeated computations.
"""

import re
from pathlib import Path
from typing import Dict, Optional, List
from functools import lru_cache

from .exceptions import RuleMetadataError


@lru_cache(maxsize=64)  # Cache up to 64 rule files
def parse_rule_metadata(rule_file: Path) -> Dict[str, any]:
    """
    Parse metadata from a rule file (.mdc file).
    
    Rule files have YAML frontmatter:
    ---
    description: "..."
    alwaysApply: true/false
    globs: "pattern1,pattern2"
    pathPatterns: ["pattern1", "pattern2"]
    ---
    
    Python Bible Chapter 12.7.1: LRU Cache for expensive repeated computations.
    
    Args:
        rule_file: Path to the rule file
        
    Returns:
        Dictionary with parsed metadata:
        - description: str
        - alwaysApply: bool
        - globs: List[str] (from globs or pathPatterns)
        - filePatterns: List[str] (from globs or pathPatterns)
        
    Raises:
        RuleMetadataError: If metadata cannot be parsed
    """
    if not rule_file.exists():
        raise RuleMetadataError(f"Rule file not found: {rule_file}")
    
    try:
        content = rule_file.read_text(encoding='utf-8')
    except Exception as e:
        raise RuleMetadataError(f"Failed to read rule file {rule_file}: {e}")
    
    # Extract YAML frontmatter (between --- markers)
    frontmatter_match = re.match(r'^---\s*\n(.*?)\n---\s*\n', content, re.DOTALL)
    if not frontmatter_match:
        # No frontmatter - return defaults
        return {
            'description': '',
            'alwaysApply': False,
            'globs': [],
            'filePatterns': [],
        }
    
    frontmatter = frontmatter_match.group(1)
    metadata = {
        'description': '',
        'alwaysApply': False,
        'globs': [],
        'filePatterns': [],
    }
    
    # Parse YAML-like key-value pairs
    for line in frontmatter.split('\n'):
        line = line.strip()
        if not line or line.startswith('#'):
            continue
        
        # Match key: value pattern
        match = re.match(r'^(\w+):\s*(.+)$', line)
        if not match:
            continue
        
        key = match.group(1).strip()
        value = match.group(2).strip()
        
        # Remove quotes if present
        if value.startswith('"') and value.endswith('"'):
            value = value[1:-1]
        elif value.startswith("'") and value.endswith("'"):
            value = value[1:-1]
        
        if key == 'description':
            metadata['description'] = value
        elif key == 'alwaysApply':
            metadata['alwaysApply'] = value.lower() in ('true', '1', 'yes')
        elif key == 'globs':
            # Split by comma and strip
            patterns = [p.strip() for p in value.split(',')]
            metadata['globs'] = patterns
            metadata['filePatterns'] = patterns  # Alias
        elif key == 'pathPatterns':
            # Parse as YAML list (e.g., ["pattern1", "pattern2"])
            # Simple parsing: extract quoted strings
            patterns = re.findall(r'["\']([^"\']+)["\']', value)
            if not patterns:
                # Try without quotes
                patterns = [p.strip() for p in value.strip('[]').split(',')]
            metadata['filePatterns'] = [p.strip() for p in patterns]
            if not metadata['globs']:
                metadata['globs'] = metadata['filePatterns']
    
    return metadata


def get_rule_metadata(rule_file: Path) -> Dict[str, any]:
    """
    Get rule metadata (wrapper for cached function).
    
    Args:
        rule_file: Path to the rule file
        
    Returns:
        Dictionary with parsed metadata
    """
    return parse_rule_metadata(rule_file)



