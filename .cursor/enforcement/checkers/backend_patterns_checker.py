"""
Backend patterns checker for detecting code-structure patterns and smells.

Detects:
- Business logic in controllers
- Multi-step operations without transactions
- Prisma usage in controllers (bypassing services)
- Pass-through services (no domain logic)

Python Bible Chapter 11: Clean Architecture principles.
"""

import re
from pathlib import Path
from typing import List, Optional, Dict
from datetime import datetime, timezone

from .base_checker import BaseChecker, CheckerResult, CheckerStatus
from .models import Violation
from .exceptions import CheckerExecutionError
from ..autofix_suggestions import (
    business_logic_in_controller_fix_hint,
    prisma_in_controller_fix_hint,
    multi_step_no_transaction_fix_hint,
    pass_through_service_fix_hint
)
from .backend_utils import parse_controller_structure


class ControllerAnalyzer:
    """Analyzes NestJS controllers for pattern violations."""
    
    def __init__(self, file_path: str, content: str, lines: List[str]):
        self.file_path = file_path
        self.content = content
        self.lines = lines
    
    def analyze(self) -> List[Violation]:
        """
        Analyze controller for pattern violations.
        
        Returns:
            List of Violation objects
        """
        violations = []
        
        # Check for business logic in controllers
        violations.extend(self._check_business_logic())
        
        # Check for Prisma usage in controllers
        violations.extend(self._check_prisma_in_controller())
        
        return violations
    
    def _check_business_logic(self) -> List[Violation]:
        """
        Check for business logic in controller methods.
        
        Rule: BACKEND-R08-PATTERN-001
        
        Returns:
            List of Violation objects
        """
        violations = []
        
        # Extract methods from controller
        methods = self._extract_methods()
        
        for method in methods:
            method_body = method['body']
            method_name = method['name']
            method_line = method['line']
            
            # Check for complex control flow (loops, nested conditionals)
            has_loops = any(
                re.search(pattern, method_body)
                for pattern in [
                    r'\bfor\s*\(',
                    r'\bfor\s+of\s+',
                    r'\.forEach\s*\(',
                    r'\.map\s*\([^)]*=>[^}]*\{',
                    r'\.reduce\s*\(',
                    r'\bwhile\s*\(',
                ]
            )
            
            # Check for multiple conditionals
            if_count = len(re.findall(r'\bif\s*\(', method_body))
            switch_count = len(re.findall(r'\bswitch\s*\(', method_body))
            has_multiple_conditionals = (if_count + switch_count) >= 2
            
            # Check for calculations/transformations
            has_calculations = any(
                re.search(pattern, method_body)
                for pattern in [
                    r'Math\.',
                    r'[+\-*/%]=',  # Compound assignment operators
                    r'\.reduce\s*\(',
                ]
            )
            
            # Check for service delegation
            has_service_delegation = re.search(
                r'this\.\w+Service\.\w+\s*\(',
                method_body
            )
            
            # Business logic detected if:
            # 1. Has loops/calculations AND no service delegation, OR
            # 2. Has multiple conditionals AND no service delegation, OR
            # 3. Has Prisma calls directly (handled separately but also indicates business logic)
            has_prisma = re.search(
                r'(?:this\.|await\s+)?prisma\.',
                method_body
            )
            
            if (has_loops or has_multiple_conditionals or has_calculations) and not has_service_delegation:
                controller_name = None
                controller_match = re.search(r'export\s+class\s+(\w+Controller)', self.content)
                if controller_match:
                    controller_name = controller_match.group(1)
                
                violations.append(Violation(
                    severity='WARNING',
                    rule_ref='BACKEND-R08-PATTERN-001',
                    message=f'Controller method {method_name} appears to contain business logic (loops/conditionals/transformations). Move domain logic into a service and keep the controller thin.',
                    file_path=self.file_path,
                    line_number=method_line,
                    fix_hint=business_logic_in_controller_fix_hint(controller_name or 'Controller'),
                    session_scope='current_session'
                ))
        
        return violations
    
    def _check_prisma_in_controller(self) -> List[Violation]:
        """
        Check for Prisma usage in controllers (bypassing service layer).
        
        Rule: BACKEND-R08-PATTERN-003
        
        Returns:
            List of Violation objects
        """
        violations = []
        
        # Patterns for Prisma calls
        prisma_patterns = [
            r'this\.prisma\.',
            r'this\.db\.',
            r'await\s+prisma\.',
            r'prisma\.\w+\.',
        ]
        
        controller_name = None
        controller_match = re.search(r'export\s+class\s+(\w+Controller)', self.content)
        if controller_match:
            controller_name = controller_match.group(1)
        
        for i, line in enumerate(self.lines, 1):
            # Skip comments
            if line.strip().startswith('//') or line.strip().startswith('*'):
                continue
            
            for pattern in prisma_patterns:
                if re.search(pattern, line):
                    # Check if it's in a method (not in imports or type definitions)
                    # Look for method context (async methodName( or methodName()
                    context_start = max(0, i - 10)
                    context_end = min(len(self.lines), i + 10)
                    context = '\n'.join(self.lines[context_start:context_end])
                    
                    # Verify it's in a method body (has method signature nearby)
                    if re.search(r'(?:async\s+)?\w+\s*\([^)]*\)\s*\{', context):
                        violations.append(Violation(
                            severity='WARNING',
                            rule_ref='BACKEND-R08-PATTERN-003',
                            message=f'Controller {controller_name or "Controller"} calls Prisma directly. Route Prisma access through a service layer instead of from controllers.',
                            file_path=self.file_path,
                            line_number=i,
                            fix_hint=prisma_in_controller_fix_hint(controller_name or 'Controller'),
                            session_scope='current_session'
                        ))
                        break  # Only report once per line
        
        return violations
    
    def _extract_methods(self) -> List[Dict]:
        """
        Extract controller methods for analysis.
        
        Returns:
            List of method dictionaries with name, line, and body
        """
        methods = []
        
        # Pattern to match async methods: async methodName(...) { ... }
        method_pattern = re.compile(
            r'(?:async\s+)?(\w+)\s*\([^)]*\)\s*\{([^{}]*(?:\{[^{}]*\}[^{}]*)*)\}',
            re.DOTALL
        )
        
        for match in method_pattern.finditer(self.content):
            method_name = match.group(1)
            method_body = match.group(2)
            method_line = self.content[:match.start()].count('\n') + 1
            
            methods.append({
                'name': method_name,
                'line': method_line,
                'body': method_body,
            })
        
        return methods


class ServiceAnalyzer:
    """Analyzes NestJS services for pattern violations."""
    
    def __init__(self, file_path: str, content: str, lines: List[str]):
        self.file_path = file_path
        self.content = content
        self.lines = lines
    
    def analyze(self) -> List[Violation]:
        """
        Analyze service for pattern violations.
        
        Returns:
            List of Violation objects
        """
        violations = []
        
        # Check for missing transactions
        violations.extend(self._check_missing_transactions())
        
        # Check for pass-through services
        violations.extend(self._check_passthrough_methods())
        
        return violations
    
    def _check_missing_transactions(self) -> List[Violation]:
        """
        Check for multi-step operations without $transaction.
        
        Rule: BACKEND-R08-PATTERN-002
        
        Returns:
            List of Violation objects
        """
        violations = []
        
        methods = self._extract_methods()
        
        for method in methods:
            method_body = method['body']
            method_name = method['name']
            method_line = method['line']
            
            # Find all Prisma mutation operations
            mutation_patterns = [
                r'prisma\.\w+\.(create|update|delete|upsert|createMany|updateMany|deleteMany)\s*\(',
                r'this\.prisma\.\w+\.(create|update|delete|upsert|createMany|updateMany|deleteMany)\s*\(',
                r'this\.db\.\w+\.(create|update|delete|upsert|createMany|updateMany|deleteMany)\s*\(',
                r'tx\.\w+\.(create|update|delete|upsert|createMany|updateMany|deleteMany)\s*\(',
            ]
            
            mutation_count = 0
            for pattern in mutation_patterns:
                mutations = re.findall(pattern, method_body)
                mutation_count += len(mutations)
            
            # Check if $transaction is used
            has_transaction = (
                '$transaction' in method_body or
                'prisma.$transaction' in method_body or
                'this.prisma.$transaction' in method_body
            )
            
            # If multiple mutations and no transaction, emit violation
            if mutation_count >= 2 and not has_transaction:
                violations.append(Violation(
                    severity='WARNING',
                    rule_ref='BACKEND-R08-PATTERN-002',
                    message=f'Method {method_name} performs {mutation_count} Prisma operations without using $transaction. Consider wrapping related operations to ensure atomicity.',
                    file_path=self.file_path,
                    line_number=method_line,
                    fix_hint=multi_step_no_transaction_fix_hint(),
                    session_scope='current_session'
                ))
        
        return violations
    
    def _check_passthrough_methods(self) -> List[Violation]:
        """
        Check for pass-through services (no domain logic).
        
        Rule: BACKEND-R08-PATTERN-004
        
        Returns:
            List of Violation objects
        """
        violations = []
        
        # Skip repository pattern files (they're meant to be pass-through)
        if '.repository.ts' in self.file_path:
            return violations
        
        methods = self._extract_methods()
        
        if not methods:
            return violations
        
        # Count pass-through methods
        passthrough_count = 0
        total_methods = len(methods)
        
        for method in methods:
            method_body = method['body']
            
            # Find Prisma calls
            prisma_calls = re.findall(
                r'(?:this\.|await\s+)?prisma\.\w+\.\w+\s*\(',
                method_body
            )
            
            # Check for domain logic indicators
            has_validation = bool(re.search(r'\bif\s*\(|\bthrow\s+', method_body))
            has_calculations = bool(re.search(r'Math\.|\.reduce\s*\(|\.map\s*\([^)]*=>', method_body))
            has_conditionals = len(re.findall(r'\bif\s*\(|\bswitch\s*\(', method_body)) > 0
            has_loops = bool(re.search(r'\bfor\s*\(|\bwhile\s*\(|\.forEach\s*\(', method_body))
            
            # Pass-through: single Prisma call, no domain logic, simple return
            is_passthrough = (
                len(prisma_calls) == 1 and
                not has_validation and
                not has_calculations and
                not has_conditionals and
                not has_loops and
                method_body.strip().startswith('return')
            )
            
            if is_passthrough:
                passthrough_count += 1
        
        # If 80% or more methods are pass-through, flag the service
        passthrough_ratio = passthrough_count / total_methods if total_methods > 0 else 0
        
        if passthrough_ratio >= 0.8 and total_methods >= 2:
            service_name = None
            service_match = re.search(r'export\s+class\s+(\w+Service)', self.content)
            if service_match:
                service_name = service_match.group(1)
            
            violations.append(Violation(
                severity='WARNING',
                rule_ref='BACKEND-R08-PATTERN-004',
                message=f'Service {service_name or "Service"} appears to be a pass-through wrapper around Prisma with little or no domain logic ({passthrough_count}/{total_methods} methods are pass-through).',
                file_path=self.file_path,
                line_number=None,
                fix_hint=pass_through_service_fix_hint(service_name or 'Service'),
                session_scope='current_session'
            ))
        
        return violations
    
    def _extract_methods(self) -> List[Dict]:
        """
        Extract service methods for analysis.
        
        Returns:
            List of method dictionaries with name, line, and body
        """
        methods = []
        
        # Pattern to match async methods: async methodName(...) { ... }
        method_pattern = re.compile(
            r'(?:async\s+)?(\w+)\s*\([^)]*\)\s*\{([^{}]*(?:\{[^{}]*\}[^{}]*)*)\}',
            re.DOTALL
        )
        
        for match in method_pattern.finditer(self.content):
            method_name = match.group(1)
            method_body = match.group(2)
            method_line = self.content[:match.start()].count('\n') + 1
            
            methods.append({
                'name': method_name,
                'line': method_line,
                'body': method_body,
            })
        
        return methods


class BackendPatternsChecker(BaseChecker):
    """
    Checker for backend code-structure patterns.
    
    Enforces:
    - Business logic placement (controllers vs services)
    - Transaction usage for multi-step operations
    - Service layer encapsulation (no Prisma in controllers)
    - Domain logic in services (not pass-through)
    """
    
    def check(self, changed_files: List[str], user_message: Optional[str] = None) -> CheckerResult:
        """
        Execute backend patterns checks.
        
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
            # Filter to controller and service files
            controller_files = [
                f for f in changed_files
                if (f.startswith('apps/api/') or f.startswith('libs/'))
                and f.endswith('.controller.ts')
            ]
            
            service_files = [
                f for f in changed_files
                if (f.startswith('apps/api/') or f.startswith('libs/'))
                and f.endswith('.service.ts')
            ]
            
            files_checked = len(controller_files) + len(service_files)
            
            # Analyze controllers
            for file_path_str in controller_files:
                file_path = self.project_root / file_path_str
                
                if not file_path.exists():
                    continue
                
                # Skip test files
                if 'test' in str(file_path).lower() or 'spec' in str(file_path).lower():
                    continue
                
                try:
                    with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                        lines = f.readlines()
                        content = ''.join(lines)
                    
                    # Only check files with @Controller decorator
                    if '@Controller' in content:
                        analyzer = ControllerAnalyzer(file_path_str, content, lines)
                        violations.extend(analyzer.analyze())
                        
                except (FileNotFoundError, PermissionError, OSError, UnicodeDecodeError):
                    continue
            
            # Analyze services
            for file_path_str in service_files:
                file_path = self.project_root / file_path_str
                
                if not file_path.exists():
                    continue
                
                # Skip test files
                if 'test' in str(file_path).lower() or 'spec' in str(file_path).lower():
                    continue
                
                try:
                    with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                        lines = f.readlines()
                        content = ''.join(lines)
                    
                    # Only check files with @Injectable decorator
                    if '@Injectable' in content:
                        analyzer = ServiceAnalyzer(file_path_str, content, lines)
                        violations.extend(analyzer.analyze())
                        
                except (FileNotFoundError, PermissionError, OSError, UnicodeDecodeError):
                    continue
            
            # Determine overall status
            if violations:
                checks_failed.append("Backend Patterns Compliance")
                status = CheckerStatus.FAILED
            else:
                checks_passed.append("Backend Patterns Compliance")
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
            raise CheckerExecutionError(f"Backend patterns checker failed: {e}") from e

