"""
Antipattern Extractor (Solution 4)

Extracts antipattern blocks from content using pattern matching.
Detects bad practices, common mistakes, and problematic approaches.

This is Solution 4 from the engineering solutions document.
"""
from __future__ import annotations

import re
from typing import List, Optional, Dict, Any
from dataclasses import dataclass

from .ast_nodes import ASTDocument, ASTNode, SSMBlock

# Import runtime components (optional)
try:
    from runtime.error_bus import ErrorBus
    from runtime.symbol_table import SymbolTable
except ImportError:
    ErrorBus = None  # type: ignore
    SymbolTable = None  # type: ignore


@dataclass
class AntipatternEntry:
    """Extracted antipattern entry."""
    problem: str  # Description of the problematic pattern
    solution: Optional[str] = None  # Recommended alternative
    rationale: Optional[str] = None  # Why it's bad
    severity: str = "medium"  # high, medium, low
    line_no: int = 0
    chapter_code: Optional[str] = None


class AntipatternExtractor:
    """
    Extract antipattern blocks from content.
    
    Detects:
    - Bad practices
    - Common mistakes
    - Problematic approaches
    - Anti-patterns with solutions
    """
    
    # Antipattern indicators with confidence scores
    ANTIPATTERN_INDICATORS = [
        (r'\b(?:anti[- ]?pattern|bad\s+practice|common\s+mistake)\b', 0.9),
        (r'\b(?:avoid|don\'t|never|must\s+not)\b.*\b(?:doing|using)\b', 0.85),
        (r'\b(?:incorrect|wrong|problematic|dangerous)\b.*\b(?:approach|way|method)\b', 0.8),
        (r'❌', 0.9),  # Cross mark emoji
        (r'\b(?:pitfall|gotcha|trap)\b', 0.85),
        (r'\b(?:should\s+not|shouldn\'t|must\s+not|mustn\'t)\b', 0.75),
        (r'\b(?:incorrectly|wrongly|improperly)\b', 0.7),
    ]
    
    def __init__(
        self,
        errors: Optional["ErrorBus"] = None,
        symbols: Optional["SymbolTable"] = None
    ):
        """
        Initialize antipattern extractor.
        
        Args:
            errors: ErrorBus instance for diagnostics (optional)
            symbols: SymbolTable instance for symbol tracking (optional)
        """
        self.errors = errors
        self.symbols = symbols
    
    def extract(self, ast: ASTDocument) -> List[AntipatternEntry]:
        """
        Find antipatterns in content.
        
        Args:
            ast: AST document
            
        Returns:
            List of AntipatternEntry objects
        """
        antipatterns: List[AntipatternEntry] = []
        
        for node in ast.nodes:
            if node.type in ["paragraph", "list_item", "section"]:
                if self._is_antipattern(node):
                    antipattern = self._extract_antipattern(node)
                    if antipattern:
                        antipatterns.append(antipattern)
        
        return antipatterns
    
    def _is_antipattern(self, node: ASTNode) -> bool:
        """Check if node describes an antipattern."""
        text = node.text.lower()
        
        for pattern, confidence in self.ANTIPATTERN_INDICATORS:
            if re.search(pattern, text, re.IGNORECASE):
                return True
        
        return False
    
    def _extract_antipattern(self, node: ASTNode) -> Optional[AntipatternEntry]:
        """Extract antipattern details."""
        text = node.text
        
        # Try to identify the problematic pattern
        problem = self._extract_problem(text)
        
        # Try to find the better alternative
        solution = self._extract_solution(node)
        
        # Extract why it's bad
        rationale = self._extract_rationale(text)
        
        # Assess severity
        severity = self._assess_severity(text)
        
        # Get chapter code
        chapter = node.find_chapter()
        chapter_code = chapter.meta.get("code", "") if chapter else None
        
        return AntipatternEntry(
            problem=problem,
            solution=solution,
            rationale=rationale,
            severity=severity,
            line_no=node.line_no,
            chapter_code=chapter_code
        )
    
    def _extract_problem(self, text: str) -> str:
        """Extract the problematic pattern description."""
        # Look for patterns like "Don't do X" or "Avoid X"
        match = re.search(
            r'(?:don\'t|avoid|never|must\s+not|should\s+not).*?([^✅❌]+?)(?:\n|✅|❌|$)',
            text,
            re.IGNORECASE | re.DOTALL
        )
        
        if match:
            problem = match.group(1).strip()
            # Remove solution markers if present
            problem = re.sub(r'\s*✅.*$', '', problem, flags=re.DOTALL)
            if len(problem) > 20:
                return problem
        
        # Look for "X is wrong/incorrect/problematic"
        match = re.search(
            r'([^✅❌]+?)\s+(?:is|are)\s+(?:wrong|incorrect|problematic|dangerous|bad)',
            text,
            re.IGNORECASE
        )
        
        if match:
            problem = match.group(1).strip()
            if len(problem) > 20:
                return problem
        
        # Look for ❌ WRONG pattern
        match = re.search(r'❌\s*(?:WRONG|INCORRECT)?\s*([^✅]+?)(?=✅|$)', text, re.IGNORECASE | re.DOTALL)
        if match:
            problem = match.group(1).strip()
            if len(problem) > 20:
                return problem
        
        # Fallback: use first paragraph (up to first solution marker)
        problem = re.split(r'✅|❌|Solution:|Correct:', text, maxsplit=1)[0].strip()
        sentences = re.split(r'[.!?]\s+', problem)
        if sentences and len(sentences[0]) > 20:
            return sentences[0].strip()
        
        # Last resort: first 200 chars
        return text[:200].strip()
    
    def _extract_solution(self, node: ASTNode) -> Optional[str]:
        """Find the recommended alternative."""
        text = node.text
        
        # Look for ✅ CORRECT pattern
        match = re.search(r'✅\s*(?:CORRECT|RIGHT)?\s*(.+?)(?=\n\n|\n❌|$)', text, re.IGNORECASE | re.DOTALL)
        if match:
            solution = match.group(1).strip()
            if len(solution) > 10:
                return solution
        
        # Look for "Solution:" or "Correct:" markers
        match = re.search(r'(?:Solution|Correct):\s*(.+?)(?=\n\n|$)', text, re.IGNORECASE | re.DOTALL)
        if match:
            solution = match.group(1).strip()
            if len(solution) > 10:
                return solution
        
        # Look for "instead" or "better" patterns
        match = re.search(
            r'(?:instead|better\s+to|should|use|prefer).+?([^✅❌]+?)(?=\n\n|$)',
            text,
            re.IGNORECASE | re.DOTALL
        )
        
        if match:
            solution = match.group(1).strip()
            if len(solution) > 10:
                return solution
        
        # Look in next sibling nodes (keep problem/solution together)
        parent = node.parent
        if parent:
            try:
                node_idx = parent.children.index(node)
                # Check next few siblings
                for i in range(node_idx + 1, min(node_idx + 4, len(parent.children))):
                    sibling = parent.children[i]
                    if sibling.type in ["paragraph", "code", "list_item"]:
                        curr_text = sibling.text.lower()
                        if any(word in curr_text for word in ['correct', 'better', 'instead', '✅', 'should', 'use', 'solution']):
                            solution = sibling.text.strip()
                            if len(solution) > 10:
                                return solution
            except (ValueError, IndexError):
                pass
        
        return None
    
    def _extract_rationale(self, text: str) -> Optional[str]:
        """Extract why it's bad."""
        # Look for "because", "since", "reason"
        match = re.search(
            r'(?:because|since|reason|why).*?([^.]+)',
            text,
            re.IGNORECASE
        )
        
        if match:
            return match.group(1).strip()
        
        return None
    
    def _assess_severity(self, text: str) -> str:
        """Assess severity of the antipattern."""
        text_lower = text.lower()
        
        # High severity indicators (security, data corruption, panics)
        high_severity_keywords = [
            'dangerous', 'security', 'vulnerability', 'data loss', 'corruption',
            'panic', 'data breach', 'unsafe', 'admin', 'privilege', 'injection',
            'xss', 'sql injection', 'race condition', 'deadlock', 'memory leak',
            'crash', 'exploit', 'unauthorized', 'bypass', 'expose'
        ]
        if any(word in text_lower for word in high_severity_keywords):
            return "high"
        
        # Medium severity indicators (correctness, performance)
        medium_severity_keywords = [
            'incorrect', 'wrong', 'problematic', 'bad practice', 'performance',
            'slow', 'inefficient', 'bug', 'error', 'fails', 'broken'
        ]
        if any(word in text_lower for word in medium_severity_keywords):
            return "medium"
        
        # Default to low (style, minor issues)
        return "low"


def extract_antipatterns_from_ast(
    doc: ASTDocument,
    errors: Optional["ErrorBus"] = None,
    symbols: Optional["SymbolTable"] = None
) -> List[AntipatternEntry]:
    """
    Extract antipatterns using AST-based extraction.
    
    Args:
        doc: AST document
        errors: ErrorBus instance (optional)
        symbols: SymbolTable instance (optional)
    
    Returns:
        List of AntipatternEntry objects
    """
    extractor = AntipatternExtractor(errors=errors, symbols=symbols)
    return extractor.extract(doc)

