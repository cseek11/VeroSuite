"""Tests for split_book functionality."""

import unittest
import tempfile
import yaml
import sys
from pathlib import Path

# Add parent directory to path for imports
sys.path.insert(0, str(Path(__file__).parent.parent))

from split_book import (
    split_book,
    slugify_title,
    ChapterMeta
)
from loaders.config_loader import SlugRules


class TestSlugifyTitle(unittest.TestCase):
    """Test title slugification."""
    
    def test_basic_slug(self):
        """Test basic slug generation."""
        rules = SlugRules()
        result = slugify_title("Introduction to Python", rules)
        self.assertEqual(result, "introduction_to_python")
    
    def test_remove_emoji(self):
        """Test emoji removal."""
        rules = SlugRules(remove_emoji=True)
        result = slugify_title("📘 Introduction to Python", rules)
        self.assertNotIn("📘", result)
    
    def test_lowercase(self):
        """Test lowercase conversion."""
        rules = SlugRules(lowercase=True)
        result = slugify_title("INTRODUCTION TO PYTHON", rules)
        self.assertEqual(result, "introduction_to_python")
        
        rules = SlugRules(lowercase=False)
        result = slugify_title("Introduction to Python", rules)
        self.assertIn("Introduction", result)
    
    def test_replace_non_alnum(self):
        """Test non-alphanumeric replacement."""
        rules = SlugRules()
        result = slugify_title("Chapter 1: Introduction!", rules)
        self.assertNotIn(":", result)
        self.assertNotIn("!", result)
    
    def test_collapse_whitespace(self):
        """Test whitespace collapsing."""
        rules = SlugRules()
        result = slugify_title("Introduction   to     Python", rules)
        self.assertNotIn("  ", result)
    
    def test_empty_title(self):
        """Test empty title defaults to 'chapter'."""
        rules = SlugRules()
        result = slugify_title("", rules)
        self.assertEqual(result, "chapter")
    
    def test_special_characters(self):
        """Test handling of special characters."""
        rules = SlugRules()
        result = slugify_title("Chapter 1 — Introduction (Part A)", rules)
        # Should handle em dash, parentheses
        self.assertIsInstance(result, str)
        self.assertGreater(len(result), 0)


class TestSplitBook(unittest.TestCase):
    """Test split_book functionality."""
    
    def setUp(self):
        """Set up test fixtures."""
        self.temp_dir = Path(tempfile.mkdtemp())
        self.source_dir = self.temp_dir / "source"
        self.config_dir = self.temp_dir / "config"
        self.chapters_dir = self.temp_dir / "chapters"
        self.source_dir.mkdir()
        self.config_dir.mkdir()
        self.chapters_dir.mkdir()
    
    def tearDown(self):
        """Clean up test fixtures."""
        import shutil
        shutil.rmtree(self.temp_dir)
    
    def create_test_config(self) -> Path:
        """Create a test configuration file."""
        config_path = self.config_dir / "bible_config.yaml"
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
        with open(config_path, 'w', encoding='utf-8') as f:
            yaml.dump(config_data, f)
        return config_path
    
    def create_test_source(self, content: str) -> Path:
        """Create a test source file."""
        source_path = self.source_dir / "test_bible.md"
        with open(source_path, 'w', encoding='utf-8') as f:
            f.write(content)
        return source_path
    
    def test_split_simple_book(self):
        """Test splitting a simple two-chapter book."""
        config_path = self.create_test_config()
        
        source_content = """# Introduction

Some frontmatter.

<!-- SSM:CHUNK_BOUNDARY id="ch01-start" -->
📘 CHAPTER 1 — INTRODUCTION

This is chapter 1 content.

Some more content.

<!-- SSM:CHUNK_BOUNDARY id="ch02-start" -->
📘 CHAPTER 2 — SYNTAX

This is chapter 2 content.
"""
        source_path = self.create_test_source(source_content)
        book_yaml_path = self.config_dir / "book.yaml"
        
        result = split_book(
            source_path,
            self.chapters_dir,
            config_path,
            book_yaml_path,
            dry_run=False,
            verbose=False
        )
        
        self.assertEqual(result, 0)
        
        # Check chapter files were created
        ch01_path = self.chapters_dir / "01_introduction.md"
        ch02_path = self.chapters_dir / "02_syntax.md"
        
        self.assertTrue(ch01_path.exists())
        self.assertTrue(ch02_path.exists())
        
        # Check chapter 1 content
        with open(ch01_path, 'r', encoding='utf-8') as f:
            ch01_content = f.read()
        self.assertIn("CHAPTER 1", ch01_content)
        self.assertIn("This is chapter 1", ch01_content)
        self.assertIn("frontmatter", ch01_content)
        
        # Check chapter 2 content
        with open(ch02_path, 'r', encoding='utf-8') as f:
            ch02_content = f.read()
        self.assertIn("CHAPTER 2", ch02_content)
        self.assertIn("This is chapter 2", ch02_content)
        
        # Check book.yaml was created
        self.assertTrue(book_yaml_path.exists())
        with open(book_yaml_path, 'r', encoding='utf-8') as f:
            book_data = yaml.safe_load(f)
        self.assertEqual(book_data['title'], 'Test Bible')
        self.assertIn('parts', book_data)
    
    def test_split_with_parts(self):
        """Test splitting a book with parts."""
        config_path = self.create_test_config()
        
        source_content = """# Part I: Foundations

<!-- SSM:CHUNK_BOUNDARY id="ch01-start" -->
📘 CHAPTER 1 — INTRODUCTION

Chapter 1 content.

# Part II: Advanced

<!-- SSM:CHUNK_BOUNDARY id="ch02-start" -->
📘 CHAPTER 2 — ADVANCED TOPICS

Chapter 2 content.
"""
        source_path = self.create_test_source(source_content)
        book_yaml_path = self.config_dir / "book.yaml"
        
        result = split_book(
            source_path,
            self.chapters_dir,
            config_path,
            book_yaml_path,
            dry_run=False,
            verbose=False
        )
        
        self.assertEqual(result, 0)
        
        # Check book.yaml has parts
        with open(book_yaml_path, 'r', encoding='utf-8') as f:
            book_data = yaml.safe_load(f)
        self.assertGreaterEqual(len(book_data['parts']), 1)
    
    def test_split_dry_run(self):
        """Test dry run doesn't create files."""
        config_path = self.create_test_config()
        
        source_content = """<!-- SSM:CHUNK_BOUNDARY id="ch01-start" -->
📘 CHAPTER 1 — INTRODUCTION

Content.
"""
        source_path = self.create_test_source(source_content)
        book_yaml_path = self.config_dir / "book.yaml"
        
        result = split_book(
            source_path,
            self.chapters_dir,
            config_path,
            book_yaml_path,
            dry_run=True,
            verbose=False
        )
        
        self.assertEqual(result, 0)
        
        # Check no files were created
        ch01_path = self.chapters_dir / "01_introduction.md"
        self.assertFalse(ch01_path.exists())
        self.assertFalse(book_yaml_path.exists())
    
    def test_split_missing_input(self):
        """Test error when input file doesn't exist."""
        config_path = self.create_test_config()
        source_path = self.source_dir / "nonexistent.md"
        book_yaml_path = self.config_dir / "book.yaml"
        
        result = split_book(
            source_path,
            self.chapters_dir,
            config_path,
            book_yaml_path,
            dry_run=False,
            verbose=False
        )
        
        self.assertEqual(result, 1)
    
    def test_split_missing_config(self):
        """Test error when config file doesn't exist."""
        config_path = self.config_dir / "nonexistent.yaml"
        source_content = "Content"
        source_path = self.create_test_source(source_content)
        book_yaml_path = self.config_dir / "book.yaml"
        
        result = split_book(
            source_path,
            self.chapters_dir,
            config_path,
            book_yaml_path,
            dry_run=False,
            verbose=False
        )
        
        self.assertEqual(result, 1)
    
    def test_split_preserves_content(self):
        """Test that all content types are preserved."""
        config_path = self.create_test_config()
        
        source_content = """<!-- SSM:CHUNK_BOUNDARY id="ch01-start" -->
📘 CHAPTER 1 — TEST

Regular text.

```python
def hello():
    print("world")
```

:::example
Example block
:::

| Table | Header |
|-------|--------|
| Row   | Data   |

<!-- HTML comment -->

```mermaid
graph TD
    A --> B
```
"""
        source_path = self.create_test_source(source_content)
        book_yaml_path = self.config_dir / "book.yaml"
        
        result = split_book(
            source_path,
            self.chapters_dir,
            config_path,
            book_yaml_path,
            dry_run=False,
            verbose=False
        )
        
        self.assertEqual(result, 0)
        
        ch01_path = self.chapters_dir / "01_test.md"
        with open(ch01_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Check all content types preserved
        self.assertIn("```python", content)
        self.assertIn(":::example", content)
        self.assertIn("| Table |", content)
        self.assertIn("<!-- HTML comment -->", content)
        self.assertIn("```mermaid", content)


if __name__ == '__main__':
    unittest.main()

