# How to Enable Auto-Enforcement System on Folder Open

**Last Updated:** 2025-12-01

---

## Current Configuration

The VS Code task is **already configured** in `.vscode/tasks.json`:

```json
{
  "label": "Start Auto-Enforcement System",
  "type": "shell",
  "command": "python ${workspaceFolder}/.cursor/scripts/watch-files.py",
  "runOptions": {
    "runOn": "folderOpen"  // ✅ Already configured
  },
  "isBackground": true
}
```

---

## How to Enable It

### Option 1: Allow Task on Folder Open (Recommended)

When you open the workspace folder, VS Code will prompt you:

1. **Open the workspace folder** in VS Code
2. **Look for a notification** in the bottom-right corner:
   - "Do you want to allow the task 'Start Auto-Enforcement System' to run automatically?"
3. **Click "Allow"** or "Always Allow"
4. The task will now auto-start every time you open the folder

### Option 2: Enable via Settings

Add this to your VS Code settings (workspace or user):

**Workspace Settings** (`.vscode/settings.json`):
```json
{
  "task.allowAutomaticTasks": true
}
```

**Or User Settings** (global):
1. Open Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`)
2. Type: "Preferences: Open User Settings (JSON)"
3. Add:
```json
{
  "task.allowAutomaticTasks": true
}
```

### Option 3: Manual Start (If Auto-Start Disabled)

If you prefer to start it manually:

1. **Open Command Palette** (`Ctrl+Shift+P` / `Cmd+Shift+P`)
2. Type: "Tasks: Run Task"
3. Select: "Start Auto-Enforcement System"

Or use the keyboard shortcut:
- `Ctrl+Shift+P` → "Tasks: Run Task" → "Start Auto-Enforcement System"

---

## Verify It's Running

### Check Task Status:

1. **Open Terminal Panel** (`Ctrl+`` ` or `View → Terminal`)
2. Look for a terminal tab named "Start Auto-Enforcement System"
3. You should see logs like:
   ```
   File watcher started
   Watching directory: apps
   Watching directory: libs
   ...
   ```

### Check Process:

**Windows (PowerShell):**
```powershell
Get-Process python | Where-Object {$_.CommandLine -like "*watch-files.py*"}
```

**Linux/Mac:**
```bash
ps aux | grep watch-files.py
```

### Check Logs:

Look for log messages indicating:
- "File watcher started"
- "Watching directory: ..."
- "EnforcementHandler initialized"

---

## Troubleshooting

### Task Not Auto-Starting?

1. **Check VS Code Settings:**
   - Ensure `task.allowAutomaticTasks` is `true`
   - Or allow the task when prompted

2. **Check Task Configuration:**
   - Verify `runOn: "folderOpen"` is present
   - Verify `isBackground: true` is set

3. **Check Python Path:**
   - Ensure Python is in PATH
   - VS Code should use workspace Python interpreter

4. **Check Dependencies:**
   - Ensure `watchdog` package is installed:
     ```bash
     pip install watchdog
     ```

### Task Starts But Stops Immediately?

1. **Check for Errors:**
   - Look in the terminal output
   - Check for import errors or missing dependencies

2. **Check File Permissions:**
   - Ensure script is executable
   - Ensure Python can access the script

3. **Check Logs:**
   - Look for error messages in terminal
   - Check `.cursor/enforcement/` for status files

---

## Disable Auto-Start

If you want to disable auto-start:

1. **Remove `runOn` option:**
   ```json
   {
     "label": "Start Auto-Enforcement System",
     "runOptions": {
       // Remove "runOn": "folderOpen"
     }
   }
   ```

2. **Or set in settings:**
   ```json
   {
     "task.allowAutomaticTasks": false
   }
   ```

---

## Current Status

✅ **Task is configured** with `runOn: "folderOpen"`  
⚠️ **Requires user permission** to auto-start (VS Code security feature)  
✅ **Can be enabled** via settings or prompt

**To enable now:**
1. Close and reopen the workspace folder
2. Click "Allow" when prompted
3. Or add `"task.allowAutomaticTasks": true` to settings

---

## Benefits of Auto-Start

When enabled, the enforcer will:
- ✅ Run automatically when you open the workspace
- ✅ Monitor file changes in real-time
- ✅ Update context recommendations automatically
- ✅ Track workflows continuously
- ✅ Generate status files on changes

**No manual intervention needed!**








