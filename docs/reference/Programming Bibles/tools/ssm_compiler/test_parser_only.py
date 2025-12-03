#!/usr/bin/env python3
"""Test parser import and basic functionality"""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))

print("Importing parser_markdown...", flush=True)
try:
    from modules.parser_markdown import parse_markdown_to_ast
    print("Import successful", flush=True)
except Exception as e:
    print(f"Import failed: {e}", flush=True)
    import traceback
    traceback.print_exc()
    sys.exit(1)

print("Testing with small input...", flush=True)
test_text = """# Chapter 1 - Test

This is a test paragraph.

```python
print("hello")
```

## Section 1.1

More text.
"""

try:
    print("Calling parse_markdown_to_ast...", flush=True)
    ast = parse_markdown_to_ast(test_text)
    print(f"Success! AST has {len(ast.nodes)} nodes", flush=True)
    if hasattr(ast, 'chapters'):
        print(f"AST has {len(ast.chapters)} chapters", flush=True)
except Exception as e:
    print(f"Parse failed: {e}", flush=True)
    import traceback
    traceback.print_exc()
    sys.exit(1)

