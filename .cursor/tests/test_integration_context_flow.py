#!/usr/bin/env python3
"""
Integration tests for end-to-end context management flow.

Tests:
- Complete workflow: edit_code → run_tests
- State persistence across calls
- Context loading/unloading in real scenarios
"""

import pytest
import json
import tempfile
from pathlib import Path
import sys

# Add project root to path
project_root = Path(__file__).parent.parent.parent
sys.path.insert(0, str(project_root))
sys.path.insert(0, str(project_root / ".cursor" / "context_manager"))

from context_manager.context_loader import ContextLoader
from context_manager.preloader import ContextPreloader
from context_manager.predictor import ContextPredictor, TaskPrediction
from context_manager.workflow_tracker import WorkflowTracker


class FixedPredictor(ContextPredictor):
    """Fixed predictor for integration tests."""
    
    def __init__(self):
        super().__init__()
    
    def predict_next_tasks(self, current_task):
        # Predict run_tests after edit_code
        if current_task.get('primary_task') == 'edit_code':
            return [TaskPrediction(task="run_tests", probability=0.9, reason="Common workflow")]
        return []


class TestIntegrationContextFlow:
    """Integration tests for complete context management flow."""
    
    def test_edit_code_then_run_tests_flow(self, tmp_path):
        """Test complete workflow: edit_code → run_tests."""
        context_profiles = {
            "edit_code": {
                "python": {
                    "required": ["@rules/python_bible.mdc"],
                    "optional": [],
                    "file_specific": {}
                }
            },
            "run_tests": {
                "python": {
                    "required": ["@rules/quality.mdc", "@rules/verification.mdc"],
                    "optional": [],
                    "file_specific": {}
                }
            }
        }
        
        loader = ContextLoader()
        loader.context_profiles = context_profiles
        loader.dependencies = {}
        
        predictor = FixedPredictor()
        state_file = tmp_path / "context_state.json"
        preloader = ContextPreloader(predictor, loader, state_file=state_file)
        
        # Step 1: edit_code
        step1_task = {
            "primary_task": "edit_code",
            "files": ["src/service.py"],
            "user_message": ""
        }
        step1_result = preloader.manage_context(step1_task)
        
        # Verify: python_bible should be active
        assert "@rules/python_bible.mdc" in step1_result['active_context']
        
        # Verify: Preload for run_tests should include quality + verification
        assert "@rules/quality.mdc" in step1_result['preloaded_context'] or \
               "@rules/verification.mdc" in step1_result['preloaded_context']
        
        # Step 2: run_tests
        step2_task = {
            "primary_task": "run_tests",
            "files": ["tests/test_service.py"],
            "user_message": ""
        }
        step2_result = preloader.manage_context(step2_task)
        
        # Verify: Tests rules should be active
        assert "@rules/quality.mdc" in step2_result['active_context']
        assert "@rules/verification.mdc" in step2_result['active_context']
        
        # Verify: python_bible should be unloaded (no longer needed)
        assert "@rules/python_bible.mdc" in step2_result['context_to_unload']
    
    def test_state_persistence_across_calls(self, tmp_path):
        """Verify state persists across multiple calls."""
        context_profiles = {
            "edit_code": {
                "python": {
                    "required": ["@rules/core.mdc"],
                    "optional": [],
                    "file_specific": {}
                }
            }
        }
        
        loader = ContextLoader()
        loader.context_profiles = context_profiles
        loader.dependencies = {}
        
        predictor = FixedPredictor()
        state_file = tmp_path / "context_state.json"
        
        # First call
        preloader1 = ContextPreloader(predictor, loader, state_file=state_file)
        task1 = {
            "primary_task": "edit_code",
            "files": ["src/app.py"],
            "user_message": ""
        }
        result1 = preloader1.manage_context(task1)
        
        # Verify state was saved
        assert state_file.exists()
        with open(state_file, 'r') as f:
            state = json.load(f)
            assert 'active' in state
            assert 'preloaded' in state
        
        # Second call (new instance, should load previous state)
        preloader2 = ContextPreloader(predictor, loader, state_file=state_file)
        
        # Verify previous state was loaded
        assert len(preloader2.preloaded_contexts.get('active', [])) > 0 or \
               len(preloader2.preloaded_contexts.get('preloaded', [])) > 0
    
    def test_dependency_expansion_in_workflow(self, tmp_path):
        """Verify dependencies are expanded in real workflow."""
        context_profiles = {
            "edit_code": {
                "python": {
                    "required": ["@rules/python_bible.mdc"],
                    "optional": [],
                    "file_specific": {}
                }
            }
        }
        
        dependencies = {
            "@rules/python_bible.mdc": ["@rules/02-core.mdc", "@rules/07-observability.mdc"]
        }
        
        loader = ContextLoader()
        loader.context_profiles = context_profiles
        loader.dependencies = dependencies
        
        predictor = FixedPredictor()
        state_file = tmp_path / "context_state.json"
        preloader = ContextPreloader(predictor, loader, state_file=state_file)
        
        task = {
            "primary_task": "edit_code",
            "files": ["src/app.py"],
            "user_message": ""
        }
        
        result = preloader.manage_context(task)
        
        # Verify: Dependencies should be in active context (HIGH priority)
        active_paths = set(result['active_context'])
        
        # python_bible is PRIMARY, dependencies are HIGH, so all should be active
        assert "@rules/python_bible.mdc" in active_paths
        assert "@rules/02-core.mdc" in active_paths
        assert "@rules/07-observability.mdc" in active_paths


if __name__ == "__main__":
    pytest.main([__file__, "-v"])







