#!/usr/bin/env python3
"""
Bible → SSM → Cursor Ingestion Pipeline

Converts SSM-compiled Bibles into Cursor-friendly formats:
- Cursor-readable markdown (*.cursor.md) for knowledge
- Cursor rules (*.mdc) for enforcement

Usage examples:

  # For Rego Bible
  python tools/bible_pipeline.py \
    --language rego \
    --ssm knowledge/bibles/rego/compiled/REGO_OPA_Bible.ssm.md \
    --out-md knowledge/bibles/rego/cursor/REGO_OPA_Bible.cursor.md \
    --out-mdc .cursor/rules/rego_bible.mdc

  # For Python Bible
  python tools/bible_pipeline.py \
    --language python \
    --ssm knowledge/bibles/python/compiled/Python_Bible.ssm.md \
    --out-md knowledge/bibles/python/cursor/Python_Bible.cursor.md \
    --out-mdc .cursor/rules/python_bible.mdc
"""

from __future__ import annotations

import argparse
import re
import sys
from dataclasses import dataclass, field
from pathlib import Path
from typing import Dict, List, Optional

# Import structured logger
# Add project root to path to import .cursor module
_project_root = Path(__file__).parent.parent
if str(_project_root) not in sys.path:
    sys.path.insert(0, str(_project_root))

# Import bible_types after adding project root to path
# Note: Using bible_types to avoid conflict with Python's built-in types module
from tools.bible_types import SSMBlockMeta, ChapterData

# Import logger utility using direct file import
import importlib.util
logger_util_path = _project_root / ".cursor" / "scripts" / "logger_util.py"
spec = importlib.util.spec_from_file_location("logger_util", logger_util_path)
logger_util = importlib.util.module_from_spec(spec)
spec.loader.exec_module(logger_util)
get_logger = logger_util.get_logger

logger = get_logger("bible_pipeline")


# -------------------------------------------------------------------
# 1. Core SSM Block Model
# -------------------------------------------------------------------

@dataclass
class SSMBlock:
    """Represents a parsed SSM block."""
    block_type: str
    meta: SSMBlockMeta
    body: str
    raw: str

    @property
    def id(self) -> Optional[str]:
        return self.meta.get("id")

    @property
    def chapter(self) -> Optional[str]:
        return self.meta.get("chapter")

    def get(self, key: str, default: str | None = None) -> str | None:
        """Get metadata value with type-safe return."""
        result = self.meta.get(key, default)
        # Type narrowing: if default is None, result could be None or str
        return result if isinstance(result, str) else default


# -------------------------------------------------------------------
# 2. SSM Parser (generic)
# -------------------------------------------------------------------

def _find_chapter_title_ahead(lines: List[str], start_idx: int, max_lookahead: int = 20) -> Optional[tuple[str, str, str]]:
    """
    Look ahead from start_idx to find a chapter title in the next concept block.
    Returns (chapter_num, title, difficulty) if found, None otherwise.
    """
    i = start_idx
    n = len(lines)
    lookahead = 0
    
    # Skip current line and any immediate ::: fences
    while i < n and lookahead < max_lookahead:
        line = lines[i].strip()
        
        # Skip empty lines and ::: fences
        if not line or line == ":::":
            i += 1
            lookahead += 1
            continue
        
        # Check if this line has a chapter title pattern
        chapter_match = re.search(r'CHAPTER\s+(\d+)', line)
        if chapter_match:
            chapter_num = chapter_match.group(1)
            title_match = re.search(r'—\s*([^🟢🔴🟡]+)', line)
            title = title_match.group(1).strip() if title_match else ""
            
            difficulty = ""
            if "🟢" in line:
                difficulty = "Beginner"
            elif "🟡" in line:
                difficulty = "Intermediate"
            elif "🔴" in line:
                difficulty = "Advanced"
            
            if chapter_num and title:
                return (chapter_num, title, difficulty)
        
        # If we hit a concept block start, parse it and check metadata
        if line.startswith("::: concept"):
            # Parse the concept block to get metadata
            meta_lines = []
            i += 1
            while i < n and lookahead < max_lookahead:
                meta_line = lines[i].strip()
                if meta_line == ":::":
                    break
                if ":" in meta_line:
                    meta_lines.append(meta_line)
                i += 1
                lookahead += 1
            
            # Check metadata fields for chapter title
            for meta_line in meta_lines:
                if ":" in meta_line:
                    key, value = meta_line.split(":", 1)
                    key = key.strip()
                    value = value.strip()
                    
                    # Check summary, intuition, or vector_summary for chapter title
                    if key in ("summary", "intuition", "vector_summary"):
                        chapter_match = re.search(r'CHAPTER\s+(\d+)', value)
                        if chapter_match:
                            chapter_num = chapter_match.group(1)
                            title_match = re.search(r'—\s*([^🟢🔴🟡]+)', value)
                            title = title_match.group(1).strip() if title_match else ""
                            
                            difficulty = ""
                            if "🟢" in value:
                                difficulty = "Beginner"
                            elif "🟡" in value:
                                difficulty = "Intermediate"
                            elif "🔴" in value:
                                difficulty = "Advanced"
                            
                            if chapter_num and title:
                                return (chapter_num, title, difficulty)
        
        i += 1
        lookahead += 1
    
    return None


def parse_ssm_blocks(path: Path) -> List[SSMBlock]:
    """Parse an SSM Markdown file into a list of SSMBlock objects.

    Parses Semantic Structural Markup (SSM) files containing structured blocks
    with metadata and body content. Supports both standard SSM block format and
    HTML comment chunk boundaries.

    Args:
        path: Path to the .ssm.md file to parse.

    Returns:
        List of SSMBlock objects, each containing block_type, meta dict, and body text.

    Raises:
        FileNotFoundError: If the specified file does not exist.
        UnicodeDecodeError: If the file cannot be decoded as UTF-8.

    Note:
        Expects blocks in the form:
        ::: block-type
        key: value
        key2: value2
        ...
        :::
        body text...
        :::

        Also handles HTML comment blocks like:
        <!-- SSM:CHUNK_BOUNDARY id="ch01-start" --> 📘 CHAPTER 1 — INTRODUCTION TO PYTHON 🟢 Beginner
    """
    text = path.read_text(encoding="utf-8")
    lines = text.splitlines()

    blocks: List[SSMBlock] = []
    i = 0
    n = len(lines)

    while i < n:
        line = lines[i].strip()
        
        # Check for HTML comment blocks (CHUNK_BOUNDARY)
        if line.startswith("<!-- SSM:CHUNK_BOUNDARY"):
            # Extract id from HTML comment
            id_match = re.search(r'id="([^"]+)"', line)
            chunk_id = id_match.group(1) if id_match else None
            
            # Check if title is on the same line (after -->)
            title_line = None
            same_line_match = re.search(r'-->\s*(.+)', line)
            if same_line_match:
                title_line = same_line_match.group(1).strip()
            # Otherwise, check the next line
            elif i + 1 < n:
                title_line = lines[i + 1].strip()
            
            if title_line:
                # Parse chapter info from title line
                # Format: 📘 CHAPTER 1 — INTRODUCTION TO PYTHON 🟢 Beginner
                chapter_match = re.search(r'CHAPTER\s+(\d+)', title_line)
                chapter_num = chapter_match.group(1) if chapter_match else None
                
                # Extract title (between — and emoji)
                title_match = re.search(r'—\s*([^🟢🔴🟡]+)', title_line)
                title = title_match.group(1).strip() if title_match else ""
                
                # Extract difficulty level
                difficulty = ""
                if "🟢" in title_line:
                    difficulty = "Beginner"
                elif "🟡" in title_line:
                    difficulty = "Intermediate"
                elif "🔴" in title_line:
                    difficulty = "Advanced"
                
                # Only create chapter-meta if we found chapter number
                if chapter_num:
                    meta: SSMBlockMeta = {
                        "id": chunk_id,
                        "code": f"CH-{chapter_num.zfill(2)}",
                        "number": chapter_num,
                        "title": title,
                        "level": difficulty,
                    }
                    
                    body = title_line
                    raw = f"{lines[i]}\n{title_line}" if same_line_match is None else lines[i]
                    
                    blocks.append(SSMBlock(
                        block_type="chapter-meta",
                        meta=meta,
                        body=body,
                        raw=raw
                    ))
                    
                    # Skip lines based on whether title was on same line or next
                    i += 1 if same_line_match else 2
                    continue
                else:
                    # Title line exists but no chapter number - might be in next concept block
                    # Skip this line and continue (will be handled by body parsing)
                    i += 1
                    continue
            else:
                # No title found on same line or next line - look ahead for chapter title
                chapter_info = _find_chapter_title_ahead(lines, i + 1)
                if chapter_info:
                    chapter_num, title, difficulty = chapter_info
                    meta: SSMBlockMeta = {
                        "id": chunk_id,
                        "code": f"CH-{chapter_num.zfill(2)}",
                        "number": chapter_num,
                        "title": title,
                        "level": difficulty,
                    }
                    
                    body = f"📘 CHAPTER {chapter_num} — {title} {difficulty}"
                    raw = lines[i]
                    
                    blocks.append(SSMBlock(
                        block_type="chapter-meta",
                        meta=meta,
                        body=body,
                        raw=raw
                    ))
                
                # Skip this line and continue
                i += 1
                continue
        
        # Original ::: block parsing
        if not line.startswith(":::"):
            i += 1
            continue

        # Example: "::: chapter-meta"
        parts = line.split()
        if len(parts) < 2:
            i += 1
            continue

        block_type = parts[1].strip()
        meta: SSMBlockMeta = {}
        body_lines: List[str] = []
        raw_lines: List[str] = [lines[i]]
        i += 1

        # Parse meta lines until we hit ":::" or empty line
        while i < n:
            line = lines[i]
            raw_lines.append(line)
            stripped = line.strip()
            if stripped == ":::":  # end of meta
                i += 1
                break
            if ":" in line:
                key, value = line.split(":", 1)
                meta[key.strip()] = value.strip()
            i += 1

        # Check metadata fields (summary, intuition, vector_summary) for CHUNK_BOUNDARY markers
        # This handles cases where CHUNK_BOUNDARY is embedded in concept block metadata
        for meta_key in ["summary", "intuition", "vector_summary"]:
            meta_value = meta.get(meta_key, "")
            if meta_value and "CHUNK_BOUNDARY" in meta_value:
                chunk_match = re.search(r'<!-- SSM:CHUNK_BOUNDARY id="([^"]+)" -->\s*(.+)', meta_value)
                if chunk_match:
                    chunk_id = chunk_match.group(1)
                    title_line = chunk_match.group(2).strip()
                    
                    # Parse chapter info from title line
                    chapter_match = re.search(r'CHAPTER\s+(\d+)', title_line)
                    chapter_num = chapter_match.group(1) if chapter_match else None
                    
                    if chapter_num:
                        # Extract title (between — and emoji)
                        title_match = re.search(r'—\s*([^🟢🔴🟡]+)', title_line)
                        title = title_match.group(1).strip() if title_match else ""
                        
                        # Extract difficulty level
                        difficulty = ""
                        if "🟢" in title_line:
                            difficulty = "Beginner"
                        elif "🟡" in title_line:
                            difficulty = "Intermediate"
                        elif "🔴" in title_line:
                            difficulty = "Advanced"
                        
                        # Create chapter-meta block from CHUNK_BOUNDARY in metadata
                        chapter_meta: SSMBlockMeta = {
                            "id": chunk_id,
                            "code": f"CH-{chapter_num.zfill(2)}",
                            "number": chapter_num,
                            "title": title,
                            "level": difficulty,
                        }
                        
                        blocks.append(SSMBlock(
                            block_type="chapter-meta",
                            meta=chapter_meta,
                            body=title_line,
                            raw=f"<!-- SSM:CHUNK_BOUNDARY id=\"{chunk_id}\" --> {title_line}"
                        ))
                        # Don't break - continue to parse the actual block as well

        # Now parse body until next ":::"
        while i < n:
            line = lines[i]
            if line.strip() == ":::":  # end of block
                raw_lines.append(line)
                i += 1
                break
            body_lines.append(line)
            raw_lines.append(line)
            i += 1

        body = "\n".join(body_lines).strip()
        raw = "\n".join(raw_lines)
        blocks.append(SSMBlock(block_type=block_type, meta=meta, body=body, raw=raw))
        
        # Check if body contains CHUNK_BOUNDARY marker and create chapter-meta block
        chunk_match = re.search(r'<!-- SSM:CHUNK_BOUNDARY id="([^"]+)" -->\s*(.+)', body)
        if chunk_match:
            chunk_id = chunk_match.group(1)
            title_line = chunk_match.group(2).strip()
            
            # Parse chapter info from title line
            # Format: 📘 CHAPTER 1 — INTRODUCTION TO PYTHON 🟢 Beginner
            chapter_match = re.search(r'CHAPTER\s+(\d+)', title_line)
            chapter_num = chapter_match.group(1) if chapter_match else None
            
            # Extract title (between — and emoji)
            title_match = re.search(r'—\s*([^🟢🔴🟡]+)', title_line)
            title = title_match.group(1).strip() if title_match else ""
            
            # Extract difficulty level
            difficulty = ""
            if "🟢" in title_line:
                difficulty = "Beginner"
            elif "🟡" in title_line:
                difficulty = "Intermediate"
            elif "🔴" in title_line:
                difficulty = "Advanced"
            
            # Create chapter-meta block from CHUNK_BOUNDARY
            chapter_meta: SSMBlockMeta = {
                "id": chunk_id,
                "code": f"CH-{chapter_num.zfill(2)}" if chapter_num else "CH-UNKNOWN",
                "number": chapter_num,
                "title": title,
                "level": difficulty,
            }
            
            # Insert chapter-meta block before the current block
            blocks.insert(-1, SSMBlock(
                block_type="chapter-meta",
                meta=chapter_meta,
                body=title_line,
                raw=f"<!-- SSM:CHUNK_BOUNDARY id=\"{chunk_id}\" --> {title_line}"
            ))

        # Some files had stray ":::". Skip any immediate extra blank ::: 
        while i < n and lines[i].strip() == ":::":  # orphan fence
            i += 1

    return blocks


# -------------------------------------------------------------------
# 3. Cursor-Friendly Bible (.cursor.md)
# -------------------------------------------------------------------

def generate_cursor_markdown(
    blocks: List[SSMBlock],
    language: str,
    out_path: Path,
) -> None:
    """Generate a comprehensive human/agent-readable Bible for Cursor from SSM blocks.

    Converts Semantic Structural Markup (SSM) blocks into a complete markdown
    document that includes all content from the SSM file, not just summaries.
    This ensures Cursor has access to the complete knowledge base including
    code examples, explanations, and all details.

    Args:
        blocks: List of SSMBlock objects to convert to markdown.
        language: Programming language name (e.g., "python", "typescript").
        out_path: Path where the generated .cursor.md file will be written.

    Returns:
        None. Writes the markdown file to out_path.

    Raises:
        IOError: If the output file cannot be written.
        ValueError: If blocks contain invalid chapter metadata.

    Note:
        Strategy:
        - Use chapter-meta to create chapter headings
        - Include ALL blocks with FULL body content
        - Preserve code examples, explanations, and all details
        - Organize by chapter and block type for readability
    """
    chapters: Dict[str, ChapterData] = {}
    current_chapter_code: Optional[str] = None
    global_blocks: List[SSMBlock] = []  # Blocks without chapter assignment

    # 1) Collect chapter meta and associate blocks with chapters
    for b in blocks:
        # If this is a chapter-meta block, update current chapter
        if b.block_type == "chapter-meta":
            code = b.meta.get("code")
            if code:
                current_chapter_code = code
                if code not in chapters:
                    chapters[code] = {
                        "meta": b,
                        "concepts": [],
                        "facts": [],
                        "antipatterns": [],
                        "patterns": [],
                        "qa": [],
                        "other": [],  # Other block types
                    }
            continue
        
        # Associate blocks with current chapter (if we have one)
        # Check if metadata chapter is a valid chapter code (CH-XX), otherwise use current_chapter_code
        meta_chapter = b.meta.get("chapter", "")
        if meta_chapter and meta_chapter.startswith("CH-") and meta_chapter in chapters:
            chapter_code = meta_chapter
        else:
            chapter_code = current_chapter_code
        
        if chapter_code and chapter_code in chapters:
            ch = chapter_code
            if b.block_type == "concept":
                chapters[ch]["concepts"].append(b)
            elif b.block_type == "fact":
                chapters[ch]["facts"].append(b)
            elif b.block_type in ("antipattern", "common-mistake"):
                chapters[ch]["antipatterns"].append(b)
            elif b.block_type in ("code-pattern", "pattern"):
                chapters[ch]["patterns"].append(b)
            elif b.block_type == "qa":
                chapters[ch]["qa"].append(b)
            else:
                chapters[ch]["other"].append(b)
        else:
            # Global blocks (no chapter assignment)
            global_blocks.append(b)

    # 2) Render markdown
    lines: List[str] = []
    title = f"{language.capitalize()} Bible – Cursor Edition"
    lines.append(f"# {title}")
    lines.append("")
    lines.append("> Auto-generated from SSM Bible via V3 compiler + pipeline.")
    lines.append("> This file contains the COMPLETE content from the SSM Bible.")
    lines.append("")
    lines.append("**Last Updated:** 2025-12-05")
    lines.append("")

    # Sort chapters by numeric code if possible (CH-01, CH-02, …)
    def chapter_sort_key(item: tuple[str, ChapterData]) -> int:
        code = item[0]  # "CH-01"
        try:
            return int(code.split("-")[1])
        except (ValueError, IndexError) as e:
            logger.warn(
                "Invalid chapter code format",
                operation="chapter_sort_key",
                error_code="INVALID_CHAPTER_CODE",
                root_cause=str(e),
                chapter_code=code
            )
            return 999
        except Exception as e:
            logger.error(
                "Unexpected error processing chapter code",
                operation="chapter_sort_key",
                error_code="UNEXPECTED_ERROR",
                root_cause=str(e),
                chapter_code=code,
                exc_info=True
            )
            raise  # Re-raise unexpected errors

    for ch_code, data in sorted(chapters.items(), key=chapter_sort_key):
        meta_block: SSMBlock = data["meta"]
        number = meta_block.get("number", ch_code)
        title = meta_block.get("title", "")
        level = meta_block.get("level", "")

        # Chapter header
        lines.append(f"## Chapter {number} — {title}")
        lines.append("")
        if level:
            level_str = ", ".join(level) if isinstance(level, list) else str(level)
            lines.append(f"_Difficulty: {level_str}_")
            lines.append("")

        # Concepts - FULL CONTENT
        concepts: List[SSMBlock] = data["concepts"]
        if concepts:
            lines.append("### Concepts")
            lines.append("")
            for c in concepts:  # NO LIMIT - include all
                # Include full body content
                if c.body and c.body.strip():
                    # Use summary as heading if available, otherwise use first line
                    summary = c.get("summary", "").strip()
                    if summary and len(summary) < 200:  # Use as heading if reasonable length
                        lines.append(f"#### {summary}")
                        lines.append("")
                    lines.append(c.body.strip())
                    lines.append("")
                elif c.get("summary"):
                    # Fallback to summary if no body
                    lines.append(f"**{c.get('summary')}**")
                    lines.append("")
            lines.append("")

        # Facts - FULL CONTENT
        facts: List[SSMBlock] = data["facts"]
        if facts:
            lines.append("### Important Facts")
            lines.append("")
            for f in facts:  # NO LIMIT - include all
                if f.body and f.body.strip():
                    lines.append(f.body.strip())
                    lines.append("")
                elif f.get("summary"):
                    lines.append(f"**{f.get('summary')}**")
                    lines.append("")
            lines.append("")

        # Code Patterns - FULL CONTENT
        patterns: List[SSMBlock] = data["patterns"]
        if patterns:
            lines.append("### Code Patterns")
            lines.append("")
            for p in patterns:  # NO LIMIT - include all
                summary = p.get("summary", "").strip()
                lang = p.get("language", language)
                pattern_type = p.get("pattern_type", "")
                
                if summary:
                    badge = f" ({lang}, {pattern_type})" if pattern_type else f" ({lang})"
                    lines.append(f"#### Pattern: {summary}{badge}")
                    lines.append("")
                
                if p.body and p.body.strip():
                    lines.append(p.body.strip())
                    lines.append("")
            lines.append("")

        # Anti-patterns - FULL CONTENT
        antipatterns: List[SSMBlock] = data["antipatterns"]
        if antipatterns:
            lines.append("### Common Pitfalls & Anti-Patterns")
            lines.append("")
            for ap in antipatterns:  # NO LIMIT - include all
                problem = ap.get("problem", "") or ap.get("summary", "")
                severity = ap.get("severity", "medium")
                
                if problem:
                    lines.append(f"#### [{severity.upper()}] {problem}")
                    lines.append("")
                
                if ap.body and ap.body.strip():
                    lines.append(ap.body.strip())
                    lines.append("")
                
                # Include solution if available
                solution = ap.get("solution", "")
                if solution:
                    lines.append("**Solution:**")
                    lines.append("")
                    lines.append(solution)
                    lines.append("")
            lines.append("")

        # Q&A - FULL CONTENT
        qa_blocks: List[SSMBlock] = data["qa"]
        if qa_blocks:
            lines.append("### Questions & Answers")
            lines.append("")
            for q in qa_blocks:  # NO LIMIT - include all (but still filter low-importance)
                question = q.get("question", q.get("q", "")).strip()
                answer = q.get("answer", q.get("a", "")).strip()
                
                if not question:
                    continue
                
                # Skip low-importance QA only (keep everything else)
                if q.get("importance") == "low":
                    continue
                
                lines.append(f"**Q:** {question}")
                lines.append("")
                if answer:
                    lines.append(f"**A:** {answer}")
                    lines.append("")
                elif q.body and q.body.strip():
                    # Use body as answer if no explicit answer field
                    lines.append(f"**A:** {q.body.strip()}")
                    lines.append("")
            lines.append("")

        # Other block types - FULL CONTENT
        other_blocks: List[SSMBlock] = data["other"]
        if other_blocks:
            lines.append("### Additional Content")
            lines.append("")
            for o in other_blocks:
                if o.body and o.body.strip():
                    block_type = o.block_type.replace("-", " ").title()
                    lines.append(f"#### {block_type}")
                    lines.append("")
                    lines.append(o.body.strip())
                    lines.append("")
            lines.append("")

        lines.append("---")
        lines.append("")

    # Render global blocks (no chapter assignment)
    if global_blocks:
        lines.append("## Global Content")
        lines.append("")
        for b in global_blocks:
            if b.body and b.body.strip():
                block_type = b.block_type.replace("-", " ").title()
                lines.append(f"### {block_type}")
                lines.append("")
                lines.append(b.body.strip())
                lines.append("")
        lines.append("---")
        lines.append("")

    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text("\n".join(lines), encoding="utf-8")
    logger.info(
        "Cursor markdown file generated",
        operation="generate_cursor_markdown",
        file_path=str(out_path),
        line_count=len(lines)
    )


# -------------------------------------------------------------------
# 4. Cursor Rules (.mdc)
# -------------------------------------------------------------------

def generate_cursor_rules_mdc(
    blocks: List[SSMBlock],
    language: str,
    out_path: Path,
) -> None:
    """Generate a Cursor rules (.mdc) file from the SSM Bible.

    Extracts enforcement rules from SSM blocks and formats them as Cursor
    rule definitions. Focuses on anti-patterns (DO NOT rules) and code
    patterns (recommended patterns) that guide AI agent behavior.

    Args:
        blocks: List of SSMBlock objects to extract rules from.
        language: Programming language name (e.g., "python", "typescript").
        out_path: Path where the generated .mdc file will be written.

    Returns:
        None. Writes the rules file to out_path.

    Raises:
        IOError: If the output file cannot be written.

    Note:
        Focus:
        - anti-patterns → DO NOT rules
        - code-patterns → recommended patterns
        - possibly facts tagged as constraints
    """
    antipatterns: List[SSMBlock] = []
    patterns: List[SSMBlock] = []

    for b in blocks:
        t = b.block_type
        if t in ("antipattern", "common-mistake"):
            antipatterns.append(b)
        elif t in ("code-pattern", "pattern"):
            patterns.append(b)

    lines: List[str] = []

    # Frontmatter
    lines.append("---")
    lines.append(f'description: "{language.capitalize()} Bible rules extracted from SSM"')
    lines.append("alwaysApply: true")
    lines.append("sources:")
    lines.append("  - bible-ssm")
    lines.append("severityDefault: warning")
    lines.append("version: 1.0.0")
    lines.append("---")
    lines.append("")
    lines.append(f"# {language.capitalize()} Bible – Enforcement Rules (Auto-Generated)")
    lines.append("")
    lines.append("> This file is generated from the SSM Bible. Edit the source Bible and re-run the pipeline instead of editing this file directly.")
    lines.append("")
    lines.append("**Last Updated:** 2025-12-05")
    lines.append("")

    # Section: Anti-patterns
    if antipatterns:
        lines.append("## Anti-Patterns (DO NOT)")
        lines.append("")
        for ap in antipatterns:
            ap_id = ap.id or ""
            problem = ap.get("problem", "") or ap.get("summary", "") or (ap.body.split("\n", 1)[0] if ap.body else "")
            if not problem:
                continue
            severity = ap.get("severity", "medium")
            chapter = ap.chapter or ""

            lines.append(f"### {ap_id or 'Unnamed Anti-Pattern'}")
            if chapter:
                lines.append(f"- **Chapter:** `{chapter}`")
            lines.append(f"- **Severity:** `{severity}`")
            lines.append("")
            lines.append("**Problem:**")
            lines.append("")
            lines.append(f"{problem}")
            lines.append("")

            # Optional: embed solution if present
            solution = ap.get("solution", "")
            if solution:
                lines.append("**Preferred Alternative / Solution:**")
                lines.append("")
                lines.append(f"{solution}")
                lines.append("")

            # Cursor-style rule hint
            lines.append("**Rule (Cursor guideline):**")
            lines.append("")
            lines.append(f"- Avoid this pattern when writing {language} code unless explicitly justified.")
            lines.append("- If existing code uses this pattern, prefer refactoring toward the recommended solution.")
            lines.append("")

        lines.append("")

    # Section: Recommended Patterns
    if patterns:
        lines.append("## Recommended Patterns (Prefer These)")
        lines.append("")
        for p in patterns:
            p_id = p.id or ""
            summary = p.get("summary", "") or (p.body.split("\n", 1)[0] if p.body else "")
            if not summary:
                continue
            chapter = p.chapter or ""
            lang = p.get("language", language)
            ptype = p.get("pattern_type", "") or p.get("pattern_subtype", "")

            lines.append(f"### {p_id or 'Unnamed Pattern'}")
            if chapter:
                lines.append(f"- **Chapter:** `{chapter}`")
            lines.append(f"- **Language:** `{lang}`")
            if ptype:
                lines.append(f"- **Pattern Type:** `{ptype}`")
            lines.append("")
            lines.append("**Pattern:**")
            lines.append("")
            lines.append(f"{summary}")
            lines.append("")

            # Include code example if available
            if p.body:
                code_lines = p.body.split("\n")
                if any("```" in line or "def " in line or "function " in line or "class " in line for line in code_lines[:5]):
                    lines.append("**Example:**")
                    lines.append("")
                    lines.append("```" + lang)
                    lines.append(p.body[:500])  # Limit code example length
                    if len(p.body) > 500:
                        lines.append("...")
                    lines.append("```")
                    lines.append("")

            lines.append("**Rule (Cursor guideline):**")
            lines.append("")
            lines.append(f"- Prefer this pattern when solving similar problems in `{language}`.")
            lines.append("- When refactoring, move toward this pattern if it improves clarity, safety, or performance.")
            lines.append("")

        lines.append("")

    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text("\n".join(lines), encoding="utf-8")
    logger.info(
        "Cursor rules file generated",
        operation="generate_cursor_rules",
        file_path=str(out_path)
    )


# -------------------------------------------------------------------
# 5. CLI Entrypoint
# -------------------------------------------------------------------

def main() -> int:
    """Main entry point for the Bible ingestion pipeline.

    Parses command-line arguments, validates input files, and orchestrates
    the conversion of SSM Markdown files into Cursor-friendly formats.

    Returns:
        0 on success, 1 on failure (file not found or processing error).

    Raises:
        SystemExit: If command-line arguments are invalid or required files
            are missing.
    """
    parser = argparse.ArgumentParser(description="Bible → Cursor ingestion pipeline")
    parser.add_argument("--language", required=True, help="Language name (e.g. rego, python, typescript)")
    parser.add_argument("--ssm", required=True, help="Path to .ssm.md file from V3 compiler")
    parser.add_argument("--out-md", required=True, help="Path to write Cursor-readable .md")
    parser.add_argument("--out-mdc", required=True, help="Path to write Cursor rules .mdc")

    args = parser.parse_args()

    ssm_path = Path(args.ssm)
    out_md = Path(args.out_md)
    out_mdc = Path(args.out_mdc)

    if not ssm_path.exists():
        logger.error(
            "SSM file not found",
            operation="load_ssm_file",
            error_code="FILE_NOT_FOUND",
            root_cause=f"SSM file does not exist: {ssm_path}",
            file_path=str(ssm_path)
        )
        return 1

    blocks = parse_ssm_blocks(ssm_path)
    logger.info(
        "SSM blocks parsed",
        operation="parse_ssm_blocks",
        block_count=len(blocks),
        file_path=str(ssm_path)
    )

    generate_cursor_markdown(blocks, args.language, out_md)
    generate_cursor_rules_mdc(blocks, args.language, out_mdc)

    logger.info(
        "Cursor outputs generated",
        operation="generate_cursor_outputs",
        markdown_file=str(out_md),
        rules_file=str(out_mdc)
    )
    return 0


if __name__ == "__main__":
    exit(main())

