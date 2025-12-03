# Predictive Context Management System

**Last Updated:** 2025-12-01

## Overview

The Predictive Context Management System enhances the VeroField auto-enforcement system with intelligent context recommendations based on workflow prediction. It tracks development workflows, predicts next tasks, and provides context recommendations to optimize token usage.

## Architecture

### Components

1. **Task Detection** (`task_detector.py`)
   - Classifies tasks from agent messages and file changes
   - Extracts metadata: task type, file types, confidence

2. **Context Loading** (`context_loader.py`)
   - Maps task types to required/optional context files
   - Supports file-specific context (database, API, auth, etc.)

3. **Workflow Tracking** (`workflow_tracker.py`)
   - Tracks workflows by file patterns + time windows
   - Detects workflow boundaries using file overlap, temporal proximity, and logical continuation

4. **Prediction Engine** (`predictor.py`)
   - Predicts next 1-3 tasks based on workflow patterns
   - Falls back to common transitions when no workflow detected

5. **Context Preloading** (`preloader.py`)
   - Pre-loads context for high-probability predictions (>70%)
   - Manages active vs preloaded context

6. **Analytics** (`analytics.py`)
   - Tracks prediction accuracy
   - Generates accuracy reports by workflow and task transition

7. **Auto-Tuning** (`auto_tune.py`)
   - Adjusts workflow probabilities based on actual usage
   - Discovers new patterns from frequent transitions

8. **Token Estimation** (`token_estimator.py`)
   - Estimates token usage using character count (~4 chars/token)
   - Tracks context efficiency and savings

## Integration

### Auto-Enforcer Enhancement

The system integrates with `auto-enforcer.py`:

- Automatically detects tasks from file changes
- Updates context recommendations after each enforcement check
- Generates `recommendations.md` and `context_enforcement.mdc`

### File Watcher Integration

The `watch-files.py` script feeds file change events to the workflow tracker for real-time workflow detection.

## Generated Files

- `.cursor/context_manager/recommendations.md` - Human-readable recommendations
- `.cursor/rules/context_enforcement.mdc` - Dynamic rule file for Cursor
- `.cursor/context_manager/workflow_state.json` - Persistent workflow state
- `.cursor/context_manager/prediction_history.json` - Historical predictions
- `.cursor/context_manager/dashboard.md` - Real-time dashboard

## Usage

The system runs automatically when:
1. Files are modified (via file watcher)
2. Auto-enforcer runs (via `run_all_checks()`)

No manual intervention required - the system tracks workflows and updates recommendations automatically.

## Configuration

### Task Types

Edit `.cursor/context_manager/task_types.yaml` to add/modify task categories and detection patterns.

### Context Profiles

Edit `.cursor/context_manager/context_profiles.yaml` to map task types to required/optional context files.

### Workflow Patterns

Edit `.cursor/context_manager/workflow_patterns.py` to add/modify workflow patterns.

## Success Metrics

- **Prediction Accuracy:** >75% overall (target: >85%)
- **Token Savings:** >50% vs static approach (target: >70%)
- **Context Swap Overhead:** <10% of savings
- **No increase in task completion time**

## Dependencies

- `PyYAML>=6.0` - For YAML configuration files
- `watchdog>=3.0.0` - For file system monitoring (already in requirements)

## Troubleshooting

### System Not Working

1. Check that `.cursor/context_manager/` directory exists
2. Verify PyYAML is installed: `pip install PyYAML`
3. Check logs in auto-enforcer for initialization errors

### Low Prediction Accuracy

1. Review `prediction_history.json` for patterns
2. Check `analytics.py` recommendations
3. Adjust workflow probabilities in `workflow_patterns.py`

### Context Not Updating

1. Verify file watcher is running
2. Check that auto-enforcer is being called
3. Review `workflow_state.json` for active workflows

## Future Enhancements

- Machine learning-based pattern discovery
- User feedback integration
- Cross-session workflow persistence
- Advanced token optimization strategies









