# Rule Compatibility Investigation

**Date:** 2025-12-02  
**Status:** 🔴 Issues Found  
**Priority:** High

---

## Problem Summary

The new session-aware prediction system requires agents to **check if a task is assigned** before loading context. However, some auto-generated rule files still contain the OLD instructions that don't check for task assignment.

---

## Issues Found

### ❌ Issue 1: Auto-Generated `context_enforcement.mdc` Missing Task Assignment Check

**Location:** `.cursor/scripts/auto-enforcer.py` - `_generate_dynamic_rule_file()`

**Problem:**
The generated file says:
```
3. **MUST** load PRIMARY context files using `@` mentions:
   - Load all files listed in "Dynamic Context (Load These)" section
```

**Missing:** Task assignment check before loading context.

**Expected (from `01-enforcement.mdc` Step 0.5.2):**
```
- [ ] **MUST** check if recommendations.md shows "NO TASK ASSIGNED YET"
- [ ] **IF NO TASK ASSIGNED:**
  - [ ] **DO NOT** load task-specific context
  - [ ] **SKIP** context loading until task is assigned
- [ ] **IF TASK IS ASSIGNED:**
  - [ ] **MUST** load ALL files listed in "Active Context (Currently Loaded)" section
```

**Impact:** Agent may load context even when no task is assigned, wasting tokens.

---

### ❌ Issue 2: Auto-Generated `context-schema_prisma.mdc` Missing Task Assignment Check

**Location:** `.cursor/rules/context/context-schema_prisma.mdc`

**Problem:**
This file (auto-generated or manually created) contains:
```
3. **MUST** load PRIMARY context files using `@` mentions:
   - Load all files listed in "Active Context (Currently Loaded)" section
```

**Missing:** Task assignment check.

**Impact:** Same as Issue 1 - may load context prematurely.

---

### ✅ Issue 3: Main Rule File (`01-enforcement.mdc`) - COMPATIBLE

**Location:** `.cursor/rules/01-enforcement.mdc` - Step 0.5.2

**Status:** ✅ **COMPATIBLE**

**Evidence:**
- Has task assignment check (lines 119-130)
- Conditional logic: "IF NO TASK ASSIGNED" vs "IF TASK IS ASSIGNED"
- Matches new system requirements

---

### ✅ Issue 4: Master Rule File (`00-master.mdc`) - COMPATIBLE

**Location:** `.cursor/rules/00-master.mdc`

**Status:** ✅ **COMPATIBLE**

**Evidence:**
- References `01-enforcement.mdc` for enforcement pipeline
- No direct context loading instructions (delegates to `01-enforcement.mdc`)
- Compatible with new system

---

## Compatibility Matrix

| Rule File | Status | Task Assignment Check | Notes |
|-----------|--------|----------------------|-------|
| `01-enforcement.mdc` | ✅ Compatible | ✅ Yes | Main enforcement pipeline - correctly updated |
| `00-master.mdc` | ✅ Compatible | N/A | Delegates to `01-enforcement.mdc` |
| `context_enforcement.mdc` | ❌ **Incompatible** | ❌ No | Auto-generated - needs update |
| `context-schema_prisma.mdc` | ❌ **Incompatible** | ❌ No | Auto-generated/manual - needs update |

---

## Root Cause

The `_generate_dynamic_rule_file()` method in `auto-enforcer.py` generates `context_enforcement.mdc` with the OLD instructions that don't check for task assignment. This conflicts with the updated Step 0.5.2 in `01-enforcement.mdc`.

**Why this matters:**
- `01-enforcement.mdc` says: "Check if task assigned, then load context"
- `context_enforcement.mdc` says: "MUST load context" (no check)
- Agent may follow the more permissive rule (load always) instead of the conditional one

---

## Fix Required

### Fix 1: Update `_generate_dynamic_rule_file()` in `auto-enforcer.py`

**Change:** Add task assignment check to generated instructions.

**Before:**
```python
3. **MUST** load PRIMARY context files using `@` mentions:
   - Load all files listed in "Dynamic Context (Load These)" section
```

**After:**
```python
3. **MUST** check if task is assigned (check recommendations.md for "NO TASK ASSIGNED YET")
4. **IF NO TASK ASSIGNED:**
   - **DO NOT** load task-specific context (Python Bible, etc.)
   - **DO NOT** pre-load predicted context
   - **SKIP** context loading until task is assigned
   - **LOG:** "No task assigned - skipping context loading"
5. **IF TASK IS ASSIGNED:**
   - **MUST** load PRIMARY context files using `@` mentions:
     - Load all files listed in "Dynamic Context (Load These)" section
     - Use format: `@filename` or `@path/to/file`
```

---

## Testing Plan

1. **Test Session Start:**
   - Run "Session Start" command
   - Check if `context_enforcement.mdc` is generated with task assignment check
   - Verify agent skips context loading

2. **Test Task Assignment:**
   - Assign a task (e.g., "investigate xyz.py")
   - Check if `context_enforcement.mdc` shows task assigned
   - Verify agent loads context

3. **Test Compatibility:**
   - Compare `01-enforcement.mdc` Step 0.5.2 with generated `context_enforcement.mdc`
   - Verify instructions are consistent

---

## Priority

**HIGH** - This affects every session start and could waste significant context tokens.

---

## Next Steps

1. ✅ Update `_generate_dynamic_rule_file()` to include task assignment check
2. ✅ Update `context-schema_prisma.mdc` template (if it's a template)
3. ✅ Test with "Session Start" command
4. ✅ Verify compatibility across all rule files

---

**Last Updated:** 2025-12-02







