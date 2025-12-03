"""
Intuition Enrichment

Adds intuitive explanations and mental models.
"""
from __future__ import annotations

from typing import List, Dict, Any
from ..ast_nodes import SSMBlock
from ..utils.text import normalize_whitespace


def enrich_intuition(blocks: List[SSMBlock], idx: Dict[str, Any]) -> None:
    """
    Enrich blocks with intuitive explanations.
    
    Adds fields that help build mental models:
    - Intuitive analogies
    - Mental models
    - Conceptual bridges
    
    Args:
        blocks: List of SSM blocks (modified in place)
        idx: Index of blocks by ID
    """
    for b in blocks:
        if b.block_type not in {"concept", "fact"}:
            continue
        if "intuition" in b.meta:
            continue
        
        summary = str(b.meta.get("summary", "")).strip()
        if not summary:
            continue
        
        b.meta["intuition"] = normalize_whitespace(f"This explains that {summary}.")
