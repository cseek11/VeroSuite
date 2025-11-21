# PR Session Linking Issue

**Date:** 2025-11-21  
**Issue:** PRs #354, #355, #356, #357 are not appearing in dashboard sessions

---

## Root Cause

The `auto_pr_session_manager.yml` workflow detects Auto-PRs but **does not add them to sessions**.

### Current Workflow Behavior

1. ✅ Detects Auto-PR via `check` command
2. ✅ Returns session ID
3. ✅ Adds comment to PR
4. ❌ **Does NOT call `add_to_session()` to register PR**

### Problem

The `check` command in `auto_pr_session_manager.py` only:
- Checks if PR is an Auto-PR
- Returns session ID
- **Does NOT add PR to session's `prs` array**

### Evidence

Session data file shows all sessions have empty `prs` arrays:
```json
{
  "active_sessions": {
    "cseek_cursor-20251120-1459": {
      "prs": []  // ❌ Empty!
    }
  }
}
```

---

## Solution

### Option 1: Update Workflow to Add PRs (Recommended)

Modify `.github/workflows/auto_pr_session_manager.yml` to call `add_to_session()` after detecting Auto-PR:

```yaml
- name: Add PR to Session
  if: steps.session_check.outputs.skip == 'true'
  run: |
    python .cursor/scripts/auto_pr_session_manager.py add \
      --pr-number "$PR_NUMBER" \
      --title "$PR_TITLE" \
      --body "$PR_BODY" \
      --author "$PR_AUTHOR" \
      --files "$FILES_CHANGED" \
      --session-id "${{ steps.session_check.outputs.session_id }}"
```

### Option 2: Add CLI Command

Add an `add` command to `auto_pr_session_manager.py` CLI that:
1. Takes PR number, title, body, author, files
2. Calls `add_to_session()` with proper data
3. Saves session data

### Option 3: Manual Script

Create a script to retroactively add PRs to sessions:

```python
# add_prs_to_sessions.py
from auto_pr_session_manager import AutoPRSessionManager

manager = AutoPRSessionManager()

# Add PRs to their sessions
prs = [
    {"number": "354", "title": "Auto-PR: scripts", "author": "cseek_cursor", "files": 1},
    {"number": "355", "title": "Auto-PR: scripts", "author": "cseek_cursor", "files": 1},
    {"number": "356", "title": "Auto-PR: Auto-PR", "author": "cseek_cursor", "files": 9},
    {"number": "357", "title": "Auto-PR: developer", "author": "cseek_cursor", "files": 2},
]

for pr in prs:
    session_id = manager.extract_session_id(
        pr["title"],
        "",
        pr["author"],
        datetime.now()
    )
    
    manager.add_to_session(
        pr["number"],
        {
            "pr_title": pr["title"],
            "pr_body": "",
            "author": pr["author"],
            "files_changed": pr["files"],
            "timestamp": datetime.now().isoformat(),
        },
        session_id
    )

manager.save_sessions()
```

---

## Immediate Fix

To fix the current PRs, we need to:

1. **Add `add` command to CLI** - Implement in `auto_pr_session_manager.py`
2. **Update workflow** - Call `add` command after `check`
3. **Retroactively add PRs** - Run script to add existing PRs to sessions

---

## Verification

After fix:
- Sessions should have PRs in `prs` array
- Dashboard should show PRs linked to sessions
- New PRs should automatically be added

---

**Status:** ⚠️ **Issue identified - fix needed**




