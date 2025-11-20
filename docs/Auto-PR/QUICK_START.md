# Auto-PR Session Management - Quick Start Guide

**Last Updated:** 2025-11-19

---

## 🚀 Quick Start (5 Minutes)

### ✅ Automatic Setup (Recommended)

**The system is now fully automatic!** When you open Cursor:

1. ✅ **Session starts automatically** (via `.vscode/tasks.json`)
2. ✅ **Monitoring starts automatically** (daemon runs in background)
3. ✅ **PRs created automatically** when thresholds are met
4. ✅ **Session completes automatically** when Cursor closes

**No manual steps required!** Just open Cursor and start coding.

See `docs/Auto-PR/AUTOMATIC_STARTUP_SETUP.md` for details.

### Manual Commands (If Needed)

If automatic startup isn't working:

### 1. Check System Status

```bash
python .cursor/scripts/session_cli.py status
```

**Expected Output:**
```
📦 Active session: cseek_cursor-20251119-1430
Status: active
PRs in Session: 3
```

### 2. Start a New Session (Optional)

```bash
python .cursor/scripts/session_cli.py start
```

Or start the full manager:
```bash
python .cursor/scripts/start_session_manager.py
```

### 3. Complete Current Session

```bash
python .cursor/scripts/session_cli.py complete
```

### 4. Generate Analytics

```bash
python .cursor/scripts/session_analytics.py
```

**Output:** `docs/metrics/analytics/session_analytics_YYYYMMDD.md`

---

## 📋 Common Commands

| Command | Purpose |
|---------|---------|
| `session_cli.py status` | Check current session |
| `session_cli.py start` | Start new session |
| `session_cli.py complete` | Complete session |
| `session_cli.py clear` | Clear session |
| `session_analytics.py` | Generate report |
| `monitor_sessions.py` | Health check |
| `validate_config.py` | Validate config |

---

## 🔗 Quick Links

- **GitHub Workflow:** https://github.com/cseek11/VeroSuite/actions/workflows/auto_pr_session_manager.yml
- **Health Check:** https://github.com/cseek11/VeroSuite/actions/workflows/session_health_check.yml
- **Full Guide:** `docs/Auto-PR/ACCESS_GUIDE.md`

---

## ⚡ How It Works

1. **Automatic Startup:** Session and monitoring start when Cursor opens
2. **Automatic Monitoring:** File changes tracked continuously (every 5 minutes)
3. **Automatic PR Creation:** PRs created when thresholds are met:
   - ⏰ 4 hours of inactivity
   - ⏰ 8 hours of total work time
   - 📁 5+ files changed
   - 📝 200+ lines changed
4. **Automatic Session Completion:** Session completes when Cursor closes
5. **Batching:** Related PRs grouped into sessions
6. **Scoring:** Session scored as one unit when complete
7. **Analytics:** Reports generated automatically

---

## 🆘 Troubleshooting

**Issue:** "Session hooks not available"  
**Fix:** Already resolved - hooks are integrated ✅

**Issue:** "No sessions found"  
**Fix:** Create a PR - session will be created automatically

**Issue:** "Invalid JSON"  
**Fix:** Already fixed - encoding corrected ✅

**Issue:** "Multiple daemons running" or conflicts  
**Fix:** Run cleanup script:
```bash
python .cursor/scripts/stop_all_session_managers.py
```
Then restart Cursor. See `docs/Auto-PR/CLEANUP_OLD_SYSTEM.md` for details.

**Issue:** "Old scheduled task conflicts"  
**Fix:** Disable old task (requires admin):
```powershell
# Run PowerShell as Administrator
Disable-ScheduledTask -TaskName "VeroField_AutoPR_Daemon"
```
See `docs/Auto-PR/CONFLICT_PREVENTION_SUMMARY.md` for complete cleanup guide.

**Issue:** "Sessions still active after closing Cursor"  
**Fix:** Orphaned sessions are automatically completed on next Cursor startup. To manually complete:
```bash
python .cursor/scripts/complete_orphaned_sessions.py --max-inactivity-minutes 1
```
See `docs/Auto-PR/ORPHANED_SESSION_CLEANUP.md` for details.

---

**For detailed information, see:** `docs/Auto-PR/ACCESS_GUIDE.md`


