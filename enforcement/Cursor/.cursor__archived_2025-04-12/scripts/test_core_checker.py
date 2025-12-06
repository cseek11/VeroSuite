#!/usr/bin/env python3
"""
Test script to diagnose why core checker isn't running.
"""

import sys
from pathlib import Path

# Add project root to path
project_root = Path(__file__).parent.parent.parent
sys.path.insert(0, str(project_root))
sys.path.insert(0, str(project_root / ".cursor"))

from enforcement.checkers.checker_registry import get_all_checker_classes
from enforcement.checkers.checker_router import CheckerRouter

def test_core_checker():
    """Test if core checker is available and would be selected."""
    print("=" * 60)
    print("Testing Core Checker Availability")
    print("=" * 60)
    
    # Get available checkers
    available_checkers = get_all_checker_classes()
    print(f"\nTotal checkers in registry: {len(available_checkers)}")
    print(f"02-core.mdc in registry: {'02-core.mdc' in available_checkers}")
    
    if '02-core.mdc' in available_checkers:
        print(f"Core checker class: {available_checkers['02-core.mdc']}")
    
    # Test router
    rules_dir = project_root / ".cursor" / "enforcement" / "rules"
    print(f"\nRules directory exists: {rules_dir.exists()}")
    print(f"Rules directory: {rules_dir}")
    
    if rules_dir.exists():
        router = CheckerRouter(project_root, rules_dir)
        
        # Test with a sample changed file
        changed_files = [".cursor/scripts/logger_util.py"]
        checkers_to_run = router.get_checkers_to_run(changed_files, available_checkers)
        
        print(f"\nCheckers selected to run: {len(checkers_to_run)}")
        
        core_checker = None
        for checker in checkers_to_run:
            print(f"  - {checker.rule_ref} (always_apply: {checker.always_apply})")
            if checker.rule_ref == '02-core.mdc':
                core_checker = checker
        
        if core_checker:
            print(f"\n✅ Core checker IS selected!")
            print(f"   Always apply: {core_checker.always_apply}")
            
            # Try to run it
            print("\nAttempting to run core checker...")
            try:
                result = core_checker.check(changed_files)
                print(f"   Status: {result.status.value}")
                print(f"   Violations found: {len(result.violations)}")
                print(f"   Files checked: {result.files_checked}")
                
                if result.violations:
                    print("\n   Violations:")
                    for v in result.violations[:5]:  # Show first 5
                        print(f"     - {v.get('message', 'N/A')} in {v.get('file_path', 'N/A')}")
                else:
                    print("   ⚠️  No violations found (this might be the issue)")
                    
            except Exception as e:
                print(f"   ❌ Error running checker: {e}")
                import traceback
                traceback.print_exc()
        else:
            print(f"\n❌ Core checker NOT selected!")
            
            # Check why
            rule_file = rules_dir / "02-core.mdc"
            if rule_file.exists():
                print(f"\nRule file exists: {rule_file}")
                from enforcement.checkers.rule_metadata import get_rule_metadata
                try:
                    metadata = get_rule_metadata(rule_file)
                    print(f"Metadata: {metadata}")
                    print(f"alwaysApply: {metadata.get('alwaysApply', 'NOT SET')}")
                except Exception as e:
                    print(f"Error reading metadata: {e}")

if __name__ == "__main__":
    test_core_checker()



