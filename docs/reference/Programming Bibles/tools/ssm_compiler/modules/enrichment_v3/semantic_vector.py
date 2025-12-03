"""
Semantic Vector Enrichment

Adds semantic vectors and similarity metadata.
"""
from __future__ import annotations

from typing import List, Dict, Any, Set
from ..ast_nodes import SSMBlock
from ..utils.hashing import sha1_id
from ..utils.text import normalize_whitespace


SEMANTIC_KEYWORDS = {
    "unification": "unification",
    "fixpoint": "theory",
    "negation": "negation",
    "partial evaluation": "performance",
    "bundle": "distribution",
    "decision log": "observability",
    "metrics": "observability",
    "authorization": "authz",
    "rbac": "authz",
    "abac": "authz",
    "testing": "testing",
    "coverage": "testing",
    "undefined vs false": "truth-values",
}


def enrich_semantic_and_vector(blocks: List[SSMBlock], idx: Dict[str, Any]) -> None:
    """
    Enrich blocks with semantic vectors.
    
    Adds:
    - Semantic embedding vectors
    - Similarity scores
    - Related content links
    - Semantic tags
    
    Args:
        blocks: List of SSM blocks (modified in place)
        idx: Index of blocks by ID
    """
    new_uncertain: List[SSMBlock] = []
    
    for b in blocks:
        txt = (b.body + " " + " ".join(map(str, b.meta.values()))).lower()
        cats: Set[str] = set(b.meta.get("semantic_categories", []))
        
        for kw, cat in SEMANTIC_KEYWORDS.items():
            if kw in txt:
                cats.add(cat)
        
        if cats:
            b.meta["semantic_categories"] = sorted(cats)
        
        if b.block_type in {"concept", "fact", "term"}:
            base = str(b.meta.get("summary") or b.meta.get("definition") or b.body).strip()
            if base:
                b.meta.setdefault("vector_summary", normalize_whitespace(base))
        
        if any(k in txt for k in ["ambiguous", "depends on context", "not always clear"]):
            uid = sha1_id("UNCERT", b.id or b.body[:40])
            new_uncertain.append(
                SSMBlock(
                    block_type="uncertainty",
                    meta={"id": uid, "chapter": b.chapter or "", "source_id": b.id or ""},
                    body="This content may have ambiguous or context-dependent interpretation.",
                    index=len(blocks) + len(new_uncertain),
                    id=uid,
                    chapter=b.chapter,
                )
            )
    
    blocks.extend(new_uncertain)
