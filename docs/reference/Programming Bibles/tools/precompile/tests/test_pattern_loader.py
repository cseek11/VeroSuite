"""Tests for pattern loader."""

import unittest
import sys
from pathlib import Path

# Add parent directory to path for imports
sys.path.insert(0, str(Path(__file__).parent.parent))

from loaders.config_loader import BibleConfig, SlugRules
from loaders.pattern_loader import PatternLoader, PatternMatcher


class TestPatternMatcher(unittest.TestCase):
    """Test pattern matcher functionality."""
    
    def test_boundary_pattern_match(self):
        """Test matching chapter boundary pattern."""
        pattern = '^<!--\\s*SSM:CHUNK_BOUNDARY\\s+id="ch(\\d+)-start"\\s*-->$'
        matcher = PatternMatcher(pattern, 'boundary')
        
        result = matcher.match('<!-- SSM:CHUNK_BOUNDARY id="ch01-start" -->')
        self.assertIsNotNone(result)
        self.assertTrue(result.matched)
        self.assertEqual(result.chapter_number, 1)
        
        result = matcher.match('<!-- SSM:CHUNK_BOUNDARY id="ch42-start" -->')
        self.assertIsNotNone(result)
        self.assertEqual(result.chapter_number, 42)
    
    def test_boundary_pattern_no_match(self):
        """Test boundary pattern doesn't match invalid lines."""
        pattern = '^<!--\\s*SSM:CHUNK_BOUNDARY\\s+id="ch(\\d+)-start"\\s*-->$'
        matcher = PatternMatcher(pattern, 'boundary')
        
        result = matcher.match('Some regular text')
        self.assertIsNone(result)
        
        result = matcher.match('<!-- SSM:CHUNK_BOUNDARY id="ch-start" -->')
        self.assertIsNone(result)
    
    def test_title_pattern_match(self):
        """Test matching chapter title pattern."""
        pattern = '^📘\\s*CHAPTER\\s+(\\d+)\\s+[-—]\\s+(.*)$'
        matcher = PatternMatcher(pattern, 'title')
        
        result = matcher.match('📘 CHAPTER 1 — INTRODUCTION TO PYTHON')
        self.assertIsNotNone(result)
        self.assertTrue(result.matched)
        self.assertEqual(result.chapter_number, 1)
        self.assertEqual(result.title, 'INTRODUCTION TO PYTHON')
        
        result = matcher.match('📘 CHAPTER 42 — ADVANCED TOPICS')
        self.assertIsNotNone(result)
        self.assertEqual(result.chapter_number, 42)
        self.assertEqual(result.title, 'ADVANCED TOPICS')
    
    def test_part_header_pattern_match(self):
        """Test matching part header pattern."""
        pattern = '^#\\s*Part\\s+([IVXLC]+):\\s*(.*)$'
        matcher = PatternMatcher(pattern, 'part')
        
        result = matcher.match('# Part I: Foundations')
        self.assertIsNotNone(result)
        self.assertTrue(result.matched)
        self.assertEqual(result.part_number, 'I')
        self.assertEqual(result.part_name, 'Foundations')
        
        result = matcher.match('# Part II: Language Core')
        self.assertIsNotNone(result)
        self.assertEqual(result.part_number, 'II')
        self.assertEqual(result.part_name, 'Language Core')
    
    def test_invalid_regex(self):
        """Test error with invalid regex pattern."""
        with self.assertRaises(ValueError):
            PatternMatcher('[invalid', 'boundary')


class TestPatternLoader(unittest.TestCase):
    """Test pattern loader functionality."""
    
    def setUp(self):
        """Set up test fixtures."""
        self.config = BibleConfig(
            chapter_boundary_patterns=[
                '^<!--\\s*SSM:CHUNK_BOUNDARY\\s+id="ch(\\d+)-start"\\s*-->$'
            ],
            chapter_title_patterns=[
                '^📘\\s*CHAPTER\\s+(\\d+)\\s+[-—]\\s+(.*)$',
                '^CHAPTER\\s+(\\d+):\\s+(.*)$'  # Fallback pattern
            ],
            part_header_patterns=[
                '^#\\s*Part\\s+([IVXLC]+):\\s*(.*)$'
            ],
            slug_rules=SlugRules()
        )
        self.loader = PatternLoader(self.config)
    
    def test_match_chapter_boundary(self):
        """Test matching chapter boundaries."""
        result = self.loader.match_chapter_boundary('<!-- SSM:CHUNK_BOUNDARY id="ch01-start" -->')
        self.assertIsNotNone(result)
        self.assertEqual(result.chapter_number, 1)
        
        result = self.loader.match_chapter_boundary('Regular text')
        self.assertIsNone(result)
    
    def test_match_chapter_title(self):
        """Test matching chapter titles."""
        result = self.loader.match_chapter_title('📘 CHAPTER 1 — INTRODUCTION')
        self.assertIsNotNone(result)
        self.assertEqual(result.chapter_number, 1)
        self.assertEqual(result.title, 'INTRODUCTION')
        
        # Test fallback pattern
        result = self.loader.match_chapter_title('CHAPTER 2: Syntax Basics')
        self.assertIsNotNone(result)
        self.assertEqual(result.chapter_number, 2)
        self.assertEqual(result.title, 'Syntax Basics')
    
    def test_match_part_header(self):
        """Test matching part headers."""
        result = self.loader.match_part_header('# Part I: Foundations')
        self.assertIsNotNone(result)
        self.assertEqual(result.part_number, 'I')
        self.assertEqual(result.part_name, 'Foundations')
        
        result = self.loader.match_part_header('Regular text')
        self.assertIsNone(result)
    
    def test_priority_order(self):
        """Test that patterns are checked in priority order."""
        # First pattern should match
        result = self.loader.match_chapter_title('📘 CHAPTER 1 — INTRODUCTION')
        self.assertIsNotNone(result)
        self.assertEqual(result.title, 'INTRODUCTION')
        
        # Second pattern should also work
        result = self.loader.match_chapter_title('CHAPTER 1: Introduction')
        self.assertIsNotNone(result)
        self.assertEqual(result.title, 'Introduction')


if __name__ == '__main__':
    unittest.main()

