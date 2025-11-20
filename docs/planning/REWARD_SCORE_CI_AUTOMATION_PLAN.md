# REWARD_SCORE CI Automation Implementation Plan

**Date:** 2025-11-17  
**Status:** Planning  
**Priority:** HIGH

---

## Executive Summary

This plan outlines the complete implementation of CI automation for the REWARD_SCORE system. The system will automatically compute reward scores for every PR, post comments, collect metrics, and enable dashboard visualization.

**Current State:**
- ✅ Basic workflow structure exists (`swarm_compute_reward_score.yml`)
- ✅ Script skeleton exists (`compute_reward_score.py`)
- ✅ Rubric defined (`.cursor/reward_rubric.yaml`)
- ✅ Template exists (`.cursor/ci/reward_score_comment_template.md`)
- ❌ Script has placeholder logic (not implemented)
- ❌ Only handles backend tests (missing frontend)
- ❌ No integration with main CI workflow
- ❌ No artifact uploads
- ❌ No metrics collection
- ❌ No dashboard

**Target State:**
- ✅ Fully automated score computation
- ✅ Multi-language support (frontend + backend)
- ✅ PR comments with formatted output
- ✅ Artifact uploads for historical tracking
- ✅ Metrics collection and storage
- ✅ Dashboard visualization

---

## Phase 1: Core Score Computation (Week 1)

### 1.1 Enhance `compute_reward_score.py` Script

**Tasks:**
1. **Load and parse rubric** (`reward_rubric.yaml`)
   - Parse YAML weights and penalties
   - Validate rubric structure

2. **Implement test scoring logic**
   - **Frontend (Vitest):**
     - Parse `frontend/coverage/coverage-final.json`
     - Check for new test files in PR diff
     - Award points based on:
       - New tests added: +1 per test file
       - Coverage increase: +1 if >5% increase
       - All tests passing: +1
   - **Backend (Pytest):**
     - Parse pytest JSON report
     - Check for new test files
     - Award points similarly
   - **Maximum:** +3 points (per rubric)

3. **Implement bug fix detection**
   - Parse PR description for bug fix keywords
   - Check if bug is logged in `.cursor/BUG_LOG.md`
   - Check if error pattern documented in `docs/error-patterns.md`
   - Check if regression tests exist
   - Award: +2 if all conditions met

4. **Implement documentation scoring**
   - Check for changes in `docs/` directory
   - Check for engineering decisions in `docs/engineering-decisions.md`
   - Check for updated "Last Updated" dates
   - Award: +1 if significant docs updated

5. **Implement performance scoring**
   - Check for performance-related changes
   - Check for performance test additions
   - Award: +1 if performance improvements

6. **Implement security scoring**
   - Parse Semgrep output for security issues
   - Check for security fixes in PR
   - Award: +2 if security improvements
   - **Penalty:** Auto set score ≤ -3 if critical security issue found

7. **Implement penalties**
   - **Failing CI:** -4 (if tests fail)
   - **Missing tests:** -2 (if code changed but no tests)
   - **Regression:** -3 (if existing tests fail)

8. **Generate formatted comment**
   - Use template from `.cursor/ci/reward_score_comment_template.md`
   - Replace placeholders with actual values
   - Include links to coverage and static analysis artifacts

**Deliverables:**
- ✅ Fully functional `compute_reward_score.py`
- ✅ Unit tests for scoring logic
- ✅ Documentation for scoring algorithm

**Files to Modify:**
- `.cursor/scripts/compute_reward_score.py`

---

### 1.2 Update Workflow for Multi-Language Support

**Tasks:**
1. **Add frontend test execution**
   - Run Vitest with coverage
   - Generate coverage JSON
   - Parse coverage report

2. **Add backend test execution** (if exists)
   - Run pytest with coverage
   - Generate coverage JSON

3. **Add static analysis**
   - Run Semgrep for security
   - Run ESLint/TypeScript checks
   - Collect results

4. **Integrate with main CI workflow**
   - Trigger after tests complete
   - Use artifacts from main CI
   - Avoid duplicate test runs

**Deliverables:**
- ✅ Updated `swarm_compute_reward_score.yml`
- ✅ Integration with `ci.yml`
- ✅ Artifact passing between jobs

**Files to Modify:**
- `.github/workflows/swarm_compute_reward_score.yml`
- `.github/workflows/ci.yml` (add artifact uploads)

---

## Phase 2: PR Integration & Comments (Week 1-2)

### 2.1 PR Comment Posting

**Tasks:**
1. **Format comment using template**
   - Load template from `.cursor/ci/reward_score_comment_template.md`
   - Replace all placeholders
   - Format breakdown nicely

2. **Post comment to PR**
   - Use GitHub CLI or API
   - Update existing comment if present
   - Handle errors gracefully

3. **Add decision logic**
   - **BLOCK:** Score < -3 + failing tests/security issues
   - **REQUEST_CHANGES:** Score -3 to 3
   - **APPROVE:** Score > 3 (with human review still required)

4. **Add artifact links**
   - Link to coverage reports
   - Link to static analysis results
   - Link to test results

**Deliverables:**
- ✅ Automated PR comments
- ✅ Decision recommendations
- ✅ Artifact links

**Files to Modify:**
- `.cursor/scripts/compute_reward_score.py`
- `.github/workflows/swarm_compute_reward_score.yml`

---

### 2.2 Artifact Management

**Tasks:**
1. **Upload reward.json artifact**
   - Store in GitHub Actions artifacts
   - Include breakdown JSON
   - Include comment body

2. **Upload coverage artifacts**
   - Frontend coverage JSON
   - Backend coverage JSON
   - Make accessible for dashboard

3. **Upload static analysis artifacts**
   - Semgrep results
   - Linting results
   - TypeScript errors

**Deliverables:**
- ✅ All artifacts uploaded
- ✅ Artifact retention policy
- ✅ Download links in PR comments

**Files to Modify:**
- `.github/workflows/swarm_compute_reward_score.yml`

---

## Phase 3: Metrics Collection & Storage (Week 2)

### 3.1 Metrics Collection

**Tasks:**
1. **Collect score data**
   - PR number
   - Score and breakdown
   - Timestamp
   - Author
   - Files changed
   - Test coverage delta

2. **Store metrics**
   - Option A: GitHub Actions artifacts (simple)
   - Option B: Database (PostgreSQL/Supabase)
   - Option C: JSON file in repo (git-based)
   - **Recommendation:** Start with Option A, migrate to B later

3. **Aggregate metrics**
   - Average score over time
   - Score distribution
   - Category breakdowns
   - Trend analysis

**Deliverables:**
- ✅ Metrics collection script
- ✅ Storage solution
- ✅ Aggregation logic

**Files to Create:**
- `.cursor/scripts/collect_metrics.py`
- `docs/metrics/reward_scores.json` (if using git-based storage)

---

### 3.2 Historical Tracking

**Tasks:**
1. **Track score history**
   - Store scores per PR
   - Track score changes over time
   - Identify trends

2. **Track category performance**
   - Which categories score highest?
   - Which need improvement?
   - Pattern analysis

3. **Track anti-patterns**
   - Low scores (≤ 0)
   - Recurring issues
   - Common penalties

**Deliverables:**
- ✅ Historical data structure
- ✅ Query/analysis scripts
- ✅ Trend reports

**Files to Create:**
- `.cursor/scripts/analyze_metrics.py`

---

## Phase 4: Dashboard Implementation (Week 2-3)

### 4.1 Simple HTML Dashboard (MVP)

**Tasks:**
1. **Create static HTML dashboard**
   - Read from metrics JSON
   - Display score distribution
   - Show trends over time
   - Category breakdowns

2. **Add charts**
   - Use Chart.js or similar
   - Score distribution histogram
   - Trend line chart
   - Category pie chart

3. **Add filters**
   - Date range
   - Author
   - Category
   - Score range

**Deliverables:**
- ✅ Static HTML dashboard
- ✅ Charts and visualizations
- ✅ Basic filtering

**Files to Create:**
- `docs/metrics/dashboard.html`
- `docs/metrics/dashboard.js`
- `docs/metrics/dashboard.css`

---

### 4.2 Enhanced Dashboard (Future)

**Tasks:**
1. **Add React-based dashboard** (if needed)
   - More interactive
   - Real-time updates
   - Better UX

2. **Add advanced analytics**
   - Pattern adoption rates
   - Anti-pattern recurrence
   - Agent human-edit rates

3. **Add alerts**
   - Low score notifications
   - Trend warnings
   - Quality gates

**Deliverables:**
- ✅ Enhanced dashboard
- ✅ Advanced analytics
- ✅ Alert system

**Files to Create:**
- `frontend/src/components/metrics/RewardScoreDashboard.tsx` (if React)

---

## Phase 5: Integration & Testing (Week 3)

### 5.1 Integration Testing

**Tasks:**
1. **Test score computation**
   - Test with various PR scenarios
   - Verify scoring logic
   - Check edge cases

2. **Test workflow**
   - Test on real PRs
   - Verify artifact uploads
   - Verify comment posting

3. **Test metrics collection**
   - Verify data collection
   - Verify storage
   - Verify aggregation

**Deliverables:**
- ✅ Test suite for scoring
- ✅ Integration tests
- ✅ Test documentation

**Files to Create:**
- `.cursor/scripts/tests/test_compute_reward_score.py`

---

### 5.2 Documentation

**Tasks:**
1. **Document scoring algorithm**
   - How scores are calculated
   - What each category means
   - How to improve scores

2. **Document workflow**
   - How CI automation works
   - How to interpret scores
   - How to use dashboard

3. **Document metrics**
   - What metrics are collected
   - How to access metrics
   - How to interpret trends

**Deliverables:**
- ✅ Scoring algorithm documentation
- ✅ Workflow documentation
- ✅ Metrics documentation

**Files to Create:**
- `docs/metrics/REWARD_SCORE_GUIDE.md`
- `docs/metrics/DASHBOARD_GUIDE.md`

---

## Implementation Checklist

### Phase 1: Core Score Computation
- [ ] Implement rubric loading and parsing
- [ ] Implement frontend test scoring
- [ ] Implement backend test scoring
- [ ] Implement bug fix detection
- [ ] Implement documentation scoring
- [ ] Implement performance scoring
- [ ] Implement security scoring
- [ ] Implement penalties
- [ ] Implement comment generation
- [ ] Write unit tests
- [ ] Update workflow for multi-language

### Phase 2: PR Integration
- [ ] Implement template loading
- [ ] Implement comment posting
- [ ] Implement decision logic
- [ ] Add artifact links
- [ ] Upload reward.json artifact
- [ ] Upload coverage artifacts
- [ ] Upload static analysis artifacts

### Phase 3: Metrics Collection
- [ ] Implement metrics collection
- [ ] Implement storage solution
- [ ] Implement aggregation
- [ ] Implement historical tracking
- [ ] Create analysis scripts

### Phase 4: Dashboard
- [ ] Create HTML dashboard
- [ ] Add charts
- [ ] Add filters
- [ ] Test dashboard
- [ ] Deploy dashboard (if needed)

### Phase 5: Integration & Testing
- [ ] Write integration tests
- [ ] Test on real PRs
- [ ] Document scoring algorithm
- [ ] Document workflow
- [ ] Document metrics

---

## Technical Requirements

### Dependencies
- Python 3.x
- GitHub Actions
- GitHub CLI (`gh`)
- YAML parser (PyYAML)
- JSON parser (built-in)
- Chart.js (for dashboard)

### Environment Variables
- `GITHUB_TOKEN` (for PR comments)
- `PR_NUMBER` (from GitHub Actions)

### File Structure
```
.cursor/
  scripts/
    compute_reward_score.py (enhanced)
    collect_metrics.py (new)
    analyze_metrics.py (new)
    tests/
      test_compute_reward_score.py (new)
  ci/
    reward_score_comment_template.md (existing)
  reward_rubric.yaml (existing)

.github/
  workflows/
    swarm_compute_reward_score.yml (enhanced)
    ci.yml (enhanced - add artifacts)

docs/
  metrics/
    reward_scores.json (new - git-based storage)
    dashboard.html (new)
    dashboard.js (new)
    dashboard.css (new)
    REWARD_SCORE_GUIDE.md (new)
    DASHBOARD_GUIDE.md (new)
```

---

## Success Criteria

1. **Automation:**
   - ✅ Every PR automatically gets a score
   - ✅ Comments posted within 5 minutes of PR creation
   - ✅ Artifacts uploaded and accessible

2. **Accuracy:**
   - ✅ Scores match manual calculations
   - ✅ All rubric categories properly evaluated
   - ✅ Penalties correctly applied

3. **Reliability:**
   - ✅ Workflow runs successfully 95%+ of the time
   - ✅ Errors handled gracefully
   - ✅ Fallback to manual scoring if needed

4. **Usability:**
   - ✅ Dashboard accessible and functional
   - ✅ Metrics easy to understand
   - ✅ Documentation complete

---

## Risks & Mitigations

### Risk 1: Scoring Logic Complexity
- **Risk:** Scoring logic may be too complex or inaccurate
- **Mitigation:** Start simple, iterate based on feedback, extensive testing

### Risk 2: Performance Impact
- **Risk:** Score computation may slow down CI
- **Mitigation:** Run in parallel, cache results, optimize script

### Risk 3: False Positives/Negatives
- **Risk:** Scores may not reflect actual code quality
- **Mitigation:** Human review still required, scores are guidance only

### Risk 4: Maintenance Burden
- **Risk:** System requires ongoing maintenance
- **Mitigation:** Well-documented, automated where possible, clear ownership

---

## Timeline

- **Week 1:** Phase 1 & 2 (Core computation + PR integration)
- **Week 2:** Phase 3 & 4 (Metrics + Dashboard MVP)
- **Week 3:** Phase 5 (Testing + Documentation)

**Total:** 3 weeks for full implementation

---

## Next Steps

1. **Review and approve plan**
2. **Assign ownership**
3. **Start Phase 1 implementation**
4. **Set up test PRs for validation**
5. **Iterate based on feedback**

---

**Last Updated:** 2025-11-17











