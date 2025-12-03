#!/usr/bin/env python3
"""
Task Detection Engine
Analyzes agent messages and file changes to classify task types.

Last Updated: 2025-12-01
"""

import re
import yaml
from pathlib import Path
from typing import Dict, List, Optional, Set
from dataclasses import dataclass

# Add project root to path
import sys
project_root = Path(__file__).parent.parent.parent
sys.path.insert(0, str(project_root))

try:
    from logger_util import get_logger, get_or_create_trace_context
    logger = get_logger(context="task_detector")
except ImportError:
    import logging
    logging.basicConfig(level=logging.INFO)
    logger = logging.getLogger("task_detector")


@dataclass(slots=True)  # Python 3.10+ - reduces memory by 4-5×
class TaskDetection:
    """Result of task detection."""
    primary_task: str
    subtasks: List[str]
    file_types: Set[str]
    confidence: float
    detected_files: List[str]
    user_message: Optional[str] = None


class TaskDetector:
    """Analyzes agent messages to classify task type."""
    
    def __init__(self, task_types_file: Optional[Path] = None):
        """
        Initialize task detector.
        
        Args:
            task_types_file: Path to task_types.yaml (default: .cursor/context_manager/task_types.yaml)
        """
        if task_types_file is None:
            task_types_file = Path(__file__).parent / "task_types.yaml"
        
        self.task_types_file = task_types_file
        self.task_categories: Dict[str, List[str]] = {}
        self.task_patterns: Dict[str, List[str]] = {}
        self._load_task_definitions()
    
    def _load_task_definitions(self) -> None:
        """Load task definitions from YAML file."""
        try:
            with open(self.task_types_file, 'r', encoding='utf-8') as f:
                data = yaml.safe_load(f)
                self.task_categories = data.get('task_categories', {})
                self.task_patterns = data.get('task_patterns', {})
            
            logger.info(
                "Task definitions loaded",
                operation="_load_task_definitions",
                categories=len(self.task_categories),
                patterns=len(self.task_patterns)
            )
        except Exception as e:
            logger.error(
                f"Failed to load task definitions: {e}",
                operation="_load_task_detector",
                error_code="LOAD_FAILED",
                root_cause=str(e)
            )
            # Fallback to empty definitions
            self.task_categories = {}
            self.task_patterns = {}
    
    def detect_task(self, agent_message: str, files: Optional[List[str]] = None) -> TaskDetection:
        """
        Detect task type from agent message and files.
        
        Args:
            agent_message: The agent's message or action description
            files: List of file paths being modified (optional)
            
        Returns:
            TaskDetection with primary task, subtasks, file types, and confidence
        """
        if files is None:
            files = []
        
        message_lower = agent_message.lower()
        
        # Extract file types from file paths
        file_types = set()
        detected_files = []
        
        for file_path in files:
            if isinstance(file_path, str):
                path = Path(file_path)
                if path.suffix:
                    file_types.add(path.suffix.lower())
                detected_files.append(str(path))
        
        # Detect primary task using pattern matching
        primary_task = None
        confidence = 0.0
        matched_patterns = []
        
        # Check each pattern category
        for task_name, patterns in self.task_patterns.items():
            for pattern in patterns:
                try:
                    if re.search(pattern, message_lower, re.IGNORECASE):
                        matched_patterns.append(task_name)
                        # Higher confidence for exact matches
                        if re.match(pattern, message_lower, re.IGNORECASE):
                            confidence = max(confidence, 0.95)
                        else:
                            confidence = max(confidence, 0.75)
                        if primary_task is None:
                            primary_task = task_name
                        break
                except re.error as e:
                    logger.warning(
                        f"Invalid regex pattern: {pattern}",
                        operation="detect_task",
                        pattern=pattern,
                        error=str(e)
                    )
        
        # Fallback: infer from file types if no pattern matched
        if primary_task is None:
            if any(ext in ['.py', '.ts', '.tsx', '.js', '.jsx'] for ext in file_types):
                primary_task = 'edit_code'
                confidence = 0.60
            elif any('test' in f.lower() for f in detected_files):
                primary_task = 'run_tests'
                confidence = 0.70
            elif any(ext in ['.md', '.mdx'] for ext in file_types):
                primary_task = 'write_docs'
                confidence = 0.65
            else:
                primary_task = 'edit_code'  # Default fallback
                confidence = 0.50
        
        # Determine subtasks based on primary task and context
        subtasks = self._infer_subtasks(primary_task, message_lower, file_types, detected_files)
        
        # Adjust confidence based on file context
        if detected_files:
            confidence = min(confidence + 0.10, 0.95)
        
        return TaskDetection(
            primary_task=primary_task,
            subtasks=subtasks,
            file_types=file_types,
            confidence=round(confidence, 2),
            detected_files=detected_files,
            user_message=agent_message
        )
    
    def _infer_subtasks(self, primary_task: str, message: str, file_types: Set[str], 
                        files: List[str]) -> List[str]:
        """
        Infer subtasks from primary task and context.
        
        Args:
            primary_task: The primary task detected
            message: The agent message
            file_types: Set of file extensions
            files: List of file paths
            
        Returns:
            List of subtask names
        """
        subtasks = []
        
        # Task-specific subtask inference
        if primary_task == 'edit_code':
            if any('test' in f.lower() for f in files):
                subtasks.append('modify_test')
            if any(ext == '.py' for ext in file_types):
                subtasks.append('python_code')
            if any(ext in ['.ts', '.tsx'] for ext in file_types):
                subtasks.append('typescript_code')
        
        elif primary_task == 'run_tests':
            if 'pytest' in message.lower():
                subtasks.append('pytest_execution')
            if 'coverage' in message.lower():
                subtasks.append('coverage_check')
        
        elif primary_task == 'fix_bug':
            subtasks.append('identify_issue')
            if any('test' in f.lower() for f in files):
                subtasks.append('add_test')
        
        elif primary_task == 'add_feature':
            subtasks.append('implement_feature')
            if 'test' in message.lower():
                subtasks.append('write_tests')
        
        elif primary_task == 'refactor':
            subtasks.append('restructure_code')
            if 'test' in message.lower():
                subtasks.append('update_tests')
        
        return subtasks

