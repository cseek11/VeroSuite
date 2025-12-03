# Auto-Fix Protocol for Current Session Violations

**Date:** 2025-12-02  
**Status:** ✅ IMPLEMENTED  
**Priority:** HIGH

---

## Overview

The agent can now **auto-fix current session violations** and continue with the original task, reporting what was fixed. This improves workflow efficiency for simple fixes like hardcoded dates.

---

## How It Works

### Violation Categorization

The enforcer categorizes violations into two types:

1. **🔧 Current Session (Auto-Fixable)**
   - Violations introduced in the current session
   - Agent can auto-fix these without human input
   - Examples: Hardcoded dates, missing error handling, missing logging

2. **📋 Historical (Require Human Input)**
   - Violations that existed before the current session
   - Agent must request human guidance before fixing
   - Examples: Legacy code issues, architectural decisions

### Auto-Fix Workflow

#### Scenario 1: Only Current Session Violations

```
1. Agent checks ENFORCEMENT_BLOCK.md
2. Finds ONLY current session violations (🔧)
3. Agent reads ENFORCER_REPORT.json for fix hints
4. Agent auto-fixes all violations
5. Agent reports what was fixed
6. Agent re-runs enforcer to verify
7. If clean: Continue with original task
8. If violations remain: Stop and request guidance
```

**Example Response:**
```
⚠️ BLOCKED STATUS DETECTED

I found 3 current session violations (all auto-fixable):
- Hardcoded date in src/users/users.service.ts:42
- Missing error handling in src/auth/auth.service.ts:15
- Missing logging in src/orders/orders.service.ts:89

🔧 AUTO-FIXING VIOLATIONS:

1. Fixed hardcoded date:
   - File: src/users/users.service.ts:42
   - Changed: new Date('2025-12-02') → @Inject(SYSTEM_DATE)
   - Status: ✅ Fixed

2. Added error handling:
   - File: src/auth/auth.service.ts:15
   - Added: try/catch with proper error logging
   - Status: ✅ Fixed

3. Added structured logging:
   - File: src/orders/orders.service.ts:89
   - Added: logger.warn({ event: 'ORDER_FAILED', ... })
   - Status: ✅ Fixed

✅ All violations fixed. Re-running enforcer to verify...

[Enforcer runs]

✅ Verification complete - all violations resolved. Safe to continue.

Proceeding with your original request: [original task]
```

#### Scenario 2: Historical Violations Only

```
1. Agent checks ENFORCEMENT_BLOCK.md
2. Finds ONLY historical violations (📋)
3. Agent STOPS immediately
4. Agent displays blocking message
5. Agent lists all historical violations
6. Agent requests human guidance
7. Agent does NOT proceed until human provides guidance
```

**Example Response:**
```
⚠️ BLOCKED STATUS DETECTED

I found 5 historical violations that require human input:
- Hardcoded dates in legacy files (3 violations)
- Missing RLS in old code (2 violations)

📋 HISTORICAL VIOLATIONS (Require Human Input):

1. File: legacy/auth/old-auth.ts:15
   - Issue: Hardcoded date: 2023-01-01
   - Rule: 02-core.mdc

2. File: legacy/users/old-users.ts:42
   - Issue: Missing tenant_id filter
   - Rule: 03-security.mdc

... (list all violations)

❌ Cannot auto-fix historical violations without permission.

Please provide guidance:
- Should I fix all historical violations?
- Should I only fix specific ones?
- Should I leave them as-is?
```

#### Scenario 3: Both Current Session AND Historical

```
1. Agent checks ENFORCEMENT_BLOCK.md
2. Finds BOTH current session AND historical violations
3. Agent auto-fixes current session violations first
4. Agent reports what was fixed
5. Agent STOPS and lists historical violations
6. Agent requests human guidance for historical violations
7. Agent does NOT proceed until historical violations resolved
```

**Example Response:**
```
⚠️ BLOCKED STATUS DETECTED

I found:
- 3 current session violations (🔧 auto-fixable)
- 2 historical violations (📋 require human input)

🔧 AUTO-FIXING CURRENT SESSION VIOLATIONS:

1. Fixed hardcoded date in src/users/users.service.ts:42 ✅
2. Added error handling in src/auth/auth.service.ts:15 ✅
3. Added logging in src/orders/orders.service.ts:89 ✅

✅ Current session violations fixed. Re-running enforcer...

[Enforcer runs]

✅ Current session violations resolved.

📋 HISTORICAL VIOLATIONS (Require Human Input):

1. File: legacy/auth/old-auth.ts:15
   - Issue: Hardcoded date: 2023-01-01
   - Rule: 02-core.mdc

2. File: legacy/users/old-users.ts:42
   - Issue: Missing tenant_id filter
   - Rule: 03-security.mdc

❌ Cannot proceed until historical violations are resolved.

Please provide guidance on how to handle historical violations.
```

---

## Implementation Details

### Agent Rules Updated

The pre-flight check in `.cursor/rules/00-llm-interface.mdc` now includes:

```markdown
2. **If file EXISTS (you are BLOCKED):**
   
   **Check violation types:**
   
   a. **If ONLY Current Session violations (🔧 Auto-Fixable):**
      - Auto-fix all current session violations
      - Report what was fixed
      - Re-run enforcer to verify
      - If clean: Continue with original task
   
   b. **If Historical violations (📋 Require Human Input):**
      - STOP immediately
      - Display blocking message
      - List all historical violations
      - Request human guidance
   
   c. **If BOTH Current Session AND Historical:**
      - Auto-fix current session violations first
      - Report what was fixed
      - Then STOP and list historical violations
      - Request human guidance
```

### Fix Hints Source

The agent gets fix hints from `ENFORCER_REPORT.json`:

```json
{
  "violations": [
    {
      "id": "VF-DATE-001",
      "severity": "BLOCKING",
      "file": "src/users/users.service.ts",
      "rule_ref": "02-core.mdc",
      "description": "Hardcoded date found",
      "fix_hint": "Replace with @Inject(SYSTEM_DATE) or inject(SYSTEM_DATE)"
    }
  ],
  "context_bundle": {
    "task_type": "fix_date",
    "hints": [
      "Replace hardcoded dates with: @Inject(SYSTEM_DATE)",
      "Use date abstraction: this.systemDate.now()",
      "Never use: new Date('2023-01-01')"
    ]
  }
}
```

### Verification Step

After auto-fixing, the agent must:

1. **Re-run enforcer:**
   ```bash
   python .cursor/scripts/auto-enforcer.py
   ```

2. **Check if block file removed:**
   - If `ENFORCEMENT_BLOCK.md` no longer exists → All violations resolved
   - If `ENFORCEMENT_BLOCK.md` still exists → Violations remain

3. **Report status:**
   - ✅ All violations resolved → Continue with original task
   - ❌ Violations remain → Stop and request guidance

---

## Benefits

### 1. Improved Workflow Efficiency

- **Before:** Agent stops, waits for human, fixes, continues
- **After:** Agent auto-fixes, verifies, continues (for simple fixes)

### 2. Clear Reporting

- Agent reports exactly what was fixed
- User knows what changed
- Transparency in auto-fix process

### 3. Safety Maintained

- Only auto-fixes current session violations
- Historical violations still require human input
- Verification step ensures fixes worked

### 4. User Control

- User can see what was auto-fixed
- User can review changes before agent continues
- User maintains control over historical violations

---

## Example: Complete Auto-Fix Flow

### User Request
```
User: "Add a new customer endpoint"
```

### Agent Pre-Flight Check
```
1. Agent reads ENFORCEMENT_BLOCK.md
2. Finds: 2 current session violations (hardcoded dates)
3. No historical violations
```

### Agent Auto-Fix
```
🔧 AUTO-FIXING VIOLATIONS:

1. Fixed hardcoded date:
   - File: src/customers/customers.service.ts:15
   - Changed: new Date('2025-12-02') → @Inject(SYSTEM_DATE)
   - Status: ✅ Fixed

2. Fixed hardcoded date:
   - File: src/customers/customers.controller.ts:42
   - Changed: '2025-12-02' → this.systemDate.now()
   - Status: ✅ Fixed

✅ All violations fixed. Re-running enforcer...
```

### Verification
```
[Enforcer runs]
✅ Verification complete - all violations resolved.
```

### Continue with Original Task
```
✅ Safe to continue. Proceeding with your request:

Adding new customer endpoint...
[Agent implements the endpoint]
```

---

## Safety Considerations

### 1. Only Auto-Fix Current Session Violations

- **Rationale:** Current session violations are the agent's responsibility
- **Historical violations:** Require human judgment (may be intentional)

### 2. Verification Required

- **Always re-run enforcer** after auto-fixing
- **Verify block file removed** before continuing
- **If violations remain:** Stop and request guidance

### 3. Clear Reporting

- **Report what was fixed** (file, line, change)
- **Report verification status** (clean or violations remain)
- **Transparency** in auto-fix process

### 4. User Can Override

- **User can review** what was auto-fixed
- **User can request** different fix approach
- **User maintains control** over historical violations

---

## Status

✅ **IMPLEMENTED**

- Agent rules updated to allow auto-fix
- Protocol defined for all scenarios
- Safety measures in place
- Verification step required

---

**Next Steps:**

1. Test auto-fix with current session violations
2. Verify agent reports fixes correctly
3. Monitor for any issues

