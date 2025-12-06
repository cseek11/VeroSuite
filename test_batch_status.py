#!/usr/bin/env python3
"""Test batch status to verify fix is working."""
from pathlib import Path
from enforcement.core.git_utils import GitUtils, get_git_state_key

project_root = Path('.')
git_utils = GitUtils(project_root)
cache_key = get_git_state_key(project_root)
batch_status = git_utils.get_batch_file_modification_status(cache_key)

# Test file that should be skipped (whitespace-only changes)
test_file = 'enforcement/AGENT_REMINDERS.md'
print(f"Batch status for {test_file}: {batch_status.get(test_file, 'NOT_FOUND')}")
print(f"Total files in batch status: {len(batch_status)}")
print(f"Files marked as modified: {sum(1 for v in batch_status.values() if v)}")

# Check a few files that have violations
violation_files = [
    'enforcement/AGENT_REMINDERS.md',
    'enforcement/ENFORCEMENT_BLOCK.md',
    'enforcement/VIOLATIONS.md',
]

print("\nFiles with violations and their batch status:")
for vfile in violation_files:
    status = batch_status.get(vfile, 'NOT_FOUND')
    print(f"  {vfile}: {status}")

