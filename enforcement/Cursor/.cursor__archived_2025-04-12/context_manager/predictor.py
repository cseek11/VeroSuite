#!/usr/bin/env python3
"""
Context Prediction Engine
Predicts next tasks based on current task and workflow history.

Last Updated: 2025-12-04
"""

from typing import Dict, List, Optional, Tuple
from dataclasses import dataclass
import math

# Add project root to path
import sys
from pathlib import Path
project_root = Path(__file__).parent.parent.parent
sys.path.insert(0, str(project_root))

try:
    from logger_util import get_logger, get_or_create_trace_context
    logger = get_logger(context="predictor")
except ImportError:
    import logging
    logging.basicConfig(level=logging.INFO)
    logger = logging.getLogger("predictor")

from .workflow_patterns import WorkflowPatterns
from .workflow_tracker import WorkflowTracker


@dataclass(slots=True)  # Python 3.10+ - reduces memory by 4-5×
class TaskPrediction:
    """Represents a predicted next task."""
    task: str
    probability: float
    reason: str
    workflow_name: Optional[str] = None


class ContextPredictor:
    """Predicts next tasks based on current task and history."""
    
    # Common transition probabilities (fallback when no workflow detected)
    TRANSITION_PROBABILITIES = {
        'edit_code': [
            ('run_tests', 0.75),
            ('write_docs', 0.30),
            ('review_code', 0.25)
        ],
        'run_tests': [
            ('fix_bug', 0.50),      # If tests fail
            ('write_docs', 0.40),   # If tests pass
            ('review_code', 0.35)
        ],
        'fix_bug': [
            ('run_tests', 0.85),
            ('debug', 0.30)
        ],
        'write_docs': [
            ('review_code', 0.45),
            ('edit_code', 0.20)
        ],
        'refactor': [
            ('run_tests', 0.80),
            ('review_code', 0.50)
        ],
        'add_feature': [
            ('run_tests', 0.70),
            ('write_docs', 0.50),
            ('review_code', 0.40)
        ],
        'debug': [
            ('fix_bug', 0.75),
            ('run_tests', 0.60)
        ],
        'review_code': [
            ('edit_code', 0.40),
            ('run_tests', 0.30)
        ]
    }
    
    def __init__(self, workflow_tracker: Optional[WorkflowTracker] = None,
                 transition_stats: Optional[Dict[Tuple[str, str], int]] = None):
        """
        Initialize context predictor.
        
        Args:
            workflow_tracker: WorkflowTracker instance (optional, creates new if None)
            transition_stats: Dictionary mapping (current_task, next_task) tuples to counts
        """
        self.workflow_tracker = workflow_tracker or WorkflowTracker()
        self.task_history: List[str] = []  # Last 10 tasks
        self.max_history = 10
        
        # Load transition statistics (dynamic patterns learned from history)
        if transition_stats is None:
            transition_stats = self._load_transition_stats()
        self.transition_stats = transition_stats
        
        # Load static workflow patterns (base weights for transitions)
        self.workflow_patterns = self._build_static_patterns()
    
    def predict_next_tasks(self, current_task: Dict, session_sequence_context: Optional[Dict] = None) -> List[TaskPrediction]:
        """
        Enhanced prediction using session sequence + static patterns + dynamic stats + message analysis.
        
        Priority order:
        1. Session sequence (current session workflow) - HIGHEST PRIORITY
        2. Conditional predictions (based on task outcomes)
        3. Static workflow patterns (base weights)
        4. Dynamic transition stats (learned from history)
        5. Message semantic analysis
        
        Args:
            current_task: Dict with 'primary_task', 'files', 'user_message', etc.
            session_sequence_context: Optional session sequence context from SessionSequenceTracker
            
        Returns:
            List of TaskPrediction objects (sorted by probability, top 3)
        """
        current_type = current_task.get('primary_task', 'unknown')
        scores: Dict[str, float] = {}
        
        # PRIORITY 1: Session-aware predictions (if session sequence available)
        if session_sequence_context:
            session_predictions = self._predict_from_session_sequence(session_sequence_context, current_task)
            if session_predictions:
                # Session predictions get highest weight (3x multiplier)
                for pred in session_predictions:
                    scores[pred.task] = scores.get(pred.task, 0.0) + (pred.probability * 3.0)
        
        # PRIORITY 2: Conditional predictions (based on previous task outcomes)
        conditional_predictions = self._predict_conditional_next_tasks(current_task, session_sequence_context)
        if conditional_predictions:
            # Conditional predictions get high weight (2x multiplier)
            for pred in conditional_predictions:
                scores[pred.task] = scores.get(pred.task, 0.0) + (pred.probability * 2.0)
        
        # PRIORITY 3: Static workflow patterns (base weights)
        static_patterns = self.workflow_patterns.get(current_type, {})
        for next_task, base_weight in static_patterns.items():
            scores[next_task] = scores.get(next_task, 0.0) + base_weight
        
        # PRIORITY 4: Dynamic transition stats (learned from history)
        for (src, dst), count in self.transition_stats.items():
            if src == current_type:
                # Log-scaled count to avoid dominance of high-frequency transitions
                scores[dst] = scores.get(dst, 0.0) + math.log1p(count)
        
        # PRIORITY 5: Message semantic analysis (enhance existing heuristics)
        user_msg = (current_task.get('user_message') or '').lower()
        if 'test' in user_msg or 'assert' in user_msg or 'verify' in user_msg:
            scores['run_tests'] = scores.get('run_tests', 0.0) + 1.5
        if 'doc' in user_msg or 'readme' in user_msg or 'document' in user_msg:
            scores['write_docs'] = scores.get('write_docs', 0.0) + 1.0
        if 'refactor' in user_msg or 'cleanup' in user_msg or 'improve' in user_msg:
            scores['refactor'] = scores.get('refactor', 0.0) + 1.0
        if 'bug' in user_msg or 'fix' in user_msg or 'error' in user_msg:
            scores['fix_bug'] = scores.get('fix_bug', 0.0) + 1.2
        if 'review' in user_msg or 'check' in user_msg or 'inspect' in user_msg:
            scores['review_code'] = scores.get('review_code', 0.0) + 1.0
        
        # PRIORITY 6: File type patterns (enhance existing conditional predictions)
        files = current_task.get('files', [])
        if any('test' in str(f).lower() for f in files):
            scores['run_tests'] = scores.get('run_tests', 0.0) + 0.8
        
        # Normalize scores to probabilities
        predictions = self._normalize_scores(scores, current_task)
        
        # Sort by probability and return top 3
        predictions.sort(key=lambda x: x.probability, reverse=True)
        return predictions[:3]
    
    def _detect_workflow(self, current_task: Dict) -> Optional[Dict]:
        """
        Match current task sequence to known workflow patterns.
        
        Args:
            current_task: Current task dict
            
        Returns:
            Workflow dict with name, sequence, probability, or None
        """
        # Get recent task history
        recent_tasks = self.task_history[-5:] + [current_task.get('primary_task', '')]
        
        # Check against workflow patterns
        for workflow_name, workflow in WorkflowPatterns.PATTERNS.items():
            # Check if recent tasks match workflow sequence
            match_score = self._sequence_match_score(recent_tasks, workflow.sequence)
            
            # Check if user's language indicates this workflow
            user_message = current_task.get('user_message', '').lower()
            indicator_match = any(
                indicator in user_message
                for indicator in workflow.trigger_indicators
            )
            
            if match_score > 0.6 or indicator_match:
                return {
                    'name': workflow_name,
                    'sequence': workflow.sequence,
                    'probability': workflow.probability
                }
        
        return None
    
    def _sequence_match_score(self, recent_tasks: List[str], workflow_sequence: List[str]) -> float:
        """
        Calculate how well recent tasks match a workflow sequence.
        
        Args:
            recent_tasks: Recent task history
            workflow_sequence: Workflow pattern sequence
            
        Returns:
            Match score (0.0 to 1.0)
        """
        if not recent_tasks or not workflow_sequence:
            return 0.0
        
        # Check if recent tasks appear in workflow sequence in order
        sequence_index = 0
        matches = 0
        
        for task in recent_tasks:
            if sequence_index < len(workflow_sequence):
                if task == workflow_sequence[sequence_index]:
                    matches += 1
                    sequence_index += 1
                elif task in workflow_sequence:
                    # Task is in sequence but not at expected position
                    # Find its position and continue from there
                    try:
                        sequence_index = workflow_sequence.index(task) + 1
                        matches += 0.5  # Partial match
                    except ValueError:
                        pass
        
        # Normalize by sequence length
        return matches / len(workflow_sequence) if workflow_sequence else 0.0
    
    def _get_next_in_workflow(self, workflow: Dict, current_task: Dict) -> Optional[Dict]:
        """
        Get next task in workflow sequence.
        
        Args:
            workflow: Workflow dict
            current_task: Current task dict
            
        Returns:
            Next task dict or None
        """
        sequence = workflow['sequence']
        current = current_task.get('primary_task', '')
        
        try:
            current_index = sequence.index(current)
            if current_index < len(sequence) - 1:
                next_task = sequence[current_index + 1]
                return {
                    'task': next_task,
                    'confidence': 1.0
                }
        except ValueError:
            # Current task not in sequence, try to find closest match
            pass
        
        return None
    
    def _get_common_transitions(self, current_task: Dict) -> List[TaskPrediction]:
        """
        Fallback: Statistical transitions when no workflow detected.
        
        Args:
            current_task: Current task dict
            
        Returns:
            List of TaskPrediction objects
        """
        current = current_task.get('primary_task', '')
        transitions = self.TRANSITION_PROBABILITIES.get(current, [])
        
        return [
            TaskPrediction(
                task=task,
                probability=prob,
                reason='Common transition pattern'
            )
            for task, prob in transitions
        ]
    
    def _predict_from_session_sequence(self, session_sequence_context: Dict, current_task: Dict) -> List[TaskPrediction]:
        """
        Predict next tasks based on current session's task sequence.
        
        This prioritizes the current session's workflow over historical patterns.
        
        Args:
            session_sequence_context: Session sequence context from SessionSequenceTracker
            current_task: Current task dict
            
        Returns:
            List of TaskPrediction objects based on session sequence
        """
        predictions = []
        current_type = current_task.get('primary_task', 'unknown')
        
        # Get recent tasks from session
        recent_tasks = session_sequence_context.get('recent_tasks', [])
        previous_task = session_sequence_context.get('previous_task')
        previous_outcome = session_sequence_context.get('previous_outcome')
        
        # If we have a previous task, use session-aware transitions
        if previous_task:
            # Use session sequence to predict next task
            # Example: investigate → edit → test → (conditional)
            
            # Pattern: investigate → edit (if issues found)
            if previous_task == 'investigate' and current_type == 'edit_code':
                predictions.append(TaskPrediction(
                    task='run_tests',
                    probability=0.85,
                    reason='Session pattern: investigate → edit → test',
                    workflow_name='investigation_workflow'
                ))
            
            # Pattern: edit → test
            elif previous_task == 'edit_code' and current_type == 'run_tests':
                # Conditional: if test fails → edit, if passes → docs
                predictions.append(TaskPrediction(
                    task='fix_bug',
                    probability=0.70,
                    reason='Session pattern: edit → test → fix (if test fails)',
                    workflow_name='edit_test_cycle'
                ))
                predictions.append(TaskPrediction(
                    task='write_docs',
                    probability=0.65,
                    reason='Session pattern: edit → test → docs (if test passes)',
                    workflow_name='edit_test_cycle'
                ))
            
            # Pattern: fix_bug → test
            elif previous_task == 'fix_bug' and current_type == 'run_tests':
                predictions.append(TaskPrediction(
                    task='write_docs',
                    probability=0.75,
                    reason='Session pattern: fix → test → docs (if test passes)',
                    workflow_name='bug_fix_workflow'
                ))
        
        # If no previous task, use current task to predict next
        if not predictions:
            # Use static patterns but with session context
            transitions = self.TRANSITION_PROBABILITIES.get(current_type, [])
            for task, prob in transitions:
                predictions.append(TaskPrediction(
                    task=task,
                    probability=prob,
                    reason=f'Session-aware prediction from {current_type}',
                    workflow_name='session_workflow'
                ))
        
        return predictions
    
    def _predict_conditional_next_tasks(self, current_task: Dict, session_sequence_context: Optional[Dict] = None) -> List[TaskPrediction]:
        """
        Predict next tasks with conditional outcomes based on previous task results.
        
        Example:
            - Previous: run_tests, outcome: failure → predict: fix_bug, edit_code
            - Previous: run_tests, outcome: success → predict: write_docs, review_code
            - Previous: investigate, outcome: found_issues → predict: edit_code, fix_bug
        
        Args:
            current_task: Current task dict
            session_sequence_context: Optional session sequence context
            
        Returns:
            List of TaskPrediction objects with conditional logic
        """
        predictions = []
        current_type = current_task.get('primary_task', 'unknown')
        
        # Get previous task outcome from session sequence
        previous_outcome = None
        previous_task = None
        if session_sequence_context:
            previous_outcome = session_sequence_context.get('previous_outcome')
            previous_task = session_sequence_context.get('previous_task')
        
        # Conditional: If previous task was run_tests
        if previous_task == 'run_tests':
            if previous_outcome == 'failure':
                # Tests failed → likely need to fix bugs and edit code
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
            elif previous_outcome == 'success':
                # Tests passed → likely to document or review
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
        
        # Conditional: If previous task was investigate
        if previous_task == 'investigate':
            if previous_outcome in ['found_issues', 'found_bug', 'failure']:
                # Investigation found issues → likely to edit or fix
                predictions.append(TaskPrediction(
                    task='edit_code',
                    probability=0.80,
                    reason='Investigation found issues, likely to edit based on findings'
                ))
                predictions.append(TaskPrediction(
                    task='fix_bug',
                    probability=0.65,
                    reason='Investigation may have found bugs to fix'
                ))
            elif previous_outcome == 'success' or previous_outcome is None:
                # Investigation complete but no issues → might document or move on
                predictions.append(TaskPrediction(
                    task='write_docs',
                    probability=0.50,
                    reason='Investigation complete, may document findings'
                ))
        
        # Conditional: If previous task was fix_bug
        if previous_task == 'fix_bug':
            # After fixing bug, likely to test
            predictions.append(TaskPrediction(
                task='run_tests',
                probability=0.85,
                reason='Bug fix typically followed by test verification'
            ))
        
        # Fallback: Use existing conditional logic if no session context
        if not predictions:
            # If editing code in a test file, likely to run tests next
            if current_type == 'edit_code':
                files = current_task.get('files', [])
                if any('test' in str(f).lower() for f in files):
                    predictions.append(TaskPrediction(
                        task='run_tests',
                        probability=0.90,
                        reason='Modified test file, likely to verify tests'
                    ))
            
            # If multiple files edited, likely to review
            files = current_task.get('files', [])
            if len(files) > 3:
                predictions.append(TaskPrediction(
                    task='review_code',
                    probability=0.65,
                    reason='Multiple files changed, review recommended'
                ))
            
            # If fixing bug, likely to run tests next
            if current_type == 'fix_bug':
                predictions.append(TaskPrediction(
                    task='run_tests',
                    probability=0.85,
                    reason='Bug fix typically followed by test verification'
                ))
        
        return predictions
    
    def _get_conditional_predictions(self, current_task: Dict) -> List[TaskPrediction]:
        """
        Legacy method - kept for backward compatibility.
        Use _predict_conditional_next_tasks() instead.
        
        Args:
            current_task: Current task dict
            
        Returns:
            List of TaskPrediction objects
        """
        return self._predict_conditional_next_tasks(current_task, None)
    
    def _build_static_patterns(self) -> Dict[str, Dict[str, float]]:
        """
        Build static workflow patterns from TRANSITION_PROBABILITIES.
        
        Returns:
            Dictionary mapping current_task -> {next_task: base_weight}
        """
        patterns: Dict[str, Dict[str, float]] = {}
        for current_task, transitions in self.TRANSITION_PROBABILITIES.items():
            patterns[current_task] = {}
            for next_task, prob in transitions:
                patterns[current_task][next_task] = prob
        return patterns
    
    def _load_transition_stats(self) -> Dict[Tuple[str, str], int]:
        """
        Load transition statistics from prediction_history.json or workflow_tracker.
        
        Returns:
            Dictionary mapping (current_task, next_task) -> count
        """
        stats: Dict[Tuple[str, str], int] = {}
        
        # Try to load from prediction_history.json
        try:
            history_file = Path(__file__).parent / "prediction_history.json"
            if history_file.exists():
                import json
                with open(history_file, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                    # Convert string keys to tuples
                    for key, count in data.get('transitions', {}).items():
                        if isinstance(key, str) and ',' in key:
                            parts = key.split(',')
                            if len(parts) == 2:
                                stats[(parts[0].strip(), parts[1].strip())] = count
        except Exception as e:
            logger.warn(
                f"Failed to load transition stats from file: {e}",
                operation="_load_transition_stats",
                error_code="LOAD_STATS_FAILED",
                root_cause=str(e)
            )
        
        # Try to get stats from workflow_tracker
        try:
            if hasattr(self.workflow_tracker, 'get_transition_stats'):
                tracker_stats = self.workflow_tracker.get_transition_stats()
                # Merge with file-based stats (tracker takes precedence)
                stats.update(tracker_stats)
        except Exception as e:
            logger.debug(
                f"Workflow tracker doesn't provide transition stats: {e}",
                operation="_load_transition_stats"
            )
        
        return stats
    
    def _normalize_scores(self, scores: Dict[str, float], current_task: Dict) -> List[TaskPrediction]:
        """
        Normalize scores to probabilities and create TaskPrediction objects.
        
        Args:
            scores: Dictionary mapping task -> score
            current_task: Current task dict (for context)
            
        Returns:
            List of TaskPrediction objects
        """
        if not scores:
            return []
        
        # Normalize: sum all positive scores, divide each by total
        total = sum(max(v, 0.0) for v in scores.values())
        if total <= 0:
            # All zeros or negatives, return flat distribution
            n = len(scores)
            return [
                TaskPrediction(
                    task=task,
                    probability=1.0 / n if n > 0 else 0.0,
                    reason='Equal probability (no signal)'
                )
                for task in scores.keys()
            ]
        
        # Create predictions with normalized probabilities
        predictions = []
        for task, score in scores.items():
            probability = max(score, 0.0) / total
            predictions.append(TaskPrediction(
                task=task,
                probability=probability,
                reason=self._generate_reason(task, score, current_task)
            ))
        
        return predictions
    
    def _generate_reason(self, task: str, score: float, current_task: Dict) -> str:
        """Generate human-readable reason for prediction."""
        reasons = []
        
        current_type = current_task.get('primary_task', 'unknown')
        if (current_type, task) in self.transition_stats:
            count = self.transition_stats[(current_type, task)]
            reasons.append(f"Observed {count} times in history")
        
        if task in self.workflow_patterns.get(current_type, {}):
            reasons.append("Common transition pattern")
        
        user_msg = (current_task.get('user_message') or '').lower()
        if any(keyword in user_msg for keyword in ['test', 'doc', 'refactor', 'bug', 'review']):
            reasons.append("Message semantic analysis")
        
        return "; ".join(reasons) if reasons else "Predicted based on patterns"
    
    def update_history(self, task_type: str) -> None:
        """
        Update task history.
        
        Args:
            task_type: Task type to add to history
        """
        self.task_history.append(task_type)
        # Keep only last N tasks
        if len(self.task_history) > self.max_history:
            self.task_history = self.task_history[-self.max_history:]

