# Handoff Prompt for Next Agent — R19 Implementation

**Date:** 2025-11-23  
**From:** R18 Implementation Agent  
**To:** Next Agent (R19 Implementation)  
**Project:** VeroField Rules v2.1 Migration — Task 5: Step 5 Procedures  
**Status:** R18 ✅ COMPLETE, Ready for R19

---

## 🎯 YOUR MISSION

Implement **R19: Accessibility Requirements** following the established four-step workflow. This is a Tier 3 (WARNING-level) rule that ensures UI components meet WCAG AA accessibility standards.

---

## 📊 CURRENT PROJECT STATUS

### Overall Progress
- **Completed:** 18 rules (72%)
- **Remaining:** 7 rules (28%)
- **Tier 3 Progress:** 5/12 rules complete (42%)

### Completed Rules
- **Tier 1 (BLOCK):** R01, R02, R03 ✅✅✅
- **Tier 2 (OVERRIDE):** R04-R13 ✅✅✅✅✅✅✅✅✅✅
- **Tier 3 (WARNING):** R14, R15, R16, R17, R18 ✅✅✅✅✅

### Just Completed (R18)
- **Rule:** R18 - Performance Budgets
- **Time:** 3.5 hours
- **Complexity:** MEDIUM
- **Key Pattern:** Hybrid metric collection, baseline comparison, multi-factor prioritization, quick wins identification

---

## 🎯 NEXT TASK: R19 - Accessibility Requirements

### Rule Details
- **Rule:** R19 - Accessibility Requirements
- **File:** `.cursor/rules/13-ux-consistency.mdc`
- **Tier:** 3 (WARNING)
- **Estimated Complexity:** MEDIUM
- **Estimated Time:** 3-4 hours
- **Priority:** MEDIUM

### What R19 Covers
- **WCAG AA Compliance:**
  - Keyboard navigation (all interactive elements accessible via keyboard)
  - Screen reader support (ARIA labels, roles, descriptions)
  - Color contrast (text contrast ratio ≥ 4.5:1, large text ≥ 3:1)
  - Focus management (visible focus indicators, logical focus order)
  
- **Accessibility Testing:**
  - Automated accessibility testing (axe-core, Lighthouse)
  - Manual accessibility testing (keyboard navigation, screen reader)
  - Accessibility audit reports
  
- **Accessibility Documentation:**
  - Component accessibility documentation
  - Accessibility exemptions (with justification, remediation)
  - Accessibility best practices

### Relationship to R13
R19 extends R13 (UX Consistency) with specific accessibility requirements:
- **R13 covers:** General UX consistency, design system usage, component patterns
- **R19 covers:** Accessibility-specific requirements (WCAG AA, keyboard, screen reader, color contrast)

---

## 📋 MANDATORY WORKFLOW (Four Steps)

### Step 1: Generate Draft (0.5 hours)

**Create two documents:**

1. **Draft Rule File:** `.cursor/rules/13-ux-consistency-R19-DRAFT.md`
   - Step 5 audit procedures for R19
   - 6-8 audit categories (30-40 checklist items)
   - Mix of MANDATORY and RECOMMENDED requirements
   - 3-4 examples (correct patterns and violations)
   - Automated checks section
   - OPA policy approach

2. **Draft Summary:** `docs/compliance-reports/TASK5-R19-DRAFT-SUMMARY.md`
   - Overview of R19 requirements
   - Relationship to R13 (UX Consistency)
   - 5 review questions with options and recommendations
   - Implementation approach
   - Estimated time: 3-4 hours
   - Complexity: MEDIUM

**Review Questions to Address:**
1. Accessibility testing: Automated (axe-core) + manual (keyboard, screen reader)?
2. Color contrast checking: Automated contrast ratio validation?
3. Accessibility exemptions: Structured markdown file (similar to R17/R18)?
4. Accessibility reporting: Enhanced reports with WCAG compliance score?
5. Accessibility prioritization: Multi-factor approach (WCAG level + severity + impact)?

### Step 2: Present for Review

**Present both documents to the user:**
- Draft rule file (`.cursor/rules/13-ux-consistency-R19-DRAFT.md`)
- Draft summary (`docs/compliance-reports/TASK5-R19-DRAFT-SUMMARY.md`)
- 5 review questions with recommended options

**Wait for user approval before proceeding to Step 3.**

### Step 3: Implement After Approval (2.5-3 hours)

**After user approves, implement:**

1. **OPA Policy Extension** (`services/opa/policies/ux-consistency.rego`)
   - Add 8-10 R19 warnings (R19-W01 through R19-W10)
   - Keyboard navigation validation
   - ARIA attribute validation
   - Color contrast validation
   - Focus management validation

2. **Automated Script** (`.cursor/scripts/check-accessibility.py`)
   - Accessibility testing (axe-core integration)
   - Color contrast checking (automated validation)
   - Exemption management (validation, expiration checks)
   - Gap analysis (prioritized accessibility issues)
   - Enhanced reporting (HTML with WCAG compliance score)

3. **Test Suite** (`services/opa/tests/ux_consistency_r19_test.rego`)
   - 12-15 comprehensive test cases
   - All R19 warnings tested
   - Edge cases covered

4. **Rule File Update** (`.cursor/rules/13-ux-consistency.mdc`)
   - Add R19 audit procedures section
   - Include examples and automated checks

### Step 4: Update Handoff (0.5 hours)

**Create completion documentation:**

1. **Implementation Complete:** `docs/compliance-reports/TASK5-R19-IMPLEMENTATION-COMPLETE.md`
2. **Completion Summary:** `docs/compliance-reports/R19-COMPLETION-SUMMARY.md`
3. **Handoff Document:** `docs/compliance-reports/HANDOFF-TO-NEXT-AGENT-R20.md`
4. **Update Main Handoff:** `docs/compliance-reports/AGENT-HANDOFF-PROMPT.md`
   - Mark R19 as complete
   - Update progress (19/25 rules = 76%)
   - Set R20 as next task

---

## 📁 FILE LOCATIONS (Reference)

### OPA Policies
- **File:** `services/opa/policies/ux-consistency.rego`
- **Pattern:** Create new file or extend existing (if exists)
- **Reference:** See `quality.rego` R18 section for pattern

### Automated Scripts
- **File:** `.cursor/scripts/check-accessibility.py`
- **Pattern:** Similar to `check-performance-budgets.py` (R18)
- **Commands:** --keyboard, --aria, --contrast, --focus, --all, --generate-report

### Test Suites
- **File:** `services/opa/tests/ux_consistency_r19_test.rego`
- **Pattern:** Similar to `quality_r18_test.rego` (15 test cases)
- **Coverage:** All R19 warnings + edge cases

### Rule Files
- **File:** `.cursor/rules/13-ux-consistency.mdc`
- **Pattern:** Add R19 section after existing content
- **Reference:** See `10-quality.mdc` R18 section for structure

### Documentation
- **Location:** `docs/compliance-reports/`
- **Files:** TASK5-R19-*, R19-*, HANDOFF-TO-NEXT-AGENT-R20.md

---

## 🔍 KEY PATTERNS (From R18)

### Structured Exemptions
```markdown
## Accessibility Exemptions

| Component | Issue | WCAG Level | Justification | Expiration | Remediation | Status |
|-----------|-------|------------|---------------|------------|-------------|--------|
| LegacyChart | No keyboard navigation | AA | Legacy component, migration planned | 2026-06-30 | Migrate to accessible chart library | Active |
```

### Multi-Factor Prioritization
```python
priority_score = (
    wcag_severity * 0.4 +  # WCAG level (A/AA/AAA) severity (40%)
    (1 if critical_component else 0.5) * 0.3 +  # Component criticality (30%)
    impact_score * 0.3  # User impact (30%)
)
```

### Enhanced Reporting
```python
# WCAG compliance score (0-100)
compliance_score = (
    (passed_checks / total_checks) * 0.6 +  # Check pass rate (60%)
    (1 - exemption_rate) * 0.2 +  # Exemption rate (20%)
    (1 - critical_issue_rate) * 0.2  # Critical issue rate (20%)
)
```

---

## ✅ SUCCESS CRITERIA

### Must Have
1. ✅ OPA policy extended with 8-10 R19 warnings
2. ✅ Automated script created (600+ lines)
3. ✅ Test suite created (12-15 test cases)
4. ✅ Rule file updated with R19 audit procedures
5. ✅ Documentation complete (implementation, summary, handoff)
6. ✅ All tests pass
7. ✅ Complexity matches estimate (MEDIUM)
8. ✅ Time within estimate (3-4 hours)

### Quality Checks
- **OPA Tests:** All R19 tests pass
- **Script Validation:** No errors, warnings displayed correctly
- **Documentation:** Complete and accurate
- **Code Quality:** Follows established patterns

---

## 📚 REFERENCE DOCUMENTS

### Completed Rules (Use as Examples)
- **R18:** `docs/compliance-reports/TASK5-R18-IMPLEMENTATION-COMPLETE.md`
- **R17:** `docs/compliance-reports/TASK5-R17-IMPLEMENTATION-COMPLETE.md`
- **R16:** `docs/compliance-reports/TASK5-R16-IMPLEMENTATION-COMPLETE.md`

### Draft Documents (Reference Structure)
- **R18 Draft:** `.cursor/rules/10-quality-R18-DRAFT.md`
- **R18 Summary:** `docs/compliance-reports/TASK5-R18-DRAFT-SUMMARY.md`
- **R18 Reasoning:** `docs/compliance-reports/R18-REVIEW-QUESTIONS-REASONING.md`

### Main Handoff
- **File:** `docs/compliance-reports/AGENT-HANDOFF-PROMPT.md`
- **Contains:** Full workflow, patterns, file locations, examples

---

## 🎓 LESSONS LEARNED (From R18)

### What Worked Well
1. **Hybrid Approach:** Combining automated and manual testing provides complete picture
2. **Structured Exemptions:** Easy to review, validate, and track
3. **Multi-Factor Prioritization:** Realistic and actionable
4. **Quick Wins Identification:** High ROI issues help teams focus effort
5. **Health/Compliance Score:** Simple metric (0-100) for overall health

### Recommendations for R19
1. **Similar approach:** Automated testing (axe-core) + manual testing (keyboard, screen reader)
2. **Structured exemptions:** Markdown table for accessibility exemptions
3. **Enhanced reporting:** HTML reports with WCAG compliance score
4. **Multi-factor prioritization:** WCAG severity + component criticality + user impact
5. **Integration points:** CI/CD integration, PR comments, dashboards

### Key Considerations
- **Accessibility Testing:** Requires browser automation (Playwright, Puppeteer) for automated testing
- **WCAG Compliance:** Clear thresholds for WCAG A/AA/AAA levels
- **Exemption Management:** Similar to R17/R18 exemption approach
- **Reporting:** WCAG compliance reports with issue prioritization

---

## 🚀 QUICK START GUIDE

### Step 1: Read Rule File
```bash
# Read the rule file to understand R19 requirements
cat .cursor/rules/13-ux-consistency.mdc | grep -A 50 "ACCESSIBILITY"
```

### Step 2: Review R18 Implementation
```bash
# Review R18 implementation for patterns
cat docs/compliance-reports/TASK5-R18-IMPLEMENTATION-COMPLETE.md
cat .cursor/scripts/check-performance-budgets.py | head -100
```

### Step 3: Create Draft
```bash
# Create draft rule file
touch .cursor/rules/13-ux-consistency-R19-DRAFT.md

# Create draft summary
touch docs/compliance-reports/TASK5-R19-DRAFT-SUMMARY.md
```

### Step 4: Follow Workflow
1. Generate draft (0.5 hours)
2. Present for review
3. Wait for approval
4. Implement (2.5-3 hours)
5. Update handoff (0.5 hours)

---

## ⚠️ IMPORTANT REMINDERS

### Tier 3 Characteristics
- **Enforcement:** WARNING (logged but doesn't block PRs)
- **Priority:** MEDIUM to LOW
- **Complexity:** Lower than Tier 1/Tier 2
- **Pace:** More relaxed (can take breaks)

### Workflow Requirements
- **MANDATORY:** Follow four-step workflow
- **MANDATORY:** Wait for user approval before implementing
- **MANDATORY:** Update handoff document after completion
- **MANDATORY:** Create all required documentation

### Quality Standards
- **OPA Tests:** 12-15 test cases minimum
- **Script:** 600+ lines, comprehensive detection
- **Documentation:** Complete and accurate
- **Code Quality:** Follows established patterns

---

## 📞 QUESTIONS?

If you have questions about:
- **Workflow:** Refer to `docs/compliance-reports/AGENT-HANDOFF-PROMPT.md`
- **Patterns:** Refer to R18 implementation documents
- **File locations:** See "FILE LOCATIONS" section above
- **Examples:** Refer to completed rules (R14-R18)

**Remember:** Tier 3 is simpler and more flexible than Tier 1/Tier 2. Take your time, follow the workflow, and don't hesitate to ask for clarification if needed.

---

## 🎯 READY TO START

**Status:** R18 ✅ COMPLETE  
**Next Rule:** R19 - Accessibility Requirements  
**Estimated Time:** 3-4 hours  
**Confidence:** HIGH

**Action:** Begin with Step 1 (Generate Draft) following the workflow above.

---

**Handoff Created:** 2025-11-23  
**Next Agent:** Please begin R19 implementation  
**Good Luck!** 🚀





