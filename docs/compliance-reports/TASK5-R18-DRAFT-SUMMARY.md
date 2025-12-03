# R18: Performance Budgets — Draft Summary

**Date:** 2025-11-23  
**Rule:** R18 - Performance Budgets  
**Tier:** 3 (WARNING-level enforcement)  
**Status:** DRAFT - Awaiting Review  
**Estimated Time:** 3-4 hours

---

## Overview

R18 ensures that code changes maintain performance budgets for API response times and frontend performance metrics. R18 focuses on performance regression detection, exemption management, reporting, and prioritization.

**Key Focus Areas:**
- API response time budgets (Simple GET < 200ms, POST/PUT < 300ms, Heavy < 500ms)
- Frontend performance budgets (FCP < 1.5s, LCP < 2s, TTI < 3s)
- Performance regression detection (baseline comparison, > 10% increase alert)
- Performance exemptions (documentation, justification, remediation, expiration)
- Performance reporting (per-endpoint, per-page visibility, trend visualization)
- Performance prioritization (critical endpoints first, multi-factor prioritization)
- Performance trend tracking (git-based storage, performance history)

---

## Relationship to R10

**R10 Covers:**
- Basic performance budgets (mentioned in PERFORMANCE BUDGETS section)
- Performance budget thresholds (API: < 200ms/300ms/500ms, Frontend: < 1.5s/2s/3s)
- Anti-performance patterns (N+1 queries, redundant API calls, missing indexes)

**R18 Covers:**
- Performance regression detection (comparing against baseline)
- Performance exemptions (documentation, justification, expiration)
- Performance reporting (comprehensive visibility and analysis)
- Performance prioritization (critical endpoints first, multi-factor prioritization)
- Performance trend tracking (performance history, trend visualization)
- Performance budget visibility (PR comments, dashboards, reports)

**Rationale:** R10 provides baseline performance budget thresholds. R18 ensures performance is maintained, monitored, and improved over time with regression detection, exemptions, reporting, and prioritization.

---

## Draft Structure

### Audit Checklist Categories (8 categories, 45+ items)

1. **API Response Time Budgets** (7 items: 5 MANDATORY, 2 RECOMMENDED)
   - Budget thresholds (GET < 200ms, POST/PUT < 300ms, Heavy < 500ms)
   - Median (p50) measurement, p95/p99 tracking, per-endpoint documentation

2. **Frontend Performance Budgets** (7 items: 5 MANDATORY, 2 RECOMMENDED)
   - Budget thresholds (FCP < 1.5s, LCP < 2s, TTI < 3s)
   - RUM/synthetic measurement, CLS/FID tracking

3. **Performance Regression Detection** (6 items: 4 MANDATORY, 2 RECOMMENDED)
   - Baseline comparison, regression detection (> 10% increase), alerts, trend tracking

4. **Performance Exemptions** (6 items: 5 MANDATORY, 1 RECOMMENDED)
   - Documentation, justification, remediation plan, expiration date, current performance, periodic review

5. **Performance Reporting** (7 items: 5 MANDATORY, 2 RECOMMENDED)
   - Report generation, accessibility, metrics, budget comparison, regression detection, trend visualization, health score

6. **Performance Prioritization** (6 items: 4 MANDATORY, 2 RECOMMENDED)
   - Critical endpoint identification, priority levels, impact assessment, effort estimation, quick wins

7. **Performance Trend Tracking** (6 items: 4 MANDATORY, 2 RECOMMENDED)
   - Performance history storage, trend tracking, non-degrading trends, pruning, visualization

8. **Performance Budget Visibility** (5 items: 3 MANDATORY, 2 RECOMMENDED)
   - PR comments, CI/CD artifacts, dashboards, code review indicators, documentation links

**Total:** 45+ checklist items (mix of MANDATORY, RECOMMENDED)

---

## Key Decisions Required

### Q1: How should we collect performance metrics?

**Option A:** Collect from CI/CD test runs (synthetic metrics)
- **Pros:** Consistent, repeatable, automated
- **Cons:** May not reflect real user experience, requires test infrastructure

**Option B:** Collect from runtime monitoring (production metrics)
- **Pros:** Real user metrics, accurate performance data
- **Cons:** Requires monitoring infrastructure, may have noise

**Option C:** Hybrid approach (CI/CD synthetic + runtime monitoring)
- **Pros:** Best of both worlds, comprehensive coverage
- **Cons:** More complex, requires both infrastructures

**Recommendation:** Option C (Hybrid approach)
- Use CI/CD synthetic tests for regression detection (consistent baseline)
- Use runtime monitoring for production performance (real user metrics)
- Store both in performance history (`.performance/history.json`)
- Benefits: Comprehensive coverage, regression detection + real user insights

---

### Q2: How should we detect performance regressions?

**Option A:** Compare current performance to previous commit
- **Pros:** Simple, immediate feedback
- **Cons:** May miss gradual degradation, noisy from commit-to-commit fluctuations

**Option B:** Compare current performance to baseline (last release)
- **Pros:** Catches gradual degradation, stable baseline
- **Cons:** May miss recent degradation

**Option C:** Compare current performance to trend (moving average)
- **Pros:** Catches gradual degradation, accounts for fluctuations
- **Cons:** More complex, requires trend calculation

**Recommendation:** Option B (Baseline comparison) with enhancements
- Compare current performance to baseline (last release or last month)
- Alert if performance degrades by > 10% from baseline
- Track performance trends over time (moving average for visualization)
- Benefits: Stable baseline, catches gradual degradation, actionable alerts

---

### Q3: How should we handle performance exemptions?

**Option A:** Inline comments in code (`// @performance-exempt`)
- **Pros:** Simple, co-located with code
- **Cons:** No structured data, hard to track

**Option B:** Separate exemption file (`docs/performance-exemptions.md`)
- **Pros:** Structured data, easy to track, reviewable
- **Cons:** Separate from code, may get out of sync

**Option C:** Hybrid approach (inline marker + exemption file)
- **Pros:** Co-located marker + structured documentation
- **Cons:** Requires both to be maintained

**Recommendation:** Option B (Separate exemption file)
- File: `docs/performance-exemptions.md`
- Format: Markdown table with endpoint/page, current performance, budget, justification, expiration, remediation, status
- Benefits: Structured, reviewable, trackable, can be validated automatically

---

### Q4: How should we generate performance reports?

**Option A:** Use existing performance tools (Lighthouse, WebPageTest, API monitoring)
- **Pros:** Uses existing infrastructure, no additional setup
- **Cons:** May not include all required metrics (trends, exemptions, prioritization)

**Option B:** Custom performance report generator
- **Pros:** Includes all required metrics, customizable
- **Cons:** Requires custom development, maintenance

**Option C:** Enhanced performance reports (existing tools + custom analysis)
- **Pros:** Uses existing tools + adds custom analysis
- **Cons:** Requires integration work

**Recommendation:** Option C (Enhanced performance reports)
- Use existing tools (Lighthouse for frontend, API monitoring for backend) as base
- Add custom analysis script for trends, exemptions, prioritization
- Generate enhanced report: `performance-enhanced.json` + `performance-report.html`
- Benefits: Leverages existing tools + adds required metrics (trends, exemptions, health score)

---

### Q5: How should we prioritize performance issues?

**Option A:** Simple threshold (endpoints/pages exceeding budget are issues)
- **Pros:** Simple, clear criteria
- **Cons:** Doesn't prioritize by importance

**Option B:** Weighted by endpoint type (critical endpoints prioritized)
- **Pros:** Prioritizes important endpoints, actionable
- **Cons:** Requires endpoint classification

**Option C:** Multi-factor prioritization (budget violation + endpoint criticality + user impact)
- **Pros:** Most accurate prioritization, actionable
- **Cons:** More complex, requires multiple inputs

**Recommendation:** Option C (Multi-factor prioritization)
- Factors:
  - Budget violation severity (40%): How far above budget
  - Endpoint criticality (30%): Critical (auth, payment) vs non-critical
  - User impact (30%): High traffic, user-facing vs admin-only
- Priority: Critical endpoint + high violation + high impact = HIGH
- Benefits: Actionable prioritization, focuses on high-impact issues

---

## Implementation Approach

### Detection Strategy
1. **Performance Metrics Collection:** Collect from CI/CD (synthetic) and runtime monitoring (production)
2. **Performance Regression Detection:** Compare current to baseline, alert if > 10% increase
3. **Performance Exemptions:** Parse exemption file, validate expiration dates
4. **Performance Issues:** Identify endpoints/pages exceeding budgets, prioritize by multi-factor

### Validation Strategy
1. **Budget Validation:** Verify performance meets budget thresholds
2. **Regression Validation:** Verify performance is not degrading (> 10% increase)
3. **Exemption Validation:** Verify exemptions are documented, justified, not expired
4. **Issue Validation:** Verify issues are identified and prioritized

### Enforcement Strategy
1. **WARNING-level:** Log violations but don't block PRs
2. **Context-aware:** Only warn for applicable requirements (API endpoints, frontend pages)
3. **Clear messages:** Provide specific guidance on performance issues

---

## Examples Provided

### ✅ Correct Patterns
- API endpoint meeting performance budget (optimized query)
- Frontend page meeting performance budget (code splitting, lazy loading)
- Performance trend tracking (improving over time)
- Performance exemption (documented, justified, with expiration)
- Performance issue prioritization (multi-factor, actionable)

### ❌ Violation Patterns
- API endpoint exceeding performance budget (slow query)
- Frontend page exceeding performance budget (heavy bundle, no lazy loading)
- Performance regression (degrading trend)
- Missing performance exemption (budget exceeded without exemption)
- Missing performance prioritization (issues not prioritized)

---

## Review Questions

1. **Q1: Performance Metric Collection** - Do you agree with Option C (Hybrid approach: CI/CD synthetic + runtime monitoring)?
2. **Q2: Performance Regression Detection** - Do you agree with Option B (Baseline comparison, alert if > 10% increase)?
3. **Q3: Performance Exemptions** - Do you agree with Option B (Separate exemption file `docs/performance-exemptions.md`)?
4. **Q4: Performance Report Generation** - Do you agree with Option C (Enhanced performance reports: existing tools + custom analysis)?
5. **Q5: Performance Issue Prioritization** - Do you agree with Option C (Multi-factor prioritization: budget violation + endpoint criticality + user impact)?

---

## Estimated Time

**Implementation:** 3-4 hours
- OPA policy: 0.5 hours (8-10 warnings)
- Automated script: 1.5-2 hours (metric collection, regression detection, exemption validation, prioritization)
- Test suite: 0.5 hours (12-15 test cases)
- Rule file update: 0.5 hours (add audit procedures)
- Documentation: 0.5 hours (completion report)

**Complexity:** MEDIUM
- Similar to R17 (coverage requirements)
- Performance metric collection adds complexity (CI/CD + runtime monitoring)
- Regression detection adds complexity (baseline comparison)
- Multi-factor prioritization adds complexity

---

## Next Steps

1. **Review Draft:** Read `.cursor/rules/10-quality-R18-DRAFT.md`
2. **Answer Questions:** Provide feedback on 5 review questions
3. **Approve or Request Changes:** Approve draft or request modifications
4. **Implementation:** AI will implement after approval

---

**Status:** AWAITING YOUR REVIEW  
**Prepared By:** AI Assistant  
**Draft Location:** `.cursor/rules/10-quality-R18-DRAFT.md`





