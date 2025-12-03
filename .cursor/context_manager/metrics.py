#!/usr/bin/env python3
"""
Performance Metrics
Tracks and reports context management performance.

Last Updated: 2025-12-01
"""

from datetime import datetime, timezone
from pathlib import Path
from typing import Dict, Optional
import json

# Add project root to path
import sys
project_root = Path(__file__).parent.parent.parent
sys.path.insert(0, str(project_root))

try:
    from logger_util import get_logger, get_or_create_trace_context
    logger = get_logger(context="metrics")
except ImportError:
    import logging
    logging.basicConfig(level=logging.INFO)
    logger = logging.getLogger("metrics")

from .analytics import PredictionAnalytics
from .token_estimator import TokenEstimator


class PerformanceMetrics:
    """Tracks performance metrics for context management."""
    
    def __init__(self, analytics: Optional[PredictionAnalytics] = None,
                 token_estimator: Optional[TokenEstimator] = None):
        """
        Initialize performance metrics.
        
        Args:
            analytics: PredictionAnalytics instance (optional)
            token_estimator: TokenEstimator instance (optional)
        """
        self.analytics = analytics or PredictionAnalytics()
        self.token_estimator = token_estimator or TokenEstimator()
    
    def get_session_metrics(self, session_data: Dict) -> Dict:
        """
        Get metrics for a session.
        
        Args:
            session_data: Session data with tasks, context_loaded, context_preloaded, etc.
            
        Returns:
            Dict with performance metrics
        """
        # Get prediction accuracy
        accuracy_report = self.analytics.get_accuracy_report()
        
        # Calculate token metrics
        all_loaded_files = []
        all_preloaded_files = []
        
        for task in session_data.get('tasks', []):
            all_loaded_files.extend(task.get('context_loaded', []))
            all_preloaded_files.extend(task.get('context_preloaded', []))
        
        # Remove duplicates
        all_loaded_files = list(set(all_loaded_files))
        all_preloaded_files = list(set(all_preloaded_files))
        
        # Estimate baseline (all rules loaded)
        baseline_files = [
            '.cursor/rules/00-master.mdc',
            '.cursor/rules/01-enforcement.mdc',
            '.cursor/rules/02-core.mdc',
            '.cursor/rules/03-security.mdc',
            '.cursor/rules/04-architecture.mdc',
            '.cursor/rules/05-data.mdc',
            '.cursor/rules/06-error-resilience.mdc',
            '.cursor/rules/07-observability.mdc',
            '.cursor/rules/08-backend.mdc',
            '.cursor/rules/09-frontend.mdc',
            '.cursor/rules/10-quality.mdc',
            '.cursor/rules/11-operations.mdc',
            '.cursor/rules/12-tech-debt.mdc',
            '.cursor/rules/13-ux-consistency.mdc',
            '.cursor/rules/14-verification.mdc',
        ]
        
        comparison = self.token_estimator.compare_approaches(
            static_files=baseline_files,
            predictive_files=all_loaded_files,
            preloaded_files=all_preloaded_files
        )
        
        return {
            'prediction_accuracy': {
                'overall': accuracy_report.get('overall_accuracy', 0.0),
                'total_predictions': accuracy_report.get('total_predictions', 0),
                'correct_predictions': accuracy_report.get('correct_predictions', 0)
            },
            'token_usage': comparison,
            'context_efficiency': {
                'context_swaps': len(session_data.get('tasks', [])),
                'avg_files_per_task': round(
                    len(all_loaded_files) / len(session_data.get('tasks', [])) if session_data.get('tasks') else 0,
                    2
                )
            },
            'session_stats': {
                'tasks_completed': len(session_data.get('tasks', [])),
                'duration_minutes': session_data.get('duration_minutes', 0)
            }
        }










