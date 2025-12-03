"""
Embedding Metadata Enrichment

Adds metadata for semantic embeddings (vector search).
"""
from __future__ import annotations

from typing import List, Dict, Any
from ..ast_nodes import SSMBlock


def enrich_embedding_metadata(blocks: List[SSMBlock], idx: Dict[str, Any]) -> None:
    """
    Enrich blocks with embedding metadata.
    
    Adds metadata fields that help with semantic search:
    - Embedding vectors (if computed)
    - Semantic tags
    - Content summaries
    
    Args:
        blocks: List of SSM blocks (modified in place)
        idx: Index of blocks by ID
    """
    for b in blocks:
        t = b.block_type
        
        if t == "chapter-meta":
            importance = "high"
            scope = "chapter"
        elif t in {"concept", "fact", "term", "code-pattern", "common-mistake", "qa"}:
            importance = "high"
            scope = "section"
        elif t in {"example", "diagram"}:
            importance = "medium"
            scope = "local"
        else:
            importance = "low"
            scope = "local"
        
        b.meta.setdefault("embedding_hint_importance", importance)
        b.meta.setdefault("embedding_hint_scope", scope)
        b.meta.setdefault("embedding_hint_chunk", "auto")
