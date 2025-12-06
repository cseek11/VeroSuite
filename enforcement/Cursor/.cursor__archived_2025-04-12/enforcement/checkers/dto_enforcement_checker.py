"""
DTO enforcement checker for detecting missing or invalid DTOs in NestJS controllers.

Detects:
- @Body() parameters without DTO types (any, primitives, inline literals)
- DTO types that don't have corresponding files
- DTO files without class-validator decorators

Python Bible Chapter 11: Clean Architecture principles.
"""

import re
from pathlib import Path
from typing import List, Optional, Tuple, Dict
from datetime import datetime, timezone

from .base_checker import BaseChecker, CheckerResult, CheckerStatus
from .models import Violation
from .exceptions import CheckerExecutionError
from .backend_utils import find_module_root, is_test_file
from ..autofix_suggestions import (
    dto_missing_type_hint,
    dto_missing_file_hint,
    dto_no_validators_hint
)


class DtoEnforcementChecker(BaseChecker):
    """
    Checker for enforcing DTO usage in NestJS controllers.
    
    Enforces:
    - All @Body() parameters must use proper DTO types
    - DTO types must have corresponding files in dto/ directory
    - DTO files must use class-validator decorators
    """
    
    # HTTP decorators that typically use @Body()
    HTTP_METHOD_DECORATORS = ['@Post', '@Put', '@Patch', '@Delete']
    
    # Primitive types that should not be used with @Body()
    PRIMITIVE_TYPES = {'string', 'number', 'boolean', 'unknown', 'any', 'object'}
    
    # class-validator decorators to look for
    VALIDATOR_DECORATORS = [
        r'@IsString',
        r'@IsInt',
        r'@IsNumber',
        r'@IsBoolean',
        r'@IsOptional',
        r'@IsEnum',
        r'@IsEmail',
        r'@IsArray',
        r'@IsDateString',
        r'@IsObject',
        r'@IsNotEmpty',
        r'@Length',
        r'@MaxLength',
        r'@MinLength',
        r'@Matches',
        r'@ValidateIf',
        r'@IsPhoneNumber',
    ]
    
    def check(self, changed_files: List[str], user_message: Optional[str] = None) -> CheckerResult:
        """
        Execute DTO enforcement checks.
        
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
                
                # Skip test files using shared utility
                if is_test_file(file_path):
                    continue
                
                try:
                    with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                        lines = f.readlines()
                        content = ''.join(lines)
                        
                        # Only check files with @Controller decorator
                        if '@Controller' not in content:
                            continue
                        
                        # Find all @Body() parameters
                        body_params = self._find_body_parameters(lines, content)
                        
                        for param_info in body_params:
                            # Check for missing/invalid DTO type
                            violations.extend(
                                self._check_dto_type(
                                    file_path_str, 
                                    param_info, 
                                    lines
                                )
                            )
                            
                            # If DTO type exists, check if file exists and is valid
                            if param_info['type_name'] and param_info['type_name'].endswith('Dto'):
                                violations.extend(
                                    self._check_dto_file(
                                        file_path_str,
                                        param_info,
                                        file_path
                                    )
                                )
                        
                except (FileNotFoundError, PermissionError, OSError, UnicodeDecodeError):
                    continue
            
            # Determine overall status
            if violations:
                checks_failed.append("DTO Enforcement Compliance")
                status = CheckerStatus.FAILED
            else:
                checks_passed.append("DTO Enforcement Compliance")
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
            raise CheckerExecutionError(f"DTO enforcement checker failed: {e}") from e
    
    def _find_body_parameters(
        self, 
        lines: List[str], 
        content: str
    ) -> List[Dict]:
        """
        Find all @Body() parameters in controller methods.
        
        Args:
            lines: List of lines in the file
            content: Full file content
            
        Returns:
            List of parameter info dictionaries
        """
        params = []
        
        # Pattern to match @Body() with optional field selector and type
        # Matches: @Body() data: any, @Body('field') name: string, @Body() dto: CreateUserDto
        body_pattern = re.compile(
            r'@Body\s*\((?:\s*["\']([^"\']+)["\']\s*)?\)\s+(\w+)\s*:\s*([^,)\n]+)'
        )
        
        for match in body_pattern.finditer(content):
            field_selector = match.group(1)  # e.g., 'field' in @Body('field')
            param_name = match.group(2)  # e.g., 'data' in @Body() data: any
            type_expr = match.group(3).strip()  # e.g., 'any', 'CreateUserDto', 'string'
            
            # Get line number
            line_num = content[:match.start()].count('\n') + 1
            
            # Check if this is in a method with HTTP decorator
            # Look backwards for method decorator
            method_start = self._find_method_start(content, match.start())
            has_http_decorator = self._has_http_decorator(content, method_start, match.start())
            
            # Only check @Body() without field selector (field selectors allow primitives)
            if not field_selector and has_http_decorator:
                params.append({
                    'line_number': line_num,
                    'param_name': param_name,
                    'type_name': type_expr,
                    'field_selector': field_selector,
                    'match_start': match.start(),
                    'match_end': match.end(),
                })
        
        return params
    
    def _find_method_start(self, content: str, position: int) -> int:
        """Find the start of the method containing the given position."""
        # Look backwards for method signature (async methodName( or methodName()
        method_pattern = re.compile(r'(?:async\s+)?(\w+)\s*\([^)]*\)\s*{')
        lines_before = content[:position]
        
        # Find the last method before this position
        matches = list(method_pattern.finditer(lines_before))
        if matches:
            return matches[-1].start()
        return 0
    
    def _has_http_decorator(self, content: str, method_start: int, body_pos: int) -> bool:
        """Check if method has an HTTP decorator before @Body()."""
        # Look between method start and @Body() for HTTP decorators
        context = content[method_start:body_pos]
        return any(decorator in context for decorator in self.HTTP_METHOD_DECORATORS)
    
    def _check_dto_type(
        self,
        file_path: str,
        param_info: Dict,
        lines: List[str]
    ) -> List[Violation]:
        """
        Check if @Body() parameter has a proper DTO type.
        
        Args:
            file_path: Path to the controller file
            param_info: Parameter information dictionary
            lines: List of lines in the file
            
        Returns:
            List of Violation objects
        """
        violations = []
        type_name = param_info['type_name']
        
        # Extract controller and method names from file path for better hints
        controller_path_obj = Path(file_path)
        controller_name = controller_path_obj.stem.replace('.controller', '').replace('.service', '')
        method_name = param_info.get('method_name', 'method')
        
        # Check if type is missing, any, primitive, or inline literal
        if not type_name or type_name.strip() == '':
            violations.append(Violation(
                severity='WARNING',
                rule_ref='BACKEND-R08-DTO-001',
                message=f'@Body() parameter "{param_info["param_name"]}" should use a dedicated DTO type instead of missing type.',
                file_path=file_path,
                line_number=param_info['line_number'],
                fix_hint=dto_missing_type_hint(controller_name, method_name, param_info["param_name"]),
                session_scope='current_session'
            ))
        elif type_name.strip().lower() in self.PRIMITIVE_TYPES:
            violations.append(Violation(
                severity='WARNING',
                rule_ref='BACKEND-R08-DTO-001',
                message=f'@Body() parameter "{param_info["param_name"]}" should use a dedicated DTO type instead of primitive type "{type_name}".',
                file_path=file_path,
                line_number=param_info['line_number'],
                fix_hint=dto_missing_type_hint(controller_name, method_name, param_info["param_name"]),
                session_scope='current_session'
            ))
        elif '{' in type_name and '}' in type_name:
            # Inline type literal detected
            violations.append(Violation(
                severity='WARNING',
                rule_ref='BACKEND-R08-DTO-001',
                message=f'@Body() parameter "{param_info["param_name"]}" should use a dedicated DTO type instead of inline type literal.',
                file_path=file_path,
                line_number=param_info['line_number'],
                fix_hint=dto_missing_type_hint(controller_name, method_name, param_info["param_name"]),
                session_scope='current_session'
            ))
        
        return violations
    
    def _check_dto_file(
        self,
        file_path: str,
        param_info: Dict,
        controller_path: Path
    ) -> List[Violation]:
        """
        Check if DTO file exists and has proper validation decorators.
        
        Args:
            file_path: Path to the controller file
            param_info: Parameter information dictionary
            controller_path: Path object for the controller file
            
        Returns:
            List of Violation objects
        """
        violations = []
        dto_type_name = param_info['type_name'].strip()
        
        # Find module root (directory containing *.module.ts or dto/ directory)
        module_root = find_module_root(controller_path)
        
        if not module_root:
            # Could not determine module root
            return violations
        
        # Expected DTO file path
        # Convert CreateUserDto -> create-user.dto.ts
        dto_file_name = self._dto_type_to_filename(dto_type_name)
        dto_dir = module_root / 'dto'
        dto_file_path = dto_dir / dto_file_name
        
        # Check if DTO file exists
        if not dto_file_path.exists():
            violations.append(Violation(
                severity='WARNING',
                rule_ref='BACKEND-R08-DTO-002',
                message=f'DTO type "{dto_type_name}" is used but no dto/*.dto.ts file defines it in this module.',
                file_path=file_path,
                line_number=param_info['line_number'],
                fix_hint=dto_missing_file_hint(dto_type_name, dto_file_path),
                session_scope='current_session'
            ))
            return violations
        
        # Check DTO file content
        try:
            with open(dto_file_path, 'r', encoding='utf-8', errors='ignore') as f:
                dto_content = f.read()
                
                # Check if class exists
                class_pattern = rf'export\s+class\s+{re.escape(dto_type_name)}'
                if not re.search(class_pattern, dto_content):
                    violations.append(Violation(
                        severity='WARNING',
                        rule_ref='BACKEND-R08-DTO-002',
                        message=f'DTO file {dto_file_path.relative_to(self.project_root)} does not export class {dto_type_name}.',
                        file_path=file_path,
                        line_number=param_info['line_number'],
                        fix_hint=f'Ensure {dto_file_path.name} exports class {dto_type_name}.',
                        session_scope='current_session'
                    ))
                    return violations
                
                # Check for type annotations (properties with types)
                has_typed_properties = re.search(r'\w+\s*:\s*[^,;=]+[;,]', dto_content)
                
                # Check for class-validator decorators
                has_validators = any(
                    re.search(pattern, dto_content)
                    for pattern in self.VALIDATOR_DECORATORS
                )
                
                if has_typed_properties and not has_validators:
                    violations.append(Violation(
                        severity='WARNING',
                        rule_ref='BACKEND-R08-DTO-003',
                        message=f'DTO "{dto_type_name}" has no class-validator decorators; request payload is not validated.',
                        file_path=str(dto_file_path.relative_to(self.project_root)),
                        line_number=None,  # Could parse to find class line
                        fix_hint=dto_no_validators_hint(dto_type_name, dto_file_path),
                        session_scope='current_session'
                    ))
                
        except (FileNotFoundError, PermissionError, OSError, UnicodeDecodeError):
            # File exists but couldn't read it - skip
            pass
        
        return violations
    
    
    def _dto_type_to_filename(self, dto_type: str) -> str:
        """
        Convert DTO type name to filename.
        
        Examples:
        - CreateUserDto -> create-user.dto.ts
        - UpdateCustomerDto -> update-customer.dto.ts
        
        Args:
            dto_type: DTO class name (e.g., "CreateUserDto")
            
        Returns:
            Filename (e.g., "create-user.dto.ts")
        """
        # Remove 'Dto' or 'DTO' suffix
        base = re.sub(r'Dto$|DTO$', '', dto_type, flags=re.IGNORECASE)
        
        # Convert CamelCase to kebab-case
        # Insert hyphen before uppercase letters (except first)
        kebab = re.sub(r'(?<!^)(?=[A-Z])', '-', base).lower()
        
        return f'{kebab}.dto.ts'

