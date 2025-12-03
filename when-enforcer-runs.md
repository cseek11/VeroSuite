# When Does the Auto-Enforcer Run?

**Last Updated:** 2025-12-01

---

## Automatic Triggers

### 1. **File Watcher (Primary Method)** 🔄

**Script:** `.cursor/scripts/watch-files.py`

**When it runs:**
- **On file changes** in watched directories:
  - `apps/`
  - `libs/`
  - `frontend/`
  - `VeroFieldMobile/`
  - `.cursor/memory-bank/`
  - `.cursor/rules/`

**How it works:**
1. File watcher monitors directories for changes
2. **Debounces** rapid changes (2-second delay)
3. Triggers `auto-enforcer.py` after debounce period
4. Runs **initial check** when watcher starts

**Trigger conditions:**
- File modified (`modified` event)
- File created (`created` event)
- File moved (`moved` event)

**Skipped files:**
- `.cursor/enforcement/` (to avoid recursion)
- Binary files (`.pyc`, `.pyo`, `.dll`, `.exe`, etc.)
- Build directories (`node_modules`, `.git`, `__pycache__`, `dist`, `build`)

**How to start:**
```bash
# Manual start
python .cursor/scripts/watch-files.py

# Or via VS Code task (auto-starts on folder open)
# Task: "Start Auto-Enforcement System"
```

---

### 2. **VS Code Auto-Start** 🚀

**File:** `.vscode/tasks.json`

**When it runs:**
- **Automatically on folder open** (if task enabled)
- Task: "Start Auto-Enforcement System"
- Runs `watch-files.py` in background

**Configuration:**
```json
{
  "label": "Start Auto-Enforcement System",
  "command": "python ${workspaceFolder}/.cursor/scripts/watch-files.py",
  "runOptions": {
    "runOn": "folderOpen"
  },
  "isBackground": true
}
```

---

## Manual Execution

### 3. **Direct Script Execution** 🖱️

**Command:**
```bash
python .cursor/scripts/auto-enforcer.py
```

**When to use:**
- One-time compliance check
- Testing enforcement rules
- Pre-commit validation
- CI/CD pipeline integration

**VS Code Task:**
- Task: "Run Enforcement Check"
- Shortcut: Run task from VS Code command palette

---

## What Happens When Enforcer Runs

### Execution Flow:

1. **Initialization:**
   - Loads session state
   - Initializes predictive context management (if available)
   - Sets up violation tracking

2. **Compliance Checks:**
   - Memory Bank compliance (6 files, staleness)
   - Hardcoded date detection
   - Security compliance
   - Active context update verification
   - Error handling patterns
   - Structured logging compliance
   - Python Bible compliance
   - Bug logging validation

3. **Context Management (if available):**
   - Detects current task from file changes
   - Updates workflow tracker
   - Generates predictions
   - Updates context recommendations
   - Generates dynamic rule file
   - Updates dashboard

4. **Status Generation:**
   - Generates `AGENT_STATUS.md`
   - Generates `VIOLATIONS.md`
   - Generates `AGENT_REMINDERS.md`
   - Generates `AUTO_FIXES.md`

5. **Return Status:**
   - Returns `0` if no blocked violations
   - Returns `1` if blocked violations found

---

## File Watcher Details

### Watched Directories:
```python
WATCH_DIRECTORIES = [
    "apps",              # Backend services
    "libs",              # Shared libraries
    "frontend",          # React web app
    "VeroFieldMobile",   # React Native app
    ".cursor/memory-bank",  # Memory Bank files
    ".cursor/rules"      # Rule files
]
```

### Debounce Behavior:
- **Default delay:** 2 seconds
- **Purpose:** Prevents excessive runs from rapid file changes
- **How it works:**
  1. File change detected → Start 2-second timer
  2. If another change occurs → Cancel timer, restart
  3. After 2 seconds of no changes → Trigger enforcer

### Initial Check:
- Runs **immediately** when file watcher starts
- Ensures compliance check on startup
- Updates context recommendations

---

## Current Status

### Is the File Watcher Running?

**Check if running:**
- Look for `watch-files.py` process
- Check VS Code tasks (background tasks panel)
- Check logs for "File watcher started" message

**Start manually:**
```bash
# In project root
python .cursor/scripts/watch-files.py
```

**Stop:**
- Press `Ctrl+C` in terminal
- Or close VS Code (if auto-started)

---

## Integration Points

### CI/CD Integration:
- **Not currently integrated** in GitHub Actions workflows
- Can be added to pre-commit hooks
- Can be added to CI pipeline

### Pre-Commit Hook (Potential):
```bash
# .git/hooks/pre-commit
python .cursor/scripts/auto-enforcer.py
```

### VS Code Integration:
- ✅ Auto-start task configured
- ✅ Manual run task available
- ✅ Background process support

---

## Summary

**The enforcer runs:**

1. ✅ **Automatically** when files change (if file watcher is running)
2. ✅ **On folder open** (if VS Code task enabled)
3. ✅ **Manually** via command or VS Code task
4. ⚠️ **Not in CI/CD** (currently - can be added)

**Most common scenario:**
- File watcher runs in background
- Detects file changes
- Debounces for 2 seconds
- Triggers enforcer automatically
- Updates context recommendations
- Generates status files

---

**To ensure enforcer is running:**
1. Start file watcher: `python .cursor/scripts/watch-files.py`
2. Or enable VS Code task: "Start Auto-Enforcement System"
3. Make a file change in watched directory
4. Check `.cursor/enforcement/AGENT_STATUS.md` for updates








