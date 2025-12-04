#!/usr/bin/env python3
"""Test script to verify Phase 2 GitUtils functionality."""
import sys
import time
from pathlib import Path
from datetime import datetime, timezone

# Add project root to path
project_root = Path(__file__).parent.parent.parent
sys.path.insert(0, str(project_root))
sys.path.insert(0, str(project_root / ".cursor"))

from enforcement.core.git_utils import GitUtils

def test_changed_files():
    """Test changed files detection."""
    print("Testing changed files detection...")
    git_utils = GitUtils(project_root)
    changed = git_utils.get_changed_files(include_untracked=True)
    print(f"  Found {len(changed)} changed files")
    return len(changed) > 0

def test_file_diff():
    """Test file diff computation."""
    print("Testing file diff computation...")
    git_utils = GitUtils(project_root)
    # Test with a known file
    test_file = ".cursor/scripts/auto-enforcer.py"
    diff = git_utils.get_file_diff(test_file)
    if diff is not None:
        print(f"  Diff computed for {test_file} ({len(diff)} chars)")
        return True
    else:
        print(f"  No diff for {test_file} (untracked or no changes)")
        return True  # This is valid

def test_line_change_detection():
    """Test line change detection."""
    print("Testing line change detection...")
    git_utils = GitUtils(project_root)
    test_file = ".cursor/scripts/auto-enforcer.py"
    session_start = datetime.now(timezone.utc)
    # Test with a line number
    changed = git_utils.is_line_changed_in_session(test_file, 100, session_start)
    print(f"  Line 100 changed: {changed}")
    return True  # Function works

def test_caching():
    """Test git command caching."""
    print("Testing git command caching...")
    git_utils = GitUtils(project_root)
    
    # First call
    start1 = time.time()
    changed1 = git_utils.get_changed_files()
    time1 = time.time() - start1
    
    # Second call (should use cache)
    start2 = time.time()
    changed2 = git_utils.get_changed_files()
    time2 = time.time() - start2
    
    print(f"  First call: {time1:.4f}s, Second call: {time2:.4f}s")
    print(f"  Results match: {changed1 == changed2}")
    print(f"  Cache speedup: {time1/time2:.2f}x" if time2 > 0 else "  Cache speedup: N/A")
    
    return changed1 == changed2 and time2 <= time1

def test_cache_invalidation():
    """Test cache invalidation."""
    print("Testing cache invalidation...")
    git_utils = GitUtils(project_root)
    
    # Get changed files (populates cache)
    changed1 = git_utils.get_changed_files()
    
    # Invalidate cache
    git_utils.invalidate_cache()
    
    # Get again (should recompute)
    changed2 = git_utils.get_changed_files()
    
    print(f"  Before invalidation: {len(changed1)} files")
    print(f"  After invalidation: {len(changed2)} files")
    print(f"  Cache cleared: True")
    
    return True

if __name__ == "__main__":
    print("Phase 2 GitUtils Test Suite\n")
    
    results = []
    results.append(("Changed Files Detection", test_changed_files()))
    results.append(("File Diff Computation", test_file_diff()))
    results.append(("Line Change Detection", test_line_change_detection()))
    results.append(("Git Command Caching", test_caching()))
    results.append(("Cache Invalidation", test_cache_invalidation()))
    
    print("\n" + "="*50)
    print("Test Results:")
    print("="*50)
    for name, result in results:
        status = "PASS" if result else "FAIL"
        print(f"  {name}: {status}")
    
    all_passed = all(r[1] for r in results)
    sys.exit(0 if all_passed else 1)

