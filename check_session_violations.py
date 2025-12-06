#!/usr/bin/env python3
"""Check session violations structure."""
import json
from pathlib import Path

session_file = Path('.cursor/enforcement/session.json')
if session_file.exists():
    with open(session_file, 'r') as f:
        data = json.load(f)
    
    violations = data.get('violations', [])
    date_violations = [v for v in violations if '02-core' in v.get('rule_ref', '')]
    
    print(f'Total violations in session: {len(violations)}')
    print(f'Date violations (02-core): {len(date_violations)}')
    
    if date_violations:
        sample = date_violations[0]
        print(f'\nSample violation keys: {list(sample.keys())}')
        print(f'Sample line_number: {repr(sample.get("line_number"))}')
        print(f'Sample line_number type: {type(sample.get("line_number"))}')
        
        # Count N/A line numbers
        na_count = 0
        for v in date_violations:
            line_num = v.get('line_number')
            if line_num is None or line_num == "N/A" or str(line_num).upper() == "N/A":
                na_count += 1
        
        print(f'\nViolations with N/A line numbers: {na_count}/{len(date_violations)}')
        print(f'Percentage: {na_count/len(date_violations)*100:.1f}%')
else:
    print('Session file not found')










