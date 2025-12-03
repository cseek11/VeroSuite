#!/usr/bin/env python3
"""
Test Solution 3: AST-Based Term Extraction

Tests the ASTTermExtractor for:
- Full definition extraction (not truncated)
- Code blocks within definitions
- Multi-line definitions
- Continuation node collection
"""
from __future__ import annotations

import sys
from pathlib import Path

# Add current directory to path
current_dir = Path(__file__).parent
if str(current_dir) not in sys.path:
    sys.path.insert(0, str(current_dir))

from modules.ast_nodes import ASTNode, ASTDocument
from modules.extractor_terms_v3 import ASTTermExtractor

# Import runtime components
try:
    from runtime.error_bus import ErrorBus
    from runtime.symbol_table import SymbolTable
except ImportError:
    ErrorBus = None
    SymbolTable = None


def test_full_definition_extraction():
    """Test that full definitions are extracted, not truncated"""
    print("Test 1: Full Definition Extraction")
    
    ast = ASTDocument(nodes=[])
    
    # Create paragraph with term definition that would be truncated by regex
    para1 = ASTNode(
        type="paragraph",
        text="**Core Capabilities**: This includes `import rego` and other features. It also supports multi-line definitions that span multiple sentences.",
        level=0,
        line_no=10
    )
    
    ast.nodes = [para1]
    
    # Run extraction
    errors = ErrorBus() if ErrorBus else None
    symbols = SymbolTable() if SymbolTable else None
    extractor = ASTTermExtractor(errors=errors, symbols=symbols)
    
    terms = extractor.extract(ast)
    
    assert len(terms) == 1, f"Expected 1 term, got {len(terms)}"
    
    term = terms[0]
    assert term.name == "Core Capabilities", f"Expected 'Core Capabilities', got '{term.name}'"
    
    # Check that definition includes code block and full text
    assert "import rego" in term.definition, "Definition should include code reference"
    assert "multi-line definitions" in term.definition, "Definition should include full text"
    assert len(term.definition) > 50, f"Definition should be full length, got {len(term.definition)} chars"
    
    print("  ✅ Full definition extraction working")


def test_code_blocks_in_definitions():
    """Test that code blocks within definitions are preserved"""
    print("Test 2: Code Blocks in Definitions")
    
    ast = ASTDocument(nodes=[])
    
    # Create paragraph with term definition
    para1 = ASTNode(
        type="paragraph",
        text="**Rego Policy**: A policy written in Rego language.",
        level=0,
        line_no=10
    )
    
    # Create code block that continues the definition
    code1 = ASTNode(
        type="code",
        text="package example\nallow { true }",
        level=0,
        lang="rego",
        meta={"language": "rego"},
        line_no=11
    )
    
    # Create parent node
    parent = ASTNode(type="section", text="", level=3, line_no=9)
    parent.add_child(para1)
    parent.add_child(code1)
    
    ast.nodes = [parent, para1, code1]
    
    # Run extraction
    errors = ErrorBus() if ErrorBus else None
    symbols = SymbolTable() if SymbolTable else None
    extractor = ASTTermExtractor(errors=errors, symbols=symbols)
    
    terms = extractor.extract(ast)
    
    assert len(terms) == 1, f"Expected 1 term, got {len(terms)}"
    
    term = terms[0]
    # Check that code block is included in definition
    assert "```" in term.definition or "package example" in term.definition, \
        "Definition should include code block content"
    
    print("  ✅ Code blocks in definitions preserved")


def test_multi_line_definitions():
    """Test that multi-line definitions are collected"""
    print("Test 3: Multi-line Definitions")
    
    ast = ASTDocument(nodes=[])
    
    # Create paragraph with term definition
    para1 = ASTNode(
        type="paragraph",
        text="**Stratified Negation**: A form of negation in Rego.",
        level=0,
        line_no=10
    )
    
    # Create continuation paragraph
    para2 = ASTNode(
        type="paragraph",
        text="It ensures that negation is evaluated correctly in the presence of variables.",
        level=0,
        line_no=11
    )
    
    # Create another continuation
    para3 = ASTNode(
        type="paragraph",
        text="This is important for performance and correctness.",
        level=0,
        line_no=12
    )
    
    # Create parent node
    parent = ASTNode(type="section", text="", level=3, line_no=9)
    parent.add_child(para1)
    parent.add_child(para2)
    parent.add_child(para3)
    
    ast.nodes = [parent, para1, para2, para3]
    
    # Run extraction
    errors = ErrorBus() if ErrorBus else None
    symbols = SymbolTable() if SymbolTable else None
    extractor = ASTTermExtractor(errors=errors, symbols=symbols)
    
    terms = extractor.extract(ast)
    
    assert len(terms) == 1, f"Expected 1 term, got {len(terms)}"
    
    term = terms[0]
    
    # Check that all continuation text is included
    assert "Stratified Negation" in term.definition or "form of negation" in term.definition, \
        f"Definition should include initial text. Got: {term.definition[:100]}"
    assert "ensures that negation" in term.definition, "Definition should include continuation text"
    assert "performance and correctness" in term.definition, "Definition should include all continuation"
    
    # Check that definition is multi-line
    assert len(term.definition) > 100, f"Definition should be multi-line, got {len(term.definition)} chars"
    
    print("  ✅ Multi-line definitions collected")


def test_definition_boundaries():
    """Test that definition collection stops at boundaries"""
    print("Test 4: Definition Boundaries")
    
    ast = ASTDocument(nodes=[])
    
    # Create paragraph with term definition
    para1 = ASTNode(
        type="paragraph",
        text="**Term 1**: Definition of term 1.",
        level=0,
        line_no=10
    )
    
    # Create continuation paragraph
    para2 = ASTNode(
        type="paragraph",
        text="More details about term 1.",
        level=0,
        line_no=11
    )
    
    # Create next term definition (boundary)
    para3 = ASTNode(
        type="paragraph",
        text="**Term 2**: Definition of term 2.",
        level=0,
        line_no=12
    )
    
    # Create parent node
    parent = ASTNode(type="section", text="", level=3, line_no=9)
    parent.add_child(para1)
    parent.add_child(para2)
    parent.add_child(para3)
    
    ast.nodes = [parent, para1, para2, para3]
    
    # Run extraction
    errors = ErrorBus() if ErrorBus else None
    symbols = SymbolTable() if SymbolTable else None
    extractor = ASTTermExtractor(errors=errors, symbols=symbols)
    
    terms = extractor.extract(ast)
    
    assert len(terms) == 2, f"Expected 2 terms, got {len(terms)}"
    
    term1 = next((t for t in terms if t.name == "Term 1"), None)
    term2 = next((t for t in terms if t.name == "Term 2"), None)
    
    assert term1 is not None, "Term 1 should be extracted"
    assert term2 is not None, "Term 2 should be extracted"
    
    # Check that term1 includes continuation but not term2's definition
    assert "More details about term 1" in term1.definition
    assert "Definition of term 2" not in term1.definition
    
    print("  ✅ Definition boundaries respected")


if __name__ == "__main__":
    print("=" * 60)
    print("Testing Solution 3: AST-Based Term Extraction")
    print("=" * 60)
    
    try:
        test_full_definition_extraction()
        test_code_blocks_in_definitions()
        test_multi_line_definitions()
        test_definition_boundaries()
        
        print("\n" + "=" * 60)
        print("✅ All tests passed!")
        print("=" * 60)
    except AssertionError as e:
        print(f"\n❌ Test failed: {e}")
        sys.exit(1)
    except Exception as e:
        print(f"\n❌ Unexpected error: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)

