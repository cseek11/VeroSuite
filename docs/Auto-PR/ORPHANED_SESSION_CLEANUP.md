# Orphaned Session Cleanup

**Last Updated:** 2025-11-19

## Problem

When Cursor closes, sessions may not be automatically completed because:
- VSCode tasks don't have a `folderClose` event
- The `atexit` handler only runs if the Python process exits gracefully
- If Cursor closes abruptly, sessions remain active

## Solution

### Automatic Cleanup on Startup

The `start_session_manager.py` script now automatically:
1. Completes orphaned sessions from previous Cursor sessions on startup
2. Uses a 1-minute inactivity threshold to identify orphaned sessions
3. Completes them before starting a new session

### Manual Cleanup

You can manually complete orphaned sessions anytime:

```bash
python .cursor/scripts/complete_orphaned_sessions.py
```

**Options:**
- `--max-inactivity-minutes N` - Sessions inactive longer than N minutes will be completed (default: 5)

**Examples:**
```bash
# Complete sessions inactive for 5+ minutes (default)
python .cursor/scripts/complete_orphaned_sessions.py

# Complete sessions inactive for 1+ minute
python .cursor/scripts/complete_orphaned_sessions.py --max-inactivity-minutes 1

# Complete sessions inactive for 30+ minutes
python .cursor/scripts/complete_orphaned_sessions.py --max-inactivity-minutes 30
```

## How It Works

1. **On Cursor Startup:**
   - `start_session_manager.py` runs automatically (via `.vscode/tasks.json`)
   - Calls `complete_orphaned_sessions.py` with 1-minute threshold
   - Completes any sessions from previous Cursor sessions
   - Starts new session and monitoring

2. **Manual Cleanup:**
   - Finds all active sessions
   - Checks `last_activity` timestamp
   - Completes sessions inactive longer than threshold
   - Uses `auto_pr_session_manager.py` to properly complete sessions

## Verification

Check active sessions:
```bash
python .cursor/scripts/session_cli.py status
```

Should show:
```
Active sessions: 0
```

Or check the JSON file:
```bash
# PowerShell
Get-Content docs/metrics/auto_pr_sessions.json | ConvertFrom-Json | Select-Object -ExpandProperty active_sessions | Measure-Object
```

## Troubleshooting

**Issue:** Sessions still showing as active after Cursor closes
**Fix:** Run cleanup manually:
```bash
python .cursor/scripts/complete_orphaned_sessions.py --max-inactivity-minutes 1
```

**Issue:** Too many sessions being completed
**Fix:** Increase the threshold:
```bash
python .cursor/scripts/complete_orphaned_sessions.py --max-inactivity-minutes 30
```

**Issue:** Sessions not completing on startup
**Fix:** Check that `start_session_manager.py` is being called (check `.vscode/tasks.json`)

## Integration

The cleanup is integrated into:
- ✅ `start_session_manager.py` - Runs on Cursor startup
- ✅ `complete_orphaned_sessions.py` - Standalone cleanup script
- ✅ Automatic via VSCode task on folder open

## Next Steps

1. **Test:** Close and reopen Cursor - orphaned sessions should be completed automatically
2. **Monitor:** Check session status after closing Cursor
3. **Adjust:** Modify `--max-inactivity-minutes` if needed






