# Session-Aware Prediction System Proposal

**Date:** 2025-12-02  
**Status:** Proposal  
**Priority:** High  
**Author:** User Request + AI Analysis

---

## Problem Statement

**Current Behavior:**
- Predictions are based on historical patterns across ALL sessions
- Uses static transition probabilities that don't consider current session workflow
- Predicts immediately without waiting for task assignment
- Doesn't consider conditional outcomes (if test fails → edit, if passes → docs)

**User's Example:**
```
User: "investigate xyz.py"
Current System: Predicts "run_tests" (74%) based on historical patterns
User's Vision: 
  - Current: investigate
  - Next: edit (if investigation finds issues)
  - Then: test (after edit)
  - Then: edit (if test fails) OR docs (if test passes)
```

---

## Current System Analysis

### How It Works Now

1. **Task Detection** (`task_detector.py`):
   - Analyzes user message and files
   - Classifies task type (edit_code, run_tests, etc.)

2. **Prediction** (`predictor.py`):
   - Uses `TRANSITION_PROBABILITIES` (static patterns)
   - Uses `transition_stats` (historical data across sessions)
   - Uses message semantic analysis
   - Uses file type patterns

3. **Workflow Tracking** (`workflow_tracker.py`):
   - Tracks workflows by file set + time window
   - Groups tasks into workflows
   - But doesn't use current session's task sequence for prediction

### The Gap

**Missing:**
- Session-aware task sequence tracking
- Conditional predictions based on task outcomes
- Delayed prediction until task is assigned
- Current session workflow awareness

---

## Proposed Solution

### 1. Session-Aware Task Sequence Tracking

**New Component:** `SessionTaskSequence`

```python
@dataclass
class SessionTaskSequence:
    """Tracks task sequence within current session."""
    session_id: str
    tasks: List[TaskRecord]  # Ordered list of tasks in this session
    current_task: Optional[str]  # Currently active task
    task_outcomes: Dict[str, str]  # Task -> outcome (success/failure/pending)
    
@dataclass
class TaskRecord:
    """Record of a task in session sequence."""
    task_type: str
    timestamp: str
    files: List[str]
    outcome: Optional[str]  # success, failure, pending
    user_message: str
```

**Changes to `predictor.py`:**

```python
def predict_next_tasks(self, current_task: Dict, session_sequence: Optional[SessionTaskSequence] = None) -> List[TaskPrediction]:
    """
    Predict next tasks with session awareness.
    
    Args:
        current_task: Current task dict
        session_sequence: Current session's task sequence (if available)
    """
    # Priority 1: Use current session sequence if available
    if session_sequence and len(session_sequence.tasks) > 0:
        predictions = self._predict_from_session_sequence(session_sequence, current_task)
        if predictions:
            return predictions
    
    # Priority 2: Use workflow tracker's current workflow
    if self.workflow_tracker:
        workflow = self._get_current_workflow()
        if workflow and len(workflow.tasks) > 1:
            predictions = self._predict_from_workflow(workflow, current_task)
            if predictions:
                return predictions
    
    # Priority 3: Fallback to historical patterns (current behavior)
    return self._predict_from_historical_patterns(current_task)
```

---

### 2. Conditional Predictions

**New Method:** `_predict_conditional_next_tasks()`

```python
def _predict_conditional_next_tasks(self, current_task: Dict, previous_task: Optional[TaskRecord] = None) -> List[TaskPrediction]:
    """
    Predict next tasks with conditional outcomes.
    
    Example:
        - Current: run_tests
        - If outcome = failure → predict: fix_bug, edit_code
        - If outcome = success → predict: write_docs, review_code
    """
    predictions = []
    
    # If previous task was run_tests
    if previous_task and previous_task.task_type == 'run_tests':
        if previous_task.outcome == 'failure':
            predictions.append(TaskPrediction(
                task='fix_bug',
                probability=0.85,
                reason='Tests failed, likely need to fix bugs'
            ))
            predictions.append(TaskPrediction(
                task='edit_code',
                probability=0.75,
                reason='Tests failed, likely need to edit code'
            ))
        elif previous_task.outcome == 'success':
            predictions.append(TaskPrediction(
                task='write_docs',
                probability=0.70,
                reason='Tests passed, likely to document changes'
            ))
            predictions.append(TaskPrediction(
                task='review_code',
                probability=0.60,
                reason='Tests passed, ready for review'
            ))
    
    # If previous task was investigate
    if previous_task and previous_task.task_type == 'investigate':
        predictions.append(TaskPrediction(
            task='edit_code',
            probability=0.80,
            reason='Investigation complete, likely to edit based on findings'
        ))
        predictions.append(TaskPrediction(
            task='fix_bug',
            probability=0.65,
            reason='Investigation may have found bugs to fix'
        ))
    
    return predictions
```

---

### 3. Delayed Prediction Until Task Assignment

**Current Behavior:**
- Predictions generated immediately when files change
- Doesn't wait for user to assign/start task

**Proposed Behavior:**
- Track "pending tasks" (detected but not started)
- Only predict when task is actually assigned/started
- Use task assignment as trigger for prediction

**Changes to `auto-enforcer.py`:**

```python
def _update_context_recommendations(self):
    """Update context recommendations based on current task and predictions."""
    
    # Detect current task
    task_detection = self.task_detector.detect_task(...)
    
    # Check if task is actually assigned (not just detected)
    if not self._is_task_assigned(task_detection):
        # Don't predict yet - task is pending
        logger.debug("Task detected but not assigned, skipping prediction")
        return
    
    # Task is assigned - now predict
    current_task = {
        'primary_task': task_detection.primary_task,
        'files': changed_files,
        'user_message': user_message
    }
    
    # Get session sequence for session-aware prediction
    session_sequence = self._get_current_session_sequence()
    
    # Predict with session awareness
    predictions = self.predictor.predict_next_tasks(
        current_task,
        session_sequence=session_sequence
    )
```

**New Method:** `_is_task_assigned()`

```python
def _is_task_assigned(self, task_detection: TaskDetection) -> bool:
    """
    Check if task is actually assigned (not just detected from file changes).
    
    Criteria:
    - User explicitly mentioned task in message
    - Task is part of active workflow
    - Task has high confidence (>0.8)
    """
    # If user message explicitly mentions task, it's assigned
    user_message = task_detection.user_message or ''
    task_keywords = {
        'edit_code': ['edit', 'modify', 'change', 'update', 'implement'],
        'run_tests': ['test', 'run test', 'verify', 'check'],
        'investigate': ['investigate', 'check', 'examine', 'look at'],
        'fix_bug': ['fix', 'bug', 'error', 'issue'],
    }
    
    keywords = task_keywords.get(task_detection.primary_task, [])
    if any(keyword in user_message.lower() for keyword in keywords):
        return True
    
    # If high confidence, likely assigned
    if task_detection.confidence > 0.8:
        return True
    
    return False
```

---

### 4. Session Sequence Tracking

**New Component:** `SessionSequenceTracker`

```python
class SessionSequenceTracker:
    """Tracks task sequence within current session."""
    
    def __init__(self, session_id: str):
        self.session_id = session_id
        self.sequence: List[TaskRecord] = []
        self.current_task: Optional[str] = None
    
    def add_task(self, task_type: str, files: List[str], user_message: str) -> TaskRecord:
        """Add task to sequence."""
        task_record = TaskRecord(
            task_type=task_type,
            timestamp=datetime.now(timezone.utc).isoformat(),
            files=files,
            outcome='pending',
            user_message=user_message
        )
        self.sequence.append(task_record)
        self.current_task = task_type
        return task_record
    
    def update_outcome(self, task_type: str, outcome: str):
        """Update task outcome (success/failure)."""
        for task in reversed(self.sequence):
            if task.task_type == task_type and task.outcome == 'pending':
                task.outcome = outcome
                break
    
    def get_previous_task(self) -> Optional[TaskRecord]:
        """Get previous task in sequence."""
        if len(self.sequence) < 2:
            return None
        return self.sequence[-2]
    
    def get_sequence_context(self) -> Dict:
        """Get context for prediction."""
        return {
            'session_id': self.session_id,
            'task_count': len(self.sequence),
            'recent_tasks': [t.task_type for t in self.sequence[-3:]],
            'current_task': self.current_task,
            'previous_task': self.get_previous_task()
        }
```

---

## Implementation Plan

### Phase 1: Session Sequence Tracking (Foundation)

1. **Create `SessionSequenceTracker` class**
   - Track tasks in current session
   - Store task outcomes
   - Provide sequence context

2. **Integrate with `auto-enforcer.py`**
   - Initialize tracker per session
   - Add tasks when detected
   - Update outcomes when tasks complete

3. **Store session sequence**
   - Save to `.cursor/context_manager/session_sequence.json`
   - Load on session start
   - Persist across enforcement runs

### Phase 2: Session-Aware Prediction

1. **Modify `predictor.py`**
   - Add `session_sequence` parameter to `predict_next_tasks()`
   - Implement `_predict_from_session_sequence()`
   - Prioritize session sequence over historical patterns

2. **Update `auto-enforcer.py`**
   - Pass session sequence to predictor
   - Use session sequence for predictions

### Phase 3: Conditional Predictions

1. **Add conditional prediction logic**
   - Implement `_predict_conditional_next_tasks()`
   - Handle test outcomes (pass/fail)
   - Handle investigation outcomes (found issues/clean)

2. **Integrate with task outcomes**
   - Detect task outcomes (test results, investigation findings)
   - Update session sequence with outcomes
   - Use outcomes for conditional predictions

### Phase 4: Delayed Prediction

1. **Add task assignment detection**
   - Implement `_is_task_assigned()`
   - Check user message for explicit task assignment
   - Check confidence threshold

2. **Update prediction trigger**
   - Only predict when task is assigned
   - Skip prediction for pending tasks

---

## Example Workflow

### User Journey

```
1. User: "investigate xyz.py"
   - Task detected: investigate
   - Task assigned: YES (explicit in message)
   - Predict: edit_code (80%), fix_bug (65%)
   - Pre-load: edit_code context

2. User: "fix the bug in xyz.py"
   - Task detected: fix_bug
   - Task assigned: YES
   - Previous task: investigate (outcome: found_bug)
   - Predict: run_tests (85%), edit_code (75%)
   - Pre-load: test context

3. User: "run tests"
   - Task detected: run_tests
   - Task assigned: YES
   - Previous task: fix_bug
   - Predict: write_docs (70% if pass), fix_bug (85% if fail)
   - Pre-load: docs context (conditional)

4. Tests pass
   - Task outcome: success
   - Update session sequence
   - Predict: write_docs (70%), review_code (60%)
   - Pre-load: docs context
```

---

## Benefits

1. **More Accurate Predictions**
   - Based on current session workflow, not historical patterns
   - Considers task outcomes and context

2. **Better Context Pre-loading**
   - Pre-loads context for likely next tasks
   - Conditional pre-loading based on outcomes

3. **Reduced False Positives**
   - Only predicts when task is assigned
   - Avoids predicting for pending/detected tasks

4. **Session Continuity**
   - Maintains workflow awareness across tasks
   - Tracks task sequence and outcomes

---

## Migration Path

1. **Backward Compatible**
   - Keep existing prediction logic as fallback
   - Gradually enhance with session awareness

2. **Feature Flag**
   - Add `SESSION_AWARE_PREDICTION` flag
   - Enable/disable new behavior

3. **Testing**
   - Test with real user workflows
   - Compare accuracy vs. current system
   - Measure context efficiency improvements

---

## Files to Modify

1. `.cursor/context_manager/predictor.py`
   - Add session sequence support
   - Add conditional prediction logic

2. `.cursor/scripts/auto-enforcer.py`
   - Add session sequence tracking
   - Add task assignment detection
   - Pass session sequence to predictor

3. **New File:** `.cursor/context_manager/session_sequence_tracker.py`
   - Session sequence tracking implementation

4. **New File:** `.cursor/context_manager/session_sequence.json`
   - Session sequence persistence

---

**Last Updated:** 2025-12-02






