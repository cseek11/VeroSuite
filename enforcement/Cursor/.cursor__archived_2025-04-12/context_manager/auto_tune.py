#!/usr/bin/env python3
"""
Workflow Auto-Tuning System
Self-improving patterns based on actual usage.

Last Updated: 2025-12-04
"""

from typing import Dict
from pathlib import Path

# Add project root to path
import sys
project_root = Path(__file__).parent.parent.parent
sys.path.insert(0, str(project_root))

try:
    from logger_util import get_logger, get_or_create_trace_context
    logger = get_logger(context="auto_tune")
except ImportError:
    import logging
    logging.basicConfig(level=logging.INFO)
    logger = logging.getLogger("auto_tune")

from .analytics import PredictionAnalytics
from .workflow_patterns import WorkflowPatterns, WorkflowPattern


class WorkflowAutoTuner:
    """Adjusts workflow probabilities based on actual usage."""
    
    def __init__(self, analytics: PredictionAnalytics):
        """
        Initialize auto-tuner.
        
        Args:
            analytics: PredictionAnalytics instance
        """
        self.analytics = analytics
        self.max_probability_adjustment = 0.05  # Max 5% adjustment per update
    
    def update_probabilities(self) -> None:
        """
        Adjust workflow probabilities based on actual usage.
        
        Runs weekly to refine predictions.
        """
        report = self.analytics.get_accuracy_report()
        
        if not report['by_workflow']:
            logger.info(
                "No workflow data available for tuning",
                operation="update_probabilities"
            )
            return
        
        # Increase probability for consistently accurate predictions
        for workflow_name, data in report['by_workflow'].items():
            if data['total'] < 5:  # Not enough data
                continue
            
            accuracy = data['accuracy']
            pattern = WorkflowPatterns.get_pattern(workflow_name)
            
            if not pattern:
                continue
            
            if accuracy > 0.85:
                # High accuracy - increase probability
                new_probability = min(
                    pattern.probability + self.max_probability_adjustment,
                    0.95  # Cap at 95%
                )
                if new_probability != pattern.probability:
                    pattern.probability = new_probability
                    logger.info(
                        f"Increased probability for {workflow_name} to {new_probability:.0%}",
                        operation="update_probabilities",
                        workflow=workflow_name,
                        old_probability=pattern.probability - self.max_probability_adjustment,
                        new_probability=new_probability,
                        accuracy=accuracy
                    )
            
            elif accuracy < 0.60:
                # Low accuracy - decrease probability
                new_probability = max(
                    pattern.probability - self.max_probability_adjustment,
                    0.50  # Floor at 50%
                )
                if new_probability != pattern.probability:
                    pattern.probability = new_probability
                    logger.info(
                        f"Decreased probability for {workflow_name} to {new_probability:.0%}",
                        operation="update_probabilities",
                        workflow=workflow_name,
                        old_probability=pattern.probability + self.max_probability_adjustment,
                        new_probability=new_probability,
                        accuracy=accuracy
                    )
        
        # Add new patterns discovered from usage
        recommendations = report.get('recommendations', [])
        for recommendation in recommendations:
            if 'adding pattern' in recommendation.lower():
                self._create_new_pattern(recommendation)
    
    def _create_new_pattern(self, recommendation: str) -> None:
        """
        Automatically create new workflow patterns from observed behavior.
        
        Args:
            recommendation: Recommendation string like "Consider adding pattern: edit_code -> run_tests"
        """
        try:
            # Extract transition from recommendation
            # Format: "Consider adding pattern: edit_code -> run_tests (occurred 10 times)"
            if '->' not in recommendation:
                return
            
            transition_part = recommendation.split(':')[1].split('(')[0].strip()
            from_task, to_task = transition_part.split('->')
            from_task = from_task.strip()
            to_task = to_task.strip()
            
            # Check if pattern already exists
            for pattern in WorkflowPatterns.PATTERNS.values():
                if from_task in pattern.sequence and to_task in pattern.sequence:
                    # Pattern already exists in some workflow
                    return
            
            # Create new pattern name
            pattern_name = f"{from_task}_to_{to_task}_workflow"
            
            # Create new pattern with initial probability
            new_pattern = WorkflowPattern(
                name=pattern_name,
                sequence=[from_task, to_task],
                probability=0.50,  # Initial probability (will be tuned)
                trigger_indicators=[from_task, to_task],
                description=f"Auto-discovered pattern: {from_task} -> {to_task}"
            )
            
            WorkflowPatterns.PATTERNS[pattern_name] = new_pattern
            
            logger.info(
                f"Created new workflow pattern: {pattern_name}",
                operation="_create_new_pattern",
                pattern_name=pattern_name,
                sequence=[from_task, to_task]
            )
            
        except Exception as e:
            logger.error(
                f"Failed to create new pattern from recommendation: {e}",
                operation="_create_new_pattern",
                error_code="PATTERN_CREATION_FAILED",
                root_cause=str(e),
                recommendation=recommendation
            )

