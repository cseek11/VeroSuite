"""
Architecture checker for 04-architecture.mdc rules.

Handles:
- Monorepo structure validation
- Service boundaries
"""

from pathlib import Path
from typing import List, Optional
from datetime import datetime, timezone

from .base_checker import BaseChecker, CheckerResult, CheckerStatus
from .exceptions import CheckerExecutionError


class ArchitectureChecker(BaseChecker):
    """
    Checker for 04-architecture.mdc rules.
    
    Enforces:
    - Monorepo structure compliance
    - Service boundaries
    """
    
    # Correct paths
    CORRECT_PATHS = [
        'apps/api/src/',
        'apps/crm-ai/src/',
        'apps/ai-soc/src/',
        'libs/common/src/',
        'libs/common/prisma/',
        'frontend/src/',
    ]
    
    # Wrong/legacy paths
    WRONG_PATHS = [
        'backend/src/',
        'backend/prisma/',
    ]
    
    def check(self, changed_files: List[str], user_message: Optional[str] = None) -> CheckerResult:
        """
        Execute architecture checks.
        
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
            for file_path_str in changed_files:
                # Check for wrong/legacy paths
                if any(wrong_path in file_path_str for wrong_path in self.WRONG_PATHS):
                    violations.append({
                        'severity': 'BLOCKED',
                        'rule_ref': '04-architecture.mdc',
                        'message': f'Legacy path detected: {file_path_str} (use apps/api/src/ or libs/common/)',
                        'file_path': file_path_str,
                        'session_scope': 'current_session'
                    })
            
            # Determine overall status
            if violations:
                checks_failed.append("Architecture Compliance")
                status = CheckerStatus.FAILED
            else:
                checks_passed.append("Architecture Compliance")
                status = CheckerStatus.SUCCESS
            
            execution_time = (datetime.now(timezone.utc) - start_time).total_seconds() * 1000
            
            return self._create_result(
                status=status,
                violations=violations,
                checks_passed=checks_passed,
                checks_failed=checks_failed,
                execution_time_ms=execution_time,
                files_checked=len(changed_files),
            )
            
        except Exception as e:
            raise CheckerExecutionError(f"Architecture checker failed: {e}") from e




