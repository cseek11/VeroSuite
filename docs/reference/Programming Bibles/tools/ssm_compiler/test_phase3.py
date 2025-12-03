#!/usr/bin/env python3
"""
Phase 3 Tests - Relation Extractor + Concept Graph

Tests for:
- Enhanced relation extraction (cross-chapter references, prerequisites)
- Concept graph building
- Multi-hop relationships (graph_neighbors, graph_two_hop, graph_three_hop)
"""
from __future__ import annotations

import sys
from pathlib import Path

# Add current directory to path
current_dir = Path(__file__).parent
if str(current_dir) not in sys.path:
    sys.path.insert(0, str(current_dir))

from modules.extractor_relations import extract_relations_from_ast, RelationEntry
from modules.enrichment_v3.concept_graph import build_concept_graph, enrich_concept_graph
from modules.parser_markdown import parse_markdown_to_ast
from modules.parser_ssm import ast_to_ssm_blocks, build_block_index
from modules.extractor_terms import extract_terms_from_ast
from modules.extractor_code import extract_code_entries
from modules.extractor_diagrams import extract_diagrams_from_ast
from modules.ast_nodes import SSMBlock
from runtime.error_bus import ErrorBus
from runtime.symbol_table import SymbolTable


def test_relation_extraction_explicit():
    """Test explicit relation extraction (See Chapter X)."""
    print("Testing explicit relation extraction...")
    try:
        errors = ErrorBus()
        symbols = SymbolTable()
        
        test_md = """## Chapter 1 — Introduction

This chapter introduces basic concepts. See Chapter 3 for advanced topics.

## Chapter 2 — Basics

More content here.

## Chapter 3 — Advanced

Advanced content.
"""
        doc = parse_markdown_to_ast(test_md, errors=errors, symbols=symbols)
        
        # Extract relations
        rels = extract_relations_from_ast(doc, errors=errors, symbols=symbols)
        
        assert len(rels) > 0, "Should extract at least one relation"
        
        # Find "See Chapter 3" relation
        see_ch3 = [r for r in rels if r.to_ref == "CH-03" and r.relation_type == "reference"]
        assert len(see_ch3) > 0, "Should find 'See Chapter 3' relation"
        
        rel = see_ch3[0]
        assert rel.from_ref == "CH-01", "Should be from Chapter 1"
        assert rel.to_ref == "CH-03", "Should be to Chapter 3"
        assert rel.confidence > 0, "Should have confidence score"
        assert len(rel.context) > 0, "Should have context"
        
        print(f"  ✓ Found {len(rels)} relation(s)")
        print("  ✓ Explicit relation extraction passed")
        return True
    except Exception as e:
        print(f"  ✗ Explicit relation extraction test failed: {e}")
        import traceback
        traceback.print_exc()
        return False


def test_relation_extraction_prerequisite():
    """Test prerequisite relation extraction."""
    print("Testing prerequisite relation extraction...")
    try:
        errors = ErrorBus()
        symbols = SymbolTable()
        
        test_md = """## Chapter 1 — Introduction

Basic concepts.

## Chapter 2 — Intermediate

This chapter requires Chapter 1 as a prerequisite.

## Chapter 3 — Advanced

This chapter depends on Chapter 2.
"""
        doc = parse_markdown_to_ast(test_md, errors=errors, symbols=symbols)
        
        # Extract relations
        rels = extract_relations_from_ast(doc, errors=errors, symbols=symbols)
        
        # Find prerequisite relations
        prereq_rels = [r for r in rels if r.relation_type == "prerequisite"]
        assert len(prereq_rels) > 0, "Should extract prerequisite relations"
        
        # Check Chapter 2 → Chapter 1 prerequisite
        ch2_to_ch1 = [r for r in prereq_rels if r.from_ref == "CH-02" and r.to_ref == "CH-01"]
        assert len(ch2_to_ch1) > 0, "Should find Chapter 2 → Chapter 1 prerequisite"
        
        print(f"  ✓ Found {len(prereq_rels)} prerequisite relation(s)")
        print("  ✓ Prerequisite relation extraction passed")
        return True
    except Exception as e:
        print(f"  ✗ Prerequisite relation extraction test failed: {e}")
        import traceback
        traceback.print_exc()
        return False


def test_relation_ssm_blocks():
    """Test relation SSM blocks with enhanced metadata."""
    print("Testing relation SSM blocks...")
    try:
        errors = ErrorBus()
        symbols = SymbolTable()
        
        test_md = """## Chapter 1 — Introduction

See Chapter 2 for more details.

## Chapter 2 — Details

Content here.
"""
        doc = parse_markdown_to_ast(test_md, errors=errors, symbols=symbols)
        
        # Extract data
        terms = extract_terms_from_ast(doc)
        codes = extract_code_entries(doc)
        rels = extract_relations_from_ast(doc, errors=errors, symbols=symbols)
        diags = extract_diagrams_from_ast(doc)
        
        # Convert to SSM blocks
        blocks = ast_to_ssm_blocks(doc, terms, codes, rels, diags, errors=errors, symbols=symbols)
        
        # Find relation blocks
        relation_blocks = [b for b in blocks if b.block_type == "relation"]
        assert len(relation_blocks) > 0, "Should have relation blocks"
        
        rel_block = relation_blocks[0]
        assert "from" in rel_block.meta, "Should have 'from' field"
        assert "to" in rel_block.meta, "Should have 'to' field"
        assert "type" in rel_block.meta, "Should have 'type' field"
        assert "context" in rel_block.meta, "Should have 'context' field"
        assert "confidence" in rel_block.meta, "Should have 'confidence' field"
        
        print(f"  ✓ Found {len(relation_blocks)} relation block(s)")
        print("  ✓ Relation SSM blocks passed")
        return True
    except Exception as e:
        print(f"  ✗ Relation SSM blocks test failed: {e}")
        import traceback
        traceback.print_exc()
        return False


def test_concept_graph_building():
    """Test concept graph building."""
    print("Testing concept graph building...")
    try:
        # Create test blocks
        blocks = [
            SSMBlock(
                block_type="concept",
                meta={"id": "concept-1", "title": "Universal Quantification"},
                body="Universal quantification allows checking all elements. See existential quantification.",
                index=0,
                id="concept-1"
            ),
            SSMBlock(
                block_type="concept",
                meta={"id": "concept-2", "title": "Existential Quantification"},
                body="Existential quantification checks some elements.",
                index=1,
                id="concept-2"
            ),
            SSMBlock(
                block_type="term",
                meta={"id": "term-1", "name": "OPA"},
                body="Open Policy Agent",
                index=2,
                id="term-1"
            ),
            SSMBlock(
                block_type="code-pattern",
                meta={"id": "pattern-1", "language": "rego", "pattern_type": "quantifier"},
                body="some item in items",
                index=3,
                id="pattern-1"
            ),
            SSMBlock(
                block_type="chapter-meta",
                meta={"id": "ch-01", "code": "CH-01", "prerequisites": []},
                body="",
                index=4,
                id="ch-01"
            ),
            SSMBlock(
                block_type="chapter-meta",
                meta={"id": "ch-02", "code": "CH-02", "prerequisites": ["CH-01"]},
                body="",
                index=5,
                id="ch-02"
            ),
            SSMBlock(
                block_type="relation",
                meta={"id": "rel-1", "from": "CH-01", "to": "CH-02", "type": "prerequisite"},
                body="",
                index=6,
                id="rel-1"
            ),
        ]
        
        idx = build_block_index(blocks)
        
        # Build graph
        graph = build_concept_graph(blocks, idx)
        
        # Verify graph has edges
        assert len(graph) > 0, "Graph should have edges"
        
        # Check concept-1 has edges (mentions concept-2)
        if "concept-1" in graph:
            assert len(graph["concept-1"]) > 0, "concept-1 should have neighbors"
        
        # Check chapter prerequisites
        if "ch-02" in graph:
            assert "ch-01" in graph["ch-02"], "ch-02 should depend on ch-01"
        
        print(f"  ✓ Graph has {len(graph)} nodes with edges")
        print("  ✓ Concept graph building passed")
        return True
    except Exception as e:
        print(f"  ✗ Concept graph building test failed: {e}")
        import traceback
        traceback.print_exc()
        return False


def test_multi_hop_enrichment():
    """Test multi-hop relationship enrichment."""
    print("Testing multi-hop enrichment...")
    try:
        # Create test blocks with relationships
        blocks = [
            SSMBlock(
                block_type="concept",
                meta={"id": "concept-1", "title": "Concept A"},
                body="Concept A relates to Concept B",
                index=0,
                id="concept-1"
            ),
            SSMBlock(
                block_type="concept",
                meta={"id": "concept-2", "title": "Concept B"},
                body="Concept B relates to Concept C",
                index=1,
                id="concept-2"
            ),
            SSMBlock(
                block_type="concept",
                meta={"id": "concept-3", "title": "Concept C"},
                body="Concept C",
                index=2,
                id="concept-3"
            ),
        ]
        
        idx = build_block_index(blocks)
        
        # Enrich with graph
        enrich_concept_graph(blocks, idx)
        
        # Check concept-1 has graph metadata
        concept1 = blocks[0]
        assert "graph_neighbors" in concept1.meta, "Should have graph_neighbors"
        assert "graph_degree" in concept1.meta, "Should have graph_degree"
        assert "graph_two_hop" in concept1.meta, "Should have graph_two_hop"
        assert "graph_three_hop" in concept1.meta, "Should have graph_three_hop"
        
        # Check graph_degree
        assert concept1.meta["graph_degree"] >= 0, "graph_degree should be >= 0"
        
        print("  ✓ Multi-hop enrichment passed")
        return True
    except Exception as e:
        print(f"  ✗ Multi-hop enrichment test failed: {e}")
        import traceback
        traceback.print_exc()
        return False


def test_relation_deduplication():
    """Test relation deduplication."""
    print("Testing relation deduplication...")
    try:
        errors = ErrorBus()
        symbols = SymbolTable()
        
        test_md = """## Chapter 1 — Introduction

See Chapter 2. Also see Chapter 2 for more details.

## Chapter 2 — Details

Content.
"""
        doc = parse_markdown_to_ast(test_md, errors=errors, symbols=symbols)
        
        # Extract relations
        rels = extract_relations_from_ast(doc, errors=errors, symbols=symbols)
        
        # Should deduplicate (same from/to/type)
        unique_keys = {(r.from_ref, r.to_ref, r.relation_type) for r in rels}
        assert len(rels) == len(unique_keys), "Should deduplicate relations"
        
        print(f"  ✓ Deduplicated {len(rels)} relation(s)")
        print("  ✓ Relation deduplication passed")
        return True
    except Exception as e:
        print(f"  ✗ Relation deduplication test failed: {e}")
        import traceback
        traceback.print_exc()
        return False


if __name__ == "__main__":
    print("=" * 60)
    print("Phase 3 Tests - Relation Extractor + Concept Graph")
    print("=" * 60)
    print()
    
    tests = [
        test_relation_extraction_explicit,
        test_relation_extraction_prerequisite,
        test_relation_ssm_blocks,
        test_concept_graph_building,
        test_multi_hop_enrichment,
        test_relation_deduplication,
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
        print("✓ All Phase 3 tests passed!")
        sys.exit(0)
    else:
        print("✗ Some Phase 3 tests failed")
        sys.exit(1)

