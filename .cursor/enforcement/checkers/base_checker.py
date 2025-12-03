"""
Base checker class for all rule enforcement checkers.

Python Bible Chapter 11: Clean Architecture principles.
"""

from abc import ABC, abstractmethod
from dataclasses import dataclass, field
from datetime import datetime, timezone
from pathlib import Path
from typing import List, Optional, Dict, Any
from enum import Enum

from .exceptions import CheckerExecutionError


class CheckerStatus(Enum):
    """Status of a checker execution."""
    SUCCESS = "success"
    FAILED = "failed"
    SKIPPED = "skipped"
    ERROR = "error"


@dataclass(slots=True)  # Python 3.10+ - reduces memory by 4-5× (Chapter 07.5.3)
class CheckerResult:
    """
    Structured result from a checker execution.
    
    Python Bible Chapter 07.5.3: Using __slots__ reduces memory footprint.
    """
    status: CheckerStatus
    rule_ref: str  # e.g., "02-core.mdc"
    violations: List[Dict] = field(default_factory=list)
    checks_passed: List[str] = field(default_factory=list)
    checks_failed: List[str] = field(default_factory=list)
    execution_time_ms: float = 0.0
    files_checked: int = 0
    error_message: Optional[str] = None
    metadata: Dict[str, Any] = field(default_factory=dict)
    timestamp: str = field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert result to dictionary for JSON serialization."""
        return {
            'status': self.status.value,
            'rule_ref': self.rule_ref,
            'violations': self.violations,
            'checks_passed': self.checks_passed,
            'checks_failed': self.checks_failed,
            'execution_time_ms': self.execution_time_ms,
            'files_checked': self.files_checked,
            'error_message': self.error_message,
            'metadata': self.metadata,
            'timestamp': self.timestamp,
        }


class BaseChecker(ABC):
    """
    Base class for all rule enforcement checkers.
    
    Each checker is responsible for enforcing a specific rule file.
    """
    
    def __init__(
        self,
        project_root: Path,
        rule_file: Path,
        rule_ref: str,
        always_apply: bool = False
    ):
        """
        Initialize the checker.
        
        Args:
            project_root: Root directory of the project
            rule_file: Path to the rule file (.mdc file)
            rule_ref: Reference to the rule (e.g., "02-core.mdc")
            always_apply: Whether this checker should always run
        """
        self.project_root = project_root
        self.rule_file = rule_file
        self.rule_ref = rule_ref
        self.always_apply = always_apply
        
    @abstractmethod
    def check(self, changed_files: List[str], user_message: Optional[str] = None) -> CheckerResult:
        """
        Execute the checker.
        
        Args:
            changed_files: List of file paths that have changed (relative to project_root)
            user_message: Optional user message for context
            
        Returns:
            CheckerResult with status, violations, and metadata
            
        Raises:
            CheckerExecutionError: If checker execution fails
        """
        pass
    
    def should_run(self, changed_files: List[str]) -> bool:
        """
        Determine if this checker should run based on changed files.
        
        Args:
            changed_files: List of file paths that have changed
            
        Returns:
            True if checker should run, False otherwise
        """
        # Always run if always_apply is True
        if self.always_apply:
            return True
        
        # Otherwise, check if any changed files match the rule's patterns
        # This will be implemented by subclasses or pattern_matcher
        return True  # Default: run if not always_apply (will be refined by pattern matching)
    
    def _create_result(self, status: CheckerStatus, **kwargs) -> CheckerResult:
        """
        Create a CheckerResult with default values.
        
        Args:
            status: Status of the checker execution
            **kwargs: Additional fields to set on the result
            
        Returns:
            CheckerResult instance
        """
        result = CheckerResult(
            status=status,
            rule_ref=self.rule_ref,
            **kwargs
        )
        return result
    
    def _log_error(self, message: str, error: Optional[Exception] = None) -> None:
        """
        Log an error (placeholder - will use proper logger).
        
        Args:
            message: Error message
            error: Optional exception to log
        """
        # TODO: Integrate with logger_util when available
        import logging
        logger = logging.getLogger(f"checker.{self.rule_ref}")
        if error:
            logger.error(f"{message}: {error}", exc_info=error)
        else:
            logger.error(message)



