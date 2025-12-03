"""
Type definitions for Bible Pipeline and SSM Compiler.

Provides TypedDict definitions to replace Dict[str, Any] usage
for better type safety and IDE support.
"""
from __future__ import annotations

from typing import TypedDict, List, Optional


class SSMBlockMeta(TypedDict, total=False):
    """Metadata structure for SSM blocks."""
    id: Optional[str]
    code: Optional[str]
    number: Optional[str]
    title: Optional[str]
    level: Optional[str]
    chapter: Optional[str]
    summary: Optional[str]
    name: Optional[str]
    definition: Optional[str]
    q: Optional[str]
    a: Optional[str]
    # Add other known fields as needed


# Note: ChapterData uses Any for SSMBlock since it's a dataclass, not a dict
# This is acceptable as the structure is well-defined
from typing import Any as TypingAny

class ChapterData(TypedDict, total=False):
    """Structure for chapter data in chapters dictionary."""
    meta: TypingAny  # SSMBlock instance (dataclass, not dict)
    concepts: List[TypingAny]  # List[SSMBlock]
    facts: List[TypingAny]  # List[SSMBlock]
    antipatterns: List[TypingAny]  # List[SSMBlock]
    patterns: List[TypingAny]  # List[SSMBlock]
    qa: List[TypingAny]  # List[SSMBlock]
    other: List[TypingAny]  # List[SSMBlock]


class CompilationResult(TypedDict):
    """Result structure from markdown compilation."""
    content: str
    metadata: SSMBlockMeta


class DiagnosticsSummary(TypedDict, total=False):
    """Summary section of diagnostics."""
    total_blocks: int
    error_count: int
    warning_count: int
    compile_time_seconds: float


class Diagnostics(TypedDict, total=False):
    """Diagnostics structure from compilation."""
    summary: DiagnosticsSummary
    errors: List[dict]
    warnings: List[dict]
    metrics: Optional[dict]
    validation: Optional[dict]

