#!/usr/bin/env python3
"""Check for section number mismatches in TypeScript Bible source file."""

import re
from pathlib import Path

def check_section_numbers(source_file: Path):
    """Check all section numbers match their chapter numbers."""
    content = source_file.read_text(encoding='utf-8')
    lines = content.split('\n')

    current_chapter = None
    mismatches = []

    for i, line in enumerate(lines, start=1):
        # Check for chapter boundary
        ch_match = re.match(r'^<!--\s*SSM:CHUNK_BOUNDARY\s+id="ch(\d+)-start"\s*-->$', line)
        if ch_match:
            current_chapter = int(ch_match.group(1))
            continue
        
        # Check for chapter title
        title_match = re.match(r'^##\s+Chapter\s+(\d+)', line)
        if title_match:
            current_chapter = int(title_match.group(1))
            continue
        
        # Check for section number
        section_match = re.match(r'^###\s+(\d+)\.(\d+)', line)
        if section_match and current_chapter:
            section_chapter = int(section_match.group(1))
            section_num = int(section_match.group(2))
            if section_chapter != current_chapter:
                mismatches.append({
                    'line': i,
                    'chapter': current_chapter,
                    'section': f'{section_chapter}.{section_num}',
                    'content': line[:80]
                })

    return mismatches

if __name__ == '__main__':
    source_file = Path(__file__).parent.parent.parent.parent / 'bibles' / 'typescript_bible_unified.mdc'
    
    if not source_file.exists():
        # Try alternative path
        source_file = Path('docs/bibles/typescript_bible_unified.mdc')
    
    if not source_file.exists():
        print(f'Error: Source file not found at {source_file}')
        exit(1)
    
    mismatches = check_section_numbers(source_file)
    
    if mismatches:
        print(f'Found {len(mismatches)} section number mismatches:\n')
        for m in mismatches:
            print(f'Line {m["line"]}: Chapter {m["chapter"]} has section {m["section"]}')
            print(f'  Content: {m["content"]}')
            print()
    else:
        print('✅ No section number mismatches found!')









