#!/usr/bin/env python3
"""
File Organization Checker - R21

Automated checks for file organization compliance in monorepo structure.
Scans for:
- Files in deprecated paths (backend/src/, backend/prisma/, root-level src/)
- New top-level directories not in approved list
- Deprecated import paths (@verosuite/*)
- Cross-service relative imports
- File naming violations (PascalCase, camelCase, kebab-case)
- Directory depth violations (>4 levels)
- Component location violations (reusable components not in ui/)
- Deep relative imports (>3 levels)

Usage:
    python check-file-organization.py --all
    python check-file-organization.py --directory apps/api/src
    python check-file-organization.py --deprecated-paths
    python check-file-organization.py --generate-report

Created: 2025-12-01
Version: 1.0.0
"""

import os
import re
import sys
import json
from pathlib import Path
from typing import List, Dict, Set, Optional
from collections import defaultdict

# Try to import structured logging
try:
    from logger_util import get_logger
    logger = get_logger(context="file_organization_checker")
except ImportError:
    import logging
    logging.basicConfig(level=logging.INFO)
    logger = logging.getLogger("file_organization_checker")

class FileOrganizationChecker:
    def __init__(self):
        self.violations = []
        self.warnings = []
        self.files_checked = 0
        
        # Get project root (assume script is in .cursor/scripts/)
        self.project_root = Path(__file__).parent.parent.parent.resolve()
        
        # Patterns for detection
        self.deprecated_import_pattern = re.compile(r'@verosuite/')
        self.cross_service_import_pattern = re.compile(r'import.*from\s+[\'"](\.\./\.\./\.\./[^\'"]+/src/[^\'"]+)[\'"]')
        self.deep_relative_import_pattern = re.compile(r'import.*from\s+[\'"]\.\./\.\./\.\./')
        
        # Approved top-level directories
        self.approved_top_level = {
            'apps', 'libs', 'frontend', 'VeroFieldMobile', 'docs', 'services',
            '.cursor', '.github', 'monitoring', 'node_modules', '.git', '.vscode'
        }
        
        # Deprecated path mappings
        self.deprecated_paths = {
            'backend/src/': 'apps/api/src/',
            'backend/prisma/': 'libs/common/prisma/',
            'src/': 'frontend/src/'  # Root-level src/
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
        
    def check_all(self) -> Dict:
        """Check all files in the repository."""
        violations = []
        warnings = []
        
        # Check common directories
        directories_to_check = [
            'apps', 'libs', 'frontend', 'VeroFieldMobile', 'backend', 'src'
        ]
        
        for directory in directories_to_check:
            dir_path = Path(directory)
            if dir_path.exists():
                for file_path in dir_path.rglob('*'):
                    if file_path.is_file() and file_path.suffix in ('.ts', '.tsx', '.js', '.jsx', '.prisma'):
                        result = self.check_file(str(file_path))
                        violations.extend([v for v in result if v.get('severity') == 'CRITICAL'])
                        warnings.extend([w for w in result if w.get('severity') == 'WARNING'])
        
        return {
            'violations': violations,
            'warnings': warnings,
            'files_checked': self.files_checked
        }
    
    def check_directory(self, directory: str) -> Dict:
        """Check files in a specific directory."""
        violations = []
        warnings = []
        
        dir_path = Path(directory)
        if not dir_path.exists():
            return {'violations': [], 'warnings': [], 'files_checked': 0}
        
        for file_path in dir_path.rglob('*'):
            if file_path.is_file() and file_path.suffix in ('.ts', '.tsx', '.js', '.jsx', '.prisma'):
                result = self.check_file(str(file_path))
                violations.extend([v for v in result if v.get('severity') == 'CRITICAL'])
                warnings.extend([w for w in result if w.get('severity') == 'WARNING'])
        
        return {
            'violations': violations,
            'warnings': warnings,
            'files_checked': self.files_checked
        }
    
    def check_file(self, file_path: str) -> List[Dict]:
        """Check a single file for file organization violations."""
        issues = []
        content = None
        
        try:
            # Normalize path relative to project root
            normalized_path = self._normalize_path(file_path)
            
            # Check file path
            issues.extend(self._check_file_path(normalized_path))
            
            # Check imports if TypeScript/JavaScript file
            if file_path.endswith(('.ts', '.tsx', '.js', '.jsx')):
                try:
                    with open(file_path, 'r', encoding='utf-8') as f:
                        content = f.read()
                    issues.extend(self._check_imports(normalized_path, content))
                    issues.extend(self._check_file_naming(normalized_path, content))
                except Exception as e:
                    # File might be binary or have encoding issues
                    logger.debug(f"Could not read file content: {file_path} - {e}")
            
            # Check directory structure (pass content if available to avoid re-reading)
            issues.extend(self._check_directory_structure(normalized_path, content))
            
            self.files_checked += 1
            
        except Exception as e:
            logger.error(
                f"Error checking file: {file_path}",
                operation="check_file",
                error_code="FILE_CHECK_FAILED",
                root_cause=str(e),
                file_path=file_path
            )
        
        return issues
    
    def _check_file_path(self, file_path: str) -> List[Dict]:
        """Check if file is in deprecated path."""
        issues = []
        
        # Check for deprecated backend/ paths
        if file_path.startswith('backend/src/'):
            correct_path = file_path.replace('backend/src/', 'apps/api/src/')
            issues.append({
                'file': file_path,
                'line': 0,
                'type': 'deprecated_path',
                'severity': 'WARNING',
                'message': f'File in deprecated path "backend/src/"',
                'suggestion': f'Move to: {correct_path}',
                'migration_command': f'git mv {file_path} {correct_path}'
            })
        
        if file_path.startswith('backend/prisma/'):
            correct_path = file_path.replace('backend/prisma/', 'libs/common/prisma/')
            issues.append({
                'file': file_path,
                'line': 0,
                'type': 'deprecated_path',
                'severity': 'WARNING',
                'message': f'File in deprecated path "backend/prisma/"',
                'suggestion': f'Move to: {correct_path}',
                'migration_command': f'git mv {file_path} {correct_path}'
            })
        
        # Check for root-level src/
        if re.match(r'^src/', file_path) and not any(file_path.startswith(prefix) for prefix in ['apps/', 'libs/', 'frontend/', 'VeroFieldMobile/']):
            issues.append({
                'file': file_path,
                'line': 0,
                'type': 'deprecated_path',
                'severity': 'WARNING',
                'message': f'File in root-level src/ directory',
                'suggestion': 'Move to frontend/src/ or appropriate app directory',
                'migration_command': f'# Review and move to appropriate location'
            })
        
        # Check for new top-level directories
        parts = Path(file_path).parts
        if len(parts) > 0:
            top_level = parts[0]
            if top_level not in self.approved_top_level and not top_level.startswith('.'):
                issues.append({
                    'file': file_path,
                    'line': 0,
                    'type': 'unauthorized_top_level',
                    'severity': 'WARNING',
                    'message': f'File in unauthorized top-level directory "{top_level}"',
                    'suggestion': 'Top-level directories require approval. Use apps/, libs/, or frontend/',
                    'approved_directories': list(self.approved_top_level)
                })
        
        return issues
    
    def _check_imports(self, file_path: str, content: str) -> List[Dict]:
        """Check import paths for violations."""
        issues = []
        lines = content.split('\n')
        
        for line_num, line in enumerate(lines, 1):
            # Check for deprecated @verosuite/ imports
            if self.deprecated_import_pattern.search(line):
                fixed_line = line.replace('@verosuite/', '@verofield/')
                issues.append({
                    'file': file_path,
                    'line': line_num,
                    'type': 'deprecated_import',
                    'severity': 'WARNING',
                    'message': 'Deprecated import path "@verosuite/*"',
                    'suggestion': f'Update to: {fixed_line.strip()}',
                    'autofix': True
                })
            
            # Check for cross-service relative imports
            if self.cross_service_import_pattern.search(line):
                issues.append({
                    'file': file_path,
                    'line': line_num,
                    'type': 'cross_service_import',
                    'severity': 'WARNING',
                    'message': 'Cross-service relative import detected',
                    'suggestion': 'Use HTTP/events or move shared code to libs/common/',
                    'alternatives': [
                        'Use HTTP API call between services',
                        'Move shared code to libs/common',
                        'Use event-driven communication'
                    ]
                })
            
            # Check for deep relative imports (>3 levels)
            if self.deep_relative_import_pattern.search(line):
                issues.append({
                    'file': file_path,
                    'line': line_num,
                    'type': 'deep_relative_import',
                    'severity': 'WARNING',
                    'message': 'Deep relative import (>3 levels)',
                    'suggestion': 'Consider using monorepo import paths (@verofield/common/*, @/components/ui/*)',
                    'example': "import { Button } from '@/components/ui/Button';"
                })
        
        return issues
    
    def _check_file_naming(self, file_path: str, content: str) -> List[Dict]:
        """Check file naming conventions."""
        issues = []
        file_name = Path(file_path).name
        
        # Check component files (PascalCase)
        if file_path.endswith('.tsx'):
            if re.match(r'^[a-z]', file_name) and 'export const' in content:
                suggested_name = file_name[0].upper() + file_name[1:]
                issues.append({
                    'file': file_path,
                    'line': 0,
                    'type': 'file_naming',
                    'severity': 'WARNING',
                    'message': f'Component file should use PascalCase: {file_name}',
                    'suggestion': f'Rename to: {suggested_name}',
                    'convention': 'PascalCase for components'
                })
        
        # Check utility files (camelCase)
        if file_path.endswith('.ts') and not file_path.endswith(('.d.ts', '.config.ts')):
            if re.match(r'^[A-Z]', file_name) and 'export function' in content:
                suggested_name = file_name[0].lower() + file_name[1:]
                issues.append({
                    'file': file_path,
                    'line': 0,
                    'type': 'file_naming',
                    'severity': 'WARNING',
                    'message': f'Utility file should use camelCase: {file_name}',
                    'suggestion': f'Rename to: {suggested_name}',
                    'convention': 'camelCase for utilities'
                })
        
        return issues
    
    def _check_directory_structure(self, file_path: str, content: Optional[str] = None) -> List[Dict]:
        """Check directory structure compliance."""
        issues = []
        parts = Path(file_path).parts
        
        # Check directory depth
        depth = len(parts) - 1  # Subtract filename
        if depth > 4:
            issues.append({
                'file': file_path,
                'line': 0,
                'type': 'directory_depth',
                'severity': 'WARNING',
                'message': f'Directory depth ({depth} levels) exceeds recommended limit (4 levels)',
                'suggestion': 'Consider flattening structure',
                'current_depth': depth,
                'recommended_depth': 4
            })
        
        # Check component location (reusable components should be in ui/)
        if 'frontend/src/components/' in file_path and '/ui/' not in file_path:
            if file_path.endswith('.tsx'):
                # Use provided content if available, otherwise try to read
                file_content = content
                if file_content is None:
                    try:
                        file_path_obj = self.project_root / file_path
                        if file_path_obj.exists():
                            file_content = file_path_obj.read_text(encoding='utf-8')
                    except Exception:
                        file_content = ''
                
                if file_content and 'export const' in file_content:
                    issues.append({
                        'file': file_path,
                        'line': 0,
                        'type': 'component_location',
                        'severity': 'WARNING',
                        'message': 'Reusable component should be in frontend/src/components/ui/',
                        'suggestion': 'Move to ui/ if reusable, or keep in feature folder if feature-specific',
                        'example': 'frontend/src/components/ui/Button.tsx for reusable'
                    })
        
        return issues
    
    def check_deprecated_paths(self) -> List[Dict]:
        """Check for files in deprecated paths."""
        deprecated_files = []
        
        for deprecated_path, correct_path in self.deprecated_paths.items():
            dep_path = Path(deprecated_path.rstrip('/'))
            if dep_path.exists():
                for file_path in dep_path.rglob('*'):
                    if file_path.is_file():
                        file_path_str = str(file_path).replace('\\', '/')
                        deprecated_files.append({
                            'file': file_path_str,
                            'deprecated_path': deprecated_path,
                            'suggested_path': file_path_str.replace(deprecated_path, correct_path),
                            'migration_command': f'git mv {file_path_str} {file_path_str.replace(deprecated_path, correct_path)}'
                        })
        
        return deprecated_files
    
    def generate_report(self) -> Dict:
        """Generate comprehensive file organization report."""
        results = self.check_all()
        
        # Group by type
        violations_by_type = defaultdict(list)
        warnings_by_type = defaultdict(list)
        
        for violation in results['violations']:
            violations_by_type[violation['type']].append(violation)
        
        for warning in results['warnings']:
            warnings_by_type[warning['type']].append(warning)
        
        return {
            'summary': {
                'files_checked': results['files_checked'],
                'total_violations': len(results['violations']),
                'total_warnings': len(results['warnings']),
                'violations_by_type': {k: len(v) for k, v in violations_by_type.items()},
                'warnings_by_type': {k: len(v) for k, v in warnings_by_type.items()}
            },
            'violations': results['violations'],
            'warnings': results['warnings'],
            'deprecated_paths': self.check_deprecated_paths()
        }


def main():
    import argparse
    
    parser = argparse.ArgumentParser(description='Check file organization compliance')
    parser.add_argument('--all', action='store_true', help='Check all files')
    parser.add_argument('--directory', type=str, help='Check specific directory')
    parser.add_argument('--deprecated-paths', action='store_true', help='Check for deprecated paths only')
    parser.add_argument('--generate-report', action='store_true', help='Generate comprehensive report')
    parser.add_argument('--json', action='store_true', help='Output as JSON')
    
    args = parser.parse_args()
    
    checker = FileOrganizationChecker()
    
    if args.deprecated_paths:
        deprecated = checker.check_deprecated_paths()
        if args.json:
            print(json.dumps(deprecated, indent=2))
        else:
            if deprecated:
                print("⚠️  Deprecated paths found:\n")
                for item in deprecated:
                    print(f"  {item['file']}")
                    print(f"    → {item['suggested_path']}")
                    print(f"    Command: {item['migration_command']}\n")
            else:
                print("✅ No deprecated paths found")
        return
    
    if args.generate_report:
        report = checker.generate_report()
        if args.json:
            print(json.dumps(report, indent=2))
        else:
            print("=" * 60)
            print("File Organization Report")
            print("=" * 60)
            print(f"\nFiles checked: {report['summary']['files_checked']}")
            print(f"Violations: {report['summary']['total_violations']}")
            print(f"Warnings: {report['summary']['total_warnings']}")
            
            if report['summary']['warnings_by_type']:
                print("\nWarnings by type:")
                for warning_type, count in report['summary']['warnings_by_type'].items():
                    print(f"  {warning_type}: {count}")
            
            if report['deprecated_paths']:
                print(f"\n⚠️  Deprecated paths: {len(report['deprecated_paths'])}")
                for item in report['deprecated_paths'][:10]:  # Show first 10
                    print(f"  {item['file']} → {item['suggested_path']}")
        return
    
    if args.directory:
        results = checker.check_directory(args.directory)
    elif args.all:
        results = checker.check_all()
    else:
        parser.print_help()
        return
    
    if args.json:
        print(json.dumps(results, indent=2))
    else:
        if results['violations']:
            print("❌ Violations found:\n")
            for violation in results['violations']:
                print(f"  {violation['file']}:{violation.get('line', 0)}")
                print(f"    {violation['message']}")
                if 'suggestion' in violation:
                    print(f"    → {violation['suggestion']}")
                print()
        
        if results['warnings']:
            print("⚠️  Warnings found:\n")
            for warning in results['warnings']:
                print(f"  {warning['file']}:{warning.get('line', 0)}")
                print(f"    {warning['message']}")
                if 'suggestion' in warning:
                    print(f"    → {warning['suggestion']}")
                print()
        
        if not results['violations'] and not results['warnings']:
            print("✅ No file organization issues found")
        
        print(f"\nFiles checked: {results['files_checked']}")


if __name__ == '__main__':
    main()





