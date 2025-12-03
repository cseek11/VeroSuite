"""Check Python_Test compilation results"""
import re
from pathlib import Path

file_path = Path("../Python_Test.ssm.md")
if not file_path.exists():
    print("❌ Python_Test.ssm.md not found")
    exit(1)

with open(file_path, 'r', encoding='utf-8') as f:
    text = f.read()

blocks = len(re.findall(r'^::: ', text, re.MULTILINE))
qa = len(re.findall(r'^::: qa', text, re.MULTILINE))
sym = len(re.findall(r'symbol_refs: \[[^\]]+\]', text))
err = len(re.findall(r'ERROR \[VAL_', text))

print("📊 Python_Test.ssm.md Statistics:")
print(f"   Total SSM blocks: {blocks}")
print(f"   QA blocks: {qa}")
print(f"   Blocks with symbol_refs: {sym}")
print(f"   Validation errors: {err}")
print(f"   Status: {'✅ PASS' if err == 0 else '❌ FAIL'}")
print(f"   File size: {len(text):,} characters ({len(text)/1024/1024:.2f} MB)")

