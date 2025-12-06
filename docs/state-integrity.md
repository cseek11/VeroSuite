---
# Cursor Rule Metadata
version: 1.0
project: VeroField
scope:
  - frontend
  - backend
  - mobile
  - microservices
priority: critical
last_updated: 2025-12-05
always_apply: true
---

# PRIORITY: CRITICAL - State Machine Integrity Rules

## Overview

This rule file enforces explicit state machine definitions for all stateful components, preventing illegal states and partial transitions that cause subtle logic bugs in enterprise applications.

**⚠️ MANDATORY:** All stateful components (UI, backend, jobs, workflows) must define explicit state machines with documented transitions and recovery paths.

---

## I. State Machine Definition Requirements

### Rule 1: Explicit State Machine Definition

**MANDATORY:** Every stateful component MUST define an explicit state machine with:

1. **Valid States** - All possible states the component can be in
2. **Allowed Transitions** - Valid state transitions with conditions
3. **Illegal Transitions** - Explicitly documented invalid transitions
4. **Recovery Paths** - How to handle invalid states when they occur

**Example:**
```typescript
/**
 * State Machine: WorkOrderStatus
 * 
 * Valid States:
 * - PENDING: Initial state, work order created
 * - IN_PROGRESS: Work has started
 * - COMPLETED: Work finished successfully
 * - CANCELED: Work order canceled
 * 
 * Allowed Transitions:
 * - PENDING → IN_PROGRESS (requires: workOrder exists)
 * - PENDING → CANCELED (requires: notes)
 * - IN_PROGRESS → COMPLETED (requires: workOrder exists)
 * - IN_PROGRESS → CANCELED (requires: notes)
 * - CANCELED → PENDING (requires: notes, reactivation)
 * 
 * Illegal Transitions:
 * - COMPLETED → any state (terminal state)
 * - Any transition not listed above
 * 
 * Recovery Paths:
 * - Invalid state detected → Log error, reset to last known valid state
 * - Illegal transition attempted → Reject transition, show error message
 */
```

### Rule 2: State Machine Documentation Location

**MANDATORY:** State machines MUST be documented in one of:

1. **Code Comments** - For simple state machines (inline documentation)
2. **Separate Documentation** - For complex state machines (`docs/state-machines/[component].md`)
3. **Type Definitions** - TypeScript types with JSDoc comments

**MANDATORY:** Search for existing state machine documentation before modifying state logic.

---

## II. Pre-Modification Requirements

### Rule 3: State Diagram Search

**MANDATORY:** Before modifying ANY state logic, you MUST:

1. Search for state machine documentation:
   ```typescript
   codebase_search("What is the state machine for [component]?")
   codebase_search("What are the valid state transitions for [component]?")
   glob_file_search("**/*[component]*state*.md")
   grep -r "state.*machine\|state.*transition" frontend/src/components/
   ```

2. Read existing state machine documentation:
   ```typescript
   read_file("docs/state-machines/[component].md")
   read_file("[component].tsx") // Check for inline documentation
   ```

3. Identify current state machine implementation:
   ```typescript
   grep -r "status\|state" [component-files]
   codebase_search("How does [component] handle state transitions?")
   ```

**STOP if state machine documentation is unclear - ask for clarification.**

### Rule 4: State Machine Pattern Matching

**MANDATORY:** When modifying state logic, you MUST:

1. **Follow Existing Patterns** - Match existing state machine implementations (e.g., `WorkOrderStatusManager`)
2. **Preserve Valid Transitions** - Do not remove valid transitions without justification
3. **Document New Transitions** - Add new transitions to state machine documentation
4. **Update Illegal Transitions** - Update illegal transition list if adding new states

**Reference:** See `frontend/src/components/work-orders/WorkOrderStatusManager.tsx` for state machine pattern.

---

## III. State Transition Logging

### Rule 5: State Entered Logging

**MANDATORY:** Log every state entry with:

- Current state
- Previous state (if applicable)
- Transition that caused state change
- Trace ID for distributed tracing
- Context (component, operation)

**Example:**
```typescript
logger.info('State entered', {
  context: 'WorkOrderStatusManager',
  operation: 'stateTransition',
  traceId: req.traceId,
  component: 'WorkOrder',
  previousState: 'PENDING',
  currentState: 'IN_PROGRESS',
  transition: 'PENDING → IN_PROGRESS',
  workOrderId: workOrder.id
});
```

**Reference:** See `.cursor/rules/observability.md` for structured logging requirements.

### Rule 6: Invalid Transition Attempt Logging

**MANDATORY:** Log all invalid transition attempts with:

- Attempted transition (from → to)
- Current state
- Reason for rejection
- Trace ID
- User/context information

**Example:**
```typescript
logger.warn('Invalid state transition attempted', {
  context: 'WorkOrderStatusManager',
  operation: 'stateTransition',
  traceId: req.traceId,
  component: 'WorkOrder',
  currentState: 'COMPLETED',
  attemptedTransition: 'COMPLETED → IN_PROGRESS',
  reason: 'COMPLETED is a terminal state',
  errorCode: 'INVALID_STATE_TRANSITION',
  workOrderId: workOrder.id
});
```

### Rule 7: Unexpected State Logging

**MANDATORY:** Log unexpected or impossible states with:

- Unexpected state value
- Expected states
- How state was detected
- Recovery action taken
- Trace ID

**Example:**
```typescript
logger.error('Unexpected state detected', {
  context: 'WorkOrderStatusManager',
  operation: 'validateState',
  traceId: req.traceId,
  component: 'WorkOrder',
  unexpectedState: workOrder.status,
  expectedStates: ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELED'],
  errorCode: 'UNEXPECTED_STATE',
  workOrderId: workOrder.id,
  recoveryAction: 'Reset to last known valid state'
});
```

---

## IV. State Transition Validation

### Rule 8: Transition Validation Function

**MANDATORY:** Create a validation function that:

1. Checks if transition is allowed
2. Validates transition conditions
3. Returns validation result with error message
4. Logs invalid transitions

**Example:**
```typescript
function isValidTransition(
  from: WorkOrderStatus,
  to: WorkOrderStatus
): { valid: boolean; reason?: string } {
  const allowedTransitions: Record<WorkOrderStatus, WorkOrderStatus[]> = {
    PENDING: [WorkOrderStatus.IN_PROGRESS, WorkOrderStatus.CANCELED],
    IN_PROGRESS: [WorkOrderStatus.COMPLETED, WorkOrderStatus.CANCELED],
    COMPLETED: [], // Terminal state
    CANCELED: [WorkOrderStatus.PENDING]
  };

  const allowed = allowedTransitions[from]?.includes(to);
  
  if (!allowed) {
    logger.warn('Invalid transition', {
      context: 'WorkOrderStatusManager',
      from,
      to,
      errorCode: 'INVALID_TRANSITION'
    });
    return {
      valid: false,
      reason: `Transition from ${from} to ${to} is not allowed`
    };
  }

  return { valid: true };
}
```

### Rule 9: State Recovery Mechanisms

**MANDATORY:** Implement recovery paths for invalid states:

1. **Detect Invalid State** - Validate state on component load/update
2. **Log Invalid State** - Log with full context (see Rule 7)
3. **Recovery Action** - Reset to last known valid state or safe default
4. **User Notification** - Inform user if state was corrected

**Example:**
```typescript
function recoverFromInvalidState(
  component: Component,
  invalidState: State,
  lastValidState: State
): State {
  logger.error('Recovering from invalid state', {
    context: 'StateRecovery',
    component: component.name,
    invalidState,
    lastValidState,
    recoveryAction: 'Reset to last valid state'
  });

  // Reset to last known valid state
  return lastValidState;
}
```

---

## V. Testing Requirements

### Rule 10: Illegal Transition Tests

**MANDATORY:** Create tests for all illegal state transitions:

```typescript
describe('WorkOrderStatusManager - Illegal Transitions', () => {
  it('should reject transition from COMPLETED to IN_PROGRESS', async () => {
    const workOrder = createWorkOrder({ status: 'COMPLETED' });
    
    await expect(
      statusManager.transition(workOrder, 'IN_PROGRESS')
    ).rejects.toThrow('Invalid transition: COMPLETED → IN_PROGRESS');
    
    expect(logger.warn).toHaveBeenCalledWith(
      expect.stringContaining('Invalid state transition'),
      expect.objectContaining({
        currentState: 'COMPLETED',
        attemptedTransition: 'COMPLETED → IN_PROGRESS',
        errorCode: 'INVALID_STATE_TRANSITION'
      })
    );
  });

  it('should reject transition from PENDING to COMPLETED', async () => {
    const workOrder = createWorkOrder({ status: 'PENDING' });
    
    await expect(
      statusManager.transition(workOrder, 'COMPLETED')
    ).rejects.toThrow('Invalid transition: PENDING → COMPLETED');
  });
});
```

### Rule 11: State Recovery Tests

**MANDATORY:** Test state recovery mechanisms:

```typescript
describe('WorkOrderStatusManager - State Recovery', () => {
  it('should recover from unexpected state', () => {
    const workOrder = createWorkOrder({ status: 'UNKNOWN_STATE' as any });
    
    const recovered = statusManager.recoverFromInvalidState(
      workOrder,
      'UNKNOWN_STATE' as any,
      'PENDING'
    );
    
    expect(recovered).toBe('PENDING');
    expect(logger.error).toHaveBeenCalledWith(
      expect.stringContaining('Unexpected state'),
      expect.objectContaining({
        unexpectedState: 'UNKNOWN_STATE',
        recoveryAction: 'Reset to last valid state'
      })
    );
  });
});
```

### Rule 12: Valid Transition Tests

**MANDATORY:** Test all valid transitions work correctly:

```typescript
describe('WorkOrderStatusManager - Valid Transitions', () => {
  it('should allow PENDING → IN_PROGRESS', async () => {
    const workOrder = createWorkOrder({ status: 'PENDING' });
    
    const result = await statusManager.transition(workOrder, 'IN_PROGRESS');
    
    expect(result.status).toBe('IN_PROGRESS');
    expect(logger.info).toHaveBeenCalledWith(
      expect.stringContaining('State entered'),
      expect.objectContaining({
        previousState: 'PENDING',
        currentState: 'IN_PROGRESS',
        transition: 'PENDING → IN_PROGRESS'
      })
    );
  });
});
```

---

## VI. Integration with Enforcement Pipeline

### Step 1: Mandatory Search

**MANDATORY:** During Step 1, search for:

- State machine documentation for the component
- Existing state transition implementations
- State validation patterns
- State recovery mechanisms

### Step 2: Pattern Analysis

**MANDATORY:** During Step 2, verify:

- State machine pattern matches existing implementations
- All valid transitions are documented
- Illegal transitions are explicitly defined
- Recovery paths are implemented

### Step 3: Rule Compliance Check

**MANDATORY:** During Step 3, verify:

- State machine is explicitly defined
- State transitions are logged
- Invalid transitions are handled
- Recovery paths are implemented

### Step 5: Post-Implementation Audit

**MANDATORY:** During Step 5, verify:

- State machine documentation is complete
- All state transitions are logged
- Illegal transition tests exist
- State recovery tests exist
- State validation functions work correctly

---

## Violations

**HARD STOP violations:**
- Modifying state logic without searching for state machine documentation
- Missing state machine definition
- Missing state transition logging
- Missing illegal transition tests
- Missing state recovery mechanisms

**Must fix before proceeding:**
- Incomplete state machine documentation
- Missing state validation functions
- Missing recovery paths for invalid states
- Incomplete state transition tests

---

**Last Updated:** 2025-12-05  
**Status:** Active Enforcement  
**Priority:** CRITICAL - Must be followed for every stateful component

