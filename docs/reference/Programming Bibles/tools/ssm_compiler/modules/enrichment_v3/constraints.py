"""
Constraints Enrichment

Adds constraints and validation rules.
"""
from __future__ import annotations

from typing import List, Dict, Any
from ..ast_nodes import SSMBlock
from ..utils.hashing import sha1_id
from ..utils.patterns import MUST_NOT_RE


def enrich_constraints(blocks: List[SSMBlock], idx: Dict[str, Any]) -> None:
    """
    Enrich blocks with constraints.
    
    Adds:
    - Validation constraints
    - Preconditions
    - Postconditions
    - Invariants
    
    Args:
        blocks: List of SSM blocks (modified in place)
        idx: Index of blocks by ID
    """
    new_constraints: List[SSMBlock] = []
    
    for b in blocks:
        txt = (b.body + " " + " ".join(map(str, b.meta.values())))
        if MUST_NOT_RE.search(txt):
            # Only create constraint if we have a valid source block with ID and chapter
            if not b.id or not b.chapter:
                continue  # Skip generic constraints without source
            
            cid = sha1_id("CONSTR", b.id)
            # Extract actual constraint text from source
            desc = b.body[:200] if b.body else "Forbidden or disallowed behavior."
            
            # Ensure chapter is set
            chapter = b.chapter or "GLOBAL"
            
            new_constraints.append(
                SSMBlock(
                    block_type="constraint",
                    meta={
                        "id": cid,
                        "chapter": chapter,
                        "source_id": b.id,
                        "type": "forbidden",
                    },
                    body=desc,
                    index=len(blocks) + len(new_constraints),
                    id=cid,
                    chapter=chapter,
                )
            )
    
    blocks.extend(new_constraints)
