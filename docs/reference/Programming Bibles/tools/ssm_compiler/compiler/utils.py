from __future__ import annotations

import re
import hashlib

# ---------- Basic text helpers ----------

def normalize_whitespace(s: str) -> str:
    return re.sub(r"\s+", " ", s).strip()

def make_id(prefix: str, content: str, length: int = 12) -> str:
    h = hashlib.sha1(content.encode("utf-8")).hexdigest()[:length]
    return f"{prefix}-{h}"

# ---------- Regex patterns used across modules ----------

HEADING_RE = re.compile(r"^(#+)\s+(.*)$")
PART_RE = re.compile(r"^#\s+PART\s+([IVXLC]+)\s*[–—-]\s*(.+)$")
CHAPTER_RE = re.compile(r"^(?:##\s+)?Chapter\s+(\d+)\s*[–—-]\s*(.+)$")
CODE_FENCE_RE = re.compile(r"^([`~]{3,})(\w+)?\s*$")

# Term / alias patterns (line-start to avoid inline bold noise)

TERM_PATTERNS = [
    # **Term**: definition
    re.compile(r"^\s*\*\*([^*]+)\*\*\s*[:\-–—]\s*([^.\n]+)", re.MULTILINE),
    # "term" is definition
    re.compile(r'^\s*"([^"]+)"\s+(?:is|means|refers to)\s+([^.\n]+)', re.MULTILINE),
]

ALIAS_PATTERN = re.compile(
    r"\*\*([^*]+)\*\*\s*\((?:also called|aka|or)\s+([^)]+)\)",
    re.IGNORECASE,
)

# Generic "non-term" section names you don't want in the glossary

GENERIC_SECTION_TERMS = {
    "examples",
    "example",
    "complex example",
    "example comparison",
    "truth table",
    "core projects",
    "core capabilities",
    "integration points",
    "design philosophy",
}

def looks_like_hr(text: str) -> bool:
    """
    Detect horizontal rules (section separators).
    Matches:
    - Exact matches: ---, ***, ___
    - Long lines of dashes, underscores, or asterisks (3+ characters, all same)
    """
    t = text.strip()
    if t in {"---", "***", "___"}:
        return True
    # Check for long separator lines (all same character, 3+ chars)
    if len(t) >= 3 and len(set(t)) == 1 and t[0] in {"-", "_", "*"}:
        return True
    return False

