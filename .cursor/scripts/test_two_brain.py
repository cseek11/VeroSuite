#!/usr/bin/env python3
"""
Test suite for Two-Brain Model implementation.

Last Updated: 2025-12-02
"""

import unittest
import json
from pathlib import Path


class TwoBrainTests(unittest.TestCase):
    """Tests for Two-Brain architecture."""
    
    def test_llm_interface_exists(self):
        """Test that LLM interface files exist."""
        files = [
            ".cursor/rules/00-llm-interface.mdc",
            ".cursor/rules/01-llm-security-lite.mdc",
            ".cursor/rules/02-llm-fix-mode.mdc"
        ]
        
        for file in files:
            self.assertTrue(Path(file).exists(), f"Missing: {file}")
    
    def test_report_generator_imports(self):
        """Test that report generator can be imported."""
        try:
            import sys
            sys.path.insert(0, str(Path(".cursor/enforcement").resolve()))
            from report_generator import EnforcerReport, Violation, AutoFix
            self.assertTrue(True, "Report generator imports successfully")
        except ImportError as e:
            self.fail(f"Could not import report generator: {e}")
    
    def test_report_schema_valid(self):
        """Test that report follows schema."""
        report_path = Path(".cursor/enforcement/ENFORCER_REPORT.json")
        
        if not report_path.exists():
            self.skipTest("No report generated yet")
        
        data = json.loads(report_path.read_text())
        
        # Check required fields
        self.assertIn("status", data)
        self.assertIn("session_id", data)
        self.assertIn("violations", data)
        self.assertIn("summary", data)
        
        # Check status is valid
        self.assertIn(data["status"], ["OK", "WARNING", "BLOCKING"])
    
    def test_memory_bank_summarizer_exists(self):
        """Test that Memory Bank summarizer exists."""
        summarizer_path = Path(".cursor/scripts/memory_summarizer.py")
        self.assertTrue(summarizer_path.exists(), "Memory Bank summarizer not found")
    
    def test_migration_scripts_exist(self):
        """Test that migration scripts exist."""
        scripts = [
            ".cursor/scripts/migration/create_structure.py",
            ".cursor/scripts/migration/move_rules.py",
        ]
        
        for script in scripts:
            self.assertTrue(Path(script).exists(), f"Missing: {script}")
    
    def test_file_watcher_exists(self):
        """Test that file watcher exists."""
        watcher_path = Path(".cursor/scripts/file_watcher.py")
        self.assertTrue(watcher_path.exists(), "File watcher not found")
    
    def test_fix_loop_exists(self):
        """Test that fix loop exists."""
        fix_loop_path = Path(".cursor/enforcement/fix_loop.py")
        self.assertTrue(fix_loop_path.exists(), "Fix loop not found")
    
    def test_llm_caller_exists(self):
        """Test that LLM caller exists."""
        caller_path = Path(".cursor/enforcement/llm_caller.py")
        self.assertTrue(caller_path.exists(), "LLM caller not found")
    
    def test_integration_module_exists(self):
        """Test that integration module exists."""
        integration_path = Path(".cursor/enforcement/two_brain_integration.py")
        self.assertTrue(integration_path.exists(), "Integration module not found")


def run_tests():
    """Run all tests."""
    loader = unittest.TestLoader()
    suite = loader.loadTestsFromTestCase(TwoBrainTests)
    runner = unittest.TextTestRunner(verbosity=2)
    result = runner.run(suite)
    
    return result.wasSuccessful()


if __name__ == "__main__":
    success = run_tests()
    exit(0 if success else 1)





