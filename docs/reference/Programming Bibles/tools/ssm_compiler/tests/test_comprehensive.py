"""
Comprehensive Test Suite (Phase 5)

Tests for all compiler features with golden snapshot support.
"""
from __future__ import annotations

import sys
import json
from pathlib import Path
from typing import Dict, Any

# Add parent directory to path
test_dir = Path(__file__).parent.parent
if str(test_dir) not in sys.path:
    sys.path.insert(0, str(test_dir))

import importlib.util
compiler_spec = importlib.util.spec_from_file_location("compiler_module", test_dir / "compiler.py")
compiler_module = importlib.util.module_from_spec(compiler_spec)
compiler_spec.loader.exec_module(compiler_module)
compile_markdown_to_ssm_v3 = compiler_module.compile_markdown_to_ssm_v3

from runtime.error_bus import ErrorBus
from runtime.symbol_table import SymbolTable
from runtime.metrics import MetricsCollector


GOLDEN_DIR = Path(__file__).parent / "golden"


def test_basic_compilation():
    """Test basic compilation produces valid SSM."""
    test_md = """# Chapter 1 - Introduction

## Section 1.1

This is a paragraph with some **bold** text.

```rego
package authz

allow if {
    input.user.role == "admin"
}
```

### Subsection

More content here.
"""
    
    result, metadata = compile_markdown_to_ssm_v3(test_md)
    
    assert len(result) > 0, "Compilation result is empty"
    assert ":::" in result, "Result does not contain SSM blocks"
    
    # Check for block types
    block_types = ["code-pattern", "example", "concept", "fact"]
    found_blocks = [bt for bt in block_types if f"::: {bt}" in result]
    
    assert len(found_blocks) > 0, f"No block types found. Result: {result[:500]}"
    return True


def test_chapter_detection():
    """Test that chapters are detected correctly."""
    test_md = """## Chapter 1 - Introduction

Content here.

## Chapter 2 - Advanced Topics

More content.
"""
    
    result, metadata = compile_markdown_to_ssm_v3(test_md)
    
    # Check for chapter-meta blocks
    assert "::: chapter-meta" in result, "No chapter-meta blocks found"
    assert "code: CH-01" in result or "CH-01" in result, "Chapter 1 not detected"
    assert "code: CH-02" in result or "CH-02" in result, "Chapter 2 not detected"
    
    return True


def test_code_pattern_detection():
    """Test that code patterns are detected."""
    test_md = """## Chapter 1

```rego
package authz

allow if {
    some user in input.users
    user.role == "admin"
}
```
"""
    
    result, metadata = compile_markdown_to_ssm_v3(test_md)
    
    # Check for code-pattern block
    assert "::: code-pattern" in result or "::: example" in result, "Code block not detected"
    
    return True


def test_term_extraction():
    """Test that terms are extracted."""
    test_md = """## Chapter 1

**OPA** (Open Policy Agent) is a policy engine.

**Rego** is the policy language for OPA.
"""
    
    result, metadata = compile_markdown_to_ssm_v3(test_md)
    
    # Check for term blocks
    assert "::: term" in result, "Terms not extracted"
    
    return True


def test_validation():
    """Test that validation works."""
    test_md = """## Chapter 1

Content here.
"""
    
    errors = ErrorBus()
    symbols = SymbolTable()
    result, metadata = compile_markdown_to_ssm_v3(test_md, errors=errors, symbols=symbols)
    
    # Check that validation ran
    assert "validation" in metadata.get("summary", {}), "Validation not in metadata"
    
    return True


def test_metrics_collection():
    """Test that metrics are collected."""
    test_md = """## Chapter 1

Content here.
"""
    
    errors = ErrorBus()
    symbols = SymbolTable()
    result, metadata = compile_markdown_to_ssm_v3(test_md, errors=errors, symbols=symbols)
    
    # Check that metrics exist
    assert "metrics" in metadata or "summary" in metadata, "Metrics not collected"
    
    return True


def test_golden_snapshot(test_name: str, test_md: str) -> bool:
    """
    Test against golden snapshot.
    
    Args:
        test_name: Name of test (used for snapshot file)
        test_md: Markdown to compile
        
    Returns:
        True if matches snapshot, False otherwise
    """
    result, metadata = compile_markdown_to_ssm_v3(test_md)
    
    golden_file = GOLDEN_DIR / f"{test_name}.ssm.md"
    
    if not golden_file.exists():
        # Create golden snapshot
        GOLDEN_DIR.mkdir(exist_ok=True)
        golden_file.write_text(result, encoding='utf-8')
        print(f"  Created golden snapshot: {golden_file}")
        return True
    
    # Compare with golden
    golden_content = golden_file.read_text(encoding='utf-8')
    
    if result == golden_content:
        return True
    else:
        print(f"  ❌ Snapshot mismatch for {test_name}")
        print(f"  Expected: {len(golden_content)} chars")
        print(f"  Got: {len(result)} chars")
        return False


def run_all_tests():
    """Run all tests."""
    print("Running Comprehensive Test Suite...")
    print("=" * 60)
    
    tests = [
        ("basic_compilation", test_basic_compilation),
        ("chapter_detection", test_chapter_detection),
        ("code_pattern_detection", test_code_pattern_detection),
        ("term_extraction", test_term_extraction),
        ("validation", test_validation),
        ("metrics_collection", test_metrics_collection),
    ]
    
    results = []
    for test_name, test_func in tests:
        try:
            print(f"Running {test_name}...")
            result = test_func()
            if result:
                print(f"  ✅ {test_name} passed")
            else:
                print(f"  ❌ {test_name} failed")
            results.append(result)
        except Exception as e:
            print(f"  ❌ {test_name} crashed: {e}")
            import traceback
            traceback.print_exc()
            results.append(False)
        print()
    
    # Golden snapshot tests
    print("Running golden snapshot tests...")
    golden_tests = {
        "simple_chapter": """## Chapter 1 - Introduction

This is a simple chapter with one paragraph.
""",
        "chapter_with_code": """## Chapter 1 - Introduction

```rego
package authz
allow if true
```
""",
    }
    
    for test_name, test_md in golden_tests.items():
        try:
            print(f"Running golden test: {test_name}...")
            result = test_golden_snapshot(test_name, test_md)
            if result:
                print(f"  ✅ {test_name} passed")
            else:
                print(f"  ❌ {test_name} failed")
            results.append(result)
        except Exception as e:
            print(f"  ❌ {test_name} crashed: {e}")
            results.append(False)
        print()
    
    # Summary
    print("=" * 60)
    passed = sum(results)
    total = len(results)
    print(f"Results: {passed}/{total} tests passed")
    
    if passed == total:
        print("✅ All tests passed!")
        return 0
    else:
        print("❌ Some tests failed")
        return 1


if __name__ == '__main__':
    sys.exit(run_all_tests())

