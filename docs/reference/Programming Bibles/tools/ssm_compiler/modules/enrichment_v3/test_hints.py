"""
Test Hints Enrichment

Adds test case hints and examples.
"""
from __future__ import annotations

from typing import List, Dict, Any
from ..ast_nodes import SSMBlock
from ..utils.hashing import sha1_id


def enrich_test_cases(blocks: List[SSMBlock], idx: Dict[str, Any]) -> None:
    """
    Enrich blocks with test case hints.
    
    Adds:
    - Test case examples
    - Test patterns
    - Edge cases
    - Test scenarios
    
    Args:
        blocks: List of SSM blocks (modified in place)
        idx: Index of blocks by ID
    """
    new_tests: List[SSMBlock] = []
    
    for b in blocks:
        if b.block_type not in {"code-pattern", "example"}:
            continue
        
        if "input." not in b.body and "input[" not in b.body and "allow" not in b.body:
            continue
        
        tid = sha1_id("TEST", b.id or b.body[:40])
        new_tests.append(
            SSMBlock(
                block_type="test-hint",
                meta={"id": tid, "chapter": b.chapter or "", "source_id": b.id or ""},
                body="Convert this snippet into a unit test by constructing input and asserting allow/deny.",
                index=len(blocks) + len(new_tests),
                id=tid,
                chapter=b.chapter,
            )
        )
    
    blocks.extend(new_tests)
