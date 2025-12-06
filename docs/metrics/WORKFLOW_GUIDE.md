# REWARD_SCORE CI Workflow Guide

**Last Updated:** 2025-12-05

## Overview

This guide explains how the REWARD_SCORE CI automation system works, from PR creation to score computation, comment posting, and metrics collection.

## Workflow Architecture

### Workflow Chain

The REWARD_SCORE system uses a cascading workflow architecture:

1. **CI Workflow** (`.github/workflows/ci.yml`)
   - Runs on: `pull_request` events
   - Executes: Frontend and backend tests
   - Uploads: Coverage artifacts (`frontend-coverage`, `backend-coverage`)

2. **Compute Reward Score** (`.github/workflows/swarm_compute_reward_score.yml`)
   - Triggers on: `pull_request` events OR `workflow_run` (after CI completes)
   - Downloads: Coverage artifacts from CI workflow
   - Runs: Static analysis (Semgrep, ESLint, TypeScript)
   - Computes: REWARD_SCORE using `.cursor/scripts/compute_reward_score.py`
   - Posts: PR comment with score and decision recommendation
   - Uploads: `reward` artifact and `static-analysis` artifact

3. **Update Metrics Dashboard** (`.github/workflows/update_metrics_dashboard.yml`)
   - Triggers on: `workflow_run` (after Compute Reward Score completes)
   - Downloads: `reward` artifact
   - Updates: `docs/metrics/reward_scores.json`
   - Commits: Metrics file (with `[skip ci]` to avoid loops)

4. **Pattern Extraction** (`.github/workflows/swarm_suggest_patterns.yml`)
   - Triggers on: `workflow_run` (after Compute Reward Score completes)
   - Condition: Score ≥ 6
   - Downloads: `reward` artifact
   - Generates: Pattern extraction suggestions

5. **Anti-Pattern Detection** (`.github/workflows/swarm_log_anti_patterns.yml`)
   - Triggers on: `workflow_run` (after Compute Reward Score completes)
   - Condition: Score ≤ 0
   - Downloads: `reward` artifact
   - Generates: Anti-pattern detection report

## Workflow Triggers

### Pull Request Events

The main workflow triggers on:
- `opened` - New PR created
- `synchronize` - New commits pushed to PR
- `reopened` - PR reopened after being closed

### Workflow Run Events

Cascading workflows trigger on:
- `workflow_run` with `types: [completed]`
- Only when parent workflow completed successfully
- Only when parent workflow was triggered by a PR

## Artifact Flow

### Artifacts Uploaded

1. **From CI Workflow:**
   - `frontend-coverage` - Frontend test coverage JSON
   - `backend-coverage` - Backend test coverage JSON

2. **From Compute Reward Score:**
   - `reward` - REWARD_SCORE JSON with breakdown and comment
   - `static-analysis` - Combined static analysis results

3. **From Update Metrics:**
   - `metrics-data` - Updated metrics JSON file

### Artifact Download

Workflows download artifacts using:
- `actions/download-artifact@v4`
- Artifact names must match exactly (case-sensitive)
- Artifacts are available for 7-30 days (depending on retention policy)

## Score Computation Process

### Step 1: Collect Data

1. Download coverage artifacts from CI workflow
2. Run static analysis (Semgrep, ESLint, TypeScript)
3. Get PR description using GitHub CLI
4. Get PR diff using git commands

### Step 2: Compute Scores

The `compute_reward_score.py` script:
1. Parses coverage data (frontend and backend)
2. Analyzes PR diff for new test files and changes
3. Checks PR description for bug fix keywords
4. Analyzes static analysis results
5. Calculates scores for each category:
   - Tests (weight: 3)
   - Bug Fix (weight: 2)
   - Documentation (weight: 1)
   - Performance (weight: 1)
   - Security (weight: 2)
6. Applies penalties:
   - Failing CI: -4
   - Missing tests: -2
   - Regression: -3
7. Generates decision recommendation:
   - BLOCK: Score < -3
   - REQUEST_CHANGES: Score -3 to 3
   - APPROVE: Score > 3

### Step 3: Generate Comment

1. Loads template from `.cursor/ci/reward_score_comment_template.md`
2. Replaces placeholders with actual values
3. Adds decision recommendation section
4. Includes artifact links (workflow run links)

### Step 4: Post Comment

1. Finds existing comment (if any) with "REWARD_SCORE" header
2. Updates existing comment OR posts new comment
3. Sets GitHub Actions annotations based on score
4. Exits with error code if score < -3 (blocks PR)

## Metrics Collection Process

### Step 1: Download Reward Artifact

The `update_metrics_dashboard.yml` workflow downloads the `reward` artifact from the completed Compute Reward Score workflow.

### Step 2: Extract Data

Extracts:
- PR number
- Score and breakdown
- Metadata (timestamp, rubric version)

### Step 3: Update Metrics

The `collect_metrics.py` script:
1. Loads existing metrics from `docs/metrics/reward_scores.json`
2. Adds or updates PR entry with:
   - PR number
   - Score and breakdown
   - Author (from GitHub API)
   - Files changed (from GitHub API)
   - Timestamp
3. Recalculates aggregates:
   - Total PRs
   - Average score
   - Score distribution
   - Trends (last 30 days)
   - Category performance
   - Anti-patterns

### Step 4: Commit Metrics

1. Commits updated `reward_scores.json` file
2. Uses commit message: `chore: update REWARD_SCORE metrics [skip ci]`
3. Pushes to repository
4. `[skip ci]` prevents workflow loops

## Decision Logic

### BLOCK (Score < -3)

- **Condition:** Score below -3 OR score < -3 with critical security issues
- **Action:** 
  - Posts comment with BLOCK decision
  - Sets GitHub Actions error annotation
  - Exits with error code (fails workflow)
  - PR cannot be merged until score improves

### REQUEST_CHANGES (Score -3 to 3)

- **Condition:** Score between -3 and 3
- **Action:**
  - Posts comment with REQUEST_CHANGES decision
  - Sets GitHub Actions warning annotation
  - Workflow succeeds but recommends improvements

### APPROVE (Score > 3)

- **Condition:** Score above 3
- **Action:**
  - Posts comment with APPROVE decision
  - Sets GitHub Actions notice annotation
  - Workflow succeeds
  - **Note:** Human review still required for merge

## Error Handling

### Missing Artifacts

- Workflows use `continue-on-error: true` for artifact downloads
- Scripts check for file existence before processing
- Graceful fallback to empty/default values

### Missing PR Data

- Scripts handle missing PR numbers gracefully
- Fallback to git commands if GitHub CLI unavailable
- Empty strings used for missing data

### Static Analysis Failures

- Static analysis steps use `continue-on-error: true`
- Empty results used if analysis fails
- Scoring continues with available data

## Performance Considerations

### Workflow Execution Time

- Compute Reward Score: ~2-5 minutes
- Update Metrics: ~1-2 minutes
- Pattern Extraction: ~1-2 minutes (conditional)
- Anti-Pattern Detection: ~1-2 minutes (conditional)

### Optimization

- Workflows run in parallel where possible
- Artifacts cached between workflow runs
- Static analysis runs only when needed
- Metrics aggregation optimized for large datasets

## Troubleshooting

### Workflow Not Triggering

1. Check workflow file syntax (YAML)
2. Verify trigger configuration (`on:` section)
3. Check workflow name matches exactly (case-sensitive)
4. Verify `workflow_run` workflows exist

### Artifacts Not Found

1. Verify artifact names match exactly
2. Check artifact retention period
3. Verify parent workflow completed successfully
4. Check artifact upload step succeeded

### Scores Not Computing

1. Check coverage artifacts exist
2. Verify PR number is accessible
3. Check script has required permissions
4. Review workflow logs for errors

### Comments Not Posting

1. Verify `GITHUB_TOKEN` has permissions
2. Check PR number is valid
3. Verify GitHub CLI is installed
4. Review workflow logs for API errors

## Reference

- **Workflow Files:** `.github/workflows/`
- **Scripts:** `.cursor/scripts/`
- **Rubric:** `.cursor/reward_rubric.yaml`
- **Template:** `.cursor/ci/reward_score_comment_template.md`
- **Metrics:** `docs/metrics/reward_scores.json`
- **Dashboard:** `docs/metrics/dashboard.html`

---

**Note:** Workflow triggers are validated by `.cursor/scripts/validate_workflow_triggers.py`. Run this script before merging workflow changes.

