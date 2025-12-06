"""
Observability checker for 07-observability.mdc rules.

Handles:
- Structured logging compliance
- Console.log detection in production code
"""

import os
import re
import logging
from pathlib import Path
from typing import List, Optional
from datetime import datetime, timezone

from .base_checker import BaseChecker, CheckerResult, CheckerStatus
from .models import Violation
from .exceptions import CheckerExecutionError
from .backend_utils import is_test_file
from ..autofix_suggestions import console_log_fix_hint

# Debug logging setup
DEBUG_ENABLED = os.getenv("VEROFIELD_ENFORCER_DEBUG") == "1"
debug_logger = None

if DEBUG_ENABLED:
    debug_logger = logging.getLogger("verofield.observability")
    if not debug_logger.handlers:
        debug_log_file = Path(__file__).parent.parent.parent / ".cursor" / "enforcer_observability_debug.log"
        debug_log_file.parent.mkdir(parents=True, exist_ok=True)
        handler = logging.FileHandler(debug_log_file)
        handler.setFormatter(logging.Formatter('%(asctime)s - %(levelname)s - %(message)s'))
        debug_logger.addHandler(handler)
        debug_logger.setLevel(logging.DEBUG)


class ObservabilityChecker(BaseChecker):
    """
    Checker for 07-observability.mdc rules.
    
    Enforces:
    - Structured logging (no console.log or print statements in production code)
    """
    
    # Patterns to check for
    CONSOLE_LOG_PATTERNS = [
        r'console\.(log|error|warn|debug)',
        r'print\s*\(',
    ]
    
    
    def check(self, changed_files: List[str], user_message: Optional[str] = None) -> CheckerResult:
        """
        Execute observability checks.
        
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
        files_skipped = 0
        
        if DEBUG_ENABLED and debug_logger:
            debug_logger.debug(f"ObservabilityChecker received {len(changed_files)} files")
            debug_logger.debug(f"Files: {changed_files[:10]}...")  # Log first 10
        
        try:
            # Filter to only code files
            code_files = [
                f for f in changed_files
                if Path(f).suffix in ['.py', '.ts', '.tsx', '.js', '.jsx']
            ]
            
            if DEBUG_ENABLED and debug_logger:
                debug_logger.debug(f"Filtered to {len(code_files)} code files")
            
            for file_path_str in code_files:
                file_path = self.project_root / file_path_str
                
                if not file_path.exists():
                    if DEBUG_ENABLED and debug_logger:
                        debug_logger.debug(f"SKIP: {file_path} (reason=file does not exist)")
                    continue
                
                # Skip test files using precise filtering
                if is_test_file(file_path):
                    files_skipped += 1
                    if DEBUG_ENABLED and debug_logger:
                        debug_logger.debug(f"SKIP: {file_path} (reason=test file)")
                    continue
                
                if DEBUG_ENABLED and debug_logger:
                    debug_logger.debug(f"CHECK: {file_path}")
                
                try:
                    with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                        lines = list(f)
                    
                    console_matches = 0
                    
                    for pattern in self.CONSOLE_LOG_PATTERNS:
                        for line_num, line in enumerate(lines, 1):
                            if re.search(pattern, line):
                                # Allow in comments
                                if line.strip().startswith('//') or line.strip().startswith('#'):
                                    if DEBUG_ENABLED and debug_logger:
                                        debug_logger.debug(f"  Line {line_num}: console.log in comment (ignored)")
                                    continue
                                
                                console_matches += 1
                                violations.append(Violation(
                                    severity='WARNING',
                                    rule_ref='07-observability.mdc',
                                    message=f"Console logging detected (use structured logging): {pattern}",
                                    file_path=file_path_str,
                                    line_number=line_num,
                                    fix_hint=console_log_fix_hint(),
                                    session_scope='current_session'
                                ))
                    
                    if DEBUG_ENABLED and debug_logger:
                        if console_matches > 0:
                            debug_logger.debug(f"  Found {console_matches} console.log violations")
                        else:
                            debug_logger.debug(f"  No violations found")
                    
                    files_checked += 1
                    
                except (FileNotFoundError, PermissionError, OSError, UnicodeDecodeError) as e:
                    if DEBUG_ENABLED and debug_logger:
                        debug_logger.debug(f"SKIP: {file_path} (reason=read error: {e})")
                    continue
            
            if DEBUG_ENABLED and debug_logger:
                debug_logger.debug(f"Summary: {files_checked} files checked, {files_skipped} files skipped, {len(violations)} violations")
            
            # Determine overall status
            if violations:
                checks_failed.append("Structured Logging Compliance")
                status = CheckerStatus.FAILED
            else:
                checks_passed.append("Structured Logging Compliance")
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
            if DEBUG_ENABLED and debug_logger:
                debug_logger.error(f"ObservabilityChecker failed: {e}", exc_info=True)
            raise CheckerExecutionError(f"Observability checker failed: {e}") from e
