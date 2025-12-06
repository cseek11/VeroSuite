#!/usr/bin/env python3
"""
Analyze file sizes of files scanned by the enforcer.
Shows breakdown of all files and highlights files > 500KB.
"""
from pathlib import Path
from collections import defaultdict
from enforcement.core.git_utils import GitUtils, get_git_state_key

def format_size(size_bytes):
    """Format file size in human-readable format."""
    for unit in ['B', 'KB', 'MB', 'GB']:
        if size_bytes < 1024.0:
            return f"{size_bytes:.2f} {unit}"
        size_bytes /= 1024.0
    return f"{size_bytes:.2f} TB"

def analyze_file_sizes():
    """Analyze file sizes of scanned files."""
    project_root = Path('.')
    git_utils = GitUtils(project_root)
    cache_key = get_git_state_key(project_root)
    git_utils.update_cache(cache_key)
    
    # Get all changed files (tracked + untracked)
    changed_files = git_utils.get_cached_changed_files()
    
    if not changed_files:
        print("No changed files found")
        return
    
    tracked_files = changed_files.get('tracked', [])
    untracked_files = changed_files.get('untracked', [])
    all_files = tracked_files + untracked_files
    
    print("=" * 80)
    print("SCANNED FILE SIZE ANALYSIS")
    print("=" * 80)
    print(f"\nTotal files scanned: {len(all_files)}")
    print(f"  Tracked files: {len(tracked_files)}")
    print(f"  Untracked files: {len(untracked_files)}")
    
    # Analyze file sizes
    file_sizes = []
    size_by_extension = defaultdict(lambda: {'count': 0, 'total_size': 0, 'files': []})
    large_files = []  # Files > 500KB
    
    for file_path_str in all_files:
        file_path = project_root / file_path_str
        
        if not file_path.exists() or file_path.is_dir():
            continue
        
        try:
            size = file_path.stat().st_size
            file_sizes.append((file_path_str, size))
            
            # Group by extension
            ext = file_path.suffix.lower() or '(no extension)'
            size_by_extension[ext]['count'] += 1
            size_by_extension[ext]['total_size'] += size
            size_by_extension[ext]['files'].append((file_path_str, size))
            
            # Track large files (> 500KB)
            if size > 500 * 1024:  # 500KB
                large_files.append((file_path_str, size))
        except (OSError, PermissionError) as e:
            # Skip files we can't access
            continue
    
    # Sort by size
    file_sizes.sort(key=lambda x: x[1], reverse=True)
    large_files.sort(key=lambda x: x[1], reverse=True)
    
    # Overall statistics
    total_size = sum(size for _, size in file_sizes)
    avg_size = total_size / len(file_sizes) if file_sizes else 0
    median_size = sorted([size for _, size in file_sizes])[len(file_sizes) // 2] if file_sizes else 0
    
    print(f"\nTotal size of all scanned files: {format_size(total_size)}")
    print(f"Average file size: {format_size(avg_size)}")
    print(f"Median file size: {format_size(median_size)}")
    
    # Show large files (> 500KB)
    print("\n" + "=" * 80)
    print(f"FILES LARGER THAN 500KB ({len(large_files)} files)")
    print("=" * 80)
    
    if large_files:
        total_large_size = sum(size for _, size in large_files)
        print(f"Total size of large files: {format_size(total_large_size)}")
        print(f"Percentage of total: {total_large_size / total_size * 100:.1f}%")
        print("\nTop 20 largest files:")
        print(f"{'File':<70} {'Size':<15} {'% of Total':<10}")
        print("-" * 95)
        
        for file_path_str, size in large_files[:20]:
            pct = (size / total_size * 100) if total_size > 0 else 0
            # Truncate long paths
            display_path = file_path_str if len(file_path_str) <= 70 else "..." + file_path_str[-67:]
            print(f"{display_path:<70} {format_size(size):<15} {pct:>6.2f}%")
        
        if len(large_files) > 20:
            print(f"\n... and {len(large_files) - 20} more large files")
    else:
        print("No files larger than 500KB found")
    
    # Show breakdown by file extension
    print("\n" + "=" * 80)
    print("BREAKDOWN BY FILE EXTENSION")
    print("=" * 80)
    print(f"{'Extension':<20} {'Count':<10} {'Total Size':<15} {'Avg Size':<15} {'% of Total':<10}")
    print("-" * 80)
    
    # Sort by total size
    sorted_extensions = sorted(
        size_by_extension.items(),
        key=lambda x: x[1]['total_size'],
        reverse=True
    )
    
    for ext, data in sorted_extensions[:20]:  # Top 20 extensions
        avg = data['total_size'] / data['count'] if data['count'] > 0 else 0
        pct = (data['total_size'] / total_size * 100) if total_size > 0 else 0
        print(f"{ext:<20} {data['count']:<10} {format_size(data['total_size']):<15} {format_size(avg):<15} {pct:>6.2f}%")
    
    # Show size distribution
    print("\n" + "=" * 80)
    print("SIZE DISTRIBUTION")
    print("=" * 80)
    
    size_ranges = [
        (0, 1 * 1024, "0-1 KB"),
        (1 * 1024, 10 * 1024, "1-10 KB"),
        (10 * 1024, 100 * 1024, "10-100 KB"),
        (100 * 1024, 500 * 1024, "100-500 KB"),
        (500 * 1024, 1 * 1024 * 1024, "500 KB-1 MB"),
        (1 * 1024 * 1024, 5 * 1024 * 1024, "1-5 MB"),
        (5 * 1024 * 1024, float('inf'), "> 5 MB"),
    ]
    
    print(f"{'Size Range':<20} {'Count':<10} {'Total Size':<15} {'% of Files':<10} {'% of Size':<10}")
    print("-" * 75)
    
    for min_size, max_size, label in size_ranges:
        matching = [(f, s) for f, s in file_sizes if min_size <= s < max_size]
        count = len(matching)
        total = sum(s for _, s in matching)
        pct_files = (count / len(file_sizes) * 100) if file_sizes else 0
        pct_size = (total / total_size * 100) if total_size > 0 else 0
        print(f"{label:<20} {count:<10} {format_size(total):<15} {pct_files:>6.2f}% {pct_size:>6.2f}%")

if __name__ == '__main__':
    analyze_file_sizes()

