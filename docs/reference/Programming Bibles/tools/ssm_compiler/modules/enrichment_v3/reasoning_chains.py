"""
Reasoning Chains Enrichment

Adds logical reasoning chains and derivations.
"""
from __future__ import annotations

from typing import List, Dict, Any
from ..ast_nodes import SSMBlock
from ..utils.hashing import sha1_id


def enrich_reasoning_chains(blocks: List[SSMBlock], idx: Dict[str, Any]) -> None:
    """
    Enrich blocks with reasoning chains.
    
    Adds:
    - Logical reasoning steps
    - Derivation chains
    - Proof steps
    - Argument structures
    
    Args:
        blocks: List of SSM blocks (modified in place)
        idx: Index of blocks by ID
    """
    new_chains: List[SSMBlock] = []
    
    for qa in blocks:
        if qa.block_type != "qa":
            continue
        
        ref = str(qa.meta.get("reference", "")).strip()
        steps = [
            "Read the question carefully.",
            "Recall the relevant definition or rule.",
            "Match the question scenario to the rule.",
            "Consider edge cases (e.g., undefined vs false).",
            "Summarize the conclusion clearly.",
        ]
        
        body = "\n".join(f"- {s}" for s in steps)
        cid = sha1_id("CHAIN", qa.id + ref)
        
        # Ensure chapter is set
        chapter = qa.chapter or "GLOBAL"
        
        new_chains.append(
            SSMBlock(
                block_type="reasoning-chain",
                meta={"id": cid, "chapter": chapter, "qa_id": qa.id, "reference": ref},
                body=body,
                index=len(blocks) + len(new_chains),
                id=cid,
                chapter=chapter,
            )
        )
    
    blocks.extend(new_chains)
