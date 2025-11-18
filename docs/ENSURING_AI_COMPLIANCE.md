# Ensuring AI Agent Compliance with Rules

**Purpose:** This guide provides practical strategies to ensure the AI agent follows all VeroField development rules consistently.

**Last Updated:** 2025-11-18

---

## 🎯 Quick Reference: Mandatory Workflow

The AI agent **MUST** follow this 5-step workflow for **EVERY** task:

1. **Step 1: Search & Discovery** (MANDATORY)
2. **Step 2: Pattern Analysis** (MANDATORY)
3. **Step 3: Rule Compliance Check** (MANDATORY)
4. **Step 4: Implementation Plan** (MANDATORY)
5. **Step 5: Post-Implementation Audit** (MANDATORY)

**Reference:** See `.cursor/rules/enforcement.md` for complete checklist.

---

## ✅ Best Practices for Ensuring Compliance

### 1. **Request Explicit Checklist Completion**

**Before any implementation, ask:**

```
"Please follow .cursor/rules/enforcement.md completely:
1. Step 1: Complete mandatory search phase (show results)
2. Step 2: Pattern analysis (identify pattern)
3. Step 3: Rule compliance check
4. Step 4: Implementation plan
5. Step 5: Post-implementation audit

Show me each step as you complete it."
```

**Why this works:**
- Forces the agent to explicitly show each step
- Makes it visible when steps are skipped
- Creates accountability

### 2. **Request Post-Implementation Audit**

**After any code changes, ask:**

```
"Please perform a post-implementation audit:
1. Audit ALL files touched for code compliance
2. Verify error handling compliance
3. Verify pattern learning compliance (error patterns documented?)
4. Verify regression tests created (if bug fix)
5. Verify structured logging used
6. Verify no silent failures
7. Show me the audit results"
```

**Why this works:**
- Catches compliance issues after implementation
- Ensures error patterns are documented
- Ensures tests are created for bug fixes

### 3. **Request Specific Rule Verification**

**For critical areas, ask specific questions:**

#### Error Handling:
```
"Please verify error handling compliance:
- Are all error-prone operations wrapped in try/catch?
- Are errors logged with structured logging (logger.error)?
- Are error messages contextual and actionable?
- Are there any silent failures (empty catch blocks)?
- Show me the error handling code"
```

#### Pattern Learning:
```
"Please verify pattern learning compliance:
- Is this error pattern documented in docs/error-patterns.md?
- Are regression tests created for this bug fix?
- Are prevention strategies applied?
- Show me the pattern documentation"
```

#### Date Compliance:
```
"Please verify date compliance:
- Are all dates using current system date (not hardcoded)?
- Is 'Last Updated' field using current date?
- Show me all date usages in the code"
```

### 4. **Use Verification Prompts**

**Create a standard verification prompt you can reuse:**

```
"Before you proceed, please verify:
1. ✅ All mandatory searches completed (show results)
2. ✅ Pattern identified and documented
3. ✅ Rule compliance checked (show checklist)
4. ✅ Implementation plan created
5. ✅ Post-implementation audit will be performed

If any step is incomplete, STOP and complete it first."
```

### 5. **Request Compliance Reports**

**After implementation, ask for a compliance report:**

```
"Please provide a compliance report:
1. Files modified/created
2. Error patterns documented (yes/no, link)
3. Regression tests created (yes/no, link)
4. Structured logging used (yes/no, examples)
5. Rule violations found (if any)
6. Compliance score (X/100)"
```

---

## 🔍 Red Flags: When to Intervene

Watch for these signs that rules aren't being followed:

### ❌ **Red Flag 1: Code Written Without Search Phase**
**Sign:** Agent starts writing code immediately without showing search results
**Action:** Stop and ask: "Please complete Step 1 (Search & Discovery) first and show me the results"

### ❌ **Red Flag 2: No Pattern Documentation**
**Sign:** Bug fixed but no entry in `docs/error-patterns.md`
**Action:** Ask: "Please document this error pattern in docs/error-patterns.md"

### ❌ **Red Flag 3: No Regression Tests**
**Sign:** Bug fixed but no regression tests created
**Action:** Ask: "Please create regression tests for this bug fix (see docs/predictive-prevention.md)"

### ❌ **Red Flag 4: Console.log Instead of Logger**
**Sign:** `console.log` or `console.error` in code
**Action:** Ask: "Please replace console.log with structured logging (logger service)"

### ❌ **Red Flag 5: Silent Failures**
**Sign:** Empty catch blocks or swallowed errors
**Action:** Ask: "Please verify no silent failures (see docs/error-resilience.md)"

### ❌ **Red Flag 6: Hardcoded Dates**
**Sign:** Dates like `2025-11-16` hardcoded in code/docs
**Action:** Ask: "Please use current system date, not hardcoded dates"

### ❌ **Red Flag 7: No Post-Implementation Audit**
**Sign:** Code completed but no audit performed
**Action:** Ask: "Please perform post-implementation audit (see Step 5 in enforcement.md)"

### ❌ **Red Flag 8: Auto-PR System Not Self-Healing**
**Sign:** Too many small PRs created, no consolidation happening
**Action:** Ask: "Please verify Auto-PR consolidation is working (check for existing PRs, filter files, consolidate small PRs)"

### ❌ **Red Flag 9: Workflow Triggers Too Restrictive**
**Sign:** Workflows skipped because they require CI success
**Action:** Ask: "Please verify workflow triggers allow execution even if CI fails (check workflow conditions)"

---

## 📋 Standard Verification Checklist

Copy and paste this checklist after any implementation:

```
Please verify compliance with the following:

✅ **Error Handling:**
- [ ] All error-prone operations have try/catch
- [ ] Structured logging used (logger.error, not console.error)
- [ ] Error messages are contextual and actionable
- [ ] No silent failures (empty catch blocks)

✅ **Pattern Learning:**
- [ ] Error pattern documented in docs/error-patterns.md (if bug fix)
- [ ] Regression tests created (if bug fix)
- [ ] Prevention strategies applied

✅ **Code Quality:**
- [ ] TypeScript types are correct (no unnecessary 'any')
- [ ] Imports follow correct order
- [ ] File paths match monorepo structure
- [ ] No old naming (VeroSuite, @verosuite/*)

✅ **Security:**
- [ ] Tenant isolation maintained (if database operations)
- [ ] No secrets hardcoded
- [ ] Input validation present

✅ **Documentation:**
- [ ] 'Last Updated' field uses current date
- [ ] No hardcoded dates in documentation
- [ ] Code comments reference patterns when applicable

✅ **Testing:**
- [ ] Regression tests created (if bug fix)
- [ ] Error paths have tests
- [ ] Tests prevent pattern regressions
```

---

## 🎯 Recommended Workflow

### **For Every Task:**

1. **Start with:** "Please follow .cursor/rules/enforcement.md completely and show me each step"

2. **During Implementation:** Monitor for red flags

3. **After Implementation:** "Please perform post-implementation audit and show me the results"

4. **Before Accepting:** "Please provide compliance report"

### **For Bug Fixes Specifically:**

1. **Before Fix:** "Please search docs/error-patterns.md for similar patterns"

2. **After Fix:** 
   - "Please document this error pattern in docs/error-patterns.md"
   - "Please create regression tests for this bug fix"
   - "Please verify error handling compliance"

3. **Verification:** "Please show me the pattern documentation and regression tests"

---

## 🔧 Automated Verification (Future)

Consider implementing:

1. **Pre-commit Hook:** Run verification script before commits
2. **CI/CD Integration:** Automated compliance checks in pipeline
3. **Linting Rules:** Custom ESLint rules for common violations
4. **TypeScript Checks:** Stricter types to catch issues early

**Reference:** See `docs/verification.md` for verification script templates.

---

## 📚 Key Rule Files to Reference

When in doubt, ask the agent to reference these files:

- `.cursor/rules/enforcement.md` - Mandatory workflow checklist
- `docs/error-resilience.md` - Error handling requirements
- `docs/pattern-learning.md` - Pattern documentation requirements
- `docs/predictive-prevention.md` - Regression test requirements
- `docs/observability.md` - Structured logging requirements

---

## 💡 Pro Tips

1. **Be Explicit:** Don't assume the agent will follow rules automatically - explicitly request compliance checks

2. **Show, Don't Tell:** Ask the agent to "show me" rather than just "verify" - this makes compliance visible

3. **Use Checklists:** Copy-paste the checklists from enforcement.md to ensure nothing is missed

4. **Verify After Changes:** Always request post-implementation audit after code changes

5. **Document Patterns:** For every bug fix, explicitly request pattern documentation

6. **Test Everything:** For every bug fix, explicitly request regression tests

---

## 🚨 Emergency: If Rules Are Violated

If you detect a rule violation:

1. **Stop the agent:** "Please stop. I detected a rule violation."

2. **Identify the violation:** "The violation is: [describe]"

3. **Reference the rule:** "This violates: [rule file and section]"

4. **Request fix:** "Please fix this violation and re-audit the file"

5. **Verify fix:** "Please show me the corrected code and compliance verification"

---

**Last Updated:** 2025-11-18



