"""
Centralized Symbol Table

Provides symbol tracking for all document symbols (terms, concepts, sections, patterns, chapters).
"""
from __future__ import annotations

from typing import Dict, List, Optional, Any, Set
from dataclasses import dataclass, field


@dataclass
class SymbolEntry:
    """Entry in symbol table."""
    name: str
    id: str
    type: str  # "term", "concept", "section", "pattern", "chapter"
    line_no: int
    meta: Dict[str, Any] = field(default_factory=dict)


class NamespaceSymbolTable:
    """Symbol table for a single namespace (Phase 6)."""
    
    def __init__(self, namespace: str):
        self.namespace = namespace
        # Primary symbol maps: name → id
        self.terms: Dict[str, str] = {}           # term_name → id
        self.concepts: Dict[str, str] = {}        # concept_title → id
        self.sections: Dict[str, str] = {}        # section_title → id
        self.patterns: Dict[str, str] = {}         # pattern_signature → id
        self.chapters: Dict[int, str] = {}        # chapter_number → chapter_id
        
        # Reverse index: id → SymbolEntry
        self.by_id: Dict[str, SymbolEntry] = {}
        
        # Diagnostics helpers
        self.duplicate_chapters: List[tuple] = []  # (number, id) pairs
        self.unresolved_references: List[Dict[str, Any]] = []
        
        # Alias tracking (for term normalization)
        self.aliases: Dict[str, str] = {}  # alias → canonical_name


class SymbolTable:
    """Centralized symbol table for all document symbols (Phase 6: Multi-namespace support)."""

    def __init__(self, default_namespace: str = "default"):
        # Phase 6: Multi-namespace support
        self.namespaces: Dict[str, NamespaceSymbolTable] = {}
        self.default_namespace = default_namespace
        self.current_namespace = default_namespace
        
        # Create default namespace
        self.namespaces[default_namespace] = NamespaceSymbolTable(default_namespace)
        
        # Backward compatibility: expose current namespace's symbols directly
        self._current = self.namespaces[default_namespace]
        
        # Primary symbol maps: name → id (delegated to current namespace)
        self.terms: Dict[str, str] = self._current.terms
        self.concepts: Dict[str, str] = self._current.concepts
        self.sections: Dict[str, str] = self._current.sections
        self.patterns: Dict[str, str] = self._current.patterns
        self.chapters: Dict[int, str] = self._current.chapters
        self.by_id: Dict[str, SymbolEntry] = self._current.by_id
        self.duplicate_chapters: List[tuple] = self._current.duplicate_chapters
        self.unresolved_references: List[Dict[str, Any]] = self._current.unresolved_references
        self.aliases: Dict[str, str] = self._current.aliases
    
    def set_namespace(self, namespace: str) -> None:
        """Switch to a different namespace."""
        if namespace not in self.namespaces:
            self.namespaces[namespace] = NamespaceSymbolTable(namespace)
        self.current_namespace = namespace
        self._current = self.namespaces[namespace]
        
        # Update references to point to current namespace
        self.terms = self._current.terms
        self.concepts = self._current.concepts
        self.sections = self._current.sections
        self.patterns = self._current.patterns
        self.chapters = self._current.chapters
        self.by_id = self._current.by_id
        self.duplicate_chapters = self._current.duplicate_chapters
        self.unresolved_references = self._current.unresolved_references
        self.aliases = self._current.aliases
    
    def get_namespace(self, namespace: str) -> Optional[NamespaceSymbolTable]:
        """Get symbol table for a specific namespace."""
        return self.namespaces.get(namespace)
    
    def get_symbol(self, namespace: str, symbol_id: str) -> Optional[SymbolEntry]:
        """Get symbol entry from a specific namespace."""
        ns_table = self.get_namespace(namespace)
        if ns_table:
            return ns_table.by_id.get(symbol_id)
        return None

    # --- Term Handling ---
    def add_term(self, name: str, id: str, line_no: int = 0, **meta) -> bool:
        """
        Add a term to the symbol table.
        
        Returns:
            True if added, False if duplicate
        """
        key = name.lower().strip()
        if key in self.terms:
            return False  # Duplicate
        
        self.terms[key] = id
        self.by_id[id] = SymbolEntry(
            name=name,
            id=id,
            type="term",
            line_no=line_no,
            meta=meta
        )
        return True

    def get_term(self, name: str) -> Optional[str]:
        """Get term ID by name (case-insensitive)."""
        return self.terms.get(name.lower().strip())

    def add_term_alias(self, alias: str, canonical: str):
        """Add an alias for a term."""
        self.aliases[alias.lower()] = canonical.lower()

    # --- Concept Handling ---
    def add_concept(self, title: str, id: str, line_no: int = 0, **meta) -> bool:
        """Add a concept to the symbol table."""
        key = title.lower().strip()
        if key in self.concepts:
            return False
        
        self.concepts[key] = id
        self.by_id[id] = SymbolEntry(
            name=title,
            id=id,
            type="concept",
            line_no=line_no,
            meta=meta
        )
        return True

    def get_concept(self, title: str) -> Optional[str]:
        """Get concept ID by title (case-insensitive)."""
        return self.concepts.get(title.lower().strip())

    # --- Section Handling ---
    def add_section(self, title: str, id: str, line_no: int = 0, **meta) -> bool:
        """Add a section to the symbol table."""
        key = title.lower().strip()
        self.sections[key] = id
        self.by_id[id] = SymbolEntry(
            name=title,
            id=id,
            type="section",
            line_no=line_no,
            meta=meta
        )
        return True

    def get_section(self, title: str) -> Optional[str]:
        """Get section ID by title (case-insensitive)."""
        return self.sections.get(title.lower().strip())

    # --- Pattern Handling ---
    def add_pattern(self, signature: str, id: str, line_no: int = 0, **meta) -> bool:
        """Add a code pattern to the symbol table."""
        if signature in self.patterns:
            return False
        
        self.patterns[signature] = id
        self.by_id[id] = SymbolEntry(
            name=signature,
            id=id,
            type="pattern",
            line_no=line_no,
            meta=meta
        )
        return True

    def get_pattern(self, signature: str) -> Optional[str]:
        """Get pattern ID by signature."""
        return self.patterns.get(signature)

    # --- Chapter Handling ---
    def add_chapter(self, number: int, id: str, line_no: int = 0, **meta) -> bool:
        """
        Add a chapter to the symbol table.
        
        Returns:
            True if added, False if duplicate
        """
        if number in self.chapters:
            # Track duplicate
            existing_id = self.chapters[number]
            self.duplicate_chapters.append((number, existing_id, id))
            return False
        
        self.chapters[number] = id
        # Use title from meta if provided, otherwise use default format
        chapter_name = meta.get("title", f"Chapter {number}")
        self.by_id[id] = SymbolEntry(
            name=chapter_name,
            id=id,
            type="chapter",
            line_no=line_no,
            meta=meta
        )
        return True

    def get_chapter(self, number: int) -> Optional[str]:
        """Get chapter ID by number."""
        return self.chapters.get(number)

    # --- Reference Resolution ---
    def resolve_reference(self, ref_text: str, ref_type: str = "auto") -> Optional[str]:
        """
        Resolve a reference text to a symbol ID.
        
        Args:
            ref_text: Reference text (e.g., "Chapter 3", "term_name")
            ref_type: Type hint ("chapter", "term", "concept", "auto")
        
        Returns:
            Symbol ID or None if not found
        """
        ref_lower = ref_text.lower().strip()
        
        # Try chapter reference
        if ref_type in ("auto", "chapter"):
            import re
            ch_match = re.search(r"chapter\s+(\d+)", ref_lower)
            if ch_match:
                ch_num = int(ch_match.group(1))
                return self.get_chapter(ch_num)
        
        # Try term reference
        if ref_type in ("auto", "term"):
            # Check aliases first
            canonical = self.aliases.get(ref_lower)
            if canonical:
                return self.get_term(canonical)
            return self.get_term(ref_text)
        
        # Try concept reference
        if ref_type in ("auto", "concept"):
            return self.get_concept(ref_text)
        
        # Try section reference
        if ref_type in ("auto", "section"):
            return self.get_section(ref_text)
        
        return None

    def track_unresolved(self, ref_text: str, ref_type: str, line_no: int, context: str = ""):
        """Track an unresolved reference for diagnostics."""
        self.unresolved_references.append({
            "ref_text": ref_text,
            "ref_type": ref_type,
            "line_no": line_no,
            "context": context
        })

    # --- Statistics ---
    def stats(self) -> Dict[str, int]:
        """Get symbol table statistics."""
        return {
            "terms": len(self.terms),
            "concepts": len(self.concepts),
            "sections": len(self.sections),
            "patterns": len(self.patterns),
            "chapters": len(self.chapters),
            "aliases": len(self.aliases),
            "duplicate_chapters": len(self.duplicate_chapters),
            "unresolved_references": len(self.unresolved_references),
            "total_symbols": len(self.by_id)
        }

    def to_dict(self) -> Dict[str, Any]:
        """Convert symbol table to dictionary for serialization."""
        return {
            "terms": self.terms,
            "concepts": self.concepts,
            "sections": self.sections,
            "patterns": self.patterns,
            "chapters": self.chapters,
            "aliases": self.aliases,
            "duplicate_chapters": self.duplicate_chapters,
            "unresolved_references": self.unresolved_references,
            "stats": self.stats()
        }

