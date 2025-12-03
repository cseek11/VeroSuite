"""
SQL Language Plugin

SQL-specific code classification.
"""
from __future__ import annotations

import re
from typing import Tuple, List
from . import CodeClassification


def classify(code: str) -> CodeClassification:
    """
    Classify SQL code block.
    
    Args:
        code: SQL code text
    
    Returns:
        CodeClassification with role and tags
    """
    t = code.lower()
    
    patterns: List[Tuple[str, str, str]] = [
        (r"\bselect\b", "sql", "query"),
        (r"\binsert\b", "sql", "insert"),
        (r"\bupdate\b", "sql", "update"),
        (r"\bdelete\b", "sql", "delete"),
        (r"\bjoin\b", "sql", "join"),
    ]
    
    tags = []
    for pat, cat, label in patterns:
        if re.search(pat, t):
            tags.append(label)
    
    if tags:
        return CodeClassification(role="code-pattern:sql-query", tags=tags)
    
    return CodeClassification(role="example")


def get_pattern_taxonomy(code: str) -> dict:
    """
    Get pattern taxonomy for SQL code.
    
    Args:
        code: SQL code text
    
    Returns:
        Dict with: pattern_category, pattern_type, pattern_tags
    """
    classification = classify(code)
    if classification.role.startswith("code-pattern:"):
        return {
            "pattern_category": "sql",
            "pattern_type": classification.role.split(":")[-1],
            "pattern_tags": classification.tags,
        }
    return {
        "pattern_category": "",
        "pattern_type": "",
        "pattern_tags": [],
    }
