"""Analyze QA block issues in FinalCompilerTest.ssm.md"""
import re

def analyze_qa_blocks(filename):
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Find all QA blocks
    qa_pattern = r'::: qa\n(.*?)\n:::'
    qa_blocks = re.findall(qa_pattern, content, re.DOTALL)
    
    print(f"Found {len(qa_blocks)} QA blocks\n")
    
    issues = {
        'chapter_leakage': [],
        'incomplete_answers': [],
        'wrong_chapter': [],
        'duplicates': []
    }
    
    seen_answers = {}
    
    for i, qa_content in enumerate(qa_blocks[:10]):  # Check first 10
        lines = qa_content.split('\n')
        meta = {}
        for line in lines:
            if ':' in line:
                key, value = line.split(':', 1)
                meta[key.strip()] = value.strip()
        
        q = meta.get('q', '')
        a = meta.get('a', '')
        chapter = meta.get('chapter', '')
        
        # Check for chapter leakage
        if 'Chapter' in a and ('CH-' in a or 'Chapter' in a[:50]):
            issues['chapter_leakage'].append((i, q[:50], a[:100]))
        
        # Check for incomplete answers
        if len(a) < 50 or a.lower() == q.lower() or a.startswith('Optionally'):
            issues['incomplete_answers'].append((i, q[:50], a[:100]))
        
        # Check for wrong chapter (CH-05 having CH-06 content)
        if chapter == 'CH-05' and ('CH-06' in a or 'Chapter 6' in a or 'Chapter 6 –' in a):
            issues['wrong_chapter'].append((i, q[:50], a[:100]))
        
        # Check for duplicates
        answer_key = a[:100].lower().strip()
        if answer_key in seen_answers:
            issues['duplicates'].append((i, seen_answers[answer_key], q[:50]))
        else:
            seen_answers[answer_key] = i
    
    print("=== ISSUES FOUND ===\n")
    
    if issues['chapter_leakage']:
        print(f"Chapter Leakage ({len(issues['chapter_leakage'])}):")
        for idx, q, a in issues['chapter_leakage'][:3]:
            print(f"  Block {idx}: Q={q}... A={a}...")
        print()
    
    if issues['incomplete_answers']:
        print(f"Incomplete Answers ({len(issues['incomplete_answers'])}):")
        for idx, q, a in issues['incomplete_answers'][:3]:
            print(f"  Block {idx}: Q={q}... A={a}...")
        print()
    
    if issues['wrong_chapter']:
        print(f"Wrong Chapter Attribution ({len(issues['wrong_chapter'])}):")
        for idx, q, a in issues['wrong_chapter'][:3]:
            print(f"  Block {idx}: Q={q}... A={a}...")
        print()
    
    if issues['duplicates']:
        print(f"Duplicates ({len(issues['duplicates'])}):")
        for idx, orig, q in issues['duplicates'][:3]:
            print(f"  Block {idx} duplicates block {orig}: Q={q}...")
        print()

if __name__ == '__main__':
    analyze_qa_blocks('FinalCompilerTest.ssm.md')

