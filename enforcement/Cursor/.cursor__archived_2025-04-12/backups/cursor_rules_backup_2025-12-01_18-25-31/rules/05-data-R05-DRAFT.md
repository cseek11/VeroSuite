# R05: State Machine Enforcement — Step 5 Procedures (DRAFT)

**Status:** DRAFT - Awaiting Human Review  
**Created:** 2025-12-04  
**Rule:** R05 - State Machine Enforcement  
**Priority:** HIGH (Tier 2 - OVERRIDE)  
**MAD Tier:** 2 (OVERRIDE REQUIRED - Needs justification)

---

## Purpose

R05 ensures that stateful business entities have documented state machines, enforce legal transitions in code, reject illegal transitions, and emit audit logs on state changes.

**Key Requirements:**
- State transitions must be documented in `docs/state-machines/[entity]-state-machine.md`
- Illegal transitions must be rejected in service layer
- Audit logs must be emitted on transitions
- State machine docs must match code implementation

---

## Step 5: Post-Implementation Audit for State Machine Enforcement

### R05: State Machine Enforcement — Audit Procedures

**For code changes affecting stateful entities, state transitions, or state machine logic:**

#### State Machine Documentation

- [ ] **MANDATORY:** Verify state machine documentation exists for stateful entity (`docs/state-machines/[entity]-state-machine.md`)
- [ ] **MANDATORY:** Verify documentation includes all valid states (with descriptions)
- [ ] **MANDATORY:** Verify documentation includes legal transitions (from → to with conditions)
- [ ] **MANDATORY:** Verify documentation includes illegal transitions (explicitly listed)
- [ ] **MANDATORY:** Verify documentation includes side effects (events, notifications, audit logs)
- [ ] **MANDATORY:** Verify documentation matches code implementation (states match enum/type, transitions match validation logic)

#### State Transition Validation

- [ ] **MANDATORY:** Verify transition validation function exists in service layer
- [ ] **MANDATORY:** Verify validation checks current state before allowing transition
- [ ] **MANDATORY:** Verify validation rejects illegal transitions with explicit error
- [ ] **MANDATORY:** Verify validation checks preconditions (e.g., technician assigned, date set)
- [ ] **MANDATORY:** Verify validation returns user-friendly error messages (no internal state values)

#### Illegal Transition Prevention

- [ ] **MANDATORY:** Verify terminal states cannot transition (e.g., COMPLETED → any state)
- [ ] **MANDATORY:** Verify skipped states are prevented (e.g., DRAFT → COMPLETED)
- [ ] **MANDATORY:** Verify backward transitions are explicitly allowed (if documented)
- [ ] **MANDATORY:** Verify all illegal transitions are tested (unit tests)

#### Audit Logging

- [ ] **MANDATORY:** Verify audit log emitted on every state transition
- [ ] **MANDATORY:** Verify audit log includes: entity, entityId, action ('state_transition'), oldState, newState, userId, timestamp
- [ ] **MANDATORY:** Verify audit log includes metadata (reason, related entities, etc.)
- [ ] **MANDATORY:** Verify audit logs are structured (JSON format, traceId included)

#### Code-Documentation Synchronization

- [ ] **MANDATORY:** Verify enum/type values match documentation (case-sensitive)
- [ ] **MANDATORY:** Verify transition logic matches documented legal transitions
- [ ] **MANDATORY:** Verify illegal transitions in code match documented illegal transitions
- [ ] **MANDATORY:** Verify side effects in code match documented side effects

#### Automated Checks

```bash
# Run state machine enforcement checker
python .cursor/scripts/check-state-machines.py --entity <EntityName>

# Check all stateful entities
python .cursor/scripts/check-state-machines.py --all

# Expected: No violations found
```

#### OPA Policy

- **Policy:** `services/opa/policies/data-integrity.rego` (R05 section)
- **Enforcement:** OVERRIDE (Tier 2 MAD) - Requires justification
- **Tests:** `services/opa/tests/data_integrity_r05_test.rego`

#### Manual Verification (When Needed)

1. **Review State Machine Documentation** - Verify documentation exists and is complete
2. **Verify Transition Validation** - Test legal and illegal transitions in code
3. **Check Audit Logging** - Verify audit logs are emitted on transitions
4. **Validate Code-Documentation Sync** - Compare code implementation with documentation

**Example State Machine Documentation:**

```markdown
# WorkOrder State Machine

**Version:** 1.0  
**Last Updated:** 2025-12-04  
**Entity:** WorkOrder  
**Status Field:** `status`  
**Type:** `enum WorkOrderStatus`

## Valid States

| State | Value | Description | Terminal | User-Visible Label |
|-------|-------|-------------|----------|-------------------|
| DRAFT | `draft` | Work order created but not scheduled | No | "Draft" |
| SCHEDULED | `scheduled` | Assigned to technician with date | No | "Scheduled" |
| IN_PROGRESS | `in_progress` | Technician started work | No | "In Progress" |
| COMPLETED | `completed` | Work finished successfully | Yes | "Completed" |
| CANCELLED | `cancelled` | Work order cancelled | Yes | "Cancelled" |

## Legal Transitions

| From State | To State | Condition | Side Effects |
|------------|----------|-----------|-------------|
| DRAFT | SCHEDULED | technicianId assigned, scheduledDate set | Emit `workorder.scheduled`, notify technician, audit log |
| DRAFT | CANCELLED | notes provided | Emit `workorder.cancelled`, audit log |
| SCHEDULED | IN_PROGRESS | technician starts work | Emit `workorder.started`, start time tracking, audit log |
| SCHEDULED | CANCELLED | notes provided | Emit `workorder.cancelled`, audit log |
| IN_PROGRESS | COMPLETED | work finished | Emit `workorder.completed`, stop time tracking, audit log |
| IN_PROGRESS | CANCELLED | notes provided | Emit `workorder.cancelled`, stop time tracking, audit log |
| CANCELLED | DRAFT | reactivation requested, notes provided | Emit `workorder.reactivated`, audit log |

## Illegal Transitions

- **COMPLETED → any state:** Terminal state - cannot modify completed work order
- **CANCELLED → any state (except DRAFT):** Terminal state - cannot resume cancelled work
- **DRAFT → COMPLETED:** Must be scheduled and started first
- **Any transition not listed above:** Not allowed

## Side Effects

### On SCHEDULED
- Emit `workorder.scheduled` event
- Send notification to assigned technician
- Create audit log entry
- Update technician's calendar

### On IN_PROGRESS
- Emit `workorder.started` event
- Start time tracking
- Create audit log entry

### On COMPLETED
- Emit `workorder.completed` event
- Stop time tracking
- Calculate final costs
- Create audit log entry

### On CANCELLED
- Emit `workorder.cancelled` event
- Stop time tracking (if in progress)
- Create audit log entry
```

**Example Transition Validation:**

```typescript
// apps/api/src/work-orders/work-orders.service.ts

async transitionStatus(
  id: string,
  newStatus: WorkOrderStatus,
  userId: string,
  reason?: string
): Promise<WorkOrder> {
  const workOrder = await this.findOne(id);
  
  // Validate transition
  if (!this.isValidTransition(workOrder.status, newStatus)) {
    throw new BadRequestException(
      `Cannot transition work order from ${workOrder.status} to ${newStatus}. ` +
      `See docs/state-machines/workorder-state-machine.md for legal transitions.`
    );
  }
  
  // Validate preconditions
  if (newStatus === WorkOrderStatus.SCHEDULED) {
    if (!workOrder.technicianId || !workOrder.scheduledDate) {
      throw new BadRequestException(
        'Cannot schedule work order: technician and scheduled date required'
      );
    }
  }
  
  // Perform transition
  const updated = await this.prisma.workOrder.update({
    where: { id },
    data: { status: newStatus }
  });
  
  // Emit audit log
  await this.auditService.log({
    entity: 'WorkOrder',
    entityId: id,
    action: 'state_transition',
    oldState: workOrder.status,
    newState: newStatus,
    userId,
    timestamp: new Date(),
    metadata: {
      reason,
      technicianId: workOrder.technicianId,
      traceId: this.requestContext.getTraceId()
    }
  });
  
  // Emit side effects
  await this.emitStateTransitionEvent(workOrder.status, newStatus, updated);
  
  return updated;
}

private isValidTransition(from: WorkOrderStatus, to: WorkOrderStatus): boolean {
  const legalTransitions: Record<WorkOrderStatus, WorkOrderStatus[]> = {
    [WorkOrderStatus.DRAFT]: [
      WorkOrderStatus.SCHEDULED,
      WorkOrderStatus.CANCELLED
    ],
    [WorkOrderStatus.SCHEDULED]: [
      WorkOrderStatus.IN_PROGRESS,
      WorkOrderStatus.DRAFT,
      WorkOrderStatus.CANCELLED
    ],
    [WorkOrderStatus.IN_PROGRESS]: [
      WorkOrderStatus.COMPLETED,
      WorkOrderStatus.SCHEDULED,
      WorkOrderStatus.CANCELLED
    ],
    [WorkOrderStatus.COMPLETED]: [], // Terminal state
    [WorkOrderStatus.CANCELLED]: [WorkOrderStatus.DRAFT] // Reactivation only
  };
  
  return legalTransitions[from]?.includes(to) ?? false;
}
```

**Example Illegal Transition Test:**

```typescript
// apps/api/test/unit/work-orders/work-orders.service.test.ts

describe('WorkOrderService - Illegal Transitions', () => {
  it('should reject COMPLETED → IN_PROGRESS transition', async () => {
    const workOrder = await createWorkOrder({ status: WorkOrderStatus.COMPLETED });
    
    await expect(
      service.transitionStatus(workOrder.id, WorkOrderStatus.IN_PROGRESS, userId)
    ).rejects.toThrow(BadRequestException);
    
    await expect(
      service.transitionStatus(workOrder.id, WorkOrderStatus.IN_PROGRESS, userId)
    ).rejects.toThrow('Cannot transition work order from completed to in_progress');
  });
  
  it('should reject DRAFT → COMPLETED transition', async () => {
    const workOrder = await createWorkOrder({ status: WorkOrderStatus.DRAFT });
    
    await expect(
      service.transitionStatus(workOrder.id, WorkOrderStatus.COMPLETED, userId)
    ).rejects.toThrow('Cannot transition work order from draft to completed');
  });
});
```

---

**Last Updated:** 2025-12-04  
**Maintained By:** Data Team  
**Review Frequency:** Quarterly or when state machine requirements change





