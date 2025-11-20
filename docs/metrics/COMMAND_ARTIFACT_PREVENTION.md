# Command Artifact Prevention

**Last Updated:** 2025-11-19

## Problem

Accidental files were created that looked like PowerShell/CLI command fragments:
- `"t --workflow=swarm_compute_reward_score.yml --limit 1 --json databaseId,status,conclusion,event,workflowName \357\201\274 ConvertFrom-Json \357\201\274 Format-List"`
- `"t --workflow=update_metrics_dashboard.yml --limit 1 --json databaseId,status,conclusion \357\201\274 ConvertFrom-Json \357\201\274 Format-List"`
- `"t n"`

## Root Cause

These files were likely created when:
1. **PowerShell command redirection error**: Someone tried to run a GitHub CLI command but used `>` instead of `|`, causing output to be saved as a file
2. **Command copy-paste error**: A command was accidentally saved as a file instead of being executed
3. **Typo in command**: A typo (like `"t n"` instead of `git`) created an invalid filename

The `\357\201\274` is the UTF-8 encoding for the pipe character `|` in PowerShell, indicating these were PowerShell commands.

## Prevention Measures Implemented

### 1. Enhanced File Exclusion in `monitor_changes.py`

**File:** `.cursor/scripts/monitor_changes.py`

**Changes:**
- Added `is_excluded()` function enhancements to filter command-like filenames
- Added early filtering in `get_changed_files()` to skip suspicious files before processing
- Detects patterns like:
  - `gh run list`, `gh workflow`, `gh pr list`
  - `ConvertFrom-Json`, `Format-List`
  - `--workflow=`, `--limit`, `--json`
  - Files starting with quotes containing CLI syntax
  - Very short filenames with spaces (likely typos)

**Code:**
```python
def is_excluded(file_path: str, config: Dict) -> bool:
    """Check if file path should be excluded from tracking."""
    # ... existing exclusion logic ...
    
    # CRITICAL: Filter out command-like filenames
    suspicious_patterns = [
        "gh run list", "gh workflow", "gh pr list",
        "ConvertFrom-Json", "Format-List",
        "--workflow=", "--limit", "--json", "databaseId", "status", "conclusion"
    ]
    
    # Filter files starting with quotes containing CLI syntax
    if file_path.startswith('"') and ("--" in file_path or "|" in file_path):
        return True
    
    # Filter very short suspicious filenames
    if len(file_path.strip('"').strip()) <= 3 and " " in file_path:
        return True
```

### 2. Updated `.gitignore`

**File:** `.gitignore`

**Added patterns:**
```
# Prevent accidental command artifacts from being tracked
"t --workflow=*"
"t n"
*ConvertFrom-Json*
*Format-List*
*gh run list*
*gh workflow*
*--workflow=*
*--limit*
*--json*
```

### 3. Early Filtering in `get_changed_files()`

**File:** `.cursor/scripts/monitor_changes.py`

**Changes:**
- Added validation before processing files
- Skips files that look like command fragments immediately
- Logs skipped files for debugging

## How It Works

1. **Git Status Check**: When `get_changed_files()` runs, it gets all changed files from git
2. **Early Filtering**: Before processing, it checks if the filename contains suspicious patterns
3. **Exclusion Check**: Files that pass early filtering are checked against `is_excluded()`
4. **Logging**: Suspicious files are logged for debugging but not tracked

## Testing

To verify the prevention works:

```python
from monitor_changes import is_excluded, load_config

config = load_config()

# These should be excluded
assert is_excluded('"t --workflow=swarm_compute_reward_score.yml"', config) == True
assert is_excluded('t n', config) == True
assert is_excluded('file_with_ConvertFrom-Json.txt', config) == True

# These should NOT be excluded
assert is_excluded('normal_file.py', config) == False
assert is_excluded('src/components/Button.tsx', config) == False
```

## Best Practices

To prevent command artifacts in the future:

1. **Use proper command syntax**: Always use `|` for piping, not `>`
2. **Verify before saving**: Check if a command creates a file before running it
3. **Use quotes carefully**: Be careful with quotes in PowerShell commands
4. **Check git status**: Regularly check `git status` for unexpected files

## Related Files

- `.cursor/scripts/monitor_changes.py` - Main filtering logic
- `.gitignore` - Git-level exclusion patterns
- `.github/workflows/update_metrics_dashboard.yml` - Contains the original command pattern

## Status

✅ **IMPLEMENTED** - Prevention measures are in place and will automatically filter out command-like filenames.









