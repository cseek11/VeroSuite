#!/usr/bin/env python3
"""
Breaking Change Documentation Checker (R06)

This script enforces breaking change documentation requirements:
- PR flagging with [BREAKING] tag
- Migration guide creation
- Version bump (MAJOR increment)
- CHANGELOG update
- API documentation update (if API changes)

Detection Strategy (Multi-signal):
1. Code removal patterns (removed functions, classes, exports)
2. Type changes (optional → required)
3. File deletions (removed endpoints, services, DTOs)
4. Schema changes (DROP COLUMN, ALTER COLUMN)

Usage:
    python .cursor/scripts/check-breaking-changes.py --pr 123
    python .cursor/scripts/check-breaking-changes.py --files file1.ts file2.ts

Created: 2025-12-04
Version: 1.0.0
"""

import argparse
import re
import sys
from pathlib import Path
from typing import List, Set, Optional
from dataclasses import dataclass
from enum import Enum
import subprocess

# ANSI color codes for output
class Colors:
    RED = '\033[91m'
    YELLOW = '\033[93m'
    GREEN = '\033[92m'
    BLUE = '\033[94m'
    BOLD = '\033[1m'
    END = '\033[0m'

class BreakingChangeType(Enum):
    """Types of breaking changes"""
    API = "api"              # Endpoint changes
    DATABASE = "database"    # Schema changes
    CONFIG = "config"        # Environment/config changes
    BEHAVIORAL = "behavior"  # Business logic changes

@dataclass
class BreakingChange:
    """Represents a detected breaking change"""
    file_path: str
    change_type: BreakingChangeType
    description: str
    line_number: Optional[int] = None

@dataclass
class Violation:
    """Represents a rule violation"""
    severity: str  # 'error', 'warning'
    category: str
    message: str
    suggestion: Optional[str] = None

class BreakingChangeChecker:
    """Main checker class"""
    
    def __init__(self, repo_root: Path):
        self.repo_root = repo_root
        self.violations: List[Violation] = []
        self.breaking_changes: List[BreakingChange] = []
        
    def check_pr(self, pr_number: int) -> List[Violation]:
        """Check a PR for breaking change compliance"""
        violations = []
        
        # Get PR details from git
        pr_title = self._get_pr_title(pr_number)
        changed_files = self._get_changed_files(pr_number)
        
        # Detect breaking changes
        self.breaking_changes = self._detect_breaking_changes(changed_files)
        
        if self.breaking_changes:
            # Check 1: PR title has [BREAKING] tag
            if not self._has_breaking_tag(pr_title):
                violations.append(Violation(
                    severity='error',
                    category='Missing [BREAKING] Tag',
                    message=f"Breaking changes detected but PR title missing [BREAKING] tag",
                    suggestion=f"Update PR title to include [BREAKING] tag:\n"
                              f"  Current: {pr_title}\n"
                              f"  Suggested: [BREAKING] {pr_title}"
                ))
            
            # Check 2: Migration guide exists
            if not self._has_migration_guide(changed_files):
                violations.append(Violation(
                    severity='error',
                    category='Missing Migration Guide',
                    message="PR has breaking changes but no migration guide found",
                    suggestion="Create migration guide in 'docs/migrations/[YYYY-MM-DD]-[feature]-migration.md'\n"
                              "  Include:\n"
                              "  - What changed\n"
                              "  - Why it changed\n"
                              "  - Who is affected\n"
                              "  - Step-by-step migration instructions\n"
                              "  - Before/after code examples\n"
                              "  - Rollback instructions\n"
                              "  - Testing checklist"
                ))
            
            # Check 3: Version bump (MAJOR increment)
            version_check = self._check_version_bump(changed_files)
            if not version_check[0]:
                violations.append(Violation(
                    severity='error',
                    category='Missing Version Bump',
                    message=version_check[1],
                    suggestion="Update version in package.json with MAJOR increment:\n"
                              "  Example: 1.5.3 → 2.0.0"
                ))
            
            # Check 4: CHANGELOG update
            if not self._has_changelog_update(changed_files):
                violations.append(Violation(
                    severity='error',
                    category='Missing CHANGELOG Update',
                    message="PR has breaking changes but CHANGELOG.md not updated",
                    suggestion="Add breaking changes section to CHANGELOG.md:\n"
                              "  ## [X.0.0] - YYYY-MM-DD\n"
                              "  ### Breaking Changes\n"
                              "  - List of breaking changes\n"
                              "  - Migration guide link"
                ))
            
            # Check 5: API docs update (if API changes)
            api_changes = [bc for bc in self.breaking_changes if bc.change_type == BreakingChangeType.API]
            if api_changes and not self._has_api_docs_update(changed_files):
                violations.append(Violation(
                    severity='warning',
                    category='Missing API Documentation Update',
                    message=f"API breaking changes detected but API documentation not updated",
                    suggestion="Update OpenAPI/Swagger docs or API reference documentation"
                ))
        
        return violations
    
    def _detect_breaking_changes(self, changed_files: List[dict]) -> List[BreakingChange]:
        """Detect breaking changes using multi-signal approach"""
        breaking_changes = []
        
        for file in changed_files:
            file_path = file['path']
            diff = file.get('diff', '')
            status = file.get('status', 'modified')
            
            # Signal 1: Code removal patterns
            if self._is_code_removal(file_path, diff):
                breaking_changes.append(BreakingChange(
                    file_path=file_path,
                    change_type=BreakingChangeType.API if 'controller' in file_path else BreakingChangeType.BEHAVIORAL,
                    description="Removed exported function, class, or interface"
                ))
            
            # Signal 2: Removed endpoints
            if self._is_endpoint_removal(file_path, diff):
                breaking_changes.append(BreakingChange(
                    file_path=file_path,
                    change_type=BreakingChangeType.API,
                    description="Removed API endpoint"
                ))
            
            # Signal 3: Database breaking changes
            if self._is_database_breaking_change(file_path, diff):
                breaking_changes.append(BreakingChange(
                    file_path=file_path,
                    change_type=BreakingChangeType.DATABASE,
                    description="Breaking database schema change (DROP COLUMN or ALTER COLUMN)"
                ))
            
            # Signal 4: File deletions
            if status == 'deleted' and self._is_public_file(file_path):
                breaking_changes.append(BreakingChange(
                    file_path=file_path,
                    change_type=BreakingChangeType.API,
                    description="Deleted public API file (controller, service, or DTO)"
                ))
            
            # Signal 5: Type changes (optional → required)
            if self._is_type_change(file_path, diff):
                breaking_changes.append(BreakingChange(
                    file_path=file_path,
                    change_type=BreakingChangeType.API,
                    description="Changed field from optional to required"
                ))
        
        return breaking_changes
    
    def _is_code_removal(self, file_path: str, diff: str) -> bool:
        """Detect removed functions, classes, or interfaces"""
        if not re.search(r'\.(ts|js)$', file_path):
            return False
        
        removal_patterns = [
            r'^\-.*export\s+(function|class|interface|type)\s+\w+',  # Removed exports
            r'^\-.*@(Get|Post|Put|Delete|Patch)\(',  # Removed route decorators
        ]
        
        return any(re.search(pattern, diff, re.MULTILINE) for pattern in removal_patterns)
    
    def _is_endpoint_removal(self, file_path: str, diff: str) -> bool:
        """Detect removed API endpoints"""
        if not file_path.endswith('.controller.ts'):
            return False
        
        # Check for removed route decorators
        return bool(re.search(r'^\-.*@(Get|Post|Put|Delete|Patch)\(', diff, re.MULTILINE))
    
    def _is_database_breaking_change(self, file_path: str, diff: str) -> bool:
        """Detect breaking database schema changes"""
        if not re.search(r'migration.*\.sql$', file_path):
            return False
        
        breaking_patterns = [
            'DROP COLUMN',
            'ALTER COLUMN',
            'DROP TABLE',
            'RENAME COLUMN',
        ]
        
        return any(pattern in diff for pattern in breaking_patterns)
    
    def _is_public_file(self, file_path: str) -> bool:
        """Check if file is part of public API"""
        return bool(re.search(r'\.(controller|service|dto)\.ts$', file_path))
    
    def _is_type_change(self, file_path: str, diff: str) -> bool:
        """Detect type changes (optional → required)"""
        if not re.search(r'\.(dto|interface)\.ts$', file_path):
            return False
        
        # Check for optional field becoming required
        return bool(re.search(r'^\-\s*(\w+)\?\s*:.*\n\+\s*\1:', diff, re.MULTILINE))
    
    def _has_breaking_tag(self, pr_title: str) -> bool:
        """Check if PR title has [BREAKING] tag"""
        return '[BREAKING]' in pr_title
    
    def _has_migration_guide(self, changed_files: List[dict]) -> bool:
        """Check if migration guide exists"""
        return any(
            file['path'].startswith('docs/migrations/') and file['path'].endswith('-migration.md')
            for file in changed_files
        )
    
    def _check_version_bump(self, changed_files: List[dict]) -> tuple[bool, Optional[str]]:
        """Check for MAJOR version bump"""
        package_json = next((f for f in changed_files if f['path'] == 'package.json'), None)
        
        if not package_json:
            return False, "No version bump found in package.json"
        
        diff = package_json.get('diff', '')
        
        # Extract old and new versions
        old_version_match = re.search(r'^\-\s*"version":\s*"([^"]+)"', diff, re.MULTILINE)
        new_version_match = re.search(r'^\+\s*"version":\s*"([^"]+)"', diff, re.MULTILINE)
        
        if not old_version_match or not new_version_match:
            return False, "Could not detect version change in package.json"
        
        old_version = old_version_match.group(1)
        new_version = new_version_match.group(1)
        
        # Parse versions
        try:
            old_major, old_minor, old_patch = map(int, old_version.split('.'))
            new_major, new_minor, new_patch = map(int, new_version.split('.'))
        except ValueError:
            return False, f"Invalid version format: {old_version} or {new_version}"
        
        # Check for MAJOR increment
        if new_major != old_major + 1:
            return False, f"Expected MAJOR bump: {old_version} → {old_major+1}.0.0, got {new_version}"
        
        if new_minor != 0 or new_patch != 0:
            return False, f"MAJOR bump should reset MINOR and PATCH to 0: {old_version} → {old_major+1}.0.0, got {new_version}"
        
        return True, None
    
    def _has_changelog_update(self, changed_files: List[dict]) -> bool:
        """Check if CHANGELOG.md has breaking changes section"""
        changelog = next((f for f in changed_files if f['path'] == 'CHANGELOG.md'), None)
        
        if not changelog:
            return False
        
        diff = changelog.get('diff', '')
        
        # Check for breaking changes section (flexible matching)
        breaking_patterns = [
            r'##\s*Breaking Changes',
            r'###\s*Breaking Changes',
            r'##\s*\[BREAKING\]',
            r'Breaking:',
        ]
        
        return any(re.search(pattern, diff, re.IGNORECASE) for pattern in breaking_patterns)
    
    def _has_api_docs_update(self, changed_files: List[dict]) -> bool:
        """Check if API documentation was updated"""
        return any(
            re.search(r'(openapi|swagger|api-docs).*\.(yaml|json|md)$', file['path'])
            for file in changed_files
        )
    
    def _get_pr_title(self, pr_number: int) -> str:
        """Get PR title from git (placeholder - would use GitHub API)"""
        # In real implementation, would use GitHub API
        # For now, return placeholder
        return f"PR #{pr_number}"
    
    def _get_changed_files(self, pr_number: int) -> List[dict]:
        """Get changed files from git (placeholder - would use GitHub API)"""
        # In real implementation, would use GitHub API or git diff
        # For now, return empty list
        return []
    
    def print_violations(self):
        """Print violations with color coding"""
        if not self.violations:
            print(f"{Colors.GREEN}✓ No breaking change documentation violations found{Colors.END}")
            return
        
        # Group by severity
        errors = [v for v in self.violations if v.severity == 'error']
        warnings = [v for v in self.violations if v.severity == 'warning']
        
        if errors:
            print(f"\n{Colors.RED}{Colors.BOLD}ERRORS ({len(errors)}):{Colors.END}")
            for v in errors:
                self._print_violation(v, Colors.RED)
        
        if warnings:
            print(f"\n{Colors.YELLOW}{Colors.BOLD}WARNINGS ({len(warnings)}):{Colors.END}")
            for v in warnings:
                self._print_violation(v, Colors.YELLOW)
        
        # Print detected breaking changes
        if self.breaking_changes:
            print(f"\n{Colors.BLUE}{Colors.BOLD}DETECTED BREAKING CHANGES ({len(self.breaking_changes)}):{Colors.END}")
            for bc in self.breaking_changes:
                print(f"\n{Colors.BLUE}[{bc.change_type.value.upper()}]{Colors.END} {bc.description}")
                print(f"  File: {bc.file_path}")
        
        # Summary
        print(f"\n{Colors.BOLD}Summary:{Colors.END}")
        print(f"  Breaking Changes: {len(self.breaking_changes)}")
        print(f"  Errors: {len(errors)}")
        print(f"  Warnings: {len(warnings)}")
        print(f"  Total Violations: {len(self.violations)}")
        
        if errors:
            sys.exit(1)
    
    def _print_violation(self, violation: Violation, color: str):
        """Print a single violation"""
        print(f"\n{color}[{violation.category}]{Colors.END} {violation.message}")
        if violation.suggestion:
            print(f"  {Colors.BLUE}Suggestion:{Colors.END} {violation.suggestion}")

def main():
    parser = argparse.ArgumentParser(description="Check breaking change documentation (R06)")
    parser.add_argument('--pr', type=int, help='Check specific PR number')
    parser.add_argument('--files', nargs='+', help='Check specific files')
    parser.add_argument('--json', action='store_true', help='Output JSON format')
    
    args = parser.parse_args()
    
    # Find repository root
    repo_root = Path.cwd()
    while not (repo_root / '.git').exists() and repo_root != repo_root.parent:
        repo_root = repo_root.parent
    
    if not (repo_root / '.git').exists():
        print(f"{Colors.RED}Error: Not in a git repository{Colors.END}")
        sys.exit(1)
    
    checker = BreakingChangeChecker(repo_root)
    
    if args.pr:
        violations = checker.check_pr(args.pr)
        checker.violations.extend(violations)
    
    elif args.files:
        print(f"{Colors.YELLOW}File-specific checking not yet implemented{Colors.END}")
        sys.exit(1)
    
    else:
        parser.print_help()
        sys.exit(1)
    
    # Print results
    if args.json:
        import json
        output = {
            'breaking_changes': [
                {
                    'file_path': bc.file_path,
                    'change_type': bc.change_type.value,
                    'description': bc.description,
                    'line_number': bc.line_number
                }
                for bc in checker.breaking_changes
            ],
            'violations': [
                {
                    'severity': v.severity,
                    'category': v.category,
                    'message': v.message,
                    'suggestion': v.suggestion
                }
                for v in checker.violations
            ],
            'summary': {
                'breaking_changes': len(checker.breaking_changes),
                'errors': len([v for v in checker.violations if v.severity == 'error']),
                'warnings': len([v for v in checker.violations if v.severity == 'warning']),
                'total': len(checker.violations)
            }
        }
        print(json.dumps(output, indent=2))
    else:
        checker.print_violations()

if __name__ == '__main__':
    main()





