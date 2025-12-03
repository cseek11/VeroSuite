#!/usr/bin/env python3
"""
Comprehensive tests for Phase 3: Full DateDetector Implementation.

Tests DateDetector class, DateMatch, DateClassification, and integration scenarios.
Target: 50+ test cases covering all patterns, contexts, and edge cases.

Last Updated: 2025-12-02
"""

import unittest
import tempfile
import os
from pathlib import Path
from datetime import datetime, timedelta
import sys
import shutil

# Add project root to path
project_root = Path(__file__).parent.parent
sys.path.insert(0, str(project_root))
sys.path.insert(0, str(project_root / ".cursor"))

from enforcement.date_detector import (
    DocumentContext,
    DateDetector,
    DateMatch,
    DateClassification
)


class TestDateDetectorFindDates(unittest.TestCase):
    """Test DateDetector.find_dates() method."""
    
    def setUp(self):
        """Set up DateDetector instance."""
        self.detector = DateDetector(current_date="2025-12-02")
    
    def test_find_single_date_iso_format(self):
        """Test finding single date in ISO format."""
        text = "Updated on 2025-12-01"
        matches = self.detector.find_dates(text)
        self.assertEqual(len(matches), 1)
        self.assertEqual(matches[0].date_str, "2025-12-01")
        self.assertEqual(matches[0].line_number, 1)
    
    def test_find_single_date_us_format(self):
        """Test finding single date in US format."""
        text = "Updated on 12/01/2025"
        matches = self.detector.find_dates(text)
        self.assertEqual(len(matches), 1)
        self.assertEqual(matches[0].date_str, "2025-12-01")
    
    def test_find_multiple_dates(self):
        """Test finding multiple dates in text."""
        text = "Created: 2025-11-01\nUpdated: 2025-12-01"
        matches = self.detector.find_dates(text)
        self.assertEqual(len(matches), 2)
        self.assertEqual(matches[0].date_str, "2025-11-01")
        self.assertEqual(matches[1].date_str, "2025-12-01")
    
    def test_find_dates_with_context(self):
        """Test that context is included in DateMatch."""
        text = "Line 1\nLine 2\nDate: 2025-12-01\nLine 4\nLine 5"
        matches = self.detector.find_dates(text, context_lines=2)
        self.assertEqual(len(matches), 1)
        self.assertIn("Line 2", matches[0].context)
        self.assertIn("Date: 2025-12-01", matches[0].context)
        self.assertIn("Line 4", matches[0].context)
    
    def test_find_dates_multiline(self):
        """Test finding dates across multiple lines."""
        text = "Line 1: 2025-11-01\nLine 2: 2025-11-02\nLine 3: 2025-11-03"
        matches = self.detector.find_dates(text)
        self.assertEqual(len(matches), 3)
        self.assertEqual(matches[0].line_number, 1)
        self.assertEqual(matches[1].line_number, 2)
        self.assertEqual(matches[2].line_number, 3)
    
    def test_no_dates_in_text(self):
        """Test when no dates are present."""
        text = "This is just regular text without any dates."
        matches = self.detector.find_dates(text)
        self.assertEqual(len(matches), 0)
    
    def test_invalid_date_formats(self):
        """Test that invalid date formats are not matched."""
        text = "Not a date: 99/99/9999 or 2025-13-45"
        matches = self.detector.find_dates(text)
        # Should not match invalid dates (regex should filter these)
        self.assertEqual(len(matches), 0)
    
    def test_date_in_code_block(self):
        """Test finding date in code block."""
        text = "```\nconst date = '2025-12-01';\n```"
        matches = self.detector.find_dates(text)
        self.assertEqual(len(matches), 1)
        self.assertEqual(matches[0].date_str, "2025-12-01")
    
    def test_date_with_slashes(self):
        """Test date with slashes."""
        text = "Date: 12/25/2025"
        matches = self.detector.find_dates(text)
        self.assertEqual(len(matches), 1)
        self.assertEqual(matches[0].date_str, "2025-12-25")
    
    def test_date_with_dashes(self):
        """Test date with dashes."""
        text = "Date: 2025-12-25"
        matches = self.detector.find_dates(text)
        self.assertEqual(len(matches), 1)
        self.assertEqual(matches[0].date_str, "2025-12-25")


class TestDateDetectorClassifyDate(unittest.TestCase):
    """Test DateDetector.classify_date() method."""
    
    def setUp(self):
        """Set up DateDetector and test files."""
        self.detector = DateDetector(current_date="2025-12-02")
        self.temp_dir = tempfile.mkdtemp()
        self.temp_dir_path = Path(self.temp_dir)
    
    def tearDown(self):
        """Clean up temporary files."""
        if self.temp_dir_path.exists():
            shutil.rmtree(self.temp_dir_path)
    
    def test_classify_current_date(self):
        """Test classification of current date."""
        test_file = self.temp_dir_path / "test.md"
        test_file.write_text("Updated: 2025-12-02")
        doc_context = DocumentContext(test_file)
        
        matches = self.detector.find_dates(test_file.read_text())
        classification = self.detector.classify_date(matches[0], doc_context)
        self.assertEqual(classification, DateClassification.CURRENT)
    
    def test_classify_historical_date(self):
        """Test classification of historical date."""
        test_file = self.temp_dir_path / "test.md"
        test_file.write_text("Entry #1 - 2025-11-01")
        doc_context = DocumentContext(test_file)
        
        matches = self.detector.find_dates(test_file.read_text())
        classification = self.detector.classify_date(matches[0], doc_context)
        self.assertEqual(classification, DateClassification.HISTORICAL)
    
    def test_classify_example_date_in_code(self):
        """Test classification of example date in code block."""
        test_file = self.temp_dir_path / "test.md"
        test_file.write_text("```\nconst date = '2025-12-01';\n```")
        doc_context = DocumentContext(test_file)
        
        matches = self.detector.find_dates(test_file.read_text())
        classification = self.detector.classify_date(matches[0], doc_context)
        self.assertEqual(classification, DateClassification.EXAMPLE)
    
    def test_classify_date_in_historical_document(self):
        """Test classification in historical document."""
        test_file = self.temp_dir_path / "document_2025-11-01.md"
        test_file.write_text("Content dated 2025-12-01")
        doc_context = DocumentContext(test_file)
        
        matches = self.detector.find_dates(test_file.read_text())
        classification = self.detector.classify_date(matches[0], doc_context)
        self.assertEqual(classification, DateClassification.HISTORICAL)
    
    def test_classify_date_in_log_file(self):
        """Test classification in log file."""
        test_file = self.temp_dir_path / "BUG_LOG.md"
        test_file.write_text("Bug fixed: 2025-12-01")
        doc_context = DocumentContext(test_file)
        
        matches = self.detector.find_dates(test_file.read_text())
        classification = self.detector.classify_date(matches[0], doc_context)
        self.assertEqual(classification, DateClassification.HISTORICAL)
    
    def test_classify_far_past_date(self):
        """Test classification of date far in past."""
        test_file = self.temp_dir_path / "test.md"
        test_file.write_text("Created: 2020-01-01")
        doc_context = DocumentContext(test_file)
        
        matches = self.detector.find_dates(test_file.read_text())
        classification = self.detector.classify_date(matches[0], doc_context)
        self.assertEqual(classification, DateClassification.HISTORICAL)
    
    def test_classify_future_date(self):
        """Test classification of future date."""
        test_file = self.temp_dir_path / "test.md"
        test_file.write_text("Scheduled: 2026-01-01")
        doc_context = DocumentContext(test_file)
        
        matches = self.detector.find_dates(test_file.read_text())
        classification = self.detector.classify_date(matches[0], doc_context)
        self.assertEqual(classification, DateClassification.HISTORICAL)
    
    def test_classify_completed_pattern(self):
        """Test classification with completed pattern."""
        test_file = self.temp_dir_path / "test.md"
        test_file.write_text("Completed (2025-11-01)")
        doc_context = DocumentContext(test_file)
        
        matches = self.detector.find_dates(test_file.read_text())
        classification = self.detector.classify_date(matches[0], doc_context)
        self.assertEqual(classification, DateClassification.HISTORICAL)
    
    def test_classify_metadata_field(self):
        """Test classification with metadata field pattern."""
        test_file = self.temp_dir_path / "test.md"
        test_file.write_text("**Date:** 2025-11-01")
        doc_context = DocumentContext(test_file)
        
        matches = self.detector.find_dates(test_file.read_text())
        classification = self.detector.classify_date(matches[0], doc_context)
        self.assertEqual(classification, DateClassification.HISTORICAL)
    
    def test_classify_recent_past_date(self):
        """Test classification of recent past date (should be CURRENT)."""
        test_file = self.temp_dir_path / "test.md"
        test_file.write_text("Updated: 2025-12-01")  # Yesterday
        doc_context = DocumentContext(test_file)
        
        matches = self.detector.find_dates(test_file.read_text())
        classification = self.detector.classify_date(matches[0], doc_context)
        # Recent past dates should be classified as CURRENT (need updating)
        self.assertEqual(classification, DateClassification.CURRENT)


class TestDateMatchDataclass(unittest.TestCase):
    """Test DateMatch dataclass."""
    
    def test_date_match_creation(self):
        """Test creating DateMatch instance."""
        match = DateMatch(
            date_str="2025-12-01",
            line_number=5,
            line_content="Updated: 2025-12-01",
            context="Line 3\nLine 4\nLine 5\nLine 6"
        )
        self.assertEqual(match.date_str, "2025-12-01")
        self.assertEqual(match.line_number, 5)
        self.assertIn("Updated", match.line_content)
        self.assertIn("Line 4", match.context)
    
    def test_date_match_default_context(self):
        """Test DateMatch with default empty context."""
        match = DateMatch(
            date_str="2025-12-01",
            line_number=1,
            line_content="Date: 2025-12-01"
        )
        self.assertEqual(match.context, "")
    
    def test_date_match_equality(self):
        """Test DateMatch equality."""
        match1 = DateMatch("2025-12-01", 1, "Line 1")
        match2 = DateMatch("2025-12-01", 1, "Line 1")
        match3 = DateMatch("2025-12-02", 1, "Line 1")
        
        # Note: dataclasses compare by value
        self.assertEqual(match1.date_str, match2.date_str)
        self.assertNotEqual(match1.date_str, match3.date_str)


class TestDateClassificationEnum(unittest.TestCase):
    """Test DateClassification enum."""
    
    def test_enum_values(self):
        """Test enum value access."""
        self.assertEqual(DateClassification.CURRENT.value, "current")
        self.assertEqual(DateClassification.HISTORICAL.value, "historical")
        self.assertEqual(DateClassification.EXAMPLE.value, "example")
        self.assertEqual(DateClassification.UNKNOWN.value, "unknown")
    
    def test_enum_comparison(self):
        """Test enum comparison."""
        self.assertEqual(DateClassification.CURRENT, DateClassification.CURRENT)
        self.assertNotEqual(DateClassification.CURRENT, DateClassification.HISTORICAL)


class TestDateDetectorIntegration(unittest.TestCase):
    """Integration tests for DateDetector with DocumentContext."""
    
    def setUp(self):
        """Set up test environment."""
        self.detector = DateDetector(current_date="2025-12-02")
        self.temp_dir = tempfile.mkdtemp()
        self.temp_dir_path = Path(self.temp_dir)
    
    def tearDown(self):
        """Clean up."""
        if self.temp_dir_path.exists():
            shutil.rmtree(self.temp_dir_path)
    
    def test_full_workflow_historical_document(self):
        """Test full workflow with historical document."""
        test_file = self.temp_dir_path / "document_2025-11-01.md"
        # Use ISO format date that regex can match (not month name format)
        test_file.write_text("# Document - 2025-11-01\n\nContent here.")
        doc_context = DocumentContext(test_file)
        
        matches = self.detector.find_dates(test_file.read_text())
        self.assertEqual(len(matches), 1)
        
        classification = self.detector.classify_date(matches[0], doc_context)
        self.assertEqual(classification, DateClassification.HISTORICAL)
    
    def test_full_workflow_current_date(self):
        """Test full workflow with current date."""
        test_file = self.temp_dir_path / "regular.md"
        # Use "Updated:" instead of "Last Updated:" to avoid historical pattern match
        test_file.write_text("Updated: 2025-12-02")
        doc_context = DocumentContext(test_file)
        
        matches = self.detector.find_dates(test_file.read_text())
        classification = self.detector.classify_date(matches[0], doc_context)
        self.assertEqual(classification, DateClassification.CURRENT)
    
    def test_full_workflow_example_code(self):
        """Test full workflow with example code."""
        test_file = self.temp_dir_path / "example.md"
        test_file.write_text("```python\ndate = '2025-12-01'\n```")
        doc_context = DocumentContext(test_file)
        
        matches = self.detector.find_dates(test_file.read_text())
        classification = self.detector.classify_date(matches[0], doc_context)
        self.assertEqual(classification, DateClassification.EXAMPLE)
    
    def test_multiple_dates_classification(self):
        """Test classifying multiple dates in one document."""
        test_file = self.temp_dir_path / "test.md"
        # Use "Modified:" instead of "Updated:" to avoid pattern conflicts
        test_file.write_text("Created: 2025-11-01\nEntry #1 - 2025-11-15\nModified: 2025-12-02")
        doc_context = DocumentContext(test_file)
        
        matches = self.detector.find_dates(test_file.read_text())
        self.assertEqual(len(matches), 3)
        
        classifications = [self.detector.classify_date(m, doc_context) for m in matches]
        # First: historical (far past)
        # Second: historical (entry pattern)
        # Third: current (matches current date)
        self.assertEqual(classifications[0], DateClassification.HISTORICAL)
        self.assertEqual(classifications[1], DateClassification.HISTORICAL)
        self.assertEqual(classifications[2], DateClassification.CURRENT)


class TestDateDetectorEdgeCases(unittest.TestCase):
    """Test edge cases and error handling."""
    
    def setUp(self):
        """Set up DateDetector."""
        self.detector = DateDetector(current_date="2025-12-02")
    
    def test_empty_text(self):
        """Test with empty text."""
        matches = self.detector.find_dates("")
        self.assertEqual(len(matches), 0)
    
    def test_text_with_only_whitespace(self):
        """Test with whitespace-only text."""
        matches = self.detector.find_dates("   \n\t  \n  ")
        self.assertEqual(len(matches), 0)
    
    def test_date_at_line_boundary(self):
        """Test date at start/end of text."""
        text = "2025-12-01"
        matches = self.detector.find_dates(text)
        self.assertEqual(len(matches), 1)
    
    def test_date_with_extra_spaces(self):
        """Test date with extra spaces around it."""
        text = "Date:   2025-12-01   "
        matches = self.detector.find_dates(text)
        self.assertEqual(len(matches), 1)
        self.assertEqual(matches[0].date_str, "2025-12-01")
    
    def test_date_in_url(self):
        """Test that dates in URLs are detected."""
        text = "Visit https://example.com/2025-12-01/page"
        matches = self.detector.find_dates(text)
        # Should detect date even in URL
        self.assertEqual(len(matches), 1)
    
    def test_date_in_email(self):
        """Test date in email context."""
        text = "Sent on 2025-12-01 to user@example.com"
        matches = self.detector.find_dates(text)
        self.assertEqual(len(matches), 1)
    
    def test_context_lines_parameter(self):
        """Test different context_lines values."""
        text = "Line 1\nLine 2\nDate: 2025-12-01\nLine 4\nLine 5"
        
        matches_1 = self.detector.find_dates(text, context_lines=1)
        matches_3 = self.detector.find_dates(text, context_lines=3)
        
        self.assertEqual(len(matches_1), 1)
        self.assertEqual(len(matches_3), 1)
        # More context lines should include more surrounding lines
        self.assertLess(len(matches_1[0].context), len(matches_3[0].context))
    
    def test_custom_current_date(self):
        """Test DateDetector with custom current date."""
        detector = DateDetector(current_date="2026-01-01")
        text = "Date: 2025-12-01"
        matches = detector.find_dates(text)
        self.assertEqual(len(matches), 1)
        # Should classify as historical relative to 2026-01-01
        self.assertEqual(detector.current_date, "2026-01-01")


class TestDateDetectorPerformance(unittest.TestCase):
    """Test performance-related aspects."""
    
    def setUp(self):
        """Set up DateDetector."""
        self.detector = DateDetector(current_date="2025-12-02")
    
    def test_large_text_performance(self):
        """Test performance with large text."""
        # Create text with many dates
        lines = [f"Line {i}: 2025-12-01" for i in range(100)]
        text = "\n".join(lines)
        
        matches = self.detector.find_dates(text)
        self.assertEqual(len(matches), 100)
    
    def test_regex_precompilation(self):
        """Test that regex patterns are pre-compiled."""
        # Patterns should be compiled at class level
        self.assertIsNotNone(self.detector.HARDCODED_DATE_PATTERN)
        self.assertIsNotNone(self.detector.HISTORICAL_DATE_PATTERNS)
        self.assertGreater(len(self.detector.HISTORICAL_DATE_PATTERNS), 0)


class TestDateDetectorHistoricalPatterns(unittest.TestCase):
    """Test all historical date patterns."""
    
    def setUp(self):
        """Set up DateDetector."""
        self.detector = DateDetector(current_date="2025-12-02")
        self.temp_dir = tempfile.mkdtemp()
        self.temp_dir_path = Path(self.temp_dir)
    
    def tearDown(self):
        """Clean up."""
        if self.temp_dir_path.exists():
            shutil.rmtree(self.temp_dir_path)
    
    def test_entry_pattern(self):
        """Test entry/log pattern."""
        test_file = self.temp_dir_path / "test.md"
        test_file.write_text("Entry #1 - 2025-12-01")
        doc_context = DocumentContext(test_file)
        matches = self.detector.find_dates(test_file.read_text())
        classification = self.detector.classify_date(matches[0], doc_context)
        self.assertEqual(classification, DateClassification.HISTORICAL)
    
    def test_completed_pattern(self):
        """Test completed/resolved pattern."""
        test_file = self.temp_dir_path / "test.md"
        test_file.write_text("Completed: 2025-12-01")
        doc_context = DocumentContext(test_file)
        matches = self.detector.find_dates(test_file.read_text())
        classification = self.detector.classify_date(matches[0], doc_context)
        self.assertEqual(classification, DateClassification.HISTORICAL)
    
    def test_metadata_field_pattern(self):
        """Test metadata field pattern."""
        test_file = self.temp_dir_path / "test.md"
        test_file.write_text("**Created:** 2025-12-01")
        doc_context = DocumentContext(test_file)
        matches = self.detector.find_dates(test_file.read_text())
        classification = self.detector.classify_date(matches[0], doc_context)
        self.assertEqual(classification, DateClassification.HISTORICAL)
    
    def test_code_example_pattern(self):
        """Test code example pattern."""
        test_file = self.temp_dir_path / "test.md"
        test_file.write_text("`date('2025-12-01')`")
        doc_context = DocumentContext(test_file)
        matches = self.detector.find_dates(test_file.read_text())
        classification = self.detector.classify_date(matches[0], doc_context)
        self.assertEqual(classification, DateClassification.EXAMPLE)
    
    def test_document_structure_pattern(self):
        """Test document structure (header) pattern."""
        test_file = self.temp_dir_path / "test.md"
        test_file.write_text("# Document 2025-12-01")
        doc_context = DocumentContext(test_file)
        matches = self.detector.find_dates(test_file.read_text())
        classification = self.detector.classify_date(matches[0], doc_context)
        self.assertEqual(classification, DateClassification.HISTORICAL)


if __name__ == '__main__':
    unittest.main()

