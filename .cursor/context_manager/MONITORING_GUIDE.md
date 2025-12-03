# Monitoring Guide - Predictive Context Management

**Last Updated:** 2025-12-01

## Overview

The monitoring system tracks prediction accuracy, context efficiency, and system health metrics for the predictive context management system.

## Metrics Tracked

### 1. Prediction Accuracy

**Location:** `.cursor/context_manager/metrics/prediction_metrics.jsonl`

**Metrics:**
- Current task type
- Predicted next task
- Prediction probability
- Actual next task (when available)
- Was prediction correct?
- Workflow ID

**Usage:**
```python
from context_manager.monitoring import ContextMonitoring

monitoring = ContextMonitoring()

# Record prediction
monitoring.record_prediction("edit_code", "run_tests", 0.85)

# Record outcome
monitoring.record_prediction_outcome("edit_code", "run_tests", "run_tests")

# Get accuracy
accuracy = monitoring.get_prediction_accuracy(window_hours=24)
print(f"Accuracy: {accuracy['overall_accuracy']:.2%}")
```

### 2. Context Efficiency

**Location:** `.cursor/context_manager/metrics/context_metrics.jsonl`

**Metrics:**
- Active context count
- Preloaded context count
- Unloaded context count
- Suggested context count
- Total token usage
- Task type

**Usage:**
```python
monitoring.record_context_metrics(
    active_count=4,
    preloaded_count=2,
    unloaded_count=3,
    suggested_count=8,
    total_tokens=1200,
    task_type="edit_code"
)

# Get efficiency
efficiency = monitoring.get_context_efficiency(window_hours=24)
print(f"Avg active context: {efficiency['avg_active_context']:.1f}")
```

### 3. System Health

**Location:** `.cursor/context_manager/metrics/health_metrics.jsonl`

**Metrics:**
- State file exists
- State file valid
- Profiles loaded
- Dependencies loaded
- Prediction history size
- Workflow tracker active

**Usage:**
```python
monitoring.record_health_check(
    state_file_exists=True,
    state_file_valid=True,
    profiles_loaded=True,
    dependencies_loaded=True,
    prediction_history_size=150,
    workflow_tracker_active=True
)
```

## Integration with Auto-Enforcer

The monitoring system should be integrated into `auto-enforcer.py`:

```python
from context_manager.monitoring import ContextMonitoring

class VeroFieldEnforcer:
    def __init__(self):
        # ... existing init ...
        self.monitoring = ContextMonitoring()
    
    def _update_context_recommendations(self):
        # ... existing code ...
        
        # Record metrics
        result = self.preloader.manage_context(current_task)
        
        # Record context metrics
        from context_manager.token_estimator import TokenEstimator
        token_estimator = TokenEstimator(self.project_root)
        active_tokens = token_estimator.track_context_load(result['active_context'])
        preload_tokens = token_estimator.track_context_load(result['preloaded_context'])
        total_tokens = active_tokens.total_tokens + int(preload_tokens.total_tokens * 0.3)
        
        self.monitoring.record_context_metrics(
            active_count=len(result['active_context']),
            preloaded_count=len(result['preloaded_context']),
            unloaded_count=len(result['context_to_unload']),
            suggested_count=len(result['suggested_context']),
            total_tokens=total_tokens,
            task_type=current_task.get('primary_task', 'unknown')
        )
        
        # Record predictions
        for pred in predictions:
            self.monitoring.record_prediction(
                current_task=current_task.get('primary_task', 'unknown'),
                predicted_task=pred.task,
                probability=pred.probability,
                workflow_id=workflow_id
            )
```

## Dashboard

Create a simple dashboard script to view metrics:

```python
# .cursor/context_manager/dashboard_viewer.py
from context_manager.monitoring import ContextMonitoring

monitoring = ContextMonitoring()

print("=== Prediction Accuracy ===")
accuracy = monitoring.get_prediction_accuracy()
print(f"Overall: {accuracy['overall_accuracy']:.2%}")
print(f"Total: {accuracy['total_predictions']}")
print(f"Correct: {accuracy['correct_predictions']}")

print("\n=== Context Efficiency ===")
efficiency = monitoring.get_context_efficiency()
print(f"Avg Active Context: {efficiency['avg_active_context']:.1f}")
print(f"Avg Preloaded: {efficiency['avg_preloaded_context']:.1f}")
print(f"Avg Tokens: {efficiency['avg_tokens']:.0f}")
```

## Alerts

Set up alerts for:
- Prediction accuracy < 50% (system not learning)
- Avg tokens > 2000 (context too large)
- State file invalid (corruption detected)
- Dependencies not loaded (configuration issue)

## Retention

Metrics are stored in JSONL format (one JSON object per line). Consider:
- Rotating logs weekly/monthly
- Archiving old metrics
- Aggregating daily/weekly summaries

---

**Last Updated:** 2025-12-01







