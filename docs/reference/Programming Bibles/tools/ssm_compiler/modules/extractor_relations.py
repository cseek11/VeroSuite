"""
Relation & Dependency Extractor (Enhanced for Phase 3)

Extracts relations between chapters, sections, and concepts.
Detects explicit and implicit cross-references.
"""
from __future__ import annotations

from typing import List, Optional
from dataclasses import dataclass, field
import re
from .ast_nodes import ASTDocument, ASTNode
from .utils.patterns import SEE_CHAPTER_RE, CHAPTER_HEADING_RE


@dataclass
class RelationEntry:
    """Extracted relation entry with enhanced metadata (Phase 6: namespace support)."""
    from_ref: str  # Source chapter/section code
    to_ref: str    # Target chapter/section code
    relation_type: str  # "prerequisite", "reference", "extends", "depends_on"
    context: str = ""   # Text where relation was found
    line_no: int = 0
    confidence: float = 1.0  # Confidence score (0.0-1.0)
    from_namespace: Optional[str] = None  # NEW - Phase 6
    to_namespace: Optional[str] = None   # NEW - Phase 6


def extract_relations(ast: ASTDocument) -> None:
    """
    Extract relations from AST chapters.
    
    This pass identifies relationships between chapters.
    Currently a pass-through for compatibility.
    
    Args:
        ast: AST document (modified in place)
    """
    # Relations are extracted via extract_relations_from_ast function
    pass


def extract_relations_from_ast(
    doc: ASTDocument,
    errors: Optional[Any] = None,  # ErrorBus (optional)
    symbols: Optional[Any] = None,  # SymbolTable (optional)
    namespace: str = "default",  # NEW - Phase 6
) -> List[RelationEntry]:
    """
    Extract cross-chapter and cross-section relations (Enhanced for Phase 3).
    
    Detects:
    - "See Chapter X" explicit references
    - "As discussed in Chapter X" implicit references
    - Prerequisite chains
    - Dependency patterns
    
    Args:
        doc: AST document
        errors: ErrorBus instance (optional)
        symbols: SymbolTable instance (optional)
    
    Returns:
        List of RelationEntry objects
    """
    rels: List[RelationEntry] = []
    
    # Pattern: "See Chapter X" or "See Section X.Y"
    see_chapter_pattern = re.compile(
        r"(?:see|refer to|discussed in|covered in)\s+(?:chapter|ch\.?|section)\s+(\d+(?:\.\d+)?)",
        re.IGNORECASE
    )
    
    # Pattern: "Requires Chapter X" or "Prerequisite: Chapter X"
    prerequisite_pattern = re.compile(
        r"(?:requires?|prerequisite|depends? on|builds? on)\s+(?:chapter|ch\.?)\s+(\d+)",
        re.IGNORECASE
    )
    
    def find_node_code(node: ASTNode) -> str:
        """Get code for a node (chapter or section)"""
        if node.type == "chapter":
            return node.meta.get("code", f"CH-{node.meta.get('number', 0):02d}")
        elif node.type == "section":
            chapter = node.find_chapter()
            if chapter:
                ch_code = chapter.meta.get("code", "")
                # Generate section code like "CH-01-SEC-1.1"
                section_num = node.text.split()[0] if node.text.split() else ""
                return f"{ch_code}-SEC-{section_num}"
        return ""
    
    # Scan all nodes for relation patterns
    for node in doc.nodes:
        if node.type in ["paragraph", "section", "chapter"]:
            text = node.text
            source_code = find_node_code(node) or (node.find_chapter() and node.find_chapter().meta.get("code"))
            
            # Find "See Chapter X" references
            for match in see_chapter_pattern.finditer(text):
                target_ch = int(match.group(1).split('.')[0])
                target_code = f"CH-{target_ch:02d}"
                
                # Get context (surrounding text)
                start = max(0, match.start() - 50)
                end = min(len(text), match.end() + 50)
                context = text[start:end]
                
                rels.append(RelationEntry(
                    from_ref=source_code or "UNKNOWN",
                    to_ref=target_code,
                    relation_type="reference",
                    context=context,
                    line_no=node.line_no,
                    confidence=0.9,
                    from_namespace=namespace,  # NEW - Phase 6
                    to_namespace=namespace     # NEW - Phase 6 (same namespace for now)
                ))
            
            # Find prerequisite patterns
            for match in prerequisite_pattern.finditer(text):
                target_ch = int(match.group(1))
                target_code = f"CH-{target_ch:02d}"
                
                # Get context
                start = max(0, match.start() - 50)
                end = min(len(text), match.end() + 50)
                context = text[start:end]
                
                rels.append(RelationEntry(
                    from_ref=source_code or "UNKNOWN",
                    to_ref=target_code,
                    relation_type="prerequisite",
                    context=context,
                    line_no=node.line_no,
                    confidence=0.85,
                    from_namespace=namespace,  # NEW - Phase 6
                    to_namespace=namespace     # NEW - Phase 6
                ))
    
    # Deduplicate relations
    seen = set()
    unique_relations = []
    for rel in rels:
        key = (rel.from_ref, rel.to_ref, rel.relation_type)
        if key not in seen:
            seen.add(key)
            unique_relations.append(rel)
    
    return unique_relations
