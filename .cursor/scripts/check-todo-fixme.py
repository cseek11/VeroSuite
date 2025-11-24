#!/usr/bin/env python3
"""
R15: TODO/FIXME Handling Checker

Detects TODO/FIXME comments and verifies they are properly handled.

Usage:
    python check-todo-fixme.py --file <file_path>
    python check-todo-fixme.py --pr <PR_NUMBER>
    python check-todo-fixme.py --check-orphaned
    python check-todo-fixme.py --all
"""

import argparse
import os
import re
import sys
from pathlib import Path
from typing import List, Dict, Optional

class TodoFixmeChecker:
    """Checker for R15: TODO/FIXME Handling"""
    
    # TODO/FIXME patterns
    TODO_PATTERNS = [
        r'//\s*TODO:(.+)',
        r'/\*\s*TODO:(.+?)\*/',
        r'#\s*TODO:(.+)',
        r'<!--\s*TODO:(.+?)-->',
    ]
    
    FIXME_PATTERNS = [
        r'//\s*FIXME:(.+)',
        r'/\*\s*FIXME:(.+?)\*/',
        r'#\s*FIXME:(.+)',
        r'<!--\s*FIXME:(.+?)-->',
    ]
    
    # Meaningful TODO keywords
    MEANINGFUL_KEYWORDS = [
        'workaround',
        'deferred',
        'temporary',
        'hack',
        'time constraint',
        'blocked',
        'waiting',
    ]
    
    # Trivial TODO keywords
    TRIVIAL_KEYWORDS = [
        'add console.log',
        'remove console.log',
        'debug',
        'test this',
        'cleanup',
    ]
    
    # Tech debt reference pattern
    TECH_DEBT_REFERENCE_PATTERN = r'docs/tech-debt\.md(?:#[\w-]+)?'
    
    def __init__(self):
        self.violations = []
        self.tech_debt_file = 'docs/tech-debt.md'
        
    def check_file(self, file_path: str) -> List[Dict]:
        """Check a single file for TODO/FIXME violations"""
        violations = []
        
        if not os.path.exists(file_path):
            return violations
        
        # Skip tech-debt.md itself
        if file_path.endswith('tech-debt.md'):
            return violations
        
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
        except Exception as e:
            print(f"Warning: Could not read {file_path}: {e}", file=sys.stderr)
            return violations
        
        # Find all TODO/FIXME comments
        todos = self._find_todos(content)
        fixmes = self._find_fixmes(content)
        
        all_comments = todos + fixmes
        
        for comment_info in all_comments:
            violations.extend(self._check_comment(file_path, content, comment_info))
        
        return violations
    
    def _find_todos(self, content: str) -> List[Dict]:
        """Find all TODO comments"""
        todos = []
        for pattern in self.TODO_PATTERNS:
            for match in re.finditer(pattern, content, re.IGNORECASE | re.DOTALL):
                line_num = content[:match.start()].count('\n') + 1
                todos.append({
                    'type': 'TODO',
                    'line': line_num,
                    'content': match.group(1).strip() if match.groups() else '',
                    'full_match': match.group(0)
                })
        return todos
    
    def _find_fixmes(self, content: str) -> List[Dict]:
        """Find all FIXME comments"""
        fixmes = []
        for pattern in self.FIXME_PATTERNS:
            for match in re.finditer(pattern, content, re.IGNORECASE | re.DOTALL):
                line_num = content[:match.start()].count('\n') + 1
                fixmes.append({
                    'type': 'FIXME',
                    'line': line_num,
                    'content': match.group(1).strip() if match.groups() else '',
                    'full_match': match.group(0)
                })
        return fixmes
    
    def _check_comment(self, file_path: str, file_content: str, comment_info: Dict) -> List[Dict]:
        """Check a single TODO/FIXME comment"""
        violations = []
        
        comment_type = comment_info['type']
        comment_content = comment_info['content']
        line_num = comment_info['line']
        
        # Check if meaningful
        is_meaningful = self._is_meaningful(comment_content)
        is_trivial = self._is_trivial(comment_content)
        has_reference = self._has_tech_debt_reference(comment_content)
        
        # Check if vague
        if not comment_content or len(comment_content.strip()) < 5:
            violations.append({
                'file': file_path,
                'line': line_num,
                'type': 'vague_todo',
                'severity': 'warning',
                'message': f'{comment_type} comment is too vague or empty. Provide specific description of what needs to be done.',
                'suggestion': f'Add clear description: "{comment_type}: [Specific action needed]"'
            })
        
        # Check meaningful TODOs
        if is_meaningful and not has_reference:
            # Check if logged in tech-debt.md
            if not self._is_logged_in_tech_debt(file_path, comment_content):
                violations.append({
                    'file': file_path,
                    'line': line_num,
                    'type': 'meaningful_todo_not_logged',
                    'severity': 'warning',
                    'message': f'Meaningful {comment_type} detected (contains: {self._get_meaningful_keywords(comment_content)}) but not logged in tech-debt.md.',
                    'suggestion': f'Log as technical debt and add reference: "{comment_type}: ... (see docs/tech-debt.md#DEBT-XXX)"'
                })
        
        # Check trivial TODOs
        if is_trivial:
            violations.append({
                'file': file_path,
                'line': line_num,
                'type': 'trivial_todo',
                'severity': 'info',
                'message': f'Trivial {comment_type} detected. Consider completing in current PR instead of deferring.',
                'suggestion': 'Complete trivial work in same PR, or remove TODO if not needed.'
            })
        
        # Check for orphaned references
        if has_reference:
            debt_id = self._extract_debt_id(comment_content)
            if debt_id and not self._debt_entry_exists(debt_id):
                violations.append({
                    'file': file_path,
                    'line': line_num,
                    'type': 'orphaned_todo',
                    'severity': 'warning',
                    'message': f'{comment_type} references {debt_id} but entry not found in tech-debt.md.',
                    'suggestion': f'Create tech-debt.md entry for {debt_id} or update reference.'
                })
        
        return violations
    
    def _is_meaningful(self, comment_content: str) -> bool:
        """Check if TODO/FIXME is meaningful (should be logged as debt)"""
        content_lower = comment_content.lower()
        return any(keyword in content_lower for keyword in self.MEANINGFUL_KEYWORDS)
    
    def _is_trivial(self, comment_content: str) -> bool:
        """Check if TODO/FIXME is trivial (should be completed in PR)"""
        content_lower = comment_content.lower()
        return any(keyword in content_lower for keyword in self.TRIVIAL_KEYWORDS)
    
    def _has_tech_debt_reference(self, comment_content: str) -> bool:
        """Check if TODO/FIXME has reference to tech-debt.md"""
        return bool(re.search(self.TECH_DEBT_REFERENCE_PATTERN, comment_content))
    
    def _get_meaningful_keywords(self, comment_content: str) -> str:
        """Get meaningful keywords found in comment"""
        content_lower = comment_content.lower()
        found = [kw for kw in self.MEANINGFUL_KEYWORDS if kw in content_lower]
        return ', '.join(found) if found else 'unknown'
    
    def _extract_debt_id(self, comment_content: str) -> Optional[str]:
        """Extract debt ID from comment (e.g., DEBT-001)"""
        match = re.search(r'#(DEBT-\d+)', comment_content)
        return match.group(1) if match else None
    
    def _is_logged_in_tech_debt(self, file_path: str, comment_content: str) -> bool:
        """Check if TODO/FIXME is logged in tech-debt.md"""
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
    
    def _debt_entry_exists(self, debt_id: str) -> bool:
        """Check if debt entry exists in tech-debt.md"""
        if not os.path.exists(self.tech_debt_file):
            return False
        
        try:
            with open(self.tech_debt_file, 'r', encoding='utf-8') as f:
                tech_debt_content = f.read()
            
            # Check for debt ID in tech-debt.md
            return debt_id in tech_debt_content
        except Exception:
            return False
    
    def check_orphaned_todos(self) -> List[Dict]:
        """Check for orphaned TODOs (reference non-existent debt entries)"""
        violations = []
        
        # Find all code files with TODO/FIXME references
        for ext in ['*.ts', '*.tsx', '*.js', '*.jsx', '*.py']:
            for file_path in Path('.').rglob(ext):
                if 'node_modules' not in str(file_path) and '.git' not in str(file_path):
                    try:
                        with open(file_path, 'r', encoding='utf-8') as f:
                            content = f.read()
                        
                        # Find all tech-debt.md references
                        for match in re.finditer(self.TECH_DEBT_REFERENCE_PATTERN + r'#(DEBT-\d+)', content):
                            debt_id = match.group(1)
                            if not self._debt_entry_exists(debt_id):
                                line_num = content[:match.start()].count('\n') + 1
                                violations.append({
                                    'file': str(file_path),
                                    'line': line_num,
                                    'type': 'orphaned_reference',
                                    'severity': 'warning',
                                    'message': f'References {debt_id} but entry not found in tech-debt.md.',
                                    'suggestion': f'Create tech-debt.md entry for {debt_id} or remove reference.'
                                })
                    except Exception:
                        pass
        
        return violations
    
    def format_output(self, violations: List[Dict]) -> str:
        """Format violations for output"""
        if not violations:
            return "✅ No TODO/FIXME violations found."
        
        output = []
        output.append(f"\n⚠️  Found {len(violations)} TODO/FIXME warning(s):\n")
        
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
                line_info = f":{v['line']}" if v.get('line') else ""
                output.append(f"    Line {v['line']}: {v['type']}")
                output.append(f"      Severity: {v['severity']}")
                output.append(f"      Message: {v['message']}")
                if v.get('suggestion'):
                    output.append(f"      Suggestion: {v['suggestion']}")
                output.append("")
        
        return "\n".join(output)

def main():
    parser = argparse.ArgumentParser(description='R15: TODO/FIXME Handling Checker')
    parser.add_argument('--file', help='Check a single file')
    parser.add_argument('--pr', help='Check files in a PR (requires PR number)')
    parser.add_argument('--check-orphaned', action='store_true', help='Check for orphaned TODO references')
    parser.add_argument('--all', action='store_true', help='Check all files in repository')
    
    args = parser.parse_args()
    
    checker = TodoFixmeChecker()
    all_violations = []
    
    if args.file:
        violations = checker.check_file(args.file)
        all_violations.extend(violations)
    
    elif args.check_orphaned:
        violations = checker.check_orphaned_todos()
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



