# Auto-PR System Backup Manifest

**Backup Date:** 2025-11-21 20:42:36  
**Backup Location:** `.cursor/backups/auto_pr_backup_2025-11-21_20-42-36/`  
**Reason:** Full redesign of Auto-PR system

---

## Files Backed Up

### Python Scripts (`.cursor/scripts/`)
1. `auto_pr_session_manager.py` - Main session manager
2. `monitor_changes.py` - File change monitoring and PR creation
3. `session_cli.py` - CLI tool for session management
4. `compute_reward_score.py` - Reward score computation (with session batching)

### Configuration Files (`.cursor/config/`)
1. `auto_pr_config.yaml` - Auto-PR configuration
2. `session_config.yaml` - Session management configuration
3. `.cursor/commands/session.json` - Cursor IDE commands

### Documentation (`docs/Auto-PR/`)
- All documentation files in `docs/Auto-PR/` directory

### GitHub Workflows (`.github/workflows/`)
1. `auto_pr_session_manager.yml` - Session management workflow
2. `session_health_check.yml` - Health check workflow

### Frontend Components (`frontend/src/`)
1. `frontend/src/components/dashboard/AutoPRSessionManager.tsx` - React component
2. `frontend/src/hooks/useAutoPRSessions.ts` - React hook

### State/Cache Files
1. `.cursor/cache/auto_pr_state.json` - Current state file
2. `docs/metrics/auto_pr_sessions.json` - Session metrics

### Root Documentation
1. `AUTO_PR_SYSTEM_AUDIT_REPORT.md` - Audit report
2. `AUTO_PR_SYSTEM_COMPREHENSIVE_REPORT.md` - Comprehensive report (if exists)

---

## Backup Structure

```
.cursor/backups/auto_pr_backup_2025-11-21_20-42-36/
├── scripts/
│   ├── auto_pr_session_manager.py
│   ├── monitor_changes.py
│   ├── session_cli.py
│   └── compute_reward_score.py
├── config/
│   ├── auto_pr_config.yaml
│   ├── session_config.yaml
│   └── session.json
├── docs/
│   └── [All Auto-PR documentation files]
├── workflows/
│   ├── auto_pr_session_manager.yml
│   └── session_health_check.yml
├── frontend/
│   ├── AutoPRSessionManager.tsx
│   └── useAutoPRSessions.ts
├── cache/
│   ├── auto_pr_state.json
│   └── auto_pr_sessions.json
├── root/
│   ├── AUTO_PR_SYSTEM_AUDIT_REPORT.md
│   └── AUTO_PR_SYSTEM_COMPREHENSIVE_REPORT.md
└── BACKUP_MANIFEST.md (this file)
```

---

## Restoration Instructions

To restore from this backup:

1. **Scripts:** Copy files from `scripts/` to `.cursor/scripts/`
2. **Config:** Copy files from `config/` to `.cursor/config/`
3. **Workflows:** Copy files from `workflows/` to `.github/workflows/`
4. **Frontend:** Copy files from `frontend/` to `frontend/src/components/dashboard/` and `frontend/src/hooks/`
5. **State:** Copy files from `cache/` to `.cursor/cache/` and `docs/metrics/`
6. **Documentation:** Copy files from `docs/` to `docs/Auto-PR/`
7. **Root:** Copy files from `root/` to repository root

---

**Note:** This backup was created before a full redesign of the Auto-PR system. All files are preserved for reference and potential restoration.







