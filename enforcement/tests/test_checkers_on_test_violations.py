"""
Test script to verify checkers detect violations in test-violations.service.ts
"""

import sys
from pathlib import Path

# Add project root to path
project_root = Path(__file__).parent.parent.parent.parent
sys.path.insert(0, str(project_root / '.cursor'))

from enforcement.checkers.tenant_isolation_checker import TenantIsolationChecker
from enforcement.checkers.secret_scanner_checker import SecretScannerChecker
from enforcement.checkers.dto_enforcement_checker import DtoEnforcementChecker

def test_tenant_isolation():
    """Test that tenant isolation checker detects violations."""
    print("Testing TenantIsolationChecker on test-violations.service.ts...")
    
    rule_file = project_root / '.cursor' / 'enforcement' / 'rules' / '03-security-tenant.mdc'
    checker = TenantIsolationChecker(
        project_root=project_root,
        rule_file=rule_file,
        rule_ref='03-security-tenant.mdc',
        always_apply=False
    )
    
    test_file = 'apps/api/src/test-violations/test-violations.service.ts'
    result = checker.check([test_file])
    
    print(f"  Status: {result.status.value}")
    print(f"  Violations found: {len(result.violations)}")
    
    if result.violations:
        print("  ✅ Tenant isolation violations detected!")
        for v in result.violations[:3]:  # Show first 3
            print(f"    - {v['rule_ref']}: {v['message'][:80]}...")
    else:
        print("  ❌ No tenant isolation violations detected (expected violations)")
    
    return len(result.violations) > 0

def test_secret_scanner():
    """Test that secret scanner detects violations."""
    print("\nTesting SecretScannerChecker on test-violations.service.ts...")
    
    rule_file = project_root / '.cursor' / 'enforcement' / 'rules' / '03-security-secrets.mdc'
    checker = SecretScannerChecker(
        project_root=project_root,
        rule_file=rule_file,
        rule_ref='03-security-secrets.mdc',
        always_apply=False
    )
    
    test_file = 'apps/api/src/test-violations/test-violations.service.ts'
    result = checker.check([test_file])
    
    print(f"  Status: {result.status.value}")
    print(f"  Violations found: {len(result.violations)}")
    
    if result.violations:
        print("  ✅ Secret violations detected!")
        for v in result.violations[:3]:  # Show first 3
            print(f"    - {v['rule_ref']}: {v['message'][:80]}...")
    else:
        print("  ❌ No secret violations detected (expected violations)")
    
    return len(result.violations) > 0

def test_dto_enforcement():
    """Test that DTO checker detects violations and has correct fix hints."""
    print("\nTesting DtoEnforcementChecker on test-violations.controller.ts...")
    
    rule_file = project_root / '.cursor' / 'enforcement' / 'rules' / '08-backend-dto.mdc'
    checker = DtoEnforcementChecker(
        project_root=project_root,
        rule_file=rule_file,
        rule_ref='08-backend-dto.mdc',
        always_apply=False
    )
    
    test_file = 'apps/api/src/test-violations/test-violations.controller.ts'
    result = checker.check([test_file])
    
    print(f"  Status: {result.status.value}")
    print(f"  Violations found: {len(result.violations)}")
    
    if result.violations:
        print("  ✅ DTO violations detected!")
        for v in result.violations:
            print(f"    - {v['rule_ref']}: {v['message'][:80]}...")
            fix_hint = v.get('fix_hint', '')
            if 'DTO' in fix_hint or 'dto' in fix_hint.lower() or 'class-validator' in fix_hint:
                print(f"      ✅ Fix hint is DTO-specific")
            else:
                print(f"      ❌ Fix hint is NOT DTO-specific: {fix_hint[:60]}...")
    else:
        print("  ❌ No DTO violations detected (expected violations)")
    
    return len(result.violations) > 0

if __name__ == '__main__':
    print("=" * 70)
    print("Checker Verification Test")
    print("=" * 70)
    print()
    
    results = {
        'tenant_isolation': test_tenant_isolation(),
        'secret_scanner': test_secret_scanner(),
        'dto_enforcement': test_dto_enforcement(),
    }
    
    print()
    print("=" * 70)
    print("Summary")
    print("=" * 70)
    for name, passed in results.items():
        status = "✅ PASS" if passed else "❌ FAIL"
        print(f"{status}: {name}")
    
    all_passed = all(results.values())
    if all_passed:
        print("\n🎉 All checkers working correctly!")
    else:
        print("\n⚠️  Some checkers need attention")

