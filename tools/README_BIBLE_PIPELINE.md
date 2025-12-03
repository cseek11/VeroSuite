# Bible Pipeline: SSM → Cursor Ingestion

## Overview

The Bible Pipeline converts SSM-compiled Bibles into Cursor-friendly formats for AI agent consumption. This is the second stage of the Bible compilation system:

1. **Source → SSM**: V3 SSM Compiler (`docs/reference/Rego_OPM_BIBLE/opa_ssm_compiler/`)
2. **SSM → Cursor**: Bible Pipeline (`tools/bible_pipeline.py`) ← **This stage**

## Architecture

### 3-Layer Pipeline

```
Source Bible (Authoring)
  ↓ [V3 Compiler]
SSM Bible (Machine-readable)
  ↓ [Bible Pipeline]
Cursor Outputs (Agent-friendly)
```

### Directory Structure

```
knowledge/bibles/
  <lang>/
    source/          # Human-authored markdown
    compiled/        # SSM output from V3 compiler
    cursor/          # Cursor-readable markdown

.cursor/rules/
  <lang>_bible.mdc   # Cursor enforcement rules
```

## Usage

### Quick Start

```bash
# Build Python Bible end-to-end
python tools/bible_build.py --language python

# Build Rego Bible end-to-end
python tools/bible_build.py --language rego

# Build all Bibles
python tools/bible_build.py --language all
```

### Manual Pipeline Steps

#### Step 1: Compile Source → SSM

```bash
cd docs/reference/Rego_OPM_BIBLE/opa_ssm_compiler
python main.py ../../rego_opa_bible.md ../../knowledge/bibles/rego/compiled/REGO_OPA_Bible.ssm.md --v3
```

#### Step 2: Ingest SSM → Cursor

```bash
python tools/bible_pipeline.py \
  --language rego \
  --ssm knowledge/bibles/rego/compiled/REGO_OPA_Bible.ssm.md \
  --out-md knowledge/bibles/rego/cursor/REGO_OPA_Bible.cursor.md \
  --out-mdc .cursor/rules/rego_bible.mdc
```

### Using Makefile (if available)

```bash
# Full pipeline
make bible-rego
make bible-python
make bibles-all

# Compile only
make bible-rego-compile
make bible-python-compile

# Ingest only
make bible-rego-ingest
make bible-python-ingest
```

## Output Files

### 1. Cursor Markdown (`*.cursor.md`)

**Purpose:** Rich documentation for AI agents to read and reason about.

**Structure:**
- Chapter-organized content
- Key concepts per chapter
- Important facts
- Common code patterns
- Anti-patterns with severity
- Representative Q&A (filtered for quality)

**Example:**
```markdown
# Python Bible – Cursor Edition

## Chapter 1 — Introduction to Python

### Key Concepts
- **Python is a high-level, interpreted language**
- **Dynamic typing with optional static type hints**

### Common Pitfalls & Anti-Patterns
- **[HIGH]** Mutable default arguments
- **[MEDIUM]** Using `==` instead of `is` for None checks
```

### 2. Cursor Rules (`*.mdc`)

**Purpose:** Enforcement rules for Cursor to follow when generating code.

**Structure:**
- Anti-patterns → DO NOT rules
- Code patterns → Recommended patterns
- Severity levels (high, medium, low)
- Chapter attribution
- Code examples (when available)

**Example:**
```markdown
---
description: "Python Bible rules extracted from SSM"
alwaysApply: true
---

## Anti-Patterns (DO NOT)

### Mutable Default Arguments
- **Severity:** `high`
- **Problem:** Using mutable objects as default arguments
- **Rule:** Avoid this pattern when writing python code unless explicitly justified.
```

## Pipeline Script Details

### `bible_pipeline.py`

**Features:**
- Generic parser (works with any SSM Bible)
- Chapter-aware organization
- Quality filtering (removes low-value QA, truncated blocks)
- Severity-based prioritization
- Code example extraction

**Input:** `.ssm.md` file from V3 compiler  
**Output:** `.cursor.md` and `.mdc` files

### `bible_build.py`

**Features:**
- End-to-end automation
- Compile + ingest in one command
- Support for multiple languages
- Error handling and progress reporting

**Usage:**
```bash
python tools/bible_build.py --language python
python tools/bible_build.py --language all
python tools/bible_build.py --language rego --compile-only
python tools/bible_build.py --language python --ingest-only
```

## Supported Languages

Currently configured:
- **rego**: Rego/OPA Bible
- **python**: Python Bible

To add a new language:
1. Add entry to `BIBLE_CONFIGS` in `tools/bible_build.py`
2. Create directory structure: `knowledge/bibles/<lang>/`
3. Run: `python tools/bible_build.py --language <lang>`

## Quality Filters

The pipeline automatically:
- ✅ Filters low-importance QA blocks
- ✅ Removes truncated anti-patterns
- ✅ Limits content per chapter (prevents bloat)
- ✅ Prioritizes high-severity anti-patterns
- ✅ Includes code examples when available

## Integration with Cursor

### How Cursor Uses These Files

1. **Knowledge (`*.cursor.md`)**:
   - Read by Cursor for context and understanding
   - Used when answering questions about the language
   - Referenced during code generation for best practices

2. **Rules (`*.mdc`)**:
   - Enforced automatically (via `alwaysApply: true`)
   - Used to prevent anti-patterns
   - Guides code generation toward recommended patterns

### File Locations

- **Knowledge files**: `knowledge/bibles/<lang>/cursor/`
- **Rules files**: `.cursor/rules/<lang>_bible.mdc`

Cursor automatically loads `.cursor/rules/*.mdc` files.

## Troubleshooting

### SSM file not found
- Ensure V3 compiler has been run first
- Check file path in `bible_build.py` configuration

### Empty output files
- Verify SSM file contains blocks
- Check that blocks have chapter assignments
- Review parser logs for errors

### Missing chapters
- Ensure `chapter-meta` blocks exist in SSM
- Verify chapter codes are properly formatted (CH-01, CH-02, etc.)

## Future Enhancements

- [ ] Incremental updates (only regenerate changed chapters)
- [ ] Multi-language support (same Bible in multiple languages)
- [ ] Custom filtering rules per language
- [ ] Integration with Cursor's rule system for dynamic updates
- [ ] Metrics and quality reports for generated outputs

---

**Last Updated:** 2025-11-26  
**Status:** Production Ready  
**Maintained By:** Engineering Team

