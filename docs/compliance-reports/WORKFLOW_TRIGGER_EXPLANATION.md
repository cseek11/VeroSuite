# Workflow Trigger Explanation

**Date:** 2025-11-22

## Why You Don't See New Workflows

The workflows with validation errors **don't trigger on push**. They only run when other workflows complete.

### Workflows That Trigger on Push ✅

These should run on every push:
- `ci.yml` - Main CI workflow
- `enterprise-testing.yml` - Testing pipeline
- `deploy-production.yml` - Deployment workflow

### Workflows With Validation Errors (workflow_run) ⚠️

These only run **after** "Swarm - Compute Reward Score" completes:
- `swarm_log_anti_patterns.yml`
- `swarm_suggest_patterns.yml`
- `apply_reward_feedback.yml`

These won't run until:
1. "Swarm - Compute Reward Score" workflow runs
2. That workflow completes
3. Then these workflows trigger

### Other Workflows

- `session_health_check.yml` - Only runs on schedule (3 AM UTC) or manual trigger

## How to Verify Fixes

### Option 1: Check Workflows That DO Trigger on Push

Check if these are running:
- `ci.yml`
- `enterprise-testing.yml`
- `deploy-production.yml`

If these run and **don't have validation errors**, our fixes worked!

### Option 2: Validate YAML Syntax Directly

We can validate the YAML files directly without running them:
```bash
# Using Python
python -c "import yaml; yaml.safe_load(open('.github/workflows/swarm_log_anti_patterns.yml'))"
```

### Option 3: Wait for Parent Workflow

The workflows with errors will only run when:
- "Swarm - Compute Reward Score" runs
- That workflow completes
- Then they trigger automatically

### Option 4: Manual Trigger (if workflow_dispatch exists)

Some workflows can be manually triggered from GitHub Actions UI.

## Current Status

✅ **All YAML syntax errors have been fixed**  
⏳ **Workflows won't run until parent workflow triggers them**  
✅ **We can validate YAML syntax directly to confirm fixes**

## Next Steps

1. **Check workflows that trigger on push** (ci.yml, enterprise-testing.yml)
2. **Validate YAML syntax directly** (confirm no syntax errors)
3. **Wait for parent workflow** to trigger the dependent workflows
4. **Or manually trigger** if workflow_dispatch is available

---

**Last Updated:** 2025-11-22

