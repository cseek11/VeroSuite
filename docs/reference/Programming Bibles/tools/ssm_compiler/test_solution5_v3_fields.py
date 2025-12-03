#!/usr/bin/env python3
"""
Test Solution 5: V3 SSM Fields

Tests that V3 fields are generated: token_range, char_offset, digest,
source_ref, symbol_refs, semantic_role.
"""
from __future__ import annotations

import sys
from pathlib import Path

# Add current directory to path
current_dir = Path(__file__).parent
if str(current_dir) not in sys.path:
    sys.path.insert(0, str(current_dir))

from modules.ast_nodes import ASTNode, SSMBlock
from modules.v3_metadata import generate_v3_metadata, _generate_digest, _classify_semantic_role, _extract_symbols

# Import runtime components
try:
    from runtime.symbol_table import SymbolTable
except ImportError:
    SymbolTable = None


def test_digest_generation():
    """Test that digests are generated"""
    print("Test 1: Digest Generation")
    
    block = SSMBlock(
        block_type="concept",
        meta={},
        body="Test content",
        index=0
    )
    
    generate_v3_metadata(block)
    
    assert "digest" in block.meta, "Digest should be generated"
    assert len(block.meta["digest"]) == 64, f"Digest should be 64 chars (SHA-256), got {len(block.meta['digest'])}"
    assert isinstance(block.meta["digest"], str), "Digest should be a string"
    
    print("  ✅ Digest generation working")


def test_semantic_role_classification():
    """Test that semantic roles are classified correctly"""
    print("Test 2: Semantic Role Classification")
    
    test_cases = [
        ("concept", "definition"),
        ("term", "definition"),
        ("code", "example"),
        ("code-pattern", "pattern"),
        ("antipattern", "warning"),
        ("rationale", "justification"),
        ("qa", "explanation"),
        ("diagram", "visualization"),
        ("table", "reference"),
        ("relation", "connection"),
    ]
    
    for block_type, expected_role in test_cases:
        block = SSMBlock(
            block_type=block_type,
            meta={},
            body="Test",
            index=0
        )
        
        generate_v3_metadata(block)
        
        assert "semantic_role" in block.meta, f"Semantic role should be generated for {block_type}"
        assert block.meta["semantic_role"] == expected_role, \
            f"Expected role '{expected_role}' for {block_type}, got '{block.meta['semantic_role']}'"
    
    print("  ✅ Semantic role classification working")


def test_symbol_extraction():
    """Test that symbols are extracted from code blocks"""
    print("Test 3: Symbol Extraction")
    
    # Test code block with symbols
    block = SSMBlock(
        block_type="code",
        meta={},
        body="import data.users\nrule allow { count(users) > 0 }",
        index=0
    )
    
    generate_v3_metadata(block)
    
    assert "symbol_refs" in block.meta, "Symbol refs should be generated"
    assert isinstance(block.meta["symbol_refs"], list), "Symbol refs should be a list"
    
    # Check that imports and functions are extracted
    symbols = block.meta["symbol_refs"]
    assert len(symbols) > 0, f"Should extract symbols from code, got {len(symbols)}"
    
    # Check for specific symbols
    symbol_text = " ".join(symbols).lower()
    assert "data.users" in symbol_text or "users" in symbol_text, \
        f"Should extract import 'data.users'. Got: {symbols}"
    
    print("  ✅ Symbol extraction working")


def test_source_reference():
    """Test that source references are populated from nodes"""
    print("Test 4: Source Reference")
    
    # Create AST node with line number
    node = ASTNode(
        type="paragraph",
        text="Test paragraph",
        level=0,
        line_no=42
    )
    
    block = SSMBlock(
        block_type="concept",
        meta={},
        body="Test content",
        index=0
    )
    
    generate_v3_metadata(block, source_node=node, source_file="test.md")
    
    assert "source_ref" in block.meta, "Source ref should be generated"
    source_ref = block.meta["source_ref"]
    assert isinstance(source_ref, dict), "Source ref should be a dict"
    assert source_ref.get("file") == "test.md", f"Source file should be 'test.md', got {source_ref.get('file')}"
    assert source_ref.get("line") == 42, f"Source line should be 42, got {source_ref.get('line')}"
    
    print("  ✅ Source reference working")


def test_char_offset():
    """Test that character offsets are estimated"""
    print("Test 5: Character Offset")
    
    node = ASTNode(
        type="paragraph",
        text="Test paragraph with some content",
        level=0,
        line_no=10
    )
    
    block = SSMBlock(
        block_type="concept",
        meta={},
        body="Test content",
        index=0
    )
    
    generate_v3_metadata(block, source_node=node)
    
    assert "char_offset" in block.meta, "Char offset should be generated"
    char_offset = block.meta["char_offset"]
    assert isinstance(char_offset, tuple), "Char offset should be a tuple"
    assert len(char_offset) == 2, f"Char offset should be (start, end), got {char_offset}"
    assert char_offset[0] < char_offset[1], f"Start should be < end, got {char_offset}"
    
    print("  ✅ Character offset working")


def test_all_v3_fields():
    """Test that all V3 fields are present"""
    print("Test 6: All V3 Fields Present")
    
    node = ASTNode(
        type="code",
        text="import data.users\nrule allow { true }",
        level=0,
        line_no=5,
        lang="rego"
    )
    
    block = SSMBlock(
        block_type="code-pattern",
        meta={},
        body="import data.users\nrule allow { true }",
        index=0
    )
    
    generate_v3_metadata(block, source_node=node, source_file="test.md")
    
    # Check all required V3 fields
    required_fields = ["digest", "symbol_refs", "semantic_role", "source_ref", "char_offset"]
    
    for field in required_fields:
        assert field in block.meta, f"Required V3 field '{field}' should be present"
        assert block.meta[field] is not None, f"Required V3 field '{field}' should not be None"
    
    print("  ✅ All V3 fields present")


if __name__ == "__main__":
    print("=" * 60)
    print("Testing Solution 5: V3 SSM Fields")
    print("=" * 60)
    
    try:
        test_digest_generation()
        test_semantic_role_classification()
        test_symbol_extraction()
        test_source_reference()
        test_char_offset()
        test_all_v3_fields()
        
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

