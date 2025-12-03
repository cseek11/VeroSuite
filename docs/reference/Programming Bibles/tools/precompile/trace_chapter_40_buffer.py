#!/usr/bin/env python3
"""Trace the exact buffer content for Chapter 40 during split process."""

import sys
import re
from pathlib import Path

# Add parent directory to path for imports
sys.path.insert(0, str(Path(__file__).parent))

from loaders.config_loader import load_config
from loaders.pattern_loader import PatternLoader

def trace_chapter_40(input_file: Path, config_path: Path):
    """Trace Chapter 40's buffer content during split."""
    config = load_config(config_path)
    pattern_loader = PatternLoader(config)
    
    with open(input_file, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    # Simulate the split logic
    current_chapter_number = None
    current_chapter_title = None
    buffer = []
    
    for line_num, line in enumerate(lines, start=1):
        # Check for chapter boundary
        boundary_match = pattern_loader.match_chapter_boundary(line)
        if boundary_match and boundary_match.matched:
            # If we're finalizing Chapter 40, print buffer
            if current_chapter_number == 40:
                print(f"\n=== Chapter 40 Buffer at Line {line_num} (before finalization) ===")
                print(f"Buffer has {len(buffer)} lines")
                print("\nFirst 30 lines of buffer:")
                for i, buf_line in enumerate(buffer[:30]):
                    print(f"  {i+1:3d}: {buf_line.rstrip()}")
                print("\nSearching for section numbers in buffer:")
                for i, buf_line in enumerate(buffer):
                    section_match = re.match(r'^###\s*(\d+)\.(\d+)\s*(.*)$', buf_line)
                    if section_match:
                        section_chapter = int(section_match.group(1))
                        section_num = int(section_match.group(2))
                        print(f"  Line {i+1:3d}: {buf_line.rstrip()} (Chapter {section_chapter}, Section {section_num})")
                return
            
            # Start new chapter
            if current_chapter_number is not None:
                # Clear buffer for previous chapter
                buffer = []
            
            current_chapter_number = boundary_match.chapter_number
            current_chapter_title = None
            if current_chapter_number == 1:
                buffer.append(line)
            else:
                buffer = [line]
            continue
        
        # Check for chapter title
        title_match = pattern_loader.match_chapter_title(line)
        if title_match and title_match.matched:
            if current_chapter_number is not None and current_chapter_number != title_match.chapter_number:
                # Finalize previous chapter
                if current_chapter_number == 40:
                    print(f"\n=== Chapter 40 Buffer at Line {line_num} (before finalization from title mismatch) ===")
                    print(f"Buffer has {len(buffer)} lines")
                    print("\nFirst 30 lines of buffer:")
                    for i, buf_line in enumerate(buffer[:30]):
                        print(f"  {i+1:3d}: {buf_line.rstrip()}")
                    print("\nSearching for section numbers in buffer:")
                    for i, buf_line in enumerate(buffer):
                        section_match = re.match(r'^###\s*(\d+)\.(\d+)\s*(.*)$', buf_line)
                        if section_match:
                            section_chapter = int(section_match.group(1))
                            section_num = int(section_match.group(2))
                            print(f"  Line {i+1:3d}: {buf_line.rstrip()} (Chapter {section_chapter}, Section {section_num})")
                    return
                buffer = []
            
            if current_chapter_number is None:
                current_chapter_number = title_match.chapter_number
                current_chapter_title = title_match.title.strip() if title_match.title else None
                buffer = [line]
            else:
                if title_match.title:
                    current_chapter_title = title_match.title.strip()
                buffer.append(line)
            continue
        
        # Regular line
        buffer.append(line)
    
    # Check if Chapter 40 is the last chapter
    if current_chapter_number == 40:
        print(f"\n=== Chapter 40 Buffer at End of File ===")
        print(f"Buffer has {len(buffer)} lines")
        print("\nFirst 30 lines of buffer:")
        for i, buf_line in enumerate(buffer[:30]):
            print(f"  {i+1:3d}: {buf_line.rstrip()}")
        print("\nSearching for section numbers in buffer:")
        for i, buf_line in enumerate(buffer):
            section_match = re.match(r'^###\s*(\d+)\.(\d+)\s*(.*)$', buf_line)
            if section_match:
                section_chapter = int(section_match.group(1))
                section_num = int(section_match.group(2))
                print(f"  Line {i+1:3d}: {buf_line.rstrip()} (Chapter {section_chapter}, Section {section_num})")

if __name__ == "__main__":
    input_file = Path('../../../../bibles/typescript_bible_unified.mdc')
    config_file = Path('config/bible_config.yaml')
    trace_chapter_40(input_file, config_file)









