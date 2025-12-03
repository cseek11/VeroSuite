"""
Chapter Graph Enrichment

Adds chapter summaries and learning pathways.
"""
from __future__ import annotations

from typing import List, Dict, Any, Set
from ..ast_nodes import SSMBlock
from ..utils.hashing import sha1_id


def build_chapter_graph(blocks: List[SSMBlock]) -> Dict[str, Set[str]]:
    """
    Build chapter dependency graph.
    
    Args:
        blocks: List of SSM blocks
    
    Returns:
        Graph dict: chapter_code -> set of dependent chapters
    """
    graph: Dict[str, Set[str]] = {}
    
    for b in blocks:
        if b.block_type != "relation":
            continue
        
        frm = str(b.meta.get("from", "")).strip()
        to = str(b.meta.get("to", "")).strip()
        
        if frm.startswith("CH-") and to.startswith("CH-"):
            graph.setdefault(frm, set()).add(to)
    
    return graph


def closure(graph: Dict[str, Set[str]]) -> Dict[str, Set[str]]:
    """
    Compute transitive closure of chapter graph.
    
    Args:
        graph: Chapter dependency graph
    
    Returns:
        Transitive closure
    """
    result = {k: set(v) for k, v in graph.items()}
    
    def dfs(start: str, node: str):
        for nb in graph.get(node, set()):
            if nb not in result[start]:
                result[start].add(nb)
                dfs(start, nb)
    
    for n in list(graph.keys()):
        dfs(n, n)
    
    return result


def enrich_chapter_summaries_and_pathways(blocks: List[SSMBlock], idx: Dict[str, Any]) -> None:
    """
    Enrich blocks with chapter summaries and pathways.
    
    Adds:
    - Chapter summaries
    - Learning pathways
    - Prerequisite chains
    - Recommended reading order
    
    Args:
        blocks: List of SSM blocks (modified in place)
        idx: Index of blocks by ID
    """
    chapter_meta_by_code = idx["chapter_meta_by_code"]
    graph = build_chapter_graph(blocks)
    clos = closure(graph)
    
    # summaries
    for code, meta_blk in chapter_meta_by_code.items():
        direct = sorted(graph.get(code, set()))
        all_deps = sorted(clos.get(code, set()))
        meta_blk.meta["graph_prerequisites_direct"] = direct
        meta_blk.meta["graph_prerequisites_all"] = all_deps
    
    # pathways
    for src, deps in clos.items():
        for dst in deps:
            if src == dst:
                continue
            pid = sha1_id("PATH", f"{src}->{dst}")
            blocks.append(
                SSMBlock(
                    block_type="pathway",
                    meta={"id": pid, "from": src, "to": dst},
                    body=f"Learning pathway from {src} to {dst} via chapter dependency graph.",
                    index=len(blocks),
                    id=pid,
                    chapter=None,
                )
            )
