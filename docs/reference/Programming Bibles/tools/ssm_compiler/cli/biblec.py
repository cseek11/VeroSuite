#!/usr/bin/env python3
"""
Bible Compiler CLI (Phase 10)

Full-featured CLI for SSM compiler with validate, index, and stats commands.
"""
from __future__ import annotations

import sys
import json
import argparse
import importlib.util
from pathlib import Path
from typing import Optional

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
    logger = get_logger("biblec_cli")
else:
    logger = None

# Add parent directory to path
cli_dir = Path(__file__).parent.parent
if str(cli_dir) not in sys.path:
    sys.path.insert(0, str(cli_dir))

# Import compiler
import importlib.util
compiler_path = cli_dir / "compiler.py"
compiler_spec = importlib.util.spec_from_file_location("compiler_module", compiler_path)
compiler_module = importlib.util.module_from_spec(compiler_spec)
compiler_spec.loader.exec_module(compiler_module)
compile_markdown_to_ssm_v3 = compiler_module.compile_markdown_to_ssm_v3
compile_document = compiler_module.compile_document

from runtime.error_bus import ErrorBus
from runtime.symbol_table import SymbolTable
from runtime.metrics import MetricsCollector
from runtime.quality_report import generate_quality_report, print_quality_report

try:
    from validation.validate_ssm import validate_ssm
except ImportError:
    validate_ssm = None

try:
    from indexing.embedding_prep import index_ssm_file
except ImportError:
    index_ssm_file = None

try:
    from modules.parser_ssm_read import parse_ssm_blocks_from_text
except ImportError:
    parse_ssm_blocks_from_text = None


def cmd_compile(args):
    """Compile markdown to SSM."""
    input_path = Path(args.input)
    output_path = Path(args.output)
    
    if not input_path.exists():
        if logger:
            logger.error(
                "Input file not found",
                operation="cmd_compile",
                error_code="FILE_NOT_FOUND",
                root_cause=f"Input file does not exist: {input_path}",
                input_file=str(input_path)
            )
        return 1
    
    namespace = args.namespace or "default"
    
    # Compile
    exit_code, diagnostics = compile_document(
        str(input_path),
        str(output_path),
        diagnostics_path=args.diagnostics,
        namespace=namespace
    )
    
    if exit_code != 0:
        return exit_code
    
    # Write diagnostics if requested
    if args.diagnostics and diagnostics:
        diagnostics_path = Path(args.diagnostics)
        with open(diagnostics_path, 'w', encoding='utf-8') as f:
            json.dump(diagnostics, f, indent=2, default=str)
        if logger:
            logger.info(
                "Diagnostics written",
                operation="cmd_compile",
                diagnostics_file=str(diagnostics_path)
            )
    
    if logger:
        logger.info(
            "Compilation complete",
            operation="cmd_compile",
            output_file=str(output_path)
        )
    return 0


def cmd_validate(args):
    """Validate SSM file."""
    ssm_path = Path(args.input)
    
    if not ssm_path.exists():
        if logger:
            logger.error(
                "SSM file not found",
                operation="cmd_validate",
                error_code="FILE_NOT_FOUND",
                root_cause=f"SSM file does not exist: {ssm_path}",
                ssm_file=str(ssm_path)
            )
        return 1
    
    if not validate_ssm or not parse_ssm_blocks_from_text:
        if logger:
            logger.error(
                "Validation module not available",
                operation="cmd_validate",
                error_code="MODULE_NOT_AVAILABLE",
                root_cause="Validation or parser module not available"
            )
        return 1
    
    # Read and parse SSM
    ssm_text = ssm_path.read_text(encoding='utf-8')
    blocks = parse_ssm_blocks_from_text(ssm_text)
    
    # Validate
    errors = ErrorBus()
    symbols = SymbolTable()
    validation_errors = validate_ssm(blocks, symbols=symbols)
    
    # Report results
    error_count = len([e for e in validation_errors if e.severity == "error"])
    warning_count = len([e for e in validation_errors if e.severity == "warning"])
    
    if error_count > 0:
        if logger:
            logger.error(
                "Validation failed",
                operation="cmd_validate",
                error_code="VALIDATION_FAILED",
                root_cause=f"Validation found {error_count} errors and {warning_count} warnings",
                error_count=error_count,
                warning_count=warning_count,
                block_count=len(blocks)
            )
            for err in validation_errors:
                if err.severity == "error":
                    logger.error(
                        f"Validation error: {err.message}",
                        operation="cmd_validate",
                        error_code=err.code,
                        root_cause=err.message
                    )
        return 1
    elif warning_count > 0:
        if logger:
            logger.warn(
                "Validation passed with warnings",
                operation="cmd_validate",
                error_code="VALIDATION_WARNINGS",
                root_cause=f"Validation passed but found {warning_count} warnings",
                warning_count=warning_count,
                block_count=len(blocks)
            )
        return 0
    else:
        if logger:
            logger.info(
                "Validation passed",
                operation="cmd_validate",
                block_count=len(blocks)
            )
        return 0


def cmd_index(args):
    """Index SSM file for LLM/RAG."""
    ssm_path = Path(args.input)
    output_path = Path(args.output)
    
    if not ssm_path.exists():
        if logger:
            logger.error(
                "SSM file not found",
                operation="cmd_index",
                error_code="FILE_NOT_FOUND",
                root_cause=f"SSM file does not exist: {ssm_path}",
                ssm_file=str(ssm_path)
            )
        return 1
    
    if not index_ssm_file:
        if logger:
            logger.error(
                "Indexing module not available",
                operation="cmd_index",
                error_code="MODULE_NOT_AVAILABLE",
                root_cause="Indexing module not available"
            )
        return 1
    
    # Index
    chunk_count = index_ssm_file(ssm_path, output_path)
    
    if chunk_count == 0:
        if logger:
            logger.warn(
                "No chunks created",
                operation="cmd_index",
                error_code="NO_CHUNKS_CREATED",
                root_cause="SSM file may be empty or invalid",
                ssm_file=str(ssm_path)
            )
        return 1
    
    if logger:
        logger.info(
            "Indexing complete",
            operation="cmd_index",
            chunk_count=chunk_count,
            output_file=str(output_path)
        )
    return 0


def cmd_stats(args):
    """Show statistics for SSM file."""
    ssm_path = Path(args.input)
    
    if not ssm_path.exists():
        if logger:
            logger.error(
                "SSM file not found",
                operation="cmd_stats",
                error_code="FILE_NOT_FOUND",
                root_cause=f"SSM file does not exist: {ssm_path}",
                ssm_file=str(ssm_path)
            )
        return 1
    
    if not parse_ssm_blocks_from_text:
        if logger:
            logger.error(
                "SSM parser not available",
                operation="cmd_stats",
                error_code="MODULE_NOT_AVAILABLE",
                root_cause="SSM parser module not available"
            )
        return 1
    
    # Parse SSM
    ssm_text = ssm_path.read_text(encoding='utf-8')
    blocks = parse_ssm_blocks_from_text(ssm_text)
    
    # Count by type
    blocks_by_type = {}
    for block in blocks:
        block_type = getattr(block, 'block_type', 'unknown')
        blocks_by_type[block_type] = blocks_by_type.get(block_type, 0) + 1
    
    # Count chapters
    chapters = [b for b in blocks if getattr(b, 'block_type', '') == 'chapter-meta']
    # Count terms
    terms = [b for b in blocks if getattr(b, 'block_type', '') == 'term']
    # Count code patterns
    patterns = [b for b in blocks if getattr(b, 'block_type', '') == 'code-pattern']
    # Count relations
    relations = [b for b in blocks if getattr(b, 'block_type', '') == 'relation']
    
    # Log statistics
    if logger:
        logger.info(
            "SSM file statistics",
            operation="cmd_stats",
            file_name=ssm_path.name,
            total_blocks=len(blocks),
            blocks_by_type=blocks_by_type,
            chapters=len(chapters),
            terms=len(terms),
            code_patterns=len(patterns),
            relations=len(relations)
        )
    
    # If quality report requested
    if args.quality:
        # Try to load metrics from diagnostics if available
        diagnostics_path = ssm_path.with_suffix('.ssm.md.diagnostics.json')
        if diagnostics_path.exists():
            with open(diagnostics_path, 'r', encoding='utf-8') as f:
                diagnostics = json.load(f)
            
            if 'metrics' in diagnostics and diagnostics['metrics']:
                from runtime.metrics import CompileMetrics
                metrics = CompileMetrics(**diagnostics['metrics'])
                report = generate_quality_report(metrics)
                print_quality_report(report)
    
    return 0




def main():
    """Main CLI entry point."""
    parser = argparse.ArgumentParser(
        prog="biblec",
        description="SSM Compiler CLI - Compile, validate, index, and analyze SSM documents"
    )
    
    subparsers = parser.add_subparsers(dest='command', help='Command to execute')
    
    # Compile command
    compile_parser = subparsers.add_parser('compile', help='Compile markdown to SSM')
    compile_parser.add_argument('input', help='Input markdown file')
    compile_parser.add_argument('output', help='Output SSM file')
    compile_parser.add_argument('--namespace', help='Namespace for compilation')
    compile_parser.add_argument('--diagnostics', help='Path to diagnostics JSON file')
    compile_parser.set_defaults(func=cmd_compile)
    
    # Validate command
    validate_parser = subparsers.add_parser('validate', help='Validate SSM file')
    validate_parser.add_argument('input', help='Input SSM file')
    validate_parser.set_defaults(func=cmd_validate)
    
    # Index command
    index_parser = subparsers.add_parser('index', help='Index SSM file for LLM/RAG')
    index_parser.add_argument('input', help='Input SSM file')
    index_parser.add_argument('output', help='Output JSONL file')
    index_parser.set_defaults(func=cmd_index)
    
    # Stats command
    stats_parser = subparsers.add_parser('stats', help='Show statistics for SSM file')
    stats_parser.add_argument('input', help='Input SSM file')
    stats_parser.add_argument('--quality', action='store_true', help='Include quality report')
    stats_parser.set_defaults(func=cmd_stats)
    
    args = parser.parse_args()
    
    if not args.command:
        parser.print_help()
        return 1
    
    return args.func(args)


if __name__ == '__main__':
    sys.exit(main())

