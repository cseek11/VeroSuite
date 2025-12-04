import json
from collections import Counter
from pathlib import Path

# Read the enforcer report
report_file = Path('.cursor/enforcement/ENFORCER_REPORT.json')
with open(report_file, 'r', encoding='utf-8') as f:
    data = json.load(f)

violations = data.get('violations', [])

# Group by rule_ref and description
by_rule = {}
for v in violations:
    rule_ref = v.get('rule_ref', 'unknown')
    # Use 'description' field (not 'message')
    description = v.get('description', v.get('message', 'unknown'))
    if rule_ref not in by_rule:
        by_rule[rule_ref] = Counter()
    by_rule[rule_ref][description] += 1

print('Warnings by Type and Message:')
print('=' * 70)
print()

total = 0
for rule_ref in sorted(by_rule.keys()):
    messages = by_rule[rule_ref]
    rule_total = sum(messages.values())
    total += rule_total
    
    print(f'{rule_ref} ({rule_total} total):')
    print('-' * 70)
    for message, count in sorted(messages.items(), key=lambda x: -x[1]):
        # Truncate long messages
        msg_display = message[:60] + '...' if len(message) > 60 else message
        print(f'  {msg_display:<60} {count:>4}')
    print()

print('=' * 70)
print(f'TOTAL: {total} warnings')
print()
print(f'Actual violations in report: {len(violations)}')
print(f'Report status: {data.get("status", "unknown")}')

