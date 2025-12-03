#!/usr/bin/env python3
"""
Verify that compiled SSM output preserves all information from original markdown
"""
import re
from pathlib import Path
from collections import Counter

def extract_headings(text):
    """Extract all headings from markdown"""
    pattern = r'^(#{1,6})\s+(.+)$'
    headings = []
    for line in text.splitlines():
        match = re.match(pattern, line)
        if match:
            level = len(match.group(1))
            title = match.group(2).strip()
            headings.append((level, title))
    return headings

def extract_code_blocks(text):
    """Extract all code blocks"""
    pattern = r'```(\w+)?\n(.*?)```'
    blocks = []
    for match in re.finditer(pattern, text, re.DOTALL):
        lang = match.group(1) or 'plain'
        content = match.group(2).strip()
        blocks.append((lang, content[:100]))  # First 100 chars for comparison
    return blocks

def extract_tables(text):
    """Extract table structures"""
    lines = text.splitlines()
    tables = []
    in_table = False
    table_lines = []
    
    for line in lines:
        stripped = line.strip()
        if stripped.startswith('|') and stripped.endswith('|'):
            if not in_table:
                in_table = True
                table_lines = []
            table_lines.append(stripped)
        else:
            if in_table and len(table_lines) >= 2:
                tables.append('\n'.join(table_lines))
            in_table = False
            table_lines = []
    
    if in_table and len(table_lines) >= 2:
        tables.append('\n'.join(table_lines))
    
    return tables

def extract_chapters(text):
    """Extract chapter headings from markdown or SSM format"""
    chapters = []
    
    # Markdown format
    pattern = r'^##\s+Chapter\s+(\d+)\s*[–—\-]\s*(.+)$'
    for line in text.splitlines():
        match = re.match(pattern, line, re.IGNORECASE)
        if match:
            num = match.group(1)
            title = match.group(2).strip()
            chapters.append((num, title))
    
    # SSM format (::: chapter-meta blocks)
    ssm_pattern = r'code:\s*CH-(\d+)[^\n]*\ntitle:\s*(.+)$'
    for match in re.finditer(ssm_pattern, text, re.MULTILINE):
        num = match.group(1)
        title = match.group(2).strip()
        chapters.append((num, title))
    
    return chapters

def extract_parts(text):
    """Extract part headings from markdown or SSM format"""
    parts = []
    
    # Markdown format
    pattern = r'^#\s+PART\s+([IVXLC]+)\s*[–—-]\s*(.+)$'
    for line in text.splitlines():
        match = re.match(pattern, line, re.IGNORECASE)
        if match:
            part = match.group(1)
            title = match.group(2).strip()
            parts.append((part, title))
    
    # SSM format (::: part-meta blocks)
    ssm_pattern = r'block_type:\s*part[^\n]*\ntitle:\s*(.+)$'
    for match in re.finditer(ssm_pattern, text, re.MULTILINE):
        title = match.group(1).strip()
        parts.append(("", title))
    
    return parts

def count_content_elements(text):
    """Count various content elements"""
    return {
        'lines': len(text.splitlines()),
        'characters': len(text),
        'headings': len(extract_headings(text)),
        'code_blocks': len(extract_code_blocks(text)),
        'tables': len(extract_tables(text)),
        'chapters': len(extract_chapters(text)),
        'parts': len(extract_parts(text)),
    }

def verify_content_preservation(original_path, compiled_path):
    """Verify all content is preserved"""
    print("=" * 80)
    print("COMPILATION VERIFICATION REPORT")
    print("=" * 80)
    print()
    
    # Read files
    original = original_path.read_text(encoding="utf-8")
    compiled = compiled_path.read_text(encoding="utf-8")
    
    # Extract elements
    orig_elements = count_content_elements(original)
    comp_elements = count_content_elements(compiled)
    
    # Extract structured elements
    orig_chapters = extract_chapters(original)
    comp_chapters = extract_chapters(compiled)
    
    orig_parts = extract_parts(original)
    comp_parts = extract_parts(compiled)
    
    orig_code = extract_code_blocks(original)
    comp_code = extract_code_blocks(compiled)
    
    # Print comparison
    print("CONTENT ELEMENT COMPARISON:")
    print("-" * 80)
    print(f"{'Element':<20} {'Original':<15} {'Compiled':<15} {'Status':<15}")
    print("-" * 80)
    
    issues = []
    
    for key in ['parts', 'chapters', 'code_blocks', 'tables', 'headings']:
        orig_count = orig_elements[key]
        comp_count = comp_elements[key]
        status = "✅ OK" if comp_count >= orig_count else "❌ MISSING"
        if comp_count < orig_count:
            issues.append(f"{key}: {orig_count} → {comp_count} (lost {orig_count - comp_count})")
        print(f"{key:<20} {orig_count:<15} {comp_count:<15} {status:<15}")
    
    print()
    print("STRUCTURED ELEMENT VERIFICATION:")
    print("-" * 80)
    
    # Verify parts
    print(f"\nPARTS: {len(orig_parts)} in original, {len(comp_parts)} in compiled")
    if len(orig_parts) != len(comp_parts):
        print("⚠️  WARNING: Part count mismatch")
        issues.append(f"Parts: {len(orig_parts)} → {len(comp_parts)}")
    else:
        print("✅ All parts preserved")
        for orig_part, comp_part in zip(orig_parts, comp_parts):
            if orig_part != comp_part:
                issues.append(f"Part mismatch: {orig_part} vs {comp_part}")
    
    # Verify chapters
    print(f"\nCHAPTERS: {len(orig_chapters)} in original, {len(comp_chapters)} in compiled")
    if len(orig_chapters) != len(comp_chapters):
        print("⚠️  WARNING: Chapter count mismatch")
        issues.append(f"Chapters: {len(orig_chapters)} → {len(comp_chapters)}")
    else:
        print("✅ All chapters preserved")
        # Check first few chapters match
        for i, (orig_ch, comp_ch) in enumerate(zip(orig_chapters[:5], comp_chapters[:5])):
            if orig_ch != comp_ch:
                issues.append(f"Chapter {i+1} mismatch: {orig_ch} vs {comp_ch}")
    
    # Verify code blocks
    print(f"\nCODE BLOCKS: {len(orig_code)} in original, {len(comp_code)} in compiled")
    if len(comp_code) < len(orig_code):
        print(f"⚠️  WARNING: Lost {len(orig_code) - len(comp_code)} code blocks")
        issues.append(f"Code blocks: {len(orig_code)} → {len(comp_code)}")
    else:
        print("✅ All code blocks preserved (or more added by compiler)")
    
    # Check for key content
    print()
    print("KEY CONTENT VERIFICATION:")
    print("-" * 80)
    
    key_phrases = [
        "REGO & OPA Bible",
        "Chapter 1",
        "Chapter 18",
        "package",
        "allow if",
        "opa fmt",
        "with input as",
        "every",
        "some",
        "contains",
    ]
    
    for phrase in key_phrases:
        orig_count = original.count(phrase)
        comp_count = compiled.count(phrase)
        status = "✅" if comp_count >= orig_count * 0.9 else "❌"  # Allow 10% variance
        print(f"{phrase:<30} {orig_count:<5} → {comp_count:<5} {status}")
        if comp_count < orig_count * 0.9:
            issues.append(f"Key phrase '{phrase}': {orig_count} → {comp_count}")
    
    # Summary
    print()
    print("=" * 80)
    print("SUMMARY")
    print("=" * 80)
    
    if issues:
        print(f"❌ FOUND {len(issues)} POTENTIAL ISSUES:")
        for issue in issues:
            print(f"  - {issue}")
    else:
        print("✅ ALL CONTENT VERIFIED - No issues found")
    
    print()
    print(f"Original file: {orig_elements['characters']:,} characters, {orig_elements['lines']:,} lines")
    print(f"Compiled file: {comp_elements['characters']:,} characters, {comp_elements['lines']:,} lines")
    print(f"Size ratio: {comp_elements['characters'] / orig_elements['characters']:.2f}x")
    
    return len(issues) == 0

if __name__ == "__main__":
    script_dir = Path(__file__).parent
    original = script_dir.parent / "rego_opa_bible.md"
    compiled = script_dir.parent / "rego_opa_bible_compiled.ssm.md"
    
    if not original.exists():
        print(f"ERROR: Original file not found: {original}")
        exit(1)
    
    if not compiled.exists():
        print(f"ERROR: Compiled file not found: {compiled}")
        exit(1)
    
    success = verify_content_preservation(original, compiled)
    exit(0 if success else 1)

