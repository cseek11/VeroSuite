# Best Practices: Getting AI to Follow Rules Consistently

**Last Updated:** 2025-12-05  
**Purpose:** Guide for ensuring AI assistant consistently follows project rules

---

## The Problem

AI assistants can sometimes:
- Skip mandatory steps
- Ignore file path rules
- Create duplicate components
- Miss security requirements
- Use outdated patterns

---

## The Solution: Multi-Layer Enforcement

### Layer 1: Rule Structure (✅ DONE)

**What We've Implemented:**

1. **Enforcement Rule File** (`.cursor/rules/enforcement.md`)
   - Mandatory pre-implementation checklist
   - Hard stops for violations
   - Verification steps
   - Loaded FIRST in rule order

2. **Quick Reference** (`.cursor/rules/QUICK_REFERENCE.md`)
   - Most common rules at a glance
   - Quick lookup for violations
   - Easy to reference during development

3. **Explicit "MUST" Language**
   - Changed "should" to "MUST"
   - Added "STOP" conditions
   - Clear violation reporting

4. **Rule Ordering**
   - Enforcement rules load first
   - Critical rules prioritized
   - Sequential loading with precedence

---

## Best Practices for Rule Consistency

### 1. Use Explicit "MUST" Language

**❌ Weak:**
```
You should search for existing components.
```

**✅ Strong:**
```
MUST search for existing components before creating new ones.
STOP if you haven't completed the search.
```

### 2. Add Hard Stops

**✅ Example:**
```
STOP if:
- File path is wrong
- Component already exists
- Database query missing tenantId
```

### 3. Create Mandatory Checklists

**✅ Example:**
```
BEFORE writing code:
- [ ] MUST complete search phase
- [ ] MUST verify file path
- [ ] MUST check rule compliance
```

### 4. Use Parallel Tool Calls

**✅ Example:**
```
Execute these searches in parallel:
1. codebase_search(...)
2. glob_file_search(...)
3. grep -r ...
4. read_file(...)
```

### 5. Add Verification Steps

**✅ Example:**
```
After implementation:
- [ ] Verify file path correct
- [ ] Verify imports correct
- [ ] Verify security maintained
```

---

## How to Use These Rules

### For Developers

1. **Reference Quick Reference First**
   - Check `.cursor/rules/QUICK_REFERENCE.md` before asking AI
   - Know what rules exist

2. **Remind AI of Rules**
   - If AI skips a step, say: "Please follow the enforcement checklist"
   - Reference specific rule: "Check .cursor/rules/enforcement.md step 1"

3. **Verify AI Compliance**
   - Check if AI completed searches
   - Verify file paths are correct
   - Confirm security checks done

### For AI Assistant

1. **Always Read Enforcement Rules First**
   - `.cursor/rules/enforcement.md` is loaded first
   - Complete mandatory checklist before coding

2. **Use Stop Conditions**
   - If rule violation detected, STOP
   - Report violation clearly
   - Fix before proceeding

3. **Verify at Each Step**
   - Check compliance after each major step
   - Don't wait until end
   - Fix violations immediately

---

## Common Violations & How to Prevent

### Violation 1: Skipping Searches

**Problem:** AI creates code without searching first

**Prevention:**
- ✅ Mandatory checklist in enforcement.md
- ✅ "STOP if searches not completed"
- ✅ Explicit search commands provided

**How to Catch:**
- Ask: "Did you search for existing components?"
- Check: Did AI show search results?

### Violation 2: Wrong File Paths

**Problem:** AI uses old paths (`backend/src/`)

**Prevention:**
- ✅ Monorepo rules loaded early
- ✅ Hard stop for wrong paths
- ✅ Quick reference shows correct paths

**How to Catch:**
- Check: File path in code
- Verify: Matches monorepo structure

### Violation 3: Missing Tenant Isolation

**Problem:** Database query without `tenantId`

**Prevention:**
- ✅ Security rules loaded early
- ✅ Hard stop for security violations
- ✅ Verification checklist includes security

**How to Catch:**
- Check: All queries include `tenantId`
- Verify: RLS policies enforced

### Violation 4: Component Duplication

**Problem:** AI creates component that exists

**Prevention:**
- ✅ Mandatory search before creation
- ✅ Hard stop if component exists
- ✅ Component library catalog reference

**How to Catch:**
- Check: Did AI search `ui/` directory?
- Verify: Component doesn't already exist

---

## Enforcement Mechanisms

### 1. Pre-Implementation Gate

**What:** Checklist that must be completed before coding

**How It Works:**
- Enforcement rules loaded first
- Mandatory checklist presented
- AI must complete before proceeding

**Example:**
```
BEFORE writing code:
- [ ] MUST search for existing components
- [ ] MUST verify file path
- [ ] MUST check rule compliance
```

### 2. Hard Stops

**What:** Conditions that force AI to stop

**How It Works:**
- Clear violation conditions defined
- AI must stop if violation detected
- Must fix before proceeding

**Example:**
```
STOP if:
- File path is wrong
- Component already exists
```

### 3. Verification Loops

**What:** Checks after each major step

**How It Works:**
- Verification checklist after implementation
- AI must verify compliance
- Fix violations before completion

**Example:**
```
After implementation:
- [ ] Verify file path correct
- [ ] Verify imports correct
```

### 4. Explicit Language

**What:** Using "MUST" instead of "should"

**How It Works:**
- Stronger language = better compliance
- "MUST" = mandatory
- "STOP" = hard requirement

**Example:**
```
MUST search before creating
STOP if search not completed
```

---

## Testing Rule Compliance

### Manual Testing

1. **Ask AI to implement a feature**
2. **Check if it:**
   - Completed searches first
   - Used correct file paths
   - Followed established patterns
   - Verified security

3. **If violations found:**
   - Point to specific rule
   - Ask AI to fix
   - Verify fix

### Automated Testing (Future)

Could create:
- Rule compliance checker script
- Pre-commit hook for rule violations
- CI check for rule compliance

---

## Tips for Maximum Compliance

### 1. Reference Rules Explicitly

**When asking AI:**
```
"Please implement [feature] following the rules in 
.cursor/rules/enforcement.md"
```

### 2. Remind AI of Specific Rules

**If AI skips step:**
```
"Please complete step 1 of the enforcement checklist:
search for existing components"
```

### 3. Verify Before Accepting

**Before accepting AI's code:**
- Check file paths
- Verify searches were done
- Confirm security checks

### 4. Use Rule References

**In your prompts:**
```
"Follow .cursor/rules/monorepo.md for file paths"
"Check .cursor/rules/security.md for tenant isolation"
```

---

## Rule Priority Order

Rules are loaded in this order (higher = more important):

1. **enforcement.md** - Mandatory checklist (READ FIRST)
2. **core.md** - Core philosophy
3. **security.md** - Security rules
4. **monorepo.md** - File structure
5. **ai-behavior.md** - AI behavior
6. **forms.md** - Form patterns
7. **frontend.md** - Frontend rules
8. **backend.md** - Backend rules
9. **veroai.md** - VeroAI patterns
10. **docs.md** - Documentation
11. **styling.md** - Styling
12. **verification.md** - Testing

**Earlier rules take precedence.**

---

## Quick Checklist for AI Compliance

**Before accepting AI's work, verify:**

- [ ] AI completed mandatory searches
- [ ] AI showed search results
- [ ] File paths are correct (check monorepo structure)
- [ ] No duplicate components created
- [ ] Security checks done (tenantId in queries)
- [ ] Following established patterns
- [ ] Documentation updated with current date

**If any unchecked, ask AI to complete that step.**

---

## When AI Doesn't Follow Rules

### Step 1: Point to Specific Rule

```
"Please follow .cursor/rules/enforcement.md step 1:
complete the mandatory search phase"
```

### Step 2: Reference Rule File

```
"Check .cursor/rules/monorepo.md for correct file paths.
You used backend/src/ but should use apps/api/src/"
```

### Step 3: Use Hard Stop Language

```
"STOP - Rule violation detected. Please fix before proceeding:
[describe violation]"
```

### Step 4: Verify Fix

```
"Please verify you've completed:
- [ ] Searched for existing components
- [ ] Used correct file path
- [ ] Included tenantId in query"
```

---

## Summary

**Best way to get AI to follow rules:**

1. ✅ **Enforcement rules loaded first** - Mandatory checklist
2. ✅ **Explicit "MUST" language** - Strong requirements
3. ✅ **Hard stops defined** - Clear violation conditions
4. ✅ **Verification steps** - Check compliance at each step
5. ✅ **Quick reference** - Easy lookup for common rules
6. ✅ **Rule ordering** - Critical rules prioritized
7. ✅ **Developer reminders** - Know when to check compliance

**Result:** AI will be more consistent because:
- Rules are explicit and mandatory
- Violations have clear consequences (STOP)
- Verification happens at each step
- Rules are easy to reference

---

**Last Updated:** 2025-12-05  
**Status:** Active Best Practices  
**Owner:** Development Team

