#!/usr/bin/env python3
"""Check how many current session date violations are false positives."""
import json
from pathlib import Path
from enforcement.core.git_utils import GitUtils, get_git_state_key

# Load the current session report
report_path = Path('.cursor/enforcement/ENFORCER_REPORT.json')
if not report_path.exists():
    print(f"Error: Report file not found: {report_path}")
    exit(1)

with open(report_path, 'r', encoding='utf-8') as f:
    report = json.load(f)

# Get all date violations
date_violations = [v for v in report['violations'] if v.get('id') == 'VF-DATE-001']
print(f"Total date violations in current session: {len(date_violations)}")
print("=" * 80)

# Get batch status
project_root = Path('.')
git_utils = GitUtils(project_root)
cache_key = get_git_state_key(project_root)
batch_status = git_utils.get_batch_file_modification_status(cache_key)

# Get untracked files
cached_changed_files = git_utils.get_cached_changed_files()
untracked_files_set = set()
if cached_changed_files:
    untracked_files_set = set(cached_changed_files.get('untracked', []))

# Analyze each violation
false_positives = []
legitimate = []
unknown = []

for violation in date_violations:
    file_path = violation.get('file', '')
    if not file_path:
        unknown.append(violation)
        continue
    
    normalized_path = file_path.replace("\\", "/")
    
    # Check if untracked
    is_untracked = file_path in untracked_files_set or normalized_path in untracked_files_set
    
    if is_untracked:
        # Untracked files are considered legitimate (new files should be checked)
        legitimate.append((violation, "untracked"))
    else:
        # Check batch status
        is_modified_batch = batch_status.get(normalized_path, False) or batch_status.get(file_path, False)
        
        if is_modified_batch:
            legitimate.append((violation, "has_content_changes"))
        else:
            # Not in batch status or marked as False = no content changes = false positive
            false_positives.append((violation, "no_content_changes"))

print(f"\n📊 ANALYSIS RESULTS:")
print(f"  ✅ Legitimate violations (from files with content changes): {len(legitimate)}")
print(f"  ❌ False positives (from files with no content changes): {len(false_positives)}")
print(f"  ❓ Unknown (missing file path): {len(unknown)}")
print(f"\n  False positive rate: {len(false_positives)/len(date_violations)*100:.1f}%")

# Show breakdown of legitimate violations
if legitimate:
    print(f"\n✅ LEGITIMATE VIOLATIONS BREAKDOWN:")
    untracked_count = sum(1 for _, reason in legitimate if reason == "untracked")
    content_changes_count = sum(1 for _, reason in legitimate if reason == "has_content_changes")
    print(f"  - From untracked files (new files): {untracked_count}")
    print(f"  - From files with content changes: {content_changes_count}")

# Show top false positive files
if false_positives:
    print(f"\n❌ TOP FALSE POSITIVE FILES (Top 20):")
    false_positive_files = {}
    for violation, reason in false_positives:
        file_path = violation.get('file', 'unknown')
        false_positive_files[file_path] = false_positive_files.get(file_path, 0) + 1
    
    for file_path, count in sorted(false_positive_files.items(), key=lambda x: x[1], reverse=True)[:20]:
        print(f"  {file_path}: {count} violations")
    
    print(f"\n  Total unique files with false positives: {len(false_positive_files)}")

# Show summary by file type
if false_positives:
    print(f"\n📁 FALSE POSITIVES BY FILE TYPE:")
    file_types = {}
    for violation, _ in false_positives:
        file_path = violation.get('file', '')
        if file_path:
            ext = Path(file_path).suffix or '(no extension)'
            file_types[ext] = file_types.get(ext, 0) + 1
    
    for ext, count in sorted(file_types.items(), key=lambda x: x[1], reverse=True):
        print(f"  {ext}: {count} violations")

print("\n" + "=" * 80)
print("SUMMARY:")
print(f"  Total date violations: {len(date_violations)}")
print(f"  Legitimate: {len(legitimate)} ({len(legitimate)/len(date_violations)*100:.1f}%)")
print(f"  False positives: {len(false_positives)} ({len(false_positives)/len(date_violations)*100:.1f}%)")
print("=" * 80)

