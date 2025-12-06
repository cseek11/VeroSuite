# Enforcement System Performance Investigation

**Date:** 2025-12-21  
**Status:** Investigation Complete  
**Issue:** Enforcement runs are extremely slow after recent changes

---

## Executive Summary

Despite previous optimizations (Phase 1 & 2), enforcement runs remain slow due to **excessive git subprocess calls** in `is_file_modified_in_session()`. This function is called for every file in the date checker loop and makes **10-15 git calls per file**, resulting in **500-750+ git calls** for a typical run with 50 files.

**Root Cause:** The `is_file_modified_in_session()` function in `enforcement/core/file_scanner.py` performs many redundant git operations that are not cached, even though caching was added for `get_changed_files()` and `get_file_diff()`.

---

## Critical Performance Bottleneck

### 🔴 **`is_file_modified_in_session()` Makes Excessive Git Calls**

**Location:** `enforcement/core/file_scanner.py` (lines 38-446)

**Problem:** This function is called for **every file** in the date checker loop (line 277 in `date_checker.py`), and each call makes **10-15 git subprocess calls**:

1. **Line 85:** `git ls-files --error-unmatch` (check if tracked)
2. **Line 102:** `get_file_last_modified_time()` (may call git)
3. **Line 109-112:** `git diff --ignore-all-space` (check for changes)
4. **Line 137-138:** `git diff --numstat` (get diff stats)
5. **Line 142-143:** `git diff --ignore-all-space --numstat` (check whitespace-only)
6. **Line 148:** `get_file_change_status()` → calls `git diff --name-status` (2x: staged + unstaged)
7. **Line 186-187:** `git log -1 --format=%ct` (get commit time)
8. **Line 194-196:** `git diff --ignore-all-space` (check unstaged changes)
9. **Line 280:** `git ls-files --error-unmatch` (again, for untracked check)
10. **Line 301:** `find_files_with_hash()` → can call `git ls-files`, `git diff`, `git show` (many calls)
11. **Line 382-383:** `git diff --numstat` (again, for untracked files)
12. **Line 387-388:** `git diff --ignore-all-space --numstat` (again)

**Impact Analysis:**

For a typical run with **50 changed files**:
- **50 files × 10-15 git calls = 500-750 git subprocess calls**
- Each git call takes **50-200ms** (subprocess overhead)
- **Total time: 25-150 seconds** just for file modification checks

**Current Status:**
- ✅ `get_changed_files()` is cached (Phase 1.1)
- ✅ `get_file_diff()` is cached (Phase 1.2)
- ❌ **`is_file_modified_in_session()` git calls are NOT cached**
- ❌ **Many redundant git operations within the function**

---

## Additional Performance Issues

### 🟡 **1. Redundant Git Calls in `is_file_modified_in_session()`**

**Issue:** The function makes multiple git calls that could be consolidated:

- **Lines 109-112 & 137-138 & 142-143:** Three separate `git diff` calls that could be combined
- **Lines 186-187 & 194-196:** Two separate git calls that check similar things
- **Lines 382-383 & 387-388:** Duplicate git diff calls for untracked files

**Solution:** Combine similar git operations into single calls with multiple flags.

### 🟡 **2. `find_files_with_hash()` Performance Issue**

**Location:** `enforcement/core/git_utils.py` (lines 607-723)

**Problem:** This function is called for every untracked file and can make **hundreds of git calls**:
- Line 629: `git ls-files` (get all tracked files)
- Line 637: `git diff --name-only --diff-filter=D` (get deleted files)
- Lines 665-704: For each file (up to 1000), calls `git show` or reads file from filesystem

**Impact:** For 10 untracked files, this could make **1000+ git calls** (100 files × 10 untracked files).

**Solution:** 
- Cache the tracked files list
- Limit hash search to recent files only (e.g., last 100 modified files)
- Use file hash index instead of checking every file

### 🟡 **3. Context Management Runs Every Check**

**Location:** `.cursor/scripts/auto-enforcer.py` (lines 925-938)

**Problem:** `_update_context_recommendations()` runs at the start of every `run_all_checks()` call, even when no files changed.

**Impact:** Adds **2-5 seconds** to every enforcement run.

**Solution:** 
- Only run when files actually changed
- Cache recommendations for 5 minutes (TTL)
- Defer to background if not critical

### 🟡 **4. Violation Re-evaluation Makes Many Git Calls**

**Location:** `.cursor/scripts/auto-enforcer.py` (line 2673 in old code, now in reporting)

**Problem:** When generating status reports, violation scope is re-evaluated for every violation, each calling `is_line_changed_in_session()` which calls `get_file_diff()`.

**Impact:** For 100 violations, this could make **200-300 git calls**.

**Solution:** 
- Batch violations by file
- Pre-compute file diffs once per file
- Reuse for all violations in that file

---

## Performance Metrics (Current State)

### Estimated Git Calls Per Run

**Scenario:** 50 changed files, 5 date matches per file, 100 violations

| Operation | Git Calls | Estimated Time |
|-----------|-----------|----------------|
| `get_changed_files()` (cached) | 2-3 | 0.1-0.6s |
| `is_file_modified_in_session()` (50×) | **500-750** | **25-150s** |
| `is_line_changed_in_session()` (250×, cached) | 0-50 | 0-10s |
| `find_files_with_hash()` (10 untracked×) | **100-1000** | **5-200s** |
| Context management | 0 | 2-5s |
| Violation re-evaluation (100×) | 200-300 | 10-60s |
| **TOTAL** | **802-2,103** | **42-425s** |

**Result:** **42 seconds - 7 minutes** for a typical enforcement run

**Primary Bottleneck:** `is_file_modified_in_session()` accounts for **60-80%** of total execution time.

---

## Recommended Solutions (Priority Order)

### 🔴 **Priority 1: Critical (Immediate Impact - 70-85% improvement)**

#### 1.1 Cache `is_file_modified_in_session()` Results

**Problem:** The function is called multiple times for the same file (once in pre-computation, potentially again in other checkers).

**Solution:**
- Add `_file_modification_cache: Dict[str, bool]` to `GitUtils` class
- Cache results keyed by `(file_path, session_id, git_state_key)`
- Invalidate cache when git state changes

**Expected Impact:** Eliminate redundant calls (50-100 git calls saved)

**Implementation:**
```python
# In GitUtils.__init__:
self._file_modification_cache: Dict[str, bool] = {}

# In is_file_modified_in_session():
cache_key = f"{file_path}:{session.id}:{get_git_state_key(project_root)}"
if cache_key in git_utils._file_modification_cache:
    return git_utils._file_modification_cache[cache_key]

# ... existing logic ...

git_utils._file_modification_cache[cache_key] = result
return result
```

#### 1.2 Consolidate Git Diff Calls in `is_file_modified_in_session()`

**Problem:** Multiple separate `git diff` calls that could be combined.

**Solution:**
- Combine lines 109-112, 137-138, 142-143 into single call with all flags
- Use `git diff --numstat --ignore-all-space` once instead of three times
- Cache the result

**Expected Impact:** Reduce from 3-4 git calls to 1-2 per file (150-300 git calls saved)

**Implementation:**
```python
# Replace lines 109-143 with:
git_diff_result = git_utils.run_git_command([
    "diff", "--numstat", "--ignore-all-space", 
    "--ignore-cr-at-eol", "--ignore-blank-lines",
    "HEAD", "--", file_path
])

has_changes = bool(git_diff_result and git_diff_result.strip())
# Use this result for all three checks
```

#### 1.3 Optimize `find_files_with_hash()` for Untracked Files

**Problem:** Function checks up to 1000 files for hash matches, making many git calls.

**Solution:**
- Cache `git ls-files` result (already cached in `get_changed_files()`)
- Limit search to recently modified files (last 100) instead of all files
- Use file hash index if available

**Expected Impact:** Reduce from 100-1000 git calls to 10-100 (90% reduction)

**Implementation:**
```python
# In find_files_with_hash():
# Limit to recently modified files (last 100)
recent_files = self.run_git_command([
    "log", "--name-only", "--pretty=format:", 
    "-100", "--diff-filter=M"
]).strip().split('\n')
recent_files = [f for f in recent_files if f.strip()]

# Only check recent files + deleted files (limit to 200 total)
all_files_to_check = (recent_files + deleted_files)[:200]
```

#### 1.4 Pre-compute File Modification Status More Efficiently

**Problem:** `is_file_modified_in_session()` is called for every file individually, making many git calls.

**Solution:**
- Batch git operations: Get all file statuses in one `git diff --name-status` call
- Pre-compute modification status for all files at once using batch git commands
- Store results in cache for reuse

**Expected Impact:** Reduce from 500-750 git calls to 5-10 (99% reduction)

**Implementation:**
```python
# In date_checker.py, replace lines 271-285 with:
# Batch get all file modification statuses
all_file_statuses = git_utils.run_git_command([
    "diff", "--name-status", "--ignore-all-space",
    "--ignore-cr-at-eol", "--ignore-blank-lines", "HEAD"
])

# Parse status output and build cache
file_modification_cache = {}
for line in all_file_statuses.strip().split('\n'):
    if not line:
        continue
    parts = line.split('\t')
    if len(parts) >= 2:
        file_path = parts[1]
        status = parts[0]
        # M = modified, A = added, R = renamed (with content change)
        file_modification_cache[file_path] = status in ('M', 'A', 'R')
```

### 🟡 **Priority 2: High Impact (Additional 10-15% improvement)**

#### 2.1 Cache Context Management Results

**Solution:** Only run `_update_context_recommendations()` when files actually changed, cache for 5 minutes.

**Expected Impact:** Save 2-5 seconds per run

#### 2.2 Batch Violation Re-evaluation

**Solution:** Group violations by file, get file diff once per file, reuse for all violations.

**Expected Impact:** Reduce from 200-300 git calls to 50-100 (50-70% reduction)

---

## Expected Performance After Optimizations

### Optimistic Scenario (All Priority 1 fixes):

| Operation | Before | After | Improvement |
|-----------|--------|-------|-------------|
| Git calls | 802-2,103 | 50-150 | **90-95% reduction** |
| Execution time | 42-425s | 5-20s | **80-95% reduction** |
| `is_file_modified_in_session()` time | 25-150s | 0.5-2s | **95-99% reduction** |

**Result:** **5-20 seconds** for typical enforcement run (down from 42 seconds - 7 minutes)

---

## Implementation Plan

### Phase 1: Critical Fixes (Priority 1.1 - 1.4)

1. **Add file modification cache to GitUtils** (1 hour)
   - Add `_file_modification_cache` dictionary
   - Add cache key generation
   - Update `is_file_modified_in_session()` to use cache

2. **Consolidate git diff calls** (2 hours)
   - Refactor `is_file_modified_in_session()` to use single git diff call
   - Update logic to use consolidated result

3. **Optimize `find_files_with_hash()`** (1 hour)
   - Limit search to recent files
   - Cache tracked files list

4. **Batch file modification status computation** (2 hours)
   - Replace per-file calls with batch git command
   - Update `date_checker.py` to use batch results

**Total Time:** ~6 hours  
**Expected Improvement:** 80-95% reduction in execution time

### Phase 2: Additional Optimizations (Priority 2.1 - 2.2)

1. **Cache context management** (1 hour)
2. **Batch violation re-evaluation** (2 hours)

**Total Time:** ~3 hours  
**Expected Improvement:** Additional 10-15% improvement

---

## Testing Recommendations

1. **Add performance profiling:**
   ```python
   import cProfile
   import pstats
   
   profiler = cProfile.Profile()
   profiler.enable()
   # Run enforcement
   profiler.disable()
   stats = pstats.Stats(profiler)
   stats.sort_stats('cumulative')
   stats.print_stats(20)  # Top 20 functions
   ```

2. **Add git call counter:**
   ```python
   # In run_git_command_cached():
   global _git_call_count
   _git_call_count += 1
   logger.debug(f"Git call #{_git_call_count}: {' '.join(['git'] + args)}")
   ```

3. **Measure before/after:**
   - Run enforcement 10 times before changes
   - Record average execution time and git call count
   - Run enforcement 10 times after changes
   - Compare results

---

## Conclusion

The primary performance bottleneck is **`is_file_modified_in_session()` making 10-15 git calls per file**. Even though some caching was added in Phase 1 & 2, this function was not optimized and remains the main source of slowness.

**Key Findings:**
- `is_file_modified_in_session()` accounts for **60-80%** of total execution time
- Makes **500-750 git calls** for 50 files (10-15 per file)
- Many redundant git operations that could be consolidated
- `find_files_with_hash()` can make **100-1000 git calls** for untracked files

**Recommended Action:** Implement Priority 1 optimizations (especially 1.2, 1.3, and 1.4) for immediate **80-95% performance improvement**.

---

**Investigation Complete**  
**Next Steps:** Implement Priority 1 optimizations, then measure actual performance improvement

