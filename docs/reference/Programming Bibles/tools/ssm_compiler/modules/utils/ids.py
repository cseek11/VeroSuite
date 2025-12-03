"""
ID management utilities
"""
from __future__ import annotations

from typing import List, Dict, Any


def ensure_ids_unique(blocks: List[Any]) -> None:
    """
    Ensure all block IDs are unique.
    
    Args:
        blocks: List of SSMBlock objects with 'id' attribute
    
    Note:
        If duplicates are found, they are automatically fixed by appending a counter.
    """
    seen_ids: Dict[str, int] = {}
    
    for b in blocks:
        if not b.id:
            continue
        if b.id in seen_ids:
            # Duplicate found - append counter to make unique
            counter = seen_ids[b.id]
            seen_ids[b.id] = counter + 1
            b.id = f"{b.id}-{counter}"
        else:
            seen_ids[b.id] = 1
