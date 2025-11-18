# Automated PR Creation Usage Guide

**Last Updated:** 2025-11-17

---

## Overview

The automated PR creation system monitors your file changes and automatically creates PRs when smart batching thresholds are met. This ensures accurate REWARD_SCORE tracking while maintaining a practical workflow.

---

## Quick Start

### 1. One-Time Check

Check for changes and create PR if thresholds met:

```bash
python .cursor/scripts/monitor_changes.py --check
```

### 2. Force PR Creation

Create PR immediately (ignore thresholds):

```bash
python .cursor/scripts/monitor_changes.py --check --force
```

### 3. Continuous Monitoring (Daemon)

Run in background to continuously monitor:

```bash
python .cursor/scripts/auto_pr_daemon.py --interval 300
```

---

## Configuration

Edit `.cursor/config/auto_pr_config.yaml` to customize:

```yaml
time_based:
  enabled: true
  inactivity_hours: 4  # Create PR after 4 hours of no changes
  max_work_hours: 8     # Or after 8 hours of work

change_threshold:
  enabled: true
  min_files: 5          # Create PR when 5+ files changed
  min_lines: 200       # Or when 200+ lines changed
```

---

## How It Works

### Trigger Conditions

PRs are created automatically when **any** of these conditions are met:

1. **Time-Based:**
   - 4 hours of inactivity (no file changes)
   - OR 8 hours of continuous work

2. **Change Threshold:**
   - 5+ files changed
   - OR 200+ lines changed

3. **Manual Override:**
   - Run with `--force` flag

### Process Flow

```
You work on files
    ↓
Files tracked in state
    ↓
Threshold met (time or change)
    ↓
Files grouped logically
    ↓
PR created automatically
    ↓
REWARD_SCORE runs automatically
    ↓
File-level scores computed
    ↓
PR comment posted
```

---

## Examples

### Example 1: Time-Based Trigger

```bash
# You work on files for 4 hours
# No changes for 4 hours
# → Auto-PR created automatically
```

### Example 2: Change Threshold

```bash
# You modify 5 files
# → Auto-PR created automatically
```

### Example 3: Manual Trigger

```bash
# You want PR now (before threshold)
python .cursor/scripts/monitor_changes.py --check --force
# → PR created immediately
```

---

## Integration with REWARD_SCORE

Once a PR is created:

1. **REWARD_SCORE automation runs automatically** (~5-10 minutes)
2. **File-level scoring** computes score for each file
3. **PR comment posted** with score and file breakdown
4. **Metrics collected** including file-level data

**No additional steps needed!**

---

## Best Practices

1. **Let it run automatically:** Don't manually create PRs unless needed
2. **Adjust thresholds:** Tune config based on your workflow
3. **Use force sparingly:** Only when you need immediate PR
4. **Monitor state:** Check `.cursor/cache/auto_pr_state.json` if needed

---

## Troubleshooting

### PRs Not Creating?

1. **Check thresholds:** Verify config thresholds are reasonable
2. **Check state:** Look at `.cursor/cache/auto_pr_state.json`
3. **Check git status:** Ensure files are actually changed
4. **Check logs:** Review logger output

### Too Many PRs?

1. **Increase thresholds:** Raise `min_files` or `min_lines`
2. **Increase time:** Raise `inactivity_hours`
3. **Disable triggers:** Set `enabled: false` in config

### Too Few PRs?

1. **Decrease thresholds:** Lower `min_files` or `min_lines`
2. **Decrease time:** Lower `inactivity_hours`
3. **Use force:** Create PRs manually when needed

---

## Advanced Usage

### Custom Branch Name

Edit `create_pr.py` to customize branch naming.

### Custom PR Title/Body

Edit `generate_pr_title()` and `generate_pr_body()` in `monitor_changes.py`.

### File System Watchers

For real-time monitoring, integrate with `watchdog` library (future enhancement).

---

**Status:** ✅ **READY FOR USE**

The automated PR creation system is now fully implemented and ready to use!


