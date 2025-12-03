"""
Contrast Extractor (Solution 4)

Extracts contrast/comparison blocks that compare different approaches,
methods, or concepts.

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
class ContrastEntry:
    """Extracted contrast/comparison entry."""
    concept_a: str  # First concept being compared
    concept_b: str  # Second concept being compared
    differences: str  # Key differences
    line_no: int = 0
    chapter_code: Optional[str] = None


class ContrastExtractor:
    """
    Extract contrast/comparison blocks.
    
    Detects:
    - "X vs Y" comparisons
    - "Unlike X, Y does Z" contrasts
    - "X differs from Y" comparisons
    - Side-by-side comparisons
    """
    
    # Contrast indicators
    CONTRAST_INDICATORS = [
        (r'\b(?:vs\.?|versus|compared\s+to|compared\s+with)\b', 0.9),
        (r'\b(?:unlike|different\s+from|differs\s+from)\b', 0.85),
        (r'\b(?:in\s+contrast|on\s+the\s+other\s+hand|however)\b', 0.8),
        (r'\b(?:whereas|while|although)\b', 0.75),
        (r'\b(?:side\s+by\s+side|comparison|compare)\b', 0.8),
    ]
    
    def __init__(
        self,
        errors: Optional["ErrorBus"] = None,
        symbols: Optional["SymbolTable"] = None
    ):
        """
        Initialize contrast extractor.
        
        Args:
            errors: ErrorBus instance for diagnostics (optional)
            symbols: SymbolTable instance for symbol tracking (optional)
        """
        self.errors = errors
        self.symbols = symbols
    
    def extract(self, ast: ASTDocument) -> List[ContrastEntry]:
        """
        Find contrast/comparison blocks.
        
        Args:
            ast: AST document
            
        Returns:
            List of ContrastEntry objects
        """
        contrasts: List[ContrastEntry] = []
        
        for node in ast.nodes:
            if node.type in ["paragraph", "section"]:
                if self._is_contrast(node):
                    contrast = self._extract_contrast(node)
                    if contrast:
                        contrasts.append(contrast)
        
        return contrasts
    
    def _is_contrast(self, node: ASTNode) -> bool:
        """Check if node describes a contrast/comparison."""
        text = node.text.lower()
        
        for pattern, confidence in self.CONTRAST_INDICATORS:
            if re.search(pattern, text):
                return True
        
        return False
    
    def _extract_contrast(self, node: ASTNode) -> Optional[ContrastEntry]:
        """Extract contrast details."""
        text = node.text
        
        # Extract concepts being compared
        concept_a, concept_b = self._extract_concepts(text)
        
        if not concept_a or not concept_b:
            return None
        
        # Extract differences
        differences = self._extract_differences(text, concept_a, concept_b)
        
        # Get chapter code
        chapter = node.find_chapter()
        chapter_code = chapter.meta.get("code", "") if chapter else None
        
        return ContrastEntry(
            concept_a=concept_a,
            concept_b=concept_b,
            differences=differences,
            line_no=node.line_no,
            chapter_code=chapter_code
        )
    
    def _extract_concepts(self, text: str) -> tuple[Optional[str], Optional[str]]:
        """Extract the two concepts being compared."""
        # Pattern: "X vs Y" or "X versus Y"
        match = re.search(
            r'([A-Z][^,\.]+?)\s+(?:vs\.?|versus)\s+([A-Z][^,\.]+?)(?:\.|,|$)',
            text,
            re.IGNORECASE
        )
        
        if match:
            return match.group(1).strip(), match.group(2).strip()
        
        # Pattern: "Unlike X, Y does Z"
        match = re.search(
            r'unlike\s+([^,\.]+?),\s+([^,\.]+?)\s+(?:does|is|has)',
            text,
            re.IGNORECASE
        )
        
        if match:
            return match.group(1).strip(), match.group(2).strip()
        
        # Pattern: "X differs from Y"
        match = re.search(
            r'([^,\.]+?)\s+(?:differs|different)\s+from\s+([^,\.]+?)(?:\.|,|$)',
            text,
            re.IGNORECASE
        )
        
        if match:
            return match.group(1).strip(), match.group(2).strip()
        
        # Pattern: "X, while Y" or "X, whereas Y"
        match = re.search(
            r'([^,\.]+?),\s+(?:while|whereas)\s+([^,\.]+?)(?:\.|,|$)',
            text,
            re.IGNORECASE
        )
        
        if match:
            return match.group(1).strip(), match.group(2).strip()
        
        return None, None
    
    def _extract_differences(self, text: str, concept_a: str, concept_b: str) -> str:
        """Extract key differences between concepts."""
        # Look for explicit difference markers
        differences = []
        
        # Escape regex special characters in concept names
        escaped_a = re.escape(concept_a)
        escaped_b = re.escape(concept_b)
        
        # Pattern: "X does A, while Y does B"
        match = re.search(
            rf'{escaped_a}.*?(?:does|is|has)\s+([^,\.]+?)(?:,|while|whereas).*?{escaped_b}.*?(?:does|is|has)\s+([^,\.]+?)(?:\.|$)',
            text,
            re.IGNORECASE
        )
        
        if match:
            differences.append(f"{concept_a}: {match.group(1).strip()}")
            differences.append(f"{concept_b}: {match.group(2).strip()}")
        
        # Fallback: use the contrast sentence itself
        if not differences:
            # Extract sentence containing the contrast
            sentences = re.split(r'[.!?]\s+', text)
            for sentence in sentences:
                if any(word in sentence.lower() for word in ['vs', 'versus', 'unlike', 'different', 'whereas', 'while']):
                    differences.append(sentence.strip())
                    break
        
        return " ".join(differences) if differences else text[:200].strip()

