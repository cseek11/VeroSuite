#!/usr/bin/env python3
"""
List violations organized by file for review.
"""

import json
import re
from pathlib import Path
from collections import defaultdict

def main():
    """List violations organized by file."""
    session_file = Path('.cursor/enforcement/session.json')
    
    if not session_file.exists():
        print("Error: session.json not found")
        return
    
    with open(session_file, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    # Filter for historical BLOCKED violations
    # Option 1: All historical violations
    all_historical_blocked = [
        v for v in data.get('violations', [])
        if v.get('severity') == 'BLOCKED' and v.get('session_scope') == 'historical'
    ]
    
    # Option 2: Only violations in modified files (matches AGENT_STATUS.md)
    historical_blocked = [
        v for v in all_historical_blocked
        if 'modified line' in v.get('message', '') or 'Last Updated' in v.get('message', '')
    ]
    
    print(f"**Note:** Showing violations in modified files only (matches AGENT_STATUS.md)\n")
    print(f"**Total historical violations in codebase:** {len(all_historical_blocked)}\n")
    print(f"**Historical violations in modified files:** {len(historical_blocked)}\n")
    
    # Group by file
    by_file = defaultdict(list)
    for v in historical_blocked:
        file_path = v.get('file_path', v.get('file', 'Unknown'))
        by_file[file_path].append(v)
    
    # Sort by violation count (descending)
    sorted_files = sorted(by_file.items(), key=lambda x: len(x[1]), reverse=True)
    
    print(f"# Historical Violations Summary\n")
    print(f"**Total Historical BLOCKED Violations:** {len(historical_blocked)}\n")
    print(f"**Total Files Affected:** {len(by_file)}\n")
    print("---\n")
    
    # Group by directory for better organization
    by_dir = defaultdict(list)
    for file_path, violations in sorted_files:
        # Extract directory
        path_obj = Path(file_path)
        try:
            rel_path = path_obj.relative_to(Path.cwd())
            dir_path = str(rel_path.parent) if rel_path.parent != Path('.') else 'root'
        except ValueError:
            dir_path = str(path_obj.parent) if path_obj.parent != Path('.') else 'root'
        
        by_dir[dir_path].append((file_path, violations))
    
    # Print organized by directory (top 30 files)
    printed_dirs = set()
    max_files = 30
    
    for file_path, violations in sorted_files[:max_files]:
        # Extract directory
        path_obj = Path(file_path)
        try:
            rel_path = path_obj.relative_to(Path.cwd())
            dir_path = str(rel_path.parent) if rel_path.parent != Path('.') else 'root'
            display_path = str(rel_path)
        except ValueError:
            dir_path = str(path_obj.parent) if path_obj.parent != Path('.') else 'root'
            display_path = file_path
        
        if dir_path not in printed_dirs:
            print(f"## {dir_path}\n")
            printed_dirs.add(dir_path)
        
        print(f"### {display_path}")
        print(f"**Violations:** {len(violations)}\n")
        
        # Show date range
        dates = set()
        for v in violations:
            message = v.get('message', '')
            date_match = re.search(r'(\d{4}-\d{2}-\d{2})', message)
            if date_match:
                dates.add(date_match.group(1))
        
        if dates:
            print(f"**Dates Found:** {', '.join(sorted(dates))}\n")
        
        # Show first few violations as examples
        print("**Sample Violations:**\n")
        for i, v in enumerate(violations[:3], 1):
            line = v.get('line_number', v.get('line', '?'))
            message = v.get('message', 'No message')
            print(f"{i}. Line {line}: {message}")
        
        if len(violations) > 3:
            print(f"\n*... and {len(violations) - 3} more violations in this file.*\n")
        else:
            print()
        
        print("---\n")
    
    if len(sorted_files) > max_files:
        print(f"\n*... and {len(sorted_files) - max_files} more files with violations.*\n")

if __name__ == '__main__':
    main()
