"""
Enhanced Code Extractor with Semantic Splitting

Splits code blocks into semantic segments (concept, pattern, example).
This is the solution for Issue 10.
"""
from __future__ import annotations

import re
from typing import List, Optional
from dataclasses import dataclass

from .extractor_code import CodeEntry, CodeClassification


@dataclass
class CodeSegment:
    """Represents a semantic segment of code"""
    segment_type: str  # 'concept', 'pattern', 'example'
    content: str
    explanation: str
    confidence: float


class SemanticCodeSplitter:
    """Split code blocks into semantic segments"""

    def split_code_block(self, code: str, language: str) -> List[CodeSegment]:
        """Analyze code and split into semantic segments"""
        segments = []

        # Detect if code has inline comments explaining concepts
        if self._has_inline_explanations(code):
            segments.extend(self._split_with_comments(code, language))
        else:
            # Single purpose code block
            purpose = self._detect_code_purpose(code, language)
            segment = CodeSegment(
                segment_type=purpose,
                content=code,
                explanation=self._generate_explanation(code, language, purpose),
                confidence=0.8
            )
            segments.append(segment)

        return segments

    def _has_inline_explanations(self, code: str) -> bool:
        """Check if code has inline comments that explain concepts"""
        # Count meaningful comments (not just "//", "#")
        comment_pattern = r'(?:#|//|/\*)\s*([a-zA-Z].{10,})'
        comments = re.findall(comment_pattern, code)
        return len(comments) >= 2

    def _split_with_comments(self, code: str, language: str) -> List[CodeSegment]:
        """Split code based on inline comments"""
        segments = []
        lines = code.split('\n')

        current_segment = []
        current_explanation = None

        for line in lines:
            # Check if line is a comment
            comment_match = re.match(r'^\s*(?:#|//)\s*(.+)$', line)

            if comment_match:
                # Save previous segment if exists
                if current_segment:
                    segment_code = '\n'.join(current_segment)
                    segment_type = self._detect_code_purpose(segment_code, language)

                    segments.append(CodeSegment(
                        segment_type=segment_type,
                        content=segment_code,
                        explanation=current_explanation or comment_match.group(1),
                        confidence=0.9
                    ))

                    current_segment = []

                # Start new segment with this explanation
                current_explanation = comment_match.group(1).strip()
            else:
                current_segment.append(line)

        # Add final segment
        if current_segment:
            segment_code = '\n'.join(current_segment)
            segments.append(CodeSegment(
                segment_type=self._detect_code_purpose(segment_code, language),
                content=segment_code,
                explanation=current_explanation or "",
                confidence=0.9
            ))

        return segments

    def _detect_code_purpose(self, code: str, language: str) -> str:
        """Detect if code is concept, pattern, or example"""

        # Check for API usage patterns
        if self._is_api_pattern(code, language):
            return 'pattern'

        # Check for teaching/example indicators
        if self._is_example_code(code):
            return 'example'

        # Check for concept definition
        if self._is_concept_definition(code):
            return 'concept'

        # Default to example
        return 'example'

    def _is_api_pattern(self, code: str, language: str) -> bool:
        """Check if code demonstrates API usage pattern"""
        indicators = {
            'rego': ['import', 'data.', 'input.'],
            'python': ['import', 'from', 'class ', 'def '],
            'typescript': ['import', 'export', 'interface', 'type '],
            'sql': ['SELECT', 'JOIN', 'WHERE']
        }

        lang_indicators = indicators.get(language.lower(), [])
        return any(ind in code for ind in lang_indicators)

    def _is_example_code(self, code: str) -> bool:
        """Check if code is a teaching example"""
        # Examples often have:
        # - Simple variable names (x, y, foo, bar)
        # - Print/log statements
        # - Comments

        has_simple_vars = bool(re.search(r'\b(x|y|foo|bar|test|example)\b', code, re.IGNORECASE))
        has_print = bool(re.search(r'\b(print|console\.log|fmt\.Print)', code, re.IGNORECASE))
        has_comments = bool(re.search(r'(?:#|//|/\*)', code))

        return has_simple_vars or has_print or has_comments

    def _is_concept_definition(self, code: str) -> bool:
        """Check if code defines a concept"""
        # Concept definitions often have:
        # - Type definitions
        # - Interface definitions
        # - Class definitions
        # - Package/namespace definitions

        concept_patterns = [
            r'\b(?:type|interface|class|package|namespace)\s+\w+',
            r'\b(?:def|function|func)\s+\w+\s*\([^)]*\)\s*:',
        ]

        return any(re.search(pattern, code, re.IGNORECASE) for pattern in concept_patterns)

    def _generate_explanation(self, code: str, language: str, purpose: str) -> str:
        """Generate explanation for code segment"""
        if purpose == 'pattern':
            return f"Demonstrates {language} API usage pattern"
        elif purpose == 'concept':
            return f"Defines {language} concept"
        else:
            return f"Example {language} code"


def split_code_into_segments(code_entry: CodeEntry) -> List[CodeSegment]:
    """Split a code entry into semantic segments"""
    splitter = SemanticCodeSplitter()
    return splitter.split_code_block(code_entry.code, code_entry.lang)

