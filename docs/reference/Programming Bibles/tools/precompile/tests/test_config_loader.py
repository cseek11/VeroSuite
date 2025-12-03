"""Tests for configuration loader."""

import unittest
import tempfile
import yaml
import sys
from pathlib import Path

# Add parent directory to path for imports
sys.path.insert(0, str(Path(__file__).parent.parent))

from loaders.config_loader import (
    load_config,
    ConfigError,
    BibleConfig,
    SlugRules,
    BookMetadata
)


class TestConfigLoader(unittest.TestCase):
    """Test configuration loading and validation."""
    
    def setUp(self):
        """Set up test fixtures."""
        self.temp_dir = Path(tempfile.mkdtemp())
    
    def tearDown(self):
        """Clean up test fixtures."""
        import shutil
        shutil.rmtree(self.temp_dir)
    
    def create_config_file(self, content: dict) -> Path:
        """Create a temporary config file."""
        config_path = self.temp_dir / "bible_config.yaml"
        with open(config_path, 'w', encoding='utf-8') as f:
            yaml.dump(content, f)
        return config_path
    
    def test_load_valid_config(self):
        """Test loading a valid configuration."""
        config_data = {
            'chapter_boundary_patterns': [
                '^<!--\\s*SSM:CHUNK_BOUNDARY\\s+id="ch(\\d+)-start"\\s*-->$'
            ],
            'chapter_title_patterns': [
                '^📘\\s*CHAPTER\\s+(\\d+)\\s+[-—]\\s+(.*)$'
            ],
            'part_header_patterns': [
                '^#\\s*Part\\s+([IVXLC]+):\\s*(.*)$'
            ],
            'slug_rules': {
                'remove_emoji': True,
                'lowercase': True,
                'replace_non_alnum_with_space': True,
                'collapse_whitespace': True
            },
            'book_metadata': {
                'title': 'Test Bible',
                'version': '1.0.0',
                'namespace': 'test_bible'
            }
        }
        config_path = self.create_config_file(config_data)
        
        config = load_config(config_path)
        
        self.assertIsInstance(config, BibleConfig)
        self.assertEqual(len(config.chapter_boundary_patterns), 1)
        self.assertEqual(len(config.chapter_title_patterns), 1)
        self.assertEqual(len(config.part_header_patterns), 1)
        self.assertIsInstance(config.slug_rules, SlugRules)
        self.assertIsInstance(config.book_metadata, BookMetadata)
        self.assertEqual(config.book_metadata.title, 'Test Bible')
    
    def test_load_config_with_defaults(self):
        """Test loading config with minimal required fields."""
        config_data = {
            'chapter_boundary_patterns': [
                '^<!--\\s*SSM:CHUNK_BOUNDARY\\s+id="ch(\\d+)-start"\\s*-->$'
            ],
            'chapter_title_patterns': [
                '^CHAPTER\\s+(\\d+):\\s+(.*)$'
            ]
        }
        config_path = self.create_config_file(config_data)
        
        config = load_config(config_path)
        
        self.assertIsInstance(config, BibleConfig)
        self.assertEqual(len(config.part_header_patterns), 0)
        self.assertIsNone(config.book_metadata)
        # Check default slug rules
        self.assertTrue(config.slug_rules.remove_emoji)
        self.assertTrue(config.slug_rules.lowercase)
    
    def test_missing_file(self):
        """Test error when config file doesn't exist."""
        config_path = self.temp_dir / "nonexistent.yaml"
        
        with self.assertRaises(FileNotFoundError):
            load_config(config_path)
    
    def test_missing_boundary_patterns(self):
        """Test error when chapter_boundary_patterns is missing."""
        config_data = {
            'chapter_title_patterns': ['^CHAPTER\\s+(\\d+)$']
        }
        config_path = self.create_config_file(config_data)
        
        with self.assertRaises(ConfigError) as cm:
            load_config(config_path)
        self.assertIn('chapter_boundary_pattern', str(cm.exception))
    
    def test_missing_title_patterns(self):
        """Test error when chapter_title_patterns is missing."""
        config_data = {
            'chapter_boundary_patterns': ['^<!--.*-->$']
        }
        config_path = self.create_config_file(config_data)
        
        with self.assertRaises(ConfigError) as cm:
            load_config(config_path)
        self.assertIn('chapter_title_pattern', str(cm.exception))
    
    def test_empty_boundary_patterns(self):
        """Test error when chapter_boundary_patterns is empty."""
        config_data = {
            'chapter_boundary_patterns': [],
            'chapter_title_patterns': ['^CHAPTER\\s+(\\d+)$']
        }
        config_path = self.create_config_file(config_data)
        
        with self.assertRaises(ConfigError) as cm:
            load_config(config_path)
        self.assertIn('At least one', str(cm.exception))
    
    def test_invalid_yaml(self):
        """Test error when YAML is invalid."""
        config_path = self.temp_dir / "invalid.yaml"
        with open(config_path, 'w', encoding='utf-8') as f:
            f.write("invalid: yaml: [unclosed")
        
        with self.assertRaises(ConfigError):
            load_config(config_path)
    
    def test_slug_rules_customization(self):
        """Test custom slug rules."""
        config_data = {
            'chapter_boundary_patterns': ['^<!--.*-->$'],
            'chapter_title_patterns': ['^CHAPTER\\s+(\\d+)$'],
            'slug_rules': {
                'remove_emoji': False,
                'lowercase': False,
                'replace_non_alnum_with_space': False,
                'collapse_whitespace': False
            }
        }
        config_path = self.create_config_file(config_data)
        
        config = load_config(config_path)
        
        self.assertFalse(config.slug_rules.remove_emoji)
        self.assertFalse(config.slug_rules.lowercase)
        self.assertFalse(config.slug_rules.replace_non_alnum_with_space)
        self.assertFalse(config.slug_rules.collapse_whitespace)
    
    def test_book_metadata_required_title(self):
        """Test that book_metadata requires title."""
        config_data = {
            'chapter_boundary_patterns': ['^<!--.*-->$'],
            'chapter_title_patterns': ['^CHAPTER\\s+(\\d+)$'],
            'book_metadata': {
                'version': '1.0.0'
            }
        }
        config_path = self.create_config_file(config_data)
        
        with self.assertRaises(ConfigError) as cm:
            load_config(config_path)
        self.assertIn('title', str(cm.exception))


if __name__ == '__main__':
    unittest.main()

