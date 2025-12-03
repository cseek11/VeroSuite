"""Split a monolithic markdown bible file into individual chapter files."""

import argparse
import logging
import re
import sys
from pathlib import Path
from typing import List, Optional, Dict, Any
from dataclasses import dataclass, field
import yaml

# Add parent directory to path for imports
sys.path.insert(0, str(Path(__file__).parent))

from loaders.config_loader import load_config, ConfigError
from loaders.pattern_loader import PatternLoader


@dataclass
class ChapterMeta:
    """Metadata for a chapter."""
    number: int
    title: str
    filename: str
    part_name: Optional[str] = None
    part_number: Optional[str] = None


def slugify_title(title: str, slug_rules) -> str:
    """
    Convert a chapter title to a filename-safe slug.
    
    Args:
        title: Chapter title
        slug_rules: SlugRules configuration
        
    Returns:
        Slugified string
    """
    if not title:
        return "chapter"
    
    text = title
    
    # Remove emoji if configured
    if slug_rules.remove_emoji:
        # Remove common emoji patterns
        emoji_pattern = re.compile(
            "["
            "\U0001F300-\U0001F9FF"  # Miscellaneous Symbols and Pictographs
            "\U0001F600-\U0001F64F"  # Emoticons
            "\U0001F680-\U0001F6FF"  # Transport and Map Symbols
            "\U00002600-\U000026FF"  # Miscellaneous Symbols
            "\U00002700-\U000027BF"  # Dingbats
            "]+",
            flags=re.UNICODE
        )
        text = emoji_pattern.sub('', text)
    
    # Replace non-alphanumeric with space if configured
    if slug_rules.replace_non_alnum_with_space:
        text = re.sub(r'[^a-zA-Z0-9\s]', ' ', text)
    
    # Collapse whitespace if configured
    if slug_rules.collapse_whitespace:
        text = re.sub(r'\s+', ' ', text)
    
    # Lowercase if configured
    if slug_rules.lowercase:
        text = text.lower()
    
    # Replace spaces with underscores
    text = text.replace(' ', '_')
    
    # Remove leading/trailing underscores
    text = text.strip('_')
    
    # Default to "chapter" if empty
    if not text:
        return "chapter"
    
    return text


def setup_logging(verbose: bool, log_file: Optional[Path] = None) -> logging.Logger:
    """Set up logging configuration."""
    level = logging.DEBUG if verbose else logging.INFO
    logger = logging.getLogger('split_book')
    logger.setLevel(level)
    
    # Remove existing handlers
    logger.handlers.clear()
    
    # Console handler
    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setLevel(level)
    formatter = logging.Formatter('%(levelname)s: %(message)s')
    console_handler.setFormatter(formatter)
    logger.addHandler(console_handler)
    
    # File handler if specified
    if log_file:
        file_handler = logging.FileHandler(log_file, encoding='utf-8')
        file_handler.setLevel(logging.DEBUG)
        file_formatter = logging.Formatter(
            '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
        )
        file_handler.setFormatter(file_formatter)
        logger.addHandler(file_handler)
    
    return logger


def split_book(
    input_file: Path,
    output_dir: Path,
    config_path: Path,
    book_yaml_path: Path,
    dry_run: bool = False,
    verbose: bool = False
) -> int:
    """
    Split a monolithic markdown file into chapter files.
    
    Args:
        input_file: Path to source markdown file
        output_dir: Directory to write chapter files
        config_path: Path to bible_config.yaml
        book_yaml_path: Path to write book.yaml
        dry_run: If True, don't write files
        verbose: Enable verbose logging
        
    Returns:
        0 on success, 1 on error
    """
    logger = setup_logging(verbose)
    
    # Load configuration
    try:
        config = load_config(config_path)
        logger.info(f"Loaded configuration from {config_path}")
    except (ConfigError, FileNotFoundError) as e:
        logger.error(f"Failed to load configuration: {e}")
        return 1
    
    # Load pattern matcher
    try:
        pattern_loader = PatternLoader(config)
        logger.info("Compiled pattern matchers")
    except Exception as e:
        logger.error(f"Failed to compile patterns: {e}")
        return 1
    
    # Read input file
    if not input_file.exists():
        logger.error(f"Input file not found: {input_file}")
        return 1
    
    try:
        with open(input_file, 'r', encoding='utf-8') as f:
            lines = f.readlines()
        logger.info(f"Read {len(lines)} lines from {input_file}")
    except Exception as e:
        logger.error(f"Failed to read input file: {e}")
        return 1
    
    # Create output directory
    if not dry_run:
        output_dir.mkdir(parents=True, exist_ok=True)
    
    # Processing state
    chapters: List[ChapterMeta] = []
    current_chapter_number: Optional[int] = None
    current_chapter_title: Optional[str] = None
    current_part_name: Optional[str] = None
    current_part_number: Optional[str] = None
    buffer: List[str] = []
    parts_order: List[str] = []
    part_to_chapters: Dict[str, List[ChapterMeta]] = {}
    
    # Track detected parts
    detected_parts: Dict[str, str] = {}  # part_number -> part_name
    
    # Process lines
    for line_num, line in enumerate(lines, start=1):
        # Check for part header
        part_match = pattern_loader.match_part_header(line)
        if part_match and part_match.matched:
            if part_match.part_name:
                current_part_name = part_match.part_name
                current_part_number = part_match.part_number
                part_key = f"Part {part_match.part_number}: {part_match.part_name}"
                if part_key not in parts_order:
                    parts_order.append(part_key)
                    detected_parts[part_match.part_number or ''] = part_match.part_name or ''
                logger.debug(f"Line {line_num}: Detected part header: {part_key}")
            buffer.append(line)
            continue
        
        # Check for chapter boundary (highest priority)
        boundary_match = pattern_loader.match_chapter_boundary(line)
        if boundary_match and boundary_match.matched:
            # Finalize previous chapter if exists
            if current_chapter_number is not None:
                chapter_meta = finalize_chapter(
                    current_chapter_number,
                    current_chapter_title or f"Chapter {current_chapter_number}",
                    buffer,
                    output_dir,
                    config,
                    current_part_name,
                    current_part_number,
                    dry_run,
                    logger
                )
                if chapter_meta:
                    chapters.append(chapter_meta)
                    # Track part association
                    part_key = f"Part {current_part_number}: {current_part_name}" if current_part_name else "Ungrouped"
                    if part_key not in part_to_chapters:
                        part_to_chapters[part_key] = []
                    part_to_chapters[part_key].append(chapter_meta)
            
            # Start new chapter (include any frontmatter in buffer for first chapter)
            current_chapter_number = boundary_match.chapter_number
            current_chapter_title = None  # Will be set by title match
            # For first chapter, keep existing buffer (frontmatter), otherwise start fresh
            if current_chapter_number == 1 and not buffer:
                # This shouldn't happen, but handle it
                buffer = [line]
            elif current_chapter_number == 1:
                # First chapter: append boundary to existing buffer (frontmatter)
                buffer.append(line)
            else:
                # Subsequent chapters: start fresh buffer
                buffer = [line]
            logger.debug(f"Line {line_num}: Detected chapter boundary: Chapter {current_chapter_number}")
            continue
        
        # Check for chapter title (secondary priority)
        title_match = pattern_loader.match_chapter_title(line)
        if title_match and title_match.matched:
            # If chapter number doesn't match current chapter, finalize and start new
            if current_chapter_number is not None and current_chapter_number != title_match.chapter_number:
                # Finalize previous chapter
                chapter_meta = finalize_chapter(
                    current_chapter_number,
                    current_chapter_title or f"Chapter {current_chapter_number}",
                    buffer,
                    output_dir,
                    config,
                    current_part_name,
                    current_part_number,
                    dry_run,
                    logger
                )
                if chapter_meta:
                    chapters.append(chapter_meta)
                    part_key = f"Part {current_part_number}: {current_part_name}" if current_part_name else "Ungrouped"
                    if part_key not in part_to_chapters:
                        part_to_chapters[part_key] = []
                    part_to_chapters[part_key].append(chapter_meta)
                
                # Start new chapter
                current_chapter_number = title_match.chapter_number
                current_chapter_title = title_match.title.strip() if title_match.title else None
                buffer = [line]
                logger.debug(f"Line {line_num}: Starting new chapter from title: Chapter {current_chapter_number}")
            # If no chapter active, start one
            elif current_chapter_number is None:
                current_chapter_number = title_match.chapter_number
                current_chapter_title = title_match.title.strip() if title_match.title else None
                buffer = [line]
                logger.debug(f"Line {line_num}: Starting chapter from title: Chapter {current_chapter_number}")
            # Set title if chapter number matches (already active)
            else:
                if title_match.title:
                    current_chapter_title = title_match.title.strip()
                logger.debug(f"Line {line_num}: Detected chapter title: {current_chapter_title}")
                buffer.append(line)
            continue
        
        # Regular line - append to buffer
        buffer.append(line)
    
    # Finalize last chapter
    if current_chapter_number is not None:
        chapter_meta = finalize_chapter(
            current_chapter_number,
            current_chapter_title or f"Chapter {current_chapter_number}",
            buffer,
            output_dir,
            config,
            current_part_name,
            current_part_number,
            dry_run,
            logger
        )
        if chapter_meta:
            chapters.append(chapter_meta)
            part_key = f"Part {current_part_number}: {current_part_name}" if current_part_name else "Ungrouped"
            if part_key not in part_to_chapters:
                part_to_chapters[part_key] = []
            part_to_chapters[part_key].append(chapter_meta)
    
    # Validation
    validate_chapters(chapters, logger)
    
    # Generate book.yaml
    if not dry_run:
        generate_book_yaml(
            chapters,
            part_to_chapters,
            parts_order,
            book_yaml_path,
            config,
            logger
        )
    
    logger.info(f"Processed {len(chapters)} chapters")
    if not dry_run:
        logger.info(f"Chapter files written to {output_dir}")
        logger.info(f"Book structure written to {book_yaml_path}")
    
    return 0


def finalize_chapter(
    chapter_number: int,
    chapter_title: str,
    buffer: List[str],
    output_dir: Path,
    config,
    part_name: Optional[str],
    part_number: Optional[str],
    dry_run: bool,
    logger: logging.Logger
) -> Optional[ChapterMeta]:
    """Finalize a chapter and write it to disk."""
    # Generate filename
    slug = slugify_title(chapter_title, config.slug_rules)
    filename = f"{chapter_number:02d}_{slug}.md"
    filepath = output_dir / filename
    
    # Remove trailing newlines from buffer
    content = ''.join(buffer).rstrip('\n')
    
    if not dry_run:
        try:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
                f.write('\n')  # Ensure file ends with newline
            logger.debug(f"Wrote chapter {chapter_number} to {filepath}")
        except Exception as e:
            logger.error(f"Failed to write chapter {chapter_number}: {e}")
            return None
    else:
        logger.info(f"[DRY RUN] Would write chapter {chapter_number} to {filepath}")
    
    return ChapterMeta(
        number=chapter_number,
        title=chapter_title,
        filename=filename,
        part_name=part_name,
        part_number=part_number
    )


def validate_chapters(chapters: List[ChapterMeta], logger: logging.Logger):
    """Validate chapter list for duplicates and gaps."""
    chapter_numbers = [ch.number for ch in chapters]
    
    # Check for duplicates
    seen = set()
    duplicates = []
    for num in chapter_numbers:
        if num in seen:
            duplicates.append(num)
        seen.add(num)
    
    if duplicates:
        logger.warning(f"Duplicate chapter numbers detected: {duplicates}")
    
    # Check for gaps and ordering
    if chapter_numbers:
        sorted_numbers = sorted(chapter_numbers)
        expected = list(range(min(sorted_numbers), max(sorted_numbers) + 1))
        missing = set(expected) - set(sorted_numbers)
        if missing:
            logger.warning(f"Missing chapter numbers: {sorted(missing)}")
        
        if sorted_numbers != chapter_numbers:
            logger.warning("Chapters are not in sequential order")


def generate_book_yaml(
    chapters: List[ChapterMeta],
    part_to_chapters: Dict[str, List[ChapterMeta]],
    parts_order: List[str],
    book_yaml_path: Path,
    config,
    logger: logging.Logger
):
    """Generate book.yaml structure file."""
    # Ensure config directory exists
    book_yaml_path.parent.mkdir(parents=True, exist_ok=True)
    
    # Build YAML structure
    book_data = {
        'title': config.book_metadata.title if config.book_metadata else 'Bible',
        'version': config.book_metadata.version if config.book_metadata else '1.0.0',
    }
    
    # Build parts structure
    parts_list = []
    
    # Add chapters in parts order
    for part_name in parts_order:
        if part_name in part_to_chapters:
            part_chapters = part_to_chapters[part_name]
            chapters_list = [f"chapters/{ch.filename}" for ch in part_chapters]
            parts_list.append({
                'name': part_name,
                'chapters': chapters_list
            })
    
    # Add ungrouped chapters
    if "Ungrouped" in part_to_chapters:
        ungrouped = part_to_chapters["Ungrouped"]
        chapters_list = [f"chapters/{ch.filename}" for ch in ungrouped]
        parts_list.append({
            'name': 'Ungrouped',
            'chapters': chapters_list
        })
    
    # If no parts, just list all chapters
    if not parts_list:
        chapters_list = [f"chapters/{ch.filename}" for ch in chapters]
        parts_list.append({
            'name': 'All Chapters',
            'chapters': chapters_list
        })
    
    book_data['parts'] = parts_list
    
    # Write YAML
    try:
        with open(book_yaml_path, 'w', encoding='utf-8') as f:
            yaml.dump(book_data, f, default_flow_style=False, sort_keys=False, allow_unicode=True)
        logger.info(f"Generated book.yaml with {len(parts_list)} parts")
    except Exception as e:
        logger.error(f"Failed to write book.yaml: {e}")
        raise


def main() -> int:
    """Main entry point."""
    parser = argparse.ArgumentParser(
        description='Split a monolithic markdown bible file into chapter files'
    )
    parser.add_argument(
        '--config',
        type=Path,
        required=True,
        help='Path to bible_config.yaml'
    )
    parser.add_argument(
        '--input',
        type=Path,
        required=True,
        help='Path to source markdown file'
    )
    parser.add_argument(
        '--output',
        type=Path,
        required=True,
        help='Directory to write chapter files'
    )
    parser.add_argument(
        '--book-yaml',
        type=Path,
        required=True,
        help='Path to write book.yaml structure file'
    )
    parser.add_argument(
        '--verbose',
        action='store_true',
        help='Enable verbose logging'
    )
    parser.add_argument(
        '--dry-run',
        action='store_true',
        help='Process without writing files'
    )
    
    args = parser.parse_args()
    
    return split_book(
        args.input,
        args.output,
        args.config,
        args.book_yaml,
        args.dry_run,
        args.verbose
    )


if __name__ == '__main__':
    sys.exit(main())

