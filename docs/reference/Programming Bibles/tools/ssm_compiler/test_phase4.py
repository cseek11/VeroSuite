#!/usr/bin/env python3
"""
Phase 4 Tests - Diagram Extractor + Table Normalization

Tests for:
- Enhanced diagram extraction (mermaid, ASCII, flow)
- Table extraction and normalization
- Table SSM blocks with headers and rows
"""
from __future__ import annotations

import sys
from pathlib import Path

# Add current directory to path
current_dir = Path(__file__).parent
if str(current_dir) not in sys.path:
    sys.path.insert(0, str(current_dir))

from modules.extractor_diagrams import extract_diagrams_from_ast, DiagramEntry
from modules.extractor_tables import extract_tables_from_ast, TableEntry, parse_markdown_table
from modules.parser_markdown import parse_markdown_to_ast
from modules.parser_ssm import ast_to_ssm_blocks, build_block_index
from modules.extractor_terms import extract_terms_from_ast
from modules.extractor_code import extract_code_entries
from modules.extractor_relations import extract_relations_from_ast
from runtime.error_bus import ErrorBus
from runtime.symbol_table import SymbolTable


def test_mermaid_diagram_extraction():
    """Test Mermaid diagram extraction."""
    print("Testing Mermaid diagram extraction...")
    try:
        errors = ErrorBus()
        symbols = SymbolTable()
        
        test_md = """## Chapter 1 — Introduction

```mermaid
graph TD
    A[Start] --> B[Process]
    B --> C[End]
```
"""
        doc = parse_markdown_to_ast(test_md, errors=errors, symbols=symbols)
        
        # Extract diagrams
        diagrams = extract_diagrams_from_ast(doc, errors=errors, symbols=symbols)
        
        assert len(diagrams) > 0, "Should extract at least one diagram"
        
        mermaid_diags = [d for d in diagrams if d.type == "mermaid"]
        assert len(mermaid_diags) > 0, "Should extract Mermaid diagram"
        
        mermaid = mermaid_diags[0]
        assert mermaid.lang == "mermaid", "Should have mermaid language"
        assert "graph TD" in mermaid.code, "Should contain mermaid code"
        
        print(f"  ✓ Found {len(mermaid_diags)} Mermaid diagram(s)")
        print("  ✓ Mermaid diagram extraction passed")
        return True
    except Exception as e:
        print(f"  ✗ Mermaid diagram extraction test failed: {e}")
        import traceback
        traceback.print_exc()
        return False


def test_ascii_diagram_extraction():
    """Test ASCII diagram extraction."""
    print("Testing ASCII diagram extraction...")
    try:
        errors = ErrorBus()
        symbols = SymbolTable()
        
        test_md = """## Chapter 1 — Introduction

```
┌─────┐
│  A  │
└──┬──┘
   │
   ▼
┌─────┐
│  B  │
└─────┘
```
"""
        doc = parse_markdown_to_ast(test_md, errors=errors, symbols=symbols)
        
        # Extract diagrams
        diagrams = extract_diagrams_from_ast(doc, errors=errors, symbols=symbols)
        
        ascii_diags = [d for d in diagrams if d.type == "ascii"]
        assert len(ascii_diags) > 0, "Should extract ASCII diagram"
        
        ascii_diag = ascii_diags[0]
        assert "┌" in ascii_diag.code, "Should contain box-drawing characters"
        
        print(f"  ✓ Found {len(ascii_diags)} ASCII diagram(s)")
        print("  ✓ ASCII diagram extraction passed")
        return True
    except Exception as e:
        print(f"  ✗ ASCII diagram extraction test failed: {e}")
        import traceback
        traceback.print_exc()
        return False


def test_table_extraction():
    """Test table extraction."""
    print("Testing table extraction...")
    try:
        errors = ErrorBus()
        symbols = SymbolTable()
        
        test_md = """## Chapter 1 — Introduction

| Column 1 | Column 2 | Column 3 |
|----------|----------|----------|
| Value 1  | Value 2  | Value 3  |
| Value 4  | Value 5  | Value 6  |
"""
        doc = parse_markdown_to_ast(test_md, errors=errors, symbols=symbols)
        
        # Extract tables
        tables = extract_tables_from_ast(doc, errors=errors, symbols=symbols)
        
        assert len(tables) > 0, "Should extract at least one table"
        
        table = tables[0]
        assert len(table.headers) == 3, "Should have 3 headers"
        assert len(table.rows) == 2, "Should have 2 rows"
        assert table.headers[0] == "Column 1", "First header should be 'Column 1'"
        assert table.rows[0][0] == "Value 1", "First cell should be 'Value 1'"
        
        print(f"  ✓ Found {len(tables)} table(s)")
        print("  ✓ Table extraction passed")
        return True
    except Exception as e:
        print(f"  ✗ Table extraction test failed: {e}")
        import traceback
        traceback.print_exc()
        return False


def test_table_ssm_blocks():
    """Test table SSM blocks."""
    print("Testing table SSM blocks...")
    try:
        errors = ErrorBus()
        symbols = SymbolTable()
        
        test_md = """## Chapter 1 — Introduction

| Name | Type | Description |
|------|------|-------------|
| OPA  | Tool | Policy engine |
"""
        doc = parse_markdown_to_ast(test_md, errors=errors, symbols=symbols)
        
        # Extract data
        terms = extract_terms_from_ast(doc)
        codes = extract_code_entries(doc)
        rels = extract_relations_from_ast(doc, errors=errors, symbols=symbols)
        diags = extract_diagrams_from_ast(doc, errors=errors, symbols=symbols)
        tables = extract_tables_from_ast(doc, errors=errors, symbols=symbols)
        
        # Convert to SSM blocks
        blocks = ast_to_ssm_blocks(doc, terms, codes, rels, diags, tables=tables, errors=errors, symbols=symbols)
        
        # Find table blocks
        table_blocks = [b for b in blocks if b.block_type == "table"]
        assert len(table_blocks) > 0, "Should have table blocks"
        
        table_block = table_blocks[0]
        assert "headers" in table_block.meta, "Should have headers"
        assert "rows" in table_block.meta, "Should have rows"
        assert "row_count" in table_block.meta, "Should have row_count"
        assert len(table_block.meta["headers"]) == 3, "Should have 3 headers"
        assert len(table_block.meta["rows"]) == 1, "Should have 1 row"
        
        print(f"  ✓ Found {len(table_blocks)} table block(s)")
        print("  ✓ Table SSM blocks passed")
        return True
    except Exception as e:
        print(f"  ✗ Table SSM blocks test failed: {e}")
        import traceback
        traceback.print_exc()
        return False


def test_diagram_ssm_blocks_enhanced():
    """Test enhanced diagram SSM blocks with summary."""
    print("Testing enhanced diagram SSM blocks...")
    try:
        errors = ErrorBus()
        symbols = SymbolTable()
        
        test_md = """## Chapter 1 — Introduction

```mermaid
graph LR
    A --> B
```
"""
        doc = parse_markdown_to_ast(test_md, errors=errors, symbols=symbols)
        
        # Extract data
        terms = extract_terms_from_ast(doc)
        codes = extract_code_entries(doc)
        rels = extract_relations_from_ast(doc, errors=errors, symbols=symbols)
        diags = extract_diagrams_from_ast(doc, errors=errors, symbols=symbols)
        tables = extract_tables_from_ast(doc, errors=errors, symbols=symbols)
        
        # Convert to SSM blocks
        blocks = ast_to_ssm_blocks(doc, terms, codes, rels, diags, tables=tables, errors=errors, symbols=symbols)
        
        # Find diagram blocks
        diagram_blocks = [b for b in blocks if b.block_type == "diagram"]
        assert len(diagram_blocks) > 0, "Should have diagram blocks"
        
        diagram_block = diagram_blocks[0]
        assert "summary" in diagram_block.meta, "Should have summary"
        assert "diagram_type" in diagram_block.meta, "Should have diagram_type"
        assert diagram_block.meta["diagram_type"] == "mermaid", "Should be mermaid type"
        
        print(f"  ✓ Found {len(diagram_blocks)} diagram block(s)")
        print("  ✓ Enhanced diagram SSM blocks passed")
        return True
    except Exception as e:
        print(f"  ✗ Enhanced diagram SSM blocks test failed: {e}")
        import traceback
        traceback.print_exc()
        return False


if __name__ == "__main__":
    print("=" * 60)
    print("Phase 4 Tests - Diagram Extractor + Table Normalization")
    print("=" * 60)
    print()
    
    tests = [
        test_mermaid_diagram_extraction,
        test_ascii_diagram_extraction,
        test_table_extraction,
        test_table_ssm_blocks,
        test_diagram_ssm_blocks_enhanced,
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
        print("✓ All Phase 4 tests passed!")
        sys.exit(0)
    else:
        print("✗ Some Phase 4 tests failed")
        sys.exit(1)

