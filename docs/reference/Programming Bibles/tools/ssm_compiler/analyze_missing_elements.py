#!/usr/bin/env python3
"""
Analyze compiled SSM file for missing V3 elements
"""
import re
from pathlib import Path
from collections import Counter

def analyze_ssm_file(file_path):
    """Analyze SSM file for missing elements"""
    text = file_path.read_text(encoding="utf-8")
    
    print("=" * 80)
    print("SSM V3 COMPILATION ANALYSIS")
    print("=" * 80)
    print()
    
    # 1. Block type analysis
    print("1. BLOCK TYPE ANALYSIS:")
    print("-" * 80)
    block_pattern = r'^::: (\w+)'
    block_types = re.findall(block_pattern, text, re.MULTILINE)
    block_counts = Counter(block_types)
    
    expected_blocks = [
        'chapter-meta', 'term', 'section', 'paragraph',
        'example', 'concept', 'qa', 'pattern', 'antipattern',
        'diagram', 'relation', 'rationale', 'code'
    ]
    
    for block_type in expected_blocks:
        count = block_counts.get(block_type, 0)
        status = "✅" if count > 0 else "❌"
        print(f"{status} {block_type:<20}: {count:>5} blocks")
    
    print()
    
    # 2. Chapter hierarchy issues
    print("2. CHAPTER HIERARCHY ANALYSIS:")
    print("-" * 80)
    
    # Find chapters with -A suffix (misclassified sections)
    chapter_a_pattern = r'code:\s*CH-(\d+)-A'
    chapter_a_matches = re.findall(chapter_a_pattern, text)
    if chapter_a_matches:
        print(f"❌ Found {len(set(chapter_a_matches))} misclassified sections as chapters:")
        for chapter_num in sorted(set(chapter_a_matches)):
            # Find the title
            pattern = rf'code:\s*CH-{chapter_num}-A[^\n]*\ntitle:\s*(.+)$'
            match = re.search(pattern, text, re.MULTILINE)
            if match:
                print(f"   - CH-{chapter_num}-A: {match.group(1)}")
    else:
        print("✅ No misclassified chapters found")
    
    print()
    
    # 3. Term chapter field analysis
    print("3. TERM CHAPTER FIELD ANALYSIS:")
    print("-" * 80)
    
    term_pattern = r'^::: term\n(.*?)^:::'
    terms = re.findall(term_pattern, text, re.MULTILINE | re.DOTALL)
    
    empty_chapter_count = 0
    filled_chapter_count = 0
    
    for term in terms[:20]:  # Sample first 20
        if 'chapter:\s*$' in term or 'chapter:\s*$' in term:
            empty_chapter_count += 1
        elif re.search(r'chapter:\s*CH-', term):
            filled_chapter_count += 1
    
    total_terms = len(terms)
    print(f"Total terms found: {total_terms}")
    print(f"Terms with empty chapter field: {empty_chapter_count} (sampled)")
    print(f"Terms with filled chapter field: {filled_chapter_count} (sampled)")
    
    # Check all terms
    empty_chapters = len(re.findall(r'^::: term[^\n]*\n[^\n]*\nchapter:\s*$', text, re.MULTILINE))
    filled_chapters = len(re.findall(r'^::: term[^\n]*\n[^\n]*\nchapter:\s*CH-', text, re.MULTILINE))
    
    print(f"All terms - Empty: {empty_chapters}, Filled: {filled_chapters}")
    
    if empty_chapters > filled_chapters:
        print("❌ Most terms have empty chapter fields")
    else:
        print("✅ Terms have chapter fields populated")
    
    print()
    
    # 4. Symbol references analysis
    print("4. SYMBOL REFERENCES ANALYSIS:")
    print("-" * 80)
    
    empty_symbols = len(re.findall(r'symbol_refs:\s*\[\]', text))
    filled_symbols = len(re.findall(r'symbol_refs:\s*\[.+\]', text))
    
    print(f"Blocks with empty symbol_refs: {empty_symbols}")
    print(f"Blocks with filled symbol_refs: {filled_symbols}")
    
    if empty_symbols > filled_symbols * 10:  # If 10x more empty
        print("❌ Symbol references are not being populated")
    else:
        print("✅ Symbol references are populated")
    
    print()
    
    # 5. Semantic roles analysis
    print("5. SEMANTIC ROLES ANALYSIS:")
    print("-" * 80)
    
    role_pattern = r'semantic_role:\s*(\w+)'
    roles = re.findall(role_pattern, text)
    role_counts = Counter(roles)
    
    expected_roles = [
        'structure', 'definition', 'concept', 'explanation',
        'example', 'pattern', 'antipattern', 'rationale',
        'decision-flow', 'architecture', 'warning', 'reference',
        'glossary', 'walkthrough'
    ]
    
    for role in expected_roles:
        count = role_counts.get(role, 0)
        status = "✅" if count > 0 else "❌"
        print(f"{status} {role:<20}: {count:>5} occurrences")
    
    print()
    
    # 6. Code pattern classification
    print("6. CODE PATTERN CLASSIFICATION:")
    print("-" * 80)
    
    # Check if code blocks are classified as patterns or examples
    code_in_terms = len(re.findall(r'^::: term[^\n]*\n.*?```rego', text, re.MULTILINE | re.DOTALL))
    code_in_patterns = len(re.findall(r'^::: pattern[^\n]*\n.*?```rego', text, re.MULTILINE | re.DOTALL))
    code_in_examples = len(re.findall(r'^::: example[^\n]*\n.*?```rego', text, re.MULTILINE | re.DOTALL))
    
    print(f"Code blocks in term blocks: {code_in_terms}")
    print(f"Code blocks in pattern blocks: {code_in_patterns}")
    print(f"Code blocks in example blocks: {code_in_examples}")
    
    if code_in_terms > code_in_patterns + code_in_examples:
        print("❌ Code blocks are being classified as terms instead of patterns/examples")
    else:
        print("✅ Code blocks are properly classified")
    
    print()
    
    # 7. Diagram extraction
    print("7. DIAGRAM EXTRACTION:")
    print("-" * 80)
    
    diagram_blocks = block_counts.get('diagram', 0)
    ascii_in_terms = len(re.findall(r'^::: term[^\n]*\n.*?```\n.*?┌.*?└', text, re.MULTILINE | re.DOTALL))
    
    print(f"Diagram blocks: {diagram_blocks}")
    print(f"ASCII diagrams in term blocks: {ascii_in_terms}")
    
    if diagram_blocks == 0 and ascii_in_terms > 0:
        print("❌ Diagrams are being extracted as terms instead of diagram blocks")
    elif diagram_blocks > 0:
        print("✅ Diagrams are properly extracted")
    else:
        print("⚠️  No diagrams found (may not be in source)")
    
    print()
    
    # 8. QA extraction
    print("8. QA EXTRACTION:")
    print("-" * 80)
    
    qa_blocks = block_counts.get('qa', 0)
    vs_pattern = len(re.findall(r'\bvs\b|\bversus\b', text, re.IGNORECASE))
    
    print(f"QA blocks: {qa_blocks}")
    print(f"'vs' or 'versus' patterns found: {vs_pattern}")
    
    if qa_blocks == 0 and vs_pattern > 0:
        print("❌ 'X vs Y' sections not generating QA blocks")
    elif qa_blocks > 0:
        print("✅ QA blocks are being generated")
    else:
        print("⚠️  No QA blocks found")
    
    print()
    
    # 9. Anti-pattern extraction
    print("9. ANTI-PATTERN EXTRACTION:")
    print("-" * 80)
    
    antipattern_blocks = block_counts.get('antipattern', 0)
    common_mistake = len(re.findall(r'Common mistake|❌|WRONG|anti-pattern', text, re.IGNORECASE))
    
    print(f"Anti-pattern blocks: {antipattern_blocks}")
    print(f"Anti-pattern indicators in text: {common_mistake}")
    
    if antipattern_blocks == 0 and common_mistake > 0:
        print("❌ Anti-patterns not being extracted")
    elif antipattern_blocks > 0:
        print("✅ Anti-patterns are being extracted")
    else:
        print("⚠️  No anti-pattern blocks found")
    
    print()
    
    # 10. Summary
    print("=" * 80)
    print("SUMMARY")
    print("=" * 80)
    
    issues = []
    if block_counts.get('example', 0) == 0:
        issues.append("Missing example blocks")
    if block_counts.get('concept', 0) == 0:
        issues.append("Missing concept blocks")
    if block_counts.get('qa', 0) == 0:
        issues.append("Missing QA blocks")
    if block_counts.get('pattern', 0) == 0:
        issues.append("Missing pattern blocks")
    if block_counts.get('antipattern', 0) == 0:
        issues.append("Missing antipattern blocks")
    if block_counts.get('diagram', 0) == 0:
        issues.append("Missing diagram blocks")
    if block_counts.get('relation', 0) == 0:
        issues.append("Missing relation blocks")
    if block_counts.get('rationale', 0) == 0:
        issues.append("Missing rationale blocks")
    if empty_chapters > filled_chapters:
        issues.append("Terms missing chapter fields")
    if empty_symbols > filled_symbols * 10:
        issues.append("Symbol references not populated")
    
    if issues:
        print(f"❌ Found {len(issues)} issues:")
        for issue in issues:
            print(f"   - {issue}")
    else:
        print("✅ All V3 elements present")
    
    return issues

if __name__ == "__main__":
    script_dir = Path(__file__).parent
    compiled_file = script_dir.parent / "rego_opa_bible_compiled.ssm.md"
    
    if not compiled_file.exists():
        print(f"ERROR: File not found: {compiled_file}")
        exit(1)
    
    issues = analyze_ssm_file(compiled_file)
    exit(1 if issues else 0)

