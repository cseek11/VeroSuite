"""
Test suite for modular checkers.

Python Bible Chapter 14: Testing best practices.
"""

import sys
from pathlib import Path
from typing import List

# Add project root to path
project_root = Path(__file__).parent.parent.parent.parent
sys.path.insert(0, str(project_root))
sys.path.insert(0, str(project_root / ".cursor"))

from enforcement.checkers import (
    BaseChecker,
    CheckerResult,
    CheckerStatus,
    get_all_checker_classes,
    CheckerRouter,
    EnforcementChecker,
    CoreChecker,
    SecurityChecker,
)


def test_checker_registry():
    """Test that all checkers are registered."""
    print("Testing checker registry...")
    checkers = get_all_checker_classes()
    
    expected_checkers = [
        '00-master.mdc',
        '01-enforcement.mdc',
        '02-core.mdc',
        '03-security.mdc',
        '04-architecture.mdc',
        '05-data.mdc',
        '06-error-resilience.mdc',
        '07-observability.mdc',
        '08-backend.mdc',
        '09-frontend.mdc',
        '10-quality.mdc',
        '11-operations.mdc',
        '12-tech-debt.mdc',
        '13-ux-consistency.mdc',
        '14-verification.mdc',
        'python_bible.mdc',
        'typescript_bible.mdc',
    ]
    
    for rule_ref in expected_checkers:
        if rule_ref not in checkers:
            print(f"  ❌ Missing checker: {rule_ref}")
            return False
        print(f"  ✓ Found checker: {rule_ref}")
    
    print("  ✓ All checkers registered\n")
    return True


def test_checker_instantiation():
    """Test that checkers can be instantiated."""
    print("Testing checker instantiation...")
    project_root = Path(__file__).parent.parent.parent.parent
    rules_dir = project_root / ".cursor" / "enforcement" / "rules"
    
    checkers = get_all_checker_classes()
    
    for rule_ref, checker_class in checkers.items():
        rule_file = rules_dir / rule_ref
        if not rule_file.exists():
            print(f"  ⚠ Skipping {rule_ref} (rule file not found)")
            continue
        
        try:
            checker = checker_class(
                project_root=project_root,
                rule_file=rule_file,
                rule_ref=rule_ref,
                always_apply=False
            )
            print(f"  ✓ Instantiated: {rule_ref}")
        except Exception as e:
            print(f"  ❌ Failed to instantiate {rule_ref}: {e}")
            return False
    
    print("  ✓ All checkers instantiated successfully\n")
    return True


def test_checker_execution():
    """Test that checkers can execute without errors."""
    print("Testing checker execution...")
    project_root = Path(__file__).parent.parent.parent.parent
    rules_dir = project_root / ".cursor" / "enforcement" / "rules"
    
    # Test with empty file list (should not error)
    test_files: List[str] = []
    
    # Test a few key checkers
    test_checkers = [
        ('01-enforcement.mdc', EnforcementChecker),
        ('02-core.mdc', CoreChecker),
        ('03-security.mdc', SecurityChecker),
    ]
    
    for rule_ref, checker_class in test_checkers:
        rule_file = rules_dir / rule_ref
        if not rule_file.exists():
            print(f"  ⚠ Skipping {rule_ref} (rule file not found)")
            continue
        
        try:
            checker = checker_class(
                project_root=project_root,
                rule_file=rule_file,
                rule_ref=rule_ref,
                always_apply=True
            )
            
            result = checker.check(test_files)
            
            if not isinstance(result, CheckerResult):
                print(f"  ❌ {rule_ref} returned invalid result type")
                return False
            
            print(f"  ✓ {rule_ref} executed: {result.status.value}")
        except Exception as e:
            print(f"  ❌ {rule_ref} execution failed: {e}")
            import traceback
            traceback.print_exc()
            return False
    
    print("  ✓ All test checkers executed successfully\n")
    return True


def test_checker_router():
    """Test checker router functionality."""
    print("Testing checker router...")
    project_root = Path(__file__).parent.parent.parent.parent
    rules_dir = project_root / ".cursor" / "enforcement" / "rules"
    
    if not rules_dir.exists():
        print("  ⚠ Rules directory not found, skipping router test")
        return True
    
    try:
        router = CheckerRouter(project_root, rules_dir)
        checkers = get_all_checker_classes()
        
        # Test with some changed files
        changed_files = [
            'apps/api/src/test.ts',
            'frontend/src/components/Test.tsx',
            '.cursor/memory-bank/activeContext.md',
        ]
        
        checkers_to_run = router.get_checkers_to_run(changed_files, checkers)
        
        print(f"  ✓ Router selected {len(checkers_to_run)} checkers to run")
        
        # Should run always_apply checkers
        always_apply_count = sum(1 for c in checkers_to_run if c.always_apply)
        print(f"  ✓ Found {always_apply_count} always_apply checkers")
        
    except Exception as e:
        print(f"  ❌ Router test failed: {e}")
        import traceback
        traceback.print_exc()
        return False
    
    print("  ✓ Router test passed\n")
    return True


def run_all_tests():
    """Run all tests."""
    print("=" * 60)
    print("Modular Checker Test Suite")
    print("=" * 60)
    print()
    
    tests = [
        ("Checker Registry", test_checker_registry),
        ("Checker Instantiation", test_checker_instantiation),
        ("Checker Execution", test_checker_execution),
        ("Checker Router", test_checker_router),
    ]
    
    results = []
    for test_name, test_func in tests:
        try:
            result = test_func()
            results.append((test_name, result))
        except Exception as e:
            print(f"  ❌ Test '{test_name}' crashed: {e}")
            import traceback
            traceback.print_exc()
            results.append((test_name, False))
    
    print("=" * 60)
    print("Test Results Summary")
    print("=" * 60)
    
    passed = sum(1 for _, result in results if result)
    total = len(results)
    
    for test_name, result in results:
        status = "✓ PASS" if result else "❌ FAIL"
        print(f"{status}: {test_name}")
    
    print()
    print(f"Total: {passed}/{total} tests passed")
    
    return passed == total


if __name__ == "__main__":
    success = run_all_tests()
    sys.exit(0 if success else 1)




