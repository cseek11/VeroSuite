"""
Concept Graph / Multi-hop Relationships (Phase 3)

Builds concept graph with multi-hop relationships between concepts, terms, patterns, and chapters.
"""
from __future__ import annotations

from typing import List, Dict, Set, Any
from collections import defaultdict
from ..ast_nodes import SSMBlock


def build_concept_graph(blocks: List[SSMBlock], idx: Dict[str, Any]) -> Dict[str, Set[str]]:
    """
    Build multi-hop concept graph.
    
    Graph edges represent:
    - Concept → Concept (related concepts)
    - Concept → Term (defines/uses)
    - Concept → Code Pattern (implements)
    - Chapter → Chapter (prerequisites)
    
    Args:
        blocks: List of SSM blocks
        idx: Block index dictionary
    
    Returns:
        Adjacency map: node_id -> set of neighbor node_ids
    """
    graph: Dict[str, Set[str]] = defaultdict(set)
    
    # Build concept index
    concepts = {b.id: b for b in blocks if b.block_type == "concept"}
    terms = {b.id: b for b in blocks if b.block_type == "term"}
    code_patterns = {b.id: b for b in blocks if b.block_type == "code-pattern"}
    chapter_meta = {b.id: b for b in blocks if b.block_type == "chapter-meta"}
    
    # Extract concept mentions from concept bodies
    for concept_id, concept_block in concepts.items():
        body = (concept_block.body or "").lower()
        
        # Find mentions of other concepts (by title or key phrase)
        for other_id, other_block in concepts.items():
            if other_id == concept_id:
                continue
            
            # Check if other concept's title/keywords appear in this concept
            other_title = other_block.meta.get("title", "").lower()
            other_keywords = other_block.meta.get("keywords", [])
            
            if other_title and other_title in body:
                graph[concept_id].add(other_id)
                graph[other_id].add(concept_id)  # Bidirectional
        
        # Link concepts to terms they mention
        for term_id, term_block in terms.items():
            term_name = term_block.meta.get("name", "").lower()
            if term_name and term_name in body:
                graph[concept_id].add(term_id)
        
        # Link concepts to code patterns
        for code_id, code_block in code_patterns.items():
            code_lang = code_block.meta.get("language", "")
            pattern_type = code_block.meta.get("pattern_type", "")
            # Check if concept mentions this pattern type
            if pattern_type and pattern_type in body:
                graph[concept_id].add(code_id)
    
    # Add chapter prerequisite edges from relations
    relations = {b.id: b for b in blocks if b.block_type == "relation"}
    for rel_id, rel_block in relations.items():
        from_ref = rel_block.meta.get("from", "")
        to_ref = rel_block.meta.get("to", "")
        rel_type = rel_block.meta.get("type", "")
        
        # Find chapter blocks by code
        from_ch = None
        to_ch = None
        for ch_id, ch_block in chapter_meta.items():
            ch_code = ch_block.meta.get("code", "")
            if ch_code == from_ref:
                from_ch = ch_id
            if ch_code == to_ref:
                to_ch = ch_id
        
        if from_ch and to_ch:
            if rel_type == "prerequisite":
                graph[from_ch].add(to_ch)  # from_ch depends on to_ch
            else:
                graph[from_ch].add(to_ch)  # Reference (bidirectional)
                graph[to_ch].add(from_ch)
    
    # Add chapter prerequisites from chapter-meta
    for ch_id, ch_block in chapter_meta.items():
        prereqs = ch_block.meta.get("prerequisites", [])
        if isinstance(prereqs, list):
            for prereq_code in prereqs:
                # Find chapter with this code
                for other_ch_id, other_ch_block in chapter_meta.items():
                    if other_ch_block.meta.get("code") == prereq_code:
                        graph[ch_id].add(other_ch_id)
    
    return dict(graph)


def enrich_concept_graph(blocks: List[SSMBlock], idx: Dict[str, Any]) -> None:
    """
    Enrich blocks with concept graph metadata (multi-hop relationships).
    
    Adds:
    - graph_neighbors: Direct neighbors (1-hop)
    - graph_two_hop: Nodes reachable in 2 hops
    - graph_three_hop: Nodes reachable in 3 hops
    - graph_degree: Number of direct neighbors
    
    Args:
        blocks: List of SSM blocks (modified in place)
        idx: Block index dictionary
    """
    graph = build_concept_graph(blocks, idx)
    
    # Add graph edges to block metadata
    for block in blocks:
        if block.id in graph:
            neighbors = list(graph[block.id])
            block.meta["graph_neighbors"] = neighbors
            block.meta["graph_degree"] = len(neighbors)
            
            # Multi-hop paths (2-3 hops)
            two_hop = set()
            three_hop = set()
            for neighbor_id in neighbors:
                if neighbor_id in graph:
                    for two_hop_neighbor in graph[neighbor_id]:
                        if two_hop_neighbor != block.id:
                            two_hop.add(two_hop_neighbor)
                            # Three-hop
                            if two_hop_neighbor in graph:
                                for three_hop_neighbor in graph[two_hop_neighbor]:
                                    if three_hop_neighbor != block.id and three_hop_neighbor not in neighbors:
                                        three_hop.add(three_hop_neighbor)
            
            block.meta["graph_two_hop"] = list(two_hop)
            block.meta["graph_three_hop"] = list(three_hop)

