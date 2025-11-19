# CI Automation Trigger Flow

**Last Updated:** 2025-11-17

## Overview

The CI automation suite uses a **cascading workflow chain** that automatically triggers based on PR events and workflow completions. This document explains how each automation is triggered.

---

## Trigger Flow Diagram

```
PR Event (opened/synchronize/reopened)
    │
    ├─→ CI Workflow (runs tests, coverage, static analysis)
    │       │
    │       └─→ Uploads artifacts (coverage, test results)
    │
    ├─→ Swarm - Compute Reward Score
    │       │
    │       ├─→ Downloads CI artifacts
    │       ├─→ Computes REWARD_SCORE
    │       ├─→ Posts PR comment
    │       └─→ Uploads reward.json artifact
    │               │
    │               ├─→ Swarm - Suggest Patterns (if score ≥ 6)
    │               │       └─→ Extracts patterns, posts suggestion comment
    │               │
    │               ├─→ Swarm - Log Anti-Patterns (if score ≤ 0)
    │               │       └─→ Detects anti-patterns, posts report comment
    │               │
    │               └─→ Update Metrics Dashboard
    │                       └─→ Collects score, updates reward_scores.json
    │
    └─→ Validation Workflows (run in parallel)
            ├─→ Validate File Organization
            ├─→ Validate Documentation Dates
            ├─→ Validate Trace Propagation
            ├─→ Detect Silent Failures
            └─→ Validate Pattern Learning
```

---

## Primary Trigger: Pull Request Events

### 1. Initial PR Event

**Workflow:** `swarm_compute_reward_score.yml`  
**Trigger:**
```yaml
on:
  pull_request:
    types: [opened, synchronize, reopened]
```

**When it runs:**
- When a PR is **opened**
- When a PR is **updated** (new commits pushed)
- When a PR is **reopened** (after being closed)

**What it does:**
1. Downloads coverage artifacts from CI workflow
2. Runs static analysis (Semgrep, ESLint, TypeScript check)
3. Computes REWARD_SCORE using `compute_reward_score.py`
4. Posts score comment on PR
5. Uploads `reward.json` artifact

---

## Secondary Trigger: CI Workflow Completion

### 2. After CI Completes

**Workflow:** `swarm_compute_reward_score.yml`  
**Trigger:**
```yaml
on:
  workflow_run:
    workflows: ["CI"]
    types: [completed]
```

**When it runs:**
- After the main `CI` workflow completes
- Only if the CI workflow was triggered by a PR event

**What it does:**
- Same as primary trigger, but uses artifacts from completed CI run
- Ensures scoring happens even if PR trigger missed

---

## Cascading Workflows (Chain Reactions)

### 3. Pattern Extraction (High Scores)

**Workflow:** `swarm_suggest_patterns.yml`  
**Trigger:**
```yaml
on:
  workflow_run:
    workflows: ["Swarm - Compute Reward Score"]
    types: [completed]
```

**Condition:** Only runs if `REWARD_SCORE ≥ 6`

**What it does:**
1. Downloads `reward.json` artifact
2. Checks if score is ≥ 6
3. If yes:
   - Extracts candidate patterns from PR
   - Generates pattern suggestions
   - Posts suggestion comment on PR
   - Uploads pattern suggestions artifact

**Manual Trigger:** No (automatic based on score)

---

### 4. Anti-Pattern Detection (Low Scores)

**Workflow:** `swarm_log_anti_patterns.yml`  
**Trigger:**
```yaml
on:
  workflow_run:
    workflows: ["Swarm - Compute Reward Score"]
    types: [completed]
```

**Condition:** Only runs if `REWARD_SCORE ≤ 0`

**What it does:**
1. Downloads `reward.json` artifact
2. Checks if score is ≤ 0
3. If yes:
   - Detects anti-patterns in PR code
   - Generates anti-pattern report
   - Posts report comment on PR
   - Prepares entries for `.cursor/anti_patterns.md` and `.cursor/BUG_LOG.md`

**Manual Trigger:** No (automatic based on score)

---

### 5. Metrics Dashboard Update

**Workflow:** `update_metrics_dashboard.yml`  
**Trigger:**
```yaml
on:
  workflow_run:
    workflows: ["Swarm - Compute Reward Score"]
    types: [completed]
  schedule:
    - cron: '0 0 * * *'  # Daily at midnight UTC
  workflow_dispatch:  # Manual trigger
```

**When it runs:**
1. **Automatic:** After each PR score is computed
2. **Scheduled:** Daily at midnight UTC (recalculates aggregates)
3. **Manual:** Via GitHub Actions UI (workflow_dispatch)

**What it does:**
1. Downloads `reward.json` artifact (if available)
2. Adds score entry to `reward_scores.json`
3. Recalculates aggregates (totals, averages, distributions, trends)
4. Commits updated metrics file to repository
5. Uploads metrics artifact

---

## Validation Workflows (Parallel Execution)

These workflows run **in parallel** when a PR is opened/updated:

### 6. File Organization Validation

**Workflow:** `validate_file_organization.yml`  
**Trigger:**
```yaml
on:
  pull_request:
    types: [opened, synchronize, reopened]
```

**What it does:**
- Validates files are in correct directories
- Checks for prohibited files in root
- Posts validation comment on PR

---

### 7. Documentation Date Validation

**Workflow:** `validate_documentation.yml`  
**Trigger:**
```yaml
on:
  pull_request:
    types: [opened, synchronize, reopened]
```

**What it does:**
- Checks for "Last Updated" timestamps
- Verifies dates use current system date (not hardcoded)
- Posts validation comment on PR

---

### 8. Trace Propagation Validation

**Workflow:** `validate_trace_propagation.yml`  
**Trigger:**
```yaml
on:
  pull_request:
    types: [opened, synchronize, reopened]
```

**What it does:**
- Validates logger calls include traceId, spanId, requestId
- Posts validation comment on PR

---

### 9. Silent Failure Detection

**Workflow:** `detect_silent_failures.yml`  
**Trigger:**
```yaml
on:
  pull_request:
    types: [opened, synchronize, reopened]
```

**What it does:**
- Detects empty catch blocks
- Detects missing await keywords
- Posts detection report on PR
- **Blocks PR** if critical violations found

---

### 10. Pattern Learning Validation

**Workflow:** `validate_pattern_learning.yml`  
**Trigger:**
```yaml
on:
  pull_request:
    types: [opened, synchronize, reopened]
```

**What it does:**
- For bug fixes: Checks if bug logged, error pattern documented, regression tests added
- For features: Checks if engineering decisions documented
- Posts validation comment on PR
- **Blocks PR** if critical violations found

---

## Manual Triggers

### Workflow Dispatch

Some workflows support manual triggering via GitHub Actions UI:

- **Update Metrics Dashboard:** Can be manually triggered to recalculate aggregates

**How to trigger manually:**
1. Go to repository → Actions tab
2. Select workflow (e.g., "Update Metrics Dashboard")
3. Click "Run workflow" button
4. Select branch and click "Run workflow"

---

## Schedule Triggers

### Daily Metrics Recalculation

**Workflow:** `update_metrics_dashboard.yml`  
**Schedule:**
```yaml
schedule:
  - cron: '0 0 * * *'  # Midnight UTC daily
```

**What it does:**
- Recalculates all aggregates from existing scores
- Updates trends and distributions
- Commits updated metrics file

---

## Summary Table

| Workflow | Primary Trigger | Secondary Trigger | Condition |
|----------|----------------|-------------------|-----------|
| **Compute Reward Score** | PR event | CI workflow completion | Always |
| **Suggest Patterns** | Reward score completion | - | Score ≥ 6 |
| **Log Anti-Patterns** | Reward score completion | - | Score ≤ 0 |
| **Update Metrics** | Reward score completion | Daily schedule, Manual | Always |
| **Validate File Org** | PR event | - | Always |
| **Validate Docs Dates** | PR event | - | Always |
| **Validate Trace** | PR event | - | Always |
| **Detect Silent Failures** | PR event | - | Always |
| **Validate Pattern Learning** | PR event | - | Always |

---

## Example Flow

1. **Developer opens PR #123**
   - ✅ Validation workflows start (parallel)
   - ✅ CI workflow starts (tests, coverage)
   - ✅ Compute Reward Score workflow starts

2. **CI workflow completes**
   - ✅ Uploads coverage artifacts
   - ✅ Compute Reward Score downloads artifacts and computes score

3. **Score computed: 7**
   - ✅ Posts PR comment with score
   - ✅ Uploads reward.json artifact
   - ✅ **Suggest Patterns** workflow triggers (score ≥ 6)
   - ✅ **Update Metrics** workflow triggers

4. **Suggest Patterns completes**
   - ✅ Extracts patterns from PR
   - ✅ Posts pattern suggestion comment

5. **Update Metrics completes**
   - ✅ Adds score to reward_scores.json
   - ✅ Updates aggregates
   - ✅ Commits metrics file

**Result:** PR has score comment, pattern suggestions (if applicable), and metrics are updated.

---

## Troubleshooting

### Workflow Not Triggering?

1. **Check PR event:** Ensure PR is opened/updated/reopened
2. **Check workflow file:** Verify workflow file is in `.github/workflows/`
3. **Check branch:** Workflow must be on default branch (main/master) to trigger
4. **Check permissions:** GitHub Actions must be enabled for repository

### Workflow Chain Broken?

1. **Check artifact names:** Ensure artifact names match between workflows
2. **Check workflow names:** `workflow_run` triggers must match exact workflow name
3. **Check conditions:** Some workflows only run if conditions are met (score thresholds)

### Manual Trigger Not Working?

1. **Check workflow_dispatch:** Ensure workflow has `workflow_dispatch:` in `on:` section
2. **Check permissions:** You must have write access to repository
3. **Check branch:** Workflow file must be on default branch

---

## Reference

- **Workflow Files:** `.github/workflows/`
- **Scripts:** `.cursor/scripts/`
- **Metrics:** `docs/metrics/reward_scores.json`
- **Dashboard:** `docs/metrics/dashboard.html`



