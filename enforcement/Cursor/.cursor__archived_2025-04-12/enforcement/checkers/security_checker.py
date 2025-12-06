"""
Security checker for 03-security.mdc rules.

Handles:
- Security file validation (monitoring changes to security-sensitive files)

NOTE: Tenant isolation checks are handled by TenantIsolationChecker, which uses
AST-aware Prisma query parsing for comprehensive analysis. This checker focuses
on monitoring security-sensitive configuration files.

Python Bible Chapter 11: Clean Architecture principles.
"""

from pathlib import Path
from typing import List, Optional
from datetime import datetime, timezone

from enforcement.config_paths import get_rules_root, get_project_root
from .base_checker import BaseChecker, CheckerResult, CheckerStatus
from .models import Violation
from .exceptions import CheckerExecutionError


class SecurityChecker(BaseChecker):
    """
    Checker for 03-security.mdc rules.
    
    Enforces:
    - Security-sensitive files are monitored for changes
    
    NOTE: This checker does NOT handle tenant isolation. For comprehensive
    tenant isolation enforcement, see TenantIsolationChecker which uses
    AST-aware Prisma query parsing.
    
    DEPRECATED: The tenant isolation regex-based checks previously in this
    checker have been removed in favor of TenantIsolationChecker.
    """
    
    def _get_security_files(self) -> List[str]:
        """
        Get list of security-sensitive files that should be monitored.
        
        Returns:
            List of file paths relative to project root
        """
        project_root = get_project_root()
        rules_dir = get_rules_root(project_root)
        security_rule = rules_dir / "03-security.mdc"
        
        return [
            str(security_rule.relative_to(project_root)),
            "libs/common/prisma/schema.prisma",
        ]
    
    def check(self, changed_files: List[str], user_message: Optional[str] = None) -> CheckerResult:
        """
        Execute security checks.
        
        Monitors changes to security-sensitive files. For tenant isolation checks,
        see TenantIsolationChecker.
        
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
            # Check if security-sensitive files were modified
            # This is informational - we track but don't block on security file changes
            # as they may be legitimate updates to security rules or schema
            security_files = self._get_security_files()
            security_files_modified = [
                f for f in changed_files 
                if any(f.endswith(sf) or sf in f for sf in security_files)
            ]
            
            # Note: We don't create violations for security file changes as they
            # may be legitimate updates. This checker primarily serves as a monitor.
            # If blocking behavior is needed for specific security files, it should
            # be implemented in a separate, more specific checker.
            
            if security_files_modified:
                # Log that security files were modified (informational)
                checks_passed.append("Security File Monitoring")
            else:
                checks_passed.append("Security File Monitoring")
            
            # Determine overall status
            # Since we're not creating violations, status is always SUCCESS
            # This checker serves as a monitoring/informational tool
            status = CheckerStatus.SUCCESS
            
            execution_time = (datetime.now(timezone.utc) - start_time).total_seconds() * 1000
            
            # Convert Violation objects to dict format (empty in this case)
            violation_dicts = [v.to_dict() for v in violations]
            
            return self._create_result(
                status=status,
                violations=violation_dicts,
                checks_passed=checks_passed,
                checks_failed=checks_failed,
                execution_time_ms=execution_time,
                files_checked=len(changed_files),
                metadata={
                    'security_files_modified': len(security_files_modified),
                    'security_files_list': security_files_modified,
                }
            )
            
        except Exception as e:
            raise CheckerExecutionError(f"Security checker failed: {e}") from e

