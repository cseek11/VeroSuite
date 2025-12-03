#!/usr/bin/env python3
"""
Unit tests for ChangeBuffer.

Last Updated: 2025-11-24
"""

import unittest
import time
from datetime import datetime, timezone

import sys
from pathlib import Path

# Add project root to path
project_root = Path(__file__).parent.parent.parent.parent.parent
sys.path.insert(0, str(project_root))

from veroscore_v3.change_buffer import ChangeBuffer
from veroscore_v3.file_change import FileChange


class TestChangeBuffer(unittest.TestCase):
    """Test cases for ChangeBuffer."""
    
    def setUp(self):
        """Set up test fixtures."""
        self.buffer = ChangeBuffer(debounce_seconds=0.1)  # Short debounce for testing
    
    def test_add_change(self):
        """Test adding a change to buffer."""
        change = FileChange(
            path="test.py",
            change_type="modified",
            timestamp=datetime.now(timezone.utc).isoformat()
        )
        
        self.buffer.add_change(change)
        
        self.assertEqual(self.buffer.count(), 1)
    
    def test_debouncing(self):
        """Test that rapid changes to same file are debounced."""
        change1 = FileChange(
            path="test.py",
            change_type="modified",
            timestamp=datetime.now(timezone.utc).isoformat()
        )
        
        change2 = FileChange(
            path="test.py",
            change_type="modified",
            timestamp=datetime.now(timezone.utc).isoformat(),
            lines_added=10
        )
        
        # Add first change
        self.buffer.add_change(change1)
        self.assertEqual(self.buffer.count(), 1)
        
        # Add second change quickly (should replace first)
        self.buffer.add_change(change2)
        self.assertEqual(self.buffer.count(), 1)  # Still only one (replaced)
        
        # Wait for debounce period
        time.sleep(0.15)
        
        # Get all changes
        changes = self.buffer.get_all()
        self.assertEqual(len(changes), 1)
        self.assertEqual(changes[0].lines_added, 10)  # Should have latest change
    
    def test_multiple_files(self):
        """Test adding changes to multiple files."""
        change1 = FileChange(
            path="file1.py",
            change_type="modified",
            timestamp=datetime.now(timezone.utc).isoformat()
        )
        
        change2 = FileChange(
            path="file2.py",
            change_type="added",
            timestamp=datetime.now(timezone.utc).isoformat()
        )
        
        self.buffer.add_change(change1)
        self.buffer.add_change(change2)
        
        self.assertEqual(self.buffer.count(), 2)
    
    def test_get_all_clears_buffer(self):
        """Test that get_all() clears the buffer."""
        change = FileChange(
            path="test.py",
            change_type="modified",
            timestamp=datetime.now(timezone.utc).isoformat()
        )
        
        self.buffer.add_change(change)
        self.assertEqual(self.buffer.count(), 1)
        
        changes = self.buffer.get_all()
        self.assertEqual(len(changes), 1)
        self.assertEqual(self.buffer.count(), 0)  # Buffer should be cleared
    
    def test_clear(self):
        """Test clearing the buffer."""
        change = FileChange(
            path="test.py",
            change_type="modified",
            timestamp=datetime.now(timezone.utc).isoformat()
        )
        
        self.buffer.add_change(change)
        self.assertEqual(self.buffer.count(), 1)
        
        self.buffer.clear()
        self.assertEqual(self.buffer.count(), 0)
    
    def test_flush_callback(self):
        """Test flush callback is called after debounce."""
        callback_called = []
        
        def flush_callback():
            callback_called.append(True)
        
        self.buffer.flush_callback = flush_callback
        
        change = FileChange(
            path="test.py",
            change_type="modified",
            timestamp=datetime.now(timezone.utc).isoformat()
        )
        
        self.buffer.add_change(change)
        
        # Wait for debounce period
        time.sleep(0.15)
        
        # Callback should have been called
        self.assertTrue(len(callback_called) > 0)


if __name__ == '__main__':
    unittest.main()



