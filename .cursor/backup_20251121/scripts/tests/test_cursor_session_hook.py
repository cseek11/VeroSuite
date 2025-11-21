#!/usr/bin/env python3
"""
Tests for Cursor Session Hook

Last Updated: 2025-11-19
"""

import unittest
import tempfile
import shutil
from pathlib import Path
from datetime import datetime
from unittest.mock import patch

import sys
sys.path.insert(0, str(Path(__file__).parent.parent))

from cursor_session_hook import (
    get_or_create_session_id,
    clear_session,
    format_session_metadata,
    SESSION_MARKER_FILE
)


class TestCursorSessionHook(unittest.TestCase):
    """Test cases for cursor session hooks."""
    
    def setUp(self):
        """Set up test fixtures."""
        self.temp_dir = tempfile.mkdtemp()
        self.marker_file = Path(self.temp_dir) / ".session_id"
        
        # Patch SESSION_MARKER_FILE
        self.patcher = patch('cursor_session_hook.SESSION_MARKER_FILE', self.marker_file)
        self.patcher.start()
    
    def tearDown(self):
        """Clean up test fixtures."""
        self.patcher.stop()
        shutil.rmtree(self.temp_dir, ignore_errors=True)
    
    def test_get_or_create_session_id_new(self):
        """Test creating new session ID."""
        session_id = get_or_create_session_id("testuser")
        self.assertIsNotNone(session_id)
        self.assertIn("testuser", session_id)
        self.assertTrue(self.marker_file.exists())
    
    def test_get_or_create_session_id_existing(self):
        """Test reusing existing session ID."""
        session_id1 = get_or_create_session_id("testuser")
        session_id2 = get_or_create_session_id("testuser")
        self.assertEqual(session_id1, session_id2)
    
    def test_clear_session(self):
        """Test clearing session."""
        get_or_create_session_id("testuser")
        self.assertTrue(self.marker_file.exists())
        
        clear_session()
        self.assertFalse(self.marker_file.exists())
    
    def test_format_session_metadata(self):
        """Test formatting session metadata."""
        title, metadata = format_session_metadata("test-session-123", "Test PR")
        self.assertIn("🤖", title)
        self.assertIn("test-session-123", metadata)


if __name__ == "__main__":
    unittest.main()








