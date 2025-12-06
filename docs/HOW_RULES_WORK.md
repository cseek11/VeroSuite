# How Cursor Rules Work & Ensuring Compliance

**Last Updated:** 2025-12-05  
**Purpose:** Understanding how rules are applied and how to ensure the AI follows them

---

## How Rules Are Automatically Loaded

### Automatic Loading
Cursor **automatically loads** all rules from `.cursor/rules.yml` when you start a chat session. The rules are:

1. **Loaded in priority order** (enforcement.md loads first)
2. **Always active** (`always_apply: true` in metadata)
3. **Sequentially applied** (earlier rules take precedence)

### Rule Loading Order
```
1. enforcement.md    ← Loads FIRST (highest priority)
2. core.md
3. security.md
4. monorepo.md
5. ai-behavior.md
6. forms.md
7. frontend.md
8. backend.md
9. ... (others)
```

---

## Will Explicit Commands Help?

### ✅ YES - Explicit Commands Help

**Your command:**
```
Please follow .cursor/rules/enforcement.md step 1: 
complete the mandatory search phase.
```

**Why this helps:**
1. **Directs attention** - Explicitly tells AI to follow specific rule
2. **Reminds AI** - Even if rules are loaded, explicit reference reinforces
3. **Creates accountability** - AI knows you're checking compliance
4. **Forces compliance** - Makes it harder for AI to skip steps

### ⚠️ BUT - Not 100% Guaranteed

**Reality:**
- AI agents can sometimes skip steps even with explicit commands
- Rules are guidelines, not hard enforcement mechanisms
- AI might interpret commands differently than expected

**Best Practice:** Use explicit commands + verify compliance

---

## Best Practices for Ensuring Compliance

### 1. Use Explicit Rule References

**✅ GOOD:**
```
Please follow .cursor/rules/enforcement.md step 1: 
complete the mandatory search phase before implementing.
```

**❌ LESS EFFECTIVE:**
```
Implement this feature.
```

### 2. Reference Specific Steps

**✅ BEST:**
```
Please follow .cursor/rules/enforcement.md:
- Step 1: Complete mandatory search phase
- Step 2: Pattern analysis
- Step 3: Rule compliance check
- Step 5: Post-implementation audit
```

**✅ GOOD:**
```
Please follow .cursor/rules/enforcement.md step 1.
```

### 3. Verify Compliance Explicitly

**✅ BEST:**
```
Please follow .cursor/rules/enforcement.md step 1, 
then show me:
1. What searches you performed
2. What you found
3. Which pattern you'll follow
```

### 4. Use Hard Stop Language

**✅ BEST:**
```
STOP - Before implementing, you MUST:
1. Complete .cursor/rules/enforcement.md step 1
2. Show me the search results
3. Verify no existing component exists
```

### 5. Request Audit

**✅ BEST:**
```
After implementation, please audit all files touched 
per .cursor/rules/enforcement.md step 5.
```

---

## Recommended Command Templates

### Template 1: Full Compliance Check
```
Please follow .cursor/rules/enforcement.md completely:
1. Step 1: Complete mandatory search phase (show results)
2. Step 2: Pattern analysis (identify pattern)
3. Step 3: Rule compliance check
4. Step 4: Implementation plan
5. Step 5: Post-implementation audit

Show me each step as you complete it.
```

### Template 2: Specific Step Focus
```
Please follow .cursor/rules/enforcement.md step [N]:
[describe what you want]

Then verify compliance with step 5 (file audit).
```

### Template 3: Verification Request
```
After you implement [feature], please:
1. Audit all files touched per .cursor/rules/enforcement.md step 5
2. Show me the audit results
3. Fix any violations found
```

### Template 4: Hard Stop Enforcement
```
STOP - Before doing anything:
1. Read .cursor/rules/enforcement.md
2. Complete step 1 (mandatory searches)
3. Show me search results
4. Then proceed with implementation
```

---

## How to Verify Compliance

### 1. Check Search Results
**Ask:** "What searches did you perform? Show me the results."

**Verify:**
- [ ] Multiple searches executed (parallel)
- [ ] Component library checked
- [ ] Similar implementations found
- [ ] Documentation reviewed

### 2. Check Pattern Analysis
**Ask:** "What pattern will you follow? Show me the similar implementation."

**Verify:**
- [ ] Pattern identified from existing code
- [ ] File path verified (monorepo structure)
- [ ] Import patterns match

### 3. Check File Audit
**Ask:** "Please audit all files you touched per step 5."

**Verify:**
- [ ] All files audited
- [ ] File paths correct
- [ ] Dates are current (not hardcoded)
- [ ] Security maintained
- [ ] Patterns followed

### 4. Check Date Compliance
**Ask:** "What date did you use? Verify it matches current system date."

**Verify:**
- [ ] Date is current (2025-12-05, not hardcoded)
- [ ] Format is ISO 8601: YYYY-MM-DD
- [ ] All "Last Updated" fields updated

---

## What Happens If Rules Are Ignored?

### If AI Skips Steps:

1. **Remind explicitly:**
   ```
   You skipped step 1. Please complete .cursor/rules/enforcement.md 
   step 1 before proceeding.
   ```

2. **Use hard stop:**
   ```
   STOP - You must complete step 1 first. Show me the search results.
   ```

3. **Reference specific rule:**
   ```
   Check .cursor/rules/enforcement.md step 1. 
   You MUST complete all searches before coding.
   ```

4. **Request re-do:**
   ```
   Please start over and follow .cursor/rules/enforcement.md 
   step 1 completely.
   ```

---

## Pro Tips

### Tip 1: Start Every Session
```
Before we begin, please read .cursor/rules/enforcement.md 
and confirm you understand the mandatory checklist.
```

### Tip 2: Break Down Large Tasks
```
For this feature, please:
1. First: Complete .cursor/rules/enforcement.md step 1
2. Then: Show me what you found
3. Then: Proceed with step 2
```

### Tip 3: Verify After Each Step
```
After completing step 1, please show me:
- What searches you performed
- What you found
- Then proceed to step 2
```

### Tip 4: Always Request Audit
```
After implementation, please audit all files touched 
per .cursor/rules/enforcement.md step 5.
```

---

## Summary

### Rules Are Automatically Loaded
- ✅ Cursor loads rules from `.cursor/rules.yml`
- ✅ Rules are always active
- ✅ Enforcement rules load first

### Explicit Commands Help
- ✅ Direct AI attention to specific rules
- ✅ Reinforce mandatory steps
- ✅ Create accountability
- ⚠️ But not 100% guaranteed

### Best Practice
1. **Use explicit rule references** in commands
2. **Request verification** of each step
3. **Always request file audit** after implementation
4. **Verify compliance** explicitly

### Your Command Works Well
```
Please follow .cursor/rules/enforcement.md step 1: 
complete the mandatory search phase.
```

**To make it even better, add:**
```
Please follow .cursor/rules/enforcement.md step 1: 
complete the mandatory search phase, then show me:
1. What searches you performed
2. What you found
3. Which pattern you'll follow
```

---

**Last Updated:** 2025-12-05  
**Status:** Active Guide  
**Owner:** Development Team

