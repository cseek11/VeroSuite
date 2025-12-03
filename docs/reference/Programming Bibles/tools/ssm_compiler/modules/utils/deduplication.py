"""
Deduplication utilities for SSM blocks.
"""
from __future__ import annotations

import hashlib
import sys
import importlib.util
from pathlib import Path
from typing import List, Dict, Any
from ..ast_nodes import SSMBlock

# Import structured logger
_project_root = Path(__file__).parent.parent.parent.parent.parent.parent.parent
if str(_project_root) not in sys.path:
    sys.path.insert(0, str(_project_root))

logger_util_path = _project_root / ".cursor" / "scripts" / "logger_util.py"
if logger_util_path.exists():
    spec = importlib.util.spec_from_file_location("logger_util", logger_util_path)
    logger_util = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(logger_util)
    get_logger = logger_util.get_logger
    logger = get_logger("deduplication")
else:
    logger = None


def compute_block_digest(block: SSMBlock) -> str:
    """
    Compute a digest (hash) for a block to detect duplicates.
    
    Args:
        block: SSM block
        
    Returns:
        SHA256 digest as hex string
    """
    # Create a normalized representation
    parts = [
        block.block_type,
        str(block.chapter or ""),
        str(block.meta.get("summary", "")),
        str(block.meta.get("name", "")),
        str(block.meta.get("definition", "")),
        str(block.meta.get("q", "")),
        str(block.meta.get("a", "")),
        normalize_body(block.body),
    ]
    
    content = "|".join(parts)
    return hashlib.sha256(content.encode('utf-8')).hexdigest()


def normalize_body(body: str) -> str:
    """
    Normalize body text for comparison (remove extra whitespace, normalize case).
    
    Args:
        body: Body text
        
    Returns:
        Normalized text
    """
    if not body:
        return ""
    
    # Remove extra whitespace
    import re
    normalized = re.sub(r'\s+', ' ', body.strip())
    
    # Remove markdown formatting for comparison
    normalized = re.sub(r'[#*_`]', '', normalized)
    
    return normalized.lower()


def deduplicate_blocks(blocks: List[SSMBlock], keep_first: bool = True) -> List[SSMBlock]:
    """
    Remove duplicate blocks based on content similarity.
    
    Args:
        blocks: List of SSM blocks
        keep_first: If True, keep first occurrence; if False, keep last
        
    Returns:
        Deduplicated list of blocks
    """
    seen_digests: Dict[str, int] = {}
    seen_content: Dict[str, int] = {}  # For exact content matches
    result: List[SSMBlock] = []
    duplicates_removed = 0
    
    for i, block in enumerate(blocks):
        # Skip blocks that are too generic or empty
        if not block.body and not block.meta:
            continue
        
        # Compute digest
        digest = compute_block_digest(block)
        
        # Check for exact duplicate
        if digest in seen_digests:
            duplicates_removed += 1
            if not keep_first:
                # Replace previous occurrence
                prev_idx = seen_digests[digest]
                result[prev_idx] = block
            continue
        
        # Check for similar content (same block type, similar body)
        content_key = f"{block.block_type}:{normalize_body(block.body)[:200]}"
        if content_key in seen_content:
            # Check if they're really duplicates (same chapter, similar meta)
            prev_idx = seen_content[content_key]
            prev_block = result[prev_idx]
            
            if (block.chapter == prev_block.chapter and
                block.block_type == prev_block.block_type and
                abs(len(block.body) - len(prev_block.body)) < 50):
                duplicates_removed += 1
                if not keep_first:
                    result[prev_idx] = block
                continue
        
        # Add to result
        seen_digests[digest] = len(result)
        seen_content[content_key] = len(result)
        result.append(block)
    
    if duplicates_removed > 0:
        if logger:
            logger.info(
                "Removed duplicate blocks",
                operation="deduplicate_blocks",
                duplicates_removed=duplicates_removed,
                remaining_blocks=len(result)
            )
    
    return result

