"""
Bidirectional Links Enrichment

Adds bidirectional cross-references between related blocks.
"""
from __future__ import annotations

from typing import List, Dict, Any
from ..ast_nodes import SSMBlock


def enrich_bidirectional_links(blocks: List[SSMBlock], idx: Dict[str, Any]) -> None:
    """
    Enrich blocks with bidirectional links.
    
    For each block that references another block, add a reverse link
    so that both blocks know about each other.
    
    Args:
        blocks: List of SSM blocks (modified in place)
        idx: Index of blocks by ID
    """
    by_id = idx["by_id"]
    
    for b in blocks:
        if b.block_type != "relation":
            continue
        
        frm = str(b.meta.get("from", "")).strip()
        to = str(b.meta.get("to", "")).strip()
        rel_type = str(b.meta.get("type", "related")).strip()
        
        if frm in by_id:
            src = by_id[frm]
            key = f"out_{rel_type}"
            src.meta.setdefault(key, [])
            if to not in src.meta[key]:
                src.meta[key].append(to)
        
        if to in by_id:
            tgt = by_id[to]
            key = f"in_{rel_type}"
            tgt.meta.setdefault(key, [])
            if frm not in tgt.meta[key]:
                tgt.meta[key].append(frm)
