#!/usr/bin/env python3
"""Show all files larger than 500KB with full details."""
from pathlib import Path
from enforcement.core.git_utils import GitUtils, get_git_state_key

def format_size(size_bytes):
    """Format file size in human-readable format."""
    for unit in ['B', 'KB', 'MB', 'GB']:
        if size_bytes < 1024.0:
            return f"{size_bytes:.2f} {unit}"
        size_bytes /= 1024.0
    return f"{size_bytes:.2f} TB"

def show_large_files():
    """Show all files larger than 500KB."""
    project_root = Path('.')
    git_utils = GitUtils(project_root)
    cache_key = get_git_state_key(project_root)
    git_utils.update_cache(cache_key)
    
    # Get all changed files
    changed_files = git_utils.get_cached_changed_files()
    
    if not changed_files:
        print("No changed files found")
        return
    
    tracked_files = changed_files.get('tracked', [])
    untracked_files = changed_files.get('untracked', [])
    all_files = tracked_files + untracked_files
    
    # Find large files
    large_files = []
    
    for file_path_str in all_files:
        file_path = project_root / file_path_str
        
        if not file_path.exists() or file_path.is_dir():
            continue
        
        try:
            size = file_path.stat().st_size
            if size > 500 * 1024:  # 500KB
                large_files.append((file_path_str, size))
        except (OSError, PermissionError):
            continue
    
    # Sort by size
    large_files.sort(key=lambda x: x[1], reverse=True)
    
    print("=" * 100)
    print(f"ALL FILES LARGER THAN 500KB ({len(large_files)} files)")
    print("=" * 100)
    print(f"{'#':<4} {'File Path':<70} {'Size':<15} {'Type':<10}")
    print("-" * 100)
    
    total_size = sum(size for _, size in large_files)
    
    for i, (file_path_str, size) in enumerate(large_files, 1):
        file_path = Path(file_path_str)
        ext = file_path.suffix.lower() or '(no ext)'
        
        # Determine file type
        if ext == '.txt':
            file_type = 'Text/Log'
        elif ext == '.json':
            file_type = 'JSON'
        elif ext == '.md':
            file_type = 'Markdown'
        elif ext == '.backup':
            file_type = 'Backup'
        elif ext == '.py':
            file_type = 'Python'
        else:
            file_type = ext[1:].upper() if ext != '(no ext)' else 'Unknown'
        
        print(f"{i:<4} {file_path_str:<70} {format_size(size):<15} {file_type:<10}")
    
    print("-" * 100)
    print(f"{'Total':<4} {'':<70} {format_size(total_size):<15}")
    
    # Show breakdown by type
    print("\n" + "=" * 100)
    print("BREAKDOWN BY FILE TYPE")
    print("=" * 100)
    
    by_type = {}
    for file_path_str, size in large_files:
        file_path = Path(file_path_str)
        ext = file_path.suffix.lower() or '(no ext)'
        
        if ext == '.txt':
            file_type = 'Text/Log Files'
        elif ext == '.json':
            file_type = 'JSON Files'
        elif ext == '.md':
            file_type = 'Markdown Files'
        elif ext == '.backup':
            file_type = 'Backup Files'
        elif ext == '.py':
            file_type = 'Python Files'
        else:
            file_type = f'{ext[1:].upper()} Files' if ext != '(no ext)' else 'Other Files'
        
        if file_type not in by_type:
            by_type[file_type] = {'count': 0, 'total_size': 0, 'files': []}
        
        by_type[file_type]['count'] += 1
        by_type[file_type]['total_size'] += size
        by_type[file_type]['files'].append((file_path_str, size))
    
    print(f"{'Type':<25} {'Count':<10} {'Total Size':<15} {'Avg Size':<15} {'% of Large Files':<15}")
    print("-" * 80)
    
    for file_type, data in sorted(by_type.items(), key=lambda x: x[1]['total_size'], reverse=True):
        avg = data['total_size'] / data['count'] if data['count'] > 0 else 0
        pct = (data['total_size'] / total_size * 100) if total_size > 0 else 0
        print(f"{file_type:<25} {data['count']:<10} {format_size(data['total_size']):<15} {format_size(avg):<15} {pct:>6.2f}%")

if __name__ == '__main__':
    show_large_files()

