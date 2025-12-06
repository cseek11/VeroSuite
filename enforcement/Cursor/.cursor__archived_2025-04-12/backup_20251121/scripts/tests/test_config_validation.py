#!/usr/bin/env python3
"""
Tests for Configuration Validation

Last Updated: 2025-12-04
"""

import unittest
import tempfile
import shutil
import yaml
from pathlib import Path
from unittest.mock import patch

import sys
sys.path.insert(0, str(Path(__file__).parent.parent))

from validate_config import (
    validate_config,
    validate_yaml_syntax,
    validate_required_fields,
    validate_timeout_values,
    validate_regex_patterns,
    CONFIG_FILE
)


class TestConfigValidation(unittest.TestCase):
    """Test cases for configuration validation."""
    
    def setUp(self):
        """Set up test fixtures."""
        self.temp_dir = tempfile.mkdtemp()
        self.config_file = Path(self.temp_dir) / "session_config.yaml"
    
    def tearDown(self):
        """Clean up test fixtures."""
        shutil.rmtree(self.temp_dir, ignore_errors=True)
    
    def test_validate_yaml_syntax_valid(self):
        """Test valid YAML syntax."""
        with open(self.config_file, 'w') as f:
            yaml.dump({"timeout_minutes": 30}, f)
        
        is_valid, error = validate_yaml_syntax(self.config_file)
        self.assertTrue(is_valid)
        self.assertEqual(error, "")
    
    def test_validate_yaml_syntax_invalid(self):
        """Test invalid YAML syntax."""
        with open(self.config_file, 'w') as f:
            f.write("invalid: yaml: [")
        
        is_valid, error = validate_yaml_syntax(self.config_file)
        self.assertFalse(is_valid)
        self.assertIn("Invalid YAML", error)
    
    def test_validate_required_fields(self):
        """Test required fields validation."""
        config = {
            "timeout_minutes": 30,
            "idle_warning_minutes": 15,
            "auto_pr_patterns": [],
            "completion_markers": [],
            "min_files_for_manual": 5,
            "enable_timeout_completion": True,
            "enable_heuristic_completion": True
        }
        
        is_valid, missing = validate_required_fields(config)
        self.assertTrue(is_valid)
        self.assertEqual(len(missing), 0)
    
    def test_validate_timeout_values(self):
        """Test timeout values validation."""
        # Valid values
        config = {"timeout_minutes": 30, "idle_warning_minutes": 15}
        is_valid, errors = validate_timeout_values(config)
        self.assertTrue(is_valid)
        
        # Invalid timeout
        config = {"timeout_minutes": 200, "idle_warning_minutes": 15}
        is_valid, errors = validate_timeout_values(config)
        self.assertFalse(is_valid)
    
    def test_validate_regex_patterns(self):
        """Test regex patterns validation."""
        # Valid patterns
        config = {"auto_pr_patterns": ["^auto-pr:", "^wip:"]}
        is_valid, errors = validate_regex_patterns(config)
        self.assertTrue(is_valid)
        
        # Invalid pattern
        config = {"auto_pr_patterns": ["[invalid("]}
        is_valid, errors = validate_regex_patterns(config)
        self.assertFalse(is_valid)


if __name__ == "__main__":
    unittest.main()








