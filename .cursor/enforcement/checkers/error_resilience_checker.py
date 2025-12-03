"""
Error resilience checker for 06-error-resilience.mdc rules.

Handles:
- Error handling pattern validation
"""

import re
from pathlib import Path
from typing import List, Optional
from datetime import datetime, timezone

from .base_checker import BaseChecker, CheckerResult, CheckerStatus
from .exceptions import CheckerExecutionError


class ErrorResilienceChecker(BaseChecker):
    """
    Checker for 06-error-resilience.mdc rules.
    
    Enforces:
    - Error-prone operations have proper error handling
    """
    
    # Patterns to check for (language-agnostic)
    ERROR_PRONE_PATTERNS = [
        (r'await\s+\w+\(', None),  # Async operations should have error handling
        (r'subprocess\.(run|call|Popen)', None),  # Subprocess should have error handling
        (r'open\(', None),  # File operations should have error handling
    ]
    
    def check(self, changed_files: List[str], user_message: Optional[str] = None) -> CheckerResult:
        """
        Execute error resilience checks.
        
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
        files_checked = 0
        
        try:
            # Filter to only code files
            code_files = [
                f for f in changed_files
                if Path(f).suffix in ['.py', '.ts', '.tsx', '.js', '.jsx']
            ]
            files_checked = len(code_files)
            
            for file_path_str in code_files:
                file_path = self.project_root / file_path_str
                
                if not file_path.exists():
                    continue
                
                # Determine file type for appropriate error handling pattern
                is_python = file_path.suffix == '.py'
                is_typescript_js = file_path.suffix in ['.ts', '.tsx', '.js', '.jsx']
                
                # Error handling patterns by language
                if is_python:
                    error_handling_patterns = [r'try\s*:', r'try\s*\n']
                elif is_typescript_js:
                    error_handling_patterns = [r'try\s*\{', r'try\s*\n\s*\{', r'catch\s*\(', r'catch\s*\{']
                else:
                    error_handling_patterns = []
                
                try:
                    with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                        lines = list(f)
                        
                        for pattern, _ in self.ERROR_PRONE_PATTERNS:
                            for line_num, line in enumerate(lines, 1):
                                if re.search(pattern, line):
                                    # Check if there's error handling nearby (within 10 lines)
                                    context_start = max(0, line_num - 10)
                                    context_end = min(len(lines), line_num + 10)
                                    context = '\n'.join(lines[context_start:context_end])
                                    
                                    # Check if any error handling pattern is present
                                    has_error_handling = any(
                                        re.search(eh_pattern, context, re.MULTILINE)
                                        for eh_pattern in error_handling_patterns
                                    )
                                    
                                    if not has_error_handling:
                                        violations.append({
                                            'severity': 'WARNING',
                                            'rule_ref': '06-error-resilience.mdc',
                                            'message': f"Error-prone operation without error handling: {pattern}",
                                            'file_path': file_path_str,
                                            'line_number': line_num,
                                            'session_scope': 'current_session'
                                        })
                except (FileNotFoundError, PermissionError, OSError, UnicodeDecodeError):
                    # Skip files that can't be read
                    continue
            
            # Determine overall status
            if violations:
                checks_failed.append("Error Handling Compliance")
                status = CheckerStatus.FAILED
            else:
                checks_passed.append("Error Handling Compliance")
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
            raise CheckerExecutionError(f"Error resilience checker failed: {e}") from e




