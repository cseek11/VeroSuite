"""
Inference Rules Enrichment

Adds logical inference rules and derivations.
"""
from __future__ import annotations

import re
from typing import List, Dict, Any
from ..ast_nodes import SSMBlock
from ..utils.hashing import sha1_id


# Stop-list for generic words that shouldn't be graph nodes
GENERIC_WORD_STOPLIST = {
    'important', 'rationale', 'maintainability', 'useful', 'important', 'better',
    'good', 'bad', 'correct', 'incorrect', 'right', 'wrong', 'yes', 'no',
    'this', 'that', 'these', 'those', 'the', 'a', 'an', 'and', 'or', 'but',
    'for', 'with', 'from', 'to', 'in', 'on', 'at', 'by', 'of', 'as', 'is',
    'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do',
    'does', 'did', 'will', 'would', 'should', 'could', 'may', 'might', 'must'
}

def _is_valid_graph_node(node_id: str) -> bool:
    """
    Check if a node ID is valid for graph inclusion.
    
    Filters out:
    - Single-letter tokens (n, i, x, etc.)
    - Generic English words
    - Empty strings
    """
    if not node_id or len(node_id) < 2:
        return False
    
    # Filter single letters
    if len(node_id) == 1:
        return False
    
    # Filter generic words
    if node_id.lower() in GENERIC_WORD_STOPLIST:
        return False
    
    # Must start with CH- for chapters or be a valid block ID
    if node_id.startswith("CH-") or node_id.startswith("BLK-") or node_id.startswith("TERM-"):
        return True
    
    # For other IDs, check if it's a valid identifier (alphanumeric with dashes/underscores)
    if not re.match(r'^[A-Za-z0-9_-]+$', node_id):
        return False
    
    return True


def enrich_inference_rules(blocks: List[SSMBlock], idx: Dict[str, Any]) -> None:
    """
    Enrich blocks with inference rules.
    
    Adds:
    - Logical inference rules
    - Derivation chains
    - Reasoning steps
    
    Args:
        blocks: List of SSM blocks (modified in place)
        idx: Index of blocks by ID
    """
    import re
    inference_blocks: List[SSMBlock] = []
    
    for b in blocks:
        if b.block_type != "relation":
            continue
        
        frm = str(b.meta.get("from", "")).strip()
        to = str(b.meta.get("to", "")).strip()
        rel_type = str(b.meta.get("type", "related")).strip()
        
        if not frm or not to:
            continue
        
        # Filter invalid graph nodes
        if not _is_valid_graph_node(frm) or not _is_valid_graph_node(to):
            continue
        
        rid = sha1_id("INFER", f"{frm}->{to}:{rel_type}")
        body = f"If {frm} {rel_type} {to}, understanding {frm} usually helps understand {to}."
        
        # Get chapter from source relation block
        chapter = b.chapter or "GLOBAL"
        
        inference_blocks.append(
            SSMBlock(
                block_type="inference",
                meta={
                    "id": rid,
                    "from": frm,
                    "to": to,
                    "relation": rel_type,
                    "chapter": chapter,
                    "embedding_hint_importance": "low",  # Mark as low importance
                },
                body=body,
                index=len(blocks) + len(inference_blocks),
                id=rid,
                chapter=chapter,
            )
        )
    
    blocks.extend(inference_blocks)
