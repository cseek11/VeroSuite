#!/usr/bin/env python3
"""Debug script to test date checker logic."""
import json
from pathlib import Path
from enforcement.date_detector import DocumentContext
from enforcement.core.scope_evaluator import is_log_file

# Read violations
with open('.cursor/enforcement/ENFORCER_REPORT.json', 'r') as f:
    data = json.load(f)

# Get date violations (02-core.mdc rule)
date_violations = [v for v in data.get('violations', []) if '02-core' in v.get('rule_ref', '')]
memory_bank_date_violations = [v for v in date_violations if 'memory_bank' in v.get('file', '') or 'memory-bank' in v.get('file', '')]

print(f'Total date violations (02-core.mdc): {len(date_violations)}')
print(f'Memory bank DATE violations: {len(memory_bank_date_violations)}')
print(f'\nFirst 5 memory bank DATE violations:')
for v in memory_bank_date_violations[:5]:
    file_path = v.get('file', '')
    msg = v.get('message', '')
    line = v.get('line_number', 'N/A')
    print(f"  - {file_path}:{line}")
    print(f"    Message: {msg[:100]}")

# Test detection with actual file paths from violations
print(f'\n\nTesting log file detection with violation file paths:')
test_files = set()
for v in memory_bank_date_violations[:5]:
    file_path = v.get('file', '').replace('\\', '/').replace('VeroField/', '')
    if file_path.startswith('./'):
        file_path = file_path[2:]
    if file_path:
        test_files.add(file_path)

for f in sorted(test_files):
    p = Path(f)
    if p.exists():
        ctx = DocumentContext(p)
        is_log = is_log_file(p)
        print(f'{f}:')
        print(f'  DocumentContext.is_log_file: {ctx.is_log_file}')
        print(f'  is_log_file(): {is_log}')
        print(f'  Should be skipped: {"YES" if ctx.is_log_file or is_log else "NO"}')
        print()

