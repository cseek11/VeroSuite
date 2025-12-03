"""
Language Plugins

Language-specific code classification and pattern detection.
"""
from __future__ import annotations

from dataclasses import dataclass, field
from typing import List


@dataclass
class CodeClassification:
    """Code classification result."""
    role: str  # "example" or "code-pattern:category"
    tags: List[str] = field(default_factory=list)
