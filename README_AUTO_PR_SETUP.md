# Auto-PR System Setup Guide

**Last Updated:** 2025-11-18

## Problem: PRs Not Creating Automatically

The Auto-PR system requires a **daemon process** to be running continuously. If the daemon is not running, PRs will not be created automatically.

## Quick Fix: Start the Daemon

### Windows (PowerShell)

```powershell
cd .cursor\scripts
.\start_auto_pr_daemon.ps1
```

This will:
- Start the daemon in the background
- Check for changes every 5 minutes
- Create PRs automatically when thresholds are met

### Check Status

```powershell
cd .cursor\scripts
.\check_auto_pr_status.ps1
```

### Stop Daemon

```powershell
cd .cursor\scripts
.\stop_auto_pr_daemon.ps1
```

## Make It Automatic (Windows)

### Option 1: Windows Task Scheduler (Recommended)

Set up the daemon to start automatically when you log in:

```powershell
# Run PowerShell as Administrator
cd .cursor\scripts
.\setup_windows_task.ps1
```

This creates a scheduled task that starts the daemon on login.

### Option 2: Manual Start

Simply run `.\start_auto_pr_daemon.ps1` whenever you start working.

## How It Works

1. **Daemon runs continuously** - Checks for changes every 5 minutes
2. **Tracks file changes** - Monitors all modified files
3. **Creates PRs when thresholds met:**
   - 5+ files changed
   - 200+ lines changed
   - 4 hours of inactivity
   - 8 hours of continuous work

## Troubleshooting

### PRs Still Not Creating?

1. **Check if daemon is running:**
   ```powershell
   .\check_auto_pr_status.ps1
   ```

2. **Check tracked files:**
   - The status script shows how many files are being tracked
   - If 0 files, no changes have been detected

3. **Check thresholds:**
   - Edit `.cursor/config/auto_pr_config.yaml`
   - Lower `min_files` or `min_lines` if needed

4. **Force create PR:**
   ```powershell
   python .cursor\scripts\monitor_changes.py --check --force
   ```

### Daemon Not Starting?

1. **Check Python is installed:**
   ```powershell
   python --version
   ```

2. **Check log file:**
   - `.cursor/cache/auto_pr_daemon.log`

3. **Check permissions:**
   - Ensure you have write access to `.cursor/cache/`

## Configuration

Edit `.cursor/config/auto_pr_config.yaml` to customize:

```yaml
change_threshold:
  enabled: true
  min_files: 5      # Lower this to create PRs with fewer files
  min_lines: 200    # Lower this to create PRs with fewer lines

time_based:
  enabled: true
  inactivity_hours: 4  # Create PR after 4 hours of no changes
```

## Next Steps

1. ✅ **Start the daemon** (see Quick Fix above)
2. ✅ **Make it automatic** (see Option 1 above)
3. ✅ **Work on your code** - PRs will be created automatically!

---

**Status:** The Auto-PR system is working, but requires the daemon to be running for automatic operation.

