#!/usr/bin/env python3
"""
Diagnostic script to investigate why violations are marked as current_session.

This script will:
1. Check session start time
2. Check file modification times vs session start
3. Check git diff to see what was actually changed
4. Show examples of violations and why they're categorized incorrectly
"""

import json
import re
from pathlib import Path
from datetime import datetime, timezone
import subprocess

def run_git_command(args):
    """Run git command and return output."""
    try:
        result = subprocess.run(
            ['git'] + args,
            capture_output=True,
            text=True,
            cwd=Path.cwd()
        )
        return result.stdout.strip() if result.returncode == 0 else ""
    except Exception:
        return ""

def get_changed_files():
    """Get list of changed files from git."""
    staged = run_git_command(['diff', '--cached', '--name-only'])
    unstaged = run_git_command(['diff', '--name-only'])
    
    files = set()
    if staged:
        files.update(staged.split('\n'))
    if unstaged:
        files.update(unstaged.split('\n'))
    
    untracked = run_git_command(['ls-files', '--others', '--exclude-standard'])
    if untracked:
        files.update(untracked.split('\n'))
    
    return sorted([f for f in files if f.strip()])

def get_file_diff(file_path):
    """Get git diff for a specific file."""
    tracked = run_git_command(['ls-files', '--error-unmatch', file_path])
    if not tracked:
        return None
    
    staged_diff = run_git_command(['diff', '--cached', file_path])
    unstaged_diff = run_git_command(['diff', file_path])
    
    combined_diff = ""
    if staged_diff:
        combined_diff += staged_diff
    if unstaged_diff:
        if combined_diff:
            combined_diff += "\n"
        combined_diff += unstaged_diff
    
    return combined_diff if combined_diff else None

def is_line_in_diff(diff, line_number):
    """Check if a line number is in the git diff."""
    if not diff:
        return False
    
    for line in diff.split('\n'):
        if line.startswith('@@'):
            match = re.search(r'\+(\d+)(?:,(\d+))?', line)
            if match:
                new_start = int(match.group(1))
                new_count = int(match.group(2)) if match.group(2) else 1
                new_end = new_start + new_count - 1
                
                if new_start <= line_number <= new_end:
                    return True
    
    return False

def main():
    """Main diagnostic function."""
    print("=" * 80)
    print("VIOLATION CATEGORIZATION DIAGNOSTIC")
    print("=" * 80)
    print()
    
    # Load session
    session_file = Path('.cursor/enforcement/session.json')
    if not session_file.exists():
        print("ERROR: session.json not found")
        return
    
    session = json.loads(session_file.read_text())
    session_start = datetime.fromisoformat(session['start_time'].replace('Z', '+00:00'))
    
    print(f"Session Start: {session_start.isoformat()}")
    print(f"Current Date: {datetime.now().strftime('%Y-%m-%d')}")
    print()
    
    # Load violations from AGENT_STATUS.md
    status_file = Path('.cursor/enforcement/AGENT_STATUS.md')
    if not status_file.exists():
        print("ERROR: AGENT_STATUS.md not found")
        return
    
    status_content = status_file.read_text(encoding='utf-8', errors='ignore')
    
    # Extract violation examples
    print("=" * 80)
    print("SAMPLE VIOLATIONS ANALYSIS")
    print("=" * 80)
    print()
    
    # Find first 5 violations
    violation_pattern = r'- \*\*02-core\.mdc\*\*: (.+?) \(`(.+?)`:(\d+)\)'
    violations = re.findall(violation_pattern, status_content)
    
    print(f"Found {len(violations)} violations in status file")
    print()
    
    # Analyze first 10 violations
    for i, (message, file_path, line_num) in enumerate(violations[:10], 1):
        print(f"\n{'='*80}")
        print(f"VIOLATION {i}: {file_path}:{line_num}")
        print(f"{'='*80}")
        print(f"Message: {message}")
        print()
        
        # Check if file exists
        full_path = Path(file_path)
        if not full_path.exists():
            print(f"❌ File does not exist: {file_path}")
            continue
        
        # Check file modification time
        file_mtime = datetime.fromtimestamp(full_path.stat().st_mtime, tz=timezone.utc)
        print(f"File modified: {file_mtime.isoformat()}")
        print(f"Session started: {session_start.isoformat()}")
        print(f"File modified AFTER session start: {file_mtime >= session_start}")
        print()
        
        # Check if file is in changed_files
        changed_files = get_changed_files()
        is_in_changed = file_path in changed_files
        print(f"File in changed_files: {is_in_changed}")
        
        # Check if file is tracked
        tracked = run_git_command(['ls-files', '--error-unmatch', file_path])
        is_tracked = bool(tracked)
        print(f"File is tracked: {is_tracked}")
        print()
        
        # Check git diff
        diff = get_file_diff(file_path)
        has_diff = diff is not None
        print(f"File has git diff: {has_diff}")
        
        if has_diff:
            # Check if the specific line is in the diff
            line_num_int = int(line_num)
            line_in_diff = is_line_in_diff(diff, line_num_int)
            print(f"Line {line_num} is in diff: {line_in_diff}")
            
            if not line_in_diff:
                print(f"⚠️  PROBLEM: Line {line_num} is NOT in the git diff, but violation was created!")
                print(f"   This means the line was NOT changed, but the system thinks it was.")
                print()
                # Show the actual line
                try:
                    with open(full_path, 'r', encoding='utf-8', errors='ignore') as f:
                        lines = f.readlines()
                        if line_num_int <= len(lines):
                            print(f"   Line {line_num} content: {lines[line_num_int - 1].rstrip()}")
                except Exception as e:
                    print(f"   Could not read line: {e}")
        
        print()
        
        # Check the date in the violation message
        date_match = re.search(r'(\d{4}-\d{2}-\d{2})', message)
        if date_match:
            found_date = date_match.group(1)
            current_date = datetime.now().strftime('%Y-%m-%d')
            print(f"Date found in violation: {found_date}")
            print(f"Current date: {current_date}")
            print(f"Date is current: {found_date == current_date}")
        
        print()
    
    print("=" * 80)
    print("SUMMARY")
    print("=" * 80)
    print()
    print("Key Findings:")
    print("1. Check if files were modified AFTER session start")
    print("2. Check if specific lines with dates are actually in git diff")
    print("3. Check if is_file_modified_in_session() is correctly checking file mtime for tracked files")
    print()

if __name__ == "__main__":
    main()

