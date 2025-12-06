#!/usr/bin/env python3
"""
Check if source file is ready for splitting.

This script validates:
- Chapter heading format consistency
- Chapter numbering sequence
- Section numbering consistency
- SSM boundaries presence
- Overall structure

Last Updated: 2025-12-05
"""

import re
from pathlib import Path
from typing import List, Tuple, Dict

def check_source_file(source_path: Path) -> Dict:
    """Check source file for split readiness."""
    result = {
        'ready': True,
        'issues': [],
        'warnings': [],
        'chapters': [],
        'stats': {}
    }
    
    if not source_path.exists():
        result['ready'] = False
        result['issues'].append(f"Source file not found: {source_path}")
        return result
    
    content = source_path.read_text(encoding='utf-8')
    lines = content.split('\n')
    
    # Check chapter headings
    chapter_pattern = re.compile(r'^## Chapter (\d+) — (.+)$')
    chapters_found = []
    
    for i, line in enumerate(lines, 1):
        match = chapter_pattern.match(line)
        if match:
            chapter_num = int(match.group(1))
            title = match.group(2)
            chapters_found.append((i, chapter_num, title))
    
    result['stats']['total_chapters'] = len(chapters_found)
    result['chapters'] = chapters_found
    
    # Check for missing "—" separator
    malformed_headings = []
    for i, line in enumerate(lines, 1):
        if re.match(r'^## Chapter \d+[^—]', line):
            malformed_headings.append((i, line))
    
    if malformed_headings:
        result['ready'] = False
        result['issues'].extend([
            f"Malformed heading at line {line_num}: {line[:80]}"
            for line_num, line in malformed_headings
        ])
    
    # Check chapter numbering sequence
    chapter_nums = [ch[1] for ch in chapters_found]
    expected_sequence = list(range(1, len(chapters_found) + 1))
    
    if chapter_nums != expected_sequence:
        result['ready'] = False
        result['issues'].append(
            f"Chapter numbering not sequential. Found: {chapter_nums[:10]}... "
            f"Expected: {expected_sequence[:10]}..."
        )
    
    # Check for duplicate chapter numbers
    seen = set()
    duplicates = []
    for line_num, chapter_num, title in chapters_found:
        if chapter_num in seen:
            duplicates.append((line_num, chapter_num, title))
        seen.add(chapter_num)
    
    if duplicates:
        result['ready'] = False
        result['issues'].extend([
            f"Duplicate chapter number {ch_num} at line {line_num}: {title}"
            for line_num, ch_num, title in duplicates
        ])
    
    # Check section numbering for chapters 19, 20, 21
    section_issues = []
    for line_num, chapter_num, title in chapters_found:
        if chapter_num in [19, 20, 21]:
            # Find all sections in this chapter
            chapter_start = line_num
            chapter_end = chapters_found[chapters_found.index((line_num, chapter_num, title)) + 1][0] if chapters_found.index((line_num, chapter_num, title)) + 1 < len(chapters_found) else len(lines)
            
            # Check section numbers
            for i in range(chapter_start, min(chapter_end, len(lines))):
                section_match = re.match(r'^### (\d+)\.(\d+)', lines[i])
                if section_match:
                    section_chapter = int(section_match.group(1))
                    if section_chapter != chapter_num:
                        section_issues.append((i + 1, chapter_num, section_chapter, lines[i][:60]))
    
    if section_issues:
        result['warnings'].extend([
            f"Chapter {ch_num} has section numbered {section_ch} at line {line_num}: {line}"
            for line_num, ch_num, section_ch, line in section_issues[:10]
        ])
    
    # Check SSM boundaries
    ssm_start_count = len(re.findall(r'<!--\s*SSM:CHUNK_BOUNDARY\s+id="ch\d+-start"\s*-->', content))
    ssm_end_count = len(re.findall(r'<!--\s*SSM:CHUNK_BOUNDARY\s+id="ch\d+-end"\s*-->', content))
    
    result['stats']['ssm_start_boundaries'] = ssm_start_count
    result['stats']['ssm_end_boundaries'] = ssm_end_count
    result['stats']['expected_boundaries'] = len(chapters_found) * 2
    
    if ssm_start_count != len(chapters_found) or ssm_end_count != len(chapters_found):
        result['warnings'].append(
            f"SSM boundary mismatch: Found {ssm_start_count} start, {ssm_end_count} end, "
            f"expected {len(chapters_found)} each"
        )
    
    # Check for Part headers
    part_headers = [i for i, line in enumerate(lines, 1) if re.match(r'^# PART ', line)]
    result['stats']['part_headers'] = len(part_headers)
    
    return result

def main():
    """Main function."""
    source_file = Path('docs/bibles/typescript_bible_unified.mdc')
    
    print("=" * 80)
    print("SOURCE FILE READINESS CHECK")
    print("=" * 80)
    print(f"Checking: {source_file}\n")
    
    result = check_source_file(source_file)
    
    # Print statistics
    print("STATISTICS")
    print("-" * 80)
    print(f"Total chapters found: {result['stats']['total_chapters']}")
    print(f"SSM start boundaries: {result['stats']['ssm_start_boundaries']}")
    print(f"SSM end boundaries: {result['stats']['ssm_end_boundaries']}")
    print(f"Expected boundaries: {result['stats']['expected_boundaries']}")
    print(f"Part headers: {result['stats']['part_headers']}")
    print()
    
    # Print chapter list
    if result['chapters']:
        print("CHAPTERS FOUND")
        print("-" * 80)
        for line_num, chapter_num, title in result['chapters']:
            print(f"  Chapter {chapter_num:2d} (line {line_num:5d}): {title}")
        print()
    
    # Print issues
    if result['issues']:
        print("=" * 80)
        print("ISSUES (Must Fix)")
        print("=" * 80)
        for issue in result['issues']:
            print(f"  ❌ {issue}")
        print()
    
    # Print warnings
    if result['warnings']:
        print("=" * 80)
        print("WARNINGS (Should Review)")
        print("=" * 80)
        for warning in result['warnings']:
            print(f"  ⚠️  {warning}")
        print()
    
    # Print readiness status
    print("=" * 80)
    if result['ready']:
        print("✅ STATUS: READY FOR SPLITTING")
    else:
        print("❌ STATUS: NOT READY - ISSUES FOUND")
    print("=" * 80)
    
    return result

if __name__ == '__main__':
    main()





























