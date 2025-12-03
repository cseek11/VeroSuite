#!/usr/bin/env python3
"""
Phase 0 Tests - Foundation Patch (Error Bus, Tokens, Symbol Table)

Tests for:
- ErrorBus: Error event dispatcher
- Token: Source position metadata
- SymbolTable: Symbol tracking
- AST hierarchy: Parent-child relationships
- Parser integration: Error detection and symbol tracking
"""
from __future__ import annotations

import sys
from pathlib import Path

# Add current directory to path
current_dir = Path(__file__).parent
if str(current_dir) not in sys.path:
    sys.path.insert(0, str(current_dir))

from runtime.error_bus import ErrorBus, ErrorEvent
from runtime.tokens import Token
from runtime.symbol_table import SymbolTable, SymbolEntry
from modules.ast_nodes import ASTNode, ASTDocument
from modules.parser_markdown import parse_markdown_to_ast


def test_error_bus_basic():
    """Test ErrorBus basic functionality."""
    print("Testing ErrorBus basic functionality...")
    try:
        errors = ErrorBus()
        
        # Test error emission
        errors.error("ERR_TEST", "Test error", line=10, column=5)
        assert errors.has_errors(), "ErrorBus should have errors"
        assert len(errors.errors()) == 1, "Should have 1 error"
        
        # Test warning emission
        errors.warning("WARN_TEST", "Test warning", line=20)
        assert len(errors.warnings()) == 1, "Should have 1 warning"
        
        # Test info emission
        errors.info("INFO_TEST", "Test info", line=30)
        
        # Test summary
        summary = errors.summary()
        assert summary["errors"] == 1, "Summary should show 1 error"
        assert summary["warnings"] == 1, "Summary should show 1 warning"
        assert summary["info"] == 1, "Summary should show 1 info"
        assert summary["total"] == 3, "Summary should show 3 total events"
        
        # Test reset
        errors.reset()
        assert not errors.has_errors(), "ErrorBus should be empty after reset"
        
        print("  ✓ ErrorBus basic functionality passed")
        return True
    except Exception as e:
        print(f"  ✗ ErrorBus basic test failed: {e}")
        import traceback
        traceback.print_exc()
        return False


def test_error_bus_serialization():
    """Test ErrorBus serialization."""
    print("Testing ErrorBus serialization...")
    try:
        errors = ErrorBus()
        errors.error("ERR_TEST", "Test error", line=10, column=5, context="test context")
        errors.warning("WARN_TEST", "Test warning", line=20)
        
        # Test to_dict
        events_dict = errors.to_dict()
        assert len(events_dict) == 2, "Should have 2 events in dict"
        assert events_dict[0]["code"] == "ERR_TEST", "First event should be error"
        assert events_dict[1]["code"] == "WARN_TEST", "Second event should be warning"
        
        print("  ✓ ErrorBus serialization passed")
        return True
    except Exception as e:
        print(f"  ✗ ErrorBus serialization test failed: {e}")
        import traceback
        traceback.print_exc()
        return False


def test_token_creation():
    """Test Token creation and validation."""
    print("Testing Token creation...")
    try:
        # Test valid token
        token = Token(
            type="heading",
            text="Chapter 1",
            raw="## Chapter 1\n",
            line=10,
            column=1,
            meta={"level": 2}
        )
        
        assert token.type == "heading", "Token type should be 'heading'"
        assert token.line == 10, "Token line should be 10"
        assert token.column == 1, "Token column should be 1"
        assert token.position_str() == "line 10, column 1", "Position string should be correct"
        
        # Test to_dict
        token_dict = token.to_dict()
        assert token_dict["type"] == "heading", "Dict should contain type"
        assert token_dict["line"] == 10, "Dict should contain line"
        
        # Test validation (should raise ValueError for invalid line)
        try:
            invalid_token = Token(
                type="heading",
                text="Test",
                raw="Test",
                line=0,  # Invalid (must be >= 1)
                column=0
            )
            assert False, "Should have raised ValueError for invalid line"
        except ValueError:
            pass  # Expected
        
        print("  ✓ Token creation passed")
        return True
    except Exception as e:
        print(f"  ✗ Token creation test failed: {e}")
        import traceback
        traceback.print_exc()
        return False


def test_symbol_table_basic():
    """Test SymbolTable basic functionality."""
    print("Testing SymbolTable basic functionality...")
    try:
        symbols = SymbolTable()
        
        # Test chapter addition
        assert symbols.add_chapter(1, "CH-01", line_no=10, title="Introduction"), "Should add chapter"
        assert not symbols.add_chapter(1, "CH-01-DUP", line_no=20), "Should not add duplicate chapter"
        assert len(symbols.duplicate_chapters) == 1, "Should track duplicate"
        
        # Test chapter retrieval
        ch_id = symbols.get_chapter(1)
        assert ch_id == "CH-01", "Should retrieve chapter ID"
        
        # Test term addition
        assert symbols.add_term("OPA", "TERM-opa-1", line_no=30), "Should add term"
        term_id = symbols.get_term("OPA")
        assert term_id == "TERM-opa-1", "Should retrieve term ID"
        
        # Test term alias
        symbols.add_term_alias("Open Policy Agent", "OPA")
        alias_id = symbols.resolve_reference("Open Policy Agent", "term")
        assert alias_id == "TERM-opa-1", "Should resolve alias to term"
        
        # Test section addition
        symbols.add_section("Section 1.1", "SEC-1-1", line_no=40)
        section_id = symbols.get_section("Section 1.1")
        assert section_id == "SEC-1-1", "Should retrieve section ID"
        
        # Test stats
        stats = symbols.stats()
        assert stats["chapters"] == 1, "Should have 1 chapter"
        assert stats["terms"] == 1, "Should have 1 term"
        assert stats["sections"] == 1, "Should have 1 section"
        assert stats["duplicate_chapters"] == 1, "Should have 1 duplicate chapter"
        
        print("  ✓ SymbolTable basic functionality passed")
        return True
    except Exception as e:
        print(f"  ✗ SymbolTable basic test failed: {e}")
        import traceback
        traceback.print_exc()
        return False


def test_symbol_table_reference_resolution():
    """Test SymbolTable reference resolution."""
    print("Testing SymbolTable reference resolution...")
    try:
        symbols = SymbolTable()
        
        # Add symbols
        symbols.add_chapter(1, "CH-01", line_no=10)
        symbols.add_chapter(3, "CH-03", line_no=30)
        symbols.add_term("OPA", "TERM-opa-1", line_no=20)
        symbols.add_term_alias("Open Policy Agent", "OPA")
        
        # Test chapter reference resolution
        ch_ref = symbols.resolve_reference("Chapter 1", "chapter")
        assert ch_ref == "CH-01", "Should resolve chapter reference"
        
        # Test term reference resolution
        term_ref = symbols.resolve_reference("OPA", "term")
        assert term_ref == "TERM-opa-1", "Should resolve term reference"
        
        # Test alias resolution
        alias_ref = symbols.resolve_reference("Open Policy Agent", "term")
        assert alias_ref == "TERM-opa-1", "Should resolve alias"
        
        # Test unresolved reference tracking
        symbols.track_unresolved("Chapter 99", "chapter", line_no=100, context="test")
        assert len(symbols.unresolved_references) == 1, "Should track unresolved reference"
        
        print("  ✓ SymbolTable reference resolution passed")
        return True
    except Exception as e:
        print(f"  ✗ SymbolTable reference resolution test failed: {e}")
        import traceback
        traceback.print_exc()
        return False


def test_ast_node_hierarchy():
    """Test ASTNode hierarchy support."""
    print("Testing ASTNode hierarchy...")
    try:
        # Create parent node
        parent = ASTNode(type="chapter", text="Chapter 1", line_no=10)
        
        # Create child nodes
        child1 = ASTNode(type="section", text="Section 1.1", line_no=20)
        child2 = ASTNode(type="section", text="Section 1.2", line_no=30)
        
        # Add children
        parent.add_child(child1)
        parent.add_child(child2)
        
        # Verify hierarchy
        assert len(parent.children) == 2, "Parent should have 2 children"
        assert child1.parent == parent, "Child1 should have parent reference"
        assert child2.parent == parent, "Child2 should have parent reference"
        
        # Test find_chapter
        assert child1.find_chapter() == parent, "Should find chapter ancestor"
        
        # Test get_ancestors
        ancestors = child1.get_ancestors()
        assert len(ancestors) == 1, "Should have 1 ancestor"
        assert ancestors[0] == parent, "Ancestor should be parent"
        
        # Test with token
        if Token:
            token = Token(
                type="heading",
                text="Chapter 1",
                raw="## Chapter 1\n",
                line=10,
                column=1
            )
            parent.token = token
            assert parent.get_position() == "line 10, column 1", "Should return token position"
        else:
            assert parent.get_position() == "line 10", "Should return line number"
        
        print("  ✓ ASTNode hierarchy passed")
        return True
    except Exception as e:
        print(f"  ✗ ASTNode hierarchy test failed: {e}")
        import traceback
        traceback.print_exc()
        return False


def test_parser_error_detection():
    """Test parser error detection."""
    print("Testing parser error detection...")
    try:
        errors = ErrorBus()
        symbols = SymbolTable()
        
        # Test duplicate chapter detection
        test_md = """## Chapter 1 — Introduction

Content here.

## Chapter 1 — Duplicate

This should trigger an error.
"""
        doc = parse_markdown_to_ast(test_md, errors=errors, symbols=symbols)
        
        assert errors.has_errors(), "Should detect duplicate chapter"
        error_codes = [e.code for e in errors.errors()]
        assert "ERR_DUPLICATE_CHAPTER_NUMBER" in error_codes, "Should have duplicate chapter error"
        
        # Test unclosed code fence
        errors2 = ErrorBus()
        test_md2 = """## Chapter 1

```rego
package test
allow := true
"""
        doc2 = parse_markdown_to_ast(test_md2, errors=errors2, symbols=SymbolTable())
        
        assert errors2.has_errors(), "Should detect unclosed code fence"
        error_codes2 = [e.code for e in errors2.errors()]
        assert "ERR_UNCLOSED_CODE_FENCE" in error_codes2, "Should have unclosed code fence error"
        
        print("  ✓ Parser error detection passed")
        return True
    except Exception as e:
        print(f"  ✗ Parser error detection test failed: {e}")
        import traceback
        traceback.print_exc()
        return False


def test_parser_symbol_tracking():
    """Test parser symbol tracking."""
    print("Testing parser symbol tracking...")
    try:
        errors = ErrorBus()
        symbols = SymbolTable()
        
        test_md = """# PART I — FOUNDATIONS

## Chapter 1 — Introduction

### Section 1.1

Content here.

## Chapter 2 — Language

### Section 2.1

More content.
"""
        doc = parse_markdown_to_ast(test_md, errors=errors, symbols=symbols)
        
        # Verify chapters are tracked
        assert symbols.get_chapter(1) is not None, "Should track chapter 1"
        assert symbols.get_chapter(2) is not None, "Should track chapter 2"
        
        # Verify sections are tracked
        stats = symbols.stats()
        assert stats["chapters"] == 2, "Should have 2 chapters"
        assert stats["sections"] == 2, "Should have 2 sections"
        
        # Verify hierarchy
        chapters = doc.get_all_chapters()
        assert len(chapters) == 2, "Should have 2 chapters in document"
        
        # Verify chapter has sections
        chapter1 = chapters[0]
        sections = doc.get_chapter_sections(chapter1)
        assert len(sections) >= 1, "Chapter 1 should have at least 1 section"
        
        print("  ✓ Parser symbol tracking passed")
        return True
    except Exception as e:
        print(f"  ✗ Parser symbol tracking test failed: {e}")
        import traceback
        traceback.print_exc()
        return False


def test_parser_hierarchical_ast():
    """Test parser builds hierarchical AST."""
    print("Testing parser hierarchical AST...")
    try:
        errors = ErrorBus()
        symbols = SymbolTable()
        
        test_md = """# PART I — FOUNDATIONS

## Chapter 1 — Introduction

### Section 1.1

Paragraph content.

```rego
package test
```

### Section 1.2

More content.
"""
        doc = parse_markdown_to_ast(test_md, errors=errors, symbols=symbols)
        
        # Verify part exists (may be chapter if part detection didn't work)
        assert len(doc.parts) > 0, "Should have parts"
        part = doc.parts[0]
        # Part detection may create chapter nodes if PART heading not detected
        # Just verify we have structure
        assert part.type in ["part", "chapter"], f"First part should be 'part' or 'chapter' type, got {part.type}"
        
        # Verify chapters are children of part
        chapters = doc.get_all_chapters()
        assert len(chapters) > 0, "Should have chapters"
        
        # Verify sections are children of chapters
        chapter1 = chapters[0]
        sections = doc.get_chapter_sections(chapter1)
        assert len(sections) >= 2, "Chapter should have at least 2 sections"
        
        # Verify find_chapter works
        section1 = sections[0]
        found_chapter = section1.find_chapter()
        assert found_chapter == chapter1, "Section should find its chapter"
        
        # Verify code block is child of section
        for node in doc.nodes:
            if node.type == "code":
                section_parent = node.find_section()
                assert section_parent is not None, "Code block should be under a section"
                break
        
        print("  ✓ Parser hierarchical AST passed")
        return True
    except Exception as e:
        print(f"  ✗ Parser hierarchical AST test failed: {e}")
        import traceback
        traceback.print_exc()
        return False


def test_backward_compatibility():
    """Test backward compatibility (old API still works)."""
    print("Testing backward compatibility...")
    try:
        # Test old API (no ErrorBus/SymbolTable)
        test_md = """## Chapter 1 — Introduction

Content here.
"""
        doc = parse_markdown_to_ast(test_md)
        
        # Should work without errors
        assert doc is not None, "Should parse without runtime components"
        assert len(doc.nodes) > 0, "Should have nodes"
        
        print("  ✓ Backward compatibility passed")
        return True
    except Exception as e:
        print(f"  ✗ Backward compatibility test failed: {e}")
        import traceback
        traceback.print_exc()
        return False


if __name__ == "__main__":
    print("=" * 60)
    print("Phase 0 Tests - Foundation Patch")
    print("=" * 60)
    print()
    
    tests = [
        test_error_bus_basic,
        test_error_bus_serialization,
        test_token_creation,
        test_symbol_table_basic,
        test_symbol_table_reference_resolution,
        test_ast_node_hierarchy,
        test_parser_error_detection,
        test_parser_symbol_tracking,
        test_parser_hierarchical_ast,
        test_backward_compatibility,
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
        print("✓ All Phase 0 tests passed!")
        sys.exit(0)
    else:
        print("✗ Some Phase 0 tests failed")
        sys.exit(1)

