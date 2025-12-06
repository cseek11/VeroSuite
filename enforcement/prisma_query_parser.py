"""
Prisma query parser for structured analysis of Prisma client calls.

Provides AST-lite parsing to extract Prisma call structure, where clauses,
and tenant key presence without requiring a full TypeScript AST.

Python Bible Chapter 11: Clean Architecture principles.
"""

import re
from dataclasses import dataclass
from pathlib import Path
from typing import List, Optional


@dataclass
class PrismaCall:
    """
    Represents a parsed Prisma client call.
    
    Attributes:
        file_path: Path to the file containing the call
        line_number: Line number where the call starts
        model: Prisma model name (e.g., "customer")
        op: Operation name (e.g., "findMany", "update")
        args_text: Full argument text between parentheses
        where_text: Raw text for where: {...} block, if found
        where_has_tenant_key: True if tenantId/tenant_id appears as a key in where clause
    """
    file_path: Path
    line_number: int
    model: str
    op: str
    args_text: str
    where_text: Optional[str]
    where_has_tenant_key: bool


def parse_prisma_calls(file_path: Path, content: str) -> List[PrismaCall]:
    """
    Parse all Prisma client calls from a file's content.
    
    Args:
        file_path: Path to the file being parsed
        content: Full file content as string
        
    Returns:
        List of PrismaCall objects representing each Prisma call found
    """
    calls = []
    
    # Pattern to match Prisma call headers:
    # - this.prisma.model.op(
    # - this.db.model.op(
    # - tx.model.op(
    # - await prisma.model.op(
    # - prisma.model.op(
    prisma_patterns = [
        re.compile(r'this\.(?:prisma|db)\.(\w+)\.(\w+)\s*\(', re.MULTILINE),
        re.compile(r'tx\.(\w+)\.(\w+)\s*\(', re.MULTILINE),
        re.compile(r'(?:await\s+)?prisma\.(\w+)\.(\w+)\s*\(', re.MULTILINE),
    ]
    
    # Collect all matches from all patterns, avoiding duplicates
    all_matches = []
    seen_positions = set()
    
    for pattern in prisma_patterns:
        for match in pattern.finditer(content):
            # Avoid duplicate matches at the same position
            pos_key = (match.start(), match.end())
            if pos_key not in seen_positions:
                seen_positions.add(pos_key)
                all_matches.append(match)
    
    # Sort matches by position to process in order
    all_matches.sort(key=lambda m: m.start())
    
    for match in all_matches:
        model = match.group(1)
        op = match.group(2)
        call_start = match.end() - 1  # Position of opening parenthesis
        
        # Calculate line number
        line_number = content[:call_start].count('\n') + 1
        
        # Extract argument block using parenthesis matching
        args_text = _extract_argument_block(content, call_start)
        
        if args_text is None:
            # Malformed call (unmatched parentheses) - skip
            continue
        
        # Extract where clause from args_text
        where_text = _extract_where_clause(args_text)
        
        # Check if tenant key is present in where clause
        where_has_tenant_key = _has_tenant_key(where_text) if where_text else False
        
        calls.append(PrismaCall(
            file_path=file_path,
            line_number=line_number,
            model=model,
            op=op,
            args_text=args_text,
            where_text=where_text,
            where_has_tenant_key=where_has_tenant_key
        ))
    
    return calls


def _extract_argument_block(content: str, start_pos: int) -> Optional[str]:
    """
    Extract the complete argument block from a Prisma call using parenthesis matching.
    
    Args:
        content: Full file content
        start_pos: Position of opening parenthesis
        
    Returns:
        Argument text between parentheses, or None if unmatched
    """
    depth = 0
    in_string = False
    string_char = None
    escape_next = False
    pos = start_pos
    
    while pos < len(content):
        char = content[pos]
        
        if escape_next:
            escape_next = False
            pos += 1
            continue
        
        if char == '\\':
            escape_next = True
            pos += 1
            continue
        
        # Handle string literals
        if not in_string and char in ('"', "'", '`'):
            in_string = True
            string_char = char
            pos += 1
            continue
        
        if in_string:
            if char == string_char:
                in_string = False
                string_char = None
            pos += 1
            continue
        
        # Track parentheses depth
        if char == '(':
            depth += 1
        elif char == ')':
            depth -= 1
            if depth == 0:
                # Found matching closing parenthesis
                return content[start_pos + 1:pos]  # Exclude the parentheses themselves
        
        pos += 1
    
    # Unmatched parentheses
    return None


def _extract_where_clause(args_text: str) -> Optional[str]:
    """
    Extract the where clause from Prisma call arguments.
    
    Args:
        args_text: Argument text (without outer parentheses, may include outer braces)
        
    Returns:
        Raw text of where: {...} block, or None if not found
    """
    # Strip leading/trailing whitespace
    args_text = args_text.strip()
    
    # Remove outer braces if present (args_text might be "{ ... }" or just "...")
    # We need to find the matching closing brace, not just check start/end
    if args_text.startswith('{'):
        # Find the matching closing brace
        inner = _extract_brace_block(args_text, 0)
        if inner is not None:
            args_text = inner
        elif args_text.endswith('}'):
            # Fallback: simple case where braces match at start/end
            args_text = args_text[1:-1].strip()
    
    # Find "where" token at top level
    where_pattern = re.compile(r'\bwhere\s*:', re.IGNORECASE)
    
    for match in where_pattern.finditer(args_text):
        # Check if this "where" is at top level
        before_where = args_text[:match.start()]
        
        # Count braces to determine nesting level
        brace_depth = 0
        bracket_depth = 0
        paren_depth = 0
        in_string = False
        string_char = None
        escape_next = False
        
        for i, char in enumerate(before_where):
            if escape_next:
                escape_next = False
                continue
            
            if char == '\\':
                escape_next = True
                continue
            
            if not in_string and char in ('"', "'", '`'):
                in_string = True
                string_char = char
                continue
            
            if in_string:
                if char == string_char:
                    in_string = False
                    string_char = None
                continue
            
            if char == '{':
                brace_depth += 1
            elif char == '}':
                brace_depth -= 1
            elif char == '[':
                bracket_depth += 1
            elif char == ']':
                bracket_depth -= 1
            elif char == '(':
                paren_depth += 1
            elif char == ')':
                paren_depth -= 1
        
        # If we're at top level (brace_depth == 0), extract the where object
        if brace_depth == 0 and bracket_depth == 0 and paren_depth == 0:
            # Find the opening brace after the colon
            after_colon = args_text[match.end():]
            brace_start = None
            
            for i, char in enumerate(after_colon):
                if char.isspace():
                    continue
                if char == '{':
                    brace_start = match.end() + i
                    break
                elif char not in ('{', ' ', '\t', '\n'):
                    # Not a valid where clause
                    break
            
            if brace_start is None:
                continue
            
            # Extract the where object using brace matching
            where_text = _extract_brace_block(args_text, brace_start)
            if where_text:
                return where_text
    
    return None


def _extract_brace_block(content: str, start_pos: int) -> Optional[str]:
    """
    Extract a complete {...} block starting at the given position.
    
    Args:
        content: Text content
        start_pos: Position of opening brace
        
    Returns:
        Text inside braces (excluding the braces), or None if unmatched
    """
    depth = 0
    in_string = False
    string_char = None
    escape_next = False
    pos = start_pos
    
    while pos < len(content):
        char = content[pos]
        
        if escape_next:
            escape_next = False
            pos += 1
            continue
        
        if char == '\\':
            escape_next = True
            pos += 1
            continue
        
        if not in_string and char in ('"', "'", '`'):
            in_string = True
            string_char = char
            pos += 1
            continue
        
        if in_string:
            if char == string_char:
                in_string = False
                string_char = None
            pos += 1
            continue
        
        if char == '{':
            depth += 1
        elif char == '}':
            depth -= 1
            if depth == 0:
                # Found matching closing brace
                return content[start_pos + 1:pos]  # Exclude the braces themselves
        
        pos += 1
    
    # Unmatched braces
    return None


def _has_tenant_key(where_text: str) -> bool:
    """
    Check if where clause contains tenantId or tenant_id as a key.
    
    Args:
        where_text: Raw text of where clause (without outer braces)
        
    Returns:
        True if tenantId or tenant_id appears as a key
    """
    # Pattern to match tenantId or tenant_id as a key (not in strings or comments)
    # Look for: tenantId: or tenant_id: at top level of where object
    tenant_pattern = re.compile(r'\b(tenantId|tenant_id)\s*:', re.IGNORECASE)
    
    # Simple check: if pattern matches, tenant key is present
    # This is a heuristic - for more precision, we'd need to parse the object structure
    # But for Phase 3.2, this suffices
    return bool(tenant_pattern.search(where_text))

