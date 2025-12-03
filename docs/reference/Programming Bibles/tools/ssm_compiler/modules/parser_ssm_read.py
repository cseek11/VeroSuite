"""
SSM Parser (Read SSM files back into SSMBlock objects)

Used for validate, index, and stats commands.
"""
from __future__ import annotations

import re
from typing import List, Dict, Any, Optional
from .ast_nodes import SSMBlock


def parse_ssm_blocks_from_text(ssm_text: str) -> List[SSMBlock]:
    """
    Parse SSM markdown text into SSMBlock objects.
    
    Args:
        ssm_text: SSM markdown text
        
    Returns:
        List of SSMBlock objects
    """
    blocks: List[SSMBlock] = []
    lines = ssm_text.split('\n')
    
    i = 0
    while i < len(lines):
        line = lines[i].strip()
        
        # Check for block start
        if line.startswith(':::'):
            block_type_match = re.match(r'^::: (\w+)', line)
            if block_type_match:
                block_type = block_type_match.group(1)
                
                # Parse block
                block = _parse_block(lines, i, block_type)
                if block:
                    blocks.append(block)
                    # Skip to end of block
                    i = block.meta.get('_end_line', i) + 1
                    continue
        
        i += 1
    
    return blocks


def _parse_block(lines: List[str], start_idx: int, block_type: str) -> Optional[SSMBlock]:
    """
    Parse a single SSM block.
    
    Args:
        lines: All lines of SSM text
        start_idx: Starting line index
        block_type: Block type
        
    Returns:
        SSMBlock or None if parsing fails
    """
    meta: Dict[str, Any] = {}
    body_lines: List[str] = []
    
    i = start_idx + 1
    in_body = False
    
    while i < len(lines):
        line = lines[i]
        
        # Check for block end
        if line.strip() == ':::' and in_body:
            meta['_end_line'] = i
            break
        
        # Check for end of metadata (first :::)
        if line.strip() == ':::' and not in_body:
            in_body = True
            i += 1
            continue
        
        if not in_body:
            # Parse metadata line
            if ':' in line:
                key, value = line.split(':', 1)
                key = key.strip()
                value = value.strip()
                
                # Handle list values
                if value.startswith('[') and value.endswith(']'):
                    # Parse list
                    inner = value[1:-1].strip()
                    if inner:
                        meta[key] = [item.strip() for item in inner.split(',')]
                    else:
                        meta[key] = []
                else:
                    meta[key] = value
        else:
            # Body content
            body_lines.append(line)
        
        i += 1
    
    # Extract ID and chapter from meta
    block_id = meta.get('id', '')
    chapter = meta.get('chapter', '')
    
    # Create SSMBlock
    block = SSMBlock(
        block_type=block_type,
        meta=meta,
        body='\n'.join(body_lines),
        index=len(blocks) if 'blocks' in locals() else 0,
        id=block_id,
        chapter=chapter if chapter else None
    )
    
    return block

