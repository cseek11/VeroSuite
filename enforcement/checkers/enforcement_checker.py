"""
Enforcement checker for 01-enforcement.mdc rules.

Handles:
- Memory Bank compliance (Step 0)
- activeContext.md update (Step 5)
"""

import re
from pathlib import Path
from typing import List, Optional
from datetime import datetime, timezone

from .base_checker import BaseChecker, CheckerResult, CheckerStatus
from .exceptions import CheckerExecutionError


class EnforcementChecker(BaseChecker):
    """
    Checker for 01-enforcement.mdc rules.
    
    Enforces:
    - Memory Bank compliance (all 6 files exist and are not empty)
    - activeContext.md update (must be recent if files changed)
    """
    
    # Required Memory Bank files
    MEMORY_BANK_FILES = [
        "projectbrief.md",
        "productContext.md",
        "systemPatterns.md",
        "techContext.md",
        "activeContext.md",
        "progress.md"
    ]
    
    def check(self, changed_files: List[str], user_message: Optional[str] = None) -> CheckerResult:
        """
        Execute enforcement checks.
        
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
            # Check Memory Bank compliance
            memory_bank_result = self._check_memory_bank()
            if memory_bank_result['passed']:
                checks_passed.append("Memory Bank Compliance")
            else:
                checks_failed.append("Memory Bank Compliance")
                violations.extend(memory_bank_result['violations'])
            
            # Check activeContext.md update
            active_context_result = self._check_active_context(changed_files)
            if active_context_result['passed']:
                checks_passed.append("activeContext.md Update")
            else:
                checks_failed.append("activeContext.md Update")
                violations.extend(active_context_result['violations'])
            
            # Determine overall status
            if violations:
                status = CheckerStatus.FAILED
            else:
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
                    'memory_bank_files_checked': len(self.MEMORY_BANK_FILES),
                    'active_context_checked': True,
                }
            )
            
        except Exception as e:
            raise CheckerExecutionError(f"Enforcement checker failed: {e}") from e
    
    def _check_memory_bank(self) -> dict:
        """
        Check Memory Bank compliance (Step 0 requirement).
        
        Validates:
        - All 6 Memory Bank files exist
        - Files are not empty
        
        Returns:
            Dictionary with 'passed' (bool) and 'violations' (list)
        """
        violations = []
        memory_bank_dir = self.project_root / ".cursor" / "memory-bank"
        
        for filename in self.MEMORY_BANK_FILES:
            file_path = memory_bank_dir / filename
            if not file_path.exists():
                violations.append({
                    'severity': 'BLOCKED',
                    'rule_ref': '01-enforcement.mdc Step 0',
                    'message': f"Missing Memory Bank file: {filename}",
                    'file_path': str(file_path),
                    'session_scope': 'current_session'
                })
            else:
                # Check file is not empty
                try:
                    if file_path.stat().st_size == 0:
                        violations.append({
                            'severity': 'WARNING',
                            'rule_ref': '01-enforcement.mdc Step 0',
                            'message': f"Memory Bank file is empty: {filename}",
                            'file_path': str(file_path),
                            'session_scope': 'current_session'
                        })
                except OSError:
                    # File might have been deleted between exists() and stat()
                    violations.append({
                        'severity': 'BLOCKED',
                        'rule_ref': '01-enforcement.mdc Step 0',
                        'message': f"Memory Bank file not accessible: {filename}",
                        'file_path': str(file_path),
                        'session_scope': 'current_session'
                    })
        
        return {
            'passed': len(violations) == 0,
            'violations': violations
        }
    
    def _check_active_context(self, changed_files: List[str]) -> dict:
        """
        Check activeContext.md update (Step 5 requirement).
        
        Validates that activeContext.md was updated after file changes.
        
        Args:
            changed_files: List of file paths that have changed
            
        Returns:
            Dictionary with 'passed' (bool) and 'violations' (list)
        """
        violations = []
        memory_bank_dir = self.project_root / ".cursor" / "memory-bank"
        active_context_file = memory_bank_dir / "activeContext.md"
        
        if not active_context_file.exists():
            violations.append({
                'severity': 'BLOCKED',
                'rule_ref': '01-enforcement.mdc Step 5',
                'message': 'activeContext.md does not exist',
                'file_path': str(active_context_file),
                'session_scope': 'current_session'
            })
            return {
                'passed': False,
                'violations': violations
            }
        
        # Check if file was modified recently (within last hour)
        try:
            file_mtime = datetime.fromtimestamp(active_context_file.stat().st_mtime, tz=timezone.utc)
            now = datetime.now(timezone.utc)
            time_diff = (now - file_mtime).total_seconds()
            
            # If file hasn't been updated in last hour and there are changes, warn
            if changed_files and time_diff > 3600:  # 1 hour
                violations.append({
                    'severity': 'WARNING',
                    'rule_ref': '01-enforcement.mdc Step 5',
                    'message': f"activeContext.md not updated recently (last modified: {file_mtime.isoformat()})",
                    'file_path': str(active_context_file),
                    'session_scope': 'current_session'
                })
        except OSError as e:
            violations.append({
                'severity': 'WARNING',
                'rule_ref': '01-enforcement.mdc Step 5',
                'message': f"Could not check activeContext.md modification time: {e}",
                'file_path': str(active_context_file),
                'session_scope': 'current_session'
            })
        
        return {
            'passed': len(violations) == 0,
            'violations': violations
        }







