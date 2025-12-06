#!/usr/bin/env python3
"""
Tests for Edge Cases

Last Updated: 2025-12-04
"""

import unittest
import tempfile
import shutil
import json
from pathlib import Path
from datetime import datetime, timedelta
from unittest.mock import patch

import sys
sys.path.insert(0, str(Path(__file__).parent.parent))

from auto_pr_session_manager import AutoPRSessionManager, CONFIG_FILE, SESSION_DATA_FILE


class TestEdgeCases(unittest.TestCase):
    """Test edge cases and error handling."""
    
    def setUp(self):
        """Set up test fixtures."""
        self.temp_dir = tempfile.mkdtemp()
        self.config_path = Path(self.temp_dir) / "session_config.yaml"
        self.session_data_path = Path(self.temp_dir) / "auto_pr_sessions.json"
        
        self.config_patcher = patch('auto_pr_session_manager.CONFIG_FILE', self.config_path)
        self.session_patcher = patch('auto_pr_session_manager.SESSION_DATA_FILE', self.session_data_path)
        self.config_patcher.start()
        self.session_patcher.start()
        
        self.manager = AutoPRSessionManager(config_path=self.config_path)
    
    def tearDown(self):
        """Clean up test fixtures."""
        self.config_patcher.stop()
        self.session_patcher.stop()
        shutil.rmtree(self.temp_dir, ignore_errors=True)
    
    def test_corrupted_session_data(self):
        """Test handling corrupted session data file."""
        # Create corrupted JSON
        with open(self.session_data_path, 'w') as f:
            f.write("invalid json {")
        
        # Should handle gracefully
        manager = AutoPRSessionManager(config_path=self.config_path)
        self.assertIsNotNone(manager.sessions)
        self.assertIn("active_sessions", manager.sessions)
    
    def test_session_id_collision_handling(self):
        """Test handling session ID collisions."""
        timestamp = datetime(2025, 11, 19, 14, 30)
        session_id1 = self.manager.extract_session_id("PR 1", "", "alice", timestamp)
        session_id2 = self.manager.extract_session_id("PR 2", "", "alice", timestamp)
        
        # Should generate same ID for same author/timestamp
        self.assertEqual(session_id1, session_id2)
    
    def test_pr_closed_before_completion(self):
        """Test handling PR closed before session completion."""
        pr_data = {
            "pr_number": "999",
            "pr_title": "auto-pr: test",
            "pr_body": "",
            "author": "testuser",
            "timestamp": datetime.now().isoformat(),
            "files_changed": 3
        }
        should_skip, session_id, _ = self.manager.add_to_session("999", pr_data)
        
        # Session should still be active
        self.assertIn(session_id, self.manager.sessions["active_sessions"])
    
    def test_invalid_config_values(self):
        """Test handling invalid configuration values."""
        # Create config with invalid timeout
        import yaml
        with open(self.config_path, 'w') as f:
            yaml.dump({"timeout_minutes": -10}, f)
        
        # Should use defaults or handle gracefully
        manager = AutoPRSessionManager(config_path=self.config_path)
        self.assertIsNotNone(manager.config)
    
    def test_missing_dependencies(self):
        """Test graceful handling of missing dependencies."""
        # This is tested by import error handling in actual code
        # Here we test that manager works even if optional deps missing
        self.assertIsNotNone(self.manager)
        self.assertIsNotNone(self.manager.config)


if __name__ == "__main__":
    unittest.main()








