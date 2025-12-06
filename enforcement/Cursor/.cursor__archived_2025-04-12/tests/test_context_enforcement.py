#!/usr/bin/env python3
"""
Tests for context management enforcement.

Tests:
- Context-ID verification
- Required context loading
- Context unloading verification
- Context state validity

Last Updated: 2025-12-04
"""

import unittest
import tempfile
import json
import uuid
from pathlib import Path
from datetime import datetime, timezone, timedelta
from unittest.mock import Mock, patch, MagicMock

# Add project root to path
import sys
project_root = Path(__file__).parent.parent.parent
sys.path.insert(0, str(project_root))

from scripts.auto_enforcer import VeroFieldEnforcer, ViolationSeverity, PREDICTIVE_CONTEXT_AVAILABLE


class TestContextEnforcement(unittest.TestCase):
    """Test context management enforcement."""
    
    def setUp(self):
        """Set up test fixtures."""
        self.temp_dir = tempfile.mkdtemp()
        self.project_root = Path(self.temp_dir)
        
        # Create necessary directories
        (self.project_root / ".cursor" / "context_manager").mkdir(parents=True, exist_ok=True)
        (self.project_root / ".cursor" / "enforcement").mkdir(parents=True, exist_ok=True)
        
        # Initialize enforcer
        self.enforcer = VeroFieldEnforcer(project_root=self.project_root)
    
    def tearDown(self):
        """Clean up test fixtures."""
        import shutil
        shutil.rmtree(self.temp_dir, ignore_errors=True)
    
    def test_context_id_verification_success(self):
        """Test context-ID verification when recommendations.md exists and is recent."""
        if not PREDICTIVE_CONTEXT_AVAILABLE:
            self.skipTest("Predictive context management not available")
        
        recommendations_file = self.project_root / ".cursor" / "context_manager" / "recommendations.md"
        context_id = str(uuid.uuid4())
        
        # Create recommendations.md with context-id
        recommendations_file.write_text(f"""# Context Recommendations

<!-- context-id: {context_id} -->

**Context-ID:** {context_id}
""")
        
        # Verify context-id match
        match, latest_id = self.enforcer._verify_context_id_match()
        
        self.assertTrue(match)
        self.assertEqual(latest_id, context_id)
    
    def test_context_id_verification_missing_file(self):
        """Test context-ID verification when recommendations.md doesn't exist."""
        if not PREDICTIVE_CONTEXT_AVAILABLE:
            self.skipTest("Predictive context management not available")
        
        # Verify context-id match (file doesn't exist)
        match, latest_id = self.enforcer._verify_context_id_match()
        
        self.assertFalse(match)
        self.assertIsNone(latest_id)
    
    def test_context_id_verification_stale_file(self):
        """Test context-ID verification when recommendations.md is stale (>5 minutes)."""
        if not PREDICTIVE_CONTEXT_AVAILABLE:
            self.skipTest("Predictive context management not available")
        
        recommendations_file = self.project_root / ".cursor" / "context_manager" / "recommendations.md"
        context_id = str(uuid.uuid4())
        
        # Create recommendations.md with context-id
        recommendations_file.write_text(f"""# Context Recommendations

<!-- context-id: {context_id} -->
""")
        
        # Make file stale (6 minutes ago)
        stale_time = datetime.now(timezone.utc) - timedelta(minutes=6)
        import os
        os.utime(recommendations_file, (stale_time.timestamp(), stale_time.timestamp()))
        
        # Verify context-id match (should fail due to stale file)
        match, latest_id = self.enforcer._verify_context_id_match()
        
        self.assertFalse(match)
        self.assertEqual(latest_id, context_id)  # ID extracted but file is stale
    
    def test_context_state_validity_valid(self):
        """Test context state validity check with valid state file."""
        if not PREDICTIVE_CONTEXT_AVAILABLE:
            self.skipTest("Predictive context management not available")
        
        context_state_file = self.project_root / ".cursor" / "context_manager" / "context_state.json"
        
        # Create valid state file
        state = {
            "active": ["@file1.md", "@file2.md"],
            "preloaded": ["@file3.md"]
        }
        context_state_file.write_text(json.dumps(state))
        
        # Verify validity
        is_valid = self.enforcer._check_context_state_validity()
        
        self.assertTrue(is_valid)
        self.assertEqual(len(self.enforcer.violations), 0)
    
    def test_context_state_validity_missing_file(self):
        """Test context state validity check when file doesn't exist."""
        if not PREDICTIVE_CONTEXT_AVAILABLE:
            self.skipTest("Predictive context management not available")
        
        # Verify validity (file doesn't exist - should be valid for first run)
        is_valid = self.enforcer._check_context_state_validity()
        
        self.assertTrue(is_valid)
        self.assertEqual(len(self.enforcer.violations), 0)
    
    def test_context_state_validity_invalid_structure(self):
        """Test context state validity check with invalid structure."""
        if not PREDICTIVE_CONTEXT_AVAILABLE:
            self.skipTest("Predictive context management not available")
        
        context_state_file = self.project_root / ".cursor" / "context_manager" / "context_state.json"
        
        # Create invalid state file (not a dict)
        context_state_file.write_text("invalid json")
        
        # Verify validity (should fail)
        is_valid = self.enforcer._check_context_state_validity()
        
        self.assertFalse(is_valid)
        self.assertGreater(len(self.enforcer.violations), 0)
        self.assertEqual(self.enforcer.violations[0].severity, ViolationSeverity.BLOCKED)
    
    def test_get_previous_context_state(self):
        """Test getting previous context state."""
        if not PREDICTIVE_CONTEXT_AVAILABLE:
            self.skipTest("Predictive context management not available")
        
        context_state_file = self.project_root / ".cursor" / "context_manager" / "context_state.json"
        
        # Create state file
        state = {
            "active": ["@file1.md", "@file2.md"],
            "preloaded": ["@file3.md"]
        }
        context_state_file.write_text(json.dumps(state))
        
        # Get previous state
        prev_state = self.enforcer._get_previous_context_state()
        
        self.assertEqual(prev_state["active"], ["@file1.md", "@file2.md"])
        self.assertEqual(prev_state["preloaded"], ["@file3.md"])
    
    def test_get_expected_preloaded_context(self):
        """Test getting expected pre-loaded context from recommendations.md."""
        if not PREDICTIVE_CONTEXT_AVAILABLE:
            self.skipTest("Predictive context management not available")
        
        recommendations_file = self.project_root / ".cursor" / "context_manager" / "recommendations.md"
        
        # Create recommendations.md with pre-loaded context
        recommendations_file.write_text("""# Context Recommendations

### Pre-loaded Context

- `@file1.md` (HIGH - Pre-loaded for predicted task)
- `@file2.md` (HIGH - Pre-loaded for predicted task)
""")
        
        # Get expected pre-loaded context
        expected = self.enforcer._get_expected_preloaded_context()
        
        self.assertIn("@file1.md", expected)
        self.assertIn("@file2.md", expected)
    
    def test_infer_language_from_files(self):
        """Test language inference from file paths."""
        # Test Python files
        language = self.enforcer._infer_language_from_files(["test.py", "module.pyi"])
        self.assertEqual(language, "python")
        
        # Test TypeScript files
        language = self.enforcer._infer_language_from_files(["test.ts", "component.tsx"])
        self.assertEqual(language, "typescript")
        
        # Test unknown files
        language = self.enforcer._infer_language_from_files(["test.md", "readme.txt"])
        self.assertIsNone(language)
    
    def test_pre_flight_check(self):
        """Test pre-flight check."""
        if not PREDICTIVE_CONTEXT_AVAILABLE:
            self.skipTest("Predictive context management not available")
        
        # Test with valid state (no state file - should pass)
        result = self.enforcer._pre_flight_check()
        self.assertTrue(result)
        
        # Test with invalid state
        context_state_file = self.project_root / ".cursor" / "context_manager" / "context_state.json"
        context_state_file.write_text("invalid json")
        
        result = self.enforcer._pre_flight_check()
        self.assertFalse(result)


if __name__ == "__main__":
    unittest.main()











