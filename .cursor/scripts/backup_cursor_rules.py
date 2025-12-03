#!/usr/bin/env python3
"""
Backup all Cursor rules and configuration files.

This script creates a timestamped backup of all Cursor-related files including:
- .cursor/rules/ - All rule files
- .cursor/prompts/ - Prompt files
- .cursor/patterns/ - Pattern files
- .cursor/memory-bank/ - Memory bank files
- .cursor/enforcement/ - Enforcement system files
- .cursor/context_manager/ - Context manager files
- .cursorrules - Root Cursor rules file
- Other configuration files
"""

import os
import shutil
import json
from pathlib import Path
from datetime import datetime
from typing import List, Dict

def get_backup_timestamp() -> str:
    """Get current timestamp for backup directory name."""
    return datetime.now().strftime('%Y-%m-%d_%H-%M-%S')

def create_backup_directory(base_dir: Path, timestamp: str) -> Path:
    """Create backup directory with timestamp."""
    backup_dir = base_dir / 'backups' / f'cursor_rules_backup_{timestamp}'
    backup_dir.mkdir(parents=True, exist_ok=True)
    return backup_dir

def copy_directory(src: Path, dst: Path, exclude_dirs: List[str] = None) -> int:
    """Copy directory recursively, excluding specified directories."""
    if exclude_dirs is None:
        exclude_dirs = ['__pycache__', '.git', 'node_modules']
    
    file_count = 0
    
    if not src.exists():
        return file_count
    
    for root, dirs, files in os.walk(src):
        # Remove excluded directories from dirs list
        dirs[:] = [d for d in dirs if d not in exclude_dirs]
        
        # Calculate relative path
        rel_path = os.path.relpath(root, src)
        dst_dir = dst / rel_path if rel_path != '.' else dst
        dst_dir.mkdir(parents=True, exist_ok=True)
        
        # Copy files
        for file in files:
            src_file = Path(root) / file
            dst_file = dst_dir / file
            shutil.copy2(src_file, dst_file)
            file_count += 1
    
    return file_count

def copy_file(src: Path, dst: Path) -> bool:
    """Copy a single file."""
    if src.exists():
        shutil.copy2(src, dst)
        return True
    return False

def create_backup_manifest(backup_dir: Path) -> Dict:
    """Create manifest of all backed up files."""
    manifest = {
        'backup_date': datetime.now().isoformat(),
        'backup_location': str(backup_dir),
        'files': []
    }
    
    for root, dirs, files in os.walk(backup_dir):
        for file in files:
            file_path = Path(root) / file
            rel_path = file_path.relative_to(backup_dir)
            file_size = file_path.stat().st_size
            manifest['files'].append({
                'path': str(rel_path).replace('\\', '/'),
                'size': file_size
            })
    
    return manifest

def create_backup_readme(backup_dir: Path, timestamp: str, file_count: int, total_size: float) -> None:
    """Create README file for the backup."""
    readme_content = f"""# Cursor Rules Backup

**Backup Date:** {timestamp.replace('_', ' ')}
**Backup Location:** {backup_dir}
**Total Files:** {file_count}
**Total Size:** {total_size:.2f} MB

## Contents

This backup contains all Cursor rules and configuration files:

- **rules/** - All rule files (.mdc and .md files)
- **prompts/** - All prompt files for different review modes
- **patterns/** - Golden patterns and pattern index
- **memory-bank/** - Memory bank files (project context)
- **enforcement/** - Enforcement system files
- **context_manager/** - Context management system files
- **.cursorrules** - Root Cursor rules file
- **agents.json** - Agent configuration
- **golden_patterns.md** - Pattern index
- **anti_patterns.md** - Anti-patterns log
- **BUG_LOG.md** - Bug tracking log
- **reward_rubric.yaml** - Reward scoring configuration
- **README.md** - Cursor system documentation

## Restoration

To restore this backup:

1. Copy the contents of this backup directory back to their original locations
2. Ensure file paths match the original structure
3. Verify all files are in place

## Notes

- This backup was created automatically
- All file timestamps are preserved
- See BACKUP_MANIFEST.json for complete file list
"""
    
    readme_path = backup_dir / 'README.md'
    readme_path.write_text(readme_content, encoding='utf-8')

def main():
    """Main backup function."""
    # Get project root (assuming script is in .cursor/scripts/)
    project_root = Path(__file__).parent.parent.parent
    cursor_dir = project_root / '.cursor'
    
    # Create backup directory
    timestamp = get_backup_timestamp()
    backup_dir = create_backup_directory(cursor_dir, timestamp)
    
    print(f"Creating backup in: {backup_dir}")
    
    file_count = 0
    total_size = 0
    
    # Backup directories
    dirs_to_backup = [
        ('rules', 'rules'),
        ('prompts', 'prompts'),
        ('patterns', 'patterns'),
        ('memory-bank', 'memory-bank'),
        ('enforcement', 'enforcement'),
        ('context_manager', 'context_manager'),
    ]
    
    for src_name, dst_name in dirs_to_backup:
        src_path = cursor_dir / src_name
        dst_path = backup_dir / dst_name
        
        if src_path.exists():
            count = copy_directory(src_path, dst_path)
            file_count += count
            print(f"  ✓ Backed up {src_name}/ ({count} files)")
        else:
            print(f"  ⚠ Skipped {src_name}/ (not found)")
    
    # Backup individual files
    files_to_backup = [
        (project_root / '.cursorrules', backup_dir / '.cursorrules'),
        (cursor_dir / 'agents.json', backup_dir / 'agents.json'),
        (cursor_dir / 'golden_patterns.md', backup_dir / 'golden_patterns.md'),
        (cursor_dir / 'anti_patterns.md', backup_dir / 'anti_patterns.md'),
        (cursor_dir / 'BUG_LOG.md', backup_dir / 'BUG_LOG.md'),
        (cursor_dir / 'reward_rubric.yaml', backup_dir / 'reward_rubric.yaml'),
        (cursor_dir / 'README.md', backup_dir / 'README.md'),
        (cursor_dir / 'DEPRECATED_RULES.md', backup_dir / 'DEPRECATED_RULES.md'),
        (cursor_dir / 'PYTHON_LEARNINGS_LOG.md', backup_dir / 'PYTHON_LEARNINGS_LOG.md'),
    ]
    
    for src_path, dst_path in files_to_backup:
        if copy_file(src_path, dst_path):
            file_count += 1
            print(f"  ✓ Backed up {src_path.name}")
    
    # Calculate total size
    for file_info in create_backup_manifest(backup_dir)['files']:
        total_size += file_info['size']
    total_size_mb = total_size / (1024 * 1024)
    
    # Create manifest
    manifest = create_backup_manifest(backup_dir)
    manifest_path = backup_dir / 'BACKUP_MANIFEST.json'
    manifest_path.write_text(json.dumps(manifest, indent=2), encoding='utf-8')
    
    # Create README
    create_backup_readme(backup_dir, timestamp, file_count, total_size_mb)
    
    print(f"\n✓ Backup complete!")
    print(f"  Files: {file_count}")
    print(f"  Size: {total_size_mb:.2f} MB")
    print(f"  Location: {backup_dir}")

if __name__ == '__main__':
    main()








