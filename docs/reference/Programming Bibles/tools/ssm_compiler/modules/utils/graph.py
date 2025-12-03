"""
Graph utilities (re-exported from compiler.graph for compatibility)
"""
from __future__ import annotations

# Re-export graph functions from compiler.graph
# This maintains backward compatibility while allowing new structure
import sys
from pathlib import Path

# Add parent directory to path for imports
compiler_path = Path(__file__).parent.parent.parent / "compiler"
if str(compiler_path) not in sys.path:
    sys.path.insert(0, str(compiler_path.parent))

from compiler.graph import (
    build_chapter_text,
    build_chapter_graph,
    compute_transitive_closure,
    render_chapter_graph_mermaid,
    extract_relations_for_chapter,
)

__all__ = [
    'build_chapter_text',
    'build_chapter_graph',
    'compute_transitive_closure',
    'render_chapter_graph_mermaid',
    'extract_relations_for_chapter',
]

