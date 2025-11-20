#!/usr/bin/env python3
"""
Tests for Auto-PR Session Manager

Last Updated: 2025-11-19
"""

import unittest
import json
import tempfile
import shutil
from pathlib import Path
from datetime import datetime, timedelta
from unittest.mock import patch, MagicMock

import sys
sys.path.insert(0, str(Path(__file__).parent.parent))

from auto_pr_session_manager import (
    AutoPRSessionManager,
    SessionConfig,
    Session,
    CONFIG_FILE,
    SESSION_DATA_FILE
)


class TestAutoPRSessionManager(unittest.TestCase):
    """Test cases for AutoPRSessionManager."""
    
    def setUp(self):
        """Set up test fixtures."""
        self.temp_dir = tempfile.mkdtemp()
        self.config_path = Path(self.temp_dir) / "session_config.yaml"
        self.session_data_path = Path(self.temp_dir) / "auto_pr_sessions.json"
        
        # Patch paths
        self.config_patcher = patch('auto_pr_session_manager.CONFIG_FILE', self.config_path)
        self.session_patcher = patch('auto_pr_session_manager.SESSION_DATA_FILE', self.session_data_path)
        self.config_patcher.start()
        self.session_patcher.start()
        
        # Create manager
        self.manager = AutoPRSessionManager(config_path=self.config_path)
    
    def tearDown(self):
        """Clean up test fixtures."""
        self.config_patcher.stop()
        self.session_patcher.stop()
        shutil.rmtree(self.temp_dir, ignore_errors=True)
    
    def test_load_config_default(self):
        """Test loading default configuration."""
        config = self.manager.load_config(self.config_path)
        self.assertIsInstance(config, SessionConfig)
        self.assertEqual(config.timeout_minutes, 30)
        self.assertIsNotNone(config.auto_pr_patterns)
        self.assertIsNotNone(config.completion_markers)
    
    def test_is_auto_pr_title_pattern(self):
        """Test auto-PR detection via title pattern."""
        self.assertTrue(self.manager.is_auto_pr("auto-pr: add tests", "", [], 0))
        self.assertTrue(self.manager.is_auto_pr("wip: feature", "", [], 0))
        self.assertFalse(self.manager.is_auto_pr("Feature: Add new functionality", "", [], 10))
    
    def test_is_auto_pr_session_metadata(self):
        """Test auto-PR detection via session metadata."""
        pr_body = "Some changes\n[cursor-session: test-123]"
        self.assertTrue(self.manager.is_auto_pr("Regular PR", pr_body, [], 0))
    
    def test_extract_session_id_from_body(self):
        """Test extracting session ID from PR body."""
        pr_body = "Changes\n[cursor-session: test-session-123]"
        session_id = self.manager.extract_session_id("PR Title", pr_body, "testuser", datetime.now())
        self.assertEqual(session_id, "test-session-123")
    
    def test_extract_session_id_generated(self):
        """Test generating new session ID."""
        timestamp = datetime(2025, 11, 19, 14, 30)
        session_id = self.manager.extract_session_id("PR Title", "", "alice", timestamp)
        self.assertEqual(session_id, "alice-20251119-1430")
    
    def test_add_to_session_new(self):
        """Test adding PR to new session."""
        pr_data = {
            "pr_number": "999",
            "pr_title": "auto-pr: test",
            "pr_body": "",
            "author": "testuser",
            "timestamp": datetime.now().isoformat(),
            "files_changed": 3
        }
        
        should_skip, session_id, session_data = self.manager.add_to_session("999", pr_data)
        
        self.assertTrue(should_skip)
        self.assertIsNotNone(session_id)
        self.assertEqual(len(session_data["prs"]), 1)
        self.assertIn("999", session_data["prs"])
    
    def test_add_to_session_existing(self):
        """Test adding PR to existing session."""
        # Create initial session
        pr_data1 = {
            "pr_number": "998",
            "pr_title": "auto-pr: test 1",
            "pr_body": "",
            "author": "testuser",
            "timestamp": datetime.now().isoformat(),
            "files_changed": 2
        }
        should_skip1, session_id, _ = self.manager.add_to_session("998", pr_data1)
        
        # Add second PR to same session
        pr_data2 = {
            "pr_number": "999",
            "pr_title": "auto-pr: test 2",
            "pr_body": "",
            "author": "testuser",
            "timestamp": datetime.now().isoformat(),
            "files_changed": 3
        }
        should_skip2, session_id2, session_data = self.manager.add_to_session("999", pr_data2, session_id)
        
        self.assertEqual(session_id, session_id2)
        self.assertEqual(len(session_data["prs"]), 2)
        self.assertIn("998", session_data["prs"])
        self.assertIn("999", session_data["prs"])
    
    def test_should_complete_session_explicit_marker(self):
        """Test session completion via explicit marker."""
        # Create session
        pr_data = {
            "pr_number": "999",
            "pr_title": "auto-pr: ready for review",
            "pr_body": "",
            "author": "testuser",
            "timestamp": datetime.now().isoformat(),
            "files_changed": 3
        }
        should_skip, session_id, _ = self.manager.add_to_session("999", pr_data)
        
        should_complete, trigger = self.manager.should_complete_session(session_id, pr_data)
        self.assertTrue(should_complete)
        self.assertIn("explicit_marker", trigger)
    
    def test_complete_session(self):
        """Test completing a session."""
        # Create and add PR to session
        pr_data = {
            "pr_number": "999",
            "pr_title": "auto-pr: test",
            "pr_body": "",
            "author": "testuser",
            "timestamp": datetime.now().isoformat(),
            "files_changed": 3
        }
        should_skip, session_id, _ = self.manager.add_to_session("999", pr_data)
        
        # Complete session
        completed = self.manager.complete_session(session_id, trigger="test")
        
        self.assertEqual(completed["session_id"], session_id)
        self.assertEqual(completed["status"], "completed")
        self.assertIn("completed", completed)
        self.assertIn("duration_minutes", completed)
        
        # Verify moved to completed
        self.assertNotIn(session_id, self.manager.sessions["active_sessions"])
        self.assertEqual(len(self.manager.sessions["completed_sessions"]), 1)
    
    def test_cleanup_orphaned_sessions(self):
        """Test cleanup of orphaned sessions."""
        # Create old session
        old_timestamp = datetime.now() - timedelta(hours=25)
        pr_data = {
            "pr_number": "999",
            "pr_title": "auto-pr: test",
            "pr_body": "",
            "author": "testuser",
            "timestamp": old_timestamp.isoformat(),
            "files_changed": 3
        }
        should_skip, session_id, session_data = self.manager.add_to_session("999", pr_data)
        # Manually set old last_activity
        session_data["last_activity"] = old_timestamp.isoformat()
        self.manager.save_sessions()
        
        # Run cleanup
        completed = self.manager.cleanup_orphaned_sessions(max_age_hours=24)
        
        self.assertIn(session_id, completed)
        self.assertNotIn(session_id, self.manager.sessions["active_sessions"])


class TestSessionConfig(unittest.TestCase):
    """Test cases for SessionConfig."""
    
    def test_default_values(self):
        """Test default configuration values."""
        config = SessionConfig()
        self.assertEqual(config.timeout_minutes, 30)
        self.assertEqual(config.idle_warning_minutes, 15)
        self.assertIsNotNone(config.auto_pr_patterns)
        self.assertIsNotNone(config.completion_markers)
    
    def test_custom_values(self):
        """Test custom configuration values."""
        config = SessionConfig(
            timeout_minutes=60,
            enable_timeout_completion=False
        )
        self.assertEqual(config.timeout_minutes, 60)
        self.assertFalse(config.enable_timeout_completion)


if __name__ == "__main__":
    unittest.main()

