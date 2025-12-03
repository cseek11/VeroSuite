"""
Rego Language Plugin

Rego/OPA-specific code classification and pattern detection.
"""
from __future__ import annotations

import re
from typing import Tuple
from . import CodeClassification


def classify(code: str) -> CodeClassification:
    """
    Classify Rego code block.
    
    Args:
        code: Rego code text
    
    Returns:
        CodeClassification with role and tags
    """
    t = code.lower()
    
    patterns: List[Tuple[str, str, str]] = [
        (r"allow\s+if", "authorization", "allow-rule"),
        (r"deny\s+if", "authorization", "deny-rule"),
        (r"\bevery\s+\w+\s+in\b", "quantification", "every-loop"),
        (r"\[.*\|.*some\s+\w+\s+in", "comprehension", "array"),
        (r"\{.*:.*\|.*some\s+\w+\s+in", "comprehension", "object"),
        (r"with\s+input\s+as", "testing", "mock-input"),
        (r"rego\.metadata", "introspection", "metadata"),
    ]
    
    for pat, cat, label in patterns:
        if re.search(pat, t):
            return CodeClassification(role=f"code-pattern:{cat}:{label}", tags=[cat, label])
    
    # fallback: pattern vs example
    if "some " in t or "not " in t or ("[" in t and "|" in t):
        return CodeClassification(role="code-pattern:generic", tags=["generic"])
    
    return CodeClassification(role="example")


def get_pattern_taxonomy(code: str) -> dict:
    """
    Get pattern taxonomy for Rego code.
    
    Args:
        code: Rego code text
    
    Returns:
        Dict with: pattern_category, pattern_type, pattern_tags
    """
    classification = classify(code)
    if classification.role.startswith("code-pattern:"):
        parts = classification.role.split(":")
        if len(parts) >= 3:
            return {
                "pattern_category": parts[1],
                "pattern_type": parts[2],
                "pattern_tags": classification.tags,
            }
    return {
        "pattern_category": "",
        "pattern_type": "",
        "pattern_tags": [],
    }
