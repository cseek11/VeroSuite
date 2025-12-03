# Automatic Prompt System - Enforcement Blocking

**Date:** 2025-12-01  
**Status:** ✅ IMPLEMENTED  
**Priority:** CRITICAL

---

## Overview

**Yes, the enforcement system CAN automatically "send a prompt" to the agent** via a file-based blocking mechanism.

The enforcer writes a blocking message file (`.cursor/enforcement/ENFORCEMENT_BLOCK.md`) that the agent MUST read before proceeding. This acts as an "automatic prompt" from the enforcer telling the agent to STOP.

---

## How It Works

### 1. Enforcer Detects Violations

When violations are detected:
- Enforcer runs compliance checks
- If BLOCKED violations found → generates `ENFORCEMENT_BLOCK.md`
- File contains clear STOP message with violation details

### 2. Agent Reads Block File (Pre-Flight Check)

The agent's pre-flight check (in `.cursorrules` and `00-master.mdc`) requires:
1. **FIRST:** Read `.cursor/enforcement/ENFORCEMENT_BLOCK.md`
2. **IF FILE EXISTS:** Agent is BLOCKED - must read entire message and STOP
3. **IF FILE DOES NOT EXIST:** Continue to normal checks

### 3. Agent Displays Blocking Message

When the agent reads `ENFORCEMENT_BLOCK.md`, it sees:
- 🚨 Clear STOP message
- List of violations (current session vs historical)
- Instructions on how to fix
- Next steps

### 4. Agent Must Stop

The agent MUST:
- Stop all current work
- Display the blocking message
- Fix violations (or request human guidance)
- Re-run enforcement to verify fixes
- Only proceed after `ENFORCEMENT_BLOCK.md` is removed

---

## File-Based "Automatic Prompt"

**This is effectively "sending a prompt" via file system:**

1. **Enforcer writes message** → `ENFORCEMENT_BLOCK.md`
2. **Agent reads message** → Pre-flight check reads file
3. **Agent displays message** → Shows blocking message to user
4. **Agent stops** → Cannot proceed until violations fixed

**The file acts as a "message queue" between enforcer and agent.**

---

## Implementation Details

### Enforcer Side (auto-enforcer.py)

```python
def generate_enforcement_block_message(self):
    """
    Generate ENFORCEMENT_BLOCK.md file with blocking message for agent.
    
    This is the "automatic prompt" mechanism - the enforcer writes a blocking
    message file that the agent MUST read before proceeding.
    """
    block_file = self.enforcement_dir / "ENFORCEMENT_BLOCK.md"
    
    # Check if there are any blocked violations
    blocked_violations = [v for v in self.violations if v.severity == ViolationSeverity.BLOCKED]
    
    if not blocked_violations:
        # No violations - remove block file if it exists
        if block_file.exists():
            block_file.unlink()
        return
    
    # Generate blocking message with violation details
    content = f"""# 🚨 ENFORCEMENT BLOCK - DO NOT PROCEED 🚨
    ...
    """
    
    with open(block_file, 'w', encoding='utf-8') as f:
        f.write(content)
```

### Agent Side (.cursorrules)

```markdown
**⚠️ MANDATORY PRE-TASK CHECK:**

1. **READ** `.cursor/enforcement/ENFORCEMENT_BLOCK.md` FIRST
   - **IF FILE EXISTS:** You are BLOCKED - read entire message and STOP immediately
   - **IF FILE DOES NOT EXIST:** Continue to step 2
```

---

## Example Blocking Message

When violations are detected, `ENFORCEMENT_BLOCK.md` contains:

```markdown
# 🚨 ENFORCEMENT BLOCK - DO NOT PROCEED 🚨

**Status:** 🔴 BLOCKED

## ⚠️ CRITICAL: YOU MUST STOP IMMEDIATELY

**The enforcement system has detected violations that BLOCK task execution.**

**YOU MUST:**
1. **STOP all current work immediately**
2. **Read this entire message**
3. **Fix violations before proceeding**
4. **DO NOT continue with any task until violations are resolved**

## Blocking Violations Summary

- **Total Blocked Violations:** 6
  - 🔧 **Current Session (Auto-Fixable):** 0
  - 📋 **Historical (Require Human Input):** 6

## 📋 Historical Violations (6 - Require Human Input)

**These violations exist in historical code. You MUST list these and request human guidance.**

### Violation #1: 01-enforcement.mdc Step 0.5
**Message:** Agent did not reference correct context-id...
**File:** `.cursor/context_manager/recommendations.md`

...
```

---

## Benefits

### ✅ Automatic Detection
- Enforcer automatically detects violations
- No manual intervention needed
- Runs on file changes or manual execution

### ✅ Clear Communication
- Blocking message is clear and actionable
- Separates current session vs historical violations
- Provides specific fix instructions

### ✅ Agent Compliance
- Agent MUST read file (per rules)
- Agent MUST stop if file exists
- Agent MUST fix violations before proceeding

### ✅ Self-Healing
- When violations are fixed, file is automatically removed
- Agent can then proceed normally
- No manual cleanup needed

---

## Limitations

### ⚠️ Agent Must Comply

**The system relies on agent compliance:**
- Agent must read `ENFORCEMENT_BLOCK.md` (per rules)
- Agent must stop if file exists
- Agent must fix violations

**If agent ignores the file:**
- System cannot force agent to stop
- Violations will persist
- Agent may proceed incorrectly

### ⚠️ File System Based

**This is a file-based mechanism:**
- Not a real-time API call
- Requires file I/O
- Subject to file system delays

**However:**
- Works reliably across platforms
- No network dependencies
- Simple and maintainable

---

## Workflow

### Normal Flow (No Violations)

1. Agent starts task
2. Reads `ENFORCEMENT_BLOCK.md` → File doesn't exist ✅
3. Continues to Step 0 (Memory Bank)
4. Proceeds with task

### Blocked Flow (Violations Detected)

1. Enforcer runs → Detects violations
2. Generates `ENFORCEMENT_BLOCK.md` → File exists 🚨
3. Agent starts task
4. Reads `ENFORCEMENT_BLOCK.md` → File exists → **STOP**
5. Agent displays blocking message
6. Agent fixes violations (or requests human guidance)
7. Re-runs enforcement → No violations → File removed ✅
8. Agent can now proceed

---

## Integration Points

### Pre-Flight Check (00-master.mdc)

```markdown
1. **Read Enforcement Block Message (MANDATORY - CHECK FIRST):**
   - **MUST** read `.cursor/enforcement/ENFORCEMENT_BLOCK.md` FIRST
   - **IF FILE EXISTS:** You are BLOCKED - read entire message and STOP
   - **IF FILE DOES NOT EXIST:** Continue to step 2
```

### Agent Rules (.cursorrules)

```markdown
1. **READ** `.cursor/enforcement/ENFORCEMENT_BLOCK.md` FIRST
   - **IF FILE EXISTS:** You are BLOCKED - read entire message and STOP immediately
   - **IF FILE DOES NOT EXIST:** Continue to step 2
```

### Enforcer Generation (auto-enforcer.py)

```python
# Called after all checks complete
self.generate_enforcement_block_message()
```

---

## Status

✅ **IMPLEMENTED** - System is fully functional

- Enforcer generates blocking message file
- Agent rules require reading the file
- File is automatically removed when compliant
- Clear violation details and fix instructions

---

## Next Steps

1. **Test the system:**
   - Trigger violations (e.g., hardcoded date)
   - Verify `ENFORCEMENT_BLOCK.md` is generated
   - Verify agent reads file and stops
   - Fix violations
   - Verify file is removed

2. **Monitor compliance:**
   - Track how often agent reads block file
   - Track how often agent stops correctly
   - Identify any compliance gaps

3. **Enhance messaging:**
   - Add more specific fix instructions
   - Add links to relevant documentation
   - Add examples of correct fixes

---

**Last Updated:** 2025-12-01  
**Maintained By:** Enforcement System  
**Reference:** `.cursor/scripts/auto-enforcer.py` (generate_enforcement_block_message method)








