"""Analyze ENFORCER_REPORT.json for test-violations bundle."""

import json
from pathlib import Path

report_path = Path(__file__).parent.parent / 'ENFORCER_REPORT.json'

with open(report_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

violations = data.get('violations', [])
test_violations = [v for v in violations if 'test-violations' in v.get('file', '').lower()]

print("=" * 70)
print("ENFORCER REPORT ANALYSIS - test-violations Bundle")
print("=" * 70)
print(f"\nTotal violations in test-violations files: {len(test_violations)}")
print()

# Group by rule_ref
by_rule = {}
for v in test_violations:
    rule = v.get('rule_ref', 'UNKNOWN')
    if rule not in by_rule:
        by_rule[rule] = []
    by_rule[rule].append(v)

print("Violations by Rule:")
print("-" * 70)
for rule, vs in sorted(by_rule.items()):
    print(f"\n{rule}: {len(vs)} violation(s)")
    for v in vs[:3]:  # Show first 3
        print(f"  - {v.get('file')}:{v.get('evidence', [''])[0] if v.get('evidence') else 'N/A'}")
        print(f"    Message: {v.get('description', '')[:80]}...")
        print(f"    Fix hint: {v.get('fix_hint', 'N/A')[:80]}...")

print("\n" + "=" * 70)
print("CHECKLIST:")
print("=" * 70)

# Check for tenant isolation
tenant_violations = [v for v in test_violations if 'SEC-R01' in v.get('rule_ref', '') or 'tenant' in v.get('rule_ref', '').lower()]
print(f"\n✅ Tenant Isolation Violations: {len(tenant_violations)}")
if tenant_violations:
    for v in tenant_violations[:2]:
        print(f"   - {v.get('rule_ref')}: {v.get('description', '')[:60]}...")
else:
    print("   ⚠️  No tenant isolation violations found (expected from TenantIsolationChecker)")

# Check for secrets
secret_violations = [v for v in test_violations if 'SEC-R03' in v.get('rule_ref', '') or 'secret' in v.get('description', '').lower()]
print(f"\n✅ Secret Violations: {len(secret_violations)}")
if secret_violations:
    for v in secret_violations[:2]:
        print(f"   - {v.get('rule_ref')}: {v.get('description', '')[:60]}...")
else:
    print("   ⚠️  No secret violations found (expected from SecretScannerChecker)")

# Check for DTO violations
dto_violations = [v for v in test_violations if 'DTO' in v.get('rule_ref', '')]
print(f"\n✅ DTO Violations: {len(dto_violations)}")
for v in dto_violations[:2]:
    print(f"   - {v.get('rule_ref')}: {v.get('description', '')[:60]}...")

# Check for console.log violations
console_violations = [v for v in test_violations if 'observability' in v.get('rule_ref', '').lower() or 'console' in v.get('description', '').lower()]
print(f"\n✅ Console.log Violations: {len(console_violations)}")
for v in console_violations[:2]:
    print(f"   - {v.get('rule_ref')}: {v.get('description', '')[:60]}...")

# Check for backend patterns
pattern_violations = [v for v in test_violations if 'PATTERN' in v.get('rule_ref', '') or 'pattern' in v.get('rule_ref', '').lower()]
print(f"\n✅ Backend Pattern Violations: {len(pattern_violations)}")
for v in pattern_violations[:2]:
    print(f"   - {v.get('rule_ref')}: {v.get('description', '')[:60]}...")

# Check SecurityChecker (should be minimal)
security_checker_violations = [v for v in test_violations if '03-security.mdc' in v.get('rule_ref', '') and 'SEC-R01' not in v.get('rule_ref', '')]
print(f"\n✅ SecurityChecker Violations (non-tenant): {len(security_checker_violations)}")
if security_checker_violations:
    for v in security_checker_violations[:2]:
        print(f"   - {v.get('rule_ref')}: {v.get('description', '')[:60]}...")
else:
    print("   ✅ No SecurityChecker violations (expected - it's monitoring-only now)")

print("\n" + "=" * 70)
print("FIX HINT QUALITY CHECK:")
print("=" * 70)

# Sample violations for fix hint check
sample_violations = {
    'tenant': tenant_violations[0] if tenant_violations else None,
    'secret': secret_violations[0] if secret_violations else None,
    'dto': dto_violations[0] if dto_violations else None,
    'console': console_violations[0] if console_violations else None,
    'pattern': pattern_violations[0] if pattern_violations else None,
}

for vtype, v in sample_violations.items():
    if v:
        print(f"\n{vtype.upper()} Violation Sample:")
        print(f"  Rule: {v.get('rule_ref')}")
        print(f"  Message: {v.get('description', '')[:80]}...")
        print(f"  Fix Hint: {v.get('fix_hint', 'N/A')[:100]}...")
        # Check if fix hint is actionable
        hint = v.get('fix_hint', '')
        if hint and len(hint) > 20 and ('should' in hint.lower() or 'add' in hint.lower() or 'use' in hint.lower() or 'replace' in hint.lower()):
            print("  ✅ Fix hint is actionable")
        else:
            print("  ⚠️  Fix hint may not be actionable")




