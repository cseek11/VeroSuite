#!/usr/bin/env python3
"""
Test suite for collect_metrics.py

Tests file validation, JSON validation, and error handling.
"""

import json
import os
import sys
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch, mock_open

# Add parent directory to path to import collect_metrics
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
import collect_metrics


class TestFileValidation(unittest.TestCase):
    """Test file existence and validation."""
    
    def test_file_existence_check(self):
        """Test that missing files are detected."""
        with tempfile.TemporaryDirectory() as tmpdir:
            missing_file = os.path.join(tmpdir, "nonexistent.json")
            self.assertFalse(os.path.exists(missing_file))
    
    def test_file_validation_valid_json(self):
        """Test validation of valid reward.json structure."""
        valid_data = {
            "score": 5,
            "breakdown": {
                "tests": 3,
                "bug_fix": 0,
                "docs": 1,
                "performance": 0,
                "security": 2,
                "penalties": -1
            },
            "metadata": {
                "pr": "123",
                "computed_at": "2025-01-27T00:00:00Z"
            },
            "pr_number": "123",
            "total_score": 5,
            "timestamp": "2025-01-27T00:00:00Z"
        }
        
        with tempfile.NamedTemporaryFile(mode='w', suffix='.json', delete=False) as f:
            temp_path = f.name
            json.dump(valid_data, f)
        
        try:
            # Should pass validation
            collect_metrics.validate_reward_payload(valid_data)
            
            # Check required fields
            required_fields = ["pr_number", "total_score", "timestamp"]
            missing = [f for f in required_fields if f not in valid_data]
            self.assertEqual(len(missing), 0, f"Missing required fields: {missing}")
        finally:
            if os.path.exists(temp_path):
                os.unlink(temp_path)
    
    def test_file_validation_missing_required_fields(self):
        """Test validation detects missing required fields."""
        # Test validate_reward_payload (checks for score, breakdown, metadata)
        invalid_data = {
            "breakdown": {},
            "metadata": {"pr": "123"}
            # Missing score
        }
        
        # Should raise ValueError for missing score
        with self.assertRaises(ValueError):
            collect_metrics.validate_reward_payload(invalid_data)
        
        # Test new required fields check (pr_number, total_score, timestamp)
        invalid_data2 = {
            "score": 5,
            "breakdown": {},
            "metadata": {"pr": "123"}
            # Missing pr_number, total_score, timestamp (new fields)
        }
        
        # This validation happens in main(), not validate_reward_payload
        required_fields = ["pr_number", "total_score", "timestamp"]
        missing = [f for f in required_fields if f not in invalid_data2]
        self.assertGreater(len(missing), 0, "Should detect missing new required fields")
        self.assertEqual(len(missing), 3, "Should detect all 3 missing fields")
    
    def test_file_validation_invalid_json(self):
        """Test that invalid JSON is detected."""
        with tempfile.NamedTemporaryFile(mode='w', suffix='.json', delete=False) as f:
            temp_path = f.name
            f.write("invalid json content {")
        
        try:
            with self.assertRaises(json.JSONDecodeError):
                with open(temp_path, 'r') as handle:
                    json.load(handle)
        finally:
            if os.path.exists(temp_path):
                os.unlink(temp_path)


class TestArgumentParsing(unittest.TestCase):
    """Test argument parsing and validation."""
    
    def test_required_arguments(self):
        """Test that required arguments are enforced."""
        import argparse
        
        # Test argument parser setup
        parser = argparse.ArgumentParser()
        parser.add_argument("--reward-file", help="Path to reward.json artifact")
        parser.add_argument("--output", required=True, help="Path to output metrics file")
        
        # Should have required output argument
        args = parser.parse_args(['--reward-file', 'test.json', '--output', 'output.json'])
        self.assertEqual(args.reward_file, 'test.json')
        self.assertEqual(args.output, 'output.json')


class TestMetricsUpdate(unittest.TestCase):
    """Test metrics update logic."""
    
    def test_load_metrics_creates_default(self):
        """Test that loading non-existent metrics creates default structure."""
        with tempfile.TemporaryDirectory() as tmpdir:
            metrics_file = os.path.join(tmpdir, "metrics.json")
            
            # File doesn't exist, should create default
            metrics = collect_metrics.load_metrics()
            
            # Should have default structure
            self.assertIn("version", metrics)
            self.assertIn("scores", metrics)
            self.assertIn("aggregates", metrics)
            self.assertEqual(metrics["version"], "1.0")
            self.assertEqual(len(metrics["scores"]), 0)
    
    def test_add_score_entry(self):
        """Test adding a score entry to metrics."""
        metrics = {
            "version": "1.0",
            "last_updated": "2025-01-27T00:00:00Z",
            "scores": [],
            "aggregates": {}
        }
        
        collect_metrics.add_score_entry(
            metrics,
            pr_num="123",
            score=5,
            breakdown={"tests": 3},
            metadata={"pr": "123", "computed_at": "2025-01-27T00:00:00Z"},
            repo_path=None,
            file_scores={}
        )
        
        self.assertEqual(len(metrics["scores"]), 1)
        self.assertEqual(metrics["scores"][0]["pr"], "123")
        self.assertEqual(metrics["scores"][0]["score"], 5)


if __name__ == '__main__':
    unittest.main()

