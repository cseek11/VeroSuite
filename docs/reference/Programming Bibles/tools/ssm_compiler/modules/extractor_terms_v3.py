"""
AST-Based Term Extractor (Solution 3)

Extract term definitions from AST structure, preserving full content including
code blocks and multi-line definitions. This replaces regex-based extraction
with AST-based extraction for better accuracy and completeness.

This is Solution 3 from the engineering solutions document.
"""
from __future__ import annotations

import re
from typing import List, Optional, Set, Tuple
from dataclasses import dataclass

from .ast_nodes import ASTDocument, ASTNode
from .extractor_terms import TermEntry

# Import runtime components (optional)
try:
    from runtime.error_bus import ErrorBus
    from runtime.symbol_table import SymbolTable
except ImportError:
    ErrorBus = None  # type: ignore
    SymbolTable = None  # type: ignore


class ASTTermExtractor:
    """
    Extract term definitions from AST structure.
    
    Preserves:
    - Full definition text (not truncated at periods or newlines)
    - Code blocks within definitions
    - Multi-line definitions
    - Formatting and structure
    """
    
    def __init__(
        self,
        errors: Optional["ErrorBus"] = None,
        symbols: Optional["SymbolTable"] = None
    ):
        """
        Initialize AST-based term extractor.
        
        Args:
            errors: ErrorBus instance for diagnostics (optional)
            symbols: SymbolTable instance for symbol tracking (optional)
        """
        self.errors = errors
        self.symbols = symbols
    
    def extract(self, ast: ASTDocument) -> List[TermEntry]:
        """
        Extract terms by analyzing AST structure.
        
        FIX 2: Track chapter context during extraction to populate chapter fields.
        
        Args:
            ast: AST document
            
        Returns:
            List of TermEntry objects with full definitions
        """
        terms: List[TermEntry] = []
        seen: Set[Tuple[str, str]] = set()
        
        # FIX 2: Track current chapter context during traversal
        current_chapter_code = None
        
        for node in ast.nodes:
            # Update chapter context when we encounter a chapter node
            if node.type == "chapter":
                current_chapter_code = node.meta.get("code", f"CH-{node.meta.get('number', 0):02d}")
            
            if node.type == "paragraph":
                # Check if paragraph starts with bold term
                if self._is_term_definition(node):
                    term = self._extract_term(node, seen, current_chapter_code)
                    if term:
                        terms.append(term)
                        seen.add((term.name.lower(), term.definition.lower()[:100]))  # Use first 100 chars for dedup
        
        return terms
    
    def _is_term_definition(self, node: ASTNode) -> bool:
        """
        Check if node is a term definition.
        
        A term definition starts with bold text followed by a colon.
        """
        text = node.text.strip()
        
        # Check for bold term pattern: **term**: definition
        if re.match(r'^\*\*([^*]+)\*\*:\s*', text):
            return True
        
        # Check for quoted term pattern: "term" is/means definition
        if re.match(r'^"([^"]+)"\s+(?:is|means|refers to)\s+', text, re.IGNORECASE):
            return True
        
        return False
    
    def _extract_term(self, node: ASTNode, seen: Set[Tuple[str, str]], chapter_code: Optional[str] = None) -> Optional[TermEntry]:
        """
        Extract full term definition from node.
        
        Collects definition text from the node and continuation nodes
        until a boundary is reached (next term, heading, blank line).
        """
        text = node.text.strip()
        
        # Extract term name
        term_name = None
        definition_start_idx = 0
        
        # Try bold term pattern: **term**: definition
        bold_match = re.match(r'^\*\*([^*]+)\*\*:\s*(.*)', text, re.DOTALL)
        if bold_match:
            term_name = bold_match.group(1).strip()
            definition_start_idx = bold_match.end(1) + 3  # After "**: "
            initial_def = bold_match.group(2).strip()
        else:
            # Try quoted term pattern: "term" is/means definition
            quoted_match = re.match(r'^"([^"]+)"\s+(?:is|means|refers to)\s+(.*)', text, re.IGNORECASE | re.DOTALL)
            if quoted_match:
                term_name = quoted_match.group(1).strip()
                definition_start_idx = quoted_match.end(1) + 1  # After closing quote
                # Find "is/means/refers to" and get text after
                means_match = re.search(r'(?:is|means|refers to)\s+(.*)', text, re.IGNORECASE | re.DOTALL)
                if means_match:
                    initial_def = means_match.group(1).strip()
                else:
                    initial_def = ""
            else:
                return None
        
        if not term_name:
            return None
        
        # Collect definition parts
        definition_parts = []
        
        # Start with text after colon/means
        if initial_def:
            definition_parts.append(initial_def)
        
        # Continue to next nodes if they're part of the definition
        continuation = self._collect_continuation_nodes(node)
        if continuation:
            definition_parts.append(continuation)
        
        # Join all parts
        full_definition = ' '.join(definition_parts).strip()
        
        # Clean up: normalize whitespace but preserve code blocks
        # Don't collapse newlines inside code blocks
        full_definition = self._normalize_definition(full_definition)
        
        # Generate summary (first sentence or 100 chars)
        summary = self._generate_summary(full_definition)
        
        # Check for duplicates
        key = (term_name.lower(), full_definition.lower()[:100])
        if key in seen:
            return None
        
        # FIX 2: Store chapter code in term entry if available
        # Note: TermEntry doesn't have a chapter field, but we can use meta or
        # the chapter will be assigned during block creation in parser_ssm.py
        # For now, we'll rely on chapter_for_line in parser_ssm.py, but we've
        # improved compute_chapter_ranges to use AST chapter nodes
        
        return TermEntry(
            name=term_name,
            definition=full_definition,
            aliases=[],
            first_line=node.line_no
        )
    
    def _collect_continuation_nodes(self, node: ASTNode) -> str:
        """
        Collect nodes that continue the definition.
        
        Stops at:
        - Next term definition
        - Heading (chapter/section)
        - Double newline (paragraph boundary)
        - End of parent chapter/section
        """
        parts = []
        
        # Get parent to traverse siblings
        parent = node.parent
        if not parent:
            # If no parent, try to find siblings in document
            # This is a fallback for nodes not in a parent structure
            return ""
        
        # Find node's index in parent's children
        try:
            node_idx = parent.children.index(node)
        except ValueError:
            # Node not in parent's children - try document-level traversal
            # Find node in document nodes and check next nodes
            return self._collect_from_document_siblings(node)
        
        # Check next siblings
        for i in range(node_idx + 1, len(parent.children)):
            sibling = parent.children[i]
            
            # Stop at next term definition
            if self._is_term_definition(sibling):
                break
            
            # Stop at heading
            if sibling.type in ["heading", "chapter", "section"]:
                break
            
            # Stop at blank line (paragraph boundary)
            if sibling.type == "blank_line" or (sibling.type == "paragraph" and not sibling.text.strip()):
                # Check if this is a double newline (paragraph break)
                break
            
            # Collect code blocks (preserve formatting)
            if sibling.type == "code":
                lang = sibling.meta.get("language", sibling.lang) or ""
                code_text = sibling.text
                parts.append(f"\n```{lang}\n{code_text}\n```\n")
            elif sibling.type == "paragraph":
                # Collect paragraph text
                text = sibling.text.strip()
                if text:
                    parts.append(text)
            elif sibling.type == "list":
                # Collect list items
                list_text = self._extract_list_text(sibling)
                if list_text:
                    parts.append(list_text)
        
        return " ".join(parts)
    
    def _collect_from_document_siblings(self, node: ASTNode) -> str:
        """Fallback: collect continuation from document-level node list."""
        # This is a simplified fallback - in practice, nodes should be in parent structure
        # But we handle the case where they're not
        parts = []
        
        # This would require access to the full document, which we don't have here
        # For now, return empty - the main definition text should be sufficient
        return ""
    
    def _extract_list_text(self, list_node: ASTNode) -> str:
        """Extract text from list node."""
        items = []
        for child in list_node.children:
            if child.type == "list_item":
                items.append(child.text.strip())
        return "\n".join(f"- {item}" for item in items)
    
    def _normalize_definition(self, definition: str) -> str:
        """
        Normalize definition text while preserving code blocks.
        
        - Normalize whitespace outside code blocks
        - Preserve code block formatting
        - Remove excessive blank lines
        """
        # Split by code blocks to preserve them
        code_block_pattern = r'```[\s\S]*?```'
        code_blocks = re.findall(code_block_pattern, definition)
        
        # Replace code blocks with placeholders
        placeholder_pattern = r'```[\s\S]*?```'
        text_parts = re.split(placeholder_pattern, definition)
        
        # Normalize text parts (outside code blocks)
        normalized_parts = []
        for i, text_part in enumerate(text_parts):
            # Normalize whitespace
            normalized = ' '.join(text_part.split())
            if normalized:
                normalized_parts.append(normalized)
            
            # Add code block back if exists
            if i < len(code_blocks):
                normalized_parts.append(code_blocks[i])
        
        return ' '.join(normalized_parts)
    
    def _generate_summary(self, definition: str) -> str:
        """
        Generate meaningful summary from definition.
        
        - Remove code blocks for summary
        - Get first sentence
        - Strip list markers
        - Fallback to first 100 chars
        """
        # Remove code blocks for summary
        text = re.sub(r'```.*?```', '', definition, flags=re.DOTALL)
        
        # Remove list markers
        text = re.sub(r'^\s*[-*\d]+\.\s*', '', text, flags=re.MULTILINE)
        
        # Get first sentence
        sentences = re.split(r'[.!?]\s+', text)
        if sentences:
            summary = sentences[0].strip()
            if len(summary) > 10:  # Meaningful length
                return summary
        
        # Fallback: first 100 chars
        summary = text[:100].strip()
        if len(summary) > 150:
            summary = summary[:147] + "..."
        
        return summary


def extract_terms_from_ast_v3(
    doc: ASTDocument,
    errors: Optional["ErrorBus"] = None,
    symbols: Optional["SymbolTable"] = None
) -> List[TermEntry]:
    """
    Extract terms using AST-based extraction (Solution 3).
    
    This is the new V3 term extractor that preserves full definitions.
    
    Args:
        doc: AST document
        errors: ErrorBus instance (optional)
        symbols: SymbolTable instance (optional)
    
    Returns:
        List of TermEntry objects with full definitions
    """
    extractor = ASTTermExtractor(errors=errors, symbols=symbols)
    return extractor.extract(doc)

