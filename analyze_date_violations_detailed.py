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
print("HARDCODED DATE VIOLATION ANALYSIS (DETAILED)")
print("=" * 60)
print(f"\nTotal Date Violations: {len(date_violations)}")

# Get session info
try:
    from enforcement.core.session_state import load_session
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
        print(f"Changed Files (tracked): {len(tracked_files)}")
        print(f"Changed Files (untracked): {len(untracked_files)}")
        print(f"Total Changed Files: {len(all_changed)}")
    else:
        all_changed = set()
        print("\nCould not load changed files list")
    
    # Check each violation with detailed error reporting
    from_modified_files = []
    from_unmodified_files = []
    check_errors = []
    error_types = {}
    
    print("\n" + "=" * 60)
    print("CHECKING FILE MODIFICATION STATUS (WITH ERROR DETAILS)...")
    print("=" * 60)
    
    for i, violation in enumerate(date_violations):
        file_path = violation.get('file', '')
        if not file_path:
            continue
        
        # Check if file is in changed files list
        is_in_changed = file_path in all_changed
        
        # Also check with is_file_modified_in_session for more accurate result
        is_modified = False
        error_msg = None
        try:
            is_modified = is_file_modified_in_session(
                file_path,
                session,
                project_root,
                git_utils
            )
        except Exception as e:
            error_msg = str(e)
            error_type = type(e).__name__
            error_types[error_type] = error_types.get(error_type, 0) + 1
            check_errors.append((file_path, error_type, error_msg))
            # Fallback to changed files check
            is_modified = is_in_changed
        
        violation_info = {
            'file': file_path,
            'line': violation.get('line_number'),
            'date': violation.get('description', '').split(':')[0] if ':' in violation.get('description', '') else '',
            'is_in_changed_list': is_in_changed,
            'is_modified': is_modified,
            'error': error_msg
        }
        
        if is_modified:
            from_modified_files.append(violation_info)
        else:
            from_unmodified_files.append(violation_info)
        
        if (i + 1) % 200 == 0:
            print(f"  Checked {i + 1}/{len(date_violations)} violations...")
    
    print(f"\n  Checked all {len(date_violations)} violations")
    
    print("\n" + "=" * 60)
    print("ERROR ANALYSIS")
    print("=" * 60)
    if check_errors:
        print(f"Total errors during check: {len(check_errors)}")
        print(f"\nError types:")
        for error_type, count in sorted(error_types.items(), key=lambda x: -x[1]):
            print(f"  {error_type}: {count}")
        
        print(f"\nSample errors (first 5):")
        for file, error_type, error_msg in check_errors[:5]:
            print(f"  {file}: {error_type} - {error_msg[:100]}")
    else:
        print("No errors during check")
    
    print("\n" + "=" * 60)
    print("RESULTS")
    print("=" * 60)
    print(f"\n✅ From Modified Files: {len(from_modified_files)} ({len(from_modified_files)/len(date_violations)*100:.1f}%)")
    print(f"❌ From Unmodified Files (False Positives): {len(from_unmodified_files)} ({len(from_unmodified_files)/len(date_violations)*100:.1f}%)")
    
    # Analyze by changed files list vs actual modification check
    in_changed_but_not_modified = [v for v in from_modified_files if v['is_in_changed_list'] and v.get('error')]
    print(f"\n⚠️  Files in changed list but check had errors: {len(in_changed_but_not_modified)}")
    
    # Group by file
    from collections import defaultdict
    modified_by_file = defaultdict(list)
    unmodified_by_file = defaultdict(list)
    
    for v in from_modified_files:
        modified_by_file[v['file']].append(v)
    for v in from_unmodified_files:
        unmodified_by_file[v['file']].append(v)
    
    print(f"\nFiles with violations from modified files: {len(modified_by_file)}")
    print(f"Files with violations from unmodified files: {len(unmodified_by_file)}")
    
    if from_unmodified_files:
        print("\n" + "=" * 60)
        print("FALSE POSITIVE VIOLATIONS (Top 20)")
        print("=" * 60)
        for i, v in enumerate(from_unmodified_files[:20], 1):
            print(f"{i}. {v['file']}:{v['line']} - {v['date']}")
        if len(from_unmodified_files) > 20:
            print(f"\n... and {len(from_unmodified_files) - 20} more")

except Exception as e:
    print(f"\nError analyzing violations: {e}")
    import traceback
    traceback.print_exc()

