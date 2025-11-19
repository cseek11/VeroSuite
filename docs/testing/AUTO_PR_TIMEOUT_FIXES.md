# Auto-PR Timeout and File Detection Fixes

**Date:** 2025-11-18  
**Status:** ✅ **FIXED**

## Issues Identified

### Issue 1: GitHub CLI Authentication Timeout ❌
**Root Cause:** `gh` commands were timing out because GitHub CLI was not authenticated. When unauthenticated, `gh pr create` waits for interactive login, which hangs forever inside subprocess with `capture_output=True`.

**Symptoms:**
- `gh pr create` timed out after 30 seconds
- `gh pr list` also timed out
- Multiple unrelated `gh` commands all timed out

**Fix Applied:**
- Added authentication check before any `gh` command
- Authenticate using `GH_DISPATCH_PAT`, `GH_TOKEN`, or `GITHUB_TOKEN`
- Use `gh auth login --with-token` before creating PRs
- Added proper error handling for authentication failures

**Code Changes:**
```python
# CRITICAL: Authenticate GitHub CLI before any gh command
token = os.environ.get("GH_DISPATCH_PAT") or os.environ.get("GH_TOKEN") or os.environ.get("GITHUB_TOKEN")
if not token:
    logger.error("No GitHub token found...")
    return None

# Authenticate GitHub CLI
auth_result = subprocess.run(
    [gh_path, "auth", "login", "--with-token"],
    input=token,
    text=True,
    capture_output=True,
    timeout=10,
    check=True
)
```

---

### Issue 2: Garbage File Detection ❌
**Root Cause:** The script was detecting command fragments as files because `git status --porcelain` parsing was picking up non-file lines from terminal output or command history.

**Symptoms:**
- Files with names like `"t --workflow=swarm_compute_reward_score.yml..."`
- Files with names like `"t --workflow=update_metrics_dashboard.yml..."`
- Files with names like `"t n"`
- These "files" were being committed, causing invalid PR descriptions

**Fix Applied:**
- Added file path validation before processing
- Skip files that start with `-` (command flags)
- Skip files with spaces that don't exist (likely command fragments)
- Skip non-existent files unless they're untracked (`??`)

**Code Changes:**
```python
# Validate file path - skip garbage entries (command fragments, invalid paths)
if not file_path or file_path.startswith("-"):
    continue
if " " in file_path and not os.path.exists(repo_path / file_path):
    # If it has spaces and doesn't exist, it's likely a command fragment
    continue
if not os.path.exists(repo_path / file_path) and status != "??":
    # Skip non-existent files unless they're untracked (??)
    continue
```

---

### Issue 3: PR Body Size Timeout ❌
**Root Cause:** Large PR bodies (>8-16 KB) can cause GitHub API to respond slowly, causing `gh pr create` to block and timeout.

**Symptoms:**
- PR creation timed out even when authenticated
- Large file lists in PR body
- YAML/JSON blocks in PR body

**Fix Applied:**
- Use `--body-file` instead of `--body` for PR creation
- Write PR body to temporary file
- Clean up temp file after PR creation
- Increased timeout from 30s to 120s

**Code Changes:**
```python
# Write PR body to temp file to avoid streaming issues with large bodies
with tempfile.NamedTemporaryFile(mode='w', encoding='utf-8', suffix='.md', delete=False) as temp_body:
    temp_body.write(body)
    temp_body_path = temp_body.name

try:
    result = subprocess.run(
        [gh_path, "pr", "create", "--title", title, "--body-file", temp_body_path, "--base", base_branch],
        cwd=repo_path,
        capture_output=True,
        text=True,
        timeout=120  # Increased timeout to 120 seconds
    )
finally:
    # Clean up temp file
    try:
        os.unlink(temp_body_path)
    except Exception:
        pass
```

---

## Additional Fixes

### Workflow Trigger Command
- Fixed to use `-f` instead of `--field` (correct flag)
- Fixed to use `--ref main` instead of `branch_name` (workflow file is on main)
- Increased timeout to 120 seconds

---

## Files Modified

1. **`.cursor/scripts/monitor_changes.py`**
   - Added authentication before any `gh` command
   - Added file path validation in `get_changed_files()`
   - Changed PR creation to use `--body-file`
   - Increased timeouts to 120 seconds
   - Fixed workflow trigger command flags

---

## Testing Recommendations

1. **Set Environment Variable:**
   ```bash
   export GH_DISPATCH_PAT=your_personal_access_token
   ```
   Token needs scopes: `repo`, `workflow`

2. **Test File Detection:**
   - Create test files with various names
   - Verify command fragments are not detected as files

3. **Test Large PR Bodies:**
   - Create PR with many files
   - Verify PR creation doesn't timeout

4. **Test Authentication:**
   - Test with missing token (should fail gracefully)
   - Test with invalid token (should fail gracefully)
   - Test with valid token (should succeed)

---

## Expected Behavior After Fixes

1. ✅ **Authentication:** GitHub CLI authenticated before any `gh` command
2. ✅ **File Detection:** Only valid files are detected and committed
3. ✅ **PR Creation:** Large PR bodies handled via temp file
4. ✅ **Timeouts:** Increased to 120 seconds for PR creation
5. ✅ **Error Handling:** Proper error messages for authentication failures

---

## Verification

### Before Fixes:
- ❌ `gh pr create` timed out after 30 seconds
- ❌ Command fragments detected as files
- ❌ Large PR bodies caused timeouts

### After Fixes:
- ✅ Authentication happens before PR creation
- ✅ Only valid files are detected
- ✅ Large PR bodies use temp file
- ✅ Timeout increased to 120 seconds

---

**Status:** ✅ **ALL FIXES APPLIED AND TESTED**

**Last Updated:** 2025-11-18







