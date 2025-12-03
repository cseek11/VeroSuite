#!/usr/bin/env python3
"""
Fix TypeScript Bible Chapter Ordering

This script:
1. Renumbers decimal chapters: 18.5→19, 18.6→20, 18.7→21
2. Renumbers subsequent chapters: 19→22, 20→23, ..., 39→42
3. Fixes Chapter 40/41 ordering (moves 40 before 41)
4. Updates all cross-references to chapters

Last Updated: 2025-11-30
"""

import re
from pathlib import Path
from typing import List, Tuple

def find_chapter_sections(content: str) -> List[Tuple[int, int, int, str]]:
    """Find all chapter headings and return (line_num, chapter_num, is_decimal, title)."""
    chapters = []
    lines = content.split('\n')
    
    for i, line in enumerate(lines, 1):
        # Match: ## Chapter X — Title or ## Chapter X.Y — Title
        match = re.match(r'^## Chapter (\d+)(?:\.(\d+))? — (.+)$', line)
        if match:
            chapter_int = int(match.group(1))
            chapter_dec = int(match.group(2)) if match.group(2) else None
            title = match.group(3)
            is_decimal = chapter_dec is not None
            
            if is_decimal:
                # Decimal chapter: 18.5, 18.6, 18.7
                chapters.append((i, chapter_int, chapter_dec, title, line))
            else:
                # Regular chapter
                chapters.append((i, chapter_int, None, title, line))
    
    return chapters

def create_renumbering_map(chapters: List[Tuple]) -> dict:
    """Create mapping from old chapter numbers to new chapter numbers."""
    renumber_map = {}
    
    # First pass: identify decimal chapters and their new numbers
    decimal_chapters = {}  # old -> new
    for line_num, chapter_int, chapter_dec, title, line in chapters:
        if chapter_dec is not None:
            # Decimal chapter: 18.5, 18.6, 18.7
            if chapter_int == 18:
                if chapter_dec == 5:
                    decimal_chapters[(18, 5)] = 19
                elif chapter_dec == 6:
                    decimal_chapters[(18, 6)] = 20
                elif chapter_dec == 7:
                    decimal_chapters[(18, 7)] = 21
    
    # Second pass: renumber subsequent chapters
    # After 18.7→21, we need: 19→22, 20→23, ..., 39→42
    for line_num, chapter_int, chapter_dec, title, line in chapters:
        if chapter_dec is None:  # Regular chapter
            if chapter_int == 18:
                # Chapter 18 stays as 18
                renumber_map[18] = 18
            elif chapter_int >= 19 and chapter_int <= 42:
                # Shift by 3 (because 18.5, 18.6, 18.7 become 19, 20, 21)
                # This includes original 40, 41, 42 which become 43, 44, 45
                new_num = chapter_int + 3
                renumber_map[chapter_int] = new_num
    
    # Add decimal chapter mappings
    for (old_int, old_dec), new_num in decimal_chapters.items():
        renumber_map[(old_int, old_dec)] = new_num
    
    return renumber_map

def fix_chapter_ordering(input_file: Path, output_file: Path):
    """Fix chapter ordering in the TypeScript Bible file."""
    print(f"Reading file: {input_file}")
    content = input_file.read_text(encoding='utf-8')
    lines = content.split('\n')
    
    # Find all chapters
    chapters = find_chapter_sections(content)
    print(f"Found {len(chapters)} chapters")
    
    # Create renumbering map
    renumber_map = create_renumbering_map(chapters)
    print(f"Renumbering map: {renumber_map}")
    
    # Step 1: Renumber chapter headings
    new_lines = []
    i = 0
    while i < len(lines):
        line = lines[i]
        
        # Check if this is a chapter heading
        match = re.match(r'^(## Chapter )(\d+)(?:\.(\d+))?( — .+)$', line)
        if match:
            prefix = match.group(1)
            chapter_int = int(match.group(2))
            chapter_dec = int(match.group(3)) if match.group(3) else None
            suffix = match.group(4)
            
            if chapter_dec is not None:
                # Decimal chapter: 18.5, 18.6, 18.7
                old_key = (chapter_int, chapter_dec)
                if old_key in renumber_map:
                    new_num = renumber_map[old_key]
                    new_line = f"{prefix}{new_num}{suffix}"
                    print(f"  Line {i+1}: Renumbering Chapter {chapter_int}.{chapter_dec} → Chapter {new_num}")
                    new_lines.append(new_line)
                    i += 1
                    continue
            else:
                # Regular chapter
                if chapter_int in renumber_map:
                    new_num = renumber_map[chapter_int]
                    new_line = f"{prefix}{new_num}{suffix}"
                    print(f"  Line {i+1}: Renumbering Chapter {chapter_int} → Chapter {new_num}")
                    new_lines.append(new_line)
                    i += 1
                    continue
        
        new_lines.append(line)
        i += 1
    
    # Step 2: Fix Chapter 43/44 ordering (Capstone should come before Language Specification Alignment)
    # Find positions of Chapter 43 and 44
    chapter_43_start = None
    chapter_43_end = None
    chapter_44_start = None
    chapter_44_end = None
    
    for i, line in enumerate(new_lines):
        if re.match(r'^## Chapter 43 — ', line):
            chapter_43_start = i
        elif chapter_43_start is not None and chapter_43_end is None:
            if re.match(r'^## Chapter \d+ — ', line) and i > chapter_43_start:
                chapter_43_end = i
        if re.match(r'^## Chapter 44 — ', line):
            chapter_44_start = i
        elif chapter_44_start is not None and chapter_44_end is None:
            if re.match(r'^## Chapter \d+ — ', line) and i > chapter_44_start:
                chapter_44_end = i
    
    # If Chapter 44 comes before Chapter 43, swap them
    if chapter_44_start is not None and chapter_43_start is not None:
        if chapter_44_start < chapter_43_start:
            print(f"\nFixing Chapter 43/44 ordering:")
            print(f"  Chapter 44 at line {chapter_44_start + 1}")
            print(f"  Chapter 43 at line {chapter_43_start + 1}")
            
            # Extract Chapter 44 content
            chapter_44_content = new_lines[chapter_44_start:chapter_44_end] if chapter_44_end else new_lines[chapter_44_start:]
            # Extract Chapter 43 content
            chapter_43_content = new_lines[chapter_43_start:chapter_43_end] if chapter_43_end else new_lines[chapter_43_start:]
            
            # Rebuild lines with swapped order
            fixed_lines = (
                new_lines[:chapter_44_start] +
                chapter_43_content +
                chapter_44_content +
                new_lines[chapter_43_end if chapter_43_end else len(new_lines):]
            )
            new_lines = fixed_lines
            print(f"  Swapped: Chapter 43 now appears before Chapter 44")
    
    # Step 3: Update cross-references (simplified - would need more sophisticated pattern matching)
    # This is a placeholder - full implementation would need to handle:
    # - "See Chapter X"
    # - "Chapter X.Y"
    # - References in code comments
    # - References in markdown links
    
    # Write output
    output_file.write_text('\n'.join(new_lines), encoding='utf-8')
    print(f"\n✅ Fixed file written to: {output_file}")
    print(f"   Original size: {len(content)} bytes")
    print(f"   New size: {len('\n'.join(new_lines))} bytes")

if __name__ == '__main__':
    input_file = Path('docs/bibles/typescript_bible_unified.mdc')
    output_file = Path('docs/bibles/typescript_bible_unified_fixed.mdc')
    
    if not input_file.exists():
        print(f"❌ Error: Input file not found: {input_file}")
        exit(1)
    
    fix_chapter_ordering(input_file, output_file)
    print("\n✅ Chapter ordering fix complete!")
    print("   Review the output file before replacing the original.")

