"""
Diagram Handler (ASCII + Mermaid)

Extracts and classifies diagrams from AST.
"""
from __future__ import annotations

from typing import List
from dataclasses import dataclass
from .ast_nodes import ASTDocument, ASTNode


@dataclass
class DiagramEntry:
    """Extracted diagram entry."""
    lang: str
    code: str
    line_no: int
    type: str  # ascii / mermaid / unknown


def detect_diagram_type(node: ASTNode) -> str:
    """
    Detect diagram type from node.
    
    Args:
        node: AST node
    
    Returns:
        Diagram type: "mermaid", "ascii", or "unknown"
    """
    if node.type == "diagram":
        if node.lang == "mermaid":
            return "mermaid"
        return "ascii"
    # heuristic: ASCII box characters
    if any(ch in node.text for ch in ["┌", "┐", "└", "┘", "│", "─"]):
        return "ascii"
    return "unknown"


def extract_diagrams(ast: ASTDocument) -> None:
    """
    Extract and classify diagrams from AST.
    
    This pass identifies and classifies diagrams.
    Currently a pass-through for compatibility.
    
    Args:
        ast: AST document (modified in place)
    """
    """
    Extract and classify diagrams from AST.
    
    This pass identifies and classifies diagrams.
    Currently a pass-through for compatibility.
    
    Args:
        ast: AST document (modified in place)
    """
    # Diagrams are extracted via extract_diagrams_from_ast function
    pass


def extract_diagrams_from_ast(
    doc: ASTDocument,
    errors: Optional[Any] = None,  # ErrorBus (optional)
    symbols: Optional[Any] = None,  # SymbolTable (optional)
) -> List[DiagramEntry]:
    """
    Extract diagrams from AST (Enhanced for Phase 4).
    
    Detects:
    - Mermaid diagrams (```mermaid blocks)
    - ASCII box diagrams (box-drawing characters)
    - Flow diagrams (arrows and boxes)
    
    Args:
        doc: AST document
        errors: ErrorBus instance (optional)
        symbols: SymbolTable instance (optional)
    
    Returns:
        List of DiagramEntry objects
    """
    diagrams: List[DiagramEntry] = []
    
    # Check code blocks for mermaid diagrams
    for node in doc.nodes:
        if node.type == "code":
            lang = (node.lang or "").lower()
            code = node.code or ""
            
            # Mermaid detection
            if lang == "mermaid" or "mermaid" in lang:
                diagrams.append(
                    DiagramEntry(
                        lang="mermaid",
                        code=code,
                        line_no=node.line_no,
                        type="mermaid",
                    )
                )
                continue
            
            # ASCII diagram detection (box-drawing characters)
            ascii_box_chars = ["┌", "┐", "└", "┘", "│", "─", "├", "┤", "┬", "┴", "+"]
            if any(char in code for char in ascii_box_chars):
                diagrams.append(
                    DiagramEntry(
                        lang="ascii",
                        code=code,
                        line_no=node.line_no,
                        type="ascii",
                    )
                )
                continue
            
            # Flow diagram detection (arrows and boxes)
            flow_patterns = ["→", "->", "=>", "←", "<-", "↑", "↓"]
            if any(pattern in code for pattern in flow_patterns) and ("[" in code or "(" in code):
                diagrams.append(
                    DiagramEntry(
                        lang="ascii",
                        code=code,
                        line_no=node.line_no,
                        type="flow",
                    )
                )
    
    # Check diagram nodes
    for node in doc.nodes:
        if node.type == "diagram":
            dtype = detect_diagram_type(node)
            diagrams.append(
                DiagramEntry(
                    lang=node.lang or "ascii",
                    code=node.code or node.text,
                    line_no=node.line_no,
                    type=dtype,
                )
            )
    
    return diagrams
