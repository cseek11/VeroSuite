#!/usr/bin/env python3
"""Validate TypeScript Bible configuration file."""
import yaml
from pathlib import Path

config_path = Path('docs/reference/Programming Bibles/bibles/typescript_bible/config/bible_config.yaml')
config = yaml.safe_load(config_path.read_text())

print('✅ Config loaded successfully')
print(f'Chapter patterns: {len(config.get("chapter_title_patterns", []))}')
print(f'Part patterns: {len(config.get("part_header_patterns", []))}')
print(f'Slug rules: {config.get("slug_rules", {})}')
print(f'Book metadata: {config.get("book_metadata", {})}')













