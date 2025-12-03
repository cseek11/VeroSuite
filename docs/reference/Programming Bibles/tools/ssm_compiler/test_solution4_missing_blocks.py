#!/usr/bin/env python3
"""
Test Solution 4: Missing Block Types

Tests extractors for antipattern, rationale, and contrast blocks.
"""
from __future__ import annotations

import sys
from pathlib import Path

# Add current directory to path
current_dir = Path(__file__).parent
if str(current_dir) not in sys.path:
    sys.path.insert(0, str(current_dir))

from modules.ast_nodes import ASTNode, ASTDocument
from modules.extractor_antipatterns import AntipatternExtractor
from modules.extractor_rationale import RationaleExtractor
from modules.extractor_contrast import ContrastExtractor

# Import runtime components
try:
    from runtime.error_bus import ErrorBus
    from runtime.symbol_table import SymbolTable
except ImportError:
    ErrorBus = None
    SymbolTable = None


def test_antipattern_extraction():
    """Test that antipatterns are detected and extracted"""
    print("Test 1: Antipattern Extraction")
    
    ast = ASTDocument(nodes=[])
    
    # Create paragraph with antipattern
    para1 = ASTNode(
        type="paragraph",
        text="Don't use unsafe variables in Rego policies. This is a common mistake that can lead to security vulnerabilities.",
        level=0,
        line_no=10
    )
    
    # Create paragraph with solution
    para2 = ASTNode(
        type="paragraph",
        text="Instead, use input validation and proper variable scoping.",
        level=0,
        line_no=11
    )
    
    # Create parent node
    parent = ASTNode(type="section", text="", level=3, line_no=9)
    parent.add_child(para1)
    parent.add_child(para2)
    
    ast.nodes = [parent, para1, para2]
    
    # Run extraction
    errors = ErrorBus() if ErrorBus else None
    symbols = SymbolTable() if SymbolTable else None
    extractor = AntipatternExtractor(errors=errors, symbols=symbols)
    
    antipatterns = extractor.extract(ast)
    
    assert len(antipatterns) > 0, f"Expected at least 1 antipattern, got {len(antipatterns)}"
    
    ap = antipatterns[0]
    assert "unsafe variables" in ap.problem.lower() or "common mistake" in ap.problem.lower(), \
        f"Problem should mention the issue. Got: {ap.problem}"
    assert ap.severity in ["high", "medium", "low"], f"Severity should be high/medium/low, got {ap.severity}"
    
    print("  ✅ Antipattern extraction working")


def test_rationale_extraction():
    """Test that rationales are detected and extracted"""
    print("Test 2: Rationale Extraction")
    
    ast = ASTDocument(nodes=[])
    
    # Create paragraph with rationale
    para1 = ASTNode(
        type="paragraph",
        text="We use stratified negation because it ensures that negation is evaluated correctly in the presence of variables.",
        level=0,
        line_no=10
    )
    
    ast.nodes = [para1]
    
    # Run extraction
    errors = ErrorBus() if ErrorBus else None
    symbols = SymbolTable() if SymbolTable else None
    extractor = RationaleExtractor(errors=errors, symbols=symbols)
    
    rationales = extractor.extract(ast)
    
    assert len(rationales) > 0, f"Expected at least 1 rationale, got {len(rationales)}"
    
    rat = rationales[0]
    assert "because" in rat.explanation.lower() or "ensures" in rat.explanation.lower(), \
        f"Explanation should include reasoning. Got: {rat.explanation}"
    
    print("  ✅ Rationale extraction working")


def test_contrast_extraction():
    """Test that contrasts are detected and extracted"""
    print("Test 3: Contrast Extraction")
    
    ast = ASTDocument(nodes=[])
    
    # Create paragraph with contrast
    para1 = ASTNode(
        type="paragraph",
        text="Sidecar deployment vs Central deployment: Sidecar runs alongside each service, while Central runs as a separate service.",
        level=0,
        line_no=10
    )
    
    ast.nodes = [para1]
    
    # Run extraction
    errors = ErrorBus() if ErrorBus else None
    symbols = SymbolTable() if SymbolTable else None
    extractor = ContrastExtractor(errors=errors, symbols=symbols)
    
    contrasts = extractor.extract(ast)
    
    assert len(contrasts) > 0, f"Expected at least 1 contrast, got {len(contrasts)}"
    
    cont = contrasts[0]
    assert cont.concept_a and cont.concept_b, \
        f"Should extract both concepts. Got: {cont.concept_a} vs {cont.concept_b}"
    assert "sidecar" in cont.concept_a.lower() or "sidecar" in cont.concept_b.lower(), \
        "Should extract Sidecar as one concept"
    assert "central" in cont.concept_a.lower() or "central" in cont.concept_b.lower(), \
        "Should extract Central as one concept"
    
    print("  ✅ Contrast extraction working")


if __name__ == "__main__":
    print("=" * 60)
    print("Testing Solution 4: Missing Block Types")
    print("=" * 60)
    
    try:
        test_antipattern_extraction()
        test_rationale_extraction()
        test_contrast_extraction()
        
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

