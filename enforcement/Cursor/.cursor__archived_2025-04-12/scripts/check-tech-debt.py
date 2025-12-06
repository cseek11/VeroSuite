#!/usr/bin/env python3
"""
R14: Tech Debt Logging Checker

Detects technical debt patterns in code and verifies they are logged in docs/tech-debt.md.

Usage:
    python check-tech-debt.py --file <file_path>
    python check-tech-debt.py --pr <PR_NUMBER>
    python check-tech-debt.py --check-missing
    python check-tech-debt.py --all
"""

import argparse
import os
import re
import sys
from datetime import datetime
from pathlib import Path
from typing import List, Dict, Optional

class TechDebtChecker:
    """Checker for R14: Tech Debt Logging"""
    
    # Debt patterns to detect
    WORKAROUND_PATTERNS = [
        r'TODO:.*workaround',
        r'FIXME:.*workaround',
        r'temporary.*fix',
        r'workaround.*TODO',
        r'workaround.*FIXME',
    ]
    
    DEFERRED_FIX_PATTERNS = [
        r'TODO:.*deferred',
        r'FIXME:.*time constraint',
        r'TODO:.*time constraint',
        r'deferred.*TODO',
        r'deferred.*FIXME',
    ]
    
    DEPRECATED_PATTERNS = [
        r'@deprecated',
        r'//\s*Deprecated:',
        r'/\*\*.*@deprecated',
    ]
    
    SKIPPED_TEST_PATTERNS = [
        r'it\.skip\(',
        r'describe\.skip\(',
        r'test\.skip\(',
        r'xit\(',
        r'xdescribe\(',
        r'xtest\(',
    ]
    
    HARDCODED_VALUE_PATTERNS = [
        r'TODO:.*configurable',
        r'FIXME:.*hardcoded',
        r'TODO:.*Make configurable',
        r'FIXME:.*Hardcoded',
    ]
    
    CODE_DUPLICATION_PATTERNS = [
        r'TODO:.*Extract to shared',
        r'FIXME:.*Duplicate',
        r'TODO:.*duplicate',
        r'FIXME:.*extract',
    ]
    
    # Date patterns
    HARDCODED_DATE_PATTERN = r'##\s+(202[0-4]-\d{2}-\d{2})'  # Dates before 2025
    CURRENT_DATE_PATTERN = r'##\s+(\d{4}-\d{2}-\d{2})'
    
    # Template fields
    REQUIRED_FIELDS = [
        'Category:',
        'Priority:',
        'Location:',
        'Description:',
        'Impact:',
        'Remediation Plan:',
        'Estimated Effort:',
        'Status:',
    ]
    
    def __init__(self):
        self.violations = []
        self.tech_debt_file = 'docs/tech-debt.md'
        
    def check_file(self, file_path: str) -> List[Dict]:
        """Check a single file for tech debt violations"""
        violations = []
        
        if not os.path.exists(file_path):
            return violations
        
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
        except Exception as e:
            print(f"Warning: Could not read {file_path}: {e}", file=sys.stderr)
            return violations
        
        # Check if this is tech-debt.md
        if file_path.endswith('tech-debt.md'):
            violations.extend(self._check_tech_debt_file(file_path, content))
        else:
            # Check for debt patterns in code
            violations.extend(self._check_code_file(file_path, content))
        
        return violations
    
    def _check_tech_debt_file(self, file_path: str, content: str) -> List[Dict]:
        """Check tech-debt.md for compliance"""
        violations = []
        
        # Check for hardcoded historical dates
        for match in re.finditer(self.HARDCODED_DATE_PATTERN, content, re.IGNORECASE):
            date_str = match.group(1)
            violations.append({
                'file': file_path,
                'line': content[:match.start()].count('\n') + 1,
                'type': 'hardcoded_date',
                'severity': 'warning',
                'message': f'Hardcoded historical date found: {date_str}. Use current system date (YYYY-MM-DD format).',
                'suggestion': f'Replace with current date: {datetime.now().strftime("%Y-%m-%d")}'
            })
        
        # Check for incomplete remediation plans
        entries = re.split(r'##\s+\d{4}-\d{2}-\d{2}', content)[1:]  # Split by date headers
        for i, entry in enumerate(entries):
            if 'Remediation Plan:' in entry:
                if 'Estimated Effort:' not in entry:
                    violations.append({
                        'file': file_path,
                        'line': None,
                        'type': 'incomplete_remediation_plan',
                        'severity': 'warning',
                        'message': f'Tech debt entry #{i+1} is missing "Estimated Effort" field.',
                        'suggestion': 'Add estimated effort (e.g., "2 hours", "1 day")'
                    })
                
                if 'Priority:' not in entry:
                    violations.append({
                        'file': file_path,
                        'line': None,
                        'type': 'incomplete_remediation_plan',
                        'severity': 'warning',
                        'message': f'Tech debt entry #{i+1} is missing "Priority" field.',
                        'suggestion': 'Add priority (High/Medium/Low)'
                    })
        
        return violations
    
    def _check_code_file(self, file_path: str, content: str) -> List[Dict]:
        """Check code file for debt patterns"""
        violations = []
        
        # Check if tech-debt.md exists
        tech_debt_exists = os.path.exists(self.tech_debt_file)
        
        # Check for workaround patterns
        for pattern in self.WORKAROUND_PATTERNS:
            if re.search(pattern, content, re.IGNORECASE):
                if not tech_debt_exists or not self._is_logged_in_tech_debt(file_path):
                    violations.append({
                        'file': file_path,
                        'line': self._find_line_number(content, pattern),
                        'type': 'missing_debt_entry',
                        'severity': 'warning',
                        'message': 'Workaround pattern detected but not logged in docs/tech-debt.md.',
                        'suggestion': 'Log workaround as technical debt with category, priority, location, impact, remediation plan, and effort estimate.'
                    })
                break  # Only report once per file
        
        # Check for deferred fix patterns
        for pattern in self.DEFERRED_FIX_PATTERNS:
            if re.search(pattern, content, re.IGNORECASE):
                if not tech_debt_exists or not self._is_logged_in_tech_debt(file_path):
                    violations.append({
                        'file': file_path,
                        'line': self._find_line_number(content, pattern),
                        'type': 'missing_debt_entry',
                        'severity': 'warning',
                        'message': 'Deferred fix pattern detected but not logged in docs/tech-debt.md.',
                        'suggestion': 'Log deferred fix as technical debt with remediation plan and effort estimate.'
                    })
                break
        
        # Check for deprecated patterns
        for pattern in self.DEPRECATED_PATTERNS:
            if re.search(pattern, content, re.IGNORECASE):
                if not tech_debt_exists or not self._is_logged_in_tech_debt(file_path):
                    violations.append({
                        'file': file_path,
                        'line': self._find_line_number(content, pattern),
                        'type': 'missing_debt_entry',
                        'severity': 'warning',
                        'message': 'Deprecated pattern usage detected but not logged in docs/tech-debt.md.',
                        'suggestion': 'Log deprecated pattern usage as technical debt with migration plan.'
                    })
                break
        
        # Check for skipped tests
        for pattern in self.SKIPPED_TEST_PATTERNS:
            if re.search(pattern, content, re.IGNORECASE):
                if not tech_debt_exists or not self._is_logged_in_tech_debt(file_path):
                    violations.append({
                        'file': file_path,
                        'line': self._find_line_number(content, pattern),
                        'type': 'missing_debt_entry',
                        'severity': 'warning',
                        'message': 'Skipped test detected but not logged in docs/tech-debt.md.',
                        'suggestion': 'Log skipped test as technical debt with reason and remediation plan.'
                    })
                break
        
        # Check for hardcoded values
        for pattern in self.HARDCODED_VALUE_PATTERNS:
            if re.search(pattern, content, re.IGNORECASE):
                if not tech_debt_exists or not self._is_logged_in_tech_debt(file_path):
                    violations.append({
                        'file': file_path,
                        'line': self._find_line_number(content, pattern),
                        'type': 'missing_debt_entry',
                        'severity': 'warning',
                        'message': 'Hardcoded value pattern detected but not logged in docs/tech-debt.md.',
                        'suggestion': 'Log hardcoded value as technical debt with configuration plan.'
                    })
                break
        
        # Check for code duplication
        for pattern in self.CODE_DUPLICATION_PATTERNS:
            if re.search(pattern, content, re.IGNORECASE):
                if not tech_debt_exists or not self._is_logged_in_tech_debt(file_path):
                    violations.append({
                        'file': file_path,
                        'line': self._find_line_number(content, pattern),
                        'type': 'missing_debt_entry',
                        'severity': 'warning',
                        'message': 'Code duplication pattern detected but not logged in docs/tech-debt.md.',
                        'suggestion': 'Log code duplication as technical debt with abstraction plan.'
                    })
                break
        
        return violations
    
    def _is_logged_in_tech_debt(self, file_path: str) -> bool:
        """Check if file path is mentioned in tech-debt.md"""
        if not os.path.exists(self.tech_debt_file):
            return False
        
        try:
            with open(self.tech_debt_file, 'r', encoding='utf-8') as f:
                tech_debt_content = f.read()
            
            # Normalize path separators
            normalized_path = file_path.replace('\\', '/')
            
            # Check if file path is mentioned
            return normalized_path in tech_debt_content or os.path.basename(file_path) in tech_debt_content
        except Exception:
            return False
    
    def _find_line_number(self, content: str, pattern: str) -> Optional[int]:
        """Find line number where pattern occurs"""
        match = re.search(pattern, content, re.IGNORECASE)
        if match:
            return content[:match.start()].count('\n') + 1
        return None
    
    def format_output(self, violations: List[Dict]) -> str:
        """Format violations for output"""
        if not violations:
            return "✅ No tech debt violations found."
        
        output = []
        output.append(f"\n⚠️  Found {len(violations)} tech debt warning(s):\n")
        
        for v in violations:
            line_info = f":{v['line']}" if v['line'] else ""
            output.append(f"  {v['file']}{line_info}")
            output.append(f"    Type: {v['type']}")
            output.append(f"    Severity: {v['severity']}")
            output.append(f"    Message: {v['message']}")
            if v.get('suggestion'):
                output.append(f"    Suggestion: {v['suggestion']}")
            output.append("")
        
        return "\n".join(output)

def main():
    parser = argparse.ArgumentParser(description='R14: Tech Debt Logging Checker')
    parser.add_argument('--file', help='Check a single file')
    parser.add_argument('--pr', help='Check files in a PR (requires PR number)')
    parser.add_argument('--check-missing', action='store_true', help='Check for missing debt entries')
    parser.add_argument('--all', action='store_true', help='Check all files in repository')
    
    args = parser.parse_args()
    
    checker = TechDebtChecker()
    all_violations = []
    
    if args.file:
        violations = checker.check_file(args.file)
        all_violations.extend(violations)
    
    elif args.all:
        # Check all TypeScript/JavaScript files
        for ext in ['*.ts', '*.tsx', '*.js', '*.jsx']:
            for file_path in Path('.').rglob(ext):
                if 'node_modules' not in str(file_path) and '.git' not in str(file_path):
                    violations = checker.check_file(str(file_path))
                    all_violations.extend(violations)
        
        # Also check tech-debt.md
        if os.path.exists('docs/tech-debt.md'):
            violations = checker.check_file('docs/tech-debt.md')
            all_violations.extend(violations)
    
    elif args.pr:
        print("PR checking not yet implemented. Use --file or --all instead.")
        sys.exit(1)
    
    else:
        parser.print_help()
        sys.exit(1)
    
    # Output results
    print(checker.format_output(all_violations))
    
    # Exit with appropriate code (warnings don't fail)
    sys.exit(0)

if __name__ == '__main__':
    main()





