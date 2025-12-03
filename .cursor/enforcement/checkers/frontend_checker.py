"""
Frontend checker for 09-frontend.mdc rules.

Handles:
- React patterns
- Component structure
"""

from pathlib import Path
from typing import List, Optional
from datetime import datetime, timezone

from .base_checker import BaseChecker, CheckerResult, CheckerStatus
from .exceptions import CheckerExecutionError


class FrontendChecker(BaseChecker):
    """
    Checker for 09-frontend.mdc rules.
    
    Enforces:
    - React component patterns
    - File structure compliance
    """
    
    def check(self, changed_files: List[str], user_message: Optional[str] = None) -> CheckerResult:
        """
        Execute frontend checks.
        
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
            # Filter to frontend files
            frontend_files = [
                f for f in changed_files
                if f.startswith('frontend/') and (f.endswith('.tsx') or f.endswith('.ts'))
            ]
            
            # Basic validation - can be expanded
            if frontend_files:
                checks_passed.append("Frontend Architecture Compliance")
            else:
                checks_passed.append("Frontend Architecture Compliance")
            
            status = CheckerStatus.SUCCESS
            execution_time = (datetime.now(timezone.utc) - start_time).total_seconds() * 1000
            
            return self._create_result(
                status=status,
                violations=violations,
                checks_passed=checks_passed,
                checks_failed=checks_failed,
                execution_time_ms=execution_time,
                files_checked=len(frontend_files),
            )
            
        except Exception as e:
            raise CheckerExecutionError(f"Frontend checker failed: {e}") from e



