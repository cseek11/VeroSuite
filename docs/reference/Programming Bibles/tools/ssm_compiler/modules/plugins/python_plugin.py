"""
Python Language Plugin

Python-specific code classification.
"""
from __future__ import annotations

import re
from typing import Tuple, List
from . import CodeClassification


def classify(code: str) -> CodeClassification:
    """
    Classify Python code block.
    
    Args:
        code: Python code text
    
    Returns:
        CodeClassification with role and tags
    """
    t = code
    
    patterns: List[Tuple[str, str, str]] = [
        (r"def\s+\w+\(", "python", "function"),
        (r"class\s+\w+\(", "python", "class"),
        (r"async\s+def", "python", "async-fn"),
        (r"@dataclass", "python", "dataclass"),
    ]
    
    tags = []
    for pat, cat, label in patterns:
        if re.search(pat, t):
            tags.append(cat)
    
    if tags:
        return CodeClassification(role="code-pattern:python-structure", tags=tags)
    
    return CodeClassification(role="example")


def get_pattern_taxonomy(code: str) -> dict:
    """
    Get pattern taxonomy for Python code.
    
    Args:
        code: Python code text
    
    Returns:
        Dict with: pattern_category, pattern_type, pattern_tags
    """
    classification = classify(code)
    if classification.role.startswith("code-pattern:"):
        return {
            "pattern_category": "python",
            "pattern_type": classification.role.split(":")[-1],
            "pattern_tags": classification.tags,
        }
    return {
        "pattern_category": "",
        "pattern_type": "",
        "pattern_tags": [],
    }
