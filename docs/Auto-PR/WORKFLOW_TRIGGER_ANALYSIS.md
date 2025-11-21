# Workflow Trigger Analysis

**Date:** 2025-11-21  
**Issue:** Workflows being triggered but failing with "No PR number provided"

---

## Current Status

### ✅ Workflows ARE Being Triggered

**Evidence:**
- All 4 PRs show `workflow_dispatch` events in workflow runs
- Workflows are being executed
- GitHub CLI command is executing successfully

**Workflow Runs Observed:**
```
PR #354: workflow_dispatch event triggered ✅
PR #355: workflow_dispatch event triggered ✅
PR #356: workflow_dispatch event triggered ✅
PR #357: workflow_dispatch event triggered ✅
```

### ❌ But Workflows Are Failing

**Error:**
```
Error: No PR number provided
##[error]Process completed with exit code 4.
```

**Root Cause:**
The workflow parameter format is incorrect. The GitHub CLI expects:
- `--field pr_number=XXX` (not `--field inputs.pr_number=XXX`)

The `inputs.` prefix is only used in the workflow YAML definition, not in the CLI command.

---

## Workflow Code Analysis

### Workflow Input Definition
```yaml
workflow_dispatch:
  inputs:
    pr_number:
      description: 'PR number to compute score for (optional)'
      required: false
      type: string
```

### Workflow Code That Checks Input
```bash
if [ "${{ github.event_name }}" == "workflow_dispatch" ]; then
  if [ -n "${{ github.event.inputs.pr_number }}" ]; then
    echo "number=${{ github.event.inputs.pr_number }}" >> "$GITHUB_OUTPUT"
  else
    # Falls back to finding PR from branch name
    PR_NUM=$(gh pr list --head "${{ github.ref_name }}" --json number --jq '.[0].number' || echo "")
    if [ -z "$PR_NUM" ]; then
      echo "Error: No PR number provided" >&2
      exit 1
    fi
  fi
fi
```

**Issue:** When `github.event.inputs.pr_number` is empty, it tries to find PR from branch name, but this fails because:
1. The PR was just created
2. GitHub may not have indexed it yet
3. The workflow is running on the branch, not main

---

## Fix Applied

### Before (Incorrect)
```python
"--field", f"inputs.pr_number={pr_number}"
```

### After (Correct)
```python
"--field", f"pr_number={pr_number}"
```

**Explanation:**
- GitHub CLI `--field` flag expects just the input name
- The `inputs.` prefix is only used in workflow YAML and `github.event.inputs.*` references
- CLI format: `--field input_name=value`

---

## Verification

### Test Command Format
```bash
gh workflow run swarm_compute_reward_score.yml \
  --ref auto-pr-1763746496 \
  --field pr_number=356
```

This should correctly pass the PR number to the workflow.

---

## Additional Notes

### Automatic PR Triggers

**Good News:** PRs ARE automatically triggering `pull_request` events:
- PR #354: `pull_request` event triggered ✅
- PR #355: `pull_request` event triggered ✅
- PR #356: `pull_request` event triggered ✅
- PR #357: `pull_request` event triggered ✅

**However:** These are also failing, likely due to:
1. Session management logic
2. Auto-PR detection and skipping
3. Other workflow conditions

### Why Manual Trigger is Needed

The comment in the code says:
```python
# Manually trigger the reward score workflow since GITHUB_TOKEN PRs don't trigger pull_request events
```

**But:** This is actually not true - PRs ARE triggering `pull_request` events. However, the manual trigger ensures the workflow runs with the correct PR number parameter.

---

## Next Steps

1. ✅ **Fix Applied:** Changed `inputs.pr_number` to `pr_number` in CLI command
2. ⏳ **Test:** Create new PR to verify fix works
3. ⏳ **Monitor:** Watch workflow execution with correct parameter
4. ⏳ **Verify:** Confirm PR number is passed correctly

---

## Conclusion

✅ **Workflows ARE being triggered correctly**  
❌ **Parameter format was incorrect**  
✅ **Fix has been applied**

**Status:** Ready for next test PR to verify fix works correctly.

---

**Fix Applied:** 2025-11-21  
**File Modified:** `.cursor/scripts/monitor_changes.py`  
**Line:** ~687

