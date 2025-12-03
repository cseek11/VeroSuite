"""Compile regex patterns from configuration into matchers."""

import re
from typing import List, Optional, Tuple, Pattern
from dataclasses import dataclass
from .config_loader import BibleConfig


@dataclass
class MatchResult:
    """Result of a pattern match."""
    matched: bool
    chapter_number: Optional[int] = None
    title: Optional[str] = None
    part_name: Optional[str] = None
    part_number: Optional[str] = None


class PatternMatcher:
    """Compiled pattern matcher for a single pattern type."""
    
    def __init__(self, pattern: str, pattern_type: str):
        """
        Initialize a pattern matcher.
        
        Args:
            pattern: Regex pattern string
            pattern_type: Type of pattern ('boundary', 'title', 'part')
        """
        try:
            self.compiled = re.compile(pattern)
            self.pattern = pattern
            self.pattern_type = pattern_type
        except re.error as e:
            raise ValueError(f"Invalid regex pattern '{pattern}': {e}")
    
    def match(self, line: str) -> Optional[MatchResult]:
        """
        Try to match a line against this pattern.
        
        Args:
            line: Line of text to match
            
        Returns:
            MatchResult if match found, None otherwise
        """
        match = self.compiled.match(line)
        if not match:
            return None
        
        groups = match.groups()
        
        if self.pattern_type == 'boundary':
            # Boundary patterns must capture chapter number in group 1
            if len(groups) < 1:
                return None
            try:
                chapter_num = int(groups[0])
                return MatchResult(matched=True, chapter_number=chapter_num)
            except (ValueError, IndexError):
                return None
        
        elif self.pattern_type == 'title':
            # Title patterns capture chapter number in group 1, title in group 2
            if len(groups) < 1:
                return None
            try:
                chapter_num = int(groups[0])
                title = groups[1] if len(groups) > 1 else None
                return MatchResult(matched=True, chapter_number=chapter_num, title=title)
            except (ValueError, IndexError):
                return None
        
        elif self.pattern_type == 'part':
            # Part patterns capture part identifier in group 1, name in group 2
            if len(groups) < 1:
                return None
            part_number = groups[0]
            part_name = groups[1] if len(groups) > 1 else None
            return MatchResult(
                matched=True,
                part_number=part_number,
                part_name=part_name
            )
        
        return None


class PatternLoader:
    """Load and compile patterns from configuration."""
    
    def __init__(self, config: BibleConfig):
        """
        Initialize pattern loader with configuration.
        
        Args:
            config: BibleConfig object
        """
        self.config = config
        self.boundary_matchers = [
            PatternMatcher(p, 'boundary') 
            for p in config.chapter_boundary_patterns
        ]
        self.title_matchers = [
            PatternMatcher(p, 'title')
            for p in config.chapter_title_patterns
        ]
        self.part_matchers = [
            PatternMatcher(p, 'part')
            for p in config.part_header_patterns
        ]
    
    def match_chapter_boundary(self, line: str) -> Optional[MatchResult]:
        """
        Try to match a chapter boundary pattern.
        
        Args:
            line: Line to check
            
        Returns:
            MatchResult if boundary found, None otherwise
        """
        for matcher in self.boundary_matchers:
            result = matcher.match(line)
            if result and result.matched:
                return result
        return None
    
    def match_chapter_title(self, line: str) -> Optional[MatchResult]:
        """
        Try to match a chapter title pattern.
        
        Args:
            line: Line to check
            
        Returns:
            MatchResult if title found, None otherwise
        """
        for matcher in self.title_matchers:
            result = matcher.match(line)
            if result and result.matched:
                return result
        return None
    
    def match_part_header(self, line: str) -> Optional[MatchResult]:
        """
        Try to match a part header pattern.
        
        Args:
            line: Line to check
            
        Returns:
            MatchResult if part header found, None otherwise
        """
        for matcher in self.part_matchers:
            result = matcher.match(line)
            if result and result.matched:
                return result
        return None


