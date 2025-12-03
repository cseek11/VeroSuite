# Merge Book Script - Usage Guide

**Last Updated:** 2025-11-30  
**Version:** 2.0.0

## Overview

The `merge_book.py` script merges individual chapter files into a single `{book_name}_raw.md` file, organized in book-specific directories under `/dist`.

## New Behavior (v2.0)

**Automatic Directory Organization:**
- Each book gets its own directory: `dist/{book_name}/`
- Merged file: `dist/{book_name}/{book_name}_raw.md`
- No need to specify output path (auto-generated from book title)

## Usage

### Basic Usage (Recommended)

```bash
python merge_book.py \
  --book-yaml "bibles/{book_name}/config/book.yaml"
```

**Output:**
- Creates: `bibles/{book_name}/dist/{book_name}/{book_name}_raw.md`
- Example: `bibles/python_bible/dist/python_bible/python_bible_raw.md`

### With Custom Dist Directory

```bash
python merge_book.py \
  --book-yaml "bibles/{book_name}/config/book.yaml" \
  --dist-dir "path/to/dist"
```

**Output:**
- Creates: `path/to/dist/{book_name}/{book_name}_raw.md`

### With Explicit Output Path (Legacy)

```bash
python merge_book.py \
  --book-yaml "bibles/{book_name}/config/book.yaml" \
  --output "path/to/output.md"
```

**Output:**
- Creates: `path/to/output.md`
- If output ends with `book_raw.md`, filename is auto-generated from book title

## Directory Structure

### Before Merge

```
bibles/
  {book_name}/
    config/
      book.yaml
    chapters/
      01_chapter.md
      02_chapter.md
      ...
    dist/
      (empty or old files)
```

### After Merge

```
bibles/
  {book_name}/
    config/
      book.yaml
    chapters/
      01_chapter.md
      02_chapter.md
      ...
    dist/
      {book_name}/
        {book_name}_raw.md    ← Merged file here
```

## Examples

### Python Bible

```bash
python merge_book.py \
  --book-yaml "bibles/python_bible/config/book.yaml"
```

**Creates:**
- `bibles/python_bible/dist/python_bible/python_bible_raw.md`

### Multiple Books

Each book gets its own directory:

```bash
# Python Bible
python merge_book.py \
  --book-yaml "bibles/python_bible/config/book.yaml"
# Creates: bibles/python_bible/dist/python_bible/python_bible_raw.md

# Rego Bible
python merge_book.py \
  --book-yaml "bibles/rego_bible/config/book.yaml"
# Creates: bibles/rego_bible/dist/rego_bible/rego_bible_raw.md
```

## Command-Line Options

| Option | Required | Default | Description |
|--------|----------|---------|-------------|
| `--book-yaml` | ✅ Yes | - | Path to `book.yaml` structure file |
| `--output` | ❌ No | Auto-generated | Explicit output file path (overrides auto-generation) |
| `--dist-dir` | ❌ No | `{base_dir}/dist` | Base directory for organized output |
| `--base-dir` | ❌ No | `{book_yaml}/../..` | Base directory for resolving chapter paths |
| `--inject-parts` | ❌ No | `False` | Inject part headers into merged output |
| `--verbose` | ❌ No | `False` | Enable verbose logging |
| `--dry-run` | ❌ No | `False` | Process without writing output file |

## Book Title to Filename Conversion

The script automatically converts book titles to filename-safe slugs:

| Book Title | Slug | Output Filename |
|------------|------|-----------------|
| `Python Bible` | `python_bible` | `python_bible_raw.md` |
| `JavaScript Guide` | `javascript_guide` | `javascript_guide_raw.md` |
| `C++ Primer` | `c_primer` | `c_primer_raw.md` |

## Integration with SSM Compiler

After merging, compile the merged file:

```bash
# Step 1: Merge chapters
python merge_book.py \
  --book-yaml "bibles/python_bible/config/book.yaml"

# Step 2: Compile to SSM
python ssm_compiler/main.py \
  "bibles/python_bible/dist/python_bible/python_bible_raw.md" \
  "bibles/python_bible/dist/python_bible/python_bible.ssm.md"
```

## Benefits

✅ **Automatic Organization** - Each book in its own directory  
✅ **No Path Conflicts** - Multiple books can be merged independently  
✅ **Clear Structure** - Easy to find merged files by book name  
✅ **Backward Compatible** - Still supports explicit `--output` path  

## Migration from v1.0

**Old Usage:**
```bash
python merge_book.py \
  --book-yaml "bibles/python_bible/config/book.yaml" \
  --output "bibles/python_bible/dist/book_raw.md"
```

**New Usage (Recommended):**
```bash
python merge_book.py \
  --book-yaml "bibles/python_bible/config/book.yaml"
```

The output is automatically organized in `dist/{book_name}/` directory.

---

**Last Updated:** 2025-11-30























