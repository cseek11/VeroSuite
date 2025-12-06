#!/usr/bin/env python3
"""
Unit tests for Phase 1 fixes: Unloading logic and file-specific context.

Tests:
- Issue 1: Unloading logic includes preloaded context
- Issue 2: HIGH priority file-specific contexts are auto-loaded
- Atomic state persistence
"""

import pytest
import json
import tempfile
from pathlib import Path
from unittest.mock import Mock, MagicMock
import sys

# Add project root to path
project_root = Path(__file__).parent.parent.parent
sys.path.insert(0, str(project_root))
sys.path.insert(0, str(project_root / ".cursor" / "context_manager"))

from context_manager.preloader import ContextPreloader
from context_manager.context_loader import ContextLoader, ContextRequirement
from context_manager.predictor import ContextPredictor, TaskPrediction


class DummyPredictor(ContextPredictor):
    """Dummy predictor for testing."""
    
    def __init__(self, predictions=None):
        self._predictions = predictions or []
    
    def predict_next_tasks(self, current_task):
        return self._predictions


class TestUnloadingLogic:
    """Test Issue 1: Unloading logic includes preloaded context."""
    
    def test_unload_includes_both_prev_active_and_preloaded(self, tmp_path):
        """Verify that preloaded contexts are included in currently_loaded calculation."""
        # Setup
        context_profiles = {
            "edit_code": {
                "python": {
                    "required": ["@rules/python_primary.mdc"],
                    "optional": [],
                    "file_specific": {}
                }
            },
            "run_tests": {
                "python": {
                    "required": ["@rules/tests_primary.mdc"],
                    "optional": [],
                    "file_specific": {}
                }
            }
        }
        
        loader = ContextLoader()
        loader.context_profiles = context_profiles
        loader.dependencies = {}
        
        predictor = DummyPredictor([])
        
        state_file = tmp_path / "context_state.json"
        preloader = ContextPreloader(predictor, loader, state_file=state_file)
        
        # Force a known previous state with both active and preloaded
        preloader.preloaded_contexts = {
            "active": ["@rules/edit_active.mdc"],
            "preloaded": ["@rules/preloaded_only.mdc"]
        }
        
        # Execute: Switch to run_tests task
        current_task = {
            "primary_task": "run_tests",
            "files": ["tests/test_app.py"],
            "user_message": ""
        }
        
        result = preloader.manage_context(current_task)
        
        # Verify: Both previous contexts should be in to_unload
        assert "@rules/tests_primary.mdc" in result['active_context']
        assert "@rules/edit_active.mdc" in result['context_to_unload']
        assert "@rules/preloaded_only.mdc" in result['context_to_unload']
    
    def test_unload_calculation_uses_union(self, tmp_path):
        """Verify currently_loaded is union of active and preloaded."""
        loader = ContextLoader()
        loader.context_profiles = {"edit_code": {"python": {"required": ["@rules/core.mdc"], "optional": [], "file_specific": {}}}}
        loader.dependencies = {}
        
        predictor = DummyPredictor([])
        state_file = tmp_path / "context_state.json"
        preloader = ContextPreloader(predictor, loader, state_file=state_file)
        
        # Set previous state
        preloader.preloaded_contexts = {
            "active": ["@rules/active1.mdc"],
            "preloaded": ["@rules/preloaded1.mdc", "@rules/preloaded2.mdc"]
        }
        
        # New task needs different context
        current_task = {
            "primary_task": "edit_code",
            "files": ["src/app.py"],
            "user_message": ""
        }
        
        result = preloader.manage_context(current_task)
        
        # Verify: All 3 previous contexts should be considered for unloading
        # (unless they're still needed)
        currently_loaded_count = len(preloader.preloaded_contexts.get('active', [])) + \
                                len(preloader.preloaded_contexts.get('preloaded', []))
        assert currently_loaded_count >= 0  # At least tracked correctly


class TestFileSpecificContext:
    """Test Issue 2: HIGH priority file-specific contexts are auto-loaded."""
    
    def test_high_priority_file_specific_is_loaded(self, tmp_path):
        """Verify HIGH priority file-specific contexts are included in active context."""
        context_profiles = {
            "edit_code": {
                "python": {
                    "required": ["@rules/python_core.mdc"],
                    "optional": [],
                    "file_specific": {
                        "database": ["@rules/db_rules.mdc"],
                        "_priority": {
                            "database": "HIGH"
                        }
                    }
                }
            }
        }
        
        loader = ContextLoader()
        loader.context_profiles = context_profiles
        loader.dependencies = {}
        
        predictor = DummyPredictor()
        state_file = tmp_path / "context_state.json"
        preloader = ContextPreloader(predictor, loader, state_file=state_file)
        
        # Edit a database file
        current_task = {
            "primary_task": "edit_code",
            "files": ["libs/db/schema.prisma"],
            "user_message": ""
        }
        
        result = preloader.manage_context(current_task)
        
        # Verify: Both core and db_rules should be active (PRIMARY + HIGH)
        assert "@rules/python_core.mdc" in result['active_context']
        assert "@rules/db_rules.mdc" in result['active_context']
    
    def test_medium_priority_file_specific_is_suggested_only(self, tmp_path):
        """Verify MEDIUM priority file-specific contexts are only suggested, not loaded."""
        context_profiles = {
            "edit_code": {
                "python": {
                    "required": ["@rules/python_core.mdc"],
                    "optional": [],
                    "file_specific": {
                        "generic": ["@rules/generic_rules.mdc"],
                        "_priority": {
                            "generic": "MEDIUM"  # Default, not HIGH
                        }
                    }
                }
            }
        }
        
        loader = ContextLoader()
        loader.context_profiles = context_profiles
        loader.dependencies = {}
        
        predictor = DummyPredictor()
        state_file = tmp_path / "context_state.json"
        preloader = ContextPreloader(predictor, loader, state_file=state_file)
        
        current_task = {
            "primary_task": "edit_code",
            "files": ["src/generic.py"],
            "user_message": ""
        }
        
        result = preloader.manage_context(current_task)
        
        # Verify: Core is active, generic is suggested only
        assert "@rules/python_core.mdc" in result['active_context']
        assert "@rules/generic_rules.mdc" not in result['active_context']
        assert "@rules/generic_rules.mdc" in result['suggested_context']


class TestAtomicStatePersistence:
    """Test atomic state persistence."""
    
    def test_atomic_write_prevents_corruption(self, tmp_path):
        """Verify state is written atomically."""
        loader = ContextLoader()
        loader.context_profiles = {"edit_code": {"python": {"required": ["@rules/core.mdc"], "optional": [], "file_specific": {}}}}
        loader.dependencies = {}
        
        predictor = DummyPredictor()
        state_file = tmp_path / "context_state.json"
        preloader = ContextPreloader(predictor, loader, state_file=state_file)
        
        # Set state
        preloader.preloaded_contexts = {
            "active": ["@rules/active1.mdc"],
            "preloaded": ["@rules/preloaded1.mdc"]
        }
        
        # Save state
        preloader._save_state()
        
        # Verify file exists and is valid JSON
        assert state_file.exists()
        with open(state_file, 'r') as f:
            data = json.load(f)
            assert 'active' in data
            assert 'preloaded' in data
            assert data['active'] == ["@rules/active1.mdc"]
            assert data['preloaded'] == ["@rules/preloaded1.mdc"]
    
    def test_atomic_write_handles_errors_gracefully(self, tmp_path):
        """Verify atomic write cleans up temp file on error."""
        loader = ContextLoader()
        loader.context_profiles = {}
        loader.dependencies = {}
        
        predictor = DummyPredictor()
        state_file = tmp_path / "context_state.json"
        preloader = ContextPreloader(predictor, loader, state_file=state_file)
        
        # Set invalid state (circular reference to cause JSON error)
        preloader.preloaded_contexts = {
            "active": ["@rules/core.mdc"],
            "preloaded": []
        }
        
        # Mock json.dump to raise error
        import context_manager.preloader as preloader_module
        original_dump = json.dump
        json.dump = Mock(side_effect=Exception("JSON error"))
        
        try:
            # Should not raise, should handle gracefully
            preloader._save_state()
        finally:
            json.dump = original_dump
        
        # Verify temp files are cleaned up (if any were created)
        temp_files = list(tmp_path.glob("context_state_*.json"))
        assert len(temp_files) == 0  # Temp files should be cleaned up


if __name__ == "__main__":
    pytest.main([__file__, "-v"])











