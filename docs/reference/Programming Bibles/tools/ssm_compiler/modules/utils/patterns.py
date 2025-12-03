"""
Compiled regex patterns for performance
"""
from __future__ import annotations

import re

# Compiled regexes for performance (used multiple times)
HEADING_RE = re.compile(r"^(#{1,6})\s+(.*)$")
# Match chapter headings with various dash types (em dash, en dash, hyphen)
# Note: This matches the heading TEXT (after ## is removed), not the full markdown line
# Also matches standalone "Chapter X" lines (not just ## Chapter X)
CHAPTER_HEADING_RE = re.compile(r"^Chapter\s+(\d+)\s*[–—\-]\s*(.+)$", re.IGNORECASE)
# Match part headings (text after # is removed, so no # in pattern)
PART_HEADING_RE = re.compile(r"^PART\s+([IVXLC]+)\s*[–—-]\s*(.+)$", re.IGNORECASE)
CODE_FENCE_RE = re.compile(r"^```([a-zA-Z0-9_-]*)\s*$")
# Improved term definition regex - captures more content including code blocks
# Matches: **term**: definition (can include periods, newlines, code blocks)
TERM_DEF_RE = re.compile(r"\*\*([^*]+)\*\*:\s*(.+?)(?=\n\n|\*\*|$)", re.DOTALL)
# Quoted term regex - also improved to capture more content
QUOTED_TERM_RE = re.compile(r'"([^"]+)"\s+(?:is|means|refers to)\s+(.+?)(?=\n\n|"|$)', re.IGNORECASE | re.DOTALL)
ALIASES_RE = re.compile(
    r"\*\*([^*]+)\*\*\s*\((?:also called|aka|or)\s+([^)]+)\)",
    re.IGNORECASE,
)
SEE_CHAPTER_RE = re.compile(r"[Ss]ee\s+Chapter\s+(\d+)")
MUST_NOT_RE = re.compile(r"\b(must not|never|forbidden|disallowed)\b", re.IGNORECASE)

