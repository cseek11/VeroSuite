#!/usr/bin/env python3
"""
Workflow Tracking Engine
Tracks development workflows by file patterns, time windows, and task sequences.

Last Updated: 2025-12-01
"""

import json
import hashlib
from datetime import datetime, timezone
from pathlib import Path
from typing import Dict, List, Optional, Set
from dataclasses import dataclass, asdict

# Add project root to path
import sys
project_root = Path(__file__).parent.parent.parent
sys.path.insert(0, str(project_root))

try:
    from logger_util import get_logger, get_or_create_trace_context
    logger = get_logger(context="workflow_tracker")
except ImportError:
    import logging
    logging.basicConfig(level=logging.INFO)
    logger = logging.getLogger("workflow_tracker")


@dataclass(slots=True)  # Python 3.10+ - reduces memory by 4-5×
class WorkflowTask:
    """Represents a task in a workflow."""
    task_type: str
    timestamp: str
    files: List[str]
    confidence: float


@dataclass(slots=True)  # Python 3.10+ - reduces memory by 4-5×
class Workflow:
    """Represents a development workflow."""
    workflow_id: str
    files: Set[str]
    tasks: List[WorkflowTask]
    start_time: str
    last_activity: str
    time_window_bucket: int  # 10-minute bucket
    detected_pattern: Optional[str] = None


class WorkflowTracker:
    """Tracks workflows by file set + time window."""
    
    # Time window for workflow boundaries (10 minutes)
    TIME_WINDOW_MINUTES = 10
    
    def __init__(self, state_file: Optional[Path] = None):
        """
        Initialize workflow tracker.
        
        Args:
            state_file: Path to workflow_state.json (default: .cursor/context_manager/workflow_state.json)
        """
        if state_file is None:
            state_file = Path(__file__).parent / "workflow_state.json"
        
        self.state_file = state_file
        self.active_workflows: Dict[str, Workflow] = {}
        self.completed_workflows: List[Workflow] = []
        self._load_state()
    
    def _load_state(self) -> None:
        """Load workflow state from JSON file."""
        if not self.state_file.exists():
            return
        
        try:
            with open(self.state_file, 'r', encoding='utf-8') as f:
                data = json.load(f)
                
                # Load active workflows
                for workflow_id, workflow_data in data.get('active_workflows', {}).items():
                    # Convert files list back to set
                    workflow_data['files'] = set(workflow_data.get('files', []))
                    # Convert tasks
                    tasks = [
                        WorkflowTask(**task_data)
                        for task_data in workflow_data.get('tasks', [])
                    ]
                    workflow_data['tasks'] = tasks
                    self.active_workflows[workflow_id] = Workflow(**workflow_data)
                
                logger.info(
                    "Workflow state loaded",
                    operation="_load_state",
                    active_workflows=len(self.active_workflows)
                )
        except Exception as e:
            logger.error(
                f"Failed to load workflow state: {e}",
                operation="_load_state",
                error_code="LOAD_FAILED",
                root_cause=str(e)
            )
    
    def _save_state(self) -> None:
        """Save workflow state to JSON file."""
        try:
            # Convert workflows to JSON-serializable format
            active_workflows_serializable = {}
            for workflow_id, workflow in self.active_workflows.items():
                workflow_dict = asdict(workflow)
                # Convert set to list for JSON
                workflow_dict['files'] = list(workflow_dict['files'])
                active_workflows_serializable[workflow_id] = workflow_dict
            
            data = {
                'active_workflows': active_workflows_serializable,
                'last_updated': datetime.now(timezone.utc).isoformat()
            }
            
            with open(self.state_file, 'w', encoding='utf-8') as f:
                json.dump(data, f, indent=2, ensure_ascii=False)
            
            logger.debug(
                "Workflow state saved",
                operation="_save_state",
                active_workflows=len(self.active_workflows)
            )
        except Exception as e:
            logger.error(
                f"Failed to save workflow state: {e}",
                operation="_save_state",
                error_code="SAVE_FAILED",
                root_cause=str(e)
            )
    
    def _get_time_window_bucket(self, timestamp: Optional[datetime] = None) -> int:
        """
        Get time window bucket (10-minute intervals).
        
        Args:
            timestamp: Timestamp to bucket (default: now)
            
        Returns:
            Bucket number (minutes since epoch / 10)
        """
        if timestamp is None:
            timestamp = datetime.now(timezone.utc)
        
        epoch = datetime(1970, 1, 1, tzinfo=timezone.utc)
        delta = timestamp - epoch
        minutes = int(delta.total_seconds() / 60)
        return minutes // self.TIME_WINDOW_MINUTES
    
    def _generate_workflow_id(self, files: Set[str], time_bucket: int) -> str:
        """
        Generate workflow ID from file set and time bucket.
        
        Args:
            files: Set of file paths
            time_bucket: Time window bucket
            
        Returns:
            Workflow ID (hash of files + time bucket)
        """
        # Sort files for consistent hashing
        files_sorted = sorted(files)
        combined = f"{','.join(files_sorted)}:{time_bucket}"
        return hashlib.sha256(combined.encode()).hexdigest()[:16]
    
    def add_task(self, task_type: str, files: List[str], confidence: float = 1.0,
                 timestamp: Optional[datetime] = None) -> str:
        """
        Add a task to a workflow (existing or new).
        
        Args:
            task_type: Type of task (e.g., 'edit_code', 'run_tests')
            files: List of file paths involved
            confidence: Confidence score for task detection
            timestamp: Task timestamp (default: now)
            
        Returns:
            Workflow ID
        """
        if timestamp is None:
            timestamp = datetime.now(timezone.utc)
        
        files_set = set(files)
        time_bucket = self._get_time_window_bucket(timestamp)
        
        # Find matching workflow
        matching_workflow = self._find_matching_workflow(files_set, time_bucket, task_type)
        
        if matching_workflow:
            # Add to existing workflow
            workflow_task = WorkflowTask(
                task_type=task_type,
                timestamp=timestamp.isoformat(),
                files=files,
                confidence=confidence
            )
            matching_workflow.tasks.append(workflow_task)
            matching_workflow.files.update(files_set)
            matching_workflow.last_activity = timestamp.isoformat()
            
            logger.debug(
                f"Task added to workflow {matching_workflow.workflow_id}",
                operation="add_task",
                workflow_id=matching_workflow.workflow_id,
                task_type=task_type
            )
            
            self._save_state()
            return matching_workflow.workflow_id
        else:
            # Create new workflow
            workflow_id = self._generate_workflow_id(files_set, time_bucket)
            
            workflow_task = WorkflowTask(
                task_type=task_type,
                timestamp=timestamp.isoformat(),
                files=files,
                confidence=confidence
            )
            
            workflow = Workflow(
                workflow_id=workflow_id,
                files=files_set,
                tasks=[workflow_task],
                start_time=timestamp.isoformat(),
                last_activity=timestamp.isoformat(),
                time_window_bucket=time_bucket
            )
            
            self.active_workflows[workflow_id] = workflow
            
            logger.info(
                f"New workflow created: {workflow_id}",
                operation="add_task",
                workflow_id=workflow_id,
                task_type=task_type,
                files=len(files_set)
            )
            
            self._save_state()
            return workflow_id
    
    def _find_matching_workflow(self, files: Set[str], time_bucket: int,
                                task_type: str) -> Optional[Workflow]:
        """
        Find matching workflow using three criteria:
        1. File overlap
        2. Temporal proximity (same or adjacent time bucket)
        3. Logical continuation (task fits workflow pattern)
        
        Args:
            files: Set of file paths
            time_bucket: Time window bucket
            task_type: Type of task
            
        Returns:
            Matching workflow or None
        """
        now = datetime.now(timezone.utc)
        
        for workflow in self.active_workflows.values():
            # Criterion 1: File overlap
            file_overlap = len(files & workflow.files) > 0
            if not file_overlap:
                continue
            
            # Criterion 2: Temporal proximity (within 10 minutes or same bucket)
            last_activity = datetime.fromisoformat(workflow.last_activity.replace('Z', '+00:00'))
            time_gap = (now - last_activity).total_seconds()
            is_recent = time_gap < (self.TIME_WINDOW_MINUTES * 60)
            
            # Also check if same or adjacent time bucket
            bucket_proximity = abs(time_bucket - workflow.time_window_bucket) <= 1
            
            if not (is_recent or bucket_proximity):
                continue
            
            # Criterion 3: Logical continuation
            # Check if task type is expected next step in workflow
            is_continuation = self._is_logical_continuation(workflow, task_type)
            
            if is_continuation:
                return workflow
        
        return None
    
    def _is_logical_continuation(self, workflow: Workflow, task_type: str) -> bool:
        """
        Check if task type is a logical continuation of workflow.
        
        Args:
            workflow: The workflow to check
            task_type: The new task type
            
        Returns:
            True if task is logical continuation
        """
        if not workflow.tasks:
            return True
        
        # Get last task type
        last_task = workflow.tasks[-1].task_type
        
        # Common logical transitions
        logical_transitions = {
            'edit_code': ['run_tests', 'write_docs', 'review_code'],
            'run_tests': ['fix_bug', 'write_docs', 'review_code', 'edit_code'],
            'fix_bug': ['run_tests', 'review_code'],
            'write_docs': ['review_code', 'edit_code'],
            'refactor': ['run_tests', 'review_code'],
            'debug': ['fix_bug', 'run_tests'],
            'add_feature': ['run_tests', 'write_docs']
        }
        
        expected_next = logical_transitions.get(last_task, [])
        return task_type in expected_next or len(expected_next) == 0
    
    def get_workflow(self, workflow_id: str) -> Optional[Workflow]:
        """Get workflow by ID."""
        return self.active_workflows.get(workflow_id)
    
    def get_workflow_history(self, workflow_id: str) -> List[WorkflowTask]:
        """Get task history for a workflow."""
        workflow = self.get_workflow(workflow_id)
        if workflow:
            return workflow.tasks
        return []
    
    def cleanup_stale_workflows(self, max_age_minutes: int = 60) -> None:
        """
        Remove workflows that haven't been active for a while.
        
        Args:
            max_age_minutes: Maximum age in minutes before workflow is considered stale
        """
        now = datetime.now(timezone.utc)
        stale_workflows = []
        
        for workflow_id, workflow in self.active_workflows.items():
            last_activity = datetime.fromisoformat(workflow.last_activity.replace('Z', '+00:00'))
            age_minutes = (now - last_activity).total_seconds() / 60
            
            if age_minutes > max_age_minutes:
                stale_workflows.append(workflow_id)
        
        for workflow_id in stale_workflows:
            workflow = self.active_workflows.pop(workflow_id)
            self.completed_workflows.append(workflow)
            
            logger.info(
                f"Workflow marked as completed: {workflow_id}",
                operation="cleanup_stale_workflows",
                workflow_id=workflow_id
            )
        
        if stale_workflows:
            self._save_state()

