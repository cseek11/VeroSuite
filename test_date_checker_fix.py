#!/usr/bin/env python3
"""Test if date checker fix is working correctly."""
from pathlib import Path
from enforcement.core.git_utils import GitUtils, get_git_state_key

project_root = Path('.')
git_utils = GitUtils(project_root)
cache_key = get_git_state_key(project_root)
batch_status = git_utils.get_batch_file_modification_status(cache_key)

# Test files that should be skipped (no content changes)
test_files = [
    'enforcement/AGENT_REMINDERS.md',
    'enforcement/ENFORCEMENT_BLOCK.md',
    'enforcement/VIOLATIONS.md',
]

print("Testing batch status for files that should be skipped:")
print("=" * 80)

for test_file in test_files:
    normalized = test_file.replace("\\", "/")
    is_modified = batch_status.get(normalized, False) or batch_status.get(test_file, False)
    in_batch = normalized in batch_status or test_file in batch_status
    
    print(f"\n{test_file}:")
    print(f"  Normalized: {normalized}")
    print(f"  In batch_status: {in_batch}")
    print(f"  Is modified (batch): {is_modified}")
    print(f"  Should be skipped: {not is_modified}")
    
    if is_modified:
        print(f"  ⚠️  WARNING: File is marked as modified but should be skipped!")
    else:
        print(f"  ✅ File correctly identified as NOT modified (will be skipped)")

print(f"\n\nBatch status summary:")
print(f"  Total files in batch_status: {len(batch_status)}")
print(f"  Files marked as modified: {sum(1 for v in batch_status.values() if v)}")
print(f"  Files NOT modified (should be skipped): {sum(1 for v in batch_status.values() if not v)}")

