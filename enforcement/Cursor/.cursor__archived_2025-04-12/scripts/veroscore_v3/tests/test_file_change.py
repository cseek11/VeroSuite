#!/usr/bin/env python3
"""
Unit tests for FileChange dataclass.

Last Updated: 2025-12-04
"""

import unittest
from datetime import datetime, timezone

import sys
from pathlib import Path

# Add project root to path
project_root = Path(__file__).parent.parent.parent.parent.parent
sys.path.insert(0, str(project_root))

from veroscore_v3.file_change import FileChange


class TestFileChange(unittest.TestCase):
    """Test cases for FileChange dataclass."""
    
    def test_create_file_change(self):
        """Test creating a FileChange instance."""
        change = FileChange(
            path="test.py",
            change_type="modified",
            timestamp=datetime.now(timezone.utc).isoformat(),
            lines_added=10,
            lines_removed=5
        )
        
        self.assertEqual(change.path, "test.py")
        self.assertEqual(change.change_type, "modified")
        self.assertEqual(change.lines_added, 10)
        self.assertEqual(change.lines_removed, 5)
    
    def test_invalid_change_type(self):
        """Test that invalid change_type raises ValueError."""
        with self.assertRaises(ValueError):
            FileChange(
                path="test.py",
                change_type="invalid",
                timestamp=datetime.now(timezone.utc).isoformat()
            )
    
    def test_rename_change(self):
        """Test creating a rename change with old_path."""
        change = FileChange(
            path="new_name.py",
            change_type="renamed",
            timestamp=datetime.now(timezone.utc).isoformat(),
            old_path="old_name.py"
        )
        
        self.assertEqual(change.change_type, "renamed")
        self.assertEqual(change.old_path, "old_name.py")
    
    def test_to_dict(self):
        """Test converting FileChange to dictionary."""
        change = FileChange(
            path="test.py",
            change_type="added",
            timestamp="2025-11-24T12:00:00Z",
            lines_added=20
        )
        
        data = change.to_dict()
        
        self.assertIsInstance(data, dict)
        self.assertEqual(data["path"], "test.py")
        self.assertEqual(data["change_type"], "added")
        self.assertEqual(data["lines_added"], 20)
    
    def test_from_dict(self):
        """Test creating FileChange from dictionary."""
        data = {
            "path": "test.py",
            "change_type": "deleted",
            "timestamp": "2025-11-24T12:00:00Z",
            "lines_added": 0,
            "lines_removed": 0
        }
        
        change = FileChange.from_dict(data)
        
        self.assertEqual(change.path, "test.py")
        self.assertEqual(change.change_type, "deleted")
    
    def test_equality(self):
        """Test FileChange equality comparison."""
        timestamp = datetime.now(timezone.utc).isoformat()
        
        change1 = FileChange(
            path="test.py",
            change_type="modified",
            timestamp=timestamp
        )
        
        change2 = FileChange(
            path="test.py",
            change_type="modified",
            timestamp=timestamp
        )
        
        change3 = FileChange(
            path="other.py",
            change_type="modified",
            timestamp=timestamp
        )
        
        self.assertEqual(change1, change2)
        self.assertNotEqual(change1, change3)


if __name__ == '__main__':
    unittest.main()



