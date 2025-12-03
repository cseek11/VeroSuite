"""
Table Extractor (Phase 4)

Extracts and normalizes markdown tables into SSM table blocks.
"""
from __future__ import annotations

from typing import List, Optional, Dict, Any
from dataclasses import dataclass
import re
from .ast_nodes import ASTDocument, ASTNode


@dataclass
class TableEntry:
    """Extracted table entry."""
    headers: List[str]
    rows: List[List[str]]
    caption: str = ""
    line_no: int = 0


def parse_markdown_table(text: str) -> Optional[TableEntry]:
    """
    Parse a markdown table from text.
    
    Args:
        text: Markdown table text
    
    Returns:
        TableEntry or None if not a valid table
    """
    lines = text.strip().split("\n")
    if len(lines) < 2:
        return None
    
    # Check for markdown table format (| col1 | col2 |)
    if not all("|" in line for line in lines[:2]):
        return None
    
    # Parse header
    header_line = lines[0].strip()
    if not header_line.startswith("|") or not header_line.endswith("|"):
        return None
    
    headers = [cell.strip() for cell in header_line.split("|")[1:-1]]
    
    # Skip separator line (|---|---|)
    data_lines = lines[2:] if len(lines) > 2 and re.match(r"^\|[\s\-:]+\|", lines[1]) else lines[1:]
    
    # Parse rows
    rows = []
    for line in data_lines:
        line = line.strip()
        if not line.startswith("|") or not line.endswith("|"):
            break
        cells = [cell.strip() for cell in line.split("|")[1:-1]]
        if len(cells) == len(headers):
            rows.append(cells)
    
    if not headers or not rows:
        return None
    
    return TableEntry(headers=headers, rows=rows, caption="")


def extract_tables_from_ast(
    doc: ASTDocument,
    errors: Optional[Any] = None,  # ErrorBus (optional)
    symbols: Optional[Any] = None,  # SymbolTable (optional)
) -> List[TableEntry]:
    """
    Extract tables from AST.
    
    Args:
        doc: AST document
        errors: ErrorBus instance (optional)
        symbols: SymbolTable instance (optional)
    
    Returns:
        List of TableEntry objects
    """
    tables: List[TableEntry] = []
    
    # First, scan for table nodes (NEW - Fix for table loss issue)
    for node in doc.nodes:
        if node.type == "table":
            # Parse the table text
            table = parse_markdown_table(node.text)
            if table:
                table.line_no = node.line_no
                tables.append(table)
            elif errors:
                errors.warning(
                    code="WARN_TABLE_PARSE_FAILED",
                    message=f"Failed to parse table at line {node.line_no}",
                    line=node.line_no,
                    column=1,
                    context=node.text[:100],
                    suggestion="Check table format (must have header and separator row)"
                )
    
    # Also scan paragraphs for embedded tables (backward compatibility)
    # This catches tables that were not detected during parsing (e.g., embedded in paragraphs)
    for node in doc.nodes:
        if node.type == "paragraph":
            text = node.text
            # Check if text contains a markdown table
            # Only process if not already extracted as a table node
            if "|" in text and "\n" in text:
                # Check if this paragraph is actually a table (standalone)
                lines = text.split("\n")
                # More lenient check: at least 2 lines with pipes, and they look like table rows
                if len(lines) >= 2:
                    # Check if first 2 lines look like table rows (start and end with |)
                    first_two_look_like_table = all(
                        line.strip().startswith("|") and line.strip().endswith("|") and "|" in line.strip()
                        for line in lines[:2] if line.strip()
                    )
                    if first_two_look_like_table:
                        # Try to parse as table
                        table = parse_markdown_table(text)
                        if table:
                            table.line_no = node.line_no
                            # Check if this table was already extracted (avoid duplicates)
                            is_duplicate = any(
                                t.line_no == table.line_no and 
                                t.headers == table.headers and 
                                len(t.rows) == len(table.rows)
                                for t in tables
                            )
                            if not is_duplicate:
                                tables.append(table)
    
    # Also scan code blocks for embedded tables (e.g., in markdown/text code blocks)
    # Some code blocks may contain markdown tables as part of their content
    # BUT: Skip EBNF grammar blocks (they use | as "or" operator, not table separator)
    for node in doc.nodes:
        if node.type == "code":
            code_text = node.text
            lang = getattr(node, 'lang', '') or ''
            # Only check code blocks that might contain tables (markdown, text)
            # Skip EBNF and other code languages where | is an operator
            if lang in ('markdown', 'md', 'text') or (not lang and '|' in code_text):
                # Check if code block contains a markdown table
                # Must have proper table structure (header row with multiple columns)
                if "|" in code_text and "\n" in code_text:
                    lines = code_text.split("\n")
                    # Look for table patterns: lines starting and ending with |
                    # Must have at least 3 columns (2+ pipes) to be a real table
                    table_start_idx = None
                    for i, line in enumerate(lines):
                        stripped = line.strip()
                        # More strict: must have at least 3 pipes (2+ columns) and proper format
                        if (stripped.startswith('|') and stripped.endswith('|') and 
                            stripped.count('|') >= 3 and
                            # Check that it's not EBNF grammar (EBNF uses ::= and | as operators)
                            '::=' not in stripped and '::=' not in lines[max(0, i-2):i+3]):
                            # Found potential table start
                            if table_start_idx is None:
                                table_start_idx = i
                            # Check if we have at least 2 consecutive table-like lines
                            if i > table_start_idx and i - table_start_idx >= 1:
                                # Extract table from code block
                                table_lines = lines[table_start_idx:i+1]
                                table_text = "\n".join(table_lines)
                                table = parse_markdown_table(table_text)
                                if table and len(table.headers) >= 2:  # Must have at least 2 columns
                                    # Calculate actual line number (code block start + offset)
                                    table.line_no = node.line_no + table_start_idx
                                    # Check for duplicates
                                    is_duplicate = any(
                                        t.line_no == table.line_no and 
                                        t.headers == table.headers and 
                                        len(t.rows) == len(table.rows)
                                        for t in tables
                                    )
                                    if not is_duplicate:
                                        tables.append(table)
                                    break  # Only extract first table from code block
    
    return tables

