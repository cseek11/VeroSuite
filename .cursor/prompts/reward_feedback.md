# Reward Feedback Prompt (`@reward_feedback`)

## Purpose
Analyze past Reward Scores to identify recurring issues and generate improvement plans before finalizing code changes. This prompt ensures Cursor learns from historical performance and automatically improves PR quality.

## Inputs
- Last 5-10 Reward Scores from `docs/metrics/reward_scores.json`
- Current code modifications (files changed, diff summary)
- Anti-patterns from `.cursor/anti_patterns.md`
- Patterns from `.cursor/patterns/`
- Self-improvement log from `docs/ai/self_improvement_log.md` (if exists)
- Reward rubric from `.cursor/reward_rubric.yaml`

## Analysis Steps

### Step 1: Load Historical Scores
1. Read `docs/metrics/reward_scores.json`
2. Extract last 5-10 most recent scores (ordered by timestamp, most recent first)
3. For each score, extract:
   - Overall score
   - Category breakdown (tests, bug_fix, docs, performance, security, penalties)
   - Timestamp
   - PR number
   - File-level scores (if available)

### Step 2: Identify Recurring Issues
Analyze category breakdowns to identify:
- **Tests:** Frequency of low/zero test scores, missing test coverage
- **Security:** Frequency of security penalties or low security scores
- **Docs:** Frequency of missing or insufficient documentation
- **Performance:** Frequency of performance-related point loss
- **Penalties:** Common penalty types (failing CI, missing tests, regressions)

Calculate:
- Average score per category over last 5-10 PRs
- Trend direction (improving/worsening) per category
- Most frequent point loss areas

### Step 3: Load Context Files
1. Read `.cursor/anti_patterns.md` to identify known anti-patterns to avoid
2. Read `.cursor/patterns/` to identify patterns to prefer
3. Read `docs/ai/self_improvement_log.md` (if exists) for previous learnings
4. Read `.cursor/reward_rubric.yaml` for category weights and requirements

### Step 4: Generate Improvement Plan
Based on analysis, create actionable improvement plan:

**For each weak category identified:**
- **Tests:** 
  - If tests frequently missing → Add tests for current changes
  - If test quality low → Improve test coverage, add edge cases
  - If integration tests missing → Add integration/E2E tests
- **Security:**
  - If security penalties frequent → Add security checks, RLS validation, auth guards
  - If security score low → Review tenant isolation, input validation
- **Docs:**
  - If docs frequently missing → Add/update documentation for current changes
  - If date updates missing → Update "Last Updated" timestamps
- **Performance:**
  - If performance issues frequent → Add performance tests, optimize queries
- **Penalties:**
  - If CI failures frequent → Ensure tests pass, fix linting issues
  - If regressions frequent → Add regression tests

## Output Format

```
REWARD SCORE ANALYSIS
====================

Historical Performance (Last 5-10 PRs):
- Average Score: <X>/10
- Trend: <improving|stable|worsening>
- Weak Categories: <list categories with frequent point loss>

Category Breakdown:
- Tests: <avg score> (trend: <direction>)
- Security: <avg score> (trend: <direction>)
- Docs: <avg score> (trend: <direction>)
- Performance: <avg score> (trend: <direction>)
- Penalties: <avg score> (trend: <direction>)

Recurring Issues Identified:
1. <issue description> (occurred in PRs: <list>)
2. <issue description> (occurred in PRs: <list>)
...

IMPROVEMENT PLAN
================

For Current Changes:
1. <specific action to address issue 1>
2. <specific action to address issue 2>
...

Patterns to Apply:
- <pattern name> from `.cursor/patterns/<file>` - <why relevant>
- <pattern name> from `.cursor/patterns/<file>` - <why relevant>

Anti-Patterns to Avoid:
- <anti-pattern> from `.cursor/anti_patterns.md` - <why relevant>
- <anti-pattern> from `.cursor/anti_patterns.md` - <why relevant>

Required Actions:
- [ ] <action 1>
- [ ] <action 2>
- [ ] <action 3>
...

ESTIMATED SCORE IMPROVEMENT
===========================
If all improvements applied, estimated score: <X>/10
(Current baseline: <Y>/10)
```

## Rules
- **MANDATORY:** This analysis MUST be performed before finalizing any code changes
- Always cite specific PR numbers and file paths when referencing past issues
- If `docs/metrics/reward_scores.json` is missing or has < 3 scores, state `INSUFFICIENT_DATA: Need at least 3 historical scores for trend analysis`
- If trend is negative in a category, prioritize improvements in that category
- Quality over quantity: Do not add trivial tests/docs just to increase score (see anti-gaming rule in `.cursor/rules/security.md`)
- Apply improvements that are contextually relevant to current code changes
- Reference `.cursor/reward_rubric.yaml` for category weights to prioritize high-weight categories (security=4, tests=3)

## Integration with Enforcement
- This prompt is automatically triggered by the REWARD SCORE IMPROVEMENT RULE in `.cursor/rules.md`
- Cursor must refuse to finalize code until all applicable Reward Score criteria are met
- After applying improvements, re-run this analysis to verify improvements address identified issues

## Fail-safe
If required data cannot be loaded:
- `MISSING: docs/metrics/reward_scores.json` → Use default improvement checklist based on rubric
- `MISSING: .cursor/anti_patterns.md` → Proceed without anti-pattern context
- `MISSING: .cursor/patterns/` → Proceed without pattern context
- `INSUFFICIENT_DATA: <reason>` → Provide best-effort analysis with available data

## Example Output

```
REWARD SCORE ANALYSIS
====================

Historical Performance (Last 5 PRs):
- Average Score: 2.4/10
- Trend: worsening
- Weak Categories: security, tests, penalties

Category Breakdown:
- Tests: 0.8 (trend: worsening) - Missing tests in 4/5 PRs
- Security: -1.2 (trend: worsening) - Security penalties in 3/5 PRs
- Docs: 0.3 (trend: stable) - Missing docs in 3/5 PRs
- Performance: 0.5 (trend: stable)
- Penalties: -2.0 (trend: worsening) - CI failures in 2/5 PRs

Recurring Issues Identified:
1. Missing tests for new features (occurred in PRs: #54, #55, #56, #58)
2. Security: Missing tenant isolation checks (occurred in PRs: #55, #57, #58)
3. Missing documentation updates (occurred in PRs: #54, #56, #58)

IMPROVEMENT PLAN
================

For Current Changes:
1. Add unit tests for all new functions (target: 3-6 tests per file)
2. Add integration tests for API endpoints
3. Verify tenant isolation in all database queries (add tenantId filters)
4. Add RLS policy validation tests
5. Update relevant documentation with current date
6. Ensure all tests pass before committing

Patterns to Apply:
- Backend Circuit Breaker from `.cursor/patterns/001_backend_circuit_breaker.md` - For error handling
- Tenant Isolation Pattern from `.cursor/patterns/` - For database queries

Anti-Patterns to Avoid:
- Query without tenantId filter from `.cursor/anti_patterns.md` - Security risk
- Missing test coverage from `.cursor/anti_patterns.md` - Quality risk

Required Actions:
- [ ] Add tests for new functions in `apps/api/src/feature/service.ts`
- [ ] Add tenantId filter to database query in `apps/api/src/feature/repository.ts`
- [ ] Update `docs/feature/README.md` with current date
- [ ] Verify all tests pass locally

ESTIMATED SCORE IMPROVEMENT
===========================
If all improvements applied, estimated score: 6.5/10
(Current baseline: 2.0/10)
```





