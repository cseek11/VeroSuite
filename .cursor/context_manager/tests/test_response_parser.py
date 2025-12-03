#!/usr/bin/env python3
"""
Test suite for AgentResponseParser

Tests agent response parsing for context management verification.

Last Updated: 2025-12-01
"""

import sys
from pathlib import Path

# Add project root to path
project_root = Path(__file__).parent.parent.parent.parent
sys.path.insert(0, str(project_root))
sys.path.insert(0, str(project_root / ".cursor" / "context_manager"))

from context_manager.response_parser import AgentResponseParser


def test_extract_context_id():
    """Test context-ID extraction."""
    parser = AgentResponseParser()
    
    sample = """
    I have read recommendations.md.
    context-id: 123e4567-e89b-12d3-a456-426614174000
    Loaded required context:
    @.cursor/rules/python_bible.mdc
    """
    
    context_id = parser.extract_context_id(sample)
    assert context_id == "123e4567-e89b-12d3-a456-426614174000", f"Expected context-id, got: {context_id}"


def test_extract_file_mentions():
    """Test file mention extraction."""
    parser = AgentResponseParser()
    
    sample = """
    Loaded required context:
    @.cursor/rules/python_bible.mdc
    @.cursor/rules/02-core.mdc
    `libs/common/prisma/schema.prisma`
    """
    
    files = parser.extract_file_mentions(sample)
    assert ".cursor/rules/python_bible.mdc" in files
    assert ".cursor/rules/02-core.mdc" in files
    assert "libs/common/prisma/schema.prisma" in files


def test_detects_step_0_5_ack():
    """Test Step 0.5 acknowledgment detection."""
    parser = AgentResponseParser()
    
    sample1 = """
    Step 0.5 Verification:
    ✓ Read recommendations.md
    ✓ Loaded PRIMARY context
    """
    assert parser.detects_step_0_5_ack(sample1) is True
    
    sample2 = """
    I have loaded the required context files.
    """
    assert parser.detects_step_0_5_ack(sample2) is True
    
    sample3 = """
    Just some random text.
    """
    assert parser.detects_step_0_5_ack(sample3) is False


def test_detects_step_4_5_ack():
    """Test Step 4.5 acknowledgment detection."""
    parser = AgentResponseParser()
    
    sample1 = """
    Step 4.5 Verification:
    ✓ Unloaded obsolete context
    ✓ Pre-loaded predicted context
    """
    assert parser.detects_step_4_5_ack(sample1) is True
    
    sample2 = """
    Context state updated.
    """
    assert parser.detects_step_4_5_ack(sample2) is True
    
    sample3 = """
    Just some random text.
    """
    assert parser.detects_step_4_5_ack(sample3) is False


def test_full_parse():
    """Test full response parsing."""
    parser = AgentResponseParser()
    
    sample = """
    Step 0.5 Verification:
    ✓ Read recommendations.md
    context-id: 123e4567-e89b-12d3-a456-426614174000
    ✓ Loaded PRIMARY context:
      - @.cursor/rules/python_bible.mdc
      - @.cursor/rules/02-core.mdc
    ✓ Context ready for task
    """
    
    parsed = parser.parse(sample)
    assert parsed["context_id"] == "123e4567-e89b-12d3-a456-426614174000"
    assert ".cursor/rules/python_bible.mdc" in parsed["file_mentions"]
    assert ".cursor/rules/02-core.mdc" in parsed["file_mentions"]
    assert parsed["step_0_5"] is True
    assert parsed["step_4_5"] is False


def test_parse_step_4_5():
    """Test Step 4.5 response parsing."""
    parser = AgentResponseParser()
    
    sample = """
    Step 4.5 Verification:
    ✓ Read updated recommendations.md
    context-id: 456e7890-e89b-12d3-a456-426614174001
    ✓ Unloaded obsolete context:
      - @old-file.md
    ✓ Pre-loaded predicted context:
      - @.cursor/rules/10-quality.mdc (74% confidence)
    """
    
    parsed = parser.parse(sample)
    assert parsed["context_id"] == "456e7890-e89b-12d3-a456-426614174001"
    assert ".cursor/rules/10-quality.mdc" in parsed["file_mentions"]
    assert parsed["step_4_5"] is True
    assert parsed["step_0_5"] is False


if __name__ == '__main__':
    print("Running AgentResponseParser tests...")
    
    test_extract_context_id()
    print("✓ test_extract_context_id passed")
    
    test_extract_file_mentions()
    print("✓ test_extract_file_mentions passed")
    
    test_detects_step_0_5_ack()
    print("✓ test_detects_step_0_5_ack passed")
    
    test_detects_step_4_5_ack()
    print("✓ test_detects_step_4_5_ack passed")
    
    test_full_parse()
    print("✓ test_full_parse passed")
    
    test_parse_step_4_5()
    print("✓ test_parse_step_4_5 passed")
    
    print("\n✅ All tests passed!")







