#!/usr/bin/env python3
"""
CI Check Script: Old Terminology Detection

This script checks for deprecated terminology in rule files and documentation.
It searches for old terms that should be replaced with MAD terminology.

Usage:
    python .cursor/scripts/check-old-terminology.py [--path PATH] [--fix]

Options:
    --path PATH    Path to check (default: .cursor/rules/)
    --fix          Automatically fix simple replacements (use with caution)
"""

import os
import sys
import re
import argparse
from pathlib import Path

# Old terminology patterns to detect
OLD_TERMINOLOGY = {
    "if applicable": {
        "pattern": r"(?i)\bif\s+applicable\b",
        "replacement": "explicit trigger conditions",
        "severity": "WARNING",
        "description": "Replace 'if applicable' with explicit triggers in enforcement files (.cursor/rules/*.mdc)",
        "check_files": [".cursor/rules/*.mdc"]
    },
    "ambiguous stateful entity": {
        "pattern": r"(?i)\bstateful\s+entit(y|ies)\b(?!\s+(Business|Technical))",
        "replacement": "Business Stateful Entity or Technical Stateful Entity",
        "severity": "INFO",
        "description": "Verify if Business or Technical type is specified",
        "check_files": [".cursor/rules/*.mdc"]
    },
    "backend/": {
        "pattern": r"\bbackend/",
        "replacement": "apps/api/",
        "severity": "ERROR",
        "description": "Use monorepo structure: 'backend/' → 'apps/api/'"
    },
    "major": {
        "pattern": r"(?i)\b(major\s+action|major\s+decision|major\s+change)\b",
        "replacement": "MAD",
        "severity": "WARNING",
        "description": "Use 'MAD' instead of 'major action/decision'"
    },
    "meaningful": {
        "pattern": r"(?i)\bmeaningful\s+(action|decision|change)\b",
        "replacement": "MAD",
        "severity": "WARNING",
        "description": "Use 'MAD' instead of 'meaningful action/decision'"
    }
}

# File extensions to check
CHECK_EXTENSIONS = {'.mdc', '.md', '.rego', '.yaml', '.yml', '.json'}

# Directories to exclude
EXCLUDE_DIRS = {'.git', 'node_modules', '__pycache__', '.venv', 'venv', 'dist', 'build'}

# Files to exclude from checks (historical documentation)
ALLOWLIST_FILES = {
    'docs/developer/Glossary Compliance Analysis.md',  # Historical record of migration
    'docs/developer/VeroField_Rules_2.1.md'  # May reference old terms in examples
}


def find_files(path, extensions=None, exclude_dirs=None):
    """Find all files with specified extensions in the given path."""
    if extensions is None:
        extensions = CHECK_EXTENSIONS
    if exclude_dirs is None:
        exclude_dirs = EXCLUDE_DIRS
    
    files = []
    path_obj = Path(path)
    
    if not path_obj.exists():
        print(f"Error: Path not found: {path}", file=sys.stderr)
        return files
    
    if path_obj.is_file():
        if path_obj.suffix in extensions:
            files.append(path_obj)
        return files
    
    for root, dirs, filenames in os.walk(path):
        # Exclude directories
        dirs[:] = [d for d in dirs if d not in exclude_dirs]
        
        for filename in filenames:
            filepath = Path(root) / filename
            if filepath.suffix in extensions:
                files.append(filepath)
    
    return files


def check_file(filepath, old_terms, fix=False):
    """Check a single file for old terminology."""
    violations = []
    
    # Check if file is in allowlist
    filepath_str = str(filepath).replace('\\', '/')
    for allowlist_file in ALLOWLIST_FILES:
        if allowlist_file in filepath_str:
            return []  # Skip allowlisted files
    
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
            lines = content.split('\n')
    except Exception as e:
        return [{
            "file": str(filepath),
            "line": 0,
            "severity": "ERROR",
            "message": f"Error reading file: {e}"
        }]
    
    for term_name, term_info in old_terms.items():
        pattern = term_info["pattern"]
        matches = list(re.finditer(pattern, content, re.MULTILINE))
        
        for match in matches:
            # Find line number
            line_num = content[:match.start()].count('\n') + 1
            line_content = lines[line_num - 1] if line_num <= len(lines) else ""
            
            violation = {
                "file": str(filepath),
                "line": line_num,
                "term": term_name,
                "severity": term_info["severity"],
                "message": term_info["description"],
                "match": match.group(0),
                "replacement": term_info.get("replacement", ""),
                "line_content": line_content.strip()
            }
            violations.append(violation)
            
            # Auto-fix if requested
            if fix and term_info.get("replacement"):
                content = content[:match.start()] + term_info["replacement"] + content[match.end():]
        
        # Write fixed content back if fix was applied
        if fix and violations:
            try:
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(content)
            except Exception as e:
                violations.append({
                    "file": str(filepath),
                    "line": 0,
                    "severity": "ERROR",
                    "message": f"Error writing fixed file: {e}"
                })
    
    return violations


def main():
    parser = argparse.ArgumentParser(
        description="Check for deprecated terminology in rule files"
    )
    parser.add_argument(
        '--path',
        default='.cursor/rules/',
        help='Path to check (default: .cursor/rules/)'
    )
    parser.add_argument(
        '--fix',
        action='store_true',
        help='Automatically fix simple replacements (use with caution)'
    )
    parser.add_argument(
        '--extensions',
        nargs='+',
        default=list(CHECK_EXTENSIONS),
        help=f'File extensions to check (default: {CHECK_EXTENSIONS})'
    )
    
    args = parser.parse_args()
    
    # Find all files to check
    files = find_files(args.path, set(args.extensions))
    
    if not files:
        print(f"No files found to check in {args.path}")
        return 0
    
    print(f"🔍 Checking {len(files)} file(s) for old terminology...")
    print(f"Path: {args.path}")
    if args.fix:
        print("⚠️  AUTO-FIX MODE ENABLED - Files will be modified!")
    print()
    
    all_violations = []
    error_count = 0
    warning_count = 0
    
    for filepath in files:
        violations = check_file(filepath, OLD_TERMINOLOGY, fix=args.fix)
        all_violations.extend(violations)
        
        for v in violations:
            if v["severity"] == "ERROR":
                error_count += 1
            elif v["severity"] == "WARNING":
                warning_count += 1
    
    # Group violations by file
    violations_by_file = {}
    for v in all_violations:
        filepath = v["file"]
        if filepath not in violations_by_file:
            violations_by_file[filepath] = []
        violations_by_file[filepath].append(v)
    
    # Print results
    if all_violations:
        print("=" * 80)
        print("OLD TERMINOLOGY VIOLATIONS DETECTED")
        print("=" * 80)
        print()
        
        for filepath, violations in sorted(violations_by_file.items()):
            print(f"📄 {filepath}")
            print(f"   Found {len(violations)} violation(s)")
            print()
            
            for v in sorted(violations, key=lambda x: x["line"]):
                severity_icon = "🔴" if v["severity"] == "ERROR" else "🟡"
                print(f"   {severity_icon} Line {v['line']}: [{v['severity']}] {v['term']}")
                print(f"      Message: {v['message']}")
                print(f"      Match: '{v['match']}'")
                if v.get("replacement"):
                    print(f"      Replacement: '{v['replacement']}'")
                if v.get("line_content"):
                    print(f"      Context: {v['line_content'][:80]}")
                print()
        
        print("=" * 80)
        print("SUMMARY")
        print("=" * 80)
        print(f"Total violations: {len(all_violations)}")
        print(f"  🔴 Errors: {error_count}")
        print(f"  🟡 Warnings: {warning_count}")
        print(f"Files affected: {len(violations_by_file)}")
        print()
        
        if args.fix:
            print("✅ Auto-fix applied. Please review changes before committing.")
        else:
            print("💡 Tip: Use --fix flag to automatically fix simple replacements.")
            print("   ⚠️  Review changes carefully before committing!")
        
        # Exit with error code if errors found
        if error_count > 0:
            return 1
    else:
        print("✅ No old terminology violations found!")
        return 0


if __name__ == "__main__":
    sys.exit(main())

