"""
Chapter Attribution Post-Processing

Fixes chapter attribution for blocks that reference content from other chapters.
"""
from __future__ import annotations

import re
from typing import List, Dict, Any
from ..ast_nodes import SSMBlock


def fix_chapter_attribution(blocks: List[SSMBlock], idx: Dict[str, Any]) -> None:
    """
    Post-process blocks to fix chapter attribution for cross-chapter references.
    
    Args:
        blocks: List of SSM blocks (modified in place)
        idx: Block index
    """
    chapter_meta_by_code = idx.get("chapter_meta_by_code", {})
    by_chapter = idx.get("by_chapter", {})
    
    # Build chapter code to chapter name mapping
    chapter_names: Dict[str, str] = {}
    for code, meta_block in chapter_meta_by_code.items():
        name = meta_block.meta.get("name", "")
        if name:
            chapter_names[code] = name
    
    # Process each block
    for block in blocks:
        if not block.chapter:
            continue
        
        # Check if block content references another chapter
        body = block.body or ""
        meta_text = " ".join([str(v) for v in block.meta.values() if isinstance(v, str)])
        full_text = body + " " + meta_text
        
        # Find chapter references in text
        chapter_refs = _find_chapter_references(full_text, chapter_names)
        
        # If block references another chapter prominently, consider adjusting attribution
        if chapter_refs:
            # Check if this block is primarily about the referenced chapter
            primary_ref = _get_primary_chapter_reference(chapter_refs, full_text)
            
            if primary_ref and primary_ref != block.chapter:
                # Check if primary reference is more appropriate
                # Only adjust if block is a reference/explanation type
                if block.block_type in ["qa", "rationale", "paragraph", "section"]:
                    # Check if block is explaining content from another chapter
                    if _is_cross_chapter_explanation(block, primary_ref, full_text):
                        # Add cross-chapter metadata but keep original chapter
                        block.meta["cross_chapter_reference"] = primary_ref
                        block.meta["primary_chapter"] = block.chapter
                        # Don't change block.chapter - keep original attribution


def _find_chapter_references(text: str, chapter_names: Dict[str, str]) -> List[str]:
    """
    Find chapter references in text.
    
    Args:
        text: Text to search
        chapter_names: Mapping of chapter codes to names
        
    Returns:
        List of referenced chapter codes
    """
    refs = []
    
    # Look for "Chapter X" patterns
    chapter_pattern = re.compile(r'Chapter\s+(\d+)', re.IGNORECASE)
    matches = chapter_pattern.findall(text)
    for match in matches:
        code = f"CH-{int(match):02d}"
        if code in chapter_names:
            refs.append(code)
    
    # Look for "CH-XX" patterns
    ch_code_pattern = re.compile(r'CH-(\d+)', re.IGNORECASE)
    matches = ch_code_pattern.findall(text)
    for match in matches:
        code = f"CH-{int(match):02d}"
        if code in chapter_names:
            refs.append(code)
    
    # Look for chapter names
    for code, name in chapter_names.items():
        if name.lower() in text.lower():
            refs.append(code)
    
    return list(set(refs))


def _get_primary_chapter_reference(refs: List[str], text: str) -> str:
    """
    Get the primary chapter reference based on frequency and context.
    
    Args:
        refs: List of referenced chapter codes
        text: Full text
        
    Returns:
        Primary chapter code or empty string
    """
    if not refs:
        return ""
    
    if len(refs) == 1:
        return refs[0]
    
    # Count occurrences
    counts: Dict[str, int] = {}
    for ref in refs:
        # Count "Chapter X" mentions
        chapter_num = ref.replace("CH-", "")
        pattern = re.compile(rf'Chapter\s+{chapter_num}\b', re.IGNORECASE)
        counts[ref] = len(pattern.findall(text))
    
    # Return most frequent
    if counts:
        return max(counts.items(), key=lambda x: x[1])[0]
    
    return refs[0]


def _is_cross_chapter_explanation(block: SSMBlock, ref_chapter: str, text: str) -> bool:
    """
    Check if block is explaining content from another chapter.
    
    Args:
        block: SSM block
        ref_chapter: Referenced chapter code
        text: Full text
        
    Returns:
        True if block is cross-chapter explanation
    """
    # Check for explanation keywords
    explanation_keywords = [
        "see chapter", "refer to chapter", "as discussed in chapter",
        "from chapter", "in chapter", "chapter explains", "chapter covers"
    ]
    
    text_lower = text.lower()
    for keyword in explanation_keywords:
        if keyword in text_lower:
            # Check if keyword is followed by reference to ref_chapter
            pattern = re.compile(rf'{keyword}.*?{ref_chapter}', re.IGNORECASE)
            if pattern.search(text_lower):
                return True
    
    return False

