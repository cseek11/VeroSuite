"""Verify merged book against source chapters for data loss."""

import argparse
import sys
import yaml
import importlib.util
from pathlib import Path
from typing import List, Tuple, Dict, Any

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

def verify_merge(base_dir: Path) -> Dict[str, Any]:
    """Verify merged file against source chapters."""
    results = {
        'file_sizes': {},
        'content_markers': {},
        'chapter_verification': [],
        'data_loss': False,
        'issues': []
    }
    
    # Load book structure
    book_yaml = base_dir / 'config' / 'book.yaml'
    if not book_yaml.exists():
        raise FileNotFoundError(f"Book structure file not found: {book_yaml}")
    
    book_data = yaml.safe_load(open(book_yaml, 'r', encoding='utf-8'))
    
    # Get all chapter paths
    all_chapters = [p for part in book_data['parts'] for p in part['chapters']]
    chapters_dir = base_dir / 'chapters'
    merged_file = base_dir / 'dist' / 'book_raw.md'
    
    if not merged_file.exists():
        raise FileNotFoundError(f"Merged file not found: {merged_file}")
    
    # Read merged content
    merged_content = merged_file.read_text(encoding='utf-8')
    merged_size = merged_file.stat().st_size
    
    # Calculate source total
    source_total = 0
    source_chars = 0
    
    for ch_path in all_chapters:
        ch_file = chapters_dir / Path(ch_path).name
        if ch_file.exists():
            ch_size = ch_file.stat().st_size
            ch_content = ch_file.read_text(encoding='utf-8')
            ch_chars = len(ch_content)
            source_total += ch_size
            source_chars += ch_chars
            
            # Verify chapter content appears in merged file
            ch_name = Path(ch_path).stem
            # Check if chapter content is in merged file (accounting for whitespace normalization)
            ch_content_stripped = ch_content.rstrip('\n')
            if ch_content_stripped in merged_content:
                results['chapter_verification'].append((ch_name, 'FULL_MATCH', ch_size))
            elif ch_content_stripped[:1000] in merged_content:
                results['chapter_verification'].append((ch_name, 'PARTIAL_MATCH', ch_size))
                results['issues'].append(f"Chapter {ch_name}: Only partial match found")
            else:
                results['chapter_verification'].append((ch_name, 'NOT_FOUND', ch_size))
                results['data_loss'] = True
                results['issues'].append(f"Chapter {ch_name}: Content not found in merged file!")
    
    # File size comparison
    results['file_sizes'] = {
        'merged_bytes': merged_size,
        'source_total_bytes': source_total,
        'merged_chars': len(merged_content),
        'source_total_chars': source_chars,
        'size_difference': merged_size - source_total,
        'char_difference': len(merged_content) - source_chars,
        'size_ratio': (merged_size / source_total * 100) if source_total > 0 else 0,
        'char_ratio': (len(merged_content) / source_chars * 100) if source_chars > 0 else 0
    }
    
    # Content markers
    # Count code blocks generically (any language)
    # Count opening code block markers: ```language (where language is word chars)
    # Exclude mermaid diagrams (counted separately)
    # Exclude closing markers (just ``` with no language)
    import re
    # Match ``` at start of line followed by word characters (language identifier)
    # This matches opening code blocks with language, not closing markers
    code_block_pattern = re.compile(r'^```(?!mermaid)\w+', re.MULTILINE)
    code_blocks_merged = len(code_block_pattern.findall(merged_content))
    
    results['content_markers'] = {
        'mermaid_diagrams_merged': merged_content.count('```mermaid'),
        'code_blocks_merged': code_blocks_merged,
        'ssm_blocks_merged': merged_content.count('<!-- SSM:'),
        'frontmatter_merged': merged_content.count('---'),
        'chapter_markers_merged': merged_content.count('CHAPTER'),
        'total_lines_merged': len(merged_content.splitlines())
    }
    
    # Count markers in source
    mermaid_source = 0
    code_blocks_source = 0
    ssm_blocks_source = 0
    
    for ch_path in all_chapters:
        ch_file = chapters_dir / Path(ch_path).name
        if ch_file.exists():
            ch_content = ch_file.read_text(encoding='utf-8')
            mermaid_source += ch_content.count('```mermaid')
            # Count code blocks (same method as merged)
            code_blocks_source += len(code_block_pattern.findall(ch_content))
            ssm_blocks_source += ch_content.count('<!-- SSM:')
    
    results['content_markers']['mermaid_diagrams_source'] = mermaid_source
    results['content_markers']['code_blocks_source'] = code_blocks_source
    results['content_markers']['ssm_blocks_source'] = ssm_blocks_source
    
    # Check for marker loss
    if results['content_markers']['mermaid_diagrams_merged'] != mermaid_source:
        results['issues'].append(f"Mermaid diagrams: {results['content_markers']['mermaid_diagrams_merged']} in merged vs {mermaid_source} in source")
        results['data_loss'] = True
    
    if results['content_markers']['code_blocks_merged'] != code_blocks_source:
        results['issues'].append(f"Code blocks: {results['content_markers']['code_blocks_merged']} in merged vs {code_blocks_source} in source")
        results['data_loss'] = True
    
    if results['content_markers']['ssm_blocks_merged'] != ssm_blocks_source:
        results['issues'].append(f"SSM blocks: {results['content_markers']['ssm_blocks_merged']} in merged vs {ssm_blocks_source} in source")
        results['data_loss'] = True
    
    return results

def main() -> int:
    """Main entry point."""
    parser = argparse.ArgumentParser(
        description='Verify merged book against source chapters for data loss'
    )
    parser.add_argument(
        '--bible-dir',
        type=Path,
        required=True,
        help='Path to bible directory (e.g., bibles/python_bible)'
    )
    
    args = parser.parse_args()
    
    base_dir = args.bible_dir.resolve()
    
    if not base_dir.exists():
        if logger:
            logger.error(
                "Bible directory not found",
                operation="main",
                error_code="DIRECTORY_NOT_FOUND",
                root_cause=f"Bible directory does not exist: {base_dir}",
                bible_dir=str(base_dir)
            )
        return 1
    
    try:
        results = verify_merge(base_dir)
    except FileNotFoundError as e:
        if logger:
            logger.error(
                "File not found error",
                operation="main",
                error_code="FILE_NOT_FOUND",
                root_cause=str(e)
            )
        return 1
    except (yaml.YAMLError, KeyError, ValueError) as e:
        if logger:
            logger.error(
                "Error parsing book structure",
                operation="main",
                error_code="PARSE_ERROR",
                root_cause=str(e)
            )
        return 1
    except Exception as e:
        if logger:
            logger.error(
                "Unexpected error during verification",
                operation="main",
                error_code="UNEXPECTED_ERROR",
                root_cause=str(e),
                exc_info=True
            )
        return 1
    
    # Log verification report
    if logger:
        logger.progress("Merge verification report", operation="main", stage="report")
    
    full_matches = sum(1 for _, status, _ in results['chapter_verification'] if status == 'FULL_MATCH')
    partial_matches = sum(1 for _, status, _ in results['chapter_verification'] if status == 'PARTIAL_MATCH')
    not_found = sum(1 for _, status, _ in results['chapter_verification'] if status == 'NOT_FOUND')
    
    if logger:
        logger.info(
            "Merge verification report",
            operation="main",
            stage="file_sizes",
            file_sizes=results['file_sizes'],
            content_markers=results['content_markers'],
            chapter_verification={
                "full_matches": full_matches,
                "partial_matches": partial_matches,
                "not_found": not_found,
                "total": len(results['chapter_verification'])
            },
            issues=results['issues'] if results['issues'] else None,
            data_loss=results['data_loss']
        )
    
    if results['data_loss']:
        if logger:
            logger.error(
                "Data loss detected",
                operation="main",
                error_code="DATA_LOSS_DETECTED",
                root_cause="Data loss detected during merge verification",
                issues=results['issues']
            )
        return 1
    else:
        if logger:
            logger.info(
                "No data loss - all content preserved",
                operation="main",
                stage="summary"
            )
        return 0

if __name__ == '__main__':
    sys.exit(main())

