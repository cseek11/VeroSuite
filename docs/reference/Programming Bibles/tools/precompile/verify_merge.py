"""Verify merged book against original for data loss."""

import sys
import importlib.util
from pathlib import Path

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
    logger = get_logger("verify_merge")
else:
    logger = None


def verify_merge(original_path: Path, merged_path: Path):
    """Verify merged file against original."""
    if logger:
        logger.progress("Content verification", operation="verify_merge", stage="content")
    
    # Read files
    with open(original_path, 'r', encoding='utf-8') as f:
        orig = f.read()
    
    with open(merged_path, 'r', encoding='utf-8') as f:
        merged = f.read()
    
    # Basic metrics
    orig_size = len(orig)
    merged_size = len(merged)
    size_diff = merged_size - orig_size
    orig_lines = len(orig.splitlines())
    merged_lines = len(merged.splitlines())
    line_diff = merged_lines - orig_lines
    orig_words = len(orig.split())
    merged_words = len(merged.split())
    word_diff = merged_words - orig_words
    
    if logger:
        logger.info(
            "Content metrics",
            operation="verify_merge",
            stage="content_metrics",
            original_size=orig_size,
            merged_size=merged_size,
            size_difference=size_diff,
            original_lines=orig_lines,
            merged_lines=merged_lines,
            line_difference=line_diff,
            original_words=orig_words,
            merged_words=merged_words,
            word_difference=word_diff
        )
    
    # Chapter verification
    import re
    orig_chapters = sorted(re.findall(r'📘 CHAPTER (\d+)', orig))
    merged_chapters = sorted(re.findall(r'📘 CHAPTER (\d+)', merged))
    
    if logger:
        logger.progress("Chapter verification", operation="verify_merge", stage="chapters")
    
    chapters_match = orig_chapters == merged_chapters
    missing = set(orig_chapters) - set(merged_chapters)
    extra = set(merged_chapters) - set(orig_chapters)
    
    if logger:
        logger.info(
            "Chapter verification",
            operation="verify_merge",
            stage="chapters",
            original_chapters=len(orig_chapters),
            merged_chapters=len(merged_chapters),
            chapters_match=chapters_match,
            missing_chapters=list(missing) if missing else None,
            extra_chapters=list(extra) if extra else None
        )
    
    if missing and logger:
        logger.warn(
            "Chapters missing in merged file",
            operation="verify_merge",
            error_code="MISSING_CHAPTERS",
            root_cause=f"Chapters found in original but not in merged: {missing}",
            missing_chapters=list(missing)
        )
    if extra and logger:
        logger.warn(
            "Extra chapters in merged file",
            operation="verify_merge",
            error_code="EXTRA_CHAPTERS",
            root_cause=f"Chapters found in merged but not in original: {extra}",
            extra_chapters=list(extra)
        )
    
    # Code blocks
    if logger:
        logger.progress("Code block verification", operation="verify_merge", stage="code_blocks")
    
    orig_code = orig.count('```')
    merged_code = merged.count('```')
    code_diff = merged_code - orig_code
    
    if logger:
        logger.info(
            "Code block verification",
            operation="verify_merge",
            stage="code_blocks",
            original_code_blocks=orig_code,
            merged_code_blocks=merged_code,
            code_block_difference=code_diff
        )
    
    # Normalized comparison
    if logger:
        logger.progress("Normalized comparison", operation="verify_merge", stage="normalized")
    
    orig_normalized = '\n'.join([line.rstrip() for line in orig.splitlines()])
    merged_normalized = '\n'.join([line.rstrip() for line in merged.splitlines()])
    
    normalized_match = orig_normalized == merged_normalized
    diff_count = 0
    if not normalized_match:
        # Count character differences
        diff_count = sum(1 for o, m in zip(orig_normalized, merged_normalized) if o != m)
        length_only_diff = diff_count == 0 and len(orig_normalized) != len(merged_normalized)
        
        if logger:
            logger.info(
                "Normalized comparison",
                operation="verify_merge",
                stage="normalized",
                files_match=normalized_match,
                character_differences=diff_count,
                length_only_difference=length_only_diff
            )
    else:
        if logger:
            logger.info(
                "Files match exactly after normalization",
                operation="verify_merge",
                stage="normalized",
                files_match=True
            )
    
    # Diff analysis
    if logger:
        logger.progress("Diff analysis", operation="verify_merge", stage="diff")
    
    import difflib
    orig_lines = orig.splitlines(keepends=True)
    merged_lines = merged.splitlines(keepends=True)
    diff = list(difflib.unified_diff(orig_lines, merged_lines, lineterm='', n=0))
    
    non_blank_diffs = [
        d for d in diff 
        if d.startswith(('+', '-')) 
        and not d.startswith(('+++', '---')) 
        and d.strip() not in ('+', '-')
    ]
    
    if logger:
        logger.info(
            "Diff analysis",
            operation="verify_merge",
            stage="diff",
            total_diff_lines=len(diff),
            non_blank_differences=len(non_blank_diffs),
            first_differences=non_blank_diffs[:10] if non_blank_diffs else None
        )
    
    if non_blank_diffs and logger:
        logger.warn(
            "Non-blank differences found",
            operation="verify_merge",
            error_code="NON_BLANK_DIFFERENCES",
            root_cause=f"Found {len(non_blank_diffs)} non-blank differences",
            difference_count=len(non_blank_diffs)
        )
    
    # Summary
    if logger:
        logger.progress("Summary", operation="verify_merge", stage="summary")
    
    word_match = len(orig.split()) == len(merged.split())
    chapter_match = orig_chapters == merged_chapters
    code_match = orig_code == merged_code
    verification_passed = word_match and chapter_match and code_match and len(non_blank_diffs) == 0
    
    issues = []
    if not word_match:
        issues.append("word_count_mismatch")
    if not chapter_match:
        issues.append("chapter_mismatch")
    if not code_match:
        issues.append("code_block_mismatch")
    if len(non_blank_diffs) > 0:
        issues.append("non_whitespace_differences")
    
    if verification_passed:
        if logger:
            logger.info(
                "Verification passed",
                operation="verify_merge",
                stage="summary",
                verification_passed=True,
                message="No data loss detected - all content preserved (only whitespace normalization)"
            )
        return 0
    else:
        if logger:
            logger.error(
                "Verification failed",
                operation="verify_merge",
                error_code="DATA_LOSS_DETECTED",
                root_cause="Potential data loss detected",
                issues=issues,
                word_match=word_match,
                chapter_match=chapter_match,
                code_match=code_match,
                non_blank_differences=len(non_blank_diffs)
            )
        return 1


if __name__ == '__main__':
    if len(sys.argv) != 3:
        if logger:
            logger.error(
                "Invalid usage",
                operation="main",
                error_code="INVALID_USAGE",
                root_cause="Missing required arguments",
                usage="verify_merge.py <original_file> <merged_file>"
            )
        sys.exit(1)
    
    original = Path(sys.argv[1])
    merged = Path(sys.argv[2])
    
    if not original.exists():
        if logger:
            logger.error(
                "Original file not found",
                operation="main",
                error_code="FILE_NOT_FOUND",
                root_cause=f"Original file does not exist: {original}",
                file_path=str(original)
            )
        sys.exit(1)
    
    if not merged.exists():
        if logger:
            logger.error(
                "Merged file not found",
                operation="main",
                error_code="FILE_NOT_FOUND",
                root_cause=f"Merged file does not exist: {merged}",
                file_path=str(merged)
            )
        sys.exit(1)
    
    sys.exit(verify_merge(original, merged))


