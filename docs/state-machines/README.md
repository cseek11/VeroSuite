# State Machine Documentation

**Last Updated:** 2025-11-16  
**Purpose:** Central registry for all state machine definitions

---

## Overview

This directory contains documentation for all state machines in the VeroSuite system. Each stateful component (UI, backend, jobs, workflows) must have its state machine documented here.

---

## State Machine Documentation Template

When documenting a new state machine, use this template:

```markdown
# [Component Name] State Machine

**Component:** [Component path]
**Last Updated:** [Current date - use system date]
**Status:** [Active/Deprecated]

## Valid States

- **State1:** Description of state
- **State2:** Description of state
- **State3:** Description of state

## Allowed Transitions

| From State | To State | Condition | Notes |
|------------|----------|-----------|-------|
| State1 | State2 | [Condition] | [Notes] |
| State2 | State3 | [Condition] | [Notes] |

## Illegal Transitions

- **State3 → State1:** Not allowed (terminal state)
- **State1 → State3:** Not allowed (must go through State2)

## Recovery Paths

### Invalid State Detected
- **Action:** Log error, reset to last known valid state
- **Recovery:** [Recovery procedure]

### Illegal Transition Attempted
- **Action:** Reject transition, show error message
- **Recovery:** [Recovery procedure]

## State Diagram

[ASCII diagram or link to diagram]

```
State1 --[condition]--> State2 --[condition]--> State3
  |                        |
  +--[error]--> Error      +--[error]--> Error
```

## Implementation Notes

- [Implementation details]
- [Special considerations]
- [Related files]
```

---

## Existing State Machines

### WorkOrderStatusManager
**File:** `frontend/src/components/work-orders/WorkOrderStatusManager.tsx`  
**Documentation:** See component file for inline documentation

**States:**
- PENDING
- IN_PROGRESS
- COMPLETED
- CANCELED

**Transitions:**
- PENDING → IN_PROGRESS
- PENDING → CANCELED
- IN_PROGRESS → COMPLETED
- IN_PROGRESS → CANCELED
- CANCELED → PENDING (reactivation)

---

## Adding New State Machines

1. Create documentation file: `docs/state-machines/[component-name].md`
2. Use the template above
3. Update this README with reference to new state machine
4. Reference in component code with JSDoc comment

---

**Reference:** See `.cursor/rules/state-integrity.md` for state machine requirements.

