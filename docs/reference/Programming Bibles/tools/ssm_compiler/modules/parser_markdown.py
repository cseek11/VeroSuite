"""
Streaming Markdown Parser → AST

Converts raw markdown text into an Abstract Syntax Tree (AST)
with Chapter, Section, and Block nodes.

Supports hierarchical AST with parent-child relationships,
error detection via ErrorBus, and symbol tracking via SymbolTable.
"""
from __future__ import annotations

import sys
import importlib.util
from pathlib import Path
from typing import List, Optional
from .ast_nodes import ASTNode, ASTDocument
from .utils.patterns import (
    HEADING_RE, CHAPTER_HEADING_RE, PART_HEADING_RE, CODE_FENCE_RE
)

# Import structured logger
_project_root = Path(__file__).parent.parent.parent.parent.parent.parent.parent
if str(_project_root) not in sys.path:
    sys.path.insert(0, str(_project_root))

logger_util_path = _project_root / ".cursor" / "scripts" / "logger_util.py"
if logger_util_path.exists():
    spec = importlib.util.spec_from_file_location("logger_util", logger_util_path)
    logger_util = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(logger_util)
    get_logger = logger_util.get_logger
    logger = get_logger("parser_markdown")
else:
    logger = None

# Import runtime components (optional to maintain backward compatibility)
try:
    from runtime.tokens import Token
    from runtime.error_bus import ErrorBus
    from runtime.symbol_table import SymbolTable
except ImportError:
    Token = None  # type: ignore
    ErrorBus = None  # type: ignore
    SymbolTable = None  # type: ignore


def parse_markdown_to_ast(
    text: str,
    errors: Optional["ErrorBus"] = None,
    symbols: Optional["SymbolTable"] = None
) -> ASTDocument:
    """
    Streaming parser that builds hierarchical AST with error detection.
    
    Args:
        text: Markdown text to parse
        errors: ErrorBus instance for diagnostics (optional)
        symbols: SymbolTable instance for symbol tracking (optional)
    
    Returns:
        ASTDocument with hierarchical structure
    """
    if logger:
        logger.progress("Starting parse_markdown_to_ast", operation="parse_markdown_to_ast", stage="start")
    # Create default instances if not provided (backward compatibility)
    if logger:
        logger.progress("Creating ErrorBus/SymbolTable if needed", operation="parse_markdown_to_ast", stage="initialization")
    if errors is None and ErrorBus is not None:
        errors = ErrorBus()
        if logger:
            logger.info("ErrorBus created", operation="parse_markdown_to_ast", stage="initialization")
    if symbols is None and SymbolTable is not None:
        symbols = SymbolTable()
        if logger:
            logger.info("SymbolTable created", operation="parse_markdown_to_ast", stage="initialization")
    
    if logger:
        logger.progress("Splitting text into lines", operation="parse_markdown_to_ast", stage="parsing")
    lines = text.splitlines()
    if logger:
        logger.progress(
            "Split into lines",
            operation="parse_markdown_to_ast",
            stage="parsing",
            current=len(lines)
        )
    doc = ASTDocument(nodes=[])
    if logger:
        logger.info("ASTDocument created", operation="parse_markdown_to_ast", stage="initialization")
    
    # Stack to track open containers (part → chapter → section)
    node_stack: List[ASTNode] = []
    
    in_code = False
    code_lang = ""
    code_lines: List[str] = []
    para_lines: List[str] = []
    line_no = 0
    code_start_line = 0
    
    def make_token(type: str, raw: str, text: str, line: int, col: int, **meta) -> Optional["Token"]:
        """Helper to create tokens."""
        if Token is None:
            return None
        return Token(
            type=type,
            raw=raw,
            text=text,
            line=line,
            column=col,
            meta=meta
        )
    
    def flush_code():
        """Flush accumulated code block."""
        nonlocal code_lines, in_code, code_start_line
        if code_lines:
            code_text = "\n".join(code_lines)
            code_node = ASTNode(
                type="code",
                text=code_text,
                code=code_text,
                lang=code_lang,
                line_no=code_start_line,
                token=make_token(
                    "code",
                    code_text,
                    code_text,
                    code_start_line,
                    1,
                    lang=code_lang or None
                ) if Token else None,
                meta={"lang": code_lang or None}
            )
            if node_stack:
                node_stack[-1].add_child(code_node)
            doc.nodes.append(code_node)
        code_lines = []
        in_code = False
    
    def flush_paragraph():
        """Flush accumulated paragraph."""
        nonlocal para_lines
        if para_lines:
            content = "\n".join(para_lines).strip()
            if content:
                para_node = ASTNode(
                    type="paragraph",
                    text=content,
                    line_no=line_no,
                    token=make_token("paragraph", "\n".join(para_lines), content, line_no, 1) if Token else None
                )
                if node_stack:
                    node_stack[-1].add_child(para_node)
                doc.nodes.append(para_node)
            para_lines = []
    
    def close_nodes_above_level(target_level: int):
        """Close all nodes at or above target level."""
        while node_stack:
            top = node_stack[-1]
            if top.type == "part" or (top.type == "chapter" and target_level <= 2):
                break
            if top.type == "section" and top.level >= target_level:
                node_stack.pop()
            else:
                break
    
    # Use index-based iteration to allow skipping lines (for table detection)
    line_idx = 0
    total_lines = len(lines)
    progress_interval = max(100, total_lines // 50)  # Report more frequently for debugging
    if logger:
        logger.progress(
            "Starting main parsing loop",
            operation="parse_markdown_to_ast",
            stage="parsing",
            total=total_lines
        )
    
    while line_idx < len(lines):
        # Progress reporting for large files
        if line_idx > 0 and line_idx % progress_interval == 0:
            if logger:
                logger.progress(
                    "Processing line",
                    operation="parse_markdown_to_ast",
                    stage="parsing",
                    current=line_idx,
                    total=total_lines
                )
        
        if line_idx == 0:
            if logger:
                logger.progress("Processing first line", operation="parse_markdown_to_ast", stage="parsing")
        
        raw_line = lines[line_idx]
        line_no = line_idx + 1
        line = raw_line.rstrip("\n")
        col = len(raw_line) - len(raw_line.lstrip(" "))
        
        # Code fence handling
        if line_idx == 0:
            if logger:
                logger.debug(
                    "Checking code fence on first line",
                    operation="parse_markdown_to_ast",
                    stage="parsing",
                    line_preview=line[:50]
                )
        m_code = CODE_FENCE_RE.match(line)
        if m_code:
            if not in_code:
                # Starting code block
                flush_paragraph()
                in_code = True
                code_lang = m_code.group(1).strip().lower()
                code_lines = []
                code_start_line = line_no
            else:
                # Ending code block
                flush_code()
            line_idx += 1
            continue
        
        if in_code:
            code_lines.append(raw_line)
            line_idx += 1
            continue
        
        # Table detection (NEW - Fix for table loss issue)
        # Check if this line starts a markdown table
        # Must have at least 2 pipe characters and start/end with pipe
        stripped = line.strip()
        if stripped.startswith('|') and stripped.endswith('|') and stripped.count('|') >= 3:
            # Check if previous line was blank or a heading (table is standalone)
            # Also allow tables after text if they have proper markdown table format
            prev_line_idx = line_idx - 1
            is_table_start = (
                line_idx == 0 or 
                prev_line_idx < 0 or
                not lines[prev_line_idx].strip() or 
                lines[prev_line_idx].strip().startswith('#') or
                # Allow tables that follow text if they have proper format (header + separator)
                (line_idx + 1 < len(lines) and 
                 lines[line_idx + 1].strip().startswith('|') and 
                 '---' in lines[line_idx + 1] or '|' in lines[line_idx + 1])
            )
            
            if is_table_start:
                # Collect table lines
                table_lines = [line]
                table_start_line = line_no
                table_start_idx = line_idx
                i = line_idx + 1  # Next line index
                
                # Continue collecting table lines
                # Also check for separator row (|---|---|)
                while i < len(lines):
                    next_line = lines[i].rstrip("\n")
                    next_stripped = next_line.strip()
                    # Include lines that start and end with | and have at least 2 pipes
                    if next_stripped.startswith('|') and next_stripped.endswith('|') and next_stripped.count('|') >= 2:
                        table_lines.append(next_line)
                        i += 1
                    else:
                        break
                
                # Only create table node if we have at least 2 rows (header + data)
                if len(table_lines) >= 2:
                    flush_paragraph()  # Flush any pending paragraph
                    
                    # Parse table
                    table_text = "\n".join(table_lines)
                    table_node = ASTNode(
                        type="table",
                        text=table_text,
                        line_no=table_start_line,
                        token=make_token("table", table_text, table_text, table_start_line, col) if Token else None,
                        meta={"raw_lines": table_lines}
                    )
                    
                    # Attach to current container
                    if node_stack:
                        node_stack[-1].add_child(table_node)
                    doc.nodes.append(table_node)
                    
                    # Skip all table lines we just processed
                    line_idx = i
                    continue
        
        # Heading detection
        m_head = HEADING_RE.match(line)
        if m_head:
            flush_paragraph()
            level = len(m_head.group(1))
            text_h = m_head.group(2).strip()
            token = make_token("heading", raw_line, text_h, line_no, col, level=level) if Token else None
            
            # PART detection
            m_part = PART_HEADING_RE.match(text_h)
            if m_part:
                close_nodes_above_level(1)
                part_num = m_part.group(1)
                part_title = m_part.group(2).strip()
                part_node = ASTNode(
                    type="part",
                    text=text_h,
                    line_no=line_no,
                    level=1,
                    token=token,
                    meta={"part_number": part_num, "title": part_title}
                )
                doc.parts.append(part_node)
                doc.nodes.append(part_node)
                node_stack = [part_node]
                line_idx += 1
                continue
            
            # CHAPTER detection
            m_chapter = CHAPTER_HEADING_RE.match(text_h)
            if m_chapter:
                num = int(m_chapter.group(1))
                title = m_chapter.group(2).strip()
                
                # Exclude diagram titles and special content from chapter detection
                # Diagrams should be sections, not chapters
                is_diagram = (
                    "(Diagram)" in title or 
                    "(diagram)" in title or
                    "Diagram" in title and "Flow" in title or
                    title.lower().endswith("diagram")
                )
                
                # Exclude empty or very short titles
                if is_diagram or len(title) < 3:
                    # Treat as section instead of chapter
                    if level >= 3:
                        # Process as section (code continues below)
                        pass
                    else:
                        # Create section node for diagram
                        section_node = ASTNode(
                            type="section",
                            text=text_h,
                            line_no=line_no,
                            level=3,  # Force to level 3
                            token=token
                        )
                        if node_stack:
                            node_stack[-1].add_child(section_node)
                        doc.nodes.append(section_node)
                        if symbols:
                            section_id = f"SEC-{line_no}-3"
                            symbols.add_section(text_h, section_id, line_no=line_no)
                        node_stack.append(section_node)
                        line_idx += 1
                        continue
                
                # Valid chapter - proceed with chapter creation
                close_nodes_above_level(2)
                ch_code = f"CH-{num:02d}"
                
                # Check for duplicate chapter numbers
                if symbols and not symbols.add_chapter(num, ch_code, line_no=line_no, title=title):
                    if errors:
                        errors.error(
                            code="ERR_DUPLICATE_CHAPTER_NUMBER",
                            message=f"Duplicate chapter number {num}",
                            line=line_no,
                            column=col,
                            context=text_h,
                            suggestion="Chapters must be uniquely numbered."
                        )
                
                chapter_node = ASTNode(
                    type="chapter",
                    text=text_h,
                    line_no=line_no,
                    level=2,
                    token=token,
                    meta={"number": num, "title": title, "code": ch_code}
                )
                
                # Attach to current part or document
                if node_stack and node_stack[0].type == "part":
                    node_stack[0].add_child(chapter_node)
                else:
                    doc.parts.append(chapter_node)
                doc.nodes.append(chapter_node)
                doc.chapters.append(chapter_node)
                
                node_stack = [n for n in [node_stack[0] if node_stack else None, chapter_node] if n]
                line_idx += 1
                continue
            
            # SECTION detection (level 3-6)
            if level >= 3:
                close_nodes_above_level(level)
                
                # Validate section is under a chapter
                has_chapter = any(n.type == "chapter" for n in node_stack)
                if not has_chapter and errors:
                    errors.warning(
                        code="WARN_SECTION_OUTSIDE_CHAPTER",
                        message=f"Section '{text_h}' appears before any chapter",
                        line=line_no,
                        column=col,
                        context=raw_line,
                        suggestion="Define this section under a chapter."
                    )
                
                section_node = ASTNode(
                    type="section",
                    text=text_h,
                    line_no=line_no,
                    level=level,
                    token=token
                )
                
                # Attach to current chapter or section
                if node_stack:
                    node_stack[-1].add_child(section_node)
                doc.nodes.append(section_node)
                
                # Add to symbol table
                if symbols:
                    section_id = f"SEC-{line_no}-{level}"
                    symbols.add_section(text_h, section_id, line_no=line_no)
                
                node_stack.append(section_node)
                line_idx += 1
                continue
            
            # Heading that's not PART, CHAPTER, or SECTION (level 1-2 that don't match patterns)
            # Treat as regular paragraph content
            para_lines.append(raw_line)
            line_idx += 1
            continue
        
        # FIX 1: Disable standalone "Chapter X" detection for plain text
        # Only treat markdown headings (## Chapter X) as chapters, not standalone text
        # This prevents subsections like "Chapter 5 – Real-World Examples" from becoming chapters
        # 
        # DISABLED: Standalone chapter detection causes misclassification
        # Standalone "Chapter X" text should be treated as regular content, not chapters
        #
        # The code below was causing subsections to be elevated to chapters.
        # It's now disabled - only markdown headings (## Chapter X) create chapters.
        #
        # OLD CODE (DISABLED):
        # m_chapter_standalone = CHAPTER_HEADING_RE.match(line.strip())
        # if m_chapter_standalone:
        #     num = int(m_chapter_standalone.group(1))
        #     title = m_chapter_standalone.group(2).strip()
        #     ... (rest of chapter creation code)
        #
        # NEW BEHAVIOR: Standalone "Chapter X" text is treated as regular paragraph content
        
        # Blank line = paragraph separator
        if not line.strip():
            flush_paragraph()
            line_idx += 1
            continue
        
        # Check if this line might be a table even if not standalone
        # (embedded tables that appear after text without blank line)
        stripped = line.strip()
        if stripped.startswith('|') and stripped.endswith('|') and stripped.count('|') >= 3:
            # Check if next line is also a table line (header + data pattern)
            if line_idx + 1 < len(lines):
                next_line_stripped = lines[line_idx + 1].strip()
                # If next line is also a table line, treat this as a table
                if (next_line_stripped.startswith('|') and next_line_stripped.endswith('|') and 
                    next_line_stripped.count('|') >= 2):
                    # This looks like a table - flush paragraph and process as table
                    flush_paragraph()
                    
                    # Collect table lines
                    table_lines = [line]
                    table_start_line = line_no
                    table_start_idx = line_idx
                    i = line_idx + 1  # Next line index
                    
                    # Continue collecting table lines
                    while i < len(lines):
                        next_line = lines[i].rstrip("\n")
                        next_stripped = next_line.strip()
                        # Include lines that start and end with | and have at least 2 pipes
                        if next_stripped.startswith('|') and next_stripped.endswith('|') and next_stripped.count('|') >= 2:
                            table_lines.append(next_line)
                            i += 1
                        else:
                            break
                    
                    # Only create table node if we have at least 2 rows (header + data)
                    if len(table_lines) >= 2:
                        # Parse table
                        table_text = "\n".join(table_lines)
                        table_node = ASTNode(
                            type="table",
                            text=table_text,
                            line_no=table_start_line,
                            token=make_token("table", table_text, table_text, table_start_line, col) if Token else None,
                            meta={"raw_lines": table_lines}
                        )
                        
                        # Attach to current container
                        if node_stack:
                            node_stack[-1].add_child(table_node)
                        doc.nodes.append(table_node)
                        
                        # Skip all table lines we just processed
                        line_idx = i
                        continue
        
        # Part of paragraph
        para_lines.append(raw_line)
        line_idx += 1
    
    # EOF flush
    flush_paragraph()
    if in_code:
        if errors:
            errors.error(
                code="ERR_UNCLOSED_CODE_FENCE",
                message="Code fence opened but not closed",
                line=line_no,
                column=1,
                context="EOF",
                suggestion="Close all code fences with ```"
            )
        flush_code()  # Flush anyway
    
    return doc
