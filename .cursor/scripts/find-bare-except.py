#!/usr/bin/env python3
"""Find exact locations of bare except clause warnings"""

import json
from pathlib import Path

session_file = Path('.cursor/enforcement/session.json')
data = json.load(session_file.open('r', encoding='utf-8'))

warnings = [
    v for v in data.get('violations', [])
    if v.get('rule_ref') == 'python_bible.mdc' and v.get('severity') == 'warning'
]

print('Python Bible Warnings - Bare Except Clauses:')
print('=' * 80)

for i, v in enumerate(warnings, 1):
    file_path = v.get('file_path', 'unknown')
    line_num = v.get('line_number', 'unknown')
    message = v.get('message', 'unknown')
    
    print(f'\n{i}. File: {Path(file_path).name}')
    print(f'   Full Path: {file_path}')
    print(f'   Line: {line_num}')
    print(f'   Message: {message}')
    
    # Show context
    if line_num and line_num != 'None':
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                lines = f.readlines()
                line_idx = int(line_num) - 1
                if 0 <= line_idx < len(lines):
                    start = max(0, line_idx - 2)
                    end = min(len(lines), line_idx + 3)
                    print(f'\n   Context (lines {start+1}-{end}):')
                    for j in range(start, end):
                        marker = '>>>' if j == line_idx else '   '
                        print(f'   {marker} {j+1:4d}: {lines[j].rstrip()}')
        except Exception as e:
            print(f'   (Could not read file: {e})')















