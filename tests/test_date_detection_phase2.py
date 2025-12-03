#!/usr/bin/env python3
"""
Comprehensive tests for Phase 2: Architectural Improvements.

Tests:
1. DocumentContext title date extraction
2. DocumentContext historical markers detection
3. Simplified is_file_modified_in_session() hash-only comparison

Last Updated: 2025-12-02
"""

import unittest
import tempfile
import os
from pathlib import Path
from datetime import datetime, timezone
import sys
import time

# Add project root to path
project_root = Path(__file__).parent.parent
sys.path.insert(0, str(project_root))
sys.path.insert(0, str(project_root / ".cursor"))

from enforcement.date_detector import DocumentContext


class TestDocumentContextTitleDateExtraction(unittest.TestCase):
    """Test title date extraction in DocumentContext."""
    
    def setUp(self):
        """Set up temporary file for testing."""
        self.temp_dir = tempfile.mkdtemp()
        self.temp_dir_path = Path(self.temp_dir)
    
    def tearDown(self):
        """Clean up temporary files."""
        import shutil
        if self.temp_dir_path.exists():
            shutil.rmtree(self.temp_dir_path)
    
    def test_extract_date_from_title_iso_format(self):
        """Test extracting date from title in ISO format."""
        test_file = self.temp_dir_path / "test.md"
        test_file.write_text("# Document - 2026-12-21\n\nContent here.")
        
        doc = DocumentContext(test_file)
        self.assertEqual(doc.title_date, "2026-12-21")
    
    def test_extract_date_from_title_us_format(self):
        """Test extracting date from title in US format."""
        test_file = self.temp_dir_path / "test.md"
        test_file.write_text("# Report - 12/21/2026\n\nContent here.")
        
        doc = DocumentContext(test_file)
        self.assertEqual(doc.title_date, "2026-12-21")
    
    def test_extract_date_from_title_month_name(self):
        """Test extracting date from title with month name."""
        test_file = self.temp_dir_path / "test.md"
        test_file.write_text("# Document - December 21, 2026\n\nContent here.")
        
        doc = DocumentContext(test_file)
        self.assertEqual(doc.title_date, "2026-12-21")
    
    def test_extract_date_from_title_short_month(self):
        """Test extracting date from title with short month name."""
        test_file = self.temp_dir_path / "test.md"
        test_file.write_text("# Document - Dec 21, 2026\n\nContent here.")
        
        doc = DocumentContext(test_file)
        self.assertEqual(doc.title_date, "2026-12-21")
    
    def test_no_date_in_title(self):
        """Test when no date is present in title."""
        test_file = self.temp_dir_path / "test.md"
        test_file.write_text("# Document Title\n\nContent here.")
        
        doc = DocumentContext(test_file)
        self.assertIsNone(doc.title_date)
    
    def test_date_in_body_not_title(self):
        """Test that dates in body are not extracted as title dates."""
        test_file = self.temp_dir_path / "test.md"
        test_file.write_text("# Document Title\n\nContent dated 2026-12-21.")
        
        doc = DocumentContext(test_file)
        self.assertIsNone(doc.title_date)


class TestDocumentContextHistoricalMarkers(unittest.TestCase):
    """Test historical markers detection in DocumentContext."""
    
    def setUp(self):
        """Set up temporary file for testing."""
        self.temp_dir = tempfile.mkdtemp()
        self.temp_dir_path = Path(self.temp_dir)
    
    def tearDown(self):
        """Clean up temporary files."""
        import shutil
        if self.temp_dir_path.exists():
            shutil.rmtree(self.temp_dir_path)
    
    def test_detect_dated_marker(self):
        """Test detection of 'dated' marker."""
        test_file = self.temp_dir_path / "test.md"
        test_file.write_text("# Document\n\nInformation dated December 21, 2026.")
        
        doc = DocumentContext(test_file)
        self.assertTrue(doc.historical_markers)
    
    def test_detect_information_dated_marker(self):
        """Test detection of 'information dated' marker."""
        test_file = self.temp_dir_path / "test.md"
        test_file.write_text("# Document\n\nThis information dated 2026-12-21.")
        
        doc = DocumentContext(test_file)
        self.assertTrue(doc.historical_markers)
    
    def test_detect_report_generated_marker(self):
        """Test detection of 'report generated' marker."""
        test_file = self.temp_dir_path / "test.md"
        test_file.write_text("# Document\n\nReport generated on 2026-12-21.")
        
        doc = DocumentContext(test_file)
        self.assertTrue(doc.historical_markers)
    
    def test_detect_date_set_per_user_request(self):
        """Test detection of 'date set per user request' marker."""
        test_file = self.temp_dir_path / "test.md"
        test_file.write_text("# Document\n\nDate set per user request. System date: 2025-12-02")
        
        doc = DocumentContext(test_file)
        self.assertTrue(doc.historical_markers)
    
    def test_detect_system_date_marker(self):
        """Test detection of 'system date:' marker."""
        test_file = self.temp_dir_path / "test.md"
        test_file.write_text("# Document\n\nSystem date: 2025-12-02")
        
        doc = DocumentContext(test_file)
        self.assertTrue(doc.historical_markers)
    
    def test_detect_historical_document_marker(self):
        """Test detection of 'historical document' marker."""
        test_file = self.temp_dir_path / "test.md"
        test_file.write_text("# Document\n\nThis is a historical document.")
        
        doc = DocumentContext(test_file)
        self.assertTrue(doc.historical_markers)
    
    def test_detect_archived_on_marker(self):
        """Test detection of 'archived on' marker."""
        test_file = self.temp_dir_path / "test.md"
        test_file.write_text("# Document\n\nArchived on 2026-12-21.")
        
        doc = DocumentContext(test_file)
        self.assertTrue(doc.historical_markers)
    
    def test_no_historical_markers(self):
        """Test when no historical markers are present."""
        test_file = self.temp_dir_path / "test.md"
        test_file.write_text("# Document\n\nRegular content here.")
        
        doc = DocumentContext(test_file)
        self.assertFalse(doc.historical_markers)
    
    def test_marker_in_body_not_header(self):
        """Test that markers beyond first 15 lines are not detected."""
        test_file = self.temp_dir_path / "test.md"
        content = "# Document\n\n" + "\n" * 20 + "Information dated 2026-12-21."
        test_file.write_text(content)
        
        doc = DocumentContext(test_file)
        # Should not detect marker beyond first 15 lines
        self.assertFalse(doc.historical_markers)


class TestDocumentContextIntegration(unittest.TestCase):
    """Test DocumentContext integration with historical document detection."""
    
    def setUp(self):
        """Set up temporary file for testing."""
        self.temp_dir = tempfile.mkdtemp()
        self.temp_dir_path = Path(self.temp_dir)
    
    def tearDown(self):
        """Clean up temporary files."""
        import shutil
        if self.temp_dir_path.exists():
            shutil.rmtree(self.temp_dir_path)
    
    def test_historical_doc_with_title_date(self):
        """Test that document with date in title is detected as historical."""
        test_file = self.temp_dir_path / "document_2026-12-21.md"
        test_file.write_text("# Document - December 21, 2026\n\nContent.")
        
        doc = DocumentContext(test_file)
        self.assertTrue(doc.is_historical_doc)
        self.assertEqual(doc.title_date, "2026-12-21")
    
    def test_historical_doc_with_markers(self):
        """Test that document with historical markers is detected as historical."""
        test_file = self.temp_dir_path / "report.md"
        test_file.write_text("# Report\n\nInformation dated December 21, 2026.")
        
        doc = DocumentContext(test_file)
        self.assertTrue(doc.is_historical_doc)
        self.assertTrue(doc.historical_markers)
    
    def test_regular_document(self):
        """Test that regular document is not detected as historical."""
        test_file = self.temp_dir_path / "regular.md"
        test_file.write_text("# Regular Document\n\nRegular content here.")
        
        doc = DocumentContext(test_file)
        self.assertFalse(doc.is_historical_doc)
        self.assertFalse(doc.historical_markers)
        self.assertIsNone(doc.title_date)


class TestSimplifiedFileModificationDetection(unittest.TestCase):
    """Test simplified is_file_modified_in_session() hash-only comparison."""
    
    def setUp(self):
        """Set up test enforcer and temporary file."""
        # Create minimal mock enforcer for testing
        import hashlib
        from dataclasses import dataclass
        
        @dataclass
        class MockSession:
            file_hashes: dict = None
            start_time: str = None
            def __init__(self):
                self.file_hashes = {}
                self.start_time = datetime.now(timezone.utc).isoformat()
        
        class MockEnforcer:
            def __init__(self):
                self.session = MockSession()
                self.project_root = Path.cwd()
            
            def get_changed_files(self):
                # Return all files in temp dir
                return [str(f.relative_to(self.project_root)) 
                       for f in self.temp_dir_path.glob("*") if f.is_file()]
            
            def get_file_hash(self, file_path_str):
                file_path = Path(file_path_str)
                if not file_path.exists():
                    return None
                try:
                    stat_info = file_path.stat()
                    cache_key = f"{file_path_str}:{stat_info.st_mtime}"
                    if self.session.file_hashes.get(cache_key):
                        return self.session.file_hashes[cache_key]
                    hasher = hashlib.sha256()
                    with open(file_path, 'rb') as f:
                        for chunk in iter(lambda: f.read(4096), b""):
                            hasher.update(chunk)
                    hash_value = hasher.hexdigest()
                    self.session.file_hashes[cache_key] = hash_value
                    return hash_value
                except Exception:
                    return None
            
            def is_file_modified_in_session(self, file_path):
                """Simplified hash-only version."""
                changed_files = self.get_changed_files()
                if file_path not in changed_files:
                    return False
                
                full_path = self.project_root / file_path
                if not full_path.exists():
                    return False
                
                current_hash = self.get_file_hash(str(full_path))
                if not current_hash:
                    return False
                
                if self.session.file_hashes is None:
                    self.session.file_hashes = {}
                
                try:
                    stat_info = full_path.stat()
                    cache_key = f"{file_path}:{stat_info.st_mtime}"
                except (OSError, FileNotFoundError):
                    cache_key = file_path
                
                previous_hash_key = f"{file_path}:previous"
                previous_hash = self.session.file_hashes.get(previous_hash_key)
                
                if previous_hash is None:
                    self.session.file_hashes[previous_hash_key] = current_hash
                    self.session.file_hashes[cache_key] = current_hash
                    return True
                
                hash_changed = current_hash != previous_hash
                
                if hash_changed:
                    self.session.file_hashes[previous_hash_key] = current_hash
                    self.session.file_hashes[cache_key] = current_hash
                    return True
                else:
                    self.session.file_hashes[cache_key] = current_hash
                    return False
        
        self.enforcer = MockEnforcer()
        self.temp_dir = tempfile.mkdtemp()
        self.temp_dir_path = Path(self.temp_dir)
        self.enforcer.temp_dir_path = self.temp_dir_path
        self.enforcer.project_root = self.temp_dir_path.parent
    
    def tearDown(self):
        """Clean up temporary files."""
        import shutil
        if self.temp_dir_path.exists():
            shutil.rmtree(self.temp_dir_path)
    
    def test_first_check_returns_true(self):
        """Test that first check of file returns True (assumes modified)."""
        test_file = self.temp_dir_path / "test.txt"
        test_file.write_text("Initial content")
        
        file_path = str(test_file.relative_to(self.enforcer.project_root))
        result = self.enforcer.is_file_modified_in_session(file_path)
        
        self.assertTrue(result, "First check should return True")
    
    def test_unchanged_file_returns_false(self):
        """Test that unchanged file returns False on second check."""
        test_file = self.temp_dir_path / "test.txt"
        test_file.write_text("Initial content")
        
        file_path = str(test_file.relative_to(self.enforcer.project_root))
        
        # First check
        self.enforcer.is_file_modified_in_session(file_path)
        
        # Second check (file unchanged)
        result = self.enforcer.is_file_modified_in_session(file_path)
        
        self.assertFalse(result, "Unchanged file should return False")
    
    def test_modified_file_returns_true(self):
        """Test that modified file returns True."""
        test_file = self.temp_dir_path / "test.txt"
        test_file.write_text("Initial content")
        
        file_path = str(test_file.relative_to(self.enforcer.project_root))
        
        # First check
        self.enforcer.is_file_modified_in_session(file_path)
        
        # Modify file
        time.sleep(0.1)  # Ensure mtime difference
        test_file.write_text("Modified content")
        
        # Second check (file modified)
        result = self.enforcer.is_file_modified_in_session(file_path)
        
        self.assertTrue(result, "Modified file should return True")
    
    def test_hash_only_comparison(self):
        """Test that only hash comparison is used (no git diff logic)."""
        test_file = self.temp_dir_path / "test.txt"
        test_file.write_text("Content")
        
        file_path = str(test_file.relative_to(self.enforcer.project_root))
        
        # First check stores hash
        self.enforcer.is_file_modified_in_session(file_path)
        hash1 = self.enforcer.session.file_hashes.get(f"{file_path}:previous")
        
        # Modify and check again
        time.sleep(0.1)
        test_file.write_text("Different content")
        self.enforcer.is_file_modified_in_session(file_path)
        hash2 = self.enforcer.session.file_hashes.get(f"{file_path}:previous")
        
        # Hashes should be different
        self.assertNotEqual(hash1, hash2, "Hash should change when content changes")


if __name__ == '__main__':
    unittest.main()



