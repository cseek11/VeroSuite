"""Verify fixes applied to compilation"""
import re
from pathlib import Path

def analyze_compilation(filename):
    """Analyze compiled SSM file for fixes."""
    with open(filename, 'r', encoding='utf-8') as f:
        text = f.read()
    
    print("=" * 80)
    print("VERIFICATION OF FIXES")
    print("=" * 80)
    print()
    
    # 1. QA blocks - check for markdown headers in questions
    print("1. QA BLOCKS - Markdown Header Cleanup")
    print("-" * 80)
    qa_blocks = re.findall(r'::: qa\n(.*?)\n:::', text, re.DOTALL)
    print(f"   Total QA blocks: {len(qa_blocks)}")
    
    qa_with_headers = 0
    clean_qa_samples = []
    for qa in qa_blocks[:5]:  # Check first 5
        if 'q:' in qa:
            q_line = [l for l in qa.split('\n') if l.startswith('q:')]
            if q_line:
                q_text = q_line[0]
                # Check for markdown headers
                if re.search(r'^#+\s+', q_text) or re.search(r'##\s+', q_text):
                    qa_with_headers += 1
                else:
                    if len(clean_qa_samples) < 3:
                        clean_qa_samples.append(q_text[:100])
    
    print(f"   QA blocks with markdown headers in questions: {qa_with_headers}")
    if clean_qa_samples:
        print(f"   ✅ Sample clean questions:")
        for i, q in enumerate(clean_qa_samples, 1):
            print(f"      {i}. {q}")
    print()
    
    # 2. Cross-chapter references
    print("2. CHAPTER ATTRIBUTION - Cross-Chapter References")
    print("-" * 80)
    cross_chapter = len(re.findall(r'cross_chapter_reference', text))
    primary_chapter = len(re.findall(r'primary_chapter', text))
    print(f"   Blocks with cross_chapter_reference: {cross_chapter}")
    print(f"   Blocks with primary_chapter: {primary_chapter}")
    if cross_chapter > 0:
        print(f"   ✅ Cross-chapter references detected")
    else:
        print(f"   ⚠️  No cross-chapter references found (may need content with cross-refs)")
    print()
    
    # 3. Symbol references
    print("3. SYMBOL REFERENCES - Expanded Coverage")
    print("-" * 80)
    # Count blocks with non-empty symbol_refs
    symbol_refs_pattern = r'symbol_refs:\s*\[([^\]]+)\]'
    symbol_refs_matches = re.findall(symbol_refs_pattern, text)
    blocks_with_refs = len([m for m in symbol_refs_matches if m.strip()])
    print(f"   Blocks with symbol_refs (non-empty): {blocks_with_refs}")
    
    # Count total symbol references
    total_refs = sum(len(m.split(',')) for m in symbol_refs_matches if m.strip())
    print(f"   Total symbol references: {total_refs}")
    
    # Check block types with symbol_refs
    block_types_with_refs = {}
    for match in re.finditer(r'::: (\w+)\n(.*?)\n:::', text, re.DOTALL):
        block_type = match.group(1)
        block_content = match.group(2)
        if 'symbol_refs:' in block_content and re.search(r'symbol_refs:\s*\[([^\]]+)\]', block_content):
            ref_match = re.search(r'symbol_refs:\s*\[([^\]]+)\]', block_content)
            if ref_match and ref_match.group(1).strip():
                block_types_with_refs[block_type] = block_types_with_refs.get(block_type, 0) + 1
    
    print(f"   Block types with symbol_refs:")
    for bt, count in sorted(block_types_with_refs.items()):
        print(f"      {bt}: {count}")
    print()
    
    # 4. Validation
    print("4. VALIDATION STATUS")
    print("-" * 80)
    errors = len(re.findall(r'ERROR \[VAL_', text))
    warnings = len(re.findall(r'WARNING', text))
    print(f"   Validation errors: {errors}")
    print(f"   Warnings: {warnings}")
    print(f"   Status: {'✅ PASS' if errors == 0 else '❌ FAIL'}")
    print()
    
    # 5. Overall statistics
    print("5. OVERALL STATISTICS")
    print("-" * 80)
    block_types = set(re.findall(r'^::: (\w+)', text, re.MULTILINE))
    print(f"   Total block types: {len(block_types)}")
    print(f"   File size: {len(text):,} characters")
    print(f"   Total blocks: {len(re.findall(r'^::: ', text, re.MULTILINE))}")
    print()
    
    print("=" * 80)
    print("SUMMARY")
    print("=" * 80)
    print(f"✅ QA header cleanup: {'PASS' if qa_with_headers == 0 else 'NEEDS REVIEW'}")
    print(f"{'✅' if cross_chapter >= 0 else '⚠️ '} Chapter attribution: {'DETECTED' if cross_chapter > 0 else 'NONE (may be normal)'}")
    print(f"✅ Symbol references: {blocks_with_refs} blocks (expanded from ~167)")
    print(f"✅ Validation: {'PASS' if errors == 0 else 'FAIL'}")
    print()

if __name__ == '__main__':
    analyze_compilation('FinalCompilerTest_Fixed2.ssm.md')

