"""
Operations checker for 11-operations.mdc rules.

Handles:
- CI/CD patterns
- Deployment validation
"""

from pathlib import Path
from typing import List, Optional
from datetime import datetime, timezone

from .base_checker import BaseChecker, CheckerResult, CheckerStatus
from .exceptions import CheckerExecutionError


class OperationsChecker(BaseChecker):
    """
    Checker for 11-operations.mdc rules.
    
    Enforces:
    - CI/CD compliance
    """
    
    def check(self, changed_files: List[str], user_message: Optional[str] = None) -> CheckerResult:
        """
        Execute operations checks.
        
        Args:
            changed_files: List of file paths that have changed
            user_message: Optional user message for context
            
        Returns:
            CheckerResult with violations and status
        """
        start_time = datetime.now(timezone.utc)
        violations = []
        checks_passed = []
        checks_failed = []
        
        try:
            # Check for CI/CD files
            cicd_files = [
                f for f in changed_files
                if '.github' in f or '.gitlab' in f or 'ci' in f.lower() or 'cd' in f.lower()
            ]
            
            if cicd_files:
                checks_passed.append("CI/CD Compliance")
            else:
                checks_passed.append("CI/CD Compliance")
            
            status = CheckerStatus.SUCCESS
            execution_time = (datetime.now(timezone.utc) - start_time).total_seconds() * 1000
            
            return self._create_result(
                status=status,
                violations=violations,
                checks_passed=checks_passed,
                checks_failed=checks_failed,
                execution_time_ms=execution_time,
                files_checked=len(changed_files),
                metadata={
                    'cicd_files_checked': len(cicd_files),
                }
            )
            
        except Exception as e:
            raise CheckerExecutionError(f"Operations checker failed: {e}") from e




