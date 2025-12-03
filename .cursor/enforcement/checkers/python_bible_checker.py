"""
Python Bible checker for python_bible.mdc rules.

Handles:
- Python Bible compliance patterns
"""

import re
from pathlib import Path
from typing import List, Optional
from datetime import datetime, timezone

from .base_checker import BaseChecker, CheckerResult, CheckerStatus
from .exceptions import CheckerExecutionError


class PythonBibleChecker(BaseChecker):
    """
    Checker for python_bible.mdc rules.
    
    Enforces:
    - Python Bible best practices
    """
    
    # Python Bible anti-patterns
    ANTI_PATTERNS = [
        (r'def\s+\w+\([^)]*=\s*\[', "Mutable default arguments"),
        (r'except\s*:', "Bare except clause"),
        (r'import\s+\*', "Wildcard import"),
    ]
    
    def check(self, changed_files: List[str], user_message: Optional[str] = None) -> CheckerResult:
        """
        Execute Python Bible checks.
        
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
        
        # Filter to only Python files
        python_files = [f for f in changed_files if f.endswith('.py')]
        files_checked = len(python_files)
        
        if not python_files:
            return self._create_result(
                status=CheckerStatus.SUCCESS,
                checks_passed=["Python Bible Compliance (no Python files)"],
                execution_time_ms=0.0,
                files_checked=0,
            )
        
        try:
            for file_path_str in python_files:
                file_path = self.project_root / file_path_str
                
                if not file_path.exists():
                    continue
                
                try:
                    with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                        for line_num, line in enumerate(f, 1):
                            for pattern, description in self.ANTI_PATTERNS:
                                if re.search(pattern, line):
                                    violations.append({
                                        'severity': 'WARNING',
                                        'rule_ref': 'python_bible.mdc',
                                        'message': f"Python Bible violation: {description}",
                                        'file_path': file_path_str,
                                        'line_number': line_num,
                                        'session_scope': 'current_session'
                                    })
                except (FileNotFoundError, PermissionError, OSError, UnicodeDecodeError):
                    # Skip files that can't be read
                    continue
            
            # Determine overall status
            if violations:
                checks_failed.append("Python Bible Compliance")
                status = CheckerStatus.FAILED
            else:
                checks_passed.append("Python Bible Compliance")
                status = CheckerStatus.SUCCESS
            
            execution_time = (datetime.now(timezone.utc) - start_time).total_seconds() * 1000
            
            return self._create_result(
                status=status,
                violations=violations,
                checks_passed=checks_passed,
                checks_failed=checks_failed,
                execution_time_ms=execution_time,
                files_checked=files_checked,
            )
            
        except Exception as e:
            raise CheckerExecutionError(f"Python Bible checker failed: {e}") from e



