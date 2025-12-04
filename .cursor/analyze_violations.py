import json
from collections import Counter
from pathlib import Path

# Read the enforcer report
report_file = Path('.cursor/enforcement/ENFORCER_REPORT.json')
with open(report_file, 'r', encoding='utf-8') as f:
    data = json.load(f)

violations = data.get('violations', [])
rule_refs = [v.get('rule_ref', 'unknown') for v in violations]
counts = Counter(rule_refs)

print('Warnings by Type:')
print('=' * 60)
print(f'{'Rule Reference':<40} {'Count':>6}')
print('-' * 60)

total = 0
for rule_ref, count in sorted(counts.items(), key=lambda x: -x[1]):
    print(f'{rule_ref:<40} {count:>6}')
    total += count

print('-' * 60)
print(f'{'TOTAL':<40} {total:>6}')

