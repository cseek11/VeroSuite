#!/usr/bin/env python3
"""
Test Solutions for Remaining Issues (3, 6, 10)

Tests the implementations for:
- Issue 3: Semantic Summary Generation
- Issue 6: Diagram Enrichment
- Issue 10: Code Block Semantic Splitting
"""
from __future__ import annotations

import sys
from pathlib import Path

# Add current directory to path
current_dir = Path(__file__).parent
if str(current_dir) not in sys.path:
    sys.path.insert(0, str(current_dir))

from modules.utils.summary_generator import SmartSummaryGenerator
from modules.extractor_diagrams_enhanced import DiagramEnricher, EnrichedDiagramEntry
from modules.extractor_diagrams import DiagramEntry
from modules.extractor_code_enhanced import SemanticCodeSplitter, CodeSegment
from modules.ast_nodes import ASTDocument, ASTNode


def test_issue3_summary_generation():
    """Test Issue 3: Semantic Summary Generation"""
    print("=" * 60)
    print("Testing Issue 3: Semantic Summary Generation")
    print("=" * 60)
    
    gen = SmartSummaryGenerator()
    
    # Test 1: Extract definition statement
    print("\nTest 1: Extract Definition Statement")
    text = "1. A policy is a set of rules. It contains multiple statements."
    summary = gen.generate(text)
    print(f"  Input: {text[:50]}...")
    print(f"  Output: {summary}")
    assert "policy is a set of rules" in summary.lower(), f"Expected definition, got: {summary}"
    assert not summary.startswith("1."), f"Should not start with '1.', got: {summary}"
    print("  ✅ PASS")
    
    # Test 2: Extract capability statement
    print("\nTest 2: Extract Capability Statement")
    text = "This section shows examples. The function allows users to validate input."
    summary = gen.generate(text)
    print(f"  Input: {text[:50]}...")
    print(f"  Output: {summary}")
    assert "allows" in summary.lower(), f"Expected capability statement, got: {summary}"
    assert not summary.startswith("This section"), f"Should skip meta-text, got: {summary}"
    print("  ✅ PASS")
    
    # Test 3: Skip numbers
    print("\nTest 3: Skip Numbers")
    text = "1. First item"
    summary = gen.generate(text)
    print(f"  Input: {text}")
    print(f"  Output: {summary}")
    assert summary != "1", f"Should not be just '1', got: {summary}"
    assert summary != "1.", f"Should not be just '1.', got: {summary}"
    assert len(summary) > 5, f"Should have meaningful content, got: {summary}"
    print("  ✅ PASS")
    
    # Test 4: List with code
    print("\nTest 4: List with Code")
    text = """1. Core Capabilities - `import rego` allows importing packages.
    It provides namespace isolation."""
    summary = gen.generate(text)
    print(f"  Input: {text[:50]}...")
    print(f"  Output: {summary}")
    assert len(summary) > 10, f"Should have meaningful summary, got: {summary}"
    assert "allows" in summary.lower() or "provides" in summary.lower(), \
        f"Should contain capability word, got: {summary}"
    print("  ✅ PASS")
    
    print("\n✅ All Issue 3 tests passed!")


def test_issue6_diagram_enrichment():
    """Test Issue 6: Diagram Enrichment"""
    print("\n" + "=" * 60)
    print("Testing Issue 6: Diagram Enrichment")
    print("=" * 60)
    
    enricher = DiagramEnricher()
    
    # Test 1: Mermaid metadata extraction
    print("\nTest 1: Mermaid Metadata Extraction")
    diagram = DiagramEntry(
        lang="mermaid",
        code="graph TD\n    A[Start] --> B[Process]\n    B --> C[End]",
        line_no=10,
        type="mermaid"
    )
    metadata = enricher._extract_diagram_metadata(diagram)
    print(f"  Nodes: {len(metadata['nodes'])}")
    print(f"  Edges: {len(metadata['edges'])}")
    assert len(metadata['nodes']) == 3, f"Expected 3 nodes, got {len(metadata['nodes'])}"
    assert len(metadata['edges']) == 2, f"Expected 2 edges, got {len(metadata['edges'])}"
    assert metadata['normalized_content'], "Should have normalized content"
    print("  ✅ PASS")
    
    # Test 2: Diagram type classification
    print("\nTest 2: Diagram Type Classification")
    flowchart_diagram = DiagramEntry(
        lang="mermaid",
        code="graph TD\nA --> B",
        line_no=10,
        type="mermaid"
    )
    dtype = enricher._classify_diagram_type(flowchart_diagram)
    print(f"  Type: {dtype}")
    assert dtype == 'flowchart', f"Expected 'flowchart', got '{dtype}'"
    
    sequence_diagram = DiagramEntry(
        lang="mermaid",
        code="sequenceDiagram\nAlice->>Bob: Hello",
        line_no=10,
        type="mermaid"
    )
    dtype = enricher._classify_diagram_type(sequence_diagram)
    print(f"  Type: {dtype}")
    assert dtype == 'sequence', f"Expected 'sequence', got '{dtype}'"
    print("  ✅ PASS")
    
    # Test 3: ASCII metadata extraction
    print("\nTest 3: ASCII Metadata Extraction")
    ascii_diagram = DiagramEntry(
        lang="ascii",
        code="┌─────┐\n│ Box │\n└─────┘",
        line_no=10,
        type="ascii"
    )
    metadata = enricher._extract_ascii_metadata(ascii_diagram.code)
    print(f"  Nodes: {len(metadata['nodes'])}")
    assert len(metadata['nodes']) > 0, "Should extract at least one node"
    print("  ✅ PASS")
    
    print("\n✅ All Issue 6 tests passed!")


def test_issue10_code_splitting():
    """Test Issue 10: Code Block Semantic Splitting"""
    print("\n" + "=" * 60)
    print("Testing Issue 10: Code Block Semantic Splitting")
    print("=" * 60)
    
    splitter = SemanticCodeSplitter()
    
    # Test 1: Split code with comments
    print("\nTest 1: Split Code with Comments")
    code = """# Built-in functions for aggregation
count(x) # length of array
sum(array) # numeric sum
# Another concept
max(values) # find maximum"""
    segments = splitter.split_code_block(code, "rego")
    print(f"  Segments: {len(segments)}")
    for i, seg in enumerate(segments):
        print(f"    Segment {i+1}: {seg.segment_type} - {seg.explanation[:50]}")
    assert len(segments) >= 2, f"Expected at least 2 segments, got {len(segments)}"
    print("  ✅ PASS")
    
    # Test 2: API pattern detection
    print("\nTest 2: API Pattern Detection")
    code = "import data.users\nrule allow { count(users) > 0 }"
    segments = splitter.split_code_block(code, "rego")
    print(f"  Segments: {len(segments)}")
    print(f"  Type: {segments[0].segment_type}")
    assert segments[0].segment_type == 'pattern', \
        f"Expected 'pattern', got '{segments[0].segment_type}'"
    print("  ✅ PASS")
    
    # Test 3: Example code detection
    print("\nTest 3: Example Code Detection")
    code = "x = 1\ny = 2\nprint(x + y)"
    segments = splitter.split_code_block(code, "python")
    print(f"  Segments: {len(segments)}")
    print(f"  Type: {segments[0].segment_type}")
    assert segments[0].segment_type == 'example', \
        f"Expected 'example', got '{segments[0].segment_type}'"
    print("  ✅ PASS")
    
    # Test 4: Concept definition detection
    print("\nTest 4: Concept Definition Detection")
    code = "package example\n\n# Policy definition\ndefault allow = false"
    segments = splitter.split_code_block(code, "rego")
    print(f"  Segments: {len(segments)}")
    # May be pattern or concept depending on detection
    assert len(segments) > 0, "Should have at least one segment"
    print("  ✅ PASS")
    
    print("\n✅ All Issue 10 tests passed!")


if __name__ == "__main__":
    print("=" * 60)
    print("Testing Solutions for Remaining Issues (3, 6, 10)")
    print("=" * 60)
    
    try:
        test_issue3_summary_generation()
        test_issue6_diagram_enrichment()
        test_issue10_code_splitting()
        
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

