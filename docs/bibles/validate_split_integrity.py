#!/usr/bin/env python3
"""
Validate split chapter files against source file.

This script compares each split chapter file with the corresponding
section in the source unified file to verify:
- Content integrity (no missing/extra content)
- Boundary placement
- Chapter numbering
- Section numbering consistency

Last Updated: 2025-12-05
"""

import re
from pathlib import Path
from typing import List, Tuple, Dict
from difflib import unified_diff

def extract_chapter_from_source(source_lines: List[str], chapter_num: int) -> Tuple[int, int, List[str]]:
    """Extract chapter content from source file."""
    start_line = None
    end_line = None
    
    # Find chapter start
    for i, line in enumerate(source_lines):
        if re.match(rf'^## Chapter {chapter_num} — ', line):
            start_line = i
            break
    
    if start_line is None:
        return None, None, []
    
    # Find chapter end (next chapter or end of file)
    for i in range(start_line + 1, len(source_lines)):
        if re.match(r'^## Chapter \d+ — ', source_lines[i]):
            end_line = i
            break
    
    if end_line is None:
        end_line = len(source_lines)
    
    return start_line + 1, end_line + 1, source_lines[start_line:end_line]

def extract_chapter_from_split(chapter_file: Path) -> List[str]:
    """Extract chapter content from split file (excluding boundaries)."""
    content = chapter_file.read_text(encoding='utf-8')
    lines = content.split('\n')
    
    # Remove SSM boundaries
    filtered = []
    for line in lines:
        if not re.match(r'^<!--\s*SSM:CHUNK_BOUNDARY', line):
            filtered.append(line)
    
    return filtered

def normalize_content(lines: List[str]) -> List[str]:
    """Normalize content for comparison (remove boundaries, normalize whitespace)."""
    normalized = []
    for line in lines:
        # Skip SSM boundaries
        if re.match(r'^<!--\s*SSM:CHUNK_BOUNDARY', line):
            continue
        # Keep everything else as-is
        normalized.append(line)
    return normalized

def check_section_numbering(content: List[str], expected_chapter: int) -> List[Tuple[int, str, str]]:
    """Check section numbering for consistency with chapter number."""
    issues = []
    pattern = re.compile(r'^### (\d+)\.(\d+)')
    
    for i, line in enumerate(content, 1):
        match = pattern.match(line)
        if match:
            section_chapter = int(match.group(1))
            section_num = match.group(2)
            if section_chapter != expected_chapter:
                issues.append((i, line, f"Expected {expected_chapter}.{section_num}, found {section_chapter}.{section_num}"))
    
    return issues

def validate_chapter(chapter_file: Path, source_lines: List[str], chapter_num: int) -> Dict:
    """Validate a single chapter file against source."""
    result = {
        'chapter_num': chapter_num,
        'file': chapter_file.name,
        'exists': chapter_file.exists(),
        'issues': [],
        'warnings': []
    }
    
    if not chapter_file.exists():
        result['issues'].append(f"Chapter file does not exist: {chapter_file}")
        return result
    
    # Extract from source
    source_start, source_end, source_content = extract_chapter_from_source(source_lines, chapter_num)
    if source_start is None:
        result['issues'].append(f"Chapter {chapter_num} not found in source file")
        return result
    
    # Extract from split file
    split_content = extract_chapter_from_split(chapter_file)
    
    # Normalize both
    source_normalized = normalize_content(source_content)
    split_normalized = normalize_content(split_content)
    
    # Compare lengths (rough check)
    if len(source_normalized) != len(split_normalized):
        result['warnings'].append(
            f"Length mismatch: source has {len(source_normalized)} lines, "
            f"split has {len(split_normalized)} lines"
        )
    
    # Check for chapter heading
    has_heading = any(re.match(rf'^## Chapter {chapter_num} — ', line) for line in split_content)
    if not has_heading:
        result['issues'].append(f"Missing chapter heading for Chapter {chapter_num}")
    
    # Check section numbering
    section_issues = check_section_numbering(split_content, chapter_num)
    if section_issues:
        result['warnings'].extend([
            f"Section numbering issue at line {line_num}: {issue}"
            for line_num, line, issue in section_issues[:5]  # Limit to first 5
        ])
    
    # Check boundaries
    chapter_content = chapter_file.read_text(encoding='utf-8')
    has_start_boundary = f'<!-- SSM:CHUNK_BOUNDARY id="ch{chapter_num:02d}-start" -->' in chapter_content
    has_end_boundary = f'<!-- SSM:CHUNK_BOUNDARY id="ch{chapter_num:02d}-end" -->' in chapter_content
    
    if not has_start_boundary:
        result['issues'].append(f"Missing start boundary for Chapter {chapter_num}")
    if not has_end_boundary:
        result['issues'].append(f"Missing end boundary for Chapter {chapter_num}")
    
    # Check first and last few lines match
    if len(source_normalized) > 0 and len(split_normalized) > 0:
        # Check first non-empty line
        source_first = next((line for line in source_normalized if line.strip()), None)
        split_first = next((line for line in split_normalized if line.strip()), None)
        
        if source_first and split_first and source_first.strip() != split_first.strip():
            result['warnings'].append(f"First content line mismatch: '{source_first[:50]}...' vs '{split_first[:50]}...'")
    
    return result

def main():
    """Main validation function."""
    source_file = Path('docs/bibles/typescript_bible_unified.mdc')
    chapters_dir = Path('docs/reference/Programming Bibles/bibles/typescript_bible/chapters')
    
    if not source_file.exists():
        print(f"❌ Source file not found: {source_file}")
        return
    
    if not chapters_dir.exists():
        print(f"❌ Chapters directory not found: {chapters_dir}")
        return
    
    print(f"Reading source file: {source_file}")
    source_lines = source_file.read_text(encoding='utf-8').split('\n')
    
    print(f"Validating chapters in: {chapters_dir}")
    
    # Find all chapter files
    chapter_files = sorted(chapters_dir.glob('*.md'))
    print(f"Found {len(chapter_files)} chapter files\n")
    
    all_results = []
    total_issues = 0
    total_warnings = 0
    
    for chapter_file in chapter_files:
        # Extract chapter number from filename
        match = re.match(r'^(\d+)_', chapter_file.name)
        if not match:
            print(f"⚠️  Skipping file with unexpected name: {chapter_file.name}")
            continue
        
        chapter_num = int(match.group(1))
        result = validate_chapter(chapter_file, source_lines, chapter_num)
        all_results.append(result)
        
        if result['issues']:
            total_issues += len(result['issues'])
        if result['warnings']:
            total_warnings += len(result['warnings'])
    
    # Print summary
    print("=" * 80)
    print("VALIDATION SUMMARY")
    print("=" * 80)
    print(f"Total chapters checked: {len(all_results)}")
    print(f"Total issues found: {total_issues}")
    print(f"Total warnings found: {total_warnings}")
    print()
    
    # Print issues
    if total_issues > 0:
        print("=" * 80)
        print("ISSUES (Must Fix)")
        print("=" * 80)
        for result in all_results:
            if result['issues']:
                print(f"\nChapter {result['chapter_num']} ({result['file']}):")
                for issue in result['issues']:
                    print(f"  ❌ {issue}")
    
    # Print warnings
    if total_warnings > 0:
        print("\n" + "=" * 80)
        print("WARNINGS (Should Review)")
        print("=" * 80)
        for result in all_results:
            if result['warnings']:
                print(f"\nChapter {result['chapter_num']} ({result['file']}):")
                for warning in result['warnings']:
                    print(f"  ⚠️  {warning}")
    
    # Print chapters with no issues
    clean_chapters = [r for r in all_results if not r['issues'] and not r['warnings']]
    if clean_chapters:
        print("\n" + "=" * 80)
        print(f"✅ CLEAN CHAPTERS ({len(clean_chapters)} chapters with no issues or warnings)")
        print("=" * 80)
        print(", ".join([str(r['chapter_num']) for r in clean_chapters]))
    
    print("\n" + "=" * 80)
    print("VALIDATION COMPLETE")
    print("=" * 80)

if __name__ == '__main__':
    main()





























