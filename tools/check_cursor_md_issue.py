#!/usr/bin/env python3
"""Check why cursor.md only has a few chapters"""

import sys
from pathlib import Path

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

logger = get_logger("check_cursor_md_issue")

sys.path.insert(0, str(Path(__file__).parent))
from bible_pipeline import parse_ssm_blocks

ssm_path = Path("docs/reference/Programming Bibles/bibles/python_bible/dist/python_bible/python_bible.ssm.md")
blocks = parse_ssm_blocks(ssm_path)

logger.info(
    "Total blocks parsed",
    operation="parse_ssm_blocks",
    block_count=len(blocks),
    file_path=str(ssm_path)
)

# Count block types
block_types = {}
for b in blocks:
    block_types[b.block_type] = block_types.get(b.block_type, 0) + 1

logger.info(
    "Block type counts",
    operation="count_block_types",
    block_types=block_types
)

# Find all chapter-meta blocks
chapter_metas = [b for b in blocks if b.block_type == 'chapter-meta']
logger.info(
    "Chapter-meta blocks found",
    operation="find_chapter_metas",
    chapter_count=len(chapter_metas)
)

# Log individual chapters
for cm in chapter_metas:
    code = cm.meta.get("code", "NO-CODE")
    number = cm.meta.get("number", "NO-NUM")
    title = cm.meta.get("title", "NO-TITLE")
    logger.info(
        "Chapter found",
        operation="list_chapters",
        chapter_code=code,
        chapter_number=number,
        chapter_title=title[:50]
    )

# Check which chapters have which block types
chapters_with_blocks = {}
current_chapter = None
for b in blocks:
    if b.block_type == 'chapter-meta':
        current_chapter = b.meta.get("code")
        if current_chapter:
            chapters_with_blocks[current_chapter] = {
                "concepts": 0,
                "facts": 0,
                "antipatterns": 0,
                "patterns": 0,
                "qa": 0,
            }
    elif current_chapter and current_chapter in chapters_with_blocks:
        if b.block_type == "concept":
            chapters_with_blocks[current_chapter]["concepts"] += 1
        elif b.block_type == "fact":
            chapters_with_blocks[current_chapter]["facts"] += 1
        elif b.block_type in ("antipattern", "common-mistake"):
            chapters_with_blocks[current_chapter]["antipatterns"] += 1
        elif b.block_type in ("code-pattern", "pattern"):
            chapters_with_blocks[current_chapter]["patterns"] += 1
        elif b.block_type == "qa":
            chapters_with_blocks[current_chapter]["qa"] += 1

# Log chapters with block counts
for ch_code, counts in sorted(chapters_with_blocks.items()):
    total = sum(counts.values())
    logger.info(
        "Chapter block counts",
        operation="count_chapter_blocks",
        chapter_code=ch_code,
        total_blocks=total,
        concepts=counts['concepts'],
        facts=counts['facts'],
        antipatterns=counts['antipatterns'],
        patterns=counts['patterns'],
        qa=counts['qa']
    )


