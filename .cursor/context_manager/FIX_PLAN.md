# Predictive Context Management System - Fix Plan

**Date:** 2025-12-01  
**Status:** Implementation Plan  
**Priority:** CRITICAL

---

## Executive Summary

This plan addresses 4 critical issues identified in the independent audit that prevent the predictive context management system from functioning correctly:

1. **Issue 1:** "currently_loaded" only tracks ACTIVE files, not preloaded files → Unloading logic is blind
2. **Issue 2:** File-specific context is always MEDIUM priority → Never auto-loaded
3. **Issue 3:** Cascade dependencies between context files not respected → Missing required knowledge
4. **Issue 4:** Task prediction lacks semantic history → Low pre-load accuracy

---

## Issue Analysis & Fix Strategy

### Issue 1: Unloading Logic Blind to Preloaded Context

**Problem:**
- Line 104 in `preloader.py`: `currently_loaded = set(self.preloaded_contexts.get('active', []))`
- Only tracks `active`, ignores `preloaded`
- Preloaded files accumulate forever, never unloaded
- State diverges from reality

**Fix:**
```python
# BEFORE (line 104):
currently_loaded = set(self.preloaded_contexts.get('active', []))

# AFTER:
previously_active = set(self.preloaded_contexts.get('active', []))
previously_preloaded = set(self.preloaded_contexts.get('preloaded', []))
currently_loaded = previously_active | previously_preloaded
```

**Impact:** HIGH - Fixes memory leaks and state corruption

---

### Issue 2: File-Specific Context Never Auto-Loaded

**Problem:**
- Line 71 in `preloader.py`: Only loads `req.priority == 'PRIMARY' and req.category == 'required'`
- File-specific context is always `priority='MEDIUM'` (line 146 in `context_loader.py`)
- Result: Editing `schema.prisma` won't load database rules automatically

**Fix Strategy:**
1. Allow HIGH priority file-specific context to be auto-loaded
2. Update `context_profiles.yaml` to mark critical file-specific contexts as HIGH priority
3. Modify `_select_active_context()` to include HIGH priority contexts

**Implementation:**
```python
# In preloader.py, replace line 71:
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
```

**Impact:** HIGH - Fixes missing context hallucinations

---

### Issue 3: Cascade Dependencies Not Respected

**Problem:**
- `python_bible.mdc` requires `02-core.mdc` which requires `07-observability.mdc`
- Current system only loads PRIMARY contexts, ignores dependencies
- Result: Rules referencing missing dependencies produce hallucinations

**Fix Strategy:**
1. Add dependency metadata to `context_profiles.yaml`
2. Implement recursive dependency expansion in `context_loader.py`
3. Mark dependencies as HIGH priority

**Implementation:**
```yaml
# Add to context_profiles.yaml:
dependencies:
  "@.cursor/rules/python_bible.mdc":
    - "@.cursor/rules/02-core.mdc"
    - "@.cursor/rules/07-observability.mdc"
  "@.cursor/rules/typescript_bible.mdc":
    - "@.cursor/rules/02-core.mdc"
  "@.cursor/rules/03-security.mdc":
    - "@.cursor/rules/02-core.mdc"
```

**Code Changes:**
- Add `_expand_with_dependencies()` method to `ContextLoader`
- Call after getting base requirements
- Recursively load dependencies as HIGH priority

**Impact:** HIGH - Fixes inconsistent rule interpretation

---

### Issue 4: Task Prediction Lacks Semantic History

**Problem:**
- Predictor only looks at current task and file list
- No semantic analysis of user messages
- No workflow transition statistics
- 70% threshold too high without better predictions

**Fix Strategy:**
1. Integrate workflow transition statistics from `workflow_tracker`
2. Add semantic message analysis (keywords: "test", "doc", "refactor")
3. Use static workflow patterns + dynamic transition stats
4. Lower threshold or improve prediction accuracy

**Implementation:**
- Enhance `predictor.py` to use:
  - Static workflow patterns (from `workflow_patterns.py`)
  - Dynamic transition stats (from `workflow_tracker` or `prediction_history.json`)
  - Message semantic analysis
  - File type patterns

**Impact:** MEDIUM - Improves pre-load accuracy and reduces false positives

---

## Implementation Plan

### Phase 1: Critical Fixes (Issues 1-2) - IMMEDIATE

**Priority:** CRITICAL  
**Estimated Time:** 2-3 hours  
**Risk:** LOW (isolated changes)

#### Task 1.1: Fix Unloading Logic (Issue 1)

**File:** `.cursor/context_manager/preloader.py`

**Changes:**
1. Update `manage_context()` method (line 102-105):
   - Track both `active` and `preloaded` in `currently_loaded`
   - Update unload calculation to use union

**Test:**
- Verify preloaded files are unloaded when no longer needed
- Verify state persistence includes both active and preloaded

#### Task 1.2: Enable HIGH Priority File-Specific Context (Issue 2)

**Files:**
- `.cursor/context_manager/preloader.py` (add `_select_active_context()` method)
- `.cursor/context_manager/context_profiles.yaml` (mark critical file-specific as HIGH)

**Changes:**
1. Add `_select_active_context()` method to `ContextPreloader`
2. Update `manage_context()` to use new method
3. Update `context_profiles.yaml` to mark critical file-specific contexts as HIGH:
   - Database files → `03-security.mdc`, `05-data.mdc` (HIGH)
   - Auth files → `03-security.mdc` (HIGH)
   - Component files → `09-frontend.mdc`, `13-ux-consistency.mdc` (HIGH)

**Test:**
- Verify editing `schema.prisma` loads database rules
- Verify editing `auth.service.ts` loads security rules
- Verify editing `Component.tsx` loads frontend rules

---

### Phase 2: Dependency Resolution (Issue 3) - HIGH PRIORITY

**Priority:** HIGH  
**Estimated Time:** 3-4 hours  
**Risk:** MEDIUM (requires YAML schema changes)

#### Task 2.1: Add Dependency Metadata

**File:** `.cursor/context_manager/context_profiles.yaml`

**Changes:**
1. Add `dependencies:` section at root level
2. Map each context file to its dependencies
3. Document dependency relationships

**Example:**
```yaml
dependencies:
  "@.cursor/rules/python_bible.mdc":
    - "@.cursor/rules/02-core.mdc"
    - "@.cursor/rules/07-observability.mdc"
  "@.cursor/rules/typescript_bible.mdc":
    - "@.cursor/rules/02-core.mdc"
  "@.cursor/rules/03-security.mdc":
    - "@.cursor/rules/02-core.mdc"
  "@.cursor/rules/05-data.mdc":
    - "@.cursor/rules/02-core.mdc"
    - "@.cursor/rules/03-security.mdc"
```

#### Task 2.2: Implement Dependency Expansion

**File:** `.cursor/context_manager/context_loader.py`

**Changes:**
1. Add `dependencies` parameter to `__init__()` (load from YAML)
2. Add `_expand_with_dependencies()` method:
   - Recursively traverse dependency graph
   - Add dependencies as HIGH priority
   - Avoid circular dependencies
   - Deduplicate with existing requirements
3. Call `_expand_with_dependencies()` in `get_required_context()`

**Test:**
- Verify loading `python_bible.mdc` automatically loads `02-core.mdc` and `07-observability.mdc`
- Verify circular dependencies are handled
- Verify dependencies are marked HIGH priority

---

### Phase 3: Enhanced Prediction (Issue 4) - MEDIUM PRIORITY

**Priority:** MEDIUM  
**Estimated Time:** 4-5 hours  
**Risk:** MEDIUM (requires workflow tracker integration)

#### Task 3.1: Integrate Workflow Transition Statistics

**File:** `.cursor/context_manager/predictor.py`

**Changes:**
1. Add `transition_stats` parameter to `__init__()`:
   - Load from `prediction_history.json` or `workflow_tracker`
   - Format: `{(current_task, next_task): count}`
2. Update `predict_next_tasks()` to use:
   - Static workflow patterns (existing)
   - Dynamic transition stats (new)
   - Message semantic analysis (enhance existing)
   - File type patterns (enhance existing)

**Implementation:**
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

#### Task 3.2: Create Workflow Patterns File

**File:** `.cursor/context_manager/workflow_patterns.py` (may already exist)

**Changes:**
1. Define static workflow patterns:
   - `edit_code → run_tests` (weight: 2.5)
   - `run_tests → fix_bug` (weight: 2.0)
   - `fix_bug → run_tests` (weight: 2.0)
   - etc.
2. Export as dictionary for predictor

#### Task 3.3: Update Workflow Tracker Integration

**File:** `.cursor/context_manager/workflow_tracker.py`

**Changes:**
1. Add method to export transition statistics:
   - `get_transition_stats() -> Dict[Tuple[str, str], int]`
   - Count transitions between task types
   - Return as `{(current, next): count}`

**Test:**
- Verify predictions use both static and dynamic patterns
- Verify message analysis improves accuracy
- Verify transition stats are loaded correctly

---

### Phase 4: Architectural Improvements - LOW PRIORITY

**Priority:** LOW  
**Estimated Time:** 2-3 hours  
**Risk:** LOW

#### Task 4.1: Atomic State Persistence

**File:** `.cursor/context_manager/preloader.py`

**Changes:**
1. Update `_save_state()` to use atomic writes:
   - Write to temp file first
   - Use `os.replace()` to atomically replace
   - Handle errors gracefully

**Implementation:**
```python
def _save_state(self) -> None:
    """Atomic write: write to temp + replace to avoid corruption."""
    import tempfile
    import os
    
    tmp_dir = self.state_file.parent
    os.makedirs(tmp_dir, exist_ok=True)
    
    tmp_fd, tmp_path = tempfile.mkstemp(
        prefix="context_state_", suffix=".json", dir=tmp_dir
    )
    try:
        with os.fdopen(tmp_fd, 'w', encoding='utf-8') as f:
            json.dump(self.preloaded_contexts, f, indent=2)
        os.replace(tmp_path, self.state_file)
    except Exception as e:
        logger.error("Failed to save context state", exc_info=e)
        try:
            os.remove(tmp_path)
        except OSError:
            pass
```

#### Task 4.2: Improve File Count Handling

**File:** `.cursor/context_manager/context_loader.py`

**Changes:**
1. When too many files changed, use smarter ranking:
   - Rank files by relevance (recent, modified, etc.)
   - Select top N most relevant files
   - Not just first N files

---

## Testing Strategy

### Unit Tests

1. **Test Unloading Logic:**
   - Verify preloaded files are included in `currently_loaded`
   - Verify unload calculation is correct
   - Test state persistence

2. **Test File-Specific Context:**
   - Verify HIGH priority file-specific contexts are loaded
   - Verify MEDIUM priority contexts are suggested only
   - Test various file types

3. **Test Dependency Expansion:**
   - Verify dependencies are loaded recursively
   - Verify circular dependencies are handled
   - Verify dependency priorities are correct

4. **Test Prediction Engine:**
   - Verify static patterns are used
   - Verify dynamic stats are integrated
   - Verify message analysis works

### Integration Tests

1. **End-to-End Context Flow:**
   - Edit code → verify context loaded
   - Predict next task → verify preload
   - Switch task → verify unload
   - Verify state persistence

2. **Workflow Transitions:**
   - `edit_code → run_tests` workflow
   - `fix_bug → run_tests` workflow
   - Verify predictions match actual transitions

### Regression Tests

1. **Backward Compatibility:**
   - Verify existing workflows still work
   - Verify YAML schema is backward compatible
   - Verify state migration works

---

## Migration Plan

### Step 1: Backup Current State

```bash
# Backup current implementation
cp -r .cursor/context_manager .cursor/context_manager.backup
cp .cursor/context_manager/context_state.json .cursor/context_manager/context_state.json.backup
```

### Step 2: Implement Phase 1 (Critical Fixes)

- Fix unloading logic
- Enable HIGH priority file-specific context
- Test thoroughly

### Step 3: Implement Phase 2 (Dependency Resolution)

- Add dependency metadata
- Implement dependency expansion
- Test thoroughly

### Step 4: Implement Phase 3 (Enhanced Prediction)

- Integrate workflow transition stats
- Enhance prediction engine
- Test thoroughly

### Step 5: Implement Phase 4 (Architectural Improvements)

- Atomic state persistence
- Improved file count handling
- Test thoroughly

### Step 6: Validation

- Run full test suite
- Verify no regressions
- Monitor system behavior

---

## Risk Assessment

### High Risk Areas

1. **Dependency Expansion:**
   - Risk: Circular dependencies causing infinite loops
   - Mitigation: Add cycle detection, limit recursion depth

2. **State Migration:**
   - Risk: Breaking existing state files
   - Mitigation: Backward compatibility, migration script

3. **YAML Schema Changes:**
   - Risk: Breaking existing profiles
   - Mitigation: Make dependencies optional, provide defaults

### Low Risk Areas

1. **Unloading Logic Fix:**
   - Isolated change, low risk
   - Easy to test and verify

2. **File-Specific Context:**
   - Additive change, low risk
   - Easy to rollback if issues

---

## Success Criteria

### Phase 1 (Critical Fixes)

- ✅ Preloaded files are unloaded when no longer needed
- ✅ HIGH priority file-specific contexts are auto-loaded
- ✅ No memory leaks from accumulating preloaded contexts

### Phase 2 (Dependency Resolution)

- ✅ Dependencies are loaded automatically
- ✅ No circular dependency issues
- ✅ Rule interpretation is consistent

### Phase 3 (Enhanced Prediction)

- ✅ Prediction accuracy improves (target: >60%)
- ✅ Pre-loading triggers more frequently
- ✅ False positives reduced

### Phase 4 (Architectural Improvements)

- ✅ State persistence is atomic
- ✅ File count handling is smarter
- ✅ System is more robust

---

## Timeline

- **Phase 1:** 2-3 hours (IMMEDIATE)
- **Phase 2:** 3-4 hours (HIGH PRIORITY)
- **Phase 3:** 4-5 hours (MEDIUM PRIORITY)
- **Phase 4:** 2-3 hours (LOW PRIORITY)

**Total:** 11-15 hours

---

## Next Steps

1. **Review this plan** with team
2. **Prioritize phases** based on business needs
3. **Assign implementation** tasks
4. **Set up testing** environment
5. **Begin Phase 1** implementation

---

**Last Updated:** 2025-12-01  
**Status:** Ready for Implementation  
**Owner:** Engineering Team







