#!/usr/bin/env python3
"""
Tests for Session Analytics

Last Updated: 2025-12-04
"""

import unittest
import tempfile
import shutil
import json
from pathlib import Path
from unittest.mock import patch

import sys
sys.path.insert(0, str(Path(__file__).parent.parent))

from session_analytics import (
    load_session_data,
    calculate_analytics,
    generate_report,
    SESSION_DATA_FILE,
    OUTPUT_DIR
)


class TestSessionAnalytics(unittest.TestCase):
    """Test cases for session analytics."""
    
    def setUp(self):
        """Set up test fixtures."""
        self.temp_dir = tempfile.mkdtemp()
        self.session_data_path = Path(self.temp_dir) / "auto_pr_sessions.json"
        self.output_dir = Path(self.temp_dir) / "analytics"
        
        self.session_patcher = patch('session_analytics.SESSION_DATA_FILE', self.session_data_path)
        self.output_patcher = patch('session_analytics.OUTPUT_DIR', self.output_dir)
        self.session_patcher.start()
        self.output_patcher.start()
        
        # Create sample session data
        self.sample_data = {
            "version": "1.0",
            "last_updated": "2025-11-19T14:30:00",
            "active_sessions": {},
            "completed_sessions": [
                {
                    "session_id": "alice-20251119-1430",
                    "author": "alice",
                    "prs": ["326", "327"],
                    "duration_minutes": 45,
                    "final_score": 5.5,
                    "completion_trigger": "explicit_marker"
                }
            ]
        }
        
        with open(self.session_data_path, 'w') as f:
            json.dump(self.sample_data, f)
    
    def tearDown(self):
        """Clean up test fixtures."""
        self.session_patcher.stop()
        self.output_patcher.stop()
        shutil.rmtree(self.temp_dir, ignore_errors=True)
    
    def test_load_session_data(self):
        """Test loading session data."""
        data = load_session_data()
        self.assertIn("completed_sessions", data)
        self.assertEqual(len(data["completed_sessions"]), 1)
    
    def test_calculate_analytics(self):
        """Test calculating analytics."""
        analytics = calculate_analytics(self.sample_data)
        
        self.assertIn("summary", analytics)
        self.assertIn("authors", analytics)
        self.assertEqual(analytics["summary"]["total_completed"], 1)
    
    def test_generate_report(self):
        """Test generating report."""
        report = generate_report()
        self.assertIn("Auto-PR Session Analytics", report)
        self.assertIn("alice", report)
    
    def test_empty_sessions(self):
        """Test analytics with no completed sessions."""
        empty_data = {
            "version": "1.0",
            "active_sessions": {},
            "completed_sessions": []
        }
        
        analytics = calculate_analytics(empty_data)
        self.assertIn("error", analytics)


if __name__ == "__main__":
    unittest.main()








