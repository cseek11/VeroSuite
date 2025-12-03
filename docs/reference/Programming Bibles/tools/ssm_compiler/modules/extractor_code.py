"""
Code Block Classifier (Multi-Language)

Classifies code blocks by language and pattern type.
Supports Rego, TypeScript, Python, Go, and more via plugins.
"""
from __future__ import annotations

from typing import List
from dataclasses import dataclass
from .ast_nodes import ASTDocument, ASTNode
from .plugins.rego_plugin import classify as classify_rego
from .plugins.ts_plugin import classify as classify_ts
from .plugins.python_plugin import classify as classify_python
from .plugins.sql_plugin import classify as classify_sql
from .plugins import CodeClassification


@dataclass
class CodeEntry:
    """Extracted code entry."""
    lang: str
    code: str
    line_no: int
    classification: CodeClassification


def classify_code_block(lang: str, code: str) -> CodeClassification:
    """
    Classify a code block by language.
    
    Args:
        lang: Language identifier
        code: Code text
    
    Returns:
        CodeClassification
    """
    l = (lang or "").lower()
    
    # best-effort language detection when no lang set
    if not l:
        # crude heuristics
        if "package " in code or "default allow" in code or "allow if" in code:
            l = "rego"
        elif "def " in code or "class " in code or "import " in code:
            l = "python"
        elif "SELECT " in code.upper() or "FROM " in code.upper():
            l = "sql"
        elif "@Controller(" in code or "export class " in code:
            l = "ts"
    
    if l in ("rego", "policy", "opa"):
        return classify_rego(code)
    if l in ("ts", "tsx", "typescript"):
        return classify_ts(code)
    if l in ("py", "python"):
        return classify_python(code)
    if l in ("sql",):
        return classify_sql(code)
    
    # fallback: some structure
    if "[" in code and "]" in code and "|" in code:
        return CodeClassification(role="code-pattern:generic", tags=["generic"])
    
    return CodeClassification(role="example")


def extract_code_blocks(ast: ASTDocument) -> None:
    """
    Extract and classify code blocks from AST.
    
    This pass enriches code blocks with classification information.
    Currently a pass-through for compatibility.
    
    Args:
        ast: AST document (modified in place)
    """
    # Code classification is done during extraction
    pass


def extract_code_entries(doc: ASTDocument) -> List[CodeEntry]:
    """
    Extract code entries from AST.
    
    Args:
        doc: AST document
    
    Returns:
        List of CodeEntry objects
    """
    codes: List[CodeEntry] = []
    for node in doc.nodes:
        if node.type == "code":
            classification = classify_code_block(node.lang, node.code)
            codes.append(
                CodeEntry(
                    lang=node.lang or "",
                    code=node.code,
                    line_no=node.line_no,
                    classification=classification,
                )
            )
    return codes
