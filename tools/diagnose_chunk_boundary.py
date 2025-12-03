#!/usr/bin/env python3
"""Diagnose why only 6 chapters are being parsed from CHUNK_BOUNDARY markers"""

import re
from pathlib import Path
import sys

# Import structured logger
_project_root = Path(__file__).parent.parent
if str(_project_root) not in sys.path:
    sys.path.insert(0, str(_project_root))

import importlib.util
logger_util_path = _project_root / ".cursor" / "scripts" / "logger_util.py"
spec = importlib.util.spec_from_file_location("logger_util", logger_util_path)
logger_util = importlib.util.module_from_spec(spec)
spec.loader.exec_module(logger_util)
get_logger = logger_util.get_logger

logger = get_logger("diagnose_chunk_boundary")

sys.path.insert(0, str(Path(__file__).parent))
from bible_pipeline import parse_ssm_blocks

ssm_path = Path("docs/reference/Programming Bibles/bibles/python_bible/dist/python_bible/python_bible.ssm.md")
blocks = parse_ssm_blocks(ssm_path)

# Find all concept blocks with CHUNK_BOUNDARY
chunk_concepts = [b for b in blocks if b.block_type == 'concept' and 'CHUNK_BOUNDARY' in b.body]
logger.info(
    "Concept blocks with CHUNK_BOUNDARY found",
    operation="find_chunk_concepts",
    chunk_concept_count=len(chunk_concepts)
)

# Check regex pattern
pattern = re.compile(r'<!-- SSM:CHUNK_BOUNDARY id="([^"]+)" -->\s*(.+)')
matches = []
for b in chunk_concepts:
    m = pattern.search(b.body)
    if m:
        matches.append((m.group(1), m.group(2).strip()))
    else:
        logger.warn(
            "No regex match for CHUNK_BOUNDARY",
            operation="check_regex_pattern",
            error_code="NO_REGEX_MATCH",
            root_cause="Regex pattern did not match block body",
            body_preview=b.body[:150]
        )

logger.info(
    "Regex matches completed",
    operation="check_regex_pattern",
    matches=len(matches),
    total_chunk_concepts=len(chunk_concepts)
)

# Find all chapter-meta blocks
chapter_metas = [b for b in blocks if b.block_type == 'chapter-meta']
logger.info(
    "Chapter-meta blocks created",
    operation="find_chapter_metas",
    chapter_count=len(chapter_metas)
)

# Log individual chapters
for cm in chapter_metas:
    logger.info(
        "Chapter found",
        operation="list_chapters",
        chapter_code=cm.meta.get('code'),
        chapter_title=cm.meta.get('title')
    )

# Check if there are standalone CHUNK_BOUNDARY markers
text = ssm_path.read_text(encoding="utf-8")
standalone = re.findall(r'<!-- SSM:CHUNK_BOUNDARY id="([^"]+)" -->', text)
logger.info(
    "CHUNK_BOUNDARY markers found",
    operation="count_chunk_boundaries",
    total_markers=len(standalone),
    unique_ids=len(set(standalone)),
    file_path=str(ssm_path)
)


