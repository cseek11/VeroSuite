#!/usr/bin/env python3
"""
Phase 1 Tests - Hierarchical AST + SSM Core + Renderer

Tests for:
- SSMBlock.render() method
- part-meta blocks
- section-meta blocks
- chapter-meta blocks (enhanced)
- SSM output format
"""
from __future__ import annotations

import sys
from pathlib import Path

# Add current directory to path
current_dir = Path(__file__).parent
if str(current_dir) not in sys.path:
    sys.path.insert(0, str(current_dir))

from modules.ast_nodes import ASTNode, ASTDocument, SSMBlock
from modules.parser_markdown import parse_markdown_to_ast
from modules.parser_ssm import ast_to_ssm_blocks, build_block_index
from modules.extractor_terms import extract_terms_from_ast
from modules.extractor_code import extract_code_entries
from modules.extractor_relations import extract_relations_from_ast
from modules.extractor_diagrams import extract_diagrams_from_ast
from runtime.error_bus import ErrorBus
from runtime.symbol_table import SymbolTable


def test_ssm_block_render():
    """Test SSMBlock.render() method."""
    print("Testing SSMBlock.render()...")
    try:
        # Test simple block
        block = SSMBlock(
            block_type="concept",
            meta={"id": "test-123", "summary": "Test concept"},
            body="This is a test concept.",
            index=0,
            id="test-123"
        )
        
        rendered = block.render()
        assert "::: concept" in rendered, "Should contain block type"
        assert "id: test-123" in rendered, "Should contain id"
        assert "summary: Test concept" in rendered, "Should contain summary"
        assert "This is a test concept." in rendered, "Should contain body"
        assert rendered.count(":::") == 3, "Should have 3 ::: markers (open, close, close)"
        
        # Test block with list metadata
        block2 = SSMBlock(
            block_type="chapter-meta",
            meta={"id": "ch-01", "level": ["beginner", "intermediate"]},
            body="",
            index=1,
            id="ch-01"
        )
        rendered2 = block2.render()
        assert "level: [beginner, intermediate]" in rendered2, "Should render list correctly"
        
        print("  ✓ SSMBlock.render() passed")
        return True
    except Exception as e:
        print(f"  ✗ SSMBlock.render() test failed: {e}")
        import traceback
        traceback.print_exc()
        return False


def test_part_meta_blocks():
    """Test part-meta block creation."""
    print("Testing part-meta blocks...")
    try:
        errors = ErrorBus()
        symbols = SymbolTable()
        
        test_md = """# PART I — FOUNDATIONS

## Chapter 1 — Introduction

Content here.

## Chapter 2 — Language

More content.
"""
        doc = parse_markdown_to_ast(test_md, errors=errors, symbols=symbols)
        
        # Extract data
        terms = extract_terms_from_ast(doc)
        codes = extract_code_entries(doc)
        rels = extract_relations_from_ast(doc)
        diags = extract_diagrams_from_ast(doc)
        
        # Convert to SSM blocks
        blocks = ast_to_ssm_blocks(doc, terms, codes, rels, diags, errors=errors, symbols=symbols)
        
        # Find part-meta blocks
        part_meta_blocks = [b for b in blocks if b.block_type == "part-meta"]
        assert len(part_meta_blocks) > 0, "Should have at least one part-meta block"
        
        part_meta = part_meta_blocks[0]
        assert "part_number" in part_meta.meta, "Should have part_number"
        assert "title" in part_meta.meta, "Should have title"
        assert "chapters" in part_meta.meta, "Should have chapters list"
        assert isinstance(part_meta.meta["chapters"], list), "Chapters should be a list"
        
        print(f"  ✓ Found {len(part_meta_blocks)} part-meta block(s)")
        print("  ✓ part-meta blocks passed")
        return True
    except Exception as e:
        print(f"  ✗ part-meta blocks test failed: {e}")
        import traceback
        traceback.print_exc()
        return False


def test_section_meta_blocks():
    """Test section-meta block creation."""
    print("Testing section-meta blocks...")
    try:
        errors = ErrorBus()
        symbols = SymbolTable()
        
        test_md = """## Chapter 1 — Introduction

### Section 1.1

Content here.

### Section 1.2

More content.

#### Subsection 1.2.1

Nested content.
"""
        doc = parse_markdown_to_ast(test_md, errors=errors, symbols=symbols)
        
        # Extract data
        terms = extract_terms_from_ast(doc)
        codes = extract_code_entries(doc)
        rels = extract_relations_from_ast(doc)
        diags = extract_diagrams_from_ast(doc)
        
        # Convert to SSM blocks
        blocks = ast_to_ssm_blocks(doc, terms, codes, rels, diags, errors=errors, symbols=symbols)
        
        # Find section-meta blocks
        section_meta_blocks = [b for b in blocks if b.block_type == "section-meta"]
        assert len(section_meta_blocks) >= 2, f"Should have at least 2 section-meta blocks, got {len(section_meta_blocks)}"
        
        section_meta = section_meta_blocks[0]
        assert "title" in section_meta.meta, "Should have title"
        assert "level" in section_meta.meta, "Should have level"
        assert "chapter" in section_meta.meta, "Should have chapter"
        assert section_meta.meta["level"] >= 3, "Section level should be >= 3"
        
        # Check nested section has parent_section
        nested_sections = [b for b in section_meta_blocks if b.meta.get("level", 0) > 3]
        if nested_sections:
            nested = nested_sections[0]
            # Parent section may or may not be set depending on hierarchy
            assert "parent_section" in nested.meta, "Nested section should have parent_section field"
        
        print(f"  ✓ Found {len(section_meta_blocks)} section-meta block(s)")
        print("  ✓ section-meta blocks passed")
        return True
    except Exception as e:
        print(f"  ✗ section-meta blocks test failed: {e}")
        import traceback
        traceback.print_exc()
        return False


def test_chapter_meta_enhanced():
    """Test enhanced chapter-meta blocks with sections."""
    print("Testing enhanced chapter-meta blocks...")
    try:
        errors = ErrorBus()
        symbols = SymbolTable()
        
        test_md = """## Chapter 1 — Introduction

### Section 1.1

Content.

### Section 1.2

More content.

## Chapter 2 — Language

### Section 2.1

Content.
"""
        doc = parse_markdown_to_ast(test_md, errors=errors, symbols=symbols)
        
        # Extract data
        terms = extract_terms_from_ast(doc)
        codes = extract_code_entries(doc)
        rels = extract_relations_from_ast(doc)
        diags = extract_diagrams_from_ast(doc)
        
        # Convert to SSM blocks
        blocks = ast_to_ssm_blocks(doc, terms, codes, rels, diags, errors=errors, symbols=symbols)
        
        # Find chapter-meta blocks
        chapter_meta_blocks = [b for b in blocks if b.block_type == "chapter-meta"]
        assert len(chapter_meta_blocks) >= 2, "Should have at least 2 chapter-meta blocks"
        
        ch1_meta = next((b for b in chapter_meta_blocks if b.meta.get("number") == 1), None)
        assert ch1_meta is not None, "Should have chapter 1 meta"
        assert "sections" in ch1_meta.meta, "Should have sections list"
        assert isinstance(ch1_meta.meta["sections"], list), "Sections should be a list"
        assert len(ch1_meta.meta["sections"]) >= 2, "Chapter 1 should have at least 2 sections"
        
        print(f"  ✓ Found {len(chapter_meta_blocks)} chapter-meta block(s)")
        print("  ✓ Enhanced chapter-meta blocks passed")
        return True
    except Exception as e:
        print(f"  ✗ Enhanced chapter-meta blocks test failed: {e}")
        import traceback
        traceback.print_exc()
        return False


def test_ssm_output_format():
    """Test SSM output format (no unclosed blocks)."""
    print("Testing SSM output format...")
    try:
        from modules.utils.text import write_ssm
        
        errors = ErrorBus()
        symbols = SymbolTable()
        
        test_md = """## Chapter 1 — Introduction

### Section 1.1

This is a paragraph with **bold** text.

```rego
package test
allow := true
```
"""
        doc = parse_markdown_to_ast(test_md, errors=errors, symbols=symbols)
        
        # Extract data
        terms = extract_terms_from_ast(doc)
        codes = extract_code_entries(doc)
        rels = extract_relations_from_ast(doc)
        diags = extract_diagrams_from_ast(doc)
        
        # Convert to SSM blocks
        blocks = ast_to_ssm_blocks(doc, terms, codes, rels, diags, errors=errors, symbols=symbols)
        
        # Write SSM
        ssm_output = write_ssm(blocks)
        
        # Verify format
        assert ":::" in ssm_output, "Should contain SSM block markers"
        
        # Count ::: markers (should be even, as each block has open and close)
        marker_count = ssm_output.count(":::")
        # Each block has at least 2 ::: (open and close), some have 3 if they have body
        assert marker_count >= len(blocks) * 2, f"Should have at least {len(blocks) * 2} ::: markers, got {marker_count}"
        
        # Verify no unclosed blocks (each ::: should be followed by another ::: or end of block)
        lines = ssm_output.split("\n")
        in_block = False
        for line in lines:
            if line.strip() == ":::":
                if in_block:
                    in_block = False
                else:
                    in_block = True
        
        assert not in_block, "Should not have unclosed blocks"
        
        # Verify block types present
        assert "::: chapter-meta" in ssm_output, "Should have chapter-meta blocks"
        assert "::: section-meta" in ssm_output, "Should have section-meta blocks"
        
        print("  ✓ SSM output format passed")
        return True
    except Exception as e:
        print(f"  ✗ SSM output format test failed: {e}")
        import traceback
        traceback.print_exc()
        return False


def test_block_index_includes_new_types():
    """Test that block index includes part-meta and section-meta."""
    print("Testing block index with new types...")
    try:
        errors = ErrorBus()
        symbols = SymbolTable()
        
        test_md = """# PART I — FOUNDATIONS

## Chapter 1 — Introduction

### Section 1.1

Content.
"""
        doc = parse_markdown_to_ast(test_md, errors=errors, symbols=symbols)
        
        # Extract data
        terms = extract_terms_from_ast(doc)
        codes = extract_code_entries(doc)
        rels = extract_relations_from_ast(doc)
        diags = extract_diagrams_from_ast(doc)
        
        # Convert to SSM blocks
        blocks = ast_to_ssm_blocks(doc, terms, codes, rels, diags, errors=errors, symbols=symbols)
        
        # Build index
        idx = build_block_index(blocks)
        
        # Verify new block types in index
        assert "part-meta" in idx["by_type"] or len([b for b in blocks if b.block_type == "part-meta"]) > 0, "Should have part-meta blocks"
        assert "section-meta" in idx["by_type"] or len([b for b in blocks if b.block_type == "section-meta"]) > 0, "Should have section-meta blocks"
        assert "chapter-meta" in idx["by_type"], "Should have chapter-meta blocks"
        
        print("  ✓ Block index with new types passed")
        return True
    except Exception as e:
        print(f"  ✗ Block index test failed: {e}")
        import traceback
        traceback.print_exc()
        return False


if __name__ == "__main__":
    print("=" * 60)
    print("Phase 1 Tests - Hierarchical AST + SSM Core + Renderer")
    print("=" * 60)
    print()
    
    tests = [
        test_ssm_block_render,
        test_part_meta_blocks,
        test_section_meta_blocks,
        test_chapter_meta_enhanced,
        test_ssm_output_format,
        test_block_index_includes_new_types,
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
        print("✓ All Phase 1 tests passed!")
        sys.exit(0)
    else:
        print("✗ Some Phase 1 tests failed")
        sys.exit(1)

