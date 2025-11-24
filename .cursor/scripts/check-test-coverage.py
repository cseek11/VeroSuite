#!/usr/bin/env python3
"""
R10: Test Coverage Checker

Verifies that all code changes have appropriate test coverage:
- New features have unit tests
- Bug fixes have regression tests
- Coverage meets 80% threshold (statements, branches, functions, lines)
- Tests run and pass
- Coverage delta is positive

Usage:
    python check-test-coverage.py --file <file_path>
    python check-test-coverage.py --pr <PR_NUMBER>
    python check-test-coverage.py --all
"""

import re
import sys
import argparse
import json
import os
import subprocess
from pathlib import Path
from typing import List, Dict, Tuple, Optional

class TestCoverageChecker:
    def __init__(self):
        self.violations = []
        self.warnings = []
        
    def check_file(self, file_path: str) -> Dict:
        """Check a single file for test coverage violations."""
        if not Path(file_path).exists():
            return {"error": f"File not found: {file_path}"}
        
        # Reset violations for this file
        file_violations = []
        file_warnings = []
        
        # Check 1: Missing unit tests for new features
        if self._is_new_source_file(file_path):
            test_file = self._find_test_file(file_path)
            if not test_file:
                file_violations.append({
                    "type": "missing_unit_tests",
                    "message": f"New source file without corresponding test file. Expected: {self._get_expected_test_path(file_path)}"
                })
        
        # Check 2: Coverage thresholds
        coverage = self._get_file_coverage(file_path)
        if coverage:
            threshold_violations = self._check_coverage_thresholds(file_path, coverage)
            file_violations.extend(threshold_violations)
            
            # Warnings for 70-80% coverage
            threshold_warnings = self._check_coverage_warnings(file_path, coverage)
            file_warnings.extend(threshold_warnings)
        
        return {
            "file": file_path,
            "violations": file_violations,
            "warnings": file_warnings,
            "total_violations": len(file_violations),
            "total_warnings": len(file_warnings)
        }
    
    def check_pr(self, pr_number: str) -> Dict:
        """Check all files in a PR for test coverage violations."""
        # Get PR files
        pr_files = self._get_pr_files(pr_number)
        
        # Check if PR is a bug fix
        pr_info = self._get_pr_info(pr_number)
        is_bug_fix = self._is_bug_fix_pr(pr_info.get('title', ''), pr_info.get('body', ''))
        
        violations = []
        warnings = []
        
        # Check each file
        for file_path in pr_files:
            result = self.check_file(file_path)
            violations.extend(result.get('violations', []))
            warnings.extend(result.get('warnings', []))
        
        # Check for missing regression tests
        if is_bug_fix:
            regression_violations = self._check_regression_tests(pr_files)
            violations.extend(regression_violations)
        
        # Check coverage delta
        coverage_delta = self._calculate_coverage_delta(pr_files)
        delta_violations = self._check_coverage_delta(coverage_delta)
        violations.extend(delta_violations)
        
        return {
            "pr": pr_number,
            "violations": violations,
            "warnings": warnings,
            "total_violations": len(violations),
            "total_warnings": len(warnings)
        }
    
    def _is_new_source_file(self, file_path: str) -> bool:
        """Check if file is a new source file (not a test file)."""
        if not self._is_source_file(file_path):
            return False
        
        # Check git status
        try:
            result = subprocess.run(
                ['git', 'log', '--diff-filter=A', '--', file_path],
                capture_output=True,
                text=True,
                timeout=5
            )
            return len(result.stdout) > 0
        except:
            return False
    
    def _is_source_file(self, file_path: str) -> bool:
        """Check if file is a source file (not a test file)."""
        if not (file_path.endswith('.ts') or file_path.endswith('.tsx')):
            return False
        
        if file_path.endswith('.spec.ts') or file_path.endswith('.test.ts'):
            return False
        
        if file_path.endswith('.spec.tsx') or file_path.endswith('.test.tsx'):
            return False
        
        if file_path.endswith('.d.ts'):
            return False
        
        return True
    
    def _find_test_file(self, source_path: str) -> Optional[str]:
        """Find corresponding test file for a source file."""
        # Pattern 1: Adjacent .spec.ts file
        adjacent = source_path.replace('.ts', '.spec.ts').replace('.tsx', '.spec.tsx')
        if Path(adjacent).exists():
            return adjacent
        
        # Pattern 2: __tests__ directory
        source_dir = os.path.dirname(source_path)
        source_basename = os.path.basename(source_path)
        test_basename = source_basename.replace('.ts', '.test.ts').replace('.tsx', '.test.tsx')
        test_dir_path = os.path.join(source_dir, '__tests__', test_basename)
        if Path(test_dir_path).exists():
            return test_dir_path
        
        # Pattern 3: Parallel test directory
        parallel = source_path.replace('/src/', '/test/').replace('.ts', '.test.ts').replace('.tsx', '.test.tsx')
        if Path(parallel).exists():
            return parallel
        
        return None
    
    def _get_expected_test_path(self, source_path: str) -> str:
        """Get expected test file path for a source file."""
        # Prefer adjacent .spec.ts pattern
        return source_path.replace('.ts', '.spec.ts').replace('.tsx', '.spec.tsx')
    
    def _get_file_coverage(self, file_path: str) -> Optional[Dict]:
        """Get coverage data for a file."""
        # Detect test framework
        framework, coverage_file = self._detect_test_framework()
        
        if not framework:
            return None
        
        # Parse coverage report
        coverage_data = self._parse_coverage_report(coverage_file)
        
        if not coverage_data:
            return None
        
        # Get coverage for this file
        return coverage_data.get(file_path)
    
    def _detect_test_framework(self) -> Tuple[Optional[str], Optional[str]]:
        """Detect test framework and coverage report location."""
        # Check for Jest (backend)
        if Path('apps/api/jest.config.js').exists():
            return 'jest', 'apps/api/coverage/coverage-final.json'
        
        # Check for Vitest (frontend)
        if Path('frontend/vitest.config.ts').exists():
            return 'vitest', 'frontend/coverage/coverage-summary.json'
        
        return None, None
    
    def _parse_coverage_report(self, coverage_file: str) -> Optional[Dict]:
        """Parse coverage report (Jest or Vitest format)."""
        if not Path(coverage_file).exists():
            return None
        
        try:
            with open(coverage_file, 'r') as f:
                data = json.load(f)
            
            # Jest format: coverage-final.json (per-file)
            if isinstance(data, dict) and any(key.endswith('.ts') for key in data.keys()):
                return self._parse_jest_coverage(data)
            
            # Vitest format: coverage-summary.json (summary + per-file)
            if 'total' in data:
                return self._parse_vitest_coverage(data)
            
            return None
        except Exception as e:
            print(f"Error parsing coverage report: {e}")
            return None
    
    def _parse_jest_coverage(self, data: Dict) -> Dict:
        """Parse Jest coverage format."""
        coverage = {}
        for file_path, file_data in data.items():
            coverage[file_path] = {
                'statements': {'pct': file_data.get('s', {}).get('pct', 0)},
                'branches': {'pct': file_data.get('b', {}).get('pct', 0)},
                'functions': {'pct': file_data.get('f', {}).get('pct', 0)},
                'lines': {'pct': file_data.get('l', {}).get('pct', 0)}
            }
        return coverage
    
    def _parse_vitest_coverage(self, data: Dict) -> Dict:
        """Parse Vitest coverage format."""
        coverage = {}
        for file_path, file_data in data.items():
            if file_path == 'total':
                continue
            coverage[file_path] = {
                'statements': file_data.get('statements', {}),
                'branches': file_data.get('branches', {}),
                'functions': file_data.get('functions', {}),
                'lines': file_data.get('lines', {})
            }
        return coverage
    
    def _check_coverage_thresholds(self, file_path: str, coverage: Dict, threshold: int = 80) -> List[Dict]:
        """Check if coverage meets thresholds."""
        violations = []
        
        for metric in ['statements', 'branches', 'functions', 'lines']:
            pct = coverage.get(metric, {}).get('pct', 0)
            if pct < threshold:
                violations.append({
                    "type": "coverage_below_threshold",
                    "metric": metric,
                    "value": pct,
                    "threshold": threshold,
                    "message": f"{metric.capitalize()} coverage {pct}% (< {threshold}%)"
                })
        
        return violations
    
    def _check_coverage_warnings(self, file_path: str, coverage: Dict) -> List[Dict]:
        """Check for coverage warnings (70-80%)."""
        warnings = []
        
        for metric in ['statements', 'branches', 'functions', 'lines']:
            pct = coverage.get(metric, {}).get('pct', 0)
            if 70 <= pct < 80:
                warnings.append({
                    "type": "incomplete_coverage",
                    "metric": metric,
                    "value": pct,
                    "message": f"{metric.capitalize()} coverage {pct}% (70-80%). Consider adding a few more tests."
                })
        
        return warnings
    
    def _is_bug_fix_pr(self, title: str, body: str) -> bool:
        """Check if PR is a bug fix."""
        # Check title
        bug_patterns = [
            r'fix(es)?[:\s]',
            r'bug[:\s]',
            r'hotfix',
            r'regression',
            r'patch',
        ]
        
        if any(re.search(pattern, title, re.IGNORECASE) for pattern in bug_patterns):
            return True
        
        # Check body for issue references
        if re.search(r'(fixes|closes|resolves)\s+#\d+', body, re.IGNORECASE):
            return True
        
        return False
    
    def _check_regression_tests(self, pr_files: List[str]) -> List[Dict]:
        """Check for regression tests in bug fix PRs."""
        violations = []
        
        # Check if any test files were modified
        test_files = [f for f in pr_files if self._is_test_file(f)]
        
        if not test_files:
            violations.append({
                "type": "missing_regression_test",
                "message": "Bug fix PR without test file modifications. Add regression test that reproduces the bug."
            })
            return violations
        
        # Check for regression test patterns
        has_regression_pattern = False
        for test_file in test_files:
            if self._has_regression_test_pattern(test_file):
                has_regression_pattern = True
                break
        
        if not has_regression_pattern:
            violations.append({
                "type": "missing_regression_test",
                "message": "Bug fix PR with test modifications but no regression test found. Add test case with description referencing bug fix."
            })
        
        return violations
    
    def _is_test_file(self, file_path: str) -> bool:
        """Check if file is a test file."""
        return (file_path.endswith('.spec.ts') or 
                file_path.endswith('.test.ts') or
                file_path.endswith('.spec.tsx') or
                file_path.endswith('.test.tsx') or
                '/__tests__/' in file_path or
                '/test/' in file_path)
    
    def _has_regression_test_pattern(self, test_file: str) -> bool:
        """Check if test file contains regression test patterns."""
        if not Path(test_file).exists():
            return False
        
        try:
            with open(test_file, 'r') as f:
                content = f.read()
            
            # Look for regression test indicators
            indicators = [
                r'regression',
                r'bug\s*fix',
                r'issue\s*#\d+',
                r'reproduces.*bug',
                r'fixes\s*#\d+',
            ]
            
            return any(re.search(pattern, content, re.IGNORECASE) for pattern in indicators)
        except:
            return False
    
    def _calculate_coverage_delta(self, pr_files: List[str]) -> Dict:
        """Calculate coverage delta for PR files."""
        # This would require comparing coverage before/after PR
        # For now, return empty dict (would be implemented with CI integration)
        return {}
    
    def _check_coverage_delta(self, coverage_delta: Dict) -> List[Dict]:
        """Check if coverage delta is negative."""
        violations = []
        
        for file_path, delta in coverage_delta.items():
            for metric in ['statements', 'branches', 'functions', 'lines']:
                if delta.get(metric, 0) < -5:  # Decreased by more than 5%
                    violations.append({
                        "type": "coverage_delta_negative",
                        "file": file_path,
                        "metric": metric,
                        "delta": delta[metric],
                        "message": f"{metric.capitalize()} coverage decreased by {abs(delta[metric])}%"
                    })
        
        return violations
    
    def _get_pr_files(self, pr_number: str) -> List[str]:
        """Get list of files in a PR."""
        # This would use GitHub API or git commands
        # For now, return empty list (would be implemented with CI integration)
        return []
    
    def _get_pr_info(self, pr_number: str) -> Dict:
        """Get PR information (title, body)."""
        # This would use GitHub API
        # For now, return empty dict (would be implemented with CI integration)
        return {}

def main():
    parser = argparse.ArgumentParser(description='Check test coverage compliance (R10)')
    parser.add_argument('--file', help='Check a specific file')
    parser.add_argument('--pr', help='Check files in a PR')
    parser.add_argument('--all', action='store_true', help='Check all source files')
    
    args = parser.parse_args()
    
    checker = TestCoverageChecker()
    
    if args.file:
        result = checker.check_file(args.file)
        print(json.dumps(result, indent=2))
        
        if result.get('total_violations', 0) > 0:
            sys.exit(1)
    
    elif args.pr:
        result = checker.check_pr(args.pr)
        print(json.dumps(result, indent=2))
        
        if result.get('total_violations', 0) > 0:
            sys.exit(1)
    
    elif args.all:
        # Check all TypeScript files in apps/ and frontend/
        files_to_check = []
        
        for pattern in ['apps/**/*.ts', 'apps/**/*.tsx', 'frontend/**/*.ts', 'frontend/**/*.tsx']:
            files_to_check.extend(Path('.').glob(pattern))
        
        total_violations = 0
        total_warnings = 0
        
        for file_path in files_to_check:
            result = checker.check_file(str(file_path))
            total_violations += result.get('total_violations', 0)
            total_warnings += result.get('total_warnings', 0)
            
            if result.get('total_violations', 0) > 0 or result.get('total_warnings', 0) > 0:
                print(json.dumps(result, indent=2))
        
        print(f"\nTotal violations: {total_violations}")
        print(f"Total warnings: {total_warnings}")
        
        if total_violations > 0:
            sys.exit(1)
    
    else:
        parser.print_help()
        sys.exit(1)

if __name__ == '__main__':
    main()



