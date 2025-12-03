#!/usr/bin/env python3
"""
Compare compiled SSM output to original markdown to detect information loss.

This script performs a detailed comparison between the original markdown
and the compiled SSM output to identify any missing content.
"""
from __future__ import annotations

import sys
from pathlib import Path
import re
from collections import Counter

def extract_sections_from_markdown(md_path: str) -> dict:
    """Extract all sections, chapters, code blocks, tables from markdown."""
    with open(md_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    sections = {
        'chapters': [],
        'code_blocks': [],
        'tables': [],
        'diagrams': [],
        'headings': [],
        'total_lines': len(content.split('\n'))
    }
    
    lines = content.split('\n')
    
    # Extract chapters (## Chapter X)
    chapter_pattern = re.compile(r'^##\s+Chapter\s+(\d+)\s*[-—]\s*(.+)$')
    for i, line in enumerate(lines):
        match = chapter_pattern.match(line)
        if match:
            sections['chapters'].append({
                'number': int(match.group(1)),
                'title': match.group(2),
                'line': i + 1
            })
    
    # Extract all headings
    heading_pattern = re.compile(r'^(#{1,6})\s+(.+)$')
    for i, line in enumerate(lines):
        match = heading_pattern.match(line)
        if match:
            level = len(match.group(1))
            title = match.group(2)
            sections['headings'].append({
                'level': level,
                'title': title,
                'line': i + 1
            })
    
    # Extract code blocks
    in_code_block = False
    code_block_lang = None
    code_block_start = None
    code_content = []
    
    for i, line in enumerate(lines):
        if line.strip().startswith('```'):
            if in_code_block:
                # End of code block
                sections['code_blocks'].append({
                    'language': code_block_lang,
                    'content': '\n'.join(code_content),
                    'start_line': code_block_start,
                    'end_line': i + 1,
                    'line_count': len(code_content)
                })
                in_code_block = False
                code_content = []
            else:
                # Start of code block
                lang_match = re.match(r'^```(\w+)?', line)
                code_block_lang = lang_match.group(1) if lang_match else None
                code_block_start = i + 1
                in_code_block = True
        elif in_code_block:
            code_content.append(line)
    
    # Extract tables (markdown tables)
    table_pattern = re.compile(r'^\|.+\|$')
    in_table = False
    table_start = None
    table_rows = []
    
    for i, line in enumerate(lines):
        if table_pattern.match(line.strip()):
            if not in_table:
                in_table = True
                table_start = i + 1
                table_rows = []
            table_rows.append(line)
        elif in_table:
            # End of table
            if len(table_rows) >= 2:  # At least header + separator
                sections['tables'].append({
                    'start_line': table_start,
                    'end_line': i,
                    'row_count': len(table_rows),
                    'content': '\n'.join(table_rows[:3])  # First 3 rows for identification
                })
            in_table = False
            table_rows = []
    
    # Extract diagrams (mermaid, flowchart)
    in_diagram = False
    diagram_lang = None
    diagram_start = None
    diagram_content = []
    
    for i, line in enumerate(lines):
        if '```mermaid' in line or '```flowchart' in line or 'flowchart' in line.lower():
            if not in_diagram:
                diagram_lang = 'mermaid' if 'mermaid' in line else 'flowchart'
                diagram_start = i + 1
                in_diagram = True
                diagram_content = []
        elif in_diagram:
            if line.strip().startswith('```'):
                sections['diagrams'].append({
                    'type': diagram_lang,
                    'start_line': diagram_start,
                    'end_line': i + 1,
                    'content': '\n'.join(diagram_content[:5])  # First 5 lines
                })
                in_diagram = False
            else:
                diagram_content.append(line)
    
    return sections

def extract_sections_from_ssm(ssm_path: str) -> dict:
    """Extract sections from compiled SSM output."""
    with open(ssm_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    sections = {
        'chapters': [],
        'code_blocks': [],
        'tables': [],
        'diagrams': [],
        'concepts': [],
        'total_blocks': 0
    }
    
    lines = content.split('\n')
    
    # Extract chapter-meta blocks
    in_chapter_meta = False
    chapter_data = {}
    
    for i, line in enumerate(lines):
        if line.strip() == '::: chapter-meta':
            in_chapter_meta = True
            chapter_data = {}
        elif in_chapter_meta:
            if line.startswith('code:'):
                chapter_data['code'] = line.split(':', 1)[1].strip()
            elif line.startswith('title:'):
                chapter_data['title'] = line.split(':', 1)[1].strip()
            elif line.strip() == ':::' or (line.strip() == '' and chapter_data):
                if chapter_data:
                    sections['chapters'].append(chapter_data)
                    chapter_data = {}
                in_chapter_meta = False
    
    # Extract code blocks
    in_code_block = False
    code_data = {}
    
    for i, line in enumerate(lines):
        if '::: code' in line or '::: code-pattern' in line or '::: example' in line:
            in_code_block = True
            code_data = {'type': line.split(':::')[1].strip()}
        elif in_code_block:
            if line.startswith('language:'):
                code_data['language'] = line.split(':', 1)[1].strip()
            elif line.strip() == ':::' or (line.strip() == '' and code_data.get('language')):
                if code_data.get('language'):
                    sections['code_blocks'].append(code_data)
                    code_data = {}
                in_code_block = False
    
    # Extract table blocks
    in_table = False
    table_data = {}
    
    for i, line in enumerate(lines):
        if line.strip() == '::: table':
            in_table = True
            table_data = {}
        elif in_table:
            if line.startswith('row_count:'):
                table_data['row_count'] = int(line.split(':', 1)[1].strip())
            elif line.strip() == ':::' or (line.strip() == '' and table_data):
                if table_data:
                    sections['tables'].append(table_data)
                    table_data = {}
                in_table = False
    
    # Extract diagram blocks
    in_diagram = False
    diagram_data = {}
    
    for i, line in enumerate(lines):
        if line.strip() == '::: diagram':
            in_diagram = True
            diagram_data = {}
        elif in_diagram:
            if line.startswith('diagram_type:'):
                diagram_data['type'] = line.split(':', 1)[1].strip()
            elif line.strip() == ':::' or (line.strip() == '' and diagram_data):
                if diagram_data:
                    sections['diagrams'].append(diagram_data)
                    diagram_data = {}
                in_diagram = False
    
    # Count total blocks
    block_pattern = re.compile(r'^::: (\w+)')
    for line in lines:
        if block_pattern.match(line):
            sections['total_blocks'] += 1
    
    return sections

def compare_sections(original: dict, compiled: dict) -> dict:
    """Compare original and compiled sections to find differences."""
    differences = {
        'chapters': {
            'original_count': len(original['chapters']),
            'compiled_count': len(compiled['chapters']),
            'missing': [],
            'extra': []
        },
        'code_blocks': {
            'original_count': len(original['code_blocks']),
            'compiled_count': len(compiled['code_blocks']),
            'missing': [],
            'extra': []
        },
        'tables': {
            'original_count': len(original['tables']),
            'compiled_count': len(compiled['tables']),
            'missing': [],
            'extra': []
        },
        'diagrams': {
            'original_count': len(original['diagrams']),
            'compiled_count': len(compiled['diagrams']),
            'missing': [],
            'extra': []
        },
        'headings': {
            'original_count': len(original['headings']),
            'compiled_count': 0,  # SSM doesn't preserve all headings as separate blocks
        }
    }
    
    # Compare chapters
    original_chapter_codes = {ch['number']: ch for ch in original['chapters']}
    compiled_chapter_codes = {ch.get('code', ''): ch for ch in compiled['chapters'] if ch.get('code')}
    
    for num, ch in original_chapter_codes.items():
        code = f"CH-{num:02d}"
        if code not in compiled_chapter_codes:
            differences['chapters']['missing'].append({
                'number': num,
                'title': ch['title'],
                'line': ch['line']
            })
    
    # Compare code blocks (by language and approximate location)
    original_langs = Counter(blk['language'] for blk in original['code_blocks'] if blk['language'])
    compiled_langs = Counter(blk.get('language', 'unknown') for blk in compiled['code_blocks'])
    
    for lang, count in original_langs.items():
        compiled_count = compiled_langs.get(lang, 0)
        if compiled_count < count:
            differences['code_blocks']['missing'].append({
                'language': lang,
                'expected': count,
                'found': compiled_count
            })
    
    # Compare tables
    if len(original['tables']) > len(compiled['tables']):
        missing_count = len(original['tables']) - len(compiled['tables'])
        differences['tables']['missing'].append({
            'count': missing_count,
            'details': original['tables'][:missing_count]
        })
    
    # Compare diagrams
    if len(original['diagrams']) > len(compiled['diagrams']):
        missing_count = len(original['diagrams']) - len(compiled['diagrams'])
        differences['diagrams']['missing'].append({
            'count': missing_count,
            'details': original['diagrams'][:missing_count]
        })
    
    return differences

def main():
    original_path = Path("../rego_opa_bible.md")
    compiled_path = Path("rego_opa_bible_v3_final.ssm")
    
    if not original_path.exists():
        print(f"❌ Original file not found: {original_path}")
        sys.exit(1)
    
    if not compiled_path.exists():
        print(f"❌ Compiled file not found: {compiled_path}")
        print("   Please run the compiler first.")
        sys.exit(1)
    
    print("=" * 60)
    print("Comparing Original Markdown to Compiled SSM")
    print("=" * 60)
    
    print("\n📖 Extracting sections from original markdown...")
    original_sections = extract_sections_from_markdown(str(original_path))
    
    print(f"   Chapters: {len(original_sections['chapters'])}")
    print(f"   Code blocks: {len(original_sections['code_blocks'])}")
    print(f"   Tables: {len(original_sections['tables'])}")
    print(f"   Diagrams: {len(original_sections['diagrams'])}")
    print(f"   Headings: {len(original_sections['headings'])}")
    print(f"   Total lines: {original_sections['total_lines']}")
    
    print("\n📦 Extracting sections from compiled SSM...")
    compiled_sections = extract_sections_from_ssm(str(compiled_path))
    
    print(f"   Chapters: {len(compiled_sections['chapters'])}")
    print(f"   Code blocks: {len(compiled_sections['code_blocks'])}")
    print(f"   Tables: {len(compiled_sections['tables'])}")
    print(f"   Diagrams: {len(compiled_sections['diagrams'])}")
    print(f"   Total blocks: {compiled_sections['total_blocks']}")
    
    print("\n🔍 Comparing sections...")
    differences = compare_sections(original_sections, compiled_sections)
    
    print("\n" + "=" * 60)
    print("Comparison Results")
    print("=" * 60)
    
    # Chapters
    print(f"\n📚 Chapters:")
    print(f"   Original: {differences['chapters']['original_count']}")
    print(f"   Compiled: {differences['chapters']['compiled_count']}")
    if differences['chapters']['missing']:
        print(f"   ⚠️  Missing: {len(differences['chapters']['missing'])}")
        for ch in differences['chapters']['missing'][:5]:
            print(f"      - Chapter {ch['number']}: {ch['title']} (line {ch['line']})")
    else:
        print("   ✅ All chapters present")
    
    # Code blocks
    print(f"\n💻 Code Blocks:")
    print(f"   Original: {differences['code_blocks']['original_count']}")
    print(f"   Compiled: {differences['code_blocks']['compiled_count']}")
    if differences['code_blocks']['missing']:
        print(f"   ⚠️  Missing or reduced:")
        for blk in differences['code_blocks']['missing']:
            print(f"      - {blk['language']}: expected {blk['expected']}, found {blk['found']}")
    else:
        print("   ✅ All code blocks present")
    
    # Tables
    print(f"\n📊 Tables:")
    print(f"   Original: {differences['tables']['original_count']}")
    print(f"   Compiled: {differences['tables']['compiled_count']}")
    if differences['tables']['missing']:
        print(f"   ⚠️  Missing: {len(differences['tables']['missing'])}")
    else:
        print("   ✅ All tables present")
    
    # Diagrams
    print(f"\n📈 Diagrams:")
    print(f"   Original: {differences['diagrams']['original_count']}")
    print(f"   Compiled: {differences['diagrams']['compiled_count']}")
    if differences['diagrams']['missing']:
        print(f"   ⚠️  Missing: {len(differences['diagrams']['missing'])}")
    else:
        print("   ✅ All diagrams present")
    
    # Summary
    total_issues = (
        len(differences['chapters']['missing']) +
        len(differences['code_blocks']['missing']) +
        len(differences['tables']['missing']) +
        len(differences['diagrams']['missing'])
    )
    
    print("\n" + "=" * 60)
    if total_issues == 0:
        print("✅ No information loss detected!")
    else:
        print(f"⚠️  {total_issues} potential issues found")
    print("=" * 60)

if __name__ == "__main__":
    main()

