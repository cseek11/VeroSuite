#!/usr/bin/env python3
"""Check for section number mismatches in split chapter files."""

import re
import sys
from pathlib import Path

def check_chapter_file(file_path: Path) -> list:
    """Check a single chapter file for section number mismatches."""
    chapter_num = int(file_path.stem.split('_')[0])
    mismatches = []
    
    with open(file_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    in_code_block = False
    
    for i, line in enumerate(lines, start=1):
        # Toggle in_code_block state
        if line.strip().startswith('```'):
            in_code_block = not in_code_block
            continue
        
        if in_code_block:
            continue
        
        # Check for section headers
        section_match = re.match(r'^###\s*(\d+)\.(\d+)\s*(.*)$', line)
        if section_match:
            section_chapter_num = int(section_match.group(1))
            section_num = section_match.group(2)
            section_title = section_match.group(3).strip()
            
            if section_chapter_num != chapter_num:
                mismatches.append({
                    'line': i,
                    'found': f"{section_chapter_num}.{section_num}",
                    'expected': f"{chapter_num}.{section_num}",
                    'title': section_title
                })
    
    return mismatches

def main():
    # Try multiple possible paths
    possible_paths = [
        Path('chapters'),  # If running from typescript_bible directory
        Path('docs/reference/Programming Bibles/bibles/typescript_bible/chapters'),  # If running from project root
        Path(__file__).parent.parent.parent / 'bibles' / 'typescript_bible' / 'chapters'  # Relative to script
    ]
    
    chapters_dir = None
    for path in possible_paths:
        if path.exists():
            chapters_dir = path
            break
    
    if not chapters_dir:
        print(f"Error: Chapters directory not found. Tried:")
        for path in possible_paths:
            print(f"  - {path}")
        sys.exit(1)
    
    all_mismatches = []
    
    for chapter_file in sorted(chapters_dir.glob('*.md')):
        mismatches = check_chapter_file(chapter_file)
        if mismatches:
            all_mismatches.append((chapter_file.name, mismatches))
    
    if all_mismatches:
        print("Found section number mismatches:\n")
        for filename, mismatches in all_mismatches:
            print(f"{filename}:")
            for m in mismatches:
                print(f"  Line {m['line']}: Found {m['found']}, expected {m['expected']} - {m['title']}")
            print()
        return 1
    else:
        print("No section number mismatches found.")
        return 0

if __name__ == "__main__":
    sys.exit(main())

