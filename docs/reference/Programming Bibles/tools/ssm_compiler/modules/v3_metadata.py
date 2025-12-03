"""
V3 Metadata Generator (Solution 5)

Generates V3 SSM fields: token_range, char_offset, digest, source_ref,
symbol_refs, and semantic_role.

This is Solution 5 from the engineering solutions document.
"""
from __future__ import annotations

import hashlib
import re
from typing import Optional, Tuple, List, Dict, Any

from .ast_nodes import ASTNode, SSMBlock

# Constants for symbol extraction
MIN_SYMBOL_LENGTH = 1
MAX_SYMBOL_REFS_UNVALIDATED = 10
MAX_SYMBOL_REFS_LIMIT = 20
CHARS_PER_LINE_ESTIMATE = 80

# Import runtime components (optional)
try:
    from runtime.symbol_table import SymbolTable
except ImportError:
    SymbolTable = None  # type: ignore


def generate_v3_metadata(
    block: SSMBlock,
    source_node: Optional[ASTNode] = None,
    symbols: Optional["SymbolTable"] = None,
    source_file: Optional[str] = None
) -> None:
    """
    Populate V3 SSM fields on a block.
    
    Args:
        block: SSMBlock to populate
        source_node: AST node this block was generated from (optional)
        symbols: SymbolTable instance for symbol references (optional)
        source_file: Source file path (optional)
    """
    # Generate digest
    block.meta["digest"] = _generate_digest(block)
    
    # Extract symbol references
    block.meta["symbol_refs"] = _extract_symbols(block, symbols)
    
    # Classify semantic role
    block.meta["semantic_role"] = _classify_semantic_role(block)
    
    # Populate from source node if available
    if source_node:
        _populate_from_node(block, source_node, source_file)


def _generate_digest(block: SSMBlock) -> str:
    """Generate SHA-256 digest of block content."""
    content = f"{block.block_type}:{block.id}:{block.body}"
    return hashlib.sha256(content.encode()).hexdigest()


def _extract_symbols(block: SSMBlock, symbols: Optional["SymbolTable"]) -> List[str]:
    """
    Extract code symbols referenced in block.
    
    FIX 4: Enhanced symbol extraction to populate symbol_refs properly.
    """
    symbol_refs: List[str] = []
    body = block.body or ""
    meta = block.meta or {}
    
    # FIX 4: Extract from code blocks
    if block.block_type in ["code", "code-pattern", "example"]:
        code = body
        
        # Function/rule definitions (Rego: rule names, Python: def, etc.)
        functions = re.findall(r'\b(?:rule|def|func|function|const|let|var)\s+(\w+)', code, re.IGNORECASE)
        symbol_refs.extend(functions)
        
        # Imports (Rego: import, Python: import/from, TypeScript: import)
        imports = re.findall(r'(?:import|from)\s+([^\s;]+)', code, re.IGNORECASE)
        symbol_refs.extend(imports)
        
        # Function calls (built-ins and user functions)
        calls = re.findall(r'\b(count|sum|max|min|all|any|contains|startswith|endswith|regex|glob|json|base64|urlquery)\s*\(', code, re.IGNORECASE)
        symbol_refs.extend(calls)
        
        # Rego-specific: package names
        packages = re.findall(r'package\s+(\S+)', code, re.IGNORECASE)
        symbol_refs.extend(packages)
        
        # Variable references (in code blocks)
        variables = re.findall(r'\b([a-z_][a-z0-9_]*)\s*[:=]', code)
        symbol_refs.extend(variables)
    
    # FIX 4: Extract from text blocks (terms, concepts, paragraphs)
    elif block.block_type in ["term", "concept", "paragraph", "section", "qa", "rationale", "fact", "antipattern", "pattern", "contrast", "inference", "pathway", "constraint"]:
        # Look for bold terms (markdown **term**)
        bold_terms = re.findall(r'\*\*([^*]+)\*\*', body)
        symbol_refs.extend(bold_terms)
        
        # Look for code references (backticks)
        code_refs = re.findall(r'`([^`]+)`', body)
        symbol_refs.extend(code_refs)
        
        # Look for term references in definitions
        if block.block_type == "term":
            # Extract referenced terms from definition text
            term_refs = re.findall(r'\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\b', body)
            symbol_refs.extend(term_refs)
        
        # Extract from metadata fields (name, summary, definition, etc.)
        if "name" in meta:
            symbol_refs.append(str(meta["name"]))
        if "summary" in meta:
            # Extract terms from summary
            summary = str(meta["summary"])
            summary_terms = re.findall(r'\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\b', summary)
            symbol_refs.extend(summary_terms)
        if "definition" in meta:
            # Extract terms from definition
            definition = str(meta["definition"])
            def_terms = re.findall(r'\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\b', definition)
            symbol_refs.extend(def_terms)
        
        # Extract from qa blocks (question and answer)
        if block.block_type == "qa":
            q = str(meta.get("q", ""))
            a = str(meta.get("a", ""))
            # Extract terms from question
            q_terms = re.findall(r'\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\b', q)
            symbol_refs.extend(q_terms)
            # Extract terms from answer
            a_terms = re.findall(r'\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\b', a)
            symbol_refs.extend(a_terms)
        
        # Extract function/rule names mentioned in text
        function_mentions = re.findall(r'\b(?:function|rule|def|method)\s+(\w+)', body, re.IGNORECASE)
        symbol_refs.extend(function_mentions)
        
        # Extract package/import references
        package_mentions = re.findall(r'\b(?:package|import|from)\s+([^\s,;]+)', body, re.IGNORECASE)
        symbol_refs.extend(package_mentions)
    
    # FIX 4: Extract from metadata (if symbols are stored there)
    if "symbols" in meta:
        if isinstance(meta["symbols"], list):
            symbol_refs.extend(meta["symbols"])
        elif isinstance(meta["symbols"], str):
            symbol_refs.append(meta["symbols"])
    
    # FIX 4: Extract from name field (for terms)
    if "name" in meta:
        symbol_refs.append(meta["name"])
    
    # Deduplicate and normalize
    symbol_refs = [s.strip() for s in symbol_refs if s.strip()]
    symbol_refs = list(set(symbol_refs))
    
    # Filter out single-letter tokens and generic words
    GENERIC_WORD_STOPLIST = {
        'important', 'rationale', 'maintainability', 'useful', 'better',
        'good', 'bad', 'correct', 'incorrect', 'right', 'wrong', 'yes', 'no',
        'this', 'that', 'these', 'those', 'the', 'a', 'an', 'and', 'or', 'but',
        'for', 'with', 'from', 'to', 'in', 'on', 'at', 'by', 'of', 'as', 'is',
        'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do',
        'does', 'did', 'will', 'would', 'should', 'could', 'may', 'might', 'must',
        'what', 'when', 'where', 'why', 'how', 'which', 'who', 'whom'
    }
    
    # Filter: remove single letters and generic words
    filtered_refs = []
    for ref in symbol_refs:
        # Skip single letters (n, i, x, etc.)
        if len(ref) == MIN_SYMBOL_LENGTH:
            continue
        # Skip generic words
        if ref.lower() in GENERIC_WORD_STOPLIST:
            continue
        # Skip if it's just whitespace or punctuation
        if not ref.replace('_', '').replace('-', '').isalnum():
            continue
        filtered_refs.append(ref)
    
    symbol_refs = filtered_refs
    
    # FIX 4: If symbol table available, resolve and validate references
    if symbols:
        resolved = []
        for sym in symbol_refs:
            # Normalize symbol name
            sym_normalized = sym.strip().lower()
            
            # Check if symbol exists in symbol table
            symbol_exists = False
            
            # Check by_id (all symbols)
            if hasattr(symbols, 'by_id') and sym_normalized in symbols.by_id:
                symbol_exists = True
            # Check by namespace
            elif hasattr(symbols, 'get_symbol'):
                # Try default namespace
                entry = symbols.get_symbol(symbols.default_namespace, sym)
                if entry:
                    symbol_exists = True
                else:
                    # Try all namespaces
                    if hasattr(symbols, 'by_namespace'):
                        for ns in symbols.by_namespace:
                            entry = symbols.get_symbol(ns, sym)
                            if entry:
                                symbol_exists = True
                                break
            
            # FIX 4: Include symbol even if not in table (might be external reference)
            # But prioritize symbols that exist in table
            if symbol_exists or len(symbol_refs) < MAX_SYMBOL_REFS_UNVALIDATED:
                resolved.append(sym)
        
        return resolved[:MAX_SYMBOL_REFS_LIMIT]
    
    return symbol_refs[:MAX_SYMBOL_REFS_LIMIT]


def _classify_semantic_role(block: SSMBlock) -> str:
    """
    Classify the semantic role of this block.
    
    FIX 5: Expanded to 14 semantic roles as required.
    """
    # Primary role map by block type
    role_map: Dict[str, str] = {
        "concept": "concept",
        "term": "definition",
        "code": "example",
        "code-pattern": "pattern",
        "pattern": "pattern",  # FIX 3: Conceptual pattern blocks
        "example": "example",
        "antipattern": "antipattern",
        "qa": "explanation",
        "rationale": "rationale",
        "diagram": "visualization",
        "table": "reference",
        "relation": "connection",
        "contrast": "comparison",
        "fact": "assertion",
        "chapter-meta": "structure",
        "part-meta": "structure",
        "section-meta": "structure",
        "section": "explanation",
        "paragraph": "content",
    }
    
    base_role = role_map.get(block.block_type, "content")
    
    # FIX 5: Enhanced role classification based on content and metadata
    body_lower = block.body.lower() if block.body else ""
    meta = block.meta or {}
    
    # Override based on content patterns
    if "walkthrough" in body_lower or "step-by-step" in body_lower:
        return "walkthrough"
    
    if "architecture" in body_lower or "topology" in body_lower or "deployment" in body_lower:
        return "architecture"
    
    if "decision" in body_lower and ("flow" in body_lower or "tree" in body_lower):
        return "decision-flow"
    
    if "warning" in body_lower or "danger" in body_lower or "⚠️" in body_lower:
        return "warning"
    
    if "glossary" in body_lower or "terminology" in body_lower:
        return "glossary"
    
    if meta.get("pattern_type") and block.block_type == "pattern":
        return "pattern"
    
    if meta.get("pattern_type") and block.block_type == "code-pattern":
        return "pattern"
    
    # Check for reference material
    if "see also" in body_lower or "reference" in body_lower or "see chapter" in body_lower:
        return "reference"
    
    return base_role


def _populate_from_node(
    block: SSMBlock,
    node: ASTNode,
    source_file: Optional[str] = None
) -> None:
    """Populate V3 fields from source AST node."""
    # Token range (if token available)
    if hasattr(node, 'token') and node.token:
        token = node.token
        if hasattr(token, 'line') and hasattr(token, 'column'):
            # Estimate token range (start and end positions)
            # This is approximate - full token tracking would require tokenizer
            block.meta["token_range"] = (node.line_no, node.line_no)
    
    # Character offset (approximate from line numbers)
    # Full char offset would require tracking character positions in source
    if node.line_no > 0:
        # Estimate: assume CHARS_PER_LINE_ESTIMATE chars per line
        estimated_start = (node.line_no - 1) * CHARS_PER_LINE_ESTIMATE
        estimated_end = estimated_start + len(node.text)
        block.meta["char_offset"] = (estimated_start, estimated_end)
    
    # Source reference
    if source_file or node.line_no > 0:
        source_ref: Dict[str, Any] = {}
        if source_file:
            source_ref["file"] = source_file
        if node.line_no > 0:
            source_ref["line"] = node.line_no
        if hasattr(node, 'token') and node.token and hasattr(node.token, 'column'):
            source_ref["column"] = node.token.column
        block.meta["source_ref"] = source_ref


def enrich_blocks_with_v3_metadata(
    blocks: List[SSMBlock],
    ast: Optional[Any] = None,  # ASTDocument (optional)
    symbols: Optional["SymbolTable"] = None,
    source_file: Optional[str] = None
) -> None:
    """
    Enrich all blocks with V3 metadata.
    
    This is a post-processing step that adds V3 fields to all blocks.
    
    Args:
        blocks: List of SSM blocks (modified in place)
        ast: AST document for source node lookup (optional)
        symbols: SymbolTable instance (optional)
        source_file: Source file path (optional)
    """
    for block in blocks:
        # Try to find source node if AST provided
        source_node = None
        if ast:
            # Try to find node by block ID or line number
            # This is approximate - full mapping would require tracking
            pass
        
        generate_v3_metadata(
            block,
            source_node=source_node,
            symbols=symbols,
            source_file=source_file
        )

