# Predictive Context Management System - Fix Summary

**Date:** 2025-12-04  
**Quick Reference for Implementation**

---

## Critical Issues & Quick Fixes

### Issue 1: Unloading Logic Blind to Preloaded Context

**Location:** `.cursor/context_manager/preloader.py:104`

**Current Code:**
```python
currently_loaded = set(self.preloaded_contexts.get('active', []))
```

**Fixed Code:**
```python
previously_active = set(self.preloaded_contexts.get('active', []))
previously_preloaded = set(self.preloaded_contexts.get('preloaded', []))
currently_loaded = previously_active | previously_preloaded
```

**Impact:** Fixes memory leaks, state corruption

---

### Issue 2: File-Specific Context Never Auto-Loaded

**Location:** `.cursor/context_manager/preloader.py:71`

**Current Code:**
```python
active_context = [req for req in all_context if req.priority == 'PRIMARY' and req.category == 'required']
```

**Fixed Code:**
```python
def _select_active_context(self, all_context: List[ContextRequirement]) -> List[ContextRequirement]:
    """Smart adaptive selection: PRIMARY + HIGH priority contexts."""
    primary_required = [
        req for req in all_context
        if req.priority == "PRIMARY" and req.category == "required"
    ]
    
    high_priority = [
        req for req in all_context
        if req.priority == "HIGH" and req.file_path not in {r.file_path for r in primary_required}
    ]
    
    return primary_required + high_priority

# Then use:
active_context = self._select_active_context(all_context)
```

**Also Update:** `.cursor/context_manager/context_profiles.yaml` - Mark critical file-specific contexts as HIGH priority

**Impact:** Fixes missing context hallucinations

---

### Issue 3: Cascade Dependencies Not Respected

**Location:** `.cursor/context_manager/context_loader.py`

**Add to YAML:**
```yaml
dependencies:
  "@.cursor/rules/python_bible.mdc":
    - "@.cursor/rules/02-core.mdc"
    - "@.cursor/rules/07-observability.mdc"
  "@.cursor/rules/typescript_bible.mdc":
    - "@.cursor/rules/02-core.mdc"
  "@.cursor/rules/03-security.mdc":
    - "@.cursor/rules/02-core.mdc"
```

**Add Method:**
```python
def _expand_with_dependencies(self, requirements: List[ContextRequirement]) -> List[ContextRequirement]:
    """Recursively add dependency files."""
    result: Dict[str, ContextRequirement] = {r.file_path: r for r in requirements}
    visited: Set[str] = set()
    
    def dfs(file_path: str):
        if file_path in visited:
            return
        visited.add(file_path)
        
        deps = self.dependencies.get(file_path, [])
        for dep in deps:
            if dep not in result:
                result[dep] = ContextRequirement(
                    file_path=dep,
                    priority="HIGH",
                    category="dependency",
                    reason=f"Dependency of {file_path}"
                )
            dfs(dep)
    
    for req in list(requirements):
        dfs(req.file_path)
    
    return list(result.values())
```

**Impact:** Fixes inconsistent rule interpretation

---

### Issue 4: Task Prediction Lacks Semantic History

**Location:** `.cursor/context_manager/predictor.py`

**Enhance `predict_next_tasks()`:**
```python
def predict_next_tasks(self, current_task: Dict) -> List[TaskPrediction]:
    current_type = current_task.get('primary_task', 'unknown')
    scores: Dict[str, float] = {}
    
    # 1) Static workflow patterns
    static_patterns = self.workflow_patterns.get(current_type, {})
    for next_task, base_weight in static_patterns.items():
        scores[next_task] = scores.get(next_task, 0.0) + base_weight
    
    # 2) Dynamic transition stats
    for (src, dst), count in self.transition_stats.items():
        if src == current_type:
            scores[dst] = scores.get(dst, 0.0) + math.log1p(count)
    
    # 3) Message semantic analysis
    user_msg = (current_task.get('user_message') or '').lower()
    if 'test' in user_msg or 'assert' in user_msg:
        scores['run_tests'] = scores.get('run_tests', 0.0) + 1.5
    
    # Normalize and return
    return self._normalize(scores)
```

**Impact:** Improves pre-load accuracy

---

## Implementation Checklist

### Phase 1: Critical Fixes (2-3 hours)

- [ ] Fix unloading logic in `preloader.py:104`
- [ ] Add `_select_active_context()` method to `preloader.py`
- [ ] Update `manage_context()` to use new method
- [ ] Update `context_profiles.yaml` to mark critical file-specific as HIGH
- [ ] Test: Verify preloaded files are unloaded
- [ ] Test: Verify HIGH priority file-specific contexts are loaded

### Phase 2: Dependency Resolution (3-4 hours)

- [ ] Add `dependencies:` section to `context_profiles.yaml`
- [ ] Add `dependencies` parameter to `ContextLoader.__init__()`
- [ ] Add `_expand_with_dependencies()` method to `ContextLoader`
- [ ] Call `_expand_with_dependencies()` in `get_required_context()`
- [ ] Test: Verify dependencies are loaded recursively
- [ ] Test: Verify circular dependencies are handled

### Phase 3: Enhanced Prediction (4-5 hours)

- [ ] Create/update `workflow_patterns.py` with static patterns
- [ ] Add `transition_stats` parameter to `ContextPredictor.__init__()`
- [ ] Update `predict_next_tasks()` to use static + dynamic patterns
- [ ] Enhance message semantic analysis
- [ ] Add `get_transition_stats()` to `WorkflowTracker`
- [ ] Test: Verify predictions use both static and dynamic patterns

### Phase 4: Architectural Improvements (2-3 hours)

- [ ] Update `_save_state()` to use atomic writes
- [ ] Improve file count handling (smarter ranking)
- [ ] Test: Verify atomic state persistence
- [ ] Test: Verify file ranking works correctly

---

## Testing Commands

```bash
# Run unit tests
python -m pytest tests/test_context_loader_dependencies.py
python -m pytest tests/test_preloader_unloading.py
python -m pytest tests/test_preloader_file_specific_high_priority.py
python -m pytest tests/test_predictor_mixed_sources.py

# Run integration tests
python -m pytest tests/test_integration_context_flow.py

# Manual testing
python .cursor/scripts/auto-enforcer.py
```

---

## Rollback Plan

If issues arise:

1. **Restore from backup:**
   ```bash
   cp -r .cursor/context_manager.backup .cursor/context_manager
   ```

2. **Revert specific changes:**
   - Phase 1: Revert `preloader.py` changes
   - Phase 2: Remove `dependencies:` from YAML, revert `context_loader.py`
   - Phase 3: Revert `predictor.py` changes
   - Phase 4: Revert `_save_state()` changes

3. **Verify system works:**
   ```bash
   python .cursor/scripts/auto-enforcer.py
   ```

---

**Last Updated:** 2025-12-04  
**See:** `FIX_PLAN.md` for detailed implementation plan

