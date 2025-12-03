"""
Do/Don't Enrichment

Adds do/don't patterns and best practices.
"""
from __future__ import annotations

from typing import List, Dict, Any
from ..ast_nodes import SSMBlock
from ..utils.hashing import sha1_id


def enrich_do_dont(blocks: List[SSMBlock], idx: Dict[str, Any]) -> None:
    """
    Enrich blocks with do/don't patterns.
    
    Adds:
    - Do patterns (best practices)
    - Don't patterns (anti-patterns)
    - Best practice guidance
    
    Args:
        blocks: List of SSM blocks (modified in place)
        idx: Index of blocks by ID
    """
    by_chapter = idx["by_chapter"]
    
    for ch_code, ch_blocks in by_chapter.items():
        dos: List[str] = []
        donts: List[str] = []
        
        for b in ch_blocks:
            if b.block_type == "fact":
                s = str(b.meta.get("summary", "")).strip()
                if s:
                    dos.append(s)
            if b.block_type == "common-mistake":
                s = str(b.meta.get("summary", "")).strip()
                if s:
                    donts.append(s)
        
        if not dos and not donts:
            continue
        
        tid = sha1_id("TABLE", ch_code + ":dos-donts")
        lines = ["| Do | Don't |", "| --- | --- |"]
        
        # Extract headers and rows for validation
        headers = ["Do", "Don't"]
        rows = []
        max_len = max(len(dos), len(donts))
        for i in range(max_len):
            do = dos[i] if i < len(dos) else ""
            dn = donts[i] if i < len(donts) else ""
            rows.append([do, dn])
            lines.append(f"| {do} | {dn} |")
        
        b = SSMBlock(
            block_type="table",
            meta={
                "id": tid,
                "chapter": ch_code,
                "type": "dos-donts",
                "headers": headers,  # FIX: Add headers for validation
                "rows": rows,  # FIX: Add rows for validation
            },
            body="\n".join(lines),
            index=len(blocks),
            id=tid,
            chapter=ch_code,
        )
        blocks.append(b)
