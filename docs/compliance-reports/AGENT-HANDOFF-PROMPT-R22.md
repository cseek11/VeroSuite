# Agent Handoff Prompt: R22 Complete → Next Task

**Date:** 2025-11-23 19:09:16  
**Context:** R22: Refactor Integrity implementation complete  
**Next Action:** Continue with next rule or task

**⚠️ SOURCE OF TRUTH:** Rule numbers come from `.cursor/rules/*.mdc` files and `docs/compliance-reports/rule-compliance-matrix.md`, not the original plan document.

---

## 🎯 Your Mission

R22: Refactor Integrity has been **successfully implemented and tested**. Your task is to:

1. **Verify R22 implementation** (optional - quick sanity check)
2. **Identify next task** (next rule to implement or other priority)
3. **Proceed with next implementation** following the established 4-step workflow

---

## ✅ What Was Completed (R22)

### Implementation Status: COMPLETE ✅

**Deliverables:**
- ✅ OPA Policy: 5 warning patterns (R22-W01 through R22-W05)
- ✅ Test Suite: 15/15 tests passing (100%)
- ✅ Rule Documentation: Added to `.cursor/rules/04-architecture.mdc`
- ✅ Completion Summary: `docs/compliance-reports/R22-IMPLEMENTATION-COMPLETE.md`

**Key Files:**
- `services/opa/policies/architecture.rego` (R22 section, ~lines 352-580)
- `services/opa/tests/architecture_r22_test.rego` (15 test cases)
- `.cursor/rules/04-architecture.mdc` (R22 audit procedures at end)

**Test Results:**
```bash
cd services/opa
.\bin\opa.exe test tests/architecture_r22_test.rego policies/architecture.rego
# Expected: PASS: 15/15
```

---

## 🔍 Quick Verification (Optional - 2 minutes)

If you want to verify R22 is working:

```bash
# 1. Run tests
cd services/opa
.\bin\opa.exe test tests/architecture_r22_test.rego policies/architecture.rego

# 2. Test with sample input
.\bin\opa.exe eval -d policies/architecture.rego -i test-r22-extract.json 'data.compliance.architecture.refactor_integrity_warnings' --format pretty

# Expected: Warnings generated for refactoring without tests/risk surface
```

**If tests pass:** R22 is working correctly ✅  
**If tests fail:** Review `docs/compliance-reports/R22-IMPLEMENTATION-COMPLETE.md` for troubleshooting

---

## 📋 Next Task Options

### Option 1: Continue with Next Rule (RECOMMENDED)

**Rationale:**
- R22 is complete and functional
- Better to complete more rules than perfect one rule
- Python script enhancement can be done later

**Steps:**
1. Review rule catalog to identify next rule
2. Check if draft exists in `.cursor/rules/` or `docs/compliance-reports/`
3. If draft exists: Review and proceed to implementation
4. If no draft: Follow 4-step workflow:
   - **Step 1:** Create draft documents (rule file + summary)
   - **Step 2:** Present for review (wait for approval)
   - **Step 3:** Implement (OPA policy + tests + rule update)
   - **Step 4:** Document completion

**Potential Next Rules:**
- R23: Cross-Platform Compatibility (if exists)
- R24: Performance Budgets (if exists)
- Or check `.cursor/rules/` for other pending rules

### Option 2: Implement Python Script Enhancement (LOW PRIORITY)

**File:** `.cursor/scripts/check-refactor-integrity.py`

**Purpose:** Detailed refactor analysis (AST parsing, test content analysis)

**Status:** Optional enhancement, not required for R22 completion

**Estimated Time:** 2-3 hours

**Priority:** LOW (can be done later)

---

## 📚 Important Context

### R22 Implementation Approach

**Design Decision:** Simplified OPA Policy
- OPA policy does basic pattern matching (keyword detection, simple checks)
- Detailed AST analysis deferred to Python script (not yet implemented)
- This aligns with R21 approach and improves maintainability

**Why This Approach:**
- Complex Rego logic proved difficult to debug
- Python script provides better tooling for detailed analysis
- OPA policy sufficient for initial implementation

### Rule Implementation Progress

**Task 5 Completed Rules:**
1. ✅ R16: Testing Requirements
2. ✅ R17: Test Coverage
3. ✅ R18: Performance Budgets
4. ✅ R19: Accessibility
5. ✅ R20: UX Consistency
6. ✅ R21: File Organization
7. ✅ R22: Refactor Integrity

**Total:** 7 rules implemented in Task 5

---

## 🗂️ Files to Review

### Implementation Files
- `services/opa/policies/architecture.rego` (R22 section)
- `services/opa/tests/architecture_r22_test.rego` (test suite)
- `.cursor/rules/04-architecture.mdc` (R22 audit procedures)

### Documentation Files
- `docs/compliance-reports/R22-IMPLEMENTATION-COMPLETE.md` (full completion summary)
- `docs/compliance-reports/TASK5-R22-DRAFT-SUMMARY.md` (approved draft with answers)
- `docs/compliance-reports/R22-REVIEW-QUESTIONS-REASONING.md` (reasoning for review questions)

### Handoff Files
- `docs/compliance-reports/HANDOFF-TO-NEXT-AGENT-R23.md` (detailed handoff)
- `docs/compliance-reports/AGENT-HANDOFF-PROMPT-R22.md` (this file)

---

## 🚀 Quick Start Guide

### If Continuing with Next Rule:

1. **Search for next rule:**
   ```bash
   # Check for rule drafts
   ls .cursor/rules/*-DRAFT.md
   ls docs/compliance-reports/TASK5-*-DRAFT*.md
   
   # Check rule catalog
   grep -r "R23\|R24\|R25" .cursor/rules/
   ```

2. **If draft exists:**
   - Read draft summary
   - Check if approved
   - If approved: Proceed to Step 3 (implementation)
   - If not approved: Wait for review

3. **If no draft exists:**
   - Identify next rule to implement
   - Follow 4-step workflow (start with Step 1: draft creation)

### If Implementing Python Script:

1. **Review requirements:**
   - Read `docs/compliance-reports/R22-IMPLEMENTATION-COMPLETE.md` (Python Script Scope section)
   - Review approved enhancements in `TASK5-R22-DRAFT-SUMMARY.md`

2. **Create script:**
   - File: `.cursor/scripts/check-refactor-integrity.py`
   - Follow patterns from other scripts (e.g., `check-file-organization.py`)
   - Implement AST parsing, test content analysis, risk surface validation

3. **Test and document:**
   - Test with sample refactoring PRs
   - Document usage in script comments
   - Update R22 documentation if needed

---

## ⚠️ Important Notes

### What NOT to Do

- ❌ Don't modify R22 OPA policy unless fixing bugs
- ❌ Don't change R22 test suite unless adding new test cases
- ❌ Don't remove R22 documentation

### What TO Do

- ✅ Verify R22 tests pass (optional sanity check)
- ✅ Identify and proceed with next task
- ✅ Follow established 4-step workflow for new rules
- ✅ Document decisions and progress

---

## 📞 Support Resources

### If You Get Stuck

1. **Review completion summary:**
   - `docs/compliance-reports/R22-IMPLEMENTATION-COMPLETE.md`

2. **Check similar implementations:**
   - R21: File Organization (similar OPA + script approach)
   - R20: UX Consistency (similar pattern)

3. **Review error patterns:**
   - `docs/compliance-reports/R21-TEST-ERRORS-ANALYSIS.md` (similar debugging patterns)

---

## ✅ Success Criteria

### For Next Rule Implementation

- [ ] Draft documents created (rule file + summary)
- [ ] Draft reviewed and approved
- [ ] OPA policy implemented and tested
- [ ] Test suite created (all tests passing)
- [ ] Rule documentation updated
- [ ] Completion summary created

### For Python Script Implementation

- [ ] Script created with AST parsing
- [ ] Test content analysis implemented
- [ ] Risk surface validation implemented
- [ ] Script tested with sample PRs
- [ ] Documentation updated

---

## 🎯 Recommended Next Action

**Proceed with Option 1: Continue with Next Rule**

**Rationale:**
- R22 is complete and functional
- Better to complete more rules than perfect one rule
- Python script is optional enhancement
- Can return to script later if needed

**First Steps:**
1. Search for next rule draft or catalog
2. If found: Review and proceed
3. If not found: Identify next rule and start Step 1 (draft creation)

---

**Last Updated:** 2025-11-23 19:09:16  
**Status:** R22 COMPLETE ✅ - Ready for Next Task  
**Confidence:** HIGH - All tests passing, documentation complete

---

## 🎬 Start Here

```bash
# 1. Quick verification (optional)
cd services/opa
.\bin\opa.exe test tests/architecture_r22_test.rego policies/architecture.rego

# 2. Search for next rule
cd ../..
ls .cursor/rules/*-DRAFT.md
ls docs/compliance-reports/TASK5-*-DRAFT*.md

# 3. Proceed with next task
# (Follow 4-step workflow or implement Python script)
```

**Good luck! 🚀**

