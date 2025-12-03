# SSM Compiler - Feature Check Guide

**Last Updated:** 2025-11-30  
**Version:** 3.0.0

## Quick Check

Run the feature check script:

```bash
python "docs/reference/Programming Bibles/tools/ssm_compiler/check_features.py"
```

This will show you:
- ✅ **Diagnostics Status** - Enabled or Disabled
- ✅ **Cache Status** - Enabled or Disabled
- ✅ **Runtime Files** - Which files exist
- ✅ **Component Availability** - Which modules can be imported

---

## How Features are Enabled/Disabled

### Diagnostics

**Enabled When:**
- `runtime/error_bus.py` exists and can be imported
- `runtime/symbol_table.py` exists and can be imported

**Optional Enhancement:**
- `runtime/metrics.py` - Provides quality metrics (optional)

**How It Works:**
The compiler tries to import these modules at startup:
```python
try:
    from runtime.error_bus import ErrorBus
    from runtime.symbol_table import SymbolTable
except ImportError:
    # Features disabled - compilation continues without diagnostics
    ErrorBus = None
    SymbolTable = None
```

**If Enabled:**
- Diagnostics JSON file is created: `{output}.diagnostics.json`
- Error/warning tracking is active
- Symbol tracking is active
- Quality metrics are collected (if MetricsCollector available)

**If Disabled:**
- No diagnostics JSON file created
- Compilation still works, but without diagnostics

---

### Cache

**Enabled When:**
- `runtime/cache.py` exists and can be imported
- `source_file` parameter is passed to `compile_markdown_to_ssm_v3()`

**How It Works:**
The compiler tries to import the cache module at startup:
```python
try:
    from runtime.cache import CompileCache
except ImportError:
    # Cache disabled - full recompilation every time
    CompileCache = None
```

**If Enabled:**
- Cache file is created: `{source_directory}/.biblec.state.json`
- Incremental builds work (only changed chapters recompiled)
- Faster subsequent compilations

**If Disabled:**
- No cache file created
- Full recompilation every time
- Compilation still works normally

---

## Verification Methods

### Method 1: Run Check Script (Recommended)

```bash
python "docs/reference/Programming Bibles/tools/ssm_compiler/check_features.py"
```

**Output Example:**
```
[OK] DIAGNOSTICS: FULLY ENABLED
   - Error/warning tracking: [OK]
   - Symbol tracking: [OK]
   - Diagnostics JSON file will be created
   - Metrics collection: [OK]

[OK] CACHE: ENABLED
   - Incremental builds: [OK]
   - Cache file (.biblec.state.json) will be created
   - Only changed chapters will be recompiled
```

---

### Method 2: Check Runtime Files

Verify that required files exist:

```bash
# Check diagnostics files
ls runtime/error_bus.py
ls runtime/symbol_table.py
ls runtime/metrics.py  # Optional

# Check cache file
ls runtime/cache.py
```

**On Windows:**
```powershell
Test-Path "runtime/error_bus.py"
Test-Path "runtime/symbol_table.py"
Test-Path "runtime/cache.py"
```

---

### Method 3: Check After Compilation

After running the compiler, check if output files were created:

#### Check Diagnostics File

```bash
# Check if diagnostics file exists
ls dist/*.diagnostics.json

# Or on Windows:
dir dist\*.diagnostics.json
```

**If file exists:** Diagnostics are enabled ✅  
**If file missing:** Diagnostics are disabled ❌

#### Check Cache File

```bash
# Check if cache file exists (in source file directory)
ls dist/.biblec.state.json

# Or on Windows:
dir dist\.biblec.state.json
```

**If file exists:** Cache is enabled ✅  
**If file missing:** Cache is disabled or first compilation ❌

---

### Method 4: Check Compiler Output

During compilation, look for these messages:

**Diagnostics Enabled:**
```
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

**If you see these messages:** Features are enabled ✅  
**If you don't see these messages:** Features may be disabled ❌

---

## Manual Python Check

You can also check programmatically:

```python
# Check diagnostics
try:
    from runtime.error_bus import ErrorBus
    from runtime.symbol_table import SymbolTable
    print("Diagnostics: ENABLED")
except ImportError:
    print("Diagnostics: DISABLED")

# Check cache
try:
    from runtime.cache import CompileCache
    print("Cache: ENABLED")
except ImportError:
    print("Cache: DISABLED")
```

---

## Current Status

Based on the feature check script:

✅ **Diagnostics: ENABLED**
- ErrorBus: Available
- SymbolTable: Available
- MetricsCollector: Available

✅ **Cache: ENABLED**
- CompileCache: Available
- Content hashing: Available
- Chapter hashing: Available

**All features are fully enabled!**

---

## Troubleshooting

### Diagnostics Not Working

**Symptoms:**
- No `.diagnostics.json` file created
- No compilation summary printed

**Check:**
1. Verify `runtime/error_bus.py` exists
2. Verify `runtime/symbol_table.py` exists
3. Check for import errors in compiler output

**Fix:**
- Ensure runtime files are in the correct location
- Check Python path is correct
- Verify no syntax errors in runtime modules

### Cache Not Working

**Symptoms:**
- No `.biblec.state.json` file created
- Full recompilation every time

**Check:**
1. Verify `runtime/cache.py` exists
2. Verify `source_file` parameter is passed to compiler
3. Check for import errors in compiler output

**Fix:**
- Ensure `runtime/cache.py` exists
- Pass `source_file` parameter when calling compiler
- Check Python path is correct

---

## Summary

| Feature | Check Method | Enabled If |
|---------|-------------|------------|
| **Diagnostics** | Run `check_features.py` | ErrorBus + SymbolTable available |
| **Cache** | Run `check_features.py` | CompileCache available + source_file passed |

**Quick Command:**
```bash
python "docs/reference/Programming Bibles/tools/ssm_compiler/check_features.py"
```

---

**Last Updated:** 2025-11-30























