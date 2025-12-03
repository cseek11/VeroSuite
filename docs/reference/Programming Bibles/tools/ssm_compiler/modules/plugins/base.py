"""
Language Plugin Base Interface

Defines the Protocol for language-specific pattern extractors.
"""
from __future__ import annotations

from typing import Protocol, List, Dict, Any
from dataclasses import dataclass


@dataclass
class CodePattern:
    """Code pattern extracted from code."""
    pattern_type: str  # "quantifier", "aggregation", "rule_head", "comprehension", etc.
    pattern_subtype: str  # More specific classification
    code_snippet: str
    line_no: int = 0
    metadata: Dict[str, Any] = None  # Additional metadata


class LanguagePlugin(Protocol):
    """Protocol for language-specific pattern extractors."""
    
    name: str
    aliases: List[str]
    
    def detect(self, code: str) -> bool:
        """
        Detect if code is in this language.
        
        Args:
            code: Code text to analyze
        
        Returns:
            True if code appears to be in this language
        """
        ...
    
    def classify_patterns(self, code: str) -> List[CodePattern]:
        """
        Extract patterns from code.
        
        Args:
            code: Code text to analyze
        
        Returns:
            List of CodePattern objects
        """
        ...

