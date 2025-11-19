# REWARD_SCORE Guide

**Last Updated:** 2025-11-19

## Overview

The REWARD_SCORE system automatically evaluates code quality for every Pull Request (PR) in the VeroField repository. Scores range from -10 to +10 and are computed based on multiple factors including tests, bug fixes, documentation, performance, security, and penalties.

## Scoring Categories

### Tests (Weight: 3)
- **New Test Files:** +1 point (max +1)
- **Coverage Increase (>5%):** +1 point
- **Integration/E2E Tests:** +0.5 bonus (rewarded more than unit tests)
- **Test Quality:** +0.5 bonus (assertions, mocking, edge cases)
- **Test Impact:** +0.5 bonus (tests covering critical modules: auth, tenant, security)
- **Maximum:** +3 points (capped at weight)
- **No Coverage:** 0 points

**Note:** The redundant "+1 for tests passing" has been removed (covered by CI penalty system).

### Bug Fixes (Weight: 2)
- **Complete Fix:** +2 points
  - Bug logged in `.cursor/BUG_LOG.md`
  - Error pattern documented in `docs/error-patterns.md`
  - Regression tests added
- **Partial Fix:** +1 point
  - Bug logged or pattern documented, but missing tests
- **Basic Fix:** +0.5 points
  - Bug fix detected but missing documentation

### Documentation (Weight: 0.5)
- **With Engineering Decisions:** +1 point (architectural decisions only, exceeds weight)
- **With Updated Dates:** +0.25 points
- **Basic Updates:** +0.1 points
- **No Documentation Changes:** 0 points
- **Maximum:** +0.5 points for normal documentation (engineering decisions can exceed)

### Performance (Weight: 1)
- **Performance Tests Added:** +1 point
- **Performance Improvements (3+ code changes):** +1 point
- **Performance-Related Changes (1+ code changes):** +0.5 points
- **No Performance Improvements:** 0 points

**Note:** Performance mentions in comments are ignored. Only actual code changes are counted.

### Security (Weight: 4)
- **No Issues:** +1 point
- **Security Improvements:** +1 point (middleware, sanitization, RLS tests, auth checks)
- **Security Documentation:** +1 point (security diagrams, security ADRs)
- **High Severity Issues:** -1 point
- **Critical Issues:** -3 points (blocks PR)
- **Maximum:** +3 points (capped at weight, but can go negative)

## Penalties

### Failing CI (-4 points)
- No test coverage detected
- CI tests failing

### Missing Tests (-2 points)
- Low test coverage (<20%)

### Regression (-3 points)
- Tests failing that previously passed

## Score Interpretation

### High Scores (6-10)
- Excellent code quality
- Comprehensive tests
- Well-documented
- No security issues
- May trigger pattern extraction suggestions

### Medium Scores (3-5)
- Good code quality
- Some tests present
- Basic documentation
- Minor issues may exist

### Low Scores (0-2)
- Acceptable but needs improvement
- Missing tests or documentation
- Minor issues present

### Negative Scores (<0)
- Requires attention
- Missing critical elements
- Security issues or regressions
- Triggers anti-pattern detection

## Decision Rules

### Blocking Threshold
- **Score < -3:** PR is blocked
- **Score -3 to 3:** Requires human review
- **Score ≥ 6:** Suggests pattern extraction

## How to Improve Your Score

1. **Add Tests**
   - Write unit tests for new code
   - Prefer integration tests over unit tests (higher reward)
   - Include assertions, mocking, and edge cases (quality indicators)
   - Test critical modules (auth, tenant, security) for impact bonus
   - Aim for 80%+ coverage
   - Add regression tests for bug fixes

2. **Document Changes**
   - Update relevant documentation
   - Add engineering decisions for significant changes
   - Update "Last Updated" dates

3. **Fix Bugs Properly**
   - Log bugs in `.cursor/BUG_LOG.md`
   - Document error patterns in `docs/error-patterns.md`
   - Add regression tests

4. **Follow Security Best Practices**
   - No hardcoded secrets
   - Proper input validation
   - Use parameterized queries
   - Add security improvements (middleware, sanitization, RLS tests) for bonus points
   - Document security architecture for additional points

5. **Avoid Penalties**
   - Ensure CI passes
   - Maintain test coverage
   - Don't introduce regressions

## Score Normalization (Future Enhancement)

Score normalization is planned as a future enhancement to provide fair scoring across different PR types and sizes:

- **PR Size Normalization:** Adjust scores based on lines/files changed
- **Repository Maturity:** Compare against historical score averages
- **Module Criticality:** Stricter scoring for critical modules (auth, tenant, security)
- **PR Type Normalization:** Different expectations for bug fixes vs. features vs. refactors

Currently, normalization is disabled. The framework exists in `.cursor/scripts/compute_reward_score.py` for future implementation.

## Reference

- **Rubric:** `.cursor/reward_rubric.yaml`
- **Dashboard:** `docs/metrics/dashboard.html`
- **Metrics Data:** `docs/metrics/reward_scores.json`

---

**Note:** REWARD_SCORE is a tool to guide code quality, not a replacement for human review. Always use your judgment when evaluating PRs.

