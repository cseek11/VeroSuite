# Automatic Startup Setup for Auto-PR Session Management

**Last Updated:** 2025-12-04

This guide explains how to set up automatic session management that:
1. ✅ Starts session when Cursor loads
2. ✅ Starts monitoring when Cursor loads  
3. ✅ Completes session when Cursor closes
4. ✅ Automatically creates PRs when thresholds are met

## Setup Methods

### Method 1: VSCode Tasks (Recommended)

VSCode/Cursor will automatically run the session manager when you open the workspace.

**Status:** ✅ Configured via `.vscode/tasks.json`

The task runs automatically on `folderOpen` and starts:
- Session creation/retrieval
- Monitoring daemon
- Shutdown hooks

### Method 2: Manual PowerShell Script

Run the PowerShell script manually or add it to your startup:

```powershell
.cursor/scripts/start_session_manager.ps1
```

### Method 3: Python Script Directly

Run the Python script directly:

```bash
python .cursor/scripts/start_session_manager.py
```

For background/daemon mode:

```bash
python .cursor/scripts/start_session_manager.py --daemon
```

## How It Works

### Startup Sequence

1. **Session Start**
   - Calls `get_or_create_session_id()` to get/create session
   - Adds session to `auto_pr_sessions.json` for dashboard visibility
   - Session ID format: `cseek_cursor-YYYYMMDD-HHMM`

2. **Monitoring Daemon**
   - Starts `auto_pr_daemon.py` in background
   - Checks for changes every 5 minutes (300 seconds)
   - Tracks file changes in `.cursor/cache/auto_pr_state.json`

3. **Shutdown Hooks**
   - Registers `atexit` handler for normal exit
   - Registers signal handlers (SIGINT, SIGTERM) for forced exit
   - Completes session via `auto_pr_session_manager.py complete`

### PR Creation Triggers

PRs are automatically created when:

- **Time-based:**
  - 4 hours of inactivity (no file changes)
  - 8 hours of total work time

- **Change-based:**
  - 5+ files changed
  - 200+ lines changed

- **Manual:**
  - Run `python .cursor/scripts/monitor_changes.py --force`

## Verification

### Check if Session Manager is Running

```bash
# Check session
python .cursor/scripts/session_cli.py status

# Check daemon process (Windows)
Get-Process python | Where-Object { $_.CommandLine -like "*auto_pr*" }
```

### Check Active Session

```bash
# View session data
Get-Content docs/metrics/auto_pr_sessions.json | ConvertFrom-Json | Select-Object -ExpandProperty active_sessions
```

### Check Monitoring Status

```bash
# Check state file
Get-Content .cursor/cache/auto_pr_state.json | ConvertFrom-Json
```

## Troubleshooting

### Session Not Starting

1. Check if `CURSOR_TRACE_ID` environment variable exists (indicates Cursor is running)
2. Verify Python scripts are executable
3. Check logs in console output

### Daemon Not Running

1. Check if daemon process exists: `Get-Process python`
2. Manually start: `python .cursor/scripts/auto_pr_daemon.py`
3. Check for errors in console

### Session Not Completing on Exit

1. Verify signal handlers are registered
2. Check if `atexit` is working (may not fire on force quit)
3. Manually complete: `python .cursor/scripts/session_cli.py complete`

## Manual Override

If automatic startup isn't working, you can manually:

```bash
# Start session
python .cursor/scripts/session_cli.py start

# Start monitoring
python .cursor/scripts/auto_pr_daemon.py --interval 300

# Complete session
python .cursor/scripts/session_cli.py complete
```

## Next Steps

After setup, the system will:
- ✅ Track all your changes automatically
- ✅ Create PRs when thresholds are met
- ✅ Link PRs to your session
- ✅ Complete session when you close Cursor

Monitor your sessions on the dashboard at `/sessions` route.







