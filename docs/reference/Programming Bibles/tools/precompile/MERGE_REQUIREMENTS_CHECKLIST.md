# Merge Book Requirements Checklist

Use this checklist to verify that chapter files are ready to be merged by `merge_book.py`.

## Pre-Merge Checklist

### 1. Book Structure File Requirements

- [ ] **`book.yaml` file exists** at the specified `--book-yaml` path
- [ ] **`book.yaml` is valid YAML** (no syntax errors)
- [ ] **`book.yaml` contains `parts` list** (required field)
- [ ] **Each part has `name` field** (required for part identification)
- [ ] **Each part has `chapters` list** (required, even if empty)
- [ ] **Chapter paths are correctly formatted** (relative paths like `chapters/01_intro.md`)
- [ ] **No duplicate chapter paths** in the entire `book.yaml`
- [ ] **Chapter paths use forward slashes** (`/`) not backslashes (`\`)
- [ ] **All chapter paths reference actual files** (files must exist)

### 2. Chapter File Requirements

- [ ] **All chapter files listed in `book.yaml` exist**
  - [ ] Files are at the correct paths relative to base directory
  - [ ] Files are readable (correct permissions, not locked)
  - [ ] Files are valid UTF-8 (no encoding errors)
- [ ] **No extra chapter files** (files not listed in `book.yaml` are ignored)
- [ ] **Chapter files contain valid markdown content**
- [ ] **Chapter files are not empty** (empty files will create blank sections)

### 3. File System Requirements

- [ ] **Base directory is correct** (default: `book.yaml` parent parent)
  - [ ] Or explicitly set with `--base-dir` flag
  - [ ] Base directory contains the `chapters/` subdirectory
- [ ] **Output directory exists or can be created**
  - [ ] Path specified in `--output` is valid
  - [ ] Parent directory exists (if creating new file)
  - [ ] Write permissions available for output directory
- [ ] **Output file path is writable**
  - [ ] File doesn't exist (will be overwritten) OR
  - [ ] File exists and is writable (will be replaced)

### 4. Content Preservation Requirements

- [ ] **All chapter content is preserved** (exact byte-for-byte except trailing newlines)
- [ ] **Chapter order matches `book.yaml`** (chapters merged in order specified)
- [ ] **Part structure is preserved** (if using parts, order maintained)
- [ ] **No content modification** (only whitespace normalization)
  - [ ] Trailing newlines removed from each chapter
  - [ ] Exactly one blank line added between chapters
  - [ ] Final newline added to output file

### 5. Content Type Preservation

The following content types are preserved exactly:
- [ ] **SSM blocks** (`:::example`, `:::concept`, etc.)
- [ ] **HTML comments** (`<!-- ... -->`)
- [ ] **Mermaid diagrams** (```mermaid ... ```)
- [ ] **Code fences** (```python ... ```)
- [ ] **Tables** (markdown table syntax)
- [ ] **Markdown headings** (`#`, `##`, etc.)
- [ ] **Inline code** (`` `code` ``)
- [ ] **Links and images** (`[text](url)`, `![alt](url)`)
- [ ] **Emoji and special characters** (UTF-8 preserved)
- [ ] **Frontmatter** (YAML frontmatter in Chapter 1)

### 6. Structure Requirements

- [ ] **Chapter sequence is logical** (as defined in `book.yaml`)
- [ ] **Part boundaries are clear** (if using parts)
- [ ] **No missing chapters** (gaps in sequence are allowed but may indicate issues)
- [ ] **Chapter numbering is consistent** (if numbered, should match order)

### 7. Common Issues to Check

- [ ] **No missing chapter files** (all paths in `book.yaml` must exist)
- [ ] **No incorrect paths** (relative paths must be correct from base directory)
- [ ] **No duplicate chapter paths** (same file listed twice)
- [ ] **No circular references** (chapters don't reference themselves)
- [ ] **No encoding issues** (all files must be valid UTF-8)
- [ ] **No locked files** (files must be readable)

## Quick Validation Commands

### Test Book YAML Structure
```bash
python -c "import yaml; from pathlib import Path; data = yaml.safe_load(open('bibles/YOUR_BIBLE/config/book.yaml')); print('Parts:', len(data.get('parts', []))); print('Total chapters:', sum(len(p.get('chapters', [])) for p in data.get('parts', [])))"
```

### Validate All Chapter Files Exist
```bash
python -c "import yaml; from pathlib import Path; data = yaml.safe_load(open('bibles/YOUR_BIBLE/config/book.yaml')); base = Path('bibles/YOUR_BIBLE'); missing = [p for part in data.get('parts', []) for p in part.get('chapters', []) if not (base / p).exists()]; print('Missing files:', missing if missing else 'None')"
```

### Dry Run Merge
```bash
python tools/precompile/merge_book.py \
  --book-yaml bibles/YOUR_BIBLE/config/book.yaml \
  --output bibles/YOUR_BIBLE/dist/book_raw.md \
  --dry-run \
  --verbose
```

### Check Output File Size
```bash
python -c "from pathlib import Path; chapters = Path('bibles/YOUR_BIBLE/chapters'); total = sum(f.stat().st_size for f in chapters.glob('*.md')); print(f'Total chapter size: {total:,} bytes')"
```

## Expected Output

If all requirements are met, you should see:
- ✅ "Loaded book structure: N parts"
- ✅ "Wrote merged book to ..."
- ✅ "Total chapters merged: N"
- ⚠️  Warnings only for non-critical issues (empty parts, etc.)

## Error Indicators

If requirements are NOT met, you may see:
- ❌ "Book structure file not found" → Check `book.yaml` path
- ❌ "Invalid YAML in book.yaml" → Fix YAML syntax
- ❌ "book.yaml must contain 'parts' list" → Add parts structure
- ❌ "Chapter file not found: ..." → Check file paths in `book.yaml`
- ❌ "Found N missing chapter files. Aborting." → Fix missing files
- ❌ "Failed to read chapter ..." → Check file permissions/encoding
- ❌ "Failed to write output file" → Check output directory permissions

## Minimum Requirements Summary

**Absolute minimum for successful merge:**
1. Valid `book.yaml` file with `parts` list
2. At least one chapter file exists and is listed in `book.yaml`
3. Output directory is writable
4. All chapter files listed in `book.yaml` exist and are readable

**Recommended for best results:**
- All chapters from split are present
- Chapter order matches logical sequence
- Part structure is organized
- No duplicate chapter paths
- Consistent file naming convention

## Content Preservation Guarantees

**What IS preserved:**
- ✅ All text content (exact characters)
- ✅ All formatting (markdown, code blocks, tables)
- ✅ All special content (SSM blocks, HTML comments, Mermaid)
- ✅ Chapter order (as specified in `book.yaml`)
- ✅ Part structure (if using parts)

**What IS normalized:**
- ⚠️ Trailing newlines removed from each chapter
- ⚠️ Exactly one blank line between chapters
- ⚠️ Final newline added to output file

**What is NOT modified:**
- ✅ Content within chapters (no changes)
- ✅ Line breaks within chapters (preserved)
- ✅ Whitespace within lines (preserved)
- ✅ Special characters and encoding (UTF-8 preserved)

## Verification After Merge

After merging, verify:
- [ ] Output file size is reasonable (sum of chapter files minus whitespace)
- [ ] All chapters appear in output (count chapter markers)
- [ ] Chapter order matches `book.yaml`
- [ ] No content appears duplicated
- [ ] No content appears missing
- [ ] Code blocks are intact (count ``` markers)
- [ ] Special content preserved (SSM blocks, Mermaid, etc.)

## Troubleshooting

**Issue: Missing chapter files**
- Check `book.yaml` paths are relative to base directory
- Verify files exist at specified paths
- Check for typos in file names

**Issue: Wrong chapter order**
- Verify `book.yaml` parts and chapters are in correct order
- Check chapter numbering if applicable

**Issue: Content missing**
- Verify all chapters are listed in `book.yaml`
- Check that no chapters were accidentally excluded
- Ensure chapter files contain expected content

**Issue: Encoding errors**
- Ensure all files are UTF-8 encoded
- Check for invalid characters in source files
- Verify file encoding before merge


