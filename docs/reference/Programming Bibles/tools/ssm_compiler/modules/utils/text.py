"""
Text processing utilities
"""
from __future__ import annotations

import re
from typing import List, Dict, Any


def normalize_whitespace(s: str) -> str:
    """
    Normalize whitespace in text (collapse multiple spaces to single space).
    
    Args:
        s: Input string
    
    Returns:
        Normalized string
    """
    return re.sub(r"\s+", " ", s).strip()


def write_ssm(blocks: List[Any]) -> str:
    """
    Write SSM blocks to markdown format.
    
    Args:
        blocks: List of SSMBlock objects
    
    Returns:
        Complete SSM markdown document
    """
    out: List[str] = []
    
    for b in blocks:
        header = f"::: {b.block_type}"
        out.append(header)
        
        # Ensure id & chapter in meta if known
        if b.id and "id" not in b.meta:
            b.meta["id"] = b.id
        if b.chapter and "chapter" not in b.meta:
            b.meta["chapter"] = b.chapter
        
        # Render metadata
        for k, v in b.meta.items():
            if isinstance(v, list):
                inner = ", ".join(str(x) for x in v)
                out.append(f"{k}: [{inner}]")
            else:
                out.append(f"{k}: {v}")
        
        out.append(":::")
        # Only add body and closing ::: if body exists and is not empty
        if b.body and b.body.strip():
            out.append(b.body)
            out.append(":::")
        out.append("")  # blank line
    
    return "\n".join(out).rstrip() + "\n"

