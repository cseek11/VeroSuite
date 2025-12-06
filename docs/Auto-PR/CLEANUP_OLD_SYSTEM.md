# Cleanup Old Auto-PR System

**Last Updated:** 2025-12-05

This guide helps you remove old session management systems to prevent conflicts with the new automatic system.

## What Was Found

1. **Scheduled Task:** `VeroField_AutoPR_Daemon` (Ready state)
   - Last run: 2025-12-05 4:24 PM
   - Runs: `start_auto_pr_daemon.ps1`
   - **Status:** Needs to be disabled (requires admin rights)

2. **Old Script:** `.cursor/scripts/start_auto_pr_daemon.ps1`
   - **Status:** Should be removed or renamed to prevent conflicts

## Automatic Cleanup

The new `start_session_manager.py` automatically:
- ✅ Stops any running conflicting processes on startup
- ✅ Checks for and stops old daemon processes
- ✅ Cleans up PID files

## Manual Cleanup Steps

### Step 1: Disable Old Scheduled Task (Requires Admin)

**Option A: PowerShell (Run as Administrator)**
```powershell
Disable-ScheduledTask -TaskName "VeroField_AutoPR_Daemon"
```

**Option B: Task Scheduler GUI**
1. Open Task Scheduler (`taskschd.msc`)
2. Find task: `VeroField_AutoPR_Daemon`
3. Right-click → Disable

**Option C: Remove Completely (Optional)**
```powershell
Unregister-ScheduledTask -TaskName "VeroField_AutoPR_Daemon" -Confirm:$false
```

### Step 2: Stop All Running Processes

```bash
python .cursor/scripts/stop_all_session_managers.py
```

This will:
- Stop all Python processes related to session management
- Clean up PID files
- Prevent conflicts

### Step 3: Rename/Remove Old Scripts (Optional)

If you want to keep them for reference:
```powershell
Rename-Item .cursor/scripts/start_auto_pr_daemon.ps1 .cursor/scripts/start_auto_pr_daemon.ps1.old
```

Or delete them:
```powershell
Remove-Item .cursor/scripts/start_auto_pr_daemon.ps1
```

## Verification

After cleanup, verify:

1. **No old scheduled task running:**
   ```powershell
   Get-ScheduledTask -TaskName "VeroField_AutoPR_Daemon" | Select-Object State
   ```
   Should show: `State: Disabled` or task not found

2. **No conflicting processes:**
   ```bash
   python .cursor/scripts/stop_all_session_managers.py
   ```
   Should show: `✅ Stopped 0 session manager process(es)`

3. **New system works:**
   ```bash
   python .cursor/scripts/start_session_manager.py
   ```
   Should start without conflicts

## New System Files

The new automatic system uses:
- ✅ `.vscode/tasks.json` - Runs on Cursor open
- ✅ `.cursor/scripts/start_session_manager.py` - Main startup script
- ✅ `.cursor/scripts/stop_all_session_managers.py` - Cleanup script
- ✅ `.cursor/scripts/auto_pr_daemon.py` - Monitoring daemon (enhanced)

## Troubleshooting

**Issue:** "Access is denied" when disabling scheduled task
**Fix:** Run PowerShell as Administrator

**Issue:** Old processes still running
**Fix:** Run `stop_all_session_managers.py` manually

**Issue:** Conflicts between old and new system
**Fix:** Complete all cleanup steps above

## Next Steps

After cleanup:
1. Close and reopen Cursor
2. New system will start automatically via `.vscode/tasks.json`
3. Old system will not interfere







