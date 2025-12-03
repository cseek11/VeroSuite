# R17: Coverage Requirements — Draft Summary

**Date:** 2025-11-23  
**Rule:** R17 - Coverage Requirements  
**Tier:** 3 (WARNING-level enforcement)  
**Status:** DRAFT - Awaiting Review  
**Estimated Time:** 2-3 hours

---

## Overview

R17 ensures that code changes maintain and improve test coverage beyond the basic 80% threshold enforced by R10. R17 focuses on coverage trends, exemptions, reporting, and maintenance.

**Key Focus Areas:**
- Coverage trends (tracking over time, preventing degradation)
- Coverage exemptions (documentation, justification, remediation)
- Coverage reporting (per-file, per-module, per-service visibility)
- Coverage goals (critical vs non-critical code targets)
- Coverage maintenance (delta tracking, gap analysis)
- Coverage visibility (PR comments, CI/CD reports, dashboards)

---

## Relationship to R10

**R10 Covers:**
- Basic 80% threshold enforcement (statements, branches, functions, lines)
- Coverage delta calculation (new code vs existing code)
- Test existence verification (unit tests, regression tests)

**R17 Covers:**
- Coverage trends (tracking over time, preventing degradation)
- Coverage exemptions (documentation, justification, expiration)
- Coverage reporting (comprehensive visibility and analysis)
- Coverage goals (critical vs non-critical targets)
- Coverage maintenance (gap identification, prioritization)
- Coverage visibility (PR comments, dashboards, reports)

**Rationale:** R10 provides baseline coverage enforcement. R17 ensures coverage is maintained, improved, and visible over time.

---

## Draft Structure

### Audit Checklist Categories (7 categories, 40+ items)

1. **Coverage Trends** (5 items: 3 MANDATORY, 2 RECOMMENDED)
   - Tracking over time, non-decreasing trend, documentation, visibility, alerts

2. **Coverage Exemptions** (5 items: 4 MANDATORY, 1 RECOMMENDED)
   - Documentation, justification, remediation plan, expiration date, periodic review

3. **Coverage Reporting** (6 items: 4 MANDATORY, 2 RECOMMENDED)
   - Report generation, accessibility, metrics, delta, trend visualization, gap analysis

4. **Coverage Goals** (5 items: 3 MANDATORY, 2 RECOMMENDED)
   - Critical code goals (≥ 90%), non-critical goals (≥ 80%), documentation, review, adjustment

5. **Coverage Maintenance** (6 items: 4 MANDATORY, 2 RECOMMENDED)
   - Delta tracking, positive delta, degradation prevention, gap identification, prioritization, remediation

6. **Coverage by Code Type** (5 items: 3 MANDATORY, 2 RECOMMENDED)
   - Critical code higher coverage (≥ 90%), non-critical baseline (≥ 80%), identification, documentation, review

7. **Coverage Visibility** (5 items: 3 MANDATORY, 2 RECOMMENDED)
   - PR comments, CI/CD artifacts, dashboards, code review indicators, documentation links

**Total:** 40+ checklist items (mix of MANDATORY, RECOMMENDED)

---

## Key Decisions Required

### Q1: How should we track coverage trends over time?

**Option A:** Store coverage data in coverage reports (JSON, LCOV)
- **Pros:** Simple, uses existing coverage infrastructure
- **Cons:** Requires parsing reports, no historical comparison built-in

**Option B:** Store coverage data in database (coverage metrics table)
- **Pros:** Historical data, easy querying, trend analysis
- **Cons:** Requires database setup, more complex

**Option C:** Store coverage data in git (coverage history file)
- **Pros:** Version controlled, no database needed, historical data
- **Cons:** File may grow large, requires parsing

**Recommendation:** Option C (Git-based storage)
- Store coverage history in `.coverage/history.json` (version controlled)
- Format: `{ "file": "path/to/file.ts", "date": "2025-11-23", "coverage": { "statements": 85, "branches": 82, ... } }`
- Benefits: Version controlled, no database needed, historical data available

---

### Q2: How should we detect coverage degradation?

**Option A:** Compare current coverage to previous commit
- **Pros:** Simple, immediate feedback
- **Cons:** May miss gradual degradation over time

**Option B:** Compare current coverage to baseline (last release)
- **Pros:** Catches gradual degradation, more stable baseline
- **Cons:** May miss recent degradation

**Option C:** Compare current coverage to trend (moving average)
- **Pros:** Catches gradual degradation, accounts for fluctuations
- **Cons:** More complex, requires trend calculation

**Recommendation:** Option B (Baseline comparison)
- Compare current coverage to baseline (last release or last month)
- Alert if coverage decreases by > 5% from baseline
- Benefits: Catches gradual degradation, stable baseline

---

### Q3: How should we handle coverage exemptions?

**Option A:** Inline comments in code (`// @coverage-exempt`)
- **Pros:** Simple, co-located with code
- **Cons:** No structured data, hard to track

**Option B:** Separate exemption file (`docs/coverage-exemptions.md`)
- **Pros:** Structured data, easy to track, reviewable
- **Cons:** Separate from code, may get out of sync

**Option C:** Hybrid approach (inline marker + exemption file)
- **Pros:** Co-located marker + structured documentation
- **Cons:** Requires both to be maintained

**Recommendation:** Option B (Separate exemption file)
- File: `docs/coverage-exemptions.md`
- Format: Markdown table with file, coverage, justification, expiration, remediation
- Benefits: Structured, reviewable, trackable, can be validated

---

### Q4: How should we generate coverage reports?

**Option A:** Use existing coverage tools (Jest, Vitest coverage reports)
- **Pros:** Uses existing infrastructure, no additional setup
- **Cons:** May not include all required metrics (trends, gaps)

**Option B:** Custom coverage report generator
- **Pros:** Includes all required metrics, customizable
- **Cons:** Requires custom development, maintenance

**Option C:** Enhanced coverage reports (existing tools + custom analysis)
- **Pros:** Uses existing tools + adds custom analysis
- **Cons:** Requires integration work

**Recommendation:** Option C (Enhanced coverage reports)
- Use Jest/Vitest coverage reports as base
- Add custom analysis script for trends, gaps, exemptions
- Generate enhanced report: `coverage-enhanced.json` + `coverage-report.html`
- Benefits: Leverages existing tools + adds required metrics

---

### Q5: How should we identify and prioritize coverage gaps?

**Option A:** Simple threshold (files below 80% are gaps)
- **Pros:** Simple, clear criteria
- **Cons:** Doesn't prioritize by importance

**Option B:** Weighted by code type (critical code gaps prioritized)
- **Pros:** Prioritizes important gaps, actionable
- **Cons:** Requires code type classification

**Option C:** Multi-factor prioritization (coverage + code type + impact)
- **Pros:** Most accurate prioritization, actionable
- **Cons:** More complex, requires multiple inputs

**Recommendation:** Option C (Multi-factor prioritization)
- Factors: Coverage level, code type (critical vs non-critical), impact (usage frequency)
- Priority: Critical code < 90% = High, Non-critical < 80% = Medium, Legacy code < 60% = Low
- Benefits: Actionable prioritization, focuses on important gaps

---

## Implementation Approach

### Detection Strategy
1. **Coverage Trends:** Parse coverage history file, calculate trends
2. **Coverage Degradation:** Compare current to baseline, alert if > 5% decrease
3. **Coverage Exemptions:** Parse exemption file, validate expiration dates
4. **Coverage Gaps:** Identify files below thresholds, prioritize by code type

### Validation Strategy
1. **Trend Validation:** Verify coverage trend is non-decreasing
2. **Exemption Validation:** Verify exemptions are documented, justified, not expired
3. **Gap Validation:** Verify gaps are identified and prioritized
4. **Goal Validation:** Verify goals are set and met

### Enforcement Strategy
1. **WARNING-level:** Log violations but don't block PRs
2. **Context-aware:** Only warn for applicable requirements
3. **Clear messages:** Provide specific guidance on coverage issues

---

## Examples Provided

### ✅ Correct Patterns
- Coverage trend tracking (increasing over time)
- Coverage exemptions (documented, justified, with expiration)
- Coverage goals (critical ≥ 90%, non-critical ≥ 80%)
- Coverage gap analysis (prioritized by code type)

### ❌ Violation Patterns
- Coverage degradation (decreasing trend)
- Missing coverage exemptions (coverage < 80% without exemption)
- Missing coverage goals (no goals set for code types)
- Missing coverage gap analysis (gaps not identified)

---

## Review Questions

1. **Q1: Coverage Trend Tracking** - Do you agree with Option C (Git-based storage in `.coverage/history.json`)?
2. **Q2: Coverage Degradation Detection** - Do you agree with Option B (Baseline comparison, alert if > 5% decrease)?
3. **Q3: Coverage Exemptions** - Do you agree with Option B (Separate exemption file `docs/coverage-exemptions.md`)?
4. **Q4: Coverage Report Generation** - Do you agree with Option C (Enhanced coverage reports: existing tools + custom analysis)?
5. **Q5: Coverage Gap Prioritization** - Do you agree with Option C (Multi-factor prioritization: coverage + code type + impact)?

---

## Estimated Time

**Implementation:** 2-3 hours
- OPA policy: 0.5 hours (6-8 warnings)
- Automated script: 1-1.5 hours (trend tracking, gap analysis, exemption validation)
- Test suite: 0.5 hours (8-10 test cases)
- Rule file update: 0.5 hours (add audit procedures)
- Documentation: 0.5 hours (completion report)

**Complexity:** LOW-MEDIUM
- Similar to R16 (additional testing requirements)
- Coverage trend tracking adds complexity
- Exemption validation adds complexity

---

## Next Steps

1. **Review Draft:** Read `.cursor/rules/10-quality-R17-DRAFT.md`
2. **Answer Questions:** Provide feedback on 5 review questions
3. **Approve or Request Changes:** Approve draft or request modifications
4. **Implementation:** AI will implement after approval

---

**Status:** AWAITING YOUR REVIEW  
**Prepared By:** AI Assistant  
**Draft Location:** `.cursor/rules/10-quality-R17-DRAFT.md`





