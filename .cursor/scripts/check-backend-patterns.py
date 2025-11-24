#!/usr/bin/env python3
"""
R11: Backend Patterns Checker

Detects violations of NestJS backend architecture patterns:
- Business logic in controllers
- Missing DTOs or validation
- Tenant-scoped queries without tenant filters
- Multi-step operations without transactions
- Services with no business logic (pass-through)

Usage:
    python check-backend-patterns.py --file <file_path>
    python check-backend-patterns.py --pr <PR_NUMBER>
    python check-backend-patterns.py --module <module_name>
    python check-backend-patterns.py --all
"""

import os
import re
import sys
import json
import argparse
from pathlib import Path
from typing import List, Dict, Optional, Tuple
from dataclasses import dataclass, field

# ============================================================================
# Data Classes
# ============================================================================

@dataclass
class Violation:
    """Represents a backend pattern violation"""
    rule: str
    severity: str  # 'error' or 'warning'
    file: str
    line: int
    message: str
    suggestion: str
    category: str  # 'controller', 'service', 'dto', 'prisma'

@dataclass
class ControllerMethod:
    """Represents a controller method"""
    name: str
    line: int
    has_body_param: bool
    body_param_type: Optional[str]
    has_prisma_calls: bool
    has_complex_logic: bool
    delegates_to_service: bool

@dataclass
class ServiceMethod:
    """Represents a service method"""
    name: str
    line: int
    prisma_operations: List[str]
    has_transaction: bool
    has_validation: bool
    has_calculations: bool
    has_state_transitions: bool
    is_passthrough: bool

@dataclass
class DTOClass:
    """Represents a DTO class"""
    name: str
    file: str
    properties: List['DTOProperty']
    
@dataclass
class DTOProperty:
    """Represents a DTO property"""
    name: str
    type: str
    line: int
    has_validation: bool
    has_api_doc: bool
    is_optional: bool

# ============================================================================
# Tenant-Scoped Tables Configuration
# ============================================================================

TENANT_SCOPED_TABLES = [
    'account', 'workOrder', 'invoice', 'payment', 'serviceAgreement',
    'contact', 'property', 'user', 'job', 'technician', 'customer',
    'location', 'serviceType', 'pricingTier', 'auditLog'
]

# ============================================================================
# Pattern Detectors
# ============================================================================

class ControllerAnalyzer:
    """Analyzes NestJS controllers for pattern violations"""
    
    def __init__(self, file_path: str, content: str):
        self.file_path = file_path
        self.content = content
        self.lines = content.split('\n')
        
    def analyze(self) -> List[Violation]:
        """Analyze controller for violations"""
        violations = []
        
        # Check for business logic in controller
        violations.extend(self._check_business_logic())
        
        # Check for missing DTOs
        violations.extend(self._check_missing_dtos())
        
        # Check for proper decorators
        violations.extend(self._check_decorators())
        
        return violations
    
    def _check_business_logic(self) -> List[Violation]:
        """Check for business logic in controller methods"""
        violations = []
        
        # Pattern 1: Direct Prisma calls
        prisma_patterns = [
            r'this\.prisma\.',
            r'this\.db\.',
            r'await\s+prisma\.',
        ]
        
        for i, line in enumerate(self.lines, 1):
            for pattern in prisma_patterns:
                if re.search(pattern, line):
                    violations.append(Violation(
                        rule='R11',
                        severity='error',
                        file=self.file_path,
                        line=i,
                        message='Business logic detected in controller: Direct Prisma/database call',
                        suggestion='Move database operations to service layer. Controllers should only delegate to services.',
                        category='controller'
                    ))
                    break
        
        # Pattern 2: Complex conditionals (nested if statements)
        if re.search(r'if\s*\([^)]*\)\s*\{[^}]*if\s*\(', self.content):
            violations.append(Violation(
                rule='R11',
                severity='error',
                file=self.file_path,
                line=self._find_line_with_pattern(r'if\s*\([^)]*\)\s*\{[^}]*if\s*\('),
                message='Complex business logic detected in controller: Nested conditionals',
                suggestion='Move validation and business rules to service layer.',
                category='controller'
            ))
        
        # Pattern 3: Calculations/transformations
        calc_patterns = [
            r'Math\.',
            r'\.reduce\(',
            r'\.map\([^)]*=>[^}]*\{',  # Complex map with logic
            r'for\s*\(',
            r'while\s*\(',
        ]
        
        for i, line in enumerate(self.lines, 1):
            for pattern in calc_patterns:
                if re.search(pattern, line):
                    violations.append(Violation(
                        rule='R11',
                        severity='error',
                        file=self.file_path,
                        line=i,
                        message='Business calculations detected in controller',
                        suggestion='Move data transformations and calculations to service layer.',
                        category='controller'
                    ))
                    break
        
        return violations
    
    def _check_missing_dtos(self) -> List[Violation]:
        """Check for missing or improper DTO usage"""
        violations = []
        
        # Pattern 1: @Body() with 'any' type
        body_any_pattern = r'@Body\(\)\s+\w+:\s*any'
        for i, line in enumerate(self.lines, 1):
            if re.search(body_any_pattern, line):
                violations.append(Violation(
                    rule='R11',
                    severity='error',
                    file=self.file_path,
                    line=i,
                    message="Controller uses 'any' type for @Body() parameter",
                    suggestion="Create a DTO class with class-validator decorators and use it instead of 'any'.",
                    category='controller'
                ))
        
        # Pattern 2: Check if module has DTO files
        module_dir = os.path.dirname(self.file_path)
        dto_dir = os.path.join(module_dir, 'dto')
        
        if not os.path.exists(dto_dir):
            # Check if controller has @Body() parameters
            if '@Body()' in self.content:
                violations.append(Violation(
                    rule='R11',
                    severity='error',
                    file=self.file_path,
                    line=0,
                    message='Controller has @Body() parameters but no corresponding DTO directory',
                    suggestion=f"Create DTOs in '{dto_dir}/' with class-validator decorators.",
                    category='controller'
                ))
        
        return violations
    
    def _check_decorators(self) -> List[Violation]:
        """Check for proper NestJS decorators"""
        violations = []
        
        # Check for @UseGuards(JwtAuthGuard) on protected endpoints
        # (This is a heuristic - actual implementation would be more sophisticated)
        if '@Controller' in self.content:
            if '@Post(' in self.content or '@Put(' in self.content or '@Delete(' in self.content:
                if '@UseGuards(JwtAuthGuard)' not in self.content:
                    violations.append(Violation(
                        rule='R11',
                        severity='warning',
                        file=self.file_path,
                        line=0,
                        message='Controller has mutation endpoints but no @UseGuards(JwtAuthGuard)',
                        suggestion='Add @UseGuards(JwtAuthGuard) to protect endpoints that modify data.',
                        category='controller'
                    ))
        
        return violations
    
    def _find_line_with_pattern(self, pattern: str) -> int:
        """Find line number with pattern"""
        for i, line in enumerate(self.lines, 1):
            if re.search(pattern, line):
                return i
        return 0


class ServiceAnalyzer:
    """Analyzes NestJS services for pattern violations"""
    
    def __init__(self, file_path: str, content: str):
        self.file_path = file_path
        self.content = content
        self.lines = content.split('\n')
        
    def analyze(self) -> List[Violation]:
        """Analyze service for violations"""
        violations = []
        
        # Check for tenant isolation
        violations.extend(self._check_tenant_isolation())
        
        # Check for missing transactions
        violations.extend(self._check_missing_transactions())
        
        # Check for pass-through methods
        violations.extend(self._check_passthrough_methods())
        
        return violations
    
    def _check_tenant_isolation(self) -> List[Violation]:
        """Check for tenant-scoped queries without tenant filters"""
        violations = []
        
        for table in TENANT_SCOPED_TABLES:
            # Find Prisma queries on tenant-scoped tables
            query_patterns = [
                rf'prisma\.{table}\.(findFirst|findUnique|findMany|create|update|delete)\(',
                rf'this\.prisma\.{table}\.(findFirst|findUnique|findMany|create|update|delete)\(',
                rf'this\.db\.{table}\.(findFirst|findUnique|findMany|create|update|delete)\(',
                rf'tx\.{table}\.(findFirst|findUnique|findMany|create|update|delete)\(',
            ]
            
            for i, line in enumerate(self.lines, 1):
                for pattern in query_patterns:
                    if re.search(pattern, line):
                        # Check if tenant_id is in the method (within 10 lines)
                        context_start = max(0, i - 10)
                        context_end = min(len(self.lines), i + 10)
                        context = '\n'.join(self.lines[context_start:context_end])
                        
                        # Check for tenant_id filter or RLS context
                        if 'tenant_id' not in context and 'withTenant' not in context:
                            violations.append(Violation(
                                rule='R11',
                                severity='error',
                                file=self.file_path,
                                line=i,
                                message=f"Prisma query on tenant-scoped table '{table}' without tenant_id filter",
                                suggestion=f"Add tenant_id to where clause or use RLS context. See R01 (Tenant Isolation) and R02 (RLS Enforcement).",
                                category='prisma'
                            ))
                        break
        
        return violations
    
    def _check_missing_transactions(self) -> List[Violation]:
        """Check for multi-step operations without transactions"""
        violations = []
        
        # Find methods with multiple Prisma mutations
        methods = self._extract_methods()
        
        for method in methods:
            mutation_count = len([op for op in method.prisma_operations 
                                 if any(mut in op for mut in ['create', 'update', 'delete', 'createMany', 'updateMany', 'deleteMany'])])
            
            if mutation_count > 1 and not method.has_transaction:
                violations.append(Violation(
                    rule='R11',
                    severity='error',
                    file=self.file_path,
                    line=method.line,
                    message=f"Service method '{method.name}' has {mutation_count} Prisma operations without transaction",
                    suggestion="Wrap operations in prisma.$transaction() for data consistency.",
                    category='prisma'
                ))
        
        return violations
    
    def _check_passthrough_methods(self) -> List[Violation]:
        """Check for simple pass-through methods (no business logic)"""
        violations = []
        
        # Skip if this is a repository pattern file
        if '.repository.ts' in self.file_path:
            return violations
        
        methods = self._extract_methods()
        
        for method in methods:
            if method.is_passthrough:
                violations.append(Violation(
                    rule='R11',
                    severity='warning',
                    file=self.file_path,
                    line=method.line,
                    message=f"Service method '{method.name}' is a simple pass-through to Prisma",
                    suggestion="Services should contain business logic (validation, calculations, state transitions). Consider using repository pattern if intentional.",
                    category='service'
                ))
        
        return violations
    
    def _extract_methods(self) -> List[ServiceMethod]:
        """Extract service methods for analysis"""
        methods = []
        
        # Simple method extraction (would be more sophisticated with AST)
        method_pattern = r'async\s+(\w+)\s*\([^)]*\)\s*\{([^}]*(?:\{[^}]*\}[^}]*)*)\}'
        
        for match in re.finditer(method_pattern, self.content, re.DOTALL):
            method_name = match.group(1)
            method_body = match.group(2)
            method_line = self.content[:match.start()].count('\n') + 1
            
            # Analyze method body
            prisma_ops = re.findall(r'prisma\.\w+\.\w+\(|this\.prisma\.\w+\.\w+\(|this\.db\.\w+\.\w+\(|tx\.\w+\.\w+\(', method_body)
            has_transaction = '$transaction' in method_body
            has_validation = 'if (' in method_body or 'throw' in method_body
            has_calculations = 'Math.' in method_body or '.reduce(' in method_body
            has_state_transitions = 'status' in method_body and '=' in method_body
            
            # Detect pass-through: single return statement with Prisma call, no other logic
            is_passthrough = (
                len(prisma_ops) == 1 and
                not has_validation and
                not has_calculations and
                not has_state_transitions and
                method_body.strip().startswith('return')
            )
            
            methods.append(ServiceMethod(
                name=method_name,
                line=method_line,
                prisma_operations=prisma_ops,
                has_transaction=has_transaction,
                has_validation=has_validation,
                has_calculations=has_calculations,
                has_state_transitions=has_state_transitions,
                is_passthrough=is_passthrough
            ))
        
        return methods


class DTOAnalyzer:
    """Analyzes DTOs for validation and type safety"""
    
    def __init__(self, file_path: str, content: str):
        self.file_path = file_path
        self.content = content
        self.lines = content.split('\n')
        
    def analyze(self) -> List[Violation]:
        """Analyze DTO for violations"""
        violations = []
        
        # Check for 'any' types
        violations.extend(self._check_any_types())
        
        # Check for missing validation decorators
        violations.extend(self._check_missing_validation())
        
        # Check for missing API documentation
        violations.extend(self._check_missing_api_docs())
        
        return violations
    
    def _check_any_types(self) -> List[Violation]:
        """Check for 'any' types in DTO properties"""
        violations = []
        
        any_type_pattern = r'(\w+):\s*any'
        
        for i, line in enumerate(self.lines, 1):
            match = re.search(any_type_pattern, line)
            if match:
                prop_name = match.group(1)
                violations.append(Violation(
                    rule='R11',
                    severity='error',
                    file=self.file_path,
                    line=i,
                    message=f"DTO property '{prop_name}' uses 'any' type",
                    suggestion="Use proper TypeScript types (string, number, boolean, custom types, etc.).",
                    category='dto'
                ))
        
        return violations
    
    def _check_missing_validation(self) -> List[Violation]:
        """Check for properties without validation decorators"""
        violations = []
        
        # Extract properties and their decorators
        properties = self._extract_properties()
        
        for prop in properties:
            if not prop.has_validation and not prop.is_optional:
                violations.append(Violation(
                    rule='R11',
                    severity='error',
                    file=self.file_path,
                    line=prop.line,
                    message=f"DTO property '{prop.name}' missing validation decorator",
                    suggestion="Add validation decorators from class-validator (@IsString(), @IsEmail(), @IsUUID(), etc.).",
                    category='dto'
                ))
        
        return violations
    
    def _check_missing_api_docs(self) -> List[Violation]:
        """Check for properties without API documentation"""
        violations = []
        
        properties = self._extract_properties()
        
        for prop in properties:
            if not prop.has_api_doc:
                violations.append(Violation(
                    rule='R11',
                    severity='warning',
                    file=self.file_path,
                    line=prop.line,
                    message=f"DTO property '{prop.name}' missing @ApiProperty decorator",
                    suggestion="Add @ApiProperty() or @ApiPropertyOptional() for Swagger documentation.",
                    category='dto'
                ))
        
        return violations
    
    def _extract_properties(self) -> List[DTOProperty]:
        """Extract DTO properties for analysis"""
        properties = []
        
        # Look for property declarations
        prop_pattern = r'(\w+)(!|\?)?:\s*(\w+)'
        
        for i, line in enumerate(self.lines, 1):
            match = re.search(prop_pattern, line)
            if match and not line.strip().startswith('//'):
                prop_name = match.group(1)
                is_optional = match.group(2) == '?'
                prop_type = match.group(3)
                
                # Check previous lines for decorators (within 5 lines)
                decorator_start = max(0, i - 6)
                decorator_lines = self.lines[decorator_start:i-1]
                decorator_text = '\n'.join(decorator_lines)
                
                validation_decorators = [
                    '@IsString', '@IsNumber', '@IsEmail', '@IsUUID',
                    '@IsOptional', '@IsArray', '@IsEnum', '@IsDate',
                    '@IsBoolean', '@IsInt', '@IsPositive', '@Min', '@Max',
                    '@Length', '@Matches', '@IsPhoneNumber'
                ]
                
                has_validation = any(dec in decorator_text for dec in validation_decorators)
                has_api_doc = '@ApiProperty' in decorator_text or '@ApiPropertyOptional' in decorator_text
                
                properties.append(DTOProperty(
                    name=prop_name,
                    type=prop_type,
                    line=i,
                    has_validation=has_validation,
                    has_api_doc=has_api_doc,
                    is_optional=is_optional
                ))
        
        return properties


# ============================================================================
# Main Checker
# ============================================================================

class BackendPatternChecker:
    """Main checker for backend patterns"""
    
    def __init__(self):
        self.violations: List[Violation] = []
        
    def check_file(self, file_path: str) -> List[Violation]:
        """Check a single file for violations"""
        if not os.path.exists(file_path):
            print(f"Error: File not found: {file_path}", file=sys.stderr)
            return []
        
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        violations = []
        
        # Determine file type and analyze
        if file_path.endswith('.controller.ts'):
            analyzer = ControllerAnalyzer(file_path, content)
            violations.extend(analyzer.analyze())
        elif file_path.endswith('.service.ts'):
            analyzer = ServiceAnalyzer(file_path, content)
            violations.extend(analyzer.analyze())
        elif '/dto/' in file_path and file_path.endswith('.dto.ts'):
            analyzer = DTOAnalyzer(file_path, content)
            violations.extend(analyzer.analyze())
        
        return violations
    
    def check_module(self, module_name: str) -> List[Violation]:
        """Check all files in a module"""
        # Find module directory
        module_paths = [
            f"apps/api/src/{module_name}",
            f"backend/src/{module_name}",
        ]
        
        module_dir = None
        for path in module_paths:
            if os.path.exists(path):
                module_dir = path
                break
        
        if not module_dir:
            print(f"Error: Module not found: {module_name}", file=sys.stderr)
            return []
        
        violations = []
        
        # Check all TypeScript files in module
        for root, dirs, files in os.walk(module_dir):
            for file in files:
                if file.endswith('.ts') and not file.endswith('.spec.ts'):
                    file_path = os.path.join(root, file)
                    violations.extend(self.check_file(file_path))
        
        return violations
    
    def check_pr(self, pr_number: str) -> List[Violation]:
        """Check all changed files in a PR"""
        # Get changed files from git
        import subprocess
        
        try:
            result = subprocess.run(
                ['git', 'diff', '--name-only', f'origin/main...HEAD'],
                capture_output=True,
                text=True,
                check=True
            )
            
            changed_files = result.stdout.strip().split('\n')
            
            violations = []
            for file in changed_files:
                if file.endswith('.ts') and not file.endswith('.spec.ts'):
                    violations.extend(self.check_file(file))
            
            return violations
            
        except subprocess.CalledProcessError as e:
            print(f"Error: Failed to get changed files: {e}", file=sys.stderr)
            return []
    
    def check_all(self) -> List[Violation]:
        """Check all backend files"""
        violations = []
        
        # Check all backend directories
        backend_dirs = [
            "apps/api/src",
            "backend/src",
        ]
        
        for backend_dir in backend_dirs:
            if os.path.exists(backend_dir):
                for root, dirs, files in os.walk(backend_dir):
                    # Skip test directories
                    if '__tests__' in root or 'test' in root:
                        continue
                    
                    for file in files:
                        if file.endswith('.ts') and not file.endswith('.spec.ts'):
                            file_path = os.path.join(root, file)
                            violations.extend(self.check_file(file_path))
        
        return violations
    
    def format_output(self, violations: List[Violation], format: str = 'text') -> str:
        """Format violations for output"""
        if format == 'json':
            return json.dumps([{
                'rule': v.rule,
                'severity': v.severity,
                'file': v.file,
                'line': v.line,
                'message': v.message,
                'suggestion': v.suggestion,
                'category': v.category
            } for v in violations], indent=2)
        
        # Text format
        output = []
        
        if not violations:
            output.append("✅ No backend pattern violations found!")
            return '\n'.join(output)
        
        # Group by category
        by_category = {}
        for v in violations:
            if v.category not in by_category:
                by_category[v.category] = []
            by_category[v.category].append(v)
        
        # Summary
        error_count = len([v for v in violations if v.severity == 'error'])
        warning_count = len([v for v in violations if v.severity == 'warning'])
        
        output.append(f"\n❌ Backend Pattern Violations: {error_count} errors, {warning_count} warnings\n")
        
        # Details by category
        for category, cat_violations in sorted(by_category.items()):
            output.append(f"\n{'='*80}")
            output.append(f"{category.upper()} VIOLATIONS ({len(cat_violations)})")
            output.append('='*80)
            
            for v in cat_violations:
                severity_icon = '❌' if v.severity == 'error' else '⚠️'
                output.append(f"\n{severity_icon} {v.file}:{v.line}")
                output.append(f"   Message: {v.message}")
                output.append(f"   Suggestion: {v.suggestion}")
        
        output.append(f"\n{'='*80}")
        output.append(f"SUMMARY: {error_count} errors, {warning_count} warnings")
        output.append('='*80)
        
        return '\n'.join(output)


# ============================================================================
# CLI
# ============================================================================

def main():
    parser = argparse.ArgumentParser(
        description='Check backend code for NestJS architecture pattern violations (R11)'
    )
    
    group = parser.add_mutually_exclusive_group(required=True)
    group.add_argument('--file', help='Check a single file')
    group.add_argument('--module', help='Check all files in a module')
    group.add_argument('--pr', help='Check all changed files in a PR')
    group.add_argument('--all', action='store_true', help='Check all backend files')
    
    parser.add_argument('--format', choices=['text', 'json'], default='text',
                       help='Output format (default: text)')
    parser.add_argument('--strict', action='store_true',
                       help='Treat warnings as errors')
    
    args = parser.parse_args()
    
    checker = BackendPatternChecker()
    
    # Run checks
    if args.file:
        violations = checker.check_file(args.file)
    elif args.module:
        violations = checker.check_module(args.module)
    elif args.pr:
        violations = checker.check_pr(args.pr)
    elif args.all:
        violations = checker.check_all()
    
    # Output results
    output = checker.format_output(violations, args.format)
    print(output)
    
    # Exit code
    error_count = len([v for v in violations if v.severity == 'error'])
    warning_count = len([v for v in violations if v.severity == 'warning'])
    
    if error_count > 0:
        sys.exit(1)
    elif args.strict and warning_count > 0:
        sys.exit(1)
    else:
        sys.exit(0)


if __name__ == '__main__':
    main()



