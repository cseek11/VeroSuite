#!/usr/bin/env python3
"""
R16: Testing Requirements (Additional) Checker

Detects additional testing requirements beyond basic unit/regression/integration tests.

Usage:
    python check-additional-testing.py --file <file_path>
    python check-additional-testing.py --pr <PR_NUMBER>
    python check-additional-testing.py --test-type error-path
    python check-additional-testing.py --all
"""

import argparse
import os
import re
import ast
from pathlib import Path
from typing import List, Dict, Set, Optional

class AdditionalTestingChecker:
    """Checker for R16: Testing Requirements (Additional)"""
    
    # Test requirement patterns
    ERROR_PATH_KEYWORDS = ['throw', 'Exception', 'error', 'validation', 'BadRequest', 'UnprocessableEntity']
    STATE_MACHINE_KEYWORDS = ['Status', 'transition', 'state', 'enum']
    TENANT_ISOLATION_KEYWORDS = ['tenant_id', 'tenantId', 'withTenant', 'RLS']
    OBSERVABILITY_KEYWORDS = ['logger', 'log', 'traceId', 'structured']
    SECURITY_KEYWORDS = ['auth', 'login', 'authenticate', 'authorize', 'permission', 'role']
    
    def __init__(self):
        self.violations = []
        
    def check_file(self, file_path: str) -> List[Dict]:
        """Check a single file for additional testing requirements"""
        violations = []
        
        if not os.path.exists(file_path):
            return violations
        
        # Skip test files
        if self._is_test_file(file_path):
            return violations
        
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
        except Exception as e:
            print(f"Warning: Could not read {file_path}: {e}")
            return violations
        
        # Detect requirements using pattern matching
        requirements = self._detect_requirements(file_path, content)
        
        # Validate requirements using AST parsing (if Python/TypeScript)
        if file_path.endswith('.py'):
            requirements = self._validate_requirements_python(file_path, content, requirements)
        elif file_path.endswith(('.ts', '.tsx')):
            requirements = self._validate_requirements_typescript(file_path, content, requirements)
        
        # Check if tests exist for each requirement
        test_file_path = self._get_test_file_path(file_path)
        for req in requirements:
            if not self._has_test_for_requirement(test_file_path, req):
                violations.append(self._create_violation(file_path, req))
        
        return violations
    
    def _detect_requirements(self, file_path: str, content: str) -> Set[str]:
        """Detect test requirements using pattern matching (fast)"""
        requirements = set()
        
        # Always require error path tests for new features
        if self._has_new_functions(content):
            requirements.add('error_path')
        
        # State machine tests
        if any(kw in content for kw in self.STATE_MACHINE_KEYWORDS):
            if re.search(r'enum.*Status.*\{', content):
                requirements.add('state_machine')
        
        # Tenant isolation tests
        if any(kw in content for kw in self.TENANT_ISOLATION_KEYWORDS):
            if re.search(r'prisma\.\w+\.find|withTenant', content):
                requirements.add('tenant_isolation')
        
        # Always require observability tests for new features
        if self._has_new_functions(content):
            requirements.add('observability')
        
        # Security tests (context-aware)
        if 'auth' in file_path.lower() or 'payment' in file_path.lower():
            requirements.add('security')
        elif any(kw in content for kw in self.SECURITY_KEYWORDS):
            if re.search(r'async.*login|authenticate|authorize', content):
                requirements.add('security')
        
        # Data migration tests
        if 'migration' in file_path.lower() or file_path.endswith('.sql'):
            requirements.add('data_migration')
        
        # Performance tests (conditional - only if marked)
        if '// @performance-critical' in content or '# @performance-critical' in content:
            requirements.add('performance')
        
        # Accessibility tests (conditional - only for UI components)
        if self._is_ui_component(file_path):
            requirements.add('accessibility')
        
        return requirements
    
    def _validate_requirements_python(self, file_path: str, content: str, requirements: Set[str]) -> Set[str]:
        """Validate requirements using Python AST parsing (accurate)"""
        try:
            tree = ast.parse(content)
        except SyntaxError:
            return requirements  # Return pattern-matched requirements if parsing fails
        
        validated = set()
        
        for req in requirements:
            if req == 'state_machine':
                # Validate: enum exists + transition methods exist
                if self._has_state_enum_python(tree) and self._has_transition_methods_python(tree):
                    validated.add(req)
            
            elif req == 'tenant_isolation':
                # Validate: tenant_id used in queries
                if self._has_tenant_queries_python(tree):
                    validated.add(req)
            
            else:
                # Keep other requirements (pattern matching sufficient)
                validated.add(req)
        
        return validated
    
    def _validate_requirements_typescript(self, file_path: str, content: str, requirements: Set[str]) -> Set[str]:
        """Validate requirements using TypeScript analysis (simplified)"""
        # Simplified TypeScript validation (full AST parsing would require TypeScript compiler)
        validated = set()
        
        for req in requirements:
            if req == 'state_machine':
                # Validate: enum exists + transition methods exist
                if re.search(r'enum\s+\w*Status', content) and re.search(r'transition\w*\(', content):
                    validated.add(req)
            
            elif req == 'tenant_isolation':
                # Validate: tenant_id used in queries
                if re.search(r'where:\s*\{[^}]*tenant', content, re.IGNORECASE):
                    validated.add(req)
            
            else:
                # Keep other requirements
                validated.add(req)
        
        return validated
    
    def _has_state_enum_python(self, tree: ast.AST) -> bool:
        """Check if Python AST has state enum"""
        for node in ast.walk(tree):
            if isinstance(node, ast.ClassDef):
                if 'Status' in node.name and any(
                    isinstance(base, ast.Name) and base.id == 'Enum'
                    for base in node.bases
                ):
                    return True
        return False
    
    def _has_transition_methods_python(self, tree: ast.AST) -> bool:
        """Check if Python AST has transition methods"""
        for node in ast.walk(tree):
            if isinstance(node, ast.FunctionDef):
                if 'transition' in node.name.lower():
                    return True
        return False
    
    def _has_tenant_queries_python(self, tree: ast.AST) -> bool:
        """Check if Python AST has tenant queries"""
        for node in ast.walk(tree):
            if isinstance(node, ast.Call):
                if isinstance(node.func, ast.Attribute):
                    if 'find' in node.func.attr or 'filter' in node.func.attr:
                        # Check if tenant_id in arguments
                        for keyword in node.keywords:
                            if 'tenant' in keyword.arg.lower():
                                return True
        return False
    
    def _has_new_functions(self, content: str) -> bool:
        """Check if content has new functions (simplified)"""
        # Simplified check: looks for function definitions
        return bool(re.search(r'(async\s+)?function\s+\w+|def\s+\w+|const\s+\w+\s*=\s*\(', content))
    
    def _is_test_file(self, file_path: str) -> bool:
        """Check if file is a test file"""
        return bool(re.search(r'\.(test|spec)\.(ts|tsx|js|jsx|py)$', file_path))
    
    def _is_ui_component(self, file_path: str) -> bool:
        """Check if file is a UI component"""
        return bool(
            ('frontend/src/components' in file_path or 'components' in file_path) and
            file_path.endswith(('.tsx', '.jsx'))
        )
    
    def _get_test_file_path(self, file_path: str) -> str:
        """Get corresponding test file path"""
        # Remove extension
        base = re.sub(r'\.(ts|tsx|js|jsx|py)$', '', file_path)
        
        # Try different test file patterns
        ext = Path(file_path).suffix
        test_patterns = [
            f"{base}.spec{ext}",
            f"{base}.test{ext}",
            f"{base}/__tests__/{Path(file_path).stem}.spec{ext}",
        ]
        
        for pattern in test_patterns:
            if os.path.exists(pattern):
                return pattern
        
        # Return most likely pattern (even if doesn't exist)
        return f"{base}.spec{ext}"
    
    def _has_test_for_requirement(self, test_file_path: str, requirement: str) -> bool:
        """Check if test file has tests for requirement"""
        if not os.path.exists(test_file_path):
            return False
        
        try:
            with open(test_file_path, 'r', encoding='utf-8') as f:
                test_content = f.read()
        except Exception:
            return False
        
        # Pattern matching for test content
        patterns = {
            'error_path': [
                r'throw.*Exception',
                r'expect.*toThrow',
                r'should.*error',
                r'validation.*error',
                r'BadRequest|UnprocessableEntity|InternalServerError'
            ],
            'state_machine': [
                r'transition.*status',
                r'legal.*transition',
                r'illegal.*transition',
                r'state.*machine'
            ],
            'tenant_isolation': [
                r'tenant.*isolation',
                r'cross.*tenant',
                r'RLS.*policy',
                r'tenant.*context'
            ],
            'observability': [
                r'structured.*log',
                r'traceId',
                r'trace.*propagation',
                r'logger.*\w+'
            ],
            'security': [
                r'authentication',
                r'authorization',
                r'input.*validation',
                r'security.*test'
            ],
            'data_migration': [
                r'migration.*idempotency',
                r'data.*integrity',
                r'rollback'
            ],
            'performance': [
                r'performance',
                r'response.*time',
                r'latency',
                r'p95|p99'
            ],
            'accessibility': [
                r'accessibility',
                r'WCAG',
                r'keyboard.*navigation',
                r'screen.*reader',
                r'aria'
            ]
        }
        
        if requirement not in patterns:
            return False
        
        return any(re.search(pattern, test_content, re.IGNORECASE) for pattern in patterns[requirement])
    
    def _create_violation(self, file_path: str, requirement: str) -> Dict:
        """Create violation dictionary"""
        messages = {
            'error_path': 'Missing error path tests. Add tests covering validation errors (400), business rule errors (422), and system errors (500).',
            'state_machine': 'Missing state machine tests. Add tests for legal transitions, illegal transitions, and audit logging.',
            'tenant_isolation': 'Missing tenant isolation tests. Add tests verifying cross-tenant access prevention and RLS enforcement.',
            'observability': 'Missing observability tests. Add tests verifying structured logging (level, message, timestamp, traceId, context) and trace ID propagation.',
            'security': 'Missing security tests. Add tests for authentication, authorization, input validation, and audit logging.',
            'data_migration': 'Missing data migration tests. Add tests verifying idempotency, data integrity, and rollback capability.',
            'performance': 'Missing performance tests. Add tests verifying response time thresholds and performance budgets.',
            'accessibility': 'Missing accessibility tests. Add tests verifying WCAG AA compliance (keyboard navigation, screen readers, color contrast).'
        }
        
        return {
            'file': file_path,
            'requirement': requirement,
            'severity': 'warning',
            'message': f'WARNING [Quality/R16]: {messages.get(requirement, "Missing additional tests.")}',
            'suggestion': f'Create tests for {requirement.replace("_", " ")} in corresponding test file.'
        }
    
    def format_output(self, violations: List[Dict]) -> str:
        """Format violations for output"""
        if not violations:
            return "✅ No additional testing violations found."
        
        output = []
        output.append(f"\n⚠️  Found {len(violations)} additional testing warning(s):\n")
        
        # Group by file
        by_file = {}
        for v in violations:
            file_path = v['file']
            if file_path not in by_file:
                by_file[file_path] = []
            by_file[file_path].append(v)
        
        for file_path, file_violations in by_file.items():
            output.append(f"  {file_path}")
            for v in file_violations:
                output.append(f"    Requirement: {v['requirement']}")
                output.append(f"      Severity: {v['severity']}")
                output.append(f"      Message: {v['message']}")
                if v.get('suggestion'):
                    output.append(f"      Suggestion: {v['suggestion']}")
                output.append("")
        
        return "\n".join(output)

def main():
    parser = argparse.ArgumentParser(description='R16: Testing Requirements (Additional) Checker')
    parser.add_argument('--file', help='Check a single file')
    parser.add_argument('--pr', help='Check files in a PR (requires PR number)')
    parser.add_argument('--test-type', help='Check for specific test type (error-path, state-machine, etc.)')
    parser.add_argument('--all', action='store_true', help='Check all files in repository')
    
    args = parser.parse_args()
    
    checker = AdditionalTestingChecker()
    all_violations = []
    
    if args.file:
        violations = checker.check_file(args.file)
        all_violations.extend(violations)
    
    elif args.all:
        # Check all TypeScript/JavaScript/Python files
        for ext in ['*.ts', '*.tsx', '*.js', '*.jsx', '*.py']:
            for file_path in Path('.').rglob(ext):
                if 'node_modules' not in str(file_path) and '.git' not in str(file_path):
                    violations = checker.check_file(str(file_path))
                    all_violations.extend(violations)
    
    elif args.pr:
        print("PR checking not yet implemented. Use --file or --all instead.")
        return
    
    else:
        parser.print_help()
        return
    
    # Output results
    print(checker.format_output(all_violations))
    
    # Exit with appropriate code (warnings don't fail)
    return 0

if __name__ == '__main__':
    exit(main())





