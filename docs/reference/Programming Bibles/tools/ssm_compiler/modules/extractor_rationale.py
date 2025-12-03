"""
Rationale Extractor (Solution 4)

Extracts rationale/reasoning blocks that explain why something is done
or why a decision was made.

This is Solution 4 from the engineering solutions document.
"""
from __future__ import annotations

import re
from typing import List, Optional
from dataclasses import dataclass

from .ast_nodes import ASTDocument, ASTNode

# Import runtime components (optional)
try:
    from runtime.error_bus import ErrorBus
    from runtime.symbol_table import SymbolTable
except ImportError:
    ErrorBus = None  # type: ignore
    SymbolTable = None  # type: ignore


@dataclass
class RationaleEntry:
    """Extracted rationale entry."""
    explanation: str  # The rationale/reasoning
    related_to: Optional[str] = None  # What this rationale explains
    line_no: int = 0
    chapter_code: Optional[str] = None


class RationaleExtractor:
    """
    Extract rationale/reasoning blocks.
    
    Detects:
    - "Because X" explanations
    - "This allows Y" reasoning
    - "In order to Z" purpose statements
    - Benefit/advantage explanations
    """
    
    # Rationale indicators
    RATIONALE_INDICATORS = [
        (r'\b(?:because|since|reason|why)\b', 0.9),
        (r'\b(?:this\s+(?:allows|enables|ensures|prevents))\b', 0.85),
        (r'\b(?:benefit|advantage|purpose)\b', 0.8),
        (r'\b(?:in\s+order\s+to|so\s+that)\b', 0.85),
        (r'\b(?:rationale|reasoning|justification)\b', 0.9),
        (r'\b(?:allows\s+us|enables\s+us|helps\s+us)\b', 0.75),
    ]
    
    def __init__(
        self,
        errors: Optional["ErrorBus"] = None,
        symbols: Optional["SymbolTable"] = None
    ):
        """
        Initialize rationale extractor.
        
        Args:
            errors: ErrorBus instance for diagnostics (optional)
            symbols: SymbolTable instance for symbol tracking (optional)
        """
        self.errors = errors
        self.symbols = symbols
    
    def extract(self, ast: ASTDocument) -> List[RationaleEntry]:
        """
        Find rationale explanations.
        
        Args:
            ast: AST document
            
        Returns:
            List of RationaleEntry objects
        """
        rationales: List[RationaleEntry] = []
        
        for node in ast.nodes:
            if node.type in ["paragraph", "list_item"]:
                if self._is_rationale(node):
                    rationale = self._extract_rationale(node)
                    if rationale:
                        rationales.append(rationale)
        
        return rationales
    
    def _is_rationale(self, node: ASTNode) -> bool:
        """Check if node explains reasoning."""
        text = node.text.lower()
        
        for pattern, confidence in self.RATIONALE_INDICATORS:
            if re.search(pattern, text):
                return True
        
        return False
    
    def _extract_rationale(self, node: ASTNode) -> Optional[RationaleEntry]:
        """Extract rationale details."""
        text = node.text.strip()
        
        # Extract the explanation
        explanation = self._extract_explanation(text)
        
        # Try to find what this rationale relates to (previous node)
        related_to = self._find_related_concept(node)
        
        # Get chapter code
        chapter = node.find_chapter()
        chapter_code = chapter.meta.get("code", "") if chapter else None
        
        return RationaleEntry(
            explanation=explanation,
            related_to=related_to,
            line_no=node.line_no,
            chapter_code=chapter_code
        )
    
    def _extract_explanation(self, text: str) -> str:
        """Extract the rationale explanation."""
        # Look for "because X" or "since X"
        match = re.search(
            r'(?:because|since|reason|why)\s+(.+?)(?:\.|$)',
            text,
            re.IGNORECASE | re.DOTALL
        )
        
        if match:
            return match.group(1).strip()
        
        # Look for "this allows/enables X"
        match = re.search(
            r'this\s+(?:allows|enables|ensures|prevents)\s+(.+?)(?:\.|$)',
            text,
            re.IGNORECASE | re.DOTALL
        )
        
        if match:
            return match.group(1).strip()
        
        # Fallback: use full text
        return text
    
    def _find_related_concept(self, node: ASTNode) -> Optional[str]:
        """Find what concept this rationale relates to."""
        # Check previous sibling
        parent = node.parent
        if parent:
            try:
                node_idx = parent.children.index(node)
                if node_idx > 0:
                    prev_sibling = parent.children[node_idx - 1]
                    # Try to extract concept from previous node
                    if prev_sibling.type == "paragraph":
                        # Look for bold text (term/concept)
                        match = re.search(r'\*\*([^*]+)\*\*', prev_sibling.text)
                        if match:
                            return match.group(1).strip()
            except (ValueError, IndexError):
                pass
        
        return None

