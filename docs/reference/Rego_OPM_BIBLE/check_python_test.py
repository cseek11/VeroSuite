"""Check Python_Test compilation results"""
import re
from pathlib import Path

def check_results():
    file_path = Path("../../Python_Test.ssm.md")
    if not file_path.exists():
        print("❌ Python_Test.ssm.md not found")
        return
    
    with open(file_path, 'r', encoding='utf-8') as f:
        text = f.read()
    
    blocks = len(re.findall(r'^::: ', text, re.MULTILINE))
    qa_blocks = len(re.findall(r'^::: qa', text, re.MULTILINE))
    symbol_refs = len(re.findall(r'symbol_refs: \[[^\]]+\]', text))
    errors = len(re.findall(r'ERROR \[VAL_', text))
    
    print("📊 Python_Test.ssm.md Statistics:")
    print(f"   Total SSM blocks: {blocks}")
    print(f"   QA blocks: {qa_blocks}")
    print(f"   Blocks with symbol_refs: {symbol_refs}")
    print(f"   Validation errors: {errors}")
    print(f"   Status: {'✅ PASS' if errors == 0 else '❌ FAIL'}")
    print(f"   File size: {len(text):,} characters")

if __name__ == '__main__':
    check_results()

