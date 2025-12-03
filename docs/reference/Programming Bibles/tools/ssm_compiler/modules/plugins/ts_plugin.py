"""
TypeScript/NestJS Language Plugin

TypeScript-specific code classification.
"""
from __future__ import annotations

import re
from typing import Tuple, List
from . import CodeClassification


def classify(code: str) -> CodeClassification:
    """
    Classify TypeScript code block.
    
    Args:
        code: TypeScript code text
    
    Returns:
        CodeClassification with role and tags
    """
    t = code
    
    patterns: List[Tuple[str, str, str]] = [
        (r"@Controller\(", "nestjs", "controller"),
        (r"@Injectable\(", "nestjs", "service"),
        (r"@Module\(", "nestjs", "module"),
        (r"@Get\(", "nestjs", "route-get"),
        (r"@Post\(", "nestjs", "route-post"),
        (r"PrismaService\.", "prisma", "query"),
        (r": Promise<", "ts", "async-fn"),
    ]
    
    tags = []
    for pat, cat, label in patterns:
        if re.search(pat, t):
            tags.append(cat)
    
    if tags:
        return CodeClassification(role="code-pattern:nestjs-ts", tags=tags)
    
    # simple example vs. pattern heuristic
    if "class " in t or "interface " in t or "async " in t:
        return CodeClassification(role="code-pattern:ts-structure", tags=["ts"])
    
    return CodeClassification(role="example")


def get_pattern_taxonomy(code: str) -> dict:
    """
    Get pattern taxonomy for TypeScript code.
    
    Args:
        code: TypeScript code text
    
    Returns:
        Dict with: pattern_category, pattern_type, pattern_tags
    """
    classification = classify(code)
    if classification.role.startswith("code-pattern:"):
        return {
            "pattern_category": "typescript",
            "pattern_type": classification.role.split(":")[-1],
            "pattern_tags": classification.tags,
        }
    return {
        "pattern_category": "",
        "pattern_type": "",
        "pattern_tags": [],
    }
