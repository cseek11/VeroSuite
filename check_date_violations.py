import json
from pathlib import Path

report_file = Path('.cursor/enforcement/ENFORCER_REPORT.json')

if not report_file.exists():
    print(f"Error: {report_file} not found.")
    exit(1)

with open(report_file, 'r', encoding='utf-8') as f:
    data = json.load(f)

all_violations = data.get('violations', [])
date_violations = [v for v in all_violations if '02-core' in v.get('rule_ref', '')]
current_session_date = [v for v in date_violations if v.get('session_scope') == 'current_session']
historical_date = [v for v in date_violations if v.get('session_scope') == 'historical']

print(f'Total violations: {len(all_violations)}')
print(f'Date violations (02-core.mdc): {len(date_violations)}')
print(f'  Current session: {len(current_session_date)}')
print(f'  Historical: {len(historical_date)}')

# Sample a few violations to see their details
if date_violations:
    print(f'\nSample violations (first 5):')
    for i, v in enumerate(date_violations[:5], 1):
        print(f'  {i}. {v.get("file")}:{v.get("line_number")} - {v.get("description", "")[:80]}')









