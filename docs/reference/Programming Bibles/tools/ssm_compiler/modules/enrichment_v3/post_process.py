"""
Post-Processing & Cleanup (Enterprise-Grade)

Fixes common issues and adds missing blocks:
- Ensures all blocks have chapter assignments
- Removes truncated/broken blocks
- Adds symbol-table block
- Adds compile-summary block
- Improves embedding hints for noisy blocks
"""
from __future__ import annotations

from typing import List, Dict, Any, Set
from ..ast_nodes import SSMBlock
from ..utils.hashing import sha1_id


def post_process_blocks(blocks: List[SSMBlock], idx: Dict[str, Any], metrics: Any = None) -> None:
    """
    Post-process blocks to fix common issues and add missing blocks.
    
    Args:
        blocks: List of SSM blocks (modified in place)
        idx: Block index
        metrics: MetricsCollector instance (optional)
    """
    # 1. Ensure all blocks have chapter assignments
    _fix_empty_chapters(blocks, idx)
    
    # 2. Remove truncated/broken blocks
    _remove_broken_blocks(blocks)
    
    # 3. Improve embedding hints for noisy blocks
    _improve_embedding_hints(blocks)
    
    # 4. Add symbol-table block
    _add_symbol_table_block(blocks, idx)
    
    # 5. Add compile-summary block
    if metrics:
        _add_compile_summary_block(blocks, metrics)


def _fix_empty_chapters(blocks: List[SSMBlock], idx: Dict[str, Any]) -> None:
    """Ensure all blocks have chapter assignments."""
    chapter_meta_by_code = idx.get("chapter_meta_by_code", {})
    
    for block in blocks:
        # Skip meta blocks (they use META instead)
        if block.block_type in ["ssm-meta", "part-meta", "symbol-table", "compile-summary"]:
            if not block.chapter:
                block.chapter = "META"
            if "chapter" not in block.meta or not block.meta.get("chapter"):
                block.meta["chapter"] = "META"
            continue
        
        # If chapter is empty or just whitespace, set to GLOBAL
        chapter = block.chapter or block.meta.get("chapter", "")
        if not chapter or not chapter.strip():
            chapter = "GLOBAL"
            block.chapter = chapter
        
        # Ensure chapter is in meta (always set, never empty string)
        block.meta["chapter"] = block.chapter or "GLOBAL"
        block.chapter = block.meta["chapter"]  # Sync back


def _remove_broken_blocks(blocks: List[SSMBlock]) -> None:
    """Remove truncated or broken blocks."""
    to_remove = []
    
    for i, block in enumerate(blocks):
        # Remove antipatterns with truncated problem/solution
        if block.block_type == "antipattern":
            problem = str(block.meta.get("problem", "")).strip()
            solution = str(block.meta.get("solution", "")).strip()
            
            # Remove if problem or solution is too short (likely truncated)
            if len(problem) < 10 or (solution and len(solution) < 10):
                to_remove.append(i)
                continue
            
            # Remove if solution is just a single character or partial word
            if solution and len(solution) <= 2 and solution not in ["OK", "NO"]:
                to_remove.append(i)
                continue
        
        # Remove constraints/uncertainty blocks without source
        if block.block_type in ["constraint", "uncertainty"]:
            source_id = block.meta.get("source_id", "")
            if not source_id or source_id == "UNKNOWN":
                to_remove.append(i)
                continue
        
        # Remove inference blocks with invalid nodes
        if block.block_type == "inference":
            frm = str(block.meta.get("from", "")).strip()
            to = str(block.meta.get("to", "")).strip()
            if len(frm) <= 1 or len(to) <= 1:
                to_remove.append(i)
                continue
    
    # Remove in reverse order to maintain indices
    for i in reversed(to_remove):
        blocks.pop(i)


def _improve_embedding_hints(blocks: List[SSMBlock]) -> None:
    """Improve embedding hints for noisy blocks."""
    noisy_block_types = ["inference", "relation", "pathway"]
    
    for block in blocks:
        # Mark noisy blocks as low importance
        if block.block_type in noisy_block_types:
            block.meta["embedding_hint_importance"] = "low"
            block.meta["embedding_hint_chunk"] = "ignore"
        
        # Mark small antipatterns as low importance
        if block.block_type == "antipattern":
            problem = str(block.meta.get("problem", ""))
            if len(problem) < 50:
                block.meta["embedding_hint_importance"] = "low"
        
        # Mark low-importance QA as low
        if block.block_type == "qa":
            importance = block.meta.get("importance", "medium")
            if importance == "low":
                block.meta["embedding_hint_importance"] = "low"
                block.meta["embedding_hint_chunk"] = "ignore"


def _add_symbol_table_block(blocks: List[SSMBlock], idx: Dict[str, Any]) -> None:
    """Add a central symbol-table block."""
    # Collect all symbols from symbol_refs
    all_symbols: Set[str] = set()
    symbols_by_chapter: Dict[str, Set[str]] = {}
    
    for block in blocks:
        symbol_refs = block.meta.get("symbol_refs", [])
        if symbol_refs:
            for sym in symbol_refs:
                all_symbols.add(sym)
                chapter = block.chapter or "GLOBAL"
                symbols_by_chapter.setdefault(chapter, set()).add(sym)
        
        # Also collect from term blocks
        if block.block_type == "term":
            name = block.meta.get("name", "")
            if name:
                all_symbols.add(name)
                chapter = block.chapter or "GLOBAL"
                symbols_by_chapter.setdefault(chapter, set()).add(name)
    
    # Create symbol-table block
    if all_symbols:
        symbol_table_id = sha1_id("SYMTAB", "".join(sorted(all_symbols)))
        
        # Build chapters_by_symbol mapping
        chapters_by_symbol: Dict[str, List[str]] = {}
        for chapter, symbols in symbols_by_chapter.items():
            for sym in symbols:
                chapters_by_symbol.setdefault(sym, []).append(chapter)
        
        symbol_table_block = SSMBlock(
            block_type="symbol-table",
            meta={
                "id": symbol_table_id,
                "chapter": "META",
                "total_symbols": len(all_symbols),
                "symbols": sorted(list(all_symbols)),
                "chapters_by_symbol": {k: sorted(v) for k, v in chapters_by_symbol.items()},
            },
            body=f"Symbol table with {len(all_symbols)} unique symbols across {len(symbols_by_chapter)} chapters.",
            index=len(blocks),
            id=symbol_table_id,
            chapter="META",
        )
        
        blocks.append(symbol_table_block)


def _add_compile_summary_block(blocks: List[SSMBlock], metrics: Any) -> None:
    """Add compile-summary block with statistics."""
    from collections import defaultdict
    
    # Count blocks by type
    blocks_by_type = defaultdict(int)
    for block in blocks:
        blocks_by_type[block.block_type] += 1
    
    # Get metrics summary
    metrics_summary = metrics.get_summary() if hasattr(metrics, 'get_summary') else {}
    
    summary_id = sha1_id("SUMMARY", str(len(blocks)))
    
    summary_block = SSMBlock(
        block_type="compile-summary",
        meta={
            "id": summary_id,
            "chapter": "META",
            "total_blocks": len(blocks),
            "blocks_by_type": dict(blocks_by_type),
            "num_relations": blocks_by_type.get("relation", 0),
            "num_pathways": blocks_by_type.get("pathway", 0),
            "num_antipatterns": blocks_by_type.get("antipattern", 0),
            "num_qa": blocks_by_type.get("qa", 0),
            "num_terms": blocks_by_type.get("term", 0),
            "num_concepts": blocks_by_type.get("concept", 0),
            "warnings_count": metrics_summary.get("warnings", 0),
            "errors_count": metrics_summary.get("errors", 0),
            "quality_score": metrics_summary.get("quality_score", 0),
            "compile_time": metrics_summary.get("compile_time", "N/A"),
        },
        body=f"Compilation summary: {len(blocks)} blocks, {blocks_by_type.get('qa', 0)} QA pairs, {blocks_by_type.get('antipattern', 0)} antipatterns.",
        index=len(blocks),
        id=summary_id,
        chapter="META",
    )
    
    blocks.append(summary_block)

