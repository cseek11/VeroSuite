"""
Examples & Code Smells Enrichment

Adds examples and anti-pattern detection.
"""
from __future__ import annotations

from typing import List, Dict, Any
from ..ast_nodes import SSMBlock


def enrich_examples_and_smells(blocks: List[SSMBlock], idx: Dict[str, Any]) -> None:
    """
    Enrich blocks with examples and code smells.
    
    Adds:
    - Example code blocks
    - Anti-pattern detection
    - Code smell identification
    
    Args:
        blocks: List of SSM blocks (modified in place)
        idx: Index of blocks by ID
    """
    by_chapter = idx["by_chapter"]
    
    for ch_code, ch_blocks in by_chapter.items():
        patterns = [b for b in ch_blocks if b.block_type == "code-pattern"]
        mistakes = [b for b in ch_blocks if b.block_type == "common-mistake"]
        
        # code smell
        for b in ch_blocks:
            if b.block_type in {"code-pattern", "example", "common-mistake"}:
                txt = (b.body + " " + " ".join(map(str, b.meta.values()))).lower()
                score = 0.0
                
                if "unsafe" in txt or "anti-pattern" in txt or "deprecated" in txt:
                    score += 0.7
                if "bad" in txt or "wrong" in txt:
                    score += 0.3
                if b.block_type == "common-mistake":
                    score = max(score, 0.8)
                
                if score > 0:
                    b.meta["code_smell_probability"] = round(min(1.0, score), 2)
        
        # mark mistakes
        for m in mistakes:
            m.meta.setdefault("pattern_role", "anti-pattern")
            m.meta.setdefault("severity", "high")
        
        # pair patterns and mistakes (simple summary overlap)
        for p in patterns:
            ps = str(p.meta.get("summary", "")).lower()
            if not ps:
                continue
            for m in mistakes:
                ms = str(m.meta.get("summary", "")).lower()
                if not ms:
                    continue
                if any(tok in ms for tok in ps.split()[:3]):
                    p.meta.setdefault("paired_mistakes", []).append(m.id)
                    m.meta.setdefault("paired_patterns", []).append(p.id)
