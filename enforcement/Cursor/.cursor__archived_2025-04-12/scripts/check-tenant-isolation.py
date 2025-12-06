#!/usr/bin/env python3
"""
Tenant Isolation Checker - R01

Automated checks for tenant isolation violations in TypeScript code.
Scans for:
- Prisma queries without tenant_id filter
- Raw SQL without withTenant() wrapper
- API endpoints accepting tenant_id from request
- Missing auth guards on protected endpoints
- tenant_id exposed in error messages

Usage:
    python check-tenant-isolation.py <file_or_directory>
    python check-tenant-isolation.py apps/api/src/users/users.service.ts
    python check-tenant-isolation.py apps/api/src/

Created: 2025-12-04
Version: 1.0.0
"""

import os
import re
import sys
from pathlib import Path
from typing import List, Dict, Tuple

class TenantIsolationChecker:
    def __init__(self):
        self.violations = []
        self.files_checked = 0
        self.violations_found = 0
        
        # Patterns for detection
        self.prisma_query_pattern = re.compile(r'(findMany|findUnique|findFirst)\s*\(')
        self.raw_sql_pattern = re.compile(r'\$(?:queryRawUnsafe|executeRawUnsafe)\s*\(')
        self.tenant_in_request_pattern = re.compile(r'@(?:Body|Query|Param)\s*\([\'"]tenant_?id[\'"]')
        self.endpoint_pattern = re.compile(r'@(?:Post|Put|Patch|Delete)\s*\(')
        self.auth_guard_pattern = re.compile(r'@UseGuards\s*\(\s*(?:JwtAuthGuard|LocalAuthGuard)')
        self.public_marker_pattern = re.compile(r'@Public\s*\(')
        self.error_tenant_pattern = re.compile(r'throw\s+new\s+\w+Error\s*\([^)]*tenant[_-]?id[^)]*\$\{')
        
    def check_file(self, file_path: str) -> List[Dict]:
        """Check a single file for tenant isolation violations."""
        violations = []
        
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
                lines = content.split('\n')
                
            # Check based on file type
            if file_path.endswith('.service.ts'):
                violations.extend(self._check_service_file(file_path, content, lines))
            elif file_path.endswith('.controller.ts'):
                violations.extend(self._check_controller_file(file_path, content, lines))
            elif file_path.endswith('.ts'):
                # Check for error message violations in any TS file
                violations.extend(self._check_error_messages(file_path, content, lines))
                
        except Exception as e:
            print(f"⚠️  Error reading {file_path}: {e}")
            
        return violations
    
    def _check_service_file(self, file_path: str, content: str, lines: List[str]) -> List[Dict]:
        """Check service file for database query violations."""
        violations = []
        
        for i, line in enumerate(lines, 1):
            # Check for Prisma queries without tenant_id
            if self.prisma_query_pattern.search(line):
                # Look ahead for tenant_id or withTenant in the next few lines
                context = '\n'.join(lines[max(0, i-1):min(len(lines), i+5)])
                
                if 'tenant_id' not in context.lower() and 'withTenant' not in context:
                    violations.append({
                        'file': file_path,
                        'line': i,
                        'type': 'missing_tenant_filter',
                        'severity': 'CRITICAL',
                        'message': 'Prisma query without tenant_id filter',
                        'suggestion': 'Add where: { tenant_id: tenantId } or use withTenant() wrapper'
                    })
            
            # Check for raw SQL without withTenant wrapper
            if self.raw_sql_pattern.search(line):
                # Look back for withTenant wrapper
                context_before = '\n'.join(lines[max(0, i-10):i])
                
                if 'withTenant' not in context_before:
                    violations.append({
                        'file': file_path,
                        'line': i,
                        'type': 'raw_sql_without_wrapper',
                        'severity': 'CRITICAL',
                        'message': 'Raw SQL without withTenant() wrapper',
                        'suggestion': 'Wrap query: await this.db.withTenant(tenantId, async () => { ... })'
                    })
        
        return violations
    
    def _check_controller_file(self, file_path: str, content: str, lines: List[str]) -> List[Dict]:
        """Check controller file for API endpoint violations."""
        violations = []
        
        for i, line in enumerate(lines, 1):
            # Check for tenant_id in request decorators
            if self.tenant_in_request_pattern.search(line):
                violations.append({
                    'file': file_path,
                    'line': i,
                    'type': 'tenant_id_in_request',
                    'severity': 'CRITICAL',
                    'message': 'API endpoint accepting tenant_id from request',
                    'suggestion': 'Extract tenant_id from JWT: @Request() req → req.user.tenantId'
                })
            
            # Check for protected endpoints without auth guard
            if self.endpoint_pattern.search(line):
                # Look back for auth guard or public marker
                context_before = '\n'.join(lines[max(0, i-10):i])
                
                has_auth_guard = self.auth_guard_pattern.search(context_before)
                is_public = self.public_marker_pattern.search(context_before)
                
                if not has_auth_guard and not is_public:
                    violations.append({
                        'file': file_path,
                        'line': i,
                        'type': 'missing_auth_guard',
                        'severity': 'CRITICAL',
                        'message': 'Protected endpoint without @UseGuards(JwtAuthGuard)',
                        'suggestion': 'Add @UseGuards(JwtAuthGuard) or mark as @Public() if intentionally public'
                    })
        
        return violations
    
    def _check_error_messages(self, file_path: str, content: str, lines: List[str]) -> List[Dict]:
        """Check for tenant_id exposed in error messages."""
        violations = []
        
        for i, line in enumerate(lines, 1):
            if self.error_tenant_pattern.search(line):
                violations.append({
                    'file': file_path,
                    'line': i,
                    'type': 'tenant_id_in_error',
                    'severity': 'CRITICAL',
                    'message': 'Error message exposes tenant_id',
                    'suggestion': 'Use generic error messages without tenant_id'
                })
        
        return violations
    
    def check_path(self, path: str) -> None:
        """Check a file or directory for violations."""
        path_obj = Path(path)
        
        if path_obj.is_file():
            if path.endswith('.ts'):
                violations = self.check_file(path)
                self.files_checked += 1
                if violations:
                    self.violations.extend(violations)
                    self.violations_found += len(violations)
        elif path_obj.is_dir():
            for ts_file in path_obj.rglob('*.ts'):
                violations = self.check_file(str(ts_file))
                self.files_checked += 1
                if violations:
                    self.violations.extend(violations)
                    self.violations_found += len(violations)
        else:
            print(f"❌ Path not found: {path}")
            sys.exit(1)
    
    def print_results(self) -> None:
        """Print check results."""
        print(f"\n{'='*80}")
        print(f"Tenant Isolation Check Results")
        print(f"{'='*80}\n")
        
        if not self.violations:
            print(f"✅ All checks passed!")
            print(f"   Files checked: {self.files_checked}")
            print(f"   No violations found")
            return
        
        # Group violations by file
        violations_by_file = {}
        for v in self.violations:
            file_path = v['file']
            if file_path not in violations_by_file:
                violations_by_file[file_path] = []
            violations_by_file[file_path].append(v)
        
        # Print violations
        for file_path, file_violations in violations_by_file.items():
            print(f"\n📄 {file_path}")
            print(f"   {len(file_violations)} violation(s) found:\n")
            
            for v in file_violations:
                severity_icon = "🔴" if v['severity'] == 'CRITICAL' else "🟡"
                print(f"   {severity_icon} Line {v['line']}: {v['message']}")
                print(f"      → {v['suggestion']}\n")
        
        # Summary
        print(f"{'='*80}")
        print(f"Summary:")
        print(f"  Files checked: {self.files_checked}")
        print(f"  Violations found: {self.violations_found}")
        print(f"  Files with violations: {len(violations_by_file)}")
        print(f"{'='*80}\n")
        
        # Exit with error code
        sys.exit(1)

def main():
    if len(sys.argv) < 2:
        print("Usage: python check-tenant-isolation.py <file_or_directory>")
        print("\nExamples:")
        print("  python check-tenant-isolation.py apps/api/src/users/users.service.ts")
        print("  python check-tenant-isolation.py apps/api/src/")
        print("  git diff --name-only main | grep '\\.ts$' | xargs python check-tenant-isolation.py")
        sys.exit(1)
    
    checker = TenantIsolationChecker()
    
    # Check all provided paths
    for path in sys.argv[1:]:
        if os.path.exists(path):
            print(f"Checking: {path}")
            checker.check_path(path)
        else:
            print(f"⚠️  Skipping non-existent path: {path}")
    
    # Print results
    checker.print_results()

if __name__ == '__main__':
    main()





