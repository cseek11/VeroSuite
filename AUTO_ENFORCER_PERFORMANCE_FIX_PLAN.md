# Auto-Enforcer Performance Fix Plan

**Date:** 2025-12-21  
**Status:** Ready for Implementation  
**Reference:** Python Bible Chapters 12, 7, 28  
**Target:** Reduce execution time from 55-244s to 5-15s (75-90% improvement)

---

## Executive Summary

This plan addresses the critical performance bottlenecks identified in the auto-enforcer:
- **1,115-1,195 git subprocess calls** per run (primary bottleneck)
- **No caching** of git operation results
- **Redundant file reads** and inefficient processing
- **Context management overhead** on every run

**Strategy:** Implement Python Bible best practices for caching, batching, and memory optimization.

---

## Python Bible Guidance Applied

### Chapter 12: Performance Optimization
- **12.7.1 LRU Cache:** Use `@lru_cache` for expensive repeated computations
- **12.7.2 Memoization:** Manual memoization for session-level caching
- **12.8 IO-bound Optimization:** Batch operations, use buffered IO
- **12.12.1 Generators:** Use generators for memory-efficient iteration
- **12.4 Rule 3:** Prefer local variables to globals (LOAD_FAST vs LOAD_GLOBAL)

### Chapter 7: Classes & OOP
- **7.5.3 __slots__:** Already implemented (EnforcementSession uses `@dataclass(slots=True)`)

### Chapter 28: Memory Architecture
- **Memory optimization:** Use generators, avoid large dicts when possible
- **Reference counting:** Understand object lifetime for caching strategies

---

## Phase 1: Critical Caching (Priority 1) 🔴

**Target:** 50-80% reduction in git calls  
**Expected Time:** 2-3 hours  
**Python Bible Reference:** Chapter 12.7.1 (LRU Cache), 12.7.2 (Memoization)

### 1.1 Cache `get_changed_files()` Result

**Problem:** Called 15 times directly + 50 times indirectly = 65+ calls per run

**Solution:** Session-level caching with invalidation

**Implementation:**

```python
# In __init__ (around line 400)
self._cached_changed_files: Optional[Dict[str, List[str]]] = None
self._changed_files_cache_key: Optional[str] = None

# In run_all_checks() (line 3317)
def run_all_checks(self, user_message: Optional[str] = None) -> bool:
    # ... existing code ...
    
    # Cache changed files at start of run
    # Python Bible 12.7.2: Manual memoization for session-level caching
    cache_key = self._get_git_state_key()  # Create unique key for git state
    if self._cached_changed_files is None or self._changed_files_cache_key != cache_key:
        self._cached_changed_files = {
            'tracked': self._get_changed_files_impl(include_untracked=False),
            'untracked': self._get_changed_files_impl(include_untracked=True)
        }
        self._changed_files_cache_key = cache_key
    
    # Use cached result throughout
    all_changed_files = self._cached_changed_files['tracked']
    # ... rest of method ...

# Refactor get_changed_files() (line 949)
def get_changed_files(self, include_untracked: bool = False) -> List[str]:
    """
    Get list of changed files from git (cached).
    
    Python Bible 12.7.2: Manual memoization for session-level caching.
    Cache is invalidated when git state changes.
    """
    # Use cached result if available
    if self._cached_changed_files is not None:
        key = 'untracked' if include_untracked else 'tracked'
        return self._cached_changed_files.get(key, [])
    
    # Fallback to direct call (shouldn't happen in normal flow)
    return self._get_changed_files_impl(include_untracked)

def _get_changed_files_impl(self, include_untracked: bool = False) -> List[str]:
    """Internal implementation (actual git calls)."""
    # ... existing git command logic ...
    staged = self.run_git_command(['diff', '--cached', ...])
    unstaged = self.run_git_command(['diff', ...])
    # ... rest of existing code ...

def _get_git_state_key(self) -> str:
    """
    Generate cache key based on git state.
    
    Python Bible 12.7.4: Cache invalidation patterns - version tagging.
    """
    # Use git HEAD + index state as cache key
    head = self.run_git_command(['rev-parse', 'HEAD'])
    index = self.run_git_command(['diff', '--cached', '--name-only'])
    return f"{head}:{hash(index) if index else ''}"
```

**Files to Modify:**
- `.cursor/scripts/auto-enforcer.py` lines ~400 (__init__), 3317 (run_all_checks), 949 (get_changed_files)

**Testing:**
- Verify cache is used (add debug logging)
- Verify cache invalidation works (change git state, verify new cache)
- Measure git call reduction

---

### 1.2 Cache Git Diff Results

**Problem:** `get_file_diff()` called 250+ times in date checking loop, each executes 2-3 git commands

**Solution:** Session-level cache with file path as key

**Implementation:**

```python
# In __init__ (around line 400)
self._file_diff_cache: Dict[str, Optional[str]] = {}

# In get_file_diff() (line 981)
def get_file_diff(self, file_path: str) -> Optional[str]:
    """
    Get git diff for a specific file (cached).
    
    Python Bible 12.7.2: Manual memoization for session-level caching.
    """
    # Check cache first
    if file_path in self._file_diff_cache:
        return self._file_diff_cache[file_path]
    
    # Compute diff (existing logic)
    try:
        tracked = self.run_git_command(['ls-files', '--error-unmatch', file_path])
        if not tracked:
            self._file_diff_cache[file_path] = None
            return None
        
        staged_diff = self.run_git_command(['diff', '--cached', file_path])
        unstaged_diff = self.run_git_command(['diff', file_path])
        
        combined_diff = ""
        if staged_diff:
            combined_diff += staged_diff
        if unstaged_diff:
            if combined_diff:
                combined_diff += "\n"
            combined_diff += unstaged_diff
        
        result = combined_diff if combined_diff else None
        self._file_diff_cache[file_path] = result
        return result
    except (subprocess.TimeoutExpired, FileNotFoundError, OSError, ValueError) as e:
        logger.debug(...)
        self._file_diff_cache[file_path] = None
        return None

# Clear cache when git state changes (in run_all_checks)
def run_all_checks(self, user_message: Optional[str] = None) -> bool:
    # ... existing code ...
    
    # Clear diff cache when starting new run
    # Python Bible 12.7.4: Cache invalidation on state change
    cache_key = self._get_git_state_key()
    if self._changed_files_cache_key != cache_key:
        self._file_diff_cache.clear()
    
    # ... rest of method ...
```

**Files to Modify:**
- `.cursor/scripts/auto-enforcer.py` lines ~400 (__init__), 981 (get_file_diff), 3317 (run_all_checks)

**Testing:**
- Verify cache hits in date checking loop
- Measure git call reduction (should be ~750 calls → ~50 calls)

---

### 1.3 Fix `is_file_modified_in_session()` Internal Call

**Problem:** Calls `get_changed_files()` internally, multiplying git calls

**Solution:** Use cached changed files list

**Implementation:**

```python
# In is_file_modified_in_session() (line 1288)
def is_file_modified_in_session(self, file_path: str) -> bool:
    """
    Check if a file was actually modified in the current session.
    
    FIXED: Uses cached changed_files list instead of calling get_changed_files().
    Python Bible 12.4 Rule 3: Prefer local variables (cached list) to function calls.
    """
    # Use cached changed files (set in run_all_checks)
    # Python Bible 12.7.2: Use cached data instead of recomputing
    if self._cached_changed_files is None:
        # Fallback: compute if cache not available (shouldn't happen)
        changed_files = self.get_changed_files()
    else:
        changed_files = self._cached_changed_files['tracked']
    
    if file_path not in changed_files:
        return False
    
    # ... rest of existing hash comparison logic ...
```

**Files to Modify:**
- `.cursor/scripts/auto-enforcer.py` line 1288 (is_file_modified_in_session)

**Testing:**
- Verify no additional `get_changed_files()` calls from this method
- Measure performance improvement

---

### 1.4 Pre-compute File Modification Status

**Problem:** `is_file_modified_in_session()` called in loop for each file

**Solution:** Batch computation at start of `check_hardcoded_dates()`

**Implementation:**

```python
# In check_hardcoded_dates() (line 2004)
def check_hardcoded_dates(self) -> bool:
    # ... existing setup code ...
    
    # Python Bible 12.8: Batch operations for IO-bound workloads
    # Pre-compute file modification status for all files at once
    changed_files = self.get_changed_files(include_untracked=True)
    
    # Batch compute modification status (O(n) instead of O(n²))
    file_modification_cache = {}
    for file_path_str in changed_files:
        file_path = self.project_root / file_path_str
        if file_path.exists() and not file_path.is_dir():
            file_modification_cache[file_path_str] = self.is_file_modified_in_session(file_path_str)
    
    # ... existing file loop ...
    for file_path_str in changed_files:
        # ... existing skip logic ...
        
        # Use pre-computed status (O(1) lookup)
        # Python Bible 12.4: Prefer local variables (dict lookup) to function calls
        file_modified = file_modification_cache.get(file_path_str, False)
        
        if not file_modified:
            continue
        
        # ... rest of date checking logic ...
```

**Files to Modify:**
- `.cursor/scripts/auto-enforcer.py` line 2004 (check_hardcoded_dates)

**Testing:**
- Verify batch computation works
- Measure performance improvement

---

## Phase 2: File Processing Optimization (Priority 2) 🟡

**Target:** 30-50% memory reduction, faster I/O  
**Expected Time:** 2-3 hours  
**Python Bible Reference:** Chapter 12.12.1 (Generators), 12.8 (IO-bound Optimization)

### 2.1 Replace `f.read()` with Line-by-Line Processing

**Problem:** 4 locations still use `f.read()`, loading entire files into memory

**Solution:** Use generators for line-by-line processing

**Implementation:**

```python
# Location 1: check_hardcoded_dates() (line 2139)
# BEFORE:
with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
    file_content = f.read()
    date_matches = detector.find_dates(file_content, context_lines=3)

# AFTER (if DateDetector supports line-by-line):
# Python Bible 12.12.1: Use generators for memory-efficient iteration
if detector and doc_context:
    # Use line-by-line processing if detector supports it
    # Otherwise, keep f.read() but add size check
    file_size = file_path.stat().st_size
    if file_size > 10 * 1024 * 1024:  # 10MB threshold
        # For large files, use line-by-line
        date_matches = []
        with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
            for line_num, line in enumerate(f, 1):
                # Process line-by-line (detector needs to support this)
                matches = detector.find_dates_in_line(line, line_num)
                date_matches.extend(matches)
    else:
        # For small files, use existing method
        with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
            file_content = f.read()
        date_matches = detector.find_dates(file_content, context_lines=3)

# Location 2: check_error_handling() (line 2422)
# BEFORE:
with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
    content = f.read()
    lines = content.split('\n')

# AFTER:
# Python Bible 12.12.1: Use generators for memory-efficient iteration
with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
    lines = list(f)  # More efficient than read().split('\n')
    # Or use generator if we don't need all lines:
    # for line_num, line in enumerate(f, 1):
    #     # Process line

# Location 3: check_logging() (line 2486)
# Same as Location 2

# Location 4: check_python_bible() (line 2544)
# BEFORE:
with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
    content = f.read()

# AFTER:
# Python Bible 12.12.1: Use generators for memory-efficient iteration
# For regex searches, we can use line-by-line
with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
    for line in f:
        # Check patterns line-by-line instead of full content
        if re.search(r'def\s+\w+\([^)]*=\s*\[', line):
            # ... handle violation ...
        if re.search(r'except\s*:', line):
            # ... handle violation ...
```

**Files to Modify:**
- `.cursor/scripts/auto-enforcer.py` lines 2139, 2422, 2486, 2544

**Testing:**
- Test with large files (>10MB)
- Verify memory usage reduction
- Verify functionality unchanged

---

### 2.2 Add LRU Cache to `run_git_command()`

**Problem:** Same git commands run repeatedly with same arguments

**Solution:** Add `@lru_cache` with appropriate maxsize

**Implementation:**

```python
# In run_git_command() (line 923)
from functools import lru_cache

# Python Bible 12.7.1: Use @lru_cache for expensive repeated computations
# Note: Can't use @lru_cache directly on method (self is mutable)
# Use module-level function or functools.cached_property pattern

# Option 1: Module-level function (Python Bible 12.2.3 War Story pattern)
@lru_cache(maxsize=256)
def _run_git_command_cached(project_root: str, command_tuple: tuple) -> str:
    """
    Cached git command execution.
    
    Python Bible 12.7.1: LRU Cache for expensive repeated computations.
    Python Bible 12.2.3: Extract to module-level function to avoid 'self' in cache key.
    """
    args = list(command_tuple)
    try:
        result = subprocess.run(
            ['git'] + args,
            cwd=project_root,
            capture_output=True,
            text=True,
            encoding='utf-8',
            errors='replace',
            timeout=10,
            check=False
        )
        if result.returncode == 0:
            return result.stdout.strip() if result.stdout else ""
        return ""
    except (subprocess.TimeoutExpired, FileNotFoundError) as e:
        logger.warn(...)
        return ""

# In VeroFieldEnforcer class
def run_git_command(self, args: List[str]) -> str:
    """
    Run git command and return output (with caching).
    
    Python Bible 12.7.1: LRU Cache for expensive repeated computations.
    """
    # Use cached function with hashable arguments
    command_tuple = tuple(args)  # Convert to tuple for hashing
    project_root_str = str(self.project_root)
    
    return _run_git_command_cached(project_root_str, command_tuple)

# Clear cache when git state might change (in run_all_checks)
def run_all_checks(self, user_message: Optional[str] = None) -> bool:
    # ... existing code ...
    
    # Clear git command cache if git state changed
    # Python Bible 12.7.4: Cache invalidation on state change
    cache_key = self._get_git_state_key()
    if self._changed_files_cache_key != cache_key:
        _run_git_command_cached.cache_clear()
    
    # ... rest of method ...
```

**Files to Modify:**
- `.cursor/scripts/auto-enforcer.py` line 923 (run_git_command), add module-level function

**Testing:**
- Verify cache hits (add debug logging)
- Measure git call reduction
- Test cache invalidation

---

## Phase 3: Context Management Optimization (Priority 2) 🟡

**Target:** 2-5 seconds saved per run  
**Expected Time:** 1-2 hours  
**Python Bible Reference:** Chapter 12.7.4 (Cache Invalidation), 12.12.3 (Lazy Loading)

### 3.1 Defer Context Management Updates

**Problem:** Runs at start of every check, even when no files changed

**Solution:** Only run when files actually changed, cache results

**Implementation:**

```python
# In run_all_checks() (line 3317)
def run_all_checks(self, user_message: Optional[str] = None) -> bool:
    # ... existing code ...
    
    # Check file count early to optimize checks
    all_changed_files = self.get_changed_files()
    changed_files_count = len(all_changed_files)
    
    # Python Bible 12.12.3: Lazy loading - only update context if needed
    # Only update context recommendations if files changed or user message provided
    if PREDICTIVE_CONTEXT_AVAILABLE and (changed_files_count > 0 or user_message):
        try:
            # Check if recommendations are stale (older than 5 minutes)
            recommendations_file = self.project_root / ".cursor" / "context_manager" / "recommendations.md"
            should_update = True
            
            if recommendations_file.exists():
                rec_stat = recommendations_file.stat()
                rec_mtime = datetime.fromtimestamp(rec_stat.st_mtime, tz=timezone.utc)
                now = datetime.now(timezone.utc)
                age_seconds = (now - rec_mtime).total_seconds()
                
                # Python Bible 12.7.4: Cache invalidation - TTL pattern
                # Only update if stale (>5 minutes) or files changed
                if age_seconds < 300 and changed_files_count == 0:  # 5 minutes TTL
                    should_update = False
                    logger.debug(
                        "Skipping context update (recommendations fresh)",
                        operation="run_all_checks",
                        age_seconds=age_seconds
                    )
            
            if should_update:
                self._update_context_recommendations(user_message=user_message)
        except Exception as e:
            logger.error(...)
    
    # ... rest of method ...
```

**Files to Modify:**
- `.cursor/scripts/auto-enforcer.py` line 3317 (run_all_checks)

**Testing:**
- Verify context update skipped when no files changed
- Verify TTL caching works (5-minute window)
- Measure time saved

---

## Phase 4: Violation Re-evaluation Optimization (Priority 3) 🟢

**Target:** 50-70% reduction in git calls for re-evaluation  
**Expected Time:** 1-2 hours  
**Python Bible Reference:** Chapter 12.8 (Batch Operations)

### 4.1 Batch Violation Re-evaluation

**Problem:** Re-evaluates each violation individually, making 200-300 git calls

**Solution:** Group violations by file, get diff once per file

**Implementation:**

```python
# In generate_agent_status() (line 2667)
def generate_agent_status(self):
    """Generate AGENT_STATUS.md file."""
    status_file = self.enforcement_dir / "AGENT_STATUS.md"
    
    # Python Bible 12.8: Batch operations for IO-bound workloads
    # Group violations by file to batch git diff calls
    violations_by_file = defaultdict(list)
    for violation in self.violations:
        if violation.file_path:
            violations_by_file[violation.file_path].append(violation)
    
    # Pre-compute file diffs for all files with violations
    file_diffs = {}
    for file_path in violations_by_file.keys():
        file_diffs[file_path] = self.get_file_diff(file_path)  # Uses cache from Phase 1.2
    
    # Re-evaluate violations using pre-computed diffs
    for violation in self.violations:
        # Use cached file diff instead of calling get_file_diff() again
        file_path = violation.file_path
        if file_path and file_path in file_diffs:
            # Re-implement re_evaluate_violation_scope to use pre-computed diff
            new_scope = self._re_evaluate_violation_scope_cached(
                violation, 
                file_diffs[file_path]
            )
        else:
            new_scope = self.re_evaluate_violation_scope(violation)
        
        if new_scope != violation.session_scope:
            # ... existing update logic ...
    
    # ... rest of method ...

def _re_evaluate_violation_scope_cached(
    self, 
    violation: Violation, 
    file_diff: Optional[str]
) -> str:
    """
    Re-evaluate violation scope using pre-computed file diff.
    
    Python Bible 12.4 Rule 3: Prefer local variables (cached diff) to function calls.
    """
    if not violation.file_path or not violation.line_number:
        return violation.session_scope
    
    if file_diff is None:
        # Untracked file - check if new
        # ... existing logic ...
        return "current_session"  # Simplified
    
    # Parse diff to find changed line ranges (existing logic)
    for line in file_diff.split('\n'):
        if line.startswith('@@'):
            # ... existing parsing logic ...
            if new_start <= violation.line_number <= new_end:
                return "current_session"
    
    return "historical"
```

**Files to Modify:**
- `.cursor/scripts/auto-enforcer.py` line 2667 (generate_agent_status), add helper method

**Testing:**
- Verify batch processing works
- Measure git call reduction
- Verify violation scopes still correct

---

## Implementation Checklist

### Phase 1: Critical Caching (Priority 1) 🔴
- [ ] 1.1: Add `_cached_changed_files` to `__init__`
- [ ] 1.1: Implement `_get_git_state_key()`
- [ ] 1.1: Refactor `get_changed_files()` to use cache
- [ ] 1.1: Update `run_all_checks()` to populate cache
- [ ] 1.2: Add `_file_diff_cache` to `__init__`
- [ ] 1.2: Update `get_file_diff()` to use cache
- [ ] 1.2: Clear cache in `run_all_checks()`
- [ ] 1.3: Fix `is_file_modified_in_session()` to use cached list
- [ ] 1.4: Pre-compute file modification status in `check_hardcoded_dates()`
- [ ] **Testing:** Measure git call reduction (target: 90-95% reduction)

### Phase 2: File Processing (Priority 2) 🟡
- [ ] 2.1: Replace `f.read()` in `check_hardcoded_dates()` (line 2139)
- [ ] 2.1: Replace `f.read()` in `check_error_handling()` (line 2422)
- [ ] 2.1: Replace `f.read()` in `check_logging()` (line 2486)
- [ ] 2.1: Replace `f.read()` in `check_python_bible()` (line 2544)
- [ ] 2.2: Add module-level `_run_git_command_cached()` function
- [ ] 2.2: Update `run_git_command()` to use cached function
- [ ] 2.2: Add cache clearing in `run_all_checks()`
- [ ] **Testing:** Test with large files, measure memory reduction

### Phase 3: Context Management (Priority 2) 🟡
- [ ] 3.1: Add TTL check in `run_all_checks()`
- [ ] 3.1: Skip context update when no files changed
- [ ] **Testing:** Measure time saved

### Phase 4: Violation Re-evaluation (Priority 3) 🟢
- [ ] 4.1: Group violations by file in `generate_agent_status()`
- [ ] 4.1: Pre-compute file diffs
- [ ] 4.1: Add `_re_evaluate_violation_scope_cached()` helper
- [ ] **Testing:** Measure git call reduction

---

## Performance Targets

| Metric | Before | After (Phase 1) | After (All Phases) |
|--------|--------|-----------------|-------------------|
| Git calls | 1,115-1,195 | 100-150 | 50-100 |
| Execution time | 55-244s | 10-30s | 5-15s |
| Memory usage | 15-20MB | 12-15MB | 8-12MB |
| Improvement | Baseline | 60-75% | 75-90% |

---

## Testing Strategy

### Unit Tests
- Test cache hit/miss scenarios
- Test cache invalidation
- Test line-by-line file processing
- Test batch operations

### Integration Tests
- Run full enforcement on test repo
- Measure actual git call count
- Measure execution time
- Verify functionality unchanged

### Performance Tests
- Before/after benchmarks
- Memory profiling with `tracemalloc` (Python Bible 12.3.4)
- CPU profiling with `cProfile` (Python Bible 12.3.1)

---

## Risk Mitigation

### Cache Invalidation
- **Risk:** Stale cache data
- **Mitigation:** Use git state key for cache invalidation
- **Testing:** Verify cache clears when git state changes

### Functionality Regression
- **Risk:** Optimizations break existing functionality
- **Mitigation:** Comprehensive testing, gradual rollout
- **Testing:** Run full test suite, verify all checks still work

### Memory Leaks
- **Risk:** Caches grow unbounded
- **Mitigation:** Use LRU cache with maxsize, clear on state change
- **Testing:** Memory profiling with `tracemalloc`

---

## Success Criteria

✅ **Phase 1 Complete:**
- Git calls reduced by 90-95%
- Execution time reduced by 60-75%
- All tests pass

✅ **All Phases Complete:**
- Execution time: 5-15 seconds (down from 55-244s)
- Memory usage: 8-12MB (down from 15-20MB)
- Git calls: 50-100 (down from 1,115-1,195)
- All functionality preserved

---

## Next Steps

1. **Start with Phase 1.1** (cache `get_changed_files()`)
2. **Measure improvement** after each phase
3. **Iterate** based on results
4. **Document** performance gains

---

**Plan Status:** Ready for Implementation  
**Estimated Total Time:** 6-10 hours  
**Expected Improvement:** 75-90% performance gain



