"""
Term Extraction Module

Extracts terms and aliases from AST nodes.
"""
from __future__ import annotations

from typing import List, Set, Tuple
from dataclasses import dataclass
from .ast_nodes import ASTDocument
from .utils.patterns import TERM_DEF_RE, QUOTED_TERM_RE, ALIASES_RE


@dataclass
class TermEntry:
    """Extracted term entry."""
    name: str
    definition: str
    aliases: List[str]
    first_line: int


def extract_terms_from_ast(doc: ASTDocument) -> List[TermEntry]:
    """
    Extract terms from AST.
    
    Args:
        doc: AST document
    
    Returns:
        List of TermEntry objects
    """
    """
    Extract terms from AST.
    
    Args:
        doc: AST document
    
    Returns:
        List of TermEntry objects
    """
    terms: List[TermEntry] = []
    seen: Set[Tuple[str, str]] = set()
    
    for node in doc.nodes:
        if node.type != "paragraph":
            continue
        text = node.text
        
        # bold term definitions
        for m in TERM_DEF_RE.finditer(text):
            name = m.group(1).strip()
            definition = m.group(2).strip()
            
            # Clean up definition: remove extra whitespace, normalize newlines
            definition = ' '.join(definition.split())
            
            # Ensure definition is not empty and has meaningful content
            if len(definition) < 3:
                continue
            
            key = (name.lower(), definition.lower())
            if key in seen:
                continue
            seen.add(key)
            terms.append(TermEntry(name=name, definition=definition, aliases=[], first_line=node.line_no))
        
        # quoted terms "x" is ...
        for m in QUOTED_TERM_RE.finditer(text):
            name = m.group(1).strip()
            definition = m.group(2).strip()
            
            # Clean up definition
            definition = ' '.join(definition.split())
            
            if len(definition) < 3:
                continue
            
            key = (name.lower(), definition.lower())
            if key in seen:
                continue
            seen.add(key)
            terms.append(TermEntry(name=name, definition=definition, aliases=[], first_line=node.line_no))
        
        # alias forms
        for m in ALIASES_RE.finditer(text):
            name = m.group(1).strip()
            aliases_raw = m.group(2).strip()
            aliases = [a.strip() for a in aliases_raw.split(",") if a.strip()]
            key = (name.lower(), "")
            if key not in seen:
                seen.add(key)
                terms.append(TermEntry(name=name, definition="", aliases=aliases, first_line=node.line_no))
    
    return terms


def extract_terms(ast: ASTDocument) -> None:
    """
    Extract terms from AST chapters and attach to AST nodes.
    
    This is a pass that enriches the AST with term information.
    Currently a pass-through for compatibility.
    
    Args:
        ast: AST document (modified in place)
    """
    # Terms are extracted via extract_terms_from_ast function
    pass
