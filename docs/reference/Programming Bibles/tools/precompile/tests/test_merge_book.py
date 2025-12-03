"""Tests for merge_book functionality."""

import unittest
import tempfile
import yaml
import sys
from pathlib import Path

# Add parent directory to path for imports
sys.path.insert(0, str(Path(__file__).parent.parent))

from merge_book import merge_book


class TestMergeBook(unittest.TestCase):
    """Test merge_book functionality."""
    
    def setUp(self):
        """Set up test fixtures."""
        self.temp_dir = Path(tempfile.mkdtemp())
        self.config_dir = self.temp_dir / "config"
        self.chapters_dir = self.temp_dir / "chapters"
        self.dist_dir = self.temp_dir / "dist"
        self.config_dir.mkdir()
        self.chapters_dir.mkdir()
        self.dist_dir.mkdir()
    
    def tearDown(self):
        """Clean up test fixtures."""
        import shutil
        shutil.rmtree(self.temp_dir)
    
    def create_book_yaml(self, parts_data: list) -> Path:
        """Create a test book.yaml file."""
        book_yaml_path = self.config_dir / "book.yaml"
        book_data = {
            'title': 'Test Bible',
            'version': '1.0.0',
            'parts': parts_data
        }
        with open(book_yaml_path, 'w', encoding='utf-8') as f:
            yaml.dump(book_data, f)
        return book_yaml_path
    
    def create_chapter_file(self, filename: str, content: str) -> Path:
        """Create a test chapter file."""
        chapter_path = self.chapters_dir / filename
        with open(chapter_path, 'w', encoding='utf-8') as f:
            f.write(content)
        return chapter_path
    
    def test_merge_simple_chapters(self):
        """Test merging simple chapters."""
        # Create chapter files
        self.create_chapter_file("01_intro.md", "Chapter 1 content")
        self.create_chapter_file("02_syntax.md", "Chapter 2 content")
        
        # Create book.yaml
        parts_data = [
            {
                'name': 'All Chapters',
                'chapters': [
                    'chapters/01_intro.md',
                    'chapters/02_syntax.md'
                ]
            }
        ]
        book_yaml_path = self.create_book_yaml(parts_data)
        
        output_path = self.dist_dir / "book_raw.md"
        
        result = merge_book(
            book_yaml_path,
            output_path,
            base_dir=self.temp_dir,
            inject_parts=False,
            dry_run=False,
            verbose=False
        )
        
        self.assertEqual(result, 0)
        self.assertTrue(output_path.exists())
        
        # Check merged content
        with open(output_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        self.assertIn("Chapter 1 content", content)
        self.assertIn("Chapter 2 content", content)
        # Should have exactly one blank line between chapters
        self.assertIn("\n\n", content)
    
    def test_merge_with_parts(self):
        """Test merging with part headers."""
        # Create chapter files
        self.create_chapter_file("01_intro.md", "Chapter 1")
        self.create_chapter_file("02_syntax.md", "Chapter 2")
        
        # Create book.yaml with parts
        parts_data = [
            {
                'name': 'Part I: Foundations',
                'chapters': ['chapters/01_intro.md']
            },
            {
                'name': 'Part II: Advanced',
                'chapters': ['chapters/02_syntax.md']
            }
        ]
        book_yaml_path = self.create_book_yaml(parts_data)
        
        output_path = self.dist_dir / "book_raw.md"
        
        result = merge_book(
            book_yaml_path,
            output_path,
            base_dir=self.temp_dir,
            inject_parts=True,
            dry_run=False,
            verbose=False
        )
        
        self.assertEqual(result, 0)
        
        with open(output_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        self.assertIn("# Part I: Foundations", content)
        self.assertIn("# Part II: Advanced", content)
        self.assertIn("Chapter 1", content)
        self.assertIn("Chapter 2", content)
    
    def test_merge_preserves_whitespace(self):
        """Test that whitespace is normalized correctly."""
        # Create chapter with trailing newlines
        self.create_chapter_file("01_intro.md", "Chapter 1\n\n\n")
        self.create_chapter_file("02_syntax.md", "Chapter 2\n")
        
        parts_data = [
            {
                'name': 'All Chapters',
                'chapters': [
                    'chapters/01_intro.md',
                    'chapters/02_syntax.md'
                ]
            }
        ]
        book_yaml_path = self.create_book_yaml(parts_data)
        
        output_path = self.dist_dir / "book_raw.md"
        
        result = merge_book(
            book_yaml_path,
            output_path,
            base_dir=self.temp_dir,
            inject_parts=False,
            dry_run=False,
            verbose=False
        )
        
        self.assertEqual(result, 0)
        
        with open(output_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Should have exactly one blank line between chapters
        # Not multiple newlines
        lines = content.split('\n')
        # Find the separator between chapters
        self.assertIn("Chapter 1", content)
        self.assertIn("Chapter 2", content)
        # File should end with single newline
        self.assertTrue(content.endswith('\n'))
    
    def test_merge_missing_chapter(self):
        """Test error when chapter file is missing."""
        # Create only one chapter
        self.create_chapter_file("01_intro.md", "Chapter 1")
        
        # Reference two chapters in book.yaml
        parts_data = [
            {
                'name': 'All Chapters',
                'chapters': [
                    'chapters/01_intro.md',
                    'chapters/02_missing.md'  # Doesn't exist
                ]
            }
        ]
        book_yaml_path = self.create_book_yaml(parts_data)
        
        output_path = self.dist_dir / "book_raw.md"
        
        result = merge_book(
            book_yaml_path,
            output_path,
            base_dir=self.temp_dir,
            inject_parts=False,
            dry_run=False,
            verbose=False
        )
        
        self.assertEqual(result, 1)  # Should fail
        self.assertFalse(output_path.exists())
    
    def test_merge_missing_book_yaml(self):
        """Test error when book.yaml doesn't exist."""
        book_yaml_path = self.config_dir / "nonexistent.yaml"
        output_path = self.dist_dir / "book_raw.md"
        
        result = merge_book(
            book_yaml_path,
            output_path,
            base_dir=self.temp_dir,
            inject_parts=False,
            dry_run=False,
            verbose=False
        )
        
        self.assertEqual(result, 1)
    
    def test_merge_invalid_book_yaml(self):
        """Test error when book.yaml is invalid."""
        book_yaml_path = self.config_dir / "book.yaml"
        with open(book_yaml_path, 'w', encoding='utf-8') as f:
            f.write("invalid: yaml: [unclosed")
        
        output_path = self.dist_dir / "book_raw.md"
        
        result = merge_book(
            book_yaml_path,
            output_path,
            base_dir=self.temp_dir,
            inject_parts=False,
            dry_run=False,
            verbose=False
        )
        
        self.assertEqual(result, 1)
    
    def test_merge_dry_run(self):
        """Test dry run doesn't create output file."""
        self.create_chapter_file("01_intro.md", "Chapter 1")
        
        parts_data = [
            {
                'name': 'All Chapters',
                'chapters': ['chapters/01_intro.md']
            }
        ]
        book_yaml_path = self.create_book_yaml(parts_data)
        
        output_path = self.dist_dir / "book_raw.md"
        
        result = merge_book(
            book_yaml_path,
            output_path,
            base_dir=self.temp_dir,
            inject_parts=False,
            dry_run=True,
            verbose=False
        )
        
        self.assertEqual(result, 0)
        self.assertFalse(output_path.exists())
    
    def test_merge_complex_content(self):
        """Test merging chapters with complex content."""
        ch1_content = """# Chapter 1

```python
def hello():
    pass
```

| Table | Data |
|-------|------|
| Row   | Val  |
"""
        ch2_content = """# Chapter 2

:::example
Example content
:::
"""
        
        self.create_chapter_file("01_ch1.md", ch1_content)
        self.create_chapter_file("02_ch2.md", ch2_content)
        
        parts_data = [
            {
                'name': 'All Chapters',
                'chapters': [
                    'chapters/01_ch1.md',
                    'chapters/02_ch2.md'
                ]
            }
        ]
        book_yaml_path = self.create_book_yaml(parts_data)
        
        output_path = self.dist_dir / "book_raw.md"
        
        result = merge_book(
            book_yaml_path,
            output_path,
            base_dir=self.temp_dir,
            inject_parts=False,
            dry_run=False,
            verbose=False
        )
        
        self.assertEqual(result, 0)
        
        with open(output_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # All content should be preserved
        self.assertIn("```python", content)
        self.assertIn("| Table |", content)
        self.assertIn(":::example", content)


if __name__ == '__main__':
    unittest.main()

