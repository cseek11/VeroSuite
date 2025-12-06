# Auto-PR Session Management System - Access Guide

**Last Updated:** 2025-12-05  
**Status:** System Operational ✅

---

## Quick Access Summary

### ✅ Available Now

1. **CLI Tools** - Command-line interface for session management
2. **Analytics Reports** - Markdown reports generated automatically
3. **GitHub Actions Dashboard** - Workflow status and session management
4. **Session State Files** - Direct JSON file access

### ⏳ Coming Soon

1. **React Dashboard** - Frontend component (reference design exists, needs integration)

---

## 1. CLI Access (Primary Method)

### Session Management CLI

**Location:** `.cursor/scripts/session_cli.py`

**Commands:**

```bash
# Check current session status
python .cursor/scripts/session_cli.py status

# Start a new session
python .cursor/scripts/session_cli.py start

# Complete current session
python .cursor/scripts/session_cli.py complete

# Clear session (without completing)
python .cursor/scripts/session_cli.py clear
```

**Example Output:**
```
Current Session: user-20251119-1430
Status: active
PRs in Session: 3
Started: 2025-12-05T14:30:00Z
Last Activity: 2025-12-05T15:45:00Z
```

### Analytics CLI

**Location:** `.cursor/scripts/session_analytics.py`

**Commands:**

```bash
# Generate analytics report (default: last 30 days)
python .cursor/scripts/session_analytics.py

# Generate report for specific date range
python .cursor/scripts/session_analytics.py --start-date 2025-12-05 --end-date 2025-12-05

# Output to specific file
python .cursor/scripts/session_analytics.py --output-file my_report.md
```

**Output Location:** `docs/metrics/analytics/session_analytics_YYYYMMDD.md`

---

## 2. GitHub Actions Dashboard

### Access Workflow Status

**URL:**
```
https://github.com/cseek11/VeroSuite/actions/workflows/auto_pr_session_manager.yml
```

**Features:**
- View active session checks
- Monitor session completion
- See orphaned session cleanup
- Review workflow logs

### Manual Session Operations

**Via Issue Comments:**
- Comment `/complete-session` on a PR to manually complete a session
- Comment `/session-status` to check current session status

**Via Workflow Dispatch:**
- Go to Actions → `auto_pr_session_manager.yml` → Run workflow
- Select operation: `check`, `complete`, or `cleanup`

---

## 3. Direct File Access

### Session State File

**Location:** `.cursor/data/session_state.json`

**Structure:**
```json
{
  "sessions": {
    "user-20251119-1430": {
      "author": "alice",
      "started": "2025-12-05T14:30:00Z",
      "last_activity": "2025-12-05T15:45:00Z",
      "prs": ["#326", "#327", "#328"],
      "status": "active"
    }
  },
  "current_session": "user-20251119-1430"
}
```

**Read Only:** Use CLI tools to modify (file is managed by system)

### Analytics Data File

**Location:** `docs/metrics/auto_pr_sessions.json`

**Structure:**
```json
{
  "sessions": [
    {
      "session_id": "user-20251119-1430",
      "author": "alice",
      "started": "2025-12-05T14:30:00Z",
      "completed": "2025-12-05T16:00:00Z",
      "prs": ["#326", "#327", "#328"],
      "score": 7.5,
      "duration_minutes": 90
    }
  ]
}
```

---

## 4. React Dashboard (Reference Design)

### Status: ⏳ Not Yet Integrated

**Reference Design:** `docs/Auto-PR/Auto-PR Session Management System.txt`

**To Implement:**

1. **Copy component code** from reference design
2. **Create component file:**
   ```
   frontend/src/components/AutoPRSessionManager.tsx
   ```
3. **Add route** (if using routing):
   ```typescript
   <Route path="/sessions" component={AutoPRSessionManager} />
   ```
4. **Connect to API** (modify `loadSessions()` to fetch from backend)

**Features (from reference design):**
- Real-time session status
- Active sessions list
- Completed sessions history
- Statistics dashboard
- Analytics view
- Session details modal

**Note:** The reference design uses mock data. You'll need to:
- Create API endpoint to serve session data
- Update `loadSessions()` to fetch from API
- Configure CORS if needed

---

## 5. Daemon Status

### Auto-PR Daemon

**Location:** `.cursor/scripts/auto_pr_daemon.py`

**Status:** ✅ **Working** - Session hooks integrated

**Check Status:**
```bash
# Check if daemon is running
ps aux | grep auto_pr_daemon

# Or on Windows:
Get-Process | Where-Object {$_.ProcessName -like "*python*"} | Select-Object ProcessName, Id
```

**Start Daemon:**
```bash
# Run in background
python .cursor/scripts/auto_pr_daemon.py --interval 60 &

# Or on Windows (PowerShell):
Start-Process python -ArgumentList ".cursor/scripts/auto_pr_daemon.py", "--interval", "60" -WindowStyle Hidden
```

**Session Integration:**
- ✅ Session hooks imported
- ✅ Session metadata added to PRs automatically
- ✅ Session ID tracking enabled
- ✅ Logging includes session context

**Logs:**
- Check logs for `session_hooks_available: true`
- Session operations logged with trace IDs

---

## 6. Monitoring & Health Checks

### Health Check Workflow

**Location:** `.github/workflows/session_health_check.yml`

**Schedule:** Daily at 00:00 UTC

**Access:**
```
https://github.com/cseek11/VeroSuite/actions/workflows/session_health_check.yml
```

**Checks:**
- Orphaned session count
- Average session duration
- State file size
- Workflow failure rate

### Manual Health Check

```bash
python .cursor/scripts/monitor_sessions.py
```

**Output:**
```
Health Check Results:
- Active Sessions: 2
- Orphaned Sessions: 0
- State File Size: 2.5 KB
- Average Duration: 45 minutes
Status: HEALTHY
```

---

## 7. Troubleshooting

### Issue: "Session hooks not available"

**Solution:**
```bash
# Verify imports work
python -c "from cursor_session_hook import get_or_create_session_id; print('OK')"

# Check file exists
ls .cursor/scripts/cursor_session_hook.py
```

### Issue: "Invalid JSON in session data file"

**Solution:**
```bash
# Fix BOM encoding issue
python -c "
import json
with open('docs/metrics/auto_pr_sessions.json', 'r', encoding='utf-8-sig') as f:
    data = json.load(f)
with open('docs/metrics/auto_pr_sessions.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=2)
"
```

### Issue: "No sessions found"

**Solution:**
- Check if session state file exists: `.cursor/data/session_state.json`
- Verify config: `.cursor/config/session_config.yaml`
- Check permissions on data directory

---

## 8. Quick Reference

### Most Common Commands

```bash
# Check status
python .cursor/scripts/session_cli.py status

# Generate analytics
python .cursor/scripts/session_analytics.py

# Health check
python .cursor/scripts/monitor_sessions.py

# Validate config
python .cursor/scripts/validate_config.py
```

### File Locations

- **Config:** `.cursor/config/session_config.yaml`
- **State:** `.cursor/data/session_state.json`
- **Analytics Data:** `docs/metrics/auto_pr_sessions.json`
- **Analytics Reports:** `docs/metrics/analytics/session_analytics_*.md`
- **CLI:** `.cursor/scripts/session_cli.py`
- **Daemon:** `.cursor/scripts/auto_pr_daemon.py`

---

## 9. Next Steps

### To Access Dashboard (When Implemented)

1. **Frontend Integration:**
   - Copy component from reference design
   - Create API endpoint for session data
   - Add route to frontend router
   - Test with real data

2. **API Endpoint (Example):**
   ```typescript
   // GET /api/sessions
   // Returns: { active_sessions: {...}, completed_sessions: [...] }
   ```

3. **Real-time Updates:**
   - Use WebSocket or polling
   - Update every 30 seconds (as in reference design)

---

## Support

- **Documentation:** `docs/Auto-PR/`
- **Implementation Plan:** `docs/Auto-PR/IMPLEMENTATION_PLAN.md`
- **Compliance Report:** `docs/Auto-PR/IMPLEMENTATION_COMPLIANCE_REPORT.md`

---

**Last Updated:** 2025-12-05

