#!/usr/bin/env python3
"""Compare working directory files to git to detect missing or corrupted files."""

import os
import subprocess
from pathlib import Path
from typing import List, Tuple, Dict

def get_git_files(directory: str) -> List[str]:
    """Get all files tracked by git in the directory."""
    result = subprocess.run(
        ['git', 'ls-files', directory],
        capture_output=True,
        text=True,
        cwd=Path.cwd()
    )
    if result.returncode != 0:
        return []
    return [f.strip() for f in result.stdout.split('\n') if f.strip()]

def get_file_info(file_path: str) -> Tuple[int, int]:
    """Get file size and line count."""
    if not os.path.exists(file_path):
        return (0, 0)
    try:
        size = os.path.getsize(file_path)
        with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
            lines = len(f.readlines())
        return (size, lines)
    except Exception:
        return (0, 0)

def get_git_file_info(file_path: str, commit: str = 'HEAD') -> Tuple[int, int]:
    """Get file size and line count from git."""
    try:
        result = subprocess.run(
            ['git', 'show', f'{commit}:{file_path}'],
            capture_output=True,
            text=True,
            cwd=Path.cwd()
        )
        if result.returncode != 0:
            return (0, 0)
        content = result.stdout
        size = len(content.encode('utf-8'))
        lines = len(content.splitlines())
        return (size, lines)
    except Exception:
        return (0, 0)

def main():
    """Compare enforcement files to git."""
    enforcement_dir = '.cursor/enforcement'
    
    print("=" * 80)
    print("COMPARING ENFORCEMENT FILES TO GIT")
    print("=" * 80)
    print()
    
    # Get all git-tracked files in enforcement directory
    git_files = get_git_files(enforcement_dir)
    
    # Focus on Python files in core, reporting, and checks directories
    critical_dirs = ['core', 'reporting', 'checks']
    critical_files = [f for f in git_files if any(f'/enforcement/{d}/' in f for d in critical_dirs) and f.endswith('.py')]
    
    print(f"Found {len(critical_files)} critical Python files in git")
    print()
    
    issues = []
    checked = []
    
    for file_path in sorted(critical_files):
        if not file_path.endswith('.py'):
            continue
            
        checked.append(file_path)
        local_size, local_lines = get_file_info(file_path)
        git_size, git_lines = get_git_file_info(file_path)
        
        status = "OK"
        if not os.path.exists(file_path):
            status = "MISSING"
            issues.append((file_path, "MISSING", 0, 0, git_size, git_lines))
        elif local_size == 0 and git_size > 0:
            status = "EMPTY (corrupted)"
            issues.append((file_path, "EMPTY", local_size, local_lines, git_size, git_lines))
        elif local_size < git_size * 0.5:  # More than 50% smaller
            status = "SUSPICIOUS (much smaller)"
            issues.append((file_path, "SUSPICIOUS", local_size, local_lines, git_size, git_lines))
        elif local_lines == 0 and git_lines > 0:
            status = "EMPTY (0 lines)"
            issues.append((file_path, "EMPTY", local_size, local_lines, git_size, git_lines))
        
        if status != "OK":
            print(f"⚠️  {status:25} {file_path}")
            print(f"   Local:  {local_size:6} bytes, {local_lines:4} lines")
            print(f"   Git:    {git_size:6} bytes, {git_lines:4} lines")
            print()
    
    print("=" * 80)
    print("SUMMARY")
    print("=" * 80)
    print(f"Files checked: {len(checked)}")
    print(f"Issues found: {len(issues)}")
    print()
    
    if issues:
        print("ISSUES DETECTED:")
        for file_path, issue_type, local_size, local_lines, git_size, git_lines in issues:
            print(f"  {issue_type:12} {file_path}")
            print(f"    Local: {local_size} bytes, {local_lines} lines")
            print(f"    Git:   {git_size} bytes, {git_lines} lines")
    else:
        print("✅ No issues found - all files match git")
    
    # Also check session_state.py specifically
    session_state = '.cursor/enforcement/core/session_state.py'
    if session_state in git_files:
        local_size, local_lines = get_file_info(session_state)
        git_size, git_lines = get_git_file_info(session_state)
        print()
        print("=" * 80)
        print("SESSION_STATE.PY STATUS (previously restored)")
        print("=" * 80)
        print(f"Local: {local_size} bytes, {local_lines} lines")
        print(f"Git:   {git_size} bytes, {git_lines} lines")
        if local_size == git_size and local_lines == git_lines:
            print("✅ session_state.py matches git perfectly")
        else:
            print("⚠️  session_state.py size mismatch (may be expected if restored)")

if __name__ == '__main__':
    main()















