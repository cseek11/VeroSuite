#!/usr/bin/env python3
"""
Unit tests for ThresholdChecker.

Last Updated: 2025-12-04
"""

import unittest
from unittest.mock import Mock, MagicMock
from datetime import datetime, timezone, timedelta

import sys
from pathlib import Path

# Add project root to path
project_root = Path(__file__).parent.parent.parent.parent.parent
sys.path.insert(0, str(project_root))

from veroscore_v3.threshold_checker import ThresholdChecker
from veroscore_v3.session_manager import SessionManager


class TestThresholdChecker(unittest.TestCase):
    """Test cases for ThresholdChecker."""
    
    def setUp(self):
        """Set up test fixtures."""
        # Mock Supabase client
        self.mock_supabase = Mock()
        self.mock_supabase.table = Mock(return_value=Mock())
        
        # Mock SessionManager
        self.mock_session_manager = Mock(spec=SessionManager)
        self.mock_session_manager.supabase = self.mock_supabase
        
        # Default config
        self.config = {
            "thresholds": {
                "min_files": 3,
                "min_lines": 50,
                "max_wait_seconds": 300,
                "batch_size": 10
            }
        }
        
        self.checker = ThresholdChecker(self.config, self.mock_session_manager)
    
    def test_file_count_threshold(self):
        """Test file count threshold check."""
        # Mock session with enough files
        mock_session = {
            "session_id": "test-session",
            "total_files": 5,
            "total_lines_added": 0,
            "total_lines_removed": 0,
            "last_activity": datetime.now(timezone.utc).isoformat()
        }
        
        # Mock get_session_data
        self.checker._get_session_data = Mock(return_value=mock_session)
        self.checker._get_pending_changes_count = Mock(return_value=0)
        
        should_create, reason = self.checker.should_create_pr("test-session")
        
        self.assertTrue(should_create)
        self.assertIn("file count", reason.lower())
    
    def test_line_count_threshold(self):
        """Test line count threshold check."""
        # Mock session with enough lines
        mock_session = {
            "session_id": "test-session",
            "total_files": 1,
            "total_lines_added": 30,
            "total_lines_removed": 25,
            "last_activity": datetime.now(timezone.utc).isoformat()
        }
        
        self.checker._get_session_data = Mock(return_value=mock_session)
        self.checker._get_pending_changes_count = Mock(return_value=0)
        
        should_create, reason = self.checker.should_create_pr("test-session")
        
        self.assertTrue(should_create)
        self.assertIn("line count", reason.lower())
    
    def test_time_threshold(self):
        """Test time-based threshold check."""
        # Mock session with old last_activity
        old_time = (datetime.now(timezone.utc) - timedelta(seconds=400)).isoformat()
        mock_session = {
            "session_id": "test-session",
            "total_files": 1,
            "total_lines_added": 10,
            "total_lines_removed": 5,
            "last_activity": old_time
        }
        
        self.checker._get_session_data = Mock(return_value=mock_session)
        self.checker._get_pending_changes_count = Mock(return_value=0)
        
        should_create, reason = self.checker.should_create_pr("test-session")
        
        self.assertTrue(should_create)
        self.assertIn("time", reason.lower())
    
    def test_batch_size_threshold(self):
        """Test batch size threshold check."""
        # Mock session with pending changes
        mock_session = {
            "session_id": "test-session",
            "total_files": 1,
            "total_lines_added": 10,
            "total_lines_removed": 5,
            "last_activity": datetime.now(timezone.utc).isoformat()
        }
        
        self.checker._get_session_data = Mock(return_value=mock_session)
        self.checker._get_pending_changes_count = Mock(return_value=15)
        
        should_create, reason = self.checker.should_create_pr("test-session")
        
        self.assertTrue(should_create)
        self.assertIn("batch", reason.lower())
    
    def test_thresholds_not_met(self):
        """Test when thresholds are not met."""
        # Mock session below all thresholds
        mock_session = {
            "session_id": "test-session",
            "total_files": 1,
            "total_lines_added": 10,
            "total_lines_removed": 5,
            "last_activity": datetime.now(timezone.utc).isoformat()
        }
        
        self.checker._get_session_data = Mock(return_value=mock_session)
        self.checker._get_pending_changes_count = Mock(return_value=2)
        
        should_create, reason = self.checker.should_create_pr("test-session")
        
        self.assertFalse(should_create)
        self.assertIn("not met", reason.lower())
    
    def test_session_not_found(self):
        """Test when session is not found."""
        self.checker._get_session_data = Mock(return_value=None)
        
        should_create, reason = self.checker.should_create_pr("nonexistent-session")
        
        self.assertFalse(should_create)
        self.assertIn("not found", reason.lower())


if __name__ == '__main__':
    unittest.main()



