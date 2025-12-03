# SSM Compiler - Output File Locations

**Last Updated:** 2025-11-30  
**Version:** 3.0.0

## Overview

When the SSM compiler runs, it saves files in three locations:

1. **Main SSM Output File** - The compiled SSM v3 markdown file
2. **Diagnostics JSON File** - Compilation metadata and diagnostics
3. **Cache State File** - Incremental build cache (optional)

---

## File Locations

### 1. Main SSM Output File

**Location:** Specified as the second command-line argument (`output_path`)

**Example:**
```bash
python compiler.py input.md output.ssm.md
# Output saved to: output.ssm.md
```

**Typical Usage:**
```bash
# For Python Bible:
python compiler.py \
  "docs/reference/Programming Bibles/bibles/python_bible/dist/python_bible_raw.md" \
  "docs/reference/Programming Bibles/bibles/python_bible/dist/python_bible.ssm.md"
```

**File Format:** SSM v3 Markdown (`.ssm.md`)

**Content:** Fully compiled SSM v3 format with all enrichments applied

---

### 2. Diagnostics JSON File

**Location:** Same directory as the output file, with `.diagnostics.json` suffix

**Default Path:** `{output_path}.diagnostics.json`

**Example:**
```bash
# If output is: dist/python_bible.ssm.md
# Diagnostics saved to: dist/python_bible.ssm.md.diagnostics.json
```

**Can be overridden:** Third command-line argument (optional)

```bash
python compiler.py input.md output.ssm.md custom_diagnostics.json
```

**File Format:** JSON

**Content:**
- Compilation summary
- Block counts by type
- Error/warning counts
- Compiler version
- Schema version
- Namespace information
- Quality metrics

**Example Structure:**
```json
{
  "summary": {
    "total_blocks": 1234,
    "chapters": 29,
    "errors": 0,
    "warnings": 5
  },
  "compiler_version": "3.0.0",
  "ssm_schema_version": "1.0.0",
  "namespace": "python_bible",
  ...
}
```

---

### 3. Cache State File (Optional)

**Location:** Same directory as the **source input file** (not output file)

**Default Path:** `{source_file_directory}/.biblec.state.json`

**Example:**
```bash
# If source is: dist/python_bible_raw.md
# Cache saved to: dist/.biblec.state.json
```

**File Format:** JSON

**Content:**
- Source file hash
- Compiler version
- SSM schema version
- Chapter hashes (for incremental builds)
- Cached block IDs
- Last compile time
- Total blocks count

**Purpose:** Enables incremental compilation - only recompiles changed chapters

**Example Structure:**
```json
{
  "source_file": "python_bible_raw.md",
  "source_hash": "abc123...",
  "compiler_version": "3.0.0",
  "ssm_schema_version": "1.0.0",
  "namespace": "python_bible",
  "chapter_hashes": {
    "ch01": {
      "hash": "def456...",
      "line_count": 547,
      "last_modified": "2025-01-27T10:00:00"
    },
    ...
  },
  "total_blocks": 1234,
  "last_compile_time": "2025-01-27T10:05:00",
  "cached_blocks": ["block-id-1", "block-id-2", ...]
}
```

**Note:** Cache file is optional - compilation works without it, but incremental builds require it.

---

## Complete Example

### Command:
```bash
python "docs/reference/Programming Bibles/tools/ssm_compiler/compiler.py" \
  "docs/reference/Programming Bibles/bibles/python_bible/dist/python_bible_raw.md" \
  "docs/reference/Programming Bibles/bibles/python_bible/dist/python_bible.ssm.md"
```

### Files Created:

1. **Main Output:**
   ```
   docs/reference/Programming Bibles/bibles/python_bible/dist/python_bible.ssm.md
   ```
   - Compiled SSM v3 markdown
   - All enrichments applied
   - Ready for RAG/LLM indexing

2. **Diagnostics:**
   ```
   docs/reference/Programming Bibles/bibles/python_bible/dist/python_bible.ssm.md.diagnostics.json
   ```
   - Compilation metadata
   - Quality metrics
   - Error/warning summary

3. **Cache (if enabled):**
   ```
   docs/reference/Programming Bibles/bibles/python_bible/dist/.biblec.state.json
   ```
   - Incremental build state
   - Chapter change tracking
   - Block caching information

---

## File Naming Convention

### Recommended Structure:

```
bibles/
  {bible_name}/
    dist/
      {bible_name}_raw.md          # Input (from merge_book.py)
      {bible_name}.ssm.md          # Output (from SSM compiler)
      {bible_name}.ssm.md.diagnostics.json  # Diagnostics
      .biblec.state.json         # Cache (optional)
```

### Example (Python Bible):
```
bibles/
  python_bible/
    dist/
      python_bible_raw.md
      python_bible.ssm.md
      python_bible.ssm.md.diagnostics.json
      .biblec.state.json
```

---

## Integration with Merge Script

The SSM compiler is typically run **after** the merge script:

1. **Merge Step:**
   ```bash
   python merge_book.py \
     --book-yaml config/book.yaml \
     --output dist/python_bible_raw.md
   ```
   - Creates: `dist/python_bible_raw.md`

2. **Compile Step:**
   ```bash
   python compiler.py \
     dist/python_bible_raw.md \
     dist/python_bible.ssm.md
   ```
   - Creates: `dist/python_bible.ssm.md`
   - Creates: `dist/python_bible.ssm.md.diagnostics.json`
   - Creates: `dist/.biblec.state.json` (if cache enabled)

---

## How to Check if Features are Enabled

### Quick Check Script

Run the feature check script to verify diagnostics and cache status:

```bash
python "docs/reference/Programming Bibles/tools/ssm_compiler/check_features.py"
```

**Output Example:**
```
✅ DIAGNOSTICS: FULLY ENABLED
   - Error/warning tracking: ✅
   - Symbol tracking: ✅
   - Diagnostics JSON file will be created
   - Metrics collection: ✅

✅ CACHE: ENABLED
   - Incremental builds: ✅
   - Cache file (.biblec.state.json) will be created
   - Only changed chapters will be recompiled
```

### Manual Check

#### Check Diagnostics

Diagnostics are enabled if both `ErrorBus` and `SymbolTable` are available:

```python
# Check if diagnostics are enabled
try:
    from runtime.error_bus import ErrorBus
    from runtime.symbol_table import SymbolTable
    print("✅ Diagnostics: ENABLED")
except ImportError:
    print("❌ Diagnostics: DISABLED")
```

**Required Files:**
- `runtime/error_bus.py` - Must exist
- `runtime/symbol_table.py` - Must exist

**Optional (enhances diagnostics):**
- `runtime/metrics.py` - Provides quality metrics

#### Check Cache

Cache is enabled if `CompileCache` is available:

```python
# Check if cache is enabled
try:
    from runtime.cache import CompileCache
    print("✅ Cache: ENABLED")
except ImportError:
    print("❌ Cache: DISABLED")
```

**Required Files:**
- `runtime/cache.py` - Must exist

**Additional Requirements:**
- Cache also requires `source_file` parameter to be passed to `compile_markdown_to_ssm_v3()`
- Cache file location: `{source_file_directory}/.biblec.state.json`

### Verify After Compilation

After running the compiler, check if files were created:

#### Check Diagnostics File

```bash
# Check if diagnostics file exists
ls -la dist/*.diagnostics.json

# Or on Windows:
dir dist\*.diagnostics.json
```

**If file exists:** Diagnostics are enabled and working  
**If file missing:** Diagnostics are disabled or compilation had no diagnostics data

#### Check Cache File

```bash
# Check if cache file exists (in source file directory)
ls -la dist/.biblec.state.json

# Or on Windows:
dir dist\.biblec.state.json
```

**If file exists:** Cache is enabled and working  
**If file missing:** Cache is disabled or this is the first compilation

### Runtime Verification

During compilation, the compiler prints status messages:

**Diagnostics Enabled:**
```
[PROGRESS] Building block index...
Compilation complete for namespace 'python_bible':
  Blocks: 1234
  Errors: 0
  Warnings: 5
```

**Cache Enabled:**
```
[PROGRESS] Loading cache for incremental builds...
[PROGRESS] Cache loaded: 29 chapters cached
```

**Diagnostics Disabled:**
- No summary output after compilation
- No diagnostics JSON file created

**Cache Disabled:**
- No cache loading messages
- No `.biblec.state.json` file created
- Full recompilation every time

---

## Notes

- **Output directory must exist** - The compiler does not create output directories
- **Cache is optional** - Compilation works without cache, but incremental builds require it
- **Diagnostics are optional** - Only created if runtime components are available
- **All files are UTF-8 encoded**
- **Source files are never modified** - Only output files are written

---

## Summary

| File Type | Location | Required | Purpose |
|-----------|----------|----------|---------|
| **SSM Output** | Specified in command (`output_path`) | ✅ Yes | Compiled SSM v3 markdown |
| **Diagnostics** | `{output_path}.diagnostics.json` | ⚠️ Optional | Compilation metadata |
| **Cache** | `{source_directory}/.biblec.state.json` | ⚠️ Optional | Incremental build state |

---

**Last Updated:** 2025-11-30

