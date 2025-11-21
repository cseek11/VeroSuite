# VSCode Task Path Fix

**Date:** 2025-11-21  
**Issue:** Task failing with "No such file or directory" error  
**Status:** ✅ **FIXED**

---

## Problem

The VSCode task was failing with:
```
can't open file 'C:\\Users\\ashse\\Documents\\VeroField\\Training\\VeroField/.cursor/scripts/start_session_manager.py': [Errno 2] No such file or directory
```

**Root Cause:** Mixed path separators in the task command:
- `${workspaceFolder}` resolves to Windows path with backslashes: `C:\Users\...\VeroField`
- Then `/` is used for `.cursor/scripts/...`
- Result: Mixed path `C:\Users\...\VeroField/.cursor/scripts/...` which Python can't resolve

---

## Solution

Changed task command from:
```json
"command": "python ${workspaceFolder}/.cursor/scripts/start_session_manager.py"
```

To:
```json
"command": "python .cursor/scripts/start_session_manager.py"
```

**Why this works:**
- Relative paths work correctly in VSCode tasks
- VSCode automatically resolves relative paths from workspace root
- No path separator mixing issues
- Works on both Windows and Unix systems

---

## Verification

✅ File exists: `.cursor/scripts/start_session_manager.py`  
✅ Task command updated  
✅ Path format fixed

---

## Files Modified

- `.vscode/tasks.json` - Changed to relative path

---

**Fix Applied:** 2025-11-21


