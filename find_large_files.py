#!/usr/bin/env python3
"""Find all files larger than 49MB in the project."""
from pathlib import Path
import os

def format_size(size_bytes):
    """Format file size in human-readable format."""
    for unit in ['B', 'KB', 'MB', 'GB']:
        if size_bytes < 1024.0:
            return f"{size_bytes:.2f} {unit}"
        size_bytes /= 1024.0
    return f"{size_bytes:.2f} TB"

def find_large_files(min_size_mb=49):
    """Find all files larger than specified size."""
    project_root = Path('.')
    min_size_bytes = min_size_mb * 1024 * 1024
    
    large_files = []
    
    print(f"Scanning project for files larger than {min_size_mb}MB...")
    print("=" * 100)
    
    # Walk through all files in the project
    for root, dirs, files in os.walk(project_root):
        # Skip common directories that shouldn't be scanned
        dirs[:] = [d for d in dirs if d not in ['.git', 'node_modules', '__pycache__', '.venv', 'venv', 'dist', 'build']]
        
        root_path = Path(root)
        
        # Skip if in .git directory
        if '.git' in root_path.parts:
            continue
        
        for file in files:
            file_path = root_path / file
            
            try:
                if file_path.is_file():
                    size = file_path.stat().st_size
                    if size >= min_size_bytes:
                        # Get relative path
                        try:
                            rel_path = file_path.relative_to(project_root)
                        except ValueError:
                            rel_path = file_path
                        
                        large_files.append((str(rel_path), size, file_path))
            except (OSError, PermissionError):
                # Skip files we can't access
                continue
    
    # Sort by size
    large_files.sort(key=lambda x: x[1], reverse=True)
    
    print(f"\nFound {len(large_files)} file(s) larger than {min_size_mb}MB:\n")
    print(f"{'#':<4} {'File Path':<70} {'Size':<15} {'Type':<10}")
    print("-" * 100)
    
    total_size = 0
    for i, (rel_path, size, full_path) in enumerate(large_files, 1):
        ext = full_path.suffix.lower() or '(no ext)'
        total_size += size
        
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
        elif ext == '.ssm':
            file_type = 'SSM Doc'
        else:
            file_type = ext[1:].upper() if ext != '(no ext)' else 'Unknown'
        
        print(f"{i:<4} {rel_path:<70} {format_size(size):<15} {file_type:<10}")
    
    print("-" * 100)
    print(f"{'Total':<4} {'':<70} {format_size(total_size):<15}")
    
    return large_files

if __name__ == '__main__':
    large_files = find_large_files(49)
    
    if large_files:
        print("\n" + "=" * 100)
        print("FILE ANALYSIS")
        print("=" * 100)
        
        for rel_path, size, full_path in large_files:
            print(f"\n{rel_path}")
            print(f"  Size: {format_size(size)}")
            print(f"  Type: {full_path.suffix}")
            print(f"  Location: {full_path.parent}")
            
            # Analyze file purpose
            path_lower = rel_path.lower()
            name_lower = full_path.name.lower()
            
            purpose = []
            
            if 'output' in name_lower or 'output' in path_lower:
                purpose.append("Appears to be an output/log file")
            if 'diagnostic' in name_lower or 'test' in name_lower:
                purpose.append("Likely a diagnostic or test output file")
            if 'watch' in name_lower:
                purpose.append("Appears to be a file watcher log")
            if 'backup' in name_lower or '.backup' in path_lower:
                purpose.append("Backup file - can be excluded from scanning")
            if 'reference' in path_lower or 'docs/reference' in path_lower:
                purpose.append("Reference documentation - can be excluded")
            if 'archive' in path_lower or 'archived' in path_lower:
                purpose.append("Archived file - can be excluded")
            if 'session' in name_lower:
                purpose.append("Session state file - may contain enforcement data")
            if 'enforcer' in name_lower or 'enforcement' in path_lower:
                purpose.append("Enforcement system file")
            if '.ssm.md' in path_lower:
                purpose.append("SSM (Structured System Model) documentation file")
            if 'bible' in path_lower:
                purpose.append("Reference documentation (Bible) - can be excluded")
            
            if not purpose:
                purpose.append("Unknown purpose - needs manual review")
            
            print(f"  Purpose: {'; '.join(purpose)}")
            
            # Check if file is readable (first few lines)
            try:
                with open(full_path, 'r', encoding='utf-8', errors='ignore') as f:
                    first_lines = [f.readline().strip() for _ in range(5)]
                    if any(first_lines):
                        print(f"  First line: {first_lines[0][:100]}...")
            except Exception as e:
                print(f"  Cannot read file: {e}")

