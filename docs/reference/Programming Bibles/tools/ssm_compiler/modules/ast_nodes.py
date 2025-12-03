"""
AST Node Definitions

AST structures for markdown parsing.
"""
from __future__ import annotations

from dataclasses import dataclass, field
from typing import List, Dict, Any, Optional

# Import runtime components (optional to maintain backward compatibility)
try:
    from runtime.tokens import Token
except ImportError:
    Token = None  # type: ignore


@dataclass
class ASTNode:
    """AST node for markdown elements with hierarchy support."""
    type: str
    text: str = ""
    level: int = 0
    lang: str = ""
    code: str = ""
    children: List["ASTNode"] = field(default_factory=list)
    meta: Dict[str, Any] = field(default_factory=dict)
    line_no: int = 0
    
    # Token reference (NEW - Phase 0)
    token: Optional["Token"] = None
    
    # Hierarchy (NEW - Phase 0)
    parent: Optional["ASTNode"] = None
    
    # Error tracking (NEW - Phase 0)
    errors: List[str] = field(default_factory=list)  # Error codes associated with this node
    
    def add_child(self, node: "ASTNode"):
        """Add child node and set parent reference."""
        node.parent = self
        self.children.append(node)
    
    def get_ancestors(self) -> List["ASTNode"]:
        """Get all ancestor nodes (parent, grandparent, etc.)."""
        ancestors = []
        current = self.parent
        while current:
            ancestors.append(current)
            current = current.parent
        return ancestors
    
    def find_chapter(self) -> Optional["ASTNode"]:
        """Find the chapter node this node belongs to."""
        for ancestor in self.get_ancestors():
            if ancestor.type == "chapter":
                return ancestor
        return None
    
    def find_section(self) -> Optional["ASTNode"]:
        """Find the section node this node belongs to."""
        for ancestor in self.get_ancestors():
            if ancestor.type == "section":
                return ancestor
        return None
    
    def get_position(self) -> str:
        """Get human-readable position string."""
        if self.token:
            return self.token.position_str()
        return f"line {self.line_no}"


@dataclass
class ASTDocument:
    """Complete AST document structure."""
    nodes: List[ASTNode]
    # Optional indexes
    chapters: List[ASTNode] = field(default_factory=list)
    parts: List[ASTNode] = field(default_factory=list)
    
    def get_all_chapters(self) -> List[ASTNode]:
        """Get all chapter nodes recursively."""
        chapters = []
        def collect_chapters(node: ASTNode):
            if node.type == "chapter":
                chapters.append(node)
            for child in node.children:
                collect_chapters(child)
        for part in self.parts:
            collect_chapters(part)
        # Also check direct chapters (not in parts)
        for chapter in self.chapters:
            if chapter not in chapters:
                chapters.append(chapter)
        return chapters
    
    def get_chapter_sections(self, chapter: ASTNode) -> List[ASTNode]:
        """Get all sections within a chapter."""
        sections = []
        def collect_sections(node: ASTNode):
            if node.type == "section":
                sections.append(node)
            for child in node.children:
                collect_sections(child)
        collect_sections(chapter)
        return sections


@dataclass
class SSMBlock:
    """SSM block structure with render capability."""
    block_type: str
    meta: Dict[str, Any]
    body: str
    index: int
    id: str = ""
    chapter: Optional[str] = None
    
    # V3 fields (Solution 5) - populated via generate_v3_metadata
    # These are stored in meta dict, but defined here for type hints
    # token_range: Optional[Tuple[int, int]] = None  # (start_token, end_token)
    # char_offset: Optional[Tuple[int, int]] = None  # (start_char, end_char)
    # digest: Optional[str] = None  # SHA-256 digest
    # source_ref: Optional[Dict[str, Any]] = None  # {file, line, column}
    # symbol_refs: Optional[List[str]] = None  # List of symbol IDs
    # semantic_role: Optional[str] = None  # classification
    
    def render(self) -> str:
        """
        Render SSM block to markdown format.
        
        Returns:
            SSM-formatted markdown string
        """
        lines = [f"::: {self.block_type}"]
        
        # Add metadata
        for key, value in self.meta.items():
            if isinstance(value, list):
                inner = ", ".join(str(x) for x in value)
                lines.append(f"{key}: [{inner}]")
            elif isinstance(value, dict):
                import json
                lines.append(f"{key}: {json.dumps(value)}")
            else:
                lines.append(f"{key}: {value}")
        
        lines.append(":::")
        
        if self.body:
            lines.append(self.body)
            lines.append(":::")
        
        return "\n".join(lines)

