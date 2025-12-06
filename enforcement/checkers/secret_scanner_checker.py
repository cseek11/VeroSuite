"""
Secret scanner checker for detecting hardcoded secrets.

Detects:
- Hardcoded JWT secrets, API keys, passwords, tokens
- Long random-looking string literals
- Secrets that should be in environment variables

Python Bible Chapter 11: Clean Architecture principles.
"""

import re
from pathlib import Path
from typing import List, Optional
from datetime import datetime, timezone

from .base_checker import BaseChecker, CheckerResult, CheckerStatus
from .models import Violation
from .exceptions import CheckerExecutionError
from .backend_utils import is_test_file
from ..autofix_suggestions import secret_fix_hint


class SecretScannerChecker(BaseChecker):
    """
    Checker for detecting hardcoded secrets in source code.
    
    Enforces:
    - No hardcoded secrets, API keys, tokens, passwords
    - Secrets must come from environment variables or ConfigService
    """
    
    # File extensions to scan
    CODE_FILE_EXTENSIONS = {'.ts', '.tsx', '.js', '.jsx', '.py'}
    
    # Suspicious variable names that indicate secrets
    SECRET_VARIABLE_PATTERNS = [
        r'\bJWT_SECRET\b',
        r'\bJWT_KEY\b',
        r'\bAPI_KEY\b',
        r'\bACCESS_KEY\b',
        r'\bSECRET_KEY\b',
        r'\bPRIVATE_KEY\b',
        r'\bCLIENT_SECRET\b',
        r'\bPASSWORD\b',
        r'\bTOKEN\b',
        r'\bSECRET\b',
        r'\bAUTH_TOKEN\b',
        r'\bBEARER_TOKEN\b',
    ]
    
    # Patterns for environment variable usage (allowed)
    ENV_VARIABLE_PATTERNS = [
        r'process\.env\.',
        r'ConfigService\.get\(',
        r'config\.get\(',
        r'env\[',
        r'os\.environ\[',
        r'os\.getenv\(',
    ]
    
    # Pattern for long random-looking strings (base64-like, hex, etc.)
    RANDOM_STRING_PATTERN = re.compile(
        r'["\']([A-Za-z0-9+/]{24,}={0,2})["\']|'  # Base64-like
        r'["\']([0-9a-fA-F]{32,})["\']|'  # Hex keys
        r'["\']([A-Za-z0-9_-]{20,})["\']'  # Long alphanumeric
    )
    
    def check(self, changed_files: List[str], user_message: Optional[str] = None) -> CheckerResult:
        """
        Execute secret scanning checks.
        
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
            # Filter to code files only
            code_files = [
                f for f in changed_files
                if Path(f).suffix in self.CODE_FILE_EXTENSIONS
            ]
            files_checked = len(code_files)
            
            for file_path_str in code_files:
                file_path = self.project_root / file_path_str
                
                if not file_path.exists():
                    continue
                
                # Skip test files using shared utility (test-violations files are NOT test files)
                if is_test_file(file_path):
                    continue
                
                try:
                    with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                        lines = f.readlines()
                        content = ''.join(lines)
                        
                        # Check for suspicious variable names with string literals
                        violations.extend(
                            self._check_secret_variables(file_path_str, lines, content)
                        )
                        
                        # Check for long random-looking strings
                        violations.extend(
                            self._check_random_strings(file_path_str, lines, content)
                        )
                        
                except (FileNotFoundError, PermissionError, OSError, UnicodeDecodeError):
                    continue
            
            # Determine overall status
            if violations:
                checks_failed.append("Secret Scanning Compliance")
                status = CheckerStatus.FAILED
            else:
                checks_passed.append("Secret Scanning Compliance")
                status = CheckerStatus.SUCCESS
            
            execution_time = (datetime.now(timezone.utc) - start_time).total_seconds() * 1000
            
            # Convert Violation objects to dict format
            violation_dicts = [v.to_dict() for v in violations]
            
            return self._create_result(
                status=status,
                violations=violation_dicts,
                checks_passed=checks_passed,
                checks_failed=checks_failed,
                execution_time_ms=execution_time,
                files_checked=files_checked,
            )
            
        except Exception as e:
            raise CheckerExecutionError(f"Secret scanner checker failed: {e}") from e
    
    def _check_secret_variables(
        self, 
        file_path: str, 
        lines: List[str], 
        content: str
    ) -> List[Violation]:
        """
        Check for suspicious variable names with hardcoded string values.
        
        Args:
            file_path: Path to the file being checked
            lines: List of lines in the file
            content: Full file content
            
        Returns:
            List of Violation objects
        """
        violations = []
        
        for pattern in self.SECRET_VARIABLE_PATTERNS:
            # Find all matches of the pattern
            for match in re.finditer(pattern, content):
                line_num = content[:match.start()].count('\n') + 1
                line = lines[line_num - 1] if line_num <= len(lines) else ''
                
                # Skip if in comment
                if line.strip().startswith('//') or line.strip().startswith('#'):
                    continue
                
                # Check if this variable is assigned a string literal
                # Look for pattern: VARIABLE_NAME = "value" or VARIABLE_NAME: "value"
                var_name = match.group()
                
                # Find assignment on same line or nearby lines
                context_start = max(0, line_num - 3)
                context_end = min(len(lines), line_num + 3)
                context = '\n'.join(lines[context_start:context_end])
                
                # Check if there's a string literal assignment
                assignment_pattern = rf'{re.escape(var_name)}\s*[=:]\s*["\']([^"\']+)["\']'
                assignment_match = re.search(assignment_pattern, context)
                
                if assignment_match:
                    # Check if value comes from environment variable
                    is_env_var = any(
                        re.search(env_pattern, context, re.IGNORECASE)
                        for env_pattern in self.ENV_VARIABLE_PATTERNS
                    )
                    
                    if not is_env_var:
                        # Extract variable name without word boundaries for display
                        var_display = var_name.replace('\\b', '').strip()
                        violations.append(Violation(
                            severity='BLOCKING',
                            rule_ref='SEC-R03-001',
                            message=f'Hardcoded secret value detected for {var_display}.',
                            file_path=file_path,
                            line_number=line_num,
                            fix_hint=secret_fix_hint(var_display),
                            session_scope='current_session'
                        ))
        
        return violations
    
    def _check_random_strings(
        self,
        file_path: str,
        lines: List[str],
        content: str
    ) -> List[Violation]:
        """
        Check for long random-looking string literals that might be secrets.
        
        Args:
            file_path: Path to the file being checked
            lines: List of lines in the file
            content: Full file content
            
        Returns:
            List of Violation objects
        """
        violations = []
        
        # Find all matches of random-looking strings
        for match in self.RANDOM_STRING_PATTERN.finditer(content):
            line_num = content[:match.start()].count('\n') + 1
            line = lines[line_num - 1] if line_num <= len(lines) else ''
            
            # Skip if in comment
            if line.strip().startswith('//') or line.strip().startswith('#'):
                continue
            
            # Get the matched string value
            string_value = match.group(1) or match.group(2) or match.group(3)
            
            # Check if this is near a suspicious variable name
            context_start = max(0, line_num - 5)
            context_end = min(len(lines), line_num + 5)
            context = '\n'.join(lines[context_start:context_end])
            
            # Check if context contains secret-related variable names
            has_secret_context = any(
                re.search(pattern, context, re.IGNORECASE)
                for pattern in self.SECRET_VARIABLE_PATTERNS
            )
            
            # Check if it's an environment variable reference
            is_env_var = any(
                re.search(env_pattern, context, re.IGNORECASE)
                for env_pattern in self.ENV_VARIABLE_PATTERNS
            )
            
            # Only flag if it looks like a secret and isn't from env
            if has_secret_context and not is_env_var:
                violations.append(Violation(
                    severity='BLOCKING',
                    rule_ref='SEC-R03-002',
                    message=f'Hardcoded secret-like string detected (length: {len(string_value)}).',
                    file_path=file_path,
                    line_number=line_num,
                    fix_hint=secret_fix_hint('SECRET'),
                    session_scope='current_session'
                ))
        
        return violations

