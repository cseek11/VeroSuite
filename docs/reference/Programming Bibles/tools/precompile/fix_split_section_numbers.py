#!/usr/bin/env python3
"""Fix section number mismatches in split chapter files."""

import re
import sys
from pathlib import Path

def fix_chapter_file(file_path: Path, dry_run: bool = False) -> int:
    """Fix section numbers in a single chapter file."""
    chapter_num = int(file_path.stem.split('_')[0])
    fixes = 0
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
        lines = content.split('\n')
    
    in_code_block = False
    fixed_lines = []
    
    for line in lines:
        original_line = line
        
        # Toggle in_code_block state
        if line.strip().startswith('```'):
            in_code_block = not in_code_block
            fixed_lines.append(line)
            continue
        
        if in_code_block:
            fixed_lines.append(line)
            continue
        
        # Check for section headers and fix if needed
        section_match = re.match(r'^###\s*(\d+)\.(\d+)(.*)$', line)
        if section_match:
            section_chapter_num = int(section_match.group(1))
            section_num = section_match.group(2)
            rest = section_match.group(3)
            
            if section_chapter_num != chapter_num:
                fixed_line = f"### {chapter_num}.{section_num}{rest}"
                fixed_lines.append(fixed_line)
                fixes += 1
                if not dry_run:
                    print(f"  Fixed: {line.strip()} → {fixed_line.strip()}")
                else:
                    print(f"  Would fix: {line.strip()} → {fixed_line.strip()}")
            else:
                fixed_lines.append(line)
        else:
            fixed_lines.append(line)
    
    if fixes > 0 and not dry_run:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write('\n'.join(fixed_lines))
            if not fixed_lines[-1].endswith('\n'):
                f.write('\n')
    
    return fixes

def main():
    import argparse
    parser = argparse.ArgumentParser(description='Fix section numbers in split chapter files')
    parser.add_argument('--dry-run', action='store_true', help='Show what would be fixed without making changes')
    args = parser.parse_args()
    
    chapters_dir = Path('docs/reference/Programming Bibles/bibles/typescript_bible/chapters')
    
    if not chapters_dir.exists():
        print(f"Error: Chapters directory not found at {chapters_dir}")
        sys.exit(1)
    
    total_fixes = 0
    files_fixed = 0
    
    for chapter_file in sorted(chapters_dir.glob('*.md')):
        fixes = fix_chapter_file(chapter_file, dry_run=args.dry_run)
        if fixes > 0:
            files_fixed += 1
            total_fixes += fixes
            print(f"{chapter_file.name}: {fixes} fixes")
    
    if total_fixes > 0:
        if args.dry_run:
            print(f"\n[DRY RUN] Would fix {total_fixes} section numbers in {files_fixed} files.")
        else:
            print(f"\nFixed {total_fixes} section numbers in {files_fixed} files.")
        return 0
    else:
        print("No section number mismatches found.")
        return 0

if __name__ == "__main__":
    sys.exit(main())









