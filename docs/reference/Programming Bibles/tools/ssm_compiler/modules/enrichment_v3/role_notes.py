"""
Role Notes Enrichment

Adds role-specific guidance (beginner, intermediate, advanced, PhD).
"""
from __future__ import annotations

from typing import List, Dict, Any
from ..ast_nodes import SSMBlock
from ..utils.hashing import sha1_id


def enrich_role_notes(blocks: List[SSMBlock], idx: Dict[str, Any]) -> None:
    """
    Enrich blocks with role-specific notes.
    
    Adds guidance tailored to different skill levels:
    - Beginner notes
    - Intermediate tips
    - Advanced insights
    - PhD-level details
    
    Args:
        blocks: List of SSM blocks (modified in place)
        idx: Index of blocks by ID
    """
    chapter_meta_by_code = idx["chapter_meta_by_code"]
    
    for ch_code, ch_meta in chapter_meta_by_code.items():
        if ch_meta.meta.get("role_notes_added"):
            continue
        
        ch_meta.meta["role_notes_added"] = True
        
        roles = [
            ("Policy Author", "Focus on correctness & clarity of rules in this chapter."),
            ("Security Reviewer", "Look for unsafe patterns, missing deny cases, misuse of negation."),
            ("Performance Engineer", "Identify heavy comprehensions and opportunities for partial evaluation."),
        ]
        
        for role, guidance in roles:
            rid = sha1_id("ROLE", ch_code + role)
            b = SSMBlock(
                block_type="role-note",
                meta={
                    "id": rid,
                    "chapter": ch_code,
                    "role": role,
                    "guidance": guidance,
                },
                body="",
                index=len(blocks),
                id=rid,
                chapter=ch_code,
            )
            blocks.append(b)
