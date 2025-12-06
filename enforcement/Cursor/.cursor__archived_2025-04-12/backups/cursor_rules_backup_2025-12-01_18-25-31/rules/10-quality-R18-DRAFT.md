# R18: Performance Budgets — Step 5 Procedures (DRAFT)

**Status:** DRAFT - Awaiting Human Review  
**Created:** 2025-12-04  
**Rule:** R18 - Performance Budgets  
**Priority:** MEDIUM (Tier 3 - WARNING)  
**MAD Tier:** 3 (WARNING - Logged but doesn't block)

---

## Purpose

R18 ensures that code changes maintain performance budgets for API response times and frontend performance metrics. R18 focuses on performance regression detection, exemption management, reporting, and prioritization.

**Key Requirements:**
- API response time budgets enforced (Simple GET < 200ms, POST/PUT < 300ms, Heavy < 500ms)
- Frontend performance budgets enforced (FCP < 1.5s, LCP < 2s, TTI < 3s)
- Performance regressions detected (comparing against baseline)
- Performance exemptions documented and justified
- Performance reporting provides visibility (per-endpoint, per-page)
- Performance issues prioritized (critical endpoints first)

**Relationship to R10:**
- R10 covers: Basic performance budgets (mentioned in PERFORMANCE BUDGETS section)
- R18 covers: Performance regression detection, exemptions, reporting, prioritization, trend tracking

---

## Step 5: Post-Implementation Audit for Performance Budgets

### R18: Performance Budgets — Audit Procedures

**For code changes affecting API endpoints, frontend pages, or performance-critical operations:**

#### API Response Time Budgets

- [ ] **MANDATORY:** Verify API response times meet budget thresholds
- [ ] **MANDATORY:** Verify simple GET endpoints have median response time < 200ms
- [ ] **MANDATORY:** Verify typical POST/PUT endpoints have median response time < 300ms
- [ ] **MANDATORY:** Verify heavy operations have median response time < 500ms with justification
- [ ] **MANDATORY:** Verify performance budgets are measured using median (p50) metric
- [ ] **RECOMMENDED:** Verify p95 and p99 percentiles are tracked (for outlier detection)
- [ ] **RECOMMENDED:** Verify performance budgets are documented per endpoint

#### Frontend Performance Budgets

- [ ] **MANDATORY:** Verify frontend performance metrics meet budget thresholds
- [ ] **MANDATORY:** Verify First Contentful Paint (FCP) < 1.5s for main pages
- [ ] **MANDATORY:** Verify Largest Contentful Paint (LCP) < 2s for main pages
- [ ] **MANDATORY:** Verify Time to Interactive (TTI) < 3s for main user flows
- [ ] **MANDATORY:** Verify performance budgets are measured using real user metrics (RUM) or synthetic tests
- [ ] **RECOMMENDED:** Verify Cumulative Layout Shift (CLS) < 0.1 for main pages
- [ ] **RECOMMENDED:** Verify First Input Delay (FID) < 100ms for interactive elements

#### Performance Regression Detection

- [ ] **MANDATORY:** Verify performance regression detection is implemented (baseline comparison)
- [ ] **MANDATORY:** Verify performance baseline is established (last release, last month, or custom)
- [ ] **MANDATORY:** Verify performance regressions are detected (> 10% increase in response time)
- [ ] **MANDATORY:** Verify performance regressions are alerted (warnings, notifications)
- [ ] **RECOMMENDED:** Verify performance trends are tracked over time (performance history)
- [ ] **RECOMMENDED:** Verify performance regression alerts include context (endpoint, metric, change)

#### Performance Exemptions

- [ ] **MANDATORY:** Verify performance exemptions are documented (if budget exceeded)
- [ ] **MANDATORY:** Verify performance exemptions include justification (why exemption is needed)
- [ ] **MANDATORY:** Verify performance exemptions include remediation plan (how to improve performance)
- [ ] **MANDATORY:** Verify performance exemptions include expiration date (when exemption expires)
- [ ] **MANDATORY:** Verify performance exemptions include current performance (actual vs budget)
- [ ] **RECOMMENDED:** Verify performance exemptions are reviewed periodically (quarterly review)

#### Performance Reporting

- [ ] **MANDATORY:** Verify performance reports are generated (per-endpoint, per-page)
- [ ] **MANDATORY:** Verify performance reports are accessible (CI/CD artifacts, dashboards)
- [ ] **MANDATORY:** Verify performance reports include all metrics (p50, p95, p99 for API, FCP/LCP/TTI for frontend)
- [ ] **MANDATORY:** Verify performance reports include budget comparison (actual vs budget)
- [ ] **MANDATORY:** Verify performance reports include regression detection (performance trends)
- [ ] **RECOMMENDED:** Verify performance reports include trend visualization (performance over time)
- [ ] **RECOMMENDED:** Verify performance reports include health score (overall performance health)

#### Performance Prioritization

- [ ] **MANDATORY:** Verify performance issues are prioritized (critical endpoints first)
- [ ] **MANDATORY:** Verify critical endpoints are identified (authentication, payment, core workflows)
- [ ] **MANDATORY:** Verify performance issues include priority level (HIGH/MEDIUM/LOW)
- [ ] **MANDATORY:** Verify performance issues include impact assessment (user impact, business impact)
- [ ] **RECOMMENDED:** Verify performance issues include effort estimation (time to fix)
- [ ] **RECOMMENDED:** Verify performance issues include quick wins identification (high-impact, low-effort)

#### Performance Trend Tracking

- [ ] **MANDATORY:** Verify performance trends are tracked over time (performance history)
- [ ] **MANDATORY:** Verify performance history is stored (git-based storage in `.performance/history.json`)
- [ ] **MANDATORY:** Verify performance history includes endpoint/page, date, metrics
- [ ] **MANDATORY:** Verify performance trends are non-degrading (performance should not degrade)
- [ ] **RECOMMENDED:** Verify performance history is pruned (keep last 365 days)
- [ ] **RECOMMENDED:** Verify performance trends are visualized (trend charts, graphs)

#### Performance Budget Visibility

- [ ] **MANDATORY:** Verify performance budgets are visible in PRs (performance delta in PR comments)
- [ ] **MANDATORY:** Verify performance budgets are visible in CI/CD (performance reports in artifacts)
- [ ] **MANDATORY:** Verify performance budgets are visible in dashboards (performance trends, metrics)
- [ ] **RECOMMENDED:** Verify performance budgets are visible in code review (performance badges, indicators)
- [ ] **RECOMMENDED:** Verify performance budgets are visible in documentation (performance reports linked)

#### Automated Checks

```bash
# Run performance budgets checker
python .cursor/scripts/check-performance-budgets.py --file <file_path>

# Check API performance budgets
python .cursor/scripts/check-performance-budgets.py --api

# Check frontend performance budgets
python .cursor/scripts/check-performance-budgets.py --frontend

# Check performance trends
python .cursor/scripts/check-performance-budgets.py --trends

# Check performance exemptions
python .cursor/scripts/check-performance-budgets.py --exemptions

# Check all performance requirements
python .cursor/scripts/check-performance-budgets.py --all

# Update performance history
python .cursor/scripts/check-performance-budgets.py --update-trends

# Generate enhanced performance report
python .cursor/scripts/check-performance-budgets.py --generate-report

# Expected: Warnings for performance issues (does not block)
```

#### OPA Policy

- **Policy:** `services/opa/policies/quality.rego` (R18 section)
- **Enforcement:** WARNING (Tier 3 MAD) - Logged but doesn't block
- **Tests:** `services/opa/tests/quality_r18_test.rego`

#### Manual Verification (When Needed)

1. **Review Performance Metrics** - Check API response times and frontend metrics
2. **Verify Performance Budgets** - Ensure budgets are met or exemptions documented
3. **Check Performance Trends** - Verify performance is not degrading over time
4. **Identify Performance Issues** - Find performance bottlenecks and prioritize improvements

**Example API Performance Budget Violation (❌):**

```typescript
// ❌ VIOLATION: API endpoint exceeds performance budget
// GET /api/users
// Budget: < 200ms (simple GET)
// Actual: 350ms (median)
// → Performance budget exceeded by 75%

@Get('/users')
async getUsers() {
  // Slow query without optimization
  return this.prisma.user.findMany({
    include: { orders: { include: { items: true } } }
  });
}
```

**Example API Performance Budget Compliance (✅):**

```typescript
// ✅ CORRECT: API endpoint meets performance budget
// GET /api/users
// Budget: < 200ms (simple GET)
// Actual: 150ms (median)
// → Performance budget met

@Get('/users')
async getUsers() {
  // Optimized query with selective fields
  return this.prisma.user.findMany({
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true
    }
  });
}
```

**Example Frontend Performance Budget Violation (❌):**

```typescript
// ❌ VIOLATION: Frontend page exceeds performance budget
// Page: /dashboard
// Budget: FCP < 1.5s, LCP < 2s, TTI < 3s
// Actual: FCP 2.1s, LCP 3.5s, TTI 5.2s
// → All performance budgets exceeded

export default function Dashboard() {
  // Heavy component without code splitting
  const data = useQuery('dashboard', fetchDashboardData);
  
  return (
    <div>
      {/* Large bundle, no lazy loading */}
      <HeavyChartComponent />
      <HeavyTableComponent />
      <HeavyMapComponent />
    </div>
  );
}
```

**Example Frontend Performance Budget Compliance (✅):**

```typescript
// ✅ CORRECT: Frontend page meets performance budget
// Page: /dashboard
// Budget: FCP < 1.5s, LCP < 2s, TTI < 3s
// Actual: FCP 1.2s, LCP 1.8s, TTI 2.5s
// → All performance budgets met

export default function Dashboard() {
  // Code splitting and lazy loading
  const HeavyChartComponent = lazy(() => import('./HeavyChartComponent'));
  const HeavyTableComponent = lazy(() => import('./HeavyTableComponent'));
  const HeavyMapComponent = lazy(() => import('./HeavyMapComponent'));
  
  return (
    <div>
      <Suspense fallback={<Loading />}>
        <HeavyChartComponent />
        <HeavyTableComponent />
        <HeavyMapComponent />
      </Suspense>
    </div>
  );
}
```

**Example Performance Regression Detection (✅):**

```markdown
## Performance Trends

### GET /api/users
- 2025-12-04: 150ms (baseline)
- 2025-12-04: 160ms (+6.7%)
- 2025-12-04: 180ms (+20%)
- **Trend:** Degrading ❌ (needs attention)

### GET /api/orders
- 2025-12-04: 200ms (baseline)
- 2025-12-04: 195ms (-2.5%)
- 2025-12-04: 190ms (-5%)
- **Trend:** Improving ✅
```

**Example Performance Exemption (✅):**

```markdown
## Performance Exemptions

| Endpoint | Current | Budget | Justification | Expiration | Remediation | Status |
|----------|---------|--------|---------------|------------|-------------|--------|
| POST /api/reports | 600ms | 300ms | Complex aggregation query, requires full table scan | 2025-12-04 | Optimize query with indexes, add caching | Active |
| GET /api/analytics | 450ms | 200ms | Real-time analytics calculation, cannot be cached | 2025-12-04 | Move to background job, return cached results | Active |
```

**Example Performance Issue Prioritization (✅):**

```markdown
## Performance Issues

### High Priority (Critical Endpoints)
1. **POST /api/auth/login** - 350ms (budget: 300ms)
   - Impact: High (authentication critical, high traffic)
   - Effort: 2 hours (optimize query, add caching)
   - Quick Win: Yes (high-impact, low-effort)

2. **GET /api/payments** - 280ms (budget: 200ms)
   - Impact: High (payment critical, user-facing)
   - Effort: 4 hours (add database indexes, optimize query)
   - Quick Win: No (requires database migration)

### Medium Priority (Non-Critical Endpoints)
3. **GET /api/reports** - 600ms (budget: 300ms, exempted)
   - Impact: Medium (admin-only, low traffic)
   - Effort: 8 hours (optimize aggregation query)
   - Quick Win: No (complex optimization)
```

---

**Last Updated:** 2025-12-04  
**Maintained By:** QA Team  
**Review Frequency:** Quarterly or when performance requirements change





