#!/usr/bin/env python3
"""
R11: Backend Patterns Checker (Legacy Wrapper)

This script is a thin wrapper around BackendPatternsChecker for local/CLI usage.
For CI and automated enforcement, use the modular checker directly via auto-enforcer.py.

Usage:
    python check-backend-patterns.py --file <file_path>
    python check-backend-patterns.py --module <module_name>
    python check-backend-patterns.py --all
"""

import os
import sys
import argparse
from pathlib import Path

# Add project root to path
project_root = Path(__file__).parent.parent.parent
sys.path.insert(0, str(project_root))
sys.path.insert(0, str(project_root / ".cursor"))

try:
    from enforcement.checkers.backend_patterns_checker import BackendPatternsChecker
    from enforcement.checkers.base_checker import CheckerStatus
    MODULAR_CHECKER_AVAILABLE = True
except ImportError:
    MODULAR_CHECKER_AVAILABLE = False
    print("Error: BackendPatternsChecker not available. Ensure enforcement module is properly installed.")
    sys.exit(1)


def discover_files(root: Path, file_path: str = None, module_name: str = None, all_files: bool = False) -> list[str]:
    """
    Discover files to check based on arguments.
    
    Args:
        root: Project root directory
        file_path: Single file path (relative to root)
        module_name: Module name to check
        all_files: Whether to check all backend files
        
    Returns:
        List of file paths (relative to root)
    """
    files = []
    
    if file_path:
        # Single file
        full_path = root / file_path
        if full_path.exists():
            files.append(file_path)
    elif module_name:
        # All files in module
        module_dir = root / 'apps' / 'api' / 'src' / module_name
        if module_dir.exists():
            for file in module_dir.rglob('*.ts'):
                if file.suffix in ['.ts'] and not 'test' in str(file).lower():
                    files.append(str(file.relative_to(root)))
    elif all_files:
        # All backend files
        api_dir = root / 'apps' / 'api' / 'src'
        if api_dir.exists():
            for file in api_dir.rglob('*.ts'):
                if file.suffix in ['.ts'] and not 'test' in str(file).lower():
                    files.append(str(file.relative_to(root)))
    
    return files


def format_violations(violations: list, format_type: str = 'text') -> str:
    """
    Format violations for human-readable output.
    
    Args:
        violations: List of violation dictionaries
        format_type: 'text' or 'json'
        
    Returns:
        Formatted output string
    """
    if format_type == 'json':
        import json
        return json.dumps(violations, indent=2)
    
    # Text format
    if not violations:
        return "✓ No violations found."
    
    output = []
    output.append(f"Found {len(violations)} violation(s):\n")
    
    for v in violations:
        severity = v.get('severity', 'WARNING')
        rule_ref = v.get('rule_ref', 'UNKNOWN')
        file_path = v.get('file_path', 'unknown')
        line_number = v.get('line_number', '?')
        message = v.get('message', 'No message')
        fix_hint = v.get('fix_hint', '')
        
        output.append(f"[{severity}] [{rule_ref}] {file_path}:{line_number}")
        output.append(f"  {message}")
        if fix_hint:
            output.append(f"  Fix: {fix_hint}")
        output.append("")
    
    return "\n".join(output)


def main():
    """Main entry point for CLI usage."""
    parser = argparse.ArgumentParser(
        description='Check backend patterns (legacy wrapper for BackendPatternsChecker)'
    )
    
    group = parser.add_mutually_exclusive_group(required=True)
    group.add_argument('--file', help='Check a single file')
    group.add_argument('--module', help='Check all files in a module')
    group.add_argument('--all', action='store_true', help='Check all backend files')
    
    parser.add_argument('--format', choices=['text', 'json'], default='text',
                       help='Output format (default: text)')
    parser.add_argument('--strict', action='store_true',
                       help='Treat warnings as errors')
    
    args = parser.parse_args()
    
    if not MODULAR_CHECKER_AVAILABLE:
        print("Error: BackendPatternsChecker not available.")
        sys.exit(1)
    
    # Discover files to check
    project_root = Path(__file__).parent.parent.parent
    changed_files = discover_files(
        project_root,
        file_path=args.file,
        module_name=args.module,
        all_files=args.all
    )
    
    if not changed_files:
        print("No files found to check.")
        sys.exit(0)
    
    # Create checker instance
    rules_dir = project_root / '.cursor' / 'enforcement' / 'rules'
    rule_file = rules_dir / '08-backend-patterns.mdc'
    
    if not rule_file.exists():
        # Create minimal rule file if it doesn't exist
        rule_file.parent.mkdir(parents=True, exist_ok=True)
        rule_file.write_text('---\ndescription: "Backend patterns"\n---\n')
    
    checker = BackendPatternsChecker(
        project_root=project_root,
        rule_file=rule_file,
        rule_ref='08-backend-patterns.mdc',
        always_apply=False
    )
    
    # Run checks
    result = checker.check(changed_files)
    
    # Format and print output
    output = format_violations(result.violations, args.format)
    print(output)
    
    # Exit code
    blocking_count = len([v for v in result.violations if v.get('severity') == 'BLOCKING'])
    warning_count = len([v for v in result.violations if v.get('severity') == 'WARNING'])
    
    if blocking_count > 0:
        sys.exit(1)
    elif args.strict and warning_count > 0:
        sys.exit(1)
    else:
        sys.exit(0)


if __name__ == '__main__':
    main()
