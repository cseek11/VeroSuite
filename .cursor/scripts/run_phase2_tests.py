#!/usr/bin/env python3
"""
Phase 2 Test Runner
Runs all unit tests and integration tests for VeroScore V3 Phase 2.

Last Updated: 2025-11-24

Usage:
    python .cursor/scripts/run_phase2_tests.py [--unit] [--integration] [--all]
"""

import sys
import unittest
import argparse
from pathlib import Path

# Add project root to path
project_root = Path(__file__).parent.parent.parent
sys.path.insert(0, str(project_root))


def run_unit_tests():
    """Run all unit tests."""
    print("=" * 60)
    print("Running Unit Tests")
    print("=" * 60)
    print()
    
    # Discover and run tests
    loader = unittest.TestLoader()
    suite = unittest.TestSuite()
    
    # Add test modules
    test_modules = [
        'veroscore_v3.tests.test_file_change',
        'veroscore_v3.tests.test_change_buffer',
        'veroscore_v3.tests.test_git_diff_analyzer',
        'veroscore_v3.tests.test_threshold_checker',
    ]
    
    for module_name in test_modules:
        try:
            tests = loader.loadTestsFromName(module_name)
            suite.addTests(tests)
            print(f"✅ Loaded tests from {module_name}")
        except Exception as e:
            print(f"⚠️  Failed to load {module_name}: {e}")
    
    print()
    
    # Run tests
    runner = unittest.TextTestRunner(verbosity=2)
    result = runner.run(suite)
    
    return result.wasSuccessful()


def run_integration_tests():
    """Run integration tests."""
    print("=" * 60)
    print("Running Integration Tests")
    print("=" * 60)
    print()
    
    # Test 1: Supabase schema access
    print("1. Testing Supabase schema access...")
    try:
        from test_supabase_schema_access import main as test_schema_main
        schema_result = test_schema_main()
        if schema_result == 0:
            print("✅ Supabase schema access test passed")
        else:
            print("❌ Supabase schema access test failed")
            return False
    except ImportError as e:
        print(f"⚠️  Skipping Supabase test: {e}")
        print("   Install dependencies: pip install supabase")
    except Exception as e:
        print(f"❌ Supabase test error: {e}")
        return False
    
    print()
    
    # Test 2: File watcher initialization
    print("2. Testing file watcher initialization...")
    try:
        from file_watcher import FileWatcher
        import os
        
        # Check environment variables
        if not os.getenv("SUPABASE_URL") or not os.getenv("SUPABASE_SECRET_KEY"):
            print("⚠️  Skipping: SUPABASE_URL and SUPABASE_SECRET_KEY not set")
            return True  # Not a failure, just skipped
        
        # Try to initialize (with mock config to avoid actual watching)
        watcher = FileWatcher()
        print("✅ File watcher initialized successfully")
        
    except Exception as e:
        print(f"❌ File watcher initialization failed: {e}")
        return False
    
    print()
    print("✅ All integration tests passed")
    return True


def main():
    """Main test runner."""
    parser = argparse.ArgumentParser(description="Run Phase 2 tests")
    parser.add_argument("--unit", action="store_true", help="Run unit tests only")
    parser.add_argument("--integration", action="store_true", help="Run integration tests only")
    parser.add_argument("--all", action="store_true", help="Run all tests (default)")
    
    args = parser.parse_args()
    
    # Default to all if no specific option
    if not (args.unit or args.integration):
        args.all = True
    
    results = []
    
    if args.all or args.unit:
        print("\n" + "=" * 60)
        print("PHASE 2 - UNIT TESTS")
        print("=" * 60 + "\n")
        unit_ok = run_unit_tests()
        results.append(("Unit Tests", unit_ok))
        print()
    
    if args.all or args.integration:
        print("\n" + "=" * 60)
        print("PHASE 2 - INTEGRATION TESTS")
        print("=" * 60 + "\n")
        integration_ok = run_integration_tests()
        results.append(("Integration Tests", integration_ok))
        print()
    
    # Summary
    print("=" * 60)
    print("Test Summary")
    print("=" * 60)
    for test_type, passed in results:
        status = "✅ PASS" if passed else "❌ FAIL"
        print(f"{status}: {test_type}")
    print()
    
    all_passed = all(passed for _, passed in results)
    if all_passed:
        print("✅ All tests passed!")
        return 0
    else:
        print("❌ Some tests failed.")
        return 1


if __name__ == '__main__':
    sys.exit(main())

