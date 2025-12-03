#!/usr/bin/env python3
"""
Unified SSM Compiler (Version 3)
--------------------------------
One compiler from raw Markdown → full SSM v3 enriched format.

Pipeline:
    1. Parse Markdown → AST
    2. Extract blocks (concepts, facts, terms, code, relations, diagrams)
    3. Emit SSM v2
    4. Apply Version-3 enrichments (20 passes)
    5. Canonical sort + validate
    6. Emit final SSM v3 Markdown
"""
from __future__ import annotations

import sys
import json
import importlib.util
from pathlib import Path
from typing import Optional, Dict, Tuple

# Import TypedDict definitions
_project_root_for_types = Path(__file__).parent.parent.parent.parent.parent
if str(_project_root_for_types) not in sys.path:
    sys.path.insert(0, str(_project_root_for_types))

try:
    from tools.bible_types import Diagnostics
except ImportError:
    # Fallback if bible_types not available
    Diagnostics = Dict[str, object]  # type: ignore

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
    logger = get_logger("ssm_compiler")
else:
    # Fallback if logger not available
    logger = None

# Add current directory to path for module imports
current_dir = Path(__file__).parent
if str(current_dir) not in sys.path:
    sys.path.insert(0, str(current_dir))

from modules.parser_markdown import parse_markdown_to_ast
from modules.extractor_terms import extract_terms_from_ast as extract_terms

# Solution 3: AST-Based Term Extraction
try:
    from modules.extractor_terms_v3 import extract_terms_from_ast_v3
    USE_V3_TERM_EXTRACTION = True
except ImportError:
    extract_terms_from_ast_v3 = None  # type: ignore
    USE_V3_TERM_EXTRACTION = False
from modules.extractor_code import extract_code_entries
from modules.extractor_relations import extract_relations_from_ast

# Solution 2: Semantic Relation Extraction
try:
    from modules.extractor_semantic_relations import SemanticRelationExtractor
except ImportError:
    SemanticRelationExtractor = None  # type: ignore
from modules.enrichment_v3.concept_graph import enrich_concept_graph
from modules.extractor_diagrams import extract_diagrams_from_ast
from modules.extractor_tables import extract_tables_from_ast
from modules.parser_ssm import ast_to_ssm_blocks, build_block_index

# Solution 4: Missing block type extractors (optional)
try:
    from modules.extractor_antipatterns import extract_antipatterns_from_ast
except ImportError:
    extract_antipatterns_from_ast = None  # type: ignore

try:
    from modules.extractor_rationale import RationaleExtractor
except ImportError:
    RationaleExtractor = None  # type: ignore

try:
    from modules.extractor_contrast import ContrastExtractor
except ImportError:
    ContrastExtractor = None  # type: ignore

# Solution 1: Two-Phase Processing Architecture
try:
    from modules.validation.semantic_validation import SemanticValidationPhase
except ImportError:
    SemanticValidationPhase = None  # type: ignore

# Runtime components (Phase 0)
try:
    from runtime.error_bus import ErrorBus
    from runtime.symbol_table import SymbolTable
except ImportError:
    ErrorBus = None  # type: ignore
    SymbolTable = None  # type: ignore

# Phase 7: Metrics
try:
    from runtime.metrics import MetricsCollector
except ImportError:
    MetricsCollector = None  # type: ignore

# Phase 9: Incremental Builds (Cache)
try:
    from runtime.cache import CompileCache, CompileState, ChapterHash, compute_content_hash, compute_chapter_hash
except ImportError:
    CompileCache = None  # type: ignore
    CompileState = None  # type: ignore
    ChapterHash = None  # type: ignore
    compute_content_hash = None  # type: ignore
    compute_chapter_hash = None  # type: ignore

# Version-3 enrichments
from modules.enrichment_v3.bidirectional_links import enrich_bidirectional_links
from modules.enrichment_v3.embedding_metadata import enrich_embedding_metadata
from modules.enrichment_v3.intuition import enrich_intuition
from modules.enrichment_v3.examples_smells import enrich_examples_and_smells
from modules.enrichment_v3.role_notes import enrich_role_notes
from modules.enrichment_v3.do_dont import enrich_do_dont
from modules.enrichment_v3.inference_rules import enrich_inference_rules
from modules.enrichment_v3.qa_generator import enrich_qa
from modules.enrichment_v3.constraints import enrich_constraints
from modules.enrichment_v3.chapter_graph import enrich_chapter_summaries_and_pathways
from modules.enrichment_v3.reasoning_chains import enrich_reasoning_chains
from modules.enrichment_v3.semantic_vector import enrich_semantic_and_vector
from modules.enrichment_v3.test_hints import enrich_test_cases
from modules.enrichment_v3.ordering import canonical_sort_blocks

from modules.utils.ids import ensure_ids_unique
from modules.utils.text import write_ssm


def compile_markdown_to_ssm_v3(
    input_text: str,
    errors: Optional["ErrorBus"] = None,
    symbols: Optional["SymbolTable"] = None,
    namespace: str = "default",  # NEW - Phase 5
    compiler_version: str = "3.0.0",  # NEW - Phase 5
    ssm_schema_version: str = "1.0.0",  # NEW - Phase 5
    source_file: Optional[str] = None,  # NEW - Solution 5
) -> Tuple[str, Diagnostics]:
    """
    Compile markdown to SSM v3 format.
    
    Pipeline:
        1. Parse Markdown → AST
        2. Extract blocks (concepts, facts, terms, code, relations, diagrams)
        3. Emit SSM v2
        4. Apply Version-3 enrichments (20 passes)
        5. Canonical sort + validate
        6. Emit final SSM v3 Markdown
    
    Args:
        input_text: Raw markdown text
        errors: ErrorBus instance (optional, creates new if None)
        symbols: SymbolTable instance (optional, creates new if None)
    
    Returns:
        Tuple of (ssm_output, diagnostics_dict)
        ssm_output: SSM v3 formatted markdown string
        diagnostics_dict: Diagnostics data
    """
    # Create runtime components if not provided
    if errors is None and ErrorBus is not None:
        errors = ErrorBus()
    if symbols is None and SymbolTable is not None:
        symbols = SymbolTable(default_namespace=namespace)
    
    # Phase 7: Start metrics collection
    metrics = None
    if MetricsCollector is not None:
        metrics = MetricsCollector(namespace=namespace)
        metrics.start()
    
    # Phase 9: Load cache for incremental builds
    cache = None
    if source_file and CompileCache is not None:
        try:
            from pathlib import Path
            cache = CompileCache(Path(source_file).parent / ".biblec.state.json")
            cache.load()
        except (FileNotFoundError, json.JSONDecodeError, KeyError, ValueError) as e:
            # Cache loading is optional, but log the error for debugging
            if errors is not None:
                errors.warning(
                    code="CACHE_LOAD_FAILED",
                    message=f"Failed to load compilation cache: {type(e).__name__}: {e}",
                    line=0,
                    column=0,
                    context="Cache loading is optional, compilation will continue without cache"
                )
        except Exception as e:
            # Unexpected errors during cache loading
            if errors is not None:
                errors.error(
                    code="CACHE_LOAD_UNEXPECTED",
                    message=f"Unexpected error loading cache: {type(e).__name__}: {e}",
                    line=0,
                    column=0,
                    context="Cache loading failed with unexpected error"
                )
            if logger:
                logger.error(
                    "Unexpected error loading cache",
                    operation="load_cache",
                    error_code="CACHE_LOAD_UNEXPECTED",
                    root_cause=str(e),
                    exc_info=True
                )
    
    # Step 1: Parse the Markdown into an AST
    if logger:
        logger.progress("Parsing markdown to AST", operation="parse_markdown", stage="parsing")
    ast = parse_markdown_to_ast(input_text, errors=errors, symbols=symbols)
    chapter_count = len(ast.chapters) if hasattr(ast, 'chapters') else 0
    if logger:
        logger.progress(
            "AST parsed",
            operation="parse_markdown",
            stage="parsing_complete",
            current=chapter_count,
            total=chapter_count if chapter_count > 0 else None
        )
    
    # Solution 1: Two-Phase Processing - Semantic Validation Phase
    # Validate and fix AST structure before extraction
    if SemanticValidationPhase is not None:
        validation_phase = SemanticValidationPhase(errors=errors)
        ast = validation_phase.execute(ast)
        # Validate that fixes were applied correctly
        if not validation_phase.validate(ast):
            if errors:
                errors.warning(
                    code="VALIDATION_WARNING",
                    message="AST validation found issues but fixes were applied",
                    line=0,
                    column=0,
                    context="Semantic validation phase"
                )
    
    # Step 2: Extract terms, code, relations, diagrams
    if logger:
        logger.progress("Extracting terms", operation="extract_blocks", stage="terms")
    # Solution 3: Use AST-based term extraction if available
    if USE_V3_TERM_EXTRACTION and extract_terms_from_ast_v3 is not None:
        terms = extract_terms_from_ast_v3(ast, errors=errors, symbols=symbols)
    else:
        terms = extract_terms(ast)
    if logger:
        logger.progress(
            "Extracted terms",
            operation="extract_blocks",
            stage="terms_complete",
            current=len(terms)
        )
    
    if logger:
        logger.progress("Extracting code blocks", operation="extract_blocks", stage="code")
    codes = extract_code_entries(ast)
    if logger:
        logger.progress(
            "Extracted code blocks",
            operation="extract_blocks",
            stage="code_complete",
            current=len(codes)
        )
    
    if logger:
        logger.progress("Extracting relations", operation="extract_blocks", stage="relations")
    rels = extract_relations_from_ast(ast, errors=errors, symbols=symbols, namespace=namespace)
    if logger:
        logger.progress(
            "Extracted relations",
            operation="extract_blocks",
            stage="relations_complete",
            current=len(rels)
        )
    
    if logger:
        logger.progress("Extracting diagrams", operation="extract_blocks", stage="diagrams")
    diags = extract_diagrams_from_ast(ast, errors=errors, symbols=symbols)
    if logger:
        logger.progress(
            "Extracted diagrams",
            operation="extract_blocks",
            stage="diagrams_complete",
            current=len(diags)
        )
    
    if logger:
        logger.progress("Extracting tables", operation="extract_blocks", stage="tables")
    tables = extract_tables_from_ast(ast, errors=errors, symbols=symbols)
    if logger:
        logger.progress(
            "Extracted tables",
            operation="extract_blocks",
            stage="tables_complete",
            current=len(tables)
        )
    
    # Solution 6: Enrich diagrams with metadata and chapter attachment
    try:
        from modules.extractor_diagrams_enhanced import DiagramEnricher
        enricher = DiagramEnricher()
        diags = enricher.enrich_diagrams(diags, ast)
    except ImportError:
        pass  # Diagram enricher not available
    
    # Step 3: Convert AST → SSM v3 blocks (with part-meta and section-meta)
    if logger:
        logger.progress("Converting AST to SSM blocks", operation="convert_ast", stage="conversion")
    blocks = ast_to_ssm_blocks(
        ast, terms, codes, rels, diags, tables=tables,
        errors=errors, symbols=symbols,
        namespace=namespace,
        compiler_version=compiler_version,
        ssm_schema_version=ssm_schema_version
    )
    if logger:
        logger.progress(
            "Created SSM blocks",
            operation="convert_ast",
            stage="conversion_complete",
            current=len(blocks)
        )
    
    # Build index
    if logger:
        logger.progress("Building block index", operation="build_index", stage="indexing")
    idx = build_block_index(blocks)
    if logger:
        logger.progress(
            "Index built",
            operation="build_index",
            stage="indexing_complete",
            current=len(idx)
        )
    
    # Solution 2: Extract semantic relations
    if SemanticRelationExtractor is not None:
        semantic_extractor = SemanticRelationExtractor(errors=errors, symbols=symbols)
        semantic_relations = semantic_extractor.extract(ast, existing_blocks=blocks, namespace=namespace)
        
        # Convert semantic relations to SSM relation blocks
        # FIX VALIDATION: Use standard field names (from, to, type) for consistency
        from modules.ast_nodes import SSMBlock
        from modules.utils.hashing import sha1_id
        for rel in semantic_relations:
            # Skip relations with missing required fields
            if not rel.source_id or not rel.target_id or not rel.relation_type:
                if errors:
                    errors.warning(
                        code="WARN_INCOMPLETE_SEMANTIC_RELATION",
                        message=f"Skipping semantic relation with missing fields: source={rel.source_id}, target={rel.target_id}, type={rel.relation_type}",
                        line=rel.line_no if hasattr(rel, 'line_no') else 0,
                        column=0,
                        context=rel.evidence[:100] if rel.evidence else ""
                    )
                continue
            
            bid = sha1_id("REL", f"{rel.source_id}__{rel.relation_type}__{rel.target_id}")
            relation_block = SSMBlock(
                block_type="relation",
                meta={
                    "id": bid,
                    "from": rel.source_id,  # FIX: Use standard field name
                    "to": rel.target_id,    # FIX: Use standard field name
                    "type": rel.relation_type,  # FIX: Use standard field name
                    "confidence": rel.confidence or 0.8,
                    "evidence": rel.evidence or "",
                    "context": rel.context or "",
                    "from_namespace": rel.from_namespace or namespace,
                    "to_namespace": rel.to_namespace or namespace,
                    # Keep additional fields for backward compatibility
                    "source_id": rel.source_id,
                    "target_id": rel.target_id,
                    "relation_type": rel.relation_type,
                },
                body=rel.evidence or rel.context or "",
                index=len(blocks),
                id=bid,  # FIX: Ensure ID is set
                chapter=None,
            )
            blocks.append(relation_block)
    
    # Solution 4: Extract missing block types (antipattern, rationale, contrast)
    from modules.ast_nodes import SSMBlock
    
    # Extract antipatterns
    if extract_antipatterns_from_ast is not None:
        antipatterns = extract_antipatterns_from_ast(ast, errors=errors, symbols=symbols)
        for ap in antipatterns:
            # Ensure problem and solution are valid (not truncated)
            problem = ap.problem.strip() if ap.problem else ""
            solution = ap.solution.strip() if ap.solution else ""
            
            # Skip if problem is too short (likely truncated)
            if len(problem) < 10:
                continue
            
            # Skip if solution is just a single character
            if solution and len(solution) <= 2:
                solution = ""  # Clear invalid solution
            
            # Ensure chapter is set
            chapter = ap.chapter_code or "GLOBAL"
            
            # Build body with problem and solution together
            body_parts = [problem]
            if solution and len(solution) > 10:
                body_parts.append(f"\n\nSolution: {solution}")
            if ap.rationale:
                body_parts.append(f"\n\nRationale: {ap.rationale}")
            
            antipattern_block = SSMBlock(
                block_type="antipattern",
                meta={
                    "id": f"antipattern-{ap.line_no}-{len(blocks)}",
                    "problem": problem,
                    "solution": solution,
                    "rationale": ap.rationale or "",
                    "severity": ap.severity,
                    "chapter": chapter,
                },
                body="".join(body_parts),
                index=len(blocks),
                id=f"antipattern-{ap.line_no}-{len(blocks)}",
                chapter=chapter,
            )
            blocks.append(antipattern_block)
    
    # Extract rationales
    if RationaleExtractor is not None:
        rationale_extractor = RationaleExtractor(errors=errors, symbols=symbols)
        rationales = rationale_extractor.extract(ast)
        for rat in rationales:
            rationale_block = SSMBlock(
                block_type="rationale",
                meta={
                    "id": f"rationale-{rat.line_no}-{len(blocks)}",
                    "explanation": rat.explanation,
                    "related_to": rat.related_to or "",
                    "chapter": rat.chapter_code or "",
                },
                body=rat.explanation,
                index=len(blocks)
            )
            blocks.append(rationale_block)
    
    # Extract contrasts
    if ContrastExtractor is not None:
        contrast_extractor = ContrastExtractor(errors=errors, symbols=symbols)
        contrasts = contrast_extractor.extract(ast)
        for cont in contrasts:
            contrast_block = SSMBlock(
                block_type="contrast",
                meta={
                    "id": f"contrast-{cont.line_no}-{len(blocks)}",
                    "concept_a": cont.concept_a,
                    "concept_b": cont.concept_b,
                    "differences": cont.differences,
                    "chapter": cont.chapter_code or "",
                },
                body=f"{cont.concept_a} vs {cont.concept_b}\n\n{cont.differences}",
                index=len(blocks)
            )
            blocks.append(contrast_block)
    
    # Step 4: Apply all 20 v3 enrichment passes
    if logger:
        logger.progress("Applying enrichments", operation="apply_enrichments", stage="enrichment")
    
    enrichment_stages = [
        ("bidirectional_links", enrich_bidirectional_links),
        ("embedding_metadata", enrich_embedding_metadata),
        ("intuition", enrich_intuition),
        ("examples_and_smells", enrich_examples_and_smells),
        ("role_notes", enrich_role_notes),
        ("do_dont", enrich_do_dont),
        ("inference_rules", enrich_inference_rules),
        ("qa", enrich_qa),
        ("constraints", enrich_constraints),
        ("chapter_summaries_and_pathways", enrich_chapter_summaries_and_pathways),
        ("reasoning_chains", enrich_reasoning_chains),
        ("semantic_and_vector", enrich_semantic_and_vector),
        ("test_cases", enrich_test_cases),
    ]
    
    for stage_name, enrich_func in enrichment_stages:
        if logger:
            logger.progress(
                f"Applying {stage_name} enrichment",
                operation="apply_enrichments",
                stage=stage_name
            )
        enrich_func(blocks, idx)
    
    # Phase 3: Concept graph enrichment (multi-hop relationships)
    enrich_concept_graph(blocks, idx)
    
    # Solution 5: Add V3 SSM fields to all blocks
    try:
        from modules.v3_metadata import enrich_blocks_with_v3_metadata
        enrich_blocks_with_v3_metadata(
            blocks,
            ast=ast,
            symbols=symbols,
            source_file=source_file
        )
    except ImportError:
        pass  # V3 metadata module not available
    
    # Post-processing: Fix chapter attribution for cross-chapter references
    if logger:
        logger.progress("Fixing chapter attribution", operation="post_process", stage="chapter_attribution")
    try:
        from modules.enrichment_v3.chapter_attribution import fix_chapter_attribution
        fix_chapter_attribution(blocks, idx)
    except ImportError:
        if logger:
            logger.warn(
                "Chapter attribution module not available",
                operation="post_process",
                error_code="MODULE_NOT_AVAILABLE",
                root_cause="ImportError: modules.enrichment_v3.chapter_attribution not found"
            )
    
    # Post-processing: Enterprise-grade cleanup and additions
    if logger:
        logger.progress("Post-processing blocks", operation="post_process", stage="cleanup")
    try:
        from modules.enrichment_v3.post_process import post_process_blocks
        post_process_blocks(blocks, idx, metrics=metrics)
        # Rebuild index after post-processing
        idx = build_block_index(blocks)
        if logger:
            logger.progress(
                "Post-processing complete",
                operation="post_process",
                stage="cleanup_complete",
                current=len(blocks)
            )
    except ImportError:
        if logger:
            logger.warn(
                "Post-processing module not available",
                operation="post_process",
                error_code="MODULE_NOT_AVAILABLE",
                root_cause="ImportError: modules.enrichment_v3.post_process not found"
            )
    
    # Step 5: Deduplication (before sorting)
    if logger:
        logger.progress("Deduplicating blocks", operation="deduplicate", stage="deduplication")
    try:
        from modules.utils.deduplication import deduplicate_blocks
        blocks = deduplicate_blocks(blocks, keep_first=True)
        if logger:
            logger.progress(
                "After deduplication",
                operation="deduplicate",
                stage="deduplication_complete",
                current=len(blocks)
            )
    except ImportError:
        if logger:
            logger.warn(
                "Deduplication module not available",
                operation="deduplicate",
                error_code="MODULE_NOT_AVAILABLE",
                root_cause="ImportError: modules.utils.deduplication not found"
            )
    
    # Step 6: Canonical sort and validation
    if logger:
        logger.progress("Sorting blocks canonically", operation="sort_blocks", stage="sorting")
    blocks = canonical_sort_blocks(blocks)
    
    # FIX VALIDATION: Ensure all blocks have IDs before validation
    if logger:
        logger.progress("Ensuring all blocks have IDs", operation="ensure_ids", stage="id_generation")
    from modules.utils.hashing import sha1_id
    for block in blocks:
        if not block.id:
            # Generate ID from block content if missing
            block.id = sha1_id(
                block.block_type.upper(),
                f"{block.body[:100]}:{block.index}:{block.chapter or ''}"
            )
            # Also set in meta if not present
            if "id" not in block.meta:
                block.meta["id"] = block.id
    
    if logger:
        logger.progress("Ensuring unique IDs", operation="ensure_ids", stage="id_uniqueness")
    ensure_ids_unique(blocks)
    
    # Phase 5: Validate SSM blocks
    try:
        from validation.validate_ssm import validate_ssm
        validation_errors = validate_ssm(blocks, symbols=symbols)
        if validation_errors and errors:
            for val_err in validation_errors:
                if val_err.severity == "error":
                    errors.error(
                        code=val_err.code,
                        message=val_err.message,
                        line=0,
                        column=0,
                        context=f"Block {val_err.block_id or 'unknown'}"
                    )
                else:
                    errors.warning(
                        code=val_err.code,
                        message=val_err.message,
                        line=0,
                        column=0,
                        context=f"Block {val_err.block_id or 'unknown'}"
                    )
    except ImportError:
        pass  # Validation module not available
    
    # Step 6: Emit final SSM v3 as markdown
    if logger:
        logger.progress("Writing SSM output", operation="write_ssm", stage="output_generation")
    ssm_output = write_ssm(blocks)
    if logger:
        logger.progress(
            "SSM output generated",
            operation="write_ssm",
            stage="output_complete",
            current=len(ssm_output)
        )
    
    # Phase 7: Record metrics
    if metrics:
        metrics.record_blocks(blocks)
        metrics.record_errors(errors)
        metrics.record_symbols(symbols)
        try:
            from validation.validate_ssm import validate_ssm
            validation_errors = validate_ssm(blocks, symbols=symbols)
            metrics.record_validation(validation_errors)
        except ImportError:
            pass
        metrics.stop()
    
    # Build diagnostics if runtime components are available
    if errors and symbols:
        try:
            from validation.validate_ssm import validate_ssm
            validation_errors = validate_ssm(blocks, symbols=symbols)
            validation_error_count = len([e for e in validation_errors if e.severity == "error"])
            validation_warning_count = len([e for e in validation_errors if e.severity == "warning"])
        except ImportError:
            validation_errors = []
            validation_error_count = 0
            validation_warning_count = 0
        
        diagnostics = {
            "errors": errors.to_dict(),
            "warnings": [e.__dict__ for e in errors.warnings()],
            "symbols": symbols.to_dict(),
            "validation_errors": [e.__dict__ for e in validation_errors if e.severity == "error"] if 'validation_errors' in locals() else [],
            "validation_warnings": [e.__dict__ for e in validation_errors if e.severity == "warning"] if 'validation_errors' in locals() else [],
            "metrics": metrics.get_metrics().to_dict() if metrics else None,
            "summary": {
                "total_blocks": len(blocks),
                "error_count": len(errors.errors()),
                "warning_count": len(errors.warnings()),
                "validation_error_count": validation_error_count,
                "validation_warning_count": validation_warning_count,
                "symbol_stats": symbols.stats(),
                "compiler_version": compiler_version,
                "ssm_schema_version": ssm_schema_version,
                "namespace": namespace,
                "quality_score": metrics.get_summary().get("quality_score") if metrics else None
            }
        }
    
    # Phase 9: Save cache for incremental builds (if cache is enabled)
    if cache and source_file:
        try:
            from datetime import datetime
            
            # Compute source file hash
            source_hash = compute_content_hash(input_text)
            
            # Compute chapter hashes from AST
            chapter_hashes = {}
            input_lines = input_text.splitlines()
            
            # Get chapter ranges from AST
            if hasattr(ast, 'chapters') and ast.chapters:
                from modules.parser_ssm import compute_chapter_ranges
                chapter_ranges = compute_chapter_ranges(ast)
                
                for start_line, end_line, chapter_code in chapter_ranges:
                    # Extract chapter content (1-indexed to 0-indexed conversion)
                    chapter_lines = input_lines[start_line - 1:end_line - 1] if start_line > 0 else []
                    
                    # Count blocks for this chapter
                    chapter_block_count = sum(1 for block in blocks if block.chapter == chapter_code)
                    
                    # Compute chapter hash
                    chapter_content = "\n".join(chapter_lines)
                    chapter_content_hash = compute_content_hash(chapter_content)
                    
                    # Create ChapterHash
                    chapter_hash = ChapterHash(
                        chapter_code=chapter_code,
                        content_hash=chapter_content_hash,
                        line_range=(start_line, end_line),
                        block_count=chapter_block_count,
                        last_modified=datetime.now().isoformat()
                    )
                    chapter_hashes[chapter_code] = chapter_hash
            
            # Extract cached block IDs (all block IDs can be cached)
            cached_blocks = {block.id for block in blocks if block.id}
            
            # Build CompileState
            compile_state = CompileState(
                source_file=str(Path(source_file).name),  # Store just filename for portability
                source_hash=source_hash,
                compiler_version=compiler_version,
                ssm_schema_version=ssm_schema_version,
                namespace=namespace,
                chapter_hashes=chapter_hashes,
                total_blocks=len(blocks),
                last_compile_time=datetime.now().isoformat(),
                cached_blocks=cached_blocks
            )
            
            # Save cache
            cache.save(compile_state)
            if logger:
                logger.info(
                    "Cache saved",
                    operation="save_cache",
                    cache_file=str(cache.cache_file)
                )
            
        except (IOError, OSError, PermissionError) as e:
            # Cache saving is optional, but log the error for debugging
            if errors is not None:
                errors.warning(
                    code="CACHE_SAVE_FAILED",
                    message=f"Failed to save compilation cache: {type(e).__name__}: {e}",
                    line=0,
                    column=0,
                    context="Cache saving is optional, compilation completed successfully"
                )
            if logger:
                logger.warn(
                    "Failed to save cache",
                    operation="save_cache",
                    error_code="CACHE_SAVE_FAILED",
                    root_cause=str(e)
                )
        except Exception as e:
            # Unexpected errors during cache saving
            if errors is not None:
                errors.error(
                    code="CACHE_SAVE_UNEXPECTED",
                    message=f"Unexpected error saving cache: {type(e).__name__}: {e}",
                    line=0,
                    column=0,
                    context="Cache saving failed with unexpected error"
                )
            if logger:
                logger.error(
                    "Unexpected error saving cache",
                    operation="save_cache",
                    error_code="CACHE_SAVE_UNEXPECTED",
                    root_cause=str(e),
                    exc_info=True
                )
    
    # Return SSM output and diagnostics
    if errors and symbols:
        return ssm_output, diagnostics
    else:
        return ssm_output, {}


def compile_document(
    input_path: str,
    output_path: str,
    diagnostics_path: Optional[str] = None,
    namespace: str = "default"
) -> Tuple[int, Optional[Diagnostics]]:
    """
    Compile a markdown document to SSM v3.
    
    Args:
        input_path: Path to input markdown file
        output_path: Path to output SSM file
        diagnostics_path: Optional path for diagnostics JSON (default: output_path + ".diagnostics.json")
    
    Returns:
        Tuple of (exit_code, diagnostics_dict)
        exit_code: 0 on success, 1 on errors
        diagnostics_dict: Diagnostics data if runtime components available
    """
    errors = ErrorBus() if ErrorBus else None
    symbols = SymbolTable(default_namespace=namespace) if SymbolTable else None
    
    # Read input
    with open(input_path, "r", encoding="utf-8") as f:
        md_text = f.read()
    
    # Compile (pass source file path for V3 metadata)
    ssm_output, diagnostics = compile_markdown_to_ssm_v3(
        md_text,
        errors=errors,
        symbols=symbols,
        namespace=namespace,
        source_file=input_path  # Pass source file for V3 metadata
    )
    
    # Write SSM output
    with open(output_path, "w", encoding="utf-8") as f:
        f.write(ssm_output)
    
    # Write diagnostics
    if diagnostics:
        
        if diagnostics_path is None:
            diagnostics_path = output_path + ".diagnostics.json"
        
        with open(diagnostics_path, "w", encoding="utf-8") as f:
            json.dump(diagnostics, f, indent=2, default=str)
        
        # Log summary
        summary = diagnostics.get("summary", {})
        if logger:
            logger.info(
                "Compilation complete",
                operation="compile_document",
                namespace=namespace,
                total_blocks=summary.get('total_blocks', 0),
                error_count=summary.get('error_count', 0),
                warning_count=summary.get('warning_count', 0)
            )
        
        if errors and errors.has_errors():
            if logger:
                for err in errors.errors():
                    logger.error(
                        "Compilation error",
                        operation="compile_document",
                        error_code=err.code,
                        root_cause=err.message,
                        line=err.line,
                        column=err.column
                    )
            return 1, diagnostics
    
    return 0, diagnostics


if __name__ == "__main__":
    if len(sys.argv) < 3:
        if logger:
            logger.error(
                "Invalid usage",
                operation="main",
                error_code="INVALID_USAGE",
                root_cause="Missing required arguments",
                usage="python compiler.py input.md output.ssm.md [diagnostics.json] [--namespace <name>]"
            )
        sys.exit(1)
    
    input_path = sys.argv[1]
    output_path = sys.argv[2]
    diagnostics_path = None
    namespace = "default"
    
    # Parse optional arguments
    i = 3
    while i < len(sys.argv):
        if sys.argv[i] == "--namespace":
            if i + 1 < len(sys.argv):
                namespace = sys.argv[i + 1]
                i += 2
            else:
                if logger:
                    logger.error(
                        "Missing namespace argument",
                        operation="main",
                        error_code="MISSING_ARGUMENT",
                        root_cause="--namespace requires an argument"
                    )
                sys.exit(1)
        elif diagnostics_path is None:
            diagnostics_path = sys.argv[i]
            i += 1
        else:
            if logger:
                logger.error(
                    "Unknown argument",
                    operation="main",
                    error_code="UNKNOWN_ARGUMENT",
                    root_cause=f"Unknown argument: {sys.argv[i]}"
                )
            sys.exit(1)
    
    if not Path(input_path).exists():
        if logger:
            logger.error(
                "Input file not found",
                operation="main",
                error_code="FILE_NOT_FOUND",
                root_cause=f"Input file does not exist: {input_path}",
                file_path=input_path
            )
        sys.exit(1)
    
    exit_code, diagnostics = compile_document(input_path, output_path, diagnostics_path, namespace=namespace)
    
    if exit_code == 0:
        if logger:
            logger.info(
                "Compilation successful",
                operation="main",
                output_file=str(output_path)
            )
    else:
        if logger:
            logger.error(
                "Compilation completed with errors",
                operation="main",
                error_code="COMPILATION_ERRORS",
                root_cause="Compilation completed but errors were found",
                output_file=str(output_path)
            )
    
    sys.exit(exit_code)
