#!/usr/bin/env python3
"""Debug why a specific file is generating false positives."""
import json
from pathlib import Path
from enforcement.core.git_utils import GitUtils, get_git_state_key

# Load the current session report
report_path = Path('.cursor/enforcement/ENFORCER_REPORT.json')
with open(report_path, 'r', encoding='utf-8') as f:
    report = json.load(f)

# Get a false positive file
test_file = 'enforcement/ENFORCEMENT_BLOCK.md'
date_violations = [v for v in report['violations'] if v.get('id') == 'VF-DATE-001' and v.get('file') == test_file]
print(f"Violations for {test_file}: {len(date_violations)}")
print("=" * 80)

# Get batch status
project_root = Path('.')
git_utils = GitUtils(project_root)
cache_key = get_git_state_key(project_root)
batch_status = git_utils.get_batch_file_modification_status(cache_key)

# Check different path formats
normalized = test_file.replace("\\", "/")
print(f"Original path: {test_file}")
print(f"Normalized path: {normalized}")
print(f"In batch_status (normalized): {normalized in batch_status}")
print(f"In batch_status (original): {test_file in batch_status}")
print(f"Batch status value (normalized): {batch_status.get(normalized, 'NOT_FOUND')}")
print(f"Batch status value (original): {batch_status.get(test_file, 'NOT_FOUND')}")

# Check if file is tracked
tracked_files = git_utils.run_git_command(['ls-files', test_file])
print(f"Git ls-files result: {tracked_files.strip() if tracked_files else 'NOT_TRACKED'}")

# Check git diff status
diff_status = git_utils.run_git_command(['diff', '--name-status', 'HEAD', '--', test_file])
print(f"Git diff --name-status: {diff_status.strip() if diff_status else 'NO_CHANGES'}")

# Check git diff with ignore-all-space
diff_status_ignore_space = git_utils.run_git_command([
    'diff', '--name-status', '--ignore-all-space', '--ignore-cr-at-eol', '--ignore-blank-lines',
    'HEAD', '--', test_file
])
print(f"Git diff --name-status (ignore-all-space): {diff_status_ignore_space.strip() if diff_status_ignore_space else 'NO_CHANGES'}")

print("=" * 80)
print("Analysis:")
if normalized not in batch_status and test_file not in batch_status:
    print("  ❌ File NOT in batch_status - this means it has NO content changes")
    print("  ✅ Should be skipped (file_modification_cache should be False)")
else:
    is_modified = batch_status.get(normalized, False) or batch_status.get(test_file, False)
    if is_modified:
        print("  ⚠️  File IS in batch_status and marked as modified")
        print("  ❌ This shouldn't happen if it's a false positive")
    else:
        print("  ✅ File in batch_status but marked as NOT modified")
        print("  ✅ Should be skipped")

