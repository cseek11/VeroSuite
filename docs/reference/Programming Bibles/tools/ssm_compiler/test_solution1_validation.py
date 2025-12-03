#!/usr/bin/env python3
"""
Test Solution 1: Two-Phase Processing Architecture

Tests the SemanticValidationPhase for:
- Duplicate chapter code detection and fixing
- Heading level validation
- Special section classification
"""
from __future__ import annotations

import sys
from pathlib import Path

# Add current directory to path
current_dir = Path(__file__).parent
if str(current_dir) not in sys.path:
    sys.path.insert(0, str(current_dir))

from modules.ast_nodes import ASTNode, ASTDocument
from modules.validation.semantic_validation import SemanticValidationPhase

# Import runtime components
try:
    from runtime.error_bus import ErrorBus
except ImportError:
    ErrorBus = None


def test_duplicate_chapter_codes():
    """Test that duplicate chapter codes are detected and fixed"""
    print("Test 1: Duplicate Chapter Codes")
    
    # Create AST with duplicate chapter codes
    ast = ASTDocument(nodes=[])
    
    chapter1 = ASTNode(
        type="chapter",
        text="Chapter 3 — Core Concepts",
        level=2,
        meta={"code": "CH-03", "title": "Core Concepts", "number": 3}
    )
    
    chapter2 = ASTNode(
        type="chapter",
        text="Chapter 3 — Evaluation Flow (Diagram)",
        level=2,
        meta={"code": "CH-03", "title": "Evaluation Flow (Diagram)", "number": 3}
    )
    
    ast.chapters = [chapter1, chapter2]
    ast.nodes = [chapter1, chapter2]
    
    # Run validation
    errors = ErrorBus() if ErrorBus else None
    validator = SemanticValidationPhase(errors=errors)
    
    # Execute validation
    validated_ast = validator.execute(ast)
    
    # Check that one was converted to section
    sections = [n for n in validated_ast.nodes if n.type == "section"]
    chapters = [n for n in validated_ast.nodes if n.type == "chapter"]
    
    assert len(sections) >= 1, f"Expected at least one section after conversion, got {len(sections)}"
    assert len(chapters) == 1, f"Expected 1 chapter, got {len(chapters)}"
    
    # Check that the diagram chapter was converted
    diagram_section = next((s for s in sections if "(Diagram)" in s.meta.get("title", "")), None)
    assert diagram_section is not None, "Expected diagram chapter to be converted to section"
    assert diagram_section.type == "section", "Diagram should be a section"
    assert diagram_section.meta.get("section_type") == "special", "Should be marked as special section"
    
    # Check that the real chapter is still a chapter
    real_chapter = next((c for c in chapters if "Core Concepts" in c.meta.get("title", "")), None)
    assert real_chapter is not None, "Expected real chapter to remain as chapter"
    assert real_chapter.type == "chapter", "Core Concepts should remain a chapter"
    
    print("  ✅ Duplicate chapter codes fixed")


def test_heading_level_validation():
    """Test that incorrect heading levels are detected"""
    print("Test 2: Heading Level Validation")
    
    ast = ASTDocument(nodes=[])
    
    # Create chapter with incorrect level (level 3 instead of 2)
    wrong_chapter = ASTNode(
        type="chapter",
        text="### Chapter 5 — Real-World Examples",
        level=3,  # Wrong level
        meta={"code": "CH-05", "title": "Real-World Examples", "number": 5}
    )
    
    ast.chapters = [wrong_chapter]
    ast.nodes = [wrong_chapter]
    
    # Run validation
    errors = ErrorBus() if ErrorBus else None
    validator = SemanticValidationPhase(errors=errors)
    
    # Execute validation
    validated_ast = validator.execute(ast)
    
    # Check that it was converted to section
    sections = [n for n in validated_ast.nodes if n.type == "section"]
    chapters = [n for n in validated_ast.nodes if n.type == "chapter"]
    
    assert len(sections) == 1, f"Expected 1 section, got {len(sections)}"
    assert len(chapters) == 0, f"Expected 0 chapters, got {len(chapters)}"
    assert sections[0].level == 3, f"Expected level 3, got {sections[0].level}"
    
    print("  ✅ Heading level validation working")


def test_special_section_classification():
    """Test that special sections (diagrams, appendices) are classified correctly"""
    print("Test 3: Special Section Classification")
    
    ast = ASTDocument(nodes=[])
    
    # Create diagram chapter
    diagram_chapter = ASTNode(
        type="chapter",
        text="Chapter 3 — Evaluation Flow (Diagram)",
        level=2,
        meta={"code": "CH-03", "title": "Evaluation Flow (Diagram)", "number": 3}
    )
    
    # Create appendix chapter
    appendix_chapter = ASTNode(
        type="chapter",
        text="Appendix A — Reference",
        level=2,
        meta={"code": "APP-A", "title": "Appendix A — Reference"}
    )
    
    # Create chapter with minimal content (should be classified as special)
    minimal_chapter = ASTNode(
        type="chapter",
        text="Chapter 10 — Quick Reference",
        level=2,
        meta={"code": "CH-10", "title": "Quick Reference", "number": 10}
    )
    # Add only 1 child (below threshold of 3)
    minimal_chapter.add_child(ASTNode(type="paragraph", text="Some text"))
    
    ast.chapters = [diagram_chapter, appendix_chapter, minimal_chapter]
    ast.nodes = [diagram_chapter, appendix_chapter, minimal_chapter]
    
    # Run validation
    errors = ErrorBus() if ErrorBus else None
    validator = SemanticValidationPhase(errors=errors)
    
    # Execute validation
    validated_ast = validator.execute(ast)
    
    # Check that special sections were converted
    sections = [n for n in validated_ast.nodes if n.type == "section"]
    chapters = validated_ast.get_all_chapters()
    
    # At least diagram and appendix should be converted
    assert len(sections) >= 2, f"Expected at least 2 sections, got {len(sections)}"
    
    # Check diagram was converted
    diagram_section = next((s for s in sections if "(Diagram)" in s.meta.get("title", "")), None)
    assert diagram_section is not None, "Diagram should be converted to section"
    
    print("  ✅ Special section classification working")


def test_validation_phase_integration():
    """Test that validation phase integrates correctly with compiler"""
    print("Test 4: Validation Phase Integration")
    
    # Test that validation phase can be imported and instantiated
    try:
        from modules.validation.semantic_validation import SemanticValidationPhase
        validator = SemanticValidationPhase()
        assert validator is not None, "Validator should be instantiable"
        print("  ✅ Validation phase can be imported and instantiated")
    except ImportError as e:
        print(f"  ❌ Import error: {e}")
        raise


if __name__ == "__main__":
    print("=" * 60)
    print("Testing Solution 1: Two-Phase Processing Architecture")
    print("=" * 60)
    
    try:
        test_duplicate_chapter_codes()
        test_heading_level_validation()
        test_special_section_classification()
        test_validation_phase_integration()
        
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

