# Two-Brain Model: Conflicting Files Found

**Date:** 2025-12-02  
**Status:** Conflicts Identified

---

## Conflicts Found

### 1. Context Manager Files (High Priority)

**`.cursor/context_manager/recommendations.md`**
- ❌ References moved rules in old locations:
  - `.cursor/rules/python_bible.mdc` → Should be `.cursor/enforcement/rules/python_bible.mdc`
  - `.cursor/rules/02-core.mdc` → Should be `.cursor/enforcement/rules/02-core.mdc`
  - `.cursor/rules/08-backend.mdc` → Should be `.cursor/enforcement/rules/08-backend.mdc`
  - `.cursor/rules/07-observability.mdc` → Should be `.cursor/enforcement/rules/07-observability.mdc`
- ❌ References deleted context folder:
  - `.cursor/rules/context-*.mdc` (folder deleted)
  - `.cursor/rules/context_enforcement.mdc` (should be in enforcement/rules/)
- ❌ Contains Step 0.5/4.5 context loading (not needed in Two-Brain Model)

**`.cursor/context_manager/context_state.json`**
- ❌ References moved rules:
  - `.cursor/rules/python_bible.mdc` → Should be `.cursor/enforcement/rules/python_bible.mdc`
  - `.cursor/rules/02-core.mdc` → Should be `.cursor/enforcement/rules/02-core.mdc`

### 2. Auto-Enforcer Code (Medium Priority)

**`.cursor/scripts/auto-enforcer.py`**
- ❌ Still generates `context_enforcement.mdc` in `.cursor/rules/` (line 4407)
- ❌ References `.cursor/rules/context-*.mdc` in documentation (lines 3910, 4013, etc.)
- ❌ References `.cursor/rules/context_enforcement.mdc` (should be in enforcement/rules/)

### 3. Legacy Files (Low Priority)

**`.cursor/rules/agent-instructions.mdc`**
- ⚠️ May contain references to old rule locations
- ⚠️ May contain Step 0.5/4.5 context loading instructions
- ⚠️ May be legacy file that should be removed

**`.cursor/rules/context/context-schema_prisma.mdc`**
- ⚠️ Still exists (user deleted folder, but file may remain)
- ⚠️ References moved rules

---

## Recommended Actions

### Immediate (High Priority)

1. **Update or disable context manager references:**
   - Update `.cursor/context_manager/recommendations.md` to use new paths
   - Update `.cursor/context_manager/context_state.json` to use new paths
   - OR: Disable context manager for Two-Brain Model (recommended)

2. **Update auto-enforcer:**
   - Change `context_enforcement.mdc` generation to `.cursor/enforcement/rules/`
   - OR: Disable context rule file generation (recommended for Two-Brain)

### Optional (Low Priority)

3. **Clean up legacy files:**
   - Review `agent-instructions.mdc` for conflicts
   - Remove if it's legacy and conflicts with Two-Brain Model

4. **Verify context folder deletion:**
   - Ensure `.cursor/rules/context/` is fully deleted
   - Remove any remaining files

---

## Two-Brain Model Philosophy

**In Two-Brain Model:**
- Brain A (Enforcer) manages context strategy internally
- Brain B (LLM) doesn't need context management files
- No Step 0.5/4.5 context loading needed
- LLM just implements code

**Recommendation:**
- Disable context rule file generation
- Update context manager to use new paths (if still needed)
- Or disable context manager entirely for Two-Brain Model

---

**Status:** Conflicts Identified ✅  
**Action Required:** Update or disable conflicting references




