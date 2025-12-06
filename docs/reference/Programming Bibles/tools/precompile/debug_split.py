#!/usr/bin/env python3
"""Debug script to trace what the split script processes for Chapter 38."""

import re
from pathlib import Path

def debug_chapter_38():
    """Debug Chapter 38 processing."""
    source_file = Path('docs/bibles/typescript_bible_unified.mdc')
    
    with open(source_file, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    # Find Chapter 38 boundaries
    ch38_start_idx = None
    ch38_end_idx = None
    
    for i, line in enumerate(lines):
        if '<!-- SSM:CHUNK_BOUNDARY id="ch38-start" -->' in line:
            ch38_start_idx = i
        if '<!-- SSM:CHUNK_BOUNDARY id="ch38-end" -->' in line:
            ch38_end_idx = i
            break
    
    if ch38_start_idx is None or ch38_end_idx is None:
        print("Could not find Chapter 38 boundaries")
        return
    
    print(f"Chapter 38 starts at line {ch38_start_idx + 1}")
    print(f"Chapter 38 ends at line {ch38_end_idx + 1}")
    print(f"Total lines in Chapter 38: {ch38_end_idx - ch38_start_idx + 1}")
    print("\nFirst 20 lines of Chapter 38:")
    print("".join(lines[ch38_start_idx:ch38_start_idx + 20]))
    print("\nLast 10 lines of Chapter 38:")
    print("".join(lines[ch38_end_idx - 9:ch38_end_idx + 1]))
    
    # Check for section numbers
    section_pattern = re.compile(r'^###\s*(\d+)\.(\d+)')
    sections = []
    for i in range(ch38_start_idx, ch38_end_idx + 1):
        match = section_pattern.match(lines[i])
        if match:
            sections.append((i + 1, match.group(1), match.group(2), lines[i].strip()))
    
    print(f"\nSection numbers found in Chapter 38:")
    for line_num, ch_num, sec_num, content in sections:
        print(f"  Line {line_num}: {content} (Chapter {ch_num}, Section {sec_num})")
        if int(ch_num) != 38:
            print(f"    ⚠️ MISMATCH: Expected Chapter 38, found Chapter {ch_num}")

if __name__ == '__main__':
    debug_chapter_38()


























