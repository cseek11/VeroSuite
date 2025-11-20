# Auto-PR Session Management - Quick Start Guide

**Last Updated:** 2025-11-19

---

## 🚀 Quick Start (5 Minutes)

### 1. Check System Status

```bash
python .cursor/scripts/session_cli.py status
```

**Expected Output:**
```
📦 Active session: user-20251119-1430
Status: active
PRs in Session: 3
```

### 2. Start a New Session (Optional)

```bash
python .cursor/scripts/session_cli.py start
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

1. **Automatic:** Sessions created automatically when PRs are made
2. **Batching:** Related PRs grouped into sessions
3. **Scoring:** Session scored as one unit when complete
4. **Analytics:** Reports generated automatically

---

## 🆘 Troubleshooting

**Issue:** "Session hooks not available"  
**Fix:** Already resolved - hooks are integrated ✅

**Issue:** "No sessions found"  
**Fix:** Create a PR - session will be created automatically

**Issue:** "Invalid JSON"  
**Fix:** Already fixed - encoding corrected ✅

---

**For detailed information, see:** `docs/Auto-PR/ACCESS_GUIDE.md`

