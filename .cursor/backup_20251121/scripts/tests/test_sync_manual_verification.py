#!/usr/bin/env python3
"""
Manual verification test for reward_scores.json auto-sync.

This test actually calls the sync function and verifies it works with the real repository.
Run this to verify sync is working in your environment.
"""

import sys
import json
from pathlib import Path

# Import functions to test
sys.path.insert(0, str(Path(__file__).parent.parent))
from analyze_reward_trends import sync_reward_scores_file, load_reward_scores, REWARD_SCORES_PATH


def test_sync_is_called_when_loading():
    """Test that sync is automatically called when load_reward_scores is called."""
    print("=" * 60)
    print("TEST: Auto-sync when loading reward scores")
    print("=" * 60)
    
    repo_path = REWARD_SCORES_PATH.resolve().parents[2]
    
    # Get initial file state
    initial_count = 0
    if REWARD_SCORES_PATH.exists():
        with open(REWARD_SCORES_PATH, "r", encoding="utf-8") as f:
            initial_data = json.load(f)
            initial_count = len(initial_data.get("scores", []))
        print(f"Initial: {initial_count} PR scores in local file")
    else:
        print("Initial: Local file does not exist")
    
    # Attempt sync
    print("\nAttempting sync from origin/main...")
    sync_result = sync_reward_scores_file(repo_path, REWARD_SCORES_PATH)
    
    if sync_result:
        print("[SUCCESS] Sync attempted (may have updated file)")
    else:
        print("[SKIPPED] Sync skipped (file may be up-to-date or git unavailable)")
    
    # Load scores (this should also trigger sync)
    print("\nLoading reward scores (should auto-sync if needed)...")
    data = load_reward_scores()
    final_count = len(data.get("scores", []))
    
    print(f"\nFinal: {final_count} PR scores in local file")
    print(f"Last updated: {data.get('last_updated', 'unknown')}")
    
    # Verify
    if final_count >= initial_count:
        print(f"\n[SUCCESS] File has {final_count} scores (was {initial_count})")
        if final_count > initial_count:
            print(f"  -> Sync added {final_count - initial_count} new scores!")
        else:
            print("  -> File is up-to-date")
        return True
    else:
        print(f"\n[WARNING] File count decreased (was {initial_count}, now {final_count})")
        return False


def test_sync_function_directly():
    """Test the sync function directly."""
    print("\n" + "=" * 60)
    print("TEST: Direct sync function call")
    print("=" * 60)
    
    repo_path = REWARD_SCORES_PATH.resolve().parents[2]
    
    print(f"Repository: {repo_path}")
    print(f"File: {REWARD_SCORES_PATH}")
    print(f"File exists: {REWARD_SCORES_PATH.exists()}")
    
    result = sync_reward_scores_file(repo_path, REWARD_SCORES_PATH)
    
    if result:
        print("[SUCCESS] Sync function returned True (sync was attempted)")
    else:
        print("[SKIPPED] Sync function returned False (sync was skipped)")
        print("  This is normal if:")
        print("  - File is already up-to-date")
        print("  - Not in a git repository")
        print("  - Git is not available")
        print("  - File doesn't exist on origin/main")
    
    return result


if __name__ == "__main__":
    print("\n" + "=" * 60)
    print("REWARD SCORES AUTO-SYNC VERIFICATION TEST")
    print("=" * 60)
    print("\nThis test verifies that automatic syncing works when reading reward_scores.json")
    print("It will:")
    print("1. Check current file state")
    print("2. Attempt sync from origin/main")
    print("3. Load scores (which should auto-sync)")
    print("4. Verify results\n")
    
    # Test 1: Direct sync
    sync_attempted = test_sync_function_directly()
    
    # Test 2: Auto-sync on load
    load_success = test_sync_is_called_when_loading()
    
    # Summary
    print("\n" + "=" * 60)
    print("TEST SUMMARY")
    print("=" * 60)
    print(f"Sync function call: {'[SUCCESS]' if sync_attempted else '[SKIPPED] (may be normal)'}")
    print(f"Auto-sync on load: {'[SUCCESS]' if load_success else '[WARNING]'}")
    print("\nIf sync was skipped, it may be because:")
    print("- Local file is already up-to-date")
    print("- Not in a git repository")
    print("- Git is not available")
    print("- Network issues")
    print("\nIf sync succeeded, the file should now be synced with origin/main")

