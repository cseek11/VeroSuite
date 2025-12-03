# Two-Brain Model: Enforcement Protocol

**Date:** 2025-12-02  
**Status:** ✅ ACTIVE  
**Priority:** CRITICAL

---

## Overview

This document defines the **proper protocol** for how the enforcer (Brain A) logs compliance issues and enforces them on the agent (Brain B) in the Two-Brain Model.

---

## Protocol Flow

### Phase 1: Detection & Logging (Enforcer - Brain A)

#### Step 1: Run Compliance Checks

The enforcer runs all compliance checks:

```python
# auto-enforcer.py - run_audit()
enforcer.check_memory_bank_compliance()
enforcer.check_hardcoded_dates()
enforcer.check_security_compliance()
enforcer.check_error_handling()
enforcer.check_logging_compliance()
# ... etc
```

#### Step 2: Log Violations

Each violation is logged using `_log_violation()`:

```python
def _log_violation(self, violation: Violation):
    """Log violation and add to session."""
    # 1. Log to structured logger
    logger.error(f"Rule violation - BLOCKED: {violation.message}", ...)
    
    # 2. Add to in-memory violations list
    self.violations.append(violation)
    
    # 3. Add to session storage (for persistence)
    violation_dict = {
        "severity": violation.severity.value,
        "rule_ref": violation.rule_ref,
        "message": violation.message,
        "file_path": violation.file_path,
        "line_number": violation.line_number,
        "timestamp": violation.timestamp,
        "session_scope": violation.session_scope
    }
    self.session.violations.append(violation_dict)
```

**Violation Storage:**
- ✅ In-memory: `self.violations` (List[Violation])
- ✅ Session file: `.cursor/enforcement/session.json` (persistent)
- ✅ Structured logs: Via logger (for observability)

#### Step 3: Generate Status Files

After all checks complete, generate status files:

```python
# Generate status files
enforcer.generate_agent_status()        # AGENT_STATUS.md
enforcer.generate_violations_log()      # VIOLATIONS.md
enforcer.generate_agent_reminders()     # AGENT_REMINDERS.md
enforcer.generate_enforcement_block_message()  # ENFORCEMENT_BLOCK.md
enforcer.generate_two_brain_report()    # ENFORCER_REPORT.json
```

**File Generation Order:**
1. `AGENT_STATUS.md` - Overall status (BLOCKED/WARNING/COMPLIANT)
2. `VIOLATIONS.md` - Complete violations log
3. `AGENT_REMINDERS.md` - Active reminders
4. `ENFORCEMENT_BLOCK.md` - Blocking message (if BLOCKED violations exist)
5. `ENFORCER_REPORT.json` - Two-Brain communication bridge

---

### Phase 2: Enforcement (Agent - Brain B)

#### Step 1: Pre-Flight Check (MANDATORY)

**The agent MUST check block status BEFORE any task:**

```markdown
## 0. ⚠️ MANDATORY PRE-FLIGHT CHECK

1. FIRST TOOL CALL: read_file(".cursor/enforcement/ENFORCEMENT_BLOCK.md")
2. IF FILE EXISTS: STOP immediately, display blocking message
3. IF FILE DOES NOT EXIST: Continue with task
```

**This is the enforcement mechanism** - the agent voluntarily checks and stops itself.

#### Step 2: If Blocked

**Agent behavior when blocked:**

1. **Read ENFORCEMENT_BLOCK.md** (already done in pre-flight)
2. **Display blocking message** to user
3. **List all violations** from the block file
4. **STOP all work** - do not proceed with user's request
5. **Request human guidance** on how to proceed

#### Step 3: If Not Blocked

**Agent behavior when not blocked:**

1. **Continue with user's request** normally
2. **Implement code** as requested
3. **Enforcer will audit** after changes (via file watcher)

---

## File-Based Communication

### Enforcer → Agent Communication

The enforcer communicates with the agent via files:

| File | Purpose | When Created | When Removed |
|------|---------|--------------|--------------|
| `ENFORCEMENT_BLOCK.md` | Blocking message | When BLOCKED violations exist | When no BLOCKED violations |
| `ENFORCER_REPORT.json` | Fix instructions | Always (after audit) | Never (overwritten) |
| `AGENT_STATUS.md` | Overall status | Always (after audit) | Never (overwritten) |
| `VIOLATIONS.md` | Complete log | Always (after audit) | Never (overwritten) |

### Agent → Enforcer Communication

The agent communicates with the enforcer via:

1. **File changes** - Agent modifies code
2. **File watcher** - Enforcer detects changes
3. **Re-audit** - Enforcer runs checks again

---

## Detailed Protocol Steps

### Step-by-Step: Enforcer Side

#### 1. Detection Phase

```python
# Enforcer runs compliance checks
violations = []
violations.extend(check_memory_bank_compliance())
violations.extend(check_hardcoded_dates())
violations.extend(check_security_compliance())
# ... etc

# Log each violation
for violation in violations:
    enforcer._log_violation(violation)
```

#### 2. Categorization Phase

```python
# Separate violations by severity and scope
blocked_violations = [v for v in violations if v.severity == ViolationSeverity.BLOCKED]
warning_violations = [v for v in violations if v.severity == ViolationSeverity.WARNING]

current_session_blocked = [v for v in blocked_violations if v.session_scope == "current_session"]
historical_blocked = [v for v in blocked_violations if v.session_scope != "current_session"]
```

#### 3. File Generation Phase

```python
# Generate status files
generate_agent_status()        # Overall status
generate_violations_log()      # Complete log
generate_agent_reminders()     # Reminders

# Generate blocking message (if needed)
if blocked_violations:
    generate_enforcement_block_message()  # Creates ENFORCEMENT_BLOCK.md
else:
    # Remove block file if it exists
    if ENFORCEMENT_BLOCK.md.exists():
        ENFORCEMENT_BLOCK.md.unlink()

# Generate Two-Brain report
generate_two_brain_report()    # ENFORCER_REPORT.json with context hints
```

#### 4. Context Bundle Generation

```python
# Add context hints to report
context_bundle = {
    "task_type": "add_rls",  # Detected from violations
    "hints": [
        "RLS pattern: Filter all queries by tenant_id",
        "Use TenantGuard decorator on controller methods"
    ],
    "relevant_files": [
        "src/customers/customers.service.ts"  # Similar implementations
    ],
    "patterns_to_follow": [
        "Use TenantGuard decorator",
        "Inject tenant_id from context"
    ]
}
```

---

### Step-by-Step: Agent Side

#### 1. Pre-Flight Check (MANDATORY)

```python
# Agent's first action on ANY request
block_file = read_file(".cursor/enforcement/ENFORCEMENT_BLOCK.md")

if block_file.exists():
    # BLOCKED - STOP immediately
    display_blocking_message(block_file.content)
    list_violations(block_file.content)
    request_human_guidance()
    STOP  # Do not proceed
else:
    # NOT BLOCKED - Continue
    proceed_with_task()
```

#### 2. Normal Operation

```python
# Agent implements user's request
if not blocked:
    implement_code()
    make_changes()
    # Enforcer will audit via file watcher
```

#### 3. Fix Mode (When Triggered)

```python
# Agent receives [FOLLOW_ENFORCER_REPORT] tag
if fix_mode_triggered:
    # Read ENFORCER_REPORT.json
    report = read_file(".cursor/enforcement/ENFORCER_REPORT.json")
    
    # Apply fixes from report
    for violation in report.violations:
        apply_fix(violation)
    
    # Use context hints
    follow_patterns(report.context_bundle.patterns_to_follow)
    reference_files(report.context_bundle.relevant_files)
    
    # Complete
    output("[FIX_COMPLETE]")
```

---

## Violation Lifecycle

### 1. Detection

- **When:** During enforcer audit
- **Where:** In-memory (`self.violations`)
- **Action:** Logged via `_log_violation()`

### 2. Categorization

- **Severity:** BLOCKED vs WARNING
- **Scope:** Current session vs Historical
- **Action:** Separated into lists

### 3. Persistence

- **Session file:** Saved to `.cursor/enforcement/session.json`
- **Status files:** Generated (AGENT_STATUS.md, VIOLATIONS.md, etc.)
- **Block file:** Created if BLOCKED violations exist

### 4. Communication

- **Block file:** Agent reads in pre-flight check
- **Report file:** Agent reads in fix mode
- **Status files:** Agent can read for context

### 5. Resolution

- **Agent fixes:** Applies fixes from report
- **Re-audit:** Enforcer runs again (via file watcher)
- **Verification:** Enforcer confirms fixes
- **Cleanup:** Block file removed if no violations

---

## Key Principles

### 1. Separation of Concerns

- **Brain A (Enforcer):** Detects, logs, categorizes, communicates
- **Brain B (Agent):** Checks, stops, fixes, implements

### 2. File-Based Communication

- **No direct API calls** between brains
- **Files act as message queue**
- **Agent voluntarily checks files**

### 3. Voluntary Compliance

- **Agent cannot be forced to stop**
- **Agent must check and stop itself**
- **Pre-flight check is mandatory in rules**

### 4. Reactive Enforcement

- **Enforcer runs AFTER changes**
- **File watcher triggers re-audit**
- **Loop until clean**

---

## Current Implementation Status

### ✅ Implemented

- [x] Violation detection and logging
- [x] Status file generation
- [x] Block file generation
- [x] Two-Brain report generation
- [x] Context bundle generation
- [x] Pre-flight check in agent rules
- [x] Fix mode protocol

### ⚠️ Limitations

- **Cannot force agent to stop** (Cursor platform limitation)
- **Agent must voluntarily check** (enforced via rules)
- **Reactive, not proactive** (runs after changes)

---

## Best Practices

### For Enforcer (Brain A)

1. **Log all violations** - Don't skip any
2. **Categorize properly** - Severity and scope matter
3. **Generate all files** - Status, log, block, report
4. **Provide context hints** - Help agent fix efficiently
5. **Remove block file** - When no violations exist

### For Agent (Brain B)

1. **Check block FIRST** - Before any tool calls
2. **Display blocking message** - Show user what's wrong
3. **List violations** - Help user understand issues
4. **Request guidance** - Don't auto-fix historical violations
5. **Follow fix mode** - Apply only fixes from report

---

## Example Workflow

### Scenario: Agent Adds Code with Hardcoded Date

1. **Agent implements code:**
   ```typescript
   const date = new Date('2025-12-02');  // Hardcoded date
   ```

2. **File watcher detects change:**
   - Triggers enforcer audit

3. **Enforcer detects violation:**
   - Logs violation: `_log_violation(violation)`
   - Categorizes: BLOCKED, current_session

4. **Enforcer generates files:**
   - `ENFORCEMENT_BLOCK.md` (created - has BLOCKED violation)
   - `ENFORCER_REPORT.json` (with fix hint)
   - `AGENT_STATUS.md` (shows BLOCKED)

5. **Agent's next request:**
   - Pre-flight check reads `ENFORCEMENT_BLOCK.md`
   - Agent stops and displays blocking message
   - Agent lists violation
   - Agent requests guidance

6. **User provides guidance:**
   - "Fix the hardcoded date"

7. **Agent applies fix:**
   - Reads `ENFORCER_REPORT.json`
   - Applies fix from report
   - Uses system date injection

8. **File watcher detects fix:**
   - Triggers re-audit

9. **Enforcer verifies:**
   - No violations found
   - Removes `ENFORCEMENT_BLOCK.md`
   - Updates status to COMPLIANT

10. **Agent can proceed:**
    - Pre-flight check passes (no block file)
    - Continues with next task

---

## Summary

**Proper Protocol:**

1. **Enforcer detects** → Logs violations → Generates files
2. **Agent checks** → Reads block file → Stops if blocked
3. **Agent fixes** → Applies fixes from report → Re-audit
4. **Loop until clean** → Block file removed → Agent proceeds

**Key Files:**
- `ENFORCEMENT_BLOCK.md` - Blocking mechanism
- `ENFORCER_REPORT.json` - Fix instructions
- `AGENT_STATUS.md` - Overall status

**Key Principle:**
- Agent voluntarily checks and stops (enforced via rules)
- Enforcer provides clear communication (via files)

---

**Status:** ✅ Protocol Defined and Implemented

