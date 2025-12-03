#!/usr/bin/env python3
"""
Architecture Boundaries Checker - R03

Automated checks for architecture boundary violations in monorepo structure.
Scans for:
- Files in deprecated paths (backend/src/)
- Cross-service relative imports
- New directories in apps/ (potential new services)
- New top-level directories
- Frontend/backend import violations
- Potential code duplication (utils in services)

Usage:
    python check-architecture-boundaries.py <file_or_directory>
    python check-architecture-boundaries.py apps/api/src/module.ts
    python check-architecture-boundaries.py apps/

Created: 2025-12-01
Version: 1.0.0
"""

import os
import re
import sys
from pathlib import Path
from typing import List, Dict, Any

class ArchitectureBoundariesChecker:
    def __init__(self):
        self.violations = []
        self.warnings = []
        self.files_checked = 0
        
        # Get project root (assume script is in .cursor/scripts/)
        self.project_root = Path(__file__).parent.parent.parent.resolve()
        
        # Patterns for detection
        self.cross_service_import_pattern = re.compile(r'import.*from\s+[\'"](\.\./\.\./\.\./[^\'"]+/src/[^\'"]+)[\'"]')
        self.backend_import_pattern = re.compile(r'import.*from\s+[\'"].*apps/(api|crm-ai|ai-soc)/.*\.service')
        self.frontend_import_pattern = re.compile(r'import.*from\s+[\'"].*frontend/')
        
        # Approved top-level directories
        self.approved_top_level = {
            'apps', 'libs', 'frontend', 'VeroFieldMobile', 'docs', 'services',
            '.cursor', '.github', 'monitoring', 'node_modules', '.git'
        }
    
    def _normalize_path(self, file_path: str) -> str:
        """Normalize file path relative to project root for consistent checking."""
        path_obj = Path(file_path).resolve()
        try:
            # Get relative path from project root
            rel_path = path_obj.relative_to(self.project_root)
            # Convert to forward slashes for consistent checking (works on all platforms)
            return str(rel_path).replace('\\', '/')
        except ValueError:
            # Path is outside project root, return as-is but normalized
            return str(path_obj).replace('\\', '/')
        
    def check_file(self, file_path: str) -> List[Dict[str, Any]]:
        """Check a single file for architecture violations."""
        violations = []
        warnings = []
        
        try:
            # Normalize path for consistent checking
            normalized_path = self._normalize_path(file_path)
            
            # Check file path (use normalized path for checks, original for file operations)
            violations.extend(self._check_file_path(normalized_path))
            
            # Check imports if TypeScript file
            if file_path.endswith(('.ts', '.tsx', '.js', '.jsx')):
                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                violations.extend(self._check_imports(normalized_path, content))
                warnings.extend(self._check_code_organization(normalized_path, content))
                
        except Exception as e:
            print(f"⚠️  Error reading {file_path}: {e}")
            
        self.violations.extend(violations)
        self.warnings.extend(warnings)
        return violations + warnings
    
    def _check_file_path(self, file_path: str) -> List[Dict[str, Any]]:
        """Check if file is in correct monorepo path."""
        violations = []
        
        # Check for deprecated backend/ path
        if file_path.startswith('backend/'):
            correct_path = file_path.replace('backend/', 'apps/api/')
            violations.append({
                'file': file_path,
                'line': 0,
                'type': 'deprecated_path',
                'severity': 'CRITICAL',
                'message': 'File in deprecated path "backend/"',
                'suggestion': f'Move to correct monorepo path: {correct_path}'
            })
        
        # Check for new top-level directories
        parts = Path(file_path).parts
        if len(parts) > 0:
            top_level = parts[0]
            if top_level not in self.approved_top_level and not top_level.startswith('.'):
                violations.append({
                    'file': file_path,
                    'line': 0,
                    'type': 'unauthorized_top_level',
                    'severity': 'CRITICAL',
                    'message': f'File in unauthorized top-level directory "{top_level}"',
                    'suggestion': 'Top-level directories require human approval. Use apps/, libs/, or frontend/'
                })
        
        # Check for new schema files outside libs/common/prisma
        if file_path.endswith('schema.prisma') and 'libs/common/prisma' not in file_path:
            violations.append({
                'file': file_path,
                'line': 0,
                'type': 'schema_outside_libs',
                'severity': 'CRITICAL',
                'message': 'Schema file outside libs/common/prisma/',
                'suggestion': 'Use single schema at libs/common/prisma/schema.prisma'
            })
        
        return violations
    
    def _check_imports(self, file_path: str, content: str) -> List[Dict[str, Any]]:
        """Check for import violations."""
        violations = []
        lines = content.split('\n')
        
        for i, line in enumerate(lines, 1):
            # Check for cross-service relative imports
            cross_service_match = self.cross_service_import_pattern.search(line)
            if cross_service_match:
                import_path = cross_service_match.group(1)
                violations.append({
                    'file': file_path,
                    'line': i,
                    'type': 'cross_service_import',
                    'severity': 'CRITICAL',
                    'message': f'Cross-service relative import: {import_path}',
                    'suggestion': 'Services must communicate via HTTP/events. Use API clients or event bus.'
                })
            
            # Check for frontend importing backend
            if file_path.startswith('frontend/'):
                backend_match = self.backend_import_pattern.search(line)
                if backend_match:
                    violations.append({
                        'file': file_path,
                        'line': i,
                        'type': 'frontend_importing_backend',
                        'severity': 'CRITICAL',
                        'message': 'Frontend importing backend service implementation',
                        'suggestion': 'Use typed API client: import { apiClient } from \'@/lib/api-client\''
                    })
            
            # Check for backend importing frontend
            if file_path.startswith('apps/'):
                frontend_match = self.frontend_import_pattern.search(line)
                if frontend_match:
                    violations.append({
                        'file': file_path,
                        'line': i,
                        'type': 'backend_importing_frontend',
                        'severity': 'CRITICAL',
                        'message': 'Backend importing frontend code',
                        'suggestion': 'Extract shared types to libs/common/src/types/'
                    })
        
        return violations
    
    def _check_code_organization(self, file_path: str, content: str) -> List[Dict[str, Any]]:
        """Check for code organization issues."""
        warnings = []
        
        # Check for utils in service directories
        if '/utils/' in file_path and file_path.startswith('apps/'):
            warnings.append({
                'file': file_path,
                'line': 0,
                'type': 'util_in_service',
                'severity': 'WARNING',
                'message': 'Utility file in service directory',
                'suggestion': 'Consider moving to libs/common/src/utils/ if used by multiple services'
            })
        
        return warnings
    
    def check_path(self, path: str) -> None:
        """Check a file or directory for violations."""
        path_obj = Path(path).resolve()
        
        if path_obj.is_file():
            try:
                self.check_file(str(path_obj))
                self.files_checked += 1
            except (OSError, IOError) as e:
                print(f"⚠️  Error accessing file {path_obj}: {e}")
        elif path_obj.is_dir():
            # Check all TypeScript/JavaScript files
            extensions = ['.ts', '.tsx', '.js', '.jsx']
            for file in path_obj.rglob('*'):
                if file.is_file() and file.suffix in extensions:
                    try:
                        self.check_file(str(file))
                        self.files_checked += 1
                    except (OSError, IOError) as e:
                        print(f"⚠️  Error accessing file {file}: {e}")
            # Check for schema files
            for schema_file in path_obj.rglob('schema.prisma'):
                if schema_file.is_file():
                    try:
                        self.check_file(str(schema_file))
                        self.files_checked += 1
                    except (OSError, IOError) as e:
                        print(f"⚠️  Error accessing file {schema_file}: {e}")
        else:
            print(f"❌ Path not found: {path}")
            sys.exit(1)
    
    def print_results(self) -> None:
        """Print check results."""
        print(f"\n{'='*80}")
        print(f"Architecture Boundaries Check Results")
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
                    line_info = f"Line {w['line']}" if w['line'] > 0 else "File-level"
                    print(f"   🟡 {line_info}: {w['message']}")
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
        print("Usage: python check-architecture-boundaries.py <file_or_directory>")
        print("\nExamples:")
        print("  python check-architecture-boundaries.py apps/api/src/module.ts")
        print("  python check-architecture-boundaries.py apps/api/")
        print("  git diff --name-only main | xargs python check-architecture-boundaries.py")
        sys.exit(1)
    
    checker = ArchitectureBoundariesChecker()
    
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
