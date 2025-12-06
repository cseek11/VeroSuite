#!/usr/bin/env python3
"""Simple file comparison script."""

import os
from pathlib import Path

# Critical files to check
critical_files = [
    '.cursor/enforcement/core/session_state.py',
    '.cursor/enforcement/core/violations.py',
    '.cursor/enforcement/core/scope_evaluator.py',
    '.cursor/enforcement/core/git_utils.py',
    '.cursor/enforcement/core/file_scanner.py',
    '.cursor/enforcement/core/__init__.py',
    '.cursor/enforcement/reporting/status_generator.py',
    '.cursor/enforcement/reporting/violations_logger.py',
    '.cursor/enforcement/reporting/block_generator.py',
    '.cursor/enforcement/reporting/context_bundle_builder.py',
    '.cursor/enforcement/reporting/two_brain_reporter.py',
    '.cursor/enforcement/reporting/__init__.py',
    '.cursor/enforcement/checks/date_checker.py',
    '.cursor/enforcement/checks/security_checker.py',
    '.cursor/enforcement/checks/memory_bank_checker.py',
    '.cursor/enforcement/checks/error_handling_checker.py',
    '.cursor/enforcement/checks/logging_checker.py',
    '.cursor/enforcement/checks/python_bible_checker.py',
    '.cursor/enforcement/checks/bug_logging_checker.py',
    '.cursor/enforcement/checks/context_checker.py',
    '.cursor/enforcement/checks/__init__.py',
]

print("=" * 80)
print("CRITICAL FILES CHECK")
print("=" * 80)
print()

issues = []
ok_count = 0

for file_path in critical_files:
    if os.path.exists(file_path):
        size = os.path.getsize(file_path)
        try:
            with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                lines = len(f.readlines())
        except Exception:
            lines = 0
        
        if size == 0:
            print(f"❌ EMPTY: {file_path}")
            issues.append((file_path, "EMPTY", size, lines))
        elif size < 100:  # Very small files might be suspicious
            print(f"⚠️  SMALL: {file_path} ({size} bytes, {lines} lines)")
            issues.append((file_path, "SMALL", size, lines))
        else:
            print(f"✅ OK: {file_path} ({size} bytes, {lines} lines)")
            ok_count += 1
    else:
        print(f"❌ MISSING: {file_path}")
        issues.append((file_path, "MISSING", 0, 0))

print()
print("=" * 80)
print("SUMMARY")
print("=" * 80)
print(f"Files checked: {len(critical_files)}")
print(f"OK: {ok_count}")
print(f"Issues: {len(issues)}")
print()

if issues:
    print("ISSUES FOUND:")
    for file_path, issue_type, size, lines in issues:
        print(f"  {issue_type:8} {file_path} ({size} bytes, {lines} lines)")
else:
    print("✅ All critical files are present and have content")















