"""
Smart Summary Generator

Generates meaningful summaries using content-aware heuristics.
This is Tier 1 of Issue 3 solution.
"""
from __future__ import annotations

import re
from typing import Optional

# Constants for summary generation
MIN_TEXT_LENGTH = 5
MIN_WORD_COUNT = 3
MIN_WORD_COUNT_VALID = 2
MIN_SENTENCE_LENGTH = 10
MAX_SUMMARY_LENGTH = 150
TRUNCATE_LENGTH = 100
MIN_TRUNCATE_POSITION = 50
POSITION_BONUS_MULTIPLIER = 0.5
KEYWORD_BONUS = 2
LENGTH_BONUS_MIN = 5
LENGTH_BONUS_MAX = 20
LENGTH_BONUS_VALUE = 1

# Pre-compiled regex patterns for performance
# Patterns that indicate important content
COMPILED_IMPORTANT_PATTERNS = [
    re.compile(r'^(?:A|An|The)\s+\w+\s+(?:is|are|allows|enables|provides)', re.IGNORECASE),  # Definitions
    re.compile(r'^\w+\s+(?:is|are)\s+(?:a|an|the)', re.IGNORECASE),  # Identity statements
    re.compile(r'(?:allows?|enables?|provides?|supports?)', re.IGNORECASE),  # Capability statements
    re.compile(r'(?:used\s+(?:to|for)|purpose\s+is)', re.IGNORECASE),  # Purpose statements
]

# Patterns to skip (not good summaries)
COMPILED_SKIP_PATTERNS = [
    re.compile(r'^(?:Here|This|These|For\s+example)', re.IGNORECASE),  # Meta-text
    re.compile(r'^(?:Note|Warning|Important):', re.IGNORECASE),  # Annotations
    re.compile(r'^\d+$'),  # Just numbers
    re.compile(r'^[A-Z]\.$'),  # Just letters
]

# Regex patterns for text normalization
LIST_MARKER_ORDERED_RE = re.compile(r'^[\d]+\.\s+', re.MULTILINE)
LIST_MARKER_UNORDERED_RE = re.compile(r'^[-*+]\s+', re.MULTILINE)
WHITESPACE_NORMALIZE_RE = re.compile(r'\s+')
BOLD_MARKDOWN_RE = re.compile(r'\*\*([^*]+)\*\*')
CODE_MARKDOWN_RE = re.compile(r'`([^`]+)`')
SENTENCE_SPLIT_RE = re.compile(r'(?<!\b[A-Z])(?<!e\.g)(?<!i\.e)\.\s+')
NUMBERS_ONLY_RE = re.compile(r'^[\d\s]+$')


class SmartSummaryGenerator:
    """Generate meaningful summaries using content-aware heuristics"""

    def generate(self, text: str, context: Optional[dict] = None) -> str:
        """Generate summary from text with context awareness"""

        # Clean and normalize text
        text = self._normalize_text(text)

        if not text or len(text) < MIN_TEXT_LENGTH:
            return text

        # Try multiple strategies in order of preference
        strategies = [
            self._extract_definition_statement,
            self._extract_capability_statement,
            self._extract_first_meaningful_sentence,
            self._extract_keyword_based,
        ]

        for strategy in strategies:
            summary = strategy(text, context)
            if summary and self._is_valid_summary(summary):
                return self._finalize_summary(summary)

        # Fallback: smart truncation
        return self._smart_truncate(text)

    def _normalize_text(self, text: str) -> str:
        """Clean and normalize text"""
        # Remove list markers (using pre-compiled patterns)
        text = LIST_MARKER_ORDERED_RE.sub('', text)
        text = LIST_MARKER_UNORDERED_RE.sub('', text)

        # Remove extra whitespace
        text = WHITESPACE_NORMALIZE_RE.sub(' ', text)

        # Remove markdown formatting for analysis
        text = BOLD_MARKDOWN_RE.sub(r'\1', text)  # Bold
        text = CODE_MARKDOWN_RE.sub(r'\1', text)  # Code

        return text.strip()

    def _extract_definition_statement(self, text: str, context: Optional[dict]) -> Optional[str]:
        """Extract 'X is a Y' or 'X allows/enables/provides' patterns"""

        # Match definition patterns (first two are definitions)
        for pattern in COMPILED_IMPORTANT_PATTERNS[:2]:
            match = pattern.search(text)
            if match:
                # Extract the full sentence containing this pattern
                sentence = self._extract_sentence_containing(text, match.start())
                if sentence:
                    return sentence

        return None

    def _extract_capability_statement(self, text: str, context: Optional[dict]) -> Optional[str]:
        """Extract capability/purpose statements"""

        for pattern in COMPILED_IMPORTANT_PATTERNS[2:]:  # Capability patterns
            match = pattern.search(text)
            if match:
                sentence = self._extract_sentence_containing(text, match.start())
                if sentence:
                    return sentence

        return None

    def _extract_first_meaningful_sentence(self, text: str, context: Optional[dict]) -> Optional[str]:
        """Extract first sentence that isn't meta-text"""

        sentences = self._split_sentences(text)

        for sentence in sentences:
            # Skip sentences matching skip patterns (using pre-compiled patterns)
            if any(pat.match(sentence) for pat in COMPILED_SKIP_PATTERNS):
                continue

            # Check minimum quality
            if len(sentence.split()) >= MIN_WORD_COUNT:
                return sentence

        return None

    def _extract_keyword_based(self, text: str, context: Optional[dict]) -> Optional[str]:
        """Extract based on keyword density and position"""

        sentences = self._split_sentences(text)

        # Keywords that indicate important content
        keywords = ['allows', 'enables', 'provides', 'supports', 'defines',
                   'implements', 'represents', 'contains', 'includes']

        best_score = 0
        best_sentence = None

        for i, sentence in enumerate(sentences):
            score = 0

            # Position bonus (earlier is better)
            score += (len(sentences) - i) * POSITION_BONUS_MULTIPLIER

            # Keyword bonus
            for keyword in keywords:
                if keyword in sentence.lower():
                    score += KEYWORD_BONUS

            # Length bonus (prefer medium length)
            word_count = len(sentence.split())
            if LENGTH_BONUS_MIN <= word_count <= LENGTH_BONUS_MAX:
                score += LENGTH_BONUS_VALUE

            if score > best_score:
                best_score = score
                best_sentence = sentence

        return best_sentence

    def _split_sentences(self, text: str) -> list:
        """Split text into sentences intelligently"""
        # Split on sentence boundaries, but not abbreviations (using pre-compiled pattern)
        sentences = SENTENCE_SPLIT_RE.split(text)
        return [s.strip() for s in sentences if s.strip()]

    def _extract_sentence_containing(self, text: str, pos: int) -> Optional[str]:
        """Extract the sentence containing position pos"""
        # Find sentence boundaries around pos
        start = text.rfind('. ', 0, pos)
        start = start + 2 if start != -1 else 0

        end = text.find('. ', pos)
        end = end + 1 if end != -1 else len(text)

        sentence = text[start:end].strip()
        return sentence if len(sentence) > MIN_SENTENCE_LENGTH else None

    def _is_valid_summary(self, summary: str) -> bool:
        """Check if summary is valid (not just numbers, letters, etc.)"""
        if not summary or len(summary) < MIN_TEXT_LENGTH:
            return False

        # Check against skip patterns (using pre-compiled patterns)
        for pattern in COMPILED_SKIP_PATTERNS:
            if pattern.match(summary):
                return False

        # Must have at least 2 words
        if len(summary.split()) < MIN_WORD_COUNT_VALID:
            return False

        # Must not be all numbers (using pre-compiled pattern)
        if NUMBERS_ONLY_RE.match(summary):
            return False

        return True

    def _finalize_summary(self, summary: str) -> str:
        """Finalize and format summary"""
        # Ensure it ends with period
        if not summary.endswith('.'):
            summary += '.'

        # Capitalize first letter
        if summary:
            summary = summary[0].upper() + summary[1:]

        # Truncate if too long
        if len(summary) > MAX_SUMMARY_LENGTH:
            summary = summary[:MAX_SUMMARY_LENGTH - 3] + '...'

        return summary

    def _smart_truncate(self, text: str) -> str:
        """Intelligently truncate text to create summary"""
        # Try to break at word boundary near TRUNCATE_LENGTH chars
        if len(text) <= TRUNCATE_LENGTH:
            return text

        truncate_pos = TRUNCATE_LENGTH

        # Find last space before TRUNCATE_LENGTH chars
        last_space = text.rfind(' ', 0, truncate_pos)
        if last_space > MIN_TRUNCATE_POSITION:  # Don't truncate too early
            truncate_pos = last_space

        summary = text[:truncate_pos].strip()

        # Add ellipsis if truncated mid-sentence
        if not summary.endswith('.'):
            summary += '...'

        return summary

