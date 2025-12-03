#!/usr/bin/env python3
"""
Prediction Analytics System
Tracks prediction accuracy and generates reports.

Last Updated: 2025-12-01
"""

import json
from datetime import datetime, timezone
from pathlib import Path
from typing import Dict, List, Optional
from dataclasses import dataclass, asdict
from collections import defaultdict

# Add project root to path
import sys
project_root = Path(__file__).parent.parent.parent
sys.path.insert(0, str(project_root))

try:
    from logger_util import get_logger, get_or_create_trace_context
    logger = get_logger(context="analytics")
except ImportError:
    import logging
    logging.basicConfig(level=logging.INFO)
    logger = logging.getLogger("analytics")


@dataclass(slots=True)  # Python 3.10+ - reduces memory by 4-5×
class PredictionRecord:
    """Represents a prediction and its outcome."""
    timestamp: str
    predicted: List[Dict]  # List of TaskPrediction dicts
    actual: str
    correct: bool
    context: Dict


class PredictionAnalytics:
    """Analyzes prediction performance."""
    
    def __init__(self, history_file: Optional[Path] = None):
        """
        Initialize analytics system.
        
        Args:
            history_file: Path to prediction_history.json (default: .cursor/context_manager/prediction_history.json)
        """
        if history_file is None:
            history_file = Path(__file__).parent / "prediction_history.json"
        
        self.history_file = history_file
        self.predictions: List[PredictionRecord] = []
        self._load_history()
    
    def _load_history(self) -> None:
        """Load prediction history from JSON file."""
        # Ensure directory exists
        self.history_file.parent.mkdir(parents=True, exist_ok=True)
        
        if not self.history_file.exists():
            # Create empty file if it doesn't exist
            try:
                with open(self.history_file, 'w', encoding='utf-8') as f:
                    json.dump({
                        'predictions': [],
                        'last_updated': datetime.now(timezone.utc).isoformat()
                    }, f, indent=2, ensure_ascii=False)
                logger.debug(
                    "Created empty prediction history file",
                    operation="_load_history",
                    history_file=str(self.history_file)
                )
            except Exception as e:
                logger.warn(
                    f"Failed to create prediction history file: {e}",
                    operation="_load_history",
                    error_code="CREATE_FILE_FAILED",
                    root_cause=str(e)
                )
            return
        
        try:
            with open(self.history_file, 'r', encoding='utf-8') as f:
                data = json.load(f)
                
                for pred_data in data.get('predictions', []):
                    self.predictions.append(PredictionRecord(**pred_data))
            
            logger.info(
                "Prediction history loaded",
                operation="_load_history",
                predictions_count=len(self.predictions)
            )
        except Exception as e:
            logger.error(
                f"Failed to load prediction history: {e}",
                operation="_load_history",
                error_code="LOAD_FAILED",
                root_cause=str(e)
            )
    
    def _save_history(self) -> None:
        """Save prediction history to JSON file."""
        try:
            # Ensure directory exists
            self.history_file.parent.mkdir(parents=True, exist_ok=True)
            
            data = {
                'predictions': [asdict(pred) for pred in self.predictions],
                'last_updated': datetime.now(timezone.utc).isoformat()
            }
            
            with open(self.history_file, 'w', encoding='utf-8') as f:
                json.dump(data, f, indent=2, ensure_ascii=False)
            
            logger.debug(
                "Prediction history saved",
                operation="_save_history",
                predictions_count=len(self.predictions)
            )
        except Exception as e:
            logger.error(
                f"Failed to save prediction history: {e}",
                operation="_save_history",
                error_code="SAVE_FAILED",
                root_cause=str(e)
            )
    
    def log_prediction(self, predicted: List[Dict], actual: str, context: Dict) -> None:
        """
        Record prediction and outcome.
        
        Args:
            predicted: List of prediction dicts (from TaskPrediction)
            actual: Actual task that occurred
            context: Context dict with current_task, workflow_id, etc.
        """
        # Check if prediction was correct
        predicted_tasks = [p.get('task', '') for p in predicted]
        was_correct = actual in predicted_tasks
        
        record = PredictionRecord(
            timestamp=datetime.now(timezone.utc).isoformat(),
            predicted=predicted,
            actual=actual,
            correct=was_correct,
            context=context
        )
        
        self.predictions.append(record)
        
        # Keep only last 1000 predictions
        if len(self.predictions) > 1000:
            self.predictions = self.predictions[-1000:]
        
        self._save_history()
        
        logger.info(
            f"Prediction logged: {actual} (correct: {was_correct})",
            operation="log_prediction",
            predicted_tasks=predicted_tasks,
            actual_task=actual,
            correct=was_correct
        )
    
    def get_accuracy_report(self) -> Dict:
        """
        Analyze prediction performance.
        
        Returns:
            Dict with overall_accuracy, by_workflow, by_task_type, suggestions
        """
        if not self.predictions:
            return {
                'overall_accuracy': 0.0,
                'total_predictions': 0,
                'correct_predictions': 0,
                'by_workflow': {},
                'by_task_type': {},
                'recommendations': []
            }
        
        total = len(self.predictions)
        correct = sum(1 for p in self.predictions if p.correct)
        overall_accuracy = correct / total if total > 0 else 0.0
        
        # Accuracy by workflow
        by_workflow = defaultdict(lambda: {'total': 0, 'correct': 0})
        for pred in self.predictions:
            workflow = pred.context.get('workflow_name', 'unknown')
            by_workflow[workflow]['total'] += 1
            if pred.correct:
                by_workflow[workflow]['correct'] += 1
        
        # Calculate percentages
        by_workflow_percent = {
            workflow: {
                'accuracy': (data['correct'] / data['total']) if data['total'] > 0 else 0.0,
                'total': data['total'],
                'correct': data['correct']
            }
            for workflow, data in by_workflow.items()
        }
        
        # Accuracy by task transition
        by_transition = defaultdict(lambda: {'total': 0, 'correct': 0})
        for i in range(len(self.predictions) - 1):
            current = self.predictions[i].context.get('current_task', 'unknown')
            next_task = self.predictions[i + 1].actual
            transition = f"{current} -> {next_task}"
            by_transition[transition]['total'] += 1
            if self.predictions[i].correct:
                by_transition[transition]['correct'] += 1
        
        by_transition_percent = {
            transition: {
                'accuracy': (data['correct'] / data['total']) if data['total'] > 0 else 0.0,
                'total': data['total'],
                'correct': data['correct']
            }
            for transition, data in by_transition.items()
        }
        
        # Generate recommendations
        recommendations = self._generate_recommendations()
        
        return {
            'overall_accuracy': round(overall_accuracy, 3),
            'total_predictions': total,
            'correct_predictions': correct,
            'by_workflow': by_workflow_percent,
            'by_task_type': by_transition_percent,
            'recommendations': recommendations
        }
    
    def _generate_recommendations(self) -> List[str]:
        """Auto-tune workflow probabilities based on actual patterns."""
        recommendations = []
        
        # Analyze frequent transitions
        transitions = defaultdict(int)
        for i in range(len(self.predictions) - 1):
            current = self.predictions[i].context.get('current_task', 'unknown')
            next_task = self.predictions[i + 1].actual
            transition = f"{current} -> {next_task}"
            transitions[transition] += 1
        
        # Find high-frequency transitions not in patterns
        for transition, count in transitions.items():
            if count > 5:  # Occurred frequently
                recommendations.append(f"Consider adding pattern: {transition} (occurred {count} times)")
        
        # Find low-accuracy workflows
        report = self.get_accuracy_report()
        for workflow, data in report['by_workflow'].items():
            if data['total'] >= 5:  # Enough data
                if data['accuracy'] < 0.60:
                    recommendations.append(
                        f"Workflow '{workflow}' has low accuracy ({data['accuracy']:.0%}), "
                        f"consider adjusting probabilities"
                    )
        
        return recommendations

