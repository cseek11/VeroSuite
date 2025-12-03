# Agent Response Capture Guide

**Date:** 2025-12-01  
**Status:** ACTIVE  
**Priority:** CRITICAL

---

## Problem Statement

The enforcement system needs to verify that the agent actually performed Step 0.5 and Step 4.5, but it cannot access the agent's response text directly. The enforcer runs independently (via file watcher or manual execution) and has no way to see what the agent said.

**Current Issue:**
- Enforcer detects violations but cannot access agent's actual response
- Agent response parsing fails because `set_agent_response()` is never called
- System shows "No agent response available for verification"

---

## Solution: File-Based Response Capture

The agent writes its response to a file, and the enforcer automatically reads it.

### How It Works

1. **Agent writes response to file:**
   - File: `.cursor/enforcement/agent_response.txt`
   - Agent writes its complete response (including Step 0.5/4.5 verification)

2. **Enforcer reads from file:**
   - Automatically loads on initialization
   - Reloads before compliance checks
   - Parses response for verification

3. **Verification happens:**
   - Context-ID match
   - Step acknowledgment
   - File mentions

---

## Agent Instructions

### MANDATORY: Write Response to File

**After providing Step 0.5 or Step 4.5 verification, you MUST:**

1. **Write your complete response to the file:**
   ```python
   # Use write tool to save your response
   write(".cursor/enforcement/agent_response.txt", your_complete_response_text)
   ```

2. **Include in your response:**
   - Context-ID reference
   - Step 0.5/4.5 acknowledgment
   - All required file mentions (@file.md)

3. **Format must match:**
   ```
   Step 0.5 Verification:
   ✓ Read recommendations.md: [summary]
   ✓ Loaded PRIMARY context:
     - @file1.md
     - @file2.md
   Context-ID: [uuid]
   ```

---

## Automatic Loading

The enforcer automatically:
- Loads response file on initialization
- Reloads before compliance checks
- Parses response for verification

**No manual `set_agent_response()` call needed** - the file-based approach works automatically.

---

## Current Status

✅ **File loading implemented** - Enforcer reads from `.cursor/enforcement/agent_response.txt`  
✅ **Response parsing implemented** - Verifies context-ID, step acknowledgment, file mentions  
⚠️ **Agent must write file** - Agent needs to write response to file after providing verification

---

## Example Workflow

1. **Agent provides Step 0.5 verification in chat**
2. **Agent writes response to file:**
   ```
   write(".cursor/enforcement/agent_response.txt", step_0_5_verification_text)
   ```
3. **Enforcer runs (via file watcher or manual)**
4. **Enforcer reads file and verifies:**
   - Context-ID matches
   - Step 0.5 acknowledged
   - Files mentioned
5. **If violations:** BLOCKED status
6. **If compliant:** Proceed

---

## Troubleshooting

### Issue: "No agent response available for verification"

**Cause:** Agent response file doesn't exist or is empty

**Fix:**
1. Write your response to `.cursor/enforcement/agent_response.txt`
2. Include Step 0.5/4.5 verification format
3. Include context-ID and file mentions

### Issue: "Agent did not reference correct context-ID"

**Cause:** Response file has old context-ID, but recommendations.md was updated

**Fix:**
1. Read latest recommendations.md
2. Get current context-ID
3. Update response file with correct context-ID

### Issue: "Agent did not acknowledge Step 0.5/4.5"

**Cause:** Response doesn't contain step acknowledgment keywords

**Fix:**
1. Include "Step 0.5 Verification:" or "Step 4.5 Verification:" header
2. Use keywords: "loaded required context", "pre-loaded predicted context", etc.

---

## Integration with Cursor

**Current Limitation:**
- The enforcer can DETECT violations
- The enforcer CANNOT actually block Cursor execution
- Cursor doesn't have a hook to prevent agent from proceeding

**Workaround:**
- Agent must check AGENT_STATUS.md before proceeding
- If BLOCKED, agent must fix violations before continuing
- This is a manual check, not automatic blocking

**Future Enhancement:**
- Cursor could integrate enforcement as a pre-task hook
- Cursor could block agent if enforcer returns BLOCKED
- This requires Cursor platform support

---

## Files

- **Response File:** `.cursor/enforcement/agent_response.txt`
- **Capture Script:** `.cursor/scripts/capture-agent-response.py`
- **Enforcer:** `.cursor/scripts/auto-enforcer.py` (reads file automatically)

---

**Last Updated:** 2025-12-01  
**Status:** ACTIVE - Agent must write response file for verification







