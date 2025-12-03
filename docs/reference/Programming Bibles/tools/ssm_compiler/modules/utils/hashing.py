"""
Hashing utilities for ID generation
"""
from __future__ import annotations

import hashlib


def make_id(prefix: str, content: str, length: int = 12) -> str:
    """
    Generate stable content-based IDs using SHA1 hash.
    
    Args:
        prefix: ID prefix (e.g., "CH", "CODE", "TERM")
        content: Content to hash
        length: Length of hash suffix (default: 12)
    
    Returns:
        Formatted ID: "{prefix}-{hash}"
    """
    h = hashlib.sha1(content.encode("utf-8")).hexdigest()[:length]
    return f"{prefix}-{h}"


def sha1_id(prefix: str, content: str, length: int = 16) -> str:
    """
    Alias for make_id with default length 16 (for compatibility).
    
    Args:
        prefix: ID prefix
        content: Content to hash
        length: Length of hash suffix (default: 16)
    
    Returns:
        Formatted ID: "{prefix}-{hash}"
    """
    return make_id(prefix, content, length)

