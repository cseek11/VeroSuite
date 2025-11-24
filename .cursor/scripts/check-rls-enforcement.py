#!/usr/bin/env python3
"""
RLS Enforcement Checker - R02

Automated checks for RLS policy violations in SQL migrations and schema files.
Scans for:
- New tables with tenant_id but no RLS policy
- Disabled RLS policies
- Superuser role usage
- SECURITY DEFINER functions without tenant filter
- Missing current_setting('app.tenant_id') in policies

Usage:
    python check-rls-enforcement.py <file_or_directory>
    python check-rls-enforcement.py libs/common/prisma/migrations/add_customers/migration.sql
    python check-rls-enforcement.py libs/common/prisma/migrations/

Created: 2025-11-23
Version: 1.0.0
"""

import os
import re
import sys
from pathlib import Path
from typing import List, Dict, Set

class RLSEnforcementChecker:
    def __init__(self):
        self.violations = []
        self.warnings = []
        self.files_checked = 0
        self.violations_found = 0
        
        # Patterns for detection
        self.create_table_pattern = re.compile(r'CREATE\s+TABLE\s+"?(\w+)"?', re.IGNORECASE)
        self.tenant_id_pattern = re.compile(r'"?tenant_id"?\s+UUID', re.IGNORECASE)
        self.enable_rls_pattern = re.compile(r'ALTER\s+TABLE\s+"?(\w+)"?\s+ENABLE\s+ROW\s+LEVEL\s+SECURITY', re.IGNORECASE)
        self.disable_rls_pattern = re.compile(r'ALTER\s+TABLE.*DISABLE\s+ROW\s+LEVEL\s+SECURITY', re.IGNORECASE)
        self.create_policy_pattern = re.compile(r'CREATE\s+POLICY\s+"?(\w+)"?\s+ON\s+"?(\w+)"?', re.IGNORECASE)
        self.current_setting_pattern = re.compile(r"current_setting\s*\(\s*['\"]app\.tenant_id['\"]", re.IGNORECASE)
        self.security_definer_pattern = re.compile(r'SECURITY\s+DEFINER', re.IGNORECASE)
        self.superuser_pattern = re.compile(r'postgresql://postgres[@:]|DATABASE_URL.*postgres[@:]', re.IGNORECASE)
        
    def check_file(self, file_path: str) -> List[Dict]:
        """Check a single file for RLS enforcement violations."""
        violations = []
        warnings = []
        
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
                
            # Check based on file type
            if file_path.endswith('.sql'):
                violations.extend(self._check_migration_file(file_path, content))
            elif file_path.endswith('schema.prisma'):
                warnings.extend(self._check_schema_file(file_path, content))
            elif file_path.endswith(('.ts', '.js', '.env')):
                violations.extend(self._check_config_file(file_path, content))
                
        except Exception as e:
            print(f"⚠️  Error reading {file_path}: {e}")
            
        self.violations.extend(violations)
        self.warnings.extend(warnings)
        return violations + warnings
    
    def _check_migration_file(self, file_path: str, content: str) -> List[Dict]:
        """Check SQL migration file for RLS violations."""
        violations = []
        lines = content.split('\n')
        
        # Find all tables created with tenant_id
        tables_with_tenant_id = set()
        tables_with_rls = set()
        tables_with_policy = set()
        
        for i, line in enumerate(lines, 1):
            # Check for CREATE TABLE with tenant_id
            create_match = self.create_table_pattern.search(line)
            if create_match:
                table_name = create_match.group(1)
                # Look ahead for tenant_id column
                table_block = '\n'.join(lines[i-1:min(len(lines), i+20)])
                if self.tenant_id_pattern.search(table_block):
                    tables_with_tenant_id.add(table_name)
            
            # Check for ENABLE ROW LEVEL SECURITY
            enable_match = self.enable_rls_pattern.search(line)
            if enable_match:
                table_name = enable_match.group(1)
                tables_with_rls.add(table_name)
            
            # Check for CREATE POLICY
            policy_match = self.create_policy_pattern.search(line)
            if policy_match:
                table_name = policy_match.group(2)
                tables_with_policy.add(table_name)
                
                # Validate policy includes current_setting
                policy_block = '\n'.join(lines[i-1:min(len(lines), i+10)])
                if not self.current_setting_pattern.search(policy_block):
                    violations.append({
                        'file': file_path,
                        'line': i,
                        'type': 'policy_missing_current_setting',
                        'severity': 'CRITICAL',
                        'message': f'RLS policy for table "{table_name}" missing current_setting(\'app.tenant_id\')',
                        'suggestion': 'Add: USING (tenant_id::text = current_setting(\'app.tenant_id\', true))'
                    })
            
            # Check for DISABLE ROW LEVEL SECURITY
            if self.disable_rls_pattern.search(line):
                violations.append({
                    'file': file_path,
                    'line': i,
                    'type': 'rls_disabled',
                    'severity': 'CRITICAL',
                    'message': 'Attempting to disable RLS policy',
                    'suggestion': 'Remove DISABLE ROW LEVEL SECURITY statement'
                })
            
            # Check for SECURITY DEFINER without tenant filter
            if self.security_definer_pattern.search(line):
                # Look ahead for current_setting
                function_block = '\n'.join(lines[i-1:min(len(lines), i+20)])
                if not self.current_setting_pattern.search(function_block):
                    violations.append({
                        'file': file_path,
                        'line': i,
                        'type': 'security_definer_without_filter',
                        'severity': 'CRITICAL',
                        'message': 'SECURITY DEFINER function without tenant filter',
                        'suggestion': 'Use SECURITY INVOKER or add: WHERE tenant_id::text = current_setting(\'app.tenant_id\', true)'
                    })
        
        # Check for tables with tenant_id but no RLS
        for table_name in tables_with_tenant_id:
            if table_name not in tables_with_rls:
                violations.append({
                    'file': file_path,
                    'line': 0,
                    'type': 'missing_rls_enable',
                    'severity': 'CRITICAL',
                    'message': f'Table "{table_name}" has tenant_id but no ENABLE ROW LEVEL SECURITY',
                    'suggestion': f'Add: ALTER TABLE "{table_name}" ENABLE ROW LEVEL SECURITY;'
                })
            
            if table_name not in tables_with_policy:
                violations.append({
                    'file': file_path,
                    'line': 0,
                    'type': 'missing_rls_policy',
                    'severity': 'CRITICAL',
                    'message': f'Table "{table_name}" has tenant_id but no RLS policy',
                    'suggestion': f'Add: CREATE POLICY "tenant_isolation_policy" ON "{table_name}" USING (tenant_id::text = current_setting(\'app.tenant_id\', true));'
                })
        
        return violations
    
    def _check_schema_file(self, file_path: str, content: str) -> List[Dict]:
        """Check Prisma schema file for potential RLS issues."""
        warnings = []
        lines = content.split('\n')
        
        for i, line in enumerate(lines, 1):
            # Check for new models with tenant_id
            if 'model ' in line:
                model_name = line.split('model ')[1].split()[0] if 'model ' in line else 'unknown'
                # Look ahead for tenant_id field
                model_block = '\n'.join(lines[i-1:min(len(lines), i+30)])
                if 'tenant_id' in model_block.lower():
                    warnings.append({
                        'file': file_path,
                        'line': i,
                        'type': 'prisma_model_with_tenant_id',
                        'severity': 'WARNING',
                        'message': f'Prisma model "{model_name}" has tenant_id field',
                        'suggestion': 'Ensure corresponding migration includes RLS policy'
                    })
        
        return warnings
    
    def _check_config_file(self, file_path: str, content: str) -> List[Dict]:
        """Check config files for superuser role usage."""
        violations = []
        lines = content.split('\n')
        
        for i, line in enumerate(lines, 1):
            if self.superuser_pattern.search(line):
                violations.append({
                    'file': file_path,
                    'line': i,
                    'type': 'superuser_role',
                    'severity': 'CRITICAL',
                    'message': 'Using superuser role "postgres" in application code',
                    'suggestion': 'Use non-superuser role (e.g., "verofield_app") to enforce RLS'
                })
        
        return violations
    
    def check_path(self, path: str) -> None:
        """Check a file or directory for violations."""
        path_obj = Path(path)
        
        if path_obj.is_file():
            if path.endswith(('.sql', '.prisma', '.ts', '.js', '.env')):
                self.check_file(path)
                self.files_checked += 1
        elif path_obj.is_dir():
            # Check SQL migrations
            for sql_file in path_obj.rglob('*.sql'):
                self.check_file(str(sql_file))
                self.files_checked += 1
            # Check schema files
            for prisma_file in path_obj.rglob('*.prisma'):
                self.check_file(str(prisma_file))
                self.files_checked += 1
        else:
            print(f"❌ Path not found: {path}")
            sys.exit(1)
    
    def print_results(self) -> None:
        """Print check results."""
        print(f"\n{'='*80}")
        print(f"RLS Enforcement Check Results")
        print(f"{'='*80}\n")
        
        if not self.violations and not self.warnings:
            print(f"✅ All checks passed!")
            print(f"   Files checked: {self.files_checked}")
            print(f"   No violations or warnings found")
            return
        
        # Group violations by file
        violations_by_file = {}
        for v in self.violations:
            file_path = v['file']
            if file_path not in violations_by_file:
                violations_by_file[file_path] = []
            violations_by_file[file_path].append(v)
        
        # Group warnings by file
        warnings_by_file = {}
        for w in self.warnings:
            file_path = w['file']
            if file_path not in warnings_by_file:
                warnings_by_file[file_path] = []
            warnings_by_file[file_path].append(w)
        
        # Print violations
        if violations_by_file:
            print("🔴 VIOLATIONS FOUND:\n")
            for file_path, file_violations in violations_by_file.items():
                print(f"📄 {file_path}")
                print(f"   {len(file_violations)} violation(s):\n")
                
                for v in file_violations:
                    line_info = f"Line {v['line']}" if v['line'] > 0 else "File-level"
                    print(f"   🔴 {line_info}: {v['message']}")
                    print(f"      → {v['suggestion']}\n")
        
        # Print warnings
        if warnings_by_file:
            print("\n🟡 WARNINGS:\n")
            for file_path, file_warnings in warnings_by_file.items():
                print(f"📄 {file_path}")
                print(f"   {len(file_warnings)} warning(s):\n")
                
                for w in file_warnings:
                    print(f"   🟡 Line {w['line']}: {w['message']}")
                    print(f"      → {w['suggestion']}\n")
        
        # Summary
        print(f"{'='*80}")
        print(f"Summary:")
        print(f"  Files checked: {self.files_checked}")
        print(f"  Violations found: {len(self.violations)}")
        print(f"  Warnings found: {len(self.warnings)}")
        print(f"  Files with issues: {len(violations_by_file) + len(warnings_by_file)}")
        print(f"{'='*80}\n")
        
        # Exit with error code if violations found
        if self.violations:
            sys.exit(1)

def main():
    if len(sys.argv) < 2:
        print("Usage: python check-rls-enforcement.py <file_or_directory>")
        print("\nExamples:")
        print("  python check-rls-enforcement.py libs/common/prisma/migrations/add_customers/migration.sql")
        print("  python check-rls-enforcement.py libs/common/prisma/migrations/")
        print("  python check-rls-enforcement.py libs/common/prisma/schema.prisma")
        sys.exit(1)
    
    checker = RLSEnforcementChecker()
    
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



