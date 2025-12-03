#!/usr/bin/env python3
"""
Test Solution 2: Semantic Relation Extraction

Tests the SemanticRelationExtractor for:
- Pattern matching (requires, extends, contradicts, etc.)
- Code dependency extraction
- Concept relation extraction
- Structural relation hints
"""
from __future__ import annotations

import sys
from pathlib import Path

# Add current directory to path
current_dir = Path(__file__).parent
if str(current_dir) not in sys.path:
    sys.path.insert(0, str(current_dir))

from modules.ast_nodes import ASTNode, ASTDocument
from modules.extractor_semantic_relations import SemanticRelationExtractor

# Import runtime components
try:
    from runtime.error_bus import ErrorBus
    from runtime.symbol_table import SymbolTable
except ImportError:
    ErrorBus = None
    SymbolTable = None


def test_pattern_matching():
    """Test that semantic relation patterns are detected"""
    print("Test 1: Pattern Matching")
    
    ast = ASTDocument(nodes=[])
    
    # Create a chapter to provide context
    chapter = ASTNode(
        type="chapter",
        text="Chapter 1 — Introduction",
        level=2,
        meta={"code": "CH-01", "title": "Introduction", "number": 1},
        line_no=1
    )
    
    # Create paragraph with "requires" relation (as child of chapter)
    para1 = ASTNode(
        type="paragraph",
        text="This chapter requires understanding of Chapter 3.",
        level=0,
        line_no=10
    )
    chapter.add_child(para1)
    
    # Create paragraph with "extends" relation
    para2 = ASTNode(
        type="paragraph",
        text="This section extends the concepts from Chapter 5.",
        level=0,
        line_no=20
    )
    chapter.add_child(para2)
    
    # Create paragraph with "contradicts" relation
    para3 = ASTNode(
        type="paragraph",
        text="This approach contradicts the method described in Chapter 2.",
        level=0,
        line_no=30
    )
    chapter.add_child(para3)
    
    ast.chapters = [chapter]
    ast.nodes = [chapter, para1, para2, para3]
    
    # Run extraction
    errors = ErrorBus() if ErrorBus else None
    symbols = SymbolTable() if SymbolTable else None
    extractor = SemanticRelationExtractor(errors=errors, symbols=symbols)
    
    relations = extractor.extract(ast, namespace="test")
    
    # Debug output
    print(f"  Debug: Found {len(relations)} total relations")
    for rel in relations:
        print(f"    - {rel.relation_type}: {rel.source_id} -> {rel.target_id} (confidence: {rel.confidence})")
    
    # Check that relations were found
    requires_rels = [r for r in relations if r.relation_type == "requires"]
    extends_rels = [r for r in relations if r.relation_type == "extends"]
    contradicts_rels = [r for r in relations if r.relation_type == "contradicts"]
    
    print(f"  Debug: requires={len(requires_rels)}, extends={len(extends_rels)}, contradicts={len(contradicts_rels)}")
    
    assert len(requires_rels) > 0, f"Expected at least one 'requires' relation, got {len(requires_rels)}"
    assert len(extends_rels) > 0, f"Expected at least one 'extends' relation, got {len(extends_rels)}"
    assert len(contradicts_rels) > 0, f"Expected at least one 'contradicts' relation, got {len(contradicts_rels)}"
    
    # Check that chapter references were extracted
    requires_rel = requires_rels[0]
    assert requires_rel.target_id == "CH-03", f"Expected CH-03, got {requires_rel.target_id}"
    
    print("  ✅ Pattern matching working")


def test_code_dependencies():
    """Test that code dependencies are extracted"""
    print("Test 2: Code Dependencies")
    
    ast = ASTDocument(nodes=[])
    
    # Create code block with import
    code1 = ASTNode(
        type="code",
        text="import data.users\nimport data.roles",
        level=0,
        lang="rego",
        meta={"language": "rego"},
        line_no=10
    )
    
    # Create code block with built-in calls
    code2 = ASTNode(
        type="code",
        text="count(users)\nsum(values)",
        level=0,
        lang="rego",
        meta={"language": "rego"},
        line_no=20
    )
    
    ast.nodes = [code1, code2]
    
    # Run extraction
    errors = ErrorBus() if ErrorBus else None
    symbols = SymbolTable() if SymbolTable else None
    extractor = SemanticRelationExtractor(errors=errors, symbols=symbols)
    
    relations = extractor.extract(ast, namespace="test")
    
    # Check that import relations were found
    import_rels = [r for r in relations if r.relation_type == "requires" and "import" in r.evidence.lower()]
    assert len(import_rels) >= 2, f"Expected at least 2 import relations, got {len(import_rels)}"
    
    # Check that built-in relations were found
    builtin_rels = [r for r in relations if r.relation_type == "used_by" and r.source_id in ["count", "sum"]]
    assert len(builtin_rels) >= 2, f"Expected at least 2 built-in relations, got {len(builtin_rels)}"
    
    print("  ✅ Code dependency extraction working")


def test_structural_relations():
    """Test that structural relations (sequential chapters) are detected"""
    print("Test 3: Structural Relations")
    
    ast = ASTDocument(nodes=[])
    
    # Create sequential chapters
    ch1 = ASTNode(
        type="chapter",
        text="Chapter 1 — Introduction",
        level=2,
        meta={"code": "CH-01", "title": "Introduction", "number": 1},
        line_no=10
    )
    
    ch2 = ASTNode(
        type="chapter",
        text="Chapter 2 — Basics",
        level=2,
        meta={"code": "CH-02", "title": "Basics", "number": 2},
        line_no=50
    )
    
    ch3 = ASTNode(
        type="chapter",
        text="Chapter 3 — Advanced",
        level=2,
        meta={"code": "CH-03", "title": "Advanced", "number": 3},
        line_no=100
    )
    
    ast.chapters = [ch1, ch2, ch3]
    ast.nodes = [ch1, ch2, ch3]
    
    # Run extraction
    errors = ErrorBus() if ErrorBus else None
    symbols = SymbolTable() if SymbolTable else None
    extractor = SemanticRelationExtractor(errors=errors, symbols=symbols)
    
    relations = extractor.extract(ast, namespace="test")
    
    # Check that structural relations were found
    extends_rels = [r for r in relations if r.relation_type == "extends" and r.source_id.startswith("CH-")]
    assert len(extends_rels) >= 2, f"Expected at least 2 structural 'extends' relations, got {len(extends_rels)}"
    
    # Check that relations are sequential
    ch2_to_ch1 = next((r for r in extends_rels if r.source_id == "CH-02" and r.target_id == "CH-01"), None)
    assert ch2_to_ch1 is not None, "Expected CH-02 extends CH-01"
    
    print("  ✅ Structural relation extraction working")


def test_deduplication():
    """Test that duplicate relations are deduplicated"""
    print("Test 4: Deduplication")
    
    ast = ASTDocument(nodes=[])
    
    # Create a chapter to provide context
    chapter = ASTNode(
        type="chapter",
        text="Chapter 1 — Introduction",
        level=2,
        meta={"code": "CH-01", "title": "Introduction", "number": 1},
        line_no=1
    )
    
    # Create multiple paragraphs with same relation
    para1 = ASTNode(
        type="paragraph",
        text="This requires Chapter 3.",
        level=0,
        line_no=10
    )
    chapter.add_child(para1)
    
    para2 = ASTNode(
        type="paragraph",
        text="This also requires Chapter 3.",
        level=0,
        line_no=20
    )
    chapter.add_child(para2)
    
    ast.chapters = [chapter]
    ast.nodes = [chapter, para1, para2]
    
    # Run extraction
    errors = ErrorBus() if ErrorBus else None
    symbols = SymbolTable() if SymbolTable else None
    extractor = SemanticRelationExtractor(errors=errors, symbols=symbols)
    
    relations = extractor.extract(ast, namespace="test")
    
    # Check that duplicates were removed
    requires_rels = [r for r in relations if r.relation_type == "requires" and r.target_id == "CH-03"]
    assert len(requires_rels) == 1, f"Expected 1 deduplicated relation, got {len(requires_rels)}"
    
    print("  ✅ Deduplication working")


if __name__ == "__main__":
    print("=" * 60)
    print("Testing Solution 2: Semantic Relation Extraction")
    print("=" * 60)
    
    try:
        test_pattern_matching()
        test_code_dependencies()
        test_structural_relations()
        test_deduplication()
        
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

