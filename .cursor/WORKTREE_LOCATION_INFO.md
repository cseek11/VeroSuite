# Worktree Location Information
**Date:** 2025-11-21

## File Location Explanation

### Why You See "workTrees > VeroField > mmVtk"

The path you're seeing (`workTrees > VeroField > mmVtk > .cursor > rules`) is **CORRECT** and **NORMAL**.

This is a **Git worktree** location. The full path is:
```
C:\Users\ashse\.cursor\worktrees\VeroField\mmVtk\.cursor\rules\00-master.mdc
```

### This is Expected Behavior

1. **Git Worktrees:** When you use Git worktrees, files are stored in `.cursor\worktrees\[repo]\[branch]` directories
2. **Cursor Display:** Cursor shows this as "workTrees > VeroField > mmVtk" in the file explorer
3. **Files Are Correct:** All files are in the correct location relative to the workspace root

### Workspace Root

The workspace root is:
```
C:\Users\ashse\.cursor\worktrees\VeroField\mmVtk
```

All relative paths (like `.cursor/rules/00-master.mdc`) are resolved from this root.

### File Locations (All Correct)

✅ **Rule Files:** `.cursor/rules/*.mdc` (15 files)  
✅ **Prompts:** `.cursor/prompts/*.md` (7 files)  
✅ **Agents:** `.cursor/agents.json`  
✅ **Config:** `.cursorrules` (at workspace root)  
✅ **Rules Index:** `.cursor/rules.yml`  

### If Another Agent Can't Find Rules

1. **Verify Workspace:** Ensure the agent is using the same workspace root:
   - `C:\Users\ashse\.cursor\worktrees\VeroField\mmVtk`

2. **Check File Paths:** All rules should be referenced as:
   - `.cursor/rules/00-master.mdc` (relative to workspace root)
   - NOT absolute paths

3. **Restart Cursor:** May need to restart Cursor to reload rules

4. **Explicit Reference:** Try asking:
   - "Read `.cursor/rules/00-master.mdc`"
   - "List files in `.cursor/rules/` directory"

### Verification

To verify files are accessible, ask Cursor:
```
"List all .mdc files in .cursor/rules/ directory"
"Read the first 10 lines of .cursor/rules/00-master.mdc"
"What rules are defined in .cursor/rules.yml?"
```

### Summary

**The path you're seeing is CORRECT.** The "workTrees > VeroField > mmVtk" is just how Cursor displays Git worktree paths. All files are in the correct location and should be accessible to Cursor agents.

---

**Last Updated:** 2025-11-21

