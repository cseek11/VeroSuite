# Hybrid Context System - Investigation Report

**Date:** 2025-12-02  
**Purpose:** Investigate how the hybrid context management system is functioning, specifically regarding "basics to load first"

---

## Current System Behavior

### Issue Identified

**Problem:** Core context rule files are only created when files appear in `active_context` or `preloaded_context` lists. This means "basics" (like `schema.prisma`) are not automatically loaded if they're not in the context recommendations.

### Current Flow

1. **Context Preloader** (`preloader.py`) determines what context to load based on:
   - Task type (edit_code, run_tests, etc.)
   - Language (python, typescript)
   - File types being modified
   - **MINIMAL loading mode**: Only loads PRIMARY/required contexts

2. **Context Categorizer** (`context_categorizer.py`) categorizes files from context lists:
   - Input: `active_context + preloaded_context` (from preloader)
   - Output: `core_files` (files matching CORE_PATTERNS) and `dynamic_files`
   - **Issue**: Only categorizes files that are ALREADY in context lists

3. **Rule File Manager** (`rule_file_manager.py`) creates rule files:
   - Input: `core_files` (from categorizer)
   - **Issue**: Only creates rule files for files in `core_files` list
   - If a core file (like `schema.prisma`) isn't in context lists, no rule file is created

### Current CORE_PATTERNS

```python
CORE_PATTERNS = [
    'libs/common/prisma/schema.prisma',
    'docs/ARCHITECTURE.md',
    '.env.example',
]
```

### Current State

- **No context-*.mdc files exist** (verified via glob search)
- **Recommendations.md shows**: `schema.prisma` is identified as core but marked as "will be auto-loaded" (rule file not created yet)
- **System only creates rule files** when files appear in context lists AND match CORE_PATTERNS

---

## Intended Behavior (Based on Plan)

### "Basics to Load First" Requirement

The plan states that **core context files should be automatically loaded at session start**, regardless of task or context recommendations. This means:

1. **Always create rule files** for ALL files matching CORE_PATTERNS
2. **Don't wait** for files to appear in context lists
3. **Ensure basics are always available** at session start

### Expected Behavior

- `schema.prisma` → Always has `context-schema_prisma.mdc` rule file
- `ARCHITECTURE.md` → Always has `context-architecture_md.mdc` rule file  
- `.env.example` → Always has `context-env_example.mdc` rule file

These should be created **on first enforcer run** or **whenever the source files exist**, not conditional on context lists.

---

## Root Cause Analysis

### Problem Location

**File:** `.cursor/scripts/auto-enforcer.py` → `_update_context_recommendations()`

**Current Logic (Lines 3353-3367):**
```python
# Categorize files (core vs dynamic)
categorizer = ContextCategorizer()
core_files, dynamic_files = categorizer.categorize(
    active_context + preloaded_context,  # ← Only categorizes files in context lists
    context_to_unload
)

# Sync rule files (create/delete/update)
rule_file_manager = RuleFileManager()
rule_changes = rule_file_manager.sync_context_files(
    core_files=core_files,  # ← Only creates rule files for files in core_files list
    context_to_remove=context_to_unload
)
```

**Issue:** 
- `categorize()` only processes files that are in `active_context + preloaded_context`
- If `schema.prisma` is not in those lists, it won't be categorized as core
- Therefore, no rule file is created for it

### Why This Happens

1. **Minimal Loading Mode**: Preloader only loads PRIMARY/required contexts
2. **schema.prisma** is in `file_specific.database` with priority "MEDIUM" (not PRIMARY)
3. **Not in context lists** unless database files are being edited
4. **No rule file created** because it's not in the lists to categorize

---

## Solution Required

### Fix: Always Create Rule Files for CORE_PATTERNS

The system should:

1. **Always check CORE_PATTERNS** regardless of context lists
2. **Create rule files** for all files matching CORE_PATTERNS that exist
3. **Update rule files** when source files change (via file watcher)
4. **Only delete rule files** when explicitly in `context_to_remove` AND not in CORE_PATTERNS

### Implementation Change Needed

**File:** `.cursor/scripts/auto-enforcer.py` → `_update_context_recommendations()`

**Change:**
- Before categorizing, get ALL files matching CORE_PATTERNS (check if they exist)
- Always include these in `core_files` list
- Then categorize remaining files from context lists

**Or:**

**File:** `.cursor/context_manager/rule_file_manager.py` → `sync_context_files()`

**Change:**
- Add method `sync_always_core_files()` that creates rule files for ALL CORE_PATTERNS
- Call this BEFORE or IN ADDITION TO `sync_context_files()`

---

## Current System Status

### What's Working

✅ **File Categorization**: Correctly identifies core vs dynamic files  
✅ **Rule File Creation**: Creates rule files when core files are in context lists  
✅ **File Watcher**: Monitors source files for changes  
✅ **Auto-Save Trigger**: Triggers Cursor to detect changes  
✅ **Session Restart Alerts**: Generated when core context changes

### What's Not Working

❌ **Basics Not Always Loaded**: Core context files only get rule files if they're in context lists  
❌ **Conditional Creation**: Rule files are created conditionally, not always  
❌ **Missing Rule Files**: No `context-*.mdc` files exist yet (because core files aren't in context lists)

---

## Recommended Fix

### Option 1: Always Sync Core Patterns (Recommended)

Modify `_update_context_recommendations()` to always create rule files for CORE_PATTERNS:

```python
# Always ensure core pattern files have rule files (regardless of context lists)
categorizer = ContextCategorizer()
always_core_files = []
for pattern in categorizer.CORE_PATTERNS:
    source_path = self.project_root / pattern
    if source_path.exists():
        always_core_files.append(pattern)

# Merge with categorized core files
core_files_from_context, dynamic_files = categorizer.categorize(
    active_context + preloaded_context,
    context_to_unload
)

# Always include core pattern files
all_core_files = list(set(always_core_files + core_files_from_context))
```

### Option 2: Separate Always-Core Sync

Add method to RuleFileManager to always sync CORE_PATTERNS:

```python
def sync_always_core_files(self, categorizer: ContextCategorizer) -> Dict:
    """Always create rule files for CORE_PATTERNS, regardless of context lists."""
    always_core_files = []
    for pattern in categorizer.CORE_PATTERNS:
        source_path = self.project_root / pattern
        if source_path.exists():
            always_core_files.append(pattern)
    
    return self.sync_context_files(
        core_files=always_core_files,
        context_to_remove=[]
    )
```

---

## Questions for Clarification

1. **Should ALL CORE_PATTERNS always have rule files?** Or only when they're actually needed?
2. **What defines "basics"?** Just `schema.prisma`? Or all 3 CORE_PATTERNS?
3. **Should rule files be created on first enforcer run?** Or only when source files are detected in context?
4. **Should we create rule files proactively** (check if source files exist and create rule files) or reactively (only when files appear in context lists)?

---

## Next Steps

1. **Clarify requirements** with user about "basics to load first"
2. **Implement fix** based on clarification
3. **Test** that rule files are created for core patterns
4. **Verify** that Cursor loads them at session start

---

**Last Updated:** 2025-12-02  
**Status:** Investigation Complete - Awaiting Clarification







