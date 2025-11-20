#!/usr/bin/env python3
"""
Tests for Minimal Metadata System

Last Updated: 2025-11-19
"""

import unittest
import json
import tempfile
import shutil
from pathlib import Path
from unittest.mock import patch

import sys
sys.path.insert(0, str(Path(__file__).parent.parent))

from minimal_metadata_system import (
    SessionStateManager,
    SESSION_STATE_FILE
)


class TestMinimalMetadataSystem(unittest.TestCase):
    """Test cases for minimal metadata system."""
    
    def setUp(self):
        """Set up test fixtures."""
        self.temp_dir = tempfile.mkdtemp()
        self.state_file = Path(self.temp_dir) / "session_state.json"
        
        # Patch SESSION_STATE_FILE
        self.patcher = patch('minimal_metadata_system.SESSION_STATE_FILE', self.state_file)
        self.patcher.start()
        
        self.manager = SessionStateManager(state_file=self.state_file)
    
    def tearDown(self):
        """Clean up test fixtures."""
        self.patcher.stop()
        shutil.rmtree(self.temp_dir, ignore_errors=True)
    
    def test_register_pr(self):
        """Test registering PR with session."""
        self.manager.register_pr("999", "test-session-123", {"author": "testuser"})
        
        self.assertEqual(self.manager.get_session_for_pr("999"), "test-session-123")
        self.assertIn("999", self.manager.get_prs_for_session("test-session-123"))
    
    def test_get_prs_for_session(self):
        """Test getting PRs for a session."""
        self.manager.register_pr("998", "test-session-123")
        self.manager.register_pr("999", "test-session-123")
        
        prs = self.manager.get_prs_for_session("test-session-123")
        self.assertEqual(len(prs), 2)
        self.assertIn("998", prs)
        self.assertIn("999", prs)
    
    def test_remove_pr(self):
        """Test removing PR from session."""
        self.manager.register_pr("999", "test-session-123")
        self.manager.remove_pr("999")
        
        self.assertIsNone(self.manager.get_session_for_pr("999"))
        self.assertNotIn("999", self.manager.get_prs_for_session("test-session-123"))
    
    def test_clear_session(self):
        """Test clearing a session."""
        self.manager.register_pr("998", "test-session-123")
        self.manager.register_pr("999", "test-session-123")
        self.manager.clear_session("test-session-123")
        
        self.assertIsNone(self.manager.get_session_for_pr("998"))
        self.assertIsNone(self.manager.get_session_for_pr("999"))
        self.assertEqual(len(self.manager.get_prs_for_session("test-session-123")), 0)


if __name__ == "__main__":
    unittest.main()








