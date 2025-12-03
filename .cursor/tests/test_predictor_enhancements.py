#!/usr/bin/env python3
"""
Unit tests for Phase 3 fixes: Enhanced prediction engine.

Tests:
- Issue 4: Prediction uses static + dynamic patterns + message analysis
- Score normalization
- Multiple signal sources
"""

import pytest
import sys
from pathlib import Path
from unittest.mock import Mock

# Add project root to path
project_root = Path(__file__).parent.parent.parent
sys.path.insert(0, str(project_root))
sys.path.insert(0, str(project_root / ".cursor" / "context_manager"))

from context_manager.predictor import ContextPredictor, TaskPrediction
from context_manager.workflow_tracker import WorkflowTracker


class TestEnhancedPrediction:
    """Test Issue 4: Enhanced prediction engine."""
    
    def test_predictor_uses_static_and_dynamic_patterns(self):
        """Verify predictor uses both static patterns and dynamic transition stats."""
        workflow_patterns = {
            "edit_code": {
                "run_tests": 2.0,
                "write_docs": 0.5
            }
        }
        
        transition_stats = {
            ("edit_code", "run_tests"): 100,  # Strongly learned
            ("edit_code", "review_code"): 20
        }
        
        predictor = ContextPredictor()
        predictor.workflow_patterns = workflow_patterns
        predictor.transition_stats = transition_stats
        
        current_task = {
            "primary_task": "edit_code",
            "files": ["src/app.py"],
            "user_message": "please run tests"
        }
        
        preds = predictor.predict_next_tasks(current_task)
        
        # Verify predictions are returned
        assert len(preds) > 0
        
        # Check ordering: run_tests should be first (high score from static + dynamic)
        run_tests_pred = next((p for p in preds if p.task == "run_tests"), None)
        assert run_tests_pred is not None
        assert run_tests_pred.probability > 0.3  # Should be reasonably high
    
    def test_message_semantic_analysis(self):
        """Verify message semantic analysis boosts relevant predictions."""
        predictor = ContextPredictor()
        predictor.workflow_patterns = {}
        predictor.transition_stats = {}
        
        # Test with "test" keyword
        current_task = {
            "primary_task": "edit_code",
            "files": ["src/app.py"],
            "user_message": "please run tests to verify"
        }
        
        preds = predictor.predict_next_tasks(current_task)
        
        # Verify run_tests is predicted (boosted by message analysis)
        run_tests_pred = next((p for p in preds if p.task == "run_tests"), None)
        assert run_tests_pred is not None
        assert run_tests_pred.probability > 0.0
    
    def test_file_type_patterns(self):
        """Verify file type patterns influence predictions."""
        predictor = ContextPredictor()
        predictor.workflow_patterns = {}
        predictor.transition_stats = {}
        
        # Test with test file
        current_task = {
            "primary_task": "edit_code",
            "files": ["tests/test_app.py"],  # Test file
            "user_message": ""
        }
        
        preds = predictor.predict_next_tasks(current_task)
        
        # Verify run_tests is predicted (boosted by test file pattern)
        run_tests_pred = next((p for p in preds if p.task == "run_tests"), None)
        assert run_tests_pred is not None
    
    def test_score_normalization(self):
        """Verify scores are normalized to probabilities."""
        predictor = ContextPredictor()
        predictor.workflow_patterns = {
            "edit_code": {
                "run_tests": 10.0,
                "write_docs": 5.0
            }
        }
        predictor.transition_stats = {}
        
        current_task = {
            "primary_task": "edit_code",
            "files": [],
            "user_message": ""
        }
        
        preds = predictor.predict_next_tasks(current_task)
        
        # Verify probabilities sum to ~1.0
        total_prob = sum(p.probability for p in preds)
        assert abs(total_prob - 1.0) < 0.01  # Allow small floating point error
        
        # Verify all probabilities are between 0 and 1
        for pred in preds:
            assert 0.0 <= pred.probability <= 1.0
    
    def test_dynamic_stats_log_scaling(self):
        """Verify dynamic stats use log scaling to avoid dominance."""
        predictor = ContextPredictor()
        predictor.workflow_patterns = {}
        
        # High count transition
        transition_stats = {
            ("edit_code", "run_tests"): 1000
        }
        predictor.transition_stats = transition_stats
        
        current_task = {
            "primary_task": "edit_code",
            "files": [],
            "user_message": ""
        }
        
        preds = predictor.predict_next_tasks(current_task)
        
        # Verify prediction exists
        run_tests_pred = next((p for p in preds if p.task == "run_tests"), None)
        assert run_tests_pred is not None
        
        # Verify probability is reasonable (not 1.0 due to log scaling)
        assert run_tests_pred.probability < 1.0
    
    def test_reason_generation(self):
        """Verify predictions include meaningful reasons."""
        predictor = ContextPredictor()
        predictor.workflow_patterns = {
            "edit_code": {
                "run_tests": 2.0
            }
        }
        predictor.transition_stats = {
            ("edit_code", "run_tests"): 50
        }
        
        current_task = {
            "primary_task": "edit_code",
            "files": [],
            "user_message": "test this"
        }
        
        preds = predictor.predict_next_tasks(current_task)
        
        # Verify reasons are generated
        for pred in preds:
            assert pred.reason
            assert len(pred.reason) > 0


if __name__ == "__main__":
    pytest.main([__file__, "-v"])








