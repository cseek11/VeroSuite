# Rule Updates: Bug Logging Clarification

**Date:** 2025-11-22  
**Status:** ✅ **COMPLETED**  
**Related:** `docs/compliance-reports/BUG_LOGGING_RULE_INVESTIGATION.md`

---

## Summary

Updated rules to explicitly require dual documentation for bug fixes:
1. **Detailed pattern** in `docs/error-patterns.md` (for learning)
2. **Concise log** in `.cursor/BUG_LOG.md` (for tracking)

---

## Files Updated

### 1. `.cursor/rules/00-master.mdc`

**Added Sections:**
- **DOCUMENTATION FILE PURPOSES** - Clarifies the purpose of each file
- **BUG FIX DOCUMENTATION REQUIREMENTS** - Explicit mandatory requirements
- **Updated ANTI-PATTERN & BUG LOGGING** - Clearer structure with subsections

**Key Changes:**
- ✅ Explicitly states ALL bug fixes require BOTH files
- ✅ Clarifies file purposes and relationships
- ✅ Adds enforcement requirements
- ✅ Specifies cross-referencing requirements

### 2. `.cursor/rules/01-enforcement.mdc`

**Updated Step 5 (Post-Implementation Audit):**
- ✅ Added: "MUST verify bug logged in `.cursor/BUG_LOG.md` (if bug was fixed)"
- ✅ Added: "MUST verify error pattern documented in `docs/error-patterns.md` (if bug was fixed)"
- ✅ Added: "MUST verify anti-pattern logged in `.cursor/anti_patterns.md` (if REWARD_SCORE ≤ 0)"

**Impact:**
- Bug logging is now a mandatory check in the enforcement pipeline
- Missing entries will trigger HARD STOP

### 3. `docs/error-pattern-guide.md`

**Added Section:**
- **Dual Documentation Requirement** - Explains the mandatory dual-documentation
- Clarifies when to use each file
- Provides cross-referencing guidance

**Key Changes:**
- ✅ States bug fixes require BOTH files
- ✅ Explains the relationship between files
- ✅ Provides format examples

### 4. `.cursor/rules/agent-instructions.mdc`

**Updated Section:**
- **Anti-Patterns & Bug Log** - Expanded with detailed requirements
- Added explicit dual-requirement statement
- Clarified file purposes

**Key Changes:**
- ✅ Explains when to log in each file
- ✅ States mandatory dual-requirement
- ✅ Provides format guidance

---

## New Rule Requirements

### For ALL Bug Fixes (MANDATORY)

1. **Document in `docs/error-patterns.md`:**
   - Detailed root cause analysis
   - Triggering conditions
   - Fix implementation
   - Prevention strategies
   - Code examples

2. **Log in `.cursor/BUG_LOG.md`:**
   - Date, area, description, status, owner, notes
   - Link to error-patterns.md entry
   - Format: `| Date | Area | Description | Status | Owner | Notes |`

3. **Cross-reference:**
   - BUG_LOG.md entry must link: `Related: docs/error-patterns.md#PATTERN_NAME`
   - error-patterns.md entry should reference BUG_LOG.md date

### For Low-Score PRs (REWARD_SCORE ≤ 0)

1. **Log anti-pattern in `.cursor/anti_patterns.md`**
2. **Log associated bug in `.cursor/BUG_LOG.md`** (if bug was fixed)
3. **Document error pattern in `docs/error-patterns.md`** (if applicable)

---

## Enforcement

### Step 5 (Post-Implementation Audit) Now Checks:

- [ ] **MUST** verify bug logged in `.cursor/BUG_LOG.md` (if bug was fixed) ⭐ **CRITICAL**
- [ ] **MUST** verify error pattern documented in `docs/error-patterns.md` (if bug was fixed) ⭐ **CRITICAL**
- [ ] **MUST** verify anti-pattern logged in `.cursor/anti_patterns.md` (if REWARD_SCORE ≤ 0) ⭐ **CRITICAL**

**Violation:** Missing entries = compliance violation (HARD STOP)

---

## File Purpose Clarification

### `docs/error-patterns.md`
- **Purpose:** Detailed knowledge base for learning and prevention
- **When:** Document every bug fix with full analysis
- **Content:** Root cause, triggers, fixes, prevention strategies, code examples
- **Audience:** Developers learning from past mistakes

### `.cursor/BUG_LOG.md`
- **Purpose:** Concise tracking log for compliance and history
- **When:** Log every bug fix (mandatory)
- **Content:** Date, area, description, status, owner, notes, link to error-patterns.md
- **Audience:** Compliance tracking, quick reference, historical record

### `.cursor/anti_patterns.md`
- **Purpose:** Known bad patterns to avoid
- **When:** Log anti-patterns from low-score PRs (REWARD_SCORE ≤ 0)
- **Content:** Date, PR, description, impact, follow-up, prevention pattern
- **Audience:** AI agents and developers to prevent regressions

---

## Expected Impact

### Immediate
- ✅ Clear rules for bug documentation
- ✅ Mandatory enforcement in Step 5
- ✅ Reduced ambiguity about when to log bugs

### Long-Term
- ✅ Consistent bug logging across all fixes
- ✅ Better compliance tracking
- ✅ Improved knowledge sharing
- ✅ Prevention of regression issues

---

## Verification

To verify these rules are working:

1. **Check Step 5 compliance:**
   - Review post-implementation audits
   - Verify bug logging checks are performed

2. **Monitor compliance reports:**
   - Check for bug logging violations
   - Verify dual-documentation is happening

3. **Review BUG_LOG.md:**
   - Ensure all bug fixes are logged
   - Verify cross-references to error-patterns.md

---

## Related Documentation

- `docs/compliance-reports/BUG_LOGGING_RULE_INVESTIGATION.md` - Investigation report
- `docs/compliance-reports/BUG_AND_ANTI_PATTERN_CONSOLIDATION_REPORT.md` - Consolidation report
- `.cursor/rules/00-master.mdc` - Master rule file (updated)
- `.cursor/rules/01-enforcement.mdc` - Enforcement pipeline (updated)
- `docs/error-pattern-guide.md` - Error pattern guide (updated)

---

**Updates Completed:** 2025-11-22  
**Status:** ✅ **READY FOR USE**  
**Next Review:** Monitor compliance in next 3 PRs



