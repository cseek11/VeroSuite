"""
Semantic Relation Extractor (Solution 2)

Extracts semantic relationships between blocks using pattern matching and dependency analysis.
Supports relation types: requires, extends, contradicts, used_by, implements, part_of, related_to.

This is Solution 2 from the engineering solutions document.
"""
from __future__ import annotations

import re
from typing import List, Optional, Dict, Any, Set
from dataclasses import dataclass, field

from .ast_nodes import ASTDocument, ASTNode

# Import runtime components (optional)
try:
    from runtime.error_bus import ErrorBus
    from runtime.symbol_table import SymbolTable
except ImportError:
    ErrorBus = None  # type: ignore
    SymbolTable = None  # type: ignore


@dataclass
class SemanticRelation:
    """Semantic relation entry with enhanced metadata."""
    relation_type: str  # requires, extends, contradicts, used_by, implements, part_of, related_to
    source_id: str  # Source block/chapter ID
    target_id: str  # Target block/chapter ID
    confidence: float = 0.8  # Confidence score (0.0-1.0)
    evidence: str = ""  # Text evidence for the relation
    context: str = ""  # Surrounding context
    line_no: int = 0
    from_namespace: Optional[str] = None
    to_namespace: Optional[str] = None


class SemanticRelationExtractor:
    """
    Extract semantic relationships between blocks.
    
    Detects:
    - Explicit semantic phrases (requires, extends, contradicts, etc.)
    - Code dependencies (imports, function calls)
    - Concept dependencies (references in definitions)
    - Structural hints (chapter order, section hierarchy)
    """
    
    # Relation patterns with confidence scores
    RELATION_PATTERNS: Dict[str, List[tuple]] = {
        'requires': [
            (r'\b(?:requires?|needs?|depends?\s+on|prerequisites?)\b', 0.9),
            (r'\bmust\s+(?:first|understand|know|have)\b', 0.85),
            (r'\bassumes?\s+(?:knowledge\s+of|understanding\s+of)\b', 0.8),
            (r'\b(?:before|prior\s+to).*?(?:read|understand|study)\b', 0.75),
        ],
        'extends': [
            (r'\b(?:extends?|builds?\s+on|enhances?)\b', 0.9),
            (r'\bis\s+an?\s+(?:extension|enhancement)\s+of\b', 0.85),
            (r'\badds?\s+(?:to|support\s+for)\b', 0.8),
            (r'\b(?:continues?|follows?)\s+from\b', 0.75),
        ],
        'contradicts': [
            (r'\b(?:contradicts?|conflicts?\s+with|opposes?)\b', 0.9),
            (r'\b(?:unlike|contrary\s+to|in\s+contrast\s+to)\b', 0.85),
            (r'\b(?:however|but|although).*(?:not|never|cannot)\b', 0.7),
            (r'\b(?:different|opposite)\s+from\b', 0.75),
        ],
        'used_by': [
            (r'\bis\s+used\s+(?:by|in|for)\b', 0.85),
            (r'\b(?:enables?|allows?|supports?)\b', 0.8),
            (r'\bprovides?\s+(?:support\s+for|functionality\s+for)\b', 0.8),
            (r'\b(?:utilized|applied)\s+in\b', 0.75),
        ],
        'implements': [
            (r'\b(?:implements?|realizes?)\b', 0.9),
            (r'\bis\s+an?\s+implementation\s+of\b', 0.85),
            (r'\bprovides?\s+an?\s+implementation\b', 0.8),
            (r'\b(?:concrete|specific)\s+version\s+of\b', 0.75),
        ],
        'part_of': [
            (r'\bis\s+(?:part\s+of|a\s+component\s+of)\b', 0.9),
            (r'\bbelongs?\s+to\b', 0.85),
            (r'\b(?:within|inside)\b', 0.7),
            (r'\b(?:sub|child)\s+of\b', 0.8),
        ],
        'related_to': [
            (r'\bis\s+related\s+to\b', 0.8),
            (r'\b(?:similar|comparable)\s+to\b', 0.75),
            (r'\b(?:see\s+also|compare\s+with)\b', 0.7),
            (r'\b(?:connected|linked)\s+to\b', 0.7),
        ],
    }
    
    def __init__(
        self,
        errors: Optional["ErrorBus"] = None,
        symbols: Optional["SymbolTable"] = None
    ):
        """
        Initialize semantic relation extractor.
        
        Args:
            errors: ErrorBus instance for diagnostics (optional)
            symbols: SymbolTable instance for symbol resolution (optional)
        """
        self.errors = errors
        self.symbols = symbols
    
    def extract(
        self,
        ast: ASTDocument,
        existing_blocks: Optional[List[Any]] = None,
        namespace: str = "default"
    ) -> List[SemanticRelation]:
        """
        Extract semantic relations from AST and existing blocks.
        
        Args:
            ast: AST document
            existing_blocks: Existing SSM blocks (optional, for concept analysis)
            namespace: Namespace for relations
            
        Returns:
            List of SemanticRelation objects
        """
        relations: List[SemanticRelation] = []
        
        # Extract from explicit text patterns
        relations.extend(self._extract_from_text(ast, namespace))
        
        # Extract from code dependencies
        relations.extend(self._extract_from_code(ast, namespace))
        
        # Extract from concept definitions
        if existing_blocks:
            relations.extend(self._extract_from_concepts(existing_blocks, namespace))
        
        # Extract from structural hints
        relations.extend(self._extract_from_structure(ast, namespace))
        
        # Deduplicate and return
        return self._deduplicate_relations(relations)
    
    def _extract_from_text(self, ast: ASTDocument, namespace: str) -> List[SemanticRelation]:
        """Find relation patterns in text."""
        relations: List[SemanticRelation] = []
        
        for node in ast.nodes:
            if node.type in ["paragraph", "section", "chapter"]:
                text = node.text
                
                for relation_type, patterns in self.RELATION_PATTERNS.items():
                    for pattern, confidence in patterns:
                        # Compile pattern with IGNORECASE flag
                        compiled_pattern = re.compile(pattern, re.IGNORECASE)
                        matches = compiled_pattern.finditer(text)
                        for match in matches:
                            relation = self._extract_relation_from_match(
                                node, match, relation_type, confidence, namespace
                            )
                            if relation:
                                relations.append(relation)
        
        return relations
    
    def _extract_relation_from_match(
        self,
        node: ASTNode,
        match: re.Match,
        relation_type: str,
        confidence: float,
        namespace: str
    ) -> Optional[SemanticRelation]:
        """Extract subject/object from matched relation pattern."""
        text = node.text
        match_start = match.start()
        match_end = match.end()
        
        # Look for object after match (target of relation)
        obj = self._find_nearest_entity(
            text[match_end:],
            node,
            direction='forward'
        )
        
        # If no object found, can't create relation
        if not obj:
            return None
        
        # Look for subject before match (source of relation)
        subject = self._find_nearest_entity(
            text[:match_start],
            node,
            direction='backward'
        )
        
        # If no explicit subject, try to infer from context
        if not subject:
            # Try to get current chapter/section
            chapter = node.find_chapter()
            if chapter:
                subject = chapter.meta.get("code", "")
            
            # If still no subject, try to extract from text before match
            if not subject:
                # Look for "this chapter", "this section", etc.
                before_text = text[:match_start].lower()
                if "this chapter" in before_text or "chapter" in before_text:
                    # Try to find chapter number in before text
                    ch_match = re.search(r'chapter\s+(\d+)', before_text, re.IGNORECASE)
                    if ch_match:
                        subject = f"CH-{int(ch_match.group(1)):02d}"
                
                # Fallback: use node's code if available
                if not subject and node.meta.get("code"):
                    subject = node.meta.get("code")
        
        # If we still don't have a subject, we can't create a valid relation
        if not subject:
            return None
        
        # Get context
        context_start = max(0, match_start - 50)
        context_end = min(len(text), match_end + 50)
        context = text[context_start:context_end]
        
        return SemanticRelation(
            relation_type=relation_type,
            source_id=subject,
            target_id=obj,
            confidence=confidence,
            evidence=text[match_start:match_end],
            context=context,
            line_no=node.line_no,
            from_namespace=namespace,
            to_namespace=namespace
        )
    
    def _find_nearest_entity(
        self,
        text: str,
        node: ASTNode,
        direction: str = 'forward'
    ) -> Optional[str]:
        """Find nearest referenced entity (chapter, concept, term)."""
        # Look for chapter references (most common)
        chapter_match = re.search(r'Chapter\s+(\d+)', text, re.IGNORECASE)
        if chapter_match:
            return f"CH-{int(chapter_match.group(1)):02d}"
        
        # Look for term references (bold text)
        term_match = re.search(r'\*\*([^*]+)\*\*', text)
        if term_match:
            term_name = term_match.group(1).strip()
            # Try to normalize and find in symbol table
            if self.symbols:
                # Look up term in symbol table
                term_id = self._normalize_id(term_name)
                return term_id
            return self._normalize_id(term_name)
        
        # Look for code references
        code_match = re.search(r'`([^`]+)`', text)
        if code_match:
            code_ref = code_match.group(1).strip()
            return self._normalize_id(code_ref)
        
        # If no explicit reference found and direction is backward, try to get current node's ID
        if direction == 'backward':
            # For backward, we might want the current chapter/section
            chapter = node.find_chapter()
            if chapter:
                code = chapter.meta.get("code", "")
                if code:
                    return code
            # Fallback: use node's own code if available
            if node.meta.get("code"):
                return node.meta.get("code")
        
        return None
    
    def _extract_from_code(self, ast: ASTDocument, namespace: str) -> List[SemanticRelation]:
        """Extract dependencies from code blocks."""
        relations: List[SemanticRelation] = []
        
        for node in ast.nodes:
            if node.type == "code":
                code = node.text
                language = node.meta.get("language", "").lower()
                
                if language == "rego":
                    # Extract import statements
                    imports = re.findall(r'import\s+(\S+)', code)
                    for imp in imports:
                        source_id = self._get_block_id(node)
                        target_id = self._normalize_id(imp)
                        
                        relations.append(SemanticRelation(
                            relation_type="requires",
                            source_id=source_id,
                            target_id=target_id,
                            confidence=1.0,
                            evidence=f"import {imp}",
                            context=code[:200],
                            line_no=node.line_no,
                            from_namespace=namespace,
                            to_namespace=namespace
                        ))
                    
                    # Extract function calls (built-ins)
                    builtin_calls = re.findall(r'\b(count|sum|max|min|all|any|contains)\s*\(', code)
                    for builtin in builtin_calls:
                        source_id = self._normalize_id(builtin)
                        target_id = self._get_block_id(node)
                        
                        relations.append(SemanticRelation(
                            relation_type="used_by",
                            source_id=source_id,
                            target_id=target_id,
                            confidence=0.9,
                            evidence=f"{builtin}(...)",
                            context=code[:200],
                            line_no=node.line_no,
                            from_namespace=namespace,
                            to_namespace=namespace
                        ))
        
        return relations
    
    def _extract_from_concepts(
        self,
        blocks: List[Any],
        namespace: str
    ) -> List[SemanticRelation]:
        """Extract relations from concept definitions."""
        relations: List[SemanticRelation] = []
        
        concept_blocks = [b for b in blocks if hasattr(b, 'block_type') and b.block_type == 'concept']
        
        for concept in concept_blocks:
            definition = getattr(concept, 'body', '') or concept.meta.get('definition', '')
            
            # Check if definition references other concepts
            for other in concept_blocks:
                if getattr(other, 'id', '') == getattr(concept, 'id', ''):
                    continue
                
                other_title = other.meta.get('title', '') or getattr(other, 'meta', {}).get('title', '')
                if other_title and other_title.lower() in definition.lower():
                    relations.append(SemanticRelation(
                        relation_type="related_to",
                        source_id=getattr(concept, 'id', ''),
                        target_id=getattr(other, 'id', ''),
                        confidence=0.7,
                        evidence=definition[:100],
                        context=definition[:200],
                        line_no=0,
                        from_namespace=namespace,
                        to_namespace=namespace
                    ))
        
        return relations
    
    def _extract_from_structure(self, ast: ASTDocument, namespace: str) -> List[SemanticRelation]:
        """Extract relations from structural hints (chapter order, hierarchy)."""
        relations: List[SemanticRelation] = []
        
        chapters = ast.get_all_chapters()
        
        # Sequential chapters might have "extends" or "builds on" relationship
        for i in range(len(chapters) - 1):
            current = chapters[i]
            next_ch = chapters[i + 1]
            
            current_code = current.meta.get("code", "")
            next_code = next_ch.meta.get("code", "")
            
            if current_code and next_code:
                # Lower confidence for structural relations
                relations.append(SemanticRelation(
                    relation_type="extends",
                    source_id=next_code,
                    target_id=current_code,
                    confidence=0.5,  # Low confidence - structural hint only
                    evidence="Sequential chapters",
                    context=f"{current.meta.get('title', '')} → {next_ch.meta.get('title', '')}",
                    line_no=current.line_no,
                    from_namespace=namespace,
                    to_namespace=namespace
                ))
        
        return relations
    
    def _deduplicate_relations(self, relations: List[SemanticRelation]) -> List[SemanticRelation]:
        """Remove duplicate relations, keeping highest confidence."""
        seen: Dict[tuple, SemanticRelation] = {}
        
        for rel in relations:
            key = (rel.source_id, rel.target_id, rel.relation_type)
            if key not in seen or rel.confidence > seen[key].confidence:
                seen[key] = rel
        
        return list(seen.values())
    
    def _normalize_id(self, text: str) -> str:
        """Normalize text to ID format."""
        # Remove markdown formatting
        text = re.sub(r'\*\*([^*]+)\*\*', r'\1', text)  # Bold
        text = re.sub(r'`([^`]+)`', r'\1', text)  # Code
        text = re.sub(r'[^\w\s-]', '', text)  # Remove special chars
        text = re.sub(r'\s+', '-', text.strip())  # Replace spaces with hyphens
        return text.lower()
    
    def _get_block_id(self, node: ASTNode) -> str:
        """Get block ID for a node."""
        # Try to get from metadata
        if "id" in node.meta:
            return node.meta["id"]
        
        # Try to get chapter code
        chapter = node.find_chapter()
        if chapter:
            code = chapter.meta.get("code", "")
            if code:
                return code
        
        # Generate from text
        text = node.text[:50].strip()
        return self._normalize_id(text)

