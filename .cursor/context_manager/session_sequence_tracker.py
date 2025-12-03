#!/usr/bin/env python3
"""
Session-Aware Task Sequence Tracker
Tracks task sequence within current session for session-aware predictions.

Last Updated: 2025-12-02
"""

import json
from datetime import datetime, timezone
from pathlib import Path
from typing import Dict, List, Optional
from dataclasses import dataclass, asdict

# Add project root to path
import sys
project_root = Path(__file__).parent.parent.parent
sys.path.insert(0, str(project_root))

try:
    from logger_util import get_logger, get_or_create_trace_context
    logger = get_logger(context="session_sequence_tracker")
except ImportError:
    import logging
    logging.basicConfig(level=logging.INFO)
    logger = logging.getLogger("session_sequence_tracker")


@dataclass
class TaskRecord:
    """Record of a task in session sequence."""
    task_type: str
    timestamp: str
    files: List[str]
    outcome: Optional[str]  # success, failure, pending, or None
    user_message: str
    assigned: bool = False  # True if task was explicitly assigned by user


@dataclass
class SessionTaskSequence:
    """Tracks task sequence within current session."""
    session_id: str
    tasks: List[TaskRecord]
    current_task: Optional[str]  # Currently active task
    task_outcomes: Dict[str, str]  # Task -> outcome mapping


class SessionSequenceTracker:
    """Tracks task sequence within current session for session-aware predictions."""
    
    def __init__(self, session_id: str, state_file: Optional[Path] = None):
        """
        Initialize session sequence tracker.
        
        Args:
            session_id: Current session ID
            state_file: Path to session_sequence.json (default: .cursor/context_manager/session_sequence.json)
        """
        self.session_id = session_id
        
        if state_file is None:
            state_file = Path(__file__).parent / "session_sequence.json"
        self.state_file = state_file
        
        # Load existing sequence or create new
        self.sequence = SessionTaskSequence(
            session_id=session_id,
            tasks=[],
            current_task=None,
            task_outcomes={}
        )
        
        self._load_state()
    
    def _load_state(self) -> None:
        """Load session sequence from JSON file."""
        if not self.state_file.exists():
            return
        
        try:
            with open(self.state_file, 'r', encoding='utf-8') as f:
                data = json.load(f)
                
                # Only load if session ID matches
                if data.get('session_id') == self.session_id:
                    tasks = [
                        TaskRecord(**task_data)
                        for task_data in data.get('tasks', [])
                    ]
                    self.sequence = SessionTaskSequence(
                        session_id=data.get('session_id', self.session_id),
                        tasks=tasks,
                        current_task=data.get('current_task'),
                        task_outcomes=data.get('task_outcomes', {})
                    )
                    
                    logger.info(
                        "Session sequence loaded",
                        operation="_load_state",
                        session_id=self.session_id,
                        task_count=len(tasks)
                    )
        except Exception as e:
            logger.warn(
                f"Failed to load session sequence: {e}",
                operation="_load_state",
                error_code="LOAD_FAILED",
                root_cause=str(e)
            )
    
    def _save_state(self) -> None:
        """Save session sequence to JSON file."""
        try:
            data = {
                'session_id': self.sequence.session_id,
                'tasks': [asdict(task) for task in self.sequence.tasks],
                'current_task': self.sequence.current_task,
                'task_outcomes': self.sequence.task_outcomes,
                'last_updated': datetime.now(timezone.utc).isoformat()
            }
            
            with open(self.state_file, 'w', encoding='utf-8') as f:
                json.dump(data, f, indent=2, ensure_ascii=False)
            
            logger.debug(
                "Session sequence saved",
                operation="_save_state",
                session_id=self.session_id,
                task_count=len(self.sequence.tasks)
            )
        except Exception as e:
            logger.error(
                f"Failed to save session sequence: {e}",
                operation="_save_state",
                error_code="SAVE_FAILED",
                root_cause=str(e)
            )
    
    def add_task(self, task_type: str, files: List[str], user_message: str, assigned: bool = False) -> TaskRecord:
        """
        Add task to sequence.
        
        Args:
            task_type: Type of task (e.g., 'edit_code', 'run_tests')
            files: List of file paths involved
            user_message: User message that triggered task
            assigned: True if task was explicitly assigned by user
            
        Returns:
            TaskRecord object
        """
        task_record = TaskRecord(
            task_type=task_type,
            timestamp=datetime.now(timezone.utc).isoformat(),
            files=files,
            outcome='pending' if assigned else None,
            user_message=user_message,
            assigned=assigned
        )
        
        self.sequence.tasks.append(task_record)
        self.sequence.current_task = task_type
        
        logger.info(
            f"Task added to session sequence: {task_type}",
            operation="add_task",
            session_id=self.session_id,
            task_type=task_type,
            assigned=assigned,
            task_count=len(self.sequence.tasks)
        )
        
        self._save_state()
        return task_record
    
    def update_outcome(self, task_type: str, outcome: str) -> None:
        """
        Update task outcome (success/failure).
        
        Args:
            task_type: Type of task
            outcome: Outcome (success, failure, or other)
        """
        # Update most recent matching task
        for task in reversed(self.sequence.tasks):
            if task.task_type == task_type and (task.outcome is None or task.outcome == 'pending'):
                task.outcome = outcome
                self.sequence.task_outcomes[task_type] = outcome
                
                logger.info(
                    f"Task outcome updated: {task_type} -> {outcome}",
                    operation="update_outcome",
                    session_id=self.session_id,
                    task_type=task_type,
                    outcome=outcome
                )
                break
        
        self._save_state()
    
    def get_previous_task(self) -> Optional[TaskRecord]:
        """Get previous task in sequence."""
        if len(self.sequence.tasks) < 2:
            return None
        return self.sequence.tasks[-2]
    
    def get_sequence_context(self) -> Dict:
        """
        Get context for prediction.
        
        Returns:
            Dict with sequence context
        """
        return {
            'session_id': self.session_id,
            'task_count': len(self.sequence.tasks),
            'recent_tasks': [t.task_type for t in self.sequence.tasks[-3:]],
            'current_task': self.sequence.current_task,
            'previous_task': self.get_previous_task().task_type if self.get_previous_task() else None,
            'previous_outcome': self.get_previous_task().outcome if self.get_previous_task() else None,
            'task_outcomes': self.sequence.task_outcomes
        }
    
    def is_task_assigned(self, task_type: str, user_message: str, confidence: float) -> bool:
        """
        Check if task is actually assigned (not just detected).
        
        Args:
            task_type: Detected task type
            user_message: User message
            confidence: Detection confidence
            
        Returns:
            True if task is assigned, False if just detected
        """
        # If high confidence (>0.8), likely assigned
        if confidence > 0.8:
            return True
        
        # Check if user message explicitly mentions task
        user_message_lower = user_message.lower()
        
        # CRITICAL FIX: Recognize imperative commands as explicit task assignments
        # These indicate the user is directly instructing the agent to do something
        imperative_verbs = [
            'run', 'execute', 'try', 'do', 'perform', 'run the', 'try running',
            'please run', 'please execute', 'can you run', 'could you run',
            'run this', 'execute this', 'try this', 'do this'
        ]
        
        # If message contains imperative verbs, it's an explicit task assignment
        if any(verb in user_message_lower for verb in imperative_verbs):
            logger.info(
                f"Task assignment detected via imperative verb: '{user_message}' (matched verb: {[v for v in imperative_verbs if v in user_message_lower][0] if any(v in user_message_lower for v in imperative_verbs) else 'none'})",
                operation="is_task_assigned",
                user_message=user_message,
                task_type=task_type,
                matched_verb=[v for v in imperative_verbs if v in user_message_lower][0] if any(v in user_message_lower for v in imperative_verbs) else None
            )
            return True
        
        task_keywords = {
            'edit_code': ['edit', 'modify', 'change', 'update', 'implement', 'add', 'create'],
            'run_tests': ['test', 'run test', 'verify', 'check', 'test this'],
            'investigate': ['investigate', 'check', 'examine', 'look at', 'review', 'analyze'],
            'fix_bug': ['fix', 'bug', 'error', 'issue', 'problem', 'broken'],
            'write_docs': ['doc', 'document', 'documentation', 'readme', 'comment'],
            'refactor': ['refactor', 'cleanup', 'improve', 'optimize'],
            'debug': ['debug', 'troubleshoot', 'diagnose'],
            'review_code': ['review', 'check', 'inspect', 'audit']
        }
        
        keywords = task_keywords.get(task_type, [])
        if any(keyword in user_message_lower for keyword in keywords):
            return True
        
        return False
    
    def clear_sequence(self) -> None:
        """Clear sequence (for new session)."""
        self.sequence.tasks = []
        self.sequence.current_task = None
        self.sequence.task_outcomes = {}
        self._save_state()
        
        logger.info(
            "Session sequence cleared",
            operation="clear_sequence",
            session_id=self.session_id
        )

