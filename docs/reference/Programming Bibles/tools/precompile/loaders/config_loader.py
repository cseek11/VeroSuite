"""Load and validate bible configuration files."""

import yaml
from pathlib import Path
from typing import Dict, List, Any, Optional
from dataclasses import dataclass, field


class ConfigError(Exception):
    """Raised when configuration is invalid or missing."""
    pass


@dataclass
class SlugRules:
    """Configuration for filename slug generation."""
    remove_emoji: bool = True
    lowercase: bool = True
    replace_non_alnum_with_space: bool = True
    collapse_whitespace: bool = True


@dataclass
class BookMetadata:
    """Book metadata for SSM compilation."""
    title: str
    version: str = "1.0.0"
    namespace: Optional[str] = None


@dataclass
class BibleConfig:
    """Complete bible configuration."""
    chapter_boundary_patterns: List[str]
    chapter_title_patterns: List[str]
    part_header_patterns: List[str] = field(default_factory=list)
    slug_rules: SlugRules = field(default_factory=SlugRules)
    book_metadata: Optional[BookMetadata] = None

    def __post_init__(self):
        """Validate configuration after initialization."""
        if not self.chapter_boundary_patterns:
            raise ConfigError("At least one chapter_boundary_pattern must be defined")
        if not self.chapter_title_patterns:
            raise ConfigError("At least one chapter_title_pattern must be defined")


def load_config(config_path: Path) -> BibleConfig:
    """
    Load and validate a bible configuration file.
    
    Args:
        config_path: Path to bible_config.yaml file
        
    Returns:
        BibleConfig object with validated configuration
        
    Raises:
        ConfigError: If config is invalid or missing
        FileNotFoundError: If config file doesn't exist
    """
    if not config_path.exists():
        raise FileNotFoundError(f"Configuration file not found: {config_path}")
    
    try:
        with open(config_path, 'r', encoding='utf-8') as f:
            data = yaml.safe_load(f)
    except yaml.YAMLError as e:
        raise ConfigError(f"Invalid YAML in config file: {e}")
    except Exception as e:
        raise ConfigError(f"Error reading config file: {e}")
    
    if not isinstance(data, dict):
        raise ConfigError("Configuration file must contain a YAML dictionary")
    
    # Extract chapter boundary patterns
    chapter_boundary_patterns = data.get('chapter_boundary_patterns', [])
    if not isinstance(chapter_boundary_patterns, list):
        raise ConfigError("chapter_boundary_patterns must be a list")
    if not chapter_boundary_patterns:
        raise ConfigError("At least one chapter_boundary_pattern must be defined")
    
    # Extract chapter title patterns
    chapter_title_patterns = data.get('chapter_title_patterns', [])
    if not isinstance(chapter_title_patterns, list):
        raise ConfigError("chapter_title_patterns must be a list")
    if not chapter_title_patterns:
        raise ConfigError("At least one chapter_title_pattern must be defined")
    
    # Extract part header patterns (optional)
    part_header_patterns = data.get('part_header_patterns', [])
    if not isinstance(part_header_patterns, list):
        part_header_patterns = []
    
    # Extract slug rules
    slug_data = data.get('slug_rules', {})
    slug_rules = SlugRules(
        remove_emoji=slug_data.get('remove_emoji', True),
        lowercase=slug_data.get('lowercase', True),
        replace_non_alnum_with_space=slug_data.get('replace_non_alnum_with_space', True),
        collapse_whitespace=slug_data.get('collapse_whitespace', True)
    )
    
    # Extract book metadata (optional)
    book_metadata = None
    if 'book_metadata' in data:
        meta_data = data['book_metadata']
        if not isinstance(meta_data, dict):
            raise ConfigError("book_metadata must be a dictionary")
        if 'title' not in meta_data:
            raise ConfigError("book_metadata must contain 'title'")
        book_metadata = BookMetadata(
            title=meta_data['title'],
            version=meta_data.get('version', '1.0.0'),
            namespace=meta_data.get('namespace')
        )
    
    return BibleConfig(
        chapter_boundary_patterns=chapter_boundary_patterns,
        chapter_title_patterns=chapter_title_patterns,
        part_header_patterns=part_header_patterns,
        slug_rules=slug_rules,
        book_metadata=book_metadata
    )


