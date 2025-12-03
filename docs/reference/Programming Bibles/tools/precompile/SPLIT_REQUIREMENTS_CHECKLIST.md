# Split Book Requirements Checklist

Use this checklist to verify that a source file is ready to be split by `split_book.py`.

## Pre-Split Checklist

### 1. Configuration File Requirements

- [ ] **Configuration file exists** at the specified `--config` path
- [ ] **Configuration file is valid YAML** (no syntax errors)
- [ ] **`chapter_boundary_patterns`** is defined (at least one pattern required)
  - [ ] Pattern must capture chapter number in regex group 1: `(\d+)`
  - [ ] Pattern is a valid regex (no syntax errors)
- [ ] **`chapter_title_patterns`** is defined (at least one pattern required)
  - [ ] Pattern must capture chapter number in regex group 1: `(\d+)`
  - [ ] Pattern should capture title in regex group 2: `(.*)` (optional but recommended)
  - [ ] Pattern is a valid regex (no syntax errors)
- [ ] **`part_header_patterns`** is defined (optional, but recommended)
  - [ ] Pattern must capture part identifier in regex group 1
  - [ ] Pattern should capture part name in regex group 2
  - [ ] Pattern is a valid regex (no syntax errors)
- [ ] **`slug_rules`** section exists (optional, defaults provided)
- [ ] **`book_metadata`** section exists (optional)
  - [ ] If present, must include `title` field

### 2. Source File Format Requirements

- [ ] **Source file exists** at the specified `--input` path
- [ ] **Source file is readable** (correct permissions, not locked)
- [ ] **Source file is valid UTF-8** (no encoding errors)
- [ ] **At least one chapter boundary pattern matches** in the source file
  - [ ] OR at least one chapter title pattern matches in the source file
- [ ] **Chapter boundaries are correctly numbered** (if using boundary markers)
  - [ ] Boundary markers use format: `ch(\d+)-start` where number matches actual chapter
  - [ ] No duplicate chapter numbers in boundary markers
- [ ] **Chapter titles are correctly numbered** (if using title patterns)
  - [ ] Chapter numbers in titles match sequential order (1, 2, 3, ...)
  - [ ] No duplicate chapter numbers in titles
  - [ ] Chapter numbers are consistent between boundaries and titles (if both used)

### 3. Pattern Matching Requirements

- [ ] **Boundary patterns match source file format**
  - [ ] Example: `<!-- SSM:CHUNK_BOUNDARY id="ch01-start" -->` matches pattern
  - [ ] Chapter number is correctly extracted from match
- [ ] **Title patterns match source file format**
  - [ ] Example: `📘 CHAPTER 1 — INTRODUCTION` matches pattern
  - [ ] Chapter number is correctly extracted from match
  - [ ] Title text is correctly extracted from match (if group 2 exists)
- [ ] **Part header patterns match source file format** (if parts are used)
  - [ ] Example: `# Part I: Foundations` matches pattern
  - [ ] Part identifier and name are correctly extracted

### 4. File System Requirements

- [ ] **Output directory exists or can be created**
  - [ ] Path specified in `--output` is valid
  - [ ] Write permissions available for output directory
- [ ] **Book YAML output path is writable**
  - [ ] Path specified in `--book-yaml` is valid
  - [ ] Parent directory exists (if creating new file)
  - [ ] Write permissions available for YAML file location

### 5. Content Structure Requirements

- [ ] **Chapters are clearly separated** (either by boundaries or titles)
- [ ] **No overlapping chapter content** (each line belongs to exactly one chapter)
- [ ] **Frontmatter (if any) is before first chapter** (will be included in Chapter 1)
- [ ] **Part headers (if any) appear before chapters they contain**
- [ ] **Chapter numbering is sequential** (1, 2, 3, ...) or at least consistent

### 6. Common Issues to Check

- [ ] **No incorrect boundary markers** (e.g., `ch26-start` before Chapter 27)
- [ ] **No missing chapter numbers** (gaps in sequence will generate warnings)
- [ ] **No duplicate chapter numbers** (will generate warnings and may cause issues)
- [ ] **No special characters breaking regex** (escape special regex chars in patterns)
- [ ] **No encoding issues** (file must be valid UTF-8)

## Quick Validation Commands

### Test Configuration File
```bash
python -c "from tools.precompile.loaders.config_loader import load_config; from pathlib import Path; load_config(Path('bibles/YOUR_BIBLE/config/bible_config.yaml'))"
```

### Test Pattern Matching
```bash
python -c "from tools.precompile.loaders.pattern_loader import PatternLoader; from tools.precompile.loaders.config_loader import load_config; from pathlib import Path; config = load_config(Path('bibles/YOUR_BIBLE/config/bible_config.yaml')); loader = PatternLoader(config); print('Boundary match:', loader.match_chapter_boundary('<!-- SSM:CHUNK_BOUNDARY id=\"ch01-start\" -->')); print('Title match:', loader.match_chapter_title('📘 CHAPTER 1 — TITLE'))"
```

### Dry Run Split
```bash
python tools/precompile/split_book.py \
  --config bibles/YOUR_BIBLE/config/bible_config.yaml \
  --input bibles/YOUR_BIBLE/source/YOUR_BIBLE.md \
  --output bibles/YOUR_BIBLE/chapters/ \
  --book-yaml bibles/YOUR_BIBLE/config/book.yaml \
  --dry-run \
  --verbose
```

## Expected Output

If all requirements are met, you should see:
- ✅ "Loaded configuration from ..."
- ✅ "Compiled pattern matchers"
- ✅ "Read X lines from ..."
- ✅ "Processed N chapters"
- ✅ "Chapter files written to ..."
- ✅ "Book structure written to ..."
- ⚠️  Warnings only for non-critical issues (missing numbers, out-of-order)

## Error Indicators

If requirements are NOT met, you may see:
- ❌ "Configuration file not found" → Check config path
- ❌ "At least one chapter_boundary_pattern must be defined" → Add patterns to config
- ❌ "Invalid regex pattern" → Fix regex syntax in config
- ❌ "Input file not found" → Check source file path
- ❌ "Failed to write chapter" → Check output directory permissions
- ⚠️  "Duplicate chapter numbers detected" → Fix source file numbering
- ⚠️  "Missing chapter numbers" → Check for gaps in sequence

## Minimum Requirements Summary

**Absolute minimum for successful split:**
1. Valid `bible_config.yaml` with at least one `chapter_boundary_pattern` OR one `chapter_title_pattern`
2. Source file exists and is readable
3. At least one pattern matches in the source file
4. Output directory is writable

**Recommended for best results:**
- Both boundary and title patterns defined
- Part header patterns defined
- Consistent chapter numbering
- No duplicate chapter numbers
- Sequential chapter numbering (1, 2, 3, ...)


