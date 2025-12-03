"""
Backend checker for 08-backend.mdc rules.

Handles:
- NestJS architecture patterns
- Controller-service-DTO separation
- Module structure and DTO directory invariants
- Auth guard enforcement
"""

import re
from pathlib import Path
from typing import List, Optional
from datetime import datetime, timezone

from .base_checker import BaseChecker, CheckerResult, CheckerStatus
from .models import Violation
from .exceptions import CheckerExecutionError
from .backend_utils import (
    find_module_root,
    has_dto_directory,
    parse_controller_structure,
    count_dto_body_params,
)
from ..autofix_suggestions import (
    no_dto_directory_hint,
    heavy_body_no_dto_hint,
    mutating_no_auth_guard_hint
)


class BackendChecker(BaseChecker):
    """
    Checker for 08-backend.mdc rules.
    
    Enforces:
    - NestJS architecture patterns
    - Controller-service-DTO separation
    - Module structure invariants
    - Authentication guard presence
    """
    
    # Minimum number of @Body() params to trigger "heavy usage" smell
    HEAVY_BODY_USAGE_THRESHOLD = 3
    
    def check(self, changed_files: List[str], user_message: Optional[str] = None) -> CheckerResult:
        """
        Execute backend checks.
        
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
            # Filter to controller files
            controller_files = [
                f for f in changed_files
                if (f.startswith('apps/api/') or f.startswith('libs/'))
                and f.endswith('.controller.ts')
            ]
            files_checked = len(controller_files)
            
            for file_path_str in controller_files:
                file_path = self.project_root / file_path_str
                
                if not file_path.exists():
                    continue
                
                # Skip test files
                if 'test' in str(file_path).lower() or 'spec' in str(file_path).lower():
                    continue
                
                try:
                    with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                        content = f.read()
                        lines = f.readlines()
                    
                    # Only check files with @Controller decorator
                    if '@Controller' not in content:
                        continue
                    
                    # Parse controller structure
                    controller_info = parse_controller_structure(content)
                    
                    # Run architectural checks
                    violations.extend(
                        self._check_dto_directory(file_path_str, file_path, controller_info)
                    )
                    violations.extend(
                        self._check_body_without_dtos(file_path_str, controller_info)
                    )
                    violations.extend(
                        self._check_mutating_without_auth(file_path_str, controller_info, lines)
                    )
                    
                except (FileNotFoundError, PermissionError, OSError, UnicodeDecodeError):
                    continue
            
            # Determine overall status
            if violations:
                checks_failed.append("Backend Architecture Compliance")
                status = CheckerStatus.FAILED
            else:
                checks_passed.append("Backend Architecture Compliance")
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
            raise CheckerExecutionError(f"Backend checker failed: {e}") from e
    
    def _check_dto_directory(
        self,
        file_path: str,
        controller_path: Path,
        controller_info: dict
    ) -> List[Violation]:
        """
        Check if controller uses @Body() but module has no dto/ directory.
        
        Rule: BACKEND-R08-ARCH-001
        
        Args:
            file_path: Path to controller file
            controller_path: Path object for controller file
            controller_info: Parsed controller structure
            
        Returns:
            List of Violation objects
        """
        violations = []
        
        # Only check if controller has @Body() parameters
        if not controller_info['body_params']:
            return violations
        
        # Find module root
        module_root = find_module_root(controller_path)
        
        if not module_root:
            # Could not determine module root - skip this check
            return violations
        
        # Check if dto/ directory exists
        if not has_dto_directory(module_root):
            controller_name = controller_info['controller_name'] or 'Controller'
            violations.append(Violation(
                severity='WARNING',
                rule_ref='BACKEND-R08-ARCH-001',
                message=f'Controller {controller_name} uses @Body() but no dto/ directory exists under {module_root.relative_to(self.project_root)}.',
                file_path=file_path,
                line_number=None,
                fix_hint=no_dto_directory_hint(module_root),
                session_scope='current_session'
            ))
        
        return violations
    
    def _check_body_without_dtos(
        self,
        file_path: str,
        controller_info: dict
    ) -> List[Violation]:
        """
        Check if controller has heavy @Body() usage but no DTO types.
        
        Rule: BACKEND-R08-ARCH-002
        
        Args:
            file_path: Path to controller file
            controller_info: Parsed controller structure
            
        Returns:
            List of Violation objects
        """
        violations = []
        
        body_params = controller_info['body_params']
        total_body_params = len(body_params)
        dto_body_params = count_dto_body_params(body_params)
        
        # Check if heavy usage but no DTOs
        if total_body_params >= self.HEAVY_BODY_USAGE_THRESHOLD and dto_body_params == 0:
            controller_name = controller_info['controller_name'] or 'Controller'
            violations.append(Violation(
                severity='WARNING',
                rule_ref='BACKEND-R08-ARCH-002',
                message=f'Controller {controller_name} uses @Body() in {total_body_params} endpoint(s) but does not use any DTO types. Consider introducing DTOs for request payloads.',
                file_path=file_path,
                line_number=None,
                fix_hint=heavy_body_no_dto_hint(),
                session_scope='current_session'
            ))
        
        return violations
    
    def _check_mutating_without_auth(
        self,
        file_path: str,
        controller_info: dict,
        lines: List[str]
    ) -> List[Violation]:
        """
        Check if mutating methods with @Body() lack auth guards.
        
        Rule: BACKEND-R08-ARCH-003
        
        Args:
            file_path: Path to controller file
            controller_info: Parsed controller structure
            lines: List of lines in the file
            
        Returns:
            List of Violation objects
        """
        violations = []
        
        # Check each mutating method
        for method in controller_info['mutating_methods']:
            # Only check methods with @Body() parameters
            if not method['has_body']:
                continue
            
            # Check if method has auth guard
            if not method['has_auth']:
                # Check if controller-level auth exists
                if not controller_info['has_auth_guard']:
                    # Find line number for method
                    line_num = None
                    content = ''.join(lines)
                    method_pos = method['position']
                    if method_pos < len(content):
                        line_num = content[:method_pos].count('\n') + 1
                    
                    violations.append(Violation(
                        severity='WARNING',
                        rule_ref='BACKEND-R08-ARCH-003',
                        message=f'Mutating endpoint {method["name"]} uses @Body() but has no auth guard (e.g., @UseGuards or @Auth()). Verify that it should be publicly accessible.',
                        file_path=file_path,
                        line_number=line_num,
                        fix_hint=mutating_no_auth_guard_hint(),
                        session_scope='current_session'
                    ))
        
        return violations
