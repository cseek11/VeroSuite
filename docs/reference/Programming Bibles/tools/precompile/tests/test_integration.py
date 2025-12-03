"""Integration tests for the complete split-merge workflow."""

import unittest
import tempfile
import yaml
import sys
from pathlib import Path

# Add parent directory to path for imports
sys.path.insert(0, str(Path(__file__).parent.parent))

from split_book import split_book
from merge_book import merge_book


class TestIntegration(unittest.TestCase):
    """Test complete split-merge workflow."""
    
    def setUp(self):
        """Set up test fixtures."""
        self.temp_dir = Path(tempfile.mkdtemp())
        self.source_dir = self.temp_dir / "source"
        self.config_dir = self.temp_dir / "config"
        self.chapters_dir = self.temp_dir / "chapters"
        self.dist_dir = self.temp_dir / "dist"
        
        for d in [self.source_dir, self.config_dir, self.chapters_dir, self.dist_dir]:
            d.mkdir(parents=True, exist_ok=True)
    
    def tearDown(self):
        """Clean up test fixtures."""
        import shutil
        shutil.rmtree(self.temp_dir)
    
    def create_config(self) -> Path:
        """Create test configuration."""
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
    
    def test_round_trip(self):
        """Test complete split-merge round trip."""
        # Create source file
        source_content = """# Part I: Foundations

Some frontmatter.

<!-- SSM:CHUNK_BOUNDARY id="ch01-start" -->
📘 CHAPTER 1 — INTRODUCTION

This is chapter 1.

It has multiple paragraphs.

<!-- SSM:CHUNK_BOUNDARY id="ch02-start" -->
📘 CHAPTER 2 — SYNTAX

This is chapter 2.

```python
def hello():
    print("world")
```
"""
        source_path = self.source_dir / "test_bible.md"
        with open(source_path, 'w', encoding='utf-8') as f:
            f.write(source_content)
        
        # Split
        config_path = self.create_config()
        book_yaml_path = self.config_dir / "book.yaml"
        
        split_result = split_book(
            source_path,
            self.chapters_dir,
            config_path,
            book_yaml_path,
            dry_run=False,
            verbose=False
        )
        self.assertEqual(split_result, 0)
        
        # Verify chapters were created
        ch01_path = self.chapters_dir / "01_introduction.md"
        ch02_path = self.chapters_dir / "02_syntax.md"
        self.assertTrue(ch01_path.exists())
        self.assertTrue(ch02_path.exists())
        
        # Merge
        output_path = self.dist_dir / "book_raw.md"
        
        merge_result = merge_book(
            book_yaml_path,
            output_path,
            base_dir=self.temp_dir,
            inject_parts=False,
            dry_run=False,
            verbose=False
        )
        self.assertEqual(merge_result, 0)
        
        # Verify merged file exists
        self.assertTrue(output_path.exists())
        
        # Read merged content
        with open(output_path, 'r', encoding='utf-8') as f:
            merged_content = f.read()
        
        # Verify all original content is present
        self.assertIn("CHAPTER 1", merged_content)
        self.assertIn("CHAPTER 2", merged_content)
        self.assertIn("This is chapter 1", merged_content)
        self.assertIn("This is chapter 2", merged_content)
        self.assertIn("```python", merged_content)
        self.assertIn("frontmatter", merged_content)
    
    def test_round_trip_with_edits(self):
        """Test round trip where chapters are edited."""
        # Create source
        source_content = """<!-- SSM:CHUNK_BOUNDARY id="ch01-start" -->
📘 CHAPTER 1 — ORIGINAL

Original content.
"""
        source_path = self.source_dir / "test_bible.md"
        with open(source_path, 'w', encoding='utf-8') as f:
            f.write(source_content)
        
        # Split
        config_path = self.create_config()
        book_yaml_path = self.config_dir / "book.yaml"
        
        split_result = split_book(
            source_path,
            self.chapters_dir,
            config_path,
            book_yaml_path,
            dry_run=False,
            verbose=False
        )
        self.assertEqual(split_result, 0)
        
        # Edit chapter file
        ch01_path = self.chapters_dir / "01_original.md"
        with open(ch01_path, 'r', encoding='utf-8') as f:
            edited_content = f.read().replace("Original content", "EDITED CONTENT")
        with open(ch01_path, 'w', encoding='utf-8') as f:
            f.write(edited_content)
        
        # Merge
        output_path = self.dist_dir / "book_raw.md"
        
        merge_result = merge_book(
            book_yaml_path,
            output_path,
            base_dir=self.temp_dir,
            inject_parts=False,
            dry_run=False,
            verbose=False
        )
        self.assertEqual(merge_result, 0)
        
        # Verify edit is in merged output
        with open(output_path, 'r', encoding='utf-8') as f:
            merged_content = f.read()
        
        self.assertIn("EDITED CONTENT", merged_content)
        self.assertNotIn("Original content", merged_content)
    
    def test_multiple_parts_round_trip(self):
        """Test round trip with multiple parts."""
        source_content = """# Part I: Foundations

<!-- SSM:CHUNK_BOUNDARY id="ch01-start" -->
📘 CHAPTER 1 — INTRO

Content 1.

# Part II: Advanced

<!-- SSM:CHUNK_BOUNDARY id="ch02-start" -->
📘 CHAPTER 2 — ADVANCED

Content 2.
"""
        source_path = self.source_dir / "test_bible.md"
        with open(source_path, 'w', encoding='utf-8') as f:
            f.write(source_content)
        
        # Split
        config_path = self.create_config()
        book_yaml_path = self.config_dir / "book.yaml"
        
        split_result = split_book(
            source_path,
            self.chapters_dir,
            config_path,
            book_yaml_path,
            dry_run=False,
            verbose=False
        )
        self.assertEqual(split_result, 0)
        
        # Merge with part injection
        output_path = self.dist_dir / "book_raw.md"
        
        merge_result = merge_book(
            book_yaml_path,
            output_path,
            base_dir=self.temp_dir,
            inject_parts=True,
            dry_run=False,
            verbose=False
        )
        self.assertEqual(merge_result, 0)
        
        # Verify parts are in output
        with open(output_path, 'r', encoding='utf-8') as f:
            merged_content = f.read()
        
        self.assertIn("# Part I: Foundations", merged_content)
        self.assertIn("# Part II: Advanced", merged_content)


if __name__ == '__main__':
    unittest.main()

