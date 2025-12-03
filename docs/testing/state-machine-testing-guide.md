# State Machine Testing Guide

**Last Updated:** 2025-11-23  
**Purpose:** Guide for testing state machines and state transitions  
**Related Rule:** R05 - State Machine Enforcement

---

## Overview

This guide provides comprehensive testing strategies for state machines in VeroField. State machines are critical business logic that must be thoroughly tested to prevent illegal state transitions, data corruption, and business rule violations.

---

## Test Coverage Requirements

### MANDATORY Test Coverage

For every stateful entity (WorkOrder, Invoice, Payment, etc.), you MUST test:

1. **Legal Transitions** - All valid state transitions work correctly
2. **Illegal Transitions** - Invalid state transitions are rejected
3. **Terminal States** - Terminal states cannot transition further
4. **Preconditions** - Transitions with preconditions are validated
5. **Side Effects** - Side effects (events, notifications, audit logs) are triggered
6. **Audit Logging** - All transitions emit audit logs

---

## Test Structure

### Unit Tests (Service Layer)

**File:** `apps/api/test/unit/[entity]/[entity].service.test.ts`

```typescript
describe('[Entity]Service - State Transitions', () => {
  describe('Legal Transitions', () => {
    // Test all legal transitions
  });
  
  describe('Illegal Transitions', () => {
    // Test all illegal transitions are rejected
  });
  
  describe('Preconditions', () => {
    // Test precondition validation
  });
  
  describe('Side Effects', () => {
    // Test events, notifications, audit logs
  });
});
```

---

## Example: WorkOrder State Machine Tests

### Test 1: Legal Transitions

```typescript
describe('WorkOrderService - Legal Transitions', () => {
  it('should transition PENDING → IN_PROGRESS', async () => {
    const workOrder = await createWorkOrder({ status: WorkOrderStatus.PENDING });
    
    const result = await service.transitionStatus(
      workOrder.id,
      WorkOrderStatus.IN_PROGRESS,
      userId
    );
    
    expect(result.status).toBe(WorkOrderStatus.IN_PROGRESS);
  });
  
  it('should transition IN_PROGRESS → COMPLETED', async () => {
    const workOrder = await createWorkOrder({ status: WorkOrderStatus.IN_PROGRESS });
    
    const result = await service.transitionStatus(
      workOrder.id,
      WorkOrderStatus.COMPLETED,
      userId
    );
    
    expect(result.status).toBe(WorkOrderStatus.COMPLETED);
  });
  
  it('should transition PENDING → CANCELED', async () => {
    const workOrder = await createWorkOrder({ status: WorkOrderStatus.PENDING });
    
    const result = await service.transitionStatus(
      workOrder.id,
      WorkOrderStatus.CANCELED,
      userId,
      'Customer requested cancellation'
    );
    
    expect(result.status).toBe(WorkOrderStatus.CANCELED);
  });
});
```

### Test 2: Illegal Transitions

```typescript
describe('WorkOrderService - Illegal Transitions', () => {
  it('should reject COMPLETED → IN_PROGRESS (terminal state)', async () => {
    const workOrder = await createWorkOrder({ status: WorkOrderStatus.COMPLETED });
    
    await expect(
      service.transitionStatus(workOrder.id, WorkOrderStatus.IN_PROGRESS, userId)
    ).rejects.toThrow(BadRequestException);
    
    await expect(
      service.transitionStatus(workOrder.id, WorkOrderStatus.IN_PROGRESS, userId)
    ).rejects.toThrow('Cannot transition work order from completed to in_progress');
  });
  
  it('should reject PENDING → COMPLETED (skipped state)', async () => {
    const workOrder = await createWorkOrder({ status: WorkOrderStatus.PENDING });
    
    await expect(
      service.transitionStatus(workOrder.id, WorkOrderStatus.COMPLETED, userId)
    ).rejects.toThrow('Cannot transition work order from pending to completed');
  });
  
  it('should reject CANCELED → IN_PROGRESS (terminal state)', async () => {
    const workOrder = await createWorkOrder({ status: WorkOrderStatus.CANCELED });
    
    await expect(
      service.transitionStatus(workOrder.id, WorkOrderStatus.IN_PROGRESS, userId)
    ).rejects.toThrow('Cannot transition work order from canceled to in_progress');
  });
});
```

### Test 3: Preconditions

```typescript
describe('WorkOrderService - Preconditions', () => {
  it('should reject PENDING → IN_PROGRESS if technician not assigned', async () => {
    const workOrder = await createWorkOrder({
      status: WorkOrderStatus.PENDING,
      technicianId: null
    });
    
    await expect(
      service.transitionStatus(workOrder.id, WorkOrderStatus.IN_PROGRESS, userId)
    ).rejects.toThrow('Cannot start work order: technician must be assigned');
  });
  
  it('should reject PENDING → IN_PROGRESS if scheduled date not set', async () => {
    const workOrder = await createWorkOrder({
      status: WorkOrderStatus.PENDING,
      scheduledDate: null
    });
    
    await expect(
      service.transitionStatus(workOrder.id, WorkOrderStatus.IN_PROGRESS, userId)
    ).rejects.toThrow('Cannot start work order: scheduled date required');
  });
});
```

### Test 4: Side Effects

```typescript
describe('WorkOrderService - Side Effects', () => {
  it('should emit workorder.started event on PENDING → IN_PROGRESS', async () => {
    const workOrder = await createWorkOrder({ status: WorkOrderStatus.PENDING });
    const eventSpy = jest.spyOn(eventEmitter, 'emit');
    
    await service.transitionStatus(workOrder.id, WorkOrderStatus.IN_PROGRESS, userId);
    
    expect(eventSpy).toHaveBeenCalledWith('workorder.started', expect.objectContaining({
      id: workOrder.id,
      status: WorkOrderStatus.IN_PROGRESS
    }));
  });
  
  it('should send notification to technician on PENDING → IN_PROGRESS', async () => {
    const workOrder = await createWorkOrder({ status: WorkOrderStatus.PENDING });
    const notificationSpy = jest.spyOn(notificationService, 'send');
    
    await service.transitionStatus(workOrder.id, WorkOrderStatus.IN_PROGRESS, userId);
    
    expect(notificationSpy).toHaveBeenCalledWith(
      workOrder.technicianId,
      expect.objectContaining({
        type: 'WORK_ORDER_STARTED',
        workOrderId: workOrder.id
      })
    );
  });
});
```

### Test 5: Audit Logging

```typescript
describe('WorkOrderService - Audit Logging', () => {
  it('should emit audit log on state transition', async () => {
    const workOrder = await createWorkOrder({ status: WorkOrderStatus.PENDING });
    const auditSpy = jest.spyOn(auditService, 'log');
    
    await service.transitionStatus(
      workOrder.id,
      WorkOrderStatus.IN_PROGRESS,
      userId,
      'Starting work'
    );
    
    expect(auditSpy).toHaveBeenCalledWith({
      entity: 'WorkOrder',
      entityId: workOrder.id,
      action: 'state_transition',
      oldState: WorkOrderStatus.PENDING,
      newState: WorkOrderStatus.IN_PROGRESS,
      userId: userId,
      timestamp: expect.any(Date),
      metadata: expect.objectContaining({
        reason: 'Starting work',
        traceId: expect.any(String)
      })
    });
  });
  
  it('should include traceId in audit log', async () => {
    const workOrder = await createWorkOrder({ status: WorkOrderStatus.PENDING });
    const auditSpy = jest.spyOn(auditService, 'log');
    
    await service.transitionStatus(workOrder.id, WorkOrderStatus.IN_PROGRESS, userId);
    
    const auditCall = auditSpy.mock.calls[0][0];
    expect(auditCall.metadata.traceId).toBeDefined();
    expect(auditCall.metadata.traceId).toMatch(/^[0-9a-f-]+$/);
  });
});
```

---

## Integration Tests

**File:** `apps/api/test/integration/[entity]-workflow.test.ts`

```typescript
describe('[Entity] Workflow Integration Tests', () => {
  it('should enforce state machine transitions end-to-end', async () => {
    // Create entity
    const response = await request(app.getHttpServer())
      .post('/api/work-orders')
      .set('Authorization', `Bearer ${authToken}`)
      .send(workOrderData)
      .expect(201);
    
    const workOrderId = response.body.id;
    
    // Valid transition: PENDING → IN_PROGRESS
    await request(app.getHttpServer())
      .put(`/api/work-orders/${workOrderId}/status`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({ status: 'in_progress' })
      .expect(200);
    
    // Valid transition: IN_PROGRESS → COMPLETED
    await request(app.getHttpServer())
      .put(`/api/work-orders/${workOrderId}/status`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({ status: 'completed' })
      .expect(200);
    
    // Invalid transition: COMPLETED → IN_PROGRESS (should fail)
    await request(app.getHttpServer())
      .put(`/api/work-orders/${workOrderId}/status`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({ status: 'in_progress' })
      .expect(400);
  });
});
```

---

## E2E Tests (Frontend)

**File:** `frontend/src/test/e2e/[entity]-workflow.e2e.test.ts`

```typescript
test.describe('[Entity] State Transitions', () => {
  test('should enforce valid work order state transitions', async ({ page }) => {
    await page.goto('/work-orders');
    
    // Create work order (PENDING)
    await page.click('[data-testid="create-work-order"]');
    await page.fill('[data-testid="work-order-title"]', 'Test Work Order');
    await page.click('[data-testid="save-work-order"]');
    
    // Transition to IN_PROGRESS
    await page.click('[data-testid="start-work-order"]');
    await expect(page.locator('[data-testid="work-order-status"]')).toHaveText('In Progress');
    
    // Transition to COMPLETED
    await page.click('[data-testid="complete-work-order"]');
    await expect(page.locator('[data-testid="work-order-status"]')).toHaveText('Completed');
    
    // Verify cannot transition from COMPLETED (terminal state)
    await expect(page.locator('[data-testid="start-work-order"]')).toBeDisabled();
  });
  
  test('should show error for invalid state transition', async ({ page }) => {
    await page.goto('/work-orders');
    
    // Attempt invalid transition (PENDING → COMPLETED)
    await page.click('[data-testid="work-order-row"]');
    await page.click('[data-testid="complete-work-order"]');
    
    await expect(page.locator('[data-testid="error-message"]')).toContainText('Invalid status transition');
  });
});
```

---

## Test Coverage Checklist

For each stateful entity, verify:

- [ ] All legal transitions have unit tests
- [ ] All illegal transitions have unit tests (rejection)
- [ ] All terminal states are tested (cannot transition)
- [ ] All preconditions are tested (validation)
- [ ] All side effects are tested (events, notifications)
- [ ] Audit logging is tested (all transitions)
- [ ] Integration tests cover end-to-end workflow
- [ ] E2E tests verify UI state transitions
- [ ] Error messages are user-friendly (no internal state values)
- [ ] Tests reference state machine documentation

---

## Common Patterns

### Pattern 1: Test All Legal Transitions

```typescript
const legalTransitions = [
  { from: WorkOrderStatus.PENDING, to: WorkOrderStatus.IN_PROGRESS },
  { from: WorkOrderStatus.IN_PROGRESS, to: WorkOrderStatus.COMPLETED },
  { from: WorkOrderStatus.PENDING, to: WorkOrderStatus.CANCELED },
  { from: WorkOrderStatus.IN_PROGRESS, to: WorkOrderStatus.CANCELED },
];

legalTransitions.forEach(({ from, to }) => {
  it(`should transition ${from} → ${to}`, async () => {
    const entity = await createEntity({ status: from });
    const result = await service.transitionStatus(entity.id, to, userId);
    expect(result.status).toBe(to);
  });
});
```

### Pattern 2: Test All Illegal Transitions

```typescript
const illegalTransitions = [
  { from: WorkOrderStatus.COMPLETED, to: WorkOrderStatus.IN_PROGRESS, reason: 'terminal state' },
  { from: WorkOrderStatus.COMPLETED, to: WorkOrderStatus.PENDING, reason: 'terminal state' },
  { from: WorkOrderStatus.PENDING, to: WorkOrderStatus.COMPLETED, reason: 'skipped state' },
];

illegalTransitions.forEach(({ from, to, reason }) => {
  it(`should reject ${from} → ${to} (${reason})`, async () => {
    const entity = await createEntity({ status: from });
    await expect(
      service.transitionStatus(entity.id, to, userId)
    ).rejects.toThrow(BadRequestException);
  });
});
```

---

## Debugging State Machine Issues

### Issue: Transition Rejected Unexpectedly

**Symptoms:** Legal transition is rejected with error

**Debug Steps:**
1. Check state machine documentation (`docs/state-machines/[entity]-state-machine.md`)
2. Verify transition is listed as legal
3. Check preconditions (e.g., technician assigned, date set)
4. Verify current state matches expected state
5. Check validation function logic

### Issue: Illegal Transition Allowed

**Symptoms:** Invalid transition succeeds when it should fail

**Debug Steps:**
1. Check validation function exists
2. Verify validation function is called before transition
3. Check legal transitions map includes all valid transitions
4. Verify illegal transitions are not in legal transitions map
5. Add test for this illegal transition

### Issue: Audit Log Not Emitted

**Symptoms:** State transition succeeds but no audit log

**Debug Steps:**
1. Check audit service is injected
2. Verify audit log call exists after transition
3. Check audit log includes all required fields
4. Verify traceId is propagated
5. Check audit service is not mocked in test

---

## Best Practices

1. **Test Documentation First** - Read state machine documentation before writing tests
2. **Test All Transitions** - Cover 100% of legal and illegal transitions
3. **Test Preconditions** - Verify precondition validation works
4. **Test Side Effects** - Verify events, notifications, audit logs are emitted
5. **Use Descriptive Names** - Test names should clearly indicate transition being tested
6. **Reference Documentation** - Include link to state machine docs in test comments
7. **Test Error Messages** - Verify error messages are user-friendly
8. **Test Terminal States** - Verify terminal states cannot transition
9. **Test Audit Logging** - Verify all transitions emit audit logs
10. **Keep Tests Fast** - Use mocks for external services

---

## Related Documentation

- **State Machine Template:** `docs/state-machines/README.md`
- **Example State Machine:** `docs/state-machines/workorder-state-machine.md`
- **Testing Requirements:** `docs/testing/TEST_REQUIREMENTS_REFERENCE.md`
- **R05 Rule:** `.cursor/rules/05-data.mdc` (State Machine Enforcement)

---

**Last Updated:** 2025-11-23  
**Maintained By:** Data Team  
**Review Frequency:** Quarterly or when state machine testing requirements change





