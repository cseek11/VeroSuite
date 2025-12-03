#!/usr/bin/env python3
"""
Phase 2 Tests - Pattern Extractor + Multi-language Plugin System

Tests for:
- LanguagePlugin protocol
- Plugin registry
- Pattern extraction (Rego, Python, TypeScript, SQL)
- code-pattern SSM blocks with pattern_type, pattern_subtype, tags, metadata
"""
from __future__ import annotations

import sys
from pathlib import Path

# Add current directory to path
current_dir = Path(__file__).parent
if str(current_dir) not in sys.path:
    sys.path.insert(0, str(current_dir))

from modules.plugins.registry import get_plugin, detect_language, LANGUAGE_REGISTRY
from modules.plugins.base import CodePattern
from modules.extractor_patterns import extract_patterns_from_ast, enhance_code_blocks_with_patterns
from modules.ast_nodes import ASTNode, ASTDocument, SSMBlock
from modules.parser_markdown import parse_markdown_to_ast
from runtime.error_bus import ErrorBus
from runtime.symbol_table import SymbolTable


def test_plugin_registry():
    """Test plugin registry."""
    print("Testing plugin registry...")
    try:
        # Test direct lookup
        rego_plugin = get_plugin("rego")
        assert rego_plugin is not None, "Should find Rego plugin"
        assert rego_plugin.name == "rego", "Plugin name should be 'rego'"
        
        # Test alias lookup
        python_plugin = get_plugin("py")
        assert python_plugin is not None, "Should find Python plugin via alias"
        assert python_plugin.name == "python", "Plugin name should be 'python'"
        
        # Test unknown language
        unknown = get_plugin("unknown")
        assert unknown is None, "Should return None for unknown language"
        
        # Test registry contains expected plugins
        assert "rego" in LANGUAGE_REGISTRY, "Registry should contain Rego"
        assert "python" in LANGUAGE_REGISTRY, "Registry should contain Python"
        assert "typescript" in LANGUAGE_REGISTRY, "Registry should contain TypeScript"
        assert "sql" in LANGUAGE_REGISTRY, "Registry should contain SQL"
        
        print("  ✓ Plugin registry passed")
        return True
    except Exception as e:
        print(f"  ✗ Plugin registry test failed: {e}")
        import traceback
        traceback.print_exc()
        return False


def test_language_detection():
    """Test language detection."""
    print("Testing language detection...")
    try:
        # Test Rego detection
        rego_code = """package authz
allow if {
    input.user.role == "admin"
}"""
        detected = detect_language(rego_code)
        assert detected == "rego", f"Should detect Rego, got {detected}"
        
        # Test Python detection
        python_code = """def hello():
    print("Hello")
"""
        detected = detect_language(python_code)
        assert detected == "python", f"Should detect Python, got {detected}"
        
        # Test TypeScript detection
        ts_code = """export class UserService {
    async getUser(id: string): Promise<User> {
        return this.prisma.user.findUnique({ where: { id } });
    }
}"""
        detected = detect_language(ts_code)
        assert detected == "typescript", f"Should detect TypeScript, got {detected}"
        
        # Test SQL detection
        sql_code = """SELECT * FROM users WHERE id = 1"""
        detected = detect_language(sql_code)
        assert detected == "sql", f"Should detect SQL, got {detected}"
        
        print("  ✓ Language detection passed")
        return True
    except Exception as e:
        print(f"  ✗ Language detection test failed: {e}")
        import traceback
        traceback.print_exc()
        return False


def test_rego_pattern_extraction():
    """Test Rego pattern extraction."""
    print("Testing Rego pattern extraction...")
    try:
        plugin = get_plugin("rego")
        assert plugin is not None, "Should get Rego plugin"
        
        # Test quantifier pattern
        code1 = """some item in items
item == "admin"
"""
        patterns1 = plugin.classify_patterns(code1)
        assert len(patterns1) > 0, "Should extract patterns"
        quantifier_patterns = [p for p in patterns1 if p.pattern_type == "quantifier"]
        assert len(quantifier_patterns) > 0, "Should extract quantifier pattern"
        assert quantifier_patterns[0].pattern_subtype == "existential", "Should be existential quantifier"
        
        # Test aggregation pattern
        code2 = """count(items) > 0"""
        patterns2 = plugin.classify_patterns(code2)
        agg_patterns = [p for p in patterns2 if p.pattern_type == "aggregation"]
        assert len(agg_patterns) > 0, "Should extract aggregation pattern"
        assert agg_patterns[0].pattern_subtype == "count", "Should be count aggregation"
        
        # Test rule head pattern
        code3 = """allow if {
    input.user.role == "admin"
}"""
        patterns3 = plugin.classify_patterns(code3)
        rule_patterns = [p for p in patterns3 if p.pattern_type == "rule_head"]
        assert len(rule_patterns) > 0, "Should extract rule head pattern"
        assert rule_patterns[0].pattern_subtype == "allow", "Should be allow rule"
        
        print("  ✓ Rego pattern extraction passed")
        return True
    except Exception as e:
        print(f"  ✗ Rego pattern extraction test failed: {e}")
        import traceback
        traceback.print_exc()
        return False


def test_python_pattern_extraction():
    """Test Python pattern extraction."""
    print("Testing Python pattern extraction...")
    try:
        plugin = get_plugin("python")
        assert plugin is not None, "Should get Python plugin"
        
        # Test comprehension pattern
        code = """[x * 2 for x in range(10)]"""
        patterns = plugin.classify_patterns(code)
        comp_patterns = [p for p in patterns if p.pattern_type == "comprehension"]
        assert len(comp_patterns) > 0, "Should extract comprehension pattern"
        assert comp_patterns[0].pattern_subtype == "list", "Should be list comprehension"
        
        print("  ✓ Python pattern extraction passed")
        return True
    except Exception as e:
        print(f"  ✗ Python pattern extraction test failed: {e}")
        import traceback
        traceback.print_exc()
        return False


def test_code_pattern_ssm_blocks():
    """Test code-pattern SSM block creation."""
    print("Testing code-pattern SSM blocks...")
    try:
        errors = ErrorBus()
        symbols = SymbolTable()
        
        test_md = """## Chapter 1 — Introduction

```rego
package authz

allow if {
    some item in input.items
    item == "admin"
}
```
"""
        doc = parse_markdown_to_ast(test_md, errors=errors, symbols=symbols)
        
        # Extract patterns
        pattern_blocks = extract_patterns_from_ast(doc, errors=errors, symbols=symbols)
        
        assert len(pattern_blocks) > 0, "Should extract pattern blocks"
        
        # Check pattern block structure
        pattern_block = pattern_blocks[0]
        assert pattern_block.block_type == "code-pattern", "Should be code-pattern block"
        assert "language" in pattern_block.meta, "Should have language"
        assert "pattern_type" in pattern_block.meta, "Should have pattern_type"
        assert "pattern_subtype" in pattern_block.meta, "Should have pattern_subtype"
        assert "tags" in pattern_block.meta, "Should have tags"
        assert pattern_block.meta["language"] == "rego", "Language should be rego"
        
        print(f"  ✓ Found {len(pattern_blocks)} code-pattern block(s)")
        print("  ✓ code-pattern SSM blocks passed")
        return True
    except Exception as e:
        print(f"  ✗ code-pattern SSM blocks test failed: {e}")
        import traceback
        traceback.print_exc()
        return False


def test_pattern_enhancement():
    """Test pattern enhancement of existing code blocks."""
    print("Testing pattern enhancement...")
    try:
        errors = ErrorBus()
        symbols = SymbolTable()
        
        test_md = """## Chapter 1 — Introduction

```rego
count(items) > 0
```
"""
        doc = parse_markdown_to_ast(test_md, errors=errors, symbols=symbols)
        
        # Create a code block
        code_block = SSMBlock(
            block_type="code",
            meta={"id": "test-123", "language": "rego"},
            body="count(items) > 0",
            index=0,
            id="test-123"
        )
        blocks = [code_block]
        
        # Enhance with patterns
        enhance_code_blocks_with_patterns(blocks, doc, errors=errors, symbols=symbols)
        
        # Check enhancement
        enhanced = blocks[0]
        assert enhanced.block_type == "code-pattern", "Should be upgraded to code-pattern"
        assert "pattern_type" in enhanced.meta, "Should have pattern_type"
        assert enhanced.meta.get("pattern_type") == "aggregation", "Should be aggregation pattern"
        
        print("  ✓ Pattern enhancement passed")
        return True
    except Exception as e:
        print(f"  ✗ Pattern enhancement test failed: {e}")
        import traceback
        traceback.print_exc()
        return False


if __name__ == "__main__":
    print("=" * 60)
    print("Phase 2 Tests - Pattern Extractor + Multi-language Plugin System")
    print("=" * 60)
    print()
    
    tests = [
        test_plugin_registry,
        test_language_detection,
        test_rego_pattern_extraction,
        test_python_pattern_extraction,
        test_code_pattern_ssm_blocks,
        test_pattern_enhancement,
    ]
    
    results = []
    for test in tests:
        try:
            results.append(test())
        except Exception as e:
            print(f"  ✗ Test {test.__name__} crashed: {e}")
            import traceback
            traceback.print_exc()
            results.append(False)
        print()
    
    print("=" * 60)
    passed = sum(results)
    total = len(results)
    print(f"Results: {passed}/{total} tests passed")
    
    if passed == total:
        print("✓ All Phase 2 tests passed!")
        sys.exit(0)
    else:
        print("✗ Some Phase 2 tests failed")
        sys.exit(1)

