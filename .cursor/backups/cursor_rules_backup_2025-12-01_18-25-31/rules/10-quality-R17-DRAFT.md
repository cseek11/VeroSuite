# R17: Coverage Requirements — Step 5 Procedures (DRAFT)

**Status:** DRAFT - Awaiting Human Review  
**Created:** 2025-11-23  
**Rule:** R17 - Coverage Requirements  
**Priority:** MEDIUM (Tier 3 - WARNING)  
**MAD Tier:** 3 (WARNING - Logged but doesn't block)

---

## Purpose

R17 ensures that code changes maintain and improve test coverage beyond the basic 80% threshold enforced by R10. R17 focuses on coverage trends, exemptions, reporting, and maintenance.

**Key Requirements:**
- Coverage trends tracked over time (coverage should not degrade)
- Coverage exemptions documented and justified
- Coverage reporting provides visibility (per-file, per-module, per-service)
- Coverage goals set for different code types (critical vs non-critical)
- Coverage maintenance prevents degradation (coverage delta tracking)
- Coverage gaps identified and prioritized

**Relationship to R10:**
- R10 covers: Basic 80% threshold enforcement, coverage delta calculation, test existence
- R17 covers: Coverage trends, exemptions, reporting, goals, maintenance, gap analysis

---

## Step 5: Post-Implementation Audit for Coverage Requirements

### R17: Coverage Requirements — Audit Procedures

**For code changes affecting test coverage, coverage trends, or coverage reporting:**

#### Coverage Trends

- [ ] **MANDATORY:** Verify coverage trend is tracked (coverage over time)
- [ ] **MANDATORY:** Verify coverage trend is non-decreasing (coverage should not degrade)
- [ ] **MANDATORY:** Verify coverage trend is documented (coverage reports, dashboards)
- [ ] **RECOMMENDED:** Verify coverage trend is visible (CI/CD reports, PR comments)
- [ ] **RECOMMENDED:** Verify coverage trend alerts are configured (notifications for degradation)

#### Coverage Exemptions

- [ ] **MANDATORY:** Verify coverage exemptions are documented (if coverage < 80%)
- [ ] **MANDATORY:** Verify coverage exemptions include justification (why exemption is needed)
- [ ] **MANDATORY:** Verify coverage exemptions include remediation plan (how to improve coverage)
- [ ] **MANDATORY:** Verify coverage exemptions include expiration date (when exemption expires)
- [ ] **RECOMMENDED:** Verify coverage exemptions are reviewed periodically (quarterly review)

#### Coverage Reporting

- [ ] **MANDATORY:** Verify coverage reports are generated (per-file, per-module, per-service)
- [ ] **MANDATORY:** Verify coverage reports are accessible (CI/CD artifacts, dashboards)
- [ ] **MANDATORY:** Verify coverage reports include all metrics (statements, branches, functions, lines)
- [ ] **MANDATORY:** Verify coverage reports include coverage delta (new code coverage vs existing)
- [ ] **RECOMMENDED:** Verify coverage reports include trend visualization (coverage over time)
- [ ] **RECOMMENDED:** Verify coverage reports include gap analysis (low-coverage areas identified)

#### Coverage Goals

- [ ] **MANDATORY:** Verify coverage goals are set for critical code (≥ 90% for critical paths)
- [ ] **MANDATORY:** Verify coverage goals are set for non-critical code (≥ 80% baseline)
- [ ] **MANDATORY:** Verify coverage goals are documented (coverage policy, goals document)
- [ ] **RECOMMENDED:** Verify coverage goals are reviewed periodically (quarterly review)
- [ ] **RECOMMENDED:** Verify coverage goals are adjusted based on trends (increase if consistently exceeded)

#### Coverage Maintenance

- [ ] **MANDATORY:** Verify coverage delta is tracked (new code coverage vs existing code)
- [ ] **MANDATORY:** Verify coverage delta is positive (new code adds coverage, doesn't reduce it)
- [ ] **MANDATORY:** Verify coverage degradation is prevented (coverage should not decrease)
- [ ] **MANDATORY:** Verify coverage gaps are identified (low-coverage areas documented)
- [ ] **RECOMMENDED:** Verify coverage gaps are prioritized (critical gaps addressed first)
- [ ] **RECOMMENDED:** Verify coverage gaps have remediation plans (how to improve coverage)

#### Coverage by Code Type

- [ ] **MANDATORY:** Verify critical code has higher coverage (≥ 90% for authentication, payment, PII)
- [ ] **MANDATORY:** Verify non-critical code meets baseline (≥ 80% for utilities, helpers)
- [ ] **MANDATORY:** Verify code type is identified (critical vs non-critical)
- [ ] **RECOMMENDED:** Verify code type classification is documented (coverage policy)
- [ ] **RECOMMENDED:** Verify code type classification is reviewed (when code changes)

#### Coverage Visibility

- [ ] **MANDATORY:** Verify coverage is visible in PRs (coverage delta in PR comments)
- [ ] **MANDATORY:** Verify coverage is visible in CI/CD (coverage reports in artifacts)
- [ ] **MANDATORY:** Verify coverage is visible in dashboards (coverage trends, metrics)
- [ ] **RECOMMENDED:** Verify coverage is visible in code review (coverage badges, indicators)
- [ ] **RECOMMENDED:** Verify coverage is visible in documentation (coverage reports linked)

#### Automated Checks

```bash
# Run coverage requirements checker
python .cursor/scripts/check-coverage-requirements.py --file <file_path>

# Check coverage trends
python .cursor/scripts/check-coverage-requirements.py --trends

# Check coverage exemptions
python .cursor/scripts/check-coverage-requirements.py --exemptions

# Check coverage gaps
python .cursor/scripts/check-coverage-requirements.py --gaps

# Expected: Warnings for coverage issues (does not block)
```

#### OPA Policy

- **Policy:** `services/opa/policies/quality.rego` (R17 section)
- **Enforcement:** WARNING (Tier 3 MAD) - Logged but doesn't block
- **Tests:** `services/opa/tests/quality_r17_test.rego`

#### Manual Verification (When Needed)

1. **Review Coverage Reports** - Check coverage metrics and trends
2. **Verify Coverage Goals** - Ensure goals are set and met
3. **Check Coverage Exemptions** - Verify exemptions are documented and justified
4. **Identify Coverage Gaps** - Find low-coverage areas and prioritize improvements

**Example Coverage Degradation (❌):**

```typescript
// ❌ VIOLATION: Coverage degraded from 85% to 75%
// Before: users.service.ts had 85% coverage
// After: users.service.ts has 75% coverage (degraded by 10%)
// → Coverage trend is decreasing, should be prevented
```

**Example Coverage Trend Tracking (✅):**

```markdown
## Coverage Trends

### users.service.ts
- 2025-11-01: 80% (baseline)
- 2025-11-15: 82% (+2%)
- 2025-11-23: 85% (+3%)
- **Trend:** Increasing ✅

### orders.service.ts
- 2025-11-01: 90% (baseline)
- 2025-11-15: 88% (-2%)
- 2025-11-23: 87% (-1%)
- **Trend:** Decreasing ❌ (needs attention)
```

**Example Coverage Exemption (✅):**

```markdown
## Coverage Exemptions

### File: legacy-migration-helper.ts
**Coverage:** 45% (below 80% threshold)
**Justification:** Legacy migration code, will be removed in Q2 2026
**Remediation Plan:** Remove legacy code in Q2 2026 migration
**Expiration Date:** 2026-06-30
**Status:** Active
**Review Date:** 2026-01-15
```

**Example Coverage Goals (✅):**

```markdown
## Coverage Goals

### Critical Code (≥ 90%)
- Authentication: 95% (current: 92%)
- Payment Processing: 95% (current: 94%)
- PII Handling: 95% (current: 91%)

### Non-Critical Code (≥ 80%)
- Utilities: 80% (current: 82%)
- Helpers: 80% (current: 85%)
- Legacy Code: 60% (exempted, removal planned)
```

**Example Coverage Gap Analysis (✅):**

```markdown
## Coverage Gaps

### High Priority (Critical Code)
1. **auth.service.ts** - 88% (target: 90%)
   - Missing: Error path tests for token refresh
   - Impact: High (authentication critical)
   - Remediation: Add error path tests (estimated: 2 hours)

2. **payment.service.ts** - 89% (target: 90%)
   - Missing: Edge case tests for refund processing
   - Impact: High (payment critical)
   - Remediation: Add edge case tests (estimated: 3 hours)

### Medium Priority (Non-Critical Code)
3. **utils/date-helpers.ts** - 75% (target: 80%)
   - Missing: Boundary condition tests
   - Impact: Medium (utility function)
   - Remediation: Add boundary tests (estimated: 1 hour)
```

---

**Last Updated:** 2025-11-23  
**Maintained By:** QA Team  
**Review Frequency:** Quarterly or when coverage requirements change





