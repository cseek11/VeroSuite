# Handoff Prompt for Next Agent — R18 Implementation

**Date:** 2025-11-23  
**From:** R17 Implementation Agent  
**To:** Next Agent (R18 Implementation)  
**Project:** VeroField Rules v2.1 Migration — Task 5: Step 5 Procedures  
**Status:** R17 ✅ COMPLETE, Ready for R18

---

## 🎯 YOUR MISSION

Implement **R18: Performance Budgets** following the established four-step workflow. This is a Tier 3 (WARNING-level) rule that tracks API response times and frontend performance metrics.

---

## 📊 CURRENT PROJECT STATUS

### Overall Progress
- **Completed:** 17 rules (68%)
- **Remaining:** 8 rules (32%)
- **Tier 3 Progress:** 4/12 rules complete (33%)

### Completed Rules
- **Tier 1 (BLOCK):** R01, R02, R03 ✅✅✅
- **Tier 2 (OVERRIDE):** R04-R13 ✅✅✅✅✅✅✅✅✅✅
- **Tier 3 (WARNING):** R14, R15, R16, R17 ✅✅✅✅

### Just Completed (R17)
- **Rule:** R17 - Coverage Requirements
- **Time:** 2.5 hours
- **Complexity:** LOW-MEDIUM
- **Key Pattern:** Git-based storage, baseline comparison, structured exemptions, multi-factor prioritization

---

## 🎯 NEXT TASK: R18 - Performance Budgets

### Rule Details
- **Rule:** R18 - Performance Budgets
- **File:** `.cursor/rules/10-quality.mdc`
- **Tier:** 3 (WARNING)
- **Estimated Complexity:** MEDIUM
- **Estimated Time:** 3-4 hours
- **Priority:** MEDIUM

### What R18 Covers
- **API Response Time Budgets:**
  - Simple GET: < 200ms (median)
  - Typical POST/PUT: < 300ms (median)
  - Heavy operations: < 500ms (median) with justification
  
- **Frontend Performance Budgets:**
  - First Contentful Paint (FCP): < 1.5s
  - Largest Contentful Paint (LCP): < 2s
  - Time to Interactive (TTI): < 3s (for main flows)

- **Performance Management:**
  - Performance regression detection (comparing against baseline)
  - Performance budget exemptions (documentation, justification)
  - Performance reporting (per-endpoint, per-page visibility)
  - Performance trend tracking (over time)

### Relationship to R17
R18 follows a similar pattern to R17:
- **Git-based storage** for performance history (`.performance/history.json`)
- **Baseline comparison** for regression detection
- **Structured exemptions** in markdown (`docs/performance-exemptions.md`)
- **Enhanced reporting** with HTML reports and health scores
- **Multi-factor prioritization** for performance issues

---

## 📋 MANDATORY WORKFLOW (Four Steps)

### Step 1: Generate Draft (0.5 hours)

**Create two documents:**

1. **Draft Rule File:** `.cursor/rules/10-quality-R18-DRAFT.md`
   - Step 5 audit procedures for R18
   - 6-8 audit categories (30-40 checklist items)
   - Mix of MANDATORY and RECOMMENDED requirements
   - 3-4 examples (correct patterns and violations)
   - Automated checks section
   - OPA policy approach

2. **Draft Summary:** `docs/compliance-reports/TASK5-R18-DRAFT-SUMMARY.md`
   - Overview of R18 requirements
   - Relationship to R10 (Performance Budgets section)
   - 5 review questions with options and recommendations
   - Implementation approach
   - Estimated time: 3-4 hours
   - Complexity: MEDIUM

**Review Questions to Address:**
1. Performance metric collection: How to collect API response times and frontend metrics?
2. Performance regression detection: Baseline comparison approach (similar to R17)?
3. Performance exemptions: Structured markdown file (similar to R17)?
4. Performance reporting: Enhanced reports with trend visualization?
5. Performance prioritization: Multi-factor approach (critical endpoints first)?

### Step 2: Present for Review

**Present both documents to the user:**
- Draft rule file (`.cursor/rules/10-quality-R18-DRAFT.md`)
- Draft summary (`docs/compliance-reports/TASK5-R18-DRAFT-SUMMARY.md`)
- 5 review questions with recommended options

**Wait for user approval before proceeding to Step 3.**

### Step 3: Implement After Approval (2.5-3 hours)

**After user approves, implement:**

1. **OPA Policy Extension** (`services/opa/policies/quality.rego`)
   - Add 8-10 R18 warnings (R18-W01 through R18-W10)
   - Performance regression detection
   - Exemption validation
   - Budget violation detection

2. **Automated Script** (`.cursor/scripts/check-performance-budgets.py`)
   - Performance metric collection (API response times, frontend metrics)
   - Baseline comparison (regression detection)
   - Exemption management (validation, expiration checks)
   - Gap analysis (prioritized performance issues)
   - Enhanced reporting (HTML with health score)

3. **Test Suite** (`services/opa/tests/quality_r18_test.rego`)
   - 12-15 comprehensive test cases
   - All R18 warnings tested
   - Edge cases covered

4. **Rule File Update** (`.cursor/rules/10-quality.mdc`)
   - Add R18 audit procedures section
   - Include examples and automated checks

### Step 4: Update Handoff (0.5 hours)

**Create completion documentation:**

1. **Implementation Complete:** `docs/compliance-reports/TASK5-R18-IMPLEMENTATION-COMPLETE.md`
2. **Completion Summary:** `docs/compliance-reports/R18-COMPLETION-SUMMARY.md`
3. **Handoff Document:** `docs/compliance-reports/HANDOFF-TO-NEXT-AGENT-R18.md`
4. **Update Main Handoff:** `docs/compliance-reports/AGENT-HANDOFF-PROMPT.md`
   - Mark R18 as complete
   - Update progress (18/25 rules = 72%)
   - Set R19 as next task

---

## 📁 FILE LOCATIONS (Reference)

### OPA Policies
- **File:** `services/opa/policies/quality.rego`
- **Pattern:** Extend existing file with R18 section
- **Reference:** See R17 section (lines 604-700+) for pattern

### Automated Scripts
- **File:** `.cursor/scripts/check-performance-budgets.py`
- **Pattern:** Similar to `check-coverage-requirements.py` (R17)
- **Commands:** --api, --frontend, --all, --update-trends, --generate-report

### Test Suites
- **File:** `services/opa/tests/quality_r18_test.rego`
- **Pattern:** Similar to `quality_r17_test.rego` (15 test cases)
- **Coverage:** All R18 warnings + edge cases

### Rule Files
- **File:** `.cursor/rules/10-quality.mdc`
- **Pattern:** Add R18 section after R17 section
- **Reference:** See R17 section for structure

### Documentation
- **Location:** `docs/compliance-reports/`
- **Files:** TASK5-R18-*, R18-*, HANDOFF-TO-NEXT-AGENT-R18.md

---

## 🔍 KEY PATTERNS (From R17)

### Git-Based Storage
```python
# Performance history storage
PERFORMANCE_HISTORY_FILE = '.performance/history.json'

# Format: JSON array of performance snapshots
[
  {
    "endpoint": "/api/users",
    "date": "2025-11-23T10:00:00Z",
    "metrics": {
      "p50": 150,
      "p95": 250,
      "p99": 300
    }
  }
]
```

### Baseline Comparison
```python
# Alert if performance degrades > 10%
if current_p50 > baseline_p50 * 1.1:
    alert("Performance regression detected")
```

### Structured Exemptions
```markdown
## Performance Exemptions

| Endpoint | Current | Budget | Justification | Expiration | Remediation | Status |
|----------|---------|--------|---------------|------------|-------------|--------|
| /api/reports | 600ms | 300ms | Complex aggregation | 2026-06-30 | Optimize query | Active |
```

### Multi-Factor Prioritization
```python
priority_score = (
    (current - budget) / budget * 0.4 +  # Budget violation severity (40%)
    (1 if critical else 0.5) * 0.3 +      # Endpoint criticality (30%)
    impact_score * 0.3                    # User impact (30%)
)
```

---

## ✅ SUCCESS CRITERIA

### Must Have
1. ✅ OPA policy extended with 8-10 R18 warnings
2. ✅ Automated script created (600+ lines)
3. ✅ Test suite created (12-15 test cases)
4. ✅ Rule file updated with R18 audit procedures
5. ✅ Documentation complete (implementation, summary, handoff)
6. ✅ All tests pass
7. ✅ Complexity matches estimate (MEDIUM)
8. ✅ Time within estimate (3-4 hours)

### Quality Checks
- **OPA Tests:** All R18 tests pass
- **Script Validation:** No errors, warnings displayed correctly
- **Documentation:** Complete and accurate
- **Code Quality:** Follows established patterns

---

## 📚 REFERENCE DOCUMENTS

### Completed Rules (Use as Examples)
- **R17:** `docs/compliance-reports/TASK5-R17-IMPLEMENTATION-COMPLETE.md`
- **R16:** `docs/compliance-reports/TASK5-R16-IMPLEMENTATION-COMPLETE.md`
- **R15:** `docs/compliance-reports/TASK5-R15-IMPLEMENTATION-COMPLETE.md`
- **R14:** `docs/compliance-reports/TASK5-R14-IMPLEMENTATION-COMPLETE.md`

### Draft Documents (Reference Structure)
- **R17 Draft:** `.cursor/rules/10-quality-R17-DRAFT.md`
- **R17 Summary:** `docs/compliance-reports/TASK5-R17-DRAFT-SUMMARY.md`
- **R17 Reasoning:** `docs/compliance-reports/R17-REVIEW-QUESTIONS-REASONING.md`

### Main Handoff
- **File:** `docs/compliance-reports/AGENT-HANDOFF-PROMPT.md`
- **Contains:** Full workflow, patterns, file locations, examples

---

## 🎓 LESSONS LEARNED (From R17)

### What Worked Well
1. **Git-based storage:** Simple, version-controlled, no infrastructure overhead
2. **Baseline comparison:** Stable, actionable, avoids noise
3. **Structured exemptions:** Easy to review and validate
4. **Multi-factor prioritization:** Realistic and actionable
5. **Health score:** Simple metric (0-100) for overall health

### Recommendations for R18
1. **Similar approach:** Git-based storage for performance history
2. **Baseline comparison:** Alert on performance regressions (> 10% increase)
3. **Structured exemptions:** Markdown table for performance exemptions
4. **Enhanced reporting:** HTML reports with performance trends
5. **Multi-factor prioritization:** Prioritize critical endpoints (auth, payment, etc.)

### Key Considerations
- **Performance Metrics:** Need to collect from CI/CD or runtime monitoring
- **Budget Thresholds:** Define clear thresholds for different operation types
- **Exemption Management:** Similar to R17 exemption approach
- **Reporting:** Performance reports with trend visualization

---

## 🚀 QUICK START GUIDE

### Step 1: Read Rule File
```bash
# Read the rule file to understand R18 requirements
cat .cursor/rules/10-quality.mdc | grep -A 50 "PERFORMANCE BUDGETS"
```

### Step 2: Review R17 Implementation
```bash
# Review R17 implementation for patterns
cat docs/compliance-reports/TASK5-R17-IMPLEMENTATION-COMPLETE.md
cat .cursor/scripts/check-coverage-requirements.py | head -100
```

### Step 3: Create Draft
```bash
# Create draft rule file
touch .cursor/rules/10-quality-R18-DRAFT.md

# Create draft summary
touch docs/compliance-reports/TASK5-R18-DRAFT-SUMMARY.md
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
- **Patterns:** Refer to R17 implementation documents
- **File locations:** See "FILE LOCATIONS" section above
- **Examples:** Refer to completed rules (R14-R17)

**Remember:** Tier 3 is simpler and more flexible than Tier 1/Tier 2. Take your time, follow the workflow, and don't hesitate to ask for clarification if needed.

---

## 🎯 READY TO START

**Status:** R17 ✅ COMPLETE  
**Next Rule:** R18 - Performance Budgets  
**Estimated Time:** 3-4 hours  
**Confidence:** HIGH

**Action:** Begin with Step 1 (Generate Draft) following the workflow above.

---

**Handoff Created:** 2025-11-23  
**Next Agent:** Please begin R18 implementation  
**Good Luck!** 🚀



