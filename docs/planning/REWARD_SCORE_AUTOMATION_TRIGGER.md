# REWARD_SCORE Automation Trigger Guide

**Last Updated:** 2025-11-17

## When Does REWARD_SCORE Automation Kick In?

The REWARD_SCORE CI automation system runs **automatically** when certain GitHub events occur. Here's exactly when it triggers:

---

## Automatic Triggers

### 1. PR Events (Primary Trigger)

**When:** A Pull Request is created, updated, or reopened on GitHub

**Events that trigger:**
- `opened` - New PR created
- `synchronize` - New commits pushed to existing PR
- `reopened` - PR reopened after being closed

**Workflow:** `.github/workflows/swarm_compute_reward_score.yml`

**Timeline:**
```
Developer creates/updates PR on GitHub
    ↓
GitHub triggers workflow automatically (within seconds)
    ↓
CI workflow runs tests and generates coverage
    ↓
REWARD_SCORE workflow runs (after CI completes)
    ↓
Score computed and PR comment posted (~2-5 minutes)
    ↓
Metrics collected and dashboard updated (~1-2 minutes)
```

**No manual action required** - It's fully automatic!

---

### 2. Workflow Run Events (Secondary Trigger)

**When:** After the main CI workflow completes successfully

**Condition:** Only if the CI workflow was triggered by a PR event

**Workflow:** `.github/workflows/swarm_compute_reward_score.yml`

**Timeline:**
```
CI workflow completes successfully
    ↓
REWARD_SCORE workflow triggers automatically
    ↓
Downloads coverage artifacts from CI
    ↓
Computes score and posts comment
```

---

## What Happens Automatically

### Step 1: PR Created/Updated (Automatic)
- Developer creates PR on GitHub
- GitHub automatically triggers workflows

### Step 2: CI Workflow Runs (Automatic)
- Tests run
- Coverage generated
- Artifacts uploaded

### Step 3: REWARD_SCORE Computation (Automatic)
- Downloads coverage artifacts
- Runs static analysis
- Computes file-level and PR-level scores
- Generates PR comment

### Step 4: PR Comment Posted (Automatic)
- Comment posted to PR
- Includes score, breakdown, and file-level details
- Decision recommendation included

### Step 5: Metrics Collection (Automatic)
- Metrics collected from reward.json
- File-level scores stored
- Aggregates calculated
- Dashboard updated

### Step 6: Pattern Extraction (Automatic, if score ≥ 6)
- Pattern suggestions generated
- High-quality code patterns identified

### Step 7: Anti-Pattern Detection (Automatic, if score ≤ 0)
- Anti-patterns logged
- Low-quality code patterns identified

---

## Manual Triggers (Optional)

### Workflow Dispatch

Some workflows can be triggered manually:

```yaml
on:
  workflow_dispatch:
```

**Available for:**
- `update_metrics_dashboard.yml` - Manual metrics update

**How to trigger:**
1. Go to GitHub Actions tab
2. Select workflow
3. Click "Run workflow"
4. Select branch
5. Click "Run workflow"

---

## File-Level Scoring Automation

**New Feature:** File-level scoring is now automatic!

**When it runs:**
- Automatically enabled in `compute_score()` function
- Runs for every PR that has a diff
- Scores each file individually
- Aggregates into PR-level score

**What you get:**
- PR-level score (aggregated)
- File-level breakdown (per-file scores)
- File-level metrics stored in `reward_scores.json`
- File-level view in dashboard (coming soon)

**No configuration needed** - It's automatic!

---

## Timeline Summary

| Event | Time | Action |
|-------|------|--------|
| PR Created | 0s | GitHub triggers workflows |
| CI Workflow | ~2-5 min | Tests run, coverage generated |
| REWARD_SCORE | ~2-5 min | Score computed, comment posted |
| Metrics Update | ~1-2 min | Metrics collected, dashboard updated |
| Pattern Extraction | ~1-2 min | (If score ≥ 6) |
| Anti-Pattern Detection | ~1-2 min | (If score ≤ 0) |

**Total time:** ~5-10 minutes from PR creation to complete automation

---

## What You Need to Do

### Nothing! It's Fully Automatic

Just:
1. Create/update a PR on GitHub
2. Wait ~5-10 minutes
3. Check PR comments for REWARD_SCORE
4. View dashboard for metrics

**No manual steps required!**

---

## Verification

To verify automation is working:

1. **Check GitHub Actions:**
   - Go to Actions tab
   - Look for "Swarm - Compute Reward Score" workflow
   - Should show "✓" (green checkmark)

2. **Check PR Comments:**
   - Open your PR
   - Look for comment with "REWARD_SCORE" header
   - Should include score, breakdown, and file-level details

3. **Check Metrics:**
   - Open `docs/metrics/reward_scores.json`
   - Should have entry for your PR
   - Should include `file_scores` field

4. **Check Dashboard:**
   - Open `docs/metrics/dashboard.html`
   - Should show your PR in recent scores
   - Should show file-level breakdown (if implemented)

---

## Troubleshooting

### Workflow Not Running?

1. **Check PR exists:** Workflow only runs on PRs, not direct pushes
2. **Check workflow file:** Must be in `.github/workflows/`
3. **Check triggers:** Must have `pull_request` or `workflow_run` trigger
4. **Check branch:** Workflow file must be on default branch (main/master)

### Score Not Appearing?

1. **Wait 5-10 minutes:** Automation takes time
2. **Check Actions tab:** See if workflow is running/failed
3. **Check PR comments:** Comment might be posted but not visible
4. **Check logs:** Review workflow logs for errors

### File-Level Scores Missing?

1. **Check diff exists:** File-level scoring requires PR diff
2. **Check reward.json:** Should have `file_scores` field
3. **Check metrics:** Should have `file_scores` in entry

---

## Summary

**REWARD_SCORE automation kicks in:**
- ✅ **Automatically** when PR is created/updated
- ✅ **Automatically** after CI workflow completes
- ✅ **No manual action required**
- ✅ **File-level scoring is automatic**
- ✅ **Takes ~5-10 minutes total**

**You just need to:**
1. Create/update PR on GitHub
2. Wait for automation to complete
3. Check PR comments and dashboard

That's it! 🎉

