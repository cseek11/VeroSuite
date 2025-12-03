"""
SSM Validation (Phase 5)

Validates SSM content for:
- ID uniqueness
- Required fields per block type
- Reference resolution
- Schema compliance
"""
from __future__ import annotations

from typing import List, Dict, Any, Optional, Set
from dataclasses import dataclass
import re
import sys
from pathlib import Path

# Add parent directory to path for imports
current_dir = Path(__file__).parent.parent
if str(current_dir) not in sys.path:
    sys.path.insert(0, str(current_dir))

from modules.ast_nodes import SSMBlock


@dataclass
class ValidationError:
    """SSM validation error."""
    code: str
    message: str
    block_id: Optional[str] = None
    block_type: Optional[str] = None
    field: Optional[str] = None
    severity: str = "error"  # error | warning


def validate_ssm(blocks: List[SSMBlock], symbols: Optional[Any] = None) -> List[ValidationError]:
    """
    Validate SSM blocks.
    
    Checks:
    - ID uniqueness
    - Required fields per block type
    - Reference resolution (relation.to, relation.from, chapter-code)
    - Schema compliance
    
    Args:
        blocks: List of SSM blocks
        symbols: SymbolTable instance (optional)
    
    Returns:
        List of ValidationError objects
    """
    errors: List[ValidationError] = []
    
    # Build block index
    by_id: Dict[str, SSMBlock] = {}
    by_type: Dict[str, List[SSMBlock]] = {}
    chapter_codes: Set[str] = set()
    
    for block in blocks:
        if block.id:
            if block.id in by_id:
                errors.append(ValidationError(
                    code="VAL_DUPLICATE_ID",
                    message=f"Duplicate block ID: {block.id}",
                    block_id=block.id,
                    block_type=block.block_type,
                    severity="error"
                ))
            else:
                by_id[block.id] = block
        
        by_type.setdefault(block.block_type, []).append(block)
        
        # Collect chapter codes
        if block.block_type == "chapter-meta":
            ch_code = block.meta.get("code", "")
            if ch_code:
                chapter_codes.add(ch_code)
    
    # Validate each block
    for block in blocks:
        block_errors = validate_block(block, by_id, chapter_codes, symbols)
        errors.extend(block_errors)
    
    return errors


def validate_block(
    block: SSMBlock,
    by_id: Dict[str, SSMBlock],
    chapter_codes: Set[str],
    symbols: Optional[Any] = None
) -> List[ValidationError]:
    """
    Validate a single SSM block.
    
    Args:
        block: SSM block to validate
        by_id: Index of blocks by ID
        chapter_codes: Set of valid chapter codes
        symbols: SymbolTable instance (optional)
    
    Returns:
        List of ValidationError objects
    """
    errors: List[ValidationError] = []
    
    # Check required ID
    if not block.id:
        errors.append(ValidationError(
            code="VAL_MISSING_ID",
            message="Block missing required 'id' field",
            block_type=block.block_type,
            severity="error"
        ))
    
    # Validate block type-specific requirements
    if block.block_type == "chapter-meta":
        errors.extend(validate_chapter_meta(block, chapter_codes))
    elif block.block_type == "relation":
        errors.extend(validate_relation(block, chapter_codes, by_id))
    elif block.block_type == "term":
        errors.extend(validate_term(block))
    elif block.block_type == "code-pattern":
        errors.extend(validate_code_pattern(block))
    elif block.block_type == "table":
        errors.extend(validate_table(block))
    
    return errors


def validate_chapter_meta(block: SSMBlock, chapter_codes: Set[str]) -> List[ValidationError]:
    """Validate chapter-meta block."""
    errors: List[ValidationError] = []
    
    required_fields = ["code", "number", "title"]
    for field in required_fields:
        if field not in block.meta:
            errors.append(ValidationError(
                code="VAL_MISSING_FIELD",
                message=f"chapter-meta missing required field: {field}",
                block_id=block.id,
                block_type=block.block_type,
                field=field,
                severity="error"
            ))
    
    # Validate code format
    code = block.meta.get("code", "")
    if code and not re.match(r"^CH-\d{2}$", code):
        errors.append(ValidationError(
            code="VAL_INVALID_CHAPTER_CODE",
            message=f"Invalid chapter code format: {code} (expected CH-XX)",
            block_id=block.id,
            block_type=block.block_type,
            field="code",
            severity="error"
        ))
    
    return errors


def validate_relation(block: SSMBlock, chapter_codes: Set[str], by_id: Dict[str, SSMBlock]) -> List[ValidationError]:
    """Validate relation block."""
    errors: List[ValidationError] = []
    
    required_fields = ["from", "to", "type"]
    for field in required_fields:
        if field not in block.meta:
            errors.append(ValidationError(
                code="VAL_MISSING_FIELD",
                message=f"relation missing required field: {field}",
                block_id=block.id,
                block_type=block.block_type,
                field=field,
                severity="error"
            ))
    
    # Validate references resolve
    from_ref = block.meta.get("from", "")
    to_ref = block.meta.get("to", "")
    
    # Check if references are chapter codes
    if from_ref.startswith("CH-") and from_ref not in chapter_codes:
        errors.append(ValidationError(
            code="VAL_UNRESOLVED_REFERENCE",
            message=f"relation.from references unknown chapter: {from_ref}",
            block_id=block.id,
            block_type=block.block_type,
            field="from",
            severity="warning"
        ))
    
    if to_ref.startswith("CH-") and to_ref not in chapter_codes:
        errors.append(ValidationError(
            code="VAL_UNRESOLVED_REFERENCE",
            message=f"relation.to references unknown chapter: {to_ref}",
            block_id=block.id,
            block_type=block.block_type,
            field="to",
            severity="warning"
        ))
    
    return errors


def validate_term(block: SSMBlock) -> List[ValidationError]:
    """Validate term block."""
    errors: List[ValidationError] = []
    
    required_fields = ["name", "definition"]
    for field in required_fields:
        if field not in block.meta:
            errors.append(ValidationError(
                code="VAL_MISSING_FIELD",
                message=f"term missing required field: {field}",
                block_id=block.id,
                block_type=block.block_type,
                field=field,
                severity="error"
            ))
    
    return errors


def validate_code_pattern(block: SSMBlock) -> List[ValidationError]:
    """Validate code-pattern block."""
    errors: List[ValidationError] = []
    
    required_fields = ["language", "pattern_type"]
    for field in required_fields:
        if field not in block.meta:
            errors.append(ValidationError(
                code="VAL_MISSING_FIELD",
                message=f"code-pattern missing required field: {field}",
                block_id=block.id,
                block_type=block.block_type,
                field=field,
                severity="error"
            ))
    
    # Validate language is known
    language = block.meta.get("language", "")
    if language:
        from modules.plugins.registry import get_plugin
        if not get_plugin(language):
            errors.append(ValidationError(
                code="VAL_UNKNOWN_LANGUAGE",
                message=f"Unknown language: {language}",
                block_id=block.id,
                block_type=block.block_type,
                field="language",
                severity="warning"
            ))
    
    return errors


def validate_table(block: SSMBlock) -> List[ValidationError]:
    """Validate table block."""
    errors: List[ValidationError] = []
    
    required_fields = ["headers", "rows"]
    for field in required_fields:
        if field not in block.meta:
            errors.append(ValidationError(
                code="VAL_MISSING_FIELD",
                message=f"table missing required field: {field}",
                block_id=block.id,
                block_type=block.block_type,
                field=field,
                severity="error"
            ))
    
    # Validate row consistency
    headers = block.meta.get("headers", [])
    rows = block.meta.get("rows", [])
    
    if headers and rows:
        header_count = len(headers)
        for i, row in enumerate(rows):
            if len(row) != header_count:
                errors.append(ValidationError(
                    code="VAL_TABLE_ROW_MISMATCH",
                    message=f"Table row {i} has {len(row)} columns, expected {header_count}",
                    block_id=block.id,
                    block_type=block.block_type,
                    field="rows",
                    severity="error"
                ))
    
    return errors


def validate_ssm_content(ssm_content: str) -> List[ValidationError]:
    """
    Validate SSM content string.
    
    This is a simplified validator that checks basic structure.
    For full validation, parse blocks first and use validate_ssm().
    
    Args:
        ssm_content: SSM markdown content
    
    Returns:
        List of ValidationError objects
    """
    errors: List[ValidationError] = []
    
    # Check for unclosed blocks
    block_starts = ssm_content.count(":::")
    if block_starts % 2 != 0:
        errors.append(ValidationError(
            code="VAL_UNCLOSED_BLOCK",
            message="Unclosed SSM block detected (odd number of ::: markers)",
            severity="error"
        ))
    
    # Check for valid block types
    block_type_pattern = re.compile(r"^::: (\w+)", re.MULTILINE)
    valid_block_types = {
        "part-meta", "chapter-meta", "section-meta",
        "concept", "fact", "example", "term",
        "code", "code-pattern", "diagram", "table",
        "relation", "qa", "reasoning_chain", "ssm-meta"
    }
    
    for match in block_type_pattern.finditer(ssm_content):
        block_type = match.group(1)
        if block_type not in valid_block_types:
            errors.append(ValidationError(
                code="VAL_UNKNOWN_BLOCK_TYPE",
                message=f"Unknown block type: {block_type}",
                block_type=block_type,
                severity="warning"
            ))
    
    return errors

