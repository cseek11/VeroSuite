import json
from pathlib import Path

# Load the violation report
with open('.cursor/enforcement/ENFORCER_REPORT.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

violations = data.get('violations', [])

# Filter to only date violations
date_violations = [v for v in violations if v.get('id') == 'VF-DATE-001']

print("=" * 60)
print("HARDCODED DATE VIOLATION ANALYSIS")
print("=" * 60)
print(f"\nTotal Date Violations: {len(date_violations)}")

# Check which files are actually in git's changed files list
try:
    from enforcement.core.git_utils import GitUtils, get_git_state_key
    
    project_root = Path('.')
    git_utils = GitUtils(project_root)
    
    # Get changed files using the same method as date checker
    cache_key = get_git_state_key(project_root)
    git_utils.update_cache(cache_key)
    changed_files = git_utils.get_cached_changed_files()
    
    if changed_files:
        tracked_files = set(changed_files.get('tracked', []))
        untracked_files = set(changed_files.get('untracked', []))
        all_changed = tracked_files | untracked_files
        
        print(f"\nChanged Files (tracked): {len(tracked_files)}")
        print(f"Changed Files (untracked): {len(untracked_files)}")
        print(f"Total Changed Files: {len(all_changed)}")
        
        # Get batch modification status (same as date checker uses)
        batch_status = git_utils.get_batch_file_modification_status(cache_key)
        print(f"\nFiles with content changes (from batch status): {len([f for f, v in batch_status.items() if v])}")
        
        # Check each violation
        from_modified_files = []
        from_unmodified_files = []
        not_in_changed_list = []
        
        for violation in date_violations:
            file_path = violation.get('file', '')
            if not file_path:
                continue
            
            # Normalize path (same as date checker)
            normalized_path = file_path.replace("\\", "/")
            
            # Check if in changed files list
            is_in_changed = file_path in all_changed or normalized_path in all_changed
            
            # Check batch modification status
            is_modified_batch = batch_status.get(normalized_path, False) or batch_status.get(file_path, False)
            
            violation_info = {
                'file': file_path,
                'line': violation.get('line_number'),
                'is_in_changed_list': is_in_changed,
                'is_modified_batch': is_modified_batch
            }
            
            if is_modified_batch:
                from_modified_files.append(violation_info)
            elif is_in_changed:
                # In changed list but batch says not modified (might be whitespace-only or moved)
                from_unmodified_files.append(violation_info)
            else:
                # Not even in changed list - definitely false positive
                not_in_changed_list.append(violation_info)
        
        print("\n" + "=" * 60)
        print("RESULTS")
        print("=" * 60)
        print(f"\n✅ From Files with Content Changes (Batch Status): {len(from_modified_files)} ({len(from_modified_files)/len(date_violations)*100:.1f}%)")
        print(f"⚠️  In Changed List but No Content Changes (whitespace/move only): {len(from_unmodified_files)} ({len(from_unmodified_files)/len(date_violations)*100:.1f}%)")
        print(f"❌ Not in Changed List (False Positives): {len(not_in_changed_list)} ({len(not_in_changed_list)/len(date_violations)*100:.1f}%)")
        
        if from_unmodified_files:
            print("\n" + "=" * 60)
            print("FILES IN CHANGED LIST BUT NO CONTENT CHANGES (Top 20)")
            print("=" * 60)
            from collections import defaultdict
            by_file = defaultdict(int)
            for v in from_unmodified_files:
                by_file[v['file']] += 1
            
            for file, count in sorted(by_file.items(), key=lambda x: -x[1])[:20]:
                print(f"  {file}: {count} violations")
        
        if not_in_changed_list:
            print("\n" + "=" * 60)
            print("FALSE POSITIVES - NOT IN CHANGED LIST (Top 20)")
            print("=" * 60)
            from collections import defaultdict
            by_file = defaultdict(int)
            for v in not_in_changed_list:
                by_file[v['file']] += 1
            
            for file, count in sorted(by_file.items(), key=lambda x: -x[1])[:20]:
                print(f"  {file}: {count} violations")
        
        # Summary by file
        from collections import defaultdict
        modified_by_file = defaultdict(int)
        unmodified_by_file = defaultdict(int)
        false_positive_by_file = defaultdict(int)
        
        for v in from_modified_files:
            modified_by_file[v['file']] += 1
        for v in from_unmodified_files:
            unmodified_by_file[v['file']] += 1
        for v in not_in_changed_list:
            false_positive_by_file[v['file']] += 1
        
        print("\n" + "=" * 60)
        print("SUMMARY BY FILE")
        print("=" * 60)
        print(f"Files with confirmed modifications: {len(modified_by_file)}")
        print(f"Files with changes but no content modifications: {len(unmodified_by_file)}")
        print(f"Files not in changed list (false positives): {len(false_positive_by_file)}")
        
    else:
        print("\nCould not load changed files list")

except Exception as e:
    print(f"\nError analyzing violations: {e}")
    import traceback
    traceback.print_exc()

