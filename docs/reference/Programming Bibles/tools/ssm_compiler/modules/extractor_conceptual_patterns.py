"""
Conceptual Pattern Extractor

FIX 3: Extracts conceptual pattern blocks (::: pattern) from text descriptions,
separate from code-pattern blocks which are extracted from code.

Conceptual patterns describe design patterns, architectural patterns, or
problem-solving patterns in natural language, not code implementations.
"""
from __future__ import annotations

import re
from typing import List, Optional, Dict, Any
from .ast_nodes import ASTDocument, ASTNode, SSMBlock
from .utils.hashing import sha1_id


def extract_conceptual_patterns_from_ast(
    doc: ASTDocument,
    errors: Optional[Any] = None,
    symbols: Optional[Any] = None,
) -> List[SSMBlock]:
    """
    Extract conceptual pattern blocks from AST.
    
    FIX 3: Creates ::: pattern blocks (not code-pattern) for conceptual patterns
    described in text.
    
    Args:
        doc: AST document
        errors: ErrorBus instance (optional)
        symbols: SymbolTable instance (optional)
    
    Returns:
        List of pattern SSMBlock objects
    """
    blocks: List[SSMBlock] = []
    idx = 0
    
    # Pattern indicators in text
    pattern_indicators = [
        r'\bpattern\s+(?:of|for|to|is|:)\s+',
        r'\bdesign\s+pattern\s+',
        r'\barchitectural\s+pattern\s+',
        r'\b(?:common|standard|typical)\s+pattern\s+',
        r'\bpattern\s+(?:called|named|known as)\s+',
        r'\bfollows?\s+(?:the|a|an)\s+pattern\s+',
        r'\buses?\s+(?:the|a|an)\s+pattern\s+',
    ]
    
    # Walk AST to find pattern descriptions
    for node in doc.nodes:
        if node.type in ["paragraph", "section"]:
            text = node.text or ""
            text_lower = text.lower()
            
            # Check if this node describes a pattern
            is_pattern = False
            pattern_name = None
            pattern_description = text
            
            # Look for pattern indicators
            for indicator in pattern_indicators:
                match = re.search(indicator, text_lower, re.IGNORECASE)
                if match:
                    is_pattern = True
                    # Try to extract pattern name
                    after_match = text[match.end():].strip()
                    # Extract first sentence or phrase
                    name_match = re.match(r'^([^.:!?]+)', after_match)
                    if name_match:
                        pattern_name = name_match.group(1).strip()
                    break
            
            # Also check for explicit pattern markers
            if not is_pattern:
                # Look for "Pattern: X" or "Pattern X:" format
                pattern_match = re.search(r'pattern\s*[:\-]\s*([^\n]+)', text_lower)
                if pattern_match:
                    is_pattern = True
                    pattern_name = pattern_match.group(1).strip()
            
            if is_pattern:
                # Find chapter for this pattern
                chapter = node.find_chapter() if hasattr(node, 'find_chapter') else None
                ch_code = chapter.meta.get("code") if chapter and hasattr(chapter, 'meta') else None
                
                # Generate ID
                pattern_id = sha1_id(
                    "PATTERN",
                    f"{ch_code or ''}:{pattern_name or text[:50]}:{node.line_no}"
                )
                
                # Extract pattern category if mentioned
                category = "generic"
                if "design" in text_lower:
                    category = "design"
                elif "architectural" in text_lower or "architecture" in text_lower:
                    category = "architecture"
                elif "behavioral" in text_lower:
                    category = "behavioral"
                elif "structural" in text_lower:
                    category = "structural"
                elif "creational" in text_lower:
                    category = "creational"
                
                # Build metadata
                meta: Dict[str, Any] = {
                    "id": pattern_id,
                    "name": pattern_name or "Unnamed Pattern",
                    "description": pattern_description,
                    "category": category,
                    "chapter": ch_code or "",
                    "pattern_type": "conceptual",  # Distinguish from code-pattern
                }
                
                # Create SSM block
                block = SSMBlock(
                    block_type="pattern",  # FIX 3: Use "pattern" not "code-pattern"
                    meta=meta,
                    body=pattern_description,
                    index=idx,
                    id=pattern_id,
                    chapter=ch_code,
                )
                blocks.append(block)
                idx += 1
    
    return blocks

