"""
Token Metadata - Line, Column, Raw Text

Provides Token class with full source position information.
"""
from __future__ import annotations

from dataclasses import dataclass, field
from typing import Optional, Dict, Any


@dataclass
class Token:
    """Token with full source position metadata."""
    type: str           # "heading", "paragraph", "code", "blank", "code_fence"
    text: str           # Processed text (stripped, normalized)
    raw: str            # Raw text from source (preserves whitespace)
    line: int           # 1-based line number
    column: int         # 1-based column number (0 = start of line)
    meta: Dict[str, Any] = field(default_factory=dict)  # Additional metadata
    
    def __post_init__(self):
        """Validate token data."""
        if self.line < 1:
            raise ValueError(f"Line number must be >= 1, got {self.line}")
        if self.column < 0:
            raise ValueError(f"Column number must be >= 0, got {self.column}")

    def to_dict(self) -> Dict[str, Any]:
        """Convert token to dictionary."""
        return {
            "type": self.type,
            "text": self.text,
            "raw": self.raw,
            "line": self.line,
            "column": self.column,
            "meta": self.meta
        }

    def position_str(self) -> str:
        """Get human-readable position string."""
        return f"line {self.line}, column {self.column}"

