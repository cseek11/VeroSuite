#!/usr/bin/env python3
"""
Bible Build Automation

End-to-end pipeline for compiling and ingesting Bibles:
1. Source -> SSM (using V3 compiler)
2. SSM -> Cursor outputs (using bible_pipeline.py)

Usage:
  python tools/bible_build.py --language rego
  python tools/bible_build.py --language python
  python tools/bible_build.py --all
"""

from __future__ import annotations

import argparse
import logging
import subprocess
import sys
from pathlib import Path
from typing import Dict, List, Tuple, Any


# Configure logging for tool scripts
logging.basicConfig(
    level=logging.INFO,
    format="%(levelname)s: %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S"
)
logger = logging.getLogger(__name__)

# Bible configurations
BIBLE_CONFIGS: Dict[str, Dict[str, str]] = {
    "rego": {
        "source": "docs/reference/Rego_OPM_BIBLE/rego_opa_bible.md",
        "ssm": "knowledge/bibles/rego/compiled/REGO_OPA_Bible.ssm.md",
        "cursor_md": "knowledge/bibles/rego/cursor/REGO_OPA_Bible.cursor.md",
        "cursor_mdc": ".cursor/rules/rego_bible.mdc",
    },
    "python": {
        "source": "docs/reference/Programming Bibles/bibles/python_bible/dist/python_bible/python_bible_raw.md",
        "ssm": "docs/reference/Programming Bibles/bibles/python_bible/dist/python_bible/python_bible.ssm.md",
        "cursor_md": "docs/reference/Programming Bibles/bibles/python_bible/dist/python_bible/python_bible.cursor.md",
        "cursor_mdc": ".cursor/rules/python_bible.mdc",
    },
}


def compile_source_to_ssm(language: str, config: Dict[str, str]) -> bool:
    """Compile source Bible Markdown to SSM format using V3 compiler.

    Takes a raw Markdown Bible file and compiles it into Semantic Structural
    Markup (SSM) format using the V3 SSM compiler. Handles path resolution
    and compiler location detection.

    Args:
        language: Programming language identifier (e.g., "python", "rego").
        config: Dictionary containing source and SSM file paths for the language.

    Returns:
        True if compilation succeeded, False otherwise.

    Raises:
        subprocess.CalledProcessError: If the compiler execution fails.
    """
    source_path = Path(config["source"])
    ssm_path = Path(config["ssm"])
    
    if not source_path.exists():
        logger.error(f"Source file not found: {source_path}")
        return False
    
    logger.info(f"[compile] {language}: {source_path} -> {ssm_path}")
    
    # Run V3 compiler
    # Try new location first, fall back to old location
    compiler_path = Path("docs/reference/Programming Bibles/tools/ssm_compiler/main.py").resolve()
    if not compiler_path.exists():
        compiler_path = Path("docs/reference/Rego_OPM_BIBLE/opa_ssm_compiler/main.py").resolve()
    if not compiler_path.exists():
        logger.error(f"Compiler not found: {compiler_path}")
        return False
    
    ssm_path.parent.mkdir(parents=True, exist_ok=True)
    
    # Resolve paths to absolute
    source_path_abs = source_path.resolve()
    ssm_path_abs = ssm_path.resolve()
    
    try:
        result = subprocess.run(
            [
                sys.executable,
                str(compiler_path),
                str(source_path_abs),
                str(ssm_path_abs),
                "--v3"
            ],
            cwd=compiler_path.parent,
            capture_output=True,
            text=True,
            check=True,
            encoding="utf-8"
        )
        logger.info(f"[compile] Success: {ssm_path}")
        return True
    except subprocess.CalledProcessError as e:
        logger.error(f"[compile] Failed: {e}")
        if e.stdout:
            logger.error(f"  stdout: {e.stdout}")
        if e.stderr:
            logger.error(f"  stderr: {e.stderr}")
        return False


def ingest_ssm_to_cursor(language: str, config: Dict[str, str]) -> bool:
    """Ingest SSM Markdown into Cursor-friendly formats.

    Converts compiled SSM Markdown files into Cursor-readable formats:
    - Rich markdown documentation (`.cursor.md`)
    - Enforcement rules (`.mdc`)

    Uses the bible_pipeline.py script to perform the conversion.

    Args:
        language: Programming language identifier (e.g., "python", "rego").
        config: Dictionary containing SSM, cursor_md, and cursor_mdc file paths.

    Returns:
        True if ingestion succeeded, False otherwise.

    Raises:
        subprocess.CalledProcessError: If the pipeline script execution fails.
    """
    ssm_path = Path(config["ssm"])
    cursor_md = Path(config["cursor_md"])
    cursor_mdc = Path(config["cursor_mdc"])
    
    if not ssm_path.exists():
        logger.error(f"SSM file not found: {ssm_path}")
        logger.info(f"  Run compile step first: python tools/bible_build.py --language {language} --compile-only")
        return False
    
    logger.info(f"[ingest] {language}: {ssm_path} -> Cursor outputs")
    
    pipeline_path = Path("tools/bible_pipeline.py")
    if not pipeline_path.exists():
        logger.error(f"Pipeline script not found: {pipeline_path}")
        return False
    
    try:
        result = subprocess.run(
            [
                sys.executable,
                str(pipeline_path),
                "--language", language,
                "--ssm", str(ssm_path),
                "--out-md", str(cursor_md),
                "--out-mdc", str(cursor_mdc),
            ],
            capture_output=True,
            text=True,
            check=True,
            encoding="utf-8"
        )
        logger.info(f"[ingest] Success:")
        logger.info(f"  - Markdown: {cursor_md}")
        logger.info(f"  - Rules: {cursor_mdc}")
        return True
    except subprocess.CalledProcessError as e:
        logger.error(f"[ingest] Failed: {e}")
        if e.stdout:
            logger.error(f"  stdout: {e.stdout}")
        if e.stderr:
            logger.error(f"  stderr: {e.stderr}")
        return False


def build_bible(language: str, compile_only: bool = False, ingest_only: bool = False) -> bool:
    """Build a complete Bible through compilation and ingestion pipeline.

    Orchestrates the end-to-end Bible build process:
    1. Compile source Markdown → SSM format (optional if ingest_only=True)
    2. Ingest SSM → Cursor formats (optional if compile_only=True)

    Args:
        language: Programming language identifier (e.g., "python", "rego").
        compile_only: If True, only perform compilation step, skip ingestion.
        ingest_only: If True, only perform ingestion step, skip compilation.

    Returns:
        True if build succeeded, False otherwise.

    Raises:
        ValueError: If language is not in BIBLE_CONFIGS.
    """
    if language not in BIBLE_CONFIGS:
        logger.error(f"Unknown language: {language}")
        logger.info(f"  Available: {', '.join(BIBLE_CONFIGS.keys())}")
        return False
    
    config = BIBLE_CONFIGS[language]
    
    # Step 1: Compile source -> SSM
    if not ingest_only:
        if not compile_source_to_ssm(language, config):
            return False
        if compile_only:
            return True
    
    # Step 2: Ingest SSM -> Cursor
    if not compile_only:
        if not ingest_ssm_to_cursor(language, config):
            return False
    
    logger.info(f"[done] {language.capitalize()} Bible build complete")
    return True


def main() -> int:
    """Main entry point for Bible build automation.

    Parses command-line arguments and orchestrates Bible compilation and
    ingestion for one or more programming languages.

    Returns:
        0 on success, 1 on failure (invalid arguments or build errors).

    Raises:
        SystemExit: If command-line arguments are invalid.
    """
    parser = argparse.ArgumentParser(description="Bible build automation")
    parser.add_argument(
        "--language",
        choices=list(BIBLE_CONFIGS.keys()) + ["all"],
        help="Language to build (or 'all' for all languages)"
    )
    parser.add_argument(
        "--compile-only",
        action="store_true",
        help="Only compile source -> SSM, skip ingestion"
    )
    parser.add_argument(
        "--ingest-only",
        action="store_true",
        help="Only ingest SSM -> Cursor, skip compilation"
    )
    
    args = parser.parse_args()
    
    if not args.language:
        parser.print_help()
        return 1
    
    if args.language == "all":
        success = True
        for lang in BIBLE_CONFIGS.keys():
            if not build_bible(lang, args.compile_only, args.ingest_only):
                success = False
        return 0 if success else 1
    else:
        success = build_bible(args.language, args.compile_only, args.ingest_only)
        return 0 if success else 1


if __name__ == "__main__":
    exit(main())

