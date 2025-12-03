# Memory Usage Analysis - Auto-Enforcer

**Date:** 2025-12-02  
**Current Usage:** ~1,200MB (HIGH)  
**Target:** <500MB  
**Status:** 🔍 Investigating

---

## Current Memory Usage

**Baseline:** ~1,200MB  
**During Enforcer Run:** Higher (peak usage)

This is **abnormally high** for a Python script. Typical Python scripts use 50-200MB.

---

## Potential Memory Hotspots

### 1. **Large File Reads** ⚠️ HIGH IMPACT

**Issue:** Multiple `f.read()` calls loading entire files into memory

**Locations:**
- Line 1388: `content = f.read()` - Reading large files
- Line 2178: `content = f.read()` - Reading file content
- Line 2242: `content = f.read()` - Reading file content
- Line 2300: `content = f.read()` - Reading file content
- Line 3662: `recommendations_content = f.read()` - Reading recommendations
- Line 3732: `dashboard_content = f.read()` - Reading dashboard

**Impact:** If files are large (e.g., 10MB each), this adds up quickly.

**Fix:** Already optimized line-by-line processing for date checks, but other file reads need optimization.

---

### 2. **Session Data Accumulation** ⚠️ HIGH IMPACT

**Issue:** Session stores all violations, file_hashes, checks_passed, checks_failed

**Data Structures:**
```python
self.session.violations = []  # Can grow large
self.session.file_hashes = {}  # One entry per file checked
self.session.checks_passed = []  # Can grow large
self.session.checks_failed = []  # Can grow large
```

**Impact:** 
- If 496 violations (current state) × ~1KB per violation = ~500KB
- File hashes: If 1000 files × 64 bytes = ~64KB
- But if session persists across runs, this accumulates

**Fix:** 
- Limit session history
- Prune old violations
- Clear file_hashes periodically

---

### 3. **Git Command Outputs** ⚠️ MEDIUM IMPACT

**Issue:** Storing full git diff outputs and file lists

**Locations:**
- Line 1029-1030: `staged_content` and `unstaged_content` - Full diff content
- Line 1820: `all_tracked = set(...)` - All tracked files in repo
- Line 745-768: `get_changed_files()` - Returns list of all changed files

**Impact:**
- Large diffs can be 10-50MB
- All tracked files set can be large (thousands of files)

**Fix:**
- Process diffs incrementally
- Use generators instead of lists
- Don't store full diff content if not needed

---

### 4. **Context Manager Modules** ⚠️ MEDIUM IMPACT

**Issue:** Even with lazy loading, context manager modules might be heavy

**Impact:**
- WorkflowTracker loads workflow state (could be large JSON)
- ContextLoader might cache context files
- Predictor might load models or large data structures

**Fix:**
- Already using lazy loading ✅
- But modules themselves might be memory-intensive
- Consider unloading modules after use

---

### 5. **Large Data Structures** ⚠️ MEDIUM IMPACT

**Issue:** Multiple large sets, lists, dicts

**Locations:**
- Line 1820: `all_tracked = set(...)` - All tracked files
- Line 2450: `blocked_violations = list(...)` - All blocked violations
- Line 2451: `warning_violations = list(...)` - All warnings
- Line 3707: `all_context_files = set(...)` - All context files

**Impact:**
- Sets and lists of file paths can be large
- If 10,000 files × 100 bytes = 1MB per structure

**Fix:**
- Use generators where possible
- Clear structures after use
- Limit size of tracked data

---

### 6. **String Concatenation** ⚠️ LOW IMPACT

**Issue:** Large string building for reports

**Locations:**
- Line 2467: `content = f"""..."""` - Building large markdown strings
- Line 2676: `content = f"""..."""` - Building violations log
- Line 2832: `content = f"""..."""` - Building block message

**Impact:**
- Large reports can be 1-5MB
- Python strings are immutable, so concatenation creates copies

**Fix:**
- Use `io.StringIO` for large string building
- Or write directly to file instead of building in memory

---

## Recommended Optimizations

### Priority 1: Session Data Pruning

```python
# Limit session history
MAX_VIOLATIONS_IN_SESSION = 1000
MAX_FILE_HASHES = 5000

if len(self.session.violations) > MAX_VIOLATIONS_IN_SESSION:
    # Keep only recent violations
    self.session.violations = self.session.violations[-MAX_VIOLATIONS_IN_SESSION:]

if len(self.session.file_hashes) > MAX_FILE_HASHES:
    # Keep only recent file hashes
    # Remove oldest entries
    oldest_keys = list(self.session.file_hashes.keys())[:-MAX_FILE_HASHES]
    for key in oldest_keys:
        del self.session.file_hashes[key]
```

### Priority 2: Process Large Files in Chunks

```python
# Instead of: content = f.read()
# Use: Process line-by-line or in chunks

def process_file_chunked(file_path: Path, chunk_size: int = 8192):
    """Process file in chunks to reduce memory."""
    with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
        while True:
            chunk = f.read(chunk_size)
            if not chunk:
                break
            # Process chunk
            yield chunk
```

### Priority 3: Use Generators for Large Lists

```python
# Instead of: all_tracked = set(self.run_git_command(['ls-files']).split('\n'))
# Use: Generator that processes line-by-line

def get_tracked_files_generator(self):
    """Generator for tracked files (memory-efficient)."""
    output = self.run_git_command(['ls-files'])
    if output:
        for line in output.split('\n'):
            if line.strip():
                yield line.strip()
```

### Priority 4: Clear Large Structures After Use

```python
# After processing, clear large structures
def cleanup_after_audit(self):
    """Clear large data structures after audit."""
    # Clear violation lists (keep in session only)
    self.violations.clear()
    
    # Clear large sets
    if hasattr(self, '_temp_large_set'):
        del self._temp_large_set
```

### Priority 5: Write Reports Directly to File

```python
# Instead of: content = f"""..."""; file.write(content)
# Use: Write directly to file

def generate_report_direct(self, file_path: Path):
    """Write report directly to file (no intermediate string)."""
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write("# Agent Status\n\n")
        f.write(f"**Status:** {status}\n\n")
        # Write incrementally instead of building large string
```

---

## Memory Profiling

### Add Memory Profiling

```python
import tracemalloc
import sys

def profile_memory_usage():
    """Profile memory usage of enforcer."""
    tracemalloc.start()
    
    # Run enforcer
    enforcer = VeroFieldEnforcer()
    enforcer.run_audit()
    
    # Get snapshot
    snapshot = tracemalloc.take_snapshot()
    top_stats = snapshot.statistics('lineno')
    
    print("Top 10 memory allocations:")
    for stat in top_stats[:10]:
        print(f"{stat.filename}:{stat.lineno}: {stat.size / 1024 / 1024:.2f} MB")
    
    tracemalloc.stop()
```

---

## Expected Improvements

### After Optimizations:

- **Session pruning:** -200MB (if session is large)
- **Chunked file processing:** -100MB (if processing large files)
- **Generator-based processing:** -50MB (for large lists)
- **Direct file writing:** -20MB (for large reports)
- **Clear after use:** -30MB (temporary structures)

**Total Expected Reduction:** ~400MB  
**Target Memory:** ~800MB (still high, but better)

---

## Next Steps

1. **Add memory profiling** to identify exact hotspots
2. **Implement session pruning** (Priority 1)
3. **Optimize large file reads** (Priority 2)
4. **Use generators for large lists** (Priority 3)
5. **Profile again** to verify improvements

---

## Notes

1,200MB is still high even after optimizations. Possible causes:
- **Context manager modules** might be loading large data structures
- **Workflow state** might be very large
- **Git repository** might be very large
- **Python interpreter overhead** (CPython has ~48-72 bytes per object)

Consider:
- **Using PyPy** for better memory efficiency (if compatible)
- **Splitting enforcer** into smaller processes
- **Using multiprocessing** to isolate memory usage

---

**Status:** ✅ Optimizations Applied

## Applied Optimizations

### 1. Session Data Pruning ✅
- Added `_prune_session_data()` method
- Limits violations to 2000 most recent
- Limits file_hashes to 10000 most recent
- Limits checks lists to 500 most recent
- Called before saving session

### 2. Git Output Processing ✅
- Optimized `all_tracked` set creation
- Process git output incrementally

### 3. Diff Processing ✅
- Process diffs incrementally instead of concatenating
- Avoid building large combined_diff strings

### 4. File Processing ✅
- Converted error handling check to line-by-line
- Converted logging check to line-by-line
- Converted Python Bible check to line-by-line

### 5. Memory Cleanup After Audit ✅
- Clear large violation list after report generation
- Keep only last 100 violations in memory

## Expected Impact

- **Session pruning:** -200-400MB (if session is large)
- **Line-by-line processing:** -50-100MB (for large files)
- **Diff optimization:** -20-50MB (for large diffs)
- **Memory cleanup:** -30-50MB (temporary structures)

**Total Expected Reduction:** ~300-600MB  
**Target Memory:** ~600-900MB (down from 1,200MB)

## Next Steps

1. **Test with actual run** - Monitor memory usage
2. **Profile with tracemalloc** - Identify remaining hotspots
3. **Consider additional optimizations** if still high

