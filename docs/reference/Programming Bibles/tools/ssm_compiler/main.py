#!/usr/bin/env python3
"""
SSM Compiler Main Entry Point

Supports both:
- Legacy v2 compiler (default, backward compatible)
- New v3 unified compiler (via --v3 flag)
"""
from __future__ import annotations

import sys
import importlib.util
from pathlib import Path
from typing import Dict

# Import structured logger
_project_root = Path(__file__).parent.parent.parent.parent.parent
if str(_project_root) not in sys.path:
    sys.path.insert(0, str(_project_root))

logger_util_path = _project_root / ".cursor" / "scripts" / "logger_util.py"
if logger_util_path.exists():
    spec = importlib.util.spec_from_file_location("logger_util", logger_util_path)
    logger_util = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(logger_util)
    get_logger = logger_util.get_logger
    logger = get_logger("ssm_compiler_main")
else:
    logger = None


def read_markdown(path: Path) -> str:
    return path.read_text(encoding="utf-8")


def main_v2(argv: list[str] | None = None) -> int:
    """Legacy v2 compiler (backward compatible)."""
    if argv is None:
        argv = sys.argv
    
    from compiler.parser import parse_document
    from compiler.graph import (
        build_chapter_text,
        build_chapter_graph,
        compute_transitive_closure,
        render_chapter_graph_mermaid,
    )
    from compiler.emitter import convert_chapter_to_ssm
    from compiler.utils import make_id
    
    if len(argv) < 3:
        if logger:
            logger.error(
                "Invalid usage",
                operation="main_v2",
                error_code="INVALID_USAGE",
                root_cause="Missing required arguments",
                usage="python main.py <input.md> <output.ssm.md> [--v3]"
            )
        raise SystemExit(1)
    
    in_path = Path(argv[1])
    out_path = Path(argv[2])
    
    md = read_markdown(in_path)
    chapters = parse_document(md)
    
    if not chapters:
        if logger:
            logger.error(
                "No chapters detected",
                operation="main_v2",
                error_code="NO_CHAPTERS",
                root_cause="No chapters found in input markdown file",
                input_file=str(in_path)
            )
        raise SystemExit(1)
    
    chapter_texts: Dict[str, str] = {ch.code: build_chapter_text(ch) for ch in chapters}
    graph = build_chapter_graph(chapters, chapter_texts)
    closure = compute_transitive_closure(graph)
    
    chunks = []
    for ch in chapters:
        direct = sorted(graph.get(ch.code, set()))
        all_deps = sorted(closure.get(ch.code, set()))
        text = chapter_texts[ch.code]
        chunks.append(convert_chapter_to_ssm(ch, text, direct, all_deps))
    
    # Global chapter dependency graph (mermaid)
    mermaid = render_chapter_graph_mermaid(graph)
    gid = make_id("GRAPH", mermaid, length=16)
    
    chunks.append(
        "::: graph\n"
        f"id: {gid}\n"
        "type: mermaid\n"
        "summary: Chapter dependency graph (direct edges)\n"
        ":::\n"
        "```mermaid\n"
        f"{mermaid}\n"
        "```\n"
        ":::\n"
    )
    
    out_path.write_text("\n\n".join(chunks), encoding="utf-8")
    if logger:
        logger.info(
            "SSM v2 compilation complete",
            operation="main_v2",
            output_file=str(out_path),
            chapter_count=len(chapters)
        )


def main_v3(argv: list[str] | None = None) -> int:
    """New v3 unified compiler."""
    if argv is None:
        argv = sys.argv
    
    # Import from compiler.py module (file), not compiler package (directory)
    # Use importlib to load the .py file directly, avoiding package name conflict
    import importlib.util
    compiler_path = Path(__file__).parent / "compiler.py"
    spec = importlib.util.spec_from_file_location("compiler_v3_module", compiler_path)
    if spec is None or spec.loader is None:
        if logger:
            logger.error(
                "Could not load compiler.py",
                operation="main_v3",
                error_code="MODULE_LOAD_FAILED",
                root_cause=f"Could not load compiler.py from {compiler_path}",
                compiler_path=str(compiler_path)
            )
        raise SystemExit(1)
    compiler_module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(compiler_module)
    
    if len(argv) < 3:
        if logger:
            logger.error(
                "Invalid usage",
                operation="main_v3",
                error_code="INVALID_USAGE",
                root_cause="Missing required arguments",
                usage="python main.py <input.md> <output.ssm.md> [--v3]"
            )
        raise SystemExit(1)
    
    in_path = Path(argv[1])
    out_path = Path(argv[2])
    
    if not in_path.exists():
        if logger:
            logger.error(
                "Input file not found",
                operation="main_v3",
                error_code="FILE_NOT_FOUND",
                root_cause=f"Input file does not exist: {in_path}",
                input_file=str(in_path)
            )
        raise SystemExit(1)
    
    text = read_markdown(in_path)
    # compile_markdown_to_ssm_v3 returns (result_text, metadata_dict)
    if not hasattr(compiler_module, 'compile_markdown_to_ssm_v3'):
        available_attrs = [a for a in dir(compiler_module) if not a.startswith('_')]
        if logger:
            logger.error(
                "compile_markdown_to_ssm_v3 not found in compiler module",
                operation="main_v3",
                error_code="FUNCTION_NOT_FOUND",
                root_cause="compile_markdown_to_ssm_v3 function not found in compiler module",
                available_attributes=available_attrs
            )
        raise SystemExit(1)
    result, metadata = compiler_module.compile_markdown_to_ssm_v3(text, source_file=str(in_path))
    out_path.write_text(result, encoding="utf-8")
    
    if logger:
        logger.info(
            "SSM v3 compilation complete",
            operation="main_v3",
            output_file=str(out_path),
            metadata_entries=len(metadata) if metadata else 0
        )


def main(argv: list[str] | None = None) -> int:
    """Main entry point with version selection."""
    if argv is None:
        argv = sys.argv
    
    # Check for --v3 flag
    use_v3 = "--v3" in argv
    if use_v3:
        argv = [a for a in argv if a != "--v3"]
    
    if use_v3:
        main_v3(argv)
    else:
        main_v2(argv)


if __name__ == "__main__":
    main()


