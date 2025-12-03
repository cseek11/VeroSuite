"""
Paragraph Classifier

Classifies paragraphs into concept, fact, example, or common-mistake blocks.
"""
from __future__ import annotations


def classify_paragraph(text: str) -> str:
    """
    Classify a paragraph into a block type.
    
    Args:
        text: Paragraph text
    
    Returns:
        Block type: "concept", "fact", "example", or "common-mistake"
    """
    t = text.lower()
    
    scores = {
        "concept": 0,
        "fact": 0,
        "example": 0,
        "common-mistake": 0,
    }
    
    # Mistakes / anti-patterns
    if "unsafe" in t and "variable" in t:
        scores["common-mistake"] += 3
    
    if any(k in t for k in ["common mistake", "anti-pattern", "pitfall", "trap", "❌", "wrong"]):
        scores["common-mistake"] += 2
    
    # Theory / concepts
    if any(m in t for m in ["unification", "evaluation model", "semantics", "fixpoint", "theoretical", "foundation"]):
        scores["concept"] += 2
    
    # Normative → fact
    if any(m in t for m in ["must", "should", "shall", "required", "never", "always", "✅", "correct"]):
        scores["fact"] += 2
    
    if any(m in t for m in ["opa", "rego", "rule", "policy"]):
        scores["fact"] += 1
    
    # Example-ish
    if any(m in t for m in ["example", "for instance", "e.g.", "consider:", "for example"]):
        scores["example"] += 2
    
    if "```" in text:
        scores["example"] += 2
    
    label, best = max(scores.items(), key=lambda kv: kv[1])
    
    return label if best > 0 else "concept"

