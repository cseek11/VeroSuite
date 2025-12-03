# Requirements for Successful Compile and Ingest

**Last Updated:** 2025-11-30  
**Version:** 1.0.0

## Overview

This document defines all requirements that must be met for a successful Bible compilation and ingestion pipeline. These requirements apply to the complete pipeline: **Merge → Compile → Ingest**.

---

## Table of Contents

1. [Merge Stage Requirements](#merge-stage-requirements)
2. [Compile Stage Requirements](#compile-stage-requirements)
3. [Ingest Stage Requirements](#ingest-stage-requirements)
4. [Content Quality Requirements](#content-quality-requirements)
5. [Technical Requirements](#technical-requirements)
6. [File System Requirements](#file-system-requirements)
7. [Validation Requirements](#validation-requirements)

---

## Merge Stage Requirements

### 1. Book Structure File (`book.yaml`)

**Required Fields:**
- ✅ `parts` list (required, cannot be empty)
- ✅ Each part must have:
  - `name` field (string, required)
  - `chapters` list (array, required, can be empty)

**Format Requirements:**
- ✅ Valid YAML syntax (no syntax errors)
- ✅ Chapter paths use forward slashes (`/`) not backslashes (`\`)
- ✅ Chapter paths are relative to base directory
- ✅ No duplicate chapter paths in entire file
- ✅ All chapter paths reference actual files

**Example Structure:**
```yaml
parts:
  - name: "Part I: Foundations"
    chapters:
      - chapters/01_intro.md
      - chapters/02_basics.md
  - name: "Part II: Core Language"
    chapters:
      - chapters/03_types.md
```

### 2. Chapter Files

**File Requirements:**
- ✅ All chapter files listed in `book.yaml` must exist
- ✅ Files must be readable (correct permissions)
- ✅ Files must be valid UTF-8 (no encoding errors)
- ✅ Files must not be empty (size > 0)
- ✅ Files must contain valid markdown content

**Path Requirements:**
- ✅ Chapter paths must be relative to base directory
- ✅ Chapter paths must match actual file locations
- ✅ No typos or incorrect paths in `book.yaml`

### 3. Content Preservation

**What Must Be Preserved:**
- ✅ All text content (exact characters)
- ✅ All formatting (markdown, code blocks, tables)
- ✅ All special content:
  - SSM blocks (`:::example`, `:::concept`, etc.)
  - HTML comments (`<!-- ... -->`)
  - Mermaid diagrams (```mermaid ... ```)
  - Code fences (```language ... ```)
  - Frontmatter (YAML frontmatter in Chapter 1)

**What Is Normalized:**
- ⚠️ Trailing newlines removed from each chapter
- ⚠️ Exactly one blank line between chapters
- ⚠️ Final newline added to output file

**What Is NOT Modified:**
- ✅ Content within chapters (no changes)
- ✅ Line breaks within chapters (preserved)
- ✅ Whitespace within lines (preserved)
- ✅ Special characters and encoding (UTF-8 preserved)

### 4. Merge Output

**Output File Requirements:**
- ✅ Output file path is writable
- ✅ Output directory exists or can be created
- ✅ Output file contains all chapters in correct order
- ✅ Output file size is reasonable (sum of chapter files minus whitespace overhead)
- ✅ All content markers preserved (Mermaid, code blocks, SSM blocks)

---

## Compile Stage Requirements

### 1. Source File (Merged Output)

**File Requirements:**
- ✅ Merged source file exists (`dist/book_raw.md` or equivalent)
- ✅ File is readable (correct permissions)
- ✅ File is valid UTF-8 (no encoding errors)
- ✅ File is not empty (size > 0)
- ✅ File contains valid markdown (can be parsed)

**Content Requirements:**
- ✅ Chapter structure is valid (chapter headings present)
- ✅ SSM blocks are properly formatted (if present, use `:::block-type` syntax)
- ✅ Code blocks are properly fenced (```language ... ```)
- ✅ No malformed markdown (headings, lists, tables are valid)
- ✅ No circular references (chapters don't reference themselves infinitely)

### 2. SSM Compiler

**Compiler Requirements:**
- ✅ SSM Compiler script exists at expected path:
  - Primary: `docs/reference/Programming Bibles/tools/ssm_compiler/main.py`
  - Fallback: `docs/reference/Rego_OPM_BIBLE/opa_ssm_compiler/main.py`
- ✅ Compiler is executable (Python script can be run)
- ✅ Compiler dependencies available (runtime modules if needed)
- ✅ Compiler version specified (`--v3` flag for V3 compiler)

**Compiler Features (Optional but Recommended):**
- ✅ Diagnostics enabled (ErrorBus, SymbolTable available)
- ✅ Cache enabled (CompileCache available)
- ✅ Metrics collection (MetricsCollector available)

### 3. SSM Output

**Output File Requirements:**
- ✅ SSM output file path is valid and writable
- ✅ SSM output file is created successfully
- ✅ SSM output file is not empty (size > 0)
- ✅ SSM output contains valid SSM blocks (can be parsed)
- ✅ SSM output contains expected block types:
  - `:::chapter-meta` (chapter metadata)
  - `:::concept` (concepts)
  - `:::fact` (facts)
  - `:::pattern` (recommended patterns)
  - `:::antipattern` (anti-patterns)
  - `:::qa` (Q&A pairs)
  - `:::example` (code examples)

**Block Requirements:**
- ✅ All SSM blocks have proper syntax (`:::block-type` ... `:::`)
- ✅ Block metadata is valid (chapter, id, severity, etc. if present)
- ✅ Block bodies are properly formatted
- ✅ Chapter metadata is preserved (chapter numbers, titles)

**Quality Requirements:**
- ✅ No critical compilation errors (errors = 0 or acceptable)
- ✅ Warnings are acceptable (non-blocking)
- ✅ Block IDs are generated (if applicable)
- ✅ Diagnostics file created (if diagnostics enabled): `*.diagnostics.json`

---

## Ingest Stage Requirements

### 1. SSM File (Compiled Output)

**File Requirements:**
- ✅ SSM file exists (from compile stage)
- ✅ File is readable (correct permissions)
- ✅ File is valid UTF-8 (no encoding errors)
- ✅ File is not empty (size > 0)
- ✅ File contains valid SSM blocks (can be parsed by pipeline)

**Content Requirements:**
- ✅ SSM blocks are properly formatted (`:::block-type` syntax)
- ✅ Block metadata is valid (chapter, id, severity, etc. if present)
- ✅ Block types are recognized (concept, fact, pattern, antipattern, qa, etc.)
- ✅ Chapter structure is preserved (chapter metadata present)

### 2. Pipeline Script

**Script Requirements:**
- ✅ Pipeline script exists at `tools/bible_pipeline.py`
- ✅ Script is executable (Python script can be run)
- ✅ Script dependencies available (required Python modules)
- ✅ Script accepts required parameters:
  - `--language` (language identifier)
  - `--ssm` (SSM input file path)
  - `--out-md` (Cursor markdown output path)
  - `--out-mdc` (Cursor rules output path)

### 3. Cursor Outputs

**Output File Requirements:**
- ✅ Cursor markdown output path is valid and writable
- ✅ Cursor rules output path is valid and writable
- ✅ Both output files are created successfully
- ✅ Both output files are not empty (size > 0)
- ✅ Both output files are valid markdown (can be parsed)

**Cursor Markdown (`*.cursor.md`) Requirements:**
- ✅ Contains rich documentation for AI agents
- ✅ Organized by chapters
- ✅ Contains key concepts per chapter
- ✅ Contains important facts
- ✅ Contains common code patterns
- ✅ Contains representative Q&A (filtered for quality)

**Cursor Rules (`*.mdc`) Requirements:**
- ✅ Contains enforcement rules for Cursor
- ✅ Organized by anti-patterns and recommended patterns
- ✅ Includes severity levels (high, medium, low)
- ✅ Includes pattern metadata (chapter, language, pattern type)
- ✅ Includes code examples (before/after for patterns)

---

## Content Quality Requirements

### 1. Source Content Quality

**Markdown Quality:**
- ✅ Valid markdown syntax (headings, lists, tables, links)
- ✅ Proper heading hierarchy (no skipping levels)
- ✅ Consistent formatting (spacing, indentation)
- ✅ Valid code block syntax (```language ... ```)

**SSM Block Quality:**
- ✅ Proper SSM block syntax (`:::block-type` ... `:::`)
- ✅ Block types are appropriate (concept, fact, pattern, etc.)
- ✅ Block metadata is complete (chapter, id, severity if applicable)
- ✅ Block bodies are well-formed

**Code Example Quality:**
- ✅ Code examples are syntactically correct (unless marked as pseudo-code)
- ✅ Code examples are runnable and realistic
- ✅ Code examples match the text context
- ✅ Code examples use appropriate language syntax

### 2. Compilation Quality

**SSM Output Quality:**
- ✅ All blocks are properly parsed
- ✅ Block metadata is complete and accurate
- ✅ Chapter metadata is preserved
- ✅ No data loss during compilation
- ✅ Block IDs are unique (if generated)

**Error Handling:**
- ✅ Critical errors are reported (errors = 0 or acceptable)
- ✅ Warnings are logged (non-blocking)
- ✅ Error messages are clear and actionable

### 3. Ingestion Quality

**Cursor Output Quality:**
- ✅ Content is well-organized (by chapters)
- ✅ Content is filtered for quality (low-value content removed)
- ✅ Patterns are prioritized by severity
- ✅ Code examples are preserved and formatted correctly
- ✅ Cross-references are maintained (if applicable)

---

## Technical Requirements

### 1. File Encoding

**Encoding Requirements:**
- ✅ All files must be UTF-8 encoded
- ✅ No encoding errors in any file
- ✅ Special characters preserved (emoji, Unicode, etc.)

### 2. File Permissions

**Permission Requirements:**
- ✅ Source files are readable
- ✅ Output directories are writable
- ✅ Output files can be created/overwritten

### 3. Path Handling

**Path Requirements:**
- ✅ Use absolute paths when possible (for reliability)
- ✅ Use forward slashes (`/`) in paths (cross-platform)
- ✅ Paths are relative to base directory (for chapter files)
- ✅ Paths are validated before use

### 4. Dependencies

**Python Requirements:**
- ✅ Python 3.7+ installed
- ✅ Required Python modules available:
  - `yaml` (for `book.yaml` parsing)
  - `pathlib` (for path handling)
  - Standard library modules (for pipeline scripts)

**Tool Requirements:**
- ✅ `merge_book.py` script available
- ✅ SSM Compiler (V3) available
- ✅ `bible_pipeline.py` script available
- ✅ `bible_build.py` script available (optional, for automation)

---

## File System Requirements

### 1. Directory Structure

**Required Directories:**
- ✅ `config/` - Contains `book.yaml`
- ✅ `chapters/` - Contains individual chapter files
- ✅ `dist/` - Contains merged and compiled outputs
- ✅ `knowledge/bibles/<lang>/cursor/` - Contains Cursor markdown outputs
- ✅ `.cursor/rules/` - Contains Cursor rules outputs

### 2. Directory Permissions

**Permission Requirements:**
- ✅ Base directory is readable
- ✅ `chapters/` directory is readable
- ✅ `dist/` directory is writable
- ✅ Output directories are writable or can be created

### 3. File Naming

**Naming Conventions:**
- ✅ Chapter files: `NN_name.md` (numbered, descriptive)
- ✅ Merged file: `book_raw.md` (or specified name)
- ✅ SSM file: `book.ssm.md` (or specified name)
- ✅ Cursor markdown: `<Lang>_Bible.cursor.md` (or specified name)
- ✅ Cursor rules: `<lang>_bible.mdc` (or specified name)

---

## Validation Requirements

### 1. Pre-Stage Validation

**Merge Validation:**
- ✅ `book.yaml` structure is valid
- ✅ All chapter files exist
- ✅ All chapter files are readable
- ✅ Output directory is writable

**Compile Validation:**
- ✅ Merged source file exists
- ✅ Source file is readable
- ✅ Compiler is available
- ✅ Output directory is writable

**Ingest Validation:**
- ✅ SSM file exists
- ✅ SSM file is readable
- ✅ Pipeline script is available
- ✅ Output directories are writable

### 2. Post-Stage Validation

**Merge Validation:**
- ✅ Output file exists
- ✅ Output file size is reasonable
- ✅ All chapters appear in output
- ✅ Content markers preserved (Mermaid, code blocks, SSM blocks)

**Compile Validation:**
- ✅ SSM output file exists
- ✅ SSM output file is not empty
- ✅ SSM output contains expected block types
- ✅ No critical compilation errors

**Ingest Validation:**
- ✅ Both Cursor output files exist
- ✅ Both files are not empty
- ✅ Both files are valid markdown
- ✅ Content is well-organized

### 3. End-to-End Validation

**Pipeline Validation:**
- ✅ All stages completed successfully
- ✅ All output files exist and are valid
- ✅ No data loss detected
- ✅ Content quality is acceptable

---

## Minimum Requirements Summary

### Absolute Minimum for Successful Merge

1. ✅ Valid `book.yaml` file with `parts` list
2. ✅ At least one chapter file exists and is listed in `book.yaml`
3. ✅ Output directory is writable
4. ✅ All chapter files listed in `book.yaml` exist and are readable

### Absolute Minimum for Successful Compile

1. ✅ Merged source file exists and is readable
2. ✅ SSM Compiler is available and executable
3. ✅ Output directory is writable
4. ✅ Source file contains valid markdown

### Absolute Minimum for Successful Ingest

1. ✅ SSM file exists and is readable
2. ✅ Pipeline script is available and executable
3. ✅ Output directories are writable
4. ✅ SSM file contains valid SSM blocks

---

## Recommended Requirements

### Recommended for Best Results

**Merge:**
- ✅ All chapters from split are present
- ✅ Chapter order matches logical sequence
- ✅ Part structure is organized
- ✅ No duplicate chapter paths
- ✅ Consistent file naming convention

**Compile:**
- ✅ Diagnostics enabled (for error tracking)
- ✅ Cache enabled (for incremental builds)
- ✅ All SSM blocks properly formatted
- ✅ Chapter metadata complete

**Ingest:**
- ✅ High-quality content (filtered for quality)
- ✅ Patterns prioritized by severity
- ✅ Code examples preserved
- ✅ Cross-references maintained

---

## Common Failure Points

### Merge Failures

**Common Causes:**
- ❌ Missing `book.yaml` file
- ❌ Invalid YAML syntax in `book.yaml`
- ❌ Missing chapter files
- ❌ Incorrect chapter paths
- ❌ Output directory not writable

**Prevention:**
- ✅ Validate `book.yaml` before merge
- ✅ Verify all chapter files exist
- ✅ Use dry-run merge first
- ✅ Check file permissions

### Compile Failures

**Common Causes:**
- ❌ Merged source file not found
- ❌ Invalid markdown syntax
- ❌ Malformed SSM blocks
- ❌ Compiler not available
- ❌ Output directory not writable

**Prevention:**
- ✅ Verify merge stage completed
- ✅ Validate markdown syntax
- ✅ Check SSM block formatting
- ✅ Verify compiler is available

### Ingest Failures

**Common Causes:**
- ❌ SSM file not found
- ❌ Invalid SSM block format
- ❌ Pipeline script not available
- ❌ Output directories not writable
- ❌ Missing required parameters

**Prevention:**
- ✅ Verify compile stage completed
- ✅ Validate SSM file format
- ✅ Check pipeline script
- ✅ Check output directory permissions

---

## Verification Checklist

### Complete Pipeline Verification

After completing all stages, verify:

**Merge Stage:**
- [ ] Output file exists (`dist/book_raw.md`)
- [ ] Output file size is reasonable
- [ ] All chapters appear in output
- [ ] Chapter order matches `book.yaml`
- [ ] No content duplicated
- [ ] No content missing
- [ ] Code blocks intact
- [ ] Special content preserved (Mermaid, SSM blocks)

**Compile Stage:**
- [ ] SSM output file exists (`dist/book.ssm.md`)
- [ ] SSM output file is not empty
- [ ] SSM output contains expected block types
- [ ] Chapter metadata preserved
- [ ] Block IDs generated (if applicable)
- [ ] No critical compilation errors
- [ ] Diagnostics file created (if enabled)

**Ingest Stage:**
- [ ] Cursor markdown file exists (`*.cursor.md`)
- [ ] Cursor markdown file is not empty
- [ ] Cursor rules file exists (`*.mdc`)
- [ ] Cursor rules file is not empty
- [ ] Both files are valid markdown
- [ ] Content is well-organized
- [ ] Patterns are prioritized
- [ ] Code examples preserved

---

## Success Criteria

The pipeline is considered **SUCCESSFUL** when:

1. ✅ **All stages complete** - Merge, Compile, and Ingest all complete without errors
2. ✅ **All output files created** - All expected output files exist
3. ✅ **All files are valid** - All output files are valid and non-empty
4. ✅ **No data loss** - All content is preserved through all stages
5. ✅ **Quality maintained** - Content quality is acceptable
6. ✅ **No critical errors** - No blocking errors in any stage

---

## Troubleshooting Guide

### Issue: Merge Fails

**Check:**
1. `book.yaml` exists and is valid YAML
2. All chapter files listed in `book.yaml` exist
3. Chapter paths are correct (relative to base directory)
4. Output directory is writable

**Fix:**
- Validate `book.yaml` syntax
- Verify all chapter files exist
- Check file paths in `book.yaml`
- Ensure output directory permissions

### Issue: Compile Fails

**Check:**
1. Merged source file exists
2. Source file is valid markdown
3. SSM blocks are properly formatted
4. Compiler is available

**Fix:**
- Verify merge stage completed
- Validate markdown syntax
- Check SSM block formatting
- Ensure compiler is available

### Issue: Ingest Fails

**Check:**
1. SSM file exists
2. SSM file contains valid blocks
3. Pipeline script is available
4. Output directories are writable

**Fix:**
- Verify compile stage completed
- Validate SSM file format
- Check pipeline script availability
- Ensure output directory permissions

---

## References

- **Merge Requirements:** `docs/reference/Programming Bibles/tools/precompile/MERGE_REQUIREMENTS_CHECKLIST.md`
- **SSM Compiler:** `docs/reference/Programming Bibles/tools/ssm_compiler/`
- **Bible Pipeline:** `tools/README_BIBLE_PIPELINE.md`
- **Build Automation:** `tools/bible_build.py`

---

**Last Updated:** 2025-11-30  
**Version:** 1.0.0  
**Status:** Active























