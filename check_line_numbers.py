#!/usr/bin/env python3
"""Check if line_number is now being saved correctly."""
import json
from pathlib import Path

report_file = Path('.cursor/enforcement/ENFORCER_REPORT.json')
if report_file.exists():
    with open(report_file, 'r') as f:
        data = json.load(f)
    
    violations = data.get('violations', [])
    date_violations = [v for v in violations if '02-core' in v.get('rule_ref', '')]
    
    print(f'Total date violations: {len(date_violations)}')
    
    na_violations = [v for v in date_violations if not v.get('line_number') or str(v.get('line_number', '')).upper() == 'N/A']
    print(f'Violations with N/A line numbers: {len(na_violations)}')
    print(f'Percentage with N/A: {len(na_violations)/len(date_violations)*100:.1f}%' if date_violations else '0%')
    
    valid_violations = [v for v in date_violations if v.get('line_number') and str(v.get('line_number', '')).upper() != 'N/A']
    print(f'Violations with valid line numbers: {len(valid_violations)}')
    
    if valid_violations:
        sample = valid_violations[0]
        print(f'\nSample valid violation:')
        print(f'  File: {sample.get("file")}')
        print(f'  Line number: {sample.get("line_number")}')
        print(f'  Description: {sample.get("description", "")[:80]}')
    
    if na_violations:
        sample = na_violations[0]
        print(f'\nSample N/A violation:')
        print(f'  File: {sample.get("file")}')
        print(f'  Line number: {repr(sample.get("line_number"))}')
        print(f'  Description: {sample.get("description", "")[:80]}')
else:
    print('Report file not found')










