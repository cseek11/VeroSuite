"""
Canonical Ordering

Sorts and orders blocks in canonical format.
"""
from __future__ import annotations

from typing import List, Tuple
from ..ast_nodes import SSMBlock


BLOCK_TYPE_ORDER = [
    "chapter-meta",
    "chapter-graph-summary",
    "term",
    "concept",
    "fact",
    "example",
    "code-pattern",
    "common-mistake",
    "constraint",
    "table",
    "qa",
    "reasoning-chain",
    "inference",
    "role-note",
    "diagram",
    "pathway",
    "test-hint",
    "uncertainty",
    "relation",
]


def canonical_sort_blocks(blocks: List[SSMBlock]) -> List[SSMBlock]:
    """
    Sort blocks in canonical order.
    
    Orders blocks by:
    - Chapter number
    - Block type (chapter-meta, term, concept, fact, example, code, etc.)
    - Within type: by ID or position
    
    Args:
        blocks: List of SSM blocks
    
    Returns:
        Sorted list of blocks
    """
    def key(b: SSMBlock) -> Tuple[int, str, int]:
        t = b.block_type
        try:
            t_idx = BLOCK_TYPE_ORDER.index(t)
        except ValueError:
            t_idx = len(BLOCK_TYPE_ORDER)
        
        ch = b.chapter or ""
        return (0 if t == "chapter-meta" else 1, ch, t_idx * 100000 + b.index)
    
    return sorted(blocks, key=key)
