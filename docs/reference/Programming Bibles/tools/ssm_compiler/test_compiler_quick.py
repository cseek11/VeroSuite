#!/usr/bin/env python3
"""Quick test to verify compiler works without errors."""
from __future__ import annotations

import sys
from pathlib import Path

# Add current directory to path
current_dir = Path(__file__).parent
if str(current_dir) not in sys.path:
    sys.path.insert(0, str(current_dir))

# Import from compiler.py directly (avoiding compiler/ directory)
import importlib.util
spec = importlib.util.spec_from_file_location("compiler_module", "compiler.py")
compiler_module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(compiler_module)
compile_markdown_to_ssm_v3 = compiler_module.compile_markdown_to_ssm_v3

# Small test sample
test_markdown = """# Test Document

## Chapter 1 — Introduction

This is a test chapter.

### Section 1.1

Some content here.

```rego
package test
allow := true
```

## Chapter 2 — Advanced Topics

More content.
"""

print("Testing compiler with small sample...")
try:
    ssm_output, diagnostics = compile_markdown_to_ssm_v3(
        test_markdown,
        namespace="test"
    )
    print(f"✅ Compilation successful!")
    print(f"   Output length: {len(ssm_output)} characters")
    print(f"   Blocks found: {ssm_output.count(':::')}")
    if diagnostics:
        print(f"   Diagnostics: {len(diagnostics.get('errors', []))} errors, {len(diagnostics.get('warnings', []))} warnings")
except Exception as e:
    print(f"❌ Compilation failed: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)

