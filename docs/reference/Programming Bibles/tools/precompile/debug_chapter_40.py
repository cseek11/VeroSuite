#!/usr/bin/env python3
"""Debug script to trace Chapter 40 buffer content during split."""

import re
import sys
from pathlib import Path

# Add parent directory to path for imports
sys.path.insert(0, str(Path(__file__).parent.parent.parent))

from loaders.config_loader import load_config
from loaders.pattern_loader import PatternLoader

def debug_chapter_40(input_file: Path, config_path: Path):
    """Trace Chapter 40's buffer content during split simulation."""
    config = load_config(config_path)
    pattern_loader = PatternLoader(config)

    with open(input_file, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    # Simulate split logic for Chapter 40
    current_chapter_number = None
    buffer = []
    chapter_40_buffer = []
    in_chapter_40 = False
    
    for i, line in enumerate(lines, start=1):
        # Check for chapter boundary
        boundary_match = pattern_loader.match_chapter_boundary(line)
        if boundary_match and boundary_match.matched:
            chapter_num = boundary_match.chapter_number
            if "start" in line:
                if chapter_num == 40:
                    in_chapter_40 = True
                    print(f"Line {i}: Chapter 40 START - Buffer before clear: {len(buffer)} lines")
                    if buffer:
                        print(f"  Last 5 lines of buffer before Chapter 40:")
                        for bline in buffer[-5:]:
                            print(f"    {bline.strip()[:80]}")
                    buffer = [line]
                    chapter_40_buffer = [line]
                elif in_chapter_40:
                    # Chapter 40 ended
                    print(f"Line {i}: Chapter 40 END - Buffer has {len(chapter_40_buffer)} lines")
                    print(f"  First 10 lines of Chapter 40 buffer:")
                    for bline in chapter_40_buffer[:10]:
                        print(f"    {bline.strip()[:80]}")
                    print(f"  Checking for section numbers in Chapter 40 buffer:")
                    for bline in chapter_40_buffer:
                        section_match = re.match(r'^###\s*(\d+)\.(\d+)\s*(.*)$', bline)
                        if section_match:
                            section_chapter = int(section_match.group(1))
                            print(f"    Found: {bline.strip()} (Chapter {section_chapter})")
                    in_chapter_40 = False
                else:
                    # Other chapter - clear buffer
                    buffer = [line]
            continue
        
        # If in Chapter 40, track buffer
        if in_chapter_40:
            chapter_40_buffer.append(line)
            buffer.append(line)
        elif current_chapter_number is not None:
            buffer.append(line)

if __name__ == "__main__":
    input_file_path = Path('docs/bibles/typescript_bible_unified.mdc')
    config_file_path = Path('docs/reference/Programming Bibles/bibles/typescript_bible/config/bible_config.yaml')
    debug_chapter_40(input_file_path, config_file_path)










