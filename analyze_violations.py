import json
from collections import Counter

# Load the violation report
with open('.cursor/enforcement/ENFORCER_REPORT.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

violations = data.get('violations', [])

# Count by violation ID
violation_ids = Counter(v.get('id', 'unknown') for v in violations)

# Count by rule reference
rule_refs = Counter(v.get('rule_ref', 'unknown') for v in violations)

# Count by severity
severities = Counter(v.get('severity', 'unknown') for v in violations)

print("=" * 60)
print("VIOLATION TYPE SUMMARY")
print("=" * 60)
print(f"\nTotal Violations: {len(violations)}")
print(f"Blocking: {data['summary']['blocking_count']}")
print(f"Warnings: {data['summary']['warning_count']}")

print("\n" + "=" * 60)
print("VIOLATION TYPES BY ID (Violation Code)")
print("=" * 60)
for vid, count in violation_ids.most_common():
    print(f"  {vid}: {count:,} violations")

print("\n" + "=" * 60)
print("VIOLATION TYPES BY RULE REFERENCE")
print("=" * 60)
for rule, count in rule_refs.most_common():
    print(f"  {rule}: {count:,} violations")

print("\n" + "=" * 60)
print("VIOLATION TYPES BY SEVERITY")
print("=" * 60)
for severity, count in severities.most_common():
    print(f"  {severity}: {count:,} violations")
