# AGENT_STATUS.md Optimization Plan

**Created:** 2025-11-30  
**Status:** Phase 1 & Phase 3 Implemented  
**Priority:** High  
**Impact:** Reduces context usage from 61% to <5%

---

## Current State Analysis

### File Statistics
- **Size:** 1,089.69 KB (1,115,840 bytes)
- **Lines:** 27,289 lines
- **Context Usage:** 61.03% of total context (~278,960 tokens)
- **Violations:** 959 warnings (mostly repetitive error handling issues)

### Current Structure
1. **Summary Section** - Counts and status
2. **Blocking Instructions** - Current session + historical violations
3. **Active Violations** - ALL violations listed (current + historical)
4. **Auto-Fixes Applied** - Summary of fixes
5. **Compliance Checks** - Checklist
6. **Session Information** - Metadata

### Problems Identified
1. **Historical violations included** - All historical violations are listed in full
2. **Repetitive warnings** - 959 warnings, mostly same pattern (error handling in Python scripts)
3. **No pagination** - All violations dumped in one file
4. **Bible rules always loaded** - Python/TypeScript Bible rules loaded even when not working with those languages

---

## Optimization Goals

1. **Reduce file size by 95%+** (from 1,089 KB to <50 KB)
2. **Keep only current session violations** in main file
3. **Summarize historical violations** (counts only, not full list)
4. **Implement pagination** for warnings (if needed)
5. **Make Bible rules conditional** (only load when working with that language)

---

## Optimization Strategy

### Phase 1: Truncate Historical Violations (Immediate)

**Changes to `auto-enforcer.py`:**

1. **Modify `generate_agent_status()` method:**
   - Remove full listing of historical violations from "Active Violations" section
   - Keep only summary counts for historical violations
   - Show only current session violations in detail
   - Add link to `VIOLATIONS.md` for full historical list

2. **New Structure:**
   ```markdown
   ## Active Violations
   
   ### 🔴 BLOCKED - Hard Stops
   - **Current Session:** [list only current_session violations]
   - **Historical:** [count only, link to VIOLATIONS.md]
   
   ### 🟡 WARNINGS
   - **Current Session:** [list only current_session warnings, max 50]
   - **Historical:** [count only, link to VIOLATIONS.md]
   - **Summary by Rule:** [grouped counts for historical warnings]
   ```

3. **Warning Aggregation:**
   - Group warnings by `rule_ref` and `file_path`
   - Show counts instead of individual violations
   - Example: `**06-error-resilience.mdc**: 847 warnings in Python scripts (see VIOLATIONS.md)`

**Expected Impact:**
- Reduce from 27,289 lines to ~500 lines
- Reduce from 1,089 KB to ~20 KB
- Context usage: 61% → ~1%

---

### Phase 2: Implement Pagination for Warnings (If Needed)

**If warnings still exceed 50 items:**

1. **Add pagination metadata:**
   ```markdown
   ### 🟡 WARNINGS (Page 1 of 3)
   
   Showing violations 1-50 of 150 current session warnings.
   [View all in VIOLATIONS.md]
   ```

2. **Generate separate warning pages:**
   - `AGENT_STATUS_WARNINGS_P1.md` (if needed)
   - Link from main status file

**Decision Point:** Only implement if current session warnings exceed 50 items.

---

### Phase 3: Conditional Bible Rule Loading (High Impact)

**Problem:** Bible rules (Python/TypeScript) are always loaded, taking up 23% of context even when not needed.

**Solution:** Make Bible rules conditional based on file paths being worked on.

#### 3.1: Modify Rule File Metadata

**Change `python_bible.mdc`:**
```yaml
---
description: "Python Bible rules extracted from SSM"
alwaysApply: false  # Changed from true
applyWhen:
  - "**/*.py"  # Python files
  - "**/*.pyi"  # Python stub files
  - "**/requirements*.txt"  # Python dependencies
  - "**/setup.py"  # Python setup
  - "**/pyproject.toml"  # Python project config
  - "**/Pipfile"  # Python pipenv
  - "**/poetry.lock"  # Python poetry
  - ".cursor/scripts/*.py"  # Python scripts
sources:
  - bible-ssm
severityDefault: warning
version: 1.0.0
---
```

**Change `typescript_bible.mdc`:**
```yaml
---
description: "Typescript Bible rules extracted from SSM"
alwaysApply: false  # Changed from true
applyWhen:
  - "**/*.ts"  # TypeScript files
  - "**/*.tsx"  # TypeScript React files
  - "**/tsconfig.json"  # TypeScript config
  - "**/tsconfig.*.json"  # TypeScript config variants
sources:
  - bible-ssm
severityDefault: warning
version: 1.0.0
---
```

#### 3.2: Update Routing Logic in 00-master.mdc

**Add conditional loading section:**
```markdown
## CONDITIONAL RULE LOADING

### Bible Rules (Language-Specific)

Bible rules are only loaded when working with files matching their language:

- **Python Bible** (`python_bible.mdc`):
  - Loaded when: `**/*.py`, `**/*.pyi`, `**/requirements*.txt`, `**/setup.py`, `**/pyproject.toml`
  - NOT loaded for: TypeScript, JavaScript, or other languages
  
- **TypeScript Bible** (`typescript_bible.mdc`):
  - Loaded when: `**/*.ts`, `**/*.tsx`, `**/tsconfig.json`
  - NOT loaded for: Python, JavaScript, or other languages

**Detection Logic:**
1. Check file paths in current context (open files, changed files, PR files)
2. If ANY file matches Bible rule patterns → load that Bible rule
3. If NO files match → skip Bible rule loading
4. Default: Load both if uncertain (safety fallback)
```

#### 3.3: Update Enforcement Pipeline

**Modify Step 0 (Memory Bank Loading) to detect language:**
```markdown
### Step 0.5: Language Detection (NEW)

- [ ] **MUST** detect primary language from active files:
  - Check open files in IDE
  - Check files in current PR/changes
  - Check activeContext.md for current task files
- [ ] **MUST** load Bible rules only for detected languages:
  - Python files detected → load `python_bible.mdc`
  - TypeScript files detected → load `typescript_bible.mdc`
  - No matching files → skip Bible rules
```

**Expected Impact:**
- Reduce context by ~23% when not working with Python/TypeScript
- Faster context loading
- More relevant rules in context

---

## Implementation Plan

### Step 1: Modify `auto-enforcer.py` (Phase 1)

**File:** `.cursor/scripts/auto-enforcer.py`  
**Method:** `generate_agent_status()`  
**Lines:** 1369-1556

**Changes:**

1. **Separate violations by scope:**
   ```python
   # Current session violations (full list)
   current_session_blocked = [v for v in blocked_violations if v.session_scope == "current_session"]
   current_session_warnings = [v for v in warning_violations if v.session_scope == "current_session"]
   
   # Historical violations (summary only)
   historical_blocked = [v for v in blocked_violations if v.session_scope != "current_session"]
   historical_warnings = [v for v in warning_violations if v.session_scope != "current_session"]
   ```

2. **Aggregate historical warnings by rule:**
   ```python
   from collections import Counter
   
   historical_warning_counts = Counter()
   for v in historical_warnings:
       key = f"{v.rule_ref}"
       historical_warning_counts[key] += 1
   ```

3. **Update "Active Violations" section:**
   ```python
   # Only show current session violations in detail
   if current_session_blocked:
       content += f"### 🔴 BLOCKED - Hard Stops ({len(current_session_blocked)} current session)\n\n"
       for violation in current_session_blocked:
           # ... full violation details ...
   
   # Historical blocked: summary only
   if historical_blocked:
       content += f"### 📋 Historical Blocked ({len(historical_blocked)} total)\n\n"
       content += f"**See `.cursor/enforcement/VIOLATIONS.md` for complete list.**\n\n"
       # Show first 5 as examples
       for violation in historical_blocked[:5]:
           content += f"- **{violation.rule_ref}**: {violation.message} (`{violation.file_path}`)\n"
       if len(historical_blocked) > 5:
           content += f"\n*... and {len(historical_blocked) - 5} more. See VIOLATIONS.md.*\n\n"
   
   # Current session warnings: full list (max 50)
   if current_session_warnings:
       content += f"### 🟡 WARNINGS - Current Session ({len(current_session_warnings)} total)\n\n"
       for violation in current_session_warnings[:50]:  # Limit to 50
           # ... full violation details ...
       if len(current_session_warnings) > 50:
           content += f"\n*... and {len(current_session_warnings) - 50} more. See VIOLATIONS.md.*\n\n"
   
   # Historical warnings: aggregated summary
   if historical_warnings:
       content += f"### 📋 Historical Warnings ({len(historical_warnings)} total)\n\n"
       content += "**Summary by Rule:**\n\n"
       for rule_ref, count in historical_warning_counts.most_common(10):
           content += f"- **{rule_ref}**: {count} warnings\n"
       if len(historical_warning_counts) > 10:
           content += f"\n*... and {len(historical_warning_counts) - 10} more rule types. See VIOLATIONS.md for complete list.*\n\n"
       content += "\n**See `.cursor/enforcement/VIOLATIONS.md` for complete historical violations list.**\n\n"
   ```

**Testing:**
- Run `python .cursor/scripts/auto-enforcer.py --check-all`
- Verify AGENT_STATUS.md is <50 KB
- Verify current session violations are shown in full
- Verify historical violations are summarized

---

### Step 2: Update Bible Rule Metadata (Phase 3)

**Files:**
- `.cursor/rules/python_bible.mdc` (line 3)
- `.cursor/rules/typescript_bible.mdc` (line 3)

**Changes:**
1. Change `alwaysApply: true` → `alwaysApply: false`
2. Add `applyWhen:` section with file patterns
3. Update version number

**Testing:**
- Verify Bible rules are NOT loaded when working with non-matching files
- Verify Bible rules ARE loaded when working with matching files
- Test with Python file open → Python Bible should load
- Test with TypeScript file open → TypeScript Bible should load
- Test with no matching files → Neither Bible should load

---

### Step 3: Update Routing Documentation (Phase 3)

**File:** `.cursor/rules/00-master.mdc`  
**Section:** "ROUTING & MODE SELECTION"

**Changes:**
1. Add "CONDITIONAL RULE LOADING" section (see Phase 3.2 above)
2. Update routing examples to show conditional Bible loading
3. Add language detection logic to Step 0

**Testing:**
- Verify documentation matches implementation
- Verify routing examples are accurate

---

## Expected Results

### Before Optimization
- **AGENT_STATUS.md:** 1,089 KB (61% of context)
- **Total Context:** ~457,107 tokens
- **Bible Rules:** Always loaded (23% of context)

### After Optimization
- **AGENT_STATUS.md:** <50 KB (<1% of context)
- **Total Context:** ~180,000 tokens (60% reduction)
- **Bible Rules:** Conditionally loaded (0-23% depending on files)

### Context Savings
- **Phase 1 (Truncate Historical):** ~260,000 tokens saved (57% reduction)
- **Phase 3 (Conditional Bible Rules):** ~105,000 tokens saved when not using Python/TypeScript (23% reduction)
- **Total Potential Savings:** Up to 365,000 tokens (80% reduction in worst case)

---

## Risk Assessment

### Low Risk
- **Phase 1:** Truncating historical violations (they're still in VIOLATIONS.md)
- **Phase 2:** Pagination (only if needed)

### Medium Risk
- **Phase 3:** Conditional Bible rule loading
  - **Risk:** Bible rules might not load when needed
  - **Mitigation:** Default to loading both if uncertain (safety fallback)
  - **Mitigation:** Clear documentation of when rules load
  - **Mitigation:** Test thoroughly with different file types

---

## Rollback Plan

If optimization causes issues:

1. **Phase 1 Rollback:**
   - Revert `auto-enforcer.py` changes
   - Restore full violation listing

2. **Phase 3 Rollback:**
   - Change `alwaysApply: false` → `alwaysApply: true` in Bible rule files
   - Remove `applyWhen:` sections

---

## Success Criteria

1. ✅ AGENT_STATUS.md < 50 KB
2. ✅ Current session violations shown in full
3. ✅ Historical violations summarized (counts only)
4. ✅ Bible rules load conditionally based on file paths
5. ✅ No functionality lost (all violations still accessible in VIOLATIONS.md)
6. ✅ Context usage reduced by 60%+

---

## Implementation Order

1. **Phase 1** (Immediate) - Truncate historical violations
2. **Phase 3** (High Impact) - Conditional Bible rule loading
3. **Phase 2** (If Needed) - Pagination for warnings

---

## Notes

- Historical violations are preserved in `VIOLATIONS.md` (complete list)
- Current session violations are always shown in full (actionable)
- Bible rules can be manually loaded if needed (explicit request)
- Optimization is backward compatible (no breaking changes)

---

**Last Updated:** 2025-11-30  
**Status:** Ready for Implementation  
**Next Step:** Implement Phase 1 (modify auto-enforcer.py)

