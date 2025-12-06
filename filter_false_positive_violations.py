#!/usr/bin/env python3
"""
Filter false positive date violations from ENFORCER_REPORT.json.

This script removes violations from files that have no actual content changes
(whitespace-only or move-only changes) based on batch status.
"""
import json
from pathlib import Path
from enforcement.core.git_utils import GitUtils, get_git_state_key

def filter_false_positives():
    """Filter false positive violations from the report."""
    report_path = Path('.cursor/enforcement/ENFORCER_REPORT.json')
    
    if not report_path.exists():
        print(f"Report not found: {report_path}")
        return
    
    # Load report
    with open(report_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    violations = data.get('violations', [])
    date_violations = [v for v in violations if v.get('id') == 'VF-DATE-001']
    other_violations = [v for v in violations if v.get('id') != 'VF-DATE-001']
    
    print(f"Total violations: {len(violations)}")
    print(f"Date violations: {len(date_violations)}")
    print(f"Other violations: {len(other_violations)}")
    
    # Get batch status to identify files with actual content changes
    project_root = Path('.')
    git_utils = GitUtils(project_root)
    cache_key = get_git_state_key(project_root)
    batch_status = git_utils.get_batch_file_modification_status(cache_key)
    
    # Get untracked files (these need special handling)
    cached_changed_files = git_utils.get_cached_changed_files()
    untracked_files_set = set()
    if cached_changed_files:
        untracked_files_set = set(cached_changed_files.get('untracked', []))
    
    # Filter date violations
    legitimate_violations = []
    false_positives = []
    
    for violation in date_violations:
        file_path = violation.get('file', '')
        if not file_path:
            # Keep violations without file paths (shouldn't happen, but be safe)
            legitimate_violations.append(violation)
            continue
        
        normalized_path = file_path.replace("\\", "/")
        
        # Check if file is untracked
        is_untracked = file_path in untracked_files_set or normalized_path in untracked_files_set
        
        if is_untracked:
            # For untracked files, keep the violation (new files should be checked)
            legitimate_violations.append(violation)
        else:
            # For tracked files, check batch status
            is_modified = batch_status.get(normalized_path, False) or batch_status.get(file_path, False)
            
            if is_modified:
                # File has actual content changes - keep violation
                legitimate_violations.append(violation)
            else:
                # File has no content changes - this is a false positive
                false_positives.append(violation)
    
    print(f"\nFiltered results:")
    print(f"  Legitimate violations: {len(legitimate_violations)}")
    print(f"  False positives: {len(false_positives)}")
    print(f"  Reduction: {len(false_positives)} violations ({len(false_positives)/len(date_violations)*100:.1f}%)")
    
    # Create filtered report
    filtered_violations = legitimate_violations + other_violations
    data['violations'] = filtered_violations
    data['summary']['blocking_count'] = len([v for v in filtered_violations if v.get('severity') == 'BLOCKING'])
    data['summary']['warning_count'] = len([v for v in filtered_violations if v.get('severity') == 'WARNING'])
    
    # Save filtered report
    backup_path = report_path.with_suffix('.json.backup')
    if not backup_path.exists():
        report_path.rename(backup_path)
        print(f"\nBacked up original report to: {backup_path}")
    
    with open(report_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    
    print(f"Saved filtered report to: {report_path}")
    print(f"\nFalse positive files (top 10):")
    false_positive_files = {}
    for v in false_positives:
        file_path = v.get('file', '')
        false_positive_files[file_path] = false_positive_files.get(file_path, 0) + 1
    
    for file_path, count in sorted(false_positive_files.items(), key=lambda x: x[1], reverse=True)[:10]:
        print(f"  {file_path}: {count} violations")

if __name__ == '__main__':
    filter_false_positives()

