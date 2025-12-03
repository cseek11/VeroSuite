"""Merge chapter files into a single book_raw.md file for SSM compilation."""

import argparse
import logging
import re
import sys
from pathlib import Path
from typing import List, Dict, Any, Optional
import yaml


def setup_logging(verbose: bool, log_file: Optional[Path] = None) -> logging.Logger:
    """Set up logging configuration."""
    level = logging.DEBUG if verbose else logging.INFO
    logger = logging.getLogger('merge_book')
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


def slugify_title(title: str) -> str:
    """
    Convert a book title to a slug for use in filenames.
    
    Examples:
        "Python Bible" -> "python_bible"
        "JavaScript Guide" -> "javascript_guide"
        "C++ Primer" -> "c_primer"
    
    Args:
        title: Book title string
        
    Returns:
        Slugified version of the title
    """
    # Convert to lowercase
    slug = title.lower()
    
    # Replace spaces and common separators with underscores
    slug = re.sub(r'[\s\-_]+', '_', slug)
    
    # Remove special characters, keep only alphanumeric and underscores
    slug = re.sub(r'[^a-z0-9_]', '', slug)
    
    # Remove multiple consecutive underscores
    slug = re.sub(r'_+', '_', slug)
    
    # Remove leading/trailing underscores
    slug = slug.strip('_')
    
    return slug


def load_book_yaml(book_yaml_path: Path, logger: logging.Logger) -> Dict[str, Any]:
    """
    Load and validate book.yaml structure file.
    
    Args:
        book_yaml_path: Path to book.yaml
        logger: Logger instance
        
    Returns:
        Parsed YAML data
        
    Raises:
        FileNotFoundError: If book.yaml doesn't exist
        ValueError: If book.yaml is invalid
    """
    if not book_yaml_path.exists():
        raise FileNotFoundError(f"Book structure file not found: {book_yaml_path}")
    
    try:
        with open(book_yaml_path, 'r', encoding='utf-8') as f:
            data = yaml.safe_load(f)
    except yaml.YAMLError as e:
        raise ValueError(f"Invalid YAML in book.yaml: {e}")
    except Exception as e:
        raise ValueError(f"Error reading book.yaml: {e}")
    
    if not isinstance(data, dict):
        raise ValueError("book.yaml must contain a YAML dictionary")
    
    if 'parts' not in data:
        raise ValueError("book.yaml must contain 'parts' list")
    
    if not isinstance(data['parts'], list):
        raise ValueError("'parts' must be a list")
    
    logger.info(f"Loaded book structure: {len(data['parts'])} parts")
    return data


def validate_chapter_files(
    book_data: Dict[str, Any],
    base_dir: Path,
    logger: logging.Logger
) -> List[str]:
    """
    Validate that all chapter files exist.
    
    Args:
        book_data: Parsed book.yaml data
        base_dir: Base directory for resolving chapter paths
        logger: Logger instance
        
    Returns:
        List of missing file paths (empty if all exist)
    """
    missing = []
    
    for part in book_data['parts']:
        if 'chapters' not in part:
            logger.warning(f"Part '{part.get('name', 'Unknown')}' has no chapters")
            continue
        
        for chapter_path in part['chapters']:
            # Resolve path relative to base_dir
            full_path = base_dir / chapter_path
            if not full_path.exists():
                missing.append(str(full_path))
                logger.error(f"Chapter file not found: {full_path}")
    
    return missing


def merge_book(
    book_yaml_path: Path,
    output_path: Optional[Path] = None,
    base_dir: Optional[Path] = None,
    dist_dir: Optional[Path] = None,
    inject_parts: bool = False,
    dry_run: bool = False,
    verbose: bool = False
) -> int:
    """
    Merge chapter files into a single book_raw.md file.
    
    Args:
        book_yaml_path: Path to book.yaml structure file
        output_path: Optional explicit output path (if not provided, auto-generated from book title)
        base_dir: Base directory for resolving chapter paths (default: book_yaml_path.parent.parent)
        dist_dir: Directory for organized output (default: base_dir / 'dist')
        inject_parts: If True, inject part headers into output
        dry_run: If True, don't write output file
        verbose: Enable verbose logging
        
    Returns:
        0 on success, 1 on error
    """
    logger = setup_logging(verbose)
    
    # Determine base directory
    if base_dir is None:
        # Assume book.yaml is in config/, so base_dir is one level up
        base_dir = book_yaml_path.parent.parent
    
    # Load book structure
    try:
        book_data = load_book_yaml(book_yaml_path, logger)
    except (FileNotFoundError, ValueError) as e:
        logger.error(f"Failed to load book structure: {e}")
        return 1
    
    # Determine output path and directory structure
    if output_path is None:
        # Auto-generate output path from book title
        book_title = book_data.get('title', 'book')
        book_slug = slugify_title(book_title)
        
        # Determine dist directory
        if dist_dir is None:
            dist_dir_path = base_dir / 'dist'
        else:
            dist_dir_path = Path(dist_dir)
        
        # Create book-specific directory: dist/{book_slug}/
        book_output_dir = dist_dir_path / book_slug
        output_path = book_output_dir / f"{book_slug}_raw.md"
        
        logger.info(f"Auto-generated output path from book title:")
        logger.info(f"  Book: {book_title}")
        logger.info(f"  Slug: {book_slug}")
        logger.info(f"  Output directory: {book_output_dir}")
        logger.info(f"  Output file: {output_path.name}")
    else:
        # Use provided output path
        output_path = Path(output_path)
        book_output_dir = output_path.parent
        logger.info(f"Using provided output path: {output_path}")
    
    # Generate output filename from book title if output path ends with 'book_raw.md'
    if output_path.name == 'book_raw.md' or str(output_path).endswith('book_raw.md'):
        # Extract book title and generate slug
        book_title = book_data.get('title', 'book')
        book_slug = slugify_title(book_title)
        new_filename = f"{book_slug}_raw.md"
        
        # Replace filename in output path
        if output_path.is_dir():
            output_path = output_path / new_filename
        else:
            output_path = output_path.parent / new_filename
        
        logger.info(f"Generated output filename from book title: {output_path.name}")
    
    # Validate chapter files
    missing = validate_chapter_files(book_data, base_dir, logger)
    if missing:
        logger.error(f"Found {len(missing)} missing chapter files. Aborting.")
        return 1
    
    # Ensure output directory exists (create book-specific directory)
    if not dry_run:
        book_output_dir.mkdir(parents=True, exist_ok=True)
        logger.debug(f"Created/verified output directory: {book_output_dir}")
    
    # Merge chapters
    output_lines = []
    first_chapter = True
    total_chapters = 0
    
    for part in book_data['parts']:
        part_name = part.get('name', 'Unknown')
        chapters = part.get('chapters', [])
        
        if not chapters:
            logger.warning(f"Part '{part_name}' has no chapters, skipping")
            continue
        
        # Inject part header if requested
        if inject_parts and not first_chapter:
            output_lines.append('\n')
        
        if inject_parts:
            output_lines.append(f"# {part_name}\n")
            output_lines.append('\n')
            logger.debug(f"Injected part header: {part_name}")
        
        # Process chapters in this part
        for chapter_path in chapters:
            full_path = base_dir / chapter_path
            
            try:
                with open(full_path, 'r', encoding='utf-8') as f:
                    content = f.read()
            except Exception as e:
                logger.error(f"Failed to read chapter {full_path}: {e}")
                return 1
            
            # Remove trailing newlines
            content = content.rstrip('\n')
            
            # Add separator before chapter (except first)
            if not first_chapter:
                output_lines.append('\n\n')
            
            # Add chapter content
            output_lines.append(content)
            first_chapter = False
            total_chapters += 1
            logger.debug(f"Merged chapter: {chapter_path}")
    
    # Join all lines
    merged_content = ''.join(output_lines)
    
    # Ensure final newline
    if not merged_content.endswith('\n'):
        merged_content += '\n'
    
    # Write output
    if not dry_run:
        try:
            with open(output_path, 'w', encoding='utf-8') as f:
                f.write(merged_content)
            logger.info(f"Wrote merged book to {output_path}")
            logger.info(f"Total chapters merged: {total_chapters}")
        except Exception as e:
            logger.error(f"Failed to write output file: {e}")
            return 1
    else:
        logger.info(f"[DRY RUN] Would write {len(merged_content)} characters to {output_path}")
        logger.info(f"[DRY RUN] Total chapters: {total_chapters}")
    
    return 0


def main() -> int:
    """Main entry point."""
    parser = argparse.ArgumentParser(
        description='Merge chapter files into a single raw markdown file (filename based on book title)'
    )
    parser.add_argument(
        '--book-yaml',
        type=Path,
        required=True,
        help='Path to book.yaml structure file'
    )
    parser.add_argument(
        '--output',
        type=Path,
        required=False,
        help='Optional explicit output path (if not provided, auto-generated as dist/{book_name}/{book_name}_raw.md)'
    )
    parser.add_argument(
        '--dist-dir',
        type=Path,
        help='Directory for organized output (default: base_dir/dist, creates dist/{book_name}/ subdirectory)'
    )
    parser.add_argument(
        '--base-dir',
        type=Path,
        help='Base directory for resolving chapter paths (default: book_yaml parent parent)'
    )
    parser.add_argument(
        '--inject-parts',
        action='store_true',
        help='Inject part headers into merged output'
    )
    parser.add_argument(
        '--verbose',
        action='store_true',
        help='Enable verbose logging'
    )
    parser.add_argument(
        '--dry-run',
        action='store_true',
        help='Process without writing output file'
    )
    
    args = parser.parse_args()
    
    return merge_book(
        args.book_yaml,
        args.output,
        args.base_dir,
        args.dist_dir,
        args.inject_parts,
        args.dry_run,
        args.verbose
    )


if __name__ == '__main__':
    sys.exit(main())


