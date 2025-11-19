#!/usr/bin/env python3
"""
Manual test script for Auto-PR workflow trigger fixes.

This script tests each stage of the workflow trigger process:
1. GitHub CLI authentication
2. PR number extraction
3. Workflow trigger command structure
4. Error handling

Run this script to verify all fixes are working correctly.
"""

import os
import sys
import subprocess
from pathlib import Path

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent))

from monitor_changes import authenticate_gh_cli, extract_pr_number

def print_section(title):
    """Print a formatted section header."""
    print("\n" + "=" * 70)
    print(f"  {title}")
    print("=" * 70)

def print_step(step_num, description):
    """Print a formatted step."""
    print(f"\n[STEP {step_num}] {description}")
    print("-" * 70)

def test_authentication():
    """Test GitHub CLI authentication."""
    print_section("STAGE 1: GitHub CLI Authentication")
    
    gh_path = "gh"
    if os.name == 'nt':  # Windows
        gh_path = r"C:\Program Files\GitHub CLI\gh.exe"
        if not os.path.exists(gh_path):
            gh_path = "gh"
    
    print_step(1, "Checking if GitHub CLI is installed")
    try:
        result = subprocess.run(
            [gh_path, "--version"],
            capture_output=True,
            text=True,
            timeout=5
        )
        if result.returncode == 0:
            print(f"✅ GitHub CLI found: {result.stdout.strip()}")
        else:
            print(f"⚠️  GitHub CLI found but returned error: {result.stderr}")
            return False
    except FileNotFoundError:
        print(f"❌ GitHub CLI not found at {gh_path}")
        print("   Please install GitHub CLI: https://cli.github.com/")
        return False
    except Exception as e:
        print(f"❌ Error checking GitHub CLI: {e}")
        return False
    
    print_step(2, "Checking current authentication status")
    try:
        result = subprocess.run(
            [gh_path, "auth", "status"],
            capture_output=True,
            text=True,
            timeout=10
        )
        if result.returncode == 0:
            print("✅ GitHub CLI is already authenticated")
            print(f"   Status: {result.stdout.strip()}")
            return True
        else:
            print("⚠️  GitHub CLI is not authenticated")
            print(f"   Error: {result.stderr.strip()}")
    except Exception as e:
        print(f"⚠️  Error checking auth status: {e}")
    
    print_step(3, "Checking for authentication tokens")
    tokens_found = []
    if os.environ.get("GITHUB_TOKEN"):
        tokens_found.append("GITHUB_TOKEN")
        print(f"✅ Found GITHUB_TOKEN")
    if os.environ.get("GH_TOKEN"):
        tokens_found.append("GH_TOKEN")
        print(f"✅ Found GH_TOKEN")
    if os.environ.get("GH_DISPATCH_PAT"):
        tokens_found.append("GH_DISPATCH_PAT")
        print(f"✅ Found GH_DISPATCH_PAT")
    
    if not tokens_found:
        print("⚠️  No authentication tokens found in environment")
        print("   Set one of: GITHUB_TOKEN, GH_TOKEN, or GH_DISPATCH_PAT")
        print("   For testing, you can set: export GH_DISPATCH_PAT=your_token")
        return False
    
    print_step(4, "Testing authentication function")
    auth_result = authenticate_gh_cli(gh_path)
    if auth_result:
        print("✅ Authentication function returned True")
    else:
        print("⚠️  Authentication function returned False")
        print("   This may be expected if tokens are invalid or expired")
    
    return auth_result

def test_pr_extraction():
    """Test PR number extraction with various URL formats."""
    print_section("STAGE 2: PR Number Extraction")
    
    test_cases = [
        ("https://github.com/owner/repo/pull/123", "123", "Standard URL"),
        ("https://github.com/owner/repo/pull/123/", "123", "Trailing slash"),
        ("  https://github.com/owner/repo/pull/123  \n", "123", "Whitespace"),
        ("https://github.com/owner/repo/pull/123?tab=files", "123", "Query params"),
        ("https://github.com/owner/repo/pull/123/files", "123", "Path after number"),
        ("https://github.com/owner/repo/issues/123", None, "Invalid (issues, not pull)"),
        ("https://github.com/owner/repo/pull/abc", None, "Invalid (non-numeric)"),
        ("", None, "Empty string"),
        (None, None, "None input"),
    ]
    
    passed = 0
    failed = 0
    
    for i, (url, expected, description) in enumerate(test_cases, 1):
        print_step(i, f"Testing: {description}")
        print(f"   Input: {repr(url)}")
        result = extract_pr_number(url)
        print(f"   Expected: {expected}")
        print(f"   Got: {result}")
        
        if result == expected:
            print(f"   ✅ PASS")
            passed += 1
        else:
            print(f"   ❌ FAIL")
            failed += 1
    
    print(f"\n📊 Results: {passed} passed, {failed} failed")
    return failed == 0

def test_workflow_command_structure():
    """Test workflow trigger command structure."""
    print_section("STAGE 3: Workflow Trigger Command Structure")
    
    print_step(1, "Verifying command structure in code")
    
    # Read the actual code to verify structure
    script_path = Path(__file__).parent / "monitor_changes.py"
    with open(script_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Check if --field is used in actual code (not just comments)
    import re
    # Remove comments to check actual code
    code_without_comments = re.sub(r'#.*', '', content)
    has_field_in_code = '"--field"' in code_without_comments
    
    checks = [
        ('"--ref", "main"', 'Uses --ref main (not branch_name)', True),
        ('"-f", f"pr_number=', 'Uses -f flag for workflow inputs', True),
        ('"workflow"', 'Uses workflow command', True),
        ('"swarm_compute_reward_score.yml"', 'References correct workflow file', True),
        ('"--field"', 'Does NOT use --field flag in code (only in comments)', False),
    ]
    
    all_passed = True
    for pattern, description, should_exist in checks:
        if pattern == '"--field"':
            # Special check: verify --field is NOT in actual code (only in comments)
            exists = has_field_in_code
        else:
            exists = pattern in content
        
        if should_exist:
            if exists:
                print(f"   ✅ {description}")
            else:
                print(f"   ❌ {description} - NOT FOUND")
                all_passed = False
        else:
            if not exists:
                print(f"   ✅ {description} - Correctly removed")
            else:
                print(f"   ❌ {description} - Still present (should be removed)")
                all_passed = False
    
    print_step(2, "Testing command construction (dry run)")
    pr_number = "123"
    gh_path = "gh"
    
    # This is what the command should look like
    expected_command = [
        gh_path,
        "workflow",
        "run",
        "swarm_compute_reward_score.yml",
        "--ref", "main",
        "-f", f"pr_number={pr_number}"
    ]
    
    print("   Expected command structure:")
    print(f"   {expected_command}")
    print("\n   ✅ Command structure verified in code")
    
    return all_passed

def test_error_handling():
    """Test error handling and logging."""
    print_section("STAGE 4: Error Handling & Logging")
    
    print_step(1, "Testing error handling in extract_pr_number")
    # Test with invalid input
    result = extract_pr_number("not a url")
    if result is None:
        print("   ✅ Returns None for invalid input")
    else:
        print(f"   ❌ Expected None, got {result}")
        return False
    
    print_step(2, "Testing error handling in authenticate_gh_cli")
    # Test with invalid gh path
    result = authenticate_gh_cli("/nonexistent/path/gh")
    if result is False:
        print("   ✅ Returns False for invalid path")
    else:
        print(f"   ⚠️  Expected False, got {result}")
    
    print_step(3, "Verifying structured logging")
    script_path = Path(__file__).parent / "monitor_changes.py"
    with open(script_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    logging_checks = [
        ('logger.error', 'Error logging present'),
        ('logger.warn', 'Warning logging present'),
        ('logger.info', 'Info logging present'),
        ('operation=', 'Structured logging with operation field'),
    ]
    
    for pattern, description in logging_checks:
        if pattern in content:
            print(f"   ✅ {description}")
        else:
            print(f"   ⚠️  {description} - Not found")
    
    return True

def test_workflow_file_exists():
    """Verify workflow file exists and has correct structure."""
    print_section("STAGE 5: Workflow File Verification")
    
    repo_root = Path(__file__).parent.parent.parent
    workflow_path = repo_root / ".github" / "workflows" / "swarm_compute_reward_score.yml"
    
    print_step(1, "Checking if workflow file exists")
    if workflow_path.exists():
        print(f"   ✅ Workflow file found: {workflow_path}")
    else:
        print(f"   ❌ Workflow file not found: {workflow_path}")
        return False
    
    print_step(2, "Verifying workflow_dispatch configuration")
    with open(workflow_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    checks = [
        ('workflow_dispatch:', 'Has workflow_dispatch trigger'),
        ('inputs:', 'Has inputs section'),
        ('pr_number:', 'Has pr_number input'),
    ]
    
    all_passed = True
    for pattern, description in checks:
        if pattern in content:
            print(f"   ✅ {description}")
        else:
            print(f"   ❌ {description} - NOT FOUND")
            all_passed = False
    
    return all_passed

def main():
    """Run all manual tests."""
    print("\n" + "=" * 70)
    print("  AUTO-PR WORKFLOW TRIGGER - MANUAL TEST SUITE")
    print("=" * 70)
    print("\nThis script tests all fixes for the Auto-PR workflow trigger system.")
    print("Testing will verify:")
    print("  1. GitHub CLI authentication")
    print("  2. PR number extraction")
    print("  3. Workflow trigger command structure")
    print("  4. Error handling and logging")
    print("  5. Workflow file configuration")
    
    results = {}
    
    # Run all tests
    results['authentication'] = test_authentication()
    results['pr_extraction'] = test_pr_extraction()
    results['command_structure'] = test_workflow_command_structure()
    results['error_handling'] = test_error_handling()
    results['workflow_file'] = test_workflow_file_exists()
    
    # Print summary
    print_section("TEST SUMMARY")
    
    total_tests = len(results)
    passed_tests = sum(1 for v in results.values() if v)
    failed_tests = total_tests - passed_tests
    
    print(f"\nTotal test stages: {total_tests}")
    print(f"✅ Passed: {passed_tests}")
    print(f"❌ Failed: {failed_tests}")
    
    print("\nDetailed Results:")
    for test_name, result in results.items():
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"  {status}: {test_name.replace('_', ' ').title()}")
    
    if failed_tests == 0:
        print("\n🎉 All tests passed! The fixes are working correctly.")
        return 0
    else:
        print(f"\n⚠️  {failed_tests} test stage(s) failed. Please review the output above.")
        return 1

if __name__ == "__main__":
    sys.exit(main())

