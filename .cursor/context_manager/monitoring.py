#!/usr/bin/env python3
"""
Monitoring system for predictive context management.

Tracks:
- Prediction accuracy
- Context loading/unloading efficiency
- Token usage
- System health metrics

Last Updated: 2025-12-01
"""

import json
import time
from pathlib import Path
from typing import Dict, List, Optional
from datetime import datetime, timezone
from dataclasses import dataclass, asdict

# Add project root to path
import sys
project_root = Path(__file__).parent.parent.parent
sys.path.insert(0, str(project_root))

try:
    from logger_util import get_logger, get_or_create_trace_context
    logger = get_logger(context="context_monitoring")
except ImportError:
    import logging
    logging.basicConfig(level=logging.INFO)
    logger = logging.getLogger("context_monitoring")


@dataclass
class PredictionMetrics:
    """Metrics for a single prediction."""
    timestamp: str
    current_task: str
    predicted_task: str
    probability: float
    actual_next_task: Optional[str] = None
    was_correct: Optional[bool] = None
    workflow_id: Optional[str] = None


@dataclass
class ContextMetrics:
    """Metrics for context management."""
    timestamp: str
    active_context_count: int
    preloaded_context_count: int
    unloaded_context_count: int
    suggested_context_count: int
    total_tokens: int
    task_type: str


@dataclass
class SystemHealth:
    """System health metrics."""
    timestamp: str
    state_file_exists: bool
    state_file_valid: bool
    profiles_loaded: bool
    dependencies_loaded: bool
    prediction_history_size: int
    workflow_tracker_active: bool


class ContextMonitoring:
    """Monitors predictive context management system."""
    
    def __init__(self, metrics_dir: Optional[Path] = None):
        """
        Initialize monitoring system.
        
        Args:
            metrics_dir: Directory to store metrics (default: .cursor/context_manager/metrics/)
        """
        if metrics_dir is None:
            metrics_dir = Path(__file__).parent / "metrics"
        self.metrics_dir = metrics_dir
        self.metrics_dir.mkdir(parents=True, exist_ok=True)
        
        # Metrics files
        self.prediction_metrics_file = self.metrics_dir / "prediction_metrics.jsonl"
        self.context_metrics_file = self.metrics_dir / "context_metrics.jsonl"
        self.health_metrics_file = self.metrics_dir / "health_metrics.jsonl"
    
    def record_prediction(self, current_task: str, predicted_task: str, 
                         probability: float, workflow_id: Optional[str] = None) -> None:
        """
        Record a prediction for accuracy tracking.
        
        Args:
            current_task: Current task type
            predicted_task: Predicted next task
            probability: Prediction probability
            workflow_id: Optional workflow ID
        """
        metric = PredictionMetrics(
            timestamp=datetime.now(timezone.utc).isoformat(),
            current_task=current_task,
            predicted_task=predicted_task,
            probability=probability,
            workflow_id=workflow_id
        )
        
        self._append_metric(self.prediction_metrics_file, metric)
    
    def record_prediction_outcome(self, current_task: str, predicted_task: str,
                                  actual_next_task: str) -> None:
        """
        Record the actual next task to calculate accuracy.
        
        Args:
            current_task: Current task type
            predicted_task: Predicted task
            actual_next_task: Actual next task that occurred
        """
        # Find matching prediction and update it
        # For simplicity, we'll just record a new metric with outcome
        metric = PredictionMetrics(
            timestamp=datetime.now(timezone.utc).isoformat(),
            current_task=current_task,
            predicted_task=predicted_task,
            probability=0.0,  # Not used for outcome tracking
            actual_next_task=actual_next_task,
            was_correct=(predicted_task == actual_next_task)
        )
        
        self._append_metric(self.prediction_metrics_file, metric)
    
    def record_context_metrics(self, active_count: int, preloaded_count: int,
                              unloaded_count: int, suggested_count: int,
                              total_tokens: int, task_type: str) -> None:
        """
        Record context management metrics.
        
        Args:
            active_count: Number of active context files
            preloaded_count: Number of preloaded context files
            unloaded_count: Number of unloaded context files
            suggested_count: Number of suggested context files
            total_tokens: Total token usage
            task_type: Current task type
        """
        metric = ContextMetrics(
            timestamp=datetime.now(timezone.utc).isoformat(),
            active_context_count=active_count,
            preloaded_context_count=preloaded_count,
            unloaded_context_count=unloaded_count,
            suggested_context_count=suggested_count,
            total_tokens=total_tokens,
            task_type=task_type
        )
        
        self._append_metric(self.context_metrics_file, metric)
    
    def record_health_check(self, state_file_exists: bool, state_file_valid: bool,
                           profiles_loaded: bool, dependencies_loaded: bool,
                           prediction_history_size: int, workflow_tracker_active: bool) -> None:
        """
        Record system health metrics.
        
        Args:
            state_file_exists: Whether state file exists
            state_file_valid: Whether state file is valid JSON
            profiles_loaded: Whether context profiles are loaded
            dependencies_loaded: Whether dependencies are loaded
            prediction_history_size: Size of prediction history
            workflow_tracker_active: Whether workflow tracker is active
        """
        metric = SystemHealth(
            timestamp=datetime.now(timezone.utc).isoformat(),
            state_file_exists=state_file_exists,
            state_file_valid=state_file_valid,
            profiles_loaded=profiles_loaded,
            dependencies_loaded=dependencies_loaded,
            prediction_history_size=prediction_history_size,
            workflow_tracker_active=workflow_tracker_active
        )
        
        self._append_metric(self.health_metrics_file, metric)
    
    def get_prediction_accuracy(self, window_hours: int = 24) -> Dict:
        """
        Calculate prediction accuracy over time window.
        
        Args:
            window_hours: Time window in hours (default: 24)
            
        Returns:
            Dictionary with accuracy metrics
        """
        cutoff_time = datetime.now(timezone.utc).timestamp() - (window_hours * 3600)
        
        correct = 0
        total = 0
        by_task = {}
        
        if not self.prediction_metrics_file.exists():
            return {
                "overall_accuracy": 0.0,
                "total_predictions": 0,
                "correct_predictions": 0,
                "by_task": {}
            }
        
        with open(self.prediction_metrics_file, 'r') as f:
            for line in f:
                try:
                    data = json.loads(line)
                    timestamp = datetime.fromisoformat(data['timestamp']).timestamp()
                    
                    if timestamp < cutoff_time:
                        continue
                    
                    if data.get('was_correct') is not None:
                        total += 1
                        if data['was_correct']:
                            correct += 1
                        
                        # Track by current task
                        current_task = data.get('current_task', 'unknown')
                        if current_task not in by_task:
                            by_task[current_task] = {'correct': 0, 'total': 0}
                        by_task[current_task]['total'] += 1
                        if data['was_correct']:
                            by_task[current_task]['correct'] += 1
                except (json.JSONDecodeError, KeyError, ValueError):
                    continue
        
        accuracy_by_task = {
            task: (stats['correct'] / stats['total'] if stats['total'] > 0 else 0.0)
            for task, stats in by_task.items()
        }
        
        return {
            "overall_accuracy": correct / total if total > 0 else 0.0,
            "total_predictions": total,
            "correct_predictions": correct,
            "by_task": accuracy_by_task
        }
    
    def get_context_efficiency(self, window_hours: int = 24) -> Dict:
        """
        Calculate context management efficiency metrics.
        
        Args:
            window_hours: Time window in hours (default: 24)
            
        Returns:
            Dictionary with efficiency metrics
        """
        cutoff_time = datetime.now(timezone.utc).timestamp() - (window_hours * 3600)
        
        total_tokens = 0
        total_active = 0
        total_preloaded = 0
        total_unloaded = 0
        count = 0
        
        if not self.context_metrics_file.exists():
            return {
                "avg_active_context": 0,
                "avg_preloaded_context": 0,
                "avg_unloaded_context": 0,
                "avg_tokens": 0,
                "total_operations": 0
            }
        
        with open(self.context_metrics_file, 'r') as f:
            for line in f:
                try:
                    data = json.loads(line)
                    timestamp = datetime.fromisoformat(data['timestamp']).timestamp()
                    
                    if timestamp < cutoff_time:
                        continue
                    
                    total_active += data.get('active_context_count', 0)
                    total_preloaded += data.get('preloaded_context_count', 0)
                    total_unloaded += data.get('unloaded_context_count', 0)
                    total_tokens += data.get('total_tokens', 0)
                    count += 1
                except (json.JSONDecodeError, KeyError, ValueError):
                    continue
        
        return {
            "avg_active_context": total_active / count if count > 0 else 0,
            "avg_preloaded_context": total_preloaded / count if count > 0 else 0,
            "avg_unloaded_context": total_unloaded / count if count > 0 else 0,
            "avg_tokens": total_tokens / count if count > 0 else 0,
            "total_operations": count
        }
    
    def _append_metric(self, file_path: Path, metric) -> None:
        """Append metric to JSONL file."""
        try:
            with open(file_path, 'a') as f:
                f.write(json.dumps(asdict(metric)) + '\n')
        except Exception as e:
            logger.error(
                f"Failed to write metric: {e}",
                operation="_append_metric",
                error_code="METRIC_WRITE_FAILED",
                root_cause=str(e)
            )


if __name__ == "__main__":
    # Example usage
    monitoring = ContextMonitoring()
    
    # Record some metrics
    monitoring.record_prediction("edit_code", "run_tests", 0.85)
    monitoring.record_prediction_outcome("edit_code", "run_tests", "run_tests")
    
    # Get accuracy
    accuracy = monitoring.get_prediction_accuracy()
    print(f"Prediction Accuracy: {accuracy['overall_accuracy']:.2%}")
    print(f"Total Predictions: {accuracy['total_predictions']}")








