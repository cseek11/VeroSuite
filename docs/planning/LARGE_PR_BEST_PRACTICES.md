# Best Practices for Large PRs

**Date:** 2025-11-17  
**Context:** Real-world scenarios where PRs can be large

---

## Recommended Approach: Fix the PR (Option 1)

For real-world large PRs, **Option 1 (Fix the PR)** is the best approach because:

### ✅ Benefits

1. **Maintains Code Quality**
   - CI checks catch issues early
   - Prevents technical debt accumulation
   - Ensures codebase consistency

2. **REWARD_SCORE Handles Large PRs Well**
   - Processes diffs file-by-file (efficient)
   - Scales to large PRs without performance issues
   - Provides granular feedback per file

3. **Prevents Future Issues**
   - Catches problems before merge
   - Reduces post-merge bug fixing
   - Maintains repository health

---

## Improvements for Large PRs

### 1. Preventive Measures

**Add to `.gitignore`:**
```
# Python
__pycache__/
*.py[cod]
*$py.class
*.so
.Python
```

This prevents cache files from being committed in the first place.

### 2. CI Check Configuration

**Make Some Checks Non-Blocking:**
- Documentation linting: Can be warnings (not blocking)
- File organization: Can allow exceptions for large refactors
- Observability: Can be warnings for incremental improvements

**Example:**
```yaml
- name: Documentation Linting
  continue-on-error: true  # Non-blocking for large PRs
```

### 3. Incremental Fix Strategy

For very large PRs:
1. **Fix Critical Issues First** (blocking CI checks)
2. **Address Warnings Incrementally** (non-blocking)
3. **Document Known Issues** (if fixing everything is impractical)

### 4. REWARD_SCORE Optimization

The REWARD_SCORE system already handles large PRs efficiently:
- ✅ File-by-file processing (no memory issues)
- ✅ Parallel scoring (fast)
- ✅ Granular feedback (helps identify problem areas)

---

## When to Use Other Options

### Option 2: Simpler Test PR
- **Use for:** Testing REWARD_SCORE system
- **Not for:** Real-world development

### Option 3: Check REWARD_SCORE Anyway
- **Use for:** Understanding score without blocking
- **Not for:** Production PRs (PR won't be mergeable)

---

## Real-World Workflow

### For Large PRs:

1. **Pre-commit Checks:**
   ```bash
   # Run locally before pushing
   npm run lint
   npm run typecheck
   python -m pytest
   ```

2. **Incremental Commits:**
   - Fix issues in smaller commits
   - Makes review easier
   - Allows partial progress

3. **CI Feedback Loop:**
   - Check CI results
   - Fix blocking issues first
   - Address warnings incrementally

4. **REWARD_SCORE Review:**
   - Check score breakdown
   - Identify low-scoring files
   - Improve incrementally

---

## Configuration Recommendations

### `.gitignore` Updates
- ✅ Add Python cache files
- ✅ Add build artifacts
- ✅ Add IDE-specific files

### CI Workflow Updates
- ✅ Make documentation linting non-blocking
- ✅ Allow file organization exceptions for refactors
- ✅ Provide clear error messages

### REWARD_SCORE Settings
- ✅ Already optimized for large PRs
- ✅ File-level scoring provides granular feedback
- ✅ No changes needed

---

## Summary

**Best Practice:** Fix the PR (Option 1) + Preventive Measures

**Why:**
- Maintains code quality
- REWARD_SCORE handles large PRs efficiently
- Prevents future issues
- Scales to any PR size

**Improvements:**
- Add `__pycache__` to `.gitignore` ✅
- Configure CI checks appropriately
- Use incremental fix strategy
- Leverage REWARD_SCORE file-level feedback

---

**Last Updated:** 2025-11-17

