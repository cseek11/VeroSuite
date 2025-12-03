#!/usr/bin/env python3
"""Minimal test to find where parser hangs"""
import sys
import time
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))

print("Importing...", flush=True)
from modules.parser_markdown import parse_markdown_to_ast
print("Imported successfully", flush=True)

# Test with just a few lines
test_cases = [
    ("Empty", ""),
    ("Single line", "Hello world"),
    ("Heading", "# Chapter 1 - Test"),
    ("Code block", "```python\nprint('hi')\n```"),
    ("Paragraph", "This is a paragraph."),
]

for name, text in test_cases:
    print(f"\nTesting: {name}", flush=True)
    start = time.time()
    try:
        ast = parse_markdown_to_ast(text)
        elapsed = time.time() - start
        print(f"  SUCCESS in {elapsed:.3f}s: {len(ast.nodes)} nodes", flush=True)
    except Exception as e:
        elapsed = time.time() - start
        print(f"  FAILED in {elapsed:.3f}s: {e}", flush=True)
        import traceback
        traceback.print_exc()

print("\nTesting with first 100 lines of bible...", flush=True)
input_file = Path("../rego_opa_bible.md")
if input_file.exists():
    text = "\n".join(input_file.read_text(encoding="utf-8").splitlines()[:100])
    print(f"  Read {len(text)} characters", flush=True)
    start = time.time()
    try:
        ast = parse_markdown_to_ast(text)
        elapsed = time.time() - start
        print(f"  SUCCESS in {elapsed:.3f}s: {len(ast.nodes)} nodes", flush=True)
    except Exception as e:
        elapsed = time.time() - start
        print(f"  FAILED in {elapsed:.3f}s: {e}", flush=True)
        import traceback
        traceback.print_exc()

