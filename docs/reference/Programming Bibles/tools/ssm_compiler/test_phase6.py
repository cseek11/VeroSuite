#!/usr/bin/env python3
"""
Phase 6 Tests - Multi-language, Multi-tenant Symbol Table & Namespaces

Tests for:
- Multi-namespace SymbolTable support
- Namespace-aware IDs
- Cross-namespace symbol isolation
- Namespace-aware relations
"""
from __future__ import annotations

import sys
from pathlib import Path

# Add current directory to path
current_dir = Path(__file__).parent
if str(current_dir) not in sys.path:
    sys.path.insert(0, str(current_dir))

from runtime.symbol_table import SymbolTable, NamespaceSymbolTable
from modules.extractor_relations import extract_relations_from_ast, RelationEntry
from modules.parser_markdown import parse_markdown_to_ast
from runtime.error_bus import ErrorBus


def test_multi_namespace_symbol_table():
    """Test multi-namespace symbol table."""
    print("Testing multi-namespace symbol table...")
    try:
        symbols = SymbolTable(default_namespace="rego_opa_bible")
        
        # Add symbols to default namespace
        symbols.add_chapter(1, "CH-01", line_no=10, title="Introduction")
        symbols.add_term("OPA", "TERM-opa-1", line_no=20)
        
        # Switch to different namespace
        symbols.set_namespace("typescript_bible")
        symbols.add_chapter(1, "CH-01", line_no=10, title="TypeScript Intro")
        symbols.add_term("TypeScript", "TERM-ts-1", line_no=30)
        
        # Verify namespaces are isolated
        rego_ns = symbols.get_namespace("rego_opa_bible")
        ts_ns = symbols.get_namespace("typescript_bible")
        
        assert rego_ns is not None, "Should have rego_opa_bible namespace"
        assert ts_ns is not None, "Should have typescript_bible namespace"
        assert rego_ns.chapters[1] == "CH-01", "Rego namespace should have chapter 1"
        assert ts_ns.chapters[1] == "CH-01", "TypeScript namespace should have chapter 1"
        assert rego_ns.terms.get("opa") == "TERM-opa-1", "Rego namespace should have OPA term"
        assert ts_ns.terms.get("typescript") == "TERM-ts-1", "TypeScript namespace should have TypeScript term"
        
        # Verify no collision (both have CH-01 but in different namespaces)
        assert rego_ns.chapters[1] == ts_ns.chapters[1], "Both can have CH-01 in different namespaces"
        
        print("  ✓ Multi-namespace symbol table passed")
        return True
    except Exception as e:
        print(f"  ✗ Multi-namespace symbol table test failed: {e}")
        import traceback
        traceback.print_exc()
        return False


def test_namespace_switching():
    """Test namespace switching."""
    print("Testing namespace switching...")
    try:
        symbols = SymbolTable(default_namespace="ns1")
        
        # Add to ns1
        symbols.add_chapter(1, "CH-01", line_no=10)
        assert len(symbols.chapters) == 1, "Should have 1 chapter in ns1"
        
        # Switch to ns2
        symbols.set_namespace("ns2")
        assert len(symbols.chapters) == 0, "ns2 should be empty"
        symbols.add_chapter(1, "CH-01", line_no=20)
        assert len(symbols.chapters) == 1, "Should have 1 chapter in ns2"
        
        # Switch back to ns1
        symbols.set_namespace("ns1")
        assert len(symbols.chapters) == 1, "Should still have 1 chapter in ns1"
        
        print("  ✓ Namespace switching passed")
        return True
    except Exception as e:
        print(f"  ✗ Namespace switching test failed: {e}")
        import traceback
        traceback.print_exc()
        return False


def test_namespace_aware_relations():
    """Test namespace-aware relations."""
    print("Testing namespace-aware relations...")
    try:
        errors = ErrorBus()
        symbols = SymbolTable(default_namespace="rego_opa_bible")
        
        test_md = """## Chapter 1 — Introduction

See Chapter 2 for details.

## Chapter 2 — Details

Content.
"""
        doc = parse_markdown_to_ast(test_md, errors=errors, symbols=symbols)
        
        # Extract relations with namespace
        rels = extract_relations_from_ast(doc, errors=errors, symbols=symbols, namespace="rego_opa_bible")
        
        assert len(rels) > 0, "Should extract relations"
        
        rel = rels[0]
        assert rel.from_namespace == "rego_opa_bible", "Should have from_namespace"
        assert rel.to_namespace == "rego_opa_bible", "Should have to_namespace"
        
        print(f"  ✓ Found {len(rels)} relation(s) with namespace info")
        print("  ✓ Namespace-aware relations passed")
        return True
    except Exception as e:
        print(f"  ✗ Namespace-aware relations test failed: {e}")
        import traceback
        traceback.print_exc()
        return False


def test_cross_namespace_symbol_access():
    """Test accessing symbols from different namespaces."""
    print("Testing cross-namespace symbol access...")
    try:
        symbols = SymbolTable(default_namespace="ns1")
        
        # Add symbol to ns1
        symbols.add_chapter(1, "CH-01", line_no=10, title="Chapter 1")
        
        # Switch to ns2
        symbols.set_namespace("ns2")
        symbols.add_chapter(2, "CH-02", line_no=20, title="Chapter 2")
        
        # Access ns1 symbol from ns2 context
        ns1_symbol = symbols.get_symbol("ns1", "CH-01")
        assert ns1_symbol is not None, "Should access symbol from ns1"
        assert ns1_symbol.name == "Chapter 1", "Should get correct symbol"
        
        # Access ns2 symbol
        ns2_symbol = symbols.get_symbol("ns2", "CH-02")
        assert ns2_symbol is not None, "Should access symbol from ns2"
        assert ns2_symbol.name == "Chapter 2", "Should get correct symbol"
        
        # Verify isolation
        ns1_ch1_from_ns2 = symbols.get_symbol("ns1", "CH-01")
        assert ns1_ch1_from_ns2 is not None, "Should access ns1 symbol from ns2 context"
        
        print("  ✓ Cross-namespace symbol access passed")
        return True
    except Exception as e:
        print(f"  ✗ Cross-namespace symbol access test failed: {e}")
        import traceback
        traceback.print_exc()
        return False


def test_namespace_relation_ssm_blocks():
    """Test namespace information in relation SSM blocks."""
    print("Testing namespace in relation SSM blocks...")
    try:
        from modules.parser_ssm import ast_to_ssm_blocks
        from modules.extractor_terms import extract_terms_from_ast
        from modules.extractor_code import extract_code_entries
        from modules.extractor_diagrams import extract_diagrams_from_ast
        from modules.extractor_tables import extract_tables_from_ast
        
        errors = ErrorBus()
        symbols = SymbolTable(default_namespace="test_bible")
        
        test_md = """## Chapter 1 — Introduction

See Chapter 2.

## Chapter 2 — Details

Content.
"""
        doc = parse_markdown_to_ast(test_md, errors=errors, symbols=symbols)
        
        # Extract data
        terms = extract_terms_from_ast(doc)
        codes = extract_code_entries(doc)
        rels = extract_relations_from_ast(doc, errors=errors, symbols=symbols, namespace="test_bible")
        diags = extract_diagrams_from_ast(doc, errors=errors, symbols=symbols)
        tables = extract_tables_from_ast(doc, errors=errors, symbols=symbols)
        
        # Convert to SSM blocks
        blocks = ast_to_ssm_blocks(
            doc, terms, codes, rels, diags, tables=tables,
            errors=errors, symbols=symbols,
            namespace="test_bible"
        )
        
        # Find relation blocks
        relation_blocks = [b for b in blocks if b.block_type == "relation"]
        assert len(relation_blocks) > 0, "Should have relation blocks"
        
        rel_block = relation_blocks[0]
        assert "from_namespace" in rel_block.meta, "Should have from_namespace"
        assert "to_namespace" in rel_block.meta, "Should have to_namespace"
        assert rel_block.meta["from_namespace"] == "test_bible", "Should have correct namespace"
        
        print(f"  ✓ Found {len(relation_blocks)} relation block(s) with namespace")
        print("  ✓ Namespace in relation SSM blocks passed")
        return True
    except Exception as e:
        print(f"  ✗ Namespace in relation SSM blocks test failed: {e}")
        import traceback
        traceback.print_exc()
        return False


def test_no_namespace_collision():
    """Test that symbols in different namespaces don't collide."""
    print("Testing no namespace collision...")
    try:
        symbols = SymbolTable(default_namespace="bible1")
        
        # Add chapter 1 to bible1
        symbols.add_chapter(1, "CH-01", line_no=10, title="Bible 1 Chapter 1")
        
        # Switch to bible2
        symbols.set_namespace("bible2")
        # Add chapter 1 to bible2 (same number, should be allowed)
        symbols.add_chapter(1, "CH-01", line_no=20, title="Bible 2 Chapter 1")
        
        # Verify both exist
        bible1_ns = symbols.get_namespace("bible1")
        bible2_ns = symbols.get_namespace("bible2")
        
        assert bible1_ns.chapters[1] == "CH-01", "Bible1 should have chapter 1"
        assert bible2_ns.chapters[1] == "CH-01", "Bible2 should have chapter 1"
        
        # Verify they're different entries
        bible1_entry = bible1_ns.by_id["CH-01"]
        bible2_entry = bible2_ns.by_id["CH-01"]
        assert bible1_entry.name == "Bible 1 Chapter 1", "Bible1 entry should be correct"
        assert bible2_entry.name == "Bible 2 Chapter 1", "Bible2 entry should be correct"
        
        print("  ✓ No namespace collision passed")
        return True
    except Exception as e:
        print(f"  ✗ No namespace collision test failed: {e}")
        import traceback
        traceback.print_exc()
        return False


if __name__ == "__main__":
    print("=" * 60)
    print("Phase 6 Tests - Multi-language, Multi-tenant Symbol Table & Namespaces")
    print("=" * 60)
    print()
    
    tests = [
        test_multi_namespace_symbol_table,
        test_namespace_switching,
        test_namespace_aware_relations,
        test_cross_namespace_symbol_access,
        test_namespace_relation_ssm_blocks,
        test_no_namespace_collision,
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
        print("✓ All Phase 6 tests passed!")
        sys.exit(0)
    else:
        print("✗ Some Phase 6 tests failed")
        sys.exit(1)

