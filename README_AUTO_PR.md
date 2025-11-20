# Automated PR Creation - Quick Start

**Last Updated:** 2025-11-17

## What It Does

Automatically creates PRs when you've made enough changes, ensuring accurate REWARD_SCORE tracking without manual PR creation.

## Quick Commands

### Check Once (Recommended)
```bash
python .cursor/scripts/monitor_changes.py --check
```

### Force Create PR Now
```bash
python .cursor/scripts/monitor_changes.py --check --force
```

### Run Continuously (Background)
```bash
python .cursor/scripts/auto_pr_daemon.py
```

## When PRs Are Created

PRs are created automatically when:
- ✅ **4 hours** of inactivity (no file changes)
- ✅ **5+ files** changed
- ✅ **200+ lines** changed
- ✅ **Manual trigger** (`--force` flag)

## Configuration

Edit `.cursor/config/auto_pr_config.yaml` to customize thresholds.

## Integration

Once PR is created:
1. REWARD_SCORE runs automatically (~5-10 min)
2. File-level scores computed
3. PR comment posted
4. Metrics collected

**No manual steps needed!**

---

For detailed documentation, see `docs/planning/AUTO_PR_USAGE_GUIDE.md`

