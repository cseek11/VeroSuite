"""
Pattern Extractor - Multi-language Pattern Detection

Coordinates language plugins to extract code patterns and emit code-pattern SSM blocks.
"""
from __future__ import annotations

from typing import List, Dict, Any, Optional
from .ast_nodes import ASTDocument, ASTNode, SSMBlock
from .plugins.registry import get_plugin, detect_language
from .plugins.base import CodePattern
from .utils.hashing import sha1_id


def extract_patterns_from_ast(
    doc: ASTDocument,
    errors: Optional[Any] = None,  # ErrorBus (optional)
    symbols: Optional[Any] = None,  # SymbolTable (optional)
) -> List[SSMBlock]:
    """
    Extract code patterns from AST and emit code-pattern SSM blocks.
    
    Args:
        doc: AST document
        errors: ErrorBus instance (optional)
        symbols: SymbolTable instance (optional)
    
    Returns:
        List of code-pattern SSMBlock objects
    """
    blocks: List[SSMBlock] = []
    idx = 0
    
    # Walk AST to find code nodes
    for node in doc.nodes:
        if node.type == "code":
            code = node.code or ""
            lang = node.lang or ""
            
            # Detect language if not specified
            if not lang:
                detected = detect_language(code)
                if detected:
                    lang = detected
            
            # Get plugin for language
            plugin = get_plugin(lang)
            if not plugin:
                continue  # Skip if no plugin available
            
            # Extract patterns
            patterns = plugin.classify_patterns(code)
            
            # Create code-pattern blocks
            for pattern in patterns:
                # Find chapter for this code block
                chapter = node.find_chapter()
                ch_code = chapter.meta.get("code") if chapter else None
                
                # Generate ID
                pattern_id = sha1_id(
                    "CODEPAT",
                    f"{lang}:{pattern.pattern_type}:{pattern.pattern_subtype}:{code[:100]}"
                )
                
                # Build metadata
                meta: Dict[str, Any] = {
                    "id": pattern_id,
                    "language": lang,
                    "pattern_type": pattern.pattern_type,
                    "pattern_subtype": pattern.pattern_subtype,
                    "tags": [pattern.pattern_type, pattern.pattern_subtype],
                    "chapter": ch_code or "",
                }
                
                # Add pattern metadata
                if pattern.metadata:
                    meta["metadata"] = pattern.metadata
                
                # Create SSM block
                block = SSMBlock(
                    block_type="code-pattern",
                    meta=meta,
                    body=code,
                    index=idx,
                    id=pattern_id,
                    chapter=ch_code,
                )
                blocks.append(block)
                idx += 1
    
    return blocks


def enhance_code_blocks_with_patterns(
    blocks: List[SSMBlock],
    doc: ASTDocument,
    errors: Optional[Any] = None,
    symbols: Optional[Any] = None,
) -> None:
    """
    Enhance existing code blocks with pattern metadata.
    
    This function enriches code blocks that are already in the blocks list
    with pattern_type, pattern_subtype, and tags metadata.
    
    Args:
        blocks: List of SSM blocks (modified in place)
        doc: AST document
        errors: ErrorBus instance (optional)
        symbols: SymbolTable instance (optional)
    """
    # Build code block index
    code_blocks = {b.id: b for b in blocks if b.block_type in ["code", "example", "code-pattern"]}
    
    # Walk AST to find code nodes and enhance corresponding blocks
    for node in doc.nodes:
        if node.type == "code":
            code = node.code or ""
            lang = node.lang or ""
            
            # Detect language if not specified
            if not lang:
                detected = detect_language(code)
                if detected:
                    lang = detected
            
            # Get plugin
            plugin = get_plugin(lang)
            if not plugin:
                continue
            
            # Extract patterns
            patterns = plugin.classify_patterns(code)
            
            if not patterns:
                continue
            
            # Find corresponding block (by matching code content)
            for block_id, block in code_blocks.items():
                if block.body == code or (code[:100] in block.body):
                    # Enhance block with pattern metadata
                    if patterns:
                        pattern = patterns[0]  # Use first pattern
                        block.meta["pattern_type"] = pattern.pattern_type
                        block.meta["pattern_subtype"] = pattern.pattern_subtype
                        if "tags" not in block.meta:
                            block.meta["tags"] = []
                        block.meta["tags"].extend([pattern.pattern_type, pattern.pattern_subtype])
                        if pattern.metadata:
                            block.meta["pattern_metadata"] = pattern.metadata
                    
                    # Upgrade to code-pattern if it's currently "example" or "code"
                    if block.block_type in ["example", "code"]:
                        block.block_type = "code-pattern"
                    
                    break

