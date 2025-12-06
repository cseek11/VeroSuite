import json
from pathlib import Path
from datetime import datetime, timezone

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

# Get session info
session_id = data.get('session_id', 'unknown')
print(f"Session ID: {session_id}")

# Load session to get start time
try:
    from enforcement.core.session_state import load_session, get_file_hash
    from enforcement.core.git_utils import GitUtils, get_git_state_key
    from enforcement.core.file_scanner import is_file_modified_in_session
    
    project_root = Path('.')
    enforcement_dir = project_root / '.cursor' / 'enforcement'
    
    session = load_session(enforcement_dir)
    git_utils = GitUtils(project_root)
    
    # Get changed files
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
    else:
        all_changed = set()
        print("\nCould not load changed files list")
    
    # Check each violation
    from_modified_files = []
    from_unmodified_files = []
    check_errors = []
    
    print("\n" + "=" * 60)
    print("CHECKING FILE MODIFICATION STATUS...")
    print("=" * 60)
    
    for i, violation in enumerate(date_violations):
        file_path = violation.get('file', '')
        if not file_path:
            continue
        
        # Check if file is in changed files list
        is_in_changed = file_path in all_changed
        
        # Also check with is_file_modified_in_session for more accurate result
        try:
            is_modified = is_file_modified_in_session(
                file_path,
                session,
                project_root,
                git_utils
            )
        except Exception as e:
            is_modified = is_in_changed  # Fallback to changed files check
            check_errors.append((file_path, str(e)))
        
        violation_info = {
            'file': file_path,
            'line': violation.get('line_number'),
            'date': violation.get('description', '').split(':')[0] if ':' in violation.get('description', '') else '',
            'is_in_changed_list': is_in_changed,
            'is_modified': is_modified
        }
        
        if is_modified:
            from_modified_files.append(violation_info)
        else:
            from_unmodified_files.append(violation_info)
        
        if (i + 1) % 100 == 0:
            print(f"  Checked {i + 1}/{len(date_violations)} violations...")
    
    print(f"\n  Checked all {len(date_violations)} violations")
    
    if check_errors:
        print(f"\n  Errors during check: {len(check_errors)}")
        if len(check_errors) <= 5:
            for file, error in check_errors:
                print(f"    {file}: {error}")
    
    print("\n" + "=" * 60)
    print("RESULTS")
    print("=" * 60)
    print(f"\n✅ From Modified Files: {len(from_modified_files)} ({len(from_modified_files)/len(date_violations)*100:.1f}%)")
    print(f"❌ From Unmodified Files (False Positives): {len(from_unmodified_files)} ({len(from_unmodified_files)/len(date_violations)*100:.1f}%)")
    
    if from_unmodified_files:
        print("\n" + "=" * 60)
        print("FALSE POSITIVE VIOLATIONS (Top 20)")
        print("=" * 60)
        for i, v in enumerate(from_unmodified_files[:20], 1):
            print(f"{i}. {v['file']}:{v['line']} - {v['date']}")
        if len(from_unmodified_files) > 20:
            print(f"\n... and {len(from_unmodified_files) - 20} more")
    
    # Group by file
    from collections import defaultdict
    modified_by_file = defaultdict(list)
    unmodified_by_file = defaultdict(list)
    
    for v in from_modified_files:
        modified_by_file[v['file']].append(v)
    for v in from_unmodified_files:
        unmodified_by_file[v['file']].append(v)
    
    print("\n" + "=" * 60)
    print("FALSE POSITIVE FILES (Files with violations but not modified)")
    print("=" * 60)
    print(f"Total files with false positives: {len(unmodified_by_file)}")
    for file, violations in list(unmodified_by_file.items())[:10]:
        print(f"  {file}: {len(violations)} violations")
    if len(unmodified_by_file) > 10:
        print(f"  ... and {len(unmodified_by_file) - 10} more files")

except Exception as e:
    print(f"\nError analyzing violations: {e}")
    import traceback
    traceback.print_exc()

